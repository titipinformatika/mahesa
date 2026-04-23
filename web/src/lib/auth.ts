import Cookies from 'js-cookie';

const TOKEN_KEY = 'mahesa_token';
const ROLE_KEY = 'mahesa_peran';

export function saveAuth(token: string, peran: string) {
  Cookies.set(TOKEN_KEY, token, { expires: 1 }); // 1 hari
  Cookies.set(ROLE_KEY, peran, { expires: 1 });
}

export function getToken(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  return Cookies.get(TOKEN_KEY);
}

export function getRole(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  return Cookies.get(ROLE_KEY);
}

export function removeAuth() {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(ROLE_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
