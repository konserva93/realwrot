import React from 'react';

type TCommonInputProps = {
  value?: string,
  onChange: (value: string) => void,
};

type TLabeledInputProps = {
  title: string,
  name: string,
} & TCommonInputProps;

function isLabeled(props: unknown): props is TLabeledInputProps {
  const labeledProps = props as TLabeledInputProps;
  return ('title' in labeledProps) && ('name' in labeledProps);
}

function Input(props: TCommonInputProps): React.ReactElement;
function Input(props: TLabeledInputProps): React.ReactElement;
function Input(props: TCommonInputProps | TLabeledInputProps) {
  if (isLabeled(props)) {
    const { value, onChange, title, name } = (props as TLabeledInputProps);
    return (
      <span>
        <label htmlFor={name}>{title}</label>
        <input
          type="text"
          onChange={e => onChange(e.target.value)}
          value={value}
          name={name}
        />
      </span>
    );
  }

  if (('title' in props) || ('name' in props)) {
    console.warn('Input props should either have both title and name, or not have both');
  }

  const { value, onChange } = props;
  return <input type="text" onChange={e => onChange(e.target.value)} value={value} />;
}

Input.defaultProps = {
  value: '',
};

export default Input;
