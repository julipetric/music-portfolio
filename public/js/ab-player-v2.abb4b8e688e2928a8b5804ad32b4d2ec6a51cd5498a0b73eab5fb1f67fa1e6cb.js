(() => {
  // <stdin>
  var players = document.querySelectorAll(".player__wrapper");
  initializePlayers(players);
  function initializePlayers(players2) {
    players2.forEach((player) => {
      const audioA = player.getAttribute("data-audio-a");
      const audioB = player.getAttribute("data-audio-b");
      const audioC = player.getAttribute("data-audio-c");
      console.log("audioA", audioA);
      console.log("audioB", audioB);
      var soundA = document.createElement("audio");
      soundA.src = audioA;
      soundA.preload = "auto";
      soundA.setAttribute("hidden", "true");
      soundA.setAttribute("type", "audio/mpeg");
      document.body.append(soundA);
      var soundB = document.createElement("audio");
      soundB.src = audioB;
      soundB.preload = "auto";
      soundB.setAttribute("hidden", "true");
      soundB.setAttribute("type", "audio/mpeg");
      document.body.append(soundB);
      if (audioC) {
        var soundC = document.createElement("audio");
        soundC.src = audioC;
        soundC.preload = "auto";
        soundC.setAttribute("hidden", "true");
        soundC.setAttribute("type", "audio/mpeg");
        document.body.append(soundC);
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
      const stopIcon = '<i class="fa-solid fa-stop"></i>';
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )) {
        playButton.disabled = false;
      }
      var soundAReady = false;
      var soundBReady = false;
      var soundCReady = false;
      soundA.oncanplaythrough = function() {
        if (!soundAReady) {
          soundAReady = true;
          audioIsReady();
        }
      };
      soundB.oncanplaythrough = function() {
        if (!soundBReady) {
          soundBReady = true;
          audioIsReady();
        }
      };
      soundC.oncanplaythrough = function() {
        if (!soundCReady) {
          soundCReady = true;
          audioIsReady();
        }
      };
      function audioIsReady() {
        if (soundAReady && soundBReady && soundCReady) {
          console.log("...audio loaded!");
          aButton.disabled = false;
          bButton.disabled = false;
          cButton.disabled = false;
          playButton.disabled = false;
        } else {
          console.log("Audio loading...");
        }
      }
      const progress = player.querySelector(".progress");
      progress.addEventListener("click", function(event) {
        var rect = this.getBoundingClientRect();
        var percentage = (event.clientX - rect.left) / this.offsetWidth;
        soundA.currentTime = percentage * soundA.duration;
        soundB.currentTime = percentage * soundB.duration;
        if (soundC) {
          soundC.currentTime = percentage * soundC.duration;
        }
      });
      function playPause() {
        if (soundA.paused && soundB.paused && soundC.paused) {
          let soundATime = soundA.currentTime;
          let soundBTime = soundB.currentTime;
          let soundCTime = soundC.currentTime;
          if (soundATime >= soundBTime && soundATime >= soundCTime) {
            soundA.play();
            bButton.disabled = false;
            cButton.disabled = false;
            aButton.disabled = true;
            playButton.innerHTML = pauseIcon;
          } else if (soundBTime >= soundATime && soundBTime >= soundCTime) {
            soundB.play();
            aButton.disabled = false;
            cButton.disabled = false;
            bButton.disabled = true;
            playButton.innerHTML = pauseIcon;
          } else {
            soundC.play();
            aButton.disabled = false;
            bButton.disabled = false;
            cButton.disabled = true;
            playButton.innerHTML = pauseIcon;
          }
          stopButton.disabled = false;
        } else {
          playButton.innerHTML = playIcon;
          soundA.pause();
          soundB.pause();
          soundC.pause();
        }
      }
      aButton.addEventListener("click", (e) => {
        pauseAll();
        playButton.innerHTML = pauseIcon;
        aButton.disabled = true;
        bButton.disabled = false;
        if (soundC) {
          cButton.disabled = false;
          if (soundC.currentTime > 0) {
            soundA.currentTime = soundC.currentTime;
          }
        }
        stopButton.disabled = false;
        if (soundB.currentTime > 0) {
          soundA.currentTime = soundB.currentTime;
        }
        soundA.play();
        soundB.pause();
        if (soundC) {
          soundC.pause();
        }
      });
      bButton.addEventListener("click", (e) => {
        pauseAll();
        playButton.innerHTML = pauseIcon;
        bButton.disabled = true;
        aButton.disabled = false;
        if (soundC) {
          cButton.disabled = false;
          if (soundC.currentTime > 0) {
            soundB.currentTime = soundC.currentTime;
          }
        }
        stopButton.disabled = false;
        if (soundA.currentTime > 0) {
          soundB.currentTime = soundA.currentTime;
        }
        soundB.play();
        soundA.pause();
        if (soundC) {
          soundC.pause();
        }
      });
      cButton.addEventListener("click", (e) => {
        pauseAll();
        playButton.innerHTML = pauseIcon;
        cButton.disabled = true;
        aButton.disabled = false;
        bButton.disabled = false;
        stopButton.disabled = false;
        if (soundA.currentTime > 0) {
          soundC.currentTime = soundA.currentTime;
        } else if (soundB.currentTime > 0) {
          soundC.currentTime = soundB.currentTime;
        }
        soundC.play();
        soundA.pause();
        soundB.pause();
      });
      playButton.addEventListener("click", (e) => {
        let allAudio = document.querySelectorAll("audio");
        let allButtons = document.querySelectorAll(".play__button");
        for (let i = 0; i < allAudio.length; i++) {
          if (allAudio[i] !== soundA && allAudio[i] !== soundB && allAudio[i] !== soundC) {
            allAudio[i].pause();
          }
        }
        for (let i = 0; i < allButtons.length; i++) {
          if (allButtons[i] !== playButton) {
            allButtons[i].innerHTML = playIcon;
          }
        }
        playPause();
      });
      stopButton.addEventListener("click", (e) => {
        stopSounds();
      });
      soundA.addEventListener("playing", (e) => {
        console.log("playing a");
        progressFill.style.width = (soundA.currentTime / soundA.duration * 100 || 0) + "%";
        requestAnimationFrame(stepA);
      });
      soundB.addEventListener("playing", (e) => {
        console.log("playing b");
        progressFill.style.width = (soundB.currentTime / soundB.duration * 100 || 0) + "%";
        requestAnimationFrame(stepB);
      });
      if (soundC) {
        soundC.addEventListener("playing", (e) => {
          console.log("playing c");
          progressFill.style.width = (soundC.currentTime / soundC.duration * 100 || 0) + "%";
          requestAnimationFrame(stepC);
        });
      }
      const stopSounds = () => {
        playButton.innerHTML = playIcon;
        aButton.disabled = false;
        bButton.disabled = false;
        if (soundC) {
          cButton.disabled = false;
        }
        playButton.disabled = false;
        stopButton.disabled = true;
        soundA.pause();
        soundA.currentTime = 0;
        soundB.pause();
        soundB.currentTime = 0;
        if (soundC) {
          soundC.pause();
          soundC.currentTime = 0;
        }
      };
      function pauseAll() {
        let allAudio = document.querySelectorAll("audio");
        allAudio.forEach((audio) => {
          audio.pause();
        });
        document.querySelectorAll(".play__button").forEach((button) => {
          button.innerHTML = playIcon;
        });
      }
      function stepA() {
        progressFill.style.width = (soundA.currentTime / soundA.duration * 100 || 0) + "%";
        requestAnimationFrame(stepA);
      }
      function stepB() {
        progressFill.style.width = (soundB.currentTime / soundB.duration * 100 || 0) + "%";
        requestAnimationFrame(stepB);
      }
      if (soundC) {
        let stepC2 = function() {
          progressFill.style.width = (soundC.currentTime / soundC.duration * 100 || 0) + "%";
          requestAnimationFrame(stepC2);
        };
        var stepC = stepC2;
      }
    });
  }
})();
