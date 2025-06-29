// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: setpp-owner.js

const Jimp = require("jimp");

class Command {
    constructor() {
        this.command = ["setppbot", "setpp", "setppbotwa"]
        this.help = ["setppbot", "setpp", "setppbotwa"];
        this.tags = ["owner"];
        this.owner = true;
        this.loading = true;
    }

    code = async (m, {
        conn,
        usedPrefix,
        command
    }) => {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || q.mediaType || "";

        if (/image/g.test(mime) && !/webp/g.test(mime)) {
            let media = await q.download();
            let {
                img
            } = await pepe(media);
            await conn.updateProfilePicture(conn.decodeJid(conn.user.id), img);
            m.reply(
                " *π* 🎉 *Berhasil mengubah profile picture bot!* 🎉\n *π* *Foto profil bot telah diperbarui.*",
            );
        } else {
            m.reply(
                " *[ ! ]* *Balas/Kirim gambar yang ingin dijadikan profile picture bot.*\n *π* Pastikan gambar yang dikirim tidak dalam format webp.",
            );
        }
    };
}
module.exports = new Command();

async function pepe(media) {
    const jimp = await Jimp.read(media),
        min = jimp.getWidth(),
        max = jimp.getHeight(),
        cropped = jimp.crop(0, 0, min, max);

    return {
        img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
        preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG),
    };
}
