const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');


const app = express();
app.use(express.json());
app.use(cookieParser());

// Mount API modules under dedicated prefixes.
app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);

const projectRoot = path.join(__dirname, '..', '..');
const frontendDistPath = path.join(projectRoot, 'frontend', 'dist');
const legacyFrontendPath = path.join(projectRoot, 'Frontend');
// Prefer the built frontend when it exists, otherwise serve the source app folder.
const staticPath = fs.existsSync(frontendDistPath) ? frontendDistPath : legacyFrontendPath;

app.use(express.static(staticPath));

// Let the frontend router handle every non-API route.
app.get(/^\/(?!api(?:\/|$)).*/, (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});


module.exports = app;
