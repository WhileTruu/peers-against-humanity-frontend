/* global describe, beforeEach, jest, it, expect */
import React from 'react'
import { shallow } from 'enzyme'
import { Redirect } from 'react-router-dom'

import { LoginForm } from './LoginForm'
import ErrorAlert from '../../common/errorAlert'

describe('login form', () => {
  let props
  let component

  beforeEach(() => {
    props = {}
    component = shallow(<LoginForm {...props} />)
  })

  it('changes username value when typed into input', () => {
    const onUsernameChange = jest.fn()
    const value = 'TheLegend27'
    component.setProps({ onUsernameChange })

    expect(onUsernameChange).not.toHaveBeenCalled()
    component.find('input#username-input').simulate('change', { target: { value } })
    expect(onUsernameChange).toHaveBeenCalledTimes(1)
    expect(onUsernameChange).toHaveBeenCalledWith(value)
  })

  it('changes password value when typed into input', () => {
    const onPasswordChange = jest.fn()
    const value = 'correcthorsebatterystaple'
    component.setProps({ onPasswordChange })

    expect(onPasswordChange).not.toHaveBeenCalled()
    component.find('input#password-input').simulate('change', { target: { value } })
    expect(onPasswordChange).toHaveBeenCalledTimes(1)
    expect(onPasswordChange).toHaveBeenCalledWith(value)
  })

  it('sets submit button to disabled when no usename or password present', () => {
    const submitButtonEnabled = () => !component.find('button#login-submit').prop('disabled')
    expect(submitButtonEnabled()).toBe(false)
    component.setProps({ username: 'TheLegend27', password: 'correcthorsebatterystaple' })
    expect(submitButtonEnabled()).toBe(true)
  })

  it('sets submit button to disabled when loading', () => {
    const submitButtonEnabled = () => !component.find('button#login-submit').prop('disabled')
    component.setProps({ username: 'TheLegend27', password: 'correcthorsebatterystaple' })
    expect(submitButtonEnabled()).toBe(true)
    component.setProps({ loading: true })
    expect(submitButtonEnabled()).toBe(false)
  })

  it('can submit username and password', () => {
    const onSubmit = jest.fn()
    const username = 'TheLegend27'
    const password = 'correcthorsebatterystaple'

    component.setProps({ username, password, onSubmit })
    expect(onSubmit).not.toHaveBeenCalled()
    component.find('form').simulate('submit', { preventDefault: () => true })
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith(username, password)
  })

  it('renders redirect to index when logged in and redirect url not specified', () => {
    expect(component.find(Redirect)).toHaveLength(0)
    component.setProps({ isLoggedIn: true })
    expect(component.find(Redirect)).toHaveLength(1)
    expect(component.find(Redirect).prop('to')).toBe('/')
  })

  it('renders redirect to specified url when logged in', () => {
    expect(component.find(Redirect)).toHaveLength(0)
    component.setProps({ isLoggedIn: true, redirectUrl: 'www.awesome.com/fun' })
    expect(component.find(Redirect)).toHaveLength(1)
    expect(component.find(Redirect).prop('to')).toBe('www.awesome.com/fun')
  })

  it('renders errorAlert when errorCode present', () => {
    expect(component.find(ErrorAlert)).toHaveLength(0)
    component.setProps({ errorCode: 1337 })
    expect(component.find(ErrorAlert)).toHaveLength(1)
  })
})
