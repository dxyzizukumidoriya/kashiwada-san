// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: stickerly-sticker.mjs

/**
    @ ✨ Scrape Sticker Ly (Search & Detail)
    @ Base: https://play.google.com/store/apps/details?id=com.snowcorp.stickerly.android
**/

import axios from 'axios'
import file from 'file-type';

let izuku = async (m, {
    conn,
    text
}) => {
    if (!text) throw ' *[ ! ]* Carikan Nama Sticker Nya !';
    return new Promise(async (revolse) => {
        const s = new StickerLy();
        await s.search(text).then(async (resp) => {
            for (let stk of resp) {
                const buf = await axios.get(stk.thumbnailUrl, {
                    responseType: 'arraybuffer'
                });
                let {
                    mime
                } = await file.fromBuffer(buf.data);
                const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
                if (/jpg|png/.test(mime)) {
                    await delay(2000);
                    await conn.sendImageAsSticker(m.chat, buf.data, m, {
                        packname: config.name,
                        author: config.ownername
                    });
                } else if (/video/.test(mime)) {
                    await delay(2000)
                    await conn.sendVideoAsSticker(m.chat, buf.data, m, {
                        packname: config.name,
                        author: config.ownername
                    });
                } else if (/webp/.test(mime)) {
                    await delay(5000)
                    await conn.sendMessage(m.chat, {
                        sticker: buf.data,
                        packname: config.name,
                        author: config.ownername
                    }, {
                        ephemeralExpiration: 86400,
                        quoted: m
                    });
                };
            };
        }).catch((err) => {
            m.reply(' *[ ! ]* Maaf Mungkin Lu Kebanyakan Request')
            console.error('Error', err)
        })
    })
};

class StickerLy {
    search = async function(query) {
        try {
            if (!query) throw new Error('Query is required');

            const {
                data
            } = await axios.post('https://api.sticker.ly/v4/stickerPack/smartSearch', {
                keyword: query,
                enabledKeywordSearch: true,
                filter: {
                    extendSearchResult: false,
                    sortBy: 'RECOMMENDED',
                    languages: [
                        'ALL'
                    ],
                    minStickerCount: 5,
                    searchBy: 'ALL',
                    stickerType: 'ALL'
                }
            }, {
                headers: {
                    'user-agent': 'androidapp.stickerly/3.17.0 (Redmi Note 4; U; Android 29; in-ID; id;)',
                    'content-type': 'application/json',
                    'accept-encoding': 'gzip'
                }
            });

            return data.result.stickerPacks.map(pack => ({
                name: pack.name,
                author: pack.authorName,
                stickerCount: pack.resourceFiles.length,
                viewCount: pack.viewCount,
                exportCount: pack.exportCount,
                isPaid: pack.isPaid,
                isAnimated: pack.isAnimated,
                thumbnailUrl: `${pack.resourceUrlPrefix}${pack.resourceFiles[pack.trayIndex]}`,
                url: pack.shareUrl
            }));
        } catch (error) {
            throw new Error(error.message);
        }
    }

    detail = async function(url) {
        try {
            const match = url.match(/\/s\/([^\/\?#]+)/);
            if (!match) throw new Error('Invalid url');

            const {
                data
            } = await axios.get(`https://api.sticker.ly/v4/stickerPack/${match[1]}?needRelation=true`, {
                headers: {
                    'user-agent': 'androidapp.stickerly/3.17.0 (Redmi Note 4; U; Android 29; in-ID; id;)',
                    'content-type': 'application/json',
                    'accept-encoding': 'gzip'
                }
            });

            return {
                name: data.result.name,
                author: {
                    name: data.result.user.displayName,
                    username: data.result.user.userName,
                    bio: data.result.user.bio,
                    followers: data.result.user.followerCount,
                    following: data.result.user.followingCount,
                    isPrivate: data.result.user.isPrivate,
                    avatar: data.result.user.profileUrl,
                    website: data.result.user.website,
                    url: data.result.user.shareUrl
                },
                stickers: data.result.stickers.map(stick => ({
                    fileName: stick.fileName,
                    isAnimated: stick.isAnimated,
                    imageUrl: `${data.result.resourceUrlPrefix}${stick.fileName}`
                })),
                stickerCount: data.result.stickers.length,
                viewCount: data.result.viewCount,
                exportCount: data.result.exportCount,
                isPaid: data.result.isPaid,
                isAnimated: data.result.isAnimated,
                thumbnailUrl: `${data.result.resourceUrlPrefix}${data.result.stickers[data.result.trayIndex].fileName}`,
                url: data.result.shareUrl
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

izuku.limit = true;

izuku.help = ['ssearch', 'stickersearch', 'stksearch'];
izuku.tags = ['sticker'];
izuku.command = /^(ssearch|stickersearch|stksearch)$/i;

export default izuku;
