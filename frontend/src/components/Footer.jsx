import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaInstagram, FaTwitter, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaShieldAlt, FaFileContract, FaUserSecret, FaSearch } from 'react-icons/fa';
import InfoModal from './InfoModal';
import '../styles/Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [modalType, setModalType] = useState(null);

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  // Konten Statis untuk Modal (Humanist & Professional)
  const renderModalContent = () => {
    switch (modalType) {
      case 'cara-kerja':
        return (
          <>
            <h3><FaSearch className="text-accent" /> Bagaimana ReturnPoint Bekerja?</h3>
            <p>Kami menyederhanakan proses penemuan kembali barang Anda dengan 3 langkah mudah:</p>
            <ul>
              <li><strong>1. Lapor:</strong> Buat laporan kehilangan atau penemuan barang dengan detail foto dan lokasi.</li>
              <li><strong>2. Cocokkan:</strong> Sistem kami membantu menampilkan barang yang relevan dengan pencarian Anda.</li>
              <li><strong>3. Kembalikan:</strong> Hubungi pelapor melalui kontak yang tersedia dan atur pertemuan aman di area kampus.</li>
            </ul>
            <p>Semua gratis untuk mahasiswa demi membangun komunitas yang jujur.</p>
          </>
        );
      case 'keamanan':
        return (
          <>
            <h3><FaShieldAlt className="text-accent" /> Panduan Keamanan</h3>
            <p>Keselamatan Anda adalah prioritas kami. Harap ikuti panduan ini saat bertransaksi:</p>
            <ul>
              <li><strong>Bertemu di Tempat Ramai:</strong> Selalu atur pertemuan di area kampus yang ramai (seperti Perpustakaan, Kantin, atau Lobby Fakultas).</li>
              <li><strong>Verifikasi Kepemilikan:</strong> Jika Anda menemukan barang, mintalah bukti kepemilikan (foto lama, deskripsi unik, atau buka kunci HP) sebelum menyerahkannya.</li>
              <li><strong>Jangan Sendirian:</strong> Jika memungkinkan, ajak teman saat mengambil barang berharga.</li>
              <li><strong>Hindari Transfer Uang:</strong> Jangan pernah mengirim uang muka atau biaya "tebusan".</li>
            </ul>
          </>
        );
      case 'syarat':
        return (
          <>
            <h3><FaFileContract className="text-accent" /> Syarat & Ketentuan</h3>
            <p>Dengan menggunakan ReturnPoint, Anda menyetujui hal-hal berikut:</p>
            <ul>
              <li>Anda adalah mahasiswa/staf aktif universitas.</li>
              <li>Dilarang membuat laporan palsu atau <i>spamming</i>.</li>
              <li>ReturnPoint hanya sebagai perantara informasi dan tidak bertanggung jawab atas kondisi barang saat dikembalikan.</li>
              <li>Kami berhak menghapus konten yang melanggar etika komunitas.</li>
            </ul>
          </>
        );
      case 'privasi':
        return (
          <>
            <h3><FaUserSecret className="text-accent" /> Kebijakan Privasi</h3>
            <p>Kami menghargai privasi data Anda:</p>
            <ul>
              <li><strong>Data Kontak:</strong> Nomor HP/Email hanya ditampilkan kepada pengguna terdaftar untuk keperluan pengembalian barang.</li>
              <li><strong>Keamanan Data:</strong> Password Anda dienkripsi dan tidak dapat dilihat oleh siapapun termasuk admin.</li>
              <li><strong>Penggunaan Data:</strong> Kami tidak menjual data Anda ke pihak ketiga manapun.</li>
            </ul>
          </>
        );
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'cara-kerja': return 'Cara Kerja';
      case 'keamanan': return 'Panduan Keamanan';
      case 'syarat': return 'Syarat & Ketentuan';
      case 'privasi': return 'Kebijakan Privasi';
      default: return '';
    }
  };

  return (
    <>
      <footer className="footer-wrapper">
        <div className="footer-decoration"></div>
        
        <div className="footer-container">
          <div className="footer-grid">
            
            <div className="footer-brand-col">
              <Link to="/" className="footer-logo">
                Return<span className="brand-dot">Point</span>
              </Link>
              <p className="footer-desc">
                Platform komunitas mahasiswa terpercaya untuk melaporkan kehilangan dan mengembalikan barang temuan. Jujur, Aman, dan Transparan.
              </p>
              <div className="footer-socials">
                <a href="#" className="social-link"><FaInstagram /></a>
                <a href="#" className="social-link"><FaTwitter /></a>
                <a href="#" className="social-link"><FaLinkedin /></a>
              </div>
            </div>

            <div className="footer-links-col">
              <h4 className="footer-heading">Eksplorasi</h4>
              <ul className="footer-links">
                <li><Link to="/found">Barang Ditemukan</Link></li>
                <li><Link to="/lost">Barang Hilang</Link></li>
                <li><Link to="/report/found">Lapor Penemuan</Link></li>
                <li><Link to="/report/lost">Lapor Kehilangan</Link></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4 className="footer-heading">Bantuan</h4>
              <ul className="footer-links">
                {/* Ganti Link dengan button onClick */}
                <li><button onClick={() => openModal('cara-kerja')} className="link-button">Cara Kerja</button></li>
                <li><button onClick={() => openModal('keamanan')} className="link-button">Panduan Keamanan</button></li>
                <li><button onClick={() => openModal('syarat')} className="link-button">Syarat & Ketentuan</button></li>
                <li><button onClick={() => openModal('privasi')} className="link-button">Kebijakan Privasi</button></li>
              </ul>
            </div>

            <div className="footer-contact-col">
              <h4 className="footer-heading">Hubungi Kami</h4>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>support@returnpoint.ac.id</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>Gedung D Fasilkom-Ti,<br/>Universitas Sumatera Utara</span>
              </div>
            </div>

          </div>

          <div className="footer-bottom">
            <p className="copyright">
              &copy; {currentYear} ReturnPoint. Dibuat dengan <FaHeart className="heart-icon" /> untuk Komunitas.
            </p>
          </div>
        </div>
      </footer>

      <InfoModal 
        isOpen={!!modalType} 
        onClose={closeModal} 
        title={getModalTitle()}
      >
        {renderModalContent()}
      </InfoModal>
    </>
  );
}