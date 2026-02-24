const bedrock = require('bedrock-protocol')

const HOST = "cosmoso.aternos.me" // ضع ايبي سيرفرك
const PORT = 36190           // ضع البورت
const USERNAME = "AFK_Bot"   // اسم البوت

let client = null
let reconnectTimeout = null
let checkingPlayers = false

function connectBot() {
    console.log("🔄 محاولة دخول البوت...")

    client = bedrock.createClient({
        host: HOST,
        port: PORT,
        username: USERNAME,
        offline: true
    })

    client.on('join', () => {
        console.log("✅ البوت دخل السيرفر")
        checkingPlayers = true
    })

    client.on('player_list', (packet) => {
        if (!checkingPlayers) return

        const players = packet.records || []
        const realPlayers = players.filter(p => p.username !== USERNAME)

        if (realPlayers.length > 0) {
            console.log("👤 يوجد لاعب داخل السيرفر، خروج البوت...")
            checkingPlayers = false
            client.disconnect()
        }
    })

    client.on('disconnect', () => {
        console.log("❌ البوت خرج من السيرفر")
        scheduleReconnect()
    })

    client.on('error', (err) => {
        console.log("⚠️ خطأ:", err.message)
    })
}

function scheduleReconnect() {
    if (reconnectTimeout) return
    reconnectTimeout = setTimeout(() => {
        reconnectTimeout = null
        checkServerEmpty()
    }, 5000)
}

function checkServerEmpty() {
    const ping = bedrock.ping({ host: HOST, port: PORT })

    ping.then(res => {
        const online = res.playersOnline

        if (online === 0) {
            console.log("🟢 السيرفر فارغ، دخول البوت...")
            connectBot()
        } else {
            console.log("🔴 يوجد لاعبين (" + online + ") ، انتظار...")
            scheduleReconnect()
        }
    }).catch(() => {
        console.log("⚠️ فشل فحص السيرفر")
        scheduleReconnect()
    })
}

checkServerEmpty()
