import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TUserData, TUserErrors, isUserData, register, login } from './api';
import { TUserData as TStoredUserData, setStoredUser } from '../../common/user';
import Input from '../../ui/Input/Input';
import { setCookie } from '../../common/network';

type TProps = {
  authAction?: 'login' | 'register';
};

function Auth({ authAction }: TProps) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | string[]>>();
  const [formError, setFormError] = useState<string>('');

  const navigate = useNavigate();

  const handleSubmit = useCallback(() => {
    setFieldErrors({});
    setFormError('');

    const handleResponse = (data: TUserData | TUserErrors) => {
      if (isUserData(data)) {
        setCookie('token', data.token);
        setStoredUser(data as TStoredUserData);
        navigate('/');
      } else {
        // eslint-disable-next-line no-console
        console.log(`Auth: ${authAction} failed`, data); // TODO: if dev env
        const newErrors: Record<string, string | string[]> = {};
        Object.keys(data).forEach(errKey => {
          const keys = errKey.split(' or ');
          keys.forEach(key => {
            newErrors[key] = data[errKey];
          });
        });
        setFieldErrors(newErrors);
      }
    };

    if ((authAction === 'login' || (authAction === 'register' && username.length > 0))
      && password.length > 0
      && email.length > 0) {
      const apiCall = authAction === 'register'
        ? () => register({
          username,
          password,
          email,
        })
        : () => login({
          email,
          password,
        });
      apiCall().then(data => handleResponse(data))
        .catch(err => setFormError(err));
    } else {
      setFormError('required fields not filled');
    }
  }, [username, password, email]);

  useEffect(() => {
    if (authAction === 'login') {
      setUsername('');
    }
  }, [authAction]);

  return (
    <dialog
      title="register"
      open
      style={{
        backgroundColor: 'wheat', display: 'flex', flexDirection: 'column', gap: '16px',
      }}
    >
      {authAction === 'register'
        ? (
          <Input
            onChange={value => setUsername(value)}
            value={username}
            title="username"
            name="username"
            errors={fieldErrors?.username}
          />
        )
        : null}
      <Input
        onChange={value => setEmail(value)}
        value={email}
        title="email"
        name="email"
        errors={fieldErrors?.email}
      />
      <Input
        onChange={value => setPassword(value)}
        value={password}
        title="password"
        name="password"
        errors={fieldErrors?.password}
      />
      {formError !== ''
        ? <span>{formError}</span>
        : null}
      <button type="button" onClick={handleSubmit}>register</button>
    </dialog>
  );
}

Auth.defaultProps = {
  authAction: 'login',
};

export default Auth;
