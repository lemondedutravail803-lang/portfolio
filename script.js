// 1. SÉLECTION DES ÉLÉMENTS
const boutonMenu = document.getElementById('menu-toggle');
const listeLiens = document.getElementById('liste-liens');

// =========================================
// 2. TOGGLE DES THÈMES (Normal / Bleu / Or / Argent)
// =========================================
const themeToggle = document.getElementById('theme-toggle');
const themes = ['theme-bleu', 'theme-or', 'theme-argent'];
let themeIndex = 0; // 0 = normal, 1 = bleu, 2 = or, 3 = argent

// Vérifier si un thème est déjà enregistré
const themeEnregistre = localStorage.getItem('theme');
if (themeEnregistre && themes.includes(themeEnregistre)) {
    document.body.classList.add(themeEnregistre);
    themeIndex = themes.indexOf(themeEnregistre) + 1;
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        // Supprimer le thème actuel (si ce n'est pas le thème normal)
        if (themeIndex > 0 && themes[themeIndex - 1]) {
            document.body.classList.remove(themes[themeIndex - 1]);
        }

        // Passer au thème suivant (0 = normal, 1 = bleu, 2 = or, 3 = argent)
        themeIndex = (themeIndex + 1) % 4;

        // Appliquer le nouveau thème
        if (themeIndex > 0) {
            document.body.classList.add(themes[themeIndex - 1]);
            localStorage.setItem('theme', themes[themeIndex - 1]);
        } else {
            // Thème normal - on sauvegarde 'normal'
            localStorage.setItem('theme', 'normal');
        }
    });
}

// 3. GESTION DU MENU MOBILE
boutonMenu.addEventListener('click', () => {
    listeLiens.classList.toggle('active');

    if (listeLiens.classList.contains('active')) {
        boutonMenu.textContent = '✕';
        boutonMenu.style.borderColor = 'var(--couleur-emeraude)';
        boutonMenu.style.color = 'var(--couleur-emeraude)';
    } else {
        boutonMenu.textContent = '☰';
        boutonMenu.style.borderColor = 'var(--couleur-violet)';
        boutonMenu.style.color = 'var(--couleur-violet)';
    }
});

// 4. FERMETURE DU MENU AU CLIC SUR UN LIEN
const liens = document.querySelectorAll('.liste-liens a');
liens.forEach(lien => {
    lien.addEventListener('click', () => {
        listeLiens.classList.remove('active');
        boutonMenu.textContent = '☰';
        boutonMenu.style.borderColor = 'var(--couleur-violet)';
        boutonMenu.style.color = 'var(--couleur-violet)';
    });
});

// 5. EFFET DE DÉFILEMENT FLUIDE
document.querySelectorAll('a[href^="#"]').forEach(ancre => {
    ancre.addEventListener('click', function(e) {
        e.preventDefault();
        const cible = document.querySelector(this.getAttribute('href'));
        if (cible) {
            cible.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 6. BOUTON RETOUR EN HAUT
const boutonHaut = document.getElementById('bouton-haut');

// Afficher/masquer le bouton au scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        boutonHaut.classList.add('visible');
    } else {
        boutonHaut.classList.remove('visible');
    }
});

// Faire remonter en haut au clic
boutonHaut.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 7. ANIMATION DES LETTRES SUR LE NOM (HERO)
// Fonction pour séparer les lettres d'un élément
function separerLettres(element) {
    const texte = element.textContent;
    element.textContent = '';

    // Gérer les espaces et caractères spéciaux
    [...texte].forEach((lettre) => {
        const span = document.createElement('span');
        if (lettre === ' ') {
            span.innerHTML = '&nbsp;';
        } else {
            span.textContent = lettre;
        }
        span.className = 'lettre';
        element.appendChild(span);
    });
}

// Appliquer aux spans du Hero titre (Cédric AUGUSTO)
const heroSpans = document.querySelectorAll('.hero-prenom, .hero-nom');
heroSpans.forEach(span => {
    separerLettres(span);
});

// Appliquer aux titres h2 avec la classe anime-lettres
const titresAnimes = document.querySelectorAll('h2.anime-lettres');
titresAnimes.forEach(titre => {
    separerLettres(titre);
});

// Observer la section Hero pour activer/désactiver l'animation du nom
const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -50% 0px',
    threshold: 0.1
};

const heroSection = document.querySelector('.hero');
if (heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const heroPrenom = document.querySelector('.hero-prenom');
            const heroNom = document.querySelector('.hero-nom');

            if (entry.isIntersecting) {
                // Quand on est dans la section : afficher les lettres
                if (heroPrenom) heroPrenom.classList.add('active');
                if (heroNom) heroNom.classList.add('active');
            } else {
                // Quand on quitte la section : cacher les lettres
                if (heroPrenom) heroPrenom.classList.remove('active');
                if (heroNom) heroNom.classList.remove('active');
            }
        });
    }, observerOptions);

    heroObserver.observe(heroSection);
}

// Observer les sections pour animer les titres h2
const observerSections = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const titre = entry.target.querySelector('h2.anime-lettres');
        if (titre) {
            if (entry.isIntersecting) {
                // Quand la section est visible : animer
                titre.classList.add('active');
            } else {
                // Quand la section n'est plus visible : réinitialiser
                titre.classList.remove('active');
            }
        }
    });
}, observerOptions);

// Observer chaque section
document.querySelectorAll('.section').forEach(section => {
    observerSections.observe(section);
});

// =========================================
// 16. LECTEUR DE MUSIQUE
// =========================================
const audioPlayer = document.getElementById('audio-player');
const musicSelector = document.getElementById('music-selector');

// Liste des musiques
const musicTracks = {
    'sparxie': 'assets/Sparxie.m4a',
    'sparkle': 'assets/Sparkle Mélodrame.m4a',
    'bernice': 'assets/Bernice Boisson spéciale.m4a',
    'cartethyia': 'assets/Wuthering Waves Cartethyia m4a'
};

if (audioPlayer) {
    // Vérifier le chargement de l'audio
    audioPlayer.addEventListener('error', function(e) {
        console.log('Erreur de chargement audio:', e);
    });

    // Afficher le volume par défaut à 50%
    audioPlayer.volume = 0.5;

    // Changer de musique quand on sélectionne une option
    if (musicSelector) {
        musicSelector.addEventListener('change', function() {
            const selectedMusic = musicSelector.value;
            const selectedTrack = musicTracks[selectedMusic];
            
            // Changer la source audio
            audioPlayer.src = selectedTrack;
            
            // Lancer la nouvelle musique
            audioPlayer.play();
            
            // Sauvegarder le choix
            localStorage.setItem('selectedMusic', selectedMusic);
            
            console.log('Musique sélectionnée:', selectedMusic);
        });

        // Charger la dernière musique sélectionnée
        const savedMusic = localStorage.getItem('selectedMusic');
        if (savedMusic && musicTracks[savedMusic]) {
            musicSelector.value = savedMusic;
            audioPlayer.src = musicTracks[savedMusic];
        }
    }

    // Sauvegarder la position de lecture
    audioPlayer.addEventListener('play', function() {
        localStorage.setItem('musicPlaying', 'true');
    });

    audioPlayer.addEventListener('pause', function() {
        localStorage.setItem('musicPlaying', 'false');
    });
}

// =========================================
// PANNEAU DE RAPPORT DE BUG (TOUCHE D)
// =========================================

// Journal des erreurs
const bugReport = {
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

// Fonction pour logger une erreur
function logError(type, message, details = '') {
    const error = {
        date: new Date().toLocaleTimeString('fr-FR'),
        type: type,
        message: message,
        details: details
    };
    bugReport.errors.push(error);
    console.error('🐛 [BUG REPORT]', error);
    updateBugPanel();
}

// Fonction pour logger un avertissement
function logWarning(type, message, details = '') {
    const warning = {
        date: new Date().toLocaleTimeString('fr-FR'),
        type: type,
        message: message,
        details: details
    };
    bugReport.warnings.push(warning);
    console.warn('⚠️ [BUG REPORT]', warning);
    updateBugPanel();
}

// Fonction pour logger un succès
function logSuccess(type, message) {
    const success = {
        date: new Date().toLocaleTimeString('fr-FR'),
        type: type,
        message: message
    };
    bugReport.success.push(success);
    updateBugPanel();
}

// Mettre à jour l'affichage du panneau
function updateBugPanel() {
    const statusDiv = document.getElementById('bug-site-status');
    const logDiv = document.getElementById('bug-error-log');
    const infoDiv = document.getElementById('bug-tech-info');
    
    if (statusDiv) {
        statusDiv.innerHTML = `
            <div class="bug-item ${bugReport.siteStatus.themes === 'OK' ? 'success' : 'error'}">
                <strong>🎨 Thèmes :</strong> ${bugReport.siteStatus.themes}
            </div>
            <div class="bug-item ${bugReport.siteStatus.music === 'OK' ? 'success' : 'error'}">
                <strong>🎵 Musique :</strong> ${bugReport.siteStatus.music}
            </div>
            <div class="bug-item ${bugReport.siteStatus.animations === 'OK' ? 'success' : 'error'}">
                <strong>✨ Animations :</strong> ${bugReport.siteStatus.animations}
            </div>
            <div class="bug-item ${bugReport.siteStatus.menu === 'OK' ? 'success' : 'error'}">
                <strong>📱 Menu :</strong> ${bugReport.siteStatus.menu}
            </div>
        `;
    }
    
    if (logDiv) {
        let html = '';
        
        if (bugReport.errors.length === 0 && bugReport.warnings.length === 0) {
            html = '<p>Aucune erreur détectée pour le moment.</p>';
        } else {
            bugReport.errors.forEach(err => {
                html += `
                    <div class="bug-item error">
                        <strong class="status-error">❌ [${err.date}] ${err.type}</strong><br>
                        ${err.message}<br>
                        <small>${err.details}</small>
                    </div>
                `;
            });
            bugReport.warnings.forEach(warn => {
                html += `
                    <div class="bug-item warning">
                        <strong class="status-warning">⚠️ [${warn.date}] ${warn.type}</strong><br>
                        ${warn.message}<br>
                        <small>${warn.details}</small>
                    </div>
                `;
            });
        }
        
        logDiv.innerHTML = html;
    }
    
    if (infoDiv) {
        infoDiv.innerHTML = `
            <p><strong>Navigateur :</strong> ${navigator.userAgent}</p>
            <p><strong>Fenêtre :</strong> ${window.innerWidth}x${window.innerHeight}</p>
            <p><strong>URL :</strong> ${window.location.href}</p>
            <p><strong>Erreurs totales :</strong> ${bugReport.errors.length}</p>
            <p><strong>Avertissements :</strong> ${bugReport.warnings.length}</p>
        `;
    }
}

// Fonction pour copier le rapport complet
function copyBugReport() {
    let report = `🐛 RAPPORT DE BUG - PORTFOLIO CÉDRIC AUGUSTO\n`;
    report += `═══════════════════════════════════════════════════════\n\n`;
    report += `📅 Date : ${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR')}\n\n`;
    
    report += `📊 ÉTAT DU SITE\n`;
    report += `─────────────────────────────────────────────────────\n`;
    report += `🎨 Thèmes : ${bugReport.siteStatus.themes}\n`;
    report += `🎵 Musique : ${bugReport.siteStatus.music}\n`;
    report += `✨ Animations : ${bugReport.siteStatus.animations}\n`;
    report += `📱 Menu : ${bugReport.siteStatus.menu}\n\n`;
    
    report += `📝 JOURNAL DES ERREURS\n`;
    report += `─────────────────────────────────────────────────────\n`;
    
    if (bugReport.errors.length === 0 && bugReport.warnings.length === 0) {
        report += `Aucune erreur détectée.\n\n`;
    } else {
        bugReport.errors.forEach(err => {
            report += `❌ [${err.date}] ${err.type}\n`;
            report += `   ${err.message}\n`;
            report += `   Détails : ${err.details}\n\n`;
        });
        bugReport.warnings.forEach(warn => {
            report += `⚠️ [${warn.date}] ${warn.type}\n`;
            report += `   ${warn.message}\n`;
            report += `   Détails : ${warn.details}\n\n`;
        });
    }
    
    report += `📄 INFORMATIONS TECHNIQUES\n`;
    report += `─────────────────────────────────────────────────────\n`;
    report += `Navigateur : ${navigator.userAgent}\n`;
    report += `Fenêtre : ${window.innerWidth}x${window.innerHeight}\n`;
    report += `URL : ${window.location.href}\n`;
    report += `Erreurs totales : ${bugReport.errors.length}\n`;
    report += `Avertissements : ${bugReport.warnings.length}\n\n`;
    
    report += `📝 DESCRIPTION DU PROBLÈME\n`;
    report += `─────────────────────────────────────────────────────\n`;
    report += `[Décris ton problème ici]\n\n`;
    
    report += `🔍 CE QUE J'AI DÉJÀ ESSAYÉ\n`;
    report += `─────────────────────────────────────────────────────\n`;
    report += `- [ ] Actualiser la page (Ctrl + F5)\n`;
    report += `- [ ] Vider le cache du navigateur\n`;
    report += `- [ ] Changer de navigateur\n\n`;
    
    report += `═══════════════════════════════════════════════════════\n`;
    report += `Document complet du portfolio disponible sur demande.\n`;
    
    navigator.clipboard.writeText(report).then(() => {
        alert('✅ Rapport copié dans le presse-papiers !\n\nMaintenant :\n1. Colle le rapport à Qwen (l\'IA)\n2. Décris ton problème en détail\n3. Qwen va analyser et corriger');
    }).catch(err => {
        console.error('Erreur lors de la copie :', err);
        alert('❌ Erreur lors de la copie. Sélectionne et copie manuellement.');
    });
}

// Fonction pour ouvrir/fermer le panneau
function toggleBugPanel() {
    const panel = document.getElementById('bug-report-panel');
    const overlay = document.getElementById('bug-report-overlay');
    
    if (panel && overlay) {
        panel.classList.toggle('active');
        overlay.classList.toggle('active');
        updateBugPanel();
    }
}

// Raccourci clavier (Touche D)
document.addEventListener('keydown', (e) => {
    if (e.key === 'd' || e.key === 'D') {
        // Vérifier que l'utilisateur ne tape pas dans un input
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            toggleBugPanel();
        }
    }
    
    // Échap pour fermer
    if (e.key === 'Escape') {
        const panel = document.getElementById('bug-report-panel');
        const overlay = document.getElementById('bug-report-overlay');
        if (panel && overlay && panel.classList.contains('active')) {
            toggleBugPanel();
        }
    }
});

// Fermer le panneau en cliquant sur l'overlay
document.getElementById('bug-report-overlay')?.addEventListener('click', toggleBugPanel);

// Initialiser le rapport de bug au chargement
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier l'état des fonctionnalités
    setTimeout(() => {
        // Vérifier les thèmes
        const themeToggle = document.getElementById('theme-toggle');
        bugReport.siteStatus.themes = themeToggle ? 'OK' : '❌ Introuvable';
        
        // Vérifier la musique
        const audioPlayer = document.getElementById('audio-player');
        bugReport.siteStatus.music = audioPlayer ? 'OK' : '❌ Introuvable';
        
        // Vérifier les animations
        const heroSection = document.querySelector('.hero');
        bugReport.siteStatus.animations = heroSection ? 'OK' : '❌ Introuvable';
        
        // Vérifier le menu
        const menuToggle = document.getElementById('menu-toggle');
        bugReport.siteStatus.menu = menuToggle ? 'OK' : '❌ Introuvable';
        
        updateBugPanel();
        
        // Logger le chargement réussi
        logSuccess('Système', 'Portfolio chargé avec succès');
    }, 1000);
});

// Filet de sécurité global - Attraper les erreurs non gérées
window.addEventListener('error', (event) => {
    logError(
        'JavaScript',
        event.message,
        `${event.filename}:${event.lineno}:${event.colno}`
    );
    event.preventDefault();
    return true;
});

// Attraper les promesses rejetées
window.addEventListener('unhandledrejection', (event) => {
    logError(
        'Promesse',
        'Promesse rejetée non gérée',
        event.reason ? String(event.reason) : 'Raison inconnue'
    );
    event.preventDefault();
    return true;
});

// =========================================
// ASSISTANTE IA INTÉGRÉE (AGATHE)
// =========================================

// Textes pour chaque page
const iaTexts = {
    // Page d'accueil
    index: [
        "Bonjour, je suis Agathe, l'assistante IA de Cédric AUGUSTO.",
        "Bienvenue sur son portfolio de développeur Web.",
        "Je vais vous guider à travers cette page d'accueil.",
        "En haut, vous voyez le nom de Cédric avec une animation de lettres.",
        "Plus bas, vous trouverez la section À propos qui présente Cédric.",
        "Ensuite, la section Compétences Techniques montre HTML, CSS et JavaScript.",
        "Les Soft Skills présentent ses qualités : Curiosité, Ponctualité, Communication.",
        "La section Projets présente 9 projets réalisés par Cédric.",
        "Vous pouvez aussi découvrir la section IA & LLM.",
        "Et enfin, la section Contact pour envoyer un message à Cédric.",
        "Merci de votre visite !"
    ],
    
    // Page Vidéos
    videos: [
        "Bonjour, je suis Agathe.",
        "Bienvenue sur la page Vidéos de Cédric AUGUSTO.",
        "Cette page présente sa passion pour les jeux vidéo.",
        "Vous pouvez voir plusieurs vidéos de Honkai Star Rail.",
        "La Version 3.7 présente le trailer du jeu.",
        "Les vidéos montrent le déroulement d'une session de jeu.",
        "Vous découvrirez les quêtes, les combats et l'exploration.",
        "Merci de votre visite !"
    ],
    
    // Page Wuthering Waves
    wuthering: [
        "Bonjour, je suis Agathe.",
        "Bienvenue sur la page Wuthering Waves.",
        "Cette page présente le jeu Wuthering Waves en détail.",
        "Vous découvrirez l'histoire du jeu et son scénario.",
        "Le monde ouvert permet d'explorer librement.",
        "Le système de combat est magnifique et spectaculaire.",
        "Les objectifs incluent la collection de personnages et d'armes.",
        "Plusieurs vidéos présentent le jeu.",
        "Merci de votre visite !"
    ],
    
    // Page Honkai Star Rail
    hsr: [
        "Bonjour, je suis Agathe.",
        "Bienvenue sur la page Honkai Star Rail.",
        "Cette page présente le jeu Honkai Star Rail.",
        "Vous découvrirez la Version 3.7 du jeu.",
        "Des vidéos présentent le gameplay et l'histoire.",
        "Le jeu est un RPG au tour par tour.",
        "Merci de votre visite !"
    ],
    
    // Page Rapport de Bug
    bugreport: [
        "Bonjour, je suis Agathe.",
        "Bienvenue sur la page Rapport de Bug.",
        "Cette page permet de vérifier les erreurs du portfolio.",
        "Cliquez sur le bouton Lancer le Scan Complet.",
        "Le scan analyse toutes les pages automatiquement.",
        "Les erreurs sont affichées en rouge.",
        "Les succès sont affichés en vert.",
        "Vous pouvez copier le rapport et l'envoyer à Cédric.",
        "Merci de votre visite !"
    ]
};

// Variables IA
let iaAudio = null;
let iaPlaying = false;
let currentPage = 'index';
let iaInterval = null;
let currentSection = 0;
let totalSections = 0;

// Initialiser l'IA pour la page actuelle
function initPageIA(pageName) {
    currentPage = pageName;
    const texts = iaTexts[pageName] || iaTexts.index;
    totalSections = texts.length;
    currentSection = 0;
    
    console.log(`✅ IA initialisée pour la page : ${pageName}`);
}

// Créer la barre IA intégrée
function createIABar() {
    // Vérifier si la barre existe déjà
    if (document.querySelector('.ia-integrated-bar')) {
        return;
    }
    
    const bar = document.createElement('div');
    bar.className = 'ia-integrated-bar';
    bar.innerHTML = `
        <div class="ia-bar-content">
            <span class="ia-avatar">🤖</span>
            <span class="ia-title">Assistante IA - Agathe</span>
            <div class="ia-controls">
                <button onclick="playIAIntegrated()" id="ia-play-btn">▶️ Play</button>
                <button onclick="pauseIAIntegrated()" id="ia-pause-btn" disabled>⏸️ Pause</button>
                <button onclick="stopIAIntegrated()" id="ia-stop-btn" disabled>⏹️ Stop</button>
                <label>🔊 Volume :</label>
                <input type="range" id="ia-volume" min="0" max="100" value="80" onchange="setIAVolumeIntegrated(this.value)">
            </div>
            <div class="ia-text-display" id="ia-text-display"></div>
        </div>
    `;
    
    // Insérer après le header
    const header = document.querySelector('header.en-tete');
    if (header) {
        header.parentNode.insertBefore(bar, header.nextSibling);
    }
    
    console.log('✅ Barre IA intégrée créée');
}

// Lancer l'IA
function playIAIntegrated() {
    if (!iaAudio) {
        iaAudio = document.getElementById('ia-audio-global');
        if (!iaAudio) {
            iaAudio = document.createElement('audio');
            iaAudio.id = 'ia-audio-global';
            iaAudio.preload = 'auto';
            
            const source = document.createElement('source');
            source.src = 'assets/IA introduction..mp3';
            source.type = 'audio/mpeg';
            
            iaAudio.appendChild(source);
            document.body.appendChild(iaAudio);
            
            iaAudio.addEventListener('ended', stopIAIntegrated);
        }
    }
    
    if (iaAudio) {
        iaAudio.play();
        iaPlaying = true;
        
        document.getElementById('ia-play-btn').disabled = true;
        document.getElementById('ia-pause-btn').disabled = false;
        document.getElementById('ia-stop-btn').disabled = false;
        
        // Démarrer le défilement automatique
        startAutoScroll();
        
        // Mettre à jour le texte
        updateIATextIntegrated();
    }
}

// Pause
function pauseIAIntegrated() {
    if (iaAudio) {
        iaAudio.pause();
        iaPlaying = false;
        
        document.getElementById('ia-play-btn').disabled = false;
        document.getElementById('ia-pause-btn').disabled = true;
        
        stopAutoScroll();
    }
}

// Stop
function stopIAIntegrated() {
    if (iaAudio) {
        iaAudio.pause();
        iaAudio.currentTime = 0;
        iaPlaying = false;
        currentSection = 0;
        
        document.getElementById('ia-play-btn').disabled = false;
        document.getElementById('ia-pause-btn').disabled = true;
        document.getElementById('ia-stop-btn').disabled = true;
        
        stopAutoScroll();
        updateIATextIntegrated();
        
        // Retour en haut de page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Volume
function setIAVolumeIntegrated(value) {
    if (iaAudio) {
        iaAudio.volume = value / 100;
    }
}

// Mettre à jour le texte affiché
function updateIATextIntegrated() {
    const display = document.getElementById('ia-text-display');
    if (display) {
        const texts = iaTexts[currentPage] || iaTexts.index;
        display.innerHTML = texts.map((phrase, index) => {
            if (index < currentSection) {
                return `<span class="ia-highlighted">${phrase}</span><br>`;
            } else if (index === currentSection) {
                return `<span class="ia-current">${phrase}</span><br>`;
            } else {
                return `<span class="ia-coming">${phrase}</span><br>`;
            }
        }).join('');
    }
}

// Démarrer le défilement automatique
function startAutoScroll() {
    const texts = iaTexts[currentPage] || iaTexts.index;
    const duration = 60; // Durée totale estimée en secondes
    const sectionDuration = (duration / texts.length) * 1000;
    
    iaInterval = setInterval(() => {
        currentSection++;
        if (currentSection >= texts.length) {
            stopIAIntegrated();
        } else {
            updateIATextIntegrated();
            scrollToSection();
        }
    }, sectionDuration);
}

// Arrêter le défilement automatique
function stopAutoScroll() {
    if (iaInterval) {
        clearInterval(iaInterval);
        iaInterval = null;
    }
}

// Défiler vers la section actuelle
function scrollToSection() {
    const texts = iaTexts[currentPage] || iaTexts.index;
    const progress = currentSection / texts.length;
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    const scrollTop = progress * scrollHeight;
    
    window.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
    });
}

// Initialiser l'IA au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Déterminer la page actuelle
    const path = window.location.pathname;
    let pageName = 'index';
    
    if (path.includes('videos.html')) {
        pageName = 'videos';
    } else if (path.includes('wuthering-waves.html')) {
        pageName = 'wuthering';
    } else if (path.includes('honkai-star-rail.html')) {
        pageName = 'hsr';
    } else if (path.includes('bug-report.html')) {
        pageName = 'bugreport';
    }
    
    initPageIA(pageName);
    createIABar();
    updateIATextIntegrated();
    
    console.log('✅ Assistante IA Agathe initialisée');
});
