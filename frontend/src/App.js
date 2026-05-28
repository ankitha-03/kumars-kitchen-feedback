import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage    from './pages/LandingPage';
import MenuPage       from './pages/MenuPage';
import FeedbackPage   from './pages/FeedbackPage';
import ThankYouPage   from './pages/ThankYouPage';
import AdminDashboard from './pages/AdminDashboard';
import ChefPage       from './pages/ChefPage';
import PageTransition from './components/PageTransition';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <PageTransition key={location.pathname}>
      <Routes location={location}>
        <Route path="/"                          element={<LandingPage />} />
        <Route path="/menu/:tableId"             element={<MenuPage />} />
        <Route path="/feedback/:tableId/:dishId" element={<FeedbackPage />} />
        <Route path="/thankyou"                  element={<ThankYouPage />} />
        <Route path="/admin"                     element={<AdminDashboard />} />
        <Route path="/chef"                      element={<ChefPage />} />
      </Routes>
    </PageTransition>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
