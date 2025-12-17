import React, { useEffect, useState } from 'react';
import itemService from '../services/item.service';
import ItemCard from './ItemCard';
import Loader from './Loader';
import '../styles/RecentList.css';

export default function RecentList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchLatest() {
      try {
        const [foundResponse, lostResponse] = await Promise.all([
          itemService.getItems({ type: 'found', limit: 3 }),
          itemService.getItems({ type: 'lost', limit: 3 })
        ]);

        if (!mounted) return;

        const found = (Array.isArray(foundResponse) ? foundResponse : foundResponse.data || [])
          .map(item => ({...item, type: 'found'}));
        
        const lost = (Array.isArray(lostResponse) ? lostResponse : lostResponse.data || [])
          .map(item => ({...item, type: 'lost'}));
        
        const merged = [...found, ...lost]
          .sort((a,b)=> new Date(b.date || b.created_at) - new Date(a.date || a.created_at))
          .slice(0,6);

        setItems(merged);
      } catch (e) {
        console.error(e);
      } finally { 
        if (mounted) setLoading(false);
      }
    }
    fetchLatest();
    return () => { mounted = false; };
  }, []);

  if (loading) return <Loader />;

  return (
    <section className="recent-section">
      <h2 className="section-title">Latest Reports</h2>
      <div className="items-grid">
        {items.length === 0 && (
          <div className="empty-state-card">
            No reports have been submitted yet.
          </div>
        )}
        {items.map(it => <ItemCard key={it.id} item={it} />)}
      </div>
    </section>
  );
}