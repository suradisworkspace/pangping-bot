module.exports = (guild, userId) => {
  const userMember = guild.members.cache.get(userId)
  if (!!userMember && (guild.ownerID === userId || userMember.hasPermission('ADMINISTRATOR'))) {
    return true
  }
  return false
}
