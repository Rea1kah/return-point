import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import '../styles/ItemCard.css';

export default function ItemCard({ item }) {
  const isLost = item.type === 'lost';
  const isClaimed = item.status === 'claimed' || item.status === 'resolved';

  const formattedDate = new Date(item.date || item.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className={`pro-card ${isClaimed ? 'pro-card-claimed' : ''}`}>
      <div className="pro-card-image-wrapper">
        <span className={`pro-badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
          {isLost ? 'Kehilangan' : 'Ditemukan'}
        </span>
        
        {isClaimed && (
          <div className="claimed-overlay">
            <span>Selesai</span>
          </div>
        )}

        <img 
          src={item.photo} 
          alt={item.name} 
          className="pro-card-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }} 
        />
      </div>

      <div className="pro-card-content">
        <h3 className="pro-card-title" title={item.name}>
          {item.name}
        </h3>

        <div className="pro-card-meta">
          <div className="meta-item">
            <FaMapMarkerAlt className="meta-icon" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="meta-item">
            <FaCalendarAlt className="meta-icon" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <p className="pro-card-desc">
          {item.description 
            ? (item.description.length > 60 ? item.description.substring(0, 60) + '...' : item.description)
            : 'Tidak ada deskripsi tambahan.'}
        </p>

        <div className="pro-card-footer">
          <Link to={`/detail/${item.id}`} className={`btn-detail ${isLost ? 'btn-outline-lost' : 'btn-outline-found'}`}>
            Lihat Detail <FaArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}