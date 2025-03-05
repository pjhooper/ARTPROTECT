const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./Routes/auth');
const certificateRoutes = require('./Routes/certificate');

const app = express();
const port = process.env.PORT || 3000;

// Debug statements to verify environment variables
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

app.use(bodyParser.json());

// Serve static files from the PUBLIC directory
app.use(express.static(path.join(__dirname, '../PUBLIC')));

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1); // Exit the application with an error code
}

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB');
    console.error('Error details:', err);
  });

app.use('/api/auth', authRoutes);
app.use('/api/certificate', certificateRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../PUBLIC/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
