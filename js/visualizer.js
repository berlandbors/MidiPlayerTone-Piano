// ===== VISUALIZER =====
class Visualizer {
    constructor(canvas, debugEl) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', {
            alpha: false,
            desynchronized: true
        });
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        this.debugEl = debugEl;
        this.mode = 'bars';
        this.activeNotes = new Map();
        this.bars = new Array(88).fill(0);
        this.smoothedBars = new Array(88).fill(0);
        this.noteCount = 0;
        this.isActive = false;
        this.lastTime = performance.now();
        this.frameCount = 0;
        this.fpsTime = 0;
        this.fps = 0;
        this.gradientCache = new Map();
        this.maxCacheSize = 50;
        this.TARGET_FRAME_TIME = 16.67;
        this.animationFrame = null;
        this.resize();
    }

    resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);
        
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        
        this.width = rect.width;
        this.height = rect.height;
        
        this.gradientCache.clear();
    }

    setMode(mode) {
        this.mode = mode;
        this.gradientCache.clear();
    }
    
    getOrCreateGradient(key, createFn) {
        if (!this.gradientCache.has(key)) {
            if (this.gradientCache.size >= this.maxCacheSize) {
                const firstKey = this.gradientCache.keys().next().value;
                this.gradientCache.delete(firstKey);
            }
            this.gradientCache.set(key, createFn());
        }
        return this.gradientCache.get(key);
    }

    addNote(note, velocity) {
        const index = note - 21;
        if (index >= 0 && index < 88) {
            this.activeNotes.set(note, { 
                velocity, 
                time: performance.now(),
                decaying: false
            });
            this.bars[index] = velocity;
            this.noteCount++;
            this.updateDebug();
        }
    }

    removeNote(note) {
        const noteData = this.activeNotes.get(note);
        if (noteData) {
            noteData.decaying = true;
            setTimeout(() => {
                this.activeNotes.delete(note);
                this.updateDebug();
            }, 200);
        }
    }

    updateDebug() {
        if (this.debugEl) {
            this.debugEl.textContent = `Активных: ${this.activeNotes.size} | Всего: ${this.noteCount} | FPS: ${this.fps}`;
        }
    }

    start() {
        if (this.isActive) return;
        this.isActive = true;
        this.lastTime = performance.now();
        this.animate();
    }

    stop() {
        this.isActive = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        this.activeNotes.clear();
        this.bars.fill(0);
        this.smoothedBars.fill(0);
        this.noteCount = 0;
        this.updateDebug();
        this.clear();
    }

    clear() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    animate() {
        if (!this.isActive) return;

        const now = performance.now();
        const deltaTime = now - this.lastTime;
        this.lastTime = now;

        this.frameCount++;
        this.fpsTime += deltaTime;
        
        if (this.fpsTime >= 1000) {
            this.fps = Math.round(this.frameCount * 1000 / this.fpsTime);
            this.frameCount = 0;
            this.fpsTime = 0;
            this.updateDebug();
        }

        this.update(deltaTime);
        this.render();

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    update(deltaTime) {
        const decaySpeed = 0.05;
        const smoothing = 0.3;

        for (let i = 0; i < 88; i++) {
            const target = this.bars[i];
            this.smoothedBars[i] += (target - this.smoothedBars[i]) * smoothing;
            
            if (this.bars[i] > 0) {
                this.bars[i] = Math.max(0, this.bars[i] - decaySpeed);
            }
        }
    }

    render() {
        this.clear();

        switch (this.mode) {
            case 'bars':
                this.renderBars();
                break;
            case 'wave':
                this.renderWave();
                break;
            case 'circle':
                this.renderCircle();
                break;
        }
    }

    renderBars() {
        const barWidth = this.width / 88;
        const maxHeight = this.height - 40;

        for (let i = 0; i < 88; i++) {
            const height = this.smoothedBars[i] * maxHeight;
            if (height > 0) {
                const x = i * barWidth;
                const y = this.height - height;

                const gradient = this.getOrCreateGradient(`bar-${i}`, () => {
                    const g = this.ctx.createLinearGradient(0, y, 0, this.height);
                    const hue = (i / 88) * 360;
                    g.addColorStop(0, `hsl(${hue}, 80%, 60%)`);
                    g.addColorStop(1, `hsl(${hue}, 80%, 40%)`);
                    return g;
                });

                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(x, y, barWidth - 1, height);
            }
        }
    }

    renderWave() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#2196F3';
        this.ctx.lineWidth = 3;

        const points = 88;
        const step = this.width / points;

        for (let i = 0; i < points; i++) {
            const x = i * step;
            const y = this.height / 2 - (this.smoothedBars[i] * this.height / 2);

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }

        this.ctx.stroke();
    }

    renderCircle() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Math.min(this.width, this.height) / 3;

        for (let i = 0; i < 88; i++) {
            const angle = (i / 88) * Math.PI * 2 - Math.PI / 2;
            const length = this.smoothedBars[i] * radius;

            const x1 = centerX + Math.cos(angle) * radius;
            const y1 = centerY + Math.sin(angle) * radius;
            const x2 = centerX + Math.cos(angle) * (radius + length);
            const y2 = centerY + Math.sin(angle) * (radius + length);

            const hue = (i / 88) * 360;
            this.ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`;
            this.ctx.lineWidth = 2;

            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }
}

console.log('✅ Visualizer модуль загружен');