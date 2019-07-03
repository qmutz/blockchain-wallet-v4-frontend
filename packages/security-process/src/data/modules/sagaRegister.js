import { fork } from 'redux-saga/effects'
import profile from './profile/sagaRegister'
import settings from './settings/sagaRegister'
import securityCenter from './securityCenter/sagaRegister'

export default ({ api, coreSagas, networks }) =>
  function * modulesSaga () {
    yield fork(profile({ api, coreSagas }))
    yield fork(settings({ api, coreSagas }))
    yield fork(securityCenter({ coreSagas }))
  }
