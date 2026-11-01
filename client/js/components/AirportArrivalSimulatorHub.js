const { useState, useEffect, useMemo } = window.React;

import {
  AIRPORTS_DATA,
  ARRIVAL_STEPS,
  TRANSPORT_MODES,
  HOTELS_DATA,
  HOLY_SHRINES_DATA,
  OFFLINE_PACK_DATA
} from '/js/data/zaireenJourneyData.js';

/**
 * Rock-solid image loader with skeleton shimmer and graceful fallback
 */
function ReliableImage({ src, alt, className = '', style = {}, fallbackText = '' }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  return (
    <div className={`reliable-img-container ${className}`} style={{ ...style, position: 'relative', overflow: 'hidden' }}>
      {!loaded && !error && (
        <div className="reliable-img-skeleton">
          <div className="spinner-border spinner-border-sm text-gold-antique" role="status" style={{ opacity: 0.6 }}>
            <span className="visually-hidden">Loading photographic asset...</span>
          </div>
        </div>
      )}
      {error ? (
        <div className="reliable-img-fallback d-flex flex-column align-items-center justify-content-center p-3 text-center">
          <i className="bi bi-image fs-1 mb-2 text-gold-antique opacity-50"></i>
          <span className="small fw-semibold text-gold-antique">{fallbackText || alt}</span>
          <span className="small opacity-50" style={{ fontSize: '0.7rem' }}>Archival Sovereign Photographic Record</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-100 h-100 object-fit-cover"
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.35s ease', display: 'block' }}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}

/**
 * AIRPORT ARRIVAL SIMULATOR & ZAIREEN JOURNEY HUB
 * Phase 1 Add-on: Cinematic imagery, 10-stage arrival simulator,
 * sovereign aviation telemetry, multi-modal journey planner, and offline pack.
 */
export function AirportArrivalSimulatorHub({ onNavigate, onAskAi, onOpenEmergency }) {
  // Navigation tabs: 'airports' | 'simulator' | 'planner' | 'shrines' | 'hotels' | 'offline'
  const [activeTab, setActiveTab] = useState('airports');

  // Selected airport in Airport Explorer
  const [selectedAirportId, setSelectedAirportId] = useState('njf');
  const [activeHeroPhotoIndex, setActiveHeroPhotoIndex] = useState(0);

  useEffect(() => {
    setActiveHeroPhotoIndex(0);
  }, [selectedAirportId]);

  // Current stage in the 10-stage arrival simulator
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem('karbala_arrival_completed_steps');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Journey Planner Customization
  const [planAirport, setPlanAirport] = useState('njf');
  const [planTransport, setPlanTransport] = useState('vip_taxi');
  const [planHotel, setPlanHotel] = useState('the_baron');

  // Selected Shrine in Gallery
  const [selectedShrineId, setSelectedShrineId] = useState('imam_hussain');

  // Offline Travel Wallet State (persisted checklist)
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('karbala_offline_pack_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Currency Converter State
  const [calcAmount, setCalcAmount] = useState(100);
  const [calcCurrency, setCalcCurrency] = useState('USD');

  // Persist completed steps
  const toggleStepCompleted = (stepNumber) => {
    setCompletedSteps(prev => {
      const next = prev.includes(stepNumber) ? prev.filter(s => s !== stepNumber) : [...prev, stepNumber];
      try {
        localStorage.setItem('karbala_arrival_completed_steps', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Persist checklist items
  const toggleChecklistItem = (id) => {
    setCheckedItems(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('karbala_offline_pack_checklist', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const selectedAirport = useMemo(() => {
    return AIRPORTS_DATA.find(a => a.id === selectedAirportId) || AIRPORTS_DATA[0];
  }, [selectedAirportId]);

  const currentStep = useMemo(() => {
    return ARRIVAL_STEPS[currentStepIndex] || ARRIVAL_STEPS[0];
  }, [currentStepIndex]);

  const selectedShrine = useMemo(() => {
    return HOLY_SHRINES_DATA.find(s => s.id === selectedShrineId) || HOLY_SHRINES_DATA[0];
  }, [selectedShrineId]);

  // Journey calculation
  const journeyEstimate = useMemo(() => {
    const airport = AIRPORTS_DATA.find(a => a.id === planAirport) || AIRPORTS_DATA[0];
    const transport = TRANSPORT_MODES.find(t => t.id === planTransport) || TRANSPORT_MODES[0];
    const hotel = HOTELS_DATA.find(h => h.id === planHotel) || HOTELS_DATA[0];

    return {
      airport,
      transport,
      hotel,
      totalDistanceKm: airport.distanceToKarbalaKm,
      totalTravelMin: airport.estimatedDriveMin,
      isNonOperational: airport.status === 'NON_OPERATIONAL'
    };
  }, [planAirport, planTransport, planHotel]);

  // Currency result
  const convertedIQD = useMemo(() => {
    const curr = OFFLINE_PACK_DATA.currencyRates.currencies.find(c => c.code === calcCurrency);
    if (!curr) return 0;
    return Math.round(calcAmount * curr.rateToIQD);
  }, [calcAmount, calcCurrency]);

  const activeHeroPhoto = useMemo(() => {
    if (selectedAirport.gallery && selectedAirport.gallery[activeHeroPhotoIndex]) {
      return selectedAirport.gallery[activeHeroPhotoIndex];
    }
    return {
      url: selectedAirport.heroImage,
      caption: selectedAirport.name,
      credit: selectedAirport.legalAttribution,
      year: '2024'
    };
  }, [selectedAirport, activeHeroPhotoIndex]);

  return (
    <div className="zaireen-journey-hub py-4 px-2 px-md-4" style={{ minHeight: '90vh' }}>
      <div className="container-fluid" style={{ maxWidth: '1440px' }}>

        {/* ================= HEADER SECTION ================= */}
        <header className="zaireen-hub-header mb-4 p-4 rounded-4 position-relative overflow-hidden shadow-lg border">
          <div className="position-absolute top-0 end-0 p-3 opacity-15 d-none d-md-block" style={{ pointerEvents: 'none' }}>
            <i className="bi bi-compass text-gold-antique" style={{ fontSize: '6.5rem', lineHeight: 0.9 }}></i>
          </div>

          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge px-3 py-1.5 rounded-pill font-title fw-bold" style={{ background: 'rgba(198, 166, 107, 0.15)', color: '#dfc08a', border: '1px solid rgba(198, 166, 107, 0.4)' }}>
                  <i className="bi bi-airplane-engines me-1"></i> PHASE 1 ADD-ON • SMART GATEWAYS
                </span>
                <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1 rounded-pill small">
                  100% Offline Ready
                </span>
              </div>
              <h1 className="h2 font-display mb-1 text-adaptive-heading" style={{ letterSpacing: '0.04em' }}>
                Smart Airport Arrival Simulator & Zaireen Journey Hub
              </h1>
              <p className="text-secondary mb-0 small" style={{ maxWidth: '850px', fontSize: '0.86rem' }}>
                Sovereign Iraqi aerial gateways, verified 10-stage arrival telemetry, multi-modal transport planning, sacred sanctuary architectural documentation, and offline travel pack.
              </p>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-warning rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
                onClick={() => onNavigate && onNavigate('statistics')}
                title="View Global Zaireen Statistics Module H"
              >
                <i className="bi bi-bar-chart-fill text-gold-antique"></i>
                <span>Zaireen Statistics</span>
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline-info rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
                onClick={() => onNavigate && onNavigate('poles')}
                title="Smart Arbaeen Pole Navigation (Najaf to Karbala 1,452 Poles)"
              >
                <i className="bi bi-geo-alt-fill text-warning"></i>
                <span>Pole Navigation (1,452 Poles)</span>
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline-danger rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
                onClick={() => onOpenEmergency ? onOpenEmergency() : setActiveTab('offline')}
                title="24/7 Astan & Sovereign Emergency Hotlines"
              >
                <i className="bi bi-telephone-fill"></i>
                <span>Emergency 122 • 104</span>
              </button>

              <button
                type="button"
                className="btn btn-sm rounded-pill px-3 py-2 fw-bold text-dark font-title shadow-sm d-inline-flex align-items-center gap-1.5"
                style={{ background: 'linear-gradient(135deg, #dfc08a 0%, #c6a66b 100%)' }}
                onClick={() => onAskAi && onAskAi('How do I travel safely from Najaf Airport to Karbala?')}
              >
                <i className="bi bi-chat-heart-fill"></i>
                <span>Ask AI Guide</span>
              </button>
            </div>
          </div>

          {/* ================= PRIMARY NAVIGATION TABS ================= */}
          <div className="mt-4 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <nav className="nav nav-pills flex-nowrap overflow-x-auto gap-2 pb-1" role="tablist" style={{ scrollbarWidth: 'none' }}>
              <button
                type="button"
                className={`nav-link px-3 py-2 rounded-pill fw-semibold small text-nowrap d-inline-flex align-items-center gap-2 hub-tab-btn ${activeTab === 'airports' ? 'active' : ''}`}
                onClick={() => setActiveTab('airports')}
              >
                <i className="bi bi-airplane"></i>
                <span>Airport Explorer ({AIRPORTS_DATA.length})</span>
              </button>

              <button
                type="button"
                className={`nav-link px-3 py-2 rounded-pill fw-semibold small text-nowrap d-inline-flex align-items-center gap-2 hub-tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
                onClick={() => setActiveTab('simulator')}
              >
                <i className="bi bi-play-circle-fill"></i>
                <span>10-Stage Arrival Simulator</span>
                <span className="badge rounded-pill bg-dark text-warning ms-1" style={{ fontSize: '0.68rem' }}>
                  {completedSteps.length}/10
                </span>
              </button>

              <button
                type="button"
                className={`nav-link px-3 py-2 rounded-pill fw-semibold small text-nowrap d-inline-flex align-items-center gap-2 hub-tab-btn ${activeTab === 'planner' ? 'active' : ''}`}
                onClick={() => setActiveTab('planner')}
              >
                <i className="bi bi-signpost-split"></i>
                <span>Zaireen Journey Planner</span>
              </button>

              <button
                type="button"
                className={`nav-link px-3 py-2 rounded-pill fw-semibold small text-nowrap d-inline-flex align-items-center gap-2 hub-tab-btn ${activeTab === 'shrines' ? 'active' : ''}`}
                onClick={() => setActiveTab('shrines')}
              >
                <i className="bi bi-bank2"></i>
                <span>Holy Shrines Gallery ({HOLY_SHRINES_DATA.length})</span>
              </button>

              <button
                type="button"
                className={`nav-link px-3 py-2 rounded-pill fw-semibold small text-nowrap d-inline-flex align-items-center gap-2 hub-tab-btn ${activeTab === 'hotels' ? 'active' : ''}`}
                onClick={() => setActiveTab('hotels')}
              >
                <i className="bi bi-buildings"></i>
                <span>Karbala Hotels Directory</span>
              </button>

              <button
                type="button"
                className={`nav-link px-3 py-2 rounded-pill fw-semibold small text-nowrap d-inline-flex align-items-center gap-2 hub-tab-btn ${activeTab === 'offline' ? 'active' : ''}`}
                onClick={() => setActiveTab('offline')}
              >
                <i className="bi bi-wallet2"></i>
                <span>Offline Travel Wallet & Pack</span>
              </button>
            </nav>
          </div>
        </header>

        {/* ================= TAB 1: AIRPORT EXPLORER ================= */}
        {activeTab === 'airports' && (
          <section className="tab-pane-airports">
            {/* Airport Switcher Strip */}
            <div className="row g-3 mb-4">
              {AIRPORTS_DATA.map(airport => {
                const isSelected = airport.id === selectedAirportId;
                const isKib = airport.id === 'kib';
                return (
                  <div key={airport.id} className="col-12 col-sm-6 col-lg-3">
                    <div
                      className={`card zaireen-hub-card h-100 rounded-4 overflow-hidden cursor-pointer transition-all border ${isSelected ? 'shadow-lg' : 'opacity-85'}`}
                      style={{
                        cursor: 'pointer',
                        transform: isSelected ? 'translateY(-2px)' : 'none',
                        borderColor: isSelected ? 'var(--gold-antique)' : 'var(--theme-border)'
                      }}
                      onClick={() => setSelectedAirportId(airport.id)}
                    >
                      <div className="airport-card-thumb-wrap position-relative" style={{ height: '115px' }}>
                        <ReliableImage
                          src={airport.thumbnail || airport.heroImage}
                          alt={airport.name}
                          className="w-100 h-100"
                        />
                        <div className="position-absolute top-0 start-0 p-2">
                          <span className="badge px-2 py-1 font-title fw-bold shadow" style={{ background: isKib ? 'rgba(229, 62, 62, 0.9)' : 'rgba(14, 18, 18, 0.85)', color: isKib ? '#fff' : '#dfc08a', border: '1px solid rgba(198, 166, 107, 0.4)' }}>
                            {airport.code}
                          </span>
                        </div>
                        <div className="position-absolute top-0 end-0 p-2">
                          <span className={`badge rounded-pill shadow ${isKib ? 'bg-danger text-white' : 'bg-success text-white'}`} style={{ fontSize: '0.62rem' }}>
                            {isKib ? 'UNDER CONSTRUCTION' : 'OPERATIONAL'}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 d-flex flex-column flex-grow-1">
                        <h3 className="h6 font-display mb-1">{airport.name}</h3>
                        <div className="font-arabic small opacity-75 mb-2">{airport.arabicName}</div>
                        <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top small opacity-75" style={{ borderColor: 'var(--theme-border-subtle)' }}>
                          <span><i className="bi bi-geo-alt me-1"></i>{airport.distanceToKarbalaKm} km to Haram</span>
                          <span className="text-gold-antique fw-semibold">{airport.estimatedDriveMin} min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Airport Hero Showcase */}
            <div className="card zaireen-hub-card rounded-4 overflow-hidden border shadow-lg mb-4" style={{ borderColor: 'var(--theme-border)' }}>
              <div className="row g-0">
                {/* Hero Visual Card (Left) */}
                <div className="col-12 col-xl-6 position-relative d-flex flex-column" style={{ minHeight: '400px', background: 'var(--bg-obsidian)' }}>
                  <div className="position-relative flex-grow-1" style={{ minHeight: '340px' }}>
                    <ReliableImage
                      src={activeHeroPhoto.url || selectedAirport.heroImage}
                      alt={activeHeroPhoto.caption || selectedAirport.name}
                      className="w-100 h-100"
                      style={{ maxHeight: '460px', minHeight: '340px' }}
                    />
                    <div className="position-absolute top-0 start-0 p-3">
                      <span className={`badge px-3 py-1.5 rounded-pill font-title fw-bold shadow ${selectedAirport.id === 'kib' ? 'bg-danger text-white' : 'bg-success text-white'}`}>
                        {selectedAirport.statusBadge}
                      </span>
                    </div>
                    <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: 'linear-gradient(to top, rgba(10, 13, 18, 0.95) 0%, transparent 100%)' }}>
                      <div className="fw-semibold text-white small mb-1">
                        {activeHeroPhoto.caption || selectedAirport.name}
                      </div>
                      <div className="small text-secondary" style={{ fontSize: '0.74rem' }}>
                        <i className="bi bi-shield-check text-gold-antique me-1"></i>
                        {activeHeroPhoto.credit || selectedAirport.legalAttribution} • {activeHeroPhoto.year || '2024'}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Multi-Photo Gallery Selector Strip */}
                  {selectedAirport.gallery && selectedAirport.gallery.length > 1 && (
                    <div className="p-2.5 border-top" style={{ borderColor: 'var(--theme-border-subtle)', background: 'var(--bg-charcoal)' }}>
                      <div className="d-flex justify-content-between align-items-center mb-1.5 px-1">
                        <span className="small text-uppercase fw-bold text-gold-antique" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>
                          <i className="bi bi-images me-1"></i> Verified Authentic Photographic Archive ({selectedAirport.gallery.length} Views)
                        </span>
                        <span className="small opacity-50" style={{ fontSize: '0.65rem' }}>Select view</span>
                      </div>
                      <div className="airport-gallery-strip px-1">
                        {selectedAirport.gallery.map((photo, idx) => (
                          <div
                            key={idx}
                            className={`airport-gallery-thumb ${idx === activeHeroPhotoIndex ? 'active' : ''}`}
                            onClick={() => setActiveHeroPhotoIndex(idx)}
                            title={photo.caption}
                          >
                            <img src={photo.url} alt={photo.caption} loading="lazy" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Airport Specifications & Operational Intelligence (Right) */}
                <div className="col-12 col-xl-6 p-4 d-flex flex-column justify-content-between">
                  <div>
                    {selectedAirport.id === 'kib' && (
                      <div className="alert alert-danger p-3 rounded-3 mb-3 border-danger-subtle" role="alert">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <i className="bi bi-exclamation-octagon-fill fs-5 text-danger"></i>
                          <strong className="text-danger">SOVEREIGN PILGRIM TRAVEL WARNING</strong>
                        </div>
                        <p className="small mb-0 opacity-75">
                          Karbala International Airport is currently <strong>UNDER CONSTRUCTION</strong>. The 4.5km runway and ATC tower are structurally erected, but passenger terminals, navigation aids, and commercial flight permits are pending. <strong>Do NOT book flight tickets claiming to land at Karbala Airport</strong>. Use Najaf (NJF) or Baghdad (BGW).
                        </p>
                      </div>
                    )}

                    <div className="d-flex flex-wrap align-items-baseline gap-2 mb-1">
                      <h2 className="h3 font-display mb-0">{selectedAirport.name}</h2>
                      <span className="font-arabic text-gold-antique fs-5">({selectedAirport.arabicName})</span>
                    </div>

                    <p className="small opacity-75 mb-3">
                      {selectedAirport.city}, {selectedAirport.province} • Coordinates: {selectedAirport.coordinates.lat}° N, {selectedAirport.coordinates.lng}° E
                    </p>

                    <p className="small mb-4 opacity-85" style={{ lineHeight: 1.6 }}>
                      {selectedAirport.description}
                    </p>

                    {/* Telemetry Grid */}
                    <div className="row g-2 mb-4">
                      <div className="col-6 col-sm-4">
                        <div className="p-2.5 rounded-3 zaireen-surface-box border">
                          <div className="opacity-75 small" style={{ fontSize: '0.72rem' }}>DISTANCE TO HARAM</div>
                          <div className="fw-bold text-gold-antique">{selectedAirport.distanceToKarbalaKm} km</div>
                        </div>
                      </div>
                      <div className="col-6 col-sm-4">
                        <div className="p-2.5 rounded-3 zaireen-surface-box border">
                          <div className="opacity-75 small" style={{ fontSize: '0.72rem' }}>ESTIMATED DRIVE</div>
                          <div className="fw-bold">{selectedAirport.estimatedDriveMin} minutes</div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="p-2.5 rounded-3 zaireen-surface-box border">
                          <div className="opacity-75 small" style={{ fontSize: '0.72rem' }}>PILGRIM TRAFFIC SHARE</div>
                          <div className="fw-bold text-info">{selectedAirport.trafficSharePct}</div>
                        </div>
                      </div>
                    </div>

                    {/* Key Facilities List */}
                    <div className="mb-4">
                      <div className="small font-title fw-bold text-secondary mb-2 letter-spacing-1">
                        VERIFIED AIRPORT INFRASTRUCTURE & FACILITIES
                      </div>
                      <ul className="list-unstyled d-flex flex-column gap-1.5 mb-0">
                        {selectedAirport.facilities.map((fac, idx) => (
                          <li key={idx} className="small d-flex align-items-start gap-2 text-white-50">
                            <i className="bi bi-check2-circle text-gold-antique mt-0.5"></i>
                            <span>{fac}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Transport Options Table */}
                    <div className="mb-3">
                      <div className="small font-title fw-bold text-secondary mb-2 letter-spacing-1">
                        OFFICIAL GROUND TRANSPORTATION FARES TO KARBALA
                      </div>
                      <div className="table-responsive rounded-3 border border-dark">
                        <table className="table table-dark table-sm mb-0 small">
                          <thead>
                            <tr className="text-secondary" style={{ fontSize: '0.72rem' }}>
                              <th>TRANSPORT MODE</th>
                              <th>OFFICIAL FARE (IQD)</th>
                              <th>EST. USD</th>
                              <th>DURATION</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedAirport.transportOptions.map((opt, idx) => (
                              <tr key={idx}>
                                <td className="fw-semibold text-white">{opt.mode}</td>
                                <td className="text-gold-antique">{opt.fareIQD}</td>
                                <td className="text-white-50">{opt.fareUSD}</td>
                                <td><span className="badge bg-dark border border-secondary text-light">{opt.duration}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Expert Advice Banner */}
                  <div className="p-3 rounded-3 mt-2 border" style={{ background: 'rgba(198, 166, 107, 0.08)', borderColor: 'rgba(198, 166, 107, 0.25)' }}>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <i className="bi bi-lightbulb-fill text-warning"></i>
                      <strong className="text-warning small">AIRPORT SURVIVAL TIP</strong>
                    </div>
                    <div className="small text-white-50" style={{ fontSize: '0.8rem' }}>
                      {selectedAirport.tips}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= TAB 2: 10-STAGE ARRIVAL SIMULATOR ================= */}
        {activeTab === 'simulator' && (
          <section className="tab-pane-simulator">
            {/* Step Progress Bar Header */}
            <div className="card p-3 rounded-4 border mb-4 shadow" style={{ background: '#121820', borderColor: 'rgba(198, 166, 107, 0.3)' }}>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                <div>
                  <span className="small text-secondary font-title">SEQUENTIAL ARRIVAL PROGRESS</span>
                  <div className="fw-bold text-white fs-6">
                    Step {currentStepIndex + 1} of 10: <span className="text-gold-antique">{currentStep.title}</span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-dark border border-gold-subtle text-warning">
                    {completedSteps.length} of 10 Completed
                  </span>
                  <button
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5 ${completedSteps.includes(currentStep.stepNumber) ? 'btn-success text-white' : 'btn-outline-warning'}`}
                    onClick={() => toggleStepCompleted(currentStep.stepNumber)}
                  >
                    <i className={`bi ${completedSteps.includes(currentStep.stepNumber) ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
                    <span>{completedSteps.includes(currentStep.stepNumber) ? 'Step Completed' : 'Mark as Done'}</span>
                  </button>
                </div>
              </div>

              {/* Visual 10-step progress strip */}
              <div className="position-relative my-2">
                <div className="progress" style={{ height: '6px', background: 'rgba(255,255,255,0.08)' }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${((currentStepIndex + 1) / 10) * 100}%`,
                      background: 'linear-gradient(90deg, #c6a66b, #48bb78)'
                    }}
                  ></div>
                </div>
              </div>

              {/* 10 Step Buttons Pill Strip */}
              <div className="d-flex flex-nowrap overflow-x-auto gap-1.5 pt-2" style={{ scrollbarWidth: 'none' }}>
                {ARRIVAL_STEPS.map((step, idx) => {
                  const isActive = idx === currentStepIndex;
                  const isDone = completedSteps.includes(step.stepNumber);
                  return (
                    <button
                      key={step.id}
                      type="button"
                      className={`btn btn-sm rounded-3 py-1 px-2.5 text-nowrap small font-title fw-semibold d-inline-flex align-items-center gap-1.5 transition-all ${isActive ? 'btn-warning text-dark shadow' : isDone ? 'btn-dark text-success border border-success' : 'btn-dark text-secondary border border-secondary-subtle'}`}
                      onClick={() => setCurrentStepIndex(idx)}
                      style={{ fontSize: '0.72rem' }}
                    >
                      <span>{step.stepNumber}.</span>
                      <i className={`bi ${step.icon}`}></i>
                      <span className="d-none d-md-inline">{step.title.split(' ')[0]}</span>
                      {isDone && <i className="bi bi-check-circle-fill text-success ms-0.5"></i>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step Detail Card */}
            <div className="card zaireen-hub-card rounded-4 overflow-hidden border shadow-lg mb-4" style={{ borderColor: 'var(--theme-border)' }}>
              <div className="row g-0">
                {/* Visual Image Preview */}
                <div className="col-12 col-lg-6 position-relative" style={{ minHeight: '360px', background: 'var(--bg-obsidian)' }}>
                  <ReliableImage
                    src={currentStep.image}
                    alt={currentStep.title}
                    className="w-100 h-100"
                    style={{ minHeight: '360px', maxHeight: '480px' }}
                    fallbackText={currentStep.title}
                  />
                  <div className="position-absolute top-0 start-0 p-3 d-flex gap-2">
                    <span className="badge px-3 py-1.5 rounded-pill font-title fw-bold shadow text-dark" style={{ background: 'linear-gradient(135deg, #dfc08a, #c6a66b)' }}>
                      {currentStep.badge}
                    </span>
                    <span className="badge px-3 py-1.5 rounded-pill bg-dark bg-opacity-75 border border-secondary text-white small">
                      <i className="bi bi-clock me-1"></i> {currentStep.estTime}
                    </span>
                  </div>
                  <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: 'linear-gradient(to top, rgba(10, 13, 18, 0.95) 0%, transparent 100%)' }}>
                    <div className="font-arabic text-warning fs-5 mb-1">{currentStep.arabicTitle}</div>
                    <div className="small text-white-50">{currentStep.summary}</div>
                  </div>
                </div>

                {/* Step Instructions & Verification Checklist */}
                <div className="col-12 col-lg-6 p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge bg-dark border border-gold-subtle text-gold-antique px-2 py-1 small">
                        <i className={`bi ${currentStep.icon} me-1`}></i> STAGE TELEMETRY
                      </span>
                      {completedSteps.includes(currentStep.stepNumber) && (
                        <span className="badge bg-success-subtle text-success small">
                          <i className="bi bi-check-all me-1"></i> Verified
                        </span>
                      )}
                    </div>

                    <h2 className="h4 font-display text-white mb-2">{currentStep.title}</h2>
                    <p className="text-secondary small mb-3">{currentStep.summary}</p>

                    {/* Step Action Checklist */}
                    <div className="mb-3">
                      <div className="small font-title fw-bold text-secondary mb-2 letter-spacing-1">
                        MANDATORY TRAVEL ACTIONS & PROTOCOLS
                      </div>
                      <div className="d-flex flex-column gap-2">
                        {currentStep.checklist.map((item, idx) => (
                          <div key={idx} className="p-2.5 rounded-3 bg-dark border border-dark-subtle d-flex align-items-start gap-2.5">
                            <span className="badge rounded-circle bg-secondary bg-opacity-25 text-gold-antique" style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem' }}>
                              {idx + 1}
                            </span>
                            <span className="small text-white-50" style={{ lineHeight: 1.5 }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Telemetry Row */}
                    <div className="p-2.5 rounded-3 bg-dark border border-secondary-subtle mb-3">
                      <div className="row g-2 text-center">
                        {Object.entries(currentStep.telemetry).map(([key, val], idx) => (
                          <div key={idx} className="col-4">
                            <div className="text-secondary small text-uppercase" style={{ fontSize: '0.65rem' }}>{key}</div>
                            <div className="small fw-bold text-white text-truncate">{val}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Expert Advice Box */}
                    <div className="p-3 rounded-3 border" style={{ background: 'rgba(198, 166, 107, 0.08)', borderColor: 'rgba(198, 166, 107, 0.25)' }}>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <i className="bi bi-patch-check-fill text-warning"></i>
                        <strong className="text-warning small">EXPERT PILGRIM GUIDANCE</strong>
                      </div>
                      <div className="small text-white-50" style={{ fontSize: '0.8rem' }}>
                        {currentStep.expertAdvice}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Prev / Next Buttons */}
                  <div className="d-flex justify-content-between align-items-center pt-3 mt-3 border-top border-dark-subtle">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1.5"
                      disabled={currentStepIndex === 0}
                      onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                    >
                      <i className="bi bi-arrow-left"></i>
                      <span>Previous Stage</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-warning btn-sm rounded-pill px-4 py-1.5 fw-bold text-dark font-title shadow-sm d-inline-flex align-items-center gap-1.5"
                      onClick={() => {
                        if (currentStepIndex < ARRIVAL_STEPS.length - 1) {
                          setCurrentStepIndex(prev => prev + 1);
                        } else {
                          setActiveTab('planner');
                        }
                      }}
                    >
                      <span>{currentStepIndex === ARRIVAL_STEPS.length - 1 ? 'Go to Journey Planner' : 'Next Stage'}</span>
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= TAB 3: ZAIREEN JOURNEY PLANNER ================= */}
        {activeTab === 'planner' && (
          <section className="tab-pane-planner">
            {/* Sequential Flow Banner: Airport -> Transport -> Hotel -> Shrine -> Ziyarat */}
            <div className="card p-3 rounded-4 border mb-4 shadow" style={{ background: '#121820', borderColor: 'rgba(198, 166, 107, 0.3)' }}>
              <div className="small font-title fw-bold text-secondary mb-2 letter-spacing-1 text-center">
                COMPLETE VISUAL PILGRIMAGE CONDUIT: AERIAL ARRIVAL TO SACRED SANCTUARY
              </div>
              <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 py-2">
                <span className="badge px-3 py-2 rounded-pill bg-dark border border-gold-subtle text-gold-antique fw-bold">
                  <i className="bi bi-airplane-engines me-1"></i> 1. Airport Arrival
                </span>
                <i className="bi bi-arrow-right text-secondary d-none d-sm-inline"></i>
                <span className="badge px-3 py-2 rounded-pill bg-dark border border-gold-subtle text-info fw-bold">
                  <i className="bi bi-taxi-front-fill me-1"></i> 2. Ground Transit
                </span>
                <i className="bi bi-arrow-right text-secondary d-none d-sm-inline"></i>
                <span className="badge px-3 py-2 rounded-pill bg-dark border border-gold-subtle text-warning fw-bold">
                  <i className="bi bi-building me-1"></i> 3. Karbala Hotel
                </span>
                <i className="bi bi-arrow-right text-secondary d-none d-sm-inline"></i>
                <span className="badge px-3 py-2 rounded-pill bg-dark border border-gold-subtle text-success fw-bold">
                  <i className="bi bi-moon-stars-fill me-1"></i> 4. Bayn al-Haramayn
                </span>
                <i className="bi bi-arrow-right text-secondary d-none d-sm-inline"></i>
                <span className="badge px-3 py-2 rounded-pill text-dark fw-bold" style={{ background: 'linear-gradient(135deg, #dfc08a, #c6a66b)' }}>
                  <i className="bi bi-heart-fill me-1"></i> 5. Sacred Ziyarat
                </span>
              </div>
            </div>

            {/* Interactive Route Configurator */}
            <div className="row g-4 mb-4">
              {/* Left Column: Interactive Selectors */}
              <div className="col-12 col-lg-7">
                {/* 1. Airport Selector */}
                <div className="card p-3 rounded-4 border mb-3" style={{ background: '#121820', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <label className="small font-title fw-bold text-gold-antique mb-2 d-flex align-items-center gap-2">
                    <span className="badge rounded-circle bg-warning text-dark" style={{ width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
                    SELECT ARRIVAL AIRPORT GATEWAY:
                  </label>
                  <div className="row g-2">
                    {AIRPORTS_DATA.map(airport => (
                      <div key={airport.id} className="col-6 col-sm-3">
                        <button
                          type="button"
                          className={`btn w-100 text-start p-2 rounded-3 border transition-all ${planAirport === airport.id ? 'btn-warning text-dark fw-bold border-warning' : 'btn-dark text-white-50 border-secondary-subtle'}`}
                          onClick={() => setPlanAirport(airport.id)}
                          style={{ fontSize: '0.78rem' }}
                        >
                          <div className="fw-bold">{airport.code}</div>
                          <div className="text-truncate small">{airport.city}</div>
                          {airport.id === 'kib' && <span className="badge bg-danger text-white mt-1" style={{ fontSize: '0.6rem' }}>Closed</span>}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Transport Mode Selector */}
                <div className="card p-3 rounded-4 border mb-3" style={{ background: '#121820', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <label className="small font-title fw-bold text-info mb-2 d-flex align-items-center gap-2">
                    <span className="badge rounded-circle bg-info text-dark" style={{ width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                    SELECT HIGHWAY GROUND TRANSPORT:
                  </label>
                  <div className="row g-2">
                    {TRANSPORT_MODES.map(t => (
                      <div key={t.id} className="col-12 col-md-4">
                        <div
                          className={`p-2.5 rounded-3 border cursor-pointer transition-all ${planTransport === t.id ? 'bg-dark border-info shadow-sm' : 'bg-dark-subtle border-secondary-subtle opacity-75'}`}
                          onClick={() => setPlanTransport(t.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="fw-bold text-white small mb-1">{t.name.split('(')[0]}</div>
                          <div className="text-gold-antique small fw-semibold">{t.fareRangeIQD}</div>
                          <div className="text-secondary small" style={{ fontSize: '0.7rem' }}>{t.capacity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Hotel Selector */}
                <div className="card p-3 rounded-4 border mb-3" style={{ background: '#121820', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <label className="small font-title fw-bold text-warning mb-2 d-flex align-items-center gap-2">
                    <span className="badge rounded-circle bg-warning text-dark" style={{ width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                    SELECT KARBALA ACCOMMODATION:
                  </label>
                  <div className="row g-2">
                    {HOTELS_DATA.map(h => (
                      <div key={h.id} className="col-12 col-md-4">
                        <div
                          className={`p-2.5 rounded-3 border cursor-pointer transition-all ${planHotel === h.id ? 'bg-dark border-warning shadow-sm' : 'bg-dark-subtle border-secondary-subtle opacity-75'}`}
                          onClick={() => setPlanHotel(h.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="fw-bold text-white small mb-1">{h.name}</div>
                          <div className="text-warning small" style={{ fontSize: '0.72rem' }}>★ {h.stars} Stars • {h.rating}/5</div>
                          <div className="text-secondary small" style={{ fontSize: '0.68rem' }}>{h.distanceToHaram}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Calculated Journey Telemetry Card */}
              <div className="col-12 col-lg-5">
                <div className="card h-100 p-4 rounded-4 border shadow-lg d-flex flex-column justify-content-between" style={{ background: 'linear-gradient(145deg, #151d28 0%, #0d121a 100%)', borderColor: 'rgba(198, 166, 107, 0.4)' }}>
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="badge px-3 py-1.5 rounded-pill font-title fw-bold text-dark" style={{ background: 'linear-gradient(135deg, #dfc08a, #c6a66b)' }}>
                        CALCULATED ROUTE TELEMETRY
                      </span>
                      <span className="small text-secondary font-monospace">GPS VERIFIED</span>
                    </div>

                    {journeyEstimate.isNonOperational && (
                      <div className="alert alert-danger p-2.5 rounded-3 mb-3 small">
                        <strong>Warning:</strong> Karbala Airport (KIB) is under construction. Calculated route is hypothetical. Use Najaf (NJF) or Baghdad (BGW).
                      </div>
                    )}

                    <h3 className="h5 font-display text-white mb-3">
                      {journeyEstimate.airport.city} Airport → {journeyEstimate.hotel.name}
                    </h3>

                    {/* Route Metric Badges */}
                    <div className="row g-2 mb-4">
                      <div className="col-6">
                        <div className="p-3 rounded-3 bg-dark border border-secondary-subtle text-center">
                          <div className="text-secondary small" style={{ fontSize: '0.7rem' }}>HIGHWAY DISTANCE</div>
                          <div className="h4 font-display text-gold-antique mb-0">{journeyEstimate.totalDistanceKm} km</div>
                          <div className="text-secondary small" style={{ fontSize: '0.68rem' }}>Divided Expressway</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-3 rounded-3 bg-dark border border-secondary-subtle text-center">
                          <div className="text-secondary small" style={{ fontSize: '0.7rem' }}>ESTIMATED TIME</div>
                          <div className="h4 font-display text-white mb-0">{journeyEstimate.totalTravelMin} min</div>
                          <div className="text-secondary small" style={{ fontSize: '0.68rem' }}>Normal traffic flow</div>
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Conduit Preview */}
                    <div className="d-flex flex-column gap-2 mb-4">
                      <div className="p-2.5 rounded-3 bg-dark border border-dark-subtle d-flex align-items-center gap-3">
                        <i className="bi bi-airplane-engines text-gold-antique fs-5"></i>
                        <div>
                          <div className="fw-semibold text-white small">Depart: {journeyEstimate.airport.name}</div>
                          <div className="text-secondary small" style={{ fontSize: '0.7rem' }}>{journeyEstimate.airport.city} Terminal Exit</div>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-3 bg-dark border border-dark-subtle d-flex align-items-center gap-3">
                        <i className="bi bi-taxi-front-fill text-info fs-5"></i>
                        <div>
                          <div className="fw-semibold text-white small">Transit: {journeyEstimate.transport.name}</div>
                          <div className="text-gold-antique small" style={{ fontSize: '0.7rem' }}>Fare: {journeyEstimate.transport.fareRangeIQD} ({journeyEstimate.transport.fareUSD})</div>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-3 bg-dark border border-dark-subtle d-flex align-items-center gap-3">
                        <i className="bi bi-building text-warning fs-5"></i>
                        <div>
                          <div className="fw-semibold text-white small">Stay: {journeyEstimate.hotel.name}</div>
                          <div className="text-secondary small" style={{ fontSize: '0.7rem' }}>{journeyEstimate.hotel.distanceToHaram} • {journeyEstimate.hotel.shuttle}</div>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-3 bg-dark border border-dark-subtle d-flex align-items-center gap-3">
                        <i className="bi bi-moon-stars-fill text-success fs-5"></i>
                        <div>
                          <div className="fw-semibold text-white small">Sacred Destination: Bayn al-Haramayn</div>
                          <div className="text-success small" style={{ fontSize: '0.7rem' }}>Imam Hussain & Al-Abbas Holy Shrines</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-top border-dark-subtle d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-warning w-100 rounded-pill py-2 small fw-semibold"
                      onClick={() => setActiveTab('offline')}
                    >
                      <i className="bi bi-wallet2 me-1"></i> Save to Offline Pack
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning w-100 rounded-pill py-2 small fw-bold text-dark font-title"
                      onClick={() => onNavigate && onNavigate('map')}
                    >
                      <i className="bi bi-compass-fill me-1"></i> View on Map
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= TAB 4: HOLY SHRINES OF IRAQ GALLERY ================= */}
        {activeTab === 'shrines' && (
          <section className="tab-pane-shrines">
            {/* Shrine Selector Strip */}
            <div className="row g-2 mb-4">
              {HOLY_SHRINES_DATA.map(shrine => {
                const isSelected = shrine.id === selectedShrineId;
                return (
                  <div key={shrine.id} className="col-12 col-sm-6 col-lg">
                    <button
                      type="button"
                      className={`btn w-100 p-2.5 rounded-4 text-start border transition-all ${isSelected ? 'btn-warning text-dark fw-bold shadow-lg border-warning' : 'btn-dark text-white-50 border-secondary-subtle'}`}
                      onClick={() => setSelectedShrineId(shrine.id)}
                    >
                      <div className="fw-bold small text-truncate">{shrine.title.split('(')[0]}</div>
                      <div className="font-arabic small" style={{ fontSize: '0.75rem' }}>{shrine.arabicTitle}</div>
                      <div className="small opacity-75 mt-1" style={{ fontSize: '0.68rem' }}>{shrine.city}</div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Selected Shrine Cinematic Card */}
            <div className="card zaireen-hub-card rounded-4 overflow-hidden border shadow-lg mb-4" style={{ borderColor: 'var(--theme-border)' }}>
              <div className="row g-0">
                {/* High Resolution Architectural Visual */}
                <div className="col-12 col-xl-6 position-relative" style={{ minHeight: '400px', background: 'var(--bg-obsidian)' }}>
                  <ReliableImage
                    src={selectedShrine.image}
                    alt={selectedShrine.title}
                    className="w-100 h-100"
                    style={{ minHeight: '400px', maxHeight: '540px' }}
                    fallbackText={selectedShrine.title}
                  />
                  <div className="position-absolute top-0 start-0 p-3">
                    <span className="badge px-3 py-1.5 rounded-pill font-title fw-bold shadow text-dark" style={{ background: 'linear-gradient(135deg, #dfc08a, #c6a66b)' }}>
                      SACRED HERITAGE ARCHITECTURE
                    </span>
                  </div>
                  <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: 'linear-gradient(to top, rgba(10, 13, 18, 0.95) 0%, transparent 100%)' }}>
                    <div className="font-arabic text-warning fs-4 mb-1">{selectedShrine.arabicTitle}</div>
                    <div className="small text-secondary" style={{ fontSize: '0.75rem' }}>
                      <i className="bi bi-geo-alt text-gold-antique me-1"></i>
                      {selectedShrine.city} • {selectedShrine.epoch}
                    </div>
                  </div>
                </div>

                {/* Shrine Architectural Specs & Ziyarat Recitation */}
                <div className="col-12 col-xl-6 p-4 d-flex flex-column justify-content-between">
                  <div>
                    <h2 className="h3 font-display text-white mb-1">{selectedShrine.title}</h2>
                    <p className="text-secondary small mb-3">{selectedShrine.significance}</p>

                    {/* Architectural Specs Grid */}
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <div className="p-2.5 rounded-3 bg-dark border border-secondary-subtle">
                          <div className="text-secondary small" style={{ fontSize: '0.7rem' }}>GOLDEN DOME HEIGHT</div>
                          <div className="fw-bold text-gold-antique small">{selectedShrine.domeHeight}</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-2.5 rounded-3 bg-dark border border-secondary-subtle">
                          <div className="text-secondary small" style={{ fontSize: '0.7rem' }}>MINARETS & TOWERS</div>
                          <div className="fw-bold text-white small">{selectedShrine.minarets}</div>
                        </div>
                      </div>
                    </div>

                    {/* Sacred Gates (Abwab) */}
                    <div className="mb-3">
                      <div className="small font-title fw-bold text-secondary mb-2 letter-spacing-1">
                        HISTORIC SANCTUARY GATES (الأبواب الشريفة)
                      </div>
                      <div className="row g-1.5">
                        {selectedShrine.keyGates.map((gate, idx) => (
                          <div key={idx} className="col-12 col-sm-6">
                            <div className="p-2 rounded-2 bg-dark border border-dark-subtle small">
                              <span className="fw-semibold text-warning d-block">{gate.name}</span>
                              <span className="text-white-50" style={{ fontSize: '0.72rem' }}>{gate.role}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Classical Ziyarat Supplication Excerpt */}
                    <div className="p-3 rounded-3 border mb-3" style={{ background: 'rgba(198, 166, 107, 0.08)', borderColor: 'rgba(198, 166, 107, 0.3)' }}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small font-title fw-bold text-gold-antique">{selectedShrine.ziyaratTitle}</span>
                        <span className="badge bg-dark border border-gold-subtle text-secondary small" style={{ fontSize: '0.65rem' }}>AUTHENTIC TEXT</span>
                      </div>
                      <div className="font-arabic text-warning fs-5 my-2 text-end" style={{ direction: 'rtl', lineHeight: 1.8 }}>
                        {selectedShrine.ziyaratExcerpt}
                      </div>
                      <div className="small text-white-50 fst-italic" style={{ fontSize: '0.78rem' }}>
                        "{selectedShrine.ziyaratTranslation}"
                      </div>
                    </div>
                  </div>

                  <div className="small text-secondary pt-2 border-top border-dark-subtle">
                    {selectedShrine.attribution}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= TAB 5: KARBALA HOTELS DIRECTORY ================= */}
        {activeTab === 'hotels' && (
          <section className="tab-pane-hotels">
            <div className="row g-4">
              {HOTELS_DATA.map(hotel => (
                <div key={hotel.id} className="col-12 col-lg-4">
                  <div className="card zaireen-hub-card h-100 rounded-4 overflow-hidden border shadow-lg d-flex flex-column" style={{ borderColor: 'var(--theme-border)' }}>
                    {/* Hotel Visual Card */}
                    <div className="position-relative" style={{ height: '220px', background: 'var(--bg-obsidian)' }}>
                      <ReliableImage
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-100 h-100"
                        fallbackText={hotel.name}
                      />
                      <div className="position-absolute top-0 start-0 p-3">
                        <span className="badge px-3 py-1.5 rounded-pill bg-dark bg-opacity-75 border border-gold-subtle text-warning font-title fw-bold">
                          {'★'.repeat(hotel.stars)} {hotel.stars}-STAR LUXURY
                        </span>
                      </div>
                      <div className="position-absolute bottom-0 start-0 w-100 p-2.5" style={{ background: 'linear-gradient(to top, rgba(10, 13, 18, 0.95) 0%, transparent 100%)' }}>
                        <div className="font-arabic text-warning small">{hotel.arabicName}</div>
                      </div>
                    </div>

                    {/* Hotel Details */}
                    <div className="p-4 d-flex flex-column justify-content-between flex-grow-1">
                      <div>
                        <h3 className="h5 font-display text-white mb-1">{hotel.name}</h3>
                        <div className="small text-gold-antique fw-semibold mb-2">
                          <i className="bi bi-geo-alt me-1"></i> {hotel.distanceToHaram}
                        </div>
                        <div className="p-2 rounded-2 bg-dark border border-secondary-subtle small text-white-50 mb-3" style={{ fontSize: '0.78rem' }}>
                          <i className="bi bi-bus-front text-info me-1"></i>
                          <strong>Shuttle:</strong> {hotel.shuttle}
                        </div>

                        {/* Feature Badges */}
                        <div className="small font-title fw-bold text-secondary mb-2 letter-spacing-1">
                          AMENITIES & SERVICES
                        </div>
                        <ul className="list-unstyled d-flex flex-column gap-1.5 mb-3">
                          {hotel.features.map((feat, idx) => (
                            <li key={idx} className="small d-flex align-items-start gap-2 text-white-50" style={{ fontSize: '0.78rem' }}>
                              <i className="bi bi-check2 text-gold-antique mt-0.5"></i>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-3 border-top border-dark-subtle d-flex justify-content-between align-items-center">
                        <span className="small text-secondary font-monospace">{hotel.phone}</span>
                        <a
                          href={`tel:${hotel.phone}`}
                          className="btn btn-sm btn-outline-warning rounded-pill px-3 py-1 fw-semibold"
                        >
                          <i className="bi bi-telephone-fill me-1"></i> Call Desk
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= TAB 6: OFFLINE TRAVEL WALLET & PACK ================= */}
        {activeTab === 'offline' && (
          <section className="tab-pane-offline">
            {/* 100% Offline Notice Banner */}
            <div className="card p-3 rounded-4 border mb-4 shadow" style={{ background: 'linear-gradient(135deg, rgba(16, 59, 50, 0.4) 0%, rgba(10, 13, 18, 0.95) 100%)', borderColor: 'rgba(72, 187, 120, 0.4)' }}>
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-wifi-off fs-3 text-success"></i>
                <div>
                  <strong className="text-success">100% OFFLINE TRAVEL WALLET ACTIVE</strong>
                  <p className="small text-white-50 mb-0">
                    All guides, checklists, phone numbers, and phrase cards are saved locally in your browser cache. This interface operates completely without internet connectivity during transit across Iraqi borders and checkpoints.
                  </p>
                </div>
              </div>
            </div>

            <div className="row g-4">
              {/* Left Column: Interactive Pre-Flight Checklist */}
              <div className="col-12 col-lg-6">
                <div className="card h-100 p-4 rounded-4 border shadow" style={{ background: '#121820', borderColor: 'rgba(198, 166, 107, 0.3)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-check2-square text-gold-antique fs-5"></i>
                      <h3 className="h6 font-display text-white mb-0">ZAIREEN ESSENTIAL CHECKLIST</h3>
                    </div>
                    <span className="badge bg-dark border border-gold-subtle text-warning">
                      {Object.values(checkedItems).filter(Boolean).length} of {OFFLINE_PACK_DATA.checklists.length} Packed
                    </span>
                  </div>

                  <p className="text-secondary small mb-3">
                    Check off each essential document and item before boarding. Your progress is saved automatically to device storage.
                  </p>

                  <div className="d-flex flex-column gap-2 mb-3">
                    {OFFLINE_PACK_DATA.checklists.map(item => {
                      const isChecked = !!checkedItems[item.id];
                      return (
                        <div
                          key={item.id}
                          className={`p-2.5 rounded-3 border cursor-pointer transition-all d-flex align-items-center justify-content-between ${isChecked ? 'bg-success-subtle border-success text-white' : 'bg-dark border-dark-subtle text-white-50'}`}
                          onClick={() => toggleChecklistItem(item.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex align-items-center gap-2.5">
                            <i className={`bi ${isChecked ? 'bi-check-square-fill text-success fs-5' : 'bi-square text-secondary fs-5'}`}></i>
                            <span className={`small ${isChecked ? 'text-decoration-line-through text-white' : 'text-light'}`} style={{ fontSize: '0.82rem' }}>
                              {item.label}
                            </span>
                          </div>
                          <span className="badge bg-dark text-secondary small text-uppercase" style={{ fontSize: '0.62rem' }}>
                            {item.category}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary rounded-pill mt-auto"
                    onClick={() => {
                      setCheckedItems({});
                      try { localStorage.removeItem('karbala_offline_pack_checklist'); } catch(e) {}
                    }}
                  >
                    Reset Checklist
                  </button>
                </div>
              </div>

              {/* Right Column: Currency Converter & Emergency Hotlines */}
              <div className="col-12 col-lg-6 d-flex flex-column gap-4">
                {/* Instant Offline Currency Converter */}
                <div className="card p-4 rounded-4 border shadow" style={{ background: '#121820', borderColor: 'rgba(198, 166, 107, 0.3)' }}>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <i className="bi bi-cash-stack text-warning fs-5"></i>
                    <h3 className="h6 font-display text-white mb-0">OFFLINE CURRENCY CONVERTER (IQD)</h3>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-7">
                      <label className="text-secondary small mb-1" style={{ fontSize: '0.72rem' }}>AMOUNT TO CONVERT</label>
                      <input
                        type="number"
                        className="form-control form-control-sm bg-dark text-white border-secondary"
                        value={calcAmount}
                        onChange={(e) => setCalcAmount(Math.max(0, Number(e.target.value)))}
                      />
                    </div>
                    <div className="col-5">
                      <label className="text-secondary small mb-1" style={{ fontSize: '0.72rem' }}>CURRENCY</label>
                      <select
                        className="form-select form-select-sm bg-dark text-white border-secondary"
                        value={calcCurrency}
                        onChange={(e) => setCalcCurrency(e.target.value)}
                      >
                        {OFFLINE_PACK_DATA.currencyRates.currencies.map(c => (
                          <option key={c.code} value={c.code}>{c.code} ({c.name})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="p-3 rounded-3 bg-dark border border-gold-subtle text-center">
                    <div className="text-secondary small" style={{ fontSize: '0.72rem' }}>ESTIMATED VALUE IN IRAQI DINAR</div>
                    <div className="h3 font-display text-gold-antique mb-0">
                      {convertedIQD.toLocaleString()} IQD
                    </div>
                    <div className="text-secondary small" style={{ fontSize: '0.7rem' }}>
                      Central Bank Reference: 1 USD ≈ {OFFLINE_PACK_DATA.currencyRates.baseRateIQDPerUSD} IQD
                    </div>
                  </div>
                </div>

                {/* 24/7 Verified Emergency Hotlines */}
                <div className="card p-4 rounded-4 border shadow" style={{ background: '#121820', borderColor: 'rgba(229, 62, 62, 0.3)' }}>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <i className="bi bi-shield-fill-exclamation text-danger fs-5"></i>
                    <h3 className="h6 font-display text-white mb-0">24/7 VERIFIED EMERGENCY HOTLINES</h3>
                  </div>

                  <div className="d-flex flex-column gap-2">
                    {OFFLINE_PACK_DATA.emergencyContacts.map((contact, idx) => (
                      <div key={idx} className="p-2.5 rounded-3 bg-dark border border-dark-subtle d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-semibold text-white small">{contact.title}</div>
                          <div className="text-secondary small" style={{ fontSize: '0.7rem' }}>{contact.desc}</div>
                        </div>
                        <a
                          href={`tel:${contact.number.replace(/\s+/g, '')}`}
                          className="btn btn-sm btn-danger rounded-pill px-3 py-1 font-monospace fw-bold"
                          style={{ fontSize: '0.78rem' }}
                        >
                          <i className="bi bi-telephone-outbound-fill me-1"></i> {contact.number}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Full-Width: Arabic Phrase Cards */}
              <div className="col-12">
                <div className="card p-4 rounded-4 border shadow" style={{ background: '#121820', borderColor: 'rgba(198, 166, 107, 0.3)' }}>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <i className="bi bi-translate text-gold-antique fs-5"></i>
                    <h3 className="h6 font-display text-white mb-0">ESSENTIAL ARABIC TRAVEL PHRASES FOR ZAIREEN</h3>
                  </div>

                  <div className="row g-2">
                    {OFFLINE_PACK_DATA.phrases.map((phrase, idx) => (
                      <div key={idx} className="col-12 col-md-6 col-xl-3">
                        <div className="p-3 rounded-3 bg-dark border border-dark-subtle h-100 d-flex flex-column justify-content-between">
                          <div>
                            <div className="font-arabic text-warning fs-5 mb-1 text-end" style={{ direction: 'rtl' }}>
                              {phrase.ar}
                            </div>
                            <div className="fw-semibold text-white small mb-1">{phrase.en}</div>
                            <div className="small text-secondary fst-italic mb-2" style={{ fontSize: '0.74rem' }}>
                              "{phrase.tr}"
                            </div>
                          </div>
                          <div className="badge bg-dark border border-secondary text-secondary text-start text-truncate small" style={{ fontSize: '0.65rem' }}>
                            {phrase.context}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
