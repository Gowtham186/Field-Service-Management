import './index.css'
import { Routes, Route } from 'react-router-dom'
import CustomerLogin from './pages/CustomerLogin';
import ExpertLogin from './pages/ExpertLogin';
import Home from './pages/Home';
import ExpertRegister from './pages/ExpertRegister';
import ExpertCreation from './pages/ExpertCreation';

function App() {
  return (
    <div>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/customerlogin' element={<CustomerLogin />}/>
          <Route path='/expertlogin' element={<ExpertLogin />}/>
          <Route path='/expertregister' element={<ExpertRegister />}/>
          <Route path='/create-expert' element={<ExpertCreation />}/>
        </Routes>
    </div>
  );
}

export default App;
