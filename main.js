/* ============================================
   AGRI-CHAIN — main.js
   Shared utilities: navbar scroll, reveal,
   toast, mobile menu
   ============================================ */

// ===== NAVBAR SCROLL EFFECT =====
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
})();

// ===== REVEAL ON SCROLL =====
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  // Add visible class immediately as fallback
  reveals.forEach(el => el.classList.add('visible'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
})();

// ===== PROMO MODAL =====
function openPromoModal() {
  const modal = document.getElementById('promoModal');
  if (!modal) return;
  modal.classList.add('active');
}

function closePromoModal() {
  const modal = document.getElementById('promoModal');
  if (!modal) return;
  modal.classList.remove('active');
}

window.addEventListener('load', () => {
  setTimeout(openPromoModal, 500);
});

// ===== TOAST NOTIFICATION =====
/**
 * Show a toast message
 * @param {string} message
 * @param {number} duration  ms — default 3000
 */
function showToast(message, duration = 3000) {
  let toast = document.getElementById('toast');

  // Create toast if it doesn't exist
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ===== MOBILE MENU TOGGLE =====
function toggleMenu() {
  const ul = document.querySelector('nav#navbar ul');
  const hamburger = document.querySelector('.hamburger');
  if (!ul || !hamburger) return;

  const isOpen = ul.style.display === 'flex';

  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}

function openMenu() {
  const ul = document.querySelector('nav#navbar ul');
  const hamburger = document.querySelector('.hamburger');
  if (!ul || !hamburger) return;

  Object.assign(ul.style, {
    display:       'flex',
    flexDirection: 'column',
    position:      'absolute',
    top:           '70px',
    right:         '0',
    left:          '0',
    background:    'rgba(10,31,14,0.97)',
    backdropFilter: 'blur(10px)',
    padding:       '20px',
    gap:           '16px',
    borderBottom:  '1px solid rgba(46,204,90,0.2)',
    zIndex:        '999',
    boxShadow:     '0 4px 20px rgba(0,0,0,0.3)'
  });
  hamburger.classList.add('active');

  // Close menu when clicking on a link
  const links = ul.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside
  setTimeout(() => {
    document.addEventListener('click', handleOutsideClick);
  }, 100);
}

function closeMenu() {
  const ul = document.querySelector('nav#navbar ul');
  const hamburger = document.querySelector('.hamburger');
  if (!ul || !hamburger) return;

  ul.removeAttribute('style');
  hamburger.classList.remove('active');
  document.removeEventListener('click', handleOutsideClick);
}

function handleOutsideClick(e) {
  const navbar = document.getElementById('navbar');
  const hamburger = document.querySelector('.hamburger');
  if (!navbar.contains(e.target) || e.target === hamburger) {
    return;
  }
  closeMenu();
}

// Close menu on outside click
document.addEventListener('click', (e) => {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  if (!navbar.contains(e.target)) {
    const ul = navbar.querySelector('ul');
    if (ul) ul.removeAttribute('style');
  }
});

// ===== WINDOW RESIZE HANDLER =====
(function initResizeHandler() {
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
})();

// ===== SMOOTH SCROLLING =====
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return; // Skip empty anchors

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
})();

// ===== ARABIC NUMBER CONVERTER =====
/**
 * Convert Western digits to Arabic-Indic numerals
 * @param {number|string} n
 * @returns {string}
 */
function toArabicNums(n) {
  return n.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
}

// ===== LIVE PRICE UPDATER =====
/**
 * Animates price cells with random fluctuations
 * Call this function from any page that has price rows
 * @param {string[]} rowIds  — array of element IDs
 * @param {number}   interval — ms between updates (default 3000)
 */
function startLivePrices(rowIds, interval = 3000) {
  setInterval(() => {
    rowIds.forEach(id => {
      const row = document.getElementById(id);
      if (!row) return;

      const priceEl  = row.querySelector('.price-cell, .price-val');
      const changeEl = row.querySelector('.change-cell, .price-change');
      if (!priceEl || !changeEl) return;

      const current = parseFloat(priceEl.textContent.replace(/[^\d.]/g, ''));
      const delta   = (Math.random() - 0.48) * 3;
      const newPrice = Math.max(5, current + delta);
      const pct     = Math.abs(delta / current * 100).toFixed(1);

      priceEl.textContent = toArabicNums(Math.round(newPrice));

      if (delta > 0) {
        changeEl.textContent = '▲ ' + toArabicNums(pct) + '٪';
        changeEl.className   = changeEl.className.replace(/ch-\w+|up|down/g, '').trim()
                             + ' ' + (changeEl.classList.contains('price-change') ? 'up' : 'ch-up');
      } else {
        changeEl.textContent = '▼ ' + toArabicNums(pct) + '٪';
        changeEl.className   = changeEl.className.replace(/ch-\w+|up|down/g, '').trim()
                             + ' ' + (changeEl.classList.contains('price-change') ? 'down' : 'ch-dn');
      }

      // Flash color
      priceEl.style.transition = 'color 0.3s';
      priceEl.style.color      = delta > 0 ? '#6bffaa' : '#ff9999';
      setTimeout(() => { priceEl.style.color = ''; }, 600);
    });
  }, interval);
}

// ===== CONTACT FORM SUBMISSION =====
/**
 * Submit contact form via AJAX
 */
function submitContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const fullName = form.querySelector('input[placeholder*="اسمك"]').value.trim();
  const email    = form.querySelector('input[type="email"]').value.trim();
  const userType = form.querySelector('select').value.trim();
  const message  = form.querySelector('textarea').value.trim();

  if (!fullName || !email || !userType || !message) {
    showToast('يرجى ملء جميع الحقول', 4000);
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('يرجى إدخال بريد إلكتروني صحيح', 4000);
    return;
  }

  // Disable button
  const btn = form.querySelector('button');
  const originalText = btn.textContent;
  btn.textContent = 'جاري الإرسال...';
  btn.disabled = true;

  fetch('php/contact.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      full_name: fullName,
      email: email,
      user_type: userType,
      message: message
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showToast(data.message, 5000);
      // Clear form
      form.querySelectorAll('input, textarea, select').forEach(el => el.value = '');
    } else {
      showToast('خطأ: ' + data.message, 5000);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showToast('حدث خطأ في الإرسال. حاول مرة أخرى.', 5000);
  })
  .finally(() => {
    btn.textContent = originalText;
    btn.disabled = false;
  });
}
