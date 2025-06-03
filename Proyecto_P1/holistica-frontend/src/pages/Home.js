import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Carousel } from 'primereact/carousel';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import { Chip } from 'primereact/chip';
import { Image } from 'primereact/image';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';
import { Rating } from 'primereact/rating';
import { Avatar } from 'primereact/avatar';
import '../styles/Home.css';

export default function Home() {
  const toast = useRef(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const courses = [
    {
      id: 'presencial',
      title: 'PRESENCIAL',
      months: 7,
      classes: 28,
      hours: 3,
      frequency: '1 por semana',
      icon: 'pi pi-users',
      color: 'info',
      price: 299.99,
      originalPrice: 399.99,
      description: 'Modalidad presencial con interacción directa',
      features: ['Práctica directa', 'Supervisión personal', 'Networking'],
      rating: 4.8,
      students: 150,
      certificate: 'Certificado Profesional',
      level: 'Intermedio a Avanzado'
    },
    {
      id: 'semipresencial',
      title: 'SEMIPRESENCIAL',
      months: 5,
      classes: 20,
      hours: 2,
      frequency: '2 por semana',
      icon: 'pi pi-desktop',
      color: 'success',
      price: 199.99,
      originalPrice: 249.99,
      description: 'Combina lo mejor de presencial y online',
      features: ['Flexibilidad', 'Práctica guiada', 'Soporte online'],
      rating: 4.6,
      students: 230,
      certificate: 'Certificado Híbrido',
      level: 'Principiante a Intermedio'
    },
    {
      id: 'online',
      title: 'ONLINE',
      months: 3,
      classes: 12,
      hours: 1.5,
      frequency: '1 por semana',
      icon: 'pi pi-globe',
      color: 'warning',
      price: 99.99,
      originalPrice: 149.99,
      description: 'Aprende desde la comodidad de tu hogar',
      features: ['Horarios flexibles', 'Acceso 24/7', 'Recursos digitales'],
      rating: 4.4,
      students: 450,
      certificate: 'Certificado Digital',
      level: 'Principiante'
    }
  ];

  const includes = [
    { icon: 'pi pi-desktop', text: 'Acceso a nuestra plataforma de contenidos', highlight: true },
    { icon: 'pi pi-book', text: 'Material digital de estudio' },
    { icon: 'pi pi-flask', text: 'Materias especiales (Biología y Química)' },
    { icon: 'pi pi-verified', text: 'Exámenes parciales y finales' },
    { icon: 'pi pi-graduation-cap', text: 'Diploma y credencial profesional', highlight: true },
    { icon: 'pi pi-star-fill', text: 'Triple Aval Comercial (LACA – IFC – FACE)', highlight: true }
  ];

  const carouselImages = [
    { 
      id: 1,
      src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=500&fit=crop', 
      alt: 'Spa y Relajación',
      title: 'Técnicas de Relajación',
      subtitle: 'Aprende las mejores técnicas de masaje relajante',
      cta: 'Explorar Curso'
    },
    { 
      id: 2,
      src: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=1200&h=500&fit=crop', 
      alt: 'Masaje Terapéutico',
      title: 'Masaje Terapéutico',
      subtitle: 'Especialízate en tratamientos terapéuticos',
      cta: 'Ver Detalles'
    },
    { 
      id: 3,
      src: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&h=500&fit=crop', 
      alt: 'Cosmetología Avanzada',
      title: 'Cosmetología Avanzada',
      subtitle: 'Técnicas modernas de cuidado facial',
      cta: 'Inscríbete Ahora'
    },
    { 
      id: 4,
      src: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&h=500&fit=crop', 
      alt: 'Bienestar Integral',
      title: 'Bienestar Integral',
      subtitle: 'Enfoque holístico del cuidado personal',
      cta: 'Comenzar'
    }
  ];

  const testimonials = [
    {
      name: 'María González',
      comment: 'Excelente curso, los instructores son muy profesionales',
      rating: 5,
      course: 'Presencial',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Carlos Rodríguez',
      comment: 'La modalidad online me permitió estudiar mientras trabajo',
      rating: 4,
      course: 'Online',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Ana Martínez',
      comment: 'Perfecta combinación de teoría y práctica',
      rating: 5,
      course: 'Semipresencial',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setImagesLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const imageTemplate = (image) => {
    return (
      <div className="hero-slide" key={image.id}>
        <div className="hero-image-container">
          <Image 
            src={image.src} 
            alt={image.alt} 
            className="hero-image"
            preview={false}
          />
          <div className="hero-overlay">
            <div className="hero-content">
              <h2 className="hero-title">{image.title}</h2>
              <p className="hero-subtitle">{image.subtitle}</p>
              <Button 
                label={image.cta}
                className="hero-cta-button"
                onClick={() => document.getElementById('courses-section').scrollIntoView({ behavior: 'smooth' })}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleEnrollCourse = (course) => {
    setSelectedEnrollCourse(course);
    setShowEnrollDialog(true);
  };

  const handleConfirmEnroll = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Interés Registrado',
      detail: `Gracias por tu interés en ${selectedEnrollCourse.title}. Te contactaremos pronto.`,
      life: 4000
    });
    setShowEnrollDialog(false);
    setSelectedEnrollCourse(null);
  };

  const courseCard = (course) => {
    const isSelected = selectedCourse?.id === course.id;
    const discount = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
    
    return (
      <Card 
        key={course.id}
        className={`course-card ${isSelected ? 'course-card-selected' : ''}`}
        onClick={() => setSelectedCourse(isSelected ? null : course)}
      >
        <div className="course-header">
          <div className="course-header-left">
            <div className="course-icon-container">
              <i className={`${course.icon} course-icon`}></i>
            </div>
            <div className="course-basic-info">
              <h3 className="course-title">{course.title}</h3>
              <p className="course-description">{course.description}</p>
              <div className="course-meta">
                <Rating value={course.rating} readOnly cancel={false} className="course-rating" />
                <span className="course-students">({course.students} estudiantes)</span>
              </div>
            </div>
          </div>
          <div className="course-header-right">
            <div className="course-pricing">
              {discount > 0 && (
                <span className="original-price">${course.originalPrice}</span>
              )}
              <span className="current-price">${course.price}</span>
              {discount > 0 && (
                <Badge value={`-${discount}%`} severity="danger" className="discount-badge" />
              )}
            </div>
            <Badge value={`${course.months} meses`} severity={course.color} />
          </div>
        </div>

        {isSelected && (
          <div className="course-details-expanded">
            <Divider />
            
            <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
              <TabPanel header="Detalles" leftIcon="pi pi-info-circle">
                <div className="course-stats-grid">
                  <div className="stat-card stat-blue">
                    <div className="stat-number">{course.months}</div>
                    <div className="stat-label">Meses</div>
                  </div>
                  <div className="stat-card stat-green">
                    <div className="stat-number">{course.classes}</div>
                    <div className="stat-label">Clases</div>
                  </div>
                  <div className="stat-card stat-orange">
                    <div className="stat-number">{course.hours}</div>
                    <div className="stat-label">Horas</div>
                  </div>
                  <div className="stat-card stat-purple">
                    <div className="stat-number">{course.frequency.split(' ')[0]}</div>
                    <div className="stat-label">{course.frequency.split(' ').slice(1).join(' ')}</div>
                  </div>
                </div>

                <div className="course-info-grid">
                  <div className="info-item">
                    <i className="pi pi-graduation-cap info-icon"></i>
                    <div>
                      <strong>Nivel:</strong> {course.level}
                    </div>
                  </div>
                  <div className="info-item">
                    <i className="pi pi-certificate info-icon"></i>
                    <div>
                      <strong>Certificado:</strong> {course.certificate}
                    </div>
                  </div>
                </div>
              </TabPanel>

              <TabPanel header="Incluye" leftIcon="pi pi-check-circle">
                <div className="includes-grid">
                  {includes.map((item, index) => (
                    <div key={`include-${index}-${item.text.substring(0, 10).replace(/\s+/g, '')}`} className={`include-item ${item.highlight ? 'highlight' : ''}`}>
                      <i className={`${item.icon} include-icon`}></i>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </TabPanel>

              <TabPanel header="Características" leftIcon="pi pi-star">
                <div className="features-container">
                  {course.features.map((feature, index) => (
                    <Chip key={`feature-${course.id}-${index}-${feature.substring(0, 5).replace(/\s+/g, '')}`} label={feature} className="feature-chip" />
                  ))}
                </div>
              </TabPanel>
            </TabView>

            <div className="course-actions">
              <Button 
                label="¡Me Interesa!"
                icon="pi pi-heart"
                className="enroll-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnrollCourse(course);
                }}
              />
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="home-page">
      <Toast ref={toast} />
      
      {!imagesLoaded && (
        <div className="loading-overlay">
          <ProgressSpinner className="loading-spinner" />
          <p className="loading-text">Cargando contenido...</p>
        </div>
      )}

      {/* Hero Carousel */}
      <div className="hero-section">
        <Carousel 
          value={carouselImages} 
          itemTemplate={imageTemplate}
          numVisible={1}
          numScroll={1}
          autoplayInterval={5000}
          showNavigators={true}
          showIndicators={true}
          className="hero-carousel"
        />
      </div>

      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <h1 className="welcome-title">
            <span className="welcome-subtitle">Cursos de Cosmetología</span>
          </h1>
          <p className="welcome-description">
            Te damos la más cordial bienvenida a nuestra plataforma web, especializada en
            la oferta y venta de cursos de cosmetología, con un enfoque particular en el área de masajes.
            Aquí encontrarás una variedad de cursos diseñados para mejorar tus habilidades y conocimientos en
            técnicas de masaje relajación y terapéutico.
          </p>
          <div className="welcome-actions">
            <Button 
              label="CONTACTO VÍA WHATSAPP" 
              icon="pi pi-whatsapp" 
              className="whatsapp-button"
              onClick={() => window.open('https://chat.whatsapp.com/DKUeRaOpLTeEWAmE8gpvhI', '_blank', 'noopener')}
            />
            <Button 
              label="VER PROGRAMAS" 
              icon="pi pi-arrow-down" 
              className="programs-button"
              onClick={() => document.getElementById('courses-section').scrollIntoView({ behavior: 'smooth' })}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content" id="courses-section">
        <div className="content-grid">
          {/* Left Section - Course Options */}
          <div className="courses-section">
            <Card className="courses-card">
              <div className="section-header">
                <Image 
                  src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=300&fit=crop"
                  alt="Curso de Masajes Terapéuticos" 
                  className="section-image"
                  preview={true}
                />
                <h2 className="section-title">
                  <i className="pi pi-graduation-cap"></i>
                  {' '}Modalidades de Estudio
                </h2>
              </div>
              
              <div className="courses-list">
                {courses.map(courseCard)}
              </div>
            </Card>
          </div>

          {/* Right Section - Information */}
          <div className="info-section">
            {/* Objective Panel */}
            <Panel 
              header={
                <div className="panel-header">
                  <i className="pi pi-target"></i>
                  {' '}OBJETIVO DEL CURSO
                </div>
              } 
              className="info-panel"
              toggleable
            >
              <p className="objective-text">
                Sumérgete en el fascinante mundo de los masajes y adquiere un conocimiento profundo sobre la
                anatomía y fisiología humanas. Nuestro curso te proporcionará las herramientas necesarias para
                dominar técnicas avanzadas de masaje terapéutico y de relajación, ayudándote a aliviar
                tensiones, mejorar la circulación y promover el bienestar general.
              </p>
            </Panel>

            {/* Program Panel */}
            <Panel 
              header={
                <div className="panel-header">
                  <i className="pi pi-book"></i>
                  {' '}PROGRAMA ACADÉMICO
                </div>
              } 
              className="info-panel"
              toggleable
            >
              <p className="program-intro">Descarga el Programa Completo para Descubrir:</p>
              
              <Accordion multiple activeIndex={[0]} className="program-accordion">
                <AccordionTab 
                  header={
                    <div className="accordion-header">
                      <i className="pi pi-bookmark"></i>
                      {' '}<span>Programa Completo</span>
                    </div>
                  }
                >
                  <p>Detalles completos del programa de estudio, incluyendo talleres prácticos y materias teóricas.</p>
                </AccordionTab>
                <AccordionTab 
                  header={
                    <div className="accordion-header">
                      <i className="pi pi-eye"></i>
                      <span>Biotipos Cutáneos</span>
                    </div>
                  }
                >
                  <p>Profundización en temas clave como los biotipos cutáneos, las lesiones elementales y los fototipos cutáneos.</p>
                </AccordionTab>
                <AccordionTab 
                  header={
                    <div className="accordion-header">
                      <i className="pi pi-heart"></i>
                      <span>Técnicas Avanzadas</span>
                    </div>
                  }
                >
                  <p>Acceso a información privilegiada sobre técnicas avanzadas como peeling, revitalización cutánea y masaje eurítmico.</p>
                </AccordionTab>
              </Accordion>
              
              <div className="download-section">
                <Button 
                  label="Descargar Programa Completo"
                  icon="pi pi-download"
                  className="download-button"
                  onClick={() => toast.current.show({
                    severity: 'info',
                    summary: 'Programa Disponible',
                    detail: 'El programa estará disponible próximamente. ¡Contáctanos para más información!',
                    life: 3000
                  })}
                />
              </div>
            </Panel>

            {/* Certification Panel */}
            <Panel 
              header={
                <div className="panel-header">
                  <i className="pi pi-verified"></i>
                  {' '}CERTIFICACIÓN
                </div>
              } 
              className="info-panel"
              toggleable
            >
              <div className="certification-content">
                <div className="certification-badge">
                  <i className="pi pi-verified certification-icon"></i>
                  <h4>Triple Aval Comercial</h4>
                  <div className="certifications">
                    <Chip label="LACA" className="cert-chip" />
                    <Chip label="IFC" className="cert-chip" />
                    <Chip label="FACE" className="cert-chip" />
                  </div>
                </div>
                <p className="certification-description">
                  Nuestros cursos están respaldados por instituciones reconocidas a nivel nacional e internacional,
                  garantizando la calidad y validez de tu certificación profesional.
                </p>
              </div>
            </Panel>

            {/* Testimonials */}
            <Panel 
              header={
                <div className="panel-header">
                  <i className="pi pi-comments"></i>
                      {' '}TESTIMONIOS
                </div>
              } 
              className="info-panel"
              toggleable
            >
              <div className="testimonials-container">
                {testimonials.map((testimonial, index) => (
                  <div key={`testimonial-${testimonial.name.replace(/\s+/g, '')}-${index}`} className="testimonial-card">
                    <div className="testimonial-header">
                      <Avatar image={testimonial.avatar} size="large" />
                      <div className="testimonial-info">
                        <h5>{testimonial.name}</h5>
                        <span className="testimonial-course">{testimonial.course}</span>
                        <Rating value={testimonial.rating} readOnly cancel={false} />
                      </div>
                    </div>
                    <p className="testimonial-comment">"{testimonial.comment}"</p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>

      {/* Enrollment Dialog */}
      <Dialog 
        header="Confirmar Interés" 
        visible={showEnrollDialog} 
        onHide={() => setShowEnrollDialog(false)}
        className="enrollment-dialog"
        footer={
          <div>
            <Button 
              label="Cancelar" 
              icon="pi pi-times" 
              onClick={() => setShowEnrollDialog(false)} 
              className="p-button-text" 
            />
            <Button 
              label="Confirmar" 
              icon="pi pi-check" 
              onClick={handleConfirmEnroll} 
              autoFocus 
            />
          </div>
        }
      >
        {selectedEnrollCourse && (
          <div className="enrollment-content">
            <p>¿Estás interesado en el curso <strong>{selectedEnrollCourse.title}</strong>?</p>
            <p>Te contactaremos para brindarte más información y guiarte en el proceso de inscripción.</p>
          </div>
        )}
      </Dialog>
    </div>
  );
}
