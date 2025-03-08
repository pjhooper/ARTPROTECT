const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Use dotenv to load environment variables from a .env file in the backend folder
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Function to create the nodemailer transport using OAuth2
function createTransportUsingOAuth2(tokens) {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token,
      expires: tokens.expiry_date,
    },
  });
}

// Function to refresh the OAuth2 token
async function refreshAccessToken(tokens) {
  console.log("Refreshing access token...");
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
  );

  oAuth2Client.setCredentials({
    refresh_token: tokens.refresh_token,
  });

  const newToken = await oAuth2Client.getAccessToken();
  console.log("New token received:", newToken.token);

  tokens.access_token = newToken.token;
  tokens.expiry_date = new Date().getTime() + newToken.res.data.expires_in * 1000;

  // Update tokens.json with the new tokens
  fs.writeFileSync(path.resolve(__dirname, 'tokens.json'), JSON.stringify(tokens, null, 2));
  console.log("Updated tokens.json with new tokens.");

  return tokens;
}

// Function to select the transport method
async function createTransport() {
  let tokens = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'tokens.json')));
  console.log("Read tokens from tokens.json:", tokens);

  if (new Date().getTime() > tokens.expiry_date) {
    console.log("Token expired, refreshing...");
    tokens = await refreshAccessToken(tokens);
  } else {
    console.log("Token is valid.");
  }
  return createTransportUsingOAuth2(tokens);
}

// Dummy data for user authentication and storage
const users = [];
const artistInfo = [];

// Authentication endpoint
app.post('/api/auth/signin', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password && u.verified);

  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Invalid username or password, or account not verified' });
  }
});

// Sign-up endpoint
app.post('/api/auth/signup', async (req, res) => {
  const { username, password } = req.body;
  const userExists = users.some(u => u.username === username);

  if (userExists) {
    res.json({ success: false, message: 'Username already exists' });
  } else {
    const newUser = { username, password, verified: false };
    users.push(newUser);

    const verificationLink = `http://localhost:${port}/api/auth/verify?username=${username}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: username,
      subject: 'Verify your account',
      text: `Click the following link to verify your account: ${verificationLink}`
    };

    try {
      const transporter = await createTransport();
      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);
      res.json({ success: false, message: 'Could not send verification email' });
    }
  }
});

// Email verification endpoint
app.get('/api/auth/verify', (req, res) => {
  const { username } = req.query;
  const user = users.find(u => u.username === username);

  if (user) {
    user.verified = true;
    res.send('Account verified! You can now sign in.');
  } else {
    res.send('Invalid verification link');
  }
});

// User details endpoint
app.get('/api/user/:username', (req, res) => {
  const { username } = req.params;
  const user = users.find(u => u.username === username);

  if (user) {
    res.json({ username: user.username, email: user.username });
  } else {
    res.status(404).send('User not found');
  }
});

// User certificates endpoint
app.get('/api/user/:username/certificates', (req, res) => {
  const { username } = req.params;
  const user = users.find(u => u.username === username);

  if (user) {
    res.json({ certificates: ['Certificate 1', 'Certificate 2', 'Certificate 3'] });
  } else {
    res.status(404).send('User not found');
  }
});

// Artist information endpoint
app.post('/api/artist_info', (req, res) => {
  const { artistName, artistEmail, artworkTitle, medium, dimensions, creationDate } = req.body;
  artistInfo.push({ artistName, artistEmail, artworkTitle, medium, dimensions, creationDate });
  res.json({ success: true });
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  console.log("Request to send email received:", req.body);
  const { to, subject, text } = req.body;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    const transporter = await createTransport();
    console.log("Transporter created, sending email...");
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: `Error sending email: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
