const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function refreshAccessToken() {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
  );

  const tokens = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'tokens.json')));

  oAuth2Client.setCredentials({
    refresh_token: tokens.refresh_token,
  });

  try {
    const newToken = await oAuth2Client.getAccessToken();
    tokens.access_token = newToken.token;
    tokens.expiry_date = new Date().getTime() + newToken.res.data.expires_in * 1000;

    fs.writeFileSync(path.resolve(__dirname, 'tokens.json'), JSON.stringify(tokens, null, 2));
    console.log("Tokens refreshed successfully:", tokens);
  } catch (error) {
    console.error("Failed to refresh tokens:", error);
  }
}

refreshAccessToken();
