import axios from 'axios'
import * as kernel from 'web-microkernel'

import './favicons'

const LOCATION_CHANGE = `@@router/LOCATION_CHANGE`

const securityProcessPaths = [
  `/authorize-approve`,
  `/help`,
  `/login`,
  `/logout`,
  `/mobile-login`,
  `/recover`,
  `/reminder`,
  `/reset-2fa`,
  `/reset-two-factor`,
  `/security-center`,
  `/signup`,
  `/verify-email`
]

const pathnameIsInSecurityProcess = pathname =>
  securityProcessPaths.some(path => pathname.startsWith(path))

;(async () => {
  const rootProcess = kernel.RootProcess()
  rootProcess.addEventListener(`error`, console.error)
  const { createProcess, setForeground } = rootProcess

  const options = await (await fetch(
    '/Resources/wallet-options-v4.json'
  )).json()

  const [mainProcess, securityProcess] = await Promise.all([
    createProcess({ name: `main`, src: `/main.html` }),
    createProcess({ name: `security`, src: `/security.html` })
  ])

  const displayMainProcess = () => {
    setForeground(mainProcess, `red`)
  }

  const displaySecurityProcess = () => {
    setForeground(securityProcess, `lightgreen`)
  }

  displaySecurityProcess()
  const sanitizedAxios = kernel.sanitizeFunction(axios)
  let mainProcessExports
  const mainProcessActions = []

  const processMainActionsQueue = () => {
    if (mainProcessExports) {
      while (mainProcessActions.length > 0) {
        const action = mainProcessActions.shift()
        mainProcessExports.dispatch(action)
      }
    }
  }

  const mainProcessDispatch = action => {
    mainProcessActions.push(action)
    processMainActionsQueue()
  }

  const dispatchFromSecurityProcess = action => {
    if (action.type === LOCATION_CHANGE) {
      if (pathnameIsInSecurityProcess(action.payload.location.pathname)) {
        displaySecurityProcess()
      } else {
        mainProcessDispatch(action)
        displayMainProcess()
      }
    }
  }

  const localStorageProxy = {
    getItem: key => localStorage.getItem(key),
    setItem: (key, value) => localStorage.setItem(key, value),
    removeItem: key => localStorage.removeItem(key)
  }

  const pushState = url => {
    window.history.pushState({}, ``, url)
  }

  const logout = () => {
    // router will fallback to /login route
    pushState(`#`)
    window.location.reload(true)
  }

  const securityProcessExports = await securityProcess({
    axios: sanitizedAxios,
    localStorage: localStorageProxy,
    logout,
    mainProcessDispatch,
    options,
    pathname: window.location.pathname,
    rootProcessDispatch: dispatchFromSecurityProcess
  })

  // update url with new language without forcing browser reload
  const addLanguageToUrl = language => {
    pushState(`/${language}/${window.location.hash}`)
  }

  const dispatchFromMainProcess = action => {
    if (action.type === LOCATION_CHANGE) {
      if (pathnameIsInSecurityProcess(action.payload.location.pathname)) {
        securityProcessExports.dispatch(action)
        displaySecurityProcess()
      } else {
        displayMainProcess()
      }
    }
  }

  mainProcessExports = await mainProcess({
    addLanguageToUrl,
    axios: sanitizedAxios,
    options,
    pathname: window.location.pathname,
    rootProcessDispatch: dispatchFromMainProcess,
    securityProcess: securityProcessExports
  })

  processMainActionsQueue()
})().catch(console.error)
