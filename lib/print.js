let chalk = require('chalk')
let fs = require('fs')

module.exports = async function (m, conn = { user: {} }) {
  let info = "";
  info += chalk.bgCyan(`${m.pushName}`) + chalk.white(' >>> ') + chalk.cyan(`${m.text.startsWith(m.text) ? m.text : m.text}\n`);
  info += chalk.white('>>> ') + chalk.cyan(`Message: ${m.isGroup ? "Group Chat" : "Private Chat"}\n`);
  if (m.isGroup) {
   info += chalk.white('>>> ') + chalk.cyan(`Subject: ${await conn.groupMetadata(m.chat).then(a => a.subject) || 'private'}\n`);
   info += chalk.white('>>> ') + chalk.cyan(`Type: ${m.mtype}\n`);
   info += chalk.white('>>> ') + chalk.cyan(`Sender: ${m.sender}\n`);
   info += chalk.white('>>> ') + chalk.cyan(`Number: ${m.sender.split('@')[0]}\n`);
  } else {
    info += chalk.white('>>> ') + chalk.cyan(`Sender: ${m.sender}\n`);
    info += chalk.white('>>> ') + chalk.cyan(`Number: ${m.sender.split('@')[0]}\n`);
  }
  console.log(info);
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'lib/print.js'"))
  delete require.cache[file]
})