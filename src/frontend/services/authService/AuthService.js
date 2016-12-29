let token = window.localStorage.getItem('token');

export function getToken() {
  return token;
}

export function logOut() {
  token = null;
  window.localStorage.removeItem('token');
}
