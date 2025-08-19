import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { resetPasswordRequest } from '../../services/authService';
import '../../styles/ResetPassword.css';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await resetPasswordRequest(email);
      setSubmitted(true);
    } catch (err) {
      console.error('Error al resetear la contraseña:', err);
      setError('Hubo un problema al enviar el correo. Verifica tu email.');
    }
  };

  return (
    <div className="reset-container">
      {submitted ? (
        <Card className="success-card">
          <i className="pi pi-check-circle" style={{ fontSize: '3rem', color: '#10B981' }}></i>
          <h3>Correo enviado</h3>
          <p>Revisa tu bandeja de entrada para restaurar tu contraseña.</p>
        </Card>
      ) : (
        <Card className="reset-card">
          <div className="reset-header">
            <i className="pi pi-key"></i>
            <h2>Recuperar Contraseña</h2>
            <p>Ingresa tu correo electrónico para enviarte un enlace de recuperación.</p>
          </div>
          <form className="reset-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Correo electrónico</label>
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              required
              className="p-inputtext-lg"
            />
            <Button type="submit" label="Enviar enlace" icon="pi pi-send" className="p-mt-3" />
            {error && <Message severity="error" text={error} style={{ marginTop: '1rem' }} />}
          </form>
          <div className="reset-footer">
            ¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a>
          </div>
        </Card>
      )}
    </div>
  );
}

export default ResetPassword;
