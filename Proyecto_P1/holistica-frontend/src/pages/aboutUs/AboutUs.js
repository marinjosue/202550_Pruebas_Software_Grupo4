import React from 'react';
import '../../styles/aboutUs.css';

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      {/* Hero Section */}
      <section className="aboutus-hero">
        <div className="aboutus-hero-content">
          <h1 className="aboutus-title">
            <span role="img" aria-label="Lotus">🌸</span>
            Sobre Nosotros
          </h1>
          <p className="aboutus-subtitle">
            Transformando vidas a través del arte del masaje y el bienestar integral.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="aboutus-content">
        <section className="aboutus-section">
          <h2>Nuestra Historia</h2>
          <p>
            Fundada en 2024, Holística nació con la misión de compartir el conocimiento y la pasión por los masajes terapéuticos. Nuestro equipo está conformado por profesionales certificados con años de experiencia en el área de la salud y el bienestar.
          </p>
        </section>

        <section className="aboutus-section">
          <h2>Nuestro Equipo</h2>
          <ul className="aboutus-team-list">
            <li>
              <strong>María López</strong> – Fundadora y Terapeuta Principal
            </li>
            <li>
              <strong>Carlos Pérez</strong> – Instructor de Masaje Deportivo
            </li>
            <li>
              <strong>Lucía Gómez</strong> – Coordinadora Académica
            </li>
            {/* Agrega más miembros según sea necesario */}
          </ul>
        </section>

        <section className="aboutus-section">
          <h2>Nuestra Misión</h2>
          <p>
            Brindar formación de calidad en técnicas de masaje, promoviendo el bienestar físico y emocional de nuestros estudiantes y sus futuros clientes.
          </p>
        </section>

        <section className="aboutus-section">
          <h2>Valores</h2>
          <ul className="aboutus-values-list">
            <li>Profesionalismo</li>
            <li>Empatía</li>
            <li>Innovación</li>
            <li>Respeto</li>
            <li>Compromiso con el bienestar</li>
          </ul>
        </section>

        <section className="aboutus-section">
          <h2>¿Por qué elegirnos?</h2>
          <ul className="aboutus-why-list">
            <li>Instructores certificados y con experiencia.</li>
            <li>Metodología práctica y personalizada.</li>
            <li>Certificación reconocida.</li>
            <li>Comunidad de apoyo y aprendizaje continuo.</li>
          </ul>
        </section>

        <section className="aboutus-section aboutus-cta">
          <h2>¡Únete a nuestra comunidad!</h2>
          <p>
            Descubre cómo nuestros cursos pueden transformar tu vida profesional y personal.
          </p>
          <a href="/contact" className="aboutus-button">Contáctanos</a>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;