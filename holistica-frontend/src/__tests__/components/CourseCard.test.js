import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CourseCard from '../../components/CourseCard';

describe('CourseCard', () => {
  const mockCourse = {
    id: '1',
    name: 'React Fundamentals',
    start_date: '2025-09-01',
    end_date: '2025-10-01',
    duration: 40,
    description: 'Learn React from scratch',
    price: 99.99
  };

  const mockOnEnroll = jest.fn();
  const mockOnInfo = jest.fn();

  test('renders course information correctly', () => {
    render(
      <CourseCard 
        course={mockCourse} 
        onEnroll={mockOnEnroll} 
        onInfo={mockOnInfo} 
      />
    );

    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    expect(screen.getByText(/Fecha Inicio:/)).toBeInTheDocument();
    expect(screen.getByText(/2025-09-01/)).toBeInTheDocument();
    expect(screen.getByText(/Fecha Fin:/)).toBeInTheDocument();
    expect(screen.getByText(/2025-10-01/)).toBeInTheDocument();
    expect(screen.getByText(/Duración:/)).toBeInTheDocument();
    expect(screen.getByText(/40 horas/)).toBeInTheDocument();
    expect(screen.getByText(/Descripcion:/)).toBeInTheDocument(); // Corregido para usar "Descripcion" sin tilde
    expect(screen.getByText(/Learn React from scratch/)).toBeInTheDocument();
    expect(screen.getByText(/Precio:/)).toBeInTheDocument();
    expect(screen.getByText(/\$99.99/)).toBeInTheDocument();
  });

  test('calls onEnroll when Inscribirse button is clicked', () => {
    render(
      <CourseCard 
        course={mockCourse} 
        onEnroll={mockOnEnroll} 
        onInfo={mockOnInfo} 
      />
    );

    fireEvent.click(screen.getByText('Inscribirse'));
    expect(mockOnEnroll).toHaveBeenCalledWith('1');
  });

  test('calls onInfo when Información button is clicked', () => {
    render(
      <CourseCard 
        course={mockCourse} 
        onEnroll={mockOnEnroll} 
        onInfo={mockOnInfo} 
      />
    );

    fireEvent.click(screen.getByText('Información'));
    expect(mockOnInfo).toHaveBeenCalledWith('1');
  });
});
