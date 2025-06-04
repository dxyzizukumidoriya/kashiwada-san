// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: tools-ocr.mjs

import axios from 'axios'

let rin = async (m) => {
    const q = m.quoted ? m.quoted : m;
    if (!/image/.test(q.mimetype || q.msg.mimetype)) return m.reply(' *[ ! ]* Maaf Anda Kirim Foto/Reply Foto Buat Ocr')
    return new Promise(async (resolve, reject) => {
        const media = await q.download();

        const {
            result: url
        } = await (await import('cloudku-uploader')).default(media)
        await axios.get(`https://api.diioffc.web.id/api/tools/ocr?url=${url.url}`).then(async (ocr) => {

            m.reply(ocr.data.result.message)
        }).catch((err) => {
            m.reply(' *[ ! ]* Maaf Anda Telah Kebanyakan Request')
        })
    })
}

rin.help = ['ocr', 'copy-image-to-teks'].map(v => v + ' *[ kirim foto buat di jadikan teks ]* ');
rin.tags = ['tools'];
rin.command = ['ocr', 'copy-image-to-teks'];
rin.limit = true;

export default rin;
