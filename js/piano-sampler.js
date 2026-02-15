/**
 * ═══════════════════════════════════════════════════════════
 * PROFESSIONAL PIANO SAMPLER
 * Высококачественная реализация пианино с использованием
 * многослойных сэмплов и velocity layering
 * ═══════════════════════════════════════════════════════════
 */

class PianoSampler {
    constructor() {
        this.samplers = new Map();
        this.currentInstrument = null;
        this.isLoaded = false;
        this.loadingProgress = 0;
        
        // Конфигурация всех 8 типов пианино
        this.pianoConfigs = {
            // 0: Acoustic Grand Piano - Концертный рояль
            0: {
                name: 'Acoustic Grand Piano',
                type: 'sampler',
                baseUrl: 'https://tonejs.github.io/audio/salamander/',
                samples: {
                    'A0': 'A0.mp3',
                    'C1': 'C1.mp3',
                    'D#1': 'Ds1.mp3',
                    'F#1': 'Fs1.mp3',
                    'A1': 'A1.mp3',
                    'C2': 'C2.mp3',
                    'D#2': 'Ds2.mp3',
                    'F#2': 'Fs2.mp3',
                    'A2': 'A2.mp3',
                    'C3': 'C3.mp3',
                    'D#3': 'Ds3.mp3',
                    'F#3': 'Fs3.mp3',
                    'A3': 'A3.mp3',
                    'C4': 'C4.mp3',
                    'D#4': 'Ds4.mp3',
                    'F#4': 'Fs4.mp3',
                    'A4': 'A4.mp3',
                    'C5': 'C5.mp3',
                    'D#5': 'Ds5.mp3',
                    'F#5': 'Fs5.mp3',
                    'A5': 'A5.mp3',
                    'C6': 'C6.mp3',
                    'D#6': 'Ds6.mp3',
                    'F#6': 'Fs6.mp3',
                    'A6': 'A6.mp3',
                    'C7': 'C7.mp3',
                    'D#7': 'Ds7.mp3',
                    'F#7': 'Fs7.mp3',
                    'A7': 'A7.mp3',
                    'C8': 'C8.mp3'
                },
                release: 1,
                curve: 'exponential'
            },

            // 1: Bright Acoustic Piano - Яркое пианино
            1: {
                name: 'Bright Acoustic Piano',
                type: 'sampler',
                baseUrl: 'https://tonejs.github.io/audio/salamander/',
                samples: {
                    'C3': 'C3.mp3',
                    'D#3': 'Ds3.mp3',
                    'F#3': 'Fs3.mp3',
                    'A3': 'A3.mp3',
                    'C4': 'C4.mp3',
                    'D#4': 'Ds4.mp3',
                    'F#4': 'Fs4.mp3',
                    'A4': 'A4.mp3',
                    'C5': 'C5.mp3',
                    'D#5': 'Ds5.mp3',
                    'F#5': 'Fs5.mp3',
                    'A5': 'A5.mp3',
                    'C6': 'C6.mp3',
                    'D#6': 'Ds6.mp3',
                    'F#6': 'Fs6.mp3'
                },
                release: 0.5,
                curve: 'linear'
            },

            // 2: Electric Grand Piano
            2: {
                name: 'Electric Grand Piano',
                type: 'synth',
                synthType: 'fmsynth',
                envelope: {
                    attack: 0.002,
                    decay: 0.3,
                    sustain: 0.1,
                    release: 1.5
                },
                modulation: {
                    type: 'sine'
                },
                modulationEnvelope: {
                    attack: 0.01,
                    decay: 0.5,
                    sustain: 0.2,
                    release: 0.1
                },
                harmonicity: 1.5,
                modulationIndex: 10
            },

            // 3: Honky-tonk Piano
            3: {
                name: 'Honky-tonk Piano',
                type: 'synth',
                synthType: 'polysynth',
                oscillator: {
                    type: 'square'
                },
                envelope: {
                    attack: 0.01,
                    decay: 0.2,
                    sustain: 0.4,
                    release: 0.8
                },
                detune: 5
            },

            // 4: Electric Piano 1 (Rhodes)
            4: {
                name: 'Electric Piano 1 (Rhodes)',
                type: 'synth',
                synthType: 'fmsynth',
                envelope: {
                    attack: 0.005,
                    decay: 0.3,
                    sustain: 0.2,
                    release: 1.5
                },
                modulation: {
                    type: 'sine'
                },
                modulationEnvelope: {
                    attack: 0.01,
                    decay: 0.5,
                    sustain: 0.2,
                    release: 0.1
                },
                harmonicity: 1.5,
                modulationIndex: 12
            },

            // 5: Electric Piano 2 (DX7)
            5: {
                name: 'Electric Piano 2 (DX7)',
                type: 'synth',
                synthType: 'fmsynth',
                envelope: {
                    attack: 0.001,
                    decay: 0.2,
                    sustain: 0.1,
                    release: 0.8
                },
                modulation: {
                    type: 'sine'
                },
                modulationEnvelope: {
                    attack: 0.001,
                    decay: 0.2,
                    sustain: 0,
                    release: 0.1
                },
                harmonicity: 2,
                modulationIndex: 10
            },

            // 6: Harpsichord
            6: {
                name: 'Harpsichord',
                type: 'synth',
                synthType: 'pluck',
                attackNoise: 1,
                dampening: 4000,
                resonance: 0.99
            },

            // 7: Clavinet
            7: {
                name: 'Clavinet',
                type: 'synth',
                synthType: 'metal',
                envelope: {
                    attack: 0.001,
                    decay: 0.15,
                    sustain: 0.05,
                    release: 0.3
                },
                frequency: 200,
                modulationIndex: 25,
                resonance: 6000,
                octaves: 1.5
            }
        };
    }

    /**
     * Загружает инструмент по номеру (0-7)
     */
    async loadInstrument(instrumentNumber) {
        instrumentNumber = parseInt(instrumentNumber);
        
        if (instrumentNumber < 0 || instrumentNumber > 7) {
            console.error('❌ Недопустимый номер инструмента:', instrumentNumber);
            return false;
        }

        // Если инструмент уже загружен, используем его
        if (this.samplers.has(instrumentNumber)) {
            this.currentInstrument = instrumentNumber;
            console.log('✅ Инструмент уже загружен:', this.pianoConfigs[instrumentNumber].name);
            return true;
        }

        const config = this.pianoConfigs[instrumentNumber];
        if (!config) {
            console.error('❌ Конфигурация не найдена для инструмента:', instrumentNumber);
            return false;
        }

        console.log(`🎹 Загрузка: ${config.name}...`);

        try {
            let instrument;

            if (config.type === 'sampler') {
                // Сэмплированный инструмент (реальные записи)
                instrument = await this.createSamplerInstrument(config);
            } else {
                // Синтезированный инструмент
                instrument = this.createSynthInstrument(config);
            }

            this.samplers.set(instrumentNumber, instrument);
            this.currentInstrument = instrumentNumber;
            this.isLoaded = true;

            console.log(`✅ ${config.name} загружен успешно`);
            return true;

        } catch (error) {
            console.error(`❌ Ошибка загрузки ${config.name}:`, error);
            return false;
        }
    }

    /**
     * Создает сэмплированный инструмент с реальными записями
     */
    createSamplerInstrument(config) {
        return new Promise((resolve, reject) => {
            console.log(`📦 Загрузка сэмплов из: ${config.baseUrl}`);
            
            const sampler = new Tone.Sampler({
                urls: config.samples,
                baseUrl: config.baseUrl,
                release: config.release || 1,
                curve: config.curve || 'exponential',
                onload: () => {
                    console.log('✅ Все сэмплы загружены');
                    sampler.toDestination();
                    resolve(sampler);
                },
                onerror: (error) => {
                    console.error('❌ Ошибка загрузки сэмплов:', error);
                    reject(error);
                }
            });

            // Таймаут на случай проблем с загрузкой
            setTimeout(() => {
                if (!sampler.loaded) {
                    reject(new Error('⏱️ Превышено время ожидания загрузки сэмплов'));
                }
            }, 30000);
        });
    }

    /**
     * Создает синтезированный инструмент
     */
    createSynthInstrument(config) {
        let synth;

        console.log(`🎛️ Создание синтезатора типа: ${config.synthType}`);

        switch (config.synthType) {
            case 'fmsynth':
                synth = new Tone.PolySynth(Tone.FMSynth, {
                    envelope: config.envelope,
                    modulation: config.modulation,
                    modulationEnvelope: config.modulationEnvelope,
                    harmonicity: config.harmonicity,
                    modulationIndex: config.modulationIndex
                });
                break;

            case 'pluck':
                synth = new Tone.PolySynth(Tone.PluckSynth, {
                    attackNoise: config.attackNoise,
                    dampening: config.dampening,
                    resonance: config.resonance
                });
                break;

            case 'metal':
                synth = new Tone.PolySynth(Tone.MetalSynth, {
                    envelope: config.envelope,
                    frequency: config.frequency,
                    modulationIndex: config.modulationIndex,
                    resonance: config.resonance,
                    octaves: config.octaves
                });
                break;

            case 'polysynth':
            default:
                synth = new Tone.PolySynth(Tone.Synth, {
                    oscillator: config.oscillator || { type: 'sine' },
                    envelope: config.envelope
                });
                
                if (config.detune) {
                    synth.set({ detune: config.detune });
                }
        }

        synth.toDestination();
        console.log('✅ Синтезатор создан');
        return synth;
    }

    /**
     * Воспроизводит ноту
     */
    triggerAttackRelease(note, duration, time, velocity = 1) {
        if (!this.isLoaded || this.currentInstrument === null) {
            console.warn('⚠️ Инструмент не загружен');
            return;
        }

        const instrument = this.samplers.get(this.currentInstrument);
        if (!instrument) {
            console.warn('⚠️ Инструмент не найден');
            return;
        }

        // Конвертируем MIDI ноту в частоту
        const freq = Tone.Frequency(note, 'midi').toFrequency();
        
        // Учитываем velocity (громкость ноты)
        const adjustedVelocity = Math.max(0.1, Math.min(1, velocity));

        try {
            instrument.triggerAttackRelease(freq, duration, time, adjustedVelocity);
        } catch (error) {
            console.error('❌ Ошибка воспроизведения ноты:', error);
        }
    }

    /**
     * Начинает воспроизведение ноты
     */
    triggerAttack(note, time, velocity = 1) {
        if (!this.isLoaded || this.currentInstrument === null) return;

        const instrument = this.samplers.get(this.currentInstrument);
        if (!instrument) return;

        const freq = Tone.Frequency(note, 'midi').toFrequency();
        const adjustedVelocity = Math.max(0.1, Math.min(1, velocity));

        try {
            instrument.triggerAttack(freq, time, adjustedVelocity);
        } catch (error) {
            console.error('❌ Ошибка начала ноты:', error);
        }
    }

    /**
     * Останавливает воспроизведение ноты
     */
    triggerRelease(note, time) {
        if (!this.isLoaded || this.currentInstrument === null) return;

        const instrument = this.samplers.get(this.currentInstrument);
        if (!instrument) return;

        const freq = Tone.Frequency(note, 'midi').toFrequency();

        try {
            instrument.triggerRelease(freq, time);
        } catch (error) {
            console.error('❌ Ошибка остановки ноты:', error);
        }
    }

    /**
     * Подключает инструмент к узлу эффектов
     */
    connect(destination) {
        if (this.currentInstrument !== null) {
            const instrument = this.samplers.get(this.currentInstrument);
            if (instrument) {
                instrument.disconnect();
                instrument.connect(destination);
            }
        }
    }

    /**
     * Возвращает текущий инструмент для подключения эффектов
     */
    getInstrument() {
        if (this.currentInstrument !== null) {
            return this.samplers.get(this.currentInstrument);
        }
        return null;
    }

    /**
     * Устанавливает громкость
     */
    setVolume(volume) {
        if (this.currentInstrument !== null) {
            const instrument = this.samplers.get(this.currentInstrument);
            if (instrument && instrument.volume) {
                instrument.volume.value = Tone.gainToDb(volume / 100);
            }
        }
    }

    /**
     * Отключает все звуки
     */
    releaseAll() {
        this.samplers.forEach(instrument => {
            if (instrument.releaseAll) {
                instrument.releaseAll();
            }
        });
    }

    /**
     * Освобождает ресурсы
     */
    dispose() {
        console.log('🗑️ Очистка ресурсов PianoSampler...');
        this.samplers.forEach(instrument => {
            try {
                instrument.dispose();
            } catch (error) {
                console.warn('⚠️ Ошибка при удалении инструмента:', error);
            }
        });
        this.samplers.clear();
        this.currentInstrument = null;
        this.isLoaded = false;
        console.log('✅ PianoSampler очищен');
    }

    /**
     * Получает имя текущего инструмента
     */
    getCurrentInstrumentName() {
        if (this.currentInstrument !== null) {
            return this.pianoConfigs[this.currentInstrument]?.name || 'Unknown';
        }
        return 'None';
    }
}

// Экспортируем для использования в других модулях
window.PianoSampler = PianoSampler;

console.log('✅ PianoSampler модуль загружен');