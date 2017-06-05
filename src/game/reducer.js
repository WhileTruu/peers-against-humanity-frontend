import {
  INITIALIZE_GAME,
  START_ROUND,
  PLAYER_READY,
  PLAYER_EXITED,
  REMOVE_BLACK_CARD,
  SUBMIT_CARDS,
  SUBMITTED,
  BEST_SUBMISSION,
  RESET,
} from './constants'

const initialState = {
  started: false,
  finished: false,
  winner: null,
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
  shuffledOrder: null,
}

function shuffle(array) {
  const shuffledArray = array
  let j = 0
  let temp = null

  for (let i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    shuffledArray[i] = shuffledArray[j]
    shuffledArray[j] = temp
  }
  return shuffledArray
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
        ...initialState,
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
        shuffledOrder: null,
        submitted: false,
        bestSubmission: null,
      }
    }
    case SUBMIT_CARDS: {
      const newSubmittedCards = { ...state.submittedCards, [action.from]: action.cards }
      return {
        ...state,
        submittedCards: newSubmittedCards,
        shuffledOrder: shuffle(Object.keys(newSubmittedCards).map(key => parseInt(key, 10))),
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
      const points = state.players[action.id].points + 1
      return {
        ...state,
        players: {
          ...state.players,
          [action.id]: { ...state.players[action.id], points },
        },
        bestSubmission: action.id,
        finished: points >= 3,
        winner: points >= 3 && action.id ? action.id : null,
      }
    }
    case RESET: {
      return initialState
    }
    default:
      return state
  }
}
