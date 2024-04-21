var searchButton = document.getElementById("searchButton");
        var locationInput = document.getElementById("locationInput");

        // Add click event listener to search button
        searchButton.addEventListener("click", function () {
          var location = locationInput.value;

          // Use OpenRouteService API for geocoding
          fetch(`https://api.openrouteservice.org/v2/geocode/search?api_key=5b3ce3597851110001cf6248646a5e984ccf4ce5a70315dcfb95a9c8&text=${location}`)
            .then(response => response.json())
            .then(data => {
              if (data.features && data.features.length > 0) {
                var coordinates = data.features[0].geometry.coordinates;
                var marker = L.marker(coordinates).addTo(map);
                // Center the map on the marker
                map.setView(coordinates, 15);
              } else {
                alert("Location not found.");
              }
            })
            .catch(error => {
              alert("Error: " + error);
            });
        });
