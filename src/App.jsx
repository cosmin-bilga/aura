import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout'; 
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Login from './pages/Login';
import Register from './pages/Register'; 
import './styles/main.css'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} /> 
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/connexion" element={<Login />} /> 
          <Route path="/inscription" element={<Register />} /> 
          <Route path="*" element={<h1>404 - Page not found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;