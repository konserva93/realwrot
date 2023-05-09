import { classNames } from '../../utils/styles';
import Loader from '../../assets/icons/loader.svg';

import styles from './Button.module.scss';

const defaultProps = {
  className: undefined,
  primary: false,
  isLoading: false,
};

type TProps = {
  text: string,
  onClick: () => void;
  className?: string;
  primary?: boolean;
  isLoading?: boolean;
} & typeof defaultProps;

export const Button = ({ text, onClick, className, primary, isLoading }: TProps) => (
  <button
    type="button"
    onClick={isLoading ? () => {} : onClick}
    className={classNames(
      [styles.button, primary ? styles.primary : undefined, className],
      {
        [styles.isLoading]: isLoading,
      },
    )}
  >
    {isLoading ? <Loader /> : text}
  </button>
);

Button.defaultProps = defaultProps;
