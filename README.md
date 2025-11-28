# Visualización Interactiva de Datos de Salud Global

## 📊 Descripción del Proyecto

Esta aplicación web interactiva visualiza datos de salud global utilizando mapas coropléticos y gráficos de barras. Los datos incluyen gasto público en salud per cápita y esperanza de vida por país, con funcionalidades de sonido interactivo que reflejan las características de cada país.

## 🎯 Características Principales

### **Visualizaciones:**
- **Mapa Coroplético Interactivo**: Muestra gasto en salud o esperanza de vida por país
- **Gráfico de Barras**: Ranking de países por gasto en salud
- **Filtros por Región**: Europa, Asia, África, Norteamérica, Sudamérica, Oceanía

### **Sonidos Interactivos:**
- **Sonidos de Monedas**: Reflejan el gasto en salud (más gasto = más rápido)
- **Sonidos de Monitor Cardíaco**: Reflejan la esperanza de vida (menor edad = más rápido)
- **Sonidos Superpuestos**: Opción para reproducir ambos sonidos simultáneamente
- **Amplificación de Volumen**: Sistema avanzado para países con alto gasto

### **Interactividad:**
- **Sincronización**: Al seleccionar un país en el mapa, se resalta en el gráfico de barras
- **Flechas Indicadoras**: Apuntan a países con bajo gasto para mejor visibilidad
- **Zoom Dinámico**: Se ajusta automáticamente según las regiones seleccionadas

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura de la aplicación
- **CSS3**: Estilos y diseño responsivo
- **JavaScript**: Lógica de la aplicación
- **Plotly.js**: Visualizaciones interactivas
- **Web Audio API**: Generación de sonidos sintéticos
- **Python HTTP Server**: Servidor local para desarrollo

## 📁 Estructura del Proyecto

```
├── index.html              # Página principal
├── script.js               # Lógica de la aplicación
├── heartbeat.js            # Generador de sonidos de monitor cardíaco
├── health_data.json        # Datos de salud por país
├── coins.wav               # Archivo de sonido de monedas
├── pitido.wav              # Archivo de sonido de pitido
├── .gitignore              # Archivos a ignorar en git
└── README.md               # Documentación del proyecto
```

## 🚀 Instalación y Uso

### **Requisitos:**
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Python 3.x (para servidor local)

### **Pasos de Instalación:**

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/infovis-entrega-2.git
   cd infovis-entrega-2
   ```

2. **Iniciar servidor local:**
   ```bash
   python3 -m http.server 8000
   ```

3. **Abrir en el navegador:**
   ```
   http://localhost:8000
   ```

##  Sistema de Sonidos

### **Sonidos de Monedas (Gasto en Salud):**
- **Estados Unidos**: 350ms + 4 monedas superpuestas + volumen máximo
- **$8000+**: 300ms + 3 monedas + volumen alto
- **$5000-8000**: 400ms + 2 monedas + volumen alto
- **$3000-5000**: 500ms + 2 monedas + volumen medio
- **$2000-3000**: 700ms + 1 moneda + volumen medio
- **$1000-2000**: 1000ms + 1 moneda + volumen bajo
- **<$1000**: 1500ms+ + 1 moneda + volumen bajo

### **Sonidos de Monitor Cardíaco (Esperanza de Vida):**
- **<50 años**: 150ms - Extremadamente rápido (crítico)
- **50-52.5 años**: 180ms - Muy rápido (emergencia)
- **52.5-55 años**: 200ms - Rápido (crítico)
- **55-57.5 años**: 250ms - Moderado rápido
- **57.5-60 años**: 300ms - Moderado
- **60-62.5 años**: 400ms - Moderado lento
- **62.5-65 años**: 500ms - Lento
- **65-67.5 años**: 600ms - Lento moderado
- **67.5-70 años**: 700ms - Muy lento
- **70-72.5 años**: 900ms - Muy lento
- **72.5-75 años**: 1000ms - Extremadamente lento
- **75-77.5 años**: 1100ms - Extremadamente lento
- **77.5-80 años**: 1200ms - Extremadamente lento
- **80-82.5 años**: 1400ms - Extremadamente lento
- **82.5-85 años**: 1600ms - Muy extremadamente lento
- **85-87.5 años**: 1800ms - Muy extremadamente lento
- **87.5-90 años**: 2000ms - Muy extremadamente lento
- **90+ años**: 2500ms - Muy extremadamente lento

## 🎛️ Controles

- **🔊 Activar Sonidos**: Habilita/deshabilita todos los sonidos
- ** Superponer Sonidos**: Activa sonidos duales en el gráfico de barras
- **Filtros de Región**: Selecciona continentes específicos
- **Botones de Vista**: Cambia entre "Gasto en Salud" y "Esperanza de Vida"

## 📊 Datos

Los datos incluyen información de 193 países con:
- Gasto público en salud per cápita (USD)
- Esperanza de vida (años)
- Códigos de país ISO
- Nombres de países

## 🔧 Desarrollo

### **Archivos Principales:**
- `script.js`: Contiene toda la lógica de la aplicación
- `heartbeat.js`: Generador de sonidos de monitor cardíaco
- `index.html`: Estructura HTML y configuración de Plotly

### **Funciones Clave:**
- `playCoinsSound()`: Reproduce sonidos de monedas según el gasto
- `playBeepSound()`: Reproduce sonidos de monitor según la esperanza de vida
- `createInteractiveMap()`: Crea el mapa coroplético
- `graficar()`: Crea el gráfico de barras
- `getRegionZoom()`: Calcula el zoom para regiones específicas

## 📝 Notas de Desarrollo

- Los sonidos se generan usando Web Audio API para mayor control
- El sistema de amplificación permite volúmenes superiores a 1.0
- Los rangos de edad están optimizados cada 2.5 años para mayor granularidad
- El zoom dinámico se ajusta automáticamente según las regiones seleccionadas

## 👨‍💻 Autor

Francisco - Proyecto de Visualización de Datos

## 📄 Licencia

Este proyecto es parte de un curso de visualización de datos.
