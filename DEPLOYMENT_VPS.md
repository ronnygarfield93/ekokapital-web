# Panduan Deployment VPS — PT Ekokapital Sekuritas

Website baru PT Ekokapital Sekuritas dibangun menggunakan **Next.js 15 (App Router) + TypeScript + Tailwind CSS + SQLite bawaan Node 22** tanpa WordPress, tanpa PHP, dan tanpa plugin pihak ketiga yang rentan.

---

## 1. Persyaratan Server VPS (Ubuntu 22.04 / 24.04 LTS)
- **Node.js v22 LTS** (wajib v22.5+ untuk `node:sqlite` bawaan)
- **Nginx** atau **Caddy** sebagai Reverse Proxy + SSL HTTPS (Let's Encrypt)
- **PM2** (`npm i -g pm2`) atau **Docker**

---

## 2. Langkah Deploy dengan PM2 + Nginx

```bash
# 1. Masuk ke folder aplikasi di VPS
cd /var/www/ekokapital

# 2. Salin & atur variabel lingkungan (WAJIB ubah secret & password awal)
cp .env.example .env
nano .env

# 3. Install dependensi & build production
npm ci
npm run build

# 4. Salin static assets ke folder standalone
cp -r .next/static .next/standalone/.next/static
mkdir -p data uploads

# 5. Jalankan dengan PM2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### Contoh Konfigurasi Nginx (`/etc/nginx/sites-available/ekokapital.com`)

```nginx
server {
    listen 80;
    server_name ekokapital.com www.ekokapital.com;
    return 301 https://ekokapital.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ekokapital.com;

    ssl_certificate /etc/letsencrypt/live/ekokapital.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ekokapital.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    server_tokens off;
    client_max_body_size 25M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        # Timpa dengan $remote_addr agar klien tidak dapat memalsukan IP rate-limit
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 3. Daftar Periksa Keamanan Produksi
1. **Login ke `/admin/login`** segera setelah deploy dan **ganti kata sandi default** di tab **Keamanan & Audit Log**.
2. Aktifkan **UFW Firewall** di VPS: hanya buka port `22` (SSH), `80`, dan `443`. Port `3000` hanya di-bind ke `127.0.0.1`.
3. Jadwalkan backup otomatis harian untuk folder `./data/ekokapital.db` dan `./uploads/`.
4. Gunakan `certbot --nginx -d ekokapital.com -d www.ekokapital.com` untuk sertifikat HTTPS gratis otomatis.
