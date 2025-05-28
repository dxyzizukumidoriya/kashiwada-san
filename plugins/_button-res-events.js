let handler = (m) => m;
handler.before = async (m, { conn }) => {
    if (m.mtype === "interactiveResponseMessage" && m.quoted.fromMe) {
        conn.appendTextMessage(
            m,
            JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id,
            m,
        );
    } else if (m.mtype === "buttonsResponseMessage" && m.quoted.fromMe) {
        conn.appendTextMessage(
            m,
            m.msg.selectedButtonId,
            m,
        );
    } else if (m.mtype === "templateButtonReplyMessage" && m.quoted.fromMe) {
        conn.appendTextMessage(
            m,
            m.msg.selectedId,
            m,
        );
    }
}

module.exports = handler
