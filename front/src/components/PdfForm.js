import React, { useState } from 'react';
import pdfService from './../services/service';

const PdfForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
  
    const formData = new FormData(event.target);
    try {
      await pdfService.printPdf(formData.get('pdf-file'));
    } catch (error) {
      console.error(error);
      setError('Erreur lors de l\'impression');
    } finally { 
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} method="POST">
      <label htmlFor="pdf-file">Fichier PDF :</label>
      <input type="file" id="pdf-file" name="pdf-file" accept=".pdf" required />

      <button type="submit" disabled={loading}>
        {loading ? 'Téléchargement en cours...' : 'Télécharger'}
      </button>

      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default PdfForm;
