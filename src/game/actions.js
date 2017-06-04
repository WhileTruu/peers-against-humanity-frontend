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
    dispatch(dataChannelActions.broadcast({ type: BEST_SUBMISSION, id }))
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
    dispatch(dataChannelActions.broadcast(cardSubmissionMessage))
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
    dispatch(dataChannelActions.broadcast({ type: PLAYER_READY, from: getState().user.id }))
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

export function startRound(data) {
  return (dispatch, getState) => {
    dispatch(dataChannelActions.broadcast({ type: PLAYER_READY, from: getState().user.id }))
    dispatch(data)
  }
}

export function initializeRound() {
  return (dispatch, getState) => {
    const state = getState()
    const { game } = state
    const blackCardId = randomElement(game.allocatedBlackCardIds)
    const nextEvaluatorId = getNextEvaluatorId(game.evaluatorId, game.players)

    const initializeRoundMessage = {
      type: START_ROUND,
      from: state.user.id,
      roundNumber: state.game.roundNumber + 1,
      evaluatorId: nextEvaluatorId,
      blackCardId,
    }
    dispatch(dataChannelActions.broadcast(initializeRoundMessage))
    dispatch(removeBlackCard(blackCardId))
    dispatch(initializeRoundMessage)
  }
}

export function readyCheck(id) {
  return (dispatch, getState) => {
    const { game, user, rooms } = getState()
    const { players } = game
    const readyPlayers = Object.keys(players)
      .filter(key => players[key].ready || players[key].id === id)
    const activePlayers = Object.keys(players)
      .filter(key => players[key].active)

    if (
      readyPlayers.length === activePlayers.length &&
      user.id === rooms.room.ownerId
    ) {
      dispatch({ type: PLAYER_READY, id })
      if (!game.started) dispatch(initializeRound())
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
    const { dataChannel, user } = getState()
    // Map room members into players
    const players = Object.keys(dataChannel.users).map(memberId => parseInt(memberId, 10))
      .filter(id => dataChannel.users[id].hasRTCDataChannel || id === user.id)
      .reduce((accumulator, id, index) => ({
        ...accumulator,
        [id]: {
          active: dataChannel.users[id].active, ready: false, points: 0, id, index: index + 1,
        },
      }), { [user.id]: { active: true, ready: true, points: 0, id: user.id, index: 0 } })
    const playerCount = Object.keys(players).length
    // get cards
    const maxRounds = (playerCount * (3 - 1)) + 1
    getCards(maxRounds + playerCount, playerCount * (10 + ((maxRounds - 1) * 3)) - maxRounds * 3) // eslint-disable-line
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
            dispatch(dataChannelActions
              .send(
                { type: INITIALIZE_GAME, to: id, from: user.id, whiteCards, blackCards, players },
              ))
            dispatch(dataChannelActions.send({ type: PLAYER_READY, to: id, from: user.id }))
          })
      })
      .catch(console.log) // eslint-disable-line
  }
}

export function joinGame(id) {
  return (dispatch, getState) => {
    const { user, game } = getState()
    const { whiteCards, blackCards, players } = game
    dispatch(dataChannelActions
      .send({ type: INITIALIZE_GAME, to: id, from: user.id, whiteCards, blackCards, players }))
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
      dispatch(initializeRound())
    }
  }
}

export function exitGame() {
  return { type: EXIT_GAME }
}
