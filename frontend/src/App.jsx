import { NavLink, Route, Routes } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import ScannerPage from './pages/ScannerPage';
import DetailPage from './pages/DetailPage';

const navClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-200'
  }`;

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-5xl gap-2 p-4">
          <NavLink to="/" className={navClass} end>
            Admin Panel
          </NavLink>
          <NavLink to="/scan" className={navClass}>
            Scanner
          </NavLink>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl p-4 md:p-8">
        <Routes>
          <Route path="/" element={<AdminPage />} />
          <Route path="/scan" element={<ScannerPage />} />
          <Route path="/items/:code" element={<DetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
