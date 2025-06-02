const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export async function loginRequest(credentials) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(credentials)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Error de conexión' }));
      throw new Error(errorData.message || 'Login fallido');
    }

    return await res.json();
  } catch (error) {
    console.error('Error en loginRequest:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('No se puede conectar al servidor. Verifica que el backend esté ejecutándose.');
    }
    throw error;
  }
}

export async function registerRequest(userData) {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(userData)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Error de conexión' }));
      throw new Error(errorData.message || 'Registro fallido');
    }

    return await res.json();
  } catch (error) {
    console.error('Error en registerRequest:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('No se puede conectar al servidor. Verifica que el backend esté ejecutándose.');
    }
    throw error;
  }
}

export async function logoutRequest() {
  try {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Error de conexión' }));
      throw new Error(errorData.message || 'Logout fallido');
    }

    return await res.json();
  } catch (error) {
    console.error('Error en logoutRequest:', error);
    throw error;
  }
}

export async function resetPasswordRequest(email) {
  try {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Error de conexión' }));
      throw new Error(errorData.message || 'Solicitud de reseteo fallida');
    }

    return await res.json();
  } catch (error) {
    console.error('Error en resetPasswordRequest:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('No se puede conectar al servidor. Verifica que el backend esté ejecutándose.');
    }
    throw error;
  }
}

// Función simplificada para verificar token usando el endpoint de perfil
export async function verifyTokenRequest() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    const res = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error en verifyTokenRequest:', error);
    return null;
  }
}
