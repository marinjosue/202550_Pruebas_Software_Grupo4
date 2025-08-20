import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Footer from '../../components/Footer';

// Mock para window.open
const mockOpen = jest.fn();
window.open = mockOpen;

describe('Footer Component', () => {
  beforeEach(() => {
    mockOpen.mockClear();
  });

  test('renders footer sections correctly', () => {
    render(<Footer />);
    
    // Verifica que las secciones del footer existan
    expect(screen.getByText('Nuestra Historia')).toBeInTheDocument();
    expect(screen.getByText('Contacto & Legal')).toBeInTheDocument();
    expect(screen.getByText('Síguenos')).toBeInTheDocument();
    expect(screen.getByText('Contáctanos')).toBeInTheDocument();
  });

  test('renders social media buttons', () => {
    render(<Footer />);
    
    // Verifica que los botones de redes sociales existen
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
    expect(screen.getByLabelText('YouTube')).toBeInTheDocument();
  });

  test('renders contact information', () => {
    render(<Footer />);
    
    expect(screen.getByText('jimarin@espe.edu.ec')).toBeInTheDocument();
    expect(screen.getByText('Contactar por WhatsApp')).toBeInTheDocument();
  });

  test('opens social media links when buttons are clicked', async () => {
    const user = userEvent.setup();
    render(<Footer />);

    // Prueba el botón de Facebook
    const facebookButton = screen.getByLabelText('Facebook');
    await user.click(facebookButton);
    expect(mockOpen).toHaveBeenCalledWith(
      'https://www.facebook.com/profile.php?id=100009361808424',
      '_blank',
      'noopener'
    );
    
    // Prueba el botón de Instagram
    const instagramButton = screen.getByLabelText('Instagram');
    await user.click(instagramButton);
    expect(mockOpen).toHaveBeenCalledWith(
      'https://www.instagram.com/lum.massagebar/',
      '_blank',
      'noopener'
    );
  });

  test('displays copyright notice', () => {
    render(<Footer />);
    
    expect(screen.getByText(/© 2024 Holística Center. Todos los derechos reservados./)).toBeInTheDocument();
    expect(screen.getByText(/Hecho con amor en Ecuador/)).toBeInTheDocument();
  });
});
