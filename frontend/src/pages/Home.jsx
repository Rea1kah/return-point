import { Link } from 'react-router-dom';
import RecentList from '../components/RecentList';
import { FaSearch, FaBullhorn, FaArrowRight } from 'react-icons/fa';
import '../styles/Home.css';

export default function Home() {
  return (
    <main className="home-wrapper">
      <section className="hero-section">
        <div className="hero-decoration">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>

        <div className="hero-container fade-in">
          <div className="badge-pill">
            <span className="badge-dot"></span>
            Lost & Found Community
          </div>
          
          <h1 className="hero-title">
            From <span className="text-gradient">Lost</span> to <br />
            Finally <span className="text-gradient">Found.</span>
          </h1>
          
          <p className="hero-subtitle">
            Platform terpercaya universitas untuk melaporkan kehilangan dan mengembalikan barang. 
            Jujur, Transparan, dan Terpercaya.
          </p>
          
          <div className="hero-cta-group">
            <Link to="/report/found" className="btn-hero-primary">
              <FaBullhorn className="btn-icon" />
              Lapor Penemuan
            </Link>
            <Link to="/found" className="btn-hero-glass">
              <FaSearch className="btn-icon" />
              Cari Barang
            </Link>
          </div>
        </div>
      </section>

      <div className="content-wrapper">
        <div className="stats-strip">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Barang Kembali</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">24</span>
            <span className="stat-label">Respon Cepat</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Gratis</span>
          </div>
        </div>

        <div className="recent-container">
          <div className="section-header">
            <h2 className="section-heading">Baru Dilaporkan</h2>
            <Link to="/lost" className="link-view-all">
              Lihat Semua <FaArrowRight />
            </Link>
          </div>
          <RecentList />
        </div>
      </div>
    </main>
  );
}