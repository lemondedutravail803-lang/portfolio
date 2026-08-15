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
            span.textContent = '\u00A0';
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

// =========================================
// 8. ANIMATION DES TITRES H2 AU SCROLL
// =========================================

// Fonction pour séparer les lettres des titres h2
function animerTitresH2() {
    const titresH2 = document.querySelectorAll('h2.anime-lettres');
    
    titresH2.forEach(titre => {
        // Séparer les lettres
        const texte = titre.textContent;
        titre.textContent = '';
        
        [...texte].forEach((lettre) => {
            const span = document.createElement('span');
            if (lettre === ' ') {
                span.textContent = '\u00A0';
            } else {
                span.textContent = lettre;
            }
            span.className = 'lettre';
            titre.appendChild(span);
        });
    });
    
    // Créer l'IntersectionObserver pour les sections
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const observerSections = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const titre = entry.target.querySelector('h2.anime-lettres');
                if (titre && !titre.classList.contains('active')) {
                    titre.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    // Observer toutes les sections
    document.querySelectorAll('.section').forEach(section => {
        observerSections.observe(section);
    });
}

// Lancer l'animation des titres H2
animerTitresH2();

// =========================================
// 9. LECTEUR DE MUSIQUE
// =========================================
const audioPlayer = document.getElementById('audio-player');
const musicSelector = document.getElementById('music-selector');

// Liste des musiques
const musicTracks = {
    'iuno': 'assets/Iuno.m4a',
    'sigrika': 'assets/Sigrika.m4a',
    'robin': 'assets/Robin.m4a',
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
// FILET DE SÉCURITÉ GLOBAL
// =========================================

// Attraper les erreurs JavaScript non gérées
window.addEventListener('error', (event) => {
    console.error('❌ Erreur JavaScript détectée:', event.message);
    console.error('Fichier:', event.filename);
    console.error('Ligne:', event.lineno);
    event.preventDefault();
    return true;
});

// Attraper les promesses rejetées
window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Promesse rejetée:', event.reason);
    event.preventDefault();
    return true;
});

// =========================================
// ASSISTANTE IA FLOTTANTE (SUR TOUTES LES PAGES)
// =========================================

// Contenu COMPLET et DÉTAILLÉ de chaque page
const iaContent = {
    index: {
        title: "Page d'Accueil - Portfolio Cédric AUGUSTO",
        sections: [
            { id: 'header', name: 'Header', text: "En haut de la page, vous trouvez le logo avec mon nom Cédric AUGUSTO. Le curseur clignote après le nom. Le menu de navigation est juste en dessous avec un bouton hamburger pour mobile. Le menu contient les liens : À propos, Compétences, Soft Skills, Projets, IA, Vidéos, Wuthering Waves, et Contact. Un bouton pour changer de thème est positionné en haut à droite." },
            { id: 'hero', name: 'Hero Section', text: "La section Hero est la première section visible. Elle affiche mon nom en grand avec une animation de lettres. Le sous-titre indique Développeur Web en formation. La description indique que je recherche un stage ou une alternance à partir de deux mille vingt-six. Deux boutons sont présents : Voir projets et Me contacter." },
            { id: 'about', name: 'À Propos', text: "La section À Propos décrit mon parcours. Je suis développeur web en formation, activement à la recherche d'un stage ou d'une alternance. Animé par une forte curiosité technique, je mets mon esprit d'apprentissage au service de la création d'interfaces propres, fonctionnelles et adaptées aux besoins utilisateurs. Les coordonnées sont affichées avec la ville et l'email." },
            { id: 'competences', name: 'Compétences Techniques', text: "La section Compétences Techniques présente trois logos : HTML cinq pour le markup web, CSS trois pour le style et la mise en page, et JavaScript pour l'interactivité. Chaque logo est affiché dans une carte avec un effet de ligne lumineuse." },
            { id: 'soft-skills', name: 'Soft Skills', text: "La section Soft Skills présente quatre qualités principales : Curiosité pour l'apprentissage continu, Ponctualité pour le respect des délais, Communication pour le travail en équipe, et Organisation et Autonomie pour la gestion de projet." },
            { id: 'stages', name: 'Stages & Parcours Professionnel', text: "La section Stages & Parcours Professionnel présente quatre stages réalisés. Le premier est Biocoop Bouliac (2 semaines) : découverte du commerce bio et de la vente, équipe accueillante. Le deuxième est Traiteur : préparation de plats en volume, dextérité, collègues sympathiques. Le troisième est Espaces Verts : entretien extérieur, horaires variables. Le quatrième est Boulangerie Ange à Bouliac (2 semaines) : préparation de 82 sandwichs par jour, pâtisserie, rythme rapide, équipe très sympathique." },
            { id: 'projets', name: 'Projet, formation. Konexio', text: "La section Projet, formation. Konexio présente tous les projets réalisés pendant la formation Konexio. Huit projets sont présentés : Jeu de Voiture créé avec Scratch, Site Portfolio en HTML et CSS, Figurine créée lors d'un atelier Cap Sciences, Montage Vidéo, OpenShot Vidéo, Formation Konexio de sept semaines, Jeu dans l'Espace en HTML, CSS et JavaScript, Google Docs et Google Sheets." },
            { id: 'ia', name: 'Tous les logiciels d\'IA que je maîtrise', text: "La section Tous les logiciels d'IA que je maîtrise présente huit logiciels. Le premier est Qwen, utilisé pour la recherche quotidienne et la construction du portfolio via Visual Studio Code, avec conversation infinie. Le deuxième est ChatGPT, extrêmement fort pour créer des images avec une précision ultra, utilisant des images de référence. Le troisième est Claude, la meilleure IA pour les rédactions, utilisée pour le thème du portfolio. Le quatrième est CV Designer, ultra bien fourni avec des CV de référence personnalisables via IA intégrée. Le cinquième est Canva, pour créer des CV, images, tableurs, vidéos, docs et diaporamas. Le sixième est OpenShot Video, un logiciel de montage pour vidéos pro et YouTube. Le septième est Malwarebytes, un antivirus avec Browser Guard qui bloque les pubs, le phishing et les scripts malveillants. Le huitième est 4K Video Downloader+, pour télécharger des vidéos et musiques YouTube en quelques minutes." },
            { id: 'contact', name: 'Contact', text: "La section Contact affiche un titre Contact et Opportunités. Le texte indique que je suis disponible pour un stage ou une alternance. Les coordonnées incluent l'email, LinkedIn et GitHub. Un formulaire de contact est présent avec les champs Nom, Email et Message. Un bouton Envoyer ma candidature permet d'envoyer le message." }
        ]
    },
    videos: {
        title: "Page Vidéos - Honkai Star Rail",
        sections: [
            { id: 'videos', name: 'Présentation', text: "La page Vidéos présente ma passion pour les jeux vidéo, en particulier Honkai Star Rail. La section principale décrit le jeu comme un jeu gratuit de type Gacha et R P G au tour par tour, développé par Ho Yoverse, disponible sur PC, Mobile et PlayStation." },
            { id: 'videos', name: 'Histoire du Jeu', text: "L'histoire se déroule dans un voyage spatial épique. Vous explorez différents mondes, planètes et stations spatiales dans un univers de science-fiction mêlant fantasy et technologie avancée. Vous incarnez un personnage amnésique qui doit récupérer sa mémoire tout en voyageant à travers l'univers." },
            { id: 'videos', name: 'Gameplay', text: "Vous accomplissez des quêtes scénarisées, combattez des monstres et affrontez des personnages emblématiques. Collectionnez vos personnages préférés grâce au système gacha, équipez-les d'armes puissantes et constituez l'équipe parfaite pour vaincre les ennemis les plus redoutables." },
            { id: 'videos', name: 'Vidéos Présentées', text: "Trois vidéos sont présentées sur cette page. La première est la bande-annonce de la Version trois point sept. La deuxième est une nouvelle vidéo de présentation. La troisième présente le personnage Grande Herta." },
            { id: 'videos', name: 'Déroulement d\'une Session', text: "La section Déroulement d'une Session de Jeu explique les quatre étapes. Première étape : Connexion et Quotidiens avec les récompenses de connexion, missions quotidiennes et entraînements. Deuxième étape : Quêtes d'Histoire pour progresser dans le scénario principal. Troisième étape : Combats et Exploration des donjons. Quatrième étape : Collection et Amélioration avec le gacha pour nouveaux personnages." }
        ]
    },
    wuthering: {
        title: "Wuthering Waves - Présentation du Jeu",
        sections: [
            { id: 'videos', name: 'Histoire et Scénario', text: "Dans Wuthering Waves, vous incarnez un personnage masculin ou féminin qui se réveille dans un monde qu'il a connu auparavant, mais dont il a perdu la mémoire. Votre but principal est de retrouver vos souvenirs tout en explorant cet univers mystérieux. Au fil de l'aventure, vous découvrez l'histoire de nombreux personnages, chacun avec leur propre personnalité et leur passé." },
            { id: 'videos', name: 'Monde Ouvert', text: "Wuthering Waves est un jeu en monde ouvert où vous pouvez contrôler jusqu'à trois personnages simultanément. Vous explorez librement un vaste univers, battez des monstres et sauvez le monde. Vous découvrez la mémoire du personnage à travers les quêtes d'histoire." },
            { id: 'videos', name: 'Système de Combat', text: "Le système de combat est magnifique et spectaculaire. Les dégâts sont visibles avec des chiffres qui s'affichent sur les ennemis. Les animations sont somptueuses et chaque attaque est un véritable spectacle. Les combats sont rapides et efficaces pour détruire les monstres le plus vite possible." },
            { id: 'videos', name: 'Objectifs et Collection', text: "Les objectifs incluent les quêtes d'histoire, la collection de personnages via le système d'invocation gacha, la collection d'armes, les artefacts et équipements, et l'optimisation des statistiques des personnages pour avoir le plus de statistiques et détruire les monstres efficacement." },
            { id: 'videos', name: '5 Vidéos Présentées', text: "Cinq vidéos sont présentées sur cette page. Vidéo 1 : Wuthering Waves Version 2.7 Official Trailer - Dawn Breaks on Dark Tides. Vidéo 2 : Wuthering Waves Story Cinematics - A Dawn Without Divinity. Vidéo 3 : Wuthering Waves Story Trailer - To the Finale. Vidéo 4 : Wuthering Waves Story Cinematics - Dawn Arrives. Vidéo 5 : Wuthering Waves Story Cinematics - Side by Side." }
        ]
    },
    hsr: {
        title: "Honkai Star Rail - Présentation",
        sections: [
            { id: 'videos', name: 'Présentation du Jeu', text: "Cette page présente le jeu Honkai Star Rail. La section principale présente la bande-annonce de la Version trois point sept intitulée Vers ce demain d'autrefois. La page présente également une nouvelle vidéo de Honkai Star Rail." },
            { id: 'videos', name: 'Déroulement de Session', text: "La section Déroulement d'une Session de Jeu explique les quatre étapes. Première étape : Connexion et Quotidiens avec les récompenses de connexion. Deuxième étape : Quêtes d'Histoire pour découvrir de nouvelles zones. Troisième étape : Combats et Exploration pour affronter des ennemis. Quatrième étape : Collection et Amélioration avec le système gacha. Le jeu est un R P G au tour par tour développé par Ho Yoverse." }
        ]
    },
    bugreport: {
        title: "Rapport de Bug - Fonctionnalité",
        sections: [
            { id: null, name: 'Présentation', text: "La page Rapport de Bug permet de vérifier les erreurs du portfolio. Cette page est une fonctionnalité unique qui analyse automatiquement toutes les pages du portfolio." },
            { id: null, name: 'État du Site', text: "La section État du Site affiche l'état des fonctionnalités. Les thèmes, la musique, les animations et le menu sont vérifiés. Les éléments sont affichés avec des icônes vertes pour OK ou rouges pour introuvable." },
            { id: null, name: 'Journal des Erreurs', text: "La section Journal des Erreurs affiche les erreurs détectées en temps réel. Les erreurs sont affichées en rouge avec une croix. Les avertissements sont affichés en orange. Si aucune erreur n'est détectée, un message vert s'affiche." },
            { id: null, name: 'Succès', text: "La section Succès affiche les éléments qui fonctionnent correctement. Les succès sont affichés en vert avec un check. Tous les éléments vérifiés et fonctionnels sont listés dans cette section." },
            { id: null, name: 'Scan Complet', text: "Le bouton Lancer le Scan Complet analyse toutes les pages automatiquement. Le scan détecte les images non chargées, vérifie les éléments importants comme les boutons, et vérifie les vidéos YouTube accessibles. Les erreurs sont listées avec leur localisation." },
            { id: null, name: 'Copier le Rapport', text: "Le bouton Copier le Rapport permet de copier tout le rapport dans le presse-papiers. Vous pouvez copier le rapport et l'envoyer à Cédric pour correction. Le rapport inclut l'état du site, les erreurs, les succès, la structure du portfolio, et les vidéos YouTube détectées." }
        ]
    }
};

// Variables IA
let iaSynth = window.speechSynthesis;
let iaUtterance = null;
let iaPlaying = false;
let iaWidgetOpen = false;
let currentSectionIndex = 0;

// 📊 Variables pour les statistiques
let iaStartTime = 0;
let iaElapsedTime = 0;
let iaTimerInterval = null;

// Créer un élément IA accessible
function createElement(tag, options = {}) {
    const element = document.createElement(tag);
    if (options.className) element.className = options.className;
    if (options.id) element.id = options.id;
    if (options.text) element.textContent = options.text;
    if (options.attrs) {
        Object.keys(options.attrs).forEach((key) => {
            element.setAttribute(key, options.attrs[key]);
        });
    }
    return element;
}

// Créer le widget IA
function createIAWidget() {
    const btn = createElement('button', { className: 'ia-float-btn', text: '🤖' });
    btn.title = 'Assistante IA';
    btn.addEventListener('click', toggleIAWidget);
    document.body.appendChild(btn);

    const panel = createElement('div', { className: 'ia-float-panel', id: 'ia-float-panel' });

    const header = createElement('div', { className: 'ia-panel-header' });
    const headerTitle = createElement('span', { text: '🤖 Assistante IA' });
    const closeButton = createElement('button', { className: 'ia-panel-close', text: '✕', attrs: { type: 'button', 'aria-label': 'Fermer l\'assistante IA' } });
    closeButton.addEventListener('click', toggleIAWidget);
    header.appendChild(headerTitle);
    header.appendChild(closeButton);

    const content = createElement('div', { className: 'ia-panel-content' });
    const pageTitle = createElement('div', { id: 'ia-page-title', className: 'ia-page-title' });

    const statistics = createElement('div', { id: 'ia-statistics', className: 'ia-statistics' });
    const statRow1 = createElement('div', { className: 'ia-stat-row' });
    statRow1.appendChild(createElement('span', { text: '⏱️ Temps écoulé : ' }));
    statRow1.appendChild(createElement('span', { id: 'ia-time-elapsed', text: '0:00' }));
    statRow1.appendChild(createElement('span', { text: '⏱️ Temps restant : ' }));
    statRow1.appendChild(createElement('span', { id: 'ia-time-remaining', text: '--:--' }));

    const statRow2 = createElement('div', { className: 'ia-stat-row' });
    statRow2.appendChild(createElement('span', { text: '📖 Sections lues : ' }));
    statRow2.appendChild(createElement('span', { id: 'ia-sections-read', text: '0/0' }));
    statRow2.appendChild(createElement('span', { text: '📊 Progression : ' }));
    statRow2.appendChild(createElement('span', { id: 'ia-progress-percent', text: '0%' }));

    statistics.appendChild(statRow1);
    statistics.appendChild(statRow2);

    const progressBarContainer = createElement('div', { id: 'ia-progress-bar-container', className: 'ia-progress-bar-container' });
    const progressBar = createElement('div', { id: 'ia-progress-bar', className: 'ia-progress-bar' });
    progressBarContainer.appendChild(progressBar);

    const progressText = createElement('div', { id: 'ia-progress-text', className: 'ia-progress-text', text: 'Section 0/0 - 0%' });
    const sectionsList = createElement('div', { id: 'ia-sections-list', className: 'ia-sections-list' });

    content.appendChild(pageTitle);
    content.appendChild(statistics);
    content.appendChild(progressBarContainer);
    content.appendChild(progressText);
    content.appendChild(sectionsList);

    const controls = createElement('div', { className: 'ia-panel-controls' });
    const playBtn = createElement('button', { id: 'ia-play-btn', text: '▶️', attrs: { type: 'button' } });
    const pauseBtn = createElement('button', { id: 'ia-pause-btn', text: '⏸️', attrs: { type: 'button', disabled: 'disabled' } });
    const stopBtn = createElement('button', { id: 'ia-stop-btn', text: '⏹️', attrs: { type: 'button', disabled: 'disabled' } });

    playBtn.addEventListener('click', playIA);
    pauseBtn.addEventListener('click', pauseIA);
    stopBtn.addEventListener('click', stopIA);

    controls.appendChild(playBtn);
    controls.appendChild(pauseBtn);
    controls.appendChild(stopBtn);

    panel.appendChild(header);
    panel.appendChild(content);
    panel.appendChild(controls);

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
            loadCurrentPageContent();
        }
    }
}

// Charger le contenu de la page actuelle
function loadCurrentPageContent() {
    const path = window.location.pathname;
    let pageKey = 'index';
    
    if (path.includes('videos.html')) pageKey = 'videos';
    else if (path.includes('wuthering-waves.html')) pageKey = 'wuthering';
    else if (path.includes('honkai-star-rail.html')) pageKey = 'hsr';
    else if (path.includes('bug-report.html')) pageKey = 'bugreport';
    
    const content = iaContent[pageKey];
    const titleEl = document.getElementById('ia-page-title');
    const sectionsEl = document.getElementById('ia-sections-list');
    
    if (titleEl) {
        titleEl.textContent = content.title;
    }
    
    // 🎯 METTRE À JOUR LA BARRE DE PROGRESSION
    updateProgressBar(content.sections.length);

    if (sectionsEl) {
        sectionsEl.textContent = '';

        const helperNote = createElement('div', {
            className: 'ia-section-helper',
            text: '💡 Clique sur une section pour y aller directement'
        });
        helperNote.style.fontSize = '0.8rem';
        helperNote.style.color = 'var(--couleur-texte-sombre)';
        helperNote.style.marginBottom = '0.5rem';
        helperNote.style.fontStyle = 'italic';
        sectionsEl.appendChild(helperNote);

        content.sections.forEach((section, index) => {
            let statusIcon = '⬜';
            let statusClass = '';

            if (index < currentSectionIndex) {
                statusIcon = '✅';
                statusClass = 'finished';
            } else if (index === currentSectionIndex) {
                statusIcon = '🟢';
                statusClass = 'active';
            }

            const sectionItem = createElement('div', { className: 'ia-section-item ' + statusClass });
            sectionItem.setAttribute('data-index', String(index));
            sectionItem.setAttribute('data-section-id', section.id || '');
            sectionItem.addEventListener('click', function () {
                goToSection(index);
            });

            const statusSpan = createElement('span', { className: 'ia-section-status', text: statusIcon });
            const title = createElement('strong', { text: section.name });
            const description = createElement('p', { text: section.text });

            sectionItem.appendChild(statusSpan);
            sectionItem.appendChild(title);
            sectionItem.appendChild(description);
            sectionsEl.appendChild(sectionItem);
        });
    }
}

// Aller à une section
function goToSection(index) {
    console.log('🖱️ goToSection called, index:', index);

    currentSectionIndex = index;
    updateSectionsDisplay();
    updateProgressBarDisplay(); // 🎯 METTRE À JOUR LA BARRE DE PROGRESSION
    scrollToSection();

    // 🎯 PAUSER L'IA QUAND ON CLIQUE MANUELLEMENT
    if (iaPlaying) {
        iaSynth.pause();
        iaPlaying = false;
        document.getElementById('ia-play-btn').disabled = false;
        document.getElementById('ia-pause-btn').disabled = true;
        console.log('⏸️ IA paused (manual navigation)');
    }
}

// 🎯 METTRE À JOUR LA BARRE DE PROGRESSION
function updateProgressBar(totalSections) {
    updateProgressBarDisplay();
}

function updateProgressBarDisplay() {
    const progressText = document.getElementById('ia-progress-text');
    const progressBar = document.getElementById('ia-progress-bar');
    
    if (progressText && progressBar) {
        // Get current page content
        const path = window.location.pathname;
        let pageKey = 'index';

        if (path.includes('videos.html')) pageKey = 'videos';
        else if (path.includes('wuthering-waves.html')) pageKey = 'wuthering';
        else if (path.includes('honkai-star-rail.html')) pageKey = 'hsr';
        else if (path.includes('bug-report.html')) pageKey = 'bugreport';

        const content = iaContent[pageKey];
        const totalSections = content.sections.length;
        const progress = totalSections > 0 ? Math.round(((currentSectionIndex + 1) / totalSections) * 100) : 0;

        progressText.textContent = `Section ${currentSectionIndex + 1}/${totalSections} - ${progress}%`;
        progressBar.style.width = `${progress}%`;
    }
}

// 📊 METTRE À JOUR LES STATISTIQUES
function updateStatistics() {
    const timeElapsedEl = document.getElementById('ia-time-elapsed');
    const timeRemainingEl = document.getElementById('ia-time-remaining');
    const sectionsReadEl = document.getElementById('ia-sections-read');
    const progressPercentEl = document.getElementById('ia-progress-percent');
    
    if (timeElapsedEl && timeRemainingEl && sectionsReadEl && progressPercentEl) {
        // Calculate elapsed time
        iaElapsedTime = Math.floor((Date.now() - iaStartTime) / 1000);
        
        // Get current page content
        const path = window.location.pathname;
        let pageKey = 'index';

        if (path.includes('videos.html')) pageKey = 'videos';
        else if (path.includes('wuthering-waves.html')) pageKey = 'wuthering';
        else if (path.includes('honkai-star-rail.html')) pageKey = 'hsr';
        else if (path.includes('bug-report.html')) pageKey = 'bugreport';

        const content = iaContent[pageKey];
        const totalSections = content.sections.length;
        const progress = totalSections > 0 ? Math.round(((currentSectionIndex + 1) / totalSections) * 100) : 0;
        
        // Estimate remaining time based on progress
        let timeRemaining = 0;
        if (progress > 0 && progress < 100) {
            timeRemaining = Math.floor((iaElapsedTime / progress) * (100 - progress));
        }
        
        // Format time as MM:SS
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        };
        
        timeElapsedEl.textContent = formatTime(iaElapsedTime);
        timeRemainingEl.textContent = progress === 100 ? 'Terminé' : formatTime(timeRemaining);
        sectionsReadEl.textContent = `${currentSectionIndex + 1}/${totalSections}`;
        progressPercentEl.textContent = `${progress}%`;
    }
}

// Mettre à jour l'affichage des sections
function updateSectionsDisplay() {
    const items = document.querySelectorAll('.ia-section-item');
    items.forEach((item, index) => {
        if (index === currentSectionIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Scroll vers la section
function scrollToSection() {
    console.log('📜 scrollToSection called, index:', currentSectionIndex);
    
    const path = window.location.pathname;
    let pageKey = 'index';

    if (path.includes('videos.html')) pageKey = 'videos';
    else if (path.includes('wuthering-waves.html')) pageKey = 'wuthering';
    else if (path.includes('honkai-star-rail.html')) pageKey = 'hsr';
    else if (path.includes('bug-report.html')) pageKey = 'bugreport';

    const content = iaContent[pageKey];
    const section = content.sections[currentSectionIndex];

    console.log('📄 PageKey:', pageKey, 'Section:', section);

    // Retirer highlight de toutes les sections
    document.querySelectorAll('.section, .hero, header.en-tete').forEach(el => {
        el.classList.remove('ia-highlight');
    });

    if (section && section.id) {
        const element = document.getElementById(section.id);
        if (element) {
            console.log('✅ Found element by ID:', section.id);
            // Ajouter highlight
            element.classList.add('ia-highlight');

            // Scroll
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            console.warn('⚠️ Element not found:', section.id);
        }
    } else {
        // 🎯 PAS D'ID - SCROLL PROGRESSIF BASÉ SUR L'INDEX
        console.log('📍 No ID, using progressive scroll');
        const sections = document.querySelectorAll('.section, .hero');
        if (sections.length > currentSectionIndex) {
            const element = sections[currentSectionIndex];
            element.classList.add('ia-highlight');
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            console.log('✅ Scrolled to section index:', currentSectionIndex);
        }
    }
}

// Lancer l'IA
function playIA() {
    console.log('▶️ playIA called');

    // Stop any current playback first
    if (iaSynth.speaking) {
        iaSynth.cancel();
    }
    
    // Reset statistics timer
    if (iaTimerInterval) {
        clearInterval(iaTimerInterval);
    }
    iaStartTime = Date.now();
    iaElapsedTime = 0;

    // Reset to beginning
    currentSectionIndex = 0;
    iaPlaying = true;

    // Update button states
    document.getElementById('ia-play-btn').disabled = true;
    document.getElementById('ia-pause-btn').disabled = false;
    document.getElementById('ia-stop-btn').disabled = false;
    
    // 📊 START STATISTICS TIMER
    iaTimerInterval = setInterval(updateStatistics, 1000);

    // Get current page content
    const path = window.location.pathname;
    let pageKey = 'index';

    if (path.includes('videos.html')) pageKey = 'videos';
    else if (path.includes('wuthering-waves.html')) pageKey = 'wuthering';
    else if (path.includes('honkai-star-rail.html')) pageKey = 'hsr';
    else if (path.includes('bug-report.html')) pageKey = 'bugreport';

    const content = iaContent[pageKey];
    
    console.log('📄 Page:', pageKey, 'Sections:', content.sections.length);
    
    // 🎯 SCROLL TO TOP FIRST
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 🎯 RESET LA BARRE DE PROGRESSION À 0%
    const progressText = document.getElementById('ia-progress-text');
    const progressBar = document.getElementById('ia-progress-bar');
    if (progressText && progressBar) {
        progressText.textContent = 'Section 0/0 - 0%';
        progressBar.style.width = '0%';
    }

    // Update display to show first section
    updateSectionsDisplay();
    
    // Small delay to ensure scroll completes
    setTimeout(() => {
        // Build text with markers for each section
        const text = content.sections.map(s => s.text).join(' ');
        
        iaUtterance = new SpeechSynthesisUtterance(text);
        iaUtterance.lang = 'fr-FR';
        iaUtterance.rate = 0.75; // Vitesse naturelle et claire
        iaUtterance.pitch = 1.15; // Légèrement plus haut = plus engageant
        iaUtterance.volume = 0.9; // Moins agressif

        // Get French voice - Priorité aux voix féminines
        const voices = iaSynth.getVoices();
        const frenchVoice = voices.find(voice =>
            voice.lang === 'fr-FR' &&
            (voice.name.includes('Amélie') ||
             voice.name.includes('female') ||
             voice.name.includes('Claire') ||
             voice.name.includes('Hortense') ||
             voice.name.includes('Google'))
        ) || voices.find(voice => voice.lang === 'fr-FR');

        if (frenchVoice) {
            iaUtterance.voice = frenchVoice;
            console.log('✅ French voice:', frenchVoice.name);
        }

        // 🎯 INITIALISER LA BARRE DE PROGRESSION
        updateProgressBar(content.sections.length);

        // 🎯 REAL-TIME SYNCHRONIZATION
        let lastUpdateTime = 0;
        const updateThreshold = 200; // Minimum ms between updates (PLUS RAPIDE)

        iaUtterance.onboundary = (event) => {
            const now = Date.now();
            if (now - lastUpdateTime < updateThreshold) return;
            lastUpdateTime = now;

            console.log('🎯 onboundary triggered, charIndex:', event.charIndex);

            // 🎯 METTRE À JOUR LA BARRE DE PROGRESSION EN TEMPS RÉEL
            const totalChars = text.length;
            const currentProgress = totalChars > 0 ? Math.round((event.charIndex / totalChars) * 100) : 0;
            
            if (progressBar) {
                progressBar.style.width = `${currentProgress}%`;
            }
            if (progressText) {
                progressText.textContent = `Progression : ${currentProgress}%`;
            }

            // Calculate which section we're in based on character position
            let charCount = 0;
            for (let i = 0; i < content.sections.length; i++) {
                charCount += content.sections[i].text.length;
                if (event.charIndex < charCount) {
                    if (currentSectionIndex !== i) {
                        currentSectionIndex = i;
                        console.log('📍 Section:', i, content.sections[i].name);
                        updateSectionsDisplay(); // Highlight in panel
                        scrollToSection(); // Highlight and scroll page
                    }
                    break;
                }
            }
        };

        iaUtterance.onend = () => {
            console.log('✅ IA finished');
            currentSectionIndex = content.sections.length - 1;
            updateSectionsDisplay();
            
            // 📊 STOP STATISTICS TIMER
            if (iaTimerInterval) {
                clearInterval(iaTimerInterval);
                iaTimerInterval = null;
            }
            
            // 🎯 METTRE LA BARRE À 100%
            if (progressBar) {
                progressBar.style.width = '100%';
            }
            if (progressText) {
                progressText.textContent = `Section ${content.sections.length}/${content.sections.length} - 100%`;
            }
            
            // 📊 UPDATE FINAL STATISTICS
            updateStatistics();
            
            iaPlaying = false;
            document.getElementById('ia-play-btn').disabled = false;
            document.getElementById('ia-pause-btn').disabled = true;
            document.getElementById('ia-stop-btn').disabled = true;
        };

        iaUtterance.onerror = (event) => {
            console.error('❌ IA error:', event);
            iaPlaying = false;
            document.getElementById('ia-play-btn').disabled = false;
        };

        console.log('🔊 Starting speech...');
        iaSynth.speak(iaUtterance);
    }, 300);
}

// Pause
function pauseIA() {
    console.log('⏸️ pauseIA called');
    
    if (iaSynth.speaking) {
        iaSynth.pause();
        iaPlaying = false;
        document.getElementById('ia-play-btn').disabled = false;
        document.getElementById('ia-pause-btn').disabled = true;
        console.log('⏸️ IA paused');
    }
}

// Stop
function stopIA() {
    console.log('⏹️ stopIA called');
    
    iaSynth.cancel();
    iaPlaying = false;
    currentSectionIndex = 0;

    // Remove highlights
    document.querySelectorAll('.section, .hero, header.en-tete').forEach(el => {
        el.classList.remove('ia-highlight');
    });

    updateSectionsDisplay();

    document.getElementById('ia-play-btn').disabled = false;
    document.getElementById('ia-pause-btn').disabled = true;
    document.getElementById('ia-stop-btn').disabled = true;
    
    console.log('⏹️ IA stopped');
}

// Initialiser l'IA au chargement
document.addEventListener('DOMContentLoaded', () => {
    createIAWidget();
    console.log('✅ Assistante IA initialisée');
});

// =========================================
// 8. SYSTÈME DE COMMENTAIRES & AVIS
// =========================================

(function () {
    const conteneurPostes = document.querySelector('.choix-postes');
    if (!conteneurPostes) return;

    const POSTES = {
        'administrateur': { emoji: '🪽💻👑', label: 'Administrateur du site', couleur: '#34d399' },
        'direction':      { emoji: '👑',  label: 'Direction',       couleur: '#ffd700' },
        'enseignement':   { emoji: '📚',  label: 'Enseignement',    couleur: '#3b82f6' },
        'sante':          { emoji: '💉',  label: 'Santé',           couleur: '#ef4444' },
        'social':         { emoji: '🤲',  label: 'Social',          couleur: '#ec4899' },
        'vie-scolaire':   { emoji: '🔔',  label: 'Vie scolaire',    couleur: '#f97316' },
        'sport':          { emoji: '🏃',  label: 'Sport',           couleur: '#22c55e' },
        'technique':      { emoji: '🔧',  label: 'Technique',       couleur: '#a16207' },
        'numerique':      { emoji: '💻',  label: 'Numérique',       couleur: '#06b6d4' }
    };

    let posteChoisi = null;
    let noteActuelle = 0;

    const formulaire = document.querySelector('.formulaire-avis');
    const etoiles = Array.from(document.querySelectorAll('.etoile'));
    const champPseudo = document.getElementById('avis-pseudo');
    const champTexte = document.getElementById('avis-texte');
    const boutonEnvoyer = document.getElementById('avis-envoyer');
    const archive = document.getElementById('archive-avis');

    if (!formulaire || !archive || !boutonEnvoyer || etoiles.length === 0) return;

    const clePage = 'avis-' + (location.pathname.split('/').pop() || 'index.html');

    function chargerAvis() {
        try {
            return JSON.parse(localStorage.getItem(clePage) || '[]');
        } catch (error) {
            return [];
        }
    }

    function sauvegarderAvis(avis) {
        try {
            localStorage.setItem(clePage, JSON.stringify(avis));
        } catch (error) {
            console.warn('Impossible de sauvegarder les avis :', error);
        }
    }

    function allumerEtoiles(n) {
        etoiles.forEach((etoile) => {
            const note = Number(etoile.dataset.note);
            etoile.classList.toggle('allumee', note <= n);
        });
    }

    conteneurPostes.addEventListener('click', (e) => {
        const bloc = e.target.closest('.poste-bloc');
        if (!bloc) return;

        document.querySelectorAll('.poste-bloc').forEach((b) => b.classList.remove('choisi'));
        bloc.classList.add('choisi');
        posteChoisi = bloc.dataset.poste;

        if (POSTES[posteChoisi]) {
            formulaire.style.borderColor = POSTES[posteChoisi].couleur;
        }
    });

    etoiles.forEach((etoile) => {
        etoile.addEventListener('mouseenter', () => {
            allumerEtoiles(Number(etoile.dataset.note));
        });

        etoile.addEventListener('click', () => {
            noteActuelle = Number(etoile.dataset.note);
            allumerEtoiles(noteActuelle);
        });
    });

    etoiles[0].parentElement.addEventListener('mouseleave', () => {
        allumerEtoiles(noteActuelle);
    });

    function escapeHTML(texte) {
        const div = document.createElement('div');
        div.textContent = texte;
        return div.innerHTML;
    }

    function renderEtoiles(note) {
        const couleurs = ['mini-0', 'mini-1', 'mini-2', 'mini-3', 'mini-4', 'mini-5'];
        const morceaux = [];

        for (let i = 1; i <= 5; i++) {
            const classe = i <= note ? `mini-${i}` : 'mini-0';
            morceaux.push(`<span class="${classe}">★</span>`);
        }

        return morceaux.join('');
    }

    function afficherAvis() {
        const avis = chargerAvis();

        if (!avis.length) {
            archive.innerHTML = '<p class="carte-texte">Aucun avis pour le moment. Soyez le premier à donner votre opinion !</p>';
            return;
        }

        archive.innerHTML = avis.slice().reverse().map((item) => {
            const poste = POSTES[item.poste] || POSTES['direction'];
            const pseudo = item.pseudo ? escapeHTML(item.pseudo) : 'Anonyme';
            const texte = escapeHTML(item.texte);
            const date = new Date(item.date).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });

            return `
                <article class="carte-avis" style="--couleur-poste:${poste.couleur};">
                    <div class="carte-entete">
                        <span>${poste.emoji} ${poste.label}</span>
                        <span class="carte-date">${date}</span>
                    </div>
                    <div class="carte-etoiles">${renderEtoiles(item.note)}</div>
                    <div class="carte-texte"><strong>${pseudo}</strong> : ${texte}</div>
                </article>
            `;
        }).join('');
    }

    function validerEtEnvoyer() {
        const pseudo = champPseudo.value.trim();
        const texte = champTexte.value.trim();

        if (!posteChoisi) {
            alert('Choisissez un poste avant d’envoyer votre avis.');
            return;
        }

        if (noteActuelle === 0) {
            alert('Notez le site avant d’envoyer votre avis.');
            return;
        }

        if (!texte) {
            alert('Écrivez un commentaire avant d’envoyer votre avis.');
            return;
        }

        const avis = chargerAvis();
        const nouvelAvis = {
            poste: posteChoisi,
            pseudo: pseudo || 'Anonyme',
            texte: texte,
            note: noteActuelle,
            date: new Date().toISOString()
        };

        avis.push(nouvelAvis);
        sauvegarderAvis(avis);

        champPseudo.value = '';
        champTexte.value = '';
        noteActuelle = 0;
        posteChoisi = null;
        document.querySelectorAll('.poste-bloc').forEach((b) => b.classList.remove('choisi'));
        formulaire.style.borderColor = 'var(--couleur-emeraude)';
        allumerEtoiles(0);
        afficherAvis();
    }

    boutonEnvoyer.addEventListener('click', validerEtEnvoyer);
    afficherAvis();
})();
