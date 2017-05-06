import {
  START_GAME,
  START_ROUND,
  PLAYER_READY,
  REMOVE_BLACK_CARD,
  SUBMIT_CARDS,
  SUBMITTED,
  BEST_SUBMISSION,
  PLAYER_EXITED,
} from './constants'
import DataChannelService from '../common/RTCDataChannel'
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
    DataChannelService.message({ type: BEST_SUBMISSION, id }).broadcast()
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
    DataChannelService.message(cardSubmissionMessage).broadcast()
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
    DataChannelService.message({ type: PLAYER_READY, from: getState().user.id }).broadcast()
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
    DataChannelService.message(startRoundMessage).broadcast()
    dispatch(removeBlackCard(blackCardId))
    dispatch(startRoundMessage)
  }
}

export function readyCheck(id) {
  return (dispatch, getState) => {
    const { game, user, room } = getState()
    const { players } = game
    const readyPlayers = Object.keys(players)
      .filter(key => players[key].ready || players[key].id === id)
    const activePlayers = Object.keys(players)
      .filter(key => players[key].active)

    if (
      readyPlayers.length === activePlayers.length &&
      user.id === room.ownerId
    ) {
      dispatch({ type: PLAYER_READY, id })
      dispatch(startRound())
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

function startGame(to, from, whiteCards, blackCards, players) {
  return { type: START_GAME, to, from, whiteCards, blackCards, players }
}

export function initializeGame() {
  return (dispatch, getState) => {
    const { room, user } = getState()
    const players = Object.keys(room.members).map(memberId => parseInt(memberId, 10))
      .filter(id => room.members[id].hasDataChannel || id === user.id)
      .reduce((accumulator, id, index) => (
        { ...accumulator, [id]: { active: true, ready: false, points: 0, id, index } }
      ), {})

    getCards(10, 100)
      .then(([blackCards, whiteCards]) => {
        dispatch(startGame(user.id, user.id, whiteCards, blackCards, players))
        dispatch({ type: PLAYER_READY, id: user.id })
        Object.keys(players).forEach((strId) => {
          const id = parseInt(strId, 10)
          if (id === user.id) return
          DataChannelService
            .message(startGame(id, user.id, whiteCards, blackCards, players)).to(id).send()
          DataChannelService.message({ type: PLAYER_READY, to: id, from: user.id }).to(id).send()
        })
      })
      .catch(console.log) // eslint-disable-line
  }
}

export function joinGame(id) {
  return (dispatch, getState) => {
    const { user, game } = getState()
    DataChannelService
      .message(startGame(id, user.id, game.whiteCards, game.blackCards, game.players)).to(id).send()
  }
}

export function playerExited(id) {
  return { type: PLAYER_EXITED, id }
}
