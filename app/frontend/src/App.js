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

function App() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  useEffect(()=>{
    if(localStorage.getItem('token')){
      dispatch(getUserProfile())
    }
  },[dispatch])

  if(localStorage.getItem('token') && !user.user){
    return <p>...loading</p>
  }
  return (
    <div>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/customerlogin' element={<CustomerLogin />}/>
          <Route path='/expertlogin' element={<ExpertLogin />}/>
          <Route path='/expertregister' element={<ExpertRegister />}/>
          <Route path='/create-expert' element={<ExpertCreation />}/>
          <Route path="/expert-dashboard" element={ 
            <MainLayout> 
              <ExpertDashboard />
            </MainLayout>
          }/>
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
          <Route path="/experts/availability" element={ 
            <MainLayout> 
              <ExpertAvailability />
            </MainLayout>
          }/>
          <Route path="/experts/:id" element={<ExpertDetails />}/>
          <Route path="/experts/:id/categories" element={<CategoryDetails />}/>
          <Route path="/service-requests" element={<ServiceRequest />}/>
          
        </Routes>
    </div>
  );
}

export default App;
