function clearElement(element) {
    if (!element) return;
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function createStatusRow(label, value, isOk) {
    const row = document.createElement('div');
    row.className = 'bug-item ' + (isOk ? 'success' : 'error');

    const strong = document.createElement('strong');
    strong.className = isOk ? 'status-ok' : 'status-error';
    strong.textContent = label;

    row.appendChild(strong);
    row.appendChild(document.createTextNode(' ' + value));
    return row;
}

function createBugEntry(strongClass, strongText, message, details) {
    const item = document.createElement('div');
    item.className = 'bug-item ' + (strongClass === 'status-error' ? 'error' : 'warning');

    const strong = document.createElement('strong');
    strong.className = strongClass;
    strong.textContent = strongText;

    const messageText = document.createTextNode(message);
    const small = document.createElement('small');
    small.textContent = details;

    item.appendChild(strong);
    item.appendChild(messageText);
    if (details) {
        item.appendChild(document.createElement('br'));
        item.appendChild(small);
    }
    return item;
}

function createInfoLine(label, value) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = label;
    p.appendChild(strong);
    p.appendChild(document.createTextNode(' ' + value));
    return p;
}

function bindBugReportButtons() {
    const scanBtn = document.getElementById('scan-btn');
    if (scanBtn) {
        scanBtn.addEventListener('click', () => {
            if (typeof runFullScan === 'function') {
                runFullScan();
            } else {
                alert('🔧 Le scanner n\'est pas encore chargé. Actualise la page.');
            }
        });
    }

    const copyReportBtn = document.getElementById('copy-bug-report-btn');
    if (copyReportBtn) {
        copyReportBtn.addEventListener('click', copyBugReport);
    }

    const copyButtons = document.querySelectorAll('.copy-section-btn[data-section]');
    copyButtons.forEach((button) => {
        const sectionId = button.getAttribute('data-section');
        if (sectionId) {
            button.addEventListener('click', function () {
                copySection(sectionId);
            });
        }
    });
}

const pageBugReport = {
    errors: [],
    warnings: [],
    success: [],
    siteStatus: {
        themes: 'unknown',
        music: 'unknown',
        animations: 'unknown',
        menu: 'unknown'
    }
};

function logPageError(type, message, details = '') {
    const error = {
        date: new Date().toLocaleTimeString('fr-FR'),
        type,
        message,
        details
    };
    pageBugReport.errors.push(error);
    console.error('🐛 [BUG REPORT]', error);
    updateBugPage();
}

function logPageWarning(type, message, details = '') {
    const warning = {
        date: new Date().toLocaleTimeString('fr-FR'),
        type,
        message,
        details
    };
    pageBugReport.warnings.push(warning);
    console.warn('⚠️ [BUG REPORT]', warning);
    updateBugPage();
}

function updateBugPage() {
    const lastUpdate = document.getElementById('last-update');
    if (lastUpdate) {
        lastUpdate.textContent = new Date().toLocaleString('fr-FR');
    }

    const statusDiv = document.getElementById('site-status');
    if (statusDiv) {
        clearElement(statusDiv);
        statusDiv.appendChild(createStatusRow('🎨 Thèmes :', pageBugReport.siteStatus.themes, pageBugReport.siteStatus.themes === '✅ OK'));
        statusDiv.appendChild(createStatusRow('🎵 Musique :', pageBugReport.siteStatus.music, pageBugReport.siteStatus.music === '✅ OK'));
        statusDiv.appendChild(createStatusRow('✨ Animations :', pageBugReport.siteStatus.animations, pageBugReport.siteStatus.animations === '✅ OK'));
        statusDiv.appendChild(createStatusRow('📱 Menu :', pageBugReport.siteStatus.menu, pageBugReport.siteStatus.menu === '✅ OK'));
    }

    const logDiv = document.getElementById('error-log');
    if (logDiv) {
        clearElement(logDiv);
        if (pageBugReport.errors.length === 0 && pageBugReport.warnings.length === 0) {
            const p = document.createElement('p');
            p.className = 'status-ok';
            p.textContent = '✅ Aucune erreur détectée pour le moment.';
            logDiv.appendChild(p);
        } else {
            pageBugReport.errors.forEach(err => {
                logDiv.appendChild(createBugEntry(
                    'status-error',
                    `❌ [${err.date}] ${err.type}`,
                    err.message,
                    err.details
                ));
            });
            pageBugReport.warnings.forEach(warn => {
                logDiv.appendChild(createBugEntry(
                    'status-warning',
                    `⚠️ [${warn.date}] ${warn.type}`,
                    warn.message,
                    warn.details
                ));
            });
        }
    }

    const successDiv = document.getElementById('success-log');
    if (successDiv) {
        clearElement(successDiv);
        if (pageBugReport.success.length === 0) {
            const p = document.createElement('p');
            p.className = 'status-ok';
            p.textContent = '✅ Aucun succès enregistré pour le moment.';
            successDiv.appendChild(p);
        } else {
            pageBugReport.success.forEach(item => {
                successDiv.appendChild(createBugEntry(
                    'status-ok',
                    `✅ ${item.title}`,
                    item.message,
                    item.details || ''
                ));
            });
        }
    }

    const infoDiv = document.getElementById('tech-info');
    if (infoDiv) {
        clearElement(infoDiv);
        infoDiv.appendChild(createInfoLine('Navigateur :', navigator.userAgent));
        infoDiv.appendChild(createInfoLine('Fenêtre :', `${window.innerWidth}x${window.innerHeight}`));
        infoDiv.appendChild(createInfoLine('URL :', window.location.href));
        infoDiv.appendChild(createInfoLine('Erreurs totales :', pageBugReport.errors.length));
        infoDiv.appendChild(createInfoLine('Avertissements :', pageBugReport.warnings.length));
        infoDiv.appendChild(createInfoLine('Page :', 'bug-report.html'));
    }
}

function copyBugReport() {
    let report = `🐛 RAPPORT DE BUG - PORTFOLIO CÉDRIC AUGUSTO\n`;
    report += `═══════════════════════════════════════════════════════════════\n\n`;
    report += `📅 Date : ${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR')}\n`;
    report += `📄 Page : bug-report.html\n\n`;
    report += `📊 ÉTAT DU SITE\n`;
    report += `─────────────────────────────────────────────────────\n`;
    report += `🎨 Thèmes : ${pageBugReport.siteStatus.themes}\n`;
    report += `🎵 Musique : ${pageBugReport.siteStatus.music}\n`;
    report += `✨ Animations : ${pageBugReport.siteStatus.animations}\n`;
    report += `📱 Menu : ${pageBugReport.siteStatus.menu}\n\n`;
    report += `📝 JOURNAL DES ERREURS\n`;
    report += `─────────────────────────────────────────────────────\n`;

    if (pageBugReport.errors.length === 0 && pageBugReport.warnings.length === 0) {
        report += `✅ Aucune erreur détectée.\n\n`;
    } else {
        pageBugReport.errors.forEach(err => {
            report += `❌ [${err.date}] ${err.type}\n`;
            report += `   ${err.message}\n`;
            report += `   Détails : ${err.details}\n\n`;
        });
        pageBugReport.warnings.forEach(warn => {
            report += `⚠️ [${warn.date}] ${warn.type}\n`;
            report += `   ${warn.message}\n`;
            report += `   Détails : ${warn.details}\n\n`;
        });
    }

    report += `✅ SUCCÈS\n`;
    report += `─────────────────────────────────────────────────────\n`;
    if (pageBugReport.success.length === 0) {
        report += `Aucun succès enregistré pour le moment.\n\n`;
    } else {
        pageBugReport.success.forEach(item => {
            report += `✅ ${item.title} - ${item.message}\n`;
            if (item.details) {
                report += `   ${item.details}\n`;
            }
        });
        report += '\n';
    }

    report += `🔧 LIENS UTILES\n`;
    report += `─────────────────────────────────────────────────────\n`;
    report += `GitHub : https://github.com/lemondedutravail803-lang/portfolio\n`;
    report += `Portfolio : https://lemondedutravail803-lang.github.io/portfolio/\n`;
    report += `Bug Report : https://lemondedutravail803-lang.github.io/portfolio/bug-report.html\n\n`;

    navigator.clipboard.writeText(report).then(() => {
        alert('✅ Rapport copié dans le presse-papiers !\n\nMaintenant :\n1. Colle le rapport à Qwen (l\'IA)\n2. Décris ton problème en détail\n3. Qwen va analyser et corriger');
    }).catch(err => {
        console.error('Erreur lors de la copie :', err);
        alert('❌ Erreur lors de la copie. Sélectionne manuellement.');
    });
}

function copySection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) {
        alert('❌ Section introuvable');
        return;
    }

    const sectionBlock = section.closest('.bug-section');
    const heading = sectionBlock ? sectionBlock.querySelector('h2') : null;
    const sectionTitle = heading ? heading.childNodes[0].textContent.trim() : sectionId;

    let text = section.innerText;
    text = `${sectionTitle}\n${'═'.repeat(50)}\n\n${text}`;

    navigator.clipboard.writeText(text).then(() => {
        alert(`✅ Section "${sectionTitle}" copiée !\n\nTu peux la coller maintenant.`);
    }).catch(err => {
        console.error('Erreur lors de la copie :', err);
        alert('❌ Erreur lors de la copie. Sélectionne et copie manuellement.');
    });
}

function registerPageEventHandlers() {
    window.addEventListener('error', (event) => {
        logPageError(
            'JavaScript',
            event.message,
            `${event.filename}:${event.lineno}:${event.colno}`
        );
        event.preventDefault();
        return true;
    });

    window.addEventListener('unhandledrejection', (event) => {
        logPageError(
            'Promesse',
            'Promesse rejetée non gérée',
            event.reason ? String(event.reason) : 'Raison inconnue'
        );
        event.preventDefault();
        return true;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const themeToggle = document.getElementById('theme-toggle');
        pageBugReport.siteStatus.themes = themeToggle ? '✅ OK' : '❌ Introuvable';

        const menuToggle = document.getElementById('menu-toggle');
        pageBugReport.siteStatus.menu = menuToggle ? '✅ OK' : '❌ Introuvable';

        pageBugReport.siteStatus.music = 'ℹ️ Non disponible sur cette page';
        pageBugReport.siteStatus.animations = 'ℹ️ Non disponible sur cette page';

        bindBugReportButtons();
        updateBugPage();
        registerPageEventHandlers();
        console.log('✅ Page Rapport de Bug chargée avec succès');
    }, 250);
});
