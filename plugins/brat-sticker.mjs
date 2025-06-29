// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: brat-sticker.mjs

import axios from 'axios';

let izuku = async (m, {
    conn,
    text
}) => {
    if (!text) throw ' *[ ! ]* Masukan Teks Nya !'
    return new Promise(async (revolse, reject) => {
        await axios.get(
            'https://api.nekorinn.my.id/maker/brat-v2', {
                params: {
                    text: text
                },
                responseType: 'arraybuffer'
            }).then(async (response) => {
            await conn.sendImageAsSticker(
                m.chat,
                response.data,
                m, {
                    packname: 'Brat By:',
                    author: config.name
                });
        }).catch((err) => {
            reject({
                msg: ' *[ ! ]* Maaf Mungkin Lu Kebanyakan Request'
            });
            console.error('Error', err)
        })
    })
}

izuku.limit = true;
izuku.loading = true;

izuku.help = ['brat', 'bratgenerator'];
izuku.command = /^(brat|bratgenerator)$/i;
izuku.tags = ['sticker'];

export default izuku;
