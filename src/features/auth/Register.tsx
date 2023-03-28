import { useCallback, useState } from 'react';
import { register } from './api';
import Input from '../../ui/Input/Input';
import { setCookie } from '../../common/network';

function Register() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const handleSubmit = useCallback(() => {
    if (username?.length > 0 && password?.length > 0 && email?.length > 0) {
      register({
        username,
        password,
        email,
      }).then(user => setCookie('token', user.token)) // TODO: pass user data to redux auth section
        .catch(err => console.error(err)); // TODO: show in form
    } else {
      console.error('required fields not filled'); // TODO: show in form
    }
  }, [username, password, email]);
  return (
    <dialog
      title="register"
      open
      style={{
        backgroundColor: 'wheat', display: 'flex', flexDirection: 'column', gap: '16px',
      }}
    >
      <Input onChange={value => setUsername(value)} value={username} title="username" name="username" />
      <Input onChange={value => setEmail(value)} value={email} title="email" name="email" />
      <Input onChange={value => setPassword(value)} value={password} title="password" name="password" />
      <button type="button" onClick={handleSubmit}>register</button>
    </dialog>
  );
}

export default Register;
