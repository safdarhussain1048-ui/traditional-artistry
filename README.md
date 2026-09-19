# Traditional Artistry Work – Safdar Hussain

Professional e-commerce style website for authentic Balochi clothes, cultural attire, handmade bags, Balochi caps, gift pens, kids toys and more.

## Features

- Fully responsive modern design with traditional color palette (deep red, gold, green, pink, cream)
- Product catalog with categories, filters, detailed views
- Product details: price, estimated TCS shipping, total cost, quality description, available colors, features
- Shopping cart with local storage
- Order form that prepares a WhatsApp message for easy order confirmation
- Contact form and contact information section
- High-contrast text for full visibility
- Security headers (CSP, X-Frame-Options, etc.) prepared for hosting
- Clean, professional UI inspired by top lifestyle & craft stores

## How to Make the Website Live

### Option 1 – Netlify (Recommended, Free & Easy)

1. Go to [https://www.netlify.com](https://www.netlify.com) and sign up (free).
2. Drag and drop the entire `traditional-artistry` folder onto the Netlify dashboard.
3. Your site will be live in seconds with a free `*.netlify.app` URL.
4. Optional: Connect a custom domain (e.g. traditionalartistry.pk).

### Option 2 – GitHub Pages

1. Create a new GitHub repository.
2. Upload all files from the `traditional-artistry` folder.
3. Go to Settings → Pages → Source: Deploy from branch (main).
4. Site will be available at `https://yourusername.github.io/repo-name`.

### Option 3 – Any Hosting (Hostinger, cPanel, Vercel, etc.)

Upload the contents of the `traditional-artistry` folder to your `public_html` or web root.

**Important:** Always use HTTPS. Most free hosts provide free SSL certificates.

## Customization Checklist (Do These Before Going Live)

1. **Phone / WhatsApp Number**
   - Open `js/app.js`
   - Find `const whatsappNumber = '923001234567';`
   - Replace with your real number in international format without + (e.g. `923001234567`)

2. **Contact Information**
   - Open `index.html`
   - Search for `+92 3XX XXXXXXX` and `info@traditionalartistry.pk`
   - Replace with your real phone and email.

3. **Product Images & Prices**
   - Edit the `products` array in `js/app.js`
   - Replace Unsplash placeholder images with your real product photos (upload to an image host or put in an `/images` folder and update paths).
   - Update prices, descriptions, colors, quality notes to match your actual inventory.

4. **Add More Products**
   - Copy an existing product object in the `products` array and change the values.
   - Keep unique `id` numbers.

5. **Logo**
   - The current logo is the letters “TA”. You can replace it with an image in the header section of `index.html`.

## Security Notes

- The site is static (HTML + CSS + JS). There is no server-side code that can be “hacked” in the traditional sense.
- Security headers are included via meta tags. On real hosting, also configure:
  - HTTPS only
  - HSTS
  - Content-Security-Policy (already set)
  - X-Frame-Options: DENY
- Never store customer payment card data on this site. Use COD + WhatsApp/TCS flow.
- For real payment gateways later, use a proper platform (Shopify, WooCommerce, etc.).

## TCS Shipping

Shipping estimates are approximate based on typical Pakistan domestic rates. Final charges will be confirmed when you prepare the actual TCS shipment. Customers can pay COD.

## File Structure

```
traditional-artistry/
├── index.html          # Main page
├── css/
│   └── styles.css      # Custom styles
├── js/
│   └── app.js          # Products, cart, modals, logic
├── images/             # (Optional) Put your product photos here
└── README.md           # This file
```

## Need Help?

After updating your phone number and products, simply host the folder and share the link. Customers can browse, add to cart, and send the order to you on WhatsApp with one click.

Enjoy selling your beautiful traditional artistry!
