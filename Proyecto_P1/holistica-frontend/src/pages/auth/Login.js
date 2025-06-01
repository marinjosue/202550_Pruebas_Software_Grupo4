import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Checkbox } from 'primereact/checkbox';
import { useAuth } from '../../hooks/useAuth';


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
      toast.current.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Por favor completa todos los campos', 
        life: 3000 
      });
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      toast.current.show({ 
        severity: 'success', 
        summary: 'Bienvenido', 
        detail: 'Sesión iniciada correctamente', 
        life: 2000 
      });
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.message.includes('servidor')) {
        errorMessage = 'No se puede conectar al servidor. Verifica tu conexión.';
      } else if (error.message.includes('Credenciales')) {
        errorMessage = 'Email o contraseña incorrectos';
      } else {
        errorMessage = error.message || 'Error desconocido';
      }
      
      toast.current.show({ 
        severity: 'error', 
        summary: 'Error de Autenticación', 
        detail: errorMessage, 
        life: 4000 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex align-items-center justify-content-center p-4" 
         style={{ 
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
           fontFamily: 'Inter, sans-serif'
         }}>
      <Toast ref={toast} />
      
      <Card className="w-full max-w-md shadow-8 border-round-2xl overflow-hidden">
        <div className="text-center p-4" 
             style={{ 
               background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
               color: 'white' 
             }}>
          <div className="flex justify-content-center mb-3">
            <div className="border-circle p-3 bg-white-alpha-20">
              <i className="pi pi-user text-4xl"></i>
            </div>
          </div>
          <h2 className="text-3xl font-bold m-0 mb-2">Iniciar Sesión</h2>
          <p className="text-blue-100 m-0">Bienvenido a Holística Center</p>
        </div>

        <form onSubmit={handleLogin} className="p-4">
          <div className="field mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-700 mb-2">
              <i className="pi pi-envelope mr-2 text-primary"></i>
              Correo Electrónico
            </label>
            <InputText 
              id="email" 
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-3 border-round-lg"
              placeholder="tu@email.com"
              autoFocus 
              style={{ fontSize: '1rem' }}
            />
          </div>

          <div className="field mb-4">
            <label htmlFor="password" className="block text-sm font-semibold text-700 mb-2">
              <i className="pi pi-lock mr-2 text-primary"></i>
              Contraseña
            </label>
            <Password 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full"
              inputClassName="w-full p-3 border-round-lg"
              placeholder="********"
              toggleMask 
              feedback={false}
              style={{ fontSize: '1rem' }}
            />
          </div>

          <div className="flex align-items-center justify-content-between mb-4">
            <div className="flex align-items-center">
              <Checkbox 
                id="remember" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.checked)} 
                className="mr-2"
              />
              <label htmlFor="remember" className="text-sm text-600">
                Recordarme
              </label>
            </div>
            <Link 
              to="/auth/reset-password" 
              className="text-sm text-primary no-underline hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button 
            type="submit"
            label="Iniciar Sesión" 
            icon="pi pi-sign-in" 
            className="w-full p-3 text-lg font-bold border-round-lg"
            style={{ 
              background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
              border: 'none'
            }}
            loading={loading}
            disabled={loading}
          />
        </form>

        <Divider className="mx-4" />

        <div className="p-4 text-center">
          <span className="text-600">¿No tienes cuenta? </span>
          <Link 
            to="/auth/register" 
            className="text-primary font-semibold no-underline hover:underline"
          >
            Regístrate aquí
          </Link>
        </div>

        <div className="p-4 pt-0">
          <Button 
            label="Volver al Inicio" 
            icon="pi pi-home" 
            className="w-full p-2 border-round-lg"
            outlined
            onClick={() => navigate('/')}
          />
        </div>
      </Card>
    </div>
  );
}
