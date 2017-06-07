import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { LoginForm, actions } from '../'
import generateRandomNickname from './util'

const AuthOptions = ({ url, isAuthenticated, temporaryLogin }) => (
  <div className="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-xl-4 offset-xl-4 py-5">
    {isAuthenticated ? <Redirect to={url} /> : ''}
    <LoginForm redirectUrl={url} />
    <div className="mb-3" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.125)' }} />
    <div>
      <div>
        <label htmlFor="anon-register" className="form-check-label">
          want to stay anonymous?
        </label>
        <button
          id="anon-register"
          type="button"
          className="form-control btn btn-info"
          onClick={() => temporaryLogin(generateRandomNickname())}
        >
          sign in as guest
        </button>
      </div>
    </div>
  </div>
)

AuthOptions.propTypes = {
  url: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  temporaryLogin: PropTypes.func.isRequired,
}

const mapStoreToProps = store => ({
  isAuthenticated: store.user.isLoggedIn,
})

const mapDispatchToProps = dispatch => ({
  temporaryLogin: nickname => dispatch(actions.temporaryLogin(nickname)),
})

export default connect(mapStoreToProps, mapDispatchToProps)(AuthOptions)
