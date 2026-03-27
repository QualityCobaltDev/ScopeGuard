# ScopeGuard Admin CMS

Production website for **https://elevareai.store** with a premium public frontend and a structured admin CMS.

## Architecture summary
- Next.js App Router + TypeScript + Tailwind CSS.
- JSON-backed content persistence in `storage/*.json`.
- Admin-authenticated API routes for content, document/file management, and SMTP testing.
- Server-side SMTP sending with secure environment variables only.

## Admin dashboard CMS overview
Route: `/admin`

Sections:
- Overview
- Website Content
- Pricing
- Testimonials
- FAQ
- Resources
- Documents / Files
- Navigation
- Footer
- Settings
- Email / SMTP
- Profile
- Users

The dashboard now uses structured forms, repeaters, toggles, and dropdowns (not raw HTML editing) for day-to-day content operations.

## Document upload workflow
1. Go to **Admin → Documents / Files**.
2. Upload a file with title, description, and visibility.
3. Files are validated by extension, MIME type, and max size.
4. File metadata is saved in `storage/files.json`.
5. File binaries are stored in `public/uploads/resources`.
6. Admin can open, replace, and delete files.

## Resource entry workflow
1. Go to **Admin → Resources**.
2. Create/edit entries with fields:
   - title, label, category, summary, description
   - status (draft/published)
   - linked file
   - external URL
   - CTA label
   - sort order
   - visibility
3. Save updates to publish to public resources page.
4. Public `/resources` page renders only published entries and resolves linked files automatically.

## Allowed upload types and size
- Extensions: `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.ppt`, `.pptx`, `.csv`, `.txt`
- Max size: `15MB`
- Unsupported MIME types and extensions are rejected.

## File storage locations
- Metadata: `storage/files.json`
- Actual documents: `public/uploads/resources/`

## Public resource download behavior
- A resource can point to:
  - linked uploaded document (`fileId`), or
  - explicit external URL.
- If neither is set, CTA falls back to `/contact`.

## SMTP setup
ScopeGuard uses SMTP for outbound mail and admin test emails.

Default SMTP values:
- Host: `mail.spacemail.com`
- Port: `465`
- Secure: `true`
- Sender user: `contact@elevareai.store`

IMAP/POP details are documented as operational references only (not implemented as mailbox-sync client):
- IMAP SSL: `mail.spacemail.com:993`
- POP3 SSL: `mail.spacemail.com:995`

## Environment variables
Use `.env.example`.

Required for email:
- `SMTP_HOST=mail.spacemail.com`
- `SMTP_PORT=465`
- `SMTP_SECURE=true`
- `SMTP_USER=contact@elevareai.store`
- `SMTP_PASS=<real mailbox password>`
- `CONTACT_EMAIL=contact@elevareai.store`
- `SITE_URL=https://elevareai.store`

## Email test process
1. Open **Admin → Email / SMTP**.
2. Review read-only runtime status (host, port, secure, username, masked password state).
3. Enter recipient email.
4. Click **Send test email**.

## Contact form mail flow
- Public contact form posts to `/api/contact`.
- Server validates and sanitizes input.
- Sends:
  1. admin notification to `CONTACT_EMAIL`
  2. acknowledgement email to sender

## Deployment notes (Ubuntu + PM2 + Nginx + Certbot)
```bash
npm install
npm run build
npm run start
```

PM2 example:
```bash
pm2 start npm --name elevareai -- start
pm2 save
pm2 startup
```

Nginx should reverse proxy to `127.0.0.1:3000`.

Certbot example:
```bash
sudo certbot --nginx -d elevareai.store
```

### Upload persistence and backups
- Ensure `public/uploads/resources` persists across deployments.
- Include both:
  - `public/uploads/resources`
  - `storage/*.json`
  in backup jobs.

## Security notes
- SMTP credentials are environment-only and never exposed client-side.
- Contact form sanitizes input and includes honeypot field.
- Uploads are validated for extension, MIME type, and size.
- Stored filenames are randomized to prevent collisions/path abuse.
- Admin-only guards protect content, file, and SMTP test routes.

## Auth overview
- Admin sign-in route: `/admin/signin`
- Session cookie: `httpOnly`, `sameSite=strict`, secure in production
- Roles: `admin`, `user`
