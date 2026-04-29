// Configuration
const LINES = ['E3', 'E4', 'E5', 'E6'];
const JAMS = ['JAM 1', 'JAM 2', 'JAM 3', 'JAM 4', 'JAM 5', 'JAM 6', 'JAM 7', 'JAM 8', 'JAM 9', 'JAM 10'];
const STORAGE_KEY_TREATMENT = 'kanban_status_treatment';
const STORAGE_KEY_STOCKFIT = 'kanban_status_stockfit';
const SECTION_KEY = 'current_section';

// Initialize data
let kanbanData = {};
let selectedCell = null;
let currentSection = null; // 'TREATMENT' or 'STOCKFIT'

// WebSocket connection
let socket = null;
const connectionDot = document.getElementById('connectionDot');
const connectionText = document.getElementById('connectionText');

// DOM Elements
const modal = document.getElementById('statusModal');
const sectionModal = document.getElementById('sectionModal');
const closeBtn = document.querySelector('.close');
const tableBody = document.getElementById('tableBody');
const statusButtons = document.querySelectorAll('.status-btn');
const resetBtn = document.getElementById('resetBtn');
const switchSectionBtn = document.getElementById('switchSectionBtn');
const treatmentBtn = document.getElementById('treatmentBtn');
const stockfitBtn = document.getElementById('stockfitBtn');
const sectionLabel = document.getElementById('sectionLabel');

// Initialize Socket.IO Connection
function initializeSocket() {
    if (socket) {
        socket.disconnect();
    }
    
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
    
    // Listen untuk update data dari server berdasarkan section
    socket.on('data_updated_treatment', (data) => {
        if (currentSection === 'TREATMENT') {
            console.log('📊 Data Treatment terupdate dari server:', data);
            kanbanData = data;
            initializeTable();
        }
    });
    
    socket.on('data_updated_stockfit', (data) => {
        if (currentSection === 'STOCKFIT') {
            console.log('📊 Data StockFit terupdate dari server:', data);
            kanbanData = data;
            initializeTable();
        }
    });
}

// Get storage key based on current section
function getStorageKey() {
    return currentSection === 'TREATMENT' ? STORAGE_KEY_TREATMENT : STORAGE_KEY_STOCKFIT;
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check if section is already selected
    const savedSection = localStorage.getItem(SECTION_KEY);
    
    if (savedSection) {
        currentSection = savedSection;
        loadSectionData();
        initializeSocket();
        initializeTable();
        setupEventListeners();
        updateSectionLabel();
    } else {
        // Show section selection modal
        showSectionModal();
    }
});

// Show section selection modal
function showSectionModal() {
    sectionModal.style.display = 'block';
}

// Hide section selection modal
function hideSectionModal() {
    sectionModal.style.display = 'none';
}

// Select treatment area
function selectTreatment() {
    currentSection = 'TREATMENT';
    localStorage.setItem(SECTION_KEY, currentSection);
    loadSectionData();
    hideSectionModal();
    initializeSocket();
    initializeTable();
    setupEventListeners();
    updateSectionLabel();
}

// Select stockfit area
function selectStockfit() {
    currentSection = 'STOCKFIT';
    localStorage.setItem(SECTION_KEY, currentSection);
    loadSectionData();
    hideSectionModal();
    initializeSocket();
    initializeTable();
    setupEventListeners();
    updateSectionLabel();
}

// Load section data from localStorage
function loadSectionData() {
    const storageKey = getStorageKey();
    const saved = localStorage.getItem(storageKey);
    kanbanData = saved ? JSON.parse(saved) : {};
}

// Save section data to localStorage
function saveSectionDataLocal() {
    const storageKey = getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(kanbanData));
}

// Update section label in header
function updateSectionLabel() {
    const sectionName = currentSection === 'TREATMENT' ? 'Treatment Area' : 'StockFit';
    const icon = currentSection === 'TREATMENT' ? '🏥' : '📦';
    sectionLabel.textContent = `${icon} ${sectionName}`;
}

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
        if (event.target === sectionModal) {
            // Don't allow closing by clicking outside for section selection
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
        if (confirm('Apakah Anda yakin ingin mereset semua data di ' + (currentSection === 'TREATMENT' ? 'Treatment Area' : 'StockFit') + '? Tindakan ini tidak bisa dibatalkan.')) {
            resetAllData();
        }
    };
    
    switchSectionBtn.onclick = () => {
        showSectionModal();
    };
    
    treatmentBtn.onclick = selectTreatment;
    stockfitBtn.onclick = selectStockfit;
}

// Update status
function updateStatus(cellKey, status) {
    kanbanData[cellKey] = status;
    saveSectionDataLocal();
    saveData();
    updateCell(cellKey, status);
}

// Save data to server via API
function saveData() {
    const sectionType = currentSection === 'TREATMENT' ? 'treatment' : 'stockfit';
    fetch('/api/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            section: sectionType,
            data: kanbanData
        })
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
    const sectionType = currentSection === 'TREATMENT' ? 'treatment' : 'stockfit';
    fetch('/api/data?section=' + sectionType)
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
    const sectionType = currentSection === 'TREATMENT' ? 'treatment' : 'stockfit';
    fetch('/api/reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            section: sectionType
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            kanbanData = {};
            saveSectionDataLocal();
            initializeTable();
            alert('Semua data ' + (currentSection === 'TREATMENT' ? 'Treatment Area' : 'StockFit') + ' telah direset!');
            console.log('✓ Data direset berhasil');
        }
    })
    .catch(err => {
        console.error('Error resetting data:', err);
        alert('Gagal mereset data!');
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
