const PRODUCTS = [
  { id: '001', name: 'Mustard Oil 1000ml', price: 390, img: 't6.png' },
  { id: '002', name: 'Mustard Oil 500ml', price: 195, img: 't6.png' },
  { id: '003', name: 'Chilli Powder 50g', price: 41, img: 't1.png' },
  { id: '007', name: 'Chilli Powder 100g', price: 81, img: 't1.png' },
  { id: '008', name: 'Chilli Powder 200g', price: 146, img: 't1.png' },
  { id: '009', name: 'Chilli Powder 500g', price: 336, img: 't1.png' },

  { id: '010', name: 'Turmeric Powder 50g', price: 36, img: 't3.png' },
  { id: '005', name: 'Turmeric Powder 100g', price: 76, img: 't3.png' },
  { id: '011', name: 'Turmeric Powder 200g', price: 126, img: 't3.png' },
  { id: '012', name: 'Turmeric Powder 500g', price: 276, img: 't3.png' },

  { id: '013', name: 'Coriander Powder 50g', price: 36, img: 't2.png' },
  { id: '014', name: 'Coriander Powder 100g', price: 76, img: 't2.png' },
  { id: '015', name: 'Coriander Powder 200g', price: 126, img: 't2.png' },
  { id: '016', name: 'Coriander Powder 500g', price: 276, img: 't2.png' },
];

function renderProducts(filterText = '') {
  const list = document.getElementById('product-list');
  list.innerHTML = '';

  const term = filterText.trim().toLowerCase();
  const filtered = PRODUCTS.filter((p) => !term || p.name.toLowerCase().includes(term));

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-state">No products found.</div>`;
    return;
  }

  filtered.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" loading="lazy" />
      <div class="product-meta">
        <h3>${p.name}</h3>
        <p class="price">NPR ${p.price}</p>
      </div>
    `;
    list.appendChild(card);
  });
}

function init() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const exploreBtn = document.getElementById('explore-btn');

  menuToggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('active');
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
  });

  // Close the menu after clicking a link (mobile UX)
  navLinks?.addEventListener('click', (e) => {
    if (!(e.target instanceof Element)) return;
    if (e.target.closest('a')) {
      navLinks.classList.remove('active');
      menuToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on outside click + Escape for professional UX
  document.addEventListener('click', (e) => {
    if (!navLinks || !menuToggle) return;
    if (!navLinks.classList.contains('active')) return;
    if (menuToggle.contains(e.target) || navLinks.contains(e.target)) return;
    navLinks.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('keydown', (e) => {
    if (!navLinks || !menuToggle) return;
    if (e.key !== 'Escape') return;
    navLinks.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  });

  // If user rotates / resizes to desktop, close dropdown.
  window.addEventListener('resize', () => {
    if (!navLinks || !menuToggle) return;
    if (window.innerWidth > 820) {
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  exploreBtn?.addEventListener('click', () => document.querySelector('.products')?.scrollIntoView({ behavior: 'smooth' }));

  renderProducts();
}

document.addEventListener('DOMContentLoaded', init);
