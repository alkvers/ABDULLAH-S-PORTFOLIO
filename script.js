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
        emailjs.init({ publicKey: "SE32tjInyyAC6r0GF" });
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

    // Certificate Cards -> Modal (flies in from the clicked card's position)
    const certData = {
        hr: {
            eyebrow: 'Human Resource Management',
            title: 'Basics in Human Resource Management',
            issuer: 'UniAthena, in partnership with Cambridge International Qualifications, UK',
            image: './assets/certificate-hr.png',
            meta: [
                { label: 'Completed By', value: 'Muhammad Abdullah' },
                { label: 'Date', value: '25 July 2026' },
                { label: 'Blockchain ID', value: '9758-1241-5761' },
                { label: 'Issued By', value: 'Huw Flynn Hughes, CIQ' }
            ]
        },
        googleads: {
            eyebrow: 'Google Skillshop',
            title: 'Google Ads Search Professional Certification',
            issuer: 'Certified by Google',
            image: './assets/certificate-googleads.png',
            badgeImg: './assets/certificate-googleads-badge.png',
            meta: [
                { label: 'Completed By', value: 'Muhammad Abdullah' },
                { label: 'Issue Date', value: '22 July 2026' },
                { label: 'Expiry Date', value: '22 July 2027' },
                { label: 'Certificate ID', value: '189439608' }
            ]
        },
        digitalmarketing: {
            eyebrow: 'Google Digital Garage',
            title: 'Fundamentals of Digital Marketing',
            issuer: 'Completed course certificate',
            image: './assets/certificate-digital-marketing.png',
            meta: [
                { label: 'Completed By', value: 'Muhammad Abdullah' },
                { label: 'Date', value: '23 July 2026' },
                { label: 'Completion ID', value: '472359628' }
            ]
        }
    };

    const certCards = document.querySelectorAll('.cert-card');
    const certModalOverlay = document.getElementById('cert-modal-overlay');
    const certModal = document.getElementById('cert-modal');
    const certModalBody = document.getElementById('cert-modal-body');
    const certModalClose = document.getElementById('cert-modal-close');

    const buildCertMarkup = (data) => {
        const badge = data.badgeImg
            ? `<div class="cert-modal-badge"><img src="${data.badgeImg}" alt="${data.title}"></div>`
            : data.badgeIcon
                ? `<div class="cert-modal-badge"><i class="fa-solid ${data.badgeIcon}"></i></div>`
                : '';

        const image = data.image
            ? `<div class="cert-modal-image-wrapper"><img src="${data.image}" alt="${data.title}"></div>`
            : '';

        const meta = data.meta.map(m => `
            <div class="cert-modal-meta-item">
                <span class="cert-modal-meta-label">${m.label}</span>
                <span class="cert-modal-meta-value">${m.value}</span>
            </div>`).join('');

        return `
            ${badge}
            <span class="cert-modal-eyebrow">${data.eyebrow}</span>
            <h3 class="cert-modal-title">${data.title}</h3>
            <p class="cert-modal-issuer">${data.issuer}</p>
            ${image}
            <div class="cert-modal-meta">${meta}</div>
        `;
    };

    // Reusable "fly in from the clicked card" animation.
    // Measures the modal's real on-screen center (after content is placed) instead of
    // assuming it sits at the viewport center, so it always lands correctly regardless
    // of scrollbars, section padding, or content height.
    const flyModalIn = (overlay, modal, card, openBodyClass) => {
        overlay.classList.add('active');
        document.body.classList.add(openBodyClass);

        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;

        // Reset any leftover transform, then measure the modal's true resting position
        modal.style.transition = 'none';
        modal.style.transform = 'none';
        modal.style.opacity = '0';
        const modalRect = modal.getBoundingClientRect();
        const modalCenterX = modalRect.left + modalRect.width / 2;
        const modalCenterY = modalRect.top + modalRect.height / 2;

        const startScaleX = Math.min(Math.max(cardRect.width / modalRect.width, 0.15), 1);
        const startScaleY = Math.min(Math.max(cardRect.height / modalRect.height, 0.15), 1);
        const dx = cardCenterX - modalCenterX;
        const dy = cardCenterY - modalCenterY;

        modal.style.transform = `translate(${dx}px, ${dy}px) scale(${startScaleX}, ${startScaleY})`;

        // Force reflow so the browser registers the start state before animating
        void modal.offsetWidth;

        requestAnimationFrame(() => {
            modal.style.transition = '';
            modal.style.transform = 'translate(0, 0) scale(1)';
            modal.style.opacity = '1';
        });
    };

    const openCertModal = (card) => {
        const key = card.getAttribute('data-cert');
        const data = certData[key];
        if (!data) return;

        certModalBody.innerHTML = buildCertMarkup(data);
        flyModalIn(certModalOverlay, certModal, card, 'cert-modal-open');
    };

    const closeCertModal = () => {
        certModalOverlay.classList.remove('active');
        document.body.classList.remove('cert-modal-open');
    };

    certCards.forEach(card => {
        card.addEventListener('click', () => openCertModal(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openCertModal(card);
            }
        });
    });

    if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
    if (certModalOverlay) {
        certModalOverlay.addEventListener('click', (e) => {
            if (e.target === certModalOverlay) closeCertModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCertModal();
    });

    // Project Categories -> Gallery Modal (flies in from the clicked card's position)
    const categoryData = {
        photography: {
            title: 'Photography',
            images: [
                { src: './assets/photo-badshahi-mosque.jpg', title: 'Badshahi Mosque, Lahore' },
                { src: './assets/photo-lahore-fort-arches.jpg', title: 'Lahore Fort' },
                { src: './assets/photo-eiffel-replica.jpg', title: 'Bahria Town, Lahore' },
                { src: './assets/photo-mall-interior.jpg', title: 'Architecture & Interiors' },
                { src: './assets/photo-street-sunset.jpg', title: 'Golden Hour, Lahore' },
                { src: './assets/photo-building-night.jpg', title: 'Low-Light Shots' },
                { src: './assets/photo-road-trees.jpg', title: 'Landscape Shots' }
            ]
        },
        webdev: {
            title: 'Web Development',
            images: [
                { src: './assets/service-webdev.jpg', title: 'C++ / Java Projects' },
                { src: './assets/portfolio-webdev-roadmap.jpg', title: 'Full Stack Web Projects' }
            ]
        },
        graphicdesign: {
            title: 'Graphic Design',
            images: [
                { src: './assets/portfolio-abstract-face.jpg', title: 'Concept & Vector Art' }
            ]
        },
        videoediting: {
            title: 'Video Editing',
            images: [
                { src: './assets/portfolio-video-timeline.jpg', title: 'Timeline & Post-Production' },
                { src: './assets/portfolio-editing-apps.jpg', title: 'Editing Toolkit' }
            ]
        },
        socialmedia: {
            title: 'Social Media',
            images: [
                { src: './assets/portfolio-social-tree.jpg', title: 'Cross-Platform Growth' },
                { src: './assets/portfolio-social-illustration.jpg', title: 'Content Scheduling & Handling' }
            ]
        },
        professional: {
            title: 'Professional Skills',
            images: [
                { src: './assets/portfolio-office-cubicle.jpg', title: 'Client Support' },
                { src: './assets/portfolio-podium-speaker.jpg', title: 'Team Management' }
            ]
        }
    };

    const catCards = document.querySelectorAll('.project-cat-card');
    const galleryModalOverlay = document.getElementById('gallery-modal-overlay');
    const galleryModal = document.getElementById('gallery-modal');
    const galleryModalBody = document.getElementById('gallery-modal-body');
    const galleryModalClose = document.getElementById('gallery-modal-close');

    const buildGalleryMarkup = (data) => {
        const items = data.images.map(img => `
            <div class="gallery-modal-item">
                <img src="${img.src}" alt="${img.title}" loading="lazy">
                <div class="gallery-modal-item-caption">${img.title}</div>
            </div>`).join('');

        return `
            <div class="gallery-modal-header">
                <span class="gallery-modal-eyebrow">${data.images.length} ${data.images.length === 1 ? 'Photo' : 'Photos'}</span>
                <h3 class="gallery-modal-title">${data.title}</h3>
            </div>
            <div class="gallery-modal-grid">${items}</div>
        `;
    };

    const openGalleryModal = (card) => {
        const key = card.getAttribute('data-category');
        const data = categoryData[key];
        if (!data) return;

        galleryModalBody.innerHTML = buildGalleryMarkup(data);
        flyModalIn(galleryModalOverlay, galleryModal, card, 'gallery-modal-open');
    };

    const closeGalleryModal = () => {
        galleryModalOverlay.classList.remove('active');
        document.body.classList.remove('gallery-modal-open');
    };

    catCards.forEach(card => {
        card.addEventListener('click', () => openGalleryModal(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openGalleryModal(card);
            }
        });
    });

    if (galleryModalClose) galleryModalClose.addEventListener('click', closeGalleryModal);
    if (galleryModalOverlay) {
        galleryModalOverlay.addEventListener('click', (e) => {
            if (e.target === galleryModalOverlay) closeGalleryModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeGalleryModal();
    });

    // Service Cards -> Detail Modal (flies in from the clicked card, reuses cert-modal styling)
    const serviceData = {
        webdev: {
            eyebrow: 'Websites, Apps & Systems',
            title: 'Web Development',
            issuer: 'From dynamic websites to full-stack apps and C++/Java systems, I build fast, responsive, and reliable digital products from the ground up. Every project is written clean, tested, and built to scale with your needs.',
            badgeIcon: 'fa-code',
            meta: [
                { label: 'Stack', value: 'HTML, CSS, JS, C++/Java' },
                { label: 'Delivers', value: 'Sites, Apps, Systems' }
            ]
        },
        graphicdesign: {
            eyebrow: 'Branding & Visual Design',
            title: 'Graphic Design',
            issuer: 'I design brand identities, social creatives, and vector art that actually stand out — clean, purposeful visuals that communicate your message at a glance and stay consistent across every platform.',
            badgeIcon: 'fa-pen-nib',
            meta: [
                { label: 'Delivers', value: 'Logos, Branding, Posts' },
                { label: 'Style', value: 'Clean & Purposeful' }
            ]
        },
        videoediting: {
            eyebrow: 'Cuts, Pacing & Polish',
            title: 'Video Editing',
            issuer: 'From raw footage to a polished final cut — I handle pacing, color, sound, and transitions so every video keeps viewers watching till the end, whether it\'s for reels, ads, or long-form content.',
            badgeIcon: 'fa-clapperboard',
            meta: [
                { label: 'Delivers', value: 'Reels, Ads, Long-form' },
                { label: 'Focus', value: 'Pacing & Retention' }
            ]
        },
        socialmedia: {
            eyebrow: 'Growth & Account Management',
            title: 'Social Media Handling',
            issuer: 'I manage content calendars, posting, and account growth end-to-end — turning inactive pages into engaged communities with a consistent posting rhythm and content that actually converts.',
            badgeIcon: 'fa-hashtag',
            meta: [
                { label: 'Delivers', value: 'Growth, Scheduling' },
                { label: 'Focus', value: 'Engagement & Reach' }
            ]
        },
        photography: {
            eyebrow: 'Architecture & Landscapes',
            title: 'Photography',
            issuer: 'I capture architecture, landscapes, and city moments with a sharp eye for light and composition — the same precision I bring to editing, turning ordinary scenes into striking shots.',
            badgeIcon: 'fa-camera',
            meta: [
                { label: 'Focus', value: 'Architecture, Landscape' },
                { label: 'Based In', value: 'Lahore, Pakistan' }
            ]
        },
        customerspecialist: {
            eyebrow: 'Support & Problem Solving',
            title: 'Customer Specialist',
            issuer: 'I bring strong communication and problem-solving skills to client support — handling queries calmly, resolving issues quickly, and making sure every customer walks away satisfied.',
            badgeIcon: 'fa-headset',
            meta: [
                { label: 'Delivers', value: 'Support, Resolution' },
                { label: 'Strength', value: 'Communication' }
            ]
        }
    };

    const serviceCards = document.querySelectorAll('.stack-card[data-service]');
    const serviceModalOverlay = document.getElementById('service-modal-overlay');
    const serviceModal = document.getElementById('service-modal');
    const serviceModalBody = document.getElementById('service-modal-body');
    const serviceModalClose = document.getElementById('service-modal-close');

    const openServiceModal = (card) => {
        const key = card.getAttribute('data-service');
        const data = serviceData[key];
        if (!data || !serviceModalOverlay) return;

        serviceModalBody.innerHTML = buildCertMarkup(data);
        flyModalIn(serviceModalOverlay, serviceModal, card, 'cert-modal-open');
    };

    const closeServiceModal = () => {
        if (!serviceModalOverlay) return;
        serviceModalOverlay.classList.remove('active');
        document.body.classList.remove('cert-modal-open');
    };

    serviceCards.forEach(card => {
        card.addEventListener('click', () => openServiceModal(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openServiceModal(card);
            }
        });
    });

    if (serviceModalClose) serviceModalClose.addEventListener('click', closeServiceModal);
    if (serviceModalOverlay) {
        serviceModalOverlay.addEventListener('click', (e) => {
            if (e.target === serviceModalOverlay) closeServiceModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeServiceModal();
    });
});
