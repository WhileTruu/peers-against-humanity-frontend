import { actions } from '../services/webRTCDataChannel'

export const CHAT_MESSAGE = 'CHAT_MESSAGE'

export function sendMessage(data) {
  return (dispatch) => {
    const action = { type: CHAT_MESSAGE, data }
    dispatch(actions.broadcastToDataChannel(action))
    dispatch(action)
  }
}
