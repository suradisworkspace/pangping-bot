const Discord = require('discord.js')
const { Command } = require('discord.js-commando')
const deleteMsg = require('../../utils/deleteMsg')

module.exports = class skip extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      memberName: 'help',
      aliases: ['h'],
      group: 'basic',
      description: 'ดูคำสั่งต่างๆ',
      details: 'help function.',
      examples: ['!help', '!h', '!commands'],
      args: [
        {
          key: 'command',
          prompt: 'Which command would you like to view the help for?',
          type: 'string',
          default: '',
        },
      ],
    })
  }

  run(msg, args) {
    try {
      const hiddenCommand = ['util', 'commands']
      const groups = this.client.registry.groups
      const commands = this.client.registry.findCommands(args.command, false, msg)
      // case of view all commands
      if (!args.command) {
        const embed = new Discord.MessageEmbed().setColor('RED').setTitle(`คำสั่งทั้งหมดของปังปิ้ง`)

        groups.forEach((item) => {
          if (!hiddenCommand.includes(item.id)) {
            embed.addField(
              item.name,
              item.commands
                .map((command) => {
                  if (!!command.aliases.length) {
                    return `${command.name.replace(command.aliases[0], `__${command.aliases[0]}__`)}`
                  }
                  return command.name
                })
                .join(', ')
            )
          }
        })

        msg.reply(embed)
        return deleteMsg(msg)
      } else {
        if (args.command.toLowerCase() === 'admin') {
          if (!this.client.isOwner(msg.author)) return msg.reply('คุณไม่มีสิทธิคร้าบ')
          const embed = new Discord.MessageEmbed().setColor('RED').setTitle(`คำสั่งทั้งหมดของปังปิ้ง`)
          groups.forEach((item) => {
            embed.addField(
              item.name,
              item.commands
                .map((command) => {
                  if (!!command.aliases.length) {
                    return `${'`'}${command.name.replace(command.aliases[0], `[${command.aliases[0]}]`)}${'`'}`
                  }
                  return `${'`'}${command.name}${'`'}`
                })
                .join(', ')
            )
          })
          msg.reply(embed)
          return deleteMsg(msg)
        }
      }
      return
    } catch (err) {
      console.log('err :>> ', err)
      return
    }
  }
}
