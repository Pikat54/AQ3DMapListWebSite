document.addEventListener("DOMContentLoaded", function () {
    // Mostrar el loader
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "block";
    
    // Configurar el modo oscuro primero para evitar parpadeos
    setupDarkMode();
    
    // Fetch JSON data
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            // Ocultar el loader cuando los datos están listos
            if (loader) loader.style.display = "none";
            
            // Inicializar la aplicación con los datos
            initializeApp(data);
        })
        .catch(error => {
            console.error("Error loading data:", error);
            // Ocultar el loader en caso de error
            if (loader) loader.style.display = "none";
            
            // Mostrar mensaje de error al usuario
            const contentArea = document.querySelector(".content");
            if (contentArea) {
                const errorMessage = document.createElement("div");
                errorMessage.classList.add("error-message");
                errorMessage.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error al cargar los datos. Por favor, intenta recargar la página.</p>
                    <p>Detalles: ${error.message}</p>
                `;
                contentArea.appendChild(errorMessage);
            }
        });
        
    // Función para configurar el modo oscuro
    function setupDarkMode() {
        const darkModeToggle = document.getElementById("dark-mode-checkbox");
        const body = document.body;
        
        if (!darkModeToggle) return;
        
        // Función para establecer el modo oscuro
        function setDarkMode(isDarkMode) {
            body.classList.toggle("dark-mode", isDarkMode);
            localStorage.setItem("darkMode", isDarkMode);
        }
        
        // Comprobar preferencia guardada
        const savedDarkMode = localStorage.getItem("darkMode");
        if (savedDarkMode) {
            darkModeToggle.checked = savedDarkMode === "true";
            setDarkMode(darkModeToggle.checked);
        }
        
        darkModeToggle.addEventListener("change", () => {
            setDarkMode(darkModeToggle.checked);
        });
    }
    
    // Función principal para inicializar la aplicación
    function initializeApp(data) {
        const tabButtons = document.querySelector(".tab-buttons");
        const tabContent = document.querySelector(".content");
        
        if (!tabButtons || !tabContent || !data) {
            console.error("Error: Missing essential elements or data");
            return;
        }
        
        // Crear pestañas de mapas
        createMapTabs(data);
        
        // Mostrar el primer mapa por defecto
        if (Object.keys(data).length > 0) {
            const firstMapKey = Object.keys(data)[0];
            const firstMapData = data[firstMapKey];
            
            if (firstMapData && firstMapData.map) {
                displayMap(firstMapData.map);
                
                // Crear pestañas de elementos si están disponibles
                if (firstMapData.items && Array.isArray(firstMapData.items)) {
                    createItemTabs(firstMapData.items, firstMapData.map);
                }
            }
        }
        
        // Configurar la funcionalidad de búsqueda
        setupSearch();
        
        // Función para crear pestañas de mapas
        function createMapTabs(data) {
            // Limpiar cualquier pestaña existente
            if (tabButtons) tabButtons.innerHTML = "";
            
            // Crear contenedor para categorías de mapas
            const mapCategories = {};
            
            // Agrupar mapas por categoría
            for (const key in data) {
                if (data.hasOwnProperty(key) && data[key] && data[key].map) {
                    const map = data[key].map;
                    const category = map.Category || "Sin categoría";
                    
                    if (!mapCategories[category]) {
                        mapCategories[category] = [];
                    }
                    
                    mapCategories[category].push({
                        key: key,
                        map: map,
                        items: data[key].items || []  // Asegurar que items siempre sea un array
                    });
                }
            }
            
            // Crear secciones de categoría
            for (const category in mapCategories) {
                // Crear encabezado de categoría
                const categoryHeader = document.createElement("div");
                categoryHeader.classList.add("category-header");
                categoryHeader.textContent = category;
                tabButtons.appendChild(categoryHeader);
                
                // Crear mapas bajo esta categoría
                mapCategories[category].forEach(mapData => {
                    const mapTabButton = document.createElement("button");
                    mapTabButton.textContent = mapData.map.Name || "Mapa sin nombre";
                    mapTabButton.setAttribute("data-key", mapData.key);
                    
                    if (mapData.map.bStaff === true) {
                        mapTabButton.classList.add("staff-button");
                    }
                    
                    mapTabButton.addEventListener("click", () => {
                        // Resaltar botón activo
                        document.querySelectorAll(".tab-buttons button").forEach(btn => {
                            btn.classList.remove("active");
                        });
                        mapTabButton.classList.add("active");
                        
                        // Mostrar datos del mapa
                        displayMap(mapData.map);
                        
                        // Crear pestañas de elementos
                        createItemTabs(mapData.items || [], mapData.map);
                    });
                    
                    tabButtons.appendChild(mapTabButton);
                });
            }
        }
        
        // Función para crear pestañas de elementos
        function createItemTabs(items, map) {
            // Verificar que items sea un array
            if (!Array.isArray(items)) {
                console.error("Error: items is not an array", items);
                items = [];  // Convertir a array vacío para evitar errores
            }
            
            // Limpiar pestañas de elementos anteriores
            const existingItemTabs = document.querySelector(".item-tabs");
            if (existingItemTabs) {
                existingItemTabs.remove();
            }
            
            // Crear nuevo contenedor de pestañas de elementos
            const itemTabsContainer = document.createElement("div");
            itemTabsContainer.classList.add("item-tabs");
            
            // Crear encabezado para la sección de elementos
            const itemsHeader = document.createElement("h3");
            itemsHeader.textContent = `Elementos en ${map.Name || "este mapa"}`;
            itemTabsContainer.appendChild(itemsHeader);
            
            // Verificar si hay elementos
            if (items.length === 0) {
                const noItemsMessage = document.createElement("p");
                noItemsMessage.classList.add("empty-state");
                noItemsMessage.innerHTML = `
                    <i class="fas fa-box-open"></i>
                    <p>No hay elementos disponibles para este mapa.</p>
                `;
                itemTabsContainer.appendChild(noItemsMessage);
                tabContent.appendChild(itemTabsContainer);
                return;
            }
            
            // Agrupar elementos por tipo si es posible
            const groupedItems = {};
            items.forEach(item => {
                if (!item) return; // Saltar elementos nulos
                
                const type = item.Type || "Otros";
                if (!groupedItems[type]) {
                    groupedItems[type] = [];
                }
                groupedItems[type].push(item);
            });
            
            // Crear secciones de tipo
            for (const type in groupedItems) {
                const typeSection = document.createElement("div");
                typeSection.classList.add("item-type");
                
                const typeHeader = document.createElement("h4");
                typeHeader.textContent = type;
                typeSection.appendChild(typeHeader);
                
                const itemButtonsContainer = document.createElement("div");
                itemButtonsContainer.classList.add("item-buttons");
                
                groupedItems[type].forEach(item => {
                    if (!item) return; // Saltar elementos nulos
                    
                    const itemButton = document.createElement("button");
                    itemButton.textContent = item.Name || "Elemento sin nombre";
                    
                    // Añadir clases de rareza si están disponibles
                    if (item.Rarity && typeof item.Rarity === 'string') {
                        try {
                            itemButton.classList.add(`rarity-${item.Rarity.toLowerCase()}`);
                        } catch (e) {
                            console.warn("Error al aplicar la clase de rareza:", e);
                        }
                    }
                    
                    itemButton.addEventListener("click", () => {
                        // Resaltar botón activo
                        document.querySelectorAll(".item-buttons button").forEach(btn => {
                            btn.classList.remove("active");
                        });
                        itemButton.classList.add("active");
                        
                        // Mostrar datos del elemento
                        displayItem(item, map);
                    });
                    
                    itemButtonsContainer.appendChild(itemButton);
                });
                
                typeSection.appendChild(itemButtonsContainer);
                itemTabsContainer.appendChild(typeSection);
            }
            
            tabContent.appendChild(itemTabsContainer);
        }
        
        // Función para mostrar datos del mapa
        function displayMap(map) {
            if (!map) {
                console.error("Error: No map data provided");
                return;
            }
            
            // Limpiar contenido anterior
            const contentArea = document.querySelector(".map-content");
            if (contentArea) {
                contentArea.innerHTML = "";
            } else {
                const newContentArea = document.createElement("div");
                newContentArea.classList.add("map-content");
                tabContent.appendChild(newContentArea);
            }
            
            const mapContentArea = document.querySelector(".map-content");
            
            // Crear tarjeta de información del mapa
            const mapCard = document.createElement("div");
            mapCard.classList.add("map-card");
            
            // Añadir encabezado del mapa
            const mapHeader = document.createElement("div");
            mapHeader.classList.add("map-header");
            
            const mapTitle = document.createElement("h2");
            mapTitle.textContent = map.Name || "Mapa sin nombre";
            if (map.bStaff === true) {
                mapTitle.classList.add("staff-title");
            }
            mapHeader.appendChild(mapTitle);
            
            // Añadir descripción del mapa si está disponible
            if (map.Description) {
                const mapDescription = document.createElement("p");
                mapDescription.classList.add("map-description");
                mapDescription.textContent = map.Description;
                mapHeader.appendChild(mapDescription);
            }
            
            mapCard.appendChild(mapHeader);
            
            // Crear cuadrícula de propiedades
            const propertyGrid = document.createElement("div");
            propertyGrid.classList.add("property-grid");
            
            // Definir propiedades importantes para mostrar en la parte superior
            const priorityProps = ["Level", "Category", "Type", "Population", "Access"];
            const displayedProps = new Set();
            
            // Mostrar primero las propiedades prioritarias
            priorityProps.forEach(propName => {
                if (map.hasOwnProperty(propName)) {
                    const propValue = map[propName];
                    const propDiv = createPropertyElement(propName, propValue);
                    propertyGrid.appendChild(propDiv);
                    displayedProps.add(propName);
                }
            });
            
            // Mostrar otras propiedades
            for (const key in map) {
                if (map.hasOwnProperty(key) && !displayedProps.has(key) && key !== "Name" && key !== "Description") {
                    const value = formatPropertyValue(map[key]);
                    const propertyDiv = createPropertyElement(key, value);
                    propertyGrid.appendChild(propertyDiv);
                }
            }
            
            mapCard.appendChild(propertyGrid);
            mapContentArea.appendChild(mapCard);
        }
        
        // Función para mostrar datos del elemento
        function displayItem(item, map) {
            if (!item) {
                console.error("Error: No item data provided");
                return;
            }
            
            // Limpiar área de contenido de elementos o crearla
            let itemContentArea = document.querySelector(".item-content-area");
            if (!itemContentArea) {
                itemContentArea = document.createElement("div");
                itemContentArea.classList.add("item-content-area");
                tabContent.appendChild(itemContentArea);
            }
            itemContentArea.innerHTML = "";
            
            // Crear botón de regreso
            const backButton = document.createElement("button");
            backButton.classList.add("back-button");
            backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Volver al Mapa';
            backButton.addEventListener("click", () => {
                // Ocultar contenido del elemento y mostrar contenido del mapa
                itemContentArea.innerHTML = "";
                displayMap(map);
            });
            
            // Crear tarjeta de elemento
            const itemCard = document.createElement("div");
            itemCard.classList.add("item-card");
            
            // Añadir encabezado del elemento
            const itemHeader = document.createElement("div");
            itemHeader.classList.add("item-header");
            
            const itemTitle = document.createElement("h2");
            itemTitle.textContent = item.Name || "Elemento sin nombre";
            
            // Aplicar clase de rareza al texto si está disponible
            if (item.Rarity && typeof item.Rarity === 'string') {
                try {
                    itemTitle.classList.add(`rarity-${item.Rarity.toLowerCase()}-text`);
                } catch (e) {
                    console.warn("Error al aplicar la clase de texto de rareza:", e);
                }
            }
            
            itemHeader.appendChild(itemTitle);
            itemCard.appendChild(itemHeader);
            
            // Crear cuadrícula de propiedades para el elemento
            const itemPropertyGrid = document.createElement("div");
            itemPropertyGrid.classList.add("property-grid");
            
            // Definir propiedades prioritarias para elementos
            const itemPriorityProps = ["Type", "Rarity", "Level", "Stats", "DropRate"];
            const itemDisplayedProps = new Set();
            
            // Mostrar primero las propiedades prioritarias
            itemPriorityProps.forEach(propName => {
                if (item.hasOwnProperty(propName)) {
                    const propValue = formatPropertyValue(item[propName]);
                    const propDiv = createPropertyElement(propName, propValue);
                    itemPropertyGrid.appendChild(propDiv);
                    itemDisplayedProps.add(propName);
                }
            });
            
            // Mostrar otras propiedades
            for (const key in item) {
                if (item.hasOwnProperty(key) && !itemDisplayedProps.has(key) && key !== "Name") {
                    const value = formatPropertyValue(item[key]);
                    const propertyDiv = createPropertyElement(key, value);
                    itemPropertyGrid.appendChild(propDiv);
                }
            }
            
            itemCard.appendChild(itemPropertyGrid);
            
            // Añadir botón de regreso y tarjeta de elemento al área de contenido
            itemContentArea.appendChild(backButton);
            itemContentArea.appendChild(itemCard);
        }
        
        // Función auxiliar para crear elementos de propiedad
        function createPropertyElement(key, value) {
            const propertyDiv = document.createElement("div");
            propertyDiv.classList.add("property");
            
            const propName = document.createElement("span");
            propName.classList.add("property-name");
            propName.textContent = formatPropertyName(key);
            
            const propValue = document.createElement("span");
            propValue.classList.add("property-value");
            
            // Verificar si el valor es válido
            if (value !== undefined && value !== null) {
                propValue.innerHTML = value;
            } else {
                propValue.innerHTML = "<em>No disponible</em>";
                propValue.classList.add("not-available");
            }
            
            propertyDiv.appendChild(propName);
            propertyDiv.appendChild(propValue);
            
            return propertyDiv;
        }
        
        // Formatear nombres de propiedades (camelCase a Title Case)
        function formatPropertyName(name) {
            if (typeof name !== 'string') return name;
            
            return name
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase());
        }
        
        // Formatear valores de propiedad basados en el tipo
        function formatPropertyValue(value) {
            if (value === undefined || value === null) {
                return "<em>No disponible</em>";
            } else if (typeof value === "boolean") {
                return value ? '<span class="boolean-true">Sí</span>' : '<span class="boolean-false">No</span>';
            } else if (Array.isArray(value)) {
                if (value.length === 0) return "<em>Ninguno</em>";
                return value.join(", ");
            } else if (typeof value === 'object') {
                try {
                    return JSON.stringify(value);
                } catch (e) {
                    return "<em>Objeto complejo</em>";
                }
            } else {
                return value.toString();
            }
        }
        
        // Configurar funcionalidad de búsqueda
        function setupSearch() {
            const searchInput = document.getElementById("map-search");
            const searchButton = document.getElementById("search-button");
            const clearButton = document.getElementById("clear-search");
            
            if (!searchInput || !searchButton) return;
            
            function performSearch() {
                const searchQuery = searchInput.value.toLowerCase().trim();
                
                if (searchQuery === "") {
                    // Mostrar todos los mapas
                    document.querySelectorAll(".tab-buttons button").forEach(button => {
                        button.style.display = "block";
                    });
                    // Mostrar todos los encabezados de categoría
                    document.querySelectorAll(".category-header").forEach(header => {
                        header.style.display = "block";
                    });
                    
                    // Eliminar mensaje de "sin resultados" si existe
                    const noResultsMessage = document.getElementById("no-results");
                    if (noResultsMessage) {
                        noResultsMessage.remove();
                    }
                    
                    return;
                }
                
                // Ocultar todos los encabezados de categoría inicialmente
                document.querySelectorAll(".category-header").forEach(header => {
                    header.style.display = "none";
                });
                
                // Comprobar cada botón de mapa
                const buttons = document.querySelectorAll(".tab-buttons button");
                let hasResults = false;
                
                buttons.forEach(button => {
                    const mapName = button.textContent.toLowerCase();
                    if (mapName.includes(searchQuery)) {
                        button.style.display = "block";
                        hasResults = true;
                        
                        // Mostrar el encabezado de categoría para este botón
                        let prevSibling = button.previousElementSibling;
                        while (prevSibling) {
                            if (prevSibling.classList.contains("category-header")) {
                                prevSibling.style.display = "block";
                                break;
                            }
                            prevSibling = prevSibling.previousElementSibling;
                        }
                    } else {
                        button.style.display = "none";
                    }
                });
                
                // Mostrar un mensaje de "sin resultados" si es necesario
                const noResultsMessage = document.getElementById("no-results");
                if (!hasResults) {
                    if (!noResultsMessage) {
                        const message = document.createElement("div");
                        message.id = "no-results";
                        message.textContent = "No se encontraron mapas que coincidan con tu búsqueda.";
                        message.classList.add("no-results");
                        tabButtons.appendChild(message);
                    }
                } else if (noResultsMessage) {
                    noResultsMessage.remove();
                }
            }
            
            // Buscar al presionar Enter
            searchInput.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    performSearch();
                }
            });
            
            // Buscar al hacer clic en el botón
            searchButton.addEventListener("click", performSearch);
            
            // Búsqueda en tiempo real mientras escribes
            searchInput.addEventListener("input", () => {
                if (searchInput.value.length >= 2 || searchInput.value.length === 0) {
                    performSearch();
                }
            });
            
            // Botón para limpiar la búsqueda
            if (clearButton) {
                clearButton.addEventListener("click", () => {
                    searchInput.value = "";
                    performSearch();
                });
            }
        }
    }
});