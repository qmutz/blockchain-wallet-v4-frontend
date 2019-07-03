import BIP39 from 'bip39'
import Bitcoin from 'bitcoinjs-lib'
import Task from 'data.task'
import * as ed25519 from 'ed25519-hd-key'

import {
  getDefaultHDWallet,
  getMainPassword,
  getSharedKey
} from 'blockchain-wallet-v4/src/redux/wallet/selectors'

import Core from './Exports.core'
import { HDWallet } from 'blockchain-wallet-v4/src/types'
import { taskToPromise } from 'blockchain-wallet-v4/src/utils/functional'
import * as crypto from 'blockchain-wallet-v4/src/walletCrypto'

const core = Core({ BIP39, Bitcoin, crypto, ed25519, Task })

export default ({ api, store }) => {
  const computeSecondPasswordHash = ({ iterations, password }) => {
    const state = store.getState()
    const sharedKey = getSharedKey(state)
    return core.computeSecondPasswordHash({ iterations, password, sharedKey })
  }

  const credentialsEntropy = ({ guid }) => {
    const state = store.getState()
    const password = getMainPassword(state)
    const sharedKey = getSharedKey(state)
    return core.credentialsEntropy({ guid, password, sharedKey })
  }

  const getSeed = async secondCredentials => {
    const state = store.getState()
    const cipherText = HDWallet.selectSeedHex(getDefaultHDWallet(state))
    const sharedKey = getSharedKey(state)

    const entropy = await taskToPromise(
      core.decryptEntropy({ ...secondCredentials, sharedKey }, cipherText)
    )

    return core.entropyToSeed(entropy)
  }

  const decryptWithSecondPassword = ({ iterations, password }, cipherText) => {
    const state = store.getState()
    const sharedKey = getSharedKey(state)

    return taskToPromise(
      core.decryptWithSecondPassword(
        { iterations, password, sharedKey },
        cipherText
      )
    )
  }

  const encryptWithSecondPassword = ({ iterations, password }, message) => {
    const state = store.getState()
    const sharedKey = getSharedKey(state)

    return taskToPromise(
      core.encryptWithSecondPassword(
        { iterations, password, sharedKey },
        message
      )
    )
  }

  const deriveBIP32Key = async (
    { iterations, secondPassword },
    { network, path }
  ) => {
    const seed = await getSeed({ iterations, secondPassword })
    return core.deriveBIP32Key({ network, path, seed })
  }

  const deriveSLIP10ed25519Key = async (
    { iterations, secondPassword },
    { path }
  ) => {
    const seed = await getSeed({ iterations, secondPassword })
    return core.deriveSLIP10ed25519Key({ path, seed })
  }

  const dispatch = action =>
    store.dispatch({
      ...action,
      meta: { ...action.meta, forwarded: true }
    })

  const getSettings = guid => {
    const state = store.getState()
    const sharedKey = getSharedKey(state)
    return api.getSettings(guid, sharedKey)
  }

  const updateSettings = (guid, method, payload, querystring = '') => {
    const state = store.getState()
    const sharedKey = getSharedKey(state)
    return api.updateSettings(guid, sharedKey, method, payload, querystring)
  }

  return {
    computeSecondPasswordHash,
    credentialsEntropy,
    decryptWithSecondPassword,
    encryptWithSecondPassword,
    deriveBIP32Key,
    deriveSLIP10ed25519Key,
    dispatch,
    getSettings,
    updateSettings
  }
}
