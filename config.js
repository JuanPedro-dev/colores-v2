document.addEventListener("DOMContentLoaded", () => {
    const bodyBgInput = document.getElementById('body-bg');
    
    // Circle inputs
    const bgInputs = [
        document.getElementById('bg-circle-top-left'),
        document.getElementById('bg-circle-top-right'),
        document.getElementById('bg-circle-bottom-left'),
        document.getElementById('bg-circle-bottom-right')
    ];
    
    const textInputs = [
        document.getElementById('text-circle-top-left'),
        document.getElementById('text-circle-top-right'),
        document.getElementById('text-circle-bottom-left'),
        document.getElementById('text-circle-bottom-right')
    ];

    const contentInputs = [
        document.getElementById('content-circle-top-left'),
        document.getElementById('content-circle-top-right'),
        document.getElementById('content-circle-bottom-left'),
        document.getElementById('content-circle-bottom-right')
    ];

    const saveBtn = document.getElementById('save-btn');

    // Default configuration
    const defaultConfig = {
        bodyBg: '#000000',
        circles: [
            { bg: '#ff3b3b', text: '#000000', content: 'Hola' },
            { bg: '#00bfff', text: '#000000', content: 'Bienvenido' },
            { bg: '#39ff14', text: '#000000', content: '¿Cómo estás?' },
            { bg: '#ffd700', text: '#000000', content: 'Vamos' }
        ]
    };
    
    // Load from localStorage if present
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

    // Set input values to saved colors
    bodyBgInput.value = savedConfig.bodyBg || defaultConfig.bodyBg;
    
    const savedCircles = savedConfig.circles || defaultConfig.circles;
    
    bgInputs.forEach((input, index) => {
        if (input && savedCircles[index]) input.value = savedCircles[index].bg;
    });
    
    textInputs.forEach((input, index) => {
        if (input && savedCircles[index]) input.value = savedCircles[index].text;
    });

    contentInputs.forEach((input, index) => {
        if (input && savedCircles[index]) input.value = savedCircles[index].content || defaultConfig.circles[index].content;
    });

    saveBtn.addEventListener('click', () => {
        const configToSave = {
            bodyBg: bodyBgInput.value,
            circles: bgInputs.map((bgInput, index) => ({
                bg: bgInput.value,
                text: textInputs[index].value,
                content: contentInputs[index].value
            }))
        };
        
        localStorage.setItem('appColors', JSON.stringify(configToSave));
        
        saveBtn.textContent = '¡Guardado!';
        saveBtn.classList.add('success');
        
        // Return to normal state after 2 seconds
        setTimeout(() => {
            saveBtn.textContent = 'Guardar Colores';
            saveBtn.classList.remove('success');
        }, 2000);
    });
});
