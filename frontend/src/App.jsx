import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from "./pages/Register";
import Professionals from "./pages/Professionals";
import ProfessionalDetails from "./pages/ProfessionalDetails";
import Dashboard from "./pages/Dashboard";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
  path="/professionals"
  element={<Professionals />}
/>
<Route
  path="/dashboard"
  element={<Dashboard />}
/>
   <Route
          path="/professionals/:id"
          element={<ProfessionalDetails />}
        />

       

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App