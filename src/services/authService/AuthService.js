let token = window.localStorage.getItem('token')

export function getToken() {
  return token
}

export function logOut() {
  // TODO: dispatch an action aboot this!!!
  token = null
  window.localStorage.removeItem('token')
}
