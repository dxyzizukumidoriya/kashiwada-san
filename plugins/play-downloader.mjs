// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: play-downloader.mjs

import axios from 'axios';
import yts from 'yt-search';

let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (!text) return m.reply(` *[ ! ]* Mau Request Lagu Apa ? Contoh: ${usedPrefix + command} in my world rookiez`);
    return new Promise(async (resolve) => {
        await conn.sendMessage(
            m.chat, {
                react: {
                    text: '🔥',
                    key: m.key
                }
            });
        const {
            url: search
        } = await yts(text).then(a => a.all[0]);
        await Scraper.googleYoutube(search).then(async (result) => {
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
                    buttons: [{
                            buttonId: '.ytmp3 ' + result.url,
                            buttonText: {
                                displayText: 'Audio'
                            },
                            type: 1
                        },
                        {
                            buttonId: '.ytmp4 ' + result.url,
                            buttonText: {
                                displayText: 'Video'
                            },
                            type: 1
                        }
                    ],
                    footer: 'Fitur Play By: ' + config.name,
                    ...thumb
                }, {
                    quoted: m
                })

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

handler.help = ['play'];
handler.tags = ['downloader']
handler.command = /^play$/i;

export default handler;
