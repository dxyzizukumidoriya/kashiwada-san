// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: dxyz
// ⚡ Plugin: menu.js

let rin = {
    help: [],
    command: ["menu", "rinmenu"],
    tags: ["run"],
    code: async (m, {
        conn,
        text,
        isROwner,
        usedPrefix,
        command
    }) => {
        function getPluginsByTags(selectedTags = []) {
            const tagCount = {};
            const tagHelpMapping = {};

            const selectedTagsLower = selectedTags.map(tag => tag.toLowerCase());

            Object.keys(pg.plugins)
                .filter(pluginName => !pg.plugins[pluginName].disabled)
                .forEach(pluginName => {
                    const plugin = pg.plugins[pluginName];
                    const tagsArray = Array.isArray(plugin.tags) ? plugin.tags : [];
                    const helpArray = Array.isArray(plugin.help) ? plugin.help : [plugin.help];

                    tagsArray.forEach(tag => {
                        if (!tag) return;

                        const tagLower = tag.toLowerCase();

                        if (selectedTags.length > 0 && !selectedTagsLower.includes(tagLower)) {
                            return;
                        }

                        if (tagCount[tag]) {
                            tagCount[tag]++;
                            tagHelpMapping[tag].push(...helpArray);
                        } else {
                            tagCount[tag] = 1;
                            tagHelpMapping[tag] = [...helpArray];
                        }
                    });
                });

            if (Object.keys(tagCount).length === 0) {
                return "No plugins found with the specified tags.";
            }

            return Object.keys(tagCount)
                .map(tag => {
                    const helpList = tagHelpMapping[tag]
                        .map((helpItem, index) => `│ *( ${index + 1} )* ${usedPrefix + helpItem}`)
                        .join("\n");

                    return `╭───────────[ ${tag.toUpperCase()} ]──────────╮
${helpList}
╰──────────────────────────────────╯`;
                })
                .join("\n\n");
        }

        // User info
        const user = {
            name: m.pushName || 'User',
            number: (m.sender || '').split('@')[0] || '62xxx-xxx-xxx',
            limit: db.data.users[m.sender].limit,
            status: isROwner ? 'Pemilik' : 'Orang Bisaa'
        };

        // Bot info - Handle config.owner properly
        const botNumber = Array.isArray(config.owner) ?
            config.owner[0] :
            typeof config.owner === 'string' ?
            config.owner :
            '62xxx-xxx-xxx';
        const cleanBotNumber = botNumber.replace('@s.whatsapp.net', '').split('@')[0];

        const botInfo = {
            name: config.name || 'rin-okumura-bot',
            number: cleanBotNumber
        };

        // Main menu design
        const demonSlayerHeader = `
╔════════════════════════╗
│  ✧🔥 Blue Exorcist 🔥✧  │
╚════════════════════════╝

[1] (•̀ᴗ•́)و ̑̑  🔥 RIN 🔥  
    🔥=======> ︻デ═一  
    [🗡️ Kurikara - Flaming Sword]  

[2] (¬_¬ )ﾉ 🔫 YUKIO 🔫  
    ▄︻̷̿┻̿═━一⁍⁍⁍  
    [🔫 Dual Pistols - Exorcist Mode]  
`;

        const botInfoSection = `
╭───────────[ 🤖 BOT INFO ]──────────╮
│ 🏷️ Name: ${botInfo.name}          
│ 📞 Number: ${botInfo.number}          
╰──────────────────────────────────╯
`;

        const userInfoSection = `
╭───────────[ 👤 USER INFO ]─────────╮
│ 🏷️ Name: ${user.name}                     
│ 📞 Number: ${user.number}          
│ 🎚️ Limit: ${user.limit}                 
│ 🏅 Status: ${user.status}         
╰──────────────────────────────────╯
`;

        if (text === "all") {
            await conn.delay(2000)
            const allCommands = getPluginsByTags();

            const commandsSection = `
╭───────────[ 📜 COMMANDS ]──────────╮
${allCommands}
╰──────────────────────────────────╯
`;

            const caption = `${demonSlayerHeader}
${botInfoSection}
${userInfoSection}
${commandsSection}

✨✧･ﾟ: *✧･ﾟ:* SYSTEM LOADED *:･ﾟ✧*:･ﾟ✧✨`;

            await conn.sendMessage(m.chat, {
                text: caption,
                footer: `© ${config.name}`,
                contextInfo: {
                    mentionedJid: [...conn.parseMention(caption)],
                    isForwarded: true,
                    externalAdReply: {
                        mediaType: 1,
                        title: "© " + config.name + " | Demon Mode",
                        body: config.owner + ' / ' + config.name,
                        ...config.menu,
                        sourceUrl: config.link.tt,
                        renderLargerThumbnail: true,
                    },
                },
            }, {
                quoted: m
            });
        } else if (text) {
            await conn.delay(2000)
            const tags = text.split(/[,\s]+/).filter(tag => tag.trim() !== '');
            const filteredCommands = getPluginsByTags(tags);

            const commandsSection = `
╭───────────[ 📜 ${tags.join(', ').toUpperCase()} COMMANDS ]──────────╮
${filteredCommands}
╰──────────────────────────────────╯
`;

            const caption = `${demonSlayerHeader}
${botInfoSection}
${userInfoSection}
${commandsSection}

✨✧･ﾟ: *✧･ﾟ:* SYSTEM LOADED *:･ﾟ✧*:･ﾟ✧✨`;

            await conn.sendMessage(m.chat, {
                text: caption,
                footer: `© ${config.name}`,
                contextInfo: {
                    mentionedJid: [...conn.parseMention(caption)],
                    isForwarded: true,
                    externalAdReply: {
                        mediaType: 1,
                        title: "© " + config.name + " | Demon Slayer Mode",
                        body: config.owner + ' / ' + config.name,
                        ...config.menu,
                        sourceUrl: config.link.tt,
                        renderLargerThumbnail: true,
                    },
                },
            }, {
                quoted: m
            });
        } else {
            const allTags = [];
            Object.keys(pg.plugins).forEach(pluginName => {
                if (!pg.plugins[pluginName].disabled && pg.plugins[pluginName].tags) {
                    pg.plugins[pluginName].tags.forEach(tag => {
                        if (tag && !allTags.includes(tag.toLowerCase())) {
                            allTags.push(tag.toLowerCase());
                        }
                    });
                }
            });

            let sections = [{
                type: "list",
                title: "✧🔥 BLUE EXORCIST MENU 🔥✧",
                value: [{
                    headers: "– 乂 MAIN COMMANDS –",
                    rows: [{
                            headers: "ALL COMMANDS",
                            title: "- Lihat semua perintah yang tersedia",
                            command: `${usedPrefix}menu all`
                        },
                        {
                            headers: "SCRIPT",
                            title: "- Lihat informasi script bot",
                            command: `${usedPrefix}sc`
                        }
                    ]
                }, {
                    headers: "– 乂 COMMAND TAGS –",
                    rows: allTags.slice(0, 200).map(tag => ({
                        headers: tag.toUpperCase(),
                        title: `- Perintah dengan tag ${tag.toUpperCase()}`,
                        command: `${usedPrefix}menu ${tag.toUpperCase()}`
                    }))
                }]
            }];

            // Format tags menu  
            const tagsList = allTags.map((tag, i) =>
                `│ ${i+1}. [🏷️] ${tag.charAt(0).toUpperCase() + tag.slice(1)}`
            ).join('\n');

            const defaultCommands = `

╭───────────[ 🏷️ MENU TAGS ]──────────╮
${tagsList}
│
│ Ketik ${usedPrefix}menu <tag> untuk melihat
│ command dengan tag tertentu
│ Contoh: ${usedPrefix}menu download
╰──────────────────────────────────╯`;

            const caption = `${demonSlayerHeader}

${botInfoSection}
${userInfoSection}
${defaultCommands}

✨✧･ﾟ: ✧･ﾟ: SYSTEM LOADED :･ﾟ✧:･ﾟ✧✨`;

            await conn.sendButton(m.chat, sections, m, {
                document: {
                    url: "https://www.npmjs.com/"
                },
                mimetype: "application/msword",
                fileName: config.ownername + ' / ' + config.name,
                fileLength: 10,
                pageCount: 10,
                contextInfo: {
                    mentionedJid: [...conn.parseMention(caption)],
                    isForwarded: true,
                    externalAdReply: {
                        mediaType: 1,
                        title: "© " + config.name + " | Playground",
                        body: "👨‍💻 Bot WhatsApp - Simple",
                        ...config.menu,
                        sourceUrl: config.link.tt,
                        renderLargerThumbnail: true,
                    },
                },
                caption,
                footer: config.name,
            });
        }
    }
};

module.exports = rin;
