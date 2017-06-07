import React from 'react'

import Header from '../common/header'
import Footer from '../common/footer'

import BlackCard from '../game/cards/blackCard'
// import WhiteCard from '../game/cards/whiteCard'

import './index.scss'

const renderWhiteCards = () => ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  .map(id => (
    <div
      className="p-3"
      key={id}
      style={{ minHeight: '100%' }}
    >
      <BlackCard text="fak u" pick={3} />
    </div>
  ))
)

export default () => (
  <div className="d-flex flex-column" style={{ minHeight: '100vh', maxHeight: '100vh' }}>
    <Header
      navigation={[(
        <h2 key="header-title" className="panel-heading">room 123</h2>
      ), (
        <span key="header-username" className="text-primary">
          yoloNox
        </span>
      ), (
        <div key="header-buttons">
          <button
            type="button"
            className="btn btn-outline-danger ml-2"
            onClick={() => this.props.history.replace('/rooms')}
          >
            exit
          </button>
        </div>
      )]}
    />
    <div className="main-card-container">
      <div style={{ flex: 3, display: 'flex', justifyContent: 'center' }}>
        { renderWhiteCards().slice(0, 5) }
      </div>

      <div style={{ flex: 3, display: 'flex', justifyContent: 'center' }}>
        { renderWhiteCards().slice(0, 5) }
      </div>

      <div style={{ flex: 3, display: 'flex', justifyContent: 'center' }}>
        { renderWhiteCards().slice(5) }
      </div>
    </div>

    <Footer>
      <button
        className="btn btn-success"
        style={{ width: '143px' }}
      >
        submit cards
      </button>
    </Footer>
  </div>
)
