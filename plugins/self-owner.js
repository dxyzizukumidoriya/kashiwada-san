// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: self-owner.js

let izuku = async (m, {
    conn,
    text
}) => {
    const type = ['--on', '--off'];
    if (!type.includes(text)) throw ` *[ ! ]* Pilih ${type.map((a => a)).join(', ')} !`;
    let settings = db.data.settings[conn.user.jid];
    let dbdata = text === '--on' ? settings.self = true : settings.self = false;
    conn.reply(
        m.chat,
        ` *π* Self Udah Di ${dbdata ? 'Aktifkan' : 'Nonaktifkan'}`,
        m
    );
};

izuku.owner = true;

izuku.help = ['self', 'senyamkan'];
izuku.command = /^(self|senyamkan)$/i;
izuku.tags = ['owner'];

module.exports = izuku;
