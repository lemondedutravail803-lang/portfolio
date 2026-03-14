// =========================================
// SYSTÈME DE SCAN AUTOMATIQUE DU PORTFOLIO
// =========================================
// Ce fichier scanne toutes les pages et génère le rapport automatiquement

const PortfolioScanner = {
    // Données du portfolio
    data: {
        files: [],
        videos: [],
        projects: [],
        features: [],
        history: []
    },

    // Noms des vidéos (mapping ID → Nom réel)
    videoNames: {
        // Honkai Star Rail
        'r4gljUbCzqA': 'Version 3.7 — « Vers ce demain d\'autrefois »',
        'AudFPWzkW-k': 'Nouvelle Vidéo HSR',
        'u1tkz0Sxa7Q': 'Grande Herta',
        // Wuthering Waves
        '5D9K2rz3Uvk': 'Dawn Arrives - Story Cinematics',
        'TnXzZxKmGYk': 'Nouvelle Vidéo WW',
        'ZRpHFIPp-0M': 'Vidéo 3 - Wuthering Waves',
        'aMAJhkp0hlc': 'Nouvelle Vidéo (AJOUTÉE)'
    },

    // Initialiser le scanner
    init() {
        console.log('🔍 Portfolio Scanner initialisé');
        this.scanAllPages();
    },

    // Scanner toutes les pages
    async scanAllPages() {
        // Scanner index.html
        await this.scanIndex();
        
        // Scanner videos.html
        await this.scanVideos();
        
        // Scanner honkai-star-rail.html
        await this.scanHSR();
        
        // Scanner wuthering-waves.html
        await this.scanWW();
        
        // Mettre à jour l'affichage
        this.updateBugReport();
        
        console.log('✅ Scan terminé !', this.data);
    },

    // Scanner index.html
    async scanIndex() {
        try {
            const response = await fetch('index.html');
            const html = await response.text();
            
            // Extraire les projets
            const projectMatches = html.matchAll(/<h3>(.*?)<\/h3>/g);
            const projects = [];
            for (const match of projectMatches) {
                const name = match[1].replace(/<[^>]*>/g, '');
                if (name && !name.includes('RAPPORT')) {
                    projects.push(name);
                }
            }
            this.data.projects = projects.slice(0, 15); // Limiter à 15 projets
            
            // Extraire les fichiers
            this.data.files = [
                'index.html',
                'videos.html',
                'honkai-star-rail.html',
                'wuthering-waves.html',
                'bug-report.html',
                'styles.css',
                'script.js',
                'push-github.sh',
                '.gitignore'
            ];
            
            // Extraire les fonctionnalités
            this.data.features = [
                '4 Thèmes (Normal, Bleu, Or, Argent)',
                'Lecteur de musique (4 titres)',
                'Animations des lettres',
                'Menu mobile responsive',
                'Bouton retour en haut',
                'Scroll fluide',
                'Vidéos YouTube intégrées',
                'Rapport de Bug automatique'
            ];
            
            console.log('📄 index.html scanné');
        } catch (error) {
            console.error('❌ Erreur scan index.html:', error);
        }
    },

    // Scanner videos.html
    async scanVideos() {
        try {
            const response = await fetch('videos.html');
            const html = await response.text();
            
            // Extraire les vidéos YouTube
            const videoMatches = html.matchAll(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/g);
            for (const match of videoMatches) {
                const videoId = match[1];
                if (!this.data.videos.find(v => v.id === videoId)) {
                    this.data.videos.push({
                        id: videoId,
                        page: 'videos.html',
                        game: 'Honkai Star Rail'
                    });
                }
            }
            
            console.log('📺 videos.html scanné');
        } catch (error) {
            console.error('❌ Erreur scan videos.html:', error);
        }
    },

    // Scanner honkai-star-rail.html
    async scanHSR() {
        try {
            const response = await fetch('honkai-star-rail.html');
            const html = await response.text();
            
            // Extraire les vidéos YouTube
            const videoMatches = html.matchAll(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/g);
            for (const match of videoMatches) {
                const videoId = match[1];
                if (!this.data.videos.find(v => v.id === videoId)) {
                    this.data.videos.push({
                        id: videoId,
                        page: 'honkai-star-rail.html',
                        game: 'Honkai Star Rail'
                    });
                }
            }
            
            console.log('⭐ honkai-star-rail.html scanné');
        } catch (error) {
            console.error('❌ Erreur scan hsr.html:', error);
        }
    },

    // Scanner wuthering-waves.html
    async scanWW() {
        try {
            const response = await fetch('wuthering-waves.html');
            const html = await response.text();
            
            // Extraire les vidéos YouTube
            const videoMatches = html.matchAll(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/g);
            for (const match of videoMatches) {
                const videoId = match[1];
                if (!this.data.videos.find(v => v.id === videoId)) {
                    this.data.videos.push({
                        id: videoId,
                        page: 'wuthering-waves.html',
                        game: 'Wuthering Waves'
                    });
                }
            }
            
            console.log('🌊 wuthering-waves.html scanné');
        } catch (error) {
            console.error('❌ Erreur scan ww.html:', error);
        }
    },

    // Mettre à jour l'affichage du rapport
    updateBugReport() {
        // Mettre à jour la section vidéos
        this.updateVideosSection();
        
        // Mettre à jour la section projets
        this.updateProjectsSection();
        
        // Mettre à jour la section fichiers
        this.updateFilesSection();
        
        // Mettre à jour la section fonctionnalités
        this.updateFeaturesSection();
    },

    // Mettre à jour la section vidéos
    updateVideosSection() {
        const hsrVideos = this.data.videos.filter(v => v.game === 'Honkai Star Rail');
        const wwVideos = this.data.videos.filter(v => v.game === 'Wuthering Waves');
        
        const hsrList = document.querySelector('#hsr-videos-list');
        const wwList = document.querySelector('#ww-videos-list');
        
        if (hsrList) {
            hsrList.innerHTML = hsrVideos.map(v => {
                const videoName = this.videoNames[v.id] || v.id;
                return `<li>${videoName} <small style="color: var(--couleur-texte-sombre);">(${v.id})</small></li>`;
            }).join('');
        }
        
        if (wwList) {
            wwList.innerHTML = wwVideos.map((v, i) => {
                const videoName = this.videoNames[v.id] || v.id;
                const isNew = i === wwVideos.length - 1 ? ' <strong style="color: var(--couleur-emeraude);">(NOUVELLE)</strong>' : '';
                return `<li>${videoName}${isNew} <small style="color: var(--couleur-texte-sombre);">(${v.id})</small></li>`;
            }).join('');
        }
    },

    // Mettre à jour la section projets
    updateProjectsSection() {
        const projectsList = document.querySelector('#projects-list');
        
        if (projectsList) {
            projectsList.innerHTML = this.data.projects.map((p, i) => 
                `<li>${p}</li>`
            ).join('');
        }
    },

    // Mettre à jour la section fichiers
    updateFilesSection() {
        const filesList = document.querySelector('#files-list');
        
        if (filesList) {
            filesList.innerHTML = this.data.files.map(f => 
                `<li>📄 ${f}</li>`
            ).join('');
        }
    },

    // Mettre à jour la section fonctionnalités
    updateFeaturesSection() {
        const featuresList = document.querySelector('#features-list');
        
        if (featuresList) {
            featuresList.innerHTML = this.data.features.map(f => 
                `<li>✅ ${f}</li>`
            ).join('');
        }
    },

    // Générer le rapport complet à copier
    generateFullReport() {
        const hsrVideos = this.data.videos.filter(v => v.game === 'Honkai Star Rail');
        const wwVideos = this.data.videos.filter(v => v.game === 'Wuthering Waves');
        
        let report = `🐛 RAPPORT DE BUG - PORTFOLIO CÉDRIC AUGUSTO\n`;
        report += `═══════════════════════════════════════════════════════\n\n`;
        report += `📅 Date : ${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR')}\n\n`;

        report += `📁 STRUCTURE DU PORTFOLIO\n`;
        report += `─────────────────────────────────────────────────────\n`;
        report += `📁 c:\\Users\\keqin\\Desktop\\portfolio\\\n`;
        report += `│\n`;
        this.data.files.forEach(f => {
            report += `├── 📄 ${f}\n`;
        });
        report += `│\n`;
        report += `├── 📁 assets\\ (Musiques, Images)\n`;
        report += `└── 📁 espase\\ (Jeu spatial)\n\n`;

        report += `🛠️ FONCTIONNALITÉS (${this.data.features.length})\n`;
        report += `─────────────────────────────────────────────────────\n`;
        this.data.features.forEach(f => {
            report += `✅ ${f}\n`;
        });
        report += `\n`;

        report += `📂 PROJETS (${this.data.projects.length})\n`;
        report += `─────────────────────────────────────────────────────\n`;
        this.data.projects.forEach((p, i) => {
            report += `${i + 1}. ${p}\n`;
        });
        report += `\n`;

        report += `📺 VIDÉOS YOUTUBE (${this.data.videos.length})\n`;
        report += `─────────────────────────────────────────────────────\n`;
        report += `Honkai Star Rail (${hsrVideos.length}) :\n`;
        hsrVideos.forEach(v => {
            const name = this.videoNames[v.id] || v.id;
            report += `  • ${name} (${v.id})\n`;
        });
        report += `Wuthering Waves (${wwVideos.length}) :\n`;
        wwVideos.forEach(v => {
            const name = this.videoNames[v.id] || v.id;
            report += `  • ${name} (${v.id})\n`;
        });
        report += `\n`;

        report += `📝 DESCRIPTION DU PROBLÈME\n`;
        report += `─────────────────────────────────────────────────────\n`;
        report += `[Décris ton problème ici]\n\n`;

        report += `🔍 CE QUE J'AI DÉJÀ ESSAYÉ\n`;
        report += `─────────────────────────────────────────────────────\n`;
        report += `- [ ] Actualiser la page (Ctrl + F5)\n`;
        report += `- [ ] Vider le cache\n`;
        report += `- [ ] Changer de navigateur\n\n`;

        report += `🔧 LIENS UTILES\n`;
        report += `─────────────────────────────────────────────────────\n`;
        report += `GitHub : https://github.com/lemondedutravail803-lang/portfolio\n`;
        report += `Portfolio : https://lemondedutravail803-lang.github.io/portfolio/\n`;
        report += `Rapport de Bug : https://lemondedutravail803-lang.github.io/portfolio/bug-report.html\n\n`;

        report += `═══════════════════════════════════════════════════════\n`;
        report += `⚡ GÉNÉRÉ AUTOMATIQUEMENT PAR PORTFOLIO SCANNER\n`;

        return report;
    }
};

// Initialiser le scanner au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    PortfolioScanner.init();
});
