// Narendra Portfolio JavaScript Logic

document.addEventListener('DOMContentLoaded', () => {
    
    // Elements
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    const backToTopBtn = document.getElementById('back-to-top');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // Sticky Navbar & Back-to-Top visibility on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Active Section Link Highlight
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Mobile Menu Toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navLinksContainer.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // Scroll to Top
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Project Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: "SE32tjlnyyAC6r0GF" });
    }

    // Contact Form Submission (EmailJS Integration)
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            const submitBtn = contactForm.querySelector('.submit-btn');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = messageInput.value.trim();

            // Basic email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name || !email || !subject || !message) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Please fill out all fields before submitting.';
                return;
            }

            if (!emailRegex.test(email)) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Please enter a valid email address.';
                return;
            }

            const originalBtnText = submitBtn.innerHTML;

            // Loading state animation
            submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            submitBtn.disabled = true;
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            const templateParams = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message
            };

            emailjs.send('service_ait3kyd', 'template_uh267ln', templateParams)
                .then(() => {
                    formStatus.className = 'form-status success';
                    formStatus.textContent = 'Message sent successfully! Abdullah will get back to you soon.';
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error('EmailJS Error:', error);
                    formStatus.className = 'form-status error';
                    formStatus.textContent = 'Failed to send message. Please try again or reach out directly.';
                })
                .finally(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;

                    setTimeout(() => {
                        formStatus.textContent = '';
                        formStatus.className = 'form-status';
                    }, 6000);
                });
        });
    }

    // Stats Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateStats = () => {
        if (animated) return;
        const heroStats = document.querySelector('.hero-stats');
        if (!heroStats) return;

        const rect = heroStats.getBoundingClientRect();
        if (rect.top <= window.innerHeight) {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const suffix = stat.textContent.replace(/[0-9]/g, '');
                let count = 0;
                const speed = target / 30;

                const updateCount = () => {
                    count += speed;
                    if (count < target) {
                        stat.textContent = Math.ceil(count) + suffix;
                        setTimeout(updateCount, 30);
                    } else {
                        stat.textContent = target + suffix;
                    }
                };
                updateCount();
            });
            animated = true;
        }
    };

    window.addEventListener('scroll', animateStats);
    animateStats(); // Initial check

    // Page Visibility API - Pause video marquee when tab is not visible
    document.addEventListener('visibilitychange', () => {
        const marqueeTrack = document.querySelector('.video-marquee-track');
        if (!marqueeTrack) return;
        if (document.hidden) {
            marqueeTrack.classList.add('is-paused');
        } else {
            marqueeTrack.classList.remove('is-paused');
        }
    });

    // Reviews Carousel Arrow Navigation Controls
    const reviewsTrack = document.getElementById('reviews-track');
    const prevBtn = document.getElementById('reviews-prev');
    const nextBtn = document.getElementById('reviews-next');

    if (reviewsTrack && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            const cardWidth = reviewsTrack.querySelector('.review-card')?.offsetWidth || 340;
            reviewsTrack.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            const cardWidth = reviewsTrack.querySelector('.review-card')?.offsetWidth || 340;
            reviewsTrack.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
        });
    }
});
