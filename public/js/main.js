// Initialize AOS with optimized settings
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 50,
    disable: 'mobile'
});

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll handling
const handleScroll = debounce(() => {
    const navbar = document.querySelector('.navbar');
    const scrollPosition = window.scrollY;

    if (scrollPosition > 100) {
        navbar.classList.add('scroll-up');
        navbar.classList.remove('scroll-down');
    } else {
        navbar.classList.remove('scroll-up');
    }
}, 10);

window.addEventListener('scroll', handleScroll, { passive: true });

// Optimize mobile navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger?.contains(e.target) && !navLinks?.contains(e.target)) {
        hamburger?.classList.remove('active');
        navLinks?.classList.remove('active');
    }
});

// Optimize smooth scrolling
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

// Optimize form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        // Validate form data
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Send form data to server
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showNotification('Message sent successfully! 🎉', 'success');
                contactForm.reset();
            } else {
                throw new Error(data.message || 'Failed to send message');
            }
        } catch (error) {
            showNotification(error.message || 'Failed to send message. Please try again. 😕', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Optimize notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger reflow
    notification.offsetHeight;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Optimize theme toggle
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        const icon = themeToggle.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
}

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    const icon = themeToggle?.querySelector('i');
    if (icon) {
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Optimize image loading
document.querySelectorAll('img').forEach(img => {
    if (img.dataset.src) {
        img.src = img.dataset.src;
    }
});

// Optimize project cards animation
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Enhanced typing animation for Hero Section
const heroTitle = document.querySelector('.hero-content h1');
const heroSubtitle = document.querySelector('.hero-content h2');
const heroText = "Hi, I'm Aditya Mishra";
const subtitleText = "Full Stack Developer";

// Clear initial content
heroTitle.textContent = '';
heroSubtitle.textContent = '';

// Typing animation function
function typeWriter(element, text, speed = 100, delay = 0) {
    let i = 0;
    setTimeout(() => {
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(interval);
                // Add cursor blink effect after typing
                element.classList.add('typing-complete');
            }
        }, speed);
    }, delay);
}

// Start typing animations when page loads
window.addEventListener('load', () => {
    // Add cursor effect to elements
    heroTitle.classList.add('typing');
    heroSubtitle.classList.add('typing');
    
    // Start typing animations
    typeWriter(heroTitle, heroText, 100);
    typeWriter(heroSubtitle, subtitleText, 100, heroText.length * 100 + 500);
    
    // Add fade-in animation to hero content
    document.querySelector('.hero-content').classList.add('fade-in');
});

// Enhanced Skills Progress Animation
const skillCards = document.querySelectorAll('.skill-card');

const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            // Add a delay based on the card's index
            const index = Array.from(skillCards).indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 0.1}s`;
        }
    });
}, observerOptions);

skillCards.forEach(card => {
    observer.observe(card);
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
});

// Add smooth reveal animation for sections
const revealSections = document.querySelectorAll('section');

const revealOptions = {
    threshold: 0.15,
    rootMargin: '0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, revealOptions);

revealSections.forEach(section => {
    revealObserver.observe(section);
});

// Project Cards Auto Scroll
const projectsTrack = document.querySelector('.projects-track');
let isHovered = false;

// Pause animation on hover
projectsTrack.addEventListener('mouseenter', () => {
    isHovered = true;
    projectsTrack.style.animationPlayState = 'paused';
});

projectsTrack.addEventListener('mouseleave', () => {
    isHovered = false;
    projectsTrack.style.animationPlayState = 'running';
});

// Touch events for mobile
let touchStartX = 0;
let touchEndX = 0;

projectsTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    projectsTrack.style.animationPlayState = 'paused';
});

projectsTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        // User swiped, keep animation paused
        return;
    }
    
    // Resume animation after a short delay
    setTimeout(() => {
        if (!isHovered) {
            projectsTrack.style.animationPlayState = 'running';
        }
    }, 1000);
}

// Image Loading and Adjustment
const projectImages = document.querySelectorAll('.project-image img');

projectImages.forEach(img => {
    const imageContainer = img.parentElement;
    
    // Add loading animation
    imageContainer.classList.add('loading');
    
    // Handle image load
    img.onload = () => {
        imageContainer.classList.remove('loading');
        imageContainer.classList.add('loaded');
        
        // Adjust image position if needed
        adjustImagePosition(img);
    };
    
    // Handle image error
    img.onerror = () => {
        imageContainer.classList.remove('loading');
        // Set a default image or show error state
        img.src = 'images/placeholder.jpg';
    };
});

// Function to adjust image position based on aspect ratio
function adjustImagePosition(img) {
    const container = img.parentElement;
    const containerRatio = container.offsetWidth / container.offsetHeight;
    const imageRatio = img.naturalWidth / img.naturalHeight;
    
    if (imageRatio > containerRatio) {
        // Image is wider than container
        img.style.objectPosition = 'center center';
    } else {
        // Image is taller than container
        img.style.objectPosition = 'center top';
    }
}

// Adjust images on window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        projectImages.forEach(img => {
            adjustImagePosition(img);
        });
    }, 250);
}); 