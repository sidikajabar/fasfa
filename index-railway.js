require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const http = require('http');

// Konfigurasi
const CONFIG = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  TOKEN_ADDRESS: process.env.TOKEN_ADDRESS || '0x...', 
  TOKEN_NAME: process.env.TOKEN_NAME || 'TOKENNAME',
  MIN_BUY_USD: parseFloat(process.env.MIN_BUY_USD || '100'),
  POLL_INTERVAL: parseInt(process.env.POLL_INTERVAL || '10000'),
  ALERT_IMAGE: process.env.ALERT_IMAGE || '',
  SEPARATOR_EMOJI: process.env.SEPARATOR_EMOJI || '⚪️',
  CHAIN_ID: '4326',
  CHAIN_NAME: 'MegaETH',
  BLOCKSCOUT_URL: 'https://megaeth.blockscout.com',
  PORT: process.env.PORT || 3000 // Railway akan set PORT
};

// Initialize bot
const bot = new TelegramBot(CONFIG.TELEGRAM_BOT_TOKEN, { polling: false });

// Store untuk tracking transaksi yang sudah diproses
const processedTxs = new Set();
let botStatus = {
  running: true,
  lastCheck: new Date(),
  totalAlerts: 0,
  errors: 0
};

// Health check server untuk Railway
const server = http.createServer((req, res) => {
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      uptime: process.uptime(),
      botRunning: botStatus.running,
      lastCheck: botStatus.lastCheck,
      totalAlerts: botStatus.totalAlerts,
      errors: botStatus.errors,
      config: {
        tokenName: CONFIG.TOKEN_NAME,
        minBuyUSD: CONFIG.MIN_BUY_USD,
        pollInterval: CONFIG.POLL_INTERVAL
      }
    }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Fungsi untuk mendapatkan data dari DexScreener
async function getDexScreenerData(tokenAddress) {
  try {
    const response = await axios.get(
      `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`,
      { timeout: 10000 }
    );
    
    if (response.data && response.data.pairs && response.data.pairs.length > 0) {
      const pair = response.data.pairs[0];
      return pair;
    }
    return null;
  } catch (error) {
    console.error('Error fetching DexScreener data:', error.message);
    botStatus.errors++;
    return null;
  }
}

// Format angka ke USD
function formatUSD(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

// Format angka besar
function formatNumber(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}

// Generate pesan alert
function generateAlertMessage(buyData) {
  const separator = CONFIG.SEPARATOR_EMOJI.repeat(16);
  
  const message = `
<b>${CONFIG.TOKEN_NAME} Buy!</b>
${separator}
💰 Spent ${formatUSD(buyData.spentUSD)} (${buyData.spentETH.toFixed(6)} ETH)
🪙 Got ${formatNumber(buyData.tokensReceived)} ${CONFIG.TOKEN_NAME}
🎯 Position ${buyData.position >= 0 ? '+' : ''}${buyData.position.toFixed(2)}%
🏷 Price ${formatUSD(buyData.tokenPrice)}
💸 Market Cap ${formatUSD(buyData.marketCap)}

<a href="${buyData.buyerUrl}">Buyer</a> | <a href="${buyData.txUrl}">Tx</a> | <a href="${buyData.dexUrl}">Dexs</a> | <a href="${buyData.buyUrl}">Buy ${CONFIG.TOKEN_NAME}</a>
`.trim();

  return message;
}

// Kirim alert ke Telegram
async function sendAlert(buyData) {
  try {
    const message = generateAlertMessage(buyData);
    
    if (CONFIG.ALERT_IMAGE) {
      await bot.sendPhoto(CONFIG.TELEGRAM_CHAT_ID, CONFIG.ALERT_IMAGE, {
        caption: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      });
    } else {
      await bot.sendMessage(CONFIG.TELEGRAM_CHAT_ID, message, {
        parse_mode: 'HTML',
        disable_web_page_preview: false
      });
    }
    
    botStatus.totalAlerts++;
    console.log(`✅ Alert sent successfully (#${botStatus.totalAlerts})`);
  } catch (error) {
    console.error('Error sending alert:', error.message);
    botStatus.errors++;
  }
}

// Monitor buys
async function monitorBuys() {
  botStatus.lastCheck = new Date();
  console.log(`🔍 Checking buys... (${botStatus.lastCheck.toISOString()})`);
  
  try {
    const pairData = await getDexScreenerData(CONFIG.TOKEN_ADDRESS);
    
    if (!pairData) {
      console.log('⚠️  No pair data found');
      return;
    }
    
    console.log(`📊 ${pairData.baseToken.name} - Price: ${formatUSD(parseFloat(pairData.priceUsd))}`);
    
    // Simulasi buy untuk demo
    // Dalam production, ini akan diganti dengan real transaction monitoring
    const shouldSimulateBuy = Math.random() < 0.1; // 10% chance untuk demo
    
    if (shouldSimulateBuy) {
      const simulatedBuy = {
        spentUSD: 150.00,
        spentETH: 0.050,
        tokensReceived: 1000000,
        position: 500,
        tokenPrice: parseFloat(pairData.priceUsd),
        marketCap: parseFloat(pairData.marketCap),
        buyerUrl: `${CONFIG.BLOCKSCOUT_URL}/address/0x1234...`,
        txUrl: `${CONFIG.BLOCKSCOUT_URL}/tx/0xabcd...`,
        dexUrl: pairData.url,
        buyUrl: pairData.url
      };
      
      if (simulatedBuy.spentUSD >= CONFIG.MIN_BUY_USD) {
        const txId = `${Date.now()}_${simulatedBuy.spentUSD}`;
        
        if (!processedTxs.has(txId)) {
          processedTxs.add(txId);
          console.log(`🚨 New buy detected: ${formatUSD(simulatedBuy.spentUSD)}`);
          await sendAlert(simulatedBuy);
          
          if (processedTxs.size > 1000) {
            const entries = Array.from(processedTxs);
            processedTxs.clear();
            entries.slice(-500).forEach(tx => processedTxs.add(tx));
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in monitorBuys:', error.message);
    botStatus.errors++;
  }
}

// Start monitoring
async function startBot() {
  console.log('🤖 Telegram Buy Alert Bot Started (Railway Edition)');
  console.log('='.repeat(50));
  console.log(`📱 Chat ID: ${CONFIG.TELEGRAM_CHAT_ID}`);
  console.log(`🪙 Token: ${CONFIG.TOKEN_NAME}`);
  console.log(`💵 Min Buy: ${formatUSD(CONFIG.MIN_BUY_USD)}`);
  console.log(`⏱️  Poll Interval: ${CONFIG.POLL_INTERVAL}ms`);
  console.log(`🌐 Health Check: http://localhost:${CONFIG.PORT}/health`);
  console.log('='.repeat(50));
  
  // Start health check server
  server.listen(CONFIG.PORT, () => {
    console.log(`✅ Health check server running on port ${CONFIG.PORT}`);
  });
  
  // Test bot connection
  try {
    const me = await bot.getMe();
    console.log(`✅ Bot connected: @${me.username}`);
  } catch (error) {
    console.error('❌ Failed to connect bot:', error.message);
    botStatus.running = false;
    return;
  }
  
  // Initial check
  await monitorBuys();
  
  // Set interval untuk polling
  setInterval(monitorBuys, CONFIG.POLL_INTERVAL);
  
  console.log('🚀 Monitoring started!');
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  botStatus.errors++;
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  botStatus.running = false;
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n👋 Bot stopped');
  botStatus.running = false;
  server.close(() => {
    process.exit(0);
  });
});

// Start the bot
startBot().catch(error => {
  console.error('Fatal error:', error);
  botStatus.running = false;
  process.exit(1);
});
