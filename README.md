
<p align="center">
  <img src="https://files.catbox.moe/i6ni7d.jpg" width="250"/>
</p>

<h1 align="center">Kashiwada-San - WhatsApp Bot</h1>


---

## 👤 Owner

> GitHub: [dxyzizukumidoriya](https://github.com/dxyzizukumidoriya.png)  
> Project: **Kashiwada-San WhatsApp Bot**

---

> Bot WhatsApp modular yang kuat menggunakan JavaScript, dibuat dengan sistem plugin untuk fleksibilitas maksimal. Terinspirasi oleh **Kashiwada-san** dari *Kao ni Denai Kashiwada-san to Kao ni Deru Oota-kun*, bot ini menghadirkan semangat dan disiplin dalam obrolan Anda!

---

## 📌 Features

- Arsitektur berbasis plugin
- Ditulis dalam JavaScript
- Kompatibel dengan CommonJS & ESModule
- Pembuatan perintah yang mudah
- Terinspirasi oleh karakter anime kashiwada

---

## ⚙️ config.js

```javascript
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

```

## ⚙️ Install
```bash
$ git clone https://github.com/FrankXz12/HanakoBotz
$ cd HanakoBotz
$ npm install
$ npm start
```

## 🌐 Commonjs Example File .js

## 🧠 Example Plugin (No Regex)

```javascript
let handler = async (m, { conn, text, Func, config, Scraper }) => {
  // code
};

handler.command = ['expired', 'exp'];
handler.help = ['expired', 'exp'];
handler.tags = ['run'];
handler.limit = false;
handler.loading = false;
hendler.mods = false
handler.rowner = false;
handler.group = false;
handler.premium = false;
handler.admin = false;
handler.register = false;
handler.botAdmin = false;

module.exports = handler;
```

---

## ⚡ Example Plugin (With Regex)

```javascript
let handler = async (m, { conn, text, Func, config, Scraper }) => {
  // code
};

handler.command = /^(expired|exp)$/i;
handler.help = ['expired', 'exp'];
handler.tags = ['run'];
handler.limit = false;
handler.loading = false;
hendler.mods = false
handler.rowner = false;
handler.group = false;
handler.premium = false;
handler.admin = false;
handler.register = false;
handler.botAdmin = false;

module.exports = handler;
```

---

## 🌐 ECMAScript Module Example File .mjs

## 🧠 Example Plugin (No Regex)

```javascript
let handler = async (m, { conn, text, Func, config, Scraper }) => {
  // code
};

handler.command = ['expired', 'exp'];
handler.help = ['expired', 'exp'];
handler.tags = ['run'];
handler.limit = false;
handler.loading = false;
hendler.mods = false
handler.rowner = false;
handler.group = false;
handler.premium = false;
handler.admin = false;
handler.register = false;
handler.botAdmin = false;

export default handler;
```

---

## ⚡ Example Plugin (With Regex)

```javascript
let handler = async (m, { conn, text, Func, config, Scraper }) => {
  // code
};

handler.command = /^(expired|exp)$/i;
handler.help = ['expired', 'exp'];
handler.tags = ['run'];
handler.limit = false;
handler.loading = false;
hendler.mods = false
handler.rowner = false;
handler.group = false;
handler.premium = false;
handler.admin = false;
handler.register = false;
handler.botAdmin = false;

export default handler;
```

---

## 💡 Command Fitur Plugin/Scrape

```Plugin
.plugin - buat liat list plugins
.plugin --add file/file.js / .plugin --add file/file.mjs - Buat Add Fitur
.plugin --get file/file.js / .plugin --get file/file.mjs - Buat Get Fitur
.plugin --delete file/file.js / .plugin --delete file/file.mjs - Buat Delete Fitur
```

---

## 💡 Menu Command

```
.menu       - Show main menu
.menu all   - Show all commands
.menu tags  - Show commands by tags
```

---


## 👥 All Contributors
[![Tiooxy](https://github.com/Tiooxy.png?size=100)](https://github.com/Tiooxy) | [![AndhikaGG](https://github.com/AndhikaGG.png?size=100)](https://github.com/AndhikaGG)  
---|---|---  
[Tiooxy](https://github.com/Tiooxy) | [AndhikaGG](https://github.com/AndhikaGG)  
Base Original | Penyumbang fitur

---

> *"Hmmm...."*
