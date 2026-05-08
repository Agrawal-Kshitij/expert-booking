import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createBooking, fetchExpertDetail } from '../api';

const useQuery = () => new URLSearchParams(useLocation().search);

const BookingForm = () => {
  const { id } = useParams();
  const query = useQuery();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: query.get('date') || '', timeSlot: query.get('timeSlot') || '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadExpert = async () => {
      try {
        const data = await fetchExpertDetail(id);
        setExpert(data);
      } catch (err) {
        setError(err.message);
      }
    };
    loadExpert();
  }, [id]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      expertId: id,
      clientName: form.name,
      clientEmail: form.email,
      clientPhone: form.phone,
      date: form.date,
      timeSlot: form.timeSlot,
      notes: form.notes,
    };

    setLoading(true);
    try {
      const result = await createBooking(payload);
      setSuccess(result.message || 'Booking created successfully');
      setForm((prev) => ({ ...prev, name: '', email: '', phone: '', notes: '' }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-container">
      <div className="detail-header">
        <div>
          <h1>Book a session</h1>
          <p className="meta">{expert ? expert.name : 'Loading expert...'}</p>
        </div>
        <button className="button" onClick={() => navigate(-1)}>Back</button>
      </div>

      <form className="booking-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input value={form.name} onChange={handleChange('name')} required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={handleChange('email')} required />
        </label>
        <label>
          Phone
          <input value={form.phone} onChange={handleChange('phone')} required />
        </label>
        <label>
          Date
          <input type="date" value={form.date} onChange={handleChange('date')} required />
        </label>
        <label>
          Time slot
          <input value={form.timeSlot} onChange={handleChange('timeSlot')} required placeholder="09:00 AM" />
        </label>
        <label>
          Notes
          <textarea value={form.notes} onChange={handleChange('notes')} rows="4" />
        </label>

        {loading && <div className="status-message">Submitting booking...</div>}
        {error && <div className="status-message error">{error}</div>}
        {success && <div className="status-message success">{success}</div>}

        <button type="submit" className="button">Confirm Booking</button>
      </form>
    </section>
  );
};

export default BookingForm;
