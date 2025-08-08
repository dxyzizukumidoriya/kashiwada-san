// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: mediafire-downloader.mjs

let izumi = async (m, {
    conn,
    text
}) => {
    if (!text.includes('mediafire')) throw '> ⚠️ Masukan Link MediaFire Nya Yah...'
    try {
        const mf = await (await fetch(`${config.apikey}/downloader/mediafire?url=${encodeURIComponent(text)}`)).json()

        let mfc = `> - - - - - [ MediaFire Downloader ] - - - - - -
> 📂Filename: ${mf.result.filename || ''}
> 🗄️Size: ${mf.result.filesize || ''}
> 🧩Mimetype: ${mf.result.mimetype || ''}
> 🔗Download: ${mf.result.download_url || ''}
> - - - - - - - - - - - - - - - - - - - - - - - - - - `
        await m.reply(mfc);

        let sizeMB = 0;
        if (mf.result.filesize) {
            const sizeStr = mf.result.filesize.toLowerCase().replace(/ /g, '')
            if (sizeStr.includes('gb')) {
                sizeMB = parseFloat(sizeStr) * 1024
            } else if (sizeStr.includes('mb')) {
                sizeMB = parseFloat(sizeStr)
            } else if (sizeStr.includes('kb')) {
                sizeMB = parseFloat(sizeStr) / 1024
            }
        };

        if (sizeMB > 90) {
            return m.reply(`❌ Ukuran file terlalu besar (${sizeMB.toFixed(2)} MB). Batas maksimal 90 MB.`)
        };

        await conn.sendMessage(m.chat, {
            document: {
                url: mf.result.download_url
            },
            fileName: mf.result.filename,
            mimetype: mf.result.mimetype
        }, {
            quoted: m
        });
    } catch (e) {
        await m.reply('> ❌ Maaf Error Mungkin Lu Kebanyakan Request')
        console.error('Error', e)
    }
}

izumi.help = ['mf', 'mediafire', 'mfdl'];
izumi.command = ['mf', 'mediafire', 'mfdl'];
izumi.tags = ['downloader']

export default izumi;
