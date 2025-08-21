import React, { useRef } from 'react';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import ContactForm from '../../components/common/ContactForm';
import ContactInfoCard from '../../components/common/ContactInfoCard';
import '../../styles/Contact.css';
import '../../styles/utilities.css';

export default function ContactSupport() {
  const toast = useRef(null);

  const contactInfo = [
    {
      id: 'email',
      icon: 'pi pi-envelope',
      title: 'Email',
      content: 'contacto@holisticacenter.com',
      severity: 'success',
      onClick: () => window.open('mailto:contacto@holisticacenter.com')
    },
    {
      id: 'phone',
      icon: 'pi pi-phone',
      title: 'Teléfono',
      content: '+593 99 123 4567',
      severity: 'info',
      onClick: () => window.open('tel:+593991234567')
    },
    {
      id: 'address',
      icon: 'pi pi-map-marker',
      title: 'Dirección',
      content: 'Av. Amazonas y Colón, Quito',
      severity: 'warning',
      onClick: () => window.open('https://maps.google.com/?q=Av.+Amazonas+y+Colón,+Quito', '_blank', 'noopener')
    }
  ];

  const socialNetworks = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: 'pi pi-whatsapp',
      url: 'https://chat.whatsapp.com/DKUeRaOpLTeEWAmE8gpvhI',
      color: '#25D366'
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: 'pi pi-facebook',
      url: 'https://facebook.com/holisticacenter',
      color: '#1877F2'
    },
    {
      id: 'instagram',
      label: 'Instagram',
      icon: 'pi pi-instagram',
      url: 'https://instagram.com/holisticacenter',
      color: '#E4405F'
    }
  ];

  const faqData = [
    {
      id: 'faq-1',
      question: '¿Cómo me inscribo a un curso?',
      answer: 'Puedes inscribirte directamente desde la página del curso o contactarnos para asistencia personalizada.'
    },
    {
      id: 'faq-2',
      question: '¿Ofrecen certificados?',
      answer: 'Sí, todos nuestros cursos incluyen certificación oficial con triple aval comercial.'
    },
    {
      id: 'faq-3',
      question: '¿Hay modalidades online?',
      answer: 'Ofrecemos modalidades presencial, semipresencial y completamente online para tu conveniencia.'
    }
  ];

  const handleFormSubmit = async (formData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Contact form submitted:', formData);
  };

  const renderHeroSection = () => (
    <div className="contact-hero gradient-blue">
      <div className="hero-content">
        <h1 className="hero-title flex-center">
          <i className="hero-icon pi pi-comments"></i>
          {' '}Contáctanos
        </h1>
        <p className="hero-subtitle">
        {' '} Estamos aquí para ayudarte en tu journey de aprendizaje
        </p>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="contact-cards">
      {contactInfo.map((info) => (
        <ContactInfoCard
          key={info.id}
          icon={info.icon}
          title={info.title}
          content={info.content}
          severity={info.severity}
          onClick={info.onClick}
        />
      ))}
    </div>
  );

  const renderSocialNetworks = () => (
    <Panel 
      header={<div className="panel-header flex-center"><i className="pi pi-share-alt"></i> Síguenos</div>}
      className="social-panel card-elevated"
    >
      <div className="social-networks">
        {socialNetworks.map((social) => (
          <Button
            key={social.id}
            label={social.label}
            icon={social.icon}
            className="social-button rounded-lg hover-lift"
            style={{ '--social-color': social.color }}
            onClick={() => window.open(social.url, '_blank', 'noopener')}
          />
        ))}
      </div>
    </Panel>
  );

  const renderFAQ = () => (
    <Panel 
      header={<div className="panel-header flex-center"><i className="pi pi-question-circle"></i> Preguntas Frecuentes</div>}
      className="faq-panel card-elevated"
    >
      <div className="faq-content">
        {faqData.map((faq) => (
          <div key={faq.id} className="faq-item">
            <h5>{faq.question}</h5>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </Panel>
  );

  const renderWhatsAppCTA = () => (
    <div className="whatsapp-cta gradient-green rounded-2xl shadow-soft">
      <div className="whatsapp-content">
        <div className="whatsapp-icon icon-container icon-success">
          <i className="pi pi-whatsapp"></i>
        </div>
        <div className="whatsapp-text">
          <h4>¿Necesitas ayuda inmediata?</h4>
          <p>Chatea con nosotros en WhatsApp</p>
        </div>
        <Button
          label="Abrir Chat"
          icon="pi pi-whatsapp"
          className="whatsapp-button btn-whatsapp rounded-lg hover-lift"
          onClick={() => window.open('https://chat.whatsapp.com/DKUeRaOpLTeEWAmE8gpvhI', '_blank', 'noopener')}
        />
      </div>
    </div>
  );

  return (
    <div className="contact-container">
      <Toast ref={toast} />
      
      {renderHeroSection()}
      
      <div className="contact-content">
        <div className="contact-grid">
          {/* Left Section - Contact Form */}
          <div className="contact-form-section">
            <ContactForm
              onSubmit={handleFormSubmit}
              toast={toast}
              title="Soporte Técnico"
              subtitle="Describe tu consulta y nuestro equipo te ayudará"
              submitLabel="Enviar Consulta"
            />
          </div>

          {/* Right Section - Contact Information */}
          <div className="contact-info-section">
            {renderContactInfo()}
            {renderSocialNetworks()}
            {renderFAQ()}
            {renderWhatsAppCTA()}
          </div>
        </div>
      </div>
    </div>
  );
}