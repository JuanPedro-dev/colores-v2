const circles = document.querySelectorAll(".circle");

circles.forEach((circle) => {
  circle.addEventListener("click", () => {
    const text = circle.getAttribute("data-text");

    speakText(text);
    playFeedbackBeep();
  });
});

function speakText(text) {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.pitch = 1;
  utterance.rate = 1;

  window.speechSynthesis.speak(utterance);
}

function playFeedbackBeep() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioCtx.currentTime + 0.1,
    );

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  } catch (e) {
    console.warn("Audio no soportado o bloqueado por el navegador.");
  }
}
