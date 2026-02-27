const bedrock = require('bedrock-protocol')

const SERVER = {
    host: 'cosmoso.aternos.me',
    port: 36190,
    version: '1.26.2'
}

const BOT_NAMES = ['AFK_Bot1', 'AFK_Bot2']
let bots = []
let botsConnected = false

// 🔍 فحص عدد اللاعبين الحقيقيين
async function checkPlayers() {
    try {
        const ping = await bedrock.ping({
            host: SERVER.host,
            port: SERVER.port
        })

        let online = ping.players.online

        // ننقص 2 إذا كانت البوتات متصلة
        if (botsConnected) {
            online -= BOT_NAMES.length
        }

        console.log("Real players:", online)

        if (online <= 0 && !botsConnected) {
            startBots()
        }

        if (online > 0 && botsConnected) {
            stopBots()
        }

    } catch (err) {
        console.log("Ping error:", err.message)
    }
}

// 🚀 تشغيل البوتات
function startBots() {
    console.log("Starting bots...")
    botsConnected = true

    BOT_NAMES.forEach(name => {
        const client = bedrock.createClient({
            host: SERVER.host,
            port: SERVER.port,
            username: name,
            offline: true
        })

        client.on('join', () => {
            console.log(name + " joined server")
        })

        client.on('disconnect', () => {
            console.log(name + " disconnected")
        })

        bots.push(client)
    })
}

// ❌ إيقاف البوتات
function stopBots() {
    console.log("Stopping bots...")
    botsConnected = false

    bots.forEach(bot => {
        try {
            bot.disconnect()
        } catch {}
    })

    bots = []
}

// ⏱ فحص كل 5 ثواني
setInterval(checkPlayers, 5000)

console.log("Bot system started...")
