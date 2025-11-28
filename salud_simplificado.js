// Datos de los 4 países seleccionables
const SELECTABLE_COUNTRIES = {
    1: { name: 'Chile', code: 'CHL' },
    2: { name: 'United States', code: 'USA' },
    3: { name: 'Nauru', code: 'NRU' },
    4: { name: 'Albania', code: 'ALB' }
};

// Textos contextuales para cada país
const COUNTRY_CONTEXT = {
    'Chile': {
        spending: 882,
        lifeExpectancy: 81.17,
        text: 'Chile muestra una esperanza de vida alta (81.17 años) con un gasto público en salud relativamente bajo ($882 per cápita). Esto sugiere una eficiencia notable en el sistema de salud chileno, posiblemente relacionada con su enfoque de salud pública y políticas preventivas.'
    },
    'United States': {
        spending: 11458,
        lifeExpectancy: 78.39,
        text: 'Estados Unidos tiene el gasto público en salud más alto ($11,458 per cápita) pero una esperanza de vida moderada (78.39 años). Esta discrepancia puede reflejar las altas desigualdades en el acceso a la salud, costos elevados de medicamentos y servicios, y factores sociales más amplios.'
    },
    'Nauru': {
        spending: 1870,
        lifeExpectancy: 62.11,
        text: 'Nauru presenta una esperanza de vida muy baja (62.11 años) a pesar de un gasto moderado ($1,870 per cápita). Esta situación está fuertemente influenciada por altas tasas de diabetes tipo 2, obesidad y otros problemas de salud relacionados con cambios en el estilo de vida.'
    },
    'Albania': {
        spending: 178,
        lifeExpectancy: 79.60,
        text: 'Albania tiene el gasto público en salud más bajo ($178 per cápita) pero logra una esperanza de vida notable (79.60 años). Factores como la dieta mediterránea, estilo de vida activo, y fuertes lazos familiares y comunitarios pueden explicar esta eficiencia en salud pública.'
    }
};

// Variables globales
let healthData = [];
let soundsEnabled = false;
let selectedCountries = new Set(); // Países seleccionados (los que NO se detectan)
let allDetectedCountries = new Set(); // Todos los países detectados actualmente
let barChartData = null;

// Cargar y configurar sonidos
const coinsSound = new Audio('código_gráfico_esperanza_gasto/coins.wav');

// Variables para controlar la reproducción de sonidos
let coinsInterval = null;
let isPlayingCoins = false;
let audioInitialized = false;

// Función para inicializar el audio
function initializeAudio() {
    if (!audioInitialized) {
        coinsSound.load();
        audioInitialized = true;
    }
}

// Función para reproducir sonido de monedas
function playCoinsSound(spending, maxSpending) {
    stopCoinsSound();
    
    isPlayingCoins = true;
    let interval, volume = 0.8;
    
    if (spending >= 8000) {
        interval = 300;
    } else if (spending >= 5000) {
        interval = 400;
    } else if (spending >= 3000) {
        interval = 500;
    } else if (spending >= 2000) {
        interval = 700;
    } else if (spending >= 1000) {
        interval = 1000;
    } else if (spending >= 500) {
        interval = 1500;
    } else if (spending >= 100) {
        interval = 2500;
    } else {
        interval = 4000;
    }
    
    const playSound = () => {
        const audioInstance = new Audio('código_gráfico_esperanza_gasto/coins.wav');
        audioInstance.currentTime = 0;
        audioInstance.volume = volume;
        audioInstance.play().catch(e => console.log('Error playing coins:', e));
    };
    
    playSound();
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

// Función para reproducir pitido de esperanza de vida usando heartbeat.js
function playBeepSound(lifeExpectancy) {
    stopBeepSound();
    
    if (typeof heartbeatGenerator !== 'undefined') {
        heartbeatGenerator.generateHeartbeatPattern(lifeExpectancy);
    } else {
        console.warn('heartbeatGenerator no está disponible. Asegúrate de cargar heartbeat.js');
    }
}

function stopBeepSound() {
    if (typeof heartbeatGenerator !== 'undefined') {
        heartbeatGenerator.stop();
    }
}

function stopAllSounds() {
    stopCoinsSound();
    stopBeepSound();
    
    if (coinsSound) {
        coinsSound.pause();
        coinsSound.currentTime = 0;
    }
}

// Función para crear el gráfico de barras
function createBarChart() {
    if (!healthData || healthData.length === 0) {
        console.error('No hay datos disponibles');
        return;
    }
    
    const paises = healthData.map(d => d.Country.trim());
    const esperanzaVida = healthData.map(d => Number(d.LifeExpectancy));
    const gastoPerCápita = healthData.map(d => Number(d.PublicHealthSpendingPerCapita));
    
    // Ordenar por esperanza de vida
    const orden = esperanzaVida
        .map((ev, i) => ({ev, i}))
        .sort((a, b) => a.ev - b.ev)
        .map(obj => obj.i);

    const paisesOrdenados = orden.map(i => paises[i]);
    const esperanzaOrdenada = orden.map(i => esperanzaVida[i]);
    const gastoOrdenado = orden.map(i => gastoPerCápita[i]);
    
    // Colores: azul para todos, rojo para seleccionados
    const coloresBarras = paisesOrdenados.map(pais => {
        if (selectedCountries.has(pais)) {
            return 'rgba(220, 38, 38, 0.9)'; // Rojo para seleccionados
        }
        return 'rgba(55, 128, 191, 0.7)'; // Azul por defecto
    });
    
    // Guardar datos para referencia
    barChartData = {
        paisesOrdenados,
        esperanzaOrdenada,
        gastoOrdenado,
        coloresBarras
    };
    
    // Crear anotaciones con flechas para países seleccionados
    const annotations = [];
    paisesOrdenados.forEach((pais, index) => {
        if (selectedCountries.has(pais)) {
            annotations.push({
                x: pais,
                y: gastoOrdenado[index],
                xref: 'x',
                yref: 'y',
                text: '▼',
                showarrow: true,
                arrowhead: 2,
                arrowsize: 1.5,
                arrowwidth: 3,
                arrowcolor: '#dc2626',
                ax: 0,
                ay: -50,
                font: {
                    color: '#dc2626',
                    size: 16,
                    family: 'Arial, sans-serif'
                },
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                bordercolor: '#dc2626',
                borderwidth: 2,
                borderpad: 4
            });
        }
    });
    
    // Rangos para etiquetas del eje X
    const rangos = [60, 65, 75, 80, 85];
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
    const tickvals = tickIndices.map(i => paisesOrdenados[i]);
    const ticktext = rangos.map(r => r.toString());
    
    const barras = {
        x: paisesOrdenados,
        y: gastoOrdenado,
        type: 'bar',
        marker: {color: coloresBarras},
        name: 'Gasto Salud Per Cápita',
        hovertemplate: '<b>%{x}</b><br>Esperanza de vida: %{customdata} años<br>Gasto per Cápita: $%{y}<extra></extra>',
        customdata: esperanzaOrdenada,
        width: 0.8
    };

    const layoutBarras = {
        title: 'Gasto Salud Per Cápita vs Esperanza de Vida por País',
        xaxis: {
            title: 'Países ordenados por esperanza de vida',
            tickangle: 0,
            tickfont: {size: 10},
            tickvals: tickvals,
            ticktext: ticktext
        },
        yaxis: {title: 'Gasto Salud Per Cápita (USD)'},
        legend: {x: 0.8, y: 1.1},
        bargap: 0.2,
        annotations: annotations,
        height: 500
    };
    
    Plotly.newPlot('grafico', [barras], layoutBarras, {
        displayModeBar: false,
        staticPlot: false,
        scrollZoom: false,
        doubleClick: false,
        showTips: false
    });
}

// Función para actualizar los cuadros de información
function updateInfoBoxes() {
    const container = document.getElementById('info-container');
    container.innerHTML = '';
    
    selectedCountries.forEach(countryName => {
        const context = COUNTRY_CONTEXT[countryName];
        if (context) {
            const infoBox = document.createElement('div');
            infoBox.className = 'country-info';
            infoBox.innerHTML = `
                <h3>${countryName}</h3>
                <p class="data">Gasto público en salud: $${context.spending} per cápita</p>
                <p class="data">Esperanza de vida: ${context.lifeExpectancy} años</p>
                <p>${context.text}</p>
            `;
            container.appendChild(infoBox);
        }
    });
}

// Función para actualizar países seleccionados
function updateSelectedCountries(detectedArucoIds) {
    // Convertir IDs ArUco detectados a nombres de países
    const currentlyDetected = new Set();
    
    detectedArucoIds.forEach(arucoId => {
        const country = SELECTABLE_COUNTRIES[arucoId];
        if (country) {
            currentlyDetected.add(country.name);
        }
    });
    
    allDetectedCountries = currentlyDetected;
    
    // Los países seleccionados son los que NO están siendo detectados
    // pero que estaban en el conjunto de países seleccionables
    const selectableNames = Object.values(SELECTABLE_COUNTRIES).map(c => c.name);
    
    selectedCountries = new Set();
    selectableNames.forEach(countryName => {
        if (!currentlyDetected.has(countryName)) {
            selectedCountries.add(countryName);
        }
    });
    
    // Actualizar gráfico e información
    createBarChart();
    updateInfoBoxes();
}

// Inicializar control de sonidos
function initializeSoundControl() {
    const soundToggle = document.getElementById('sound-toggle');
    
    soundToggle.addEventListener('click', function() {
        soundsEnabled = !soundsEnabled;
        
        if (soundsEnabled) {
            this.textContent = '🔇 Desactivar Sonidos';
            this.classList.add('active');
            initializeAudio();
        } else {
            this.textContent = '🔊 Activar Sonidos';
            this.classList.remove('active');
            stopAllSounds();
        }
    });
}

// Escuchar datos desde Protobject (países detectados)
Protobject.Core.onReceived((detectedArucoIds) => {
    console.log('Países detectados (ArUco IDs):', detectedArucoIds);
    updateSelectedCountries(detectedArucoIds || []);
});

// Cargar datos y inicializar
fetch('código_gráfico_esperanza_gasto/health_data.json')
    .then(response => response.json())
    .then(json => {
        healthData = json;
        console.log('Datos cargados:', healthData.length, 'países');
        createBarChart();
        initializeSoundControl();
    })
    .catch(error => {
        console.error('Error cargando datos:', error);
    });

