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

export default {
  userInfo: () => {
    type UserInfoResponse = {
      user: UserResponse
      guilds: Array<GuildDetailsResponse>
    }
    return axios.get<UserInfoResponse>('/api/userInfo').then((res) => res.data)
  },
}
