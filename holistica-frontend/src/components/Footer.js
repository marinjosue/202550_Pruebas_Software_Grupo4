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
          {/* Company Info */}
          <div className="col-12 md:col-4 lg:col-3">
            <div className="footer-section">
              <h4 className="font-bold flex align-items-center">
                <i className="pi pi-building mr-2"></i>
                {' '}Nuestra Historia
              </h4>
              <div className="flex flex-column gap-2">
                <button type="button" className="footer-link flex align-items-center">
                  <i className="pi pi-briefcase mr-2 text-primary"></i>
                  {' '}Atención a Empresas
                </button>
                <button type="button" className="footer-link flex align-items-center">
                  <i className="pi pi-shop mr-2 text-primary"></i>
                  {' '}Adquirir un Punto de Venta
                </button>
                <button type="button" className="footer-link flex align-items-center">
                  <i className="pi pi-info-circle mr-2 text-primary"></i>
                  {' '}Acerca de Nosotros
                </button>
              </div>
            </div>
          </div>

          {/* Contact & Legal */}
          <div className="col-12 md:col-4 lg:col-3">
            <div className="footer-section">
              <h4 className="font-bold flex align-items-center">
                <i className="pi pi-phone mr-2"></i>
                {' '}Contacto & Legal
              </h4>
              <div className="flex flex-column gap-2">
                <button type="button" className="footer-link flex align-items-center">
                  <i className="pi pi-file-text mr-2 text-primary"></i>
                  {' '}Términos y Condiciones
                </button>
                <button type="button" className="footer-link flex align-items-center">
                  <i className="pi pi-shield mr-2 text-primary"></i>
                  {' '}Política de Privacidad
                </button>
                <a href="mailto:jimarin@espe.edu.ec" className="footer-link flex align-items-center">
                  <i className="pi pi-envelope mr-2 text-primary"></i>
                  {' '}jimarin@espe.edu.ec
                </a>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="col-12 md:col-4 lg:col-3">
            <div className="footer-section">
              <h4 className="font-bold flex align-items-center">
                <i className="pi pi-share-alt mr-2"></i>
                {' '}Síguenos
              </h4>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  icon="pi pi-facebook" 
                  className="p-button-rounded p-button-outlined social-btn facebook-btn"
                  onClick={() => window.open('https://www.facebook.com/profile.php?id=100009361808424', '_blank', 'noopener')}
                  aria-label="Facebook"
                />
                <Button 
                  icon="pi pi-instagram" 
                  className="p-button-rounded p-button-outlined social-btn instagram-btn"
                  onClick={() => window.open('https://www.instagram.com/lum.massagebar/', '_blank', 'noopener')}
                  aria-label="Instagram"
                />
                <Button 
                  icon="pi pi-youtube" 
                  className="p-button-rounded p-button-outlined social-btn youtube-btn"
                  onClick={() => window.open('https://www.youtube.com/watch?v=Riz724D2Dps', '_blank', 'noopener')}
                  aria-label="YouTube"
                />
              </div>
            </div>
          </div>

          {/* Newsletter & WhatsApp */}
          <div className="col-12 lg:col-3">
            <div className="footer-section">
              <h4 className="font-bold flex align-items-center">
                <i className="pi pi-envelope mr-2"></i>
                {' '}Contáctanos
              </h4>
              <div className="flex flex-column gap-3">
                <p className="text-sm m-0">Recibe las últimas noticias sobre nuestros cursos y promociones</p>
                <div className="p-inputgroup">
                  <InputText placeholder="Correo electrónico" />
                  <Button icon="pi pi-send" className="p-button" />
                </div>
                <Button 
                  label="Contactar por WhatsApp" 
                  icon="pi pi-whatsapp" 
                  className="p-button-success"
                  onClick={() => window.open('https://chat.whatsapp.com/DKUeRaOpLTeEWAmE8gpvhI', '_blank', 'noopener')}
                />
              </div>
            </div>
          </div>
        </div>

        <Divider className="my-4" />

        {/* Copyright */}
        <div className="copyright-section text-center">
          <div className="grid align-items-center">
            <div className="col-12 md:col-6 text-md-left">
              <p className="text-sm m-0">
                <i className="pi pi-users mr-2 text-primary"></i>
                {' '}Realizado por el grupo <strong>Alpha Team</strong>
              </p>
            </div>
            <div className="col-12 md:col-6 text-md-right">
              <p className="text-sm m-0">
                <i className="pi pi-question-circle mr-2 text-primary"></i>
                {' '}¿Preguntas? 
                <a href="mailto:jimarin@espe.edu.ec" className="text-primary font-medium ml-1 no-underline hover:underline">
                  Contáctanos aquí
                </a>
              </p>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-top-1 surface-border">
            <p className="text-xs m-0">
              © 2024 Holística Center. Todos los derechos reservados.
              {' '}
              <span className="ml-2">
                <i className="pi pi-heart text-pink-500 mx-1"></i>
                {' '}Hecho con amor en Ecuador
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
