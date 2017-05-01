import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { LoginForm, actions } from '../'
import generateRandomNickname from './util'

const AuthOptions = ({ url, isAuthenticated, temporaryRegister }) => (
  <div>
    {isAuthenticated ? <Redirect to={url} /> : ''}
    <div className="row">
      <div className="col-12" style={{ position: 'absolute', zIndex: 2 }}>
        <div className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <div className="card-block">
            <div className="row">
              <div className="col-12 col-md-6">
                <button
                  type="button"
                  className="form-control btn btn-primary mb-3"
                  onClick={() => temporaryRegister(generateRandomNickname())}
                >
                  I want to be anonymous
                </button>
              </div>
              <div className="col-12 col-md-6">
                <LoginForm redirectUrl={url} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

AuthOptions.propTypes = {
  url: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  temporaryRegister: PropTypes.func.isRequired,
}

const mapStoreToProps = store => ({
  isAuthenticated: store.user.isLoggedIn,
})

const mapDispatchToProps = dispatch => ({
  temporaryRegister: nickname => dispatch(actions.temporaryRegister(nickname)),
})

export default connect(mapStoreToProps, mapDispatchToProps)(AuthOptions)
