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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
                <label>Nombre</label>
                <InputText
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className={!editMode ? 'readonly' : ''}
                />
              </div>

              <div className="form-field">
                <label>Apellido</label>
                <InputText
                  name="lastname"
                  value={formData.lastname || ''}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className={!editMode ? 'readonly' : ''}
                />
              </div>

              <div className="form-field">
                <label>Email</label>
                <InputText
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className={!editMode ? 'readonly' : ''}
                />
              </div>

              <div className="form-field">
                <label>Teléfono</label>
                <InputText
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className={!editMode ? 'readonly' : ''}
                />
              </div>

              <div className="form-field">
                <label>DNI</label>
                <InputText
                  name="dni"
                  value={formData.dni || ''}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className={!editMode ? 'readonly' : ''}
                />
              </div>

              <div className="form-field full-width">
                <label>Dirección</label>
                <InputText
                  name="address"
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className={!editMode ? 'readonly' : ''}
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
