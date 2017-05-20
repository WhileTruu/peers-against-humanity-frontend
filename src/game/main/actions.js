import {
  SELECT_CARD,
  DESELECT_CARD,
  DESELECT_ALL_CARDS,
} from './constants'

export function toggleCardSelected(id, pick) { // eslint-disable-line import/prefer-default-export
  return (dispatch, getState) => {
    const state = getState()
    const { selectedCardIds } = state.gameMain
    if (selectedCardIds && selectedCardIds.includes(id)) {
      dispatch({ type: DESELECT_CARD, id })
    } else {
      dispatch({ type: SELECT_CARD, id, pick })
    }
  }
}

export function deselectAllCards() {
  return { type: DESELECT_ALL_CARDS }
}
