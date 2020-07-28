const memeRunner = require("../../worker/memerunner");
const { Command } = require("discord.js-commando");

module.exports = class giorno extends Command {
  constructor(client) {
    super(client, {
      name: "giorno",
      memberName: "giorno",
      group: "meme",
      description: "giorno.",
      details: "giorno.",
      examples: ["!giorno"],
    });
  }

  async run(msg) {
    const { queue } = this.client.options;
    const serverQ = queue.get(msg.guild.id);
    memeRunner(msg, queue, serverQ, "https://youtu.be/2MtOpB5LlUA");
  }
};
