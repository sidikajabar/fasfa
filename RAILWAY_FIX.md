# 🔧 Railway Deployment Fix

Jika Anda mengalami error saat deploy di Railway, berikut solusinya:

## ❌ Error yang Mungkin Terjadi

### Error 1: `undefined variable 'npm'`

```
error: undefined variable 'npm'
at /app/.nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix:19:19
```

**Penyebab:** Nixpacks configuration issue dengan npm package.

### Error 2: `npm ci can only install with existing package-lock.json`

```
npm error The `npm ci` command can only install with an existing package-lock.json
```

**Penyebab:** File `package-lock.json` tidak ada di repository.

**SOLUSI:** File `package-lock.json` sudah disediakan. Pastikan file ini ada saat push ke GitHub!

## ✅ Solusi

### Solusi 1: Hapus nixpacks.toml (RECOMMENDED)

Railway akan auto-detect Node.js project dengan benar tanpa file ini.

**Langkah:**
1. Hapus file `nixpacks.toml` dari repository
2. Pastikan hanya ada:
   - `package.json` ✓
   - `railway.json` ✓
   - `Procfile` ✓
3. Push ulang ke GitHub
4. Railway akan auto-detect dan build dengan benar

### Solusi 2: Gunakan railway.json Only

Cukup pakai `railway.json` dengan config minimal:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node index-railway.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Solusi 3: Set Start Command Manual di Railway

1. Buka project di Railway dashboard
2. Klik tab **Settings**
3. Scroll ke **Deploy**
4. Di **Custom Start Command**, isi:
   ```
   node index-railway.js
   ```
5. Save dan redeploy

### Solusi 4: Gunakan Dockerfile (Alternatif)

Jika semua solusi di atas tidak work, gunakan Dockerfile:

**Buat file `Dockerfile`:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --production

COPY . .

EXPOSE 3000

CMD ["node", "index-railway.js"]
```

**Update `railway.json`:**

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## 🎯 Rekomendasi Deploy

**Cara Paling Simple (99% Berhasil):**

1. **Hapus** file `nixpacks.toml` dari repository
2. **Pastikan** file berikut ada:
   ```
   package.json
   railway.json
   index-railway.js
   .env.example
   ```
3. **Push** ke GitHub
4. Di Railway: **New Project** → **Deploy from GitHub**
5. **Set Environment Variables**
6. **Deploy!**

Railway akan auto-detect sebagai Node.js project dan build dengan benar.

## 🔍 Verify Build

Setelah deploy, check logs di Railway:

✅ **Good Signs:**
```
Installing dependencies...
npm install
added 50 packages
Starting bot...
✅ Bot connected
✅ Health check server running on port 3000
```

❌ **Bad Signs:**
```
error: undefined variable
ERROR: failed to build
```

## 🆘 Masih Error?

### Quick Fix Steps:

1. **Delete** file `nixpacks.toml` dan `nixpacks-alt.toml`
2. **Commit & push**:
   ```bash
   git add .
   git commit -m "Remove nixpacks config"
   git push
   ```
3. Di Railway, klik **Redeploy**

### Alternative: Deploy via Railway CLI

```bash
# Install Railway CLI
curl -fsSL https://railway.app/install.sh | sh

# Login
railway login

# Link project (jika sudah ada) atau init baru
railway link  # atau: railway init

# Deploy tanpa config files
railway up

# Set variables
railway variables set TELEGRAM_BOT_TOKEN=your_token
railway variables set TELEGRAM_CHAT_ID=your_chat_id
railway variables set TOKEN_ADDRESS=0x...
railway variables set TOKEN_NAME=YOURTOKEN
railway variables set MIN_BUY_USD=100
```

## 📝 Checklist Final

Sebelum deploy, pastikan file-file ini ada:

- [ ] `package.json` ✓
- [ ] `package-lock.json` ✓ (PENTING!)
- [ ] `index-railway.js` ✓
- [ ] `railway.json` ✓
- [ ] **TIDAK** ada `nixpacks.toml` (hapus!)
- [ ] Environment variables siap
- [ ] Bot token dan chat ID valid

## 🎉 Setelah Deploy Berhasil

Railway dashboard akan show:
- ✅ Status: **Running**
- ✅ Logs: `Bot connected`, `Health check server running`
- ✅ Health endpoint: `https://your-app.railway.app/health`

Test dengan buka URL health endpoint, harus return JSON:
```json
{
  "status": "ok",
  "uptime": 123.45,
  "botRunning": true,
  ...
}
```

---

**Masih ada masalah? Share error message-nya untuk troubleshooting lebih lanjut!**
