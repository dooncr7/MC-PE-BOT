const bedrock = require('bedrock-protocol')

const HOST = "cosmoso.aternos.me" // ايبي السيرفر
const PORT = 36190          // البورت

const BOT_NAMES = ["AFK_Bot1", "AFK_Bot2"]

let bots = []
let reconnectTimeout = null

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
    console.log("🟢 السيرفر فارغ، دخول البوتات...")
    bots = BOT_NAMES.map(name => createBot(name))
}

function disconnectBots() {
    console.log("👤 يوجد لاعب، خروج البوتات...")
    bots.forEach(bot => {
        try { bot.disconnect() } catch {}
    })
    bots = []
}

function checkServer() {
    bedrock.ping({ host: HOST, port: PORT })
        .then(res => {
            const online = res.playersOnline

            if (online === 0 && bots.length === 0) {
                connectBots()
            }

            if (online > 0 && bots.length > 0) {
                disconnectBots()
            }
        })
        .catch(() => {
            console.log("⚠️ فشل فحص السيرفر")
        })
}

setInterval(checkServer, 5000)
