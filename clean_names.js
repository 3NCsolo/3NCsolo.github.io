const fs = require('fs');
const path = require('path');

const dir = __dirname;
const exts = ['.html'];

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.html')) {
                arrayOfFiles.push(path.join(dirPath, file));
            }
        }
    });

    return arrayOfFiles;
}

const htmlFiles = getAllFiles(dir);

htmlFiles.forEach(file => {
    // Skip legal files since name belongs there
    if (file.includes('impressum.html') || file.includes('datenschutz.html')) return;

    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // 1. Copyright footer
    content = content.replace(/&copy;\s*2026\s*3NC\s*–\s*Louis\s*Altmann/gi, '&copy; 2026 3NC');

    // 2. Headings in about.html "Louis Altmann & Das Labor" => "3NC & Das Labor"
    content = content.replace(/Louis Altmann( & Das Labor)/, '3NC$1');
    content = content.replace(/Louis Altmann( & The Laboratory)/, '3NC$1');
    content = content.replace(/Louis Altmann( & Phòng thí nghiệm)/, '3NC$1');

    // 3. Image Alt Tag in about.html
    content = content.replace(/alt="Louis Altmann – /g, 'alt="3NC – ');

    // 4. Meta Descriptions 
    content = content.replace(/content="Über 3NC: Louis Altmann – Smart Home Experte & Projektleiter."/g, 'content="Über 3NC: Ihr Labor für additive Fertigung und Prototyping."');
    content = content.replace(/content="About 3NC: Louis Altmann – 3D Printing Specialist & Manufacturer."/g, 'content="About 3NC: Your laboratory for additive manufacturing and prototyping."');
    content = content.replace(/content="Về 3NC: Louis Altmann – Chuyên gia In 3D & Sản xuất."/g, 'content="Về 3NC: Phòng thí nghiệm in 3D và sản xuất nguyên mẫu của bạn."');
    // Note: Other languages might need similar generic meta tag handling. I'll just replace 'Louis Altmann – ' with '' for safety in meta tags.
    content = content.replace(/content="[^"]*Louis Altmann[^"]*"/g, (match) => {
        return match.replace(/Louis Altmann(\s*–\s*|\s*-\s*|,\s*)/i, '');
    });

    // 5. Contact page references where it says <span>Louis Altmann</span>
    content = content.replace(/<span>Louis Altmann<\/span>/g, '<span>3NC Team</span>');

    // 6. manufaktur.html references
    content = content.replace(/— Louis Altmann, /g, '— 3NC, ');

    // 7. Remove the Premium Quality stat box from about.html
    // It looks like:
    // <div class="stat">
    //     <span class="stat-value">Premium</span>
    //     <span class="stat-label">...</span>
    // </div>
    // We can confidently use regex since "stat-value">Premium</span> is unique.
    content = content.replace(/<div class="stat">\s*<span class="stat-value">Premium<\/span>\s*<span class="stat-label">[\s\S]*?<\/span>\s*<\/div>/g, '');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log("Updated: " + path.relative(dir, file));
    }
});
console.log("Cleanup complete.");
