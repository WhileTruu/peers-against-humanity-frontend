import http from 'axios'
import 'whatwg-fetch'

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

const headers = {
  'Content-Type': 'application/json',
}

const authReject = () => Promise.reject({ message: 'You are not logged in!' })

export function registerNewUserAccount(username, password) {
  return fetch('/api/v1/users/registration', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      username,
      plainTextPassword: password,
    }),
  }).then(checkStatus).then(response => response.json())
}

export function logInWithUserAccount(username, password) {
  return fetch('/api/v1/users/authentication', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      username,
      plainTextPassword: password,
    }),
  }).then(checkStatus).then(response => response.json())
}

export function getAllTags() {
  return http.get('/api/v1/tags/all')
}

export function getRandomCard() {
  return http.get('/api/v1/cards/random')
}

export function createNewCard(cardData) {
  const token = window.localStorage.getItem('token')
  return token ? http.post('/api/v1/cards/new',
    cardData,
    { headers: { Authorization: `Bearer ${token}` } },
  ) : authReject
}

export function cardEvaluationUpVote(cardId) {
  const token = window.localStorage.getItem('token')
  return token ? http.post(`/api/v1/cards/${cardId}/vote/up`,
    cardId,
    { headers: { Authorization: `Bearer ${token}` } },
  ) : authReject
}

export function cardEvaluationDownVote(cardId) {
  const token = window.localStorage.getItem('token')
  return token ? http.post(`/api/v1/cards/${cardId}/vote/down`,
    cardId,
    { headers: { Authorization: `Bearer ${token}` } },
  ) : authReject
}