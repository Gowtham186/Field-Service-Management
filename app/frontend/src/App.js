import './index.css'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import CustomerLogin from './pages/CustomerLogin';
import ExpertLogin from './pages/ExpertLogin';
import Home from './pages/Home';
import ExpertRegister from './pages/ExpertRegister';
import ExpertCreation from './pages/ExpertCreation';
import MainLayout from './components/MainLayout';
import VerifyExperts from './pages/VerifyExperts';
//import MaterialUIForm from './components/Material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from './redux/slices.js/user-slice';
import ManageCategories from './pages/ManageCategories';
import ExpertDetails from './pages/ExpertDetails';
import CategoryDetails from './pages/CategoryDetails';
import ExpertAvailability from './pages/Expert/ExpertAvailability';
import ServiceRequest from './pages/ServiceRequest';
import ExpertDashboard from './pages/Expert/ExpertDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManageExperts from './pages/ManageExperts';
import ExpertCalendar from './pages/Expert/Expertcalendar';
// import ManageBookings from './pages/NewBookings';
import NewBookings from './pages/NewBookings';
import ServiceDetails from './pages/ServiceDetails';
import MyBookings from './pages/MyBookings';
import LiveTracking from './pages/LiveTracking';
import CustomerTracking from './pages/CustomerTracking';
import { ToastContainer } from 'react-toastify';
import NotificationComponent from './components/NotificationComponent';
import WorkTracking from './pages/WorkTracking';
import ManageBookings from './pages/ManageBookings';
import ExpertProfile from './pages/Expert/ExpertProfile';
import ProtectedRoute from './components/ProtectedRoute';
import Success from './components/Success';
import Failed from './components/Failed';
import ServiceInvoice from './pages/ServiceInvoice';
import CustomerCalendar from './pages/CustomerCalendar';
import Cart from './pages/Cart';
import ExpertRevenue from './pages/Expert/ExpertRevenue';
import ExpertBookingsAnalytics from './pages/Expert/ExpertBookingsAnalytics';
import ExpertReviewsPage from './pages/Expert/ExpertReviewsPage';
import ExpertHistory from './pages/Expert/ExpertHistory';

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
            <MainLayout>
              <ServiceRequest />
            </MainLayout>
            }/>
          <Route path="/track-expert/:expertId" element={<CustomerTracking />}/>
          <Route path="/track-work/:bookingId" element={<ServiceInvoice />}/>

          {/* expert */}
          <Route path='/expertlogin' element={<ExpertLogin />}/>
          <Route path='/expertregister' element={<ExpertRegister />}/>

          <Route path='/create-expert' element={
            <ProtectedRoute>
              <ExpertCreation />
            </ProtectedRoute>}/>
          <Route path="/expert-dashboard" element={ 
            <ProtectedRoute>
              <MainLayout> 
                <ExpertDashboard />
              </MainLayout>
            </ProtectedRoute>
          }/>
          <Route path="/experts/availability" element={ 
            <ProtectedRoute>
              <MainLayout> 
                <ExpertAvailability />
              </MainLayout>
            </ProtectedRoute>
          }/>
          <Route path="/new-bookings" element={ 
            <ProtectedRoute>
              <MainLayout> 
                <NewBookings />
              </MainLayout>
            </ProtectedRoute>
          }/>
          <Route path="/experts/calendar" element={ 
            <ProtectedRoute>
              <MainLayout> 
                <ExpertCalendar />
              </MainLayout>
            </ProtectedRoute>
          }/>
          <Route path="/service-details" element={ 
            <ProtectedRoute>
              <MainLayout> 
                <ServiceDetails />
              </MainLayout>
            </ProtectedRoute>
          }/>
          <Route path="/live-tracking/:serviceId" element={
            <ProtectedRoute>
              <LiveTracking />
            </ProtectedRoute>}/> 

          <Route path="/service-requests/:id" element={ 
            <ProtectedRoute>
              <MainLayout>
                <WorkTracking />
              </MainLayout>
            </ProtectedRoute>
          }/>
          <Route path="/expert/profile/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <ExpertProfile />
              </MainLayout>
            </ProtectedRoute> 
          }/>
          <Route path="/experts/:id/history" element={
            <ProtectedRoute>
              <MainLayout>
                <ExpertHistory />
              </MainLayout>
            </ProtectedRoute> 
          }/>
          <Route path="/experts/revenue" element={
            <ProtectedRoute>
              <MainLayout>
                <ExpertRevenue />
              </MainLayout>
            </ProtectedRoute> 
          }/>
          <Route path="/experts/bookings-analytics" element={
            <ProtectedRoute>
              <MainLayout>
                <ExpertBookingsAnalytics />
              </MainLayout>
            </ProtectedRoute> 
          }/>
          <Route path="/experts/reviews" element={
            <ProtectedRoute>
              <MainLayout>
                <ExpertReviewsPage />
              </MainLayout>
            </ProtectedRoute> 
          }/>

          
          {/* admin */}
          <Route path="/admin-dashboard" element={ 
            <ProtectedRoute>
              <MainLayout> 
                <AdminDashboard />
              </MainLayout>
            </ProtectedRoute>
          }/>
          <Route path="/verify-experts" element={ 
            <ProtectedRoute>
              <MainLayout> 
                <VerifyExperts />
              </MainLayout>
            </ProtectedRoute>
          }/>
          <Route path="/manage-experts" element={ 
            <ProtectedRoute>
              <MainLayout> 
                <ManageExperts />
              </MainLayout>
            </ProtectedRoute>
          }/>
          <Route path="/manage-categories" element={ 
            <ProtectedRoute>
              <MainLayout> 
                <ManageCategories />
              </MainLayout>
            </ProtectedRoute>
          }/>
          <Route path="/manage-bookings" element={ 
            <ProtectedRoute>
              <MainLayout> 
                <ManageBookings />
              </MainLayout>
            </ProtectedRoute>
          }/>
          
          {/* payment */}
          <Route path='/payment/success' element={<Success />}/>
          <Route path='/payment/failed' element={<Failed />}/>

        </Routes>
    </>
  );
}

export default App;
