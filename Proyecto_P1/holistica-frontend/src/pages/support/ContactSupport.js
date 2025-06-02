import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import '../../styles/Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre es obligatorio',
        life: 3000
      });
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor ingresa un email válido',
        life: 3000
      });
      return false;
    }
    if (!formData.message.trim()) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'El mensaje es obligatorio',
        life: 3000
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    // Simular envío de formulario
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.current.show({
        severity: 'success',
        summary: '¡Mensaje Enviado!',
        detail: 'Gracias por contactarnos. Te responderemos pronto.',
        life: 5000
      });
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo enviar el mensaje. Intenta de nuevo.',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: 'pi pi-phone',
      title: 'Teléfono',
      value: '+593 99 999 9999',
      action: () => window.open('tel:+593999999999'),
      color: 'success'
    },
    {
      icon: 'pi pi-envelope',
      title: 'Email',
      value: 'jimarin@espe.edu.ec',
      action: () => window.open('mailto:jimarin@espe.edu.ec'),
      color: 'info'
    },
    {
      icon: 'pi pi-whatsapp',
      title: 'WhatsApp',
      value: 'Chat Grupal',
      action: () => window.open('https://chat.whatsapp.com/DKUeRaOpLTeEWAmE8gpvhI', '_blank'),
      color: 'success'
    },
    {
      icon: 'pi pi-map-marker',
      title: 'Ubicación',
      value: 'Quito, Ecuador',
      action: () => window.open('https://maps.google.com/?q=Quito,Ecuador', '_blank'),
      color: 'warning'
    }
  ];

  const socialNetworks = [
    {
      name: 'Facebook',
      icon: 'pi pi-facebook',
      url: 'https://www.facebook.com/profile.php?id=100009361808424',
      color: '#1877F2'
    },
    {
      name: 'Instagram',
      icon: 'pi pi-instagram',
      url: 'https://www.instagram.com/lum.massagebar/',
      color: '#E4405F'
    },
    {
      name: 'YouTube',
      icon: 'pi pi-youtube',
      url: 'https://www.youtube.com/watch?v=Riz724D2Dps',
      color: '#FF0000'
    }
  ];

  return (
    <div className="contact-container">
      <Toast ref={toast} />
      
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <i className="pi pi-comments hero-icon"></i>
            Contáctanos
          </h1>
          <p className="hero-subtitle">
            Estamos aquí para ayudarte en tu camino hacia el bienestar
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="contact-content">
        <div className="contact-grid">
          
          {/* Contact Form */}
          <div className="contact-form-section">
            <Card className="contact-form-card">
              <div className="form-header">
                <h2>
                  <i className="pi pi-send"></i>
                  Envíanos un Mensaje
                </h2>
                <p>Completa el formulario y nos pondremos en contacto contigo</p>
              </div>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="name">Nombre Completo *</label>
                    <InputText
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Tu nombre completo"
                      className="contact-input"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="email">Email *</label>
                    <InputText
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                      className="contact-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="phone">Teléfono</label>
                    <InputText
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Tu número de teléfono"
                      className="contact-input"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="subject">Asunto</label>
                    <InputText
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Asunto del mensaje"
                      className="contact-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="message">Mensaje *</label>
                  <InputTextarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Escribe tu mensaje aquí..."
                    rows={5}
                    className="contact-textarea"
                  />
                </div>

                <Button
                  type="submit"
                  label={loading ? 'Enviando...' : 'Enviar Mensaje'}
                  icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-send'}
                  loading={loading}
                  className="submit-button"
                />
              </form>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="contact-info-section">
            
            {/* Contact Cards */}
            <div className="contact-cards">
              {contactInfo.map((info, index) => (
                <Card 
                  key={index} 
                  className="contact-info-card"
                  onClick={info.action}
                >
                  <div className="contact-info-content">
                    <div className={`contact-info-icon ${info.color}`}>
                      <i className={info.icon}></i>
                    </div>
                    <div className="contact-info-text">
                      <h4>{info.title}</h4>
                      <p>{info.value}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Divider />

            {/* Social Networks */}
            <Panel 
              header={
                <div className="panel-header">
                  <i className="pi pi-share-alt"></i>
                  Síguenos en Redes Sociales
                </div>
              }
              className="social-panel"
              toggleable
            >
              <div className="social-networks">
                {socialNetworks.map((social, index) => (
                  <Button
                    key={index}
                    icon={social.icon}
                    label={social.name}
                    className="social-button"
                    style={{ 
                      '--social-color': social.color,
                      backgroundColor: social.color + '15',
                      borderColor: social.color,
                      color: social.color
                    }}
                    onClick={() => window.open(social.url, '_blank')}
                  />
                ))}
              </div>
            </Panel>

            <Divider />

            {/* FAQ Section */}
            <Panel 
              header={
                <div className="panel-header">
                  <i className="pi pi-question-circle"></i>
                  Preguntas Frecuentes
                </div>
              }
              className="faq-panel"
              toggleable
            >
              <div className="faq-content">
                <div className="faq-item">
                  <h5>¿Cuál es la duración de los cursos?</h5>
                  <p>Los cursos varían entre 3 a 7 meses dependiendo de la modalidad elegida.</p>
                </div>
                <div className="faq-item">
                  <h5>¿Ofrecen certificación?</h5>
                  <p>Sí, todos nuestros cursos incluyen certificación con triple aval comercial.</p>
                </div>
                <div className="faq-item">
                  <h5>¿Hay modalidad online?</h5>
                  <p>Sí, ofrecemos modalidades presencial, semipresencial y completamente online.</p>
                </div>
              </div>
            </Panel>

            {/* WhatsApp CTA */}
            <Card className="whatsapp-cta">
              <div className="whatsapp-content">
                <div className="whatsapp-icon">
                  <i className="pi pi-whatsapp"></i>
                </div>
                <div className="whatsapp-text">
                  <h4>¿Necesitas ayuda inmediata?</h4>
                  <p>Únete a nuestro grupo de WhatsApp</p>
                </div>
                <Button
                  label="Chat Ahora"
                  icon="pi pi-whatsapp"
                  className="whatsapp-button"
                  onClick={() => window.open('https://chat.whatsapp.com/DKUeRaOpLTeEWAmE8gpvhI', '_blank')}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
