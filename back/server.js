const express = require('express');
const multer = require('multer');
const app = express();
const pdfPrinter = require('pdf-to-printer');
const fs = require('fs');
const winston = require('winston');
const path = require('path');

// Winston pour créer un fichier de log
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, 'logs', 'app.log')
    })
  ]
});

app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Impression PDF</h1>
        <form action="/print_pdf" method="post" enctype="multipart/form-data">
          <input type="file" name="pdf_file" />
          <button type="submit">Imprimer</button>
        </form>
      </body>
    </html>
  `);
});

// Configuration de multer pour l'upload de fichiers
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, '../uploads');
    },
    filename: (req, file, callback) => {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear().toString().slice(-2);
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');

      callback(null, `${day}${month}${year}${hours}${minutes}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (file.mimetype !== 'application/pdf') {
      const errorMessage = 'Le fichier doit être au format PDF';
      callback(new Error(errorMessage));
      logger.error(errorMessage);

    } else {
      callback(null, true);
    }
  }
});

// Endpoint pour l'impression de PDF
app.post('/print_pdf', upload.single('pdf_file'), (req, res) => {
  if (!req.file) {
    res.status(400).send('Aucun fichier n\'a été uploadé.');
    logger.error('Aucun fichier n\'a été uploadé.');

    return;
  }

  // Récupération du chemin du fichier PDF uploadé
  const pdfFilePath = req.file.path;

  // Impression du fichier PDF en mode silencieux
  pdfPrinter.print(pdfFilePath, {
    printer: "Epson 6526",
    success: function(jobID) {
      console.log(`Impression lancée avec succès. Job ID : ${jobID}`);
      res.sendStatus(200);
    },
    error: function(err) {
      console.error('Erreur lors de l\'impression :', err);
      res.status(500).send('Erreur lors de l\'impression du fichier PDF');
      logger.error('Erreur lors de l\'impression du fichier PDF');
    }
  });
});


// Configuration du serveur pour écouter les requêtes sur le port 3001
app.listen(3001, () => {
  console.log('Serveur démarré sur le port 3001');
});
