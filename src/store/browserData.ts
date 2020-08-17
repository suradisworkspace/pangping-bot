import { observable, action, computed } from 'mobx'
import { persist } from 'mobx-persist'
export default class browserData {
  @persist @observable selectedGuild = ''

  @action setSelectedGuild(guildId: string) {
    return (this.selectedGuild = guildId)
  }

  @computed get getSelectedGuild() {
    return this.selectedGuild
  }
}
