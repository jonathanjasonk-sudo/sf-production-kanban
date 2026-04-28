// Configuration
const LINES = ['E3', 'E4', 'E5', 'E6'];
const JAMS = ['JAM 1', 'JAM 2', 'JAM 3', 'JAM 4', 'JAM 5', 'JAM 6', 'JAM 7', 'JAM 8', 'JAM 9', 'JAM 10'];
const STORAGE_KEY = 'kanban_status';

// Initialize data
let kanbanData = {};
let selectedCell = null;

// WebSocket connection
let socket = null;
const connectionDot = document.getElementById('connectionDot');
const connectionText = document.getElementById('connectionText');

// DOM Elements
const modal = document.getElementById('statusModal');
const closeBtn = document.querySelector('.close');
const tableBody = document.getElementById('tableBody');
const statusButtons = document.querySelectorAll('.status-btn');
const resetBtn = document.getElementById('resetBtn');

// Initialize Socket.IO Connection
function initializeSocket() {
    socket = io();
    
    socket.on('connect', () => {
        console.log('✓ Terhubung ke server (Real-time enabled)');
        connectionDot.className = 'connection-dot online';
        connectionText.textContent = 'LIVE';
        connectionText.style.color = '#27ae60';
    });
    
    socket.on('disconnect', () => {
        console.log('✗ Putus koneksi dari server');
        connectionDot.className = 'connection-dot offline';
        connectionText.textContent = 'OFFLINE';
        connectionText.style.color = '#e74c3c';
    });
    
    // Listen untuk update data dari server
    socket.on('data_updated', (data) => {
        console.log('📊 Data terupdate dari server:', data);
        kanbanData = data;
        initializeTable();
    });
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeSocket();
    initializeTable();
    setupEventListeners();
});

// Initialize table
function initializeTable() {
    tableBody.innerHTML = '';
    
    LINES.forEach(line => {
        const row = document.createElement('tr');
        const lineCell = document.createElement('td');
        lineCell.textContent = line;
        lineCell.className = 'line-name';
        row.appendChild(lineCell);
        
        JAMS.forEach((jam, jamIndex) => {
            const cell = document.createElement('td');
            const cellKey = `${line}-${jamIndex}`;
            const status = kanbanData[cellKey] || 'EMPTY';
            
            const circle = document.createElement('div');
            circle.className = `status-circle ${status.toLowerCase()}`;
            circle.textContent = getStatusLabel(status);
            circle.dataset.line = line;
            circle.dataset.jam = jamIndex;
            circle.onclick = (e) => openModal(e, cellKey);
            
            cell.appendChild(circle);
            row.appendChild(cell);
        });
        
        tableBody.appendChild(row);
    });
}

// Get status label
function getStatusLabel(status) {
    const labels = {
        'GREEN': '',
        'GREEN-OK': 'OK',
        'YELLOW': '≥50%',
        'RED': '<50%',
        'EMPTY': '-'
    };
    return labels[status] || '-';
}

// Open modal
function openModal(e, cellKey) {
    selectedCell = cellKey;
    modal.style.display = 'block';
    
    // Highlight current status
    statusButtons.forEach(btn => {
        btn.style.backgroundColor = 'white';
        const currentStatus = kanbanData[cellKey] || 'EMPTY';
        if (btn.dataset.status === currentStatus) {
            btn.style.backgroundColor = '#e8f5e9';
            btn.style.borderColor = '#27ae60';
        }
    });
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    selectedCell = null;
}

// Setup event listeners
function setupEventListeners() {
    closeBtn.onclick = closeModal;
    
    window.onclick = (event) => {
        if (event.target === modal) {
            closeModal();
        }
    };
    
    statusButtons.forEach(btn => {
        btn.onclick = (e) => {
            const status = e.currentTarget.dataset.status;
            updateStatus(selectedCell, status);
            closeModal();
        };
    });
    
    resetBtn.onclick = () => {
        if (confirm('Apakah Anda yakin ingin mereset semua data? Tindakan ini tidak bisa dibatalkan.')) {
            resetAllData();
        }
    };
}

// Update status
function updateStatus(cellKey, status) {
    kanbanData[cellKey] = status;
    saveData();
    updateCell(cellKey, status);
}

// Save data to server via API
function saveData() {
    fetch('/api/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(kanbanData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('✓ Data tersimpan di server');
        }
    })
    .catch(err => {
        console.error('✗ Error saving data:', err);
    });
}

// Load data from server (called saat pertama connect)
function loadData() {
    fetch('/api/data')
    .then(response => response.json())
    .then(data => {
        kanbanData = data;
        initializeTable();
    })
    .catch(err => {
        console.error('Error loading data:', err);
    });
}

// Update cell display
function updateCell(cellKey, status) {
    const [line, jam] = cellKey.split('-');
    const jamIndex = parseInt(jam);
    const rowIndex = LINES.indexOf(line);
    
    if (rowIndex !== -1) {
        const row = tableBody.rows[rowIndex];
        const cell = row.cells[jamIndex + 1]; // +1 because first cell is line name
        
        if (cell) {
            const circle = cell.querySelector('.status-circle');
            if (circle) {
                circle.className = `status-circle ${status.toLowerCase()}`;
                circle.textContent = getStatusLabel(status);
            }
        }
    }
}

// Reset all data
function resetAllData() {
    if (confirm('Apakah Anda yakin ingin mereset semua data? Tindakan ini tidak bisa dibatalkan.')) {
        fetch('/api/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                kanbanData = {};
                initializeTable();
                alert('Semua data telah direset!');
                console.log('✓ Data direset berhasil');
            }
        })
        .catch(err => {
            console.error('Error resetting data:', err);
            alert('Gagal mereset data!');
        });
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
