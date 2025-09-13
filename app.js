// HYPERFOCUS ULTRA - Premium Interactive Comic Controller
class HyperfocusUltraComic {
    constructor() {
        this.currentPanel = 1;
        this.totalPanels = 6;
        this.isAnimating = false;
        this.broskiCount = 0;
        this.maxBroskiCount = 500;
        this.particleSystem = null;
        this.soundEffectQueue = [];
        
        this.initializeElements();
        this.createParticleSystem();
        this.attachEventListeners();
        this.showPanel(1);
        this.startUltraIntro();
    }
    
    initializeElements() {
        // Navigation elements
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.restartBtn = document.getElementById('restartBtn');
        
        // Progress and indicators
        this.progressFill = document.getElementById('progressFill');
        this.indicators = document.querySelectorAll('.indicator');
        
        // Interactive elements
        this.discoveryButton = document.getElementById('discoveryButton');
        this.ctaButton = document.getElementById('ctaButton');
        this.broskiCounter = document.getElementById('broskiCount');
        this.headerBroskiCount = document.getElementById('headerBroskiCount');
        
        // Performance metrics
        this.focusLevel = document.getElementById('focusLevel');
        this.productivityLevel = document.getElementById('productivityLevel');
        this.flowLevel = document.getElementById('flowLevel');
        
        // Panels
        this.panels = document.querySelectorAll('.comic-panel');
    }
    
    createParticleSystem() {
        const particleField = document.getElementById('particleField');
        
        // Create additional floating particles
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: ${this.getRandomColor()};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatParticle ${5 + Math.random() * 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
                opacity: ${0.3 + Math.random() * 0.7};
                box-shadow: 0 0 10px currentColor;
            `;
            particleField.appendChild(particle);
        }
        
        // Add floating particle animation
        if (!document.getElementById('particle-animations')) {
            const style = document.createElement('style');
            style.id = 'particle-animations';
            style.textContent = `
                @keyframes floatParticle {
                    0%, 100% { 
                        transform: translateY(0px) translateX(0px) rotate(0deg); 
                        opacity: 0.3; 
                    }
                    25% { 
                        transform: translateY(-20px) translateX(10px) rotate(90deg); 
                        opacity: 0.8; 
                    }
                    50% { 
                        transform: translateY(-10px) translateX(-15px) rotate(180deg); 
                        opacity: 1; 
                    }
                    75% { 
                        transform: translateY(-30px) translateX(5px) rotate(270deg); 
                        opacity: 0.6; 
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    getRandomColor() {
        const colors = ['#00ff88', '#00ffff', '#ff0080', '#ffd700', '#ff4444'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    attachEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousPanel());
        this.nextBtn.addEventListener('click', () => {
            if (this.currentPanel === this.totalPanels) {
                this.restart();
            } else {
                this.nextPanel();
            }
        });
        this.restartBtn.addEventListener('click', () => this.restart());
        
        // Panel indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToPanel(index + 1));
            
            // Add hover effects
            indicator.addEventListener('mouseenter', () => {
                if (indicator.classList.contains('active')) return;
                this.createHoverEffect(indicator);
            });
        });
        
        // Keyboard navigation with enhanced shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Touch gestures for mobile
        this.attachTouchGestures();
        
        // Mouse tracking for immersive effects
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Visibility change for performance optimization
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }
    
    handleMouseMove(e) {
        // Create subtle parallax effect on current panel
        const activePanel = document.querySelector('.comic-panel.active');
        if (activePanel) {
            const rect = activePanel.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            const translateX = (x - 0.5) * 10;
            const translateY = (y - 0.5) * 10;
            
            const panelBg = activePanel.querySelector('.panel-bg');
            if (panelBg) {
                panelBg.style.transform = `translate(${translateX}px, ${translateY}px) scale(1.02)`;
            }
        }
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            // Pause animations when tab is not visible
            document.body.style.animationPlayState = 'paused';
        } else {
            document.body.style.animationPlayState = 'running';
        }
    }
    
    createHoverEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            background: rgba(0, 255, 136, 0.6);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: rippleEffect 0.6s ease-out forwards;
            pointer-events: none;
            z-index: 10;
        `;
        
        element.appendChild(ripple);
        
        if (!document.getElementById('ripple-effect')) {
            const style = document.createElement('style');
            style.id = 'ripple-effect';
            style.textContent = `
                @keyframes rippleEffect {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            if (element.contains(ripple)) {
                element.removeChild(ripple);
            }
        }, 600);
    }
    
    attachTouchGestures() {
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe(touchStartX, touchEndX, touchStartY, touchEndY);
        });
    }
    
    handleSwipe(startX, endX, startY, endY) {
        const swipeThreshold = 50;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Only register horizontal swipes if they're more significant than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                // Swipe left - next panel
                this.nextPanel();
                this.createSwipeEffect('left');
            } else {
                // Swipe right - previous panel
                this.previousPanel();
                this.createSwipeEffect('right');
            }
        }
    }
    
    createSwipeEffect(direction) {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            ${direction === 'left' ? 'right: 20px' : 'left: 20px'};
            transform: translateY(-50%);
            font-size: 2rem;
            color: #00ff88;
            z-index: 1000;
            animation: swipeIndicator 0.5s ease-out forwards;
            pointer-events: none;
        `;
        effect.textContent = direction === 'left' ? '👈' : '👉';
        
        document.body.appendChild(effect);
        
        if (!document.getElementById('swipe-animations')) {
            const style = document.createElement('style');
            style.id = 'swipe-animations';
            style.textContent = `
                @keyframes swipeIndicator {
                    0% { opacity: 0; transform: translateY(-50%) scale(0.5); }
                    50% { opacity: 1; transform: translateY(-50%) scale(1.2); }
                    100% { opacity: 0; transform: translateY(-50%) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            if (document.body.contains(effect)) {
                document.body.removeChild(effect);
            }
        }, 500);
    }
    
    handleKeyboard(e) {
        // Prevent default for handled keys
        const handledKeys = ['ArrowLeft', 'ArrowRight', ' ', 'Home', 'End', 'r', 'R'];
        if (handledKeys.includes(e.key)) {
            e.preventDefault();
        }
        
        switch(e.key) {
            case 'ArrowLeft':
                this.previousPanel();
                break;
            case 'ArrowRight':
            case ' ':
                this.nextPanel();
                break;
            case 'Home':
                this.goToPanel(1);
                break;
            case 'End':
                this.goToPanel(this.totalPanels);
                break;
            case 'r':
            case 'R':
                this.restart();
                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
                const panelNum = parseInt(e.key);
                if (panelNum <= this.totalPanels) {
                    this.goToPanel(panelNum);
                }
                break;
        }
    }
    
    nextPanel() {
        if (this.currentPanel < this.totalPanels && !this.isAnimating) {
            this.goToPanel(this.currentPanel + 1);
        } else if (this.currentPanel === this.totalPanels && !this.isAnimating) {
            this.restart();
        }
    }
    
    previousPanel() {
        if (this.currentPanel > 1 && !this.isAnimating) {
            this.goToPanel(this.currentPanel - 1);
        }
    }
    
    goToPanel(panelNumber) {
        if (panelNumber === this.currentPanel || this.isAnimating || panelNumber < 1 || panelNumber > this.totalPanels) {
            return;
        }
        
        this.isAnimating = true;
        
        // Create transition effect
        this.createTransitionEffect();
        
        // Hide current panel with enhanced animation
        const currentPanelEl = document.querySelector(`[data-panel="${this.currentPanel}"]`);
        if (currentPanelEl) {
            currentPanelEl.classList.remove('active');
            currentPanelEl.style.transform = panelNumber > this.currentPanel ? 
                'translateX(-100px) rotateY(-15deg)' : 'translateX(100px) rotateY(15deg)';
        }
        
        // Update current panel
        this.currentPanel = panelNumber;
        
        // Show new panel after a brief delay
        setTimeout(() => {
            this.showPanel(this.currentPanel);
            this.updateUI();
            
            setTimeout(() => {
                this.triggerPanelAnimations();
                this.attachInteractiveElements();
                this.isAnimating = false;
            }, 400);
        }, 200);
    }
    
    createTransitionEffect() {
        const transition = document.createElement('div');
        transition.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(0, 255, 136, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%);
            z-index: 999;
            animation: transitionFlash 0.4s ease-out forwards;
            pointer-events: none;
        `;
        
        document.body.appendChild(transition);
        
        if (!document.getElementById('transition-styles')) {
            const style = document.createElement('style');
            style.id = 'transition-styles';
            style.textContent = `
                @keyframes transitionFlash {
                    0% { opacity: 0; }
                    50% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            if (document.body.contains(transition)) {
                document.body.removeChild(transition);
            }
        }, 400);
    }
    
    showPanel(panelNumber) {
        // Hide all panels
        this.panels.forEach(panel => {
            panel.classList.remove('active');
            panel.style.transform = '';
        });
        
        // Show target panel
        const targetPanel = document.querySelector(`[data-panel="${panelNumber}"]`);
        if (targetPanel) {
            targetPanel.classList.add('active');
            targetPanel.style.transform = '';
        }
    }
    
    updateUI() {
        // Update progress bar with smooth animation
        const progress = (this.currentPanel / this.totalPanels) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Update navigation buttons
        this.prevBtn.disabled = this.currentPanel === 1;
        
        // Update indicators with stagger effect
        this.indicators.forEach((indicator, index) => {
            setTimeout(() => {
                indicator.classList.toggle('active', index + 1 === this.currentPanel);
            }, index * 50);
        });
        
        // Update next button text
        if (this.currentPanel === this.totalPanels) {
            this.nextBtn.innerHTML = '<div class="btn-glow"></div><span>🔄 Experience Again</span>';
        } else {
            this.nextBtn.innerHTML = '<div class="btn-glow"></div><span>Next ▶</span>';
        }
    }
    
    attachInteractiveElements() {
        // Re-query elements since they might be dynamically created
        const discoveryBtn = document.querySelector('.hyperfocus-button');
        const ctaBtn = document.querySelector('.cta-button');
        
        if (discoveryBtn && !discoveryBtn.hasAttribute('data-attached')) {
            discoveryBtn.setAttribute('data-attached', 'true');
            discoveryBtn.addEventListener('click', () => this.activateHyperfocus());
            discoveryBtn.addEventListener('mouseenter', () => this.createButtonHoverEffect(discoveryBtn));
        }
        
        if (ctaBtn && !ctaBtn.hasAttribute('data-attached')) {
            ctaBtn.setAttribute('data-attached', 'true');
            ctaBtn.addEventListener('click', () => this.handleCTA());
            ctaBtn.addEventListener('mouseenter', () => this.createButtonHoverEffect(ctaBtn));
        }
    }
    
    createButtonHoverEffect(button) {
        const particles = [];
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #00ff88;
                border-radius: 50%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                animation: buttonParticle 1s ease-out forwards;
                animation-delay: ${i * 0.1}s;
                pointer-events: none;
                z-index: 10;
            `;
            
            const angle = (i * 45) * Math.PI / 180;
            particle.style.setProperty('--angle', `${angle}`);
            
            button.appendChild(particle);
            particles.push(particle);
        }
        
        if (!document.getElementById('button-particle-styles')) {
            const style = document.createElement('style');
            style.id = 'button-particle-styles';
            style.textContent = `
                @keyframes buttonParticle {
                    0% { 
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 1;
                    }
                    100% { 
                        transform: translate(-50%, -50%) translate(30px, 0) scale(1);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            particles.forEach(particle => {
                if (button.contains(particle)) {
                    button.removeChild(particle);
                }
            });
        }, 1000);
    }
    
    triggerPanelAnimations() {
        switch(this.currentPanel) {
            case 1:
                this.animateDistractionPanel();
                break;
            case 2:
                this.animateDiscoveryPanel();
                break;
            case 3:
                this.animateActivationPanel();
                break;
            case 4:
                this.animateTransformationPanel();
                break;
            case 5:
                this.animatePerformancePanel();
                break;
            case 6:
                this.animateAchievementPanel();
                break;
        }
    }
    
    animateDistractionPanel() {
        // Animate notification particles
        const notifParticles = document.querySelectorAll('.notif-particle');
        notifParticles.forEach((particle, index) => {
            setTimeout(() => {
                particle.style.animation = 'notifStorm 2s ease-in-out infinite';
            }, index * 200);
        });
        
        // Animate floating windows
        const windows = document.querySelectorAll('.floating-window');
        windows.forEach((window, index) => {
            setTimeout(() => {
                window.style.animation = 'floatWindow 3s ease-in-out infinite';
            }, index * 300);
        });
        
        // Character distress animation
        const character = document.querySelector('.hero-character.overwhelmed');
        if (character) {
            character.style.animation = 'distressShake 0.5s ease-in-out infinite';
        }
        
        this.addDistressShakeAnimation();
    }
    
    addDistressShakeAnimation() {
        if (!document.getElementById('distress-shake')) {
            const style = document.createElement('style');
            style.id = 'distress-shake';
            style.textContent = `
                @keyframes distressShake {
                    0%, 100% { transform: translateX(0) translateY(0); }
                    25% { transform: translateX(-3px) translateY(-2px); }
                    50% { transform: translateX(3px) translateY(2px); }
                    75% { transform: translateX(-2px) translateY(3px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    animateDiscoveryPanel() {
        const button = document.querySelector('.hyperfocus-button');
        const readoutLines = document.querySelectorAll('.readout-line');
        
        if (button) {
            setTimeout(() => {
                button.style.animation = 'discoveryGlow 2s ease-in-out infinite alternate';
            }, 500);
        }
        
        readoutLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.animation = 'textFlicker 2s ease-in-out infinite';
            }, index * 400);
        });
    }
    
    animateActivationPanel() {
        const waves = document.querySelectorAll('.energy-wave');
        const particles = document.querySelectorAll('.surge-particle');
        const loadingFill = document.querySelector('.loading-fill');
        
        waves.forEach((wave, index) => {
            setTimeout(() => {
                wave.style.animation = 'energyWave 1.5s ease-out infinite';
            }, index * 200);
        });
        
        particles.forEach((particle, index) => {
            setTimeout(() => {
                particle.style.animation = 'surgeBurst 1s ease-out infinite';
            }, index * 100);
        });
        
        if (loadingFill) {
            setTimeout(() => {
                loadingFill.style.width = '100%';
            }, 1000);
        }
        
        this.addActivationAnimations();
        this.createSoundEffect('WHOOOOSH!', 'activation');
    }
    
    addActivationAnimations() {
        if (!document.getElementById('activation-animations')) {
            const style = document.createElement('style');
            style.id = 'activation-animations';
            style.textContent = `
                @keyframes energyWave {
                    0% { 
                        transform: scale(0) rotate(0deg); 
                        opacity: 1; 
                    }
                    100% { 
                        transform: scale(3) rotate(360deg); 
                        opacity: 0; 
                    }
                }
                
                @keyframes surgeBurst {
                    0% { 
                        transform: scale(0); 
                        opacity: 1; 
                    }
                    50% { 
                        transform: scale(1.5); 
                        opacity: 0.8; 
                    }
                    100% { 
                        transform: scale(2.5); 
                        opacity: 0; 
                    }
                }
                
                .loading-fill {
                    background: linear-gradient(90deg, #00ff88, #00ffff);
                    height: 100%;
                    border-radius: 4px;
                    transition: width 2s ease-out;
                    width: 0%;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    animateTransformationPanel() {
        const fieldLayers = document.querySelectorAll('.field-layer');
        const codeLines = document.querySelectorAll('.code-line');
        const progressSegments = document.querySelectorAll('.progress-segment');
        
        fieldLayers.forEach((layer, index) => {
            setTimeout(() => {
                layer.style.animation = 'fieldPulse 2s ease-in-out infinite';
            }, index * 200);
        });
        
        codeLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.animation = 'codeFlow 2s ease-in-out infinite';
            }, index * 300);
        });
        
        progressSegments.forEach((segment, index) => {
            setTimeout(() => {
                segment.classList.add('active');
            }, index * 500);
        });
        
        this.addTransformationAnimations();
    }
    
    addTransformationAnimations() {
        if (!document.getElementById('transformation-animations')) {
            const style = document.createElement('style');
            style.id = 'transformation-animations';
            style.textContent = `
                @keyframes fieldPulse {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
                
                @keyframes codeFlow {
                    0% { opacity: 0; transform: translateX(-20px); }
                    50% { opacity: 1; transform: translateX(0); }
                    100% { opacity: 0.7; transform: translateX(0); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    animatePerformancePanel() {
        // Animate performance metrics
        setTimeout(() => {
            if (this.focusLevel) this.focusLevel.style.width = '98%';
            if (this.productivityLevel) this.productivityLevel.style.width = '95%';
            if (this.flowLevel) this.flowLevel.style.width = '100%';
        }, 500);
        
        // Animate BROski counter
        this.animateBroskiCounter();
        
        // Flow particles
        const flowParticles = document.querySelectorAll('.flow-particle');
        flowParticles.forEach((particle, index) => {
            setTimeout(() => {
                particle.style.animation = 'flowStream 3s ease-in-out infinite';
            }, index * 200);
        });
        
        // Earning particles
        const earningParticles = document.querySelectorAll('.earning-particle');
        earningParticles.forEach(particle => {
            particle.style.animation = 'earningFloat 3s ease-out infinite';
        });
        
        this.addPerformanceAnimations();
    }
    
    addPerformanceAnimations() {
        if (!document.getElementById('performance-animations')) {
            const style = document.createElement('style');
            style.id = 'performance-animations';
            style.textContent = `
                @keyframes flowStream {
                    0% { 
                        transform: translateY(40px) scale(0); 
                        opacity: 0; 
                    }
                    50% { 
                        transform: translateY(-20px) scale(1); 
                        opacity: 1; 
                    }
                    100% { 
                        transform: translateY(-80px) scale(0.5); 
                        opacity: 0; 
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    animateAchievementPanel() {
        // Level up effect
        const levelText = document.querySelector('.level-text');
        if (levelText) {
            levelText.style.animation = 'levelUpScale 1s ease-out';
        }
        
        // Achievement badges
        const badges = document.querySelectorAll('.achievement-badge');
        badges.forEach((badge, index) => {
            setTimeout(() => {
                badge.classList.add('completed');
            }, index * 300);
        });
        
        // Confetti particles
        const confettiParticles = document.querySelectorAll('.confetti-particle');
        confettiParticles.forEach((particle, index) => {
            setTimeout(() => {
                particle.style.animation = 'confettiFall 3s ease-out infinite';
            }, index * 100);
        });
        
        // Final BROski count
        setTimeout(() => {
            this.animateFinalBroskiCount();
        }, 1500);
        
        this.addAchievementAnimations();
        this.createSoundEffect('LEVEL UP!', 'achievement');
    }
    
    addAchievementAnimations() {
        if (!document.getElementById('achievement-animations')) {
            const style = document.createElement('style');
            style.id = 'achievement-animations';
            style.textContent = `
                @keyframes confettiFall {
                    0% { 
                        transform: translateY(-50px) rotate(0deg); 
                        opacity: 1; 
                    }
                    100% { 
                        transform: translateY(200px) rotate(720deg); 
                        opacity: 0; 
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    animateBroskiCounter() {
        const targetCount = this.maxBroskiCount;
        const duration = 3000;
        const steps = 60;
        const increment = targetCount / steps;
        let currentCount = 0;
        let step = 0;
        
        const counterInterval = setInterval(() => {
            step++;
            currentCount = Math.min(step * increment, targetCount);
            
            if (this.broskiCounter) {
                this.broskiCounter.textContent = Math.floor(currentCount);
            }
            if (this.headerBroskiCount) {
                this.headerBroskiCount.textContent = Math.floor(currentCount);
            }
            
            // Add pulse effect at milestones
            if (currentCount % 100 === 0 && currentCount > 0) {
                this.createCounterPulse();
            }
            
            if (currentCount >= targetCount) {
                clearInterval(counterInterval);
                this.broskiCount = targetCount;
            }
        }, duration / steps);
    }
    
    animateFinalBroskiCount() {
        if (this.broskiCounter) {
            this.broskiCounter.textContent = this.maxBroskiCount;
            this.broskiCounter.style.animation = 'counterExplode 0.8s ease-out';
        }
        if (this.headerBroskiCount) {
            this.headerBroskiCount.textContent = this.maxBroskiCount;
        }
        
        // Create celebration effect
        this.createCelebrationBurst();
    }
    
    createCounterPulse() {
        if (!this.broskiCounter) return;
        
        const pulse = document.createElement('div');
        pulse.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            background: rgba(255, 0, 128, 0.6);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: counterPulseRing 0.6s ease-out forwards;
            pointer-events: none;
            z-index: 5;
        `;
        
        this.broskiCounter.parentElement.style.position = 'relative';
        this.broskiCounter.parentElement.appendChild(pulse);
        
        if (!document.getElementById('counter-pulse-styles')) {
            const style = document.createElement('style');
            style.id = 'counter-pulse-styles';
            style.textContent = `
                @keyframes counterPulseRing {
                    0% { 
                        transform: translate(-50%, -50%) scale(0); 
                        opacity: 1; 
                    }
                    100% { 
                        transform: translate(-50%, -50%) scale(4); 
                        opacity: 0; 
                    }
                }
                
                @keyframes counterExplode {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.3); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            if (pulse.parentElement) {
                pulse.parentElement.removeChild(pulse);
            }
        }, 600);
    }
    
    createCelebrationBurst() {
        const celebration = document.createElement('div');
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
            pointer-events: none;
            z-index: 1000;
        `;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 6px;
                height: 6px;
                background: ${this.getRandomColor()};
                border-radius: 50%;
                animation: celebrationBurst 2s ease-out forwards;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            
            const angle = (i * 18) * Math.PI / 180;
            const distance = 100 + Math.random() * 50;
            particle.style.setProperty('--end-x', `${Math.cos(angle) * distance}px`);
            particle.style.setProperty('--end-y', `${Math.sin(angle) * distance}px`);
            
            celebration.appendChild(particle);
        }
        
        document.body.appendChild(celebration);
        
        if (!document.getElementById('celebration-styles')) {
            const style = document.createElement('style');
            style.id = 'celebration-styles';
            style.textContent = `
                @keyframes celebrationBurst {
                    0% { 
                        transform: translate(-50%, -50%) scale(0); 
                        opacity: 1; 
                    }
                    70% { 
                        transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(1); 
                        opacity: 1; 
                    }
                    100% { 
                        transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0); 
                        opacity: 0; 
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            if (document.body.contains(celebration)) {
                document.body.removeChild(celebration);
            }
        }, 2500);
    }
    
    activateHyperfocus() {
        const button = document.querySelector('.hyperfocus-button');
        if (button) {
            // Button activation effect
            button.style.transform = 'scale(1.2)';
            button.style.filter = 'brightness(1.5) saturate(1.5)';
            
            // Create activation burst
            this.createActivationBurst(button);
            
            // Sound effect
            this.createSoundEffect('ACTIVATION INITIATED!', 'hyperfocus');
            
            setTimeout(() => {
                this.nextPanel();
            }, 1200);
        }
    }
    
    createActivationBurst(element) {
        const rect = element.getBoundingClientRect();
        const burst = document.createElement('div');
        burst.style.cssText = `
            position: fixed;
            top: ${rect.top + rect.height / 2}px;
            left: ${rect.left + rect.width / 2}px;
            width: 10px;
            height: 10px;
            background: radial-gradient(circle, #00ff88, transparent);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: activationBurst 1.2s ease-out forwards;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(burst);
        
        if (!document.getElementById('activation-burst-styles')) {
            const style = document.createElement('style');
            style.id = 'activation-burst-styles';
            style.textContent = `
                @keyframes activationBurst {
                    0% { 
                        transform: translate(-50%, -50%) scale(0); 
                        opacity: 1; 
                    }
                    50% { 
                        transform: translate(-50%, -50%) scale(20); 
                        opacity: 0.8; 
                    }
                    100% { 
                        transform: translate(-50%, -50%) scale(40); 
                        opacity: 0; 
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            if (document.body.contains(burst)) {
                document.body.removeChild(burst);
            }
        }, 1200);
    }
    
    handleCTA() {
        const button = document.querySelector('.cta-button');
        if (button) {
            button.style.animation = 'ctaPulse 0.5s ease-out';
        }
        
        this.createInspirationalMessage();
        this.createMotivationalBurst();
    }
    
    createInspirationalMessage() {
        const messages = [
            "🚀 Your hyperfocus transformation awaits!",
            "⚡ Unlock your ultimate productivity potential!",
            "🎯 Step into your personal zone of excellence!",
            "✨ Experience the power of total focus!",
            "💪 Your journey to peak performance starts now!"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        const messageEl = document.createElement('div');
        messageEl.innerHTML = `
            <div style="text-align: center; padding: 1rem;">
                <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem;">${randomMessage}</div>
                <div style="font-size: 0.9rem; opacity: 0.8;">Ready to transform your workflow?</div>
            </div>
        `;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #00ff88, #00ffff);
            color: #0a0a0f;
            border-radius: 12px;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.8);
            animation: inspirationalSlide 4s ease-out forwards;
            max-width: 90%;
            min-width: 300px;
        `;
        
        document.body.appendChild(messageEl);
        
        if (!document.getElementById('inspirational-styles')) {
            const style = document.createElement('style');
            style.id = 'inspirational-styles';
            style.textContent = `
                @keyframes inspirationalSlide {
                    0% { 
                        transform: translateX(-50%) translateY(-100px); 
                        opacity: 0; 
                    }
                    15% { 
                        transform: translateX(-50%) translateY(0); 
                        opacity: 1; 
                    }
                    85% { 
                        transform: translateX(-50%) translateY(0); 
                        opacity: 1; 
                    }
                    100% { 
                        transform: translateX(-50%) translateY(-100px); 
                        opacity: 0; 
                    }
                }
                
                @keyframes ctaPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            if (document.body.contains(messageEl)) {
                document.body.removeChild(messageEl);
            }
        }, 4000);
    }
    
    createMotivationalBurst() {
        const burst = document.createElement('div');
        burst.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 999;
        `;
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.textContent = ['🚀', '⚡', '🎯', '💎'][Math.floor(Math.random() * 4)];
            particle.style.cssText = `
                position: absolute;
                font-size: 1.5rem;
                animation: motivationalBurst 2s ease-out forwards;
                animation-delay: ${i * 0.1}s;
            `;
            
            const angle = (i * 30) * Math.PI / 180;
            particle.style.setProperty('--angle', `${angle}rad`);
            
            burst.appendChild(particle);
        }
        
        document.body.appendChild(burst);
        
        if (!document.getElementById('motivational-styles')) {
            const style = document.createElement('style');
            style.id = 'motivational-styles';
            style.textContent = `
                @keyframes motivationalBurst {
                    0% { 
                        transform: scale(0) rotate(0deg); 
                        opacity: 1; 
                    }
                    70% { 
                        transform: scale(1) rotate(360deg) translateY(-60px); 
                        opacity: 1; 
                    }
                    100% { 
                        transform: scale(1.5) rotate(720deg) translateY(-100px); 
                        opacity: 0; 
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            if (document.body.contains(burst)) {
                document.body.removeChild(burst);
            }
        }, 2200);
    }
    
    createSoundEffect(text, type = 'default') {
        const soundEffect = document.createElement('div');
        soundEffect.textContent = text;
        
        const colors = {
            'activation': '#00ff88',
            'hyperfocus': '#00ffff',
            'achievement': '#ffd700',
            'default': '#ff0080'
        };
        
        const color = colors[type] || colors.default;
        
        soundEffect.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2rem;
            font-weight: bold;
            color: ${color};
            text-shadow: 0 0 20px ${color};
            z-index: 1000;
            pointer-events: none;
            animation: soundEffectWave 1.5s ease-out forwards;
            text-align: center;
            max-width: 80%;
        `;
        
        document.body.appendChild(soundEffect);
        
        if (!document.getElementById('sound-effect-wave')) {
            const style = document.createElement('style');
            style.id = 'sound-effect-wave';
            style.textContent = `
                @keyframes soundEffectWave {
                    0% { 
                        transform: translate(-50%, -50%) scale(0); 
                        opacity: 1; 
                    }
                    20% { 
                        transform: translate(-50%, -50%) scale(1.2); 
                        opacity: 1; 
                    }
                    80% { 
                        transform: translate(-50%, -50%) scale(1); 
                        opacity: 1; 
                    }
                    100% { 
                        transform: translate(-50%, -50%) scale(1.2); 
                        opacity: 0; 
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            if (document.body.contains(soundEffect)) {
                document.body.removeChild(soundEffect);
            }
        }, 1500);
    }
    
    restart() {
        this.isAnimating = false;
        this.broskiCount = 0;
        
        // Reset all counters and meters
        if (this.broskiCounter) this.broskiCounter.textContent = '0';
        if (this.headerBroskiCount) this.headerBroskiCount.textContent = '0';
        if (this.focusLevel) this.focusLevel.style.width = '0%';
        if (this.productivityLevel) this.productivityLevel.style.width = '0%';
        if (this.flowLevel) this.flowLevel.style.width = '0%';
        
        // Reset loading bar
        const loadingFill = document.querySelector('.loading-fill');
        if (loadingFill) loadingFill.style.width = '0%';
        
        // Reset achievement badges
        const badges = document.querySelectorAll('.achievement-badge');
        badges.forEach(badge => badge.classList.remove('completed'));
        
        // Reset progress segments
        const segments = document.querySelectorAll('.progress-segment');
        segments.forEach(segment => segment.classList.remove('active'));
        
        // Create restart effect
        this.createRestartEffect();
        
        // Go to first panel
        this.currentPanel = 1;
        this.showPanel(1);
        this.updateUI();
        
        setTimeout(() => {
            this.startUltraIntro();
            this.attachInteractiveElements();
        }, 500);
    }
    
    createRestartEffect() {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(255, 0, 128, 0.3) 0%, rgba(0, 0, 0, 0.8) 100%);
            z-index: 999;
            animation: restartWipe 1s ease-out forwards;
            pointer-events: none;
        `;
        
        document.body.appendChild(effect);
        
        if (!document.getElementById('restart-wipe')) {
            const style = document.createElement('style');
            style.id = 'restart-wipe';
            style.textContent = `
                @keyframes restartWipe {
                    0% { opacity: 0; transform: scale(0); }
                    30% { opacity: 1; transform: scale(1.2); }
                    100% { opacity: 0; transform: scale(3); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            if (document.body.contains(effect)) {
                document.body.removeChild(effect);
            }
        }, 1000);
    }
    
    startUltraIntro() {
        // Animate title entrance
        const title = document.querySelector('.comic-title');
        if (title) {
            title.style.animation = 'titleUltraEntrance 2s ease-out';
        }
        
        // Delayed panel animations
        setTimeout(() => {
            this.triggerPanelAnimations();
        }, 800);
        
        // Create welcome effect
        setTimeout(() => {
            this.createWelcomeEffect();
        }, 1000);
        
        this.addUltraIntroAnimations();
    }
    
    createWelcomeEffect() {
        const welcome = document.createElement('div');
        welcome.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎯</div>
                <div style="font-size: 1.2rem; font-weight: bold;">WELCOME TO HYPERFOCUS ULTRA</div>
                <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 0.5rem;">Premium Interactive Experience</div>
            </div>
        `;
        welcome.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #00ff88;
            border-radius: 12px;
            padding: 2rem;
            color: #00ff88;
            z-index: 1000;
            animation: welcomeFade 3s ease-out forwards;
            backdrop-filter: blur(10px);
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
        `;
        
        document.body.appendChild(welcome);
        
        setTimeout(() => {
            if (document.body.contains(welcome)) {
                document.body.removeChild(welcome);
            }
        }, 3000);
    }
    
    addUltraIntroAnimations() {
        if (!document.getElementById('ultra-intro-styles')) {
            const style = document.createElement('style');
            style.id = 'ultra-intro-styles';
            style.textContent = `
                @keyframes titleUltraEntrance {
                    0% { 
                        transform: scale(0) rotate(180deg); 
                        opacity: 0; 
                    }
                    60% { 
                        transform: scale(1.1) rotate(-10deg); 
                        opacity: 1; 
                    }
                    100% { 
                        transform: scale(1) rotate(0deg); 
                        opacity: 1; 
                    }
                }
                
                @keyframes welcomeFade {
                    0% { 
                        opacity: 0; 
                        transform: translate(-50%, -50%) scale(0); 
                    }
                    20% { 
                        opacity: 1; 
                        transform: translate(-50%, -50%) scale(1); 
                    }
                    80% { 
                        opacity: 1; 
                        transform: translate(-50%, -50%) scale(1); 
                    }
                    100% { 
                        opacity: 0; 
                        transform: translate(-50%, -50%) scale(0.8); 
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize the Ultra Enhanced Comic
document.addEventListener('DOMContentLoaded', () => {
    const comic = new HyperfocusUltraComic();
    
    // Add performance monitoring
    let performanceMonitor = {
        startTime: performance.now(),
        frameCount: 0,
        
        logPerformance: function() {
            this.frameCount++;
            if (this.frameCount % 60 === 0) {
                const currentTime = performance.now();
                const fps = 60000 / (currentTime - this.startTime);
                this.startTime = currentTime;
                
                if (fps < 30) {
                    console.log('Performance warning: Low FPS detected');
                    // Reduce particle effects if performance is poor
                    document.body.classList.add('reduced-effects');
                }
            }
            requestAnimationFrame(() => this.logPerformance());
        }
    };
    
    performanceMonitor.logPerformance();
    
    // Add accessibility enhancements
    document.addEventListener('keydown', (e) => {
        if (e.key === '?') {
            showHelp();
        }
    });
    
    function showHelp() {
        const help = document.createElement('div');
        help.innerHTML = `
            <div style="padding: 1.5rem;">
                <h3 style="margin-top: 0; color: #00ff88;">HYPERFOCUS ULTRA - Controls</h3>
                <div style="display: grid; gap: 0.5rem; font-size: 0.9rem;">
                    <div><strong>← →</strong> Navigate panels</div>
                    <div><strong>Space</strong> Next panel</div>
                    <div><strong>1-6</strong> Jump to panel</div>
                    <div><strong>R</strong> Restart experience</div>
                    <div><strong>Home/End</strong> First/Last panel</div>
                    <div><strong>Swipe</strong> Mobile navigation</div>
                    <div><strong>?</strong> Show this help</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="margin-top: 1rem; padding: 0.5rem 1rem; background: #00ff88; 
                               border: none; border-radius: 6px; color: #000; font-weight: bold; cursor: pointer;">
                    Got it!
                </button>
            </div>
        `;
        help.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #00ff88;
            border-radius: 12px;
            color: white;
            z-index: 1001;
            backdrop-filter: blur(10px);
            max-width: 400px;
            animation: helpSlideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(help);
        
        if (!document.getElementById('help-styles')) {
            const style = document.createElement('style');
            style.id = 'help-styles';
            style.textContent = `
                @keyframes helpSlideIn {
                    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Auto-cleanup for performance
    setInterval(() => {
        // Remove completed animations
        const completedAnimations = document.querySelectorAll('[style*="animation"]:not(.active)');
        completedAnimations.forEach(el => {
            if (!el.closest('.comic-panel.active')) {
                el.style.animation = '';
            }
        });
    }, 10000);
    
    console.log('🚀 HYPERFOCUS ULTRA loaded successfully!');
    console.log('Press ? for help with controls');
});