import http from 'axios';

export function registerNewUserAccount(username, password) {
  return http.post('/api/v1/users/registration',
    { username, plainTextPassword: password },
  );
}

export function logInWithUserAccount(username, password) {
  return http.post('/api/v1/users/authentication',
    { username, plainTextPassword: password },
  );
}
