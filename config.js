const fs = require("fs");
const chalk = require("chalk");
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

global.ftpick = [
  "https://files.catbox.moe/118nmm.jpg",
  "https://files.catbox.moe/cwe31b.jpg"
]
global.geturl = 'https://files.cloudkuimages.guru/images/xjnU1ZY4.jpg' // global.ftpick[Math.floor(Math.random() * global.ftpick.length)]

global.setting = {
  clear: false,
  addReply: true
}

global.config = {
    owner: ["6283136099660"],
    ownerlid: ["242588711973065@lid"],
    name: "Kashiwada-san",
    ownername: 'Dxyz',
    menu: { thumbnailUrl: 'https://files.cloudkuimages.guru/images/0vJcLfEA.jpg' }, //thumbnail: fs.readFileSync('./image/tambahkan-ft-trus-kasih-nama')
    thumbnail: {
      thumbnailUrl: geturl
      //thumbnail: fs.readFileSync('./image/tambahkan-ft-trus-kasih-nama')
    },
    wagc: [ "https://chat.whatsapp.com/JyeT1hdCPJeLy95tzx5eyI", "https://chat.whatsapp.com/DfffgArbTUu46nqCgmCbE0" ],
    apikey: 'https://izumi-apis.aetherrr.biz.id',
    web: 'https://izumi-apis.aetherrr.biz.id/',
    saluran: '120363401113812327@newsletter', 
    jid: '120363267102694949@g.us', 
    wach: 'https://whatsapp.com/channel/0029VadFS3r89inc7Jjus03W', 
    link: {
     tt: "https://www.tiktok.com/@leooxzy_ganz/"
    },
    sticker: {
      packname: "〆 Kashiwada-San",
      author: "By: Dxyz 〆"
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
         title: config.name,
         body: config.ownername,
         mediaType: 1,
         ...config.thumbnail,
         sourceUrl: config.web,
         renderLargerThumbnail: false
      }
   }
}

global.thumbnail = async (title, body, thumb = {}, url, larger = false, saluran = {}) => {
        return {
           contextInfo: {
               forwardingScore: 1,
               isForwarded: true,
           forwardedNewsletterMessageInfo: {
               newsletterJid: saluran.jid || '',
               serverMessageId: 103,
               newsletterName: saluran.name || ''
           },
           externalAdReply: {
               title: title,
               body: body,
               mediaType: 1,
               ...thumb,
               sourceUrl: url,
               renderLargerThumbnail: larger
           }
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
