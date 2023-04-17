import { classNames } from '../../utils/styles';

import styles from './Button.module.scss';

const defaultProps = {
  className: undefined,
  primary: false,
};

type TProps = {
  text: string,
  onClick: () => void;
  className?: string;
  primary?: boolean;
} & typeof defaultProps;

export const Button = ({ text, onClick, className, primary }: TProps) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames([styles.button, primary ? styles.primary : undefined, className])}
  >
    {text}
  </button>
);

Button.defaultProps = defaultProps;
