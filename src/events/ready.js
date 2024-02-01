const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {

    client.user.setActivity({
      name: "",
      type: ActivityType.Playing,
    });

    console.log('\u001b[1m\u001b[37m--------------------------------------------\u001b[0m');
    console.log('\u001b[34m%s is online.\u001b[0m', client.user.tag);
    console.log('\u001b[1m\u001b[37m--------------------------------------------\u001b[0m');
  },
};
