module.exports = (msg) => {
  if (msg.guild.me.hasPermission('MANAGE_MESSAGES')) {
    return msg.delete()
  }
  return null
}
