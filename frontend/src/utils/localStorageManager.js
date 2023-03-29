export const KEY_ACCESS_TOKEN = "access_token";

//calls when check user is loggedin or not
export function getItem(key) {
  return localStorage.getItem(key);
}

//calls when save access token after user login
export function setItem(key, value) {
  return localStorage.setItem(key, value);
}

//calls when user gets logout
export function removeItem(key) {
  localStorage.removeItem(key);
}
