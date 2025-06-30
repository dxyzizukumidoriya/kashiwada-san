// 🔥® Rin-Okumura™ 🔥  
// 👿 Creator: Dxyz  
// ⚡ Plugin: blacklist-owner.js  

let izuku = async (m, { args, command }) => {
    if (command === 'black') {
        let nomor = m.quoted ? m.quoted.sender : args[0];
        if (!nomor) return m.reply('🚫 Tag, reply, atau ketik nomor.');
        nomor = nomor.replace(/\D/g, '');
        if (!nomor) return m.reply('🚫 Nomor tidak valid.');
        
        // Pastikan struktur database ada
        if (!db.data.chats[m.chat]) db.data.chats[m.chat] = {};
        if (!db.data.chats[m.chat].blacklist) db.data.chats[m.chat].blacklist = [];
        
        if (db.data.chats[m.chat].blacklist.includes(nomor)) {
            return m.reply('📌 Nomor sudah diblacklist.');
        }
        
        db.data.chats[m.chat].blacklist.push(nomor);
        m.reply(`✅ Nomor ${nomor} berhasil diblacklist.`);

    } else if (command === 'unblack') {
        let nomor = m.quoted ? m.quoted.sender : args[0];
        if (!nomor) return m.reply('🚫 Tag, reply, atau ketik nomor.');
        nomor = nomor.replace(/\D/g, '');
        if (!nomor) return m.reply('🚫 Nomor tidak valid.');

        // Pastikan database dan blacklist-nya ada
        if (!db.data.chats[m.chat] || !db.data.chats[m.chat].blacklist) {
            return m.reply('❌ Tidak ada blacklist di grup ini!');
        }

        // Cari nomor di blacklist
        let index = db.data.chats[m.chat].blacklist.indexOf(nomor);
        if (index === -1) {
            return m.reply('❌ Nomor tidak ditemukan di blacklist!');
        }

        // Hapus nomor dari blacklist
        db.data.chats[m.chat].blacklist.splice(index, 1);
        m.reply(`✅ Nomor ${nomor} berhasil dihapus dari blacklist.`);

    } else if (command === 'blacklist') {
        if (!db.data.chats[m.chat]?.blacklist?.length) {
            return m.reply('📌 Tidak ada nomor di blacklist grup ini.');
        }
        let list = db.data.chats[m.chat].blacklist.map((n, i) => `${i + 1}. wa.me/${n}`).join('\n');
        m.reply(`📋 Daftar Blacklist:\n\n${list}`);
    }
};

izuku.group = true;
izuku.admin = true;
izuku.botAdmin = true;

izuku.help = ['black', 'unblack', 'blacklist'];
izuku.command = /^(black|unblack|blacklist)$/i;
izuku.tags = ['owner'];

module.exports = izuku;
