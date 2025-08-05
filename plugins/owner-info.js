// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: owner-info.js

const baileys = require("@adiwajshing/baileys");

let pan = `> ☘️ Kashiwada: Nih Nomor Owner Nya....`;

const izumi = {
    command: ['owner', 'own', 'pemilik'],
    help: ['owner', 'own', 'pemilik'],
    tags: ['info'],
    async code(m, {
        conn
    }) {
        async function image(url) {
            const {
                imageMessage
            } = await baileys.generateWAMessageContent({
                image: {
                    url
                }
            }, {
                upload: conn.waUploadToServer
            });
            return imageMessage;
        }

        let msg = baileys.generateWAMessageFromContent(
            m.chat, {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            body: {
                                text: pan
                            },
                            carouselMessage: {
                                cards: await Promise.all(config.owner.map(async (a, i) => ({
                                    header: baileys.proto.Message.InteractiveMessage.Header.create({
                                        ...(await baileys.prepareWAMessageMedia({
                                            image: {
                                                url: config.menu.thumbnailUrl
                                            }
                                        }, {
                                            upload: conn.waUploadToServer
                                        })),
                                        title: '',
                                        gifPlayback: true,
                                        subtitle: config.ownername,
                                        hasMediaAttachment: false
                                    }),
                                    body: {
                                        text: `> 👤 Owner: ${i + 1},
> ⚠️Jangan Spam Chat/Telpon,
> ⚠️Jangan Video Call,`
                                    },
                                    nativeFlowMessage: {
                                        buttons: [{
                                            name: "cta_url",
                                            buttonParamsJson: JSON.stringify({
                                                display_text: `👤 Chat Owner ( ${config.ownername} )`,
                                                url: `https://wa.me/${a}`,
                                                merchant_url: `https://wa.me/${a}`
                                            })
                                        }]
                                    }
                                }))),
                                messageVersion: 1
                            }
                        }
                    }
                }
            }, {
                quoted: m
            }
        );

        await conn.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id
        });
    }
}

module.exports = izumi;
