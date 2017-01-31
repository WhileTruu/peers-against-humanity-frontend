import React, { Component } from 'react'
import './newCardForm.scss'

import Card from '../card'
import Select from '../../common/select'

import ApiService from '../../services/apiService'
import Alert from '../../common/alert'
import Loader from '../../common/loader'
import { errorTypes } from '../../common/util'


import { validateText, validateTags, getColorName, getOtherColorId } from '../util'

class NewCardForm extends Component {
  constructor() {
    super()
    this.defaultText = 'Gay aliens.'
    this.renderTagSelector = this.renderTagSelector.bind(this)
    this.state = {
      cardText: this.defaultText,
      colorId: 1,
      selectedPickCount: 1,
      language: { value: 1, label: 'English', icon: 'flag-uk' },
      tags: [],
      cardTags: [],
      searchValue: '',
      error: '',
      isLoading: false,
      errorType: null,
    }
  }

  componentDidMount() {
    ApiService.getAllTags().then((result) => {
      this.setState({ tags: result.data.map(tag => ({ value: tag.id, label: tag.name})) })
    })
  }

  removeTag(event) {
    const id = parseInt(event.target.id, 10)
    this.setState({ errorType: null, error: '', cardTags: this.state.cardTags.filter(tag => {
      return tag.value !== id
    })})
  }

  renderLanguageSelector() {
    const languages = [
      { value: 1, label: 'English', icon: 'flag-uk' },
      { value: 2, label: 'Estonian', icon: 'flag-ee' },
    ]

    return (
      <div className="mb-0 pt-3 form-group">
        <label
          htmlFor="languageSelection"
          className="form-check-label"
        >
          Select a language for the card
        </label>
        <Select
          options={languages}
          id="languageSelection"
          size="lg"
          selected={this.state.language}
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
    const { errorType, cardTags, searchValue } = this.state
    const selectText = `Choose ${cardTags.length ? 'another' : 'a'} tag`
    return (
      <div className={`mb-0 pt-3 form-group${errorType === errorTypes.tag ? ' has-warning' : ''}`}>
        <label
          htmlFor="tagSelection"
          className="form-check-label"
        >
          {`${selectText} (optional)`}
        </label>
        <Select
          options={ this.getFilteredTags(searchValue) } // this.state.tags.filter(tag => this.state.cardTags.indexOf(tag) === -1)}
          id="tagSelection"
          size="lg"
          placeholder={`${selectText}`}
          onSearchChange={(value) => this.setState({ searchValue: value })}
          onChange={tag => {
            if (cardTags.indexOf(tag) === -1) this.setState({
              cardTags: cardTags.concat(tag),
              searchValue: '',
            })}
          }
        />
      </div>
    )
  }

  onSubmit(event) {
    event.preventDefault()
    if (this.state.isLoading) return;
    this.setState({ isLoading: true })
    const tagError = validateTags(this.state.cardTags)
    const textError = validateText(this.state.cardText, this.defaultText)
    if (tagError || textError) {
      this.setState({
        error: tagError || textError,
        errorType: tagError ? errorTypes.tag : errorTypes.text,
        isLoading: false,
      })
      return
    }
    ApiService.createNewCard(this.getOrganizedCardData())
      .then(response => {
        this.setState({ error: '', errorType: null, isLoading: false })
      })
      .catch(error => {
        console.log(error)
        this.setState({
          error: error.message || error.response.data.message,
          errorType: errorTypes.submit,
          isLoading: false
        })
      })
  }

  getOrganizedCardData() {
    const { language, colorId, selectedPickCount, cardTags, cardText } = this.state
    const colorName = getColorName(colorId)
    const cardData = {
      languageId: language.value,
      colorId: colorId,
      pick: colorName === 'black' ? selectedPickCount : null,
      cardText: cardText.trim(),
      tags: cardTags.length > 0 ? cardTags : null,
    }
    return cardData
  }

  renderPickCountSelector() {
    const { selectedPickCount, colorId } = this.state
    if (getColorName(colorId) === 'white') return ''
    return (
      <div className="mb-0 pt-3 form-group">
        <label
          htmlFor="inputPickCount"
          className="form-check-label"
        >
          Choose a number of white cards to pick
        </label>
        <div className="btn-group btn-group-lg sah-btn-group-justified" id="inputPickCount" role="group">
            <button
              type="button"
              className={`btn sah-btn-default btn-lg ${selectedPickCount === 1 ? 'active' : ''}`}
              onClick={() => this.setState({ selectedPickCount: 1 })}
            >
              Pick 1
            </button>
            <button
              type="button"
              className={`btn sah-btn-default btn-lg ${selectedPickCount === 2 ? 'active' : ''}`}
              onClick={() => this.setState({ selectedPickCount: 2 })}
            >
              Pick 2
            </button>
            <button
              type="button"
              className={`btn sah-btn-default btn-lg ${selectedPickCount === 3 ? 'active' : ''}`}
              onClick={() => this.setState({ selectedPickCount: 3 })}
            >
              Pick 3
            </button>
        </div>
      </div>
    )
  }

  render() {
    const { colorId, isLoading, errorType } = this.state
    const colorName = getColorName(colorId)
    const otherColorId = getOtherColorId(colorId)
    return (
      <div className="panel">
        <div className="row">
          <div className="col-12">
            <h1 className="panel-heading">
              Create a new card
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="new-card-form row-flex">
              <div
                className="new-card-form card-container pt-3 pr-3"
                onClick={() => { this.setState({ colorId: otherColorId }) }}
              >
                <Card
                  color={colorName}
                  size="large"
                  text={this.state.cardText}
                  pick={this.state.selectedPickCount}
                />
              </div>
              <div className="new-card-form card-option-inputs">
                <form className="form">
                  <div>
                    {this.renderLanguageSelector()}
                  </div>
                  <div className={`mb-0 pt-3 form-group${errorType === errorTypes.text ? ' has-warning' : ''}`}>
                    <label
                      htmlFor="inputCardText"
                      className="form-check-label"
                    >
                      Insert the text you want on your card
                    </label>
                    <input
                      type="text"
                      className="form-control sah-btn-default btn-lg"
                      id="inputCardText"
                      placeholder="Gay aliens."
                      onChange={(event) => {
                        this.setState({
                          error: '',
                          errorType: null,
                          cardText: event.target.value ? event.target.value : this.defaultText,
                        })
                      }}
                    />
                  </div>
                  {this.renderPickCountSelector()}{this.renderTagSelector()}
                  {this.state.error ? (
                    <div className="mt-4 pt-3">
                      <Alert type="warning">
                        {this.state.error}
                      </Alert>
                    </div>) : ''
                  }
                  <div className={`mb-0 pt-3 form-group${errorType === errorTypes.submit ? ' has-warning' : ''}`}>
                    <label
                      htmlFor="cardSubmitButton"
                      className="form-check-label"
                    >
                      Submit your sexy new card
                    </label>
                    <button
                      type="submit"
                      className="form-control btn sah-btn-success btn-lg"
                      id="cardSubmitButton"
                      onClick={(event) => this.onSubmit(event)}
                    >
                      {isLoading ? <Loader /> : 'Submit'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="row pt-1">
              <div className="col-xs-12">
                <div className="tags-area">
                  {this.state.cardTags.map(tag => (
                    <button
                      key={tag.value}
                      className="btn mr-1 mb-1 btn-info-dark tag-button"
                      id={tag.value}
                      onClick={(event) => this.removeTag(event)}
                    >
                    {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default NewCardForm
