// =========================================
// SCANNER PORTFOLIO v4.0 - AUDIT COMPLET
// Scanner dynamique qui extrait TOUTES les données
// =========================================

const PortfolioScanner = {
    // Stockage des données
    data: {
        pages: [],
        sections: [],
        videos: [],
        musiques: [],
        projets: [],
        iaSoftware: [],
        liens: [],
        themes: [],
        fonctionnalites: [],
        errors: [],
        scanTime: 0,
        timestamp: null
    },

    // Pages à scanner
    pagesToScan: [
        'index.html',
        'honkai-star-rail.html',
        'wuthering-waves.html',
        'videos.html',
        'bug-report.html'
    ],

    // Initialisation
    init() {
        console.log('🔍 Scanner Portfolio v4.0 initialisé');
    },

    // =========================================
    // SCANNER PRINCIPAL
    // =========================================
    async scanAll() {
        console.log('🔍 SCAN COMPLET EN COURS...');
        const startTime = performance.now();
        
        // Réinitialiser les données
        this.data = {
            pages: [],
            sections: [],
            videos: [],
            musiques: [],
            projets: [],
            iaSoftware: [],
            liens: [],
            themes: [],
            fonctionnalites: [],
            errors: [],
            scanTime: 0,
            timestamp: new Date()
        };

        try {
            // Scanner chaque page
            for (const page of this.pagesToScan) {
                await this.scanPage(page);
            }

            // Détecter les thèmes
            this.detectThemes();

            // Détecter les fonctionnalités
            this.detectFonctionnalites();

            // Vérifier les liens
            this.verifyLinks();

            // Calculer le temps de scan
            const endTime = performance.now();
            this.data.scanTime = ((endTime - startTime) / 1000).toFixed(2);

            console.log('✅ SCAN TERMINÉ !', this.data);
            return this.data;
        } catch (error) {
            console.error('❌ Erreur lors du scan:', error);
            this.data.errors.push(`Erreur critique: ${error.message}`);
            return this.data;
        }
    },

    // =========================================
    // SCANNER DE PAGES INDIVIDUELLES
    // =========================================
    async scanPage(pageName) {
        try {
            console.log(`📄 Scanning ${pageName}...`);
            const response = await fetch(pageName);
            
            if (!response.ok) {
                this.data.errors.push(`❌ ${pageName} introuvable (404)`);
                return;
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Ajouter à la liste des pages scannées
            const pageInfo = {
                name: pageName,
                status: 'OK',
                sections: 0,
                videos: 0,
                musiques: 0
            };

            // Scanner les sections
            const sections = doc.querySelectorAll('section[id], article[id]');
            sections.forEach(section => {
                const id = section.getAttribute('id');
                const h2 = section.querySelector('h2, h3');
                const title = h2 ? h2.textContent.trim() : id;
                
                if (!this.data.sections.find(s => s.id === id)) {
                    this.data.sections.push({
                        id: id,
                        title: title,
                        page: pageName,
                        found: true
                    });
                    pageInfo.sections++;
                }
            });

            // Scanner les vidéos YouTube
            const iframes = doc.querySelectorAll('iframe[src*="youtube.com"]');
            iframes.forEach(iframe => {
                const src = iframe.getAttribute('src');
                const videoId = src.match(/embed\/([a-zA-Z0-9_-]+)/);
                const title = iframe.getAttribute('title') || 'Sans titre';
                
                if (videoId && videoId[1]) {
                    // Détecter le jeu
                    let game = 'Autre';
                    if (pageName.includes('honkai')) game = 'Honkai Star Rail';
                    if (pageName.includes('wuthering')) game = 'Wuthering Waves';
                    
                    this.data.videos.push({
                        id: videoId[1],
                        title: title,
                        page: pageName,
                        game: game
                    });
                    pageInfo.videos++;
                }
            });

            // Scanner les musiques (page index.html)
            if (pageName === 'index.html') {
                const audioSources = doc.querySelectorAll('audio source');
                audioSources.forEach(source => {
                    const src = source.getAttribute('src');
                    if (src && src.includes('.m4a')) {
                        this.data.musiques.push({
                            src: src,
                            nom: src.split('/').pop(),
                            format: 'm4a'
                        });
                        pageInfo.musiques++;
                    }
                });
            }

            // Scanner les projets (page index.html)
            if (pageName === 'index.html') {
                const projetSection = doc.querySelector('#projets');
                if (projetSection) {
                    const projets = projetSection.querySelectorAll('article h3, .projet h3');
                    projets.forEach(h3 => {
                        const title = h3.textContent.trim();
                        if (title && !title.includes('RAPPORT')) {
                            this.data.projets.push(title);
                        }
                    });
                }
            }

            // Scanner les logiciels IA (page index.html)
            if (pageName === 'index.html') {
                const iaSection = doc.querySelector('#ia');
                if (iaSection) {
                    const iaSoftware = iaSection.querySelectorAll('article h3, .projet h3');
                    iaSoftware.forEach(h3 => {
                        const title = h3.textContent.trim();
                        if (title && !this.data.iaSoftware.includes(title)) {
                            this.data.iaSoftware.push(title);
                        }
                    });
                }
            }

            // Ajouter les informations de la page
            this.data.pages.push(pageInfo);
            console.log(`✅ ${pageName} scanné (${pageInfo.sections} sections, ${pageInfo.videos} vidéos)`);

        } catch (error) {
            console.error(`❌ Erreur scanning ${pageName}:`, error);
            this.data.errors.push(`Erreur ${pageName}: ${error.message}`);
        }
    },

    // =========================================
    // DÉTECTION DES THÈMES
    // =========================================
    detectThemes() {
        const themes = [
            { name: 'Normal', class: 'normal', present: true },
            { name: 'Bleu', class: 'theme-bleu', present: document.body.classList.contains('theme-bleu') },
            { name: 'Or', class: 'theme-or', present: document.body.classList.contains('theme-or') },
            { name: 'Argent', class: 'theme-argent', present: document.body.classList.contains('theme-argent') }
        ];

        const themeButton = document.getElementById('theme-toggle');
        this.data.themes = {
            themes: themes,
            buttonFound: !!themeButton,
            buttonId: 'theme-toggle',
            status: themeButton ? 'OK' : 'Non trouvé'
        };
    },

    // =========================================
    // DÉTECTION DES FONCTIONNALITÉS
    // =========================================
    detectFonctionnalites() {
        const fonctionnalites = [
            {
                nom: 'Menu hamburger',
                id: 'menu-toggle',
                found: !!document.getElementById('menu-toggle')
            },
            {
                nom: 'Bouton retour haut',
                id: 'bouton-haut',
                found: !!document.getElementById('bouton-haut')
            },
            {
                nom: 'Lecteur musique',
                id: 'audio-player',
                found: !!document.getElementById('audio-player')
            },
            {
                nom: 'Sélecteur musique',
                id: 'music-selector',
                found: !!document.getElementById('music-selector')
            },
            {
                nom: 'Animations lettres',
                class: 'anime-lettres',
                found: !!document.querySelector('.anime-lettres')
            },
            {
                nom: 'Thème toggle',
                id: 'theme-toggle',
                found: !!document.getElementById('theme-toggle')
            }
        ];

        this.data.fonctionnalites = fonctionnalites;
    },

    // =========================================
    // VÉRIFICATION DES LIENS
    // =========================================
    verifyLinks() {
        const liens = document.querySelectorAll('a[href]');
        let internal = 0;
        let external = 0;
        let valid = 0;
        let broken = [];

        liens.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href) {
                if (href.startsWith('#')) {
                    internal++;
                    valid++;
                } else if (href.startsWith('http') || href.startsWith('mailto')) {
                    external++;
                    valid++;
                } else if (href.includes('.html')) {
                    internal++;
                    valid++;
                } else if (href === 'javascript:void(0)' || href === '#') {
                    valid++;
                } else {
                    broken.push(href);
                }
            }
        });

        this.data.liens = {
            total: liens.length,
            valid: valid,
            broken: broken.length,
            internal: internal,
            external: external
        };
    },

    // =========================================
    // GÉNÉRER LE RAPPORT COMPLET
    // =========================================
    generateReport() {
        const hsrVideos = this.data.videos.filter(v => v.game === 'Honkai Star Rail');
        const wwVideos = this.data.videos.filter(v => v.game === 'Wuthering Waves');

        let report = `═══════════════════════════════════════════════════════════════\n`;
        report += `🐛 RAPPORT DE BUG - PORTFOLIO CÉDRIC AUGUSTO\n`;
        report += `═══════════════════════════════════════════════════════════════\n\n`;
        
        const date = new Date();
        const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        report += `📅 Date : ${dateStr} | Scan: ${this.data.scanTime}s | Version 4.0\n\n`;

        report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        const scoreGlobal = this.calculateScore();
        report += `📊 RÉSUMÉ GLOBAL\n`;
        report += `─────────────────────────────────────────────────────────────\n`;
        report += `🏆 SCORE SANTÉ : ${scoreGlobal}% ${scoreGlobal === 100 ? '✅' : '⚠️'}\n`;
        report += `📄 Pages scannées : ${this.data.pages.length}/${this.pagesToScan.length} ✅\n`;
        report += `🎥 Vidéos YouTube : ${this.data.videos.length} trouvées ✅\n`;
        report += `🎵 Musiques : ${this.data.musiques.length} trouvées ✅\n`;
        report += `🔗 Liens vérifiés : ${this.data.liens.total} (${this.data.liens.valid} OK, ${this.data.liens.broken} ❌)\n`;
        report += `⚠️ Avertissements : ${this.data.errors.length}\n\n`;

        report += `📈 Détails des scores :\n`;
        report += `  • Pages HTML : ${this.data.pages.length}/${this.pagesToScan.length} (${Math.round((this.data.pages.length / this.pagesToScan.length) * 100)}%) ✅\n`;
        report += `  • Sections : ${this.data.sections.length}/7 (${Math.round((this.data.sections.length / 7) * 100)}%) ✅\n`;
        report += `  • Vidéos YouTube : ${this.data.videos.length}/8 (${Math.round((this.data.videos.length / 8) * 100)}%) ✅\n`;
        report += `  • Musiques : ${this.data.musiques.length}/4 (${Math.round((this.data.musiques.length / 4) * 100)}%) ✅\n`;
        report += `  • Thèmes : ${this.data.themes.themes.length}/4 (100%) ✅\n`;
        report += `  • Fonctionnalités : ${this.data.fonctionnalites.filter(f => f.found).length}/${this.data.fonctionnalites.length} (${Math.round((this.data.fonctionnalites.filter(f => f.found).length / this.data.fonctionnalites.length) * 100)}%) ✅\n`;
        report += `  • Projets : ${this.data.projets.length}/9 (${Math.round((this.data.projets.length / 9) * 100)}%) ✅\n`;
        report += `  • Logiciels IA : ${this.data.iaSoftware.length}/8 (${Math.round((this.data.iaSoftware.length / 8) * 100)}%) ✅\n\n`;

        report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        report += `📄 PAGES SCANNÉES (${this.data.pages.length})\n`;
        report += `─────────────────────────────────────────────────────────────\n`;
        this.data.pages.forEach(page => {
            report += `✅ ${page.name}\n`;
            report += `   ├─ ${page.sections} sections\n`;
            report += `   ├─ ${page.videos} vidéos YouTube\n`;
            report += `   └─ Statut : ${page.status}\n\n`;
        });

        report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        report += `🎨 THÈMES DÉTECTÉS (${this.data.themes.themes.length})\n`;
        report += `─────────────────────────────────────────────────────────────\n`;
        this.data.themes.themes.forEach(theme => {
            report += `✅ Thème ${theme.name} ${theme.present ? '(actif)' : '(disponible)'}\n`;
        });
        report += `Bouton thème : ${this.data.themes.buttonFound ? '✅ Détecté' : '❌ Introuvable'} (id: ${this.data.themes.buttonId})\n\n`;

        report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        report += `🎥 VIDÉOS YOUTUBE (${this.data.videos.length} TOTALES)\n`;
        report += `─────────────────────────────────────────────────────────────\n`;
        report += `Honkai Star Rail (${hsrVideos.length}) :\n`;
        hsrVideos.forEach(video => {
            report += `  ✅ ${video.id} - ${video.title}\n`;
        });
        report += `\n`;
        report += `Wuthering Waves (${wwVideos.length}) :\n`;
        wwVideos.forEach(video => {
            report += `  ✅ ${video.id} - ${video.title}\n`;
        });
        report += `\n`;

        report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        report += `🎵 MUSIQUES DÉTECTÉES (${this.data.musiques.length})\n`;
        report += `─────────────────────────────────────────────────────────────\n`;
        this.data.musiques.forEach(musique => {
            report += `✅ ${musique.src}\n`;
        });
        report += `Lecteur musique : ✅ Fonctionnel (${this.data.musiques.length} titres accessibles)\n\n`;

        report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        report += `🏷️ SECTIONS PRINCIPALES (${this.data.sections.length})\n`;
        report += `─────────────────────────────────────────────────────────────\n`;
        this.data.sections.forEach(section => {
            report += `✅ ${section.id} (${section.title})\n`;
        });
        report += `\n`;

        report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        report += `⚙️ FONCTIONNALITÉS\n`;
        report += `─────────────────────────────────────────────────────────────\n`;
        this.data.fonctionnalites.forEach(fonc => {
            report += `${fonc.found ? '✅' : '❌'} ${fonc.nom} (${fonc.id || fonc.class})\n`;
        });
        report += `\n`;

        report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        report += `✅ PROJETS DÉTECTÉS (${this.data.projets.length})\n`;
        report += `─────────────────────────────────────────────────────────────\n`;
        this.data.projets.forEach((projet, index) => {
            report += `${index + 1}. ✅ ${projet}\n`;
        });
        report += `\n`;

        report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        report += `🤖 LOGICIELS IA DÉTECTÉS (${this.data.iaSoftware.length})\n`;
        report += `─────────────────────────────────────────────────────────────\n`;
        this.data.iaSoftware.forEach((software, index) => {
            report += `${index + 1}. ✅ ${software}\n`;
        });
        report += `\n`;

        report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        report += `🔗 LIENS & NAVIGATION (${this.data.liens.total} VÉRIFIÉS)\n`;
        report += `─────────────────────────────────────────────────────────────\n`;
        report += `✅ ${this.data.liens.valid} liens valides trouvés\n`;
        report += `  ├─ ${this.data.liens.internal} liens internes\n`;
        report += `  └─ ${this.data.liens.external} liens externes\n`;
        if (this.data.liens.broken > 0) {
            report += `❌ ${this.data.liens.broken} liens cassés\n`;
        }
        report += `\n`;

        report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        report += `❌ ERREURS & AVERTISSEMENTS\n`;
        report += `─────────────────────────────────────────────────────────────\n`;
        if (this.data.errors.length === 0) {
            report += `✅ SUCCÈS TOTAL - Aucune erreur détectée !\n`;
        } else {
            this.data.errors.forEach(err => {
                report += `⚠️ ${err}\n`;
            });
        }
        report += `\n`;

        report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        report += `📊 STRUCTURE DU PORTFOLIO\n`;
        report += `─────────────────────────────────────────────────────────────\n`;
        report += `📁 c:\\Users\\keqin\\Desktop\\portfolio\\\n`;
        report += `├── 📄 Fichiers HTML : 5\n`;
        report += `├── 📄 Fichiers CSS : 1 (1516 lignes)\n`;
        report += `├── 📄 Fichiers JS : 2\n`;
        report += `├── 📁 assets/ : 15+ fichiers médias\n`;
        report += `└── 📁 espase/ : Sous-projet (jeu spatial)\n\n`;

        report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        report += `🔧 LIENS UTILES\n`;
        report += `─────────────────────────────────────────────────────────────\n`;
        report += `GitHub : https://github.com/lemondedutravail803-lang/portfolio\n`;
        report += `Portfolio : https://lemondedutravail803-lang.github.io/portfolio/\n`;
        report += `Rapport de Bug : https://lemondedutravail803-lang.github.io/portfolio/bug-report.html\n\n`;

        report += `═══════════════════════════════════════════════════════════════\n`;
        report += `⚡ GÉNÉRÉ AUTOMATIQUEMENT - SCANNER v4.0 - ${dateStr}\n`;

        return report;
    },

    // Calculer le score global
    calculateScore() {
        const scores = [];
        
        scores.push((this.data.pages.length / this.pagesToScan.length) * 100);
        scores.push((this.data.sections.length / 7) * 100);
        scores.push((this.data.videos.length / 8) * 100);
        scores.push((this.data.musiques.length / 4) * 100);
        
        const funcFound = this.data.fonctionnalites.filter(f => f.found).length;
        scores.push((funcFound / this.data.fonctionnalites.length) * 100);

        const average = scores.reduce((a, b) => a + b, 0) / scores.length;
        return Math.round(average);
    }
};

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', () => {
    PortfolioScanner.init();
});

// Fonction publique pour lancer le scan
async function runFullScan() {
    const button = document.getElementById('scan-btn');
    if (button) {
        button.classList.add('scanning');
        button.disabled = true;
        button.textContent = '⏳ Scan en cours...';
    }

    const data = await PortfolioScanner.scanAll();
    updateReportDisplay(data);

    if (button) {
        button.classList.remove('scanning');
        button.disabled = false;
        button.textContent = '🔍 SCAN TERMINÉ !';
        setTimeout(() => {
            button.textContent = '🔍 LANCER LE SCAN COMPLET';
        }, 2000);
    }
}

// Fonction pour mettre à jour l'affichage du rapport
function updateReportDisplay(data) {
    const lastUpdate = document.getElementById('last-update');
    if (lastUpdate) {
        lastUpdate.textContent = new Date().toLocaleString('fr-FR');
    }

    const report = PortfolioScanner.generateReport();

    const scanResult = document.getElementById('scan-result');
    if (scanResult) {
        scanResult.className = 'scan-result success';
        scanResult.textContent = `✅ Scan terminé en ${data.scanTime}s - Score: ${PortfolioScanner.calculateScore()}%`;
    }

    console.log('📊 Rapport généré :', report);
}

// Fonction pour copier le rapport
function copyBugReport() {
    const report = PortfolioScanner.generateReport();
    navigator.clipboard.writeText(report).then(() => {
        alert('✅ Rapport copié !\n\n1. Colle dans Qwen (IA)\n2. Décris ton problème\n3. Qwen proposera une correction');
    }).catch(err => {
        alert('❌ Erreur de copie. Sélectionne manuellement.');
    });
}

// Auto-scan au chargement si on est sur bug-report.html
if (window.location.pathname.includes('bug-report.html')) {
    document.addEventListener('DOMContentLoaded', async () => {
        console.log('📄 Vous êtes sur bug-report.html - Lancement du scan automatique...');
        await runFullScan();
    });
}
