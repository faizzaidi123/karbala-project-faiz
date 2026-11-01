const { useState, useEffect, useMemo, useCallback } = window.React;

import {
  CALIBRATED_POLE_SPACING_METERS,
  KEY_LANDMARK_POLES,
  getPoleData
} from '/js/data/smartPoleNavigationData.js';
import {
  CINEMATIC_CROWD_PALETTE,
  CROWD_SOURCE_BADGES,
  GRANULAR_CROWD_SEGMENTS,
  SHRINE_GATE_CROWD_DATA,
  SMART_MAWKIB_FACILITIES,
  HISTORICAL_61AH_TIME_SLIDER_STAGES,
  getPoleCrowdAndFacilitiesSummary,
  getSmartFacilityRecommendations,
  getHistoricalMapStageState
} from '/js/data/advancedPilgrimageData.js';
import { loadSavedWalkState, formatDuration } from '/js/components/ZaireenWalkTracker.js';

const GROUP_STORAGE_KEY = 'karbala_pilgrim_group_v1';
const JOURNAL_STORAGE_KEY = 'karbala_journey_journal_v1';
const OFFLINE_MAWKIB_KEY = 'karbala_offline_mawkib_pack_v1';

// ============================================================================
// FEATURE 1 — LIVE CROWD INTELLIGENCE & POLE/SEGMENT/GATE TELEMETRY VIEW
// ============================================================================
export function LiveCrowdIntelligenceView({
  selectedPoleNumber = 520,
  onSelectPole,
  onJumpToMapPole,
  onOpenMawkibAtPole
}) {
  const [inspectPole, setInspectPole] = useState(selectedPoleNumber || 520);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [fieldReportSegId, setFieldReportSegId] = useState('cseg_03');
  const [fieldReportLevel, setFieldReportLevel] = useState('BUSY');
  const [customSegmentOverrides, setCustomSegmentOverrides] = useState({});
  const [reportSavedMsg, setReportSavedMsg] = useState('');

  useEffect(() => {
    if (selectedPoleNumber) setInspectPole(selectedPoleNumber);
  }, [selectedPoleNumber]);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const poleSummary = useMemo(() => {
    return getPoleCrowdAndFacilitiesSummary(inspectPole);
  }, [inspectPole]);

  const effectiveSegments = useMemo(() => {
    return GRANULAR_CROWD_SEGMENTS.map((seg) => {
      const ov = customSegmentOverrides[seg.segmentId];
      const merged = ov ? { ...seg, ...ov } : seg;
      const effectiveSource = !isOnline ? 'STALE' : merged.sourceType;
      const palette = CINEMATIC_CROWD_PALETTE[merged.crowdLevel] || CINEMATIC_CROWD_PALETTE.UNKNOWN;
      const verifiedRestNearby = SMART_MAWKIB_FACILITIES.filter(
        (f) =>
          f.poleNumber >= merged.fromPole - 20 &&
          f.poleNumber <= merged.toPole + 20 &&
          f.verificationStatus === 'VERIFIED' &&
          (f.services.includes('rest') || f.services.includes('medical'))
      );
      return {
        ...merged,
        effectiveSource,
        palette,
        sourceBadge: CROWD_SOURCE_BADGES[effectiveSource] || CROWD_SOURCE_BADGES.ESTIMATED,
        verifiedRestNearby
      };
    });
  }, [customSegmentOverrides, isOnline]);

  const handleFieldReportSubmit = async (e) => {
    e.preventDefault();
    const palette = CINEMATIC_CROWD_PALETTE[fieldReportLevel] || CINEMATIC_CROWD_PALETTE.MODERATE;
    const override = {
      crowdLevel: fieldReportLevel,
      sourceType: 'REPORTED',
      averageWalkingSpeedKmh: palette.avgSpeedKmh,
      freshnessMinutes: 1,
      lastUpdateLabel: 'Updated 1 minute ago (Field Report)'
    };
    setCustomSegmentOverrides((prev) => ({ ...prev, [fieldReportSegId]: override }));
    setReportSavedMsg('Field condition report recorded and tagged as REPORTED.');
    setTimeout(() => setReportSavedMsg(''), 4000);

    try {
      await fetch('/api/crowd/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          segmentId: fieldReportSegId,
          crowdLevel: fieldReportLevel,
          averageWalkingSpeedKmh: palette.avgSpeedKmh,
          sourceType: 'REPORTED'
        })
      });
    } catch (_) {}
  };

  return (
    <div className="live-crowd-intelligence-view">
      {/* Offline / Freshness Banner */}
      {!isOnline && (
        <div className="alert rounded-4 mb-3 border d-flex align-items-center gap-2" style={{ background: 'rgba(100,116,139,0.2)', borderColor: '#64748B', color: '#e2e8f0' }}>
          <i className="bi bi-wifi-off text-warning fs-5"></i>
          <div>
            <strong>Offline Mode — Displaying Cached Crowd Snapshot (Marked STALE)</strong>
            <div className="small text-secondary">Cached readings are never shown as live when your device is offline.</div>
          </div>
        </div>
      )}

      {/* Top Legend & Source Transparency Bar */}
      <div className="p-3.5 rounded-4 mb-4 border" style={{ background: 'rgba(13, 19, 28, 0.96)', borderColor: 'rgba(198,166,107,0.35)' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
          <div>
            <span className="badge rounded-pill px-3 py-1 fw-bold mb-1" style={{ background: 'rgba(198,166,107,0.18)', color: '#dfc08a', border: '1px solid rgba(198,166,107,0.45)' }}>
              <i className="bi bi-activity me-1"></i> FEATURE 1 • REAL-TIME & NEAR-REAL-TIME CROWD LAYER
            </span>
            <h3 className="h5 font-display text-white mb-0">
              Najaf → Karbala Route Segments, Pole Crowding & Shrine Gates
            </h3>
          </div>

          {/* Source Distinction Badges */}
          <div className="d-flex flex-wrap gap-1.5">
            {Object.values(CROWD_SOURCE_BADGES).map((b) => (
              <span
                key={b.id}
                className="badge bg-dark border border-secondary text-light px-2.5 py-1"
                title={b.desc}
              >
                <strong className="text-warning">{b.label}</strong>: {b.desc.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>

        {/* Muted Cinematic Karbala Crowd Scale */}
        <div className="row g-2">
          {Object.values(CINEMATIC_CROWD_PALETTE).map((lvl) => (
            <div key={lvl.id} className="col-6 col-md">
              <div
                className="p-2.5 rounded-3 h-100 border"
                style={{ background: lvl.badgeBg, borderColor: lvl.badgeBorder }}
              >
                <div className="d-flex align-items-center gap-2">
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: lvl.hex, display: 'inline-block' }}></span>
                  <strong className="text-white small">{lvl.label}</strong>
                </div>
                <div className="text-secondary mt-1" style={{ fontSize: '0.72rem' }}>
                  {lvl.avgSpeedKmh ? `Avg Speed ~${lvl.avgSpeedKmh} km/h` : 'Sensor Offline'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CROWD + POLE INTEGRATION INSPECTOR */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-5">
          <div className="p-4 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.96)', borderColor: 'rgba(198,166,107,0.35)' }}>
            <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
              <h4 className="h6 font-display text-warning mb-0">
                <i className="bi bi-signpost-split-fill me-1.5"></i>
                CROWD + POLE INSPECTOR
              </h4>
              <div className="input-group input-group-sm" style={{ width: '155px' }}>
                <span className="input-group-text bg-dark text-secondary border-secondary">Pole #</span>
                <input
                  type="number"
                  min="1"
                  max="1452"
                  className="form-control bg-dark text-white border-secondary fw-bold"
                  value={inspectPole}
                  onChange={(e) => {
                    const val = Math.max(1, Math.min(1452, Number(e.target.value) || 1));
                    setInspectPole(val);
                    if (onSelectPole) onSelectPole(val);
                  }}
                />
              </div>
            </div>

            <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25 mb-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="h4 font-display text-white mb-0">Pole {poleSummary.poleNumber}</span>
                <span
                  className="badge rounded-pill px-3 py-1.5 fw-bold"
                  style={{ background: poleSummary.crowdHex, color: '#fff' }}
                >
                  Crowd: {poleSummary.crowdLabel}
                </span>
              </div>
              <div className="small text-secondary mb-2">
                <span className="badge bg-dark border border-warning text-warning me-1.5">
                  {!isOnline ? 'STALE' : poleSummary.sourceType}
                </span>
                <span>{poleSummary.lastUpdateLabel}</span>
              </div>

              <div className="row g-2 text-center mt-2">
                <div className="col-4">
                  <div className="p-2 rounded-3 bg-black bg-opacity-50 border border-secondary border-opacity-25">
                    <div className="text-secondary" style={{ fontSize: '0.7rem' }}>Nearby Rest Areas</div>
                    <div className="fw-bold text-white fs-6">{poleSummary.nearbyRestAreasCount}</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 rounded-3 bg-black bg-opacity-50 border border-secondary border-opacity-25">
                    <div className="text-secondary" style={{ fontSize: '0.7rem' }}>Medical</div>
                    <div className="fw-bold text-info fs-6">{poleSummary.nearbyMedicalCount} nearby</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 rounded-3 bg-black bg-opacity-50 border border-secondary border-opacity-25">
                    <div className="text-secondary" style={{ fontSize: '0.7rem' }}>Water</div>
                    <div className="fw-bold text-success fs-6">{poleSummary.waterAvailable}</div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-top small" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="text-light">
                  <strong>Next Busy Segment:</strong>{' '}
                  <span className="text-warning">{poleSummary.nextBusySegmentLabel}</span>
                </div>
                {poleSummary.lessCongestedAlternative && (
                  <div className="mt-2 p-2 rounded-3" style={{ background: 'rgba(82, 140, 110, 0.16)', border: '1px solid rgba(82, 140, 110, 0.45)', color: '#d1fae5' }}>
                    <i className="bi bi-sign-turn-right-fill me-1.5 text-success"></i>
                    <strong>{poleSummary.lessCongestedAlternative}</strong>
                  </div>
                )}
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-sm btn-warning text-dark fw-bold rounded-pill px-3"
                onClick={() => onJumpToMapPole && onJumpToMapPole(poleSummary.poleNumber)}
              >
                <i className="bi bi-map-fill me-1"></i> View Pole #{poleSummary.poleNumber} on Crowd Map
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-light rounded-pill px-3"
                onClick={() => onOpenMawkibAtPole && onOpenMawkibAtPole(poleSummary.poleNumber)}
              >
                <i className="bi bi-house-heart-fill text-warning me-1"></i> Find Mawkibs Near Pole #{poleSummary.poleNumber}
              </button>
            </div>
          </div>
        </div>

        {/* SHRINE GATE CROWD STATUS */}
        <div className="col-12 col-lg-7">
          <div className="p-4 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.96)', borderColor: 'rgba(198,166,107,0.35)' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h4 className="h6 font-display text-warning mb-0">
                  <i className="bi bi-door-open-fill me-1.5"></i>
                  SHRINE GATE CROWD STATUS (VERIFIED PORTAL TELEMETRY)
                </h4>
                <div className="text-secondary small">Backed by Holy Shrine steward & portal checkpoint data</div>
              </div>
              <span className="badge bg-dark border border-secondary text-secondary">5 Sanctuary Portals</span>
            </div>

            <div className="d-flex flex-column gap-2">
              {SHRINE_GATE_CROWD_DATA.map((gate) => {
                const pal = CINEMATIC_CROWD_PALETTE[gate.crowdLevel] || CINEMATIC_CROWD_PALETTE.MODERATE;
                return (
                  <div
                    key={gate.gateId}
                    className="p-2.5 px-3 rounded-3 bg-dark border border-secondary border-opacity-25 d-flex flex-wrap align-items-center justify-content-between gap-2"
                  >
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-secondary text-white">{gate.gateCode}</span>
                        <strong className="text-white small">{gate.name}</strong>
                        <span className="text-secondary small">({gate.shrine})</span>
                      </div>
                      <div className="small text-secondary mt-0.5">
                        {gate.recommendation} • <em>{gate.lastUpdateLabel}</em>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-black border border-secondary text-light">
                        {!isOnline ? 'STALE' : gate.sourceType}
                      </span>
                      <span
                        className="badge rounded-pill px-3 py-1 fw-bold"
                        style={{ background: pal.hex, color: '#fff' }}
                      >
                        {pal.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ROUTE SEGMENT CROWDING LIST (Tap any segment for details + Cross-Feature Crowd + Mawkib) */}
      <div className="p-4 rounded-4 border mb-4" style={{ background: 'rgba(13, 19, 28, 0.96)', borderColor: 'rgba(198,166,107,0.35)' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <div>
            <h4 className="h5 font-display text-white mb-0">
              <i className="bi bi-distribute-horizontal text-warning me-2"></i>
              Route Segment Crowding (Poles 1 → 1,452)
            </h4>
            <p className="text-secondary small mb-0">
              Tap any segment for detailed walking speed, freshness, parallel less-crowded route suggestions, and nearby verified rest Mawkibs.
            </p>
          </div>
        </div>

        <div className="row g-2.5">
          {effectiveSegments.map((seg) => {
            const isSelected = selectedSegment?.segmentId === seg.segmentId;
            return (
              <div key={seg.segmentId} className="col-12 col-md-6">
                <div
                  className="p-3 rounded-3 border cursor-pointer h-100"
                  style={{
                    background: isSelected ? 'rgba(198,166,107,0.12)' : 'rgba(20, 27, 38, 0.9)',
                    borderColor: isSelected ? '#dfc08a' : seg.palette.badgeBorder
                  }}
                  onClick={() => setSelectedSegment(isSelected ? null : seg)}
                >
                  <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                    <strong className="text-white small">{seg.name}</strong>
                    <span
                      className="badge rounded-pill px-2.5 py-1 fw-bold"
                      style={{ background: seg.palette.hex, color: '#fff', fontSize: '0.72rem' }}
                    >
                      {seg.palette.label}
                    </span>
                  </div>

                  <div className="d-flex flex-wrap align-items-center gap-3 small text-secondary mt-1">
                    <span>
                      Avg Walking Speed: <strong className="text-light">{seg.averageWalkingSpeedKmh} km/h</strong>
                    </span>
                    <span>
                      Last Update: <strong className="text-warning">{seg.lastUpdateLabel}</strong>
                    </span>
                    <span className="badge bg-dark border border-secondary text-light">
                      {seg.effectiveSource}
                    </span>
                    {seg.restAreaOverload && (
                      <span className="badge bg-warning-subtle text-warning border border-warning-subtle">
                        Rest Areas Busy
                      </span>
                    )}
                  </div>

                  {seg.lessCongestedAlternative && (
                    <div className="small mt-2 p-2 rounded-2" style={{ background: 'rgba(82, 140, 110, 0.16)', color: '#a7f3d0' }}>
                      <i className="bi bi-signpost-split me-1"></i>
                      {seg.lessCongestedAlternative}
                    </div>
                  )}

                  {/* Cross-Feature Integration: Crowd + Mawkib verified rest options when busy */}
                  {(seg.crowdLevel === 'BUSY' || seg.crowdLevel === 'VERY_BUSY' || isSelected) && seg.verifiedRestNearby.length > 0 && (
                    <div className="mt-2 pt-2 border-top small" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                      <div className="text-warning fw-semibold mb-1">
                        <i className="bi bi-house-heart-fill me-1"></i>
                        Verified Rest & Medical Options in This Sector:
                      </div>
                      {seg.verifiedRestNearby.slice(0, 2).map((fac) => (
                        <div key={fac.facilityId} className="d-flex justify-content-between text-light">
                          <span>• Pole #{fac.poleNumber}: {fac.name}</span>
                          <span className="text-success">{fac.verificationStatus}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin / Field Observer Condition Update Form */}
      <div className="p-3.5 rounded-4 border" style={{ background: 'rgba(13, 19, 28, 0.92)', borderColor: 'rgba(255,255,255,0.1)' }}>
        <form onSubmit={handleFieldReportSubmit} className="row g-2 align-items-end">
          <div className="col-12 col-md-5">
            <label className="form-label small text-secondary mb-1">Submit Field / Observer Condition Update</label>
            <select
              className="form-select form-select-sm bg-dark text-white border-secondary"
              value={fieldReportSegId}
              onChange={(e) => setFieldReportSegId(e.target.value)}
            >
              {GRANULAR_CROWD_SEGMENTS.map((s) => (
                <option key={s.segmentId} value={s.segmentId}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-4">
            <label className="form-label small text-secondary mb-1">Observed Crowd Level</label>
            <select
              className="form-select form-select-sm bg-dark text-white border-secondary"
              value={fieldReportLevel}
              onChange={(e) => setFieldReportLevel(e.target.value)}
            >
              <option value="LOW">Low Crowd</option>
              <option value="MODERATE">Moderate</option>
              <option value="BUSY">Busy</option>
              <option value="VERY_BUSY">Very Busy</option>
            </select>
          </div>
          <div className="col-6 col-md-3">
            <button type="submit" className="btn btn-sm btn-outline-warning w-100 rounded-pill py-1.5 fw-bold">
              Log Field Update (REPORTED)
            </button>
          </div>
        </form>
        {reportSavedMsg && <div className="small text-success mt-2">{reportSavedMsg}</div>}
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 2 — SMART MAWKIB & PILGRIM FACILITY FINDER VIEW
// ============================================================================
export function SmartMawkibFinderView({
  currentPoleNumber = 520,
  onSelectPole,
  onJumpToMapPole,
  onSetGroupMeetingPoint
}) {
  const [finderMode, setFinderMode] = useState('ahead'); // 'nearby' | 'ahead'
  const [userPole, setUserPole] = useState(currentPoleNumber || 650);
  const [aheadRangePoles, setAheadRangePoles] = useState(100); // 100 poles ~ 5 km (or 50 poles)
  const [activeServiceFilter, setActiveServiceFilter] = useState('all');
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);
  const [onlyWithin500m, setOnlyWithin500m] = useState(false);
  const [onlyNext10Poles, setOnlyNext10Poles] = useState(false);
  const [communityFacilities, setCommunityFacilities] = useState([]);
  const [newMawkibName, setNewMawkibName] = useState('');
  const [newMawkibPole, setNewMawkibPole] = useState(650);
  const [newMawkibService, setNewMawkibService] = useState('water');
  const [offlineSavedBanner, setOfflineSavedBanner] = useState('');

  useEffect(() => {
    if (currentPoleNumber) setUserPole(currentPoleNumber);
  }, [currentPoleNumber]);

  const allFacilities = useMemo(() => {
    return [...SMART_MAWKIB_FACILITIES, ...communityFacilities].sort((a, b) => a.poleNumber - b.poleNumber);
  }, [communityFacilities]);

  const filteredFacilities = useMemo(() => {
    const pNum = Math.max(1, Math.min(1452, Number(userPole) || 650));
    return allFacilities
      .map((fac) => {
        const poleDelta = fac.poleNumber - pNum;
        const distanceMeters = Math.round(Math.abs(poleDelta) * CALIBRATED_POLE_SPACING_METERS);
        return {
          ...fac,
          poleDelta,
          direction: poleDelta >= 0 ? 'AHEAD' : 'BEHIND',
          distanceMeters,
          walkingMins: Math.max(1, Math.round(distanceMeters / 68))
        };
      })
      .filter((f) => {
        if (finderMode === 'ahead') {
          if (f.poleDelta < 0 || f.poleDelta > aheadRangePoles) return false;
        } else {
          if (f.distanceMeters > 6000) return false;
        }
        if (onlyOpenNow && f.availabilityStatus !== 'OPEN_NOW') return false;
        if (onlyWithin500m && f.distanceMeters > 500) return false;
        if (onlyNext10Poles && (f.poleDelta < 0 || f.poleDelta > 10)) return false;
        if (activeServiceFilter !== 'all') {
          if (activeServiceFilter === 'family') {
            if (!f.genderFamilyNotes.toLowerCase().includes('family') && !f.genderFamilyNotes.toLowerCase().includes('women')) return false;
          } else if (!f.services.includes(activeServiceFilter)) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => (finderMode === 'ahead' ? a.poleNumber - b.poleNumber : a.distanceMeters - b.distanceMeters));
  }, [allFacilities, userPole, finderMode, aheadRangePoles, onlyOpenNow, onlyWithin500m, onlyNext10Poles, activeServiceFilter]);

  const smartRecs = useMemo(() => {
    return getSmartFacilityRecommendations(userPole);
  }, [userPole]);

  const handleSaveOfflineMawkibPack = () => {
    try {
      localStorage.setItem(
        OFFLINE_MAWKIB_KEY,
        JSON.stringify({
          savedAt: new Date().toISOString(),
          totalPoles: 1452,
          landmarks: KEY_LANDMARK_POLES,
          facilities: allFacilities
        })
      );
      setOfflineSavedBanner('Offline Mawkib, Medical, Water & Route Survival Pack saved to local device storage.');
      setTimeout(() => setOfflineSavedBanner(''), 4500);
    } catch (_) {}
  };

  const handleAddCommunityMawkib = async (e) => {
    e.preventDefault();
    if (!newMawkibName.trim()) return;
    const pNum = Math.max(1, Math.min(1452, Number(newMawkibPole) || 650));
    const coords = getPoleData(pNum).coordinates;
    const entry = {
      facilityId: 'comm_' + Date.now(),
      name: newMawkibName.trim(),
      poleNumber: pNum,
      coordinates: { lat: coords[0], lng: coords[1] },
      services: ['mawkib', newMawkibService],
      availabilityStatus: 'OPEN_NOW',
      verificationStatus: 'COMMUNITY_REPORTED', // Never auto-verified!
      genderFamilyNotes: 'Community Reported — Verify on arrival',
      accessibility: 'Roadside access',
      lastVerified: 'Just submitted (Community Reported)',
      source: 'Pilgrim Community Submission',
      openHours: 'Reported Open',
      description: 'Submitted by a fellow pilgrim. Marked as Community Reported until verified by field stewards.'
    };
    setCommunityFacilities((prev) => [...prev, entry]);
    setNewMawkibName('');
    try {
      await fetch('/api/facilities/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch (_) {}
  };

  return (
    <div className="smart-mawkib-finder-view">
      {/* Header & Mode Switcher (NEAR YOU vs ROUTE-AHEAD) */}
      <div className="p-3.5 rounded-4 mb-4 border" style={{ background: 'rgba(13, 19, 28, 0.96)', borderColor: 'rgba(198,166,107,0.35)' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
          <div>
            <span className="badge rounded-pill px-3 py-1 fw-bold mb-1" style={{ background: 'rgba(198,166,107,0.18)', color: '#dfc08a', border: '1px solid rgba(198,166,107,0.45)' }}>
              <i className="bi bi-house-heart-fill me-1"></i> FEATURE 2 • SMART MAWKIB & PILGRIM FACILITY FINDER
            </span>
            <h3 className="h5 font-display text-white mb-0">
              Verified Mawkibs, Water, Medical, Rest, Washrooms & Charging Along the 1,452 Poles
            </h3>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2">
            <div className="input-group input-group-sm" style={{ width: '165px' }}>
              <span className="input-group-text bg-dark text-secondary border-secondary">Your Pole</span>
              <input
                type="number"
                min="1"
                max="1452"
                className="form-control bg-dark text-white border-secondary fw-bold"
                value={userPole}
                onChange={(e) => {
                  const v = Math.max(1, Math.min(1452, Number(e.target.value) || 1));
                  setUserPole(v);
                  if (onSelectPole) onSelectPole(v);
                }}
              />
            </div>

            <button
              type="button"
              className="btn btn-sm btn-outline-warning rounded-pill px-3 py-1.5 fw-semibold"
              onClick={handleSaveOfflineMawkibPack}
            >
              <i className="bi bi-cloud-arrow-down-fill me-1"></i> Save Offline Mawkib Pack
            </button>
          </div>
        </div>

        {offlineSavedBanner && (
          <div className="alert alert-success py-2 small rounded-3 mb-3">{offlineSavedBanner}</div>
        )}

        {/* Smart Factual Recommendations Strip */}
        <div className="row g-2 mb-3">
          {smartRecs.map((rec, i) => (
            <div key={i} className="col-12 col-md-4">
              <div className="p-2.5 rounded-3 bg-dark border border-warning border-opacity-25 d-flex align-items-center gap-2 small">
                <i className={`bi ${rec.icon} text-warning fs-5`}></i>
                <span className="text-light">{rec.text}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mode Selector: NEAR YOU vs ROUTE-AHEAD (NEXT 50 POLES / NEXT 5 KM) */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-2 border-top" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="btn-group btn-group-sm">
            <button
              type="button"
              className={`btn px-3 py-1.5 ${finderMode === 'nearby' ? 'btn-warning text-dark fw-bold' : 'btn-dark text-light border-secondary'}`}
              onClick={() => setFinderMode('nearby')}
            >
              <i className="bi bi-geo-alt-fill me-1"></i> NEAR YOU (Around Pole #{userPole})
            </button>
            <button
              type="button"
              className={`btn px-3 py-1.5 ${finderMode === 'ahead' && aheadRangePoles === 50 ? 'btn-warning text-dark fw-bold' : 'btn-dark text-light border-secondary'}`}
              onClick={() => {
                setFinderMode('ahead');
                setAheadRangePoles(50);
              }}
            >
              <i className="bi bi-signpost-2-fill me-1"></i> ROUTE-AHEAD: NEXT 50 POLES (~2.5 km)
            </button>
            <button
              type="button"
              className={`btn px-3 py-1.5 ${finderMode === 'ahead' && aheadRangePoles === 100 ? 'btn-warning text-dark fw-bold' : 'btn-dark text-light border-secondary'}`}
              onClick={() => {
                setFinderMode('ahead');
                setAheadRangePoles(100);
              }}
            >
              <i className="bi bi-arrow-up-right-circle-fill me-1"></i> ROUTE-AHEAD: NEXT 5 KM (100 Poles)
            </button>
            <button
              type="button"
              className={`btn px-3 py-1.5 ${finderMode === 'ahead' && aheadRangePoles === 1452 ? 'btn-warning text-dark fw-bold' : 'btn-dark text-light border-secondary'}`}
              onClick={() => {
                setFinderMode('ahead');
                setAheadRangePoles(1452);
              }}
            >
              All Ahead to Karbala
            </button>
          </div>

          {/* Quick Range Toggles */}
          <div className="d-flex flex-wrap gap-1.5">
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-2.5 py-1 ${onlyOpenNow ? 'btn-success' : 'btn-outline-secondary text-light'}`}
              onClick={() => setOnlyOpenNow(!onlyOpenNow)}
            >
              Open Now
            </button>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-2.5 py-1 ${onlyWithin500m ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
              onClick={() => setOnlyWithin500m(!onlyWithin500m)}
            >
              Within 500m
            </button>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-2.5 py-1 ${onlyNext10Poles ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
              onClick={() => setOnlyNext10Poles(!onlyNext10Poles)}
            >
              Next 10 Poles
            </button>
          </div>
        </div>

        {/* Smart Category Filter Pills */}
        <div className="d-flex flex-wrap gap-1.5 mt-3">
          {[
            { id: 'all', label: 'All Services', icon: 'bi-grid-fill' },
            { id: 'medical', label: 'Medical & Pharmacy', icon: 'bi-hospital-fill' },
            { id: 'water', label: 'Water', icon: 'bi-droplet-fill' },
            { id: 'food', label: 'Food & Tea', icon: 'bi-cup-hot-fill' },
            { id: 'rest', label: 'Rest / Sleeping', icon: 'bi-moon-stars-fill' },
            { id: 'washroom', label: 'Washroom / Wudu', icon: 'bi-badge-wc-fill' },
            { id: 'family', label: 'Family / Women', icon: 'bi-people-fill' },
            { id: 'wheelchair', label: 'Wheelchair Support', icon: 'bi-person-wheelchair' },
            { id: 'charging', label: 'Charging Point', icon: 'bi-battery-charging' },
            { id: 'prayer', label: 'Prayer Area', icon: 'bi-brightness-alt-high-fill' },
            { id: 'lost_found', label: 'Lost & Found', icon: 'bi-broadcast' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="btn btn-sm rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1"
              style={{
                background: activeServiceFilter === cat.id ? '#c6a66b' : 'rgba(255,255,255,0.05)',
                color: activeServiceFilter === cat.id ? '#0a0d12' : '#e2e8f0',
                fontWeight: activeServiceFilter === cat.id ? 700 : 500,
                border: '1px solid rgba(198,166,107,0.3)'
              }}
              onClick={() => setActiveServiceFilter(cat.id)}
            >
              <i className={`bi ${cat.icon}`}></i>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FACILITY RESULTS CARDS */}
      <div className="row g-3 mb-4">
        {filteredFacilities.length > 0 ? (
          filteredFacilities.map((fac) => (
            <div key={fac.facilityId} className="col-12 col-md-6">
              <div className="p-3.5 rounded-4 h-100 border d-flex flex-column justify-content-between" style={{ background: 'rgba(14, 20, 29, 0.95)', borderColor: 'rgba(198,166,107,0.3)' }}>
                <div>
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-1.5">
                    <span className="badge bg-warning text-dark fw-bold rounded-pill px-2.5 py-1">
                      Pole {fac.poleNumber}
                    </span>
                    <div className="d-flex align-items-center gap-1.5">
                      <span
                        className={`badge rounded-pill px-2.5 py-1 ${
                          fac.verificationStatus === 'VERIFIED'
                            ? 'bg-success-subtle text-success border border-success'
                            : 'bg-info-subtle text-info border border-info'
                        }`}
                      >
                        {fac.verificationStatus === 'VERIFIED' ? '✓ Verified' : 'Community Reported'}
                      </span>
                      <span className="badge bg-dark border border-secondary text-light">
                        {fac.distanceMeters < 1000
                          ? `${fac.distanceMeters} m ${fac.direction === 'AHEAD' ? 'ahead' : 'behind'}`
                          : `${(fac.distanceMeters / 1000).toFixed(1)} km ${fac.direction === 'AHEAD' ? 'ahead' : 'behind'}`}
                      </span>
                    </div>
                  </div>

                  <h4 className="h6 font-display text-white mb-0.5">{fac.name}</h4>
                  {fac.arabicName && <div className="font-arabic text-warning small mb-1">{fac.arabicName}</div>}
                  <p className="text-secondary small mb-2">{fac.description}</p>

                  {/* Services Badges */}
                  <div className="d-flex flex-wrap gap-1 mb-2">
                    {fac.services.map((srv) => (
                      <span key={srv} className="badge bg-dark border border-secondary text-uppercase" style={{ fontSize: '0.66rem', color: '#dfc08a' }}>
                        {srv.replace('_', ' ')}
                      </span>
                    ))}
                  </div>

                  <div className="small text-secondary p-2 rounded-3 bg-dark border border-secondary border-opacity-25 mb-2">
                    <div><strong>Family / Gender Notes:</strong> {fac.genderFamilyNotes}</div>
                    <div><strong>Accessibility:</strong> {fac.accessibility}</div>
                    <div><strong>Source:</strong> {fac.source} • <em>Verified {fac.lastVerified}</em></div>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2 pt-2 border-top" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-warning rounded-pill px-3"
                    onClick={() => onJumpToMapPole && onJumpToMapPole(fac.poleNumber)}
                  >
                    <i className="bi bi-geo-alt-fill me-1"></i> View on Map
                  </button>
                  {onSetGroupMeetingPoint && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-info rounded-pill px-3"
                      onClick={() => onSetGroupMeetingPoint(fac)}
                    >
                      <i className="bi bi-people-fill me-1"></i> Set as Group Meeting Point
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="p-4 rounded-4 bg-dark border border-secondary text-center text-secondary">
              No facilities match your exact filter within this range. Click <strong>"All Ahead to Karbala"</strong> or clear the 500m filter to see all verified Mawkibs.
            </div>
          </div>
        )}
      </div>

      {/* Submit Community-Reported Mawkib Form */}
      <div className="p-3.5 rounded-4 border" style={{ background: 'rgba(13, 19, 28, 0.92)', borderColor: 'rgba(255,255,255,0.1)' }}>
        <h4 className="h6 font-display text-warning mb-1">
          <i className="bi bi-plus-circle me-1.5"></i>
          Report a Mawkib or Pilgrim Service Point (Labeled Community Reported)
        </h4>
        <p className="text-secondary small mb-2">
          Community-submitted points are clearly badged as <strong>Community Reported</strong> and are never treated as officially verified automatically.
        </p>
        <form onSubmit={handleAddCommunityMawkib} className="row g-2 align-items-end">
          <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control form-control-sm bg-dark text-white border-secondary"
              placeholder="Mawkib Name (e.g. Mawkib Al-Kafeel Tea Tent)"
              value={newMawkibName}
              onChange={(e) => setNewMawkibName(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-3">
            <input
              type="number"
              min="1"
              max="1452"
              className="form-control form-control-sm bg-dark text-white border-secondary"
              placeholder="Pole Number"
              value={newMawkibPole}
              onChange={(e) => setNewMawkibPole(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-3">
            <select
              className="form-select form-select-sm bg-dark text-white border-secondary"
              value={newMawkibService}
              onChange={(e) => setNewMawkibService(e.target.value)}
            >
              <option value="water">Water + Tea</option>
              <option value="food">Hot Food</option>
              <option value="rest">Sleeping / Rest Area</option>
              <option value="medical">First Aid / Medical</option>
              <option value="charging">Phone Charging</option>
            </select>
          </div>
          <div className="col-12 col-md-2">
            <button type="submit" className="btn btn-sm btn-warning text-dark fw-bold w-100 rounded-pill">
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 3 — PRIVACY-FIRST GROUP JOURNEY MODE VIEW
// ============================================================================
export function GroupJourneyModeView({
  currentPoleNumber = 520,
  onJumpToMapPole,
  pendingMeetingFacility
}) {
  const [groupState, setGroupState] = useState(() => {
    try {
      const saved = localStorage.getItem(GROUP_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      groupId: 'grp_family_arbaeen',
      groupName: 'My Arbaeen Family Group',
      groupCategory: 'FAMILY',
      inviteCode: 'KARBALA-726-FAM',
      isPubliclySearchable: false,
      myMemberId: 'me_pilgrim',
      myDisplayName: 'You (Group Leader)',
      myPole: currentPoleNumber || 510,
      myStatus: 'WALKING',
      myAlert: 'NONE',
      privacy: {
        sharePole: true,
        shareExactLocation: false,
        shareSteps: false,
        shareJourneyProgress: false,
        shareBattery: false,
        shareStatus: true
      },
      meetingPoint: {
        title: 'Pole 800 — Verified Mawkib & Rest Plaza',
        pointType: 'POLE',
        poleNumber: 800,
        notes: 'Wait beside the main water filtration banner at Pole 800.'
      },
      members: [
        {
          memberId: 'me_pilgrim',
          displayName: 'You (Group Leader)',
          role: 'LEADER',
          walkingStatus: 'WALKING',
          approximatePole: 510,
          minutesAgo: 1,
          activeAlert: 'NONE'
        },
        {
          memberId: 'fam_1',
          displayName: 'Family Member 1',
          role: 'MEMBER',
          walkingStatus: 'WALKING',
          approximatePole: 480,
          minutesAgo: 7,
          activeAlert: 'NONE'
        },
        {
          memberId: 'fam_2',
          displayName: 'Family Member 2',
          role: 'MEMBER',
          walkingStatus: 'RESTING',
          approximatePole: 495,
          minutesAgo: 12,
          activeAlert: 'WAITING_HERE'
        }
      ]
    };
  });

  const [newGroupName, setNewGroupName] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [newMemberNameInput, setNewMemberNameInput] = useState('');
  const [newMemberPoleInput, setNewMemberPoleInput] = useState(500);
  const [meetingPoleInput, setMeetingPoleInput] = useState(groupState.meetingPoint?.poleNumber || 800);
  const [meetingTitleInput, setMeetingTitleInput] = useState(groupState.meetingPoint?.title || 'Pole 800 Meeting Point');
  const [showQrModal, setShowQrModal] = useState(false);

  const saveGroup = useCallback((next) => {
    setGroupState(next);
    try {
      localStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent('karbala-group-updated'));
    } catch (_) {}
  }, []);

  // Apply external "Set as Group Meeting Point" from Smart Mawkib Finder
  useEffect(() => {
    if (pendingMeetingFacility) {
      const next = {
        ...groupState,
        meetingPoint: {
          title: `Pole ${pendingMeetingFacility.poleNumber} — ${pendingMeetingFacility.name}`,
          pointType: 'VERIFIED_MAWKIB',
          poleNumber: pendingMeetingFacility.poleNumber,
          notes: `Verified Mawkib meeting point (${pendingMeetingFacility.services.join(', ')})`
        }
      };
      setMeetingPoleInput(pendingMeetingFacility.poleNumber);
      setMeetingTitleInput(next.meetingPoint.title);
      saveGroup(next);
    }
  }, [pendingMeetingFacility]);

  // One-Tap "I'M OK / CHECK IN"
  const handleCheckInNow = async (statusOverride = null, alertOverride = null) => {
    const nextStatus = statusOverride || groupState.myStatus || 'WALKING';
    const nextAlert = alertOverride !== null ? alertOverride : groupState.myAlert;
    const poleNow = Math.max(1, Math.min(1452, Number(groupState.myPole) || currentPoleNumber || 510));

    const updatedMembers = groupState.members.map((m) =>
      m.memberId === 'me_pilgrim'
        ? {
            ...m,
            walkingStatus: nextStatus,
            approximatePole: groupState.privacy.sharePole ? poleNow : null,
            minutesAgo: 0,
            activeAlert: nextAlert
          }
        : m
    );

    const next = {
      ...groupState,
      myPole: poleNow,
      myStatus: nextStatus,
      myAlert: nextAlert,
      members: updatedMembers
    };
    saveGroup(next);

    try {
      await fetch(`/api/groups/${groupState.groupId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: 'me_pilgrim',
          displayName: groupState.myDisplayName,
          walkingStatus: nextStatus,
          approximatePole: poleNow,
          activeAlert: nextAlert,
          privacySettings: groupState.privacy
        })
      });
    } catch (_) {}
  };

  const handleCreateNewGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const code = 'KARBALA-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const next = {
      ...groupState,
      groupName: newGroupName.trim(),
      inviteCode: code,
      isPubliclySearchable: false
    };
    saveGroup(next);
    setNewGroupName('');
  };

  const handleAddGroupMember = (e) => {
    e.preventDefault();
    if (!newMemberNameInput.trim()) return;
    const p = Math.max(1, Math.min(1452, Number(newMemberPoleInput) || 500));
    const next = {
      ...groupState,
      members: [
        ...groupState.members,
        {
          memberId: 'mem_' + Date.now(),
          displayName: newMemberNameInput.trim(),
          role: 'MEMBER',
          walkingStatus: 'WALKING',
          approximatePole: p,
          minutesAgo: 1,
          activeAlert: 'NONE'
        }
      ]
    };
    saveGroup(next);
    setNewMemberNameInput('');
  };

  const handleUpdateMeetingPoint = (e) => {
    e.preventDefault();
    const p = Math.max(1, Math.min(1452, Number(meetingPoleInput) || 800));
    const next = {
      ...groupState,
      meetingPoint: {
        title: meetingTitleInput.trim() || `Pole ${p} Meeting Point`,
        pointType: 'POLE',
        poleNumber: p,
        notes: `Check in when arriving near Pole ${p}.`
      }
    };
    saveGroup(next);
  };

  // Distance & walking time from user's pole to Meeting Point
  const meetingPointMetrics = useMemo(() => {
    const myP = Number(groupState.myPole) || 510;
    const targetP = Number(groupState.meetingPoint?.poleNumber) || 800;
    const diffPoles = targetP - myP;
    const distMeters = Math.round(Math.abs(diffPoles) * CALIBRATED_POLE_SPACING_METERS);
    const distKm = Number((distMeters / 1000).toFixed(2));
    const walkMins = Math.max(1, Math.round(distMeters / 68));
    return {
      diffPoles,
      direction: diffPoles >= 0 ? 'Ahead toward Karbala' : 'Behind toward Najaf',
      distMeters,
      distKm,
      walkMins
    };
  }, [groupState.myPole, groupState.meetingPoint]);

  // Cross-Feature: Group + Crowd notice (check if busy area is ahead of group leader)
  const busyAheadNotice = useMemo(() => {
    const myP = Number(groupState.myPole) || 510;
    const busySeg = GRANULAR_CROWD_SEGMENTS.find(
      (s) => s.fromPole >= myP && s.fromPole <= myP + 80 && (s.crowdLevel === 'BUSY' || s.crowdLevel === 'VERY_BUSY')
    );
    return busySeg;
  }, [groupState.myPole]);

  return (
    <div className="group-journey-mode-view">
      {/* Top Group Banner & Invite Code */}
      <div className="p-3.5 rounded-4 mb-4 border" style={{ background: 'rgba(13, 19, 28, 0.96)', borderColor: 'rgba(198,166,107,0.35)' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
              <span className="badge rounded-pill px-3 py-1 fw-bold" style={{ background: 'rgba(198,166,107,0.18)', color: '#dfc08a', border: '1px solid rgba(198,166,107,0.45)' }}>
                <i className="bi bi-people-fill me-1"></i> FEATURE 3 • PRIVACY-FIRST GROUP JOURNEY MODE
              </span>
              <span className="badge bg-dark border border-info text-info">
                <i className="bi bi-shield-lock-fill me-1"></i> Private Invite-Only Group
              </span>
              <span className="badge bg-dark border border-secondary text-light">
                Default: Approximate Pole Only ("Near Pole X")
              </span>
            </div>
            <h3 className="h4 font-display text-white mb-0">{groupState.groupName}</h3>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2">
            <div className="px-3 py-1.5 rounded-pill bg-dark border border-warning text-warning font-monospace fw-bold">
              Invite Code: {groupState.inviteCode}
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-warning rounded-pill px-3"
              onClick={() => setShowQrModal(!showQrModal)}
            >
              <i className="bi bi-qr-code me-1"></i> {showQrModal ? 'Hide QR Invite' : 'QR Invite'}
            </button>
          </div>
        </div>

        {/* Optional Inline SVG QR Code Invite Card */}
        {showQrModal && (
          <div className="mt-3 p-3 rounded-3 bg-dark border border-warning d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <svg width="84" height="84" viewBox="0 0 84 84" className="bg-white p-1.5 rounded-2">
                <rect x="4" y="4" width="24" height="24" fill="#000" />
                <rect x="8" y="8" width="16" height="16" fill="#fff" />
                <rect x="12" y="12" width="8" height="8" fill="#000" />
                <rect x="56" y="4" width="24" height="24" fill="#000" />
                <rect x="60" y="8" width="16" height="16" fill="#fff" />
                <rect x="64" y="12" width="8" height="8" fill="#000" />
                <rect x="4" y="56" width="24" height="24" fill="#000" />
                <rect x="8" y="60" width="16" height="16" fill="#fff" />
                <rect x="12" y="64" width="8" height="8" fill="#000" />
                <rect x="34" y="12" width="14" height="14" fill="#000" />
                <rect x="34" y="34" width="16" height="16" fill="#000" />
                <rect x="56" y="38" width="20" height="12" fill="#000" />
                <rect x="36" y="58" width="40" height="18" fill="#000" />
              </svg>
              <div>
                <strong className="text-warning d-block">Scan or Share Private Code: {groupState.inviteCode}</strong>
                <div className="small text-secondary">
                  Groups are never publicly searchable. Only family or caravan members with this code can join.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cross-Feature Alert: Group + Crowd */}
      {busyAheadNotice && (
        <div className="alert rounded-4 mb-4 border d-flex align-items-center justify-content-between gap-2" style={{ background: 'rgba(212, 136, 58, 0.15)', borderColor: 'rgba(212, 136, 58, 0.5)', color: '#fef3c7' }}>
          <div>
            <i className="bi bi-exclamation-circle-fill text-warning me-2"></i>
            <strong>Busy area ahead ({busyAheadNotice.name}):</strong> Keep family members together and confirm your active Meeting Point (<strong>{groupState.meetingPoint?.title}</strong>) before entering the congested sector.
          </div>
        </div>
      )}

      {/* ONE-TAP CHECK-IN ("I'M OK") & MANUAL GROUP ALERTS */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <div className="p-4 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.96)', borderColor: 'rgba(198,166,107,0.35)' }}>
            <h4 className="h6 font-display text-warning mb-2">
              <i className="bi bi-check2-circle me-1.5"></i>
              ONE-TAP VOLUNTARY CHECK-IN ("I'M OK")
            </h4>
            <p className="text-secondary small mb-3">
              Updates your check-in timestamp, status, and approximate pole (<strong>Near Pole {groupState.myPole}</strong>) without exposing continuous live GPS.
            </p>

            <div className="row g-2 align-items-center mb-3">
              <div className="col-5">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-dark text-secondary border-secondary">Near Pole</span>
                  <input
                    type="number"
                    min="1"
                    max="1452"
                    className="form-control bg-dark text-white border-secondary fw-bold"
                    value={groupState.myPole}
                    onChange={(e) => saveGroup({ ...groupState, myPole: Number(e.target.value) || 1 })}
                  />
                </div>
              </div>
              <div className="col-7">
                <button
                  type="button"
                  className="btn btn-success w-100 rounded-pill py-2 fw-bold shadow"
                  onClick={() => handleCheckInNow('WALKING', 'NONE')}
                >
                  <i className="bi bi-hand-thumbs-up-fill me-1.5"></i>
                  I'M OK • CHECK IN AT POLE #{groupState.myPole}
                </button>
              </div>
            </div>

            <div className="small text-secondary fw-semibold mb-1.5">OPTIONAL MANUAL GROUP ALERTS:</div>
            <div className="d-flex flex-wrap gap-1.5">
              {[
                { id: 'NONE', label: 'Clear Alert', cls: 'btn-outline-secondary text-light' },
                { id: 'WAITING_HERE', label: 'Waiting Here', cls: 'btn-outline-warning' },
                { id: 'MEET_ME_HERE', label: 'Meet Me Here', cls: 'btn-outline-info' },
                { id: 'RETURNING_TO_GROUP', label: 'Returning to Group', cls: 'btn-outline-success' },
                { id: 'NEED_HELP', label: 'Need Help', cls: 'btn-outline-danger' }
              ].map((al) => (
                <button
                  key={al.id}
                  type="button"
                  className={`btn btn-sm rounded-pill px-2.5 py-1 ${groupState.myAlert === al.id ? 'btn-warning text-dark fw-bold' : al.cls}`}
                  onClick={() => handleCheckInNow(al.id === 'WAITING_HERE' ? 'RESTING' : 'WALKING', al.id)}
                >
                  {al.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MEETING POINT CARD */}
        <div className="col-12 col-lg-6">
          <div className="p-4 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.96)', borderColor: 'rgba(198,166,107,0.35)' }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h4 className="h6 font-display text-warning mb-0">
                <i className="bi bi-pin-map-fill me-1.5"></i>
                GROUP MEETING POINT
              </h4>
              <span className="badge bg-warning text-dark fw-bold">
                Pole #{groupState.meetingPoint?.poleNumber || 800}
              </span>
            </div>

            <div className="p-3 rounded-3 bg-dark border border-warning border-opacity-25 mb-3">
              <div className="fw-bold text-white">{groupState.meetingPoint?.title}</div>
              <div className="small text-secondary mb-2">{groupState.meetingPoint?.notes}</div>
              <div className="d-flex flex-wrap gap-3 small">
                <span>
                  Distance from you: <strong className="text-warning">{meetingPointMetrics.distKm} km ({meetingPointMetrics.distMeters}m)</strong>
                </span>
                <span>
                  Est. Walking Time: <strong className="text-info">~{meetingPointMetrics.walkMins} mins</strong>
                </span>
                <span className="text-secondary">({meetingPointMetrics.direction})</span>
              </div>
            </div>

            <form onSubmit={handleUpdateMeetingPoint} className="row g-2">
              <div className="col-4">
                <input
                  type="number"
                  min="1"
                  max="1452"
                  className="form-control form-control-sm bg-dark text-white border-secondary"
                  placeholder="Pole #"
                  value={meetingPoleInput}
                  onChange={(e) => setMeetingPoleInput(e.target.value)}
                />
              </div>
              <div className="col-5">
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-white border-secondary"
                  placeholder="Pole 800 / Gate 3 / Mawkib"
                  value={meetingTitleInput}
                  onChange={(e) => setMeetingTitleInput(e.target.value)}
                />
              </div>
              <div className="col-3">
                <button type="submit" className="btn btn-sm btn-warning text-dark fw-bold w-100 rounded-pill">
                  Set Point
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* GROUP MEMBERS LIST & PRIVACY CENTER */}
      <div className="row g-3">
        <div className="col-12 col-lg-7">
          <div className="p-4 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.96)', borderColor: 'rgba(198,166,107,0.35)' }}>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
              <h4 className="h6 font-display text-white mb-0">
                <i className="bi bi-people text-warning me-2"></i>
                Group Members & Check-In Status ({groupState.members.length} Members)
              </h4>
              <div className="d-flex gap-1.5 small">
                <span className="badge bg-success-subtle text-success">
                  {groupState.members.filter((m) => m.walkingStatus === 'WALKING').length} Walking
                </span>
                <span className="badge bg-warning-subtle text-warning">
                  {groupState.members.filter((m) => m.walkingStatus === 'RESTING').length} Resting
                </span>
              </div>
            </div>

            <div className="d-flex flex-column gap-2 mb-3">
              {groupState.members.map((m) => (
                <div
                  key={m.memberId}
                  className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25 d-flex flex-wrap align-items-center justify-content-between gap-2"
                >
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <strong className="text-white">{m.displayName}</strong>
                      <span className="badge bg-secondary-subtle text-light" style={{ fontSize: '0.68rem' }}>
                        {m.walkingStatus}
                      </span>
                      {m.activeAlert && m.activeAlert !== 'NONE' && (
                        <span className="badge bg-warning text-dark fw-bold">
                          {m.activeAlert.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>
                    <div className="small text-secondary mt-1">
                      Checked in {m.minutesAgo === 0 ? 'just now' : `${m.minutesAgo} minutes ago`} •{' '}
                      <strong className="text-warning">
                        {m.approximatePole ? `Near Pole ${m.approximatePole}` : 'Position Private'}
                      </strong>
                    </div>
                  </div>

                  {m.approximatePole && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-warning rounded-pill px-2.5 py-1"
                      onClick={() => onJumpToMapPole && onJumpToMapPole(m.approximatePole)}
                    >
                      <i className="bi bi-geo-alt-fill me-1"></i> Near Pole #{m.approximatePole}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Family/Caravan Member Simulator */}
            <form onSubmit={handleAddGroupMember} className="row g-2 pt-2 border-top" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="col-6">
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-white border-secondary"
                  placeholder="Add Member Name (e.g. Uncle / Brother)"
                  value={newMemberNameInput}
                  onChange={(e) => setNewMemberNameInput(e.target.value)}
                />
              </div>
              <div className="col-3">
                <input
                  type="number"
                  min="1"
                  max="1452"
                  className="form-control form-control-sm bg-dark text-white border-secondary"
                  placeholder="Near Pole #"
                  value={newMemberPoleInput}
                  onChange={(e) => setNewMemberPoleInput(e.target.value)}
                />
              </div>
              <div className="col-3">
                <button type="submit" className="btn btn-sm btn-outline-warning w-100 rounded-pill">
                  + Add Member
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* PRIVACY CENTER (Default to least-sharing) */}
        <div className="col-12 col-lg-5">
          <div className="p-4 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.96)', borderColor: 'rgba(198,166,107,0.35)' }}>
            <h4 className="h6 font-display text-warning mb-2">
              <i className="bi bi-shield-lock-fill me-1.5"></i>
              PRIVACY CENTER (GRANULAR SHARING CONTROLS)
            </h4>
            <p className="text-secondary small mb-3">
              You control exactly what your group sees. Continuous exact GPS location is OFF by default.
            </p>

            <div className="d-flex flex-column gap-2">
              {[
                { key: 'sharePole', label: 'Share Approximate Pole ("Near Pole X")' },
                { key: 'shareStatus', label: 'Share Walking / Resting Status' },
                { key: 'shareExactLocation', label: 'Share Exact GPS Coordinates (Requires Explicit Opt-In)' },
                { key: 'shareSteps', label: 'Share My Step Count with Group' },
                { key: 'shareJourneyProgress', label: 'Share Route Progress %' },
                { key: 'shareBattery', label: 'Share Device Battery Status' }
              ].map((item) => (
                <div
                  key={item.key}
                  className="p-2 px-3 rounded-3 bg-dark border border-secondary border-opacity-25 d-flex align-items-center justify-content-between"
                >
                  <span className="small text-light">{item.label}</span>
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={Boolean(groupState.privacy?.[item.key])}
                      onChange={(e) => {
                        const nextPriv = { ...groupState.privacy, [item.key]: e.target.checked };
                        saveGroup({ ...groupState, privacy: nextPriv });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE 4 — JOURNEY JOURNAL & AUTOMATIC RECAP VIEW
// ============================================================================
export function JourneyJournalAndRecapView({
  currentPoleNumber = 520,
  onJumpToMapPole
}) {
  const [selectedJourneyYear, setSelectedJourneyYear] = useState('2026 Arbaeen Journey');
  const [journalViewTab, setJournalViewTab] = useState('timeline'); // 'timeline' | 'recap' | 'card'
  const [entries, setEntries] = useState(() => {
    try {
      const raw = localStorage.getItem(JOURNAL_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return [];
  });

  // Form states for adding a private journal entry
  const [entryType, setEntryType] = useState('TEXT_NOTE');
  const [entryDay, setEntryDay] = useState(1);
  const [entryPole, setEntryPole] = useState(currentPoleNumber || 180);
  const [entryChapter, setEntryChapter] = useState('NAJAF_DEPARTURE');
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [entryPhotoDataUrl, setEntryPhotoDataUrl] = useState(null);

  const saveEntries = useCallback((nextList) => {
    setEntries(nextList);
    try {
      localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(nextList));
    } catch (_) {}
  }, []);

  // Automatically sync real milestones from ZaireenWalkTracker sessions (Never invent fake milestones!)
  const syncRealWalkMilestonesToJournal = useCallback(() => {
    const walkState = loadSavedWalkState();
    const allSessions = [
      ...(walkState.activeSession ? [walkState.activeSession] : []),
      ...(walkState.sessionsHistory || [])
    ];
    if (allSessions.length === 0) return;

    const existingIds = new Set(entries.map((e) => e.entryId));
    const newAutoEntries = [];

    allSessions.forEach((sess, sIdx) => {
      const dayNum = sIdx + 1;
      // 1. Journey Started
      const startId = `auto_start_${sess.sessionId}`;
      if (!existingIds.has(startId)) {
        newAutoEntries.push({
          entryId: startId,
          journeyYearLabel: selectedJourneyYear,
          dayNumber: dayNum,
          entryType: 'AUTO_MILESTONE',
          isAutomaticMilestone: true,
          title: `Journey Started (Pole ${sess.startingPole || 1})`,
          content: `Walk session commenced at Pole ${sess.startingPole || 1}.`,
          poleNumber: sess.startingPole || 1,
          storyChapter: 'NAJAF_DEPARTURE',
          isPrivate: true,
          timeLabel: sess.timelineEvents?.[0]?.timeLabel || '06:20',
          recordedAt: sess.startedAt || new Date().toISOString()
        });
      }

      // 2. Real timeline events from the session (Pole reached, Rest, Finished)
      (sess.timelineEvents || []).forEach((ev, evIdx) => {
        const evId = `auto_ev_${sess.sessionId}_${evIdx}`;
        if (!existingIds.has(evId) && ev.eventType !== 'WALK_STARTED') {
          newAutoEntries.push({
            entryId: evId,
            journeyYearLabel: selectedJourneyYear,
            dayNumber: dayNum,
            entryType: 'AUTO_MILESTONE',
            isAutomaticMilestone: true,
            title: ev.label,
            content: `Recorded during live walk at Pole #${ev.poleNumber} (${(ev.stepsAtEvent || 0).toLocaleString()} steps).`,
            poleNumber: ev.poleNumber,
            storyChapter: ev.poleNumber >= 1200 ? 'FINAL_POLES' : 'GENERAL',
            isPrivate: true,
            timeLabel: ev.timeLabel || '08:45',
            recordedAt: ev.timestamp || new Date().toISOString()
          });
        }
      });

      // 3. Check if 10 km or Pole 100 / 500 / 1452 reached in real session
      if ((sess.distanceWalkedMeters || 0) >= 10000) {
        const km10Id = `auto_10km_${sess.sessionId}`;
        if (!existingIds.has(km10Id)) {
          newAutoEntries.push({
            entryId: km10Id,
            journeyYearLabel: selectedJourneyYear,
            dayNumber: dayNum,
            entryType: 'AUTO_MILESTONE',
            isAutomaticMilestone: true,
            title: '10 km Completed',
            content: `Completed ${(sess.distanceWalkedMeters / 1000).toFixed(1)} km of walking along Tareeq Ya Hussain.`,
            poleNumber: sess.currentPole,
            storyChapter: 'GENERAL',
            isPrivate: true,
            timeLabel: 'Milestone',
            recordedAt: new Date().toISOString()
          });
        }
      }
    });

    if (newAutoEntries.length > 0) {
      saveEntries([...newAutoEntries, ...entries]);
    }
  }, [entries, selectedJourneyYear, saveEntries]);

  useEffect(() => {
    syncRealWalkMilestonesToJournal();
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEntryPhotoDataUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddManualEntry = async (e) => {
    e.preventDefault();
    if (!entryTitle.trim() && !entryContent.trim()) return;
    const nowClock = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const newEntry = {
      entryId: 'jrn_' + Date.now(),
      journeyYearLabel: selectedJourneyYear,
      dayNumber: Number(entryDay) || 1,
      entryType,
      isAutomaticMilestone: false,
      title: entryTitle.trim() || `${entryType.replace('_', ' ')} at Pole ${entryPole}`,
      content: entryContent.trim(),
      poleNumber: Number(entryPole) || currentPoleNumber || 1,
      mediaDataUrl: entryPhotoDataUrl,
      storyChapter: entryChapter,
      isPrivate: true,
      timeLabel: nowClock,
      recordedAt: new Date().toISOString()
    };

    const updated = [newEntry, ...entries];
    saveEntries(updated);
    setEntryTitle('');
    setEntryContent('');
    setEntryPhotoDataUrl(null);

    try {
      await fetch(`/api/journey/${encodeURIComponent(selectedJourneyYear)}/journal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      });
    } catch (_) {}
  };

  // Filter entries for the selected Journey Year
  const yearEntries = useMemo(() => {
    return entries.filter((e) => (e.journeyYearLabel || '2026 Arbaeen Journey') === selectedJourneyYear);
  }, [entries, selectedJourneyYear]);

  // Compute Real Journey Recap Metrics from ZaireenWalkTracker + Journal Entries
  const recapSummary = useMemo(() => {
    const walkState = loadSavedWalkState();
    const allSessions = [
      ...(walkState.activeSession ? [walkState.activeSession] : []),
      ...(walkState.sessionsHistory || [])
    ];
    const totalSteps = allSessions.reduce((s, x) => s + (Number(x.totalSteps) || 0), 0);
    const totalDistKm = Number(
      (allSessions.reduce((s, x) => s + (Number(x.distanceWalkedMeters) || 0), 0) / 1000).toFixed(2)
    );
    const totalWalkSec = allSessions.reduce((s, x) => s + (Number(x.activeWalkingSeconds) || 0), 0);
    const totalPoles = allSessions.reduce((s, x) => s + (Number(x.polesCompleted) || 0), 0);
    const restStopsCount = allSessions.reduce(
      (s, x) => s + (x.timelineEvents || []).filter((e) => e.eventType === 'REST_STARTED').length,
      0
    );
    const uniqueDays = Math.max(
      1,
      new Set(allSessions.map((s) => s.dateKey || (s.startedAt || '').slice(0, 10))).size
    );

    // Group sessions by day
    const dayMap = new Map();
    allSessions.forEach((s, idx) => {
      const dKey = s.dateKey || `Day ${idx + 1}`;
      if (!dayMap.has(dKey)) {
        dayMap.set(dKey, { dayIndex: dayMap.size + 1, dateKey: dKey, steps: 0, distMeters: 0, walkSec: 0, poles: 0 });
      }
      const d = dayMap.get(dKey);
      d.steps += Number(s.totalSteps) || 0;
      d.distMeters += Number(s.distanceWalkedMeters) || 0;
      d.walkSec += Number(s.activeWalkingSeconds) || 0;
      d.poles += Number(s.polesCompleted) || 0;
    });

    return {
      hasWalkData: allSessions.length > 0,
      daysCount: allSessions.length > 0 ? uniqueDays : 0,
      totalSteps,
      totalDistKm,
      totalWalkSec,
      totalPoles,
      restStopsCount,
      journalMomentsCount: yearEntries.length,
      daysBreakdown: Array.from(dayMap.values())
    };
  }, [yearEntries]);

  return (
    <div className="journey-journal-recap-view">
      {/* Top Header & Multi-Year Journey Selector */}
      <div className="p-3.5 rounded-4 mb-4 border" style={{ background: 'rgba(13, 19, 28, 0.96)', borderColor: 'rgba(198,166,107,0.35)' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge rounded-pill px-3 py-1 fw-bold" style={{ background: 'rgba(198,166,107,0.18)', color: '#dfc08a', border: '1px solid rgba(198,166,107,0.45)' }}>
                <i className="bi bi-journal-richtext me-1"></i> FEATURE 4 • PERSONAL JOURNEY JOURNAL & AUTOMATIC RECAP
              </span>
              <span className="badge bg-dark border border-info text-info">
                <i className="bi bi-lock-fill me-1"></i> Private by Default
              </span>
            </div>
            <h3 className="h4 font-display text-white mb-0">{selectedJourneyYear}</h3>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2">
            {/* Multi-Year Journey Memory Selector (Never overwrites previous journeys) */}
            <select
              className="form-select form-select-sm bg-dark text-warning border-warning fw-bold"
              style={{ width: '205px' }}
              value={selectedJourneyYear}
              onChange={(e) => setSelectedJourneyYear(e.target.value)}
            >
              <option value="2026 Arbaeen Journey">2026 Arbaeen Journey</option>
              <option value="2027 Arbaeen Journey">2027 Arbaeen Journey</option>
              <option value="2025 Arbaeen Journey">2025 Arbaeen Journey</option>
            </select>

            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className={`btn px-3 ${journalViewTab === 'timeline' ? 'btn-warning text-dark fw-bold' : 'btn-dark text-light border-secondary'}`}
                onClick={() => setJournalViewTab('timeline')}
              >
                Journal & Add Entry
              </button>
              <button
                type="button"
                className={`btn px-3 ${journalViewTab === 'recap' ? 'btn-warning text-dark fw-bold' : 'btn-dark text-light border-secondary'}`}
                onClick={() => setJournalViewTab('recap')}
              >
                Full Journey Recap
              </button>
              <button
                type="button"
                className={`btn px-3 ${journalViewTab === 'card' ? 'btn-warning text-dark fw-bold' : 'btn-dark text-light border-secondary'}`}
                onClick={() => setJournalViewTab('card')}
              >
                Shareable Recap Card
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: JOURNAL ENTRY CREATOR & DAY-BY-DAY TIMELINE */}
      {journalViewTab === 'timeline' && (
        <div className="row g-3">
          {/* Add Journal Moment Form */}
          <div className="col-12 col-lg-5">
            <div className="p-4 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.96)', borderColor: 'rgba(198,166,107,0.35)' }}>
              <h4 className="h6 font-display text-warning mb-3">
                <i className="bi bi-feather me-1.5"></i>
                RECORD A PRIVATE PILGRIMAGE MOMENT
              </h4>

              <form onSubmit={handleAddManualEntry}>
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label className="form-label small text-secondary mb-1">Entry Type</label>
                    <select
                      className="form-select form-select-sm bg-dark text-white border-secondary"
                      value={entryType}
                      onChange={(e) => setEntryType(e.target.value)}
                    >
                      <option value="TEXT_NOTE">Text Note</option>
                      <option value="ZIYARAT_MOMENT">Ziyarat Moment</option>
                      <option value="REFLECTION">Personal Reflection</option>
                      <option value="PHOTO">Photo Memory</option>
                      <option value="POLE">Pole Checkpoint</option>
                      <option value="LOCATION">Sacred Location</option>
                      <option value="BOOKMARKED_EVENT">Bookmarked Event</option>
                      <option value="VOICE_NOTE">Voice Note / Dua</option>
                    </select>
                  </div>
                  <div className="col-3">
                    <label className="form-label small text-secondary mb-1">Day #</label>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      className="form-control form-control-sm bg-dark text-white border-secondary"
                      value={entryDay}
                      onChange={(e) => setEntryDay(e.target.value)}
                    />
                  </div>
                  <div className="col-3">
                    <label className="form-label small text-secondary mb-1">Pole #</label>
                    <input
                      type="number"
                      min="1"
                      max="1452"
                      className="form-control form-control-sm bg-dark text-white border-secondary"
                      value={entryPole}
                      onChange={(e) => setEntryPole(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label className="form-label small text-secondary mb-1">Story Chapter</label>
                  <select
                    className="form-select form-select-sm bg-dark text-white border-secondary"
                    value={entryChapter}
                    onChange={(e) => setEntryChapter(e.target.value)}
                  >
                    <option value="NAJAF_DEPARTURE">Najaf Departure</option>
                    <option value="FIRST_MAWKIB">First Mawkib</option>
                    <option value="NIGHT_WALK">Night Walk</option>
                    <option value="FINAL_POLES">Final Poles</option>
                    <option value="KARBALA_ARRIVAL">Arrival in Karbala</option>
                  </select>
                </div>

                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm bg-dark text-white border-secondary"
                    placeholder="Moment Title (e.g., First sight of the Golden Dome / Tea at Pole 297)"
                    value={entryTitle}
                    onChange={(e) => setEntryTitle(e.target.value)}
                  />
                </div>

                <div className="mb-2">
                  <textarea
                    rows="3"
                    className="form-control form-control-sm bg-dark text-white border-secondary"
                    placeholder="Write your reflection, prayer, or memory (stored privately on your device)..."
                    value={entryContent}
                    onChange={(e) => setEntryContent(e.target.value)}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label small text-secondary mb-1">Optional Private Photo (Never uploaded publicly)</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control form-control-sm bg-dark text-white border-secondary"
                    onChange={handlePhotoUpload}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-warning text-dark fw-bold rounded-pill px-4 py-1.5">
                    Save Private Moment
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light btn-sm rounded-pill px-3"
                    onClick={syncRealWalkMilestonesToJournal}
                    title="Import real milestones from your tracked walk sessions"
                  >
                    Sync Walk Milestones
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Journal Timeline by Day */}
          <div className="col-12 col-lg-7">
            <div className="p-4 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.96)', borderColor: 'rgba(198,166,107,0.35)' }}>
              <h4 className="h6 font-display text-warning mb-3">
                <i className="bi bi-clock-history me-1.5"></i>
                JOURNAL TIMELINE ({yearEntries.length} Moments in {selectedJourneyYear})
              </h4>

              {yearEntries.length > 0 ? (
                <div className="d-flex flex-column gap-2.5" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                  {yearEntries.map((item) => (
                    <div
                      key={item.entryId}
                      className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25"
                    >
                      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-1">
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-warning text-dark fw-bold">DAY {item.dayNumber || 1}</span>
                          <span className="badge bg-black text-light font-monospace">{item.timeLabel}</span>
                          <strong className="text-white">{item.title}</strong>
                        </div>
                        <div className="d-flex align-items-center gap-1.5">
                          {item.poleNumber && (
                            <button
                              type="button"
                              className="badge bg-dark border border-warning text-warning"
                              onClick={() => onJumpToMapPole && onJumpToMapPole(item.poleNumber)}
                            >
                              Pole #{item.poleNumber}
                            </button>
                          )}
                          <span className="badge bg-secondary-subtle text-light" style={{ fontSize: '0.65rem' }}>
                            {item.isAutomaticMilestone ? 'Auto Walk Milestone' : item.entryType.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      {item.content && <p className="text-secondary small mb-1">{item.content}</p>}
                      {item.mediaDataUrl && (
                        <img
                          src={item.mediaDataUrl}
                          alt={item.title}
                          className="rounded-3 mt-2 border border-secondary"
                          style={{ maxHeight: '140px', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-secondary small bg-dark rounded-3">
                  Your private journal for <strong>{selectedJourneyYear}</strong> has no entries yet. Add a reflection, photo, or Ziyarat moment on the left, or start a walk session to automatically record real milestones.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPLETE PRIVATE JOURNEY RECAP */}
      {journalViewTab === 'recap' && (
        <div className="p-4 rounded-4 border" style={{ background: 'rgba(13, 19, 28, 0.96)', borderColor: 'rgba(198,166,107,0.4)' }}>
          <div className="text-center mb-4">
            <span className="badge rounded-pill px-3 py-1 bg-warning text-dark fw-bold mb-2">
              PRIVATE PILGRIMAGE MEMORY
            </span>
            <h3 className="h3 font-display text-white mb-1">MY ARBAEEN JOURNEY</h3>
            <div className="text-warning fw-bold fs-5">Najaf → Karbala ({selectedJourneyYear})</div>
          </div>

          <div className="row g-3 text-center mb-4">
            <div className="col-6 col-md-2">
              <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
                <div className="h4 fw-bold text-white mb-0">{recapSummary.daysCount}</div>
                <div className="small text-secondary">Days</div>
              </div>
            </div>
            <div className="col-6 col-md-2">
              <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
                <div className="h4 fw-bold text-warning mb-0">{recapSummary.totalSteps.toLocaleString()}</div>
                <div className="small text-secondary">Steps</div>
              </div>
            </div>
            <div className="col-6 col-md-2">
              <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
                <div className="h4 fw-bold text-white mb-0">{recapSummary.totalDistKm} km</div>
                <div className="small text-secondary">Distance</div>
              </div>
            </div>
            <div className="col-6 col-md-2">
              <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
                <div className="h4 fw-bold text-info mb-0">{formatDuration(recapSummary.totalWalkSec)}</div>
                <div className="small text-secondary">Walking</div>
              </div>
            </div>
            <div className="col-6 col-md-2">
              <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
                <div className="h4 fw-bold text-success mb-0">{recapSummary.totalPoles.toLocaleString()}</div>
                <div className="small text-secondary">Poles Completed</div>
              </div>
            </div>
            <div className="col-6 col-md-2">
              <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
                <div className="h4 fw-bold text-warning mb-0">{recapSummary.journalMomentsCount}</div>
                <div className="small text-secondary">Journal Moments</div>
              </div>
            </div>
          </div>

          {/* Recap by Day */}
          <h4 className="h6 font-display text-warning mb-2">RECAP BY DAY</h4>
          {recapSummary.daysBreakdown.length > 0 ? (
            <div className="row g-2 mb-4">
              {recapSummary.daysBreakdown.map((d) => (
                <div key={d.dateKey} className="col-12 col-md-4">
                  <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
                    <div className="fw-bold text-warning mb-1">DAY {d.dayIndex} ({d.dateKey})</div>
                    <div className="small text-light">Steps: <strong>{d.steps.toLocaleString()}</strong></div>
                    <div className="small text-light">Distance: <strong>{(d.distMeters / 1000).toFixed(2)} km</strong></div>
                    <div className="small text-light">Walking: <strong>{formatDuration(d.walkSec)}</strong></div>
                    <div className="small text-light">Poles: <strong>{d.poles}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="small text-secondary mb-4">
              Record walk sessions in the Zaireen Walk Tracker to populate day-by-day step and pole statistics.
            </div>
          )}

          {/* Cinematic Media Story Chapters */}
          <h4 className="h6 font-display text-warning mb-2">CINEMATIC JOURNEY CHAPTERS</h4>
          <div className="row g-2">
            {[
              { id: 'NAJAF_DEPARTURE', label: '1. Najaf Departure' },
              { id: 'FIRST_MAWKIB', label: '2. First Mawkib' },
              { id: 'NIGHT_WALK', label: '3. Night Walk' },
              { id: 'FINAL_POLES', label: '4. Final Poles' },
              { id: 'KARBALA_ARRIVAL', label: '5. Arrival in Karbala' }
            ].map((ch) => {
              const chMoments = yearEntries.filter((e) => e.storyChapter === ch.id);
              return (
                <div key={ch.id} className="col-12 col-md">
                  <div className="p-2.5 rounded-3 bg-dark border border-secondary border-opacity-25 h-100">
                    <div className="fw-bold text-white small">{ch.label}</div>
                    <div className="text-warning small">{chMoments.length} recorded moment(s)</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PRIVACY-SAFE SHAREABLE RECAP CARD (Exact GPS Excluded) */}
      {journalViewTab === 'card' && (
        <div className="d-flex flex-column align-items-center py-3">
          <div
            className="p-4 p-md-5 rounded-4 border shadow-lg text-center"
            style={{
              maxWidth: '480px',
              width: '100%',
              background: 'linear-gradient(145deg, #0d131c 0%, #070a0f 100%)',
              borderColor: '#c6a66b'
            }}
          >
            <div className="badge rounded-pill px-3 py-1 mb-2" style={{ background: 'rgba(198,166,107,0.2)', color: '#dfc08a', border: '1px solid #c6a66b' }}>
              TAREEQ YA HUSSAIN • PILGRIMAGE MEMORY
            </div>
            <h3 className="h3 font-display text-white mb-1">MY ARBAEEN JOURNEY</h3>
            <div className="h5 text-warning font-display mb-4">Najaf → Karbala</div>

            <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25 mb-3">
              <div className="display-6 fw-bold text-white">{recapSummary.totalSteps.toLocaleString()} Steps</div>
              <div className="h5 text-warning mt-1 mb-0">{recapSummary.totalDistKm} km • {recapSummary.daysCount} Days</div>
            </div>

            <div className="small text-secondary">
              <i className="bi bi-shield-check text-success me-1"></i>
              Privacy-Safe Recap Card — Exact GPS coordinates and personal timelines are never exposed.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// FEATURE 5 — 61 AH HISTORICAL MAP TIME SLIDER PANEL
// ============================================================================
export function Historical61AhTimeSliderPanel({
  mapInstanceRef,
  currentMode = '61ah',
  onModeChange,
  onSelectTimelineDay,
  onNavigate,
  onAskAi,
  onSelectPersonality
}) {
  const [stageIndex, setStageIndex] = useState(3); // Default: 2 Muharram 61 AH (Arrival in Karbala)
  const [showFullRoute, setShowFullRoute] = useState(false);
  const [showSourceLayer, setShowSourceLayer] = useState(true);
  const [thenNowMode, setThenNowMode] = useState('historical'); // 'historical' | 'modern' | 'overlay'
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeStageKey = HISTORICAL_61AH_TIME_SLIDER_STAGES[stageIndex]?.key || '2-muharram';
  const stageData = useMemo(() => getHistoricalMapStageState(activeStageKey), [activeStageKey]);
  const stage = stageData.stage;

  // Synchronize with KarbalaMap 2D Canvas engine whenever slider state changes
  useEffect(() => {
    const mapInst = mapInstanceRef?.current;
    if (!mapInst || typeof mapInst.setHistoricalTimelineStage !== 'function') return;

    mapInst.setHistoricalTimelineStage(
      stage,
      stageData.progressiveRoute,
      stageData.fullRoute,
      showFullRoute,
      showSourceLayer
    );
  }, [stage, stageData, showFullRoute, showSourceLayer, mapInstanceRef]);

  const handleSelectStageIndex = (idx) => {
    const clamped = Math.max(0, Math.min(HISTORICAL_61AH_TIME_SLIDER_STAGES.length - 1, idx));
    setStageIndex(clamped);
    const targetStage = HISTORICAL_61AH_TIME_SLIDER_STAGES[clamped];
    if (targetStage?.muharramDayNumber && onSelectTimelineDay) {
      onSelectTimelineDay(targetStage.muharramDayNumber);
    }
  };

  const handleThenNowSwitch = (modeKey) => {
    setThenNowMode(modeKey);
    const mapInst = mapInstanceRef?.current;
    if (modeKey === 'historical') {
      if (onModeChange) onModeChange('61ah');
      if (mapInst && typeof mapInst.toggleThenNowLens === 'function') {
        mapInst.toggleThenNowLens(false);
      }
    } else if (modeKey === 'modern') {
      if (onModeChange) onModeChange('present');
      if (mapInst && typeof mapInst.toggleThenNowLens === 'function') {
        mapInst.toggleThenNowLens(false);
      }
    } else if (modeKey === 'overlay') {
      if (onModeChange) onModeChange('61ah');
      if (mapInst && typeof mapInst.toggleThenNowLens === 'function') {
        mapInst.toggleThenNowLens(true);
      }
    }
  };

  const certaintyBadgeColor =
    stage.geographyConfidence === 'Historically Attested'
      ? '#528C6E'
      : stage.geographyConfidence === 'Approximate Location'
      ? '#D4883A'
      : '#38BDF8';

  return (
    <div
      className="p-3 p-md-4 rounded-4 border shadow-lg mb-3"
      style={{
        background: 'linear-gradient(145deg, rgba(13, 19, 28, 0.96), rgba(7, 10, 15, 0.98))',
        borderColor: 'rgba(198, 166, 107, 0.4)'
      }}
    >
      {/* Header & Collapse / Controls Bar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <div className="d-flex flex-wrap align-items-center gap-2">
            <span className="badge rounded-pill px-2.5 py-1 bg-warning text-dark fw-bold">
              61 AH HISTORICAL MAP TIME SLIDER
            </span>
            <span
              className="badge rounded-pill px-2.5 py-1"
              style={{
                background: `${certaintyBadgeColor}22`,
                color: certaintyBadgeColor,
                border: `1px solid ${certaintyBadgeColor}`
              }}
            >
              {stage.geographyConfidence}
            </span>
            <span className="small text-secondary">
              Stage {stageIndex + 1} of {HISTORICAL_61AH_TIME_SLIDER_STAGES.length} • {stage.hijriDate} ({stage.approxGregorian})
            </span>
          </div>
          <h3 className="h5 font-display text-white mt-1 mb-0">
            {stage.label} — <span className="text-warning">{stage.title}</span>{' '}
            <span className="font-arabic text-secondary ms-1">{stage.arabicTitle}</span>
          </h3>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-1.5">
          {/* Progressive vs Full Caravan Route toggle */}
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-2.5 ${showFullRoute ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
            onClick={() => setShowFullRoute((v) => !v)}
            title="Show caravan route up to selected date by default, or toggle full Madinah → Karbala → Damascus route"
          >
            <i className="bi bi-bezier2 me-1"></i>
            {showFullRoute ? 'Full Caravan Route On' : 'Show Full Route'}
          </button>

          {/* Historical Source Layer toggle */}
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-2.5 ${showSourceLayer ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
            onClick={() => setShowSourceLayer((v) => !v)}
          >
            <i className="bi bi-journal-bookmark me-1"></i>
            {showSourceLayer ? 'Sources Layer On' : 'Show Sources'}
          </button>

          {/* Then vs Now 3-way switch */}
          <div className="btn-group btn-group-sm" role="group" aria-label="Then vs Now Map Mode">
            <button
              type="button"
              className={`btn ${thenNowMode === 'historical' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
              onClick={() => handleThenNowSwitch('historical')}
            >
              61 AH Historical
            </button>
            <button
              type="button"
              className={`btn ${thenNowMode === 'modern' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
              onClick={() => handleThenNowSwitch('modern')}
            >
              Modern Today
            </button>
            <button
              type="button"
              className={`btn ${thenNowMode === 'overlay' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
              onClick={() => handleThenNowSwitch('overlay')}
            >
              Overlay Lens
            </button>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary text-light rounded-pill"
            onClick={() => setIsCollapsed((c) => !c)}
          >
            {isCollapsed ? 'Expand Details ▼' : 'Minimize ▲'}
          </button>
        </div>
      </div>

      {/* Interactive Chronological Range Slider + Prev/Next */}
      <div className="mb-3">
        <div className="d-flex align-items-center gap-2 mb-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-warning rounded-pill px-2.5"
            disabled={stageIndex <= 0}
            onClick={() => handleSelectStageIndex(stageIndex - 1)}
          >
            ← Prev
          </button>
          <input
            type="range"
            className="form-range flex-grow-1"
            min="0"
            max={HISTORICAL_61AH_TIME_SLIDER_STAGES.length - 1}
            step="1"
            value={stageIndex}
            onChange={(e) => handleSelectStageIndex(Number(e.target.value))}
          />
          <button
            type="button"
            className="btn btn-sm btn-outline-warning rounded-pill px-2.5"
            disabled={stageIndex >= HISTORICAL_61AH_TIME_SLIDER_STAGES.length - 1}
            onClick={() => handleSelectStageIndex(stageIndex + 1)}
          >
            Next Day →
          </button>
        </div>

        {/* Chronological Stage Pills: Madinah -> Makkah -> Iraq Route -> 2..10 Muharram -> Post-Ashura */}
        <div className="d-flex flex-wrap gap-1">
          {HISTORICAL_61AH_TIME_SLIDER_STAGES.map((st, idx) => {
            const isSelected = idx === stageIndex;
            const isPassed = idx < stageIndex;
            return (
              <button
                key={st.key}
                type="button"
                onClick={() => handleSelectStageIndex(idx)}
                className={`btn btn-sm rounded-pill px-2.5 py-1 ${
                  isSelected
                    ? 'btn-warning text-dark fw-bold shadow-sm'
                    : isPassed
                    ? 'btn-outline-warning text-warning'
                    : 'btn-outline-secondary text-secondary'
                }`}
                style={{ fontSize: '0.74rem' }}
              >
                {st.shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Stage Intelligence Panel */}
      {!isCollapsed && (
        <div className="row g-3 pt-2 border-top border-secondary border-opacity-25">
          {/* Left Column: Historical Event Summary & Map State */}
          <div className="col-12 col-lg-7">
            <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25 h-100">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-warning fw-bold text-uppercase">
                  {stage.locationName} • {stage.hijriDate}
                </span>
                <span className="small text-secondary">
                  Water Access: <strong className="text-info">{stage.mapState?.waterAccessStatus}</strong>
                </span>
              </div>
              <p className="text-light small mb-2" style={{ lineHeight: 1.6 }}>
                {stage.summary}
              </p>

              <div className="d-flex flex-wrap gap-2 small text-secondary mb-3">
                <span className="badge bg-black border border-secondary">
                  Camp Status: {stage.mapState?.campStatus}
                </span>
                <span className="badge bg-black border border-secondary">
                  Opposing Forces: {stage.mapState?.opposingForcesStatus}
                </span>
                {stageData.presentDayLandmark && (
                  <span className="badge bg-black border border-warning text-warning">
                    Modern Equivalent: {stageData.presentDayLandmark.name}
                  </span>
                )}
              </div>

              {/* Action Links into Existing Timeline, Personalities, Sources & Ask Karbala AI */}
              <div className="d-flex flex-wrap gap-2">
                {onNavigate && (
                  <button
                    type="button"
                    className="btn btn-sm btn-warning text-dark fw-bold rounded-pill"
                    onClick={() => {
                      if (stage.muharramDayNumber && onSelectTimelineDay) {
                        onSelectTimelineDay(stage.muharramDayNumber);
                      }
                      onNavigate('timeline');
                    }}
                  >
                    <i className="bi bi-clock-history me-1"></i>Read Full Story in Timeline
                  </button>
                )}
                {onNavigate && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light rounded-pill"
                    onClick={() => onNavigate('personalities')}
                  >
                    <i className="bi bi-people me-1"></i>View People
                  </button>
                )}
                {onNavigate && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-info rounded-pill"
                    onClick={() => onNavigate('sources')}
                  >
                    <i className="bi bi-journal-check me-1"></i>Verify Sources
                  </button>
                )}
                {onAskAi && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-warning rounded-pill"
                    onClick={() =>
                      onAskAi(`What happened at ${stage.locationName} on ${stage.label} (${stage.hijriDate}) according to verified primary sources?`)
                    }
                  >
                    <i className="bi bi-stars me-1"></i>Ask Karbala AI about {stage.shortLabel}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Associated Personalities & Primary Sources Layer */}
          <div className="col-12 col-lg-5">
            <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="small text-warning fw-bold mb-1">
                  KEY PERSONALITIES PRESENT ({stageData.personalities?.length || 0})
                </div>
                <div className="d-flex flex-wrap gap-1.5 mb-3">
                  {(stageData.personalities || []).map((person) => (
                    <button
                      key={person.id}
                      type="button"
                      className="btn btn-sm btn-outline-light rounded-pill py-0.5 px-2"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => {
                        if (onSelectPersonality) {
                          onSelectPersonality(person);
                        } else if (onNavigate) {
                          onNavigate('personalities');
                        }
                      }}
                    >
                      <i className="bi bi-person-badge text-warning me-1"></i>
                      {person.name}
                    </button>
                  ))}
                </div>
              </div>

              {showSourceLayer && (
                <div className="p-2.5 rounded-3 bg-black border border-secondary border-opacity-50">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small fw-bold text-info">
                      <i className="bi bi-book-half me-1"></i>PRIMARY HISTORICAL SOURCES
                    </span>
                    <span className="badge bg-dark border border-secondary text-secondary" style={{ fontSize: '0.68rem' }}>
                      {stage.geographyConfidence}
                    </span>
                  </div>
                  <ul className="mb-1 ps-3 small text-light">
                    {(stage.primarySources || []).map((src, i) => (
                      <li key={i}>{src}</li>
                    ))}
                  </ul>
                  <div className="text-secondary" style={{ fontSize: '0.72rem' }}>
                    {stage.confidenceNote}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
