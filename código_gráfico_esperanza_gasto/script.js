// Crear variables globales
let healthData;
let currentView = 'spending'; // 'spending', 'lifeExpectancy', 'efficiency'
let selectedRegions = ['all']; // Regiones activas
let selectedCountries = []; // Países específicos seleccionados
let soundsEnabled = false; // Control de sonidos
let dualSoundsEnabled = false; // Control de sonidos duales en barras
let parallelMapsEnabled = false; // Control de mapas en paralelo
let currentHighlightedCountry = null; // País actualmente resaltado
let barChartData = null; // Datos del gráfico de barras para referencia
let selectedCountry = null; // País seleccionado permanentemente

// Cargar y configurar sonidos
const coinsSound = new Audio('coins.wav');
const beepSound = new Audio('pitido.wav');

// Variables para controlar la reproducción de sonidos
let coinsInterval = null;
let beepInterval = null;
let isPlayingCoins = false;
let isPlayingBeep = false;
let audioInitialized = false;

// Función para inicializar el audio (requiere interacción del usuario)
function initializeAudio() {
    if (!audioInitialized) {
        coinsSound.load();
        beepSound.load();
        audioInitialized = true;
    }
}

// Función para reproducir sonido de monedas con velocidad variable muy sensible
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

function stopCoinsSound() {
    isPlayingCoins = false;
    if (coinsInterval) {
        clearInterval(coinsInterval);
        coinsInterval = null;
    }
}

// Función para reproducir pitido con velocidad variable según rangos de esperanza de vida
function playBeepSound(lifeExpectancy, minLife, maxLife) {
    stopBeepSound();
    
    console.log(`🔊 Reproduciendo ritmo cardíaco para esperanza de vida: ${lifeExpectancy} años`);
    
    isPlayingBeep = true;
    
    // Usar el generador de sonidos de monitor cardíaco
    if (typeof heartbeatGenerator !== 'undefined') {
        heartbeatGenerator.generateHeartbeatPattern(lifeExpectancy);
    } else {
        // Fallback al método anterior si el generador no está disponible
        console.log('⚠️ Generador de ritmo cardíaco no disponible, usando método anterior');
        playBeepSoundFallback(lifeExpectancy);
    }
}

// Función de respaldo para pitidos (método anterior) - MENOR edad = MÁS rápido
function playBeepSoundFallback(lifeExpectancy) {
    // <50: Extremadamente rápido (más crítico)
    if (lifeExpectancy < 50) {
        console.log('🚨 CRÍTICO (<50 años) - extremadamente rápido');
    beepSound.currentTime = 0;
        beepSound.volume = 0.8;
    beepSound.play().catch(e => console.log('Error playing beep:', e));
    
    beepInterval = setInterval(() => {
        if (isPlayingBeep) {
            beepSound.currentTime = 0;
                beepSound.play().catch(e => console.log('Error playing beep interval:', e));
            }
        }, 150); // 150ms - extremadamente rápido
        
    // 50-52.5: Muy rápido (ritmo de emergencia)
    } else if (lifeExpectancy >= 50 && lifeExpectancy < 52.5) {
        console.log('🚨 Ritmo de emergencia (50-52.5 años) - muy rápido');
        beepSound.currentTime = 0;
        beepSound.volume = 0.75;
            beepSound.play().catch(e => console.log('Error playing beep:', e));
        
        beepInterval = setInterval(() => {
            if (isPlayingBeep) {
                beepSound.currentTime = 0;
                beepSound.play().catch(e => console.log('Error playing beep interval:', e));
            }
        }, 180); // 180ms - muy rápido
        
    // 52.5-55: Rápido (ritmo crítico)
    } else if (lifeExpectancy >= 52.5 && lifeExpectancy < 55) {
        console.log('⚡ Ritmo crítico (52.5-55 años) - rápido');
        beepSound.currentTime = 0;
        beepSound.volume = 0.7;
        beepSound.play().catch(e => console.log('Error playing beep:', e));
        
        beepInterval = setInterval(() => {
            if (isPlayingBeep) {
                beepSound.currentTime = 0;
                beepSound.play().catch(e => console.log('Error playing beep interval:', e));
            }
        }, 200); // 200ms - rápido
        
    // 55-57.5: Moderado rápido (ritmo acelerado)
    } else if (lifeExpectancy >= 55 && lifeExpectancy < 57.5) {
        console.log('🏃 Ritmo acelerado (55-57.5 años) - moderado rápido');
        beepSound.currentTime = 0;
        beepSound.volume = 0.65;
        beepSound.play().catch(e => console.log('Error playing beep:', e));
        
        beepInterval = setInterval(() => {
            if (isPlayingBeep) {
                beepSound.currentTime = 0;
                beepSound.play().catch(e => console.log('Error playing beep interval:', e));
            }
        }, 250); // 250ms - moderado rápido
        
    // 57.5-60: Moderado (ritmo rápido)
    } else if (lifeExpectancy >= 57.5 && lifeExpectancy < 60) {
        console.log('💓 Ritmo rápido (57.5-60 años) - moderado');
        beepSound.currentTime = 0;
        beepSound.volume = 0.6;
        beepSound.play().catch(e => console.log('Error playing beep:', e));
        
        beepInterval = setInterval(() => {
            if (isPlayingBeep) {
                beepSound.currentTime = 0;
                beepSound.play().catch(e => console.log('Error playing beep interval:', e));
            }
        }, 300); // 300ms - moderado
        
    // 60-62.5: Moderado lento (ritmo moderado)
    } else if (lifeExpectancy >= 60 && lifeExpectancy < 62.5) {
        console.log('❤️ Ritmo moderado (60-62.5 años) - moderado lento');
        beepSound.currentTime = 0;
        beepSound.volume = 0.55;
        beepSound.play().catch(e => console.log('Error playing beep:', e));
        
        beepInterval = setInterval(() => {
            if (isPlayingBeep) {
                beepSound.currentTime = 0;
                beepSound.play().catch(e => console.log('Error playing beep interval:', e));
            }
        }, 400); // 400ms - moderado lento
        
    // 62.5-65: Lento (ritmo moderado)
    } else if (lifeExpectancy >= 62.5 && lifeExpectancy < 65) {
        console.log('❤️ Ritmo moderado (62.5-65 años) - lento');
        beepSound.currentTime = 0;
        beepSound.volume = 0.5;
        beepSound.play().catch(e => console.log('Error playing beep:', e));
        
        beepInterval = setInterval(() => {
            if (isPlayingBeep) {
                beepSound.currentTime = 0;
                beepSound.play().catch(e => console.log('Error playing beep interval:', e));
            }
        }, 500); // 500ms - lento
        
    // 65-67.5: Lento moderado (ritmo cardíaco sano)
    } else if (lifeExpectancy >= 65 && lifeExpectancy < 67.5) {
        console.log('💚 Ritmo cardíaco sano (65-67.5 años) - lento moderado');
        beepSound.currentTime = 0;
        beepSound.volume = 0.45;
        beepSound.play().catch(e => console.log('Error playing beep:', e));
        
        beepInterval = setInterval(() => {
            if (isPlayingBeep) {
                beepSound.currentTime = 0;
                beepSound.play().catch(e => console.log('Error playing beep interval:', e));
            }
        }, 600); // 600ms - lento moderado
        
    // 67.5-70: Muy lento (ritmo cardíaco sano)
    } else if (lifeExpectancy >= 67.5 && lifeExpectancy < 70) {
        console.log('💚 Ritmo cardíaco sano (67.5-70 años) - muy lento');
        beepSound.currentTime = 0;
        beepSound.volume = 0.4;
        beepSound.play().catch(e => console.log('Error playing beep:', e));
        
        beepInterval = setInterval(() => {
            if (isPlayingBeep) {
                beepSound.currentTime = 0;
                beepSound.play().catch(e => console.log('Error playing beep interval:', e));
            }
        }, 700); // 700ms - muy lento
        
    // 70-72.5: Muy lento (ritmo cardíaco muy sano)
    } else if (lifeExpectancy >= 70 && lifeExpectancy < 72.5) {
        console.log('💚 Ritmo cardíaco muy sano (70-72.5 años) - muy lento');
        beepSound.currentTime = 0;
        beepSound.volume = 0.35;
        beepSound.play().catch(e => console.log('Error playing beep:', e));
        
        beepInterval = setInterval(() => {
            if (isPlayingBeep) {
                beepSound.currentTime = 0;
                beepSound.play().catch(e => console.log('Error playing beep interval:', e));
            }
        }, 900); // 900ms - muy lento (un poquito más lento)
        
    // 72.5-75: Extremadamente lento (ritmo cardíaco muy sano)
    } else if (lifeExpectancy >= 72.5 && lifeExpectancy < 75) {
        console.log('💚 Ritmo cardíaco muy sano (72.5-75 años) - extremadamente lento');
        beepSound.currentTime = 0;
        beepSound.volume = 0.3;
        beepSound.play().catch(e => console.log('Error playing beep:', e));
        
        beepInterval = setInterval(() => {
            if (isPlayingBeep) {
                beepSound.currentTime = 0;
                beepSound.play().catch(e => console.log('Error playing beep interval:', e));
            }
        }, 1000); // 1000ms - extremadamente lento (un poquito más lento)
        
    // 75-77.5: Extremadamente lento (ritmo cardíaco muy sano)
    } else if (lifeExpectancy >= 75 && lifeExpectancy < 77.5) {
        console.log('💚 Ritmo cardíaco muy sano (75-77.5 años) - extremadamente lento');
        beepSound.currentTime = 0;
        beepSound.volume = 0.25;
        beepSound.play().catch(e => console.log('Error playing beep:', e));
        
        beepInterval = setInterval(() => {
            if (isPlayingBeep) {
                beepSound.currentTime = 0;
                beepSound.play().catch(e => console.log('Error playing beep interval:', e));
            }
        }, 1100); // 1100ms - extremadamente lento (un poquito más lento)
        
    // 77.5-80: Extremadamente lento (ritmo cardíaco muy sano)
    } else if (lifeExpectancy >= 77.5 && lifeExpectancy < 80) {
        console.log('💚 Ritmo cardíaco muy sano (77.5-80 años) - extremadamente lento');
        beepSound.currentTime = 0;
        beepSound.volume = 0.2;
        beepSound.play().catch(e => console.log('Error playing beep:', e));
        
        beepInterval = setInterval(() => {
            if (isPlayingBeep) {
                beepSound.currentTime = 0;
                beepSound.play().catch(e => console.log('Error playing beep interval:', e));
            }
        }, 1200); // 1200ms - extremadamente lento (un poquito más lento)
        
    // 80-82.5: Extremadamente lento (ritmo cardíaco muy sano)
    } else if (lifeExpectancy >= 80 && lifeExpectancy < 82.5) {
        console.log('💚 Ritmo cardíaco muy sano (80-82.5 años) - extremadamente lento');
        beepSound.currentTime = 0;
        beepSound.volume = 0.15;
        beepSound.play().catch(e => console.log('Error playing beep:', e));
        
        beepInterval = setInterval(() => {
            if (isPlayingBeep) {
                beepSound.currentTime = 0;
                beepSound.play().catch(e => console.log('Error playing beep interval:', e));
            }
        }, 1400); // 1400ms - extremadamente lento
        
    // 82.5-85: Muy extremadamente lento (ritmo cardíaco muy sano)
    } else if (lifeExpectancy >= 82.5 && lifeExpectancy < 85) {
        console.log('💚 Ritmo cardíaco muy sano (82.5-85 años) - muy extremadamente lento');
        beepSound.currentTime = 0;
        beepSound.volume = 0.18;
        beepSound.play().catch(e => console.log('Error playing beep:', e));
        
        beepInterval = setInterval(() => {
            if (isPlayingBeep) {
                beepSound.currentTime = 0;
                beepSound.play().catch(e => console.log('Error playing beep interval:', e));
            }
        }, 1600); // 1600ms - muy extremadamente lento
        
    // 85-87.5: Muy extremadamente lento (ritmo cardíaco muy sano)
    } else if (lifeExpectancy >= 85 && lifeExpectancy < 87.5) {
        console.log('💚 Ritmo cardíaco muy sano (85-87.5 años) - muy extremadamente lento');
        beepSound.currentTime = 0;
        beepSound.volume = 0.13;
        beepSound.play().catch(e => console.log('Error playing beep:', e));
        
        beepInterval = setInterval(() => {
            if (isPlayingBeep) {
                beepSound.currentTime = 0;
                beepSound.play().catch(e => console.log('Error playing beep interval:', e));
            }
        }, 1800); // 1800ms - muy extremadamente lento
        
    // 87.5-90: Muy extremadamente lento (ritmo cardíaco muy sano)
    } else if (lifeExpectancy >= 87.5 && lifeExpectancy < 90) {
        console.log('💚 Ritmo cardíaco muy sano (87.5-90 años) - muy extremadamente lento');
        beepSound.currentTime = 0;
        beepSound.volume = 0.15;
        beepSound.play().catch(e => console.log('Error playing beep:', e));
        
        beepInterval = setInterval(() => {
            if (isPlayingBeep) {
                beepSound.currentTime = 0;
                beepSound.play().catch(e => console.log('Error playing beep interval:', e));
            }
        }, 2000); // 2000ms - muy extremadamente lento
        
    // 90+: Muy extremadamente lento (ritmo cardíaco muy sano)
    } else if (lifeExpectancy >= 90) {
        console.log('💚 Ritmo cardíaco muy sano (90+ años) - muy extremadamente lento');
        beepSound.currentTime = 0;
        beepSound.volume = 0.12;
        beepSound.play().catch(e => console.log('Error playing beep:', e));
        
        beepInterval = setInterval(() => {
            if (isPlayingBeep) {
                beepSound.currentTime = 0;
                beepSound.play().catch(e => console.log('Error playing beep interval:', e));
            }
        }, 2500); // 2500ms - muy extremadamente lento
    }
}

function stopBeepSound() {
    isPlayingBeep = false;
    
    // Detener el generador de ritmo cardíaco si está disponible
    if (typeof heartbeatGenerator !== 'undefined') {
        heartbeatGenerator.stop();
    }
    
    // Detener el método anterior si está activo
    if (beepInterval) {
        clearInterval(beepInterval);
        beepInterval = null;
    }
}

// Función para detener todos los sonidos
function stopAllSounds() {
    console.log('Deteniendo todos los sonidos...');
    console.log('Estado antes:', {isPlayingCoins, isPlayingBeep, soundsEnabled});
    
    stopCoinsSound();
    stopBeepSound();
    
    // También pausar los elementos de audio directamente
    if (coinsSound) {
        coinsSound.pause();
        coinsSound.currentTime = 0;
    }
    if (beepSound) {
        beepSound.pause();
        beepSound.currentTime = 0;
    }
    
    console.log('Estado después:', {isPlayingCoins, isPlayingBeep, soundsEnabled});
}

// Función para determinar la región de un país
function getRegion(countryName, countryCode) {
    const regions = {
        'Europe': ['ALB', 'AND', 'ARM', 'AUT', 'AZE', 'BLR', 'BEL', 'BIH', 'BGR', 'HRV', 'CYP', 'CZE', 'DNK', 
                   'EST', 'FIN', 'FRA', 'GEO', 'DEU', 'GRC', 'HUN', 'ISL', 'IRL', 'ITA', 'XKX', 'LVA', 'LIE', 
                   'LTU', 'LUX', 'MLT', 'MDA', 'MCO', 'MNE', 'NLD', 'MKD', 'NOR', 'POL', 'PRT', 'ROU', 'RUS', 
                   'SMR', 'SRB', 'SVK', 'SVN', 'ESP', 'SWE', 'CHE', 'UKR', 'GBR', 'VAT'],
        'Asia': ['AFG', 'ARM', 'AZE', 'BHR', 'BGD', 'BTN', 'BRN', 'KHM', 'CHN', 'GEO', 'IND', 'IDN', 'IRN', 
                 'IRQ', 'ISR', 'JPN', 'JOR', 'KAZ', 'KWT', 'KGZ', 'LAO', 'LBN', 'MYS', 'MDV', 'MNG', 'MMR', 
                 'NPL', 'PRK', 'OMN', 'PAK', 'PSE', 'PHL', 'QAT', 'SAU', 'SGP', 'KOR', 'LKA', 'SYR', 'TWN', 
                 'TJK', 'THA', 'TLS', 'TUR', 'TKM', 'ARE', 'UZB', 'VNM', 'YEM'],
        'Africa': ['DZA', 'AGO', 'BEN', 'BWA', 'BFA', 'BDI', 'CMR', 'CPV', 'CAF', 'TCD', 'COM', 'COG', 'COD', 
                   'CIV', 'DJI', 'EGY', 'GNQ', 'ERI', 'ETH', 'GAB', 'GMB', 'GHA', 'GIN', 'GNB', 'KEN', 'LSO', 
                   'LBR', 'LBY', 'MDG', 'MWI', 'MLI', 'MRT', 'MUS', 'MAR', 'MOZ', 'NAM', 'NER', 'NGA', 'RWA', 
                   'STP', 'SEN', 'SYC', 'SLE', 'SOM', 'ZAF', 'SSD', 'SDN', 'SWZ', 'TZA', 'TGO', 'TUN', 'UGA', 
                   'ZMB', 'ZWE'],
        'North America': ['ATG', 'BHS', 'BRB', 'BLZ', 'CAN', 'CRI', 'CUB', 'DMA', 'DOM', 'SLV', 'GRD', 'GTM', 
                          'HTI', 'HND', 'JAM', 'MEX', 'NIC', 'PAN', 'KNA', 'LCA', 'VCT', 'TTO', 'USA'],
        'South America': ['ARG', 'BOL', 'BRA', 'CHL', 'COL', 'ECU', 'GUY', 'PRY', 'PER', 'SUR', 'URY', 'VEN'],
        'Oceania': ['AUS', 'FJI', 'KIR', 'MHL', 'FSM', 'NRU', 'NZL', 'PLW', 'PNG', 'WSM', 'SLB', 'TON', 'TUV', 'VUT']
    };
    
    for (const [region, codes] of Object.entries(regions)) {
        if (codes.includes(countryCode)) {
            return region;
        }
    }
    return 'Other';
}

// Función para verificar si un país está activo según los filtros
function isCountryActive(countryName, countryCode) {
    // Si hay países específicos seleccionados, solo esos están activos
    if (selectedCountries.length > 0) {
        return selectedCountries.includes(countryName) || selectedCountries.includes(countryCode);
    }
    
    // Si no, verificar por región
    if (selectedRegions.includes('all')) {
        return true;
    }
    
    const region = getRegion(countryName, countryCode);
    return selectedRegions.includes(region);
}

// Función para inicializar el control de sonidos
function initializeSoundControl() {
    console.log('Inicializando control de sonidos...');
    const soundToggle = document.getElementById('sound-toggle');
    
    if (!soundToggle) {
        console.error('Botón de sonidos no encontrado');
        return;
    }
    
    console.log('Botón de sonidos encontrado');
    soundToggle.addEventListener('click', function() {
        console.log('Botón de sonidos clickeado. Estado actual:', soundsEnabled);
        
        soundsEnabled = !soundsEnabled;
        console.log('Nuevo estado:', soundsEnabled);
        
        if (soundsEnabled) {
            this.textContent = '🔇 Desactivar Sonidos Interactivos';
            this.style.backgroundColor = '#ef4444';
            this.style.borderColor = '#ef4444';
            initializeAudio();
            console.log('Sonidos activados');
        } else {
            this.textContent = '🔊 Activar Sonidos Interactivos';
            this.style.backgroundColor = '#0ea5e9';
            this.style.borderColor = '#0ea5e9';
            stopAllSounds();
            console.log('Sonidos desactivados');
        }
    });
}

// Función para inicializar el control de sonidos duales
function initializeDualSoundControl() {
    console.log('Inicializando control de sonidos duales...');
    const dualSoundToggle = document.getElementById('dual-sound-toggle');
    
    if (!dualSoundToggle) {
        console.error('Botón de sonidos duales no encontrado');
        return;
    }
    
    console.log('Botón de sonidos duales encontrado');
    dualSoundToggle.addEventListener('click', function() {
        console.log('Botón de sonidos duales clickeado. Estado actual:', dualSoundsEnabled);
        
        dualSoundsEnabled = !dualSoundsEnabled;
        
        if (dualSoundsEnabled) {
            this.style.backgroundColor = '#0ea5e9';
            this.style.borderColor = '#0ea5e9';
            this.textContent = ' Sonidos Superpuestos';
            console.log('Sonidos duales activados');
        } else {
            this.style.backgroundColor = '#6b7280';
            this.style.borderColor = '#6b7280';
            this.textContent = ' Superponer Sonidos';
            console.log('Sonidos duales desactivados');
        }
    });
    
    // Event listener para el botón de deselección
    const deselectBtn = document.getElementById('deselect-country');
    if (deselectBtn) {
        deselectBtn.addEventListener('click', function() {
            deselectCountry();
        });
    }
}

// Función para inicializar el control de mapas en paralelo
function initializeParallelMapsControl() {
    const parallelMapsToggle = document.getElementById('parallel-maps-toggle');
    
    if (!parallelMapsToggle) return;
    
    parallelMapsToggle.addEventListener('click', function() {
        parallelMapsEnabled = !parallelMapsEnabled;
        
        if (parallelMapsEnabled) {
            this.style.backgroundColor = '#0ea5e9';
            this.style.borderColor = '#0ea5e9';
            this.style.color = 'white';
            this.textContent = 'Ocultar Mapas en Paralelo';
            showParallelMaps();
        } else {
            this.style.backgroundColor = 'rgba(14, 165, 233, 0.1)';
            this.style.borderColor = '#0ea5e9';
            this.style.color = '#0ea5e9';
            this.textContent = 'Ver Mapas en Paralelo';
            hideParallelMaps();
        }
    });
}

// Función para mostrar mapas en paralelo
function showParallelMaps() {
    const mainMap = document.getElementById('interactive-map');
    const parallelContainer = document.getElementById('parallel-maps-container');
    
    if (!mainMap || !parallelContainer) return;
    
    // Ocultar el mapa principal
    mainMap.style.display = 'none';
    
    // Mostrar el contenedor de mapas en paralelo
    parallelContainer.style.display = 'block';
    
    // Crear los mapas en paralelo
    createParallelMaps();
}

// Función para ocultar mapas en paralelo
function hideParallelMaps() {
    const mainMap = document.getElementById('interactive-map');
    const parallelContainer = document.getElementById('parallel-maps-container');
    
    if (!mainMap || !parallelContainer) return;
    
    // Mostrar el mapa principal
    mainMap.style.display = 'block';
    
    // Ocultar el contenedor de mapas en paralelo
    parallelContainer.style.display = 'none';
}

// Función para crear los mapas en paralelo
function createParallelMaps() {
    // NO CREAR MAPAS NUEVOS - USAR LOS MAPAS QUE YA EXISTEN
    // Simplemente copiar el contenido del mapa principal a los contenedores de paralelo
    
    const mainMap = document.getElementById('interactive-map');
    if (!mainMap || !mainMap.data) return;
    
    // Obtener los datos del mapa principal
    const mainData = mainMap.data;
    const mainLayout = mainMap.layout;
    
    // Aplicar filtros de región a los datos
    const filteredSpending = healthData.map(d => {
        return isCountryActive(d.Country, d.CODE) ? d.PublicHealthSpendingPerCapita : null;
    });
    
    const filteredLifeExp = healthData.map(d => {
        return isCountryActive(d.Country, d.CODE) ? d.LifeExpectancy : null;
    });
    
    // Crear el mapa de gasto (vista "Gasto en Salud")
    const spendingData = [{
        type: 'choropleth',
        locationmode: 'ISO-3',
        locations: mainData[0].locations,
        z: filteredSpending,
        text: healthData.map(d => d.Country),
        colorscale: mainData[0].colorscale,
        zmin: 0,
        zmax: 12000,
        colorbar: {
            title: 'Gasto Per Cápita ($)',
            thickness: 20
        },
        hovertemplate: '<b>%{text}</b><br>Gasto: $%{z}<extra></extra>'
    }];
    
    // Crear el mapa de esperanza de vida (vista "Esperanza de Vida")
    const lifeExpData = [{
        type: 'choropleth',
        locationmode: 'ISO-3',
        locations: mainData[0].locations,
        z: filteredLifeExp,
        text: healthData.map(d => d.Country),
        colorscale: [
            [0, '#f0f9ff'],  // Azul muy claro
            [0.5, '#fbbf24'], // Amarillo
            [1, '#dc2626']    // Rojo
        ],
        zmin: 50,
        zmax: 90,
        colorbar: {
            title: 'Años',
            thickness: 20
        },
        hovertemplate: '<b>%{text}</b><br>Esperanza de Vida: %{z} años<extra></extra>'
    }];
    
    // Usar el mismo layout que el mapa principal pero con fondo blanco
    const layout = {
        geo: {
            ...mainLayout.geo,
            bgcolor: 'white',
            showframe: true,
            framecolor: '#d1d5db',
            framewidth: 1
        },
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        margin: { t: 0, b: 0, l: 0, r: 0 },
        autosize: true,
        width: null,
        height: 400
    };
    
    const config = {
        displayModeBar: false,
        staticPlot: false,
        scrollZoom: false,
        doubleClick: false,
        showTips: false
    };
    
    // Crear los mapas usando los mismos datos que el mapa principal
    Promise.all([
        Plotly.newPlot('spending-map', spendingData, layout, config),
        Plotly.newPlot('life-expectancy-map', lifeExpData, layout, config)
    ]).then(() => {
        // Asegurar que ambos mapas tengan el mismo tamaño
        Plotly.Plots.resize('spending-map');
        Plotly.Plots.resize('life-expectancy-map');
        
        // Agregar interacciones al mapa de gasto
        const spendingMapDiv = document.getElementById('spending-map');
        if (spendingMapDiv) {
            spendingMapDiv.on('plotly_hover', function(eventData) {
                const point = eventData.points[0];
                const countryIndex = point.pointIndex;
                const countrySpending = healthData[countryIndex].PublicHealthSpendingPerCapita;
                const countryLifeExp = healthData[countryIndex].LifeExpectancy;
                const countryName = healthData[countryIndex].Country;
                
                // Inicializar audio si es la primera interacción
                initializeAudio();
                
                // Resaltar barra en el gráfico de barras
                highlightBarInChart(countryName);
                
                // Reproducir solo sonidos de gasto para el mapa de gasto
                if (soundsEnabled) {
                    const maxSpending = Math.max(...healthData.map(d => d.PublicHealthSpendingPerCapita));
                    playCoinsSound(countrySpending, maxSpending, countryName);
                }
            });
            
            spendingMapDiv.on('plotly_unhover', function() {
                if (!selectedCountry) {
                    stopAllSounds();
                    removeBarHighlight();
                }
            });
            
            // Agregar click para destacar país en el gráfico de barras
            spendingMapDiv.on('plotly_click', function(eventData) {
                const point = eventData.points[0];
                const countryIndex = point.pointIndex;
                const countryName = healthData[countryIndex].Country;
                
                // Destacar el país seleccionado
                selectedCountry = countryName;
                highlightBarInChart(countryName);
                
                // Reproducir sonido si está habilitado
                if (soundsEnabled) {
                    const countrySpending = healthData[countryIndex].PublicHealthSpendingPerCapita;
                    const maxSpending = Math.max(...healthData.map(d => d.PublicHealthSpendingPerCapita));
                    playCoinsSound(countrySpending, maxSpending, countryName);
                }
            });
        }
        
        // Agregar interacciones al mapa de esperanza de vida
        const lifeExpMapDiv = document.getElementById('life-expectancy-map');
        if (lifeExpMapDiv) {
            lifeExpMapDiv.on('plotly_hover', function(eventData) {
                const point = eventData.points[0];
                const countryIndex = point.pointIndex;
                const countrySpending = healthData[countryIndex].PublicHealthSpendingPerCapita;
                const countryLifeExp = healthData[countryIndex].LifeExpectancy;
                const countryName = healthData[countryIndex].Country;
                
                // Inicializar audio si es la primera interacción
                initializeAudio();
                
                // Resaltar barra en el gráfico de barras
                highlightBarInChart(countryName);
                
                // Reproducir solo pitidos de esperanza de vida para el mapa de esperanza de vida
                if (soundsEnabled) {
                    const minLife = Math.min(...healthData.map(d => d.LifeExpectancy));
                    const maxLife = Math.max(...healthData.map(d => d.LifeExpectancy));
                    playBeepSound(countryLifeExp, minLife, maxLife);
                }
            });
            
            lifeExpMapDiv.on('plotly_unhover', function() {
                if (!selectedCountry) {
                    stopAllSounds();
                    removeBarHighlight();
                }
            });
            
            // Agregar click para destacar país en el gráfico de barras
            lifeExpMapDiv.on('plotly_click', function(eventData) {
                const point = eventData.points[0];
                const countryIndex = point.pointIndex;
                const countryName = healthData[countryIndex].Country;
                
                // Destacar el país seleccionado
                selectedCountry = countryName;
                highlightBarInChart(countryName);
                
                // Reproducir sonido si está habilitado
                if (soundsEnabled) {
                    const countryLifeExp = healthData[countryIndex].LifeExpectancy;
                    const minLife = Math.min(...healthData.map(d => d.LifeExpectancy));
                    const maxLife = Math.max(...healthData.map(d => d.LifeExpectancy));
                    playBeepSound(countryLifeExp, minLife, maxLife);
                }
            });
        }
    });
}

// Función para resaltar barra en el gráfico de barras
function highlightBarInChart(countryName) {
    if (!barChartData) return;
    
    const countryIndex = barChartData.paisesOrdenados.indexOf(countryName);
    if (countryIndex === -1) return;
    
    // Crear colores actualizados
    const newColors = [...barChartData.coloresBarras];
    newColors[countryIndex] = 'rgba(255, 0, 0, 0.9)'; // Rojo para resaltar
    
    // Crear anotación con flecha apuntando al país
    const annotation = {
        x: countryName,
        y: barChartData.gastoOrdenado[countryIndex],
        xref: 'x',
        yref: 'y',
        text: countryName,
        showarrow: true,
        arrowhead: 2,
        arrowsize: 1,
        arrowwidth: 2,
        ax: 0,
        ay: -40,
        font: {
            color: '#dc2626',
            size: 12,
            family: 'Arial, sans-serif'
        },
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        bordercolor: '#dc2626',
        borderwidth: 1,
        borderpad: 4
    };
    
    // Actualizar el gráfico con colores y anotación
    Plotly.restyle('grafico', {
        'marker.color': [newColors]
    });
    
    // Agregar la anotación
    Plotly.relayout('grafico', {
        annotations: [annotation]
    });
    
    currentHighlightedCountry = countryName;
}

// Función para quitar el resaltado
function removeBarHighlight() {
    if (!barChartData || !currentHighlightedCountry) return;
    
    const countryIndex = barChartData.paisesOrdenados.indexOf(currentHighlightedCountry);
    if (countryIndex === -1) return;
    
    // Restaurar colores originales
    const originalColors = [...barChartData.coloresBarras];
    
    // Actualizar colores y eliminar anotaciones
    Plotly.restyle('grafico', {
        'marker.color': [originalColors]
    });
    
    // Eliminar todas las anotaciones
    Plotly.relayout('grafico', {
        annotations: []
    });
    
    currentHighlightedCountry = null;
}

// Función para reproducir sonidos sincronizados
function playSynchronizedSounds(countryName, countrySpending, countryLifeExp) {
    console.log('playSynchronizedSounds llamado:', {soundsEnabled, countryName});
    
    if (!soundsEnabled) {
        console.log('Sonidos desactivados, no reproduciendo');
        return;
    }
    
    // Detener sonidos anteriores antes de reproducir nuevos
    stopAllSounds();
    
    // Calcular valores máximos y mínimos para normalización
    const maxSpending = Math.max(...healthData.map(d => d.PublicHealthSpendingPerCapita));
    const minLife = Math.min(...healthData.map(d => d.LifeExpectancy).filter(l => l > 0));
    const maxLife = Math.max(...healthData.map(d => d.LifeExpectancy));
    
    console.log('Reproduciendo sonidos para:', countryName);
    
    // Reproducir sonidos según el modo actual (solo para mapas)
    if (currentView === 'spending') {
        playCoinsSound(countrySpending, maxSpending, countryName);
    } else if (currentView === 'lifeExpectancy') {
        playBeepSound(countryLifeExp, minLife, maxLife);
    } else {
        // Reproducir ambos sonidos superpuestos
        playCoinsSound(countrySpending, maxSpending, countryName);
        playBeepSound(countryLifeExp, minLife, maxLife);
    }
}

// Función para reproducir sonidos del gráfico de barras (con lógica de superposición)
function playBarChartSounds(countryName, countrySpending, countryLifeExp) {
    console.log('playBarChartSounds llamado:', {soundsEnabled, dualSoundsEnabled, countryName});
    
    if (!soundsEnabled) {
        console.log('Sonidos desactivados, no reproduciendo');
        return;
    }
    
    // Detener sonidos anteriores antes de reproducir nuevos
    stopAllSounds();
    
    // Calcular valores máximos y mínimos para normalización
    const maxSpending = Math.max(...healthData.map(d => d.PublicHealthSpendingPerCapita));
    const minLife = Math.min(...healthData.map(d => d.LifeExpectancy).filter(l => l > 0));
    const maxLife = Math.max(...healthData.map(d => d.LifeExpectancy));
    
    console.log('Reproduciendo sonidos para gráfico de barras:', countryName);
    
    if (dualSoundsEnabled) {
        // Si los sonidos duales están activados, reproducir ambos sonidos superpuestos
        console.log(' Modo dual activado - reproduciendo ambos sonidos superpuestos');
        playCoinsSound(countrySpending, maxSpending, countryName);
        playBeepSound(countryLifeExp, minLife, maxLife);
    } else {
        // Si no, reproducir según el modo actual del mapa
        if (currentView === 'spending') {
            console.log('💰 Reproduciendo solo monedas');
            playCoinsSound(countrySpending, maxSpending, countryName);
        } else if (currentView === 'lifeExpectancy') {
            console.log('🔊 Reproduciendo solo pitidos');
            playBeepSound(countryLifeExp, minLife, maxLife);
        } else {
            console.log(' Reproduciendo ambos sonidos (fallback)');
            playCoinsSound(countrySpending, maxSpending, countryName);
            playBeepSound(countryLifeExp, minLife, maxLife);
        }
    }
}

// Función para resaltar país en el mapa
function highlightCountryInMap(countryName) {
    const mapDiv = document.getElementById('interactive-map');
    if (!mapDiv || !mapDiv.data) return;
    
    // Encontrar el índice del país en los datos del mapa
    const countryIndex = healthData.findIndex(d => d.Country === countryName);
    if (countryIndex === -1) return;
    
    // Crear colores actualizados para el mapa
    const countries = healthData.map(d => d.CODE);
    const spending = healthData.map(d => d.PublicHealthSpendingPerCapita);
    const lifeExp = healthData.map(d => d.LifeExpectancy);
    
    // Determinar qué datos usar según la vista actual
    let sourceData;
    if (currentView === 'spending') {
        sourceData = spending;
    } else if (currentView === 'lifeExpectancy') {
        sourceData = lifeExp;
    } else {
        sourceData = spending;
    }
    
    // Crear array con valores null para países inactivos, excepto el seleccionado
    const newZ = sourceData.map((value, i) => {
        if (i === countryIndex) {
            return value; // Mostrar el país seleccionado
        }
        // Si hay un país seleccionado permanentemente, mostrarlo también
        if (selectedCountry && healthData[i].Country === selectedCountry) {
            return sourceData[i];
        }
        return isCountryActive(healthData[i].Country, countries[i]) ? value : null;
    });
    
    // Aplicar zoom según la región seleccionada
    const geoUpdate = getRegionZoom();
    
    Plotly.update('interactive-map', {
        z: [newZ]
    }, {
        geo: geoUpdate
    });
}

// Función para quitar el resaltado del mapa
function removeMapHighlight() {
    updateMap(); // Usar la función existente para restaurar el estado normal
}

// Función para seleccionar un país permanentemente
function selectCountry(countryName) {
    selectedCountry = countryName;
    console.log('País seleccionado:', countryName);
    
    // Mostrar botón de deselección
    const deselectBtn = document.getElementById('deselect-country');
    if (deselectBtn) {
        deselectBtn.style.display = 'inline-block';
        deselectBtn.textContent = `❌ Deseleccionar ${countryName}`;
    }
    
    // Resaltar en el mapa
    highlightCountryInMap(countryName);
    
    // Resaltar en el gráfico de barras
    highlightBarInChart(countryName);
    
    // Reproducir sonidos si están activados
    if (soundsEnabled) {
        const countryData = healthData.find(d => d.Country === countryName);
        if (countryData) {
            if (currentView === 'spending') {
                playSynchronizedSounds(countryName, countryData.PublicHealthSpendingPerCapita, countryData.LifeExpectancy);
            } else if (currentView === 'lifeExpectancy') {
                playSynchronizedSounds(countryName, countryData.PublicHealthSpendingPerCapita, countryData.LifeExpectancy);
            }
        }
    }
}

// Función para deseleccionar el país actual
function deselectCountry() {
    if (selectedCountry) {
        console.log('Deseleccionando país:', selectedCountry);
        selectedCountry = null;
        
        // Ocultar botón de deselección
        const deselectBtn = document.getElementById('deselect-country');
        if (deselectBtn) {
            deselectBtn.style.display = 'none';
        }
        
        // Restaurar el mapa
        updateMap();
        
        // Quitar resaltado del gráfico de barras
        removeBarHighlight();
        
        // Detener sonidos
        stopAllSounds();
    }
}

// Función para inicializar los filtros
function initializeFilters() {
    // Filtros de región (excluir el botón de sonidos)
    const filterButtons = document.querySelectorAll('.filter-btn[data-region]');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const region = this.dataset.region;
            
            if (region === 'all') {
                selectedRegions = ['all'];
                selectedCountries = [];
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            } else {
                // Remover 'all'
                filterButtons[0].classList.remove('active');
                
                if (selectedRegions.includes('all')) {
                    selectedRegions = [];
                }
                
                // Toggle región
                if (selectedRegions.includes(region)) {
                    selectedRegions = selectedRegions.filter(r => r !== region);
                    this.classList.remove('active');
                } else {
                    selectedRegions.push(region);
                    this.classList.add('active');
                }
                
                // Si no hay regiones, volver a all
                if (selectedRegions.length === 0) {
                    selectedRegions = ['all'];
                    filterButtons[0].classList.add('active');
                }
            }
            
            updateMap();
        });
    });
    
    // Búsqueda de países
    const countrySearch = document.getElementById('country-search');
    const countrySuggestions = document.getElementById('country-suggestions');
    
    countrySearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm.length === 0) {
            countrySuggestions.style.display = 'none';
            return;
        }
        
        const matches = healthData.filter(d => 
            d.Country.toLowerCase().includes(searchTerm)
        ).slice(0, 10);
        
        if (matches.length > 0) {
            countrySuggestions.innerHTML = matches.map(d => 
                `<div class="country-suggestion" data-country="${d.Country}" data-code="${d.CODE}">
                    ${d.Country}
                </div>`
            ).join('');
            countrySuggestions.style.display = 'block';
            
            // Agregar eventos a las sugerencias
            document.querySelectorAll('.country-suggestion').forEach(suggestion => {
                suggestion.addEventListener('click', function() {
                    const country = this.dataset.country;
                    const code = this.dataset.code;
                    
                    // Cambiar automáticamente el filtro de regiones a "Todas"
                    selectedRegions = ['all'];
                    
                    // Actualizar la apariencia de los botones de filtro
                    const filterButtons = document.querySelectorAll('.filter-btn[data-region]');
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    filterButtons[0].classList.add('active'); // Botón "Todas"
                    
                    if (!selectedCountries.includes(country)) {
                        selectedCountries.push(country);
                        updateSelectedCountries();
                        updateMap();
                    }
                    
                    countrySearch.value = '';
                    countrySuggestions.style.display = 'none';
                });
            });
        } else {
            countrySuggestions.style.display = 'none';
        }
    });
    
    // Cerrar sugerencias al hacer click fuera
    document.addEventListener('click', function(e) {
        if (!countrySearch.contains(e.target) && !countrySuggestions.contains(e.target)) {
            countrySuggestions.style.display = 'none';
        }
    });
}

function updateSelectedCountries() {
    const container = document.getElementById('selected-countries');
    container.innerHTML = selectedCountries.map(country => 
        `<div class="selected-country-tag">
            <span>${country}</span>
            <span class="remove-country" data-country="${country}">×</span>
        </div>`
    ).join('');
    
    // Agregar eventos para remover
    document.querySelectorAll('.remove-country').forEach(btn => {
        btn.addEventListener('click', function() {
            const country = this.dataset.country;
            selectedCountries = selectedCountries.filter(c => c !== country);
            updateSelectedCountries();
            updateMap();
        });
    });
}

function updateMap() {
    // Actualizar el mapa con los filtros aplicados
    const mapDiv = document.getElementById('interactive-map');
    if (!mapDiv || !mapDiv.data) return;
    
    const countries = healthData.map(d => d.CODE);
    const countryNames = healthData.map(d => d.Country);
    const spending = healthData.map(d => d.PublicHealthSpendingPerCapita);
    const lifeExp = healthData.map(d => d.LifeExpectancy);
    
    // Calcular eficiencia
    const sortedLife = [...lifeExp].filter(l => l > 0).sort((a, b) => a - b);
    const sortedSpending = [...spending].filter(s => s > 0).sort((a, b) => a - b);
    const medianLife = sortedLife[Math.floor(sortedLife.length / 2)];
    const medianSpending = sortedSpending[Math.floor(sortedSpending.length / 2)];
    
    const efficiency = healthData.map(d => {
        const lifeDiff = d.LifeExpectancy - medianLife;
        const spendingDiff = d.PublicHealthSpendingPerCapita - medianSpending;
        return lifeDiff - (spendingDiff * 0.001);
    });
    
    // Determinar qué datos usar según la vista actual
    let sourceData;
    if (currentView === 'spending') {
        sourceData = spending;
    } else if (currentView === 'lifeExpectancy') {
        sourceData = lifeExp;
    } else {
        sourceData = spending; // Fallback a spending si no es válido
    }
    
    // Crear nuevo array con valores null para países inactivos
    const newZ = sourceData.map((value, i) => {
        return isCountryActive(countryNames[i], countries[i]) ? value : null;
    });
    
    // Aplicar zoom según la región seleccionada
    const geoUpdate = getRegionZoom();
    
    Plotly.update('interactive-map', {
        z: [newZ]
    }, {
        geo: geoUpdate
    });
    
    // Si los mapas en paralelo están activos, actualizarlos también
    if (parallelMapsEnabled) {
        updateParallelMaps();
    }
}

// Función para actualizar los mapas en paralelo con los filtros aplicados
function updateParallelMaps() {
    if (!parallelMapsEnabled) return;
    
    const countries = healthData.map(d => d.CODE);
    const countryNames = healthData.map(d => d.Country);
    const spending = healthData.map(d => d.PublicHealthSpendingPerCapita);
    const lifeExp = healthData.map(d => d.LifeExpectancy);
    
    // Aplicar filtros de región a los datos
    const filteredSpending = spending.map((value, i) => {
        return isCountryActive(countryNames[i], countries[i]) ? value : null;
    });
    
    const filteredLifeExp = lifeExp.map((value, i) => {
        return isCountryActive(countryNames[i], countries[i]) ? value : null;
    });
    
    // Aplicar zoom según la región seleccionada
    const geoUpdate = getRegionZoom();
    
    // Actualizar ambos mapas en paralelo
    Plotly.update('spending-map', {
        z: [filteredSpending]
    }, {
        geo: geoUpdate
    });
    
    Plotly.update('life-expectancy-map', {
        z: [filteredLifeExp]
    }, {
        geo: geoUpdate
    });
    
    // Asegurar que ambos mapas mantengan el mismo tamaño
    Plotly.Plots.resize('spending-map');
    Plotly.Plots.resize('life-expectancy-map');
}

function getRegionZoom() {
    // Coordenadas de zoom por región (ajustadas para mostrar correctamente cada región)
    const regionCoords = {
        'Europe': { 
            center: { lon: 15, lat: 50 },
            lonaxis: { range: [-15, 45] },
            lataxis: { range: [35, 70] }
        },
        'Asia': { 
            center: { lon: 100, lat: 30 },
            lonaxis: { range: [50, 180] },
            lataxis: { range: [-15, 60] }
        },
        'Africa': { 
            center: { lon: 20, lat: 0 },
            lonaxis: { range: [-25, 55] },
            lataxis: { range: [-40, 40] }
        },
        'North America': { 
            center: { lon: -100, lat: 50 },
            lonaxis: { range: [-180, -50] },
            lataxis: { range: [15, 75] }
        },
        'South America': { 
            center: { lon: -60, lat: -25 },
            lonaxis: { range: [-85, -35] },
            lataxis: { range: [-65, 15] }
        },
        'Oceania': { 
            center: { lon: 140, lat: -25 },
            lonaxis: { range: [110, 180] },
            lataxis: { range: [-50, 5] }
        }
    };
    
    // Si hay países específicos seleccionados, no hacer zoom
    if (selectedCountries.length > 0) {
        return { 
            projection: { type: 'natural earth' },
            scope: 'world'
        };
    }
    
    // Si "all" está seleccionado, vista mundial
    if (selectedRegions.includes('all') || selectedRegions.length === 0) {
        return { 
            projection: { type: 'natural earth' },
            scope: 'world'
        };
    }
    
    // Si hay una sola región, hacer zoom a ella
    if (selectedRegions.length === 1) {
        const region = selectedRegions[0];
        if (regionCoords[region]) {
            return { 
                projection: { type: 'natural earth' },
                ...regionCoords[region]
            };
        }
    }
    
    // Si hay múltiples regiones, calcular zoom combinado
    if (selectedRegions.length > 1) {
        return calculateMultiRegionZoom(selectedRegions, regionCoords);
    }
    
    // Fallback a vista mundial
    return { 
        projection: { type: 'natural earth' },
        scope: 'world'
    };
}

function calculateMultiRegionZoom(regions, regionCoords) {
    // Calcular el centro y rangos combinados de múltiples regiones
    let minLon = 180, maxLon = -180, minLat = 90, maxLat = -90;
    
    regions.forEach(region => {
        if (regionCoords[region]) {
            const coords = regionCoords[region];
            if (coords.lonaxis && coords.lataxis) {
                minLon = Math.min(minLon, coords.lonaxis.range[0]);
                maxLon = Math.max(maxLon, coords.lonaxis.range[1]);
                minLat = Math.min(minLat, coords.lataxis.range[0]);
                maxLat = Math.max(maxLat, coords.lataxis.range[1]);
            }
        }
    });
    
    // Calcular el centro
    const centerLon = (minLon + maxLon) / 2;
    const centerLat = (minLat + maxLat) / 2;
    
    // Ajustar rangos para incluir un poco de margen
    const lonMargin = (maxLon - minLon) * 0.1;
    const latMargin = (maxLat - minLat) * 0.1;
    
    return {
        projection: { type: 'natural earth' },
        center: { lon: centerLon, lat: centerLat },
        lonaxis: { 
            range: [minLon - lonMargin, maxLon + lonMargin] 
        },
        lataxis: { 
            range: [minLat - latMargin, maxLat + latMargin] 
        }
    };
}

// Cargar datos y actualizar variables globales
fetch('health_data.json')
	.then(response => response.json())
	.then(json => {
		healthData = json;
		console.log('Datos cargados:', healthData.length, 'países');
	})
    // Llamar a funciones para crear los mapas
    .then(() => {
        console.log('Creando mapa interactivo...');
        return createInteractiveMap();
    })
    .then(() => {
        console.log('Creando gráfico de dispersión...');
        return createCorrelationMap();
    })
    .then(() => {
        console.log('Creando gráfico de barras...');
        return graficar();
    })
    .then(() => {
        console.log('Inicializando filtros...');
        return initializeFilters();
    })
    .then(() => {
        console.log('Inicializando control de sonidos...');
        return initializeSoundControl();
    })
    .then(() => {
        console.log('Inicializando control de sonidos duales...');
        return initializeDualSoundControl();
    })
    .then(() => {
        console.log('Inicializando control de mapas en paralelo...');
        return initializeParallelMapsControl();
    })
    .catch(error => {
        console.error('Error en la inicialización:', error);
    });


// Función para actualizar el título del mapa
function updateMapTitle() {
    const mapDiv = document.getElementById('interactive-map');
    if (!mapDiv) return;
    
    let titleText;
    if (currentView === 'spending') {
        titleText = 'Gasto Público en Salud Per Cápita por País';
    } else if (currentView === 'lifeExpectancy') {
        titleText = 'Esperanza de Vida por País';
    } else {
        titleText = 'Gasto Público en Salud Per Cápita por País';
    }
    
    Plotly.relayout('interactive-map', {
        title: {
            text: titleText,
            font: { size: 20 }
        }
    });
}

function createInteractiveMap(){
    // Mapa interactivo con selector de parámetros
    
    const countries = healthData.map(d => d.CODE);
    const countryNames = healthData.map(d => d.Country);
    const spending = healthData.map(d => d.PublicHealthSpendingPerCapita);
    const lifeExp = healthData.map(d => d.LifeExpectancy);
    
    // Calcular eficiencia
    const sortedLife = [...lifeExp].filter(l => l > 0).sort((a, b) => a - b);
    const sortedSpending = [...spending].filter(s => s > 0).sort((a, b) => a - b);
    const medianLife = sortedLife[Math.floor(sortedLife.length / 2)];
    const medianSpending = sortedSpending[Math.floor(sortedSpending.length / 2)];
    
    const efficiency = healthData.map(d => {
        const lifeDiff = d.LifeExpectancy - medianLife;
        const spendingDiff = d.PublicHealthSpendingPerCapita - medianSpending;
        return lifeDiff - (spendingDiff * 0.001);
    });
    
    // Crear datos para cada parámetro
    const data = [{
        type: 'choropleth',
        locationmode: 'ISO-3',
        locations: countries,
        z: spending, // Por defecto mostrar gasto
        text: countryNames,
        colorscale: [
            [0, '#f0f9ff'],
            [0.5, '#fbbf24'],
            [1, '#dc2626']
        ],
        zmin: 0,
        zmax: 12000, // Escala completa para distinguir gastos altos
        colorbar: {
            title: 'Gasto Per Cápita ($)',
            thickness: 20
        },
        hovertemplate: '<b>%{text}</b><br>Gasto: $%{z}<extra></extra>'
    }];
    
    const layout = {
        title: {
            text: 'Gasto Público en Salud Per Cápita por País',
            font: { size: 20 }
        },
        geo: {
            projection: {
                type: 'natural earth'
            },
            showframe: false,
            showcoastlines: true,
            showland: true,
            showocean: true,
            oceancolor: '#f0f9ff',
            landcolor: '#f5f5f5',
            coastlinecolor: '#d1d5db',
            lonaxis: {
                range: [-180, 180]
            },
            lataxis: {
                range: [-60, 85]
            },
            uirevision: 'static'
        },
        margin: { t: 50, b: 10, l: 10, r: 10 },
        height: 400,
        dragmode: false,
        updatemenus: [{
            type: 'buttons',
            direction: 'up',
            x: 0.1,
            y: 1.02,
            showactive: true,
            buttons: [
                {
                    label: 'Gasto en Salud',
                    method: 'restyle',
                    args: [
                        {
                            z: [spending],
                            zmin: 0,
                            zmax: 12000,
                            'colorbar.title': 'Gasto Per Cápita ($)',
                            'hovertemplate': '<b>%{text}</b><br>Gasto: $%{z}<extra></extra>'
                        }
                    ]
                },
                {
                    label: 'Esperanza de Vida',
                    method: 'restyle',
                    args: [
                        {
                            z: [lifeExp],
                            zmin: 50,
                            zmax: 90,
                            'colorbar.title': 'Años',
                            'hovertemplate': '<b>%{text}</b><br>Esperanza de Vida: %{z} años<extra></extra>'
                        }
                    ]
                }
            ]
        }]
    };
    
    const config = {
        displayModeBar: false,
        staticPlot: false,
        scrollZoom: false,
        doubleClick: false,
        showTips: false
    };
    
    Plotly.newPlot('interactive-map', data, layout, config).then(() => {
        const mapDiv = document.getElementById('interactive-map');
        
        // Calcular valores máximos y mínimos para normalización
        const maxSpending = Math.max(...spending);
        const minLife = Math.min(...lifeExp.filter(l => l > 0));
        const maxLife = Math.max(...lifeExp);
        
        // Event listener para hover
        mapDiv.on('plotly_hover', function(eventData) {
            const point = eventData.points[0];
            const countryIndex = point.pointIndex;
            const countrySpending = spending[countryIndex];
            const countryLifeExp = lifeExp[countryIndex];
            const countryName = countryNames[countryIndex];
            const countryCode = countries[countryIndex];
            
            // Inicializar audio si es la primera interacción
            initializeAudio();
            
            // Solo reproducir sonidos si el país está activo
            if (!isCountryActive(countryName, countryCode)) {
                return;
            }
            
            // Resaltar barra en el gráfico de barras
            highlightBarInChart(countryName);
            
            // Reproducir sonidos sincronizados
            playSynchronizedSounds(countryName, countrySpending, countryLifeExp);
        });
        
        // Event listener para unhover (cuando se sale del país)
        mapDiv.on('plotly_unhover', function() {
            // Solo detener sonidos y quitar resaltado si no hay país seleccionado
            if (!selectedCountry) {
            stopAllSounds();
                removeBarHighlight();
            }
        });
        
        // Event listener para click (selección permanente)
        mapDiv.on('plotly_click', function(eventData) {
            const point = eventData.points[0];
            const countryIndex = point.pointIndex;
            const countryName = countryNames[countryIndex];
            const countryCode = countries[countryIndex];
            
            // Solo permitir selección si el país está activo
            if (!isCountryActive(countryName, countryCode)) {
                return;
            }
            
            // Si ya está seleccionado, deseleccionar
            if (selectedCountry === countryName) {
                deselectCountry();
            } else {
                // Seleccionar el nuevo país
                selectCountry(countryName);
            }
        });
        
        // Event listeners para detectar cambio de vista mediante los botones
        mapDiv.on('plotly_restyle', function(data) {
            stopAllSounds(); // Detener sonidos al cambiar de vista
            
            // Actualizar el modo actual basado en el botón presionado
            // Esto se detecta viendo qué datos se muestran ahora
            setTimeout(() => {
                const currentZ = mapDiv.data[0].z;
                if (JSON.stringify(currentZ) === JSON.stringify(spending)) {
                    currentView = 'spending';
                } else if (JSON.stringify(currentZ) === JSON.stringify(lifeExp)) {
                    currentView = 'lifeExpectancy';
                }
                
                // Actualizar el título del mapa
                updateMapTitle();
                
                // Reaplicar filtros después de cambiar de vista
                updateMap();
            }, 100);
        });
    });
}

function createCorrelationMap(){
    // Gráfico de dispersión: Esperanza de Vida vs Gasto (ejes invertidos)
    
    const spending = healthData.map(d => d.PublicHealthSpendingPerCapita);
    const lifeExp = healthData.map(d => d.LifeExpectancy);
    const countryNames = healthData.map(d => d.Country);
    
    // Filtrar datos válidos para la regresión (sin valores 0)
    const validData = healthData.filter(d => d.PublicHealthSpendingPerCapita > 0);
    const validLifeExp = validData.map(d => d.LifeExpectancy);
    const validSpending = validData.map(d => d.PublicHealthSpendingPerCapita);
    const logSpending = validSpending.map(s => Math.log10(s));
    
    // Calcular regresión lineal (Life expectancy vs log(spending))
    const n = validLifeExp.length;
    const sumX = validLifeExp.reduce((a, b) => a + b, 0);
    const sumY = logSpending.reduce((a, b) => a + b, 0);
    const sumXY = validLifeExp.reduce((sum, x, i) => sum + x * logSpending[i], 0);
    const sumX2 = validLifeExp.reduce((sum, x) => sum + x * x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Generar puntos para la línea de regresión
    const minLife = Math.min(...validLifeExp);
    const maxLife = Math.max(...validLifeExp);
    const lineX = [];
    const lineY = [];
    for (let i = 0; i <= 100; i++) {
        const x = minLife + (maxLife - minLife) * i / 100;
        lineX.push(x);
        lineY.push(Math.pow(10, slope * x + intercept));
    }
    
    const data = [
        {
            x: lifeExp,
            y: spending,
            mode: 'markers',
            type: 'scatter',
            name: 'Países',
            text: countryNames,
            marker: {
                size: 8,
                color: spending,
                colorscale: 'Viridis',
                showscale: true,
                colorbar: {
                    title: 'Gasto $'
                }
            },
            hovertemplate: '<b>%{text}</b><br>Esperanza de Vida: %{x} años<br>Gasto: $%{y}<extra></extra>'
        },
        {
            x: lineX,
            y: lineY,
            mode: 'lines',
            type: 'scatter',
            name: 'Ajuste Lineal',
            line: {
                color: 'red',
                width: 2,
                dash: 'dash'
            },
            hovertemplate: 'Tendencia<extra></extra>'
        }
    ];
    
    const layout = {
        title: {
            text: 'Relación: Esperanza de Vida vs Gasto Público en Salud',
            font: { size: 18 }
        },
        xaxis: {
            title: 'Esperanza de Vida (años)'
        },
        yaxis: {
            title: 'Gasto Público en Salud Per Cápita ($)',
            type: 'log'
        },
        hovermode: 'closest',
        showlegend: true,
        margin: { t: 60, b: 60, l: 60, r: 20 }
    };
    
    Plotly.newPlot('scatter', data, layout).then(() => {
        const scatterDiv = document.getElementById('scatter');
        
        // Event listener para hover en el gráfico de dispersión
        scatterDiv.on('plotly_hover', function(eventData) {
            const point = eventData.points[0];
            const countryName = point.text;
            
            if (countryName) {
                // Resaltar barra en el gráfico de barras
                highlightBarInChart(countryName);
                
                // Obtener datos del país para sonidos
                const countryData = healthData.find(d => d.Country === countryName);
                if (countryData) {
                    playSynchronizedSounds(countryName, countryData.PublicHealthSpendingPerCapita, countryData.LifeExpectancy);
                }
            }
        });
        
        // Event listener para unhover en el gráfico de dispersión
        scatterDiv.on('plotly_unhover', function() {
            // Solo detener sonidos y quitar resaltado si no hay país seleccionado
            if (!selectedCountry) {
                stopAllSounds();
                removeBarHighlight();
            }
        });
        
        // Event listener para click en el gráfico de dispersión (selección permanente)
        scatterDiv.on('plotly_click', function(eventData) {
            const point = eventData.points[0];
            const countryName = point.text;
            
            if (countryName) {
                // Si ya está seleccionado, deseleccionar
                if (selectedCountry === countryName) {
                    deselectCountry();
                } else {
                    // Seleccionar el nuevo país
                    selectCountry(countryName);
                }
            }
        });
    });
}


// Función para crear el nuevo gráfico de barras
function graficar() {
    console.log('=== INICIANDO FUNCIÓN GRAFICAR ===');
    console.log('healthData disponible:', !!healthData);
    console.log('healthData length:', healthData ? healthData.length : 'undefined');
    
    if (!healthData || healthData.length === 0) {
        console.error('ERROR: No hay datos disponibles');
        return;
    }
    
    // Filtrar y mapear datos relevantes
    const paises = healthData.map(d => d["Country"].trim());
    const esperanzaVida = healthData.map(d => Number(d["LifeExpectancy"]));
    const gastoPerCápita = healthData.map(d => Number(d["PublicHealthSpendingPerCapita"]));
    
    console.log('Datos procesados:', paises.length, 'países');
    console.log('Primeros 5 países:', paises.slice(0, 5));
    const eficiencia = healthData.map(d => {
        const lifeDiff = d["LifeExpectancy"] - 75; // Mediana aproximada
        const spendingDiff = d["PublicHealthSpendingPerCapita"] - 2000; // Mediana aproximada
        return lifeDiff - (spendingDiff * 0.001);
    });
    
    // Ordenar por esperanza de vida
    const orden = esperanzaVida
        .map((ev, i) => ({ev, i}))
        .sort((a, b) => a.ev - b.ev)
        .map(obj => obj.i);

    const paisesOrdenados = orden.map(i => paises[i]);
    const esperanzaOrdenada = orden.map(i => esperanzaVida[i]);
    const gastoOrdenado = orden.map(i => gastoPerCápita[i]);
    const eficienciaOrdenada = orden.map(i => eficiencia[i]);
    
    // Colores uniformes para todas las barras
    const colorDefault = 'rgba(55,128,191,0.7)';
    const coloresBarras = paisesOrdenados.map(p => colorDefault);
    
    // Guardar datos para sincronización
    barChartData = {
        paisesOrdenados,
        esperanzaOrdenada,
        gastoOrdenado,
        coloresBarras
    };
    

    // Rangos personalizados
    const rangos = [60, 65, 75, 80, 85];
    // Buscar el índice del país más cercano a cada rango
    const tickIndices = rangos.map(rango => {
        let minDiff = Infinity;
        let idx = 0;
        esperanzaOrdenada.forEach((ev, i) => {
            const diff = Math.abs(ev - rango);
            if (diff < minDiff) {
                minDiff = diff;
                idx = i;
            }
        });
        return idx;
    });

    // Usar los nombres de los países en esos índices como etiquetas
    const tickvals = tickIndices.map(i => paisesOrdenados[i]);
    const ticktext = rangos.map(r => r.toString());

    // Gráfico de barras
    const barras = {
        x: paisesOrdenados,
        y: gastoOrdenado,
        type: 'bar',
        marker: {color: coloresBarras},
        name: 'Gasto Salud Per Cápita',
        hovertemplate: '<b>%{x}</b><br>Esperanza de vida: %{customdata}<br>Gasto per Cápita: $%{y}<extra></extra>',
        customdata: esperanzaOrdenada,
        width: 0.8
    };

    // Sin anotaciones destacadas
    const anotaciones = [];

    const layoutBarras = {
        title: 'Gasto Salud Per Cápita vs Esperanza de Vida por País',
        xaxis: {
            title: 'Países ordenados por esperanza de vida',
            tickangle: 0,
            tickfont: {size: 13},
            tickvals: tickvals,
            ticktext: ticktext
        },
        yaxis: {title: 'Gasto Salud Per Cápita (USD)'},
        legend: {x: 0.8, y: 1.1},
        bargap: 0.2,
        annotations: [],
        height: 400
    };

    console.log('=== CREANDO GRÁFICO DE BARRAS ===');
    console.log('Elemento grafico existe:', !!document.getElementById('grafico'));
    console.log('Datos de barras:', barras);
    console.log('Layout:', layoutBarras);
    
    try {
        Plotly.newPlot('grafico', [barras], layoutBarras, {
            displayModeBar: false,
            staticPlot: false,
            scrollZoom: false,
            doubleClick: false,
            showTips: false
        }).then(() => {
            const graficoDiv = document.getElementById('grafico');
            
            // Event listener para hover en el gráfico de barras
            graficoDiv.on('plotly_hover', function(eventData) {
                const point = eventData.points[0];
                const countryName = point.x;
                
                if (countryName) {
                    // Resaltar en el mapa
                    highlightCountryInMap(countryName);
                    
                    // Reproducir sonidos si están activados (usando lógica de gráfico de barras)
                    const countryData = healthData.find(d => d.Country === countryName);
                    if (countryData && soundsEnabled) {
                        playBarChartSounds(countryName, countryData.PublicHealthSpendingPerCapita, countryData.LifeExpectancy);
                    }
                }
            });
            
            // Event listener para unhover en el gráfico de barras
            graficoDiv.on('plotly_unhover', function() {
                // Solo detener sonidos y quitar resaltado si no hay país seleccionado
                if (!selectedCountry) {
                    stopAllSounds();
                    removeMapHighlight();
                }
            });
            
            // Event listener para click en el gráfico de barras (selección permanente)
            graficoDiv.on('plotly_click', function(eventData) {
                const point = eventData.points[0];
                const countryName = point.x;
                
                if (countryName) {
                    // Si ya está seleccionado, deseleccionar
                    if (selectedCountry === countryName) {
                        deselectCountry();
                    } else {
                        // Seleccionar el nuevo país
                        selectCountry(countryName);
                    }
                }
            });
        });
        
        console.log('✅ Gráfico de barras creado exitosamente');
    } catch (error) {
        console.error('❌ Error creando gráfico de barras:', error);
    }
}

