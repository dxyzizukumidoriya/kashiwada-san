// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: ci-info.js

let handler = (m, {
    conn,
    text
}) => {
    if (!text.includes('whatsapp.com')) throw ' *[ ! ]* Mana Link Gc/Ch Nya Buat Cek Id !';
    let link = new URL(text)

    return new Promise(async (revolse) => {
        const time = ms => {
            const date = new Date(ms * 1000); // ubah ke milidetik
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            const jam = `${hours}:${minutes}:${seconds}`
            return jam
        }

        let key
        if (text.includes('https://whatsapp.com')) {
            key = link.pathname.split('/channel/')[1]
            await conn.newsletterMetadata('invite', key).then(async (ch) => {
                let caption = ` ⚡ Metadata Channel
 *π* *Name*: ${ch.name || ''}
 *π* *Subscribe*: ${ch.subscribers || ''}
 *π* *Creator*: ${await time(ch.creation_time) || ''}
 *π* *Viewer*: ${ch.viewer_metadata || ''}
 *π* *Id*: ${ch.id || ''}`
                await conn.sendMessage(m.chat, {
                    image: {
                        url: ch.preview || 'https://mmg.whatsapp.net' + ch.preview || ''
                    },
                    caption
                }, {
                    ephemeralExpiration: 86400,
                    quoted: m
                })
            })
        } else if (text.includes('https://chat.whatsapp.com')) {
            key = link.pathname.split('/')[1]
            await conn.groupGetInviteInfo(key).then(async (gc) => {
                let caption = ` ⚡ Metadata Grup
 *π* *Name*: ${gc.subject || ''}
 *π* *Owner*: ${'@' + gc.owner.split('@')[0] || ''}
 *π* *Creator*: ${await time(gc.creation) || ''}
 *π* *OwnerCountry*: ${gc.ownerCountry || ''}
 *π* *Id*: ${gc.id || ''}`
                await conn.sendMessage(m.chat, {
                    text: caption,
                    mentions: [gc.owner]
                }, {
                    ephemeralExpiration: 86400,
                    quoted: m
                })
            })
        } else {
            m.reply(' *[ ! ]* Maaf Error Bang :v')
        }
    })
}

handler.limit = true;

handler.help = ['ci', 'cekid'];
handler.command = ['ci', 'cekid'];
handler.tags = ['info'];

module.exports = handler
