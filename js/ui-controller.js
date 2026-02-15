/**
 * ═══════════════════════════════════════════════════════════
 * UI CONTROLLER - Управление интерфейсом
 * Полная версия с обработкой всех элементов и событий
 * ═══════════════════════════════════════════════════════════
 */

class UIController {
    constructor(player, visualizer) {
        this.player = player;
        this.visualizer = visualizer;
        this.currentFileName = '';
        this.jsonData = null;
        
        console.log('🎮 Инициализация UIController...');
        
        this.initElements();
        this.initEventListeners();
        
        console.log('✅ UIController инициализирован');
    }

    /**
     * Инициализация всех элементов DOM
     */
    initElements() {
        // === TABS ===
        this.tabs = document.querySelectorAll('.tab');
        this.tabContents = document.querySelectorAll('.tab-content');

        // === UPLOAD AREA ===
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.midiInfo = document.getElementById('midiInfo');
        this.tempoInfo = document.getElementById('tempoInfo');

        // === VISUALIZER ===
        this.visualizerEl = document.getElementById('visualizer');
        this.visualizationMode = document.getElementById('visualizationMode');
        this.vizBtns = document.querySelectorAll('.viz-btn');

        // === INSTRUMENT SELECTOR ===
        this.instrumentSelector = document.getElementById('instrumentSelector');
        this.instrumentType = document.getElementById('instrumentType');

        // === EFFECTS SECTION ===
        this.effectsSection = document.getElementById('effectsSection');
        
        // Reverb
        this.reverbEnabled = document.getElementById('reverbEnabled');
        this.reverbParams = document.getElementById('reverbParams');
        this.reverbDecay = document.getElementById('reverbDecay');
        this.reverbDecayValue = document.getElementById('reverbDecayValue');
        this.reverbWet = document.getElementById('reverbWet');
        this.reverbWetValue = document.getElementById('reverbWetValue');

        // Chorus
        this.chorusEnabled = document.getElementById('chorusEnabled');
        this.chorusParams = document.getElementById('chorusParams');
        this.chorusDepth = document.getElementById('chorusDepth');
        this.chorusDepthValue = document.getElementById('chorusDepthValue');
        this.chorusFrequency = document.getElementById('chorusFrequency');
        this.chorusFrequencyValue = document.getElementById('chorusFrequencyValue');

        // Delay
        this.delayEnabled = document.getElementById('delayEnabled');
        this.delayParams = document.getElementById('delayParams');
        this.delayTime = document.getElementById('delayTime');
        this.delayTimeValue = document.getElementById('delayTimeValue');
        this.delayFeedback = document.getElementById('delayFeedback');
        this.delayFeedbackValue = document.getElementById('delayFeedbackValue');

        // Distortion
        this.distortionEnabled = document.getElementById('distortionEnabled');
        this.distortionParams = document.getElementById('distortionParams');
        this.distortionAmount = document.getElementById('distortionAmount');
        this.distortionAmountValue = document.getElementById('distortionAmountValue');

        // === CONTROLS ===
        this.volumeControl = document.getElementById('volumeControl');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeValue = document.getElementById('volumeValue');
        
        this.tempoControl = document.getElementById('tempoControl');
        this.tempoSlider = document.getElementById('tempoSlider');
        this.tempoValue = document.getElementById('tempoValue');

        // === PROGRESS BAR ===
        this.progressContainer = document.getElementById('progressContainer');
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
        this.currentTimeEl = document.getElementById('currentTime');
        this.totalTimeEl = document.getElementById('totalTime');

        // === PLAYER BUTTONS ===
        this.playBtn = document.getElementById('playBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.status = document.getElementById('status');

        // === EXPORT TAB ===
        this.exportJsonBtn = document.getElementById('exportJsonBtn');
        this.exportWavBtn = document.getElementById('exportWavBtn');
        this.jsonOutput = document.getElementById('jsonOutput');
        this.downloadJsonBtn = document.getElementById('downloadJsonBtn');

        // === IMPORT TAB ===
        this.jsonUploadArea = document.getElementById('jsonUploadArea');
        this.jsonFileInput = document.getElementById('jsonFileInput');
        this.jsonInput = document.getElementById('jsonInput');
        this.createMidiBtn = document.getElementById('createMidiBtn');
        this.previewMidiBtn = document.getElementById('previewMidiBtn');
        this.importStatus = document.getElementById('importStatus');

        // === RECORD TAB ===
        this.recordingIndicator = document.getElementById('recordingIndicator');
        this.startRecordBtn = document.getElementById('startRecordBtn');
        this.stopRecordBtn = document.getElementById('stopRecordBtn');
        this.downloadAudioBtn = document.getElementById('downloadAudioBtn');
        this.recordStatus = document.getElementById('recordStatus');

        console.log('✅ Все элементы DOM инициализированы');
    }

    /**
     * Инициализация всех обработчиков событий
     */
    initEventListeners() {
        // === TABS ===
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        // === FILE UPLOAD ===
        this.uploadArea.addEventListener('click', () => {
            console.log('🖱️ Клик по области загрузки');
            this.fileInput.click();
        });
        
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // === VISUALIZATION MODE ===
        this.vizBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                console.log('🎨 Смена режима визуализации:', mode);
                this.changeVisualizationMode(mode);
            });
        });

        // === INSTRUMENT SELECTOR ===
        this.instrumentType.addEventListener('change', async () => {
            const instrumentNumber = parseInt(this.instrumentType.value);
            console.log('🎹 Смена инструмента через UI:', instrumentNumber);
            await this.player.changeInstrument(instrumentNumber);
        });

        // === EFFECTS ===
        this.initEffectListeners();

        // === VOLUME ===
        this.volumeSlider.addEventListener('input', () => {
            const volume = parseInt(this.volumeSlider.value);
            this.volumeValue.textContent = volume + '%';
            this.player.setVolume(volume);
        });

        // === TEMPO ===
        this.tempoSlider.addEventListener('input', () => {
            const tempo = parseInt(this.tempoSlider.value);
            this.tempoValue.textContent = tempo + '%';
            this.player.setTempo(tempo);
        });

        // === PROGRESS BAR ===
        this.progressBar.addEventListener('click', (e) => this.handleProgressClick(e));

        // === PLAYER CONTROLS ===
        this.playBtn.addEventListener('click', () => this.handlePlay());
        this.pauseBtn.addEventListener('click', () => this.handlePause());
        this.stopBtn.addEventListener('click', () => this.handleStop());

        // === EXPORT ===
        this.exportJsonBtn.addEventListener('click', () => this.handleExportJSON());
        this.downloadJsonBtn.addEventListener('click', () => this.handleDownloadJSON());

        // === IMPORT ===
        this.jsonUploadArea.addEventListener('click', () => this.jsonFileInput.click());
        this.jsonUploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.jsonUploadArea.addEventListener('drop', (e) => this.handleJSONDrop(e));
        this.jsonFileInput.addEventListener('change', (e) => this.handleJSONFileSelect(e));
        this.createMidiBtn.addEventListener('click', () => this.handleCreateMIDI());
        this.previewMidiBtn.addEventListener('click', () => this.handlePreviewMIDI());

        // === WINDOW EVENTS ===
        window.addEventListener('resize', () => {
            this.visualizer.resize();
        });

        // === PROGRESS UPDATE ===
        setInterval(() => this.updateProgress(), 100);

        console.log('✅ Все обработчики событий зарегистрированы');
    }

    /**
     * Инициализация обработчиков эффектов
     */
    initEffectListeners() {
        // === REVERB ===
        this.reverbEnabled.addEventListener('change', () => {
            const enabled = this.reverbEnabled.checked;
            this.reverbParams.style.display = enabled ? 'block' : 'none';
            this.player.audioEffects.setReverbEnabled(enabled);
            console.log('🌊 Reverb:', enabled ? 'ON' : 'OFF');
        });

        this.reverbDecay.addEventListener('input', () => {
            const value = parseFloat(this.reverbDecay.value);
            this.reverbDecayValue.textContent = value.toFixed(1);
            this.player.audioEffects.setReverbDecay(value);
        });

        this.reverbWet.addEventListener('input', () => {
            const value = parseInt(this.reverbWet.value);
            this.reverbWetValue.textContent = value + '%';
            this.player.audioEffects.setReverbWet(value);
        });

        // === CHORUS ===
        this.chorusEnabled.addEventListener('change', () => {
            const enabled = this.chorusEnabled.checked;
            this.chorusParams.style.display = enabled ? 'block' : 'none';
            this.player.audioEffects.setChorusEnabled(enabled);
            console.log('🎵 Chorus:', enabled ? 'ON' : 'OFF');
        });

        this.chorusDepth.addEventListener('input', () => {
            const value = parseFloat(this.chorusDepth.value);
            this.chorusDepthValue.textContent = value.toFixed(2);
            this.player.audioEffects.setChorusDepth(value);
        });

        this.chorusFrequency.addEventListener('input', () => {
            const value = parseFloat(this.chorusFrequency.value);
            this.chorusFrequencyValue.textContent = value.toFixed(1) + ' Hz';
            this.player.audioEffects.setChorusFrequency(value);
        });

        // === DELAY ===
        this.delayEnabled.addEventListener('change', () => {
            const enabled = this.delayEnabled.checked;
            this.delayParams.style.display = enabled ? 'block' : 'none';
            this.player.audioEffects.setDelayEnabled(enabled);
            console.log('⏱️ Delay:', enabled ? 'ON' : 'OFF');
        });

        this.delayTime.addEventListener('input', () => {
            const value = parseFloat(this.delayTime.value);
            this.delayTimeValue.textContent = value.toFixed(2) + 's';
            this.player.audioEffects.setDelayTime(value);
        });

        this.delayFeedback.addEventListener('input', () => {
            const value = parseFloat(this.delayFeedback.value);
            this.delayFeedbackValue.textContent = value.toFixed(2);
            this.player.audioEffects.setDelayFeedback(value);
        });

        // === DISTORTION ===
        this.distortionEnabled.addEventListener('change', () => {
            const enabled = this.distortionEnabled.checked;
            this.distortionParams.style.display = enabled ? 'block' : 'none';
            this.player.audioEffects.setDistortionEnabled(enabled);
            console.log('🔥 Distortion:', enabled ? 'ON' : 'OFF');
        });

        this.distortionAmount.addEventListener('input', () => {
            const value = parseFloat(this.distortionAmount.value);
            this.distortionAmountValue.textContent = value.toFixed(2);
            this.player.audioEffects.setDistortionAmount(value);
        });

        console.log('✅ Обработчики эффектов инициализированы');
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * TABS
     * ═══════════════════════════════════════════════════════════
     */
    switchTab(tabName) {
        console.log('📑 Переключение вкладки на:', tabName);
        
        this.tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabName);
        });
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * FILE UPLOAD
     * ═══════════════════════════════════════════════════════════
     */
    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            console.log('📂 Файл перетащен:', files[0].name);
            this.loadMIDIFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            console.log('📂 Файл выбран:', files[0].name);
            this.loadMIDIFile(files[0]);
        }
    }

    async loadMIDIFile(file) {
        if (!file.name.match(/\.(mid|midi)$/i)) {
            alert('Пожалуйста, выберите MIDI файл (.mid или .midi)');
            return;
        }

        this.currentFileName = file.name;
        console.log('📖 Загрузка MIDI файла:', this.currentFileName);
        this.status.textContent = '⏳ Загрузка MIDI файла...';

        try {
            // Читаем файл
            const arrayBuffer = await file.arrayBuffer();
            console.log('✅ Файл прочитан, размер:', arrayBuffer.byteLength, 'байт');
            
            // Загружаем в плеер
            const midiData = this.player.loadMIDI(arrayBuffer);
            console.log('✅ MIDI данные загружены в плеер');

            // Отображаем информацию
            this.displayMIDIInfo(midiData);
            
            // Активируем кнопки управления
            this.enableControls();

            // Обновляем UI
            this.fileName.textContent = '📄 ' + this.currentFileName;
            this.fileInfo.style.display = 'block';
            this.status.textContent = '✅ Файл загружен. Нажмите "Играть"';

            console.log('✅ MIDI файл успешно загружен');
            
        } catch (error) {
            console.error('❌ Ошибка загрузки MIDI файла:', error);
            this.status.textContent = '❌ Ошибка загрузки: ' + error.message;
            alert('Ошибка загрузки MIDI файла:\n\n' + error.message);
        }
    }

    displayMIDIInfo(midiData) {
        const info = [
            `<strong>Формат:</strong> ${midiData.format}`,
            `<strong>Треков:</strong> ${midiData.tracks.length}`,
            `<strong>Ticks per beat:</strong> ${midiData.ticksPerBeat}`,
            `<strong>Длительность:</strong> ${this.formatTime(this.player.getDuration())}`
        ];

        // Подсчитываем количество нот
        let totalNotes = 0;
        midiData.tracks.forEach(track => {
            track.events.forEach(event => {
                if (event.type === 'noteOn' && event.velocity > 0) {
                    totalNotes++;
                }
            });
        });
        info.push(`<strong>Всего нот:</strong> ${totalNotes}`);

        this.midiInfo.innerHTML = info.join('<br>');
        this.totalTimeEl.textContent = this.formatTime(this.player.getDuration());
        
        console.log('📊 Информация о MIDI:', info);
    }

    enableControls() {
        this.playBtn.disabled = false;
        this.pauseBtn.disabled = false;
        this.stopBtn.disabled = false;
        this.exportJsonBtn.disabled = false;
        this.exportWavBtn.disabled = false;
        this.startRecordBtn.disabled = false;
        
        console.log('✅ Элементы управления активированы');
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * VISUALIZATION
     * ═══════════════════════════════════════════════════════════
     */
    changeVisualizationMode(mode) {
        this.vizBtns.forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.mode === mode);
        });
        this.visualizer.setMode(mode);
        console.log('🎨 Режим визуализации изменен на:', mode);
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * PLAYER CONTROLS
     * ═══════════════════════════════════════════════════════════
     */
    async handlePlay() {
        try {
            console.log('▶️ UI: Нажата кнопка Play');
            
            // Проверяем что файл загружен
            if (!this.player.midiData) {
                alert('Сначала загрузите MIDI файл');
                this.status.textContent = '⚠️ Загрузите MIDI файл';
                return;
            }
            
            // Воспроизводим
            await this.player.play();
            
            // Обновляем кнопки
            this.playBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.stopBtn.disabled = false;
            
            console.log('✅ UI: Воспроизведение началось');
            
        } catch (error) {
            console.error('❌ UI: Ошибка воспроизведения:', error);
            this.status.textContent = '❌ Ошибка: ' + error.message;
            alert('Ошибка воспроизведения:\n\n' + error.message + '\n\nПроверьте консоль для подробностей.');
            
            // Сбрасываем кнопки
            this.playBtn.disabled = false;
            this.pauseBtn.disabled = true;
        }
    }

    handlePause() {
        console.log('⏸️ UI: Нажата кнопка Pause');
        this.player.pause();
        
        this.playBtn.disabled = false;
        this.pauseBtn.disabled = true;
    }

    handleStop() {
        console.log('⏹️ UI: Нажата кнопка Stop');
        this.player.stop();
        
        this.playBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.progressFill.style.width = '0%';
        this.currentTimeEl.textContent = '0:00';
    }

    handleProgressClick(e) {
        // TODO: Implement seek functionality
        console.log('⚠️ Перемотка пока не реализована');
    }

    updateProgress() {
        if (this.player.isPlaying) {
            const currentTime = this.player.getCurrentTime();
            const duration = this.player.getDuration();
            
            if (duration > 0) {
                const progress = (currentTime / duration) * 100;
                this.progressFill.style.width = progress + '%';
                this.currentTimeEl.textContent = this.formatTime(currentTime);
            }
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * EXPORT
     * ═══════════════════════════════════════════════════════════
     */
    handleExportJSON() {
        console.log('📤 Экспорт в JSON');
        
        const jsonData = this.player.exportToJSON();
        if (jsonData) {
            this.jsonData = jsonData;
            this.jsonOutput.value = JSON.stringify(jsonData, null, 2);
            this.downloadJsonBtn.disabled = false;
            this.status.textContent = '✅ Экспортировано в JSON';
            console.log('✅ JSON данные готовы');
        } else {
            this.status.textContent = '❌ Нет данных для экспорта';
        }
    }

    handleDownloadJSON() {
        const jsonText = this.jsonOutput.value;
        if (!jsonText) {
            alert('Сначала эк��портируйте в JSON');
            return;
        }

        console.log('💾 Скачивание JSON файла');
        
        const blob = new Blob([jsonText], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.currentFileName.replace(/\.(mid|midi)$/i, '.json') || 'export.json';
        a.click();
        URL.revokeObjectURL(url);

        this.status.textContent = '✅ JSON файл скачан';
        console.log('✅ JSON файл скачан:', a.download);
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * IMPORT
     * ═══════════════════════════════════════════════════════════
     */
    handleJSONDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].name.match(/\.json$/i)) {
            console.log('📂 JSON файл перетащен:', files[0].name);
            this.loadJSONFile(files[0]);
        }
    }

    handleJSONFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            console.log('📂 JSON файл выбран:', files[0].name);
            this.loadJSONFile(files[0]);
        }
    }

    async loadJSONFile(file) {
        try {
            const text = await file.text();
            this.jsonInput.value = text;
            this.importStatus.textContent = '✅ JSON файл загружен: ' + file.name;
            console.log('✅ JSON файл загружен:', file.name);
        } catch (error) {
            console.error('❌ Ошибка загрузки JSON:', error);
            this.importStatus.textContent = '❌ Ошибка загрузки JSON';
            alert('Ошибка загрузки JSON:\n\n' + error.message);
        }
    }

    handleCreateMIDI() {
        try {
            const jsonText = this.jsonInput.value.trim();
            if (!jsonText) {
                alert('Введите JSON данные');
                this.importStatus.textContent = '⚠️ Введите JSON данные';
                return;
            }

            console.log('🎵 Создание MIDI из JSON');
            
            const jsonData = JSON.parse(jsonText);
            const writer = new MIDIWriter();
            const midiData = writer.createMIDI(jsonData);

            // Скачиваем MIDI файл
            const blob = new Blob([midiData], { type: 'audio/midi' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'created-' + Date.now() + '.mid';
            a.click();
            URL.revokeObjectURL(url);

            this.importStatus.textContent = '✅ MIDI файл создан и скачан: ' + a.download;
            console.log('✅ MIDI файл создан:', a.download);

        } catch (error) {
            console.error('❌ Ошибка создания MIDI:', error);
            this.importStatus.textContent = '❌ Ошибка: ' + error.message;
            alert('Ошибка создания MIDI:\n\n' + error.message + '\n\nПроверьте формат JSON');
        }
    }

    handlePreviewMIDI() {
        try {
            const jsonText = this.jsonInput.value.trim();
            if (!jsonText) {
                alert('Введите JSON данные');
                return;
            }

            console.log('👁️ Предпросмотр MIDI');
            
            const jsonData = JSON.parse(jsonText);
            
            // Подсчитываем статистику
            let totalNotes = 0;
            let totalDuration = 0;
            
            jsonData.tracks.forEach(track => {
                track.notes.forEach(note => {
                    totalNotes++;
                    const endTime = note.time + note.duration;
                    if (endTime > totalDuration) {
                        totalDuration = endTime;
                    }
                });
            });

            const info = `
Предпросмотр:
━━━━━━━━━━━━━━━━
Треков: ${jsonData.tracks.length}
Нот: ${totalNotes}
Длительность: ${this.formatTime(totalDuration)}
            `.trim();

            alert(info);
            this.importStatus.textContent = '✅ Предпросмотр выполнен';
            console.log('✅ Предпросмотр:', info);

        } catch (error) {
            console.error('❌ Ошибка предпросмотра:', error);
            this.importStatus.textContent = '❌ Ошибка: ' + error.message;
            alert('Ошибка предпросмотра:\n\n' + error.message);
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * HELPERS
     * ═══════════════════════════════════════════════════════════
     */
    formatTime(seconds) {
        if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

console.log('✅ UIController модуль загружен');