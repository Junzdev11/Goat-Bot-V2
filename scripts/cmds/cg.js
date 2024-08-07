//buggy lol
module.exports = {
  config: {
    name: "cg",
    author: "",
    role: 0,
    category: "test"
  },
  onStart: async function ({ message, args, usersData, api, event }) {
    const id = event.senderID;
    const tag = await usersData.getName(id);

    const colorMap = {
      white: '⬜',
      black: '⬛',
      green: '🟩',
      red: '🟥',
      yellow: '🟨',
      brown: '🟫',
      '⬜': '⬜',
      '⬛': '⬛',
      '🟩': '🟩',
      '🟥': '🟥',
      '🟨': '🟨',
      '🟫': '🟫'
    };

    const chose = args[0];
    const bet = parseInt(args[1]);

    if (!colorMap.hasOwnProperty(chose) || isNaN(bet)) {
      const validChoices = Object.keys(colorMap).filter((key, index) => index < 6).concat(Object.values(colorMap).slice(0, 6)).join(', ');
      return message.reply(`Please provide a valid color name or emoji and bet amount.\nExample: ${(await global.utils.getPrefix(event.threadID))}${this.config.name} red 1000\n\nValid choices:\n${validChoices}`);
    }

    const user = await usersData.get(id);

    if (bet < 50) {
      return message.reply(`The minimum bet amount is 50.`);
    }
    
    if (user.money < bet || user.money <= 0) {
      return message.reply(`You don't have enough money to play this game.`);
    }

    const rands = cg();
    const chosenEmoji = colorMap[chose];
    const match = rands.split('').filter(c => c === chosenEmoji).length;

    if (match >= 1) {
      const win = bet * match;
      user.money += win;
      await usersData.set(id, user);
      message.reply({
        body: `🎉 Congratulations ${tag}, You won $${win}\nDraw Result: ${rands}`,
        mentions: [{ id, tag }]
      });
    } else {
      user.money -= bet;
      await usersData.set(id, user);
      message.reply({
        body: `Sorry ${tag}, you lost ${bet}.\nDraw Result: ${rands}`,
        mentions: [{ id, tag }]
      });
    }
  }
};

function cg() {
  const colors = ['⬜', '⬛', '🟩', '🟥', '🟨', '🟫'];
  return Array.from({ length: 3 }, () => colors[Math.floor(Math.random() * colors.length)]).join('');
}