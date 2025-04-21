import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BottleForm from './components/BottleForm';
import MedicationForm from './components/MedicationForm';
import Dashboard from './components/Dashboard';
import DailyReport from './components/DailyReport';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Baby Bottle Tracker</h1>
          </div>
        </header>
        
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto py-3 space-x-6">
              <Link to="/" className="text-blue-600 font-medium whitespace-nowrap">
                Dashboard
              </Link>
              <Link to="/bottle" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">
                Ajouter un biberon
              </Link>
              <Link to="/medication" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">
                Ajouter un médicament
              </Link>
              <Link to="/report" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">
                Rapport quotidien
              </Link>
            </div>
          </div>
        </nav>
        
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bottle" element={<BottleForm />} />
            <Route path="/medication" element={<MedicationForm />} />
            <Route path="/report" element={<DailyReport />} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t mt-auto py-4">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            Baby Bottle Tracker &copy; {new Date().getFullYear()} - MVP Application
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
