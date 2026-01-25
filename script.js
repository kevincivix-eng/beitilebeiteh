// Locations Data
const locations = {
    "אל קסום": { lat: 31.28444, lng: 34.91611, label: "אל קסום" }, // Al-Sayyid
    "חורה": { lat: 31.300400, lng: 34.935688, label: "חורה" },
    "כסיפה": { lat: 31.245278, lng: 35.092778, label: "כסיפה" },
    "לקיה": { lat: 31.324884, lng: 34.866219, label: "לקיה" },
    "תל שבע": { lat: 31.246667, lng: 34.856111, label: "תל שבע" },
    "ערערה בנגב": { lat: 31.160927, lng: 35.019757, label: "ערערה בנגב" },
    "נווה מדבר": { lat: 31.02417, lng: 34.70417, label: "נווה מדבר" }, // Bir Hadaj
    "רהט": { lat: 31.39547, lng: 34.75699, label: "רהט" },
    "שגב שלום": { lat: 31.19918, lng: 34.83956, label: "שגב שלום" },
    "ערד": { lat: 31.2588, lng: 35.2128, label: "ערד" },
    "חברון": { lat: 31.5326, lng: 35.0998, label: "חברון" }
};

// Flow Data (From User Table)
// Fallback Data (Static)
const fallbackFlows = [
    { "from": "תל שבע", "to": "נווה מדבר", "count": 1 },
    { "from": "חורה", "to": "לקיה", "count": 1 },
    { "from": "ערערה בנגב", "to": "כסיפה", "count": 205 },
    { "from": "כסיפה", "to": "חברון", "count": 1 },
    { "from": "תל שבע", "to": "תל שבע", "count": 4 },
    { "from": "אל קסום", "to": "לקיה", "count": 1 },
    { "from": "שגב שלום", "to": "נווה מדבר", "count": 3 },
    { "from": "לקיה", "to": "לקיה", "count": 5 },
    { "from": "חורה", "to": "ערערה בנגב", "count": 1 },
    { "from": "לקיה", "to": "אל קסום", "count": 5 },
    { "from": "חורה", "to": "כסיפה", "count": 4 },
    { "from": "כסיפה", "to": "כסיפה", "count": 32 },
    { "from": "ערערה בנגב", "to": "תל שבע", "count": 5 },
    { "from": "חורה", "to": "חברון", "count": 2 },
    { "from": "ערערה בנגב", "to": "ערערה בנגב", "count": 142 },
    { "from": "רהט", "to": "לקיה", "count": 4 },
    { "from": "אל קסום", "to": "אל קסום", "count": 1 },
    { "from": "כסיפה", "to": "חורה", "count": 2 },
    { "from": "ערערה בנגב", "to": "שגב שלום", "count": 8 },
    { "from": "לקיה", "to": "חורה", "count": 1 },
    { "from": "ערערה בנגב", "to": "לקיה", "count": 2 },
    { "from": "כסיפה", "to": "נווה מדבר", "count": 1 },
    { "from": "חורה", "to": "אל קסום", "count": 12 },
    { "from": "ערערה בנגב", "to": "אל קסום", "count": 13 },
    { "from": "כסיפה", "to": "אל קסום", "count": 2 },
    { "from": "תל שבע", "to": "שגב שלום", "count": 1 },
    { "from": "ערערה בנגב", "to": "חברון", "count": 121 },
    { "from": "רהט", "to": "רהט", "count": 27 },
    { "from": "נווה מדבר", "to": "נווה מדבר", "count": 5 },
    { "from": "אל קסום", "to": "תל שבע", "count": 1 },
    { "from": "חורה", "to": "חורה", "count": 25 },
    { "from": "תל שבע", "to": "אל קסום", "count": 2 },
    { "from": "ערערה בנגב", "to": "נווה מדבר", "count": 152 },
    { "from": "ערערה בנגב", "to": "חורה", "count": 31 },
    { "from": "אחר", "to": "רהט", "count": 1 },
    { "from": "שגב שלום", "to": "שגב שלום", "count": 2 },
    { "from": "ערד", "to": "כסיפה", "count": 1 },
    { "from": "רהט", "to": "אל קסום", "count": 7 },
    { "from": "אל קסום", "to": "חורה", "count": 1 }
];

// Flow Data State
let flows = [];


// Airtable Configuration
const AIRTABLE_API_KEY = ""; // TODO: Replace with secure secret management
const AIRTABLE_BASE_ID = "appOPXerkRuO4YH1D";
const AIRTABLE_TABLE_NAME = "EVENT";

// Fetch Flows from Airtable
async function fetchFlows() {
    console.log("Fetching flows from Airtable...");
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;

    let allRecords = [];
    let offset = null;
    let keepFetching = true;

    // Show Loading
    const mapDiv = document.getElementById('map');
    const loader = document.createElement('div');
    loader.id = 'map-loader';
    loader.innerHTML = '<div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background:rgba(0,0,0,0.7); color:white; padding:20px; border-radius:10px; z-index:9999;">טוען נתונים...</div>';
    mapDiv.appendChild(loader);

    try {
        while (keepFetching) {
            let fetchUrl = `${url}?fields%5B%5D=מאיפה%20יוצאת%20המסירה&fields%5B%5D=לאן%20נמסרת`;
            if (offset) fetchUrl += `&offset=${offset}`;

            const response = await fetch(fetchUrl, {
                headers: {
                    Authorization: `Bearer ${AIRTABLE_API_KEY}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error ? errorData.error.message : response.statusText);
            }

            const data = await response.json();
            allRecords = [...allRecords, ...data.records];

            if (data.offset) {
                offset = data.offset;
            } else {
                keepFetching = false;
            }
        }

        console.log(`Fetched ${allRecords.length} records.`);
        processAirtableData(allRecords);

    } catch (error) {
        console.error("Error fetching Airtable data:", error);
        alert(`שגיאה בחיבור ל-Airtable:\n${error.message}\n\nטוען נתונים שנשמרו במטמון (Static Data)...`);

        // Use fallback
        flows = fallbackFlows;
        drawFlows();

    } finally {
        if (loader) loader.remove();
    }
}

// Process Airtable Data into Flows
function processAirtableData(records) {
    const flowCounts = {};
    const knownLocations = Object.keys(locations);

    records.forEach(record => {
        const fields = record.fields;
        // Adjust field names based on actual Airtable columns
        const origin = fields['מאיפה יוצאת המסירה'];
        // Destination might be a string with commas if multiple? 
        // Based on CSV, it was "לאן נמסרת" and sometimes comma separated.
        // Airtable "Multiple Select" or "Link to another record" comes as an array. 
        // If it's a long text string (like CSV import), it's a string.
        let destinations = fields['לאן נמסרת'];

        if (!origin || !destinations) return;

        // Normalize destinations to array
        let destArray = [];
        if (Array.isArray(destinations)) {
            destArray = destinations;
        } else if (typeof destinations === 'string') {
            destArray = destinations.split(',').map(d => d.trim());
        }

        // Clean Origin
        const cleanOrigin = origin.trim();

        destArray.forEach(dest => {
            const cleanDest = dest.trim();
            if (!cleanDest) return;

            // Only count if valid locations (optional, but good for map safety)
            // if (!knownLocations.includes(cleanOrigin) || !knownLocations.includes(cleanDest)) return;

            const key = `${cleanOrigin}|${cleanDest}`;
            flowCounts[key] = (flowCounts[key] || 0) + 1;
        });
    });

    // Convert to Array
    flows = Object.keys(flowCounts).map(key => {
        const [from, to] = key.split('|');
        return { from, to, count: flowCounts[key] };
    });

    console.log("Processed Flows:", flows);
    drawFlows();
    updateLegendUI(); // Update legend with new data logic if needed
}

// Initialize Map
const map = L.map('map', {
    center: [31.25, 34.9], // Centered roughly on the region
    zoom: 11,
    zoomControl: false // We'll add it back in a better position or style if needed
});

// Dark Theme Tile Layer
// Tile Layers
const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
});



// Add default layer
darkLayer.addTo(map);

// Theme Toggle Logic


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
    "שגב שלום": "#FFFFFF",      // White
    "ערד": "#FF3333",           // Red
    "חברון": "#33FF99"          // Mint Green
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
    thickness: null,
    viewMode: 'outbound' // 'outbound' (default) or 'inbound'
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

        // Determine which location to check based on mode
        const flowLoc = filters.viewMode === 'outbound' ? flow.from : flow.to;

        const locationMatch = !filters.location || flowLoc === filters.location;
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

// Draw Flows Function
function drawFlows() {
    // Clear existing layers
    flows.forEach(flow => {
        if (flow.layers) {
            flow.layers.forEach(layer => map.removeLayer(layer));
        }
        flow.layers = [];
    });

    flows.forEach(flow => {
        try {
            const isOutbound = filters.viewMode === 'outbound';

            // Determine Visual Start/End based on mode
            // Outbound: From -> To (Arrow points to To)
            // Inbound: To -> From (Arrow points to From) - This gives the "Reversed Arrow" effect
            const visualSourceKey = isOutbound ? flow.from : flow.to;
            const visualTargetKey = isOutbound ? flow.to : flow.from;

            const start = locations[visualSourceKey];
            const end = locations[visualTargetKey];

            if (!start || !end) return;

            // Color:
            // If Outbound: Color by Origin (Source).
            // If Inbound: Color by Destination (Target) as requested.
            const colorKey = isOutbound ? flow.from : flow.to;
            const color = getColor(colorKey);

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
                    <div class="popup-stat">העברות: <strong>${flow.count}</strong></div>
                `);
                flow.layers.push(circle);
                return;
            }

            // Calculate Curved Parallel Path based on VISUAL direction
            const offset = 0.002;
            const latlngs = getCurvedOffsetPath([start.lat, start.lng], [end.lat, end.lng], offset);

            // 1. Base Colored Line (Visual Direction)
            const polyline = L.polyline(latlngs, {
                color: color,
                weight: getWeight(flow.count),
                opacity: 0.8
            }).addTo(map);

            // Tooltip Content
            // Hebrew RTL: We want "Origin -> Destination".
            // In RTL, this means "Origin" (Right) + Left Arrow + "Destination" (Left).
            // So the string should be: "${flow.from} &larr; ${flow.to}"
            const tooltipText = `${flow.from} &larr; ${flow.to}`;

            polyline.bindTooltip(`
                <div class="popup-title">${tooltipText}</div>
                <div class="popup-stat">העברות: <strong>${flow.count}</strong></div>
            `, {
                sticky: true,
                direction: 'top',
                className: 'custom-tooltip'
            });
            flow.layers.push(polyline);

            // 2. Animated Overlay Line (White Dash)
            // CRITICAL: Animation must always move From -> To (Physical Flow).
            // If isOutbound (Visual: From -> To), use latlngs as is.
            // If Inbound (Visual: To -> From), use REVERSED latlngs to move From -> To.
            const animLatlngs = isOutbound ? latlngs : latlngs.slice().reverse();

            const animPolyline = L.polyline(animLatlngs, {
                color: 'white',
                weight: Math.max(2, getWeight(flow.count) / 3),
                opacity: 0.6,
                dashArray: '10, 80',
                className: 'flow-anim'
            }).addTo(map);
            flow.layers.push(animPolyline);

            // Add Arrow Decorator
            // Follows the Visual Line (latlngs)
            // Outbound: Points to To.
            // Inbound: Points to From.
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

        } catch (e) {
            console.error(e);
        }
    });

    // Re-apply filters
    updateMapVisibility();
}

// Initial Draw
// Initial Fetch
fetchFlows();

// Auto-update every 24 hours (86,400,000 ms)
setInterval(fetchFlows, 86400000);

// Add Legend
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'legend');
    L.DomEvent.disableClickPropagation(div);

    let legendHtml = '<h4>מקרא (לחץ לסינון)</h4>';

    // View Mode Toggle (Redesigned)
    const outboundIcon = `
        <svg class="view-mode-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 3L3 9h2v9h10v-9h2L10 3z" transform="translate(-2, 2)"/>
            <path d="M16 13h6m-2-2l2 2-2 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `; // House (Left) + Arrow Out (Right)

    const inboundIcon = `
        <svg class="view-mode-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 3L3 9h2v9h10v-9h2L10 3z" transform="translate(-2, 2)"/>
            <path d="M22 13h-6m2-2l-2 2 2 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `; // House (Left) + Arrow In (Right)

    legendHtml += `
        <div class="view-mode-container">
            <div id="view-mode-label" class="view-mode-label">מוצא החפץ</div>
            <div id="view-mode-btn" class="view-mode-btn" title="לחץ להחלפת מצב">
                ${outboundIcon}
            </div>
        </div>
    `;

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

    setTimeout(() => {
        // Filter Click Listeners
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

                const resetBtn = div.querySelector('#reset-filters');
                resetBtn.style.display = (filters.location || filters.thickness) ? 'block' : 'none';
            });
        });

        // Reset Button
        div.querySelector('#reset-filters').addEventListener('click', function () {
            filters.location = null;
            filters.thickness = null;
            updateMapVisibility();
            this.style.display = 'none';
        });

        // View Mode Toggle Listener
        div.querySelector('#view-mode-btn').addEventListener('click', function () {
            filters.viewMode = filters.viewMode === 'outbound' ? 'inbound' : 'outbound';
            filters.location = null; // Reset location filter

            drawFlows(); // Redraw arrows

            // Update UI (Label and Icon)
            const label = div.querySelector('#view-mode-label');
            const btn = div.querySelector('#view-mode-btn');

            if (filters.viewMode === 'outbound') {
                label.textContent = 'מוצא החפץ';
                btn.innerHTML = outboundIcon;
            } else {
                label.textContent = 'יעד החפץ';
                btn.innerHTML = inboundIcon;
            }

            // Hide reset button
            div.querySelector('#reset-filters').style.display = 'none';
        });

    }, 0);

    return div;
};
legend.addTo(map);
