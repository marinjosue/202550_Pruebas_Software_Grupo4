import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { useAuth } from '../../hooks/useAuth';

import '../../styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();


  const handleLogin = async (e) => {
  e.preventDefault();
  
  if (!email || !password) {
    if (toast.current) {
      toast.current.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Por favor completa todos los campos', 
        life: 3000 
      });
    }
    return;
  }

  setLoading(true);
  try {
    await login({ email, password });
    if (toast.current) {
      toast.current.show({ 
        severity: 'success', 
        summary: 'Bienvenido', 
        detail: 'Sesión iniciada correctamente', 
        life: 2000 
      });
    }
    // Simular validación de datos (2-3 segundos)
    await new Promise(resolve => setTimeout(resolve, 2500));
     // Mostrar mensaje de validación completa
    if (toast.current) {
      toast.current.show({ 
        severity: 'success', 
        summary: 'Bienvenido', 
        detail: 'Datos validados correctamente. Redirigiendo...', 
        life: 1500 
      });
    }
    setTimeout(() => navigate('/'), 2000);
  } catch (error) {
    let errorMessage;
    
    if (error.message.includes('servidor')) {
      errorMessage = 'No se puede conectar al servidor. Verifica tu conexión.';
    } else if (error.message.includes('Credenciales')) {
      errorMessage = 'Email o contraseña incorrectos';
    } else {
      errorMessage = error.message || 'Error desconocido';
    }
    
    if (toast.current) {
      toast.current.show({ 
        severity: 'error', 
        summary: 'Error de Autenticación', 
        detail: errorMessage, 
        life: 4000 
      });
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={`login-container ${loading ? 'login-loading' : ''}`}>
      <Toast ref={toast} />
      
      <Card className="login-card">
        <div className="login-header">
          <div className="login-icon-container">
            <div className="login-icon">
              <i className="pi pi-user text-4xl"></i>
            </div>
          </div>
          <h2 className="auth-title">
            <i className="pi pi-sign-in"></i>
            {' '}Iniciar Sesión
          </h2>
          <p className="login-subtitle">Bienvenido a Holística Center</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="login-field">
            <label htmlFor="email">
              <i className="pi pi-envelope mr-2 text-primary"></i>
              {' '}Correo Electrónico
            </label>
            <InputText 
              id="email" 
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="tu@email.com"
              autoFocus 
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">
              <i className="pi pi-lock mr-2 text-primary"></i>
            {' '} Contraseña
            </label>
            <Password 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="********"
              toggleMask 
              feedback={false}
            />
          </div>

          <div className="login-options">
            <div className="login-remember">
              <Checkbox 
                id="remember" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.checked)} 
              />
              <label htmlFor="remember">
                Recordarme
              </label>
            </div>
            <div className="forgot-password">
              <Button 
                label="¿Olvidaste tu contraseña?"
                icon="pi pi-question-circle"
                className="p-button-link"
                onClick={() => navigate('/')}
              />
            </div>
          </div>

          <Button 
            label="Ingresar" 
            icon="pi pi-sign-in" 
            className="auth-button"
            type="submit"
            loading={loading}
            disabled={loading}
          />
        </form>

        <hr className="login-divider" />

        <div className="login-footer">
          <span className="text-600">¿No tienes cuenta? </span>
          <Link 
            to="/register" 
            className="login-register-link"
          >
            Regístrate aquí
          </Link>
          
          <Button 
            label="Volver al Inicio" 
            icon="pi pi-home" 
            className="login-back-button"
            outlined
            onClick={() => navigate('/')}
          />
        </div>
      </Card>
    </div>
  );
}