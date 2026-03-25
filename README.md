# Elevare AI Platform

Premium marketing website + secure authentication + role-based admin/user dashboards for **https://elevareai.store**.

## Tech Stack
- Next.js App Router + TypeScript + Tailwind CSS
- File-backed CMS persistence (current runtime)
- Session-based auth with hashed passwords (scrypt)
- Prisma schema + PostgreSQL seed scaffolding included for migration to DB-backed ops

## Features
- Public marketing pages: `/`, `/product`, `/about`, `/contact`, `/resources`, `/privacy`, `/terms`, `/refund-policy`
- Auth pages: `/signin`, `/signup`, `/forgot-password`, `/reset-password`, `/unauthorized`
- User dashboard: `/dashboard`
- Admin dashboard: `/admin`
- Admin content management for site/pricing/testimonials/faq/products/resources
- Admin user management (create/update/delete, role switch)
- Locked support email: `contact@elevareai.store`
- Locked domain references: `https://elevareai.store`

## Roles & Permissions
- `admin`: full admin dashboard + content/user management + website editing
- `user`: own dashboard and profile/password management

## Environment
Copy `.env.example` to `.env` and set values.

## Local Development
```bash
npm install
npm run dev
```

## Prisma / Database Steps (for PostgreSQL migration)
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

## Build & Start
```bash
npm run build
npm run start
```

## Ubuntu 24.04 VPS Deployment
1. Install Node.js, Nginx, PM2, Certbot.
2. Clone project into `/var/www/elevareai`.
3. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```
4. Start with PM2:
   ```bash
   pm2 start npm --name elevareai -- start
   pm2 save
   pm2 startup
   ```
5. Configure Nginx reverse proxy to `localhost:3000` for `elevareai.store`.
6. Run Certbot SSL:
   ```bash
   sudo certbot --nginx -d elevareai.store
   ```

## Admin Bootstrap
- First run automatically seeds an admin user if `storage/users.json` is empty.
- Seed credentials are controlled by `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD`.

## Security Notes
- Passwords are hashed using Node `scrypt`.
- Session token is stored in HTTP-only cookie.
- `/admin` guarded by middleware + server-side role checks.
- All admin mutation endpoints require admin authorization.

## Content Workflow
1. Sign in as admin.
2. Open `/admin`.
3. Use **Content** section to edit JSON collections.
4. Save; public pages update immediately.

## Support
All support and contact references must use: `contact@elevareai.store`.
