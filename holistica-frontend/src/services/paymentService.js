import ApiClient from '../utils/apiClient';

class PaymentService extends ApiClient {
  constructor() {
    super('payments');
  }

  async processPayment(paymentData) {
    return this.post('/', paymentData);
  }

  async getPaymentHistory() {
    return this.get('/history');
  }

  async getPaymentStatus(paymentId) {
    return this.get(`/${paymentId}/status`);
  }

  getPaymentMethods() {
    return [
      { 
        label: 'Transferencia Bancaria', 
        value: 'transferencia', 
        icon: 'pi pi-building',
        description: 'Transferencia bancaria directa',
        recommended: false
      },
      { 
        label: 'Pago en Línea', 
        value: 'online', 
        icon: 'pi pi-globe',
        description: 'Pago seguro en línea',
        recommended: true
      },
      { 
        label: 'Stripe', 
        value: 'stripe', 
        icon: 'pi pi-credit-card',
        description: 'Procesador de pagos Stripe',
        recommended: true
      },
      { 
        label: 'Efectivo', 
        value: 'efectivo', 
        icon: 'pi pi-dollar',
        description: 'Pago en efectivo en nuestras oficinas',
        recommended: false
      },
      { 
        label: 'PayPal', 
        value: 'paypal', 
        icon: 'pi pi-paypal',
        description: 'Cuenta PayPal verificada',
        recommended: true
      },
      { 
        label: 'Tarjeta de Crédito', 
        value: 'tarjeta', 
        icon: 'pi pi-credit-card',
        description: 'Visa, MasterCard, American Express',
        recommended: true
      }
    ];
  }
}

const paymentService = new PaymentService();
export default paymentService;
