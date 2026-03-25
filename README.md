# ScopeGuard

Premium, conversion-focused Next.js marketing website for a freelancer protection digital product business.

## 1) Project overview
ScopeGuard positions freelancer documentation as a **revenue protection system** rather than generic templates. The site is optimized for:
- direct purchase conversion
- lead capture
- authority and trust
- SEO and performance
- easy extension for future products/resources

## 2) Local development
```bash
npm install
cp .env.example .env.local
npm run dev
```
Open http://localhost:3000.

## 3) Environment setup
Create `.env.local` (dev) or `.env` (production):

```env
NEXT_PUBLIC_SITE_URL=https://scopeguard.co
NEXT_PUBLIC_CONTACT_EMAIL=support@scopeguard.co
NEXT_PUBLIC_CHECKOUT_STARTER_URL=https://your-checkout-provider.com/starter
NEXT_PUBLIC_CHECKOUT_PRO_URL=https://your-checkout-provider.com/pro
NEXT_PUBLIC_CHECKOUT_PREMIUM_URL=https://your-checkout-provider.com/premium
NEXT_PUBLIC_LEAD_MAGNET_URL=https://your-domain.com/freelancer-protection-checklist
```

## 4) Production build commands
```bash
npm install
npm run build
npm run start
```

## 5) VPS deployment (Ubuntu 24.04)
1. SSH into server.
2. Install Node.js 22 LTS and Git.
3. Clone repo to `/var/www/scopeguard`.
4. Add `.env` file.
5. Install dependencies and build:
   ```bash
   npm ci
   npm run build
   ```
6. Start app with PM2 (below).

## 6) Git pull / update workflow
```bash
cd /var/www/scopeguard
git pull origin main
npm ci
npm run build
pm2 restart scopeguard
```

## 7) PM2 process commands
```bash
npm install -g pm2
cd /var/www/scopeguard
pm2 start npm --name scopeguard -- start
pm2 save
pm2 startup
pm2 status
pm2 logs scopeguard
```

## 8) Nginx reverse proxy example
`/etc/nginx/sites-available/scopeguard`

```nginx
server {
    listen 80;
    server_name scopeguard.co www.scopeguard.co;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and reload:
```bash
sudo ln -s /etc/nginx/sites-available/scopeguard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 9) Domain DNS setup
- A record: `@` → `207.180.27.22`
- A record: `www` → `207.180.27.22`
- Wait for propagation, then verify with:
  ```bash
  dig +short scopeguard.co
  dig +short www.scopeguard.co
  ```

## 10) SSL setup (Certbot)
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d scopeguard.co -d www.scopeguard.co
sudo certbot renew --dry-run
```

## 11) Security best practices
- Keep Ubuntu and packages updated.
- Use firewall (`ufw allow OpenSSH`, `ufw allow 'Nginx Full'`).
- Disable password SSH, use keys.
- Do not commit `.env` files.
- Rotate provider/API credentials.
- Restrict admin access to checkout platforms.

## 12) How to update branding/copy/testimonials/pricing/checkout URLs
- **Brand/navigation/stats**: `content/site.ts`
- **Pricing ladder**: `content/pricing.ts`
- **Testimonials**: `content/testimonials.ts`
- **FAQ**: `content/faq.ts`
- **Product highlights/deliverables**: `content/products.ts`
- **Checkout links**: `.env` via `lib/checkout.ts`

## 13) Add future products/resources
- Add new resource cards in `content/resources.ts`
- Add route pages under `app/` for new products, blog, lead magnets
- Reuse `SectionTitle`, `Card`, and CTA components for consistency
- Extend SEO metadata via `lib/seo.ts`

## Optional Docker deployment
```bash
docker compose up -d --build
```
