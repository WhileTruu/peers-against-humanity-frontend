import DataChannelService from '../services/webRTCDataChannel'

export const CHAT_MESSAGE = 'CHAT_MESSAGE'

export function sendMessage(data) {
  return (dispatch) => {
    const message = { type: CHAT_MESSAGE, data }
    DataChannelService.message(message).broadcast()
    dispatch(message)
  }
}
