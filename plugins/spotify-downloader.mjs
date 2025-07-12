// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: spotify-downloader.mjs

import axios from 'axios';
let api = 'https://izumi-apis.zone.id';

let handler = async (m, {
    conn,
    usedPrefix,
    command,
    text
}) => {
    await conn.sendMessage(m.chat, {
        react: {
            text: '🔥',
            key: m.key
        }
    })
    if (!text) return m.reply(' *[ ! ]* Maaf Anda Masukan Link/Query ')
    return new Promise(async (revolse) => {
        if (/open\.spotify\.com/.test(text)) {
            if (!/open\.spotify\.com/.test(text)) return m.reply("⚠️ Link bukan dari Spotify!");
            await axios.get(`${api}/downloader/spotifydl?url=${text}`).then(async (a) => {
                const x = a.data.result
                const caption = `
╭───────────────────────────────╮
│  🔥 RIN'S SPOTIFY DOWNLOADER  │
├───────────────────────────────┤
│ 🎵 ${x.title || ''}               
│ 🎤 ${x.artists || ''}          
│ 💿 ${x.album || ''} 
│ 🔗 ${x.external_url || ''} 
├───────────────────────────────┤
│ 🗡️ (•̀ᴗ•́)و ︻デ═一            
│ 📥 Downloading...              
│ 💽 Format: MP3               
╰───────────────────────────────╯
"Not bad... for human music." - Rin Okumura`;
                await conn.sendMessage(m.chat, {
                    text: caption
                }, {
                    quoted: m
                })
                await conn.sendMessage(m.chat, {
                    react: {
                        text: '😆',
                        key: m.key
                    }
                })
                await conn.sendMessage(m.chat, {
                    audio: {
                        url: x.download
                    },
                    mimetype: 'audio/mpeg'
                }, {
                    quoted: m
                })
            }).catch((err) => {
                m.reply(' *[ ! ]* Maaf Error Mungkin Lu Kebanyakan Request');
                console.log('msg:', err);
            });
        } else {
            await axios.get(`${api}/search/spotifysrc?q=${text}`).then(async (a) => {
                const x = a.data.result
                const listMessage = {
                    title: 'Pilih Lagu',
                    sections: [{
                        title: 'Search Spotify',
                        rows: x.map((a, i) => ({
                            title: `[ ${i + 1} ]. ${a.title}`,
                            description: `${a.duration} / ${a.artist}`,
                            id: `${usedPrefix + command} ${a.url}`
                        }))
                    }]
                };

                const messageText = `
╭────────────────────────────╮
│ 🔥 RIN'S SPOTIFY PICKS     │
├────────────────────────────┤
│ Pilih lagu dari hasil acak:
│
${x.map((a, i) => `│ ${i + 1}. ${a.title} - ${a.artist}`).join('\n')}
╰────────────────────────────╯
Balas dengan nomor (1-${x.length}).`;

                await conn.sendMessage(m.chat, {
                    react: {
                        text: '😆',
                        key: m.key
                    }
                })
                await conn.sendMessage(m.chat, {
                    text: messageText,
                    buttons: [{
                        buttonId: 'action',
                        buttonText: {
                            displayText: 'ini pesan interactiveMeta'
                        },
                        type: 4,
                        nativeFlowInfo: {
                            name: "single_select",
                            paramsJson: JSON.stringify(listMessage),
                        },
                    }],
                    headerType: 1,
                    viewOnce: true
                }, {
                    quoted: m
                });
            }).catch((err) => {
                m.reply(' *[ ! ]* Maaf Error Mungkin Lu Kebanyakan Request');
                console.log('msg:', err);
            });
        };
    });
};

handler.help = ['spotify', 'spdl', 'sp'].map(v => v + ' *[ query/link ]* ');
handler.tags = ['downloader'];
handler.command = /^(spotify|spdl|sp)$/i;

export default handler;
