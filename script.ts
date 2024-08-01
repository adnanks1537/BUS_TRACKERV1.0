document.addEventListener('DOMContentLoaded', () => {
    // Display current date and time
    const datetimeElem = document.getElementById('datetime');
    const updateDateTime = () => {
        const now = new Date();
        datetimeElem.textContent = now.toLocaleString();
    };
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Initialize map
    const map = L.map('mapid').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Mock bus data
    const busData = [
        { number: 'Bus 1', route: 'Route A', driver: 'John Doe', contact: '1234567890', lat: 51.505, lon: -0.09, status: 'on-time' },
        { number: 'Bus 2', route: 'Route B', driver: 'Jane Smith', contact: '0987654321', lat: 51.515, lon: -0.1, status: 'delayed' },
        { number: 'Bus 3', route: 'Route C', driver: 'Robert Brown', contact: '1234509876', lat: 51.525, lon: -0.11, status: 'on-time' },
        { number: 'Bus 4', route: 'Route D', driver: 'Lucy Green', contact: '9876501234', lat: 51.535, lon: -0.12, status: 'off-duty' },
        { number: 'Bus 5', route: 'Route E', driver: 'Michael White', contact: '8765432109', lat: 51.545, lon: -0.13, status: 'on-time' },
        { number: 'Bus 6', route: 'Route F', driver: 'Sara Black', contact: '5647382910', lat: 51.555, lon: -0.14, status: 'delayed' },
        { number: 'Bus 7', route: 'Route G', driver: 'David Blue', contact: '7482910564', lat: 51.565, lon: -0.15, status: 'on-time' },
        { number: 'Bus 8', route: 'Route H', driver: 'Emma Yellow', contact: '1827364545', lat: 51.575, lon: -0.16, status: 'off-duty' },
        { number: 'Bus 9', route: 'Route I', driver: 'Olivia Red', contact: '5678943210', lat: 51.585, lon: -0.17, status: 'on-time' },
        { number: 'Bus 10', route: 'Route J', driver: 'Liam Green', contact: '9874563210', lat: 51.595, lon: -0.18, status: 'delayed' },
        { number: 'Bus 11', route: 'Route K', driver: 'Noah White', contact: '4567890123', lat: 51.605, lon: -0.19, status: 'on-time' },
        { number: 'Bus 12', route: 'Route L', driver: 'Sophia Blue', contact: '7896543210', lat: 51.615, lon: -0.20, status: 'off-duty' },
        { number: 'Bus 13', route: 'Route M', driver: 'William Black', contact: '3456789012', lat: 51.625, lon: -0.21, status: 'on-time' },
        { number: 'Bus 14', route: 'Route N', driver: 'James Yellow', contact: '1237894560', lat: 51.635, lon: -0.22, status: 'delayed' },
        { number: 'Bus 15', route: 'Route O', driver: 'Isabella Red', contact: '9876541230', lat: 51.645, lon: -0.23, status: 'on-time' },
        { number: 'Bus 16', route: 'Route P', driver: 'Mia Green', contact: '8765432190', lat: 51.655, lon: -0.24, status: 'off-duty' },
    ];

    // Add markers to map
    busData.forEach(bus => {
        L.marker([bus.lat, bus.lon])
            .addTo(map)
            .bindPopup(`<b>${bus.number}</b><br>Route: ${bus.route}<br>Driver: ${bus.driver}`);
    });

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

    const statusChart = new Chart(statusCtx, {
        type: 'pie',
        data: {
            labels: ['On-time', 'Delayed', 'Off-duty'],
            datasets: [{
                data: [statusData.onTime, statusData.delayed, statusData.offDuty],
                backgroundColor: ['#4CAF50', '#FF9800', '#F44336']
            }]
        }
    });

    const routeChart = new Chart(routeCtx, {
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

    // Populate bus details table
    const busTableBody = document.getElementById('busTable').querySelector('tbody');
    busData.forEach(bus => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${bus.number}</td><td>${bus.route}</td><td>${bus.driver}</td><td>${bus.contact}</td>`;
        busTableBody.appendChild(row);
    });

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
    document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
});
