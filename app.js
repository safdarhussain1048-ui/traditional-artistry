/* Traditional Artistry Work - Main Application Script */

// ========== PRODUCT DATA ==========
const products = [
  {
    id: 1,
    name: "Classic Balochi Embroidered Dress",
    category: "balochi-clothes",
    price: 12500,
    shippingWeight: 1.2,
    colors: ["#9B1B1B", "#D94F70", "#1A5F2A", "#0D7377"],
    colorNames: ["Deep Red", "Pink", "Green", "Teal"],
    quality: "Premium hand-embroidered silk thread on pure cotton",
    description: "Authentic Balochi pashk with intricate geometric embroidery featuring traditional motifs of diamonds, flowers and mirror work. Vibrant colors inspired by Baloch heritage.",
    features: ["Hand embroidery", "Mirror work (shisha)", "Loose comfortable fit", "Full sleeve"],
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop",
    badge: "Bestseller"
  },
  {
    id: 2,
    name: "Balochi Bridal Suit Set",
    category: "balochi-clothes",
    price: 28500,
    shippingWeight: 1.8,
    colors: ["#9B1B1B", "#C9A227", "#D94F70"],
    colorNames: ["Crimson", "Gold", "Rose"],
    quality: "Heavy silk embroidery with gold thread & mirrors",
    description: "Luxurious bridal ensemble with dense multi-color embroidery, gold accents and traditional frame designs. Perfect for weddings and special occasions.",
    features: ["Heavy embroidery", "Gold thread work", "Complete 3-piece set", "Custom size available"],
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=600&fit=crop",
    badge: "Premium"
  },
  {
    id: 3,
    name: "Men's Traditional Jamak",
    category: "balochi-clothes",
    price: 8500,
    shippingWeight: 1.0,
    colors: ["#1A1A1A", "#6B0F0F", "#1A5F2A"],
    colorNames: ["Black", "Deep Red", "Forest Green"],
    quality: "Fine cotton with embroidered collar & cuffs",
    description: "Classic Baloch men's jamak with subtle yet elegant embroidery on collar, cuffs and side panels. Baggy shalwar style comfort.",
    features: ["Embroidered details", "Breathable cotton", "Traditional cut", "Side slits"],
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=600&fit=crop"
  },
  {
    id: 4,
    name: "Cultural Sindhi Ajrak Shawl",
    category: "cultural",
    price: 4200,
    shippingWeight: 0.6,
    colors: ["#1A5F2A", "#9B1B1B", "#0D7377"],
    colorNames: ["Green", "Red", "Indigo"],
    quality: "Hand-block printed natural dye cotton",
    description: "Genuine Ajrak from Sindh with traditional geometric patterns. Soft, breathable and perfect as a shawl, wrap or decorative piece.",
    features: ["Natural dyes", "Hand block print", "Double sided", "Versatile use"],
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=600&fit=crop"
  },
  {
    id: 5,
    name: "Pashtun Style Embroidered Waistcoat",
    category: "cultural",
    price: 6500,
    shippingWeight: 0.7,
    colors: ["#C9A227", "#9B1B1B", "#1A1A1A"],
    colorNames: ["Gold", "Maroon", "Black"],
    quality: "Velvet base with silk thread embroidery",
    description: "Elegant cultural waistcoat featuring regional embroidery patterns. Ideal for formal cultural events and celebrations.",
    features: ["Velvet fabric", "Silk embroidery", "Lined interior", "Button front"],
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop"
  },
  {
    id: 6,
    name: "Handmade Balochi Shoulder Bag",
    category: "bags",
    price: 3800,
    shippingWeight: 0.5,
    colors: ["#9B1B1B", "#D94F70", "#1A5F2A", "#C9A227"],
    colorNames: ["Red", "Pink", "Green", "Gold"],
    quality: "Leather base with hand embroidery & mirrors",
    description: "Beautifully crafted shoulder bag featuring traditional Balochi embroidery and mirror work. Spacious interior with secure closure.",
    features: ["Hand embroidered", "Mirror accents", "Adjustable strap", "Inner pocket"],
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop",
    badge: "New"
  },
  {
    id: 7,
    name: "Embroidered Clutch Purse",
    category: "bags",
    price: 2200,
    shippingWeight: 0.3,
    colors: ["#D94F70", "#9B1B1B", "#0D7377"],
    colorNames: ["Rose", "Crimson", "Teal"],
    quality: "Cotton fabric with dense embroidery",
    description: "Compact and stylish clutch with intricate Balochi needlework. Perfect for parties and everyday elegance.",
    features: ["Compact size", "Zipper closure", "Inner lining", "Lightweight"],
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=600&fit=crop"
  },
  {
    id: 8,
    name: "Traditional Balochi Cap (Topi)",
    category: "caps",
    price: 1800,
    shippingWeight: 0.25,
    colors: ["#9B1B1B", "#1A5F2A", "#C9A227", "#0D7377"],
    colorNames: ["Red", "Green", "Gold", "Teal"],
    quality: "Hand-stitched with multi-color embroidery",
    description: "Authentic Balochi embroidered cap featuring classic geometric patterns. A must-have cultural accessory for men and boys.",
    features: ["Hand embroidered", "Comfortable fit", "Multiple sizes", "Durable"],
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop",
    badge: "Popular"
  },
  {
    id: 9,
    name: "Premium Embroidered Balochi Cap",
    category: "caps",
    price: 2500,
    shippingWeight: 0.3,
    colors: ["#C9A227", "#9B1B1B", "#1A1A1A"],
    colorNames: ["Gold", "Maroon", "Black"],
    quality: "Heavy embroidery with gold & silver thread",
    description: "Deluxe version of the traditional Balochi topi with denser embroidery and metallic thread accents for special occasions.",
    features: ["Metallic threads", "Dense work", "Gift ready", "Premium finish"],
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=600&fit=crop"
  },
  {
    id: 10,
    name: "Decorated Wooden Gift Pen Set",
    category: "gifts",
    price: 1500,
    shippingWeight: 0.2,
    colors: ["#C9A227", "#9B1B1B", "#1A5F2A"],
    colorNames: ["Gold", "Mahogany", "Olive"],
    quality: "Hand-carved wood with traditional motifs",
    description: "Elegant set of decorative pens with hand-carved traditional patterns. Ideal corporate or personal gift that celebrates heritage.",
    features: ["Hand carved", "Gift box included", "Smooth writing", "Unique design"],
    image: "https://images.unsplash.com/photo-1583485088034-447cb300ce2f?w=600&h=600&fit=crop"
  },
  {
    id: 11,
    name: "Calligraphy Gift Pen with Box",
    category: "gifts",
    price: 2800,
    shippingWeight: 0.35,
    colors: ["#1A1A1A", "#C9A227"],
    colorNames: ["Ebony", "Gold"],
    quality: "Premium wood & brass with engraved design",
    description: "Luxury calligraphy-style pen with traditional engraved motifs. Comes in a decorative presentation box — perfect for gifting.",
    features: ["Engraved design", "Presentation box", "Refillable", "Collector item"],
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=600&fit=crop",
    badge: "Gift"
  },
  {
    id: 12,
    name: "Handmade Soft Cloth Doll",
    category: "toys",
    price: 1200,
    shippingWeight: 0.3,
    colors: ["#D94F70", "#9B1B1B", "#1A5F2A", "#C9A227"],
    colorNames: ["Pink", "Red", "Green", "Gold"],
    quality: "Soft cotton fabric with embroidered details",
    description: "Adorable handmade cloth doll dressed in miniature traditional Balochi attire. Safe, soft and culturally meaningful for little ones.",
    features: ["Soft & safe", "Traditional dress", "Hand stitched", "Ages 3+"],
    image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&h=600&fit=crop"
  },
  {
    id: 13,
    name: "Wooden Traditional Toy Set",
    category: "toys",
    price: 1900,
    shippingWeight: 0.6,
    colors: ["#C9A227", "#9B1B1B", "#1A5F2A"],
    colorNames: ["Natural", "Red Accents", "Green Accents"],
    quality: "Natural wood, non-toxic paints, hand finished",
    description: "Set of traditional wooden toys inspired by cultural motifs. Educational, durable and beautifully crafted for kids.",
    features: ["Natural wood", "Non-toxic", "Educational", "Durable"],
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&h=600&fit=crop"
  },
  {
    id: 14,
    name: "Kids Embroidered Cap",
    category: "caps",
    price: 1100,
    shippingWeight: 0.15,
    colors: ["#D94F70", "#9B1B1B", "#0D7377", "#C9A227"],
    colorNames: ["Pink", "Red", "Teal", "Gold"],
    quality: "Soft cotton with light embroidery",
    description: "Cute smaller version of the Balochi topi designed for children. Lightweight and comfortable for everyday wear.",
    features: ["Kids size", "Soft fabric", "Light embroidery", "Adjustable"],
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&h=600&fit=crop"
  },
  {
    id: 15,
    name: "Cultural Embroidered Cushion Cover",
    category: "cultural",
    price: 1600,
    shippingWeight: 0.4,
    colors: ["#9B1B1B", "#1A5F2A", "#C9A227"],
    colorNames: ["Red", "Green", "Gold"],
    quality: "Cotton with dense hand embroidery",
    description: "Beautifully embroidered cushion cover featuring classic Balochi geometric patterns. Adds cultural elegance to any living space.",
    features: ["16x16 inch", "Zipper closure", "Hand work", "Washable"],
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop"
  },
  {
    id: 16,
    name: "Ladies Balochi Embroidered Shawl",
    category: "balochi-clothes",
    price: 5500,
    shippingWeight: 0.5,
    colors: ["#D94F70", "#9B1B1B", "#0D7377", "#1A5F2A"],
    colorNames: ["Rose", "Crimson", "Teal", "Green"],
    quality: "Lightweight chiffon with silk embroidery borders",
    description: "Graceful embroidered shawl (sareg style) with delicate borders and traditional motifs. Perfect companion for traditional outfits.",
    features: ["Lightweight", "Embroidered borders", "Versatile drape", "Elegant"],
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=600&fit=crop"
  }
];

// ========== TCS SHIPPING ESTIMATE ==========
// Approximate domestic rates (PKR) based on typical 2025-26 ranges
function estimateShipping(weightKg, isIntercity = true) {
  if (weightKg <= 0) return 0;
  // Rough averages: within city lower, intercity higher
  const base = isIntercity ? 280 : 160;
  const perKg = isIntercity ? 180 : 100;
  if (weightKg <= 0.5) return Math.round(base * 0.7);
  if (weightKg <= 1) return base;
  return Math.round(base + (weightKg - 1) * perKg);
}

// ========== CART (localStorage) ==========
let cart = JSON.parse(localStorage.getItem('ta_cart') || '[]');

function saveCart() {
  localStorage.setItem('ta_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId, colorIndex = 0, qty = 1) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId && item.colorIndex === colorIndex);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: productId,
      colorIndex,
      colorName: product.colorNames[colorIndex] || product.colorNames[0],
      qty
    });
  }
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
  let totalWeight = 0;
  cart.forEach(item => {
    const p = products.find(pr => pr.id === item.id);
    if (p) {
      subtotal += p.price * item.qty;
      totalWeight += p.shippingWeight * item.qty;
    }
  });
  const shipping = estimateShipping(totalWeight, true);
  return { subtotal, shipping, total: subtotal + shipping, weight: totalWeight };
}

// ========== UI HELPERS ==========
function formatPrice(n) {
  return 'Rs. ' + n.toLocaleString('en-PK');
}

function showToast(msg) {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 bg-baloch-deepred text-white px-6 py-3 rounded-xl shadow-lg z-[100] text-sm font-medium';
  toast.style.background = '#6B0F0F';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// ========== RENDER PRODUCTS ==========
function renderProducts(filter = 'all') {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="col-span-full empty-state"><p>No products in this category yet.</p></div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-image-wrap">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22600%22%3E%3Crect fill=%22%23F5E6C8%22 width=%22600%22 height=%22600%22/%3E%3Ctext fill=%22%239B1B1B%22 font-family=%22sans-serif%22 font-size=%2224%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3E${encodeURIComponent(p.name.substring(0,20))}%3C/text%3E%3C/svg%3E'">
      </div>
      <div class="product-body">
        <p class="product-category">${p.category.replace('-', ' ')}</p>
        <h3 class="product-title">${p.name}</h3>
        <p class="product-desc">${p.description}</p>
        <p class="product-price">${formatPrice(p.price)}</p>
        <div class="product-actions">
          <button class="btn-view" onclick="openProductModal(${p.id})">View Details</button>
          <button class="btn-add" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </div>
    </article>
  `).join('');
}

// ========== PRODUCT MODAL ==========
let currentModalColor = 0;

function openProductModal(id) {
  const p = products.find(pr => pr.id === id);
  if (!p) return;
  currentModalColor = 0;

  const modal = document.getElementById('product-modal');
  const content = document.getElementById('modal-content');

  const shippingEst = estimateShipping(p.shippingWeight, true);

  content.innerHTML = `
    <button id="close-modal" class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white" aria-label="Close">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
    <div class="modal-grid">
      <div class="modal-image">
        <img src="${p.image}" alt="${p.name}" id="modal-img" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22600%22%3E%3Crect fill=%22%23F5E6C8%22 width=%22600%22 height=%22600%22/%3E%3C/svg%3E'">
      </div>
      <div class="modal-body">
        <p class="text-sm font-medium text-baloch-teal uppercase tracking-wider mb-1">${p.category.replace('-', ' ')}</p>
        <h2 class="font-display text-2xl md:text-3xl font-bold text-baloch-deepred mb-3">${p.name}</h2>
        <p class="text-gray-700 mb-4 leading-relaxed">${p.description}</p>
        
        <div class="mb-4">
          <p class="text-sm font-medium text-gray-600 mb-2">Available Colors</p>
          <div class="flex gap-2 flex-wrap" id="color-swatches">
            ${p.colors.map((c, i) => `
              <button class="color-swatch ${i === 0 ? 'selected' : ''}" style="background:${c}" data-index="${i}" title="${p.colorNames[i]}" onclick="selectColor(${i})"></button>
            `).join('')}
          </div>
          <p class="text-sm text-gray-600 mt-1">Selected: <span id="selected-color-name" class="font-semibold text-baloch-deepred">${p.colorNames[0]}</span></p>
        </div>

        <div class="bg-baloch-sand/40 rounded-xl p-4 mb-5 space-y-1">
          <div class="detail-row">
            <span class="detail-label">Price</span>
            <span class="detail-value text-baloch-red text-lg">${formatPrice(p.price)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Est. TCS Shipping</span>
            <span class="detail-value">${formatPrice(shippingEst)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Total (approx.)</span>
            <span class="detail-value text-baloch-deepred text-lg">${formatPrice(p.price + shippingEst)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Quality</span>
            <span class="detail-value text-sm">${p.quality}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Weight (ship)</span>
            <span class="detail-value">${p.shippingWeight} kg</span>
          </div>
        </div>

        <div class="mb-5">
          <p class="text-sm font-medium text-gray-600 mb-2">Features</p>
          <ul class="grid grid-cols-2 gap-1 text-sm text-gray-700">
            ${p.features.map(f => `<li class="flex items-center gap-1.5"><span class="text-baloch-gold">✓</span> ${f}</li>`).join('')}
          </ul>
        </div>

        <div class="flex gap-3">
          <button class="btn-primary flex-1" onclick="addToCart(${p.id}, currentModalColor); closeProductModal();">
            Add to Cart
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-3 text-center">COD available • Final shipping confirmed on order via TCS</p>
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
  document.querySelectorAll('.color-swatch').forEach((el, i) => {
    el.classList.toggle('selected', i === index);
  });
  const p = products.find(pr => pr.id === parseInt(document.querySelector('#modal-content .btn-primary')?.getAttribute('onclick')?.match(/\d+/)?.[0] || 0));
  // Simpler: find from current open
  const nameEl = document.getElementById('selected-color-name');
  if (nameEl) {
    const productId = parseInt(document.querySelector('#modal-content button.btn-primary').getAttribute('onclick').match(/addToCart\((\d+)/)[1]);
    const prod = products.find(pr => pr.id === productId);
    if (prod) nameEl.textContent = prod.colorNames[index];
  }
}

function closeProductModal() {
  document.getElementById('product-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

// ========== CART UI ==========
function updateCartUI() {
  const countEl = document.getElementById('cart-count');
  const itemsEl = document.getElementById('cart-items');
  const { subtotal, shipping, total } = getCartTotals();

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  countEl.textContent = totalQty;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="empty-state">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        <p>Your cart is empty</p>
        <p class="text-sm mt-1">Add some beautiful traditional items!</p>
      </div>`;
  } else {
    itemsEl.innerHTML = cart.map((item, idx) => {
      const p = products.find(pr => pr.id === item.id);
      if (!p) return '';
      return `
        <div class="cart-item">
          <img src="${p.image}" alt="${p.name}" class="cart-item-img" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2272%22 height=%2272%22%3E%3Crect fill=%22%23F5E6C8%22 width=%2272%22 height=%2272%22/%3E%3C/svg%3E'">
          <div class="cart-item-info">
            <p class="font-semibold text-sm text-baloch-deepred leading-tight">${p.name}</p>
            <p class="text-xs text-gray-500">${item.colorName}</p>
            <p class="text-sm font-bold text-baloch-red mt-0.5">${formatPrice(p.price)}</p>
            <div class="cart-qty-controls">
              <button class="cart-qty-btn" onclick="updateQty(${idx}, -1)">−</button>
              <span class="text-sm font-medium w-6 text-center">${item.qty}</span>
              <button class="cart-qty-btn" onclick="updateQty(${idx}, 1)">+</button>
              <button class="ml-auto text-xs text-red-600 hover:underline" onclick="removeFromCart(${idx})">Remove</button>
            </div>
          </div>
        </div>`;
    }).join('');
  }

  document.getElementById('cart-subtotal').textContent = formatPrice(subtotal);
  document.getElementById('cart-shipping').textContent = formatPrice(shipping);
  document.getElementById('cart-total').textContent = formatPrice(total);
}

function openCart() {
  document.getElementById('cart-sidebar').classList.remove('translate-x-full');
  document.getElementById('cart-backdrop').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-sidebar').classList.add('translate-x-full');
  document.getElementById('cart-backdrop').classList.add('hidden');
  document.body.style.overflow = '';
}

// ========== CHECKOUT ==========
function openCheckout() {
  if (cart.length === 0) {
    showToast('Your cart is empty');
    return;
  }
  closeCart();
  const { subtotal, shipping, total } = getCartTotals();
  const summary = cart.map(item => {
    const p = products.find(pr => pr.id === item.id);
    return `${p.name} (${item.colorName}) × ${item.qty}`;
  }).join('<br>') + `<br><br><strong>Subtotal: ${formatPrice(subtotal)}</strong><br>Est. Shipping: ${formatPrice(shipping)}<br><strong>Total: ${formatPrice(total)}</strong>`;

  document.getElementById('checkout-summary').innerHTML = summary;
  document.getElementById('checkout-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  document.getElementById('checkout-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

// ========== EVENT LISTENERS ==========
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartUI();

  // Mobile menu
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  mobileBtn?.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
  });

  // Filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.filter);
    });
  });

  // Category cards
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.category;
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === cat || (cat && b.dataset.filter === cat));
      });
      // Activate correct filter
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      const target = document.querySelector(`.filter-btn[data-filter="${cat}"]`);
      if (target) target.classList.add('active');
      renderProducts(cat);
      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Cart
  document.getElementById('cart-btn')?.addEventListener('click', openCart);
  document.getElementById('close-cart')?.addEventListener('click', closeCart);
  document.getElementById('cart-backdrop')?.addEventListener('click', closeCart);
  document.getElementById('checkout-btn')?.addEventListener('click', openCheckout);
  document.getElementById('cancel-checkout')?.addEventListener('click', closeCheckout);
  document.getElementById('checkout-overlay')?.addEventListener('click', closeCheckout);

  // Contact form
  document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    status.classList.remove('hidden');
    status.className = 'text-sm text-center text-green-700 font-medium';
    status.textContent = 'Thank you! Your message has been noted. Please also contact us on WhatsApp for faster response.';
    e.target.reset();
    setTimeout(() => status.classList.add('hidden'), 5000);
  });

  // Checkout form
  document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const name = data.get('name');
    const phone = data.get('phone');
    const city = data.get('city');
    const address = data.get('address');
    const notes = data.get('notes') || '';

    const { subtotal, shipping, total } = getCartTotals();
    const orderLines = cart.map(item => {
      const p = products.find(pr => pr.id === item.id);
      return `• ${p.name} (${item.colorName}) × ${item.qty} = ${formatPrice(p.price * item.qty)}`;
    }).join('\n');

    const message = `*New Order - Traditional Artistry Work*%0A%0A` +
      `*Customer:*%0A${name}%0A${phone}%0A${city}%0A${address}%0A%0A` +
      `*Items:*%0A${orderLines}%0A%0A` +
      `Subtotal: ${formatPrice(subtotal)}%0A` +
      `Est. Shipping: ${formatPrice(shipping)}%0A` +
      `*Total: ${formatPrice(total)}*%0A%0A` +
      (notes ? `Notes: ${notes}%0A` : '') +
      `%0APlease confirm this order.`;

    // Open WhatsApp (user must update the number)
    const whatsappNumber = '923001234567'; // <-- REPLACE WITH REAL NUMBER
    const waUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    const status = document.getElementById('checkout-status');
    status.classList.remove('hidden');
    status.className = 'text-sm text-center text-green-700 font-medium';
    status.innerHTML = `Order prepared! <a href="${waUrl}" target="_blank" class="underline font-bold">Click here to send via WhatsApp</a>. We will confirm & arrange TCS shipping.`;

    // Clear cart after successful prepare
    cart = [];
    saveCart();
    form.reset();
  });
});

// Expose functions to global for onclick handlers
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.addToCart = addToCart;
window.updateQty = updateQty;
window.removeFromCart = removeFromCart;
window.selectColor = selectColor;
window.currentModalColor = currentModalColor;
