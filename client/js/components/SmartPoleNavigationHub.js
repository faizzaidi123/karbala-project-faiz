const { useState, useEffect, useRef, useMemo } = window.React;

import {
  PILGRIMAGE_ANCHORS,
  POLE_NAV_VISUALS,
  KEY_LANDMARK_POLES,
  CALIBRATED_POLE_SPACING_METERS,
  CROWD_LEVELS,
  ROUTE_SEGMENTS,
  MULTILINGUAL_POLE_GUIDE,
  getPoleData,
  getRoutePolylineCoordinates
} from '/js/data/smartPoleNavigationData.js';
import {
  ZaireenWalkTracker,
  loadSavedWalkState
} from '/js/components/ZaireenWalkTracker.js';
import {
  LiveCrowdIntelligenceView,
  SmartMawkibFinderView,
  GroupJourneyModeView,
  JourneyJournalAndRecapView
} from '/js/components/PilgrimageCompanionModules.js';
import {
  CINEMATIC_CROWD_PALETTE,
  GRANULAR_CROWD_SEGMENTS,
  SHRINE_GATE_CROWD_DATA,
  SMART_MAWKIB_FACILITIES
} from '/js/data/advancedPilgrimageData.js';

/**
 * SMART ARBAEEN POLE NAVIGATION & CROWD INTELLIGENCE HUB
 * Najaf-to-Karbala Walking Route (Tareeq Ya Hussain - Route 9)
 * High-precision GIS mapping, crowd density telemetry, distance calculator,
 * and offline route resources.
 */
export function SmartPoleNavigationHub({ onNavigate, onAskAi, onOpenEmergency }) {
  // Primary Tabs: 'map' | 'calculator' | 'directory' | 'crowd' | 'finder' | 'offline'
  const [activeTab, setActiveTab] = useState('map');

  // Selected Language: 'EN' | 'AR' | 'UR' | 'HI' | 'RO'
  const [lang, setLang] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem('karbala_pilgrim_prefs') || '{}');
      const code = (p.language || 'en').toLowerCase();
      if (code === 'ur-roman') return 'RO';
      if (['ar', 'ur', 'hi'].includes(code)) return code.toUpperCase();
    } catch (_) {}
    return 'EN';
  });

  useEffect(() => {
    const onGlobalLang = (e) => {
      const code = (e?.detail?.language || 'en').toLowerCase();
      if (code === 'ur-roman') setLang('RO');
      else if (['ar', 'ur', 'hi'].includes(code)) setLang(code.toUpperCase());
      else setLang('EN');
    };
    window.addEventListener('karbala-language-change', onGlobalLang);
    return () => window.removeEventListener('karbala-language-change', onGlobalLang);
  }, []);

  // Day / Night Theme (Arbaeen walking often happens at night)
  const [nightMode, setNightMode] = useState(true);

  // Selected Pole in Map / Inspector
  const [selectedPoleNumber, setSelectedPoleNumber] = useState(726); // Default: Halfway Milestone
  const [searchPoleQuery, setSearchPoleQuery] = useState('');

  // Distance Calculator Inputs
  const [calcFromPole, setCalcFromPole] = useState(1);
  const [calcToPole, setCalcToPole] = useState(726);
  const [calcPace, setCalcPace] = useState('normal');

  // Crowd Intelligence Mode: 'live' | 'historical'
  const [crowdMode, setCrowdMode] = useState('live');

  // Map Layer Toggles (Crowd Heatmap, Verified Mawkibs, Group Members & Meeting Point, Shrine Gates)
  const [showCrowdHeatmap, setShowCrowdHeatmap] = useState(true);
  const [showMapMawkibs, setShowMapMawkibs] = useState(true);
  const [showMapGroup, setShowMapGroup] = useState(true);
  const [showMapGates, setShowMapGates] = useState(true);
  const [pendingMeetingFacility, setPendingMeetingFacility] = useState(null);

  // GPS Current Location State
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsResult, setGpsResult] = useState(null);
  const [gpsError, setGpsError] = useState(null);

  // Leaflet Map References
  const mapContainerRef = useRef(null);
  const leafletMapInstance = useRef(null);
  const routeLayersRef = useRef(null);
  const markerLayersRef = useRef(null);

  // Current dictionary based on language
  const t = MULTILINGUAL_POLE_GUIDE[lang] || MULTILINGUAL_POLE_GUIDE.EN;
  const isRtl = lang === 'AR' || lang === 'UR';

  // Current selected pole data
  const currentPole = useMemo(() => {
    return getPoleData(selectedPoleNumber);
  }, [selectedPoleNumber]);

  // Distance calculation results
  const calculationResult = useMemo(() => {
    const from = Math.max(1, Math.min(1452, Number(calcFromPole) || 1));
    const to = Math.max(1, Math.min(1452, Number(calcToPole) || 1));
    const start = Math.min(from, to);
    const end = Math.max(from, to);
    const intervals = end - start;
    const distanceKm = Number(((intervals * CALIBRATED_POLE_SPACING_METERS) / 1000).toFixed(2));

    const speeds = { relaxed: 3.0, normal: 4.0, brisk: 4.8, night: 3.8 };
    const speed = speeds[calcPace] || 4.0;
    const totalMinutes = Math.round((distanceKm / speed) * 60);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    const milestones = KEY_LANDMARK_POLES.filter(p => p.poleNumber >= start && p.poleNumber <= end);

    return {
      start,
      end,
      intervals,
      distanceKm,
      hours,
      mins,
      milestones
    };
  }, [calcFromPole, calcToPole, calcPace]);

  // Open Walk Tracker tab automatically if requested via global flag/event
  useEffect(() => {
    if (window.__karbalaOpenWalkTab) {
      setActiveTab('walk');
      if (typeof window.__karbalaOpenWalkPole === 'number') {
        setSelectedPoleNumber(window.__karbalaOpenWalkPole);
      }
      window.__karbalaOpenWalkTab = false;
    }
    const handleOpenWalk = (e) => {
      setActiveTab('walk');
      if (e?.detail?.poleNumber) {
        setSelectedPoleNumber(e.detail.poleNumber);
      }
    };
    window.addEventListener('karbala-open-walk-tracker', handleOpenWalk);
    return () => window.removeEventListener('karbala-open-walk-tracker', handleOpenWalk);
  }, []);

  // Leaflet Map Initialization & Rendering
  useEffect(() => {
    if (activeTab !== 'map') return;
    if (!mapContainerRef.current) return;
    if (!window.L) return;

    if (!leafletMapInstance.current) {
      const map = window.L.map(mapContainerRef.current, {
        center: [32.32, 44.22],
        zoom: 10,
        minZoom: 8,
        maxZoom: 16,
        zoomControl: true
      });

      // Dark / Night Luxury Tile Layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors • Tareeq Ya Hussain GIS',
        className: nightMode ? 'map-night-tiles' : 'map-day-tiles'
      }).addTo(map);

      routeLayersRef.current = window.L.layerGroup().addTo(map);
      markerLayersRef.current = window.L.layerGroup().addTo(map);
      leafletMapInstance.current = map;
    }

    renderMapLayers();
  }, [activeTab, nightMode, crowdMode, selectedPoleNumber, showCrowdHeatmap, showMapMawkibs, showMapGroup, showMapGates]);

  // Render Map Segments & Markers
  const renderMapLayers = () => {
    const map = leafletMapInstance.current;
    if (!map || !routeLayersRef.current || !markerLayersRef.current) return;

    routeLayersRef.current.clearLayers();
    markerLayersRef.current.clearLayers();

    // 1. Draw Crowd-Colored Route Segments
    ROUTE_SEGMENTS.forEach(seg => {
      const levelKey = crowdMode === 'historical' ? seg.historicalPeakLevel : seg.liveCrowdLevel;
      const level = CROWD_LEVELS[levelKey] || CROWD_LEVELS.UNKNOWN;

      // Extract segment pole coordinates
      const segCoords = [];
      KEY_LANDMARK_POLES.forEach(p => {
        if (p.poleNumber >= seg.fromPole && p.poleNumber <= seg.toPole) {
          segCoords.push(p.coordinates);
        }
      });

      if (segCoords.length >= 2) {
        const polyline = window.L.polyline(segCoords, {
          color: level.hex,
          weight: 6,
          opacity: 0.85,
          lineJoin: 'round'
        }).addTo(routeLayersRef.current);

        polyline.bindPopup(`
          <div style="font-family: inherit; color: #1a202c; padding: 4px;">
            <strong style="color: #2b6cb0;">${seg.name}</strong><br/>
            <span style="font-size: 0.8rem; color: #4a5568;">Poles ${seg.fromPole} – ${seg.toPole} (${seg.lengthKm} km)</span><br/>
            <div style="margin-top: 6px; padding: 4px 8px; border-radius: 4px; background: ${level.hex}; color: #fff; font-weight: bold; font-size: 0.75rem;">
              Crowd Status: ${level.label}
            </div>
            <div style="font-size: 0.7rem; color: #718096; margin-top: 4px;">
              Sensor: ${seg.sensorSource}<br/>
              Updated: ${seg.lastUpdated}
            </div>
          </div>
        `);
      }
    });

    // 2. Origin Pin: Imam Ali Shrine, Najaf
    const originIcon = window.L.divIcon({
      className: 'shrine-origin-marker',
      html: `
        <div style="background: linear-gradient(135deg, #dfc08a, #c6a66b); border: 2px solid #fff; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px rgba(198, 166, 107, 0.8); cursor: pointer;">
          <span style="font-size: 14px; font-weight: bold; color: #0a0d12;">ك</span>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    window.L.marker(PILGRIMAGE_ANCHORS.origin.coordinates, { icon: originIcon })
      .addTo(markerLayersRef.current)
      .bindPopup(`<strong>${PILGRIMAGE_ANCHORS.origin.name}</strong><br/>${PILGRIMAGE_ANCHORS.origin.description}`);

    // 3. Destination Pin: Imam Hussain Shrine, Karbala
    const destIcon = window.L.divIcon({
      className: 'shrine-dest-marker',
      html: `
        <div style="background: linear-gradient(135deg, #e53e3e, #9b2c2c); border: 2px solid #dfc08a; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(229, 62, 62, 0.85); cursor: pointer;">
          <span style="font-size: 16px; color: #fff;">★</span>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    window.L.marker(PILGRIMAGE_ANCHORS.destination.coordinates, { icon: destIcon })
      .addTo(markerLayersRef.current)
      .bindPopup(`<strong>${PILGRIMAGE_ANCHORS.destination.name}</strong><br/>${PILGRIMAGE_ANCHORS.destination.description}`);

    // 4. Milestone Markers for Key Landmark Poles
    KEY_LANDMARK_POLES.forEach(landmark => {
      const isSelected = landmark.poleNumber === selectedPoleNumber;
      const markerHtml = `
        <div style="background: ${isSelected ? '#e2c974' : '#1a202c'}; color: ${isSelected ? '#0a0d12' : '#dfc08a'}; border: 2px solid ${isSelected ? '#fff' : '#c6a66b'}; border-radius: 8px; padding: 2px 6px; font-weight: bold; font-size: 11px; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.5); text-align: center; cursor: pointer;">
          #${landmark.poleNumber}
        </div>
      `;

      const poleIcon = window.L.divIcon({
        className: 'landmark-pole-marker',
        html: markerHtml,
        iconSize: [44, 22],
        iconAnchor: [22, 11]
      });

      const marker = window.L.marker(landmark.coordinates, { icon: poleIcon })
        .addTo(markerLayersRef.current);

      marker.on('click', () => {
        setSelectedPoleNumber(landmark.poleNumber);
      });
    });

    // 5. "YOU ARE HERE" Zaireen Walk Tracker Position Marker (Current Pole, Next Pole, Distance to Karbala, Nearby Facilities)
    const savedWalk = loadSavedWalkState();
    const walkerPoleNum = savedWalk?.activeSession?.currentPole || selectedPoleNumber || 726;
    const walkerPoleData = getPoleData(walkerPoleNum);
    const nextPoleNum = Math.min(1452, walkerPoleNum + 1);
    const distToKarbalaKm = Number((((1452 - walkerPoleNum) * CALIBRATED_POLE_SPACING_METERS) / 1000).toFixed(2));
    const walkProgressPct = Number((((walkerPoleNum - 1) / 1451) * 100).toFixed(1));

    const youAreHereIcon = window.L.divIcon({
      className: 'you-are-here-pole-marker',
      html: `
        <div style="background: linear-gradient(135deg, #10b981, #059669); color: #fff; border: 2px solid #dfc08a; border-radius: 999px; padding: 3px 10px; font-weight: 800; font-size: 11px; white-space: nowrap; box-shadow: 0 0 18px rgba(16, 185, 129, 0.85); text-align: center; cursor: pointer;">
          ● YOU ARE HERE • POLE #${walkerPoleNum}
        </div>
      `,
      iconSize: [168, 26],
      iconAnchor: [84, 28]
    });

    window.L.marker(walkerPoleData.coordinates, { icon: youAreHereIcon, zIndexOffset: 900 })
      .addTo(markerLayersRef.current)
      .bindPopup(`
        <div style="font-family: inherit; color: #0f172a; min-width: 220px; padding: 4px;">
          <div style="font-weight: 800; color: #047857; font-size: 0.82rem; letter-spacing: 0.04em;">● YOU ARE HERE (WALK TRACKER)</div>
          <div style="font-size: 0.95rem; font-weight: 700; margin-top: 2px;">Current Pole: #${walkerPoleNum} • Next Pole: #${nextPoleNum}</div>
          <div style="font-size: 0.8rem; color: #334155; margin-top: 3px;">
            <strong>Distance to Karbala:</strong> ${distToKarbalaKm} km<br/>
            <strong>Walking Progress:</strong> ${walkProgressPct}%
          </div>
          <hr style="margin: 6px 0; border-color: #cbd5e1;" />
          <div style="font-size: 0.75rem; color: #1e293b;">
            <strong>Nearby Pilgrim Facilities:</strong><br/>
            • <strong>Mawkib / Food / Water:</strong> ${walkerPoleData.nearestMawkib}<br/>
            • <strong>Medical Tent:</strong> ${walkerPoleData.nearestMedical}<br/>
            • <strong>Rest, Washroom & Prayer:</strong> Available at Sector ${walkerPoleData.sector}
          </div>
        </div>
      `);

    // 6. Granular Crowd Heatmap Layer (Feature 1 — Muted Cinematic Karbala Palette)
    if (showCrowdHeatmap) {
      GRANULAR_CROWD_SEGMENTS.forEach((cseg) => {
        const pStart = getPoleData(cseg.fromPole);
        const pMid = getPoleData(Math.round((cseg.fromPole + cseg.toPole) / 2));
        const pEnd = getPoleData(cseg.toPole);
        const pal = CINEMATIC_CROWD_PALETTE[cseg.crowdLevel] || CINEMATIC_CROWD_PALETTE.MODERATE;

        const heatLine = window.L.polyline(
          [pStart.coordinates, pMid.coordinates, pEnd.coordinates],
          {
            color: pal.hex,
            weight: 10,
            opacity: 0.72,
            lineCap: 'round'
          }
        ).addTo(routeLayersRef.current);

        heatLine.bindPopup(`
          <div style="font-family: inherit; color: #0f172a; min-width: 230px; padding: 4px;">
            <strong style="color: #1e293b;">${cseg.name}</strong><br/>
            <div style="margin: 5px 0; padding: 3px 8px; border-radius: 6px; background: ${pal.hex}; color: #fff; font-weight: bold; font-size: 0.76rem; display: inline-block;">
              Crowd Level: ${pal.label} (${cseg.sourceType})
            </div>
            <div style="font-size: 0.78rem; color: #334155;">
              <strong>Average Walking Speed:</strong> ${cseg.averageWalkingSpeedKmh} km/h<br/>
              <strong>Freshness:</strong> ${cseg.lastUpdateLabel}<br/>
              <strong>Source:</strong> ${cseg.sensorSource}
            </div>
            ${
              cseg.lessCongestedAlternative
                ? `<div style="margin-top: 6px; padding: 5px; border-radius: 5px; background: #ecfdf5; border: 1px solid #10b981; color: #065f46; font-size: 0.74rem;"><strong>Smart Route Suggestion:</strong> ${cseg.lessCongestedAlternative}</div>`
                : ''
            }
          </div>
        `);
      });
    }

    // 7. Smart Mawkib & Pilgrim Facility Markers (Feature 2)
    if (showMapMawkibs) {
      SMART_MAWKIB_FACILITIES.forEach((fac) => {
        const hasMedical = fac.services.includes('medical');
        const mwkIcon = window.L.divIcon({
          className: 'smart-mawkib-marker',
          html: `
            <div style="background: ${hasMedical ? '#0284c7' : '#c6a66b'}; color: ${hasMedical ? '#fff' : '#0a0d12'}; border: 1.5px solid #fff; border-radius: 6px; padding: 1px 5px; font-weight: 700; font-size: 10px; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.45);">
              ${hasMedical ? '✚' : '⛺'} P#${fac.poleNumber}
            </div>
          `,
          iconSize: [52, 20],
          iconAnchor: [26, 22]
        });

        window.L.marker([fac.coordinates.lat, fac.coordinates.lng], { icon: mwkIcon })
          .addTo(markerLayersRef.current)
          .bindPopup(`
            <div style="font-family: inherit; color: #0f172a; min-width: 220px; padding: 4px;">
              <div style="font-size: 0.7rem; font-weight: 700; color: #047857;">✓ ${fac.verificationStatus} • Verified ${fac.lastVerified}</div>
              <strong style="font-size: 0.9rem;">Pole ${fac.poleNumber}: ${fac.name}</strong>
              <div style="font-size: 0.75rem; color: #334155; margin-top: 4px;">
                <strong>Services:</strong> ${fac.services.join(', ')}<br/>
                <strong>Notes:</strong> ${fac.genderFamilyNotes}<br/>
                <strong>Source:</strong> ${fac.source}
              </div>
            </div>
          `);
      });
    }

    // 8. Group Members (Approximate Pole Only by Default) & Meeting Point Marker (Feature 3)
    if (showMapGroup) {
      try {
        const rawGrp = localStorage.getItem('karbala_pilgrim_group_v1');
        const grp = rawGrp ? JSON.parse(rawGrp) : null;
        if (grp && Array.isArray(grp.members)) {
          grp.members.forEach((m) => {
            if (!m.approximatePole) return;
            const pData = getPoleData(m.approximatePole);
            const grpIcon = window.L.divIcon({
              className: 'group-member-pole-marker',
              html: `
                <div style="background: #1e293b; color: #38bdf8; border: 1.5px solid #38bdf8; border-radius: 999px; padding: 2px 8px; font-weight: 700; font-size: 10px; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.6);">
                  👥 ${m.displayName}: Near Pole ${m.approximatePole}
                </div>
              `,
              iconSize: [140, 22],
              iconAnchor: [70, -6]
            });
            window.L.marker(pData.coordinates, { icon: grpIcon })
              .addTo(markerLayersRef.current)
              .bindPopup(`
                <div style="font-family: inherit; color: #0f172a; padding: 4px;">
                  <strong>${m.displayName}</strong><br/>
                  Status: <strong>${m.walkingStatus}</strong><br/>
                  Position: <strong>Near Pole ${m.approximatePole}</strong> (Approximate Only)<br/>
                  <small>Checked in ${m.minutesAgo || 1} min ago</small>
                </div>
              `);
          });

          if (grp.meetingPoint?.poleNumber) {
            const mpData = getPoleData(grp.meetingPoint.poleNumber);
            const mpIcon = window.L.divIcon({
              className: 'group-meeting-point-marker',
              html: `
                <div style="background: #f59e0b; color: #0a0d12; border: 2px solid #fff; border-radius: 999px; padding: 2px 9px; font-weight: 800; font-size: 10.5px; white-space: nowrap; box-shadow: 0 0 14px rgba(245, 158, 11, 0.85);">
                  ⚑ MEETING POINT • POLE #${grp.meetingPoint.poleNumber}
                </div>
              `,
              iconSize: [165, 24],
              iconAnchor: [82, 26]
            });
            window.L.marker(mpData.coordinates, { icon: mpIcon, zIndexOffset: 850 })
              .addTo(markerLayersRef.current)
              .bindPopup(`
                <div style="font-family: inherit; color: #0f172a; padding: 4px;">
                  <strong style="color: #b45309;">⚑ GROUP MEETING POINT</strong><br/>
                  <strong>${grp.meetingPoint.title}</strong><br/>
                  <small>${grp.meetingPoint.notes || ''}</small>
                </div>
              `);
          }
        }
      } catch (_) {}
    }

    // 9. Shrine Gate Crowd Pins (Feature 1)
    if (showMapGates) {
      SHRINE_GATE_CROWD_DATA.forEach((gate) => {
        const pal = CINEMATIC_CROWD_PALETTE[gate.crowdLevel] || CINEMATIC_CROWD_PALETTE.MODERATE;
        const gateIcon = window.L.divIcon({
          className: 'shrine-gate-crowd-marker',
          html: `
            <div style="background: ${pal.hex}; color: #fff; border: 1.5px solid #fff; border-radius: 6px; padding: 1px 6px; font-weight: 700; font-size: 10px; white-space: nowrap;">
              ${gate.gateCode}: ${pal.label}
            </div>
          `,
          iconSize: [96, 20],
          iconAnchor: [48, 10]
        });
        window.L.marker(gate.coords, { icon: gateIcon })
          .addTo(markerLayersRef.current)
          .bindPopup(`
            <div style="font-family: inherit; color: #0f172a; padding: 4px;">
              <strong>${gate.gateCode} — ${gate.name}</strong><br/>
              Crowd: <strong>${pal.label}</strong> (${gate.sourceType} • ${gate.lastUpdateLabel})<br/>
              <small>${gate.recommendation}</small>
            </div>
          `);
      });
    }
  };

  // Jump to specific pole in map
  const handleJumpToPole = (num) => {
    const poleNum = Math.max(1, Math.min(1452, Math.round(Number(num) || 1)));
    setSelectedPoleNumber(poleNum);
    const data = getPoleData(poleNum);

    if (leafletMapInstance.current) {
      leafletMapInstance.current.flyTo(data.coordinates, 13, { duration: 1.2 });
    }
  };

  // Search input handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const cleanNum = parseInt(searchPoleQuery.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(cleanNum)) {
      handleJumpToPole(cleanNum);
    }
  };

  // GPS Geolocation Detection
  const handleDetectGpsPole = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    setGpsError(null);
    setGpsResult(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLoading(false);
        const { latitude, longitude, accuracy } = position.coords;

        // Find closest surveyed or interpolated pole
        let closestPole = KEY_LANDMARK_POLES[0];
        let minDistanceMeters = Infinity;

        // Check across all landmarks and sampled intermediate poles
        for (let num = 1; num <= 1452; num += 10) {
          const p = getPoleData(num);
          const dLat = (p.coordinates[0] - latitude) * 111320;
          const dLng = (p.coordinates[1] - longitude) * 111320 * Math.cos((latitude * Math.PI) / 180);
          const dist = Math.sqrt(dLat * dLat + dLng * dLng);

          if (dist < minDistanceMeters) {
            minDistanceMeters = dist;
            closestPole = p;
          }
        }

        const isNearby = minDistanceMeters <= 2500; // within 2.5 km of highway corridor

        setGpsResult({
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          closestPoleNumber: closestPole.poleNumber,
          closestPoleTitle: closestPole.title,
          distanceToPoleMeters: Math.round(minDistanceMeters),
          isNearby
        });

        if (isNearby) {
          setSelectedPoleNumber(closestPole.poleNumber);
          if (leafletMapInstance.current) {
            leafletMapInstance.current.flyTo(closestPole.coordinates, 14, { duration: 1.5 });
          }
        }
      },
      (err) => {
        setGpsLoading(false);
        setGpsError(`Unable to retrieve location: ${err.message}. Please check browser permissions.`);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 10000 }
    );
  };

  return (
    <div
      className={`smart-pole-nav-hub py-4 px-2 px-md-4 text-light ${isRtl ? 'rtl-direction' : ''}`}
      style={{
        minHeight: '90vh',
        background: nightMode ? 'radial-gradient(circle at top, #0f1622 0%, #080c10 100%)' : 'radial-gradient(circle at top, #1a2332 0%, #0d131c 100%)',
        direction: isRtl ? 'rtl' : 'ltr'
      }}
    >
      <div className="container-fluid" style={{ maxWidth: '1440px' }}>

        {/* ================= HEADER SECTION ================= */}
        <header
          className="mb-4 p-4 rounded-4 position-relative overflow-hidden shadow-lg border"
          style={{
            background: nightMode ? 'linear-gradient(135deg, rgba(16, 24, 34, 0.95) 0%, rgba(8, 12, 18, 0.98) 100%)' : 'linear-gradient(135deg, rgba(24, 34, 48, 0.95) 0%, rgba(12, 18, 26, 0.98) 100%)',
            borderColor: 'rgba(198, 166, 107, 0.35)'
          }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="badge px-3 py-1.5 rounded-pill font-title fw-bold" style={{ background: 'rgba(198, 166, 107, 0.15)', color: '#dfc08a', border: '1px solid rgba(198, 166, 107, 0.4)' }}>
                  <i className="bi bi-geo-alt-fill me-1"></i> TAREEQ YA HUSSAIN • 1,452 POLES
                </span>
                <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1 rounded-pill small">
                  Verified GIS Spline
                </span>
                <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2.5 py-1 rounded-pill small">
                  Live Crowd Telemetry
                </span>
              </div>
              <h1 className="h2 font-display mb-1 text-white" style={{ letterSpacing: '0.04em' }}>
                {t.title}
              </h1>
              <p className="text-secondary mb-0 small" style={{ maxWidth: '850px', fontSize: '0.86rem' }}>
                {t.subtitle} — {t.disclaimer}
              </p>
            </div>

            {/* Language & Day/Night Mode Switchers */}
            <div className="d-flex flex-wrap align-items-center gap-2">
              {/* Day / Night Toggle */}
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5 ${nightMode ? 'btn-dark border-gold text-gold-antique' : 'btn-warning text-dark'}`}
                onClick={() => setNightMode(!nightMode)}
                title="Toggle Day / Night Walking Mode"
              >
                <i className={`bi ${nightMode ? 'bi-moon-stars-fill' : 'bi-sun-fill'}`}></i>
                <span>{nightMode ? t.nightMode : t.dayMode}</span>
              </button>

              {/* Language Switcher Buttons (Synced with Global Full-Website Translator) */}
              <div className="btn-group btn-group-sm rounded-pill p-1 border border-secondary notranslate" style={{ background: 'rgba(0,0,0,0.4)' }}>
                {['EN', 'UR', 'HI', 'RO', 'AR'].map(l => (
                  <button
                    key={l}
                    type="button"
                    className={`btn btn-sm rounded-pill px-2.5 py-1 fw-bold ${lang === l ? 'btn-warning text-dark shadow-sm' : 'btn-dark text-secondary'}`}
                    onClick={() => {
                      setLang(l);
                      if (window.applyKarbalaLanguage) {
                        window.applyKarbalaLanguage(l === 'RO' ? 'ur-roman' : l.toLowerCase());
                      }
                    }}
                  >
                    {l === 'AR' ? 'عربي' : l === 'UR' ? 'اردو' : l === 'HI' ? 'हिन्दी' : l === 'RO' ? 'Roman' : 'EN'}
                  </button>
                ))}
              </div>

              {onAskAi && (
                <button
                  type="button"
                  className="btn btn-sm rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
                  style={{
                    background: 'rgba(198, 166, 107, 0.16)',
                    border: '1px solid rgba(198, 166, 107, 0.45)',
                    color: '#dfc08a'
                  }}
                  onClick={() => onAskAi(`Is the route ahead crowded near Pole ${currentPole || 520}?`)}
                >
                  <i className="bi bi-stars"></i>
                  <span>Ask AI (Pole {currentPole || 520})</span>
                </button>
              )}

              {/* Emergency Hotline Direct Action */}
              <button
                type="button"
                className="btn btn-sm btn-outline-danger rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
                onClick={() => onOpenEmergency ? onOpenEmergency() : setActiveTab('offline')}
              >
                <i className="bi bi-telephone-fill"></i>
                <span>122 • 104</span>
              </button>
            </div>
          </div>

          {/* ================= PRIMARY NAVIGATION TABS ================= */}
          <div className="mt-4 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <nav className="nav nav-pills flex-nowrap overflow-x-auto gap-2 pb-1" role="tablist" style={{ scrollbarWidth: 'none' }}>
              <button
                type="button"
                className={`nav-link px-3 py-2 rounded-pill fw-semibold small text-nowrap d-inline-flex align-items-center gap-2 ${activeTab === 'map' ? 'active' : ''}`}
                style={{
                  background: activeTab === 'map' ? 'var(--lux-gold, #c6a66b)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeTab === 'map' ? '#0a0d12' : '#e2e8f0',
                  border: '1px solid ' + (activeTab === 'map' ? '#c6a66b' : 'rgba(255,255,255,0.1)')
                }}
                onClick={() => setActiveTab('map')}
              >
                <i className="bi bi-map-fill"></i>
                <span>Interactive Pole Map</span>
              </button>

              <button
                type="button"
                className={`nav-link px-3 py-2 rounded-pill fw-semibold small text-nowrap d-inline-flex align-items-center gap-2 ${activeTab === 'walk' ? 'active' : ''}`}
                style={{
                  background: activeTab === 'walk' ? 'var(--lux-gold, #c6a66b)' : 'rgba(198, 166, 107, 0.14)',
                  color: activeTab === 'walk' ? '#0a0d12' : '#dfc08a',
                  border: '1px solid ' + (activeTab === 'walk' ? '#c6a66b' : 'rgba(198, 166, 107, 0.45)')
                }}
                onClick={() => setActiveTab('walk')}
              >
                <i className="bi bi-person-walking"></i>
                <span>Zaireen Walk Tracker & Step Intelligence</span>
              </button>

              <button
                type="button"
                className={`nav-link px-3 py-2 rounded-pill fw-semibold small text-nowrap d-inline-flex align-items-center gap-2 ${activeTab === 'calculator' ? 'active' : ''}`}
                style={{
                  background: activeTab === 'calculator' ? 'var(--lux-gold, #c6a66b)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeTab === 'calculator' ? '#0a0d12' : '#e2e8f0',
                  border: '1px solid ' + (activeTab === 'calculator' ? '#c6a66b' : 'rgba(255,255,255,0.1)')
                }}
                onClick={() => setActiveTab('calculator')}
              >
                <i className="bi bi-calculator-fill"></i>
                <span>Smart Distance Calculator</span>
              </button>

              <button
                type="button"
                className={`nav-link px-3 py-2 rounded-pill fw-semibold small text-nowrap d-inline-flex align-items-center gap-2 ${activeTab === 'crowd' ? 'active' : ''}`}
                style={{
                  background: activeTab === 'crowd' ? 'var(--lux-gold, #c6a66b)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeTab === 'crowd' ? '#0a0d12' : '#e2e8f0',
                  border: '1px solid ' + (activeTab === 'crowd' ? '#c6a66b' : 'rgba(255,255,255,0.1)')
                }}
                onClick={() => setActiveTab('crowd')}
              >
                <i className="bi bi-people-fill"></i>
                <span>Live Crowd Intelligence</span>
              </button>

              <button
                type="button"
                className={`nav-link px-3 py-2 rounded-pill fw-semibold small text-nowrap d-inline-flex align-items-center gap-2 ${activeTab === 'mawkib' ? 'active' : ''}`}
                style={{
                  background: activeTab === 'mawkib' ? 'var(--lux-gold, #c6a66b)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeTab === 'mawkib' ? '#0a0d12' : '#e2e8f0',
                  border: '1px solid ' + (activeTab === 'mawkib' ? '#c6a66b' : 'rgba(255,255,255,0.1)')
                }}
                onClick={() => setActiveTab('mawkib')}
              >
                <i className="bi bi-house-heart-fill"></i>
                <span>Smart Mawkib Finder</span>
              </button>

              <button
                type="button"
                className={`nav-link px-3 py-2 rounded-pill fw-semibold small text-nowrap d-inline-flex align-items-center gap-2 ${activeTab === 'group' ? 'active' : ''}`}
                style={{
                  background: activeTab === 'group' ? 'var(--lux-gold, #c6a66b)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeTab === 'group' ? '#0a0d12' : '#e2e8f0',
                  border: '1px solid ' + (activeTab === 'group' ? '#c6a66b' : 'rgba(255,255,255,0.1)')
                }}
                onClick={() => setActiveTab('group')}
              >
                <i className="bi bi-shield-check"></i>
                <span>Group Journey Mode</span>
              </button>

              <button
                type="button"
                className={`nav-link px-3 py-2 rounded-pill fw-semibold small text-nowrap d-inline-flex align-items-center gap-2 ${activeTab === 'journal' ? 'active' : ''}`}
                style={{
                  background: activeTab === 'journal' ? 'var(--lux-gold, #c6a66b)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeTab === 'journal' ? '#0a0d12' : '#e2e8f0',
                  border: '1px solid ' + (activeTab === 'journal' ? '#c6a66b' : 'rgba(255,255,255,0.1)')
                }}
                onClick={() => setActiveTab('journal')}
              >
                <i className="bi bi-journal-richtext"></i>
                <span>Journey Journal & Recap</span>
              </button>

              <button
                type="button"
                className={`nav-link px-3 py-2 rounded-pill fw-semibold small text-nowrap d-inline-flex align-items-center gap-2 ${activeTab === 'finder' ? 'active' : ''}`}
                style={{
                  background: activeTab === 'finder' ? 'var(--lux-gold, #c6a66b)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeTab === 'finder' ? '#0a0d12' : '#e2e8f0',
                  border: '1px solid ' + (activeTab === 'finder' ? '#c6a66b' : 'rgba(255,255,255,0.1)')
                }}
                onClick={() => setActiveTab('finder')}
              >
                <i className="bi bi-crosshair"></i>
                <span>Current Pole Finder & GPS</span>
              </button>

              <button
                type="button"
                className={`nav-link px-3 py-2 rounded-pill fw-semibold small text-nowrap d-inline-flex align-items-center gap-2 ${activeTab === 'directory' ? 'active' : ''}`}
                style={{
                  background: activeTab === 'directory' ? 'var(--lux-gold, #c6a66b)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeTab === 'directory' ? '#0a0d12' : '#e2e8f0',
                  border: '1px solid ' + (activeTab === 'directory' ? '#c6a66b' : 'rgba(255,255,255,0.1)')
                }}
                onClick={() => setActiveTab('directory')}
              >
                <i className="bi bi-signpost-2"></i>
                <span>Milestone Poles Directory</span>
              </button>

              <button
                type="button"
                className={`nav-link px-3 py-2 rounded-pill fw-semibold small text-nowrap d-inline-flex align-items-center gap-2 ${activeTab === 'offline' ? 'active' : ''}`}
                style={{
                  background: activeTab === 'offline' ? 'var(--lux-gold, #c6a66b)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeTab === 'offline' ? '#0a0d12' : '#e2e8f0',
                  border: '1px solid ' + (activeTab === 'offline' ? '#c6a66b' : 'rgba(255,255,255,0.1)')
                }}
                onClick={() => setActiveTab('offline')}
              >
                <i className="bi bi-wallet2"></i>
                <span>Offline Survival Pack</span>
              </button>
            </nav>
          </div>
        </header>

        {/* ================= TAB: LIVE ZAIREEN WALK TRACKER & STEP INTELLIGENCE ================= */}
        {activeTab === 'walk' && (
          <section className="tab-pane-walk-tracker mb-4">
            <ZaireenWalkTracker
              selectedPoleNumber={selectedPoleNumber}
              onSelectPole={(poleNum) => setSelectedPoleNumber(poleNum)}
              onJumpToMapPole={(poleNum) => {
                setSelectedPoleNumber(poleNum);
                setActiveTab('map');
                setTimeout(() => handleJumpToPole(poleNum), 150);
              }}
              nightMode={nightMode}
            />
          </section>
        )}

        {/* ================= TAB: SMART MAWKIB & PILGRIM FACILITY FINDER ================= */}
        {activeTab === 'mawkib' && (
          <section className="tab-pane-mawkib-finder mb-4">
            <SmartMawkibFinderView
              currentPoleNumber={selectedPoleNumber}
              onSelectPole={(poleNum) => setSelectedPoleNumber(poleNum)}
              onJumpToMapPole={(poleNum) => {
                setSelectedPoleNumber(poleNum);
                setActiveTab('map');
                setTimeout(() => handleJumpToPole(poleNum), 150);
              }}
              onSetGroupMeetingPoint={(fac) => {
                setPendingMeetingFacility(fac);
                setActiveTab('group');
              }}
            />
          </section>
        )}

        {/* ================= TAB: PRIVACY-FIRST GROUP JOURNEY MODE ================= */}
        {activeTab === 'group' && (
          <section className="tab-pane-group-journey mb-4">
            <GroupJourneyModeView
              currentPoleNumber={selectedPoleNumber}
              pendingMeetingFacility={pendingMeetingFacility}
              onJumpToMapPole={(poleNum) => {
                setSelectedPoleNumber(poleNum);
                setActiveTab('map');
                setTimeout(() => handleJumpToPole(poleNum), 150);
              }}
            />
          </section>
        )}

        {/* ================= TAB: JOURNEY JOURNAL & AUTOMATIC RECAP ================= */}
        {activeTab === 'journal' && (
          <section className="tab-pane-journey-journal mb-4">
            <JourneyJournalAndRecapView
              currentPoleNumber={selectedPoleNumber}
              onJumpToMapPole={(poleNum) => {
                setSelectedPoleNumber(poleNum);
                setActiveTab('map');
                setTimeout(() => handleJumpToPole(poleNum), 150);
              }}
            />
          </section>
        )}

        {/* ================= TAB 1: INTERACTIVE POLE MAP ================= */}
        {activeTab === 'map' && (
          <section className="tab-pane-map">
            {/* Map Layer Control Bar (Crowd Heatmap, Mawkib Pins, Group Members & Meeting Point, Shrine Gates) */}
            <div className="p-2.5 px-3 rounded-4 mb-3 border d-flex flex-wrap align-items-center justify-content-between gap-2" style={{ background: 'rgba(13, 19, 28, 0.94)', borderColor: 'rgba(198,166,107,0.35)' }}>
              <span className="small fw-bold text-warning">
                <i className="bi bi-layers-fill me-1.5"></i> Interactive Map Layers:
              </span>
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 py-1 ${showCrowdHeatmap ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
                  onClick={() => setShowCrowdHeatmap(!showCrowdHeatmap)}
                >
                  <i className="bi bi-activity me-1"></i> Crowd Heatmap {showCrowdHeatmap ? 'ON' : 'OFF'}
                </button>
                <button
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 py-1 ${showMapMawkibs ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
                  onClick={() => setShowMapMawkibs(!showMapMawkibs)}
                >
                  <i className="bi bi-house-heart-fill me-1"></i> Verified Mawkibs {showMapMawkibs ? 'ON' : 'OFF'}
                </button>
                <button
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 py-1 ${showMapGroup ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
                  onClick={() => setShowMapGroup(!showMapGroup)}
                >
                  <i className="bi bi-people-fill me-1"></i> Group & Meeting Point {showMapGroup ? 'ON' : 'OFF'}
                </button>
                <button
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 py-1 ${showMapGates ? 'btn-success fw-bold' : 'btn-outline-secondary text-light'}`}
                  onClick={() => setShowMapGates(!showMapGates)}
                >
                  <i className="bi bi-door-open-fill me-1"></i> Shrine Gates {showMapGates ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
            {/* Sanctuary Anchors Hero Showcase: Image 1 (Najaf Origin) & Image 4 (Karbala Destination) */}
            <div className="row g-3 mb-3">
              {/* Image 1: Imam Ali (A.S.) Shrine, Najaf — Starting Point Hero */}
              <div className="col-12 col-md-6">
                <div
                  className="card rounded-4 overflow-hidden border shadow position-relative transition-all cursor-pointer"
                  style={{ background: '#0a0d12', borderColor: 'rgba(198, 166, 107, 0.4)', minHeight: '220px' }}
                  onClick={() => {
                    if (leafletMapInstance.current) {
                      leafletMapInstance.current.flyTo(PILGRIMAGE_ANCHORS.origin.coordinates, 14, { duration: 1.2 });
                    }
                  }}
                  title="Click to view Holy Shrine of Imam Ali (Najaf) on map"
                >
                  <div className="position-relative" style={{ height: '220px' }}>
                    <img
                      src={POLE_NAV_VISUALS.originNajaf.src}
                      alt={POLE_NAV_VISUALS.originNajaf.alt}
                      className="w-100 h-100 object-fit-cover"
                      loading="lazy"
                    />
                    <div className="position-absolute top-0 start-0 p-3">
                      <span className="badge px-3 py-1.5 rounded-pill font-title fw-bold shadow text-dark" style={{ background: 'linear-gradient(135deg, #dfc08a, #c6a66b)' }}>
                        <i className="bi bi-geo-alt-fill me-1"></i> STARTING POINT • NAJAF
                      </span>
                    </div>
                    <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: 'linear-gradient(to top, rgba(10, 13, 18, 0.95) 0%, rgba(10, 13, 18, 0.6) 70%, transparent 100%)' }}>
                      <h3 className="h6 font-display text-white mb-0">{POLE_NAV_VISUALS.originNajaf.title}</h3>
                      <div className="font-arabic text-warning small">{POLE_NAV_VISUALS.originNajaf.arabicTitle}</div>
                      <div className="small text-white-50 mt-1" style={{ fontSize: '0.72rem' }}>
                        {POLE_NAV_VISUALS.originNajaf.caption}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image 4: Imam Hussain (A.S.) Shrine, Karbala — Final Destination Hero */}
              <div className="col-12 col-md-6">
                <div
                  className="card rounded-4 overflow-hidden border shadow position-relative transition-all cursor-pointer"
                  style={{ background: '#0a0d12', borderColor: 'rgba(229, 62, 62, 0.4)', minHeight: '220px' }}
                  onClick={() => {
                    if (leafletMapInstance.current) {
                      leafletMapInstance.current.flyTo(PILGRIMAGE_ANCHORS.destination.coordinates, 14, { duration: 1.2 });
                    }
                  }}
                  title="Click to view Holy Shrine of Imam Hussain (Karbala) on map"
                >
                  <div className="position-relative" style={{ height: '220px' }}>
                    <img
                      src={POLE_NAV_VISUALS.destinationKarbala.src}
                      alt={POLE_NAV_VISUALS.destinationKarbala.alt}
                      className="w-100 h-100 object-fit-cover"
                      loading="lazy"
                    />
                    <div className="position-absolute top-0 start-0 p-3">
                      <span className="badge px-3 py-1.5 rounded-pill font-title fw-bold shadow text-white" style={{ background: 'linear-gradient(135deg, #e53e3e, #9b2c2c)' }}>
                        <i className="bi bi-flag-fill me-1"></i> FINAL DESTINATION • KARBALA
                      </span>
                    </div>
                    <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: 'linear-gradient(to top, rgba(10, 13, 18, 0.95) 0%, rgba(10, 13, 18, 0.6) 70%, transparent 100%)' }}>
                      <h3 className="h6 font-display text-white mb-0">{POLE_NAV_VISUALS.destinationKarbala.title}</h3>
                      <div className="font-arabic text-warning small">{POLE_NAV_VISUALS.destinationKarbala.arabicTitle}</div>
                      <div className="small text-white-50 mt-1" style={{ fontSize: '0.72rem' }}>
                        {POLE_NAV_VISUALS.destinationKarbala.caption}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Search & Quick Jump Strip */}
            <div className="card p-3 rounded-4 border mb-3 shadow" style={{ background: '#121820', borderColor: 'rgba(198, 166, 107, 0.3)' }}>
              <div className="row g-2 align-items-center">
                <div className="col-12 col-md-5">
                  <form onSubmit={handleSearchSubmit} className="input-group input-group-sm">
                    <span className="input-group-text bg-dark border-secondary text-gold-antique">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="Jump to Pole # (e.g., 208, 500, 726, 1452)..."
                      value={searchPoleQuery}
                      onChange={(e) => setSearchPoleQuery(e.target.value)}
                    />
                    <button type="submit" className="btn btn-warning fw-bold text-dark px-3">
                      Jump
                    </button>
                  </form>
                </div>

                <div className="col-12 col-md-7 d-flex flex-wrap align-items-center justify-content-md-end gap-1.5">
                  <span className="small text-secondary font-title me-1">Key Milestones:</span>
                  {[1, 208, 400, 500, 726, 828, 1120, 1280, 1452].map(num => (
                    <button
                      key={num}
                      type="button"
                      className={`btn btn-sm py-0.5 px-2 rounded-pill font-monospace small ${selectedPoleNumber === num ? 'btn-warning text-dark fw-bold' : 'btn-dark text-white-50 border border-secondary-subtle'}`}
                      style={{ fontSize: '0.74rem' }}
                      onClick={() => handleJumpToPole(num)}
                    >
                      #{num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="row g-3">
              {/* Map Canvas (Left 8 cols) */}
              <div className="col-12 col-lg-8">
                <div className="card rounded-4 overflow-hidden border shadow-lg position-relative" style={{ height: '620px', background: '#0a0d12', borderColor: 'rgba(198, 166, 107, 0.3)' }}>
                  <div ref={mapContainerRef} className="w-100 h-100" style={{ zIndex: 1 }}></div>

                  {/* Floating Map Legend Overlay */}
                  <div className="position-absolute top-0 end-0 m-3 p-2.5 rounded-3 shadow border" style={{ background: 'rgba(10, 14, 20, 0.92)', borderColor: 'rgba(255,255,255,0.1)', zIndex: 10, maxWidth: '240px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1.5">
                      <span className="small font-title fw-bold text-gold-antique" style={{ fontSize: '0.72rem' }}>CROWD STATUS KEY</span>
                      <button
                        type="button"
                        className="btn btn-link p-0 text-decoration-none text-secondary"
                        onClick={() => setCrowdMode(crowdMode === 'live' ? 'historical' : 'live')}
                        style={{ fontSize: '0.68rem' }}
                      >
                        {crowdMode === 'live' ? 'Live View' : 'Historical'}
                      </button>
                    </div>
                    <div className="d-flex flex-column gap-1">
                      {Object.values(CROWD_LEVELS).map(lvl => (
                        <div key={lvl.id} className="d-flex align-items-center gap-2 small" style={{ fontSize: '0.7rem' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: lvl.hex, display: 'inline-block' }}></span>
                          <span className="text-white-50">{lvl.label.split('/')[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Pole Telemetry Inspector (Right 4 cols) */}
              <div className="col-12 col-lg-4">
                <div className="card h-100 p-4 rounded-4 border shadow-lg d-flex flex-column justify-content-between" style={{ background: '#121820', borderColor: 'rgba(198, 166, 107, 0.35)' }}>
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge px-3 py-1.5 rounded-pill font-title fw-bold text-dark" style={{ background: 'linear-gradient(135deg, #dfc08a, #c6a66b)' }}>
                        POLE #{currentPole.poleNumber}
                      </span>
                      <span className={`badge rounded-pill ${currentPole.isLandmark ? 'bg-success text-white' : 'bg-secondary text-light'} small`} style={{ fontSize: '0.68rem' }}>
                        {currentPole.isLandmark ? 'SURVEYED GPS' : 'INTERPOLATED'}
                      </span>
                    </div>

                    <h2 className="h5 font-display text-white mb-1">{currentPole.title}</h2>
                    <div className="font-arabic text-warning small mb-3">{currentPole.arabicTitle}</div>

                    <p className="text-light-50 small mb-3" style={{ lineHeight: 1.5, fontSize: '0.82rem' }}>
                      {currentPole.description}
                    </p>

                    {/* Telemetry Metrics */}
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <div className="p-2.5 rounded-3 bg-dark border border-secondary-subtle">
                          <div className="text-secondary small" style={{ fontSize: '0.68rem' }}>FROM POLE 1 (NAJAF)</div>
                          <div className="fw-bold text-gold-antique">{currentPole.cumulativeKmFromPole1} km</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-2.5 rounded-3 bg-dark border border-secondary-subtle">
                          <div className="text-secondary small" style={{ fontSize: '0.68rem' }}>TO POLE 1452 (KARBALA)</div>
                          <div className="fw-bold text-white">{currentPole.remainingKmToPole1452} km</div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar from Pole 1 to 1452 */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between text-secondary small mb-1" style={{ fontSize: '0.7rem' }}>
                        <span>Najaf (Pole 1)</span>
                        <span className="text-warning fw-bold">{Math.round((currentPole.poleNumber / 1452) * 100)}% Journey Walked</span>
                        <span>Karbala (Pole 1452)</span>
                      </div>
                      <div className="progress" style={{ height: '6px', background: 'rgba(255,255,255,0.08)' }}>
                        <div
                          className="progress-bar"
                          style={{
                            width: `${(currentPole.poleNumber / 1452) * 100}%`,
                            background: 'linear-gradient(90deg, #c6a66b, #48bb78)'
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Nearby Facilities */}
                    <div className="mb-3">
                      <div className="small font-title fw-bold text-secondary mb-2 letter-spacing-1">
                        NEARBY SERVICES & FACILITIES
                      </div>
                      <div className="d-flex flex-wrap gap-1.5">
                        {currentPole.facilities.map((fac, idx) => (
                          <span key={idx} className="badge bg-dark border border-dark-subtle text-white-50 px-2.5 py-1 small">
                            <i className="bi bi-check-circle-fill text-gold-antique me-1"></i> {fac}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Geodetic Reference Details */}
                    <div className="p-2.5 rounded-3 bg-dark border border-dark-subtle small text-secondary mb-2" style={{ fontSize: '0.72rem' }}>
                      <div><strong className="text-white">GPS:</strong> {currentPole.coordinates[0]}° N, {currentPole.coordinates[1]}° E</div>
                      <div className="text-truncate"><strong className="text-white">Source:</strong> {currentPole.sourceReference}</div>
                    </div>
                  </div>

                  {/* Quick Calculator Direct Trigger */}
                  <div className="pt-3 border-top border-dark-subtle d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-warning w-100 rounded-pill py-2 small fw-semibold"
                      onClick={() => {
                        setCalcFromPole(currentPole.poleNumber);
                        setActiveTab('calculator');
                      }}
                    >
                      <i className="bi bi-calculator me-1"></i> Calc From Here
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning w-100 rounded-pill py-2 small fw-bold text-dark font-title"
                      onClick={() => {
                        setCalcToPole(currentPole.poleNumber);
                        setActiveTab('calculator');
                      }}
                    >
                      Calc To Here
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= TAB 2: SMART DISTANCE & TIME CALCULATOR ================= */}
        {activeTab === 'calculator' && (
          <section className="tab-pane-calculator">
            <div className="row g-4">
              {/* Form Input Card */}
              <div className="col-12 col-lg-5">
                <div className="card p-4 rounded-4 border shadow-lg" style={{ background: '#121820', borderColor: 'rgba(198, 166, 107, 0.3)' }}>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <i className="bi bi-calculator-fill text-gold-antique fs-5"></i>
                    <h2 className="h6 font-display text-white mb-0">SMART POLE INTERVAL CALCULATOR</h2>
                  </div>

                  <p className="text-secondary small mb-4">
                    Enter any starting and ending pole number between 1 and 1,452. Distances are computed using the calibrated 50.17m mean highway interval.
                  </p>

                  {/* From Pole Input */}
                  <div className="mb-3">
                    <label className="small text-secondary font-title fw-bold mb-1">
                      {t.fromPole} (1 – 1,452):
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-gold-antique">
                        #
                      </span>
                      <input
                        type="number"
                        min="1"
                        max="1452"
                        className="form-control bg-dark text-white border-secondary"
                        value={calcFromPole}
                        onChange={(e) => setCalcFromPole(Math.max(1, Math.min(1452, Number(e.target.value))))}
                      />
                    </div>
                  </div>

                  {/* To Pole Input */}
                  <div className="mb-3">
                    <label className="small text-secondary font-title fw-bold mb-1">
                      {t.toPole} (1 – 1,452):
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-warning">
                        #
                      </span>
                      <input
                        type="number"
                        min="1"
                        max="1452"
                        className="form-control bg-dark text-white border-secondary"
                        value={calcToPole}
                        onChange={(e) => setCalcToPole(Math.max(1, Math.min(1452, Number(e.target.value))))}
                      />
                    </div>
                  </div>

                  {/* Pacing Speed Selection */}
                  <div className="mb-4">
                    <label className="small text-secondary font-title fw-bold mb-2">
                      SELECT WALKING PACING / PROFILE:
                    </label>
                    <div className="row g-2">
                      {[
                        { id: 'relaxed', label: 'Family / Stroller (3.0 km/h)', desc: 'Frequent shaded rests' },
                        { id: 'normal', label: 'Standard Ziyarat (4.0 km/h)', desc: 'Normal group cadence' },
                        { id: 'brisk', label: 'Brisk Walker (4.8 km/h)', desc: 'Continuous stride' },
                        { id: 'night', label: 'Night Walking (3.8 km/h)', desc: 'Cooler evening pace' }
                      ].map(pace => (
                        <div key={pace.id} className="col-12 col-sm-6">
                          <button
                            type="button"
                            className={`btn w-100 p-2 text-start rounded-3 border transition-all ${calcPace === pace.id ? 'btn-warning text-dark fw-bold border-warning shadow-sm' : 'btn-dark text-white-50 border-secondary-subtle'}`}
                            onClick={() => setCalcPace(pace.id)}
                            style={{ fontSize: '0.76rem' }}
                          >
                            <div className="fw-semibold">{pace.label}</div>
                            <div className="small opacity-75">{pace.desc}</div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-3 bg-dark border border-dark-subtle small text-secondary">
                    <i className="bi bi-info-circle text-gold-antique me-1"></i>
                    <strong>Methodology:</strong> Standard 250-pole intervals equal approximately 12.54 km. Calculations factor average road grade and 10 minutes of hourly hydration stops.
                  </div>
                </div>
              </div>

              {/* Calculated Results Card */}
              <div className="col-12 col-lg-7">
                <div className="card h-100 p-4 rounded-4 border shadow-lg d-flex flex-column justify-content-between" style={{ background: 'linear-gradient(145deg, #151d28 0%, #0d121a 100%)', borderColor: 'rgba(198, 166, 107, 0.4)' }}>
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="badge px-3 py-1.5 rounded-pill font-title fw-bold text-dark" style={{ background: 'linear-gradient(135deg, #dfc08a, #c6a66b)' }}>
                        CALCULATED SEGMENT METRICS
                      </span>
                      <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1 rounded-pill small">
                        Calibrated Model (50.17m Spacing)
                      </span>
                    </div>

                    <h3 className="h4 font-display text-white mb-3">
                      Pole #{calculationResult.start} → Pole #{calculationResult.end}
                    </h3>

                    {/* Result Stat Boxes */}
                    <div className="row g-3 mb-4">
                      <div className="col-6 col-md-4">
                        <div className="p-3 rounded-3 bg-dark border border-secondary-subtle text-center">
                          <div className="text-secondary small" style={{ fontSize: '0.7rem' }}>POLE INTERVALS</div>
                          <div className="h3 font-display text-warning mb-0">{calculationResult.intervals}</div>
                          <div className="text-secondary small" style={{ fontSize: '0.65rem' }}>Consecutive Poles</div>
                        </div>
                      </div>

                      <div className="col-6 col-md-4">
                        <div className="p-3 rounded-3 bg-dark border border-secondary-subtle text-center">
                          <div className="text-secondary small" style={{ fontSize: '0.7rem' }}>CALIBRATED DISTANCE</div>
                          <div className="h3 font-display text-gold-antique mb-0">{calculationResult.distanceKm} km</div>
                          <div className="text-secondary small" style={{ fontSize: '0.65rem' }}>Highway Route 9</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4">
                        <div className="p-3 rounded-3 bg-dark border border-secondary-subtle text-center">
                          <div className="text-secondary small" style={{ fontSize: '0.7rem' }}>ESTIMATED TIME</div>
                          <div className="h3 font-display text-white mb-0">{calculationResult.hours}h {calculationResult.mins}m</div>
                          <div className="text-secondary small" style={{ fontSize: '0.65rem' }}>At selected pace</div>
                        </div>
                      </div>
                    </div>

                    {/* Landmark Milestones En Route */}
                    <div className="mb-4">
                      <div className="small font-title fw-bold text-secondary mb-2 letter-spacing-1">
                        MAJOR SURVEYED MILESTONES ON THIS ROUTE ({calculationResult.milestones.length})
                      </div>

                      {calculationResult.milestones.length === 0 ? (
                        <div className="p-3 rounded-3 bg-dark border border-dark-subtle text-secondary small">
                          No major sovereign landmarks recorded inside this specific stretch. Intermediate mawakib, shaded tents, and water taps are available continuously every ~50 meters.
                        </div>
                      ) : (
                        <div className="d-flex flex-column gap-2" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                          {calculationResult.milestones.map(m => (
                            <div key={m.poleNumber} className="p-2.5 rounded-3 bg-dark border border-dark-subtle d-flex justify-content-between align-items-center">
                              <div>
                                <span className="badge bg-warning text-dark font-monospace fw-bold me-2">
                                  #{m.poleNumber}
                                </span>
                                <strong className="text-white small">{m.title.split(':')[1] || m.title}</strong>
                                <div className="text-secondary small" style={{ fontSize: '0.7rem' }}>{m.city}</div>
                              </div>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-warning rounded-pill py-0.5 px-2.5 small"
                                style={{ fontSize: '0.72rem' }}
                                onClick={() => {
                                  setSelectedPoleNumber(m.poleNumber);
                                  setActiveTab('map');
                                }}
                              >
                                View on Map
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-top border-dark-subtle d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-warning w-100 rounded-pill py-2 small fw-semibold"
                      onClick={() => setActiveTab('map')}
                    >
                      <i className="bi bi-map me-1"></i> Inspect on Map
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning w-100 rounded-pill py-2 small fw-bold text-dark font-title"
                      onClick={() => setActiveTab('offline')}
                    >
                      <i className="bi bi-wallet2 me-1"></i> Save to Offline Pack
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= TAB 3: LIVE CROWD INTELLIGENCE ================= */}
        {activeTab === 'crowd' && (
          <section className="tab-pane-crowd">
            <div className="mb-4">
              <LiveCrowdIntelligenceView
                selectedPoleNumber={selectedPoleNumber}
                onSelectPole={(poleNum) => setSelectedPoleNumber(poleNum)}
                onJumpToMapPole={(poleNum) => {
                  setSelectedPoleNumber(poleNum);
                  setActiveTab('map');
                  setTimeout(() => handleJumpToPole(poleNum), 150);
                }}
                onOpenMawkibAtPole={(poleNum) => {
                  setSelectedPoleNumber(poleNum);
                  setActiveTab('mawkib');
                }}
              />
            </div>
            {/* Image 3: Arbaeen Crowd View — Illustrative Elevated Documentation */}
            <div className="card rounded-4 overflow-hidden border shadow-lg mb-4" style={{ background: '#0a0d12', borderColor: 'rgba(198, 166, 107, 0.35)' }}>
              <div className="position-relative" style={{ minHeight: '260px', maxHeight: '360px' }}>
                <img
                  src={POLE_NAV_VISUALS.crowdAerial.src}
                  alt={POLE_NAV_VISUALS.crowdAerial.alt}
                  className="w-100 h-100 object-fit-cover"
                  style={{ maxHeight: '360px' }}
                  loading="lazy"
                />
                <div className="position-absolute top-0 start-0 p-3">
                  <span className="badge px-3 py-1.5 rounded-pill font-title fw-bold shadow text-dark" style={{ background: 'linear-gradient(135deg, #dfc08a, #c6a66b)' }}>
                    <i className="bi bi-camera-fill me-1"></i> ARBAEEN HIGHWAY CROWD AERIAL PERSPECTIVE
                  </span>
                  <span className="badge bg-dark bg-opacity-75 border border-secondary text-warning ms-2 small">
                    Illustrative Reference • Not Real-Time Telemetry
                  </span>
                </div>
                <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: 'linear-gradient(to top, rgba(10, 13, 18, 0.95) 0%, rgba(10, 13, 18, 0.6) 70%, transparent 100%)' }}>
                  <h3 className="h6 font-display text-white mb-0">{POLE_NAV_VISUALS.crowdAerial.title}</h3>
                  <div className="font-arabic text-warning small">{POLE_NAV_VISUALS.crowdAerial.arabicTitle}</div>
                  <div className="small text-white-50 mt-1" style={{ fontSize: '0.74rem' }}>
                    {POLE_NAV_VISUALS.crowdAerial.caption}
                  </div>
                </div>
              </div>
            </div>

            {/* Mode Switcher Banner */}
            <div className="card p-3 rounded-4 border mb-4 shadow" style={{ background: '#121820', borderColor: 'rgba(198, 166, 107, 0.3)' }}>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div>
                  <span className="small text-secondary font-title">SOVEREIGN CROWD INTELLIGENCE ENGINE</span>
                  <div className="fw-bold text-white fs-5">
                    {crowdMode === 'live' ? 'Live Sensor Observations (Active Checkpoints)' : 'Historical Arbaeen Peak Congestion Benchmark'}
                  </div>
                </div>

                <div className="btn-group rounded-pill p-1 border border-secondary" style={{ background: 'rgba(0,0,0,0.5)' }}>
                  <button
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 py-1.5 fw-bold ${crowdMode === 'live' ? 'btn-success text-white' : 'btn-dark text-secondary'}`}
                    onClick={() => setCrowdMode('live')}
                  >
                    <i className="bi bi-broadcast me-1"></i> Live Observational
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 py-1.5 fw-bold ${crowdMode === 'historical' ? 'btn-warning text-dark' : 'btn-dark text-secondary'}`}
                    onClick={() => setCrowdMode('historical')}
                  >
                    <i className="bi bi-graph-up me-1"></i> Historical Peak
                  </button>
                </div>
              </div>
            </div>

            {/* Zero-Fabrication Disclaimer */}
            <div className="alert alert-dark border-secondary-subtle p-3 rounded-4 mb-4 small text-secondary d-flex align-items-start gap-2.5">
              <i className="bi bi-shield-check text-gold-antique fs-5 mt-0.5"></i>
              <div>
                <strong className="text-white">STRICT SOVEREIGN ZERO-FABRICATION PROTOCOL:</strong> Live crowd status is reported exclusively from authorized optical axis counters and field observer stations operated by the Holy Shrines. When an area lacks active telemetry, it is explicitly reported as <strong>Unknown / No Live Sensor</strong> to ensure pilgrim safety and prevent misdirection.
              </div>
            </div>

            {/* Route Segments Table & Status Cards */}
            <div className="row g-3 mb-4">
              {ROUTE_SEGMENTS.map(seg => {
                const levelKey = crowdMode === 'historical' ? seg.historicalPeakLevel : seg.liveCrowdLevel;
                const level = CROWD_LEVELS[levelKey] || CROWD_LEVELS.UNKNOWN;

                return (
                  <div key={seg.id} className="col-12 col-md-6 col-xl-4">
                    <div className="card h-100 p-3 rounded-4 border shadow-sm d-flex flex-column justify-content-between" style={{ background: '#121820', borderColor: 'rgba(255,255,255,0.08)' }}>
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge px-2.5 py-1 rounded-pill bg-dark border border-secondary text-light font-monospace small">
                            Poles #{seg.fromPole} – #{seg.toPole}
                          </span>
                          <span className="small text-secondary">{seg.lengthKm} km</span>
                        </div>

                        <h4 className="h6 font-display text-white mb-1">{seg.name}</h4>
                        <div className="font-arabic text-warning small mb-3">{seg.arabicName}</div>

                        <div className="p-2.5 rounded-3 mb-3 d-flex align-items-center gap-2" style={{ background: 'rgba(0,0,0,0.4)', borderLeft: `4px solid ${level.hex}` }}>
                          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: level.hex }}></span>
                          <div>
                            <strong className="text-white small d-block">{level.label}</strong>
                            <span className="text-secondary" style={{ fontSize: '0.72rem' }}>Flow: {level.zaireenPerHour}</span>
                          </div>
                        </div>

                        <p className="text-light-50 small mb-3" style={{ fontSize: '0.78rem', lineHeight: 1.4 }}>
                          {level.description}
                        </p>
                      </div>

                      <div className="pt-2 border-top border-dark-subtle small text-secondary" style={{ fontSize: '0.7rem' }}>
                        <div><strong className="text-white">Sensor:</strong> {seg.sensorSource}</div>
                        <div><strong className="text-white">Updated:</strong> {seg.lastUpdated}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ================= TAB 4: CURRENT POLE FINDER & GPS SNAP ================= */}
        {activeTab === 'finder' && (
          <section className="tab-pane-finder">
            <div className="row g-4 justify-content-center">
              <div className="col-12 col-lg-8">
                <div className="card p-4 rounded-4 border shadow-lg" style={{ background: '#121820', borderColor: 'rgba(198, 166, 107, 0.35)' }}>
                  <div className="text-center mb-4">
                    <span className="badge px-3 py-1.5 rounded-pill font-title fw-bold text-dark mb-2" style={{ background: 'linear-gradient(135deg, #dfc08a, #c6a66b)' }}>
                      LOCAL GPS ACCURACY SNAPPING
                    </span>
                    <h2 className="h4 font-display text-white mb-1">Find Your Current Pole Position</h2>
                    <p className="text-secondary small max-w-600 mx-auto">
                      Use browser satellite GPS to detect your nearest pole marker along the highway corridor. No tracking data is ever transmitted or stored.
                    </p>
                  </div>

                  {/* Geolocation Button */}
                  <div className="text-center mb-4">
                    <button
                      type="button"
                      className="btn btn-warning btn-lg px-4 py-3 rounded-pill fw-bold text-dark font-title shadow-lg d-inline-flex align-items-center gap-2"
                      disabled={gpsLoading}
                      onClick={handleDetectGpsPole}
                    >
                      {gpsLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          <span>Acquiring Geodetic Coordinates...</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-crosshair fs-5"></i>
                          <span>Detect My Pole Position</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* GPS Error Notification */}
                  {gpsError && (
                    <div className="alert alert-danger p-3 rounded-3 mb-4 small" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {gpsError}
                    </div>
                  )}

                  {/* GPS Result Display */}
                  {gpsResult && (
                    <div className="p-4 rounded-4 border mb-4" style={{ background: 'linear-gradient(135deg, rgba(20, 28, 38, 0.9) 0%, rgba(10, 14, 20, 0.95) 100%)', borderColor: gpsResult.isNearby ? '#48bb78' : '#e53e3e' }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className={`badge px-2.5 py-1 rounded-pill ${gpsResult.isNearby ? 'bg-success text-white' : 'bg-danger text-white'} fw-bold`}>
                          {gpsResult.isNearby ? 'Highway Corridor Detected' : 'Outside Highway Corridor'}
                        </span>
                        <span className="small text-secondary font-monospace">
                          GPS Accuracy: ±{gpsResult.accuracy} meters
                        </span>
                      </div>

                      <h3 className="h5 font-display text-white mb-1">
                        Nearest Landmark: Pole #{gpsResult.closestPoleNumber}
                      </h3>
                      <p className="text-secondary small mb-3">
                        Estimated distance to highway pole: ~{gpsResult.distanceToPoleMeters} meters
                      </p>

                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-warning btn-sm rounded-pill px-3 py-1.5 fw-bold text-dark font-title"
                          onClick={() => {
                            setSelectedPoleNumber(gpsResult.closestPoleNumber);
                            setActiveTab('map');
                          }}
                        >
                          <i className="bi bi-map-fill me-1"></i> Open on Map
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-warning btn-sm rounded-pill px-3 py-1.5 fw-semibold"
                          onClick={() => {
                            setCalcFromPole(gpsResult.closestPoleNumber);
                            setActiveTab('calculator');
                          }}
                        >
                          <i className="bi bi-calculator me-1"></i> Calculate Distance to Karbala
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Manual Manual Pole Lookup Fallback */}
                  <div className="p-3 rounded-3 bg-dark border border-dark-subtle">
                    <label className="small text-secondary font-title fw-bold mb-2 d-block">
                      OR MANUALLY ENTER THE POLE NUMBER YOU ARE STANDING AT:
                    </label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-dark-subtle border-secondary text-gold-antique">
                        Pole #
                      </span>
                      <input
                        type="number"
                        min="1"
                        max="1452"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="e.g. 726"
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val >= 1 && val <= 1452) {
                            setSelectedPoleNumber(val);
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-warning fw-bold text-dark"
                        onClick={() => setActiveTab('map')}
                      >
                        Locate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= TAB 5: MILESTONE POLES DIRECTORY ================= */}
        {activeTab === 'directory' && (
          <section className="tab-pane-directory">
            {/* Image 2: Arbaeen Walking Route & Numbered Poles Hero Card */}
            <div className="card rounded-4 overflow-hidden border shadow-lg mb-4" style={{ background: '#0a0d12', borderColor: 'rgba(198, 166, 107, 0.4)' }}>
              <div className="position-relative" style={{ minHeight: '260px', maxHeight: '360px' }}>
                <img
                  src={POLE_NAV_VISUALS.routePoles.src}
                  alt={POLE_NAV_VISUALS.routePoles.alt}
                  className="w-100 h-100 object-fit-cover"
                  style={{ maxHeight: '360px' }}
                  loading="lazy"
                />
                <div className="position-absolute top-0 start-0 p-3">
                  <span className="badge px-3 py-1.5 rounded-pill font-title fw-bold shadow text-dark" style={{ background: 'linear-gradient(135deg, #dfc08a, #c6a66b)' }}>
                    <i className="bi bi-signpost-2-fill me-1"></i> ARBAEEN HIGHWAY 9 • NUMBERED POLE SYSTEM
                  </span>
                  <span className="badge bg-dark bg-opacity-75 border border-secondary text-warning ms-2 small">
                    1,452 Sequentially Numbered Poles
                  </span>
                </div>
                <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: 'linear-gradient(to top, rgba(10, 13, 18, 0.95) 0%, rgba(10, 13, 18, 0.6) 70%, transparent 100%)' }}>
                  <h3 className="h6 font-display text-white mb-0">{POLE_NAV_VISUALS.routePoles.title}</h3>
                  <div className="font-arabic text-warning small">{POLE_NAV_VISUALS.routePoles.arabicTitle}</div>
                  <div className="small text-white-50 mt-1" style={{ fontSize: '0.74rem' }}>
                    {POLE_NAV_VISUALS.routePoles.caption}
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-4 rounded-4 border shadow-lg" style={{ background: '#121820', borderColor: 'rgba(198, 166, 107, 0.3)' }}>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <div>
                  <h2 className="h5 font-display text-white mb-0">SOVEREIGN SURVEYED LANDMARK POLES</h2>
                  <span className="text-secondary small">Total 18 Primary Milestone Hubs across the 1,452 Pole Corridor</span>
                </div>
                <span className="badge bg-dark border border-gold-subtle text-warning">
                  Verified Geodetic WGS84
                </span>
              </div>

              <div className="table-responsive rounded-3 border border-dark">
                <table className="table table-dark table-hover table-sm mb-0 small">
                  <thead>
                    <tr className="text-secondary" style={{ fontSize: '0.72rem' }}>
                      <th>POLE #</th>
                      <th>TITLE & ARABIC</th>
                      <th>LOCATION / ZONE</th>
                      <th>FROM POLE 1</th>
                      <th>REMAINING</th>
                      <th>FACILITIES</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {KEY_LANDMARK_POLES.map(pole => (
                      <tr key={pole.poleNumber}>
                        <td>
                          <span className="badge bg-warning text-dark font-monospace fw-bold">
                            #{pole.poleNumber}
                          </span>
                        </td>
                        <td>
                          <strong className="text-white d-block">{pole.title.split(':')[1] || pole.title}</strong>
                          <span className="font-arabic text-warning" style={{ fontSize: '0.75rem' }}>{pole.arabicTitle}</span>
                        </td>
                        <td className="text-white-50">{pole.city}</td>
                        <td className="text-gold-antique fw-semibold">{pole.cumulativeKmFromPole1} km</td>
                        <td className="text-white">{pole.remainingKmToPole1452} km</td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {pole.facilities.slice(0, 2).map((fac, idx) => (
                              <span key={idx} className="badge bg-dark border border-secondary text-secondary" style={{ fontSize: '0.62rem' }}>
                                {fac}
                              </span>
                            ))}
                            {pole.facilities.length > 2 && (
                              <span className="text-secondary small" style={{ fontSize: '0.62rem' }}>+{pole.facilities.length - 2} more</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-warning rounded-pill py-0.5 px-2"
                            style={{ fontSize: '0.7rem' }}
                            onClick={() => {
                              setSelectedPoleNumber(pole.poleNumber);
                              setActiveTab('map');
                            }}
                          >
                            Map
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ================= TAB 6: OFFLINE SURVIVAL PACK ================= */}
        {activeTab === 'offline' && (
          <section className="tab-pane-offline">
            {/* 100% Offline Notice */}
            <div className="card p-3 rounded-4 border mb-4 shadow" style={{ background: 'linear-gradient(135deg, rgba(16, 59, 50, 0.4) 0%, rgba(10, 13, 18, 0.95) 100%)', borderColor: 'rgba(72, 187, 120, 0.4)' }}>
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-wifi-off fs-3 text-success"></i>
                <div>
                  <strong className="text-success">OFFLINE POLE NAVIGATION ACTIVE</strong>
                  <p className="small text-white-50 mb-0">
                    All 1,452 pole milestone distances, offline survival tables, and emergency hotlines are saved directly in browser storage. No cellular data is needed while walking through rural zones.
                  </p>
                </div>
              </div>
            </div>

            <div className="row g-4">
              {/* Emergency Numbers Card */}
              <div className="col-12 col-md-6">
                <div className="card h-100 p-4 rounded-4 border shadow" style={{ background: '#121820', borderColor: 'rgba(229, 62, 62, 0.3)' }}>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <i className="bi bi-shield-fill-exclamation text-danger fs-5"></i>
                    <h3 className="h6 font-display text-white mb-0">24/7 EMERGENCY ASSISTANCE DIRECTORY</h3>
                  </div>

                  <div className="d-flex flex-column gap-2 mb-3">
                    {[
                      { title: 'Iraqi National Ambulance', number: '122', desc: 'Direct 24/7 ambulance dispatch' },
                      { title: 'Iraqi Police Emergency', number: '104', desc: 'Sovereign security & incidents' },
                      { title: 'Civil Defense & Fire Rescue', number: '115', desc: 'Rescue operations' },
                      { title: 'Astan Hussainiya Lost Persons Central', number: '+964 32 322 0000', desc: 'Child & elderly reunion database' },
                      { title: 'Astan Abbasiya Helpdesk', number: '+964 32 322 0001', desc: 'Pilgrim guidance & medical coordination' }
                    ].map((c, idx) => (
                      <div key={idx} className="p-2.5 rounded-3 bg-dark border border-dark-subtle d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-semibold text-white small">{c.title}</div>
                          <div className="text-secondary small" style={{ fontSize: '0.68rem' }}>{c.desc}</div>
                        </div>
                        <a
                          href={`tel:${c.number.replace(/\s+/g, '')}`}
                          className="btn btn-sm btn-danger rounded-pill px-3 py-1 font-monospace fw-bold"
                          style={{ fontSize: '0.78rem' }}
                        >
                          <i className="bi bi-telephone-fill me-1"></i> {c.number}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Downloadable / Printable Route Pack Card */}
              <div className="col-12 col-md-6">
                <div className="card h-100 p-4 rounded-4 border shadow d-flex flex-column justify-content-between" style={{ background: '#121820', borderColor: 'rgba(198, 166, 107, 0.3)' }}>
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <i className="bi bi-download text-gold-antique fs-5"></i>
                      <h3 className="h6 font-display text-white mb-0">EXPORT OFFLINE ROUTE JSON</h3>
                    </div>

                    <p className="text-secondary small mb-3">
                      Download the complete raw JSON dataset of all 1,452 poles, milestone anchors, and GPS coordinates to store on your device.
                    </p>

                    <div className="p-3 rounded-3 bg-dark border border-dark-subtle small text-white-50 mb-4">
                      <div><strong>Total Route Distance:</strong> 72.84 km highway + 12 km city links (~84.8 km total)</div>
                      <div><strong>Landmark Poles Included:</strong> 18 fully surveyed geodetic anchors</div>
                      <div><strong>JSON Format:</strong> UTF-8 WGS84 GeoJSON compliant</div>
                    </div>
                  </div>

                  <a
                    href="/api/pole-navigation/offline-pack"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-warning w-100 rounded-pill py-2.5 fw-bold text-dark font-title shadow-sm"
                  >
                    <i className="bi bi-file-earmark-arrow-down-fill me-1"></i> Download Offline Route Pack (JSON)
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
