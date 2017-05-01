import React, { PropTypes as Types } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import ErrorAlert from '../../common/errorAlert'
import { logIn } from '../actions'
import { changeUsername, changePassword, toggleRememberLogin } from './actions'

const login = {
  title: 'log in',
  username: 'username',
  password: 'password',
  submit: 'log in',
  loading: 'loading',
  rememberMe: 'remember me',
  error: {
    400: 'something is wrong with the username or password',
    401: 'invalid username or password',
    500: 'server error, please try again',
    default: 'something went wrong, I guess',
  },
}

function withPreventDefault(fn) {
  return (event) => {
    event.preventDefault()
    fn()
  }
}

export const LoginForm = ({
  isLoggedIn,
  username,
  password,
  errorCode,
  loading,
  rememberLogin,
  redirectUrl,
  onUsernameChange,
  onPasswordChange,
  onRememberLoginChange,
  onSubmit,
}) => (
  <div>
    {isLoggedIn ? <Redirect to={redirectUrl} /> : ''}
    <h1 className="panel-heading">{login.title}</h1>
    <form
      className="form"
      onSubmit={withPreventDefault(() => onSubmit(username, password))}
    >
      <div className={`form-group ${!!errorCode && 'has-warning'}`}>
        <label htmlFor="username-input" className="form-check-label">{login.username}</label>
        <input
          id="username-input"
          type="text"
          className="form-control"
          value={username}
          placeholder={`${login.username}...`}
          onChange={event => onUsernameChange(event.target.value)}
        />
      </div>
      <div className={`form-group ${!!errorCode && 'has-warning'}`}>
        <label htmlFor="password-input" className="form-check-label">{login.password}</label>
        <input
          id="password-input"
          type="password"
          className="form-control"
          value={password}
          placeholder={`${login.password}...`}
          onChange={event => onPasswordChange(event.target.value)}
        />
      </div>
      <div className={`form-group ${!!errorCode && 'has-warning'}`}>
        <button
          id="login-submit"
          type="submit"
          className="btn btn-success btn-block"
          disabled={!username || !password || loading}
        >
          {loading ? login.loading : login.submit}
        </button>
      </div>
      <div className="form-check">
        <input
          type="checkbox"
          id="login-remember-checkbox"
          className="mr-1"
          checked={rememberLogin}
          onChange={onRememberLoginChange}
        />
        <label htmlFor="login-remember-checkbox" className="form-check-label">
          {login.rememberMe}
        </label>
      </div>
    </form>
    { errorCode && <ErrorAlert error={login.error[errorCode] || login.error.default} /> }
  </div>
)

LoginForm.propTypes = {
  username: Types.string,
  password: Types.string,
  isLoggedIn: Types.bool,
  errorCode: Types.number,
  redirectUrl: Types.string,
  loading: Types.bool,
  rememberLogin: Types.bool,

  onUsernameChange: Types.func,
  onPasswordChange: Types.func,
  onRememberLoginChange: Types.func,
  onSubmit: Types.func,
}

LoginForm.defaultProps = {
  username: '',
  password: '',
  isLoggedIn: false,
  errorCode: null,
  redirectUrl: '/',
  loading: false,
  rememberLogin: false,

  onUsernameChange: () => null,
  onPasswordChange: () => null,
  onRememberLoginChange: () => null,
  onSubmit: () => null,
}

const mapStoreToProps = store => ({
  username: store.loginForm.username,
  password: store.loginForm.password,
  rememberLogin: store.loginForm.rememberLogin,
  loading: store.user.loading,
  errorCode: store.user.error,
  isLoggedIn: store.user.isLoggedIn,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onUsernameChange: changeUsername,
  onPasswordChange: changePassword,
  onRememberLoginChange: toggleRememberLogin,
  onSubmit: logIn,
}, dispatch)

export default connect(mapStoreToProps, mapDispatchToProps)(LoginForm)
