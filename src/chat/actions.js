import { MESSAGE, RESET } from './constants'
import { actions as dataChannelActions } from '../common/dataChannel'

export function send(data) {
  return (dispatch) => {
    dispatch(dataChannelActions.broadcast({ type: MESSAGE, data }))
    dispatch({ type: MESSAGE, data })
  }
}

export function message(data) {
  return { type: MESSAGE, data }
}

export function reset() {
  return { type: RESET }
}
