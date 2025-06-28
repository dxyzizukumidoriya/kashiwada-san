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
        const demonSlayerHeader = `*Hi there* I'm *${config.name}* Here the features are few/many because the owner is not yet old, Sometimes my hobby is watching anime, watching illegal streaming anime`;
        const teksdx = `If there is an error, please contact the owner at the number: ${config.owner.map((ownum => 'https://wa.me/' + ownum)).join(', ')}`;

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

${teksdx}`;

            await conn.sendClearTime(m.chat, {
                document: {
                    url: "https://www.npmjs.com/"
                },
                mimetype: "application/msword",
                fileName: config.ownername + ' / ' + config.name,
                fileLength: 10,
                pageCount: 10,
                caption: Styles(caption),
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
        } else if (text === "list") {
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

            // Format tags menu  
            const tagsList = allTags.map((tag, i) =>
                `│ .menu ${tag.charAt(0).toUpperCase() + tag.slice(1)}`
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

${teksdx}`;

            await conn.sendClearTime(m.chat, {
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
                caption: Styles(caption),
            }, { quoted: m });
        } else if (text) {
            await conn.delay(2000)
            const tags = text.split(/[,\s]+/).filter(tag => tag.trim() !== '');
            const filteredCommands = getPluginsByTags(tags);

            const commandsSection = `
╭───────[ 📜 ${tags.join(', ').toUpperCase()} COMMANDS ]───────╮
${filteredCommands}
╰─────────────────────────────╯
`;

            const caption = `${demonSlayerHeader}
${botInfoSection}
${userInfoSection}
${commandsSection}

${teksdx}`;

            await conn.sendClearTime(m.chat, {
                document: {
                    url: "https://www.npmjs.com/"
                },
                mimetype: "application/msword",
                fileName: config.ownername + ' / ' + config.name,
                fileLength: 10,
                pageCount: 10,
                caption: Styles(caption),
                footer: `© ${config.name}`,
                contextInfo: {
                    mentionedJid: [...conn.parseMention(caption)],
                    isForwarded: true,
                    externalAdReply: {
                        mediaType: 1,
                        title: "© " + config.name + " | Playground",
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
            const defaultCommands = `

╭───────────[ 🏷️ MENU ]──────────╮
│ Kalau Mau Ke Menu List Ke .menu list 
│ Ketik ${usedPrefix}menu <tag> untuk melihat
│ command dengan tag tertentu
│ Contoh: ${usedPrefix}menu download
╰──────────────────────────────────╯`;

            const caption = `${demonSlayerHeader}

${botInfoSection}
${userInfoSection}
${defaultCommands}

${teksdx}`;

            await conn.sendClearTime(m.chat, {
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
                caption: Styles(caption),
            }, { quoted: m });
        }
    }
};

function Styles(text, style = 1) {
    var xStr = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
    var yStr = Object.freeze({
      1: "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890",
    });
    var replacer = [];
    xStr.map((v, i) =>
      replacer.push({
        original: v,
        convert: yStr[style].split("")[i],
      }),
    );
    var str = text.toLowerCase().split("");
    var output = [];
    str.map((v) => {
      const find = replacer.find((x) => x.original == v);
      find ? output.push(find.convert) : output.push(v);
    });
    return output.join("");
}

module.exports = rin;
