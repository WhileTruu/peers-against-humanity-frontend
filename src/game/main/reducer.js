import {
  SELECT_CARD,
  DESELECT_CARD,
} from './constants'

const initialState = {
  selectedCardIds: [],
}

export default function gameMain(state = initialState, action) {
  switch (action.type) {

    case SELECT_CARD: {
      const { selectedCardIds } = state
      if (selectedCardIds.length >= action.pick) {
        return { selectedCardIds: [action.id].concat(selectedCardIds.slice(1)) }
      }
      return {
        selectedCardIds: selectedCardIds.concat([action.id]),
      }
    }

    case DESELECT_CARD: {
      const { selectedCardIds } = state
      return {
        selectedCardIds: selectedCardIds.filter(id => id !== action.id),
      }
    }

    default:
      return state
  }
}
