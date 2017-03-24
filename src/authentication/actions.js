export const LOG_IN = 'LOG_IN'
export const LOG_OUT = 'LOG_OUT'

export function logIn(token) {
  return (dispatch) => {
    dispatch({ type: LOG_IN, token })
  }
}

export function logOut() {
  return (dispatch) => {
    dispatch({ type: LOG_OUT })
  }
}

export function updateLogInStatus() {
  const token = window.localStorage.getItem('token')
  if (token) {
    return logIn(token)
  }
  return logOut()
}
