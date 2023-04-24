import React, { useState } from 'react';
import './App.css';
import PdfForm from './components/PdfForm';

function App() {
  const [showPdfForm, setShowPdfForm] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrintButtonClick = () => {
    setShowPdfForm(true);
  };

  function handlePdfFormSubmit(e) {
    e.preventDefault(); 
  
    const formData = new FormData(e.target);
  
    fetch('/print_pdf', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        alert('Impression lancée avec succès !');
      } else {
        alert('Erreur lors de l\'impression.');
      }
    })
    .catch(error => {
      console.error('Erreur lors de l\'impression :', error);
      alert('Erreur lors de l\'impression.');
    });
  }
  

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handlePrintButtonClick}>Commencer impression</button>
        {showPdfForm && (
          <PdfForm
            onSubmit={handlePdfFormSubmit}
            onFileChange={(file) => setPdfFile(file)}
            uploadError={uploadError}
            isPrinting={isPrinting}
          />
        )}
      </header>
    </div>
  );
}

export default App;
