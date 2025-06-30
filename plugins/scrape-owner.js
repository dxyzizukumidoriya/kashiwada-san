// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: scrape-owner.js

const fs = require("node:fs");

module.exports = {
    help: ["scrape", "skrep", "scraper"].map(v => v + " *[ Untuk Pengelolaan Scraper bot ]* "),
    tags: ["owner"],
    command: ["scrape", "skrep", "scraper"],
    owner: true,
    code: async (m, {
        conn,
        text
    }) => {
        let src = await scraper.list();
        if (!text)
            throw `🔥 乂 Cara Penggunaan 乂 🔥

\`--get\` ➠ Ambil scrape (Rin-style) 👿  
\`--add\` ➠ Tambah scrape (Yukio-mode) 👓  
\`--delete\` ➠ Hapus scrape (Demon force) 🧠  

⚡ List Scrape Tersedia ⚡:
${Object.keys(src)
  .map((a, i) => `${i + 1}. ${a} ${i % 2 === 0 ? "👿" : "👓"}`)
  .join("\n")}`;

        if (text.includes("--get")) {
            let input = text.replace("--get", "").trim();
            if (!isNaN(input)) {
                let list = Object.keys(src);
                try {
                    let file = scraper.dir + "/" + list[parseInt(input) - 1];
                    m.reply(fs.readFileSync(file.trim()).toString());
                } catch (e) {
                    m.reply(`Scrape ${list[parseInt(input) - 1]} tidak ditemukan! (Rin: "Coba cek lagi, manusia!") 🔥`);
                }
            } else {
                try {
                    let file = scraper.dir + "/" + input;
                    m.reply(fs.readFileSync(file.trim()).toString());
                } catch (e) {
                    m.reply(`Scrape ${input} hilang! (Yukio: "Fokus, jangan asal ketik!") 👓`);
                }
            }
        } else if (text.includes("--add")) {
            if (!m.quoted) throw `Reply scrape yang mau disimpan! (Rin: "Jangan main-main!") 🔥`;
            let input = text.replace("--add", "").trim();
            try {
                let file = scraper.dir + "/" + input;
                fs.writeFileSync(file.trim(), m.quoted.text);
                m.reply(`Berhasil menyimpan scrape: ${input} (Rin: "Nah, gitu dong!") 👿`);
            } catch (e) {
                m.reply(`Gagal menyimpan! (Yukio: "Ada error, periksa kode!") 👓`);
            }
        } else if (text.includes("--delete")) {
            let input = text.replace("--delete", "").trim();
            if (!isNaN(input)) {
                let list = Object.keys(src);
                try {
                    let file = scraper.dir + "/" + list[parseInt(input) - 1];
                    fs.unlinkSync(file.trim());
                    m.reply(`Scrape ${list[parseInt(input) - 1]} berhasil dihapus! (Rin: "Target dieliminasi.") 🔥`);
                } catch (e) {
                    m.reply(`Scrape ${list[parseInt(input) - 1]} tidak ada! (Yukio: "Jangan asal hapus!") 👓`);
                }
            } else {
                try {
                    let file = scraper.dir + "/" + input;
                    fs.unlinkSync(file.trim());
                    m.reply(`Scrape ${input} berhasil dihapus! (Rin: "Target dieliminasi.") 🔥`);
                } catch (e) {
                    m.reply(`Gagal menghapus! (Yukio: "Scrape ini dilindungi exorcist!") 🧠`);
                }
            }
        }
    },
};
