import { Routes, Route } from 'react-router-dom'
import Home from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import UserDashboard from './pages/UserDashboard'
import FacilityDashboard from './pages/FacilityDashboard'
import AdminDashboard from './pages/AdminDashboard'
import VenuesPage from './pages/VenuesPage'
import VenueDetailsPage from './pages/VenueDetailsPage'
import { ToastContainer } from 'react-toastify'
import PaymentSuccess from './pages/user/PaymentSuccess'
import AboutPage from './pages/AboutPage'
import Unauthorized from './pages/Unauthorized'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AuthGuard from './components/auth/AuthGuard'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        {/* Public Routes with Auth Guard */}
        <Route path='/' element={
          <AuthGuard redirectIfAuthenticated={true}>
            <Home/>
          </AuthGuard>
        }/>
        <Route path='/login' element={
          <AuthGuard redirectIfAuthenticated={true}>
            <Login/>
          </AuthGuard>
        }/>
        <Route path='/register' element={
          <AuthGuard redirectIfAuthenticated={true}>
            <Register/>
          </AuthGuard>
        }/>
        <Route path='/reset-password' element={
          <AuthGuard redirectIfAuthenticated={true}>
            <ResetPassword/>
          </AuthGuard>
        }/>

        {/* Public Routes without Auth Guard */}
        <Route path='/venues' element={<VenuesPage/>}/>
        <Route path='/about' element={<AboutPage/>}/>
        <Route path='/unauthorized' element={<Unauthorized/>}/>

        {/* Payment Routes - Protected */}
        <Route path='/booking-success' element={
          <ProtectedRoute>
            <PaymentSuccess />
          </ProtectedRoute>
        } />
        <Route path='/payment-success' element={
          <ProtectedRoute>
            <PaymentSuccess />
          </ProtectedRoute>
        } />

        {/* Dashboard Routes - Role Protected */}
        <Route path='/user-dashboard/*' element={
          <ProtectedRoute requiredRole="User">
            <UserDashboard/>
          </ProtectedRoute>
        }/>
        <Route path='/facility-dashboard/*' element={
          <ProtectedRoute requiredRole="FacilityOwner">
            <FacilityDashboard/>
          </ProtectedRoute>
        }/>
        <Route path='/admin-dashboard/*' element={
          <ProtectedRoute requiredRole="Admin">
            <AdminDashboard/>
          </ProtectedRoute>
        }/>
      </Routes>
    </>
  )
}

export default App