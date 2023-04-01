import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Auth from './features/auth/Auth';
import { getStoredUser } from './common/user';

function App() {
  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    getStoredUser(); // TODO: try login by token and set current user
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Auth authAction="register" />} />
      <Route path="login" element={<Auth authAction="login" />} />
    </Routes>
  );
}

export default App;
