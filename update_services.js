const fs = require('fs');
const path = require('path');

const files = [
    'services.html',
    'en/services.html',
    'ru/services.html',
    'ar/services.html',
    'vn/services.html'
];

const replacements = {
    'services.html': {
        headerH2: '<h2>Smart Home & <span class="text-gold">IoT Gadgets</span></h2>',
        headerP: '<p style="color: var(--text-secondary); max-width: 600px; margin: 1rem auto 0 auto;">Retrofit, Einbindung cooler Gadgets & Machbarkeitsstudien ohne aufwendige Neuverkabelung.</p>'
    },
    'en/services.html': {
        headerH2: '<h2>Smart Home & <span class="text-gold">IoT Gadgets</span></h2>',
        headerP: '<p style="color: var(--text-secondary); max-width: 600px; margin: 1rem auto 0 auto;">Retrofitting, integrating cool gadgets & feasibility studies without extensive rewiring.</p>'
    },
    'ru/services.html': {
        headerH2: '<h2>Умный дом и <span class="text-gold">IoT гаджеты</span></h2>',
        headerP: '<p style="color: var(--text-secondary); max-width: 600px; margin: 1rem auto 0 auto;">Модернизация, интеграция крутых гаджетов и анализ осуществимости без полной переделки проводки.</p>'
    },
    'ar/services.html': {
        headerH2: '<h2>المنزل الذكي و <span class="text-gold">أدوات إنترنت الأشياء</span></h2>',
        headerP: '<p style="color: var(--text-secondary); max-width: 600px; margin: 1rem auto 0 auto;">التعديل التحديثي، دمج الأدوات الذكية، ودراسات الجدوى دون الحاجة لتمديدات كهربائية معقدة.</p>'
    },
    'vn/services.html': {
        headerH2: '<h2>Nhà thông minh & <span class="text-gold">Thiết bị IoT</span></h2>',
        headerP: '<p style="color: var(--text-secondary); max-width: 600px; margin: 1rem auto 0 auto;">Nâng cấp, tích hợp các thiết bị tiện ích & nghiên cứu tính khả thi mà không cần đi lại hệ thống dây điện phức tạp.</p>'
    }
};

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove the two blocks: id="sh-planning" and id="sh-integration"
    content = content.replace(/<!-- Block 1: Planning -->[\s\S]*?<!-- Block 2: Integration -->/, '<!-- Block 2: Integration -->');
    content = content.replace(/<!-- Block 2: Integration -->[\s\S]*?<!-- Smart Devices & IoT -->/, '<!-- Smart Devices & IoT -->');

    // Replace header
    const langData = replacements[file];
    content = content.replace(/<div style="text-align: center; margin-bottom: 4rem;">\s*<h2>[\s\S]*?<\/div>/, `<div style="text-align: center; margin-bottom: 4rem;">\n            ${langData.headerH2}\n            ${langData.headerP}\n        </div>`);
    
    fs.writeFileSync(filePath, content, 'utf8');
});

console.log("Translation and block removal complete.");
