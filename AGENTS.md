# AGENTS.md — Kenju Tech Client Portal

Compact guidance for OpenCode / AI agents working in this repository.

## 1. Tech Stack & Entry Points

- **Backend:** Laravel 13 (PHP 8.3+), `app/Http/Controllers`, `app/Models`, `routes/web.php`.
- **Frontend:** React 19 + TypeScript + Inertia.js 3, entry at `resources/js/app.tsx`.
- **Styling:** Tailwind CSS 4 via `@tailwindcss/vite` (no standalone `tailwind.config`).
- **Build Tool:** Vite 8, config in `vite.config.js`.
- **Routes:** All web routes live in `routes/web.php`. Inertia pages are under `resources/js/Pages/`.
- **Blade:** Only `resources/views/app.blade.php` (Inertia root) and email templates under `resources/views/emails/`.

## 2. Developer Commands

> Always use `workdir: D:\xampp\htdocs\lr_website` for PowerShell / bash commands.

| Task | Command |
|------|---------|
| Full setup | `composer setup` (runs `composer install`, env copy, key generate, migrate, npm install, build) |
| Dev server | `composer dev` (runs Laravel serve, queue, pail, Vite dev concurrently) |
| Build only | `npm run build` |
| Vite dev only | `npm run dev` |
| Run tests | `php artisan test` or `vendor/bin/phpunit` |
| Run single test | `vendor/bin/phpunit tests/Feature/ProjectRequestFeatureTest.php` |
| Run single test method | `vendor/bin/phpunit --filter test_request_form_submission_creates_user_and_project_request` |
| PHP lint/format | `vendor/bin/pint` (Laravel Pint) |
| Run queue | `php artisan queue:listen --tries=1 --timeout=0` |
| View logs | `php artisan pail` or check `storage/logs/laravel.log` |

**Important:** Always run `npm run build` before committing frontend changes. The repo currently expects `public/build/` to be generated and the deploy script reads `public/build/manifest.json`.

## 3. Architecture Quirks

### Inertia Shared Props
`app/Http/Middleware/HandleInertiaRequests.php` injects global props into every page:
- `auth.user` — current user with `isAdmin`, `company`, `avatar`.
- `flash.success`, `flash.error`, `flash.invoice_no`, `flash.appointment` — server messages for the UI.
- `frontpage` — full `FrontpageContent::getCurrent()` record (used by landing pages).
- `currentProjects` — first 4 projects from frontpage config, transformed for landing display.
- `unreadMessagesCount`, `pendingRequestsCount`, `pendingPaymentsCount`, `pendingInvoicesCount` — notification badges.
- `appointmentStatus` — latest appointment status for the current client.

Do not change these keys without updating the React sidebar/notification components.

### FrontpageContent Default Record
`app/Models/FrontpageContent.php` contains a large `defaultRecord()` array with all CMS defaults. The database table `frontpage_contents` should have exactly one row (created via `firstOrCreate`). If CMS fields are missing in production, migrate/seed or re-save via `/manage-frontpage`.

### Service Slugs
The public service detail pages are handled by a closure in `routes/web.php`:
- `/services/{slug}` — slug values are defined in `LandingHeader.tsx` and `Project::getServices()`.
- `/services/it-equipment-supply-setup` is the only route that fetches active `Product` models.

### Authorization Pattern
Controllers check roles inline with `$user->isAdmin()` or `abort(403)` rather than using policies. Keep this pattern. The `role:admin` middleware guards admin routes in `routes/web.php`.

User model roles:
- `App\Models\User::ROLE_ADMIN = 'admin'`
- `App\Models\User::ROLE_CLIENT = 'client'`

## 4. Database & Environment

- Default local DB in `.env` is **MySQL** (`DB_CONNECTION=mysql`, database `lr_website`).
- `.env.example` uses SQLite for quick setup; current local env is MySQL.
- `.env_production` points to production MySQL and a public subdirectory URL (`APP_URL=https://paskawasansik.com/sistem/public`).
- PHPUnit uses SQLite in-memory (`DB_CONNECTION=sqlite`, `DB_DATABASE=:memory:`), `SESSION_DRIVER=array`, `QUEUE_CONNECTION=sync`.
- Migrations are conventional Laravel migrations under `database/migrations/`; many small migrations added iteratively for CMS fields.
- `DatabaseSeeder` creates a default admin (`admin@kenju.tech` / `password`) and client (`client@kenju.tech` / `password`), demo projects, invoices, tickets, blog posts, and frontpage defaults.

## 5. Testing

- PHPUnit config: `phpunit.xml`.
- Test directories: `tests/Unit/`, `tests/Feature/`.
- `tests/Feature/ProjectRequestFeatureTest.php` uses `RefreshDatabase` and is the main existing feature test.
- Most tests will need `RefreshDatabase` because the request flow creates users and project requests.
- No TypeScript / frontend tests currently configured.

## 6. Storage & Uploads

- Storage disk is `local` (`FILESYSTEM_DISK=local`); public files are stored under `storage/app/public/` and served via `public/storage` symlink.
- **Always create the symlink** on new installs: `php artisan storage:link`.
- Upload paths in use:
  - `avatars/`
  - `frontpage/` (heroes, services, projects, clients, team, events, payment logos)
  - `payment-proofs/`
  - `products/`
  - `project-files/{project_id}/`
  - `project-requests/`
  - `wysiwyg/`
- `FrontpageController` uploads images to `public` disk and stores URLs prefixed with `asset('uploads/' . $path)`. This relies on the `public/storage` symlink.
- The `public/uploads/` and `public/storage/` directories are **generated** and are gitignored.

## 7. Deployment

- Deployment script: `deploy.ps1` (PowerShell) — FTP-based incremental deploy.
- It reads the last deployed hash from `.deploy-state` and uploads only changed files since that hash.
- Uses manifest from `public/build/manifest.json` to clean stale assets in `public/build/assets/` on the remote.
- **Before deploy:** run `npm run build` and commit `public/build/` changes.
- The script deploys to `web.multivita2u.com` FTP. Do not run this unless explicitly asked.
- `.deploy-state` contains the last deployed Git hash and is not committed.

## 8. Code Style & Conventions

- `.editorconfig`: 4 spaces indent, UTF-8, LF, final newline.
- PHP: no explicit style beyond Laravel defaults; run `vendor/bin/pint` to auto-format.
- TypeScript/React: no explicit ESLint config; use `tsc --noEmit` if available.
- Imports: use `@/` alias for `resources/js/`.
- React pages receive strongly typed props; existing pages use `interface` types in the file.
- Activity logging: most controllers call `ActivityLog::create([...])` after state changes. Maintain this for auditability.

## 9. Common Gotchas

- **Do not delete `public/build/`** — it is the production build output. Rebuild with `npm run build` after any React/CSS change.
- **Inertia forms:** Many forms use `useForm` and submit to Laravel routes. File uploads need `forceFormData: true`.
- **Ticket reply rules:** Clients cannot reply twice in a row, and resolved tickets cannot be replied to. See `TicketController::reply()`.
- **Invoice payment flow:** When admin verifies a payment proof, the invoice becomes `paid` and a project is auto-created if the invoice had no project. See `PaymentController::verify()` and `autoCreateProject()`.
- **Notifications:** The notification badge uses server-side counts in `HandleInertiaRequests` and is refreshed via `/notifications` JSON. Mark-as-read also updates `viewed_at`/`admin_viewed_at` on tickets.
- **CMS image uploads:** The `ManageFrontpage` and `ManageHero` pages expect specific array keys. If you add new CMS sections, mirror the pattern in `FrontpageController::update()` and `FrontpageContent::defaultRecord()`.
- **WYSIWYG uploads:** `POST /upload/wysiwyg-image` returns a specific JSON shape required by `jodit-react`.
- **Logo search:** `/api/logo-search` calls Clearbit autocomplete; it is optional and fails silently.

## 10. Quick Checks

Before finishing a task, verify:
1. `npm run build` succeeds.
2. `php artisan test` passes (or at least the relevant tests).
3. If you changed uploads/storage, `php artisan storage:link` is present.
4. If you added routes, they are in `routes/web.php` and use correct middleware groups.

## 11. External References

- Laravel docs: https://laravel.com/docs
- Inertia.js: https://inertiajs.com/
- Tailwind CSS: https://tailwindcss.com/
