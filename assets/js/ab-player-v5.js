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
    const progressBar = player.querySelector('.progress'); // Corrected selector
    const progressFill = player.querySelector('.progress__fill');

    const playIcon = '<i class="fa-solid fa-play"></i>';
    const pauseIcon = '<i class="fa-solid fa-pause"></i>';
    const playButtonPressedClass = 'play__button--pressed';

    let currentSound = null;

    const updateProgress = () => {
      if (currentSound && currentSound.duration) {
        progressFill.style.width = `${(currentSound.currentTime / currentSound.duration) * 100}%`;
      } else {
        progressFill.style.width = '0%';
      }
      requestAnimationFrame(updateProgress);
    };

    const playSound = (sound) => {
      sound.play().catch(error => console.error("Playback failed:", error));
      playButton.innerHTML = pauseIcon;
      playButton.classList.add(playButtonPressedClass);
      playButton.disabled = true;
      stopButton.disabled = false;
    };

    const pauseAll = () => {
      soundA.pause();
      soundB.pause();
      if (soundC) soundC.pause();
      playButton.innerHTML = playIcon;
      playButton.classList.remove(playButtonPressedClass);
    };

    const stopAll = () => {
      pauseAll();
      soundA.currentTime = 0;
      soundB.currentTime = 0;
      if (soundC) soundC.currentTime = 0;
      stopButton.disabled = true;
      playButton.disabled = false;
      playButton.innerHTML = playIcon;
      playButton.classList.remove(playButtonPressedClass);
      currentSound = null; // Reset currentSound on stop
    };

    const getMaxTime = () => {
      let maxTime = 0;
      if (soundA.currentTime > maxTime) maxTime = soundA.currentTime;
      if (soundB.currentTime > maxTime) maxTime = soundB.currentTime;
      if (soundC && soundC.currentTime > maxTime) maxTime = soundC.currentTime;
      return maxTime;
    };

    const selectTrack = (selectedSound, buttonToDisable) => {
      pauseAll();
      const maxTime = getMaxTime();
      soundA.currentTime = maxTime;
      soundB.currentTime = maxTime;
      if (soundC) soundC.currentTime = maxTime;
      currentSound = selectedSound;
      playSound(currentSound);
      aButton.disabled = false;
      bButton.disabled = false;
      if (cButton) cButton.disabled = false;
      buttonToDisable.disabled = true;
    };

    aButton.addEventListener('click', () => {
      selectTrack(soundA, aButton);
    });

    bButton.addEventListener('click', () => {
      selectTrack(soundB, bButton);
    });

    if (cButton) {
      cButton.addEventListener('click', () => {
        selectTrack(soundC, cButton);
      });
    }

    playButton.addEventListener('click', () => {
      if (currentSound) {
        if (currentSound.paused) {
          playSound(currentSound);
        } else {
          pauseAll();
        }
      } else if (soundA) {
        currentSound = soundA; // Set currentSound on first play
        playSound(currentSound);
      }
    });

    stopButton.addEventListener('click', () => {
      stopAll();
    });

    progressBar.addEventListener('click', (event) => {
      if (currentSound && currentSound.duration) {
        const rect = progressBar.getBoundingClientRect();
        const percentage = (event.clientX - rect.left) / progressBar.offsetWidth;
        const seekTime = percentage * currentSound.duration;
        soundA.currentTime = seekTime;
        soundB.currentTime = seekTime;
        if (soundC) soundC.currentTime = seekTime;
        currentSound.currentTime = seekTime;
      }
    });

    // Initial state setup
    playButton.innerHTML = playIcon;
    playButton.classList.remove(playButtonPressedClass); // Ensure it starts as "play"
    aButton.disabled = true; // Track A is selected by default
    bButton.disabled = false;
    if (cButton) cButton.disabled = false;
    stopButton.disabled = true;
    currentSound = soundA; // Set track A as the current sound
    playButton.disabled = false;

    // Start updating the progress bar immediately
    updateProgress();
  });
}