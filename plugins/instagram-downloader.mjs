// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: instagram-downloader.mjs

import fetch from 'node-fetch';

let izuku = async (m, {
    conn,
    args
}) => {
    let link = args[0];
    if (!/www.instagram.com/.test(link)) throw ' *[ ! ]* Maaf Lu Harus Masukan Link Instagram !';
    try {
        const response = await (await fetch(`https://izumi-apis.zone.id/downloader/igdl?url=${link}`)).json();
        const ig = response.result;
        if (ig.metadata.isVideo === true) {
            await conn.sendMessage(
                m.chat, {
                    video: {
                        url: ig.url[0]
                    },
                    caption: ig.metadata.caption
                }, {
                    quoted: m
                });
        } else if (ig.metadata.isVideo === false) {
            if (ig.url.length > 1) {
                await conn.sendAlbumMessage(
                    m.chat,
                    ig.url.map((a) => ({
                        image: {
                            url: a
                        },
                        caption: ig.metadata.caption,
                    })), {
                        quoted: m,
                        delay: 2000
                    });
            } else {
                await conn.sendMessage(
                    m.chat, {
                        image: {
                            url: ig.url[0]
                        },
                        caption: ig.metadata.caption
                    }, {
                        quoted: m
                    });
            };
        } else {
            await m.reply(' *[ ! ]* Gagal Ambil Media Video/Image Nya !');
        };
    } catch (e) {
        m.reply(' *[ ! ]* Eee... Maaf Error Mungkin Lu Kebanyakan Request');
        console.error('Error', e);
    };
};

izuku.help = ['instagram', 'ig', 'instagramdl', 'igdl']
izuku.command = /^(instagram|ig|instagramdl|igdl)$/i;
izuku.help = ['downloader'];

export default izuku;
