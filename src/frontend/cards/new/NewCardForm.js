import React, { Component } from 'react'
import './newCardForm.scss'

import Card from '../card'
import Select from '../../common/select'
import LogOutButton from '../../common/buttons/logOut'

import ApiService from '../../services/apiService'
import Alert from '../../common/alert'

import { validateText, validateTags } from './util'

class NewCardForm extends Component {
  constructor() {
    super()
    this.defaultText = 'Gay aliens.'
    this.renderTagSelector = this.renderTagSelector.bind(this)
    this.state = {
      cardText: this.defaultText,
      cardIsWhite: true,
      selectedPickCount: 1,
      language: { value: 'english', label: 'English', icon: 'flag-uk' },
      tags: [],
      cardTags: [],
      searchValue: '',
      error: '',
    }
  }

  componentDidMount() {
    ApiService.getAllTags().then((result) => {
      this.setState({ tags: result.data.map(tag => ({ value: tag.id, label: tag.name})) })
    })
  }

  removeTag(event) {
    const id = parseInt(event.target.id, 10)
    this.setState({ error: '', cardTags: this.state.cardTags.filter(tag => {
      return tag.value !== id
    })})
  }

  renderLanguageSelector() {
    const languages = [
      { value: 'english', label: 'English', icon: 'flag-uk' },
      { value: 'estonian', label: 'Estonian', icon: 'flag-ee' },
    ]

    return (
      <div className="m-b-3">
        <label htmlFor="languageSelection">Select a language for the card</label>
        <Select
          options={languages}
          id="languageSelection"
          selected={this.state.language}
          placeholder="Select a language..."
          onChange={language => this.setState({ language })}
        />
      </div>
    )
  }

  getFilteredTags(value) {
    const { tags, cardTags } = this.state
    return tags.filter(tag => {
      return cardTags.indexOf(tag) === -1 && tag.label.toLowerCase().includes(value.toLowerCase())
    })
  }

  renderTagSelector() {
    const selectText = `Select ${this.state.cardTags.length ? 'another' : 'a'} tag`
    return (
      <div className="m-b-3">
        <label htmlFor="tagSelection">{`${selectText} (optional)`}</label>
        <Select
          options={ this.getFilteredTags(this.state.searchValue) } // this.state.tags.filter(tag => this.state.cardTags.indexOf(tag) === -1)}
          id="tagSelection"
          placeholder={`${selectText}...`}
          onSearchChange={(value) => this.setState({ searchValue: value })}
          onChange={tag => {
            if (this.state.cardTags.indexOf(tag) === -1) this.setState({
              cardTags: this.state.cardTags.concat(tag),
              searchValue: '',
            })}
          }
        />
      </div>
    )
  }

  onSubmit(event) {
    event.preventDefault()
    const error = validateTags(this.state.cardTags) || validateText(this.state.cardText, this.defaultText)
    if (error) this.setState({ error: error })
    console.log("Submitting card")
  }

  renderPickCountSelector() {
    const { selectedPickCount, cardIsWhite } = this.state
    if (cardIsWhite) return ''
    return (
      <div className="p-b-3">
        <label htmlFor="inputPickCount">Choose a number of white cards to pick</label>
        <div className="btn-group btn-group-justified" id="inputPickCount" role="group">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn btn-input-inverse ${selectedPickCount === 1 ? 'active' : ''}`}
              onClick={() => this.setState({ selectedPickCount: 1 })}
            >
              Pick 1
            </button>
          </div>
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn btn-input-inverse ${selectedPickCount === 2 ? 'active' : ''}`}
              onClick={() => this.setState({ selectedPickCount: 2 })}
            >
              Pick 2
            </button>
          </div>
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn btn-input-inverse ${selectedPickCount === 3 ? 'active' : ''}`}
              onClick={() => this.setState({ selectedPickCount: 3 })}
            >
              Pick 3
            </button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="panel">
        <div className="row">
          <div className="col-md-8 col-xs-6">
            <h1 className="panel-heading p-t-0">
              Create a new card
            </h1>
          </div>
          <div className="col-md-4 col-xs-6 right">
            <LogOutButton>Log out</LogOutButton>
          </div>
        </div>
        <div className="new-card-form row-flex">
          <div
            className="new-card-form card-container p-t-1 m-b-3"
            onClick={() => { this.setState({ cardIsWhite: !this.state.cardIsWhite }) }}
          >
            <Card
              color={this.state.cardIsWhite ? 'white' : 'black'}
              size="large"
              text={this.state.cardText}
              pick={this.state.selectedPickCount}
            />
          </div>
          <div className="new-card-form card-option-inputs">
            <form className="form">
              <div className="form-group">
                <div className="m-b-3">
                  {this.renderLanguageSelector()}
                </div>
                <label htmlFor="inputCardText">Insert the text you want on your card</label>
                <input
                  type="text"
                  className="form-control btn-input-inverse"
                  id="inputCardText"
                  placeholder="Gay aliens."
                  onChange={(event) => {
                    this.setState({
                      error: '',
                      cardText: event.target.value ? event.target.value : this.defaultText,
                    })
                  }}
                />
              </div>
              {this.renderPickCountSelector()}{this.renderTagSelector()}
              {this.state.error ? (
                <div className="m-b-2">
                  <Alert type="danger">
                    {this.state.error}
                  </Alert>
                </div>) : ''
              }
              <div className="form-group">
                <label htmlFor="cardSubmitButton">Submit your sexy new card</label>
                <button
                  type="submit"
                  className="form-control btn btn-input-inverse"
                  id="cardSubmitButton"
                  onClick={(event) => this.onSubmit(event)}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="row">
          {this.state.cardTags.map(tag => (
            <button
              key={tag.value}
              className="btn btn-default m-a-1"
              id={tag.value}
              onClick={(event) => this.removeTag(event)}
            >
            {tag.label}
            </button>
          ))}
        </div>
      </div>

    )
  }
}

export default NewCardForm
