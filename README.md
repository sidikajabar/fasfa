# Telegram Buy Alert Bot - MegaETH Chain

Bot Telegram sederhana untuk monitoring dan mengirim alert setiap ada transaksi buy pada token tertentu di MegaETH chain menggunakan DexScreener API.

## 🚀 Quick Deploy ke Railway

**Deploy dalam 5 menit!** Baca `QUICK_START.md` atau `RAILWAY_DEPLOY.md`

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/new)

## ⚡ Features

- ✅ Monitor transaksi buy secara otomatis
- ✅ Ambil data real-time dari DexScreener API
- ✅ Minimal buy threshold (configurable)
- ✅ Alert dengan format custom
- ✅ Support gambar/GIF di alert
- ✅ Link langsung ke buyer, transaction, dan DEX
- ✅ Emoji separator yang bisa dikustomisasi

## 📋 Prerequisites

- Node.js 16+ 
- npm atau yarn
- Telegram Bot Token
- Telegram Chat/Group ID

## 🚀 Installation

### 1. Clone atau Download Project

```bash
cd telegram-buy-alert-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Telegram Bot

#### Buat Bot Baru:
1. Chat dengan [@BotFather](https://t.me/botfather) di Telegram
2. Kirim command `/newbot`
3. Ikuti instruksi untuk memberi nama bot
4. Copy **Bot Token** yang diberikan

#### Dapatkan Chat ID:
1. Tambahkan bot ke group chat Anda
2. Kirim pesan di group
3. Buka browser: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Cari `"chat":{"id":-123456789...}` - ini adalah Chat ID Anda

### 4. Konfigurasi Environment

Copy file `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Edit file `.env` dan isi dengan data Anda:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=-1001234567890

# Token Configuration
TOKEN_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
TOKEN_NAME=MYTOKEN

# Alert Settings
MIN_BUY_USD=100
POLL_INTERVAL=10000

# Customization (Optional)
ALERT_IMAGE=https://i.imgur.com/example.gif
SEPARATOR_EMOJI=⚪️
```

## ⚙️ Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `TELEGRAM_BOT_TOKEN` | Token bot dari BotFather | Required |
| `TELEGRAM_CHAT_ID` | ID chat/group untuk alert | Required |
| `TOKEN_ADDRESS` | Contract address token yang dimonitor | Required |
| `TOKEN_NAME` | Nama token | TOKENNAME |
| `MIN_BUY_USD` | Minimal buy dalam USD untuk trigger alert | 100 |
| `POLL_INTERVAL` | Interval polling dalam ms | 10000 (10s) |
| `ALERT_IMAGE` | URL gambar untuk alert (jpg/gif) | Empty |
| `SEPARATOR_EMOJI` | Emoji untuk separator | ⚪️ |

## 🏃 Running the Bot

### Development Mode:
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

## 📱 Format Alert

Alert yang dikirim akan memiliki format seperti ini:

```
TOKENNAME Buy!
⚪️⚪️⚪️⚪️⚪️⚪️⚪️⚪️⚪️⚪️⚪️⚪️⚪️⚪️⚪️⚪️
💰 Spent $150.00 (0.050000 ETH)
🪙 Got 1.00M TOKENNAME
🎯 Position +500.00%
🏷 Price $0.00
💸 Market Cap $150,000.00

Buyer | Tx | Dexs | Buy TOKENNAME
```

## 🔧 MegaETH Chain Info

- **Chain ID**: 4326
- **RPC**: https://mainnet.megaeth.com/rpc
- **Explorer**: https://megaeth.blockscout.com

## 📊 DexScreener API

Bot ini menggunakan DexScreener API untuk mendapatkan data:
- Harga token real-time
- Market cap
- Volume
- Liquidity
- Transaction data

**Endpoint**: `https://api.dexscreener.com/latest/dex/tokens/{tokenAddress}`

## ⚠️ Important Notes

### Limitasi DexScreener API:
- API publik DexScreener **tidak menyediakan real-time transaction feed**
- Bot ini menggunakan **polling** untuk check data secara periodik
- Untuk monitoring real-time yang lebih akurat, pertimbangkan:
  - Menggunakan WebSocket dari DEX
  - Monitoring langsung dari RPC dengan event listening
  - Menggunakan service seperti Moralis, Alchemy, atau QuickNode

### Untuk Production Real-time Monitoring:

Anda perlu menambahkan monitoring langsung menggunakan Web3 dan event listening:

```javascript
const Web3 = require('web3');
const web3 = new Web3('https://mainnet.megaeth.com/rpc');

// Listen to Transfer events
const tokenContract = new web3.eth.Contract(ERC20_ABI, TOKEN_ADDRESS);

tokenContract.events.Transfer({
    filter: {}, 
    fromBlock: 'latest'
})
.on('data', async (event) => {
    // Process buy transaction
    await processBuyTransaction(event);
});
```

## 🐛 Troubleshooting

### Bot tidak mengirim pesan:
- Pastikan bot sudah ditambahkan ke group
- Periksa apakah Chat ID benar (harus dimulai dengan `-` untuk group)
- Pastikan bot memiliki permission untuk kirim pesan

### Error "ETELEGRAM: 400 Bad Request":
- Periksa format HTML di pesan
- Pastikan URL yang digunakan valid

### Tidak ada data dari DexScreener:
- Pastikan token sudah ada di DexScreener
- Periksa alamat contract sudah benar
- Token harus memiliki liquidity pool aktif

## 📝 License

MIT License - Silakan gunakan dan modifikasi sesuai kebutuhan.

## 🤝 Contributing

Pull requests welcome! Untuk perubahan besar, silakan buka issue terlebih dahulu.

## 💡 Tips

1. **Jalankan di VPS** untuk monitoring 24/7
2. **Gunakan PM2** untuk auto-restart:
   ```bash
   npm install -g pm2
   pm2 start index.js --name "buy-alert-bot"
   pm2 save
   pm2 startup
   ```
3. **Monitor logs**:
   ```bash
   pm2 logs buy-alert-bot
   ```
4. **Set MIN_BUY_USD** sesuai kebutuhan untuk filter noise

## 📞 Support

Jika ada pertanyaan atau issue, silakan buat issue di repository ini.

---

**Happy Trading! 🚀**
