import React from 'react';

import styles from './Input.module.scss';

type TCommonInputProps = {
  value?: string,
  onChange: (value: string) => void,
};

type TCommonInputPropsWithErrors = TCommonInputProps & {
  errors?: string | Array<string>,
};

type TLabeledInputProps = {
  title: string,
  name: string,
} & TCommonInputPropsWithErrors;

function isLabeled(props: unknown): props is TLabeledInputProps {
  const labeledProps = props as TLabeledInputProps;
  return ('title' in labeledProps) && ('name' in labeledProps);
}

function errorJSX(errors: string | Array<string>): JSX.Element | JSX.Element[] {
  if (typeof errors === 'string') {
    return <span>{errors}</span>;
  }
  return errors.map(errText => <span key={errText}>{errText}</span>);
}

function inputJSX(inputProps: TCommonInputProps): JSX.Element {
  if (isLabeled(inputProps)) {
    const { value, onChange, title, name } = (inputProps as TLabeledInputProps);
    return (
      <div className={styles.wrapper}>
        <label htmlFor={name} className={styles.label}>{title}</label>
        <input
          type="text"
          onChange={e => onChange(e.target.value)}
          value={value}
          name={name}
          className={styles.input}
        />
        <span className={styles.underline} />
      </div>
    );
  }

  if (('title' in inputProps) || ('name' in inputProps)) {
    // eslint-disable-next-line no-console
    console.warn('Input props should either have both title and name, or not have both'); // TODO: if dev env
  }

  const { value, onChange } = inputProps;
  return (
    <div className={styles.wrapper}>
      <input type="text" onChange={e => onChange(e.target.value)} value={value} />
      <span className={styles.underline} />
    </div>
  );
}

function Input(props: TCommonInputPropsWithErrors): React.ReactElement;
function Input(props: TLabeledInputProps): React.ReactElement;
function Input(props: TCommonInputPropsWithErrors | TLabeledInputProps) {
  const { errors } = props;
  return (
    <>
      {
        inputJSX(props as TCommonInputProps)
      }
      {
        errors !== undefined
          ? errorJSX(errors)
          : null
      }
    </>
  );
}

Input.defaultProps = {
  value: '',
  error: undefined,
};

export default Input;
