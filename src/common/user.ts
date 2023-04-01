export type TUserData = {
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

export function getStoredUser(): TUserData | undefined {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return window.user; // TODO: store in redux
}
