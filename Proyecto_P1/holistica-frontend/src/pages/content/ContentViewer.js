import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { Chip } from 'primereact/chip';
import { useAuth } from '../../hooks/useAuth';
import '../styles/ContentViewer.css';

export default function ContentViewer() {
  const { courseId, contentId } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);
  const { user } = useAuth();
  
  const [content, setContent] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadContent();
  }, [user, courseId, contentId, navigate]);

  const loadContent = async () => {
    try {
      setLoading(true);
      // Simular carga de contenido
      setTimeout(() => {
        setContent({
          id: contentId,
          title: 'Introducción al Masaje Terapéutico',
          type: 'video',
          url: 'https://example.com/video.mp4',
          description: 'En esta lección aprenderás los fundamentos básicos del masaje terapéutico.',
          duration: '15 min'
        });
        setCourse({
          id: courseId,
          name: 'Curso de Masaje Terapéutico'
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error(`Exception while loading content: ${error.message}`);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el contenido' });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="content-loading">
        <ProgressSpinner />
        <p>Cargando contenido...</p>
      </div>
    );
  }

  return (
    <div className="content-viewer-container">
      <Toast ref={toast} />
      
      <div className="content-header">
        <Button 
          label="← Volver al curso" 
          className="p-button-text"
          onClick={() => navigate(`/courses/${courseId}`)}
        />
        <h1>{course?.name}</h1>
      </div>

      <Card className="content-card">
        <div className="content-info">
          <div className="content-title">
            <h2>{content?.title}</h2>
            <div className="content-tags">
              <Tag value={content?.type} severity="info" />
              <Chip label={content?.duration} />
            </div>
          </div>
          <p>{content?.description}</p>
        </div>

        <div className="content-player">
          {content?.type === 'video' ? (
            <div className="video-placeholder">
              <i className="pi pi-play-circle"></i>
              <p>Reproductor de video</p>
              <p className="video-url">{content?.url}</p>
            </div>
          ) : (
            <div className="content-placeholder">
              <i className="pi pi-file"></i>
              <p>Contenido del curso</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
