// ===== MAIN - Инициализация приложения =====

let player;
let visualizer;
let uiController;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎹 MIDI Player Pro - Enhanced Edition');
    console.log('Powered by Tone.js');
    
    try {
        // Инициализация визуализатора
        const canvas = document.getElementById('canvas');
        const vizDebug = document.getElementById('vizDebug');
        visualizer = new Visualizer(canvas, vizDebug);
        console.log('✅ Визуализатор инициализирован');

        // Инициализация плеера
        player = new MIDIPlayer(visualizer);
        console.log('✅ MIDI плеер инициализирован');

        // Инициализация UI контроллера
        uiController = new UIController(player, visualizer);
        console.log('✅ UI контроллер инициализирован');

        console.log('🎉 Приложение готово к работе!');
        console.log('📝 Загрузите MIDI файл для начала');

    } catch (error) {
        console.error('❌ Ошибка инициализации:', error);
        alert('Произошла ошибка при запуске приложения. Проверьте консоль для деталей.');
    }
});

// Обработка ошибок
window.addEventListener('error', (event) => {
    console.error('❌ Глобальная ошибка:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Необработанный промис:', event.reason);
});

// Информация о приложении
console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║           🎹 MIDI PLAYER PRO - ENHANCED EDITION         ║
║                                                          ║
║  Версия: 2.0.0                                          ║
║  Автор: berlandbors                                     ║
║  Технологии: Tone.js, Web Audio API, Canvas            ║
║                                                          ║
║  Возможности:                                           ║
║  ✅ 128 инструментов General MIDI                       ║
║  ✅ Профессиональные аудио эффекты                      ║
║  ✅ 3 режима визуализации                               ║
║  ✅ Экспорт в JSON/WAV                                  ║
║  ✅ Запись аудио                                        ║
║  ✅ Создание MIDI из JSON                               ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`);