import React, { Component } from 'react'
import Card from '../card'
import ApiService from '../../services/apiService'
import { getColorName } from '../util'

export default class RandomCard extends Component {
  constructor() {
    super()
    this.state = {
      card: null,
      error: '',
    }
  }

  componentDidMount() {
    ApiService.getRandomCard()
      .then(request => this.setState({ card: request.data }))
      .catch(error => this.setState({ error }))
  }

  render() {
    const { card } = this.state
    return (
      <div style={{ textAlign: 'center' }}>
        { card ?
          (<div style={{ display: 'inline-block' }}>
            <Card
              color={getColorName(card.color_id)}
              size="large"
              text={this.state.card.card_text}
              pick={this.state.card.pick}
            />
          </div>) : ''
        }
      </div>
    )
  }
}
