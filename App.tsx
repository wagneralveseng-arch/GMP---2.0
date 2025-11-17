
import React, { useState } from 'react';
import { LayoutDashboard, Hammer, DollarSign, List, Users, Truck, Settings, Menu, X, User, HardHat } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Obras from './pages/Obras';
import Financeiro from './pages/Financeiro';
import Madeireiras from './pages/Madeireiras';
import Cadastro from './pages/Cadastro';
import Materiais from './pages/Materiais';
import Perfil from './pages/Perfil';

type Page = 'Obras' | 'Financeiro' | 'Cadastro' | 'Madeireiras' | 'Materiais' | 'Perfil' | 'Dashboard';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Obras');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  const avatarSrc = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGNsaXBQYXRoIGlkPSJjaXJjbGVWaWV3Ij48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgLz48L2NsaXBQYXRoPjwvZGVmcz48ZyBjbGlwLXBhdGg9InVybCgjY2lyY2xlVmlldykiPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRTBFMEUwIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI2NSIgcj0iMzAiIGZpbGw9IiNGNURFQjMiLz48cGF0aCBkPSJNIDUwLDUgQSA0NSw0NSAwIDAsMSA5NSw1MCBIIDUgWiBBIDQ1LDQ1IDAgMCwxIDUwLDUiIGZpbGw9IiNGRkMxMDciLz48cmVjdCB4PSI1IiB5PSI0OCIgd2lkdGg9IjkwIiBoZWlnaHQ9IjUiIGZpbGw9IiNGRkEwMDAiLz48L2c+PC9zdmc+";

  const renderPage = () => {
    switch (currentPage) {
      case 'Obras':
        return <Obras />;
      case 'Financeiro':
        return <Financeiro />;
      case 'Cadastro':
        return <Cadastro />;
      case 'Madeireiras':
        return <Madeireiras />;
      case 'Materiais':
        return <Materiais />;
      case 'Perfil':
        return <Perfil />;
      case 'Dashboard':
        return <Dashboard />;
      default:
        return <Obras />;
    }
  };

  const NavItem: React.FC<{ page: Page; icon: React.ReactNode; label: string }> = ({ page, icon, label }) => (
    <li
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
        currentPage === page
          ? 'bg-[#D88021] text-white'
          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
      }`}
      onClick={() => setCurrentPage(page)}
    >
      {icon}
      <span className="ml-4 font-medium">{label}</span>
    </li>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white text-gray-800 shadow-xl transition-all duration-300 ${
          isSidebarOpen ? 'w-72' : 'w-0'
        } overflow-hidden flex-shrink-0 relative`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <div className="flex items-center">
            <HardHat size={28} className="text-[#D88021] mr-3" />
            <h1 className="text-xl font-bold text-[#D88021]">Gestor Marceneiro Pró</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X size={24} />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <NavItem page="Obras" icon={<Hammer size={20} />} label="Obras" />
            <NavItem page="Financeiro" icon={<DollarSign size={20} />} label="Financeiro" />
            <NavItem page="Cadastro" icon={<Users size={20} />} label="Cadastro" />
            <NavItem page="Madeireiras" icon={<List size={20} />} label="Madeireiras" />
            <NavItem page="Materiais" icon={<Truck size={20} />} label="Materiais" />
            <NavItem page="Perfil" icon={<User size={20} />} label="Perfil" />
            <NavItem page="Dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-600 mr-4">
              <Menu size={24} />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800">{currentPage}</h2>
          </div>
          <div className="flex items-center space-x-4">
             <span className="text-gray-700 font-medium">Olá, Usuário</span>
             <img src={avatarSrc} alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
