// ===== БИБЛИОТЕКА СЭМПЛОВ ДЛЯ ПИАНИНО =====

const SAMPLER_INSTRUMENTS = {
    // ==================== PIANO (0-7) ====================
    'acoustic-grand-piano': {
        type: 'sampler',
        baseUrl: 'https://tonejs.github.io/audio/salamander/',
        samples: {
            'A0': 'A0.mp3', 'C1': 'C1.mp3', 'D#1': 'Ds1.mp3', 'F#1': 'Fs1.mp3',
            'A1': 'A1.mp3', 'C2': 'C2.mp3', 'D#2': 'Ds2.mp3', 'F#2': 'Fs2.mp3',
            'A2': 'A2.mp3', 'C3': 'C3.mp3', 'D#3': 'Ds3.mp3', 'F#3': 'Fs3.mp3',
            'A3': 'A3.mp3', 'C4': 'C4.mp3', 'D#4': 'Ds4.mp3', 'F#4': 'Fs4.mp3',
            'A4': 'A4.mp3', 'C5': 'C5.mp3', 'D#5': 'Ds5.mp3', 'F#5': 'Fs5.mp3',
            'A5': 'A5.mp3', 'C6': 'C6.mp3', 'D#6': 'Ds6.mp3', 'F#6': 'Fs6.mp3',
            'A6': 'A6.mp3', 'C7': 'C7.mp3', 'D#7': 'Ds7.mp3', 'F#7': 'Fs7.mp3',
            'A7': 'A7.mp3', 'C8': 'C8.mp3'
        }
    }
};

// ==================== МАППИНГ GM PROGRAM NUMBER -> INSTRUMENT NAME ====================
const GM_PROGRAM_NAMES = [
    // PIANO (0-7)
    'acoustic-grand-piano', 'bright-acoustic-piano', 'electric-grand-piano', 'honky-tonk-piano',
    'electric-piano-1', 'electric-piano-2', 'harpsichord', 'clavinet',
    // CHROMATIC PERCUSSION (8-15)
    'celesta', 'glockenspiel', 'music-box', 'vibraphone',
    'marimba', 'xylophone', 'tubular-bells', 'dulcimer',
    // ORGAN (16-23)
    'drawbar-organ', 'percussive-organ', 'rock-organ', 'church-organ',
    'reed-organ', 'accordion', 'harmonica', 'tango-accordion',
    // GUITAR (24-31)
    'nylon-string-guitar', 'steel-string-guitar', 'jazz-guitar', 'clean-guitar',
    'muted-guitar', 'overdriven-guitar', 'distortion-guitar', 'guitar-harmonics',
    // BASS (32-39)
    'acoustic-bass', 'fingered-bass', 'picked-bass', 'fretless-bass',
    'slap-bass-1', 'slap-bass-2', 'synth-bass-1', 'synth-bass-2',
    // STRINGS (40-47)
    'violin', 'viola', 'cello', 'contrabass',
    'tremolo-strings', 'pizzicato-strings', 'orchestral-harp', 'timpani',
    // ENSEMBLE (48-55)
    'string-ensemble-1', 'string-ensemble-2', 'synth-strings-1', 'synth-strings-2',
    'choir-aahs', 'voice-oohs', 'synth-choir', 'orchestra-hit',
    // BRASS (56-63)
    'trumpet', 'trombone', 'tuba', 'muted-trumpet',
    'french-horn', 'brass-section', 'synth-brass-1', 'synth-brass-2',
    // REED (64-71)
    'soprano-sax', 'alto-sax', 'tenor-sax', 'baritone-sax',
    'oboe', 'english-horn', 'bassoon', 'clarinet',
    // PIPE (72-79)
    'piccolo', 'flute', 'recorder', 'pan-flute',
    'blown-bottle', 'shakuhachi', 'whistle', 'ocarina',
    // SYNTH LEAD (80-87)
    'lead-square', 'lead-sawtooth', 'lead-calliope', 'lead-chiff',
    'lead-charang', 'lead-voice', 'lead-fifths', 'lead-bass',
    // SYNTH PAD (88-95)
    'pad-new-age', 'pad-warm', 'pad-polysynth', 'pad-choir',
    'pad-bowed', 'pad-metallic', 'pad-halo', 'pad-sweep',
    // SYNTH EFFECTS (96-103)
    'fx-rain', 'fx-soundtrack', 'fx-crystal', 'fx-atmosphere',
    'fx-brightness', 'fx-goblins', 'fx-echoes', 'fx-sci-fi',
    // ETHNIC (104-111)
    'sitar', 'banjo', 'shamisen', 'koto',
    'kalimba', 'bagpipe', 'fiddle', 'shanai',
    // PERCUSSIVE (112-119)
    'tinkle-bell', 'agogo', 'steel-drums', 'woodblock',
    'taiko-drum', 'melodic-tom', 'synth-drum', 'reverse-cymbal',
    // SOUND EFFECTS (120-127)
    'guitar-fret-noise', 'breath-noise', 'seashore', 'bird-tweet',
    'telephone-ring', 'helicopter', 'applause', 'gunshot'
];

// Получить конфигурацию инструмента по MIDI Program Number
function getInstrumentByProgram(programNumber) {
    const name = GM_PROGRAM_NAMES[programNumber] || 'acoustic-grand-piano';
    if (SAMPLER_INSTRUMENTS[name]) {
        return SAMPLER_INSTRUMENTS[name];
    }
    // INSTRUMENT_MAP is defined in config.js (loaded after this file)
    if (typeof INSTRUMENT_MAP !== 'undefined' && INSTRUMENT_MAP[name]) {
        return { type: 'synth', ...INSTRUMENT_MAP[name] };
    }
    return SAMPLER_INSTRUMENTS['acoustic-grand-piano'];
}