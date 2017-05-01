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

export function register(username, password) {
  return fetch('/api/v1/users', {
    method: 'POST',
    headers,
    body: JSON.stringify({ username, password }),
  }).then(transformResponse)
}

export function login(username, password) {
  return fetch('/api/v1/users/authentication', {
    method: 'POST',
    headers,
    body: JSON.stringify({ username, password }),
  }).then(transformResponse)
}

// export function createRoom(token) {
//   return fetch('/api/v1/rooms', {
//     method: 'POST',
//     headers: { ...headers, Authorization: `Bearer ${token}` },
//   }).then(checkStatus).then(response => response.json())
// }

// export function getRooms(token) {
//   return fetch('/api/v1/rooms', {
//     method: 'GET',
//     headers: { ...headers, Authorization: `Bearer ${token}` },
//   }).then(checkStatus).then(response => response.json())
// }

// export function joinRoom(roomId, token) {
//   return fetch(`/api/v1/rooms/${roomId}`, {
//     method: 'PUT',
//     headers: { ...headers, Authorization: `Bearer ${token}` },
//   }).then(checkStatus).then(response => response.json())
// }

// export function exitRoom(roomId, token) {
//   return fetch(`/api/v1/rooms/${roomId}`, {
//     method: 'DELETE',
//     headers: { ...headers, Authorization: `Bearer ${token}` },
//   }).then(checkStatus)
// }

export function createTemporaryAccount(nickname) {
  return fetch('/api/v1/users/temporary', {
    method: 'POST',
    headers,
    body: JSON.stringify({ nickname }),
  }).then(transformResponse)
}
