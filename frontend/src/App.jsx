import { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ExpertList from './pages/ExpertList';
import ExpertDetail from './pages/ExpertDetail';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';

const App = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('booking-theme');
    const initialTheme = storedTheme || 'light';
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    window.localStorage.setItem('booking-theme', nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <Link to="/" className="logo">Expert Booking</Link>
          <p className="section-text">Book live sessions with top experts and manage your appointments in one place.</p>
        </div>
        <div className="header-actions">
          <button type="button" className="theme-toggle button secondary-button" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <nav>
            <Link to="/">Experts</Link>
            <Link to="/my-bookings">My Bookings</Link>
          </nav>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<ExpertList />} />
          <Route path="/experts/:id" element={<ExpertDetail />} />
          <Route path="/booking/:id" element={<BookingForm />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
