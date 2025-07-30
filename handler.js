const simple = require('./lib/simple')
const util = require('util')
const {
    color
} = require('./lib/color')
const moment = require("moment-timezone")
const fetch = require("node-fetch")

const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))

module.exports = {
    async handler(chatUpdate) {
        // Add the requested check at the very beginning
        if (global.conn && global.conn.user && global.conn.user.jid != conn.user.jid) return;

        if (global.db.data == null) await loadDatabase()
        this.msgqueque = this.msgqueque || []
        if (!chatUpdate) return
        const userId = chatUpdate.messages[0].key.id;
        global.block_message = new Set();
        let m = chatUpdate.messages[chatUpdate.messages.length - 1]
        global.settings = global.db.data.settings
        global.fkontak = global.fkontak
        global.ctx = global.sock = global.client = conn
        if (!m) return

        try {
            m = simple.smsg(this, m) || m
            if (!m) return
            m.exp = 0
            m.limit = false

            try {
                let user = global.db.data.users[m.sender]
                if (typeof user !== 'object') global.db.data.users[m.sender] = {}
                if (user) {
                    if (!('limit' in user)) user.limit = 100
                    if (!('exp' in user)) user.exp = 100
                } else global.db.data.users[m.sender] = {
                    limit: 100,
                    exp: 100
                }

                let chat = global.db.data.chats[m.chat]
                if (typeof chat !== 'object') global.db.data.chats[m.chat] = {}
                if (chat) {
                    if (!('isBanned' in chat)) chat.isBanned = false
                    if (!('welcome' in chat)) chat.welcome = false
                    if (!('autoread' in chat)) chat.autoread = false
                    if (!('detect' in chat)) chat.detect = false
                    if (!('sWelcome' in chat)) chat.sWelcome = 'Selamat datang @user!'
                    if (!('sBye' in chat)) chat.sBye = ''
                    if (!('sPromote' in chat)) chat.sPromote = '@user telah di promote'
                    if (!('sDemote' in chat)) chat.sDemote = '@user telah di demote'
                    if (!('delete' in chat)) chat.delete = true
                    if (!('blacklist' in chat)) chat.blacklist = []
                    if (!('tagsw' in chat)) chat.tagsw = {
                        delete: false,
                        kick: false
                    }
                    if (!('antiVirtex' in chat)) chat.antiVirtex = false
                    if (!('antiLink' in chat)) chat.antiLink = false
                    if (!('mute' in chat)) chat.mute = false
                    if (!('badword' in chat)) chat.badword = false
                    if (!('antiSpam' in chat)) chat.antiSpam = false
                    if (!('freply' in chat)) chat.freply = false
                    if (!('antiSticker' in chat)) chat.antiSticker = false
                    if (!('stiker' in chat)) chat.stiker = false
                    if (!('viewonce' in chat)) chat.viewonce = false
                    if (!('useDocument' in chat)) chat.useDocument = false
                    if (!('antiToxic' in chat)) chat.antiToxic = false
                    if (!isNumber(chat.expired)) chat.expired = 0
                } else global.db.data.chats[m.chat] = {
                    isBanned: false,
                    welcome: false,
                    autoread: false,
                    blacklist: [],
                    tagsw: {
                        delete: false,
                        kick: false
                    },
                    detect: false,
                    sWelcome: '',
                    sBye: '',
                    sPromote: '@user telah di promote!',
                    sDemote: '@user telah di demote',
                    delete: true,
                    antiLink: false,
                    mute: false,
                    stiker: false,
                    antiSticker: false,
                    antiSpam: false,
                    freply: false,
                    viewonce: false,
                    useDocument: false,
                    antiToxic: false,
                    expired: 0,
                }

                let settings = global.db.data.settings[this.user.jid]
                if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
                if (settings) {
                    if (!('self' in settings)) settings.self = false
                    if (!('resetlimit' in settings)) settings.resetlimit = moment.tz(config.tz).format("HH:mm")
                    if (!('autoread' in settings)) settings.autoread = false
                    if (!('restrict' in settings)) settings.restrict = true
                    if (!('onlygrup' in settings)) settings.onlygrup = true
                    if (!('autorestart' in settings)) settings.autorestart = true
                    if (!('restartDB' in settings)) settings.restartDB = 0
                    if (!isNumber(settings.status)) settings.status = 0
                    if (!('anticall' in settings)) settings.anticall = true
                    if (!('clear' in settings)) settings.clear = true
                    if (!isNumber(settings.clearTime)) settings.clearTime = 0
                    if (!('freply' in settings)) settings.freply = true
                } else global.db.data.settings[this.user.jid] = {
                    self: false,
                    autoread: false,
                    resetlimit: moment.tz(config.tz).format("HH:mm"),
                    restrict: true,
                    onlygrup: true,
                    autorestart: true,
                    restartDB: 0,
                    status: 0,
                    anticall: true,
                    clear: true,
                    clearTime: 0,
                    freply: true
                }
            } catch (e) {
                console.error(e)
            }

            if (db.data.settings[this.user.jid].autoread) await this.readMessages([m.key])
            if (opts['nyimak']) return
            if (opts['pconly'] && m.chat.endsWith('g.us')) return
            if (opts['gconly'] && !m.chat.endsWith('g.us')) return
            if (opts['swonly'] && m.chat !== 'status@broadcast') return
            if (typeof m.text !== 'string') m.text = ''

            let usedPrefix
            let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]
            
            const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net';
            const ownerNumbers = global.config.owner.map(v => v.replace(/[^0-9]/g, '')); 
            const mappedOwners = ownerNumbers.map(v => v + detectwhat); 
            console.log('DEBUG: mappedOwners (JID format for comparison):', mappedOwners);
            const isROwner = mappedOwners.includes(m.sender);
            const isOwner = isROwner || m.fromMe
            const isPrems = global.db.data.users[m.sender].premium
            const isBans = global.db.data.users[m.sender].banned
            
            async function getLidFromJid(id, conn) {
                if (id.endsWith('@lid')) return id
                const res = await conn.onWhatsApp(id).catch(() => [])
                return res[0]?.lid || id
            }   
            global.getLidFromJid = getLidFromJid;
            const senderLid = await getLidFromJid(m.sender, this)
            const botLid = await getLidFromJid(this.user.jid, this)
            const senderJid = m.sender
            const botJid = this.user.jid
            const groupMetadata = (m.isGroup ? (conn.chats[m.chat] || {}).metadata : {}) || {}
            const participants = m.isGroup ? (groupMetadata.participants || []) : []
            const user = participants.find(p => p.id === senderLid || p.id === senderJid) || {}
            const bot = participants.find(p => p.id === botLid || p.id === botJid) || {}
            const isRAdmin = user?.admin === "superadmin" || false
            const isAdmin = isRAdmin || user?.admin === "admin" || false
            const isBotAdmin = !!bot?.admin || false

            if (!isOwner && db.data.settings[this.user.jid].self) return
            if (!isOwner && db.data.chats[m.chat].mute) return
            const isBot = m?.id?.startsWith("3EB0") ||
                m?.id?.startsWith("FELZ") ||
                m?.id?.startsWith("F3FD") ||
                m?.id?.startsWith("SSA") ||
                m?.id?.startsWith("B1EY") ||
                m?.id?.startsWith("BAE5") ||
                m?.id?.startsWith("HSK") ||
                m?.id?.indexOf("-") > 1;
            if (isBot) return

            // Variabel kontrol reset
            let isResetting = false
            let lastResetTime = 0

            // Di dalam handler:
            if (isROwner) {
                if (global.conn.user.jid != conn.user.jid) return;
                db.data.users[m.sender].limit = 100
            }

            // Pengecekan reset limit yang anti-spam
            const now = Date.now()
            const resetTime = db.data.settings[this.user.jid].resetlimit

            if (resetTime && !isResetting) {
                const [targetHour, targetMinute] = resetTime.split(':').map(Number)
                const currentTime = moment.tz(config.tz)

                // Cek jika waktu sekarang sama dengan waktu reset
                if (currentTime.hours() === targetHour &&
                    currentTime.minutes() === targetMinute &&
                    now - lastResetTime > 60000) { // Minimal 1 menit antara reset

                    isResetting = true
                    lastResetTime = now

                    try {
                        const users = Object.keys(db.data.users)
                        for (const user of users) {
                            db.data.users[user].limit = 100
                        }

                        console.log(color(`[ LIMIT RESET ] Berhasil direset pukul ${resetTime} untuk ${users.length} pengguna`, 'green'))
                    } catch (e) {
                        console.error(color('[ LIMIT RESET ERROR ]', 'red'), e)
                    } finally {
                        isResetting = false
                    }
                }
            }

            if (isROwner) {
                db.data.users[m.sender].limit = 100
            }

            if (opts['queque'] && m.text && !(isMods || isPrems)) {
                let queque = this.msgqueque,
                    time = 1000 * 5
                const previousID = queque[queque.length - 1]
                queque.push(m.id || m.key.id)
                setInterval(async function() {
                    if (queque.indexOf(previousID) === -1) clearInterval(this)
                    else await delay(time)
                }, time)
            }

            m.exp += Math.ceil(Math.random() * 10)

            for (let name in pg.plugins) {
                let plugins
                if (typeof pg.plugins[name].code === "function") {
                    let anu = pg.plugins[name]
                    plugins = anu.code
                    for (let prop in anu) {
                        if (prop !== "run") {
                            plugins[prop] = anu[prop]
                        }
                    }
                } else {
                    plugins = pg.plugins[name]
                }
                if (!plugins) return
                if (plugins.disabled) continue

                if (!opts['restrict'])
                    if (plugins.tags && plugins.tags.includes('admin')) {
                        global.dfail('restrict', m, this)
                        continue
                    }
                const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
                let _prefix = plugins.customPrefix ? plugins.customPrefix : conn.prefix ? conn.prefix : global.prefix
                let match = (_prefix instanceof RegExp ? // RegExp Mode?
                    [
                        [_prefix.exec(m.text), _prefix]
                    ] :
                    Array.isArray(_prefix) ? // Array?
                    _prefix.map(p => {
                        let re = p instanceof RegExp ? // RegExp in Array?
                            p :
                            new RegExp(str2Regex(p))
                        return [re.exec(m.text), re]
                    }) :
                    typeof _prefix === 'string' ? // String?
                    [
                        [new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]
                    ] : [
                        [
                            [], new RegExp
                        ]
                    ]
                ).find(p => p[1])

                try {
                    if (typeof plugins.before === 'function')
                        if (await plugins.before.call(this, m, {
                                match,
                                conn: this,
                                ctx,
                                sock,
                                client,
                                participants,
                                groupMetadata,
                                user,
                                bot,
                                isROwner,
                                isOwner,
                                isRAdmin,
                                isAdmin,
                                isBotAdmin,
                                isPrems,
                                isBans,
                                chatUpdate,
                            })) continue
                    if (typeof plugins !== 'function') continue
                    if ((usedPrefix = (match[0] || '')[0])) {
                        let noPrefix = m.text.replace(usedPrefix, '')
                        let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                        if (!m.isGroup && db.data.settings[this.user.jid].onlygrup) {
                           if (usedPrefix && command) return m.reply(`Sorry Bre Ini Only Gc Link Gc:\n\n${config.wagc.map((a, i) => `${i + 1 + ','} ${a}`).join(`\n`)}`)
                        };
                        args = args || []
                        let _args = noPrefix.trim().split` `.slice(1)
                        let text = _args.join` `
                        command = (command || '').toLowerCase()
                        let fail = plugins.fail || global.dfail // When failed
                        let isAccept = plugins.command instanceof RegExp ? // RegExp Mode?
                            plugins.command.test(command) :
                            Array.isArray(plugins.command) ? // Array?
                            plugins.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
                                cmd.test(command) :
                                cmd === command
                            ) :
                            typeof plugins.command === 'string' ? // String?
                            plugins.command === command :
                            false

                        if (!isAccept) continue
                        m.plugins = name
                        if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                            let chat = global.db.data.chats[m.chat]
                            let user = global.db.data.users[m.sender]
                            if (name != 'unbanchat.js' && chat && chat.isBanned) return // Except this
                            if (name != 'unbanuser.js' && user && user.banned) return
                        }
                        if (plugins.rowner && plugins.owner && !(isROwner || isOwner)) { // Both Owner
                            fail('owner', m, this)
                            continue
                        }
                        if (plugins.loading) { // Both Owner
                            m.reply(`*( Loading )* Tunggu Sebentar...`)
                        }
                        if (plugins.rowner && !(isROwner || isOwner)) { // Real Owner
                            fail('rowner', m, this)
                            continue
                        }
                        if (plugins.owner && !isOwner) { // Number Owner
                            fail('owner', m, this)
                            continue
                        }
                        if (plugins.mods && !isMods) { // Moderator
                            fail('mods', m, this)
                            continue
                        }
                        if (plugins.premium && !isPrems) { // Premium
                            fail('premium', m, this)
                            continue
                        }
                        if (plugins.banned && !isBans) { // Banned
                            fail('banned', m, this)
                            continue
                        }
                        if (plugins.group && !m.isGroup) { // Group Only
                            fail('group', m, this)
                            continue
                        } else if (plugins.botAdmin && !isBotAdmin) { // You Admin
                            fail('botAdmin', m, this)
                            continue
                        } else if (plugins.admin && !isAdmin) { // User Admin
                            fail('admin', m, this)
                            continue
                        }
                        if (plugins.private && m.isGroup) { // Private Chat Only
                            fail('private', m, this)
                            continue
                        }
                        if (plugins.register == true && _user.registered == false) { // Butuh daftar?
                            fail('unreg', m, this)
                            continue
                        }
                        m.isCommand = true
                        let xp = 'exp' in plugins ? parseInt(plugins.exp) : 17 // XP Earning per command
                        if (xp > 9999999999999999999999) m.reply('Ngecit -_-') // Hehehe
                        else m.exp += xp
                        if (plugins.level > _user.level) {
                            this.reply(m.chat, `diperlukan level ${plugins.level} untuk menggunakan perintah ini. Level kamu ${_user.level}`, m)
                            continue // If the level has not been reached
                        }
                        let extra = {
                            match,
                            usedPrefix,
                            noPrefix,
                            _args,
                            args,
                            command,
                            text,
                            conn: this,
                            ctx,
                            sock,
                            client,
                            participants,
                            groupMetadata,
                            user,
                            bot,
                            isROwner,
                            isOwner,
                            isRAdmin,
                            isAdmin,
                            isBotAdmin,
                            isPrems,
                            isBans,
                            chatUpdate,
                        }
                        try {
                            await plugins.call(this, m, extra)
                                .then(async (a) => {
                                    if (plugins?.limit && !isPrems && !isROwner) {
                                        let user = db.data.users[m.sender]
                                        if (user.limit > plugins.limit) {
                                            user.limit -= plugins.limit
                                            conn.reply(
                                                m.chat,
                                                `⚡━━━━━━━━━━━━━━━━━━━⚡
👹 *LIMIT DEMONIC* 👹
⚡━━━━━━━━━━━━━━━━━━━⚡

🗡️ Limit kamu: ${user.limit} tersisa 
⏳ Reset: 02:00 WIB
"Jangan habiskan kekuatan iblismu!" - Rin
⚡━━━━━━━━━━━━━━━━━━━⚡`,
                                                m
                                            )
                                            if (user.limit === plugins.limit) {
                                                conn.reply(
                                                    m.chat,
                                                    `💢━━━━ *FINAL WARNING* ━━━━💢
👹 *Limit terakhir!* Hanya ${user.limit} tersisa!
⏱️ Tunggu reset 02:00 WIB
"Kau menguji kesabaranku!" - Rin`,
                                                    m
                                                )
                                            }
                                        } else {
                                            conn.reply(
                                                m.chat,
                                                `🔥━━━━ *LIMIT HABIS* ━━━━🔥
⚔️ Tidak bisa menggunakan fitur!
⏳ Reset otomatis 02:00 WIB
"Pulang saja kau, manusia!" - Rin`,
                                                m
                                            )
                                        }
                                    }
                                })
                        } catch (e) {
                            m.error = e;
                            console.error("Error", e);
                            if (e) {
                                let text = util.format(e);
                                conn.logger.error(text);
                                if (text.match("rate-overlimit")) return;
                                if (e.name) {
                                    for (let jid of global.config.owner) {
                                        let data = (await conn.onWhatsApp(jid))[0] || {};
                                        if (data.exists)
                                            this.reply(
                                                data.jid,
                                                `*[ REPORT ERROR ]*
*• Name Plugins :* ${m.plugins}
*• From :* @${m.sender.split("@")[0]} *(wa.me/${m.sender.split("@")[0]})*
*• Jid Chat :* ${m.chat} 
*• Command  :* ${usedPrefix + command}

*• Error Log :*
\`\`\`${text}\`\`\`
`.trim(),
                                                m,
                                            );
                                    }
                                    m.reply("*[ system notice ]* Terjadi kesalahan pada bot !");
                                }
                                m.reply(e);
                            }
                        } finally {
                            if (typeof plugins.after === "function") {
                                try {
                                    await plugins.after.call(this, m, extra);
                                } catch (e) {
                                    console.error(e);
                                }
                            }
                        }
                        break;
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            if (opts["queque"] && m.text) {
                const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id);
                if (quequeIndex !== -1) this.msgqueque.splice(quequeIndex, 1);
            }
            let user,
                stats = global.db.data.stats;
            if (m) {
                if (m.sender && (user = global.db.data.users[m.sender])) {
                    user.exp += m.exp;
                    user.limit -= m.limit * 1;
                }
                let stat;
                if (m.plugins) {
                    let now = +new Date();
                    if (m.plugins in stats) {
                        stat = stats[m.plugins];
                        if (!isNumber(stat.total)) stat.total = 1;
                        if (!isNumber(stat.success)) stat.success = m.error != null ? 0 : 1;
                        if (!isNumber(stat.last)) stat.last = now;
                        if (!isNumber(stat.lastSuccess))
                            stat.lastSuccess = m.error != null ? 0 : now;
                    } else
                        stat = stats[m.plugins] = {
                            total: 1,
                            success: m.error != null ? 0 : 1,
                            last: now,
                            lastSuccess: m.error != null ? 0 : now,
                        };
                    stat.total += 1;
                    stat.last = now;
                    if (m.error == null) {
                        stat.success += 1;
                        stat.lastSuccess = now;
                    }
                }
            }
            try {
                require('./lib/print')(m, this)
            } catch (e) {
                console.log(m, m.quoted, e)
            }
            if (opts['autoread']) await this.chatRead(m.chat, m.isGroup ? m.sender : undefined, m.id || m.key.id).catch(() => {})
        }
    },

    async participantsUpdate({
        id,
        participants,
        action
    }) {
        if (opts['self']) return
        if (global.isInit) return
        let chat = global.db.data.chats[id] || {}
        let text = ''
        switch (action) {
            case 'add':
            case 'remove':
                if (chat.welcome) {
                    let groupMetadata = await this.groupMetadata(id) || (conn.chats[id] || {}).metadata
                    for (let user of participants) {
                        let pp = './src/avatar_contact.png'
                        try {
                            pp = await this.profilePictureUrl(user, 'image')
                        } catch (e) {} finally {
                            text = (action === 'add' ? (chat.sWelcome || this.welcome || conn.welcome || 'Welcome, @user!').replace('@subject', await this.getName(id)).replace('@desc', groupMetadata.desc ? String.fromCharCode(8206).repeat(4001) + groupMetadata.desc : '') :
                                (chat.sBye || this.bye || conn.bye || 'Bye, @user!')).replace('@user', await this.getName(user))
                            this.sendFile(id, action === 'add' ? 'Selamat datang @user 👋' : 'Selamat tinggal @user 👋', 'pp.jpg', text, null, false, {
                                mentions: [user]
                            })
                        }
                    }
                }
                break
            case 'promote':
                text = (chat.sPromote || this.spromote || conn.spromote || '@user sekarang admin!')
            case 'demote':
                if (!text)
                    text = (chat.sDemote || this.sdemote || conn.sdemote || '@user sekarang bukan admin!')
                text = text.replace('@user', '@' + participants[0].split('@')[0])
                if (chat.detect)
                    this.sendMessage(id, {
                        text,
                        mentions: this.parseMention(text)
                    })
                break
        }
    },

    async onCall(json) {
        if (!db.data.settings[this.user.jid].anticall) return
        let jid = json[2][0][1]['from']
        let isOffer = json[2][0][2][0][0] == 'offer'
        let users = global.db.data.users
        let user = users[jid] || {}
        if (user.whitelist) return
        if (jid && isOffer) {
            const tag = this.generateMessageTag()
            const nodePayload = ['action', 'call', ['call', {
                    'from': this.user.jid,
                    'to': `${jid.split`@`[0]}@s.whatsapp.net`,
                    'id': tag
                },
                [
                    ['reject', {
                        'call-id': json[2][0][2][0][1]['call-id'],
                        'call-creator': `${jid.split`@`[0]}@s.whatsapp.net`,
                        'count': '0'
                    }, null]
                ]
            ]]
            this.sendJSON(nodePayload, tag)
            m.reply(`Kamu dibanned karena menelepon bot, owner : @${global.owner[0][0]}`)
        }
    },

    async GroupUpdate({
        jid,
        desc,
        descId,
        descTime,
        descOwner,
        announce
    }) {
        if (!db.data.chats[jid].desc) return
        if (!desc) return
        let caption = `
@${descOwner.split`@`[0]} telah mengubah deskripsi grup.
${desc}
    `.trim()
        this.sendMessage(jid, caption, info.wm, m)
    }
}

global.dfail = (type, m, conn) => {
    let msg = {
        rowner: `*( ${global.msg.danied} )* Perintah ini hanya dapat digunakan oleh *Real Owner*!`,
        owner: `*( ${global.msg.danied} )* Perintah ini hanya dapat digunakan oleh *Owner*!`,
        banned: `*( ${global.msg.danied} )* Perintah ini hanya untuk pengguna yang terbanned..`,
        premium: `*( ${global.msg.danied} )* Perintah ini hanya dapat digunakan oleh *Premium*!`,
        group: `*( ${global.msg.danied} )* Perintah ini hanya dapat digunakan di grup!`,
        private: `*( ${global.msg.danied} )* Perintah ini hanya dapat digunakan di Chat Pribadi!`,
        admin: `*( ${global.msg.danied} )* Perintah ini hanya untuk *Admin* grup!`,
        botAdmin: `*( ${global.msg.danied} )* Jadikan bot sebagai *Admin* untuk menggunakan perintah ini!`,
        restrict: `*( ${global.msg.danied} )* Fitur ini di *disable*!`,
        unreg: `*( Hai *@${m.sender.split("@")[0]} )* Anda belum terdaftar!\n\nContoh: *#daftar Manusia.16* atau *#regmail xxx@gmail.com*`
    } [type]
    if (msg) return m.reply(msg)
}

let fs = require('fs')
let chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright("Update handler.js'"))
    delete require.cache[file]
    if (global.reloadHandler) console.log(global.reloadHandler())
})
