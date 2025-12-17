import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaBox, FaCamera } from 'react-icons/fa';
import itemService from '../services/item.service';
import '../styles/ReportForm.css';

export default function ReportForm() {
  const { type } = useParams();
  const navigate = useNavigate();
  const isLost = type === 'lost';
  
  const [form, setForm] = useState({
    name: '',
    location: '',
    date: '',
    description: '',
    contact: '',
    photo: null,
    location_photo: null,
  });

  const [previews, setPreviews] = useState({
    photo: null,
    location_photo: null
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleFile(e, fieldName) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file terlalu besar (Maks 5MB)");
      return;
    }

    setForm(prev => ({ ...prev, [fieldName]: file }));

    const objectUrl = URL.createObjectURL(file);
    setPreviews(prev => ({ ...prev, [fieldName]: objectUrl }));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    const missingFields = [];
    if (!form.name.trim()) missingFields.push('Nama Barang');
    if (!form.location.trim()) missingFields.push('Lokasi Detail');
    if (!form.contact.trim()) missingFields.push('Kontak');
    if (!form.date) missingFields.push('Tanggal'); 

    if (missingFields.length > 0) {
      setError(`Mohon lengkapi kolom wajib: ${missingFields.join(', ')}`);
      return false;
    }
    return true;
  }

  async function submit(e) {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return; 

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('title', form.name);
      fd.append('location', form.location);
      fd.append('date', new Date(form.date).toISOString());
      fd.append('description', form.description || '');
      fd.append('contact_info', form.contact);
      fd.append('item_type', type || 'lost'); 
      
      if (form.photo instanceof File) {
        fd.append('photo', form.photo);
      }
      if (form.location_photo instanceof File) {
        fd.append('location_photo', form.location_photo);
      }

      await itemService.createItem(fd);
      navigate(`/${type}`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Gagal mengirim laporan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="report-wrapper fade-in">
      <div className="report-card">
        <div className="report-header">
          <span className={`type-badge ${isLost ? 'badge-red' : 'badge-gold'}`}>
            {isLost ? 'Kehilangan' : 'Penemuan'}
          </span>
          <h1 className="report-title">Buat Laporan Baru</h1>
          <p className="report-subtitle">
            Isi detail di bawah ini dengan lengkap untuk membantu proses pencarian.
          </p>
        </div>
        
        {error && (
          <div className="form-alert">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="report-form">
          <div className="form-section">
            <h3 className="section-label">Informasi Barang</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Nama Barang <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <FaBox className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Contoh: Dompet Kulit Coklat"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Tanggal {isLost ? 'Hilang' : 'Ditemukan'} <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Deskripsi & Ciri Unik</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="form-control"
                placeholder="Jelaskan warna, merk, isi, atau tanda khusus lainnya..."
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-label">Lokasi & Kontak</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Lokasi Detail <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <FaMapMarkerAlt className="input-icon" />
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Contoh: Gedung D, Pendopo Fasilkom-Ti"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Kontak yang Bisa Dihubungi <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="No. HP / ID Line / Email"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-label">Bukti Visual (Disarankan)</h3>
            <div className="upload-grid">
              
              <div className="upload-card">
                <label className="upload-label">
                  Foto Barang
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFile(e, 'photo')}
                    className="hidden-input"
                  />
                  <div className={`upload-area ${previews.photo ? 'has-image' : ''}`}>
                    {previews.photo ? (
                      <img src={previews.photo} alt="Preview" className="img-preview" />
                    ) : (
                      <div className="upload-placeholder">
                        <FaCamera className="upload-icon" />
                        <span>Upload Foto Barang</span>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <div className="upload-card">
                <label className="upload-label">
                  Foto Lokasi Sekitar
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFile(e, 'location_photo')}
                    className="hidden-input"
                  />
                  <div className={`upload-area ${previews.location_photo ? 'has-image' : ''}`}>
                    {previews.location_photo ? (
                      <img src={previews.location_photo} alt="Preview" className="img-preview" />
                    ) : (
                      <div className="upload-placeholder">
                        <FaMapMarkerAlt className="upload-icon" />
                        <span>Upload Foto Lokasi</span>
                      </div>
                    )}
                  </div>
                </label>
              </div>

            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div> Mengirim...
                </>
              ) : 'Kirim Laporan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}