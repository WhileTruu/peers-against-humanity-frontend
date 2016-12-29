import * as AuthService from './AuthService'
import authReducer from './authReducer'
import * as authActions from './authActions'

export default AuthService

export const reducer = authReducer
export const actions = authActions
