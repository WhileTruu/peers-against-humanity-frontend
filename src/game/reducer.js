import {
  START_GAME,
  START_ROUND,
  PLAYER_READY,
  REMOVE_BLACK_CARD,
  SUBMIT_CARDS,
  SUBMITTED,
  BEST_SUBMISSION,
} from './constants'

const initialState = {
  started: false,
  roundNumber: 0,
  whiteCards: null,
  blackCards: null,
  players: null,
  evaluatorId: null,
  evaluatorIndex: null,
  playerWhiteCardIds: null,
  playerBlackCardIds: null,
  currentBlackCardId: null,
  currentWhiteCardIds: null,
  submittedCards: null,
  submitted: false,
}

function rearrangeCards({ allCardIds, currentCardIds }) {
  const newCurrentCardIds = currentCardIds || []
  const numberOfCardsToTake = 10 - (currentCardIds && currentCardIds.length) || 0
  for (let i = 0; i < numberOfCardsToTake; i += 1) {
    newCurrentCardIds.push(allCardIds.pop())
  }
  return { playerWhiteCardIds: allCardIds, currentWhiteCardIds: newCurrentCardIds }
}

export default function game(state = initialState, action) {
  switch (action.type) {
    case START_GAME:
      return {
        ...state,
        started: true,
        whiteCards: action.whiteCards,
        blackCards: action.blackCards,
        players: action.players,
        playerWhiteCardIds: action.playerWhiteCardIds,
        playerBlackCardIds: action.playerBlackCardIds,
      }
    case START_ROUND: {
      return {
        ...state,
        roundNumber: state.roundNumber + 1,
        ...rearrangeCards({
          allCardIds: state.playerWhiteCardIds,
          currentCardIds: state.currentWhiteCardIds,
        }),
        currentBlackCardId: action.blackCardId,
        evaluatorId: action.evaluatorId,
        evaluatorIndex: action.evaluatorIndex,
        submittedCards: null,
        submitted: false,
      }
    }
    case SUBMIT_CARDS: {
      return {
        ...state,
        submittedCards: { ...state.submittedCards, [action.from]: action.cards },
      }
    }
    case PLAYER_READY: {
      return {
        ...state,
        players: {
          ...state.players,
          [action.id]: { ...state.players[action.id], ready: true },
        },
      }
    }
    case REMOVE_BLACK_CARD:
      return {
        ...state,
        playerBlackCardIds: state.playerBlackCardIds.filter(id => id !== action.id),
      }
    case SUBMITTED:
      return {
        ...state,
        submitted: true,
        currentWhiteCardIds: action.currentWhiteCardIds,
      }
    case BEST_SUBMISSION: {
      return {
        ...state,
        players: {
          ...state.players,
          [action.id]: { ...state.players[action.id], points: state.players[action.id].points + 1 },
        },
      }
    }
    default:
      return state
  }
}
