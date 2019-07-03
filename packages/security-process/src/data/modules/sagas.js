import settings from './settings/sagas'
import securityCenter from './securityCenter/sagas'

export default ({ api, coreSagas, networks }) => ({
  settings: settings({ api, coreSagas }),
  securityCenter: securityCenter({ coreSagas })
})
