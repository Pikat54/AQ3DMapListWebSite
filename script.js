document.addEventListener("DOMContentLoaded", function () {
    // Fetch JSON data from your file (replace 'data.json' with your JSON file path)
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            // Get the container for tab buttons and tab content
            const tabButtons = document.querySelector(".tab-buttons");
            const tabContent = document.querySelector(".content");

          // Dark mode toggle functionality
    const darkModeToggle = document.getElementById("dark-mode-checkbox");
    const body = document.body;

    // Function to set the dark mode
    function setDarkMode(isDarkMode) {
        body.classList.toggle("dark-mode", isDarkMode);
        localStorage.setItem("darkMode", isDarkMode);
    }

    // Check if dark mode preference is saved in localStorage
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
        darkModeToggle.checked = savedDarkMode === "true";
        setDarkMode(darkModeToggle.checked);
    }

    darkModeToggle.addEventListener("change", () => {
        setDarkMode(darkModeToggle.checked);
    });

            // Function to create map tabs and their corresponding item tabs
            function createMapTabs(data) {
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        const map = data[key].map;
                        const items = data[key].items;
            
                        // Create a map tab button
                        const mapTabButton = document.createElement("button");
                        mapTabButton.textContent = map.Name;
            
                        // Check the "bStaff" property and set the button's style accordingly
                        // Check the "bStaff" property and set the button's style accordingly
            if (map.bStaff === true) {
                mapTabButton.classList.add("staff-button");
            }
            
                        mapTabButton.addEventListener("click", () => {
                            // Display the map's data in the content area when the button is clicked
                            displayMap(map);
            
                            // Clear the previous item tabs
                            const itemTabsContainer = document.querySelector(".item-tabs");
                            if (itemTabsContainer) {
                                itemTabsContainer.remove();
                            }
            
                            // Create item tabs for the current map
                            createItemTabs(items, map);
                        });
            
                        // Add the map tab button to the container
                        tabButtons.appendChild(mapTabButton);
                    }
                }
            }

            // Function to create item tabs for the current map
            function createItemTabs(items, map) {
                const itemTabsContainer = document.createElement("div");
                itemTabsContainer.classList.add("item-tabs");

                items.forEach((item) => {
                    // Create a div for each item's content
                    const itemContentDiv = document.createElement("div");
                    itemContentDiv.classList.add("item-content");

                    // Create an item tab button with the item's Name as the tab label
                    const itemTabButton = document.createElement("button");
                    itemTabButton.textContent = item.Name;
                    itemTabButton.addEventListener("click", () => {
                        // Display the item's data in the content area when the button is clicked
                        displayItem(item);

                        // Add a back button within each item's content to return to the map
                      

                        // Append the back button to the item's content
                        itemContentDiv.appendChild(backButton);
                    });

                    // Append the item tab button to the item's content
                    itemContentDiv.appendChild(itemTabButton);

                    // Append each item's content to the item tabs container
                    itemTabsContainer.appendChild(itemContentDiv);
                });

                // Add the item tabs container to the content area
                tabContent.appendChild(itemTabsContainer);
            }

            // Function to display map data
            function displayMap(map) {
                // Clear the previous content
                tabContent.innerHTML = "";

                // Create a div to display the map's data
                const mapDiv = document.createElement("div");
                mapDiv.classList.add("map-info");

                // Loop through the map properties and display them
                for (const key in map) {
                    if (map.hasOwnProperty(key)) {
                        const value = map[key];
                        const propertyDiv = document.createElement("div");
                        propertyDiv.classList.add("property");
                        propertyDiv.innerHTML = `<strong>${key}:</strong> ${value}`;
                        mapDiv.appendChild(propertyDiv);
                    }
                }

                // Add the map's data to the content area
                tabContent.appendChild(mapDiv);
            }

            // Function to display item data
            function displayItem(item) {
                // Clear the previous content
                tabContent.innerHTML = "";

                // Create a div to display the item's data
                const itemDiv = document.createElement("div");
                itemDiv.classList.add("item-info");

                // Loop through the item properties and display them
                for (const key in item) {
                    if (item.hasOwnProperty(key)) {
                        const value = item[key];
                        const propertyDiv = document.createElement("div");
                        propertyDiv.classList.add("property");
                        propertyDiv.innerHTML = `<strong>${key}:</strong> ${value}`;
                        itemDiv.appendChild(propertyDiv);
                    }
                }

                // Add the item's data to the content area
                tabContent.appendChild(itemDiv);
            }

            // Create map tabs for each map
            createMapTabs(data);

            // Initially, display the data of the first map
            const firstMap = Object.values(data)[0].map;
            displayMap(firstMap);


            
           // Search functionality
            
            const searchButton = document.getElementById("search-button");
            const mapSearchInput = document.getElementById("map-search");

            // Function to handle the search functionality
            function handleSearch() {
                const searchQuery = mapSearchInput.value.toLowerCase();

                // Loop through map tabs to find a match
                const mapButtons = tabButtons.querySelectorAll("button");
                mapButtons.forEach((button) => {
                    const mapName = button.textContent.toLowerCase();
                    if (mapName.includes(searchQuery)) {
                        button.style.display = "block";
                    } else {
                        button.style.display = "none";
                    }
                });
            }

            // Event listener for the "keypress" event on the search input
            mapSearchInput.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    handleSearch();
                }
            });

            // Event listener for the search button
            searchButton.addEventListener("click", () => {
                handleSearch();
            });
        })
        .catch(error => console.error(error));
});
