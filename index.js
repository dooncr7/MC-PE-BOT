const bedrock = require('bedrock-protocol')

const HOST = "cosmoso.aternos.me"
const PORT = 36190

const BOT_NAMES = ["AFK_Bot1", "AFK_Bot2"]

let bots = []
let playerCache = new Set()

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

    client.on('player_list', (packet) => {
        if (!packet.records) return

        for (const p of packet.records) {
            if (packet.records && p.username) {
                playerCache.add(p.username)
            }
        }

        checkPlayers()
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
    playerCache.clear()
}

function checkPlayers() {
    const realPlayers = [...playerCache].filter(
        name => !BOT_NAMES.includes(name)
    )

    // 👇 يبقوا إذا 0 أو 1 لاعب فقط
    if (realPlayers.length <= 1) {
        return
    }

    disconnectBots()
}

connectBots()
