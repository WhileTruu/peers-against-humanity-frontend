import React, { PropTypes as Types } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'

import ErrorAlert from '../../common/errorAlert'
import { logIn, toggleRememberLogin } from '../actions'
import { changeUsername, changePassword } from './actions'
import translations from '../../translations'

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
  strings,
  onUsernameChange,
  onPasswordChange,
  onRememberLoginChange,
  onSubmit,
}) => (
  <div>
    {isLoggedIn ? <Redirect to={redirectUrl} /> : ''}
    <h1 className="panel-heading">{strings.title}</h1>
    <form
      className="form"
      onSubmit={withPreventDefault(() => onSubmit(username, password))}
    >
      <div className={`form-group ${!!errorCode && 'has-warning'}`}>
        <label htmlFor="username-input" className="form-check-label">{strings.username}</label>
        <input
          id="username-input"
          type="text"
          className="form-control"
          value={username}
          placeholder={`${strings.username}...`}
          onChange={event => onUsernameChange(event.target.value)}
        />
      </div>
      <div className={`form-group ${!!errorCode && 'has-warning'}`}>
        <label htmlFor="password-input" className="form-check-label">{strings.password}</label>
        <input
          id="password-input"
          type="password"
          className="form-control"
          value={password}
          placeholder={`${strings.password}...`}
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
          {loading ? strings.loading : strings.submit}
        </button>
      </div>
      <div className="d-flex justify-content-between">
        <div className="form-check mr-3 mb-0">
          <input
            type="checkbox"
            id="login-remember-checkbox"
            className="mr-1"
            checked={rememberLogin}
            onChange={onRememberLoginChange}
          />
          <label htmlFor="login-remember-checkbox" className="form-check-label">
            {strings.rememberMe}
          </label>
        </div>
        <div>
          <p className="mb-0">new to peers against humanity? <Link to="/register">sign up</Link></p>
        </div>
      </div>
    </form>
    {
      errorCode &&
      <ErrorAlert error={strings.error[errorCode] || strings.error.default} />
    }
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
  strings: Types.shape({}),

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
  strings: translations.en.loginForm,

  onUsernameChange: () => null,
  onPasswordChange: () => null,
  onRememberLoginChange: () => null,
  onSubmit: () => null,
}

const mapStoreToProps = store => ({
  username: store.loginForm.username,
  password: store.loginForm.password,
  rememberLogin: store.user.rememberLogin,
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
