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
import ExpertAvailability from './components/ExpertAvailability';
import ServiceRequest from './pages/ServiceRequest';
import ExpertDashboard from './pages/ExpertDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManageExperts from './pages/ManageExperts';
import ExpertCalendar from './pages/Expertcalendar';
// import ManageBookings from './pages/NewBookings';
import NewBookings from './pages/NewBookings';
import ServiceDetails from './pages/ServiceDetails';
import MyBookings from './pages/MyBookings';
import LiveTracking from './pages/LiveTracking';
import CustomerTracking from './pages/CustomerTracking';
import { ToastContainer } from 'react-toastify';
import NotificationComponent from './components/NotificationComponent';
import WorkTracking from './pages/WorkTracking';
import TrackWork from './pages/TrackWork';
import ManageBookings from './pages/ManageBookings';
import ExpertProfile from './pages/ExpertProfile';

function App() {
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state) => state?.user)

  useEffect(()=>{
    if(localStorage.getItem('token')){
      dispatch(getUserProfile())
    }
  },[dispatch])

  // if(localStorage.getItem('token') && !user?.user){
  //   return <p>...loading</p>
  // }
  if(loading){
    return <p>loading...</p>
  }
  // if (!user || !user._id || !user.role) {
  //   return <p>...loading</p>;
  // }

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />    
      {user && user?._id && user?.role && (
      <NotificationComponent userId={user._id} role={user.role} />
    )}

      <Routes>
          <Route path='/' element={<Home />}/>
          {/* customer */}
          <Route path='/customerlogin' element={<CustomerLogin />}/>
          <Route path="/my-bookings" element={<MyBookings />}/>
          <Route path="/experts/:id" element={<ExpertDetails />}/>
          <Route path="/experts/:id/categories" element={<CategoryDetails />}/>
          <Route path="/service-requests" element={<ServiceRequest />}/>
          <Route path="/track-expert/:expertId" element={<CustomerTracking />}/>
          <Route path="/track-work/:bookingId" element={<TrackWork />}/>

          {/* expert */}
          <Route path='/expertlogin' element={<ExpertLogin />}/>
          <Route path='/expertregister' element={<ExpertRegister />}/>
          <Route path='/create-expert' element={<ExpertCreation />}/>
          <Route path="/expert-dashboard" element={ 
            <MainLayout> 
              <ExpertDashboard />
            </MainLayout>
          }/>
          <Route path="/experts/availability" element={ 
            <MainLayout> 
              <ExpertAvailability />
            </MainLayout>
          }/>
          <Route path="/new-bookings" element={ 
            <MainLayout> 
              <NewBookings />
            </MainLayout>
          }/>
          <Route path="/experts/calendar" element={ 
            <MainLayout> 
              <ExpertCalendar />
            </MainLayout>
          }/>
          <Route path="/service-details" element={ 
            <MainLayout> 
              <ServiceDetails />
            </MainLayout>
          }/>
          <Route path="/live-tracking/:serviceId" element={<LiveTracking />}/>

          <Route path="/service-requests/:id" element={ 
            <MainLayout>
              <WorkTracking />
            </MainLayout>
          }/>
          <Route path="/expert/profile/:id" element={ 
            <MainLayout>
              <ExpertProfile />
            </MainLayout>
          }/>

          
          {/* admin */}
          <Route path="/admin-dashboard" element={ 
            <MainLayout> 
              <AdminDashboard />
            </MainLayout>
          }/>
          <Route path="/verify-experts" element={ 
            <MainLayout> 
              <VerifyExperts />
            </MainLayout>
          }/>
          <Route path="/manage-experts" element={ 
            <MainLayout> 
              <ManageExperts />
            </MainLayout>
          }/>
          <Route path="/manage-categories" element={ 
            <MainLayout> 
              <ManageCategories />
            </MainLayout>
          }/>
          <Route path="/manage-bookings" element={ 
            <MainLayout> 
              <ManageBookings />
            </MainLayout>
          }/>
          
        </Routes>
    </>
  );
}

export default App;
