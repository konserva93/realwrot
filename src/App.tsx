import { useEffect } from 'react';
import { getUser, login } from './features/auth/api';
import Register from './features/auth/Register';
import { getStoredUser } from './common/user';

function App() {
  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    getStoredUser();
  }, []);

  return (
    <>
      <Register />
      <div>
        <button type="button" onClick={() => login()}>login</button>
        <button type="button" onClick={() => getUser()}>get user</button>
      </div>
    </>
  );
}

export default App;
