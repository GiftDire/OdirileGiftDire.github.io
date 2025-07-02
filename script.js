// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobile-menu');
const mobileNav = document.getElementById('mobile-nav');
let isMenuOpen = false;

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileNav.classList.add('active');
            mobileMenuToggle.children[0].style.transform = 'rotate(45deg) translateY(7px)';
            mobileMenuToggle.children[1].style.opacity = '0';
            mobileMenuToggle.children[2].style.transform = 'rotate(-45deg) translateY(-7px)';
        } else {
            mobileNav.classList.remove('active');
            mobileMenuToggle.children[0].style.transform = 'rotate(0) translateY(0)';
            mobileMenuToggle.children[1].style.opacity = '1';
            mobileMenuToggle.children[2].style.transform = 'rotate(0) translateY(0)';
        }
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
        isMenuOpen = false;
        mobileNav.classList.remove('active');
        if (mobileMenuToggle) {
            mobileMenuToggle.children[0].style.transform = 'rotate(0) translateY(0)';
            mobileMenuToggle.children[1].style.opacity = '1';
            mobileMenuToggle.children[2].style.transform = 'rotate(0) translateY(0)';
        }
    });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Simple fade-in animation for sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add animation class to sections (but don't hide them)
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in class to sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });

    // Observe skills grid separately
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
        observer.observe(skillsGrid);
    }
});

// Typing effect for hero text
document.addEventListener('DOMContentLoaded', () => {
    const heroText = document.querySelector('.hero-text h1');
    if (heroText) {
        const text = heroText.textContent;
        heroText.textContent = '';
        heroText.style.opacity = '1';
        let index = 0;
        
        function typeWriter() {
            if (index < text.length) {
                heroText.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 100);
            }
        }
        
        setTimeout(typeWriter, 500);
    }
});

// Add parallax effect to floating elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const floatElements = document.querySelectorAll('.float-element');
    
    floatElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.2);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Console Easter Egg
console.log('%c👋 Hey there!', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cThanks for checking out my portfolio!', 'font-size: 16px; color: #06b6d4;');
console.log('%cFeel free to reach out at Direodirile95@gmail.com', 'font-size: 14px; color: #8b5cf6;');