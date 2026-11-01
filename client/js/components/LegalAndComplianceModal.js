const { useState, useEffect } = window.React;

/**
 * Karbala Digital Twin — Legal, Privacy, Terms & Compliance Modal
 * Production-ready scholarly compliance document matching museum aesthetic.
 */
export function LegalAndComplianceModal({ isOpen, onClose, initialTab = 'privacy' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 10050, backdropFilter: 'blur(8px)' }}
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div className="modal-content border border-gold-subtle rounded-4 shadow-2xl theme-canvas" style={{ maxHeight: '90vh' }}>
          
          {/* Header */}
          <div className="modal-header border-bottom border-dark px-4 py-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <span className="font-arabic fs-4 text-gold-antique">ك</span>
              <div>
                <h5 className="modal-title font-display text-adaptive-heading mb-0" style={{ letterSpacing: '0.04em' }}>
                  Legal, Privacy &amp; Institutional Governance
                </h5>
                <span className="small text-secondary" style={{ fontSize: '0.74rem' }}>
                  Karbala Digital Twin • Open Scholarly Heritage Charter
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          {/* Navigation Pills */}
          <div className="px-4 pt-3 pb-2 border-bottom border-dark bg-charcoal-subtle">
            <ul className="nav nav-pills gap-2 flex-nowrap overflow-x-auto pb-1" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link px-3 py-1.5 rounded-pill small fw-semibold hub-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
                  onClick={() => setActiveTab('privacy')}
                  type="button"
                >
                  <i className="bi bi-shield-check me-1.5"></i>
                  Privacy Policy
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link px-3 py-1.5 rounded-pill small fw-semibold hub-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
                  onClick={() => setActiveTab('terms')}
                  type="button"
                >
                  <i className="bi bi-file-earmark-text me-1.5"></i>
                  Terms of Use
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link px-3 py-1.5 rounded-pill small fw-semibold hub-tab-btn ${activeTab === 'disclaimer' ? 'active' : ''}`}
                  onClick={() => setActiveTab('disclaimer')}
                  type="button"
                >
                  <i className="bi bi-exclamation-triangle me-1.5"></i>
                  Historical &amp; Telemetry Disclaimer
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link px-3 py-1.5 rounded-pill small fw-semibold hub-tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
                  onClick={() => setActiveTab('contact')}
                  type="button"
                >
                  <i className="bi bi-building me-1.5"></i>
                  Institutional Contacts
                </button>
              </li>
            </ul>
          </div>

          {/* Body Content */}
          <div className="modal-body px-4 py-3" style={{ fontSize: '0.88rem', lineHeight: 1.65 }}>
            
            {/* TAB 1: PRIVACY POLICY */}
            {activeTab === 'privacy' && (
              <div className="legal-section">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1 rounded-pill">
                    <i className="bi bi-lock-fill me-1"></i> Zero-Server Data Retention
                  </span>
                  <span className="small text-secondary">Effective Date: 2026 CE / 1447 AH</span>
                </div>

                <h6 className="font-title fw-bold text-gold-antique mb-2">1. Architectural Zero-Knowledge Commitment</h6>
                <p className="text-secondary mb-3">
                  The Karbala Digital Twin is engineered on a strict <strong>Zero Permanent Server Retention</strong> architectural model. We believe sacred pilgrimage and intellectual inquiry should remain profoundly private.
                </p>

                <h6 className="font-title fw-bold text-gold-antique mb-2">2. Geolocation &amp; Live Tracking</h6>
                <p className="text-secondary mb-3">
                  GPS coordinates utilized in the <em>Smart Arbaeen Pole Navigation</em> and <em>Interactive Digital Twin Map</em> are processed <strong>entirely within your client browser</strong> (via the W3C Geolocation API). Your real-time position is never transmitted, broadcast, or stored on any central server or database.
                </p>

                <h6 className="font-title fw-bold text-gold-antique mb-2">3. Camera &amp; AI Optical Translation</h6>
                <p className="text-secondary mb-3">
                  When utilizing the <em>AI Camera Translator</em> to read shrine calligraphy or directional signage, images are analyzed on your device via client-side WebAssembly optical recognition (Tesseract.js). Captured images are held in volatile RAM only for the duration of the scan and are automatically purged when discarded or closed.
                </p>

                <h6 className="font-title fw-bold text-gold-antique mb-2">4. Local Storage &amp; Cookies</h6>
                <p className="text-secondary mb-3">
                  This platform utilizes zero third-party tracking, advertising, or marketing cookies. Browser <code>localStorage</code> is used exclusively for functional client preferences (e.g. Day/Night theme selection, saved bookmark pins, and downloaded offline route packs).
                </p>

                <div className="p-3 rounded-3 bg-charcoal-subtle border border-gold-subtle d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div>
                    <strong className="text-adaptive-heading">Data Sovereignty Control</strong>
                    <div className="small text-secondary">Purge all local preferences and offline cache immediately.</div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger rounded-pill px-3"
                    onClick={() => {
                      if (window.confirm('Clear all local Karbala Digital Twin preferences and cache?')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                  >
                    <i className="bi bi-trash3 me-1"></i> Purge All Local Data
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: TERMS OF USE */}
            {activeTab === 'terms' && (
              <div className="legal-section">
                <h6 className="font-title fw-bold text-gold-antique mb-2">1. Scholarly Open Heritage Mission</h6>
                <p className="text-secondary mb-3">
                  The Karbala Digital Twin is an open scholarly digital humanities platform created to advance historical understanding, spatial documentation, and safe pilgrimage navigation for visitors to the Holy Shrines of Karbala, Najaf, Kufa, and related heritage sites.
                </p>

                <h6 className="font-title fw-bold text-gold-antique mb-2">2. Permitted Use</h6>
                <p className="text-secondary mb-3">
                  You are permitted to freely access, explore, study, reference in academic discourse, and use the offline travel pack for personal spiritual pilgrimage.
                </p>

                <h6 className="font-title fw-bold text-gold-antique mb-2">3. Prohibited Conduct</h6>
                <p className="text-secondary mb-3">
                  Users may not:
                </p>
                <ul className="text-secondary mb-3 ps-3">
                  <li>Deploy automated bots, denial-of-service tools, or scrapers against the digital twin infrastructure.</li>
                  <li>Falsify historical evidence, shrine coordinates, or official Atabat safety statistics.</li>
                  <li>Rebrand or monetize raw cartographic or sensory data without explicit attribution to the Karbala Digital Heritage Museum and the respective Holy Shrines.</li>
                </ul>

                <h6 className="font-title fw-bold text-gold-antique mb-2">4. Intellectual Property &amp; Sovereign Attribution</h6>
                <p className="text-secondary mb-0">
                  Architectural photography and official census statistics remain the intellectual property of the General Secretariats of the Holy Shrines (Astan Quds Husayniyya &amp; Abbasiyya). Cartographic rendering code and digital twin data structures are distributed under open scholarly terms.
                </p>
              </div>
            )}

            {/* TAB 3: HISTORICAL & TELEMETRY DISCLAIMER */}
            {activeTab === 'disclaimer' && (
              <div className="legal-section">
                <div className="alert alert-warning bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-3 p-3 mb-3">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <strong>Crucial Travel &amp; Historical Advisory</strong>
                </div>

                <h6 className="font-title fw-bold text-gold-antique mb-2">1. 61 AH Historical Reconstruction</h6>
                <p className="text-secondary mb-3">
                  The 61 AH Battle of Karbala landscape model represents a rigorous historiographical synthesis derived from primary 1st–7th century AH chronicles (notably <em>Tarikh al-Tabari</em>, <em>Kitab al-Irshad</em> by Shaykh al-Mufid, and <em>Maqtal al-Husayn</em> by Abu Mikhnaf). While geolocated with maximum topographic precision, ancient alluvial channel paths of the Euphrates (Nahr al-Alqami) are reconstructed using satellite paleochannel evidence and contain minor scholarly uncertainty ratings documented in the Historiography module.
                </p>

                <h6 className="font-title fw-bold text-gold-antique mb-2">2. Crowd Intelligence &amp; Sensor Telemetry</h6>
                <p className="text-secondary mb-3">
                  Crowd density ratings along Highway 9 reflect verified optical counter reports and historical Arbaeen census benchmarks from the Holy Shrines. <strong>This application is not an emergency directive service.</strong> Pilgrims must always adhere to on-ground instructions issued by the Iraqi Federal Police, Popular Mobilization Directorate, and Astan field marshals.
                </p>

                <h6 className="font-title fw-bold text-gold-antique mb-2">3. Airport Operational Status</h6>
                <p className="text-secondary mb-0">
                  <strong>Karbala International Airport (KIB) is actively under construction and is NON-OPERATIONAL.</strong> Commercial flights do not land at KIB. International zaireen must route their flights exclusively through Al-Najaf (NJF), Baghdad (BGW), or Basra (BSR).
                </p>
              </div>
            )}

            {/* TAB 4: INSTITUTIONAL CONTACTS */}
            {activeTab === 'contact' && (
              <div className="legal-section">
                <h6 className="font-title fw-bold text-gold-antique mb-2">Official Heritage &amp; Sovereign Custodians</h6>
                <p className="text-secondary mb-3">
                  For official religious rulings, pilgrimage permits, lost pilgrim services, and direct sanctuary administration:
                </p>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <div className="p-3 rounded-3 bg-charcoal-subtle border border-gold-subtle h-100">
                      <div className="fw-bold text-adaptive-heading mb-1">
                        <i className="bi bi-bank2 me-1.5 text-gold-antique"></i>
                        Astan Quds Husayniyya
                      </div>
                      <div className="small text-secondary mb-2">General Secretariat of the Holy Shrine of Imam Hussain (A.S.)</div>
                      <div className="small text-champagne mb-1"><i className="bi bi-globe me-1"></i> imamhussain.org</div>
                      <div className="small text-champagne"><i className="bi bi-geo-alt me-1"></i> Central Sanctuary District, Karbala, Iraq</div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="p-3 rounded-3 bg-charcoal-subtle border border-gold-subtle h-100">
                      <div className="fw-bold text-adaptive-heading mb-1">
                        <i className="bi bi-bank2 me-1.5 text-gold-antique"></i>
                        Astan Quds Abbasiyya
                      </div>
                      <div className="small text-secondary mb-2">General Secretariat of the Holy Shrine of Al-Abbas (A.S.)</div>
                      <div className="small text-champagne mb-1"><i className="bi bi-globe me-1"></i> alkafeel.net</div>
                      <div className="small text-champagne"><i className="bi bi-geo-alt me-1"></i> Bayn al-Haramayn, Karbala, Iraq</div>
                    </div>
                  </div>
                </div>

                <h6 className="font-title fw-bold text-gold-antique mb-2">Emergency Hotlines (Within Iraq)</h6>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 rounded-pill small">
                    <i className="bi bi-telephone-fill me-1"></i> Red Crescent / Medical: 122
                  </span>
                  <span className="badge bg-info-subtle text-info border border-info-subtle px-3 py-2 rounded-pill small">
                    <i className="bi bi-shield-fill me-1"></i> Karbala Police: 104
                  </span>
                  <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-3 py-2 rounded-pill small">
                    <i className="bi bi-people-fill me-1"></i> Lost Persons Center: Astan Direct
                  </span>
                </div>

                <div className="p-3 rounded-3 bg-charcoal-subtle border border-dark small text-secondary">
                  <strong>Digital Twin Engineering:</strong> Developed by Sayyed Faiz Zaidi for educational, scholarly, and non-commercial heritage preservation. Inquiries regarding cartographic datasets and historical source reconciliation can be submitted through the open repository issue tracker.
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="modal-footer border-top border-dark px-4 py-2.5 d-flex justify-content-between align-items-center">
            <span className="small text-secondary" style={{ fontSize: '0.74rem' }}>
              © 61 AH – 1447 AH • Karbala Digital Heritage Museum
            </span>
            <button
              type="button"
              className="btn btn-sm btn-outline-gold rounded-pill px-4"
              onClick={onClose}
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// Global window registration
window.LegalAndComplianceModal = LegalAndComplianceModal;
