document.addEventListener('DOMContentLoaded', () => {
    const scenes = document.querySelectorAll('.scene');
    const startBtn = document.getElementById('start-btn');
    const nameSubmit = document.getElementById('name-submit');
    const nameInput = document.getElementById('name-input');
    const typingContainer = document.getElementById('typing-container');
    const displayName = document.getElementById('display-name');
    const musicToggle = document.getElementById('music-toggle');
    const replayBtn = document.getElementById('replay-btn');
    const bgMusic = document.getElementById('bg-music');
    const celebrationCanvas = document.getElementById('celebration-canvas');
    const particlesContainer = document.getElementById('particles');
    
    // New Scene 3 Elements
    const questionYes = document.getElementById('question-yes');
    const questionNo = document.getElementById('question-no');

    let currentScene = 0;
    let userName = "";
    let musicPlaying = false;

    // --- Scene Management ---
    function showScene(index) {
        scenes.forEach(scene => scene.classList.remove('active'));
        scenes[index].classList.add('active');
        currentScene = index;

        // Trigger scene-specific logic
        if (index === 3) { // Emotional Message
            setTimeout(() => showScene(4), 5000);
        } else if (index === 4) { // Celebration
            startCelebration();
            setTimeout(() => showScene(5), 6000);
        } else if (index === 5) { // Slideshow (Now at index 5)
            setTimeout(() => {
                startSlideshow();
            }, 500); // Small delay for smooth transition
            setTimeout(() => showScene(6), 20000); // 5 * 4 seconds
        }
    }
    // --- Scene 1: Particles ---
    function createParticles() {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 5 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.animationDuration = `${Math.random() * 5 + 5}s`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particlesContainer.appendChild(particle);
        }
    }
    createParticles();

    // Start Button
    startBtn.addEventListener('click', () => {
        showScene(1);
        bgMusic.play().then(() => {
            musicPlaying = true;
            musicToggle.innerText = "🎵 Pause Music";
        }).catch(err => console.log("Autoplay blocked, waiting for interaction"));
    });

    // --- Scene 2: Name Input & Typing ---
    nameSubmit.addEventListener('click', () => {
        const inputName = nameInput.value.trim().toLowerCase();
        
        if (inputName !== "harshi") {
            alert("Sorry, this surprise is only for Harshi! ❤️");
            nameInput.value = "";
            return;
        }

        userName = "Harshi"; // Set it to the correct capitalization
        displayName.innerText = userName;
        nameInput.disabled = true;
        nameSubmit.disabled = true;
        
        const text = `Hey ${userName}... Today is your special day!`;
        typeWriter(text, typingContainer, () => {
            setTimeout(() => showScene(2), 2000); // Move to Scene 3 (Question)
        });
    });

    function typeWriter(text, element, callback) {
        let i = 0;
        element.innerHTML = "";
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 100);
            } else if (callback) {
                callback();
            }
        }
        type();
    }

    // --- Scene 3: Question ---
    questionYes.addEventListener('click', () => showScene(3));
    questionNo.addEventListener('click', () => {
        alert("Well, you are loved more than you can imagine! ❤️");
        showScene(3);
    });

    // --- Scene 4: Slideshow ---
    let slideshowInterval;
    function startSlideshow() {
        const slides = document.querySelectorAll('.slide');
        const qualities = document.querySelectorAll('.quality');
        let currentIdx = 0;
        
        // Reset all slides to inactive first
        slides.forEach(slide => slide.classList.remove('active'));
        qualities.forEach(q => q.classList.remove('active'));
        
        // Show first slide
        slides[0].classList.add('active');
        qualities[0].classList.add('active');

        if (slideshowInterval) clearInterval(slideshowInterval);
        
        slideshowInterval = setInterval(() => {
            // Hide current
            slides[currentIdx].classList.remove('active');
            qualities[currentIdx].classList.remove('active');

            // Move to next
            currentIdx = (currentIdx + 1) % slides.length;

            // Show next
            slides[currentIdx].classList.add('active');
            qualities[currentIdx].classList.add('active');
        }, 4000); 
    }

    // --- Scene 5: Celebration (Canvas Confetti/Fireworks) ---
    function startCelebration() {
        const ctx = celebrationCanvas.getContext('2d');
        celebrationCanvas.width = window.innerWidth;
        celebrationCanvas.height = window.innerHeight;

        let particles = [];
        const colors = ['#ff3e6c', '#00d2ff', '#ffea00', '#00ff00', '#ffffff'];

        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.velocity = {
                    x: (Math.random() - 0.5) * 10,
                    y: (Math.random() - 0.5) * 10
                };
                this.alpha = 1;
                this.friction = 0.95;
            }

            draw() {
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                this.velocity.x *= this.friction;
                this.velocity.y *= this.friction;
                this.x += this.velocity.x;
                this.y += this.velocity.y;
                this.alpha -= 0.01;
            }
        }

        function spawnExplosion() {
            const x = Math.random() * celebrationCanvas.width;
            const y = Math.random() * celebrationCanvas.height;
            const color = colors[Math.floor(Math.random() * colors.length)];
            for (let i = 0; i < 30; i++) {
                particles.push(new Particle(x, y, color));
            }
        }

        let animationId;
        function animate() {
            animationId = requestAnimationFrame(animate);
            ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
            ctx.fillRect(0, 0, celebrationCanvas.width, celebrationCanvas.height);

            particles.forEach((p, i) => {
                if (p.alpha > 0) {
                    p.update();
                    p.draw();
                } else {
                    particles.splice(i, 1);
                }
            });

            if (Math.random() < 0.1) spawnExplosion();
        }

        animate();
        setTimeout(() => cancelAnimationFrame(animationId), 6000);
    }

    // --- Scene 6: Controls ---
    musicToggle.addEventListener('click', () => {
        if (musicPlaying) {
            bgMusic.pause();
            musicToggle.innerText = "🎵 Play Music";
        } else {
            bgMusic.play();
            musicToggle.innerText = "🎵 Pause Music";
        }
        musicPlaying = !musicPlaying;
    });

    replayBtn.addEventListener('click', () => {
        // Reset state
        userName = "";
        nameInput.value = "";
        nameInput.disabled = false;
        nameSubmit.disabled = false;
        typingContainer.innerHTML = "";
        if (slideshowInterval) clearInterval(slideshowInterval);
        
        // Show first scene
        showScene(0);
    });

    // Handle Window Resize
    window.addEventListener('resize', () => {
        if (currentScene === 4) {
            celebrationCanvas.width = window.innerWidth;
            celebrationCanvas.height = window.innerHeight;
        }
    });
});