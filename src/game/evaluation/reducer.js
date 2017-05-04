import {
  SET_EVALUATOR_ID,
  ADD_CARD_SUBMISSION,
  SET_WINNER_ID,
} from './constants'

const initialState = {
  evaluatorId: null,
  submissions: null,
  winnerId: null,
}

export default function evaluation(state = initialState, action) {
  switch (action.type) {

    case SET_EVALUATOR_ID:
      return { ...initialState, evaluatorId: action.id }

    case ADD_CARD_SUBMISSION:
      return {
        ...state,
        submissions: { ...state.submissions, [action.userId]: action.cardIds },
      }

    case SET_WINNER_ID:
      return { ...state, winnerId: action.id }

    default:
      return state
  }
}
