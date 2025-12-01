import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import SocialBar from '../components/SocialBar/SocialBar';

const MainLayout = () => {
  return (
    <div>
      <Header />
      <SocialBar />
      <main >
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};
export default MainLayout;