const SOUND_PREF_KEY = 'portfolio-sound-enabled';

let soundEnabled = false;
try {
  soundEnabled = localStorage.getItem(SOUND_PREF_KEY) === 'true';
} catch {
  soundEnabled = false;
}

const cache = {};
const lastPlayed = {};
let audioUnlocked = false;

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

  const now = performance.now();

  if (lastPlayed[src] && now - lastPlayed[src] < 80) {
    return;
  }

  lastPlayed[src] = now;

  try {
    const audio = getAudio(src).cloneNode();

    audio.currentTime = startOffset;
    audio.volume = volume;

    audio.play().catch(() => {});
  } catch {}
}

export const SOUNDS = {
  pageFlip: '/assets/sounds/page-flip.mp3',
  coverOpen: '/assets/sounds/cover-open.mp3',
  hubTransition: '/assets/sounds/hub-transition.mp3',
  unlock: '/assets/sounds/unlock.mp3',
};

export function preloadSounds() {
  Object.values(SOUNDS).forEach((src) => {
    const audio = getAudio(src);
    audio.preload = 'auto';
    audio.load();
  });
}

export function unlockAudio() {
  if (audioUnlocked) return;

  audioUnlocked = true;

  Object.values(SOUNDS).forEach((src) => {
    const audio = getAudio(src);

    audio.volume = 0;

    audio.play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 1;
      })
      .catch(() => {});
  });
}

