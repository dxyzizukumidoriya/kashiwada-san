import axios from 'axios'

const apiUrl = "https://api.github.com/repos/dxyzizukumidoriya/rin-base-v2"

let rin = async (m, { conn }) => {
    const {
        data
    } = await axios.get(apiUrl)

    function ago(time) {
        const date = new Date(time);
        const timestamp = date.getTime();
        const now = Date.now();
        const seconds = Math.floor((now - timestamp) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(seconds / 3600);
        const days = Math.floor(seconds / 86400);
        const months = Math.floor(seconds / 2592000);
        const years = Math.floor(seconds / 31536000);

        if (seconds < 60) {
            return seconds === 1 ? "1 detik yang lalu" : seconds + " detik yang lalu";
        } else if (minutes < 60) {
            return minutes === 1 ? "1 menit yang lalu" : minutes + " menit yang lalu";
        } else if (hours < 24) {
            return hours === 1 ? "1 jam yang lalu" : hours + " jam yang lalu";
        } else if (days < 30) {
            return days === 1 ? "1 hari yang lalu" : days + " hari yang lalu";
        } else if (months < 12) {
            return months === 1 ? "1 bulan yang lalu" : months + " bulan yang lalu";
        } else {
            return years === 1 ? "1 tahun yang lalu" : years + " tahun yang lalu";
        }
    }

    m.reply(`
┌───────────────────────────
│  🏷️  *SCRIPT DETAILS*  
├───────────────────────────
│  🧩  *Name*: ${data.name}
│  👤  *Author* : ${data.owner.login}
│  👥  *Base* : Tiooxy
│
│  🕒  *Created*: ${ago(data.created_at)}
│  🔄  *Updated*: ${ago(data.updated_at)}
│  🚀  *Published*: ${ago(data.pushed_at)}
│
│  🔗  *URL*: ${data.html_url}
└───────────────────────────`)
    await conn.delay(2000)
    const {
        data: download
    } = await axios.get(apiUrl + '/zipball', {
        responseType: 'arraybuffer'
    })

    await conn.sendMessage(m.chat, {
        document: download,
        fileName: `${data.name}-${data.owner.login}.zip`,
        caption: 'Nih Script Nya Tuan',
        mimetype: 'application/zip'
    }, {
        quoted: m
    })
}

rin.help = ['sc', 'script'];
rin.tags = ['info'];
rin.command = /^(sc|script)$/i;

export default rin;
