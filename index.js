const bedrock = require('bedrock-protocol')

const bot = bedrock.createClient({
    host: '191.96.231.12',
    port: 31654,
    username: 'SeniorzzBot',
    offline: true,
    version: '1.26.0' // أحدث إصدار مستقر مدعوم
})

console.log("🔄 تشغيل البوت...")

bot.on('join', () => {
    console.log("✅ دخل السيرفر!")

    // بعد 2 ثواني ينحني
    setTimeout(() => {
        console.log("⬇️ ينحني...")
        bot.queue('player_action', {
            action: 'start_sneaking',
            runtime_entity_id: bot.entityId
        })
    }, 2000)

    // بعد 4 ثواني يقف
    setTimeout(() => {
        console.log("⬆️ وقف")
        bot.queue('player_action', {
            action: 'stop_sneaking',
            runtime_entity_id: bot.entityId
        })
    }, 4000)
})

bot.on('disconnect', (reason) => {
    console.log("❌ تم فصله:", reason)
})

bot.on('error', (err) => {
    console.log("⚠️ خطأ:", err.message)
})
