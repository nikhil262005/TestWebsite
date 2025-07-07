document.addEventListener('DOMContentLoaded', function() {
    // Initialize the hero section animation
    const hero = document.querySelector('.hero');
    if (hero) {
        setTimeout(() => {
            hero.classList.add('play');
        }, 500);
        
        // Enhanced glare effect with mouse movement
        hero.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element
            
            // Calculate rotation based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Limit rotation to a small range for subtle effect
            const rotateY = ((x - centerX) / centerX) * 2; // -2 to 2 degrees
            const rotateX = ((centerY - y) / centerY) * 1; // -1 to 1 degrees
            
            // Apply the transform
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
            
            // Update the glare position
            const glareX = (x / rect.width) * 100;
            document.documentElement.style.setProperty('--glare-position', `${glareX}%`);
        });
        
        // Reset transform when mouse leaves
        hero.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header height
                    behavior: 'smooth'
                });
                
                // Update URL hash without scrolling
                history.pushState(null, null, targetId);
                
                // Add active class to clicked link and remove from others
                document.querySelectorAll('nav a').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY;
        
        // Get all sections
        const sections = document.querySelectorAll('section[id]');
        
        // Find the current section
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Adjust for header height
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                document.querySelectorAll('nav a').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to the corresponding navigation link
                const activeLink = document.querySelector(`nav a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
        
        // Special case for home section when at the top of the page
        if (scrollPosition < 100) {
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
            });
            const homeLink = document.querySelector('nav a[href="#home"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        }
    }
    
    // Call updateActiveNavLink on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Call updateActiveNavLink on page load
    updateActiveNavLink();
    
    // Logo Tilt Card & Glare Hover Animation
    const logoCard = document.querySelector('.logo.tilt-card');
    if (logoCard) {
        applyTiltEffect(logoCard);
    }
    
    // Apply tilt effect to all masonry items
    const masonryTiltCards = document.querySelectorAll('.masonry-item.tilt-card');
    masonryTiltCards.forEach(card => {
        applyTiltEffect(card);
    });
    
    // Function to apply tilt effect to an element
    function applyTiltEffect(element) {
        const inner = element.querySelector('.tilt-card-inner');
        const img = element.querySelector('img');
        
        if (!inner) return;
        
        // Tilt effect on mouse move
        element.addEventListener('mousemove', function(e) {
            // Prevent default behavior to ensure tilt works properly
            e.preventDefault();
            
            // Add tilt-active class to disable floating animation
            element.classList.add('tilt-active');
            element.classList.remove('floating');
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation values
            const rotateY = ((x - centerX) / centerX) * 10; // -10 to 10 degrees
            const rotateX = ((centerY - y) / centerY) * -10; // -10 to 10 degrees
            
            // Apply the transform with easing
            inner.style.setProperty('--tilt-x', `${rotateX}deg`);
            inner.style.setProperty('--tilt-y', `${rotateY}deg`);
            
            // Update inner position for parallax effect if there's an image
            if (img) {
                const moveX = ((x - centerX) / centerX) * -5;
                const moveY = ((y - centerY) / centerY) * -5;
                
                // Special handling for specific images
                const dataIndex = element.getAttribute('data-index');
                
                // For 4.png (index 4) and design_1.png (index 7)
                if (dataIndex === '4' || dataIndex === '7') {
                    // Only apply Z transform to maintain position
                    img.style.transform = `translate(-50%, -50%) translateZ(20px)`;
                } else {
                    img.style.transform = `translateZ(20px) translateX(${moveX}px) translateY(${moveY}px)`;
                }
            }
            
            // Calculate glare position
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            inner.style.setProperty('--glare-x', `${glareX}%`);
            inner.style.setProperty('--glare-y', `${glareY}%`);
            
            // Calculate glare angle based on mouse position
            const glareAngle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
            inner.style.setProperty('--glare-angle', `${glareAngle + 135}deg`);
        });
        
        // Reset transform when mouse leaves
        element.addEventListener('mouseleave', function() {
            inner.style.setProperty('--tilt-x', '0deg');
            inner.style.setProperty('--tilt-y', '0deg');
            
            if (img) {
                // Special handling for specific images
                const dataIndex = element.getAttribute('data-index');
                
                // For 4.png (index 4) and design_1.png (index 7)
                if (dataIndex === '4' || dataIndex === '7') {
                    img.style.transform = 'translate(-50%, -50%) translateZ(0)';
                } else {
                    img.style.transform = 'translateZ(0)';
                }
            }
            
            inner.style.setProperty('--glare-x', '50%');
            inner.style.setProperty('--glare-y', '50%');
            
            // Remove tilt-active class and restore floating animation if visible
            element.classList.remove('tilt-active');
            if (element.classList.contains('visible')) {
                setTimeout(() => {
                    element.classList.add('floating');
                }, 100);
            }
        });
        
        // Add click effect
        element.addEventListener('mousedown', function() {
            inner.style.transform = 'rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) translateZ(-5px)';
            
            if (img) {
                // Special handling for specific images
                const dataIndex = element.getAttribute('data-index');
                
                // For 4.png (index 4) and design_1.png (index 7)
                if (dataIndex === '4' || dataIndex === '7') {
                    img.style.transform = 'translate(-50%, -50%) translateZ(10px)';
                } else {
                    img.style.transform = 'translateZ(10px)';
                }
            }
        });
        
        element.addEventListener('mouseup', function(event) {
            inner.style.transform = 'rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) translateZ(0)';
            
            if (img) {
                // Restore the parallax effect after click
                const rect = this.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const moveX = ((x - centerX) / centerX) * -5;
                const moveY = ((y - centerY) / centerY) * -5;
                
                // Special handling for specific images
                const dataIndex = element.getAttribute('data-index');
                
                // For 4.png (index 4) and design_1.png (index 7)
                if (dataIndex === '4' || dataIndex === '7') {
                    img.style.transform = 'translate(-50%, -50%) translateZ(20px)';
                } else {
                    img.style.transform = `translateZ(20px) translateX(${moveX}px) translateY(${moveY}px)`;
                }
            }
        });
    }
    
    // Initialize Split Text Animation for Navigation
    const splitTextLinks = document.querySelectorAll('.split-text-link');
    splitTextLinks.forEach((link, index) => {
        // We'll let updateActiveNavLink handle the active class
    });

    // Font loading check
    document.fonts.ready.then(function() {
        // Check Le Jour Serif
        if (document.fonts.check('1em "Le Jour Serif"')) {
            document.documentElement.classList.remove('fonts-loading');
            document.documentElement.classList.add('fonts-loaded');
            console.log('Le Jour Serif font loaded successfully.');
        } else {
            document.documentElement.classList.remove('fonts-loading');
            document.documentElement.classList.add('fonts-failed');
            console.log('Le Jour Serif font not loaded. Using fallback.');
        }
        
        // Check Darker Grotesque
        if (document.fonts.check('1em "Darker Grotesque"')) {
            document.documentElement.classList.add('nav-fonts-loaded');
            console.log('Darker Grotesque font loaded successfully.');
        } else {
            document.documentElement.classList.add('nav-fonts-failed');
            console.log('Darker Grotesque font not loaded. Using fallback.');
        }
    });
    
    // Prevent image dragging for better UX
    document.querySelectorAll('.masonry-item img').forEach(img => {
        img.addEventListener('dragstart', e => e.preventDefault());
    });
    
    // Masonry Gallery Lightbox
    const masonryItems = document.querySelectorAll('.masonry-item');
    const lightbox = document.querySelector('.masonry-lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let currentIndex = 0;
    
    if (masonryItems.length && lightbox && lightboxImage) {
        // Disable lightbox functionality - images should not be clickable
        // Add pointer-events: none to all masonry items to prevent clicks
        masonryItems.forEach((item) => {
            // Make the item still respond to hover but not to clicks
            item.style.pointerEvents = 'auto';
            const img = item.querySelector('img');
            if (img) {
                // Prevent image clicks specifically
                img.style.pointerEvents = 'none';
            }
        });
        
        // Close lightbox when clicking the close button
        if (lightboxClose) {
            lightboxClose.addEventListener('click', function() {
                lightbox.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            });
        }
        
        // Close lightbox when clicking outside the image
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                lightbox.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                lightbox.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }
    
    // Fade Up Animation for Gallery Images with Intersection Observer
    const galleryItems = document.querySelectorAll('.masonry-item');
    
    // Create the observer with options
    const observerOptions = {
        root: null, // viewport is the root
        rootMargin: '0px 0px -100px 0px', // trigger slightly before entering viewport
        threshold: 0.1 // trigger when 10% of the element is visible
    };
    
    // Intersection Observer callback function
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the fade-in class to trigger the animation
                entry.target.classList.add('fade-in');
                
                // Stop observing this element once it's animated
                observer.unobserve(entry.target);
            }
        });
    };
    
    // Create and start the observer
    const imageObserver = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe each masonry item
    galleryItems.forEach(item => {
        imageObserver.observe(item);
    });
    
    // Fade Up Animation for Section Headings
    const sectionHeadings = document.querySelectorAll('.scroll-float-heading');
    
    // Create the observer with options for section headings
    const headingObserverOptions = {
        root: null, // viewport is the root
        rootMargin: '-50px 0px -50px 0px', // trigger when heading is more visible in viewport
        threshold: 0.1 // trigger when 10% of the element is visible
    };
    
    // Intersection Observer callback function for section headings
    const headingObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const heading = entry.target;
                
                // Add the fade-in class to trigger the animation
                heading.classList.add('fade-in');
                
                // Set a random width for the underline between 70px and 120px
                const text = heading.querySelector('.scroll-float-text');
                if (text) {
                    const underlineWidth = Math.floor(Math.random() * 50) + 70;
                    text.style.setProperty('--underline-width', `${underlineWidth}px`);
                }
                
                // Don't unobserve - we want the animation to happen each time the heading comes into view
            } else {
                // Remove the fade-in class when the heading is out of view
                // This ensures the animation will play again when it comes back into view
                entry.target.classList.remove('fade-in');
            }
        });
    };
    
    // Create and start the observer for section headings
    const headingObserver = new IntersectionObserver(headingObserverCallback, headingObserverOptions);
    
    // Observe each section heading
    sectionHeadings.forEach(heading => {
        headingObserver.observe(heading);
    });
    
    // React Bits Scroll Float Animation for Section Headings
    let lastScrollY = window.scrollY;
    let lastScrollDirection = 0;
    let ticking = false;
    let animationFrameId = null;
    
    function updateFloatEffects() {
        // Calculate the scroll delta
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;
        
        // Determine scroll direction: positive for down, negative for up
        const scrollDirection = Math.sign(scrollDelta);
        
        // Only apply effect if scrolling and direction changed or significant movement
        const isSignificantScroll = Math.abs(scrollDelta) > 5;
        
        sectionHeadings.forEach(heading => {
            // Only apply float effects to headings that are currently visible
            if (!heading.classList.contains('fade-in')) return;
            
            const headingRect = heading.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const text = heading.querySelector('.scroll-float-text');
            
            if (!text) return;
            
            // Check if heading is in viewport
            if (headingRect.top < viewportHeight && headingRect.bottom > 0) {
                // Calculate position in viewport (0 = top, 1 = bottom)
                const viewportPosition = headingRect.top / viewportHeight;
                
                // Calculate distance from center of viewport
                const distanceFromCenter = Math.abs(0.5 - viewportPosition);
                
                // Calculate underline width - wider when closer to center
                const centerFactor = 1 - Math.min(distanceFromCenter * 2, 1);
                const underlineWidth = 30 + (70 * Math.pow(centerFactor, 2));
                text.style.setProperty('--underline-width', `${underlineWidth}px`);
                
                // Apply float animation only on significant scroll
                if (isSignificantScroll) {
                    // Calculate animation parameters based on scroll speed and direction
                    const scrollSpeed = Math.min(Math.abs(scrollDelta) * 0.1, 10);
                    const translateY = -scrollDirection * scrollSpeed;
                    const rotateX = scrollDirection * Math.min(scrollSpeed * 0.5, 5);
                    const scale = 1 - (Math.min(scrollSpeed * 0.005, 0.05));
                    
                    // Apply the transform
                    text.style.transform = `translateY(${translateY}px) rotateX(${rotateX}deg) scale(${scale})`;
                    
                    // Reset the transform after a short delay
                    clearTimeout(text.resetTimer);
                    text.resetTimer = setTimeout(() => {
                        text.style.transform = 'translateY(0) rotateX(0) scale(1)';
                    }, 150);
                }
            }
        });
        
        // Update the last scroll position
        lastScrollY = currentScrollY;
        lastScrollDirection = scrollDirection;
        ticking = false;
    }
    
    // Add scroll event listener with requestAnimationFrame for better performance
    window.addEventListener('scroll', () => {
        if (!ticking) {
            // Cancel any pending animation frame
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            
            // Request a new animation frame
            animationFrameId = requestAnimationFrame(() => {
                updateFloatEffects();
            });
            
            ticking = true;
        }
    });
    
    // Initial update
    updateFloatEffects();
    
    // Services Section Animation
    const serviceCards = document.querySelectorAll('.service-card');
    
    // Create the observer with options for service cards
    const serviceObserverOptions = {
        root: null,
        rootMargin: '-50px 0px',
        threshold: 0.15
    };
    
    // Intersection Observer callback function for service cards
    const serviceObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the visible class to trigger the animation with a staggered delay
                const card = entry.target;
                const index = Array.from(serviceCards).indexOf(card);
                
                // Stagger the animations
                setTimeout(() => {
                    card.classList.add('visible');
                    
                    // Apply tilt effect to the card
                    applyTiltEffect(card);
                    
                    // Add floating animation after the initial animation completes
                    // but only if not being hovered (tilt effect active)
                    setTimeout(() => {
                        if (!card.classList.contains('tilt-active')) {
                            card.classList.add('floating');
                        }
                    }, 800); // Wait for initial animation to complete
                }, index * 150); // 150ms delay between each card
                
                // Don't unobserve - we want the animation to happen each time
            } else {
                // Remove the visible class when the card is out of view
                entry.target.classList.remove('visible');
                entry.target.classList.remove('floating');
                entry.target.classList.remove('tilt-active');
            }
        });
    };
    
    // Create and start the observer for service cards
    const serviceObserver = new IntersectionObserver(serviceObserverCallback, serviceObserverOptions);
    
    // Observe each service card
    serviceCards.forEach(card => {
        serviceObserver.observe(card);
    });
}); 