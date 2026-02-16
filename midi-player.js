// ===== MIDI PLAYER с Tone.js и РЕАЛЬНЫМИ СЭМПЛАМИ =====
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
        this.instrumentType = 'acoustic-grand-piano';
        this.visualizer = visualizer;
        this.updateInterval = null;
        this.synth = null;
        this.audioEffects = new AudioEffects();
        this.isRecording = false;
        this.recorder = null;
        this.recordedChunks = [];
        this.isInitialized = false;
        this.isSamplerLoading = false;
        
        console.log('🎹 MIDIPlayer создан');
    }

    async init() {
        if (this.isInitialized) {
            console.log('⚠️ Уже инициализирован');
            return;
        }
        
        try {
            console.log('🔧 Начало инициализации Tone.js...');
            await Tone.start();
            console.log('✅ Tone.js запущен, AudioContext state:', Tone.context.state);
            
            await this.audioEffects.init();
            await this.createSynth();
            
            this.isInitialized = true;
            console.log('✅ MIDI Player полностью инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации:', error);
            throw error;
        }
    }

    async createSynth() {
        console.log('🎼 Создание инструмента:', this.instrumentType);
        
        // Показываем индикатор загрузки
        if (document.getElementById('status')) {
            document.getElementById('status').textContent = '⏳ Загрузка инструмента...';
        }
        
        // Удаляем старый синтезатор
        if (this.synth) {
            try {
                this.synth.releaseAll();
                this.synth.disconnect();
                this.synth.dispose();
                console.log('🗑️ Старый инструмент удален');
            } catch (e) {
                console.warn('⚠️ Ошибка при удалении инструмента:', e);
            }
        }

        // Проверяем есть ли реальные сэмплы для этого инструмента
        const samplerConfig = SAMPLER_INSTRUMENTS[this.instrumentType];
        
        if (samplerConfig && samplerConfig.type === 'sampler') {
            console.log('🎵 Загрузка реальных сэмплов...');
            this.isSamplerLoading = true;
            
            try {
                // Создаем Sampler с реальными звуками
                this.synth = await new Promise((resolve, reject) => {
                    const sampler = new Tone.Sampler({
                        urls: samplerConfig.samples,
                        baseUrl: samplerConfig.baseUrl,
                        onload: () => {
                            console.log('✅ Сэмплы загружены!');
                            this.isSamplerLoading = false;
                            if (document.getElementById('status')) {
                                document.getElementById('status').textContent = '✅ Инструмент готов!';
                            }
                            resolve(sampler);
                        },
                        onerror: (error) => {
                            console.error('❌ Ошибка загрузки сэмплов:', error);
                            reject(error);
                        }
                    }).toDestination();
                });
                
                this.synth.volume.value = Tone.gainToDb(this.volume / 100);
                console.log('✅ Реальный инструмент создан:', this.instrumentType);
                return;
                
            } catch (error) {
                console.error('❌ Не удалось загрузить сэмплы, используем синтез:', error);
                this.isSamplerLoading = false;
            }
        }

        // Используем синтезированный звук если нет сэмплов
        console.log('🎛️ Создание синтезированного инструмента...');
        const instrumentConfig = INSTRUMENT_MAP[this.instrumentType];
        
        if (!instrumentConfig) {
            console.warn(`⚠️ Инструмент ${this.instrumentType} не найден`);
            this.instrumentType = 'acoustic-grand-piano';
            return this.createSynth();
        }

        try {
            switch (instrumentConfig.synth) {
                case 'PolySynth':
                    this.synth = new Tone.PolySynth(Tone.Synth, {
                        ...instrumentConfig.options,
                        maxPolyphony: 32
                    });
                    break;
                    
                case 'FMSynth':
                    this.synth = new Tone.PolySynth(Tone.FMSynth, {
                        ...instrumentConfig.options,
                        maxPolyphony: 32
                    });
                    break;
                    
                case 'AMSynth':
                    this.synth = new Tone.PolySynth(Tone.AMSynth, {
                        ...instrumentConfig.options,
                        maxPolyphony: 32
                    });
                    break;
                    
                case 'PluckSynth':
                    this.synth = new Tone.PolySynth(Tone.PluckSynth, {
                        ...instrumentConfig.options,
                        maxPolyphony: 32
                    });
                    break;
                    
                case 'MonoSynth':
                    this.synth = new Tone.Synth(instrumentConfig.options);
                    break;
                    
                case 'MembraneSynth':
                    this.synth = new Tone.MembraneSynth(instrumentConfig.options);
                    break;
                    
                case 'MetalSynth':
                    this.synth = new Tone.MetalSynth(instrumentConfig.options);
                    break;
                    
                case 'NoiseSynth':
                    this.synth = new Tone.NoiseSynth(instrumentConfig.options);
                    break;
                    
                default:
                    this.synth = new Tone.PolySynth(Tone.Synth, { maxPolyphony: 32 });
            }

            this.synth.toDestination();
            this.synth.volume.value = Tone.gainToDb(this.volume / 100);

            console.log('✅ Синтезированный инструмент создан:', instrumentConfig.synth);
            if (document.getElementById('status')) {
                document.getElementById('status').textContent = '✅ Инструмент готов (синтез)';
            }
            
        } catch (error) {
            console.error('❌ Ошибка создания инструмента:', error);
            this.synth = new Tone.Synth().toDestination();
            console.log('⚠️ Используется базовый Synth');
        }
    }

    loadMIDI(arrayBuffer) {
        try {
            console.log('📂 Загрузка MIDI файла...');
            const parser = new MIDIParser(arrayBuffer);
            this.midiData = parser.parse();
            this.calculateDuration();
            
            console.log('✅ MIDI файл загружен:');
            console.log('  - Треков:', this.midiData.trackCount);
            console.log('  - Длительность:', this.duration.toFixed(2), 'сек');
            
            let totalNotes = 0;
            this.midiData.tracks.forEach(track => {
                const notes = track.events.filter(e => e.type === 'noteOn').length;
                totalNotes += notes;
            });
            console.log('  - Всего нот:', totalNotes);
            
            return this.midiData;
        } catch (error) {
            console.error('❌ Ошибка парсинга MIDI:', error);
            throw new Error('Ошибка парсинга MIDI: ' + error.message);
        }
    }

    calculateDuration() {
        if (!this.midiData) return;

        let maxTime = 0;
        const ticksPerBeat = this.midiData.ticksPerBeat;
        const tempoChanges = [];

        this.midiData.tracks.forEach(track => {
            track.events.forEach(event => {
                if (event.type === 'tempo') {
                    tempoChanges.push({
                        tick: event.time,
                        microsecondsPerBeat: event.microsecondsPerBeat
                    });
                }
            });
        });

        if (tempoChanges.length === 0) {
            tempoChanges.push({ tick: 0, microsecondsPerBeat: 500000 });
        }

        tempoChanges.sort((a, b) => a.tick - b.tick);

        this.midiData.tracks.forEach(track => {
            track.events.forEach(event => {
                const time = this.ticksToSeconds(event.time, ticksPerBeat, tempoChanges);
                if (time > maxTime) {
                    maxTime = time;
                }
            });
        });

        this.duration = maxTime;
    }

    ticksToSeconds(ticks, ticksPerBeat, tempoChanges) {
        let seconds = 0;
        let currentTick = 0;
        let currentTempo = 500000;

        for (let i = 0; i < tempoChanges.length; i++) {
            const change = tempoChanges[i];
            if (change.tick >= ticks) break;

            const deltaTicks = change.tick - currentTick;
            seconds += (deltaTicks / ticksPerBeat) * (currentTempo / 1000000);
            
            currentTick = change.tick;
            currentTempo = change.microsecondsPerBeat;
        }

        const deltaTicks = ticks - currentTick;
        seconds += (deltaTicks / ticksPerBeat) * (currentTempo / 1000000);

        return seconds;
    }

    async play(startTime = 0) {
        console.log('\n▶️ ========== НАЧАЛО ВОСПРОИЗВЕДЕНИЯ ==========');
        
        if (!this.midiData) {
            console.error('❌ Нет загруженного MIDI файла');
            return;
        }

        if (this.isSamplerLoading) {
            console.warn('⏳ Сэмплы еще загружаются, подождите...');
            return;
        }

        try {
            await this.init();
            
            if (!this.synth) {
                throw new Error('Инструмент не создан');
            }
            
            this.isPlaying = true;
            this.isPaused = false;
            this.currentTime = startTime;
            this.visualizer.start();

            this.scheduleNotes(startTime);
            this.startTimeUpdate();
            
            console.log('✅ Воспроизведение началось');
            
        } catch (error) {
            console.error('❌ Критическая ошибка воспроизведения:', error);
            this.stop();
        }
    }

    scheduleNotes(startTime) {
        const ticksPerBeat = this.midiData.ticksPerBeat;
        const tempoChanges = [];

        this.midiData.tracks.forEach(track => {
            track.events.forEach(event => {
                if (event.type === 'tempo') {
                    tempoChanges.push({
                        tick: event.time,
                        microsecondsPerBeat: event.microsecondsPerBeat
                    });
                }
            });
        });

        if (tempoChanges.length === 0) {
            tempoChanges.push({ tick: 0, microsecondsPerBeat: 500000 });
        }

        tempoChanges.sort((a, b) => a.tick - b.tick);

        const noteMap = new Map();
        let notesToPlay = [];

        this.midiData.tracks.forEach((track, trackIndex) => {
            track.events.forEach(event => {
                const eventTime = this.ticksToSeconds(event.time, ticksPerBeat, tempoChanges);
                const adjustedTime = eventTime / (this.tempo / 100);

                if (adjustedTime < startTime) return;

                if (event.type === 'noteOn') {
                    noteMap.set(event.note + '_' + event.channel + '_' + trackIndex, {
                        note: event.note,
                        velocity: event.velocity,
                        startTime: adjustedTime,
                        channel: event.channel
                    });
                } else if (event.type === 'noteOff') {
                    const noteOn = noteMap.get(event.note + '_' + event.channel + '_' + trackIndex);
                    if (noteOn) {
                        const duration = Math.max(0.05, adjustedTime - noteOn.startTime);
                        notesToPlay.push({
                            note: noteOn.note,
                            velocity: noteOn.velocity,
                            startTime: noteOn.startTime,
                            duration: duration
                        });
                        noteMap.delete(event.note + '_' + event.channel + '_' + trackIndex);
                    }
                }
            });
        });

        console.log('📊 Запланировано нот:', notesToPlay.length);

        notesToPlay.forEach(noteData => {
            const delay = Math.max(0, (noteData.startTime - startTime) * 1000);

            const timeoutId = setTimeout(() => {
                if (this.isPlaying) {
                    this.playNote(noteData.note, noteData.velocity, noteData.duration);
                }
            }, delay);

            this.scheduledEvents.push(timeoutId);
        });
    }

    playNote(note, velocity, duration) {
        if (!this.synth) return;

        try {
            const noteName = Tone.Frequency(note, 'midi').toNote();
            const normalizedVelocity = Math.max(0.1, Math.min(1, velocity / 127));

            this.synth.triggerAttackRelease(noteName, duration, undefined, normalizedVelocity);

            this.activeNotes.add(note);
            this.visualizer.addNote(note, velocity);
            
            setTimeout(() => {
                this.activeNotes.delete(note);
                this.visualizer.removeNote(note);
            }, duration * 1000);
            
        } catch (error) {
            console.error('❌ Ошибка воспроизведения ноты:', error);
        }
    }

    pause() {
        this.isPlaying = false;
        this.isPaused = true;
        this.clearScheduledEvents();
        this.stopTimeUpdate();
        
        if (this.synth && typeof this.synth.releaseAll === 'function') {
            this.synth.releaseAll();
        }
    }

    stop() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentTime = 0;
        this.clearScheduledEvents();
        this.stopTimeUpdate();
        this.visualizer.stop();
        this.activeNotes.clear();
        
        if (this.synth && typeof this.synth.releaseAll === 'function') {
            this.synth.releaseAll();
        }
    }

    clearScheduledEvents() {
        this.scheduledEvents.forEach(id => clearTimeout(id));
        this.scheduledEvents = [];
    }

    startTimeUpdate() {
        const startTime = Date.now();
        const initialTime = this.currentTime;

        this.updateInterval = setInterval(() => {
            if (this.isPlaying) {
                const elapsed = (Date.now() - startTime) / 1000;
                this.currentTime = initialTime + elapsed * (this.tempo / 100);

                if (this.currentTime >= this.duration) {
                    this.stop();
                }
            }
        }, 100);
    }

    stopTimeUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    setVolume(volume) {
        this.volume = volume;
        if (this.synth) {
            this.synth.volume.value = Tone.gainToDb(volume / 100);
        }
    }

    setTempo(tempo) {
        const wasPlaying = this.isPlaying;
        const currentTime = this.currentTime;

        if (wasPlaying) {
            this.stop();
        }

        this.tempo = tempo;

        if (wasPlaying) {
            setTimeout(() => this.play(currentTime), 100);
        }
    }

    async setInstrument(instrumentType) {
        console.log('🎼 Смена инструмента на:', instrumentType);
        
        const wasPlaying = this.isPlaying;
        const currentTime = this.currentTime;
        
        if (wasPlaying) {
            this.pause();
        }
        
        this.instrumentType = instrumentType;
        await this.createSynth();
        
        if (wasPlaying && !this.isSamplerLoading) {
            setTimeout(() => this.play(currentTime), 200);
        }
    }

    seek(time) {
        const wasPlaying = this.isPlaying;
        this.stop();
        this.currentTime = time;
        
        if (wasPlaying) {
            this.play(time);
        }
    }

    exportToJSON() {
        if (!this.midiData) return null;

        const ticksPerBeat = this.midiData.ticksPerBeat;
        const tempoChanges = [];

        this.midiData.tracks.forEach(track => {
            track.events.forEach(event => {
                if (event.type === 'tempo') {
                    tempoChanges.push({
                        tick: event.time,
                        microsecondsPerBeat: event.microsecondsPerBeat
                    });
                }
            });
        });

        if (tempoChanges.length === 0) {
            tempoChanges.push({ tick: 0, microsecondsPerBeat: 500000 });
        }

        tempoChanges.sort((a, b) => a.tick - b.tick);

        const tracks = this.midiData.tracks.map(track => {
            const noteMap = new Map();
            const notes = [];

            track.events.forEach(event => {
                const eventTime = this.ticksToSeconds(event.time, ticksPerBeat, tempoChanges);

                if (event.type === 'noteOn') {
                    noteMap.set(event.note, {
                        note: event.note,
                        velocity: event.velocity,
                        time: eventTime
                    });
                } else if (event.type === 'noteOff') {
                    const noteOn = noteMap.get(event.note);
                    if (noteOn) {
                        notes.push({
                            note: noteOn.note,
                            time: noteOn.time,
                            duration: eventTime - noteOn.time,
                            velocity: noteOn.velocity
                        });
                        noteMap.delete(event.note);
                    }
                }
            });

            return { notes };
        });

        return { tracks };
    }

    async exportToWAV(onProgress) {
        if (!this.midiData) {
            throw new Error('Нет загруженных MIDI данных');
        }

        console.log('🎵 Начало экспорта в WAV...');

        try {
            // Создаем оффлайн контекст для рендеринга
            const duration = Math.ceil(this.duration) + 2;
            const sampleRate = 44100;
            const offlineContext = new OfflineAudioContext(2, duration * sampleRate, sampleRate);

            console.log('📊 Длительность:', duration, 'сек');
            console.log('📊 Sample rate:', sampleRate, 'Hz');

            // Устанавливаем Tone.js на оффлайн контекст
            Tone.setContext(offlineContext);

            // Создаем синтезатор для рендеринга
            let renderSynth;
            const instrumentConfig = INSTRUMENT_MAP[this.instrumentType];
            const samplerConfig = SAMPLER_INSTRUMENTS[this.instrumentType];

            if (samplerConfig && samplerConfig.type === 'sampler') {
                console.log('⏳ Загрузка сэмплов для экспорта...');
                
                renderSynth = await new Promise((resolve, reject) => {
                    const sampler = new Tone.Sampler({
                        urls: samplerConfig.samples,
                        baseUrl: samplerConfig.baseUrl,
                        onload: () => {
                            console.log('✅ Сэмплы загружены');
                            resolve(sampler);
                        },
                        onerror: (error) => {
                            console.error('❌ Ошибка загрузки сэмплов:', error);
                            reject(error);
                        }
                    }).toDestination();
                });
            } else {
                console.log('🎛️ Создание синтезатора для экспорта...');
                
                switch (instrumentConfig.synth) {
                    case 'PolySynth':
                        renderSynth = new Tone.PolySynth(Tone.Synth, {
                            ...instrumentConfig.options,
                            maxPolyphony: 64
                        }).toDestination();
                        break;
                    case 'FMSynth':
                        renderSynth = new Tone.PolySynth(Tone.FMSynth, {
                            ...instrumentConfig.options,
                            maxPolyphony: 64
                        }).toDestination();
                        break;
                    case 'AMSynth':
                        renderSynth = new Tone.PolySynth(Tone.AMSynth, {
                            ...instrumentConfig.options,
                            maxPolyphony: 64
                        }).toDestination();
                        break;
                    case 'PluckSynth':
                        renderSynth = new Tone.PolySynth(Tone.PluckSynth, {
                            ...instrumentConfig.options,
                            maxPolyphony: 64
                        }).toDestination();
                        break;
                    case 'MonoSynth':
                        renderSynth = new Tone.Synth(instrumentConfig.options).toDestination();
                        break;
                    case 'MembraneSynth':
                        renderSynth = new Tone.MembraneSynth(instrumentConfig.options).toDestination();
                        break;
                    case 'MetalSynth':
                        renderSynth = new Tone.MetalSynth(instrumentConfig.options).toDestination();
                        break;
                    case 'NoiseSynth':
                        renderSynth = new Tone.NoiseSynth(instrumentConfig.options).toDestination();
                        break;
                    default:
                        renderSynth = new Tone.PolySynth(Tone.Synth, { maxPolyphony: 64 }).toDestination();
                }
            }

            renderSynth.volume.value = Tone.gainToDb(this.volume / 100);

            // Планируем все ноты
            console.log('📝 Планирование нот для рендеринга...');
            
            const ticksPerBeat = this.midiData.ticksPerBeat;
            const tempoChanges = [];

            this.midiData.tracks.forEach(track => {
                track.events.forEach(event => {
                    if (event.type === 'tempo') {
                        tempoChanges.push({
                            tick: event.time,
                            microsecondsPerBeat: event.microsecondsPerBeat
                        });
                    }
                });
            });

            if (tempoChanges.length === 0) {
                tempoChanges.push({ tick: 0, microsecondsPerBeat: 500000 });
            }

            tempoChanges.sort((a, b) => a.tick - b.tick);

            const noteMap = new Map();
            let notesToPlay = [];

            this.midiData.tracks.forEach((track, trackIndex) => {
                track.events.forEach(event => {
                    const eventTime = this.ticksToSeconds(event.time, ticksPerBeat, tempoChanges);

                    if (event.type === 'noteOn') {
                        noteMap.set(event.note + '_' + event.channel + '_' + trackIndex, {
                            note: event.note,
                            velocity: event.velocity,
                            startTime: eventTime,
                            channel: event.channel
                        });
                    } else if (event.type === 'noteOff') {
                        const noteOn = noteMap.get(event.note + '_' + event.channel + '_' + trackIndex);
                        if (noteOn) {
                            const duration = Math.max(0.05, eventTime - noteOn.startTime);
                            notesToPlay.push({
                                note: noteOn.note,
                                velocity: noteOn.velocity,
                                time: noteOn.startTime,
                                duration: duration
                            });
                            noteMap.delete(event.note + '_' + event.channel + '_' + trackIndex);
                        }
                    }
                });
            });

            console.log('🎵 Нот для рендеринга:', notesToPlay.length);

            // Планируем ноты в Transport
            notesToPlay.forEach((noteData, index) => {
                const noteName = Tone.Frequency(noteData.note, 'midi').toNote();
                const normalizedVelocity = Math.max(0.1, Math.min(1, noteData.velocity / 127));

                Tone.Transport.schedule((time) => {
                    renderSynth.triggerAttackRelease(noteName, noteData.duration, time, normalizedVelocity);
                }, noteData.time);

                if (onProgress && index % 100 === 0) {
                    onProgress((index / notesToPlay.length) * 50);
                }
            });

            // Запускаем Transport
            Tone.Transport.start(0);

            console.log('⚙️ Начало рендеринга...');

            // Рендерим аудио
            const renderedBuffer = await offlineContext.startRendering();

            console.log('✅ Рендеринг завершен');

            if (onProgress) {
                onProgress(75);
            }

            // Конвертируем в WAV
            const wavBlob = this.audioBufferToWav(renderedBuffer);

            console.log('✅ WAV файл создан, размер:', (wavBlob.size / 1024 / 1024).toFixed(2), 'MB');

            if (onProgress) {
                onProgress(100);
            }

            // Восстанавливаем контекст
            await Tone.start();
            Tone.setContext(Tone.context);
            
            // Пересоздаем синтезатор для плеера
            await this.createSynth();

            return wavBlob;

        } catch (error) {
            console.error('❌ Ошибка экспорта в WAV:', error);
            
            // Восстанавливаем контекст в случае ошибки
            try {
                await Tone.start();
                Tone.setContext(Tone.context);
                await this.createSynth();
            } catch (restoreError) {
                console.error('❌ Ошибка восстановления контекста:', restoreError);
            }
            
            throw error;
        }
    }

    audioBufferToWav(buffer) {
        const numberOfChannels = buffer.numberOfChannels;
        const sampleRate = buffer.sampleRate;
        const format = 1;
        const bitDepth = 16;

        const bytesPerSample = bitDepth / 8;
        const blockAlign = numberOfChannels * bytesPerSample;

        const data = [];
        
        for (let i = 0; i < buffer.length; i++) {
            for (let channel = 0; channel < numberOfChannels; channel++) {
                const sample = buffer.getChannelData(channel)[i];
                const int16 = Math.max(-1, Math.min(1, sample)) * 0x7FFF;
                data.push(int16);
            }
        }

        const dataLength = data.length * bytesPerSample;
        const bufferSize = 44 + dataLength;
        const arrayBuffer = new ArrayBuffer(bufferSize);
        const view = new DataView(arrayBuffer);

        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        writeString(0, 'RIFF');
        view.setUint32(4, bufferSize - 8, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, format, true);
        view.setUint16(22, numberOfChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * blockAlign, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitDepth, true);
        writeString(36, 'data');
        view.setUint32(40, dataLength, true);

        let offset = 44;
        for (let i = 0; i < data.length; i++) {
            view.setInt16(offset, data[i], true);
            offset += 2;
        }

        return new Blob([arrayBuffer], { type: 'audio/wav' });
    }

    async startRecording() {
        try {
            await this.init();
            
            const dest = Tone.context.createMediaStreamDestination();
            Tone.Destination.connect(dest);
            
            this.recorder = new MediaRecorder(dest.stream);
            this.recordedChunks = [];

            this.recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    this.recordedChunks.push(e.data);
                }
            };

            this.recorder.start();
            this.isRecording = true;
            console.log('⚫ Запись началась');
        } catch (error) {
            console.error('❌ Ошибка записи:', error);
            throw error;
        }
    }

    async stopRecording() {
        return new Promise((resolve) => {
            if (!this.recorder) {
                resolve(null);
                return;
            }

            this.recorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
                this.isRecording = false;
                this.recorder = null;
                console.log('⏹ Запись остановлена');
                resolve(blob);
            };

            this.recorder.stop();
        });
    }
}