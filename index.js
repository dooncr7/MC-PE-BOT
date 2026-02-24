const bedrock = require('bedrock-protocol')

const HOST = "cosmoso.aternos.me"
const PORT = 36190

const BOT_NAMES = ["AFK_Bot1", "AFK_Bot2"]

let bots = []

function createBot(username) {
    const client = bedrock.createClient({
        host: HOST,
        port: PORT,
        username: username,
        offline: true
    })

    client.on('join', () => {
        console.log(`✅ ${username} دخل السيرفر`)
    })

    client.on('disconnect', () => {
        console.log(`❌ ${username} خرج`)
    })

    client.on('error', (err) => {
        console.log(`⚠️ خطأ ${username}:`, err.message)
    })

    return client
}

function connectBots() {
    if (bots.length > 0) return
    console.log("🟢 دخول البوتات...")
    bots = BOT_NAMES.map(name => createBot(name))
}

function disconnectBots() {
    if (bots.length === 0) return
    console.log("🔴 يوجد أكثر من لاعب حقيقي، خروج البوتات...")
    bots.forEach(bot => {
        try { bot.disconnect() } catch {}
    })
    bots = []
}

function checkServer() {
    bedrock.ping({ host: HOST, port: PORT })
        .then(res => {
            const totalOnline = res.playersOnline
            const realPlayers = totalOnline - bots.length

            if (realPlayers <= 1) {
                // يبقوا إذا كانوا وحدهم أو مع لاعب واحد
                connectBots()
            } else {
                // إذا 2 لاعبين حقيقيين أو أكثر
                disconnectBots()
            }
        })
        .catch(() => {
            console.log("⚠️ فشل فحص السيرفر")
        })
}

setInterval(checkServer, 5000)
