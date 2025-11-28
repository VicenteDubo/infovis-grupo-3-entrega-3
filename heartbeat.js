// Generador de sonidos de monitor cardíaco
class HeartbeatGenerator {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.intervalId = null;
    }

    // Inicializar el contexto de audio
    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Generar un pitido de monitor cardíaco
    generateHeartbeat(frequency = 800, duration = 0.1, volume = 0.3) {
        if (!this.audioContext) this.init();
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Configurar el sonido
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        // Envelope para simular un pitido de monitor
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Generar ritmo cardíaco según la edad (MENOR edad = MÁS rápido)
    generateHeartbeatPattern(lifeExpectancy) {
        if (this.isPlaying) this.stop();
        
        this.isPlaying = true;
        this.init();
        
        let frequency, duration, volume, interval;
        
        // Configurar según la edad - MENOR edad = MÁS rápido (más crítico) - Rangos cada 2.5 años
        if (lifeExpectancy < 50) {
            // Extremadamente crítico - extremadamente rápido
            frequency = 1100;
            duration = 0.2;
            volume = 0.5;
            interval = 150; // 150ms - extremadamente rápido
        } else if (lifeExpectancy >= 50 && lifeExpectancy < 52.5) {
            // Ritmo de emergencia - MUY rápido
            frequency = 1000;
            duration = 0.15;
            volume = 0.5;
            interval = 180; // 180ms - MUY rápido
        } else if (lifeExpectancy >= 52.5 && lifeExpectancy < 55) {
            // Ritmo crítico - muy rápido
            frequency = 950;
            duration = 0.12;
            volume = 0.5;
            interval = 200; // 200ms - muy rápido
        } else if (lifeExpectancy >= 55 && lifeExpectancy < 57.5) {
            // Ritmo acelerado - rápido
            frequency = 900;
            duration = 0.1;
            volume = 0.5;
            interval = 250; // 250ms - rápido
        } else if (lifeExpectancy >= 57.5 && lifeExpectancy < 60) {
            // Ritmo rápido - moderado rápido
            frequency = 850;
            duration = 0.08;
            volume = 0.5;
            interval = 300; // 300ms - moderado rápido
        } else if (lifeExpectancy >= 60 && lifeExpectancy < 62.5) {
            // Ritmo moderado - moderado
            frequency = 800;
            duration = 0.07;
            volume = 0.35;
            interval = 400; // 400ms - moderado
        } else if (lifeExpectancy >= 62.5 && lifeExpectancy < 65) {
            // Ritmo moderado lento - lento
            frequency = 780;
            duration = 0.06;
            volume = 0.3;
            interval = 500; // 500ms - lento
        } else if (lifeExpectancy >= 65 && lifeExpectancy < 67.5) {
            // Ritmo cardíaco sano - lento moderado
            frequency = 750;
            duration = 0.05;
            volume = 0.28;
            interval = 600; // 600ms - lento moderado
        } else if (lifeExpectancy >= 67.5 && lifeExpectancy < 70) {
            // Ritmo cardíaco sano - muy lento
            frequency = 720;
            duration = 0.04;
            volume = 0.25;
            interval = 700; // 700ms - muy lento
        } else if (lifeExpectancy >= 70 && lifeExpectancy < 72.5) {
            // Ritmo cardíaco muy sano - muy lento
            frequency = 700;
            duration = 0.03;
            volume = 0.22;
            interval = 900; // 900ms - muy lento (un poquito más lento)
        } else if (lifeExpectancy >= 72.5 && lifeExpectancy < 75) {
            // Ritmo cardíaco muy sano - extremadamente lento
            frequency = 680;
            duration = 0.02;
            volume = 0.2;
            interval = 1000; // 1000ms - extremadamente lento (un poquito más lento)
        } else if (lifeExpectancy >= 75 && lifeExpectancy < 77.5) {
            // Ritmo cardíaco muy sano - extremadamente lento
            frequency = 660;
            duration = 0.02;
            volume = 0.18;
            interval = 1100; // 1100ms - extremadamente lento (un poquito más lento)
        } else if (lifeExpectancy >= 77.5 && lifeExpectancy < 80) {
            // Ritmo cardíaco muy sano - extremadamente lento
            frequency = 640;
            duration = 0.02;
            volume = 0.16;
            interval = 1200; // 1200ms - extremadamente lento (un poquito más lento)
        } else if (lifeExpectancy >= 80 && lifeExpectancy < 82.5) {
            // Ritmo cardíaco muy sano - extremadamente lento
            frequency = 620;
            duration = 0.02;
            volume = 0.15;
            interval = 1400; // 1400ms - extremadamente lento
        } else if (lifeExpectancy >= 82.5 && lifeExpectancy < 85) {
            // Ritmo cardíaco muy sano - muy extremadamente lento
            frequency = 600;
            duration = 0.02;
            volume = 0.14;
            interval = 1600; // 1600ms - muy extremadamente lento
        } else if (lifeExpectancy >= 85 && lifeExpectancy < 87.5) {
            // Ritmo cardíaco muy sano - muy extremadamente lento
            frequency = 580;
            duration = 0.02;
            volume = 0.13;
            interval = 1800; // 1800ms - muy extremadamente lento
        } else if (lifeExpectancy >= 87.5 && lifeExpectancy < 90) {
            // Ritmo cardíaco muy sano - muy extremadamente lento
            frequency = 560;
            duration = 0.02;
            volume = 0.12;
            interval = 2000; // 2000ms - muy extremadamente lento
        } else if (lifeExpectancy >= 90) {
            // Ritmo cardíaco muy sano - muy extremadamente lento
            frequency = 540;
            duration = 0.02;
            volume = 0.1;
            interval = 2500; // 2500ms - muy extremadamente lento
        }
        
        // Reproducir el primer pitido inmediatamente
        this.generateHeartbeat(frequency, duration, volume);
        
        // Configurar el intervalo para continuar
        this.intervalId = setInterval(() => {
            if (this.isPlaying) {
                this.generateHeartbeat(frequency, duration, volume);
            }
        }, interval);
    }

    // Detener el ritmo cardíaco
    stop() {
        this.isPlaying = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// Crear instancia global
const heartbeatGenerator = new HeartbeatGenerator();
