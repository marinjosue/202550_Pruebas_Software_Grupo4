import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock de los contextos y componentes
jest.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>
}));

jest.mock('../context/CartContext', () => ({
  CartProvider: ({ children }) => <div data-testid="cart-provider">{children}</div>
}));

jest.mock('../components/ConnectionStatus', () => {
  return function MockConnectionStatus() {
    return <div data-testid="connection-status">Connection Status</div>;
  };
});

jest.mock('../routes/AppRoutes', () => {
  return function MockAppRoutes() {
    return <div data-testid="app-routes">App Routes</div>;
  };
});

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    
    // Verificar que los elementos principales estén presentes
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByTestId('cart-provider')).toBeInTheDocument();
    expect(screen.getByTestId('connection-status')).toBeInTheDocument();
    expect(screen.getByTestId('app-routes')).toBeInTheDocument();
  });

  test('has correct structure with providers', () => {
    render(<App />);
    
    // Verificar que los providers están anidados correctamente
    const authProvider = screen.getByTestId('auth-provider');
    const cartProvider = screen.getByTestId('cart-provider');
    
    expect(authProvider).toContainElement(cartProvider);
  });

  test('renders main app div with correct class', () => {
    const { container } = render(<App />);
    
    const appDiv = container.querySelector('.App');
    expect(appDiv).toBeInTheDocument();
  });
});
