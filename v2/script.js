document.addEventListener('DOMContentLoaded', () => {
    const updateInterval = 5000; // Update every 5 seconds for simulation

    // Display current date and time
    const datetimeElem = document.getElementById('datetime');
    const updateDateTime = () => {
        const now = new Date();
        datetimeElem.textContent = now.toLocaleString();
    };
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Initialize main map
    const map = L.map('mapid').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Initialize route map
    const routeMap = L.map('routeMapid').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(routeMap);

    // Mock bus data with routes
    const busData = [
        { number: 'Bus 1', route: 'Route A', driver: 'John Doe', contact: '1234567890', lat: 51.505, lon: -0.09, status: 'on-time', routePath: [[51.505, -0.09], [51.51, -0.1], [51.515, -0.11]], lastUpdated: '2024-07-31 15:00:00' },
        { number: 'Bus 2', route: 'Route B', driver: 'Jane Smith', contact: '0987654321', lat: 51.515, lon: -0.1, status: 'delayed', routePath: [[51.515, -0.1], [51.52, -0.11], [51.525, -0.12]], lastUpdated: '2024-07-31 14:55:00' },
        // Add more mock data as needed
    ];

    // Function to update mock data (simulating real-time updates)
    const updateMockData = () => {
        busData.forEach(bus => {
            const lastPos = bus.routePath[bus.routePath.length - 1];
            const newLat = lastPos[0] + (Math.random() - 0.5) * 0.01;
            const newLon = lastPos[1] + (Math.random() - 0.5) * 0.01;
            bus.lat = newLat;
            bus.lon = newLon;
            bus.routePath.push([newLat, newLon]);
            bus.lastUpdated = new Date().toLocaleString();
        });
        updateMarkers();
        updateBusDetails();
        updateCharts();
    };
    setInterval(updateMockData, updateInterval);

    // Add markers to map
    const markers = [];
    const updateMarkers = () => {
        markers.forEach(marker => map.removeLayer(marker));
        busData.forEach(bus => {
            const marker = L.marker([bus.lat, bus.lon])
                .addTo(map)
                .bindPopup(`<b>${bus.number}</b><br>Route: ${bus.route}<br>Driver: ${bus.driver}`)
                .on('click', () => showBusDetails(bus));
            markers.push(marker);
        });
    };
    updateMarkers();

    // Function to show bus details
    const showBusDetails = (bus) => {
        const busInfoElem = document.getElementById('bus-info');
        busInfoElem.innerHTML = `
            <b>Bus Number:</b> ${bus.number}<br>
            <b>Route:</b> ${bus.route}<br>
            <b>Driver:</b> ${bus.driver}<br>
            <b>Contact:</b> ${bus.contact}<br>
            <b>Last Location:</b> [${bus.lat}, ${bus.lon}]<br>
            <b>Last Updated:</b> ${bus.lastUpdated}
        `;

        // Clear previous route
        routeMap.eachLayer((layer) => {
            if (layer instanceof L.Polyline) {
                routeMap.removeLayer(layer);
            }
        });

        // Add new route
        L.polyline(bus.routePath, { color: 'blue' }).addTo(routeMap);
        routeMap.setView([bus.lat, bus.lon], 13);

        // Show recent locations
        const recentLocationsElem = document.getElementById('recent-locations');
        recentLocationsElem.innerHTML = '';
        bus.routePath.slice(-5).forEach(loc => {
            const li = document.createElement('li');
            li.textContent = `[${loc[0]}, ${loc[1]}]`;
            recentLocationsElem.appendChild(li);
        });
    };

    // Initialize charts
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    const routeCtx = document.getElementById('routeChart').getContext('2d');

    const statusData = {
        onTime: busData.filter(bus => bus.status === 'on-time').length,
        delayed: busData.filter(bus => bus.status === 'delayed').length,
        offDuty: busData.filter(bus => bus.status === 'off-duty').length
    };

    const routes = [...new Set(busData.map(bus => bus.route))];
    const routeCounts = routes.map(route => busData.filter(bus => bus.route === route).length);

    let statusChart = new Chart(statusCtx, {
        type: 'pie',
        data: {
            labels: ['On-time', 'Delayed', 'Off-duty'],
            datasets: [{
                data: [statusData.onTime, statusData.delayed, statusData.offDuty],
                backgroundColor: ['#4CAF50', '#FF9800', '#F44336']
            }]
        }
    });

    let routeChart = new Chart(routeCtx, {
        type: 'bar',
        data: {
            labels: routes,
            datasets: [{
                label: 'Number of Buses',
                data: routeCounts,
                backgroundColor: '#2196F3'
            }]
        }
    });

    const updateCharts = () => {
        statusData.onTime = busData.filter(bus => bus.status === 'on-time').length;
        statusData.delayed = busData.filter(bus => bus.status === 'delayed').length;
        statusData.offDuty = busData.filter(bus => bus.status === 'off-duty').length;
        routeCounts.forEach((count, index) => {
            routeCounts[index] = busData.filter(bus => bus.route === routes[index]).length;
        });

        statusChart.data.datasets[0].data = [statusData.onTime, statusData.delayed, statusData.offDuty];
        statusChart.update();

        routeChart.data.datasets[0].data = routeCounts;
        routeChart.update();
    };

    // Populate bus details table
    const busTableBody = document.getElementById('busTable').querySelector('tbody');
    const updateBusDetails = () => {
        busTableBody.innerHTML = '';
        busData.forEach(bus => {
            const row = document.createElement('tr');
            row.classList.add('table-row');
            row.innerHTML = `
                <td>${bus.number}</td>
                <td>${bus.route}</td>
                <td>${bus.driver}</td>
                <td>${bus.contact}</td>
                <td><span class="status ${bus.status.replace(' ', '-')}">${bus.status.replace('-', ' ')}</span></td>
            `;
            row.addEventListener('click', () => showBusDetails(bus));
            busTableBody.appendChild(row);
        });
    };
    updateBusDetails();

    // Filter functionality for bus table
    document.getElementById('filter').addEventListener('input', (e) => {
        const filter = e.target.value.toLowerCase();
        busTableBody.querySelectorAll('tr').forEach(row => {
            const cells = row.getElementsByTagName('td');
            const matches = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(filter));
            row.style.display = matches ? '' : 'none';
        });
    });

    // Update last update time
    const updateLastUpdate = () => {
        document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
    };
    setInterval(updateLastUpdate, 1000);
    updateLastUpdate();
});
