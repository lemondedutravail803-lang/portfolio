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
// ASSISTANTE IA FLOTTANTE
// =========================================

// Contenu de chaque page (CONTENU COMPLET ET DÉTAILLÉ)
const iaContent = {
    index: {
        title: "Page d'Accueil - Portfolio Cédric AUGUSTO",
        sections: [
            { id: 'header', name: 'Header', text: "En haut de la page, vous trouvez le logo avec mon nom Cédric AUGUSTO. Le curseur clignote après le nom. Le menu de navigation est juste en dessous avec un bouton hamburger pour mobile. Le menu contient les liens : À propos, Compétences, Soft Skills, Projets, IA et LLM, Vidéos, Wuthering Waves, et Contact. Un bouton pour changer de thème est positionné en haut à droite." },
            { id: 'hero', name: 'Hero Section', text: "La section Hero est la première section visible. Elle affiche mon nom en grand avec une animation de lettres. Le sous-titre indique Développeur Web en formation. La description indique que je recherche un stage ou une alternance à partir de deux mille vingt-six. Deux boutons sont présents : Voir projets et Me contacter." },
            { id: 'about', name: 'À Propos', text: "La section À Propos décrit mon parcours. Je suis développeur web en formation, activement à la recherche d'un stage ou d'une alternance. Animé par une forte curiosité technique, je mets mon esprit d'apprentissage au service de la création d'interfaces propres, fonctionnelles et adaptées aux besoins utilisateurs. Les coordonnées sont affichées avec la ville et l'email." },
            { id: 'competences', name: 'Compétences Techniques', text: "La section Compétences Techniques présente trois logos : HTML cinq pour le markup web, CSS trois pour le style et la mise en page, et JavaScript pour l'interactivité. Chaque logo est affiché dans une carte avec un effet de ligne lumineuse." },
            { id: 'soft-skills', name: 'Soft Skills', text: "La section Soft Skills présente quatre qualités principales : Curiosité pour l'apprentissage continu, Ponctualité pour le respect des délais, Communication pour le travail en équipe, et Organisation et Autonomie pour la gestion de projet." },
            { id: 'projets', name: 'Projets', text: "La section Projets présente neuf projets réalisés. Le premier est un Jeu de Voiture créé avec Scratch. Le deuxième est le Site Portfolio en HTML et CSS. Le troisième est une Figurine créée lors d'un atelier Cap Sciences. Le quatrième est un Montage Vidéo. Le cinquième est OpenShot Vidéo. Le sixième est la Formation Konexio de sept semaines. Le septième est un Jeu dans l'Espace en HTML, CSS et JavaScript. Le huitième est Google Docs. Le neuvième est Google Sheets." },
            { id: 'ia', name: 'IA & LLM', text: "La section IA et LLM présente l'intégration de l'intelligence artificielle dans mes projets. Une image montre Qwen IA. Les tags indiquent Dev LLM, Prompt, et IA." },
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
            { id: 'videos', name: 'Déroulement d'une Session', text: "La section Déroulement d'une Session de Jeu explique les quatre étapes. Première étape : Connexion et Quotidiens avec les récompenses de connexion, missions quotidiennes et entraînements. Deuxième étape : Quêtes d'Histoire pour progresser dans le scénario principal. Troisième étape : Combats et Exploration des donjons. Quatrième étape : Collection et Amélioration avec le gacha pour nouveaux personnages." }
        ]
    },
    wuthering: {
        title: "Wuthering Waves - Présentation du Jeu",
        sections: [
            { id: 'videos', name: 'Histoire et Scénario', text: "Dans Wuthering Waves, vous incarnez un personnage masculin ou féminin qui se réveille dans un monde qu'il a connu auparavant, mais dont il a perdu la mémoire. Votre but principal est de retrouver vos souvenirs tout en explorant cet univers mystérieux. Au fil de l'aventure, vous découvrez l'histoire de nombreux personnages, chacun avec leur propre personnalité et leur passé." },
            { id: 'videos', name: 'Monde Ouvert', text: "Wuthering Waves est un jeu en monde ouvert où vous pouvez contrôler jusqu'à trois personnages simultanément. Vous explorez librement un vaste univers, battez des monstres et sauvez le monde. Vous découvrez la mémoire du personnage à travers les quêtes d'histoire." },
            { id: 'videos', name: 'Système de Combat', text: "Le système de combat est magnifique et spectaculaire. Les dégâts sont visibles avec des chiffres qui s'affichent sur les ennemis. Les animations sont somptueuses et chaque attaque est un véritable spectacle. Les combats sont rapides et efficaces pour détruire les monstres le plus vite possible." },
            { id: 'videos', name: 'Objectifs et Collection', text: "Les objectifs incluent les quêtes d'histoire, la collection de personnages via le système d'invocation gacha, la collection d'armes, les artefacts et équipements, et l'optimisation des statistiques des personnages pour avoir le plus de statistiques et détruire les monstres efficacement." },
            { id: 'videos', name: 'Vidéos Présentées', text: "Trois vidéos sont présentées sur cette page. La première est Dawn Arrives, les cinématiques d'histoire. La deuxième est une nouvelle vidéo de présentation. La troisième présente l'univers de Wuthering Waves." }
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

// Créer le widget IA
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
            <span>🤖 Assistante IA</span>
            <button class="ia-panel-close" onclick="toggleIAWidget()">✕</button>
        </div>
        <div class="ia-panel-content">
            <div id="ia-page-title" class="ia-page-title"></div>
            <div id="ia-sections-list" class="ia-sections-list"></div>
        </div>
        <div class="ia-panel-controls">
            <button onclick="playIA()" id="ia-play-btn">▶️</button>
            <button onclick="pauseIA()" id="ia-pause-btn" disabled>⏸️</button>
            <button onclick="stopIA()" id="ia-stop-btn" disabled>⏹️</button>
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
    
    if (sectionsEl) {
        sectionsEl.innerHTML = content.sections.map((section, index) => `
            <div class="ia-section-item ${index === currentSectionIndex ? 'active' : ''}" 
                 data-index="${index}" 
                 data-section-id="${section.id || ''}"
                 onclick="goToSection(${index})">
                <strong>${section.name}</strong>
                <p>${section.text}</p>
            </div>
        `).join('');
    }
}

// Aller à une section
function goToSection(index) {
    currentSectionIndex = index;
    updateSectionsDisplay();
    scrollToSection();
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
    const path = window.location.pathname;
    let pageKey = 'index';
    
    if (path.includes('videos.html')) pageKey = 'videos';
    else if (path.includes('wuthering-waves.html')) pageKey = 'wuthering';
    else if (path.includes('honkai-star-rail.html')) pageKey = 'hsr';
    else if (path.includes('bug-report.html')) pageKey = 'bugreport';
    
    const content = iaContent[pageKey];
    const section = content.sections[currentSectionIndex];
    
    if (section && section.id) {
        const element = document.getElementById(section.id);
        if (element) {
            // Retirer highlight de toutes les sections
            document.querySelectorAll('.section, .hero, header.en-tete').forEach(el => {
                el.classList.remove('ia-highlight');
            });
            
            // Ajouter highlight
            element.classList.add('ia-highlight');
            
            // Scroll
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Lancer l'IA
function playIA() {
    if (iaSynth.speaking) {
        iaSynth.resume();
        iaPlaying = true;
    } else {
        const path = window.location.pathname;
        let pageKey = 'index';
        
        if (path.includes('videos.html')) pageKey = 'videos';
        else if (path.includes('wuthering-waves.html')) pageKey = 'wuthering';
        else if (path.includes('honkai-star-rail.html')) pageKey = 'hsr';
        else if (path.includes('bug-report.html')) pageKey = 'bugreport';
        
        const content = iaContent[pageKey];
        const text = content.sections.map(s => s.text).join(' ');
        
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
        
        // PLUS LENT et PLUS CALME
        iaUtterance.pitch = 1.1; // Un peu plus féminin
        iaUtterance.rate = 0.75; // PLUS LENT (0.9 était trop rapide)
        iaUtterance.volume = 1;
        
        iaUtterance.onend = () => {
            stopIA();
        };
        
        iaSynth.speak(iaUtterance);
        iaPlaying = true;
        
        // Lancer le scroll progressif SYNCHRONISÉ
        startAutoScroll(content.sections.length);
    }
    
    document.getElementById('ia-play-btn').disabled = true;
    document.getElementById('ia-pause-btn').disabled = false;
    document.getElementById('ia-stop-btn').disabled = false;
}

// Scroll automatique progressif SYNCHRONISÉ
let scrollInterval = null;

function startAutoScroll(totalSections) {
    currentSectionIndex = 0;
    updateSectionsDisplay();
    scrollToSection();
    
    // Calculer la durée par section basée sur la longueur du texte
    // À 0.75 de vitesse, environ 10-12 secondes par section pour texte long
    const sectionDuration = 12000; // 12 secondes par section (PLUS LENT pour contenu détaillé)
    
    scrollInterval = setInterval(() => {
        currentSectionIndex++;
        updateSectionsDisplay();
        scrollToSection();
        
        if (currentSectionIndex >= totalSections) {
            stopAutoScroll();
        }
    }, sectionDuration);
}

function stopAutoScroll() {
    if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
}

// Pause
function pauseIA() {
    if (iaSynth.speaking) {
        iaSynth.pause();
        iaPlaying = false;
        stopAutoScroll();
        
        document.getElementById('ia-play-btn').disabled = false;
        document.getElementById('ia-pause-btn').disabled = true;
    }
}

// Stop
function stopIA() {
    iaSynth.cancel();
    iaPlaying = false;
    currentSectionIndex = 0;
    stopAutoScroll();
    
    // Retirer highlight
    document.querySelectorAll('.section, .hero, header.en-tete').forEach(el => {
        el.classList.remove('ia-highlight');
    });
    
    updateSectionsDisplay();
    
    document.getElementById('ia-play-btn').disabled = false;
    document.getElementById('ia-pause-btn').disabled = true;
    document.getElementById('ia-stop-btn').disabled = true;
}

// Initialiser l'IA au chargement
document.addEventListener('DOMContentLoaded', () => {
    createIAWidget();
    console.log('✅ Assistante IA initialisée');
});
