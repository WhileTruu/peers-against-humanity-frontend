export const SOCKET_IS_OPEN = 'SOCKET_IS_OPEN'
export const SOCKET_IS_CLOSED = 'SOCKET_IS_CLOSED'

export const ICE_CANDIDATE = 'ICE_CANDIDATE'

export function socketConnectionIsOpen() {
  return dispatch => (
    dispatch({ type: SOCKET_IS_OPEN })
  )
}

export function socketConnectionIsClosed() {
  return dispatch => (
    dispatch({ type: SOCKET_IS_CLOSED })
  )
}
