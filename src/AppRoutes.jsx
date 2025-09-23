import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignupPage';
import SignInPage from './pages/SigninPage';

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
