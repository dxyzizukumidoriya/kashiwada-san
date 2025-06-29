// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: groq3-ai.mjs

import fetch from 'node-fetch';
import cloudku from 'cloudku-uploader';

let izuku = async (m, {
    conn,
    text
}) => {
    if (!text) throw ' *[ ! ]* Masukan Kata Kata Yang Mau Di Ucapkan !';
    return new Promise(async (revolse, reject) => {
        try {
            let q = m.quoted ? m.quoted : m;
            let mime = (q.msg || q).mimetype || ''
            let paramsg;
            if (/image/.test(mime)) {
                let media = await q.download();
                const {
                    url
                } = await cloudku.upload30s(media, 'tmp.jpg');
                paramsg = {
                    text: text,
                    imageUrl: url
                };
            } else {
                paramsg = {
                    text: text,
                };
            };
            const api = 'https://api.nekorinn.my.id/ai/grok-3';
            const params = new URLSearchParams(paramsg);
            const response = await (await fetch(`${api}?${params}`)).json();

            await conn.sendMessage(
                m.chat, {
                    text: response.result
                }, {
                    ephemeralExpiration: 86400,
                    quoted: m
                });
        } catch (err) {
            reject({
                msg: ' *[ ! ]* Maaf Error Mungkin Lu Kebanyakan Request'
            });
            console.error('Error', err);
        };
    });
};

izuku.limit = true;

izuku.help = ['grok', 'grok3'];
izuku.command = ['grok', 'grok3'];
izuku.tags = ['ai'];

export default izuku;
