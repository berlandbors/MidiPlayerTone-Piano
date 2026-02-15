/**
 * ═══════════════════════════════════════════════════════════
 * MAIN - Инициализация и глобальное управление приложением
 * ═══════════════════════════════════════════════════════════
 */

let player;
let visualizer;
let uiController;
let isAppReady = false;

// Конфигурация приложения
const APP_CONFIG = {
    version: '3.0.0',
    name: 'Professional Piano Player',
    defaultInstrument: 0, // Acoustic Grand Piano
    defaultVolume: 70,
    defaultTempo: 100,
    autoSaveSettings: true,
    debugMode: true
};

/**
 * Инициализация приложения при загрузке DOM
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log(`🎹 ${APP_CONFIG.name} v${APP_CONFIG.version}`);
    console.log('Powered by Tone.js');
    console.log('═════════════════════════════════════════════════');
    
    try {
        // Показываем индикатор загрузки
        showLoadingIndicator();
        
        // Инициализация визуализатора
        console.log('📊 Инициализация визуализатора...');
        const canvas = document.getElementById('canvas');
        const vizDebug = document.getElementById('vizDebug');
        
        if (!canvas || !vizDebug) {
            throw new Error('Не найдены элементы canvas или vizDebug');
        }
        
        visualizer = new Visualizer(canvas, vizDebug);
        console.log('✅ Визуализатор инициализирован');

        // Инициализация плеера с PianoSampler
        console.log('🎹 Инициализация MIDI плеера...');
        player = new MIDIPlayer(visualizer);
        console.log('✅ MIDI плеер инициализирован');

        // Инициализация UI контроллера
        console.log('🎮 Инициализация UI контроллера...');
        uiController = new UIController(player, visualizer);
        console.log('✅ UI контроллер инициализирован');

        // Загружаем сохраненные настройки
        await loadSavedSettings();

        // Регистрируем глобальные обработчики
        registerGlobalHandlers();

        // Инициализируем горячие клавиши
        initKeyboardShortcuts();

        // Скрываем индикатор загрузки
        hideLoadingIndicator();

        isAppReady = true;
        console.log('═════════════════════════════════════════════════');
        console.log('🎉 Приложение готово к работе!');
        console.log('📝 Загрузите MIDI файл для начала');
        console.log('ℹ️  Нажмите F1 для справки по горячим клавишам');
        
        // Показываем приветственное сообщение
        showWelcomeMessage();

    } catch (error) {
        console.error('❌ Критическая ошибка инициализации:', error);
        hideLoadingIndicator();
        showErrorMessage('Произошла ошибка при запуске приложения', error.message);
    }
});

/**
 * Загрузка сохраненных настроек из localStorage
 */
async function loadSavedSettings() {
    if (!APP_CONFIG.autoSaveSettings) return;

    try {
        console.log('💾 Загрузка сохраненных настроек...');
        
        const savedSettings = localStorage.getItem('pianoPlayerSettings');
        if (!savedSettings) {
            console.log('ℹ️  Сохраненных настроек не найдено, используем значения по умолчанию');
            return;
        }

        const settings = JSON.parse(savedSettings);
        
        // Восстанавливаем инструмент
        if (settings.instrument !== undefined) {
            const instrumentSelect = document.getElementById('instrumentType');
            if (instrumentSelect) {
                instrumentSelect.value = settings.instrument;
            }
        }

        // Восстанавливаем громкость
        if (settings.volume !== undefined) {
            const volumeSlider = document.getElementById('volumeSlider');
            const volumeValue = document.getElementById('volumeValue');
            if (volumeSlider && volumeValue) {
                volumeSlider.value = settings.volume;
                volumeValue.textContent = settings.volume + '%';
            }
        }

        // Восстанавливаем темп
        if (settings.tempo !== undefined) {
            const tempoSlider = document.getElementById('tempoSlider');
            const tempoValue = document.getElementById('tempoValue');
            if (tempoSlider && tempoValue) {
                tempoSlider.value = settings.tempo;
                tempoValue.textContent = settings.tempo + '%';
            }
        }

        // Восстанавливаем режим визуализации
        if (settings.visualizationMode) {
            visualizer.setMode(settings.visualizationMode);
        }

        console.log('✅ Настройки загружены:', settings);
        
    } catch (error) {
        console.warn('⚠️ Ошибка загрузки настроек:', error);
        localStorage.removeItem('pianoPlayerSettings');
    }
}

/**
 * Сохранение настроек в localStorage
 */
function saveSettings() {
    if (!APP_CONFIG.autoSaveSettings) return;

    try {
        const settings = {
            instrument: parseInt(document.getElementById('instrumentType')?.value || 0),
            volume: parseInt(document.getElementById('volumeSlider')?.value || 70),
            tempo: parseInt(document.getElementById('tempoSlider')?.value || 100),
            visualizationMode: visualizer.mode,
            timestamp: Date.now()
        };

        localStorage.setItem('pianoPlayerSettings', JSON.stringify(settings));
        
        if (APP_CONFIG.debugMode) {
            console.log('💾 Настройки сохранены:', settings);
        }
        
    } catch (error) {
        console.warn('⚠️ Ошибка сохранения настроек:', error);
    }
}

/**
 * Регистрация глобальных обработчиков событий
 */
function registerGlobalHandlers() {
    // Обработка изменения размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (visualizer) {
                visualizer.resize();
                console.log('🔄 Размер окна изменен, визуализатор обновлен');
            }
        }, 250);
    });

    // Обработка видимости страницы
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('👁️ Страница скрыта');
            if (player && player.isPlaying) {
                player.pause();
                console.log('⏸️ Воспроизведение приостановлено (страница скрыта)');
            }
        } else {
            console.log('👁️ Страница видима');
        }
    });

    // Сохранение настроек при закрытии
    window.addEventListener('beforeunload', (e) => {
        saveSettings();
        
        // Предупреждение если идет воспроизведение
        if (player && player.isPlaying) {
            e.preventDefault();
            e.returnValue = 'Воспроизведение будет остановлено. Продолжить?';
            return e.returnValue;
        }
    });

    // Глобальная ��бработка ошибок
    window.addEventListener('error', (event) => {
        console.error('❌ Глобальная ошибка:', event.error);
        if (APP_CONFIG.debugMode) {
            showErrorMessage('Произошла ошибка', event.error?.message || 'Неизвестная ошибка');
        }
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('❌ Необработанный промис:', event.reason);
        if (APP_CONFIG.debugMode) {
            showErrorMessage('Ошибка промиса', event.reason?.message || 'Неизвестная ошибка');
        }
    });

    // Автосохранение настроек при изменении
    const autoSaveElements = [
        'instrumentType',
        'volumeSlider',
        'tempoSlider'
    ];

    autoSaveElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', () => {
                setTimeout(saveSettings, 500);
            });
        }
    });

    console.log('✅ Глобальные обработчики зарегистрированы');
}

/**
 * Инициализация горячих клавиш
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Игнорируем если фокус в текстовом поле
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
            return;
        }

        const key = e.key.toLowerCase();
        const ctrl = e.ctrlKey || e.metaKey;

        // Пробел - Play/Pause
        if (key === ' ') {
            e.preventDefault();
            if (player && player.midiData) {
                if (player.isPlaying) {
                    uiController.handlePause();
                } else {
                    uiController.handlePlay();
                }
            }
            return;
        }

        // Escape - Stop
        if (key === 'escape') {
            e.preventDefault();
            if (player && player.isPlaying) {
                uiController.handleStop();
            }
            return;
        }

        // F1 - Справка
        if (key === 'f1') {
            e.preventDefault();
            showKeyboardShortcuts();
            return;
        }

        // Ctrl/Cmd + O - Открыть файл
        if (ctrl && key === 'o') {
            e.preventDefault();
            document.getElementById('fileInput')?.click();
            return;
        }

        // Ctrl/Cmd + S - Сохранить настройки
        if (ctrl && key === 's') {
            e.preventDefault();
            saveSettings();
            showNotification('💾 Настройки сохранены');
            return;
        }

        // Цифры 1-8 - Переключение инструментов
        if (/^[1-8]$/.test(key)) {
            e.preventDefault();
            const instrumentNumber = parseInt(key) - 1;
            const instrumentSelect = document.getElementById('instrumentType');
            if (instrumentSelect) {
                instrumentSelect.value = instrumentNumber;
                instrumentSelect.dispatchEvent(new Event('change'));
            }
            return;
        }

        // Стрелки влево/вправо - Изменение темпа
        if (key === 'arrowleft' || key === 'arrowright') {
            e.preventDefault();
            const tempoSlider = document.getElementById('tempoSlider');
            if (tempoSlider) {
                const currentTempo = parseInt(tempoSlider.value);
                const newTempo = key === 'arrowright' 
                    ? Math.min(300, currentTempo + 5)
                    : Math.max(25, currentTempo - 5);
                tempoSlider.value = newTempo;
                tempoSlider.dispatchEvent(new Event('input'));
            }
            return;
        }

        // Стрелки вверх/вниз - Изменение громкости
        if (key === 'arrowup' || key === 'arrowdown') {
            e.preventDefault();
            const volumeSlider = document.getElementById('volumeSlider');
            if (volumeSlider) {
                const currentVolume = parseInt(volumeSlider.value);
                const newVolume = key === 'arrowup'
                    ? Math.min(100, currentVolume + 5)
                    : Math.max(0, currentVolume - 5);
                volumeSlider.value = newVolume;
                volumeSlider.dispatchEvent(new Event('input'));
            }
            return;
        }

        // V - Переключение режима визуализации
        if (key === 'v') {
            e.preventDefault();
            const modes = ['bars', 'wave', 'circle'];
            const currentMode = visualizer.mode;
            const currentIndex = modes.indexOf(currentMode);
            const nextIndex = (currentIndex + 1) % modes.length;
            const nextMode = modes[nextIndex];
            
            visualizer.setMode(nextMode);
            
            // Обновляем кнопки
            document.querySelectorAll('.viz-btn').forEach(btn => {
                btn.classList.toggle('selected', btn.dataset.mode === nextMode);
            });
            
            showNotification(`🎨 Визуализация: ${nextMode}`);
            return;
        }
    });

    console.log('✅ Горячие клавиши инициализированы');
}

/**
 * Показ справки по горячим клавишам
 */
function showKeyboardShortcuts() {
    const shortcuts = `
╔══════════════════════════════════════════════════════════╗
║              🎹 ГОРЯЧИЕ КЛАВИШИ                         ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  ПРОБЕЛ         - Воспроизведение / Пауза               ║
║  ESCAPE         - Остановить                            ║
║  F1             - Показать эту справку                  ║
║                                                          ║
║  Ctrl/Cmd + O   - Открыть MIDI файл                     ║
║  Ctrl/Cmd + S   - Сохранить настройки                   ║
║                                                          ║
║  1-8            - Переключение инструментов             ║
║  V              - Сменить режим визуализации            ║
║                                                          ║
║  ← →            - Изменить темп (±5%)                   ║
║  ↑ ↓            - Изменить громкость (±5%)              ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
    `;
    
    console.log(shortcuts);
    alert(shortcuts.trim());
}

/**
 * UI вспомогательные функции
 */
function showLoadingIndicator() {
    const statusEl = document.getElementById('status');
    if (statusEl) {
        statusEl.textContent = '⏳ Загрузка приложения...';
        statusEl.style.color = '#2196F3';
    }
}

function hideLoadingIndicator() {
    const statusEl = document.getElementById('status');
    if (statusEl) {
        statusEl.textContent = 'Загрузите MIDI файл для начала';
        statusEl.style.color = '';
    }
}

function showWelcomeMessage() {
    const statusEl = document.getElementById('status');
    if (statusEl) {
        statusEl.innerHTML = '👋 Добро пожаловать! Загрузите MIDI файл или перетащите его сюда. Нажмите <kbd>F1</kbd> для справки.';
    }
}

function showNotification(message, duration = 3000) {
    const statusEl = document.getElementById('status');
    if (statusEl) {
        const originalText = statusEl.textContent;
        statusEl.textContent = message;
        statusEl.style.color = '#4CAF50';
        
        setTimeout(() => {
            statusEl.textContent = originalText;
            statusEl.style.color = '';
        }, duration);
    }
    
    console.log('ℹ️', message);
}

function showErrorMessage(title, message) {
    alert(`${title}\n\n${message}\n\nПроверьте консоль для подробностей.`);
    
    const statusEl = document.getElementById('status');
    if (statusEl) {
        statusEl.textContent = `❌ ${title}: ${message}`;
        statusEl.style.color = '#f44336';
    }
}

/**
 * Экспорт API для отладки (доступно через window)
 */
window.PianoPlayerAPI = {
    version: APP_CONFIG.version,
    getPlayer: () => player,
    getVisualizer: () => visualizer,
    getUIController: () => uiController,
    saveSettings,
    loadSavedSettings,
    showKeyboardShortcuts,
    
    // Debug функции
    debug: {
        getConfig: () => APP_CONFIG,
        getState: () => ({
            isReady: isAppReady,
            isPlaying: player?.isPlaying,
            currentTime: player?.getCurrentTime(),
            duration: player?.getDuration(),
            currentInstrument: player?.currentInstrument,
            volume: player?.volume,
            tempo: player?.tempo
        }),
        toggleDebugMode: () => {
            APP_CONFIG.debugMode = !APP_CONFIG.debugMode;
            console.log('🐛 Debug mode:', APP_CONFIG.debugMode ? 'ON' : 'OFF');
        }
    }
};

/**
 * Информация о приложении в консоли
 */
console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║        🎹 PROFESSIONAL PIANO PLAYER v${APP_CONFIG.version}              ║
║                                                          ║
║  Powered by: Tone.js, Web Audio API, Canvas             ║
║  Author: berlandbors                                    ║
║                                                          ║
║  Возможности:                                           ║
║  ✅ 8 типов пианино/фортепиано                          ║
║  ✅ Высококачественные сэмплы Salamander Grand Piano    ║
║  ✅ FM-синтез для электропиано                          ║
║  ✅ Профессиональные аудио эффекты                      ║
║  ✅ 3 режима визуализации                               ║
║  ✅ Экспорт в JSON/WAV                                  ║
║  ✅ Запись аудио                                        ║
║  ✅ Создание MIDI из JSON                               ║
║  ✅ Горячие клавиши                                     ║
║  ✅ Автосохранение настроек                             ║
║                                                          ║
║  API доступен через: window.PianoPlayerAPI              ║
║  Справка: нажмите F1 или PianoPlayerAPI.showKeyboardShortcuts()  ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`);

console.log('ℹ️  Доступные команды в консоли:');
console.log('   PianoPlayerAPI.debug.getState() - Текущее состояние');
console.log('   PianoPlayerAPI.showKeyboardShortcuts() - Горячие клавиши');
console.log('   PianoPlayerAPI.saveSettings() - Сохранить настройки');
console.log('   PianoPlayerAPI.debug.toggleDebugMode() - Переключить debug режим');