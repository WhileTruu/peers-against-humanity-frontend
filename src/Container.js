import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import FrontPage from './pages/frontPage'
import Authentication, { actions as authenticationActions } from './authentication'
import Registration from './registration'
import Rooms from './rooms'

class Container extends Component {
  componentDidMount() {
    this.props.updateLogInStatus()
  }

  render() {
    return (
      <Router>
        <div className="container p-5" style={{ minHeight: '100vh' }}>
          <div className="row">
            <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
              <Route exact path="/" component={FrontPage} />
              <Route path="/login" component={Authentication} />
              <Route path="/register" component={Registration} />
              <Route path="/rooms" component={Rooms} />
            </div>
          </div>
        </div>
      </Router>
    )
  }
}

Container.propTypes = {
  updateLogInStatus: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  updateLogInStatus: () => dispatch(authenticationActions.updateLogInStatus()),
})

export default connect(value => value, mapDispatchToProps)(Container)
