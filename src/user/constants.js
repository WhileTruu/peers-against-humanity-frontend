const withPrefix = name => `@user/${name}`

export const GET_USER_START = withPrefix('GET_USER_START')
export const GET_USER_SUCCESS = withPrefix('GET_USER_SUCCESS')
export const GET_USER_ERROR = withPrefix('GET_USER_ERROR')
export const LOG_OUT = withPrefix('LOG_OUT')
