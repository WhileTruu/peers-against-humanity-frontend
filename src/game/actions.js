import {
  START_GAME,
  START_ROUND,
  PLAYER_READY,
  REMOVE_BLACK_CARD,
  SUBMIT_CARDS,
  SUBMITTED,
  BEST_SUBMISSION,
} from './constants'
import DataChannelService from '../common/RTCDataChannel'
import { actions as gameMainActions } from './main'
import { api } from '../common'

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

export function startRound() {
  return (dispatch, getState) => {
    const state = getState()
    const { game } = state
    const blackCardId = state.game.playerBlackCardIds[
      Math.floor(Math.random() * state.game.playerBlackCardIds.length)
    ]

    const evaluatorIndex = (
      game.evaluatorIndex !== null &&
      (game.evaluatorIndex + 1) % Object.keys(game.players).length
    ) || 0

    const evaluatorId = Object.keys(game.players).reduce((accumulator, currentKey) => {
      if (game.players[currentKey].index === evaluatorIndex) {
        return parseInt(currentKey, 10)
      }
      return accumulator
    }, null)

    const startRoundMessage = {
      type: START_ROUND,
      from: state.user.id,
      evaluatorIndex,
      evaluatorId,
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

function getSliceOfArray(toDivideBy, sliceNumber, arrayToSlice) {
  const numberOfSlices = Math.floor(arrayToSlice.length / toDivideBy)
  const start = numberOfSlices * sliceNumber
  const end = numberOfSlices * (sliceNumber + 1)
  return arrayToSlice.slice(start, end)
}

export function getCards(blackCardLimit, whiteCardLimit) {
  return Promise.all([api.getBlackCards(blackCardLimit), api.getWhiteCards(whiteCardLimit)])
}

function distributeCards(dispatch, state, players, blackCards, whiteCards) {
  Object.keys(players).forEach((id, i, array) => {
    const playerWhiteCards = getSliceOfArray(array.length, players[id].index, whiteCards)
    const playerBlackCards = getSliceOfArray(array.length, players[id].index, blackCards)
    const startGameAction = {
      type: START_GAME,
      to: players[id].id,
      from: state.user.id,
      whiteCards,
      blackCards,
      players,
      playerWhiteCardIds: playerWhiteCards.map(card => card.id),
      playerBlackCardIds: playerBlackCards.map(card => card.id),
    }

    if (players[id].id === state.user.id) {
      dispatch(startGameAction)
      dispatch({ type: PLAYER_READY, id: state.user.id })
    } else {
      DataChannelService.message(startGameAction).to(players[id].id).send()
      DataChannelService.message({ type: PLAYER_READY, from: state.user.id }).to(players[id].id)
        .send()
    }
  })
}

export function startGame() {
  return (dispatch, getState) => {
    const state = getState()
    const players = Object.keys(state.room.members)
      .map(id => parseInt(id, 10))
      .filter(id => state.room.members[id].hasDataChannel || id === state.user.id)
      .reduce((accumulator, currentKey, index) => (
        {
          ...accumulator,
          [currentKey]: {
            active: true,
            ready: false,
            points: 0,
            id: currentKey,
            index,
          },
        }
      ), {})

    getCards(10, 100)
      .then(([blackCards, whiteCards]) => (
        distributeCards(dispatch, state, players, blackCards, whiteCards)
      ))
      .catch(console.log) // eslint-disable-line
  }
}
