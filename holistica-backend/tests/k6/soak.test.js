// K6 Load Testing - Soak Test (Endurance) Scenario
import http from 'k6/http';
import { check, sleep } from 'k6';
import { textSummary, jUnit } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';


export let options = {
    scenarios: {
        soak_test: {
            executor: 'constant-vus',
            vus: 40, // Reducir carga para hacer más sostenible
            duration: '20m', // Reducir duración para testing
        }
    },
    thresholds: {
        'http_req_duration{expected_response:true}': ['p(95)<1000', 'p(99)<1500'], // Ajustado al contexto: soak test más permisivo para larga duración
        'http_req_failed': ['rate<0.02'], // 2% error rate - más estricto para consistencia
        'checks': ['rate>0.97'], // 97% success rate - ligeramente más permisivo para larga duración
    },
    summaryTrendStats: ['avg', 'min', 'max', 'p(95)', 'p(99)'],
};

const BASE_URL = 'http://192.168.18.8:3000';
const HEADERS = { 'Content-Type': 'application/json' };

// Generate unique user data for each iteration
function generateUniqueUser() {
    const timestamp = Date.now();
    const vuId = __VU;
    const iteration = __ITER;
    return {
        name: `TestUser${vuId}`,
        lastname: `LastName${iteration}`,
        email: `test.user.${vuId}.${iteration}.${timestamp}@example.com`,
        phone: `123456${String(vuId).padStart(4, '0')}`,
        dni: `${timestamp}${vuId}`.slice(-8),
        address: `Test Address ${vuId}-${iteration}`,
        password: 'testpassword123'
    };
}

// Keep track of authentication tokens to avoid re-login every iteration
let authToken = null;
let tokenExpiry = 0;

export default function () {
    const now = Date.now();
    let token = null;
    let userData = null;
    
    // Health check to monitor system stability
    let healthRes = http.get(`${BASE_URL}/health`);
    check(healthRes, {
        'system healthy': (r) => r.status === 200,
        'health check performance stable': (r) => r.timings.duration < 200,
    });

    // Refresh token periodically or when needed
    if (!authToken || now > tokenExpiry || __ITER % 100 === 0) {
        console.log(`VU ${__VU} Iteration ${__ITER}: Refreshing authentication token...`);
        
        const newUser = generateUniqueUser();
        
        // Register user
        let registerRes = http.post(
            `${BASE_URL}/api/auth/register`, 
            JSON.stringify(newUser), 
            { headers: HEADERS, timeout: '15s' }
        );
        
        const registerSuccess = check(registerRes, {
            'register status acceptable': (r) => r.status === 201 || r.status === 400,
            'register response time': (r) => r.timings.duration < 3000,
        });

        let loginAttempted = false;

        // First try: if registration was successful
        if (registerSuccess && registerRes.status === 201) {
            sleep(0.3); // Give more time for database consistency in soak test
            
            let loginRes = http.post(
                `${BASE_URL}/api/auth/login`, 
                JSON.stringify({ 
                    email: newUser.email, 
                    password: newUser.password 
                }), 
                { headers: HEADERS, timeout: '15s' }
            );
            
            loginAttempted = true;
            
            const loginSuccess = check(loginRes, {
                'login successful': (r) => r.status === 200,
                'login response time': (r) => r.timings.duration < 3000,
            });

            if (loginSuccess && loginRes.status === 200) {
                try {
                    const responseBody = loginRes.body;
                    const loginData = loginRes.json();
                    
                    if (loginData && loginData.token) {
                        authToken = loginData.token;
                        userData = loginData.user;
                        tokenExpiry = now + (22 * 60 * 60 * 1000); // 22 hours from now
                        
                        console.log(`VU ${__VU} Token refreshed successfully, length: ${authToken.length}`);
                        
                        check(loginRes, {
                            'token received': () => authToken && typeof authToken === 'string' && authToken.length > 0,
                            'user data received': () => userData && userData.id,
                        });
                    } else {
                        console.log(`VU ${__VU} Login response missing token field`);
                    }
                } catch (e) {
                    console.log(`VU ${__VU} Error parsing login response: ${e.message}`);
                }
            } else {
                console.log(`VU ${__VU} Login failed with status: ${loginRes.status}, Response: ${loginRes.body}`);
            }
        }
        
        // Second try: if registration failed (user might exist) and we haven't tried login yet
        if (!loginAttempted && registerRes.status === 400) {
            let loginRes = http.post(
                `${BASE_URL}/api/auth/login`, 
                JSON.stringify({ 
                    email: newUser.email, 
                    password: newUser.password 
                }), 
                { headers: HEADERS, timeout: '15s' }
            );
            
            if (loginRes.status === 200) {
                try {
                    const loginData = loginRes.json();
                    if (loginData && loginData.token) {
                        authToken = loginData.token;
                        userData = loginData.user;
                        tokenExpiry = now + (22 * 60 * 60 * 1000);
                        console.log(`VU ${__VU} Fallback login successful, token length: ${authToken.length}`);
                    }
                } catch (e) {
                    console.log(`VU ${__VU} Error parsing fallback login response: ${e.message}`);
                }
            }
        }
    }

    // Use current token for this iteration
    token = authToken;

    // Database health check occasionally
    if (__VU % 10 === 0) { // Only every 10th VU checks DB health
        let dbHealthRes = http.get(`${BASE_URL}/health/db`, { timeout: '10s' });
        check(dbHealthRes, {
            'database connection stable': (r) => r.status === 200,
        });
    }

    // Core functionality tests
    let coursesRes = http.get(`${BASE_URL}/api/courses`, { timeout: '8s' });
    check(coursesRes, {
        'courses endpoint stable': (r) => r.status === 200,
        'courses performance consistent': (r) => r.timings.duration < 1000,
    });

    // Test specific course
    const courseId = (__ITER % 5) + 1; // Cycle through course IDs 1-5
    let courseRes = http.get(`${BASE_URL}/api/courses/${courseId}`, { timeout: '8s' });
    check(courseRes, {
        'course details stable': (r) => r.status === 200 || r.status === 404,
        'course details performance': (r) => r.timings.duration < 1000,
    });

    // Authenticated operations
    if (token && typeof token === 'string' && token.length > 0) {
        const authHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // User profile - test session persistence
        let profileRes = http.get(`${BASE_URL}/api/users/me`, { 
            headers: authHeaders,
            timeout: '10s' 
        });
        
        check(profileRes, {
            'profile access stable': (r) => r.status === 200,
            'authentication persists': (r) => r.status !== 401,
            'profile response time stable': (r) => r.timings.duration < 1000,
        });
        
        if (profileRes.status !== 200) {
            console.log(`VU ${__VU} Profile request failed: ${profileRes.status} - ${profileRes.body}`);
        }

        // Rotate through different authenticated endpoints
        const endpoints = [
            '/api/enrollments/my-enrollments',
            '/api/payments/history'
        ];
        
        const endpoint = endpoints[__ITER % endpoints.length];
        let endpointRes = http.get(`${BASE_URL}${endpoint}`, { 
            headers: authHeaders,
            timeout: '10s' 
        });
        
        check(endpointRes, {
            [`${endpoint} endpoint stable`]: (r) => r.status === 200,
            [`${endpoint} performance consistent`]: (r) => r.timings.duration < 1000,
        });

        // Occasionally test admin endpoint
        if (__ITER % 5 === 0) {
            let usersRes = http.get(`${BASE_URL}/api/users`, { 
                headers: authHeaders,
                timeout: '10s' 
            });
            check(usersRes, {
                'admin endpoint handles requests': (r) => r.status === 200 || r.status === 403,
                'admin endpoint response time': (r) => r.timings.duration < 1000,
            });
        }
    } else {
        console.log(`VU ${__VU} Iteration ${__ITER}: No valid token available for authenticated requests (token: ${token ? 'exists but invalid' : 'null/undefined'})`);
    }

    // Simulate realistic user behavior with variable sleep
    const sleepTime = 2 + Math.random() * 3; // 2-5 seconds for soak test
    sleep(sleepTime);
}

export function handleSummary(data) {
  return {
    '/results/soak-test-summary.json': JSON.stringify(data, null, 2),
    '/results/soak-test-summary.html': htmlReport(data),
    '/results/soak-test-junit.xml': jUnit(data, { name: 'soak-test' }),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
