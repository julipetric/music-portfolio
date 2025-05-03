(() => {
  // <stdin>
  var players = document.querySelectorAll(".player__wrapper");
  initializePlayers(players);
  function initializePlayers(players2) {
    players2.forEach((player) => {
      const audioA = player.getAttribute("data-audio-a");
      const audioB = player.getAttribute("data-audio-b");
      const audioC = player.getAttribute("data-audio-c");
      const soundA = new Audio(audioA);
      const soundB = new Audio(audioB);
      let soundC = null;
      if (audioC) {
        soundC = new Audio(audioC);
      }
      soundA.preload = "auto";
      soundB.preload = "auto";
      if (soundC) {
        soundC.preload = "auto";
      }
      const aButton = player.querySelector(".a__button");
      const bButton = player.querySelector(".b__button");
      const cButton = player.querySelector(".c__button");
      const playButton = player.querySelector(".play__button");
      const stopButton = player.querySelector(".stop__button");
      const progressBar = player.querySelector(".progress__bar");
      const progressFill = player.querySelector(".progress__fill");
      const playIcon = '<i class="fa-solid fa-play"></i>';
      const pauseIcon = '<i class="fa-solid fa-pause"></i>';
      let currentSound = null;
      const updateProgress = () => {
        if (currentSound && currentSound.duration) {
          progressFill.style.width = `${currentSound.currentTime / currentSound.duration * 100}%`;
        } else {
          progressFill.style.width = "0%";
        }
        requestAnimationFrame(updateProgress);
      };
      requestAnimationFrame(updateProgress);
      const playActiveSound = () => {
        if (currentSound) {
          currentSound.play().catch((error) => console.error("Playback failed:", error));
          playButton.innerHTML = pauseIcon;
        }
      };
      const pauseActiveSound = () => {
        if (currentSound) {
          currentSound.pause();
          playButton.innerHTML = playIcon;
        }
      };
      const stopActiveSound = () => {
        if (currentSound) {
          currentSound.pause();
          currentSound.currentTime = 0;
          playButton.innerHTML = playIcon;
        }
      };
      const selectSound = (newSound, buttonToDisable) => {
        if (currentSound && currentSound !== newSound) {
          currentSound.pause();
        }
        currentSound = newSound;
        aButton.disabled = false;
        bButton.disabled = false;
        if (cButton) {
          cButton.disabled = false;
        }
        if (buttonToDisable) {
          buttonToDisable.disabled = true;
        }
        playActiveSound();
        stopButton.disabled = false;
      };
      aButton.addEventListener("click", () => {
        selectSound(soundA, aButton);
      });
      bButton.addEventListener("click", () => {
        selectSound(soundB, bButton);
      });
      if (cButton) {
        cButton.addEventListener("click", () => {
          selectSound(soundC, cButton);
        });
      }
      playButton.addEventListener("click", () => {
        if (currentSound) {
          if (currentSound.paused) {
            playActiveSound();
          } else {
            pauseActiveSound();
          }
        } else if (soundA) {
          selectSound(soundA, aButton);
        }
      });
      stopButton.addEventListener("click", () => {
        stopActiveSound();
      });
      progressBar.addEventListener("click", (event) => {
        if (currentSound && currentSound.duration) {
          const rect = progressBar.getBoundingClientRect();
          const percentage = (event.clientX - rect.left) / progressBar.offsetWidth;
          currentSound.currentTime = percentage * currentSound.duration;
        }
      });
      soundA.addEventListener("loadedmetadata", () => {
        if (!currentSound) {
          aButton.disabled = false;
        }
      });
      soundB.addEventListener("loadedmetadata", () => {
        if (!currentSound) {
          bButton.disabled = false;
        }
      });
      if (soundC) {
        soundC.addEventListener("loadedmetadata", () => {
          if (!currentSound) {
            cButton.disabled = false;
          }
        });
      }
      if (!soundA.src || !soundB.src || soundC && !soundC.src) {
        playButton.disabled = true;
      } else {
        playButton.disabled = false;
        aButton.disabled = true;
        currentSound = soundA;
      }
      stopButton.disabled = true;
    });
  }
})();
