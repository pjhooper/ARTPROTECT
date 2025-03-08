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
require('dotenv').config({ path: path.resolve(__dirname, 'backend', '.env') });

// Function to create the nodemailer transport using the app password
function createTransportUsingAppPassword() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your actual email from environment variable
      pass: process.env.EMAIL_PASS  // Your generated app password from environment variable
    }
  });
}

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
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
  );

  oAuth2Client.setCredentials({
    refresh_token: tokens.refresh_token,
  });

  const newToken = await oAuth2Client.getAccessToken();
  tokens.access_token = newToken.token;
  tokens.expiry_date = new Date().getTime() + newToken.res.data.expires_in * 1000;

  // Update tokens.json with the new tokens
  fs.writeFileSync(path.resolve(__dirname, 'tokens.json'), JSON.stringify(tokens, null, 2));

  return tokens;
}

// Function to select the transport method
async function createTransport() {
  if (process.env.USE_OAUTH2 === 'true') {
    let tokens = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'tokens.json')));
    if (new Date().getTime() > tokens.expiry_date) {
      tokens = await refreshAccessToken(tokens);
    }
    console.log("Using OAuth2 with tokens:", tokens);
    return createTransportUsingOAuth2(tokens);
  } else {
    console.log("Using App Password");
    return createTransportUsingAppPassword();
  }
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
      from: process.env.EMAIL_USER, // Your actual email from environment variable
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
    res.json({ certificates: ['Certificate 1', 'Certificate 2', 'Certificate 3'] }); // Dummy certificates
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
  const { to, subject, text } = req.body;
  const mailOptions = {
    from: process.env.EMAIL_USER, // Your actual email from environment variable
    to,
    subject,
    text,
  };

  try {
    const transporter = await createTransport();
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
