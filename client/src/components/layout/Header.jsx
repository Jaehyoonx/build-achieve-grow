import './Header.css';

export default function Header({ viewTitle }) {
  return (
    <header className="header">
      {/* Top Navigation */}
      <nav className="header-top-nav">
        <a href="/" className="nav-link">Home</a>
        <a href="#contact" className="nav-link">Contact</a>
      </nav>

      {/* Logo and Brand Section */}
      <div className="header-logo-section">
        <div className="logo-box">
          <img src="/logo.png" alt="BAG Logo" className="logo-image" />
        </div>
        <div className="brand-text">
          <p>Build.</p>
          <p>Achieve.</p>
          <p>Grow.</p>
        </div>
        {viewTitle && <div className="view-title">{viewTitle}</div>}
      </div>
    </header>
  );
}
