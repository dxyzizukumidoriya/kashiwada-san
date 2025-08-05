// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: afk-info.js

let handler = async (m, {
    text
}) => {
    let user = global.db.data.users[m.sender];
    user.afk = +new Date();
    user.afkReason = text;
    let textafk = `> - - - - - - - - - - - - 🍀 Afk ☘️ - - - - - - - - - - - -
> 👤 Penguna: @${m.sender.split('@')[0]}
> 💤 Alasan: ${text ? text : "tidak ada alasan"}
> - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`
    await conn.reply(m.chat, textafk, m, {
        mentions: [m.sender]
    })
};

handler.help = ["afk *[reason]*"];
handler.tags = ["main"];
handler.command = ["afk"];

module.exports = handler;

function clockString(ms) {
    let h = isNaN(ms) ? "--" : Math.floor(ms / 3600000);
    let m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
    return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(":");
}
