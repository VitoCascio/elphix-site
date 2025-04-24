document.addEventListener('DOMContentLoaded', () => {
    // Variables globales
    const landing = document.getElementById('landing');
    const sideMenu = document.getElementById('side-menu');
    const mainContent = document.getElementById('main-content');
    const enterButton = document.getElementById('enter-button');
    const fullscreenButton = document.getElementById('fullscreen-button');
    const menuItems = document.querySelectorAll('.menu-item');
    let currentSection = null;

    // Liste ordonnée des sections
    const sections = ['section1', 'section2', 'section3', 'section4', 'section5', 'section6', 'section7'];

    // Fonction de redimensionnement
    function updateScale() {
        const scale = Math.min(window.innerWidth/1440, window.innerHeight/900);
        document.documentElement.style.setProperty('--scale', scale);
    }

    // Appliquer le redimensionnement initial et sur chaque changement de taille
    window.addEventListener('resize', () => {
        requestAnimationFrame(updateScale);
    });
    window.addEventListener('orientationchange', updateScale);
    window.addEventListener('fullscreenchange', updateScale);
    window.addEventListener('load', updateScale);

    // Animation d'entrée du menu
    function animateMenuItems() {
        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 150);
        });
    }

    // Gestion du plein écran
    fullscreenButton.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            fullscreenButton.textContent = '⛶';
        } else {
            document.exitFullscreen();
            fullscreenButton.textContent = '⛶';
        }
    });

    // Retour à l'accueil via le logo
    const logoWrapper = document.querySelector('#side-menu .logo');
    logoWrapper.addEventListener('click', () => {
        // Cacher toutes les sections avec transition
        document.querySelectorAll('.section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateX(-100%) scale(0.95)';
        });

        // Cacher le menu et le contenu principal
        sideMenu.classList.remove('visible');
        
        setTimeout(() => {
            document.querySelectorAll('.section').forEach(section => {
                section.style.display = 'none';
                section.classList.remove('active');
            });
            
            sideMenu.classList.add('hidden');
            mainContent.classList.add('hidden');
            fullscreenButton.classList.add('hidden');

            // Réafficher l'intro avec animation
            landing.classList.remove('hidden');
            landing.style.display = 'flex';
            requestAnimationFrame(() => {
                landing.style.opacity = '1';
                landing.style.transform = 'translateX(0)';
            });
        }, 800);

        // Réinitialiser les classes active du menu
        menuItems.forEach(item => item.classList.remove('active'));

        // Réinitialiser la section courante
        currentSection = null;
    });

    // Fonction pour créer les boutons de navigation
    function createNavButtons(section) {
        const navButtons = document.createElement('div');
        navButtons.className = 'nav-buttons';

        const prevButton = document.createElement('button');
        prevButton.className = 'nav-button prev-button';
        prevButton.innerHTML = '← Précédent';

        const nextButton = document.createElement('button');
        nextButton.className = 'nav-button next-button';
        nextButton.innerHTML = 'Suivant →';

        navButtons.appendChild(prevButton);
        navButtons.appendChild(nextButton);

        // Gestion de la visibilité des boutons
        const currentIndex = sections.indexOf(section.id);
        
        if (currentIndex === 0) {
            prevButton.disabled = true;
        }
        
        if (currentIndex === sections.length - 1) {
            nextButton.style.display = 'none';
        }

        // Événements des boutons
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                showSection(sections[currentIndex - 1]);
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentIndex < sections.length - 1) {
                showSection(sections[currentIndex + 1]);
            }
        });

        return navButtons;
    }

    // Animation d'entrée dans l'e-book
    enterButton.addEventListener('click', () => {
        // Cacher l'intro avec animation
        landing.style.opacity = '0';
        landing.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
            // Cacher complètement l'intro
            landing.style.display = 'none';
            landing.classList.add('hidden');
            
            // Afficher le menu et le contenu
            sideMenu.classList.remove('hidden');
            mainContent.classList.remove('hidden');
            fullscreenButton.classList.remove('hidden');
            
            // Animer l'apparition du menu
            requestAnimationFrame(() => {
                sideMenu.classList.add('visible');
                animateMenuItems();
            });
            
            // Afficher la première section
            setTimeout(() => {
                showSection('section1');
            }, 400);
        }, 800);
    });

    // Navigation entre les sections
    function showSection(sectionId) {
        const nextElement = document.getElementById(sectionId);
        
        // Supprimer les anciens boutons de navigation s'ils existent
        const oldNavButtons = document.querySelector('.nav-buttons');
        if (oldNavButtons) {
            oldNavButtons.remove();
        }

        if (currentSection) {
            const currentElement = document.getElementById(currentSection);
            currentElement.style.opacity = '0';
            currentElement.style.transform = 'translateX(-100%) scale(0.95)';
            
            setTimeout(() => {
                currentElement.style.display = 'none';
                currentElement.classList.remove('active');
                
                // Afficher la nouvelle section
                nextElement.style.display = 'flex';
                nextElement.style.transform = 'translateX(100%) scale(0.95)';
                nextElement.style.opacity = '0';
                
                // Ajouter les boutons de navigation
                const navButtons = createNavButtons(nextElement);
                nextElement.appendChild(navButtons);
                
                requestAnimationFrame(() => {
                    nextElement.classList.add('active');
                    nextElement.style.opacity = '1';
                    nextElement.style.transform = 'translateX(0) scale(1)';
                    animateSectionContent(nextElement);
                });
            }, 800);
        } else {
            nextElement.style.display = 'flex';
            nextElement.style.transform = 'translateX(100%) scale(0.95)';
            nextElement.style.opacity = '0';
            
            // Ajouter les boutons de navigation
            const navButtons = createNavButtons(nextElement);
            nextElement.appendChild(navButtons);
            
            requestAnimationFrame(() => {
                nextElement.classList.add('active');
                nextElement.style.opacity = '1';
                nextElement.style.transform = 'translateX(0) scale(1)';
                animateSectionContent(nextElement);
            });
        }

        currentSection = sectionId;

        // Mise à jour du menu
        menuItems.forEach(item => {
            if (item.getAttribute('href') === `#${sectionId}`) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Animation du contenu des sections
    function animateSectionContent(section) {
        const elements = section.querySelectorAll('.section-content > *, .feature-item, .advantage-item, .content-item, .case');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            }, index * 150);
        });
    }

    // Gestion des clics sur le menu
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });

    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (currentSection && !landing.classList.contains('active')) {
            const sections = ['section1', 'section2', 'section3', 'section4', 'section5', 'section6', 'section7'];
            const currentIndex = sections.indexOf(currentSection);

            if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && currentIndex < sections.length - 1) {
                showSection(sections[currentIndex + 1]);
            } else if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && currentIndex > 0) {
                showSection(sections[currentIndex - 1]);
            }
        }
    });

    // Gestion du formulaire de contact
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Ici, ajoutez la logique d'envoi du formulaire
            alert('Message envoyé !');
        });
    }

    // Configuration vCard
    const vCardData = `BEGIN:VCARD
VERSION:3.0
N:Marcheix;Thomas;;;
FN:Thomas Marcheix
ORG:Elphix
TITLE:Consultant en communication digitale
TEL;TYPE=CELL:0616921697
EMAIL:contact@elphix.com
URL:https://elphix.com
URL;TYPE=LinkedIn:https://www.linkedin.com/in/thomas-marcheix/
END:VCARD`;

    // Attendre que le DOM soit chargé pour générer le QR Code
    window.addEventListener('load', () => {
        const qrCodeElement = document.getElementById('qrCode');
        if (qrCodeElement && window.QRCode) {
            new QRCode(qrCodeElement, {
                text: vCardData,
                width: 300,
                height: 300,
                colorDark: '#1C1F26',
                colorLight: '#FFFFFF',
                correctLevel: QRCode.CorrectLevel.H
            });

            // Gestion du téléchargement de la vCard
            const downloadButton = document.getElementById('downloadVCard');
            if (downloadButton) {
                downloadButton.addEventListener('click', () => {
                    const blob = new Blob([vCardData], { type: 'text/vcard' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'thomas-marcheix.vcf';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                });
            }
        }
    });
});