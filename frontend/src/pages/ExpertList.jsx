import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchExperts } from '../api';

const categories = ['All', 'Career Coaching', 'Startup Mentoring', 'Leadership Training', 'Technical Interview Prep'];

const ExpertList = () => {
  const [experts, setExperts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadExperts = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchExperts({ page, search, category: category !== 'All' ? category : '' });
      setExperts(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperts();
  }, [page, category]);

  const handleSearch = async (event) => {
    event.preventDefault();
    setPage(1);
    loadExperts();
  };

  return (
    <section className="page-container">
      <h1>Experts</h1>
      <form className="filter-row" onSubmit={handleSearch}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name"
          aria-label="Search experts"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <button type="submit">Search</button>
      </form>

      {loading && <div className="status-message">Loading experts...</div>}
      {error && <div className="status-message error">{error}</div>}
      {!loading && !error && experts.length === 0 && (
        <div className="status-message">No experts found.</div>
      )}

      <div className="grid-list">
        {experts.map((expert) => (
          <article key={expert._id} className="card">
            <h2>{expert.name}</h2>
            <div className="meta">{expert.category}</div>
            <p>Experience: {expert.experience} years</p>
            <p>Rating: {expert.rating.toFixed(1)}</p>
            <Link className="button" to={`/experts/${expert._id}`}>View details</Link>
          </article>
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>Page {page} of {pagination.pages}</span>
          <button disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default ExpertList;