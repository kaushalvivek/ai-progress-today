document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const timeline = document.getElementById('timeline');
    let eventsData = [];
    let timelineItems = [];
    
    // Load events from JSON
    async function loadEvents() {
        const loadingElement = document.getElementById('loading');
        
        try {
            const response = await fetch('events.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            if (!data.events || !Array.isArray(data.events)) {
                throw new Error('Invalid data format');
            }
            
            eventsData = data.events;
            
            // Hide loading spinner
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            
            renderEvents(eventsData);
            setupEventListeners();
            
        } catch (error) {
            console.error('Error loading events:', error);
            
            // Hide loading spinner and show error
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            
            const errorMessage = error.message.includes('fetch') 
                ? 'Unable to load events. Please check your internet connection and try again.'
                : 'Failed to load events. Please try refreshing the page.';
                
            timeline.innerHTML = `<div class="error">${errorMessage}</div>`;
        }
    }
    
    // Render events to timeline
    function renderEvents(events) {
        timeline.innerHTML = '';
        
        events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = `timeline-item ${event.importance}`;
            
            eventElement.innerHTML = `
                <div class="year">${event.date}</div>
                <div class="content">
                    <h3><a href="${event.link}" target="_blank" rel="noopener noreferrer">${event.name}</a></h3>
                    <p>${event.detail}</p>
                </div>
            `;
            
            timeline.appendChild(eventElement);
        });
        
        // Update timelineItems reference
        timelineItems = document.querySelectorAll('.timeline-item');
    }
    
    // Setup event listeners after events are loaded
    function setupEventListeners() {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Filter timeline items
                timelineItems.forEach(item => {
                    if (filter === 'all') {
                        item.classList.remove('hidden');
                    } else {
                        if (item.classList.contains(filter)) {
                            item.classList.remove('hidden');
                        } else {
                            item.classList.add('hidden');
                        }
                    }
                });
            });
        });
        
        // Add smooth scroll behavior for better UX
        timeline.addEventListener('click', function(e) {
            if (e.target.closest('.timeline-item')) {
                e.target.closest('.timeline-item').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
        
        // Add keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key >= '1' && e.key <= '4') {
                const btnIndex = parseInt(e.key) - 1;
                if (filterBtns[btnIndex]) {
                    filterBtns[btnIndex].click();
                }
            }
        });
    }
    
    // Initialize the application
    loadEvents();
});