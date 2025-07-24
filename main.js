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
    console.log(color(`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⡠⡠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⣢⠗⢍⡥⣦⢷⣵⣷⣵⣧⠧⠇⠅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢠⢰⣻⢷⡼⣿⢽⣋⢓⢹⢾⡷⣷⣐⡠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⣦⣾⣻⣟⣯⡿⣯⣟⣯⢃⢢⣟⣿⣻⣿⣻⣿⣵⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡢⣟⡯⣯⢿⣽⢷⣟⣿⡺⢁⢂⢂⢫⣿⣽⣯⣿⣷⢿⢷⣅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢜⣿⡔⡘⣟⣿⣻⣽⡾⣌⡐⡐⡐⣴⣻⣾⣿⣻⣯⣿⣿⣿⣶⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣺⡟⡐⢌⢼⣿⣟⣯⣿⡿⣇⣂⣂⣟⣿⣿⣻⣿⣿⣿⣿⣯⡛⠿⡆⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡯⣿⣾⣾⣿⣯⣿⣽⡿⡻⣿⣿⣻⣽⣿⣿⣿⣿⣿⣾⣿⣿⢿⡠⠈⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠰⢴⢿⢿⣯⣿⠸⣻⣿⣟⣯⣢⢬⡹⡳⡝⣿⣿⣷⣿⣿⣻⣿⣻⠕⢇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢽⡟⣿⡚⡞⠹⡻⣿⡨⡙⠅⠅⠅⢽⣿⡿⡻⠻⡛⠏⠾⡡⢄⢄⢄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣘⡑⡽⡆⢌⢂⢂⠢⡑⠌⠌⠌⢌⠢⠹⡗⠌⢌⢌⠪⠨⠊⠊⠈⠐⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢜⡮⡓⢌⢂⢂⠢⡑⠌⠌⠌⢌⣢⣱⣥⡷⡻⡃⠂⠀⠀⠀⠀⠀⡀⢄⣄⣴⣤⣤⣠⢠⢀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡟⣎⡄⡄⡁⢅⠇⠍⠅⠅⢅⠫⢟⠟⠇⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⡿⣿⣿⣿⣿⣷⣦⡀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠉⢙⢎⢪⡪⠪⠨⡈⠢⡑⠌⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠿⡧⡯⣗⣝⣿⣿⣿⡇⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠤⡁⡏⡊⡊⠢⡈⡢⢨⠪⡂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠐⠘⣿⣿⣿⢧⠂⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠘⣔⢐⠐⠌⢌⠢⠨⣈⡣⡣⡠⡀⠀⠀⠀⠀⠀⡀⣰⡼⠼⠞⠞⠞⠾⠾⠛⠋⠍⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠢⢮⢆⠧⡑⡐⡑⡑⠰⡀⠡⠑⠟⣮⣆⢄⢀⡦⠟⠑⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢲⣿⣿⣿⣿⣿⣷⣷⣧⣕⢑⢀⠀⠀⠀⠙⢷⢿⣌⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣕⢃⠀⠀⠀⠀⠐⠽⣟⣶⢦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⠟⠙⠉⠀⠁⠙⢿⣿⣿⣮⠳⣦⡠⡀⣄⣤⢗⠃⠘⢟⣯⣷⡠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢜⢟⡿⡟⠁⠀⠀⠀⠀⠀⠈⢿⢟⡟⡇⠈⠉⠍⠁⠁⠀⠀⠀⠀⠑⢿⡿⣧⡂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⣺⣿⠫⠈⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠩⠉⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠢⡾⡿⡟⠌⠀⠀⠀⠀⠀⠀⠀⠀⠀⠨⠻⠻⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`, 'blue'))
    const vers = await (await fetch('https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json')).json()
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
        version: vers.version,
        browser: Browsers.ubuntu('Chrome'),
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
              const { cpus } = require('os')
              console.log(color(`───────────────────────────────────────────`, 'green'))
              console.log(color(` • Script By:`, 'white'), color(`${config.ownername}`, 'red'))
              console.log(color(` • Name:`, 'white'), color(`${conn.user.name}`, 'blue'))
              console.log(color(` • Number:`, 'white'), color(`${conn.user.jid.split('@')[0]}`, 'purple'))
              console.log(color(`───────────────────────────────────────────`, 'green'))
              console.log(color(` • Os:`, 'white'), color(`${cpus()[0].model || ''}`, 'red'))
              console.log(color(' • Speed:', 'white'), color(`${cpus()[0].speed || ''}`, 'blue'))
              console.log(color(` • ${Object.entries(cpus()[0].times).map(([a, b]) => `${a}: ${b}`).join("\n")}`, 'purple'));
              console.log(color(`───────────────────────────────────────────`, 'green'))
              console.log(chalk.bold.green('[ Loading ] ') + chalk.white('>>> ') + chalk.green(`🔁 Memuat plugin`));
              console.log(chalk.bold.green('[ Terconnect ] ') + chalk.white('>>> ') + chalk.green(`Bot berhasil terhubung.`));
            }
        });

    //=====[ Setelah Pembaruan Koneksi ]========//
    conn.ev.on("creds.update", saveCreds);
    
    async function tampilkanKeep() {
       // Nama file tetap 'keep.txt'
       const FILENAME = 'keep.txt';
       const tmpDir = path.join(__dirname, 'tmp');
       const filePath = path.join(tmpDir, FILENAME);

       try {
          // Cek apakah folder tmp ada
          if (!fs.existsSync(tmpDir)) {
              fs.mkdirSync(tmpDir);
              console.log('📁 Folder tmp dibuat');
          }

          // Baca file dengan Promise wrapper
          const content = await new Promise((resolve, reject) => {
              fs.readFile(filePath, 'utf8', (err, data) => {
                  if (err) {
                      if (err.code === 'ENOENT') {
                          resolve(''); // Return string kosong jika file belum ada
                      } else {
                          reject(err);
                      }
                  } else {
                      resolve(data);
                  }
              });
          });

          console.log(`📝 Isi file ${FILENAME}:\n${content || '(File kosong)'}`);
          return content;
       } catch (error) {
           console.error('❌ Gagal:', error.message);
           throw error;
       }
    }
    
    await tampilkanKeep();

    async function clearTmp() {
       const tmpDir = path.join(__dirname, 'tmp');

       try {
          await fs.rm(tmpDir, { recursive: true, force: true });
          console.log('✅ Folder tmp berhasil dihapus.');
       } catch (error) {
          if (error.code === 'ENOENT') {
              console.log('ℹ️ Folder tmp tidak ada, tidak perlu dihapus.');
          } else {
             console.error('❌ Gagal menghapus tmp:', error.message);
          }
       }
    };
    
    async function jam(hours) {
      const milliseconds = hours * 60 * 60 * 1000; // 5 jam -> 18000000 ms
      return milliseconds
    };

    setTimeout(async() => {
       console.log(`🗑️5 jam sudah lewat, Hapus File Tmp`);
       await clearTmp();
    }, await jam(5));

    console.log(`⏳ Script akan restart dalam 9 jam (${jam(9) / 1000} detik)`);
    setTimeout(() => {
       console.log(`🔁 9 jam sudah lewat, restart sekarang...`);
       process.exit(0); // keluar, dan kalau pakai PM2 atau sejenis, akan auto restart
    }, await jam(9));
    
    let isInit = true,
        handler = require('./handler')
    reloadHandler = function(restartConn) {
      let Handler = require('./handler')
      if (Object.keys(Handler || {}).length) handler = Handler
    
      if (restartConn) {
          try {
              conn.ws.close()
          } catch {}
          conn = {
              ...conn,
              ...simple.makeWASocket(connectionOptions)
          }
      }

      // Initialize all handlers first
      conn.welcome = 'Selamat datang @user 👋'
      conn.bye = 'Selamat tinggal @user 👋'
      conn.spromote = '@user sekarang admin!'
      conn.sdemote = '@user sekarang bukan admin!'
    
    // Make sure these are properly defined
      conn.handler = handler.handler ? handler.handler.bind(conn) : () => {}
      conn.onParticipantsUpdate = handler.participantsUpdate ? handler.participantsUpdate.bind(conn) : () => {}
      conn.onDelete = handler.onDelete ? handler.onDelete.bind(conn) : () => {}
      conn.connectionUpdate = connectionUpdate.bind(conn)
      conn.credsUpdate = saveCreds.bind(conn)

    // Remove existing listeners if any
      if (!isInit) {
          conn.ev.off('messages.upsert', conn.handler)
          conn.ev.off('group-participants.update', conn.onParticipantsUpdate)
          conn.ev.off('message.delete', conn.onDelete)
          conn.ev.off('connection.update', conn.connectionUpdate)
          conn.ev.off('creds.update', conn.credsUpdate)
      }

    // Add new listeners
      conn.ev.on('messages.upsert', conn.handler)
      conn.ev.on('group-participants.update', conn.onParticipantsUpdate)
      conn.ev.on('message.delete', conn.onDelete)
      conn.ev.on('connection.update', conn.connectionUpdate)
      conn.ev.on('creds.update', conn.credsUpdate)
    
      isInit = false
      return true
    }
    global.scraper = new (await require(process.cwd() + "/scrapers"))(
      process.cwd() + "/scrapers/src",
    );
    await scraper.watch();

    global.pg = new(await require(process.cwd() + "/lib/plugins"))(
        process.cwd() + "/plugins",
    );
    await pg.watch();
    global.plugins = pg.plugins
    reloadHandler()

    setInterval(async () => {
       await pg.load();
       await scraper.load();
    }, 2000);
    global.Scraper = await scraper.list()
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
    }

    _quickTest()
        .then(() => conn.logger.info('Quick Test Done'))
        .catch(console.error)
})()
