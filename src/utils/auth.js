import Cookies from 'js-cookie'

const TokenKey = 's4a_token'
// const S3Key = 'spe_s3_key'

const In23Hours = new Date(new Date().getTime() + 23 * 60 * 60 * 1000)

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: In23Hours })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// export function getS3Key() {
//   return Cookies.get(S3Key)
// }

// export function setS3Key(data) {
//   return Cookies.set(S3Key, data, { expires: InFourteenMinutes })
// }
