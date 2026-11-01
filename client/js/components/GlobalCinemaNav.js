const { useState, useEffect } = window.React;

export function GlobalCinemaNav({ currentView, onNavigate, onOpenAudio, audioPlaying, savedCount = 0 }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 35);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'story', label: 'The Story' },
    { id: 'journey-61ah', label: 'Journey to 61 AH' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'personalities', label: 'Personalities' },
    { id: 'pavilion', label: 'Pavilion (520+)' },
    { id: 'historiography', label: 'Historiography' },
    { id: 'statistics', label: 'Zaireen Stats' },
    { id: 'journey', label: 'Airport & Journey' },
    { id: 'poles', label: 'Pole Navigation' },
  ];

  const handleLinkClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`global-cinema-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="container-fluid px-lg-5 px-3 h-100 d-flex align-items-center justify-content-between">
          
          {/* Brand Identity */}
          <div 
            className="d-flex align-items-center gap-3 cursor-pointer"
            onClick={() => handleLinkClick('home')}
            style={{ cursor: 'pointer' }}
          >
            <div 
              className="museum-brand-crest d-flex align-items-center justify-content-center"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(198, 166, 107, 0.25) 0%, rgba(8, 11, 11, 0.9) 80%)',
                border: '1.5px solid var(--gold-antique)',
                boxShadow: '0 0 16px rgba(198, 166, 107, 0.3)'
              }}
            >
              <span className="font-arabic fw-bold" style={{ color: 'var(--gold-antique)', fontSize: '1.25rem', lineHeight: '1' }}>
                ك
              </span>
            </div>
            <div>
              <div className="cinema-brand-title">KARBALA</div>
              <div className="cinema-brand-subtitle">SACRED DIGITAL TWIN</div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="cinema-nav-links">
            {navLinks.map((link) => (
              <li key={link.id} className="cinema-nav-item">
                <button
                  type="button"
                  className={`cinema-nav-link ${currentView === link.id ? 'active' : ''}`}
                  onClick={() => handleLinkClick(link.id)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right Action Group */}
          <div className="d-flex align-items-center gap-3">
            
            {/* Audio Ambient Trigger */}
            <button
              type="button"
              className="btn btn-sm d-none d-sm-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill"
              style={{
                background: audioPlaying ? 'rgba(16, 59, 50, 0.7)' : 'rgba(20, 25, 24, 0.8)',
                border: '1px solid var(--border-gold)',
                color: audioPlaying ? 'var(--champagne-soft)' : 'var(--text-secondary)',
                fontSize: '0.74rem'
              }}
              onClick={onOpenAudio}
              title="Acoustic Soundscapes & Ziyarat"
            >
              <i className={`bi ${audioPlaying ? 'bi-volume-up-fill text-gold-antique' : 'bi-volume-mute'}`}></i>
              <span className="d-none d-md-inline">{audioPlaying ? 'Soundscape On' : 'Audio'}</span>
            </button>

            {/* Launch Dedicated Digital Twin Map CTA */}
            <button
              type="button"
              className="cinema-nav-cta"
              onClick={() => handleLinkClick('map')}
              title="Launch the Interactive Cartographic Digital Twin"
            >
              <i className="bi bi-compass"></i>
              <span>Explore Digital Twin</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
            </button>
          </div>

        </div>
      </nav>

      {/* Full-Screen Mobile Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="d-flex align-items-center justify-content-between pb-4 border-bottom border-secondary mb-4">
          <div className="d-flex align-items-center gap-2">
            <span className="font-arabic fs-3 text-gold-antique">ك</span>
            <div className="cinema-brand-title">KARBALA</div>
          </div>
          <button
            type="button"
            className="btn btn-sm rounded-circle text-light fs-4"
            onClick={() => setMobileMenuOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="d-flex flex-column gap-3 my-auto">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              className="btn text-start p-2 fs-5 font-title"
              style={{
                color: currentView === link.id ? 'var(--gold-highlight)' : 'var(--champagne-soft)',
                background: currentView === link.id ? 'rgba(198, 166, 107, 0.12)' : 'transparent',
                borderLeft: currentView === link.id ? '3px solid var(--gold-antique)' : '3px solid transparent'
              }}
              onClick={() => handleLinkClick(link.id)}
            >
              {link.label}
            </button>
          ))}
          
          <button
            type="button"
            className="btn btn-lg mt-3 py-3 rounded-pill fw-bold font-title"
            style={{
              background: 'linear-gradient(135deg, #C6A66B 0%, #A07F43 100%)',
              color: '#080B0B',
              letterSpacing: '0.08em'
            }}
            onClick={() => handleLinkClick('map')}
          >
            <i className="bi bi-compass me-2"></i>
            LAUNCH DIGITAL TWIN MAP
          </button>
        </div>

        <div className="pt-4 border-top border-secondary text-center small text-champagne opacity-75">
          Karbala Digital Heritage Museum • 61 AH &amp; Present Day
        </div>
      </div>
    </>
  );
}
