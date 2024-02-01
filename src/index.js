require("./console/watermark");
const {
  Client,
  MessageType,
  GatewayIntentBits,
  Partials,
  Collection,
  PermissionsBitField,
  AttachmentBuilder,
  EmbedBuilder,
  ChannelType,
  ModalBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextInputBuilder,
  TextInputStyle,
  Events,
  InteractionType,
} = require("discord.js");
const fs = require("fs");
const client = new Client({
  intents: [
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
    Partials.ThreadMember,
    Partials.User,
  ],
});

client.commands = new Collection();

const config = require("./settings/config");
const functions = fs
  .readdirSync("./src/functions")
  .filter((file) => file.endsWith(".js"));
const eventFiles = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
  for (file of functions) {
    require(`./functions/${file}`)(client);
  }
  client.handleEvents(eventFiles, "./src/events");
  client.handleCommands(commandFolders, "./src/commands");
  client.login(config.token);
})();

const { RsnChat } = require("rsnchat");
const rsnchat = new RsnChat(`${config.rsnapi}`);

client.on("messageCreate", async (message) => {
  if (message.channel.id === `${config.ChannelID}` && !message.author.bot) {
    try {
      await message.channel.sendTyping();
      const response = await rsnchat[config.endpoint](message.content);
      message.reply(response.message);
    } catch (error) {
      console.error(error);
      message.reply("Error while processing the message.");
    }
  }
});