const memeRunner = require("../../worker/memerunner");
const { Command } = require("discord.js-commando");

module.exports = class jojo extends Command {
  constructor(client) {
    super(client, {
      name: "jooooojo",
      memberName: "jooooojo",
      group: "meme",
      description: "jooooojo.",
      details: "jooooojo.",
      examples: ["!jooooojo"],
    });
  }

  async run(msg) {
    const { queue } = this.client.options;
    const serverQ = queue.get(msg.guild.id);
    memeRunner(msg, queue, serverQ, "https://youtu.be/lE7Q9LWwtaE");
  }
};
