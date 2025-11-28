// AudioManager: centraliza toda la lógica de audio (coins.wav, pitido, heartbeat)
const AudioManager = (function() {
    // Elementos de audio para archivos pregrabados
    const coinsSound = new Audio('coins.wav');
    const beepSound = new Audio('pitido.wav');

    // Estados internos
    let coinsInterval = null;
    let beepInterval = null;
    let isPlayingCoins = false;
    let isPlayingBeep = false;
    let audioInitialized = false;

    function initializeAudio() {
        if (!audioInitialized) {
            try {
                coinsSound.load();
            } catch (e) {
                console.warn('No se pudo cargar coins.wav automáticamente:', e);
            }
            try {
                beepSound.load();
            } catch (e) {
                console.warn('No se pudo cargar pitido.wav automáticamente:', e);
            }
            audioInitialized = true;
        }
    }

    function stopCoinsSound() {
        isPlayingCoins = false;
        if (coinsInterval) {
            clearInterval(coinsInterval);
            coinsInterval = null;
        }
    }

    function playCoinsSound(spending, maxSpending, countryName = '') {
        stopCoinsSound();

        console.log(`💰 Reproduciendo monedas para gasto: $${spending} (máximo: $${maxSpending})`);

        isPlayingCoins = true;

        // Sistema de rangos muy sensible para diferentes niveles de gasto
        let interval, volume, repetitions;

        // Volumen fijo para todos los casos
        volume = 0.8; // Volumen constante para todas las monedas

        // Caso especial para Estados Unidos - rápido pero distinguible
        if (countryName === 'United States' || countryName === 'United States of America') {
            console.log('🇺🇸 Estados Unidos - sonido rápido pero distinguible');
            interval = 300; // 300ms - rápido pero distinguible
            repetitions = 2; // sonidos superpuestos para efecto de "lluvia de monedas"
        } else if (spending >= 8000) {
            // Gasto muy alto (8000+): Rápido pero distinguible
            console.log('💎 Gasto muy alto - sonido rápido distinguible');
            interval = 300; // 300ms - rápido pero distinguible
            repetitions = 3; // 3 sonidos superpuestos
        } else if (spending >= 5000) {
            // Gasto alto (5000-8000): Moderado rápido
            console.log('💍 Gasto alto - sonido moderado rápido');
            interval = 400; // 400ms - moderado rápido
            repetitions = 2; // 2 sonidos superpuestos
        } else if (spending >= 3000) {
            // Gasto medio-alto (3000-5000): Moderado
            console.log('💰 Gasto medio-alto - sonido moderado');
            interval = 500; // 500ms - moderado
            repetitions = 1;
        } else if (spending >= 2000) {
            // Gasto medio (2000-3000): Moderado lento
            console.log('🪙 Gasto medio - sonido moderado lento');
            interval = 700; // 700ms - moderado lento
            repetitions = 1;
        } else if (spending >= 1000) {
            // Gasto medio-bajo (1000-2000): Lento
            console.log('🪙 Gasto medio-bajo - sonido lento');
            interval = 1000; // 1000ms - lento
            repetitions = 1;
        } else if (spending >= 500) {
            // Gasto bajo (500-1000): Muy lento
            console.log('🪙 Gasto bajo - sonido muy lento');
            interval = 1500; // 1500ms - muy lento
            repetitions = 1;
        } else if (spending >= 100) {
            // Gasto muy bajo (100-500): Extremadamente lento
            console.log('🪙 Gasto muy bajo - sonido extremadamente lento');
            interval = 2500; // 2500ms - extremadamente lento
            repetitions = 1;
        } else {
            // Gasto mínimo (<100): Casi silencio
            console.log('🪙 Gasto mínimo - casi silencio');
            interval = 4000; // 4000ms - casi silencio
            repetitions = 1;
        }

        // Función para reproducir sonidos superpuestos
        const playSound = () => {
            for (let i = 0; i < repetitions; i++) {
                setTimeout(() => {
                    // Crear una nueva instancia de audio para cada repetición
                    const audioInstance = new Audio('coins.wav');
                    audioInstance.currentTime = 0;
                    audioInstance.volume = volume; // Volumen constante
                    audioInstance.play().catch(e => console.log('Error playing coins:', e));
                }, i * 50); // Espaciar los sonidos 50ms
            }
        };

        // Reproducir inmediatamente
        playSound();

        // Continuar reproduciendo en intervalos
        coinsInterval = setInterval(() => {
            if (isPlayingCoins) {
                playSound();
            }
        }, interval);
    }

    function stopBeepSound() {
        isPlayingBeep = false;
        // detener heartbeat generator si existe
        if (typeof heartbeatGenerator !== 'undefined' && heartbeatGenerator && typeof heartbeatGenerator.stop === 'function') {
            heartbeatGenerator.stop();
        }
        if (beepInterval) {
            clearInterval(beepInterval);
            beepInterval = null;
        }
    }

    function playBeepSound(lifeExpectancy, minLife, maxLife) {
        stopBeepSound();
        console.log(`AudioManager: Reproduciendo pitido para esperanza de vida: ${lifeExpectancy}`);
        isPlayingBeep = true;

        if (typeof heartbeatGenerator !== 'undefined' && heartbeatGenerator && typeof heartbeatGenerator.generateHeartbeatPattern === 'function') {
            heartbeatGenerator.generateHeartbeatPattern(lifeExpectancy);
            return;
        }

        // fallback usando el archivo pitido.wav y timers
        playBeepSoundFallback(lifeExpectancy);
    }

    function playBeepSoundFallback(lifeExpectancy) {
        // usa la lógica de rangos para crear intervalos y volumen
        if (lifeExpectancy < 50) {
            beepSound.currentTime = 0; beepSound.volume = 0.8; beepSound.play().catch(e => console.log('Error playing beep (fallback):', e));
            beepInterval = setInterval(() => { if (isPlayingBeep) { beepSound.currentTime = 0; beepSound.play().catch(()=>{}); } }, 150);
        } else if (lifeExpectancy >= 50 && lifeExpectancy < 52.5) {
            beepSound.currentTime = 0; beepSound.volume = 0.75; beepSound.play().catch(()=>{});
            beepInterval = setInterval(() => { if (isPlayingBeep) { beepSound.currentTime = 0; beepSound.play().catch(()=>{}); } }, 180);
        } else if (lifeExpectancy >= 52.5 && lifeExpectancy < 55) {
            beepSound.currentTime = 0; beepSound.volume = 0.7; beepSound.play().catch(()=>{});
            beepInterval = setInterval(() => { if (isPlayingBeep) { beepSound.currentTime = 0; beepSound.play().catch(()=>{}); } }, 200);
        } else if (lifeExpectancy >= 55 && lifeExpectancy < 57.5) {
            beepSound.currentTime = 0; beepSound.volume = 0.65; beepSound.play().catch(()=>{});
            beepInterval = setInterval(() => { if (isPlayingBeep) { beepSound.currentTime = 0; beepSound.play().catch(()=>{}); } }, 250);
        } else if (lifeExpectancy >= 57.5 && lifeExpectancy < 60) {
            beepSound.currentTime = 0; beepSound.volume = 0.6; beepSound.play().catch(()=>{});
            beepInterval = setInterval(() => { if (isPlayingBeep) { beepSound.currentTime = 0; beepSound.play().catch(()=>{}); } }, 300);
        } else if (lifeExpectancy >= 60 && lifeExpectancy < 62.5) {
            beepSound.currentTime = 0; beepSound.volume = 0.55; beepSound.play().catch(()=>{});
            beepInterval = setInterval(() => { if (isPlayingBeep) { beepSound.currentTime = 0; beepSound.play().catch(()=>{}); } }, 400);
        } else if (lifeExpectancy >= 62.5 && lifeExpectancy < 65) {
            beepSound.currentTime = 0; beepSound.volume = 0.5; beepSound.play().catch(()=>{});
            beepInterval = setInterval(() => { if (isPlayingBeep) { beepSound.currentTime = 0; beepSound.play().catch(()=>{}); } }, 500);
        } else if (lifeExpectancy >= 65 && lifeExpectancy < 67.5) {
            beepSound.currentTime = 0; beepSound.volume = 0.45; beepSound.play().catch(()=>{});
            beepInterval = setInterval(() => { if (isPlayingBeep) { beepSound.currentTime = 0; beepSound.play().catch(()=>{}); } }, 600);
        } else if (lifeExpectancy >= 67.5 && lifeExpectancy < 70) {
            beepSound.currentTime = 0; beepSound.volume = 0.4; beepSound.play().catch(()=>{});
            beepInterval = setInterval(() => { if (isPlayingBeep) { beepSound.currentTime = 0; beepSound.play().catch(()=>{}); } }, 700);
        } else if (lifeExpectancy >= 70 && lifeExpectancy < 72.5) {
            beepSound.currentTime = 0; beepSound.volume = 0.35; beepSound.play().catch(()=>{});
            beepInterval = setInterval(() => { if (isPlayingBeep) { beepSound.currentTime = 0; beepSound.play().catch(()=>{}); } }, 900);
        } else if (lifeExpectancy >= 72.5 && lifeExpectancy < 75) {
            beepSound.currentTime = 0; beepSound.volume = 0.3; beepSound.play().catch(()=>{});
            beepInterval = setInterval(() => { if (isPlayingBeep) { beepSound.currentTime = 0; beepSound.play().catch(()=>{}); } }, 1000);
        } else if (lifeExpectancy >= 75 && lifeExpectancy < 77.5) {
            beepSound.currentTime = 0; beepSound.volume = 0.25; beepSound.play().catch(()=>{});
            beepInterval = setInterval(() => { if (isPlayingBeep) { beepSound.currentTime = 0; beepSound.play().catch(()=>{}); } }, 1100);
        } else if (lifeExpectancy >= 77.5 && lifeExpectancy < 80) {
            beepSound.currentTime = 0; beepSound.volume = 0.2; beepSound.play().catch(()=>{});
            beepInterval = setInterval(() => { if (isPlayingBeep) { beepSound.currentTime = 0; beepSound.play().catch(()=>{}); } }, 1200);
        } else if (lifeExpectancy >= 80 && lifeExpectancy < 82.5) {
            beepSound.currentTime = 0; beepSound.volume = 0.15; beepSound.play().catch(()=>{});
            beepInterval = setInterval(() => { if (isPlayingBeep) { beepSound.currentTime = 0; beepSound.play().catch(()=>{}); } }, 1400);
        } else if (lifeExpectancy >= 82.5 && lifeExpectancy < 85) {
            beepSound.currentTime = 0; beepSound.volume = 0.18; beepSound.play().catch(()=>{});
            beepInterval = setInterval(() => { if (isPlayingBeep) { beepSound.currentTime = 0; beepSound.play().catch(()=>{}); } }, 1600);
        } else if (lifeExpectancy >= 85 && lifeExpectancy < 87.5) {
            beepSound.currentTime = 0; beepSound.volume = 0.13; beepSound.play().catch(()=>{});
            beepInterval = setInterval(() => { if (isPlayingBeep) { beepSound.currentTime = 0; beepSound.play().catch(()=>{}); } }, 1800);
        } else if (lifeExpectancy >= 87.5 && lifeExpectancy < 90) {
            beepSound.currentTime = 0; beepSound.volume = 0.15; beepSound.play().catch(()=>{});
            beepInterval = setInterval(() => { if (isPlayingBeep) { beepSound.currentTime = 0; beepSound.play().catch(()=>{}); } }, 2000);
        } else if (lifeExpectancy >= 90) {
            beepSound.currentTime = 0; beepSound.volume = 0.12; beepSound.play().catch(()=>{});
            beepInterval = setInterval(() => { if (isPlayingBeep) { beepSound.currentTime = 0; beepSound.play().catch(()=>{}); } }, 2500);
        }
    }

    function stopAllSounds() {
        console.log('AudioManager: stopAllSounds');
        stopCoinsSound();
        stopBeepSound();

        try { coinsSound.pause(); coinsSound.currentTime = 0; } catch (e) {}
        try { beepSound.pause(); beepSound.currentTime = 0; } catch (e) {}
    }

    // Exponer API pública
    return {
        initializeAudio,
        playCoinsSound,
        stopCoinsSound,
        playBeepSound,
        stopBeepSound,
        stopAllSounds,
        // Exponer los estados por si se necesitan
        get isPlayingCoins() { return isPlayingCoins; },
        get isPlayingBeep() { return isPlayingBeep; }
    };
})();

// Hacer accesible desde window
window.AudioManager = AudioManager;

// Nota: Este archivo reúne toda la lógica de audio en un solo módulo.
// No modifica otros archivos. Para usarlo desde código existente, reemplazar
// llamadas como `playCoinsSound(...)` por `AudioManager.playCoinsSound(...)`.
