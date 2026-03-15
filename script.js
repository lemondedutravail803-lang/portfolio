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

// Contenu de chaque page
const iaContent = {
    index: {
        title: "Page d'Accueil",
        sections: [
            { id: 'header', name: 'Header', text: "En haut, le logo Cédric AUGUSTO avec le menu de navigation." },
            { id: 'hero', name: 'Hero', text: "Présentation de Cédric comme Développeur Web en formation." },
            { id: 'about', name: 'À Propos', text: "Description de sa curiosité technique et son esprit d'apprentissage." },
            { id: 'competences', name: 'Compétences', text: "HTML, CSS et JavaScript sont présentés." },
            { id: 'soft-skills', name: 'Soft Skills', text: "Curiosité, Ponctualité, Communication, Organisation." },
            { id: 'projets', name: 'Projets', text: "Neuf projets sont présentés." },
            { id: 'ia', name: 'IA & LLM', text: "Intégration de l'intelligence artificielle." },
            { id: 'contact', name: 'Contact', text: "Formulaire pour envoyer un message." }
        ]
    },
    videos: {
        title: "Page Vidéos",
        sections: [
            { id: 'videos', name: 'Vidéos', text: "Présentation des vidéos de Honkai Star Rail." }
        ]
    },
    wuthering: {
        title: "Wuthering Waves",
        sections: [
            { id: 'videos', name: 'Vidéos', text: "Présentation du jeu Wuthering Waves." }
        ]
    },
    hsr: {
        title: "Honkai Star Rail",
        sections: [
            { id: 'videos', name: 'Vidéos', text: "Présentation du jeu Honkai Star Rail." }
        ]
    },
    bugreport: {
        title: "Rapport de Bug",
        sections: [
            { id: null, name: 'Rapport', text: "Vérification des erreurs du portfolio." }
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
        
        iaUtterance.pitch = 1.2;
        iaUtterance.rate = 0.9;
        iaUtterance.volume = 1;
        
        iaUtterance.onend = () => {
            stopIA();
        };
        
        iaSynth.speak(iaUtterance);
        iaPlaying = true;
        
        // Lancer le scroll progressif
        startAutoScroll();
    }
    
    document.getElementById('ia-play-btn').disabled = true;
    document.getElementById('ia-pause-btn').disabled = false;
    document.getElementById('ia-stop-btn').disabled = false;
}

// Scroll automatique progressif
let scrollInterval = null;

function startAutoScroll() {
    const path = window.location.pathname;
    let pageKey = 'index';
    
    if (path.includes('videos.html')) pageKey = 'videos';
    else if (path.includes('wuthering-waves.html')) pageKey = 'wuthering';
    else if (path.includes('honkai-star-rail.html')) pageKey = 'hsr';
    else if (path.includes('bug-report.html')) pageKey = 'bugreport';
    
    const content = iaContent[pageKey];
    const totalSections = content.sections.length;
    const duration = 40000; // 40 secondes
    const sectionDuration = duration / totalSections;
    
    currentSectionIndex = 0;
    updateSectionsDisplay();
    scrollToSection();
    
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
