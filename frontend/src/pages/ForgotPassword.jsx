import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { authService } from '../services/auth.service';
import { useToast } from '../context/ToastContext';
import '../styles/ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.requestPasswordReset(email);
      setIsSuccess(true); // Tampilkan tampilan sukses
      showToast('Tautan reset password telah dikirim ke email Anda.', 'success');
    } catch (err) {
      if (err.status === 404) {
         showToast('Email tidak ditemukan dalam sistem kami.', 'error');
      } else {
         showToast(err.message || 'Gagal mengirim permintaan.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fp-container fade-in">
      <div className="fp-card">
        <Link to="/login" className="fp-back-link">
          <FaArrowLeft /> Kembali
        </Link>

        {!isSuccess ? (
          <>
            <div className="fp-header">
              <div className="fp-icon-circle">
                <FaEnvelope />
              </div>
              <h1 className="fp-title">Lupa Password?</h1>
              <p className="fp-subtitle">
                Jangan khawatir. Masukkan email yang terdaftar dan kami akan mengirimkan instruksi reset password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="fp-form">
              <div className="fp-input-group">
                <label htmlFor="email" className="fp-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="fp-input"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="fp-btn-primary" disabled={isLoading}>
                {isLoading ? 'Mengirim...' : 'Kirim Link Reset'} <FaPaperPlane className="btn-icon-right" />
              </button>
            </form>
          </>
        ) : (
          <div className="fp-success-view fade-in">
            <div className="success-animation">
              <FaCheckCircle className="success-icon" />
            </div>
            <h2 className="fp-title">Cek Email Anda</h2>
            <p className="fp-subtitle">
              Kami telah mengirimkan tautan reset password ke <strong>{email}</strong>.
            </p>
            <p className="fp-note">
              Tidak menerima email? Cek folder spam atau <button onClick={handleSubmit} className="fp-link-resend">kirim ulang</button>.
            </p>
            
            <Link to="/login" className="fp-btn-secondary">
              Kembali ke Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}