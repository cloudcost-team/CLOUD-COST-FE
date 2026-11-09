let accessToken: string | null = null;

export function setAccessToken(token: string) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
}

const RETURN_PATH_KEY = "cloudcost.returnPath";

export function saveReturnPath(path: string) {
  sessionStorage.setItem(RETURN_PATH_KEY, path);
}

export function takeReturnPath() {
  const path = sessionStorage.getItem(RETURN_PATH_KEY);
  sessionStorage.removeItem(RETURN_PATH_KEY);
  return path?.startsWith("/") && !path.startsWith("//") ? path : null;
}
