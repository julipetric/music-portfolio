let players = document.querySelectorAll('.player__wrapper');

initializePlayers(players);

function initializePlayers(players) {
  players.forEach((player) => {
    const audioA = player.getAttribute('data-audio-a');
    const audioB = player.getAttribute('data-audio-b');
    const audioC = player.getAttribute('data-audio-c');

    //Set up audio elements
    const soundA = new Audio(audioA);
    const soundB = new Audio(audioB);
    let soundC = null;
    if (audioC) {
      soundC = new Audio(audioC);
    }

    soundA.preload = 'auto';
    soundB.preload = 'auto';
    if (soundC) {
      soundC.preload = 'auto';
    }

    //Get button elements
    const aButton = player.querySelector('.a__button');
    const bButton = player.querySelector('.b__button');
    const cButton = player.querySelector('.c__button');
    const playButton = player.querySelector('.play__button');
    const stopButton = player.querySelector('.stop__button');
    const progressBar = player.querySelector('.progress__bar');
    const progressFill = player.querySelector('.progress__fill');

    const playIcon = '<i class="fa-solid fa-play"></i>';
    const pauseIcon = '<i class="fa-solid fa-pause"></i>';

    const getMaxTime = () => {
      let maxTime = 0;
      if (soundA.currentTime > maxTime) maxTime = soundA.currentTime;
      if (soundB.currentTime > maxTime) maxTime = soundB.currentTime;
      if (soundC && soundC.currentTime > maxTime) maxTime = soundC.currentTime;
      return maxTime;
    };

    const syncAllTimes = () => {
      const maxTime = getMaxTime();
      soundA.currentTime = maxTime;
      soundB.currentTime = maxTime;
      if (soundC) soundC.currentTime = maxTime;
    };

    const updateProgress = () => {
      if (soundA.duration) { // Use soundA as a reference - assumes all durations are the same
        progressFill.style.width = `${(soundA.currentTime / soundA.duration) * 100}%`;
      } else {
        progressFill.style.width = '0%';
      }
      requestAnimationFrame(updateProgress);
    };
    requestAnimationFrame(updateProgress);

    const playActiveSound = (sound) => {
      sound.play().catch(error => console.error("Playback failed:", error));
      playButton.innerHTML = pauseIcon;
    };

    const pauseAllSounds = () => {
      soundA.pause();
      soundB.pause();
      if (soundC) soundC.pause();
      playButton.innerHTML = playIcon;
    };

    const stopAllSounds = () => {
      pauseAllSounds();
      soundA.currentTime = 0;
      soundB.currentTime = 0;
      if (soundC) soundC.currentTime = 0;
      stopButton.disabled = true;
    };

    const selectAndPlaySound = (selectedSound, buttonToDisable) => {
      pauseAllSounds();
      syncAllTimes();
      playActiveSound(selectedSound);
      aButton.disabled = false;
      bButton.disabled = false;
      if (cButton) cButton.disabled = false;
      buttonToDisable.disabled = true;
      stopButton.disabled = false;
    };

    aButton.addEventListener('click', () => {
      selectAndPlaySound(soundA, aButton);
    });

    bButton.addEventListener('click', () => {
      selectAndPlaySound(soundB, bButton);
    });

    if (cButton) {
      cButton.addEventListener('click', () => {
        selectAndPlaySound(soundC, cButton);
      });
    }

    playButton.addEventListener('click', () => {
      if (soundA.paused || soundB.paused || (soundC && soundC.paused)) {
        syncAllTimes();
        if (!soundA.paused) playActiveSound(soundA);
        else if (!soundB.paused) playActiveSound(soundB);
        else if (soundC && !soundC.paused) playActiveSound(soundC);
        else if (soundA) playActiveSound(soundA); // Default to A if nothing playing
      } else {
        pauseAllSounds();
      }
    });

    stopButton.addEventListener('click', () => {
      stopAllSounds();
    });

    progressBar.addEventListener('click', (event) => {
      if (soundA.duration) { // Use soundA as reference
        const rect = progressBar.getBoundingClientRect();
        const percentage = (event.clientX - rect.left) / progressBar.offsetWidth;
        syncAllTimes();
        soundA.currentTime = percentage * soundA.duration;
        soundB.currentTime = percentage * soundA.duration;
        if (soundC) soundC.currentTime = percentage * soundA.duration;
      }
    });

    // Initial state setup
    aButton.disabled = false; // Start with A enabled
    bButton.disabled = false;
    if (cButton) cButton.disabled = false;
    stopButton.disabled = true;
    if (!soundA.src || !soundB.src || (soundC && !soundC.src)) {
      playButton.disabled = true;
    } else {
      playButton.disabled = false;
      aButton.disabled = true; // Start with A selected
      playActiveSound(soundA);
    }
  });
}