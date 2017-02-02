import React, { Component } from 'react'

import './evaluation.scss'
import Card from '../card'
import Alert from '../../common/alert'
import Loader from '../../common/loader'
import ApiService from '../../services/apiService'
import { getColorName } from '../util'

export default class Evaluation extends Component {
  constructor(props) {
    super(props)
    this.upVote = this.upVote.bind(this)
    this.downVote = this.downVote.bind(this)
    this.state = {
      card: null,
      error: '',
      isLoading: false,
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true })
    ApiService.getRandomCard()
      .then(request => this.setState({ isLoading: false, card: request.data }))
      .catch(error => this.setState({ isLoading: false, error: error.response.data.message || error.message }))
  }

  upVote() {
    const { card } = this.state
    this.setState({ isLoading: true })
    ApiService.cardEvaluationUpVote(card.id)
      .then(request => this.setState({ isLoading: false, card: request.data }))
      .catch(error => this.setState({ isLoading: false, error: error.response.data.message || error.message }))
  }

  downVote() {
    const { card } = this.state
    this.setState({ isLoading: true })
    ApiService.cardEvaluationDownVote(card.id)
      .then(request => this.setState({ isLoading: false, card: request.data }))
      .catch((error) => this.setState({ isLoading: false, error: error.response.data.message || error.message }))
  }

  renderEvaluationCard() {
    const thumb = (
      <svg className="sah-thumb" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" height="400" width="400" version="1.1">
        <path d="m9.8368 400h86.247v-238.58h-86.247v238.58zm380.32-178.78c0-13.576-7.3869-25.455-18.467-31.744 8.7844-6.5883 14.474-17.369 14.474-29.248 0-20.064-16.371-36.735-36.435-36.735h-123.28c20.37-106.31-31.24-127.97-51.61-122.78-12.27 3.0917-13.57-0.30231-11.38 24.154l3.394 42.625c0.29947 3.4938 0 7.1873-0.79859 10.781-0.79858 3.5936-2.6952 6.8878-4.5919 9.9823l-45.02 72.372v208.33h194.95v-1.1979c19.166-1.098 34.439-17.369 34.439-36.835 0-6.0892-1.4974-11.979-4.0928-16.97 17.269-2.795 30.346-17.968 30.346-36.036 0-8.1855-2.6952-15.872-7.3869-21.961 14.574-4.6917 25.455-18.467 25.455-34.738z"/>
      </svg>
    )
    const { card } = this.state
    return (
      <div className="sah-evaluation-container">
        <Card
          color={getColorName(card.color_id)}
          size="large"
          text={this.state.card.card_text}
          pick={this.state.card.pick}
        />
        <div className="sah-evaluation-btn-container">
          <button className="btn sah-btn-danger sah-evaluation-btn">
            <div
              className="sah-evaluation-thumb-down"
              onClick={this.downVote}
            >
              {thumb}
            </div>
          </button>
          <button
            className="btn sah-btn-success sah-evaluation-btn"
            onClick={this.upVote}
          >
            {thumb}
          </button>
        </div>
      </div>
    )
  }

  render() {
    const { card, error, isLoading } = this.state
    const alert = (<Alert type="warning">{error}</Alert>)
    const loader = (<Loader size="md"/>)
    return (
      <div>
        <div className="pt-5 sah-evaluation-container">
          {card ? this.renderEvaluationCard() : ''}
        </div>
        <div className="pt-5 sah-evaluation-container">
          {isLoading ? loader : ''}
          {error ? alert : ''}
        </div>
      </div>
    )
  }
}
