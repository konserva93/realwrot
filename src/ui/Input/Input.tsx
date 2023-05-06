import React from 'react';

import styles from './Input.module.scss';

function errorJSX(errors: string | Array<string>): JSX.Element | JSX.Element[] {
  if (typeof errors === 'string') {
    return <span className={styles.error}>{errors}</span>;
  }
  return errors.map(errText => <span className={styles.error} key={errText}>{errText}</span>);
}

type TInputProps = {
  title: string,
  value?: string,
  onChange: (value: string) => void,
  errors?: string | Array<string>,
};

function Input({ value, onChange, title, errors }: TInputProps): React.ReactElement {
  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        onChange={e => onChange(e.target.value)}
        value={value}
        className={styles.input}
        placeholder={title}
      />
      {
        errors !== undefined
          ? errorJSX(errors)
          : null
      }
    </div>
  );
}

Input.defaultProps = {
  value: '',
  errors: undefined,
};

export default Input;
