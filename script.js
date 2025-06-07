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
            generateStats(eventsData);
            generateChart(eventsData);
            
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

// Generate dynamic statistics
function generateStats(events) {
    const totalEvents = events.length;
    const currentYear = new Date().getFullYear();
    const earliestYear = Math.min(...events.map(e => new Date(e.date).getFullYear()));
    const yearsSpan = currentYear - earliestYear;
    
    // Calculate events in last 5 years
    const fiveYearsAgo = currentYear - 5;
    const recentEvents = events.filter(e => new Date(e.date).getFullYear() >= fiveYearsAgo);
    const recentPercentage = Math.round((recentEvents.length / totalEvents) * 100);
    
    // Animate numbers
    animateNumber('total-events', totalEvents, '');
    animateNumber('years-span', yearsSpan, '');
    animateNumber('acceleration', recentPercentage, '%');
}

// Animate number counting up
function animateNumber(elementId, target, suffix = '') {
    const element = document.getElementById(elementId);
    const duration = 1500;
    const startTime = performance.now();
    const startValue = 0;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(startValue + (target - startValue) * easeOutCubic);
        
        element.textContent = currentValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Generate acceleration chart
function generateChart(events) {
    const canvas = document.getElementById('accelerationChart');
    const ctx = canvas.getContext('2d');
    
    // Set up canvas for high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    // Group events by decade
    const decades = {};
    const currentYear = new Date().getFullYear();
    
    events.forEach(event => {
        const year = new Date(event.date).getFullYear();
        const decade = Math.floor(year / 10) * 10;
        if (!decades[decade]) {
            decades[decade] = { total: 0, pivotal: 0, major: 0, notable: 0 };
        }
        decades[decade].total++;
        decades[decade][event.importance]++;
    });
    
    // Prepare data for chart
    const sortedDecades = Object.keys(decades).sort((a, b) => parseInt(a) - parseInt(b));
    const width = rect.width;
    const height = rect.height;
    const margin = 40;
    const chartWidth = width - margin * 2;
    const chartHeight = height - margin * 2;
    
    const maxEvents = Math.max(...Object.values(decades).map(d => d.total));
    
    // Draw chart
    ctx.fillStyle = '#27272a';
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 1;
    
    // Draw grid lines
    for (let i = 0; i <= 5; i++) {
        const y = margin + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
    }
    
    // Draw bars
    const barWidth = chartWidth / sortedDecades.length * 0.8;
    const barSpacing = chartWidth / sortedDecades.length;
    
    sortedDecades.forEach((decade, index) => {
        const data = decades[decade];
        const barHeight = (data.total / maxEvents) * chartHeight;
        const x = margin + index * barSpacing + (barSpacing - barWidth) / 2;
        const y = margin + chartHeight - barHeight;
        
        // Create gradient based on event types
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        
        const pivotalRatio = data.pivotal / data.total;
        const majorRatio = data.major / data.total;
        const notableRatio = data.notable / data.total;
        
        if (pivotalRatio > 0) {
            gradient.addColorStop(0, '#ef4444');
            gradient.addColorStop(pivotalRatio, '#ef4444');
        }
        if (majorRatio > 0) {
            gradient.addColorStop(pivotalRatio, '#f59e0b');
            gradient.addColorStop(pivotalRatio + majorRatio, '#f59e0b');
        }
        if (notableRatio > 0) {
            gradient.addColorStop(pivotalRatio + majorRatio, '#22c55e');
            gradient.addColorStop(1, '#22c55e');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Add decade labels
        ctx.fillStyle = '#a1a1aa';
        ctx.font = '10px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(`${decade}s`, x + barWidth / 2, height - 10);
        
        // Add count labels
        if (data.total > 0) {
            ctx.fillStyle = '#e4e4e7';
            ctx.font = 'bold 11px JetBrains Mono';
            ctx.fillText(data.total, x + barWidth / 2, y - 5);
        }
    });
    
    // Add chart title and axis labels
    ctx.fillStyle = '#e4e4e7';
    ctx.font = '12px JetBrains Mono';
    ctx.textAlign = 'left';
    ctx.fillText('Events', 5, 20);
    
    // Add y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = Math.round((maxEvents / 5) * (5 - i));
        const y = margin + (chartHeight / 5) * i + 4;
        ctx.fillText(value.toString(), margin - 10, y);
    }
}