/*
 * A/B(/C) audio comparison player.
 *
 * Each `.player__wrapper` holds two or three versions of the same song (data-audio-a,
 * data-audio-b and the optional data-audio-c). All versions share one playhead: switching
 * tracks keeps the position, so the listener hears the same passage in another version.
 *
 * Based on AB-Audio-Player by Matt Bartley (MIT License, Copyright (c) 2022 Matt Bartley):
 * https://github.com/mattbartley/AB-Audio-Player
 */

document.querySelectorAll('.player__wrapper').forEach(initializePlayer);

function initializePlayer(player) {
  const sounds = ['a', 'b', 'c']
    .map((key) => player.getAttribute(`data-audio-${key}`))
    .map((src) => {
      if (!src) return null;
      const sound = new Audio(src);
      sound.preload = 'auto';
      return sound;
    });
  const [soundA, soundB, soundC] = sounds;
  const allSounds = sounds.filter(Boolean);

  const aButton = player.querySelector('.a__button');
  const bButton = player.querySelector('.b__button');
  const cButton = player.querySelector('.c__button');
  const trackButtons = [aButton, bButton, cButton].filter(Boolean);
  const playButton = player.querySelector('.play__button');
  const stopButton = player.querySelector('.stop__button');
  const progressBar = player.querySelector('.progress');
  const progressFill = player.querySelector('.progress__fill');

  const playIcon = '<i class="fa-solid fa-play"></i>';
  const pauseIcon = '<i class="fa-solid fa-pause"></i>';
  const playButtonPressedClass = 'play__button--pressed';

  // Track A is the selected version until the listener picks another one.
  let currentSound = soundA;

  const updateProgress = () => {
    const ratio = currentSound && currentSound.duration
      ? currentSound.currentTime / currentSound.duration
      : 0;
    progressFill.style.width = `${ratio * 100}%`;
    requestAnimationFrame(updateProgress);
  };

  const showPlaying = (playing) => {
    playButton.innerHTML = playing ? pauseIcon : playIcon;
    playButton.classList.toggle(playButtonPressedClass, playing);
    playButton.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  };

  const playCurrent = () => {
    currentSound.play().catch((error) => console.error('Playback failed:', error));
    showPlaying(true);
    stopButton.disabled = false;
  };

  const pauseAll = () => {
    allSounds.forEach((sound) => sound.pause());
    showPlaying(false);
  };

  const seekAll = (time) => {
    allSounds.forEach((sound) => {
      sound.currentTime = time;
    });
  };

  const stopAll = () => {
    pauseAll();
    seekAll(0);
    stopButton.disabled = true;
  };

  const selectTrack = (sound, button) => {
    // Only the selected version plays, so its position is the shared playhead.
    const position = currentSound ? currentSound.currentTime : 0;
    pauseAll();
    seekAll(position);
    currentSound = sound;
    trackButtons.forEach((trackButton) => {
      trackButton.disabled = trackButton === button;
    });
    playCurrent();
  };

  aButton.addEventListener('click', () => selectTrack(soundA, aButton));
  bButton.addEventListener('click', () => selectTrack(soundB, bButton));
  if (cButton && soundC) {
    cButton.addEventListener('click', () => selectTrack(soundC, cButton));
  }

  playButton.addEventListener('click', () => {
    if (currentSound.paused) {
      playCurrent();
    } else {
      pauseAll();
    }
  });

  stopButton.addEventListener('click', stopAll);

  progressBar.addEventListener('click', (event) => {
    if (!currentSound.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    seekAll(ratio * currentSound.duration);
  });

  // When the selected version reaches its end, the player returns to the stopped state.
  allSounds.forEach((sound) => {
    sound.addEventListener('ended', () => {
      if (sound === currentSound) stopAll();
    });
  });

  trackButtons.forEach((trackButton) => {
    trackButton.disabled = trackButton === aButton;
  });
  playButton.disabled = false;
  stopButton.disabled = true;
  showPlaying(false);
  updateProgress();
}
