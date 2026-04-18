/* ============================================
   AGRI-CHAIN — dashboard.js
   Dashboard navigation, live prices,
   market filters, interactions
   ============================================ */

// ===== PAGE IDs & TITLES =====
const PAGE_TITLES = {
  overview:   'نظرة عامة',
  prices:     'بورصة الأسعار اللحظية',
  profile:    'البروفايل',
  crops:      'محاصيلي',
  orders:     'طلباتي',
  market:     'السوق المباشر',
  logistics:  'اللوجستيات',
};

// ===== SHOW PAGE =====
function showPage(id, navEl) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Show target
  const target = document.getElementById('page-' + id);
  if (target) target.classList.add('active');

  // Update topbar title
  const titleEl = document.getElementById('pageTitle');
  if (titleEl) titleEl.textContent = PAGE_TITLES[id] || '';

  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (navEl) navEl.classList.add('active');
}

// ===== MARKET FILTER =====
function filterActive(el) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  // TODO: filter market cards by category
}

// ===== LIVE PRICE ROW IDs =====
// Overview + full prices page
const OVERVIEW_PRICES  = ['pr1', 'pr2', 'pr3', 'pr4', 'pr5'];
const FULLPAGE_PRICES  = ['fp1', 'fp2', 'fp3', 'fp4', 'fp5', 'fp6', 'fp7', 'fp8'];
const ALL_PRICE_ROWS   = [...OVERVIEW_PRICES, ...FULLPAGE_PRICES];

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Start live prices using shared utility from main.js
  startLivePrices(ALL_PRICE_ROWS, 3000);
});
