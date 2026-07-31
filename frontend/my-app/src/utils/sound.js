let soundEnabled = true;

const cache = {};
const lastPlayed = {};
let audioUnlocked = false;
let soundsPreloaded = false; // Synchronous lock for idempotency

function getAudio(src) {
  if (!cache[src]) {
    cache[src] = new Audio(src);
  }
  return cache[src];
}

export function playSound(src, volume = 0.5, startOffset = 0) {
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
  if (soundsPreloaded) return;
  soundsPreloaded = true;

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