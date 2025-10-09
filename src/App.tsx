import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './lib/Layout';
import Dashboard from './pages/Dashboard';
import CollectionMap from './pages/CollectionMap';
import MyPoints from './pages/citizen/MyPoints';
import Rewards from './pages/citizen/Rewards';
import UserSetup from './pages/UserSetup';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import AvailableMaterials from './pages/waster-picker/AvailableMaterials';
import MyRoutes from './pages/waster-picker/MyRoutes';
import MaterialMarketplace from './pages/artisan/MaterialMarketPlace';
import MyRequests from './pages/artisan/MyRequests';
import Redemptions from './pages/business/Redemptions';
import BusinessStats from './pages/business/BusinessStats';
import MunicipalDashboard from './pages/municipal/MunicipalDashboard';
import UserManagement from './pages/municipal/UserManagement';

export function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pontos" element={<CollectionMap />} />
          <Route path='/meus-pontos' element={<MyPoints />} />
          <Route path='/recompensas' element={<Rewards />} />
          <Route path='/setup' element={<UserSetup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/perfil' element={<UserProfile />} />
          <Route path='/materiais' element={<AvailableMaterials />} />
          <Route path='/minhas-rotas' element={<MyRoutes />} />
          <Route path='/marketplace' element={<MaterialMarketplace />} />
          <Route path='/meus-pedidos' element={<MyRequests />} />
          <Route path='/resgates' element={<Redemptions />} />
          <Route path='/estatisticas' element={<BusinessStats />} />
          <Route path='/municipal-dashboard' element={<MunicipalDashboard />} />
          <Route path='/usuarios' element={<UserManagement />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
