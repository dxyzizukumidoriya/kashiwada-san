// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: Csc-Get.mjs

import axios from 'axios';
import * as cheerio from 'cheerio';

let izumi = async (m, {
    text,
    usedPrefix,
    command
}) => {
    if (!text.includes('codeshare.cloudku.click')) throw `> ⚠️ Anda Masukan Link Csc Nya Contoh\n> ☘️ ${usedPrefix + command} https://codeshare.cloudku.click/view?id=xxxx`
    try {
        const response = await axios.get(text);
        const $ = cheerio.load(response.data);
        const code = $('#code-block').text();
        m.reply(code);
    } catch (error) {
        await m.reply('> ❌Maaf Mungkin Anda Kebanyakan Request')
        await console.log('Error', error)
    }
}

izumi.command = ['csc', 'codesharecloudku'];
izumi.help = ['csc', 'codesharecloudku'];
izumi.tags = ['get'];

export default izumi;
