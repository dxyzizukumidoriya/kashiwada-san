// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: pinterest-downloader.js

const axios = require("axios");
const cheerio = require("cheerio");

const base = "https://www.pinterest.com";
const search = "/resource/BaseSearchResource/get/";

let deku = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (!text) throw " *[ ! ]* Masukan query/link dari pinterest !"
    const pinterest = new Pinterest();
    if (/pinterest.com|pin.it/.test(text)) {
        let data = await pinterest.download(text);
        let cap = "📁 Pinterest - Downloader"
        cap += `📒Title : ${data.title}\n`
        cap += `⌨️Keyword : ${data.keyword.join(", ")}\n`
        cap += `👤Author : ${data.author.name}\n`

        conn.sendFile(m.chat, data.download, null, cap, m);
    } else {
        const a = await pinterest.search(text);
        let pickget = a.pins[Math.floor(Math.random() * a.pins.length)];

        if (!a && !a.length > 0) throw 'maaf yg anda search tidak di temukan😹';

        let cap = `🔍 Search [ ${text} ]`;
        cap += `\n> Kalau Kamu Salah Dan Ga Suka\n> Ketik \`[ Next / Lanjut ]\``;

        await conn.sendAliasMessage(m.chat, {
            image: {
                url: pickget.images
            },
            caption: cap
        }, [{
            alias: `next`,
            response: `${usedPrefix + command} ${text}`
        }, {
            alias: `lanjut`,
            response: `${usedPrefix + command} ${text}`
        }], m);
    }
}

deku.command = ["pinterest", "pin", "pindl"];
deku.help = ["pinterest", "pin", "pindl"];
deku.tags = ["downloader", "internet"];
deku.limit = true
deku.loading = true;

const headers = {
    'accept': 'application/json, text/javascript, */*, q=0.01',
    'referer': 'https://www.pinterest.com/',
    'user-agent': 'Postify/1.0.0',
    'x-app-version': 'a9522f',
    'x-pinterest-appstate': 'active',
    'x-pinterest-pws-handler': 'www/[username]/[slug].js',
    'x-pinterest-source-url': '/search/pins/?rs=typed&q=kucing%20anggora/',
    'x-requested-with': 'XMLHttpRequest'
}

async function getCookies() {
    try {
        const response = await axios.get(base);
        const setHeaders = response.headers['set-cookie'];
        if (setHeaders) {
            const cookies = setHeaders.map(cookieString => {
                const cp = cookieString.split(';');
                const cv = cp[0].trim();
                return cv;
            });
            return cookies.join('; ');
            g
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

class Pinterest {
    search = async function(query) {
        if (!query) {
            return {
                status: false,
                code: 400,
                result: {
                    message: "Bree, lu ngetik apa sih? Query nya literally kosong begini? Emangnya gua punya third eye buat nebak apa? Minimal effort lah ya 🙄✋"
                }
            };
        }

        try {
            const cookies = await getCookies();
            if (!cookies) {
                return {
                    status: false,
                    code: 400,
                    result: {
                        message: "Cookies nya failed retrieve nih. Nanti lagi ae yak.."
                    }
                };
            }

            const params = {
                source_url: `/search/pins/?q=${query}`,
                data: JSON.stringify({
                    options: {
                        isPrefetch: false,
                        query: query,
                        scope: "pins",
                        bookmarks: [""],
                        no_fetch_context_on_resource: false,
                        page_size: 10
                    },
                    context: {}
                }),
                _: Date.now()
            };

            const {
                data
            } = await axios.get(`${base}${search}`, {
                headers: {
                    ...headers,
                    'cookie': cookies
                },
                params: params
            });

            const container = [];
            const results = data.resource_response.data.results.filter((v) => v.images?.orig);

            results.forEach((result) => {
                container.push({
                    id: result.id,
                    title: result.title || "",
                    description: result.description,
                    pin_url: `https://pinterest.com/pin/${result.id}`,
                    images: result.images.orig.url,
                    uploader: {
                        username: result.pinner.username,
                        full_name: result.pinner.full_name,
                        profile_url: `https://pinterest.com/${result.pinner.username}`
                    }
                });
            });

            if (container.length === 0) {
                return {
                    status: false,
                    code: 404,
                    result: {
                        message: `Anjir bree, literally gua kagak nemu apa2 buat input "${query}". Like seriously, searching skill lu perlu diimprove deh. No offense yak, but try harder gitu 🤪`
                    }
                };
            }

            return {
                pins: container
            };

        } catch (error) {
            return {
                status: false,
                code: error.response?.status || 500,
                result: {
                    message: "Servernya lagi chaos bree! Lu ganggu mulu sih, Servernya butuh break. Try again later yak 😂",
                    error: error
                }
            };
        }
    }

    download = async function(url) {
        try {
            let response = await axios
                .get(url, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                    },
                })
                .catch((e) => e.response);
            let $ = cheerio.load(response.data);
            let tag = $('script[data-test-id="video-snippet"]');
            if (tag.length > 0) {
                let result = JSON.parse(tag.text());
                if (
                    !result ||
                    !result.name ||
                    !result.thumbnailUrl ||
                    !result.uploadDate ||
                    !result.creator
                ) {
                    return {
                        msg: "- Data tidak ditemukan, coba pakai url lain"
                    };
                }
                return {
                    title: result.name,
                    thumb: result.thumbnailUrl,
                    upload: new Date(result.uploadDate).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                    }),
                    source: result["@id"],
                    author: {
                        name: result.creator.alternateName,
                        username: "@" + result.creator.name,
                        url: result.creator.url,
                    },
                    keyword: result.keywords ?
                        result.keywords.split(", ").map((keyword) => keyword.trim()) : [],
                    download: result.contentUrl,
                };
            } else {
                let json = JSON.parse($("script[data-relay-response='true']").eq(0).text());
                let result = json.response.data["v3GetPinQuery"].data;
                return {
                    title: result.title,
                    upload: new Date(result.createAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                    }),
                    source: result.link,
                    author: {
                        name: result.pinner.username,
                        username: "@" + result.pinner.username,
                    },
                    keyword: result.pinJoin.visualAnnotation,
                    download: result.images.url,
                };
            }
        } catch (e) {
            return {
                msg: "Error coba lagi nanti"
            };
        }
    };
}

module.exports = deku;
