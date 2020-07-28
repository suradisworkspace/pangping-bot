const { Command } = require("discord.js-commando");
const deleteMsg = require("../../utils/deleteMsg");
module.exports = class stop extends Command {
  constructor(client) {
    super(client, {
      name: "stop",
      memberName: "stop",
      group: "music",
      description: "หยุดและล้างคิวเพลงทั้งหมด",
      details: "stop function.",
      examples: ["!stop"],
    });
  }

  run(msg) {
    const { queue } = this.client.options;
    const serverQ = queue.get(msg.guild.id);
    if (!serverQ) {
      return msg.channel.send("ไม่มีเพลงให้หยุดคับ");
    }
    if (!msg.member.voice.channel)
      return msg.channel.send("จะหยุดเพลงอยู่ในห้องด้วยคับ");
    serverQ.autoMode = false;
    serverQ.songs = [];
    serverQ.connection.dispatcher.end();
    return deleteMsg(msg);
    // return msg.channel.send("หยุดเพลงทั้งหมดแล้วคับ");
  }
};
