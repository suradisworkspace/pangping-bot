import axios from '~/helpers/axios'

export type GuildDetailsResponse = {
  id: string
  name: string
  icon: string
  owner: boolean
  permissions: Number
  features: Array<any>
  permissions_new: string
}

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

export type GuildConfigResponse = {
  id: string
  name: string
  icon: string
  settings: {
    commandPrefix?: string
  }
  customCommands: Object
}

export default {
  userInfo: () => {
    type UserInfoResponse = {
      user: UserResponse
      guilds: Array<GuildDetailsResponse>
    }
    return axios.get<UserInfoResponse>('/api/userInfo').then((res) => res.data)
  },
  guild: {
    getSettings: (guildId: string) => {
      return axios.get<GuildConfigResponse>(`/api/guild/${guildId}`).then((res) => res.data)
    },
  },
  settings: {
    customCommands: {
      add: (id: string, command: string, url: string) => {
        return axios.post('/api/addCustomCommand', { id, command, url }).then((res) => res.data)
      },
    },
  },
}
