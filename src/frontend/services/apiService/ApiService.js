import http from 'axios';

const authReject = () => Promise.reject({ message: 'You are not logged in!' })

//http.defaults.headers.common['Authorization'] = window.localStorage.getItem('token');

export function registerNewUserAccount(username, password) {
  return http.post('/api/v1/users/registration',
    { username, plainTextPassword: password },
  )
}

export function logInWithUserAccount(username, password) {
  return http.post('/api/v1/users/authentication',
    { username, plainTextPassword: password },
  )
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
    { headers: { Authorization: `Bearer ${token}` } }
  ) : authReject
}

export function cardEvaluationUpVote(cardId) {
  const token = window.localStorage.getItem('token')
  return token ? http.post(`/api/v1/cards/${cardId}/vote/up`,
    cardId,
    { headers: { Authorization: `Bearer ${token}` } }
  ) : authReject
}

export function cardEvaluationDownVote(cardId) {
  const token = window.localStorage.getItem('token')
  return token ? http.post(`/api/v1/cards/${cardId}/vote/down`,
    cardId,
    { headers: { Authorization: `Bearer ${token}` } }
  ) : authReject
}
