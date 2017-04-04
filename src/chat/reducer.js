import { CHAT_MESSAGE } from './actions'

const initialState = {
  messages: null,
}

export default function chat(state = initialState, result) {
  switch (result.type) {
    case CHAT_MESSAGE: {
      return {
        messages: state.messages ? state.messages.concat([result.data]) : [result.data],
      }
    }
    default:
      return state
  }
}
