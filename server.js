const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.set('trust proxy', true); // Trust proxy headers for real IP

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    console.log('➡️ Received GET / request'); // Debug print

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'unknown';
    const language = req.headers['accept-language'] || 'unknown';
    const referer = req.headers['referer'] || 'direct';
    const host = req.headers['host'] || 'unknown';

    const logEntry = {
        timestamp: new Date().toISOString(),
        ip,
        userAgent,
        language,
        referer,
        host
    };

    const logPath = path.join(__dirname, 'visitors.log');

    try {
        fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
        console.log(`✅ Logged visit: ${ip}`);
    } catch (err) {
        console.error('❌ Failed to write to log:', err);
    }

    res.sendFile(path.join(__dirname, 'index.html'));
});


app.listen(3001, () => console.log('🚀 Server running at http://localhost:3000'));
