/* Traditional Artistry Work - Main App with Supabase */

let products = [];
let cart = JSON.parse(localStorage.getItem('ta_cart') || '[]');
let currentModalColor = 0;

// ========== LOAD PRODUCTS FROM SUPABASE ==========
async function loadProducts() {
  const grid = document.getElementById('products-grid');
  if (grid) {
    grid.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500">Loading products...</div>`;
  }

  try {
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    products = data || [];
    renderProducts('all');
  } catch (err) {
    console.error('Error loading products:', err);
    if (grid) {
      grid.innerHTML = `<div class="col-span-full text-center py-12 text-red-600">
        <p>Unable to load products. Please try again later.</p>
        <p class="text-sm mt-2">Admin can add products from the Admin Panel.</p>
      </div>`;
    }
  }
}

// ========== RENDER PRODUCTS ==========
function renderProducts(filter = 'all') {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full empty-state">
        <p class="text-lg">No products available yet.</p>
        <p class="text-sm mt-2">Products will appear here once the admin adds them.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-image-wrap">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <img src="${p.image_url || ''}" alt="${p.name}" loading="lazy"
          onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22600%22%3E%3Crect fill=%22%23F5E6C8%22 width=%22600%22 height=%22600%22/%3E%3Ctext fill=%22%239B1B1B%22 font-family=%22sans-serif%22 font-size=%2220%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3ENo Image%3C/text%3E%3C/svg%3E'">
      </div>
      <div class="product-body">
        <p class="product-category">${(p.category || '').replace('-', ' ')}</p>
        <h3 class="product-title">${p.name}</h3>
        <p class="product-desc">${p.description || ''}</p>
        <p class="product-price">Rs. ${Number(p.total_price || p.price).toLocaleString('en-PK')}</p>
        <div class="product-actions">
          <button class="btn-view" onclick="openProductModal(${p.id})">View Details</button>
          <button class="btn-add" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </div>
    </article>
  `).join('');
}

// ========== PRODUCT MODAL ==========
function openProductModal(id) {
  const p = products.find(pr => pr.id === id);
  if (!p) return;
  currentModalColor = 0;

  const modal = document.getElementById('product-modal');
  const content = document.getElementById('modal-content');

  const colors = p.colors || [];
  const colorNames = p.color_names || [];
  const features = p.features || [];

  content.innerHTML = `
    <button id="close-modal" class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white" aria-label="Close">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
    <div class="modal-grid">
      <div class="modal-image">
        <img src="${p.image_url || ''}" alt="${p.name}">
      </div>
      <div class="modal-body">
        <p class="text-sm font-medium text-teal-700 uppercase tracking-wider mb-1">${(p.category || '').replace('-', ' ')}</p>
        <h2 class="font-display text-2xl md:text-3xl font-bold text-red-900 mb-3">${p.name}</h2>
        <p class="text-gray-700 mb-4 leading-relaxed">${p.description || ''}</p>
        
        ${colors.length ? `
        <div class="mb-4">
          <p class="text-sm font-medium text-gray-600 mb-2">Available Colors</p>
          <div class="flex gap-2 flex-wrap">
            ${colors.map((c, i) => `
              <button class="color-swatch ${i === 0 ? 'selected' : ''}" style="background:${c}" 
                title="${colorNames[i] || c}" onclick="selectColor(${i})"></button>
            `).join('')}
          </div>
          <p class="text-sm text-gray-600 mt-1">Selected: <span id="selected-color-name" class="font-semibold text-red-900">${colorNames[0] || 'Default'}</span></p>
        </div>` : ''}

        <div class="bg-amber-50 rounded-xl p-4 mb-5 space-y-1">
          <div class="detail-row">
            <span class="detail-label">Price</span>
            <span class="detail-value text-red-700 text-lg">Rs. ${Number(p.price).toLocaleString('en-PK')}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">TCS Shipping</span>
            <span class="detail-value">Rs. ${Number(p.tcs_cost || 0).toLocaleString('en-PK')}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Total</span>
            <span class="detail-value text-red-900 text-lg">Rs. ${Number(p.total_price || p.price).toLocaleString('en-PK')}</span>
          </div>
          ${p.quality ? `<div class="detail-row"><span class="detail-label">Quality</span><span class="detail-value text-sm">${p.quality}</span></div>` : ''}
        </div>

        ${features.length ? `
        <div class="mb-5">
          <p class="text-sm font-medium text-gray-600 mb-2">Features</p>
          <ul class="grid grid-cols-2 gap-1 text-sm text-gray-700">
            ${features.map(f => `<li class="flex items-center gap-1.5"><span class="text-amber-600">✓</span> ${f}</li>`).join('')}
          </ul>
        </div>` : ''}

        <button class="btn-primary w-full" onclick="addToCart(${p.id}, currentModalColor); closeProductModal();">
          Add to Cart
        </button>
        <p class="text-xs text-gray-500 mt-3 text-center">COD available • Shipped via TCS</p>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  document.getElementById('close-modal').onclick = closeProductModal;
  document.getElementById('modal-overlay').onclick = closeProductModal;
}

function selectColor(index) {
  currentModalColor = index;
  document.querySelectorAll('.color-swatch').forEach((el, i) => el.classList.toggle('selected', i === index));
  const p = products.find(pr => pr.id === parseInt(document.querySelector('#modal-content .btn-primary')?.getAttribute('onclick')?.match(/\d+/)?.[0] || 0));
  const nameEl = document.getElementById('selected-color-name');
  if (nameEl && p && p.color_names) nameEl.textContent = p.color_names[index] || 'Selected';
}

function closeProductModal() {
  document.getElementById('product-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

// ========== CART ==========
function saveCart() {
  localStorage.setItem('ta_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId, colorIndex = 0, qty = 1) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const colorName = (product.color_names && product.color_names[colorIndex]) || 'Default';
  const existing = cart.find(item => item.id === productId && item.colorIndex === colorIndex);
  if (existing) existing.qty += qty;
  else cart.push({ id: productId, colorIndex, colorName, qty });

  saveCart();
  showToast(`${product.name} added to cart`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

function updateQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty < 1) cart.splice(index, 1);
  saveCart();
}

function getCartTotals() {
  let subtotal = 0;
  cart.forEach(item => {
    const p = products.find(pr => pr.id === item.id);
    if (p) subtotal += Number(p.total_price || p.price) * item.qty;
  });
  return { subtotal, total: subtotal };
}

function updateCartUI() {
  const countEl = document.getElementById('cart-count');
  const itemsEl = document.getElementById('cart-items');
  const { subtotal, total } = getCartTotals();
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  if (countEl) countEl.textContent = totalQty;

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="empty-state"><p>Your cart is empty</p></div>`;
  } else {
    itemsEl.innerHTML = cart.map((item, idx) => {
      const p = products.find(pr => pr.id === item.id);
      if (!p) return '';
      return `
        <div class="cart-item">
          <img src="${p.image_url || ''}" alt="${p.name}" class="cart-item-img">
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm text-red-900 leading-tight">${p.name}</p>
            <p class="text-xs text-gray-500">${item.colorName}</p>
            <p class="text-sm font-bold text-red-700 mt-0.5">Rs. ${Number(p.total_price || p.price).toLocaleString('en-PK')}</p>
            <div class="flex items-center gap-2 mt-1">
              <button class="cart-qty-btn" onclick="updateQty(${idx}, -1)">−</button>
              <span class="text-sm font-medium w-6 text-center">${item.qty}</span>
              <button class="cart-qty-btn" onclick="updateQty(${idx}, 1)">+</button>
              <button class="ml-auto text-xs text-red-600" onclick="removeFromCart(${idx})">Remove</button>
            </div>
          </div>
        </div>`;
    }).join('');
  }

  const subEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  if (subEl) subEl.textContent = 'Rs. ' + subtotal.toLocaleString('en-PK');
  if (totalEl) totalEl.textContent = 'Rs. ' + total.toLocaleString('en-PK');
}

function openCart() {
  document.getElementById('cart-sidebar')?.classList.remove('translate-x-full');
  document.getElementById('cart-backdrop')?.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cart-sidebar')?.classList.add('translate-x-full');
  document.getElementById('cart-backdrop')?.classList.add('hidden');
  document.body.style.overflow = '';
}

function showToast(msg) {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-900 text-white px-6 py-3 rounded-xl shadow-lg z-[100] text-sm font-medium';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// ========== CHECKOUT via WhatsApp ==========
function openCheckout() {
  if (cart.length === 0) { showToast('Your cart is empty'); return; }
  closeCart();

  const { total } = getCartTotals();
  const lines = cart.map(item => {
    const p = products.find(pr => pr.id === item.id);
    return `• ${p?.name} (${item.colorName}) × ${item.qty}`;
  }).join('%0A');

  const message = `*New Order - Traditional Artistry Work*%0A%0A${lines}%0A%0A*Total: Rs. ${total.toLocaleString('en-PK')}*%0A%0APlease confirm.`;
  const waUrl = `https://wa.me/923333882131?text=${message}`;
  window.open(waUrl, '_blank');
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  updateCartUI();

  document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
    document.getElementById('mobile-menu')?.classList.toggle('hidden');
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.filter);
    });
  });

  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.category;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      const target = document.querySelector(`.filter-btn[data-filter="${cat}"]`);
      if (target) target.classList.add('active');
      renderProducts(cat);
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.getElementById('cart-btn')?.addEventListener('click', openCart);
  document.getElementById('close-cart')?.addEventListener('click', closeCart);
  document.getElementById('cart-backdrop')?.addEventListener('click', closeCart);
  document.getElementById('checkout-btn')?.addEventListener('click', openCheckout);

  // Contact form
  document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    status.classList.remove('hidden');
    status.className = 'text-sm text-center text-green-700 font-medium';
    status.textContent = 'Thank you! Please also message us on WhatsApp for faster response.';
    e.target.reset();
  });
});

window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.addToCart = addToCart;
window.updateQty = updateQty;
window.removeFromCart = removeFromCart;
window.selectColor = selectColor;
window.currentModalColor = currentModalColor;
