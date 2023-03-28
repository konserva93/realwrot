import { sendRequest } from '../../common/network';

type TRegisterData = {
  username: string,
  email: string,
  password: string,
};

type TUserData = {
  email: string,
  token: string,
  username: string,
  bio: string,
  image: string,
};

/**
 * returns response body with user's fields
 * throws obj with fields that caused an error
 */
export async function register({ username, email, password }: TRegisterData): Promise<TUserData> {
  const result = await sendRequest('/users', {
    method: 'POST',
    body: {
      user: {
        username,
        email,
        password,
      },
    },
  });

  switch (result.status) {
    case 200:
    case 201: {
      document.cookie = `token=${result.body.token};secure`;
      return (result.body as TUserData);
    }
    case 401: // TODO: handle in common sendRequest
    case 422:
    default: throw new Error(result); // TODO: handle case when no error fields taken
  }
}

export async function login() {
  const result = await sendRequest('/users/login', {
    method: 'POST',
    body: {
      user: {
        email: 'string',
        password: 'string',
      },
    },
  });
  return result.body;
}

export async function getUser() {
  const response = await sendRequest('/user');
  return response.body;
}
