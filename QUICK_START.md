# ⚡ Quick Start - Deploy ke Railway dalam 5 Menit

## 🎯 Yang Anda Butuhkan

1. ✅ Akun Railway ([daftar gratis](https://railway.app))
2. ✅ Akun GitHub (untuk deploy)
3. ✅ Telegram Bot Token (dari @BotFather)
4. ✅ Telegram Chat ID (dari group Anda)
5. ✅ Token Contract Address (yang mau dimonitor)

---

## 🚀 3 Langkah Deploy

### 1️⃣ Upload ke GitHub (5 menit)

```bash
# Download project, lalu:
cd telegram-buy-alert-bot

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Buat repo baru di GitHub, lalu:
git remote add origin https://github.com/YOUR_USERNAME/telegram-buy-alert-bot.git
git push -u origin main
```

### 2️⃣ Deploy ke Railway (1 klik)

1. Login ke [railway.app](https://railway.app)
2. Klik `New Project` → `Deploy from GitHub repo`
3. Pilih repo `telegram-buy-alert-bot`
4. Klik `Deploy Now`

### 3️⃣ Set Environment Variables (2 menit)

Di Railway dashboard, tab **Variables**, tambahkan:

```
TELEGRAM_BOT_TOKEN = 123456:ABCdef... (dari @BotFather)
TELEGRAM_CHAT_ID = -100123456789 (ID group Anda)
TOKEN_ADDRESS = 0x... (contract address token)
TOKEN_NAME = YOURTOKEN
MIN_BUY_USD = 100
```

**Klik `Restart`** dan bot langsung jalan! ✅

---

## 📱 Cara Dapatkan Bot Token & Chat ID

### Bot Token:
1. Chat @BotFather di Telegram
2. Kirim `/newbot`
3. Ikuti instruksi
4. Copy token yang diberikan

### Chat ID:
1. Tambahkan bot ke group
2. Kirim pesan di group
3. Buka: `https://api.telegram.org/bot<TOKEN>/getUpdates`
4. Cari `"chat":{"id":-100...}`

---

## ✅ Verifikasi

1. Check logs di Railway (tab Deployments)
2. Harus ada: `✅ Bot connected`
3. Status: `Running`

**Bot sekarang monitoring 24/7!** 🎉

---

## 🆘 Troubleshooting

**Bot tidak jalan?**
- Pastikan semua environment variables sudah benar
- Check logs untuk error
- Pastikan bot sudah ditambahkan ke group

**Error Build di Railway (nixpacks error)?**
- Hapus file `nixpacks.toml` dari repo
- Push ulang: `git add . && git commit -m "fix" && git push`
- Railway akan auto-detect dengan benar
- Atau gunakan Dockerfile (rename `railway-dockerfile.json` → `railway.json`)

**Tidak ada alert?**
- Pastikan TOKEN_ADDRESS benar
- Check apakah ada buy transaction > MIN_BUY_USD
- Coba turunkan MIN_BUY_USD untuk testing

**Detail troubleshooting:** Baca `RAILWAY_FIX.md`

---

## 📖 Dokumentasi Lengkap

- `RAILWAY_DEPLOY.md` - Panduan detail Railway
- `SETUP_GUIDE.md` - Panduan setup lengkap
- `README.md` - Dokumentasi teknis

---

**Need help?** Baca file `RAILWAY_DEPLOY.md` untuk panduan lengkap!
