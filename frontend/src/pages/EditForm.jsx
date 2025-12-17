import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaBox, FaCamera, FaSave, FaArrowLeft, FaPhone, FaExclamationTriangle } from 'react-icons/fa';
import itemService from '../services/item.service';
import '../styles/EditForm.css';

export default function EditForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    title: '',
    location: '',
    date: '',
    description: '',
    contact_info: '',
    item_type: 'lost',
    status: 'open'
  });

  const [previews, setPreviews] = useState({
    photo: null,
    location_photo: null
  });

  const [files, setFiles] = useState({
    photo: null,
    location_photo: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await itemService.getItemById(id);
        
        if (data) {
          const formattedDate = data.date ? new Date(data.date).toISOString().split('T')[0] : '';
          
          setForm({
            title: data.name,
            location: data.location,
            date: formattedDate,
            description: data.description,
            contact_info: data.contact,
            item_type: data.type,
            status: data.status
          });

          setPreviews({
            photo: data.photo,
            location_photo: data.location_photo
          });
        }
      } catch (err) {
        console.log(err);
        setError('Gagal memuat data barang.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB");
        return;
      }
      setFiles(prev => ({ ...prev, [fieldName]: file }));
      setPreviews(prev => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('location', form.location);
      fd.append('date', new Date(form.date).toISOString());
      fd.append('description', form.description);
      fd.append('contact_info', form.contact_info);
      fd.append('item_type', form.item_type);
      fd.append('status', form.status);

      if (files.photo) {
        fd.append('photo', files.photo);
      }
      
      if (files.location_photo) {
        fd.append('location_photo', files.location_photo);
      }

      await itemService.updateItem(id, fd);
      navigate(form.item_type === 'lost' ? '/lost' : '/found');
    } catch (err) {
      setError(err.message || 'Gagal memperbarui laporan.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-container">Memuat data...</div>;

  return (
    <div className="report-wrapper fade-in">
      <div className="report-card">
        <div className="report-header">
          <button onClick={() => navigate(-1)} className="btn-back-text">
            <FaArrowLeft /> Kembali
          </button>
          <h1 className="report-title">Edit Laporan</h1>
          <p className="report-subtitle">Perbarui informasi barang di bawah ini.</p>
        </div>

        {error && (
          <div className="form-alert">
            <FaExclamationTriangle /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-section">
            <h3 className="section-label">Detail Utama</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Judul Barang</label>
                <div className="input-with-icon">
                  <FaBox className="input-icon" />
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Kontak (HP/WA/Email)</label>
                <div className="input-with-icon">
                  <FaPhone className="input-icon" />
                  <input
                    type="text"
                    name="contact_info"
                    value={form.contact_info}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
               <div className="form-group">
                <label className="form-label">Tipe Laporan</label>
                <select
                  name="item_type"
                  value={form.item_type}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="lost">Kehilangan (Lost)</option>
                  <option value="found">Penemuan (Found)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status Barang</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="open">Masih Dicari / Tersedia</option>
                  <option value="claimed">Selesai (Diklaim/Ditemukan)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Deskripsi Detail</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-label">Lokasi & Waktu</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Lokasi</label>
                <div className="input-with-icon">
                  <FaMapMarkerAlt className="input-icon" />
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tanggal</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-label">Update Foto (Opsional)</h3>
            <div className="upload-grid">
              
              <div className="upload-card">
                <label className="upload-label">
                  Foto Barang
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'photo')}
                    className="hidden-input"
                  />
                  <div className={`upload-area ${previews.photo ? 'has-image' : ''}`}>
                    {previews.photo ? (
                      <img src={previews.photo} alt="Preview Barang" className="img-preview" />
                    ) : (
                      <div className="upload-placeholder">
                        <FaCamera className="upload-icon" />
                        <span>Ganti Foto Barang</span>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <div className="upload-card">
                <label className="upload-label">
                  Foto Lokasi
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'location_photo')}
                    className="hidden-input"
                  />
                  <div className={`upload-area ${previews.location_photo ? 'has-image' : ''}`}>
                    {previews.location_photo ? (
                      <img src={previews.location_photo} alt="Preview Lokasi" className="img-preview" />
                    ) : (
                      <div className="upload-placeholder">
                        <FaMapMarkerAlt className="upload-icon" />
                        <span>Ganti Foto Lokasi</span>
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
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Menyimpan...' : (
                <>
                  <FaSave /> Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}