module.exports = (guild, userId) => {
  const userMember = guild.members.cache.get(userId)
  console.log('userMember :>> ', userMember)
  if (!!userMember && (guild.ownerID === userId || userMember.hasPermission('ADMINISTRATOR'))) {
    return true
  }
  return false
}
