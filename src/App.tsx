import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import DiscoveryAnimation from './pages/DiscoveryAnimation';
import SalesBattlecards from './pages/SalesBattlecards';
import StrategyRag from './pages/StrategyRag';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 bg-[#0a0a0a]">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/discovery" element={<DiscoveryAnimation />} />
              <Route path="/battlecards" element={<SalesBattlecards />} />
              <Route path="/strategy" element={<StrategyRag />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
