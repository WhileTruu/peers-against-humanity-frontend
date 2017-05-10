import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { LoginForm, actions } from '../'
import generateRandomNickname from './util'

const AuthOptions = ({ url, isAuthenticated, temporaryLogin }) => (
  <div className="my-5">
    {isAuthenticated ? <Redirect to={url} /> : ''}
    <div className="row">
      <div className="col-12" style={{ position: 'absolute', zIndex: 2 }}>
        <div className="row">
          <div className="col-12">
            <LoginForm redirectUrl={url} />
          </div>
        </div>
        <div className="col-12 my-3" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.125)' }} />
        <div className="row">
          <div className="col-12">
            <label htmlFor="anon-register" className="form-check-label">
              want to stay anonymous?
            </label>
            <button
              id="anon-register"
              type="button"
              className="form-control btn btn-info"
              onClick={() => temporaryLogin(generateRandomNickname())}
            >
              proceed anonymously
            </button>
          </div>
        </div>
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
