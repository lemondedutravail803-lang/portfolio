// auto-scan.js
// Scanner portfolio premium compatible CSP (pas de eval, pas de new Function, pas d'innerHTML)

const ScanApp = (() => {
    const PAGES_TO_SCAN = [
        'index.html',
        'honkai-star-rail.html',
        'wuthering-waves.html',
        'videos.html',
        'bug-report.html'
    ];

    const PALIER_RULES = [
        { max: 15, className: 'palier-1', label: 'Initialisation & Démarrage', color: '#ef4444' },
        { max: 30, className: 'palier-2', label: 'Analyse Structure & IA', color: '#f97316' },
        { max: 50, className: 'palier-3', label: 'Découverte Médias', color: '#f59e0b' },
        { max: 70, className: 'palier-4', label: 'Analyse Projets', color: '#10b981' },
        { max: 85, className: 'palier-5', label: 'Vérification Liens', color: '#3b82f6' },
        { max: 99, className: 'palier-6', label: 'Validation finale', color: '#8b5cf6' },
        { max: 100, className: 'palier-7', label: 'SUCCÈS', color: '#22c55e' }
    ];

    const state = {
        pages: [],
        sections: [],
        videos: [],
        musics: [],
        projects: [],
        iaSoftwares: [],
        links: { total: 0, valid: 0, broken: [] },
        features: [],
        errors: [],
        warnings: [],
        score: 0,
        progress: 0,
        startedAt: 0
    };

    let elements = null;

    function createElement(tag, options = {}) {
        const node = document.createElement(tag);
        if (options.className) {
            node.className = options.className;
        }
        if (options.id) {
            node.id = options.id;
        }
        if (options.type) {
            node.type = options.type;
        }
        if (options.role) {
            node.setAttribute('role', options.role);
        }
        if (options.ariaLabel) {
            node.setAttribute('aria-label', options.ariaLabel);
        }
        if (options.text) {
            node.textContent = options.text;
        }
        return node;
    }

    function appendChildren(parent, ...children) {
        children.forEach((child) => {
            if (child) {
                parent.appendChild(child);
            }
        });
        return parent;
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function delay(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    function clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    function createModalMarkup() {
        if (document.getElementById('scan-modal-overlay')) {
            return;
        }

        const banner = createElement('div', { id: 'scan-banner', className: 'scan-banner' });

        const closeButton = createElement('button', {
            id: 'scan-modal-close',
            className: 'scan-modal-close',
            ariaLabel: 'Fermer la modale'
        });
        closeButton.textContent = '✕';

        const title = createElement('h2', { id: 'scan-modal-title' });
        title.textContent = 'Scanner Portfolio — Rapport en direct';

        const statusText = createElement('p', { id: 'scan-status-text', className: 'scan-status-text' });
        statusText.textContent = 'Prêt à lancer le scan';

        const headerLeft = createElement('div');
        appendChildren(headerLeft, title, statusText);

        const header = createElement('div', { className: 'scan-modal-header' });
        appendChildren(header, headerLeft, closeButton);

        const progressLabel = createElement('div', { className: 'scan-progress-label' });
        const progressTitle = createElement('strong', { text: 'Progression' });
        const progressPercentLabel = createElement('span', { id: 'scan-progress-percent', text: '0%' });
        appendChildren(progressLabel, progressTitle, progressPercentLabel);

        const progressFill = createElement('div', { id: 'scan-progress-bar-fill', className: 'scan-progress-bar-fill palier-1' });
        const progressBar = createElement('div', { className: 'scan-progress-bar' });
        progressBar.appendChild(progressFill);

        const progressCenter = createElement('div', { className: 'scan-progress-percent', text: '0%' });
        progressBar.appendChild(progressCenter);

        const progressLine = createElement('p', { id: 'scan-status-line', className: 'scan-status-text', text: 'Initialisation du scanner...' });

        const progressBlock = createElement('div', { className: 'scan-progress' });
        appendChildren(progressBlock, progressLabel, progressBar, progressLine);

        const resultsBlock = createElement('div', { id: 'scan-results', className: 'scan-results' });

        const localWarning = createElement('div', { id: 'scan-local-warning', className: 'scan-local-warning' });
        localWarning.style.display = 'none';

        const successBanner = createElement('div', { id: 'scan-success-banner', className: 'scan-success-banner' });
        successBanner.style.display = 'none';
        const successStrong = createElement('strong', { text: '✅ AUCUN PROBLÈME DÉTECTÉ !' });
        const successScore = createElement('div', { id: 'scan-success-score', className: 'scan-success-score', text: '100%' });
        const successText = createElement('p', { text: 'Tout est vert. Le portfolio est sain et optimisé.' });
        appendChildren(successBanner, successStrong, successScore, successText);

        const confettiWrapper = createElement('div', { id: 'confetti-wrapper', className: 'confetti-wrapper' });

        const closeFooter = createElement('button', { id: 'scan-modal-close-button', className: 'scan-modal-button close' });
        closeFooter.textContent = '✕ FERMER';
        const footer = createElement('div', { className: 'scan-modal-footer' });
        footer.appendChild(closeFooter);

        const modal = createElement('div', { className: 'scan-modal' });
        appendChildren(modal, header, progressBlock, resultsBlock, localWarning, successBanner, confettiWrapper, footer);

        const overlay = createElement('div', { id: 'scan-modal-overlay', className: 'scan-modal-overlay' });
        overlay.appendChild(modal);

        const container = document.createElement('div');
        container.appendChild(banner);
        container.appendChild(overlay);

        document.body.appendChild(container);
    }

    function ensureElements() {
        if (elements) {
            return;
        }

        elements = {
            banner: document.getElementById('scan-banner'),
            overlay: document.getElementById('scan-modal-overlay'),
            closeButton: document.getElementById('scan-modal-close'),
            closeFooterButton: document.getElementById('scan-modal-close-button'),
            progressFill: document.getElementById('scan-progress-bar-fill'),
            progressPercent: document.getElementById('scan-progress-percent'),
            statusText: document.getElementById('scan-status-text'),
            statusLine: document.getElementById('scan-status-line'),
            results: document.getElementById('scan-results'),
            localWarning: document.getElementById('scan-local-warning'),
            successBanner: document.getElementById('scan-success-banner'),
            successScore: document.getElementById('scan-success-score'),
            confettiWrapper: document.getElementById('confetti-wrapper')
        };
    }

    function attachModalEvents() {
        if (!elements) {
            return;
        }

        const closeAction = function () {
            closeModal();
        };

        elements.closeButton.addEventListener('click', closeAction);
        elements.closeFooterButton.addEventListener('click', closeAction);

        elements.overlay.addEventListener('click', function (event) {
            if (event.target === elements.overlay) {
                closeModal();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && elements.overlay.classList.contains('active')) {
                closeModal();
            }
        });
    }

    function openModal() {
        if (!elements) {
            return;
        }
        elements.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        elements.banner.style.transform = 'translateY(-100%)';
        setTimeout(function () {
            elements.banner.style.transform = 'translateY(0)';
        }, 20);
    }

    function closeModal() {
        if (!elements) {
            return;
        }
        elements.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function resetModalVisuals() {
        if (!elements) {
            return;
        }
        elements.progressFill.style.width = '0%';
        elements.progressFill.className = 'scan-progress-bar-fill palier-1';
        elements.progressPercent.textContent = '0%';
        elements.statusText.textContent = 'Prêt à lancer le scan';
        elements.statusText.style.color = '#cbd5e1';
        elements.statusLine.textContent = 'Initialisation du scanner...';
        clearElement(elements.results);
        elements.localWarning.style.display = 'none';
        elements.successBanner.style.display = 'none';
        clearElement(elements.confettiWrapper);
    }

    function getPalier(progress) {
        var i;
        for (i = 0; i < PALIER_RULES.length; i += 1) {
            if (progress <= PALIER_RULES[i].max) {
                return PALIER_RULES[i];
            }
        }
        return PALIER_RULES[PALIER_RULES.length - 1];
    }

    function updateProgress(progress, label) {
        if (!elements) {
            return;
        }
        var clamped = clamp(Math.round(progress), 0, 100);
        var palier = getPalier(clamped);
        elements.progressFill.style.width = clamped + '%';
        elements.progressFill.className = 'scan-progress-bar-fill ' + palier.className;
        elements.progressPercent.textContent = clamped + '%';
        elements.statusText.textContent = label || palier.label;
        elements.statusText.style.color = palier.color;
        elements.statusLine.textContent = palier.label;
        state.progress = clamped;
    }

    function scrollToProblem(item) {
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        item.classList.add('focused');
        setTimeout(function () {
            item.classList.remove('focused');
        }, 600);
    }

    function addResultItem(options) {
        if (!elements) {
            return;
        }
        var item = createElement('div', { className: 'scan-result-item ' + options.type });
        var meta = createElement('span', { className: 'meta' });
        var timestamp = new Date().toLocaleTimeString('fr-FR', { minute: '2-digit', second: '2-digit' });
        var metaText = document.createTextNode('[' + options.index + '/' + options.total + '] [' + timestamp + '] ');
        var iconSpan = createElement('span', { className: 'icon', text: options.icon });
        var messageParagraph = createElement('p', { text: options.message });
        meta.appendChild(metaText);
        meta.appendChild(iconSpan);
        item.appendChild(meta);
        item.appendChild(messageParagraph);
        elements.results.appendChild(item);
        elements.results.scrollTop = elements.results.scrollHeight;
        if (options.type === 'error' || options.type === 'warning') {
            scrollToProblem(item);
        }
        return item;
    }

    function showLocalModeWarning() {
        if (!elements) {
            return;
        }
        var existingCount = elements.results.querySelectorAll('.scan-result-item').length;
        var nextIndex = existingCount + 1;
        elements.localWarning.textContent = '⚠️ Mode local détecté. Pour un scan complet, veuillez utiliser Live Server ou GitHub Pages.';
        elements.localWarning.style.display = 'block';
        addResultItem({
            index: nextIndex,
            total: nextIndex,
            icon: '⚠️',
            message: 'Scan partiel désactivé en mode local. Aucune requête fetch n\'a été lancée.',
            type: 'warning'
        });
        updateProgress(10, 'Mode local détecté');
    }

    function resetState() {
        state.pages = [];
        state.sections = [];
        state.videos = [];
        state.musics = [];
        state.projects = [];
        state.iaSoftwares = [];
        state.links = { total: 0, valid: 0, broken: [] };
        state.features = [];
        state.errors = [];
        state.warnings = [];
        state.score = 0;
        state.progress = 0;
        state.startedAt = 0;
    }

    function countFeatures() {
        var checks = [
            !!document.getElementById('scan-btn'),
            !!document.querySelector('.copy-btn'),
            !!document.getElementById('theme-toggle'),
            !!document.getElementById('menu-toggle'),
            !!document.getElementById('bouton-haut'),
            !!document.getElementById('audio-player')
        ];
        state.features = checks.filter(function (found) {
            return found;
        });
        return state.features.length;
    }

    function calculateScore() {
        var totals = [
            { value: state.pages.length, max: 5, weight: 20 },
            { value: state.sections.length, max: 7, weight: 15 },
            { value: state.videos.length, max: 8, weight: 15 },
            { value: state.musics.length, max: 4, weight: 10 },
            { value: state.projects.length, max: 9, weight: 10 },
            { value: state.iaSoftwares.length, max: 8, weight: 10 },
            { value: state.links.valid, max: 26, weight: 10 },
            { value: countFeatures(), max: 6, weight: 10 }
        ];
        var score = totals.reduce(function (sum, item) {
            var ratio = item.max === 0 ? 0 : Math.min(1, item.value / item.max);
            return sum + ratio * item.weight;
        }, 0);
        state.score = Math.round(score);
        return state.score;
    }

    function isLinkValid(href) {
        if (!href || href.trim() === '') {
            return false;
        }
        return href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.endsWith('.html') || href === 'javascript:void(0)';
    }

    async function scanPage(page) {
        var pageResult = {
            name: page,
            sections: 0,
            videos: 0,
            musics: 0,
            projects: 0,
            iaSoftwares: 0,
            errors: []
        };

        try {
            var response = await fetch(page, { cache: 'no-store' });
            if (!response.ok) {
                pageResult.errors.push('❌ ' + page + ' introuvable (' + response.status + ')');
                return pageResult;
            }

            var html = await response.text();
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, 'text/html');

            var sectionElements = Array.from(doc.querySelectorAll('section[id], article[id]'));
            sectionElements.forEach(function (section) {
                var id = section.getAttribute('id') || '';
                var title = (section.querySelector('h2, h3') || { textContent: '' }).textContent.trim();
                state.sections.push({ id: id, title: title, page: page });
            });
            pageResult.sections = sectionElements.length;

            var iframes = Array.from(doc.querySelectorAll('iframe[src*="youtube.com"]'));
            pageResult.videos = iframes.length;
            iframes.forEach(function (iframe) {
                var src = iframe.getAttribute('src') || '';
                var match = src.match(/embed\/([a-zA-Z0-9_-]+)/);
                if (match) {
                    state.videos.push({ id: match[1], title: iframe.getAttribute('title') || 'Vidéo YouTube', page: page });
                }
            });

            if (page === 'index.html') {
                var audioSources = Array.from(doc.querySelectorAll('audio source[src$=".m4a"], audio[src$=".m4a"]'));
                pageResult.musics = audioSources.length;
                audioSources.forEach(function (source) {
                    var src = source.getAttribute('src');
                    if (src) {
                        state.musics.push(src);
                    }
                });

                var projetTitles = Array.from(doc.querySelectorAll('#projets article h3, .projet h3'));
                pageResult.projects = projetTitles.length;
                projetTitles.forEach(function (el) {
                    var title = el.textContent.trim();
                    if (title) {
                        state.projects.push(title);
                    }
                });

                var iaTitles = Array.from(doc.querySelectorAll('#ia article h3, .ia-software, .projet h3'));
                pageResult.iaSoftwares = iaTitles.length;
                iaTitles.forEach(function (el) {
                    var title = el.textContent.trim();
                    if (title && state.iaSoftwares.indexOf(title) === -1) {
                        state.iaSoftwares.push(title);
                    }
                });
            }

            var anchors = Array.from(doc.querySelectorAll('a[href]'));
            state.links.total += anchors.length;
            anchors.forEach(function (anchor) {
                var href = anchor.getAttribute('href') || '';
                if (isLinkValid(href)) {
                    state.links.valid += 1;
                } else {
                    state.links.broken.push(href);
                }
            });

            return pageResult;
        } catch (error) {
            pageResult.errors.push('❌ Erreur lors du scan ' + page + ' : ' + error.message);
            return pageResult;
        }
    }

    function createConfetti() {
        if (!elements) {
            return;
        }

        clearElement(elements.confettiWrapper);

        for (var i = 0; i < 18; i += 1) {
            var piece = createElement('div', { className: 'confetti-piece' });
            piece.style.position = 'absolute';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.background = i % 2 === 0
                ? 'linear-gradient(180deg, #22c55e, #a7f3d0)'
                : 'linear-gradient(180deg, #c084fc, #f5d0fe)';
            piece.style.width = 8 + Math.random() * 6 + 'px';
            piece.style.height = 12 + Math.random() * 12 + 'px';
            piece.style.animationDelay = Math.random() * 0.6 + 's';
            elements.confettiWrapper.appendChild(piece);
        }

        setTimeout(function () {
            clearElement(elements.confettiWrapper);
        }, 2400);
    }

    async function runFullScan() {
        createModalMarkup();
        ensureElements();
        attachModalEvents();
        resetState();
        resetModalVisuals();
        openModal();

        state.startedAt = performance.now();
        updateProgress(5, 'Initialisation & Démarrage');
        addResultItem({ index: 1, total: 8, icon: '⏳', message: 'Démarrage du scanner...', type: 'success' });
        await delay(250);

        if (window.location.protocol === 'file:') {
            showLocalModeWarning();
            return;
        }

        var stepCount = PAGES_TO_SCAN.length + 2;
        var currentStep = 1;

        for (var idx = 0; idx < PAGES_TO_SCAN.length; idx += 1) {
            currentStep += 1;
            var pageResult = await scanPage(PAGES_TO_SCAN[idx]);
            state.pages.push(pageResult);

            var icon = pageResult.errors.length ? '❌' : '✅';
            var type = pageResult.errors.length ? 'error' : 'success';
            var message = 'Scan ' + PAGES_TO_SCAN[idx] + ' — ' + pageResult.sections + ' sections, ' + pageResult.videos + ' vidéos, ' + pageResult.musics + ' musiques';

            addResultItem({ index: currentStep, total: stepCount, icon: icon, message: message, type: type });
            updateProgress(calculateScore(), 'Analyse ' + PAGES_TO_SCAN[idx]);
            await delay(260);
        }

        if (state.links.broken.length > 0) {
            state.warnings.push('⚠️ ' + state.links.broken.length + ' lien(s) cassé(s) détecté(s)');
        }

        var issues = state.errors.length + state.warnings.length;
        if (issues === 0) {
            addResultItem({
                index: stepCount - 1,
                total: stepCount,
                icon: '✅',
                message: 'Aucun problème détecté. Tous les tests passent.',
                type: 'success'
            });
        } else {
            state.warnings.forEach(function (warning, index) {
                addResultItem({
                    index: stepCount - state.warnings.length + index,
                    total: stepCount,
                    icon: '⚠️',
                    message: warning,
                    type: 'warning'
                });
            });

            state.errors.forEach(function (error, index) {
                addResultItem({
                    index: stepCount - state.errors.length + index + 1,
                    total: stepCount,
                    icon: '❌',
                    message: error,
                    type: 'error'
                });
            });
        }

        var finalScore = calculateScore();
        updateProgress(finalScore, finalScore === 100 ? 'SUCCÈS' : 'Scan terminé');

        if (finalScore === 100) {
            elements.successBanner.style.display = 'grid';
            elements.successScore.textContent = '100%';
            createConfetti();
        }

        addResultItem({
            index: stepCount,
            total: stepCount,
            icon: finalScore === 100 ? '✨' : '🔎',
            message: 'Score final : ' + finalScore + '% — ' + state.errors.length + ' erreur(s), ' + state.warnings.length + ' warning(s)',
            type: finalScore === 100 ? 'success' : state.errors.length ? 'error' : 'warning'
        });

        var elapsed = ((performance.now() - state.startedAt) / 1000).toFixed(2);
        elements.statusLine.textContent = 'Scan complété en ' + elapsed + 's';
    }

    function getData() {
        return JSON.parse(JSON.stringify(state));
    }

    function getScore() {
        return state.score;
    }

    function getPageCount() {
        return PAGES_TO_SCAN.length;
    }

    function buildReport() {
        var data = getData();
        var score = getScore();
        var now = new Date();
        var date = now.toLocaleString('fr-FR');
        return [
            '═══════════════════════════════════════════════════════════════',
            '🐛 RAPPORT DE SCAN PORTFOLIO',
            'Date : ' + date,
            '',
            'Score : ' + score + '%',
            '',
            'Pages scannées : ' + data.pages.length + '/' + getPageCount(),
            'Sections détectées : ' + data.sections.length,
            'Vidéos détectées : ' + data.videos.length,
            'Musiques détectées : ' + data.musics.length,
            'Projets détectés : ' + data.projects.length,
            'Logiciels IA détectés : ' + data.iaSoftwares.length,
            'Liens valides : ' + data.links.valid + '/' + data.links.total,
            '',
            'Erreurs : ' + data.errors.length,
            'Warnings : ' + data.warnings.length,
            '',
            '══════════════════════════════════════════════════════════════='
        ].join('\n');
    }

    function copyBugReport() {
        var report = buildReport();
        navigator.clipboard.writeText(report).then(function () {
            window.alert('✅ Rapport copié !\nColle-le dans Qwen pour analyser le résultat.');
        }).catch(function () {
            window.alert('❌ Impossible de copier automatiquement. Copie manuelle requise.');
        });
    }

    return {
        runFullScan: runFullScan,
        copyBugReport: copyBugReport,
        getData: getData,
        getScore: getScore,
        getPageCount: getPageCount
    };
})();

window.runFullScan = ScanApp.runFullScan;
window.copyBugReport = ScanApp.copyBugReport;
