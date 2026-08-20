/**
 * Laskavě — Masážní salon (Zuzana Klazarová)
 * Interactive JS: Sticky Header, Intersection Observer, Lightbox & Mobile Menu
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Password Protection Logic ---
  const pwOverlay = document.getElementById('password-overlay');
  const pwForm = document.getElementById('password-form');
  const pwInput = document.getElementById('site-password');
  const pwError = document.getElementById('password-error');

  if (pwOverlay && pwForm && pwInput && pwError) {
    if (sessionStorage.getItem('site_unlocked') !== 'true') {
      pwForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (pwInput.value === 'Sochorov') {
          sessionStorage.setItem('site_unlocked', 'true');
          document.body.style.overflow = '';
          pwOverlay.style.opacity = '0';
          setTimeout(() => pwOverlay.style.display = 'none', 500);
        } else {
          pwError.classList.remove('hidden');
          pwInput.value = '';
        }
      });
    }
  }

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
      // Change icon to X if needed, or leave it. We'll leave it as three lines.
    }
  };

  const closeMobileMenu = () => {
    if (mobileMenuDrawer) {
      mobileMenuDrawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  };
  
  const toggleMobileMenu = () => {
    if (mobileMenuDrawer) {
      if (mobileMenuDrawer.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    }
  };

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', toggleMobileMenu);
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
    // Scroll handling is now managed by Tailwind CSS classes in HTML
    calIframe.setAttribute('scrolling', 'auto');
  }
});

  // --- Newsletter Subscription Logic ---
  const handleSubscription = async (e, emailInput, submitBtn, messageEl, isModal = false) => {
    e.preventDefault();
    
    const email = emailInput.value;
    if (!email) return;

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Odesílám...';
    submitBtn.disabled = true;
    lucide.createIcons();

    try {
      // Direct call to MailerLite API from the client (ideal for static hosting without a backend)
      const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiYWYwOWM1NjZhMjA3MmIwNDQ2MzJjYzA3YmMxYjM2MjA1ZmQ4NmIzZWRmNWYzYzZmYzFiNWJjNzc4NWEyMDY1OTBiMzhkNWUyYTZhNzY1Y2IiLCJpYXQiOjE3ODcyMjA0MDMuODk4NzU5LCJuYmYiOjE3ODcyMjA0MDMuODk4NzYyLCJleHAiOjQ5NDI4OTQwMDMuODkyNzQzLCJzdWIiOiIyNTk4NDY5Iiwic2NvcGVzIjpbXX0.gmeKaire_W26S8m84DdHA1JdWwF0_EDsEkWdwXlnlRSG78sceccIkBx_vPFTmXWTqZ5HI72mMDez7DgfnuzBBVYGzNN7Gdd1vkwHjr4A0Tzqzzg75c4JNw9X1340oJgBpPXG8ybwNtVDt3EWWBX2898xJgHAqA94ctjbtXIU3d3iojW6TlqUh3qoYbZ1fpiFXwVH70Bweaiwf96UJp_KtdLEjruKlCB5tMwi1E_SwfVXYjVB6lXwsEpZWloCgeO5hnxwlSKchpClx7NX6WzkpmIEzm2VEe5IhkS8vOUeprcx2vdOiAnALcwK45rRQdAis-keW74fLdg3weuqmcvf3m6oNcXPMA9tbetTL-4KWyLkWx_PEDHjpcKLXxyQsoa2utTLzHbNfXBhRJM0B6DNkySXJa_4bj2ZJaekYyXDRubPyc-f_BPUUHuIGdm24P6lFtX4ocr_WZXW5nTw3GdSHAo40Z5S64LVFWmSFO5HqtgMLCwH4Uzsk4EeBOmLe2j4UaUe9psk0Pwh0Ge_wZePjwMYtbO1H__fak77eEBkRQCOhSab-qbHyhZXcdp-0B7pUNmPLb8AajTJwGt9KV56J7U1nnwdAtb3V6Q6bC9T0m0Egk5BlAplVcPEz6mFL07si_DGAhQTImOJ1BCe1G6MSIaQDPp6LiU1HtKTOxiHSpU'
        },
        body: JSON.stringify({ email: email })
      });

      const data = await response.json();

      messageEl.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');
      
      if (response.ok) {
        messageEl.classList.add('bg-green-100', 'text-green-700');
        messageEl.textContent = 'Děkuji! Byli jste úspěšně přihlášeni k odběru.';
        emailInput.value = '';
        if (isModal) {
          setTimeout(closeNewsletterModal, 3000);
        }
      } else {
        messageEl.classList.add('bg-red-100', 'text-red-700');
        messageEl.textContent = data.message || 'Něco se pokazilo, zkuste to prosím později.';
      }
    } catch (error) {
      messageEl.classList.remove('hidden');
      messageEl.classList.add('bg-red-100', 'text-red-700');
      messageEl.textContent = 'Došlo k chybě při komunikaci se servery.';
    } finally {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
      messageEl.classList.remove('hidden');
      lucide.createIcons();
    }
  };

  // Modal Newsletter Setup
  const newsletterModal = document.getElementById('newsletter-modal');
  const newsletterContent = document.getElementById('newsletter-modal-content');
  const newsletterClose = document.getElementById('newsletter-modal-close');
  const newsletterBackdrop = document.getElementById('newsletter-modal-backdrop');
  
  const modalForm = document.getElementById('newsletter-form');
  const modalEmail = document.getElementById('newsletter-email');
  const modalSubmitBtn = document.getElementById('newsletter-submit-btn');
  const modalMessage = document.getElementById('newsletter-message');

  let hasNewsletterBeenShown = false;
  try {
    hasNewsletterBeenShown = sessionStorage.getItem('newsletterShown');
  } catch(e) {}

  const openNewsletterModal = () => {
    if (hasNewsletterBeenShown) return;
    newsletterModal.classList.remove('opacity-0', 'pointer-events-none');
    newsletterContent.classList.remove('scale-95');
    newsletterContent.classList.add('scale-100');
    try {
      sessionStorage.setItem('newsletterShown', 'true');
    } catch(e) {}
    hasNewsletterBeenShown = true;
  };

  const closeNewsletterModal = () => {
    newsletterModal.classList.add('opacity-0', 'pointer-events-none');
    newsletterContent.classList.remove('scale-100');
    newsletterContent.classList.add('scale-95');
  };

  if (newsletterModal) {
    // Show after 15 seconds
    setTimeout(openNewsletterModal, 15000);

    newsletterClose.addEventListener('click', closeNewsletterModal);
    newsletterBackdrop.addEventListener('click', closeNewsletterModal);

    modalForm.addEventListener('submit', (e) => {
      handleSubscription(e, modalEmail, modalSubmitBtn, modalMessage, true);
    });
  }

  // Footer Newsletter Setup
  const footerForm = document.getElementById('footer-newsletter-form');
  const footerEmail = document.getElementById('footer-newsletter-email');
  const footerSubmitBtn = document.getElementById('footer-newsletter-submit-btn');
  const footerMessage = document.getElementById('footer-newsletter-message');

  if (footerForm) {
    footerForm.addEventListener('submit', (e) => {
      handleSubscription(e, footerEmail, footerSubmitBtn, footerMessage, false);
    });
  }

  // --- Privacy Policy Modal Logic ---
  const privacyModal = document.getElementById('privacy-modal');
  const privacyContent = document.getElementById('privacy-modal-content');
  const privacyClose = document.getElementById('privacy-modal-close');
  const privacyBackdrop = document.getElementById('privacy-modal-backdrop');
  const privacyLinks = document.querySelectorAll('.privacy-link');

  if (privacyModal) {
    const openPrivacyModal = (e) => {
      if (e) e.preventDefault();
      privacyModal.classList.remove('opacity-0', 'pointer-events-none');
      privacyContent.classList.remove('scale-95');
      privacyContent.classList.add('scale-100');
      document.body.style.overflow = 'hidden';
    };

    const closePrivacyModal = () => {
      privacyModal.classList.add('opacity-0', 'pointer-events-none');
      privacyContent.classList.remove('scale-100');
      privacyContent.classList.add('scale-95');
      document.body.style.overflow = '';
    };

    privacyLinks.forEach(link => {
      link.addEventListener('click', openPrivacyModal);
    });

    privacyClose.addEventListener('click', closePrivacyModal);
    privacyBackdrop.addEventListener('click', closePrivacyModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !privacyModal.classList.contains('pointer-events-none')) {
        closePrivacyModal();
      }
    });
  }
