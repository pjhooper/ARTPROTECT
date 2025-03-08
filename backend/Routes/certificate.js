const express = require('express');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, artTitle, creationDate, description } = req.body;

  // Create a PDF document
  const doc = new PDFDocument();
  let buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
    let pdfData = Buffer.concat(buffers);

    // Send email with PDF attachment
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Certificate of Authorship',
      text: 'Please find attached your Certificate of Authorship.',
      attachments: [
        {
          filename: 'certificate.pdf',
          content: pdfData
        }
      ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res.status(200).send('Certificate generated and emailed successfully!');
    });
  });

  // Add certificate content
  doc.fontSize(25).text('Certificate of Authorship', { align: 'center' });
  doc.moveDown();
  doc.fontSize(18).text(`This is to certify that ${name}`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(18).text(`is the author of the artwork titled "${artTitle}"`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(18).text(`created on ${creationDate}.`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Description:`, { align: 'left' });
  doc.fontSize(12).text(description, { align: 'left' });

  doc.end();
});

module.exports = router;