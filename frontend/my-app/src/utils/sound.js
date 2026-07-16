const SOUND_PREF_KEY = 'book-sound-enabled';

let soundEnabled = false;
try {
  soundEnabled = localStorage.getItem(SOUND_PREF_KEY) === 'true';
} catch {
  soundEnabled = false;
}

const cache = {};

function getAudio(src) {
  if (!cache[src]) {
    cache[src] = new Audio(src);
  }
  return cache[src];
}

export function isSoundEnabled() {
  return soundEnabled;
}

export function setSoundEnabled(value) {
  soundEnabled = value;
  try {
    localStorage.setItem(SOUND_PREF_KEY, String(value));
  } catch {
    // ignore storage errors (private browsing etc.)
  }
}

export function playSound(src, volume = 0.5, startOffset = 0) {
  if (!soundEnabled) return;
  try {
    const audio = getAudio(src);
    audio.currentTime = startOffset;
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch {
    // ignore playback errors
  }
}

export const SOUNDS = {
  pageFlip: '/assets/sounds/page-flip.mp3',
  coverOpen: '/assets/sounds/cover-open.mp3',
};

export function preloadSounds() {
  Object.values(SOUNDS).forEach((src) => {
    const audio = getAudio(src);
    audio.preload = 'auto';
    audio.load();
  });
}