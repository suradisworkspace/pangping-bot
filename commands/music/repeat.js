const { Command } = require("discord.js-commando");
const deleteMsg = require("../../utils/deleteMsg");
module.exports = class repeat extends Command {
  constructor(client) {
    super(client, {
      name: "repeat",
      memberName: "repeat",
      aliases: ["r"],
      group: "music",
      description: "เพิ่มเพลงที่เล่นอยู่ในปัจจุไปในคิวเพลงถัดไป",
      details: "repeat function.",
      examples: ["!repeat", "!r"],
    });
  }

  run(msg) {
    const { queue } = this.client.options;
    const serverQ = queue.get(msg.guild.id);
    if (!serverQ) return msg.channel.send("ไม่มีเพลงให้เล่นซ้ำคับ");
    if (!serverQ.songs.length)
      return msg.channel.send("ไม่มีเพลงให้เล่นซ้ำคับ");
    if (!msg.member.voice.channel) return msg.channel.send("อยู่ในห้องด้วยคับ");
    const song = { ...serverQ.songs[0] };
    serverQ.songs = [song, ...serverQ.songs];
    msg.channel.send(
      `เพิ่มเพลง ${"`"}${song.title}${"`"} ไปในคิวเพลงถัดไปแล้วคับ`
    );
    return deleteMsg(msg);
  }
};
