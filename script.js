const PRODUCTS = [
  { id: '001', name: 'Mustard Oil 1000ml', price: 390, img: 'm1.PNG', category: 'oil' },
  { id: '002', name: 'Mustard Oil 500ml', price: 200, img: 'm1.PNG', category: 'oil' },
  { id: '003', name: 'Mustard Oil (Tori) 500ml', price: 185, img: 'm1.PNG', category: 'oil' },
  { id: '004', name: 'Mustard Oil (Tori) 1000ml', price: 370, img: 'm1.PNG', category: 'oil' },
  { id: '005', name: 'Chilli Powder 50g', price: 41, img: 'c1.PNG', category: 'chilli' },
  { id: '007', name: 'Chilli Powder 100g', price: 81, img: 'c1.PNG', category: 'chilli' },
  { id: '008', name: 'Chilli Powder 200g', price: 146, img: 'c1.PNG', category: 'chilli' },
  { id: '009', name: 'Chilli Powder 500g', price: 336, img: 'c1.PNG', category: 'chilli' },
  { id: '010', name: 'Turmeric Powder 50g', price: 36, img: 'h1.PNG', category: 'turmeric' },
  { id: '006', name: 'Turmeric Powder 100g', price: 76, img: 'h1.PNG', category: 'turmeric' },
  { id: '011', name: 'Turmeric Powder 200g', price: 126, img: 'h1.PNG', category: 'turmeric' },
  { id: '012', name: 'Turmeric Powder 500g', price: 276, img: 'h1.PNG', category: 'turmeric' },
  { id: '013', name: 'Coriander Powder 50g', price: 36, img: 'd1.PNG', category: 'coriander' },
  { id: '014', name: 'Coriander Powder 100g', price: 76, img: 'd1.PNG', category: 'coriander' },
  { id: '015', name: 'Coriander Powder 200g', price: 126, img: 'd1.PNG', category: 'coriander' },
  { id: '016', name: 'Coriander Powder 500g', price: 276, img: 'd1.PNG', category: 'coriander' },
  { id: '017', name: 'Shahi Garam Masala 50g', price: 90, img: 'g1.PNG', category: 'masala' },
  { id: '018', name: 'Shahi Garam Masala 100g', price: 180, img: 'g1.PNG', category: 'masala' },
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'oil', label: 'Mustard Oil' },
  { id: 'chilli', label: 'Chilli' },
  { id: 'turmeric', label: 'Turmeric' },
  { id: 'coriander', label: 'Coriander' },
  { id: 'masala', label: 'Garam Masala' },
];

const DELIVERY_ZONES = [
  {
    id: 'janakpur',
    label: 'Inside Ring Road Janakpur City',
    fee: 0,
    description: 'Free delivery • Cash on Delivery (COD)',
  },
  {
    id: 'nearby',
    label: 'Outside Ring Road Janakpur (Nearby areas)',
    fee: 80,
    description: 'COD available • Delivery fee NPR 80',
  },
  {
    id: 'dhanusha',
    label: 'Outside Janakpur (Dhanusha district)',
    fee: 150,
    description: 'COD available • Delivery fee NPR 150',
  },
  {
    id: 'other',
    label: 'Outside Janakpur (Other districts)',
    fee: 200,
    description: 'COD available • Delivery fee NPR 200',
  },
];

const FAQ_ITEMS = [
  {
    q: 'How do I place an order?',
    a: 'Add products to your cart, open checkout, fill your details, and tap "Confirm Order on WhatsApp". We will confirm your order on chat.',
  },
  {
    q: 'Is Cash on Delivery available?',
    a: 'Yes. COD is available inside Janakpur city and outside Janakpur. Outside the city, a delivery fee is added based on your location.',
  },
  {
    q: 'What is the delivery fee inside Janakpur?',
    a: 'Inside Janakpur city, delivery is free. You only pay for your products at delivery (COD).',
  },
  {
    q: 'Do you deliver outside Janakpur?',
    a: 'Yes. We deliver outside Janakpur with Cash on Delivery. Delivery fee depends on distance: nearby areas, Dhanusha district, or other districts.',
  },
  {
    q: 'How fast is delivery?',
    a: 'Janakpur city orders are usually delivered the same day or next day. Outside city depends on location—we confirm time on WhatsApp.',
  },
  {
    q: 'Can retailers order in bulk?',
    a: 'Yes. Add multiple packs to cart or WhatsApp us for wholesale pricing and regular supply.',
  },
];

const WHATSAPP_NUMBER = '9779841938951';
const MIN_ORDER_NPR = 300;
const STORAGE_CART = 'kdp_cart_v1';
const STORAGE_CUSTOMER = 'kdp_customer_v1';

let cart = [];
let activeCategory = 'all';
let searchTerm = '';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_CART);
    cart = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(cart)) cart = [];
  } catch {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
}

function loadCustomer() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_CUSTOMER) || '{}');
  } catch {
    return {};
  }
}

function saveCustomer(data) {
  localStorage.setItem(STORAGE_CUSTOMER, JSON.stringify(data));
}

function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function getCartCount() {
  return cart.reduce((sum, line) => sum + line.qty, 0);
}

function getCartSubtotal() {
  return cart.reduce((sum, line) => {
    const p = getProduct(line.productId);
    return p ? sum + p.price * line.qty : sum;
  }, 0);
}

function getDeliveryFee(zoneId) {
  const zone = DELIVERY_ZONES.find((z) => z.id === zoneId);
  return zone ? zone.fee : 0;
}

function generateOrderId() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const t = String(d.getHours()).padStart(2, '0') + String(d.getMinutes()).padStart(2, '0');
  const r = String(Math.floor(Math.random() * 900) + 100);
  return `KDP-${y}${m}${day}-${t}${r}`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function addToCart(productId, qty = 1) {
  const existing = cart.find((l) => l.productId === productId);
  if (existing) existing.qty += qty;
  else cart.push({ productId, qty });
  saveCart();
  updateCartUI();
}

function setCartQty(productId, qty) {
  const line = cart.find((l) => l.productId === productId);
  if (!line) return;
  if (qty < 1) {
    cart = cart.filter((l) => l.productId !== productId);
  } else {
    line.qty = qty;
  }
  saveCart();
  updateCartUI();
}

function renderProducts() {
  const list = document.getElementById('product-list');
  if (!list) return;

  const term = searchTerm.trim().toLowerCase();
  const filtered = PRODUCTS.filter((p) => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = !term || p.name.toLowerCase().includes(term);
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    list.innerHTML = '<div class="empty-state">No products found. Try another search or category.</div>';
    return;
  }

  list.innerHTML = filtered
    .map(
      (p) => `
    <article class="product-card">
      <img src="${escapeHtml(p.img)}" alt="${escapeHtml(p.name)}" loading="lazy" />
      <div class="product-meta">
        <span class="product-category-tag">${escapeHtml(CATEGORIES.find((c) => c.id === p.category)?.label || '')}</span>
        <h3>${escapeHtml(p.name)}</h3>
        <p class="price">NPR ${p.price}</p>
      </div>
      <button class="btn btn-primary add-cart-btn" type="button" data-product-id="${p.id}">Add to Cart</button>
    </article>
  `
    )
    .join('');
}

function renderCategoryBar() {
  const bar = document.getElementById('category-bar');
  if (!bar) return;
  bar.innerHTML = CATEGORIES.map(
    (c) =>
      `<button type="button" class="category-chip${activeCategory === c.id ? ' active' : ''}" data-category="${c.id}">${escapeHtml(c.label)}</button>`
  ).join('');
}

function renderDeliveryZones() {
  const el = document.getElementById('delivery-zones-display');
  if (!el) return;
  el.innerHTML = DELIVERY_ZONES.map(
    (z) => `
    <div class="delivery-card">
      <h3>${escapeHtml(z.label)}</h3>
      <p class="delivery-card__fee">${z.fee === 0 ? 'Free delivery' : `Delivery fee: NPR ${z.fee}`}</p>
      <p class="delivery-card__desc">${escapeHtml(z.description)}</p>
      <p class="delivery-card__cod"><strong>Payment:</strong> Cash on Delivery (COD)</p>
    </div>
  `
  ).join('');
}

function renderFaq() {
  const el = document.getElementById('faq-list');
  if (!el) return;
  el.innerHTML = FAQ_ITEMS.map(
    (item, i) => `
    <details class="faq-item"${i === 0 ? ' open' : ''}>
      <summary>${escapeHtml(item.q)}</summary>
      <p>${escapeHtml(item.a)}</p>
    </details>
  `
  ).join('');
}

function populateDeliverySelect() {
  const select = document.getElementById('delivery-zone');
  if (!select) return;
  select.innerHTML = DELIVERY_ZONES.map(
    (z) => `<option value="${z.id}">${escapeHtml(z.label)}${z.fee ? ` (+ NPR ${z.fee})` : ' (Free delivery)'}</option>`
  ).join('');
}

function fillCustomerForm() {
  const saved = loadCustomer();
  const nameEl = document.getElementById('customer-name');
  const phoneEl = document.getElementById('customer-phone');
  const locEl = document.getElementById('customer-location');
  const zoneEl = document.getElementById('delivery-zone');
  const noteEl = document.getElementById('customer-note');
  if (nameEl && saved.name) nameEl.value = saved.name;
  if (phoneEl && saved.phone) phoneEl.value = saved.phone;
  if (locEl && saved.location) locEl.value = saved.location;
  if (zoneEl && saved.deliveryZone) zoneEl.value = saved.deliveryZone;
  if (noteEl && saved.note) noteEl.value = saved.note;
}

function updateCheckoutTotals() {
  const subtotal = getCartSubtotal();
  const zoneId = document.getElementById('delivery-zone')?.value || 'janakpur';
  const delivery = getDeliveryFee(zoneId);
  const grand = subtotal + delivery;

  const subEl = document.getElementById('total-subtotal');
  const delEl = document.getElementById('total-delivery');
  const grandEl = document.getElementById('total-grand');
  const hint = document.getElementById('checkout-hint');

  if (subEl) subEl.textContent = `NPR ${subtotal}`;
  if (delEl) delEl.textContent = delivery === 0 ? 'Free' : `NPR ${delivery}`;
  if (grandEl) grandEl.textContent = `NPR ${grand}`;

  if (hint) {
    if (subtotal < MIN_ORDER_NPR) {
      hint.textContent = `Minimum order is NPR ${MIN_ORDER_NPR}. Add more items to checkout.`;
      hint.classList.add('checkout-hint--warn');
    } else {
      const zone = DELIVERY_ZONES.find((z) => z.id === zoneId);
      hint.textContent = zone
        ? `${zone.label} • COD • ${zone.fee === 0 ? 'No delivery charge' : `Delivery NPR ${zone.fee}`}`
        : '';
      hint.classList.remove('checkout-hint--warn');
    }
  }

  return { subtotal, delivery, grand, zoneId };
}

function renderCheckoutSummary() {
  const el = document.getElementById('checkout-cart-summary');
  if (!el) return;
  if (cart.length === 0) {
    el.innerHTML = '<p class="empty-state">Your cart is empty.</p>';
    return;
  }
  el.innerHTML = cart
    .map((line) => {
      const p = getProduct(line.productId);
      if (!p) return '';
      const lineTotal = p.price * line.qty;
      return `<div class="checkout-line"><span>${escapeHtml(p.name)} × ${line.qty}</span><span>NPR ${lineTotal}</span></div>`;
    })
    .join('');
  updateCheckoutTotals();
}

function updateCartUI() {
  const count = getCartCount();
  const subtotal = getCartSubtotal();
  const fab = document.getElementById('cart-fab');
  const fabCount = document.getElementById('cart-fab-count');
  const itemsEl = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('cart-subtotal');
  const minHint = document.getElementById('cart-min-hint');
  const checkoutBtn = document.getElementById('cart-checkout-btn');

  if (fab) fab.classList.toggle('hidden', count === 0);
  if (fabCount) fabCount.textContent = String(count);
  if (subtotalEl) subtotalEl.textContent = `NPR ${subtotal}`;
  if (minHint) {
    if (subtotal === 0) {
      minHint.textContent = `Minimum order NPR ${MIN_ORDER_NPR}`;
      minHint.classList.remove('cart-summary__hint--ready');
    } else if (subtotal < MIN_ORDER_NPR) {
      minHint.textContent = `Add NPR ${MIN_ORDER_NPR - subtotal} more to checkout`;
      minHint.classList.remove('cart-summary__hint--ready');
    } else {
      minHint.textContent = 'Ready for checkout';
      minHint.classList.add('cart-summary__hint--ready');
    }
  }
  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0 || subtotal < MIN_ORDER_NPR;

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty__mark">KDP</div>
        <h3>Your cart is empty</h3>
        <p>Add your favorite masala, oil, and spice packs to start a WhatsApp order.</p>
      </div>
    `;
    return;
  }

  itemsEl.innerHTML = cart
    .map((line) => {
      const p = getProduct(line.productId);
      if (!p) return '';
      return `
      <div class="cart-line" data-product-id="${p.id}">
        <img class="cart-line__img" src="${escapeHtml(p.img)}" alt="${escapeHtml(p.name)}" loading="lazy" />
        <div class="cart-line__info">
          <div class="cart-line__top">
            <strong>${escapeHtml(p.name)}</strong>
            <button type="button" class="cart-remove" data-id="${p.id}" aria-label="Remove ${escapeHtml(p.name)}">×</button>
          </div>
          <span class="cart-line__unit">NPR ${p.price} each</span>
          <div class="cart-line__bottom">
            <div class="cart-line__actions" aria-label="Quantity controls">
              <button type="button" class="qty-btn" data-action="minus" data-id="${p.id}" aria-label="Decrease">−</button>
              <span class="cart-line__qty">${line.qty}</span>
              <button type="button" class="qty-btn" data-action="plus" data-id="${p.id}" aria-label="Increase">+</button>
            </div>
            <div class="cart-line__total">NPR ${p.price * line.qty}</div>
          </div>
        </div>
      </div>
    `;
    })
    .join('');

  renderCheckoutSummary();
}

function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  drawer?.classList.remove('hidden');
  overlay?.classList.remove('hidden');
  drawer?.setAttribute('aria-hidden', 'false');
  overlay?.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  drawer?.classList.add('hidden');
  overlay?.classList.add('hidden');
  drawer?.setAttribute('aria-hidden', 'true');
  overlay?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

function showCheckout() {
  if (cart.length === 0) {
    alert('Your cart is empty. Please add products first.');
    return;
  }
  if (getCartSubtotal() < MIN_ORDER_NPR) {
    alert(`Minimum order is NPR ${MIN_ORDER_NPR}. Please add more items.`);
    return;
  }
  closeCartDrawer();
  fillCustomerForm();
  renderCheckoutSummary();
  const checkout = document.getElementById('checkout-section');
  checkout?.classList.remove('hidden');
  checkout?.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  setTimeout(() => document.getElementById('customer-name')?.focus(), 80);
}

function hideCheckout() {
  const checkout = document.getElementById('checkout-section');
  checkout?.classList.add('hidden');
  checkout?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

function buildWhatsAppMessage(order) {
  const lines = [
    'Hello KDP Kitchen Masal, I want to confirm this order:',
    '',
    `Order ID: ${order.orderId}`,
    '',
    '--- Order Items ---',
    ...order.items.map((item, i) => `${i + 1}. ${item.name} x${item.qty} = NPR ${item.lineTotal}`),
    '',
    `Subtotal: NPR ${order.subtotal}`,
    `Delivery Zone: ${order.zoneLabel}`,
    `Delivery Fee: ${order.delivery === 0 ? 'Free' : 'NPR ' + order.delivery}`,
    `Grand Total: NPR ${order.grand}`,
    '',
    'Payment: Cash on Delivery (COD)',
    '',
    '--- Customer ---',
    `Name: ${order.name}`,
    `Phone: ${order.phone}`,
    `Address: ${order.location}`,
    `Note: ${order.note || 'N/A'}`,
  ];
  return lines.join('\n');
}

function init() {
  loadCart();

  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const exploreBtn = document.getElementById('explore-btn');

  const closeMenu = () => {
    if (!navLinks || !menuToggle) return;
    navLinks.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  const toggleMenu = () => {
    if (!navLinks || !menuToggle) return;
    const isOpen = navLinks.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  };

  menuToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  navLinks?.addEventListener('click', (e) => {
    if (!(e.target instanceof Element)) return;
    if (e.target.closest('a')) closeMenu();
  });

  document.addEventListener('click', (e) => {
    if (!navLinks || !menuToggle) return;
    if (!navLinks.classList.contains('active')) return;
    if (menuToggle.contains(e.target) || navLinks.contains(e.target)) return;
    closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      closeCartDrawer();
      hideCheckout();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) closeMenu();
  });

  exploreBtn?.addEventListener('click', () =>
    document.querySelector('.products')?.scrollIntoView({ behavior: 'smooth' })
  );

  renderCategoryBar();
  renderDeliveryZones();
  renderFaq();
  populateDeliverySelect();
  renderProducts();
  updateCartUI();

  document.getElementById('product-search')?.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderProducts();
  });

  document.getElementById('category-bar')?.addEventListener('click', (e) => {
    if (!(e.target instanceof Element)) return;
    const chip = e.target.closest('.category-chip');
    if (!chip) return;
    activeCategory = chip.getAttribute('data-category') || 'all';
    renderCategoryBar();
    renderProducts();
  });

  document.getElementById('product-list')?.addEventListener('click', (e) => {
    if (!(e.target instanceof Element)) return;
    const btn = e.target.closest('.add-cart-btn');
    if (!btn) return;
    const id = btn.getAttribute('data-product-id');
    if (!id) return;
    addToCart(id, 1);
    btn.textContent = 'Added ✓';
    setTimeout(() => {
      btn.textContent = 'Add to Cart';
    }, 1200);
  });

  document.getElementById('cart-fab')?.addEventListener('click', openCartDrawer);
  document.getElementById('mobile-cart-btn')?.addEventListener('click', openCartDrawer);
  document.getElementById('cart-close-btn')?.addEventListener('click', closeCartDrawer);
  document.getElementById('cart-overlay')?.addEventListener('click', closeCartDrawer);

  document.getElementById('cart-items')?.addEventListener('click', (e) => {
    if (!(e.target instanceof Element)) return;
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    if (!id) return;
    const line = cart.find((l) => l.productId === id);
    if (!line) return;
    if (btn.classList.contains('cart-remove')) {
      setCartQty(id, 0);
      return;
    }
    const action = btn.getAttribute('data-action');
    if (action === 'plus') setCartQty(id, line.qty + 1);
    if (action === 'minus') setCartQty(id, line.qty - 1);
  });

  document.getElementById('cart-checkout-btn')?.addEventListener('click', showCheckout);

  document.getElementById('checkout-close-btn')?.addEventListener('click', hideCheckout);
  document.getElementById('checkout-cancel-btn')?.addEventListener('click', hideCheckout);
  document.getElementById('checkout-section')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) hideCheckout();
  });

  document.getElementById('delivery-zone')?.addEventListener('change', updateCheckoutTotals);

  document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const subtotal = getCartSubtotal();
    if (subtotal < MIN_ORDER_NPR) {
      alert(`Minimum order is NPR ${MIN_ORDER_NPR}.`);
      return;
    }

    const name = document.getElementById('customer-name')?.value.trim();
    const phone = document.getElementById('customer-phone')?.value.trim();
    const location = document.getElementById('customer-location')?.value.trim();
    const zoneId = document.getElementById('delivery-zone')?.value || 'janakpur';
    const note = document.getElementById('customer-note')?.value.trim();

    if (!name || !phone || !location) {
      alert('Please fill name, phone, and address.');
      return;
    }

    const zone = DELIVERY_ZONES.find((z) => z.id === zoneId);
    const delivery = getDeliveryFee(zoneId);
    const grand = subtotal + delivery;
    const orderId = generateOrderId();

    const items = cart
      .map((line) => {
        const p = getProduct(line.productId);
        if (!p) return null;
        return {
          name: p.name,
          qty: line.qty,
          lineTotal: p.price * line.qty,
        };
      })
      .filter(Boolean);

    saveCustomer({ name, phone, location, deliveryZone: zoneId, note });

    const message = buildWhatsAppMessage({
      orderId,
      items,
      subtotal,
      delivery,
      grand,
      zoneLabel: zone?.label || zoneId,
      name,
      phone,
      location,
      note,
    });

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');

    cart = [];
    saveCart();
    updateCartUI();
    hideCheckout();
  });
}

document.addEventListener('DOMContentLoaded', init);
