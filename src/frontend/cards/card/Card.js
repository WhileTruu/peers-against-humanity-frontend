import React, { Component, PropTypes } from 'react'
import './card.scss'
import logo from './logo.svg'
import logoDark from './logo-dark.svg'

export default class Card extends Component {
  constructor() {
    super()
    this.sizes = { small: 'small', medium: 'medium', large: 'large' }
    this.colors = { white: 'white', black: 'black' }
  }

  content() {
    const { size, text } = this.props
    if (size === this.sizes.small) return (<div><h6>{text.replace('_', '________')}</h6></div>)
    if (size === this.sizes.medium) return (<div><h4>{text.replace('_', '________')}</h4></div>)
    return (<div><h3>{text.replace('_', '________')}</h3></div>)
  }

  footer() {
    const { color, pick } = this.props
    if (color === this.colors.white) return ''
    return (
      <div className="sah-card-pick">
        <div>{'PICK'}</div>
        <div className={`sah-card-pick-circle sah-card-pick-circle-${pick}`} />
      </div>
    )
  }

  render() {
    const { size, color } = this.props
    return (
      <div className={`sah-card sah-card-${size} bg-sah-card-${color}`}>
        <div className={`sah-card-content sah-card-${size}`}>
          <div className="sah-card-text">{this.content()}</div>
          <div className="sah-card-footer">
            <div className="sah-brand-text">
              <img
                className="sah-card-logo"
                src={color === this.colors.white ? logo : logoDark} alt="card"
              />
              <span>Sockets Against Humanity</span>
            </div>
            {this.footer()}
          </div>
        </div>
      </div>
    )
  }
}

Card.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['black', 'white']),
  pick: PropTypes.number,
  text: PropTypes.string.isRequired,
}

Card.defaultProps = {
  size: 'small',
  color: 'white',
  pick: 1,
  text: 'Gay aliens.',
}
