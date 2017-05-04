import {
  START_ROUND,
  BLACK_CARDS,
  WHITE_CARDS,
} from './constants'
import { api } from '../common'

export function startRound() {
  return { type: START_ROUND }
}

export function getCards(blackCardLimit, whiteCardLimit) {
  return (dispatch) => {
    api.getBlackCards(blackCardLimit)
      .then((response) => {
        dispatch({ type: BLACK_CARDS, blackCards: response })
      })
      .catch(console.log)
    api.getWhiteCards(whiteCardLimit)
      .then((response) => {
        dispatch({ type: WHITE_CARDS, whiteCards: response })
      })
      .catch(console.log)
  }
}
