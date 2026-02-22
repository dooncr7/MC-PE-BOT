const bedrock = require('bedrock-protocol')

const bot = bedrock.createClient({
    host: '191.96.231.12',
    port: 31654,
    username: 'IdleBot_' + Math.floor(Math.random() * 9999),
    offline: true,
    version: '1.26.0'
})

console.log("🔄 تشغيل البوت...")

bot.on('join', () => {
    console.log("✅ البوت دخل السيرفر وبقي واقف بدون أي حركة.")
})

bot.on('disconnect', (reason) => {
    console.log("❌ تم فصله:", reason)
})

bot.on('error', (err) => {
    console.log("⚠️ خطأ:", err.message)
})
