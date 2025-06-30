let izuku = m => m

izuku.before = async (m, {
    conn
}) => {
    if (!m.isGroup) return;
    let nomor = m.sender.split('@')[0];
    if (db.data.chats[m.chat]?.blacklist?.includes(nomor)) {
        return sock.sendMessage(m.chat, {
            delete: m.key
        });
    }
}

module.exports = izuku;
