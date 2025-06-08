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
            initializeInteractiveFeatures(eventsData);
            
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
                    <h3><a href="${event.link}" target="_blank" rel="noopener noreferrer" onclick="trackEventClick('${event.name}', '${event.importance}')">${event.name}</a></h3>
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
                
                // Track filter usage
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'filter_used', {
                        'event_category': 'timeline',
                        'event_label': filter,
                        'value': 1
                    });
                }
                
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
    
    // Handle subscription form
    function setupSubscriptionForm() {
        const form = document.getElementById('subscribe-form');
        const emailInput = document.getElementById('email');
        const submitBtn = document.getElementById('subscribe-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const messageDiv = document.getElementById('subscribe-message');
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            if (!email || !email.includes('@')) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            
            try {
                const response = await fetch('/.netlify/functions/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    if (data.status === 'existing') {
                        showMessage('You\'re already subscribed!', 'existing');
                    } else {
                        showMessage('Successfully subscribed! You\'ll be notified when AI discovers new milestones.', 'success');
                        emailInput.value = '';
                        
                        // Track successful subscription
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'subscribe', {
                                'event_category': 'engagement',
                                'event_label': 'email_subscription',
                                'value': 1
                            });
                        }
                    }
                } else {
                    throw new Error(data.error || 'Subscription failed');
                }
                
            } catch (error) {
                console.error('Subscription error:', error);
                showMessage('Failed to subscribe. Please try again later.', 'error');
            }
            
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        });
        
        function showMessage(text, type) {
            messageDiv.textContent = text;
            messageDiv.className = `subscribe-message ${type}`;
            
            // Clear message after 5 seconds
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = 'subscribe-message';
            }, 5000);
        }
    }
    
    // Initialize the application
    loadEvents();
    setupSubscriptionForm();
});

// Track timeline event clicks
function trackEventClick(eventName, importance) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'timeline_click', {
            'event_category': 'engagement',
            'event_label': eventName,
            'custom_parameter_1': importance,
            'value': 1
        });
    }
}

// Initialize the acceleration visualization
function initializeInteractiveFeatures(events) {
    setupAccelerationVisualization(events);
    updateStats(events);
}

// Simple acceleration visualization that actually works
function setupAccelerationVisualization(events) {
    const canvas = document.getElementById('accelerationChart');
    const ctx = canvas.getContext('2d');
    const playBtn = document.getElementById('play-animation');
    
    let animationId;
    let isPlaying = false;
    let animationProgress = 0;
    
    function setupCanvas() {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
    }
    
    function drawAccelerationChart(progress = 1) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const margin = 40;
        const chartWidth = canvas.width / (window.devicePixelRatio || 1) - 2 * margin;
        const chartHeight = canvas.height / (window.devicePixelRatio || 1) - 2 * margin;
        
        // Group events by decade
        const decades = {};
        events.forEach(event => {
            const year = new Date(event.date).getFullYear();
            const decade = Math.floor(year / 10) * 10;
            if (!decades[decade]) decades[decade] = 0;
            decades[decade]++;
        });
        
        const decadeKeys = Object.keys(decades).map(Number).sort();
        const maxEvents = Math.max(...Object.values(decades));
        
        // Draw bars up to progress point
        const totalDecades = decadeKeys.length;
        const progressDecades = Math.floor(totalDecades * progress);
        
        decadeKeys.slice(0, progressDecades + 1).forEach((decade, index) => {
            const x = margin + (index / (totalDecades - 1)) * chartWidth;
            const barHeight = (decades[decade] / maxEvents) * chartHeight;
            const y = margin + chartHeight - barHeight;
            
            // Color based on decade (more recent = brighter)
            const intensity = index / (totalDecades - 1);
            const alpha = index <= progressDecades ? 0.8 : 0.3;
            
            ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
            ctx.fillRect(x - 8, y, 16, barHeight);
            
            // Draw decade label
            ctx.fillStyle = `rgba(228, 228, 231, ${alpha})`;
            ctx.font = '10px JetBrains Mono';
            ctx.textAlign = 'center';
            ctx.fillText(decade.toString(), x, margin + chartHeight + 20);
        });
        
        // Draw acceleration curve
        if (progressDecades > 2) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
            ctx.lineWidth = 2;
            
            decadeKeys.slice(0, progressDecades + 1).forEach((decade, index) => {
                const x = margin + (index / (totalDecades - 1)) * chartWidth;
                const barHeight = (decades[decade] / maxEvents) * chartHeight;
                const y = margin + chartHeight - barHeight;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
        }
    }
    
    function animate() {
        if (!isPlaying) return;
        
        animationProgress += 0.02;
        drawAccelerationChart(animationProgress);
        
        if (animationProgress >= 1) {
            stopAnimation();
        } else {
            animationId = requestAnimationFrame(animate);
        }
    }
    
    function startAnimation() {
        isPlaying = true;
        animationProgress = 0;
        playBtn.innerHTML = '<span>⏸</span> Pause';
        animate();
    }
    
    function stopAnimation() {
        isPlaying = false;
        if (animationId) cancelAnimationFrame(animationId);
        playBtn.innerHTML = '<span>▶</span> Watch Acceleration';
        animationProgress = 1;
        drawAccelerationChart(1);
    }
    
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });
    
    setupCanvas();
    drawAccelerationChart(1); // Draw complete chart initially
    window.addEventListener('resize', () => {
        setupCanvas();
        drawAccelerationChart(animationProgress);
    });
}

// Update inline stats
function updateStats(events) {
    const totalEvents = events.length;
    const currentYear = new Date().getFullYear();
    const fiveYearsAgo = currentYear - 5;
    const recentEvents = events.filter(e => new Date(e.date).getFullYear() >= fiveYearsAgo);
    const recentPercentage = Math.round((recentEvents.length / totalEvents) * 100);
    
    document.getElementById('total-events').textContent = totalEvents;
    document.getElementById('recent-percent').textContent = recentPercentage + '%';
}