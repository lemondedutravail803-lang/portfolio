// auto-scan.js
// Scanner portfolio premium avec modale, progression par paliers et protection CORS.

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
        links: {
            total: 0,
            valid: 0,
            broken: []
        },
        features: [],
        errors: [],
        warnings: [],
        score: 0,
        progress: 0,
        startedAt: 0
    };

    let elements = null;

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function createModalMarkup() {
        if (document.getElementById('scan-modal-overlay')) {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="scan-banner" id="scan-banner"></div>
            <div class="scan-modal-overlay" id="scan-modal-overlay">
                <div class="scan-modal" role="dialog" aria-labelledby="scan-modal-title" aria-modal="true">
                    <div class="scan-modal-header">
                        <div>
                            <h2 id="scan-modal-title">Scanner Portfolio — Rapport en direct</h2>
                            <p class="scan-status-text" id="scan-status-text">Prêt à lancer le scan</p>
                        </div>
                        <button class="scan-modal-close" id="scan-modal-close" aria-label="Fermer la modale">✕</button>
                    </div>

                    <div class="scan-progress">
                        <div class="scan-progress-label">
                            <strong>Progression</strong>
                            <span id="scan-progress-percent">0%</span>
                        </div>
                        <div class="scan-progress-bar">
                            <div class="scan-progress-bar-fill palier-1" id="scan-progress-bar-fill"></div>
                            <div class="scan-progress-percent">0%</div>
                        </div>
                        <p class="scan-status-text" id="scan-status-line">Initialisation du scanner...</p>
                    </div>

                    <div class="scan-results" id="scan-results"></div>

                    <div class="scan-local-warning" id="scan-local-warning" style="display:none;"></div>

                    <div class="scan-success-banner" id="scan-success-banner" style="display:none;">
                        <strong>✅ AUCUN PROBLÈME DÉTECTÉ !</strong>
                        <div class="scan-success-score" id="scan-success-score">100%</div>
                        <p>Tout est vert. Le portfolio est sain et optimisé.</p>
                    </div>

                    <div class="confetti-wrapper" id="confetti-wrapper"></div>

                    <div class="scan-modal-footer">
                        <button class="scan-modal-button close" id="scan-modal-close-button">✕ FERMER</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(wrapper);
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
            confettiWrapper: document.getElementById('confetti-wrapper'),
            scanButton: document.getElementById('scan-btn')
        };
    }

    function attachModalEvents() {
        if (!elements) {
            return;
        }

        const closeAction = () => closeModal();

        elements.closeButton?.addEventListener('click', closeAction);
        elements.closeFooterButton?.addEventListener('click', closeAction);

        elements.overlay?.addEventListener('click', (event) => {
            if (event.target === elements.overlay) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && elements.overlay?.classList.contains('active')) {
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
        elements.banner.style.display = 'block';
        elements.banner.style.transform = 'translateY(-100%)';
        setTimeout(() => {
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
        elements.results.innerHTML = '';
        elements.localWarning.style.display = 'none';
        elements.successBanner.style.display = 'none';
        elements.confettiWrapper.innerHTML = '';
    }

    function getPalier(progress) {
        return PALIER_RULES.find((palier) => progress <= palier.max) || PALIER_RULES[PALIER_RULES.length - 1];
    }

    function updateProgress(progress, label) {
        if (!elements) {
            return;
        }

        const clamped = clamp(Math.round(progress), 0, 100);
        const palier = getPalier(clamped);

        elements.progressFill.style.width = `${clamped}%`;
        elements.progressFill.className = `scan-progress-bar-fill ${palier.className}`;
        elements.progressPercent.textContent = `${clamped}%`;
        elements.statusText.textContent = label || palier.label;
        elements.statusText.style.color = palier.color;
        elements.statusLine.textContent = palier.label;
        state.progress = clamped;
    }

    function scrollToProblem(item) {
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        item.classList.add('focused');
        setTimeout(() => {
            item.classList.remove('focused');
        }, 600);
    }

    function addResultItem({ index, total, icon, message, type = 'success' }) {
        if (!elements) {
            return null;
        }

        const item = document.createElement('div');
        item.className = `scan-result-item ${type}`;
        const timestamp = new Date().toLocaleTimeString('fr-FR', { minute: '2-digit', second: '2-digit' });
        item.innerHTML = `
            <span class="meta">[${index}/${total}] [${timestamp}] <span class="icon">${icon}</span></span>
            <p>${message}</p>
        `;

        elements.results.appendChild(item);
        elements.results.scrollTop = elements.results.scrollHeight;

        if (type === 'error' || type === 'warning') {
            scrollToProblem(item);
        }

        return item;
    }

    function showLocalModeWarning() {
        if (!elements) {
            return;
        }

        const existingCount = elements.results.querySelectorAll('.scan-result-item').length;
        const nextIndex = existingCount + 1;

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
        const checks = [
            { name: 'Bouton Scan', found: !!document.getElementById('scan-btn') },
            { name: 'Bouton Copier Rapport', found: !!document.querySelector('.copy-btn') },
            { name: 'Thème toggle', found: !!document.getElementById('theme-toggle') },
            { name: 'Menu hamburger', found: !!document.getElementById('menu-toggle') },
            { name: 'Retour en haut', found: !!document.getElementById('bouton-haut') },
            { name: 'Lecteur musique', found: !!document.getElementById('audio-player') }
        ];

        state.features = checks.filter((item) => item.found);
        return state.features.length;
    }

    function calculateScore() {
        const totals = [
            { value: state.pages.length, max: 5, weight: 20 },
            { value: state.sections.length, max: 7, weight: 15 },
            { value: state.videos.length, max: 8, weight: 15 },
            { value: state.musics.length, max: 4, weight: 10 },
            { value: state.projects.length, max: 9, weight: 10 },
            { value: state.iaSoftwares.length, max: 8, weight: 10 },
            { value: state.links.valid, max: 26, weight: 10 },
            { value: countFeatures(), max: 6, weight: 10 }
        ];

        const score = totals.reduce((sum, item) => {
            const ratio = item.max === 0 ? 0 : Math.min(1, item.value / item.max);
            return sum + ratio * item.weight;
        }, 0);

        state.score = Math.round(score);
        return state.score;
    }

    function isLinkValid(href) {
        if (!href || href.trim() === '') {
            return false;
        }

        return href.startsWith('#')
            || href.startsWith('http')
            || href.startsWith('mailto:')
            || href.endsWith('.html')
            || href === 'javascript:void(0)';
    }

    async function scanPage(page) {
        const pageResult = {
            name: page,
            sections: 0,
            videos: 0,
            musics: 0,
            projects: 0,
            iaSoftwares: 0,
            errors: []
        };

        try {
            const response = await fetch(page, { cache: 'no-store' });
            if (!response.ok) {
                pageResult.errors.push(`❌ ${page} introuvable (${response.status})`);
                return pageResult;
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const sectionElements = Array.from(doc.querySelectorAll('section[id], article[id]'));
            state.sections.push(...sectionElements.map((section) => {
                return {
                    id: section.getAttribute('id') || '',
                    title: (section.querySelector('h2, h3') || { textContent: '' }).textContent.trim(),
                    page
                };
            }));
            pageResult.sections = sectionElements.length;

            const iframes = Array.from(doc.querySelectorAll('iframe[src*="youtube.com"]'));
            pageResult.videos = iframes.length;
            iframes.forEach((iframe) => {
                const src = iframe.getAttribute('src') || '';
                const match = src.match(/embed\/([a-zA-Z0-9_-]+)/);
                if (match) {
                    state.videos.push({ id: match[1], title: iframe.getAttribute('title') || 'Vidéo YouTube', page });
                }
            });

            if (page === 'index.html') {
                const audioSources = Array.from(doc.querySelectorAll('audio source[src$=".m4a"], audio[src$=".m4a"]'));
                pageResult.musics = audioSources.length;
                audioSources.forEach((source) => {
                    const src = source.getAttribute('src');
                    if (src) {
                        state.musics.push(src);
                    }
                });

                const projetTitles = Array.from(doc.querySelectorAll('#projets article h3, .projet h3'));
                pageResult.projects = projetTitles.length;
                projetTitles.forEach((el) => {
                    const title = el.textContent.trim();
                    if (title) {
                        state.projects.push(title);
                    }
                });

                const iaTitles = Array.from(doc.querySelectorAll('#ia article h3, .ia-software, .projet h3'));
                pageResult.iaSoftwares = iaTitles.length;
                iaTitles.forEach((el) => {
                    const title = el.textContent.trim();
                    if (title && !state.iaSoftwares.includes(title)) {
                        state.iaSoftwares.push(title);
                    }
                });
            }

            const anchors = Array.from(doc.querySelectorAll('a[href]'));
            state.links.total += anchors.length;
            anchors.forEach((anchor) => {
                const href = anchor.getAttribute('href') || '';
                if (isLinkValid(href)) {
                    state.links.valid += 1;
                } else {
                    state.links.broken.push(href);
                }
            });

            return pageResult;
        } catch (error) {
            pageResult.errors.push(`❌ Erreur lors du scan ${page} : ${error.message}`);
            return pageResult;
        }
    }

    function createConfetti() {
        if (!elements) {
            return;
        }

        elements.confettiWrapper.innerHTML = '';
        const count = 18;

        for (let i = 0; i < count; i += 1) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.background = i % 2 === 0
                ? 'linear-gradient(180deg, #22c55e, #a7f3d0)'
                : 'linear-gradient(180deg, #c084fc, #f5d0fe)';
            piece.style.width = `${8 + Math.random() * 6}px`;
            piece.style.height = `${12 + Math.random() * 12}px`;
            piece.style.animationDelay = `${Math.random() * 0.6}s`;
            elements.confettiWrapper.appendChild(piece);
        }

        setTimeout(() => {
            elements.confettiWrapper.innerHTML = '';
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

        const stepCount = PAGES_TO_SCAN.length + 2;
        let currentStep = 1;

        for (const page of PAGES_TO_SCAN) {
            currentStep += 1;
            const pageResult = await scanPage(page);
            state.pages.push(pageResult);

            const icon = pageResult.errors.length ? '❌' : '✅';
            const type = pageResult.errors.length ? 'error' : 'success';
            const message = `Scan ${page} — ${pageResult.sections} sections, ${pageResult.videos} vidéos, ${pageResult.musics} musiques`;

            addResultItem({ index: currentStep, total: stepCount, icon, message, type });
            updateProgress(calculateScore(), `Analyse ${page}`);
            await delay(260);
        }

        if (state.links.broken.length > 0) {
            state.warnings.push(`⚠️ ${state.links.broken.length} lien(s) cassé(s) détecté(s)`);
        }

        const issues = state.errors.length + state.warnings.length;
        if (issues === 0) {
            addResultItem({ index: stepCount - 1, total: stepCount, icon: '✅', message: 'Aucun problème détecté. Tous les tests passent.', type: 'success' });
        } else {
            state.warnings.forEach((warning, index) => {
                addResultItem({ index: stepCount - state.warnings.length + index, total: stepCount, icon: '⚠️', message: warning, type: 'warning' });
            });

            state.errors.forEach((error, index) => {
                addResultItem({ index: stepCount - state.errors.length + index + 1, total: stepCount, icon: '❌', message: error, type: 'error' });
            });
        }

        const finalScore = calculateScore();
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
            message: `Score final : ${finalScore}% — ${state.errors.length} erreur(s), ${state.warnings.length} warning(s)`,
            type: finalScore === 100 ? 'success' : state.errors.length ? 'error' : 'warning'
        });

        const elapsed = ((performance.now() - state.startedAt) / 1000).toFixed(2);
        if (elements.statusLine) {
            elements.statusLine.textContent = `Scan complété en ${elapsed}s`;
        }
    }

    return {
        runFullScan,
        getData: () => JSON.parse(JSON.stringify(state)),
        getScore: () => state.score,
        getPageCount: () => PAGES_TO_SCAN.length
    };
})();

function runFullScan() {
    ScanApp.runFullScan();
}

function copyBugReport() {
    const report = buildReport();
    navigator.clipboard.writeText(report).then(() => {
        alert('✅ Rapport copié !\nColle le contenu dans Qwen pour analyser le résultat.');
    }).catch(() => {
        alert('❌ Impossible de copier automatiquement. Copie manuelle requise.');
    });
}

function buildReport() {
    const data = ScanApp.getData();
    const score = ScanApp.getScore();
    const now = new Date();
    const date = now.toLocaleString('fr-FR');

    return `
═══════════════════════════════════════════════════════════════
🐛 RAPPORT DE SCAN PORTFOLIO
Date : ${date}

Score : ${score}%

Pages scannées : ${data.pages.length}/${ScanApp.getPageCount()}
Sections détectées : ${data.sections.length}
Vidéos détectées : ${data.videos.length}
Musiques détectées : ${data.musics.length}
Projets détectés : ${data.projects.length}
Logiciels IA détectés : ${data.iaSoftwares.length}
Liens valides : ${data.links.valid}/${data.links.total}

Erreurs : ${data.errors.length}
Warnings : ${data.warnings.length}

═══════════════════════════════════════════════════════════════
`; 
}
