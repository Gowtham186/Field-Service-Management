import './index.css'
import { Routes, Route } from 'react-router-dom'
import CustomerLogin from './pages/CustomerLogin';
import ExpertLogin from './pages/ExpertLogin';
import Home from './pages/Home';
import ExpertRegister from './pages/ExpertRegister';
import ExpertCreation from './pages/ExpertCreation';
import Dashboard from './components/Dashboard';
import MainLayout from './components/MainLayout';
import VerifyExperts from './pages/VerifyExperts';

function App() {
  return (
    <div>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/customerlogin' element={<CustomerLogin />}/>
          <Route path='/expertlogin' element={<ExpertLogin />}/>
          <Route path='/expertregister' element={<ExpertRegister />}/>
          <Route path='/create-expert' element={<ExpertCreation />}/>
          <Route path="/dashboard" element={ 
            <MainLayout> 
              <Dashboard />
            </MainLayout>
          }/>
          <Route path="/verify-experts" element={ 
            <MainLayout> 
              <VerifyExperts />
            </MainLayout>
          }/>
        </Routes>
    </div>
  );
}

export default App;
