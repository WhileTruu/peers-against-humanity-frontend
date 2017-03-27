export const LOG_IN = 'LOG_IN'
export const LOG_OUT = 'LOG_OUT'
export const LOGGED_IN = 'LOGGED_IN'

export function logIn({ token, userId, username }) {
  return (dispatch) => {
    dispatch({ type: LOG_IN, token, userId, username })
  }
}

export function logOut() {
  return (dispatch) => {
    dispatch({ type: LOG_OUT })
  }
}

export function loggedIn({ token, userId, username }) {
  return (dispatch) => {
    dispatch({ type: LOGGED_IN, token, userId, username })
  }
}

export function updateLogInStatus() {
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  const username = localStorage.getItem('username')

  if (!!token && !!userId && !!username) {
    return loggedIn({ token, userId, username })
  }
  return logOut()
}
