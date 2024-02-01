const fs = require("node:fs");
const config = require("../settings/config.js");
const { REST, Routes } = require("discord.js");

module.exports = (client) => {
  client.handleCommands = async (commandFolders, path) => {
    client.commandArray = [];

    for (folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`${path}/${folder}`)
        .filter((file) => file.endsWith(".js"));
      for (const file of commandFiles) {
        const command = require(`../commands/${folder}/${file}`);

        client.commands.set(command.data.name, command);
        client.commandArray.push(command.data.toJSON());
      }
    }

    const rest = new REST({
      version: "10",
    }).setToken(config.token);

    (async () => {
      try {
        console.log(
          "\u001b[1m\u001b[31m--------------------------------------------\u001b[0m"
        );
        console.log(
          "\u001b[32m[⚠️ ] Refreshing Application (/) commands.\u001b[0m"
        );

        await rest.put(Routes.applicationCommands(config.clientID), {
          body: client.commandArray,
        });

        console.log("[✅ ] Reloaded application (/) commands.");
      } catch (error) {
        console.error(error);
      }
    })();
  };
};
