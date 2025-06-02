import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Chip } from 'primereact/chip';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import paymentService from '../../services/paymentService';
import '../../styles/PaymentHistory.css';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadPaymentHistory();
  }, [user, navigate]);

  const loadPaymentHistory = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getPaymentHistory();
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading payment history:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000
      });
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const getStatusSeverity = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'completado':
        return 'success';
      case 'pending':
      case 'pendiente':
        return 'warning';
      case 'failed':
      case 'fallido':
        return 'danger';
      default:
        return 'info';
    }
  };

  const getMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'transferencia':
        return 'pi pi-credit-card';
      case 'stripe':
        return 'pi pi-money-bill';
      case 'paypal':
        return 'pi pi-paypal';
      case 'efectivo':
        return 'pi pi-dollar';
      case 'tarjeta':
        return 'pi pi-credit-card';
      default:
        return 'pi pi-shopping-cart';
    }
  };

  const dateBodyTemplate = (rowData) => {
    return <span>{formatDate(rowData.created_at)}</span>;
  };

  const amountBodyTemplate = (rowData) => {
    return (
      <span className="payment-amount">
        ${(rowData.amount || 0).toFixed(2)}
      </span>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag 
        value={rowData.status || 'Pendiente'}
        severity={getStatusSeverity(rowData.status)}
      />
    );
  };

  const methodBodyTemplate = (rowData) => {
    return (
      <div className="payment-method">
        <i className={getMethodIcon(rowData.method)}></i>
        <span>{rowData.method || 'No especificado'}</span>
      </div>
    );
  };

  const courseBodyTemplate = (rowData) => {
    return (
      <div className="course-info">
        <span className="course-name">{rowData.course_name || 'Curso desconocido'}</span>
        {rowData.course_id && (
          <Button
            icon="pi pi-external-link"
            className="p-button-text p-button-sm"
            onClick={() => navigate(`/courses/${rowData.course_id}`)}
            tooltip="Ver curso"
          />
        )}
      </div>
    );
  };

  const header = () => {
    const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const completedPayments = payments.filter(p => p.status?.toLowerCase() === 'completed').length;

    return (
      <div className="payment-history-header">
        <div className="header-title">
          <h1><i className="pi pi-credit-card"></i> Historial de Pagos</h1>
          <p>Revisa todos tus pagos y transacciones</p>
        </div>
        
        <div className="payment-stats">
          <div className="stat-card">
            <div className="stat-number">{payments.length}</div>
            <div className="stat-label">Total Pagos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{completedPayments}</div>
            <div className="stat-label">Completados</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">${totalAmount.toFixed(2)}</div>
            <div className="stat-label">Total Gastado</div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="payment-history-loading">
        <ProgressSpinner />
        <p>Cargando historial de pagos...</p>
      </div>
    );
  }

  return (
    <div className="payment-history-container">
      <Toast ref={toast} />
      
      {payments.length > 0 ? (
        <Card className="payment-history-card">
          <DataTable
            value={payments}
            header={header()}
            paginator
            rows={10}
            responsiveLayout="scroll"
            emptyMessage="No tienes pagos registrados"
            className="payment-history-table"
          >
            <Column 
              field="created_at" 
              header="Fecha" 
              body={dateBodyTemplate}
              sortable
            />
            <Column 
              field="course_name" 
              header="Curso" 
              body={courseBodyTemplate}
            />
            <Column 
              field="amount" 
              header="Monto" 
              body={amountBodyTemplate}
              sortable
            />
            <Column 
              field="method" 
              header="Método" 
              body={methodBodyTemplate}
            />
            <Column 
              field="status" 
              header="Estado" 
              body={statusBodyTemplate}
              sortable
            />
          </DataTable>
        </Card>
      ) : (
        <div className="no-payments">
          <div className="no-payments-content">
            <i className="pi pi-credit-card no-payments-icon"></i>
            <h2>No tienes pagos registrados</h2>
            <p>¡Explora nuestros cursos y realiza tu primera compra!</p>
            <Button
              label="Explorar Cursos"
              icon="pi pi-search"
              onClick={() => navigate('/courses')}
              className="explore-button"
            />
          </div>
        </div>
      )}
    </div>
  );
}
