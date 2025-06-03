import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { loginRequest, registerRequest, logoutRequest, verifyTokenRequest } from '../services/authService';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Verificar si hay token en localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch({ type: 'SET_USER', payload: null });
        return;
      }

      // Verificar si hay usuario guardado en localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          dispatch({ type: 'SET_USER', payload: userData });
          return;
        } catch (error) {
          console.error('Error parsing saved user data:', error);
        }
      }
      
      // Si no hay usuario guardado, intentar obtenerlo del servidor
      const userData = await verifyTokenRequest();
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        dispatch({ type: 'SET_USER', payload: userData });
      } else {
        // Token inválido, limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'SET_USER', payload: null });
      }
    } catch (error) {
      console.log(`Exception while doing something: ${error}`);
      dispatch({ type: 'SET_USER', payload: null });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await loginRequest(credentials);
      
      if (!response) {
        throw new Error('No se recibió respuesta del servidor');
      }
      
      if (response?.token && response?.user) {
        // Guardar token en localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        dispatch({ type: 'SET_USER', payload: response.user });
        return response;
      } 
      
      let errorMsg = 'Credenciales inválidas';
      if (!response.token) {
        errorMsg = 'Token no recibido';
      } else if (!response.user) {
        errorMsg = 'Información de usuario no recibida';
      }
      throw new Error(errorMsg);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await registerRequest(userData);
      
      if (response.token && response.user) {
        // Guardar token en localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        dispatch({ type: 'SET_USER', payload: response.user });
        return response;
      }
      
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
      dispatch({ type: 'LOGOUT' });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
    } catch (error) {
      console.error('Logout error:', error.message);
      // Still clear local state even if server logout fails
      dispatch({ type: 'LOGOUT' });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = useMemo(() => ({
    ...state,
    login,
    register,
    logout,
    clearError,
    checkAuth
  }), [state]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe ser usado dentro de AuthProvider');
  }
  return context;
};
