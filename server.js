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

const PORT = process.env.PORT || 1234;
const DATA_FILE_TREATMENT = path.join(__dirname, 'data_treatment.json');
const DATA_FILE_STOCKFIT = path.join(__dirname, 'data_stockfit.json');

// Initialize data files if not exists
if (!fs.existsSync(DATA_FILE_TREATMENT)) {
    fs.writeFileSync(DATA_FILE_TREATMENT, JSON.stringify({}));
}
if (!fs.existsSync(DATA_FILE_STOCKFIT)) {
    fs.writeFileSync(DATA_FILE_STOCKFIT, JSON.stringify({}));
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Get data file path based on section
function getDataFile(section) {
    return section === 'treatment' ? DATA_FILE_TREATMENT : DATA_FILE_STOCKFIT;
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API: Get all data for a section
app.get('/api/data', (req, res) => {
    try {
        const section = req.query.section || 'treatment';
        const dataFile = getDataFile(section);
        const data = fs.readFileSync(dataFile, 'utf-8');
        res.json(JSON.parse(data));
    } catch (err) {
        console.error('Error reading data:', err);
        res.json({});
    }
});

// API: Update data for a section
app.post('/api/data', (req, res) => {
    try {
        const section = req.body.section || 'treatment';
        const data = req.body.data || req.body;
        const dataFile = getDataFile(section);
        
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
        console.log(`Data saved for ${section}:`, new Date().toLocaleTimeString());
        
        // Broadcast update ke semua client yang terhubung
        io.emit(`data_updated_${section}`, data);
        
        res.json({ success: true, message: 'Data saved successfully' });
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// API: Reset data for a section
app.post('/api/reset', (req, res) => {
    try {
        const section = req.body.section || 'treatment';
        const dataFile = getDataFile(section);
        
        fs.writeFileSync(dataFile, JSON.stringify({}));
        console.log(`Data reset for ${section}:`, new Date().toLocaleTimeString());
        
        // Broadcast reset ke semua client
        io.emit(`data_updated_${section}`, {});
        
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
        const dataTreatment = fs.readFileSync(DATA_FILE_TREATMENT, 'utf-8');
        const dataStockfit = fs.readFileSync(DATA_FILE_STOCKFIT, 'utf-8');
        socket.emit('data_updated_treatment', JSON.parse(dataTreatment));
        socket.emit('data_updated_stockfit', JSON.parse(dataStockfit));
    } catch (err) {
        socket.emit('data_updated_treatment', {});
        socket.emit('data_updated_stockfit', {});
    }
    
    socket.on('disconnect', () => {
        console.log(`✗ Client disconnect: ${socket.id}`);
    });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log(`\n╔════════════════════════════════════════════════════════╗`);
    console.log(`║  SF Production Kanban Status System (Multi-Section)     ║`);
    console.log(`║  ✓ Real-Time Update Enabled                              ║`);
    console.log(`║  ✓ Treatment Area & StockFit Support                     ║`);
    console.log(`╠══════════════════════════════════════════════════════════╣`);
    console.log(`║  Server running on:                                      ║`);
    console.log(`║  Local:    http://localhost:${PORT}${''.padEnd(23 - PORT.toString().length, ' ')}║`);
    console.log(`║  Network:  http://${localIP}:${PORT}${''.padEnd(18 - PORT.toString().length, ' ')}║`);
    console.log(`║  Railway:  https://sf-kanban.up.railway.app/             ║`);
    console.log(`║                                                          ║`);
    console.log(`║  📱 Buka IP address di perangkat lain untuk real-time   ║`);
    console.log(`║  update otomatis tanpa refresh!                          ║`);
    console.log(`╚══════════════════════════════════════════════════════════╝\n`);
});
