/**
 * PromoMap Pro - Core Application Logic
 * Pure client-side store mapping & GDPR-compliant geocoding.
 * Stylized for Friends & Co POS Landingpage.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Application State
    let rawData = [];
    let headers = [];
    let mappedData = [];
    let importedFilesCount = 0; // Tracks how many files have been successfully imported
    let activeFilters = {
        search: '',
        status: 'all',
        city: 'all'
    };
    let map = null;
    let markerClusterGroup = null;
    let heatmapLayer = null;
    let markersList = []; // Kept to easily filter/remove
    let chartInstance = null;
    let cityChartInstance = null;
    let geocodingQueue = [];
    let isGeocoding = false;
    let geocodeCancelRequested = false;
    let currentMapTheme = 'dark';
    
    // Radius Search State
    let radiusCenterLatLng = null;
    let radiusCircle = null;
    let radiusInMeters = 10000;
    let isPickingCenter = false;

    // DOM Elements
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileNameText = document.getElementById('fileName');
    const resetImportBtn = document.getElementById('resetImport');
    const importPanel = document.getElementById('importPanel');
    const configPanel = document.getElementById('configPanel');
    const statsPanel = document.getElementById('statsPanel');
    const filterPanel = document.getElementById('filterPanel');
    const detailsPanel = document.getElementById('detailsPanel');
    const detailsContent = document.getElementById('detailsContent');
    const closeDetailsBtn = document.getElementById('closeDetails');
    const clusterSwitch = document.getElementById('clusterSwitch');
    const heatmapSwitch = document.getElementById('heatmapSwitch');
    const exportDataBtn = document.getElementById('exportDataBtn');
    const recenterMapBtn = document.getElementById('recenterMapBtn');
    
    // Search & Filter DOM
    const searchBar = document.getElementById('searchBar');
    const statusFilterBadges = document.getElementById('statusFilterBadges');
    const cityFilter = document.getElementById('cityFilter');

    // Modals
    const mappingModal = document.getElementById('mappingModal');
    const mappingForm = document.getElementById('mappingForm');
    const cancelMappingBtn = document.getElementById('cancelMappingBtn');
    const confirmMappingBtn = document.getElementById('confirmMappingBtn');

    const gdprModal = document.getElementById('gdprModal');
    const acceptGdprBtn = document.getElementById('acceptGdprBtn');
    const declineGdprBtn = document.getElementById('declineGdprBtn');
    const geocodingProgressWrapper = document.getElementById('geocodingProgressWrapper');
    const geoProgressBar = document.getElementById('geoProgressBar');
    const geoProgressText = document.getElementById('geoProgressText');
    const geoPercentText = document.getElementById('geoPercentText');
    const gdprModalFooter = document.getElementById('gdprModalFooter');

    // Stats DOM
    const totalStoresEl = document.getElementById('totalStores');
    const activePromosEl = document.getElementById('activePromos');

    // New DOM Elements
    const cancelGeocodingBtn = document.getElementById('cancelGeocodingBtn');
    const tileSourceSelect = document.getElementById('tileSourceSelect');
    const offlinePathGroup = document.getElementById('offlinePathGroup');
    const offlinePathInput = document.getElementById('offlinePathInput');
    const setRadiusCenterBtn = document.getElementById('setRadiusCenterBtn');
    const radiusCenterSelect = document.getElementById('radiusCenterSelect');
    const radiusSliderWrapper = document.getElementById('radiusSliderWrapper');
    const filterRadiusSlider = document.getElementById('filterRadiusSlider');
    const radiusValueText = document.getElementById('radiusValueText');
    const resetRadiusBtn = document.getElementById('resetRadiusBtn');

    // Control Table DOM
    const toggleControlTableBtn = document.getElementById('toggleControlTableBtn');
    const controlTableDrawer = document.getElementById('controlTableDrawer');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const controlTableBody = document.getElementById('controlTableBody');

    // Multi-Import DOM
    const loadedState = document.getElementById('loadedState');
    const loadedSummaryText = document.getElementById('loadedSummaryText');
    const addMoreFileBtn = document.getElementById('addMoreFileBtn');
    const resetAllBtn = document.getElementById('resetAllBtn');

    // 1. Initialize Map
    function initMap() {
        // Default coordinates centered on Germany
        map = L.map('map', {
            zoomControl: false
        }).setView([51.1657, 10.4515], 6);

        // Add custom Zoom Control to top-right
        L.control.zoom({
            position: 'topright'
        }).addTo(map);

        setMapTheme(currentMapTheme);
        
        // Initialize layers
        markerClusterGroup = L.markerClusterGroup({
            showCoverageOnHover: false,
            maxClusterRadius: 50
        });
        map.addLayer(markerClusterGroup);

        // Map Click Event for radius search center selection
        map.on('click', (e) => {
            if (isPickingCenter) {
                isPickingCenter = false;
                radiusCenterLatLng = e.latlng;
                
                document.body.classList.remove('picking-center');
                setRadiusCenterBtn.innerHTML = '<i class="fa-solid fa-crosshairs"></i> Zentrum setzen';
                setRadiusCenterBtn.classList.remove('btn-secondary');
                
                if (radiusCenterSelect) radiusCenterSelect.value = ''; // Custom clicked coordinates
                updateRadiusCircle();
                if (radiusSliderWrapper) radiusSliderWrapper.style.display = 'block';
                applyFilters();
            }
        });
    }

    // Set Map Layer based on theme (using CartoDB tile layers for a highly premium aesthetic)
    const lightTiles = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    const darkTiles = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
    let tileLayerInstance = null;

    function setMapTheme(theme) {
        if (tileLayerInstance) {
            map.removeLayer(tileLayerInstance);
        }
        
        const tileSource = tileSourceSelect?.value || 'online';
        let tilesUrl;
        if (tileSource === 'offline') {
            tilesUrl = offlinePathInput?.value || 'tiles/{z}/{x}/{y}.png';
        } else {
            tilesUrl = theme === 'dark' ? darkTiles : lightTiles;
        }
        
        tileLayerInstance = L.tileLayer(tilesUrl, {
            attribution: tileSource === 'offline' ? 'Lokale Kartendaten' : attribution,
            maxZoom: 19
        }).addTo(map);
    }

    // 2. Light / Dark Theme toggle
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        themeIcon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        currentMapTheme = newTheme;
        setMapTheme(newTheme);
        
        // Regenerate chart with theme colors if loaded
        if (mappedData.length > 0) {
            updateStatistics();
        }
    });

    // 3. File Import Handlers (Drag & Drop)
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
        }, false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            handleSelectedFile(files[0]);
        }
    });

    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleSelectedFile(e.target.files[0]);
        }
    });

    function handleSelectedFile(file) {
        fileNameText.textContent = file.name;
        dropZone.style.display = 'none';
        fileInfo.style.display = 'block';

        const reader = new FileReader();
        const extension = file.name.split('.').pop().toLowerCase();

        if (extension === 'csv') {
            reader.onload = function(e) {
                Papa.parse(e.target.result, {
                    header: true,
                    skipEmptyLines: true,
                    complete: function(results) {
                        if (results.data && results.data.length > 0) {
                            rawData = results.data;
                            headers = results.meta.fields || Object.keys(results.data[0]);
                            tryAutoMapOrShowModal();
                        } else {
                            showToast('Fehler: Die Datei ist leer oder konnte nicht geparst werden.', 'error');
                            resetImportState();
                        }
                    }
                });
            };
            reader.readAsText(file);
        } else if (extension === 'xlsx' || extension === 'xls') {
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
                
                if (json && json.length > 0) {
                    rawData = json;
                    headers = Object.keys(json[0]);
                    tryAutoMapOrShowModal();
                } else {
                    showToast('Fehler: Die Excel-Datei enthält keine nutzbaren Daten.', 'error');
                    resetImportState();
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            showToast('Ungültiges Dateiformat. Bitte nutze .csv, .xlsx oder .xls', 'error');
            resetImportState();
        }
    }

    resetImportBtn.addEventListener('click', () => {
        // If data already exists on the map, go back to the loaded state without wiping everything
        if (mappedData.length > 0) {
            rawData = [];
            headers = [];
            fileInput.value = '';
            showLoadedState();
        } else {
            resetImportState();
        }
    });

    function resetImportState() {
        rawData = [];
        headers = [];
        mappedData = [];
        markersList = [];
        importedFilesCount = 0;
        markerClusterGroup.clearLayers();
        if (heatmapLayer) {
            map.removeLayer(heatmapLayer);
            heatmapLayer = null;
        }
        
        // Reset Radius search
        resetRadiusSearch();

        // Destroy charts
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }
        if (cityChartInstance) {
            cityChartInstance.destroy();
            cityChartInstance = null;
        }

        fileInfo.style.display = 'none';
        if (loadedState) loadedState.style.display = 'none';
        dropZone.style.display = 'block';
        fileInput.value = '';
        
        configPanel.style.display = 'none';
        statsPanel.style.display = 'none';
        filterPanel.style.display = 'none';
        detailsPanel.style.display = 'none';
        if (toggleControlTableBtn) toggleControlTableBtn.style.display = 'none';
        if (controlTableDrawer) controlTableDrawer.classList.remove('active');
        if (controlTableBody) controlTableBody.innerHTML = '';
        
        map.setView([51.1657, 10.4515], 6);
        showToast('Import zurückgesetzt.', 'info');
    }

    // Show the loaded-state summary panel after a successful import
    function showLoadedState() {
        fileInfo.style.display = 'none';
        dropZone.style.display = 'none';
        if (loadedState) {
            loadedState.style.display = 'block';
            if (loadedSummaryText) {
                const fileWord = importedFilesCount === 1 ? 'Datei' : 'Dateien';
                loadedSummaryText.textContent = `${importedFilesCount} ${fileWord} · ${mappedData.length} Filialen auf der Karte`;
            }
        }
    }

    // Prepare the panel to accept an additional file without clearing existing map data
    function prepareAddMoreFile() {
        rawData = [];
        headers = [];
        fileInput.value = '';
        if (loadedState) loadedState.style.display = 'none';
        dropZone.style.display = 'block';
    }

    if (addMoreFileBtn) addMoreFileBtn.addEventListener('click', prepareAddMoreFile);
    if (resetAllBtn) resetAllBtn.addEventListener('click', resetImportState);

    // 4. Mapping Column Modal / Auto-Mapping
    function tryAutoMapOrShowModal() {
        const mapping = getAutoMappedFields();
        
        // We can process automatically if we have coordinates, a combined address, or at least some address info
        const hasCoords = mapping.latCol && mapping.lngCol;
        const hasAddress = mapping.addressCol;
        const hasStreetAndCity = mapping.streetCol && mapping.cityCol;
        const hasCity = mapping.cityCol;
        const hasZip = mapping.zipCol;
        const hasStreet = mapping.streetCol;

        if (hasCoords || hasAddress || hasStreetAndCity || hasCity || hasZip || hasStreet) {
            showToast('Spalten automatisch erkannt!', 'success');
            processMappedData(mapping);
        } else {
            // Fallback to manual selection modal
            showMappingModal();
        }
    }

    function getAutoMappedFields() {
        const headerLower = headers.map(h => h.toLowerCase().trim());
        
        const targetFields = [
            { key: 'name', keywords: ['name', 'filiale', 'bezeichnung', 'geschäft', 'store', 'titel', 'firma', 'kundenname', 'brand', 'shop', 'partner', 'outlet', 'kunde', 'point of interest', 'poi', 'standortname'] },
            { key: 'lat', keywords: ['latitude', 'breitengrad', 'lat', 'nord', 'latitude_y', 'latitude(y)', 'breite', 'y-koordinate', 'y_koordinate'] },
            { key: 'lng', keywords: ['longitude', 'längengrad', 'lng', 'lon', 'länge', 'ost', 'longitude_x', 'longitude(x)', 'x-koordinate', 'x_koordinate'] },
            { key: 'address', keywords: ['adresse', 'anschrift', 'address', 'full address', 'ort_und_strasse', 'kombi-adresse', 'kombiadresse', 'gesamtadresse', 'standortadresse'] },
            { key: 'street', keywords: ['straße', 'strasse', 'street', 'str', 'str.', 'hausnummer', 'hsnr'] },
            { key: 'zip', keywords: ['plz', 'zip', 'postleitzahl', 'postal', 'postalcode', 'pcode'] },
            { key: 'city', keywords: ['ort', 'stadt', 'city', 'gemeinde', 'ortschaft', 'town'] },
            { key: 'status', keywords: ['status', 'aktiv', 'promo', 'kampagne', 'promotion', 'status_filiale', 'state', 'phase', 'status_store'] }
        ];

        const mapped = {
            nameCol: '',
            latCol: '',
            lngCol: '',
            addressCol: '',
            streetCol: '',
            zipCol: '',
            cityCol: '',
            statusCol: ''
        };

        const assignedHeaders = new Set();
        const assignments = [];

        headers.forEach(header => {
            const h = header.toLowerCase().trim();
            targetFields.forEach(field => {
                let score = 0;
                
                // Special short matches
                if (field.key === 'lat' && h === 'y') score = 90;
                else if (field.key === 'lng' && h === 'x') score = 90;
                else {
                    for (let kw of field.keywords) {
                        if (h === kw) {
                            score = Math.max(score, 100);
                        } else if (h.startsWith(kw + ' ') || h.startsWith(kw + '_') || h.startsWith(kw + '-')) {
                            score = Math.max(score, 85);
                        } else if (h.includes(kw)) {
                            score = Math.max(score, 50);
                        }
                    }
                }

                if (score > 0) {
                    assignments.push({ header, key: field.key, score });
                }
            });
        });

        // Sort assignments by score descending
        assignments.sort((a, b) => b.score - a.score);

        // Greedy assign
        const assignedKeys = new Set();
        assignments.forEach(assign => {
            if (!assignedHeaders.has(assign.header) && !assignedKeys.has(assign.key)) {
                assignedHeaders.add(assign.header);
                assignedKeys.add(assign.key);
                mapped[assign.key + 'Col'] = assign.header;
            }
        });

        // Default to first column if no Name is found
        if (!mapped.nameCol && headers.length > 0) {
            let firstUnassigned = headers.find(h => !assignedHeaders.has(h));
            mapped.nameCol = firstUnassigned || headers[0];
        }

        return mapped;
    }

    function showMappingModal() {
        // Clear old choices
        const selectIds = ['mapName', 'mapAddress', 'mapStreet', 'mapZip', 'mapCity', 'mapLat', 'mapLng', 'mapStatus'];
        selectIds.forEach(id => {
            const select = document.getElementById(id);
            if (!select) return;
            select.innerHTML = '';
            
            // Add blank option
            const opt = document.createElement('option');
            opt.value = '';
            if (id === 'mapName') {
                opt.textContent = '-- Automatisch generieren --';
            } else {
                opt.textContent = '-- Nicht vorhanden / Keine Zuordnung --';
            }
            select.appendChild(opt);
            
            headers.forEach(header => {
                const opt = document.createElement('option');
                opt.value = header;
                opt.textContent = header;
                select.appendChild(opt);
            });
        });

        const mapping = getAutoMappedFields();
        if (mapping.nameCol) document.getElementById('mapName').value = mapping.nameCol;
        if (mapping.addressCol) document.getElementById('mapAddress').value = mapping.addressCol;
        if (mapping.streetCol) document.getElementById('mapStreet').value = mapping.streetCol;
        if (mapping.zipCol) document.getElementById('mapZip').value = mapping.zipCol;
        if (mapping.cityCol) document.getElementById('mapCity').value = mapping.cityCol;
        if (mapping.latCol) document.getElementById('mapLat').value = mapping.latCol;
        if (mapping.lngCol) document.getElementById('mapLng').value = mapping.lngCol;
        if (mapping.statusCol) document.getElementById('mapStatus').value = mapping.statusCol;

        mappingModal.classList.add('active');
    }

    cancelMappingBtn.addEventListener('click', () => {
        mappingModal.classList.remove('active');
        rawData = [];
        headers = [];
        fileInput.value = '';
        // If there is already data on the map, return to the loaded state instead of wiping everything
        if (mappedData.length > 0) {
            showLoadedState();
        } else {
            resetImportState();
        }
    });

    confirmMappingBtn.addEventListener('click', () => {
        // Collect mapping
        const nameCol = document.getElementById('mapName').value;
        const addressCol = document.getElementById('mapAddress').value;
        const streetCol = document.getElementById('mapStreet').value;
        const zipCol = document.getElementById('mapZip').value;
        const cityCol = document.getElementById('mapCity').value;
        const latCol = document.getElementById('mapLat').value;
        const lngCol = document.getElementById('mapLng').value;
        const statusCol = document.getElementById('mapStatus').value;

        const hasCoords = latCol && lngCol;
        const hasLocation = addressCol || streetCol || zipCol || cityCol;

        if (!hasCoords && !hasLocation) {
            showToast('Bitte ordne entweder GPS-Koordinaten oder mindestens ein Adressfeld zu.', 'error');
            return;
        }

        mappingModal.classList.remove('active');
        processMappedData({ nameCol, addressCol, streetCol, zipCol, cityCol, latCol, lngCol, statusCol });
    });

    // 5. Mapped Data Processing
    function processMappedData(mapping) {
        // Calculate an ID offset so new records never collide with existing ones
        const idOffset = mappedData.length > 0 ? (Math.max(...mappedData.map(d => d.id)) + 1) : 0;
        const newRecords = [];
        let missingCoordsCount = 0;
        importedFilesCount++;

        rawData.forEach((row, index) => {
            const name = mapping.nameCol && row[mapping.nameCol] ? String(row[mapping.nameCol]).trim() : `Filiale #${idOffset + index + 1}`;
            const address = mapping.addressCol && row[mapping.addressCol] ? String(row[mapping.addressCol]).trim() : '';
            const street = mapping.streetCol && row[mapping.streetCol] ? String(row[mapping.streetCol]).trim() : '';
            const zip = mapping.zipCol && row[mapping.zipCol] ? String(row[mapping.zipCol]).trim() : '';
            const city = mapping.cityCol && row[mapping.cityCol] ? String(row[mapping.cityCol]).trim() : '';
            
            let lat = null;
            let lng = null;
            if (mapping.latCol && row[mapping.latCol]) {
                lat = parseFloat(String(row[mapping.latCol]).replace(',', '.'));
            }
            if (mapping.lngCol && row[mapping.lngCol]) {
                lng = parseFloat(String(row[mapping.lngCol]).replace(',', '.'));
            }

            const status = mapping.statusCol && row[mapping.statusCol] ? 
                String(row[mapping.statusCol]).trim() : 'Aktiv';

            // Store original fields to preserve and export later
            const originalRow = { ...row };

            const record = {
                id: idOffset + index,
                name,
                address,
                street,
                zip,
                city,
                lat: (isNaN(lat) || lat === null) ? null : lat,
                lng: (isNaN(lng) || lng === null) ? null : lng,
                status,
                geocoded: (lat === null || lng === null || isNaN(lat) || isNaN(lng)),
                originalRow
            };

            if (record.lat === null || record.lng === null) {
                missingCoordsCount++;
            }

            newRecords.push(record);
        });

        // APPEND new records to existing map data instead of replacing
        mappedData = [...mappedData, ...newRecords];

        if (missingCoordsCount > 0) {
            // Trigger GDPR geocoding modal
            showGdprModal(missingCoordsCount);
        } else {
            // All coordinates present, directly render
            renderMapData();
            showLoadedState();
            const msg = idOffset > 0
                ? `${newRecords.length} Filialen hinzugefügt! Gesamt: ${mappedData.length}`
                : `${mappedData.length} Filialen erfolgreich eingelesen!`;
            showToast(msg, 'success');
        }
    }

    // 6. GDPR Geocoding logic
    function showGdprModal(count) {
        geocodingProgressWrapper.style.display = 'none';
        gdprModalFooter.style.display = 'flex';
        
        // Setup queue
        geocodingQueue = mappedData.filter(item => item.lat === null || item.lng === null);
        
        const warningTitle = document.querySelector('#gdprModal .modal-title');
        warningTitle.innerHTML = `<i class="fa-solid fa-shield-halved" style="margin-right: 0.5rem;"></i> Datenschutz-Zustimmung`;
        
        const bodyText = document.querySelector('#gdprModal .modal-body p');
        bodyText.textContent = `Für ${count} von ${mappedData.length} Filialen fehlen die GPS-Koordinaten in der Tabelle. Um sie auf der Karte anzuzeigen, müssen diese geokodiert werden.`;
        
        gdprModal.classList.add('active');
    }

    declineGdprBtn.addEventListener('click', () => {
        gdprModal.classList.remove('active');
        // Load only points that already have coordinates
        mappedData = mappedData.filter(item => item.lat !== null && item.lng !== null);
        if (mappedData.length > 0) {
            renderMapData();
            showLoadedState();
            showToast(`${mappedData.length} Filialen mit Koordinaten geladen.`, 'info');
        } else {
            showToast('Keine Filialen mit Koordinaten vorhanden. Import abgebrochen.', 'error');
            importedFilesCount = Math.max(0, importedFilesCount - 1);
            resetImportState();
        }
    });

    acceptGdprBtn.addEventListener('click', () => {
        startGeocodingQueue();
    });

    async function startGeocodingQueue() {
        isGeocoding = true;
        geocodeCancelRequested = false;
        
        gdprModalFooter.style.display = 'none';
        geocodingProgressWrapper.style.display = 'block';

        const totalToGeocode = geocodingQueue.length;
        let completed = 0;

        for (let i = 0; i < geocodingQueue.length; i++) {
            if (geocodeCancelRequested) break;

            const item = geocodingQueue[i];
            
            geoProgressText.textContent = `Geokodiere: ${item.name} (${item.city || (item.address ? (item.address.length > 20 ? item.address.substring(0, 20) + '...' : item.address) : '') || 'Unbekannt'})`;
            const percent = Math.round((completed / totalToGeocode) * 100);
            geoProgressBar.style.width = `${percent}%`;
            geoPercentText.textContent = `${percent}%`;

            try {
                const coords = await geocodeAddress(item.street, item.zip, item.city, item.address);
                if (coords) {
                    item.lat = coords.lat;
                    item.lng = coords.lng;
                    // Write back to original row representation so it gets exported correctly
                    item.originalRow['Latitude'] = coords.lat;
                    item.originalRow['Longitude'] = coords.lng;
                    item.originalRow['Breitengrad'] = coords.lat;
                    item.originalRow['Längengrad'] = coords.lng;
                }
            } catch (err) {
                console.error('Geocoding error for address', item, err);
            }

            completed++;
            // Throttle: Nominatim requires max 1 request/second
            await sleep(1100);
        }

        isGeocoding = false;
        gdprModal.classList.remove('active');
        
        // Remove items that still couldn't be geocoded IF we didn't cancel
        // If we canceled, we keep whatever has lat/lng and drop the rest from visual list
        const failedCount = mappedData.filter(item => item.lat === null || item.lng === null).length;
        mappedData = mappedData.filter(item => item.lat !== null && item.lng !== null);

        renderMapData();
        showLoadedState();

        if (geocodeCancelRequested) {
            showToast(`Geokodierung abgebrochen. ${mappedData.length} Filialen erfolgreich geladen.`, 'warning');
        } else if (failedCount > 0) {
            showToast(`${mappedData.length} Filialen geladen. ${failedCount} konnten nicht geokodiert werden.`, 'warning');
        } else {
            showToast(`Alle Filialen erfolgreich geladen und visualisiert!`, 'success');
        }
    }

    function geocodeAddress(street, zip, city, address) {
        let query = '';
        if (address) {
            query = address;
        } else {
            const parts = [];
            if (street) parts.push(street);
            if (zip || city) {
                const zipCity = `${zip || ''} ${city || ''}`.trim();
                if (zipCity) parts.push(zipCity);
            }
            query = parts.join(', ');
        }
        
        if (!query.trim()) {
            return Promise.resolve(null);
        }

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
        
        return fetch(url, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'PromoMapPro/1.0 (offline-mapping-app)'
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                };
            }
            return null;
        })
        .catch(() => null);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 7. Render Data on Map
    function renderMapData() {
        // Show Panels
        configPanel.style.display = 'block';
        statsPanel.style.display = 'block';
        filterPanel.style.display = 'block';
        if (toggleControlTableBtn) toggleControlTableBtn.style.display = 'block';

        // Populate filters
        populateFilters();
        
        // Build map markers
        buildMarkers();
        
        // Populate Control Table
        populateControlTable();
        
        // Update Stats & Charts
        updateStatistics();

        // Fit map bounds
        recenterMap();
    }

    function populateControlTable() {
        if (!controlTableBody) return;
        controlTableBody.innerHTML = '';

        mappedData.forEach((item, index) => {
            const tr = document.createElement('tr');
            
            // 1. Filialname
            const nameTd = document.createElement('td');
            nameTd.style.fontWeight = '600';
            nameTd.textContent = item.name;
            tr.appendChild(nameTd);

            // 2. Adresse (Eingabe)
            const addrTd = document.createElement('td');
            let formattedAddr = '';
            if (item.address) {
                formattedAddr = item.address;
            } else {
                const parts = [];
                if (item.street) parts.push(item.street);
                if (item.zip || item.city) {
                    parts.push(`${item.zip || ''} ${item.city || ''}`.trim());
                }
                formattedAddr = parts.join(', ');
            }
            addrTd.textContent = formattedAddr || '--';
            tr.appendChild(addrTd);

            // 3. GPS (Lat, Lng)
            const gpsTd = document.createElement('td');
            gpsTd.style.fontFamily = 'monospace';
            gpsTd.textContent = `${item.lat.toFixed(6)}, ${item.lng.toFixed(6)}`;
            tr.appendChild(gpsTd);

            // 4. Geokodierungs-Quelle
            const sourceTd = document.createElement('td');
            const badge = document.createElement('span');
            if (item.geocoded) {
                badge.className = 'status-badge geocoded';
                badge.textContent = 'OSM Nominatim';
            } else {
                badge.className = 'status-badge direct';
                badge.textContent = 'Direkt aus Datei';
            }
            sourceTd.appendChild(badge);
            tr.appendChild(sourceTd);

            // 5. Gegenprüfung (Karten)
            const checkTd = document.createElement('td');
            
            const osmLink = document.createElement('a');
            osmLink.href = `https://www.openstreetmap.org/?mlat=${item.lat}&mlon=${item.lng}#map=17/${item.lat}/${item.lng}`;
            osmLink.target = '_blank';
            osmLink.className = 'check-link';
            osmLink.innerHTML = '<i class="fa-solid fa-map"></i> OSM';
            
            const gmapsLink = document.createElement('a');
            gmapsLink.href = `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`;
            gmapsLink.target = '_blank';
            gmapsLink.className = 'check-link';
            gmapsLink.innerHTML = '<i class="fa-solid fa-map-location-dot"></i> Maps';

            checkTd.appendChild(osmLink);
            checkTd.appendChild(gmapsLink);
            tr.appendChild(checkTd);

            // 6. Aktion (Auf Karte zeigen)
            const actionTd = document.createElement('td');
            const showBtn = document.createElement('button');
            showBtn.className = 'action-btn-table';
            showBtn.textContent = 'Zeigen';
            showBtn.addEventListener('click', () => {
                const marker = markersList.find(m => m.storeData.id === item.id);
                if (marker) {
                    if (window.innerWidth < 768) {
                        controlTableDrawer.classList.remove('active');
                    }
                    map.setView(marker.getLatLng(), 15);
                    marker.fire('click');
                }
            });
            actionTd.appendChild(showBtn);
            tr.appendChild(actionTd);

            tr.dataset.id = item.id;
            controlTableBody.appendChild(tr);
        });
    }

    function populateFilters() {
        // Status badges
        const statuses = [...new Set(mappedData.map(item => item.status))];
        statusFilterBadges.innerHTML = '<span class="badge active" data-status="all">Alle</span>';
        
        statuses.forEach(status => {
            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.setAttribute('data-status', status);
            badge.textContent = status;
            
            badge.addEventListener('click', () => {
                document.querySelectorAll('#statusFilterBadges .badge').forEach(b => b.classList.remove('active'));
                badge.classList.add('active');
                activeFilters.status = status;
                applyFilters();
            });
            statusFilterBadges.appendChild(badge);
        });

        // Set default click event for 'All' badge
        document.querySelector('#statusFilterBadges .badge[data-status="all"]').addEventListener('click', (e) => {
            document.querySelectorAll('#statusFilterBadges .badge').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            activeFilters.status = 'all';
            applyFilters();
        });

        // City filter dropdown
        const cities = [...new Set(mappedData.map(item => item.city))].filter(c => c && c.trim() !== '').sort();
        cityFilter.innerHTML = '<option value="all">Alle Städte</option>';
        cities.forEach(city => {
            const opt = document.createElement('option');
            opt.value = city;
            opt.textContent = city;
            cityFilter.appendChild(opt);
        });

        // Populate Radius Search Center Selector
        if (radiusCenterSelect) {
            radiusCenterSelect.innerHTML = '<option value="">-- Filiale wählen --</option>';
            mappedData.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.id;
                opt.textContent = `${item.name}${item.city ? ' (' + item.city + ')' : ''}`;
                radiusCenterSelect.appendChild(opt);
            });
        }
    }

    // Resolve a CSS custom property to its actual computed hex/rgb value for use in Chart.js
    function getResolvedCSSVar(varName) {
        return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    }

    // Colors mapping based on store promotion status — returns real hex values Chart.js can render
    const STATUS_COLORS = {
        success: '#10b981',  // green  – aktiv / active
        warning: '#f59e0b',  // amber  – geplant / vorbereitung
        info:    '#06b6d4',  // cyan   – beendet / completed
        danger:  '#ef4444',  // red    – storniert / cancelled
        accent:  '#FD5001'   // orange – Friends & Co brand default
    };

    function getStatusColor(status) {
        const s = status.toLowerCase();
        if (s.includes('aktiv') || s.includes('active') || s.includes('läuft')) return STATUS_COLORS.success;
        if (s.includes('geplant') || s.includes('planned') || s.includes('vorbereitung')) return STATUS_COLORS.warning;
        if (s.includes('beendet') || s.includes('finished') || s.includes('completed')) return STATUS_COLORS.info;
        if (s.includes('storniert') || s.includes('cancelled') || s.includes('abgesagt')) return STATUS_COLORS.danger;
        return STATUS_COLORS.accent;
    }

    function buildMarkers() {
        // Clear existing markers
        markerClusterGroup.clearLayers();
        if (heatmapLayer) {
            map.removeLayer(heatmapLayer);
            heatmapLayer = null;
        }
        markersList = [];

        mappedData.forEach(item => {
            const color = getStatusColor(item.status);
            
            // Create premium custom map marker (glowing pulse icon)
            const icon = L.divIcon({
                className: 'custom-leaflet-marker',
                html: `<div class="custom-marker" style="background: ${color}; width: 18px; height: 18px; box-shadow: 0 0 10px ${color}"></div>`,
                iconSize: [18, 18],
                iconAnchor: [9, 9]
            });

            const marker = L.marker([item.lat, item.lng], { icon: icon });
            
            // Store item details on marker object
            marker.storeData = item;
            
            // Popups & interaction
            marker.on('click', () => {
                showStoreDetails(item);
            });
            
            markersList.push(marker);
        });

        // Layer arrangement based on settings
        updateMapLayers();
    }

    function updateMapLayers() {
        markerClusterGroup.clearLayers();
        if (heatmapLayer) {
            map.removeLayer(heatmapLayer);
            heatmapLayer = null;
        }

        // Apply filters to filter list
        const filteredMarkers = markersList.filter(marker => {
            const item = marker.storeData;
            
            // 1. Search text filter
            const matchesSearch = activeFilters.search === '' || 
                item.name.toLowerCase().includes(activeFilters.search) ||
                item.city.toLowerCase().includes(activeFilters.search) ||
                item.zip.includes(activeFilters.search) ||
                item.street.toLowerCase().includes(activeFilters.search);
            
            // 2. Status filter
            const matchesStatus = activeFilters.status === 'all' || item.status === activeFilters.status;
            
            // 3. City filter
            const matchesCity = activeFilters.city === 'all' || item.city === activeFilters.city;

            // 4. Radius filter
            let matchesRadius = true;
            if (radiusCenterLatLng) {
                const dist = radiusCenterLatLng.distanceTo(L.latLng(item.lat, item.lng));
                matchesRadius = dist <= radiusInMeters;
            }

            return matchesSearch && matchesStatus && matchesCity && matchesRadius;
        });

        // Add to map
        if (heatmapSwitch.checked) {
            // Build heatmap points
            const heatPoints = filteredMarkers.map(m => [m.getLatLng().lat, m.getLatLng().lng, 0.8]); // intensity
            heatmapLayer = L.heatLayer(heatPoints, {
                radius: 25,
                blur: 15,
                maxZoom: 17
            }).addTo(map);
        } else {
            if (clusterSwitch.checked) {
                filteredMarkers.forEach(m => markerClusterGroup.addLayer(m));
            } else {
                // Add directly to map through cluster group but without grouping
                filteredMarkers.forEach(m => map.addLayer(m));
            }
        }
    }

    function recenterMap() {
        const activeGroup = L.featureGroup(markersList.filter(m => {
            // Only center on markers that are currently visible by filters
            const item = m.storeData;
            return (activeFilters.status === 'all' || item.status === activeFilters.status) &&
                   (activeFilters.city === 'all' || item.city === activeFilters.city);
        }));

        if (activeGroup.getLayers().length > 0) {
            map.fitBounds(activeGroup.getBounds().pad(0.1));
        }
    }

    recenterMapBtn.addEventListener('click', recenterMap);

    // 8. Filters & Search listeners
    searchBar.addEventListener('input', (e) => {
        activeFilters.search = e.target.value.toLowerCase().trim();
        applyFilters();
    });

    cityFilter.addEventListener('change', (e) => {
        activeFilters.city = e.target.value;
        applyFilters();
    });

    clusterSwitch.addEventListener('change', updateMapLayers);
    heatmapSwitch.addEventListener('change', updateMapLayers);

    function applyFilters() {
        updateMapLayers();
        updateStatistics(true); // update counts, don't recreate full list
    }

    // 9. Statistics Dashboard
    function updateStatistics(onlyCount = false) {
        // Filter items matching active filters (except city filter for the city distribution chart)
        const filteredItems = mappedData.filter(item => {
            const matchesSearch = activeFilters.search === '' || 
                item.name.toLowerCase().includes(activeFilters.search) ||
                item.city.toLowerCase().includes(activeFilters.search) ||
                item.zip.includes(activeFilters.search) ||
                item.street.toLowerCase().includes(activeFilters.search);
            const matchesStatus = activeFilters.status === 'all' || item.status === activeFilters.status;
            const matchesCity = activeFilters.city === 'all' || item.city === activeFilters.city;
            
            let matchesRadius = true;
            if (radiusCenterLatLng) {
                const dist = radiusCenterLatLng.distanceTo(L.latLng(item.lat, item.lng));
                matchesRadius = dist <= radiusInMeters;
            }

            return matchesSearch && matchesStatus && matchesCity && matchesRadius;
        });

        // Set counts
        totalStoresEl.textContent = filteredItems.length;
        const activeCount = filteredItems.filter(item => {
            const s = item.status.toLowerCase();
            return s.includes('aktiv') || s.includes('active') || s.includes('läuft');
        }).length;
        activePromosEl.textContent = activeCount;

        // Render Chart.js
        renderStatusChart(filteredItems);
        renderCityChart(filteredItems);
    }

    function renderStatusChart(filteredItems) {
        const statuses = {};
        filteredItems.forEach(item => {
            statuses[item.status] = (statuses[item.status] || 0) + 1;
        });

        const ctx = document.getElementById('statusChart').getContext('2d');
        if (chartInstance) chartInstance.destroy();

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const labelColor  = isDark ? '#d1d5db' : '#374151';
        const borderColor = isDark ? '#0f1013' : '#ffffff';

        const labels = Object.keys(statuses);
        const data   = Object.values(statuses);
        // getStatusColor() now returns real hex values — Chart.js renders them correctly
        const backgroundColors = labels.map(lbl => getStatusColor(lbl));

        chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: backgroundColors,
                    hoverBackgroundColor: backgroundColors.map(c => c + 'cc'), // slight transparency on hover
                    borderWidth: 2,
                    borderColor,
                    hoverBorderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { animateRotate: true, duration: 600 },
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: labelColor,
                            font: { family: 'Outfit', size: 11, weight: '500' },
                            boxWidth: 10,
                            boxHeight: 10,
                            borderRadius: 3,
                            padding: 8,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: isDark ? '#1a1b1f' : '#ffffff',
                        titleColor: isDark ? '#f9fafb' : '#111827',
                        bodyColor: isDark ? '#9ca3af' : '#4b5563',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                        borderWidth: 1,
                        padding: 10,
                        cornerRadius: 8
                    }
                },
                cutout: '68%'
            }
        });
    }

    function renderCityChart(filteredItems) {
        const cities = {};
        filteredItems.forEach(item => {
            if (item.city && item.city.trim()) {
                cities[item.city] = (cities[item.city] || 0) + 1;
            }
        });

        const sortedCities = Object.keys(cities)
            .map(city => ({ name: city, count: cities[city] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8); // show up to 8 cities

        const ctx = document.getElementById('cityChart').getContext('2d');
        if (cityChartInstance) cityChartInstance.destroy();

        const isDark    = document.documentElement.getAttribute('data-theme') === 'dark';
        const labelColor = isDark ? '#d1d5db' : '#374151';
        const gridColor  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

        // Build a gradient palette from brand orange → amber → green
        const PALETTE = [
            '#FD5001', '#FF6B35', '#F59E0B', '#EAB308',
            '#84CC16', '#10b981', '#06b6d4', '#7C90E5'
        ];
        const barColors = sortedCities.map((_, i) => PALETTE[i % PALETTE.length]);

        cityChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedCities.map(c => c.name || '—'),
                datasets: [{
                    label: 'Filialen',
                    data: sortedCities.map(c => c.count),
                    backgroundColor: barColors,
                    hoverBackgroundColor: barColors.map(c => c + 'cc'),
                    borderRadius: 6,
                    borderWidth: 0
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 500 },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: isDark ? '#1a1b1f' : '#ffffff',
                        titleColor: isDark ? '#f9fafb' : '#111827',
                        bodyColor: isDark ? '#9ca3af' : '#4b5563',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                        borderWidth: 1,
                        padding: 10,
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: {
                        grid: { color: gridColor, drawBorder: false },
                        ticks: { color: labelColor, font: { family: 'Outfit', size: 11 }, precision: 0 },
                        border: { display: false }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: labelColor, font: { family: 'Outfit', size: 11 } },
                        border: { display: false }
                    }
                }
            }
        });
    }

    // 10. Details Sidebar Panel
    function showStoreDetails(item) {
        detailsContent.innerHTML = '';
        
        const details = [
            { label: 'Filialname', value: item.name, icon: 'fa-store' },
            { label: 'Straße', value: item.street, icon: 'fa-location-dot' },
            { label: 'PLZ & Ort', value: `${item.zip} ${item.city}`, icon: 'fa-map-pin' },
            { label: 'Status', value: item.status, icon: 'fa-flag', style: `color: ${getStatusColor(item.status)}; font-weight: 600;` },
            { label: 'GPS-Koordinaten', value: `${item.lat.toFixed(6)}, ${item.lng.toFixed(6)}`, icon: 'fa-compass' }
        ];

        // Append distance calculation if radius search is active
        if (radiusCenterLatLng) {
            const dist = radiusCenterLatLng.distanceTo(L.latLng(item.lat, item.lng)) / 1000;
            details.push({
                label: 'Distanz zum Zentrum',
                value: `${dist.toFixed(2)} km`,
                icon: 'fa-route',
                style: 'color: var(--accent); font-weight: 600;'
            });
        }

        // Append mapped fields
        details.forEach(d => {
            const row = document.createElement('div');
            row.className = 'info-row';
            row.innerHTML = `
                <span class="info-label"><i class="fa-solid ${d.icon}" style="margin-right: 0.5rem; width: 14px;"></i>${d.label}</span>
                <span class="info-value" style="${d.style || ''}">${d.value}</span>
            `;
            detailsContent.appendChild(row);
        });

        // Add additional unmapped details from original row as extra meta data
        const extraTitle = document.createElement('h4');
        extraTitle.style.fontSize = '0.8125rem';
        extraTitle.style.marginTop = '1rem';
        extraTitle.style.marginBottom = '0.5rem';
        extraTitle.style.color = 'var(--text-secondary)';
        extraTitle.textContent = 'Zusätzliche Tabellenfelder:';
        detailsContent.appendChild(extraTitle);

        Object.keys(item.originalRow).forEach(key => {
            // Don't repeat mapped coordinates if we generated them
            if (['Latitude', 'Longitude', 'Breitengrad', 'Längengrad'].includes(key) && item.originalRow[key] === undefined) return;
            
            const val = item.originalRow[key];
            if (val !== null && val !== undefined && val !== '') {
                const row = document.createElement('div');
                row.className = 'info-row';
                row.innerHTML = `
                    <span class="info-label" style="font-size: 0.75rem;">${key}</span>
                    <span class="info-value" style="font-size: 0.75rem;">${val}</span>
                `;
                detailsContent.appendChild(row);
            }
        });

        // Navigation links
        const navContainer = document.createElement('div');
        navContainer.style.display = 'flex';
        navContainer.style.gap = '0.5rem';
        navContainer.style.marginTop = '1.25rem';

        const osmLink = document.createElement('a');
        osmLink.href = `https://www.openstreetmap.org/directions?route=%3B${item.lat}%2C${item.lng}`;
        osmLink.target = '_blank';
        osmLink.className = 'btn btn-secondary';
        osmLink.style.flex = '1';
        osmLink.style.fontSize = '0.8125rem';
        osmLink.innerHTML = '<i class="fa-solid fa-route"></i> OpenStreetMap';

        const gmapsLink = document.createElement('a');
        gmapsLink.href = `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`;
        gmapsLink.target = '_blank';
        gmapsLink.className = 'btn';
        gmapsLink.style.flex = '1';
        gmapsLink.style.fontSize = '0.8125rem';
        gmapsLink.innerHTML = '<i class="fa-solid fa-map-location-dot"></i> Google Maps';

        navContainer.appendChild(osmLink);
        navContainer.appendChild(gmapsLink);
        detailsContent.appendChild(navContainer);

        // Slide details panel into view
        detailsPanel.style.display = 'block';
        
        // Center map on clicked item with offset for sidebar layout
        map.setView([item.lat, item.lng], 15);
    }

    closeDetailsBtn.addEventListener('click', () => {
        detailsPanel.style.display = 'none';
    });

    // ==========================================================================
    // Event Bindings for Radius Search, Tiles Settings & Geocoding Cancel
    // ==========================================================================
    if (cancelGeocodingBtn) {
        cancelGeocodingBtn.addEventListener('click', () => {
            geocodeCancelRequested = true;
            showToast('Geokodierung wird abgebrochen... Teildaten werden geladen.', 'warning');
        });
    }

    if (tileSourceSelect) {
        tileSourceSelect.addEventListener('change', () => {
            if (tileSourceSelect.value === 'offline') {
                if (offlinePathGroup) offlinePathGroup.style.display = 'block';
            } else {
                if (offlinePathGroup) offlinePathGroup.style.display = 'none';
            }
            setMapTheme(currentMapTheme);
        });
    }

    if (offlinePathInput) {
        offlinePathInput.addEventListener('change', () => {
            setMapTheme(currentMapTheme);
        });
    }

    if (setRadiusCenterBtn) {
        setRadiusCenterBtn.addEventListener('click', () => {
            isPickingCenter = !isPickingCenter;
            if (isPickingCenter) {
                document.body.classList.add('picking-center');
                setRadiusCenterBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Klicke Karte...';
                setRadiusCenterBtn.classList.add('btn-secondary');
            } else {
                document.body.classList.remove('picking-center');
                setRadiusCenterBtn.innerHTML = '<i class="fa-solid fa-crosshairs"></i> Zentrum setzen';
                setRadiusCenterBtn.classList.remove('btn-secondary');
            }
        });
    }

    if (radiusCenterSelect) {
        radiusCenterSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val === '') {
                resetRadiusSearch();
                return;
            }
            const item = mappedData.find(d => d.id == val);
            if (item) {
                radiusCenterLatLng = L.latLng(item.lat, item.lng);
                updateRadiusCircle();
                if (radiusSliderWrapper) radiusSliderWrapper.style.display = 'block';
                applyFilters();
            }
        });
    }

    if (filterRadiusSlider) {
        filterRadiusSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            if (radiusValueText) radiusValueText.textContent = `Radius: ${val} km`;
            radiusInMeters = parseFloat(val) * 1000;
            if (radiusCircle) {
                radiusCircle.setRadius(radiusInMeters);
            }
            applyFilters();
        });
    }

    if (resetRadiusBtn) {
        resetRadiusBtn.addEventListener('click', () => {
            resetRadiusSearch();
        });
    }

    function updateRadiusCircle() {
        if (radiusCircle && map) {
            map.removeLayer(radiusCircle);
        }
        if (radiusCenterLatLng && map) {
            radiusCircle = L.circle(radiusCenterLatLng, {
                radius: radiusInMeters,
                color: '#FD5001',
                fillColor: '#FD5001',
                fillOpacity: 0.1,
                weight: 2,
                dashArray: '5, 5'
            }).addTo(map);
            map.panTo(radiusCenterLatLng);
        }
    }

    function resetRadiusSearch() {
        radiusCenterLatLng = null;
        if (radiusCircle && map) {
            map.removeLayer(radiusCircle);
            radiusCircle = null;
        }
        if (radiusCenterSelect) {
            radiusCenterSelect.value = '';
        }
        if (radiusSliderWrapper) {
            radiusSliderWrapper.style.display = 'none';
        }
        applyFilters();
    }

    // 11. Data Export (.csv)
    exportDataBtn.addEventListener('click', () => {
        if (mappedData.length === 0) return;

        // Map data back into original structure but make sure Latitude/Longitude are present
        const exportRows = mappedData.map(item => {
            const row = { ...item.originalRow };
            // Ensure coordinates are written into output CSV
            row['Latitude'] = item.lat;
            row['Longitude'] = item.lng;
            return row;
        });

        const csvContent = Papa.unparse(exportRows);
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' }); // includes BOM for Excel UTF-8 compatibility
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        const originalName = fileNameText.textContent.replace(/\.[^/.]+$/, "");
        link.setAttribute('href', url);
        link.setAttribute('download', `${originalName}_geokodiert.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('Tabelle erfolgreich exportiert!', 'success');
    });

    // Control Table Drawer togglers
    if (toggleControlTableBtn) {
        toggleControlTableBtn.addEventListener('click', () => {
            controlTableDrawer.classList.toggle('active');
        });
    }

    if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', () => {
            controlTableDrawer.classList.remove('active');
        });
    }

    // 12. Toast notifications
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastIcon = document.getElementById('toastIcon');
        const toastMsg = document.getElementById('toastMsg');

        toastMsg.textContent = message;
        
        if (type === 'success') {
            toastIcon.className = 'fa-solid fa-circle-check';
            toastIcon.style.color = 'var(--success)';
            toast.style.borderLeftColor = 'var(--success)';
        } else if (type === 'warning') {
            toastIcon.className = 'fa-solid fa-circle-exclamation';
            toastIcon.style.color = 'var(--warning)';
            toast.style.borderLeftColor = 'var(--warning)';
        } else if (type === 'error') {
            toastIcon.className = 'fa-solid fa-circle-xmark';
            toastIcon.style.color = 'var(--danger)';
            toast.style.borderLeftColor = 'var(--danger)';
        } else {
            toastIcon.className = 'fa-solid fa-circle-info';
            toastIcon.style.color = 'var(--info)';
            toast.style.borderLeftColor = 'var(--info)';
        }

        toast.classList.add('active');
        setTimeout(() => {
            toast.classList.remove('active');
        }, 4000);
    }

    // ==========================================================================
    // Interactive 3D-Print Gallery Logic & Database
    // ==========================================================================
    const GALLERY_DATABASE = {
        "ADAC": [
            {
                title: "Zweiteiliger NFC-Schlüsselanhänger",
                img: "assets/adac_keychain_realistic.png",
                desc: "Das klassische Werbemittel neu gedacht. Ein edler, zweifarbiger Anhänger mit integriertem, unsichtbarem NFC-Chip als digitale Schnittstelle.",
                ux: "Smartphone kurz anhalten (wie beim kontaktlosen Bezahlen): Öffnet direkt das ADAC-Mitgliederportal für exklusive Partnervorteile.",
                roi: "Tägliche Sichtbarkeit direkt am Schlüsselbund; direkter, klickstarker Zugang zu digitalen Services (ROI messbar über NFC-Klicks).",
                story: "Zweiteiliges Snap-Fit-Design (vollständig recyclebar, kein Klebstoff). Lokale Prototyp-Fertigung.",
                priceScale: "~0,32 € zzgl. NFC-Transponder. Edle Haptik bei sehr geringen Stückkosten."
            },
            {
                title: "Eiskratzer mit Einkaufswagen-Chip",
                img: "assets/adac_eiskratzer.png",
                desc: "Ein robuster Eiskratzer für den Winter mit integriertem, herausnehmbarem Einkaufswagen-Chip für das ganze Jahr.",
                ux: "NFC-Tap mit dem Smartphone: Öffnet direkt das ADAC-Verkehrsportal mit Live-Stauinfos und regionalem Wetterbericht.",
                roi: "Ganzjährige Markenpräsenz im Alltag (Auto & Supermarkt). Hoher praktischer Nutzwert sichert langfristigen Verbleib beim Kunden.",
                story: "CO2-sparender 3D-Druck aus biologisch abbaubarem Bio-PLA. 100% ohne Batterien und Elektronikschrott.",
                priceScale: "~0,29 € pro Stück. Schnelle, kostengünstige Massenproduktion."
            },
            {
                title: "Parkscheibe mit Profiltiefenmesser",
                img: "assets/adac_parkscheibe.png",
                desc: "Eine praktische Parkscheibe aus dem 3D-Drucker mit integriertem Reifenprofil-Check. Ein verlässlicher Alltagshelfer im Auto.",
                ux: "Smartphone kurz anhalten (kontaktlos per NFC): Startet sofort den ADAC Pannenhilfe-Ruf, übermittelt die GPS-Daten des Standorts und spart wertvolle Zeit im Notfall.",
                roi: "Hohe Relevanz und tägliche Sichtbarkeit direkt im Blickfeld des Fahrers; Erhöhung der Service-App-Nutzung.",
                story: "Hergestellt aus langlebigem, hitzebeständigem PETG (verzieht sich im Sommer nicht). Lokale Fertigung spart CO2-Emissionen.",
                priceScale: "~0,27 € zzgl. NFC-Transponder. Geringe Rüstkosten, ideal für die regionale Verteilung."
            },
            {
                title: "Lüftungsgitter-Handyhalterung",
                img: "assets/adac_handyhalter.png",
                desc: "Eine minimalistische Halterung für die Autolüftung mit rutschfesten TPU-Grips und integrierter Smart-Merchandise-Schnittstelle.",
                ux: "Handy einlegen: Startet per NFC-Kontakt automatisch die ADAC Drive App (Navigation, Tankstellenpreise, Routenplaner).",
                roi: "Nutzung als interaktives Cockpit-Zubehör; exzellenter Alltagsnutzen schafft starke Kundenbindung.",
                story: "Materialkombination aus robustem PETG und flexiblem TPU; voll recyclingfähig.",
                priceScale: "~0,52 € pro Stück. Hochwertiges Werbegeschenk für Premium-Mitglieder."
            }
        ],
        "AOK": [
            {
                title: "Pillendose mit Wochentagen & Braille",
                img: "assets/aok_pillendose.png",
                desc: "Eine ergonomische wöchentliche Pillendose mit leichtgängigem Schiebedeckel und ertastbarer Brailleschrift.",
                ux: "Smartphone-Tap auf den Deckel: Öffnet direkt den AOK Medikamenten-Manager mit Erinnerungsfunktion und Wechselwirkungs-Check.",
                roi: "Stärkung der Patientensicherheit und Bindung an AOK-Vorsorge-Apps; tägliche Nutzung im Haushalt.",
                story: "Hergestellt aus zertifiziertem, lebensmittelechtem Bio-PLA auf Maisstärkebasis. 100% schadstofffrei.",
                priceScale: "~0,35 € pro Stück. Einfache Skalierung durch Nesting im Druckbett."
            },
            {
                title: "Zeckenkarte mit Lupe & NFC",
                img: "assets/aok_zeckenkarte.png",
                desc: "Eine Scheckkarte mit zwei Hebelkerben für unterschiedliche Zeckengrößen, integrierter Lupe und digitalem Erste-Hilfe-Assistenten.",
                ux: "Karte mit dem Smartphone berühren: Zeigt sofort die AOK-Erste-Hilfe-Schritte bei Zeckenbissen sowie eine Arzt-Suchfunktion.",
                roi: "Lebensretter-Effekt erzeugt hohes Vertrauen; sehr hoher Verbreitungsgrad durch passgenaues Brieftaschenformat.",
                story: "Flachdruck-Design benötigt minimales Material; langlebiger Schutz ohne Verfallsdatum.",
                priceScale: "~0,42 € zzgl. NFC-Transponder. Äußerst porto- und verteilungsfreundlich."
            },
            {
                title: "Obst-Schneidehilfe",
                img: "assets/aok_schneidehilfe.png",
                desc: "Ergonomische Haltehilfe zur sicheren Schnittführung beim Schneiden von frischem Obst – ideal für Kinder und Senioren.",
                ux: "Smartphone-Tap: Lädt direkt gesunde AOK-Rezeptideen und Ernährungstipps für die ganze Familie.",
                roi: "Positionierung der AOK als präventiver Gesundheitspartner direkt in der Küche; hoher Sympathiewert.",
                story: "Aus keimfreiem, porenfreiem SLA-Resin (Tough Medical Grade) hergestellt. Spülmaschinenfest.",
                priceScale: "~0,85 € pro Stück. Premium-Giveaway für Gesundheitskurse."
            },
            {
                title: "Schrittzähler-Gürtelclip",
                img: "assets/aok_guertelclip.png",
                desc: "Flexibler, hautschonender Gürtelclip aus weichem Elastomer zur Befestigung von Schlüsseln oder Schrittzählern.",
                ux: "Smartphone-Tap: Öffnet direkt das AOK-Bonusprogramm zur Eingabe der täglichen Schritte für Prämien.",
                roi: "Direkte Aktivierung zur Teilnahme am AOK-Bonusprogramm; Gamification-Brücke zur AOK-App.",
                story: "Gedruckt aus flexiblem TPU, frei von Weichmachern und Phthalaten. Extrem langlebig.",
                priceScale: "~0,28 € pro Stück. Minimaler Materialeinsatz, schnelle Produktion."
            }
        ],
        "Bionade": [
            {
                title: "Flaschen-Tragegriff (2er/4er-Pack)",
                img: "assets/bionade_tragegriff.png",
                desc: "Ein praktischer Snap-on Tragegriff für zwei Bionade-Glasflaschen. Macht Plastiktüten und Kartons überflüssig.",
                ux: "Smartphone-Tap auf den Griff: Öffnet eine interaktive Karte mit Bionade-Mehrweg-Rückgabestellen und aktuellen Pfand-Infos.",
                roi: "Erzeugt starke Marken-Sichtbarkeit im öffentlichen Raum (Street-Advertising); untermauert das Nachhaltigkeits-Image.",
                story: "CO2-neutral gedruckt aus organischem Holz-PLA (enthält echte Holzfasern). Langlebiger Mehrweg-Einsatz.",
                priceScale: "~0,40 € pro Stück. Schnelle Skalierung durch optimierte Stapeldrucke."
            },
            {
                title: "Insektenhotel-Hexagon-Rahmen",
                img: "assets/bionade_insektenhotel.png",
                desc: "Ein modularer, sechseckiger Rahmen zum Selbstbefüllen mit Naturmaterialien. Unterstützt die lokale Biodiversität.",
                ux: "Smartphone-Tap: Führt zu einer Anleitung zum insektenfreundlichen Garten und Bionade-Artenschutz-Initiativen.",
                roi: "Exzellentes Storytelling; positioniert die Marke glaubwürdig im Umweltschutz; hoher emotionaler Wert.",
                story: "Wetterfestes, biologisch abbaubares Bio-PLA. 100% ungiftig für Insekten und Pflanzen.",
                priceScale: "~0,65 € pro Stück. Modulare Wabenstruktur ermöglicht beliebige Erweiterungen."
            },
            {
                title: "Wand-Flaschenöffner mit Magnetfänger",
                img: "assets/bionade_oeffner.png",
                desc: "Stilvoller Flaschenöffner zur Wandmontage aus Holz-Filament. Ein starker unsichtbarer Magnet fängt Kronkorken automatisch auf.",
                ux: "Smartphone-Tap auf das Logo: Öffnet ein Gewinnspiel für nachhaltige Bionade-Erlebnisreisen oder B2B-Kombi-Angebote.",
                roi: "Dauerhafter Platz an der Wand in Bars, WGs oder Küchen; sehr hohe Kontakthäufigkeit mit der Marke Bionade.",
                story: "Gefertigt aus recycelten Holzresten und Edelstahl. Vollständig plastikfreie Haptik.",
                priceScale: "~1,15 € pro Stück. Edles, langlebiges Gastro- und Premium-Werbegeschenk."
            },
            {
                title: "Bienen-Tränke (Schraubaufsatz)",
                img: "assets/bionade_traenke.png",
                desc: "Tellerförmiger Tränkenaufsatz, der auf leere Bionade-Flaschen geschraubt wird, um Insekten im Sommer Wasser zu spenden.",
                ux: "Smartphone-Tap auf der Tränke: Startet das Bionade 'Bienen-Radar' mit Tipps zur bienenfreundlichen Bepflanzung.",
                roi: "Perfekte Upcycling-Story (Aus Altglas wird Bienenschutz); extreme Social-Media-Affinität durch originellen Nutzen.",
                story: "Ungiftiges, UV-beständiges Bio-PLA. Keine schädlichen Ausdünstungen an das Trinkwasser.",
                priceScale: "~0,38 € pro Stück. Leicht und günstig im Postversand zu verschicken."
            }
        ],
        "Audi": [
            {
                title: "Geometric Phone Stand",
                img: "assets/audi_phonestand.png",
                desc: "Futuristischer Smartphone-Halter für den Schreibtisch, inspiriert von den klaren Linien des Audi Quattro.",
                ux: "Handy auflegen: Startet per NFC direkt die Audi myAudi-App oder öffnet ein exklusives Konfigurator-Video.",
                roi: "Premium-Platzierung auf dem Schreibtisch von Geschäftsführern und B2B-Kunden; hohes Renommee durch edle Metalloptik.",
                story: "Gedruckt in hochauflösendem SLA-Resin und metallisch galvanisiert. Hohe Wertigkeit ohne umweltschädliches Schwermetall.",
                priceScale: "~1,80 € pro Stück. Günstiger Prototypen-Einstieg im Vergleich zu Spritzgussformen."
            },
            {
                title: "Quattro Magnetischer Kabel-Organizer",
                img: "assets/audi_kabelhalter.png",
                desc: "Minimalistische Schreibtisch-Dockingstation für Ladekabel mit integrierten Magnet-Clips.",
                ux: "Smartphone-Tap auf der Station: Startet eine virtuelle Probefahrt oder leitet zum Audi e-tron Informationsportal.",
                roi: "Sorgt für Ordnung auf dem Tisch und verknüpft das Thema E-Mobilität (Kabelmanagement) elegant mit Audi e-tron.",
                story: "Mattschwarzes, langlebiges PETG. Einfaches sortenreines Recycling der Kunststoffteile.",
                priceScale: "~0,75 € pro Stück. Sehr edler Look durch strukturierte Carbon-Druckplatten."
            },
            {
                title: "Premium Key Fob Protector",
                img: "assets/audi_keysleeve.png",
                desc: "Passgenaue, stoßabsorbierende Schutzhülle für den Audi-Funkschlüssel aus elastischem High-Tech-Resin.",
                ux: "Smartphone-Tap auf die Hülle: Lädt den digitalen Audi-Werkstattservice oder das Pannen-Kontakt-Formular.",
                roi: "Ständiger Begleiter des Kunden; schützt den teuren Funkschlüssel und bietet im Pannenfall sofortige digitale Hilfe.",
                story: "Gedruckt aus elastischem, langlebigem SLA-Harz. 100% passgenau ohne Kunststoffmüll.",
                priceScale: "~0,95 € pro Stück. Geringe Toleranzen durch präzise SLA-Lichttechnik."
            },
            {
                title: "Valet Coin Tray",
                img: "assets/audi_cointray.png",
                desc: "Geometrische Ablageschale für Kleingeld, Ringe und Fahrzeugschlüssel im Audi-Design.",
                ux: "Smartphone-Tap in die Schale: Öffnet aktuelle Angebote für Audi-Zubehör oder Service-Terminbuchungen.",
                roi: "Fester Platz im Eingangsbereich des Kunden; dezentes, luxuriöses Branding an einem zentralen Touchpoint zu Hause.",
                story: "Kohlefaserverstärktes PETG (Carbon-Look) für maximale Robustheit und edle, matte Optik.",
                priceScale: "~0,65 € pro Stück. Hochwertige Struktur zum kleinen Preis."
            }
        ],
        "Jever": [
            {
                title: "Friesen-Sturmsicherung",
                img: "assets/jever_sturmsicherung.png",
                desc: "Ein rutschfester Untersetzer mit hohem Schutzrand, der Gläser auf Booten oder windigen Terrassen vor dem Umkippen schützt.",
                ux: "Smartphone-Tap auf den Untersetzer: Lädt die aktuelle Gezeiten-Tabelle für die Küste oder den Jever Strand-Finder.",
                roi: "Perfekter Fit zum friesisch-rauen Markenimage ('Wie das Land, so das Jever'). Dauerhafte Platzierung in der Outdoor-Gastronomie.",
                story: "Hergestellt aus zähem PETG mit rutschfestem TPU-Boden. Robust genug für Generationen.",
                priceScale: "~0,48 € pro Stück. Zweiteiliges In-Mold-Verfahren im 3D-Druck simuliert."
            },
            {
                title: "Bierkasten-Tragegriff-Polster",
                img: "assets/jever_tragepolster.png",
                desc: "Ein weiches Ergonomie-Polster, das einfach auf den schmalen Steg des Jever-Bierkastens geklipst wird.",
                ux: "Smartphone-Tap auf das Polster: Zeigt den Jever Brauerei-Shop oder exklusive Jever-Aktiv-Rabattcodes.",
                roi: "Unmittelbare Problemlösung beim Einkauf stärkt die Kundenzufriedenheit; hohe Aufmerksamkeit im Markt und beim Transport.",
                story: "Gedruckt aus elastischem TPU. 100% recycelbar, langlebig und wetterfest.",
                priceScale: "~0,35 € pro Stück. Einfache Clip-Montage durch den Endkunden."
            },
            {
                title: "Küsten-Wandhaken (Ankerform)",
                img: "assets/jever_ankerhaken.png",
                desc: "Stabiler Wandhaken in maritimer Ankerform aus faserverstärktem Material für schweres Outdoor-Equipment.",
                ux: "Smartphone-Tap auf den Haken: Öffnet die Jever Wetter-App mit Wind- und Wellenvorhersage für Surfer und Segler.",
                roi: "Dauerhaftes Branding im Flur oder in der Garage; verbindet die Marke mit dem aktiven Outdoor-Lifestyle an der Küste.",
                story: "Carbonfaser-PETG sorgt für extreme Festigkeit. Lokaler Druck spart Logistikaufwand.",
                priceScale: "~0,85 € pro Stück. B2B-Premiumgeschenk für Gastronomen und Partner."
            },
            {
                title: "Dosen-Kühlergürtel-Halter",
                img: "assets/jever_dosengurtel.png",
                desc: "Praktischer Gürtelclip zur Befestigung von Getränkedosen (inkl. integriertem Neopren-Kühlsleeve).",
                ux: "Smartphone-Tap: Öffnet den Jever-Playlist-Generator mit entspannter Musik für den Strand.",
                roi: "Mobiler Werbeträger bei Festivals, Strandtagen und Grillpartys; sorgt für Gesprächsstoff im Freundeskreis.",
                story: "Einteiliges elastisches Design ohne bewegliche Scharniere; extrem bruchsicher und langlebig.",
                priceScale: "~0,42 € pro Stück. Perfektes Sommer-Giveaway für Getränkemärkte."
            }
        ],
        "Radeberger Gruppe": [
            {
                title: "Gastro Menükarten-Halter mit NFC",
                img: "assets/radeberger_kartenhalter.png",
                desc: "Eleganter Kartenhalter aus Holz-Filament für Restaurants. Ersetzt unhygienische Papierkarten.",
                ux: "Smartphone an den Halter tippen: Öffnet sofort die digitale Speisekarte oder startet direkt den Bezahlvorgang.",
                roi: "Massive Zeitersparnis für das Personal; DSGVO-konforme Datenerfassung und einfache Aktualisierung der Preise/Gerichte.",
                story: "Holz-PLA aus nachhaltiger Forstwirtschaft. Der NFC-Chip ist wasserdicht eingekapselt und spülmaschinenfest.",
                priceScale: "~0,88 € zzgl. NFC-Transponder. Schnelle Amortisation durch Einsparung von Druckkosten."
            },
            {
                title: "Kronkorken-Sammelbox mit Skala",
                img: "assets/radeberger_sammelbox.png",
                desc: "Interaktive Wand-Sammelbox für Kronkorken mit transparenter Front und humorvoller Füllstandskala.",
                ux: "Smartphone-Tap auf die Box: Zeigt die aktuelle Radeberger Kronkorken-Sammelaktion und ermöglicht die direkte Code-Eingabe.",
                roi: "Erhöht die Wiederkaufsrate durch spielerisches Sammeln (Gamification); dauerhaftes Branding im Partykeller oder in Küchen.",
                story: "Rahmen aus recyceltem PETG, Front aus Acrylglas. Modular aufgebaut und leicht zu reinigen.",
                priceScale: "~1,65 € pro Stück. Blickfang mit hohem Aufforderungscharakter."
            },
            {
                title: "Zapfhahn-Griff 'Premium'",
                img: "assets/radeberger_zapfhahn.png",
                desc: "Luxuriöser, hochglänzender Schankzapfhahn-Griff mit eingelassenem goldenen Radeberger-Wappen.",
                ux: "Smartphone-Tap des Barkeepers/Gastes: Öffnet Produktinfos zur Radeberger-Qualität oder Schankanlagen-Support.",
                roi: "Stärkt die Markenpräsenz an der wichtigsten Stelle (Point of Sale); transportiert Premium-Anspruch direkt ins Glas.",
                story: "Präzisions-SLA-Druck für makellose Oberfläche. Langlebige Messinggewinde-Einsätze verlängern die Nutzungsdauer.",
                priceScale: "~2,40 € pro Stück. Kostengünstige Individualisierung von Schankanlagen ohne Gusswerkzeuge."
            },
            {
                title: "Fass-Spund-Schlüssel",
                img: "assets/radeberger_spundschluessel.png",
                desc: "Ergonomisches B2B-Werkzeug für Barpersonal zum schnellen und sicheren Entlüften und Öffnen von Bierfässern.",
                ux: "Smartphone-Tap: Führt direkt zu Videoanleitungen zum richtigen Fassanstich oder dem Radeberger Gastro-Bestellportal.",
                roi: "Hoher praktischer Wert im Arbeitsalltag des Barpersonals; verbessert die Markenloyalität im B2B-Gastro-Bereich.",
                story: "Extrem zähes, carbonfaserverstärktes PETG. Unzerbrechlich und ergonomisch geformt.",
                priceScale: "~0,98 € pro Stück. Langlebiges Profi-Werkzeug."
            }
        ],
        "IKEA": [
            {
                title: "Modularer Skådis-Lochwand-Haken",
                img: "assets/ikea_lochlophaken.png",
                desc: "Ein in einem Stück gedruckter (Print-in-Place) Haken für das beliebte IKEA Skådis-Wandsystem.",
                ux: "Smartphone-Tap auf den Haken: Führt direkt zur IKEA-Ideengalerie für Wand-Organisation oder Zubehör-Bestellung.",
                roi: "Direkte Promotion des Bestseller-Lochwandsystems; exzellenter Nutzen im Home-Office sorgt für tägliche Markenpräsenz.",
                story: "Abfallfreie Fertigung durch präzisen 3D-Druck. REACH-konformer Kunststoff.",
                priceScale: "~0,18 € pro Stück. Extrem preisgünstiges Massen-Giveaway."
            },
            {
                title: "Kabel-Wickler 'VIND' mit Magnet",
                img: "assets/ikea_kabelwickler.png",
                desc: "Ein flaches, flexibles Band aus buntem TPU mit zwei integrierten Magneten zum schnellen Ordnen von Ladekabeln.",
                ux: "Smartphone-Tap: Öffnet IKEA Smart-Home-Anleitungen oder leitet direkt zu Angeboten für kabellose Ladegeräte.",
                roi: "Verknüpft IKEA mit dem Thema Smart Home und Technologie; hoher Alltagsnutzen für Smartphone-Nutzer.",
                story: "Gedruckt aus recyclingfähigem TPU. Magnete sind kindersicher und spritzwassergeschützt im Kunststoff verschweißt.",
                priceScale: "~0,32 € pro Stück. Flexibel im Briefversand einsetzbar."
            },
            {
                title: "Schubladenteiler-Eckverbinder",
                img: "assets/ikea_verbinder.png",
                desc: "Universelle Eckverbinder, mit denen Kunden aus Versandkartons eigene Schubladeneinteilungen bauen können.",
                ux: "Smartphone-Tap auf den Verbinder: Öffnet IKEA Hack-Anleitungen und Upcycling-Ideen für Verpackungen.",
                roi: "Stärkt das Nachhaltigkeits-Image von IKEA; fördert den DIY-Gedanken und spart Abfall.",
                story: "Unterstützt Zero-Waste (Upcycling von Versandkartons). Aus biologisch abbaubarem Bio-PLA.",
                priceScale: "~0,15 € pro Set. Minimaler Materialaufwand für maximale Kundenbindung."
            },
            {
                title: "Allen-Wrench Ergonomie-Griff",
                img: "assets/ikea_werkzeuggriff.png",
                desc: "Komfortabler Griffaufsatz für den klassischen L-förmigen IKEA-Inbusschlüssel zur leichteren Montage.",
                ux: "Smartphone-Tap auf den Griff: Öffnet die digitale Aufbauanleitung des gekauften Möbels oder startet das IKEA-Montage-Video.",
                roi: "Löst ein bekanntes Problem beim Möbelaufbau; reduziert Frustration und senkt Supportanfragen.",
                story: "Hohe mechanische Stabilität durch optimierte Wabenstruktur im Inneren. Langlebige Konstruktion.",
                priceScale: "~0,22 € pro Stück. Perfektes Beipack-Gadget für Neukunden."
            }
        ],
        "Spreequell": [
            {
                title: "Karabiner-Flaschenhalter-Clip",
                img: "assets/spreequell_clip.png",
                desc: "Ein robuster Karabiner-Clip zur Befestigung von Wasserflaschen an Rucksäcken oder Gürteln für unterwegs.",
                ux: "Smartphone-Tap: Startet die Spreequell 'Aktiv-Map' mit Laufstrecken und Outdoor-Aktivitäten in Berlin/Brandenburg.",
                roi: "Fördert die Markenpräsenz beim Sport und in der Freizeit; positioniert Spreequell als vitalen Durstlöscher.",
                story: "BPA-freies, elastisches PETG. Ersetzt Einweg-Flaschenhalter aus Metall/Plastik.",
                priceScale: "~0,62 € pro Stück. Hoher gefühlter Wert für den Endkunden."
            },
            {
                title: "Fahrradlenker-Flaschenhalter",
                img: "assets/spreequell_lenkerhalter.png",
                desc: "Wetterfester Flaschenhalter mit werkzeugloser Klemme für Fahrradlenker, Kinderwagen oder Scooter.",
                ux: "Smartphone-Tap: Zeigt Fahrradtouren in der Region und verlinkt auf Spreequell Erfrischungspunkte.",
                roi: "Hohe B2C-Sichtbarkeit auf der Straße; ideal für Sommer-Promotions und regionale Events.",
                story: "100% witterungsbeständiges PETG. Lange Lebensdauer unter freiem Himmel.",
                priceScale: "~0,78 € pro Stück. Robuste Mechanik ohne Schraubmontage."
            },
            {
                title: "Kaltwasser-Refill-Map Token",
                img: "assets/spreequell_nfc_anhanger.png",
                desc: "Ein kleiner Schlüsselanhänger in Wassertropfenform mit integriertem Smart-Link.",
                ux: "Smartphone-Tap: Öffnet eine interaktive Karte mit allen kostenlosen Refill-Trinkwasserstationen in der Umgebung.",
                roi: "Hohe CSR-Glaubwürdigkeit; verbindet Umweltschutz mit praktischem Service und täglichem Branding am Schlüsselbund.",
                story: "Der NFC-Chip ist wasserdicht im Kern eingeschlossen. Gedruckt aus recyceltem PETG.",
                priceScale: "~0,29 € zzgl. NFC-Transponder. Sehr porto- und verteilerfreundlich."
            },
            {
                title: "Collapsible City-Trinkbecher",
                img: "assets/spreequell_becher.png",
                desc: "Faltbarer Becher für unterwegs, der sich flach zusammenpressen lässt. Ideal für Festivals und Sportevents.",
                ux: "Smartphone-Tap auf den Boden: Führt direkt zum Programm und dem Line-up von Spreequell-gesponserten Festivals.",
                roi: "Der perfekte Event-Begleiter; vermeidet Müll vor Ort und sorgt für hohe Marken-Interaktion auf Social Media.",
                story: "Lebensmittelechtes, schadstofffreies TPU (LFGB-konform). Spülmaschinenfest und unzerbrechlich.",
                priceScale: "~1,10 € pro Stück. Hochwertiges, faltbares Trend-Gadget."
            }
        ],
        "Von Eicken": [
            {
                title: "Dosen-Aschenbecher-Deckel",
                img: "assets/voneicken_ascherdeckel.png",
                desc: "Hitzebeständiger Aufsatz für leere 330ml-Dosen, der diese in windfeste Aschenbecher für den Außenbereich verwandelt.",
                ux: "Smartphone-Tap auf den Deckel: Führt zu Umweltschutz-Infos der Von Eicken-Gruppe zur sauberen Entsorgung (CSR).",
                roi: "Praktischer Umweltschutz (CSR) verhindert Zigarettenmüll; dezente, rein funktionale B2B-Präsenz ohne Werbeverbot-Konflikt.",
                story: "Gedruckt aus flammhemmendem PETG (UL94-V0 zertifiziert). Langlebig und abwaschbar.",
                priceScale: "~0,78 € pro Stück. Perfektes Gastro-Zubehör für Biergärten."
            },
            {
                title: "Schachtel-Schutzetui (Packsleeve)",
                img: "assets/voneicken_schachtelhuelle.png",
                desc: "Robustes Schutzetui für Zigarettenschachteln zum Schutz vor Feuchtigkeit und Knicken bei Outdoor-Aktivitäten.",
                ux: "Smartphone-Tap auf die Hülle: Leitet B2B-Kunden auf die geschützte Von Eicken Partnerseite zur Händlerbestellung.",
                roi: "Schützt das Produkt und sorgt für ein edles, brandingfreies Design in der Hand des erwachsenen Nutzers (100% rechtskonform).",
                story: "Langlebige Hülle ersetzt Wegwerfetuis. Aus robustem, lokal gedrucktem PETG.",
                priceScale: "~0,65 € pro Stück. Exklusiver B2B-Streuartikel für Tabakwarenhändler."
            },
            {
                title: "Pfeifen-Präsentationsständer",
                img: "assets/voneicken_pfeifenstand.png",
                desc: "Minimalistischer, geschwungener Ständer zur stilvollen Präsentation klassischer Pfeifen.",
                ux: "Smartphone-Tap auf den Sockel: Zeigt Videoanleitungen zum richtigen Stopfen und Reinigen von Pfeifen.",
                roi: "Edles Design-Accessoire für Fachgeschäfte oder Sammler; stärkt die Markenpräsenz im Premium-Segment.",
                story: "Gedruckt in beiger Sandstein-Optik (SLA-Mischung mit matter Steinhaptik). 100% lösungsmittelfrei.",
                priceScale: "~1,20 € pro Stück. Exklusive Ausstrahlung für den Fachhandel."
            },
            {
                title: "Feuerzeughülle mit Hosen-Clip",
                img: "assets/voneicken_feuerzeughalter.png",
                desc: "Passgenaue Hülle für Reibradfeuerzeuge mit integriertem, stabilem Hosenclip für Handwerker und Outdoor-Fans.",
                ux: "Smartphone-Tap: Öffnet Sicherheits- und Befüllhinweise für Von Eicken Marken-Feuerzeuge.",
                roi: "Verhindert den Verlust von Feuerzeugen; extrem hohe Kontakthäufigkeit bei jedem Gebrauch.",
                story: "Hohe mechanische Stabilität durch elastische PETG-Wandungen. Lokaler ressourcenschonender Druck.",
                priceScale: "~0,35 € pro Stück. Praktischer Alltagsbegleiter mit hohem Gebrauchswert."
            }
        ],
        "Schöfferhofer": [
            {
                title: "Weizenglas-Kühlmanschette",
                img: "assets/schoefferhofer_manschette.png",
                desc: "Doppelwandige, aufklappbare Isolationsmanschette im Schöfferhofer-Orange für Weizengläser.",
                ux: "Smartphone-Tap auf die Manschette: Öffnet die Schöfferhofer Beach-Playlist oder Rezepte für sommerliche Weizen-Cocktails.",
                roi: "Garantiert langanhaltenden kalten Biergenuss; starke, leuchtende Markenpräsenz in der Strandgastronomie.",
                story: "Transluzentes PETG mit integrierten Luftpolstern als Kältebarriere. Extrem langlebig.",
                priceScale: "~0,85 € pro Stück. Perfektes Sommer-Giveaway für Strandbars."
            },
            {
                title: "Perfekt-Pour Ausgießer",
                img: "assets/schoefferhofer_ausgiesser.png",
                desc: "Spezialaufsatz für Weizen-Mischgetränke zur automatischen Regulierung des Durchflusses beim Eingießen.",
                ux: "Smartphone-Tap auf den Ausgießer: Startet eine kurze Anleitung zur perfekten Schaumkrone.",
                roi: "Sichert die optimale Produktpräsentation und sorgt für die perfekte Schaumkrone im Glas; erhöht den Trinkspaß.",
                story: "Hergestellt aus zertifiziertem, lebensmittelechtem und geschmacksneutralem PETG. Spülmaschinenfest.",
                priceScale: "~0,45 € pro Stück. Unkomplizierter B2B-Gastronomieartikel."
            },
            {
                title: "Transluzenter Kälte-Untersetzer",
                img: "assets/schoefferhofer_kaelteuntersetzer.png",
                desc: "Untersetzer mit Sonnenstruktur. Kälte färbt das thermochrome Material unter dem Glas leuchtend gelb.",
                ux: "Smartphone-Tap: Öffnet die Schöfferhofer Sonnen-Community oder aktuelle POS-Gewinnspiele.",
                roi: "Verblüffender visueller Effekt (Thermochromie) sorgt für hohe Aufmerksamkeit und teilbare Social-Media-Momente.",
                story: "Passiver chemischer Farbeffekt ohne Batterien. Pigmente sind sicher im Kunststoff verschlossen.",
                priceScale: "~0,95 € pro Stück. Hochwertiges Trend-Werbegeschenk für die Gastronomie."
            },
            {
                title: "Sonnenschirm-Tischklammer",
                img: "assets/schoefferhofer_schirmklammer.png",
                desc: "Robuste Outdoorklammer zur Befestigung an Sonnenschirm-Masten, inklusive Haken für Taschen und Gläserhalter.",
                ux: "Smartphone-Tap auf die Klammer: Führt direkt zur digitalen Schöfferhofer Gastro-Bestellplattform des Lokals.",
                roi: "Erzeugt Ordnung auf dem Tisch und bietet Gästen einen echten Komfort-Mehrwert; dauerhafte Gastro-Platzierung.",
                story: "Wetterfestes, schlagzähes PETG. Hält UV-Strahlung und Witterung jahrelang stand.",
                priceScale: "~1,40 € pro Stück. Hochwertiges Gastro-Zubehör zur Händlerförderung."
            }
        ]
    };

    // State Variables for Gallery
    let currentBrand = "ADAC";

    // DOM Elements
    const brandSelector = document.getElementById('brandSelector');
    const galleryTitle = document.getElementById('galleryTitle');
    const galleryDesc = document.getElementById('galleryDesc');
    const techUX = document.getElementById('techUX');
    const techROI = document.getElementById('techROI');
    const techStory = document.getElementById('techStory');
    const alternativesAccordion = document.getElementById('alternativesAccordion');
    const galleryContainer = document.querySelector('.gallery-container');
    const galleryCard = document.getElementById('galleryCard');
    const interactiveBg = document.getElementById('interactiveBg');

    // Update UI with selected brand and item
    function updateGallery() {
        const items = GALLERY_DATABASE[currentBrand];
        if (!items || items.length === 0) return;

        // Index 0 is the Hero concept ("Held")
        const heroItem = items[0];

        // Apply smooth transition effect on card contents
        galleryCard.style.opacity = '0.3';
        setTimeout(() => {
            galleryTitle.textContent = heroItem.title;
            galleryDesc.textContent = heroItem.desc;

            // Update Tech Table
            techUX.textContent = heroItem.ux;
            techROI.textContent = heroItem.roi;
            techStory.textContent = heroItem.story;

            // Clear and populate alternatives accordion (indices 1, 2, 3)
            alternativesAccordion.innerHTML = '';
            
            for (let i = 1; i < items.length; i++) {
                const altItem = items[i];
                const accItem = document.createElement('div');
                accItem.className = 'accordion-item';
                
                accItem.innerHTML = `
                    <button class="accordion-header" type="button">
                        <span>${altItem.title}</span>
                        <i class="fa-solid fa-chevron-down accordion-icon"></i>
                    </button>
                    <div class="accordion-content">
                        <p>${altItem.desc}</p>
                        <div class="accordion-tech-spec">
                            <span><strong>Kunden-Interaktion (UX):</strong> ${altItem.ux}</span>
                            <span><strong>Marketing-Nutzen (ROI):</strong> ${altItem.roi}</span>
                            <span><strong>Nachhaltigkeit & Story:</strong> ${altItem.story}</span>
                        </div>
                    </div>
                `;
                
                const header = accItem.querySelector('.accordion-header');
                header.addEventListener('click', () => {
                    const isActive = accItem.classList.contains('active');
                    
                    // Close all other items in this accordion
                    alternativesAccordion.querySelectorAll('.accordion-item').forEach(el => {
                        el.classList.remove('active');
                    });
                    
                    if (!isActive) {
                        accItem.classList.add('active');
                    }
                });
                
                alternativesAccordion.appendChild(accItem);
            }

            galleryCard.style.opacity = '1';
        }, 150);
    }

    // Set up Brand Selector Buttons
    if (brandSelector) {
        brandSelector.addEventListener('click', (e) => {
            const btn = e.target.closest('.brand-btn');
            if (!btn) return;

            document.querySelectorAll('#brandSelector .brand-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentBrand = btn.getAttribute('data-brand');
            updateGallery();
        });
    }

    // Mouse Movement Parallax & Spotlight Effect for Gallery Card
    if (galleryContainer && galleryCard && interactiveBg) {
        galleryContainer.addEventListener('mousemove', (e) => {
            const rect = galleryContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Move spotlight
            interactiveBg.style.background = `radial-gradient(circle 280px at ${x}px ${y}px, var(--accent-glow) 0%, transparent 100%)`;

            // Tilt card
            const cardRect = galleryCard.getBoundingClientRect();
            const cardX = e.clientX - (cardRect.left + cardRect.width / 2);
            const cardY = e.clientY - (cardRect.top + cardRect.height / 2);

            // Calculate tilt angle (max 8 degrees for clean professional feel)
            const rotateX = -cardY / 45;
            const rotateY = cardX / 45;

            galleryCard.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        galleryContainer.addEventListener('mouseleave', () => {
            // Reset spotlight and tilt with smooth transition
            interactiveBg.style.background = `radial-gradient(circle 280px at 50% 50%, var(--accent-glow) 0%, transparent 100%)`;
            galleryCard.style.transition = 'transform 0.4s ease, opacity 0.2s ease';
            galleryCard.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg)`;
        });

        galleryContainer.addEventListener('mouseenter', () => {
            galleryCard.style.transition = 'opacity 0.2s ease';
        });
    }

    // ==========================================================================
    // Lithophane Simulator Logic
    // ==========================================================================
    
    // DOM Elements for Simulator
    const backlightSlider = document.getElementById('backlightSlider');
    const sliderValueDisplay = document.getElementById('sliderValueDisplay');
    const lithoBacklight = document.getElementById('lithoBacklight');
    const lithoRelief = document.getElementById('lithoRelief');
    const lithophanePlate = document.getElementById('lithophanePlate');
    const customImageInput = document.getElementById('customImageInput');
    const motifButtons = document.querySelectorAll('.motif-btn');

    // Predefined motifs map
    const LITHO_MOTIFS = {
        family: 'assets/family_portrait.png',
        lion: 'assets/majestic_lion.png',
        puppy: 'assets/playful_puppy.png'
    };

    let currentMotif = 'family';

    function setLithoImage(src) {
        if (lithoBacklight && lithoRelief) {
            lithoBacklight.style.backgroundImage = `url('${src}')`;
            lithoRelief.style.backgroundImage = `url('${src}')`;
        }
    }

    function initLithophane() {
        if (!lithophanePlate || !backlightSlider || !lithoBacklight || !lithoRelief) return;

        // Set initial backgrounds
        const initialImg = LITHO_MOTIFS[currentMotif];
        setLithoImage(initialImg);

        // Set initial CSS variables (spotlight hidden off-screen, backlight dim)
        document.documentElement.style.setProperty('--litho-brightness', '0');
        document.documentElement.style.setProperty('--torch-x', '-50%');
        document.documentElement.style.setProperty('--torch-y', '-50%');

        const pointLight = document.getElementById('svg-point-light');
        const specLight = document.getElementById('svg-point-light-spec');
        const floodColor = document.getElementById('svg-flood-color');
        const diffuseLight = document.getElementById('svg-diffuse-light');
        const specularLight = document.getElementById('svg-specular-light');
        
        const filamentSelect = document.getElementById('filamentSelect');
        const ledTempSelect = document.getElementById('ledTempSelect');
        const frameSelect = document.getElementById('frameSelect');
        const contrastSlider = document.getElementById('contrastSlider');
        const contrastDisplay = document.getElementById('contrastDisplay');
        const woodFrame = document.getElementById('lithophaneWoodFrame');
        const stage = document.querySelector('.lithophane-stage');

        // Initial settings
        updateFilament();
        updateLED();
        updateFrame();
        updateContrast();

        // 3D Tilt Effect on Wood Frame
        if (stage && woodFrame) {
            stage.addEventListener('mousemove', (e) => {
                const rect = stage.getBoundingClientRect();
                const x = e.clientX - (rect.left + rect.width / 2);
                const y = e.clientY - (rect.top + rect.height / 2);
                
                const rotX = -y / (rect.height / 20); // Max ~10 degrees
                const rotY = x / (rect.width / 20);
                
                woodFrame.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            });
            
            stage.addEventListener('mouseleave', () => {
                woodFrame.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
                woodFrame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });
            
            stage.addEventListener('mouseenter', () => {
                woodFrame.style.transition = 'none';
            });
        }

        // Backlight Slider Input Event
        backlightSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            if (sliderValueDisplay) {
                sliderValueDisplay.textContent = `Helligkeit: ${val}%`;
            }
            const opacityVal = val / 100;
            document.documentElement.style.setProperty('--litho-brightness', opacityVal);
            
            // Adjust relief blend mode based on backlight
            if (opacityVal === 0) {
                lithoRelief.style.mixBlendMode = 'normal';
                lithoRelief.style.opacity = '0.98';
            } else {
                lithoRelief.style.mixBlendMode = 'multiply';
                // Slightly fade the relief at high backlight to let colors/details shine brighter
                lithoRelief.style.opacity = (0.98 - (opacityVal * 0.15)).toString();
            }
        });

        // Mouse Move event for torch/flashlight effect
        lithophanePlate.addEventListener('mousemove', (e) => {
            const rect = lithophanePlate.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set custom properties for CSS mask
            document.documentElement.style.setProperty('--torch-x', `${x}px`);
            document.documentElement.style.setProperty('--torch-y', `${y}px`);

            // Update SVG lighting point light sources dynamically
            if (pointLight && specLight) {
                pointLight.setAttribute('x', x.toString());
                pointLight.setAttribute('y', y.toString());
                specLight.setAttribute('x', x.toString());
                specLight.setAttribute('y', y.toString());
            }
        });

        // Mouse leave resets torch position out of bounds
        lithophanePlate.addEventListener('mouseleave', () => {
            document.documentElement.style.setProperty('--torch-x', '-50%');
            document.documentElement.style.setProperty('--torch-y', '-50%');
            
            // Reset point lights back to center default
            const w = lithophanePlate.clientWidth / 2;
            const h = lithophanePlate.clientHeight / 2;
            if (pointLight && specLight) {
                pointLight.setAttribute('x', w.toString());
                pointLight.setAttribute('y', h.toString());
                specLight.setAttribute('x', w.toString());
                specLight.setAttribute('y', h.toString());
            }
        });

        // Filament change handler
        if (filamentSelect) {
            filamentSelect.addEventListener('change', updateFilament);
        }

        // LED color temp change handler
        if (ledTempSelect) {
            ledTempSelect.addEventListener('change', updateLED);
        }

        // Frame change handler
        if (frameSelect) {
            frameSelect.addEventListener('change', updateFrame);
        }

        // Contrast / Detail slider handler
        if (contrastSlider) {
            contrastSlider.addEventListener('input', updateContrast);
        }

        function updateFilament() {
            if (!filamentSelect || !floodColor) return;
            const val = filamentSelect.value;
            
            // Toggle color vs monochrome modes
            if (val === 'color') {
                floodColor.setAttribute('flood-color', '#ffffff');
                floodColor.setAttribute('flood-opacity', '0.15'); // translucent white
                lithoBacklight.classList.add('filament-color');
            } else {
                lithoBacklight.classList.remove('filament-color');
                floodColor.setAttribute('flood-opacity', '1.0');
                
                if (val === 'white') {
                    floodColor.setAttribute('flood-color', '#fafafa');
                } else if (val === 'cream') {
                    floodColor.setAttribute('flood-color', '#fef5e7');
                } else if (val === 'silver') {
                    floodColor.setAttribute('flood-color', '#d5d5d5');
                } else if (val === 'sepia') {
                    floodColor.setAttribute('flood-color', '#d2b48c');
                }
            }
            applyFilters();
        }

        function updateLED() {
            applyFilters();
        }

        function updateFrame() {
            if (!frameSelect || !woodFrame) return;
            const val = frameSelect.value;
            woodFrame.classList.remove('frame-oak', 'frame-pine', 'frame-black', 'frame-alu');
            woodFrame.classList.add(`frame-${val}`);
        }

        function updateContrast() {
            if (!contrastSlider || !diffuseLight || !specularLight) return;
            const val = contrastSlider.value;
            if (contrastDisplay) {
                contrastDisplay.textContent = `Detailtiefe: ${val}`;
            }
            diffuseLight.setAttribute('surfaceScale', val);
            specularLight.setAttribute('surfaceScale', val);
        }

        function applyFilters() {
            if (!ledTempSelect || !filamentSelect) return;
            const led = ledTempSelect.value;
            const filament = filamentSelect.value;

            let filterStr = '';

            // Apply LED color temperature tints
            if (led === 'warm') {
                filterStr += 'sepia(0.65) saturate(1.8) hue-rotate(-15deg) contrast(1.25) brightness(1.05)';
            } else if (led === 'neutral') {
                filterStr += 'sepia(0.15) saturate(1.2) contrast(1.2) brightness(1.1)';
            } else if (led === 'cool') {
                filterStr += 'saturate(0.9) contrast(1.1) brightness(1.1) hue-rotate(15deg)';
            }

            // If it's a monochrome filament, convert backlight to grayscale first
            if (filament !== 'color') {
                filterStr = 'grayscale(1) ' + filterStr;
            }

            lithoBacklight.style.filter = filterStr;
        }

        // Motif Selector click handlers
        motifButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                motifButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const motifKey = btn.getAttribute('data-motif');
                currentMotif = motifKey;
                
                const imgPath = LITHO_MOTIFS[motifKey];
                setLithoImage(imgPath);
            });
        });

        // Custom Image Upload handler
        if (customImageInput) {
            customImageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        setLithoImage(event.target.result);
                        motifButtons.forEach(b => b.classList.remove('active'));
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    // Initialize gallery
    updateGallery();

    // Initialize lithophane simulator
    initLithophane();

    // Initialize map
    initMap();
});
