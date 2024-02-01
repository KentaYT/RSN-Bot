const { SlashCommandBuilder } = require("discord.js");
const { RsnChat } = require("rsnchat");
const config = require("../../settings/config");
const rsnchat = new RsnChat(`${config.rsnapi}`);
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("absolutebeauty")
    .setDescription("Generate a absolutebeauty response based on a prompt")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("The main prompt for absolutebeauty")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("negative_prompt")
        .setDescription("The negative prompt for absolutebeauty")
        .setRequired(false)
    ),
  async execute(interaction) {
    const prompt = interaction.options.getString("prompt");
    const negativePrompt =
      interaction.options.getString("negative_prompt") ||
      "BadDream, (UnrealisticDream:1.3)";

    try {
      await interaction.reply("Generating Image...");

      const response = await rsnchat.absolutebeauty(prompt, negativePrompt);

      const base64Image = response.image;
      const imageBuffer = Buffer.from(base64Image, "base64");

      const imagePath = `./generatedImage_${Date.now()}.png`;
      fs.writeFileSync(imagePath, imageBuffer);
      await interaction.editReply({ content: ``, files: [imagePath] });

      setTimeout(() => {
        fs.unlinkSync(imagePath);
      }, 5000);
    } catch (error) {
      console.error(error);
      return interaction.followUp("Image generation failed. Please try again.");
    }
  },
};
