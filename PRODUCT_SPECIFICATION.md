# Product Specification — Kenju Tech Client Portal

**Dokumen versi:** 1.0  
**Tarikh:** 2026-07-25  
**Status:** Active / In Development  
**Penulis:** OpenCode (dijana daripada analisis kod projek)  

---

## 1. Executive Summary

**Kenju Tech Client Portal** ialah sistem web bersepadu yang menggabungkan laman web korporat (corporate landing site) dengan ruang pelanggan (client portal) dan panel pentadbir (admin dashboard) untuk sebuah syarikat pembangunan digital & penyelesaian IT. Sistem ini membolehkan pelanggan baru membuat temujanji (appointment), meminta sebut harga (quotation), mengurus projek, melihat invois, membuat bayaran, serta membuka tiket sokongan. Pentadbir pula dapat mengurus kandungan laman web, projek, invois, pembayaran, janji temu, blog, produk, dan pangkalan data pelanggan.

Sistem ini dibina menggunakan **Laravel 13 (PHP 8.3)** sebagai backend, **React 19 + Inertia.js 3** sebagai frontend, dan **Tailwind CSS 4** untuk styling. Pangkalan data lalai ialah **SQLite** untuk persekitaran tempatan (local), tetapi boleh ditukar kepada MySQL/PostgreSQL untuk production.

---

## 2. Product Vision & Objectives

### 2.1 Visi
> Menyediakan platform digital lengkap yang menyatukan pemasaran syarikat, pengurusan projek, dan hubungan pelanggan dalam satu sistem yang moden, pantas, dan mesra pengguna.

### 2.2 Objektif Utama

| # | Objektif | Penerangan |
|---|----------|------------|
| O1 | **Papar kehadiran digital syarikat** | Laman web korporat yang boleh diedit sepenuhnya oleh admin tanpa menyentuh kod. |
| O2 | **Permudah proses lead-to-client** | Borang permintaan projek akan membuat akaun pelanggan secara automatik dan menghantar notifikasi kepada admin. |
| O3 | **Pusatkan pengurusan projek** | Pelanggan dan admin boleh melihat status, milestone, fail, dan catatan projek dalam satu ruang. |
| O4 | **Automasi invois & bayaran** | Admin menjana invois; pelanggan membuat bayaran dan memuat naik bukti; admin mengesahkan bayaran. |
| O5 | **Sokongan pelanggan berstruktur** | Sistem tiket (ticket system) dengan peraturan giliran balas antara admin & pelanggan. |
| O6 | **Audit & ketelusan** | Setiap tindakan penting direkod dalam aktiviti log untuk rujukan admin dan pelanggan. |

---

## 3. Stakeholders & User Personas

### 3.1 Stakeholders

| Stakeholder | Peranan | Kepentingan |
|-------------|---------|-------------|
| **Pelanggan (Client)** | Pengguna berbayar yang memiliki projek di Kenju Tech | Melihat status, membuat bayaran, sokongan |
| **Admin / Pengurus** | Kakitangan Kenju Tech | Mengurus semua operasi & kandungan |
| **Pengunjung (Visitor)** | Pengguna awam | Mencari perkhidmatan, membaca blog, menghubungi syarikat |
| **Pemilik Produk** | Kenju Tech | Menarik lead, mengurus projek, mengutip bayaran |

### 3.2 Personas

#### Persona A: Admin — Alex (Project Manager)
- **Tugas:** Meluluskan temujanji, menjana invois, mengemas kini milestone, menjawab tiket sokongan.
- **Keperluan:** Dashboard ringkas, notifikasi real-time, capaian pantas kepada klien & projek.
- **Frustrasi:** Terpaksa guna banyak aplikasi berasingan untuk CRM, invois, dan sokongan.

#### Persona B: Client — Brenda (Startup Founder)
- **Tugas:** Memantau projek, membuat bayaran, meminta bantuan.
- **Keperluan:** Lihat status projek tanpa perlu bertanya, bayaran yang mudah, sokongan responsif.
- **Frustrasi:** Tidak tahu projek di peringkat mana dan berapa banyak yang telah dibayar.

#### Persona C: Visitor — Victor (Potential Customer)
- **Tugas:** Mencari perkhidmatan pembangunan web/sistem.
- **Keperluan:** Laman web profesional, senang hubungi, promosi jelas.
- **Frustrasi:** Borang kontak yang tidak dibalas atau laman web ketinggalan zaman.

---

## 4. Functional Requirements

### 4.1 Modul Laman Web Korporat (Public Landing)

#### 4.1.1 Halaman Utama (Home)
- Hero section yang boleh dikonfigurasi sepenuhnya (tajuk, subtitle, CTA, imej, avatars).
- Paparan logo klien (Clients).
- Grid perkhidmatan (Services Grid).
- Promosi/penawaran (Promotions).
- Projek semasa (Current Projects).
- Statistik syarikat (Stats).
- CTA akhir & footer.

#### 4.1.2 Halaman Perkhidmatan (Services)
- Senarai 6 perkhidmatan: Web Development, Mobile Apps, Web System, Digital Marketing, Game Development, IT Equipment Supply & Setup.
- Setiap perkhidmatan mempunyai halaman detail tersendiri (`/services/{slug}`).
- Hero perkhidmatan boleh diedit secara berasingan.
- Promosi & CTA diintegrasikan.

#### 4.1.3 Halaman Kerja (Work)
- Galeri projek lepas (featured work).
- Halaman detail projek lepas (`/work/{slug}`).

#### 4.1.4 Halaman Tentang Kami (About)
- Visi & misi syarikat.
- Pasukan (Team) dengan gambar & peranan.
- Acara (Events) dengan tarikh & lokasi.

#### 4.1.5 Halaman Blog (Blog)
- Senarai artikel yang diterbitkan.
- Halaman artikel individu (`/blog/{slug}`).
- Sokongan imej sampul, kategori, penulis, dan petikan (excerpt).

#### 4.1.6 Halaman Hubungi (Contact)
- Maklumat hubungi (emel, telefon, pejabat) yang boleh diedit.
- Borang hubungan yang menukar menjadi tiket sokongan (guest ticket).

#### 4.1.7 Halaman Produk (Products)
- Katalog produk IT Equipment (cth. printer, keyboard) yang boleh diuruskan oleh admin.
- Produk aktif dipaparkan di halaman `/products` dan juga dalam halaman perkhidmatan IT Equipment.

---

### 4.2 Modul Pengguna & Autentikasi

#### 4.2.1 Pendaftaran Pelanggan (Public Registration)
- Pengunjung boleh membuat permintaan projek melalui `/request`.
- Proses ini secara automatik:
  1. Membuat akaun `User` dengan peranan `client`.
  2. Membuat rekod `ProjectRequest`.
  3. Memuat naik fail sokongan jika ada.
  4. Menghantar notifikasi kepada semua admin.
  5. Log masuk pengguna secara automatik.

#### 4.2.2 Log Masuk & Log Keluar
- Halaman `/login` untuk pengguna berdaftar.
- Sesi `remember me` disokong.
- Log keluar membatalkan sesi dan token.

#### 4.2.3 Pengurusan Profil
- Pengguna boleh mengemas kini:
  - Nama, emel, syarikat, industri, alamat perniagaan, nombor perniagaan, WhatsApp, nombor pendaftaran perniagaan.
  - Senarai orang bertanggungjawab (persons in charge) dengan nama, peranan, emel.
- Tukar kata laluan (mesti sahkan kata laluan semasa).
- Muat naik/buang avatar.

#### 4.2.4 Peranan (Roles)
- `admin` — capaian penuh.
- `client` — capaian terhad kepada data sendiri sahaja.
- Middleware `role:admin` mengawal capaian ke laluan pentadbir.

---

### 4.3 Modul Janji Temu & Permintaan Projek (Appointments / Project Requests)

#### 4.3.1 Borang Permintaan Awam
- **Laluan:** `/request` (guest only).
- Medan: nama syarikat, nama hubungan, telefon, emel, kata laluan, jenis temujanji (Fizikal/Online), tarikh, masa, mesej.
- Validasi: emel unik, kata laluan ≥6 aksara, tarikh tidak boleh lepas.
- Selepas hantar, pengguna diarahkan ke halaman Appointments.

#### 4.3.2 Pengurusan Janji Temu Pelanggan
- **Laluan:** `/appointments` (client).
- Pelanggan boleh melihat senarai permintaan temujanji dan statusnya.
- Pelanggan boleh membuat temujanji baharu melalui halaman Appointment.
- Status: `pending`, `approved`, `rejected`.
- Jika ditolak, sebab penolakan dipaparkan.
- Notifikasi automatik dihantar apabila status berubah.

#### 4.3.3 Pentadbiran Permintaan (Admin)
- **Laluan:** `/requests` (admin).
- Admin melihat semua permintaan dengan butiran syarikat & hubungan.
- **Tindakan:**
  - **Approve** — tukar status kepada `approved`, hantar notifikasi kepada pelanggan.
  - **Reject** — memerlukan sebab, tukar status kepada `rejected`, hantar notifikasi.
  - **Update** — ubah jenis temujanji, tarikh, masa, mesej.
  - **Delete** — padam permintaan beserta fail & notifikasi berkaitan.

---

### 4.4 Modul Pengurusan Projek (Projects)

#### 4.4.1 Jenis Perkhidmatan
| Value | Label |
|-------|-------|
| web_system | Web System |
| website | Website Development |
| mobile_app | Mobile App Development |
| digital_marketing | Digital Marketing |
| it_solutions | IT Solutions |
| game_development | Game Development |

#### 4.4.2 Cipta Projek
- **Client:** boleh cipta projek sendiri melalui `/projects/create`.
- **Admin:** boleh cipta projek untuk mana-mana klien.
- Medan: tajuk, jenis perkhidmatan, jenis sistem, ciri-ciri, peranan pengguna, integrasi, bajet, tarikh akhir, hosting/domain, nota tambahan, penerangan, fail sokongan (sehingga 20MB).

#### 4.4.3 Papar & Kemas Kini Projek
- **Laluan:** `/projects/{project}` dan `/projects/{project}/edit`.
- **Client:** boleh kemas kini medan permintaan (tajuk, ciri, bajet, dll).
- **Admin:** boleh kemas kini status, progress, status pembayaran, key person, status remark.
- Projek memaparkan jumlah bayaran yang telah dibuat (`total_paid`).

#### 4.4.4 Milestone
- **Admin:** boleh tambah, edit, padam milestone.
- Setiap milestone: tajuk, catatan, progress, tarikh akhir.
- Kemas kini milestone akan mengemas kini progress projek secara automatik.
- Milestone ditunjukkan dalam halaman detail projek.

#### 4.4.5 Fail Projek (File Uploads)
- Pelanggan & admin boleh muat naik fail ke projek (sehingga 20MB).
- Fail boleh dipadam oleh admin atau pemilik projek.
- Fail daripada permintaan projek (ProjectRequest) juga dipaparkan dalam projek berkaitan.

#### 4.4.6 Status Projek
- `in_progress` — sedang dibangunkan.
- `completed` — selesai.
- `on_hold` — digantung.

#### 4.4.7 Status Pembayaran Projek
- `unpaid`, `partial`, `paid`.

---

### 4.5 Modul Invois (Invoices)

#### 4.5.1 Senarai Invois
- **Client:** melihat invois sendiri sahaja.
- **Admin:** melihat semua invois dengan widget ringkasan (jumlah billing, pending, complete, overdue, revenue).
- Penapis mengikut status: `paid`, `pending`, `overdue`.

#### 4.5.2 Cipta Invois (Admin)
- **Laluan:** `POST /invoices`.
- Medan: klien, projek (pilihan), alamat syarikat, nombor syarikat, tarikh invois, status, URL pembayaran, item-item invois (penerangan + jumlah).
- Nombor invois dijana automatik: `INV-{YYYY}-{XXX}`.
- Jumlah invois dikira automatik daripada jumlah item.
- Emel notifikasi `NewInvoiceMail` dihantar kepada klien (silent fail jika emel tidak kritikal).

#### 4.5.3 Kemas Kini & Padam Invois (Admin)
- Admin boleh tukar status, URL pembayaran, dan jumlah invois.
- Invois boleh dipadam.

#### 4.5.4 Halaman Invois Pelanggan
- **Laluan:** `/invoices/{invoice}`.
- Memaparkan butiran invois, item-item, dan bukti bayaran yang sedia ada.
- Pelanggan boleh klik untuk membuat bayaran.

---

### 4.6 Modul Pembayaran (Payments)

#### 4.6.1 Halaman Pembayaran Awam
- **Laluan:** `/payment/{invoiceNo}` (boleh diakses tanpa log masuk untuk memudahkan bayaran).
- Memaparkan butiran invois dan borang muat naik bukti bayaran.

#### 4.6.2 Hantar Bukti Bayaran
- Medan: nombor invois, kaedah pembayaran (`bank_transfer`, `qr_code`), nama, emel, fail bukti (jpg/png/pdf, max 6MB).
- Jika invois sudah `paid`, bukti tidak diterima.
- Fail disimpan di `storage/app/public/payment-proofs`.

#### 4.6.3 Pengesahan Pembayaran (Admin)
- **Laluan:** `/payments` dan `PUT /payment-proofs/{proof}/verify`.
- Admin melihat senarai bukti bayaran pending.
- **Tindakan:**
  - **Verify** — tukar status invois kepada `paid`, rekod `paid_at`, cipta projek automatik jika invois tidak berkaitan dengan projek.
  - **Reject** — tukar status bukti kepada `rejected`, boleh tambah nota.

#### 4.6.4 Cipta Projek Automatik
- Apabila invois tanpa projek dibayar, sistem automatik cipta projek daripada penerangan item pertama.
- Jenis perkhidmatan dikesan secara heuristik daripada teks item (website, mobile, marketing, game, it).

---

### 4.7 Modul Sokongan (Support Tickets)

#### 4.7.1 Tiket Pelanggan
- **Laluan:** `/support`.
- Pelanggan boleh cipta tiket: subjek, penerangan, keutamaan, pilihan projek berkaitan.
- Nombor tiket dijana automatik: `TKT-{YYYY}-{XXX}`.
- Pelanggan & admin boleh berbalas dalam thread.
- **Peraturan giliran balas:**
  - Pelanggan tidak boleh balas dua kali berturut-turut; mesti tunggu admin.
  - Admin boleh balas bila-bila masa.
  - Tiket yang `resolved` tidak boleh menerima balasan.
- Status tiket: `open`, `in_progress`, `resolved`.
- Keutamaan: `low`, `medium`, `high`.

#### 4.7.2 Tiket daripada Halaman Hubungi
- Pengunjung awam boleh hantar mesej melalui `/contact`.
- Mesej ditukar menjadi tiket tanpa `user_id` (guest ticket).
- Admin boleh melihat dan mengurus tiket ini.

#### 4.7.3 Notifikasi Tiket
- `viewed_at` — pelanggan melihat tiket.
- `admin_viewed_at` — admin melihat tiket.
- Badge notifikasi dikemas kini apabila ada tiket baharu.

---

### 4.8 Modul Pangkalan Data Pelanggan (Client Database)

#### 4.8.1 Senarai Klien (Admin)
- **Laluan:** `/clients`.
- Memaparkan senarai klien dengan:
  - Maklumat peribadi & syarikat.
  - Bilangan projek & invois.
  - Projek terkini.
  - Permintaan projek terkini beserta fail.
- Admin boleh mengemas kini maklumat klien.
- Admin boleh memadam klien (kecuali admin).

---

### 4.9 Modul Pengurusan Kandungan (CMS)

#### 4.9.1 Frontpage Management
- **Laluan:** `/manage-frontpage`.
- Admin boleh mengedit hampir semua kandungan laman web utama:
  - Hero (badge, tajuk, subtitle, CTA, imej, avatars).
  - Perkhidmatan (services): ikon, tajuk, penerangan, imej.
  - Projek (projects): tajuk, kategori, imej, pautan.
  - Klien (clients): nama, logo.
  - Stats: ikon, nilai, label.
  - CTA, footer tagline, social links.
  - About: visi, misi, pasukan, acara.
  - Contact: tajuk, emel, telefon, pejabat.
  - Payment: logo QR, logo accepted payments, maklumat bank.
  - Invoice settings: nama syarikat, emel, nombor hubungan.

#### 4.9.2 Hero Management
- **Laluan:** `/manage-hero`.
- Pengurusan hero berasingan untuk setiap halaman:
  - Home, Services, Web Development, Mobile Apps, Web System, Digital Marketing, Game Development, IT Equipment, Work, About.
- Sokongan muat naik imej & avatars untuk setiap halaman.

#### 4.9.3 Blog Management
- **Laluan:** `/manage-blog`.
- CRUD artikel blog.
- Medan: tajuk, slug, kategori, penulis, petikan, kandungan, tarikh terbitan, status terbitan, imej sampul.
- Slug dijana automatik daripada tajuk jika tidak disediakan.
- WYSIWYG editor disediakan untuk kandungan artikel.

#### 4.9.4 Product Management
- **Laluan:** `/manage-products`.
- CRUD produk IT Equipment.
- Medan: nama, spesifikasi, harga, badge, imej, susunan, status aktif.
- Produk aktif dipaparkan di halaman `/products` dan dalam halaman IT Equipment.

#### 4.9.5 Logo Search (Clearbit API)
- **Laluan:** `/api/logo-search`.
- Cari logo syarikat menggunakan API Clearbit untuk kegunaan dalam senarai klien.
- Fail silently jika API tidak tersedia.

---

### 4.10 Modul Notifikasi & Aktiviti

#### 4.10.1 Notifikasi Dalam Aplikasi
- **Laluan:** `/notifications` (JSON), `/notifications/mark-as-read`.
- Jenis notifikasi:
  - Tiket baharu / tidak dibaca.
  - Invois pending.
  - Bayaran diterima (admin).
  - Permintaan projek baharu.
  - Bukti bayaran pending.
  - Status temujanji (approved/rejected) untuk pelanggan.
- Badge notifikasi dipaparkan di header dashboard.
- Mark-as-read akan mengemas kini `viewed_at` dan `is_read`.

#### 4.10.2 Aktiviti Log (Activity Log)
- Setiap tindakan penting direkod:
  - Log masuk/keluar/daftar.
  - Cipta/kemas kini/padam projek.
  - Milestone ditambah/diedit/dipadam.
  - Muat naik/padam fail.
  - Invois dijana/dikemas kini/dipadam.
  - Bukti bayaran dihantar/disedahkan/ditolak.
  - Tiket dibuka/balas/dikemas kini/dipadam.
  - Temujanji diluluskan/ditolak/dikemas kini.
- Log boleh dipaparkan di dashboard untuk admin & pelanggan (dihadkan kepada aktiviti sendiri untuk pelanggan).

---

## 5. Non-Functional Requirements

| # | Kategori | Keperluan |
|---|----------|-----------|
| N1 | **Performance** | Halaman utama mesti dimuat dalam < 3 saat pada rangkaian 4G. |
| N2 | **Security** | Autentikasi berasaskan sesi Laravel, CSRF protection, validasi input, authorization via middleware. |
| N3 | **Scalability** | Rekaan modular membolehkan penambahan modul baharu tanpa mengganggu modul sedia ada. |
| N4 | **Availability** | Uptime target 99.5% untuk production. |
| N5 | **Maintainability** | Kod mengikuti konvensi Laravel & React, menggunakan komponen reusable, dan mempunyai migration & seeder. |
| N6 | **Accessibility** | UI menggunakan Tailwind dengan kontras warna yang baik, sokongan keyboard navigation. |
| N7 | **Mobile Responsive** | Semua halaman mestilah responsive untuk desktop, tablet, dan mobile. |
| N8 | **Data Integrity** | Relasi database menggunakan foreign key & cascade apabila sesuai. |
| N9 | **Backup** | Pangkalan data & fail storan hendaklah dibuat backup berkala. |
| N10 | **SEO** | Meta title, meta description, dan URL bersih (slug) untuk blog & perkhidmatan. |

---

## 6. System Architecture

### 6.1 Tech Stack

| Layer | Teknologi | Versi |
|-------|-----------|-------|
| Backend Framework | Laravel | 13.8+ |
| Language | PHP | 8.3+ |
| Frontend Framework | React | 19.2+ |
| Full-Stack Bridge | Inertia.js (React adapter) | 3.6+ |
| Styling | Tailwind CSS | 4.3+ |
| Build Tool | Vite | 8.0+ |
| TypeScript | TypeScript | 7.0+ |
| Routing | Ziggy | 2.6+ |
| Icons | Lucide React | 1.24+ |
| Date Picker | react-datepicker | 9.1+ |
| WYSIWYG | jodit-react | 5.3+ |
| Database | SQLite (dev) / MySQL or PostgreSQL (prod) | — |
| Queue | Database | — |
| Cache | Database | — |
| Mail | log (dev) / SMTP (prod) | — |
| Storage | local/public disk | — |

### 6.2 Directory Structure (Key)

```
D:\xampp\htdocs\lr_website
├── app/
│   ├── Http/Controllers/      # Semua controller
│   ├── Mail/                 # NewInvoiceMail
│   ├── Models/               # Eloquent models
│   ├── Providers/            # AppServiceProvider
│   └── Traits/               # LogsActivity
├── config/                   # Konfigurasi Laravel
├── database/
│   ├── factories/            # Faker factories
│   ├── migrations/           # Skema database
│   └── seeders/              # DatabaseSeeder
├── public/                   # Aset awam, uploads, index.php
├── resources/
│   ├── css/app.css           # Tailwind CSS
│   ├── js/
│   │   ├── app.tsx           # Entry React
│   │   ├── Components/        # Reusable UI components
│   │   ├── Layouts/          # Dashboard & Landing layouts
│   │   └── Pages/            # Inertia pages
│   └── views/                # Blade templates (app, emails)
├── routes/web.php            # Semua web routes
├── composer.json             # PHP dependencies
└── package.json              # JS dependencies
```

### 6.3 Architecture Pattern
- **Backend:** MVC dengan controller yang mengembalikan `Inertia::render(...)`.
- **Frontend:** React pages yang menerima props daripada Laravel.
- **State:** Inertia shared props (`auth`, `flash`, `unreadMessagesCount`, dll.) dan local component state.
- **Styling:** Tailwind CSS utility-first dengan tema warna biru/slate.

---

## 7. Database Schema (Logical)

### 7.1 Core Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `users` | Akaun pengguna | id, name, email, password, role, company, industry, avatar, business_address, whatsapp, business_reg_no, persons_in_charge |
| `projects` | Projek aktif | id, user_id, title, category, service_type, system_type, features, budget, deadline, status, progress, payment_status |
| `project_requests` | Permintaan/janji temu | id, user_id, company_name, contact_name, contact_email, appointment_type, appointment_date, appointment_time, message, status, rejection_reason |
| `project_request_files` | Fail sokongan permintaan | id, project_request_id, filename, path, size |
| `invoices` | Invois | id, user_id, project_id, invoice_no, issue_date, amount, status, paid_at, company_name, company_address, payment_url |
| `invoice_items` | Item invois | id, invoice_id, description, amount |
| `payment_proofs` | Bukti bayaran | id, invoice_id, payment_method, name, email, proof_path, status, notes |
| `tickets` | Tiket sokongan | id, user_id, project_id, ticket_no, subject, description, status, priority, viewed_at, admin_viewed_at |
| `ticket_replies` | Balasan tiket | id, ticket_id, user_id, message |
| `milestones` | Tanda aras projek | id, project_id, title, note, due_date, is_active |
| `file_uploads` | Fail projek | id, project_id, uploaded_by, filename, path, size, mime_type |
| `blog_posts` | Artikel blog | id, title, slug, category, author, excerpt, content, image, published_at, is_published |
| `products` | Katalog produk | id, name, spec, price, badge, image, sort_order, is_active |
| `frontpage_contents` | Kandungan laman web | id, [>50 kolom konfigurasi CMS] |
| `notifications` | Notifikasi dalaman | id, user_id, type, notifiable_type, notifiable_id, title, message, is_read, read_at |
| `activity_logs` | Audit trail | id, user_id, project_id, related_type, related_id, type, description |
| `sessions` | Sesi pengguna | Laravel default |
| `cache` / `jobs` | Cache & queue | Laravel default |

### 7.2 Relationships

```
User 1---* Project
User 1---* Invoice
User 1---* Ticket
User 1---* ProjectRequest
User 1---* ActivityLog

Project 1---* Milestone
Project 1---* Invoice
Project 1---* Ticket
Project 1---* FileUpload
Project 1---* ActivityLog

Invoice 1---* InvoiceItem
Invoice 1---* PaymentProof

Ticket 1---* TicketReply

ProjectRequest 1---* ProjectRequestFile

Notification morphs to ProjectRequest, etc.
ActivityLog morphs to related entities.
```

---

## 8. Routes & API

### 8.1 Public Routes

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/` | Home |
| GET | `/services` | Services page |
| GET | `/services/{slug}` | Service detail |
| GET | `/work` | Work/portfolio page |
| GET | `/work/{slug}` | Project detail |
| GET | `/about` | About page |
| GET | `/blog` | Blog listing |
| GET | `/blog/{post:slug}` | Blog post |
| GET | `/contact` | Contact page |
| POST | `/contact` | Submit guest ticket |
| GET | `/products` | Public product catalog |
| GET | `/payment/{invoiceNo}` | Public payment page |
| POST | `/payment/proof` | Submit payment proof |

### 8.2 Authentication Routes

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/login` | Login form |
| POST | `/login` | Authenticate |
| GET | `/register` | Register form |
| POST | `/register` | Create client account |
| GET | `/request` | Public project request form |
| POST | `/request` | Submit project request |
| POST | `/logout` | Logout |

### 8.3 Authenticated Routes (Client + Admin)

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/dashboard` | Dashboard |
| GET | `/profile` | Profile page |
| POST | `/profile` | Update profile |
| POST | `/profile/password` | Change password |
| POST | `/profile/avatar` | Upload avatar |
| POST | `/profile/avatar/remove` | Remove avatar |
| GET | `/notifications` | Fetch notifications |
| POST | `/notifications/mark-as-read` | Mark notifications read |
| GET | `/projects` | Project list |
| GET | `/projects/create` | Create project form |
| POST | `/projects` | Store project |
| GET | `/projects/{project}` | Project detail |
| GET | `/projects/{project}/edit` | Edit project form |
| PUT | `/projects/{project}` | Update project |
| POST | `/projects/{project}/files` | Upload project file |
| DELETE | `/projects/{project}/files/{file}` | Delete project file |
| GET | `/invoices` | Invoice list |
| GET | `/invoices/{invoice}` | Invoice detail |
| GET | `/support` | Support tickets |
| POST | `/support` | Create ticket |
| POST | `/support/{ticket}/reply` | Reply ticket |
| GET | `/appointments` | Client appointments |
| POST | `/appointments` | Book appointment |

### 8.4 Admin Routes (role:admin)

| Method | Route | Purpose |
|--------|-------|---------|
| DELETE | `/projects/{project}` | Delete project |
| POST | `/projects/{project}/milestones` | Add milestone |
| PUT | `/projects/{project}/milestones/{milestone}` | Update milestone |
| DELETE | `/projects/{project}/milestones/{milestone}` | Delete milestone |
| POST | `/invoices` | Create invoice |
| PUT | `/invoices/{invoice}` | Update invoice |
| DELETE | `/invoices/{invoice}` | Delete invoice |
| GET | `/payments` | Payment proofs list |
| PUT | `/payment-proofs/{proof}/verify` | Verify/reject payment proof |
| PUT | `/support/{ticket}` | Update ticket status/priority |
| DELETE | `/support/{ticket}` | Delete ticket |
| GET | `/clients` | Client database |
| PUT | `/clients/{client}` | Update client |
| DELETE | `/clients/{client}` | Delete client |
| GET | `/requests` | Manage appointments/requests |
| PUT | `/requests/{request}` | Update request details |
| POST | `/requests/{request}/approve` | Approve request |
| POST | `/requests/{request}/reject` | Reject request |
| DELETE | `/requests/{request}` | Delete request |
| GET | `/manage-frontpage` | CMS frontpage |
| POST | `/manage-frontpage` | Update frontpage |
| GET | `/manage-hero` | CMS heroes |
| POST | `/manage-hero` | Update heroes |
| POST | `/upload/wysiwyg-image` | Upload WYSIWYG image |
| GET | `/api/logo-search` | Search company logos |
| GET | `/manage-blog` | Blog list |
| POST | `/manage-blog` | Create blog post |
| PUT | `/manage-blog/{post}` | Update blog post |
| DELETE | `/manage-blog/{post}` | Delete blog post |
| GET | `/manage-products` | Product list |
| POST | `/manage-products` | Create product |
| PUT | `/manage-products/{product}` | Update product |
| DELETE | `/manage-products/{product}` | Delete product |

---

## 9. User Interface (UI) Requirements

### 9.1 Design System
- **Color Palette:** Slate (neutral), Blue (primary), Emerald (success), Amber (warning), Red (danger).
- **Typography:** Font sans-serif lalai Tailwind; heading besar & bold.
- **Spacing:** Consistent 4px grid, max-width container `max-w-7xl`.
- **Border Radius:** `rounded-xl` / `rounded-2xl` / `rounded-3xl` untuk card dan butang.
- **Shadows:** `shadow-sm` untuk card, `shadow-xl` untuk modal/dropdown.
- **Icons:** Lucide React icons sahaja.

### 9.2 Layouts

| Layout | Digunakan Di |
|--------|--------------|
| **Landing Layout** | Home, Services, Work, About, Blog, Contact, Products, Payment, Request, Login, Register |
| **Dashboard Layout** | Dashboard, Projects, Invoices, Support, Appointments, Profile, Admin CMS pages |

### 9.3 Key UI Components
- **LandingHeader:** Navigasi utama dengan dropdown Services, responsive mobile menu.
- **LandingFooter:** Footer gelap dengan maklumat syarikat & social links.
- **DashboardLayout:** Sidebar gelap, top header, notifikasi, profil dropdown.
- **Card, Badge, Progress:** Komponen reusable dalam dashboard.
- **Hero, ServicesGrid, CurrentProjects, Clients, Stats, Cta:** Komponen landing page.
- **Modal / ConfirmModal:** Untuk tindakan padam & pengesahan.
- **WysiwygEditor:** Editor kandungan untuk blog & CMS.

### 9.4 Responsive Breakpoints
- Mobile: `< 768px` (md)
- Tablet: `768px - 1024px` (lg)
- Desktop: `>= 1024px` (lg/xl)

---

## 10. Security Requirements

### 10.1 Authentication & Authorization
- Sistem berasaskan sesi Laravel dengan `SESSION_DRIVER=database`.
- Middleware `auth` melindungi laluan dalaman.
- Middleware `role:admin` melindungi laluan pentadbir.
- `Gate`/`Policy` tidak digunakan secara meluas; kawalan capaian dilakukan dalam controller menggunakan `$user->isAdmin()` dan semakan pemilikan (`$project->user_id !== $user->id`).

### 10.2 Input Validation
- Semua input divalidasi menggunakan `FormRequest` atau `Request::validate()` dalam controller.
- Fail dihadkan saiz dan jenis (contoh: 20MB untuk fail projek, 6MB untuk bukti bayaran, 2MB untuk avatar/blog image).
- File upload disimpan di `storage/app/public/` dengan path yang tidak boleh diteka.

### 10.3 CSRF Protection
- Semua borang POST/PUT/DELETE menggunakan token CSRF Laravel.
- Permintaan AJAX (`/notifications`) menyertakan header `X-CSRF-TOKEN`.

### 10.4 Password Security
- Kata laluan dihash menggunakan Bcrypt (12 rounds).
- `Password::defaults()` digunakan untuk polisi kata laluan.

### 10.5 Data Privacy
- Pelanggan hanya melihat data sendiri (invoices, projects, tickets) melainkan admin.
- Admin melihat semua data.

---

## 11. Business Rules

### 11.1 Project & Invoice
- **BR1:** Setiap projek mesti dikaitkan dengan seorang `User` (klien).
- **BR2:** Admin boleh cipta projek untuk mana-mana klien; klien hanya boleh cipta untuk diri sendiri.
- **BR3:** Invois yang dibayar secara penuh tidak boleh menerima bukti bayaran baharu.
- **BR4:** Pembayaran yang disahkan (`verified`) akan menandakan invois sebagai `paid` dan mencipta projek automatik jika tiada projek berkaitan.
- **BR5:** Jumlah invois dihitung daripada jumlah item-item invois.

### 11.2 Support Tickets
- **BR6:** Tiket yang `resolved` tidak boleh dibalas.
- **BR7:** Klien tidak boleh membalas dua kali berturut-turut; perlu tunggu admin.
- **BR8:** Admin boleh balas bila-bila masa dan menukar status/prioriti.

### 11.3 Appointments
- **BR9:** Permintaan temujanji baharu adalah `pending` sehingga diluluskan atau ditolak oleh admin.
- **BR10:** Jika ditolak, sebab penolakan mesti diberikan dan dipaparkan kepada pelanggan.
- **BR11:** Pelanggan boleh membuat temujanji baharu melalui dashboard setelah mendaftar.

### 11.4 Notifications
- **BR12:** Setiap tindakan penting (invois, tiket, bayaran, temujanji) menjana notifikasi atau aktiviti log.
- **BR13:** Mark-as-read mengemas kini semua notifikasi dan status `viewed` untuk tiket.

---

## 12. Deployment & Environment

### 12.1 Environment Configuration

Fail `.env.example` menunjukkan konfigurasi asas:

```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost
APP_LOCALE=en
APP_TIMEZONE=Asia/Kuala_Lumpur

DB_CONNECTION=sqlite

SESSION_DRIVER=database
BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
CACHE_STORE=database

MAIL_MAILER=log
```

### 12.2 Setup Commands

```bash
composer install
php artisan key:generate
php artisan migrate --force
npm install --ignore-scripts
npm run build
```

### 12.3 Storage
- `public/storage` — symlink ke `storage/app/public` untuk fail awam.
- Fail kategori: `avatars`, `frontpage/`, `payment-proofs/`, `products/`, `project-files/`, `project-requests/`, `wysiwyg/`.

### 12.4 Production Considerations
- Tukar `DB_CONNECTION` kepada MySQL/PostgreSQL.
- Konfigurasi `MAIL_MAILER` kepada SMTP atau service email (Postmark, Mailgun, SES).
- Jalankan `php artisan storage:link`.
- Jalankan queue worker untuk pemprosesan emel/background jobs.
- Konfigurasi HTTPS dan set `APP_URL` dengan domain sebenar.
- Set `APP_DEBUG=false` untuk production.

---

## 13. Future Enhancements (Roadmap)

| # | Cadangan | Priority |
|---|----------|----------|
| F1 | **Password Reset** — Forgot password flow. | High |
| F2 | **Email Verification** — Sahkan emel semasa pendaftaran. | Medium |
| F3 | **File Preview** — Preview fail dalam browser (PDF, imej). | Medium |
| F4 | **Invoice PDF Export** — Jana invois dalam format PDF untuk muat turun. | High |
| F5 | **Recurring Invoices** — Invois berulang untuk langganan. | Low |
| F6 | **Role-Based Permissions** — Haluskan peranan (editor, finance, project manager). | Medium |
| F7 | **Multi-Language** — Sokongan Bahasa Melayu & Bahasa Inggeris. | Medium |
| F8 | **Real-time Notifications** — Gunakan WebSockets/Laravel Echo. | Low |
| F9 | **Reporting Dashboard** — Chart untuk revenue, projek, klien. | Medium |
| F10 | **API Public** — REST API untuk integrasi pihak ketiga. | Low |

---

## 14. Acceptance Criteria

### 14.1 Client Registration & Request
- [ ] Pengunjung boleh mengisi borang `/request` dan menerima akaun serta log masuk automatik.
- [ ] Admin menerima notifikasi bahawa ada permintaan projek baharu.
- [ ] Pelanggan melihat status `pending` dalam `/appointments`.

### 14.2 Project Management
- [ ] Klien boleh cipta projek dan melihat status dalam dashboard.
- [ ] Admin boleh menambah milestone dan progress projek dikemas kini.
- [ ] Fail boleh dimuat naik dan dimuat turun oleh pihak berkenaan.

### 14.3 Invoicing & Payment
- [ ] Admin boleh menjana invois dengan item-item.
- [ ] Klien melihat invois dalam dashboard dan boleh membuat bayaran.
- [ ] Admin boleh mengesahkan bukti bayaran dan status invois bertukar kepada `paid`.

### 14.4 Support
- [ ] Klien boleh membuka tiket dan membalas sekali per giliran.
- [ ] Admin boleh membalas dan menyelesaikan tiket.
- [ ] Tiket yang `resolved` tidak boleh dibalas.

### 14.5 CMS
- [ ] Admin boleh mengubah hero, services, projects, team, events, blog, dan products tanpa menyentuh kod.
- [ ] Perubahan kandungan terpantas dalam laman web awam.

---

## 15. Glossary

| Istilah | Maksud |
|---------|--------|
| **Admin** | Kakitangan Kenju Tech dengan capaian penuh. |
| **Client** | Pelanggan berdaftar yang mempunyai projek/invois. |
| **Inertia.js** | Library yang menghubungkan Laravel dan React tanpa API berasingan. |
| **Milestone** | Tanda aras dalam projek yang menunjukkan kemajuan. |
| **Payment Proof** | Fail bukti bayaran yang dimuat naik oleh pelanggan. |
| **Project Request** | Permintaan/janji temu baharu daripada pelanggan. |
| **Ticket** | Tiket sokongan untuk isu atau pertanyaan. |
| **WYSIWYG** | Editor kandungan "What You See Is What You Get". |

---

## 16. Document Control

| Versi | Tarikh | Perubahan | Disediakan Oleh |
|-------|--------|-----------|-----------------|
| 1.0 | 2026-07-25 | Dokumen asal | OpenCode |

---

**End of Product Specification**
