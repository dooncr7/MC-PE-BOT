const bedrock = require('bedrock-protocol')

const SERVER = {
    host: 'cosmoso.aternos.me',
    port: 36190,
    version: '1.26.2' // لا تضع 1.26.2 إذا لم تكن مدعومة في المكتبة
}

const BOT_NAMES = ['AFK_Bot1', 'AFK_Bot2']
let bots = []
let botsConnected = false

// 🔍 فحص عدد اللاعبين الحقيقيين (نسخة آمنة)
async function checkPlayers() {
    try {
        const ping = await bedrock.ping({
            host: SERVER.host,
            port: SERVER.port
        })

        if (!ping || !ping.players) {
            console.log("Ping returned no player data")
            return
        }

        let online = ping.players.online || 0

        // لا نحتسب البوتات
        if (botsConnected) {
            online -= BOT_NAMES.length
        }

        if (online < 0) online = 0

        console.log("Real players:", online)

        if (online === 0 && !botsConnected) {
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

            // 🔥 فيزيائية + حركة طبيعية
            const physics = setInterval(() => {

                if (!client.entity) return

                const pos = client.entity.position

                client.queue('move_player', {
                    runtime_entity_id: client.entity.runtime_entity_id,
                    position: {
                        x: pos.x + (Math.random() - 0.5) * 0.3,
                        y: pos.y - 0.08, // gravity
                        z: pos.z + (Math.random() - 0.5) * 0.3
                    },
                    pitch: 0,
                    yaw: Math.random() * 360,
                    head_yaw: Math.random() * 360,
                    mode: 0,
                    on_ground: false,
                    ridden_runtime_entity_id: 0,
                    teleport: false
                })

            }, 500)

            client.on('disconnect', () => {
                clearInterval(physics)
            })
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
