import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { actions as authenticationActions } from '../../authentication'
import FormGroup from '../../common/formGroup'
import Button from '../../common/formGroup/button'


class FrontPage extends Component {
  logOut() {
    this.props.logOut()
    this.props.history.push('/')
  }

  renderAuthenticationButtons() {
    return (
      <div className="form-inline justify-content-end">
        <button
          className="btn btn-success mb-3"
          onClick={() => this.props.history.push('/login')}
        >
          Log in
        </button>
        <button
          className="btn btn-primary mb-3 ml-3"
          onClick={() => this.props.history.push('/register')}
        >
          Register
        </button>
      </div>
    )
  }

  renderLogOutButton() {
    return (
      <div className="form-inline justify-content-end">
        <button
          className="btn btn-primary"
          onClick={() => this.logOut()}
        >
          Log out
        </button>
      </div>
    )
  }

  render() {
    const { authenticated } = this.props
    const { history } = this.props
    return (
      <div>
        <div className="row">
          <div className="col-6">
            <h1 className="panel-heading">
              Sockets<br />Against<br />Humanity
            </h1>
          </div>
          <div className="col-6">
            {authenticated ? this.renderLogOutButton() : this.renderAuthenticationButtons()}
          </div>
          <div className="col-12">
            <div className="py-3">
              <h5>{"If you're feeling suicidal you've come to the right place."}</h5>
            </div>
          </div>
        </div>
        {authenticated ?
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label
                  htmlFor="inputCardText"
                  className="form-check-label"
                >
                  Shitty card maker for shitty people
                </label>
                <button
                  className="form-control btn btn-primary"
                  onClick={() => history.push('/cards/new')}
                >
                  Create a new card
                </button>
              </div>
              <div className="form-group">
                <label
                  htmlFor="inputCardText"
                  className="form-check-label"
                >
                  Judge cards other people have created!
                </label>
                <button
                  className="form-control btn btn-primary"
                  onClick={() => history.push('/cards/evaluation')}
                >
                  Evaluate cards
                </button>
              </div>
              <FormGroup htmlFor={'roomsButton'} labelText={'Join a game!'}>
                <Button
                  id={'roomsButton'}
                  type={'success'}
                  onClick={() => history.push('/rooms')}
                >
                  Available rooms
                </Button>
              </FormGroup>
            </div>
          </div>
          : '' }
      </div>
    )
  }
}

FrontPage.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  logOut: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
}

const mapStoreToProps = store => ({
  authenticated: store.auth.authenticated,
})

const mapDispatchToProps = dispatch => ({
  updateLogInStatus: () => dispatch(authenticationActions.updateLogInStatus()),
  logOut: () => dispatch(authenticationActions.logOut()),
})

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(FrontPage))
