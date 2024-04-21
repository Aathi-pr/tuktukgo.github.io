document.querySelector('.toggle-button').addEventListener('click', function() {
    var navLinks = document.querySelector('.nvLinks ul');
    navLinks.style.display = navLinks.style.display === 'block' ? 'none' : 'block';
 });

var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

navigator.geolocation.watchPosition(success, error);
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    var apiKey = '5b3ce3597851110001cf6248646a5e984ccf4ce5a70315dcfb95a9c8'; // Replace with your OpenRouteService API Key

    // Send a request to OpenRouteService Geocoding API for reverse geocoding
    var url = `https://api.openrouteservice.org/geocode/reverse?api_key=${apiKey}&point.lat=${lat}&point.lon=${lng}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.features && data.features.length > 0) {
                var locationName = data.features[0].properties.name;
                document.getElementById("locationInput").value = locationName;
            } else {
                console.error("No results found");
            }
        })
        .catch(error => console.error("Error fetching location:", error));
}

let marker, circle, zoomed;
function success(pos) {
    const lat = pos.coords.latitude;
    const log = pos.coords.longitude;
    const accuracy = pos.coords.accuracy;

    if (marker) {
        map.removeLayer(marker);
        map.removeLayer(circle);
    }

    marker = L.marker([lat, log]).addTo(map);
    circle = L.circle([lat, log], { radius: accuracy}).addTo(map);

    map.fitBounds(circle.getBounds());
}

function error(err) {
    if (err.code === 1) {
        alert("Please Turn 'ON' Geolocation Access");
    } else {
        alert("Cannot Get User Location");
    }
    
}
getLocation();
