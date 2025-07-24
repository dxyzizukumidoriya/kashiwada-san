// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: zerochan-internet.mjs

import fetch from 'node-fetch';
import baileys from '@adiwajshing/baileys';

let izumi = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (!text) throw `> ⚠️ Maaf Kamu Harus Masukan Nama Karakter Dulu Contoh: ${usedPrefix + command} Rokuhira Chihiro`
    conn.sendMessage(m.chat, {
        react: {
            text: '📩',
            key: m.key
        }
    });
    try {
        const response = await (await fetch(`https://izumi-apis.zone.id/search/zerochan?query=${encodeURIComponent(text)}`)).json()
        if (!response.result.length > 0) return m.reply('> ❌ Maaf Foto Nya Gada Yah :v');
        let caption = ` *-* 🔍 [ Search Zerochan ] 🔍 *-*
> 📩 Request: @${m.sender.split('@')[0]}
> 🔍 Cari Karakter: ${text}`
        let push = [];
        for (let i = 0; i < response.result.length; i++) {
            const mediaMessage = await baileys.prepareWAMessageMedia({
                image: {
                    url: response.result[i].downloadLink
                }
            }, {
                upload: conn.waUploadToServer
            });
            push.push({
                body: baileys.proto.Message.InteractiveMessage.Body.fromObject({

                    text: response.result[i].title
                }),
                footer: baileys.proto.Message.InteractiveMessage.Footer.fromObject({
                    text: config.name || 'Rin-Kun'
                }),
                header: baileys.proto.Message.InteractiveMessage.Header.create({
                    title: `Slide ${i + 1}`,
                    subtitle: '',
                    hasMediaAttachment: true,
                    ...mediaMessage
                }),
                nativeFlowMessage: baileys.proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [{}]
                })
            });
        }
        const msg = baileys.generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: baileys.proto.Message.InteractiveMessage.fromObject({
                        body: baileys.proto.Message.InteractiveMessage.Body.create({
                            text: caption
                        }),
                        footer: baileys.proto.Message.InteractiveMessage.Footer.create({
                            text: config.name
                        }),
                        header: baileys.proto.Message.InteractiveMessage.Header.create({
                            hasMediaAttachment: false
                        }),
                        carouselMessage: baileys.proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: push
                        }),
                        contextInfo: {
                            mentionedJid: [m.sender],
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: config.saluran,
                                newsletterName: config.ownername,
                                serverMessageId: 143
                            }
                        }
                    })
                }
            }
        }, {
            quoted: m
        });
        await conn.relayMessage(m.chat, msg.message, {
            messageId: msg.key.id
        });
        conn.sendMessage(m.chat, {
            react: {
                text: '🔥',
                key: m.key
            }
        });
    } catch (e) {
        m.reply('> ❌ Maaf Error Mungkin Lu Kebanyakan Request')
    }
}

izumi.help = ['zrc', 'zerochan'];
izumi.tags = ['internet'];
izumi.command = /^(zrc|zerochan)$/i;

export default izumi;
