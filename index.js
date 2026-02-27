const bedrock = require('bedrock-protocol')

const SERVER = {
    host: 'cosmoso.aternos.me',
    port: 36190,
    version: '1.26.2'
}

const BOT_NAMES = ['AFK_Bot1', 'AFK_Bot2']
let bots = []
let realPlayers = 0

function startBots() {

    if (bots.length > 0) return

    console.log("Starting bots...")

    BOT_NAMES.forEach(name => {

        const client = bedrock.createClient({
            host: SERVER.host,
            port: SERVER.port,
            username: name,
            offline: true
        })

        client.on('join', () => {
            console.log(name + " joined")
        })

        // 🔥 مراقبة دخول لاعبين حقيقيين
        client.on('player_list', (packet) => {

            if (!packet.records) return

            packet.records.forEach(record => {

                if (!BOT_NAMES.includes(record.username)) {

                    if (packet.records.length > BOT_NAMES.length) {
                        realPlayers = packet.records.length - BOT_NAMES.length
                    }

                }

            })

            if (realPlayers > 0) {
                stopBots()
            }
        })

        client.on('disconnect', () => {
            console.log(name + " disconnected")
        })

        bots.push(client)
    })
}

function stopBots() {

    if (bots.length === 0) return

    console.log("Real player detected. Leaving...")

    bots.forEach(bot => {
        try {
            bot.disconnect()
        } catch {}
    })

    bots = []

    // ⏳ إعادة محاولة بعد 10 ثواني
    setTimeout(() => {
        startBots()
    }, 10000)
}

console.log("Bot system started...")
startBots()
