import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

export default function Footer() {
  return (
    <footer className="footer-modern mt-auto">
      <div className="footer-content surface-100 p-6">
        <div className="grid">
          {/* Company Info */}
          <div className="col-12 md:col-4 mb-4">
            <div className="footer-section">
              <h4 className="text-primary mb-3 font-bold flex align-items-center">
                <i className="pi pi-building mr-2"></i>
                Nuestra Historia
              </h4>
              <div className="flex flex-column gap-2">
                <a href="#" className="footer-link flex align-items-center">
                  <i className="pi pi-briefcase mr-2 text-primary"></i>
                  Atención a Empresas
                </a>
                <a href="#" className="footer-link flex align-items-center">
                  <i className="pi pi-shop mr-2 text-primary"></i>
                  Adquirir un Punto de Venta
                </a>
                <a href="#" className="footer-link flex align-items-center">
                  <i className="pi pi-info-circle mr-2 text-primary"></i>
                  Acerca de Nosotros
                </a>
              </div>
            </div>
          </div>

          {/* Contact & Legal */}
          <div className="col-12 md:col-4 mb-4">
            <div className="footer-section">
              <h4 className="text-primary mb-3 font-bold flex align-items-center">
                <i className="pi pi-phone mr-2"></i>
                Contacto & Legal
              </h4>
              <div className="flex flex-column gap-2">
                <a href="#" className="footer-link flex align-items-center">
                  <i className="pi pi-file-text mr-2 text-primary"></i>
                  Términos y Condiciones
                </a>
                <a href="#" className="footer-link flex align-items-center">
                  <i className="pi pi-shield mr-2 text-primary"></i>
                  Política de Privacidad
                </a>
                <a href="mailto:jimarin@espe.edu.ec" className="footer-link flex align-items-center">
                  <i className="pi pi-envelope mr-2 text-primary"></i>
                  jimarin@espe.edu.ec
                </a>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="col-12 md:col-4 mb-4">
            <div className="footer-section">
              <h4 className="text-primary mb-3 font-bold flex align-items-center">
                <i className="pi pi-share-alt mr-2"></i>
                Síguenos
              </h4>
              <div className="flex flex-column gap-3">
                <Button 
                  label="Facebook" 
                  icon="pi pi-facebook" 
                  className="p-button-outlined p-button-sm social-btn facebook-btn"
                  onClick={() => window.open('https://www.facebook.com/profile.php?id=100009361808424', '_blank')}
                />
                <Button 
                  label="Instagram" 
                  icon="pi pi-instagram" 
                  className="p-button-outlined p-button-sm social-btn instagram-btn"
                  onClick={() => window.open('https://www.instagram.com/lum.massagebar/', '_blank')}
                />
                <Button 
                  label="YouTube" 
                  icon="pi pi-youtube" 
                  className="p-button-outlined p-button-sm social-btn youtube-btn"
                  onClick={() => window.open('https://www.youtube.com/watch?v=Riz724D2Dps', '_blank')}
                />
              </div>
            </div>
          </div>
        </div>

        <Divider className="my-4" />

        {/* Newsletter Section */}
        <div className="newsletter-section mb-4">
          <Card className="bg-primary-reverse border-primary">
            <div className="text-center">
              <h5 className="text-primary mb-3 font-bold">
                <i className="pi pi-envelope mr-2"></i>
                Mantente Informado
              </h5>
              <p className="text-600 mb-3">Recibe las últimas noticias sobre nuestros cursos y promociones</p>
              <Button 
                label="Contactar por WhatsApp" 
                icon="pi pi-whatsapp" 
                className="p-button-success"
                onClick={() => window.open('https://chat.whatsapp.com/DKUeRaOpLTeEWAmE8gpvhI', '_blank')}
              />
            </div>
          </Card>
        </div>

        <Divider className="my-4" />

        {/* Copyright */}
        <div className="copyright-section text-center">
          <div className="grid align-items-center">
            <div className="col-12 md:col-6">
              <p className="text-600 m-0">
                <i className="pi pi-users mr-2 text-primary"></i>
                Realizado por el grupo <strong className="text-primary">Alpha Team</strong>
              </p>
            </div>
            <div className="col-12 md:col-6">
              <p className="text-600 m-0">
                <i className="pi pi-question-circle mr-2 text-primary"></i>
                ¿Preguntas? 
                <a href="mailto:jimarin@espe.edu.ec" className="text-primary font-medium ml-1 no-underline hover:underline">
                  Contáctanos aquí
                </a>
              </p>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-top-1 surface-border">
            <p className="text-500 text-sm m-0">
              © 2024 Holística Center. Todos los derechos reservados. 
              <span className="ml-2">
                <i className="pi pi-heart text-red-500"></i> 
                Hecho con amor en Ecuador
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
