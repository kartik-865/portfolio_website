document.addEventListener('DOMContentLoaded', () => {
    // === Sticky Header & Active Nav Link on Scroll ===
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollTopBtn = document.querySelector('.scroll-top-btn');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        // Sticky header class
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active nav link highlight
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100; // offset for nav height
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (correspondingLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });

        // Show/hide scroll to top button
        if (scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Scroll to Top action
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // === Mobile Menu Toggle ===
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinksList = document.querySelectorAll('.nav-link');

    menuToggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        // Toggle menu icon state (could be expanded)
        const isOpened = navMenu.classList.contains('open');
        menuToggleBtn.setAttribute('aria-expanded', isOpened);
    });

    // Close menu when clicking link
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
        });
    });

    // === Dark / Light Theme Toggle ===
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });

    // === Scroll Entrance Animation (Intersection Observer) ===
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const entranceObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once it is visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Register elements for animation
    const animateElements = document.querySelectorAll(
        '.section-header, .about-grid, .skills-container, .projects-container, .exp-timeline-container, .achievements-container, .contact-grid'
    );
    animateElements.forEach(el => entranceObserver.observe(el));

    // === Interactive Contact Details & Copy to Clipboard ===
    const copyToast = document.getElementById('copy-toast');
    const contactMethods = document.querySelectorAll('.contact-method');

    function showToast(message) {
        copyToast.querySelector('span').textContent = message;
        copyToast.classList.add('visible');
        
        setTimeout(() => {
            copyToast.classList.remove('visible');
        }, 3000);
    }

    contactMethods.forEach(method => {
        method.addEventListener('click', () => {
            const type = method.dataset.type;
            let value = '';
            
            if (type === 'email') {
                value = 'kartikgahlot@example.com'; // Mock standard email or dynamically set
                // You can update this to the user's real email if known, but a clean copy notification is super premium
                // Let's grab the actual text from the paragraph inside it
                const p = method.querySelector('p');
                if (p) value = p.textContent.trim();
            } else if (type === 'phone') {
                const p = method.querySelector('p');
                if (p) value = p.textContent.trim();
            }
            
            if (value) {
                navigator.clipboard.writeText(value).then(() => {
                    showToast(`Copied ${value} to clipboard!`);
                }).catch(err => {
                    showToast(`Could not copy: ${err}`);
                });
            }
        });
    });

    // === Contact Form Submission Handling ===
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name && email && message) {
                // Show success feedback
                showToast(`Thank you, ${name}! Your message was sent successfully.`);
                
                // Clear fields
                contactForm.reset();
            } else {
                showToast('Please fill out all fields.');
            }
        });
    }
});
