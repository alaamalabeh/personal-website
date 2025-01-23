function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    console.log('Email:', email);
    console.log('Message:', message);
    
    this.reset();
    alert('Thank you for your message! I will get back to you soon.');
});


//more animations from claude


// Project Carousel Functionality
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        let currentSlide = 0;

        function showSlide(index) {

            slides.forEach(slide => slide.classList.remove('active'));

            currentSlide = (index + slides.length) % slides.length;
            
            slides[currentSlide].classList.add('active');
        }

        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });

        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });

        showSlide(0);
    });
});

// Scroll-Triggered Animations
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section, #about-content, #projects-content').forEach(section => {
        observer.observe(section);
    });
});

// Twinkling Star Animation Enhancement
document.addEventListener('DOMContentLoaded', () => {
    const sparkleBackground = document.querySelector('.sparkle-background');
    
    function createStar() {
        const star = document.createElement('div');
        star.classList.add('star');
        
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        sparkleBackground.appendChild(star);
    }

    for (let i = 0; i < 30; i++) {
        createStar();
    }
});

// Typing Effect for Profile Text
document.addEventListener('DOMContentLoaded', () => {
    const profileText = document.querySelector('.section__text__p2');
    const text = profileText.textContent;
    profileText.textContent = '';

    function typeWriter(text, element, index = 0) {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            setTimeout(() => typeWriter(text, element, index + 1), 50);
        }
    }

    typeWriter(text, profileText);
});

// Form Validation and Interaction
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('#contact form');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const inputs = contactForm.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'red';
                isValid = false;
            } else {
                input.style.borderColor = 'initial';
            }
        });

        if (isValid) {
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        }
    });
});

