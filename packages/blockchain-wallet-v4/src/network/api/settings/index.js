export default ({ imports: { securityProcess }, rootUrl, post }) => {
  const getSettings = (guid, sharedKey) =>
    post({
      url: rootUrl,
      endPoint: '/wallet',
      data: { guid, sharedKey, method: 'get-info', format: 'json' }
    })

  const updateSettings = (guid, sharedKey, method, payload, querystring = '') =>
    post({
      url: rootUrl,
      endPoint: querystring ? `/wallet?${querystring}` : '/wallet',
      data: { guid, sharedKey, method, payload, length: (payload + '').length }
    })

  const updateEmail = (guid, email) =>
    securityProcess.updateSettings(guid, 'update-email', email)

  const sendConfirmationCodeEmail = (guid, email) =>
    securityProcess.updateSettings(guid, 'send-verify-email-mail', email)

  const sendEmailConfirmation = (guid, email) =>
    securityProcess.updateSettings(guid, 'update-email', email)

  const resendVerifyEmail = (guid, email) =>
    securityProcess.updateSettings(guid, 'resend-verify-email', email)

  const verifyEmail = (guid, code) =>
    securityProcess.updateSettings(guid, 'verify-email-code', code)

  const updateMobile = (guid, mobile) =>
    securityProcess.updateSettings(guid, 'update-sms', mobile)

  const verifyMobile = (guid, code) =>
    securityProcess.updateSettings(guid, 'verify-sms', code)

  const updateLanguage = (guid, language) =>
    securityProcess.updateSettings(guid, 'update-language', language)

  const updateCurrency = (guid, currency) =>
    securityProcess.updateSettings(guid, 'update-currency', currency)

  const updateLastTxTime = (guid, time) =>
    securityProcess.updateSettings(guid, 'update-last-tx-time', time)

  const updateLoggingLevel = (guid, loggingLevel) =>
    securityProcess.updateSettings(guid, 'update-logging-level', loggingLevel)

  const updateIpLock = (guid, ipLock) =>
    securityProcess.updateSettings(guid, 'update-ip-lock', ipLock)

  const updateIpLockOn = (guid, ipLockOn) =>
    securityProcess.updateSettings(guid, 'update-ip-lock-on', ipLockOn)

  const updateBlockTorIps = (guid, blockTorIps) =>
    securityProcess.updateSettings(guid, 'update-block-tor-ips', blockTorIps)

  const updateHint = (guid, hint) =>
    securityProcess.updateSettings(guid, 'update-password-hint1', hint)

  const updateAuthType = (guid, authType) =>
    securityProcess.updateSettings(guid, 'update-auth-type', authType)

  const updateAuthTypeNeverSave = (guid, authTypeNeverSave) =>
    securityProcess.updateSettings(
      guid,
      'update-never-save-auth-type',
      authTypeNeverSave
    )

  const getGoogleAuthenticatorSecretUrl = guid =>
    securityProcess.updateSettings(guid, 'generate-google-secret', '')

  const enableGoogleAuthenticator = (guid, code) =>
    securityProcess.updateSettings(
      guid,
      'update-auth-type',
      '4',
      `code=${code}`
    )

  const enableYubikey = (guid, code) =>
    securityProcess.updateSettings(guid, 'update-yubikey', code)

  const enableNotifications = (guid, value) =>
    securityProcess.updateSettings(guid, 'update-notifications-on', value)

  const updateNotificationsType = (guid, value) =>
    securityProcess.updateSettings(guid, 'update-notifications-type', value)

  return {
    getSettings,
    updateSettings,
    updateEmail,
    sendEmailConfirmation,
    resendVerifyEmail,
    verifyEmail,
    updateMobile,
    verifyMobile,
    updateLanguage,
    updateLastTxTime,
    updateCurrency,
    updateLoggingLevel,
    updateIpLock,
    updateIpLockOn,
    updateBlockTorIps,
    updateHint,
    updateAuthType,
    updateAuthTypeNeverSave,
    getGoogleAuthenticatorSecretUrl,
    enableGoogleAuthenticator,
    enableYubikey,
    sendConfirmationCodeEmail,
    enableNotifications,
    updateNotificationsType
  }
}
