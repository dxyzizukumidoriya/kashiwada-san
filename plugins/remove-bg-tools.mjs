// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: remove-bg-tools.mjs

import axios from 'axios';
import FormData from 'form-data';
import file from 'file-type';

let izuku = async (m, {
    conn
}) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!/jpeg|jpg|png/.test(mime)) throw ' *[ ! ]* Masukan Image/Reply Image Buat Remove !';

    try {
        let media = await q.download();
        const {
            urlview
        } = await uploadToTmpfiles(media);

        const response = await axios({
            method: 'get',
            url: `${config.apikey}/tools/removebg`,
            params: {
                imageUrl: urlview
            }
        }).then(a => a.data);
        await conn.sendMessage(
            m.chat, {
                image: {
                    url: response.result.imageLink
                },
                caption: '☘️ Nih Remove Background Nya !'
            }, {
                quoted: m
            }
        );
    } catch (e) {
        m.reply(' *[ ! ]* Maaf Error Mungkin Lu Kebanyakan Request');
        console.error('Error', e);
    };
};

async function uploadToTmpfiles(buffer) {
    let {
        ext
    } = await file.fromBuffer(buffer);
    let filename = Date.now() + `-tmpFiles.${ext}`;
    const form = new FormData();
    form.append('file', buffer, filename);

    try {
        const response = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
            headers: {
                ...form.getHeaders(),
            },
        });

        let urlmatch = response.data.data.url.split('http://tmpfiles.org/');
        return {
            url: response.data.data.url,
            urlview: 'https://tmpfiles.org/dl/' + urlmatch[1],
        };
    } catch (error) {
        console.error('Error uploading file:', error.message);
        throw error;
    }
}

izuku.help = ['remove-bg', 'removebg', 'removeback'];
izuku.command = ['remove-bg', 'removebg', 'removeback'];
izuku.help = ['tools'];

export default izuku;
