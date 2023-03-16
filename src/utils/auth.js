import Cookies from 'js-cookie';

const TOKEN_KEY = 'dataports-token';

export function getToken() {
  return Cookies.get(TOKEN_KEY);
}

export function setToken(token) {
  return Cookies.set(TOKEN_KEY, token);
}

export function removeToken() {
  return Cookies.remove(TOKEN_KEY);
}

export function validateToken(token) {
  try {
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    return decoded.exp !== undefined && decoded.exp * 1000 >= Date.now();
  } catch (_e) {
    return false;
  }
}
