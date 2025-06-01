const axios = require('axios')
const apiKey = 'AIzaSyALZVNFzWJVmcBJxRHMbiKvExzzS_DV694';

let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (!text.includes('youtu')) return m.reply(` *[ ! ]* Link YouTube + Quality Mana ? Contoh: ${usedPrefix + command} https://youtu.be/xxxx 720`);
    const [url, quality] = text.split(' ');
    const resolution = quality || '720'
    return new Promise(async (resolve) => {
        await conn.sendMessage(
            m.chat, {
                react: {
                    text: '🔥',
                    key: m.key
                }
            });

        const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/;
        let link;
        if (regex.test(url)) {
            const videoId = url.match(regex)[1];
            link = 'https://www.youtube.com/watch?v=' + videoId;
        } else {
            link = url;
        };

        await api('https://cloudkutube.eu/api/ytv', {
            url: link,
            resolution: resolution
        }).then(async (ytvapi) => {
            const result = await googleYoutube(link);
            const thumb = await thumbnail(result.title, config.name, {
                thumbnailUrl: result.thumbnail
            }, ytvapi.result.url, true);
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

            await conn.sendMessage(m.chat, {
                text: youtubeInfo,
                ...thumb
            }, {
                quoted: m
            });

            await conn.sendMessage(
                m.chat, {
                    react: {
                        text: '😆',
                        key: m.key
                    }
                });

            const videoRes = await axios.get(ytvapi.result.url, {
                responseType: "arraybuffer"
            });
            const videoBuffer = Buffer.from(videoRes.data, "binary");
            await conn.sendMessage(m.chat, {
                video: videoBuffer,
                caption: '*[✓]* Done'
            }, {
                quoted: m
            });
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

handler.help = ['ytmp4', 'ytv', 'ytvideo'].map(v => v + ' *< limk >* ');
handler.tags = ['downloader']
handler.command = /^(ytmp4|ytv|ytvideo)$/i;

module.exports = handler;

async function googleYoutube(url) {
    const result = {};
    try {
        const formatSubscriberCount = subscriberCount => {
            const count = parseInt(subscriberCount);
            if (count >= 1_000_000_000) {
                return (count / 1_000_000_000).toFixed(1).replace('.0', '') + 'B';
            } else if (count >= 1_000_000) {
                return (count / 1_000_000).toFixed(1).replace('.0', '') + 'M';
            } else if (count >= 1_000) {
                return (count / 1_000).toFixed(1).replace('.0', '') + 'K';
            } else {
                return count.toString();
            }
        };

        const formatRelativeTime = publishedAt => {
            const now = new Date();
            const publishedDate = new Date(publishedAt);
            const diffInMs = now - publishedDate;
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
            const diffInMonths = Math.floor(diffInDays / 30);
            const diffInYears = Math.floor(diffInDays / 365);

            if (diffInYears >= 1) {
                return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
            } else if (diffInMonths >= 1) {
                return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
            } else {
                return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
            }
        };

        const formatDuration = duration => {
            const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
            const hours = match[1] ? parseInt(match[1]) : 0;
            const minutes = match[2] ? parseInt(match[2]) : 0;
            const seconds = match[3] ? parseInt(match[3]) : 0;

            if (hours > 0) {
                return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        };

        const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?![^\s]*\?is=)/;
        const match = url.match(regex);
        const videoId = match[1];

        const videoResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&fields=items(id,snippet(title,description,publishedAt,channelId,channelTitle),statistics(likeCount,commentCount,viewCount),contentDetails(duration))&id=${videoId}&key=${apiKey}`
        );

        const videoData = videoResponse.data.items[0];
        const channelResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${videoData.snippet.channelId}&key=${apiKey}`
        );

        const channelData = channelResponse.data.items[0];

        return {
            title: videoData.snippet.title,
            description: videoData.snippet.description,
            videoId: videoData.id,
            thumbnail: `https://i.ytimg.com/vi/${videoData.id}/hqdefault.jpg`,
            metadata: {
                like: await formatSubscriberCount(videoData.statistics.likeCount),
                comment: await formatSubscriberCount(videoData.statistics.commentCount),
                view: await formatSubscriberCount(videoData.statistics.viewCount),
                duration: formatDuration(videoData.contentDetails.duration),
                ago: await formatRelativeTime(videoData.snippet.publishedAt),
                jadwal_upload: new Date(videoData.snippet.publishedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }),
            },
            author: {
                channelTitle: videoData.snippet.channelTitle,
                channelId: videoData.snippet.channelId,
                channelLink: `https://www.youtube.com/channel/${videoData.snippet.channelId}`,
                Subscribe: await formatSubscriberCount(channelData.statistics.subscriberCount),
                Tentang: channelData.snippet.description,
                ago: await formatRelativeTime(channelData.snippet.publishedAt),
                Bergabung: new Date(channelData.snippet.publishedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }),
            },
            url: `https://www.youtube.com/watch?v=${videoData.id}`,
        };
    } catch (e) {
        console.log('Error:', e);
        return result;
    }
}

async function api(api, params = {}, retries = 5, delay = 2000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const {
                data
            } = await axios.get(api, {
                params
            })
            return data
        } catch (error) {
            console.error(`Attempt ${attempt} failed: ${error.message}`);

            if (attempt < retries) {
                console.log(`Retrying in ${delay / 1000} seconds...`);
                await new Promise(res => setTimeout(res, delay));
            } else {
                throw new Error("Failed to fetch data after multiple attempts");
            }
        }
    }
}
