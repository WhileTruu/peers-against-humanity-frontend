const withPrefix = name => `@dataChannel/${name}`

export const JOIN = withPrefix('JOIN')
export const JOINED = withPrefix('JOINED')
export const OFFER = withPrefix('OFFER')
export const ANSWER = withPrefix('ANSWER')
export const ICE_CANDIDATE = withPrefix('ICE_CANDIDATE')
export const ADD_USER = withPrefix('ADD_USER')
export const REMOVE_USER = withPrefix('REMOVE_USER')
export const HAS_RTC_DATA_CHANNEL = withPrefix('HAS_RTC_DATA_CHANNEL')
export const BROADCAST = withPrefix('BROADCAST')
export const EXIT = withPrefix('EXIT')
export const SEND = withPrefix('SEND')
