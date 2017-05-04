import {
  START_ROUND,
  WHITE_CARDS,
  BLACK_CARDS,
} from './constants'

const initialState = {
  roundNumber: 0,
  whiteCards: null,
  blackCards: null,
  currentWhiteCards: null,
  currentBlackCard: null,
}

function rearrangeCards({ whiteCards, currentWhiteCards }) {
  const newCurrentWhiteCards = currentWhiteCards || []
  const numberOfCardsToTake = 10 - (currentWhiteCards && currentWhiteCards.length) || 0
  for (let i = 0; i < numberOfCardsToTake; i += 1) {
    newCurrentWhiteCards.push(whiteCards.pop())
  }
  return { whiteCards, currentWhiteCards: newCurrentWhiteCards }
}

export default function game(state = initialState, action) {
  switch (action.type) {
    case BLACK_CARDS:
      return { ...state, blackCards: action.blackCards }
    case WHITE_CARDS:
      return { ...state, whiteCards: action.whiteCards }
    case START_ROUND:
      return {
        ...state,
        roundNumber: state.roundNumber + 1,
        ...rearrangeCards({
          whiteCards: state.whiteCards,
          currentWhiteCards: state.currentWhiteCards,
        }),
        currentBlackCard: state.blackCards[0],
      }
    default:
      return state
  }
}
