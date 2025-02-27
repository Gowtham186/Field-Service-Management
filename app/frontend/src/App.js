import './index.css'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import CustomerLogin from './pages/CustomerLogin';
import ExpertLogin from './pages/ExpertLogin';
import Home from './pages/Home';
import ExpertRegister from './pages/ExpertRegister';
import ExpertCreation from './pages/ExpertCreation';
import MainLayout from './components/MainLayout';
import VerifyExperts from './pages/Admin/VerifyExperts';
//import MaterialUIForm from './components/Material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from './redux/slices.js/user-slice';
import ManageCategories from './pages/Admin/ManageCategories';
import ExpertDetails from './pages/ExpertDetails';
import CategoryDetails from './pages/CategoryDetails';
import ExpertAvailability from './pages/Expert/ExpertAvailability';
import ServiceRequest from './pages/Customer/ServiceRequest';
import ExpertDashboard from './pages/Expert/ExpertDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageExperts from './pages/Admin/ManageExperts';
import ExpertCalendar from './pages/Expert/Expertcalendar';
import NewBookings from './pages/Expert/NewBookings';
import ServiceDetails from './pages/ServiceDetails';
import MyBookings from './pages/Customer/MyBookings';
import LiveTracking from './pages/Tracking/LiveTracking';
import CustomerTracking from './pages/Tracking/CustomerTracking';
import { ToastContainer } from 'react-toastify';
import NotificationComponent from './components/NotificationComponent';
import WorkTracking from './pages/Expert/WorkTracking';
import ManageBookings from './pages/Admin/ManageBookings';
import ExpertProfile from './pages/Expert/ExpertProfile';
import ProtectedRoute from './components/ProtectedRoute';
import Success from './components/Success';
import Failed from './components/Failed';
import ServiceInvoice from './pages/Customer/ServiceInvoice';
import CustomerCalendar from './pages/Customer/CustomerCalendar';
import Cart from './pages/Customer/Cart';
import ExpertRevenue from './pages/Expert/ExpertRevenue';
import ExpertBookingsAnalytics from './pages/Expert/ExpertBookingsAnalytics';
import ExpertReviewsPage from './pages/Expert/ExpertReviewsPage';
import ExpertHistory from './pages/Expert/ExpertHistory';
import ResetPassword from './pages/ResetPassowrd';
import UnauthorizedPage from './components/UnauthorizedPage';
import NotFoundPage from './components/NotFoundPage';

function App() {
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state) => state?.user)

  useEffect(()=>{
    if(localStorage.getItem('token')){
      dispatch(getUserProfile())
    }
  },[dispatch])

  if(loading){
    return <p>loading...</p>
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />    
      {user && user?._id && user?.role && (
      <NotificationComponent userId={user?._id} role={user?.role} />
    )}

      <Routes>
          <Route path='/' element={<Home />}/>
          {/* customer */}
          <Route path='/customerlogin' element={<CustomerLogin />}/>
          <Route path="/my-bookings" element={
            <MainLayout>
              <MyBookings />
            </MainLayout>
          }/>
          <Route path="/cart" element={
            <MainLayout>
              <Cart />
            </MainLayout>
            }/>
          <Route path="/my-calendar" element={<CustomerCalendar />}/>
          <Route path="/experts/:id" element={
            <MainLayout>
              <ExpertDetails />
            </MainLayout>
            }/>
          <Route path="/experts/:id/categories" element={
            <MainLayout>
              <CategoryDetails />
            </MainLayout>
            }/>
          <Route path="/service-requests" element={
            <ProtectedRoute role='customer'>
              <MainLayout>
                <ServiceRequest />
              </MainLayout>  
            </ProtectedRoute>
            }/>
          <Route path="/track-expert/:expertId" element={<CustomerTracking />}/>
          <Route path="/track-work/:bookingId" element={<ServiceInvoice />}/>

          {/* expert */}
          <Route path='/expertlogin' element={<ExpertLogin />}/>
          <Route path='/expertregister' element={
            <ExpertRegister />
          }/>
          <Route path='/create-expert' element={
            <ProtectedRoute role='expert'>
              <ExpertCreation />
            </ProtectedRoute>}/>
          <Route path="/expert-dashboard" element={ 
            <ProtectedRoute role='expert'>
              <MainLayout> 
                <ExpertDashboard />
              </MainLayout>
            </ProtectedRoute>
          }/>
          <Route path="/experts/availability" element={ 
            <ProtectedRoute role='expert'>
              <MainLayout> 
                <ExpertAvailability />
              </MainLayout>
            </ProtectedRoute>
          }/>
          <Route path="/new-bookings" element={ 
            <ProtectedRoute role='expert'>
              <MainLayout> 
                <NewBookings />
              </MainLayout>
            </ProtectedRoute>
          }/>
          <Route path="/experts/calendar" element={ 
            <ProtectedRoute role='expert'>
              <MainLayout> 
                <ExpertCalendar />
              </MainLayout>
            </ProtectedRoute>
          }/>
          <Route path="/service-details" element={ 
            <ProtectedRoute role='expert'>
              <MainLayout> 
                <ServiceDetails />
              </MainLayout>
            </ProtectedRoute>
          }/>
          <Route path="/live-tracking/:serviceId" element={
            <ProtectedRoute role='expert'>
              <LiveTracking />
            </ProtectedRoute>}/> 

          <Route path="/service-requests/:id" element={ 
            <ProtectedRoute role='expert'>
              <MainLayout>
                <WorkTracking />
              </MainLayout>
            </ProtectedRoute>
          }/>
          <Route path="/expert/profile/:id" element={
            <ProtectedRoute role='expert'>
              <MainLayout>
                <ExpertProfile />
              </MainLayout>
            </ProtectedRoute> 
          }/>
          <Route path="/experts/:id/history" element={
            <ProtectedRoute role='expert'>
              <MainLayout>
                <ExpertHistory />
              </MainLayout>
            </ProtectedRoute> 
          }/>
          <Route path="/experts/revenue" element={
            <ProtectedRoute role='expert'>
              <MainLayout>
                <ExpertRevenue />
              </MainLayout>
            </ProtectedRoute> 
          }/>
          <Route path="/experts/bookings-analytics" element={
            <ProtectedRoute role='expert'>
              <MainLayout>
                <ExpertBookingsAnalytics />
              </MainLayout>
            </ProtectedRoute> 
          }/>
          <Route path="/experts/reviews" element={
            <ProtectedRoute role='expert'>
              <MainLayout>
                <ExpertReviewsPage />
              </MainLayout>
            </ProtectedRoute> 
          }/>
          <Route path="/reset-password" element={
            <ProtectedRoute>
              <MainLayout>
                <ResetPassword />
              </MainLayout>
            </ProtectedRoute> 
          }/>

          
          {/* admin */}
          <Route path="/admin-dashboard" element={ 
            <ProtectedRoute role='admin'>
              <MainLayout> 
                <AdminDashboard />
              </MainLayout>
            </ProtectedRoute>
          }/>
          <Route path="/verify-experts" element={ 
            <ProtectedRoute role='admin'>
              <MainLayout> 
                <VerifyExperts />
              </MainLayout>
            </ProtectedRoute>
          }/>
          <Route path="/manage-experts" element={ 
            <ProtectedRoute role='admin'>
              <MainLayout> 
                <ManageExperts />
              </MainLayout>
            </ProtectedRoute>
          }/>
          <Route path="/manage-categories" element={ 
            <ProtectedRoute role='admin'>
              <MainLayout> 
                <ManageCategories />
              </MainLayout>
            </ProtectedRoute>
          }/>
          <Route path="/manage-bookings" element={ 
            <ProtectedRoute role='admin'>
              <MainLayout> 
                <ManageBookings />
              </MainLayout>
            </ProtectedRoute>
          }/>
          
          {/* payment */}
          <Route path='/payment/success' element={<Success />}/>
          <Route path='/payment/failed' element={<Failed />}/>
          <Route path='/unauthorized' element={<UnauthorizedPage />}/>
          <Route path='*' element={<NotFoundPage />}/>

        </Routes>
    </>
  );
}

export default App;
