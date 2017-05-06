const withPrefix = name => `@game/${name}`

export const START_GAME = withPrefix('START_GAME')
export const START_ROUND = withPrefix('START_ROUND')
export const PLAYER_READY = withPrefix('PLAYER_READY')
export const REMOVE_BLACK_CARD = withPrefix('REMOVE_BLACK_CARD')
export const SUBMIT_CARDS = withPrefix('SUBMIT_CARDS')
export const SUBMITTED = withPrefix('SUBMITTED')
export const BEST_SUBMISSION = withPrefix('BEST_SUBMISSION')
