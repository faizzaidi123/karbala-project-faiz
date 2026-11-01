/**
 * Main Application Orchestrator for Karbala Digital Twin
 * Controls UI, Mode Switching, Interactive Map, Timeline Player, Modals, and Audio
 */

import { PRESENT_DAY_LOCATIONS, HISTORICAL_61AH_LOCATIONS } from './data/locations.js';
import { MUHARRAM_DAYS } from './data/timeline.js';
import { PERSONALITIES } from './data/personalities.js';
import { CERTAINTY_EXPLANATIONS, CERTAINTY_LEVELS } from './data/certainty_explanations.js';
import { KarbalaMap } from './map/interactive_map.js';
import { audioEngine } from './audio/soundscapes.js';

class KarbalaApp {
  constructor() {
    this.mode = 'present'; // 'present' | 'historical_61ah'
    this.selectedLocation = null;
    this.selectedDayIndex = 0; // index in MUHARRAM_DAYS (0 = 2 Muharram)
    this.selectedEvent = null;
    this.selectedAshuraPhaseIndex = 0;
    this.isPlayingTimeline = false;
    this.timelineInterval = null;
    this.savedLocations = JSON.parse(localStorage.getItem('karbala_saved_sites') || '[]');

    this.initMap();
    this.initDomElements();
    this.initTimelineUI();
    this.initEventListeners();
    this.initAudioUI();
    this.updateSavedBadge();

    // Initial Lucide icon rendering
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  initMap() {
    const container = document.getElementById('mapContainer');
    this.map = new KarbalaMap(container, {
      onLocationSelect: (loc) => this.openLocationDetail(loc),
      onViewHistorical: (histLocId) => this.switchToHistoricalAndHighlight(histLocId)
    });
    this.map.setData(PRESENT_DAY_LOCATIONS, HISTORICAL_61AH_LOCATIONS);
  }

  initDomElements() {
    // Mode buttons
    this.btnModePresent = document.getElementById('btnModePresent');
    this.btnMode61AH = document.getElementById('btnMode61AH');
    this.historicalNoticeBanner = document.getElementById('historicalNoticeBanner');
    this.modeFlash = document.getElementById('modeFlash');

    // Drawers
    this.locationDetailPanel = document.getElementById('locationDetailPanel');
    this.eventDetailPanel = document.getElementById('eventDetailPanel');

    // Modals
    this.modalCertainty = document.getElementById('modalCertainty');
    this.modalPersonalities = document.getElementById('modalPersonalities');
    this.modalZiyarat = document.getElementById('modalZiyarat');
    this.modalAccess = document.getElementById('modalAccess');
    this.modalNavigate = document.getElementById('modalNavigate');
    this.modalSaved = document.getElementById('modalSaved');

    // Split lens controls
    this.splitLensControls = document.getElementById('splitLensControls');
    this.splitPositionSlider = document.getElementById('splitPositionSlider');
    this.btnToggleThenNow = document.getElementById('btnToggleThenNow');
    this.btnCloseSplitLens = document.getElementById('btnCloseSplitLens');

    // Saved badge
    this.savedBadgeCount = document.getElementById('savedBadgeCount');
  }

  /* ================= MODE SWITCHING (PRESENT ↔ 61 AH) ================= */
  setMode(newMode) {
    if (this.mode === newMode) return;
    this.mode = newMode;

    // Trigger visual flash transition
    this.modeFlash.classList.add('active');
    setTimeout(() => {
      this.modeFlash.classList.remove('active');
    }, 450);

    // Update map mode (preserves current viewport center & zoom!)
    this.map.setMode(newMode);

    if (newMode === 'present') {
      this.btnModePresent.className = 'mode-tab active-present px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-2';
      this.btnMode61AH.className = 'mode-tab px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-2 text-amber-200/70 hover:text-amber-100';
      this.historicalNoticeBanner.classList.add('hidden');
    } else {
      this.btnModePresent.className = 'mode-tab px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-2 text-slate-300 hover:text-white';
      this.btnMode61AH.className = 'mode-tab active-historical px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-2';
      this.historicalNoticeBanner.classList.remove('hidden');
    }

    // If a location is currently open in detail panel, update or switch to associated location
    if (this.selectedLocation) {
      if (newMode === '61ah' && this.selectedLocation.historicalId) {
        const histLoc = HISTORICAL_61AH_LOCATIONS.find(l => l.id === this.selectedLocation.historicalId);
        if (histLoc) this.openLocationDetail(histLoc);
      } else if (newMode === 'present' && this.selectedLocation.presentId) {
        const presLoc = PRESENT_DAY_LOCATIONS.find(l => l.id === this.selectedLocation.presentId);
        if (presLoc) this.openLocationDetail(presLoc);
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  switchToHistoricalAndHighlight(historicalId) {
    this.setMode('61ah');
    const loc = HISTORICAL_61AH_LOCATIONS.find(l => l.id === historicalId);
    if (loc) {
      this.openLocationDetail(loc);
      this.map.highlightLocation(loc.id);
    }
  }

  switchToPresentAndHighlight(presentId) {
    this.setMode('present');
    const loc = PRESENT_DAY_LOCATIONS.find(l => l.id === presentId);
    if (loc) {
      this.openLocationDetail(loc);
      this.map.highlightLocation(loc.id);
    }
  }

  /* ================= LOCATION DETAIL PANEL ================= */
  openLocationDetail(location) {
    this.selectedLocation = location;
    this.eventDetailPanel.classList.add('closed'); // close event drawer if open

    // Category & Certainty Badges
    const catBadge = document.getElementById('locDetailCategoryBadge');
    catBadge.textContent = (location.category || 'SITE').toUpperCase();

    const certBadge = document.getElementById('locDetailCertaintyBadge');
    const certLevel = CERTAINTY_LEVELS[location.certaintyLevel] || CERTAINTY_LEVELS.APPROXIMATE_LOCATION;
    certBadge.textContent = certLevel.label;
    certBadge.style.backgroundColor = certLevel.bgColor;
    certBadge.style.color = certLevel.color;
    certBadge.style.borderColor = certLevel.borderColor;

    document.getElementById('whyApproxBadgeText').textContent = certLevel.label;

    // Image & Attribution
    const imgEl = document.getElementById('locDetailImage');
    imgEl.src = location.image || 'assets/images/shrine_27.jpg';
    document.getElementById('locDetailImageAttribution').textContent =
      location.imageAttribution || 'Imam Hussain Holy Shrine / AlKafeel Global Network';

    // Titles
    document.getElementById('locDetailName').textContent = location.name;
    document.getElementById('locDetailArabic').textContent = location.arabicName;
    document.getElementById('locDetailSubtitle').textContent = location.title || '';

    // Introduction
    document.getElementById('locDetailIntro').textContent = location.intro || location.summary || '';

    // Geographical correspondence text
    document.getElementById('locDetailCorrespondence').textContent =
      location.historicalCorrespondence || location.noticeText || 'Documented historical association.';

    // Mode Bridge Banner
    const isPresent = !!location.historicalId || PRESENT_DAY_LOCATIONS.some(l => l.id === location.id);
    const bridgeBanner = document.getElementById('locDetailBridgeBanner');
    const switchBtn = document.getElementById('btnSwitchToAssociated');
    const switchLabel = document.getElementById('btnSwitchLabel');

    if (isPresent && location.historicalId) {
      bridgeBanner.classList.remove('hidden');
      document.getElementById('locBridgeTitle').textContent = 'HISTORICAL CONTINUITY';
      document.getElementById('locBridgeDesc').textContent = 'View this area as it existed in 61 AH';
      switchLabel.textContent = 'VIEW HISTORICAL CONTEXT →';
      switchBtn.onclick = () => this.switchToHistoricalAndHighlight(location.historicalId);
    } else if (!isPresent && location.presentId) {
      bridgeBanner.classList.remove('hidden');
      document.getElementById('locBridgeTitle').textContent = 'PRESENT-DAY CONTINUITY';
      document.getElementById('locBridgeDesc').textContent = 'View this site in modern Karbala';
      switchLabel.textContent = 'VIEW THIS AREA TODAY →';
      switchBtn.onclick = () => this.switchToPresentAndHighlight(location.presentId);
    } else {
      bridgeBanner.classList.add('hidden');
    }

    // Save button state
    this.updateSaveButtonState();

    // Open drawer
    this.locationDetailPanel.classList.remove('closed');
    this.locationDetailPanel.classList.add('open');

    if (window.lucide) window.lucide.createIcons();
  }

  closeLocationDetail() {
    this.locationDetailPanel.classList.remove('open');
    this.locationDetailPanel.classList.add('closed');
    this.map.clearHighlight();
  }

  /* ================= EVENT DETAIL PANEL ================= */
  openEventDetail(event, dayObj) {
    this.selectedEvent = event;
    this.locationDetailPanel.classList.add('closed'); // Close location drawer

    document.getElementById('eventDetailDate').textContent = `${dayObj.dateString} • ${event.time || ''}`;
    document.getElementById('eventDetailTitle').textContent = event.title;
    document.getElementById('eventDetailTime').textContent = event.time || 'Daytime';
    document.getElementById('eventDetailSummary').textContent = event.summary || '';

    // Narrative paragraphs
    const narrativeContainer = document.getElementById('eventDetailNarrative');
    narrativeContainer.innerHTML = '';
    const paragraphs = (event.narrative || event.detailedText || '').split('\n\n');
    paragraphs.forEach(p => {
      if (p.trim()) {
        const pEl = document.createElement('p');
        pEl.textContent = p.trim();
        narrativeContainer.appendChild(pEl);
      }
    });

    // People pills
    const peopleContainer = document.getElementById('eventDetailPeople');
    peopleContainer.innerHTML = '';
    (event.people || []).forEach(pName => {
      const btn = document.createElement('button');
      btn.className = 'px-2.5 py-1 rounded-full text-[11px] font-medium bg-stone-800 text-amber-200 border border-amber-800/40 hover:border-amber-400 transition';
      btn.textContent = pName;
      btn.onclick = () => this.openPersonByName(pName);
      peopleContainer.appendChild(btn);
    });

    // Associated places pills
    const placesContainer = document.getElementById('eventDetailPlaces');
    placesContainer.innerHTML = '';
    (event.places || []).forEach(plName => {
      const span = document.createElement('span');
      span.className = 'px-2.5 py-1 rounded-full text-[11px] font-medium bg-stone-800 text-stone-300 border border-stone-700';
      span.textContent = plName;
      placesContainer.appendChild(span);
    });

    // Sources
    const sourcesContainer = document.getElementById('eventDetailSources');
    sourcesContainer.innerHTML = '';
    (event.primarySources || ['Abu Mikhnaf, Maqtal al-Husayn', 'Tarikh al-Tabari, Vol. 5', 'Kitab al-Irshad by Shaykh al-Mufid']).forEach(src => {
      const li = document.createElement('li');
      li.textContent = src;
      sourcesContainer.appendChild(li);
    });

    // Differing accounts
    const differBox = document.getElementById('eventSourcesDifferBox');
    if (event.scholarlyNotes && event.scholarlyNotes.includes('differ')) {
      differBox.classList.remove('hidden');
      document.getElementById('eventSourcesDifferText').textContent = event.scholarlyNotes;
    } else {
      differBox.classList.add('hidden');
    }

    // Show on Map click action
    document.getElementById('btnEventShowOnMap').onclick = () => {
      if (dayObj.highlightCoords) {
        this.setMode('61ah');
        this.map.panTo(dayObj.highlightCoords.x, dayObj.highlightCoords.y, 1.6);
        if (dayObj.locationId) {
          this.map.highlightLocation(dayObj.locationId);
        }
      }
    };

    this.eventDetailPanel.classList.remove('closed');
    this.eventDetailPanel.classList.add('open');

    if (window.lucide) window.lucide.createIcons();
  }

  closeEventDetail() {
    this.eventDetailPanel.classList.remove('open');
    this.eventDetailPanel.classList.add('closed');
    this.map.clearHighlight();
  }

  /* ================= TIMELINE INTERFACE & PROGRESSION ================= */
  initTimelineUI() {
    const row = document.getElementById('timelineDaysRow');
    row.innerHTML = '';

    MUHARRAM_DAYS.forEach((day, idx) => {
      const btn = document.createElement('button');
      btn.id = `btnTimelineDay_${day.dayNumber}`;
      btn.className = `timeline-day-btn px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition flex items-center gap-1.5 ${
        idx === 0
          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
          : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-amber-500/60'
      }`;
      btn.innerHTML = `
        <span class="w-5 h-5 rounded-full ${idx === 0 ? 'bg-slate-900 text-amber-300' : 'bg-slate-700 text-slate-300'} text-[10px] font-bold flex items-center justify-center">
          ${day.dayNumber}
        </span>
        <span>${day.dayNumber === 10 ? '10 Muharram (Ashura)' : `${day.dayNumber} Muharram`}</span>
      `;
      btn.onclick = () => this.selectTimelineDay(idx);
      row.appendChild(btn);
    });

    this.updateTimelineDisplay();
  }

  selectTimelineDay(dayIdx) {
    this.selectedDayIndex = dayIdx;
    const day = MUHARRAM_DAYS[dayIdx];

    // Ensure 61 AH mode is active when engaging with historical timeline
    this.setMode('61ah');

    // Update active button styles
    document.querySelectorAll('.timeline-day-btn').forEach((b, idx) => {
      if (idx === dayIdx) {
        b.className = 'timeline-day-btn px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition flex items-center gap-1.5 bg-amber-500 text-slate-950 border-amber-400 shadow-md';
        const num = b.querySelector('span');
        if (num) num.className = 'w-5 h-5 rounded-full bg-slate-900 text-amber-300 text-[10px] font-bold flex items-center justify-center';
      } else {
        b.className = 'timeline-day-btn px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition flex items-center gap-1.5 bg-slate-800/80 text-slate-300 border-slate-700 hover:border-amber-500/60';
        const num = b.querySelector('span');
        if (num) num.className = 'w-5 h-5 rounded-full bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center justify-center';
      }
    });

    this.updateTimelineDisplay();

    // Map highlight & pan
    if (day.highlightCoords) {
      this.map.panTo(day.highlightCoords.x, day.highlightCoords.y, 1.4);
      if (day.locationId) {
        this.map.highlightLocation(day.locationId);
      }
    }

    // If day has events, open the first event
    if (day.events && day.events[0]) {
      this.openEventDetail(day.events[0], day);
    }

    // Toggle Ashura sub-phases row if 10 Muharram
    const ashuraRow = document.getElementById('ashuraSubTimelineContainer');
    if (day.isAshuraDetailed) {
      ashuraRow.classList.remove('hidden');
      this.renderAshuraPhases(day.ashuraPhases);
    } else {
      ashuraRow.classList.add('hidden');
    }

    if (window.lucide) window.lucide.createIcons();
  }

  updateTimelineDisplay() {
    const day = MUHARRAM_DAYS[this.selectedDayIndex];
    document.getElementById('timelineSelectedLabel').textContent = `${day.dayNumber} Muharram 61 AH: ${day.title}`;
    document.getElementById('timelineSelectedSub').textContent = `(${day.shortSummary})`;
  }

  renderAshuraPhases(phases) {
    const container = document.getElementById('ashuraPhasesList');
    container.innerHTML = '';
    phases.forEach((phase, idx) => {
      const btn = document.createElement('button');
      btn.className = `px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap border transition ${
        idx === this.selectedAshuraPhaseIndex
          ? 'bg-amber-600 text-white border-amber-400 font-bold shadow'
          : 'bg-stone-800 text-stone-300 border-stone-700 hover:border-amber-500'
      }`;
      btn.textContent = phase.phaseName;
      btn.onclick = () => this.selectAshuraPhase(idx);
      container.appendChild(btn);
    });
  }

  selectAshuraPhase(phaseIdx) {
    this.selectedAshuraPhaseIndex = phaseIdx;
    const day = MUHARRAM_DAYS[this.selectedDayIndex];
    if (!day.ashuraPhases) return;

    const phase = day.ashuraPhases[phaseIdx];
    this.renderAshuraPhases(day.ashuraPhases);

    // Pan map to phase coordinates
    if (phase.coords) {
      this.map.panTo(phase.coords.x, phase.coords.y, 1.55);
    }

    // Open in event detail panel
    this.openEventDetail(phase, day);
  }

  togglePlayTimeline() {
    if (this.isPlayingTimeline) {
      this.stopTimelinePlayback();
    } else {
      this.startTimelinePlayback();
    }
  }

  startTimelinePlayback() {
    this.isPlayingTimeline = true;
    document.getElementById('btnPlayTimelineText').textContent = 'PAUSE';
    const playBtn = document.getElementById('btnPlayTimeline');
    playBtn.classList.add('bg-rose-500', 'hover:bg-rose-400');
    playBtn.classList.remove('bg-amber-500', 'hover:bg-amber-400');

    // Progression cycle: advance every 3.5 seconds
    this.timelineInterval = setInterval(() => {
      const currentDay = MUHARRAM_DAYS[this.selectedDayIndex];
      if (currentDay.isAshuraDetailed && this.selectedAshuraPhaseIndex < currentDay.ashuraPhases.length - 1) {
        this.selectAshuraPhase(this.selectedAshuraPhaseIndex + 1);
      } else {
        if (this.selectedDayIndex < MUHARRAM_DAYS.length - 1) {
          this.selectTimelineDay(this.selectedDayIndex + 1);
        } else {
          // Loop back to 2 Muharram
          this.selectTimelineDay(0);
        }
      }
    }, 3800);
  }

  stopTimelinePlayback() {
    this.isPlayingTimeline = false;
    if (this.timelineInterval) {
      clearInterval(this.timelineInterval);
      this.timelineInterval = null;
    }
    document.getElementById('btnPlayTimelineText').textContent = 'PLAY TIMELINE';
    const playBtn = document.getElementById('btnPlayTimeline');
    playBtn.classList.remove('bg-rose-500', 'hover:bg-rose-400');
    playBtn.classList.add('bg-amber-500', 'hover:bg-amber-400');
  }

  prevTimelineStep() {
    const currentDay = MUHARRAM_DAYS[this.selectedDayIndex];
    if (currentDay.isAshuraDetailed && this.selectedAshuraPhaseIndex > 0) {
      this.selectAshuraPhase(this.selectedAshuraPhaseIndex - 1);
    } else if (this.selectedDayIndex > 0) {
      this.selectTimelineDay(this.selectedDayIndex - 1);
    }
  }

  nextTimelineStep() {
    const currentDay = MUHARRAM_DAYS[this.selectedDayIndex];
    if (currentDay.isAshuraDetailed && this.selectedAshuraPhaseIndex < currentDay.ashuraPhases.length - 1) {
      this.selectAshuraPhase(this.selectedAshuraPhaseIndex + 1);
    } else if (this.selectedDayIndex < MUHARRAM_DAYS.length - 1) {
      this.selectTimelineDay(this.selectedDayIndex + 1);
    }
  }

  /* ================= EXPLORE BY PERSON ================= */
  openPersonalitiesModal() {
    this.renderPersonalitiesGrid(PERSONALITIES);
    this.modalPersonalities.classList.remove('hidden');
    this.modalPersonalities.classList.add('visible');
    if (window.lucide) window.lucide.createIcons();
  }

  renderPersonalitiesGrid(list) {
    const grid = document.getElementById('personalitiesGrid');
    grid.innerHTML = '';

    list.forEach(p => {
      const card = document.createElement('div');
      card.className = 'p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 flex gap-3.5 transition group';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}" class="w-16 h-16 rounded-xl object-cover border border-slate-700 flex-shrink-0">
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-white group-hover:text-amber-300 truncate">${p.name}</h4>
          </div>
          <p class="text-xs text-amber-400 font-arabic">${p.arabicName}</p>
          <p class="text-[11px] text-slate-400 italic mt-0.5 line-clamp-1">${p.epithet || p.role}</p>
          <p class="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-snug">${p.biography}</p>
          <div class="mt-2.5 flex items-center justify-between">
            <span class="text-[10px] text-slate-500">Appears: ${p.timelineDays.map(d => `${d} Muh`).join(', ')}</span>
            <button class="btn-person-focus px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-[10px] font-bold transition">
              Explore in Timeline & Map →
            </button>
          </div>
        </div>
      `;

      card.querySelector('.btn-person-focus').onclick = () => {
        this.modalPersonalities.classList.remove('visible');
        this.modalPersonalities.classList.add('hidden');
        this.focusOnPerson(p);
      };

      grid.appendChild(card);
    });
  }

  focusOnPerson(person) {
    // Jump to first timeline day of person
    const firstDay = person.timelineDays[0] || 10;
    const dayIdx = MUHARRAM_DAYS.findIndex(d => d.dayNumber === firstDay);
    if (dayIdx >= 0) {
      this.selectTimelineDay(dayIdx);
    }
    // Highlight first associated location if present
    if (person.associatedPlaces && person.associatedPlaces[0]) {
      const match = PRESENT_DAY_LOCATIONS.find(l => l.name.includes(person.name) || person.associatedPlaces[0].includes(l.name))
        || HISTORICAL_61AH_LOCATIONS[0];
      if (match) {
        this.openLocationDetail(match);
      }
    }
  }

  openPersonByName(name) {
    const cleanName = name.replace('(AS)', '').replace('(SA)', '').trim();
    const person = PERSONALITIES.find(p => p.name.includes(cleanName) || cleanName.includes(p.name));
    if (person) {
      this.openPersonalitiesModal();
      document.getElementById('personSearchInput').value = person.name;
      this.renderPersonalitiesGrid([person]);
    }
  }

  /* ================= CERTAINTY EXPLANATION MODAL ================= */
  openCertaintyModal(certaintyKey) {
    const data = CERTAINTY_EXPLANATIONS[certaintyKey] || CERTAINTY_EXPLANATIONS.maqtal_hussain;
    const certLevel = CERTAINTY_LEVELS[data.level] || CERTAINTY_LEVELS.APPROXIMATE_LOCATION;

    document.getElementById('certModalTitle').textContent = data.title;
    const badge = document.getElementById('certModalBadge');
    badge.textContent = certLevel.label;
    badge.style.backgroundColor = certLevel.bgColor;
    badge.style.color = certLevel.color;
    badge.style.borderColor = certLevel.borderColor;

    // Explanation paragraphs
    const expContainer = document.getElementById('certModalExplanation');
    expContainer.innerHTML = '';
    data.explanation.split('\n\n').forEach(p => {
      const pEl = document.createElement('p');
      pEl.textContent = p;
      expContainer.appendChild(pEl);
    });

    // Sources list
    const srcContainer = document.getElementById('certModalSources');
    srcContainer.innerHTML = '';
    (data.sources || []).forEach(s => {
      const div = document.createElement('div');
      div.className = 'p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center text-[11px]';
      div.innerHTML = `
        <span class="font-semibold text-slate-200">${s.author} — <em class="text-amber-300">${s.work}</em></span>
        <span class="text-slate-400 font-mono">${s.citation}</span>
      `;
      srcContainer.appendChild(div);
    });

    this.modalCertainty.classList.remove('hidden');
    this.modalCertainty.classList.add('visible');
    if (window.lucide) window.lucide.createIcons();
  }

  /* ================= ZIYARAT & ACCESSIBILITY MODALS ================= */
  openZiyaratModal(location) {
    const z = location.ziyarat || {
      title: 'Ziyarat Warith',
      arabicTitle: 'زيارة وارث',
      excerptArabic: 'السَّلامُ عَلَيْكَ يا وارِثَ آدَمَ صَفْوَةِ اللهِ...',
      transliteration: 'Assalamu alayka ya waritha Adama safwatillah...',
      translation: 'Peace be upon you, O inheritor of Adam, the chosen of Allah...',
      etiquette: 'Approach with humility and pure garments.'
    };

    document.getElementById('ziyaratModalTitle').textContent = z.title;
    document.getElementById('ziyaratModalArabicTitle').textContent = z.arabicTitle;
    document.getElementById('ziyaratModalEtiquette').textContent = z.etiquette;
    document.getElementById('ziyaratModalArabic').textContent = z.excerptArabic;
    document.getElementById('ziyaratModalTranslit').textContent = z.transliteration;
    document.getElementById('ziyaratModalTranslation').textContent = z.translation;

    this.modalZiyarat.classList.remove('hidden');
    this.modalZiyarat.classList.add('visible');
    if (window.lucide) window.lucide.createIcons();
  }

  openAccessModal(location) {
    const a = location.accessibility || {
      wheelchairAccess: 'Standard step-free entrance ramps available.',
      golfCartShuttle: 'Electric cart routes connect the main ring gates.',
      elevators: 'Lifts serve lower courtyards.',
      medicalCenter: 'Emergency medical clinic adjacent to perimeter.',
      sensoryTactile: 'Braille directional signage and tactile tiles.'
    };

    document.getElementById('accessModalLocationName').textContent = location.name;
    document.getElementById('accessWheelchair').textContent = a.wheelchairAccess;
    document.getElementById('accessGolfCart').textContent = a.golfCartShuttle;
    document.getElementById('accessElevator').textContent = a.elevators;
    document.getElementById('accessMedical').textContent = a.medicalCenter;
    document.getElementById('accessSensory').textContent = a.sensoryTactile;

    this.modalAccess.classList.remove('hidden');
    this.modalAccess.classList.add('visible');
    if (window.lucide) window.lucide.createIcons();
  }

  openNavigateModal(location) {
    const nav = location.navigation || {
      gates: ['Bab al-Qibla', 'Bab al-Sidra'],
      distanceFromBain: '150 meters',
      walkingTime: '2 minutes'
    };

    document.getElementById('navModalLocationName').textContent = location.name;
    const gatesList = document.getElementById('navModalGates');
    gatesList.innerHTML = '';
    (nav.gates || []).forEach(g => {
      const li = document.createElement('li');
      li.textContent = g;
      gatesList.appendChild(li);
    });
    document.getElementById('navModalTime').textContent = nav.walkingTime;
    document.getElementById('navModalDistance').textContent = nav.distanceFromBain;

    this.modalNavigate.classList.remove('hidden');
    this.modalNavigate.classList.add('visible');
    if (window.lucide) window.lucide.createIcons();
  }

  /* ================= BOOKMARKS / SAVED SITES ================= */
  toggleSaveCurrentLocation() {
    if (!this.selectedLocation) return;
    const id = this.selectedLocation.id;
    const idx = this.savedLocations.findIndex(s => s.id === id);

    if (idx >= 0) {
      this.savedLocations.splice(idx, 1);
    } else {
      this.savedLocations.push({
        id: this.selectedLocation.id,
        name: this.selectedLocation.name,
        arabicName: this.selectedLocation.arabicName,
        category: this.selectedLocation.category,
        image: this.selectedLocation.image
      });
    }

    localStorage.setItem('karbala_saved_sites', JSON.stringify(this.savedLocations));
    this.updateSaveButtonState();
    this.updateSavedBadge();
  }

  updateSaveButtonState() {
    if (!this.selectedLocation) return;
    const isSaved = this.savedLocations.some(s => s.id === this.selectedLocation.id);
    const btn = document.getElementById('btnActionSave');
    const textEl = document.getElementById('btnSaveText');
    if (isSaved) {
      btn.classList.add('bg-rose-600', 'text-white');
      textEl.textContent = 'Saved ★';
    } else {
      btn.classList.remove('bg-rose-600', 'text-white');
      textEl.textContent = '🔖 Save';
    }
  }

  updateSavedBadge() {
    const count = this.savedLocations.length;
    if (count > 0) {
      this.savedBadgeCount.textContent = count;
      this.savedBadgeCount.classList.remove('hidden');
    } else {
      this.savedBadgeCount.classList.add('hidden');
    }
  }

  openSavedModal() {
    const list = document.getElementById('savedListContainer');
    list.innerHTML = '';

    if (this.savedLocations.length === 0) {
      list.innerHTML = '<p class="text-slate-400 text-center py-6">No saved locations yet. Click the "🔖 Save" button on any site to bookmark it.</p>';
    } else {
      this.savedLocations.forEach(item => {
        const row = document.createElement('div');
        row.className = 'p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3';
        row.innerHTML = `
          <div class="truncate cursor-pointer">
            <h5 class="font-bold text-white text-xs truncate">${item.name}</h5>
            <p class="text-[11px] text-amber-400 font-arabic">${item.arabicName}</p>
          </div>
          <button class="btn-goto-saved px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold text-[11px]">
            Go →
          </button>
        `;
        row.querySelector('.cursor-pointer').onclick = () => {
          this.modalSaved.classList.remove('visible');
          this.modalSaved.classList.add('hidden');
          const loc = PRESENT_DAY_LOCATIONS.find(l => l.id === item.id) || HISTORICAL_61AH_LOCATIONS.find(l => l.id === item.id);
          if (loc) {
            this.openLocationDetail(loc);
            this.map.panTo(loc.coords.x, loc.coords.y);
          }
        };
        row.querySelector('.btn-goto-saved').onclick = () => {
          this.modalSaved.classList.remove('visible');
          this.modalSaved.classList.add('hidden');
          const loc = PRESENT_DAY_LOCATIONS.find(l => l.id === item.id) || HISTORICAL_61AH_LOCATIONS.find(l => l.id === item.id);
          if (loc) {
            this.openLocationDetail(loc);
            this.map.panTo(loc.coords.x, loc.coords.y);
          }
        };
        list.appendChild(row);
      });
    }

    this.modalSaved.classList.remove('hidden');
    this.modalSaved.classList.add('visible');
    if (window.lucide) window.lucide.createIcons();
  }

  /* ================= AUDIO UI & DOCK ================= */
  initAudioUI() {
    const dock = document.getElementById('audioDockWidget');
    const toggleBtn = document.getElementById('btnAudioToggle');
    const closeBtn = document.getElementById('btnCloseAudioDock');
    const playPauseBtn = document.getElementById('btnAudioPlayPause');
    const trackSelect = document.getElementById('audioTrackSelect');
    const volumeSlider = document.getElementById('audioVolumeSlider');
    const scrubber = document.getElementById('audioScrubber');

    toggleBtn.onclick = () => {
      dock.classList.toggle('hidden');
    };

    closeBtn.onclick = () => {
      dock.classList.add('hidden');
    };

    playPauseBtn.onclick = () => {
      audioEngine.togglePlay();
    };

    trackSelect.onchange = (e) => {
      audioEngine.playTrack(e.target.value);
    };

    volumeSlider.oninput = (e) => {
      audioEngine.setVolume(parseFloat(e.target.value));
    };

    scrubber.oninput = (e) => {
      audioEngine.seek(parseFloat(e.target.value));
    };

    // Listen to audio engine state updates
    audioEngine.subscribe((event, data) => {
      if (event === 'statechange') {
        const isPlaying = data.isPlaying;
        playPauseBtn.innerHTML = isPlaying
          ? '<i data-lucide="pause" class="w-4 h-4 fill-current"></i>'
          : '<i data-lucide="play" class="w-4 h-4 fill-current"></i>';
        if (window.lucide) window.lucide.createIcons();
      } else if (event === 'trackchange') {
        document.getElementById('audioTrackTitle').textContent = data.title;
        document.getElementById('audioTrackArtist').textContent = data.artist;
        document.getElementById('audioDuration').textContent = data.duration;
        trackSelect.value = data.id;
      } else if (event === 'timeupdate') {
        scrubber.value = data.progress;
        const curMin = Math.floor(data.currentTime / 60);
        const curSec = Math.floor(data.currentTime % 60);
        document.getElementById('audioCurrentTime').textContent = `${curMin}:${curSec < 10 ? '0' : ''}${curSec}`;
      }
    });
  }

  /* ================= EVENT LISTENERS ================= */
  initEventListeners() {
    // Mode toggles
    this.btnModePresent.onclick = () => this.setMode('present');
    this.btnMode61AH.onclick = () => this.setMode('61ah');

    // Split lens toggle
    this.btnToggleThenNow.onclick = () => {
      const active = !this.map.thenNowMode;
      this.map.toggleThenNowLens(active);
      if (active) {
        this.splitLensControls.classList.remove('hidden');
        this.btnToggleThenNow.classList.add('border-amber-500', 'text-amber-300');
      } else {
        this.splitLensControls.classList.add('hidden');
        this.btnToggleThenNow.classList.remove('border-amber-500', 'text-amber-300');
      }
    };

    this.btnCloseSplitLens.onclick = () => {
      this.map.toggleThenNowLens(false);
      this.splitLensControls.classList.add('hidden');
      this.btnToggleThenNow.classList.remove('border-amber-500', 'text-amber-300');
    };

    this.splitPositionSlider.oninput = (e) => {
      this.map.setSplitPosition(parseFloat(e.target.value));
    };

    // Close drawers
    document.getElementById('btnCloseLocationDetail').onclick = () => this.closeLocationDetail();
    document.getElementById('btnCloseEventDetail').onclick = () => this.closeEventDetail();

    // Map tools
    document.getElementById('btnZoomIn').onclick = () => this.map.zoomIn();
    document.getElementById('btnZoomOut').onclick = () => this.map.zoomOut();
    document.getElementById('btnResetView').onclick = () => this.map.resetView();

    // Landmark focus buttons
    document.getElementById('btnFocusHussain').onclick = () => {
      this.map.panTo(44.5, 55.5, 1.4);
      const loc = PRESENT_DAY_LOCATIONS.find(l => l.id === 'shrine_hussain');
      if (loc) this.openLocationDetail(loc);
    };
    document.getElementById('btnFocusAbbas').onclick = () => {
      this.map.panTo(57.5, 38.5, 1.4);
      const loc = PRESENT_DAY_LOCATIONS.find(l => l.id === 'shrine_abbas');
      if (loc) this.openLocationDetail(loc);
    };
    document.getElementById('btnFocusMukhayam').onclick = () => {
      this.map.panTo(33.0, 68.0, 1.4);
      const loc = PRESENT_DAY_LOCATIONS.find(l => l.id === 'mukhayam_present') || HISTORICAL_61AH_LOCATIONS[0];
      if (loc) this.openLocationDetail(loc);
    };

    // Search and filters
    const searchInput = document.getElementById('mapSearchInput');
    const clearSearchBtn = document.getElementById('btnClearSearch');
    searchInput.oninput = (e) => {
      const q = e.target.value;
      this.map.searchQuery = q;
      clearSearchBtn.classList.toggle('hidden', !q);
      this.map.requestRender();
    };
    clearSearchBtn.onclick = () => {
      searchInput.value = '';
      this.map.searchQuery = '';
      clearSearchBtn.classList.add('hidden');
      this.map.requestRender();
    };

    document.querySelectorAll('.cat-pill').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.cat-pill').forEach(b => {
          b.className = 'cat-pill px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800/90 text-slate-300 border border-slate-700 hover:border-amber-500';
        });
        btn.className = 'cat-pill px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500 text-slate-950 shadow';
        this.map.categoryFilter = btn.dataset.cat;
        this.map.requestRender();
      };
    });

    // Location detail action buttons
    document.getElementById('btnActionListen').onclick = () => {
      const dock = document.getElementById('audioDockWidget');
      dock.classList.remove('hidden');
      if (this.selectedLocation && this.selectedLocation.audioTrack) {
        audioEngine.playTrack(this.selectedLocation.audioTrack.type === 'ziyarat' ? 'ziyarat_warith' : 'desert_ambiance');
      } else {
        audioEngine.playTrack('ziyarat_warith');
      }
    };

    document.getElementById('btnActionZiyarat').onclick = () => {
      if (this.selectedLocation) this.openZiyaratModal(this.selectedLocation);
    };

    document.getElementById('btnActionAccess').onclick = () => {
      if (this.selectedLocation) this.openAccessModal(this.selectedLocation);
    };

    document.getElementById('btnActionHistory').onclick = () => {
      if (this.selectedLocation && this.selectedLocation.historicalId) {
        this.switchToHistoricalAndHighlight(this.selectedLocation.historicalId);
      } else {
        this.setMode('61ah');
      }
    };

    document.getElementById('btnActionNavigate').onclick = () => {
      if (this.selectedLocation) this.openNavigateModal(this.selectedLocation);
    };

    document.getElementById('btnActionSave').onclick = () => {
      this.toggleSaveCurrentLocation();
    };

    document.getElementById('btnWhyApproximate').onclick = () => {
      if (this.selectedLocation && this.selectedLocation.certaintyKey) {
        this.openCertaintyModal(this.selectedLocation.certaintyKey);
      } else {
        this.openCertaintyModal('maqtal_hussain');
      }
    };

    document.getElementById('btnWhyNoticeApprox').onclick = () => {
      this.openCertaintyModal('mukhayam_camp');
    };

    // Timeline player buttons
    document.getElementById('btnPlayTimeline').onclick = () => this.togglePlayTimeline();
    document.getElementById('btnTimelinePrev').onclick = () => this.prevTimelineStep();
    document.getElementById('btnTimelineNext').onclick = () => this.nextTimelineStep();
    document.getElementById('btnPrevEvent').onclick = () => this.prevTimelineStep();
    document.getElementById('btnNextEvent').onclick = () => this.nextTimelineStep();

    // Header buttons
    document.getElementById('btnOpenPersonalities').onclick = () => this.openPersonalitiesModal();
    document.getElementById('btnOpenCertaintyGuide').onclick = () => this.openCertaintyModal('maqtal_hussain');
    document.getElementById('btnOpenSaved').onclick = () => this.openSavedModal();

    // Modal close buttons
    document.getElementById('btnCloseModalCertainty').onclick = () => {
      this.modalCertainty.classList.remove('visible');
      this.modalCertainty.classList.add('hidden');
    };
    document.getElementById('btnCloseModalPersonalities').onclick = () => {
      this.modalPersonalities.classList.remove('visible');
      this.modalPersonalities.classList.add('hidden');
    };
    document.getElementById('btnCloseModalZiyarat').onclick = () => {
      this.modalZiyarat.classList.remove('visible');
      this.modalZiyarat.classList.add('hidden');
    };
    document.getElementById('btnCloseModalAccess').onclick = () => {
      this.modalAccess.classList.remove('visible');
      this.modalAccess.classList.add('hidden');
    };
    document.getElementById('btnCloseModalNavigate').onclick = () => {
      this.modalNavigate.classList.remove('visible');
      this.modalNavigate.classList.add('hidden');
    };
    document.getElementById('btnCloseModalSaved').onclick = () => {
      this.modalSaved.classList.remove('visible');
      this.modalSaved.classList.add('hidden');
    };

    // Personalities filter input
    document.getElementById('personSearchInput').oninput = (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = PERSONALITIES.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.arabicName.includes(q) ||
        (p.epithet && p.epithet.toLowerCase().includes(q)) ||
        (p.role && p.role.toLowerCase().includes(q))
      );
      this.renderPersonalitiesGrid(filtered);
    };

    // Close modals on clicking backdrop
    [this.modalCertainty, this.modalPersonalities, this.modalZiyarat, this.modalAccess, this.modalNavigate, this.modalSaved].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('visible');
          modal.classList.add('hidden');
        }
      });
    });
  }
}

// Instantiate app when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.app = new KarbalaApp();
});
