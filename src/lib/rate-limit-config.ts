export const RATE_LIMITS = {
  // Download dokumen (PDF / attachment): maks 10 kali per 10 menit per IP
  download: {
    maxRequests: 10,
    windowMs: 10 * 60 * 1000,
  },
  // Asset gambar inline (/api/uploads/*.png|jpg|webp): longgar agar tampilan halaman tidak terganggu
  media: {
    maxRequests: 120,
    windowMs: 5 * 60 * 1000,
  },
  // Login admin: maks 3 kali gagal per 5 menit per akun
  adminLoginAccount: {
    maxRequests: 3,
    windowMs: 5 * 60 * 1000,
  },
  // Login admin per IP: maks 6 percobaan per 5 menit per IP
  adminLoginIp: {
    maxRequests: 6,
    windowMs: 5 * 60 * 1000,
  },
  // Ubah password admin: maks 3 kali gagal per 5 menit per akun
  adminPasswordChange: {
    maxRequests: 3,
    windowMs: 5 * 60 * 1000,
  },
  // Permintaan CAPTCHA: maks 10 kali per 5 menit per IP
  captcha: {
    maxRequests: 10,
    windowMs: 5 * 60 * 1000,
  },
  // Form pengaduan / WBS / kontak: maks 6 kali per 10 menit per IP
  submissions: {
    maxRequests: 6,
    windowMs: 10 * 60 * 1000,
  },
} as const;
