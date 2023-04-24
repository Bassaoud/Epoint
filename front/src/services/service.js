import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001'
});

const printPdf = async (pdfFile) => {
  const formData = new FormData();
  formData.append('pdf_file', pdfFile);

  try {
    const response = await instance.post('/print_pdf', formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default { printPdf };
