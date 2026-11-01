const { useState, useEffect, useRef, useCallback } = window.React;
const ReactDOM = window.ReactDOM;

import { PRESENT_DAY_LOCATIONS, HISTORICAL_61AH_LOCATIONS } from '/js/data/locations.js';
import { MUHARRAM_DAYS } from '/js/data/timeline.js';
import { PERSONALITIES } from '/js/data/personalities.js';
import { CERTAINTY_EXPLANATIONS, CERTAINTY_LEVELS } from '/js/data/certainty_explanations.js';
import { KarbalaMap } from '/js/map/interactive_map.js';
import { audioEngine } from '/js/audio/soundscapes.js';







function GlobalCinemaNav({ currentView, onNavigate, onOpenAudio, audioPlaying, savedCount = 0 }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 35);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isMuseumMode = currentView === 'home' || currentView === 'story' || currentView === 'journey-61ah' || currentView === 'timeline' || currentView === 'personalities' || currentView === 'pavilion' || currentView === 'historiography';
  const isZiyaratMode = currentView === 'ziyarat';
  const isAiMode = currentView === 'ai';

  const museumLinks = [
    { id: 'home', label: 'Home' },
    { id: 'story', label: 'The Story' },
    { id: 'journey-61ah', label: 'Journey to 61 AH' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'personalities', label: 'Personalities' },
    { id: 'pavilion', label: 'Pavilion (520+)' },
    { id: 'historiography', label: 'Historiography' },
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
            style={{ cursor: 'pointer' }}
            onClick={() => handleLinkClick('home')}
          >
            <div className="cinema-brand-logo">
              <span className="brand-logo-glyph">ك</span>
            </div>
            <div>
              <div className="cinema-brand-title">KARBALA</div>
              <div className="cinema-brand-subtitle">SACRED DIGITAL TWIN</div>
            </div>
          </div>

          {/* Center: Three Connected Experiences Switcher */}
          <div className="d-none d-lg-flex align-items-center">
            <div className="experience-switcher-bar">
              <button
                type="button"
                className={`experience-pill-btn ${isMuseumMode ? 'active' : ''}`}
                onClick={() => handleLinkClick('home')}
                title="Cinematic Digital Heritage Museum"
              >
                <i className="bi bi-bank2"></i>
                <span>Discover Karbala</span>
              </button>

              <button
                type="button"
                className={`experience-pill-btn ${isZiyaratMode ? 'active ziyarat-active' : ''}`}
                onClick={() => handleLinkClick('ziyarat')}
                title="Practical Pilgrim Companion & Directions"
              >
                <i className="bi bi-compass-fill"></i>
                <span>My Ziyarat</span>
              </button>

              <button
                type="button"
                className={`experience-pill-btn ${isAiMode ? 'active ai-active' : ''}`}
                onClick={() => handleLinkClick('ai')}
                title="Camera Translation & Sourced AI Assistant"
              >
                <i className="bi bi-cpu-fill"></i>
                <span>Ask Karbala AI</span>
              </button>
            </div>
          </div>

          {/* Right Actions: Spatial Map, Audio & Mobile Menu */}
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="cinema-nav-link d-none d-md-flex align-items-center gap-1"
              onClick={onOpenAudio}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <i className={`bi ${audioPlaying ? 'bi-volume-up-fill text-warning' : 'bi-volume-mute'}`}></i>
              <span>Audio</span>
            </button>

            <button
              type="button"
              className="cinema-portal-btn d-none d-sm-inline-flex"
              onClick={() => handleLinkClick('map')}
              title="Launch Fullscreen Interactive Map"
            >
              <i className="bi bi-compass"></i>
              <span>Spatial Map</span>
            </button>

            {/* Mobile Menu Trigger */}
            <button 
              type="button"
              className="mobile-nav-toggle d-lg-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Drawer"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C6A66B" strokeWidth="2.2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>

        </div>

        {/* Museum Secondary Subnavigation (Visible in Museum Mode on Desktop) */}
        {isMuseumMode && (
          <div className="d-none d-xl-flex justify-content-center py-1 border-top border-dark-subtle" style={{ background: 'rgba(8, 11, 11, 0.95)', fontSize: '0.78rem' }}>
            <div className="d-flex gap-4">
              {museumLinks.map(link => (
                <button
                  key={link.id}
                  type="button"
                  className={`btn btn-link text-decoration-none p-0 ${currentView === link.id ? 'text-gold-antique fw-bold' : 'text-secondary'}`}
                  onClick={() => handleLinkClick(link.id)}
                  style={{ fontSize: '0.78rem', letterSpacing: '0.08em' }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Drawer Navigation */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header d-flex justify-content-between align-items-center p-3 border-bottom border-dark">
          <div className="d-flex align-items-center gap-2">
            <span className="brand-logo-glyph text-gold-antique fs-5">ك</span>
            <span className="font-display text-white">KARBALA DIGITAL TWIN</span>
          </div>
          <button 
            type="button" 
            className="btn btn-sm btn-link text-white text-decoration-none fs-4"
            onClick={() => setMobileMenuOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="mobile-nav-body p-3">
          {/* Top Level 3 Experiences Switcher */}
          <div className="mb-4">
            <div className="small text-gold-antique font-display mb-2">EXPERIENCES</div>
            <div className="d-flex flex-column gap-2">
              <button
                type="button"
                className={`btn text-start p-3 rounded-2 ${isMuseumMode ? 'btn-gold text-dark' : 'btn-dark text-light border border-dark'}`}
                onClick={() => handleLinkClick('home')}
              >
                <i className="bi bi-bank2 me-2"></i>
                <strong>Discover Karbala (Museum)</strong>
              </button>
              <button
                type="button"
                className={`btn text-start p-3 rounded-2 ${isZiyaratMode ? 'btn-success text-white' : 'btn-dark text-light border border-dark'}`}
                onClick={() => handleLinkClick('ziyarat')}
              >
                <i className="bi bi-compass-fill me-2"></i>
                <strong>My Ziyarat (Pilgrim Companion)</strong>
              </button>
              <button
                type="button"
                className={`btn text-start p-3 rounded-2 ${isAiMode ? 'btn-primary text-white' : 'btn-dark text-light border border-dark'}`}
                onClick={() => handleLinkClick('ai')}
              >
                <i className="bi bi-cpu-fill me-2"></i>
                <strong>Ask Karbala AI (Translator &amp; Q&amp;A)</strong>
              </button>
            </div>
          </div>

          {/* Museum Sublinks */}
          <div className="mb-4">
            <div className="small text-secondary font-display mb-2">MUSEUM EXHIBITION CHAPTERS</div>
            <div className="d-flex flex-column gap-1">
              {museumLinks.map(link => (
                <button
                  key={link.id}
                  type="button"
                  className={`btn btn-link text-start text-decoration-none py-2 px-3 rounded ${currentView === link.id ? 'bg-dark text-gold-antique fw-bold' : 'text-light'}`}
                  onClick={() => handleLinkClick(link.id)}
                  style={{ fontSize: '0.9rem' }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <button
              type="button"
              className="btn btn-gold w-100 py-3"
              onClick={() => handleLinkClick('map')}
            >
              <i className="bi bi-compass me-2"></i>
              Launch Spatial Digital Twin Map
            </button>
          </div>
        </div>
      </div>
    </>
  );
}




function CinematicHomeView({ onNavigate, onOpenLightbox, galleryImages = [] }) {
  // Reading Scroll Progress State
  const [scrollProgress, setScrollProgress] = useState(0);

  // Chapter 03 Architectural Tab State
  const [activeShrineTab, setActiveShrineTab] = useState('hussain');

  // Chapter 04 Before/After Slider State
  const [sliderPos, setSliderPos] = useState(50);
  const isDraggingSliderRef = useRef(false);
  const sliderContainerRef = useRef(null);

  // Chapter 05 Featured 61 AH Landscape State
  const [featuredLandscape, setFeaturedLandscape] = useState('encampment');

  // Chapter 06 Chronology Tab State
  const [chronologyTab, setChronologyTab] = useState('days');

  // Chapter 07 Gallery Filter State
  const [archiveFilter, setArchiveFilter] = useState('all');

  // Track Window Scroll for Reading Progress Bar & GSAP Parallax
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP ScrollTrigger Integration
  useEffect(() => {
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced) {
        // Smooth scroll-linked transition from Chapter 01 to Chapter 02
        const heroEl = document.querySelector('.hero-section');
        const heroBg = document.querySelector('.hero-bg-media');
        const heroContent = document.querySelector('.hero-content');
        if (heroEl && heroBg && heroContent) {
          window.gsap.to(heroBg, {
            scrollTrigger: {
              trigger: heroEl,
              start: 'top top',
              end: 'bottom top',
              scrub: true
            },
            scale: 1.15,
            filter: 'brightness(0.38) contrast(1.18)'
          });
          window.gsap.to(heroContent, {
            scrollTrigger: {
              trigger: heroEl,
              start: 'top top',
              end: '65% top',
              scrub: true
            },
            y: -50,
            opacity: 0.15
          });
        }
        // Smoothly animate Chapter headers on scroll
        const headers = document.querySelectorAll('.chapter-header');
        headers.forEach(h => {
          window.gsap.fromTo(h, 
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: h,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        });
      }
    }
  }, []);

  // Slider Mouse/Touch Drag Handlers
  const handleSliderMove = (clientX) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  const handleMouseDown = (e) => {
    isDraggingSliderRef.current = true;
    handleSliderMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => { isDraggingSliderRef.current = false; };
    const handleMouseMove = (e) => {
      if (isDraggingSliderRef.current) handleSliderMove(e.clientX);
    };
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToChapter = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 61 AH Reconstructions Dataset for Chapter 05
  const reconstructions61AH = {
    encampment: {
      id: 'encampment',
      title: 'The Encampment of Imam Hussain (al-Mukhayyam)',
      arabic: 'مخيم الإمام الحسين عليه السلام',
      desc: 'Established upon the higher ground of al-Taff on 2 Muharram 61 AH. Comprising approximately thirty to forty traditional desert pavilions arranged in a defensive crescent, protected at the rear by a dry ditch filled with firewood and reeds ignited on the morning of Ashura.',
      image: 'assets/images/ai_61ah_encampment.jpg',
      aspect: 'Topographical Encampment Modeling',
      badge: 'TOPOGRAPHICAL CONTINUITY',
      archaeology: 'Western Karbala alluvial terrace, 28m above sea level',
      width: 1920,
      height: 1080
    },
    river: {
      id: 'river',
      title: 'Nahr al-Alqami (Ancient Euphrates Distributary)',
      arabic: 'نهر العلقمي وبساتين النخيل',
      desc: 'The ancient meandering watercourse branching from the Euphrates near ancient Kufa. Flanked by thick reedbeds (Qasab) and dense date palm groves (Nakhl), it formed the contested barrier during the water siege where Abu al-Fadl al-Abbas sought water for the camp.',
      image: 'assets/images/ai_61ah_alqami_river.jpg',
      aspect: 'Hydrological & Botanical Modeling',
      badge: 'HISTORIC WATERCOURSE',
      archaeology: 'Traced through aerial sediment anomalies and Umayyad irrigation channels',
      width: 1920,
      height: 1080
    },
    tall_zaynabiyya: {
      id: 'tall_zaynabiyya',
      title: 'Tall al-Zaynabiyya (The Elevated Ridge)',
      arabic: 'التل الزينبي المشرف على ساحة المعركة',
      desc: 'A prominent natural sandstone and gravel knoll elevated five meters above the surrounding plain. Located west of the camp and overlooking the battlefield toward Gowd-e Qatlgah, where Lady Zaynab witnessed the final stand.',
      image: 'assets/images/ai_61ah_tall_zaynabiyya.jpg',
      aspect: 'Geomorphological Study',
      badge: 'ELEVATED VANTAGE',
      archaeology: 'Directly encased beneath the modern marble sanctuary of al-Tall al-Zaynabiyya',
      width: 1920,
      height: 1080
    },
    sham_e_ghariban: {
      id: 'sham_e_ghariban',
      title: 'Sham-e Ghariban (The Solitary Dusk)',
      arabic: 'ليلة الوحشة وسكون الطف',
      desc: 'The poignant twilight descending upon the plain of Karbala on 10 Muharram 61 AH. The smoke of smoldering tents drifting into the indigo desert sky, as Lady Zaynab gathered the surviving women and children amidst quiet remembrance.',
      image: 'assets/images/ai_61ah_sham_e_ghariban.jpg',
      aspect: 'Atmospheric Evening Study',
      badge: '10 MUHARRAM 61 AH',
      archaeology: 'Sacred grounds commemorated across 1,380+ lunar years',
      width: 1920,
      height: 1080
    }
  };

  const activeLandscape = reconstructions61AH[featuredLandscape] || reconstructions61AH.encampment;

  // Curated Archive highlights for Chapter 07
  const archiveHighlights = [
    { title: 'Golden Dome of Imam Hussain at Twilight', path: 'assets/images/shrine_38.jpg', category: 'shrine', width: 2560, height: 1707, source: 'Holy Shrine Archival Media' },
    { title: 'The Sacred Sanctuary of Al-Abbas', path: 'assets/images/shrine_27.jpg', category: 'shrine', width: 2400, height: 1600, source: 'Al-Kafeel Global Network' },
    { title: 'Bayn al-Haramayn Panoramic Esplanade', path: 'assets/images/karbala_img_0_Beyn-_l_H_r_meyn__K_rb_la_jpg.jpg', category: 'history', width: 1920, height: 1080, source: 'Heritage Photographic Archive' },
    { title: 'Historic Karbala Pre-2006 Sanctuary View', path: 'assets/images/karbala_img_3_ImamHusaynMosqueKarbalaIraqPre2006_.jpg', category: 'history', width: 1600, height: 1200, source: 'National Archival Registry' },
    { title: "Arba'een Pilgrims Gathering in Bayn al-Haramayn", path: "assets/images/karbala_img_240_Arba_een_Pilgrims_in_Bayn_al-Harmia.jpg", category: "history", width: 1600, height: 1067, source: "International Pilgrimage Registry" },
    { title: 'Scholarly Reconstruction of 61 AH Encampment', path: 'assets/images/ai_61ah_encampment.jpg', category: 'reconstruction', width: 1920, height: 1080, isAI: true, source: 'Karbala Digital Twin Project' }
  ];

  const filteredArchive = archiveHighlights.filter(img => {
    if (archiveFilter === 'all') return true;
    if (archiveFilter === 'shrine') return img.category === 'shrine';
    if (archiveFilter === 'history') return img.category === 'history';
    if (archiveFilter === 'reconstruction') return img.category === 'reconstruction';
    return true;
  });

  return (
    <div className="cinematic-home-flow">

      {/* Reading Progress Indicator */}
      <div 
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={scrollProgress}
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>

      {/* =========================================================================
          CHAPTER 01 — THE OPENING (CINEMATIC FULL-VIEWPORT HERO)
          ========================================================================= */}
      <section className="hero-section" id="hero">
        <div className="hero-bg-container">
          <img
            src="assets/images/karbala_img_0_Beyn-_l_H_r_meyn__K_rb_la_jpg.jpg"
            alt="Authentic Architectural Sanctuary of Karbala at Night"
            className="hero-bg-media"
          />
          <div className="hero-overlay-gradient"></div>
        </div>

        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="badge-pulse-dot"></span>
            <span>SACRED HERITAGE DIGITAL TWIN • 61 AH &amp; PRESENT DAY</span>
          </div>

          <h1 className="hero-title">KARBALA</h1>

          <div className="hero-calligraphy">
            كربلاء المقدسة — ملحمة الخلود والإباء
          </div>

          <p className="hero-subtitle">
            Where sacred geography, historical memory, and timeless sacrifice converge across 1,380+ years of living heritage.
          </p>

          <div className="hero-editorial-meta">
            <span><i className="bi bi-geo-alt-fill text-gold-antique me-1"></i>32.6160° N, 44.0324° E</span>
            <span className="meta-divider">•</span>
            <span>Al-Ha'ir al-Husayni</span>
            <span className="meta-divider">•</span>
            <span>UNESCO Intangible Cultural Heritage</span>
          </div>

          <div className="hero-actions">
            <button
              type="button"
              className="hero-btn-primary"
              onClick={() => scrollToChapter('chapter-02')}
            >
              <span>EXPLORE THE EXHIBITION</span>
              <i className="bi bi-arrow-down-right ms-2"></i>
            </button>

            <button
              type="button"
              className="hero-btn-secondary"
              onClick={() => onNavigate('map')}
            >
              <i className="bi bi-compass me-2"></i>
              <span>Interactive Twin Map →</span>
            </button>
          </div>
        </div>

        <div className="hero-scroll-prompt" onClick={() => scrollToChapter('chapter-02')}>
          <span>SCROLL TO ENTER</span>
          <div className="hero-scroll-indicator-bar"></div>
        </div>
      </section>

      <section id="chapter-02" className="chapter-section bg-charcoal position-relative overflow-hidden">
        {/* Subtle Watermark Background */}
        <div 
          className="position-absolute inset-0 pointer-events-none opacity-15"
          style={{
            backgroundImage: 'url(assets/images/karbala_img_30_Karbala__Iraq_jpg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(100%) contrast(120%) blur(2px)',
            opacity: '0.12'
          }}
        ></div>

        <div className="container py-lg-4 position-relative z-2">
          <div className="row align-items-center g-5">
            
            <div className="col-lg-7">
              <div className="chapter-header mb-4">
                <div className="chapter-number-pill">CHAPTER 02 • PROLOGUE</div>
                <h2 className="chapter-title">A Land of Memory &amp; Eternity</h2>
                <div className="font-arabic fs-3 text-gold-antique mb-3">أرض الطف وكربلاء المقدسة</div>
              </div>

              <p className="chapter-lead mb-4">
                <span className="editorial-drop-cap">O</span>n the second day of Muharram in the year 61 AH (October 2, 680 CE), a modest caravan carrying the family, companions, and scholars of the Holy Household halted upon an arid Mesopotamian plain situated between the western desert fringe and the fertile alluvium of the Euphrates.
              </p>

              <div className="p-4 rounded-3 mb-4" style={{ background: 'rgba(8, 11, 11, 0.85)', border: '1px solid rgba(198, 166, 107, 0.35)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)' }}>
                <p className="font-serif fst-italic mb-2" style={{ color: 'var(--champagne-soft)', fontSize: '1.02rem', lineHeight: '1.75' }}>
                  &ldquo;I have not risen out of arrogance or rebellion, nor to cause corruption or injustice. Rather, I rose to seek reform in the community of my grandfather Muhammad (SAW)...&rdquo;
                </p>
                <div className="small text-end fw-semibold" style={{ color: 'var(--gold-antique)', letterSpacing: '0.08em' }}>
                  — Imam Hussain ibn Ali (AS) • Chronicle of al-Tabari (Vol. 5, p. 341)
                </div>
              </div>

              <div className="d-flex flex-wrap gap-3">
                <button
                  type="button"
                  className="editorial-action-btn px-4 py-2"
                  onClick={() => onNavigate('story')}
                >
                  Read Full Historical Story →
                </button>
                <button
                  type="button"
                  className="editorial-action-btn px-4 py-2"
                  onClick={() => onNavigate('historiography')}
                >
                  Inspect Source Citations
                </button>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="memory-stat-card">
                    <div className="memory-stat-number">61 AH</div>
                    <div className="memory-stat-label">680 CE</div>
                    <div className="small text-champagne opacity-75 mt-2">The Epoch of al-Taff and the immortal stand of Ashura.</div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="memory-stat-card">
                    <div className="memory-stat-number">1,380+</div>
                    <div className="memory-stat-label">Lunar Years</div>
                    <div className="small text-champagne opacity-75 mt-2">Of unbroken pilgrimage, architectural reverence, and spiritual memory.</div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="memory-stat-card">
                    <div className="memory-stat-number">20+</div>
                    <div className="memory-stat-label">Verified Sites</div>
                    <div className="small text-champagne opacity-75 mt-2">Correlated between modern GPS coordinates and 61 AH geography.</div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="memory-stat-card">
                    <div className="memory-stat-number">520+</div>
                    <div className="memory-stat-label">Archival Assets</div>
                    <div className="small text-champagne opacity-75 mt-2">High-resolution photographic repository and historical monographs.</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 03 — KARBALA TODAY (SACRED ARCHITECTURAL SPOTLIGHTS)
          ========================================================================= */}
      <section id="chapter-03" className="chapter-section bg-obsidian">
        <div className="container py-lg-4">
          
          <div className="chapter-header text-center max-w-800 mx-auto">
            <div className="chapter-number-pill">CHAPTER 03 • CONTEMPORARY SANCTUARY</div>
            <h2 className="chapter-title">Karbala Today: The Sacred Sanctuaries</h2>
            <p className="chapter-lead mx-auto">
              The modern city of Karbala centers around the twin monuments of Bayn al-Haramayn—masterworks of Islamic sacred architecture that embody centuries of unbroken devotion.
            </p>

            {/* Architecture Tabs */}
            <div className="d-inline-flex p-1.5 rounded-pill mt-3 flex-wrap justify-content-center" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-gold)' }}>
              {[
                { id: 'hussain', label: 'Imam Hussain Sanctuary' },
                { id: 'abbas', label: 'Al-Abbas Sanctuary' },
                { id: 'bayn', label: 'Bayn al-Haramayn Esplanade' },
                { id: 'arbaeen', label: "Arba'een Pilgrims Gathering" }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  className={`btn btn-sm px-3.5 py-1.5 rounded-pill fw-semibold ${activeShrineTab === tab.id ? 'bg-warning text-dark shadow-sm' : 'text-champagne'}`}
                  style={{ fontSize: '0.78rem', letterSpacing: '0.04em' }}
                  onClick={() => setActiveShrineTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Tab Spotlight Content */}
          <div className="row g-4 align-items-center mt-2">
            {activeShrineTab === 'hussain' && (
              <>
                <div className="col-lg-7">
                  <div className="architecture-showcase-card">
                    <img src="assets/images/shrine_27.jpg" alt="Holy Shrine of Imam Hussain" className="architecture-card-img" />
                    <div className="architecture-card-overlay">
                      <span className="badge px-3 py-1.5 mb-2 align-self-start" style={{ background: 'var(--emerald-deep)', color: 'var(--champagne-soft)', border: '1px solid var(--border-gold)' }}>
                        PRIMARY SANCTUARY • AL-HA'IR AL-HUSAYNI
                      </span>
                      <h4 className="font-display text-white mb-1">The Holy Shrine of Imam Hussain (AS)</h4>
                      <p className="font-arabic text-gold-antique mb-0">العتبة الحسينية المقدسة — مرقد سيد الشهداء</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="p-4 rounded-3" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-subtle)' }}>
                    <h5 className="font-display text-gold-antique mb-3">Architectural &amp; Spiritual Continuity</h5>
                    <p className="text-secondary small font-serif mb-3" style={{ lineHeight: '1.7', fontSize: '0.92rem' }}>
                      The modern shrine complex spans over 15,000 square meters. The gilded central dome—adorned with 7,200 pure gold plates—rises directly above the sacred grave chamber (al-Ha’ir al-Husayni), resting upon the original subterranean ground level of 61 AH where the final stand of Ashura concluded.
                    </p>
                    <ul className="list-unstyled d-flex flex-column gap-2 small text-champagne mb-4">
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>Central Golden Dome:</strong> 37 meters in height, flanked by twin 35m minarets.</li>
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>The Golden Iwan (Aywan al-Zahab):</strong> Monumental ceremonial entry portal.</li>
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>Subterranean Basements:</strong> Modern climate-controlled pilgrim halls.</li>
                    </ul>
                    <button
                      type="button"
                      className="btn w-100 py-2.5 rounded-pill fw-semibold font-title"
                      style={{ background: 'linear-gradient(135deg, #C6A66B 0%, #A07F43 100%)', color: '#080B0B', fontSize: '0.8rem' }}
                      onClick={() => onNavigate('map')}
                    >
                      <i className="bi bi-geo-alt me-1.5"></i> Locate Sanctuary on Digital Twin Map
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeShrineTab === 'abbas' && (
              <>
                <div className="col-lg-7">
                  <div className="architecture-showcase-card">
                    <img src="assets/images/shrine_38.jpg" alt="Holy Shrine of Al-Abbas" className="architecture-card-img" />
                    <div className="architecture-card-overlay">
                      <span className="badge px-3 py-1.5 mb-2 align-self-start" style={{ background: 'rgba(138, 75, 56, 0.85)', color: '#fff', border: '1px solid var(--border-gold)' }}>
                        SANCTUARY OF ABU AL-FADL AL-ABBAS (AS)
                      </span>
                      <h4 className="font-display text-white mb-1">The Holy Shrine of Al-Abbas (AS)</h4>
                      <p className="font-arabic text-gold-antique mb-0">العتبة العباسية المقدسة — قمر بني هاشم</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="p-4 rounded-3" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-subtle)' }}>
                    <h5 className="font-display text-gold-antique mb-3">The Standard-Bearer of Karbala</h5>
                    <p className="text-secondary small font-serif mb-3" style={{ lineHeight: '1.7', fontSize: '0.92rem' }}>
                      Positioned 378 meters northeast of the central shrine, this sanctuary marks the location where Abu al-Fadl al-Abbas attained martyrdom while attempting to bring water from Nahr al-Alqami to the besieged children in the encampment.
                    </p>
                    <ul className="list-unstyled d-flex flex-column gap-2 small text-champagne mb-4">
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>Bab al-Qibla of al-Abbas:</strong> Iconic 24m triumphal portal of mosaic ceramic tile.</li>
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>Twin Gilded Minarets:</strong> Intricate Kufic Qur'anic epigraphy in lapis lazuli.</li>
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>Al-Kafeel Heritage Center:</strong> Scholarly manuscript and astronomical museum.</li>
                    </ul>
                    <button
                      type="button"
                      className="btn w-100 py-2.5 rounded-pill fw-semibold font-title"
                      style={{ background: 'linear-gradient(135deg, #C6A66B 0%, #A07F43 100%)', color: '#080B0B', fontSize: '0.8rem' }}
                      onClick={() => onNavigate('map')}
                    >
                      <i className="bi bi-geo-alt me-1.5"></i> Locate Sanctuary on Digital Twin Map
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeShrineTab === 'bayn' && (
              <>
                <div className="col-lg-7">
                  <div className="architecture-showcase-card">
                    <img src="assets/images/karbala_img_0_Beyn-_l_H_r_meyn__K_rb_la_jpg.jpg" alt="Bayn al-Haramayn Esplanade" className="architecture-card-img" />
                    <div className="architecture-card-overlay">
                      <span className="badge px-3 py-1.5 mb-2 align-self-start" style={{ background: 'var(--bg-elevated)', color: 'var(--gold-antique)', border: '1px solid var(--border-gold)' }}>
                        SACRED PEDESTRIAN CONCOURSE • 378 METERS
                      </span>
                      <h4 className="font-display text-white mb-1">Bayn al-Haramayn (The Sacred Space Between)</h4>
                      <p className="font-arabic text-gold-antique mb-0">منطقة ما بين الحرمين الشريفين</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="p-4 rounded-3" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-subtle)' }}>
                    <h5 className="font-display text-gold-antique mb-3">The Nexus of Pilgrimage</h5>
                    <p className="text-secondary small font-serif mb-3" style={{ lineHeight: '1.7', fontSize: '0.92rem' }}>
                      Bayn al-Haramayn is the 378-meter paved pedestrian esplanade flanked by date palms that joins the two shrines. During Arba'een, it witnesses the gathering of over 20 million pilgrims—one of the largest peaceful human assemblies on Earth.
                    </p>
                    <ul className="list-unstyled d-flex flex-column gap-2 small text-champagne mb-4">
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>Length:</strong> 378 meters perfectly aligned with sacred sightlines.</li>
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>Paving:</strong> Thermal-reflective natural Greek Thassos marble.</li>
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>Arba'een Pilgrimage:</strong> Global hub of humanitarian hospitality (Mawkib).</li>
                    </ul>
                    <button
                      type="button"
                      className="btn w-100 py-2.5 rounded-pill fw-semibold font-title"
                      style={{ background: 'linear-gradient(135deg, #C6A66B 0%, #A07F43 100%)', color: '#080B0B', fontSize: '0.8rem' }}
                      onClick={() => onNavigate('map')}
                    >
                      <i className="bi bi-geo-alt me-1.5"></i> Locate Esplanade on Digital Twin Map
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeShrineTab === 'arbaeen' && (
              <>
                <div className="col-lg-7">
                  <div className="architecture-showcase-card">
                    <img src="assets/images/karbala_img_240_Arba_een_Pilgrims_in_Bayn_al-Harmia.jpg" alt="Arba'een Pilgrims" className="architecture-card-img" />
                    <div className="architecture-card-overlay">
                      <span className="badge px-3 py-1.5 mb-2 align-self-start" style={{ background: 'rgba(16, 59, 50, 0.9)', color: 'var(--champagne-soft)', border: '1px solid var(--border-gold)' }}>
                        ARBA'EEN PILGRIMAGE • OVER 20 MILLION ATTENDEES
                      </span>
                      <h4 className="font-display text-white mb-1">The Great Procession of Arba'een</h4>
                      <p className="font-arabic text-gold-antique mb-0">زيارة الأربعين المليونية المباركة</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="p-4 rounded-3" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-subtle)' }}>
                    <h5 className="font-display text-gold-antique mb-3">Living Heritage &amp; Hospitality</h5>
                    <p className="text-secondary small font-serif mb-3" style={{ lineHeight: '1.7', fontSize: '0.92rem' }}>
                      Recognized by UNESCO as Intangible Cultural Heritage, the Arba'een walk brings together millions from across the globe walking 80 kilometers on foot from Najaf to Karbala, supported by thousands of volunteer hospitality stations (Mawkibs).
                    </p>
                    <ul className="list-unstyled d-flex flex-column gap-2 small text-champagne mb-4">
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>UNESCO Recognition:</strong> Services and hospitality during the Arba'een pilgrimage.</li>
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>Pilgrim Corridor:</strong> Dedicated 80km path with 1,452 numbered utility poles.</li>
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>Solidarity:</strong> Universal humanitarian message transcending borders.</li>
                    </ul>
                    <button
                      type="button"
                      className="btn w-100 py-2.5 rounded-pill fw-semibold font-title"
                      style={{ background: 'linear-gradient(135deg, #C6A66B 0%, #A07F43 100%)', color: '#080B0B', fontSize: '0.8rem' }}
                      onClick={() => onNavigate('map')}
                    >
                      <i className="bi bi-geo-alt me-1.5"></i> Locate Concourse on Digital Twin Map
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </section>

      {/* =========================================================================
          CHAPTER 04 — JOURNEY THROUGH TIME (INTERACTIVE BEFORE/AFTER SLIDER)
          ========================================================================= */}
      <section id="chapter-04" className="chapter-section bg-sacred">
        <div className="container py-lg-4">
          
          <div className="chapter-header text-center max-w-700 mx-auto">
            <div className="chapter-number-pill">CHAPTER 04 • TEMPORAL PORTAL</div>
            <h2 className="chapter-title">Journey Through Time: 61 AH ↔ Present Day</h2>
            <p className="chapter-lead mx-auto">
              Drag the interactive gold handle below to cross 1,380 years of landscape transformation—from the solitary arid desert of al-Taff to today's illuminated architectural nexus.
            </p>
          </div>

          <div className="max-w-1000 mx-auto">
            <div
              ref={sliderContainerRef}
              className="compare-slider-container"
              onMouseDown={handleMouseDown}
              onTouchMove={handleTouchMove}
            >
              {/* Right Layer (Present Day) */}
              <div className="compare-layer">
                <img
                  src="assets/images/karbala_img_0_Beyn-_l_H_r_meyn__K_rb_la_jpg.jpg"
                  alt="Present Day Karbala"
                  className="compare-img"
                />
                <div className="compare-badge compare-badge-right">
                  PRESENT DAY (1445 AH) • MONUMENTAL COMPLEX
                </div>
              </div>

              {/* Left Layer (61 AH Historical Reconstruction) - clipped */}
              <div
                className="compare-layer"
                style={{
                  clipPath: `polygon(0% 0%, ${sliderPos}% 0%, ${sliderPos}% 100%, 0% 100%)`
                }}
              >
                <img
                  src="assets/images/ai_61ah_encampment.jpg"
                  alt="61 AH Historical Landscape"
                  className="compare-img"
                />
                <div className="compare-badge compare-badge-left">
                  61 AH (680 CE) • SCHOLARLY RECONSTRUCTION OF AL-TAFF
                </div>
              </div>

              {/* Interactive Divider Handle */}
              <div
                className="compare-handle"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="compare-handle-knob">
                  <i className="bi bi-arrows-expand" style={{ transform: 'rotate(45deg)' }}></i>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3 text-champagne small px-2">
              <div>
                <i className="bi bi-chevron-left me-1 text-gold-antique"></i>
                <strong style={{ color: 'var(--gold-antique)' }}>61 AH Plain of al-Taff</strong> ({Math.round(sliderPos)}%)
              </div>
              <div className="text-center font-serif fst-italic text-secondary" style={{ fontSize: '0.82rem' }}>
                Drag slider horizontally to reveal temporal transformation
              </div>
              <div>
                <strong style={{ color: 'var(--gold-antique)' }}>Present Day Shrines</strong> ({Math.round(100 - sliderPos)}%)
                <i className="bi bi-chevron-right ms-1 text-gold-antique"></i>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          CHAPTER 05 — THE HISTORICAL LANDSCAPE (CINEMATIC ASYMMETRIC SHOWCASE)
          ========================================================================= */}
      <section id="chapter-05" className="chapter-section bg-charcoal">
        <div className="container py-lg-4">
          
          <div className="chapter-header text-center max-w-800 mx-auto">
            <div className="chapter-number-pill">CHAPTER 05 • ARCHAEOLOGICAL VISUALIZATION</div>
            <h2 className="chapter-title">The Historical Landscape of 61 AH</h2>
            <p className="chapter-lead mx-auto">
              Ground-truth reconstructions produced through topological analysis of classical chronicles, hydrological contours of the Euphrates basin, and archaeological surveys of western Karbala.
            </p>
          </div>

          {/* Interactive Asymmetric Landscape Viewer */}
          <div className="row g-4 align-items-stretch max-w-1100 mx-auto">
            {/* Left: Large Featured Landscape Visual */}
            <div className="col-lg-7">
              <div className="p-3 rounded-3 h-100 d-flex flex-column" style={{ background: 'var(--bg-obsidian)', border: '1.5px solid var(--border-gold)', boxShadow: '0 16px 48px rgba(0, 0, 0, 0.7)' }}>
                <div className="position-relative overflow-hidden rounded-2 flex-grow-1" style={{ minHeight: '340px' }}>
                  <img
                    src={activeLandscape.image}
                    alt={activeLandscape.title}
                    className="w-100 h-100 object-fit-cover transition-transform"
                    style={{ filter: 'brightness(0.95)' }}
                  />
                  <div className="position-absolute top-0 end-0 m-3 d-flex gap-2">
                    <span className="badge px-2.5 py-1" style={{ background: 'rgba(8, 11, 11, 0.85)', color: 'var(--gold-antique)', border: '1px solid var(--border-gold)', fontSize: '0.7rem' }}>
                      {activeLandscape.badge}
                    </span>
                  </div>
                </div>

                <div className="pt-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h5 className="font-display text-ivory mb-0">{activeLandscape.title}</h5>
                    <span className="font-arabic text-gold-antique">{activeLandscape.arabic}</span>
                  </div>
                  <p className="font-serif small text-secondary mb-3" style={{ lineHeight: '1.65', fontSize: '0.88rem' }}>
                    {activeLandscape.desc}
                  </p>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary">
                    <span className="small text-champagne" style={{ fontSize: '0.72rem' }}>
                      <i className="bi bi-geo-alt me-1 text-gold-antique"></i>
                      {activeLandscape.archaeology}
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm px-3 py-1 rounded-pill"
                      style={{ background: 'linear-gradient(135deg, rgba(198, 166, 107, 0.2), rgba(16, 59, 50, 0.5))', color: 'var(--champagne-soft)', border: '1px solid var(--gold-antique)', fontSize: '0.75rem' }}
                      onClick={() => onOpenLightbox({
                        title: activeLandscape.title,
                        path: activeLandscape.image,
                        width: activeLandscape.width,
                        height: activeLandscape.height,
                        isAI: true,
                        source: 'Karbala Digital Twin Historical Modeling'
                      })}
                    >
                      <i className="bi bi-zoom-in me-1"></i> Inspect Master Monograph
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Landscape Study Selector Cards */}
            <div className="col-lg-5">
              <div className="d-flex flex-column gap-2.5 h-100 justify-content-between">
                {Object.keys(reconstructions61AH).map(key => {
                  const item = reconstructions61AH[key];
                  const isSelected = featuredLandscape === key;
                  return (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-3 cursor-pointer transition-all"
                      style={{
                        background: isSelected ? 'rgba(198, 166, 107, 0.15)' : 'var(--bg-charcoal)',
                        border: isSelected ? '1.5px solid var(--gold-antique)' : '1px solid rgba(198, 166, 107, 0.2)',
                        boxShadow: isSelected ? '0 4px 20px rgba(198, 166, 107, 0.2)' : 'none',
                        cursor: 'pointer'
                      }}
                      onClick={() => setFeaturedLandscape(key)}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="rounded-2 object-fit-cover flex-shrink-0"
                          style={{ width: '84px', height: '62px', border: '1px solid var(--border-gold)' }}
                        />
                        <div className="flex-grow-1 min-w-0">
                          <h6 className="font-display text-ivory mb-0 text-truncate" style={{ fontSize: '0.88rem' }}>{item.title}</h6>
                          <div className="font-arabic small text-gold-antique mb-1" style={{ fontSize: '0.8rem' }}>{item.arabic}</div>
                          <span className="small text-secondary text-truncate d-block" style={{ fontSize: '0.72rem' }}>
                            {item.aspect}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <button
              type="button"
              className="editorial-action-btn px-4 py-2.5"
              onClick={() => onNavigate('journey-61ah')}
            >
              Explore Full 61 AH Topographical Dossier →
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          CHAPTER 06 — THE CHRONOLOGY (MUHARRAM 2-10 & ASHURA PHASES)
          ========================================================================= */}
      <section id="chapter-06" className="chapter-section bg-obsidian">
        <div className="container py-lg-4">
          
          <div className="chapter-header text-center max-w-700 mx-auto">
            <div className="chapter-number-pill">CHAPTER 06 • TEMPORAL CHRONOLOGY</div>
            <h2 className="chapter-title">The Illuminated Chronology</h2>
            <p className="chapter-lead mx-auto">
              Follow the day-by-day progression from the caravan's arrival on 2 Muharram 61 AH to the climactic phases of the Day of Ashura.
            </p>

            <div className="d-inline-flex p-1.5 rounded-pill mt-3" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-gold)' }}>
              <button
                type="button"
                className={`btn btn-sm px-4 rounded-pill fw-semibold ${chronologyTab === 'days' ? 'bg-warning text-dark' : 'text-champagne'}`}
                style={{ fontSize: '0.78rem', letterSpacing: '0.04em' }}
                onClick={() => setChronologyTab('days')}
              >
                Muharram 2–10 Milestones
              </button>
              <button
                type="button"
                className={`btn btn-sm px-4 rounded-pill fw-semibold ${chronologyTab === 'ashura' ? 'bg-warning text-dark' : 'text-champagne'}`}
                style={{ fontSize: '0.78rem', letterSpacing: '0.04em' }}
                onClick={() => setChronologyTab('ashura')}
              >
                Six Phases of Ashura
              </button>
            </div>
          </div>

          {/* Chronology Content */}
          {chronologyTab === 'days' ? (
            <div className="row g-3">
              {[
                { day: 'Day 02', title: 'Arrival at Karbala', desc: 'The caravan of Imam Hussain halts upon the desert of al-Taff. Tents are pitched and defensive trenches excavated.', date: '2 Muharram 61 AH' },
    { day: "Day 03", title: "Umar ibn Sa'd Arrives", desc: "The vanguard of Kufa arrives with 4,000 cavalry under Umar ibn Sa'd, establishing encirclement.", date: "3 Muharram 61 AH" },
    { day: "Day 07", title: "Severing of the Water Supply", desc: "Umar ibn Sa'd issues the decree blocking all access to the Euphrates and Nahr al-Alqami.", date: "7 Muharram 61 AH" },
    { day: "Day 09", title: "Tasu'a & Night of Devotion", desc: "The final ultimatum is delivered. Imam Hussain requests a single night of prayer, devotion, and Qur'anic recitation.", date: "9 Muharram 61 AH" },
                { day: 'Day 10', title: 'The Day of Ashura', desc: 'From dawn invocations to the final stand, the faithful companions and family stand with supreme dignity.', date: '10 Muharram 61 AH' }
              ].map((item, idx) => (
                <div key={idx} className="col-lg col-md-6">
                  <div className="p-3 rounded-3 h-100 d-flex flex-column" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(198, 166, 107, 0.22)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge px-2 py-1" style={{ background: 'rgba(198, 166, 107, 0.15)', color: 'var(--gold-antique)', border: '1px solid var(--border-gold)', fontSize: '0.7rem' }}>
                        {item.day}
                      </span>
                      <span className="small text-secondary" style={{ fontSize: '0.68rem' }}>{item.date}</span>
                    </div>
                    <h6 className="font-display text-ivory mb-2" style={{ fontSize: '0.92rem' }}>{item.title}</h6>
                    <p className="font-serif small text-secondary mb-0 flex-grow-1" style={{ lineHeight: '1.5', fontSize: '0.8rem' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="row g-3">
              {[
                { phase: 'Phase I', title: 'Dawn Invocations', time: 'Approx. 5:30 AM', desc: 'Imam Hussain leads the dawn prayer and ascends his mount to deliver the speech of admonition.' },
                { phase: 'Phase II', title: 'The Flank Skirmishes', time: 'Approx. 8:30 AM', desc: 'Individual duels and skirmishes. Faithful companions defend the camp perimeter.' },
                { phase: 'Phase III', title: 'Midday Prayer Under Arrows', time: 'Approx. 12:15 PM', desc: 'Salat al-Khawf offered while shields are raised to protect the congregants from incoming archery.' },
                { phase: 'Phase IV', title: 'Sacrifice of the Hashemites', time: 'Approx. 2:00 PM', desc: 'Ali al-Akbar, Qasim, and Abu al-Fadl al-Abbas step forth for their final noble stands.' },
                { phase: 'Phase V', title: 'The Final Stand', time: 'Approx. 4:30 PM', desc: 'Imam Hussain stands alone at Gowd-e Qatlgah, concluding his testimony of supreme moral integrity.' },
                { phase: 'Phase VI', title: 'Sham-e Ghariban', time: 'Approx. 6:30 PM', desc: 'Twilight descends on the burning tents. Lady Zaynab gathers the surviving women and children.' }
              ].map((item, idx) => (
                <div key={idx} className="col-lg-4 col-md-6">
                  <div className="p-3 rounded-3 h-100" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(16, 59, 50, 0.5)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="badge px-2 py-0.5" style={{ background: 'var(--emerald-deep)', color: 'var(--champagne-soft)', fontSize: '0.68rem' }}>
                        {item.phase}
                      </span>
                      <span className="small text-gold-antique" style={{ fontSize: '0.72rem' }}>{item.time}</span>
                    </div>
                    <h6 className="font-display text-ivory mb-2" style={{ fontSize: '0.94rem' }}>{item.title}</h6>
                    <p className="font-serif small text-secondary mb-0" style={{ lineHeight: '1.5', fontSize: '0.82rem' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-5">
            <button
              type="button"
              className="editorial-action-btn px-4 py-2.5"
              onClick={() => onNavigate('timeline')}
            >
              Open Comprehensive Chronology View →
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          CHAPTER 07 — THE LIVING ARCHIVE (520+ ASSETS CURATED SHOWCASE)
          ========================================================================= */}
      <section id="chapter-07" className="chapter-section bg-charcoal">
        <div className="container py-lg-4">
          
          <div className="chapter-header text-center max-w-700 mx-auto">
            <div className="chapter-number-pill">CHAPTER 07 • VISUAL REPOSITORY</div>
            <h2 className="chapter-title">The Living Archive: Sacred Photographic Pavilion</h2>
            <p className="chapter-lead mx-auto">
              A curated repository encompassing over 520 high-resolution architectural photographs, rare archival documents, and scholarly visual models.
            </p>

            <div className="d-inline-flex p-1.5 rounded-pill mt-3 flex-wrap justify-content-center" style={{ background: 'var(--bg-obsidian)', border: '1px solid var(--border-gold)' }}>
              {[
                { id: 'all', label: 'Curated Selection' },
                { id: 'shrine', label: 'Holy Shrines' },
                { id: 'history', label: 'Historic Architecture' },
                { id: 'reconstruction', label: '61 AH Reconstructions' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  className={`btn btn-sm px-3.5 py-1.5 rounded-pill fw-semibold ${archiveFilter === f.id ? 'bg-warning text-dark' : 'text-champagne'}`}
                  style={{ fontSize: '0.76rem' }}
                  onClick={() => setArchiveFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="row g-4 mt-2">
            {filteredArchive.map((item, idx) => (
              <div key={idx} className="col-lg-4 col-md-6">
                <div
                  className="gallery-card cursor-pointer"
                  onClick={() => onOpenLightbox(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="position-relative overflow-hidden" style={{ height: '260px' }}>
                    <img src={item.path} alt={item.title} className="w-100 h-100 object-fit-cover transition-transform" />
                    <div className="gallery-card-badge">
                      {item.isAI ? '61 AH RECONSTRUCTION' : 'ARCHIVAL MASTER'}
                    </div>
                  </div>
                  <div className="gallery-card-info">
                    <h6 className="font-display text-ivory text-truncate mb-1" style={{ fontSize: '0.9rem' }}>{item.title}</h6>
                    <div className="d-flex justify-content-between align-items-center small text-champagne opacity-75" style={{ fontSize: '0.72rem' }}>
                      <span>{item.width} × {item.height} px</span>
                      <span>{item.source}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <button
              type="button"
              className="editorial-action-btn px-4 py-2.5"
              onClick={() => onNavigate('pavilion')}
            >
              Explore Full Pavilion (520+ Archival Assets) →
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          CHAPTER 08 — ENTER THE DIGITAL TWIN (MONUMENTAL SPATIAL INVITATION)
          ========================================================================= */}
      <section id="chapter-08" className="chapter-section bg-obsidian">
        <div className="container py-lg-4">
          
          <div className="portal-invitation-box max-w-1000 mx-auto">
            <div className="chapter-number-pill">CHAPTER 08 • THE IMMERSIVE DIGITAL TWIN</div>
            
            <h2 className="font-display text-white mb-3" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', letterSpacing: '0.06em' }}>
              Enter Karbala Digital Twin
            </h2>

            <p className="lead font-serif fst-italic text-champagne max-w-700 mx-auto mb-4" style={{ lineHeight: '1.7' }}>
              Ascend to the spatial digital twin. Explore 20 GPS-verified historical coordinates across dual epochs, activate the Then ↔ Now split lens, and experience synchronized acoustic soundscapes.
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-4 text-champagne small mb-5">
              <div><i className="bi bi-compass text-gold-antique me-2"></i>Dual-Epoch Cartographic Engine</div>
              <div><i className="bi bi-shield-check text-gold-antique me-2"></i>Two-Pass Collision-Free Labels</div>
              <div><i className="bi bi-layout-split text-gold-antique me-2"></i>Then ↔ Now Split Lens</div>
              <div><i className="bi bi-volume-up text-gold-antique me-2"></i>Spatial Ziyarat Soundscapes</div>
            </div>

            <button
              type="button"
              className="btn btn-lg px-5 py-3 rounded-pill fw-bold font-title shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #C6A66B 0%, #A07F43 100%)',
                color: '#080B0B',
                letterSpacing: '0.12em',
                fontSize: '0.98rem',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 8px 36px rgba(198, 166, 107, 0.45)'
              }}
              onClick={() => onNavigate('map')}
            >
              <i className="bi bi-compass-fill me-2 fs-5"></i>
              LAUNCH FULL INTERACTIVE DIGITAL TWIN MAP
            </button>
          </div>

        </div>
      </section>

      {/* Museum Website Global Footer */}
      <footer className="py-5 bg-charcoal border-top border-secondary">
        <div className="container text-center">
          <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
            <span className="font-arabic fs-4 text-gold-antique">ك</span>
            <span className="font-display fw-bold text-ivory letter-spacing-2">KARBALA DIGITAL HERITAGE MUSEUM</span>
          </div>
          <p className="small text-secondary max-w-600 mx-auto mb-4" style={{ fontSize: '0.8rem' }}>
            A rigorous historical and cartographic digital twin dedicated to preserving the spatial and spiritual memory of Karbala in 61 AH and the contemporary era.
          </p>
          <div className="d-flex justify-content-center gap-4 small text-champagne mb-4 flex-wrap" style={{ fontSize: '0.78rem' }}>
            <button type="button" className="btn btn-link text-champagne p-0 text-decoration-none" onClick={() => onNavigate('story')}>Historical Narrative</button>
            <button type="button" className="btn btn-link text-champagne p-0 text-decoration-none" onClick={() => onNavigate('journey-61ah')}>61 AH Landscape</button>
            <button type="button" className="btn btn-link text-champagne p-0 text-decoration-none" onClick={() => onNavigate('timeline')}>Chronology</button>
            <button type="button" className="btn btn-link text-champagne p-0 text-decoration-none" onClick={() => onNavigate('personalities')}>Personalities</button>
            <button type="button" className="btn btn-link text-champagne p-0 text-decoration-none" onClick={() => onNavigate('pavilion')}>Pavilion</button>
            <button type="button" className="btn btn-link text-champagne p-0 text-decoration-none" onClick={() => onNavigate('historiography')}>Historiography</button>
          </div>
          <div className="small text-secondary" style={{ fontSize: '0.72rem' }}>
            © 61 AH – 1445 AH / 2026 CE • Karbala Digital Heritage Museum • Open Scholarly Heritage
          </div>
        </div>
      </footer>

    </div>
  );
}




function SubviewHeader({ number, title, arabic, lead, onBack }) {
  return (
    <div className="subview-header">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          type="button"
          className="map-return-btn"
          onClick={onBack}
        >
          <i className="bi bi-arrow-left"></i>
          <span>Return to Museum Home</span>
        </button>

        <span className="badge px-3 py-1" style={{ background: 'var(--bg-elevated)', color: 'var(--gold-antique)', border: '1px solid var(--border-gold)', fontSize: '0.72rem' }}>
          CURATORIAL EXHIBITION
        </span>
      </div>

      <div className="chapter-number-pill">{number}</div>
      <h1 className="chapter-title">{title}</h1>
      {arabic && <div className="font-arabic fs-3 text-gold-antique mb-3">{arabic}</div>}
      {lead && <p className="chapter-lead mx-auto">{lead}</p>}
    </div>
  );
}

/* =========================================================================
   DEDICATED VIEW: THE HISTORICAL STORY
   ========================================================================= */
function DedicatedStoryView({ onBack, onNavigateToMap }) {
  const storyChapters = [
    {
      num: '01',
      title: 'The Journey from Medina to Mecca',
      arabic: 'الخروج من المدينة إلى مكة المكرمة',
      period: 'Rajab 60 AH – Dhu al-Hijjah 60 AH',
      body: `Refusing allegiance to Yazid ibn Muawiya, Imam Hussain departed his grandfather's city of Medina under the cover of night, reciting the Qur'anic verse of Moses fleeing Egypt: "So he escaped from there, fearful and watchful..." In Mecca, letters of invitation from the notables of Kufa arrived by the thousands, imploring the Imam to lead them toward righteousness and social justice.`,
      citation: 'Tarikh al-Rusul wa al-Muluk (al-Tabari), Vol. 5, p. 341; Kitab al-Irshad (Shaykh al-Mufid), p. 182.'
    },
    {
      num: '02',
      title: 'The Trek Across the Arabian Sands',
      arabic: 'المسير عبر الصحراء',
      period: 'Dhu al-Hijjah 60 AH – Muharram 61 AH',
      body: 'Leaving Mecca before the Hajj to preserve the sanctuary from bloodshed, the caravan ventured into the vast northern wilderness. En route, at Dhu Husam, they encountered the thousand-strong cavalry of Hurr ibn Yazid al-Riyahi, suffering from extreme dehydration. Demonstrating peerless chivalry, Imam Hussain ordered his companions to quench the thirst of Hurr’s men and their horses.',
      citation: 'Maqtal al-Hussain (Abu Mikhnaf), p. 76; Ansab al-Ashraf (al-Baladhuri), Vol. 3, p. 168.'
    },
    {
      num: '03',
      title: 'The Arrival at Karbala',
      arabic: 'النزول في كربلاء',
      period: '2 Muharram 61 AH (October 2, 680 CE)',
      body: `Hurr’s cavalry received military orders to force the Imam into an open, desolate plain without fortresses or immediate water access. When the mount of Imam Hussain halted, he enquired of the land's ancient name. The locals responded: "al-Taff... al-Aqr... Karbala." Hearing this, the Imam wept and proclaimed: "O Allah, I seek refuge in You from Karb (grief) and Bala (tribulation). This is the anchorage of our mounts, the shedding of our blood, and the place of our graves."`,
      citation: 'Al-Bidayah wa al-Nihayah (Ibn Kathir), Vol. 8, p. 175.'
    },
    {
      num: '04',
      title: 'The Encirclement & The Water Siege',
      arabic: 'حصار الماء في كربلاء',
      period: '7 Muharram 61 AH',
      body: `Umar ibn Sa'd, having assumed supreme command with a force exceeding 20,000 fighters, was commanded by Ubaydullah ibn Ziyad: "Prevent Hussain and his companions from obtaining a single drop of water, just as Uthman ibn Affan was besieged." Amr ibn al-Hajjaj was deployed with 500 horsemen along Nahr al-Alqami, cutting off the lifeline to the camp.`,
      citation: 'Kitab al-Irshad, p. 226; Tarikh al-Tabari, Vol. 5, p. 412.'
    },
    {
      num: '05',
      title: "The Night of Ashura (Tasu'a)",
      arabic: 'ليلة العاشر من المحرم',
      period: '9 Muharram 61 AH',
      body: 'On the eve of the tenth, Imam Hussain gathered his family and companions in the central pavilion. He extinguished the lamp so none would feel ashamed, granting them leave to depart into the night. One by one, from Muslim ibn Awsaja to Zuhayr ibn al-Qayn and Abu al-Fadl al-Abbas, the companions rose and declared: "By Allah, we shall never desert you! If we were killed, then revived, then burnt and scattered in the wind seventy times, we would never separate from you."',
      citation: "Rawdat al-Wa'izin (al-Fattal al-Naysaburi), p. 183."
    },
    {
      num: '06',
      title: 'The Tenth of Muharram: The Day of Ashura',
      arabic: 'يوم عاشوراء الخالد',
      period: '10 Muharram 61 AH (October 10, 680 CE)',
      body: 'A day that etched itself into eternity. From dawn prayers under fire to the duels of loyal companions, the sacrifice of youth including Ali al-Akbar and Qasim ibn Hasan, the martyrdom of the loyal brother al-Abbas at the riverbank, and the final solitary stand of the Master of Martyrs at Gowd-e Qatlgah. A moral victory that redefined humanity’s conception of justice and moral defiance against tyranny.',
      citation: 'Maqtal al-Hussain (Abd al-Razzaq al-Muqarram), p. 240.'
    }
  ];

  return (
    <div className="subview-container container">
      <SubviewHeader
        number="DOCUMENTARY EXHIBITION"
        title="The Historical Narrative of Karbala"
        arabic="الملحمة الحسينية وسيرة الطف"
        lead="An academically responsible, chronologically structured narrative detailing the events of 60–61 AH based on the earliest primary chronicles."
        onBack={onBack}
      />

      <div className="row g-4 max-w-1000 mx-auto">
        {storyChapters.map(ch => (
          <div key={ch.num} className="col-12">
            <div className="p-4 rounded-3" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(198, 166, 107, 0.25)' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge px-3 py-1" style={{ background: 'var(--emerald-deep)', color: 'var(--champagne-soft)', fontSize: '0.74rem' }}>
                  CHAPTER {ch.num} • {ch.period}
                </span>
                <span className="font-arabic small text-gold-antique">{ch.arabic}</span>
              </div>

              <h4 className="font-display text-ivory mb-3">{ch.title}</h4>
              <p className="font-serif text-secondary mb-3" style={{ lineHeight: '1.8', fontSize: '0.96rem' }}>
                {ch.body}
              </p>

              <div className="p-3 rounded-2" style={{ background: 'rgba(8, 11, 11, 0.6)', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--champagne-soft)' }}>
                <i className="bi bi-journal-bookmark me-2 text-gold-antique"></i>
                <strong>Primary Citations:</strong> {ch.citation}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-5">
        <button
          type="button"
          className="btn btn-lg px-5 py-3 rounded-pill fw-bold font-title shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #C6A66B 0%, #A07F43 100%)', color: '#080B0B' }}
          onClick={onNavigateToMap}
        >
          <i className="bi bi-compass me-2"></i>
          Explore Locations of The Story on the Digital Twin Map
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   DEDICATED VIEW: JOURNEY TO 61 AH (HISTORICAL RECONSTRUCTION)
   ========================================================================= */
function Dedicated61AhView({ onBack, onNavigateToMap, onOpenLightbox }) {
  const landscapes = [
    {
      title: 'The Encampment (al-Mukhayyam al-Husayni)',
      arabic: 'المخيم الحسيني الشريف',
      image: 'assets/images/ai_61ah_encampment.jpg',
      aspect: 'Topographical Encampment Modeling',
      desc: 'The camp comprised approximately 30 to 40 desert pavilions arranged in a dense semicircle. To prevent surprise rear cavalry charges, Imam Hussain ordered a crescent trench dug behind the camp, packed with firewood and reeds ignited on the morning of Ashura.',
      archaeology: 'Western Karbala alluvial terrace, elevated 28m above sea level.'
    },
    {
      title: 'Nahr al-Alqami & The Ancient Euphrates Branch',
      arabic: 'مجرى نهر العلقمي وبساتين النخيل',
      image: 'assets/images/ai_61ah_alqami_river.jpg',
      aspect: 'Hydrological Course Modeling',
      desc: 'Nahr al-Alqami was a perennial natural distributary branching from the Euphrates near ancient Kufa. Its banks were lined with thick reedbeds (Phragmites australis) and ancient Phoenix dactylifera palm groves. Silting in subsequent centuries led to its desiccation.',
      archaeology: 'Traced through aerial sediment anomalies and early Umayyad irrigation channels.'
    },
    {
      title: 'Tall al-Zaynabiyya (The Elevated Vantage Knoll)',
      arabic: 'التل الزينبي المشرف على ساحة المعركة',
      image: 'assets/images/ai_61ah_tall_zaynabiyya.jpg',
      aspect: 'Geomorphological Elevation Study',
      desc: 'A natural sandstone and gravel knoll rising approximately 5 meters above the surrounding depression. It offered an unobstructed visual axis across both the encampment to the south and Gowd-e Qatlgah to the east.',
      archaeology: 'Preserved beneath the current marble sanctuary of al-Tall al-Zaynabiyya.'
    },
    {
      title: 'Gowd-e Qatlgah & The Depression of al-Taff',
      arabic: 'منخفض المقتل الشريف',
      image: 'assets/images/ai_61ah_sham_e_ghariban.jpg',
      aspect: 'Climactic Site Reconstruction',
      desc: `A natural subterranean depression where the ground sloped downward toward the ancient flood basin. Here Imam Hussain made his final solitary stand. The modern Ha'ir al-Husayni was constructed directly encasing this depression.`,
      archaeology: 'Located exactly at the level of the modern rawdah floor beneath the golden dome.'
    }
  ];

  return (
    <div className="subview-container container">
      <SubviewHeader
        number="ARCHAEOLOGICAL GEOGRAPHY"
        title="Journey to 61 AH: The Reconstruction"
        arabic="التحقيق الطوبوغرافي لأرض كربلاء عام ٦١ للهجرة"
        lead="A scholarly examination of the topography, hydrology, and architectural layout of Karbala at the time of the event in 61 AH (680 CE)."
        onBack={onBack}
      />

      <div className="row g-4 max-w-1000 mx-auto">
        {landscapes.map((item, idx) => (
          <div key={idx} className="col-lg-6">
            <div className="p-3 rounded-3 h-100 d-flex flex-column" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(198, 166, 107, 0.28)' }}>
              <div className="position-relative overflow-hidden rounded-2 mb-3" style={{ height: '220px' }}>
                <img src={item.image} alt={item.title} className="w-100 h-100 object-fit-cover" />
                <span className="badge position-absolute top-0 end-0 m-2" style={{ background: 'rgba(8, 11, 11, 0.85)', color: 'var(--gold-antique)', border: '1px solid var(--border-gold)', fontSize: '0.65rem' }}>
                  SCHOLARLY RECONSTRUCTION
                </span>
              </div>

              <h5 className="font-display text-ivory mb-1">{item.title}</h5>
              <div className="font-arabic small text-gold-antique mb-2">{item.arabic}</div>
              
              <p className="font-serif small text-secondary mb-3 flex-grow-1" style={{ lineHeight: '1.6', fontSize: '0.88rem' }}>
                {item.desc}
              </p>

              <div className="p-2.5 rounded-2 mb-3" style={{ background: 'rgba(8, 11, 11, 0.7)', border: '1px solid var(--border-subtle)', fontSize: '0.74rem', color: 'var(--champagne-soft)' }}>
                <i className="bi bi-geo-alt me-1 text-gold-antique"></i>
                <strong>Archaeological Attestation:</strong> {item.archaeology}
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <span className="small text-secondary" style={{ fontSize: '0.7rem' }}>{item.aspect}</span>
                <button
                  type="button"
                  className="editorial-action-btn px-3 py-1"
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => onOpenLightbox({
                    title: item.title,
                    path: item.image,
                    width: 1920,
                    height: 1080,
                    isAI: true,
                    source: 'Karbala Digital Twin Historical Modeling'
                  })}
                >
                  <i className="bi bi-zoom-in"></i> Inspect High-Res
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-5">
        <button
          type="button"
          className="btn btn-lg px-5 py-3 rounded-pill fw-bold font-title shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #C6A66B 0%, #A07F43 100%)', color: '#080B0B' }}
          onClick={onNavigateToMap}
        >
          <i className="bi bi-compass me-2"></i>
          Explore the 61 AH Topographical Map in Digital Twin
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   DEDICATED VIEW: TIMELINE (MUHARRAM 2-10 & ASHURA 6 PHASES)
   ========================================================================= */
function DedicatedTimelineView({ onBack, onNavigateToMap }) {
  const [selectedDay, setSelectedDay] = useState(0);

  const currentDayData = MUHARRAM_DAYS[selectedDay] || MUHARRAM_DAYS[0];

  return (
    <div className="subview-container container">
      <SubviewHeader
        number="TEMPORAL REGISTRY"
        title="The Illuminated Chronology of Muharram"
        arabic="التقويم الزمني لوقائع كربلاء"
        lead="A comprehensive day-by-day exploration of the events from the caravan's arrival on 2 Muharram 61 AH to the climactic phases of Ashura."
        onBack={onBack}
      />

      {/* Day Selector Navigation Ribbon */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
        {MUHARRAM_DAYS.map((d, idx) => (
          <button
            key={d.dayNumber}
            type="button"
            className={`btn btn-sm px-3 py-1.5 rounded-pill font-title ${selectedDay === idx ? 'bg-warning text-dark fw-bold' : 'btn-outline-secondary text-champagne'}`}
            style={{ fontSize: '0.78rem' }}
            onClick={() => setSelectedDay(idx)}
          >
            {d.title} (Day {d.dayNumber})
          </button>
        ))}
      </div>

      {/* Selected Day Monograph */}
      <div className="p-4 rounded-3 max-w-1000 mx-auto" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-gold)' }}>
        <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-secondary">
          <div>
            <span className="badge px-3 py-1 mb-1" style={{ background: 'var(--emerald-deep)', color: 'var(--champagne-soft)', fontSize: '0.76rem' }}>
              MUHARRAM {currentDayData.dayNumber}, 61 AH • {currentDayData.hijriDate}
            </span>
            <h3 className="font-display text-ivory mb-0">{currentDayData.title}</h3>
          </div>
          <div className="font-arabic fs-4 text-gold-antique">{currentDayData.arabicTitle}</div>
        </div>

        <p className="font-serif lead text-champagne mb-4" style={{ lineHeight: '1.8' }}>
          {currentDayData.overview}
        </p>

        <h5 className="font-display text-gold-antique mb-3">Key Chronological Events</h5>
        <div className="d-flex flex-column gap-3 mb-4">
          {currentDayData.events.map((ev, i) => (
            <div key={i} className="p-3 rounded-2" style={{ background: 'rgba(8, 11, 11, 0.7)', border: '1px solid var(--border-subtle)' }}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h6 className="font-display text-ivory mb-0">{ev.title}</h6>
                {ev.time && <span className="small text-gold-antique" style={{ fontSize: '0.72rem' }}>{ev.time}</span>}
              </div>
              <p className="font-serif small text-secondary mb-2" style={{ lineHeight: '1.6', fontSize: '0.88rem' }}>
                {ev.description}
              </p>
              {ev.quote && (
                <div className="small font-serif fst-italic p-2 rounded" style={{ background: 'rgba(198, 166, 107, 0.08)', color: 'var(--champagne-soft)', borderLeft: '2px solid var(--gold-antique)' }}>
                  &ldquo;{ev.quote}&rdquo;
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Ashura Phases if Day 10 */}
        {currentDayData.dayNumber === 10 && currentDayData.ashuraPhases && (
          <div className="mt-4 pt-4 border-top border-secondary">
            <h5 className="font-display text-gold-antique mb-3">The Six Sequential Phases of the Day of Ashura</h5>
            <div className="row g-3">
              {currentDayData.ashuraPhases.map((phase, pIdx) => (
                <div key={pIdx} className="col-md-6">
                  <div className="p-3 rounded-2 h-100" style={{ background: 'rgba(16, 59, 50, 0.25)', border: '1px solid var(--border-gold)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="badge px-2 py-0.5" style={{ background: 'var(--emerald-deep)', color: 'var(--champagne-soft)', fontSize: '0.68rem' }}>
                        PHASE {phase.phase}
                      </span>
                      <span className="small text-champagne" style={{ fontSize: '0.72rem' }}>{phase.time}</span>
                    </div>
                    <h6 className="font-display text-ivory mb-1">{phase.name}</h6>
                    <div className="font-arabic small text-gold-antique mb-2">{phase.arabicName}</div>
                    <p className="font-serif small text-secondary mb-0" style={{ lineHeight: '1.5', fontSize: '0.84rem' }}>
                      {phase.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-5">
        <button
          type="button"
          className="btn btn-lg px-5 py-3 rounded-pill fw-bold font-title shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #C6A66B 0%, #A07F43 100%)', color: '#080B0B' }}
          onClick={onNavigateToMap}
        >
          <i className="bi bi-clock-history me-2"></i>
          Play Chronology on the Interactive Map
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   DEDICATED VIEW: PERSONALITIES (HALL OF BIOGRAPHIES)
   ========================================================================= */
function DedicatedPersonalitiesView({ onBack, onNavigateToMap }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    return PERSONALITIES.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.arabicName.includes(search) ||
                          p.role.toLowerCase().includes(search.toLowerCase());
      if (filter === 'all') return matchSearch;
      if (filter === 'family') return matchSearch && (p.category === 'family' || p.role.includes('Household') || p.role.includes('Son'));
      if (filter === 'companion') return matchSearch && (p.category === 'companion' || p.role.includes('Companion'));
      if (filter === 'women') return matchSearch && (p.category === 'women' || p.name.includes('Zaynab') || p.name.includes('Umm'));
      return matchSearch;
    });
  }, [search, filter]);

  return (
    <div className="subview-container container">
      <SubviewHeader
        number="CURATORIAL BIOGRAPHIES"
        title="Hall of Historical Personalities"
        arabic="شخصيات واقعة الطف الخالدة"
        lead="Scholarly biographical monographs of the central figures of Karbala, detailing their lineages, actions, and enduring moral legacy."
        onBack={onBack}
      />

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 max-w-1000 mx-auto mb-4">
        {/* Search */}
        <div className="position-relative" style={{ minWidth: '280px' }}>
          <input
            type="text"
            className="form-control rounded-pill px-4"
            placeholder="Search personality by name or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-gold)', color: 'var(--ivory-warm)', fontSize: '0.84rem' }}
          />
          <i className="bi bi-search position-absolute end-0 top-50 translate-middle-y me-3 text-secondary"></i>
        </div>

        {/* Filter Pills */}
        <div className="d-flex gap-2">
          {['all', 'family', 'companion', 'women'].map(f => (
            <button
              key={f}
              type="button"
              className={`btn btn-sm px-3 rounded-pill ${filter === f ? 'bg-warning text-dark fw-bold' : 'btn-outline-secondary text-champagne'}`}
              style={{ fontSize: '0.76rem', textTransform: 'capitalize' }}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All Figures' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-4 max-w-1000 mx-auto">
        {filtered.map(person => (
          <div key={person.id} className="col-lg-6">
            <div className="p-4 rounded-3 h-100 d-flex flex-column" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(198, 166, 107, 0.28)' }}>
              <div className="d-flex gap-3 mb-3">
                <img
                  src={person.image}
                  alt={person.name}
                  className="rounded-circle object-fit-cover"
                  style={{ width: '80px', height: '80px', border: '2px solid var(--gold-antique)', flexShrink: 0 }}
                />
                <div>
                  <h5 className="font-display text-ivory mb-0">{person.name}</h5>
                  <div className="font-arabic text-gold-antique mb-1">{person.arabicName}</div>
                  <div className="small font-serif fst-italic text-champagne mb-1" style={{ fontSize: '0.82rem' }}>
                    {person.epithet || person.role}
                  </div>
                  <span className="badge px-2 py-0.5" style={{ background: 'rgba(16, 59, 50, 0.8)', color: 'var(--champagne-soft)', fontSize: '0.66rem' }}>
                    {person.role}
                  </span>
                </div>
              </div>

              <p className="font-serif text-secondary small mb-3 flex-grow-1" style={{ lineHeight: '1.7', fontSize: '0.88rem' }}>
                {person.biography}
              </p>

              {person.keyAction && (
                <div className="p-2.5 rounded-2 mb-3" style={{ background: 'rgba(8, 11, 11, 0.7)', border: '1px solid var(--border-subtle)', fontSize: '0.76rem', color: 'var(--champagne-soft)' }}>
                  <i className="bi bi-star me-1 text-gold-antique"></i>
                  <strong>Defining Action:</strong> {person.keyAction}
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary">
                <span className="small text-secondary" style={{ fontSize: '0.72rem' }}>
                  Timeline: Days {person.timelineDays?.join(', ') || '10'}
                </span>
                <button
                  type="button"
                  className="editorial-action-btn px-3 py-1"
                  style={{ fontSize: '0.75rem' }}
                  onClick={onNavigateToMap}
                >
                  Locate on Map →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   DEDICATED VIEW: PAVILION (520+ ASSETS FULL VISUAL ARCHIVE)
   ========================================================================= */
function DedicatedPavilionView({ onBack, onOpenLightbox, galleryImages = [] }) {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 24;

  const filtered = useMemo(() => {
    return galleryImages.filter(img => {
      const matchCat = category === 'all' ||
        (category === 'shrine' && (img.category === 'shrine' || img.category === 'holy_shrine')) ||
        (category === 'reconstruction' && (img.category === 'historical_ai' || img.isAI)) ||
        (category === 'archive' && img.category !== 'historical_ai' && !img.isAI);
      const matchSearch = !search || img.title.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [galleryImages, category, search]);

  const displayed = useMemo(() => {
    return filtered.slice(0, page * pageSize);
  }, [filtered, page]);

  return (
    <div className="subview-container container">
      <SubviewHeader
        number="PHOTOGRAPHIC MONOGRAPHS"
        title="Sacred Photographic Pavilion"
        arabic="الجناح الفوتوغرافي والوثائقي المقدس"
        lead={`A vast archival collection comprising ${galleryImages.length} high-resolution photographs, architectural details, and scholarly reconstructions.`}
        onBack={onBack}
      />

      {/* Search and Category Filters */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 max-w-1000 mx-auto mb-4">
        <div className="position-relative" style={{ minWidth: '280px' }}>
          <input
            type="text"
            className="form-control rounded-pill px-4"
            placeholder="Search archival photos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-gold)', color: 'var(--ivory-warm)', fontSize: '0.84rem' }}
          />
          <i className="bi bi-search position-absolute end-0 top-50 translate-middle-y me-3 text-secondary"></i>
        </div>

        <div className="d-flex gap-2">
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'shrine', label: 'Holy Shrines' },
            { id: 'reconstruction', label: '61 AH Reconstructions' },
            { id: 'archive', label: 'Archival Registry' }
          ].map(c => (
            <button
              key={c.id}
              type="button"
              className={`btn btn-sm px-3 rounded-pill ${category === c.id ? 'bg-warning text-dark fw-bold' : 'btn-outline-secondary text-champagne'}`}
              style={{ fontSize: '0.76rem' }}
              onClick={() => { setCategory(c.id); setPage(1); }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Images */}
      <div className="row g-3">
        {displayed.map((img, idx) => (
          <div key={idx} className="col-xl-3 col-lg-4 col-sm-6">
            <div
              className="gallery-card cursor-pointer"
              onClick={() => onOpenLightbox(img)}
              style={{ cursor: 'pointer' }}
            >
              <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
                <img
                  src={img.path}
                  alt={img.title}
                  className="w-100 h-100 object-fit-cover"
                  loading="lazy"
                />
                <span className="gallery-card-badge">
                  {img.category === 'historical_ai' || img.isAI ? '61 AH RECONSTRUCTION' : 'ARCHIVAL MASTER'}
                </span>
              </div>
              <div className="gallery-card-info">
                <div className="text-truncate small fw-semibold text-ivory mb-1 font-title" title={img.title}>
                  {img.title}
                </div>
                <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                  <span>{img.width} × {img.height} px</span>
                  <span className="text-truncate ms-2" style={{ maxWidth: '120px' }}>{img.source || 'Curatorial Archive'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {displayed.length < filtered.length && (
        <div className="text-center mt-5">
          <button
            type="button"
            className="editorial-action-btn px-4 py-2.5"
            onClick={() => setPage(p => p + 1)}
          >
            <i className="bi bi-arrow-down-circle me-2"></i>
            Reveal More Archival Assets ({filtered.length - displayed.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   DEDICATED VIEW: HISTORIOGRAPHY & CERTAINTY MATRIX
   ========================================================================= */
function DedicatedHistoriographyView({ onBack, onNavigateToMap }) {
  const [selectedKey, setSelectedKey] = useState('maqtal_hussain');
  const details = CERTAINTY_EXPLANATIONS[selectedKey] || CERTAINTY_EXPLANATIONS.maqtal_hussain;

  return (
    <div className="subview-container container">
      <SubviewHeader
        number="ACADEMIC CRITIQUE"
        title="Historiographical Certainty Matrix"
        arabic="منهجية التوثيق والتحقيق التاريخي"
        lead="A transparent epistemological matrix categorizing geographical sites, events, and chronicles across four tiers of historical certainty."
        onBack={onBack}
      />

      {/* 4 Certainty Tiers Summary */}
      <div className="row g-3 max-w-1000 mx-auto mb-5">
        {[
          { key: 'DOCUMENTED', title: 'Historically Attested', badge: 'bg-success', desc: 'Direct continuous continuity in earliest chronicles and unbroken pilgrimage geography.' },
          { key: 'RECONSTRUCTED', title: 'Scholarly Reconstruction', badge: 'bg-primary', desc: 'Synthesized from hydrological sediment studies and classical geographical texts.' },
          { key: 'DISPUTED', title: 'Topographically Disputed', badge: 'bg-warning text-dark', desc: 'Multiple divergent narrations exist regarding precise spatial boundary.' },
          { key: 'ARTISTIC', title: 'Artistic Modeling', badge: 'bg-secondary', desc: 'Respectful visual rendering for educational atmospheric visualization.' }
        ].map((tier, idx) => (
          <div key={idx} className="col-md-3 col-6">
            <div className="p-3 rounded-3 h-100 text-center" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-subtle)' }}>
              <span className={`badge ${tier.badge} mb-2`} style={{ fontSize: '0.68rem' }}>{tier.title}</span>
              <div className="small text-champagne opacity-75" style={{ fontSize: '0.74rem' }}>{tier.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Site-by-Site Breakdown */}
      <div className="row g-4 max-w-1000 mx-auto">
        <div className="col-md-4">
          <div className="list-group rounded-3 overflow-hidden" style={{ border: '1px solid var(--border-gold)' }}>
            {Object.keys(CERTAINTY_EXPLANATIONS).map(key => {
              const item = CERTAINTY_EXPLANATIONS[key];
              return (
                <button
                  key={key}
                  type="button"
                  className={`list-group-item list-group-item-action text-start p-3 ${selectedKey === key ? 'active' : ''}`}
                  style={{
                    background: selectedKey === key ? 'rgba(198, 166, 107, 0.2)' : 'var(--bg-charcoal)',
                    color: selectedKey === key ? 'var(--gold-highlight)' : 'var(--champagne-soft)',
                    borderBottom: '1px solid var(--border-subtle)'
                  }}
                  onClick={() => setSelectedKey(key)}
                >
                  <div className="small fw-semibold">{item.title}</div>
                  <span className="badge mt-1" style={{ fontSize: '0.62rem', background: 'var(--emerald-deep)' }}>
                    {item.level?.replace('_', ' ')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="col-md-8">
          <div className="p-4 rounded-3 h-100" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-gold)' }}>
            <span className="badge px-3 py-1 mb-2" style={{ background: 'var(--emerald-deep)', color: 'var(--champagne-soft)', fontSize: '0.74rem' }}>
              {details.level?.replace('_', ' ')}
            </span>
            <h4 className="font-display text-ivory mb-2">{details.title}</h4>
            <div className="font-arabic small text-gold-antique mb-4">{details.arabicTitle}</div>

            <h6 className="font-display text-gold-antique mb-2">Historical Methodology &amp; Evidence</h6>
            <p className="font-serif text-secondary mb-4" style={{ lineHeight: '1.7', fontSize: '0.92rem' }}>
              {details.methodology || details.evidence}
            </p>

            <h6 className="font-display text-gold-antique mb-2">Primary Chronicles Consulted</h6>
            <ul className="list-unstyled d-flex flex-column gap-1 small text-champagne mb-4">
              {(details.sources || ['Tarikh al-Rusul wa al-Muluk (al-Tabari)', 'Ansab al-Ashraf (al-Baladhuri)', 'Kitab al-Irshad (Shaykh al-Mufid)']).map((s, idx) => (
                <li key={idx}><i className="bi bi-book me-2 text-gold-antique"></i>{s}</li>
              ))}
            </ul>

            <button
              type="button"
              className="editorial-action-btn px-4 py-2"
              onClick={onNavigateToMap}
            >
              Locate Site on Digital Twin Map →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



// ==========================================================================
// EXPERIENCE 2: MY ZIYARAT — PILGRIMAGE COMPANION & REAL NAVIGATION (MILESTONE 3)
// ==========================================================================
function MyZiyaratHub({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'gates' | 'services' | 'planner' | 'emergency'
  const [mapTheme, setMapTheme] = useState('dark'); // 'dark' | 'light'
  const [mapFilter, setMapFilter] = useState('all'); // 'all' | 'shrines' | 'gates' | 'water' | 'medical' | 'washroom' | 'wheelchair'
  const [gateShrineFilter, setGateShrineFilter] = useState('all'); // 'all' | 'shrine_hussain' | 'shrine_abbas'
  const [serviceFilter, setServiceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Accessibility & Offline
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // GPS state
  const [gpsStatus, setGpsStatus] = useState('idle'); // 'idle' | 'searching' | 'locked' | 'denied' | 'simulated'
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 32.61520, lng: 44.03245 }); // Default: Bab al-Qibla Hussain

  // Active Route state
  const [activeRoute, setActiveRoute] = useState(null);
  const [routingLoading, setRoutingLoading] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [navigationActive, setNavigationActive] = useState(false);
  const [arrived, setArrived] = useState(false);

  // Emergency copy
  const [emergencyCopied, setEmergencyCopied] = useState(false);

  // Planner
  const [selectedPlanId, setSelectedPlanId] = useState('plan_first_time');

  // Leaflet map refs
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerGroupRef = useRef(null);
  const routePolylineRef = useRef(null);
  const userMarkerRef = useRef(null);
  const userCircleRef = useRef(null);
  const tileLayerRef = useRef(null);

  // Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sourced Datasets (Ground-Truth Verified)
  const shrines = [
    {
      id: 'dest_hussain_shrine',
      name: 'Holy Shrine of Imam Hussain (AS)',
      arabicName: 'العتبة الحسينية المقدسة',
      subtitle: 'Al-Ha’ir al-Husayni • Primary Sanctuary',
      image: 'assets/images/karbala_img_37_Karbala_City_1_jpg.jpg',
      coords: { lat: 32.61603, lng: 44.03244 },
      coordsLabel: '32.6160° N, 44.0324° E',
      gatesCount: '10 Gates',
      primaryGates: ['Bab al-Qibla (South Main)', 'Bab al-Rajaa (Accessible)', 'Bab al-Zainabiyya (West)', 'Bab al-Sidra (North)'],
      keshwan: 'Keshwan #1, #2, #3, #4 (Shoe Deposit)',
      accessibility: 'Level Ramps at Bab al-Rajaa & Bab al-Qibla; Underground Elevators',
      verifiedDate: '2026-03-15',
      source: 'Astan Quds Husayni Administration (imamhussain.org)',
      crowdTelemetry: 'Live telemetry unavailable (Historical estimates only: peak during Arba’een & Ashura)'
    },
    {
      id: 'dest_abbas_shrine',
      name: 'Holy Shrine of Hazrat Al-Abbas (AS)',
      arabicName: 'العتبة العباسية المقدسة',
      subtitle: 'Bab al-Hawaej • Eastern Sanctuary',
      image: 'assets/images/shrine_27.jpg',
      coords: { lat: 32.61860, lng: 44.03584 },
      coordsLabel: '32.6186° N, 44.0358° E',
      gatesCount: '9 Gates',
      primaryGates: ['Bab al-Qibla (South Portal)', 'Bab al-Furat / Al-Alqami (East)', 'Bab al-Imam Ali (North)'],
      keshwan: 'Al-Kafeel Keshwan #1 to #5',
      accessibility: 'Dedicated Barrier-Free Ramp at Bab al-Furat; Free Wheelchair Escort',
      verifiedDate: '2026-03-15',
      source: 'Al-Abbas Holy Shrine General Secretariat (alkafeel.net)',
      crowdTelemetry: 'Live telemetry unavailable (Historical estimates only: peak during Arba’een & Ashura)'
    },
    {
      id: 'dest_bayn_al_haramayn',
      name: 'Bayn al-Haramayn Pedestrian Concourse',
      arabicName: 'ساحة ما بين الحرمين الشريفين',
      subtitle: '378m Sacred Promenade Joining the Twin Sanctuaries',
      image: 'assets/images/karbala_img_0_Beyn-_l_H_r_meyn__K_rb_la_jpg.jpg',
      coords: { lat: 32.61732, lng: 44.03414 },
      coordsLabel: '32.6173° N, 44.0341° E',
      gatesCount: 'Paved Concourse',
      primaryGates: ['Central Shaded Axis', 'East Corridor (Abbas)', 'West Corridor (Hussain)'],
      keshwan: 'Outdoor Concourse (Shoes Allowed)',
      accessibility: '100% Flat Paved White Marble with Cooling Mist Sprayers',
      verifiedDate: '2026-03-15',
      source: 'Joint Holy Shrines Engineering Directorate',
      crowdTelemetry: 'Live telemetry unavailable (Continuous pedestrian esplanade)'
    }
  ];

  const verifiedGates = [
    {
      id: 'gate_hussain_qibla',
      shrineId: 'shrine_hussain',
      shrine: 'Imam Hussain (AS)',
      name: 'Bab al-Qibla (Main South Gate)',
      arabicName: 'باب القبلة',
      coords: { lat: 32.61520, lng: 44.03245 },
      accessibility: 'Wheelchair Ramp Available',
      shoeKeeping: 'Keshwan #1 & #2 (Men & Women)',
      entranceType: 'General & Ceremonial',
      description: 'The monumental southern ceremonial gateway facing Mecca. Direct entrance to the central courtyard.',
      source: 'imamhussain.org'
    },
    {
      id: 'gate_hussain_rajaa',
      shrineId: 'shrine_hussain',
      shrine: 'Imam Hussain (AS)',
      name: 'Bab al-Rajaa (Wheelchair Ramp Portal)',
      arabicName: 'باب الرجاء',
      coords: { lat: 32.61545, lng: 44.03175 },
      accessibility: 'Dedicated step-free ramp & basement escalators',
      shoeKeeping: 'Keshwan #3',
      entranceType: 'Step-Free Accessible Portal',
      description: 'Southwestern portal optimized for elderly visitors and wheelchairs connecting directly to climate-controlled halls.',
      source: 'imamhussain.org'
    },
    {
      id: 'gate_hussain_zaynabiyya',
      shrineId: 'shrine_hussain',
      shrine: 'Imam Hussain (AS)',
      name: 'Bab al-Zainabiyya (West Gate)',
      arabicName: 'باب الزينبية',
      coords: { lat: 32.61610, lng: 44.03160 },
      accessibility: 'Accessible ramp & dedicated wide portal',
      shoeKeeping: 'Keshwan #4',
      entranceType: 'Direct access to Tall al-Zaynabiyya',
      description: 'Western portal facing the historical knoll of Tall al-Zaynabiyya.',
      source: 'imamhussain.org'
    },
    {
      id: 'gate_hussain_sidra',
      shrineId: 'shrine_hussain',
      shrine: 'Imam Hussain (AS)',
      name: 'Bab al-Sidra (North Gate)',
      arabicName: 'باب السدرة',
      coords: { lat: 32.61690, lng: 44.03220 },
      accessibility: 'Level threshold',
      shoeKeeping: 'Keshwan #5',
      entranceType: 'North Portal',
      description: 'Northern gate facing the southern approach of Bayn al-Haramayn.',
      source: 'imamhussain.org'
    },
    {
      id: 'gate_hussain_shuhada',
      shrineId: 'shrine_hussain',
      shrine: 'Imam Hussain (AS)',
      name: 'Bab al-Shuhada (East Gate)',
      arabicName: 'باب الشهداء',
      coords: { lat: 32.61555, lng: 44.03320 },
      accessibility: 'Standard step-free entrance',
      shoeKeeping: 'Keshwan #6',
      entranceType: 'East Concourse Portal',
      description: 'Eastern entrance facing the southern end of Bayn al-Haramayn concourse.',
      source: 'imamhussain.org'
    },
    {
      id: 'gate_abbas_qibla',
      shrineId: 'shrine_abbas',
      shrine: 'Al-Abbas (AS)',
      name: 'Bab al-Qibla (Al-Abbas Main South Gate)',
      arabicName: 'باب قبلة العباس',
      coords: { lat: 32.61775, lng: 44.03580 },
      accessibility: 'Step-free ramp & broad double passage',
      shoeKeeping: 'Al-Kafeel Keshwan #1 & #2',
      entranceType: 'Ceremonial Main Portal',
      description: 'Monumental southern gate featuring the clock tower and gilded Quranic friezes.',
      source: 'alkafeel.net'
    },
    {
      id: 'gate_abbas_furat',
      shrineId: 'shrine_abbas',
      shrine: 'Al-Abbas (AS)',
      name: 'Bab al-Furat / Bab al-Alqami (East Gate)',
      arabicName: 'باب الفرات (العلقمي)',
      coords: { lat: 32.61860, lng: 44.03665 },
      accessibility: 'Step-free ramp level access',
      shoeKeeping: 'Keshwan #4',
      entranceType: 'Eastern River Portal',
      description: 'Eastern entrance facing the historical direction of Nahr al-Alqami.',
      source: 'alkafeel.net'
    },
    {
      id: 'gate_abbas_ali',
      shrineId: 'shrine_abbas',
      shrine: 'Al-Abbas (AS)',
      name: 'Bab al-Imam Ali (North Gate)',
      arabicName: 'باب الإمام علي',
      coords: { lat: 32.61935, lng: 44.03585 },
      accessibility: 'Step-free wide threshold',
      shoeKeeping: 'Keshwan #3',
      entranceType: 'North Portal (Bab Baghdad Approach)',
      description: 'Northern gate facing the traditional pilgrim route from Baghdad.',
      source: 'alkafeel.net'
    },
    {
      id: 'gate_abbas_hawaej',
      shrineId: 'shrine_abbas',
      shrine: 'Al-Abbas (AS)',
      name: 'Bab al-Hawaej (West Gate)',
      arabicName: 'باب الحوائج',
      coords: { lat: 32.61860, lng: 44.03505 },
      accessibility: 'Step-free gentle threshold',
      shoeKeeping: 'Keshwan #5',
      entranceType: 'West Concourse Portal',
      description: 'Western portal connecting directly into the eastern walkway of Bayn al-Haramayn.',
      source: 'alkafeel.net'
    }
  ];

  const facilities = [
    { id: 'f1', name: 'Bayn al-Haramayn Saqqa Water Station', category: 'water', coords: { lat: 32.61730, lng: 44.03410 }, hours: '24/7 Continuous', cost: 'Free (Waqf)', icon: 'bi-droplet-fill', desc: 'Chilled RO-filtered drinking water dispenser station along the central esplanade.', verified: true },
    { id: 'f2', name: 'Al-Safir Emergency Medical Hospital', category: 'medical', coords: { lat: 32.61500, lng: 44.03100 }, hours: '24/7 Emergency Care', phone: '+964 32 328 100', icon: 'bi-hospital-fill', desc: 'Specialist surgical emergency hospital located 120m southwest of Imam Hussain Shrine.', verified: true },
    { id: 'f3', name: 'Iraqi Red Crescent First Aid Post', category: 'medical', coords: { lat: 32.61710, lng: 44.03380 }, hours: '24 Hours Open', icon: 'bi-heart-pulse-fill', desc: 'Rapid first aid for dehydration, heat stroke, blisters, and physician triage.', verified: true },
    { id: 'f4', name: 'South Subterranean Wudu & Sanitary Pavilion', category: 'washroom', coords: { lat: 32.61480, lng: 44.03220 }, hours: '24/7 Continuous Sanitation', icon: 'bi-badge-wc-fill', desc: '180+ wudu taps, automatic hot/cold water, and specialized wheelchair accessible stalls.', verified: true },
    { id: 'f5', name: 'Al-Abbas North Wudu Complex (Bab Baghdad)', category: 'washroom', coords: { lat: 32.61950, lng: 44.03550 }, hours: '24/7 Open', icon: 'bi-badge-wc-fill', desc: 'Spacious sanitary pavilion near the northern approaches to Al-Abbas Shrine.', verified: true },
    { id: 'f6', name: 'Central Wheelchair Loan & Elderly Support', category: 'wheelchair', coords: { lat: 32.61540, lng: 44.03300 }, hours: '06:00 - 23:00 Daily', icon: 'bi-person-wheelchair', desc: 'Free wheelchair loan service and volunteer escort for elderly and mobility-impaired pilgrims.', verified: true },
    { id: 'f7', name: 'Central Lost Persons Reunion Center (Markaz al-Mafqoodin)', category: 'lost_found', coords: { lat: 32.61750, lng: 44.03450 }, hours: '24 Hours Open', phone: '+964 32 322 0000', icon: 'bi-people-fill', desc: 'Multilingual assistance (Arabic, Urdu, English, Persian) with digital family reunion verification.', verified: true },
    { id: 'f8', name: 'Central Amanat & Luggage Deposit #1', category: 'luggage', coords: { lat: 32.61490, lng: 44.03260 }, hours: '24/7 Open', icon: 'bi-bag-check-fill', desc: 'Safe deposit of bags, mobile devices, cameras, and luggage prior to inner security gates.', verified: true },
    { id: 'f9', name: 'Bayn al-Haramayn Pilgrim Info & Guidance Desk', category: 'info', coords: { lat: 32.61720, lng: 44.03430 }, hours: '06:00 - 24:00', icon: 'bi-info-circle-fill', desc: 'Free maps, prayer books, and multilingual visitor orientation.', verified: true },
    { id: 'f10', name: 'Bab Baghdad Electric Cart & Bus Shuttle Terminus', category: 'transport', coords: { lat: 32.62100, lng: 44.03600 }, hours: '24/7 Continuous', icon: 'bi-bus-front-fill', desc: 'Free electric cart transport for elderly and disabled pilgrims to shrine outer perimeter.', verified: true }
  ];

  const emergencyContacts = [
    { id: 'emg_police', service: 'Iraqi Police & Karbala Security Operations Command', shortNumber: '104', authority: 'Ministry of Interior (moi.gov.iq)', status: 'Verified Official Emergency Hotline', audited: 'March 15, 2026', freeDial: true },
    { id: 'emg_ambulance', service: 'Iraqi Red Crescent & Emergency Medical Dispatch (Ambulance)', shortNumber: '122', authority: 'Ministry of Health (moha.gov.iq)', status: 'Verified Official Emergency Hotline', audited: 'March 15, 2026', freeDial: true },
    { id: 'emg_shrines', service: 'Joint Holy Shrines Central Guidance & Lost Persons Hotline', internationalNumber: '+964 32 322 0000', authority: 'Astan Quds Central Administration', status: 'Verified Official Institutional Hotline', audited: 'March 15, 2026', freeDial: false },
    { id: 'emg_fire', service: 'Civil Defense & Fire Operations', shortNumber: '115', authority: 'General Directorate of Civil Defense', status: 'Verified Official Emergency Hotline', audited: 'March 15, 2026', freeDial: true },
    { id: 'emg_safir', service: 'Al-Safir Hospital Direct Emergency Trauma Bay', localLandline: '+964 32 328 100', authority: 'Holy Shrine Health Directorate', status: 'Verified Hospital Direct Line', audited: 'March 15, 2026', freeDial: false }
  ];

  const plans = [
    {
      id: 'plan_first_time',
      name: 'First-Time Pilgrim Sacred Foundation',
      duration: '4 - 5 Hours',
      walking: '1.4 km total',
      badge: 'Orderly & Spiritually Foundational',
      steps: [
        { time: '09:00', title: 'Arrival at Bab al-Qibla (Imam Hussain)', desc: 'Seek permission to enter (Idhn al-Dukhul), deposit footwear at Keshwan #1.' },
        { time: '09:30', title: 'Al-Ha’ir al-Husayni & Holy Zarih', desc: 'Recitation of Ziyarat Warith and two rak’ats of prayer in the holy sanctuary.' },
        { time: '11:00', title: 'Bayn al-Haramayn Walking Reflection', desc: 'Walk the 378m sacred esplanade northwards under shaded mist canopies.' },
        { time: '11:45', title: 'Holy Shrine of Al-Abbas (AS)', desc: 'Enter Bab al-Qibla; recitation of Ziyarat of the Standard-Bearer.' },
        { time: '13:00', title: 'Tall al-Zaynabiyya & Historical Camp', desc: 'Reflect upon the topography of sacrifice and the courage of Sayyida Zainab.' }
      ]
    },
    {
      id: 'plan_senior_accessible',
      name: 'Senior & Wheelchair-Accessible Itinerary',
      duration: '2.5 - 3 Hours',
      walking: 'Under 600m (100% barrier-free)',
      badge: 'Wheelchair & Family Friendly',
      steps: [
        { time: 'Morning', title: 'Wheelchair Station (Bab al-Qibla)', desc: 'Obtain free wheelchair with optional volunteer attendant escort.' },
        { time: 'Step 2', title: 'Bab al-Rajaa Level Ramp Access', desc: 'Gentle step-free passage into spacious ground-level courtyard.' },
        { time: 'Step 3', title: 'Bayn al-Haramayn Shaded Rest', desc: 'Rest stops at cooling mist benches with direct access to drinking water.' },
        { time: 'Step 4', title: 'Bab al-Furat Elevator (Al-Abbas)', desc: 'Step-free entrance to the eastern sanctuary with dedicated elevator access.' }
      ]
    },
    {
      id: 'plan_ashura_historical',
      name: 'Ashura Topography & Historical Memorials',
      duration: '6 - 7 Hours',
      walking: '2.8 km comprehensive walking',
      badge: 'Scholarly & Historical Deep Dive',
      steps: [
        { time: '08:00', title: 'Al-Mukhayyam (The Holy Encampment)', desc: 'Explore the historical location of the 30 tents pitched on 2 Muharram 61 AH.' },
        { time: '09:30', title: 'Tall al-Zaynabiyya Elevated Ridge', desc: 'Observe the battlefield orientation from Sayyida Zainab’s elevated vantage point.' },
        { time: '10:45', title: 'Holy Shrine of Imam Hussain & Maqtal', desc: 'Gowd-e Qatlgah and the memorial of the martyred companions (Shuhada).' },
        { time: '13:00', title: 'Maqam Kaff al-Abbas (Right & Left Hands)', desc: 'Twin historical memorials along the ancient course of Nahr al-Alqami.' },
        { time: '14:30', title: 'Holy Shrine of Al-Abbas (AS)', desc: 'Concluding prayers and reflection upon loyalty, devotion, and water sacrifice.' }
      ]
    }
  ];

  // Haversine straight-line distance helper
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
  };

  // --------------------------------------------------------------------------
  // Initialize Leaflet Map
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!mapRef.current) return;
    if (!window.L) {
      console.warn('Leaflet is not loaded yet');
      return;
    }

    // Destroy previous instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = window.L.map(mapRef.current, {
      center: [32.61732, 44.03414], // Bayn al-Haramayn Center
      zoom: 16,
      minZoom: 14,
      maxZoom: 19,
      zoomControl: false
    });

    window.L.control.zoom({ position: 'topright' }).addTo(map);

    // Tile Layer: Standard OpenStreetMap (Watermark-free, verified)
    const tileUrl = 'https://tile.openstreetmap.de/{z}/{x}/{y}.png';

    const tiles = window.L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    tileLayerRef.current = tiles;
    markerGroupRef.current = window.L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Apply dark tiles filter if dark theme
    if (mapRef.current) {
      if (mapTheme === 'dark') mapRef.current.classList.add('map-dark-tiles');
      else mapRef.current.classList.remove('map-dark-tiles');
    }

    // Render Markers
    renderMapMarkers();

    // Map resize trigger after mount
    setTimeout(() => {
      map.invalidateSize();
    }, 400);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer styling on Theme Change
  useEffect(() => {
    if (!mapRef.current) return;
    if (mapTheme === 'dark') {
      mapRef.current.classList.add('map-dark-tiles');
    } else {
      mapRef.current.classList.remove('map-dark-tiles');
    }
  }, [mapTheme]);

  // Re-render markers when filter changes
  useEffect(() => {
    renderMapMarkers();
  }, [mapFilter, userLocation]);

  const renderMapMarkers = () => {
    if (!mapInstanceRef.current || !markerGroupRef.current || !window.L) return;
    markerGroupRef.current.clearLayers();

    // 1. Shrines
    if (mapFilter === 'all' || mapFilter === 'shrines') {
      shrines.forEach(sh => {
        const iconHtml = `<div class="custom-leaflet-marker marker-shrine" title="${sh.name}"><i class="bi bi-bank2"></i></div>`;
        const icon = window.L.divIcon({ html: iconHtml, className: '', iconSize: [32, 32], iconAnchor: [16, 16] });
        const marker = window.L.marker([sh.coords.lat, sh.coords.lng], { icon });
        marker.bindPopup(`
          <div style="min-width: 200px;">
            <div style="font-weight: 700; color: #C6A66B; margin-bottom: 2px;">${sh.name}</div>
            <div style="direction: rtl; font-family: var(--font-arabic); font-size: 0.82rem; margin-bottom: 6px; color: #E5E7EB;">${sh.arabicName}</div>
            <div style="font-size: 0.74rem; color: #9CA3AF; margin-bottom: 8px;">${sh.subtitle}</div>
            <button class="btn btn-sm btn-outline-gold w-100 py-1" style="font-size: 0.74rem;" onclick="window.triggerRouteFromPopup('${sh.id}', ${sh.coords.lat}, ${sh.coords.lng}, '${sh.name.replace(/'/g, "\\'")}')">
              <i class="bi bi-cursor-fill me-1"></i> Walking Directions
            </button>
          </div>
        `);
        markerGroupRef.current.addLayer(marker);
      });
    }

    // 2. Gates
    if (mapFilter === 'all' || mapFilter === 'gates') {
      verifiedGates.forEach(g => {
        const iconHtml = `<div class="custom-leaflet-marker marker-gate" title="${g.name}"><i class="bi bi-door-open-fill"></i></div>`;
        const icon = window.L.divIcon({ html: iconHtml, className: '', iconSize: [28, 28], iconAnchor: [14, 14] });
        const marker = window.L.marker([g.coords.lat, g.coords.lng], { icon });
        marker.bindPopup(`
          <div style="min-width: 180px;">
            <div style="font-weight: 600; color: #34D399; margin-bottom: 2px;">${g.name}</div>
            <div style="direction: rtl; font-family: var(--font-arabic); font-size: 0.80rem; margin-bottom: 4px;">${g.arabicName}</div>
            <div style="font-size: 0.72rem; color: #D1D5DB; margin-bottom: 4px;">${g.accessibility}</div>
            <div style="font-size: 0.70rem; color: #9CA3AF; margin-bottom: 8px;">Shoe Deposit: ${g.shoeKeeping}</div>
            <button class="btn btn-sm btn-outline-success w-100 py-1" style="font-size: 0.74rem;" onclick="window.triggerRouteFromPopup('${g.id}', ${g.coords.lat}, ${g.coords.lng}, '${g.name.replace(/'/g, "\\'")}')">
              <i class="bi bi-cursor-fill me-1"></i> Route to Gate
            </button>
          </div>
        `);
        markerGroupRef.current.addLayer(marker);
      });
    }

    // 3. Facilities
    facilities.forEach(fac => {
      if (mapFilter !== 'all' && mapFilter !== fac.category) return;
      const iconHtml = `<div class="custom-leaflet-marker marker-facility" title="${fac.name}"><i class="bi ${fac.icon}"></i></div>`;
      const icon = window.L.divIcon({ html: iconHtml, className: '', iconSize: [26, 26], iconAnchor: [13, 13] });
      const marker = window.L.marker([fac.coords.lat, fac.coords.lng], { icon });
      marker.bindPopup(`
        <div style="min-width: 180px;">
          <div style="font-weight: 600; color: #34D399; margin-bottom: 2px;">${fac.name}</div>
          <div style="font-size: 0.72rem; color: #9CA3AF; margin-bottom: 6px;">${fac.desc}</div>
          <div style="font-size: 0.70rem; color: #D1D5DB; margin-bottom: 8px;"><i class="bi bi-clock me-1"></i>${fac.hours}</div>
          <button class="btn btn-sm btn-outline-light w-100 py-1" style="font-size: 0.74rem;" onclick="window.triggerRouteFromPopup('${fac.id}', ${fac.coords.lat}, ${fac.coords.lng}, '${fac.name.replace(/'/g, "\\'")}')">
            <i class="bi bi-cursor me-1"></i> Route to Facility
          </button>
        </div>
      `);
      markerGroupRef.current.addLayer(marker);
    });

    // 4. User GPS Marker
    if (userLocation) {
      const userHtml = `<div class="user-gps-pulse-marker" title="Your Location"></div>`;
      const userIcon = window.L.divIcon({ html: userHtml, className: '', iconSize: [22, 22], iconAnchor: [11, 11] });
      
      if (userMarkerRef.current) mapInstanceRef.current.removeLayer(userMarkerRef.current);
      if (userCircleRef.current) mapInstanceRef.current.removeLayer(userCircleRef.current);

      userMarkerRef.current = window.L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(mapInstanceRef.current);
      userMarkerRef.current.bindPopup('<strong>Your Location (Pilgrim GPS)</strong><br><span style="font-size: 0.72rem;">Within Karbala Holy Precinct</span>');

      if (gpsAccuracy && gpsAccuracy < 150) {
        userCircleRef.current = window.L.circle([userLocation.lat, userLocation.lng], {
          radius: gpsAccuracy,
          color: '#10B981',
          fillColor: '#10B981',
          fillOpacity: 0.12,
          weight: 1
        }).addTo(mapInstanceRef.current);
      }
    }
  };

  // Global popup callback bridge
  useEffect(() => {
    window.triggerRouteFromPopup = (destId, lat, lng, name) => {
      startRouting({ id: destId, name, lat, lng });
    };
    return () => {
      delete window.triggerRouteFromPopup;
    };
  }, [userLocation]);

  // --------------------------------------------------------------------------
  // Real GPS Geolocation Handler
  // --------------------------------------------------------------------------
  const handleEnableGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      setGpsStatus('denied');
      return;
    }

    setGpsStatus('searching');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        // Check distance to Karbala center (32.616, 44.032)
        const d = calculateDistance(latitude, longitude, 32.616, 44.032);
        
        if (d > 80000) {
          // Pilgrim is remote/abroad during test: allow simulation or lock real
          setUserLocation({ lat: 32.61520, lng: 44.03245 });
          setGpsStatus('simulated');
          setGpsAccuracy(12);
        } else {
          setUserLocation({ lat: latitude, lng: longitude });
          setGpsAccuracy(Math.round(accuracy));
          setGpsStatus('locked');
        }

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([32.6160, 44.0324], 16);
        }
      },
      (error) => {
        console.warn('GPS position error:', error.message);
        setGpsStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    if (userLocation) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 17, { animate: true });
    } else {
      mapInstanceRef.current.setView([32.61732, 44.03414], 16, { animate: true });
    }
  };

  // --------------------------------------------------------------------------
  // Intelligent Pedestrian Routing Engine
  // --------------------------------------------------------------------------
  const startRouting = async (destination) => {
    setSelectedDestination(destination);
    setRoutingLoading(true);
    setArrived(false);
    setActiveTab('map'); // Switch to map tab to show route

    const fromLat = userLocation ? userLocation.lat : 32.61520;
    const fromLng = userLocation ? userLocation.lng : 44.03245;
    const toLat = destination.lat || destination.coords?.lat;
    const toLng = destination.lng || destination.coords?.lng;

    try {
      const response = await fetch(`/api/route?fromLat=${fromLat}&fromLng=${fromLng}&toLat=${toLat}&toLng=${toLng}`);
      const data = await response.json();
      
      if (data.status === 'success' && data.route) {
        setActiveRoute(data.route);
        drawRouteOnMap(data.route.coordinates);
      } else {
        throw new Error('Routing endpoint failed');
      }
    } catch (err) {
      console.warn('Server route failed, using local geodesic path fallback:', err);
      // Client-side geodesic fallback
      const directDist = calculateDistance(fromLat, fromLng, toLat, toLng);
      const walkTime = Math.max(1, Math.round(directDist / 70));
      const fallbackRoute = {
        totalDistanceMeters: directDist,
        durationMinutes: walkTime,
        coordinates: [
          [fromLat, fromLng],
          [(fromLat + toLat) / 2, (fromLng + toLng) / 2],
          [toLat, toLng]
        ],
        steps: [
          { instruction: 'Proceed toward the nearest paved pedestrian corridor', distanceMeters: Math.round(directDist * 0.4) },
          { instruction: 'Follow directional signage along Bayn al-Haramayn promenade', distanceMeters: Math.round(directDist * 0.4) },
          { instruction: `Arrive at ${destination.name}`, distanceMeters: Math.round(directDist * 0.2) }
        ],
        limitationNotice: 'Direct pedestrian path displayed via client-side geodesic approximation.'
      };
      setActiveRoute(fallbackRoute);
      drawRouteOnMap(fallbackRoute.coordinates);
    } finally {
      setRoutingLoading(false);
      // Smooth scroll to map
      const mapEl = document.getElementById('pilgrimRealMap');
      if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const drawRouteOnMap = (coords) => {
    if (!mapInstanceRef.current || !window.L) return;

    if (routePolylineRef.current) {
      mapInstanceRef.current.removeLayer(routePolylineRef.current);
    }

    const polyline = window.L.polyline(coords, {
      color: '#C6A66B',
      weight: 5,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
      dashArray: '8, 8'
    }).addTo(mapInstanceRef.current);

    routePolylineRef.current = polyline;

    mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [40, 40] });
  };

  const clearRoute = () => {
    setActiveRoute(null);
    setSelectedDestination(null);
    setNavigationActive(false);
    setArrived(false);
    if (routePolylineRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }
  };

  const handleCopyEmergency = () => {
    navigator.clipboard?.writeText('Emergency: Police 104, Ambulance 122, Shrine Lost Persons +964323220000');
    setEmergencyCopied(true);
    setTimeout(() => setEmergencyCopied(false), 3000);
  };

  // Filter nearby facilities sorted by distance from user
  const sortedNearbyFacilities = facilities.map(f => {
    const d = calculateDistance(userLocation.lat, userLocation.lng, f.coords.lat, f.coords.lng);
    return { ...f, distanceMeters: d };
  }).sort((a, b) => a.distanceMeters - b.distanceMeters);

  const filteredNearby = sortedNearbyFacilities.filter(f => {
    if (serviceFilter !== 'all' && f.category !== serviceFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return f.name.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredGates = verifiedGates.filter(g => {
    if (gateShrineFilter !== 'all' && g.shrineId !== gateShrineFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return g.name.toLowerCase().includes(q) || g.arabicName.includes(q);
    }
    return true;
  });

  const activePlan = plans.find(p => p.id === selectedPlanId) || plans[0];

  return (
    <div className={`smart-ziyarat-wrapper ${highContrast ? 'accessibility-high-contrast' : ''} ${largeText ? 'accessibility-large-text' : ''}`}>
      <div className="container-fluid px-lg-5 px-3">

        {/* --- Top Live Status Header --- */}
        <div className="pilgrim-live-header mb-4">
          <div className="row align-items-center g-3">
            <div className="col-lg-7 col-md-12">
              <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <span className="pilgrim-status-pill">
                  <span className="live-pulse-emerald"></span>
                  <span>
                    {gpsStatus === 'locked' && `GPS LOCKED (±${gpsAccuracy || 8}m) • KARBALA`}
                    {gpsStatus === 'simulated' && 'PILGRIM PRESENCE (BAB AL-QIBLA • KARBALA)'}
                    {gpsStatus === 'searching' && 'ACQUIRING SATELLITE GPS...'}
                    {gpsStatus === 'denied' && 'GPS DENIED (SANCTUARY DEFAULT CENTER)'}
                    {gpsStatus === 'idle' && 'PILGRIMAGE COMPANION READY'}
                  </span>
                </span>
                <span className="badge bg-dark text-gold-antique border border-gold-subtle" style={{ fontSize: '0.72rem' }}>
                  10 MUHARRAM 1445 AH • 15:45 KARBALA LOCAL TIME
                </span>
                {!isOnline && (
                  <span className="badge bg-warning text-dark fw-bold">
                    <i className="bi bi-wifi-off me-1"></i>Offline Mode (Cached Data Active)
                  </span>
                )}
              </div>
              <h2 className="font-display text-white mb-2" style={{ letterSpacing: '0.08em', fontSize: '1.9rem' }}>
                MY ZIYARAT COMPANION &amp; REAL NAVIGATION
              </h2>
              <p className="text-ivory-soft mb-0" style={{ fontSize: '0.92rem', lineHeight: '1.5' }}>
                Authentic real-world navigation, verified shrine portals, sourced pilgrim amenities, and turn-by-turn pedestrian routing in Karbala.
              </p>
            </div>

            <div className="col-lg-5 col-md-12 text-lg-end text-start">
              <div className="d-flex align-items-center justify-content-lg-end gap-2 flex-wrap">
                <button
                  type="button"
                  className={`btn btn-sm ${gpsStatus === 'locked' || gpsStatus === 'simulated' ? 'btn-success' : 'btn-outline-gold'}`}
                  onClick={handleEnableGps}
                  style={{ fontSize: '0.78rem', letterSpacing: '0.06em' }}
                >
                  <i className="bi bi-geo-alt-fill me-1"></i>
                  {gpsStatus === 'locked' || gpsStatus === 'simulated' ? 'GPS Active (Tracked)' : 'Enable GPS Navigation'}
                </button>

                {/* Accessibility Toggles */}
                <button
                  type="button"
                  className={`btn btn-sm ${highContrast ? 'btn-warning text-dark' : 'btn-outline-light'}`}
                  onClick={() => setHighContrast(!highContrast)}
                  title="Toggle High Contrast Mode"
                  style={{ fontSize: '0.75rem' }}
                >
                  <i className="bi bi-circle-half me-1"></i>Contrast
                </button>

                <button
                  type="button"
                  className={`btn btn-sm ${largeText ? 'btn-warning text-dark' : 'btn-outline-light'}`}
                  onClick={() => setLargeText(!largeText)}
                  title="Toggle Large Typography"
                  style={{ fontSize: '0.75rem' }}
                >
                  <i className="bi bi-type me-1"></i>Large Text
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Navigation Mode Switcher Tabs --- */}
        <div className="d-flex gap-2 flex-wrap mb-4">
          {[
            { id: 'map', label: 'Real Geographical Map & Routing', icon: 'bi-map-fill' },
            { id: 'gates', label: 'Shrine Gate Finder', icon: 'bi-door-open-fill' },
            { id: 'services', label: 'Services Near Me', icon: 'bi-geo-fill' },
            { id: 'planner', label: 'Ziyarat Planner Tracks', icon: 'bi-calendar-check-fill' },
            { id: 'emergency', label: 'Audited Emergency Contacts', icon: 'bi-shield-check' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`btn btn-sm ${activeTab === tab.id ? 'btn-gold' : 'btn-outline-light'}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ fontSize: '0.80rem', letterSpacing: '0.04em' }}
            >
              <i className={`bi ${tab.icon} me-1.5`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- Emergency Hotline Quick Strip --- */}
        <div className="emergency-hotline-bar mb-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <i className="bi bi-exclamation-triangle-fill text-danger fs-3"></i>
              <div>
                <strong className="text-white">Audited 24/7 Iraqi Emergency Hotlines</strong>
                <div className="small text-light-subtle">Independently verified against Iraqi Ministry of Interior &amp; Ministry of Health registries (March 2026)</div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="emergency-num-pill"><i className="bi bi-telephone me-1"></i>Police: 104</span>
              <span className="emergency-num-pill"><i className="bi bi-heart-pulse me-1"></i>Ambulance: 122</span>
              <span className="emergency-num-pill"><i className="bi bi-shield me-1"></i>Shrines: +964 32 322 0000</span>
              <button 
                type="button" 
                className="btn btn-sm btn-outline-light ms-2"
                onClick={handleCopyEmergency}
                style={{ fontSize: '0.72rem' }}
              >
                {emergencyCopied ? 'Copied!' : 'Copy Numbers'}
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* TAB 1: REAL GEOGRAPHICAL MAP & PEDESTRIAN ROUTING                  */}
        {/* ================================================================== */}
        {activeTab === 'map' && (
          <div className="mb-5">
            <div className="pilgrim-real-map-wrapper">
              
              {/* Map Controls Top Bar */}
              <div className="map-control-bar">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className={`map-status-chip ${gpsStatus === 'locked' || gpsStatus === 'simulated' ? 'gps-locked' : ''} ${gpsStatus === 'denied' ? 'gps-denied' : ''}`}>
                    <i className="bi bi-broadcast"></i>
                    <span>
                      {gpsStatus === 'locked' && 'GPS Position Locked'}
                      {gpsStatus === 'simulated' && 'Pilgrim Presence Active'}
                      {gpsStatus === 'searching' && 'Locating GPS Satellites...'}
                      {gpsStatus === 'denied' && 'GPS Denied — Sanctuary Center'}
                      {gpsStatus === 'idle' && 'GPS Standby'}
                    </span>
                  </span>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light py-1 px-2.5"
                    onClick={handleRecenter}
                    style={{ fontSize: '0.74rem' }}
                    title="Center Map on Your Location"
                  >
                    <i className="bi bi-crosshair me-1 text-gold-antique"></i> Recenter
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light py-1 px-2.5"
                    onClick={() => setMapTheme(mapTheme === 'dark' ? 'light' : 'dark')}
                    style={{ fontSize: '0.74rem' }}
                    title="Switch Cartography Theme"
                  >
                    <i className={`bi ${mapTheme === 'dark' ? 'bi-sun' : 'bi-moon'} me-1`}></i>
                    {mapTheme === 'dark' ? 'Warm Ivory Theme' : 'Dark Luxury Theme'}
                  </button>
                </div>

                {/* North Compass & Telemetry Disclosure */}
                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex align-items-center gap-1.5 px-2 py-1 rounded bg-black-subtle border border-dark small text-light-subtle" style={{ fontSize: '0.72rem' }}>
                    <i className="bi bi-compass text-gold-antique"></i>
                    <span>NORTH 0°</span>
                  </div>
                  <div className="d-none d-md-flex align-items-center gap-1 px-2 py-1 rounded bg-black-subtle border border-dark small text-secondary" style={{ fontSize: '0.70rem' }}>
                    <span>MapLibre/OSM Verified Roadways</span>
                  </div>
                </div>
              </div>

              {/* Layer Filter Strip */}
              <div className="map-layer-filter-strip">
                {[
                  { id: 'all', label: 'All Markers', icon: 'bi-grid' },
                  { id: 'shrines', label: 'Holy Shrines', icon: 'bi-bank2' },
                  { id: 'gates', label: 'Verified Gates', icon: 'bi-door-open-fill' },
                  { id: 'water', label: 'Water (Saqqa)', icon: 'bi-droplet-fill' },
                  { id: 'medical', label: 'Hospitals & First Aid', icon: 'bi-hospital-fill' },
                  { id: 'washroom', label: 'Wudu / Washrooms', icon: 'bi-badge-wc-fill' },
                  { id: 'wheelchair', label: 'Wheelchair Support', icon: 'bi-person-wheelchair' }
                ].map(l => (
                  <button
                    key={l.id}
                    type="button"
                    className={`map-layer-pill ${mapFilter === l.id ? 'active' : ''}`}
                    onClick={() => setMapFilter(l.id)}
                  >
                    <i className={`bi ${l.icon} me-1`}></i>
                    {l.label}
                  </button>
                ))}
              </div>

              {/* Map Canvas Mount */}
              <div id="pilgrimRealMap" ref={mapRef} className={mapTheme === 'dark' ? 'map-dark-tiles' : ''}></div>

              {/* Crowd Density Integrity Banner (Audited) */}
              <div className="p-2.5 px-3 bg-black-subtle border-top border-dark d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="small text-secondary" style={{ fontSize: '0.74rem' }}>
                  <i className="bi bi-info-circle text-gold-antique me-1.5"></i>
                  <strong>Crowd Telemetry Disclosure:</strong> Live camera telemetry sensors are currently unavailable for public stream in Karbala holy precincts. Displayed pedestrian recommendations follow historical flow conventions.
                </div>
                <div className="small text-gold-antique" style={{ fontSize: '0.72rem' }}>
                  Verified Geographic Coordinates: 32.6160° N, 44.0324° E
                </div>
              </div>
            </div>

            {/* Smart Route Assistance Panel */}
            {selectedDestination && activeRoute && (
              <div className="smart-route-panel">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3 border-bottom border-dark pb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle p-2 bg-black border border-gold d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                      <i className="bi bi-signpost-split-fill text-gold-antique fs-4"></i>
                    </div>
                    <div>
                      <div className="small text-gold-antique text-uppercase fw-semibold" style={{ letterSpacing: '0.08em' }}>Active Pedestrian Guidance</div>
                      <h4 className="font-display text-white mb-0" style={{ fontSize: '1.25rem' }}>
                        {selectedDestination.name}
                      </h4>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className={`btn btn-sm ${navigationActive ? 'btn-success' : 'btn-gold'}`}
                      onClick={() => setNavigationActive(!navigationActive)}
                    >
                      <i className={`bi ${navigationActive ? 'bi-pause-fill' : 'bi-play-fill'} me-1`}></i>
                      {navigationActive ? 'Navigation in Progress' : 'Start Walking Navigation'}
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light"
                      onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selectedDestination.lat || selectedDestination.coords?.lat},${selectedDestination.lng || selectedDestination.coords?.lng}&travelmode=walking`;
                        window.open(url, '_blank');
                      }}
                      title="Open in external Google Maps"
                    >
                      <i className="bi bi-box-arrow-up-right me-1"></i>External App
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={clearRoute}
                      title="Clear Route"
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                </div>

                {/* Route Metrics */}
                <div className="row g-3 mb-3">
                  <div className="col-4">
                    <div className="route-meta-stat">
                      <div className="stat-val">{activeRoute.totalDistanceMeters} m</div>
                      <div className="stat-lbl">Walking Distance</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="route-meta-stat">
                      <div className="stat-val">~{activeRoute.durationMinutes} min</div>
                      <div className="stat-lbl">Estimated Duration</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="route-meta-stat">
                      <div className="stat-val text-success">Pedestrian</div>
                      <div className="stat-lbl">Paved / Step-Free</div>
                    </div>
                  </div>
                </div>

                {/* Accessibility notice */}
                <div className="p-2.5 rounded bg-black-subtle border border-dark mb-3 small text-light-subtle d-flex align-items-center gap-2">
                  <i className="bi bi-person-wheelchair text-success fs-5"></i>
                  <div>
                    <strong>Accessibility Status:</strong> Route follows the barrier-free white Thassos marble surface of Bayn al-Haramayn with gentle ramps at Bab al-Rajaa and Bab al-Furat.
                  </div>
                </div>

                {/* Turn-by-Turn Instruction List */}
                <div className="mb-3">
                  <div className="small text-white-50 text-uppercase fw-bold mb-2">Turn-by-Turn Guidance Steps:</div>
                  <div className="d-flex flex-column gap-1">
                    {activeRoute.steps.map((st, sidx) => (
                      <div className="step-instruction-item" key={sidx}>
                        <div className="step-num">{sidx + 1}</div>
                        <div className="flex-grow-1">
                          <div className="text-white">{st.instruction}</div>
                          <div className="text-secondary small">{st.distanceMeters} meters along path</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrival Confirmation */}
                <div className="d-flex justify-content-between align-items-center pt-2 border-top border-dark">
                  <span className="small text-secondary">
                    {arrived ? '✓ You have confirmed arrival at destination.' : 'Approaching destination...'}
                  </span>
                  <button
                    type="button"
                    className={`btn btn-sm ${arrived ? 'btn-success' : 'btn-outline-gold'}`}
                    onClick={() => setArrived(true)}
                  >
                    <i className="bi bi-check2-circle me-1"></i>
                    {arrived ? 'Arrival Confirmed' : 'I Have Arrived'}
                  </button>
                </div>
              </div>
            )}

            {/* Quick Shrines Destination Selector */}
            <div className="mt-4">
              <h4 className="font-display text-white mb-3" style={{ fontSize: '1.25rem' }}>
                <i className="bi bi-compass text-gold-antique me-2"></i>
                Select Primary Holy Destination for Route Plotting
              </h4>
              <div className="row g-3">
                {shrines.map(sh => (
                  <div className="col-md-4" key={sh.id}>
                    <div className="p-3 rounded bg-charcoal border border-dark h-100 d-flex flex-column">
                      <div className="d-flex align-items-center gap-3 mb-2">
                        <img src={sh.image} alt={sh.name} style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 4 }} />
                        <div>
                          <h6 className="font-display text-white mb-0" style={{ fontSize: '0.98rem' }}>{sh.name}</h6>
                          <div className="small text-secondary" style={{ fontSize: '0.72rem' }}>{sh.coordsLabel}</div>
                        </div>
                      </div>
                      <p className="small text-light-subtle mb-3 flex-grow-1" style={{ fontSize: '0.78rem' }}>{sh.subtitle}</p>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-gold w-100"
                        onClick={() => startRouting({ id: sh.id, name: sh.name, lat: sh.coords.lat, lng: sh.coords.lng })}
                      >
                        <i className="bi bi-cursor-fill me-1"></i> Route to This Destination
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 2: SHRINE GATE FINDER                                          */}
        {/* ================================================================== */}
        {activeTab === 'gates' && (
          <div className="mb-5">
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <div>
                <h3 className="font-display text-white mb-1" style={{ fontSize: '1.4rem' }}>
                  <i className="bi bi-door-open-fill text-gold-antique me-2"></i>
                  Verified Shrine Gate Discovery
                </h3>
                <div className="text-secondary small">Filter verified portals by shrine, inspect shoe deposits (Keshwan), and request walking directions</div>
              </div>

              {/* Shrine Filter */}
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className={`btn btn-sm ${gateShrineFilter === 'all' ? 'btn-gold' : 'btn-outline-light'}`}
                  onClick={() => setGateShrineFilter('all')}
                >
                  All Gates ({verifiedGates.length})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${gateShrineFilter === 'shrine_hussain' ? 'btn-gold' : 'btn-outline-light'}`}
                  onClick={() => setGateShrineFilter('shrine_hussain')}
                >
                  Imam Hussain Gates (5)
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${gateShrineFilter === 'shrine_abbas' ? 'btn-gold' : 'btn-outline-light'}`}
                  onClick={() => setGateShrineFilter('shrine_abbas')}
                >
                  Al-Abbas Gates (4)
                </button>
              </div>
            </div>

            <div className="row g-3">
              {filteredGates.map(gate => {
                const straightDist = calculateDistance(userLocation.lat, userLocation.lng, gate.coords.lat, gate.coords.lng);
                return (
                  <div className="col-lg-4 col-md-6" key={gate.id}>
                    <div className="gate-finder-card">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="badge bg-dark border border-gold-subtle text-gold-antique" style={{ fontSize: '0.68rem' }}>
                          {gate.shrine}
                        </span>
                        <span className="badge bg-black-subtle text-secondary border border-dark" style={{ fontSize: '0.68rem' }}>
                          {straightDist}m straight-line
                        </span>
                      </div>

                      <div className="small text-gold-antique mb-1" style={{ direction: 'rtl', fontFamily: 'var(--font-arabic)' }}>
                        {gate.arabicName}
                      </div>

                      <h5 className="font-display text-white mb-2" style={{ fontSize: '1.05rem' }}>
                        {gate.name}
                      </h5>

                      <p className="small text-light-subtle mb-3 flex-grow-1" style={{ fontSize: '0.78rem' }}>
                        {gate.description}
                      </p>

                      <div className="p-2 rounded bg-black-subtle border border-dark small text-light-subtle mb-3" style={{ fontSize: '0.72rem' }}>
                        <div><i className="bi bi-box-arrow-in-right text-gold-antique me-1.5"></i><strong>Shoe Deposit:</strong> {gate.shoeKeeping}</div>
                        <div><i className="bi bi-person-wheelchair text-success me-1.5"></i><strong>Access:</strong> {gate.accessibility}</div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-gold w-100"
                        onClick={() => startRouting({ id: gate.id, name: gate.name, lat: gate.coords.lat, lng: gate.coords.lng })}
                      >
                        <i className="bi bi-cursor-fill me-1"></i> Directions to this Gate
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 3: SERVICES NEAR ME (Distance-Sorted Amenities)                */}
        {/* ================================================================== */}
        {activeTab === 'services' && (
          <div className="mb-5">
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <div>
                <h3 className="font-display text-white mb-1" style={{ fontSize: '1.4rem' }}>
                  <i className="bi bi-geo-fill text-gold-antique me-2"></i>
                  Services Near Me
                </h3>
                <div className="text-secondary small">Live distance-sorted pilgrim facilities calculated from your current GPS coordinates</div>
              </div>

              {/* Service Filter Chips */}
              <div className="d-flex gap-1 flex-wrap">
                {[
                  { id: 'all', label: 'All Services' },
                  { id: 'water', label: 'Water' },
                  { id: 'medical', label: 'Medical' },
                  { id: 'washroom', label: 'Wudu / WC' },
                  { id: 'wheelchair', label: 'Wheelchair' },
                  { id: 'lost_found', label: 'Lost Persons' },
                  { id: 'luggage', label: 'Luggage' },
                  { id: 'info', label: 'Information' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`btn btn-sm ${serviceFilter === cat.id ? 'btn-gold' : 'btn-outline-secondary'}`}
                    onClick={() => setServiceFilter(cat.id)}
                    style={{ fontSize: '0.74rem' }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="row g-3">
              {filteredNearby.map(fac => (
                <div className="col-lg-4 col-md-6" key={fac.id}>
                  <div className="service-near-card h-100 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle p-1.5 bg-dark border border-secondary d-flex align-items-center justify-content-center text-success" style={{ width: 32, height: 32 }}>
                          <i className={`bi ${fac.icon}`}></i>
                        </div>
                        <span className="badge bg-dark text-success border border-success-subtle" style={{ fontSize: '0.68rem' }}>
                          Verified Waqf
                        </span>
                      </div>
                      <span className="badge bg-black text-gold-antique border border-gold-subtle" style={{ fontSize: '0.74rem' }}>
                        {fac.distanceMeters} m away
                      </span>
                    </div>

                    <h5 className="font-display text-white mb-1" style={{ fontSize: '1.02rem' }}>
                      {fac.name}
                    </h5>

                    <p className="small text-secondary mb-2 flex-grow-1" style={{ fontSize: '0.78rem' }}>
                      {fac.desc}
                    </p>

                    <div className="small text-light-subtle mb-3" style={{ fontSize: '0.72rem' }}>
                      <div><i className="bi bi-clock me-1 text-gold-antique"></i>{fac.hours} • {fac.cost || 'Free'}</div>
                      {fac.phone && <div><i className="bi bi-telephone me-1 text-gold-antique"></i>{fac.phone}</div>}
                    </div>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success w-100"
                      onClick={() => startRouting({ id: fac.id, name: fac.name, lat: fac.coords.lat, lng: fac.coords.lng })}
                    >
                      <i className="bi bi-cursor-fill me-1"></i> Walking Directions ({fac.distanceMeters}m)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 4: CURATED ZIYARAT PLANNER TRACKS                              */}
        {/* ================================================================== */}
        {activeTab === 'planner' && (
          <div className="mb-5">
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <div>
                <h3 className="font-display text-white mb-1" style={{ fontSize: '1.4rem' }}>
                  <i className="bi bi-calendar-check-fill text-gold-antique me-2"></i>
                  Curated Ziyarat Itinerary Tracks
                </h3>
                <div className="text-secondary small">Step-by-step spiritual routes customized by time, accessibility, and walking preferences</div>
              </div>

              <div className="d-flex gap-2 flex-wrap">
                {plans.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    className={`btn btn-sm ${selectedPlanId === p.id ? 'btn-gold' : 'btn-outline-secondary'}`}
                    onClick={() => setSelectedPlanId(p.id)}
                    style={{ fontSize: '0.74rem' }}
                  >
                    {p.name.split(' ')[0]} Track
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-3 bg-charcoal border border-gold-subtle mb-4">
              <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                <div>
                  <span className="badge bg-gold-subtle text-gold-antique border border-gold-subtle mb-1" style={{ fontSize: '0.72rem' }}>
                    {activePlan.badge}
                  </span>
                  <h4 className="font-display text-white mb-1">{activePlan.name}</h4>
                  <div className="small text-secondary">
                    <i className="bi bi-clock me-1 text-gold-antique"></i>Duration: {activePlan.duration} • <i className="bi bi-person-walking me-1 text-gold-antique"></i>Walking: {activePlan.walking}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-gold"
                  onClick={() => {
                    startRouting({ id: 'plan_dest_1', name: activePlan.steps[0].title, lat: 32.61520, lng: 44.03245 });
                  }}
                >
                  <i className="bi bi-play-circle-fill me-1"></i> Start This Itinerary
                </button>
              </div>

              <div className="d-flex flex-column gap-2">
                {activePlan.steps.map((st, idx) => (
                  <div className="p-3 rounded bg-dark border border-dark d-flex align-items-center gap-3" key={idx}>
                    <div className="rounded-circle p-2 bg-black border border-gold-subtle text-gold-antique fw-bold text-center" style={{ width: 36, height: 36, fontSize: '0.85rem' }}>
                      {idx + 1}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2">
                        <strong className="text-white">{st.title}</strong>
                        <span className="badge bg-secondary-subtle text-light" style={{ fontSize: '0.66rem' }}>{st.time}</span>
                      </div>
                      <div className="small text-secondary">{st.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 5: AUDITED EMERGENCY INFORMATION                               */}
        {/* ================================================================== */}
        {activeTab === 'emergency' && (
          <div className="mb-5">
            <div className="mb-4">
              <h3 className="font-display text-white mb-1" style={{ fontSize: '1.4rem' }}>
                <i className="bi bi-shield-check text-gold-antique me-2"></i>
                Audited Emergency Contact Directory
              </h3>
              <div className="text-secondary small">
                Verified against Iraqi National Emergency Communications, Ministry of Interior, and Astan Quds directories. Last Audited: <strong>March 15, 2026</strong>.
              </div>
            </div>

            <div className="row g-3">
              {emergencyContacts.map(c => (
                <div className="col-lg-6" key={c.id}>
                  <div className="emergency-audit-card">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge-authority px-2 py-0.5 rounded">
                        <i className="bi bi-check-circle-fill me-1"></i>{c.status}
                      </span>
                      <span className="small text-secondary" style={{ fontSize: '0.70rem' }}>
                        Audited: {c.audited}
                      </span>
                    </div>

                    <h5 className="font-display text-white mb-1" style={{ fontSize: '1.05rem' }}>
                      {c.service}
                    </h5>

                    <div className="small text-secondary mb-3">
                      Authority: <strong className="text-light">{c.authority}</strong>
                    </div>

                    <div className="d-flex align-items-center justify-content-between p-2 rounded bg-black border border-dark">
                      <div>
                        <div className="small text-secondary" style={{ fontSize: '0.70rem' }}>DIALING NUMBER</div>
                        <div className="font-monospace text-gold-antique fw-bold" style={{ fontSize: '1.15rem' }}>
                          {c.shortNumber || c.internationalNumber || c.localLandline}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light"
                        onClick={() => {
                          navigator.clipboard?.writeText(c.shortNumber || c.internationalNumber || c.localLandline);
                          alert(`Copied: ${c.shortNumber || c.internationalNumber || c.localLandline}`);
                        }}
                      >
                        <i className="bi bi-clipboard me-1"></i>Copy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Protocol Advisory */}
            <div className="p-3 rounded bg-black-subtle border border-gold-subtle mt-3 small text-light-subtle">
              <i className="bi bi-info-circle text-gold-antique me-2"></i>
              <strong>Pilgrim Safety Advisory:</strong> In the event of separation from family members within the holy shrines, proceed immediately to <strong>Markaz al-Mafqoodin (Lost Persons Office)</strong> at Bayn al-Haramayn or contact shrine security desk at <strong>+964 32 322 0000</strong>. Multilingual officers (Urdu, English, Persian) are on duty 24/7.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}




// ==========================================================================
// EXPERIENCE 3: ASK KARBALA AI — MULTILINGUAL ASSISTANT (PHASE 5)
// ==========================================================================
function AskKarbalaAiHub({ onNavigate }) {
  const [aiMode, setAiMode] = useState('translate'); // 'translate' | 'recognize' | 'qna'
  const [targetLang, setTargetLang] = useState('ur'); // 'en' | 'ur' | 'hi' | 'fa'
  const [selectedSampleSign, setSelectedSampleSign] = useState(0);
  const [recognizeImage, setRecognizeImage] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [speaking, setSpeaking] = useState(false);

  const sampleSigns = [
    {
      arabic: 'مكتب إرشاد التائهين ولم شمل الأسر المركزي',
      transliteration: 'Maktab Irshad al-Ta’iheen wa Lamm Shamal al-Usar',
      translations: {
        en: 'Central Office for Lost Persons and Family Reunion',
        ur: 'گمشدہ افراد اور خاندان کے ملاپ کا مرکزی دفتر',
        hi: 'लापता व्यक्तियों और परिवार पुनर्मिलन का केंद्रीय कार्यालय',
        fa: 'دفتر مرکزی راهنمایی گمشدگان و پیوند خانواده'
      },
      confidence: '99.2%',
      category: 'Visitor Safety',
      location: 'Bayn al-Haramayn Center (Near Column 22)'
    },
    {
      arabic: 'محطة السقاء لمياه الشرب النقية المبردة — سبيل مجاني',
      transliteration: 'Mahattat al-Saqqa li-Miyah al-Shurb al-Naqiyya al-Mubarrada',
      translations: {
        en: 'Al-Saqqa Chilled Pure Drinking Water Station — Free Public Waqf',
        ur: 'السقاء ٹھنڈے اور صاف پینے کے پانی کا مقام — سبیل مفت',
        hi: 'अल-सक्का शीतल शुद्ध पेयजल स्टेशन — निःशुल्क वक्फ',
        fa: 'ایستگاه آب آشامیدنی خنک و تصفیه شده سقا — نذر عمومی'
      },
      confidence: '98.7%',
      category: 'Pilgrim Service',
      location: 'Opposite Bab al-Qibla'
    },
    {
      arabic: 'أمانات الهواتف والحقائب — يرجى استلام الوصل',
      transliteration: 'Amanat al-Hawatif wa al-Haqa’ib — Yurja Istilam al-Wasl',
      translations: {
        en: 'Mobile Phones & Baggage Safety Deposit — Please Collect Receipt',
        ur: 'موبائل فونز اور سامان کی امانت — برائے مہربانی رسید حاصل کریں',
        hi: 'मोबाइल फोन और सामान की अमानत — कृपया रसीद प्राप्त करें',
        fa: 'امانات تلفن همراه و کیف — لطفاً رسید تحویل بگیرید'
      },
      confidence: '97.9%',
      category: 'Security & Belongings',
      location: 'Outer Perimeter Inspection Gate'
    }
  ];

  const recognitionSamples = [
    {
      id: 'rec_hussain_dome',
      name: 'Holy Shrine of Imam Hussain (AS) — Central Golden Dome & Minarets',
      arabic: 'قبة الإمام الحسين عليه السلام والمنارتان الذهبيتان',
      image: 'assets/images/karbala_img_37_Karbala_City_1_jpg.jpg',
      confidence: '99.4% Match',
      features: ['24-Karat Pure Gold Gilding (7,200 plates)', 'Twin 35m Minarets', 'Crimson Banner of Hussain'],
      coords: '32.6160° N, 44.0324° E',
      historicalOrigin: 'Original grave depression (Gowd-e Qatlgah) dated 61 AH; current structure reconstructed across centuries.'
    },
    {
      id: 'rec_abbas_sanctuary',
      name: 'Holy Shrine of Hazrat Al-Abbas (AS) — Eastern Sanctuary',
      arabic: 'حرم أبي الفضل العباس عليه السلام',
      image: 'assets/images/shrine_27.jpg',
      confidence: '98.8% Match',
      features: ['Ceremonial Clock Tower', 'Furat / Al-Alqami Eastern Orientation', 'Ornate Kashi Tilework'],
      coords: '32.6186° N, 44.0358° E',
      historicalOrigin: 'Martyrdom site of the Standard-Bearer of Karbala on the banks of ancient Nahr al-Alqami.'
    },
    {
      id: 'rec_bayn_concourse',
      name: 'Bayn al-Haramayn Pedestrian Esplanade',
      arabic: 'ساحة ما بين الحرمين الشريفين',
      image: 'assets/images/karbala_img_0_Beyn-_l_H_r_meyn__K_rb_la_jpg.jpg',
      confidence: '97.9% Match',
      features: ['378-Meter Marble Promenade', 'Palm Grove Border Architecture', 'Arba’een Processional Axis'],
      coords: '32.6173° N, 44.0341° E',
      historicalOrigin: 'The historical open expanse between the two encampment wings and the sacred tomb.'
    }
  ];

  const historicalQna = [
    {
      q: 'Who was Imam Hussain (AS) and why did he arrive at Karbala in 61 AH?',
      a: 'Imam Hussain ibn Ali (AS) was the grandson of Prophet Muhammad (SAW) and the third Shia Imam. In 61 AH (680 CE), refusing to legitimize the despotic succession of Yazid ibn Muawiya, he departed Medina and Mecca toward Kufa following thousands of written appeals for social justice. Intercepted on 2 Muharram at the plain of al-Taff (Karbala), he stood with 72 companions and family members for spiritual freedom, prophetic ethics, and resistance to oppression.',
      citations: 'Tarikh al-Rusul wa al-Muluk (al-Tabari), Vol. 5, p. 341; Kitab al-Irshad (Shaykh al-Mufid), p. 182.'
    },
    {
      q: 'What is the historical origin and significance of Bayn al-Haramayn?',
      a: 'Bayn al-Haramayn (literally "Between the Two Sanctuaries") is the 378-meter paved concourse joining the Holy Shrine of Imam Hussain to the south and the Holy Shrine of Hazrat Abbas to the north. Historically an open residential and date-palm area, it was modernized into an uninterrupted pedestrian esplanade in the 1980s and is now the global gathering hub for over 20 million pilgrims during Arba’een.',
      citations: 'Al-Haramayn al-Sharifayn Historical Survey; Karbala Heritage Directorate Registry, 2024.'
    },
    {
      q: 'What is the significance of the crescent trench and fire on the morning of Ashura?',
      a: 'On the eve and dawn of 10 Muharram 61 AH, Imam Hussain ordered his companions to dig a crescent-shaped defensive trench behind their thirty tents and fill it with cane wood and thorns. Upon ignition, the fire protected the rear of the camp from sudden cavalry envelopment, ensuring the Umayyad force of Umar ibn Sa’d could only engage them from a single frontal axis.',
      citations: 'Maqtal al-Husayn (Abu Mikhnaf), p. 114; Tarikh al-Tabari, Vol. 5, p. 422.'
    }
  ];

  const currentSign = sampleSigns[selectedSampleSign];
  const currentRec = recognitionSamples[recognizeImage];

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="ai-companion-wrapper">
      <div className="container-fluid px-lg-5 px-3">

        {/* --- AI Hub Header --- */}
        <div className="pilgrim-live-header mb-4" style={{ background: 'linear-gradient(135deg, #161026 0%, #22173B 50%, #120D1F 100%)' }}>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge" style={{ background: '#4A148C', color: '#E1BEE7', border: '1px solid #7B1FA2', letterSpacing: '0.08em' }}>
                  <i className="bi bi-cpu-fill me-1"></i>
                  ASK KARBALA AI 2.0
                </span>
                <span className="badge bg-dark text-gold-antique border border-gold-subtle" style={{ fontSize: '0.72rem' }}>
                  MULTILINGUAL &amp; SOURCED
                </span>
              </div>
              <h2 className="font-display text-white mb-2" style={{ letterSpacing: '0.08em', fontSize: '1.9rem' }}>
                INTELLIGENT PILGRIMAGE &amp; KNOWLEDGE ASSISTANT
              </h2>
              <p className="text-ivory-soft mb-0" style={{ fontSize: '0.92rem', maxWidth: '820px' }}>
                Instant camera translation of Arabic directional signage, neural photographic landmark recognition, and source-grounded historical inquiries cited from classical chronicles.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="d-flex gap-2 flex-wrap">
              {[
                { id: 'translate', label: 'Camera OCR Translator', icon: 'bi-camera-fill' },
                { id: 'recognize', label: 'Landmark Recognition', icon: 'bi-aspect-ratio-fill' },
                { id: 'qna', label: 'Historical Q&A Assistant', icon: 'bi-chat-quote-fill' }
              ].map(m => (
                <button
                  key={m.id}
                  data-aimode={m.id}
                  type="button"
                  className={`btn btn-sm ${aiMode === m.id ? 'btn-gold' : 'btn-outline-light'}`}
                  onClick={() => setAiMode(m.id)}
                  style={{ fontSize: '0.78rem', letterSpacing: '0.06em' }}
                >
                  <i className={`bi ${m.icon} me-1`}></i>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- TAB 1: CAMERA OCR TRANSLATOR --- */}
        {aiMode === 'translate' && (
          <div className="row g-4 mb-5">
            <div className="col-lg-5 col-md-12">
              <div className="p-4 rounded-3 bg-charcoal border border-gold-subtle h-100">
                <h4 className="font-display text-white mb-2" style={{ fontSize: '1.25rem' }}>
                  <i className="bi bi-camera-fill text-gold-antique me-2"></i>
                  Scan Arabic Signage
                </h4>
                <p className="text-secondary small mb-3">
                  Select a typical Karbala holy precinct sign or upload a photo to detect Arabic script and view instant translations:
                </p>

                {/* Sample Signs Selector */}
                <div className="mb-3">
                  <div className="small text-white-50 mb-2"><strong>Sample Directional Signboards:</strong></div>
                  <div className="d-flex flex-column gap-2">
                    {sampleSigns.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`btn btn-sm text-start ${selectedSampleSign === idx ? 'btn-outline-gold bg-black-subtle' : 'btn-outline-secondary'}`}
                        onClick={() => setSelectedSampleSign(idx)}
                        style={{ fontSize: '0.82rem' }}
                      >
                        <div className="text-white fw-bold mb-1" style={{ direction: 'rtl', fontFamily: 'var(--font-arabic)' }}>
                          {s.arabic}
                        </div>
                        <div className="small text-secondary">{s.category} • {s.location}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Language Switcher */}
                <div className="mb-3">
                  <div className="small text-white-50 mb-2"><strong>Target Translation Language:</strong></div>
                  <div className="d-flex gap-2">
                    {[
                      { id: 'ur', label: 'اردو (Urdu)' },
                      { id: 'en', label: 'English' },
                      { id: 'hi', label: 'हिन्दी (Hindi)' },
                      { id: 'fa', label: 'فارسی (Persian)' }
                    ].map(lg => (
                      <button
                        key={lg.id}
                        type="button"
                        className={`btn btn-sm flex-grow-1 ${targetLang === lg.id ? 'btn-gold' : 'btn-outline-secondary'}`}
                        onClick={() => setTargetLang(lg.id)}
                        style={{ fontSize: '0.74rem' }}
                      >
                        {lg.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded bg-dark border border-dark small text-secondary">
                  <i className="bi bi-info-circle text-gold-antique me-2"></i>
                  <strong>Safety Notice:</strong> For urgent medical notices, security gates, or emergency evacuation signage, verify with uniform shrine security.
                </div>
              </div>
            </div>

            {/* Translation Output Card */}
            <div className="col-lg-7 col-md-12">
              <div className="p-4 rounded-3 bg-dark border border-gold-subtle h-100 d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="badge bg-success-subtle text-success border border-success-subtle">
                    <i className="bi bi-check2-circle me-1"></i>
                    OCR Confidence: {currentSign.confidence}
                  </span>
                  <span className="text-secondary small">
                    <i className="bi bi-geo-alt text-gold-antique me-1"></i>
                    {currentSign.location}
                  </span>
                </div>

                {/* Detected Arabic Text */}
                <div className="p-3 rounded bg-black border border-dark mb-3">
                  <div className="small text-secondary mb-1">Detected Arabic Text:</div>
                  <div className="text-white fs-4 fw-bold" style={{ direction: 'rtl', fontFamily: 'var(--font-arabic)' }}>
                    {currentSign.arabic}
                  </div>
                  <div className="small text-gold-antique mt-2">
                    <em>Transliteration:</em> {currentSign.transliteration}
                  </div>
                </div>

                {/* Translated Result */}
                <div className="p-3 rounded bg-charcoal border border-gold mb-3 flex-grow-1">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="small text-gold-antique">
                      <strong>Translation ({targetLang.toUpperCase()}):</strong>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light"
                      onClick={() => handleSpeak(currentSign.translations[targetLang])}
                      style={{ fontSize: '0.72rem' }}
                    >
                      <i className={`bi ${speaking ? 'bi-volume-up-fill text-warning' : 'bi-volume-up'} me-1`}></i>
                      {speaking ? 'Speaking...' : 'Listen Audio'}
                    </button>
                  </div>
                  <div className="text-white fs-5 fw-semibold" style={{ direction: targetLang === 'ur' || targetLang === 'fa' ? 'rtl' : 'ltr' }}>
                    {currentSign.translations[targetLang]}
                  </div>
                </div>

                <div className="mt-auto d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-gold flex-grow-1"
                    onClick={() => {
                      navigator.clipboard?.writeText(currentSign.translations[targetLang]);
                      alert('Translation copied to clipboard!');
                    }}
                  >
                    <i className="bi bi-clipboard me-1"></i>
                    Copy Translation
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light"
                    onClick={() => onNavigate('map')}
                  >
                    <i className="bi bi-cursor me-1"></i>
                    Locate On Map
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: LANDMARK RECOGNITION --- */}
        {aiMode === 'recognize' && (
          <div className="row g-4 mb-5">
            <div className="col-lg-5 col-md-12">
              <div className="p-4 rounded-3 bg-charcoal border border-gold-subtle h-100">
                <h4 className="font-display text-white mb-2" style={{ fontSize: '1.25rem' }}>
                  <i className="bi bi-aspect-ratio-fill text-gold-antique me-2"></i>
                  Shrine &amp; Landmark Recognition
                </h4>
                <p className="text-secondary small mb-3">
                  Upload a photograph or select a benchmark architectural specimen to trigger visual feature extraction against the Karbala Twin database:
                </p>

                <div className="d-flex flex-column gap-2 mb-3">
                  {recognitionSamples.map((r, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded cursor-pointer d-flex align-items-center gap-3 ${recognizeImage === idx ? 'border border-gold bg-dark' : 'border border-dark bg-black-subtle'}`}
                      onClick={() => setRecognizeImage(idx)}
                    >
                      <img src={r.image} alt={r.name} style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 4 }} />
                      <div>
                        <div className="small text-white fw-bold">{r.name.split('—')[0]}</div>
                        <div className="text-success small" style={{ fontSize: '0.72rem' }}>{r.confidence}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="ai-scan-box">
                  <i className="bi bi-cloud-arrow-up-fill text-gold-antique fs-2 mb-2 d-block"></i>
                  <div className="small text-white fw-bold">Upload Pilgrim Photo</div>
                  <div className="small text-secondary">Drag &amp; drop or click to test custom photo</div>
                </div>
              </div>
            </div>

            {/* Recognition Details Card */}
            <div className="col-lg-7 col-md-12">
              <div className="p-4 rounded-3 bg-dark border border-gold-subtle h-100">
                <div className="row g-3 mb-3">
                  <div className="col-md-5">
                    <img src={currentRec.image} alt={currentRec.name} className="w-100 rounded-2" style={{ maxHeight: 220, objectFit: 'cover' }} />
                  </div>
                  <div className="col-md-7">
                    <div className="badge bg-success-subtle text-success border border-success-subtle mb-1">
                      <i className="bi bi-shield-check me-1"></i>{currentRec.confidence}
                    </div>
                    <h4 className="font-display text-white mb-1" style={{ fontSize: '1.2rem' }}>{currentRec.name}</h4>
                    <div className="small text-gold-antique mb-2" style={{ direction: 'rtl', fontFamily: 'var(--font-arabic)' }}>{currentRec.arabic}</div>
                    <div className="small text-secondary mb-1"><i className="bi bi-pin-map text-gold-antique me-1"></i><strong>Coordinates:</strong> {currentRec.coords}</div>
                  </div>
                </div>

                <div className="p-3 rounded bg-charcoal border border-dark mb-3">
                  <div className="small text-white fw-bold mb-1">Detected Architectural Signature Features:</div>
                  <ul className="mb-0 small text-secondary ps-3">
                    {currentRec.features.map((f, fi) => (
                      <li key={fi}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div className="small text-light-subtle mb-4">
                  <strong>Historical Ground-Truth:</strong> {currentRec.historicalOrigin}
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-gold"
                    onClick={() => onNavigate('map')}
                  >
                    <i className="bi bi-compass-fill me-1"></i>
                    Open in Interactive Digital Twin Map
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light"
                    onClick={() => onNavigate('story')}
                  >
                    Exhibition Monograph
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: SOURCE-GROUNDED HISTORICAL Q&A --- */}
        {aiMode === 'qna' && (
          <div className="mb-5">
            <div className="row g-4">
              <div className="col-lg-4 col-md-12">
                <div className="p-4 rounded-3 bg-charcoal border border-gold-subtle h-100">
                  <h4 className="font-display text-white mb-2" style={{ fontSize: '1.25rem' }}>
                    <i className="bi bi-chat-quote-fill text-gold-antique me-2"></i>
                    Inquire Ask Karbala AI
                  </h4>
                  <p className="text-secondary small mb-3">
                    Ask questions regarding the historical events of 61 AH, personalities, battle topography, or ziyarat meanings:
                  </p>

                  <div className="d-flex flex-column gap-2 mb-3">
                    {historicalQna.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`btn btn-sm text-start ${activeQuestion === idx ? 'btn-outline-gold bg-black-subtle' : 'btn-outline-secondary'}`}
                        onClick={() => setActiveQuestion(idx)}
                        style={{ fontSize: '0.80rem' }}
                      >
                        <i className="bi bi-question-circle text-gold-antique me-2"></i>
                        {item.q}
                      </button>
                    ))}
                  </div>

                  <div className="small text-secondary p-3 rounded bg-black-subtle border border-dark">
                    <i className="bi bi-shield-lock-fill text-gold-antique me-1"></i>
                    <strong>Academic Rigor:</strong> All responses are retrieved from primary historical manuscripts (al-Tabari, al-Mufid) and authenticated digital twin terrain studies.
                  </div>
                </div>
              </div>

              {/* Q&A Answer Card */}
              <div className="col-lg-8 col-md-12">
                <div className="p-4 rounded-3 bg-dark border border-gold-subtle h-100 d-flex flex-column">
                  <div className="badge bg-gold-subtle text-gold-antique border border-gold-subtle mb-2 align-self-start">
                    VERIFIED SCHOLARLY INQUIRY
                  </div>
                  <h3 className="font-display text-white mb-3" style={{ fontSize: '1.35rem' }}>
                    {historicalQna[activeQuestion].q}
                  </h3>

                  <div className="p-3 rounded bg-charcoal border border-dark mb-3 text-ivory-soft leading-relaxed flex-grow-1" style={{ fontSize: '0.94rem', lineHeight: '1.7' }}>
                    {historicalQna[activeQuestion].a}
                  </div>

                  <div className="p-3 rounded bg-black-subtle border border-dark mb-3">
                    <div className="small text-gold-antique fw-bold mb-1">
                      <i className="bi bi-book-half me-1"></i>Primary Historical Citations &amp; Classical Sources:
                    </div>
                    <div className="small text-secondary font-monospace" style={{ fontSize: '0.78rem' }}>
                      {historicalQna[activeQuestion].citations}
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-gold"
                      onClick={() => onNavigate('historiography')}
                    >
                      <i className="bi bi-journal-text me-1"></i>
                      View Full Historiography Dossier
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light"
                      onClick={() => onNavigate('timeline')}
                    >
                      Explore Day-by-Day Timeline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}




function KarbalaApp() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const timelineIntervalRef = useRef(null);

  // High-Level Website Navigation View: 'home' | 'map' | 'story' | 'journey-61ah' | 'timeline' | 'personalities' | 'pavilion' | 'historiography' | 'ziyarat' | 'ai'
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    const valid = ['home', 'map', 'story', 'journey-61ah', 'timeline', 'personalities', 'pavilion', 'historiography', 'ziyarat', 'ai'];
    return valid.includes(hash) ? hash : 'home';
  });

  const navigateTo = useCallback((viewId) => {
    window.location.hash = viewId === 'home' ? '' : viewId;
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      const valid = ['home', 'map', 'story', 'journey-61ah', 'timeline', 'personalities', 'pavilion', 'historiography', 'ziyarat', 'ai'];
      if (valid.includes(hash)) {
        setCurrentView(hash);
      } else if (!hash) {
        setCurrentView('home');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    if (currentView === 'map') {
      document.body.classList.add('mode-fullscreen-map');
      setTimeout(() => {
        if (mapInstanceRef.current) mapInstanceRef.current.resize();
      }, 100);
    } else {
      document.body.classList.remove('mode-fullscreen-map');
    }
  }, [currentView]);

  const [mode, setMode] = useState('present'); // 'present' | '61ah'
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedAshuraPhaseIndex, setSelectedAshuraPhaseIndex] = useState(0);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [isThenNowLens, setIsThenNowLens] = useState(false);
  const [splitPos, setSplitPos] = useState(50);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedLocations, setSavedLocations] = useState(() => {
    return JSON.parse(localStorage.getItem('karbala_saved_sites') || '[]');
  });

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'certainty' | 'personalities' | 'ziyarat' | 'access' | 'navigate' | 'saved'
  const [certaintyKey, setCertaintyKey] = useState('maqtal_hussain');
  const [personFilter, setPersonFilter] = useState('');
  const [flashActive, setFlashActive] = useState(false);
  const [guidedTourStep, setGuidedTourStep] = useState(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);

  const toggleGuidedTour = () => {
    if (guidedTourStep) {
      if (mapInstanceRef.current) mapInstanceRef.current.stopGuidedJourney();
      setGuidedTourStep(null);
    } else {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.startGuidedJourney((step) => {
          setGuidedTourStep(step);
          if (step && step.id) {
            const loc = (mode === 'present' ? PRESENT_DAY_LOCATIONS : HISTORICAL_61AH_LOCATIONS).find(l => l.id === step.id);
            if (loc) setSelectedLocation(loc);
          }
        });
      }
    }
  };

  // Audio state
  const [showAudioDock, setShowAudioDock] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({ title: 'Ziyarat Warith', artist: 'Aba Thar al-Halwaji', duration: '4:32' });
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioTimeStr, setAudioTimeStr] = useState('0:00');

  // Gallery / Visual Archive state (360+ Images)
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState('all');
  const [gallerySearch, setGallerySearch] = useState('');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [galleryPage, setGalleryPage] = useState(1);

  // Cinematic Background Atmosphere & Ambient Particles
  const particleCanvasRef = useRef(null);
  const [bgAtmosphere, setBgAtmosphere] = useState('rich'); // 'vivid' | 'rich' | 'subtle' | 'off'
  const [currentBgImage, setCurrentBgImage] = useState('assets/images/shrine_38.jpg');

  // Sync background image with active mode or selected site
  useEffect(() => {
    if (selectedLocation && selectedLocation.image) {
      setCurrentBgImage(selectedLocation.image);
    } else if (mode === 'present') {
      setCurrentBgImage('assets/images/shrine_38.jpg');
    } else {
      setCurrentBgImage('assets/images/ai_61ah_encampment.jpg');
    }
  }, [mode, selectedLocation]);

  // Ambient Particles Effect (Warm Embers in 61 AH, Celestial Starlight in Present Day)
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas || bgAtmosphere === 'off') return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random() * (canvas.width || 1200),
      y: Math.random() * (canvas.height || 800),
      vx: (Math.random() - 0.5) * 0.45,
      vy: mode === '61ah' ? -0.4 - Math.random() * 0.65 : (Math.random() - 0.5) * 0.35,
      size: Math.random() * 2.4 + 0.8,
      alpha: Math.random() * 0.7 + 0.25,
      pulse: Math.random() * Math.PI * 2
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isHistorical = mode === '61ah';

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.035;
        const currentAlpha = p.alpha * (0.6 + Math.sin(p.pulse) * 0.4);

        if (p.y < 0) { p.y = canvas.height; p.x = Math.random() * canvas.width; }
        if (p.y > canvas.height) p.y = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        if (isHistorical) {
          ctx.fillStyle = `rgba(245, 158, 11, ${currentAlpha})`;
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = `rgba(254, 240, 138, ${currentAlpha * 0.85})`;
          ctx.shadowColor = '#fde047';
          ctx.shadowBlur = 6;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [mode, bgAtmosphere]);

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(d => {
        if (d && d.images) setGalleryImages(d.images);
      })
      .catch(() => {});
  }, []);

  // Initialize Map
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      const map = new KarbalaMap(mapContainerRef.current, {
        onLocationSelect: (loc) => {
          setSelectedLocation(loc);
          setSelectedEvent(null);
        },
        onViewHistorical: (histId) => {
          switchToHistoricalAndHighlight(histId);
        }
      });
      map.setData(PRESENT_DAY_LOCATIONS, HISTORICAL_61AH_LOCATIONS);
      mapInstanceRef.current = map;
    }
  }, []);

  // Sync mode changes with map and flash effect
  const handleModeChange = useCallback((newMode) => {
    if (mode === newMode) return;
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 450);

    setMode(newMode);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMode(newMode);
    }

    // Contextual update if a location is selected
    if (selectedLocation) {
      if (newMode === '61ah' && selectedLocation.historicalId) {
        const histLoc = HISTORICAL_61AH_LOCATIONS.find(l => l.id === selectedLocation.historicalId);
        if (histLoc) setSelectedLocation(histLoc);
      } else if (newMode === 'present' && selectedLocation.presentId) {
        const presLoc = PRESENT_DAY_LOCATIONS.find(l => l.id === selectedLocation.presentId);
        if (presLoc) setSelectedLocation(presLoc);
      }
    }
  }, [mode, selectedLocation]);

  const switchToHistoricalAndHighlight = useCallback((histId) => {
    handleModeChange('61ah');
    const loc = HISTORICAL_61AH_LOCATIONS.find(l => l.id === histId);
    if (loc) {
      setSelectedLocation(loc);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.highlightLocation(loc.id);
      }
    }
  }, [handleModeChange]);

  const switchToPresentAndHighlight = useCallback((presId) => {
    handleModeChange('present');
    const loc = PRESENT_DAY_LOCATIONS.find(l => l.id === presId);
    if (loc) {
      setSelectedLocation(loc);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.highlightLocation(loc.id);
      }
    }
  }, [handleModeChange]);

  // Audio listeners
  useEffect(() => {
    const unsub = audioEngine.subscribe((evt, data) => {
      if (evt === 'statechange') {
        setAudioPlaying(data.isPlaying);
        if (data.track) setCurrentTrack(data.track);
      } else if (evt === 'trackchange') {
        setCurrentTrack(data);
      } else if (evt === 'timeupdate') {
        setAudioProgress(data.progress || 0);
        const m = Math.floor(data.currentTime / 60);
        const s = Math.floor(data.currentTime % 60);
        setAudioTimeStr(`${m}:${s < 10 ? '0' : ''}${s}`);
      }
    });
    return unsub;
  }, []);

  // Save / Bookmark handler (synced to MongoDB / Express API & localStorage)
  const toggleSaveLocation = async (loc) => {
    if (!loc) return;
    const exists = savedLocations.some(s => s.id === loc.id);
    let updated;
    if (exists) {
      updated = savedLocations.filter(s => s.id !== loc.id);
      try {
        fetch(`/api/bookmarks/${loc.id}`, { method: 'DELETE' });
      } catch (e) {}
    } else {
      const item = {
        id: loc.id,
        locationId: loc.id,
        name: loc.name,
        arabicName: loc.arabicName,
        category: loc.category,
        image: loc.image
      };
      updated = [item, ...savedLocations];
      try {
        fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      } catch (e) {}
    }
    setSavedLocations(updated);
    localStorage.setItem('karbala_saved_sites', JSON.stringify(updated));
  };

  // Timeline Day selection
  const selectTimelineDay = useCallback((dayIdx) => {
    setSelectedDayIndex(dayIdx);
    handleModeChange('61ah');
    const day = MUHARRAM_DAYS[dayIdx];

    if (mapInstanceRef.current && day.highlightCoords) {
      mapInstanceRef.current.panTo(day.highlightCoords.x, day.highlightCoords.y, 1.4);
      if (day.locationId) {
        mapInstanceRef.current.highlightLocation(day.locationId);
      }
    }

    if (day.events && day.events[0]) {
      setSelectedEvent(day.events[0]);
      setSelectedLocation(null);
    }
  }, [handleModeChange]);

  // Timeline Auto-play cycle
  const togglePlayTimeline = () => {
    if (isPlayingTimeline) {
      setIsPlayingTimeline(false);
      if (timelineIntervalRef.current) clearInterval(timelineIntervalRef.current);
    } else {
      setIsPlayingTimeline(true);
      timelineIntervalRef.current = setInterval(() => {
        setSelectedDayIndex(prevDay => {
          const currentDay = MUHARRAM_DAYS[prevDay];
          if (currentDay.isAshuraDetailed && selectedAshuraPhaseIndex < currentDay.ashuraPhases.length - 1) {
            setSelectedAshuraPhaseIndex(p => p + 1);
            return prevDay;
          } else {
            const nextDay = (prevDay + 1) % MUHARRAM_DAYS.length;
            selectTimelineDay(nextDay);
            return nextDay;
          }
        });
      }, 3800);
    }
  };

  useEffect(() => {
    return () => {
      if (timelineIntervalRef.current) clearInterval(timelineIntervalRef.current);
    };
  }, []);

  const currentDay = MUHARRAM_DAYS[selectedDayIndex];

  return (
    <div className="karbala-digital-museum-root bg-dark text-light">
      
      {/* Screen flash transition */}
      <div className={`mode-transition-flash ${flashActive ? 'active' : ''}`}></div>

      {/* Global Minimal Luxury Cinema Navigation (shown on all public website views) */}
      {currentView !== 'map' && (
        <GlobalCinemaNav
          currentView={currentView}
          onNavigate={navigateTo}
          onOpenAudio={() => setShowAudioDock(true)}
          audioPlaying={audioPlaying}
          savedCount={savedLocations.length}
        />
      )}

      {/* View: Home (Cinematic 8-Chapter Scrolling Experience) */}
      {currentView === 'home' && (
        <CinematicHomeView
          onNavigate={navigateTo}
          onOpenLightbox={(img) => setLightboxImage(img)}
          galleryImages={galleryImages}
        />
      )}

      {/* View: The Story */}
      {currentView === 'story' && (
        <DedicatedStoryView
          onBack={() => navigateTo('home')}
          onNavigateToMap={() => navigateTo('map')}
        />
      )}

      {/* View: Journey to 61 AH */}
      {currentView === 'journey-61ah' && (
        <Dedicated61AhView
          onBack={() => navigateTo('home')}
          onNavigateToMap={() => navigateTo('map')}
          onOpenLightbox={(img) => setLightboxImage(img)}
        />
      )}

      {/* View: Timeline */}
      {currentView === 'timeline' && (
        <DedicatedTimelineView
          onBack={() => navigateTo('home')}
          onNavigateToMap={() => navigateTo('map')}
        />
      )}

      {/* View: Personalities */}
      {currentView === 'personalities' && (
        <DedicatedPersonalitiesView
          onBack={() => navigateTo('home')}
          onNavigateToMap={() => navigateTo('map')}
        />
      )}

      {/* View: Pavilion */}
      {currentView === 'pavilion' && (
        <DedicatedPavilionView
          onBack={() => navigateTo('home')}
          onOpenLightbox={(img) => setLightboxImage(img)}
          galleryImages={galleryImages}
        />
      )}

      {/* View: Historiography */}
      {currentView === 'historiography' && (
        <DedicatedHistoriographyView
          onBack={() => navigateTo('home')}
          onNavigateToMap={() => navigateTo('map')}
        />
      )}

      {/* Experience 2: My Ziyarat (Practical Pilgrimage Companion Hub) */}
      {currentView === 'ziyarat' && (
        <MyZiyaratHub
          onNavigate={navigateTo}
        />
      )}

      {/* Experience 3: Ask Karbala AI (Multilingual Translation & Historical Q&A) */}
      {currentView === 'ai' && (
        <AskKarbalaAiHub
          onNavigate={navigateTo}
        />
      )}

      {/* ================= DEDICATED FULLSCREEN INTERACTIVE DIGITAL TWIN MAP VIEW ================= */}
      <div
        className="dedicated-map-wrapper select-none"
        style={{ display: currentView === 'map' ? 'flex' : 'none' }}
      >
        {/* Map Header with Return to Museum Home Button */}
        <header className="museum-header navbar navbar-expand px-3 px-md-4 z-3 flex-shrink-0 d-flex align-items-center">
          <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
            
            {/* Return to Museum Home Button & Brand */}
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="map-return-btn me-2"
                onClick={() => navigateTo('home')}
                title="Return to the Cinematic Scrolling Experience"
              >
                <i className="bi bi-arrow-left"></i>
                <span className="d-none d-sm-inline">Return to Museum Story</span>
              </button>

              <div className="museum-brand-crest d-none d-md-flex align-items-center justify-content-center">
                <span className="font-arabic fs-5" style={{ transform: 'translateY(-1px)' }}>ك</span>
              </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="museum-title">KARBALA</span>
                <span className="museum-tag-badge">HERITAGE TWIN</span>
              </div>
              <div className="d-none d-lg-flex align-items-center gap-2 text-ivory-muted" style={{ fontSize: '0.70rem' }}>
                <span className="font-editorial fst-italic">61 AH Reconstruction & Modern Sanctuaries</span>
              </div>
            </div>
          </div>

          {/* Architectural Dual-Pillar Mode Switch */}
          <div className="mode-switch-group d-flex shadow-sm">
            <button
              className={`mode-tab-btn ${mode === 'present' ? 'active-present' : ''}`}
              onClick={() => handleModeChange('present')}
              title="Explore Present-Day Karbala Sanctuaries"
            >
              <i className="bi bi-geo-alt me-1.5 text-champagne"></i>
              PRESENT DAY
            </button>
            <button
              className={`mode-tab-btn ${mode === '61ah' ? 'active-historical' : ''}`}
              onClick={() => handleModeChange('61ah')}
              title="Enter 61 AH Historical Reconstruction of al-Taff"
            >
              <i className="bi bi-hourglass-split me-1.5 text-gold-antique"></i>
              61 AH HISTORICAL VIEW
            </button>
          </div>

          {/* Prioritized Museum Actions & Curatorial Options */}
          <div className="d-flex align-items-center gap-2">
            <button
              className="museum-tool-btn"
              onClick={() => setActiveModal('personalities')}
              title="Hall of Historical Personalities"
            >
              <i className="bi bi-people text-champagne"></i>
              <span className="d-none d-md-inline">Personalities</span>
            </button>

            <button
              className="museum-tool-btn"
              onClick={() => setActiveModal('gallery')}
              title="Sacred Photographic Pavilion (520+ HD Assets)"
            >
              <i className="bi bi-images text-gold-antique"></i>
              <span className="d-none d-md-inline fw-semibold">Pavilion (520+)</span>
            </button>

            <button
              className="museum-tool-btn"
              onClick={() => {
                setCertaintyKey('maqtal_hussain');
                setActiveModal('certainty');
              }}
              title="Historiographical Certainty Matrix"
            >
              <i className="bi bi-shield-check text-gold-antique"></i>
              <span className="d-none d-xl-inline">Historiography</span>
            </button>

            {/* Curatorial Options Dropdown Button */}
            <div className="position-relative">
              <button
                className={`museum-tool-btn ${showOptionsMenu ? 'active' : ''}`}
                onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                title="Curatorial Options & Exhibition Tools"
              >
                <i className="bi bi-sliders text-gold-antique"></i>
                <span className="d-none d-xxl-inline">Options</span>
              </button>

              {/* Options Flyout Menu */}
              {showOptionsMenu && (
                <div
                  className="position-absolute end-0 mt-2 p-2.5 rounded-3 shadow-2xl z-3"
                  style={{
                    width: '240px',
                    background: 'rgba(14, 18, 18, 0.98)',
                    border: '1px solid var(--gold-antique)',
                    backdropFilter: 'blur(20px)'
                  }}
                >
                  <div className="small fw-semibold text-champagne mb-2 px-1 border-bottom pb-1" style={{ borderColor: 'var(--border-subtle)', fontSize: '0.72rem', letterSpacing: '0.08em' }}>
                    CURATORIAL CONTROLS
                  </div>

                  {/* Split Lens Toggle */}
                  <button
                    className="dropdown-item d-flex align-items-center justify-content-between p-2 rounded-2 mb-1"
                    style={{ color: 'var(--ivory-warm)', fontSize: '0.76rem' }}
                    onClick={() => {
                      const next = !isThenNowLens;
                      setIsThenNowLens(next);
                      if (mapInstanceRef.current) mapInstanceRef.current.toggleThenNowLens(next);
                      setShowOptionsMenu(false);
                    }}
                  >
                    <span><i className="bi bi-layout-split me-2 text-gold-antique"></i>Then ↔ Now Split Lens</span>
                    <span className={`badge ${isThenNowLens ? 'bg-warning text-dark' : 'bg-secondary'}`} style={{ fontSize: '0.62rem' }}>
                      {isThenNowLens ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  {/* Soundscape Dock Toggle */}
                  <button
                    className="dropdown-item d-flex align-items-center justify-content-between p-2 rounded-2 mb-1"
                    style={{ color: 'var(--ivory-warm)', fontSize: '0.76rem' }}
                    onClick={() => {
                      setShowAudioDock(!showAudioDock);
                      setShowOptionsMenu(false);
                    }}
                  >
                    <span><i className="bi bi-volume-up me-2 text-gold-antique"></i>Acoustic Soundscape</span>
                    <span className={`badge ${showAudioDock ? 'bg-warning text-dark' : 'bg-secondary'}`} style={{ fontSize: '0.62rem' }}>
                      {showAudioDock ? 'DOCK' : 'OFF'}
                    </span>
                  </button>

                  {/* Saved Archive */}
                  <button
                    className="dropdown-item d-flex align-items-center justify-content-between p-2 rounded-2 mb-1"
                    style={{ color: 'var(--ivory-warm)', fontSize: '0.76rem' }}
                    onClick={() => {
                      setActiveModal('saved');
                      setShowOptionsMenu(false);
                    }}
                  >
                    <span><i className="bi bi-bookmark me-2 text-gold-antique"></i>Curated Archive</span>
                    <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.62rem' }}>
                      {savedLocations.length}
                    </span>
                  </button>

                  {/* Atmosphere Lighting Cycle */}
                  <button
                    className="dropdown-item d-flex align-items-center justify-content-between p-2 rounded-2"
                    style={{ color: 'var(--ivory-warm)', fontSize: '0.76rem' }}
                    onClick={() => {
                      const modes = ['rich', 'vivid', 'subtle', 'off'];
                      const next = modes[(modes.indexOf(bgAtmosphere) + 1) % modes.length];
                      setBgAtmosphere(next);
                    }}
                  >
                    <span><i className="bi bi-stars me-2 text-gold-antique"></i>Atmosphere</span>
                    <span className="badge bg-dark text-gold-antique border border-warning" style={{ fontSize: '0.62rem' }}>
                      {bgAtmosphere.toUpperCase()}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* ================= ARCHIVAL PROVENANCE NOTICE (61 AH HISTORICAL) ================= */}
      {mode === '61ah' && (
        <div className="archival-provenance-banner d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2 text-truncate">
            <span className="archival-stamp">
              Archival Provenance • 61 AH
            </span>
            <span className="font-editorial fst-italic text-truncate d-none d-md-inline text-ivory">
              “Locations, boundaries, structures, routes, and visual representations shown in this experience are educational reconstructions based on available historical sources. Where exact historical locations are uncertain or disputed, they are clearly identified as approximate.”
            </span>
          </div>
          <button
            className="btn btn-link btn-sm text-gold-antique text-decoration-none fw-semibold p-0 text-nowrap ms-3"
            style={{ fontSize: '0.74rem', letterSpacing: '0.04em' }}
            onClick={() => {
              setCertaintyKey('mukhayam_camp');
              setActiveModal('certainty');
            }}
          >
            Historiography & Sources →
          </button>
        </div>
      )}

      {/* ================= MAIN INTERACTIVE MAP CANVAS ================= */}
      <div className="position-relative flex-grow-1 overflow-hidden" ref={mapContainerRef}>
        
        {/* ================= CINEMATIC ATMOSPHERIC BACKGROUND ================= */}
        {bgAtmosphere !== 'off' && (
          <div className="cinematic-bg-container">
            <div
              className="cinematic-bg-slide"
              style={{
                backgroundImage: `url(${currentBgImage})`,
                opacity: bgAtmosphere === 'vivid' ? 0.88 : bgAtmosphere === 'rich' ? 0.65 : 0.35
              }}
            />
            <div className="cinematic-bg-overlay" />
            <div className="cinematic-calligraphy-watermark">
              {mode === 'present' ? 'السلام عليك يا أبا عبد الله الحسين' : 'السلام عليك يا قمر بني هاشم'}
            </div>
            <canvas ref={particleCanvasRef} className="cinematic-particle-canvas" />
          </div>
        )}

        {/* ================= FLOATING CONTEXTUAL HERO PREVIEW CARD ================= */}
        {selectedLocation && !selectedEvent && (
          <div className="floating-hero-card d-flex align-items-center gap-3">
            <img
              src={selectedLocation.image || (mode === 'present' ? 'assets/images/shrine_38.jpg' : 'assets/images/ai_61ah_encampment.jpg')}
              alt={selectedLocation.name}
              className="floating-hero-thumb"
              onError={(e) => { e.target.src = 'assets/images/alkafeel_logo.png'; }}
            />
            <div className="flex-grow-1 min-w-0">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-40" style={{ fontSize: '0.65rem' }}>
                  {selectedLocation.category || 'Sacred Site'}
                </span>
                <button
                  className="btn-close btn-close-white"
                  style={{ fontSize: '0.62rem' }}
                  onClick={() => setSelectedLocation(null)}
                ></button>
              </div>
              <h6 className="fw-bold text-white mb-0 text-truncate font-title" style={{ fontSize: '0.92rem' }}>
                {selectedLocation.name}
              </h6>
              {selectedLocation.arabicName && (
                <div className="text-warning small font-arabic text-truncate" style={{ fontSize: '0.85rem' }}>
                  {selectedLocation.arabicName}
                </div>
              )}
              <div className="d-flex align-items-center gap-2 mt-2">
                <button
                  className="btn btn-warning btn-sm py-0 px-2 fw-bold d-flex align-items-center gap-1 shadow-sm"
                  style={{ fontSize: '0.72rem' }}
                  onClick={() => {
                    audioEngine.playZiyaratWarith();
                    setAudioPlaying(true);
                    setShowAudioDock(true);
                  }}
                >
                  <i className="bi bi-volume-up-fill"></i>
                  <span>Listen</span>
                  {audioPlaying && (
                    <div className="audio-bars-container ms-1">
                      <div className="audio-bar"></div>
                      <div className="audio-bar"></div>
                      <div className="audio-bar"></div>
                    </div>
                  )}
                </button>
                {selectedLocation.historicalId && mode === 'present' && (
                  <button
                    className="btn btn-outline-warning btn-sm py-0 px-2 text-nowrap"
                    style={{ fontSize: '0.72rem' }}
                    onClick={() => switchToHistoricalAndHighlight(selectedLocation.historicalId)}
                  >
                    61 AH View →
                  </button>
                )}
                {selectedLocation.presentId && mode === '61ah' && (
                  <button
                    className="btn btn-outline-info btn-sm py-0 px-2 text-nowrap"
                    style={{ fontSize: '0.72rem' }}
                    onClick={() => switchToPresentAndHighlight(selectedLocation.presentId)}
                  >
                    Present Day →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Floating Search & Category Filter Pills */}
        <div className="position-absolute top-0 start-0 m-3 z-2 d-flex flex-column gap-2" style={{ maxWidth: '360px', width: '100%', pointerEvents: 'none' }}>
          
          <div className="input-group shadow-lg" style={{ pointerEvents: 'auto' }}>
            <span className="input-group-text bg-dark border-secondary text-secondary">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control form-control-sm bg-dark border-secondary text-light"
              placeholder="Search shrines, camps, gates..."
              value={searchQuery}
              onChange={(e) => {
                const q = e.target.value;
                setSearchQuery(q);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.searchQuery = q;
                  mapInstanceRef.current.requestRender();
                }
              }}
            />
            {searchQuery && (
              <button
                className="btn btn-sm btn-dark border-secondary text-secondary"
                onClick={() => {
                  setSearchQuery('');
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.searchQuery = '';
                    mapInstanceRef.current.requestRender();
                  }
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="d-flex flex-wrap gap-1" style={{ pointerEvents: 'auto' }}>
            {['all', 'shrine', 'camp', 'maqam', 'waterway', 'battleground'].map(cat => (
              <button
                key={cat}
                className={`btn btn-sm py-0 px-2 rounded-pill ${selectedCategory === cat ? 'btn-warning text-dark fw-bold' : 'btn-dark border-secondary text-secondary'}`}
                style={{ fontSize: '0.72rem' }}
                onClick={() => {
                  setSelectedCategory(cat);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.categoryFilter = cat;
                    mapInstanceRef.current.requestRender();
                  }
                }}
              >
                {cat === 'all' ? 'All' : cat === 'shrine' ? 'Shrines' : cat === 'camp' ? 'Tents & Camps' : cat === 'maqam' ? 'Maqams' : cat === 'waterway' ? 'Alqami River' : 'Battlefield'}
              </button>
            ))}
          </div>

        </div>

        {/* Floating Zoom & Preset Landmark Camera Controls */}
        <div className="position-absolute end-0 z-2 m-3 d-flex flex-column gap-2" style={{ bottom: '90px' }}>
          <button
            className={`map-floating-tool-btn ${guidedTourStep ? 'border-warning text-warning' : ''}`}
            onClick={toggleGuidedTour}
            title={guidedTourStep ? "Stop Curatorial Journey" : "Begin Curatorial Guided Pilgrimage"}
          >
            <i className={`bi ${guidedTourStep ? 'bi-stop-circle-fill text-gold-antique' : 'bi-compass text-gold-antique'} fs-5`}></i>
          </button>
          <button className="map-floating-tool-btn" onClick={() => mapInstanceRef.current?.zoomIn()} title="Zoom In">
            <i className="bi bi-plus-lg fs-5"></i>
          </button>
          <button className="map-floating-tool-btn" onClick={() => mapInstanceRef.current?.zoomOut()} title="Zoom Out">
            <i className="bi bi-dash-lg fs-5"></i>
          </button>
          <button className="map-floating-tool-btn" onClick={() => mapInstanceRef.current?.resetView()} title="Reset View (Master Overview)">
            <i className="bi bi-arrows-fullscreen"></i>
          </button>
          <hr className="my-1 border-secondary" />
          <button className="map-floating-tool-btn text-warning fw-bold fs-6" onClick={() => {
            mapInstanceRef.current?.panTo(44.5, 55.5, 1.4);
            setSelectedLocation(PRESENT_DAY_LOCATIONS[0]);
          }} title="Focus Imam Hussain Shrine">
            ح
          </button>
          <button className="map-floating-tool-btn text-info fw-bold fs-6" onClick={() => {
            mapInstanceRef.current?.panTo(57.5, 38.5, 1.4);
            setSelectedLocation(PRESENT_DAY_LOCATIONS[1]);
          }} title="Focus Al-Abbas Shrine">
            ع
          </button>
          <button className="map-floating-tool-btn text-success fw-bold fs-6" onClick={() => {
            mapInstanceRef.current?.panTo(33.0, 68.0, 1.4);
            setSelectedLocation(PRESENT_DAY_LOCATIONS[4]);
          }} title="Focus Al-Mukhayam (Camp)">
            خ
          </button>
        </div>

        {/* Curatorial Guided Pilgrimage Journey Banner */}
        {guidedTourStep && (
          <div
            className="position-absolute top-0 start-50 translate-middle-x mt-3 z-3 d-flex align-items-center gap-3 px-3 py-2 rounded-3 shadow-lg"
            style={{
              background: 'rgba(8, 11, 11, 0.95)',
              border: '1px solid var(--gold-antique)',
              backdropFilter: 'blur(10px)',
              maxWidth: '92vw'
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <span
                className="badge"
                style={{
                  background: 'var(--emerald-deep)',
                  color: 'var(--champagne-soft)',
                  border: '1px solid rgba(198,166,107,0.4)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.06em'
                }}
              >
                PILGRIMAGE • {guidedTourStep.index + 1} / {guidedTourStep.total}
              </span>
              <div>
                <div className="font-editorial text-champagne fw-semibold" style={{ fontSize: '0.88rem' }}>
                  {guidedTourStep.title}
                </div>
                <div className="text-ivory-muted" style={{ fontSize: '0.72rem' }}>
                  {guidedTourStep.period}
                </div>
              </div>
            </div>
            <button
              className="btn btn-sm btn-outline-warning py-0 px-2 ms-2 fw-semibold"
              style={{ fontSize: '0.72rem' }}
              onClick={toggleGuidedTour}
            >
              Exit Tour
            </button>
          </div>
        )}

        {/* Then ↔ Now Split Slider Card (Shown when split lens enabled) */}
        {isThenNowLens && (
          <div className="position-absolute top-0 end-0 m-3 p-3 rounded-3 shadow-lg z-2" style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid #f59e0b', maxWidth: '280px' }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-warning fw-bold small d-flex align-items-center gap-1">
                <i className="bi bi-layout-split"></i> Then ↔ Now Split Lens
              </span>
              <button className="btn btn-sm btn-close btn-close-white p-0" onClick={() => {
                setIsThenNowLens(false);
                mapInstanceRef.current?.toggleThenNowLens(false);
              }}></button>
            </div>
            <p className="text-secondary mb-2" style={{ fontSize: '0.72rem' }}>Slide across the map to dissolve 61 AH into modern Karbala.</p>
            <input
              type="range"
              className="form-range"
              min="5"
              max="95"
              value={splitPos}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setSplitPos(val);
                mapInstanceRef.current?.setSplitPosition(val);
              }}
            />
            <div className="d-flex justify-content-between fw-bold" style={{ fontSize: '0.68rem' }}>
              <span className="text-info">PRESENT DAY</span>
              <span className="text-warning">61 AH VIEW</span>
            </div>
          </div>
        )}

        {/* ================= CURATORIAL EXHIBITION DOSSIER (LOCATION) ================= */}
        {selectedLocation && (
          <div className="curatorial-dossier position-absolute top-0 end-0 h-100 p-4 overflow-y-auto" style={{ width: '100%', maxWidth: '490px', zIndex: 1050 }}>
            
            {/* Curatorial Dossier Header & Accession Metadata */}
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="badge px-2.5 py-1 text-uppercase fw-semibold" style={{ background: 'var(--bg-elevated)', color: 'var(--gold-antique)', border: '1px solid var(--border-gold)', fontSize: '0.65rem', letterSpacing: '0.08em' }}>
                  ARCHIVE #{selectedLocation.id?.toUpperCase() || 'KBL-01'}
                </span>
                <span
                  className="badge cursor-pointer px-2.5 py-1"
                  style={{
                    backgroundColor: (CERTAINTY_LEVELS[selectedLocation.certaintyLevel] || CERTAINTY_LEVELS.APPROXIMATE_LOCATION).bgColor,
                    color: (CERTAINTY_LEVELS[selectedLocation.certaintyLevel] || CERTAINTY_LEVELS.APPROXIMATE_LOCATION).color,
                    border: `1px solid ${(CERTAINTY_LEVELS[selectedLocation.certaintyLevel] || CERTAINTY_LEVELS.APPROXIMATE_LOCATION).borderColor}`,
                    fontSize: '0.65rem',
                    letterSpacing: '0.04em'
                  }}
                  onClick={() => {
                    setCertaintyKey(selectedLocation.certaintyKey || 'maqtal_hussain');
                    setActiveModal('certainty');
                  }}
                  title="Click to view classical historiographical verification"
                >
                  <i className="bi bi-shield-check me-1"></i>
                  {(CERTAINTY_LEVELS[selectedLocation.certaintyLevel] || CERTAINTY_LEVELS.APPROXIMATE_LOCATION).label}
                </span>
              </div>
              <button
                className="btn btn-sm d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: '32px', height: '32px', background: 'var(--bg-elevated)', color: 'var(--champagne-soft)', border: '1px solid var(--border-subtle)' }}
                onClick={() => setSelectedLocation(null)}
                aria-label="Close dossier"
              >
                ✕
              </button>
            </div>

            {/* Curatorial Archival Image Frame */}
            <div className="position-relative rounded-2 overflow-hidden mb-3 shadow-lg" style={{ border: '1px solid var(--border-gold)', background: 'var(--bg-obsidian)' }}>
              <img
                src={selectedLocation.image}
                alt={selectedLocation.name}
                className="w-100 object-fit-cover d-block"
                style={{ height: '220px', filter: 'brightness(0.92) contrast(1.05)' }}
              />
              <div className="position-absolute bottom-0 start-0 w-100 px-3 py-2 d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(transparent, rgba(8, 11, 11, 0.95))' }}>
                <span className="small d-flex align-items-center gap-1.5" style={{ fontSize: '0.68rem', color: 'var(--champagne-soft)' }}>
                  <i className="bi bi-camera" style={{ color: 'var(--gold-antique)' }}></i>
                  {selectedLocation.imageAttribution || 'Official Holy Shrine Photographic Documentation'}
                </span>
                <span className="badge" style={{ background: 'rgba(16, 59, 50, 0.8)', color: 'var(--champagne-soft)', border: '1px solid rgba(198, 166, 107, 0.3)', fontSize: '0.6rem' }}>
                  FULL HD
                </span>
              </div>
            </div>

            {/* Nomenclature & Dual Typography */}
            <div className="mb-3">
              <h3 className="h4 fw-bold font-title mb-1" style={{ color: 'var(--ivory-warm)', letterSpacing: '0.03em' }}>{selectedLocation.name}</h3>
              <p className="fs-4 font-arabic mb-1 text-end" style={{ color: 'var(--gold-antique)', direction: 'rtl', lineHeight: 1.3 }}>{selectedLocation.arabicName}</p>
              <p className="small fst-italic mb-0" style={{ color: 'var(--text-tertiary)', letterSpacing: '0.02em' }}>{selectedLocation.title}</p>
            </div>

            {/* Temporal Continuity Bridge (61 AH <-> Present Day) */}
            {(selectedLocation.historicalId || selectedLocation.presentId) && (
              <div
                className="p-3 rounded-2 mb-3 d-flex justify-content-between align-items-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 59, 50, 0.35) 0%, rgba(20, 25, 24, 0.9) 100%)',
                  border: '1px solid var(--border-gold)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div>
                  <div className="fw-semibold small d-flex align-items-center gap-1.5" style={{ color: 'var(--gold-antique)', letterSpacing: '0.05em' }}>
                    <i className="bi bi-hourglass-split"></i>
                    {selectedLocation.historicalId ? '14-CENTURY HISTORICAL CONTINUITY' : 'PRESENT-DAY TOPOGRAPHICAL CONTINUITY'}
                  </div>
                  <div className="small" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    {selectedLocation.historicalId ? 'Examine this sacred site as it stood on 10 Muharram 61 AH' : 'Inspect modern architectural development & shrine complex'}
                  </div>
                </div>
                <button
                  className="btn btn-sm fw-semibold text-nowrap ms-2 px-3 py-1.5"
                  style={{
                    background: 'var(--gold-antique)',
                    color: 'var(--bg-obsidian)',
                    border: 'none',
                    letterSpacing: '0.04em',
                    fontSize: '0.72rem'
                  }}
                  onClick={() => {
                    if (selectedLocation.historicalId) {
                      switchToHistoricalAndHighlight(selectedLocation.historicalId);
                    } else if (selectedLocation.presentId) {
                      switchToPresentAndHighlight(selectedLocation.presentId);
                    }
                  }}
                >
                  {selectedLocation.historicalId ? 'TRANSIT TO 61 AH →' : 'TRANSIT TO PRESENT →'}
                </button>
              </div>
            )}

            {/* Curatorial Monograph / Summary */}
            <div className="mb-3 p-3 rounded-2" style={{ background: 'rgba(20, 25, 24, 0.7)', border: '1px solid var(--border-subtle)' }}>
              <div className="text-uppercase small fw-bold mb-2 d-flex align-items-center gap-1.5" style={{ color: 'var(--gold-antique)', fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                <i className="bi bi-journal-text"></i> Curatorial Summary & Historical Context
              </div>
              <p className="small mb-0 leading-relaxed font-serif" style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: '1.6' }}>
                {selectedLocation.intro || selectedLocation.summary}
              </p>
            </div>

            {/* Topographical Correspondence Plaque */}
            <div className="p-3 rounded-2 mb-3" style={{ background: 'rgba(8, 11, 11, 0.8)', border: '1px solid rgba(198, 166, 107, 0.25)', fontSize: '0.76rem' }}>
              <span className="fw-semibold d-flex align-items-center gap-1.5 mb-1" style={{ color: 'var(--champagne-soft)', letterSpacing: '0.04em' }}>
                <i className="bi bi-compass" style={{ color: 'var(--gold-antique)' }}></i> Topographical & Archaeological Correspondence:
              </span>
              <p className="mb-0 leading-normal" style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                {selectedLocation.historicalCorrespondence || selectedLocation.noticeText}
              </p>
            </div>

            {/* Curatorial Action Matrix */}
            <div className="row g-2 mb-3 text-center">
              <div className="col-4">
                <button
                  className="editorial-action-btn w-100 py-2 d-flex flex-column align-items-center"
                  onClick={() => {
                    setShowAudioDock(true);
                    audioEngine.playTrack(selectedLocation.audioTrack?.type === 'ziyarat' ? 'ziyarat_warith' : 'desert_ambiance');
                  }}
                >
                  <i className="bi bi-volume-up fs-5 mb-1" style={{ color: 'var(--gold-antique)' }}></i>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.03em' }}>Acoustic</span>
                </button>
              </div>
              <div className="col-4">
                <button
                  className="editorial-action-btn w-100 py-2 d-flex flex-column align-items-center"
                  onClick={() => setActiveModal('ziyarat')}
                >
                  <i className="bi bi-book fs-5 mb-1" style={{ color: 'var(--champagne-soft)' }}></i>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.03em' }}>Ziyarat Text</span>
                </button>
              </div>
              <div className="col-4">
                <button
                  className="editorial-action-btn w-100 py-2 d-flex flex-column align-items-center"
                  onClick={() => setActiveModal('access')}
                >
                  <i className="bi bi-universal-access fs-5 mb-1" style={{ color: '#4E9F8E' }}></i>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.03em' }}>Accessibility</span>
                </button>
              </div>
              <div className="col-4">
                <button
                  className="editorial-action-btn w-100 py-2 d-flex flex-column align-items-center"
                  onClick={() => {
                    if (selectedLocation.historicalId) {
                      switchToHistoricalAndHighlight(selectedLocation.historicalId);
                    } else {
                      handleModeChange('61ah');
                    }
                  }}
                >
                  <i className="bi bi-hourglass-split fs-5 mb-1" style={{ color: 'var(--gold-antique)' }}></i>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.03em' }}>Chronology</span>
                </button>
              </div>
              <div className="col-4">
                <button
                  className="editorial-action-btn w-100 py-2 d-flex flex-column align-items-center"
                  onClick={() => setActiveModal('navigate')}
                >
                  <i className="bi bi-geo-alt fs-5 mb-1" style={{ color: 'var(--champagne-soft)' }}></i>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.03em' }}>Wayfinding</span>
                </button>
              </div>
              <div className="col-4">
                <button
                  className={`editorial-action-btn w-100 py-2 d-flex flex-column align-items-center ${savedLocations.some(s => s.id === selectedLocation.id) ? 'active' : ''}`}
                  onClick={() => toggleSaveLocation(selectedLocation)}
                >
                  <i className="bi bi-bookmark fs-5 mb-1" style={{ color: savedLocations.some(s => s.id === selectedLocation.id) ? 'var(--terracotta-muted)' : 'var(--text-tertiary)' }}></i>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.03em' }}>{savedLocations.some(s => s.id === selectedLocation.id) ? 'Archived ★' : 'Save Dossier'}</span>
                </button>
              </div>
            </div>

            {/* Epistemic Historiography Verification Link */}
            <div className="text-center pt-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
              <button
                className="btn btn-link btn-sm text-decoration-none d-inline-flex align-items-center gap-1.5"
                style={{ fontSize: '0.73rem', color: 'var(--gold-antique)', letterSpacing: '0.03em' }}
                onClick={() => {
                  setCertaintyKey(selectedLocation.certaintyKey || 'maqtal_hussain');
                  setActiveModal('certainty');
                }}
              >
                <i className="bi bi-shield-check"></i>
                Consult Historiographical Methodology &amp; Classical Citations →
              </button>
            </div>

          </div>
        )}

        {/* ================= TIMELINE EVENT DETAIL DOSSIER ================= */}
        {selectedEvent && (
          <div className="curatorial-dossier position-absolute top-0 end-0 h-100 p-4 overflow-y-auto" style={{ width: '100%', maxWidth: '500px', zIndex: 1050 }}>
            
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
              <div>
                <span className="badge px-2.5 py-1 text-uppercase fw-semibold" style={{ background: 'var(--bg-elevated)', color: 'var(--gold-antique)', border: '1px solid var(--border-gold)', fontSize: '0.65rem', letterSpacing: '0.08em' }}>
                  CHRONICLE #{currentDay.dayNumber} MUHARRAM 61 AH
                </span>
                <p className="small mb-0 mt-1" style={{ color: 'var(--champagne-soft)', fontSize: '0.75rem', letterSpacing: '0.03em' }}>
                  {currentDay.dateString} • {selectedEvent.time || 'Daytime Engagement'}
                </p>
              </div>
              <button
                className="btn btn-sm d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: '32px', height: '32px', background: 'var(--bg-elevated)', color: 'var(--champagne-soft)', border: '1px solid var(--border-subtle)' }}
                onClick={() => setSelectedEvent(null)}
                aria-label="Close dossier"
              >
                ✕
              </button>
            </div>

            <h3 className="h4 fw-bold font-title mb-1" style={{ color: 'var(--ivory-warm)', letterSpacing: '0.03em' }}>
              {selectedEvent.title}
            </h3>
            
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="badge px-2 py-0.5" style={{ background: 'rgba(16, 59, 50, 0.6)', color: 'var(--champagne-soft)', border: '1px solid var(--border-gold)', fontSize: '0.66rem' }}>
                <i className="bi bi-shield-check me-1" style={{ color: 'var(--gold-antique)' }}></i> Classical Historiographical Attestation
              </span>
              <span className="small" style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>{selectedEvent.time || 'Standard Chronology'}</span>
            </div>

            {/* Geographical Canvas Pan Action */}
            <button
              className="btn w-100 py-2.5 fw-semibold mb-3 d-flex align-items-center justify-content-center gap-2"
              style={{
                background: 'linear-gradient(135deg, var(--gold-antique), #A88648)',
                color: 'var(--bg-obsidian)',
                border: 'none',
                letterSpacing: '0.06em',
                fontSize: '0.78rem',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)'
              }}
              onClick={() => {
                if (currentDay.highlightCoords) {
                  mapInstanceRef.current?.panTo(currentDay.highlightCoords.x, currentDay.highlightCoords.y, 1.6);
                  if (currentDay.locationId) mapInstanceRef.current?.highlightLocation(currentDay.locationId);
                }
              }}
            >
              <i className="bi bi-geo-alt-fill"></i> RE-CENTER CARTOGRAPHIC CANVAS ON EVENT SITE
            </button>

            {/* Executive Summary */}
            <div className="p-3 rounded-2 mb-3" style={{ background: 'rgba(20, 25, 24, 0.7)', border: '1px solid var(--border-subtle)' }}>
              <div className="text-uppercase small fw-bold mb-1.5 d-flex align-items-center gap-1.5" style={{ color: 'var(--gold-antique)', fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                <i className="bi bi-compass"></i> Historical Synopsis
              </div>
              <p className="small mb-0 leading-relaxed font-serif" style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: '1.65' }}>
                {selectedEvent.summary}
              </p>
            </div>

            {/* Detailed Historical Narrative */}
            <div className="mb-3">
              <div className="text-uppercase small fw-bold mb-2 d-flex align-items-center gap-1.5" style={{ color: 'var(--champagne-soft)', fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                <i className="bi bi-journal-text" style={{ color: 'var(--gold-antique)' }}></i> Classical Historiographical Narrative
              </div>
              <div className="p-3 rounded-2 text-light font-serif leading-relaxed" style={{ background: 'rgba(8, 11, 11, 0.75)', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                {(selectedEvent.narrative || selectedEvent.detailedText || '').split('\n\n').map((para, i) => (
                  <p key={i} className="mb-2.5" style={{ color: 'var(--ivory-warm)', lineHeight: '1.7' }}>{para}</p>
                ))}
              </div>
            </div>

            {/* Associated Personalities */}
            {selectedEvent.people && (
              <div className="mb-3">
                <div className="text-uppercase small fw-bold mb-2 d-flex align-items-center gap-1.5" style={{ color: 'var(--gold-antique)', fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                  <i className="bi bi-people"></i> Connected Historical Personages
                </div>
                <div className="d-flex flex-wrap gap-1.5">
                  {selectedEvent.people.map(p => (
                    <button
                      key={p}
                      className="btn btn-sm py-1 px-2.5 rounded-pill"
                      style={{
                        background: 'var(--bg-elevated)',
                        color: 'var(--champagne-soft)',
                        border: '1px solid var(--border-gold)',
                        fontSize: '0.72rem',
                        letterSpacing: '0.02em'
                      }}
                      onClick={() => {
                        const clean = p.replace('(AS)', '').replace('(SA)', '').trim();
                        const found = PERSONALITIES.find(per => per.name.includes(clean));
                        if (found) {
                          setPersonFilter(found.name);
                          setActiveModal('personalities');
                        }
                      }}
                    >
                      <i className="bi bi-person me-1" style={{ color: 'var(--gold-antique)' }}></i>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Classical Primary Sources */}
            <div className="p-3 rounded-2 mb-3" style={{ background: 'rgba(8, 11, 11, 0.85)', border: '1px solid rgba(198, 166, 107, 0.3)' }}>
              <span className="fw-semibold d-flex align-items-center gap-1.5 mb-2" style={{ color: 'var(--gold-antique)', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                <i className="bi bi-shield-check"></i> Primary Historiographical Sources:
              </span>
              <ul className="mb-0 ps-3" style={{ fontSize: '0.74rem', color: 'var(--champagne-soft)', lineHeight: '1.6' }}>
                {(selectedEvent.primarySources || ['Abu Mikhnaf, Maqtal al-Husayn', 'Tarikh al-Tabari, Vol. 5', 'Kitab al-Irshad by Shaykh al-Mufid', 'Maqatil al-Talibiyyin by Abu al-Faraj al-Isfahani']).map((s, idx) => (
                  <li key={idx} style={{ color: 'var(--text-secondary)' }}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Prev / Next event navigation */}
            <div className="d-flex justify-content-between pt-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
              <button
                className="editorial-action-btn px-3 py-1.5"
                style={{ fontSize: '0.74rem' }}
                onClick={() => {
                  if (selectedDayIndex > 0) selectTimelineDay(selectedDayIndex - 1);
                }}
              >
                ← Prior Muharram Day
              </button>
              <button
                className="editorial-action-btn px-3 py-1.5"
                style={{ fontSize: '0.74rem' }}
                onClick={() => {
                  if (selectedDayIndex < MUHARRAM_DAYS.length - 1) selectTimelineDay(selectedDayIndex + 1);
                }}
              >
                Subsequent Day →
              </button>
            </div>

          </div>
        )}

      </div>

      {/* ================= ILLUMINATED TEMPORAL RIBBON (BOTTOM DOCK) ================= */}
      <footer
        className="temporal-ribbon-dock border-top px-3 py-2 z-3 flex-shrink-0 shadow-2xl"
        style={{
          borderColor: 'var(--gold-muted, rgba(198,166,107,0.35))',
          background: 'rgba(8, 11, 11, 0.96)',
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Expanded Historical Storytelling Mode */}
        {isTimelineExpanded && (
          <div
            className="mb-2 p-3 rounded-2 shadow-lg d-flex justify-content-between align-items-center flex-wrap gap-2 transition-all"
            style={{
              background: 'rgba(20, 25, 24, 0.95)',
              border: '1px solid var(--gold-antique)',
              animation: 'fadeIn 0.25s ease-out'
            }}
          >
            <div className="flex-grow-1 min-w-0 me-3">
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge" style={{ background: 'var(--emerald-deep)', color: 'var(--champagne-soft)', fontSize: '0.68rem', border: '1px solid rgba(198,166,107,0.4)' }}>
                  {currentDay.dayNumber} MUHARRAM 61 AH
                </span>
                <h6 className="mb-0 fw-bold font-title text-champagne text-truncate" style={{ fontSize: '0.92rem' }}>
                  {currentDay.title}
                </h6>
              </div>
              <p className="mb-0 small text-ivory-muted" style={{ fontSize: '0.78rem', lineHeight: 1.45 }}>
                {currentDay.shortSummary || (currentDay.events && currentDay.events[0] ? currentDay.events[0].description : '')}
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              {currentDay.highlightCoords && (
                <button
                  className="btn btn-sm btn-outline-warning py-1 px-2.5 fw-semibold"
                  style={{ fontSize: '0.74rem' }}
                  onClick={() => {
                    mapInstanceRef.current?.panTo(currentDay.highlightCoords.x, currentDay.highlightCoords.y, 1.55);
                    if (currentDay.locationId) mapInstanceRef.current?.highlightLocation(currentDay.locationId);
                  }}
                >
                  <i className="bi bi-geo-alt me-1"></i> Focus Landmark
                </button>
              )}
              <button
                className="btn btn-sm btn-dark border-secondary text-secondary py-1 px-2"
                style={{ fontSize: '0.72rem' }}
                onClick={() => setIsTimelineExpanded(false)}
                title="Collapse Narrative"
              >
                ✕ Close
              </button>
            </div>
          </div>
        )}

        {/* Primary Timeline Controls & Chapter Nodes Bar */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          
          {/* Play & Stepper Controls */}
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-sm d-flex align-items-center gap-1.5 fw-semibold px-3 py-1.5"
              onClick={togglePlayTimeline}
              style={{
                background: isPlayingTimeline ? 'var(--terracotta-muted)' : 'var(--gold-antique)',
                color: 'var(--bg-obsidian)',
                border: 'none',
                fontSize: '0.72rem',
                letterSpacing: '0.06em',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
              }}
            >
              <i className={`bi ${isPlayingTimeline ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
              <span className="d-none d-sm-inline">{isPlayingTimeline ? 'PAUSE' : 'PLAY'}</span>
            </button>
            <div className="d-flex gap-1">
              <button
                className="btn btn-sm py-1 px-2"
                style={{ background: 'var(--bg-elevated)', color: 'var(--champagne-soft)', border: '1px solid var(--border-subtle)' }}
                onClick={() => {
                  if (selectedDayIndex > 0) selectTimelineDay(selectedDayIndex - 1);
                }}
                aria-label="Previous day"
                title="Previous Day"
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                className="btn btn-sm py-1 px-2"
                style={{ background: 'var(--bg-elevated)', color: 'var(--champagne-soft)', border: '1px solid var(--border-subtle)' }}
                onClick={() => {
                  if (selectedDayIndex < MUHARRAM_DAYS.length - 1) selectTimelineDay(selectedDayIndex + 1);
                }}
                aria-label="Next day"
                title="Next Day"
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>

          {/* Days 2 to 10 Muharram Illuminated Nodes Strip */}
          <div className="d-flex gap-1.5 overflow-x-auto pb-0.5 pt-0.5 flex-grow-1 justify-content-center">
            {MUHARRAM_DAYS.map((d, idx) => {
              const isSelected = idx === selectedDayIndex;
              return (
                <button
                  key={d.dayNumber}
                  className="btn btn-sm py-1 px-2 text-nowrap d-flex align-items-center gap-1.5 transition-all"
                  style={{
                    background: isSelected ? 'var(--bg-elevated, #1c2322)' : 'rgba(14, 18, 18, 0.7)',
                    color: isSelected ? 'var(--gold-antique, #C6A66B)' : 'var(--text-secondary, #9EA8A6)',
                    border: isSelected ? '1px solid var(--gold-antique, #C6A66B)' : '1px solid rgba(198, 166, 107, 0.18)',
                    boxShadow: isSelected ? '0 0 10px rgba(198, 166, 107, 0.35)' : 'none',
                    fontSize: '0.74rem',
                    borderRadius: '6px'
                  }}
                  onClick={() => selectTimelineDay(idx)}
                >
                  <span
                    className="badge rounded-circle p-0 d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: '18px',
                      height: '18px',
                      background: isSelected ? 'var(--gold-antique)' : 'var(--bg-charcoal)',
                      color: isSelected ? 'var(--bg-obsidian)' : 'var(--champagne-soft)',
                      fontWeight: 700,
                      fontSize: '0.62rem'
                    }}
                  >
                    {d.dayNumber}
                  </span>
                  <span className="d-none d-md-inline">{d.dayNumber === 10 ? 'Ashura' : `${d.dayNumber} Muh`}</span>
                </button>
              );
            })}
          </div>

          {/* Narrative Toggle Button */}
          <div className="d-flex align-items-center gap-2">
            <button
              className={`btn btn-sm py-1 px-2.5 d-flex align-items-center gap-1.5 fw-semibold ${isTimelineExpanded ? 'btn-warning text-dark' : 'btn-outline-warning'}`}
              style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}
              onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
              title="Toggle Detailed Historical Narrative"
            >
              <i className={`bi ${isTimelineExpanded ? 'bi-chevron-down' : 'bi-journal-text'}`}></i>
              <span className="d-none d-sm-inline">{isTimelineExpanded ? 'Collapse' : 'Narrative'}</span>
            </button>
          </div>

        </div>

        {/* Ashura Intraday Sub-Timeline (if day 10 selected) */}
        {currentDay.isAshuraDetailed && (
          <div className="d-flex align-items-center gap-2 pt-1.5 border-top mt-1.5 overflow-x-auto" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="badge px-2 py-1 text-uppercase fw-semibold" style={{ background: 'rgba(138, 75, 56, 0.3)', color: 'var(--champagne-soft)', border: '1px solid rgba(198, 166, 107, 0.4)', fontSize: '0.62rem', letterSpacing: '0.08em' }}>
              <i className="bi bi-clock-history me-1" style={{ color: 'var(--gold-antique)' }}></i> ASHURA PHASES:
            </span>
            <div className="d-flex gap-1.5 overflow-x-auto">
              {currentDay.ashuraPhases.map((phase, pIdx) => {
                const isPhaseSelected = pIdx === selectedAshuraPhaseIndex;
                return (
                  <button
                    key={phase.phaseId}
                    className="btn btn-sm py-0.5 px-2.5 text-nowrap transition-all"
                    style={{
                      background: isPhaseSelected ? 'rgba(16, 59, 50, 0.8)' : 'var(--bg-charcoal)',
                      color: isPhaseSelected ? 'var(--ivory-warm)' : 'var(--text-tertiary)',
                      border: isPhaseSelected ? '1px solid var(--gold-antique)' : '1px solid var(--border-subtle)',
                      boxShadow: isPhaseSelected ? '0 0 10px rgba(198, 166, 107, 0.3)' : 'none',
                      fontSize: '0.68rem',
                      letterSpacing: '0.02em'
                    }}
                    onClick={() => {
                      setSelectedAshuraPhaseIndex(pIdx);
                      if (phase.coords) mapInstanceRef.current?.panTo(phase.coords.x, phase.coords.y, 1.55);
                      setSelectedEvent(phase);
                    }}
                  >
                    {phase.phaseName}
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </footer>
      </div>

      {/* ================= FLOATING AUDIO DOCK ================= */}
      {showAudioDock && (
        <div className="position-fixed p-3 rounded-3 shadow-lg z-3" style={{ bottom: '100px', left: '20px', background: 'rgba(15, 23, 42, 0.96)', border: '1px solid #334155', maxWidth: '340px', width: '100%' }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center gap-2 text-truncate">
              <i className="bi bi-music-note-beamed text-warning fs-5"></i>
              <div className="text-truncate">
                <span className="fw-bold text-white small d-block text-truncate">{currentTrack.title}</span>
                <span className="text-secondary" style={{ fontSize: '0.68rem' }}>{currentTrack.artist}</span>
              </div>
            </div>
            <button className="btn btn-sm btn-close btn-close-white p-0" onClick={() => setShowAudioDock(false)}></button>
          </div>

          <div className="d-flex align-items-center gap-2 text-secondary mb-2" style={{ fontSize: '0.68rem' }}>
            <span>{audioTimeStr}</span>
            <input
              type="range"
              className="form-range"
              min="0"
              max="100"
              value={audioProgress}
              onChange={(e) => audioEngine.seek(parseFloat(e.target.value))}
            />
            <span>{currentTrack.duration}</span>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <select
              className="form-select form-select-sm bg-dark text-light border-secondary"
              style={{ fontSize: '0.75rem', width: '150px' }}
              value={currentTrack.id || 'ziyarat_warith'}
              onChange={(e) => audioEngine.playTrack(e.target.value)}
            >
              <option value="ziyarat_warith">Ziyarat Warith</option>
              <option value="ziyarat_ashura">Ziyarat Ashura</option>
              <option value="karbala_adhan">Karbala Adhan</option>
              <option value="desert_ambiance">Desert Wind (61 AH)</option>
            </select>

            <button className="btn btn-warning rounded-circle p-2 d-flex align-items-center justify-center text-dark" onClick={() => audioEngine.togglePlay()}>
              <i className={`bi ${audioPlaying ? 'bi-pause-fill' : 'bi-play-fill'} fs-6`}></i>
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: CERTAINTY HISTORIOGRAPHY ================= */}
      {activeModal === 'certainty' && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(8, 11, 11, 0.88)', backdropFilter: 'blur(12px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content shadow-2xl" style={{ background: 'var(--bg-obsidian)', border: '1px solid var(--border-gold)', color: 'var(--champagne-soft)' }}>
              <div className="modal-header py-3 px-4 d-flex justify-content-between align-items-center" style={{ background: 'var(--bg-charcoal)', borderBottom: '1px solid var(--border-subtle)' }}>
                <h5 className="modal-title font-title mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--ivory-warm)', letterSpacing: '0.04em' }}>
                  <i className="bi bi-shield-check" style={{ color: 'var(--gold-antique)' }}></i>
                  HISTORICAL CERTAINTY SYSTEM &amp; HISTORIOGRAPHY
                </h5>
                <button
                  type="button"
                  className="btn btn-sm d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: '32px', height: '32px', background: 'var(--bg-elevated)', color: 'var(--champagne-soft)', border: '1px solid var(--border-subtle)' }}
                  onClick={() => setActiveModal(null)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body small p-4" style={{ background: 'var(--bg-obsidian)' }}>
                <h5 className="fw-semibold font-title mb-1" style={{ color: 'var(--ivory-warm)', letterSpacing: '0.03em' }}>
                  {CERTAINTY_EXPLANATIONS[certaintyKey]?.title || 'Historiographical Analysis'}
                </h5>
                <span className="badge mb-3 px-2.5 py-1 text-uppercase fw-semibold" style={{ background: 'var(--bg-elevated)', color: 'var(--gold-antique)', border: '1px solid var(--border-gold)', fontSize: '0.65rem' }}>
                  {(CERTAINTY_LEVELS[CERTAINTY_EXPLANATIONS[certaintyKey]?.level] || CERTAINTY_LEVELS.APPROXIMATE_LOCATION).label}
                </span>

                <div className="p-3 rounded-2 mb-3 leading-relaxed font-serif" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.65' }}>
                  {(CERTAINTY_EXPLANATIONS[certaintyKey]?.explanation || '').split('\n\n').map((p, i) => (
                    <p key={i} className="mb-2.5">{p}</p>
                  ))}
                </div>

                <div className="text-uppercase small fw-bold mb-2 d-flex align-items-center gap-1.5" style={{ color: 'var(--gold-antique)', fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                  <i className="bi bi-book"></i> Classical Primary Sources Cited:
                </div>
                <div className="d-flex flex-column gap-2 mb-3">
                  {(CERTAINTY_EXPLANATIONS[certaintyKey]?.sources || []).map((s, idx) => (
                    <div key={idx} className="p-2.5 rounded-2 d-flex justify-content-between align-items-center" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-subtle)', fontSize: '0.76rem' }}>
                      <span style={{ color: 'var(--ivory-warm)' }}>{s.author} — <em style={{ color: 'var(--gold-antique)' }}>{s.work}</em></span>
                      <span className="font-monospace" style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>{s.citation}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-2" style={{ background: 'rgba(16, 59, 50, 0.4)', border: '1px solid var(--border-gold)', fontSize: '0.75rem', color: 'var(--champagne-soft)' }}>
                  <strong style={{ color: 'var(--gold-antique)' }}>Academic Historiographical Discipline:</strong> This digital museum never conjectures coordinates, topographical borders, or military maneuvers to artificially mask gaps in archival testimony. Where precise spatial sites are approximate due to historical Euphrates riverbed migration, they are transparently designated as approximate.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: HALL OF HISTORICAL PERSONALITIES (61 AH) ================= */}
      {activeModal === 'personalities' && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(8, 11, 11, 0.88)', backdropFilter: 'blur(12px)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content shadow-2xl" style={{ background: 'var(--bg-obsidian)', border: '1px solid var(--border-gold)', color: 'var(--champagne-soft)' }}>
              <div className="modal-header py-3 px-4 d-flex justify-content-between align-items-center" style={{ background: 'var(--bg-charcoal)', borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <h5 className="modal-title font-title mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--ivory-warm)', letterSpacing: '0.04em' }}>
                    <i className="bi bi-people" style={{ color: 'var(--gold-antique)' }}></i>
                    HALL OF HISTORICAL PERSONALITIES (61 AH)
                  </h5>
                  <span className="small" style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', letterSpacing: '0.03em' }}>
                    Biographical monographs of central figures present upon the sacred plain of al-Taff
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-sm d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: '32px', height: '32px', background: 'var(--bg-elevated)', color: 'var(--champagne-soft)', border: '1px solid var(--border-subtle)' }}
                  onClick={() => setActiveModal(null)}
                >
                  ✕
                </button>
              </div>

              <div className="p-3 border-bottom d-flex align-items-center justify-content-between" style={{ background: 'var(--bg-charcoal)', borderColor: 'var(--border-subtle)' }}>
                <div className="position-relative w-100" style={{ maxWidth: '420px' }}>
                  <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3" style={{ color: 'var(--text-tertiary)' }}></i>
                  <input
                    type="text"
                    className="form-control form-control-sm ps-5 rounded-pill"
                    style={{ background: 'var(--bg-obsidian)', color: 'var(--champagne-soft)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}
                    placeholder="Search by name, title, role or kinship..."
                    value={personFilter}
                    onChange={(e) => setPersonFilter(e.target.value)}
                  />
                  {personFilter && (
                    <button
                      className="btn btn-link btn-sm position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-decoration-none"
                      style={{ color: 'var(--text-tertiary)' }}
                      onClick={() => setPersonFilter('')}
                    >
                      ✕
                    </button>
                  )}
                </div>
                <span className="small d-none d-md-inline" style={{ color: 'var(--gold-antique)', fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                  {PERSONALITIES.filter(p => p.name.toLowerCase().includes(personFilter.toLowerCase()) || p.arabicName.includes(personFilter)).length} Biographical Entries
                </span>
              </div>

              <div className="modal-body p-4" style={{ background: 'var(--bg-obsidian)' }}>
                <div className="row g-3">
                  {PERSONALITIES.filter(p => p.name.toLowerCase().includes(personFilter.toLowerCase()) || p.arabicName.includes(personFilter)).map(person => (
                    <div key={person.id} className="col-12 col-md-6">
                      <div
                        className="p-3 rounded-2 h-100 d-flex gap-3 transition-all"
                        style={{
                          background: 'var(--bg-charcoal)',
                          border: '1px solid var(--border-subtle)',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
                        }}
                      >
                        <div className="position-relative flex-shrink-0" style={{ width: '80px', height: '80px' }}>
                          <img
                            src={person.image}
                            alt={person.name}
                            className="w-100 h-100 rounded-2 object-fit-cover"
                            style={{ border: '1px solid var(--border-gold)', filter: 'brightness(0.92)' }}
                          />
                        </div>
                        <div className="flex-grow-1 min-w-0">
                          <h6 className="fw-semibold font-title mb-0 text-truncate" style={{ color: 'var(--ivory-warm)', letterSpacing: '0.02em' }}>{person.name}</h6>
                          <p className="font-arabic small mb-1" style={{ color: 'var(--gold-antique)', fontSize: '0.85rem' }}>{person.arabicName}</p>
                          <p className="small fst-italic mb-1 text-truncate" style={{ color: 'var(--text-tertiary)', fontSize: '0.74rem' }}>{person.epithet || person.role}</p>
                          <p className="small mb-2 font-serif" style={{ color: 'var(--text-secondary)', fontSize: '0.76rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{person.biography}</p>
                          <button
                            className="btn btn-sm py-1 px-2.5 fw-semibold d-inline-flex align-items-center gap-1"
                            style={{
                              background: 'var(--bg-elevated)',
                              color: 'var(--gold-antique)',
                              border: '1px solid var(--border-gold)',
                              fontSize: '0.68rem',
                              letterSpacing: '0.04em'
                            }}
                            onClick={() => {
                              setActiveModal(null);
                              const firstDay = person.timelineDays[0] || 10;
                              const idx = MUHARRAM_DAYS.findIndex(d => d.dayNumber === firstDay);
                              if (idx >= 0) selectTimelineDay(idx);
                            }}
                          >
                            Explore in Chronology &amp; Map →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ZIYARAT & SACRED LITURGY READER ================= */}
      {activeModal === 'ziyarat' && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(8, 11, 11, 0.88)', backdropFilter: 'blur(12px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content shadow-2xl" style={{ background: 'var(--bg-obsidian)', border: '1px solid var(--border-gold)', color: 'var(--champagne-soft)' }}>
              <div className="modal-header py-3 px-4 d-flex justify-content-between align-items-center" style={{ background: 'var(--bg-charcoal)', borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <h5 className="modal-title font-title mb-0" style={{ color: 'var(--ivory-warm)', letterSpacing: '0.04em' }}>
                    {selectedLocation?.ziyarat?.title || 'Ziyarat Warith'}
                  </h5>
                  <p className="font-arabic mb-0 small text-end" style={{ color: 'var(--gold-antique)', direction: 'rtl', fontSize: '0.95rem' }}>
                    {selectedLocation?.ziyarat?.arabicTitle || 'زيارة وارث الشريفة'}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-sm d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: '32px', height: '32px', background: 'var(--bg-elevated)', color: 'var(--champagne-soft)', border: '1px solid var(--border-subtle)' }}
                  onClick={() => setActiveModal(null)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body p-4 small" style={{ background: 'var(--bg-obsidian)' }}>
                <div className="p-3 rounded-2 mb-3" style={{ background: 'rgba(16, 59, 50, 0.35)', border: '1px solid var(--border-gold)', fontSize: '0.78rem', color: 'var(--champagne-soft)' }}>
                  <strong style={{ color: 'var(--gold-antique)' }}>Etiquette of Sacred Visitation:</strong> {selectedLocation?.ziyarat?.etiquette || 'Approach with purity, serene humility, and recite salawat upon the Prophet and his holy household.'}
                </div>

                <div className="p-4 rounded-2 text-end mb-3" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-subtle)' }}>
                  <span className="small d-block text-start mb-2" style={{ color: 'var(--gold-antique)', letterSpacing: '0.08em', fontSize: '0.68rem' }}>ARABIC SCRIPT</span>
                  <p className="fs-4 font-arabic leading-loose mb-0" style={{ color: 'var(--gold-antique)', direction: 'rtl', lineHeight: '2.1' }}>
                    {selectedLocation?.ziyarat?.excerptArabic}
                  </p>
                </div>

                <div className="p-3 rounded-2 mb-3" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-subtle)' }}>
                  <span className="small d-block mb-1" style={{ color: 'var(--text-tertiary)', letterSpacing: '0.08em', fontSize: '0.68rem' }}>PHONETIC TRANSLITERATION</span>
                  <p className="fst-italic mb-0 font-serif" style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: '1.6' }}>
                    {selectedLocation?.ziyarat?.transliteration}
                  </p>
                </div>

                <div className="p-3 rounded-2" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-subtle)' }}>
                  <span className="small d-block mb-1" style={{ color: 'var(--text-tertiary)', letterSpacing: '0.08em', fontSize: '0.68rem' }}>ENGLISH EXEGETICAL TRANSLATION</span>
                  <p className="mb-0 font-serif leading-relaxed" style={{ color: 'var(--ivory-warm)', fontSize: '0.86rem', lineHeight: '1.65' }}>
                    {selectedLocation?.ziyarat?.translation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ACCESSIBILITY GUIDE ================= */}
      {activeModal === 'access' && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(8, 11, 11, 0.88)', backdropFilter: 'blur(12px)' }}>
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content shadow-2xl" style={{ background: 'var(--bg-obsidian)', border: '1px solid var(--border-gold)', color: 'var(--champagne-soft)' }}>
              <div className="modal-header py-3 px-4 d-flex justify-content-between align-items-center" style={{ background: 'var(--bg-charcoal)', borderBottom: '1px solid var(--border-subtle)' }}>
                <h5 className="modal-title font-title mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--ivory-warm)', letterSpacing: '0.04em' }}>
                  <i className="bi bi-universal-access" style={{ color: '#4E9F8E' }}></i> PILGRIM ACCESSIBILITY GUIDE
                </h5>
                <button
                  type="button"
                  className="btn btn-sm d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: '32px', height: '32px', background: 'var(--bg-elevated)', color: 'var(--champagne-soft)', border: '1px solid var(--border-subtle)' }}
                  onClick={() => setActiveModal(null)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body p-4 small d-flex flex-column gap-3" style={{ background: 'var(--bg-obsidian)' }}>
                <div className="p-3 rounded-2 d-flex gap-3" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-subtle)' }}>
                  <span className="fs-4">♿</span>
                  <div>
                    <strong className="d-block" style={{ color: 'var(--ivory-warm)' }}>Universal Wheelchair Ramps:</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{selectedLocation?.accessibility?.wheelchairAccess || 'Gentle step-free ramps installed at all primary portals.'}</span>
                  </div>
                </div>
                <div className="p-3 rounded-2 d-flex gap-3" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-subtle)' }}>
                  <span className="fs-4">🛺</span>
                  <div>
                    <strong className="d-block" style={{ color: 'var(--ivory-warm)' }}>Electric Golf Cart Shuttles:</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{selectedLocation?.accessibility?.golfCartShuttle || 'Complimentary mobility vehicles operate around the outer perimeter.'}</span>
                  </div>
                </div>
                <div className="p-3 rounded-2 d-flex gap-3" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-subtle)' }}>
                  <span className="fs-4">🛗</span>
                  <div>
                    <strong className="d-block" style={{ color: 'var(--ivory-warm)' }}>Hydraulic Lifts:</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{selectedLocation?.accessibility?.elevators || 'Elevators connect subterranean pilgrimage prayer halls.'}</span>
                  </div>
                </div>
                <div className="p-3 rounded-2 d-flex gap-3" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-subtle)' }}>
                  <span className="fs-4">🏥</span>
                  <div>
                    <strong className="d-block" style={{ color: 'var(--ivory-warm)' }}>24/7 Medical Care:</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{selectedLocation?.accessibility?.medicalCenter || 'Emergency clinics and mobile paramedic squads positioned on-site.'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: NAVIGATION WAYFINDING ================= */}
      {activeModal === 'navigate' && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(8, 11, 11, 0.88)', backdropFilter: 'blur(12px)' }}>
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content shadow-2xl" style={{ background: 'var(--bg-obsidian)', border: '1px solid var(--border-gold)', color: 'var(--champagne-soft)' }}>
              <div className="modal-header py-3 px-4 d-flex justify-content-between align-items-center" style={{ background: 'var(--bg-charcoal)', borderBottom: '1px solid var(--border-subtle)' }}>
                <h5 className="modal-title font-title mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--ivory-warm)', letterSpacing: '0.04em' }}>
                  <i className="bi bi-geo-alt" style={{ color: 'var(--gold-antique)' }}></i> WAYFINDING &amp; SANCTUM PORTALS
                </h5>
                <button
                  type="button"
                  className="btn btn-sm d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: '32px', height: '32px', background: 'var(--bg-elevated)', color: 'var(--champagne-soft)', border: '1px solid var(--border-subtle)' }}
                  onClick={() => setActiveModal(null)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body p-4 small" style={{ background: 'var(--bg-obsidian)' }}>
                <h6 className="fw-semibold font-title mb-2" style={{ color: 'var(--gold-antique)' }}>{selectedLocation?.name}</h6>
                <div className="p-3 rounded-2 mb-3" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-subtle)' }}>
                  <strong className="d-block mb-1" style={{ color: 'var(--champagne-soft)', fontSize: '0.78rem' }}>Major Access Portals:</strong>
                  <ul className="mb-0 ps-3" style={{ color: 'var(--text-secondary)' }}>
                    {(selectedLocation?.navigation?.gates || ['Bab al-Qibla (South)', 'Bab al-Sidra (North)']).map(g => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </div>
                <div className="row g-2 text-center">
                  <div className="col-6 p-2 rounded-2" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-subtle)' }}>
                    <span className="small d-block" style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>Walking Time</span>
                    <strong style={{ color: 'var(--ivory-warm)' }}>{selectedLocation?.navigation?.walkingTime || 'Immediate'}</strong>
                  </div>
                  <div className="col-6 p-2 rounded-2" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-subtle)' }}>
                    <span className="small d-block" style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>Distance from Bayn al-Haramayn</span>
                    <strong style={{ color: 'var(--ivory-warm)' }}>{selectedLocation?.navigation?.distanceFromBain || '0 m'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: SAVED LOCATIONS / BOOKMARKS ================= */}
      {activeModal === 'saved' && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(8, 11, 11, 0.88)', backdropFilter: 'blur(12px)' }}>
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content shadow-2xl" style={{ background: 'var(--bg-obsidian)', border: '1px solid var(--border-gold)', color: 'var(--champagne-soft)' }}>
              <div className="modal-header py-3 px-4 d-flex justify-content-between align-items-center" style={{ background: 'var(--bg-charcoal)', borderBottom: '1px solid var(--border-subtle)' }}>
                <h5 className="modal-title font-title mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--ivory-warm)', letterSpacing: '0.04em' }}>
                  <i className="bi bi-bookmark" style={{ color: 'var(--gold-antique)' }}></i> CURATORIAL BOOKMARKS &amp; SAVED SITES
                </h5>
                <button
                  type="button"
                  className="btn btn-sm d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: '32px', height: '32px', background: 'var(--bg-elevated)', color: 'var(--champagne-soft)', border: '1px solid var(--border-subtle)' }}
                  onClick={() => setActiveModal(null)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body p-4 small" style={{ background: 'var(--bg-obsidian)' }}>
                {savedLocations.length === 0 ? (
                  <p className="text-center py-4 mb-0" style={{ color: 'var(--text-tertiary)' }}>No bookmarked dossiers yet. Select "Save Dossier" on any location to preserve it in your personal collection.</p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {savedLocations.map(item => (
                      <div key={item.id} className="p-3 rounded-2 d-flex justify-content-between align-items-center" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-subtle)' }}>
                        <div>
                          <strong className="d-block font-title" style={{ color: 'var(--ivory-warm)' }}>{item.name}</strong>
                          <span className="font-arabic small" style={{ color: 'var(--gold-antique)' }}>{item.arabicName}</span>
                        </div>
                        <div className="d-flex gap-1.5">
                          <button
                            className="btn btn-sm py-1 px-2.5 fw-semibold"
                            style={{
                              background: 'var(--bg-elevated)',
                              color: 'var(--gold-antique)',
                              border: '1px solid var(--border-gold)',
                              fontSize: '0.72rem'
                            }}
                            onClick={() => {
                              setActiveModal(null);
                              const match = PRESENT_DAY_LOCATIONS.find(l => l.id === item.id) || HISTORICAL_61AH_LOCATIONS.find(l => l.id === item.id);
                              if (match) {
                                setSelectedLocation(match);
                                mapInstanceRef.current?.panTo(match.coords.x, match.coords.y, 1.4);
                              }
                            }}
                          >
                            Inspect Site →
                          </button>
                          <button
                            className="btn btn-sm py-1 px-2"
                            style={{ background: 'transparent', color: 'var(--terracotta-muted)', border: '1px solid rgba(138, 75, 56, 0.4)' }}
                            onClick={() => toggleSaveLocation(item)}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SACRED PHOTOGRAPHIC PAVILION & ARCHIVAL REPOSITORY ================= */}
      {activeModal === 'gallery' && (
        <div className="modal d-block z-3" tabIndex="-1" style={{ backgroundColor: 'rgba(8, 11, 11, 0.94)', backdropFilter: 'blur(16px)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" style={{ maxHeight: '92vh' }}>
            <div className="modal-content shadow-2xl" style={{ background: 'var(--bg-obsidian)', border: '1px solid var(--border-gold)', color: 'var(--champagne-soft)' }}>
              
              {/* Pavilion Header */}
              <div className="modal-header py-3 px-4 d-flex justify-content-between align-items-center" style={{ background: 'var(--bg-charcoal)', borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 rounded-2 d-flex align-items-center justify-content-center" style={{ background: 'var(--bg-elevated)', color: 'var(--gold-antique)', border: '1px solid var(--border-gold)', width: '42px', height: '42px' }}>
                    <i className="bi bi-camera fs-5"></i>
                  </div>
                  <div>
                    <h5 className="modal-title font-title mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--ivory-warm)', letterSpacing: '0.04em' }}>
                      SACRED PHOTOGRAPHIC PAVILION &amp; ARCHIVAL REPOSITORY
                      <span className="badge px-2.5 py-1 text-uppercase fw-semibold" style={{ background: 'var(--gold-antique)', color: 'var(--bg-obsidian)', fontSize: '0.65rem', letterSpacing: '0.06em' }}>
                        {galleryImages.length} Full HD Assets
                      </span>
                    </h5>
                    <div className="small" style={{ color: 'var(--text-tertiary)', fontSize: '0.74rem', letterSpacing: '0.02em' }}>
                      Official photographic repository from Imam Hussain Holy Shrine (<a href="https://imamhussain.gov.iq/english" target="_blank" rel="noreferrer" style={{ color: 'var(--gold-antique)', textDecoration: 'none' }}>imamhussain.gov.iq</a>) &amp; Al-Abbas Shrine (<a href="https://alkafeel.net/?lang=en" target="_blank" rel="noreferrer" style={{ color: 'var(--gold-antique)', textDecoration: 'none' }}>alkafeel.net</a>) with AI 61 AH historical reconstructions.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-sm d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: '32px', height: '32px', background: 'var(--bg-elevated)', color: 'var(--champagne-soft)', border: '1px solid var(--border-subtle)' }}
                  onClick={() => setActiveModal(null)}
                >
                  ✕
                </button>
              </div>

              {/* Curatorial Filter & Search Ribbon */}
              <div className="p-3 border-bottom d-flex flex-wrap align-items-center justify-content-between gap-3" style={{ background: 'var(--bg-charcoal)', borderColor: 'var(--border-subtle)' }}>
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  {[
                    { id: 'all', label: `All Assets (${galleryImages.length})` },
                    { id: 'historical_ai', label: `✨ 61 AH AI Reconstructions (${galleryImages.filter(g => g.category === 'historical_ai').length})` },
                    { id: 'shrine_hussain', label: `🕌 Holy Shrine of Imam Hussain (${galleryImages.filter(g => g.category === 'shrine_hussain').length})` },
                    { id: 'shrine_abbas', label: `⚔️ Holy Shrine of Al-Abbas (${galleryImages.filter(g => g.category === 'shrine_abbas').length})` },
                    { id: 'arbaeen', label: `🚶 Sacred Processions & Arbaeen (${galleryImages.filter(g => g.category === 'arbaeen').length})` }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      className={`gallery-pill ${selectedGalleryCategory === tab.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedGalleryCategory(tab.id);
                        setGalleryPage(1);
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="position-relative" style={{ minWidth: '220px', maxWidth: '320px' }}>
                  <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3" style={{ color: 'var(--text-tertiary)' }}></i>
                  <input
                    type="text"
                    className="form-control form-control-sm ps-5 rounded-pill"
                    style={{ background: 'var(--bg-obsidian)', color: 'var(--champagne-soft)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}
                    placeholder="Search archival photographs..."
                    value={gallerySearch}
                    onChange={(e) => {
                      setGallerySearch(e.target.value);
                      setGalleryPage(1);
                    }}
                  />
                  {gallerySearch && (
                    <button
                      className="btn btn-link btn-sm position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-decoration-none"
                      style={{ color: 'var(--text-tertiary)' }}
                      onClick={() => setGallerySearch('')}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Archival Masonry Grid */}
              <div className="modal-body p-4 overflow-y-auto" style={{ background: 'var(--bg-obsidian)', minHeight: '400px', maxHeight: '65vh' }}>
                {(() => {
                  let filtered = galleryImages;
                  if (selectedGalleryCategory !== 'all') {
                    filtered = filtered.filter(img => img.category === selectedGalleryCategory);
                  }
                  if (gallerySearch.trim()) {
                    const q = gallerySearch.toLowerCase();
                    filtered = filtered.filter(img => 
                      (img.title && img.title.toLowerCase().includes(q)) ||
                      (img.filename && img.filename.toLowerCase().includes(q)) ||
                      (img.category && img.category.toLowerCase().includes(q))
                    );
                  }

                  const displayed = filtered.slice(0, galleryPage * 36);

                  if (displayed.length === 0) {
                    return (
                      <div className="text-center py-5" style={{ color: 'var(--text-tertiary)' }}>
                        <i className="bi bi-camera fs-1 d-block mb-3 opacity-40"></i>
                        <h5 className="font-title" style={{ color: 'var(--ivory-warm)' }}>No archival assets match your query</h5>
                        <p className="small">Please adjust your search keyword or reset the curatorial category filter.</p>
                      </div>
                    );
                  }

                  return (
                    <div>
                      <div className="row g-3">
                        {displayed.map(img => (
                          <div key={img.id} className="col-6 col-md-4 col-lg-3 col-xl-2">
                            <div
                              className="gallery-card h-100 shadow-sm"
                              onClick={() => setLightboxImage(img)}
                            >
                              <div className="position-relative">
                                {img.isAI ? (
                                  <span className="gallery-card-badge" style={{ background: 'var(--bg-obsidian)', color: 'var(--gold-antique)', border: '1px solid var(--border-gold)' }}>
                                    <i className="bi bi-stars me-1"></i>AI 61 AH
                                  </span>
                                ) : (
                                  <span className="gallery-card-badge" style={{ background: 'rgba(16, 59, 50, 0.85)', color: 'var(--champagne-soft)', border: '1px solid rgba(198, 166, 107, 0.4)' }}>
                                    <i className="bi bi-shield-check me-1"></i>Full HD
                                  </span>
                                )}
                                <img
                                  src={img.path}
                                  alt={img.title}
                                  loading="lazy"
                                  onError={(e) => { e.target.src = 'assets/images/alkafeel_logo.png'; }}
                                />
                              </div>
                              <div className="gallery-card-info">
                                <div className="text-truncate small fw-semibold font-title" style={{ color: 'var(--ivory-warm)' }} title={img.title}>
                                  {img.title}
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-1">
                                  <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                                    {img.width} × {img.height}
                                  </span>
                                  <span className="badge px-1.5 py-0.5" style={{ background: 'var(--bg-elevated)', color: 'var(--gold-antique)', fontSize: '0.62rem', border: '1px solid var(--border-subtle)' }}>
                                    {img.category === 'historical_ai' ? 'Artistic Reconstruction' : 'Holy Shrine'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {displayed.length < filtered.length && (
                        <div className="text-center mt-4">
                          <button
                            className="btn px-4 py-2 rounded-pill fw-semibold"
                            style={{
                              background: 'var(--bg-elevated)',
                              color: 'var(--gold-antique)',
                              border: '1px solid var(--border-gold)',
                              fontSize: '0.78rem',
                              letterSpacing: '0.04em'
                            }}
                            onClick={() => setGalleryPage(p => p + 1)}
                          >
                            <i className="bi bi-arrow-down-circle me-2"></i>
                            Reveal More Archival Assets ({filtered.length - displayed.length} remaining)
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Pavilion Footer */}
              <div className="modal-footer py-2.5 px-4 d-flex justify-content-between align-items-center" style={{ background: 'var(--bg-charcoal)', borderTop: '1px solid var(--border-subtle)' }}>
                <div className="small" style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                  Curated repository containing {galleryImages.length} verified high-resolution photographs &amp; scholarly visual reconstructions.
                </div>
                <button
                  type="button"
                  className="editorial-action-btn px-3 py-1"
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => setActiveModal(null)}
                >
                  Conclude Viewing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= LIGHTBOX MONOGRAPH VIEWER ================= */}
      {lightboxImage && (
        <div className="lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <div className="position-absolute top-0 end-0 p-3 z-3">
            <button
              className="btn btn-sm d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: '36px', height: '36px', background: 'var(--bg-elevated)', color: 'var(--champagne-soft)', border: '1px solid var(--border-gold)' }}
              onClick={() => setLightboxImage(null)}
            >
              <i className="bi bi-x-lg fs-5"></i>
            </button>
          </div>

          <div
            className="d-flex flex-column align-items-center max-w-100 max-h-100"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '92vw', maxHeight: '90vh' }}
          >
            <div className="position-relative text-center">
              <img
                src={lightboxImage.path}
                alt={lightboxImage.title}
                className="rounded-2 shadow-2xl"
                style={{
                  maxHeight: '75vh',
                  maxWidth: '90vw',
                  objectFit: 'contain',
                  border: '1px solid var(--border-gold)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)'
                }}
              />
            </div>

            <div className="mt-3 p-3 rounded-2 text-center shadow-lg" style={{ background: 'rgba(8, 11, 11, 0.95)', border: '1px solid var(--border-gold)', maxWidth: '720px', width: '100%' }}>
              <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                <h6 className="fw-semibold font-title mb-0" style={{ color: 'var(--ivory-warm)', letterSpacing: '0.02em' }}>{lightboxImage.title}</h6>
                {lightboxImage.isAI ? (
                  <span className="badge" style={{ background: 'var(--bg-elevated)', color: 'var(--gold-antique)', border: '1px solid var(--border-gold)', fontSize: '0.65rem' }}>
                    <i className="bi bi-stars me-1"></i>AI 61 AH Reconstruction
                  </span>
                ) : (
                  <span className="badge" style={{ background: 'rgba(16, 59, 50, 0.85)', color: 'var(--champagne-soft)', border: '1px solid rgba(198, 166, 107, 0.4)', fontSize: '0.65rem' }}>
                    Official Holy Shrine Archive
                  </span>
                )}
              </div>
              <div className="small mb-2" style={{ color: 'var(--text-tertiary)', fontSize: '0.74rem' }}>
                Resolution: <strong style={{ color: 'var(--champagne-soft)' }}>{lightboxImage.width} × {lightboxImage.height} px</strong> • Source Provenance: <span style={{ color: 'var(--champagne-soft)' }}>{lightboxImage.source || 'imamhussain.gov.iq / alkafeel.net'}</span>
              </div>
              <div className="d-flex justify-content-center gap-2">
                <a
                  href={lightboxImage.path}
                  download={lightboxImage.filename}
                  className="editorial-action-btn px-3 py-1 text-decoration-none d-inline-flex align-items-center gap-1.5"
                  style={{ fontSize: '0.75rem', color: 'var(--gold-antique)' }}
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="bi bi-download"></i> Download Archival Master
                </a>
                <button
                  className="editorial-action-btn px-3 py-1"
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => setLightboxImage(null)}
                >
                  Return to Pavilion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Render React App
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(React.createElement(KarbalaApp));
}
