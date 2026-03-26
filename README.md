# Elevare AI Admin-Enabled Website

Production website for **https://elevareai.store** with a premium public frontend and a secure Admin User Board.

## 1) Project Overview
- Next.js App Router + TypeScript + Tailwind CSS
- Public marketing pages + protected admin dashboard
- Persistent editable content via `storage/*.json`
- Session auth with hashed passwords and role checks

## 2) Auth Overview
- Admin sign-in route: `/admin/signin`
- Credentials auth with server-side password verification
- Session cookie: `httpOnly`, `sameSite=strict`, secure in production
- Roles: `admin`, `user`

## 3) Admin Sign-in Flow
1. Click **Admin Sign-in** in the header.
2. Submit `username + password` on `/admin/signin`.
3. Successful admin sign-in redirects to `/admin`.
4. Logout invalidates session server-side.

## 4) Admin Dashboard Overview
Route: `/admin`
Sections:
- Overview
- Pages / Website Content
- Pricing
- Testimonials
- FAQ
- Products / Offers
- Resources
- Navigation
- Footer
- Settings
- Profile
- Users

Admin can edit content JSON collections, manage users, and publish updates immediately.

## 5) Environment Setup
Use `.env.example` as template.

## 6) Database Setup
A Prisma/PostgreSQL schema is included under `prisma/schema.prisma` for migration-ready deployments.

## 7) Migration Steps
```bash
npx prisma generate
npx prisma migrate deploy
```

## 8) Seed Steps
```bash
npx prisma db seed
```

## 9) Initial Admin Credentials (server-side seed only)
- Username: `QualityCobaltDev`
- Password: `Banner1234!`

Password is hashed before storage; plaintext is never shipped to frontend code.

## 10) Local Development
```bash
npm install
npm run dev
```

## 11) Production Deployment
```bash
npm install
npm run build
npm run start
```

## 12) PM2 Commands
```bash
pm2 start npm --name elevareai -- start
pm2 save
pm2 startup
```

## 13) Nginx Notes
Reverse-proxy `elevareai.store` to `http://127.0.0.1:3000`.

## 14) SSL Notes
```bash
sudo certbot --nginx -d elevareai.store
```

## 15) Security Notes
- Password hashing with server-side `scrypt`
- Protected admin routes via middleware + server checks
- Admin-only mutation guards for content and users

## 16) How Admin Edits Website Content
- Sign in at `/admin/signin`
- Open `/admin`
- Select a section (Pricing, FAQ, Resources, etc.)
- Edit and click **Save Changes**

## 17) How Content Persistence Works
- `lib/content-store.ts` writes to `storage/*.json`
- Admin edits persist immediately
- Public pages read from the same structured store

## Fixed Business Constraints
- Primary domain remains: `https://elevareai.store`
- Contact email everywhere: `contact@elevareai.store`
