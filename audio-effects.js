// ===== АУДИО ЭФФЕКТЫ (Tone.js) =====
class AudioEffects {
    constructor() {
        this.reverb = null;
        this.chorus = null;
        this.delay = null;
        this.distortion = null;
        this.compressor = null;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        try {
            // Создаем эффекты
            this.reverb = new Tone.Reverb({
                decay: 2.5,
                wet: 0
            }).toDestination();

            this.chorus = new Tone.Chorus({
                frequency: 2.5,
                delayTime: 3.5,
                depth: 0.5,
                wet: 0
            }).toDestination();

            this.delay = new Tone.FeedbackDelay({
                delayTime: 0.25,
                feedback: 0.3,
                wet: 0
            }).toDestination();

            this.distortion = new Tone.Distortion({
                distortion: 0.4,
                wet: 0
            }).toDestination();

            this.compressor = new Tone.Compressor({
                threshold: -30,
                ratio: 3,
                attack: 0.003,
                release: 0.25
            }).toDestination();

            // Запускаем хорус и дилей
            this.chorus.start();

            this.initialized = true;
            console.log('✅ Аудио эффекты инициализированы');
        } catch (error) {
            console.error('❌ Ошибка инициализации эффектов:', error);
        }
    }

    async setReverbEnabled(enabled) {
        if (!this.reverb) return;
        this.reverb.wet.value = enabled ? 0.3 : 0;
    }

    async setReverbDecay(decay) {
        if (!this.reverb) return;
        this.reverb.decay = decay;
    }

    async setReverbWet(wet) {
        if (!this.reverb) return;
        this.reverb.wet.value = wet / 100;
    }

    async setChorusEnabled(enabled) {
        if (!this.chorus) return;
        this.chorus.wet.value = enabled ? 0.5 : 0;
    }

    async setChorusDepth(depth) {
        if (!this.chorus) return;
        this.chorus.depth = depth;
    }

    async setChorusFrequency(frequency) {
        if (!this.chorus) return;
        this.chorus.frequency.value = frequency;
    }

    async setDelayEnabled(enabled) {
        if (!this.delay) return;
        this.delay.wet.value = enabled ? 0.5 : 0;
    }

    async setDelayTime(time) {
        if (!this.delay) return;
        this.delay.delayTime.value = time;
    }

    async setDelayFeedback(feedback) {
        if (!this.delay) return;
        this.delay.feedback.value = feedback;
    }

    async setDistortionEnabled(enabled) {
        if (!this.distortion) return;
        this.distortion.wet.value = enabled ? 0.5 : 0;
    }

    async setDistortionAmount(amount) {
        if (!this.distortion) return;
        this.distortion.distortion = amount;
    }

    connectSynth(synth) {
        if (!this.initialized) return synth;

        try {
            // Подключаем синтезатор к цепочке эффектов
            synth.chain(
                this.reverb,
                this.chorus,
                this.delay,
                this.distortion,
                this.compressor
            );
        } catch (error) {
            console.warn('Не удалось подключить эффекты:', error);
        }

        return synth;
    }

    dispose() {
        if (this.reverb) this.reverb.dispose();
        if (this.chorus) this.chorus.dispose();
        if (this.delay) this.delay.dispose();
        if (this.distortion) this.distortion.dispose();
        if (this.compressor) this.compressor.dispose();
        this.initialized = false;
    }
}