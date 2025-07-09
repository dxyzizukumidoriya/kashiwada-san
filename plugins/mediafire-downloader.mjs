// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: mediafire-downloader.mjs

import fetch from 'node-fetch';

let izuku = async (m, {
    conn,
    args
}) => {
    if (!/www.mediafire.com/.test(args[0])) throw ' *[ ! ]* Maaf Anda Masukan Link MediaFire Nya Dulu !';
    try {
        const response = await (await fetch(`https://izumi-apis.zone.id/downloader/mfdl?url=${args[0]}`)).json();
        let {
            downloadLink,
            metadata
        } = response.result;

        if (!downloadLink && !metadata) return m.reply(' *[ ! ]* Maaf Metadata/Download Gagal Di Get !')

        let mfcp = ` *π* [ Downloader MediaFire ] *π*
> 📁 *FileName:* *${metadata.fileName || ''}*
> 🗄️ *FileSize:* *${metadata.fileSize || ''}*
> ⬆️ *uploadDate:* *${metadata.uploadedDate || ''}*`;
        await conn.reply(m.chat, mfcp, m);

        conn.sendMessage(m.chat, {
            document: {
                url: downloadLink
            },
            mimetype: metadata.mimeType,
            fileName: metadata.fileName,
            caption: mfcp
        });

    } catch (e) {
        m.reply(' *[ ! ]* Maaf Error Mungkin Lu Kebanyakan Request');
        console.error('Error', e);
    };
};

izuku.help = ['mf', 'mfdl', 'mediafire'];
izuku.command = /^(mf|mfdl|mediafire)$/i;
izuku.tags = ['downloader'];

export default izuku;
