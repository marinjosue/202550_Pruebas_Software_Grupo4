import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { useAuth } from '../../hooks/useAuth';

import '../../styles/Register.css';

export default function Register() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    dni: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();


  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.lastname || !formData.email || !formData.password) {
      toast.current.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Por favor completa todos los campos obligatorios', 
        life: 3000 
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.current.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Las contraseñas no coinciden', 
        life: 3000 
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast.current.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'La contraseña debe tener al menos 6 caracteres', 
        life: 3000 
      });
      return false;
    }

    if (!acceptTerms) {
      toast.current.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Debes aceptar los términos y condiciones', 
        life: 3000 
      });
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const registerData = {
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        phone: formData.phone || '0000000000',
        dni: formData.dni || '0000000000',
        address: formData.address || 'No especificada',
        password: formData.password,
        role_id: 2
      };

      await register(registerData);
      
      toast.current.show({ 
        severity: 'success', 
        summary: 'Registro Exitoso', 
        detail: 'Tu cuenta ha sido creada. Bienvenido a Holística Center!', 
        life: 3000 
      });
      
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error de registro:', error);
      toast.current.show({ 
        severity: 'error', 
        summary: 'Error de Registro', 
        detail: error.message || 'Error al crear la cuenta', 
        life: 3000 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`register-container ${loading ? 'register-loading' : ''}`}>
      <Toast ref={toast} />
      
      <Card className="register-card">
        <div className="register-header">
          <div className="register-icon-container">
            <div className="register-icon">
              <i className="pi pi-user-plus text-4xl"></i>
            </div>
          </div>
          <h2 className="register-title">Crear Cuenta</h2>
          <p className="register-subtitle">Únete a nuestra comunidad de aprendizaje</p>
        </div>

        <form onSubmit={handleRegister} className="register-form">
          <div className="register-grid">
            <div className="register-field">
              <label htmlFor="name">
                <i className="pi pi-user mr-2 text-primary"></i>
                Nombre <span className="required">*</span>
              </label>
              <InputText 
                id="name" 
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Tu nombre"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="lastname">
                <i className="pi pi-user mr-2 text-primary"></i>
                Apellido <span className="required">*</span>
              </label>
              <InputText 
                id="lastname" 
                value={formData.lastname}
                onChange={(e) => handleInputChange('lastname', e.target.value)}
                placeholder="Tu apellido"
                required
              />
            </div>

            <div className="register-field full-width">
              <label htmlFor="email">
                <i className="pi pi-envelope mr-2 text-primary"></i>
                Correo Electrónico <span className="required">*</span>
              </label>
              <InputText 
                id="email" 
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="phone">
                <i className="pi pi-phone mr-2 text-primary"></i>
                Teléfono
              </label>
              <InputText 
                id="phone" 
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="0987654321"
              />
            </div>

            <div className="register-field">
              <label htmlFor="dni">
                <i className="pi pi-id-card mr-2 text-primary"></i>
                Cédula/DNI
              </label>
              <InputText 
                id="dni" 
                value={formData.dni}
                onChange={(e) => handleInputChange('dni', e.target.value)}
                placeholder="1234567890"
              />
            </div>

            <div className="register-field full-width">
              <label htmlFor="address">
                <i className="pi pi-map-marker mr-2 text-primary"></i>
                Dirección
              </label>
              <InputText 
                id="address" 
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Tu dirección"
              />
            </div>

            <div className="register-field">
              <label htmlFor="password">
                <i className="pi pi-lock mr-2 text-primary"></i>
                Contraseña <span className="required">*</span>
              </label>
              <Password 
                id="password" 
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Mínimo 6 caracteres"
                toggleMask
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="confirmPassword">
                <i className="pi pi-lock mr-2 text-primary"></i>
                Confirmar Contraseña <span className="required">*</span>
              </label>
              <Password 
                id="confirmPassword" 
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Repite la contraseña"
                toggleMask
                feedback={false}
                required
              />
            </div>
          </div>

          <div className="register-terms">
            <Checkbox 
              id="terms" 
              checked={acceptTerms} 
              onChange={(e) => setAcceptTerms(e.checked)} 
            />
            <label htmlFor="terms">
              Acepto los{' '}
              <Link to="/terms">
                términos y condiciones
              </Link>
              {' '}y{' '}
              <Link to="/privacy">
                política de privacidad
              </Link>
            </label>
          </div>

          <Button 
            type="submit"
            label="Crear Cuenta" 
            icon="pi pi-user-plus" 
            className="register-button"
            loading={loading}
            disabled={loading}
          />
        </form>

        <hr className="register-divider" />

        <div className="register-footer">
          <span className="text-600">¿Ya tienes cuenta? </span>
          <Link 
            to="/login" 
            className="register-login-link"
          >
            Iniciar Sesión
          </Link>
          
          <Button 
            label="Volver al Inicio" 
            icon="pi pi-home" 
            className="register-back-button"
            outlined
            onClick={() => navigate('/')}
          />
        </div>
      </Card>
    </div>
  );
}