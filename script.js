document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Animate Sections
    const sections = document.querySelectorAll('.glass-panel, .level-card, .hero-content');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(section);
    });

    // Hover Tilt Effect for Level Cards (Optional Polish)
    const cards = document.querySelectorAll('.level-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });
    // Modal open/close handlers
    const modalTriggers = document.querySelectorAll('.level-card[data-modal]');
    modalTriggers.forEach(card => {
        const modalId = card.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
            card.addEventListener('click', () => {
                modal.classList.add('show');
            });
        }
    });
    const modalCloses = document.querySelectorAll('.modal .close');
    modalCloses.forEach(btn => {
        const modal = btn.closest('.modal');
        btn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    });
});
