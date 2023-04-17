import { classNames } from '../../utils/styles';

import styles from './Button.module.scss';

type TProps = {
  text: string,
  onClick: () => void;
  className?: string;
};

export function Button({ text, onClick, className }: TProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames([styles.button, className])}
    >
      {text}
    </button>
  );
}

Button.defaultProps = {
  className: undefined,
};
