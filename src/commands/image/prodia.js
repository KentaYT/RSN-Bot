const { SlashCommandBuilder } = require("discord.js");
const { RsnChat } = require("rsnchat");
const config = require("../../settings/config");
const rsnchat = new RsnChat(`${config.rsnapi}`);
const model = `${config.model}`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("prodia")
    .setDescription("Generate a Prodia response based on a prompt")
    .addStringOption(option =>
      option.setName("prompt")
        .setDescription("The main prompt for Prodia")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("negative_prompt")
        .setDescription("The negative prompt for Prodia")
        .setRequired(false)
    ),
  async execute(interaction) {
    const prompt = interaction.options.getString("prompt");
    const negativePrompt = interaction.options.getString("negative_prompt") || "BadDream, (UnrealisticDream:1.3)";

    try {
      await interaction.reply("Generating Image...");

      const response = await rsnchat.prodia(prompt, negativePrompt, model);

      await interaction.editReply({ content: `${response.imageUrl}` });
    } catch (error) {
      console.error(error);
      return interaction.followUp("Image generation failed. Please try again.");
    }
  }
};
