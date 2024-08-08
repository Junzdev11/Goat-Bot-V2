const axios = require('axios');
module.exports = {
  config: {
    name: "bank",
    author: "",
    role: 0,
    shortDescription: "A simple bank command that has lots of features",
    category: "Economy"
  },
  onStart: async function ({ message, usersData, args, event, commandName }) {
    const id = event.senderID;
    const user = await usersData.get(id);
    if (args[0] && args[0].toLowerCase() === "deposit") {
      const amount = parseInt(args[1]);
      if (isNaN(amount) || amount <= 0) {
     return message.reply("Please provide a valid deposit amount.");
      }
      if (user.money < amount) {
   return message.reply("You don't have enough balance to deposit that amount.");
      }
}      
   const pr = args.join(" ");
   const prompt = pr.toLowerCase().includes("register") ? pr : pr.toLowerCase(); 
    try {
      const name = await usersData.getName(id);
      const { data } = await axios.post("https://apiv1-k60p.onrender.com/bank", {
        name,
        id,
        prompt
      });
      if (data.password) {
        const { messageID } = await message.reply(`React "😮" to to confirm view the password\n\nHere's your password: *******\n`);        global.GoatBot.onReaction.set(messageID, {
          commandName,
          messageID,
          pass: data.password,
senderID: event.senderID
        });
      }
      if (data.status === 2) {
        user.money += data.value;
      } else if (data.status === 1) {
        user.money -= parseInt(args[1]);
      }
      await usersData.set(id, user);      message.reply(data.result?.replace(/{p}/g, await global.utils.getPrefix(event.threadID) + this.config.name));
    } catch (error) {
      message.reply(error.message);
    }

  },

  onReaction: async function ({ message, api, Reaction, event }) {
    const { messageID, pass, senderID } = Reaction;
if(event.userID !== senderID) return;
    if (event.reaction === "😮") {
      api.editMessage(`Note: please secure your password to avoid getting robbed by some users\n\nHere's your bank password: ${pass}`, messageID);
    }
  }
};