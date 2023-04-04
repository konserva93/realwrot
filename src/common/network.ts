export function setCookie(cname: string, cvalue: string, exdays: number | undefined = 0) {
  const d = new Date();
  if (exdays > 0) {
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
  } else {
    document.cookie = `${cname}=${cvalue};path=/`;
  }
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

async function tryGetToken(): Promise<string> {
  // TODO: show login dialog ?
  // eslint-disable-next-line no-console
  console.warn('token refresh is not implemented yet'); // TODO: if dev env
  throw new Error('could not get token');
}

type TRequestOptions = {
  method?: string,
  body?: Record<string, unknown>;
};

// TODO: add generic to use in promise
export async function sendRequest(
  url: string,
  options?: TRequestOptions,
  isRetry = false,
) {
  return new Promise<Response>((resolve, reject) => {
    fetch(`https://api.realworld.io/api/${url.replace(/^\/+/, '')}`, { // TODO: use .env var
      method: options?.method ?? 'GET',
      body: JSON.stringify(options?.body),
      headers: {
        Accept: 'application/json, text/plain',
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `Bearer ${getCookie('token')}`,
      },
    })
      .then(async response => {
        if (response.status === 401) {
          try {
            if (isRetry) {
              // noinspection ExceptionCaughtLocallyJS
              throw new Error('unable to authenticate');
            }
            const token = await tryGetToken();
            setCookie('token', token);
            sendRequest(url, options, true)
              .then(result => resolve(result))
              .catch(err => reject(err));
          } catch (err: unknown) {
            // eslint-disable-next-line no-console
            console.log((err as Error).message); // TODO: if dev env
            throw err;
          }
        }

        resolve(response);
      })
      .catch(err => reject(err));
  });
}
