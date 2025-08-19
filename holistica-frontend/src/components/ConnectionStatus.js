import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [setIsOnline] = useState(navigator.onLine);
  const toast = useRef(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3000');
        setIsConnected(response.ok);
      } catch (error) {
        console.warn('Connection check failed:', error.message);
        setIsConnected(false);
      }
    };

    // Check immediately
    checkConnection();

    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isConnected) {
      toast.current?.show({
        severity: 'error',
        summary: 'Conexión Perdida',
        detail: 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose en el puerto 3000.',
        life: 5000,
        sticky: true
      });
    } else {
      toast.current?.clear();
    }
  }, [isConnected]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (toast.current) {
        toast.current.show({
          severity: 'success',
          summary: 'Conexión restaurada',
          detail: 'Has recuperado la conexión a internet',
          life: 3000
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (toast.current) {
        toast.current.show({
          severity: 'error',
          summary: 'Sin conexión',
          detail: 'Se ha perdido la conexión a internet',
          life: 5000
        });
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <Toast ref={toast} position="top-right" />;
}
