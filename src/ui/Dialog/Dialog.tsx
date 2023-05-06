import { ReactNode } from 'react';
import { classNames } from '../../utils/styles';

import styles from './Dialog.module.scss';

const defaultProps = {
  title: '',
  isOpen: true,
  className: '',
  isModal: true,
  isForm: false,
};

type TProps = {
  title?: string;
  isOpen?: boolean;
  className?: string;
  children: ReactNode;
  isModal?: boolean;
  isForm?: boolean;
} & typeof defaultProps;

export function Dialog({ title, isOpen, isModal, isForm, className, children }: TProps) {
  return (
    <dialog
      title={title}
      open={isOpen}
      className={classNames([styles.dialog, className], {
        [styles.modal]: isModal,
        [styles.form]: isForm,
      })}
    >
      {children}
    </dialog>
  );
}

Dialog.defaultProps = defaultProps;
