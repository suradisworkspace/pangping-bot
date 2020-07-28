const { Command } = require("discord.js-commando");
module.exports = class runmode extends Command {
  constructor(client) {
    super(client, {
      name: "auto",
      memberName: "auto",
      group: "music",
      description: "เล่นเพลงไปเรื่อยๆ",
      details: "auto function.",
      examples: ["!auto"],
    });
  }

  run(msg) {
    const { queue } = this.client.options;
    const serverQ = queue.get(msg.guild.id);
    if (!serverQ) return msg.channel.send("ไม่มีเพลงให้ออโต้คับ");
    if (!msg.member.voice.channel) return msg.channel.send("อยู่ในห้องด้วยคับ");
    serverQ.autoMode = !serverQ.autoMode;
    if (serverQ.autoMode) {
      return msg.channel.send("เปิดโหมดออโต้แล้วคับ");
    }
    return msg.channel.send("ปิดโหมดออโต้แล้วคับ");
  }
};
