// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: animelovers-anime.mjs

import axios from 'axios';

let izuku = async (m, {
    conn,
    text,
    command
}) => {
    switch (command) {
        case 'animeloversrc': {
            if (!text) throw ' *[ ! ]* Masukan Judul Nya !';
            try {
                await axios.get(`https://izumi-apis.zone.id/anime/AnimeLoversV3-Search?q=${text}`).then(async (a) => {
                    if (!a.data.result.result.length > 0) return m.reply(' *[ ! ]* Maaf Gada Result !');
                    let caption = ` *π* Jumlah Anime: ${a.data.result.result.length}\n\n`;
                    caption += a.data.result.result.map((a, i) => `*[ ${i + 1} ]*\n -> Judul: ${a.judul || ''}\n -> Url: ${a.url || ''}\n -> Lastch: ${a.lastch || ''}`).join("\n\n");
                    await conn.sendAliasMessage(
                        m.chat, {
                            text: caption
                        },
                        a.data.result.result.map((a, i) => ({
                            alias: `${i + 1}`,
                            response: `.animeloversdtl ${a.url}`
                        })),
                        m
                    );
                })
            } catch (e) {
                m.reply(' *[ ! ]* Maaf Error Mungkin Lu Kebanyakan Request');
                console.error('Error', e);
            };
        };
        break;

        case 'animeloversdtl': {
            if (!text) throw ' *[ ! ]* Masukan Url Nya !';

            try {
                await axios.get(`https://izumi-apis.zone.id/anime/AnimeLoversV3-Detail?url=${text}`).then(async (a) => {
                    if (!a.data.result) return m.reply(' *[ ! ]* Maaf Gada Result !');
                    let caption = ` *π* Detail AnimeLoversV3
 -> Judul: ${a.data.result.judul || ''}
 -> Status: ${a.data.result.status || ''}
 -> Publish: ${a.data.result.published || ''}
 -> Sinopsis: ${a.data.result.sinopsis || ''}
 -> Publish: ${a.data.result.genre.map((a) => a).join(', ') || ''}

${a.data.result.chapter.map((a, i) => ` -> Episode: ${a.ch || ''}\n╰┈┈┈┈${a.url || ''}`).join("\n\n") || ''}`;
                    await conn.sendAliasMessage(
                        m.chat, {
                            image: {
                                url: a.data.result.cover
                            },
                            caption: caption
                        },
                        a.data.result.chapter.map((a, i) => ({
                            alias: `${i + 1}`,
                            response: `.animeloversep ${a.url}`
                        })),
                        m
                    );
                });
            } catch (e) {
                m.reply(' *[ ! ]* Maaf Error Mungkin Lu Kebanyakan Request');
                console.error('Error', e);
            };
        };
        break

        case 'animeloversep': {
            if (!text) throw ' *[ ! ]* Masukan Url Nya !';

            try {
                await axios.get(`https://izumi-apis.zone.id/anime/AnimeLoversV3-Episode?url=${text}&quality=360p`).then(async (a) => {
                    const dl = (a.data.result.stream[1] || a.data.result.stream[0]).link;
                    const watch = await axios.get(dl, {
                        responseType: 'arraybuffer'
                    }).then(a => a.data);
                    if (watch.length > 100 * 1024 * 1024) {
                        await conn.sendMessage(m.chat, {
                            document: watch,
                            mimetype: 'video/mp4',
                            fileName: `${Date.now() + '-AnimeLoversV3Doc' + '.mp4'}`,
                            caption: 'Kalo Size Nya Dah 100mb Mending Pake Doc'
                        }, {
                            quoted: m
                        });
                    } else {
                        await conn.sendMessage(m.chat, {
                            video: watch,
                            mimetype: 'video/mp4',
                            fileName: `${Date.now() + '-AnimeLoversV3Doc' + '.mp4'}`,
                            caption: ' *[ √ ]* Done Video Anime Nya'
                        }, {
                            quoted: m
                        });
                    };
                });
            } catch (e) {
                m.reply(' *[ ! ]* Maaf Error Mungkin Lu Kebanyakan Request');
                console.error('Error', e);
            };
        };
        break;
    };
};

izuku.help = ['animeloversrc', 'animeloversdtl', 'animeloversep']
izuku.command = ['animeloversrc', 'animeloversdtl', 'animeloversep']
izuku.tags = ['anime']

export default izuku;
