/**
 * 3NC Solo - Comprehensive Material Database
 * Used by the STL Calculator and 3D Advisor Tool for real-time pricing and capability matching.
 */

const MaterialDatabase = {
    // Standard Polymers
    'pla': {
        id: 'pla',
        name: 'PLA / PLA+',
        category: 'Standard',
        density_g_cm3: 1.24,
        price_per_cm3: 0.25,
        base_fee: 5.00, // setup cost
        properties: {
            strength: 2, // 1-5 scale
            heat_resistance_c: 55,
            chemical_resistance: 1,
            flexibility: 1,
            uv_resistance: 2
        },
        finishing: {
            sanding_polishing: true,
            vapor_smoothing: true, // Ethyl acetate
            electroplating: false
        },
        color_options: ['Schwarz', 'Weiß', 'Grau', 'Rot', 'Silber (Silk)'],
        description: 'Der Industriestandard für Prototypen und Deko-Objekte. Sehr maßhaltig, aber nicht hitzebeständig.'
    },
    'petg': {
        id: 'petg',
        name: 'PETG',
        category: 'Standard',
        density_g_cm3: 1.27,
        price_per_cm3: 0.28,
        base_fee: 5.00,
        properties: {
            strength: 3,
            heat_resistance_c: 75,
            chemical_resistance: 3,
            flexibility: 2,
            uv_resistance: 4
        },
        finishing: {
            sanding_polishing: true,
            vapor_smoothing: false,
            electroplating: false
        },
        color_options: ['Schwarz', 'Transparent', 'Grau'],
        description: 'Gute Balance aus Festigkeit und leichter Flexibilität. Witterungs- und UV-beständig.'
    },

    // Technical Polymers (High Performance)
    'abs': {
        id: 'abs',
        name: 'ABS Premium',
        category: 'Technical',
        density_g_cm3: 1.04,
        price_per_cm3: 0.35,
        base_fee: 8.00,
        properties: {
            strength: 4,
            heat_resistance_c: 95,
            chemical_resistance: 3,
            flexibility: 2,
            uv_resistance: 2
        },
        finishing: {
            sanding_polishing: true,
            vapor_smoothing: true, // Acetone
            electroplating: true // Best for galvanic plating
        },
        color_options: ['Schwarz', 'Weiß'],
        description: 'Hitzebeständig und schlagzäh. Ideal für mechanische Bauteile und die perfekte Basis für Oberflächenveredelung (Vergoldung).'
    },
    'asa': {
        id: 'asa',
        name: 'ASA (UV-Resistant)',
        category: 'Technical',
        density_g_cm3: 1.07,
        price_per_cm3: 0.38,
        base_fee: 8.00,
        properties: {
            strength: 4,
            heat_resistance_c: 95,
            chemical_resistance: 3,
            flexibility: 2,
            uv_resistance: 5
        },
        finishing: {
            sanding_polishing: true,
            vapor_smoothing: true,
            electroplating: true
        },
        color_options: ['Schwarz', 'Weiß', 'Grau'],
        description: 'Wie ABS, jedoch hochgradig UV-stabil. Die beste Wahl für Outdoor-Teile und KFZ-Komponenten.'
    },
    'tpu': {
        id: 'tpu',
        name: 'TPU (Flexibel)',
        category: 'Technical',
        density_g_cm3: 1.20,
        price_per_cm3: 0.45,
        base_fee: 10.00,
        properties: {
            strength: 3,
            heat_resistance_c: 65,
            chemical_resistance: 4,
            flexibility: 5, // Extremely flexible
            uv_resistance: 3
        },
        finishing: {
            sanding_polishing: false,
            vapor_smoothing: false,
            electroplating: false
        },
        color_options: ['Schwarz'],
        description: 'Flexibles Gummi-ähnliches Material (Shore 95A). Ideal für Dichtungen, Stoßdämpfer und Greifer.'
    },

    // Engineering Grade
    'pc': {
        id: 'pc',
        name: 'Polycarbonat (PC)',
        category: 'Engineering',
        density_g_cm3: 1.20,
        price_per_cm3: 0.60,
        base_fee: 15.00,
        properties: {
            strength: 5,
            heat_resistance_c: 110,
            chemical_resistance: 2,
            flexibility: 1,
            uv_resistance: 3
        },
        finishing: {
            sanding_polishing: true,
            vapor_smoothing: false,
            electroplating: false
        },
        color_options: ['Schwarz', 'Transparent'],
        description: 'Extrem schlagfest und temperaturbeständig. Für hochbelastete Werkzeuge und Halterungen.'
    },
    'pa_cf': {
        id: 'pa_cf',
        name: 'PA-CF (Nylon Carbon)',
        category: 'Engineering',
        density_g_cm3: 1.15,
        price_per_cm3: 0.85,
        base_fee: 15.00,
        properties: {
            strength: 5,
            heat_resistance_c: 150, // Very high
            chemical_resistance: 4,
            flexibility: 1, // Extremely stiff
            uv_resistance: 4
        },
        finishing: {
            sanding_polishing: false, // Hard to sand due to carbon
            vapor_smoothing: false,
            electroplating: false
        },
        color_options: ['Mattschwarz'],
        description: 'Die absolute Speerspitze. Kohlefaserverstärktes Nylon. Extrem steif, leicht und bis 150°C hitzebeständig.'
    },

    // Specialty / Post-Processing
    'lithophane': {
        id: 'lithophane',
        name: 'Lithophane (3D Foto)',
        category: 'Specialty',
        density_g_cm3: 1.24, // Uses PLA
        price_per_cm3: 0, // Flat rate based on size instead
        base_fee: 0,
        properties: {
            strength: 2,
            heat_resistance_c: 55,
            chemical_resistance: 1,
            flexibility: 1,
            uv_resistance: 2
        },
        finishing: {
            sanding_polishing: false,
            vapor_smoothing: false,
            electroplating: false
        },
        color_options: ['Warmweiß (Litho-Spezial)'],
        description: 'Ein magisches 3D-gedrucktes Foto, das erst im Gegenlicht sichtbar wird. Perfekt als Geschenk.',
        // Custom pricing logic for lithophanes
        flat_rates: {
            '10x15': 25.00, // EUR
            '13x18': 35.00,
            '15x20': 45.00
        }
    },
    'galvanic_gold': {
        id: 'galvanic_gold',
        name: '24k Echtgold Veredelung',
        category: 'Finishing',
        density_g_cm3: 0,
        price_per_cm3: 0, // Request only
        base_fee: 0,
        properties: {
            strength: 5,
            heat_resistance_c: 200,
            chemical_resistance: 5,
            flexibility: 1,
            uv_resistance: 5
        },
        finishing: {
            sanding_polishing: true,
            vapor_smoothing: true,
            electroplating: true
        },
        color_options: ['24k Gold'],
        description: 'Exklusive galvanische Vergoldung von 3D-Drucken. Erfordert ABS/ASA als Kernmaterial.',
        requires_quotation: true
    }
};

// Expose to window for global access
window.MaterialDB = MaterialDatabase;
