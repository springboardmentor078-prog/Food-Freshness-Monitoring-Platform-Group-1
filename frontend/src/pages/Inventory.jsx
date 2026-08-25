import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import './Inventory.css';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${API_URL}/api/inventory`, {
          headers: {
            'Bypass-Tunnel-Reminder': 'true'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        }
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'All' || item.status.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search inventory..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="actions" style={{ display: 'flex', gap: '10px' }}>
          <select 
            className="btn btn-secondary" 
            style={{ appearance: 'auto', backgroundColor: '#1a1d21', color: '#fff', border: '1px solid #333' }}
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="FRESH">Fresh Only</option>
            <option value="SPOILED">Spoiled Only</option>
          </select>
          <button className="btn btn-primary" onClick={() => alert('Please use the Freshness Scanner page to automatically add items with AI analysis!')}>
            <Plus size={18} /> Add Item
          </button>
        </div>
      </div>

      <div className="glass-card table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading inventory...</div>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Freshness Score</th>
                <th>Status</th>
                <th>Shelf Life</th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item._id || Math.random()}>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.category}</td>
                    <td>
                      <div className="score-bar-container">
                        <div className="score-bar" style={{ 
                          width: `${item.score}%`,
                          backgroundColor: item.score > 70 ? 'var(--success)' : item.score > 30 ? 'var(--warning)' : 'var(--danger)'
                        }}></div>
                      </div>
                      <span className="score-text">{item.score}%</span>
                    </td>
                    <td>
                      <span className={`badge badge-${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span>
                    </td>
                    <td>{item.shelfLife || 'N/A'}</td>
                    <td style={{ maxWidth: '200px', fontSize: '0.85rem' }}>{item.recommendation || 'No recommendation'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>
                    No items found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Inventory;
