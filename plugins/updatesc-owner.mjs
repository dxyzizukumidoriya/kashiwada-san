// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: updatesc-owner.mjs

import fs from 'fs-extra'
import path from 'path'
import simpleGit from 'simple-git'
const {
    exec
} = await import('child_process')

const git = simpleGit()
const repoUrl = 'https://github.com/dxyzizukumidoriya/rin-base-v2.git'
const cloneDir = path.join(process.cwd(), '.temp_update')

let izuku = async (m, {
    conn,
    args,
    command
}) => {
    if (command === 'update') {
        try {
            await m.reply('🔄 Mengambil update dari GitHub...')

            await fs.remove(cloneDir)
            await git.clone(repoUrl, cloneDir)

            // Folder-folder penting yang ingin kita perbarui dari repo
            const foldersToUpdate = ['plugins', 'scrapers', 'lib', 'commands', 'views']
            const filesToUpdate = ['package.json', 'package-lock.json', 'main.js', 'index.js']

            // Update folder satu per satu (tanpa hapus folder lokal)
            for (const folder of foldersToUpdate) {
                const source = path.join(cloneDir, folder)
                if (await fs.pathExists(source)) {
                    await fs.copy(source, path.join(process.cwd(), folder), {
                        overwrite: true
                    })
                }
            }

            // Update file utama
            for (const file of filesToUpdate) {
                const srcFile = path.join(cloneDir, file)
                const destFile = path.join(process.cwd(), file)
                if (await fs.pathExists(srcFile)) {
                    await fs.copy(srcFile, destFile, {
                        overwrite: true
                    })
                }
            }

            await fs.remove(cloneDir)
            await m.reply('📦 Update selesai. Menjalankan npm install...')

            exec('npm install', (err, stdout, stderr) => {
                if (err) return m.reply(`❌ Gagal install dependen:\n${stderr || err.message}`)
                m.reply('✅ Update & install selesai. Merestart bot...')
                setTimeout(() => process.exit(0), 3000)
            })

        } catch (e) {
            console.error(e)
            await m.reply('❌ Gagal update:\n' + e.message)
        }
    }

    if (command === 'setupdate') {
        const jam = Number(args[0])
        if (!jam || isNaN(jam)) return m.reply(`❌ Contoh: *.setupdate 5*`)

        if (global.updateInterval) clearInterval(global.updateInterval)

        global.updateInterval = setInterval(() => {
            console.log(`[AUTO UPDATE] Menjalankan update otomatis tiap ${jam} jam`)
            izuku({
                reply: console.log
            }, {
                conn,
                command: 'update'
            })
        }, jam * 60 * 60 * 1000)

        await m.reply(`✅ Auto update aktif setiap *${jam} jam*.`)
    }
}

izuku.command = ['update', 'setupdate']
izuku.help = ['update', 'setupdate [jam]']
izuku.tags = ['owner']
izuku.owner = true

export default izuku
