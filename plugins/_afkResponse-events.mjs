// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: _afkResponse-events.mjs

let handler = (m) => m
handler.before = (m) => {
    let user = global.db.data.users[m.sender];
    if (user.afk > -1) {
        conn.reply(m.chat, `> - - - - - - - - - - 🍀 Keluar Afk☘️ - - - - - - - - - -
> 👤 Penguna: @${m.sender.split('@')[0]}
> 💤 Alasan: ${user.afkReason ? user.afkReason : "tidak ada alasan"}
> ⌛ JamAfk: ${clockString(new Date() - user.afk)}
> - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`.trim(), m, {
            mentions: [m.sender]
        });
        user.afk = -1;
        user.afkReason = "";
    }
    let jids = [
        ...new Set([
            ...(m.mentionedJid || []),
            ...(m.quoted ? [m.quoted.sender] : []),
        ]),
    ];
    for (let jid of jids) {
        let user = global.db.data.users[jid];
        if (!user) continue;
        let afkTime = user.afk;
        if (!afkTime || afkTime < 0) continue;
        let reason = user.afkReason || "";
        let janganganggu = `> 🍞 JANGAN GANGGU DIA, DIA LAGI AFK💢
> 💤 Alasan: ${reason ? reason : "tidak ada alasan"}
> ⌛ JamAfk: ${clockString(new Date() - afkTime)}`.trim()
        conn.reply(m.chat, janganganggu, m);
    }
    return true;
};

export default handler;

function clockString(ms) {
    let h = isNaN(ms) ? "--" : Math.floor(ms / 3600000);
    let m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
    return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(":");
}
