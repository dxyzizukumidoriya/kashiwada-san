// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: ytdl-downloader.mjs

import axios from 'axios';
import Jimp from 'jimp'

let izuku = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (command === 'ytmp3' || command === 'yta' || command === 'ytaudio') {
        if (!text.includes('youtu')) throw ' *[ ! ]* Mana Link Nya !'
        return new Promise(async (revolse) => {
            await Scraper.googleYoutube(text).then(async (result) => {
                const thumb = await thumbnail(result.title, config.name, {
                    thumbnailUrl: result.thumbnail
                }, result.url, true);
                const youtubeInfo = `╭───「 🎬 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗜𝗡𝗙𝗢 」───
│
│  📌 *Title*: ${result.title || 'No title'}
│  🆔 *Video ID*: ${result.videoId || 'N/A'}
│  ⏳ *Uploaded*: ${result.metadata.ago || 'Unknown'}
│  👤 *Channel*: ${result.author.channelTitle || 'Unknown'}
│  🔗 *URL*: ${result.url || 'Not available'}
│
│  📊 *Engagement*:
│  👁️ ${result.metadata.view || '0'} views
│  💙 ${result.metadata.like || '0'} likes
│  💬 ${result.metadata.comment || '0'} comments
│
╰───────────────────────`

                const buf = await axios.get('https://files.catbox.moe/bd40za.jpg', {
                    responseType: 'arraybuffer'
                });

                await conn.sendClearTime(
                    m.chat, {
                        document: {
                            url: result.url
                        },
                        mimetype: "application/msword",
                        fileName: result.title,
                        fileLength: 10,
                        pageCount: 10,
                        jpegThumbnail: buf.data,
                        caption: youtubeInfo,
                        ...thumb
                    }, {
                        quoted: m
                    });
                const buffer = await axios.get(result.thumbnail, {
                    responseType: 'arraybuffer'
                });
                const jpegThumbnail = await getThumbnailFromBuffer(buffer.data);
                let buff;
                try {
                    const og = await Scraper.ogmp3.download(result.url, '128', 'audio');
                    buff = await axios.get(og.result.download, {
                        responseType: 'arraybuffer'
                    });
                } catch (e) {
                    try {
                        const savet = await Scraper.savetube(result.url, '128')
                        buff = await axios.get(savet.download, {
                            responseType: 'arraybuffer'
                        });
                    } catch (e) {}
                };
                const audioRes = Buffer.from(buff.data, 'binary')

                if (audioRes.length > 100 * 1024 * 1024) {
                    await conn.sendClearTime(
                        m.chat, {
                            document: audioRes,
                            fileName: result.title + '.mp3',
                            mimetype: 'audio/mpeg',
                            fileLength: audioRes.length,
                            jpegThumbnail: jpegThumbnail,
                            caption: youtubeInfo
                        }, {
                            quoted: m
                        })
                } else {
                    await conn.sendClearTime(
                        m.chat, {
                            audio: audioRes,
                            fileName: result.title + '.mp3',
                            mimetype: 'audio/mpeg'
                        }, {
                            quoted: m
                        })
                }
            }).catch(async (err) => {
                await conn.sendMessage(
                    m.chat, {
                        react: {
                            text: '❌',
                            key: m.key
                        }
                    });
                await m.reply(' *[ ! ]* Maaf Mungkin Lu Kebanyakan Request Kali');
                throw err;
            });
        })
    } else if (command === 'ytmp4' || command === 'ytv' || command === 'ytvideo') {
        if (!text.includes('youtu')) throw ` *[ ! ]* Mana Link Nya !, sama quality nya contoh: ${usedPrefix + command} <link yt> <format>`;
        let [link, kualitas] = text.split(' ');
        let quality = kualitas || '720';
        const video = ['360', '480', '720', '1080'];
        if (!video.includes(quality)) throw ` *[ ! ]* format videonya tersedia: ${format.video.map((a => a)).join(', ')} `;
        return new Promise(async (revolse) => {
            await Scraper.googleYoutube(link).then(async (result) => {
                const thumb = await thumbnail(result.title, config.name, {
                    thumbnailUrl: result.thumbnail
                }, result.url, true);
                const youtubeInfo = `╭───「 🎬 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗜𝗡𝗙𝗢 」───
│
│  📌 *Title*: ${result.title || 'No title'}
│  🆔 *Video ID*: ${result.videoId || 'N/A'}
│  ⏳ *Uploaded*: ${result.metadata.ago || 'Unknown'}
│  👤 *Channel*: ${result.author.channelTitle || 'Unknown'}
│  🔗 *URL*: ${result.url || 'Not available'}
│
│  📊 *Engagement*:
│  👁️ ${result.metadata.view || '0'} views
│  💙 ${result.metadata.like || '0'} likes
│  💬 ${result.metadata.comment || '0'} comments
│
╰───────────────────────`;

                const buf = await axios.get('https://files.catbox.moe/bd40za.jpg', {
                    responseType: 'arraybuffer'
                });

                await conn.sendClearTime(
                    m.chat, {
                        document: {
                            url: result.url
                        },
                        mimetype: "application/msword",
                        fileName: result.title,
                        fileLength: 10,
                        pageCount: 10,
                        jpegThumbnail: buf.data,
                        caption: youtubeInfo,
                        ...thumb
                    }, {
                        quoted: m
                    });
                const buffer = await axios.get(result.thumbnail, {
                    responseType: 'arraybuffer'
                });
                const jpegThumbnail = await getThumbnailFromBuffer(buffer.data);
                let buff;
                try {
                    const og = await Scraper.ogmp3.download(result.url, quality, 'video');
                    buff = await axios.get(og.result.download, {
                        responseType: 'arraybuffer'
                    });
                } catch (e) {
                    try {
                        const savet = await Scraper.savetube(result.url, quality)
                        buff = await axios.get(savet.download, {
                            responseType: 'arraybuffer'
                        });
                    } catch (e) {}
                };
                const videoRes = Buffer.from(buff.data, 'binary')

                if (videoRes.length > 40 * 1024 * 1024) {
                    await conn.sendClearTime(
                        m.chat, {
                            document: videoRes,
                            fileName: result.title + '.mp4',
                            mimetype: 'video/mp4',
                            fileLength: videoRes.length,
                            jpegThumbnail: jpegThumbnail,
                            caption: youtubeInfo
                        }, {
                            quoted: m
                        })
                } else {
                    await conn.sendClearTime(
                        m.chat, {
                            video: videoRes,
                            fileName: result.title + '.mp4',
                            caption: ' *[ √ ]* Done Video Nya :D'
                        }, {
                            quoted: m
                        })
                }
            }).catch(async (err) => {
                await conn.sendMessage(
                    m.chat, {
                        react: {
                            text: '❌',
                            key: m.key
                        }
                    });
                await m.reply(' *[ ! ]* Maaf Mungkin Lu Kebanyakan Request Kali');
                throw err;
            });
        });
    };
};

async function getThumbnailFromBuffer(buffer) {
    const image = await Jimp.read(buffer)
    return await image
        .resize(200, 200) // atau pakai .contain(200, 200) untuk rasio fix
        .quality(60)
        .getBufferAsync(Jimp.MIME_JPEG)
};

izuku.limit = true;

izuku.command = /^(ytmp3|yta|ytaudio|ytmp4|ytv|ytvideo)$/i;
izuku.help = ['ytmp3', 'yta', 'ytaudio', 'ytmp4', 'ytv', 'ytvideo'];
izuku.tags = ['downloader']

export default izuku;
