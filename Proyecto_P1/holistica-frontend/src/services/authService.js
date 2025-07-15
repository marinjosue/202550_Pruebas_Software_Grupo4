import ApiClient from '../utils/apiClient.js';

class AuthService extends ApiClient {
  constructor() {
    super('auth');
  }

  async loginRequest(credentials) {
    return this.post('/login', credentials);
  }

  async registerRequest(userData) {
    return this.post('/register', userData);
  }

  async logoutRequest() {
    return this.post('/logout');
  }

  async verifyTokenRequest() {
    return this.get('/verify');
  }

  async forgotPasswordRequest(email) {
    return this.post('/forgot-password', { email });
  }

  async resetPasswordRequest(token, newPassword) {
    return this.post('/reset-password', { token, newPassword });
  }

  async updateProfileRequest(profileData) {
    return this.put('/profile', profileData);
  }

  async changePasswordRequest(passwordData) {
    return this.put('/change-password', passwordData);
  }
}

const authService = new AuthService();

// Export individual functions for compatibility
export const loginRequest = (credentials) => authService.loginRequest(credentials);
export const registerRequest = (userData) => authService.registerRequest(userData);
export const logoutRequest = () => authService.logoutRequest();
export const verifyTokenRequest = () => authService.verifyTokenRequest();
export const forgotPasswordRequest = (email) => authService.forgotPasswordRequest(email);
export const resetPasswordRequest = (token, newPassword) => authService.resetPasswordRequest(token, newPassword);
export const updateProfileRequest = (profileData) => authService.updateProfileRequest(profileData);
export const changePasswordRequest = (passwordData) => authService.changePasswordRequest(passwordData);

export default authService;
