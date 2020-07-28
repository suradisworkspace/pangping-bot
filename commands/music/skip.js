const { Command } = require("discord.js-commando");
const deleteMsg = require("../../utils/deleteMsg");
module.exports = class skip extends Command {
  constructor(client) {
    super(client, {
      name: "skip",
      memberName: "skip",
      aliases: ["s"],
      group: "music",
      description: "ข้ามเพลงที่กำลังฟังอยู่",
      details: "skip function.",
      examples: ["!skip", "!s"],
    });
  }

  run(msg) {
    const { queue } = this.client.options;
    const serverQ = queue.get(msg.guild.id);
    if (!msg.member.voice.channel)
      return message.channel.send("จะข้ามเพลงอยู่ในห้องด้วยคับ");
    if (!serverQ) return msg.channel.send("หมดเพลงจะข้ามแล้วคับ");
    serverQ.connection.dispatcher.end();
    return deleteMsg(msg);
  }
};
