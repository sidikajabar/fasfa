# 🚂 Deploy ke Railway - Panduan Lengkap

Panduan step-by-step untuk deploy Telegram Buy Alert Bot ke Railway.app

## 🎯 Kenapa Railway?

✅ Free tier tersedia ($5 credit/bulan)  
✅ Deploy super mudah  
✅ Auto restart jika crash  
✅ Environment variables management  
✅ Logs real-time  
✅ 24/7 uptime  

## 📋 Persiapan

### 1. Akun Railway
- Daftar di [railway.app](https://railway.app)
- Login dengan GitHub (recommended) atau email
- Verifikasi akun

### 2. Siapkan Data Bot

Anda perlu menyiapkan:
- ✅ Telegram Bot Token (dari @BotFather)
- ✅ Telegram Chat ID (group atau personal)
- ✅ Token Address (contract address)
- ✅ Token Name

**Cara dapatkan semua data ini ada di file `SETUP_GUIDE.md`**

## 🚀 Deploy ke Railway

### Method 1: Deploy via GitHub (Recommended)

#### Step 1: Upload ke GitHub

1. **Install Git** (jika belum):
   ```bash
   # Windows: Download dari git-scm.com
   # Mac: 
   brew install git
   # Linux:
   sudo apt install git
   ```

2. **Buat Repository Baru di GitHub**:
   - Login ke [github.com](https://github.com)
   - Klik tombol `+` → `New repository`
   - Nama: `telegram-buy-alert-bot`
   - Set ke **Private** (recommended)
   - Jangan centang "Initialize with README"
   - Klik `Create repository`

3. **Upload Code ke GitHub**:
   ```bash
   # Masuk ke folder project
   cd telegram-buy-alert-bot
   
   # Initialize git
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit"
   
   # Add remote (ganti USERNAME dengan username GitHub Anda)
   git remote add origin https://github.com/USERNAME/telegram-buy-alert-bot.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

#### Step 2: Deploy di Railway

1. **Buka Railway Dashboard**:
   - Login ke [railway.app](https://railway.app)
   - Klik `New Project`

2. **Connect Repository**:
   - Pilih `Deploy from GitHub repo`
   - Pilih repository `telegram-buy-alert-bot`
   - Klik `Deploy Now`

3. **Railway akan otomatis**:
   - Detect Node.js project
   - Install dependencies
   - Build project
   - Start bot

### Method 2: Deploy via Railway CLI

#### Step 1: Install Railway CLI

**Mac/Linux**:
```bash
curl -fsSL https://railway.app/install.sh | sh
```

**Windows (PowerShell)**:
```powershell
iwr https://railway.app/install.ps1 | iex
```

#### Step 2: Login & Deploy

```bash
# Login
railway login

# Masuk ke folder project
cd telegram-buy-alert-bot

# Initialize Railway project
railway init

# Deploy
railway up
```

## ⚙️ Konfigurasi Environment Variables

Setelah deploy, Anda perlu set environment variables:

### Via Railway Dashboard:

1. **Buka Project** di Railway dashboard
2. Klik tab **Variables**
3. Tambahkan variable satu per satu:

```
TELEGRAM_BOT_TOKEN = 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID = -1001234567890
TOKEN_ADDRESS = 0x1234567890abcdef1234567890abcdef12345678
TOKEN_NAME = YOURTOKEN
MIN_BUY_USD = 100
POLL_INTERVAL = 10000
ALERT_IMAGE = https://i.imgur.com/yourimage.gif
SEPARATOR_EMOJI = ⚪️
```

**PENTING:** Jangan gunakan tanda kutip pada values!

### Via Railway CLI:

```bash
railway variables set TELEGRAM_BOT_TOKEN=your_token_here
railway variables set TELEGRAM_CHAT_ID=your_chat_id
railway variables set TOKEN_ADDRESS=0x...
railway variables set TOKEN_NAME=YOURTOKEN
railway variables set MIN_BUY_USD=100
railway variables set POLL_INTERVAL=10000
railway variables set ALERT_IMAGE=https://...
railway variables set SEPARATOR_EMOJI=⚪️
```

## 🔄 Restart Service

Setelah set environment variables, restart service:

**Via Dashboard:**
- Klik tab `Deployments`
- Klik tombol `Restart`

**Via CLI:**
```bash
railway restart
```

## 📊 Monitoring

### View Logs

**Via Dashboard:**
1. Buka project di Railway
2. Klik tab `Deployments`
3. Klik deployment yang aktif
4. Scroll untuk lihat logs real-time

**Via CLI:**
```bash
railway logs
```

### Check Status

**Via Dashboard:**
- Status akan muncul di dashboard (Running/Failed)
- Check resource usage di tab `Metrics`

**Via CLI:**
```bash
railway status
```

## 🎛️ Memilih Versi Bot

Default bot menggunakan `index.js` (versi basic).

### Jika Ingin Pakai Versi Advanced:

1. **Edit `Procfile`**:
   ```
   web: npm run start:advanced
   ```

2. **Atau edit `package.json`** bagian scripts:
   ```json
   "scripts": {
     "start": "node index-advanced.js"
   }
   ```

3. **Tambah Environment Variables** untuk advanced version:
   ```
   RPC_URL = https://mainnet.megaeth.com/rpc
   DEX_PAIR = 0x...
   DEX_ROUTER = 0x...
   ```

4. **Redeploy**:
   ```bash
   git add .
   git commit -m "Switch to advanced version"
   git push
   ```

## 🐛 Troubleshooting

### Bot Tidak Start

**Check Logs:**
```bash
railway logs
```

**Common Issues:**
1. **Missing Environment Variables**
   - Pastikan semua variables sudah di-set
   - Check typo di variable names

2. **Invalid Bot Token**
   - Verify token dengan: `curl https://api.telegram.org/bot<TOKEN>/getMe`
   - Generate token baru jika perlu

3. **Build Failed**
   - Check `package.json` valid
   - Pastikan Node.js version compatible

### Bot Crash Terus

**Check:**
1. TOKEN_ADDRESS benar dan valid
2. TELEGRAM_CHAT_ID format benar (group = `-100...`)
3. Bot sudah ditambahkan ke group
4. Internet/API accessible dari Railway

### Logs Error "Cannot find module"

**Solution:**
```bash
# Pastikan package.json complete
# Redeploy:
git add .
git commit -m "Fix dependencies"
git push
```

## 💰 Railway Pricing

**Free Tier:**
- $5 credit per bulan
- ~500 jam uptime (cukup untuk 24/7 bot simple)
- Jika credit habis, service akan pause

**Hobby Plan ($5/bulan):**
- $5 credit + $5 usage
- Lebih dari cukup untuk bot

**Tips Hemat Credit:**
- Bot simple seperti ini sangat ringan
- Gunakan POLL_INTERVAL yang reasonable (jangan terlalu cepat)
- Monitor usage di dashboard

## 🔧 Update Bot

### Via GitHub:

```bash
# Edit code
# Commit changes
git add .
git commit -m "Update bot features"
git push

# Railway akan auto-deploy
```

### Via CLI:

```bash
# Edit code
# Deploy
railway up
```

## 📱 Commands Berguna

```bash
# View all projects
railway list

# Select project
railway link

# View logs
railway logs --follow

# View variables
railway variables

# Delete variable
railway variables delete VARIABLE_NAME

# Open project in browser
railway open

# Unlink project
railway unlink
```

## 🎉 Selesai!

Bot sekarang running 24/7 di Railway! 🚀

### Verify Bot Berjalan:

1. ✅ Check logs tidak ada error
2. ✅ Status "Running" di dashboard
3. ✅ Test dengan buy transaction
4. ✅ Alert muncul di Telegram

## 📞 Support

Jika ada masalah:
1. Check logs terlebih dahulu
2. Verify semua environment variables
3. Test bot token dan chat ID manual
4. Check Railway status: [status.railway.app](https://status.railway.app)

---

**Happy Deploying! 🚂📈**
