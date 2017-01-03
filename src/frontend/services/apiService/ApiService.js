import http from 'axios';

const token = window.localStorage.getItem('token');

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
  return http.post('/api/v1/cards/new',
    cardData,
    { headers: { Authorization: token } }
  )
}
