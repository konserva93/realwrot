import { getUser } from '../features/auth/api';
import { setCookie } from './network';

type TUserData = {
  email: string,
  username: string,
  bio: string | null,
  image: string,
};

export function setStoredUser(user: TUserData) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.user = user; // TODO: store in redux
}

export async function getStoredUser(): Promise<TUserData> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (window.user !== undefined) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return window.user;
  }
  const user = await getUser();
  setStoredUser(user as TUserData);
  if (user.token !== undefined) {
    setCookie('token', user.token);
  }
  return user as TUserData;
}
