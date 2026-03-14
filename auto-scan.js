// =========================================
// SYSTÈME DE SCAN AUTOMATIQUE DU PORTFOLIO
// Version 2.0 - Détection d'erreurs améliorée
// =========================================

const PortfolioScanner = {
    // Données du portfolio
    data: {
        files: [],
        videos: [],
        projects: [],
        features: [],
        history: [],
        errors: [],
        success: []
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
        
        // Vérifier les erreurs
        await this.checkErrors();
        
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
            this.data.projects = projects.slice(0, 15);
            
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
            
            this.data.success.push('index.html : Page chargée avec succès');
            console.log('📄 index.html scanné');
        } catch (error) {
            this.data.errors.push(`❌ index.html : ${error.message}`);
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
            
            this.data.success.push('videos.html : Page chargée avec succès');
            console.log('📺 videos.html scanné');
        } catch (error) {
            this.data.errors.push(`❌ videos.html : ${error.message}`);
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
            
            this.data.success.push('honkai-star-rail.html : Page chargée avec succès');
            console.log('⭐ honkai-star-rail.html scanné');
        } catch (error) {
            this.data.errors.push(`❌ honkai-star-rail.html : ${error.message}`);
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
            
            this.data.success.push('wuthering-waves.html : Page chargée avec succès');
            console.log('🌊 wuthering-waves.html scanné');
        } catch (error) {
            this.data.errors.push(`❌ wuthering-waves.html : ${error.message}`);
            console.error('❌ Erreur scan ww.html:', error);
        }
    },

    // Vérifier les erreurs
    async checkErrors() {
        // Vérifier les images manquantes
        document.querySelectorAll('img').forEach(img => {
            if (img.complete && img.naturalHeight === 0) {
                this.data.errors.push(`❌ Image non chargée : ${img.src}`);
            }
        });
        
        // Vérifier les éléments importants
        const elementsImportants = [
            { id: 'theme-toggle', nom: 'Bouton Thème' },
            { id: 'menu-toggle', nom: 'Bouton Menu' },
            { id: 'audio-player', nom: 'Lecteur Musique' },
            { id: 'bouton-haut', nom: 'Bouton Retour Haut' }
        ];
        
        elementsImportants.forEach(element => {
            if (!document.getElementById(element.id)) {
                this.data.errors.push(`❌ ${element.nom} introuvable`);
            } else {
                this.data.success.push(`${element.nom} : Fonctionne`);
            }
        });
        
        console.log('✅ Vérification des erreurs terminée');
    },

    // Mettre à jour l'affichage du rapport
    updateBugReport() {
        // Mettre à jour la section vidéos
        this.updateVideosSection();
        
        // Mettre à jour la section erreurs
        this.updateErrorsSection();
        
        // Mettre à jour la section succès
        this.updateSuccessSection();
    },

    // Mettre à jour la section vidéos
    updateVideosSection() {
        const hsrVideos = this.data.videos.filter(v => v.game === 'Honkai Star Rail');
        const wwVideos = this.data.videos.filter(v => v.game === 'Wuthering Waves');
        
        const hsrList = document.querySelector('#hsr-videos-list');
        const wwList = document.querySelector('#ww-videos-list');
        
        if (hsrList) {
            hsrList.innerHTML = hsrVideos.map(v => 
                `<li>${v.id}</li>`
            ).join('');
        }
        
        if (wwList) {
            wwList.innerHTML = wwVideos.map(v => 
                `<li>${v.id}</li>`
            ).join('');
        }
    },

    // Mettre à jour la section erreurs
    updateErrorsSection() {
        const errorLog = document.querySelector('#error-log');
        
        if (errorLog && this.data.errors.length > 0) {
            errorLog.innerHTML = this.data.errors.map(err => 
                `<div class="bug-item error">${err}</div>`
            ).join('');
        }
    },

    // Mettre à jour la section succès
    updateSuccessSection() {
        const successLog = document.querySelector('#success-log');
        
        if (successLog && this.data.success.length > 0) {
            successLog.innerHTML = this.data.success.map(suc => 
                `<div class="bug-item success">${suc}</div>`
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

        report += `📊 ÉTAT DU SITE\n`;
        report += `─────────────────────────────────────────────────────\n`;
        report += `🎨 Thèmes : ${document.getElementById('theme-toggle') ? '✅ OK' : '❌ Introuvable'}\n`;
        report += `🎵 Musique : ${document.getElementById('audio-player') ? '✅ OK' : '❌ Introuvable'}\n`;
        report += `📱 Menu : ${document.getElementById('menu-toggle') ? '✅ OK' : '❌ Introuvable'}\n\n`;

        report += `❌ ERREURS DÉTECTÉES (${this.data.errors.length})\n`;
        report += `─────────────────────────────────────────────────────\n`;
        if (this.data.errors.length === 0) {
            report += `✅ Aucune erreur détectée !\n\n`;
        } else {
            this.data.errors.forEach(err => {
                report += `${err}\n`;
            });
            report += `\n`;
        }

        report += `✅ SUCCÈS (${this.data.success.length})\n`;
        report += `─────────────────────────────────────────────────────\n`;
        this.data.success.forEach(suc => {
            report += `${suc}\n`;
        });
        report += `\n`;

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

        report += `📺 VIDÉOS YOUTUBE (${this.data.videos.length})\n`;
        report += `─────────────────────────────────────────────────────\n`;
        report += `HSR (${hsrVideos.length}) : ${hsrVideos.map(v => v.id).join(', ')}\n`;
        report += `WW (${wwVideos.length}) : ${wwVideos.map(v => v.id).join(', ')}\n\n`;

        report += `📝 DESCRIPTION DU PROBLÈME\n`;
        report += `─────────────────────────────────────────────────────\n`;
        report += `[Décris ton problème ici]\n\n`;

        report += `🔍 CE QUE J'AI DÉJÀ ESSAYÉ\n`;
        report += `─────────────────────────────────────────────────────\n`;
        report += `- [ ] Actualiser la page (Ctrl + F5)\n`;
        report += `- [ ] Vider le cache du navigateur\n`;
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
