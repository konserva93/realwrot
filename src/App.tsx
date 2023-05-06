import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Auth from './features/auth/Auth';
import { getStoredUser, setStoredUser } from './common/user';
import { fetchCurrentUser, isUserData } from './features/auth/api';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== '/login' && location.pathname !== '/register') {
      // noinspection JSIgnoredPromiseFromCall
      const user = getStoredUser();
      if (!user) {
        fetchCurrentUser()
          .then(result => {
            if (isUserData(result)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
              setStoredUser(result);
            } else {
              navigate('/login');
            }
          })
          .catch(() => {
            navigate('/login');
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } else {
      setIsLoading(false);
    }
  }, [location]);

  return isLoading
    ? <div>loading</div>
    : (
      <Routes>
        <Route path="/" element={<div>main page</div>} />
        <Route path="register" element={<Auth authAction="register" />} />
        <Route path="login" element={<Auth authAction="login" />} />
      </Routes>
    );
}

export default App;
