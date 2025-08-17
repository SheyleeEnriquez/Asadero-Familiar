import React from 'react';
import axios from 'axios';

const Reports = () => {
  const handleDownloadPDF = async () => {
    try {
      const response = await axios.get('http://localhost:3030/api/reports/pdf', {
        responseType: 'blob' // 👈 Importante para recibir el PDF como archivo binario
      });

      // Crear URL para descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reporte-ventas.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error descargando el PDF:', error);
    }
  };

  return (
    <div>
      <h2>Reportes</h2>
      <p>Aquí se mostrarán los reportes y estadísticas.</p>
      <button onClick={handleDownloadPDF}>📄 Descargar reporte PDF</button>
    </div>
  );
};

export default Reports;
