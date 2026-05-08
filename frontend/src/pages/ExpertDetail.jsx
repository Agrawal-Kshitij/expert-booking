import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { fetchExpertDetail } from '../api';

const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const loadExpert = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchExpertDetail(id);
        setExpert(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadExpert();
  }, [id]);

  useEffect(() => {
    const socketClient = io(socketUrl, { transports: ['websocket'] });
    socketClient.emit('joinExpertRoom', id);
    socketClient.on('slotBooked', (payload) => {
      if (payload.expertId === id) {
        setUpdates((current) => [...current, payload]);
      }
    });
    setSocket(socketClient);

    return () => {
      socketClient.emit('leaveExpertRoom', id);
      socketClient.disconnect();
    };
  }, [id]);

  const availableSlots = useMemo(() => {
    if (!expert?.availableSlots) return [];
    return expert.availableSlots.map((group) => {
      const updatedBookIds = updates.filter((u) => u.date === group.date).map((u) => u.timeSlot);
      return {
        ...group,
        booked: [...group.bookedSlots, ...updatedBookIds],
      };
    });
  }, [expert, updates]);

  const handleBooking = (date, timeSlot) => {
    navigate(`/booking/${id}?date=${encodeURIComponent(date)}&timeSlot=${encodeURIComponent(timeSlot)}`);
  };

  if (loading) {
    return <div className="status-message">Loading expert details...</div>;
  }

  if (error) {
    return <div className="status-message error">{error}</div>;
  }

  if (!expert) {
    return null;
  }

  return (
    <section className="page-container">
      <div className="detail-header">
        <div>
          <h1>{expert.name}</h1>
          <p className="meta">{expert.category} • {expert.experience} years • Rating {expert.rating.toFixed(1)}</p>
          <p>{expert.bio || 'No bio available.'}</p>
        </div>
        <button className="button" onClick={() => navigate('/')}>
          Back to list
        </button>
      </div>

      <h2>Available time slots</h2>
      {availableSlots.length === 0 && <div className="status-message">No slots available at the moment.</div>}
      <div className="slots-grid">
        {availableSlots.map((group) => (
          <div key={group.date} className="slot-group">
            <h3>{group.date}</h3>
            <div className="slot-list">
              {group.slots.length === 0 && <div className="slot empty">Fully booked</div>}
              {group.slots.map((slot) => {
                const isBooked = group.booked.includes(slot);
                return (
                  <button
                    key={slot}
                    className={`slot ${isBooked ? 'booked' : ''}`}
                    disabled={isBooked}
                    onClick={() => handleBooking(group.date, slot)}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExpertDetail;
