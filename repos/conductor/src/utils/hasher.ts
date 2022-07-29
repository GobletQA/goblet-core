import crypto from 'crypto'

const algorithm = 'aes-256-gcm'
const KEY_LENGTH = 64
const TAG_LENGTH = 16
const IV_LENGTH = 12

const getKey = (encryptionSecret:string) => {
  if (encryptionSecret.length !== KEY_LENGTH)
    throw new Error(`Encryption Secret must have ${KEY_LENGTH} hex characters`)

  return Buffer.from(encryptionSecret, 'hex')
}

export const encrypt = (plainText: string, encryptionSecret:string): string => {
  const key = getKey(encryptionSecret)
  const initVector = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(algorithm, key, initVector, {
    authTagLength: TAG_LENGTH,
  })

  const cypherText =
    initVector.toString('hex') +
    cipher.update(plainText, 'utf-8', 'hex') +
    cipher.final('hex')

  return cipher.getAuthTag().toString('hex') + cypherText
}

export const decrypt = (encryptedText: string, encryptionSecret:string): string => {
  const key = getKey(encryptionSecret)
  const authTag = Buffer.from(encryptedText.substring(0, TAG_LENGTH * 2), 'hex')
  const initVector = Buffer.from(
    encryptedText.substring(TAG_LENGTH * 2, TAG_LENGTH * 2 + IV_LENGTH * 2),
    'hex'
  )
  const cypherText = encryptedText.substring(TAG_LENGTH * 2 + IV_LENGTH * 2)
  const decipher = crypto.createDecipheriv(algorithm, key, initVector, {
    authTagLength: TAG_LENGTH,
  })
  decipher.setAuthTag(authTag)

  return decipher.update(cypherText, 'hex', 'utf-8') + decipher.final('utf8')
}
