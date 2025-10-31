// ============================================
// OOP JavaScript Application
// Marine Animals Voting System
// ============================================

'use strict';

// ============================================
// Animal Class (Base Class)
// ============================================

class Animal {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.scientificName = data.scientific_name;
        this.type = data.type;
        this.description = data.description;
        this.habitat = data.habitat;
        this.imageUrl = data.image_url;
        this.sound = data.sound;
        this.votes = data.votes || 0;
    }

    /**
     * Render animal card for grid display
     * @returns {string} HTML string
     */
    render() {
        return `
            <div class="animal-card bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all hover:shadow-2xl" 
                 onclick="app.showAnimalDetail(${this.id})" 
                 data-tooltip="คลิกเพื่อดูข้อมูลเพิ่มเติม 🐠"
                 style="animation-delay: ${Math.random() * 2}s">
                <div class="relative h-48 overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600">
                    <!-- Info Badge (แสดงตอน Hover) -->
                    <div class="info-badge">
                        <span class="text-xs">📍 ${this.habitat.substring(0, 20)}${this.habitat.length > 20 ? '...' : ''}</span>
                    </div>
                    
                    <img src="${this.imageUrl}" 
                         alt="${this.name}" 
                         class="w-full h-full object-cover transition-transform hover:scale-110"
                         onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                    <div class="absolute top-2 right-2 bg-white rounded-full px-3 py-1 shadow vote-badge">
                        <span class="font-bold text-blue-600">❤️ ${this.votes}</span>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="text-xl font-bold text-gray-800 mb-1">${this.name}</h3>
                    <p class="text-sm text-gray-500 italic mb-2">${this.scientificName}</p>
                    <span class="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                        ${this.type}
                    </span>
                    <button onclick="event.stopPropagation(); app.vote(${this.id})" 
                            class="mt-4 w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-red-600 transition-all transform hover:scale-105">
                        โหวต 🗳️
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Render detailed animal modal
     * @returns {string} HTML string
     */
    renderDetail() {
        return `
            <div class="relative">
                <button onclick="app.closeModal()" 
                        class="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                <div class="h-64 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                    <img src="${this.imageUrl}" 
                         alt="${this.name}" 
                         class="w-full h-full object-cover"
                         onerror="this.src='https://via.placeholder.com/800x400?text=No+Image'">
                </div>
                <div class="p-8">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h2 class="text-3xl font-bold text-gray-800">${this.name}</h2>
                            <p class="text-gray-500 italic">${this.scientificName}</p>
                        </div>
                        <div class="text-right">
                            <div class="text-3xl font-bold text-red-500">❤️ ${this.votes}</div>
                            <p class="text-sm text-gray-500">คะแนนโหวต</p>
                        </div>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-600 font-semibold mb-1">ประเภท:</p>
                            <p class="text-gray-800">${this.type}</p>
                        </div>
                        
                        <div class="bg-green-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-600 font-semibold mb-1">ที่อยู่อาศัย:</p>
                            <p class="text-gray-800">${this.habitat}</p>
                        </div>
                        
                        <div class="bg-purple-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-600 font-semibold mb-1">เสียง:</p>
                            <p class="text-gray-800">${this.sound}</p>
                        </div>
                        
                        <div class="bg-yellow-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-600 font-semibold mb-1">รายละเอียด:</p>
                            <p class="text-gray-800">${this.description}</p>
                        </div>
                    </div>
                    
                    <button onclick="app.vote(${this.id}); app.closeModal();" 
                            class="mt-6 w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg font-bold text-lg hover:from-pink-600 hover:to-red-600 transition-all transform hover:scale-105">
                        โหวตสัตว์นี้ 🗳️
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Get vote count
     * @returns {number} Number of votes
     */
    getVotes() {
        return this.votes;
    }
}

// ============================================
// API Service Class
// ============================================

class APIService {
    /**
     * Initialize API Service
     * @param {string} baseURL - Base URL for API
     */
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    /**
     * Make GET request
     * @param {string} action - API action
     * @param {object} params - Query parameters
     * @returns {Promise<object>} API response
     */
    async get(action, params = {}) {
        try {
            const queryString = new URLSearchParams({ action, ...params }).toString();
            const response = await fetch(`${this.baseURL}?${queryString}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API GET Error:', error);
            throw error;
        }
    }

    /**
     * Make POST request
     * @param {string} action - API action
     * @param {object} data - Request body
     * @returns {Promise<object>} API response
     */
    async post(action, data = {}) {
        try {
            const response = await fetch(`${this.baseURL}?action=${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API POST Error:', error);
            throw error;
        }
    }
}

// ============================================
// Main Application Class
// ============================================

class MarineVotingApp {
    /**
     * Initialize the application
     */
    constructor() {
        // Configuration
        this.apiBaseURL = 'api.php'; // เปลี่ยนเป็น URL ของคุณ
        
        // Initialize API Service
        this.api = new APIService(this.apiBaseURL);
        
        // Application State
        this.animals = [];
        this.currentPage = 'animals';
        
        // Initialize app
        this.init();
    }

    /**
     * Initialize application
     */
    async init() {
        console.log('🌊 Marine Voting System initialized');
        await this.loadAnimals();
        this.showPage('animals');
    }

    /**
     * Load all animals from API
     */
    async loadAnimals() {
        try {
            const response = await this.api.get('getAnimals');
            
            if (response.success) {
                this.animals = response.data.map(data => new Animal(data));
                this.renderAnimals();
                console.log(`✅ Loaded ${this.animals.length} animals`);
            } else {
                throw new Error(response.message || 'Failed to load animals');
            }
        } catch (error) {
            console.error('❌ Error loading animals:', error);
            this.showToast('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
            
            // Show error in grid
            const grid = document.getElementById('animals-grid');
            grid.innerHTML = `
                <div class="col-span-full text-center text-white">
                    <p class="text-xl mb-4">⚠️ ไม่สามารถโหลดข้อมูลได้</p>
                    <button onclick="app.loadAnimals()" 
                            class="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">
                        ลองอีกครั้ง
                    </button>
                </div>
            `;
        }
    }

    /**
     * Render animals grid
     */
    renderAnimals() {
        const grid = document.getElementById('animals-grid');
        
        if (this.animals.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center text-white">
                    <p class="text-xl">ยังไม่มีข้อมูลสัตว์ทะเล</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = this.animals.map(animal => animal.render()).join('');
    }

    /**
     * Show animal detail in modal
     * @param {number} id - Animal ID
     */
    async showAnimalDetail(id) {
        const animal = this.animals.find(a => a.id === id);
        
        if (animal) {
            const modal = document.getElementById('modal');
            const modalContent = document.getElementById('modal-content');
            
            modalContent.innerHTML = animal.renderDetail();
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            // Prevent body scrolling
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Close modal
     * @param {Event} event - Click event
     */
    closeModal(event) {
        if (event) {
            event.stopPropagation();
        }
        
        const modal = document.getElementById('modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        
        // Restore body scrolling
        document.body.style.overflow = 'auto';
    }

    /**
     * Vote for an animal
     * @param {number} animalId - Animal ID
     */
    async vote(animalId) {
        try {
            const response = await this.api.post('vote', { animal_id: animalId });
            
            if (response.success) {
                this.showToast('โหวตสำเร็จ! ❤️', 'success');
                
                // Reload animals to update vote counts
                await this.loadAnimals();
                
                // Reload leaderboard if on that page
                if (this.currentPage === 'leaderboard') {
                    await this.loadLeaderboard();
                }
                
                // Add pulse animation to voted card
                this.pulseVotedCard(animalId);
            } else {
                this.showToast(response.message || 'ไม่สามารถโหวตได้', 'error');
            }
        } catch (error) {
            console.error('❌ Error voting:', error);
            this.showToast('เกิดข้อผิดพลาดในการโหวต', 'error');
        }
    }

    /**
     * Add pulse animation to voted card
     * @param {number} animalId - Animal ID
     */
    pulseVotedCard(animalId) {
        const cards = document.querySelectorAll('.animal-card');
        cards.forEach(card => {
            if (card.getAttribute('onclick') && card.getAttribute('onclick').includes(animalId.toString())) {
                card.classList.add('pulse-vote');
                setTimeout(() => card.classList.remove('pulse-vote'), 1000);
            }
        });
    }

    /**
     * Load leaderboard data
     */
    async loadLeaderboard() {
        try {
            const response = await this.api.get('leaderboard', { limit: 10 });
            
            if (response.success) {
                this.renderLeaderboard(response.data, response.total_votes);
            } else {
                throw new Error(response.message || 'Failed to load leaderboard');
            }
        } catch (error) {
            console.error('❌ Error loading leaderboard:', error);
            const content = document.getElementById('leaderboard-content');
            content.innerHTML = `
                <div class="text-center text-gray-600">
                    <p class="mb-4">⚠️ ไม่สามารถโหลดตารางคะแนนได้</p>
                    <button onclick="app.loadLeaderboard()" 
                            class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                        ลองอีกครั้ง
                    </button>
                </div>
            `;
        }
    }

    /**
     * Render leaderboard
     * @param {Array} data - Leaderboard data
     * @param {number} totalVotes - Total votes count
     */
    renderLeaderboard(data, totalVotes) {
        const content = document.getElementById('leaderboard-content');
        
        if (data.length === 0) {
            content.innerHTML = `
                <div class="text-center text-gray-600">
                    <p class="text-xl">ยังไม่มีการโหวต</p>
                    <button onclick="app.showPage('animals')" 
                            class="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                        ไปโหวตกันเลย!
                    </button>
                </div>
            `;
            return;
        }
        
        content.innerHTML = `
            <div class="text-center mb-6">
                <p class="text-2xl font-bold text-gray-700">
                    จำนวนโหวตทั้งหมด: <span class="text-blue-600">${totalVotes}</span>
                </p>
            </div>
            <div class="space-y-4">
                ${data.map((item, index) => this.renderLeaderboardItem(item, index)).join('')}
            </div>
        `;
    }

    /**
     * Render single leaderboard item
     * @param {object} item - Leaderboard item
     * @param {number} index - Item index
     * @returns {string} HTML string
     */
    renderLeaderboardItem(item, index) {
        const isTopThree = index < 3;
        const medalEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        const medalClass = index === 0 ? 'medal-gold' : index === 1 ? 'medal-silver' : index === 2 ? 'medal-bronze' : '';
        
        return `
            <div class="leaderboard-item flex items-center gap-4 p-4 rounded-lg transition-all hover:bg-gray-50 ${isTopThree ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''}">
                <div class="text-3xl font-bold ${medalClass}">
                    ${medalEmoji || (index + 1)}
                </div>
                <img src="${item.animal.image_url}" 
                     alt="${item.animal.name}" 
                     class="w-16 h-16 rounded-full object-cover border-4 ${isTopThree ? 'border-yellow-400' : 'border-gray-200'}"
                     onerror="this.src='https://via.placeholder.com/64'">
                <div class="flex-1">
                    <h3 class="font-bold text-lg text-gray-800">${item.animal.name}</h3>
                    <p class="text-sm text-gray-500">${item.animal.type}</p>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold text-red-500">❤️ ${item.votes}</div>
                    <p class="text-xs text-gray-500">คะแนน</p>
                </div>
            </div>
        `;
    }

    /**
     * Load statistics data
     */
    async loadStats() {
        try {
            const response = await this.api.get('stats');
            
            if (response.success) {
                this.renderStats(response.data);
            } else {
                throw new Error(response.message || 'Failed to load stats');
            }
        } catch (error) {
            console.error('❌ Error loading stats:', error);
            const content = document.getElementById('stats-content');
            content.innerHTML = `
                <div class="text-center text-white">
                    <p class="mb-4">⚠️ ไม่สามารถโหลดสถิติได้</p>
                    <button onclick="app.loadStats()" 
                            class="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-100">
                        ลองอีกครั้ง
                    </button>
                </div>
            `;
        }
    }

    /**
     * Render statistics
     * @param {object} stats - Statistics data
     */
    renderStats(stats) {
        const content = document.getElementById('stats-content');
        
        content.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="stat-card bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition">
                    <div class="text-5xl mb-2">🐠</div>
                    <div class="text-3xl font-bold text-blue-600">${stats.total_animals}</div>
                    <p class="text-gray-600">สัตว์ทั้งหมด</p>
                </div>
                <div class="stat-card bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition">
                    <div class="text-5xl mb-2">🗳️</div>
                    <div class="text-3xl font-bold text-green-600">${stats.total_votes}</div>
                    <p class="text-gray-600">โหวตทั้งหมด</p>
                </div>
                <div class="stat-card bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition">
                    <div class="text-5xl mb-2">📊</div>
                    <div class="text-3xl font-bold text-purple-600">${stats.type_stats.length}</div>
                    <p class="text-gray-600">ประเภทสัตว์</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-xl font-bold mb-4 text-gray-800">จำนวนสัตว์แต่ละประเภท</h3>
                    <div class="space-y-3">
                        ${stats.type_stats.map(type => `
                            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                <span class="font-semibold text-gray-700">${type.animal_type}</span>
                                <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    ${type.count}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-xl font-bold mb-4 text-gray-800">โหวตรายวัน (7 วันล่าสุด)</h3>
                    <div class="space-y-3">
                        ${stats.daily_votes && stats.daily_votes.length > 0 ? 
                            stats.daily_votes.map(day => `
                                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                    <span class="font-semibold text-gray-700">${day.vote_date}</span>
                                    <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        ${day.count} โหวต
                                    </span>
                                </div>
                            `).join('') 
                            : '<p class="text-gray-500 text-center py-4">ยังไม่มีข้อมูลการโหวต</p>'
                        }
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Show specific page
     * @param {string} page - Page name
     */
    showPage(page) {
        this.currentPage = page;
        
        // Hide all pages
        document.querySelectorAll('.page-content').forEach(el => {
            el.classList.add('hidden');
        });
        
        // Show selected page
        const pageElement = document.getElementById(`page-${page}`);
        if (pageElement) {
            pageElement.classList.remove('hidden');
        }
        
        // Load page-specific data
        if (page === 'leaderboard') {
            this.loadLeaderboard();
        } else if (page === 'stats') {
            this.loadStats();
        }
        
        console.log(`📄 Showing page: ${page}`);
    }

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type (success/error)
     */
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        // Set toast style based on type
        const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
        toast.className = `fixed bottom-4 right-4 px-6 py-4 rounded-lg shadow-lg transform transition-all ${bgColor} text-white`;
        
        // Set message
        toastMessage.textContent = message;
        
        // Show toast
        toast.classList.remove('hidden');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
}

// ============================================
// Initialize Application on DOM Load
// ============================================

let app;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Starting Marine Voting System...');
    app = new MarineVotingApp();
});

// Handle modal close on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && app) {
        app.closeModal();
    }
});