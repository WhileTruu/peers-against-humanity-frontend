import {
  INITIALIZE_GAME,
  START_ROUND,
  PLAYER_READY,
  REMOVE_BLACK_CARD,
  SUBMIT_CARDS,
  SUBMITTED,
  BEST_SUBMISSION,
  PLAYER_EXITED,
  EXIT_GAME,
} from './constants'
import { actions as dataChannelActions } from '../common/dataChannel'
import { actions as gameMainActions } from './main'
import { api } from '../common'

function reduceArrayToObject(array) {
  return Promise.resolve(array
    .reduce((accumulator, currentElement, currentIndex) => {
      const key = currentElement.id || currentIndex
      return ({ ...accumulator, [key]: currentElement })
    }, {}),
  )
}

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

export function selectBestSubmission(id) {
  return (dispatch) => {
    dataChannelActions.message({ type: BEST_SUBMISSION, id }).broadcast()
    dispatch({ type: BEST_SUBMISSION, id })
  }
}

export function submitCards() {
  return (dispatch, getState) => {
    const state = getState()
    const cardSubmissionMessage = {
      type: SUBMIT_CARDS,
      from: state.user.id,
      cards: state.gameMain.selectedCardIds,
    }
    dataChannelActions.message(cardSubmissionMessage).broadcast()
    dispatch(cardSubmissionMessage)

    dispatch({
      type: SUBMITTED,
      currentWhiteCardIds: state.game.currentWhiteCardIds
      .filter(id => !state.gameMain.selectedCardIds.includes(id)),
    })
    dispatch(gameMainActions.deselectAllCards())
  }
}

export function startGameMessage(action) {
  return (dispatch, getState) => {
    dispatch(action)
    dataChannelActions.message({ type: PLAYER_READY, from: getState().user.id }).broadcast()
    dispatch({ type: PLAYER_READY, id: getState().user.id })
  }
}

export function removeBlackCard(id) {
  return { type: REMOVE_BLACK_CARD, id }
}

function getNextEvaluatorId(evaluatorId, players) {
  if (evaluatorId === null) {
    const activePlayerIds = Object.keys(players).filter(id => players[id].active)
    return parseInt(randomElement(activePlayerIds), 10)
  }
  const nextEvaluatorIndex = (players[evaluatorId].index + 1) % Object.keys(players).length
  const nextEvaluatorId = Object.keys(players).reduce((accumulator, key) => (
    (players[key].index === nextEvaluatorIndex) ? parseInt(key, 10) : accumulator
  ), null)
  if (nextEvaluatorId && players[nextEvaluatorId].active) return nextEvaluatorId
  return getNextEvaluatorId(nextEvaluatorId, players)
}

export function startRound() {
  return (dispatch, getState) => {
    const state = getState()
    const { game } = state
    const blackCardId = randomElement(game.allocatedBlackCardIds)

    const startRoundMessage = {
      type: START_ROUND,
      from: state.user.id,
      roundNumber: state.game.roundNumber + 1,
      evaluatorId: getNextEvaluatorId(game.evaluatorId, game.players),
      blackCardId,
    }
    dataChannelActions.message(startRoundMessage).broadcast()
    dispatch(removeBlackCard(blackCardId))
    dispatch(startRoundMessage)
  }
}

export function readyCheck(id) {
  return (dispatch, getState) => {
    const { game, user, room } = getState()
    const { players } = game
    console.log(game)
    const readyPlayers = Object.keys(players)
      .filter(key => players[key].ready || players[key].id === id)
    const activePlayers = Object.keys(players)
      .filter(key => players[key].active)

    if (
      readyPlayers.length === activePlayers.length &&
      user.id === room.ownerId
    ) {
      dispatch({ type: PLAYER_READY, id })
      if (!game.started) dispatch(startRound())
    } else {
      dispatch({ type: PLAYER_READY, id })
    }
  }
}

export function getCards(blackCardLimit, whiteCardLimit) {
  return Promise.all([
    api.getBlackCards(blackCardLimit).then(reduceArrayToObject),
    api.getWhiteCards(whiteCardLimit).then(reduceArrayToObject),
  ])
}

export function initializeGame() {
  return (dispatch, getState) => {
    const { room, user } = getState()
    // Map room members into players
    const players = Object.keys(room.members).map(memberId => parseInt(memberId, 10))
      .filter(id => room.members[id].hasDataChannel || id === user.id)
      .reduce((accumulator, id, index) => (
        { ...accumulator, [id]: { active: true, ready: false, points: 0, id, index } }
      ), {})

    // get cards
    getCards(50, 100)
      .then(([blackCards, whiteCards]) => {
        // send start game message to myself
        dispatch(
          { type: INITIALIZE_GAME, to: user.id, from: user.id, whiteCards, blackCards, players },
        )
        dispatch({ type: PLAYER_READY, id: user.id })
        // send start game message to everyone else
        Object.keys(players)
          .map(id => parseInt(id, 10))
          .forEach((id) => {
            if (id === user.id) return
            dataChannelActions
              .message(
                { type: INITIALIZE_GAME, to: id, from: user.id, whiteCards, blackCards, players },
              )
              .to(id).send()
            dataChannelActions.message({ type: PLAYER_READY, to: id, from: user.id }).to(id).send()
          })
      })
      .catch(console.log) // eslint-disable-line
  }
}

export function joinGame(id) {
  return (dispatch, getState) => {
    const { user, game } = getState()
    const { whiteCards, blackCards, players } = game
    dataChannelActions
      .message({ type: INITIALIZE_GAME, to: id, from: user.id, whiteCards, blackCards, players })
      .to(id).send()
  }
}

export function playerExited(id) {
  return (dispatch, getState) => {
    const { user, game } = getState()
    dispatch({ type: PLAYER_EXITED, id })
    if (
      game.evaluatorId === parseInt(id, 10) &&
      getNextEvaluatorId(parseInt(id, 10), game.players) === user.id
    ) {
      dispatch(startRound())
    }
  }
}

export function exitGame() {
  return { type: EXIT_GAME }
}
