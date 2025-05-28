let handler = (m) => m;
handler.before = async (m, { conn }) => {
    if (m.mtype === "interactiveResponseMessage" && m.quoted.fromMe) {
        conn.appendTextMessage(
            m,
            JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id,
            m,
        );
    }
}

module.exports = handler