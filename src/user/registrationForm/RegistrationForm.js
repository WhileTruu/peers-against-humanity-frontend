import React, { PropTypes as Types } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import ErrorAlert from '../../common/errorAlert'
import { register, toggleRememberLogin } from '../actions'
import { changeNickname, changeUsername, changePassword } from './actions'
import translations from '../../translations'

function withPreventDefault(fn) {
  return (event) => {
    event.preventDefault()
    fn()
  }
}

export const RegistrationForm = ({
  isLoggedIn,
  isRegistered,
  nickname,
  username,
  password,
  errorCode,
  loading,
  rememberLogin,
  redirectUrl,
  strings,
  onNicknameChange,
  onUsernameChange,
  onPasswordChange,
  onRememberLoginChange,
  onSubmit,
}) => (
  <div>
    {isLoggedIn && isRegistered ? <Redirect to={redirectUrl} /> : ''}
    <h1 className="panel-heading">{strings.title}</h1>
    <form
      className="form"
      onSubmit={withPreventDefault(() => onSubmit(nickname, username, password))}
    >
      <div className={`form-group ${!!errorCode && 'has-warning'}`}>
        <label htmlFor="nickname-input" className="form-check-label">{strings.nickname}</label>
        <input
          id="nickname-input"
          type="text"
          className="form-control"
          value={nickname}
          placeholder={`${strings.nickname}...`}
          onChange={event => onNicknameChange(event.target.value)}
        />
      </div>
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
      <div className="form-check">
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
    </form>
    {
      errorCode &&
      <ErrorAlert error={strings.error[errorCode] || strings.error.default} />
    }
  </div>
)

RegistrationForm.propTypes = {
  nickname: Types.string,
  username: Types.string,
  password: Types.string,
  isLoggedIn: Types.bool,
  isRegistered: Types.bool,
  errorCode: Types.number,
  redirectUrl: Types.string,
  loading: Types.bool,
  rememberLogin: Types.bool,
  strings: Types.shape({}),

  onNicknameChange: Types.func,
  onUsernameChange: Types.func,
  onPasswordChange: Types.func,
  onRememberLoginChange: Types.func,
  onSubmit: Types.func,
}

RegistrationForm.defaultProps = {
  nickname: '',
  username: '',
  password: '',
  isLoggedIn: false,
  isRegistered: false,
  errorCode: null,
  redirectUrl: '/',
  loading: false,
  rememberLogin: false,
  strings: translations.en.registrationForm,

  onNicknameChange: () => null,
  onUsernameChange: () => null,
  onPasswordChange: () => null,
  onRememberLoginChange: () => null,
  onSubmit: () => null,
}

const mapStoreToProps = store => ({
  nickname: store.registrationForm.nickname,
  username: store.registrationForm.username,
  password: store.registrationForm.password,
  rememberLogin: store.user.rememberLogin,
  loading: store.user.loading,
  errorCode: store.user.error,
  isLoggedIn: store.user.isLoggedIn,
  isRegistered: store.user.registered,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onNicknameChange: changeNickname,
  onUsernameChange: changeUsername,
  onPasswordChange: changePassword,
  onRememberLoginChange: toggleRememberLogin,
  onSubmit: register,
}, dispatch)

export default connect(mapStoreToProps, mapDispatchToProps)(RegistrationForm)
