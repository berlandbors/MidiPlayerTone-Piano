// ===== UI CONTROLLER =====
class UIController {
    constructor(player, visualizer) {
        this.player = player;
        this.visualizer = visualizer;
        this.currentFileName = '';
        this.initElements();
        this.initEventListeners();
    }

    initElements() {
        // Tabs
        this.tabs = document.querySelectorAll('.tab');
        this.tabContents = document.querySelectorAll('.tab-content');

        // Upload
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.midiInfo = document.getElementById('midiInfo');
        this.tempoInfo = document.getElementById('tempoInfo');

        // Visualizer
        this.visualizerEl = document.getElementById('visualizer');
        this.visualizationMode = document.getElementById('visualizationMode');
        this.vizBtns = document.querySelectorAll('.viz-btn');

        // Instrument
        this.instrumentSelector = document.getElementById('instrumentSelector');
        this.instrumentType = document.getElementById('instrumentType');

        // Effects
        this.effectsSection = document.getElementById('effectsSection');
        this.reverbEnabled = document.getElementById('reverbEnabled');
        this.reverbParams = document.getElementById('reverbParams');
        this.reverbDecay = document.getElementById('reverbDecay');
        this.reverbDecayValue = document.getElementById('reverbDecayValue');
        this.reverbWet = document.getElementById('reverbWet');
        this.reverbWetValue = document.getElementById('reverbWetValue');

        this.chorusEnabled = document.getElementById('chorusEnabled');
        this.chorusParams = document.getElementById('chorusParams');
        this.chorusDepth = document.getElementById('chorusDepth');
        this.chorusDepthValue = document.getElementById('chorusDepthValue');
        this.chorusFrequency = document.getElementById('chorusFrequency');
        this.chorusFrequencyValue = document.getElementById('chorusFrequencyValue');

        this.delayEnabled = document.getElementById('delayEnabled');
        this.delayParams = document.getElementById('delayParams');
        this.delayTime = document.getElementById('delayTime');
        this.delayTimeValue = document.getElementById('delayTimeValue');
        this.delayFeedback = document.getElementById('delayFeedback');
        this.delayFeedbackValue = document.getElementById('delayFeedbackValue');

        this.distortionEnabled = document.getElementById('distortionEnabled');
        this.distortionParams = document.getElementById('distortionParams');
        this.distortionAmount = document.getElementById('distortionAmount');
        this.distortionAmountValue = document.getElementById('distortionAmountValue');

        // Controls
        this.volumeControl = document.getElementById('volumeControl');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeValue = document.getElementById('volumeValue');
        this.tempoControl = document.getElementById('tempoControl');
        this.tempoSlider = document.getElementById('tempoSlider');
        this.tempoValue = document.getElementById('tempoValue');

        // Progress
        this.progressContainer = document.getElementById('progressContainer');
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
        this.currentTimeEl = document.getElementById('currentTime');
        this.totalTimeEl = document.getElementById('totalTime');

        // Player buttons
        this.playBtn = document.getElementById('playBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.status = document.getElementById('status');

        // Export
        this.exportJsonBtn = document.getElementById('exportJsonBtn');
        this.exportWavBtn = document.getElementById('exportWavBtn');
        this.jsonOutput = document.getElementById('jsonOutput');
        this.downloadJsonBtn = document.getElementById('downloadJsonBtn');

        // Import
        this.jsonUploadArea = document.getElementById('jsonUploadArea');
        this.jsonFileInput = document.getElementById('jsonFileInput');
        this.jsonInput = document.getElementById('jsonInput');
        this.createMidiBtn = document.getElementById('createMidiBtn');
        this.previewMidiBtn = document.getElementById('previewMidiBtn');
        this.importStatus = document.getElementById('importStatus');

        // Recording
        this.recordingIndicator = document.getElementById('recordingIndicator');
        this.startRecordBtn = document.getElementById('startRecordBtn');
        this.stopRecordBtn = document.getElementById('stopRecordBtn');
        this.downloadAudioBtn = document.getElementById('downloadAudioBtn');
        this.recordStatus = document.getElementById('recordStatus');
    }

    initEventListeners() {
        // Tabs
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });

        // Upload
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', () => this.handleDragLeave());
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Visualizer
        this.vizBtns.forEach(btn => {
            btn.addEventListener('click', () => this.changeVisualizationMode(btn));
        });

        // Instrument
        this.instrumentType.addEventListener('change', (e) => this.changeInstrument(e));

        // Effects
        this.reverbEnabled.addEventListener('change', (e) => this.toggleReverb(e));
        this.reverbDecay.addEventListener('input', (e) => this.updateReverbDecay(e));
        this.reverbWet.addEventListener('input', (e) => this.updateReverbWet(e));

        this.chorusEnabled.addEventListener('change', (e) => this.toggleChorus(e));
        this.chorusDepth.addEventListener('input', (e) => this.updateChorusDepth(e));
        this.chorusFrequency.addEventListener('input', (e) => this.updateChorusFrequency(e));

        this.delayEnabled.addEventListener('change', (e) => this.toggleDelay(e));
        this.delayTime.addEventListener('input', (e) => this.updateDelayTime(e));
        this.delayFeedback.addEventListener('input', (e) => this.updateDelayFeedback(e));

        this.distortionEnabled.addEventListener('change', (e) => this.toggleDistortion(e));
        this.distortionAmount.addEventListener('input', (e) => this.updateDistortionAmount(e));

        // Controls
        this.volumeSlider.addEventListener('input', (e) => this.updateVolume(e));
        this.tempoSlider.addEventListener('input', (e) => this.updateTempo(e));

        // Progress
        this.progressBar.addEventListener('click', (e) => this.seekTo(e));

        // Player buttons
        this.playBtn.addEventListener('click', () => this.play());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.stopBtn.addEventListener('click', () => this.stop());

        // Export
        this.exportJsonBtn.addEventListener('click', () => this.exportJson());
        this.exportWavBtn.addEventListener('click', () => this.exportWav()); // ← ДОБАВЛЕНО
        this.downloadJsonBtn.addEventListener('click', () => this.downloadJson());

        // Import
        this.jsonUploadArea.addEventListener('click', () => this.jsonFileInput.click());
        this.jsonUploadArea.addEventListener('dragover', (e) => this.handleJsonDragOver(e));
        this.jsonUploadArea.addEventListener('dragleave', () => this.handleJsonDragLeave());
        this.jsonUploadArea.addEventListener('drop', (e) => this.handleJsonDrop(e));
        this.jsonFileInput.addEventListener('change', (e) => this.handleJsonFileSelect(e));
        this.createMidiBtn.addEventListener('click', () => this.createMidi());
        this.previewMidiBtn.addEventListener('click', () => this.previewMidi());

        // Recording
        this.startRecordBtn.addEventListener('click', () => this.startRecording());
        this.stopRecordBtn.addEventListener('click', () => this.stopRecording());

        // Window resize
        window.addEventListener('resize', () => this.visualizer.resize());

        // Progress update
        setInterval(() => this.updateProgress(), 100);
    }

    // === TAB SWITCHING ===
    switchTab(tab) {
        this.tabs.forEach(t => t.classList.remove('active'));
        this.tabContents.forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        const targetTab = tab.getAttribute('data-tab');
        document.getElementById(targetTab).classList.add('active');
    }

    // === FILE UPLOAD ===
    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave() {
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) this.loadFile(file);
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) this.loadFile(file);
    }

    loadFile(file) {
        this.currentFileName = file.name;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const midiData = this.player.loadMIDI(e.target.result);
                
                this.fileName.textContent = file.name;
                this.fileInfo.classList.add('active');
                
                let infoText = `Формат: ${midiData.format}, Треков: ${midiData.trackCount}, `;
                infoText += `Разрешение: ${midiData.ticksPerBeat} ticks/beat`;
                
                if (midiData.isSMPTE) {
                    infoText += ` (SMPTE: ${midiData.framesPerSecond} fps)`;
                }
                
                this.midiInfo.textContent = infoText;
                
                if (midiData.tempoMap && midiData.tempoMap.length > 0) {
                    const firstTempo = midiData.tempoMap[0];
                    this.tempoInfo.textContent = `Темп: ${firstTempo.bpm.toFixed(2)} BPM`;
                    this.tempoInfo.style.display = 'block';
                }
                
                this.showPlayerControls();
                this.totalTimeEl.textContent = this.formatTime(this.player.duration);
                this.status.textContent = '✅ Файл загружен. Готов к воспроизведению.';
                
            } catch (error) {
                this.status.textContent = '❌ Ошибка: ' + error.message;
                console.error(error);
            }
        };
        
        reader.readAsArrayBuffer(file);
    }

    showPlayerControls() {
        this.visualizerEl.classList.add('active');
        this.visualizationMode.classList.add('active');
        this.instrumentSelector.classList.add('active');
        this.effectsSection.classList.add('active');
        this.volumeControl.classList.add('active');
        this.tempoControl.classList.add('active');
        this.progressContainer.classList.add('active');
        
        this.playBtn.disabled = false;
        this.pauseBtn.disabled = false;
        this.stopBtn.disabled = false;
        
        this.exportJsonBtn.disabled = false;
        this.exportWavBtn.disabled = false;
        this.startRecordBtn.disabled = false;
    }

    // === VISUALIZATION ===
    changeVisualizationMode(btn) {
        this.vizBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.visualizer.setMode(btn.getAttribute('data-mode'));
    }

    // === INSTRUMENT ===
    async changeInstrument(e) {
        const instrument = e.target.value;
        await this.player.setInstrument(instrument);
        this.status.textContent = `🎼 Инструмент изменен: ${instrument}`;
    }

    // === EFFECTS ===
    toggleReverb(e) {
        const enabled = e.target.checked;
        this.reverbParams.style.display = enabled ? 'block' : 'none';
        this.player.audioEffects.setReverbEnabled(enabled);
    }

    updateReverbDecay(e) {
        const value = parseFloat(e.target.value);
        this.reverbDecayValue.textContent = value.toFixed(1);
        this.player.audioEffects.setReverbDecay(value);
    }

    updateReverbWet(e) {
        const value = parseInt(e.target.value);
        this.reverbWetValue.textContent = value + '%';
        this.player.audioEffects.setReverbWet(value);
    }

    toggleChorus(e) {
        const enabled = e.target.checked;
        this.chorusParams.style.display = enabled ? 'block' : 'none';
        this.player.audioEffects.setChorusEnabled(enabled);
    }

    updateChorusDepth(e) {
        const value = parseFloat(e.target.value);
        this.chorusDepthValue.textContent = value.toFixed(2);
        this.player.audioEffects.setChorusDepth(value);
    }

    updateChorusFrequency(e) {
        const value = parseFloat(e.target.value);
        this.chorusFrequencyValue.textContent = value.toFixed(1) + ' Hz';
        this.player.audioEffects.setChorusFrequency(value);
    }

    toggleDelay(e) {
        const enabled = e.target.checked;
        this.delayParams.style.display = enabled ? 'block' : 'none';
        this.player.audioEffects.setDelayEnabled(enabled);
    }

    updateDelayTime(e) {
        const value = parseFloat(e.target.value);
        this.delayTimeValue.textContent = value.toFixed(2) + 's';
        this.player.audioEffects.setDelayTime(value);
    }

    updateDelayFeedback(e) {
        const value = parseFloat(e.target.value);
        this.delayFeedbackValue.textContent = value.toFixed(2);
        this.player.audioEffects.setDelayFeedback(value);
    }

    toggleDistortion(e) {
        const enabled = e.target.checked;
        this.distortionParams.style.display = enabled ? 'block' : 'none';
        this.player.audioEffects.setDistortionEnabled(enabled);
    }

    updateDistortionAmount(e) {
        const value = parseFloat(e.target.value);
        this.distortionAmountValue.textContent = value.toFixed(2);
        this.player.audioEffects.setDistortionAmount(value);
    }

    // === CONTROLS ===
    updateVolume(e) {
        const value = parseInt(e.target.value);
        this.volumeValue.textContent = value + '%';
        this.player.setVolume(value);
    }

    updateTempo(e) {
        const value = parseInt(e.target.value);
        this.tempoValue.textContent = value + '%';
        this.player.setTempo(value);
    }

    // === PLAYER ===
    async play() {
        await this.player.play(this.player.currentTime);
        this.status.textContent = '▶ Воспроизведение...';
    }

    pause() {
        this.player.pause();
        this.status.textContent = '⏸ Пауза';
    }

    stop() {
        this.player.stop();
        this.currentTimeEl.textContent = '0:00';
        this.progressFill.style.width = '0%';
        this.status.textContent = '⏹ Остановлено';
    }

    // === PROGRESS ===
    updateProgress() {
        if (this.player.isPlaying) {
            const progress = (this.player.currentTime / this.player.duration) * 100;
            this.progressFill.style.width = progress + '%';
            this.currentTimeEl.textContent = this.formatTime(this.player.currentTime);
        }
    }

    seekTo(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const time = percentage * this.player.duration;
        this.player.seek(time);
        this.progressFill.style.width = (percentage * 100) + '%';
        this.currentTimeEl.textContent = this.formatTime(time);
    }

    // === EXPORT ===
    exportJson() {
        const jsonData = this.player.exportToJSON();
        if (jsonData) {
            const jsonStr = JSON.stringify(jsonData, null, 2);
            this.jsonOutput.value = jsonStr;
            this.downloadJsonBtn.disabled = false;
            this.status.textContent = '✅ JSON экспортирован';
        }
    }

    // ← НОВЫЙ МЕТОД: ЭКСПОРТ В WAV
    async exportWav() {
        if (!this.player.midiData) {
            alert('Сначала загрузите MIDI файл!');
            return;
        }

        try {
            // Отключаем кнопку и показываем прогресс
            this.exportWavBtn.disabled = true;
            const originalText = this.exportWavBtn.innerHTML;
            this.exportWavBtn.innerHTML = '<span>⏳</span> Экспорт... 0%';
            
            this.status.textContent = '⏳ Начало экспорта в WAV...';

            // Вызываем метод экспорта с коллбэком прогресса
            const wavBlob = await this.player.exportToWAV((progress) => {
                this.exportWavBtn.innerHTML = `<span>⏳</span> Экспорт... ${Math.round(progress)}%`;
                this.status.textContent = `⏳ Экспорт в WAV... ${Math.round(progress)}%`;
            });

            // Скачиваем файл
            const url = URL.createObjectURL(wavBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.currentFileName.replace(/\.(mid|midi)$/i, '.wav') || 'exported.wav';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.status.textContent = '✅ WAV файл успешно экспортирован и скачан!';
            alert('WAV файл успешно экспортирован!');

            // Восстанавливаем кнопку
            this.exportWavBtn.innerHTML = originalText;
            this.exportWavBtn.disabled = false;

        } catch (error) {
            console.error('❌ Ошибка экспорта в WAV:', error);
            this.status.textContent = '❌ Ошибка экспорта в WAV: ' + error.message;
            alert('Ошибка экспорта в WAV:\n' + error.message);
            
            // Восстанавливаем кнопку
            this.exportWavBtn.innerHTML = '<span>🎵</span> Экспортировать в WAV';
            this.exportWavBtn.disabled = false;
        }
    }

    downloadJson() {
        const jsonStr = this.jsonOutput.value;
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.currentFileName.replace(/\.(mid|midi)$/i, '.json');
        a.click();
        URL.revokeObjectURL(url);
    }

    // === IMPORT ===
    handleJsonDragOver(e) {
        e.preventDefault();
        this.jsonUploadArea.classList.add('dragover');
    }

    handleJsonDragLeave() {
        this.jsonUploadArea.classList.remove('dragover');
    }

    handleJsonDrop(e) {
        e.preventDefault();
        this.jsonUploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/json') {
            this.loadJsonFile(file);
        }
    }

    handleJsonFileSelect(e) {
        const file = e.target.files[0];
        if (file) this.loadJsonFile(file);
    }

    loadJsonFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.jsonInput.value = e.target.result;
        };
        reader.readAsText(file);
    }

    createMidi() {
        try {
            const jsonStr = this.jsonInput.value;
            const jsonData = JSON.parse(jsonStr);
            
            const writer = new MIDIWriter();
            const midiBytes = writer.createMIDI(jsonData);
            
            const blob = new Blob([midiBytes], { type: 'audio/midi' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'created.mid';
            a.click();
            URL.revokeObjectURL(url);
            
            this.importStatus.textContent = '✅ MIDI файл создан и скачан!';
        } catch (error) {
            this.importStatus.textContent = '❌ Ошибка: ' + error.message;
        }
    }

    previewMidi() {
        try {
            const jsonStr = this.jsonInput.value;
            const jsonData = JSON.parse(jsonStr);
            
            const writer = new MIDIWriter();
            const midiBytes = writer.createMIDI(jsonData);
            
            this.player.loadMIDI(midiBytes.buffer);
            
            this.tabs[0].click();
            
            this.fileName.textContent = 'Предпросмотр с��зданного MIDI';
            this.fileInfo.classList.add('active');
            this.midiInfo.textContent = `Треков: ${jsonData.tracks.length}`;
            
            this.showPlayerControls();
            this.totalTimeEl.textContent = this.formatTime(this.player.duration);
            
            this.importStatus.textContent = '✅ Предпросмотр готов!';
        } catch (error) {
            this.importStatus.textContent = '❌ Ошибка: ' + error.message;
        }
    }

    // === RECORDING ===
    async startRecording() {
        try {
            await this.player.startRecording();
            this.recordingIndicator.classList.add('active');
            this.stopRecordBtn.disabled = false;
            this.startRecordBtn.disabled = true;
            this.recordStatus.textContent = '⚫ Запись началась. Нажмите "Играть" для воспроизведения.';
        } catch (error) {
            this.recordStatus.textContent = '❌ Ошибка записи: ' + error.message;
        }
    }

    async stopRecording() {
        const audioBlob = await this.player.stopRecording();
        if (audioBlob) {
            this.recordingIndicator.classList.remove('active');
            this.downloadAudioBtn.disabled = false;
            this.stopRecordBtn.disabled = true;
            this.startRecordBtn.disabled = false;
            
            this.downloadAudioBtn.onclick = () => {
                const url = URL.createObjectURL(audioBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = this.currentFileName.replace(/\.(mid|midi)$/i, '_recorded.webm');
                a.click();
                URL.revokeObjectURL(url);
            };
            
            this.recordStatus.textContent = '✅ Запись завершена. Нажмите "Скачать аудио".';
        }
    }

    // === UTILITIES ===
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}