import {
  SET_EVALUATOR_ID,
  ADD_CARD_SUBMISSION,
  SET_WINNER_ID,
} from './constants'

export function setEvaluatorId(id) {
  return { type: SET_EVALUATOR_ID, id }
}

export function setWinnerId(id) {
  return { type: SET_WINNER_ID, id }
}

export function addCardSubmission(userId, cardIds) {
  return { type: ADD_CARD_SUBMISSION, userId, cardIds }
}
