// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: tourl-uploader.mjs

import axios from 'axios';
import FormData from 'form-data';
import file from 'file-type';
import up from 'cloudku-uploader';
import fs from 'fs';
import path from 'path';

let izuku = async (m, {
    conn
}) => {
    return new Promise(async (revolse) => {
        const quoted = m.quoted ? m.quoted : m;
        let mime = (quoted.msg || quoted).mimetype
        if (!/video|image|audio|application/.test(mime)) throw ' *[ ! ]* Kirimkan Media/Reply Media !';
        try {
            const buffer = await quoted.download();

            const {
                ext
            } = await file.fromBuffer(buffer);
            const filename = path.join(process.cwd() + `/tmp/${Date.now() + '-catbox-uploader' + '.' + ext}`);

            await fs.writeFileSync(filename, buffer);
            const catbx = await catbox(buffer, filename);
            const cdup = await up.uploadPermanent(buffer, filename);
            let caption = `> 📂 -[ Uploader File ]-\n> 🗄️ *Size: ${cdup.data.size || ''}*\n> 🐱 *CatBox: ${catbx || ''}*\n> ☁️ *Cloudkuimage: ${cdup.data.url || ''}*`
            await fs.unlinkSync(filename)
            await conn.sendMessage(
                m.chat, {
                    text: caption
                }, {
                    quoted: m
                })
        } catch (e) {
            m.reply(' *[ ! ]* Maaf Mungkin Lu Kebanyakan Request')
            console.log('Error', e)
        }
    })
}

async function catbox(buffer, filename) {
    return new Promise(async (resolve, reject) => {
        try {
            const data = new FormData();
            data.append('reqtype', 'fileupload');
            data.append('userhash', '');
            data.append('fileToUpload', buffer, {
                filename
            });

            const config = {
                method: 'POST',
                url: 'https://catbox.moe/user/api.php',
                headers: {
                    ...data.getHeaders(),
                    'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0'
                },
                data
            };

            const api = await axios.request(config);
            resolve(api.data);
        } catch (err) {
            reject({
                msg: 'Maaf Gagal Di Convert Ke Url'
            });
            console.error('Error', err);
        };
    });
};

izuku.help = ['tourl', 'touploader', 'uploader'];
izuku.tags = ['uploader'];
izuku.command = ['tourl', 'touploader', 'uploader'];
izuku.loading = true;
izuku.limit = true;

export default izuku;
