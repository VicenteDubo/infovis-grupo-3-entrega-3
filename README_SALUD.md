# Sistema Simplificado de Visualización de Salud

## Descripción
Sistema simplificado que muestra datos de gasto público en salud y esperanza de vida por país, conectado a detección de códigos ArUco.

## Archivos Principales

### 1. `salud_simplificado.html`
- Página principal con gráfico de barras
- Control de sonidos
- Cuadros informativos para países seleccionados

### 2. `salud_simplificado.js`
- Lógica del gráfico de barras
- Sistema de sonidos (monedas para gasto, pitido para esperanza de vida)
- Detección de países seleccionados
- Visualización con flechas y cuadros informativos

### 3. `order_salud.html`
- Página para detección de códigos ArUco (se ejecuta en el celular)
- Detecta códigos ArUco de países en el escenario
- Envía lista de países detectados

### 4. `config_salud.js`
- Configuración de Protobject para conectar ambas páginas

## Países Seleccionables

Los 4 países que se pueden seleccionar mediante códigos ArUco:

- **Chile** - Código ArUco: `1`
- **Estados Unidos** - Código ArUco: `100`
- **Nauru** - Código ArUco: `200`
- **Albania** - Código ArUco: `300`

## Funcionamiento

1. **Inicialmente**: Todos los países están en el escenario (todos los códigos ArUco son detectados)

2. **Selección**: Cuando el usuario saca un país del escenario:
   - El código ArUco de ese país deja de ser detectado
   - El país que NO está siendo detectado se considera "seleccionado"
   - El gráfico muestra una flecha apuntando a la barra de ese país
   - Se muestra un cuadro informativo con datos contextuales

3. **Sonidos**:
   - **Monedas**: Reflejan el gasto público en salud (más gasto → ritmo más rápido)
   - **Pitido**: Refleja la esperanza de vida (menor esperanza → ritmo más rápido y agudo)
   - Se activan al pasar el mouse sobre las barras del gráfico

## Cómo Usar

1. Abre `salud_simplificado.html` en la computadora
2. Abre `order_salud.html` en el celular
3. Coloca los códigos ArUco de los países en el escenario
4. Saca países del escenario para seleccionarlos
5. Observa cómo se destacan en el gráfico y se muestran los cuadros informativos

## Datos

Los datos se cargan desde: `código_gráfico_esperanza_gasto/health_data.json`

Los archivos de sonido deben estar en: `código_gráfico_esperanza_gasto/coins.wav` y `código_gráfico_esperanza_gasto/pitido.wav`

