// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: play-downloader.mjs

import axios from 'axios';
import fs from 'fs';
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
            const youtubeInfo = `╭───「 🔍 *Search Lagu Play* 」───
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
╰───────────────────────
╭───「 ☘️ *Mau Pilih Type Apa*」───
│ 🎥 Video: 1
│ 🎧 Audio: 2
╰───────────────────────`;

            await conn.sendAliasMessage(
                m.chat, {
                    document: {
                        url: result.url
                    },
                    mimetype: "application/msword",
                    fileName: result.title,
                    fileLength: 10,
                    pageCount: 10,
                    jpegThumbnail: fs.readFileSync('./lib/thumbnail.jpg'),
                    caption: youtubeInfo,
                    ...thumb
                }, [{
                    alias: '1',
                    response: `${usedPrefix}ytmp4 ${result.url}`
                }, {
                    alias: '2',
                    response: `${usedPrefix}ytmp3 ${result.url}`
                }], m)

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
