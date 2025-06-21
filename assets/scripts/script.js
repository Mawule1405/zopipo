// Variables globales
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Configuration EmailJS avec votre vraie clé publique
emailjs.init("iCQ38bTRrxdpPlpIn");

// Navigation mobile
navToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Fermer le menu mobile lors du clic sur un lien
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Effet de scroll sur la navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
});

// Navigation active selon la section
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Animation des éléments au scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.skill-category, .project-card, .highlight-card, .timeline-item');
    
    elements.forEach(element => {
        element.classList.add('fade-in');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animation spéciale pour les barres de compétences
                if (entry.target.classList.contains('skill-category')) {
                    const skillBars = entry.target.querySelectorAll('.skill-bar');
                    skillBars.forEach((bar, index) => {
                        setTimeout(() => {
                            bar.style.width = bar.getAttribute('data-level') + '%';
                        }, index * 200);
                    });
                }
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => {
        observer.observe(element);
    });
}

// Initialiser les animations
document.addEventListener('DOMContentLoaded', animateOnScroll);

// 📧 GESTION DU FORMULAIRE DE CONTACT - PALETTE BLEU/BLANC
const contactForm = document.getElementById('contactForm');
const submitBtn = contactForm?.querySelector('button[type="submit"]');

if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        console.log('📧 Tentative d\'envoi du formulaire...');
        
        // Animation du bouton - BLEU au lieu de gris
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        submitBtn.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)'; // Bleu au lieu de gris
        
        // Récupération et nettoyage des données
        const formData = new FormData(contactForm);
        
        const templateParams = {
            from_name: formData.get('name')?.trim() || '',
            from_email: formData.get('email')?.trim() || '',
            subject: formData.get('subject')?.trim() || '',
            message: formData.get('message')?.trim() || '',
            to_name: 'HELOU Komlan Mawulé',
            to_email: 'helkmawule@gmail.com',
            reply_to: formData.get('email')?.trim() || '',
            date_received: new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Africa/Libreville'
            })
        };
        
        console.log('📋 Paramètres préparés:', templateParams);
        
        // Validation complète
        const validation = validateFormData(templateParams);
        if (!validation.isValid) {
            console.log('❌ Validation échouée:', validation.message);
            showNotification(validation.message, 'error');
            resetButton();
            return;
        }
        
        try {
            console.log('🚀 Envoi via EmailJS...');
            
            const result = await emailjs.send(
                'service_zyh2y3j',
                'template_itnvqho',
                templateParams
            );
            
            console.log('✅ Succès:', result);
            
            // Message de succès
            showNotification(
                `✅ Merci ${templateParams.from_name} ! Votre message a été envoyé avec succès. Je vous répondrai rapidement.`, 
                'success'
            );
            
            // Reset du formulaire avec animation
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    contactForm.style.transform = 'scale(1)';
                }, 200);
            }, 500);
            
            // Analytics optionnel
            if (typeof gtag !== 'undefined') {
                gtag('event', 'contact_form_submit', {
                    event_category: 'Contact',
                    event_label: templateParams.subject
                });
            }
            
        } catch (error) {
            console.error('❌ Erreur complète:', error);
            console.error('Status:', error.status);
            console.error('Text:', error.text);
            console.error('Message:', error.message);
            
            handleEmailError(error);
        }
        
        resetButton();
        
        function resetButton() {
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 1500);
        }
    });
}

// Fonction de validation renforcée
function validateFormData(params) {
    console.log('🔍 Validation en cours...');
    
    // Vérification nom
    if (!params.from_name || params.from_name.length < 2) {
        return { isValid: false, message: 'Le nom doit contenir au moins 2 caractères' };
    }
    
    // Vérification email
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!params.from_email || !emailRegex.test(params.from_email)) {
        return { isValid: false, message: 'Adresse email invalide' };
    }
    
    // Vérification sujet
    if (!params.subject || params.subject.length < 3) {
        return { isValid: false, message: 'Le sujet doit contenir au moins 3 caractères' };
    }
    
    // Vérification message
    if (!params.message || params.message.length < 10) {
        return { isValid: false, message: 'Le message doit contenir au moins 10 caractères' };
    }
    
    // Vérification longueur max
    if (params.message.length > 5000) {
        return { isValid: false, message: 'Le message est trop long (max 5000 caractères)' };
    }
    
    // Anti-spam basique
    const spamWords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'free money'];
    const messageText = params.message.toLowerCase();
    if (spamWords.some(word => messageText.includes(word))) {
        return { isValid: false, message: 'Message détecté comme spam' };
    }
    
    console.log('✅ Validation réussie');
    return { isValid: true };
}

// Gestion des erreurs EmailJS
function handleEmailError(error) {
    let errorMessage = '';
    
    if (error.status === 400) {
        errorMessage = '🔧 Problème de configuration. Vérifiez vos informations.';
        console.error('🔍 Vérifiez: Service ID, Template ID, clé publique');
    } else if (error.status === 401) {
        errorMessage = '🔑 Problème d\'authentification EmailJS.';
    } else if (error.status === 403) {
        errorMessage = '🚫 Accès refusé. Service EmailJS indisponible.';
    } else if (error.status === 404) {
        errorMessage = '🔍 Service ou template EmailJS introuvable.';
    } else if (error.status === 429) {
        errorMessage = '⏱️ Trop de tentatives. Patientez quelques minutes.';
    } else if (error.message?.includes('fetch') || error.message?.includes('network')) {
        errorMessage = '🌐 Problème de connexion internet.';
    } else {
        errorMessage = '📧 Erreur technique. Contactez-moi directement : helkmawule@gmail.com';
    }
    
    showNotification(errorMessage, 'error');
    
    // Message de secours après 3 secondes
    setTimeout(() => {
        showNotification(
            '📞 Contact direct : +241 074 63 04 73 ou helkmawule@gmail.com', 
            'info'
        );
    }, 3000);
}

// Fonction pour afficher les notifications - PALETTE BLEU/BLANC
function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Icônes selon le type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type] || icons.info}"></i>
        <span>${message}</span>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Styles pour la notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        maxWidth: '400px',
        minWidth: '300px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        boxShadow: '0 10px 25px rgba(30, 58, 138, 0.3)', // Ombre bleue
        backdropFilter: 'blur(10px)'
    });
    
    // Couleurs selon le type - PALETTE BLEU/BLANC
    const colors = {
        success: 'linear-gradient(135deg, #10b981, #059669)', // Vert conservé pour succès
        error: 'linear-gradient(135deg, #ef4444, #dc2626)', // Rouge conservé pour erreur
        info: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)', // Bleu au lieu d'orange
        warning: 'linear-gradient(135deg, #3b82f6, #2563eb)' // Bleu clair pour warning
    };
    
    notification.style.background = colors[type] || colors.info;
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Gestion du bouton de fermeture
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            margin-left: auto;
            padding: 0.25rem;
            border-radius: 4px;
            transition: background-color 0.2s;
        `;
        
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        });
        
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; // Blanc transparent au lieu de noir
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.backgroundColor = 'transparent';
        });
    }
    
    // Supprimer automatiquement après 6 secondes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 6000);
}

// Smooth scroll pour les liens internes
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animation de typing pour le titre - COULEUR BLEUE
function typeWriter() {
    const text = "Développeur Full Stack & Futur Ingénieur en Conception Informatique";
    const element = document.querySelector('.hero-subtitle');
    let i = 0;
    
    if (!element) return;
    
    element.textContent = '';
    element.style.borderRight = '3px solid #1e3a8a'; // Bleu au lieu d'orange
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 50);
        } else {
            // Faire clignoter le curseur
            setInterval(() => {
                element.style.borderRightColor = element.style.borderRightColor === 'transparent' ? '#1e3a8a' : 'transparent';
            }, 750);
        }
    }
    
    // Démarrer l'animation après un délai
    setTimeout(type, 2000);
}

// Démarrer l'animation de typing au chargement
document.addEventListener('DOMContentLoaded', typeWriter);

// Effet parallax léger sur le hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
});

// Statistiques animées
function animateStats() {
    const stats = document.querySelectorAll('.stat-item strong');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const hasPlus = text.includes('+');
                const hasPercent = text.includes('%');
                const finalValue = parseInt(text);
                
                if (isNaN(finalValue)) return;
                
                let currentValue = 0;
                const increment = finalValue / 60;
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        let suffix = '';
                        if (hasPlus) suffix = '+';
                        if (hasPercent) suffix = '%';
                        target.textContent = finalValue + suffix;
                        clearInterval(timer);
                    } else {
                        target.textContent = Math.floor(currentValue);
                    }
                }, 30);
                
                observer.unobserve(target);
            }
        });
    });
    
    stats.forEach(stat => observer.observe(stat));
}

// Initialiser l'animation des statistiques
document.addEventListener('DOMContentLoaded', animateStats);

// Animation des particules de fond - COULEURS BLEUES
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    
    document.body.appendChild(particlesContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: ${Math.random() > 0.5 ? '#1e3a8a' : '#3b82f6'}; // Bleu au lieu d'orange
            border-radius: 50%;
            opacity: ${Math.random() * 0.5 + 0.2};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 5}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        
        particlesContainer.appendChild(particle);
    }
}

// Créer les particules au chargement
document.addEventListener('DOMContentLoaded', createParticles);

// Preloader amélioré - PALETTE BLEU/BLANC
function showPreloader() {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-logo">
                <span class="logo-text">HELOU</span>
                <span class="logo-subtext">Komlan Mawulé</span>
            </div>
            <div class="preloader-spinner">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
            </div>
            <p class="preloader-text">Chargement du portfolio...</p>
        </div>
    `;
    
    // Styles du preloader - FOND BLEU au lieu de gris
    Object.assign(preloader.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', // Bleu au lieu de gris
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '99999',
        transition: 'opacity 0.5s ease'
    });
    
    // Styles pour le contenu du preloader - COULEURS BLEUES
    const style = document.createElement('style');
    style.textContent = `
        .preloader-content {
            text-align: center;
            color: white;
        }
        
        .preloader-logo {
            margin-bottom: 2rem;
        }
        
        .logo-text {
            display: block;
            font-size: 2.5rem;
            font-weight: 900;
            color: #ffffff; /* Blanc au lieu d'orange */
            margin-bottom: 0.5rem;
            letter-spacing: 2px;
        }
        
        .logo-subtext {
            display: block;
            font-size: 1rem;
            color: #e9ecef;
            font-weight: 300;
        }
        
        .preloader-spinner {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 1.5rem;
            position: relative;
        }
        
        .spinner-ring {
            width: 60px;
            height: 60px;
            border: 3px solid transparent;
            border-top: 3px solid #ffffff; /* Blanc au lieu d'orange */
            border-radius: 50%;
            position: absolute;
            animation: spin 1s linear infinite;
        }
        
        .spinner-ring:nth-child(2) {
            width: 80px;
            height: 80px;
            border-top-color: #e9ecef;
            animation-duration: 1.5s;
            animation-direction: reverse;
        }
        
        .spinner-ring:nth-child(3) {
            width: 100px;
            height: 100px;
            border-top-color: #f8f9fa;
            animation-duration: 2s;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .preloader-text {
            color: #e9ecef;
            font-size: 0.9rem;
            margin: 0;
            opacity: 0.8;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(preloader);
    
    // Masquer le preloader après le chargement
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
                style.remove();
            }, 500);
        }, 1500);
    });
}

// Activer le preloader
document.addEventListener('DOMContentLoaded', showPreloader);

// Validation en temps réel du formulaire
function setupFormValidation() {
    if (!contactForm) return;
    
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Supprimer les erreurs existantes
    clearFieldError(field);
    
    if (!value) {
        errorMessage = 'Ce champ est requis';
        isValid = false;
    } else if (fieldName === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Email invalide';
            isValid = false;
        }
    } else if (fieldName === 'name' && value.length < 2) {
        errorMessage = 'Le nom doit contenir au moins 2 caractères';
        isValid = false;
    } else if (fieldName === 'message' && value.length < 10) {
        errorMessage = 'Le message doit contenir au moins 10 caractères';
        isValid = false;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.style.borderColor = '#ef4444';
    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorElement.style.cssText = `
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    `;
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Initialiser la validation du formulaire
document.addEventListener('DOMContentLoaded', setupFormValidation);

// Test de connectivité EmailJS au chargement
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si EmailJS est chargé
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS n\'est pas chargé !');
        showNotification('Service d\'email non disponible. Contactez-moi directement.', 'warning');
    } else {
        console.log('✅ EmailJS chargé avec succès');
    }
    
    // Vérifier la connexion internet
    if (!navigator.onLine) {
        showNotification('🌐 Pas de connexion internet détectée', 'warning');
    }
});