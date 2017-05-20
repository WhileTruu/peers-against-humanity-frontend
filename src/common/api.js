import 'whatwg-fetch'

function transformResponse(response) {
  if (response.ok && response.status < 400) return response.json()
  else if (response.status >= 400) {
    const error = { status: response.status }
    throw error
  }
  throw response
}

const headers = {
  'Content-Type': 'application/json',
}

export function register(nickname, username, password) {
  return fetch('/api/v1/users', {
    method: 'POST',
    headers,
    body: JSON.stringify({ nickname, username, password }),
  }).then(transformResponse)
}

export function registerTemporary(id, nickname, username, password, token) {
  return fetch(`/api/v1/users/temporary/${id}`, {
    method: 'PUT',
    headers: { ...headers, Authorization: `Bearer ${token}` },
    body: JSON.stringify({ nickname, username, password }),
  }).then(transformResponse)
}

export function login(username, password) {
  return fetch('/api/v1/users/authentication', {
    method: 'POST',
    headers,
    body: JSON.stringify({ username, password }),
  }).then(transformResponse)
}

export function createTemporaryAccount(nickname) {
  return fetch('/api/v1/users/temporary', {
    method: 'POST',
    headers,
    body: JSON.stringify({ nickname }),
  }).then(transformResponse)
}

export function getBlackCards(limit) {
  return fetch(`/api/v1/cards/black?limit=${limit}`, {
    method: 'GET',
    headers,
  }).then(transformResponse)
}

export function getWhiteCards(limit) {
  return fetch(`/api/v1/cards/white?limit=${limit}`, {
    method: 'GET',
    headers,
  }).then(transformResponse)
}
