// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: sticker-sticker.js

module.exports = {
    help: ['s', 'sticker', 'stk', 'stiker'],
    tags: ['sticker'],
    command: ['s', 'sticker', 'stk', 'stiker'],
    limit: true,
    code: async (m, {
        conn,
        usedPrefix,
        command
    }) => {
        const q = m.quoted ? m.quoted : m;
        if (!q) return m.reply(` *[ ! ]* Send/Reply Images/Videos/Gifs With Captions ${usedPrefix + command}\nVideo Duration 1-9 Seconds`)
        const mime = (q.msg || q).mimetype || ''
        if (/image/.test(mime)) {
            const media = await q.download()
            await conn.sendImageAsSticker(m.chat, media, m, {
                packname: config.name,
                author: `By: ${config.ownername}`
            })
        } else if (/video/.test(mime)) {
            if ((q.msg || q).seconds > 11) return
            const media = await q.download()
            await conn.sendVideoAsSticker(m.chat, media, m, {
                packname: config.name,
                author: `By: ${config.ownername}`
            })
        } else {
            m.reply(` *[ ! ]* Send/Reply Images/Videos/Gifs With Captions ${usedPrefix + command}\nVideo Duration 1-9 Seconds`)
        }
    }
}
