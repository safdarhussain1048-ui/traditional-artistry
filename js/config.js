/* ============================================================
   Traditional Artistry Work – Shared Configuration & Helpers
   ------------------------------------------------------------
   SECURITY NOTES (READ):
   - The SUPABASE_ANON_KEY below is PUBLIC by design. It is safe
     to expose in the browser. Real security is enforced by
     Supabase RLS policies (see SQL in Step 0).
   - Only authenticated admin users can INSERT/UPDATE/DELETE
     products, orders, expenses, tickers, stores, settings.
   - Customers can only INSERT orders, reviews, visits, and
     SELECT active products / stores / tickers / approved reviews.
   - NEVER place a service_role key here.
   ============================================================ */

// ============ SUPABASE CREDENTIALS ============
const SUPABASE_URL      = 'https://vgjmgbnflyxzpfxqizcz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnam1nYm5mbHl4enBmeHFpemN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5NjM5NjEsImV4cCI6MjEwNTUzOTk2MX0.uzqYMlTllj_0yHJ_Yjpe4yCPUfWY5ZetlQP_71zDlMc';

// Global Supabase client (used by app.js, admin panel, everywhere)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Expose globally so admin panel and other scripts can use it
window.supabaseClient = supabaseClient;

/* ============================================================
   BUSINESS CONSTANTS
   ============================================================ */
const TA_CONFIG = {
  brandName:     'Traditional Artistry Work',
  ownerName:     'Safdar Hussain',
  whatsapp:      '923333882131',           // TCS / order confirmations go here
  whatsappHuman: '0333-3882131',
  email:         'safdarhussain1048@gmail.com',
  tcsTrackingUrl:'https://www.tcsexpress.com/tracking',
  defaultAdvancePercent: 50                // Customer pays 50% before dispatch
};

// Categories (must match the values stored in `products.category`)
const TA_CATEGORIES = [
  { id: 'balochi-clothes', label: 'Balochi Clothes' },
  { id: 'cultural',        label: 'Cultural Wear' },
  { id: 'bags',            label: 'Handmade Bags' },
  { id: 'caps',            label: 'Balochi Caps' },
  { id: 'gifts',           label: 'Gift Pens' },
  { id: 'toys',            label: 'Kids Toys' }
];

// Order lifecycle
const TA_ORDER_STATUSES = ['new', 'confirmed', 'packed', 'dispatched', 'delivered', 'cancelled'];
const TA_PAYMENT_STATUSES = ['pending', 'submitted', 'verified', 'rejected'];

/* ============================================================
   SHARED HELPERS
   ============================================================ */

// Currency formatter – Rs. 1,234
function money(n) {
  return 'Rs. ' + Number(n || 0).toLocaleString('en-PK');
}

// Escape HTML to prevent XSS in rendered strings
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// Normalize Pakistani phone numbers to 92XXXXXXXXXX format
function normPhone(p) {
  let d = String(p || '').replace(/\D/g, '');
  if (d.startsWith('0')) d = '92' + d.slice(1);
  else if (!d.startsWith('92') && d.length === 10) d = '92' + d;
  return d;
}

// Build a wa.me link with a pre-filled message
function waLink(phone, msg) {
  return 'https://wa.me/' + normPhone(phone) + '?text=' + encodeURIComponent(msg);
}

// Show a small floating toast notification
function showToast(msg, type = 'info') {
  const existing = document.getElementById('ta-toast');
  if (existing) existing.remove();
  const colors = {
    info:    'bg-red-900',
    success: 'bg-green-700',
    error:   'bg-red-700'
  };
  const toast = document.createElement('div');
  toast.id = 'ta-toast';
  toast.className =
    'fixed bottom-6 left-1/2 -translate-x-1/2 text-white px-6 py-3 rounded-xl shadow-lg ' +
    'z-[100] text-sm font-medium max-w-[90vw] text-center ' + (colors[type] || colors.info);
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
}

// Show inline flash message on any element
function flash(el, text, color = 'green') {
  const node = typeof el === 'string' ? document.querySelector(el) : el;
  if (!node) return;
  node.textContent = text;
  node.className = 'text-center text-sm ' + (color === 'green' ? 'text-green-700' : 'text-red-600');
  node.classList.remove('hidden');
  clearTimeout(node._flashTimer);
  node._flashTimer = setTimeout(() => node.classList.add('hidden'), 4500);
}

/* ============================================================
   WHATSAPP AUTO-SEND
   ------------------------------------------------------------
   If admin saves a WhatsApp API URL + token in Settings,
   messages send instantly with zero clicks.
   Otherwise we fall back to opening wa.me in a new tab.
   ============================================================ */
let TA_SETTINGS_CACHE = {};

async function loadPublicSettings() {
  try {
    const { data } = await supabaseClient.from('settings').select('*');
    TA_SETTINGS_CACHE = Object.fromEntries((data || []).map(r => [r.key, r.value]));
  } catch (e) {
    console.warn('Settings load failed:', e);
  }
  return TA_SETTINGS_CACHE;
}

async function sendWhatsApp(phone, message) {
  const url   = TA_SETTINGS_CACHE.wa_api_url;
  const token = TA_SETTINGS_CACHE.wa_api_token;

  // Fully automatic mode (UltraMsg / WhatsApp Cloud API compatible)
  if (url && token) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, to: normPhone(phone), body: message })
      });
      if (res.ok) return { ok: true, auto: true };
    } catch (err) {
      console.warn('WA API failed, falling back to wa.me', err);
    }
  }

  // Fallback: open WhatsApp with pre-filled message
  window.open(waLink(phone, message), '_blank');
  return { ok: true, auto: false };
}

/* ============================================================
   VISIT TRACKING (feeds the admin dashboard chart)
   ============================================================ */
async function trackVisit() {
  try {
    const device = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
    await supabaseClient.from('site_visits').insert({
      device,
      referrer: document.referrer || null
    });
  } catch (e) {
    // Silent – never break the site for analytics
  }
}

/* ============================================================
   ORDER CODE GENERATOR (e.g. TA-7F3K92)
   ============================================================ */
function generateOrderCode() {
  const stamp = Date.now().toString(36).slice(-5).toUpperCase();
  const rand  = Math.random().toString(36).slice(2, 5).toUpperCase();
  return 'TA-' + stamp + rand;
}

/* ============================================================
   EXPOSE GLOBALLY
   ============================================================ */
window.TA = {
  config: TA_CONFIG,
  categories: TA_CATEGORIES,
  orderStatuses: TA_ORDER_STATUSES,
  paymentStatuses: TA_PAYMENT_STATUSES,
  money, esc, normPhone, waLink,
  showToast, flash,
  sendWhatsApp, loadPublicSettings,
  trackVisit, generateOrderCode
};

window.money    = money;
window.esc      = esc;
window.normPhone = normPhone;
window.waLink   = waLink;
window.showToast = showToast;
window.sendWhatsApp = sendWhatsApp;
