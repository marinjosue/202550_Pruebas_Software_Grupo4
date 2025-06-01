import React, { useState, useRef } from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenuItems = [
    {
      label: 'Mi Perfil',
      icon: 'pi pi-user',
      command: () => navigate('/profile')
    },
    {
      label: 'Mis Cursos',
      icon: 'pi pi-book',
      command: () => navigate('/my-courses')
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      command: () => navigate('/settings')
    },
    { separator: true },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: handleLogout,
      className: 'logout-item'
    }
  ];

  const adminMenuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-chart-line',
      command: () => navigate('/admin/dashboard')
    },
    {
      label: 'Gestionar Cursos',
      icon: 'pi pi-book',
      command: () => navigate('/admin/courses')
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-users',
      command: () => navigate('/admin/users')
    },
    {
      label: 'Reportes',
      icon: 'pi pi-chart-bar',
      command: () => navigate('/admin/reports')
    },
    { separator: true },
    ...userMenuItems
  ];

  const menuItems = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      command: () => navigate('/'),
      className: 'nav-item'
    },
    {
      label: 'Cursos',
      icon: 'pi pi-graduation-cap',
      command: () => navigate('/courses'),
      className: 'nav-item'
    },
    {
      label: 'Nosotros',
      icon: 'pi pi-info-circle',
      command: () => navigate('/about'),
      className: 'nav-item'
    },
    {
      label: 'Contacto',
      icon: 'pi pi-envelope',
      command: () => navigate('/contact'),
      className: 'nav-item'
    }
  ];

  const start = (
    <div className="navbar-brand" onClick={() => navigate('/')}>
      <img 
        src="/assets/logo.png" 
        alt="Holística Center" 
        className="brand-logo"
        onError={(e) => {
          // Fallback if logo doesn't exist
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div className="brand-fallback" style={{ display: 'none' }}>
        <div className="brand-icon">
          <i className="pi pi-heart-fill"></i>
        </div>
        <div className="brand-text">
          <span className="brand-name">Holística</span>
          <span className="brand-subtitle">Center</span>
        </div>
      </div>
      <div className="brand-text-main">
        <span className="brand-name">Holística</span>
        <span className="brand-subtitle">Center</span>
      </div>
    </div>
  );

  const end = (
    <div className="navbar-end">
      {/* Cart Button */}
      <Button
        icon="pi pi-shopping-cart"
        className="cart-button p-button-rounded p-button-text"
        onClick={() => navigate('/cart')}
        badge={cartItems.length > 0 ? cartItems.length.toString() : null}
        badgeClassName="cart-badge"
        tooltip="Carrito de compras"
        tooltipOptions={{ position: 'bottom' }}
      />

      {/* Search Button */}
      <Button
        icon="pi pi-search"
        className="search-button p-button-rounded p-button-text"
        onClick={() => navigate('/search')}
        tooltip="Buscar cursos"
        tooltipOptions={{ position: 'bottom' }}
      />

      {/* User Section */}
      {user ? (
        <div className="user-section">
          <div className="user-info">
            <span className="user-greeting">
              Hola, <strong>{user.name}</strong>
            </span>
            {user.role === 1 && (
              <Badge value="Admin" severity="success" className="admin-badge" />
            )}
          </div>
          <Button
            className="user-menu-button p-button-rounded"
            onClick={(e) => {
              setUserMenuVisible(true);
              userMenuRef.current.toggle(e);
            }}
          >
            <Avatar
              image={user.avatar}
              icon="pi pi-user"
              size="normal"
              shape="circle"
              className="user-avatar"
            />
          </Button>
          <Menu
            ref={userMenuRef}
            model={user.role === 1 ? adminMenuItems : userMenuItems}
            popup
            className="user-dropdown-menu"
          />
        </div>
      ) : (
        <div className="auth-buttons">
          <Button
            label="Iniciar Sesión"
            icon="pi pi-sign-in"
            className="login-button p-button-outlined"
            onClick={() => navigate('/login')}
          />
          <Button
            label="Registrarse"
            icon="pi pi-user-plus"
            className="register-button"
            onClick={() => navigate('/register')}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="navbar-container">
      <Menubar
        model={menuItems}
        start={start}
        end={end}
        className="custom-menubar"
      />
    </div>
  );
}
