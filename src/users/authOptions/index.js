import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { Authentication, actions } from '../'
import getRandomNickname from './util'

const AuthOptions = ({ url, isAuthenticated, createTemporaryAccount }) => (
  <div>
    {isAuthenticated ? <Redirect to={url} /> : ''}
    <div className="row">
      <div className="col-12" style={{ position: 'absolute', zIndex: 2 }}>
        <div className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <div className="card-block">
            <div className="row">
              <div className="col-12 col-md-6">
                <button
                  type="submit"
                  className="form-control btn btn-primary mb-3"
                  onClick={() => createTemporaryAccount(getRandomNickname())}
                >
                  I want to be anonymous
                </button>
              </div>
              <div className="col-12 col-md-6">
                <Authentication onSuccessRedirectTo={url} />
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
  createTemporaryAccount: PropTypes.func.isRequired,
}

const mapStoreToProps = store => ({
  isAuthenticated: store.users.isAuthenticated,
})

const mapDispatchToProps = dispatch => ({
  createTemporaryAccount: nickname => dispatch(actions.createTemporaryAccount(nickname)),
})

export default connect(mapStoreToProps, mapDispatchToProps)(AuthOptions)
