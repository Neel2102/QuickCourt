import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'

const App = () => {

return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/dashboard/*' element={<Dashboard/>}/>
      </Routes>
    </>
  )
}

export default App