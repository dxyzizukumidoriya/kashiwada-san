// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: clearsesi-owner.js

const fs = require('node:fs')
module.exports = {
    command: ["delsesi", "clearsesi", "deletesesi"],
    help: ["delsesi", "clearsesi", "deletesesi"],
    tags: ["owner"],
    owner: true,
    async code(m, {
        conn
    }) {
        fs.readdir(`./sessions`, async function(err, files) {
            if (err) {
                console.log('Unable to scan directory: ' + err);
                return m.reply('Unable to scan directory: ' + err);
            }
            let filteredArray = await files.filter(item => item.startsWith("pre-key") ||
                item.startsWith("sender-key") || item.startsWith("session-") || item.startsWith("app-state")
            )
            console.log(filteredArray.length);
            let teks = `Terdeteksi ${filteredArray.length} file kenangan <3\n\n`
            if (filteredArray.length == 0) return m.reply(`${teks}`)
            filteredArray.map(function(e, i) {
                teks += (i + 1) + `. ${e}\n`
            })
            m.reply(`${teks}`)
            await sleep(2000)
            m.reply("Menghapus file Kenangan...")
            await filteredArray.forEach(function(file) {
                fs.unlinkSync(`./sessions/${file}`)
            });
            await sleep(2000)
            m.reply("Berhasil menghapus semua Kenangan di folder session")
        });
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
