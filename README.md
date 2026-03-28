# ScopeGuard Admin CMS

Production website for **https://elevareai.store** with a premium public frontend and a structured admin CMS.

## Architecture summary
- Next.js App Router + TypeScript + Tailwind CSS.
- JSON-backed content persistence in `storage/*.json`.
- Admin-authenticated API routes for content, document/file management, and fully editable SMTP settings management.
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
ScopeGuard uses SMTP for outbound mail and admin test emails. SMTP settings are editable from Admin → Email / SMTP and persisted server-side in `storage/email-settings.json`.

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

Fallback environment values (used only when no saved admin settings exist):
- `SMTP_HOST=mail.spacemail.com`
- `SMTP_PORT=465`
- `SMTP_SECURE=true`
- `SMTP_USER=contact@elevareai.store`
- `SMTP_PASS=<real mailbox password>`
- `CONTACT_EMAIL=contact@elevareai.store`
- `SITE_URL=https://elevareai.store`
- `SETTINGS_ENCRYPTION_KEY=<long-random-key>`

## Email test process
1. Open **Admin → Email / SMTP**.
2. Edit SMTP host/port/SSL/user/password and sender identity fields, then click **Save Settings**.
3. Run **Test Connection** to verify SMTP transport.
4. Enter recipient (or use default) and click **Send Test Email**.

## Contact form mail flow
- Public contact form posts to `/api/contact`.
- Server validates and sanitizes input.
- Uses saved SMTP settings as transport source of truth (fallback to env if no saved settings).
- Sends:
  1. admin notification to configured default recipient
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
  - `storage/*.json` (including `storage/email-settings.json`)
  in backup jobs.

## Security notes
- SMTP password is encrypted-at-rest in `storage/email-settings.json` and never returned in plaintext to the client.
- Contact form sanitizes input and includes honeypot field.
- Uploads are validated for extension, MIME type, and size.
- Stored filenames are randomized to prevent collisions/path abuse.
- Admin-only guards protect content, file, and SMTP test routes.

## Auth overview
- Admin sign-in route: `/admin/signin`
- Session cookie: `httpOnly`, `sameSite=strict`, secure in production
- Roles: `admin`, `user`


## Lead magnet automation
- Public lead form submits to `/api/lead` with validation, loading/success/error handling.
- Submissions are persisted in `storage/lead-subscribers.json`.
- Lead magnet campaign/content settings are persisted in `storage/lead-magnet.json`.
- Automatic resource delivery emails are sent immediately after successful submission via saved SMTP settings.

### Admin lead magnet management
- In Admin dashboard, use **Lead Magnet** section to manage:
  - public heading/description/button/success text
  - email subject/preview/intro/closing copy
  - active toggle and resend-on-duplicate behavior
  - attached resources selected from existing Resources entries
  - primary resource selection
- Use **Subscribers** section to:
  - search/view subscriber records
  - inspect delivery status and errors
  - resend delivery email manually
  - delete subscriber records

### Duplicate handling
- Existing subscriber for same lead magnet is updated (not duplicated).
- If `resendOnDuplicate` is enabled, resources are resent automatically.
- If disabled, user still receives a success message without sending duplicate emails.

### Backups
- Include these files in backups:
  - `storage/lead-magnet.json`
  - `storage/lead-subscribers.json`
  - `storage/email-settings.json`
  - `storage/files.json`
  - `public/uploads/resources`


## Dashboard synchronization and operations
- Overview metrics are computed from real data sources via `GET /api/admin/overview` (users, resources, files, subscribers, SMTP state, lead magnet state, pricing/FAQ/testimonials visibility, page section visibility, nav/footer counts).
- Save actions in admin trigger refresh flows so Overview reflects latest persisted values.

## Modular page sections (boxes)
- Admin can manage modular sections in **Page Sections**:
  - add section blocks
  - choose `pageKey` and `sectionType`
  - edit title/subtitle/body/CTA fields
  - set order
  - toggle visible/hidden
  - delete sections
- Public home page renders visible `home` sections in configured order.

## Posts and resource linking
- Admin can manage lightweight posts in **Posts**.
- Resources can be linked to posts via `linkedPostId` in Resources editor.
- Public post page route: `/resources/posts/[slug-or-id]` displays linked published resources.

## Account-required downloads
- Resource `accessType` supports:
  - `public`
  - `account_required`
  - `hidden`
- Download route `/api/resources/download/[resourceId]` enforces auth for `account_required` resources and redirects unauthenticated users to sign in, then back to intended resource.

## Save/persistence model
- Content collections: `storage/*.json` via content store and dedicated stores.
- Posts: `storage/posts.json`.
- Page sections: `storage/page-sections.json`.
- Lead magnet settings/subscribers and SMTP settings remain in dedicated storage files.


## Page management system
- Managed pages are stored in `storage/pages.json`.
- Page sections are stored in `storage/page-sections.json` and linked by `pageId`.
- Admin can create/edit/publish/hide/delete pages in **Pages** section.
- Core system pages are protected via `isSystemPage` and cannot be deleted.
- Admin can manage sections per selected page in **Page Sections**.

### Dynamic page rendering
- New admin-created pages are rendered by `app/[slug]/page.tsx`.
- Rendering respects page publish/visibility state and section order/visibility.
- SEO metadata uses managed page metadata fields.

### Navigation synchronization
- Managed pages marked `showInNavigation` are synced into site navigation on page save.
- Navigation keeps existing static links and merges in visible/published managed pages.
