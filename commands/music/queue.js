const Discord = require("discord.js");
const { Command } = require("discord.js-commando");
const deleteMsg = require("../../utils/deleteMsg");
module.exports = class queue extends Command {
  constructor(client) {
    super(client, {
      name: "queue",
      memberName: "queue",
      aliases: ["q"],
      group: "music",
      description: "ดูเพลงในคิว",
      details: "queue function.",
      examples: ["!queue", "!queue"],
    });
  }

  run(msg) {
    const { queue } = this.client.options;
    const serverQ = queue.get(msg.guild.id);
    if (!serverQ) return msg.channel.send("ไม่มีเพลงในคิวคับ");
    const { songs } = serverQ;
    if (!songs.length) return msg.channel.send("ไม่มีเพลงในคิวคับ");
    const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`คิวเพลง`)
      .addField("กำลังเล่น", `${"`"}${songs[0].title}${"`"}`);

    if (songs.length > 1) {
      embed.addField(
        "อยู่ในคิว",
        songs.slice(1, 11).reduce((acc, cur, index) => {
          return `${acc}${"`"}${index + 1}. ${cur.title}${"`"}\n`;
        }, "")
      );
    }
    msg.channel.send(embed);
    return deleteMsg(msg);
  }
};
