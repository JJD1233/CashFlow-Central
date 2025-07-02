// CashFlow Central - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.textContent = nav.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const button = this.querySelector('.newsletter-btn');
            const originalText = button.textContent;
            
            // Simple email validation
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            button.textContent = 'Subscribing...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = '✓ Subscribed!';
                showMessage('Thanks for subscribing! Check your email for confirmation.', 'success');
                this.reset();
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                }, 2000);
            }, 1500);
        });
    }

    // Smooth scrolling for anchor links
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

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.post-card, .category-card, .widget').forEach(el => {
        observer.observe(el);
    });

    // Ad banner click tracking (for analytics)
    document.querySelectorAll('.ad-banner').forEach(ad => {
        ad.addEventListener('click', function() {
            // Track ad clicks for analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'ad_click', {
                    'ad_position': this.className.includes('header') ? 'header' :
                                  this.className.includes('sidebar') ? 'sidebar' :
                                  this.className.includes('content') ? 'content' : 'footer'
                });
            }
        });
    });

    // Post card hover effects
    document.querySelectorAll('.post-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Reading progress indicator
    createReadingProgress();

    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('loading');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            img.classList.add('loading');
            imageObserver.observe(img);
        });
    }

    // Search functionality (basic)
    addSearchFunctionality();

    // Social sharing
    addSocialSharing();
});

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    
    // Style the message
    Object.assign(messageEl.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'success' ? '#059669' : 
                        type === 'error' ? '#dc2626' : '#2563eb'
    });
    
    document.body.appendChild(messageEl);
    
    // Animate in
    setTimeout(() => {
        messageEl.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageEl.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 5000);
}

function createReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    
    Object.assign(progressBar.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '0%',
        height: '3px',
        backgroundColor: '#2563eb',
        zIndex: '10000',
        transition: 'width 0.1s ease'
    });
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = Math.min(scrolled, 100) + '%';
    });
}

function addSearchFunctionality() {
    // Simple search implementation
    const searchData = [
        { title: 'How to Make $1,000 Fast', url: '/how-to-make-1000-fast', keywords: 'money fast cash income' },
        { title: 'Passive Income Ideas', url: '/passive-income-ideas', keywords: 'passive income investment wealth' },
        { title: 'Best Side Hustles', url: '/best-side-hustles-2024', keywords: 'side hustle extra income work' }
    ];
    
    // Add search functionality if needed
    window.searchPosts = function(query) {
        return searchData.filter(post => 
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.keywords.toLowerCase().includes(query.toLowerCase())
        );
    };
}

function addSocialSharing() {
    // Add social sharing functionality
    window.sharePost = function(platform, title, url) {
        const encodedTitle = encodeURIComponent(title);
        const encodedUrl = encodeURIComponent(url);
        
        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        };
        
        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
        
        // Track social shares
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                'method': platform,
                'content_type': 'article',
                'item_id': url
            });
        }
    };
}

// Performance monitoring
function trackPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'page_load_time', {
                        'value': Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                        'custom_parameter': 'load_time_ms'
                    });
                }
            }, 0);
        });
    }
}

// Initialize performance tracking
trackPerformance();

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // Track errors for debugging
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': e.error.toString(),
            'fatal': false
        });
    }
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}