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
// ASSISTANTE IA FLOTTANTE (AGATHE)
// =========================================

// Texte complet de l'IA (découpé en phrases)
const iaText = [
    "Bonjour, je suis l'assistante IA de Cédric AUGUSTO.",
    "Je suis là pour répondre à tous vos besoins concernant son portfolio et toute l'histoire qui en déroule.",
    "Que souhaitez-vous découvrir aujourd'hui ?",
    "Ce portfolio a été créé avec passion.",
    "Il présente les projets de Cédric en développement web.",
    "Vous pouvez naviguer grâce au menu.",
    "Et utiliser le rapport de bug pour vérifier les erreurs.",
    "Merci de votre visite !"
];

// Variables IA
let iaAudio = null;
let iaPanelOpen = false;
let currentPhrase = 0;
let iaInterval = null;

// Créer le bouton flottant IA
function createIAWidget() {
    // Bouton flottant
    const btn = document.createElement('button');
    btn.className = 'ia-widget-btn';
    btn.innerHTML = '🤖';
    btn.onclick = toggleIAPanel;
    btn.title = 'Assistante IA';
    document.body.appendChild(btn);

    // Panneau IA
    const panel = document.createElement('div');
    panel.className = 'ia-widget-panel';
    panel.id = 'ia-widget-panel';
    panel.innerHTML = `
        <div class="ia-widget-header">
            🤖 ASSISTANTE IA - Agathe
            <button class="ia-close-btn" onclick="toggleIAPanel()">✕</button>
        </div>
        <div class="ia-widget-content">
            <div class="ia-widget-text" id="ia-text-display"></div>
        </div>
        <div class="ia-widget-controls">
            <button onclick="playIA()">▶️</button>
            <button onclick="pauseIA()">⏸️</button>
            <button onclick="stopIA()">⏹️</button>
            <input type="range" id="ia-volume" min="0" max="100" value="80" onchange="setIAVolume(this.value)" style="width: 80px;">
        </div>
    `;
    document.body.appendChild(panel);

    console.log('✅ Widget IA créé');
}

// Ouvrir/Fermer le panneau
function toggleIAPanel() {
    const panel = document.getElementById('ia-widget-panel');
    if (panel) {
        panel.classList.toggle('active');
        iaPanelOpen = panel.classList.contains('active');
        
        if (iaPanelOpen && !iaAudio) {
            initIAAudio();
        }
    }
}

// Initialiser l'audio IA
function initIAAudio() {
    if (!iaAudio) {
        iaAudio = document.getElementById('ia-audio-global');
        if (!iaAudio) {
            // Créer l'élément audio
            iaAudio = document.createElement('audio');
            iaAudio.id = 'ia-audio-global';
            iaAudio.preload = 'auto';
            
            const source1 = document.createElement('source');
            source1.src = 'assets/IA introduction.m4a';
            source1.type = 'audio/mp4';
            
            const source2 = document.createElement('source');
            source2.src = 'assets/IA introduction.mp3';
            source2.type = 'audio/mpeg';
            
            iaAudio.appendChild(source1);
            iaAudio.appendChild(source2);
            document.body.appendChild(iaAudio);
            
            // Événements
            iaAudio.addEventListener('timeupdate', updateIAHighlight);
            iaAudio.addEventListener('ended', stopIA);
        }
    }
}

// Lancer l'IA
function playIA() {
    if (!iaAudio) initIAAudio();
    
    if (iaAudio) {
        iaAudio.play();
        currentPhrase = 0;
        updateIAText();
        
        // Démarrer le surlignage progressif
        startIAHighlight();
    }
}

// Pause
function pauseIA() {
    if (iaAudio) {
        iaAudio.pause();
        stopIAHighlight();
    }
}

// Stop
function stopIA() {
    if (iaAudio) {
        iaAudio.pause();
        iaAudio.currentTime = 0;
        currentPhrase = 0;
        stopIAHighlight();
        updateIAText();
    }
}

// Volume
function setIAVolume(value) {
    if (iaAudio) {
        iaAudio.volume = value / 100;
    }
}

// Mettre à jour le texte affiché
function updateIAText() {
    const display = document.getElementById('ia-text-display');
    if (display) {
        display.innerHTML = iaText.map((phrase, index) => {
            if (index < currentPhrase) {
                return `<span class="highlight">${phrase}</span><br>`;
            } else if (index === currentPhrase) {
                return `<span class="highlight">${phrase}</span><br>`;
            } else {
                return `<span class="coming">${phrase}</span><br>`;
            }
        }).join('');
        
        // Scroll automatique progressif
        scrollToCurrentPhrase();
    }
}

// Démarrer le surlignage progressif
function startIAHighlight() {
    const duration = iaAudio.duration || 20; // Durée estimée
    const phraseDuration = duration / iaText.length;
    
    iaInterval = setInterval(() => {
        currentPhrase++;
        if (currentPhrase >= iaText.length) {
            stopIAHighlight();
        }
        updateIAText();
    }, phraseDuration * 1000);
}

// Arrêter le surlignage
function stopIAHighlight() {
    if (iaInterval) {
        clearInterval(iaInterval);
        iaInterval = null;
    }
}

// Mettre à jour le surlignage selon le temps audio
function updateIAHighlight() {
    if (!iaAudio || !iaPanelOpen) return;
    
    const progress = iaAudio.currentTime / iaAudio.duration;
    currentPhrase = Math.floor(progress * iaText.length);
    updateIAText();
}

// Scroll automatique progressif vers la phrase actuelle
function scrollToCurrentPhrase() {
    const content = document.querySelector('.ia-widget-content');
    if (content) {
        const scrollHeight = content.scrollHeight;
        const scrollTop = (currentPhrase / iaText.length) * scrollHeight;
        content.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
        });
    }
}

// Créer le widget IA au chargement
document.addEventListener('DOMContentLoaded', () => {
    createIAWidget();
    console.log('✅ Assistante IA Agathe initialisée');
});
