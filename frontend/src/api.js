const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || 'API request failed');
  }
  return data;
};

export const fetchExperts = async ({ page, search, category }) => {
  const params = new URLSearchParams();
  if (page) params.set('page', page);
  if (search) params.set('search', search);
  if (category) params.set('category', category);
  return request(`${API_URL}/experts?${params.toString()}`);
};

export const fetchExpertDetail = async (id) => request(`${API_URL}/experts/${id}`);
export const createBooking = async (payload) => request(`${API_URL}/bookings`, {
  method: 'POST',
  body: JSON.stringify(payload),
});
export const fetchBookingsByEmail = async (email) => request(`${API_URL}/bookings?email=${encodeURIComponent(email)}`);
