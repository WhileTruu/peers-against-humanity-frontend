export const AUTHENTICATED = 'AUTHENTICATED'
export const NOT_AUTHENTICATED = 'NOT_AUTHENTICATED'

export function isAuthenticated() {
  return (dispatch) => {
    dispatch({ type: AUTHENTICATED })
  }
}

export function isNotAuthenticated() {
  return (dispatch) => {
    dispatch({ type: NOT_AUTHENTICATED })
  }
}
