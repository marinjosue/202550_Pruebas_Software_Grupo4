import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';
import ConnectionStatus from './components/ConnectionStatus';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <ConnectionStatus />
          <AppRoutes />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
