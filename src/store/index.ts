import { create, IHydrateResult } from 'mobx-persist'
import BrowserData from './browserData'

const stores = {
  browserData: new BrowserData(),
}

export default stores

const hydrate = create()

const hyrateStores = (): IHydrateResult<Object>[] => {
  return [hydrate('browserData', stores.browserData)]
}

export const hydratedStore = hyrateStores()
