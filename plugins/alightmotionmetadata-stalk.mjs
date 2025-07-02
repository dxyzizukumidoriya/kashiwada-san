// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: alightmotionmetadata-stalk.mjs

/**
    @ ✨ Scrape Alight Motion Preset Data
    @ Base: https://play.google.com/store/apps/details?id=com.alightcreative.motion
**/

import axios from 'axios';

let izuku = async (m, {
    conn,
    text
}) => {
    if (!text.includes('alight')) throw ' *[ ! ]* Mana Link Nya !';
    try {
        const response = await amdata(text);
        let caption = ` 🔥 [ Metadata Alight Motion ] 🩵
 *π* Title: ${response.info.projects.map((a => a.title)).join(', ') || '' }
 *π* Size: ${response.info.projects.map((a => a.size)).join(', ') || ''}
 *π* Downloads: ${response.info.downloads || ''}
 *π* Download: ${response.download || ''}
 *π* Versi Am: ${response.info.amPackageVersion || ''}`;

        const image = await axios.get(response.info.largeThumbUrl, {
            responseType: 'arraybuffer'
        });
        conn.reply(m.chat, image.data, m, {
            caption
        });
    } catch (e) {
        m.reply(' *[ ! ]* Maaf Error Mungkin Lu Kebanyakan Request');
        console.error('Error', e);
    };
};

async function amdata(url) {
    try {
        const match = url.match(/\/u\/([^\/]+)\/p\/([^\/\?#]+)/);
        if (!match) throw new Error('Invalid url');
        const {
            data
        } = await axios.post('https://us-central1-alight-creative.cloudfunctions.net/getProjectMetadata', {
            data: {
                uid: match[1],
                pid: match[2],
                platform: 'android',
                appBuild: 1002592,
                acctTestMode: 'normal'
            }
        }, {
            headers: {
                'content-type': 'application/json; charset=utf-8'
            }
        });

        return data.result;
    } catch (error) {
        throw new Error(error.message);
    }
};

izuku.limit = true;

izuku.help = ['am-metadata', 'alightmotion-metadata'];
izuku.command = ['am-metadata', 'alightmotion-metadata'];
izuku.help = ['stalk'];

export default izuku;
