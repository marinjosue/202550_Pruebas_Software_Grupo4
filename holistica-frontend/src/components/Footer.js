import React from 'react';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer-modern mt-auto">
      <div className="footer-content p-5">
        <div className="grid footer-top">
          {/* Sección de la Compañía */}
          <div className="col-12 md:col-4 lg:col-3">
            <section className="footer-section">
              <h4 className="footer-heading">
                <i className="pi pi-building"></i>
                Nuestra Historia
              </h4>
              <nav className="footer-links">
                <a href="#!" className="footer-link">
                  <i className="pi pi-briefcase"></i>
                  Atención a Empresas
                </a>
                <a href="#!" className="footer-link">
                  <i className="pi pi-shop"></i>
                  Adquirir un Punto de Venta
                </a>
                <a href="#!" className="footer-link">
                  <i className="pi pi-info-circle"></i>
                  Acerca de Nosotros
                </a>
              </nav>
            </section>
          </div>

          {/* Sección de Contacto y Legal */}
          <div className="col-12 md:col-4 lg:col-3">
            <section className="footer-section">
              <h4 className="footer-heading">
                <i className="pi pi-phone"></i>
                Contacto & Legal
              </h4>
              <nav className="footer-links">
                <a href="#!" className="footer-link">
                  <i className="pi pi-book"></i>
                  Términos y Condiciones
                </a>


                <a href="#!" className="footer-link">
                  <i className="pi pi-shield"></i>
                  Política de Privacidad
                </a>
                <a href="mailto:jimarin@espe.edu.ec" className="footer-link">
                  <i className="pi pi-envelope"></i>
                  jimarin@espe.edu.ec
                </a>
              </nav>
            </section>
          </div>

          {/* Sección de Redes Sociales */}
          <div className="col-12 md:col-4 lg:col-3">
            <section className="footer-section">
              <h4 className="footer-heading">
                <i className="pi pi-share-alt"></i>
                Síguenos
              </h4>
              <div className="social-buttons-container">
                <Button
                  icon="pi pi-facebook"
                  className="p-button-rounded p-button-outlined social-btn facebook-btn"
                  onClick={() =>
                    window.open('https://www.facebook.com/profile.php?id=100009361808424', '_blank', 'noopener')
                  }
                  aria-label="Facebook"
                />
                <Button
                  icon="pi pi-instagram"
                  className="p-button-rounded p-button-outlined social-btn instagram-btn"
                  onClick={() =>
                    window.open('https://www.instagram.com/lum.massagebar/', '_blank', 'noopener')
                  }
                  aria-label="Instagram"
                />
                <Button
                  icon="pi pi-youtube"
                  className="p-button-rounded p-button-outlined social-btn youtube-btn"
                  onClick={() =>
                    window.open('https://www.youtube.com/watch?v=Riz724D2Dps', '_blank', 'noopener')
                  }
                  aria-label="YouTube"
                />
              </div>
            </section>
          </div>

          {/* Sección de Contacto */}
          <div className="col-12 lg:col-3">
            <section className="footer-section">
              <h4 className="footer-heading">
                <i className="pi pi-envelope"></i>
                Contáctanos
              </h4>
              <div className="flex flex-column gap-2">
                <p className="text-sm m-0 newsletter-copy">
                  Recibe las últimas noticias sobre nuestros cursos y promociones.
                </p>
                <div className="p-inputgroup newsletter-input-group">
                  <InputText placeholder="Correo electrónico" />
                  <Button icon="pi pi-send" className="p-button" />
                </div>

                {/* WhatsApp separado: botón (solo ícono) + texto enlace */}
                <div className="whatsapp-row">
                  <Button
                    icon="pi pi-whatsapp"
                    className="p-button-rounded p-button-outlined whatsapp-icon-btn"
                    onClick={() =>
                      window.open('https://chat.whatsapp.com/DKUeRaOpLTeEWAmE8gpvhI', '_blank', 'noopener')
                    }
                    aria-label="Abrir WhatsApp"
                  />
                  <a
                    href="https://chat.whatsapp.com/DKUeRaOpLTeEWAmE8gpvhI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-text-link"
                  >
                    Contactar por WhatsApp
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>

        <Divider className="my-4" />

        {/* Sección de Copyright */}
        <div className="copyright-section text-center">
          <div className="grid align-items-center">
            <div className="col-12 md:col-6 text-md-left">
              <p className="text-sm m-0">
                <i className="pi pi-users mr-2"></i>
                Realizado por el grupo <strong>Alpha Team</strong>
              </p>
            </div>
            <div className="col-12 md:col-6 text-md-right">
              <p className="text-sm m-0">
                <i className="pi pi-question-circle mr-2"></i>
                ¿Preguntas?
                <a
                  href="mailto:jimarin@espe.edu.ec"
                  className="text-primary font-medium ml-1 no-underline hover:underline"
                >
                  Contáctanos aquí
                </a>
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-top-1 surface-border">
            <p className="text-xs m-0">
              © 2024 Holística Center. Todos los derechos reservados.
              <span className="ml-2">
                <i className="pi pi-heart text-pink-500 mx-1"></i>
                Hecho con amor en Ecuador
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
