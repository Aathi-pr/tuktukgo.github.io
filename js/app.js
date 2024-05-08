document.querySelector('.toggle-button').addEventListener('click', function() {
    var navLinks = document.querySelector('.nvLinks ul');
    navLinks.style.display = navLinks.style.display === 'block' ? 'none' : 'block';
 });

  var map = L.map('map').setView([0, 0], 13); // Default view is set to (0, 0)
        var polyline;

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Get user's current location
        navigator.geolocation.getCurrentPosition(function(position) {
            var latlng = [position.coords.latitude, position.coords.longitude];
            L.marker(latlng).addTo(map).bindPopup("Your Current Location").openPopup();
            map.setView(latlng, 13); // Set map center to user's location
            
            // Convert current location coordinates to location name
            var apiKey = 'YOUR_API_KEY';
            var reverseGeocodeUrl = 'https://nominatim.openstreetmap.org/reverse?lat=' + latlng[0] + '&lon=' + latlng[1] + '&format=json&zoom=18&addressdetails=1';

            fetch(reverseGeocodeUrl)
                .then(response => response.json())
                .then(data => {
                    var locationName = data.display_name;
                    document.getElementById('currentLocation').value = locationName;
                })
                .catch(error => console.error('Error:', error));
        });

        function calculateDistance() {
            var destName = document.getElementById('destName').value;
            var distanceDisplay = document.getElementById('distance');

            // Geocode destination name to coordinates using OpenStreetMap Nominatim API
            var geocodeUrl = 'https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(destName) + '&format=json&limit=1';

            fetch(geocodeUrl)
                .then(response => response.json())
                .then(data => {
                    var destination = [data[0].lat, data[0].lon]; // Destination location (latitude, longitude)
                    L.marker(destination).addTo(map).bindPopup("Destination");

                    // Calculate route using OpenRouteService API
                    var latlng = map.getCenter(); // Get user's current location
                    var routeUrl = 'https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248646a5e984ccf4ce5a70315dcfb95a9c8&start=' + latlng.lng + ',' + latlng.lat + '&end=' + destination[1] + ',' + destination[0];
                    
                    fetch(routeUrl)
                        .then(response => response.json())
                        .then(data => {
                            var distance = data.features[0].properties.summary.distance; // Distance in meters
                            var distanceInKm = (distance / 1000).toFixed(2); // Convert to kilometers with 2 decimal places
                            distanceDisplay.textContent = "Distance to destination: " + distanceInKm + " km";

                            // Remove existing polyline if exists
                            if (polyline) {
                                map.removeLayer(polyline);
                            }

                            // Add polyline from user's current location to destination
                            var routeCoordinates = data.features[0].geometry.coordinates;
                            var polylinePoints = routeCoordinates.map(coord => [coord[1], coord[0]]); // Leaflet uses [lat, lng] format
                            polyline = L.polyline(polylinePoints, {color: 'blue'}).addTo(map);

                            // Fit map to polyline bounds
                            var bounds = polyline.getBounds();
                            map.fitBounds(bounds);
                        })
                        .catch(error => console.error('Error:', error));
                })
                .catch(error => console.error('Error:', error));
        }