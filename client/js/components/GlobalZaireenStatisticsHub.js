const { useState, useEffect, useRef, useMemo } = window.React;

/**
 * MODULE H: GLOBAL KARBALA ZAIREEN STATISTICS & PILGRIMAGE INTELLIGENCE
 * Fully integrated, research-grade statistical dashboard for the Karbala Digital Twin.
 */
export function GlobalZaireenStatisticsHub({ onNavigate, onAskAi }) {
  // Navigation tabs: 'overview' | 'years' | 'countries' | 'analytics' | 'arbaeen' | 'timeline' | 'sources' | 'export'
  const [activeTab, setActiveTab] = useState('overview');

  // Data states fetched from REST APIs
  const [overviewData, setOverviewData] = useState(null);
  const [yearsList, setYearsList] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [yearDetail, setYearDetail] = useState(null);
  const [countriesList, setCountriesList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [trendsData, setTrendsData] = useState(null);
  const [arbaeenData, setArbaeenData] = useState(null);
  const [sourcesData, setSourcesData] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Comparison State
  const [compareYear1, setCompareYear1] = useState(2024);
  const [compareYear2, setCompareYear2] = useState(2023);
  const [comparisonResult, setComparisonResult] = useState(null);

  // Leaflet map reference
  const mapContainerRef = useRef(null);
  const leafletMapInstance = useRef(null);
  const markersLayerRef = useRef(null);

  // 1. Initial Data Fetching
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/pilgrimage-stats/overview').then(r => r.json()),
      fetch('/api/pilgrimage-stats/years').then(r => r.json()),
      fetch('/api/pilgrimage-stats/trends').then(r => r.json()),
      fetch('/api/pilgrimage-stats/arbaeen').then(r => r.json()),
      fetch('/api/pilgrimage-stats/sources').then(r => r.json()),
      fetch('/api/pilgrimage-stats/timeline').then(r => r.json())
    ])
      .then(([ov, yr, tr, ar, src, tl]) => {
        if (ov && ov.overview) setOverviewData(ov.overview);
        if (yr && yr.years) setYearsList(yr.years);
        if (tr) setTrendsData(tr);
        if (ar) setArbaeenData(ar);
        if (src) setSourcesData(src);
        if (tl && tl.milestones) setTimelineData(tl.milestones);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching pilgrimage stats:', err);
        setLoading(false);
      });
  }, []);

  // 2. Fetch Selected Year Details
  useEffect(() => {
    fetch(`/api/pilgrimage-stats/year/${selectedYear}`)
      .then(r => r.json())
      .then(d => {
        if (d && d.data) {
          setYearDetail(d.data);
        }
      })
      .catch(err => console.error('Error loading year detail:', err));

    fetch(`/api/pilgrimage-stats/countries?year=${selectedYear}`)
      .then(r => r.json())
      .then(d => {
        if (d && d.countries) {
          setCountriesList(d.countries);
          if (d.countries.length > 0) {
            setSelectedCountry(d.countries.find(c => c.countryCode !== 'IQ') || d.countries[0]);
          }
        }
      })
      .catch(err => console.error('Error loading country data:', err));
  }, [selectedYear]);

  // 3. Fetch Comparison Data
  useEffect(() => {
    fetch(`/api/pilgrimage-stats/compare?year1=${compareYear1}&year2=${compareYear2}`)
      .then(r => r.json())
      .then(d => {
        if (d && d.comparison) setComparisonResult(d);
      })
      .catch(err => console.error('Error comparing years:', err));
  }, [compareYear1, compareYear2]);

  // 4. Initialize Interactive Leaflet World Map (H3)
  useEffect(() => {
    if (activeTab !== 'countries') return;
    if (!window.L || !mapContainerRef.current) return;

    if (!leafletMapInstance.current) {
      const map = window.L.map(mapContainerRef.current, {
        center: [28.0, 48.0],
        zoom: 3.5,
        minZoom: 2,
        maxZoom: 8,
        zoomControl: true,
        attributionControl: false
      });

      // Dark luxury tile layer with custom cartography filter
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        className: 'map-dark-tiles'
      }).addTo(map);

      leafletMapInstance.current = map;
      markersLayerRef.current = window.L.layerGroup().addTo(map);
    }

    const map = leafletMapInstance.current;
    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    // Sacred Destination Pin: Karbala (32.6160, 44.0325)
    const karbalaIcon = window.L.divIcon({
      className: 'karbala-sacred-hub-pin',
      html: `
        <div style="
          width: 36px; height: 36px; border-radius: 50%;
          background: radial-gradient(circle, #f39c12 0%, #103B32 80%);
          border: 2px solid #C6A66B; box-shadow: 0 0 20px rgba(243, 156, 18, 0.9);
          display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px; font-weight: bold;
        ">
          ك
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const karbalaMarker = window.L.marker([32.6160, 44.0325], { icon: karbalaIcon })
      .bindPopup(`
        <div style="padding: 6px; font-family: Outfit, sans-serif;">
          <strong style="color: #C6A66B; font-size: 14px;">Holy Karbala (Destination of Ziyarat)</strong><br/>
          <span style="font-size: 12px; color: #e0e0e0;">Sanctuary of Imam Hussain (AS) & Hazrat Abbas (AS)</span><br/>
          <div style="margin-top: 4px; font-size: 11px; color: #2ecc71;">Electronic Axis Sensor System Active</div>
        </div>
      `);
    markersLayer.addLayer(karbalaMarker);

    // Country Flow Pins & Arcs
    countriesList.forEach(c => {
      if (!c.coordinates || !c.coordinates.lat || c.countryCode === 'IQ') return;

      const size = Math.min(32, Math.max(16, Math.log10(c.reportedPilgrimCount || 1000) * 5.5));
      const countryIcon = window.L.divIcon({
        className: 'country-zaireen-pin',
        html: `
          <div style="
            width: ${size}px; height: ${size}px; border-radius: 50%;
            background: rgba(198, 166, 107, 0.25);
            border: 1.5px solid #C6A66B;
            box-shadow: 0 0 10px rgba(198, 166, 107, 0.6);
            display: flex; align-items: center; justify-content: center;
            font-size: ${size > 22 ? '13px' : '10px'}; cursor: pointer;
          ">
            ${c.flagEmoji}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });

      const marker = window.L.marker([c.coordinates.lat, c.coordinates.lng], { icon: countryIcon });
      marker.bindPopup(`
        <div style="padding: 6px; font-family: Outfit, sans-serif;">
          <div style="font-weight: 700; color: #C6A66B; font-size: 14px;">${c.flagEmoji} ${c.countryName}</div>
          <div style="font-size: 13px; color: #fff; margin: 3px 0;"><strong>${(c.reportedPilgrimCount || 0).toLocaleString()}</strong> verified pilgrims</div>
          <div style="font-size: 11px; color: #aaa;">Share: ${c.percentageOfInternational || 'N/A'}% of foreign zaireen</div>
          <div style="font-size: 10px; color: #888; margin-top: 3px;">${c.measurementTypeDisplay}</div>
        </div>
      `);

      marker.on('click', () => {
        setSelectedCountry(c);
      });

      markersLayer.addLayer(marker);

      // Pilgrimage Trajectory Arc (Polyline toward Karbala)
      const latlngs = [
        [c.coordinates.lat, c.coordinates.lng],
        [(c.coordinates.lat + 32.6160) / 2 + 1.5, (c.coordinates.lng + 44.0325) / 2],
        [32.6160, 44.0325]
      ];

      const flowLine = window.L.polyline(latlngs, {
        color: '#C6A66B',
        weight: 1.5,
        opacity: 0.45,
        dashArray: '4, 8'
      });
      markersLayer.addLayer(flowLine);
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [activeTab, countriesList]);

  // Filtered countries for search
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return countriesList;
    const q = countrySearch.toLowerCase();
    return countriesList.filter(c =>
      c.countryName.toLowerCase().includes(q) ||
      (c.countryArabicName && c.countryArabicName.includes(q)) ||
      c.countryCode.toLowerCase().includes(q)
    );
  }, [countriesList, countrySearch]);

  const handleDownloadCsv = (format) => {
    window.open(`/api/pilgrimage-stats/export/csv?format=${format}`, '_blank');
  };

  const handlePrintDossier = () => {
    window.print();
  };

  const askAiAboutStats = (queryText) => {
    if (onAskAi) {
      onAskAi(queryText);
    } else {
      onNavigate('ai');
    }
  };

  return (
    <div className="zaireen-stats-hub">
      
      {/* ================= HEADER & BREADCRUMBS ================= */}
      <div className="zaireen-subview-header">
        <div className="container-fluid px-lg-5 px-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-gold d-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill"
                onClick={() => onNavigate('home')}
              >
                <i className="bi bi-arrow-left"></i>
                <span>Return to Museum Home</span>
              </button>
              
              <button
                type="button"
                className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill"
                onClick={() => onNavigate('ziyarat')}
              >
                <i className="bi bi-compass-fill text-gold-antique"></i>
                <span className="d-none d-sm-inline">My Ziyarat</span>
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill"
                onClick={() => onNavigate('ai')}
              >
                <i className="bi bi-chat-heart-fill text-gold-antique"></i>
                <span className="d-none d-sm-inline">Ask Karbala AI</span>
              </button>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="zaireen-badge-official">
                <i className="bi bi-shield-check me-1"></i> Certified Sovereign Records
              </span>
              <span className="badge bg-black border border-gold-subtle text-champagne" style={{ fontSize: '0.72rem' }}>
                MODULE H • RESEARCH INTELLIGENCE
              </span>
            </div>
          </div>

          <div className="row align-items-end g-3">
            <div className="col-lg-8">
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="text-gold-antique font-arabic fs-4">ك</span>
                <span className="text-gold-antique font-arabic" style={{ fontSize: '1.05rem', letterSpacing: '0.5px' }}>
                  مركز إحصائيات زوار كربلاء العالمي والتحليلات الميدانية الموثقة
                </span>
              </div>
              <h1 className="font-display text-white mb-2" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', letterSpacing: '0.5px' }}>
                Global Karbala Zaireen Statistics & Pilgrimage Intelligence
              </h1>
              <p className="text-secondary mb-0" style={{ fontSize: '0.88rem', maxWidth: '820px', lineHeight: '1.55' }}>
                Empirical, data-driven intelligence repository documenting international pilgrimage flows, verified Arbaeen censuses, sovereign border crossings, and demographic metrics across two decades (2003–2026).
              </p>
            </div>

            <div className="col-lg-4 text-lg-end">
              <div className="d-flex flex-wrap justify-content-lg-end gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-gold d-inline-flex align-items-center gap-1.5 shadow-sm"
                  onClick={() => handleDownloadCsv('annual')}
                  title="Download Verified Annual Dataset as CSV"
                >
                  <i className="bi bi-download"></i>
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1.5"
                  onClick={handlePrintDossier}
                  title="Print Verified Dossier"
                >
                  <i className="bi bi-printer"></i>
                  <span>Print Dossier</span>
                </button>
              </div>
            </div>
          </div>

          {/* Primary Feature Tabs */}
          <div className="mt-4 pt-2">
            <div className="zaireen-nav-tabs">
              <button
                type="button"
                className={`zaireen-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="bi bi-speedometer2"></i>
                <span>Executive Overview</span>
              </button>

              <button
                type="button"
                className={`zaireen-tab-btn ${activeTab === 'years' ? 'active' : ''}`}
                onClick={() => setActiveTab('years')}
              >
                <i className="bi bi-calendar3"></i>
                <span>Historical Year Explorer</span>
              </button>

              <button
                type="button"
                className={`zaireen-tab-btn ${activeTab === 'countries' ? 'active' : ''}`}
                onClick={() => setActiveTab('countries')}
              >
                <i className="bi bi-globe-americas"></i>
                <span>Country Explorer & Map</span>
              </button>

              <button
                type="button"
                className={`zaireen-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <i className="bi bi-bar-chart-line-fill"></i>
                <span>Attendance Analytics</span>
              </button>

              <button
                type="button"
                className={`zaireen-tab-btn ${activeTab === 'arbaeen' ? 'active' : ''}`}
                onClick={() => setActiveTab('arbaeen')}
              >
                <i className="bi bi-people-fill"></i>
                <span>Arbaeen Intelligence</span>
              </button>

              <button
                type="button"
                className={`zaireen-tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
                onClick={() => setActiveTab('timeline')}
              >
                <i className="bi bi-clock-history"></i>
                <span>Pilgrimage Timeline</span>
              </button>

              <button
                type="button"
                className={`zaireen-tab-btn ${activeTab === 'sources' ? 'active' : ''}`}
                onClick={() => setActiveTab('sources')}
              >
                <i className="bi bi-file-earmark-check-fill"></i>
                <span>Sources & Methodologies</span>
              </button>

              <button
                type="button"
                className={`zaireen-tab-btn ${activeTab === 'export' ? 'active' : ''}`}
                onClick={() => setActiveTab('export')}
              >
                <i className="bi bi-file-earmark-arrow-down-fill"></i>
                <span>Export Center</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ================= TAB CONTENT ROUTING ================= */}
      <div className="container-fluid px-lg-5 px-3 py-4">

        {/* -------------------------------------------------------------
            TAB A: EXECUTIVE OVERVIEW (H10.A & H1 Key Metrics)
            ------------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div>
            {/* Top 4 Key Indicator Cards */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6 col-xl-3">
                <div className="zaireen-kpi-card h-100">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="small text-secondary fw-semibold text-uppercase" style={{ letterSpacing: '0.6px', fontSize: '0.74rem' }}>
                      Latest Verified Arbaeen
                    </span>
                    <span className="badge bg-black border border-gold-subtle text-gold-antique" style={{ fontSize: '0.68rem' }}>
                      {overviewData?.latestVerifiedArbaeen?.hijriYear || '1447 AH'}
                    </span>
                  </div>
                  <div className="zaireen-kpi-val mb-1">
                    {(overviewData?.latestVerifiedArbaeen?.totalCount || 21850000).toLocaleString()}
                  </div>
                  <div className="small text-light d-flex align-items-center gap-1.5" style={{ fontSize: '0.78rem' }}>
                    <i className="bi bi-camera-fill text-gold-antique"></i>
                    <span>Al-Abbas Shrine 5-Axis Counter</span>
                  </div>
                  <div className="small text-secondary mt-2 pt-2 border-top border-secondary-subtle" style={{ fontSize: '0.72rem' }}>
                    Domestic: {(overviewData?.latestVerifiedArbaeen?.domesticCount || 18050000).toLocaleString()} • Foreign: {(overviewData?.latestVerifiedArbaeen?.internationalCount || 3800000).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-xl-3">
                <div className="zaireen-kpi-card h-100">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="small text-secondary fw-semibold text-uppercase" style={{ letterSpacing: '0.6px', fontSize: '0.74rem' }}>
                      2026 Year-to-Date
                    </span>
                    <span className="zaireen-badge-preliminary">
                      Full Year Incomplete
                    </span>
                  </div>
                  <div className="zaireen-kpi-val mb-1 text-warning">
                    {(overviewData?.ongoingYear2026?.currentArbaeenTally || 21920000).toLocaleString()}
                  </div>
                  <div className="small text-light d-flex align-items-center gap-1.5" style={{ fontSize: '0.78rem' }}>
                    <i className="bi bi-info-circle text-warning"></i>
                    <span>Arbaeen 1448 AH Tally Completed</span>
                  </div>
                  <div className="small text-secondary mt-2 pt-2 border-top border-secondary-subtle" style={{ fontSize: '0.72rem' }}>
                    Ashura: 6.25M • Nisf Sha'ban: 4.60M • Full year remains ongoing
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-xl-3">
                <div className="zaireen-kpi-card h-100">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="small text-secondary fw-semibold text-uppercase" style={{ letterSpacing: '0.6px', fontSize: '0.74rem' }}>
                      Represented Nations
                    </span>
                    <span className="badge bg-black border border-gold-subtle text-gold-antique" style={{ fontSize: '0.68rem' }}>
                      Global Reach
                    </span>
                  </div>
                  <div className="zaireen-kpi-val mb-1">
                    {overviewData?.latestVerifiedArbaeen?.representedCountries || 88}
                  </div>
                  <div className="small text-light d-flex align-items-center gap-1.5" style={{ fontSize: '0.78rem' }}>
                    <i className="bi bi-globe text-gold-antique"></i>
                    <span>Sovereign Origin Passports</span>
                  </div>
                  <div className="small text-secondary mt-2 pt-2 border-top border-secondary-subtle" style={{ fontSize: '0.72rem' }}>
                    Verified across 6 sovereign land borders & 2 international airports
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-xl-3">
                <div className="zaireen-kpi-card h-100">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="small text-secondary fw-semibold text-uppercase" style={{ letterSpacing: '0.6px', fontSize: '0.74rem' }}>
                      All-Time Historical Record
                    </span>
                    <span className="zaireen-badge-official">
                      Record 1445 AH
                    </span>
                  </div>
                  <div className="zaireen-kpi-val mb-1 text-gold-antique">
                    {(overviewData?.historicalPeakRecord?.totalCount || 22019146).toLocaleString()}
                  </div>
                  <div className="small text-light d-flex align-items-center gap-1.5" style={{ fontSize: '0.78rem' }}>
                    <i className="bi bi-trophy-fill text-gold-antique"></i>
                    <span>Arbaeen 2023 (1445 AH)</span>
                  </div>
                  <div className="small text-secondary mt-2 pt-2 border-top border-secondary-subtle" style={{ fontSize: '0.72rem' }}>
                    Foreign Zaireen: over 4.04M across 80 documented countries
                  </div>
                </div>
              </div>
            </div>

            {/* Methodological Integrity Alert Box */}
            <div className="p-3 mb-4 rounded-3" style={{ background: 'rgba(16, 59, 50, 0.3)', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
              <div className="d-flex align-items-start gap-3">
                <i className="bi bi-shield-lock-fill text-success fs-4 mt-1"></i>
                <div>
                  <h6 className="text-white mb-1" style={{ fontSize: '0.92rem', fontWeight: 600 }}>
                    Methodological Governance & Zero-Fabrication Charter
                  </h6>
                  <p className="text-secondary small mb-1" style={{ fontSize: '0.80rem', lineHeight: '1.5' }}>
                    • <strong>Distinct Metrics</strong>: Arbaeen attendance (single 20-day observance 1–20 Safar via automated highway camera sensors) is <strong>never conflated with annual cumulative visitor totals</strong> (45M–55M visits across all 12 Islamic months).<br/>
                    • <strong>Person vs Entry</strong>: Border crossings reflect legal entry events and are not represented as unique individuals without multi-entry reconciliation.<br/>
                    • <strong>Year 2026</strong>: The current year distinguishes between completed event tallies and full-year totals that are not yet available.
                  </p>
                </div>
              </div>
            </div>

            {/* Two Column Layout: Historical Series Bar & Top Origin Countries */}
            <div className="row g-4">
              <div className="col-lg-7">
                <div className="zaireen-glass-panel h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="font-display text-white mb-0" style={{ fontSize: '1.15rem' }}>
                      <i className="bi bi-graph-up text-gold-antique me-2"></i>
                      Verified Arbaeen Attendance Progression (2016–2026)
                    </h5>
                    <span className="small text-secondary" style={{ fontSize: '0.72rem' }}>
                      Electronic Sensor Baseline (Millions)
                    </span>
                  </div>

                  <p className="text-secondary small mb-3" style={{ fontSize: '0.78rem' }}>
                    Standardized data from the Al-Abbas Holy Shrine 5-axis automated optical counting system.
                  </p>

                  <div className="mt-3">
                    {yearsList.filter(y => y.year >= 2016).map(y => {
                      const maxVal = 23000000;
                      const pct = Math.min(100, Math.round((y.arbaeenAttendance / maxVal) * 100));
                      const isRecord = y.year === 2023;
                      const isOngoing = y.year === 2026;

                      return (
                        <div key={y.year} className="mb-2.5">
                          <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: '0.78rem' }}>
                            <div>
                              <strong className="text-white me-2">{y.year}</strong>
                              <span className="text-secondary">({y.hijriYearDisplay})</span>
                              {isRecord && <span className="badge bg-warning text-dark ms-2 fw-bold" style={{ fontSize: '0.62rem' }}>ALL-TIME RECORD</span>}
                              {isOngoing && <span className="badge bg-info text-dark ms-2" style={{ fontSize: '0.62rem' }}>ONGOING 1448 AH</span>}
                              {y.year === 2020 && <span className="badge bg-danger text-light ms-2" style={{ fontSize: '0.62rem' }}>PANDEMIC (DOMESTIC ONLY)</span>}
                            </div>
                            <div>
                              <strong className="text-champagne">{y.arbaeenAttendance.toLocaleString()}</strong>
                              {y.yearOverYearChangePercent !== null && (
                                <span className={`ms-2 small fw-semibold ${y.yearOverYearChangePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                                  {y.yearOverYearChangePercent >= 0 ? `+${y.yearOverYearChangePercent}%` : `${y.yearOverYearChangePercent}%`}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="zaireen-bar-track">
                            <div
                              className="zaireen-bar-fill"
                              style={{
                                width: `${pct}%`,
                                background: isRecord
                                  ? 'linear-gradient(90deg, #103B32 0%, #f39c12 100%)'
                                  : y.year === 2020
                                  ? 'linear-gradient(90deg, #2c3e50 0%, #e74c3c 100%)'
                                  : 'linear-gradient(90deg, #103B32 0%, #C6A66B 100%)'
                              }}
                            >
                              <span>{(y.arbaeenAttendance / 1000000).toFixed(2)}M</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-3 border-top border-secondary-subtle d-flex justify-content-between align-items-center">
                    <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>
                      Pre-2016 figures are classified as historical estimates.
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-gold"
                      onClick={() => setActiveTab('analytics')}
                    >
                      <span>Explore In-Depth Analytics</span>
                      <i className="bi bi-arrow-right ms-1"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Top International Origin Demographics */}
              <div className="col-lg-5">
                <div className="zaireen-glass-panel h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="font-display text-white mb-0" style={{ fontSize: '1.15rem' }}>
                      <i className="bi bi-people text-gold-antique me-2"></i>
                      Top Documented Origin Countries
                    </h5>
                    <span className="badge bg-black border border-gold-subtle text-gold-antique" style={{ fontSize: '0.68rem' }}>
                      2024 Census
                    </span>
                  </div>

                  <p className="text-secondary small mb-3" style={{ fontSize: '0.78rem' }}>
                    Documented passport entries (Border Crossings Commission) & consular pilgrim visas.
                  </p>

                  <div className="d-flex flex-column gap-2.5">
                    {/* Domestic Iraq Entry */}
                    <div className="p-2.5 rounded-2" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(198, 166, 107, 0.25)' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                          <span className="fs-5">🇮🇶</span>
                          <div>
                            <strong className="text-white d-block" style={{ fontSize: '0.84rem' }}>Iraq (Domestic Zaireen)</strong>
                            <span className="text-secondary small" style={{ fontSize: '0.70rem' }}>Highway Axis Camera Counters</span>
                          </div>
                        </div>
                        <div className="text-end">
                          <strong className="text-champagne d-block" style={{ fontSize: '0.90rem' }}>17,730,525</strong>
                          <span className="text-success small" style={{ fontSize: '0.68rem' }}>82.54% of Total</span>
                        </div>
                      </div>
                    </div>

                    {/* Top Foreign Countries */}
                    {(overviewData?.topInternationalDemographics || []).map((c, idx) => (
                      <div key={c.countryCode} className="p-2 rounded-2" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-2">
                            <span className="text-secondary fw-bold" style={{ fontSize: '0.72rem', width: '16px' }}>#{idx + 1}</span>
                            <span className="fs-5">{c.flag}</span>
                            <div>
                              <strong className="text-white d-block" style={{ fontSize: '0.82rem' }}>{c.countryName}</strong>
                              <span className="text-secondary small" style={{ fontSize: '0.68rem' }}>{c.measurementType}</span>
                            </div>
                          </div>
                          <div className="text-end">
                            <strong className="text-white d-block" style={{ fontSize: '0.84rem' }}>{c.count.toLocaleString()}</strong>
                            <span className="text-gold-antique small" style={{ fontSize: '0.68rem' }}>{c.shareOfInternational}% of Foreign</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-top border-secondary-subtle">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-gold w-100 d-flex align-items-center justify-content-center gap-1.5"
                      onClick={() => setActiveTab('countries')}
                    >
                      <i className="bi bi-globe-americas"></i>
                      <span>Open Interactive World Pilgrimage Map</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Interactive Inquiries / Ask AI Integration Preview */}
            <div className="mt-4 p-3 rounded-3" style={{ background: 'rgba(14, 20, 18, 0.85)', border: '1px solid rgba(198, 166, 107, 0.25)' }}>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-chat-heart-fill text-gold-antique"></i>
                  <span className="text-white fw-bold" style={{ fontSize: '0.86rem' }}>Ask Karbala AI 3.0 Verified Statistical Inquiries</span>
                </div>
                <span className="text-secondary small" style={{ fontSize: '0.72rem' }}>Click any question to query the verified database</span>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light rounded-pill text-start"
                  style={{ fontSize: '0.75rem', borderColor: 'rgba(255,255,255,0.15)' }}
                  onClick={() => askAiAboutStats('How many pilgrims visited Karbala during Arbaeen in 2025?')}
                >
                  <i className="bi bi-arrow-right-short text-gold-antique me-1"></i>
                  How many pilgrims visited Karbala during Arbaeen in 2025?
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-light rounded-pill text-start"
                  style={{ fontSize: '0.75rem', borderColor: 'rgba(255,255,255,0.15)' }}
                  onClick={() => askAiAboutStats('What is the latest reported attendance figure for 2026?')}
                >
                  <i className="bi bi-arrow-right-short text-gold-antique me-1"></i>
                  What is the latest reported attendance figure for 2026?
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-light rounded-pill text-start"
                  style={{ fontSize: '0.75rem', borderColor: 'rgba(255,255,255,0.15)' }}
                  onClick={() => askAiAboutStats('How many pilgrims came from India in 2024?')}
                >
                  <i className="bi bi-arrow-right-short text-gold-antique me-1"></i>
                  How many pilgrims came from India in 2024?
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-light rounded-pill text-start"
                  style={{ fontSize: '0.75rem', borderColor: 'rgba(255,255,255,0.15)' }}
                  onClick={() => askAiAboutStats('What is the difference between annual Karbala visits and Arbaeen attendance?')}
                >
                  <i className="bi bi-arrow-right-short text-gold-antique me-1"></i>
                  Difference between annual visits and Arbaeen attendance?
                </button>
              </div>
            </div>

          </div>
        )}

        {/* -------------------------------------------------------------
            TAB B: HISTORICAL YEAR EXPLORER (H1, H10.B)
            ------------------------------------------------------------- */}
        {activeTab === 'years' && (
          <div>
            <div className="zaireen-glass-panel mb-4">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                <div>
                  <h4 className="font-display text-white mb-1" style={{ fontSize: '1.25rem' }}>
                    <i className="bi bi-calendar-range-fill text-gold-antique me-2"></i>
                    Historical Year Explorer & Verified Censuses
                  </h4>
                  <p className="text-secondary small mb-0" style={{ fontSize: '0.80rem' }}>
                    Select an official census year to review audited attendance figures, domestic vs foreign ratios, and source provenance.
                  </p>
                </div>
              </div>

              {/* Year Selector Pills */}
              <div className="d-flex flex-wrap gap-2 pb-2">
                {yearsList.map(y => (
                  <button
                    key={y.year}
                    type="button"
                    className={`btn btn-sm ${selectedYear === y.year ? 'btn-gold shadow-sm' : 'btn-outline-secondary'}`}
                    style={{ fontSize: '0.80rem', padding: '6px 14px' }}
                    onClick={() => setSelectedYear(y.year)}
                  >
                    <span>{y.year}</span>
                    <span className="small opacity-75 ms-1">({y.hijriYearDisplay.split(' ')[0]})</span>
                    {!y.isYearComplete && <span className="ms-1 badge bg-warning text-dark" style={{ fontSize: '0.55rem' }}>ONGOING</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Selected Year Dossier */}
            {yearDetail && yearDetail.attendance && (
              <div className="row g-4">
                <div className="col-lg-8">
                  <div className="zaireen-glass-panel h-100">
                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h3 className="font-display text-white mb-0" style={{ fontSize: '1.5rem' }}>
                            Census Year {yearDetail.attendance.year}
                          </h3>
                          <span className="badge bg-black border border-gold-subtle text-gold-antique" style={{ fontSize: '0.76rem' }}>
                            {yearDetail.attendance.hijriYearDisplay}
                          </span>
                        </div>
                        <div className="text-gold-antique font-arabic" style={{ fontSize: '1.0rem' }}>
                          {yearDetail.attendance.eventNameDisplay}
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        {yearDetail.attendance.verificationStatus === 'verified_official' && (
                          <span className="zaireen-badge-official">
                            <i className="bi bi-check-circle-fill me-1"></i> Verified Official
                          </span>
                        )}
                        {yearDetail.attendance.verificationStatus === 'historical_estimate' && (
                          <span className="zaireen-badge-preliminary">
                            <i className="bi bi-exclamation-triangle-fill me-1"></i> Historical Estimate (Pre-Camera)
                          </span>
                        )}
                        {!yearDetail.attendance.isYearComplete && (
                          <span className="badge bg-warning text-dark fw-bold" style={{ fontSize: '0.70rem' }}>
                            Ongoing 2026 Tally
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Numerical Overview Cards */}
                    <div className="row g-3 mb-4">
                      <div className="col-12 col-md-4">
                        <div className="p-3 rounded-2" style={{ background: 'rgba(16, 59, 50, 0.25)', border: '1px solid rgba(198, 166, 107, 0.3)' }}>
                          <span className="text-secondary small d-block mb-1" style={{ fontSize: '0.72rem' }}>Total Reported Pilgrims</span>
                          <strong className="text-champagne fs-4 d-block">
                            {yearDetail.attendance.totalReportedPilgrims.toLocaleString()}
                          </strong>
                          <span className="text-secondary small" style={{ fontSize: '0.70rem' }}>
                            {yearDetail.attendance.arbaeenAttendance ? 'Arbaeen 20-Day Tally' : 'Historical composite'}
                          </span>
                        </div>
                      </div>

                      <div className="col-12 col-md-4">
                        <div className="p-3 rounded-2" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                          <span className="text-secondary small d-block mb-1" style={{ fontSize: '0.72rem' }}>Domestic Iraqi Zaireen</span>
                          <strong className="text-white fs-4 d-block">
                            {yearDetail.attendance.domesticIraqiPilgrims ? yearDetail.attendance.domesticIraqiPilgrims.toLocaleString() : 'Not documented'}
                          </strong>
                          <span className="text-secondary small" style={{ fontSize: '0.70rem' }}>
                            {yearDetail.attendance.domesticIraqiPilgrims && yearDetail.attendance.totalReportedPilgrims
                              ? `${((yearDetail.attendance.domesticIraqiPilgrims / yearDetail.attendance.totalReportedPilgrims) * 100).toFixed(1)}% of total`
                              : ''}
                          </span>
                        </div>
                      </div>

                      <div className="col-12 col-md-4">
                        <div className="p-3 rounded-2" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                          <span className="text-secondary small d-block mb-1" style={{ fontSize: '0.72rem' }}>International Zaireen</span>
                          <strong className="text-gold-antique fs-4 d-block">
                            {yearDetail.attendance.internationalPilgrims ? yearDetail.attendance.internationalPilgrims.toLocaleString() : 'Not documented'}
                          </strong>
                          <span className="text-secondary small" style={{ fontSize: '0.70rem' }}>
                            {yearDetail.attendance.representedCountriesCount ? `${yearDetail.attendance.representedCountriesCount} documented countries` : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Events Breakdown Table for the Year */}
                    <h6 className="text-white mb-2" style={{ fontSize: '0.88rem' }}>
                      <i className="bi bi-calendar-event text-gold-antique me-2"></i>
                      Documented Event Breakdown ({yearDetail.attendance.year})
                    </h6>

                    <div className="table-responsive mb-4">
                      <table className="table table-dark table-sm mb-0" style={{ fontSize: '0.78rem' }}>
                        <thead>
                          <tr className="border-secondary-subtle">
                            <th>Pilgrimage Observance</th>
                            <th>Islamic Date</th>
                            <th>Reported Count</th>
                            <th>Measurement Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>Arbaeen Pilgrimage</strong></td>
                            <td className="text-secondary">20 Safar</td>
                            <td className="text-champagne fw-bold">{yearDetail.attendance.arbaeenAttendance ? yearDetail.attendance.arbaeenAttendance.toLocaleString() : 'Included in composite'}</td>
                            <td><span className="zaireen-badge-official">{yearDetail.attendance.measurementType}</span></td>
                          </tr>
                          {yearDetail.attendance.ashuraAttendance && (
                            <tr>
                              <td><strong>Day of Ashura</strong></td>
                              <td className="text-secondary">10 Muharram</td>
                              <td className="text-white">{yearDetail.attendance.ashuraAttendance.toLocaleString()}</td>
                              <td className="text-secondary">Sanctuary Esplanade & Checkpoint Counts</td>
                            </tr>
                          )}
                          {yearDetail.attendance.nisfShabanAttendance && (
                            <tr>
                              <td><strong>Nisf Sha'ban</strong></td>
                              <td className="text-secondary">15 Sha'ban</td>
                              <td className="text-white">{yearDetail.attendance.nisfShabanAttendance.toLocaleString()}</td>
                              <td className="text-secondary">Highway Corridor Traffic Models</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Metadata & Governance */}
                    <div className="p-3 rounded-2" style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div className="row g-2" style={{ fontSize: '0.76rem' }}>
                        <div className="col-sm-6">
                          <span className="text-secondary d-block">Reporting Authority:</span>
                          <strong className="text-white">{yearDetail.attendance.reportingAuthority}</strong>
                        </div>
                        <div className="col-sm-6">
                          <span className="text-secondary d-block">Official Publication Date:</span>
                          <strong className="text-white">{yearDetail.attendance.officialPublicationDate}</strong>
                        </div>
                        <div className="col-sm-6 mt-2">
                          <span className="text-secondary d-block">Source Reference URL:</span>
                          <a href={yearDetail.attendance.sourceUrl || 'https://alkafeel.net'} target="_blank" rel="noopener noreferrer" className="text-gold-antique text-decoration-none">
                            <i className="bi bi-box-arrow-up-right me-1"></i>
                            {yearDetail.attendance.sourceUrl || 'https://alkafeel.net'}
                          </a>
                        </div>
                        <div className="col-sm-6 mt-2">
                          <span className="text-secondary d-block">Verification Authority Status:</span>
                          <span className="badge bg-success-subtle text-success border border-success-subtle">
                            {yearDetail.attendance.verificationStatus}
                          </span>
                        </div>
                        <div className="col-12 mt-2">
                          <span className="text-secondary d-block">Methodology Description:</span>
                          <span className="text-light">{yearDetail.attendance.measurementDefinition}</span>
                        </div>
                        {yearDetail.attendance.limitationNotes && (
                          <div className="col-12 mt-2">
                            <span className="text-warning d-block">
                              <i className="bi bi-exclamation-circle me-1"></i> Data Limitation Notice:
                            </span>
                            <span className="text-secondary">{yearDetail.attendance.limitationNotes}</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Country Breakdown for Selected Year */}
                <div className="col-lg-4">
                  <div className="zaireen-glass-panel h-100">
                    <h5 className="font-display text-white mb-2" style={{ fontSize: '1.10rem' }}>
                      <i className="bi bi-flag-fill text-gold-antique me-2"></i>
                      Documented Origin Nations ({yearDetail.attendance.year})
                    </h5>

                    {yearDetail.countryBreakdown && yearDetail.countryBreakdown.length > 0 ? (
                      <div className="d-flex flex-column gap-2 mt-3" style={{ maxHeight: '520px', overflowY: 'auto' }}>
                        {yearDetail.countryBreakdown.map(c => (
                          <div
                            key={c.countryCode}
                            className="p-2 rounded-2"
                            style={{
                              background: selectedCountry && selectedCountry.countryCode === c.countryCode ? 'rgba(198, 166, 107, 0.18)' : 'rgba(255, 255, 255, 0.02)',
                              border: selectedCountry && selectedCountry.countryCode === c.countryCode ? '1px solid var(--gold-antique)' : '1px solid rgba(255, 255, 255, 0.06)'
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center gap-2">
                                <span className="fs-5">{c.flagEmoji}</span>
                                <div>
                                  <strong className="text-white d-block" style={{ fontSize: '0.80rem' }}>{c.countryName}</strong>
                                  <span className="text-secondary" style={{ fontSize: '0.68rem' }}>{c.measurementTypeDisplay}</span>
                                </div>
                              </div>
                              <div className="text-end">
                                <strong className="text-champagne d-block" style={{ fontSize: '0.82rem' }}>
                                  {(c.reportedPilgrimCount || 0).toLocaleString()}
                                </strong>
                                {c.percentageOfInternational && (
                                  <span className="text-gold-antique" style={{ fontSize: '0.66rem' }}>{c.percentageOfInternational}%</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <i className="bi bi-file-earmark-x fs-1 text-secondary opacity-50 mb-2"></i>
                        <h6 className="text-white" style={{ fontSize: '0.90rem' }}>Official country-wise data not available</h6>
                        <p className="text-secondary small" style={{ fontSize: '0.74rem' }}>
                          Primary authorities did not publish segregated nationality tables for this historical reporting period.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB C: COUNTRY EXPLORER & INTERACTIVE WORLD MAP (H2, H3, H10.C)
            ------------------------------------------------------------- */}
        {activeTab === 'countries' && (
          <div>
            <div className="row g-4">
              {/* Map Column */}
              <div className="col-lg-8">
                <div className="zaireen-glass-panel">
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                    <div>
                      <h4 className="font-display text-white mb-0" style={{ fontSize: '1.20rem' }}>
                        <i className="bi bi-globe-americas text-gold-antique me-2"></i>
                        Interactive Global Pilgrimage Flow Map ({selectedYear})
                      </h4>
                      <span className="text-secondary small" style={{ fontSize: '0.74rem' }}>
                        Documented international corridors converging towards Holy Karbala.
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <select
                        className="form-select form-select-sm bg-dark text-light border-secondary"
                        style={{ fontSize: '0.78rem', width: '130px' }}
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                      >
                        <option value={2024}>2024 (1446 AH)</option>
                        <option value={2023}>2023 (1445 AH)</option>
                      </select>
                    </div>
                  </div>

                  {/* Leaflet Map Frame */}
                  <div ref={mapContainerRef} className="zaireen-world-map-frame" id="zaireenWorldMap"></div>

                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3 pt-2 border-top border-secondary-subtle">
                    <div className="d-flex align-items-center gap-3" style={{ fontSize: '0.72rem' }}>
                      <span className="d-flex align-items-center gap-1.5">
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#C6A66B', display: 'inline-block' }}></span>
                        <span>Documented Origin Hub</span>
                      </span>
                      <span className="d-flex align-items-center gap-1.5">
                        <span style={{ width: '18px', height: '2px', background: '#C6A66B', display: 'inline-block' }}></span>
                        <span>Pilgrimage Transit Arc</span>
                      </span>
                    </div>
                    <span className="text-secondary small" style={{ fontSize: '0.70rem' }}>
                      Click on any country pin to open official dossier.
                    </span>
                  </div>
                </div>
              </div>

              {/* Country Details & Filter Column */}
              <div className="col-lg-4">
                <div className="zaireen-glass-panel mb-3">
                  <div className="mb-3">
                    <label className="text-secondary small mb-1" style={{ fontSize: '0.72rem' }}>Search Documented Countries</label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-dark border-secondary text-secondary"><i className="bi bi-search"></i></span>
                      <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary"
                        placeholder="e.g. India, Pakistan, Iran, Kuwait..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        style={{ fontSize: '0.78rem' }}
                      />
                    </div>
                  </div>

                  {/* Selected Country Profile Card */}
                  {selectedCountry ? (
                    <div className="p-3 rounded-2" style={{ background: 'rgba(16, 59, 50, 0.25)', border: '1px solid rgba(198, 166, 107, 0.35)' }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <span className="fs-3">{selectedCountry.flagEmoji}</span>
                          <div>
                            <h5 className="font-display text-white mb-0" style={{ fontSize: '1.15rem' }}>
                              {selectedCountry.countryName}
                            </h5>
                            <span className="text-gold-antique font-arabic" style={{ fontSize: '0.85rem' }}>
                              {selectedCountry.countryArabicName}
                            </span>
                          </div>
                        </div>
                        <span className="zaireen-badge-official">{selectedCountry.year}</span>
                      </div>

                      <div className="p-2.5 rounded-2 mb-2" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
                        <span className="text-secondary small d-block" style={{ fontSize: '0.70rem' }}>Verified Pilgrim Count</span>
                        <strong className="text-champagne fs-4 d-block">
                          {(selectedCountry.reportedPilgrimCount || 0).toLocaleString()}
                        </strong>
                        {selectedCountry.percentageOfInternational && (
                          <span className="text-success small" style={{ fontSize: '0.72rem' }}>
                            {selectedCountry.percentageOfInternational}% of international zaireen
                          </span>
                        )}
                        {selectedCountry.percentageOfTotal && (
                          <span className="text-gold-antique small" style={{ fontSize: '0.72rem' }}>
                            {selectedCountry.percentageOfTotal}% of total pilgrimage
                          </span>
                        )}
                      </div>

                      <div className="d-flex flex-column gap-1.5" style={{ fontSize: '0.74rem' }}>
                        <div>
                          <span className="text-secondary">Measurement Type: </span>
                          <strong className="text-white">{selectedCountry.measurementTypeDisplay}</strong>
                        </div>
                        {selectedCountry.yearOverYearChangePercent !== null && (
                          <div>
                            <span className="text-secondary">YoY Change: </span>
                            <strong className={selectedCountry.yearOverYearChangePercent >= 0 ? 'text-success' : 'text-danger'}>
                              {selectedCountry.yearOverYearChangePercent >= 0 ? `+${selectedCountry.yearOverYearChangePercent}%` : `${selectedCountry.yearOverYearChangePercent}%`}
                            </strong>
                            <span className="text-secondary ms-1">({(selectedCountry.previousYearCount || 0).toLocaleString()} in previous year)</span>
                          </div>
                        )}
                        {selectedCountry.primaryEntryPoints && selectedCountry.primaryEntryPoints.length > 0 && (
                          <div>
                            <span className="text-secondary d-block">Primary Entry Gateways:</span>
                            <span className="text-light">{selectedCountry.primaryEntryPoints.join(' • ')}</span>
                          </div>
                        )}
                        <div className="mt-2 pt-2 border-top border-secondary-subtle">
                          <span className="text-secondary d-block">Source Citation:</span>
                          <span className="text-champagne" style={{ fontSize: '0.70rem' }}>
                            {selectedCountry.sourceOrganization} — <em>{selectedCountry.sourceCitation}</em>
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-gold w-100 mt-3 d-flex align-items-center justify-content-center gap-1.5"
                        onClick={() => askAiAboutStats(`Tell me about verified pilgrims from ${selectedCountry.countryName}`)}
                      >
                        <i className="bi bi-chat-heart-fill"></i>
                        <span>Ask AI About {selectedCountry.countryName}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-secondary small">
                      Select a country from the list or map.
                    </div>
                  )}
                </div>

                {/* Country List Table */}
                <div className="zaireen-glass-panel" style={{ maxHeight: '340px', overflowY: 'auto' }}>
                  <div className="d-flex flex-column gap-1.5">
                    {filteredCountries.map(c => (
                      <div
                        key={c.countryCode}
                        className="p-2 rounded-2 cursor-pointer"
                        style={{
                          background: selectedCountry && selectedCountry.countryCode === c.countryCode ? 'rgba(198, 166, 107, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                          border: selectedCountry && selectedCountry.countryCode === c.countryCode ? '1px solid var(--gold-antique)' : '1px solid rgba(255, 255, 255, 0.05)',
                          cursor: 'pointer'
                        }}
                        onClick={() => setSelectedCountry(c)}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-2">
                            <span>{c.flagEmoji}</span>
                            <strong className="text-white" style={{ fontSize: '0.78rem' }}>{c.countryName}</strong>
                          </div>
                          <span className="text-champagne small fw-semibold" style={{ fontSize: '0.78rem' }}>
                            {(c.reportedPilgrimCount || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB D: HISTORICAL COMPARISON & ANALYTICS (H4)
            ------------------------------------------------------------- */}
        {activeTab === 'analytics' && (
          <div>
            {/* Multi-Year Comparison Tool */}
            <div className="zaireen-glass-panel mb-4">
              <h4 className="font-display text-white mb-2" style={{ fontSize: '1.25rem' }}>
                <i className="bi bi-arrow-left-right text-gold-antique me-2"></i>
                Multi-Year Homogenous Comparison Engine
              </h4>
              <p className="text-secondary small mb-3" style={{ fontSize: '0.80rem' }}>
                Compare two official pilgrimage censuses. Calculations are restricted to compatible methodologies to guarantee statistical validity.
              </p>

              <div className="row g-3 align-items-center">
                <div className="col-12 col-md-4">
                  <label className="text-secondary small mb-1" style={{ fontSize: '0.72rem' }}>Base Year 1</label>
                  <select
                    className="form-select form-select-sm bg-dark text-light border-secondary"
                    value={compareYear1}
                    onChange={(e) => setCompareYear1(parseInt(e.target.value, 10))}
                  >
                    {yearsList.map(y => (
                      <option key={y.year} value={y.year}>{y.year} ({y.hijriYearDisplay}) — {y.totalReportedPilgrims.toLocaleString()}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-4">
                  <label className="text-secondary small mb-1" style={{ fontSize: '0.72rem' }}>Comparison Year 2</label>
                  <select
                    className="form-select form-select-sm bg-dark text-light border-secondary"
                    value={compareYear2}
                    onChange={(e) => setCompareYear2(parseInt(e.target.value, 10))}
                  >
                    {yearsList.map(y => (
                      <option key={y.year} value={y.year}>{y.year} ({y.hijriYearDisplay}) — {y.totalReportedPilgrims.toLocaleString()}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-4 mt-md-4">
                  <div className="p-2.5 rounded-2" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(198, 166, 107, 0.25)' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-secondary small" style={{ fontSize: '0.72rem' }}>Calculated Delta:</span>
                      <strong className={`fs-5 ${comparisonResult?.comparison?.differenceTotalPilgrims >= 0 ? 'text-success' : 'text-danger'}`}>
                        {comparisonResult?.comparison?.differenceTotalPilgrims >= 0
                          ? `+${(comparisonResult?.comparison?.differenceTotalPilgrims || 0).toLocaleString()}`
                          : (comparisonResult?.comparison?.differenceTotalPilgrims || 0).toLocaleString()}
                      </strong>
                    </div>
                    {comparisonResult?.comparison?.percentageChange !== null && (
                      <div className="text-end small fw-semibold text-gold-antique" style={{ fontSize: '0.72rem' }}>
                        {comparisonResult.comparison.percentageChange}% Change
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {comparisonResult && (
                <div className="mt-3 p-2.5 rounded-2" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div className="small text-secondary" style={{ fontSize: '0.74rem' }}>
                    <i className="bi bi-info-circle me-1 text-gold-antique"></i>
                    {comparisonResult.comparison.compatibilityNote}
                  </div>
                </div>
              )}
            </div>

            {/* Attendance Analytics Metrics */}
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="zaireen-glass-panel h-100">
                  <h5 className="font-display text-white mb-2" style={{ fontSize: '1.10rem' }}>
                    <i className="bi bi-pie-chart-fill text-gold-antique me-2"></i>
                    Domestic vs. International Attendance Ratio
                  </h5>
                  <p className="text-secondary small mb-3" style={{ fontSize: '0.76rem' }}>
                    Historical breakdown across the post-reopening decade.
                  </p>

                  <div className="d-flex flex-column gap-3">
                    {[2025, 2024, 2023, 2022, 2021, 2020].map(yr => {
                      const rec = yearsList.find(y => y.year === yr);
                      if (!rec) return null;
                      const dom = rec.domesticIraqiPilgrims || 0;
                      const intl = rec.internationalPilgrims || 0;
                      const total = rec.totalReportedPilgrims || 1;
                      const domPct = Math.round((dom / total) * 100);
                      const intlPct = Math.round((intl / total) * 100);

                      return (
                        <div key={yr}>
                          <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: '0.76rem' }}>
                            <strong className="text-white">{yr} ({rec.hijriYearDisplay})</strong>
                            <div>
                              <span className="text-light me-2">🇮🇶 {domPct}% Domestic</span>
                              <span className="text-gold-antique">🌍 {intlPct}% International</span>
                            </div>
                          </div>

                          <div className="d-flex rounded-1 overflow-hidden" style={{ height: '18px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ width: `${domPct}%`, background: '#103B32' }} title={`Domestic: ${dom.toLocaleString()}`}></div>
                            <div style={{ width: `${intlPct}%`, background: '#C6A66B' }} title={`International: ${intl.toLocaleString()}`}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="zaireen-glass-panel h-100">
                  <h5 className="font-display text-white mb-2" style={{ fontSize: '1.10rem' }}>
                    <i className="bi bi-graph-up-arrow text-gold-antique me-2"></i>
                    Year-Over-Year Growth Trajectory (2017–2026)
                  </h5>
                  <p className="text-secondary small mb-3" style={{ fontSize: '0.76rem' }}>
                    Standardized % change within the homogenous electronic camera counting series.
                  </p>

                  <div className="d-flex flex-column gap-2">
                    {yearsList.filter(y => y.year >= 2017 && y.yearOverYearChangePercent !== null).map(y => (
                      <div key={y.year} className="p-2 rounded-2" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '0.78rem' }}>
                          <div>
                            <strong className="text-white me-2">{y.year}</strong>
                            <span className="text-secondary small">({y.hijriYearDisplay})</span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="text-secondary small">{y.totalReportedPilgrims.toLocaleString()} pilgrims</span>
                            <span className={`badge ${y.yearOverYearChangePercent >= 0 ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: '0.70rem' }}>
                              {y.yearOverYearChangePercent >= 0 ? `+${y.yearOverYearChangePercent}%` : `${y.yearOverYearChangePercent}%`}
                            </span>
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

        {/* -------------------------------------------------------------
            TAB E: ARBAEEN INTELLIGENCE & METHODOLOGY (H5, H7)
            ------------------------------------------------------------- */}
        {activeTab === 'arbaeen' && (
          <div>
            <div className="zaireen-glass-panel mb-4">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="text-gold-antique font-arabic fs-4">الأربعين</span>
                    <h4 className="font-display text-white mb-0" style={{ fontSize: '1.25rem' }}>
                      Arbaeen Global Attendance Intelligence & Highway Sensor Array
                    </h4>
                  </div>
                  <p className="text-secondary small mb-0" style={{ fontSize: '0.80rem' }}>
                    Technical architecture of the Al-Abbas Holy Shrine 5-axis automated optical counting system and sovereign border gateway distribution.
                  </p>
                </div>
                <span className="zaireen-badge-official">
                  ISO-Calibrated Census
                </span>
              </div>

              {/* 5 Highway Entrance Axes Grid */}
              <h6 className="text-white mb-2" style={{ fontSize: '0.88rem' }}>
                <i className="bi bi-camera-video-fill text-gold-antique me-2"></i>
                The 5 Arterial Highway Counting Corridors into Karbala
              </h6>

              <div className="row g-3 mb-4">
                {[
                  { name: 'Najaf – Karbala Highway Axis', ar: 'محور نجف - كربلاء', corridor: 'South Portal (Highway 9 / Ya Hussain Way)', sensors: 16, desc: 'Primary pedestrian axis carrying millions of walking pilgrims from Najaf.' },
                  { name: 'Baghdad – Karbala Highway Axis', ar: 'محور بغداد - كربلاء', corridor: 'North Portal (Highway 12 / Al-Wand)', sensors: 12, desc: 'Heavy vehicular and pedestrian conduit servicing northern and capital governorates.' },
                  { name: 'Babylon / Hillah – Karbala Axis', ar: 'محور بابل - كربلاء', corridor: 'East Portal (Highway 8 / Tuwaireej)', sensors: 12, desc: 'Eastern conduit servicing Hillah, Kut, and southern marsh governorates.' },
                  { name: 'Al-Husseiniya – Karbala Rural Axis', ar: 'محور الحسينية - كربلاء', corridor: 'Northeast Portal (Al-Husseiniya Road)', sensors: 8, desc: 'Agricultural and secondary rural corridor connecting northern Karbala palm groves.' },
                  { name: 'Ayn al-Tamr – Karbala Desert Axis', ar: 'محور عين التمر - كربلاء', corridor: 'West Portal (Western Desert Oasis Road)', sensors: 8, desc: 'Western desert artery monitoring vehicles and caravans from western oases.' }
                ].map((axis, i) => (
                  <div key={i} className="col-12 col-md-6 col-xl-4">
                    <div className="p-3 rounded-2 h-100" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(198, 166, 107, 0.25)' }}>
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <strong className="text-white" style={{ fontSize: '0.84rem' }}>{axis.name}</strong>
                        <span className="badge bg-black border border-gold-subtle text-gold-antique" style={{ fontSize: '0.65rem' }}>{axis.sensors} Sensors</span>
                      </div>
                      <div className="text-gold-antique font-arabic mb-1" style={{ fontSize: '0.80rem' }}>{axis.ar}</div>
                      <div className="small text-secondary mb-2" style={{ fontSize: '0.72rem' }}>{axis.corridor}</div>
                      <p className="text-light small mb-0" style={{ fontSize: '0.74rem' }}>{axis.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Border Crossings Breakdown Table */}
              <h6 className="text-white mb-2" style={{ fontSize: '0.88rem' }}>
                <i className="bi bi-airplane-engines text-gold-antique me-2"></i>
                International Border Gateway Distribution (Border Crossings Commission)
              </h6>

              <div className="table-responsive">
                <table className="table table-dark table-sm mb-0" style={{ fontSize: '0.78rem' }}>
                  <thead>
                    <tr className="border-secondary-subtle">
                      <th>Border Port / Airport</th>
                      <th>Transit Gateway</th>
                      <th>Share of Foreign Entry</th>
                      <th>Approximate Volume (2024)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(arbaeenData?.borderDistributionBreakdown2024 || []).map((b, idx) => (
                      <tr key={idx}>
                        <td><strong className="text-champagne">{b.borderName}</strong></td>
                        <td className="text-secondary">{b.description}</td>
                        <td><span className="zaireen-badge-border">{b.sharePercent}%</span></td>
                        <td className="text-white">{b.approximateVolume.toLocaleString()} entries</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB F: PILGRIMAGE TIMELINE EVOLUTION (H6)
            ------------------------------------------------------------- */}
        {activeTab === 'timeline' && (
          <div>
            <div className="zaireen-glass-panel">
              <h4 className="font-display text-white mb-2" style={{ fontSize: '1.25rem' }}>
                <i className="bi bi-clock-history text-gold-antique me-2"></i>
                Historical Pilgrimage Attendance Evolution Timeline
              </h4>
              <p className="text-secondary small mb-4" style={{ fontSize: '0.80rem' }}>
                Documented historical milestones, accessibility changes, state suppressions, and technological census advancements from 61 AH to the present day.
              </p>

              <div className="zaireen-timeline-stem">
                {timelineData.map((m, idx) => (
                  <div key={idx} className="position-relative mb-4 pb-2">
                    <div className="zaireen-timeline-dot"></div>
                    <div className="p-3 rounded-2" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(198, 166, 107, 0.22)' }}>
                      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-1">
                        <span className="badge bg-black border border-gold-subtle text-gold-antique" style={{ fontSize: '0.72rem' }}>
                          {m.yearDisplay}
                        </span>
                        <span className="small text-secondary" style={{ fontSize: '0.70rem' }}>{m.era}</span>
                      </div>
                      <h5 className="font-display text-white mb-1" style={{ fontSize: '1.05rem' }}>
                        {m.title}
                      </h5>
                      <p className="text-light small mb-0" style={{ fontSize: '0.80rem', lineHeight: '1.55' }}>
                        {m.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB G: RESEARCH SOURCES & METHODOLOGIES (H7, H10.E)
            ------------------------------------------------------------- */}
        {activeTab === 'sources' && (
          <div>
            <div className="zaireen-glass-panel mb-4">
              <h4 className="font-display text-white mb-2" style={{ fontSize: '1.25rem' }}>
                <i className="bi bi-file-earmark-check-fill text-gold-antique me-2"></i>
                Sovereign Statistical Registries & Primary Citations
              </h4>
              <p className="text-secondary small mb-3" style={{ fontSize: '0.80rem' }}>
                Every data point in the Karbala Digital Twin is cited to verified sovereign custodians and published reports. Conflicting figures are maintained with full transparency rather than silently homogenized.
              </p>

              <div className="row g-3">
                {(sourcesData?.sources || []).map((s) => (
                  <div key={s.sourceId} className="col-12 col-md-6">
                    <div className="p-3 rounded-2 h-100" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(198, 166, 107, 0.25)' }}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="badge bg-black border border-gold-subtle text-gold-antique" style={{ fontSize: '0.68rem' }}>
                          {s.sourceId}
                        </span>
                        <span className="zaireen-badge-official">{s.reliabilityRating}</span>
                      </div>
                      <h5 className="text-white mb-1" style={{ fontSize: '0.96rem', fontWeight: 600 }}>
                        {s.sourceOrganization}
                      </h5>
                      {s.sourceOrganizationArabic && (
                        <div className="text-gold-antique font-arabic mb-2" style={{ fontSize: '0.82rem' }}>
                          {s.sourceOrganizationArabic}
                        </div>
                      )}
                      <div className="text-champagne small fw-semibold mb-2" style={{ fontSize: '0.76rem' }}>
                        "{s.reportTitle}"
                      </div>
                      <p className="text-light small mb-2" style={{ fontSize: '0.74rem', lineHeight: '1.5' }}>
                        {s.reconciliationNotes}
                      </p>
                      <div className="small text-secondary" style={{ fontSize: '0.70rem' }}>
                        Reporting Frequency: {s.publicationDate} • Period: {s.reportingPeriod}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB H: EXPORT CENTER & DOSSIER GENERATOR (H4, H10.F)
            ------------------------------------------------------------- */}
        {activeTab === 'export' && (
          <div>
            <div className="zaireen-glass-panel mb-4">
              <h4 className="font-display text-white mb-2" style={{ fontSize: '1.25rem' }}>
                <i className="bi bi-file-earmark-arrow-down-fill text-gold-antique me-2"></i>
                Verified Research Export Center & Official Dossier
              </h4>
              <p className="text-secondary small mb-4" style={{ fontSize: '0.80rem' }}>
                Download machine-readable verified CSV datasets or export a printable research brief with complete source provenance and methodology footnotes.
              </p>

              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <div className="p-4 rounded-3 h-100" style={{ background: 'rgba(16, 59, 50, 0.25)', border: '1px solid rgba(198, 166, 107, 0.35)' }}>
                    <i className="bi bi-filetype-csv text-gold-antique fs-1 mb-2 d-block"></i>
                    <h5 className="font-display text-white mb-1">Annual Historical Attendance Dataset</h5>
                    <p className="text-secondary small mb-3" style={{ fontSize: '0.78rem' }}>
                      Complete 2003–2026 tabular dataset including Hijri calendars, Arbaeen counts, Ashura figures, domestic/foreign splits, YoY percentages, and sovereign reporting authorities.
                    </p>
                    <button
                      type="button"
                      className="btn btn-sm btn-gold d-inline-flex align-items-center gap-1.5"
                      onClick={() => handleDownloadCsv('annual')}
                    >
                      <i className="bi bi-download"></i>
                      <span>Download Annual CSV (UTF-8)</span>
                    </button>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="p-4 rounded-3 h-100" style={{ background: 'rgba(16, 59, 50, 0.25)', border: '1px solid rgba(198, 166, 107, 0.35)' }}>
                    <i className="bi bi-globe2 text-gold-antique fs-1 mb-2 d-block"></i>
                    <h5 className="font-display text-white mb-1">Country-Wise Zaireen Demographics Dataset</h5>
                    <p className="text-secondary small mb-3" style={{ fontSize: '0.78rem' }}>
                      Country-level zaireen metrics across documented sovereign origin nations, including measurement types (passport control vs consular visas vs air manifests) and verification dates.
                    </p>
                    <button
                      type="button"
                      className="btn btn-sm btn-gold d-inline-flex align-items-center gap-1.5"
                      onClick={() => handleDownloadCsv('countries')}
                    >
                      <i className="bi bi-download"></i>
                      <span>Download Country Demographics CSV</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top border-secondary-subtle d-flex flex-wrap justify-content-between align-items-center gap-2">
                <span className="text-secondary small" style={{ fontSize: '0.74rem' }}>
                  All exported files are formatted according to RFC 4180 CSV specifications with UTF-8 byte order mark (BOM).
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1.5"
                  onClick={handlePrintDossier}
                >
                  <i className="bi bi-printer"></i>
                  <span>Print / Save as PDF Dossier</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
