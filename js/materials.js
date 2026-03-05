/**
 * 3NC Solo - Comprehensive Material Database
 * Focus on genuine high-performance and engineering polymers.
 */

const MaterialDatabase = {
    // Standard Engineering
    'pla': {
        id: 'pla',
        name: 'PLA+',
        category: 'Prototyping',
        density_g_cm3: 1.24,
        price_per_cm3: 0.25,
        base_fee: 5.00,
        properties: {
            strength: 2,
            heat_resistance_c: 55,
            chemical_resistance: 1,
            flexibility: 1,
            uv_resistance: 2
        },
        finishing: {
            sanding_polishing: true,
            vapor_smoothing: true,
            electroplating: false
        },
        color_options: ['Schwarz', 'Weiß', 'Grau'],
        description: 'Standard-Material für Form- und Design-Validierung bei Raumtemperatur.'
    },
    'petg': {
        id: 'petg',
        name: 'PETG',
        category: 'Prototyping',
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
        description: 'Schlagzäher Kunststoff mit hoher chemischer Beständigkeit.'
    },

    // High Performance Engineering
    'abs': {
        id: 'abs',
        name: 'Industrial ABS',
        category: 'Engineering',
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
            vapor_smoothing: true,
            electroplating: true // Best for galvanic plating
        },
        color_options: ['Schwarz', 'Weiß'],
        description: 'Die perfekte Basis für mechanische Nachbearbeitung und Oberflächenveredelung (z.B. Vergoldung).'
    },
    'pc': {
        id: 'pc',
        name: 'PC (Reines Polycarbonat)',
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
        description: 'Extrem schlagfest. Für transparente oder hochbelastete Werkzeuge und Halterungen.'
    },

    // High-Tech Composites
    'pa_cf': {
        id: 'pa_cf',
        name: 'PA-CF (Carbon-Nylon)',
        category: 'Composite',
        density_g_cm3: 1.15,
        price_per_cm3: 0.85,
        base_fee: 15.00,
        properties: {
            strength: 5,
            heat_resistance_c: 150,
            chemical_resistance: 4,
            flexibility: 1, // Extremely stiff
            uv_resistance: 4
        },
        finishing: {
            sanding_polishing: false,
            vapor_smoothing: false,
            electroplating: false
        },
        color_options: ['Mattschwarz'],
        description: 'Kohlefaserverstärktes Polyamid. Die Referenz für höchste Steifigkeit und bis 150°C hitzebeständig.'
    },
    'pa_gf': {
        id: 'pa_gf',
        name: 'PA-GF (Glasfaser-Nylon)',
        category: 'Composite',
        density_g_cm3: 1.35,
        price_per_cm3: 0.80,
        base_fee: 15.00,
        properties: {
            strength: 5,
            heat_resistance_c: 140,
            chemical_resistance: 4,
            flexibility: 1,
            uv_resistance: 4
        },
        finishing: {
            sanding_polishing: false,
            vapor_smoothing: false,
            electroplating: false
        },
        color_options: ['Neutrale Naturfarbe', 'Schwarz'],
        description: 'Glasfaserverstärktes Polyamid für höchste Festigkeit und abrasive Umgebungen.'
    },
    'ppa_cf': {
        id: 'ppa_cf',
        name: 'PPA-CF (Ultra-High-Temp Carbon)',
        category: 'High-Tech',
        density_g_cm3: 1.18,
        price_per_cm3: 1.50,
        base_fee: 25.00,
        properties: {
            strength: 5,
            heat_resistance_c: 190, // Massive heat resistance
            chemical_resistance: 5,
            flexibility: 1,
            uv_resistance: 5
        },
        finishing: {
            sanding_polishing: false,
            vapor_smoothing: false,
            electroplating: false
        },
        color_options: ['Mattschwarz'],
        description: 'Polyphthalamid (PPA) mit Carbon. Entwickelt für Motorraumkomponenten und Dauergebrauchstemperaturen über 180°C.'
    },
    'tpu_95a': {
        id: 'tpu_95a',
        name: 'TPU 95A (Elastomer)',
        category: 'Spezial',
        density_g_cm3: 1.20,
        price_per_cm3: 0.55,
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
        description: 'Spezial-Elastomer. Ideal für kundenspezifische Dichtungen, Stoßdämpfer und Greifer.'
    },

    // Specialty / Post-Processing
    'lithophane': {
        id: 'lithophane',
        name: 'Lithophane',
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
        color_options: ['Warmweiß / Kaltweiß'],
        description: 'Hochauflösendes Lithophane auf Basis Ihres JPG/PNG-Uploads.',
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
        description: 'Exklusive galvanische Vergoldung von 3D-Drucken. Erfordert ABS als Kernmaterial.',
        requires_quotation: true
    }
};

// Expose to window for global access
window.MaterialDB = MaterialDatabase;
