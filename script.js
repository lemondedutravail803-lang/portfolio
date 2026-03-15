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
// ASSISTANTE IA FLOTTANTE (WEB SPEECH API)
// =========================================

// Textes pour chaque page avec IDs des sections
const iaTexts = {
    index: [
        { text: "Bonjour, je suis Agathe, l'assistante IA de Cédric AUGUSTO.", section: null },
        { text: "Bienvenue sur son portfolio de développeur Web.", section: null },
        { text: "Je vais vous guider à travers cette page d'accueil.", section: null },
        { text: "En haut de la page, vous voyez le logo avec le nom Cédric AUGUSTO.", section: 'header' },
        { text: "Le menu de navigation vous permet d'accéder aux différentes sections.", section: 'header' },
        { text: "La section Hero présente Cédric comme Développeur Web en formation.", section: 'hero' },
        { text: "Il recherche un stage ou une alternance à partir de deux mille vingt-six.", section: 'hero' },
        { text: "La section À Propos décrit sa curiosité technique et son esprit d'apprentissage.", section: 'about' },
        { text: "La section Compétences Techniques montre HTML cinq, CSS trois et JavaScript.", section: 'competences' },
        { text: "La section Soft Skills présente ses qualités : Curiosité, Ponctualité, Communication, Organisation et Autonomie.", section: 'soft-skills' },
        { text: "La section Projets présente neuf projets réalisés par Cédric.", section: 'projets' },
        { text: "Le premier projet est un Jeu de Voiture créé avec Scratch.", section: 'projets' },
        { text: "Le deuxième projet est le Site Portfolio en HTML et CSS.", section: 'projets' },
        { text: "Le troisième projet est une Figurine créée chez Cap Sciences.", section: 'projets' },
        { text: "Le quatrième projet est un Montage Vidéo avec effets et transitions.", section: 'projets' },
        { text: "Le cinquième projet est OpenShot Vidéo pour le montage professionnel.", section: 'projets' },
        { text: "Le sixième projet est la Formation Konexio de sept semaines.", section: 'projets' },
        { text: "Le septième projet est un Jeu dans l'Espace en HTML, CSS et JavaScript.", section: 'projets' },
        { text: "Le huitième projet est Google Docs pour la création de documents.", section: 'projets' },
        { text: "Le neuvième projet est Google Sheets pour les tableaux de bord.", section: 'projets' },
        { text: "La section IA et LLM présente l'intégration de l'intelligence artificielle.", section: 'ia' },
        { text: "La section Contact permet d'envoyer un message à Cédric.", section: 'contact' },
        { text: "Un lecteur de musique est disponible en bas de page avec quatre titres.", section: null },
        { text: "Merci de votre visite !", section: null }
    ],
    videos: [
        { text: "Bonjour, je suis Agathe.", section: null },
        { text: "Bienvenue sur la page Vidéos de Cédric AUGUSTO.", section: null },
        { text: "Cette page présente sa passion pour les jeux vidéo.", section: 'videos' },
        { text: "La section principale présente Honkai Star Rail Version trois point sept.", section: 'videos' },
        { text: "Honkai Star Rail est un jeu gratuit de type Gacha et R P G au tour par tour.", section: 'videos' },
        { text: "Le développeur est Ho Yoverse.", section: 'videos' },
        { text: "Les plateformes sont PC, Mobile et PlayStation.", section: 'videos' },
        { text: "L'histoire se déroule dans un voyage spatial épique.", section: 'videos' },
        { text: "Vous explorez différents mondes, planètes et stations spatiales.", section: 'videos' },
        { text: "L'univers mêle science-fiction, fantasy et technologie avancée.", section: 'videos' },
        { text: "Vous incarnez un personnage amnésique qui doit récupérer sa mémoire.", section: 'videos' },
        { text: "Vous accomplissez des quêtes scénarisées et combattez des monstres.", section: 'videos' },
        { text: "Vous collectionnez vos personnages préférés grâce au système gacha.", section: 'videos' },
        { text: "La page présente trois vidéos de Honkai Star Rail.", section: 'videos' },
        { text: "La première vidéo est la bande-annonce de la Version trois point sept.", section: 'videos' },
        { text: "La deuxième vidéo est une nouvelle vidéo de présentation.", section: 'videos' },
        { text: "La troisième vidéo présente le personnage Grande Herta.", section: 'videos' },
        { text: "La section Déroulement d'une Session de Jeu explique les quatre étapes.", section: null },
        { text: "Première étape : Connexion et Quotidiens avec les récompenses et missions.", section: null },
        { text: "Deuxième étape : Quêtes d'Histoire pour progresser dans le scénario.", section: null },
        { text: "Troisième étape : Combats et Exploration des donjons.", section: null },
        { text: "Quatrième étape : Collection et Amélioration des personnages et armes.", section: null },
        { text: "Merci de votre visite !", section: null }
    ],
    wuthering: [
        { text: "Bonjour, je suis Agathe.", section: null },
        { text: "Bienvenue sur la page Wuthering Waves.", section: null },
        { text: "Cette page présente le jeu Wuthering Waves en détail.", section: 'videos' },
        { text: "La section Présentation du Jeu décrit l'histoire et le scénario.", section: 'videos' },
        { text: "Vous incarnez un personnage masculin ou féminin qui a perdu la mémoire.", section: 'videos' },
        { text: "Votre but est de retrouver vos souvenirs en explorant l'univers.", section: 'videos' },
        { text: "Vous découvrez l'histoire de nombreux personnages avec leur personnalité.", section: 'videos' },
        { text: "L'histoire principale évolue au fil des mises à jour régulières.", section: 'videos' },
        { text: "La section Monde Ouvert et Exploration décrit les fonctionnalités.", section: 'videos' },
        { text: "Vous contrôlez jusqu'à trois personnages simultanément.", section: 'videos' },
        { text: "Vous explorez librement un vaste univers.", section: 'videos' },
        { text: "Vous battez des monstres et sauvez le monde.", section: 'videos' },
        { text: "Vous découvrez la mémoire du personnage à travers les quêtes d'histoire.", section: 'videos' },
        { text: "La section Système de Combat décrit les combats magnifiques.", section: 'videos' },
        { text: "Les dégâts sont visibles avec des chiffres sur les ennemis.", section: 'videos' },
        { text: "Les animations sont somptueuses et chaque attaque est un spectacle.", section: 'videos' },
        { text: "Les combats sont rapides et efficaces.", section: 'videos' },
        { text: "Vous personnalisez vos personnages collectionnés.", section: 'videos' },
        { text: "La section Objectifs et Collection liste les buts du jeu.", section: 'videos' },
        { text: "Les objectifs incluent les quêtes d'histoire et la collection de personnages.", section: 'videos' },
        { text: "Le système d'invocation permet d'obtenir de nouveaux personnages.", section: 'videos' },
        { text: "Vous collectionnez les armes et les artefacts.", section: 'videos' },
        { text: "Vous optimisez les statistiques de vos personnages.", section: 'videos' },
        { text: "La page présente trois vidéos de Wuthering Waves.", section: 'videos' },
        { text: "La première vidéo est Dawn Arrives, les cinématiques d'histoire.", section: 'videos' },
        { text: "La deuxième vidéo est une nouvelle vidéo de présentation.", section: 'videos' },
        { text: "La troisième vidéo présente l'univers de Wuthering Waves.", section: 'videos' },
        { text: "Merci de votre visite !", section: null }
    ],
    hsr: [
        { text: "Bonjour, je suis Agathe.", section: null },
        { text: "Bienvenue sur la page Honkai Star Rail.", section: null },
        { text: "Cette page présente le jeu Honkai Star Rail.", section: 'videos' },
        { text: "La section principale présente la bande-annonce de la Version trois point sept.", section: 'videos' },
        { text: "Le titre est Vers ce demain d'autrefois.", section: 'videos' },
        { text: "La page présente également une nouvelle vidéo de Honkai Star Rail.", section: 'videos' },
        { text: "La section Déroulement d'une Session de Jeu explique les quatre étapes.", section: null },
        { text: "Première étape : Connexion et Quotidiens avec les récompenses de connexion.", section: null },
        { text: "Deuxième étape : Quêtes d'Histoire pour découvrir de nouvelles zones.", section: null },
        { text: "Troisième étape : Combats et Exploration pour affronter des ennemis.", section: null },
        { text: "Quatrième étape : Collection et Amélioration avec le système gacha.", section: null },
        { text: "Le jeu est un R P G au tour par tour développé par Ho Yoverse.", section: null },
        { text: "Merci de votre visite !", section: null }
    ],
    bugreport: [
        { text: "Bonjour, je suis Agathe.", section: null },
        { text: "Bienvenue sur la page Rapport de Bug.", section: null },
        { text: "Cette page permet de vérifier les erreurs du portfolio.", section: null },
        { text: "La section État du Site affiche l'état des fonctionnalités.", section: null },
        { text: "Les thèmes, la musique, les animations et le menu sont vérifiés.", section: null },
        { text: "La section Journal des Erreurs affiche les erreurs détectées.", section: null },
        { text: "Les erreurs sont affichées en rouge avec une croix.", section: null },
        { text: "La section Succès affiche les éléments qui fonctionnent.", section: null },
        { text: "Les succès sont affichés en vert avec un check.", section: null },
        { text: "Le bouton Lancer le Scan Complet analyse toutes les pages.", section: null },
        { text: "Le scan détecte les images non chargées.", section: null },
        { text: "Le scan vérifie les éléments importants comme les boutons.", section: null },
        { text: "Le scan vérifie les vidéos YouTube accessibles.", section: null },
        { text: "Les erreurs sont listées avec leur localisation.", section: null },
        { text: "Le bouton Copier le Rapport permet de copier tout le rapport.", section: null },
        { text: "Vous pouvez copier le rapport et l'envoyer à Cédric.", section: null },
        { text: "Le rapport inclut l'état du site, les erreurs et les succès.", section: null },
        { text: "Le rapport inclut la structure du portfolio.", section: null },
        { text: "Le rapport inclut les vidéos YouTube détectées.", section: null },
        { text: "Merci de votre visite !", section: null }
    ]
};

// Variables IA
let iaSynth = window.speechSynthesis;
let iaUtterance = null;
let iaPlaying = false;
let currentPage = 'index';
let currentPhrase = 0;
let iaWidgetOpen = false;

// Initialiser l'IA pour la page actuelle
function initPageIA(pageName) {
    currentPage = pageName;
    currentPhrase = 0;
    console.log(`✅ IA initialisée pour la page : ${pageName}`);
}

// Créer le widget flottant IA
function createIAWidget() {
    // Bouton flottant
    const btn = document.createElement('button');
    btn.className = 'ia-float-btn';
    btn.innerHTML = '🤖';
    btn.onclick = toggleIAWidget;
    btn.title = 'Assistante IA';
    document.body.appendChild(btn);

    // Panneau IA
    const panel = document.createElement('div');
    panel.className = 'ia-float-panel';
    panel.id = 'ia-float-panel';
    panel.innerHTML = `
        <div class="ia-panel-header">
            <span class="ia-avatar-anim" id="ia-avatar">🤖</span>
            <span>ASSISTANTE IA - Agathe</span>
            <button class="ia-panel-close" onclick="toggleIAWidget()">✕</button>
        </div>
        <div class="ia-panel-content">
            <div class="ia-text-display" id="ia-text-display"></div>
        </div>
        <div class="ia-panel-controls">
            <button onclick="playIA()" id="ia-play-btn">▶️</button>
            <button onclick="pauseIA()" id="ia-pause-btn" disabled>⏸️</button>
            <button onclick="stopIA()" id="ia-stop-btn" disabled>⏹️</button>
            <input type="range" id="ia-volume" min="0" max="100" value="80" onchange="setIAVolume(this.value)">
        </div>
    `;
    document.body.appendChild(panel);

    console.log('✅ Widget IA créé');
}

// Ouvrir/Fermer le widget
function toggleIAWidget() {
    const panel = document.getElementById('ia-float-panel');
    if (panel) {
        panel.classList.toggle('active');
        iaWidgetOpen = panel.classList.contains('active');
        
        if (iaWidgetOpen) {
            updateIAText();
        }
    }
}

// Lancer l'IA
function playIA() {
    if (iaSynth.speaking) {
        iaSynth.resume();
        iaPlaying = true;
    } else {
        const texts = iaTexts[currentPage] || iaTexts.index;
        const text = texts.join(' ');
        
        iaUtterance = new SpeechSynthesisUtterance(text);
        
        // Voix féminine
        const voices = iaSynth.getVoices();
        const femaleVoice = voices.find(voice => 
            voice.name.includes('Female') || 
            voice.name.includes('Google français') ||
            voice.name.includes('Amélie') ||
            voice.name.includes('Alice')
        );
        
        if (femaleVoice) {
            iaUtterance.voice = femaleVoice;
        }
        
        iaUtterance.pitch = 1.3; // Plus aigu = plus féminin (1.0 = normal, 2.0 = très aigu)
        iaUtterance.rate = 0.85; // Plus lent = plus calme (1.0 = normal, 0.5 = très lent)
        iaUtterance.volume = document.getElementById('ia-volume').value / 100;
        
        // Animation de l'avatar quand l'IA parle
        const avatar = document.getElementById('ia-avatar');
        
        iaUtterance.onstart = () => {
            if (avatar) {
                avatar.classList.add('speaking');
            }
        };
        
        iaUtterance.onboundary = (event) => {
            if (event.name === 'sentence') {
                currentPhrase++;
                updateIAText();
                scrollToCurrentPhrase();
            }
        };
        
        iaUtterance.onend = () => {
            if (avatar) {
                avatar.classList.remove('speaking');
            }
            stopIA();
        };
        
        iaSynth.speak(iaUtterance);
        iaPlaying = true;
    }
    
    document.getElementById('ia-play-btn').disabled = true;
    document.getElementById('ia-pause-btn').disabled = false;
    document.getElementById('ia-stop-btn').disabled = false;
}

// Pause
function pauseIA() {
    if (iaSynth.speaking) {
        iaSynth.pause();
        iaPlaying = false;
        
        // Arrêter l'animation de l'avatar
        const avatar = document.getElementById('ia-avatar');
        if (avatar) {
            avatar.classList.remove('speaking');
        }
        
        document.getElementById('ia-play-btn').disabled = false;
        document.getElementById('ia-pause-btn').disabled = true;
    }
}

// Stop
function stopIA() {
    iaSynth.cancel();
    iaPlaying = false;
    currentPhrase = 0;
    
    // Arrêter l'animation de l'avatar
    const avatar = document.getElementById('ia-avatar');
    if (avatar) {
        avatar.classList.remove('speaking');
    }
    
    document.getElementById('ia-play-btn').disabled = false;
    document.getElementById('ia-pause-btn').disabled = true;
    document.getElementById('ia-stop-btn').disabled = true;
    
    updateIAText();
}

// Volume
function setIAVolume(value) {
    if (iaUtterance) {
        iaUtterance.volume = value / 100;
    }
}

// Mettre à jour le texte affiché
function updateIAText() {
    const display = document.getElementById('ia-text-display');
    if (display) {
        const texts = iaTexts[currentPage] || iaTexts.index;
        display.innerHTML = texts.map((item, index) => {
            const phrase = typeof item === 'object' ? item.text : item;
            if (index < currentPhrase) {
                return `<span class="ia-highlighted">${phrase}</span><br>`;
            } else if (index === currentPhrase) {
                return `<span class="ia-current">${phrase}</span><br>`;
            } else {
                return `<span class="ia-coming">${phrase}</span><br>`;
            }
        }).join('');
    }
}

// Scroll vers la section actuelle
function scrollToCurrentPhrase() {
    // Scroll dans le panneau IA
    const content = document.querySelector('.ia-panel-content');
    if (content) {
        const texts = iaTexts[currentPage] || iaTexts.index;
        const progress = currentPhrase / texts.length;
        const scrollHeight = content.scrollHeight - content.clientHeight;
        const scrollTop = progress * scrollHeight;
        
        content.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
        });
    }
    
    // Scroll vers la section de la page si définie
    const texts = iaTexts[currentPage] || iaTexts.index;
    const currentItem = texts[currentPhrase];
    
    if (currentItem && typeof currentItem === 'object' && currentItem.section) {
        const section = document.getElementById(currentItem.section);
        if (section) {
            // Retirer la classe highlight de toutes les sections
            document.querySelectorAll('.section').forEach(sec => {
                sec.classList.remove('ia-highlight-section');
            });
            
            // Ajouter la classe highlight à la section actuelle
            section.classList.add('ia-highlight-section');
            
            // Scroll vers la section
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Initialiser l'IA au chargement
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
    createIAWidget();
    updateIAText();
    
    console.log('✅ Assistante IA Agathe initialisée');
});
