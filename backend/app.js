const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Route for the certificate page
app.get('/certificate', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'public', 'certificate.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`Server running at http://localhost:${PORT}/`);
});
