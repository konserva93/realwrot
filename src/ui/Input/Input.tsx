import React from 'react';

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
      <>
        <label htmlFor={name}>{title}</label>
        <input
          type="text"
          onChange={e => onChange(e.target.value)}
          value={value}
          name={name}
        />
      </>
    );
  }

  if (('title' in inputProps) || ('name' in inputProps)) {
    // eslint-disable-next-line no-console
    console.warn('Input props should either have both title and name, or not have both'); // TODO: if dev env
  }

  const { value, onChange } = inputProps;
  return <input type="text" onChange={e => onChange(e.target.value)} value={value} />;
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
