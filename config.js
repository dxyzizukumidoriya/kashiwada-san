const fs = require("fs");
const chalk = require("chalk");
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

global.ftpick = [
  "https://files.catbox.moe/118nmm.jpg",
  "https://files.catbox.moe/cwe31b.jpg"
]
global.geturl = global.ftpick[Math.floor(Math.random() * global.ftpick.length)]

global.setting = {
  clear: false,
  addReply: true
}

global.config = {
    owner: ["6283136099660"],
    name: "Rin-Kun",
    ownername: 'Dxyz',
    menu: { thumbnailUrl: 'https://files.catbox.moe/8h6ylu.jpg' }, //thumbnail: fs.readFileSync('./image/tambahkan-ft-trus-kasih-nama')
    thumbnail: {
      thumbnailUrl: geturl
      //thumbnail: fs.readFileSync('./image/tambahkan-ft-trus-kasih-nama')
    },
    isQr: false,
    prefix: [".", "?", "!", "/", "#"], //Tambahin sendiri prefix nya kalo kurang
    wagc: [ "https://chat.whatsapp.com/JyeT1hdCPJeLy95tzx5eyI", "https://chat.whatsapp.com/DfffgArbTUu46nqCgmCbE0" ],
    saluran: '120363401113812327@newsletter', 
    jid: '120363267102694949@g.us', 
    wach: 'https://whatsapp.com/channel/0029VadFS3r89inc7Jjus03W', 
    link: {
     tt: "https://www.tiktok.com/@leooxzy_ganz/"
    },
    sticker: {
      packname: "〆 Rin-Kun",
      author: "By: Deku/Dxyz 〆"
    },
   messages: {
      wait: "*( Loading )* Tunggu Sebentar...",
      owner: "*( Denied )* Kamu bukan owner ku !",
      premium: "*( Denied )* Fitur ini khusus user premium",
      group: "*( Denied )* Fitur ini khusus group",
      botAdmin: "*( Denied )* Lu siapa bukan Admin group",
      grootbotbup: "*( Denied )* Jadiin Yuta-Botz admin dulu baru bisa akses",
   },
   tz: "Asia/Jakarta"
}

global.multiplier = 1000 // The higher, The harder levelup

global.rpg = {
  emoticon(string) {
    string = string.toLowerCase();
    let emot = {
      exp: '✉️',
      money: '💵',
      potion: '🥤',
      diamond: '💎',
      common: '📦',
      uncommon: '🎁',
      mythic: '🗳️',
      legendary: '🗃️',
      pet: '🎁',
      trash: '🗑',
      armor: '🥼',
      sword: '⚔️',
      wood: '🪵',
      rock: '🪨',
      string: '🕸️',
      horse: '🐎',
      cat: '🐈',
      dog: '🐕',
      fox: '🦊',
      petFood: '🍖',
      iron: '⛓️',
      gold: '👑',
      emerald: '💚'
    };
    let results = Object.keys(emot).filter(v => new RegExp(v, 'gi').test(string));
    if (!results.length) return '';
    else return emot[results[0]];
  }
}

global.msg = {
 eror: '🤖 *Information Bot*\n\> Mohon maaf atas ketidaknyamanan dalam menggunakan *Nightmare Bot* . Ada kesalahan dalam sistem saat menjalankan perintah.',
 danied: 'Kamu tidak memiliki akses'
}

/**
Context info
**/

global.adReply = {
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.saluran,
                    serverMessageId: 103,
                    newsletterName: config.name
                },
                externalAdReply: {
                    showAdAttribution: true,
                    title: config.name,
                    body: config.ownername,
                    thumbnailUrl: config.thumbnail.thumbnailUrl,
                    sourceUrl: config.link.tt,
                }
            }
        }

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  delete require.cache[file]
  require(file)
})
