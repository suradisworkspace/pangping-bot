const memeRunner = require('../../worker/memerunner')
const { Command } = require('discord.js-commando')
const { get } = require('lodash')
const { createKeywordTypeNode } = require('typescript')

module.exports = class unknowCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unknown-command',
      group: 'util',
      memberName: 'unknown-command',
      description: 'Displays help information for when an unknown command is used.',
      examples: ['unknown-command kickeverybodyever'],
      unknown: true,
      hidden: true,
    })
  }

  async run(msg) {
    const command = msg.content.split(' ')[0].replace(msg.argString, '')
    const guildCustomCommand = await msg.guild.settings.get('customCommands')
    const customCommand = get(guildCustomCommand, [command])
    if (!!customCommand) {
      const { queue } = this.client.options
      const serverQ = queue.get(msg.guild.id)
      return memeRunner(msg, queue, serverQ, customCommand)
    }
    return msg.reply(
      `ไม่พบคำสั่ง กรุณาใช้ ${msg.anyUsage(
        'help',
        msg.guild ? undefined : null,
        msg.guild ? undefined : null
      )} เพื่อดูคำสั่งทั้งหมด`
    )
  }

  // run(msg) {
  //   return msg.reply(
  //     `Unknown command. Use ${msg.anyUsage(
  //       'help',
  //       msg.guild ? undefined : null,
  //       msg.guild ? undefined : null
  //     )} to view the command list.`
  //   )
  // }
}
