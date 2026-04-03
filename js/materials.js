/**
 * 3NC Solo - Comprehensive Multilingual Material Database
 * Focus on genuine high-performance and engineering polymers.
 */

const MaterialDatabase = {
    // Standard Engineering
    'pla': {
        id: 'pla',
        name: { de: 'PLA+', en: 'PLA+', ru: 'PLA+', ar: 'PLA+', vn: 'PLA+' },
        category: { de: 'Prototyping', en: 'Prototyping', ru: 'Прототипирование', ar: 'النماذج الأولية', vn: 'Tạo mẫu' },
        density_g_cm3: 1.24,
        price_per_cm3: 0.25,
        base_fee: 5.00,
        properties: { strength: 2, heat_resistance_c: 55, chemical_resistance: 1, flexibility: 1, uv_resistance: 2 },
        finishing: { sanding_polishing: true, vapor_smoothing: true, electroplating: false },
        color_options: { de: ['Schwarz', 'Weiß', 'Grau'], en: ['Black', 'White', 'Grey'], ru: ['Черный', 'Белый', 'Серый'], ar: ['أسود', 'أبيض', 'رمادي'], vn: ['Đen', 'Trắng', 'Xám'] },
        description: {
            de: 'Standard-Material für Form- und Design-Validierung bei Raumtemperatur.',
            en: 'Standard material for form and design validation at room temperature.',
            ru: 'Стандартный материал для проверки формы и дизайна при комнатной температуре.',
            ar: 'مادة قياسية للتحقق من الشكل والتصميم في درجة حرارة الغرفة.',
            vn: 'Vật liệu tiêu chuẩn để xác nhận thiết kế và hình dạng ở nhiệt độ phòng.'
        }
    },
    'petg': {
        id: 'petg',
        name: { de: 'PETG', en: 'PETG', ru: 'PETG', ar: 'PETG', vn: 'PETG' },
        category: { de: 'Prototyping', en: 'Prototyping', ru: 'Прототипирование', ar: 'النماذج الأولية', vn: 'Tạo mẫu' },
        density_g_cm3: 1.27,
        price_per_cm3: 0.28,
        base_fee: 5.00,
        properties: { strength: 3, heat_resistance_c: 75, chemical_resistance: 3, flexibility: 2, uv_resistance: 4 },
        finishing: { sanding_polishing: true, vapor_smoothing: false, electroplating: false },
        color_options: { de: ['Schwarz', 'Transparent', 'Grau'], en: ['Black', 'Transparent', 'Grey'], ru: ['Черный', 'Прозрачный', 'Серый'], ar: ['أسود', 'شفاف', 'رمادي'], vn: ['Đen', 'Trong suốt', 'Xám'] },
        description: {
            de: 'Schlagzäher Kunststoff mit hoher chemischer Beständigkeit.',
            en: 'Impact-resistant plastic with high chemical resistance.',
            ru: 'Ударопрочный пластик с высокой химической стойкостью.',
            ar: 'بلاستيك مقاوم للصدمات مع مقاومة كيميائية عالية.',
            vn: 'Nhựa chịu va đập với độ bền hóa học cao.'
        }
    },
    'abs': {
        id: 'abs',
        name: { de: 'Industrial ABS', en: 'Industrial ABS', ru: 'Промышленный ABS', ar: 'ABS صناعي', vn: 'ABS công nghiệp' },
        category: { de: 'Engineering', en: 'Engineering', ru: 'Инженерия', ar: 'هندسة', vn: 'Kỹ thuật' },
        density_g_cm3: 1.04,
        price_per_cm3: 0.35,
        base_fee: 8.00,
        properties: { strength: 4, heat_resistance_c: 95, chemical_resistance: 3, flexibility: 2, uv_resistance: 2 },
        finishing: { sanding_polishing: true, vapor_smoothing: true, electroplating: true },
        color_options: { de: ['Schwarz', 'Weiß'], en: ['Black', 'White'], ru: ['Черный', 'Белый'], ar: ['أسود', 'أبيض'], vn: ['Đen', 'Trắng'] },
        description: {
            de: 'Die perfekte Basis für mechanische Nachbearbeitung und Oberflächenveredelung (z.B. Vergoldung).',
            en: 'The perfect base for mechanical post-processing and surface finishing (e.g., gold plating).',
            ru: 'Идеальная основа для механической постобработки и отделки поверхности (например, золочение).',
            ar: 'القاعدة المثالية للمعالجة اللاحقة الميكانيكية وتشطيب الأسطح (مثل الطلاء بالذهب).',
            vn: 'Cơ sở hoàn hảo cho quá trình hậu xử lý cơ học và hoàn thiện bề mặt (ví dụ: mạ vàng).'
        }
    },
    'pc': {
        id: 'pc',
        name: { de: 'PC (Polycarbonat)', en: 'PC (Polycarbonate)', ru: 'PC (Поликарбонат)', ar: 'PC (بولي كربونات)', vn: 'PC (Polycarbonate)' },
        category: { de: 'Engineering', en: 'Engineering', ru: 'Инженерия', ar: 'هندسة', vn: 'Kỹ thuật' },
        density_g_cm3: 1.20,
        price_per_cm3: 0.60,
        base_fee: 15.00,
        properties: { strength: 5, heat_resistance_c: 110, chemical_resistance: 2, flexibility: 1, uv_resistance: 3 },
        finishing: { sanding_polishing: true, vapor_smoothing: false, electroplating: false },
        color_options: { de: ['Schwarz', 'Transparent'], en: ['Black', 'Transparent'], ru: ['Черный', 'Прозрачный'], ar: ['أسود', 'شفاف'], vn: ['Đen', 'Trong suốt'] },
        description: {
            de: 'Extrem schlagfest. Für transparente oder hochbelastete Werkzeuge und Halterungen.',
            en: 'Extremely impact resistant. For transparent or high-load tools and fixtures.',
            ru: 'Чрезвычайно ударопрочный. Для прозрачных или высоконагруженных инструментов и приспособлений.',
            ar: 'مقاوم للصدمات للغاية. للأدوات والتركيبات الشفافة أو عالية التحمل.',
            vn: 'Cực kỳ chống va đập. Dành cho các dụng cụ và đồ gá trong suốt hoặc chịu tải cao.'
        }
    },
    'pa_cf': {
        id: 'pa_cf',
        name: { de: 'PA-CF (Carbon-Nylon)', en: 'PA-CF (Carbon-Nylon)', ru: 'PA-CF (Углерод-Нейлон)', ar: 'PA-CF (نايلون كربوني)', vn: 'PA-CF (Nylon Carbon)' },
        category: { de: 'Composite', en: 'Composite', ru: 'Композит', ar: 'مركب', vn: 'Composite' },
        density_g_cm3: 1.15,
        price_per_cm3: 0.85,
        base_fee: 15.00,
        properties: { strength: 5, heat_resistance_c: 150, chemical_resistance: 4, flexibility: 1, uv_resistance: 4 },
        finishing: { sanding_polishing: false, vapor_smoothing: false, electroplating: false },
        color_options: { de: ['Mattschwarz'], en: ['Matte Black'], ru: ['Матовый черный'], ar: ['أسود مطفي'], vn: ['Đen mờ'] },
        description: {
            de: 'Kohlefaserverstärktes Polyamid. Die Referenz für höchste Steifigkeit und bis 150°C hitzebeständig.',
            en: 'Carbon fiber reinforced polyamide. The reference for highest stiffness and heat resistant up to 150°C.',
            ru: 'Полиамид, усиленный углеродным волокном. Эталон высочайшей жесткости и термостойкости до 150°C.',
            ar: 'بولي أميد مقوى بألياف الكربون. المرجع لأعلى صلابة ومقاوم للحرارة حتى 150 درجة مئوية.',
            vn: 'Polyamide gia cố bằng sợi carbon. Tham chiếu cho độ cứng cao nhất và chịu nhiệt lên đến 150°C.'
        }
    },
    'pa_gf': {
        id: 'pa_gf',
        name: { de: 'PA-GF (Glasfaser-Nylon)', en: 'PA-GF (Glass-Fiber-Nylon)', ru: 'PA-GF (Стекловолокно-Нейлон)', ar: 'PA-GF (نايلون ألياف زجاجية)', vn: 'PA-GF (Nylon sợi thủy tinh)' },
        category: { de: 'Composite', en: 'Composite', ru: 'Композит', ar: 'مركب', vn: 'Composite' },
        density_g_cm3: 1.35,
        price_per_cm3: 0.80,
        base_fee: 15.00,
        properties: { strength: 5, heat_resistance_c: 140, chemical_resistance: 4, flexibility: 1, uv_resistance: 4 },
        finishing: { sanding_polishing: false, vapor_smoothing: false, electroplating: false },
        color_options: { de: ['Natur', 'Schwarz'], en: ['Natural', 'Black'], ru: ['Натуральный', 'Черный'], ar: ['طبيعي', 'أسود'], vn: ['Tự nhiên', 'Đen'] },
        description: {
            de: 'Glasfaserverstärktes Polyamid für höchste Festigkeit und abrasive Umgebungen.',
            en: 'Glass fiber reinforced polyamide for highest strength and abrasive environments.',
            ru: 'Полиамид, усиленный стекловолокном, для высочайшей прочности и абразивных сред.',
            ar: 'بولي أميد مقوى بألياف زجاجية لأعلى قوة وبيئات كاشطة.',
            vn: 'Polyamide gia cố bằng sợi thủy tinh cho độ bền cao nhất và môi trường mài mòn.'
        }
    },
    'ppa_cf': {
        id: 'ppa_cf',
        name: { de: 'PPA-CF (High-Temp Carbon)', en: 'PPA-CF (High-Temp Carbon)', ru: 'PPA-CF (Высокотемпературный углерод)', ar: 'PPA-CF (كربون عالي الحرارة)', vn: 'PPA-CF (Carbon chịu nhiệt cao)' },
        category: { de: 'High-Tech', en: 'High-Tech', ru: 'Хай-тек', ar: 'تقنية عالية', vn: 'Công nghệ cao' },
        density_g_cm3: 1.18,
        price_per_cm3: 1.50,
        base_fee: 25.00,
        properties: { strength: 5, heat_resistance_c: 190, chemical_resistance: 5, flexibility: 1, uv_resistance: 5 },
        finishing: { sanding_polishing: false, vapor_smoothing: false, electroplating: false },
        color_options: { de: ['Mattschwarz'], en: ['Matte Black'], ru: ['Матовый черный'], ar: ['أسود مطفي'], vn: ['Đen mờ'] },
        description: {
            de: 'Polyphthalamid (PPA) mit Carbon. Entwickelt für Motorraumkomponenten und Temperaturen über 180°C.',
            en: 'Polyphthalamide (PPA) with carbon. Developed for engine compartment components and temperatures above 180°C.',
            ru: 'Полифталамид (PPA) с углеродом. Разработан для компонентов моторного отсека и температур выше 180°C.',
            ar: 'بولي فثالاميد (PPA) مع الكربون. تم تطويره لمكونات مقصورة المحرك ودرجات حرارة تزيد عن 180 درجة مئوية.',
            vn: 'Polyphthalamide (PPA) với carbon. Được phát triển cho các thành phần khoang động cơ và nhiệt độ trên 180°C.'
        }
    },
    'tpu_95a': {
        id: 'tpu_95a',
        name: { de: 'TPU 95A (Elastomer)', en: 'TPU 95A (Elastomer)', ru: 'TPU 95A (Эластомер)', ar: 'TPU 95A (إлаستومر)', vn: 'TPU 95A (Chất đàn hồi)' },
        category: { de: 'Specialty', en: 'Specialty', ru: 'Спецматериалы', ar: 'تخصص', vn: 'Đặc biệt' },
        density_g_cm3: 1.20,
        price_per_cm3: 0.55,
        base_fee: 10.00,
        properties: { strength: 3, heat_resistance_c: 65, chemical_resistance: 4, flexibility: 5, uv_resistance: 3 },
        finishing: { sanding_polishing: false, vapor_smoothing: false, electroplating: false },
        color_options: { de: ['Schwarz'], en: ['Black'], ru: ['Черный'], ar: ['أسود'], vn: ['Đen'] },
        description: {
            de: 'Spezial-Elastomer. Ideal für kundenspezifische Dichtungen, Stoßdämpfer und Greifer.',
            en: 'Special elastomer. Ideal for custom seals, shock absorbers and grippers.',
            ru: 'Специальный эластомер. Идеально подходит для нестандартных уплотнений, амортизаторов и захватов.',
            ar: 'إлаستومر خاص. مثالي للأختام المخصصة وامتصاص الصدمات والقوابض.',
            vn: 'Chất đàn hồi đặc biệt. Lý tưởng cho các vòng đệm tùy chỉnh, bộ giảm xóc và kẹp.'
        }
    },
    'lithophane': {
        id: 'lithophane',
        name: { de: 'Lithophane', en: 'Lithophane', ru: 'Литофания', ar: 'ليثوفان', vn: 'Lithophane' },
        category: { de: 'Specialty', en: 'Specialty', ru: 'Спецматериалы', ar: 'تخصص', vn: 'Đặc biệt' },
        density_g_cm3: 1.24,
        price_per_cm3: 0,
        base_fee: 0,
        properties: { strength: 2, heat_resistance_c: 55, chemical_resistance: 1, flexibility: 1, uv_resistance: 2 },
        finishing: { sanding_polishing: false, vapor_smoothing: false, electroplating: false },
        color_options: { de: ['Warmweiß'], en: ['Warm White'], ru: ['Теплый белый'], ar: ['أبيض دافئ'], vn: ['Trắng ấm'] },
        description: {
            de: 'Hochauflösendes Lithophane auf Basis Ihres JPG/PNG-Uploads.',
            en: 'High-resolution lithophane based on your JPG/PNG upload.',
            ru: 'Литофания высокого разрешения на основе вашей загрузки JPG/PNG.',
            ar: 'ليثوفان عالي الدقة يعتمد على تحميل JPG / PNG الخاص بك.',
            vn: 'Lithophane độ phân giải cao dựa trên tải lên JPG / PNG của bạn.'
        },
        flat_rates: { '10x15': 25.00, '13x18': 35.00, '15x20': 45.00 }
    },
    'galvanic_gold': {
        id: 'galvanic_gold',
        name: { de: '24k Echtgold Veredelung', en: '24k Gold Plating', ru: 'Покрытие 24к золотом', ar: 'طلاء بالذهب عيار 24 قيراط', vn: 'Mạ vàng 24k' },
        category: { de: 'Finishing', en: 'Finishing', ru: 'Отделка', ar: 'تشطيب', vn: 'Hoàn thiện' },
        density_g_cm3: 0,
        price_per_cm3: 0,
        base_fee: 0,
        properties: { strength: 5, heat_resistance_c: 200, chemical_resistance: 5, flexibility: 1, uv_resistance: 5 },
        finishing: { sanding_polishing: true, vapor_smoothing: true, electroplating: true },
        color_options: { de: ['24k Gold'], en: ['24k Gold'], ru: ['24к Золото'], ar: ['ذهب 24 قيراط'], vn: ['Vàng 24k'] },
        description: {
            de: 'Exklusive galvanische Vergoldung von 3D-Drucken. Erfordert ABS als Kernmaterial.',
            en: 'Exclusive galvanic gold plating of 3D prints. Requires ABS as core material.',
            ru: 'Эксклюзивное гальваническое золочение 3D-отпечатков. Требуется ABS в качестве основного материала.',
            ar: 'طلاء غلفاني حصري بالذهب للمطبوعات ثلاثية الأبعاد. يتطلب ABS كمادة أساسية.',
            vn: 'Mạ vàng điện hóa độc quyền cho bản in 3D. Yêu cầu ABS làm vật liệu lõi.'
        },
        requires_quotation: true
    }
};

window.MaterialDB = MaterialDatabase;
