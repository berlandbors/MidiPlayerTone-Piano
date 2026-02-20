// ===== INSTRUMENT MANAGER - Управление множественными инструментами =====
class InstrumentManager {
    constructor() {
        this.channelSynths = new Map();   // channel -> synth instance
        this.channelPrograms = new Map(); // channel -> programNumber
        this.channelPans = new Map();     // channel -> pan value (-1 to 1)
        this.mutedChannels = new Set();   // muted channel numbers
        this.soloChannel = null;          // solo channel number or null
        console.log('🎼 InstrumentManager создан');
    }

    // Инициализировать канал с заданным программным номером
    initChannel(channel, programNumber = 0) {
        const existingProgram = this.channelPrograms.get(channel);
        if (existingProgram === programNumber && this.channelSynths.has(channel)) {
            return; // Уже инициализирован с этой программой
        }
        this.channelPrograms.set(channel, programNumber);
        this.channelSynths.set(channel, this._createSynth(channel, programNumber));
        console.log(`✅ Канал ${channel} → программа ${programNumber} (${GM_PROGRAM_NAMES[programNumber] || 'drums'})`);
    }

    // Сменить программу (инструмент) для канала
    changeProgram(channel, programNumber) {
        if (this.channelPrograms.get(channel) === programNumber) return;
        const oldSynth = this.channelSynths.get(channel);
        if (oldSynth) {
            try { oldSynth.releaseAll(); } catch (e) {}
        }
        this.initChannel(channel, programNumber);
    }

    // Создать синтезатор для канала и программы
    _createSynth(channel, programNumber) {
        // Канал 9 — всегда ударные
        if (channel === 9) {
            return new Tone.MembraneSynth({
                pitchDecay: 0.05,
                octaves: 4,
                envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.3 }
            }).toDestination();
        }

        const name = GM_PROGRAM_NAMES[programNumber] || 'acoustic-grand-piano';

        // Sampler (только для acoustic-grand-piano) — загружаем асинхронно
        if (SAMPLER_INSTRUMENTS[name] && SAMPLER_INSTRUMENTS[name].type === 'sampler') {
            const placeholder = new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'sine' },
                envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 },
                maxPolyphony: 32
            }).toDestination();

            const samplerConfig = SAMPLER_INSTRUMENTS[name];
            const sampler = new Tone.Sampler({
                urls: samplerConfig.samples,
                baseUrl: samplerConfig.baseUrl,
                onload: () => {
                    sampler.toDestination();
                    if (this.channelPrograms.get(channel) === programNumber) {
                        try { placeholder.dispose(); } catch (e) {}
                        this.channelSynths.set(channel, sampler);
                        console.log(`✅ Сэмплы загружены для канала ${channel}`);
                    }
                }
            });

            return placeholder;
        }

        // Синтезированный инструмент из INSTRUMENT_MAP
        const config = (typeof INSTRUMENT_MAP !== 'undefined' && INSTRUMENT_MAP[name])
            ? INSTRUMENT_MAP[name]
            : INSTRUMENT_MAP['acoustic-grand-piano'];

        try {
            switch (config.synth) {
                case 'PolySynth':
                    return new Tone.PolySynth(Tone.Synth, { ...config.options, maxPolyphony: 32 }).toDestination();
                case 'FMSynth':
                    return new Tone.PolySynth(Tone.FMSynth, { ...config.options, maxPolyphony: 32 }).toDestination();
                case 'AMSynth':
                    return new Tone.PolySynth(Tone.AMSynth, { ...config.options, maxPolyphony: 32 }).toDestination();
                case 'PluckSynth':
                    return new Tone.PolySynth(Tone.PluckSynth, { ...config.options, maxPolyphony: 16 }).toDestination();
                case 'MonoSynth':
                    return new Tone.Synth(config.options).toDestination();
                case 'MembraneSynth':
                    return new Tone.MembraneSynth(config.options).toDestination();
                case 'MetalSynth':
                    return new Tone.MetalSynth(config.options).toDestination();
                case 'NoiseSynth':
                    return new Tone.NoiseSynth(config.options).toDestination();
                default:
                    return new Tone.PolySynth(Tone.Synth, { maxPolyphony: 32 }).toDestination();
            }
        } catch (error) {
            console.error(`❌ Ошибка создания синтезатора (${config.synth}):`, error);
            return new Tone.PolySynth(Tone.Synth, { maxPolyphony: 32 }).toDestination();
        }
    }

    // Воспроизвести ноту на канале
    playNote(channel, midiNote, velocity, duration) {
        if (this.isMuted(channel)) return;

        const synth = this.channelSynths.get(channel);
        if (!synth) return;

        try {
            const noteName = Tone.Frequency(midiNote, 'midi').toNote();
            const normalizedVelocity = Math.max(0.1, Math.min(1, velocity / 127));
            synth.triggerAttackRelease(noteName, duration, undefined, normalizedVelocity);
        } catch (error) {
            console.error('❌ Ошибка воспроизведения ноты:', error);
        }
    }

    // Остановить все звуки
    releaseAll() {
        this.channelSynths.forEach(synth => {
            if (synth && typeof synth.releaseAll === 'function') {
                try { synth.releaseAll(); } catch (e) {}
            }
        });
    }

    // Установить громкость канала (0-127)
    setChannelVolume(channel, volume) {
        const synth = this.channelSynths.get(channel);
        if (synth && synth.volume) {
            // Use 0.001 minimum to avoid -Infinity dB at volume=0
            try { synth.volume.value = Tone.gainToDb(Math.max(0.001, volume) / 127); } catch (e) {}
        }
    }

    // Установить мастер-громкость для всех каналов (0-100)
    setMasterVolume(volume) {
        this.channelSynths.forEach(synth => {
            if (synth && synth.volume) {
                try { synth.volume.value = Tone.gainToDb(volume / 100); } catch (e) {}
            }
        });
    }

    // Заглушить/включить канал
    setChannelMute(channel, muted) {
        if (muted) this.mutedChannels.add(channel);
        else this.mutedChannels.delete(channel);
    }

    // Установить Solo для канала
    setSolo(channel) { this.soloChannel = channel; }

    // Снять Solo
    clearSolo() { this.soloChannel = null; }

    // Проверить, заглушен ли канал
    isMuted(channel) {
        if (this.soloChannel !== null && this.soloChannel !== channel) return true;
        return this.mutedChannels.has(channel);
    }

    // Получить номер программы канала
    getChannelProgram(channel) {
        return this.channelPrograms.get(channel) || 0;
    }

    // Получить все активные каналы
    getActiveChannels() {
        return Array.from(this.channelPrograms.keys()).sort((a, b) => a - b);
    }

    // Освободить ресурсы
    dispose() {
        this.channelSynths.forEach(synth => {
            try {
                if (synth.releaseAll) synth.releaseAll();
                synth.dispose();
            } catch (e) {}
        });
        this.channelSynths.clear();
        this.channelPrograms.clear();
        this.channelPans.clear();
        this.mutedChannels.clear();
        this.soloChannel = null;
    }
}
