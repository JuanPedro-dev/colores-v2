const circles = document.querySelectorAll(".circle");

function applyCustomColors() {
  const defaultConfig = {
    bodyBg: '#000000',
    circles: [
      { bg: '#ff3b3b', text: '#000000', content: 'Hola' },
      { bg: '#00bfff', text: '#000000', content: 'Bienvenido' },
      { bg: '#39ff14', text: '#000000', content: '¿Cómo estás?' },
      { bg: '#ffd700', text: '#000000', content: 'Vamos' }
    ]
  };
  
  const oldCircleColors = JSON.parse(localStorage.getItem('circleColors'));
  let savedConfig = JSON.parse(localStorage.getItem('appColors'));
  
  if (!savedConfig) {
      if (oldCircleColors) {
          savedConfig = {
              bodyBg: '#000000',
              circles: oldCircleColors.map((color, idx) => ({ 
                  bg: color, 
                  text: '#000000',
                  content: defaultConfig.circles[idx].content 
              }))
          };
      } else {
          savedConfig = defaultConfig;
      }
  }

  document.body.style.backgroundColor = savedConfig.bodyBg || '#000000';

  const hex2rgba = (hex, alpha = 1) => {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const savedCircles = savedConfig.circles || defaultConfig.circles;

  circles.forEach((circle, index) => {
    const customConfig = savedCircles[index];
    if (customConfig) {
      // Background and Text colors
      circle.style.backgroundColor = customConfig.bg;
      circle.style.color = customConfig.text;
      // circle.style.boxShadow = `0 0 25px 5px ${hex2rgba(customConfig.bg, 0.6)}`;
      
      // Update text content and data-text for text-to-speech
      const textContent = customConfig.content || defaultConfig.circles[index].content;
      
      // circle.textContent = textContent;
      circle.setAttribute("data-text", textContent);
    }
  });
}

// Ensure colors apply on load
applyCustomColors();

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
    alert("Audio no soportado o bloqueado por el navegador.");
  }
}

// Config Page Logic
document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById('save-btn');
  if (!saveBtn) return; // Ensure we are on config.html

  const bodyBgInput = document.getElementById('body-bg');
  
  // Circle inputs
  const bgInputs = [
      document.getElementById('bg-circle-top-left'),
      document.getElementById('bg-circle-top-right'),
      document.getElementById('bg-circle-bottom-left'),
      document.getElementById('bg-circle-bottom-right')
  ];

  const contentInputs = [
      document.getElementById('content-circle-top-left'),
      document.getElementById('content-circle-top-right'),
      document.getElementById('content-circle-bottom-left'),
      document.getElementById('content-circle-bottom-right')
  ];

  const defaultConfig = {
      bodyBg: '#000000',
      circles: [
          { bg: '#ff3b3b', text: '#000000', content: 'Hola' },
          { bg: '#00bfff', text: '#000000', content: 'Bienvenido' },
          { bg: '#39ff14', text: '#000000', content: '¿Cómo estás?' },
          { bg: '#ffd700', text: '#000000', content: 'Vamos' }
      ]
  };
  
  let savedConfig = JSON.parse(localStorage.getItem('appColors')) || defaultConfig;

  // Set input values to saved values
  if (bodyBgInput) bodyBgInput.value = savedConfig.bodyBg || defaultConfig.bodyBg;
  
  const savedCircles = savedConfig.circles || defaultConfig.circles;
  
  bgInputs.forEach((input, index) => {
      if (input && savedCircles[index]) input.value = savedCircles[index].bg;
  });

  contentInputs.forEach((input, index) => {
      if (input && savedCircles[index]) input.value = savedCircles[index].content || defaultConfig.circles[index].content;
  });

  saveBtn.addEventListener('click', () => {
      const configToSave = {
          bodyBg: bodyBgInput ? bodyBgInput.value : defaultConfig.bodyBg,
          circles: bgInputs.map((bgInput, index) => ({
              bg: bgInput ? bgInput.value : defaultConfig.circles[index].bg,
          }))
      };
      
      localStorage.setItem('appColors', JSON.stringify(configToSave));
      
      saveBtn.textContent = '¡Guardado!';
      saveBtn.classList.add('success');
      
      setTimeout(() => {
          saveBtn.textContent = 'Guardar Colores';
          saveBtn.classList.remove('success');
      }, 2000);
      
      // Update preview immediately
      applyCustomColors();
  });
});
