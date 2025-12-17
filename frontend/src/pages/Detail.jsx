import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  FaMapMarkerAlt, FaCalendarAlt, FaUser, FaPhone, FaArrowLeft, 
  FaEdit, FaTrashAlt, FaImage, FaMap, FaCommentDots, 
  FaCheckCircle, FaCheckDouble, FaLock, FaSignInAlt, FaExclamationTriangle 
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext'; 
import { useChat } from '../context/ChatContext'; // Import ChatContext
import itemService from '../services/item.service';
import Loader from '../components/Loader';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/Detail.css';

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast(); 
  const { startChat } = useChat(); // Gunakan fungsi startChat
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showSolveModal, setShowSolveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeImageTab, setActiveImageTab] = useState('photo');   

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await itemService.getItemById(id);
        if (response) {
          setItem(response);
        } else {
          setError('Item tidak ditemukan');
        }
      } catch (err) {
        console.error(err);
        setError('Gagal memuat detail barang.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchItem();
  }, [id]);

  const handleDeleteClick = () => setShowDeleteModal(true);

  const executeDelete = async () => {
    try {
      await itemService.deleteItem(id);
      showToast('Laporan berhasil dihapus.', 'success');
      navigate('/'); 
    } catch (err) {
      console.error(err);
      showToast('Gagal menghapus item.', 'error');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleMarkAsSolved = async () => {
    try {
      await itemService.updateStatus(id, 'claimed');
      setItem(prev => ({ ...prev, status: 'claimed' }));
      showToast('Status berhasil diperbarui.', 'success');
      setShowSolveModal(false);
    } catch (err) {
      console.error(err);
      showToast('Gagal memperbarui status.', 'error');
    }
  };

  const handleChatClick = () => {
    if (!user) {
        showToast('Silakan login untuk chat.', 'error');
        return;
    }
    // Siapkan data target user (Pelapor)
    const targetUser = {
        id: item.userId,
        username: item.reporter_name
    };
    startChat(targetUser);
  };

  if (loading) return <div className="detail-loading"><Loader /></div>;
  
  if (error || !item) {
    return (
      <div className="detail-error">
        <h2>Item Tidak Ditemukan</h2>
        <Link to="/" className="btn btn-secondary">Kembali ke Beranda</Link>
      </div>
    );
  }

  const currentImageSrc = activeImageTab === 'photo' ? item.photo : item.location_photo;
  const isClaimed = item.status === 'claimed' || item.status === 'resolved';
  const isLost = item.type === 'lost';
  const displayDate = item.date ? format(new Date(item.date), 'dd MMMM yyyy') : '-';
  const isOwner = user && (String(user.id) === String(item.userId) || user.role === 'admin');

  return (
    <div className="detail-container fade-in">
      <div className="detail-header-nav">
        <button onClick={() => navigate(-1)} className="btn-back">
          <FaArrowLeft /> Kembali
        </button>
      </div>

      <div className={`detail-card ${isClaimed ? 'is-claimed-view' : ''}`}>
        
        <div className="detail-image-section">
          <div className="image-wrapper">
            {currentImageSrc ? (
              <img 
                src={currentImageSrc} 
                alt={item.name} 
                className="detail-image" 
                onError={(e) => {e.target.src = "https://via.placeholder.com/400x300?text=No+Image";}}
              />
            ) : (
              <div className="detail-placeholder">
                <span>{activeImageTab === 'photo' ? 'Tidak ada Foto Barang' : 'Tidak ada Foto Lokasi'}</span>
              </div>
            )}
            <span className={`detail-type-badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
                {isLost ? 'Kehilangan' : 'Penemuan'}
            </span>
          </div>

          <div className="image-controls">
            <button 
              className={`control-btn ${activeImageTab === 'photo' ? 'active' : ''}`}
              onClick={() => setActiveImageTab('photo')}
            >
              <FaImage /> Foto Barang
            </button>
            <button 
              className={`control-btn ${activeImageTab === 'location_photo' ? 'active' : ''}`}
              onClick={() => setActiveImageTab('location_photo')}
              disabled={!item.location_photo}
            >
              <FaMap /> Foto Lokasi
            </button>
          </div>
        </div>

        <div className="detail-info-section">
          <div className="info-header">
            <h1 className="item-title">{item.name}</h1>
            <span className={`status-badge ${isClaimed ? 'status-done' : 'status-open'}`}>
                {isClaimed ? 'Selesai / Kembali' : 'Masih Dicari'}
            </span>
          </div>

          {isClaimed && (
            <div className="claimed-banner">
              <FaCheckCircle size={24} />
              <div>
                <p>Kasus ini telah ditutup.</p>
              </div>
            </div>
          )}

          <div className="meta-grid">
            <div className="meta-row">
              <FaCalendarAlt className="meta-icon" />
              <div>
                <span className="meta-label">Tanggal Kejadian</span>
                <p className="meta-value">{displayDate}</p>
              </div>
            </div>
            <div className="meta-row">
              <FaMapMarkerAlt className="meta-icon" />
              <div>
                <span className="meta-label">Lokasi</span>
                <p className="meta-value">{item.location}</p>
              </div>
            </div>
            <div className="meta-row">
              <FaUser className="meta-icon" />
              <div>
                <span className="meta-label">Dilaporkan Oleh</span>
                <p className="meta-value">{item.reporter_name || 'Anonymous'}</p>
              </div>
            </div>
          </div>

          <div className="description-box">
            <h3>Deskripsi</h3>
            <p>{item.description || 'Tidak ada deskripsi tambahan.'}</p>
          </div>

          {item.contact === null ? (
            <div className="locked-contact-box">
              <FaLock className="locked-icon" />
              <h3 className="locked-title">Informasi Kontak Terkunci</h3>
              <Link to="/login" className="btn-login-trigger"><FaSignInAlt /> Login Sekarang</Link>
            </div>
          ) : (
            (!isClaimed || isOwner) && (
              <div className="contact-box">
                  <h3>Kontak Pelapor</h3>
                  <div className="contact-content">
                    <FaPhone className="contact-icon" />
                    <span className="contact-text">{item.contact}</span>
                  </div>
                  
                  {/* LOGIKA TOMBOL CHAT: Hanya muncul jika BUKAN pemilik barang */}
                  {!isOwner && (
                      <button onClick={handleChatClick} className="btn-chat-trigger">
                          <FaCommentDots /> Chat Dengan Pelapor
                      </button>
                  )}
              </div>
            )
          )}

          {isOwner && (
            <div className="owner-actions">
                {!isClaimed ? (
                    <>
                        <button onClick={() => setShowSolveModal(true)} className="btn-solve">
                            <FaCheckDouble /> Tandai Selesai
                        </button>
                        <Link to={`/edit-${item.type}/${item.id}`} className="btn btn-edit"><FaEdit /> Edit</Link>
                        <button onClick={handleDeleteClick} className="btn btn-delete"><FaTrashAlt /></button>
                    </>
                ) : (
                    <button onClick={handleDeleteClick} className="btn btn-delete full-width"><FaTrashAlt /> Hapus Arsip</button>
                )}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={showSolveModal} onClose={() => setShowSolveModal(false)} onConfirm={handleMarkAsSolved}
        title="Tandai Selesai?" message="Status akan diubah menjadi 'Selesai'." confirmText="Ya, Selesai" icon={<FaCheckCircle />} 
      />
      <ConfirmModal 
        isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={executeDelete}
        title="Hapus Laporan?" message="Data tidak bisa dikembalikan." confirmText="Hapus" icon={<FaExclamationTriangle />} isDanger={true} 
      />
    </div>
  );
}