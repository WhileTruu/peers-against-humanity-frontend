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

export function register({ username, password }) {
  return fetch('/api/v1/users', {
    method: 'POST',
    headers,
    body: JSON.stringify({ username, password }),
  }).then(checkStatus).then(response => response.json())
}

export function login({ username, password }) {
  return fetch('/api/v1/users/authentication', {
    method: 'POST',
    headers,
    body: JSON.stringify({ username, password }),
  }).then(checkStatus).then(response => response.json())
}


export function createRoom(token) {
  return fetch('/api/v1/rooms', {
    method: 'POST',
    headers: { ...headers, Authorization: `Bearer ${token}` },
  }).then(checkStatus).then(response => response.json())
}


export function joinRoom(roomId, userId, token) {
  return fetch(`/api/v1/rooms/${roomId}/members/${userId}`, {
    method: 'PUT',
    headers: { ...headers, Authorization: `Bearer ${token}` },
  }).then(checkStatus).then(response => response.json())
}

export function exitRoom(roomId, userId, token) {
  return fetch(`/api/v1/rooms/${roomId}/members/${userId}`, {
    method: 'DELETE',
    headers: { ...headers, Authorization: `Bearer ${token}` },
  }).then(checkStatus).then(response => response.json())
}
