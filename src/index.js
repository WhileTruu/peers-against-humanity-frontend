import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

// import NewCardForm from './cards/new'
// import Evaluation from './cards/evaluation'
import Container from './Container'
// import Registration from './registration'
// import Authentication from './authentication'
import rootReducer from './rootReducer'
import './index.scss'

const devTools = window.devToolsExtension ? window.devToolsExtension() : variable => variable
const finalCreateStore = compose(applyMiddleware(thunk), devTools)(createStore)
const store = finalCreateStore(rootReducer)

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Container />
    </Router>
  </Provider>,
  document.getElementById('root'),
)

// ReactDOM.render(
//   <Provider store={store}>
//     <Router history={browserHistory}>
//       <Route path="/" component={Container}>
//         <Route path="cards">
//           <Route path="new" component={NewCardForm} />
//           <Route path="evaluation" component={Evaluation} />
//         </Route>
//         <Route path="users">
//           <Route path="registration" component={Registration} />
//           <Route path="authentication" component={Authentication} />
//         </Route>
//       </Route>
//     </Router>
//   </Provider>,
//   document.getElementById('root'),
// )
