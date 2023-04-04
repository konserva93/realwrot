import { sendRequest, setCookie } from '../../common/network';

export type TUserData = {
  email: string,
  username: string,
  bio: string | null,
  image: string,
  token: string,
};

export function isUserData(data: unknown): data is TUserData {
  const userData = data as TUserData;
  return (
    'email' in userData
      && 'username' in userData
      && 'bio' in userData
      && 'image' in userData
      && 'token' in userData
  );
}

type TUserResponse = {
  user: TUserData,
};

export type TUserErrors = Record<string, Array<string>>;

type TUserErrorResponse = {
  errors: TUserErrors,
};

async function handleUserResponse(response: Response) {
  return new Promise<TUserData | TUserErrors>((resolve, reject) => {
    if (response.ok) {
      response.json().then(data => {
        const { user } = data as TUserResponse;
        setCookie('token', user.token);
        resolve(user as TUserData);
      });
    } else {
      switch (response.status) {
        case 422:
        case 403: {
          response.json().then(data => {
            // console.log('handle user response 403', data);
            const { errors } = data as TUserErrorResponse;
            resolve(errors);
          });
          break;
        }
        default: {
          reject(response.statusText);
        }
      }
    }
  });
}

type TRegisterData = {
  username: string,
  email: string,
  password: string,
};

/**
 * returns response body with user's fields
 * throws obj with fields that caused an error
 */
export async function register({ username, email, password }: TRegisterData) {
  return new Promise<TUserData | TUserErrors>((resolve, reject) => {
    sendRequest('/users', {
      method: 'POST',
      body: {
        user: {
          username,
          email,
          password,
        },
      },
    })
      .then(response => {
        handleUserResponse(response)
          .then(result => {
            // eslint-disable-next-line no-console
            console.log('register fn result', result); // TODO: if dev env
            resolve(result);
          })
          .catch(err => {
            throw err;
          });
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err); // TODO: if dev env
        reject(err);
      });
  });
}

type TLoginData = {
  email: string,
  password: string,
};

export async function login({ email, password }: TLoginData) {
  return new Promise<TUserData | TUserErrors>((resolve, reject) => {
    sendRequest('/users/login', {
      method: 'POST',
      body: {
        user: {
          email,
          password,
        },
      },
    }).then(response => {
      handleUserResponse(response)
        .then(result => {
          // eslint-disable-next-line no-console
          console.log('login fn result', result); // TODO: if dev env
          resolve(result);
        })
        .catch(err => {
          throw err;
        });
    })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err); // TODO: if dev env
        reject(err);
      });
  });
}

export async function fetchCurrentUser() {
  return new Promise<TUserData | TUserErrors>((resolve, reject) => {
    sendRequest('/user')
      .then(response => resolve(handleUserResponse(response)))
      .catch(err => {
      // eslint-disable-next-line no-console
        console.error(err); // TODO: if dev env
        reject(err);
      });
  });
}
