const memeRunner = require("../../worker/memerunner");
const { Command } = require("discord.js-commando");

module.exports = class jojo extends Command {
  constructor(client) {
    super(client, {
      name: "jojo",
      memberName: "jojo",
      group: "meme",
      description: "jojo.",
      details: "jojo.",
      examples: ["!jojo"],
    });
  }

  async run(msg) {
    const { queue } = this.client.options;
    const serverQ = queue.get(msg.guild.id);
    memeRunner(msg, queue, serverQ, "https://youtu.be/XUhVCoTsBaM");
  }
};
