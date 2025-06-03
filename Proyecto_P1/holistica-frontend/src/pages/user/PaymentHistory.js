import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import paymentService from '../../services/paymentService';
import { formatDateTime, getStatusSeverity, getMethodIcon, ensureArray, showError } from '../../utils/commonHelpers';
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
      setPayments(ensureArray(data));
    } catch (error) {
      console.error('Error loading payment history:', error);
      showError(toast, error.message);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const dateBodyTemplate = (rowData) => {
    return <span>{formatDateTime(rowData.created_at)}</span>;
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
            responsive
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
            <p>&iexcl;Explora nuestros cursos y realiza tu primera compra!</p>
            <Button
              label="Explorar Cursos"
              icon="pi pi-search"
              onClick={() => navigate('/courses')}
              className="explore-button"
              aria-label="Explorar Cursos"
            />
          </div>
        </div>
      )}
    </div>
  );
}
