/**
 * ═══════════════════════════════════════════════════════════
 * AUDIO EFFECTS - Профессиональные аудио эффекты
 * ═══════════════════════════════════════════════════════════
 */

class AudioEffects {
    constructor() {
        this.reverb = null;
        this.chorus = null;
        this.delay = null;
        this.distortion = null;
        this.compressor = null;
        this.volume = null;
        this.initialized = false;
        this.currentInstrument = null;
    }

    async init() {
        if (this.initialized) {
            console.log('⚠️ Эффекты уже инициализированы');
            return;
        }

        try {
            console.log('🎛️ Инициализация аудио эффектов...');

            // Создаем Volume узел для мастер-громкости
            this.volume = new Tone.Volume(0).toDestination();

            // Создаем эффекты
            this.reverb = new Tone.Reverb({
                decay: 2.5,
                preDelay: 0.01,
                wet: 0
            });

            this.chorus = new Tone.Chorus({
                frequency: 2.5,
                delayTime: 3.5,
                depth: 0.5,
                wet: 0
            });

            this.delay = new Tone.FeedbackDelay({
                delayTime: 0.25,
                feedback: 0.3,
                wet: 0
            });

            this.distortion = new Tone.Distortion({
                distortion: 0.4,
                wet: 0
            });

            // Компрессор для выравнивания динамики
            this.compressor = new Tone.Compressor({
                threshold: -30,
                ratio: 3,
                attack: 0.003,
                release: 0.25
            });

            // Цепь эффектов: reverb -> chorus -> delay -> distortion -> compressor -> volume -> destination
            this.reverb.connect(this.chorus);
            this.chorus.connect(this.delay);
            this.delay.connect(this.distortion);
            this.distortion.connect(this.compressor);
            this.compressor.connect(this.volume);

            // Запускаем источники LFO
            await this.chorus.start();

            this.initialized = true;
            console.log('✅ Аудио эффекты инициализированы');
        } catch (error) {
            console.error('❌ Ошибка инициализации эффектов:', error);
            throw error;
        }
    }

    /**
     * Подключает инструмент к цепи эффектов
     */
    connectInstrument(instrument) {
        if (!this.initialized) {
            console.warn('⚠️ Эффекты не инициализированы');
            return;
        }

        try {
            // Отключаем предыдущий инструмент
            if (this.currentInstrument) {
                this.currentInstrument.disconnect();
            }

            // Подключаем новый инструмент к началу цепи эффектов
            instrument.disconnect();
            instrument.connect(this.reverb);

            this.currentInstrument = instrument;
            console.log('✅ Инструмент подключен к эффектам');
        } catch (error) {
            console.error('❌ Ошибка подключения инструмента:', error);
        }
    }

    // ========== REVERB (Реверберация) ==========
    async setReverbEnabled(enabled) {
        if (!this.reverb) return;
        this.reverb.wet.value = enabled ? 0.3 : 0;
        console.log('🌊 Reverb:', enabled ? 'ON' : 'OFF');
    }

    async setReverbDecay(decay) {
        if (!this.reverb) return;
        this.reverb.decay = decay;
        console.log('🌊 Reverb decay:', decay);
    }

    async setReverbWet(wet) {
        if (!this.reverb) return;
        this.reverb.wet.value = wet / 100;
        console.log('🌊 Reverb wet:', wet + '%');
    }

    // ========== CHORUS (Хорус) ==========
    async setChorusEnabled(enabled) {
        if (!this.chorus) return;
        this.chorus.wet.value = enabled ? 0.5 : 0;
        console.log('🎵 Chorus:', enabled ? 'ON' : 'OFF');
    }

    async setChorusDepth(depth) {
        if (!this.chorus) return;
        this.chorus.depth = depth;
        console.log('🎵 Chorus depth:', depth);
    }

    async setChorusFrequency(frequency) {
        if (!this.chorus) return;
        this.chorus.frequency.value = frequency;
        console.log('🎵 Chorus frequency:', frequency + ' Hz');
    }

    // ========== DELAY (Дилей) ==========
    async setDelayEnabled(enabled) {
        if (!this.delay) return;
        this.delay.wet.value = enabled ? 0.5 : 0;
        console.log('⏱️ Delay:', enabled ? 'ON' : 'OFF');
    }

    async setDelayTime(time) {
        if (!this.delay) return;
        this.delay.delayTime.value = time;
        console.log('⏱️ Delay time:', time + 's');
    }

    async setDelayFeedback(feedback) {
        if (!this.delay) return;
        this.delay.feedback.value = feedback;
        console.log('⏱️ Delay feedback:', feedback);
    }

    // ========== DISTORTION (Дисторшн) ==========
    async setDistortionEnabled(enabled) {
        if (!this.distortion) return;
        this.distortion.wet.value = enabled ? 0.5 : 0;
        console.log('🔥 Distortion:', enabled ? 'ON' : 'OFF');
    }

    async setDistortionAmount(amount) {
        if (!this.distortion) return;
        this.distortion.distortion = amount;
        console.log('🔥 Distortion amount:', amount);
    }

    // ========== VOLUME (Громкость) ==========
    setMasterVolume(volume) {
        if (!this.volume) return;
        // Конвертируем 0-100 в децибелы
        const db = Tone.gainToDb(volume / 100);
        this.volume.volume.value = db;
        console.log('🔊 Master volume:', volume + '%', '(' + db.toFixed(2) + ' dB)');
    }

    /**
     * Получает первый узел в цепи (для подключения)
     */
    getInputNode() {
        return this.reverb;
    }

    /**
     * Освобождает ресурсы
     */
    dispose() {
        console.log('🗑️ Очистка AudioEffects...');
        
        if (this.reverb) this.reverb.dispose();
        if (this.chorus) {
            this.chorus.stop();
            this.chorus.dispose();
        }
        if (this.delay) this.delay.dispose();
        if (this.distortion) this.distortion.dispose();
        if (this.compressor) this.compressor.dispose();
        if (this.volume) this.volume.dispose();
        
        this.currentInstrument = null;
        this.initialized = false;
        
        console.log('✅ AudioEffects очищен');
    }
}

console.log('✅ AudioEffects модуль загружен');