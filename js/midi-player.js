/**
 * ═══════════════════════════════════════════════════════════
 * MIDI PLAYER с поддержкой профессионального пианино
 * ═══════════════════════════════════════════════════════════
 */

class MIDIPlayer {
    constructor(visualizer) {
        this.midiData = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.currentTime = 0;
        this.duration = 0;
        this.scheduledEvents = [];
        this.activeNotes = new Set();
        this.volume = 70;
        this.tempo = 100;
        this.visualizer = visualizer;
        this.updateInterval = null;
        this.audioEffects = new AudioEffects();
        this.isRecording = false;
        this.recorder = null;
        this.recordedChunks = [];
        this.isInitialized = false;
        
        // НОВОЕ: Используем PianoSampler вместо обычного синтезатора
        this.pianoSampler = new PianoSampler();
        this.currentInstrument = 0; // По умолчанию - Acoustic Grand Piano
        
        console.log('🎹 MIDIPlayer создан с PianoSampler');
    }

    async init() {
        if (this.isInitialized) {
            console.log('⚠️ Уже инициализирован');
            return;
        }
        
        try {
            console.log('🔧 Начало инициализации Tone.js...');
            
            // ВАЖНО: Запускаем Tone.js контекст
            await Tone.start();
            console.log('✅ Tone.js запущен, AudioContext state:', Tone.context.state);
            
            // Инициализируем эффекты
            await this.audioEffects.init();
            console.log('✅ Аудио эффекты готовы');
            
            // Загружаем инструмент по умолчанию
            await this.loadInstrument(this.currentInstrument);
            
            this.isInitialized = true;
            console.log('✅ MIDI Player полностью инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации:', error);
            throw error;
        }
    }

    /**
     * Загружает инструмент пианино
     */
    async loadInstrument(instrumentNumber) {
        console.log('🎼 Загрузка инструмента:', instrumentNumber);
        
        this.updateStatus('⏳ Загрузка инструмента...');
        
        try {
            const success = await this.pianoSampler.loadInstrument(instrumentNumber);
            
            if (success) {
                this.currentInstrument = instrumentNumber;
                
                // Подключаем эффекты
                const instrument = this.pianoSampler.getInstrument();
                if (instrument) {
                    this.audioEffects.connectInstrument(instrument);
                    console.log('✅ Инструмент подключен к эффектам');
                }
                
                // Устанавливаем громкость
                this.pianoSampler.setVolume(this.volume);
                
                const name = this.pianoSampler.getCurrentInstrumentName();
                this.updateStatus(`✅ ${name} загружен`);
                console.log(`✅ Инструмент загружен: ${name}`);
                
                return true;
            } else {
                this.updateStatus('❌ Ошибка загрузки инструмента');
                return false;
            }
            
        } catch (error) {
            console.error('❌ Ошибка загрузки инструмента:', error);
            this.updateStatus('❌ Ошибка загрузки инструмента');
            return false;
        }
    }

    /**
     * Смена инструмента
     */
    async changeInstrument(instrumentNumber) {
        console.log('🔄 Смена инструмента на:', instrumentNumber);
        
        // Останавливаем воспроизведение если играет
        if (this.isPlaying) {
            this.stop();
        }
        
        // Загружаем новый инструмент
        await this.loadInstrument(instrumentNumber);
    }

    loadMIDI(arrayBuffer) {
        try {
            console.log('📖 Парсинг MIDI файла...');
            const parser = new MIDIParser(arrayBuffer);
            this.midiData = parser.parse();
            
            console.log('✅ MIDI файл загружен:', this.midiData);
            console.log('📊 Треков:', this.midiData.tracks.length);
            console.log('📊 Формат:', this.midiData.format);
            console.log('📊 Ticks per beat:', this.midiData.ticksPerBeat);
            
            this.calculateDuration();
            
            return this.midiData;
            
        } catch (error) {
            console.error('❌ Ошибка загрузки MIDI:', error);
            throw error;
        }
    }

    calculateDuration() {
        if (!this.midiData) return;

        let maxTime = 0;
        const ticksPerBeat = this.midiData.ticksPerBeat;
        let currentTempo = 500000; // По умолчанию 120 BPM

        this.midiData.tracks.forEach(track => {
            track.events.forEach(event => {
                if (event.type === 'tempo') {
                    currentTempo = event.microsecondsPerBeat;
                }
                
                const microsecondsPerTick = currentTempo / ticksPerBeat;
                const eventTime = (event.absoluteTime * microsecondsPerTick) / 1000000;
                
                if (eventTime > maxTime) {
                    maxTime = eventTime;
                }
            });
        });

        this.duration = maxTime;
        console.log('⏱️ Длительность трека:', this.duration.toFixed(2), 'секунд');
    }

    async play() {
        if (!this.midiData) {
            console.warn('⚠️ MIDI файл не загружен');
            this.updateStatus('⚠️ Сначала загрузите MIDI файл');
            return;
        }

        // ВАЖНО: Инициализируем если еще не инициализирован
        if (!this.isInitialized) {
            console.log('🔧 Инициализация перед воспроизведением...');
            await this.init();
        }

        if (this.isPlaying && !this.isPaused) {
            console.log('⚠️ Уже играет');
            return;
        }

        console.log('▶️ Начало воспроизведения');
        console.log('🎹 Текущий инструмент:', this.pianoSampler.getCurrentInstrumentName());
        
        this.isPlaying = true;
        this.isPaused = false;
        
        this.visualizer.start();
        
        // Планируем ноты
        await this.scheduleNotes();
        
        // Запускаем Transport
        Tone.Transport.start();
        console.log('✅ Transport запущен');
        
        this.startTimeTracking();
        this.updateStatus('▶️ Воспроизведение...');
    }

    async scheduleNotes() {
        console.log('📅 Планирование нот...');
        
        // Очищаем старые события
        this.scheduledEvents.forEach(id => Tone.Transport.clear(id));
        this.scheduledEvents = [];
        
        const ticksPerBeat = this.midiData.ticksPerBeat;
        let currentTempo = 500000;
        let noteCount = 0;

        this.midiData.tracks.forEach((track, trackIndex) => {
            console.log(`📋 Обработка трека ${trackIndex + 1}/${this.midiData.tracks.length}`);
            
            track.events.forEach(event => {
                if (event.type === 'tempo') {
                    currentTempo = event.microsecondsPerBeat;
                }

                const microsecondsPerTick = currentTempo / ticksPerBeat;
                const eventTime = (event.absoluteTime * microsecondsPerTick) / 1000000;
                const adjustedTime = eventTime * (100 / this.tempo);

                if (event.type === 'noteOn' && event.velocity > 0) {
                    const duration = this.calculateNoteDuration(track, event, ticksPerBeat, currentTempo);
                    const adjustedDuration = duration * (100 / this.tempo);
                    const normalizedVelocity = event.velocity / 127;

                    this.scheduleNote(event.note, adjustedDuration, adjustedTime, normalizedVelocity);
                    noteCount++;
                }
            });
        });

        console.log(`✅ Запланировано ${noteCount} нот`);
    }

    calculateNoteDuration(track, noteOnEvent, ticksPerBeat, tempo) {
        const noteOffEvent = track.events.find(e => 
            e.absoluteTime > noteOnEvent.absoluteTime &&
            (e.type === 'noteOff' || (e.type === 'noteOn' && e.velocity === 0)) &&
            e.note === noteOnEvent.note
        );

        if (noteOffEvent) {
            const microsecondsPerTick = tempo / ticksPerBeat;
            const deltaTime = noteOffEvent.absoluteTime - noteOnEvent.absoluteTime;
            return (deltaTime * microsecondsPerTick) / 1000000;
        }

        return 0.5; // Длительность по умолчанию
    }

    scheduleNote(note, duration, time, velocity) {
        const eventId = Tone.Transport.schedule((t) => {
            try {
                // ВАЖНО: Воспроизводим ноту через PianoSampler
                this.pianoSampler.triggerAttackRelease(note, duration, t, velocity);
                
                // Обновляем визуализацию
                this.visualizer.addNote(note, velocity);
                this.activeNotes.add(note);
                
                // Убираем ноту из визуализации после окончания
                setTimeout(() => {
                    this.visualizer.removeNote(note);
                    this.activeNotes.delete(note);
                }, duration * 1000);
                
            } catch (error) {
                console.error('❌ Ошибка воспроизведения ноты:', error);
            }
        }, time);

        this.scheduledEvents.push(eventId);
    }

    pause() {
        if (!this.isPlaying) return;

        console.log('⏸️ Пауза');
        this.isPaused = true;
        this.isPlaying = false;
        
        Tone.Transport.pause();
        this.pianoSampler.releaseAll();
        this.stopTimeTracking();
        this.updateStatus('⏸️ Пауза');
    }

    stop() {
        console.log('⏹️ Остановка');
        
        this.isPlaying = false;
        this.isPaused = false;
        this.currentTime = 0;
        
        Tone.Transport.stop();
        Tone.Transport.cancel();
        
        this.pianoSampler.releaseAll();
        this.activeNotes.clear();
        
        this.scheduledEvents = [];
        this.stopTimeTracking();
        this.visualizer.stop();
        this.updateStatus('⏹️ Остановлено');
    }

    startTimeTracking() {
        this.stopTimeTracking();
        
        this.updateInterval = setInterval(() => {
            if (this.isPlaying) {
                this.currentTime = Tone.Transport.seconds;
                
                if (this.currentTime >= this.duration) {
                    console.log('⏹️ Воспроизведение завершено');
                    this.stop();
                }
            }
        }, 50);
    }

    stopTimeTracking() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    setVolume(volume) {
        this.volume = volume;
        this.pianoSampler.setVolume(volume);
        console.log('🔊 Громкость:', volume + '%');
    }

    setTempo(tempo) {
        this.tempo = tempo;
        
        // Пересчитываем BPM для Transport
        const bpm = (120 * tempo) / 100;
        Tone.Transport.bpm.value = bpm;
        
        console.log('⏱️ Темп изменен на:', tempo + '%', '(' + bpm.toFixed(1) + ' BPM)');
    }

    getCurrentTime() {
        return this.currentTime;
    }

    getDuration() {
        return this.duration;
    }

    updateStatus(message) {
        const statusEl = document.getElementById('status');
        if (statusEl) {
            statusEl.textContent = message;
        }
        console.log('📢', message);
    }

    /**
     * Экспорт в JSON
     */
    exportToJSON() {
        if (!this.midiData) {
            console.warn('⚠️ Нет данных для экспорта');
            return null;
        }

        const tracks = this.midiData.tracks.map(track => {
            const notes = [];
            const ticksPerBeat = this.midiData.ticksPerBeat;
            let currentTempo = 500000;

            track.events.forEach(event => {
                if (event.type === 'tempo') {
                    currentTempo = event.microsecondsPerBeat;
                }

                if (event.type === 'noteOn' && event.velocity > 0) {
                    const microsecondsPerTick = currentTempo / ticksPerBeat;
                    const time = (event.absoluteTime * microsecondsPerTick) / 1000000;
                    const duration = this.calculateNoteDuration(track, event, ticksPerBeat, currentTempo);

                    notes.push({
                        note: event.note,
                        time: parseFloat(time.toFixed(4)),
                        duration: parseFloat(duration.toFixed(4)),
                        velocity: event.velocity
                    });
                }
            });

            return { notes };
        });

        return { tracks };
    }

    dispose() {
        console.log('🗑️ Очистка MIDIPlayer...');
        this.stop();
        this.pianoSampler.dispose();
        this.audioEffects.dispose();
        this.isInitialized = false;
        console.log('✅ MIDIPlayer очищен');
    }
}

console.log('✅ MIDIPlayer модуль загружен');