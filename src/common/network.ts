export function setCookie(cname: string, cvalue: string, exdays: number | undefined = 0) {
  const d = new Date();
  if (exdays > 0) {
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  }
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

export function getCookie(cname: string) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

type TRequestOptions = {
  method?: string,
  body?: Record<string, unknown>;
};

// TODO: add generic to use in promise
export async function sendRequest(url: string, options?: TRequestOptions) {
  const result = await fetch(`https://api.realworld.io/api/${url.replace(/^\/+/, '')}`, { // TODO: use .env var
    method: options?.method ?? 'GET',
    body: JSON.stringify(options?.body),
    headers: {
      Accept: 'application/json, text/plain',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${getCookie('token')}`,
    },
  })
    .then(response => response.json());
  if (result.status === 401) {
    console.error('unauthorized'); // TODO: no token. try to re-login, show login dialog if failed
  }
  return result;
}
