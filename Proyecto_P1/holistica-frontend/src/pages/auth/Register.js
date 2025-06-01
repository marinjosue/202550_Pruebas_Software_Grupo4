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

export default function Register() {
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
  const { register } = useAuth();

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
    <div className="min-h-screen flex align-items-center justify-content-center p-3" 
         style={{ 
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
           fontFamily: 'Inter, sans-serif'
         }}>
      <Toast ref={toast} />
      
      <Card className="w-full max-w-4xl shadow-8 border-round-2xl overflow-hidden">
        <div className="text-center p-4" 
             style={{ 
               background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
               color: 'white' 
             }}>
          <div className="flex justify-content-center mb-3">
            <div className="border-circle p-3 bg-white-alpha-20">
              <i className="pi pi-user-plus text-4xl"></i>
            </div>
          </div>
          <h2 className="text-3xl font-bold m-0 mb-2">Crear Cuenta</h2>
          <p className="text-green-100 m-0">Únete a nuestra comunidad de aprendizaje</p>
        </div>

        <form onSubmit={handleRegister} className="p-4">
          <div className="grid">
            <div className="col-12 md:col-6">
              <div className="field mb-3">
                <label htmlFor="name" className="block text-sm font-semibold text-700 mb-2">
                  <i className="pi pi-user mr-2 text-primary"></i>
                  Nombre *
                </label>
                <InputText 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-3 border-round-lg"
                  placeholder="Tu nombre"
                  required
                />
              </div>
            </div>

            <div className="col-12 md:col-6">
              <div className="field mb-3">
                <label htmlFor="lastname" className="block text-sm font-semibold text-700 mb-2">
                  <i className="pi pi-user mr-2 text-primary"></i>
                  Apellido *
                </label>
                <InputText 
                  id="lastname" 
                  value={formData.lastname}
                  onChange={(e) => handleInputChange('lastname', e.target.value)}
                  className="w-full p-3 border-round-lg"
                  placeholder="Tu apellido"
                  required
                />
              </div>
            </div>

            <div className="col-12">
              <div className="field mb-3">
                <label htmlFor="email" className="block text-sm font-semibold text-700 mb-2">
                  <i className="pi pi-envelope mr-2 text-primary"></i>
                  Correo Electrónico *
                </label>
                <InputText 
                  id="email" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border-round-lg"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div className="col-12 md:col-6">
              <div className="field mb-3">
                <label htmlFor="phone" className="block text-sm font-semibold text-700 mb-2">
                  <i className="pi pi-phone mr-2 text-primary"></i>
                  Teléfono
                </label>
                <InputText 
                  id="phone" 
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full p-3 border-round-lg"
                  placeholder="0987654321"
                />
              </div>
            </div>

            <div className="col-12 md:col-6">
              <div className="field mb-3">
                <label htmlFor="dni" className="block text-sm font-semibold text-700 mb-2">
                  <i className="pi pi-id-card mr-2 text-primary"></i>
                  Cédula/DNI
                </label>
                <InputText 
                  id="dni" 
                  value={formData.dni}
                  onChange={(e) => handleInputChange('dni', e.target.value)}
                  className="w-full p-3 border-round-lg"
                  placeholder="1234567890"
                />
              </div>
            </div>

            <div className="col-12">
              <div className="field mb-3">
                <label htmlFor="address" className="block text-sm font-semibold text-700 mb-2">
                  <i className="pi pi-map-marker mr-2 text-primary"></i>
                  Dirección
                </label>
                <InputText 
                  id="address" 
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full p-3 border-round-lg"
                  placeholder="Tu dirección"
                />
              </div>
            </div>

            <div className="col-12 md:col-6">
              <div className="field mb-3">
                <label htmlFor="password" className="block text-sm font-semibold text-700 mb-2">
                  <i className="pi pi-lock mr-2 text-primary"></i>
                  Contraseña *
                </label>
                <Password 
                  id="password" 
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full"
                  inputClassName="w-full p-3 border-round-lg"
                  placeholder="Mínimo 6 caracteres"
                  toggleMask
                  required
                />
              </div>
            </div>

            <div className="col-12 md:col-6">
              <div className="field mb-3">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-700 mb-2">
                  <i className="pi pi-lock mr-2 text-primary"></i>
                  Confirmar Contraseña *
                </label>
                <Password 
                  id="confirmPassword" 
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full"
                  inputClassName="w-full p-3 border-round-lg"
                  placeholder="Repite la contraseña"
                  toggleMask
                  feedback={false}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex align-items-center mb-4">
            <Checkbox 
              id="terms" 
              checked={acceptTerms} 
              onChange={(e) => setAcceptTerms(e.checked)} 
              className="mr-2"
            />
            <label htmlFor="terms" className="text-sm text-600">
              Acepto los{' '}
              <Link to="/terms" className="text-primary no-underline hover:underline">
                términos y condiciones
              </Link>
              {' '}y{' '}
              <Link to="/privacy" className="text-primary no-underline hover:underline">
                política de privacidad
              </Link>
            </label>
          </div>

          <Button 
            type="submit"
            label="Crear Cuenta" 
            icon="pi pi-user-plus" 
            className="w-full p-3 text-lg font-bold border-round-lg mb-3"
            style={{ 
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              border: 'none'
            }}
            loading={loading}
            disabled={loading}
          />
        </form>

        <Divider className="mx-4" />

        <div className="p-4 text-center">
          <span className="text-600">¿Ya tienes cuenta? </span>
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
