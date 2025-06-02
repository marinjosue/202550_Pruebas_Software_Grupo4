import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { getCourseReports } from '../../services/reportService';
import '../../styles/CourseReports.css';

const CourseReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const toast = React.useRef(null);

  const loadReports = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCourseReports();
      // Asegurar que data sea un array
      const reportsArray = Array.isArray(data) ? data : [];
      setReports(reportsArray);
      updateChartData(reportsArray);
    } catch (error) {
      console.error('Error loading reports:', error);
      setReports([]); // Establecer array vacío en caso de error
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
    initChart();
  }, [loadReports]);

  const updateChartData = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      setChartData({
        labels: ['Sin datos'],
        datasets: [
          {
            label: 'Vendidos',
            data: [0],
            backgroundColor: '#10B981',
            borderColor: '#059669',
            borderWidth: 1
          },
          {
            label: 'Abandonados',
            data: [0],
            backgroundColor: '#EF4444',
            borderColor: '#DC2626',
            borderWidth: 1
          }
        ]
      });
      return;
    }

    const labels = data.map(item => item.courseName || `Curso ${item.courseId}`);
    const sold = data.map(item => item.sold || 0);
    const abandoned = data.map(item => item.abandoned || 0);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Vendidos',
          data: sold,
          backgroundColor: '#10B981',
          borderColor: '#059669',
          borderWidth: 1
        },
        {
          label: 'Abandonados',
          data: abandoned,
          backgroundColor: '#EF4444',
          borderColor: '#DC2626',
          borderWidth: 1
        }
      ]
    });
  };

  const initChart = () => {
    setChartOptions({
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Estadísticas de Cursos'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    });
  };

  const statusBodyTemplate = (rowData) => {
    const total = (rowData.sold || 0) + (rowData.abandoned || 0);
    const successRate = total > 0 ? ((rowData.sold || 0) / total * 100).toFixed(1) : 0;
    
    return (
      <div className="status-indicator">
        <span className="success-rate">{successRate}% éxito</span>
      </div>
    );
  };

  const salesBodyTemplate = (rowData) => {
    return <span className="sales-count">{rowData.sold || 0}</span>;
  };

  const abandonedBodyTemplate = (rowData) => {
    return <span className="abandoned-count">{rowData.abandoned || 0}</span>;
  };

  const revenueBodyTemplate = (rowData) => {
    return <span className="revenue-amount">${(rowData.revenue || 0).toFixed(2)}</span>;
  };

  if (loading) {
    return (
      <div className="reports-loading">
        <ProgressSpinner />
        <p>Cargando reportes...</p>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <Toast ref={toast} />
      
      <div className="reports-header">
        <h1><i className="pi pi-chart-bar"></i> Reportes de Cursos</h1>
        <p>Análisis de ventas y abandono de cursos</p>
      </div>

      <div className="reports-grid">
        <Card className="stats-card">
          <div className="stats-content">
            <div className="stat-item">
              <i className="pi pi-shopping-cart stat-icon sold"></i>
              <div className="stat-info">
                <h3>{Array.isArray(reports) ? reports.reduce((sum, r) => sum + (r.sold || 0), 0) : 0}</h3>
                <p>Total Vendidos</p>
              </div>
            </div>
            
            <div className="stat-item">
              <i className="pi pi-times-circle stat-icon abandoned"></i>
              <div className="stat-info">
                <h3>{Array.isArray(reports) ? reports.reduce((sum, r) => sum + (r.abandoned || 0), 0) : 0}</h3>
                <p>Total Abandonados</p>
              </div>
            </div>
            
            <div className="stat-item">
              <i className="pi pi-graduation-cap stat-icon courses"></i>
              <div className="stat-info">
                <h3>{Array.isArray(reports) ? reports.length : 0}</h3>
                <p>Cursos Activos</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="chart-card">
          <Chart type="bar" data={chartData} options={chartOptions} />
        </Card>
      </div>

      <Card className="table-card">
        <DataTable
          value={reports}
          className="reports-table"
          emptyMessage="No hay datos de reportes disponibles"
          paginator
          rows={10}
        >
          <Column 
            field="courseName" 
            header="Curso" 
            sortable 
            body={(rowData) => rowData.courseName || `Curso ${rowData.courseId}`}
          />
          <Column 
            header="Vendidos" 
            body={salesBodyTemplate}
            sortable
            sortField="sold"
          />
          <Column 
            header="Abandonados" 
            body={abandonedBodyTemplate}
            sortable
            sortField="abandoned"
          />
          <Column 
            header="Ingresos" 
            body={revenueBodyTemplate}
            sortable
            sortField="revenue"
          />
          <Column 
            header="Inscripciones" 
            field="enrollments"
            sortable
          />
          <Column 
            header="Tasa de Éxito" 
            body={statusBodyTemplate}
          />
        </DataTable>
      </Card>
    </div>
  );
};

export default CourseReports;
