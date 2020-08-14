import axios from '~/helpers/axiosDiscord'
export type UserResponse = {
  id: string
  username: string
  discriminator: string
  avatar: string
  bot?: string
  system?: string
  mfa_enabled?: string
  locale?: string
  flags?: string
  premium_type?: Number
  public_flags?: Number
}
export type RoleResponse = {
  id: string
  name: string
  color: Number
  hoist: boolean
  position: Number
  permissions: Number
  permission_new: string
  managed: boolean
  metionable: boolean
}
export type GuildResponse = {
  id: string
  name: string
  icon: string
  splash: string
  discovery_splash: string
  owner?: boolean
  owner_id: string
  permission?: Number
  permission_new?: string
  region: string
  afk_channel_id: string
  afk_timeout: Number
  embed_enabled?: boolean
  embed_channel_id?: string
  verification_level: Number
  default_message_notifications: Number
  explicit_content_filter: Number
  roles: Array<RoleResponse>
}
export default {
  user: {
    info: () => {
      return axios.get<UserResponse>('/users/@me').then((res) => res.data)
    },
    guilds: () => {
      return axios.get<GuildResponse>('/user/@me/guilds').then((res) => res.data)
    },
  },
}
