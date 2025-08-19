import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { getMyProfile, updateMyProfile } from '../../services/userService';
import '../../styles/Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = React.useRef(null);

  useEffect(() => {
    // Verificar si hay token antes de cargar el perfil
    const token = localStorage.getItem('token');
    if (!token) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Autenticación requerida',
        detail: 'Debes iniciar sesión para ver tu perfil',
        life: 3000
      });
      // Redirigir al login después de mostrar el mensaje
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }
    
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getMyProfile();
      setProfile(data);
      setFormData(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000
      });
      
      // Si es un error de autenticación, redirigir al login
      if (error.message.includes('autenticación') || error.message.includes('sesión')) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updatedProfile = await updateMyProfile(formData);
      setProfile(updatedProfile);
      setEditMode(false);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Perfil actualizado correctamente',
        life: 3000
      });
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditMode(false);
  };

  // Mostrar mensaje de carga mejorado si no hay token
  if (loading) {
    return (
      <div className="profile-loading">
        <ProgressSpinner />
        <p>Cargando perfil...</p>
      </div>
    );
  }

  // Mostrar mensaje si no hay perfil cargado
  if (!profile) {
    return (
      <div className="profile-container">
        <Toast ref={toast} />
        <div className="profile-loading">
          <i className="pi pi-exclamation-triangle" style={{fontSize: '3rem', color: '#f59e0b'}}></i>
          <p>No se pudo cargar el perfil. Verifica tu autenticación.</p>
          <Button 
            label="Ir al Login" 
            icon="pi pi-sign-in"
            onClick={() => window.location.href = '/login'}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Toast ref={toast} />
      
      <div className="profile-header">
        <h1><i className="pi pi-user"></i> Mi Perfil</h1>
        <p>Gestiona tu información personal</p>
      </div>

      <Card className="profile-card">
        <div className="profile-content">
          <div className="profile-avatar">
            <i className="pi pi-user profile-avatar-icon"></i>
          </div>

          <div className="profile-form">
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="profile-name">Nombre</label>
                <InputText
                  id="profile-name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!editMode}
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="profile-lastname">Apellido</label>
                <InputText
                  id="profile-lastname"
                  value={formData.lastname || ''}
                  onChange={(e) => handleInputChange('lastname', e.target.value)}
                  disabled={!editMode}
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="profile-email">Email</label>
                <InputText
                  id="profile-email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!editMode}
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="profile-phone">Teléfono</label>
                <InputText
                  id="profile-phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!editMode}
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="profile-dni">DNI</label>
                <InputText
                  id="profile-dni"
                  value={formData.dni || ''}
                  onChange={(e) => handleInputChange('dni', e.target.value)}
                  disabled={!editMode}
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="profile-address">Dirección</label>
                <InputText
                  id="profile-address"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!editMode}
                />
              </div>
            </div>

            <div className="profile-actions">
              {!editMode ? (
                <Button
                  label="Editar Perfil"
                  icon="pi pi-pencil"
                  onClick={() => setEditMode(true)}
                  className="edit-button"
                />
              ) : (
                <div className="edit-actions">
                  <Button
                    label="Guardar"
                    icon="pi pi-check"
                    onClick={handleSave}
                    loading={saving}
                    className="save-button"
                  />
                  <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    onClick={handleCancel}
                    outlined
                    className="cancel-button"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
