import { MESSAGE, RESET } from './constants'

const initialState = {
  messages: null,
}

export default function chat(state = initialState, result) {
  switch (result.type) {
    case MESSAGE: {
      return {
        messages: state.messages ? state.messages.concat([result.data]) : [result.data],
      }
    }

    case RESET:
      return initialState

    default:
      return state
  }
}
