import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { resetPasswordRequest } from '../../services/authService';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.current.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Por favor ingresa tu correo electrónico', 
        life: 3000 
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.current.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Por favor ingresa un correo electrónico válido', 
        life: 3000 
      });
      return;
    }

    setLoading(true);
    try {
      await resetPasswordRequest(email);
      setEmailSent(true);
      toast.current.show({ 
        severity: 'success', 
        summary: 'Email Enviado', 
        detail: 'Revisa tu correo para instrucciones de recuperación', 
        life: 5000 
      });
    } catch (error) {
      console.error('Error al resetear contraseña:', error);
      toast.current.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: error.message || 'Error al enviar el email de recuperación', 
        life: 4000 
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex align-items-center justify-content-center p-4" 
           style={{ 
             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
             fontFamily: 'Inter, sans-serif'
           }}>
        <Toast ref={toast} />
        
        <Card className="w-full max-w-md shadow-8 border-round-2xl overflow-hidden text-center">
          <div className="p-6">
            <div className="flex justify-content-center mb-4">
              <div className="border-circle p-4 bg-green-100">
                <i className="pi pi-check-circle text-5xl text-green-600"></i>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-900 mb-3">Email Enviado</h2>
            <p className="text-600 mb-4 line-height-3">
              Hemos enviado las instrucciones de recuperación a{' '}
              <strong className="text-900">{email}</strong>
            </p>
            <p className="text-500 text-sm mb-4">
              Si no encuentras el email, revisa tu carpeta de spam.
            </p>
            
            <div className="flex flex-column gap-2">
              <Button 
                label="Volver al Login" 
                icon="pi pi-sign-in" 
                className="w-full p-3 border-round-lg"
                style={{ 
                  background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
                  border: 'none'
                }}
                onClick={() => navigate('/auth/login')}
              />
              <Button 
                label="Reenviar Email" 
                icon="pi pi-refresh" 
                className="w-full p-2 border-round-lg"
                outlined
                onClick={() => setEmailSent(false)}
              />
            </div>
          </div>
        </Card>
      </div>
    );
  }

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
               background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
               color: 'white' 
             }}>
          <div className="flex justify-content-center mb-3">
            <div className="border-circle p-3 bg-white-alpha-20">
              <i className="pi pi-key text-4xl"></i>
            </div>
          </div>
          <h2 className="text-3xl font-bold m-0 mb-2">Recuperar Contraseña</h2>
          <p className="text-orange-100 m-0">Te ayudaremos a recuperar tu acceso</p>
        </div>

        <form onSubmit={handleResetPassword} className="p-4">
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
            <small className="text-500 mt-2 block">
              Ingresa el email asociado a tu cuenta para recibir las instrucciones de recuperación.
            </small>
          </div>

          <Button 
            type="submit"
            label="Enviar Instrucciones" 
            icon="pi pi-send" 
            className="w-full p-3 text-lg font-bold border-round-lg"
            style={{ 
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              border: 'none'
            }}
            loading={loading}
            disabled={loading}
          />
        </form>

        <Divider className="mx-4" />

        <div className="p-4 text-center">
          <span className="text-600">¿Recordaste tu contraseña? </span>
          <Link 
            to="/auth/login" 
            className="text-primary font-semibold no-underline hover:underline"
          >
            Iniciar Sesión
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
