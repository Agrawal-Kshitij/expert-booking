import { useState } from 'react';
import { fetchBookingsByEmail } from '../api';

const MyBookings = () => {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await fetchBookingsByEmail(email);
      setBookings(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-container">
      <h1>My Bookings</h1>
      <form className="filter-row" onSubmit={handleSearch}>
        <input
          type="email"
          placeholder="Enter your booking email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {loading && <div className="status-message">Loading bookings...</div>}
      {error && <div className="status-message error">{error}</div>}

      {bookings.length > 0 && (
        <div className="booking-list">
          {bookings.map((booking) => (
            <article key={booking._id} className="card booking-card">
              <h2>{booking.expert?.name || 'Unknown expert'}</h2>
              <p>{booking.expert?.category}</p>
              <p>Date: {booking.date}</p>
              <p>Time: {booking.timeSlot}</p>
              <p>Status: <strong>{booking.status}</strong></p>
              <p>Email: {booking.clientEmail}</p>
              <p>Phone: {booking.clientPhone}</p>
            </article>
          ))}
        </div>
      )}

      {!loading && bookings.length === 0 && !error && (
        <div className="status-message">Search by email to view your bookings.</div>
      )}
    </section>
  );
};

export default MyBookings;
