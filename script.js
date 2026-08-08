/**
 * Laskavě — Masážní salon (Zuzana Klazarová)
 * Interactive JS: Sticky Header, Intersection Observer, Lightbox & Mobile Menu
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons if available
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // 2. Sticky Header Scroll Effect
  const headerNav = document.getElementById('header-nav');
  const handleScroll = () => {
    if (!headerNav) return;
    if (window.scrollY > 30) {
      headerNav.classList.add('scrolled');
    } else {
      headerNav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // initial check

  // 3. Intersection Observer API for Scroll Reveal Animations (Fade-in / Slide-up)
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once revealed, unobserve for performance
        observer.unobserve(entry.target);
      }
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(revealCallback, observerOptions);
    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // 4. Mobile Hamburger Menu Drawer
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const mobileMenuCloseBtn = document.getElementById('mobile-menu-close-btn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    if (mobileMenuDrawer) {
      mobileMenuDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeMobileMenu = () => {
    if (mobileMenuDrawer) {
      mobileMenuDrawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', openMobileMenu);
  }

  if (mobileMenuCloseBtn) {
    mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // 5. Interactive Photo Lightbox Modal
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const photoThumbnails = document.querySelectorAll('.photo-thumb, .portrait-thumb');

  const openLightbox = (src, caption) => {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) {
      lightboxCaption.textContent = caption || 'Masážní salon Laskavě — Oáza klidu a jemnosti';
    }
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  photoThumbnails.forEach(thumb => {
    thumb.addEventListener('click', (e) => {
      const imgEl = thumb.querySelector('img');
      const titleEl = thumb.querySelector('.photo-caption') || thumb.getAttribute('data-caption');
      if (imgEl) {
        openLightbox(imgEl.src, typeof titleEl === 'string' ? titleEl : (titleEl ? titleEl.textContent : ''));
      }
    });
  });

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // 6. Service Selection Shortcut -> Scrolls to Reservation with visual hint
  const serviceOrderButtons = document.querySelectorAll('.service-order-btn');
  const selectedServiceBadge = document.getElementById('selected-service-badge');

  serviceOrderButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = btn.getAttribute('data-service-name');
      if (serviceName && selectedServiceBadge) {
        selectedServiceBadge.textContent = `Předvolená služba: ${serviceName}`;
        selectedServiceBadge.classList.remove('hidden');
        selectedServiceBadge.classList.add('inline-flex');
      }
    });
  });

  // 7. Interactive Joy Pills click sparkle effect
  const joyPills = document.querySelectorAll('.joy-pill');
  joyPills.forEach(pill => {
    pill.addEventListener('click', () => {
      pill.style.transform = 'scale(1.1)';
      pill.style.borderColor = '#C69B59';
      setTimeout(() => {
        pill.style.transform = '';
        pill.style.borderColor = '';
      }, 300);
    });
  });

  // 8. Carousel Logic
  const initCarousel = (trackId, containerId, prevBtnId, nextBtnId) => {
    const track = document.getElementById(trackId);
    const container = document.getElementById(containerId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    
    if (track && container) {
      let isTransitioning = false;
      let carouselInterval;

      const moveToNextSlide = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        
        const slideWidth = track.firstElementChild.offsetWidth;
        
        // Enable transition and slide
        track.style.transition = 'transform 700ms ease-in-out';
        track.style.transform = `translateX(-${slideWidth}px)`;
        
        // Wait for transition to finish
        setTimeout(() => {
          // Disable transition
          track.style.transition = 'none';
          
          // Move first child to end
          track.appendChild(track.firstElementChild);
          
          // Reset transform
          track.style.transform = 'translateX(0)';
          
          // Force reflow
          void track.offsetWidth;
          
          isTransitioning = false;
        }, 700);
      };

      const moveToPrevSlide = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        
        const slideWidth = track.firstElementChild.offsetWidth;
        
        // Disable transition and prep track
        track.style.transition = 'none';
        
        // Move last child to beginning
        track.insertBefore(track.lastElementChild, track.firstElementChild);
        
        // Offset transform to hide the new first child instantly
        track.style.transform = `translateX(-${slideWidth}px)`;
        
        // Force reflow
        void track.offsetWidth;
        
        // Enable transition and slide to 0
        requestAnimationFrame(() => {
          track.style.transition = 'transform 700ms ease-in-out';
          track.style.transform = 'translateX(0)';
          
          setTimeout(() => {
            isTransitioning = false;
          }, 700);
        });
      };

      const startCarousel = () => {
        carouselInterval = setInterval(moveToNextSlide, 3500);
      };
      const stopCarousel = () => {
        clearInterval(carouselInterval);
      };

      startCarousel();

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          stopCarousel();
          moveToNextSlide();
          startCarousel();
        });
      }
      
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          stopCarousel();
          moveToPrevSlide();
          startCarousel();
        });
      }

      // Pause on hover or touch
      container.addEventListener('mouseenter', stopCarousel);
      container.addEventListener('mouseleave', startCarousel);
      
      container.addEventListener('touchstart', stopCarousel, {passive: true});
      container.addEventListener('touchend', startCarousel, {passive: true});
    }
  };

  // Initialize both carousels
  initCarousel('carousel-track', 'photo-carousel-container', 'carousel-prev', 'carousel-next');
  initCarousel('review-carousel-track', 'review-carousel-container', 'review-carousel-prev', 'review-carousel-next');

  // 9. Expandable Reviews Modal
  const reviews = document.querySelectorAll('.review-text');
  const reviewModal = document.getElementById('review-modal');
  const reviewModalContent = document.getElementById('review-modal-content');
  const reviewModalText = document.getElementById('review-modal-text');
  const reviewModalClose = document.getElementById('review-modal-close');
  const reviewModalBackdrop = document.getElementById('review-modal-backdrop');

  if (reviewModal) {
    const openModal = (text) => {
      reviewModalText.innerText = text;
      reviewModal.classList.remove('opacity-0', 'pointer-events-none');
      
      // small delay to allow display to apply before scaling up
      requestAnimationFrame(() => {
        reviewModalContent.classList.remove('scale-95', 'opacity-0');
        reviewModalContent.classList.add('scale-100', 'opacity-100');
      });
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeModal = () => {
      reviewModalContent.classList.remove('scale-100', 'opacity-100');
      reviewModalContent.classList.add('scale-95', 'opacity-0');
      
      setTimeout(() => {
        reviewModal.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = ''; // Restore scrolling
      }, 300);
    };

    reviews.forEach(review => {
      review.addEventListener('click', () => {
        // We stored the full text in the title attribute if it was long, or we can just use the inner text.
        // Actually, innerText might be truncated with ellipsis by line-clamp, but typically innerText returns what is rendered,
        // or textContent returns the full text regardless of CSS.
        // Wait, textContent includes the full string.
        let fullText = review.getAttribute('title'); // For review 7 we used title attribute.
        if (fullText && fullText !== 'Klikněte pro zobrazení celé recenze') {
            // Wait, we replaced the title of all to 'Klikněte...'
            // Let's just use textContent.
            fullText = review.textContent.trim();
        } else {
            fullText = review.textContent.trim();
        }
        openModal(fullText);
      });
    });

    reviewModalClose.addEventListener('click', closeModal);
    reviewModalBackdrop.addEventListener('click', closeModal);
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !reviewModal.classList.contains('pointer-events-none')) {
        closeModal();
      }
    });
  }

  // 10. Cal.com iframe scroll management
  const calIframe = document.getElementById('cal-iframe');
  if (calIframe) {
    const updateIframeScroll = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      const is16by9 = window.matchMedia('(min-aspect-ratio: 16/9)').matches; 

      if (isMobile || is16by9) {
        calIframe.setAttribute('scrolling', 'no');
      } else {
        calIframe.setAttribute('scrolling', 'auto');
      }
    };
    
    updateIframeScroll();
    window.addEventListener('resize', updateIframeScroll);
  }
});
