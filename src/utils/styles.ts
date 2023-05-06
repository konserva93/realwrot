export const classNames = (arr: Array<string | undefined>, options: Record<string, boolean> = {}): string => (
  Object.keys(options).reduce((acc, optKey) => (
    options[optKey] ? acc.concat(optKey) : acc
  ), arr.map(item => (((item?.length) != null) ? item : ''))).join(' ')
);
