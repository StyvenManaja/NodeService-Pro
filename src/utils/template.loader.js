const fs = require('fs');
const path = require('path');

/**
 * Charge un template HTML et remplace les variables dynamiques
 * @param {string} templateName - Nom du template (sans extension)
 * @param {Object} variables - Variables à injecter dans le template
 * @returns {string} - HTML prêt à l'emploi
 */
function loadTemplate(templateName, variables = {}) {
    const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
    let html = fs.readFileSync(templatePath, 'utf8');
    for (const [key, value] of Object.entries(variables)) {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return html;
}

module.exports = { loadTemplate };
