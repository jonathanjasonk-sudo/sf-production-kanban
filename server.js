const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');
const fs = require('fs');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data file if not exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}));
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API: Get all data
app.get('/api/data', (req, res) => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        res.json(JSON.parse(data));
    } catch (err) {
        console.error('Error reading data:', err);
        res.json({});
    }
});

// API: Update data
app.post('/api/data', (req, res) => {
    try {
        const data = req.body;
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        console.log('Data saved:', new Date().toLocaleTimeString());
        
        // Broadcast update ke semua client yang terhubung
        io.emit('data_updated', data);
        
        res.json({ success: true, message: 'Data saved successfully' });
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// API: Reset data
app.post('/api/reset', (req, res) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify({}));
        console.log('Data reset:', new Date().toLocaleTimeString());
        
        // Broadcast reset ke semua client
        io.emit('data_updated', {});
        
        res.json({ success: true, message: 'Data reset successfully' });
    } catch (err) {
        console.error('Error resetting data:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get local IP address
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

// WebSocket Connection Handler
io.on('connection', (socket) => {
    console.log(`✓ Client terhubung: ${socket.id}`);
    
    // Kirim data saat pertama kali connect
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        socket.emit('data_updated', JSON.parse(data));
    } catch (err) {
        socket.emit('data_updated', {});
    }
    
    socket.on('disconnect', () => {
        console.log(`✗ Client disconnect: ${socket.id}`);
    });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log(`\n╔════════════════════════════════════════════════════════╗`);
    console.log(`║  SF Production Kanban Status System                   ║`);
    console.log(`║  ✓ Real-Time Update Enabled                          ║`);
    console.log(`╠════════════════════════════════════════════════════════╣`);
    console.log(`║  Server running on:                                  ║`);
    console.log(`║  Local:    http://localhost:${PORT}${''.padEnd(23 - PORT.toString().length, ' ')}║`);
    console.log(`║  Network:  http://${localIP}:${PORT}${''.padEnd(18 - PORT.toString().length, ' ')}║`);
    console.log(`║                                                        ║`);
    console.log(`║  📱 Buka IP address di perangkat lain untuk real-time ║`);
    console.log(`║  update otomatis tanpa refresh!                       ║`);
    console.log(`╚════════════════════════════════════════════════════════╝\n`);
});
