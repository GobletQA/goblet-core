const isSecret = require('is-secret')

const unsafeValues = [
  /token/i,
  /auth/i,
  /password/i,
]

const unsafeKeyValuePair = [
  { key: 'authorization', value: /^bearer /i },
  { key: 'token', value: /.*/i },
  { key: 'password', value: /.*/i },
]

const possibleArrayKeys = ['stack', 'message']
const HIDDEN = '[HIDDEN]'

const safeReplacer = (key, value) => {
  if (value instanceof Buffer) return value.toString('base64')
  if (value instanceof Date) return formatISO(value)

  if (typeof key === 'string' && isSecret.key(key)) return HIDDEN
  if (typeof value !== 'string') return value
  if (isSecret.value(value)) return HIDDEN
  if (unsafeValues.some((regexp) => regexp.test(value))) return HIDDEN

  if (typeof key !== 'string') return value

  const shouldHide = unsafeKeyValuePair.some(({ key: unsafeKey, value: unsafeRegexValue }) => {
    return key === unsafeKey && unsafeRegexValue.test(value)
  })

  if(shouldHide) return HIDDEN

  if (possibleArrayKeys.includes(key) && value.indexOf('\n') >= 0)
    return value.split('\n').map((x) => x.trim())

  return value
}


module.exports = {
  safeReplacer
}