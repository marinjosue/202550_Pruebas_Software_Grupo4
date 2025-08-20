import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PrimeReactProvider, addLocale, locale } from 'primereact/api';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';
import ConnectionStatus from './components/ConnectionStatus';

import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// Configurar localización en español
addLocale('es', {
  firstDayOfWeek: 1,  
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  today: 'Hoy',
  clear: 'Limpiar'
});

locale('es');

// Configuración completa de PrimeReact para evitar errores
const primeReactConfig = {
  ripple: true,
  inputStyle: 'outlined',
  locale: 'es',
  hideOverlaysOnDocumentScrolling: false,
  nonce: undefined,
  nullSortOrder: 1,
  zIndex: {
    modal: 1100,
    overlay: 1000,
    menu: 1000,
    tooltip: 1100,
    toast: 1200
  },
  pt: {},
  ptOptions: {
    mergeSections: true,
    mergeProps: false
  },
  unstyled: false,
  cssTransition: true,
  filterMatchModeOptions: {
    text: ['contains', 'startsWith', 'endsWith', 'equals', 'notEquals'],
    numeric: ['equals', 'notEquals', 'lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual'],
    date: ['dateIs', 'dateIsNot', 'dateBefore', 'dateAfter']
  }
};

function App() {
  return (
    <PrimeReactProvider value={primeReactConfig}>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AuthProvider>
          <CartProvider>
            <div className="App">
              <ConnectionStatus />
              <AppRoutes />
            </div>
          </CartProvider>
        </AuthProvider>
      </Router>
    </PrimeReactProvider>
  );
}

export default App;
