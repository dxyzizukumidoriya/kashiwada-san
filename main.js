/**
 *  ═══🗡️≪ DEMON CORE ≫🗡️═══
 *  @ File: [main.js]
 *  @ Creator: [Dxyz - Putra]
 *  @ Name Bot: [Rin-Okumura]
 *  ═══🔥≪ 業火 ≫🔥═══
**/

(async () => {
    require('./config')
    const {
        useMultiFileAuthState,
        DisconnectReason,
        generateForwardMessageContent,
        prepareWAMessageMedia,
        generateWAMessageFromContent,
        generateMessageID,
        downloadContentFromMessage,
        makeCacheableSignalKeyStore,
        makeInMemoryStore,
        jidDecode,
        PHONENUMBER_MCC,
        fetchLatestBaileysVersion,
        Browsers,
        proto
    } = require("@adiwajshing/baileys")
    const WebSocket = require('ws')
    const path = require('path')
    const pino = require('pino')
    const chokidar = require("chokidar")
    const fs = require('fs')
    const yargs = require('yargs/yargs')
    const cp = require('child_process')
    let {
        promisify
    } = require('util')
    let exec = promisify(cp.exec).bind(cp)
    const _ = require('lodash')
    const syntaxerror = require('syntax-error')
    const os = require('os')
    const moment = require("moment-timezone")
    const time = moment.tz('Asia/Jakarta').format("HH:mm:ss")
    const { Boom } = require("@hapi/boom");
    const chalk = require('chalk')
    const readline = require('readline')
    const {
        color
    } = require('./lib/color')
    let simple = require('./lib/simple')
    const readdir = promisify(fs.readdir)
    const stat = promisify(fs.stat)
    var low
    try {
        low = require('lowdb')
    } catch (e) {
        low = require('./lib/lowdb')
    }
    const {
        Low,
        JSONFile
    } = low
    const mongoDB = require('./lib/mongoDB')

    const useStore = !process.argv.includes('--store')
    const usePairingCode = process.argv.includes("--code") || process.argv.includes("--pairing")
    const useMobile = process.argv.includes("--mobile")
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    const question = (text) => new Promise((resolve) => rl.question(text, resolve))

    timestamp = {
        start: new Date
    }

    const PORT = process.env.PORT || 3000

    opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
    prefix = new RegExp('^[' + (opts['prefix'] || 'â€ŽxzXZ/i!#$%+Â£Â¢â‚¬Â¥^Â°=Â¶âˆ†Ã—Ã·Ï€âˆšâœ“Â©Â®:;?&.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

    db = new Low(
        /https?:\/\//.test(opts['db'] || '') ?
        new cloudDBAdapter(opts['db']) : /mongodb/i.test(opts['db']) ?
        new mongoDB(opts['db']) :
        new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}system/database.json`)
    )

    DATABASE = db
    loadDatabase = async function loadDatabase() {
        if (db.READ) return new Promise((resolve) => setInterval(function() {
            (!db.READ ? (clearInterval(this), resolve(db.data == null ? loadDatabase() : db.data)) : null)
        }, 1 * 1000))
        if (db.data !== null) return
        db.READ = true
        await db.read()
        db.READ = false
        db.data = {
            users: {},
            chats: {},
            stats: {},
            msgs: {},
            sticker: {},
            settings: {},
            respon: {},
            ...(db.data || {})
        }
        db.chain = _.chain(db.data)
    }
    loadDatabase()

    const authFile = `sessions`
    global.isInit = !fs.existsSync(authFile)
    const {
        state,
        saveState,
        saveCreds
    } = await useMultiFileAuthState(authFile)
    const {
        version,
        isLatest
    } = await fetchLatestBaileysVersion()
    console.log(chalk.magenta(`-- Using WA v${version.join('.')}, isLatest: ${isLatest} --`))
    console.log(chalk.blue(`⣿⣿⡿⠉⢋ ⢀⡏⡀⠠⠐  ⠂⢸⢸⣿⡀  ⢰⡀ ⠂ ⠂⠈ ⢈   ⠆⡄ 
⢠⠠⠆⠈⡄ ⣾⠇⡇⠆⡓⠁  ⣿⢸⣿⣷⡀  ⣿⣆⠐⠂⠈ ⢁  ⡀ ⢰⣷⡤
⡇⠈⢇⠁⠁⢰⣿ ⡇⢀⠠⠈⠒⢤⣿⠸⣿⣿⣿⣄ ⠸⣿⣆⢯ ⠄⠐  ⢰⢸⢸⣿⣿
⡇⡆⠟ ⡆⣼⡿ ⣷⠸⡆⠆ ⢸⣿⡆⡏⠻⢿⣿⣦⡘⠬⣿⡼⣇⢀⣆⣤ ⢸⣸⡼⢿⣿
⡇⡇ ⣧⣇⣿⡇⣸⣿⡆⣿⡄⡀⠘⣿⣧⢠⣴⣾⣿⣿⠟⠓⢫⠿⢹⣼⣿⡖ ⢸⣿⣶⣆⣿
⡇⡇ ⣿⣿⣿⣧⣿⣿⣯⡜⣿⣄⡀⢿⡿⣿⠋⠁⣿⣿⣷ ⠘  ⠇⣿⣿ ⣿⣿⡆⣼⣿
⣧⣷ ⣿⣟⠙⠉⣿⣿⡍⠛⢿⡘⢿⣜⣧   ⠋ ⠁     ⠘⢹⣷⣿⡟⣴⣿⣿
⣿⣿⡄⣿⣿⠂ ⠛⠙⠃  ⡇ ⠉⠻            ⢸⣏⣤⣾⣿⣿⣿
⣿⣿⣷⣸⣿      ⠰                ⢠⡏⠉⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣄     ⢠⡀               ⡼  ⣿⢿⣟⠛
⣻⣿⣿⣿⣿⣿⡄    ⠈⠓              ⣰⠃  ⢿⣶⣷⣾
⣿⣿⣯⣿⣿⣿⣿⣆     ⢀⡠⠄⠒⠒ ⠐     ⢀⣼⡏   ⢸⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⡀   ⠐⠒⠛⠉⠁    ⣠⣴⣿⣿⠁   ⢸⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⡀      ⢀⣠⣾⣿⢿⣿⠇    ⣸⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣤⣤⣤⣴⣶⣿⣿⠟⠁⣼⡏ ⢀⣠⣶⣿⣿⣿⣿⣿
⣿⣿⡟⣿⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃ ⢰⡿⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟  ⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏ ⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
`))
    console.log(chalk.bold.green('[ Script ] ') + chalk.white('>>> ') + chalk.green(`${config.name} Creator: Dxyz - Deku`));
    const { cpus } = require('os')
    console.log(chalk.bold.cyan('[ Cpus ] ') + chalk.white('>>> ') + chalk.bold.yellow(`\nOs: ${cpus()[0].model || ''}\nSpeed: ${cpus()[0].speed || ''}`) + chalk.bold.red(`\n${Object.entries(cpus()[0].times).map(([a, b]) => `${a}: ${b}`).join("\n")}`));
    const connectionOptions = {
        printQRInTerminal: false,
        syncFullHistory: true,
        markOnlineOnConnect: true,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000,
        generateHighQualityLinkPreview: true,
        patchMessageBeforeSending: (message) => {
            const requiresPatch = !!(
                message.buttonsMessage ||
                message.templateMessage ||
                message.listMessage
            );
            if (requiresPatch) {
                message = {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadataVersion: 2,
                                deviceListMetadata: {},
                            },
                            ...message,
                        },
                    },
                };
            }

            return message;
        },
        version: [2, 3000, 1019441105],
        browser: Browsers.ubuntu("Edge"),
        logger: pino({
            level: 'fatal'
        }),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino().child({
                level: 'silent',
                stream: 'store'
            })),
        },
    }

    const getMessage = async key => {
        const messageData = await store.loadMessage(key.remoteJid, key.id);
        return messageData?.message || undefined;
    }

    global.conn = simple.makeWASocket(connectionOptions)
    conn.isInit = false

    if (!opts['test']) {
        if (global.db) setInterval(async () => {
            if (global.db.data) await global.db.write()
            if (!opts['tmp'] && (global.support || {}).find)(tmp = [os.tmpdir(), 'tmp'], tmp.forEach(filename => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])))
        }, 30 * 1000)
    }

    async function connectionUpdate(update) {
        const {
            connection,
            lastDisconnect
        } = update
        global.timestamp.connect = new Date
        if (lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut && conn.ws.readyState !== WebSocket.CONNECTING) {
            console.log(global.reloadHandler(true))
        }
        if (global.db.data == null) await loadDatabase()
        // console.log(JSON.stringify(update, null, 4))
    }

    if ((usePairingCode || useMobile) && fs.existsSync('./system/sessions/creds.json') && !conn.authState.creds.registered) {
        console.log(chalk.bgRed(chalk.white('!! WARNING !! : \ncreds.json rusak, silakan hapus dulu')))
        process.exit(0)
    }
    if (!conn.authState.creds.registered) {
      console.log(chalk.bold.green('[ Warning ] ') + chalk.white('>>> ') + chalk.green(`Masukan Nomor Kalian Di Sini\nMinsalnya 62 Terus Contohnya: 628xxx`));
      const phoneNumber = await question(chalk.bold.green('[ Nomor Anda ] ') + chalk.white('>>> ') );
      const code = await conn.requestPairingCode(phoneNumber, "RINN1234");
      setTimeout(() => {
        console.log(chalk.bold.green('[ Code ] ') + chalk.white('>>> ') + chalk.green(`Nih Code Pairing Mu Tuan: ${chalk.bold.green(code)}`));
      }, 3000);
    }
    process.on('uncaughtException', console.error)

        conn.ev.on("connection.update", async (update) => {
            const {
                connection,
                lastDisconnect
            } = update;
            if (connection === "close") {
                const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
                if (lastDisconnect.error == "Error: Stream Errored (unknown)") {
                    process.exit(0)
                } else if (reason === DisconnectReason.badSession) {
                    console.log(chalk.bold.red('[ Warning ] ') + chalk.white('>>> ') + chalk.red(`File sesi buruk, Harap hapus sesi dan scan ulang`));
                    process.exit(0)
                } else if (reason === DisconnectReason.connectionClosed) {
                    console.log(chalk.bold.yellow('[ Warning ] ') + chalk.white('>>> ') + chalk.yellow(`Koneksi ditutup, sedang mencoba untuk terhubung kembali...`));
                    process.exit(0)
                } else if (reason === DisconnectReason.connectionLost) {
                    console.log(chalk.bold.yellow('[ Warning ] ') + chalk.white('>>> ') + chalk.yellow(`Koneksi hilang, mencoba untuk terhubung kembali...`));
                    process.exit(0)
                } else if (reason === DisconnectReason.connectionReplaced) {
                    console.log(chalk.bold.yellow('[ Warning ] ') + chalk.white('>>> ') + chalk.yellow(`Koneksi diganti, sesi lain telah dibuka. Harap tutup sesi yang sedang berjalan.`));
                    conn.logout();
                } else if (reason === DisconnectReason.loggedOut) {
                    console.log(chalk.bold.yellow('[ Warning ] ') + chalk.white('>>> ') + chalk.yellow(`Perangkat logout, harap scan ulang.`));
                    conn.logout();
                } else if (reason === DisconnectReason.restartRequired) {
                    console.log(chalk.bold.yellow('[ Warning ] ') + chalk.white('>>> ') + chalk.yellow(`Restart diperlukan, sedang memulai ulang...`));
                    process.exit(0)
                } else if (reason === DisconnectReason.timedOut) {
                    console.log(chalk.bold.yellow('[ Warning ] ') + chalk.white('>>> ') + chalk.yellow(`Koneksi waktu habis, sedang mencoba untuk terhubung kembali...`));
                    process.exit(0)
                }
            } else if (connection === "connecting") {
                console.log(chalk.bold.green('[ Loading ] ') + chalk.white('>>> ') + chalk.green(`Menghubungkan ke WhatsApp...`));
            } else if (connection === "open") {
                const info = conn.user
                const informasi = {
                   "Name": info.name,
                   "Id": info.id,
                   "lid": info.lid,
                   "Sender": info.jid,
                   "Owner": config.owner.map(a => a) + '@s.whatsapp.net'
                };
                console.table(informasi)
                console.log(chalk.bold.green('[ Loading ] ') + chalk.white('>>> ') + chalk.green(`🔁 Memuat plugin dan scraper dan case...`));
                console.log(chalk.bold.green('[ Terconnect ] ') + chalk.white('>>> ') + chalk.green(`Bot berhasil terhubung.`));
            }
        });

    //=====[ Setelah Pembaruan Koneksi ]========//
    conn.ev.on("creds.update", saveCreds);

    let isInit = true,
        handler = require('./handler')
    reloadHandler = function(restatConn) {
        let Handler = require('./handler')
        if (Object.keys(Handler || {}).length) handler = Handler
        if (restatConn) {
            try {
                conn.ws.close()
            } catch {}
            conn = {
                ...conn,
                ...simple.makeWASocket(connectionOptions)
            }
        }
        if (!isInit) {
            conn.ev.off('messages.upsert', conn.handler)
            conn.ev.off('group-participants.update', conn.onParticipantsUpdate)
            conn.ev.off('message.delete', conn.onDelete)
            conn.ev.off('connection.update', conn.connectionUpdate)
            conn.ev.off('creds.update', conn.credsUpdate)
        }

        conn.welcome = 'Selamat datang @user 👋'
        conn.bye = 'Selamat tinggal @user 👋'
        conn.spromote = '@user sekarang admin!'
        conn.sdemote = '@user sekarang bukan admin!'
        conn.handler = handler.handler.bind(conn)
        conn.onParticipantsUpdate = handler.participantsUpdate.bind(conn)
        conn.onDelete = handler.delete.bind(conn)
        conn.connectionUpdate = connectionUpdate.bind(conn)
        conn.credsUpdate = saveCreds.bind(conn)

        conn.ev.on('messages.upsert', conn.handler)
        conn.ev.on('group-participants.update', conn.onParticipantsUpdate)
        conn.ev.on('message.delete', conn.onDelete)
        conn.ev.on('connection.update', conn.connectionUpdate)
        conn.ev.on('creds.update', conn.credsUpdate)
        isInit = false
        return true
    }
    global.pg = new(await require(process.cwd() + "/lib/plugins"))(
        process.cwd() + "/plugins",
    );
    await pg.watch();
    global.plugins = pg.plugins
    reloadHandler()

    setInterval(async () => {
        await pg.load();
    }, 2000);
    // Quick Test
    async function _quickTest() {
        let test = await Promise.all([
            cp.spawn('ffmpeg'),
            cp.spawn('ffprobe'),
            cp.spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
            cp.spawn('convert'),
            cp.spawn('magick'),
            cp.spawn('gm'),
            cp.spawn('find', ['--version'])
        ].map(p => {
            return Promise.race([
                new Promise(resolve => {
                    p.on('close', code => {
                        resolve(code !== 127)
                    })
                }),
                new Promise(resolve => {
                    p.on('error', _ => resolve(false))
                })
            ])
        }))
        let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
        console.log(test)
        let s = support = {
            ffmpeg,
            ffprobe,
            ffmpegWebp,
            convert,
            magick,
            gm,
            find
        }

        Object.freeze(support)

        if (!s.ffmpeg) conn.logger.warn('Silakan instal ffmpeg untuk mengirim video (pkg install ffmpeg)')
        if (s.ffmpeg && !s.ffmpegWebp) conn.logger.warn('Stiker tidak boleh dianimasikan tanpa libwebp di ffmpeg (--enable-ibwebp while compiling ffmpeg)')
        if (!s.convert && !s.magick && !s.gm) conn.logger.warn('Stiker mungkin tidak berfungsi tanpa imagemagick jika libwebp di ffmpeg tidak diinstal (pkg install imagemagick)')
    }

    _quickTest()
        .then(() => conn.logger.info('Quick Test Done'))
        .catch(console.error)
})()