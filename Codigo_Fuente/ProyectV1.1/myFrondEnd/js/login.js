document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const API_URL = 'http://ec2-3-15-222-198.us-east-2.compute.amazonaws.com:3000';
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            // Store all necessary user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userId', data.id);
            localStorage.setItem('roleId', data.role_id); // Add role_id storage

            Swal.fire({
                title: '¡Bienvenido!',
                text: `Has iniciado sesión como ${data.role}`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                // Redirect with role_id as query parameter
                window.location.href = `../index/index.html?role_id=${data.role_id}`;
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: data.message,
                icon: 'error',
                confirmButtonText: 'Intentar de nuevo'
            });
        }
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al conectarse con el servidor',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo'
        });
    }
});
async function handleCredentialResponse(response) {
    try {
        // Decodificar el payload del token de Google
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        const API_URL = 'http://ec2-3-15-222-198.us-east-2.compute.amazonaws.com:3000';
        
        // Enviar los datos de Google al backend
        const loginResponse = await fetch(`${API_URL}/api/auth/google-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: payload.email,
                google_id: payload.sub,
                google_token: response.credential
            })
        });

        const loginData = await loginResponse.json();

        if (loginData.success) {
            // Inicio de sesión exitoso
            localStorage.setItem('token', loginData.token);
            localStorage.setItem('userRole', loginData.role);
            localStorage.setItem('userId', loginData.id);

            await Swal.fire({
                title: '¡Bienvenido!',
                text: `Has iniciado sesión como ${loginData.role}`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });

            // Redirigir a la página principal
            window.location.href = `../index/index.html?role_id=${loginData.role_id}`;
        } else if (loginData.isNewUser) {
            // Usuario nuevo detectado
            await Swal.fire({
                title: 'Usuario Nuevo',
                text: loginData.message || 'Parece que eres un usuario nuevo. Completa tu registro.',
                icon: 'info',
                confirmButtonText: 'Completar Registro'
            });

            // Guardar datos en localStorage para el registro
            localStorage.setItem('googleData', JSON.stringify({
                email: loginData.email,
                first_name: loginData.firstName,
                last_name: loginData.lastName,
                google_id: payload.sub
            }));

            // Redirigir al formulario de registro
            const queryParams = new URLSearchParams({
                source: 'google'
            }).toString();

            window.location.href = `register.html?${queryParams}`;
        } else {
            // Otro error no especificado
            throw new Error(loginData.message || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('Error:', error);
        await Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al iniciar sesión con Google',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}
