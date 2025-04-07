# AQ3D Map Viewer

![Screenshot](./screenshot.png) <!-- Puedes reemplazar esto con la ruta correcta o eliminarlo si no tienes imagen -->

**AQ3D Map Viewer** es un visor completo de mapas e ítems para *AdventureQuest 3D (AQ3D)*, con una interfaz moderna, adaptable y soporte para modo oscuro.

---

## 🚀 Características

### 🗺️ Funcionalidad Principal

- **Visualización de Mapas:** Información detallada de todos los mapas, organizados por categorías.
- **Explorador de Ítems:** Explora ítems disponibles por mapa con colores según su rareza.
- **Buscador Rápido:** Encuentra mapas al instante con búsqueda en tiempo real.
- **Modo Oscuro:** Alterna entre tema claro y oscuro con configuración persistente.
- **Diseño Adaptable:** Compatible con escritorio, tablet y móviles.

### ⚙️ Características Técnicas

- **Interfaz Moderna:** UI limpia e intuitiva con animaciones y retroalimentación visual.
- **Optimización de Rendimiento:** Carga fluida con spinner mientras se obtienen los datos.
- **Manejo de Errores:** Mensajes amigables cuando la carga de datos falla.
- **Preferencias Persistentes:** Modo oscuro guardado en `localStorage`.
- **Accesibilidad:** Navegación con teclado y HTML semántico.

### 🧭 Funciones de Mapa

- Organización por categorías.
- Mapas de uso exclusivo para staff destacados en rojo.
- Propiedades detalladas y bien formateadas.
- Descripciones y metadatos de mapas.

### 🧰 Funciones de Ítems

- Agrupación por tipo dentro de cada mapa.
- Indicadores visuales según rareza (colores y bordes).
- Vista detallada de propiedades del ítem.
- Navegación rápida de regreso al mapa.

---

## 📁 Estructura de Archivos

### `index.html`

- Cabecera con logo, buscador y toggle de modo oscuro.
- Área principal con sidebar y secciones de contenido.
- Spinner de carga y pie de página.

### `styles.css`

- Variables CSS para fácil tematización.
- Soporte completo para modo oscuro.
- Diseño responsive con puntos de quiebre móviles.
- Animaciones suaves, scrollbars personalizadas.
- Sistema de colores por rareza.
- Estilos de tooltips y errores.

### `script.js`

- Alternancia de modo oscuro persistente.
- Carga de datos `JSON` con manejo de errores.
- Creación dinámica de pestañas de mapa e ítems.
- Búsqueda en tiempo real.
- Carga dinámica del contenido.
- Elementos UI interactivos.

---

## 📦 Instalación

```bash
git clone https://github.com/yourusername/aq3d-map-viewer.git
