// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: theme-anime.mjs

let izumi = async (m, {
    text
}) => {
    if (!text) throw '> ⚠️ Mau Require Theme Anime Apa?';
    try {
        const {
            result
        } = await (await fetch(`https://izumiiiiiiii.dpdns.org/anime/themesrc?query=${text}`)).json();
        let cap = `> - - - - - - [ Search Theme ] - - - - - - -
> ☘️ Opening: ${result.openings.map((a, i) => `\n> 🔥${i + 1} ${a}`)}

> 🍞 Ending: ${result.endings.map((a, i) => `\n> 🔥${i + 1} ${a}`)}`;

        await m.reply(cap);
    } catch (e) {
        m.reply('> ❌ Maaf Error Mungkin Lu Kebanyakan Request');
        console.error('Error', e);
    };
};

izumi.help = ['theme', 'thm'];
izumi.command = ['theme', 'thm'];
izumi.tags = ['anime'];

export default izumi;
