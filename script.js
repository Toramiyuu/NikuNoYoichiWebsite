// ========================================
// NIKUNO YOICHI - Japanese Yakiniku Restaurant
// ========================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Loading Screen ---
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1200);

  // --- Navbar Scroll Effect ---
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Mobile Menu Toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  const toggleMenu = () => {
    navLinks.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  };

  navToggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      overlay.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });

  // --- Menu Category Tabs ---
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuItems = document.querySelectorAll('.menu-item');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;
      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      menuItems.forEach(item => {
        if (item.dataset.category === category) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // --- Smooth Reveal on Scroll ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

  // --- Active Nav Link on Scroll ---
  const sections = document.querySelectorAll('.section, .hero');
  const navAnchors = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const updateActiveNav = () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 200;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navAnchors.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === `#${current}`) {
        a.style.color = 'var(--color-primary)';
      }
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // --- Hero Hours Badge ---
  const heroBadge = document.getElementById('heroBadge');
  if (heroBadge) {
    // NIKUNO YOICHI Hours:
    // Monday: Closed
    // Tue-Thu: 5:00 PM - 11:00 PM (Dinner only)
    // Fri-Sun: 11:30 AM - 2:30 PM, 5:00 PM - 11:00 PM (Lunch & Dinner)

    const updateHoursBadge = () => {
      const now = new Date();
      const myTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }));
      const day = myTime.getDay(); // 0 = Sunday, 1 = Monday, ...
      const hours = myTime.getHours();
      const minutes = myTime.getMinutes();
      const currentMinutes = hours * 60 + minutes;

      const dot = heroBadge.querySelector('.badge-dot');
      const text = heroBadge.querySelector('.badge-text');

      // Define hours in minutes from midnight
      const lunchOpen = 11 * 60 + 30;   // 11:30 AM
      const lunchClose = 14 * 60 + 30;  // 2:30 PM
      const dinnerOpen = 17 * 60;       // 5:00 PM
      const dinnerClose = 23 * 60;      // 11:00 PM

      let isOpen = false;
      let statusText = '';

      if (day === 1) {
        // Monday - Closed
        isOpen = false;
        statusText = 'Closed today · Opens Tuesday 5pm';
      } else if (day >= 2 && day <= 4) {
        // Tuesday - Thursday (Dinner only)
        if (currentMinutes >= dinnerOpen && currentMinutes < dinnerClose) {
          isOpen = true;
          statusText = 'Open now · Until 11pm';
        } else if (currentMinutes < dinnerOpen) {
          isOpen = false;
          statusText = 'Opens today at 5pm';
        } else {
          isOpen = false;
          statusText = 'Closed · Opens tomorrow 5pm';
        }
      } else {
        // Friday - Sunday (Lunch & Dinner)
        if (currentMinutes >= lunchOpen && currentMinutes < lunchClose) {
          isOpen = true;
          statusText = 'Lunch now · Until 2:30pm';
        } else if (currentMinutes >= dinnerOpen && currentMinutes < dinnerClose) {
          isOpen = true;
          statusText = 'Dinner now · Until 11pm';
        } else if (currentMinutes < lunchOpen) {
          isOpen = false;
          statusText = 'Opens today at 11:30am';
        } else if (currentMinutes >= lunchClose && currentMinutes < dinnerOpen) {
          isOpen = false;
          statusText = 'Break · Dinner opens 5pm';
        } else {
          // After dinner close
          if (day === 0) {
            // Sunday night - Monday closed
            isOpen = false;
            statusText = 'Closed · Opens Tuesday 5pm';
          } else {
            isOpen = false;
            statusText = 'Closed · Opens tomorrow 11:30am';
          }
        }
      }

      dot.classList.toggle('closed', !isOpen);
      text.textContent = statusText;
    };

    updateHoursBadge();
    setInterval(updateHoursBadge, 60000);
  }

  // --- Mobile CTA Bar Visibility ---
  const mobileCta = document.getElementById('mobileCta');
  const heroSection = document.getElementById('hero');

  if (mobileCta && heroSection) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          mobileCta.classList.remove('visible');
        } else {
          mobileCta.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    ctaObserver.observe(heroSection);
  }

  // --- Gallery Lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryItems = document.querySelectorAll('#galleryGrid .gallery-item');
  let currentLightboxIndex = 0;

  function openLightbox(index) {
    currentLightboxIndex = index;
    const item = galleryItems[index];
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = item.dataset.label || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    currentLightboxIndex = (currentLightboxIndex + direction + galleryItems.length) % galleryItems.length;
    openLightbox(currentLightboxIndex);
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

});

// ========================================
// Google Places API - Reviews & Photos
// ========================================
const PLACE_ID = 'ChIJq1cyJvr9SjARbFeil9TSLNA'; // NIKUNO YOICHI @Penang
const CACHE_KEY = 'nikunoyoichi_google_reviews_v1';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function initPlaces() {
  const div = document.createElement('div');
  const service = new google.maps.places.PlacesService(div);

  // Fetch reviews with cache
  const cachedReviews = loadCache(CACHE_KEY, CACHE_DURATION);
  if (cachedReviews) {
    renderGoogleData(cachedReviews);
  } else {
    service.getDetails({
      placeId: PLACE_ID,
      fields: ['rating', 'user_ratings_total', 'reviews', 'photos']
    }, (place, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !place) return;

      const reviewData = {
        rating: place.rating,
        totalReviews: place.user_ratings_total,
        reviews: (place.reviews || []).map(r => ({
          author: r.author_name,
          rating: r.rating,
          text: r.text,
          time: r.relative_time_description
        }))
      };
      saveCache(CACHE_KEY, reviewData);
      renderGoogleData(reviewData);

      // Render photos
      if (place.photos && place.photos.length > 0) {
        renderGooglePhotos(place.photos);
      }
    });
  }
}

function loadCache(key, duration) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > duration) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

function saveCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({
      timestamp: Date.now(),
      data
    }));
  } catch {}
}

function renderGoogleData(data) {
  // Update rating displays
  const ratingNum = document.getElementById('googleRatingNumber');
  const ratingInline = document.getElementById('googleRatingInline');
  const reviewCount = document.getElementById('googleReviewCount');

  if (ratingNum && data.rating) {
    ratingNum.textContent = data.rating.toFixed(1);
  }
  if (ratingInline && data.rating) {
    ratingInline.textContent = data.rating.toFixed(1);
  }
  if (reviewCount && data.totalReviews) {
    reviewCount.textContent = data.totalReviews.toLocaleString();
  }

  // Render reviews
  const grid = document.getElementById('reviewsGrid');
  if (!grid || !data.reviews || data.reviews.length === 0) return;

  const starSvg = '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.28l-4.77 2.51.91-5.32L2.27 6.7l5.34-.78z"/></svg>';
  const emptyStarSvg = '<svg viewBox="0 0 20 20" fill="#333"><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.28l-4.77 2.51.91-5.32L2.27 6.7l5.34-.78z"/></svg>';

  const goodReviews = data.reviews
    .filter(r => r.rating >= 4)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  if (goodReviews.length === 0) return;

  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const cards = goodReviews.map(review => {
    const stars = Array.from({ length: 5 }, (_, i) =>
      i < review.rating ? starSvg : emptyStarSvg
    ).join('');

    const text = review.text.length > 180
      ? review.text.substring(0, 180).trim() + '...'
      : review.text;

    return `
      <div class="review-card">
        <div class="review-stars">${stars}</div>
        <p class="review-text">"${esc(text)}"</p>
        <div class="review-author">
          <span class="author-name">${esc(review.author)}</span>
          <span class="author-source">Google Review · ${esc(review.time || '')}</span>
        </div>
      </div>
    `;
  }).join('');

  grid.innerHTML = cards;
}

function renderGooglePhotos(photos) {
  if (!photos || photos.length === 0) return;

  // Replace hero background
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && photos[0]) {
    heroBg.src = photos[0].getUrl({ maxWidth: 1920 });
    heroBg.alt = 'NIKUNO YOICHI Penang';
  }

  // Replace about image
  const aboutImg = document.querySelector('.about-img');
  if (aboutImg && photos[1]) {
    aboutImg.src = photos[1].getUrl({ maxWidth: 800 });
    aboutImg.alt = 'NIKUNO YOICHI Premium Wagyu';
  }

  // Replace gallery images
  const galleryItems = document.querySelectorAll('#galleryGrid .gallery-item img');
  const galleryPhotos = photos.slice(2); // Skip hero and about photos
  galleryItems.forEach((img, i) => {
    if (galleryPhotos[i]) {
      img.src = galleryPhotos[i].getUrl({ maxWidth: 800 });
      img.alt = 'NIKUNO YOICHI';
    }
  });
}
