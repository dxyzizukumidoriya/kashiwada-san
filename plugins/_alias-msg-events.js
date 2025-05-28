
const {
    generateWAMessage,
    areJidsSameUser,
    proto
} = require("@adiwajshing/baileys");

let handler = (m) => m;
handler.before = async (m, { conn }) => {
    conn.sendAliasMessage = async (jid, mess = {}, alias = {}, quoted = null) => {
        function check(arr) {
            if (!Array.isArray(arr)) {
                return false;
            }
            if (!arr.length) {
                return false;
            }
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                if (typeof item !== "object" || item === null) {
                    return false;
                }
                if (!Object.prototype.hasOwnProperty.call(item, "alias")) {
                    return false;
                }
                if (!Array.isArray(item.alias) && typeof item.alias !== "string") {
                    return false;
                }
                if (
                    Object.prototype.hasOwnProperty.call(item, "response") &&
                    typeof item.response !== "string"
                ) {
                    return false;
                }
                if (
                    Object.prototype.hasOwnProperty.call(item, "eval") &&
                    typeof item.eval !== "string"
                ) {
                    return false;
                }
            }
            return true;
        }
        if (!check(alias)) return "Alias format is not valid!";
        let message = await conn.sendMessage(jid, mess, {
            quoted: quoted
        });
        if (typeof conn.alias[jid] === "undefined")
            conn.alias[jid] = {};
        conn.alias[jid][message.key.id] = {
            chat: jid,
            id: message.key.id,
            alias,
        };
        return message;
    };
    conn.sendInputMessage = async (
        jid,
        mess = {},
        target = "all",
        timeout = 60000,
        quoted = null,
    ) => {
        let time = Date.now();
        let message = await conn.sendMessage(jid, mess, {
            quoted: quoted
        });
        if (typeof conn.input[jid] === "undefined")
            conn.input[jid] = {};
        conn.input[jid][message.key.id] = {
            chat: jid,
            id: message.key.id,
            target,
        };

        while (
            Date.now() - time < timeout &&
            !conn.input[jid][message.key.id].hasOwnProperty("input")
        )
            await conn.delay(500);

        return conn.input[jid][message.key.id].input;
    };

    if (typeof conn.alias === "undefined")
        conn.alias = {};
    if (typeof conn.input === "undefined")
        conn.input = {};

    if (m.quoted) {
        const quotedId = m.quoted.id;
        if (
            conn.input[m.chat]?.[quotedId]?.target === "all" ||
            conn.input[m.chat]?.[quotedId]?.target === m.sender
        ) {
            conn.input[m.chat][quotedId].input = m.text;
        }
        if (conn.alias.hasOwnProperty(m.chat)) {
            if (conn.alias[m.chat].hasOwnProperty(quotedId)) {
                for (const aliasObj of conn.alias[m.chat][quotedId].alias) {
                    if (
                        Array.isArray(aliasObj.alias) &&
                        !aliasObj.alias
                        .map((v) => v.toLowerCase())
                        .includes(m.text.toLowerCase())
                    )
                        continue;
                    else if (aliasObj.alias.toLowerCase() !== m.text.toLowerCase())
                        continue;
                    else {
                        if (aliasObj.response)
                            await m.emit(aliasObj.response);
                        if (aliasObj.eval) await eval(aliasObj.eval);
                    }
                }
            }
        }
    }
};

module.exports = handler