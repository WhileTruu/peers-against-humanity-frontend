import http from 'axios';

let token = window.localStorage.getItem('token');

export function registerNewUserAccount(username, password) {
  return http.post('/api/v1/users/registration',
      { username, plainTextPassword: password },
  );
}

export function getToken() {
  return token;
}

export function logOut() {
  token = null;
  window.localStorage.removeItem('token');
}
