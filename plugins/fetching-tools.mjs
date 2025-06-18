// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: fetching-tools.mjs

/** ═══[ 🎵 Fitur Fetching 🎧 ]═══ **
 *  ✍️ Author: [ Dxyz ]
 *  📌 Type: [ Esm ]
 *  🤖 NameBot: [ Rin Okumura ⚡ ]
 *  🔗 Link_Channel: [ https://whatsapp.com/channel/0029Vb6Q4eA1Hsq5qeBu0G1z ]
 **/

import {
    fetch
} from 'undici';
import jsbe from 'js-beautify';
const html = jsbe.html

const handler = async (m, {
    conn,
    text
}) => {
    if (!text.includes('https://')) return m.reply(' *[ ! ]* Maaf Masukan Url Buat Get !');
    new Promise(async (revolse) => {
        await fetch(text).then(async (response) => {
            let mime
            try {
                mime = response.headers.get('content-type').split(';')[0];
            } catch (err) {
                mime = response.headers.get('content-type')
            }

            let body
            if (/html/.test(mime)) {
                body = await response.text();
                const resht = await html(body);
                await conn.sendMessage(m.chat, {
                    document: Buffer.from(resht),
                    mimetype: mime,
                    fileName: 'result.html'
                }, {
                    quoted: m
                });
            } else if (/video/.test(mime)) {
                body = Buffer.from(await response.arrayBuffer());
                await conn.sendMessage(m.chat, {
                    video: body
                }, {
                    quoted: m
                });
            } else if (/image/.test(mime)) {
                body = Buffer.from(await response.arrayBuffer());
                await conn.sendMessage(m.chat, {
                    image: body
                }, {
                    quoted: m
                });
            } else if (/audio/.test(mime)) {
                body = Buffer.from(await response.arrayBuffer());
                await conn.sendMessage(m.chat, {
                    audio: body,
                    mimetype: mime
                }, {
                    quoted: m
                });
            } else {
                body = await response.json();
                await conn.sendMessage(m.chat, {
                    text: JSON.stringify(body)
                }, {
                    quoted: m
                });
            };
        }).catch(async (e) => {
            await m.reply(' *[ ! ]* Maaf Gagal Di Get Url Nya !');
            await console.log('Error', e);
        });
    });
};

handler.help = ['get', 'fetch', 'fetching'].map(v => v + ' *[ Buat Fetching Link ]* ');
handler.tags = ['tools'];
handler.command = /^(get|fetch|fetching)$/i;
handler.limit = true;

export default handler;
