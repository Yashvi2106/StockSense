import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { MainLayout } from './layouts/MainLayout';

import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { StockDetails } from './pages/StockDetails';
import { WatchlistPage } from './pages/WatchlistPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { BacktestPage } from './pages/BacktestPage';
import { AlertsPage } from './pages/AlertsPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing & Auth */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard & Authenticated Hub Layout */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/stock/:symbol" element={<StockDetails />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/backtest" element={<BacktestPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
