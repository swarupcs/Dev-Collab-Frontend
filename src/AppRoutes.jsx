import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignupPage';
import SignInPage from './pages/SigninPage';
import DashboardPage from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';


function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
