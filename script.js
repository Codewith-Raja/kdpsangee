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
  const exploreBtn = document.getElementById('explore-btn');
  const search = document.getElementById('search');

  exploreBtn?.addEventListener('click', () => document.querySelector('.products')?.scrollIntoView({ behavior: 'smooth' }));
  search?.addEventListener('input', (e) => renderProducts(e.target.value));

  renderProducts();
}

document.addEventListener('DOMContentLoaded', init);
