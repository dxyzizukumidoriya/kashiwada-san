// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: stickerwatermark-sticker.mjs

import {
    Sticker,
    createSticker,
    StickerTypes
} from 'wa-sticker-formatter';
import fs from 'node:fs';

let izuku = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || '';
    if (!/webp/.test(mime)) throw ` *[ ! ]* Reply Sticker Buat Wm ! Contoh: ${usedPrefix + command} hai | aku dxyz`;

    let [wm1, wm2] = text.split(' | ')
    if (!wm1 && !wm2) throw ' *[ ! ]* Mana Wm1 | Wm2 Nya !';

    let media = await q.download();

    const sticker = new Sticker(media, {
        pack: wm1,
        author: wm2,
        type: StickerTypes.FULL,
        quality: 50,
        background: '#000000'
    });

    const buffer = await sticker.toBuffer();
    await sticker.toFile('./tmp/sticker.webp');

    conn.sendMessage(m.chat, await sticker.toMessage(), {
        quoted: m,
        ephemeralExpiration: 86400
    });

    await fs.unlinkSync('./tmp/sticker.webp');
};

izuku.loading = true;

izuku.help = ['wm', 'swm', 'stickerwatermark'];
izuku.command = ['wm', 'swm', 'stickerwatermark'];
izuku.help = ['sticker'];

export default izuku;
