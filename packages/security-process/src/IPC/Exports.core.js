export default ({ BIP39, Bitcoin, crypto, ed25519, Task }) => {
  const computeSecondPasswordHash = ({ iterations, password, sharedKey }) =>
    crypto.hashNTimes(iterations, sharedKey + password).toString(`hex`)

  const credentialsEntropy = ({ guid, password, sharedKey }) =>
    crypto.sha256(Buffer.from(guid + sharedKey + password))

  const decryptEntropy = (
    { iterations, secondPassword, sharedKey },
    cipherText
  ) =>
    secondPassword
      ? crypto.decryptSecPass(sharedKey, iterations, secondPassword, cipherText)
      : Task.of(cipherText)

  const deriveBIP32Key = ({ network, path, seed }) =>
    Bitcoin.HDNode.fromSeedBuffer(seed, network)
      .derivePath(path)
      .toBase58()

  const deriveSLIP10ed25519Key = ({ path, seed }) =>
    ed25519.derivePath(path, seed.toString(`hex`))

  const decryptWithSecondPassword = (
    { iterations, password, sharedKey },
    ciphertext
  ) =>
    crypto.decryptDataWithPassword(ciphertext, sharedKey + password, iterations)

  const encryptWithSecondPassword = (
    { iterations, password, sharedKey },
    plaintext
  ) => crypto.encryptDataWithPassword(plaintext, sharedKey + password, iterations)

  const entropyToSeed = entropy =>
    BIP39.mnemonicToSeed(BIP39.entropyToMnemonic(entropy))

  return {
    computeSecondPasswordHash,
    credentialsEntropy,
    decryptEntropy,
    decryptWithSecondPassword,
    deriveBIP32Key,
    deriveSLIP10ed25519Key,
    encryptWithSecondPassword,
    entropyToSeed
  }
}
