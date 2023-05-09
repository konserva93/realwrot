import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TUserData, TUserErrors, isUserData, register, login } from './api';
import { TUserData as TStoredUserData, setStoredUser } from '../../common/user';
import Input from '../../ui/Input/Input';
import { Dialog } from '../../ui/Dialog/Dialog';
import { Button } from '../../ui/Button/Button';
import { setCookie } from '../../common/network';

import styles from './Auth.module.scss';

type TProps = {
  authAction?: 'login' | 'register';
};

function Auth({ authAction }: TProps) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | string[]>>({});
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
            newErrors[key] = `${key} ${data[errKey]}`;
          });
        });
        setFieldErrors(newErrors);
      }
    };

    if ((authAction === 'login' || (authAction === 'register' && username.length > 0))
      && password.length > 0
      && email.length > 0) {
      setIsSubmitting(true);

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

      apiCall()
        .then(data => handleResponse(data))
        .catch(err => setFormError(err))
        .finally(() => setIsSubmitting(false));
    } else {
      setFormError('required fields not filled');
    }
  }, [username, password, email]);

  const handleSwitchAuthAction = useCallback(() => {
    setUsername('');
    setPassword('');
    setEmail('');
    setFieldErrors({});
    setFormError('');
    navigate(authAction === 'register' ? '/login' : '/register');
  }, [authAction]);

  useEffect(() => {
    if (authAction === 'login') {
      setUsername('');
    }
  }, [authAction]);

  return (
    <div className={styles.container}>
      <Dialog
        title="register"
        isOpen
        isForm
        isModal={false}
      >
        {authAction === 'register'
          ? (
            <Input
              onChange={value => setUsername(value)}
              value={username}
              title="Username"
              errors={fieldErrors.username}
            />
          )
          : null}
        <Input
          onChange={value => setEmail(value)}
          value={email}
          title="Email"
          errors={fieldErrors.email}
        />
        <Input
          onChange={value => setPassword(value)}
          value={password}
          title="Password"
          errors={fieldErrors.password}
        />
        <div>
          {formError !== ''
            ? <span className={styles.formError}>{formError}</span>
            : null}
          <Button
            text={authAction === 'register' ? 'Register' : 'Login'}
            primary
            onClick={handleSubmit}
            isLoading={isSubmitting}
          />
        </div>
      </Dialog>
      <Dialog
        isOpen
        isModal={false}
        className={styles.hintDialog}
      >
        <p>{authAction === 'register' ? 'Already have an account?' : 'Don\'t have an account yet?'}</p>
        <Button
          text={authAction === 'register' ? 'Login' : 'Register'}
          onClick={handleSwitchAuthAction}
        />
      </Dialog>
    </div>
  );
}

Auth.defaultProps = {
  authAction: 'login',
};

export default Auth;
