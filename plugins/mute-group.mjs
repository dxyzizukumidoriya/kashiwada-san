// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: mute-group.mjs

export default {
    help: ['mute', 'banchat'],
    command: ['mute', 'banchat'],
    tags: ['group'],
    group: true,
    owner: true,
    async code(m, {
        conn,
        text,
        usedPrefix,
        command
    }) {
        let [type, link] = text.split(' ');

        if (!type) throw ` *[ ! ]* Pilih --on atau --off\nKalau Link\n${usedPrefix + command} --on https://chat.whatsapp.com/xxxx`;

        const {
            key
        } = await conn.sendClearTime(m.chat, {
            text: 'Tunggu Ya.... Lagi di Proses'
        }, {
            quoted: m
        });

        let id;
        if (link && /chat\.whatsapp\.com/.test(link)) {
            try {
                const url = new URL(link);
                const code = url.pathname.split('/')[1];
                id = await conn.groupGetInviteInfo(code).then(a => a.id);
            } catch (e) {
                throw 'Link group tidak valid!';
            }
        } else {
            id = m.chat;
        }

        if (!id) throw 'Gagal mendapatkan ID group!';

        if (type === '--on') {
            db.data.chats[id].mute = true;
        } else if (type === '--off') {
            db.data.chats[id].mute = false;
        } else {
            throw ` *[ ! ]* Pilihan tidak valid, gunakan --on atau --off`;
        }

        await conn.sendClearTime(m.chat, {
            text: ` *[ ! ]* Succes Di ${db.data.chats[id].mute ? 'Aktifkan' : 'Nonaktifkan'} `,
            edit: key
        }, {
            quoted: m
        });
    }
}
