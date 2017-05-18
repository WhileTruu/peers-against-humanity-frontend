import {
  INITIALIZE_GAME,
  START_ROUND,
  PLAYER_READY,
  PLAYER_EXITED,
  REMOVE_BLACK_CARD,
  SUBMIT_CARDS,
  SUBMITTED,
  BEST_SUBMISSION,
  EXIT_GAME,
} from './constants'

const initialState = {
  started: false,
  roundNumber: 0,
  whiteCards: null,
  blackCards: null,
  players: null,
  evaluatorId: null,
  allocatedWhiteCardIds: null,
  allocatedBlackCardIds: null,
  currentBlackCardId: null,
  currentWhiteCardIds: null,
  submittedCards: null,
  submitted: false,
  bestSubmission: null,
}

function rearrangeCards({ allCardIds, currentCardIds }) {
  const newCurrentCardIds = currentCardIds || []
  const numberOfCardsToTake = 10 - (currentCardIds && currentCardIds.length) || 0
  for (let i = 0; i < numberOfCardsToTake; i += 1) {
    newCurrentCardIds.push(allCardIds.pop())
  }
  return { allocatedWhiteCardIds: allCardIds, currentWhiteCardIds: newCurrentCardIds }
}

export default function game(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_GAME: {
      const { blackCards, whiteCards, players, to } = action
      const blackCardIds = Object.keys(blackCards).map(id => parseInt(id, 10))
      const whiteCardIds = Object.keys(whiteCards).map(id => parseInt(id, 10))
      const blackCardSliceSize = Math.floor(blackCardIds.length / Object.keys(players).length)
      const whiteCardSliceSize = Math.floor(whiteCardIds.length / Object.keys(players).length)
      return {
        ...state,
        whiteCards: action.whiteCards,
        blackCards: action.blackCards,
        players: action.players,
        allocatedWhiteCardIds: (
          whiteCardIds.slice(whiteCardSliceSize * players[to].index,
            whiteCardSliceSize * (players[to].index + 1))
        ),
        allocatedBlackCardIds: (
          blackCardIds.slice(blackCardSliceSize * players[to].index,
            blackCardSliceSize * (players[to].index + 1))
        ),
      }
    }
    case START_ROUND: {
      return {
        ...state,
        started: true,
        roundNumber: action.roundNumber,
        ...rearrangeCards({
          allCardIds: state.allocatedWhiteCardIds,
          currentCardIds: state.currentWhiteCardIds,
        }),
        currentBlackCardId: action.blackCardId,
        evaluatorId: action.evaluatorId,
        submittedCards: null,
        submitted: false,
        bestSubmission: null,
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
          [action.id]: { ...state.players[action.id], ready: true, active: true },
        },
      }
    }
    case PLAYER_EXITED:
      if (!state.players || !state.players[action.id]) return state
      return {
        ...state,
        players: {
          ...state.players,
          [action.id]: { ...state.players[action.id], active: false, ready: false },
        },
      }
    case REMOVE_BLACK_CARD:
      return {
        ...state,
        allocatedBlackCardIds: state.allocatedBlackCardIds.filter(id => id !== action.id),
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
        bestSubmission: action.id,
      }
    }
    case EXIT_GAME: {
      return initialState
    }
    default:
      return state
  }
}
