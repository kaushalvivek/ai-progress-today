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

// Initialize all interactive features
function initializeInteractiveFeatures(events) {
    startAICommentary();
    setupInteractiveStats(events);
    setupVelocityVisualization(events);
    setupTimelineBuilder(events);
    
    // Delay stats animation for dramatic effect
    setTimeout(() => {
        generateAnimatedStats(events);
    }, 1000);
}

// AI Commentary with typewriter effect
function startAICommentary() {
    const comments = [
        "Analyzing 313 years of technological evolution...",
        "Exponential acceleration detected in recent decades.",
        "Pattern recognition: AI development is accelerating.",
        "Recursive observation: AI studying its own progress.",
        "Conclusion: We're approaching the inflection point."
    ];
    
    let currentComment = 0;
    let currentChar = 0;
    const commentElement = document.getElementById('ai-comment');
    
    function typeComment() {
        if (currentChar < comments[currentComment].length) {
            commentElement.textContent += comments[currentComment][currentChar];
            currentChar++;
            setTimeout(typeComment, 50 + Math.random() * 50);
        } else {
            setTimeout(() => {
                commentElement.textContent = '';
                currentChar = 0;
                currentComment = (currentComment + 1) % comments.length;
                setTimeout(typeComment, 2000);
            }, 3000);
        }
    }
    
    typeComment();
}

// Interactive stats with animations
function setupInteractiveStats(events) {
    const statCards = document.querySelectorAll('.stat-card.clickable');
    
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            const stat = this.dataset.stat;
            handleStatClick(stat, events);
        });
    });
}

function generateAnimatedStats(events) {
    const totalEvents = events.length;
    const currentYear = new Date().getFullYear();
    const earliestYear = Math.min(...events.map(e => new Date(e.date).getFullYear()));
    const yearsSpan = currentYear - earliestYear;
    
    const fiveYearsAgo = currentYear - 5;
    const recentEvents = events.filter(e => new Date(e.date).getFullYear() >= fiveYearsAgo);
    const recentPercentage = Math.round((recentEvents.length / totalEvents) * 100);
    
    animateNumber('total-events', totalEvents, '');
    animateNumber('years-span', yearsSpan, '');
    animateNumber('acceleration', recentPercentage, '%');
}

function animateNumber(elementId, target, suffix = '') {
    const element = document.getElementById(elementId);
    const duration = 2000;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(target * easeOutCubic);
        
        element.textContent = currentValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function handleStatClick(stat, events) {
    // Add visual feedback
    const card = document.querySelector(`[data-stat="${stat}"]`);
    card.style.transform = 'translateY(-12px) scale(1.05)';
    setTimeout(() => {
        card.style.transform = '';
    }, 300);
    
    // Show relevant information or trigger animation
    if (stat === 'acceleration') {
        highlightRecentEvents(events);
    }
}

function highlightRecentEvents(events) {
    const currentYear = new Date().getFullYear();
    const fiveYearsAgo = currentYear - 5;
    
    document.querySelectorAll('.timeline-item').forEach(item => {
        const eventYear = parseInt(item.querySelector('.year').textContent);
        if (eventYear >= fiveYearsAgo) {
            item.style.animation = 'pulse 1s ease-in-out';
            setTimeout(() => {
                item.style.animation = '';
            }, 1000);
        }
    });
}

// Velocity visualization with particle system
function setupVelocityVisualization(events) {
    const canvas = document.getElementById('velocityCanvas');
    const ctx = canvas.getContext('2d');
    const playBtn = document.getElementById('play-velocity');
    const yearDisplay = document.getElementById('velocity-year');
    
    let animationId;
    let isPlaying = false;
    let particles = [];
    let currentYear = 1712;
    const endYear = 2025;
    const speed = 5; // years per frame
    
    function setupCanvas() {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
    }
    
    function createParticle(event) {
        const year = new Date(event.date).getFullYear();
        const intensity = event.importance === 'pivotal' ? 1 : event.importance === 'major' ? 0.7 : 0.4;
        const color = event.importance === 'pivotal' ? '#ef4444' : 
                     event.importance === 'major' ? '#f59e0b' : '#22c55e';
        
        return {
            x: ((year - 1712) / (2025 - 1712)) * canvas.width,
            y: canvas.height / 2 + (Math.random() - 0.5) * 100,
            vx: 0,
            vy: (Math.random() - 0.5) * 2,
            size: intensity * 8 + 2,
            color: color,
            alpha: 1,
            age: 0,
            maxAge: 120,
            event: event
        };
    }
    
    function animate() {
        if (!isPlaying) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw velocity curve
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
        ctx.lineWidth = 2;
        
        const curvePoints = [];
        for (let i = 0; i <= currentYear - 1712; i += 10) {
            const year = 1712 + i;
            const eventsInDecade = events.filter(e => {
                const eventYear = new Date(e.date).getFullYear();
                return eventYear >= year && eventYear < year + 10;
            }).length;
            
            const x = (i / (2025 - 1712)) * canvas.width;
            const y = canvas.height - (eventsInDecade * 20 + 50);
            curvePoints.push({ x, y });
        }
        
        if (curvePoints.length > 1) {
            ctx.moveTo(curvePoints[0].x, curvePoints[0].y);
            for (let i = 1; i < curvePoints.length; i++) {
                ctx.lineTo(curvePoints[i].x, curvePoints[i].y);
            }
            ctx.stroke();
        }
        
        // Add particles for events in current year range
        const eventsThisYear = events.filter(e => {
            const eventYear = new Date(e.date).getFullYear();
            return eventYear <= currentYear && eventYear > currentYear - 5;
        });
        
        eventsThisYear.forEach(event => {
            if (Math.random() < 0.1) { // Spawn probability
                particles.push(createParticle(event));
            }
        });
        
        // Update and draw particles
        particles = particles.filter(particle => {
            particle.age++;
            particle.y += particle.vy;
            particle.alpha = 1 - (particle.age / particle.maxAge);
            
            if (particle.alpha > 0) {
                ctx.save();
                ctx.globalAlpha = particle.alpha;
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                return true;
            }
            return false;
        });
        
        // Update year display
        yearDisplay.textContent = currentYear;
        
        // Advance year
        currentYear += speed;
        
        if (currentYear <= endYear) {
            animationId = requestAnimationFrame(animate);
        } else {
            stopAnimation();
        }
    }
    
    function startAnimation() {
        isPlaying = true;
        currentYear = 1712;
        particles = [];
        playBtn.innerHTML = '<span>⏸</span> Pause';
        animate();
    }
    
    function stopAnimation() {
        isPlaying = false;
        if (animationId) cancelAnimationFrame(animationId);
        playBtn.innerHTML = '<span>▶</span> Watch AI Accelerate';
        currentYear = 1712;
        yearDisplay.textContent = '1712';
    }
    
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });
    
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
}

// Timeline builder
function setupTimelineBuilder(events) {
    const canvas = document.getElementById('timelineCanvas');
    const ctx = canvas.getContext('2d');
    const buildBtn = document.getElementById('build-timeline');
    const progressBar = document.getElementById('build-progress');
    const progressText = document.getElementById('progress-text');
    
    let isBuilding = false;
    
    function setupCanvas() {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
    }
    
    function buildTimeline() {
        if (isBuilding) return;
        isBuilding = true;
        
        buildBtn.textContent = 'Building...';
        buildBtn.disabled = true;
        
        const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
        let currentEvent = 0;
        const totalEvents = sortedEvents.length;
        
        function animateStep() {
            if (currentEvent >= totalEvents) {
                progressText.textContent = 'Timeline complete!';
                buildBtn.textContent = '⚡ Build Timeline';
                buildBtn.disabled = false;
                isBuilding = false;
                return;
            }
            
            const progress = (currentEvent / totalEvents) * 100;
            progressBar.style.setProperty('--progress', `${progress}%`);
            progressBar.style.background = `linear-gradient(to right, #22c55e ${progress}%, #27272a ${progress}%)`;
            progressText.textContent = `Building: ${sortedEvents[currentEvent].name}`;
            
            drawTimelineStep(sortedEvents.slice(0, currentEvent + 1));
            currentEvent++;
            
            setTimeout(animateStep, 100);
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animateStep();
    }
    
    function drawTimelineStep(events) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const margin = 60;
        const timelineY = canvas.height / 2;
        const startX = margin;
        const endX = canvas.width - margin;
        const timelineLength = endX - startX;
        
        // Draw main timeline line
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startX, timelineY);
        ctx.lineTo(startX + (timelineLength * events.length / 60), timelineY);
        ctx.stroke();
        
        // Draw events
        events.forEach((event, index) => {
            const x = startX + (index / 60) * timelineLength;
            const color = event.importance === 'pivotal' ? '#ef4444' : 
                         event.importance === 'major' ? '#f59e0b' : '#22c55e';
            const size = event.importance === 'pivotal' ? 8 : 
                        event.importance === 'major' ? 6 : 4;
            
            // Draw event dot
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, timelineY, size, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw glow effect for recent events
            if (index === events.length - 1) {
                ctx.save();
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.arc(x, timelineY, size * 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        });
    }
    
    buildBtn.addEventListener('click', buildTimeline);
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
}