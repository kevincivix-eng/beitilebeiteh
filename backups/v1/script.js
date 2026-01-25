// Locations Data
const locations = {
    "אל קסום": { lat: 31.28444, lng: 34.91611, label: "אל קסום (אל-סייד)" }, // Al-Sayyid
    "חורה": { lat: 31.300400, lng: 34.935688, label: "חורה" },
    "כסיפה": { lat: 31.245278, lng: 35.092778, label: "כסיפה" },
    "לקיה": { lat: 31.324884, lng: 34.866219, label: "לקיה" },
    "תל שבע": { lat: 31.246667, lng: 34.856111, label: "תל שבע" },
    "ערערה בנגב": { lat: 31.160927, lng: 35.019757, label: "ערערה בנגב" },
    "נווה מדבר": { lat: 31.02417, lng: 34.70417, label: "נווה מדבר (ביר הדאג')" }, // Bir Hadaj
    "רהט": { lat: 31.39547, lng: 34.75699, label: "רהט" },
    "שגב שלום": { lat: 31.19918, lng: 34.83956, label: "שגב שלום" }
};

// Flow Data (From User Table)
const flows = [
    { from: "אל קסום", to: "כסיפה", count: 1 },
    { from: "אל קסום", to: "אל קסום", count: 1 }, // Self-loop
    { from: "אל קסום", to: "חורה", count: 1 },
    { from: "אל קסום", to: "לקיה", count: 1 },
    { from: "אל קסום", to: "תל שבע", count: 1 },
    { from: "חורה", to: "אל קסום", count: 11 },
    { from: "חורה", to: "חורה", count: 22 }, // Self-loop
    { from: "חורה", to: "כסיפה", count: 4 },
    { from: "חורה", to: "לקיה", count: 1 },
    { from: "חורה", to: "ערערה בנגב", count: 1 },
    { from: "כסיפה", to: "אל קסום", count: 1 },
    { from: "כסיפה", to: "חורה", count: 2 },
    { from: "כסיפה", to: "כסיפה", count: 27 }, // Self-loop
    { from: "כסיפה", to: "נווה מדבר", count: 1 },
    { from: "לקיה", to: "אל קסום", count: 3 },
    { from: "לקיה", to: "לקיה", count: 2 }, // Self-loop
    { from: "נווה מדבר", to: "נווה מדבר", count: 4 }, // Self-loop
    { from: "ערערה בנגב", to: "אל קסום", count: 12 },
    { from: "ערערה בנגב", to: "חורה", count: 29 },
    { from: "ערערה בנגב", to: "כסיפה", count: 199 },
    { from: "ערערה בנגב", to: "לקיה", count: 2 },
    { from: "ערערה בנגב", to: "נווה מדבר", count: 139 },
    { from: "ערערה בנגב", to: "ערערה בנגב", count: 121 }, // Self-loop
    { from: "ערערה בנגב", to: "שגב שלום", count: 8 },
    { from: "ערערה בנגב", to: "תל שבע", count: 5 },
    { from: "רהט", to: "אל קסום", count: 6 },
    { from: "רהט", to: "לקיה", count: 4 },
    { from: "רהט", to: "רהט", count: 24 }, // Self-loop
    { from: "שגב שלום", to: "נווה מדבר", count: 2 },
    { from: "שגב שלום", to: "שגב שלום", count: 2 }, // Self-loop
    { from: "תל שבע", to: "אל קסום", count: 2 },
    { from: "תל שבע", to: "נווה מדבר", count: 1 },
    { from: "תל שבע", to: "שגב שלום", count: 1 },
    { from: "תל שבע", to: "תל שבע", count: 4 } // Self-loop
];

// Initialize Map
const map = L.map('map', {
    center: [31.25, 34.9], // Centered roughly on the region
    zoom: 11,
    zoomControl: false // We'll add it back in a better position or style if needed
});

// Dark Theme Tile Layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// Add Zoom Control to top-left (RTL friendly)
L.control.zoom({
    position: 'topleft'
}).addTo(map);

// Add Markers
Object.keys(locations).forEach(key => {
    const loc = locations[key];

    // Circle Marker
    L.circleMarker([loc.lat, loc.lng], {
        radius: 6,
        fillColor: "#00ffcc",
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map).bindPopup(`<div class="popup-title">${loc.label}</div>`);

    // Text Label
    L.marker([loc.lat, loc.lng], {
        icon: L.divIcon({
            className: 'location-label',
            html: loc.label,
            iconSize: [100, 20],
            iconAnchor: [50, -10] // Position slightly above/below
        })
    }).addTo(map);
});

// Helper to calculate line weight based on count (Tiered System)
function getWeight(count) {
    if (count <= 10) {
        return 4; // Visible thin line
    } else if (count <= 50) {
        return 8; // Medium line
    } else {
        return 14; // Thick line
    }
}

// Color Palette for Locations (Neon/Bright for Dark Mode)
const locationColors = {
    "אל קסום": "#FF00FF",       // Magenta
    "חורה": "#00FFFF",          // Cyan
    "כסיפה": "#FFFF00",         // Yellow
    "לקיה": "#FF8800",          // Orange
    "תל שבע": "#00FF00",        // Lime Green
    "ערערה בנגב": "#FF0088",    // Pink
    "נווה מדבר": "#8800FF",     // Purple
    "רהט": "#0088FF",           // Blue
    "שגב שלום": "#FFFFFF"       // White
};

// Helper to get color based on count (optional, can be uniform)
function getColor(fromLocation) {
    return locationColors[fromLocation] || "#999999";
}

// Helper function to generate points for a curved parallel path
function getCurvedOffsetPath(start, end, offsetAmount) {
    const lat1 = start[0];
    const lng1 = start[1];
    const lat2 = end[0];
    const lng2 = end[1];

    const dx = lng2 - lng1;
    const dy = lat2 - lat1;
    const len = Math.sqrt(dx * dx + dy * dy);

    if (len === 0) return [start, end];

    // 1. Calculate Offset Start and End Points (Shift Right)
    // Right Normal: (dy, -dx)
    const uDx = (dy / len) * offsetAmount;
    const uDy = (-dx / len) * offsetAmount;

    const offLat1 = lat1 + uDy;
    const offLng1 = lng1 + uDx;
    const offLat2 = lat2 + uDy;
    const offLng2 = lng2 + uDx;

    // 2. Calculate Control Point for Bezier Curve
    // We want a slight curve to the right relative to the new line
    const midLat = (offLat1 + offLat2) / 2;
    const midLng = (offLng1 + offLng2) / 2;

    // Curvature amount (0.1 is subtle, 0.2 is more pronounced)
    const curvature = 0.15;

    // Calculate Normal vector for curvature (Right side)
    // Vector (dx, dy). Right Normal is (dy, -dx).
    const normX = dy;
    const normY = -dx;

    const controlLat = midLat + (normY * curvature);
    const controlLng = midLng + (normX * curvature);

    // 3. Generate Bezier Points
    const points = [];
    for (let t = 0; t <= 1; t += 0.05) {
        const lat = (1 - t) * (1 - t) * offLat1 + 2 * (1 - t) * t * controlLat + t * t * offLat2;
        const lng = (1 - t) * (1 - t) * offLng1 + 2 * (1 - t) * t * controlLng + t * t * offLng2;
        points.push([lat, lng]);
    }
    return points;
}

// Filter State
const filters = {
    location: null,
    thickness: null
};

// Helper to check thickness range
function checkThickness(count, range) {
    if (range === 'low') return count <= 10;
    if (range === 'medium') return count > 10 && count <= 50;
    if (range === 'high') return count > 50;
    return true;
}

// Function to update map visibility based on filters
function updateMapVisibility() {
    flows.forEach(flow => {
        if (!flow.layers) return;

        const locationMatch = !filters.location || flow.from === filters.location;
        const thicknessMatch = !filters.thickness || checkThickness(flow.count, filters.thickness);

        const isVisible = locationMatch && thicknessMatch;

        flow.layers.forEach(layer => {
            if (isVisible) {
                if (!map.hasLayer(layer)) map.addLayer(layer);
            } else {
                if (map.hasLayer(layer)) map.removeLayer(layer);
            }
        });
    });

    // Update Legend UI
    updateLegendUI();
}

function updateLegendUI() {
    // Locations
    document.querySelectorAll('.legend-item[data-type="location"]').forEach(item => {
        const loc = item.getAttribute('data-value');
        if (filters.location === loc) {
            item.classList.add('active-filter');
            item.style.opacity = '1';
            item.style.fontWeight = 'bold';
            item.style.borderLeft = '3px solid white';
        } else {
            item.classList.remove('active-filter');
            item.style.opacity = filters.location ? '0.4' : '1';
            item.style.fontWeight = 'normal';
            item.style.borderLeft = '3px solid transparent';
        }
    });

    // Thickness
    document.querySelectorAll('.legend-item[data-type="thickness"]').forEach(item => {
        const range = item.getAttribute('data-value');
        if (filters.thickness === range) {
            item.classList.add('active-filter');
            item.style.opacity = '1';
            item.style.fontWeight = 'bold';
            item.style.borderLeft = '3px solid white';
        } else {
            item.classList.remove('active-filter');
            item.style.opacity = filters.thickness ? '0.4' : '1';
            item.style.fontWeight = 'normal';
            item.style.borderLeft = '3px solid transparent';
        }
    });
}

// Draw Flows
flows.forEach(flow => {
    try {
        flow.layers = []; // Store layers for toggling

        const start = locations[flow.from];
        const end = locations[flow.to];

        if (!start || !end) {
            console.warn(`Missing location data for flow: ${flow.from} -> ${flow.to}`);
            return;
        }

        const color = getColor(flow.from);

        // Handle Self-Loops (Circle)
        if (flow.from === flow.to) {
            const circle = L.circleMarker([start.lat, start.lng], {
                radius: 10 + getWeight(flow.count),
                color: color,
                fill: false,
                weight: getWeight(flow.count) / 2,
                opacity: 0.8
            }).addTo(map).bindPopup(`
                <div class="popup-title">${flow.from} &larr; ${flow.from}</div>
                <div class="popup-stat">כמות: ${flow.count}</div>
            `);
            flow.layers.push(circle);
            console.log(`Drawn self-loop for ${flow.from}`);
            return;
        }

        // Calculate Curved Parallel Path
        const offset = 0.002;
        const latlngs = getCurvedOffsetPath([start.lat, start.lng], [end.lat, end.lng], offset);

        const polyline = L.polyline(latlngs, {
            color: color,
            weight: getWeight(flow.count),
            opacity: 0.8
        }).addTo(map);

        polyline.bindPopup(`
            <div class="popup-title">${flow.from} &rarr; ${flow.to}</div>
            <div class="popup-stat">כמות: ${flow.count}</div>
        `);
        flow.layers.push(polyline);

        // Add Arrow Decorator
        const decorator = L.polylineDecorator(polyline, {
            patterns: [
                {
                    offset: '55%',
                    repeat: 0,
                    symbol: L.Symbol.arrowHead({
                        pixelSize: 10 + getWeight(flow.count),
                        polygon: false,
                        pathOptions: {
                            stroke: true,
                            color: color,
                            weight: getWeight(flow.count)
                        }
                    })
                }
            ]
        }).addTo(map);
        flow.layers.push(decorator);

        console.log(`Drawn flow from ${flow.from} to ${flow.to}`);

    } catch (e) {
        console.error(`Error drawing flow from ${flow.from} to ${flow.to}:`, e);
    }
});

// Add Legend
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'legend');

    // Prevent map clicks from propagating to the map when clicking the legend
    L.DomEvent.disableClickPropagation(div);

    let legendHtml = '<h4>מקרא (לחץ לסינון)</h4>';

    // Locations
    Object.keys(locationColors).forEach(loc => {
        legendHtml += `
            <div class="legend-item" data-type="location" data-value="${loc}" style="cursor: pointer; padding: 2px 5px; margin-bottom: 2px; transition: all 0.2s;">
                <span>${loc}</span>
                <span class="legend-line" style="height: 4px; width: 30px; background-color: ${locationColors[loc]};"></span>
            </div>
        `;
    });

    legendHtml += `
        <hr style="border: 0; border-top: 1px solid #555; margin: 8px 0;">
        <h4>עובי קו (כמות)</h4>
        <div class="legend-item" data-type="thickness" data-value="low" style="cursor: pointer; padding: 2px 5px; margin-bottom: 2px; transition: all 0.2s;">
            <span>1-10</span>
            <span class="legend-line" style="height: 4px; width: 30px; background-color: #999;"></span>
        </div>
        <div class="legend-item" data-type="thickness" data-value="medium" style="cursor: pointer; padding: 2px 5px; margin-bottom: 2px; transition: all 0.2s;">
            <span>11-50</span>
            <span class="legend-line" style="height: 8px; width: 30px; background-color: #999;"></span>
        </div>
        <div class="legend-item" data-type="thickness" data-value="high" style="cursor: pointer; padding: 2px 5px; margin-bottom: 2px; transition: all 0.2s;">
            <span>50+</span>
            <span class="legend-line" style="height: 14px; width: 30px; background-color: #999;"></span>
        </div>
        <div id="reset-filters" style="margin-top: 10px; text-align: center; cursor: pointer; color: #aaa; font-size: 12px; text-decoration: underline; display: none;">
            נקה סינון
        </div>
    `;

    div.innerHTML = legendHtml;

    // Add Event Listeners after adding to DOM
    setTimeout(() => {
        const items = div.querySelectorAll('.legend-item');
        items.forEach(item => {
            item.addEventListener('click', function () {
                const type = this.getAttribute('data-type');
                const value = this.getAttribute('data-value');

                if (type === 'location') {
                    filters.location = filters.location === value ? null : value;
                } else if (type === 'thickness') {
                    filters.thickness = filters.thickness === value ? null : value;
                }

                updateMapVisibility();

                // Show/Hide Reset Button
                const resetBtn = div.querySelector('#reset-filters');
                if (filters.location || filters.thickness) {
                    resetBtn.style.display = 'block';
                } else {
                    resetBtn.style.display = 'none';
                }
            });
        });

        div.querySelector('#reset-filters').addEventListener('click', function () {
            filters.location = null;
            filters.thickness = null;
            updateMapVisibility();
            this.style.display = 'none';
        });
    }, 0);

    return div;
};
legend.addTo(map);
