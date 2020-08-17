import { useContext } from 'react'
import { MobXProviderContext } from 'mobx-react'
import store from '~/store'

export function useStore() {
  return useContext(MobXProviderContext) as typeof store
}
