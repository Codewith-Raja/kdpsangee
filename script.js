const PRODUCTS = [
    { id: '001', name: 'Mustard Oil (Yellow) 1000ml', price: 390, img: 't6.png' },
    { id: '002', name: 'Mustard Oil (Yellow) 500ml', price: 200, img: 't6.png' },

    { id: '003', name: 'Mustard Oil (Black) 500ml', price: 185, img: 't6.png' },
    { id: '004', name: 'Mustard Oil (Black) 1000ml', price: 370, img: 't6.png' },

    { id: '005', name: 'Chilli Powder 50g', price: 41, img: 't1.png' },
    { id: '007', name: 'Chilli Powder 100g', price: 81, img: 't1.png' },
    { id: '008', name: 'Chilli Powder 200g', price: 146, img: 't1.png' },
    { id: '009', name: 'Chilli Powder 500g', price: 336, img: 't1.png' },
  
    { id: '010', name: 'Turmeric Powder 50g', price: 36, img: 't3.png' },
    { id: '006', name: 'Turmeric Powder 100g', price: 76, img: 't3.png' },
    { id: '011', name: 'Turmeric Powder 200g', price: 126, img: 't3.png' },
    { id: '012', name: 'Turmeric Powder 500g', price: 276, img: 't3.png' },
  
    { id: '013', name: 'Coriander Powder 50g', price: 36, img: 't2.png' },
    { id: '014', name: 'Coriander Powder 100g', price: 76, img: 't2.png' },
    { id: '015', name: 'Coriander Powder 200g', price: 126, img: 't2.png' },
    { id: '016', name: 'Coriander Powder 500g', price: 276, img: 't2.png' },

    { id: '017', name: 'Shahi Garam Masala 50g', price: 90, img: 't7.png' },
    { id: '018', name: 'Shahi Garam Masala 100g', price: 180, img: 't7.png' },
   
  ];
  
  const WHATSAPP_NUMBER = '9779841938951';
  let selectedProduct = null;

  function renderProducts(filterText = '') {
    const list = document.getElementById('product-list');
    if (!list) return;
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
        <button class="btn btn-primary order-btn" type="button" data-product-id="${p.id}">Order on WhatsApp</button>
      `;
      list.appendChild(card);
    });
  }

  function setSelectedProduct(product) {
    selectedProduct = product;
    const productInput = document.getElementById('order-product');
    const productIdInput = document.getElementById('order-product-id');
    const priceInput = document.getElementById('order-price');
    const qtyInput = document.getElementById('order-qty');

    if (productInput) productInput.value = product.name;
    if (productIdInput) productIdInput.value = product.id;
    if (priceInput) priceInput.value = String(product.price);
    if (qtyInput && Number(qtyInput.value) < 1) qtyInput.value = '1';
  }

  function buildWhatsAppMessage(orderDetails) {
    return [
      'Hello KDP Kitchen Masal, I want to confirm this order:',
      '',
      `Product: ${orderDetails.productName}`,
      `Product ID: ${orderDetails.productId}`,
      `Price: NPR ${orderDetails.price}`,
      `Quantity: ${orderDetails.quantity}`,
      `Total: NPR ${orderDetails.total}`,
      '',
      'Customer Details:',
      `Name: ${orderDetails.name}`,
      `Phone: ${orderDetails.phone}`,
      `Location: ${orderDetails.location}`,
      `Note: ${orderDetails.note || 'N/A'}`,
    ].join('\n');
  }

  function showOrderSection() {
    document.getElementById('order-section')?.classList.remove('hidden');
  }

  function hideOrderSection() {
    document.getElementById('order-section')?.classList.add('hidden');
  }

  function resetOrderForm() {
    selectedProduct = null;
    const orderForm = document.getElementById('order-form');
    orderForm?.reset();
    const qtyInput = document.getElementById('order-qty');
    if (qtyInput) qtyInput.value = '1';
    ['order-product', 'order-product-id', 'order-price'].forEach((id) => {
      const input = document.getElementById(id);
      if (input) input.value = '';
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

    const productList = document.getElementById('product-list');
    const orderForm = document.getElementById('order-form');
    const orderCloseBtn = document.getElementById('order-close-btn');

    productList?.addEventListener('click', (e) => {
      if (!(e.target instanceof Element)) return;
      const button = e.target.closest('.order-btn');
      if (!button) return;
      const productId = button.getAttribute('data-product-id');
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product) return;

      setSelectedProduct(product);
      showOrderSection();
      document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.getElementById('customer-name')?.focus();
    });

    orderCloseBtn?.addEventListener('click', () => {
      hideOrderSection();
      resetOrderForm();
    });

    orderForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!selectedProduct) {
        alert('Please select a product first.');
        document.querySelector('.products')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      const name = document.getElementById('customer-name')?.value.trim();
      const phone = document.getElementById('customer-phone')?.value.trim();
      const location = document.getElementById('customer-location')?.value.trim();
      const qty = Number(document.getElementById('order-qty')?.value || 1);
      const note = document.getElementById('customer-note')?.value.trim();

      if (!name || !phone || !location || qty < 1) {
        alert('Please fill all required fields correctly.');
        return;
      }

      const details = {
        productName: selectedProduct.name,
        productId: selectedProduct.id,
        price: selectedProduct.price,
        quantity: qty,
        total: selectedProduct.price * qty,
        name,
        phone,
        location,
        note,
      };

      const message = buildWhatsAppMessage(details);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener');
      hideOrderSection();
      resetOrderForm();
    });
  }
  
  document.addEventListener('DOMContentLoaded', init);
