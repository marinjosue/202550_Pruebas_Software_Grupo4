import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { getUsers, createUser, deleteUser } from '../../services/userService';
import '../../styles/UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    dni: '',
    address: ''
  });
  const toast = React.useRef(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      await createUser(newUser);
      setShowCreateDialog(false);
      setNewUser({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        dni: '',
        address: ''
      });
      loadUsers();
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario creado correctamente',
        life: 3000
      });
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      loadUsers();
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario eliminado correctamente',
        life: 3000
      });
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000
      });
    }
  };

  const roleBodyTemplate = (rowData) => {
    const isAdmin = rowData.role_id === 1;
    return (
      <Badge
        value={isAdmin ? 'Admin' : 'Usuario'}
        severity={isAdmin ? 'danger' : 'info'}
      />
    );
  };

  const actionsBodyTemplate = (rowData) => {
    return (
      <div className="user-actions">
        <Button
          icon="pi pi-trash"
          className="p-button-danger p-button-sm"
          onClick={() => handleDeleteUser(rowData.id)}
          tooltip="Eliminar usuario"
        />
      </div>
    );
  };

  const header = (
    <div className="users-header">
      <h2><i className="pi pi-users"></i> Gestión de Usuarios</h2>
      <Button
        label="Nuevo Usuario"
        icon="pi pi-plus"
        onClick={() => setShowCreateDialog(true)}
        className="create-user-button"
      />
    </div>
  );

  return (
    <div className="userlist-container">
      <Toast ref={toast} />
      
      <DataTable
        value={users}
        loading={loading}
        header={header}
        paginator
        rows={10}
        className="users-table"
        emptyMessage="No se encontraron usuarios"
      >
        <Column field="name" header="Nombre" sortable />
        <Column field="lastname" header="Apellido" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="phone" header="Teléfono" />
        <Column field="dni" header="DNI" />
        <Column header="Rol" body={roleBodyTemplate} />
        <Column header="Acciones" body={actionsBodyTemplate} />
      </DataTable>

      <Dialog
        visible={showCreateDialog}
        style={{ width: '450px' }}
        header="Crear Nuevo Usuario"
        modal
        onHide={() => setShowCreateDialog(false)}
      >
        <div className="create-user-form">
          <div className="form-field">
            <label htmlFor="user-name">Nombre</label>
            <InputText
              id="user-name"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              placeholder="Nombre del usuario"
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="user-lastname">Apellido</label>
            <InputText
              id="user-lastname"
              value={newUser.lastname}
              onChange={(e) => setNewUser({...newUser, lastname: e.target.value})}
              placeholder="Apellido del usuario"
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="user-email">Email</label>
            <InputText
              id="user-email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              placeholder="email@ejemplo.com"
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="user-phone">Teléfono</label>
            <InputText
              id="user-phone"
              value={newUser.phone}
              onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
              placeholder="Número de teléfono"
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="user-dni">DNI</label>
            <InputText
              id="user-dni"
              value={newUser.dni}
              onChange={(e) => setNewUser({...newUser, dni: e.target.value})}
              placeholder="Documento de identidad"
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="user-address">Dirección</label>
            <InputText
              id="user-address"
              value={newUser.address}
              onChange={(e) => setNewUser({...newUser, address: e.target.value})}
              placeholder="Dirección del usuario"
            />
          </div>
          
          <div className="dialog-actions">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              outlined
              onClick={() => setShowCreateDialog(false)}
            />
            <Button
              label="Crear"
              icon="pi pi-check"
              onClick={handleCreateUser}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default UserList;
