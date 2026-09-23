/* ============================================================
   Traditional Artistry Work – Customer App (Supabase)
   Original features + orders/reviews/tracking/stores/ticker
   + Payment verification warnings + Clear Cart Feature
   ============================================================ */

// ============ STATE ============
let products = [];
let cart = JSON.parse(localStorage.getItem('ta_cart') || '[]');
let currentModalColor = 0;
let currentModalProductId = null;
let selectedRating = 0;
let settings = {};

// ============ HELPERS ============
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* ============================================================
   LOAD PRODUCTS
============================================================ */
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

/* ============================================================
   RENDER PRODUCTS
============================================================ */
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

  grid.innerHTML = filtered.map(p => {
    const basePrice = Number(p.price || 0);
    const finalPrice = Number(p.total_price || p.price || 0);
    const disc = Number(p.discount_percent || 0);
    const hasDiscount = disc > 0;

    return `
    <article class="product-card" data-id="${p.id}">
      <div class="product-image-wrap">
        ${p.badge ? `<span class="product-badge">${esc(p.badge)}</span>` : ''}
        ${hasDiscount ? `<span class="discount-badge">-${disc}% OFF</span>` : ''}
        <img src="${esc(p.image_url || '')}" alt="${esc(p.name)}" loading="lazy"
          onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22600%22%3E%3Crect fill=%22%23F5E6C8%22 width=%22600%22 height=%22600%22/%3E%3Ctext fill=%22%239B1B1B%22 font-family=%22sans-serif%22 font-size=%2220%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3ENo Image%3C/text%3E%3C/svg%3E'">
      </div>
      <div class="product-body">
        <p class="product-category">${esc((p.category || '').replace('-', ' '))}</p>
        <h3 class="product-title">${esc(p.name)}</h3>
        <p class="product-desc">${esc(p.description || '')}</p>
        <p class="product-price">
          ${hasDiscount ? `<span class="product-price-old">${money(basePrice)}</span>` : ''}
          ${money(finalPrice)}
        </p>
        <div class="product-actions">
          <button class="btn-view" onclick="openProductModal(${p.id})">View Details</button>
          <button class="btn-add" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </div>
    </article>`;
  }).join('');
}

/* ============================================================
   PRODUCT MODAL
============================================================ */
async function openProductModal(id) {
  const p = products.find(pr => pr.id === id);
  if (!p) return;
  currentModalColor = 0;
  currentModalProductId = id;
  selectedRating = 0;

  const modal = document.getElementById('product-modal');
  const content = document.getElementById('modal-content');

  const colors = p.colors || [];
  const colorNames = p.color_names || [];
  const features = p.features || [];

  const basePrice = Number(p.price || 0);
  const finalPrice = Number(p.total_price || p.price || 0);
  const disc = Number(p.discount_percent || 0);
  const hasDiscount = disc > 0;

  content.innerHTML = `
    <button id="close-modal" class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white" aria-label="Close">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
    <div class="modal-grid">
      <div class="modal-image">
        <img src="${esc(p.image_url || '')}" alt="${esc(p.name)}">
      </div>
      <div class="modal-body">
        <p class="text-sm font-medium text-teal-700 uppercase tracking-wider mb-1">${esc((p.category || '').replace('-', ' '))}</p>
        <h2 class="font-display text-2xl md:text-3xl font-bold text-red-900 mb-3">${esc(p.name)}</h2>
        <p class="text-gray-700 mb-4 leading-relaxed">${esc(p.description || '')}</p>
        
        ${colors.length ? `
        <div class="mb-4">
          <p class="text-sm font-medium text-gray-600 mb-2">Available Colors</p>
          <div class="flex gap-2 flex-wrap">
            ${colors.map((c, i) => `
              <button class="color-swatch ${i === 0 ? 'selected' : ''}" style="background:${esc(c)}" 
                title="${esc(colorNames[i] || c)}" onclick="selectColor(${i})"></button>
            `).join('')}
          </div>
          <p class="text-sm text-gray-600 mt-1">Selected: <span id="selected-color-name" class="font-semibold text-red-900">${esc(colorNames[0] || 'Default')}</span></p>
        </div>` : ''}

        <div class="bg-amber-50 rounded-xl p-4 mb-5 space-y-1">
          ${hasDiscount ? `<div class="detail-row"><span class="detail-label">Original Price</span><span class="detail-value"><span class="product-price-old">${money(basePrice)}</span></span></div>` : ''}
          <div class="detail-row">
            <span class="detail-label">${hasDiscount ? 'Discounted Price' : 'Price'}</span>
            <span class="detail-value text-red-700 text-lg">${money(finalPrice - Number(p.tcs_cost || 0))}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">TCS Shipping</span>
            <span class="detail-value">${money(p.tcs_cost || 0)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Total</span>
            <span class="detail-value text-red-900 text-lg">${money(finalPrice)}</span>
          </div>
          ${p.quality ? `<div class="detail-row"><span class="detail-label">Quality</span><span class="detail-value text-sm">${esc(p.quality)}</span></div>` : ''}
        </div>

        <div class="advance-info-box mb-5">
          <h4>💳 Advance Payment Required</h4>
          <p>To confirm your order and dispatch via TCS, a <b>50% advance</b> is required.<br>
          Advance amount for this item: <span class="advance-amount" id="advance-amount">${money(Math.round(finalPrice * 0.5))}</span></p>
        </div>

        ${features.length ? `
        <div class="mb-5">
          <p class="text-sm font-medium text-gray-600 mb-2">Features</p>
          <ul class="grid grid-cols-2 gap-1 text-sm text-gray-700">
            ${features.map(f => `<li class="flex items-center gap-1.5"><span class="text-amber-600">✓</span> ${esc(f)}</li>`).join('')}
          </ul>
        </div>` : ''}

        <button class="btn-primary w-full" onclick="addToCart(${p.id}, currentModalColor); closeProductModal();">
          Add to Cart
        </button>
        <p class="text-xs text-gray-500 mt-3 text-center">COD available • Shipped via TCS</p>
      </div>
    </div>

    <!-- ============ REVIEWS SECTION ============ -->
    <div class="border-t border-amber-100 mt-2">
      <div class="p-6">
        <h3 class="font-display text-xl font-bold text-red-900 mb-4">⭐ Customer Reviews</h3>
        <div id="modal-reviews" class="space-y-3 mb-6">
          <p class="text-sm text-gray-400">Loading reviews...</p>
        </div>

        <div class="bg-amber-50 rounded-xl p-4">
          <h4 class="font-semibold text-red-900 mb-3 text-sm">Write a Review</h4>
          <div class="star-input mb-3" id="star-input">
            ${[1,2,3,4,5].map(i => `<span data-value="${i}">★</span>`).join('')}
          </div>
          <div class="grid md:grid-cols-2 gap-3 mb-3">
            <input type="text" id="rev-name" class="form-input" placeholder="Your Name *" maxlength="60">
            <input type="tel" id="rev-phone" class="form-input" placeholder="Phone (optional)" maxlength="20">
          </div>
          <textarea id="rev-comment" rows="3" maxlength="500" class="form-input mb-3" placeholder="Share your experience... *"></textarea>
          <button id="submit-review-btn" class="btn-primary w-full" onclick="submitReview()">Submit Review</button>
          <p class="text-xs text-gray-500 mt-2 text-center">Your review will appear after admin approval.</p>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  document.getElementById('close-modal').onclick = closeProductModal;
  document.getElementById('modal-overlay').onclick = closeProductModal;

  const starBox = document.getElementById('star-input');
  if (starBox) {
    starBox.querySelectorAll('span').forEach(span => {
      span.addEventListener('click', () => {
        selectedRating = Number(span.dataset.value);
        starBox.querySelectorAll('span').forEach(s => {
          s.classList.toggle('active', Number(s.dataset.value) <= selectedRating);
        });
      });
      span.addEventListener('mouseenter', () => {
        const val = Number(span.dataset.value);
        starBox.querySelectorAll('span').forEach(s => {
          s.style.color = Number(s.dataset.value) <= val ? '#C9A227' : '#E5E0D5';
        });
      });
    });
    starBox.addEventListener('mouseleave', () => {
      starBox.querySelectorAll('span').forEach(s => {
        s.style.color = '';
        s.classList.toggle('active', Number(s.dataset.value) <= selectedRating);
      });
    });
  }

  loadProductReviews(id);
}

function selectColor(index) {
  currentModalColor = index;
  document.querySelectorAll('.color-swatch').forEach((el, i) => el.classList.toggle('selected', i === index));
  const p = products.find(pr => pr.id === currentModalProductId);
  const nameEl = document.getElementById('selected-color-name');
  if (nameEl && p && p.color_names) nameEl.textContent = p.color_names[index] || 'Selected';
}

function closeProductModal() {
  document.getElementById('product-modal').classList.add('hidden');
  document.body.style.overflow = '';
  currentModalProductId = null;
  selectedRating = 0;
}

/* ============================================================
   REVIEWS
============================================================ */
async function loadProductReviews(productId) {
  const box = document.getElementById('modal-reviews');
  if (!box) return;

  try {
    const { data, error } = await supabaseClient
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    if (!data || data.length === 0) {
      box.innerHTML = '<p class="text-sm text-gray-400">No reviews yet. Be the first to review!</p>';
      return;
    }

    const avg = (data.reduce((a, r) => a + (r.rating || 0), 0) / data.length).toFixed(1);

    box.innerHTML = `
      <div class="flex items-center gap-3 mb-3 pb-3 border-b border-amber-100">
        <div class="text-3xl font-bold text-amber-600">${avg}</div>
        <div>
          <div class="star-display">${'★'.repeat(Math.round(avg))}<span class="star-empty">${'★'.repeat(5 - Math.round(avg))}</span></div>
          <p class="text-xs text-gray-500">${data.length} review${data.length === 1 ? '' : 's'}</p>
        </div>
      </div>
      ${data.map(r => `
        <div class="review-card">
          <div class="review-head">
            <div class="review-avatar">${esc((r.customer_name || 'A')[0].toUpperCase())}</div>
            <div class="flex-1">
              <p class="font-semibold text-sm text-red-900">${esc(r.customer_name || 'Anonymous')}</p>
              <div class="star-display text-sm">${'★'.repeat(r.rating || 0)}<span class="star-empty">${'★'.repeat(5 - (r.rating || 0))}</span></div>
            </div>
          </div>
          <p class="review-body">${esc(r.comment || '')}</p>
          <p class="review-meta">${new Date(r.created_at).toLocaleDateString('en-PK', { year:'numeric', month:'short', day:'numeric' })}</p>
        </div>`).join('')}
    `;
  } catch (err) {
    console.error('Reviews load error:', err);
    box.innerHTML = '<p class="text-sm text-red-500">Unable to load reviews.</p>';
  }
}

async function submitReview() {
  if (!currentModalProductId) return;

  const name = document.getElementById('rev-name')?.value.trim();
  const phone = document.getElementById('rev-phone')?.value.trim();
  const comment = document.getElementById('rev-comment')?.value.trim();

  if (!name) { showToast('Please enter your name', 'error'); return; }
  if (selectedRating < 1) { showToast('Please select a star rating', 'error'); return; }
  if (!comment || comment.length < 5) { showToast('Please write a short comment', 'error'); return; }

  const btn = document.getElementById('submit-review-btn');
  btn.disabled = true;
  btn.textContent = 'Submitting...';

  try {
    const { error } = await supabaseClient.from('reviews').insert({
      product_id: currentModalProductId,
      customer_name: name,
      phone: phone || null,
      rating: selectedRating,
      comment,
      is_approved: false
    });

    if (error) throw error;

    showToast('✅ Review submitted! It will appear after approval.', 'success');

    document.getElementById('rev-name').value = '';
    document.getElementById('rev-phone').value = '';
    document.getElementById('rev-comment').value = '';
    selectedRating = 0;
    document.querySelectorAll('#star-input span').forEach(s => { s.classList.remove('active'); s.style.color = ''; });
  } catch (err) {
    console.error('Review submit error:', err);
    showToast('Error: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Submit Review';
  }
}

/* ============================================================
   CART
============================================================ */
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
  showToast(`${product.name} added to cart`, 'success');
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
          <img src="${esc(p.image_url || '')}" alt="${esc(p.name)}" class="cart-item-img">
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm text-red-900 leading-tight">${esc(p.name)}</p>
            <p class="text-xs text-gray-500">${esc(item.colorName)}</p>
            <p class="text-sm font-bold text-red-700 mt-0.5">${money(Number(p.total_price || p.price))}</p>
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
  if (subEl) subEl.textContent = money(subtotal);
  if (totalEl) totalEl.textContent = money(total);
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

/* ============================================================
   CHECKOUT MODAL
   (now with VERIFY-BEFORE-YOU-PAY warning box)
============================================================ */
function openCheckout() {
  if (cart.length === 0) { showToast('Your cart is empty', 'error'); return; }
  closeCart();

  const { total } = getCartTotals();
  const advancePercent = Number(settings.advance_percent || 50);
  const advanceAmount = Math.round(total * advancePercent / 100);
  const balanceAmount = total - advanceAmount;

  const jazzcash = settings.payment_jazzcash || '0333-3882131';
  const easypaisa = settings.payment_easypaisa || '0337-031234';
  const bank = settings.payment_bank || '(Contact us on WhatsApp for bank details)';
  const title = settings.payment_title || 'Safdar Hussain';

  const itemsHtml = cart.map(item => {
    const p = products.find(pr => pr.id === item.id);
    return `<div class="flex justify-between text-sm"><span>${esc(p?.name)} (${esc(item.colorName)}) × ${item.qty}</span><span class="font-semibold">${money(Number(p?.total_price || p?.price) * item.qty)}</span></div>`;
  }).join('');

  const html = `
    <div class="admin-modal-bg" id="checkout-bg"></div>
    <div class="admin-modal-panel" style="max-width:560px;position:relative;z-index:51;">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-red-900">Complete Your Order</h3>
        <button onclick="closeCheckout()" class="text-2xl leading-none text-gray-400 hover:text-gray-700">&times;</button>
      </div>

      <div class="bg-amber-50 rounded-xl p-4 mb-4 space-y-1">
        ${itemsHtml}
        <div class="flex justify-between text-base font-bold text-red-900 border-t border-amber-200 pt-2 mt-2">
          <span>Total</span><span>${money(total)}</span>
        </div>
      </div>

      <div class="space-y-3 mb-4">
        <div>
          <label class="block text-sm font-medium mb-1">Full Name *</label>
          <input id="co-name" class="form-input" placeholder="Your full name" maxlength="80">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium mb-1">Phone / WhatsApp *</label>
            <input id="co-phone" type="tel" class="form-input" placeholder="03XX XXXXXXX" maxlength="20">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">City *</label>
            <input id="co-city" class="form-input" placeholder="e.g. Quetta" maxlength="60">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Full Address *</label>
          <textarea id="co-address" rows="2" class="form-input" placeholder="House / street / area / postal code" maxlength="300"></textarea>
        </div>
      </div>

      <!-- ============ OFFICIAL NUMBERS VERIFICATION BOX ============ -->
      <div style="background:#FEF2F2;border:2px solid #DC2626;border-radius:0.85rem;padding:1rem;margin-bottom:1rem;">
        <p style="font-weight:800;color:#991B1B;font-size:0.9rem;margin-bottom:0.5rem;">🔒 VERIFY BEFORE YOU PAY</p>
        <p style="font-size:0.8rem;color:#7F1D1D;line-height:1.5;">
          Pay ONLY to the numbers below. If any number looks different in WhatsApp or SMS — <b>STOP and call 0333-3882131</b> before sending money.
        </p>
        <div style="background:#fff;border-radius:0.6rem;padding:0.7rem;margin-top:0.6rem;font-size:0.83rem;">
          <p style="margin:0.2rem 0;"><b>📱 EasyPaisa:</b> 0337-031234</p>
          <p style="margin:0.2rem 0;"><b>📱 JazzCash:</b> ${esc(jazzcash)}</p>
          ${bank && !bank.includes('Contact') ? `<p style="margin:0.2rem 0;"><b>🏦 Bank:</b> ${esc(bank)}</p>` : ''}
          <p style="margin:0.2rem 0;"><b>👤 Account Title:</b> ${esc(title)}</p>
          <p style="margin:0.2rem 0;"><b>📞 Official WhatsApp:</b> 0333-3882131</p>
        </div>
      </div>

      <div class="advance-info-box mb-4">
        <h4>💳 Advance Payment (${advancePercent}%)</h4>
        <p>Please send <span class="advance-amount">${money(advanceAmount)}</span> to any account above, then upload a screenshot of the transfer.</p>
        <p class="mt-2 text-xs"><b>Balance on delivery (COD):</b> ${money(balanceAmount)}</p>
      </div>

      <div class="space-y-3 mb-4">
        <div>
          <label class="block text-sm font-medium mb-1">Payment Method *</label>
          <select id="co-method" class="form-input">
            <option value="EasyPaisa">EasyPaisa</option>
            <option value="JazzCash">JazzCash</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Payment Screenshot *</label>
          <input type="file" id="co-proof" accept="image/*" class="form-input">
          <p class="text-xs text-gray-500 mt-1">Upload the transfer receipt — admin will verify before dispatch.</p>
        </div>
      </div>

      <button id="co-submit" class="btn-primary w-full" onclick="submitOrder()">Place Order</button>
      <p class="text-xs text-gray-500 mt-2 text-center">After placing the order, we'll contact you on WhatsApp with confirmation and TCS tracking.</p>
    </div>
  `;

  let host = document.getElementById('checkout-modal');
  if (!host) {
    host = document.createElement('div');
    host.id = 'checkout-modal';
    host.className = 'fixed inset-0 z-[70] overflow-y-auto';
    document.body.appendChild(host);
  }
  host.innerHTML = html;
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  const host = document.getElementById('checkout-modal');
  if (host) host.innerHTML = '';
  document.body.style.overflow = '';
}

async function submitOrder() {
  const name = document.getElementById('co-name')?.value.trim();
  const phone = document.getElementById('co-phone')?.value.trim();
  const city = document.getElementById('co-city')?.value.trim();
  const address = document.getElementById('co-address')?.value.trim();
  const method = document.getElementById('co-method')?.value;
  const proofFile = document.getElementById('co-proof')?.files[0];

  if (!name || !phone || !city || !address) { showToast('Please fill all required fields', 'error'); return; }
  if (!proofFile) { showToast('Please upload your payment screenshot', 'error'); return; }

  const btn = document.getElementById('co-submit');
  btn.disabled = true;
  btn.textContent = 'Uploading...';

  try {
    const fileName = `payment_${Date.now()}_${proofFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const { error: upErr } = await supabaseClient.storage
      .from('payment-proofs')
      .upload(fileName, proofFile);

    if (upErr) throw upErr;
    const proofUrl = supabaseClient.storage.from('payment-proofs').getPublicUrl(fileName).data.publicUrl;

    const items = cart.map(item => {
      const p = products.find(pr => pr.id === item.id);
      return {
        product_id: p.id,
        name: p.name,
        color: item.colorName,
        qty: item.qty,
        price: Number(p.total_price || p.price),
        cost: Number(p.cost_price || 0)
      };
    });

    const { total } = getCartTotals();
    const advancePercent = Number(settings.advance_percent || 50);
    const advanceAmount = Math.round(total * advancePercent / 100);

    const orderPayload = {
      order_code: generateOrderCode(),
      customer_name: name,
      phone,
      city,
      address,
      items,
      subtotal: total,
      tcs_cost: 0,
      total,
      advance_paid: 0,
      advance_percent: advancePercent,
      payment_method: method,
      payment_proof_url: proofUrl,
      payment_status: 'submitted',
      order_status: 'new'
    };

    const { data: inserted, error: insErr } = await supabaseClient
      .from('orders')
      .insert(orderPayload)
      .select()
      .single();

    if (insErr) throw insErr;

    const adminPhone = settings.whatsapp_number || '923333882131';
    const lines = items.map(i => `• ${i.name} (${i.color}) × ${i.qty}`).join('\n');
    const adminMsg =
`🛍️ *NEW ORDER – ${inserted.order_code}*

👤 ${name}
📞 ${phone}
🏠 ${city}, ${address}

${lines}

💰 Total: ${money(total)}
💳 Advance (${advancePercent}%): ${money(advanceAmount)}
🏦 Method: ${method}

🧾 Payment proof: ${proofUrl}

🔒 VERIFY: Customer number is ${phone} — reply to them from OFFICIAL number only.`;

    await sendWhatsApp(adminPhone, adminMsg);

    showToast('✅ Order placed! We will confirm on WhatsApp shortly.', 'success');
    cart = [];
    saveCart();
    closeCheckout();

  } catch (err) {
    console.error('Order submit error:', err);
    showToast('Error: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Place Order';
  }
}

/* ============================================================
   TRACKING LOOKUP
============================================================ */
async function lookupTracking() {
  const input = document.getElementById('track-input')?.value.trim();
  const resultBox = document.getElementById('track-result');
  if (!resultBox) return;

  if (!input) {
    resultBox.innerHTML = '<p class="text-sm text-red-600">Please enter your order code or phone number.</p>';
    resultBox.classList.remove('hidden');
    return;
  }

  resultBox.classList.remove('hidden');
  resultBox.innerHTML = '<p class="text-sm text-gray-500">Searching...</p>';

  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .select('*')
      .or(`order_code.eq.${input},phone.eq.${input}`)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;

    if (!data || data.length === 0) {
      resultBox.innerHTML = '<p class="text-sm text-red-600">No order found. Please check the code or phone number.</p>';
      return;
    }

    const o = data[0];
    const statusColors = {
      new:'#1E40AF', confirmed:'#3730A3', packed:'#5B21B6',
      dispatched:'#92400E', delivered:'#065F46', cancelled:'#991B1B'
    };

    const totalNum = Number(o.total||0);
    const advanceNum = Number(o.advance_paid||0);
    const balancePaidNum = Number(o.balance_paid||0);
    const remaining = Math.max(0, totalNum - advanceNum - balancePaidNum);
    const fullyPaid = o.order_status === 'delivered' && remaining <= 0;

    resultBox.innerHTML = `
      <div class="tracking-result">
        <h4>Order ${esc(o.order_code)}</h4>
        <p class="text-sm mb-2">Status: <span class="tracking-status-pill" style="background:${statusColors[o.order_status] || '#374151'}20;color:${statusColors[o.order_status] || '#374151'}">${esc(o.order_status)}</span></p>
        ${fullyPaid ? '<p class="text-sm font-bold text-green-700 mb-2">💚 PAYMENT COMPLETE — PAID IN FULL</p>' : ''}
        ${o.tcs_tracking ? `
          <p class="text-sm mb-2">TCS Tracking ID: <b>${esc(o.tcs_tracking)}</b></p>
          <a href="https://www.tcsexpress.com/tracking?tracking_number=${encodeURIComponent(o.tcs_tracking)}" target="_blank" class="btn-primary text-sm inline-block">Track on TCS →</a>
        ` : '<p class="text-sm text-gray-500">TCS tracking ID will appear here once your order is dispatched.</p>'}

        <div class="mt-3 pt-3 border-t border-teal-200 grid grid-cols-3 gap-2 text-xs">
          <div class="bg-white rounded-lg p-2"><p class="text-gray-500">Total</p><p class="font-bold">${money(totalNum)}</p></div>
          <div class="bg-white rounded-lg p-2"><p class="text-gray-500">Advance</p><p class="font-bold text-green-700">${money(advanceNum)}</p></div>
          <div class="bg-white rounded-lg p-2"><p class="text-gray-500">Remaining</p><p class="font-bold ${remaining > 0 ? 'text-red-700' : 'text-green-700'}">${money(remaining)}</p></div>
        </div>

        <p class="text-xs text-gray-500 mt-3">Placed on ${new Date(o.created_at).toLocaleDateString('en-PK')}</p>
        <p class="text-xs text-gray-500 mt-1">🔒 Official contact: 0333-3882131</p>
      </div>
    `;
  } catch (err) {
    console.error('Tracking lookup error:', err);
    resultBox.innerHTML = '<p class="text-sm text-red-600">Error looking up order. Please try again.</p>';
  }
}

/* ============================================================
   TICKER MESSAGES
============================================================ */
async function loadTicker() {
  const host = document.getElementById('ticker-track');
  if (!host) return;
  try {
    const { data } = await supabaseClient
      .from('ticker_messages')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (data && data.length) {
      const line = data.map(t => `<span class="ta-ticker-item">${esc(t.message)}</span>`).join('');
      host.innerHTML = line + line;
    } else {
      host.innerHTML = `<span class="ta-ticker-item">✨ Authentic handmade crafts from Balochistan</span>
                        <span class="ta-ticker-item">💳 50% advance • Cash on Delivery via TCS</span>
                        <span class="ta-ticker-item">📦 Nationwide shipping</span>
                        <span class="ta-ticker-item">🔒 Official site: safdarhussain1048-ui.github.io/traditional-artistry</span>`;
    }
  } catch (e) {
    console.warn('Ticker load failed', e);
  }
}

/* ============================================================
   STORE LOCATIONS
============================================================ */
async function loadStores() {
  const host = document.getElementById('stores-grid');
  if (!host) return;
  try {
    const { data } = await supabaseClient
      .from('store_locations')
      .select('*')
      .eq('is_active', true);

    if (!data || !data.length) {
      host.innerHTML = '';
      return;
    }

    host.innerHTML = data.map(s => `
      <div class="store-card">
        ${s.map_embed ? `<iframe class="store-map" src="${esc(s.map_embed)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` : ''}
        <div class="store-info">
          <h4><span class="store-live-dot"></span>${esc(s.name)}</h4>
          ${s.address ? `<p>📍 ${esc(s.address)}${s.city ? ', ' + esc(s.city) : ''}</p>` : ''}
          ${s.phone ? `<p>📞 <a href="tel:${esc(s.phone)}" class="text-red-700 hover:underline">${esc(s.phone)}</a></p>` : ''}
          ${s.hours ? `<p>🕒 ${esc(s.hours)}</p>` : ''}
          ${s.maps_link ? `<a href="${esc(s.maps_link)}" target="_blank" class="btn-primary mt-3 inline-block text-sm">Get Directions →</a>` : ''}
        </div>
      </div>`).join('');
  } catch (e) {
    console.warn('Stores load failed', e);
  }
}

/* ============================================================
   INIT
============================================================ */
document.addEventListener('DOMContentLoaded', async () => {
  await loadPublicSettings();
  settings = window.TA_SETTINGS_CACHE || {};

  if (!sessionStorage.getItem('ta_visited')) {
    sessionStorage.setItem('ta_visited', '1');
    trackVisit();
  }

  loadProducts();
  loadTicker();
  loadStores();
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

  // ============ NEW: CLEAR CART FEATURE ============
  document.getElementById('clear-cart-btn')?.addEventListener('click', () => {
    // If cart is already empty, just show a message
    if (cart.length === 0) {
      showToast('Your cart is already empty', 'error');
      return;
    }
    
    // Ask for confirmation before clearing
    if (confirm('Are you sure you want to clear your entire cart?')) {
      cart = [];           // 1. Empty the cart array
      saveCart();          // 2. Save to localStorage & update the UI (resets count to 0)
      closeCart();         // 3. Close the sidebar drawer
      showToast('Cart cleared successfully!', 'success'); // 4. Show success message
    }
  });
  // =================================================

  document.getElementById('track-btn')?.addEventListener('click', lookupTracking);
  document.getElementById('track-input')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') { e.preventDefault(); lookupTracking(); }
  });

  document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    status.classList.remove('hidden');
    status.className = 'text-sm text-center text-green-700 font-medium';
    status.textContent = 'Thank you! Please also message us on WhatsApp for faster response.';
    e.target.reset();
  });
});

/* ============================================================
   GLOBAL EXPORTS
============================================================ */
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.addToCart = addToCart;
window.updateQty = updateQty;
window.removeFromCart = removeFromCart;
window.selectColor = selectColor;
window.submitReview = submitReview;
window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;
window.submitOrder = submitOrder;
window.lookupTracking = lookupTracking;
window.currentModalColor = currentModalColor;
