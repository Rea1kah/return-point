import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Loader from './components/Loader';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ListPage from './pages/ListPage';
import Detail from './pages/Detail';
import ReportForm from './pages/ReportForm';
import EditForm from './pages/EditForm';
import NotFound from './pages/NotFound';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if(loading)
  {
    return <div className='flex-center'><Loader /></div>;
  }

  if(!isAuthenticated)
  {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));

function AppRoutes() 
{
  return (
    <Suspense fallback={<div style={{height: '100vh', display: 'flex', alignItems:'center', justifyContent:'center'}}><Loader /></div>}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="lost" element={<ListPage />} />
        <Route path="found" element={<ListPage />} />
        <Route path="detail/:id" element={<Detail />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />          
          <Route path="report/:type" element={<ReportForm />} />
          <Route path="edit-lost/:id" element={<EditForm />} />
          <Route path="edit-found/:id" element={<EditForm />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes;