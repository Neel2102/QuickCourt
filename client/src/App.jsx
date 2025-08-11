import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import UserDashboard from './pages/UserDashboard'
import FacilityDashboard from './pages/FacilityDashboard'
import AdminDashboard from './pages/AdminDashboard'
import { ToastContainer } from 'react-toastify'

const RequireRole = ({ role, children }) => {
  const userRole = localStorage.getItem('role');
  if (userRole !== role) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <>
    <ToastContainer />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/user-dashboard/*' element={
          <RequireRole role="User">
            <UserDashboard/>
          </RequireRole>
        }/>
        <Route path='/facility-dashboard/*' element={
          <RequireRole role="FacilityOwner">
            <FacilityDashboard/>
          </RequireRole>
        }/>
        <Route path='/admin-dashboard/*' element={
          <RequireRole role="Admin">
            <AdminDashboard/>
          </RequireRole>
        }/>
      </Routes>
    </>
  )
}

export default App