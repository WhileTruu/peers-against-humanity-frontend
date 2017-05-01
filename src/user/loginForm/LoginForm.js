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
      onSubmit={withPreventDefault(onSubmit)}
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
          type="submit"
          disabled={!username || !password || loading}
          className="btn btn-success btn-block"
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
    { errorCode ? <ErrorAlert error={login.error[errorCode]} /> : '' }
  </div>
)

LoginForm.propTypes = {
  username: Types.string,
  password: Types.string,
  isLoggedIn: Types.bool.isRequired,
  errorCode: Types.number,
  redirectUrl: Types.string,
  loading: Types.bool.isRequired,
  rememberLogin: Types.bool.isRequired,

  onUsernameChange: Types.func.isRequired,
  onPasswordChange: Types.func.isRequired,
  onRememberLoginChange: Types.func.isRequired,
  onSubmit: Types.func.isRequired,
}

LoginForm.defaultProps = {
  username: '',
  password: '',
  token: '',
  errorCode: null,
  redirectUrl: '/',
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
