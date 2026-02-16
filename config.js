// ===== КОНФИГУРАЦИЯ ВСЕХ 128 ИНСТРУМЕНТОВ GENERAL MIDI =====
const INSTRUMENT_MAP = {
    // === PIANO (0-7) ===
    'acoustic-grand-piano': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sine' }, envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 } } 
    },
    'bright-acoustic-piano': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'triangle' }, envelope: { attack: 0.002, decay: 0.1, sustain: 0.2, release: 0.8 } } 
    },
    'electric-grand-piano': { 
        synth: 'FMSynth', 
        options: { harmonicity: 2, modulationIndex: 10, envelope: { attack: 0.01, decay: 0.5, sustain: 0.1, release: 0.5 } } 
    },
    'honky-tonk-piano': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'square' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.6 } } 
    },
    'electric-piano-1': { 
        synth: 'FMSynth', 
        options: { harmonicity: 3, modulationIndex: 8, envelope: { attack: 0.005, decay: 0.3, sustain: 0.2, release: 0.7 } } 
    },
    'electric-piano-2': { 
        synth: 'FMSynth', 
        options: { harmonicity: 2.5, modulationIndex: 12, envelope: { attack: 0.01, decay: 0.4, sustain: 0.15, release: 0.6 } } 
    },
    'harpsichord': { 
        synth: 'PluckSynth', 
        options: { attackNoise: 0.5, dampening: 3000, resonance: 0.9 } 
    },
    'clavinet': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'square' }, envelope: { attack: 0.001, decay: 0.1, sustain: 0.1, release: 0.2 } } 
    },

    // === CHROMATIC PERCUSSION (8-15) ===
    'celesta': { 
        synth: 'FMSynth', 
        options: { harmonicity: 8, modulationIndex: 2, envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.3 } } 
    },
    'glockenspiel': { 
        synth: 'FMSynth', 
        options: { harmonicity: 4, modulationIndex: 3, envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.5 } } 
    },
    'music-box': { 
        synth: 'FMSynth', 
        options: { harmonicity: 5, modulationIndex: 2, envelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 0.8 } } 
    },
    'vibraphone': { 
        synth: 'FMSynth', 
        options: { harmonicity: 3.5, modulationIndex: 4, envelope: { attack: 0.01, decay: 1, sustain: 0.2, release: 2 } } 
    },
    'marimba': { 
        synth: 'FMSynth', 
        options: { harmonicity: 2, modulationIndex: 2, envelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 0.8 } } 
    },
    'xylophone': { 
        synth: 'FMSynth', 
        options: { harmonicity: 6, modulationIndex: 1.5, envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.3 } } 
    },
    'tubular-bells': { 
        synth: 'FMSynth', 
        options: { harmonicity: 1.5, modulationIndex: 10, envelope: { attack: 0.01, decay: 2, sustain: 0.1, release: 3 } } 
    },
    'dulcimer': { 
        synth: 'PluckSynth', 
        options: { attackNoise: 1, dampening: 2000, resonance: 0.8 } 
    },

    // === ORGAN (16-23) ===
    'drawbar-organ': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sine4' }, envelope: { attack: 0.01, decay: 0, sustain: 1, release: 0.1 } } 
    },
    'percussive-organ': { 
        synth: 'FMSynth', 
        options: { harmonicity: 3, modulationIndex: 5, envelope: { attack: 0.001, decay: 0.2, sustain: 0.5, release: 0.2 } } 
    },
    'rock-organ': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'square4' }, envelope: { attack: 0.001, decay: 0, sustain: 1, release: 0.05 } } 
    },
    'church-organ': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sine8' }, envelope: { attack: 0.1, decay: 0, sustain: 1, release: 0.3 } } 
    },
    'reed-organ': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'triangle' }, envelope: { attack: 0.05, decay: 0.1, sustain: 0.8, release: 0.5 } } 
    },
    'accordion': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'square' }, envelope: { attack: 0.02, decay: 0.1, sustain: 0.9, release: 0.3 } } 
    },
    'harmonica': { 
        synth: 'AMSynth', 
        options: { harmonicity: 3, envelope: { attack: 0.01, decay: 0.2, sustain: 0.7, release: 0.4 } } 
    },
    'tango-accordion': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'square' }, envelope: { attack: 0.03, decay: 0.1, sustain: 0.85, release: 0.4 } } 
    },

    // === GUITAR (24-31) ===
    'nylon-string-guitar': { 
        synth: 'PluckSynth', 
        options: { attackNoise: 1, dampening: 4000, resonance: 0.7 } 
    },
    'steel-string-guitar': { 
        synth: 'PluckSynth', 
        options: { attackNoise: 1.5, dampening: 3500, resonance: 0.8 } 
    },
    'jazz-guitar': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'triangle' }, envelope: { attack: 0.005, decay: 0.3, sustain: 0.4, release: 0.8 } } 
    },
    'clean-guitar': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.005, decay: 0.2, sustain: 0.3, release: 1 } } 
    },
    'muted-guitar': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'triangle' }, envelope: { attack: 0.001, decay: 0.1, sustain: 0.2, release: 0.3 } } 
    },
    'overdriven-guitar': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.002, decay: 0.15, sustain: 0.4, release: 0.7 } } 
    },
    'distortion-guitar': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.001, decay: 0.1, sustain: 0.5, release: 0.8 } } 
    },
    'guitar-harmonics': { 
        synth: 'FMSynth', 
        options: { harmonicity: 2, modulationIndex: 3, envelope: { attack: 0.001, decay: 0.5, sustain: 0.1, release: 1 } } 
    },

    // === BASS (32-39) ===
    'acoustic-bass': { 
        synth: 'MonoSynth', 
        options: { oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.8 } } 
    },
    'fingered-bass': { 
        synth: 'MonoSynth', 
        options: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 1 } } 
    },
    'picked-bass': { 
        synth: 'PluckSynth', 
        options: { attackNoise: 0.8, dampening: 2000, resonance: 0.6 } 
    },
    'fretless-bass': { 
        synth: 'MonoSynth', 
        options: { oscillator: { type: 'sine' }, envelope: { attack: 0.02, decay: 0.3, sustain: 0.5, release: 0.9 } } 
    },
    'slap-bass-1': { 
        synth: 'PluckSynth', 
        options: { attackNoise: 2, dampening: 1500, resonance: 0.9 } 
    },
    'slap-bass-2': { 
        synth: 'PluckSynth', 
        options: { attackNoise: 2.5, dampening: 1200, resonance: 0.95 } 
    },
    'synth-bass-1': { 
        synth: 'MonoSynth', 
        options: { oscillator: { type: 'square' }, envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.8 } } 
    },
    'synth-bass-2': { 
        synth: 'MonoSynth', 
        options: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.005, decay: 0.2, sustain: 0, release: 0.7 } } 
    },

    // === STRINGS (40-47) ===
    'violin': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.5 } } 
    },
    'viola': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.12, decay: 0.25, sustain: 0.75, release: 0.6 } } 
    },
    'cello': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.15, decay: 0.3, sustain: 0.7, release: 0.7 } } 
    },
    'contrabass': { 
        synth: 'MonoSynth', 
        options: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.2, decay: 0.4, sustain: 0.6, release: 0.9 } } 
    },
    'tremolo-strings': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.1, decay: 0.2, sustain: 0.85, release: 0.5 } } 
    },
    'pizzicato-strings': { 
        synth: 'PluckSynth', 
        options: { attackNoise: 2, dampening: 3000, resonance: 0.9 } 
    },
    'orchestral-harp': { 
        synth: 'PluckSynth', 
        options: { attackNoise: 0.5, dampening: 5000, resonance: 0.8 } 
    },
    'timpani': { 
        synth: 'MembraneSynth', 
        options: { pitchDecay: 0.1, octaves: 4, envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.5 } } 
    },

    // === ENSEMBLE (48-55) ===
    'string-ensemble-1': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.2, decay: 0.3, sustain: 0.9, release: 1 } } 
    },
    'string-ensemble-2': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.25, decay: 0.3, sustain: 0.85, release: 1.2 } } 
    },
    'synth-strings-1': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.3, decay: 0.2, sustain: 0.9, release: 1.5 } } 
    },
    'synth-strings-2': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'square' }, envelope: { attack: 0.35, decay: 0.2, sustain: 0.85, release: 1.7 } } 
    },
    'choir-aahs': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sine' }, envelope: { attack: 0.3, decay: 0.3, sustain: 0.9, release: 2 } } 
    },
    'voice-oohs': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sine' }, envelope: { attack: 0.25, decay: 0.3, sustain: 0.85, release: 1.8 } } 
    },
    'synth-choir': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sine' }, envelope: { attack: 0.4, decay: 0.2, sustain: 0.9, release: 2.5 } } 
    },
    'orchestra-hit': { 
        synth: 'NoiseSynth', 
        options: { noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.3 } } 
    },

    // === BRASS (56-63) ===
    'trumpet': { 
        synth: 'FMSynth', 
        options: { harmonicity: 1, modulationIndex: 12, envelope: { attack: 0.05, decay: 0.1, sustain: 0.8, release: 0.3 } } 
    },
    'trombone': { 
        synth: 'FMSynth', 
        options: { harmonicity: 1.2, modulationIndex: 10, envelope: { attack: 0.08, decay: 0.15, sustain: 0.75, release: 0.4 } } 
    },
    'tuba': { 
        synth: 'FMSynth', 
        options: { harmonicity: 1.5, modulationIndex: 8, envelope: { attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.5 } } 
    },
    'muted-trumpet': { 
        synth: 'FMSynth', 
        options: { harmonicity: 1, modulationIndex: 8, envelope: { attack: 0.03, decay: 0.1, sustain: 0.6, release: 0.2 } } 
    },
    'french-horn': { 
        synth: 'AMSynth', 
        options: { harmonicity: 2, envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.5 } } 
    },
    'brass-section': { 
        synth: 'AMSynth', 
        options: { harmonicity: 1.5, envelope: { attack: 0.1, decay: 0.2, sustain: 0.85, release: 0.6 } } 
    },
    'synth-brass-1': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'square' }, envelope: { attack: 0.05, decay: 0.2, sustain: 0.8, release: 0.5 } } 
    },
    'synth-brass-2': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.08, decay: 0.2, sustain: 0.75, release: 0.6 } } 
    },

    // === REED (64-71) ===
    'soprano-sax': { 
        synth: 'AMSynth', 
        options: { harmonicity: 3, envelope: { attack: 0.02, decay: 0.1, sustain: 0.7, release: 0.4 } } 
    },
    'alto-sax': { 
        synth: 'AMSynth', 
        options: { harmonicity: 2.5, envelope: { attack: 0.02, decay: 0.1, sustain: 0.7, release: 0.5 } } 
    },
    'tenor-sax': { 
        synth: 'AMSynth', 
        options: { harmonicity: 2, envelope: { attack: 0.03, decay: 0.1, sustain: 0.7, release: 0.5 } } 
    },
    'baritone-sax': { 
        synth: 'AMSynth', 
        options: { harmonicity: 1.5, envelope: { attack: 0.04, decay: 0.15, sustain: 0.7, release: 0.6 } } 
    },
    'oboe': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'square' }, envelope: { attack: 0.05, decay: 0.1, sustain: 0.75, release: 0.4 } } 
    },
    'english-horn': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'square' }, envelope: { attack: 0.06, decay: 0.15, sustain: 0.7, release: 0.5 } } 
    },
    'bassoon': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'square' }, envelope: { attack: 0.08, decay: 0.2, sustain: 0.7, release: 0.6 } } 
    },
    'clarinet': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'square' }, envelope: { attack: 0.04, decay: 0.1, sustain: 0.7, release: 0.4 } } 
    },

    // === PIPE (72-79) ===
    'piccolo': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sine' }, envelope: { attack: 0.02, decay: 0.1, sustain: 0.6, release: 0.3 } } 
    },
    'flute': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sine' }, envelope: { attack: 0.05, decay: 0.1, sustain: 0.6, release: 0.4 } } 
    },
    'recorder': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sine' }, envelope: { attack: 0.03, decay: 0.1, sustain: 0.65, release: 0.35 } } 
    },
    'pan-flute': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sine' }, envelope: { attack: 0.08, decay: 0.15, sustain: 0.7, release: 0.5 } } 
    },
    'blown-bottle': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sine' }, envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.8 } } 
    },
    'shakuhachi': { 
        synth: 'AMSynth', 
        options: { harmonicity: 2, envelope: { attack: 0.1, decay: 0.2, sustain: 0.6, release: 0.5 } } 
    },
    'whistle': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.05, sustain: 0.8, release: 0.2 } } 
    },
    'ocarina': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sine' }, envelope: { attack: 0.03, decay: 0.1, sustain: 0.7, release: 0.4 } } 
    },

    // === SYNTH LEAD (80-87) ===
    'lead-square': { 
        synth: 'MonoSynth', 
        options: { oscillator: { type: 'square' }, envelope: { attack: 0.005, decay: 0.2, sustain: 0.5, release: 0.5 } } 
    },
    'lead-sawtooth': { 
        synth: 'MonoSynth', 
        options: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.5 } } 
    },
    'lead-calliope': { 
        synth: 'FMSynth', 
        options: { harmonicity: 4, modulationIndex: 5, envelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.5 } } 
    },
    'lead-chiff': { 
        synth: 'FMSynth', 
        options: { harmonicity: 2, modulationIndex: 8, envelope: { attack: 0.001, decay: 0.1, sustain: 0.3, release: 0.3 } } 
    },
    'lead-charang': { 
        synth: 'MonoSynth', 
        options: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.005, decay: 0.15, sustain: 0.6, release: 0.4 } } 
    },
    'lead-voice': { 
        synth: 'AMSynth', 
        options: { harmonicity: 3, envelope: { attack: 0.02, decay: 0.2, sustain: 0.5, release: 0.5 } } 
    },
    'lead-fifths': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.6, release: 0.5 } } 
    },
    'lead-bass': { 
        synth: 'MonoSynth', 
        options: { oscillator: { type: 'square' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.6 } } 
    },

    // === SYNTH PAD (88-95) ===
    'pad-new-age': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sine' }, envelope: { attack: 0.5, decay: 0.3, sustain: 0.8, release: 2 } } 
    },
    'pad-warm': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.6, decay: 0.3, sustain: 0.85, release: 2.5 } } 
    },
    'pad-polysynth': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'square' }, envelope: { attack: 0.5, decay: 0.2, sustain: 0.9, release: 2 } } 
    },
    'pad-choir': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sine' }, envelope: { attack: 0.7, decay: 0.3, sustain: 0.9, release: 3 } } 
    },
    'pad-bowed': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.8, decay: 0.3, sustain: 0.85, release: 2.5 } } 
    },
    'pad-metallic': { 
        synth: 'FMSynth', 
        options: { harmonicity: 6, modulationIndex: 3, envelope: { attack: 0.5, decay: 0.3, sustain: 0.8, release: 2 } } 
    },
    'pad-halo': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sine' }, envelope: { attack: 1, decay: 0.5, sustain: 0.9, release: 3 } } 
    },
    'pad-sweep': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'triangle' }, envelope: { attack: 0.8, decay: 0.4, sustain: 0.85, release: 2.5 } } 
    },

    // === SYNTH EFFECTS (96-103) ===
    'fx-rain': { 
        synth: 'NoiseSynth', 
        options: { noise: { type: 'white' }, envelope: { attack: 0.5, decay: 1, sustain: 0.5, release: 2 } } 
    },
    'fx-soundtrack': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'triangle' }, envelope: { attack: 0.5, decay: 0.5, sustain: 0.7, release: 2 } } 
    },
    'fx-crystal': { 
        synth: 'FMSynth', 
        options: { harmonicity: 8, modulationIndex: 2, envelope: { attack: 0.01, decay: 0.5, sustain: 0.3, release: 1.5 } } 
    },
    'fx-atmosphere': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sine' }, envelope: { attack: 1, decay: 0.5, sustain: 0.8, release: 3 } } 
    },
    'fx-brightness': { 
        synth: 'FMSynth', 
        options: { harmonicity: 4, modulationIndex: 4, envelope: { attack: 0.1, decay: 0.3, sustain: 0.6, release: 1 } } 
    },
    'fx-goblins': { 
        synth: 'AMSynth', 
        options: { harmonicity: 1.5, envelope: { attack: 0.2, decay: 0.3, sustain: 0.5, release: 1 } } 
    },
    'fx-echoes': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'triangle' }, envelope: { attack: 0.3, decay: 0.5, sustain: 0.4, release: 2 } } 
    },
    'fx-sci-fi': { 
        synth: 'FMSynth', 
        options: { harmonicity: 10, modulationIndex: 10, envelope: { attack: 0.1, decay: 0.3, sustain: 0.5, release: 1 } } 
    },

    // === ETHNIC (104-111) ===
    'sitar': { 
        synth: 'PluckSynth', 
        options: { attackNoise: 1.5, dampening: 3000, resonance: 0.95 } 
    },
    'banjo': { 
        synth: 'PluckSynth', 
        options: { attackNoise: 1.2, dampening: 2500, resonance: 0.9 } 
    },
    'shamisen': { 
        synth: 'PluckSynth', 
        options: { attackNoise: 1, dampening: 2000, resonance: 0.85 } 
    },
    'koto': { 
        synth: 'PluckSynth', 
        options: { attackNoise: 0.8, dampening: 4000, resonance: 0.8 } 
    },
    'kalimba': { 
        synth: 'FMSynth', 
        options: { harmonicity: 3, modulationIndex: 2, envelope: { attack: 0.001, decay: 0.5, sustain: 0.1, release: 1 } } 
    },
    'bagpipe': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'square' }, envelope: { attack: 0.1, decay: 0, sustain: 1, release: 0.3 } } 
    },
    'fiddle': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.08, decay: 0.2, sustain: 0.8, release: 0.4 } } 
    },
    'shanai': { 
        synth: 'PolySynth', 
        options: { oscillator: { type: 'square' }, envelope: { attack: 0.05, decay: 0.1, sustain: 0.75, release: 0.5 } } 
    },

    // === PERCUSSIVE (112-119) ===
    'tinkle-bell': { 
        synth: 'MetalSynth', 
        options: { frequency: 800, envelope: { attack: 0.001, decay: 0.2, release: 0.5 }, harmonicity: 8, modulationIndex: 20, resonance: 5000, octaves: 1 } 
    },
    'agogo': { 
        synth: 'MetalSynth', 
        options: { frequency: 400, envelope: { attack: 0.001, decay: 0.15, release: 0.3 }, harmonicity: 6, modulationIndex: 25, resonance: 4000, octaves: 1.5 } 
    },
    'steel-drums': { 
        synth: 'FMSynth', 
        options: { harmonicity: 5, modulationIndex: 8, envelope: { attack: 0.001, decay: 0.5, sustain: 0.1, release: 1 } } 
    },
    'woodblock': { 
        synth: 'MembraneSynth', 
        options: { pitchDecay: 0.01, octaves: 3, envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 } } 
    },
    'taiko-drum': { 
        synth: 'MembraneSynth', 
        options: { pitchDecay: 0.1, octaves: 6, envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.5 } } 
    },
    'melodic-tom': { 
        synth: 'MembraneSynth', 
        options: { pitchDecay: 0.05, octaves: 4, envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.3 } } 
    },
    'synth-drum': { 
        synth: 'MembraneSynth', 
        options: { pitchDecay: 0.08, octaves: 5, envelope: { attack: 0.001, decay: 0.25, sustain: 0, release: 0.4 } } 
    },
    'reverse-cymbal': { 
        synth: 'MetalSynth', 
        options: { frequency: 300, envelope: { attack: 0.5, decay: 0.5, release: 1 }, harmonicity: 4, modulationIndex: 30, resonance: 6000, octaves: 2 } 
    },

    // === SOUND EFFECTS (120-127) ===
    'guitar-fret-noise': { 
        synth: 'NoiseSynth', 
        options: { noise: { type: 'brown' }, envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 } } 
    },
    'breath-noise': { 
        synth: 'NoiseSynth', 
        options: { noise: { type: 'pink' }, envelope: { attack: 0.05, decay: 0.2, sustain: 0.3, release: 0.5 } } 
    },
    'seashore': { 
        synth: 'NoiseSynth', 
        options: { noise: { type: 'white' }, envelope: { attack: 1, decay: 1, sustain: 0.8, release: 2 } } 
    },
    'bird-tweet': { 
        synth: 'FMSynth', 
        options: { harmonicity: 8, modulationIndex: 15, envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.2 } } 
    },
    'telephone-ring': { 
        synth: 'AMSynth', 
        options: { harmonicity: 5, envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 } } 
    },
    'helicopter': { 
        synth: 'NoiseSynth', 
        options: { noise: { type: 'brown' }, envelope: { attack: 0.5, decay: 1, sustain: 0.7, release: 1.5 } } 
    },
    'applause': { 
        synth: 'NoiseSynth', 
        options: { noise: { type: 'white' }, envelope: { attack: 0.2, decay: 0.5, sustain: 0.6, release: 1 } } 
    },
    'gunshot': { 
        synth: 'NoiseSynth', 
        options: { noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.2 } } 
    }
};