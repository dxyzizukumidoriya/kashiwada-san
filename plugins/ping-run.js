// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: ping-run.js

const izumi = {
    command: ['ping'],
    help: ['ping'],
    tags: ['run'],
    async code(m) {
        const start = new Date().getTime();
        const end = new Date().getTime();

        const responseTime = end - start

        m.reply(Func.Styles(`☘️ Pong!\nResponse time: ${responseTime}ms`));
    }
};

module.exports = izumi;
