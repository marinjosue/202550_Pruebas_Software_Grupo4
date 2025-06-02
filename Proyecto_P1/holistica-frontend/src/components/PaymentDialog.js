import React, { useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { Chip } from 'primereact/chip';
import { Badge } from 'primereact/badge';
import paymentService from '../services/paymentService';
import '../styles/PaymentDialog.css';

const PaymentDialog = ({ 
  visible, 
  onHide, 
  course, 
  onPaymentSuccess, 
  onEnrollmentSuccess 
}) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [amount, setAmount] = useState(course?.price || 0);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState('method'); // 'method', 'payment', 'confirmation'
  const toast = useRef(null);

  const paymentMethods = paymentService.getPaymentMethods();

  const resetDialog = () => {
    setSelectedMethod('');
    setAmount(course?.price || 0);
    setProcessing(false);
    setStep('method');
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setStep('payment');
  };

  const handlePayment = async () => {
    if (!selectedMethod || !amount || amount <= 0) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor selecciona un método de pago válido',
        life: 3000
      });
      return;
    }

    try {
      setProcessing(true);
      
      const paymentData = {
        course_id: course.id,
        amount: amount,
        method: selectedMethod
      };

      const result = await paymentService.processPayment(paymentData);
      
      setStep('confirmation');
      
      toast.current?.show({
        severity: 'success',
        summary: 'Pago Exitoso',
        detail: 'Tu pago ha sido procesado correctamente',
        life: 3000
      });

      setTimeout(() => {
        onPaymentSuccess?.(result);
        onEnrollmentSuccess?.(result);
        onHide();
        resetDialog();
      }, 2000);

    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error en el Pago',
        detail: error.message,
        life: 3000
      });
    } finally {
      setProcessing(false);
    }
  };

  const renderMethodSelection = () => (
    <div className="payment-methods-grid">
      <h3>Selecciona tu método de pago preferido</h3>
      <div className="methods-container">
        {paymentMethods.map((method) => (
          <Card 
            key={method.value}
            className={`payment-method-card ${selectedMethod === method.value ? 'selected' : ''}`}
            onClick={() => handleMethodSelect(method.value)}
          >
            <div className="method-content">
              <i className={`${method.icon} method-icon`}></i>
              <span className="method-label">{method.label}</span>
              <span className="method-description">{method.description}</span>
              {method.recommended && (
                <Badge value="Recomendado" className="recommended-badge" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPaymentForm = () => {
    const selectedMethodInfo = paymentMethods.find(m => m.value === selectedMethod);
    
    return (
      <div className="payment-form">
        <div className="payment-header">
          <Button 
            icon="pi pi-arrow-left" 
            className="p-button-text p-button-plain"
            onClick={() => setStep('method')}
          />
          <h3>Procesar Pago - {selectedMethodInfo?.label}</h3>
        </div>

        <Card className="course-summary">
          <div className="course-info">
            <img 
              src={course.image_url || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=120&fit=crop'}
              alt={course.name}
              className="course-image"
            />
            <div className="course-details">
              <h4>{course.name}</h4>
              <p>{course.description}</p>
              <div className="course-tags">
                <Chip label={`${course.duration} horas`} />
                <Chip label={course.level || 'Todos los niveles'} />
              </div>
            </div>
          </div>
          
          <Divider />
          
          <div className="payment-summary">
            <div className="price-row">
              <span>Precio del curso:</span>
              <span className="price">${course.price}</span>
            </div>
            {course.original_price && course.original_price > course.price && (
              <div className="price-row discount">
                <span>Precio original:</span>
                <span className="original-price">${course.original_price}</span>
              </div>
            )}
            <Divider />
            <div className="price-row total">
              <span>Total a pagar:</span>
              <span className="total-amount">${amount}</span>
            </div>
          </div>
        </Card>

        <Card className="payment-details">
          <h4>Detalles del Pago</h4>
          
          <div className="form-field">
            <label>Método de Pago</label>
            <Dropdown
              value={selectedMethod}
              options={paymentMethods}
              onChange={(e) => setSelectedMethod(e.value)}
              placeholder="Seleccionar método"
              disabled
            />
          </div>

          <div className="form-field">
            <label>Monto</label>
            <InputNumber
              value={amount}
              onValueChange={(e) => setAmount(e.value)}
              mode="currency"
              currency="USD"
              locale="en-US"
              disabled={true}
            />
          </div>

          {selectedMethod === 'transferencia' && (
            <div className="transfer-info">
              <h5>Información para Transferencia</h5>
              <p><strong>Banco:</strong> Banco Pichincha</p>
              <p><strong>Cuenta:</strong> 2100123456</p>
              <p><strong>Beneficiario:</strong> Holística Center</p>
              <p><strong>Referencia:</strong> Curso-{course.id}</p>
            </div>
          )}

          {selectedMethod === 'efectivo' && (
            <div className="cash-info">
              <h5>Pago en Efectivo</h5>
              <p>Dirígete a nuestras oficinas para completar el pago</p>
              <p><strong>Dirección:</strong> Av. Amazonas y Colón, Quito</p>
              <p><strong>Horario:</strong> Lunes a Viernes 9:00 - 17:00</p>
            </div>
          )}
        </Card>
      </div>
    );
  };

  const renderConfirmation = () => (
    <div className="payment-confirmation">
      <div className="success-icon">
        <i className="pi pi-check-circle"></i>
      </div>
      <h3>¡Pago Exitoso!</h3>
      <p>Tu inscripción al curso <strong>{course.name}</strong> ha sido procesada correctamente.</p>
      <p>Recibirás un correo de confirmación con los detalles del curso.</p>
      
      <div className="next-steps">
        <h4>Próximos pasos:</h4>
        <ul>
          <li>Revisa tu correo electrónico</li>
          <li>Accede a tus cursos desde "Mis Inscripciones"</li>
          <li>Prepárate para comenzar tu aprendizaje</li>
        </ul>
      </div>
    </div>
  );

  const getDialogHeader = () => {
    switch (step) {
      case 'method':
        return 'Método de Pago';
      case 'payment':
        return 'Procesar Pago';
      case 'confirmation':
        return 'Confirmación';
      default:
        return 'Pago del Curso';
    }
  };

  const getDialogFooter = () => {
    if (step === 'confirmation') {
      return (
        <div className="confirmation-footer">
          <Button
            label="Ir a Mis Cursos"
            icon="pi pi-graduation-cap"
            onClick={() => {
              onHide();
              resetDialog();
              window.location.href = '/my-enrollments';
            }}
          />
          <Button
            label="Continuar Explorando"
            icon="pi pi-search"
            className="p-button-outlined"
            onClick={() => {
              onHide();
              resetDialog();
            }}
          />
        </div>
      );
    }

    if (step === 'payment') {
      return (
        <div className="payment-footer">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-text"
            onClick={() => {
              onHide();
              resetDialog();
            }}
            disabled={processing}
          />
          <Button
            label={processing ? 'Procesando...' : 'Pagar Ahora'}
            icon={processing ? 'pi pi-spin pi-spinner' : 'pi pi-credit-card'}
            onClick={handlePayment}
            loading={processing}
            disabled={processing}
          />
        </div>
      );
    }

    return (
      <div className="method-footer">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          className="p-button-text"
          onClick={() => {
            onHide();
            resetDialog();
          }}
        />
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={getDialogHeader()}
        visible={visible}
        onHide={() => {
          if (!processing) {
            onHide();
            resetDialog();
          }
        }}
        className="payment-dialog"
        footer={getDialogFooter()}
        closable={!processing}
        closeOnEscape={!processing}
        modal
        draggable={false}
        resizable={false}
      >
        {step === 'method' && renderMethodSelection()}
        {step === 'payment' && renderPaymentForm()}
        {step === 'confirmation' && renderConfirmation()}
      </Dialog>
    </>
  );
};

export default PaymentDialog;
