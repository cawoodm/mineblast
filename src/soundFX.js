import {soundEffect} from './sound';

export function pewpew() {
  soundEffect({
    frequencyValue: 1046.5,
    attack: 0.01,
    decay: 0.2,
    waveform: 'square', // "sine", "triangle", "square", "sawtooth"
    volumeValue: 0.2,
    pan: -0.8,
    wait: 0,
    pitchBendAmount: 3200,
    reverse: false, // reverse pitch bend
    randomValue: 0, //random pitch range
    dissonance: 215,
    echo: null, // [0.2, 0.2, 2000], //echo: [delay, feedback, filter]
    reverb: undefined, //reverb: [duration, decay, reverse?]
    timeout: 0.3, //Maximum duration of sound, in seconds
  });
}
export function note(f) {
  soundEffect({
    frequencyValue: f,
    attack: 0.01,
    decay: 5,
    waveform: 'sine', // "sine", "triangle", "square", "sawtooth"
    volumeValue: 0.2,
    pan: -0.8,
    wait: 0,
    //pitchBendAmount: 3200,
    //reverse: false, // reverse pitch bend
    //randomValue: 0, //random pitch range
    //dissonance: 215,
    echo: null, // [0.2, 0.2, 2000], //echo: [delay, feedback, filter]
    reverb: undefined, //reverb: [duration, decay, reverse?]
    timeout: 5, //Maximum duration of sound, in seconds
  });
}
