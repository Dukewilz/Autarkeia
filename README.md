# Autarkeia — Interactive Gesture Observatory

Sebuah aplikasi web interaktif (*interactive digital matter & gesture observatory*) yang awalnya dibangun via OpenAI Codex / Canvas, dan kini sudah dikonfigurasi penuh agar dapat diakses secara publik dengan performa maksimal, bebas error 404 pada GitHub Pages, serta siap dihubungkan ke domain kustom non-ChatGPT.

---

## 🚀 Mengapa Terjadi Error 404 di GitHub Pages Sebelumnya?

Ada 2 penyebab utama error 404 pada repositori asal:
1. **Lokasi Berkas Web (`dist/`)**: File `index.html` dan aset berada di dalam direktori `dist/`, sedangkan GitHub Pages secara bawaan mencari `index.html` di akar repositori (`/`).
2. **Jekyll Processing & Routing**: GitHub Pages secara default menjalankan parser Jekyll yang dapat menyembunyikan berkas tertentu dan merespon dengan 404 ketika sub-path diakses tanpa adanya berkas `.nojekyll` dan `404.html`.

---

## 🛠 Solusi yang Telah Diterapkan

1. **GitHub Actions Workflow Otomatis** (`.github/workflows/deploy.yml`):
   - Menggunakan action resmi GitHub Pages (`actions/deploy-pages@v4`).
   - Setiap kali melakukan `git push`, situs otomatis di-deploy tanpa perlu build manual.
2. **Dukungan Dual-Deployment (Root & Dist)**:
   - Berkas web tersedia baik di root (`/`) maupun di dalam `dist/`.
   - Baik Anda memilih metode **GitHub Actions** maupun **Deploy from a branch (`master` / `/ (root)`)**, halaman **dijamin tidak akan pernah error 404**.
3. **Pencegah Error Jekyll (`.nojekyll`)**:
   - Memastikan semua file aset, model machine learning (`models/`), dan web worker (`hand-worker.js`) dimuat utuh.
4. **Halaman Graceful 404 (`404.html`)**:
   - Menangani redirect otomatis jika pengunjung mengakses rute atau link yang salah.
5. **Konfigurasi Multi-Platform Non-ChatGPT**:
   - `vercel.json` untuk deploy langsung di [Vercel](https://vercel.com).
   - `netlify.toml` untuk deploy langsung di [Netlify](https://netlify.com).

---

## 🌐 Cara Mengaktifkan GitHub Pages (Gratis & Publik)

Repository ini terhubung ke: `https://github.com/Dukewilz/web`

### Opsi 1: Menggunakan GitHub Actions (Sangat Disarankan ⭐)
1. Buka repositori Anda di GitHub: [https://github.com/Dukewilz/web](https://github.com/Dukewilz/web)
2. Klik tab **Settings** (Pengaturan).
3. Pada menu sebelah kiri, klik **Pages**.
4. Di bagian **Build and deployment** > **Source**, ubah dari *"Deploy from a branch"* menjadi **"GitHub Actions"**.
5. GitHub Actions akan otomatis menjalankan alur deploy dari berkas `.github/workflows/deploy.yml`.
6. Web Anda akan langsung aktif di:
   ```
   https://dukewilz.github.io/web/
   ```

### Opsi 2: Menggunakan Deploy from a branch
1. Buka tab **Settings** > **Pages**.
2. Pada **Source**, pilih **Deploy from a branch**.
3. Pilih Branch: `master`, dan Folder: `/ (root)`.
4. Klik **Save**. Dalam 1-2 menit web akan aktif di `https://dukewilz.github.io/web/`.

---

## 🏷️ Menggunakan Domain Pribadi / Non-ChatGPT (Opsional)

Jika Anda ingin menggunakan domain Anda sendiri (misal: `autarkeia.com` atau `web.namadomain.com`):

### Cara 1: Custom Domain di GitHub Pages
1. Masuk ke **Settings** > **Pages** di repository GitHub Anda.
2. Pada bagian **Custom domain**, masukkan nama domain Anda (misal: `web.domainanda.com`).
3. Centang opsi **Enforce HTTPS**.
4. Buka dashboard DNS registrar domain Anda (Cloudflare, Niagahoster, Namecheap, dll.):
   - Jika menggunakan **Subdomain** (misal `web.domainanda.com`):
     - Tambahkan DNS Record tipe **CNAME**:
       - Name / Host: `web`
       - Target / Value: `dukewilz.github.io`
   - Jika menggunakan **Apex Domain** (misal `domainanda.com`):
     - Tambahkan DNS Record tipe **A** yang mengarah ke IP GitHub Pages:
       - `185.199.108.153`
       - `185.199.109.153`
       - `185.199.110.153`
       - `185.199.111.153`

### Cara 2: Deploy di Vercel (Alternatif Cepat & Gratis)
1. Buka [Vercel](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik **Add New...** > **Project** dan pilih repositori `Dukewilz/web`.
3. Klik **Deploy** (konfigurasi sudah otomatis terdeteksi via `vercel.json`).
4. Anda akan langsung mendapatkan domain publik gratis berakhiran `*.vercel.app` dan bisa menghubungkan domain kustom sendiri tanpa batasan.

### Cara 3: Deploy di Netlify
1. Buka [Netlify](https://netlify.com) dan impor repositori `Dukewilz/web`.
2. Netlify akan otomatis membaca `netlify.toml` dan mempublikasikannya.

---

## 💻 Menjalankan Secara Lokal

Untuk menguji web di komputer lokal:
```bash
# Menggunakan Python:
python3 -m http.server 8000

# Atau menggunakan Node / npx:
npx serve .
```
Lalu buka browser di `http://localhost:8000`.
