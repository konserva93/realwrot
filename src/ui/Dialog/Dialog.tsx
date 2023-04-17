import { ReactNode } from 'react';
import { classNames } from '../../utils/styles';

import styles from './Dialog.module.scss';

type TProps = {
  title?: string;
  open?: boolean;
  className?: string;
  children: ReactNode;
};

export function Dialog({ title, open, className, children }: TProps) {
  return (
    <dialog
      title={title}
      open={open}
      className={classNames([styles.dialog, styles.glass, className])}
    >
      {children}
    </dialog>
  );
}

Dialog.defaultProps = {
  title: undefined,
  open: true,
  className: undefined,
};
