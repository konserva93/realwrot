export const classNames = (arr: Array<string | undefined>): string => (arr.length > 0
  ? arr.map(item => (((item?.length) != null) ? item : '')).join(' ')
  : '');
