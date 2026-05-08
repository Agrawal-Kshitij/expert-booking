import { Routes, Route, Link } from 'react-router-dom';
import ExpertList from './pages/ExpertList';
import ExpertDetail from './pages/ExpertDetail';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';

const App = () => {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <Link to="/" className="logo">Expert Booking</Link>
        </div>
        <nav>
          <Link to="/">Experts</Link>
          <Link to="/my-bookings">My Bookings</Link>
        </nav>
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
