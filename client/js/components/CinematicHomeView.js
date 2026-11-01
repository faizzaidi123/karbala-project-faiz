const { useState, useEffect, useRef } = window.React;

export function CinematicHomeView({ onNavigate, onOpenLightbox, galleryImages = [], onOpenLegal }) {
  // Chapter 03 Tab State
  const [activeShrineTab, setActiveShrineTab] = useState('hussain');
  // Chapter 04 Before/After Slider State
  const [sliderPos, setSliderPos] = useState(50);
  const isDraggingSliderRef = useRef(false);
  const sliderContainerRef = useRef(null);
  // Chapter 06 Tab State
  const [chronologyTab, setChronologyTab] = useState('days');
  // Chapter 07 Gallery Filter State
  const [archiveFilter, setArchiveFilter] = useState('all');

  // GSAP ScrollTrigger Integration
  useEffect(() => {
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      
      // Animate Chapter headers on scroll
      const chapters = document.querySelectorAll('.chapter-header');
      chapters.forEach(ch => {
        window.gsap.fromTo(ch, 
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ch,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
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

  // Curated 61 AH Reconstructions for Chapter 05
  const reconstructions61AH = [
    {
      id: 'encampment',
      title: 'The Encampment of Imam Hussain (al-Mukhayyam)',
      arabic: 'مخيم الإمام الحسين عليه السلام',
      desc: 'The sacred encampment established on 2 Muharram 61 AH. Protected to the rear by a crescent ditch with defensive thorn fires, it contained the pavilions of the Holy Household and loyal companions.',
      image: 'assets/images/ai_61ah_encampment.jpg',
      aspect: 'Scholarly Visual Reconstruction',
      badge: 'TOPOGRAPHICAL CONTINUITY',
      width: 1920,
      height: 1080
    },
    {
      id: 'river',
      title: 'Nahr al-Alqami (Ancient Euphrates Course)',
      arabic: 'نهر العلقمي وبساتين النخيل',
      desc: 'The ancient meandering watercourse flanked by dense date palm groves (Nakhl) and marsh reeds (Qasab). Contested throughout the siege, and the site where Abu al-Fadl al-Abbas sought water for the parched children.',
      image: 'assets/images/ai_61ah_alqami_river.jpg',
      aspect: 'Hydrological & Botanical Modeling',
      badge: 'HISTORIC WATERCOURSE',
      width: 1920,
      height: 1080
    },
    {
      id: 'tall_zaynabiyya',
      title: 'Tall al-Zaynabiyya (The Elevated Ridge)',
      arabic: 'التل الزينبي المشرف',
      desc: 'An elevated natural sand knoll situated west of the encampment, granting a clear vantage across the plain of al-Taff. Here Lady Zaynab bint Ali (SA) witnessed the climactic moments of the stand.',
      image: 'assets/images/ai_61ah_tall_zaynabiyya.jpg',
      aspect: 'Geomorphological Study',
      badge: 'ELEVATED VANTAGE',
      width: 1920,
      height: 1080
    },
    {
      id: 'sham_e_ghariban',
      title: 'Sham-e Ghariban (The Solitary Dusk)',
      arabic: 'ليلة الوحشة وسكون الطف',
      desc: 'The poignant twilight following Ashura on 10 Muharram 61 AH. The smoke of burnt tents adrift over the vast silent plain under deep indigo starry skies, guarded by Lady Zaynab.',
      image: 'assets/images/ai_61ah_sham_e_ghariban.jpg',
      aspect: 'Atmospheric Evening Study',
      badge: '10 MUHARRAM 61 AH',
      width: 1920,
      height: 1080
    }
  ];

  // Curated Archive highlights for Chapter 07
  const archiveHighlights = [
    { title: 'Golden Dome of Imam Hussain at Twilight', path: 'assets/images/shrine_38.jpg', category: 'shrine', width: 2560, height: 1707, source: 'Holy Shrine Archival Media' },
    { title: 'The Sacred Sanctuary of Al-Abbas', path: 'assets/images/shrine_27.jpg', category: 'shrine', width: 2400, height: 1600, source: 'Al-Kafeel Global Network' },
    { title: 'Bayn al-Haramayn Panoramic Esplanade', path: 'assets/images/karbala_img_0_Beyn-_l_H_r_meyn__K_rb_la_jpg.jpg', category: 'history', width: 1920, height: 1080, source: 'Heritage Photographic Archive' },
    { title: 'Historic Karbala Pre-2006 Sanctuary View', path: 'assets/images/karbala_img_3_ImamHusaynMosqueKarbalaIraqPre2006_.jpg', category: 'history', width: 1600, height: 1200, source: 'National Archival Registry' },
    { title: 'Scholarly Reconstruction of 61 AH Encampment', path: 'assets/images/ai_61ah_encampment.jpg', category: 'reconstruction', width: 1920, height: 1080, isAI: true, source: 'Karbala Digital Twin Project' },
    { title: 'Nahr al-Alqami Ancient Watercourse', path: 'assets/images/ai_61ah_alqami_river.jpg', category: 'reconstruction', width: 1920, height: 1080, isAI: true, source: 'Karbala Digital Twin Project' }
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

      {/* =========================================================================
          CHAPTER 01 — THE OPENING (CINEMATIC FULL-VIEWPORT HERO)
          ========================================================================= */}
      <section className="hero-section">
        <div className="hero-bg-container">
          <img
            src="assets/images/shrine_38.jpg"
            alt="Sacred Sanctuary of Karbala"
            className="hero-bg-media"
          />
          <div className="hero-overlay-gradient"></div>
        </div>

        <div className="hero-content">
          <div className="hero-eyebrow">
            <i className="bi bi-shield-fill text-gold-antique"></i>
            <span>SACRED HERITAGE DIGITAL TWIN • 61 AH &amp; PRESENT DAY</span>
          </div>

          <h1 className="hero-title">KARBALA</h1>

          <div className="hero-calligraphy">
            كربلاء المقدسة — ملحمة الخلود والإباء
          </div>

          <p className="hero-subtitle">
            Where Sacred Geography, Historical Memory, and Timeless Sacrifice Converge Across 1,380+ Years of Living Heritage.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="hero-btn-primary"
              onClick={() => scrollToChapter('chapter-02')}
            >
              <i className="bi bi-arrow-down me-2"></i>
              EXPLORE THE EXHIBITION
            </button>

            <button
              type="button"
              className="hero-btn-secondary"
              onClick={() => onNavigate('map')}
            >
              <i className="bi bi-compass me-2 text-gold-antique"></i>
              ENTER DIGITAL TWIN MAP
            </button>
          </div>
        </div>

        <div className="hero-scroll-cue" onClick={() => scrollToChapter('chapter-02')}>
          <div className="scroll-pill-icon"></div>
          <span>SCROLL TO DISCOVER</span>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 02 — A LAND OF MEMORY (HISTORICAL CONTEXT & STATS)
          ========================================================================= */}
      <section id="chapter-02" className="chapter-section bg-charcoal">
        <div className="container py-lg-4">
          <div className="row align-items-center g-5">
            
            <div className="col-lg-6">
              <div className="chapter-header mb-4">
                <div className="chapter-number-pill">CHAPTER 02 • PROLOGUE</div>
                <h2 className="chapter-title">A Land of Memory &amp; Eternity</h2>
                <div className="font-arabic fs-4 text-gold-antique mb-3">أرض الطف وكربلاء المقدسة</div>
              </div>

              <p className="chapter-lead mb-4">
                On the second day of Muharram in the year 61 AH (October 680 CE), a modest caravan of family members, scholars, and steadfast companions halted upon an arid Mesopotamian plain situated between the western desert fringe and the fertile alluvium of the Euphrates.
              </p>

              <div className="p-4 rounded-3 mb-4" style={{ background: 'rgba(8, 11, 11, 0.75)', border: '1px solid rgba(198, 166, 107, 0.3)' }}>
                <p className="font-serif fst-italic mb-2" style={{ color: 'var(--champagne-soft)', fontSize: '0.98rem', lineHeight: '1.7' }}>
                  &ldquo;I have not risen out of arrogance or rebellion, nor to cause corruption or injustice. Rather, I rose to seek reform in the community of my grandfather Muhammad (SAW)...&rdquo;
                </p>
                <div className="small text-end fw-semibold" style={{ color: 'var(--gold-antique)', letterSpacing: '0.06em' }}>
                  — Imam Hussain ibn Ali (AS) • Chronicle of al-Tabari
                </div>
              </div>

              <div className="d-flex gap-3">
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

            <div className="col-lg-6">
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
                    <div className="small text-champagne opacity-75 mt-2">Of continuous pilgrimage, architectural reverence, and spiritual memory.</div>
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
          
          <div className="chapter-header text-center max-w-700 mx-auto">
            <div className="chapter-number-pill">CHAPTER 03 • CONTEMPORARY SANCTUARY</div>
            <h2 className="chapter-title">Karbala Today: The Sacred Sanctuaries</h2>
            <p className="chapter-lead mx-auto">
              The modern city of Karbala centers around the twin monuments of Bayn al-Haramayn—masterworks of Islamic sacred architecture that embody centuries of devotion.
            </p>

            {/* Architecture Tabs */}
            <div className="d-inline-flex p-1.5 rounded-pill mt-3" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-gold)' }}>
              <button
                type="button"
                className={`btn btn-sm px-4 rounded-pill fw-semibold ${activeShrineTab === 'hussain' ? 'bg-warning text-dark' : 'text-champagne'}`}
                style={{ fontSize: '0.78rem', letterSpacing: '0.04em' }}
                onClick={() => setActiveShrineTab('hussain')}
              >
                Imam Hussain Sanctuary
              </button>
              <button
                type="button"
                className={`btn btn-sm px-4 rounded-pill fw-semibold ${activeShrineTab === 'abbas' ? 'bg-warning text-dark' : 'text-champagne'}`}
                style={{ fontSize: '0.78rem', letterSpacing: '0.04em' }}
                onClick={() => setActiveShrineTab('abbas')}
              >
                Al-Abbas Sanctuary
              </button>
              <button
                type="button"
                className={`btn btn-sm px-4 rounded-pill fw-semibold ${activeShrineTab === 'bayn' ? 'bg-warning text-dark' : 'text-champagne'}`}
                style={{ fontSize: '0.78rem', letterSpacing: '0.04em' }}
                onClick={() => setActiveShrineTab('bayn')}
              >
                Bayn al-Haramayn Esplanade
              </button>
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
          CHAPTER 05 — THE HISTORICAL LANDSCAPE (61 AH RECONSTRUCTIONS)
          ========================================================================= */}
      <section id="chapter-05" className="chapter-section bg-charcoal">
        <div className="container py-lg-4">
          
          <div className="chapter-header text-center max-w-700 mx-auto">
            <div className="chapter-number-pill">CHAPTER 05 • ARCHAEOLOGICAL VISUALIZATION</div>
            <h2 className="chapter-title">The Historical Landscape of 61 AH</h2>
            <p className="chapter-lead mx-auto">
              Ground-truth reconstructions produced through topological analysis of classical texts, hydrological contours of the Euphrates basin, and archaeological surveys of western Karbala.
            </p>
          </div>

          <div className="reconstruction-grid">
            {reconstructions61AH.map(item => (
              <div key={item.id} className="reconstruction-item">
                <div className="position-relative overflow-hidden" style={{ height: '240px' }}>
                  <img src={item.image} alt={item.title} className="reconstruction-thumb w-100 h-100 object-fit-cover" />
                  <span className="badge position-absolute top-0 end-0 m-3" style={{ background: 'rgba(8, 11, 11, 0.85)', color: 'var(--gold-antique)', border: '1px solid var(--border-gold)', fontSize: '0.66rem' }}>
                    {item.badge}
                  </span>
                </div>
                <div className="reconstruction-body">
                  <h5 className="font-display text-ivory mb-1" style={{ fontSize: '1.05rem' }}>{item.title}</h5>
                  <p className="font-arabic small text-gold-antique mb-2">{item.arabic}</p>
                  <p className="font-serif small text-secondary mb-3 flex-grow-1" style={{ lineHeight: '1.6', fontSize: '0.86rem' }}>
                    {item.desc}
                  </p>
                  <div className="d-flex align-items-center justify-content-between pt-2 border-top border-secondary">
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{item.aspect}</span>
                    <button
                      type="button"
                      className="btn btn-sm d-inline-flex align-items-center gap-1"
                      style={{ background: 'var(--bg-elevated)', color: 'var(--gold-antique)', border: '1px solid var(--border-gold)', fontSize: '0.72rem' }}
                      onClick={() => onOpenLightbox({
                        title: item.title,
                        path: item.image,
                        width: item.width,
                        height: item.height,
                        isAI: true,
                        source: 'Karbala Digital Twin Scholarly Reconstruction'
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
              className="editorial-action-btn px-4 py-2.5"
              onClick={() => onNavigate('journey-61ah')}
            >
              Explore Full 61 AH Landscape Dossier →
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
                { day: 'Day 03', title: 'Umar ibn Sa\'d Arrives', desc: 'The vanguard of Kufa arrives with 4,000 cavalry under Umar ibn Sa\'d, establishing encirclement.', date: '3 Muharram 61 AH' },
                { day: 'Day 07', title: 'Severing of the Water Supply', desc: 'Umar ibn Sa\'d issues the decree blocking all access to the Euphrates and Nahr al-Alqami.', date: '7 Muharram 61 AH' },
                { day: 'Day 09', title: 'Tasu\'a & Night of Devotion', desc: 'The final ultimatum is delivered. Imam Hussain requests a single night of prayer, devotion, and Qur\'anic recitation.', date: '9 Muharram 61 AH' },
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

            <div className="d-inline-flex p-1.5 rounded-pill mt-3" style={{ background: 'var(--bg-obsidian)', border: '1px solid var(--border-gold)' }}>
              {[
                { id: 'all', label: 'Curated Selection' },
                { id: 'shrine', label: 'Holy Shrines' },
                { id: 'history', label: 'Historic Architecture' },
                { id: 'reconstruction', label: '61 AH Reconstructions' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  className={`btn btn-sm px-3 rounded-pill fw-semibold ${archiveFilter === f.id ? 'bg-warning text-dark' : 'text-champagne'}`}
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

            <div className="d-flex flex-wrap justify-content-center gap-3">
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

              <button
                type="button"
                className="btn btn-lg px-4 py-3 rounded-pill fw-bold font-title shadow-lg"
                style={{
                  background: 'rgba(16, 59, 50, 0.8)',
                  color: '#fff',
                  border: '1px solid var(--border-gold)',
                  fontSize: '0.92rem',
                  letterSpacing: '0.08em'
                }}
                onClick={() => onNavigate('statistics')}
              >
                <i className="bi bi-bar-chart-fill me-2 text-gold-antique"></i>
                GLOBAL ZAIREEN STATISTICS & INTELLIGENCE
              </button>

              <button
                type="button"
                className="btn btn-lg px-4 py-3 rounded-pill fw-bold font-title shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(198, 166, 107, 0.25) 0%, rgba(16, 24, 32, 0.9) 100%)',
                  color: '#dfc08a',
                  border: '1px solid var(--border-gold)',
                  fontSize: '0.92rem',
                  letterSpacing: '0.08em'
                }}
                onClick={() => onNavigate('journey')}
              >
                <i className="bi bi-airplane-engines me-2 text-gold-antique"></i>
                SMART AIRPORT ARRIVAL & JOURNEY HUB
              </button>

              <button
                type="button"
                className="btn btn-lg px-4 py-3 rounded-pill fw-bold font-title shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(236, 201, 75, 0.25) 0%, rgba(16, 24, 32, 0.9) 100%)',
                  color: '#ecc94b',
                  border: '1px solid var(--border-gold)',
                  fontSize: '0.92rem',
                  letterSpacing: '0.08em'
                }}
                onClick={() => onNavigate('poles')}
              >
                <i className="bi bi-geo-alt-fill me-2 text-warning"></i>
                SMART ARBAEEN POLE NAVIGATION (1,452 POLES)
              </button>
            </div>
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
          <div className="d-flex flex-wrap justify-content-center gap-4 small text-champagne mb-4" style={{ fontSize: '0.78rem' }}>
            <button type="button" className="btn btn-link text-champagne p-0 text-decoration-none" onClick={() => onNavigate('story')}>Historical Narrative</button>
            <button type="button" className="btn btn-link text-champagne p-0 text-decoration-none" onClick={() => onNavigate('journey-61ah')}>61 AH Landscape</button>
            <button type="button" className="btn btn-link text-champagne p-0 text-decoration-none" onClick={() => onNavigate('timeline')}>Chronology</button>
            <button type="button" className="btn btn-link text-champagne p-0 text-decoration-none" onClick={() => onNavigate('personalities')}>Personalities</button>
            <button type="button" className="btn btn-link text-champagne p-0 text-decoration-none" onClick={() => onNavigate('pavilion')}>Pavilion</button>
            <button type="button" className="btn btn-link text-champagne p-0 text-decoration-none" onClick={() => onNavigate('historiography')}>Historiography</button>
            <button type="button" className="btn btn-link text-gold-antique p-0 text-decoration-none fw-bold" onClick={() => onNavigate('statistics')}>Zaireen Statistics &amp; Intelligence</button>
            <button type="button" className="btn btn-link text-gold-antique p-0 text-decoration-none fw-bold" onClick={() => onNavigate('journey')}>Airport &amp; Journey</button>
            <button type="button" className="btn btn-link text-gold-antique p-0 text-decoration-none fw-bold" onClick={() => onNavigate('poles')}>Pole Navigation</button>
          </div>

          {/* Legal, Privacy & Compliance Links */}
          <div className="d-flex flex-wrap justify-content-center gap-3 pt-3 border-top border-secondary-subtle small mb-3" style={{ fontSize: '0.74rem' }}>
            <button type="button" className="btn btn-link text-secondary p-0 text-decoration-none" onClick={() => onOpenLegal && onOpenLegal('privacy')}>
              <i className="bi bi-shield-check me-1 text-success"></i> Privacy Policy
            </button>
            <span className="text-secondary">•</span>
            <button type="button" className="btn btn-link text-secondary p-0 text-decoration-none" onClick={() => onOpenLegal && onOpenLegal('terms')}>
              <i className="bi bi-file-earmark-text me-1"></i> Terms of Use
            </button>
            <span className="text-secondary">•</span>
            <button type="button" className="btn btn-link text-secondary p-0 text-decoration-none" onClick={() => onOpenLegal && onOpenLegal('disclaimer')}>
              <i className="bi bi-exclamation-triangle me-1 text-warning"></i> Disclaimer &amp; Telemetry
            </button>
            <span className="text-secondary">•</span>
            <button type="button" className="btn btn-link text-secondary p-0 text-decoration-none" onClick={() => onOpenLegal && onOpenLegal('contact')}>
              <i className="bi bi-building me-1 text-info"></i> Institutional Contacts
            </button>
          </div>

          <div className="small text-secondary" style={{ fontSize: '0.72rem' }}>
            © 61 AH – 1447 AH / 2026 CE • Karbala Digital Heritage Museum • Open Scholarly Heritage
          </div>
        </div>
      </footer>

    </div>
  );
}
