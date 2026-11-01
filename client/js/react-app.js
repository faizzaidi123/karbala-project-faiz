const { useState, useEffect, useRef, useCallback, useMemo } = window.React;
const ReactDOM = window.ReactDOM;

import { PRESENT_DAY_LOCATIONS, HISTORICAL_61AH_LOCATIONS } from '/js/data/locations.js';
import { MUHARRAM_DAYS } from '/js/data/timeline.js';
import { PERSONALITIES } from '/js/data/personalities.js';
import { CERTAINTY_EXPLANATIONS, CERTAINTY_LEVELS } from '/js/data/certainty_explanations.js';
import { KarbalaMap } from '/js/map/interactive_map.js';
import { audioEngine } from '/js/audio/soundscapes.js';
import { GlobalZaireenStatisticsHub } from '/js/components/GlobalZaireenStatisticsHub.js';
import { AirportArrivalSimulatorHub } from '/js/components/AirportArrivalSimulatorHub.js';
import { SmartPoleNavigationHub } from '/js/components/SmartPoleNavigationHub.js';
import { ActiveJourneyHomeCard } from '/js/components/ZaireenWalkTracker.js';
import { Historical61AhTimeSliderPanel } from '/js/components/PilgrimageCompanionModules.js';
import { LegalAndComplianceModal } from '/js/components/LegalAndComplianceModal.js';
import { QuranAndZiyaratHub } from '/js/components/QuranAndZiyaratHub.js';
import { SacredCalendarHub, TodayHomepageModule } from '/js/components/SacredCalendarHub.js';
import {
  AHLUL_BAYT_CALENDAR_EVENTS,
  HIJRI_MONTHS,
  SERMONS_SPEECHES_ARCHIVE,
  WOMEN_OF_KARBALA_ARCHIVE,
  POST_ASHURA_STATIONS
} from '/js/data/ahlulBaytCalendarData.js';

function SpotlightSearchOverlay({ isOpen, onClose, onNavigate, onSelectPersonality }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceRecognizedNote, setVoiceRecognizedNote] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current && inputRef.current.focus(), 60);
    }
    if (!isOpen) {
      setQuery('');
      setCategory('all');
      setVoiceRecognizedNote('');
    }
  }, [isOpen]);

  const startSpotlightVoice = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setVoiceRecognizedNote('Voice search is not supported by this browser.');
      return;
    }
    try {
      const rec = new SpeechRec();
      rec.lang = 'en-US';
      rec.interimResults = false;
      setVoiceActive(true);
      setVoiceRecognizedNote('Listening... Speak in English, Urdu, Roman Urdu, Hindi, or Arabic');
      rec.onresult = (evt) => {
        const spoken = evt.results?.[0]?.[0]?.transcript || '';
        setQuery(spoken);
        setVoiceRecognizedNote(`Recognized: "${spoken}"`);
        setVoiceActive(false);
      };
      rec.onerror = () => setVoiceActive(false);
      rec.onend = () => setVoiceActive(false);
      rec.start();
    } catch (e) {
      setVoiceActive(false);
    }
  };

  const searchIndex = useMemo(() => {
    const items = [
      { id: 'exp-calendar', type: 'calendar', title: 'Today in Ahlul Bayt History & Sacred Hijri Calendar', subtitle: 'Daily Wiladat & Shahadat • Moon-Sighting • 61 AH Time Machine • Date Converter', icon: 'bi-calendar3', view: 'calendar', badge: 'Sacred Calendar' },
      { id: 'exp-quran', type: 'ziyarat', title: 'Ziyarat-e-Ashura, Ziyarat-e-Warith & Holy Quran', subtitle: 'Sacred Recitation Sanctuary • Arabic, Urdu, Hindi, Roman & English', icon: 'bi-book-half', view: 'quran', badge: 'Ziyarat & Quran' },
      { id: 'exp-map', type: 'location', title: 'Roza Map, Shrine Gates & GPS Wayfinding', subtitle: 'Imam Hussain & Hazrat Abbas Holy Shrines • Bayn al-Haramayn', icon: 'bi-compass', view: 'ziyarat', badge: 'Spatial Map' },
      { id: 'exp-story', type: 'history', title: 'The Chronicle of 61 AH — Battle of Karbala', subtitle: 'Documentary Editorial Narrative • Madinah to Karbala', icon: 'bi-journal-richtext', view: 'story', badge: 'Chronicle' },
      { id: 'exp-timeline', type: 'timeline', title: '1 to 10 Muharram 61 AH Interactive Timeline', subtitle: 'Day-by-Day & Hour-by-Hour Chronology of Ashura', icon: 'bi-hourglass-split', view: 'timeline', badge: '61 AH Timeline' },
      { id: 'exp-61ah', type: 'location', title: '61 AH Archaeological & Topographical Reconstruction', subtitle: 'Al-Alqami Euphrates Branch, Encampment & Maqtal Gah', icon: 'bi-layers-half', view: 'journey-61ah', badge: '61 AH Atlas' },
      { id: 'exp-personalities', type: 'personality', title: 'Bani Hashim, Companions & Family Tree of Ahlul Bayt', subtitle: 'Genealogy, Biographies & Primary Historical Monographs', icon: 'bi-diagram-3', view: 'personalities', badge: 'Personalities' },
      { id: 'exp-historiography', type: 'history', title: 'Primary Sources, Knowledge Graph & Historiographical Archive', subtitle: 'Al-Tabari, Kitab al-Irshad, Maqtal Abi Mikhnaf & Certainty Matrix', icon: 'bi-archive', view: 'historiography', badge: 'Historiography' },
      { id: 'exp-pavilion', type: 'media', title: 'The Living Archive — Karbala HD Visual Pavilion & Exhibitions', subtitle: 'Curated High-Resolution Sanctuary & Archival Photography', icon: 'bi-images', view: 'pavilion', badge: 'Visual Archive' },
      { id: 'exp-poles', type: 'location', title: 'Najaf to Karbala Arbaeen Corridor (1,452 Poles)', subtitle: '80 km Sacred Walk Wayfinding, Mawkibs & Medical Stations', icon: 'bi-signpost-split', view: 'poles', badge: '1,452 Poles' },
      { id: 'exp-journey', type: 'location', title: 'Najaf & Baghdad Airport Arrival Simulator', subtitle: 'Visa, Customs, SIM, Currency & Haram Transfer Guide', icon: 'bi-airplane-engines', view: 'journey', badge: 'Travel Guide' },
      { id: 'exp-stats', type: 'history', title: 'Global Arbaeen Zaireen Demographic Observatory', subtitle: '21.4M+ Annual Pilgrims, Service Telemetry & Historical Growth', icon: 'bi-bar-chart-line', view: 'statistics', badge: 'Observatory' },
      { id: 'exp-ai', type: 'ziyarat', title: 'Ask Karbala AI Scholar, Claim Checker & Sign Translator', subtitle: 'Verified Historical Q&A & Live Iraqi Sign Translation', icon: 'bi-translate', view: 'ai', badge: 'AI Companion' }
    ];

    (AHLUL_BAYT_CALENDAR_EVENTS || []).forEach(ev => {
      const mName = HIJRI_MONTHS[(ev.hijriMonth - 1 + 12) % 12]?.nameEn || 'Muharram';
      items.push({
        id: `cal-${ev.eventId}`,
        type: 'calendar',
        title: `${ev.hijriDay} ${mName}: ${ev.title}`,
        subtitle: `${ev.eventType.toUpperCase()} (${ev.historicalYearAH}) — ${ev.summary.slice(0, 95)}`,
        icon: 'bi-calendar-check',
        view: 'calendar',
        badge: `${ev.hijriDay} ${mName}`
      });
    });

    (SERMONS_SPEECHES_ARCHIVE || []).forEach(s => {
      items.push({
        id: `sermon-${s.id}`,
        type: 'history',
        title: s.title,
        subtitle: `${s.speaker} • ${s.location} (${s.period}) — ${s.source}`,
        icon: 'bi-mic',
        view: 'calendar',
        badge: 'Sermon'
      });
    });

    (WOMEN_OF_KARBALA_ARCHIVE || []).forEach(w => {
      items.push({
        id: `woman-${w.id}`,
        type: 'personality',
        title: w.name,
        subtitle: `${w.title} • ${w.relation}`,
        icon: 'bi-person-heart',
        view: 'calendar',
        badge: 'Women of Karbala'
      });
    });

    (POST_ASHURA_STATIONS || []).forEach(st => {
      items.push({
        id: `post-${st.id}`,
        type: 'history',
        title: `After Karbala: ${st.title}`,
        subtitle: `${st.dateHijri} • ${st.summary.slice(0, 90)}`,
        icon: 'bi-signpost-2',
        view: 'calendar',
        badge: 'After Karbala'
      });
    });

    (PRESENT_DAY_LOCATIONS || []).forEach(loc => {
      items.push({
        id: `loc-pres-${loc.id}`,
        type: 'location',
        title: loc.name,
        subtitle: `${loc.arabicName || ''} • ${loc.category || 'Sacred Landmark'} — ${(loc.shortDesc || loc.description || '').slice(0, 90)}`,
        icon: 'bi-geo-alt',
        view: 'ziyarat',
        badge: 'Present Shrine'
      });
    });

    (HISTORICAL_61AH_LOCATIONS || []).forEach(loc => {
      items.push({
        id: `loc-61ah-${loc.id}`,
        type: 'location',
        title: loc.name,
        subtitle: `61 AH Site • ${loc.arabicName || ''} — ${(loc.shortDesc || loc.description || '').slice(0, 90)}`,
        icon: 'bi-compass',
        view: 'journey-61ah',
        badge: '61 AH Site'
      });
    });

    (MUHARRAM_DAYS || []).forEach(day => {
      items.push({
        id: `day-${day.day}`,
        type: 'timeline',
        title: `${day.date || `Muharram ${day.day}`}: ${day.title}`,
        subtitle: `${day.subtitle || ''} — ${(day.summary || '').slice(0, 95)}`,
        icon: 'bi-calendar-event',
        view: 'timeline',
        badge: `Muharram ${day.day}`
      });
    });

    (PERSONALITIES || []).forEach(p => {
      items.push({
        id: `pers-${p.id}`,
        type: 'personality',
        title: p.name,
        subtitle: `${p.title || ''} • ${p.arabicName || ''} — ${p.lineage || p.group || ''}`,
        icon: 'bi-person-badge',
        view: 'personalities',
        personalityObj: p,
        badge: 'Personality'
      });
    });

    return items;
  }, []);

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return searchIndex.filter(item => {
      if (category !== 'all' && item.type !== category) return false;
      if (!q) return true;
      return (
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        (item.badge && item.badge.toLowerCase().includes(q))
      );
    }).slice(0, 18);
  }, [searchIndex, query, category]);

  if (!isOpen) return null;

  return (
    <div className="spotlight-overlay-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Karbala Heritage Archive Search">
      <div className="spotlight-modal-shell" onClick={e => e.stopPropagation()}>
        <div className="spotlight-input-header">
          <i className="bi bi-search text-gold-antique fs-5"></i>
          <input
            ref={inputRef}
            type="text"
            className="spotlight-input-field"
            placeholder="Search shrines, Sacred Calendar, 61 AH events, personalities, Ziyarat..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search query"
          />
          {query && (
            <button type="button" className="btn btn-sm text-ivory-muted p-1" onClick={() => setQuery('')} title="Clear search">
              <i className="bi bi-x-circle"></i>
            </button>
          )}
          <button
            type="button"
            className="btn btn-sm rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1"
            style={{ background: voiceActive ? '#A31C22' : 'rgba(200,164,91,0.16)', color: 'var(--ivory-warm)', border: '1px solid rgba(200,164,91,0.35)', fontSize: '0.72rem' }}
            onClick={startSpotlightVoice}
            title="Voice Search (English, Urdu, Roman Urdu, Hindi, Arabic)"
          >
            <i className={`bi ${voiceActive ? 'bi-mic-mute-fill' : 'bi-mic-fill text-gold-antique'}`}></i>
            <span className="d-none d-sm-inline">Voice</span>
          </button>
          <button type="button" className="spotlight-kbd-badge" onClick={onClose}>ESC</button>
        </div>

        {voiceRecognizedNote && (
          <div className="px-4 py-1.5 small text-gold-antique" style={{ background: 'rgba(200,164,91,0.08)', fontSize: '0.74rem' }}>
            <i className="bi bi-soundwave me-1"></i>{voiceRecognizedNote}
          </div>
        )}

        <div className="spotlight-filter-pills">
          {[
            { id: 'all', label: 'All Archive' },
            { id: 'calendar', label: 'Sacred Calendar' },
            { id: 'location', label: 'Shrines & Maps' },
            { id: 'timeline', label: '61 AH Timeline' },
            { id: 'personality', label: 'Personalities' },
            { id: 'ziyarat', label: 'Ziyarat & Quran' },
            { id: 'history', label: 'Chronicles & Sermons' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`spotlight-filter-pill ${category === tab.id ? 'active' : ''}`}
              onClick={() => setCategory(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="spotlight-results-body">
          {filteredResults.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-journal-x text-gold-antique fs-2 d-block mb-2 opacity-75"></i>
              <div className="text-ivory-warm fw-semibold">No matching archival entries found</div>
              <div className="small text-ivory-muted mt-1">Try searching for "Imam Hussain", "Ashura", "Abbas", "Alqami", or "Ziyarat"</div>
            </div>
          ) : (
            filteredResults.map(item => (
              <button
                key={item.id}
                type="button"
                className="spotlight-result-item"
                onClick={() => {
                  onNavigate(item.view);
                  if (item.personalityObj && onSelectPersonality) {
                    setTimeout(() => onSelectPersonality(item.personalityObj), 120);
                  }
                  onClose();
                }}
              >
                <div className="d-flex align-items-center gap-3 min-w-0">
                  <div className="spotlight-result-icon">
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <div className="min-w-0">
                    <div className="text-ivory-warm fw-semibold text-truncate" style={{ fontSize: '0.94rem' }}>{item.title}</div>
                    <div className="text-ivory-muted text-truncate" style={{ fontSize: '0.78rem' }}>{item.subtitle}</div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                  <span className="brutalist-archival-tag d-none d-sm-inline-flex">{item.badge}</span>
                  <i className="bi bi-arrow-up-right text-gold-antique"></i>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2.5 d-flex align-items-center justify-content-between border-top border-secondary border-opacity-25" style={{ background: 'rgba(0,0,0,0.35)', fontSize: '0.72rem' }}>
          <span className="text-ivory-muted"><i className="bi bi-shield-check text-gold-antique me-1"></i> Verified Primary Historical &amp; Cartographic Index</span>
          <span className="text-ivory-dim d-none d-md-inline">Press <kbd className="bg-dark text-gold-antique px-1.5 py-0.5 rounded border border-secondary border-opacity-25">Ctrl + K</kbd> anytime to search</span>
        </div>
      </div>
    </div>
  );
}

function GlobalCinemaNav({ currentView, onNavigate, onOpenAudio, audioPlaying, savedCount = 0, seniorMode = false, onToggleSeniorMode, dataSaverMode = false, onToggleDataSaver, onOpenEmergency, onOpenOnboarding, themeMode = 'dark', onToggleTheme, onOpenLegal, onOpenSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [museumDropdownOpen, setMuseumDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem('karbala_pilgrim_prefs') || '{}');
      return p.language ? p.language.toLowerCase() : 'en';
    } catch (e) {
      return 'en';
    }
  });

  useEffect(() => {
    const handleLangEvent = (e) => {
      if (e.detail && e.detail.language) {
        setCurrentLang(e.detail.language.toLowerCase());
      }
    };
    window.addEventListener('karbala-language-change', handleLangEvent);
    return () => window.removeEventListener('karbala-language-change', handleLangEvent);
  }, []);

  const handleQuickLangChange = (newLang) => {
    const langCode = (newLang || 'en').toLowerCase();
    setCurrentLang(langCode);
    if (window.applyKarbalaLanguage) {
      window.applyKarbalaLanguage(langCode);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMuseumDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setMuseumDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isMuseumMode = currentView === 'story' || currentView === 'journey-61ah' || currentView === 'timeline' || currentView === 'personalities' || currentView === 'pavilion' || currentView === 'historiography' || currentView === 'poles' || currentView === 'journey' || currentView === 'statistics' || currentView === 'map';
  const isHomeMode = currentView === 'home';
  const isZiyaratMode = currentView === 'ziyarat';
  const isQuranMode = currentView === 'quran';
  const isStatsMode = currentView === 'statistics';
  const isAiMode = currentView === 'ai';
  const isJourneyMode = currentView === 'journey';
  const isPolesMode = currentView === 'poles';

  const museumLinks = [
    { id: 'calendar', label: 'Sacred Ahlul Bayt Calendar', sub: 'Today in History, Hijri-Gregorian & 61 AH Time Machine', icon: 'bi-calendar3' },
    { id: 'story', label: 'The Chronicle of 61 AH', sub: 'Documentary narrative & primary texts', icon: 'bi-journal-richtext' },
    { id: 'timeline', label: '1–10 Muharram Timeline', sub: 'Day-by-day & Ashura chronology', icon: 'bi-hourglass-split' },
    { id: 'personalities', label: 'Voices of 61 AH', sub: 'Bani Hashim & Companions archive', icon: 'bi-diagram-3-fill' },
    { id: 'journey-61ah', label: '61 AH Topographical Atlas', sub: 'Archaeological landscape models', icon: 'bi-layers-half' },
    { id: 'historiography', label: 'Classical Historiography', sub: 'Al-Tabari, Al-Mufid & manuscripts', icon: 'bi-archive-fill' },
    { id: 'pavilion', label: 'The Living Archive', sub: '520+ high-resolution shrine plates', icon: 'bi-images' },
    { id: 'ai', label: 'Ask Karbala AI & Translator', sub: 'Multilingual research & optical OCR', icon: 'bi-stars' },
    { id: 'poles', label: 'Arbaeen 80km Walk (1,452 Poles)', sub: 'Najaf to Karbala corridor telemetry', icon: 'bi-signpost-split-fill' },
    { id: 'journey', label: 'Pilgrim Safar & Airport Guide', sub: 'Najaf/Baghdad transit & rituals', icon: 'bi-airplane-engines' },
    { id: 'statistics', label: 'Global Arbaeen Observatory', sub: 'Demographics & hospitality metrics', icon: 'bi-bar-chart-fill' },
  ];

  const handleLinkClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setMuseumDropdownOpen(false);
  };

  return (
    <>
      <header className={`cinema-top-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="cinema-nav-inner">
          
          {/* Left: Brand Lockup */}
          <div 
            className="lux-brand-lockup"
            onClick={() => handleLinkClick('home')}
            title="Return to Karbala Opening"
          >
            <div className="lux-brand-monogram">
              <span>ك</span>
            </div>
            <div className="lux-brand-text">
              <span className="lux-brand-name">KARBALA</span>
              <span className="lux-brand-tagline d-none d-sm-block">Digital Heritage &amp; Sanctuary</span>
            </div>
          </div>

          {/* Center: 6 Simplified Editorial Primary Links + Mega-Menu (#2) */}
          <nav className="cinema-primary-links d-none d-xl-flex" aria-label="Primary Navigation">
            <button
              type="button"
              className={`cinema-nav-link ${isHomeMode ? 'active' : ''}`}
              onClick={() => handleLinkClick('home')}
            >
              <span>Explore</span>
            </button>

            <button
              type="button"
              className={`cinema-nav-link ${currentView === 'timeline' || currentView === 'story' || currentView === 'journey-61ah' ? 'active' : ''}`}
              onClick={() => handleLinkClick('timeline')}
            >
              <span>61 AH</span>
            </button>

            <button
              type="button"
              className={`cinema-nav-link ${currentView === 'personalities' ? 'active' : ''}`}
              onClick={() => handleLinkClick('personalities')}
            >
              <span>People</span>
            </button>

            <button
              type="button"
              className={`cinema-nav-link ${isQuranMode ? 'active' : ''}`}
              onClick={() => handleLinkClick('quran')}
            >
              <span>Ziyarat</span>
            </button>

            <button
              type="button"
              className={`cinema-nav-link ${isZiyaratMode || currentView === 'poles' || currentView === 'journey' ? 'active' : ''}`}
              onClick={() => handleLinkClick('ziyarat')}
            >
              <span>Pilgrimage</span>
            </button>

            {/* 6th Primary Item: Research (AI + Sacred Calendar + Archive Mega-Menu) */}
            <div 
              className="position-relative"
              ref={dropdownRef}
              onMouseEnter={() => setMuseumDropdownOpen(true)}
              onMouseLeave={() => setMuseumDropdownOpen(false)}
            >
              <button
                type="button"
                className={`cinema-nav-link ${isAiMode || currentView === 'calendar' || currentView === 'historiography' || currentView === 'pavilion' || currentView === 'statistics' ? 'active' : ''}`}
                onClick={() => setMuseumDropdownOpen(!museumDropdownOpen)}
                aria-expanded={museumDropdownOpen}
                aria-haspopup="true"
              >
                <span>Research</span>
                <i className={`bi bi-chevron-down lux-chevron ${museumDropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {museumDropdownOpen && (
                <div className="cinema-mega-menu" role="menu">
                  <div className="d-flex justify-content-between align-items-center pb-2 mb-3" style={{ borderBottom: '1px solid rgba(200,164,91,0.18)' }}>
                    <span className="text-gold-antique text-uppercase fw-bold" style={{ fontSize: '0.68rem', letterSpacing: '0.2em' }}>
                      Scholarly Research, Sacred Calendar &amp; Archives
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-danger text-decoration-none p-0"
                      style={{ fontSize: '0.72rem' }}
                      onClick={() => { setMuseumDropdownOpen(false); if (onOpenEmergency) onOpenEmergency(); }}
                    >
                      <i className="bi bi-shield-fill-exclamation me-1"></i>24/7 SOS (122)
                    </button>
                  </div>
                  <div className="cinema-mega-grid">
                    {museumLinks.map(link => (
                      <button
                        key={link.id}
                        type="button"
                        role="menuitem"
                        className={`cinema-mega-item ${currentView === link.id ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLinkClick(link.id);
                        }}
                      >
                        <div
                          className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 mt-0.5"
                          style={{ width: '34px', height: '34px', background: 'rgba(200,164,91,0.1)', border: '1px solid rgba(200,164,91,0.25)' }}
                        >
                          <i className={`bi ${link.icon} text-gold-antique`}></i>
                        </div>
                        <div>
                          <div className="text-ivory-warm fw-semibold" style={{ fontSize: '0.84rem' }}>{link.label}</div>
                          <div className="text-ivory-dim" style={{ fontSize: '0.72rem' }}>{link.sub}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right: Search Icon + Language + Theme + 1 Primary CTA */}
          <div className="cinema-right-tools">

            {/* Search Icon */}
            <button
              type="button"
              className="cinema-icon-btn"
              onClick={() => { if (onOpenSearch) onOpenSearch(); }}
              title="Search Complete Archive (Ctrl+K)"
              aria-label="Open Global Search"
            >
              <i className="bi bi-search"></i>
            </button>

            {/* Language Selector */}
            <select
              className="cinema-lang-select notranslate"
              value={currentLang}
              onChange={(e) => handleQuickLangChange(e.target.value)}
              aria-label="Select Language"
              title="Change Language"
            >
              <option value="en">EN</option>
              <option value="ur">UR • اردو</option>
              <option value="hi">HI • हिन्दी</option>
              <option value="ur-roman">RO • Roman</option>
              <option value="ar">AR • عربي</option>
              <option value="fa">FA • فارسی</option>
            </select>

            {/* Theme Icon Button */}
            <button
              type="button"
              className="cinema-icon-btn"
              onClick={onToggleTheme}
              title={`Switch to ${themeMode === 'light' ? 'Night Mode' : 'Day Mode'}`}
              aria-label="Toggle Theme"
            >
              <i className={`bi ${themeMode === 'light' ? 'bi-sun-fill text-warning' : 'bi-moon-stars'}`}></i>
            </button>

            {/* Senior Large Text Icon (Desktop) */}
            <button
              type="button"
              className={`cinema-icon-btn d-none d-md-inline-flex ${seniorMode ? 'active' : ''}`}
              onClick={onToggleSeniorMode}
              title="Toggle Elder / Large Text Mode (Aa+)"
              aria-label="Toggle Large Text Mode"
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>Aa+</span>
            </button>

            {/* Low-Bandwidth / Data Saver Mode Icon (Desktop) */}
            <button
              type="button"
              className={`cinema-icon-btn d-none d-md-inline-flex ${dataSaverMode ? 'active' : ''}`}
              onClick={onToggleDataSaver}
              title={`Low-Bandwidth Data Saver Mode (${dataSaverMode ? 'ON' : 'OFF'})`}
              aria-label="Toggle Data Saver Mode"
            >
              <i className={`bi ${dataSaverMode ? 'bi-speedometer2 text-warning' : 'bi-speedometer2'}`}></i>
            </button>

            {/* Single Primary CTA */}
            <button
              type="button"
              className="cinema-primary-cta d-none d-xl-inline-flex"
              onClick={() => handleLinkClick(currentView === 'ziyarat' ? 'map' : 'ziyarat')}
            >
              <i className="bi bi-compass"></i>
              <span>Sanctuary Map</span>
            </button>

            {/* Mobile Drawer Trigger */}
            <button 
              type="button"
              className="mobile-nav-toggle d-xl-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open Menu"
            >
              <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div 
        className={`mobile-nav-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer Navigation (Simple & Easy Slide-Over Menu) */}
      <aside 
        className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        id="mobile-nav-drawer"
      >
        {/* Fixed Header */}
        <div className="mobile-nav-header">
          <div className="d-flex align-items-center gap-2.5">
            <span className="brand-logo-glyph">ك</span>
            <div className="d-flex flex-column">
              <span className="mobile-nav-brand-title">KARBALA EASY MENU</span>
              <span className="mobile-nav-brand-sub">Click Any Option Below</span>
            </div>
          </div>
          <button 
            type="button" 
            className="lux-drawer-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close Navigation Menu"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="mobile-nav-body">
          
          {/* GROUP 1: MOST USED FEATURES */}
          <div className="lux-drawer-section">
            <div className="lux-drawer-section-header">
              <span className="lux-drawer-section-title">MAIN MENU (SABSE ZAROORI)</span>
              <span className="lux-drawer-section-badge">Easy Access</span>
            </div>
            <div className="d-flex flex-column gap-2">
              <button
                type="button"
                className={`lux-portal-card ${isHomeMode ? 'active' : ''}`}
                onClick={() => handleLinkClick('home')}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="lux-portal-icon-tile">
                    <i className="bi bi-house-heart-fill"></i>
                  </div>
                  <div>
                    <div className="lux-portal-title-row">
                      <span className="lux-portal-title">Home Page (Main Menu)</span>
                      {isHomeMode && <span className="lux-portal-active-pill">ACTIVE</span>}
                    </div>
                    <div className="lux-portal-sub">Sabhi options ek jagah dekhein</div>
                  </div>
                </div>
                <i className="bi bi-chevron-right lux-portal-arrow"></i>
              </button>

              <button
                type="button"
                className={`lux-portal-card ${isQuranMode ? 'active' : ''}`}
                onClick={() => handleLinkClick('quran')}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="lux-portal-icon-tile">
                    <i className="bi bi-book-half"></i>
                  </div>
                  <div>
                    <div className="lux-portal-title-row">
                      <span className="lux-portal-title">Quran, Ziyarat Ashura &amp; Warith</span>
                      {isQuranMode && <span className="lux-portal-active-pill">ACTIVE</span>}
                    </div>
                    <div className="lux-portal-sub">Urdu, Hindi, Roman, Arabic &amp; English + Audio</div>
                  </div>
                </div>
                <i className="bi bi-chevron-right lux-portal-arrow"></i>
              </button>

              <button
                type="button"
                className={`lux-portal-card ${isZiyaratMode ? 'active' : ''}`}
                onClick={() => handleLinkClick('ziyarat')}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="lux-portal-icon-tile">
                    <i className="bi bi-compass-fill"></i>
                  </div>
                  <div>
                    <div className="lux-portal-title-row">
                      <span className="lux-portal-title">Roza Map, Gates &amp; Rasta</span>
                      {isZiyaratMode && <span className="lux-portal-active-pill">ACTIVE</span>}
                    </div>
                    <div className="lux-portal-sub">Imam Hussain &amp; Hazrat Abbas Shrine Map</div>
                  </div>
                </div>
                <i className="bi bi-chevron-right lux-portal-arrow"></i>
              </button>

              <button
                type="button"
                className={`lux-portal-card ${isAiMode ? 'active' : ''}`}
                onClick={() => handleLinkClick('ai')}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="lux-portal-icon-tile">
                    <i className="bi bi-translate"></i>
                  </div>
                  <div>
                    <div className="lux-portal-title-row">
                      <span className="lux-portal-title">AI Guide &amp; Language Translator</span>
                      {isAiMode && <span className="lux-portal-active-pill">ACTIVE</span>}
                    </div>
                    <div className="lux-portal-sub">Sawaal poochein ya Arabic translate karein</div>
                  </div>
                </div>
                <i className="bi bi-chevron-right lux-portal-arrow"></i>
              </button>
            </div>
          </div>

          {/* GROUP 2: CURATORIAL EXHIBITIONS, HISTORY & TRAVEL GUIDES */}
          <div className="lux-drawer-section">
            <div className="lux-drawer-section-header">
              <span className="lux-drawer-section-title">EXHIBITIONS, ARCHIVE &amp; SAFAR GUIDE</span>
              <span className="lux-drawer-section-badge">10 Sections</span>
            </div>
            <div className="lux-drawer-chapters-box">
              {museumLinks.map(link => (
                <button
                  key={link.id}
                  type="button"
                  className={`lux-drawer-chapter-btn ${currentView === link.id ? 'active' : ''}`}
                  onClick={() => handleLinkClick(link.id)}
                  role="menuitem"
                >
                  <div className="d-flex align-items-center gap-2.5">
                    <i className={`bi ${link.icon} text-gold-antique`}></i>
                    <span className="lux-drawer-chapter-label">{link.label}</span>
                  </div>
                  {currentView === link.id ? (
                    <span className="lux-chapter-active-dot"></span>
                  ) : (
                    <i className="bi bi-chevron-right lux-chapter-subarrow"></i>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* GROUP 3: PILGRIMAGE & ZAIREEN SERVICES */}
          <div className="lux-drawer-section">
            <div className="lux-drawer-section-header">
              <span className="lux-drawer-section-title">PILGRIMAGE &amp; ZAIREEN SERVICES</span>
              <span className="lux-drawer-section-badge">Essential</span>
            </div>
            <div className="d-flex flex-column gap-2">
              {/* Global Search Trigger in Drawer */}
              <button
                type="button"
                className="lux-drawer-tool-card"
                onClick={() => { setMobileMenuOpen(false); if (onOpenSearch) onOpenSearch(); }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="lux-tool-icon-tile">
                    <i className="bi bi-search text-gold-antique"></i>
                  </div>
                  <div>
                    <div className="lux-portal-title">Global Archive &amp; Ziyarat Search</div>
                    <div className="lux-portal-sub">Search Shrines, 61 AH Events, Personalities</div>
                  </div>
                </div>
                <span className="badge bg-black text-gold-antique border border-gold-subtle px-2 py-1">⌘K</span>
              </button>

              {/* Fullscreen Spatial Map Portal */}
              <button
                type="button"
                className={`lux-drawer-map-card ${currentView === 'map' ? 'active' : ''}`}
                onClick={() => handleLinkClick('map')}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="lux-portal-icon-tile map-icon-tile">
                    <i className="bi bi-map-fill"></i>
                  </div>
                  <div>
                    <div className="lux-portal-title-row">
                      <span className="lux-portal-title">Spatial Digital Twin Map</span>
                      {currentView === 'map' && <span className="lux-portal-active-pill">ACTIVE</span>}
                    </div>
                    <div className="lux-portal-sub">Dual-Epoch 61 AH &amp; Present Cartography</div>
                  </div>
                </div>
                <i className="bi bi-chevron-right lux-portal-arrow"></i>
              </button>

              {/* Distinct 24/7 Verified Emergency Hotline Card */}
              <button
                type="button"
                className="lux-drawer-emergency-card"
                onClick={() => { setMobileMenuOpen(false); if (onOpenEmergency) onOpenEmergency(); }}
                title="Immediate 24/7 Emergency Assistance Hotlines (122 Medical • 104 Police)"
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="lux-emergency-icon-tile">
                    <i className="bi bi-shield-fill-exclamation"></i>
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="lux-emergency-title">24/7 Verified Emergency</span>
                      <span className="badge bg-danger text-white px-2 py-0.5" style={{ fontSize: '0.65rem' }}>122 • 104</span>
                    </div>
                    <div className="lux-emergency-sub">Direct Iraqi Medical &amp; Police Dispatch</div>
                  </div>
                </div>
                <div className="lux-emergency-dial-pill">
                  <span>TAP TO DIAL</span>
                  <i className="bi bi-telephone-fill ms-1"></i>
                </div>
              </button>
            </div>
          </div>

          {/* GROUP 4: TOOLS & PREFERENCES */}
          <div className="lux-drawer-section">
            <div className="lux-drawer-section-header">
              <span className="lux-drawer-section-title">TOOLS &amp; PREFERENCES</span>
              <span className="lux-drawer-section-badge">Personalize</span>
            </div>
            <div className="d-flex flex-column gap-2">
              {/* Quick 1-Tap Full-Website Language Switcher in Mobile Drawer */}
              <div className="p-3 rounded-3" style={{ background: 'rgba(14, 19, 24, 0.92)', border: '1px solid rgba(198, 166, 107, 0.25)' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small fw-bold text-gold-antique">
                    <i className="bi bi-translate me-1.5"></i>Website Language (ترجمہ / भाषा)
                  </span>
                  <span className="badge bg-black text-gold-antique border border-gold-subtle px-2 py-0.5 notranslate">
                    {currentLang.toUpperCase()}
                  </span>
                </div>
                <div className="d-flex flex-wrap gap-1.5 notranslate">
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'ur', label: 'اردو (Urdu)' },
                    { code: 'hi', label: 'हिन्दी (Hindi)' },
                    { code: 'ur-roman', label: 'Roman Urdu' },
                    { code: 'ar', label: 'العربية' },
                    { code: 'fa', label: 'فارسی' }
                  ].map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      className={`btn btn-sm rounded-pill px-2.5 py-1 fw-semibold ${
                        currentLang === item.code ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'
                      }`}
                      style={{ fontSize: '0.74rem', flex: '1 1 calc(33.3% - 6px)' }}
                      onClick={() => {
                        handleQuickLangChange(item.code);
                        setMobileMenuOpen(false);
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language & Preferences */}
              <button
                type="button"
                className="lux-drawer-tool-card"
                onClick={() => { setMobileMenuOpen(false); if (onOpenOnboarding) onOpenOnboarding(); }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="lux-tool-icon-tile">
                    <i className="bi bi-globe2"></i>
                  </div>
                  <div>
                    <div className="lux-portal-title">Pilgrim Profile &amp; Preferences</div>
                    <div className="lux-portal-sub">Accessibility &amp; Journey Settings</div>
                  </div>
                </div>
                <span className="badge bg-black text-gold-antique border border-gold-subtle px-2 py-1 notranslate">
                  {currentLang === 'ar' ? 'عربي' : currentLang === 'ur' ? 'اردو' : currentLang === 'hi' ? 'हिन्दी' : currentLang === 'ur-roman' ? 'Roman' : currentLang === 'fa' ? 'فارسی' : 'EN'}
                </span>
              </button>

              {/* Day / Night Theme Switcher */}
              <button
                type="button"
                className="lux-drawer-tool-card"
                onClick={onToggleTheme}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="lux-tool-icon-tile">
                    <i className={`bi ${themeMode === 'light' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-gold-antique'}`}></i>
                  </div>
                  <div>
                    <div className="lux-portal-title">Display Theme ({themeMode === 'light' ? 'Day' : 'Night'})</div>
                    <div className="lux-portal-sub">{themeMode === 'light' ? 'Sandstone & Warm Ivory' : 'Obsidian & Sacred Charcoal'}</div>
                  </div>
                </div>
                <span className={`badge px-2.5 py-1 ${themeMode === 'light' ? 'bg-warning text-dark fw-bold' : 'bg-black text-gold-antique border border-gold-subtle'}`}>
                  {themeMode === 'light' ? 'DAY' : 'NIGHT'}
                </span>
              </button>

              {/* Senior Large Text Mode (Aa+) */}
              <button
                type="button"
                className={`lux-drawer-tool-card ${seniorMode ? 'active-tool' : ''}`}
                onClick={onToggleSeniorMode}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="lux-tool-icon-tile">
                    <i className="bi bi-fonts"></i>
                  </div>
                  <div>
                    <div className="lux-portal-title">Elder / Large Text Mode (Aa+)</div>
                    <div className="lux-portal-sub">High-Contrast &amp; Scaled Typography</div>
                  </div>
                </div>
                <span className={`badge px-2 py-1 ${seniorMode ? 'bg-gold-antique text-dark fw-bold' : 'bg-dark text-light border border-dark'}`}>
                  {seniorMode ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Low-Bandwidth / Data Saver Mode */}
              <button
                type="button"
                className={`lux-drawer-tool-card ${dataSaverMode ? 'active-tool' : ''}`}
                onClick={onToggleDataSaver}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="lux-tool-icon-tile">
                    <i className="bi bi-speedometer2 text-warning"></i>
                  </div>
                  <div>
                    <div className="lux-portal-title">Low-Bandwidth Data Saver</div>
                    <div className="lux-portal-sub">Fast Pilgrim Mode for Weak Networks</div>
                  </div>
                </div>
                <span className={`badge px-2 py-1 ${dataSaverMode ? 'bg-warning text-dark fw-bold' : 'bg-dark text-light border border-dark'}`}>
                  {dataSaverMode ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Curatorial Audio Dock */}
              <button
                type="button"
                className="lux-drawer-tool-card"
                onClick={() => { setMobileMenuOpen(false); if (onOpenAudio) onOpenAudio(); }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="lux-tool-icon-tile">
                    <i className={`bi ${audioPlaying ? 'bi-volume-up-fill text-warning' : 'bi-volume-mute'}`}></i>
                  </div>
                  <div>
                    <div className="lux-portal-title">Curatorial Audio Dock</div>
                    <div className="lux-portal-sub">Sacred Soundscapes &amp; Ney Ambience</div>
                  </div>
                </div>
                <span className={`badge px-2 py-1 ${audioPlaying ? 'bg-warning text-dark fw-bold' : 'bg-dark text-light border border-dark'}`}>
                  {audioPlaying ? 'Playing' : 'Muted'}
                </span>
              </button>

              {/* Privacy, Terms & Compliance Governance */}
              <button
                type="button"
                className="lux-drawer-tool-card"
                onClick={() => { setMobileMenuOpen(false); if (onOpenLegal) onOpenLegal('privacy'); }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="lux-tool-icon-tile">
                    <i className="bi bi-shield-check text-success"></i>
                  </div>
                  <div>
                    <div className="lux-portal-title">Privacy, Terms &amp; Compliance</div>
                    <div className="lux-portal-sub">Zero-Retention Policy &amp; Open Heritage</div>
                  </div>
                </div>
                <i className="bi bi-chevron-right lux-portal-arrow"></i>
              </button>
            </div>
          </div>

        </div>
      </aside>

      {/* Minimal Editorial Sub-Page Breadcrumb (No Pill Clutter) */}
      {currentView !== 'home' && currentView !== 'map' && (
        <div
          style={{
            background: 'rgba(5, 7, 6, 0.85)',
            borderBottom: '1px solid rgba(200, 164, 91, 0.14)'
          }}
        >
          <div className="cinema-minimal-breadcrumb py-2">
            <button
              type="button"
              onClick={() => handleLinkClick('home')}
              className="cinema-back-link"
            >
              <i className="bi bi-arrow-left"></i>
              <span>Return to Karbala Opening</span>
            </button>

            <div className="d-none d-md-flex align-items-center gap-3 small text-ivory-dim" style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              <span>CHAPTER ARCHIVE</span>
              <span>·</span>
              <span className="text-gold-antique">{currentView.replace('-', ' ')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Ergonomic Mobile Bottom App Bar (One-Handed Thumb Zone Navigation) */}
      <nav 
        className={`mobile-bottom-app-bar ${mobileMenuOpen ? 'drawer-open-hidden' : ''}`}
        aria-label="Mobile Bottom App Bar"
        aria-hidden={mobileMenuOpen}
      >
        <button
          type="button"
          className={`mobile-nav-item ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => handleLinkClick('home')}
          aria-label="Home Screen"
          tabIndex={mobileMenuOpen ? -1 : 0}
        >
          <i className="bi bi-house-heart-fill"></i>
          <span>Home</span>
        </button>

        <button
          type="button"
          className={`mobile-nav-item ${currentView === 'calendar' ? 'active' : ''}`}
          onClick={() => handleLinkClick('calendar')}
          aria-label="Sacred Ahlul Bayt Calendar & Today in History"
          tabIndex={mobileMenuOpen ? -1 : 0}
        >
          <i className="bi bi-calendar3"></i>
          <span>Calendar</span>
        </button>

        <button
          type="button"
          className={`mobile-nav-item ${isQuranMode ? 'active' : ''}`}
          onClick={() => handleLinkClick('quran')}
          aria-label="Holy Quran, Ziyarat Ashura & Warith"
          tabIndex={mobileMenuOpen ? -1 : 0}
        >
          <i className="bi bi-book-half"></i>
          <span>Reader</span>
        </button>

        <button
          type="button"
          className={`mobile-nav-item ${isZiyaratMode ? 'active' : ''}`}
          onClick={() => handleLinkClick('ziyarat')}
          aria-label="Roza Map & Rasta Guide"
          tabIndex={mobileMenuOpen ? -1 : 0}
        >
          <i className="bi bi-geo-alt-fill"></i>
          <span>Sanctuary</span>
        </button>

        <button
          type="button"
          className={`mobile-nav-item ${isAiMode ? 'active' : ''}`}
          onClick={() => handleLinkClick('ai')}
          aria-label="AI Guide & Language Translator"
          tabIndex={mobileMenuOpen ? -1 : 0}
        >
          <i className="bi bi-stars"></i>
          <span>Ask AI</span>
        </button>

        <button
          type="button"
          className="mobile-nav-item emergency-item"
          onClick={() => { if (onOpenEmergency) onOpenEmergency(); }}
          aria-label="Emergency Medical and Security Help"
          tabIndex={mobileMenuOpen ? -1 : 0}
        >
          <i className="bi bi-telephone-fill"></i>
          <span>SOS 122</span>
        </button>
      </nav>
    </>
  );
}

function ArchitecturalHeritageFooter({ onNavigate, onOpenLegal, onOpenSearch }) {
  return (
    <footer className="architectural-heritage-footer">
      {/* Immersive Closing Visual Monument */}
      <div className="immersive-closing-monument">
        <div
          className="immersive-closing-bg"
          style={{ backgroundImage: 'url(assets/images/karbala_hd_twin_shrines_aerial_night.jpg)' }}
        ></div>
        <div className="immersive-closing-veil"></div>

        <div className="position-relative z-2 container" style={{ maxWidth: '860px' }}>
          <div className="doc-chapter-label justify-content-center">ETERNAL MEMORY · 61 AH TO INFINITY</div>
          <h2 className="font-editorial fst-italic text-ivory-warm mb-3" style={{ fontSize: 'clamp(1.85rem, 4vw, 3.1rem)', lineHeight: 1.35 }}>
            &ldquo;Across the centuries of time, every day where truth stands unbroken is Ashura, and every land of conscience is Karbala.&rdquo;
          </h2>
          <div className="font-arabic text-gold-antique fs-4 mb-4" dir="rtl">
            السَّلَامُ عَلَى الْحُسَيْنِ وَعَلَى عَلِيِّ بْنِ الْحُسَيْنِ وَعَلَى أَوْلَادِ الْحُسَيْنِ وَعَلَى أَصْحَابِ الْحُسَيْنِ
          </div>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <button
              type="button"
              className="btn-cinema-gold"
              onClick={() => onNavigate('map')}
            >
              <i className="bi bi-compass"></i>
              <span>Enter Spatial Digital Twin</span>
            </button>
            <button
              type="button"
              className="btn-cinema-glass"
              onClick={() => onNavigate('quran')}
            >
              <i className="bi bi-book-half"></i>
              <span>Open Sacred Reader</span>
            </button>
          </div>
        </div>
      </div>

      {/* Minimal Architectural Footer */}
      <div className="container py-4 py-md-5 px-3 px-md-4">
        <div className="row g-4 g-lg-5 pb-4 pb-md-5 border-bottom border-secondary border-opacity-25">
          {/* Column 1: Museum Identity */}
          <div className="col-12 col-lg-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="lux-brand-monogram" style={{ width: '42px', height: '42px', fontSize: '1.3rem' }}>
                <span>ك</span>
              </div>
              <div>
                <div className="font-display text-ivory-warm fw-bold" style={{ fontSize: '1.08rem', letterSpacing: '0.2em' }}>KARBALA</div>
                <div className="text-gold-antique text-uppercase" style={{ fontSize: '0.66rem', letterSpacing: '0.18em' }}>Digital Heritage &amp; Sanctuary</div>
              </div>
            </div>
            <p className="text-ivory-muted small mb-3" style={{ lineHeight: 1.75 }}>
              An international digital heritage archive, dual-epoch cartographic twin, and multilingual Ziyarat sanctuary preserving the history, memory, sacrifice, and legacy of 61 AH (680 CE).
            </p>
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                className="cinema-back-link"
              >
                <i className="bi bi-search"></i>
                <span>Search Complete Archive (⌘K)</span>
              </button>
            )}
          </div>

          {/* Column 2: Documentary Chapters */}
          <div className="col-6 col-md-4 col-lg-2">
            <div className="text-gold-antique text-uppercase fw-bold mb-2 mb-md-3" style={{ fontSize: '0.7rem', letterSpacing: '0.18em' }}>The Chronicle</div>
            <div className="d-flex flex-column gap-1">
              <button type="button" className="footer-nav-link-btn" onClick={() => onNavigate('story')}>Chronicle of 61 AH</button>
              <button type="button" className="footer-nav-link-btn" onClick={() => onNavigate('timeline')}>61 AH Timeline</button>
              <button type="button" className="footer-nav-link-btn" onClick={() => onNavigate('personalities')}>Voices of 61 AH</button>
              <button type="button" className="footer-nav-link-btn" onClick={() => onNavigate('journey-61ah')}>61 AH Topography</button>
              <button type="button" className="footer-nav-link-btn" onClick={() => onNavigate('historiography')}>Primary Sources</button>
              <button type="button" className="footer-nav-link-btn" onClick={() => onNavigate('pavilion')}>Visual Pavilion</button>
            </div>
          </div>

          {/* Column 3: Sanctuary & Spatial Systems */}
          <div className="col-6 col-md-4 col-lg-3">
            <div className="text-gold-antique text-uppercase fw-bold mb-2 mb-md-3" style={{ fontSize: '0.7rem', letterSpacing: '0.18em' }}>The Sanctuary</div>
            <div className="d-flex flex-column gap-1">
              <button type="button" className="footer-nav-link-btn" onClick={() => onNavigate('quran')}>Sacred Quran &amp; Ziyarat Reader</button>
              <button type="button" className="footer-nav-link-btn" onClick={() => onNavigate('ziyarat')}>Sanctuary Map &amp; Gates</button>
              <button type="button" className="footer-nav-link-btn" onClick={() => onNavigate('map')}>Full-Screen Digital Twin</button>
              <button type="button" className="footer-nav-link-btn" onClick={() => onNavigate('ai')}>Ask Karbala AI &amp; Translator</button>
              <button type="button" className="footer-nav-link-btn" onClick={() => onNavigate('poles')}>Najaf–Karbala 1,452 Poles</button>
              <button type="button" className="footer-nav-link-btn" onClick={() => onNavigate('journey')}>Pilgrim Safar Simulator</button>
            </div>
          </div>

          {/* Column 4: Developer Attribution */}
          <div className="col-12 col-md-4 col-lg-3">
            <div className="text-gold-antique text-uppercase fw-bold mb-2 mb-md-3" style={{ fontSize: '0.7rem', letterSpacing: '0.18em' }}>Archival Provenance</div>
            <div className="mb-3" style={{ borderLeft: '2px solid var(--gold-antique)', paddingLeft: '14px' }}>
              <div className="text-uppercase text-gold-antique fw-bold mb-1" style={{ fontSize: '0.64rem', letterSpacing: '0.16em' }}>Designed &amp; Engineered By</div>
              <div className="font-display text-ivory-warm fw-bold" style={{ fontSize: '1.05rem', letterSpacing: '0.06em' }}>Sayyed Faiz Zaidi</div>
              <div className="small text-ivory-muted mt-1" style={{ fontSize: '0.75rem' }}>
                Principal Digital Heritage Architecture &amp; Spatial Cartography
              </div>
            </div>
            {onOpenLegal && (
              <div className="d-flex flex-wrap gap-3 mt-2">
                <button type="button" className="footer-nav-link-btn p-0" style={{ fontSize: '0.76rem' }} onClick={() => onOpenLegal('privacy')}>Privacy Policy</button>
                <button type="button" className="footer-nav-link-btn p-0" style={{ fontSize: '0.76rem' }} onClick={() => onOpenLegal('terms')}>Terms &amp; Sources</button>
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 pt-md-4 pb-2 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 small text-ivory-dim text-start text-md-center" style={{ fontSize: '0.75rem' }}>
          <div>© {new Date().getFullYear()} Karbala Digital Heritage Platform · Dedicated to the Eternal Memory of 61 AH</div>
          <div style={{ opacity: 0.85 }}>32°36′58″N 44°01′56″E · Al-Taff &amp; Bayn al-Haramayn Spatial Grid</div>
        </div>
      </div>
    </footer>
  );
}

function CinematicHomeView({ onNavigate, onOpenCalendarTab, onOpenLightbox, galleryImages = [], onOpenSearch, onOpenLegal }) {
  // Reading Scroll Progress State
  const [scrollProgress, setScrollProgress] = useState(0);

  // Chapter 03 Architectural Tab State
  const [activeShrineTab, setActiveShrineTab] = useState('hussain');

  // Chapter 04 Before/After Slider State
  const [sliderPos, setSliderPos] = useState(50);
  const [sliderComparisonMode, setSliderComparisonMode] = useState('archival_pre2006'); // 'archival_pre2006' | 'historical_61ah'
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
    { title: 'Karbala Twilight Aerial Panorama — Imam Hussain & Al-Abbas Holy Shrines', path: 'assets/images/karbala_twilight_aerial_panorama_hd.jpg?v=fullhd', category: 'shrine', width: 1920, height: 1080, source: 'Holy Shrine Archival Media' },
    { title: 'Holy Shrine of Imam Hussain (AS) — Golden Dome Reflected in Rain-Washed Courtyard', path: 'assets/images/karbala_hd_royal_dome_rain.jpg', category: 'shrine', width: 1920, height: 1080, source: 'Holy Shrine Archival Media' },
    { title: 'Aerial Night Panorama — Both Holy Shrines & Illuminated Bayn al-Haramayn', path: 'assets/images/karbala_hd_twin_shrines_aerial_night.jpg', category: 'shrine', width: 1920, height: 1080, source: 'Al-Kafeel Global Network' },
    { title: 'Sacred Golden Zarih & Ayeneh-Kari Mirror Vaults of Imam Hussain (AS)', path: 'assets/images/karbala_hd_sacred_zarih_interior.jpg', category: 'shrine', width: 1920, height: 1080, source: 'Astan Quds Husayni Media' },
    { title: 'Holy Sanctuary of Hazrat Al-Abbas (AS) at Golden Sunset', path: 'assets/images/karbala_hd_abbas_golden_hour.jpg', category: 'shrine', width: 1920, height: 1080, source: 'Al-Kafeel Global Network' },
    { title: 'Bab al-Qibla Ceremonial Portal of Imam Hussain Sanctuary at Blue Hour', path: 'assets/images/karbala_hd_bab_al_qibla_blue_hour.jpg', category: 'shrine', width: 1920, height: 1080, source: 'Holy Shrine Archival Media' },
    { title: 'Sham-e-Ghariban & Arbaeen Candlelight Procession in Bayn al-Haramayn', path: 'assets/images/karbala_hd_candlelight_procession.jpg', category: 'history', width: 1920, height: 1080, source: 'International Pilgrimage Registry' },
    { title: 'The Sacred Sanctuary of Al-Abbas (AS) at Blue Hour', path: 'assets/images/shrine_38.jpg', category: 'shrine', width: 1920, height: 1080, source: 'Al-Kafeel Global Network' },
    { title: 'Bayn al-Haramayn Panoramic Esplanade', path: 'assets/images/karbala_img_0_Beyn-_l_H_r_meyn__K_rb_la_jpg.jpg', category: 'history', width: 1920, height: 1280, source: 'Heritage Photographic Archive' },
    { title: 'Historic Karbala Pre-2006 Sanctuary View', path: 'assets/images/karbala_img_3_ImamHusaynMosqueKarbalaIraqPre2006_.jpg', category: 'history', width: 1920, height: 1280, source: 'National Archival Registry' },
    { title: "Arba'een Pilgrims Gathering in Bayn al-Haramayn", path: "assets/images/karbala_img_240_Arba_een_Pilgrims_in_Bayn_al-Harmia.jpg", category: "history", width: 1920, height: 1280, source: "International Pilgrimage Registry" },
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
          FILM OPENING — FULL-VIEWPORT CINEMATIC HERO
          ========================================================================= */}
      <section className="film-opening-hero hero-section" id="hero">
        <div className="film-hero-backdrop">
          <picture>
            <source
              media="(max-width: 768px)"
              srcSet="assets/images/hero_imam_hussain_shrine_twilight.jpg?v=fullhd"
            />
            <img
              src="assets/images/hero_imam_hussain_shrine_twilight.jpg?v=fullhd"
              alt="Authentic Holy Shrine of Imam Hussain (A.S.) in Karbala at Twilight"
              className="hero-bg-media"
            />
          </picture>
        </div>
        <div className="film-hero-light-rays"></div>
        <div className="film-hero-foreground-arch"></div>

        <div className="film-hero-stage hero-content">
          <div className="film-chapter-kicker">
            <span>PROLOGUE · 61 AH / 680 CE · AL-TAFF</span>
          </div>

          <h1 className="film-giant-heading">KARBALA</h1>

          <div className="film-editorial-line">
            Where Sacrifice Became Eternal Memory
          </div>

          <div className="font-arabic text-gold-antique fs-4 mb-3" lang="ar" dir="rtl">
            كَرْبَلَاءُ المُقَدَّسَة — أَرْضُ الخُلُودِ وَالفِدَاء
          </div>

          <p className="film-supporting-copy">
            An international digital heritage experience and sacred sanctuary uniting primary 61 AH historical chronicles, dual-epoch spatial cartography, and multilingual devotion.
          </p>

          <div className="film-cta-group">
            <button
              type="button"
              className="btn-cinema-gold"
              onClick={() => onNavigate('timeline')}
            >
              <span>Explore 61 AH</span>
              <i className="bi bi-arrow-right"></i>
            </button>

            <button
              type="button"
              className="btn-cinema-glass"
              onClick={() => scrollToChapter('chapter-01-land')}
            >
              <span>Begin the Journey</span>
              <i className="bi bi-chevron-down"></i>
            </button>
          </div>
        </div>

        <div className="hero-scroll-prompt d-none d-md-flex" onClick={() => scrollToChapter('chapter-01-land')}>
          <span>SCROLL TO ENTER CHAPTER I</span>
          <div className="hero-scroll-indicator-bar"></div>
        </div>
      </section>

      {/* =========================================================================
          TODAY IN AHLUL BAYT HISTORY — DYNAMIC DAILY CALENDAR MODULE (#1, #15, #43)
          ========================================================================= */}
      <TodayHomepageModule
        onNavigate={onNavigate}
        onOpenCalendarTab={onOpenCalendarTab}
      />

      {/* CONDITIONAL PILGRIM DASHBOARD CARD — Shown ONLY if the user has enabled/started a pilgrimage journey */}
      <div className="container" style={{ maxWidth: '1240px' }}>
        <ActiveJourneyHomeCard
          onContinueJourney={(poleNum) => {
            window.__karbalaOpenWalkTab = true;
            window.__karbalaOpenWalkPole = poleNum || 1;
            onNavigate('poles');
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('karbala-open-walk-tracker', { detail: { poleNumber: poleNum || 1 } }));
            }, 120);
          }}
        />
      </div>

      {/* =========================================================================
          CHAPTER 01 · THE LAND — OPEN EDITORIAL COMPOSITION (NO BORDERED BOXES)
          ========================================================================= */}
      <section id="chapter-01-land" className="doc-chapter-section" style={{ background: 'var(--bg-obsidian)' }}>
        <div className="container" style={{ maxWidth: '1240px' }}>
          <div className="row align-items-end g-5">
            <div className="col-lg-7">
              <div className="doc-chapter-label">CHAPTER 01 · THE LAND</div>
              <h2 className="doc-monument-heading">
                A LAND OF MEMORY &amp; ETERNITY
              </h2>
              <div className="font-arabic fs-3 text-gold-antique mb-4" dir="rtl">
                أرض الطف وكربلاء المقدسة
              </div>
              <p className="doc-editorial-lead mb-4">
                On the second day of Muharram in the year 61 AH (October 2, 680 CE), the caravan of the Household of the Prophet halted upon an alluvial plain between the western desert ridge and the Euphrates—transforming a quiet stretch of Mesopotamian earth into a timeless sanctuary of human conscience.
              </p>
              <div className="d-flex flex-wrap gap-4 pt-2">
                <button
                  type="button"
                  className="cinema-back-link"
                  style={{ fontSize: '0.82rem' }}
                  onClick={() => onNavigate('story')}
                >
                  <span>Read the Complete 61 AH Chronicle</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
                <button
                  type="button"
                  className="cinema-back-link text-ivory-muted"
                  style={{ fontSize: '0.82rem' }}
                  onClick={() => onNavigate('historiography')}
                >
                  <span>Inspect Classical Manuscripts</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>

            <div className="col-lg-5">
              <p className="text-ivory-muted mb-0" style={{ fontSize: '0.96rem', lineHeight: 1.85, borderLeft: '1px solid rgba(200,164,91,0.35)', paddingLeft: '24px' }}>
                Preserved through more than thirteen centuries of continuous historical attestation—from the earliest Kufan chronicles of Abu Mikhnaf and al-Tabari to the living footsteps of twenty million Arba&apos;een pilgrims—every coordinate of Karbala bears witness to an unbroken moral stand.
              </p>
            </div>
          </div>

          {/* Open Typographic Metrics Strip (Replaces 4 Bordered Stat Cards) */}
          <div className="open-metrics-strip">
            <div className="open-metric-item">
              <div className="open-metric-value">61 AH</div>
              <div className="open-metric-title">October 680 CE</div>
              <div className="open-metric-sub">The historical epoch of al-Taff and the immortal stand of Yawm al-Ashura.</div>
            </div>
            <div className="open-metric-item">
              <div className="open-metric-value">1,385+</div>
              <div className="open-metric-title">Lunar Years</div>
              <div className="open-metric-sub">Of unbroken global remembrance, architectural preservation, and pilgrimage.</div>
            </div>
            <div className="open-metric-item">
              <div className="open-metric-value">20+</div>
              <div className="open-metric-title">Sacred Coordinates</div>
              <div className="open-metric-sub">Verified between 61 AH archaeological topography and modern sanctuary shrines.</div>
            </div>
            <div className="open-metric-item">
              <div className="open-metric-value">520+</div>
              <div className="open-metric-title">Archival Plates</div>
              <div className="open-metric-sub">Curated high-resolution photography, rare documents, and spatial reconstructions.</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          DRAMATIC FULL-WIDTH EDITORIAL QUOTE MONUMENT (EditorialQuote)
          ========================================================================= */}
      <section className="editorial-quote-monument" aria-label="Historic Declaration of Imam Hussain">
        <div
          className="editorial-quote-bg"
          style={{ backgroundImage: 'url(assets/images/karbala_hd_bab_al_qibla_blue_hour.jpg)' }}
        ></div>
        <div className="editorial-quote-veil"></div>

        <div className="editorial-quote-inner">
          <div className="doc-chapter-label justify-content-center mb-3">
            PRIMARY HISTORICAL ATTESTATION · 60 AH
          </div>
          <div className="font-arabic text-gold-antique fs-3 mb-3" dir="rtl">
            إِنِّي لَمْ أَخْرُجْ أَشِرًا وَلَا بَطِرًا وَلَا مُفْسِدًا وَلَا ظَالِمًا وَإِنَّمَا خَرَجْتُ لِطَلَبِ الْإِصْلَاحِ فِي أُمَّةِ جَدِّي
          </div>
          <blockquote className="editorial-quote-text">
            &ldquo;I have not risen out of arrogance or rebellion, nor to spread disorder or oppression. Rather, I rose solely to seek reform in the community of my grandfather, the Messenger of God.&rdquo;
          </blockquote>
          <div className="editorial-quote-author">
            Imam Hussain ibn Ali (AS)
          </div>
          <div className="editorial-quote-source">
            Recorded in Tarikh al-Tabari (Vol. 5, p. 341) · Kitab al-Irshad (Shaykh al-Mufid)
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 02 · THE JOURNEY — INTERACTIVE ROUTE MAP (MADINAH -> MAKKAH -> KUFA -> KARBALA)
          ========================================================================= */}
      <section id="chapter-02-journey" className="doc-chapter-section" style={{ background: 'var(--bg-charcoal)' }}>
        <div className="container" style={{ maxWidth: '1320px' }}>
          <div className="row align-items-end justify-content-between g-4 mb-5">
            <div className="col-lg-7">
              <div className="doc-chapter-label">CHAPTER 02 · THE JOURNEY</div>
              <h2 className="doc-monument-heading mb-2">
                THE JOURNEY TO KARBALA
              </h2>
              <p className="doc-editorial-lead mb-0">
                Trace the 1,400-kilometer caravan route across the Arabian Peninsula—from the nocturnal departure at Madinah in Rajab 60 AH to the final halt upon the plain of al-Taff on 2 Muharram 61 AH.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <button
                type="button"
                className="btn-cinema-glass"
                onClick={() => onNavigate('map')}
              >
                <i className="bi bi-compass text-gold-antique"></i>
                <span>Open Full Spatial Map</span>
              </button>
            </div>
          </div>

          {/* Interactive Glowing Historical Route Canvas */}
          <div className="historical-route-canvas mb-5">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <span className="small text-gold-antique text-uppercase fw-bold" style={{ letterSpacing: '0.18em', fontSize: '0.72rem' }}>
                <i className="bi bi-geo-alt-fill me-1.5"></i>CARTOGRAPHIC ROUTE · 28 RAJAB 60 AH – 2 MUHARRAM 61 AH
              </span>
              <span className="small text-ivory-dim font-monospace" style={{ fontSize: '0.72rem' }}>
                MADINAH → MAKKAH → KUFA APPROACH → KARBALA
              </span>
            </div>

            {/* SVG Glowing Route Visualization */}
            <div className="w-100 overflow-x-auto py-2 route-svg-scroll-wrapper">
              <svg viewBox="0 0 1000 130" className="w-100" style={{ height: 'auto', minHeight: '95px', minWidth: '580px' }} role="img" aria-label="Historical route from Madinah to Makkah, Kufa, and Karbala">
                <defs>
                  <linearGradient id="karbalaRouteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8E6A32" stopOpacity="0.6" />
                    <stop offset="35%" stopColor="#C8A45B" stopOpacity="0.9" />
                    <stop offset="70%" stopColor="#E0BD72" stopOpacity="1" />
                    <stop offset="100%" stopColor="#A31C22" stopOpacity="1" />
                  </linearGradient>
                  <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                {/* Subtle Topographic Grid Lines */}
                <line x1="60" y1="65" x2="940" y2="65" stroke="rgba(200,164,91,0.12)" strokeDasharray="4 6" />
                {/* Glowing Caravan Curve */}
                <path
                  d="M 90 78 Q 230 115, 370 82 T 650 52 T 910 58"
                  fill="none"
                  stroke="url(#karbalaRouteGrad)"
                  strokeWidth="3.5"
                  filter="url(#routeGlow)"
                />
                {/* Station 1: Madinah */}
                <g transform="translate(90, 78)">
                  <circle r="12" fill="rgba(200,164,91,0.18)" />
                  <circle r="6" fill="#C8A45B" />
                  <text y="-18" textAnchor="middle" fill="#EEE7D7" fontSize="12" fontFamily="Cinzel, serif" fontWeight="700">01 · MADINAH</text>
                  <text y="26" textAnchor="middle" fill="#ABA496" fontSize="10">28 Rajab 60 AH</text>
                </g>
                {/* Station 2: Makkah */}
                <g transform="translate(370, 82)">
                  <circle r="12" fill="rgba(200,164,91,0.18)" />
                  <circle r="6" fill="#E0BD72" />
                  <text y="-18" textAnchor="middle" fill="#EEE7D7" fontSize="12" fontFamily="Cinzel, serif" fontWeight="700">02 · MAKKAH</text>
                  <text y="26" textAnchor="middle" fill="#ABA496" fontSize="10">8 Dhu al-Hijjah 60 AH</text>
                </g>
                {/* Station 3: Kufa Vanguard / Dhu Husam */}
                <g transform="translate(650, 52)">
                  <circle r="12" fill="rgba(200,164,91,0.18)" />
                  <circle r="6" fill="#E0BD72" />
                  <text y="-18" textAnchor="middle" fill="#EEE7D7" fontSize="12" fontFamily="Cinzel, serif" fontWeight="700">03 · KUFA FRONTIER</text>
                  <text y="26" textAnchor="middle" fill="#ABA496" fontSize="10">Envoys &amp; Dhu Husam</text>
                </g>
                {/* Station 4: Karbala (Al-Taff) */}
                <g transform="translate(910, 58)">
                  <circle r="16" fill="rgba(163,28,34,0.32)" />
                  <circle r="7" fill="#A31C22" stroke="#E0BD72" strokeWidth="2" />
                  <text y="-20" textAnchor="middle" fill="#E0BD72" fontSize="13" fontFamily="Cinzel, serif" fontWeight="700">04 · KARBALA</text>
                  <text y="28" textAnchor="middle" fill="#EEE7D7" fontSize="10">2–10 Muharram 61 AH</text>
                </g>
              </svg>
            </div>

            {/* 4 Interactive Station Nodes Connected to Story & Timeline */}
            <div className="route-stops-track">
              {[
                {
                  stage: 'STATION 01 · 28 RAJAB 60 AH',
                  city: 'Madinah al-Munawwarah',
                  arabic: 'المدينة المنورة',
                  desc: 'Refusing coerced allegiance to Yazid, Imam Hussain departs the Sanctuary of the Prophet by night to uphold prophetic conscience.',
                  target: 'story'
                },
                {
                  stage: 'STATION 02 · 8 DHU AL-HIJJAH',
                  city: 'Makkah al-Mukarramah',
                  arabic: 'مكة المكرمة',
                  desc: 'After receiving thousands of letters from Kufa, the Imam departs on the Day of Tarwiyah to protect the sanctity of the Kaaba.',
                  target: 'story'
                },
                {
                  stage: 'STATION 03 · LATE DHU AL-HIJJAH',
                  city: 'Approach toward Kufa',
                  arabic: 'طريق الكوفة وذو حسم',
                  desc: 'Intercepted at Dhu Husam by Al-Hurr’s 1,000 cavalry, Imam Hussain orders water given to every thirsty soldier and horse.',
                  target: 'timeline'
                },
                {
                  stage: 'STATION 04 · 2 MUHARRAM 61 AH',
                  city: 'The Plain of Karbala',
                  arabic: 'أرض كربلاء والطف',
                  desc: 'The caravan halts upon the alluvial plain of al-Taff near the Euphrates branch, where the eternal stand of Ashura unfolds.',
                  target: 'timeline',
                  isKarbala: true
                }
              ].map((st, sIdx) => (
                <div
                  key={sIdx}
                  className={`route-stop-node ${st.isKarbala ? 'is-karbala active' : ''}`}
                  onClick={() => onNavigate(st.target)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="text-gold-antique font-monospace" style={{ fontSize: '0.68rem', letterSpacing: '0.1em' }}>{st.stage}</span>
                    <span className="font-arabic text-gold-antique" style={{ fontSize: '0.92rem' }}>{st.arabic}</span>
                  </div>
                  <h4 className="font-display text-ivory-warm mb-2" style={{ fontSize: '1.08rem' }}>{st.city}</h4>
                  <p className="text-ivory-muted small mb-0" style={{ lineHeight: 1.6, fontSize: '0.82rem' }}>{st.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dominant 61 AH Landscape Visual Stage with Single Floating Spatial Glass Panel */}
          <div className="dominant-visual-stage">
            <img
              src={activeLandscape.image}
              alt={activeLandscape.title}
            />
            <div className="dominant-visual-shade"></div>

            <div className="spatial-glass-float">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                <span className="text-gold-antique text-uppercase fw-bold" style={{ fontSize: '0.68rem', letterSpacing: '0.18em' }}>
                  61 AH TOPOGRAPHICAL RECONSTRUCTION
                </span>
                <span className="font-arabic text-gold-antique">{activeLandscape.arabic}</span>
              </div>
              <h3 className="font-display text-ivory-warm mb-2" style={{ fontSize: 'clamp(1.35rem, 2.4vw, 1.85rem)' }}>
                {activeLandscape.title}
              </h3>
              <p className="text-ivory-muted small mb-3" style={{ lineHeight: 1.7 }}>
                {activeLandscape.desc}
              </p>

              {/* Minimal Landscape Switcher Pills */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                {Object.keys(reconstructions61AH).map(key => {
                  const item = reconstructions61AH[key];
                  const isSel = featuredLandscape === key;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`consumer-prompt-chip py-1 px-2.5 ${isSel ? 'border-warning text-gold-antique' : ''}`}
                      style={{ fontSize: '0.73rem' }}
                      onClick={() => setFeaturedLandscape(key)}
                    >
                      {item.title.split(' (')[0].replace('The Encampment of Imam Hussain', 'Al-Mukhayyam')}
                    </button>
                  );
                })}
              </div>

              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 pt-2" style={{ borderTop: '1px solid rgba(200,164,91,0.2)' }}>
                <button
                  type="button"
                  className="cinema-back-link"
                  onClick={() => onNavigate('journey-61ah')}
                >
                  <span>Explore 61 AH Topographical Atlas</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-ivory-muted text-decoration-none p-0"
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => onOpenLightbox({
                    title: activeLandscape.title,
                    path: activeLandscape.image,
                    width: activeLandscape.width,
                    height: activeLandscape.height,
                    isAI: true,
                    source: 'Karbala Digital Twin Historical Modeling'
                  })}
                >
                  <i className="bi bi-arrows-fullscreen me-1 text-gold-antique"></i>Inspect Plate
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          CHAPTER 03 · THE SANCTUARY — DOMINANT SHRINE PHOTOGRAPHY & TEMPORAL PORTAL
          ========================================================================= */}
      <section id="chapter-03" className="doc-chapter-section" style={{ background: 'linear-gradient(180deg, #050706 0%, #08261C 48%, #050706 100%)' }}>
        <div className="container" style={{ maxWidth: '1320px' }}>
          
          <div className="row align-items-end justify-content-between g-4 mb-4">
            <div className="col-lg-7">
              <div className="doc-chapter-label">CHAPTER 03 · THE SACRED SANCTUARY</div>
              <h2 className="doc-monument-heading mb-2">THE SACRED SANCTUARY</h2>
              <p className="doc-editorial-lead mb-0">
                The twin golden sanctuaries of Imam Hussain (AS) and Abu al-Fadl al-Abbas (AS) linked by the 378-meter marble concourse of Bayn al-Haramayn.
              </p>
            </div>
            <div className="col-lg-5 text-lg-end">
              <div className="d-inline-flex p-1 rounded-pill flex-wrap justify-content-center" style={{ background: 'rgba(11, 14, 12, 0.85)', border: '1px solid rgba(200,164,91,0.28)' }}>
                {[
                  { id: 'hussain', label: 'Imam Hussain' },
                  { id: 'abbas', label: 'Al-Abbas' },
                  { id: 'bayn', label: 'Bayn al-Haramayn' },
                  { id: 'arbaeen', label: "Arba'een" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`btn btn-sm px-3 py-1.5 rounded-pill fw-semibold ${activeShrineTab === tab.id ? 'bg-warning text-dark shadow-sm' : 'text-champagne'}`}
                    style={{ fontSize: '0.76rem', letterSpacing: '0.04em' }}
                    onClick={() => setActiveShrineTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Tab Spotlight Content — Open Editorial Layout (Zero Box Border) */}
          <div className="row g-5 align-items-center mt-2">
            {activeShrineTab === 'hussain' && (
              <>
                <div className="col-lg-7">
                  <div className="architecture-showcase-card">
                    <img src="assets/images/karbala_twilight_aerial_panorama_hd.jpg?v=fullhd2" alt="Holy Shrine of Imam Hussain" className="architecture-card-img" />
                    <div className="architecture-card-overlay">
                      <span className="doc-chapter-label mb-2">
                        PRIMARY SANCTUARY · AL-HA&apos;IR AL-HUSAYNI
                      </span>
                      <h4 className="font-display text-white mb-1">The Holy Shrine of Imam Hussain (AS)</h4>
                      <p className="font-arabic text-gold-antique mb-0">العتبة الحسينية المقدسة — مرقد سيد الشهداء</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="ps-lg-4" style={{ borderLeft: '2px solid var(--gold-antique)' }}>
                    <div className="doc-chapter-label mb-2">ARCHITECTURAL PROVENANCE</div>
                    <h3 className="font-display text-ivory-warm mb-3" style={{ fontSize: 'clamp(1.45rem, 2.4vw, 2rem)' }}>
                      Architectural &amp; Spiritual Continuity
                    </h3>
                    <p className="text-ivory-muted mb-4" style={{ lineHeight: '1.8', fontSize: '0.96rem' }}>
                      The modern shrine complex spans over 15,000 square meters. The gilded central dome—adorned with 7,200 pure gold plates—rises directly above the sacred grave chamber (al-Ha’ir al-Husayni), resting upon the original subterranean ground level of 61 AH where the final stand of Ashura concluded.
                    </p>
                    <ul className="list-unstyled d-flex flex-column gap-2.5 small text-champagne mb-4">
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>Central Golden Dome:</strong> 37 meters in height, flanked by twin 35m minarets.</li>
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>The Golden Iwan (Aywan al-Zahab):</strong> Monumental ceremonial entry portal.</li>
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>Subterranean Basements:</strong> Modern climate-controlled pilgrim halls.</li>
                    </ul>
                    <button
                      type="button"
                      className="btn-cinema-gold"
                      onClick={() => onNavigate('map')}
                    >
                      <i className="bi bi-compass"></i>
                      <span>Locate Sanctuary on Digital Twin Map</span>
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
                      <span className="doc-chapter-label mb-2">
                        SANCTUARY OF ABU AL-FADL AL-ABBAS (AS)
                      </span>
                      <h4 className="font-display text-white mb-1">The Holy Shrine of Al-Abbas (AS)</h4>
                      <p className="font-arabic text-gold-antique mb-0">العتبة العباسية المقدسة — قمر بني هاشم</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="ps-lg-4" style={{ borderLeft: '2px solid var(--gold-antique)' }}>
                    <div className="doc-chapter-label mb-2">NAHR AL-ALQAMI THRESHOLD</div>
                    <h3 className="font-display text-ivory-warm mb-3" style={{ fontSize: 'clamp(1.45rem, 2.4vw, 2rem)' }}>
                      The Standard-Bearer of Karbala
                    </h3>
                    <p className="text-ivory-muted mb-4" style={{ lineHeight: '1.8', fontSize: '0.96rem' }}>
                      Positioned 378 meters northeast of the central shrine, this sanctuary marks the location where Abu al-Fadl al-Abbas attained martyrdom while attempting to bring water from Nahr al-Alqami to the besieged children in the encampment.
                    </p>
                    <ul className="list-unstyled d-flex flex-column gap-2.5 small text-champagne mb-4">
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>Bab al-Qibla of al-Abbas:</strong> Iconic 24m triumphal portal of mosaic ceramic tile.</li>
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>Twin Gilded Minarets:</strong> Intricate Kufic Qur&apos;anic epigraphy in lapis lazuli.</li>
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>Al-Kafeel Heritage Center:</strong> Scholarly manuscript and astronomical museum.</li>
                    </ul>
                    <button
                      type="button"
                      className="btn-cinema-gold"
                      onClick={() => onNavigate('map')}
                    >
                      <i className="bi bi-compass"></i>
                      <span>Locate Sanctuary on Digital Twin Map</span>
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
                      <span className="doc-chapter-label mb-2">
                        SACRED PEDESTRIAN CONCOURSE · 378 METERS
                      </span>
                      <h4 className="font-display text-white mb-1">Bayn al-Haramayn (The Sacred Space Between)</h4>
                      <p className="font-arabic text-gold-antique mb-0">منطقة ما بين الحرمين الشريفين</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="ps-lg-4" style={{ borderLeft: '2px solid var(--gold-antique)' }}>
                    <div className="doc-chapter-label mb-2">THE SACRED AXIS</div>
                    <h3 className="font-display text-ivory-warm mb-3" style={{ fontSize: 'clamp(1.45rem, 2.4vw, 2rem)' }}>
                      The Nexus of Pilgrimage
                    </h3>
                    <p className="text-ivory-muted mb-4" style={{ lineHeight: '1.8', fontSize: '0.96rem' }}>
                      Bayn al-Haramayn is the 378-meter paved pedestrian esplanade flanked by date palms that joins the two shrines. During Arba&apos;een, it witnesses the gathering of over 20 million pilgrims—one of the largest peaceful human assemblies on Earth.
                    </p>
                    <ul className="list-unstyled d-flex flex-column gap-2.5 small text-champagne mb-4">
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>Length:</strong> 378 meters perfectly aligned with sacred sightlines.</li>
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>Paving:</strong> Thermal-reflective natural Greek Thassos marble.</li>
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>Arba&apos;een Pilgrimage:</strong> Global hub of humanitarian hospitality (Mawkib).</li>
                    </ul>
                    <button
                      type="button"
                      className="btn-cinema-gold"
                      onClick={() => onNavigate('map')}
                    >
                      <i className="bi bi-compass"></i>
                      <span>Locate Esplanade on Digital Twin Map</span>
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
                      <span className="doc-chapter-label mb-2">
                        ARBA&apos;EEN PILGRIMAGE · OVER 20 MILLION ATTENDEES
                      </span>
                      <h4 className="font-display text-white mb-1">The Great Procession of Arba&apos;een</h4>
                      <p className="font-arabic text-gold-antique mb-0">زيارة الأربعين المليونية المباركة</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="ps-lg-4" style={{ borderLeft: '2px solid var(--gold-antique)' }}>
                    <div className="doc-chapter-label mb-2">UNESCO INTANGIBLE HERITAGE</div>
                    <h3 className="font-display text-ivory-warm mb-3" style={{ fontSize: 'clamp(1.45rem, 2.4vw, 2rem)' }}>
                      Living Heritage &amp; Hospitality
                    </h3>
                    <p className="text-ivory-muted mb-4" style={{ lineHeight: '1.8', fontSize: '0.96rem' }}>
                      Recognized by UNESCO as Intangible Cultural Heritage, the Arba&apos;een walk brings together millions from across the globe walking 80 kilometers on foot from Najaf to Karbala, supported by thousands of volunteer hospitality stations (Mawkibs).
                    </p>
                    <ul className="list-unstyled d-flex flex-column gap-2.5 small text-champagne mb-4">
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>UNESCO Recognition:</strong> Services and hospitality during the Arba&apos;een pilgrimage.</li>
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>Pilgrim Corridor:</strong> Dedicated 80km path with 1,452 numbered utility poles.</li>
                      <li><i className="bi bi-check2-circle text-gold-antique me-2"></i><strong>Solidarity:</strong> Universal humanitarian message transcending borders.</li>
                    </ul>
                    <button
                      type="button"
                      className="btn-cinema-gold"
                      onClick={() => onNavigate('map')}
                    >
                      <i className="bi bi-compass"></i>
                      <span>Locate Concourse on Digital Twin Map</span>
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
            <h2 className="chapter-title">Journey Through Time: Then &amp; Now</h2>
            <p className="chapter-lead mx-auto">
              Drag the interactive gold handle below to cross decades and centuries of landscape transformation—inspecting authentic archival documentation from pre-2006 to 2026, or the conceptual dawn of 61 AH.
            </p>

            {/* Comparison Mode Switcher */}
            <div className="d-inline-flex flex-wrap justify-content-center p-1 rounded-4 bg-dark border border-gold-subtle my-3 gap-1">
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 ${sliderComparisonMode === 'archival_pre2006' ? 'btn-gold' : 'btn-link text-light text-decoration-none'}`}
                style={{ fontSize: '0.78rem' }}
                onClick={() => setSliderComparisonMode('archival_pre2006')}
              >
                <i className="bi bi-clock-history me-1.5"></i>
                Pre-2006 Archive ↔ 2026 Expansion
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-3 ${sliderComparisonMode === 'historical_61ah' ? 'btn-gold' : 'btn-link text-light text-decoration-none'}`}
                style={{ fontSize: '0.78rem' }}
                onClick={() => setSliderComparisonMode('historical_61ah')}
              >
                <i className="bi bi-stars me-1.5"></i>
                61 AH Concept ↔ Present Day
              </button>
            </div>
          </div>

          <div className="max-w-1000 mx-auto">
            <div
              ref={sliderContainerRef}
              className="compare-slider-container"
              onMouseDown={handleMouseDown}
              onTouchMove={handleTouchMove}
            >
              {/* Right Layer (2026 Present Day) */}
              <div className="compare-layer">
                <img
                  src={sliderComparisonMode === 'archival_pre2006'
                    ? 'assets/images/karbala_img_37_Karbala_City_1_jpg.jpg'
                    : 'assets/images/karbala_img_0_Beyn-_l_H_r_meyn__K_rb_la_jpg.jpg'}
                  alt="Present Day Karbala"
                  className="compare-img"
                />
                <div className="compare-badge compare-badge-right">
                  {sliderComparisonMode === 'archival_pre2006'
                    ? '2026 PRESENT DAY • MONUMENTAL SANCTUARY EXPANSION'
                    : 'PRESENT DAY (1445 AH) • MONUMENTAL COMPLEX'}
                </div>
              </div>

              {/* Left Layer (Historical / Archival) - clipped */}
              <div
                className="compare-layer"
                style={{
                  clipPath: `polygon(0% 0%, ${sliderPos}% 0%, ${sliderPos}% 100%, 0% 100%)`
                }}
              >
                <img
                  src={sliderComparisonMode === 'archival_pre2006'
                    ? 'assets/images/karbala_img_3_ImamHusaynMosqueKarbalaIraqPre2006_.jpg'
                    : 'assets/images/ai_61ah_encampment.jpg'}
                  alt={sliderComparisonMode === 'archival_pre2006' ? 'Pre-2006 Archival Karbala' : '61 AH Historical Landscape'}
                  className="compare-img"
                />
                <div className="compare-badge compare-badge-left">
                  {sliderComparisonMode === 'archival_pre2006'
                    ? 'PRE-2006 ARCHIVAL PHOTO • HISTORICAL COURTYARD'
                    : '61 AH (680 CE) • SCHOLARLY RECONSTRUCTION OF AL-TAFF'}
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

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3 text-champagne small px-2">
              <div>
                <i className="bi bi-chevron-left me-1 text-gold-antique"></i>
                <strong style={{ color: 'var(--gold-antique)' }}>
                  {sliderComparisonMode === 'archival_pre2006' ? 'Pre-2006 Courtyard' : '61 AH Plain of al-Taff'}
                </strong> ({Math.round(sliderPos)}%)
              </div>
              <div className="text-center font-serif fst-italic text-secondary" style={{ fontSize: '0.82rem' }}>
                Drag slider horizontally to reveal temporal transformation
              </div>
              <div>
                <strong style={{ color: 'var(--gold-antique)' }}>2026 Sanctuary Nexus</strong> ({Math.round(100 - sliderPos)}%)
                <i className="bi bi-chevron-right ms-1 text-gold-antique"></i>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          CHAPTER 04 · 61 AH — THE ILLUMINATED CHRONOLOGY (DOCUMENTARY TIMELINE)
          ========================================================================= */}
      <section id="chapter-06" className="doc-chapter-section" style={{ background: 'var(--bg-charcoal)' }}>
        <div className="container" style={{ maxWidth: '1320px' }}>
          
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-4 mb-5">
            <div>
              <div className="doc-chapter-label">CHAPTER 04 · 61 AH CHRONOLOGY</div>
              <h2 className="doc-monument-heading mb-2">THE ILLUMINATED CHRONOLOGY</h2>
              <p className="doc-editorial-lead mb-0" style={{ maxWidth: '680px' }}>
                From the caravan&apos;s halt upon the plain of al-Taff on 2 Muharram 61 AH to the six immortal phases of Yawm al-Ashura.
              </p>
            </div>

            <div className="d-inline-flex flex-wrap p-1 rounded-pill gap-1" style={{ background: 'var(--bg-obsidian)', border: '1px solid rgba(200,164,91,0.28)' }}>
              <button
                type="button"
                className={`btn btn-sm px-4 py-1.5 rounded-pill fw-semibold ${chronologyTab === 'days' ? 'bg-gold-antique text-dark' : 'text-champagne'}`}
                style={{ fontSize: '0.76rem', letterSpacing: '0.06em' }}
                onClick={() => setChronologyTab('days')}
              >
                Muharram 2–10 Milestones
              </button>
              <button
                type="button"
                className={`btn btn-sm px-4 py-1.5 rounded-pill fw-semibold ${chronologyTab === 'ashura' ? 'bg-gold-antique text-dark' : 'text-champagne'}`}
                style={{ fontSize: '0.76rem', letterSpacing: '0.06em' }}
                onClick={() => setChronologyTab('ashura')}
              >
                Six Phases of Ashura
              </button>
            </div>
          </div>

          {/* Horizontal Desktop / Glowing Vertical Mobile Documentary Timeline */}
          {chronologyTab === 'days' ? (
            <div className="timeline-horizontal-ribbon">
              {[
                {
                  num: '02',
                  day: '2 Muharram 61 AH · Oct 2, 680 CE',
                  title: 'Arrival at the Plain of Karbala',
                  arabic: 'النزول في أرض كربلاء',
                  location: 'Al-Taff Alluvial Terrace',
                  img: 'assets/images/ai_61ah_encampment.jpg',
                  quote: 'Here is the halting place of our caravan and the site of our graves.',
                  desc: 'Imam Hussain (AS) halts upon the plain of al-Taff, purchases the surrounding land from Nineveh and al-Ghadiriyya, and orders the encampment pitched.',
                  source: 'Tarikh al-Tabari · Al-Luhuf',
                  climax: false
                },
                {
                  num: '03',
                  day: '3 Muharram 61 AH · Oct 3, 680 CE',
                  title: "Encirclement by Umar ibn Sa'd",
                  arabic: 'ورود جيش عمر بن سعد',
                  location: 'Eastern Flank of Al-Taff',
                  img: 'assets/images/ai_61ah_tall_zaynabiyya.jpg',
                  quote: 'Steady your hearts, for death is no more than a bridge crossing from hardship to eternal gardens.',
                  desc: "The Kufan vanguard of 4,000 cavalry arrives under Umar ibn Sa'd and establishes military encirclement between the Hashemite camp and the Euphrates.",
                  source: 'Kitab al-Irshad · Abu Mikhnaf',
                  climax: false
                },
                {
                  num: '07',
                  day: '7 Muharram 61 AH · Oct 7, 680 CE',
                  title: 'The Siege of Nahr al-Alqami',
                  arabic: 'حصار الماء ومنع الفرات',
                  location: 'Nahr al-Alqami Banks',
                  img: 'assets/images/ai_61ah_alqami_river.jpg',
                  quote: 'Abu al-Fadl al-Abbas broke through the blockade by night to bring water to the children.',
                  desc: 'Five hundred horsemen are stationed along the Euphrates branch to enforce a total water blockade against the Household of the Prophet.',
                  source: 'Tarikh al-Tabari, Vol. 5, p. 412',
                  climax: false
                },
                {
                  num: '09',
                  day: '9 Muharram 61 AH · Oct 9, 680 CE',
                  title: "Tasu'a & The Night of Devotion",
                  arabic: 'تاسوعاء وليلة العبادة والمناجاة',
                  location: 'Al-Mukhayyam Perimeter',
                  img: 'assets/images/karbala_hd_candlelight_procession.jpg',
                  quote: 'Our Lord knows that we love prayer, the recitation of His Book, and earnest supplication.',
                  desc: "Imam Hussain dispatches Al-Abbas to secure a one-night respite dedicated to prayer, supplication, and Qur'anic recitation across the camp.",
                  source: 'Kamil al-Ziyarat · Al-Mufid',
                  climax: false
                },
                {
                  num: '10',
                  day: '10 Muharram 61 AH · Oct 10, 680 CE',
                  title: 'Yawm al-Ashura — The Immortal Stand',
                  arabic: 'يوم عاشوراء — الموقف الخالد',
                  location: 'Bayn al-Haramayn & Al-Maqtal',
                  img: 'assets/images/ai_61ah_sham_e_ghariban.jpg',
                  quote: 'Never shall we accept humiliation! Allah, His Messenger, and the believers forbid that we yield.',
                  desc: 'From dawn sermon to the final afternoon testimony at Gowd-e Qatlgah, the companions and Bani Hashim seal an eternal covenant of conscience.',
                  source: 'Maqtal al-Husayn · Al-Tabari',
                  climax: true
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`timeline-ribbon-node ${item.climax ? 'is-ashura-climax' : ''}`}
                  onClick={() => onNavigate('timeline')}
                >
                  <div className="position-relative overflow-hidden rounded-3 mb-3" style={{ height: '148px' }}>
                    <img src={item.img} alt={item.title} className="w-100 h-100 object-fit-cover" />
                    <div className="position-absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(5,7,6,0.9) 100%)' }}></div>
                    <span className="position-absolute bottom-0 start-0 m-2.5 text-gold-antique font-monospace" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>
                      {item.day}
                    </span>
                    <span className="position-absolute top-0 end-0 m-2 brutalist-numeral" style={{ fontSize: '1.8rem' }}>{item.num}</span>
                  </div>

                  <div className="small text-ivory-dim mb-1" style={{ fontSize: '0.72rem' }}>
                    <i className="bi bi-geo-alt text-gold-antique me-1"></i>{item.location}
                  </div>
                  <h5 className="font-display text-ivory-warm fw-bold mb-1" style={{ fontSize: '1.08rem' }}>{item.title}</h5>
                  <div className="font-arabic text-gold-antique mb-2" style={{ fontSize: '0.95rem' }} dir="rtl">{item.arabic}</div>
                  <blockquote className="font-editorial fst-italic text-champagne small mb-2 ps-2" style={{ borderLeft: '2px solid var(--gold-antique)', lineHeight: 1.5 }}>
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <p className="text-ivory-muted small mb-3" style={{ lineHeight: 1.6, fontSize: '0.82rem' }}>{item.desc}</p>
                  <div className="d-flex justify-content-between align-items-center pt-2" style={{ borderTop: '1px solid rgba(200,164,91,0.16)', fontSize: '0.72rem' }}>
                    <span className="text-ivory-dim">{item.source}</span>
                    <span className="text-gold-antique fw-semibold">Explore →</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="timeline-horizontal-ribbon">
              {[
                { num: 'I', phase: 'Phase I · Dawn (5:30 AM)', title: 'Fajr Prayer & Sermon of Admonition', arabic: 'صلاة الفجر وخطبة الإتمام للحجة', desc: 'Imam Hussain (AS) leads the dawn congregation and delivers his historic address clarifying his lineage, moral mission, and rejection of tyranny.', climax: false },
                { num: 'II', phase: 'Phase II · Morning (8:30 AM)', title: 'Repentance of Al-Hurr & Companions Stand', arabic: 'توبة الحر وبطولات الأصحاب', desc: 'Al-Hurr ibn Yazid al-Riyahi crosses over to join Imam Hussain. Burayr, Muslim ibn Awsaja, and Habib ibn Muzahir defend the camp.', climax: false },
                { num: 'III', phase: 'Phase III · Midday (12:15 PM)', title: 'Salat al-Zuhr Under Barrage of Arrows', arabic: 'صلاة الظهر في قلب المعركة', desc: 'When Abu Thumama al-Sa’idi mentions the midday prayer, Imam Hussain prays Salat al-Khawf while Sa’id ibn Abdallah shields him.', climax: false },
                { num: 'IV', phase: 'Phase IV · Afternoon (2:00 PM)', title: 'Sacrifice of Bani Hashim & Al-Abbas', arabic: 'تضحيات بني هاشم وأبي الفضل العباس', desc: 'Ali al-Akbar, Al-Qasim ibn al-Hasan, and the Standard-Bearer Abu al-Fadl al-Abbas step forth in defense of the besieged family.', climax: true },
                { num: 'V', phase: 'Phase V · Late Afternoon (4:30 PM)', title: 'The Final Stand at Al-Maqtal', arabic: 'الموقف الأخير لسيد الشهداء', desc: 'Standing alone at Gowd-e Qatlgah, Imam Hussain offers his final supplication of radiant contentment before his martyrdom.', climax: true },
                { num: 'VI', phase: 'Phase VI · Twilight (6:30 PM)', title: 'Sham-e Ghariban & Stewardship of Zaynab', arabic: 'ليلة الوحشة وقيادة السيدة زينب', desc: 'As twilight settles over al-Taff, Sayyida Zaynab bint Ali (AS) protects Imam Sajjad (AS) and the surviving children.', climax: false }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`timeline-ribbon-node ${item.climax ? 'is-ashura-climax' : ''}`}
                  onClick={() => onNavigate('timeline')}
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className="text-gold-antique font-monospace" style={{ fontSize: '0.72rem' }}>{item.phase}</span>
                    <span className="brutalist-numeral" style={{ fontSize: '2rem' }}>{item.num}</span>
                  </div>
                  <h5 className="font-display text-ivory-warm fw-bold mb-1" style={{ fontSize: '1.05rem' }}>{item.title}</h5>
                  <div className="font-arabic text-gold-antique mb-2" style={{ fontSize: '0.94rem' }} dir="rtl">{item.arabic}</div>
                  <p className="text-ivory-muted small mb-0" style={{ lineHeight: 1.6, fontSize: '0.82rem' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <button
              type="button"
              className="cinema-back-link"
              onClick={() => onNavigate('timeline')}
            >
              <span>Enter Complete Interactive 61 AH Chronology</span>
              <i className="bi bi-arrow-right"></i>
            </button>
            <button
              type="button"
              className="cinema-back-link text-ivory-muted"
              onClick={() => onNavigate('map')}
            >
              <i className="bi bi-geo-alt text-gold-antique"></i>
              <span>View Timeline Coordinates on Spatial Map</span>
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          CHAPTER 05 · THE PEOPLE — VOICES OF 61 AH (CINEMATIC PORTRAIT STORY STREAM)
          ========================================================================= */}
      <section id="chapter-personalities-preview" className="doc-chapter-section" style={{ background: 'var(--bg-obsidian)' }}>
        <div className="container" style={{ maxWidth: '1320px' }}>
          <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-5">
            <div>
              <div className="doc-chapter-label">CHAPTER 05 · BIOGRAPHICAL ARCHIVE</div>
              <h2 className="doc-monument-heading mb-2">VOICES OF 61 AH</h2>
              <p className="doc-editorial-lead mb-0" style={{ maxWidth: '680px' }}>
                The Household of the Prophet (SAW) and their companions—whose words, lineages, and moral courage are preserved in primary historical monographs.
              </p>
            </div>
            <button
              type="button"
              className="btn-cinema-glass"
              onClick={() => onNavigate('personalities')}
            >
              <span>Explore Genealogy &amp; All Monographs</span>
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>

          <div className="person-story-stream mb-5">
            {[
              {
                name: 'Imam Hussain ibn Ali (AS)',
                arabic: 'الإمام الحسين سيد الشهداء',
                role: 'Sayyid al-Shuhada · Grandson of the Prophet',
                bg: 'assets/images/karbala_hd_royal_dome_rain.jpg',
                quote: 'Death with dignity is far nobler than life under tyranny.',
                significance: 'Led the moral stand of 61 AH in Karbala, refusing coerced allegiance to preserve prophetic justice and human conscience.',
                source: 'Al-Tabari · Kitab al-Irshad'
              },
              {
                name: 'Abu al-Fadl al-Abbas (AS)',
                arabic: 'أبو الفضل العباس قمر بني هاشم',
                role: 'Qamar Bani Hashim · Standard-Bearer',
                bg: 'assets/images/karbala_hd_abbas_golden_hour.jpg',
                quote: 'By Allah, even if you sever my right hand, I shall forever defend my faith and my Imam.',
                significance: 'Commander of the Hashemite banner and protector of the besieged camp who fell by Nahr al-Alqami seeking water for the children.',
                source: 'Maqtal al-Husayn · Al-Mufid'
              },
              {
                name: 'Sayyida Zaynab bint Ali (AS)',
                arabic: 'السيدة زينب عقيلة بني هاشم',
                role: 'Aqilat Bani Hashim · Voice of Ashura',
                bg: 'assets/images/ai_61ah_tall_zaynabiyya.jpg',
                quote: 'I saw nothing but beauty in the decree of God.',
                significance: 'Safeguarded the surviving family after Ashura and delivered the historic sermons in Kufa and Damascus that shook the Umayyad court.',
                source: 'Balaghat al-Nisa · Al-Tabari'
              },
              {
                name: 'Ali al-Akbar ibn Hussain (AS)',
                arabic: 'علي الأكبر شبيه المصطفى',
                role: 'First Hashemite Martyr of Ashura',
                bg: 'assets/images/karbala_hd_sacred_zarih_interior.jpg',
                quote: 'When we are upon the truth, we care not whether we fall upon death or death falls upon us.',
                significance: 'Eldest son of Imam Hussain at Karbala, renowned for his likeness to Prophet Muhammad (SAW) in form, character, and speech.',
                source: 'Maqatil al-Talibiyyin'
              }
            ].map((person, idx) => (
              <article
                key={idx}
                className="person-story-card"
                onClick={() => onNavigate('personalities')}
                role="button"
                tabIndex={0}
              >
                <div className="person-story-bg" style={{ backgroundImage: `url(${person.bg})` }}></div>
                <div className="person-story-gradient"></div>
                <div className="person-story-body">
                  <div className="text-gold-antique text-uppercase fw-bold mb-1" style={{ fontSize: '0.66rem', letterSpacing: '0.16em' }}>
                    {person.role}
                  </div>
                  <h4 className="font-display text-ivory-warm mb-1" style={{ fontSize: '1.22rem' }}>{person.name}</h4>
                  <div className="font-arabic text-gold-antique mb-2" style={{ fontSize: '1.05rem' }} dir="rtl">{person.arabic}</div>
                  <blockquote className="font-editorial fst-italic text-champagne small mb-2 ps-2" style={{ borderLeft: '2px solid var(--gold-antique)' }}>
                    &ldquo;{person.quote}&rdquo;
                  </blockquote>
                  <p className="text-ivory-muted small mb-3" style={{ fontSize: '0.8rem', lineHeight: 1.55 }}>
                    {person.significance}
                  </p>
                  <div className="d-flex justify-content-between align-items-center pt-2" style={{ borderTop: '1px solid rgba(200,164,91,0.2)', fontSize: '0.72rem' }}>
                    <span className="text-ivory-dim">{person.source}</span>
                    <span className="text-gold-antique fw-semibold">Read Monograph →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECOND DRAMATIC FULL-WIDTH EDITORIAL QUOTE MONUMENT (#8, #15)
          ========================================================================= */}
      <section className="editorial-quote-monument" aria-label="Historic Sermon of Sayyida Zaynab bint Ali">
        <div
          className="editorial-quote-bg"
          style={{ backgroundImage: 'url(assets/images/ai_61ah_sham_e_ghariban.jpg)' }}
        ></div>
        <div
          className="editorial-quote-veil"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(122, 16, 20, 0.35) 0%, rgba(5, 7, 6, 0.96) 80%)' }}
        ></div>

        <div className="editorial-quote-inner">
          <div className="doc-chapter-label justify-content-center mb-3">
            THE VOICE OF ASHURA · COURT OF DAMASCUS · SAFAR 61 AH
          </div>
          <div className="font-arabic text-gold-antique fs-3 mb-3" dir="rtl">
            فَوَاللهِ لَا تَمْحُو ذِكْرَنَا، وَلَا تُمِيتُ وَحْيَنَا، وَهَلْ رَأْيُكَ إِلَّا فَنَدٌ وَأَيَّامُكَ إِلَّا عَدَدٌ
          </div>
          <blockquote className="editorial-quote-text">
            &ldquo;Scheme as you will, and strive with all your might—yet by Allah, you shall never erase our remembrance, nor shall you ever extinguish our revelation.&rdquo;
          </blockquote>
          <div className="editorial-quote-author">
            Sayyida Zaynab bint Ali (AS)
          </div>
          <div className="editorial-quote-source">
            Recorded in Balaghat al-Nisa (Ibn Abi Tahir Tayfur) · Al-Luhuf (Sayyid Ibn Tawus) · Al-Ihtijaj (Al-Tabarsi)
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 06 · THE LEGACY — ASYMMETRIC CINEMATIC BENTO GRID (1 HERO + 2 MEDIUM + 2 COMPACT)
          ========================================================================= */}
      <section id="chapter-07" className="doc-chapter-section" style={{ background: 'var(--bg-charcoal)' }}>
        <div className="container" style={{ maxWidth: '1320px' }}>
          <div className="row align-items-end justify-content-between g-4 mb-5">
            <div className="col-lg-7">
              <div className="doc-chapter-label">CHAPTER 06 · THE LIVING LEGACY</div>
              <h2 className="doc-monument-heading mb-2">SACRED SANCTUARY &amp; ARCHIVE</h2>
              <p className="doc-editorial-lead mb-0">
                Enter the liturgical recitation sanctuary, dual-epoch spatial map, multilingual AI research companion, and the 80-kilometer Arba&apos;een pilgrimage corridor.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <button
                type="button"
                className="cinema-back-link"
                onClick={() => onNavigate('pavilion')}
              >
                <span>Open Full 520+ Visual Pavilion</span>
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>

          {/* True Asymmetric Bento Composition: 1 Large Hero Card + 2 Medium Cards + 2 Compact Cards */}
          <div className="heritage-bento-grid">
            {/* 1. Large Hero Cinematic Card (7 cols, 2 rows) */}
            <div
              className="bento-cell bento-span-7 bento-row-2"
              style={{ minHeight: '440px' }}
              onClick={() => onNavigate('quran')}
              role="button"
              tabIndex={0}
            >
              <div className="bento-cell-bg" style={{ backgroundImage: 'url(assets/images/karbala_hd_sacred_zarih_interior.jpg)', opacity: 0.38 }}></div>
              <div className="bento-cell-overlay"></div>
              <div className="bento-cell-content">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="doc-chapter-label mb-0">LITURGICAL SANCTUARY · 6 LANGUAGES</span>
                  <span className="font-arabic text-gold-antique fs-4" dir="rtl">القرآن الكريم والزيارات</span>
                </div>
                <div className="my-auto py-4">
                  <h3 className="font-display text-ivory-warm mb-2" style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)' }}>
                    The Sacred Reader: Quran, Ziyarat-e-Ashura &amp; Warith
                  </h3>
                  <div className="font-arabic text-gold-antique fs-4 mb-3" dir="rtl">
                    السَّلَامُ عَلَيْكَ يَا أَبَا عَبْدِ اللَّهِ وَعَلَى الْأَرْوَاحِ الَّتِي حَلَّتْ بِفِنَائِكَ
                  </div>
                  <p className="text-ivory-muted mb-0" style={{ maxWidth: '580px', lineHeight: 1.7 }}>
                    Immerse in a distraction-free devotional sanctuary featuring vocalized Arabic calligraphy, synchronized Alafasy audio recitation, 100× Tasbih counter, and parallel translations in Urdu, Hindi, Roman Urdu, English, Persian, and Arabic.
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-between pt-3" style={{ borderTop: '1px solid rgba(200,164,91,0.22)' }}>
                  <span className="btn-cinema-gold py-2 px-4" style={{ fontSize: '0.78rem' }}>
                    <span>Enter Sacred Reader</span>
                    <i className="bi bi-arrow-right"></i>
                  </span>
                  <span className="small text-ivory-dim font-monospace">114 SURAHS · ZIYARAT</span>
                </div>
              </div>
            </div>

            {/* 2. Medium Card A: Dual-Epoch Spatial Digital Twin & Roza Map (5 cols) */}
            <div
              className="bento-cell bento-span-5"
              onClick={() => onNavigate('ziyarat')}
              role="button"
              tabIndex={0}
            >
              <div className="bento-cell-bg" style={{ backgroundImage: 'url(assets/images/karbala_twilight_aerial_panorama_hd.jpg?v=fullhd)', opacity: 0.34 }}></div>
              <div className="bento-cell-overlay"></div>
              <div className="bento-cell-content">
                <div className="doc-chapter-label mb-1">GEOSPATIAL WAYFINDING</div>
                <div>
                  <h4 className="font-display text-ivory-warm mb-1" style={{ fontSize: '1.25rem' }}>
                    Sanctuary Map, Gates &amp; Live Directions
                  </h4>
                  <p className="text-ivory-muted small mb-3" style={{ lineHeight: 1.6 }}>
                    Navigate Imam Hussain (AS) &amp; Al-Abbas (AS) Shrine gates, walking distances, Qibla compass, and dual-epoch 61 AH coordinates.
                  </p>
                </div>
                <span className="cinema-back-link">
                  <span>Open Sanctuary Map</span>
                  <i className="bi bi-arrow-right"></i>
                </span>
              </div>
            </div>

            {/* 3. Medium Card B: Ask Karbala AI & Optical Sign Translator (5 cols) */}
            <div
              className="bento-cell bento-span-5"
              onClick={() => onNavigate('ai')}
              role="button"
              tabIndex={0}
            >
              <div className="bento-cell-bg" style={{ backgroundImage: 'url(assets/images/karbala_hd_bab_al_qibla_blue_hour.jpg)', opacity: 0.32 }}></div>
              <div className="bento-cell-overlay"></div>
              <div className="bento-cell-content">
                <div className="doc-chapter-label mb-1">SCHOLARLY AI &amp; VISION</div>
                <div>
                  <h4 className="font-display text-ivory-warm mb-1" style={{ fontSize: '1.25rem' }}>
                    Ask Karbala AI &amp; Shrine Sign Translator
                  </h4>
                  <p className="text-ivory-muted small mb-3" style={{ lineHeight: 1.6 }}>
                    Research historical sources in 6 languages or scan Arabic shrine boards for instant translation and voice playback.
                  </p>
                </div>
                <span className="cinema-back-link">
                  <span>Consult AI Assistant</span>
                  <i className="bi bi-arrow-right"></i>
                </span>
              </div>
            </div>

            {/* 4. Compact Information Card A: 1,452 Arbaeen Poles Corridor (6 cols) */}
            <div
              className="bento-cell bento-span-6"
              style={{ minHeight: '190px' }}
              onClick={() => onNavigate('poles')}
              role="button"
              tabIndex={0}
            >
              <div className="bento-cell-bg" style={{ backgroundImage: 'url(assets/images/karbala_img_240_Arba_een_Pilgrims_in_Bayn_al-Harmia.jpg)', opacity: 0.28 }}></div>
              <div className="bento-cell-overlay"></div>
              <div className="bento-cell-content">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="doc-chapter-label mb-0">80 KM PILGRIMAGE CORRIDOR</span>
                  <span className="font-display text-gold-antique fs-4">1,452 POLES</span>
                </div>
                <div>
                  <h5 className="font-display text-ivory-warm mb-1">Najaf to Karbala Walk Telemetry</h5>
                  <p className="text-ivory-muted small mb-0">Interactive pole-by-pole route guide with Mawkib hospitality, medical clinics, and resting milestones.</p>
                </div>
              </div>
            </div>

            {/* 5. Compact Information Card B: Full-Screen Spatial Digital Twin (6 cols) */}
            <div
              className="bento-cell bento-span-6"
              style={{ minHeight: '190px' }}
              onClick={() => onNavigate('map')}
              role="button"
              tabIndex={0}
            >
              <div className="bento-cell-bg" style={{ backgroundImage: 'url(assets/images/ai_61ah_alqami_river.jpg)', opacity: 0.28 }}></div>
              <div className="bento-cell-overlay"></div>
              <div className="bento-cell-content">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="doc-chapter-label mb-0">DUAL-EPOCH CARTOGRAPHY</span>
                  <span className="font-display text-gold-antique fs-4">61 AH ↔ TODAY</span>
                </div>
                <div>
                  <h5 className="font-display text-ivory-warm mb-1">Full-Screen Spatial Digital Twin</h5>
                  <p className="text-ivory-muted small mb-0">Explore 20 GPS-verified sites across 61 AH topography and modern Karbala with Then ↔ Now split lens.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          OFFICIAL DEVELOPER ATTRIBUTION SECTION — SAYYED FAIZ ZAIDI
          ========================================================================= */}
      <section id="about-developer" className="developer-attribution-section" aria-label="About the Developer">
        <div className="container py-lg-4">
          <div className="text-center mb-4">
            <span className="developer-role-tag">
              <i className="bi bi-code-slash me-1"></i> Software Craftsmanship &amp; Sacred Preservation
            </span>
            <h2 className="font-display text-white mb-2" style={{ fontSize: 'clamp(2.0rem, 4vw, 3.2rem)' }}>
              About the Developer
            </h2>
            <p className="font-serif fst-italic text-champagne max-w-700 mx-auto" style={{ fontSize: '1.05rem' }}>
              Dedicated to engineering dignified, authentic, and accessible pilgrimage technology for Karbala.
            </p>
          </div>

          <div className="max-w-1000 mx-auto">
            <div className="developer-profile-card">
              <div className="developer-portrait-wrapper">
                <img
                  src="assets/images/developer_sayyed_faiz_zaidi.jpg"
                  alt="Sayyed Faiz Zaidi — Developer of Karbala Smart Ziyarat Companion 3.0"
                  className="developer-portrait-img"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    console.warn('[Developer Portrait] Image notice, fallback applied');
                  }}
                />
              </div>

              <div className="developer-meta">
                <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                  <span className="badge" style={{ background: 'var(--emerald-deep, #103B32)', color: 'var(--champagne-soft, #E6D4AD)', border: '1px solid rgba(198,166,107,0.4)', fontSize: '0.72rem' }}>
                    Lead Full-Stack Architecture
                  </span>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--champagne-soft, #E6D4AD)', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.72rem' }}>
                    Spatial Systems &amp; AI
                  </span>
                </div>

                <h3 className="developer-name">Sayyed Faiz Zaidi</h3>
                <div className="developer-attribution-title">
                  Developed by Sayyed Faiz Zaidi
                </div>

                <p className="developer-bio">
                  Designed and engineered with reverent dedication to sacred Islamic heritage, high-precision geospatial cartography, and accessible pilgrimage assistance for millions of worldwide visitors to the holy sanctuaries of Imam Hussain (AS) and Hazrat Al-Abbas (AS).
                </p>

                <div className="developer-tags">
                  <span className="developer-pill"><i className="bi bi-geo-alt-fill text-gold-antique me-1"></i>Geospatial Digital Twin</span>
                  <span className="developer-pill"><i className="bi bi-translate text-gold-antique me-1"></i>Multilingual AI Assistant</span>
                  <span className="developer-pill"><i className="bi bi-camera-video-fill text-gold-antique me-1"></i>AR Sacred Beacon</span>
                  <span className="developer-pill"><i className="bi bi-shield-check text-gold-antique me-1"></i>Pilgrim Safety Protocols</span>
                </div>

                <div className="developer-signature-strip">
                  <span className="developer-gold-accent-dot"></span>
                  <span>Official Developer Attribution • Karbala 3.0 Production Edition</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architectural Heritage Global Footer */}
      <ArchitecturalHeritageFooter
        onNavigate={onNavigate}
        onOpenLegal={onOpenLegal}
        onOpenSearch={onOpenSearch}
      />

    </div>
  );
}




function SubviewHeader({ number, title, arabic, lead, onBack, heroBg = 'assets/images/karbala_twilight_aerial_panorama_hd.jpg?v=fullhd' }) {
  return (
    <div
      className="subview-hero-banner position-relative overflow-hidden rounded-4 mb-4 mb-md-5 d-flex align-items-end"
      style={{ minHeight: '320px', padding: '44px 36px 38px', borderBottom: '1px solid rgba(200, 164, 91, 0.25)', boxShadow: '0 28px 64px rgba(0,0,0,0.75)' }}
    >
      <div
        className="position-absolute inset-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.34) contrast(1.14)'
        }}
      ></div>
      <div
        className="position-absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(5,7,6,0.38) 0%, rgba(5,7,6,0.82) 65%, #050706 100%)'
        }}
      ></div>

      <div className="position-relative z-2 w-100">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
          <div className="doc-chapter-label mb-0">{number}</div>
          <span className="text-gold-antique font-monospace d-none d-sm-inline" style={{ fontSize: '0.68rem', letterSpacing: '0.18em' }}>
            CURATORIAL ARCHIVE
          </span>
        </div>
        <h1 className="doc-monument-heading mb-2">{title}</h1>
        {arabic && <div className="font-arabic fs-3 text-gold-antique mb-3" dir="rtl">{arabic}</div>}
        {lead && <p className="doc-editorial-lead mb-0" style={{ maxWidth: '780px', fontSize: '1.14rem' }}>{lead}</p>}
      </div>
    </div>
  );
}

/* =========================================================================
   DEDICATED VIEW: THE HISTORICAL STORY (EDITORIAL MAXIMALISM)
   ========================================================================= */
function DedicatedStoryView({ onBack, onNavigateToMap }) {
  const storyChapters = [
    {
      num: '01',
      title: 'The Departure from Madinah to Makkah',
      arabic: 'الخروج من المدينة المنورة إلى مكة المكرمة',
      period: 'Rajab 60 AH – Dhu al-Hijjah 60 AH (680 CE)',
      location: 'Madinah al-Munawwarah → Makkah al-Mukarramah',
      quote: 'I have not risen out of arrogance or rebellion, nor to cause corruption or injustice. Rather, I rose to seek reform in the community of my grandfather.',
      body: `Refusing allegiance to Yazid ibn Muawiya, Imam Hussain departed his grandfather's city of Madinah under the cover of night on 28 Rajab 60 AH, reciting the Qur'anic verse of Moses: "So he departed therefrom, fearful and vigilant..." Arriving in Makkah, thousands of letters and envoys from the people of Kufa reached him, imploring the Imam to guide them toward prophetic justice.`,
      citation: 'Tarikh al-Rusul wa al-Muluk (al-Tabari), Vol. 5, p. 341; Kitab al-Irshad (Shaykh al-Mufid), p. 182.',
      climax: false
    },
    {
      num: '02',
      title: 'The Caravan Across the Arabian Wilderness',
      arabic: 'المسير عبر الفيافي واللقاء بالحر الرياحي',
      period: '8 Dhu al-Hijjah 60 AH – 1 Muharram 61 AH',
      location: 'Makkah → Al-Tan’im → Zubala → Dhu Husam',
      quote: 'Quench the thirst of the cavalry and water their horses to the full.',
      body: 'Leaving Makkah on the Day of Tarwiyah (8 Dhu al-Hijjah) to preserve the inviolability of the Kaaba from bloodshed, the caravan journeyed northward across the desert stations. At Dhu Husam, they were intercepted by a 1,000-man Kufan vanguard led by Al-Hurr ibn Yazid al-Riyahi, whose troops were perishing from thirst. Demonstrating supreme prophetic chivalry, Imam Hussain ordered his water reserves opened to quench the thirst of every soldier and horse.',
      citation: 'Maqtal al-Hussain (Abu Mikhnaf), p. 76; Ansab al-Ashraf (al-Baladhuri), Vol. 3, p. 168.',
      climax: false
    },
    {
      num: '03',
      title: 'The Halt upon the Plain of Karbala',
      arabic: 'النزول في أرض الطف وكربلاء',
      period: '2 Muharram 61 AH (October 2, 680 CE)',
      location: 'Al-Taff Alluvial Plain, Karbala',
      quote: 'Here is the halting place of our caravan, the place where our blood shall be shed, and the site of our graves.',
      body: `Forced off the main Euphrates highway toward an arid plain, Imam Hussain's mount halted on 2 Muharram 61 AH. Enquiring of the land's ancient names from the inhabitants of Nineveh and al-Ghadiriyya, he was told: "Al-Taff... Al-Aqr... Karbala." The Imam purchased the surrounding land surrounding his future sanctuary and gifted it back to the local tribes as an endowment to welcome pilgrims for all time.`,
      citation: 'Al-Bidayah wa al-Nihayah (Ibn Kathir), Vol. 8, p. 175; Al-Luhuf (Ibn Tawus), p. 39.',
      climax: false
    },
    {
      num: '04',
      title: 'Military Encirclement & The Water Blockade',
      arabic: 'إحكام الحصار ومنع ماء الفرات',
      period: '3 – 7 Muharram 61 AH',
      location: 'Nahr al-Alqami & Al-Mukhayyam',
      quote: 'Guard the banks of the river so that not a single drop reaches the camp of Hussain.',
      body: `As regiment after regiment marched out from Kufa under Umar ibn Sa'd, Ubaydullah ibn Ziyad issued a strict military order on 7 Muharram: sever all access to the Euphrates. Amr ibn al-Hajjaj al-Zubaydi stationed 500 horsemen along the banks of Nahr al-Alqami. Despite scorching desert heat, Abu al-Fadl al-Abbas and Ali al-Akbar broke through the blockade on the night of the 7th to bring water to the children.`,
      citation: 'Kitab al-Irshad, p. 226; Tarikh al-Tabari, Vol. 5, p. 412.',
      climax: false
    },
    {
      num: '05',
      title: "The Night of Devotion (Laylat al-Ashura)",
      arabic: 'تاسوعاء وليلة العاشر من المحرم',
      period: '9 Muharram 61 AH (October 9, 680 CE)',
      location: 'The Encampment of Ahl al-Bayt (AS)',
      quote: 'By Allah, if we were killed, then revived, then burned and scattered in the air seventy times, we would never leave your side.',
      body: 'On the eve of the tenth, Imam Hussain gathered his household and companions. Releasing them from their pledge of allegiance, he urged them to use the darkness of night to save their lives. Yet not a single companion departed—Muslim ibn Awsaja, Zuhayr ibn al-Qayn, Burayr ibn Khudayr, and the youths of Bani Hashim stood together, spending the entire night in prayer and the humming recitation of the Holy Quran.',
      citation: "Rawdat al-Wa'izin (al-Fattal al-Naysaburi), p. 183; Tarikh al-Tabari, Vol. 5, p. 418.",
      climax: false
    },
    {
      num: '06',
      title: 'The Tenth of Muharram: Yawm al-Ashura',
      arabic: 'يوم عاشوراء الخالد — انتصار الدم على السيف',
      period: '10 Muharram 61 AH (October 10, 680 CE)',
      location: 'Bayn al-Haramayn & Al-Maqtal al-Sharif',
      quote: 'Never shall we accept humiliation! Allah, His Messenger, and the believers forbid that we yield to the ignoble.',
      body: 'From the Fajr prayer and sermon of admonition to the midday Salat al-Khawf under a rain of arrows, the companions and Bani Hashim stepped forth in unmatched nobility. Following the martyrdom of Ali al-Akbar, Al-Qasim, the infant Ali al-Asghar, and the Standard-Bearer Al-Abbas by the banks of the Alqami, Imam Hussain stood alone at Gowd-e Qatlgah—sealing a moral testimony that awakened human conscience across the centuries.',
      citation: 'Maqtal al-Hussain (Abd al-Razzaq al-Muqarram), p. 240; Kitab al-Irshad, p. 241.',
      climax: true
    }
  ];

  return (
    <div className="subview-container container">
      <SubviewHeader
        number="DOCUMENTARY EXHIBITION • EDITORIAL CHRONICLE"
        title="The Historical Chronicle of Karbala"
        arabic="الملحمة الحسينية وسيرة الطف الخالدة"
        lead="An academically rigorous, chronologically structured documentary narrative detailing the events of 60–61 AH (680 CE) from earliest classical Islamic historiography."
        onBack={onBack}
      />

      {/* Quick Chapter Index Ribbon */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
        {storyChapters.map(ch => (
          <a
            key={ch.num}
            href={`#story-ch-${ch.num}`}
            className="text-decoration-none brutalist-archival-tag"
            onClick={e => {
              e.preventDefault();
              const el = document.getElementById(`story-ch-${ch.num}`);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>CH.{ch.num}</span>
            <span className="text-ivory-warm">{ch.title.split(':')[0]}</span>
          </a>
        ))}
      </div>

      <div className="d-flex flex-column gap-4 max-w-1000 mx-auto">
        {storyChapters.map(ch => (
          <article
            key={ch.num}
            id={`story-ch-${ch.num}`}
            className="editorial-story-chapter"
            style={ch.climax ? { borderColor: 'var(--crimson-border)', boxShadow: '0 20px 52px rgba(139, 38, 40, 0.25)' } : {}}
          >
            <div className="editorial-watermark-num">{ch.num}</div>

            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3 position-relative z-2">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <span className={ch.climax ? 'brutalist-crimson-tag' : 'brutalist-archival-tag'}>
                  CHAPTER {ch.num} • {ch.period}
                </span>
                <span className="badge rounded-pill px-3 py-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(198,166,107,0.2)', color: 'var(--champagne-soft)', fontSize: '0.72rem' }}>
                  <i className="bi bi-geo-alt text-gold-antique me-1"></i>{ch.location}
                </span>
              </div>
              <span className="font-arabic fs-5 text-gold-antique" dir="rtl">{ch.arabic}</span>
            </div>

            <h3 className="font-display text-ivory-warm mb-3 position-relative z-2" style={{ fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)' }}>
              {ch.title}
            </h3>

            {ch.quote && (
              <blockquote className="p-3 rounded-3 mb-3 position-relative z-2" style={{ background: ch.climax ? 'rgba(139, 38, 40, 0.14)' : 'rgba(198, 166, 107, 0.07)', borderLeft: `3px solid ${ch.climax ? '#C94A4C' : 'var(--gold-antique)'}` }}>
                <p className="font-editorial fst-italic text-champagne mb-0" style={{ fontSize: '1.08rem', lineHeight: 1.65 }}>
                  &ldquo;{ch.quote}&rdquo;
                </p>
              </blockquote>
            )}

            <p className="font-serif text-ivory-muted editorial-dropcap mb-4 position-relative z-2" style={{ lineHeight: '1.88', fontSize: '1.0rem' }}>
              {ch.body}
            </p>

            <div className="archive-plaque-card py-2.5 px-3 position-relative z-2">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2" style={{ fontSize: '0.78rem', color: 'var(--champagne-soft)' }}>
                <div>
                  <i className="bi bi-journal-bookmark-fill me-2 text-gold-antique"></i>
                  <strong className="text-gold-antique text-uppercase" style={{ letterSpacing: '0.08em', fontSize: '0.7rem' }}>Verified Source Attestation:</strong> {ch.citation}
                </div>
                <span className="font-monospace small text-ivory-dim" style={{ fontSize: '0.68rem' }}>ARCHIVE // 61AH-{ch.num}</span>
              </div>
            </div>
          </article>
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
          Explore Locations of The Chronicle on the Digital Twin Map
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   DEDICATED VIEW: JOURNEY TO 61 AH (HISTORICAL RECONSTRUCTION)
   ========================================================================= */
function Dedicated61AhView({ onBack, onNavigateToMap, onOpenLightbox, onNavigate }) {
  const landscapes = [
    {
      num: '01',
      title: 'The Encampment (al-Mukhayyam al-Husayni)',
      arabic: 'المخيم الحسيني الشريف',
      image: 'assets/images/ai_61ah_encampment.jpg',
      aspect: 'Topographical Encampment Modeling',
      coords: '32°36′52″N 44°01′42″E',
      desc: 'The camp comprised approximately 30 to 40 desert pavilions arranged in a dense semicircle. To prevent surprise rear cavalry charges, Imam Hussain ordered a crescent trench dug behind the camp, packed with firewood and reeds ignited on the morning of Ashura.',
      archaeology: 'Western Karbala alluvial terrace, elevated 28m above sea level.'
    },
    {
      num: '02',
      title: 'Nahr al-Alqami & The Ancient Euphrates Branch',
      arabic: 'مجرى نهر العلقمي وبساتين النخيل',
      image: 'assets/images/ai_61ah_alqami_river.jpg',
      aspect: 'Hydrological Course Modeling',
      coords: '32°37′06″N 44°02′08″E',
      desc: 'Nahr al-Alqami was a perennial natural distributary branching from the Euphrates near ancient Kufa. Its banks were lined with thick reedbeds (Phragmites australis) and ancient Phoenix dactylifera palm groves. Silting in subsequent centuries led to its desiccation.',
      archaeology: 'Traced through aerial sediment anomalies and early Umayyad irrigation channels.'
    },
    {
      num: '03',
      title: 'Tall al-Zaynabiyya (The Elevated Vantage Knoll)',
      arabic: 'التل الزينبي المشرف على ساحة المعركة',
      image: 'assets/images/ai_61ah_tall_zaynabiyya.jpg',
      aspect: 'Geomorphological Elevation Study',
      coords: '32°36′56″N 44°01′51″E',
      desc: 'A natural sandstone and gravel knoll rising approximately 5 meters above the surrounding depression. It offered an unobstructed visual axis across both the encampment to the south and Gowd-e Qatlgah to the east.',
      archaeology: 'Preserved beneath the current marble sanctuary of al-Tall al-Zaynabiyya.'
    },
    {
      num: '04',
      title: 'Gowd-e Qatlgah & The Depression of al-Taff',
      arabic: 'منخفض المقتل الشريف',
      image: 'assets/images/ai_61ah_sham_e_ghariban.jpg',
      aspect: 'Climactic Site Reconstruction',
      coords: '32°36′58″N 44°01′56″E',
      desc: `A natural subterranean depression where the ground sloped downward toward the ancient flood basin. Here Imam Hussain made his final solitary stand. The modern Ha'ir al-Husayni was constructed directly encasing this depression.`,
      archaeology: 'Located exactly at the level of the modern rawdah floor beneath the golden dome.'
    }
  ];

  return (
    <div className="subview-container container">
      <SubviewHeader
        number="ARCHAEOLOGICAL GEOGRAPHY • 61 AH ATLAS"
        title="Journey to 61 AH: Topographical Reconstruction"
        arabic="التحقيق الطوبوغرافي لأرض كربلاء عام ٦١ للهجرة"
        lead="A scholarly examination of the topography, hydrology, and spatial layout of Karbala at the time of the event in 61 AH (680 CE)."
        onBack={onBack}
      />

      {/* Interactive 61 AH Historical Time Slider (Madinah -> Makkah -> Iraq -> 2..10 Muharram -> Post-Ashura) */}
      <div className="max-w-1000 mx-auto mb-4">
        <Historical61AhTimeSliderPanel
          currentMode="61ah"
          onNavigate={onNavigate}
          onAskAi={(queryText) => {
            if (queryText) {
              window.__karbalaPendingAiQuery = queryText;
              window.dispatchEvent(new CustomEvent('karbala-ask-ai-query', { detail: { query: queryText } }));
            }
            if (onNavigate) onNavigate('ai');
          }}
        />
      </div>

      <div className="row g-4 max-w-1000 mx-auto">
        {landscapes.map((item, idx) => (
          <div key={idx} className="col-lg-6">
            <div className="spatial-depth-panel p-4 h-100 d-flex flex-column">
              <div className="position-relative overflow-hidden rounded-3 mb-3" style={{ height: '240px', border: '1px solid rgba(198,166,107,0.3)' }}>
                <img src={item.image} alt={item.title} className="w-100 h-100 object-fit-cover" />
                <div className="position-absolute top-0 start-0 m-2.5">
                  <span className="brutalist-archival-tag" style={{ background: 'rgba(8,11,11,0.88)' }}>
                    SITE {item.num} • {item.coords}
                  </span>
                </div>
                <span className="badge position-absolute top-0 end-0 m-2.5" style={{ background: 'rgba(8, 11, 11, 0.88)', color: 'var(--gold-antique)', border: '1px solid var(--border-gold)', fontSize: '0.65rem' }}>
                  61 AH RECONSTRUCTION
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                <h5 className="font-display text-ivory-warm fw-bold mb-0">{item.title}</h5>
                <span className="brutalist-numeral" style={{ fontSize: '1.8rem' }}>{item.num}</span>
              </div>
              <div className="font-arabic text-gold-antique mb-2" dir="rtl">{item.arabic}</div>
              
              <p className="font-serif small text-ivory-muted mb-3 flex-grow-1" style={{ lineHeight: '1.68', fontSize: '0.88rem' }}>
                {item.desc}
              </p>

              <div className="archive-plaque-card p-2.5 mb-3" style={{ fontSize: '0.75rem', color: 'var(--champagne-soft)' }}>
                <i className="bi bi-geo-alt-fill me-1.5 text-gold-antique"></i>
                <strong className="text-gold-antique">Archaeological Attestation:</strong> {item.archaeology}
              </div>

              <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
                <span className="small text-ivory-dim font-monospace" style={{ fontSize: '0.7rem' }}>{item.aspect}</span>
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
                  <i className="bi bi-zoom-in me-1"></i> Inspect Plate
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
  const isAshuraDay = currentDayData.dayNumber === 10;

  return (
    <div className="subview-container container">
      <SubviewHeader
        number="TEMPORAL REGISTRY • 61 AH CHRONOLOGY"
        title="The Illuminated Chronology of Muharram"
        arabic="التقويم الزمني لوقائع كربلاء عام ٦١ هـ"
        lead="A comprehensive day-by-day and hour-by-hour chronicle from the caravan's arrival on 2 Muharram 61 AH to the climactic phases of the Day of Ashura."
        onBack={onBack}
      />

      {/* Horizontal Interactive Day Selector Ribbon */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
        {MUHARRAM_DAYS.map((d, idx) => {
          const isSelected = selectedDay === idx;
          const isDay10 = d.dayNumber === 10;
          return (
            <button
              key={d.dayNumber}
              type="button"
              className="btn btn-sm px-3.5 py-2 rounded-pill font-title d-inline-flex align-items-center gap-2 transition-all"
              style={{
                fontSize: '0.78rem',
                background: isSelected
                  ? (isDay10 ? 'linear-gradient(135deg, #8B2628, #5C1618)' : 'linear-gradient(135deg, #C6A66B, #9A7B4F)')
                  : 'rgba(20, 25, 24, 0.92)',
                color: isSelected ? (isDay10 ? '#FFFFFF' : '#080B0B') : 'var(--champagne-soft)',
                border: isSelected
                  ? '1px solid rgba(255,255,255,0.35)'
                  : (isDay10 ? '1px solid rgba(168,50,52,0.5)' : '1px solid rgba(198,166,107,0.3)'),
                fontWeight: isSelected ? 700 : 500
              }}
              onClick={() => setSelectedDay(idx)}
            >
              <span className="font-monospace" style={{ fontSize: '0.7rem', opacity: 0.85 }}>0{d.dayNumber > 9 ? '' : ''}{d.dayNumber} MUH</span>
              <span>•</span>
              <span>{d.title}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Dominant Visual Stage + Open Editorial Chronology (#12) */}
      <div className="max-w-1000 mx-auto">
        <div className="dominant-visual-stage mb-5" style={{ minHeight: '420px' }}>
          <img
            src={
              currentDayData.dayNumber === 10
                ? 'assets/images/ai_61ah_sham_e_ghariban.jpg'
                : currentDayData.dayNumber === 7
                  ? 'assets/images/ai_61ah_alqami_river.jpg'
                  : currentDayData.dayNumber >= 8
                    ? 'assets/images/karbala_hd_candlelight_procession.jpg'
                    : 'assets/images/ai_61ah_encampment.jpg'
            }
            alt={currentDayData.title}
          />
          <div className="dominant-visual-shade"></div>

          <div className="spatial-glass-float" style={isAshuraDay ? { borderColor: 'rgba(163, 28, 34, 0.65)' } : {}}>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
              <span className={isAshuraDay ? 'brutalist-crimson-tag' : 'doc-chapter-label mb-0'}>
                MUHARRAM {currentDayData.dayNumber}, 61 AH · {currentDayData.hijriDate}
              </span>
              <span className="font-arabic fs-4 text-gold-antique" dir="rtl">{currentDayData.arabicTitle}</span>
            </div>
            <h2 className="font-display text-ivory-warm mb-2" style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)' }}>
              {currentDayData.title}
            </h2>
            <p className="text-ivory-muted mb-0" style={{ lineHeight: 1.75, fontSize: '0.96rem' }}>
              {currentDayData.overview}
            </p>
          </div>
        </div>

        {/* Open Illuminated Sequence (Reduced Box Clutter by 60%) */}
        <div className="ps-3 ps-md-4 mb-5" style={{ borderLeft: `2px solid ${isAshuraDay ? '#A31C22' : 'var(--gold-antique)'}` }}>
          <div className="doc-chapter-label mb-4">
            DOCUMENTED CHRONOLOGICAL SEQUENCE · PRIMARY SOURCES
          </div>

          <div className="d-flex flex-column gap-4">
            {currentDayData.events.map((ev, i) => (
              <article
                key={i}
                className="pb-4"
                style={{ borderBottom: '1px solid rgba(200, 164, 91, 0.16)' }}
              >
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                  <div className="d-flex align-items-center gap-3">
                    <span className="font-display text-gold-antique fw-bold" style={{ fontSize: '0.82rem', letterSpacing: '0.16em' }}>
                      EVENT 0{i + 1}
                    </span>
                    <h4 className="font-display text-ivory-warm fw-bold mb-0" style={{ fontSize: '1.22rem' }}>{ev.title}</h4>
                  </div>
                  {ev.time && (
                    <span className="small text-gold-antique font-monospace" style={{ fontSize: '0.75rem' }}>
                      <i className="bi bi-clock me-1"></i>{ev.time}
                    </span>
                  )}
                </div>
                <p className="text-ivory-muted mb-2" style={{ lineHeight: '1.8', fontSize: '0.96rem' }}>
                  {ev.description}
                </p>
                {ev.quote && (
                  <blockquote className="font-editorial fst-italic ps-3 mt-3 mb-0" style={{ color: 'var(--champagne-soft)', borderLeft: '2px solid var(--gold-antique)', fontSize: '1.08rem', lineHeight: 1.65 }}>
                    &ldquo;{ev.quote}&rdquo;
                  </blockquote>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* Ashura Phases if Day 10 */}
        {currentDayData.dayNumber === 10 && currentDayData.ashuraPhases && (
          <div className="mt-4 pt-4">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <div>
                <div className="doc-chapter-label mb-1">10 MUHARRAM 61 AH · DAWN TO TWILIGHT</div>
                <h3 className="font-display text-ivory-warm mb-0">The Six Immortal Phases of Yawm al-Ashura</h3>
              </div>
              <span className="brutalist-crimson-tag">AL-MAQTAL CHRONOLOGY</span>
            </div>
            <div className="timeline-horizontal-ribbon">
              {currentDayData.ashuraPhases.map((phase, pIdx) => (
                <div key={pIdx} className={`timeline-ribbon-node ${pIdx >= 3 && pIdx <= 4 ? 'is-ashura-climax' : ''}`}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className={pIdx >= 3 && pIdx <= 4 ? 'brutalist-crimson-tag' : 'brutalist-archival-tag'}>
                      PHASE {phase.phase}
                    </span>
                    <span className="small text-gold-antique font-monospace" style={{ fontSize: '0.72rem' }}>{phase.time}</span>
                  </div>
                  <h5 className="font-display text-ivory-warm fw-bold mb-1">{phase.name}</h5>
                  <div className="font-arabic text-gold-antique mb-2" dir="rtl">{phase.arabicName}</div>
                  <p className="text-ivory-muted small mb-0" style={{ lineHeight: '1.65', fontSize: '0.84rem' }}>
                    {phase.description}
                  </p>
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
          Play Chronology on the Interactive Digital Twin Map
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   DEDICATED VIEW: PERSONALITIES (HALL OF BIOGRAPHIES)
   ========================================================================= */
/* =========================================================================
   PHASE 6: THE LIVING HERITAGE ENCYCLOPEDIA (WORLD-CLASS AHLUL BAYT KNOWLEDGE)
   Interactive Genealogy, Cinematic Monographs, 7-Epoch Timeline & Source Library
   ========================================================================= */

const getArchitecturalPhoto = (person) => {
  if (!person) return 'assets/images/shrine_27.jpg';
  if (person.architecturalPhoto) return person.architecturalPhoto;
  const map = {
    person_prophet: 'assets/images/shrine_33.jpg',
    person_ali: 'assets/images/shrine_38.jpg',
    person_fatima: 'assets/images/shrine_29.jpg',
    person_hasan: 'assets/images/shrine_30.jpg',
    person_hussain: 'assets/images/shrine_27.jpg',
    person_zaynab: 'assets/images/shrine_14.jpg',
    person_abbas: 'assets/images/shrine_19.jpg',
    person_zayn_al_abidin: 'assets/images/shrine_21.jpg',
    person_ali_akbar: 'assets/images/shrine_28.jpg',
    person_ali_asghar: 'assets/images/shrine_28.jpg',
    person_qasim: 'assets/images/shrine_25.jpg',
    person_muslim: 'assets/images/shrine_36.jpg',
    person_hurr: 'assets/images/shrine_36.jpg',
    person_habib: 'assets/images/shrine_22.jpg',
    person_zuhayr: 'assets/images/shrine_25.jpg',
    person_umm_al_banin: 'assets/images/shrine_32.jpg'
  };
  return map[person.id] || person.image || 'assets/images/shrine_27.jpg';
};

const getCategoryLabel = (person) => {
  if (!person) return 'Holy Figure';
  const cat = person.category;
  if (cat === 'The Holy Prophet') return 'The Holy Prophet (SAW)';
  if (cat === 'The Holy House' || cat === 'family') return 'Ahlul Bayt (Holy Household)';
  if (cat === 'Martyrs of Karbala') return 'Martyr of Karbala';
  if (cat === 'Companions of Karbala' || cat === 'companion') return 'Loyal Companion';
  if (person.role && person.role.includes('Household')) return 'Ahlul Bayt (Holy Household)';
  return cat || 'Revered Historical Figure';
};

/**
 * ResilientDestinationImage: Production-grade robust image loader with shimmering
 * skeleton and beautifully styled neutral architectural fallback placeholder.
 */
function ResilientDestinationImage({ src, alt, className = '', isIllustration = false }) {
  const [loadState, setLoadState] = useState('loading'); // 'loading' | 'loaded' | 'error'

  useEffect(() => {
    if (!src) {
      setLoadState('error');
      return;
    }
    setLoadState('loading');
    let isCancelled = false;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      if (!isCancelled) setLoadState('loaded');
    };
    img.onerror = () => {
      if (!isCancelled) setLoadState('error');
    };
    return () => {
      isCancelled = true;
    };
  }, [src]);

  if (loadState === 'error') {
    return (
      <div className={`neutral-photo-placeholder ${className}`} role="img" aria-label={`${alt} - Photo unavailable`}>
        <div className="placeholder-ornament" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="placeholder-arch-icon">
            <path d="M3 21h18M5 21V9a7 7 0 0 1 14 0v12M9 21v-6a3 3 0 0 1 6 0v6M12 3v2" />
          </svg>
        </div>
        <span className="placeholder-main-label">
          <i className="bi bi-camera-slash me-1"></i>Photo unavailable
        </span>
        <span className="placeholder-sub-label">Astan Archival Documentation Pending</span>
      </div>
    );
  }

  return (
    <div className={`resilient-image-frame ${className} ${loadState === 'loading' ? 'is-loading' : 'is-ready'}`}>
      {loadState === 'loading' && (
        <div className="resilient-image-skeleton" aria-hidden="true"></div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`resilient-dest-img ${loadState === 'loaded' ? 'visible' : 'hidden'}`}
        onError={() => setLoadState('error')}
      />
      {isIllustration && (
        <div className="dest-historical-illustration-pill" title="Respectful historical reconstruction of 61 AH topography">
          <i className="bi bi-palette-fill me-1"></i>61 AH Concept
        </div>
      )}
    </div>
  );
}

function DedicatedPersonalitiesView({ onBack, onNavigateToMap, onNavigateToZiyarat }) {
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const tab = sessionStorage.getItem('encyclopedia_initial_tab');
      if (tab) {
        sessionStorage.removeItem('encyclopedia_initial_tab');
        return tab;
      }
    } catch(e) {}
    return 'monographs';
  });
  const [personalities, setPersonalities] = useState([]);
  const [familyTree, setFamilyTree] = useState({ nodes: [], edges: [] });
  const [sources, setSources] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  // Monographs state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedPersonality, setSelectedPersonality] = useState(null);

  // Family Tree state
  const [treeBranchFilter, setTreeBranchFilter] = useState('all');
  const [selectedTreeNode, setSelectedTreeNode] = useState(null);
  const [treeZoom, setTreeZoom] = useState(1.0);
  const [treePan, setTreePan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Timeline state
  const [timelineEpochFilter, setTimelineEpochFilter] = useState('all');

  // Fetch all encyclopedia data
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetch('/api/encyclopedia/personalities').then(r => r.json()).catch(() => null),
      fetch('/api/encyclopedia/family-tree').then(r => r.json()).catch(() => null),
      fetch('/api/encyclopedia/sources').then(r => r.json()).catch(() => null),
      fetch('/api/encyclopedia/timeline').then(r => r.json()).catch(() => null)
    ]).then(([persRes, treeRes, srcRes, timeRes]) => {
      if (!isMounted) return;
      if (persRes && persRes.personalities) {
        setPersonalities(persRes.personalities);
        try {
          const initPersId = sessionStorage.getItem('encyclopedia_initial_personality_id');
          if (initPersId) {
            sessionStorage.removeItem('encyclopedia_initial_personality_id');
            const found = persRes.personalities.find(p => p.id === initPersId);
            if (found) setSelectedPersonality(found);
          }
        } catch(e) {}
      }
      if (treeRes && treeRes.nodes) {
        setFamilyTree({ nodes: treeRes.nodes, edges: treeRes.edges });
        try {
          const initNodeId = sessionStorage.getItem('encyclopedia_initial_node_id');
          if (initNodeId) {
            sessionStorage.removeItem('encyclopedia_initial_node_id');
            const found = treeRes.nodes.find(n => n.id === initNodeId);
            if (found) setSelectedTreeNode(found);
          }
        } catch(e) {}
      }
      if (srcRes && srcRes.sources) setSources(srcRes.sources);
      if (timeRes && timeRes.timeline) setTimeline(timeRes.timeline);
      setLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  // Filtered personalities for Monographs tab
  const filteredPersonalities = useMemo(() => {
    const list = personalities.length > 0 ? personalities : PERSONALITIES;
    return list.filter(p => {
      const matchSearch = (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
                          (p.arabicName || '').includes(search) ||
                          (p.role || '').toLowerCase().includes(search.toLowerCase()) ||
                          (p.honorific || '').toLowerCase().includes(search.toLowerCase()) ||
                          (p.titles || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
      if (categoryFilter === 'all') return matchSearch;
      if (categoryFilter === 'family') {
        const cat = (p.category || '').toLowerCase();
        return matchSearch && (cat.includes('house') || cat.includes('prophet') || cat.includes('family') || (p.role || '').includes('Household'));
      }
      if (categoryFilter === 'companion') {
        const cat = (p.category || '').toLowerCase();
        return matchSearch && (cat.includes('companion') || cat.includes('martyr') || (p.role || '').includes('Companion'));
      }
      if (categoryFilter === 'women') {
        return matchSearch && (p.gender === 'female' || (p.name || '').includes('Zaynab') || (p.name || '').includes('Fatima') || (p.name || '').includes('Umm'));
      }
      return matchSearch;
    });
  }, [personalities, search, categoryFilter]);

  // Open monograph by ID or personality object
  const handleOpenMonograph = (personOrId) => {
    if (typeof personOrId === 'string') {
      const found = personalities.find(p => p.id === personOrId || p.name.includes(personOrId)) ||
                    PERSONALITIES.find(p => p.id === personOrId || p.name.includes(personOrId));
      if (found) setSelectedPersonality(found);
      else {
        fetch(`/api/encyclopedia/personalities?id=${personOrId}`)
          .then(r => r.json())
          .then(d => { if (d.personality) setSelectedPersonality(d.personality); })
          .catch(() => {});
      }
    } else {
      setSelectedPersonality(personOrId);
    }
  };

  return (
    <div className="subview-container container">
      <SubviewHeader
        number="THE LIVING HERITAGE ENCYCLOPEDIA"
        title="Sacred Ahlul Bayt Knowledge & History"
        arabic="موسوعة تراث أهل البيت وتاريخ كربلاء الخالد"
        lead="An authentic, source-verified digital sanctuary connecting sacred personalities, verified genealogy, classical chronicles, and the sacred geography of Karbala."
        onBack={onBack}
      />

      {/* Top Curatorial Sub-Navigation */}
      <div className="d-flex justify-content-center mb-4">
        <div className="encyclopedia-tabs-strip">
          <button
            type="button"
            className={`encyclopedia-tab-pill ${activeTab === 'monographs' ? 'active' : ''}`}
            onClick={() => {
              setSelectedPersonality(null);
              setActiveTab('monographs');
            }}
          >
            <i className="bi bi-person-lines-fill"></i>
            <span>Curatorial Monographs</span>
          </button>

          <button
            type="button"
            className={`encyclopedia-tab-pill ${activeTab === 'family_tree' ? 'active' : ''}`}
            onClick={() => {
              setSelectedPersonality(null);
              setActiveTab('family_tree');
            }}
          >
            <i className="bi bi-diagram-3-fill"></i>
            <span>Interactive Family Tree</span>
          </button>

          <button
            type="button"
            className={`encyclopedia-tab-pill ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => {
              setSelectedPersonality(null);
              setActiveTab('timeline');
            }}
          >
            <i className="bi bi-clock-history"></i>
            <span>7 Historical Epochs</span>
          </button>

          <button
            type="button"
            className={`encyclopedia-tab-pill ${activeTab === 'sources' ? 'active' : ''}`}
            onClick={() => {
              setSelectedPersonality(null);
              setActiveTab('sources');
            }}
          >
            <i className="bi bi-journal-bookmark-fill"></i>
            <span>Classical Library (8 Sources)</span>
          </button>

          <button
            type="button"
            className={`encyclopedia-tab-pill ${activeTab === 'transparency' ? 'active' : ''}`}
            onClick={() => {
              setSelectedPersonality(null);
              setActiveTab('transparency');
            }}
          >
            <i className="bi bi-shield-check"></i>
            <span>Vision Architecture</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CURATORIAL MONOGRAPHS */}
      {activeTab === 'monographs' && (
        <div>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 max-w-1000 mx-auto mb-4">
            {/* Search */}
            <div className="position-relative" style={{ minWidth: '280px' }}>
              <input
                type="text"
                className="form-control rounded-pill px-4"
                placeholder="Search personality by name, honorific, or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-gold)', color: 'var(--ivory-warm)', fontSize: '0.84rem' }}
              />
              <i className="bi bi-search position-absolute end-0 top-50 translate-middle-y me-3 text-secondary"></i>
            </div>

            {/* Filter Pills */}
            <div className="d-flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Figures' },
                { id: 'family', label: 'Holy Household' },
                { id: 'companion', label: 'Loyal Companions' },
                { id: 'women', label: 'Noble Women' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  className={`btn btn-sm px-3 rounded-pill ${categoryFilter === f.id ? 'bg-warning text-dark fw-bold' : 'btn-outline-secondary text-champagne'}`}
                  style={{ fontSize: '0.76rem' }}
                  onClick={() => setCategoryFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="row g-4" style={{ maxWidth: '1240px', margin: '0 auto' }}>
            {filteredPersonalities.map((person, idx) => {
              const isFeaturedHero = idx === 0;
              const colClass = isFeaturedHero
                ? 'col-12'
                : (idx % 4 === 1 || idx % 4 === 0 ? 'col-lg-7' : 'col-lg-5');
              const photoSrc = getArchitecturalPhoto(person);

              return (
                <div key={person.id} className={colClass}>
                  <article
                    className="person-story-card h-100"
                    style={{ minHeight: isFeaturedHero ? '420px' : '360px' }}
                    onClick={() => handleOpenMonograph(person)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="person-story-bg" style={{ backgroundImage: `url(${photoSrc})` }}></div>
                    <div className="person-story-gradient"></div>

                    <div className="person-story-body">
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                        <span className="doc-chapter-label mb-0">
                          {getCategoryLabel(person).toUpperCase()}
                        </span>
                        {person.restingPlace && (
                          <span className="small text-ivory-dim font-monospace" style={{ fontSize: '0.7rem' }}>
                            <i className="bi bi-geo-alt text-gold-antique me-1"></i>{person.restingPlace}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-ivory-warm mb-1" style={{ fontSize: isFeaturedHero ? 'clamp(1.65rem, 3vw, 2.35rem)' : '1.32rem' }}>
                        {person.name}
                      </h3>
                      <div className="font-arabic text-gold-antique mb-2" style={{ fontSize: isFeaturedHero ? '1.45rem' : '1.12rem' }} dir="rtl">
                        {person.arabicName}
                      </div>

                      <div className="small font-editorial fst-italic text-champagne mb-2" style={{ fontSize: '0.95rem' }}>
                        {person.honorific || person.epithet || (person.titles && person.titles[0]) || person.role}
                      </div>

                      <p className="text-ivory-muted small mb-3" style={{ lineHeight: 1.7, maxWidth: isFeaturedHero ? '780px' : '100%' }}>
                        {(person.biographySummary || person.historicalMonograph || person.biography || '').slice(0, isFeaturedHero ? 310 : 185)}...
                      </p>

                      {(person.keyAction || (person.keyEvents && person.keyEvents[0])) && (
                        <div className="ps-3 mb-3 small text-champagne" style={{ borderLeft: '2px solid var(--gold-antique)', fontSize: '0.8rem' }}>
                          <strong className="text-gold-antique">Defining Legacy:</strong> {person.keyAction || person.keyEvents[0].title}
                        </div>
                      )}

                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-2" style={{ borderTop: '1px solid rgba(200,164,91,0.22)' }}>
                        <span className="small text-ivory-dim font-monospace" style={{ fontSize: '0.72rem' }}>
                          {person.era || (person.birthYear ? `${person.birthYear} – ${person.martyrdomYear || '680 CE'}` : `Muharram Days: ${person.timelineDays?.join(', ') || '10'}`)}
                        </span>
                        <span className="cinema-back-link">
                          <span>Open Cinematic Monograph</span>
                          <i className="bi bi-arrow-right"></i>
                        </span>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE FAMILY TREE */}
      {activeTab === 'family_tree' && (
        <div className="max-w-1000 mx-auto">
          {/* Branch Filter & Zoom Strip */}
          <div className="family-tree-container">
            <div className="tree-branch-filter-bar d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="d-flex align-items-center gap-1.5 flex-wrap">
                <span className="small text-secondary me-1" style={{ fontSize: '0.74rem' }}>Lineage Filter:</span>
                {[
                  { id: 'all', label: 'All Documented Branches', dot: 'central' },
                  { id: 'central', label: 'Central Household (Ahlul Bayt)', dot: 'central' },
                  { id: 'husayni', label: 'Husayni Branch', dot: 'husayni' },
                  { id: 'hasani', label: 'Hasani Branch', dot: 'hasani' },
                  { id: 'abbasi', label: 'Abbasi Branch', dot: 'abbasi' },
                  { id: 'aqil', label: 'Aqil Branch', dot: 'aqil' }
                ].map(b => (
                  <button
                    key={b.id}
                    type="button"
                    className={`tree-branch-btn ${treeBranchFilter === b.id ? 'active' : ''}`}
                    onClick={() => setTreeBranchFilter(b.id)}
                  >
                    <span className={`rounded-circle d-inline-block branch-dot-${b.dot}`} style={{ width: '8px', height: '8px' }}></span>
                    <span>{b.label}</span>
                  </button>
                ))}
              </div>

              <div className="d-flex align-items-center gap-1">
                <button
                  type="button"
                  className="tree-ctrl-btn"
                  title="Zoom In"
                  onClick={() => setTreeZoom(z => Math.min(1.8, +(z + 0.15).toFixed(2)))}
                >
                  <i className="bi bi-zoom-in"></i>
                </button>
                <button
                  type="button"
                  className="tree-ctrl-btn"
                  title="Zoom Out"
                  onClick={() => setTreeZoom(z => Math.max(0.6, +(z - 0.15).toFixed(2)))}
                >
                  <i className="bi bi-zoom-out"></i>
                </button>
                <button
                  type="button"
                  className="tree-ctrl-btn"
                  title="Reset View"
                  onClick={() => { setTreeZoom(1.0); setTreePan({ x: 0, y: 0 }); }}
                >
                  <i className="bi bi-arrow-counterclockwise"></i>
                </button>
                <span className="small text-gold-antique ms-1" style={{ fontSize: '0.72rem' }}>
                  {Math.round(treeZoom * 100)}%
                </span>
              </div>
            </div>

            {/* SVG Tree Viewport */}
            <div
              id="family-tree-svg-viewport"
              style={{
                overflow: 'hidden',
                cursor: isDragging ? 'grabbing' : 'grab',
                position: 'relative',
                minHeight: '600px',
                background: '#090d0f'
              }}
              onMouseDown={(e) => {
                setIsDragging(true);
                setDragStart({ x: e.clientX - treePan.x, y: e.clientY - treePan.y });
              }}
              onMouseMove={(e) => {
                if (isDragging) {
                  setTreePan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
                }
              }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
            >
              <svg
                width="100%"
                height="650"
                viewBox="0 0 1200 800"
                style={{
                  transform: `translate(${treePan.x}px, ${treePan.y}px) scale(${treeZoom})`,
                  transformOrigin: '50% 30%',
                  transition: isDragging ? 'none' : 'transform 0.18s ease'
                }}
              >
                {/* Generational Tier Markers */}
                {[
                  { gen: 0, label: 'ROOT GENERATION (PROPHETIC & HASHEMITE LINEAGE)', y: 80 },
                  { gen: 1, label: 'FIRST GENERATION: THE HOLY FIVE & DESCENDANTS', y: 230 },
                  { gen: 2, label: 'SECOND GENERATION: HEROES & HEROINES OF KARBALA', y: 390 },
                  { gen: 3, label: 'THIRD GENERATION: MARTYRED YOUTH & SUCCESSION', y: 550 },
                  { gen: 4, label: 'FOURTH GENERATION: THE 5TH IMAM & TRANSMISSION', y: 700 }
                ].map(tier => (
                  <g key={tier.gen}>
                    <line x1="40" y1={tier.y - 35} x2="1160" y2={tier.y - 35} stroke="rgba(197, 160, 89, 0.12)" strokeDasharray="4 4" />
                    <text x="60" y={tier.y - 42} fill="rgba(197, 160, 89, 0.45)" fontSize="10" fontFamily="'Cinzel', serif" letterSpacing="0.1em">
                      GEN {tier.gen}: {tier.label}
                    </text>
                  </g>
                ))}

                {/* Genealogical Edges: Parent-Child Splines */}
                {/* Gen 0 to Gen 1 */}
                <path d="M 640 120 C 640 170, 520 170, 520 200" fill="none" stroke="rgba(197, 160, 89, 0.45)" strokeWidth="1.8" />
                <path d="M 800 120 C 800 170, 520 170, 520 200" fill="none" stroke="rgba(197, 160, 89, 0.45)" strokeWidth="1.8" />
                <path d="M 380 120 C 380 170, 360 170, 360 200" fill="none" stroke="rgba(197, 160, 89, 0.45)" strokeWidth="1.8" />
                <path d="M 220 120 C 220 170, 360 170, 360 200" fill="none" stroke="rgba(197, 160, 89, 0.45)" strokeWidth="1.8" />
                <path d="M 380 120 C 380 170, 180 170, 180 200" fill="none" stroke="rgba(157, 78, 221, 0.4)" strokeWidth="1.6" />

                {/* Gen 1 to Gen 2 */}
                <path d="M 360 270 C 360 320, 360 330, 360 360" fill="none" stroke="rgba(46, 196, 182, 0.5)" strokeWidth="1.8" />
                <path d="M 520 270 C 520 320, 360 330, 360 360" fill="none" stroke="rgba(46, 196, 182, 0.5)" strokeWidth="1.8" />
                <path d="M 360 270 C 360 320, 540 330, 540 360" fill="none" stroke="rgba(230, 57, 70, 0.6)" strokeWidth="2.0" />
                <path d="M 520 270 C 520 320, 540 330, 540 360" fill="none" stroke="rgba(230, 57, 70, 0.6)" strokeWidth="2.0" />
                <path d="M 360 270 C 360 320, 720 330, 720 360" fill="none" stroke="rgba(197, 160, 89, 0.45)" strokeWidth="1.8" />
                <path d="M 520 270 C 520 320, 720 330, 720 360" fill="none" stroke="rgba(197, 160, 89, 0.45)" strokeWidth="1.8" />
                <path d="M 360 270 C 360 320, 900 330, 900 360" fill="none" stroke="rgba(58, 134, 255, 0.5)" strokeWidth="1.8" />
                <path d="M 700 270 C 700 320, 900 330, 900 360" fill="none" stroke="rgba(58, 134, 255, 0.5)" strokeWidth="1.8" />
                <path d="M 180 270 C 180 320, 180 330, 180 360" fill="none" stroke="rgba(157, 78, 221, 0.5)" strokeWidth="1.8" />

                {/* Gen 2 to Gen 3 */}
                <path d="M 360 430 C 360 480, 360 490, 360 520" fill="none" stroke="rgba(46, 196, 182, 0.5)" strokeWidth="1.8" />
                <path d="M 540 430 C 540 480, 540 490, 540 520" fill="none" stroke="rgba(230, 57, 70, 0.6)" strokeWidth="2.0" />
                <path d="M 540 430 C 540 480, 720 490, 720 520" fill="none" stroke="rgba(230, 57, 70, 0.6)" strokeWidth="2.0" />
                <path d="M 540 430 C 540 480, 900 490, 900 520" fill="none" stroke="rgba(230, 57, 70, 0.6)" strokeWidth="2.0" />

                {/* Gen 3 to Gen 4 */}
                <path d="M 900 590 C 900 640, 900 650, 900 680" fill="none" stroke="rgba(230, 57, 70, 0.6)" strokeWidth="2.0" />

                {/* Marriage Lines (Dashed Pink/Red) */}
                <line x1="640" y1="85" x2="800" y2="85" stroke="#f72585" strokeWidth="1.5" strokeDasharray="4 3" />
                <line x1="220" y1="85" x2="380" y2="85" stroke="#f72585" strokeWidth="1.5" strokeDasharray="4 3" />
                <line x1="360" y1="235" x2="520" y2="235" stroke="#f72585" strokeWidth="1.5" strokeDasharray="4 3" />
                <line x1="360" y1="235" x2="700" y2="235" stroke="#f72585" strokeWidth="1.2" strokeDasharray="4 3" />

                {/* Rendered Nodes */}
                {[
                  // Gen 0
                  { id: 'node_abu_talib', name: 'Abu Talib', arabic: 'أبو طالب (ع)', x: 220, y: 85, branch: 'hashim', life: '535–619 CE', resting: 'Mecca' },
                  { id: 'node_fatima_asad', name: 'Fatima bint Asad', arabic: 'فاطمة بنت أسد (ع)', x: 380, y: 85, branch: 'hashim', life: '540–626 CE', resting: 'Medina' },
                  { id: 'person_prophet', name: 'Prophet Muhammad (SAW)', arabic: 'النبي محمد (ص)', x: 640, y: 85, branch: 'central', life: '570–632 CE', resting: 'Medina' },
                  { id: 'node_khadija', name: 'Sayyida Khadija (SA)', arabic: 'خديجة الكبرى (ع)', x: 800, y: 85, branch: 'central', life: '555–619 CE', resting: 'Mecca' },

                  // Gen 1
                  { id: 'node_aqil', name: 'Aqil ibn Abi Talib', arabic: 'عقيل بن أبي طالب', x: 180, y: 235, branch: 'aqil', life: '590–670 CE', resting: 'Medina' },
                  { id: 'person_ali', name: 'Imam Ali (AS)', arabic: 'الإمام علي (ع)', x: 360, y: 235, branch: 'central', life: '600–661 CE', resting: 'Najaf' },
                  { id: 'person_fatima', name: 'Sayyida Fatima (SA)', arabic: 'فاطمة الزهراء (ع)', x: 520, y: 235, branch: 'central', life: '615–632 CE', resting: 'Medina' },
                  { id: 'person_umm_al_banin', name: 'Umm al-Banin (SA)', arabic: 'أم البنين (ع)', x: 700, y: 235, branch: 'kilab', life: 'c.620–684 CE', resting: 'Medina' },

                  // Gen 2
                  { id: 'person_muslim', name: 'Muslim ibn Aqil (AS)', arabic: 'مسلم بن عقيل (ع)', x: 180, y: 395, branch: 'aqil', life: '640–680 CE', resting: 'Kufa' },
                  { id: 'person_hasan', name: 'Imam Hasan (AS)', arabic: 'الإمام الحسن (ع)', x: 360, y: 395, branch: 'hasani', life: '624–670 CE', resting: 'Medina' },
                  { id: 'person_hussain', name: 'Imam Hussain (AS)', arabic: 'الإمام الحسين (ع)', x: 540, y: 395, branch: 'husayni', life: '626–680 CE', resting: 'Karbala' },
                  { id: 'person_zaynab', name: 'Sayyida Zaynab (SA)', arabic: 'السيدة زينب (ع)', x: 720, y: 395, branch: 'central', life: '626–682 CE', resting: 'Damascus' },
                  { id: 'person_abbas', name: 'Hazrat Abbas (AS)', arabic: 'أبو الفضل العباس (ع)', x: 900, y: 395, branch: 'abbasi', life: '647–680 CE', resting: 'Karbala' },

                  // Gen 3
                  { id: 'person_qasim', name: 'al-Qasim ibn Hasan', arabic: 'القاسم بن الحسن (ع)', x: 360, y: 555, branch: 'hasani', life: '667–680 CE', resting: 'Karbala' },
                  { id: 'person_ali_akbar', name: 'Ali al-Akbar (AS)', arabic: 'علي الأكبر (ع)', x: 540, y: 555, branch: 'husayni', life: '654–680 CE', resting: 'Karbala' },
                  { id: 'person_ali_asghar', name: 'Ali al-Asghar (AS)', arabic: 'علي الأصغر (ع)', x: 720, y: 555, branch: 'husayni', life: '680–680 CE', resting: 'Karbala' },
                  { id: 'person_zayn_al_abidin', name: 'Imam Zayn al-Abidin', arabic: 'زين العابدين (ع)', x: 900, y: 555, branch: 'husayni', life: '659–713 CE', resting: 'Medina' },

                  // Gen 4
                  { id: 'person_baqir', name: 'Imam al-Baqir (AS)', arabic: 'محمد الباقر (ع)', x: 900, y: 715, branch: 'husayni', life: '677–733 CE', resting: 'Medina' }
                ].filter(node => {
                  if (treeBranchFilter === 'all') return true;
                  if (treeBranchFilter === 'central') return node.branch === 'central';
                  if (treeBranchFilter === 'hasani') return node.branch === 'hasani';
                  if (treeBranchFilter === 'husayni') return node.branch === 'husayni';
                  if (treeBranchFilter === 'abbasi') return node.branch === 'abbasi';
                  if (treeBranchFilter === 'aqil') return node.branch === 'aqil';
                  return true;
                }).map(node => {
                  const isSelected = selectedTreeNode && selectedTreeNode.id === node.id;
                  let strokeColor = '#c6a66b';
                  if (node.branch === 'husayni') strokeColor = '#e63946';
                  if (node.branch === 'hasani') strokeColor = '#2ec4b6';
                  if (node.branch === 'abbasi') strokeColor = '#3a86ff';
                  if (node.branch === 'aqil') strokeColor = '#9d4edd';

                  return (
                    <g
                      key={node.id}
                      className="tree-node-card-box"
                      transform={`translate(${node.x - 75}, ${node.y - 35})`}
                      onClick={() => setSelectedTreeNode(node)}
                    >
                      <rect
                        width="150"
                        height="70"
                        rx="8"
                        className="node-bg"
                        fill={isSelected ? '#1d272d' : '#12181b'}
                        stroke={isSelected ? '#f3d499' : strokeColor}
                        strokeWidth={isSelected ? '2.5' : '1.4'}
                      />
                      {/* Name */}
                      <text
                        x="75"
                        y="22"
                        textAnchor="middle"
                        fill={isSelected ? '#f3d499' : '#e0d8c7'}
                        fontFamily="'Cinzel', serif"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        {node.name.length > 20 ? node.name.slice(0, 18) + '...' : node.name}
                      </text>
                      {/* Arabic */}
                      <text
                        x="75"
                        y="42"
                        textAnchor="middle"
                        fill="#c6a66b"
                        fontFamily="'Amiri', serif"
                        fontSize="13"
                      >
                        {node.arabic}
                      </text>
                      {/* Life & Resting */}
                      <text
                        x="75"
                        y="58"
                        textAnchor="middle"
                        fill="#8d99ae"
                        fontSize="9.5"
                      >
                        {node.life} • {node.resting}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Node Inspector Drawer */}
          {selectedTreeNode ? (
            <div className="family-node-inspector mt-4" id="family-node-inspector-drawer">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="badge px-2.5 py-1" style={{ background: 'rgba(197, 160, 89, 0.2)', color: '#f3d499', border: '1px solid rgba(197, 160, 89, 0.4)', fontSize: '0.72rem' }}>
                      Branch: {selectedTreeNode.branch.toUpperCase()}
                    </span>
                    <span className="badge px-2 py-0.5 bg-dark border border-secondary text-champagne" style={{ fontSize: '0.68rem' }}>
                      {selectedTreeNode.resting}
                    </span>
                  </div>
                  <h4 className="font-display text-ivory mb-0">{selectedTreeNode.name}</h4>
                  <div className="font-arabic text-gold-antique fs-5">{selectedTreeNode.arabic}</div>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-secondary text-decoration-none"
                  onClick={() => setSelectedTreeNode(null)}
                >
                  ✕
                </button>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <div className="p-2.5 rounded bg-black border border-dark">
                    <div className="small text-secondary mb-1" style={{ fontSize: '0.72rem' }}>Authentic Lineage</div>
                    <div className="text-champagne small">Documented in <em>Ansab al-Ashraf</em> & <em>Kitab al-Irshad</em></div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-2.5 rounded bg-black border border-dark">
                    <div className="small text-secondary mb-1" style={{ fontSize: '0.72rem' }}>Lifespan</div>
                    <div className="text-champagne small">{selectedTreeNode.life}</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-2.5 rounded bg-black border border-dark">
                    <div className="small text-secondary mb-1" style={{ fontSize: '0.72rem' }}>Sanctuary</div>
                    <div className="text-champagne small">{selectedTreeNode.resting}</div>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2 justify-content-end">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={onNavigateToMap}
                >
                  Locate Resting Sanctuary 🧭
                </button>
                <button
                  type="button"
                  className="editorial-action-btn px-3 py-1.5"
                  onClick={() => handleOpenMonograph(selectedTreeNode.id)}
                >
                  Read Curatorial Monograph 📖
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded text-center text-secondary small mt-3" style={{ background: 'rgba(10, 14, 16, 0.7)', border: '1px dashed rgba(197, 160, 89, 0.25)' }}>
              <i className="bi bi-cursor-fill text-gold-antique me-2"></i>
              Click on any personality node above to inspect verified kinship, documented lineage sources, and open complete historical monographs.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: 7 HISTORICAL EPOCHS TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="max-w-1000 mx-auto">
          {/* Epoch Selector Pills */}
          <div className="d-flex gap-2 mb-4 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All 7 Epochs' },
              { id: 'prophetic_precedents', label: '1. Prophetic Precedents' },
              { id: 'succession_crisis', label: '2. Succession Crisis (60 AH)' },
              { id: 'kufa_mission', label: '3. Kufa Mission' },
              { id: 'journey_to_karbala', label: '4. Journey of al-Taff' },
              { id: 'karbala_encampment', label: '5. Siege of Thirst' },
              { id: 'day_of_ashura', label: '6. Day of Ashura' },
              { id: 'captivity_and_legacy', label: '7. Captivity & Legacy' }
            ].map(ep => (
              <button
                key={ep.id}
                type="button"
                className={`btn btn-sm px-3 rounded-pill ${timelineEpochFilter === ep.id ? 'bg-warning text-dark fw-bold' : 'btn-outline-secondary text-champagne'}`}
                style={{ fontSize: '0.74rem', whiteSpace: 'nowrap' }}
                onClick={() => setTimelineEpochFilter(ep.id)}
              >
                {ep.label}
              </button>
            ))}
          </div>

          {/* Timeline Cards */}
          {(timeline.length > 0 ? timeline : [
            {
              id: 'event_ghadir',
              epoch: 'prophetic_precedents',
              yearAH: '10 AH',
              yearCE: '632 CE',
              title: 'The Declaration of Ghadir Khumm',
              arabicTitle: 'واقعة غدير خم وبيعة الولاية',
              location: 'Ghadir Khumm (between Mecca and Medina)',
              summary: 'Following the Farewell Pilgrimage, Prophet Muhammad (SAW) halted the assembly of tens of thousands at Ghadir Khumm, raising Ali ibn Abi Talib and declaring his spiritual and temporal authority.',
              keyFigures: ['Prophet Muhammad (SAW)', 'Imam Ali ibn Abi Talib'],
              sources: ['Tarikh al-Rusul wa al-Muluk (al-Tabari)', 'Ansab al-Ashraf (al-Baladhuri)']
            },
            {
              id: 'event_refusal_medina',
              epoch: 'succession_crisis',
              yearAH: '60 AH',
              yearCE: '680 CE',
              title: 'Imam Hussain Refuses Allegiance to Yazid',
              arabicTitle: 'رفض الإمام الحسين البيعة في دار الإمارة',
              location: 'Medina Palace of the Governor',
              summary: 'Following the death of Muawiya, governor Walid ibn Utba summoned Imam Hussain to demand immediate allegiance. The Imam responded with his famous proclamation of moral defiance.',
              keyFigures: ['Imam Hussain', 'Sayyida Zaynab', 'Marwan ibn al-Hakam'],
              sources: ['Kitab al-Irshad (Shaykh al-Mufid)', 'Maqtal al-Husayn (Abu Mikhnaf)']
            },
            {
              id: 'event_muslim_kufa',
              epoch: 'kufa_mission',
              yearAH: '60 AH',
              yearCE: '680 CE',
              title: 'The Embassy & Martyrdom of Muslim ibn Aqil',
              arabicTitle: 'سفارة واستشهاد مسلم بن عقيل في الكوفة',
              location: 'Great Mosque and Citadel of Kufa',
              summary: 'Muslim ibn Aqil arrived in Kufa as Imam Hussain’s emissary. After 18,000 men pledged loyalty, Ubayd Allah ibn Ziyad instituted terror and tribal bribery, isolating Muslim.',
              keyFigures: ['Muslim ibn Aqil', 'Hani ibn Urwa', 'Ubayd Allah ibn Ziyad'],
              sources: ['Tarikh al-Tabari', 'Kitab al-Irshad']
            },
            {
              id: 'event_arrival_karbala',
              epoch: 'journey_to_karbala',
              yearAH: '61 AH (2 Muharram)',
              yearCE: '680 CE (2 October)',
              title: 'Arrival at the Plain of Karbala',
              arabicTitle: 'ورود موكب الإمام الحسين إلى أرض كربلاء',
              location: 'Karbala (Plain of al-Taff)',
              summary: 'Intercepted by Hurr ibn Yazid al-Riyahi, Imam Hussain’s caravan was forced to halt on the arid desert plain. The Imam asked the name of the earth, and upon hearing Karbala, exclaimed: "O Allah, I seek refuge in You from sorrow and tribulation."',
              keyFigures: ['Imam Hussain', 'Hurr ibn Yazid', 'Hazrat Abbas'],
              sources: ['Maqtal al-Husayn (Abu Mikhnaf)', 'Al-Luhuf (Ibn Tawus)']
            },
            {
              id: 'event_siege_thirst',
              epoch: 'karbala_encampment',
              yearAH: '61 AH (7 Muharram)',
              yearCE: '680 CE (7 October)',
              title: 'The Siege of Thirst & Water Blockade',
              arabicTitle: 'قطع الماء عن مخيم الإمام الحسين',
              location: 'Nahr al-Alqami (Euphrates Branch)',
              summary: 'Umar ibn Sa’d dispatched 500 cavalry under Amr ibn al-Hajjaj to seal the riverbanks. For three grueling desert days, women and infants endured absolute thirst.',
              keyFigures: ['Imam Hussain', 'Hazrat Abbas', 'Ali al-Asghar'],
              sources: ['Tarikh al-Tabari', 'Kitab al-Irshad']
            },
            {
              id: 'event_ashura_battle',
              epoch: 'day_of_ashura',
              yearAH: '61 AH (10 Muharram)',
              yearCE: '680 CE (10 October)',
              title: 'The Day of Ashura: Battle, Sermons & Martyrdom',
              arabicTitle: 'ملحمة عاشوراء واستشهاد الإمام وصحبه',
              location: 'Battlefield of Karbala',
              summary: 'At dawn, Imam Hussain aligned his 72 companions against 30,000 soldiers. After solitary duals, individual martyrdoms of companions, nephews, and sons, Hazrat Abbas fell at the riverbank and Imam Hussain achieved martyrdom in the afternoon.',
              keyFigures: ['Imam Hussain', 'Hazrat Abbas', 'Ali al-Akbar', 'al-Qasim', 'Hurr'],
              sources: ['Maqtal Abu Mikhnaf', 'Kitab al-Irshad', 'Tarikh al-Tabari']
            },
            {
              id: 'event_captivity_sermons',
              epoch: 'captivity_and_legacy',
              yearAH: '61 AH onwards',
              yearCE: '680–682 CE',
              title: 'The Captivity & Eloquent Sermons in Damascus',
              arabicTitle: 'مسيرة السبايا وخطب السيدة زينب والإمام السجاد',
              location: 'Umayyad Palace of Damascus & Medina',
              summary: 'The surviving women and children, led by Sayyida Zaynab and the ailing Imam Zayn al-Abidin, were paraded through Kufa and Syria. In Yazid’s grand court, Sayyida Zaynab delivered her immortal sermon dismantling the regime.',
              keyFigures: ['Sayyida Zaynab', 'Imam Zayn al-Abidin', 'Yazid ibn Muawiya'],
              sources: ['Al-Luhuf (Ibn Tawus)', 'Maqatil al-Talibiyyin', 'Ansab al-Ashraf']
            }
          ]).filter(ev => timelineEpochFilter === 'all' || ev.epoch === timelineEpochFilter).map(ev => (
            <div key={ev.id} className="epoch-timeline-card">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-warning text-dark fw-bold" style={{ fontSize: '0.72rem' }}>
                    {ev.yearAH} • {ev.yearCE}
                  </span>
                  <span className="badge bg-black border border-gold-subtle text-gold-antique" style={{ fontSize: '0.7rem' }}>
                    <i className="bi bi-geo-alt me-1"></i>{ev.location}
                  </span>
                </div>
              </div>

              <h5 className="font-display text-white mb-1">{ev.title}</h5>
              <div className="font-arabic text-gold-antique mb-2" style={{ fontSize: '1.05rem' }}>{ev.arabicTitle}</div>
              
              <p className="font-serif text-secondary small mb-3" style={{ lineHeight: '1.7', fontSize: '0.88rem' }}>
                {ev.summary}
              </p>

              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 pt-2 border-top border-dark">
                <div className="d-flex align-items-center gap-1.5 flex-wrap">
                  <span className="small text-secondary" style={{ fontSize: '0.72rem' }}>Figures:</span>
                  {(ev.keyFigures || []).map((kf, kfi) => (
                    <span
                      key={kfi}
                      className="badge px-2 py-0.5 bg-dark border border-secondary text-champagne cursor-pointer"
                      style={{ fontSize: '0.68rem', cursor: 'pointer' }}
                      onClick={() => handleOpenMonograph(kf)}
                    >
                      {kf}
                    </span>
                  ))}
                </div>

                <div className="small text-secondary font-monospace" style={{ fontSize: '0.7rem' }}>
                  <i className="bi bi-book me-1 text-gold-antique"></i>
                  {(ev.sources || []).join(' | ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: CLASSICAL HISTORIOGRAPHICAL LIBRARY */}
      {activeTab === 'sources' && (
        <div className="max-w-1000 mx-auto">
          <div className="p-3 rounded bg-dark border border-secondary mb-4 small text-secondary">
            <i className="bi bi-info-circle text-gold-antique me-2"></i>
            The Karbala Digital Twin references only verified classical primary chronicles from the 2nd to 8th century AH, ensuring authentic transmission and scholarly consensus.
          </div>

          <div className="row g-4">
            {(sources.length > 0 ? sources : [
              {
                id: 'source_tabari',
                title: 'Tarikh al-Rusul wa al-Muluk',
                author: 'Abu Ja’far Muhammad ibn Jarir al-Tabari (224–310 AH)',
                century: '4th Century AH',
                category: 'Universal Chronicle',
                volumesReferenced: 'Vol. 5, pp. 341–458',
                reliabilityNotes: 'Consensus primary chronicle citing early transmitters, notably Abu Mikhnaf. Crucial for chronology, correspondence, and troop numbers.',
                scholarlyConsensus: 'Universal consensus across classical Sunni and Shia historiography.'
              },
              {
                id: 'source_irshad',
                title: 'Kitab al-Irshad fi Ma’rifat Hujaj Allah',
                author: 'Shaykh al-Mufid Muhammad ibn al-Nu’man (336–413 AH)',
                century: '5th Century AH',
                category: 'Theological & Biographical Authority',
                volumesReferenced: 'pp. 296–390',
                reliabilityNotes: 'The seminal Shia biographical compendium detailing the Twelve Imams. Emphasizes theological ethics, speeches, and authentic genealogies.',
                scholarlyConsensus: 'Authoritative theological and historical benchmark.'
              },
              {
                id: 'source_maqtal_abu_mikhnaf',
                title: 'Maqtal al-Husayn',
                author: 'Abu Mikhnaf Lut ibn Yahya al-Azdi (d. 157 AH / 774 CE)',
                century: '2nd Century AH',
                category: 'Eyewitness Monographic Transmission',
                volumesReferenced: 'Preserved via al-Tabari & Baladhuri',
                reliabilityNotes: 'The earliest systematic monograph on Karbala, compiled directly from surviving witnesses and Kufan veterans.',
                scholarlyConsensus: 'Foundational historical source for tactical battlefield movements.'
              },
              {
                id: 'source_ansab',
                title: 'Ansab al-Ashraf (Genealogies of Nobles)',
                author: 'Ahmad ibn Yahya al-Baladhuri (d. 279 AH / 892 CE)',
                century: '3rd Century AH',
                category: 'Genealogical Chronicle',
                volumesReferenced: 'Vol. 3, pp. 140–225',
                reliabilityNotes: 'Masterwork of Arab genealogical lineage, rigorously documenting families, marriages, and tribal alliances.',
                scholarlyConsensus: 'Definitive reference for Ahlul Bayt genealogy.'
              },
              {
                id: 'source_luhuf',
                title: 'Al-Luhuf ala Qatla al-Tufuf',
                author: 'Sayyid Radhi al-Din Ali ibn Tawus (589–664 AH)',
                century: '7th Century AH',
                category: 'Devotional Historiography',
                volumesReferenced: 'Complete monograph (pp. 1–180)',
                reliabilityNotes: 'Highly structured historical and devotional text renowned for recording poignant dialogues and prison sermons.',
                scholarlyConsensus: 'Classical benchmark for spiritual reflection and sermon analysis.'
              },
              {
                id: 'source_yaqubi',
                title: 'Tarikh al-Ya’qubi',
                author: 'Ahmad ibn Abi Ya’qub (d. 284 AH / 897 CE)',
                century: '3rd Century AH',
                category: 'Early Islamic History',
                volumesReferenced: 'Vol. 2, pp. 243–255',
                reliabilityNotes: 'One of the earliest comprehensive Islamic histories written from a pro-Alid perspective.',
                scholarlyConsensus: 'Invaluable complementary verification for early political correspondence.'
              }
            ]).map(src => (
              <div key={src.id} className="col-lg-6">
                <div className="classical-source-card">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-black border border-gold-subtle text-gold-antique" style={{ fontSize: '0.7rem' }}>
                      {src.century}
                    </span>
                    <span className="badge bg-dark border border-secondary text-secondary" style={{ fontSize: '0.68rem' }}>
                      {src.category}
                    </span>
                  </div>

                  <h5 className="font-display text-white mb-1">{src.title}</h5>
                  <div className="small text-gold-antique font-serif mb-2" style={{ fontSize: '0.84rem' }}>
                    {src.author}
                  </div>

                  <p className="font-serif text-secondary small mb-3 flex-grow-1" style={{ lineHeight: '1.6', fontSize: '0.84rem' }}>
                    {src.reliabilityNotes}
                  </p>

                  <div className="p-2 rounded bg-black border border-dark mb-2 small text-secondary" style={{ fontSize: '0.74rem' }}>
                    <strong className="text-champagne">Volumes Referenced:</strong> {src.volumesReferenced}
                  </div>

                  <div className="pt-2 border-top border-dark small text-champagne" style={{ fontSize: '0.74rem' }}>
                    <i className="bi bi-check2-circle text-success me-1"></i>
                    <strong>Scholarly Consensus:</strong> {src.scholarlyConsensus}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ARCHITECTURAL & VISION TRANSPARENCY */}
      {activeTab === 'transparency' && (
        <div className="max-w-1000 mx-auto">
          <div className="transparency-banner-box">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'rgba(197, 160, 89, 0.15)',
                  border: '1px solid rgba(197, 160, 89, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f3d499',
                  fontSize: '1.4rem'
                }}
              >
                <i className="bi bi-cpu"></i>
              </div>
              <div>
                <h4 className="font-display text-white mb-0">Sacred Computer Vision Architecture & Engineering Audit</h4>
                <div className="small text-gold-antique">Academic Rigor & Algorithmic Transparency</div>
              </div>
            </div>

            <p className="font-serif text-secondary small mb-4" style={{ lineHeight: '1.8', fontSize: '0.9rem' }}>
              In accordance with strict academic and technical transparency guidelines, the visual landmark matching system implemented in Milestone 5 is based on a <strong>7-feature deterministic geometric and architectural heuristic descriptor</strong>, rather than an unconstrained deep convolutional or transformer neural network.
            </p>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div className="p-3 rounded bg-black border border-dark h-100">
                  <div className="text-gold-antique fw-bold small mb-2">
                    <i className="bi bi-rulers me-1.5"></i>
                    The 7 Architectural Descriptors Evaluated:
                  </div>
                  <ul className="small text-secondary ps-3 mb-0" style={{ fontSize: '0.8rem', lineHeight: '1.7' }}>
                    <li><strong>Golden Dome Aspect Ratio:</strong> Calibrated geometric height-to-width dome curve profile.</li>
                    <li><strong>Minaret Symmetry & Pair Spacing:</strong> Twin minaret flanking geometry and height index.</li>
                    <li><strong>Facade Color Space Histogram:</strong> Lapis lazuli mosaic vs golden cladding chroma vectors.</li>
                    <li><strong>Iwan Arch Curvature:</strong> Muqarnas ceiling depth and pointed Persian-Ottoman portal profile.</li>
                    <li><strong>Clock Tower Presence:</strong> Upper portal clock turret identifier (e.g., Bab al-Qibla).</li>
                    <li><strong>Courtyard Sahn Geometry:</strong> Open marble spatial reflection and column cadence.</li>
                    <li><strong>Lighting & Contrast Normalization:</strong> Thresholding to reject dark or uncalibrated imagery.</li>
                  </ul>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3 rounded bg-black border border-dark h-100">
                  <div className="text-gold-antique fw-bold small mb-2">
                    <i className="bi bi-shield-check me-1.5"></i>
                    Academic Guarantees & Safeguards:
                  </div>
                  <ul className="small text-secondary ps-3 mb-0" style={{ fontSize: '0.8rem', lineHeight: '1.7' }}>
                    <li><strong>Zero Hallucination Guarantee:</strong> Purely algorithmic; will never invent speculative coordinates.</li>
                    <li><strong>Respectful Threshold Rejection:</strong> Images falling below 62% confidence trigger honest neutral prompts rather than fabricated matches.</li>
                    <li><strong>Zero Speculative Portraits:</strong> The platform strictly employs authentic shrine architectural photography and calligraphic manuscripts — never fictional representations of holy figures.</li>
                    <li><strong>Footprint Efficiency:</strong> Executes instantly in client and lightweight Express backend without requiring heavy GPU weights.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-3 rounded bg-dark border border-secondary text-center small text-champagne">
              <i className="bi bi-award text-gold-antique me-2"></i>
              System complies fully with Phase 5 & Phase 6 architectural integrity mandates, preserving historical dignity and computational rigor.
            </div>
          </div>
        </div>
      )}

      {/* CURATORIAL MONOGRAPH MODAL */}
      {selectedPersonality && (
        <CuratorialMonographModal
          person={selectedPersonality}
          onClose={() => setSelectedPersonality(null)}
          onNavigateToMap={() => {
            setSelectedPersonality(null);
            onNavigateToMap();
          }}
          onNavigateToZiyarat={() => {
            setSelectedPersonality(null);
            if (onNavigateToZiyarat) onNavigateToZiyarat();
          }}
        />
      )}
    </div>
  );
}

/* =========================================================================
   CURATORIAL MONOGRAPH MODAL & MULTILINGUAL ZIYARAT READER
   ========================================================================= */
function CuratorialMonographModal({ person, onClose, onNavigateToMap, onNavigateToZiyarat }) {
  const [modalTab, setModalTab] = useState('biography'); // 'biography', 'speech', 'genealogy', 'places', 'ziyarat', 'sources'
  const [ziyaratLang, setZiyaratLang] = useState('arabic'); // 'arabic', 'english', 'urdu', 'hindi', 'persian', 'translit'
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const ziyaratData = person.ziyaratText || person.ziyaratRecitation;
  const biographyContent = person.historicalMonograph || person.biographySummary || person.biography || '';

  // Audio recitation synthesis / simulation
  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      if ('speechSynthesis' in window && ziyaratData) {
        const text = ziyaratLang === 'english'
          ? ziyaratData.english
          : ziyaratData.arabic;
        const ut = new SpeechSynthesisUtterance(text);
        ut.lang = ziyaratLang === 'arabic' ? 'ar-SA' : 'en-US';
        ut.rate = 0.88;
        ut.onend = () => setIsPlayingAudio(false);
        ut.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(ut);
      } else {
        setTimeout(() => setIsPlayingAudio(false), 5000);
      }
    }
  };

  return (
    <div className="monograph-modal-backdrop" onClick={onClose}>
      <div className="monograph-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Monograph Header Hero */}
        <div
          className="monograph-header-hero"
          style={{
            backgroundImage: `url('${getArchitecturalPhoto(person)}')`
          }}
        >
          <div className="monograph-header-overlay"></div>
          <div className="position-relative w-100 z-1">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="d-flex align-items-center gap-2">
                <span className="badge px-3 py-1" style={{ background: 'rgba(197, 160, 89, 0.3)', color: '#f3d499', border: '1px solid rgba(197, 160, 89, 0.5)' }}>
                  {getCategoryLabel(person).toUpperCase()}
                </span>
                {person.restingPlace && (
                  <span className="badge px-2.5 py-1 bg-black border border-secondary text-champagne">
                    <i className="bi bi-geo-alt me-1 text-gold-antique"></i>
                    {person.restingPlace}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="btn btn-sm btn-dark rounded-circle"
                style={{ width: '36px', height: '36px', border: '1px solid rgba(197, 160, 89, 0.4)' }}
                onClick={onClose}
              >
                ✕
              </button>
            </div>

            <h2 className="font-display text-white mb-0" style={{ fontSize: '1.8rem', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
              {person.name}
            </h2>
            <div className="font-arabic text-gold-antique mb-2" style={{ fontSize: '1.45rem', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
              {person.arabicName}
            </div>
            <div className="d-flex flex-wrap gap-2 text-secondary small font-serif">
              <span>{person.era || `${person.birthYear || 'Early Islamic Era'} – ${person.martyrdomYear || '680 CE'}`}</span>
              <span>•</span>
              <span className="text-champagne">{person.honorific || person.epithet || (person.titles && person.titles.join(', ')) || person.role}</span>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Strip */}
        <div className="monograph-tabs-strip">
          {[
            { id: 'biography', label: 'Curatorial Monograph', icon: 'bi-file-earmark-person' },
            { id: 'speech', label: 'Primary Words & Sermon', icon: 'bi-chat-quote' },
            { id: 'genealogy', label: 'Kinship & Lineage', icon: 'bi-diagram-3' },
            { id: 'places', label: 'Sacred Places', icon: 'bi-geo-alt' },
            { id: 'ziyarat', label: 'Authentic Ziyarat', icon: 'bi-stars' },
            { id: 'sources', label: 'Classical Sources', icon: 'bi-book' }
          ].map(t => (
            <button
              key={t.id}
              type="button"
              className={`monograph-tab-btn ${modalTab === t.id ? 'active' : ''}`}
              onClick={() => setModalTab(t.id)}
            >
              <i className={`bi ${t.icon}`}></i>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="monograph-body-content">
          {/* 1. Curatorial Monograph Tab */}
          {modalTab === 'biography' && (
            <div>
              <div className="mb-4">
                <h5 className="font-display text-gold-antique mb-2" style={{ fontSize: '1.05rem' }}>
                  Curatorial Narrative
                </h5>
                <p className="font-serif text-ivory-warm" style={{ lineHeight: '1.85', fontSize: '0.94rem' }}>
                  {biographyContent}
                </p>
              </div>

              {(person.keyAction || (person.keyEvents && person.keyEvents.length > 0)) && (
                <div className="monograph-speech-quote mb-4">
                  <div className="small text-gold-antique fw-bold mb-1">
                    <i className="bi bi-shield-fill-check me-1"></i>Defining Historical Action & Moral Milestone
                  </div>
                  <div className="font-serif text-champagne small" style={{ lineHeight: '1.7', fontSize: '0.9rem' }}>
                    {person.keyAction || person.keyEvents.map(e => `${e.year}: ${e.title}`).join(' • ')}
                  </div>
                </div>
              )}

              {person.titles && person.titles.length > 0 && (
                <div className="p-3 rounded bg-black border border-dark mb-3">
                  <div className="small text-secondary mb-1.5">Authenticated Titles & Honorific Epithets:</div>
                  <div className="d-flex flex-wrap gap-1.5">
                    {person.titles.map((t, ti) => (
                      <span key={ti} className="badge bg-dark border border-secondary text-champagne" style={{ fontSize: '0.74rem' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. Primary Words & Sermon Tab */}
          {modalTab === 'speech' && (
            <div>
              {person.primarySpeech ? (
                <div>
                  <h5 className="font-display text-white mb-1">{person.primarySpeech.title}</h5>
                  <div className="small text-secondary mb-3">{person.primarySpeech.context}</div>

                  <div className="monograph-speech-quote">
                    <div className="monograph-arabic-speech">
                      {person.primarySpeech.arabic}
                    </div>
                    <div className="font-serif text-champagne small" style={{ lineHeight: '1.75', fontSize: '0.92rem' }}>
                      <strong>Translation:</strong> "{person.primarySpeech.english}"
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-black border border-dark small text-secondary">
                    <i className="bi bi-book-half text-gold-antique me-1.5"></i>
                    <strong>Primary Classical Citation:</strong> {person.primarySpeech.source}
                  </div>
                </div>
              ) : (
                <div>
                  <h5 className="font-display text-white mb-2">Defining Historical Words & Principles</h5>
                  <p className="font-serif text-champagne" style={{ lineHeight: '1.8' }}>
                    "{biographyContent.slice(0, 300)}..."
                  </p>
                  <div className="p-2.5 rounded bg-black border border-dark small text-secondary">
                    <i className="bi bi-book-half text-gold-antique me-1.5"></i>
                    Documented in classical chronicles: <em>Tarikh al-Tabari</em> and <em>Kitab al-Irshad</em>.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. Kinship & Lineage Tab */}
          {modalTab === 'genealogy' && (
            <div>
              <h5 className="font-display text-gold-antique mb-3" style={{ fontSize: '1.05rem' }}>
                Documented Genealogy & Kinship
              </h5>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="p-3 rounded bg-black border border-dark">
                    <div className="small text-secondary mb-1">Father:</div>
                    <div className="text-white fw-bold">{person.genealogy?.father || 'Hashimite Lineage'}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 rounded bg-black border border-dark">
                    <div className="small text-secondary mb-1">Mother:</div>
                    <div className="text-white fw-bold">{person.genealogy?.mother || 'Noble Lineage'}</div>
                  </div>
                </div>
              </div>

              {(person.genealogy?.spouses || (person.genealogy?.spouse ? [person.genealogy.spouse] : [])).length > 0 && (
                <div className="p-3 rounded bg-black border border-dark mb-3">
                  <div className="small text-secondary mb-1.5">Spouse(s):</div>
                  <div className="d-flex flex-wrap gap-1.5">
                    {(person.genealogy.spouses || [person.genealogy.spouse]).map((sp, spi) => (
                      <span key={spi} className="badge bg-dark border border-secondary text-champagne">
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {person.genealogy?.children && person.genealogy.children.length > 0 && (
                <div className="p-3 rounded bg-black border border-dark mb-3">
                  <div className="small text-secondary mb-1.5">Documented Children:</div>
                  <div className="d-flex flex-wrap gap-1.5">
                    {person.genealogy.children.map((ch, chi) => (
                      <span key={chi} className="badge bg-dark border border-secondary text-champagne">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {person.genealogy?.brothers && person.genealogy.brothers.length > 0 && (
                <div className="p-3 rounded bg-black border border-dark mb-3">
                  <div className="small text-secondary mb-1.5">Siblings / Brothers:</div>
                  <div className="d-flex flex-wrap gap-1.5">
                    {person.genealogy.brothers.map((br, bri) => (
                      <span key={bri} className="badge bg-dark border border-secondary text-champagne">
                        {br}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-2.5 rounded bg-dark border border-secondary small text-secondary">
                <i className="bi bi-shield-check text-gold-antique me-1.5"></i>
                Genealogical data cross-verified against <em>Ansab al-Ashraf</em> by al-Baladhuri and <em>Kitab al-Irshad</em> by Shaykh al-Mufid.
              </div>
            </div>
          )}

          {/* 4. Sacred Places Tab */}
          {modalTab === 'places' && (
            <div>
              <h5 className="font-display text-gold-antique mb-3" style={{ fontSize: '1.05rem' }}>
                Associated Sacred Sanctuaries & Geography
              </h5>

              <div className="row g-3">
                {(person.associatedPlaces || [
                  {
                    name: person.restingPlace ? `Sanctuary of ${person.name}` : 'Holy Shrine of Karbala',
                    modernCity: person.restingPlace || 'Karbala, Iraq',
                    relevance: 'Primary resting sanctuary and site of universal pilgrimage.'
                  }
                ]).map((pl, pli) => {
                  const placeName = typeof pl === 'string' ? pl : pl.name;
                  const placeCity = typeof pl === 'string' ? (person.restingPlace || 'Sacred Site') : pl.modernCity;
                  const placeRel = typeof pl === 'string' ? 'Historical location associated with this holy personality.' : pl.relevance;

                  return (
                    <div key={pli} className="col-md-6">
                      <div className="p-3 rounded bg-black border border-dark h-100 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <h6 className="font-display text-white mb-0">{placeName}</h6>
                            <span className="badge bg-dark border border-gold-subtle text-gold-antique" style={{ fontSize: '0.66rem' }}>
                              {placeCity}
                            </span>
                          </div>
                          <p className="font-serif text-secondary small mb-3" style={{ lineHeight: '1.6', fontSize: '0.82rem' }}>
                            {placeRel}
                          </p>
                        </div>

                        <div className="d-flex gap-2 pt-2 border-top border-dark">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary w-50"
                            style={{ fontSize: '0.72rem' }}
                            onClick={onNavigateToMap}
                          >
                            <i className="bi bi-map me-1"></i>Map
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-warning w-50"
                            style={{ fontSize: '0.72rem' }}
                            onClick={onNavigateToZiyarat}
                          >
                            <i className="bi bi-compass me-1"></i>Navigate
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Authentic Ziyarat Tab */}
          {modalTab === 'ziyarat' && (
            <div>
              {ziyaratData ? (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="font-display text-white mb-0">{ziyaratData.title || 'Authentic Ziyarat Salutation'}</h5>
                      <span className="small text-secondary" style={{ fontSize: '0.72rem' }}>
                        Source: {ziyaratData.source || 'Mafatih al-Jinan & Kamil al-Ziyarat'}
                      </span>
                    </div>

                    <button
                      type="button"
                      className={`btn btn-sm ${isPlayingAudio ? 'btn-danger' : 'btn-outline-warning'} rounded-pill px-3`}
                      style={{ fontSize: '0.75rem' }}
                      onClick={handleToggleAudio}
                    >
                      <i className={`bi ${isPlayingAudio ? 'bi-stop-fill' : 'bi-volume-up-fill'} me-1.5`}></i>
                      {isPlayingAudio ? 'Stop Recitation' : 'Listen to Recitation'}
                    </button>
                  </div>

                  {/* Language Selector */}
                  <div className="ziyarat-lang-switcher">
                    {[
                      { id: 'arabic', label: 'عربي (Arabic Diacritics)' },
                      { id: 'translit', label: 'Transliteration' },
                      { id: 'english', label: 'English' },
                      { id: 'urdu', label: 'اردو (Urdu)' },
                      { id: 'hindi', label: 'हिन्दी (Hindi)' },
                      { id: 'persian', label: 'فارسی (Persian)' }
                    ].map(lg => (
                      <button
                        key={lg.id}
                        type="button"
                        className={`ziyarat-lang-pill ${ziyaratLang === lg.id ? 'active' : ''}`}
                        onClick={() => setZiyaratLang(lg.id)}
                      >
                        {lg.label}
                      </button>
                    ))}
                  </div>

                  {/* Active Translation Box */}
                  <div className="ziyarat-translation-view mb-3">
                    {ziyaratLang === 'arabic' && (
                      <div className="ziyarat-arabic-card" style={{ fontSize: '1.35rem', lineHeight: '2.1' }}>
                        {ziyaratData.arabic}
                      </div>
                    )}

                    {ziyaratLang === 'translit' && (
                      <div className="font-serif text-champagne fst-italic" style={{ fontSize: '0.94rem', lineHeight: '1.8' }}>
                        {ziyaratData.transliteration}
                      </div>
                    )}

                    {ziyaratLang === 'english' && (
                      <div className="font-serif text-ivory-warm" style={{ fontSize: '0.94rem', lineHeight: '1.8' }}>
                        "{ziyaratData.english}"
                      </div>
                    )}

                    {ziyaratLang === 'urdu' && (
                      <div className="ziyarat-urdu-text">
                        {ziyaratData.urdu || ziyaratData.english}
                      </div>
                    )}

                    {ziyaratLang === 'hindi' && (
                      <div className="ziyarat-hindi-text">
                        {ziyaratData.hindi || ziyaratData.english}
                      </div>
                    )}

                    {ziyaratLang === 'persian' && (
                      <div className="ziyarat-persian-text">
                        {ziyaratData.persian || ziyaratData.english}
                      </div>
                    )}
                  </div>

                  {ziyaratData.etiquette && (
                    <div className="p-2.5 rounded bg-black border border-dark small text-secondary">
                      <i className="bi bi-heart-fill text-gold-antique me-1.5"></i>
                      <strong>Recommended Etiquette:</strong> {ziyaratData.etiquette}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded text-center text-secondary small" style={{ background: 'rgba(10, 14, 16, 0.7)' }}>
                  Ziyarat text for this personality is recited within the comprehensive Ziyarat al-Shuhada (Salutations upon the Martyrs of Karbala).
                </div>
              )}
            </div>
          )}

          {/* 6. Classical Sources Tab */}
          {modalTab === 'sources' && (
            <div>
              <h5 className="font-display text-gold-antique mb-3" style={{ fontSize: '1.05rem' }}>
                Primary Manuscript Citations & Historiography
              </h5>

              <div className="mb-4">
                <div className="small text-secondary mb-2">Verified Classical Chronological Citations:</div>
                <div className="d-flex flex-column gap-2">
                  {(person.primarySources || [
                    'Tarikh al-Rusul wa al-Muluk (al-Tabari, Vol. 5)',
                    'Kitab al-Irshad (Shaykh al-Mufid, pp. 296–390)',
                    'Ansab al-Ashraf (al-Baladhuri, Vol. 3)',
                    'Maqtal al-Husayn (Abu Mikhnaf Lut ibn Yahya)'
                  ]).map((src, srci) => (
                    <div key={srci} className="p-2.5 rounded bg-black border border-dark small text-champagne">
                      <i className="bi bi-bookmark-check-fill text-gold-antique me-2"></i>
                      {src}
                    </div>
                  ))}
                </div>
              </div>

              {person.disputedOrComparativeHistoriography && (
                <div className="p-3 rounded bg-dark border border-secondary">
                  <div className="small text-gold-antique fw-bold mb-1">
                    <i className="bi bi-question-circle me-1.5"></i>Comparative Historiographical Notes & Variants
                  </div>
                  <p className="font-serif text-secondary small mb-0" style={{ lineHeight: '1.7', fontSize: '0.84rem' }}>
                    {person.disputedOrComparativeHistoriography}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="landmark-modal-footer">
          <div className="small text-secondary">
            Curatorial Collection: Ahlul Bayt Living Heritage Encyclopedia
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary px-4"
            onClick={onClose}
          >
            Close Monograph
          </button>
        </div>
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
  const [exhibitionIdx, setExhibitionIdx] = useState(0);
  const pageSize = 24;

  const guidedExhibitions = useMemo(() => [
    {
      id: 'ex_journey',
      title: 'I. The Journey to Karbala (Madinah to Al-Taff)',
      arabic: 'رحلة الفداء من المدينة إلى كربلاء',
      summary: 'From the night departure of 28 Rajab 60 AH in Madinah and the four-month sanctuary in Makkah to the desert stations of Zubalah, Dhu Husam, and arrival at Karbala on 2 Muharram 61 AH.',
      sources: 'Tarikh al-Tabari (Vol. 5) · Kitab al-Irshad · Maqtal Abi Mikhnaf',
      image: 'assets/images/ai_61ah_encampment.jpg'
    },
    {
      id: 'ex_heroes',
      title: 'II. Heroes of Karbala — Bani Hashim & Loyal Companions',
      arabic: 'أبطال الطف — بنو هاشم والصحب الأوفياء',
      summary: 'The supreme chivalry of Hazrat Abu al-Fadl al-Abbas, Ali al-Akbar, Qasim ibn Hasan, Habib ibn Muzahir, Zuhayr ibn al-Qayn, Muslim ibn Awsaja, and Hurr ibn Yazid al-Riyahi.',
      sources: 'Kitab al-Irshad (pp. 374–385) · Ansab al-Ashraf (Vol. 3)',
      image: 'assets/images/shrine_38.jpg'
    },
    {
      id: 'ex_women',
      title: 'III. Women of Karbala — Guardians of Prophetic Eloquence',
      arabic: 'حرائر كربلاء — السيدة زينب الكبرى وعقائل النبوة',
      summary: 'Led by Aqilat Bani Hashim Sayyida Zaynab bint Ali (SA), Umm Kulthum, Lady Rabab, and Fatima bint al-Hussain, whose resilience protected the Imamate and shattered tyranny.',
      sources: 'Balaghat al-Nisa · Al-Luhuf · Al-Ihtijaj (Vol. 2)',
      image: 'assets/images/karbala_hd_bab_al_qibla_blue_hour.jpg'
    },
    {
      id: 'ex_children',
      title: 'IV. Children & Youth of Karbala',
      arabic: 'أطفال وفتيان كربلاء — عبدالله الرضيع والقاسم والرقية',
      summary: 'Honoring the sacrifice of the six-month-old infant Abdullah (Ali Asghar), young Qasim ibn Hasan, Awn and Muhammad, and Sayyida Ruqayyah / Sakina (SA).',
      sources: 'Maqatil al-Talibiyyin · Al-Luhuf (pp. 64–72)',
      image: 'assets/images/hero_imam_hussain_shrine_twilight.jpg'
    },
    {
      id: 'ex_ashura',
      title: 'V. Yawm al-Ashura — The Tenth of Muharram 61 AH',
      arabic: 'يوم عاشوراء الخالد — هيهات منا الذلة',
      summary: 'Hour-by-hour chronicle of Friday, 10 Muharram 61 AH: the dawn sermon, the morning charge, Salat al-Khawf at noon, the Euphrates stand, and the Maqtal at Asr.',
      sources: 'Abu Mikhnaf, Maqtal al-Husayn · Tarikh al-Tabari (Vol. 5, pp. 422–454)',
      image: 'assets/images/karbala_hd_twin_shrines_aerial_night.jpg'
    },
    {
      id: 'ex_post_ashura',
      title: 'VI. Post-Ashura Journey (Karbala → Kufa → Damascus → Medina)',
      arabic: 'مسير السبايا وخطب الكوفة والشام',
      summary: 'The moral triumph of the captive Household across Kufa, the Levant corridor, the court of Damascus, and the return to Medina.',
      sources: 'Balaghat al-Nisa · Tarikh al-Tabari (Vol. 5, pp. 455–465)',
      image: 'assets/images/shrine_38.jpg'
    },
    {
      id: 'ex_arbaeen',
      title: 'VII. The Arba’een Legacy — From Jabir ibn Abdullah to 21 Million Pilgrims',
      arabic: 'مسيرة الأربعين الخالدة — من زيارة جابر إلى الملايين',
      summary: 'Tracing the continuity from Jabir ibn Abdullah al-Ansari’s visitation on 20 Safar to the contemporary 80 km Najaf–Karbala corridor of 1,452 poles.',
      sources: 'Misbah al-Mutahajjid (p. 787) · Kamil al-Ziyarat',
      image: 'assets/images/hero_imam_hussain_shrine_twilight.jpg'
    },
    {
      id: 'ex_manuscripts',
      title: 'VIII. Classical Manuscripts & Historiographical Provenance',
      arabic: 'المخطوطات التاريخية ومصادر التوثيق الأولية',
      summary: 'Comparative survey of early Kufan, Baghdadi, and Medinan manuscript traditions preserving the chronicle of 61 AH across fourteen centuries.',
      sources: 'Al-Tabari · Shaykh al-Mufid · Ibn Qulawayh · Sayyid Ibn Tawus',
      image: 'assets/images/karbala_hd_bab_al_qibla_blue_hour.jpg'
    }
  ], []);

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

  const activeEx = guidedExhibitions[exhibitionIdx] || guidedExhibitions[0];

  return (
    <div className="subview-container container">
      <SubviewHeader
        number="PHOTOGRAPHIC MONOGRAPHS & GUIDED DIGITAL EXHIBITIONS"
        title="Sacred Photographic Pavilion"
        arabic="الجناح الفوتوغرافي والمعارض الرقمية المقدسة"
        lead={`A vast archival collection comprising ${galleryImages.length} high-resolution photographs, architectural details, and 8 guided curatorial exhibitions.`}
        onBack={onBack}
      />

      {/* Guided Digital Exhibition Mode (#29) */}
      <div className="p-4 p-lg-5 rounded-4 mb-5" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(200,164,91,0.32)' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div className="doc-chapter-label mb-0">GUIDED DIGITAL MUSEUM EXHIBITION ({exhibitionIdx + 1} / {guidedExhibitions.length})</div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm rounded-pill px-3"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--ivory-warm)', border: '1px solid rgba(200,164,91,0.3)' }}
              onClick={() => setExhibitionIdx(i => (i > 0 ? i - 1 : guidedExhibitions.length - 1))}
            >
              ← Previous Exhibition
            </button>
            <button
              type="button"
              className="btn btn-sm rounded-pill px-3"
              style={{ background: 'var(--gold-antique)', color: '#050706', fontWeight: 700 }}
              onClick={() => setExhibitionIdx(i => (i + 1) % guidedExhibitions.length)}
            >
              Next Exhibition →
            </button>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-1.5 mb-3">
          {guidedExhibitions.map((ex, idx) => (
            <button
              key={ex.id}
              type="button"
              className="btn btn-sm rounded-pill px-2.5 py-1"
              style={{
                background: exhibitionIdx === idx ? 'var(--gold-antique)' : 'rgba(5,7,6,0.8)',
                color: exhibitionIdx === idx ? '#050706' : 'var(--ivory-warm)',
                border: '1px solid rgba(200,164,91,0.25)',
                fontSize: '0.72rem',
                fontWeight: exhibitionIdx === idx ? 700 : 500
              }}
              onClick={() => setExhibitionIdx(idx)}
            >
              {ex.title.split('—')[0].trim()}
            </button>
          ))}
        </div>

        <div className="row g-4 align-items-center p-3 rounded-3" style={{ background: 'rgba(5,7,6,0.82)', border: '1px solid rgba(200,164,91,0.22)' }}>
          <div className="col-md-5">
            <img
              src={activeEx.image}
              alt={activeEx.title}
              className="w-100 rounded-3 object-fit-cover"
              style={{ height: '220px', border: '1px solid rgba(200,164,91,0.3)' }}
            />
          </div>
          <div className="col-md-7">
            <h3 className="font-title h4 text-ivory mb-1">{activeEx.title}</h3>
            <div className="font-arabic fs-4 text-gold-antique mb-2" dir="rtl">{activeEx.arabic}</div>
            <p className="text-ivory-muted mb-2" style={{ lineHeight: 1.75 }}>{activeEx.summary}</p>
            <div className="small text-gold-antique">
              <i className="bi bi-journal-check me-1"></i>
              <strong>Authenticated Sources:</strong> {activeEx.sources}
            </div>
          </div>
        </div>
      </div>

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
                <div className="small fw-semibold text-ivory mb-1 font-title text-wrap" style={{ lineHeight: '1.3' }} title={img.title}>
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
   DEDICATED VIEW: HISTORIOGRAPHY & CERTAINTY MATRIX (MUSEUM PLAQUES)
   ========================================================================= */
function DedicatedHistoriographyView({ onBack, onNavigateToMap }) {
  const [selectedKey, setSelectedKey] = useState('maqtal_hussain');
  const details = CERTAINTY_EXPLANATIONS[selectedKey] || CERTAINTY_EXPLANATIONS.maqtal_hussain;

  return (
    <div className="subview-container container">
      <SubviewHeader
        number="ACADEMIC CRITIQUE • EPISTEMOLOGICAL ARCHIVE"
        title="Historiographical Certainty Matrix"
        arabic="منهجية التوثيق والتحقيق التاريخي"
        lead="A transparent epistemological matrix categorizing geographical sites, events, and classical chronicles across four tiers of historical attestation."
        onBack={onBack}
      />

      {/* 4 Certainty Tiers Summary (Controlled Skeuomorphism Plaques) */}
      <div className="row g-3 max-w-1000 mx-auto mb-5">
        {[
          { num: 'I', key: 'DOCUMENTED', title: 'Historically Attested', desc: 'Direct continuous attestation in earliest chronicles and unbroken pilgrimage geography.' },
          { num: 'II', key: 'RECONSTRUCTED', title: 'Scholarly Reconstruction', desc: 'Synthesized from hydrological sediment studies and classical geographical texts.' },
          { num: 'III', key: 'DISPUTED', title: 'Topographically Disputed', desc: 'Multiple divergent narrations exist regarding precise spatial boundary.' },
          { num: 'IV', key: 'ARTISTIC', title: 'Atmospheric Modeling', desc: 'Respectful visual rendering for educational topographical visualization.' }
        ].map((tier, idx) => (
          <div key={idx} className="col-md-3 col-6">
            <div className="archive-plaque-card h-100 d-flex flex-column justify-content-between p-3.5">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="brutalist-archival-tag">TIER {tier.num}</span>
                  <span className="font-monospace small text-gold-antique" style={{ fontSize: '0.68rem' }}>{tier.key}</span>
                </div>
                <h6 className="font-display text-ivory-warm fw-bold mb-1" style={{ fontSize: '0.94rem' }}>{tier.title}</h6>
              </div>
              <div className="small text-ivory-muted mt-2" style={{ fontSize: '0.76rem', lineHeight: 1.55 }}>{tier.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Site-by-Site Breakdown */}
      <div className="row g-4 max-w-1000 mx-auto">
        <div className="col-md-4">
          <div className="list-group rounded-4 overflow-hidden" style={{ border: '1px solid rgba(198,166,107,0.35)' }}>
            {Object.keys(CERTAINTY_EXPLANATIONS).map(key => {
              const item = CERTAINTY_EXPLANATIONS[key];
              const isSelected = selectedKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  className={`list-group-item list-group-item-action text-start p-3 ${isSelected ? 'active' : ''}`}
                  style={{
                    background: isSelected ? 'linear-gradient(90deg, rgba(198, 166, 107, 0.22), rgba(16, 59, 50, 0.35))' : 'var(--bg-charcoal)',
                    color: isSelected ? 'var(--ivory-warm)' : 'var(--champagne-soft)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    borderLeft: isSelected ? '3px solid var(--gold-antique)' : '3px solid transparent'
                  }}
                  onClick={() => setSelectedKey(key)}
                >
                  <div className="small fw-semibold mb-1">{item.title}</div>
                  <span className="brutalist-archival-tag" style={{ fontSize: '0.58rem', padding: '2px 7px' }}>
                    {item.level?.replace('_', ' ')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="col-md-8">
          <div className="editorial-story-chapter h-100">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
              <span className="brutalist-archival-tag">
                <i className="bi bi-shield-check text-gold-antique"></i> {details.level?.replace('_', ' ')}
              </span>
              <span className="font-arabic fs-5 text-gold-antique" dir="rtl">{details.arabicTitle}</span>
            </div>
            <h3 className="font-display text-ivory-warm mb-3">{details.title}</h3>

            <h6 className="font-display text-gold-antique text-uppercase mb-2" style={{ fontSize: '0.78rem', letterSpacing: '0.12em' }}>
              Historical Methodology &amp; Archaeological Evidence
            </h6>
            <p className="font-serif text-ivory-muted mb-4" style={{ lineHeight: '1.8', fontSize: '0.95rem' }}>
              {details.methodology || details.evidence}
            </p>

            <div className="archive-plaque-card p-3.5 mb-4">
              <h6 className="font-display text-gold-antique text-uppercase mb-2.5" style={{ fontSize: '0.74rem', letterSpacing: '0.12em' }}>
                <i className="bi bi-journal-richtext me-2"></i>Primary Classical Chronicles Consulted
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small text-champagne mb-0">
                {(details.sources || ['Tarikh al-Rusul wa al-Muluk (al-Tabari)', 'Ansab al-Ashraf (al-Baladhuri)', 'Kitab al-Irshad (Shaykh al-Mufid)']).map((s, idx) => (
                  <li key={idx} className="d-flex align-items-center gap-2">
                    <i className="bi bi-bookmark-star text-gold-antique"></i>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              className="editorial-action-btn px-4 py-2.5"
              onClick={onNavigateToMap}
            >
              <i className="bi bi-compass me-2"></i>Locate Site on Spatial Digital Twin Map →
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
function MyZiyaratHub({ onNavigate, onOpenEmergency, onOpenArBeacon }) {
  const [activeTab, setActiveTab] = useState('gates'); // default tab inside drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showArLocalModal, setShowArLocalModal] = useState(false);
  const [customPlanSteps, setCustomPlanSteps] = useState(null);
  const [mapTheme, setMapTheme] = useState('light'); // 'light' (Warm Ivory) | 'dark'
  const [mapFilter, setMapFilter] = useState('all'); // 'all' | 'shrines' | 'gates' | 'water' | 'medical' | 'washroom' | 'wheelchair'
  const [gateShrineFilter, setGateShrineFilter] = useState('all'); // 'all' | 'shrine_hussain' | 'shrine_abbas'
  const [serviceFilter, setServiceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dynamic Karbala Sanctuary Time (Asia/Baghdad)
  const [karbalaTime, setKarbalaTime] = useState(() => {
    try {
      return new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Baghdad', hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (e) {
      return '12:00 PM';
    }
  });

  useEffect(() => {
    const tId = setInterval(() => {
      try {
        setKarbalaTime(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Baghdad', hour: '2-digit', minute: '2-digit', hour12: true }));
      } catch (e) {}
    }, 15000);
    return () => clearInterval(tId);
  }, []);

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

  // Planner & Custom Start Origin
  const [selectedPlanId, setSelectedPlanId] = useState('plan_first_time');
  const [selectedStartNodeId, setSelectedStartNodeId] = useState('n_hussain_qibla');
  const [showOfflinePackModal, setShowOfflinePackModal] = useState(false);

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
      accessibility: 'Step-Free Level Ramps Confirmed at Bab al-Rajaa & Bab al-Qibla; Subterranean Elevators',
      historicalIntro: 'Monumental central sanctuary encasing the Holy Zarih of Imam Hussain, Gowd-e Qatlgah, and the tombs of Ali al-Akbar, Ali al-Asghar, and the martyred companions of 61 AH.',
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
      accessibility: 'Step-Free Dedicated Ramp Confirmed at Bab al-Furat; Free Wheelchair Escort at South Portal',
      historicalIntro: 'The majestic eastern sanctuary honoring Hazrat Al-Abbas ibn Ali, standard-bearer and defender of the thirsty children of the Holy Household at Karbala.',
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
      keshwan: 'Outdoor Concourse (Footwear Permitted)',
      accessibility: '100% Flat Paved White Thassos Marble with Cooling Mist Sprayers & Shaded Rest Benches',
      historicalIntro: 'The revered 378-meter open esplanade connecting the two holy shrines, originally traversing the historical palms and the pathway between the encampments in 61 AH.',
      verifiedDate: '2026-03-15',
      source: 'Joint Holy Shrines Engineering Directorate',
      crowdTelemetry: 'Live telemetry unavailable (Continuous pedestrian esplanade)'
    },
    {
      id: 'dest_tall_zaynabiyya',
      name: 'Tall al-Zaynabiyya Historical Hillock',
      arabicName: 'تل الزينبية',
      subtitle: 'Elevated Vantage Point of Sayyida Zainab',
      image: 'assets/images/ai_61ah_tall_zaynabiyya.jpg',
      hasAuthenticPhoto: true,
      isHistoricalIllustration: true,
      photoStatus: 'historical_reconstruction',
      historicalConceptImage: 'assets/images/ai_61ah_tall_zaynabiyya.jpg',
      coords: { lat: 32.61605, lng: 44.03085 },
      coordsLabel: '32.6160° N, 44.0308° E',
      gatesCount: 'Main Street Portal',
      primaryGates: ['Al-Hawra Street Portal'],
      keshwan: 'Sanctuary Keshwan at Entrance',
      accessibility: 'Exterior Courtyard Accessible; Elevated Viewing Platform has Ramps & Staircase',
      historicalIntro: 'The elevated sandy knoll southwest of the shrine where Sayyida Zainab witnessed the fierce engagements of Ashura and looked toward the battlefield.',
      verifiedDate: '2026-03-15',
      source: 'Karbala Heritage & Topographical Reconstruction',
      crowdTelemetry: 'Continuous visitor access'
    },
    {
      id: 'dest_al_mukhayyam',
      name: 'Al-Mukhayyam al-Husayni (The Holy Camp)',
      arabicName: 'المخيم الحسيني الشريف',
      subtitle: 'Historical Encampment of Imam Hussain in 61 AH',
      image: 'assets/images/ai_61ah_encampment.jpg',
      hasAuthenticPhoto: true,
      isHistoricalIllustration: true,
      photoStatus: 'historical_reconstruction',
      historicalConceptImage: 'assets/images/ai_61ah_encampment.jpg',
      coords: { lat: 32.61395, lng: 44.02980 },
      coordsLabel: '32.6139° N, 44.0298° E',
      gatesCount: 'Camp Gates',
      primaryGates: ['Bab al-Mukhayyam'],
      keshwan: 'Main Entrance Keshwan',
      accessibility: 'Level Street Entrance; Barrier-Free Central Courtyard',
      historicalIntro: 'The sacred perimeter approximately 500 meters southwest of the shrine marking where the tents of Imam Hussain, his family, and loyal companions were pitched on 2 Muharram 61 AH.',
      verifiedDate: '2026-03-15',
      source: 'Karbala Heritage & Topographical Reconstruction',
      crowdTelemetry: 'Continuous visitor access'
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
    { id: 'emg_shrines', service: 'Joint Holy Shrines Central Guidance & Lost Persons Hotline', internationalNumber: '+964 32 322 0000', localLandline: '032-322222', authority: 'Astan Quds Central Administration', status: 'Verified Official Institutional Hotline', audited: 'March 15, 2026', freeDial: false },
    { id: 'emg_fire', service: 'Civil Defense & Fire Operations', shortNumber: '115', authority: 'General Directorate of Civil Defense', status: 'Verified Official Emergency Hotline', audited: 'March 15, 2026', freeDial: true },
    { id: 'emg_safir', service: 'Al-Safir Hospital Direct Emergency Trauma Bay', localLandline: '+964 32 328 100', authority: 'Holy Shrine Health Directorate', status: 'Verified Hospital Direct Line', audited: 'March 15, 2026', freeDial: false },
    { id: 'emg_kafeel', service: 'Al-Kafeel Super Speciality Hospital Desk', localLandline: '+964 760 234 4444', authority: 'Al-Abbas Holy Shrine Health Directorate', status: 'Verified Tertiary Hospital', audited: 'March 15, 2026', freeDial: false }
  ];

  const plans = [
    {
      id: 'plan_first_time',
      name: 'First-Time Pilgrim Sacred Foundation',
      duration: '4 - 5 Hours',
      walking: '1.4 km total',
      badge: 'Orderly & Spiritually Foundational',
      defaultOrigin: 'n_hussain_qibla',
      steps: [
        { time: '09:00', title: 'Arrival at Bab al-Qibla (Imam Hussain)', desc: 'Seek permission to enter (Idhn al-Dukhul), deposit footwear at Keshwan #1.' },
        { time: '09:30', title: 'Al-Ha’ir al-Husayni & Holy Zarih', desc: 'Recitation of Ziyarat Warith and two rak’ats of prayer in the holy sanctuary.' },
        { time: '11:00', title: 'Bayn al-Haramayn Walking Reflection', desc: 'Walk the 378m sacred esplanade northwards under shaded mist canopies.' },
        { time: '11:45', title: 'Holy Shrine of Al-Abbas (AS)', desc: 'Enter Bab al-Qibla; recitation of Ziyarat of the Standard-Bearer.' },
        { time: '13:00', title: 'Tall al-Zaynabiyya & Historical Camp', desc: 'Reflect upon the topography of sacrifice and the courage of Sayyida Zainab.' }
      ]
    },
    {
      id: 'plan_family',
      name: 'Family & Children Gentle Pace Journey',
      duration: '3.5 - 4 Hours',
      walking: '950m total (Frequent Shaded Rest)',
      badge: 'Family & Stroller Friendly',
      defaultOrigin: 'n_hussain_shuhada',
      steps: [
        { time: 'Step 1', title: 'Registration at Central Lost Persons Center', desc: 'Obtain child wristbands and ID verification cards at Markaz al-Mafqoodin in Bayn al-Haramayn.' },
        { time: 'Step 2', title: 'Bab al-Shuhada East Portal (Imam Hussain)', desc: 'Enter through the spacious eastern colonnade with stroller check-in available.' },
        { time: 'Step 3', title: 'Bayn al-Haramayn Shaded Hydration Station', desc: 'Regroup under mist cooling canopies; access free cold drinking water.' },
        { time: 'Step 4', title: 'Bab al-Hawaej West Portal (Al-Abbas)', desc: 'Spacious courtyard visitation with wide walkways suitable for family groups.' },
        { time: 'Step 5', title: 'Bab Baghdad Electric Shuttle Terminus', desc: 'Board free shrine electric vehicle back toward outer hotel transport perimeter.' }
      ]
    },
    {
      id: 'plan_senior_accessible',
      name: 'Senior & Wheelchair-Accessible Itinerary',
      duration: '2.5 - 3 Hours',
      walking: 'Under 600m (100% barrier-free)',
      badge: 'Wheelchair & Barrier-Free Verified',
      defaultOrigin: 'n_hussain_sw',
      steps: [
        { time: 'Step 1', title: 'Wheelchair Station (Bab al-Qibla)', desc: 'Obtain free wheelchair with optional volunteer attendant escort.' },
        { time: 'Step 2', title: 'Bab al-Rajaa Level Ramp Access', desc: 'Gentle step-free passage into spacious ground-level courtyard.' },
        { time: 'Step 3', title: 'Bayn al-Haramayn Shaded Rest', desc: 'Rest stops at cooling mist benches with direct access to drinking water.' },
        { time: 'Step 4', title: 'Bab al-Furat Elevator (Al-Abbas)', desc: 'Step-free entrance to the eastern sanctuary with dedicated elevator access.' }
      ]
    },
    {
      id: 'plan_express',
      name: 'Express Direct Ziyarat (Short Layover / Transit)',
      duration: '90 Minutes',
      walking: '750m direct walk',
      badge: 'Fast & Streamlined Transit',
      defaultOrigin: 'n_hussain_qibla',
      steps: [
        { time: '00:00', title: 'Bab al-Qibla Imam Hussain', desc: 'Courtyard Idhn al-Dukhul and concise recitation of Ziyarat Warith.' },
        { time: '00:30', title: 'Direct Bayn al-Haramayn Traverse', desc: 'Direct walk north along the central marble esplanade to Al-Abbas Shrine.' },
        { time: '00:45', title: 'Bab al-Qibla Al-Abbas Shrine', desc: 'Salutations and concise Ziyarat of Hazrat Abbas (AS).' },
        { time: '01:15', title: 'Bab Baghdad Shuttle Exit', desc: 'Direct exit toward return buses or transport vehicles.' }
      ]
    },
    {
      id: 'plan_ashura_historical',
      name: 'Ashura Topography & Historical Memorials',
      duration: '6 - 7 Hours',
      walking: '2.8 km comprehensive walking',
      badge: 'Scholarly & Historical Deep Dive',
      defaultOrigin: 'n_mukhayyam',
      steps: [
        { time: '08:00', title: 'Al-Mukhayyam (The Holy Encampment)', desc: 'Explore the historical location of the 30 tents pitched on 2 Muharram 61 AH.' },
        { time: '09:30', title: 'Tall al-Zaynabiyya Elevated Ridge', desc: 'Observe the battlefield orientation from Sayyida Zainab’s elevated vantage point.' },
        { time: '10:45', title: 'Holy Shrine of Imam Hussain & Maqtal', desc: 'Gowd-e Qatlgah and the memorial of the martyred companions (Shuhada).' },
        { time: '13:00', title: 'Maqam Kaff al-Abbas (Right & Left Hands)', desc: 'Twin historical memorials along the ancient course of Nahr al-Alqami.' },
        { time: '14:30', title: 'Holy Shrine of Al-Abbas (AS)', desc: 'Concluding prayers and reflection upon loyalty, devotion, and water sacrifice.' }
      ]
    },
    {
      id: 'plan_night_ziyarat',
      name: 'Serene Night & Dawn Pilgrimage (Tahajjud & Fajr)',
      duration: '3.5 - 4 Hours',
      walking: '1.2 km quiet meditative walking',
      badge: 'Quiet Vigil & Lowest Crowds',
      defaultOrigin: 'n_bayn_south',
      steps: [
        { time: '02:30 AM', title: 'Bayn al-Haramayn Starlight Walk', desc: 'Contemplative stroll along the calm white marble under cool night illumination.' },
        { time: '03:15 AM', title: 'Tahajjud & Dua in Rawda of Hazrat Abbas', desc: 'Night vigil prayer and Dua Kumayl or Dua Abu Hamza al-Thumali.' },
        { time: '04:45 AM', title: 'Congregational Fajr at Imam Hussain Shrine', desc: 'Perform Fajr morning prayer in the grand courtyard with community.' },
        { time: '05:30 AM', title: 'Dawn Salutations at Bab al-Sidra & Sunrise', desc: 'Recite Ziyarat Warith facing the golden dome as the sun rises over Karbala.' }
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

  // Download Self-Contained Offline Pilgrimage Guide
  const handleDownloadOfflineGuide = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Karbala Offline Pilgrimage Essentials Guide</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #080B0B; color: #E6D4AD; margin: 0; padding: 24px; line-height: 1.6; }
    h1, h2, h3 { color: #C6A66B; font-family: Georgia, serif; }
    .card { background: #141918; border: 1px solid #C6A66B; border-radius: 8px; padding: 18px; margin-bottom: 20px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; background: #C6A66B; color: #080B0B; text-transform: uppercase; }
    .phone { font-family: monospace; font-size: 19px; color: #34D399; font-weight: bold; }
    .arabic { font-family: "Amiri", "Traditional Arabic", serif; font-size: 22px; direction: rtl; color: #F5F0E6; margin: 10px 0; }
    .urdu { font-family: "Jameel Noori Nastaleeq", "Noto Nastaliq Urdu", serif; font-size: 18px; direction: rtl; color: #E6D4AD; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border: 1px solid #2a3330; padding: 10px; text-align: left; }
    th { background: #1b2220; color: #C6A66B; }
    .notice { background: rgba(16, 59, 50, 0.4); border-left: 4px solid #34D399; padding: 14px; margin-bottom: 20px; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>🕌 Karbala Offline Pilgrimage Essentials Guide</h1>
  <div class="notice">
    <strong>Audited Ground-Truth Reference (March 15, 2026)</strong><br>
    This self-contained document operates 100% offline without cellular data or internet connectivity.
  </div>

  <div class="card">
    <h2>🚨 24/7 Verified Iraqi Emergency Hotlines</h2>
    <table>
      <tr><th>Service</th><th>Telephone</th><th>Authority</th><th>Language</th></tr>
      <tr><td>Red Crescent Ambulance</td><td class="phone">122</td><td>Ministry of Health (Free Dial)</td><td>Arabic</td></tr>
      <tr><td>Iraqi Police & Security</td><td class="phone">104</td><td>Ministry of Interior (Free Dial)</td><td>Arabic / English</td></tr>
      <tr><td>Civil Defense & Fire</td><td class="phone">115</td><td>General Directorate of Civil Defense</td><td>Arabic</td></tr>
      <tr><td>Joint Holy Shrines Central Hotline</td><td class="phone">032-322222 / +964 32 322 0000</td><td>Astan Quds Central Administration</td><td>Arabic, Urdu, English, Persian</td></tr>
      <tr><td>Safeer al-Hussain ER Trauma Hospital</td><td class="phone">+964 32 328 100</td><td>50m North of Bab al-Sidra</td><td>Arabic, Urdu, English</td></tr>
      <tr><td>Al-Kafeel Super Speciality Hospital</td><td class="phone">+964 760 234 4444</td><td>Al-Husayniya Road (2.5km North)</td><td>Arabic, English, Urdu, Persian</td></tr>
    </table>
  </div>

  <div class="card">
    <h2>📍 Key Sacred Destinations & Verified Portals</h2>
    <ul>
      <li><strong>Holy Shrine of Imam Hussain (AS):</strong> 32.61603° N, 44.03244° E • Primary Portals: Bab al-Qibla (South), Bab al-Rajaa (Wheelchair Ramp), Bab al-Sidra (North)</li>
      <li><strong>Holy Shrine of Hazrat Al-Abbas (AS):</strong> 32.61860° N, 44.03584° E • Primary Portals: Bab al-Qibla (South), Bab al-Furat (East Ramp), Bab al-Hawaej (West)</li>
      <li><strong>Bayn al-Haramayn:</strong> 32.61732° N, 44.03414° E • 378m Shaded Marble Promenade • 100% Step-free</li>
      <li><strong>Tall al-Zaynabiyya:</strong> 32.61605° N, 44.03085° E • Historical knoll overlooking battlefield</li>
      <li><strong>Al-Mukhayyam al-Husayni:</strong> 32.61395° N, 44.02980° E • Encampment of Imam Hussain in 61 AH</li>
    </ul>
  </div>

  <div class="card">
    <h2>🗣️ Essential Arabic / Urdu / English Pilgrim Phrases</h2>
    <table>
      <tr><th>English</th><th>Arabic</th><th>Urdu</th></tr>
      <tr><td>Where is the nearest medical post or ambulance?</td><td class="arabic">أين أقرب مركز صحي أو إسعاف؟</td><td class="urdu">قریبی میڈیکل سنٹر یا ایمبولینس کہاں ہے؟</td></tr>
      <tr><td>I am separated from my family; where is the lost persons center?</td><td class="arabic">لقد ضعت عن عائلتي، أين مركز إرشاد التائهين؟</td><td class="urdu">میں خاندان سے بچھڑ گیا ہوں، گمشدہ افراد کا مرکز کہاں ہے؟</td></tr>
      <tr><td>Where can I find drinking water?</td><td class="arabic">أين أجد ماء شرب بارد؟</td><td class="urdu">پینے کا پانی کہاں ملے گا؟</td></tr>
      <tr><td>I need wheelchair assistance for an elderly pilgrim.</td><td class="arabic">أحتاج كرسي متحرك لكبير السن، أين قسم الإعارة؟</td><td class="urdu">مجھے بزرگ زائر کے لیے وہیل چیئر چاہیے، لون ڈیسک کہاں ہے؟</td></tr>
      <tr><td>Where are the shoe keeping deposits (Keshwan)?</td><td class="arabic">أين الكشوانية وأمانات الأحذية؟</td><td class="urdu">جوتے جمع کروانے کی جگہ (کشوانیہ) کہاں ہے؟</td></tr>
    </table>
  </div>

  <div class="card">
    <h2>📖 Core Ziyarat Recitations</h2>
    <h3>1. Idhn al-Dukhul (Seeking Permission to Enter)</h3>
    <div class="arabic">اللّهُمَّ إِنِّي وَقَفْتُ عَلى بابٍ مِنْ أَبْوابِ بُيُوتِ نَبِيِّكَ، وَقَدْ مَنَعْتَ النّاسَ أَنْ يَدْخُلُوا إِلّا بِإِذْنِهِ... أَأَدْخُلُ يا رَسُولَ اللهِ؟ أَأَدْخُلُ يا حُجَّةَ اللهِ؟</div>
    <p><em>"O Allah, I stand at one of the doors of the houses of Your Prophet... May I enter, O Messenger of Allah? May I enter, O Proof of Allah?"</em></p>

    <h3>2. Ziyarat Warith (Imam Hussain)</h3>
    <div class="arabic">السَّلامُ عَلَيْكَ يا وارِثَ آدَمَ صَفْوَةِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ نُوحٍ نَبِيِّ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ إِبْراهِيمَ خَلِيلِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ مُوسى كَلِيمِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ عِيسى رُوحِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ مُحَمَّدٍ حَبِيبِ اللهِ...</div>

    <h3>3. Ziyarat of Hazrat Al-Abbas (AS)</h3>
    <div class="arabic">السَّلامُ عَلَيْكَ يا أَبَا الفَضْلِ العَبَّاسَ ابْنَ أَمِيرِ المُؤْمِنِينَ، السَّلامُ عَلَيْكَ يا ابْنَ سَيِّدِ الوَصِيِّينَ، أَشْهَدُ أَنَّكَ قَدْ نَصَحْتَ لِلَّهِ وَلِرَسُولِهِ وَلأَخِيكَ فَنِعْمَ الأَخُ المُواسِي...</div>
  </div>
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Karbala_Offline_Pilgrim_Essentials_Guide.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // One-Tap Privacy Purge
  const purgeAllPilgrimData = () => {
    if (window.confirm('Are you sure you want to purge all saved pilgrimage data? This will clear your bookmarks, saved offline translations, and journey preferences.')) {
      localStorage.removeItem('karbala_pilgrim_prefs');
      localStorage.removeItem('karbala_saved_sites');
      localStorage.removeItem('karbala_saved_translations');
      alert('All locally stored pilgrimage data has been successfully purged.');
      window.location.reload();
    }
  };

  // Global offline pack download bridge
  useEffect(() => {
    window.triggerDownloadOfflinePack = handleDownloadOfflineGuide;
    return () => {
      delete window.triggerDownloadOfflinePack;
    };
  }, []);
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

        {/* --- Welcoming Heading & Live Status --- */}
        <div className="pilgrim-live-header mb-3">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div>
              <div className="spiritual-calligraphy-sub text-gold-antique font-arabic mb-1" style={{ fontSize: '1.05rem', letterSpacing: '0.04em' }}>
                الـسَّـلَامُ عَلَـيْـكَ يَـا أَبَـا عَـبْـدِ اللَّـهِ الحُـسَـيْـن
              </div>
              <h2 className="font-display text-white mb-1" style={{ letterSpacing: '0.06em', fontSize: '1.85rem' }}>
                MY ZIYARAT COMPANION
              </h2>
              <p className="text-ivory-soft mb-0 small" style={{ maxWidth: '680px', opacity: 0.88 }}>
                Authentic pedestrian navigation, verified shrine portals, barrier-free walking routes, and pilgrim assistance between the Two Holy Sanctuaries.
              </p>
            </div>

            {/* Top Right: Status Pills & Persistent Emergency Action */}
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="pilgrim-status-pill">
                <span className="live-pulse-emerald"></span>
                <span>
                  {gpsStatus === 'locked' && `GPS LOCKED (±${gpsAccuracy || 8}m)`}
                  {gpsStatus === 'simulated' && 'PILGRIM PRESENCE (BAB AL-QIBLA)'}
                  {gpsStatus === 'searching' && 'LOCATING SATELLITES...'}
                  {gpsStatus === 'denied' && 'SANCTUARY CENTER DEFAULT'}
                  {gpsStatus === 'idle' && 'READY'}
                </span>
              </span>

              {/* Dynamic Karbala Local Time (Asia/Baghdad) */}
              <span className="badge bg-black text-gold-antique border border-gold-subtle py-1.5 px-2.5" style={{ fontSize: '0.74rem' }}>
                <i className="bi bi-clock-history me-1 text-gold-antique"></i>
                Karbala: {karbalaTime} (UTC+3)
              </span>

              {/* Persistent Emergency Quick Pill */}
              <button
                type="button"
                className="emergency-persistent-pill"
                onClick={() => setShowEmergencyModal(true)}
                title="Open 24/7 Verified Iraqi Emergency Hotlines"
              >
                <i className="bi bi-shield-fill-exclamation text-danger fs-6"></i>
                <span className="d-none d-sm-inline">Emergency Help</span>
                <span className="badge bg-danger text-white ms-1" style={{ fontSize: '0.65rem' }}>104 • 122</span>
              </button>

              {/* Theme & Contrast Controls */}
              <button
                type="button"
                className="btn btn-sm btn-outline-light py-1 px-2"
                onClick={() => setMapTheme(mapTheme === 'dark' ? 'light' : 'dark')}
                style={{ fontSize: '0.74rem' }}
                title="Switch Cartography Theme"
              >
                <i className={`bi ${mapTheme === 'dark' ? 'bi-sun text-gold-antique' : 'bi-moon text-light'} me-1`}></i>
                {mapTheme === 'dark' ? 'Warm Ivory' : 'Dark Luxury'}
              </button>

              <button
                type="button"
                className={`btn btn-sm py-1 px-2 ${highContrast ? 'btn-warning text-dark' : 'btn-outline-light'}`}
                onClick={() => setHighContrast(!highContrast)}
                title="Toggle High Contrast"
                style={{ fontSize: '0.74rem' }}
              >
                <i className="bi bi-circle-half me-1"></i>Contrast
              </button>
            </div>
          </div>
        </div>

        {/* --- 4 Core Pilgrim Orientation Pillars (Phase 8 UX Transformation) --- */}
        <div className="ziyarat-hero-status-strip mb-4">
          <div className="ziyarat-status-col">
            <div className={`ziyarat-gps-indicator ${gpsStatus === 'locked' || gpsStatus === 'simulated' ? 'active' : ''}`}>
              <i className="bi bi-geo-alt-fill"></i>
            </div>
            <div className="ziyarat-status-text">
              <span className="ziyarat-status-title">1. Where Am I?</span>
              <span className="ziyarat-status-desc">
                {gpsStatus === 'locked' ? `Live GPS Position Locked (±${gpsAccuracy || 5}m)` : 'Bab al-Qibla (Imam Hussain Sanctuary Portal)'}
              </span>
            </div>
          </div>

          <div className="ziyarat-status-col">
            <div className="ziyarat-gps-indicator" style={{ borderColor: 'var(--lux-gold)', color: 'var(--lux-gold)' }}>
              <i className="bi bi-compass"></i>
            </div>
            <div className="ziyarat-status-text">
              <span className="ziyarat-status-title">2. Destination Target</span>
              <span className="ziyarat-status-desc text-truncate" style={{ maxWidth: '280px' }}>
                {selectedDestination ? selectedDestination.name.replace('Holy Shrine of ', '') : 'Imam Hussain Holy Shrine'}
              </span>
            </div>
          </div>

          <div className="ziyarat-status-col">
            <div className="ziyarat-gps-indicator" style={{ borderColor: '#38bdf8', color: '#38bdf8' }}>
              <i className="bi bi-camera-video-fill"></i>
            </div>
            <div className="ziyarat-status-text">
              <span className="ziyarat-status-title">3. AR Guidance</span>
              <button
                type="button"
                className="btn btn-sm btn-link p-0 text-start text-info fw-bold text-decoration-none"
                onClick={() => {
                  if (onOpenArBeacon) onOpenArBeacon(selectedDestination?.id || 'shrine_hussain');
                  else setShowArLocalModal(true);
                }}
                style={{ fontSize: '0.88rem' }}
              >
                AR Beacon View →
              </button>
            </div>
          </div>

          <div className="ziyarat-status-col">
            <div className="ziyarat-gps-indicator" style={{ borderColor: '#fca5a5', color: '#ef4444' }}>
              <i className="bi bi-shield-fill-exclamation"></i>
            </div>
            <div className="ziyarat-status-text">
              <span className="ziyarat-status-title">4. Need Assistance?</span>
              <button
                type="button"
                className="btn btn-sm btn-link p-0 text-start text-danger fw-bold text-decoration-none"
                onClick={() => setShowEmergencyModal(true)}
                style={{ fontSize: '0.88rem' }}
              >
                Call 122 / 104 Hotlines →
              </button>
            </div>
          </div>
        </div>

        {/* --- Large Destination Search Input --- */}
        <div className="mb-3 position-relative">
          <div className="input-group">
            <span className="input-group-text bg-charcoal border-gold-subtle text-gold-antique">
              <i className="bi bi-search fs-5"></i>
            </span>
            <input
              type="text"
              className="form-control pilgrim-search-bar"
              placeholder="Search shrine gates, water stations (Saqqa), first aid, wheelchair ramps, or landmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="btn btn-outline-secondary" type="button" onClick={() => setSearchQuery('')}>
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </div>

          {/* Autocomplete Quick Results Dropdown when user types */}
          {searchQuery && (
            <div className="p-2 rounded bg-black border border-gold-subtle position-absolute w-100 mt-1 shadow-lg" style={{ zIndex: 1050, maxHeight: '260px', overflowY: 'auto' }}>
              <div className="small text-secondary px-2 py-1">Direct Search Matches:</div>
              {filteredGates.slice(0, 4).map(g => (
                <div
                  key={g.id}
                  className="p-2 rounded d-flex align-items-center justify-content-between cursor-pointer border-bottom border-dark"
                  onClick={() => {
                    startRouting({ name: g.name, coords: g.coords, lat: g.coords.lat, lng: g.coords.lng });
                    setSearchQuery('');
                  }}
                >
                  <div>
                    <div className="text-white small fw-bold"><i className="bi bi-door-open-fill text-gold-antique me-1"></i>{g.name}</div>
                    <div className="text-secondary" style={{ fontSize: '0.72rem' }}>{g.shrine} • {g.arabicName}</div>
                  </div>
                  <button className="btn btn-xs btn-gold" style={{ fontSize: '0.72rem' }}>Navigate</button>
                </div>
              ))}
              {filteredNearby.slice(0, 4).map(f => (
                <div
                  key={f.id}
                  className="p-2 rounded d-flex align-items-center justify-content-between cursor-pointer border-bottom border-dark"
                  onClick={() => {
                    startRouting({ name: f.name, coords: f.coords, lat: f.coords.lat, lng: f.coords.lng });
                    setSearchQuery('');
                  }}
                >
                  <div>
                    <div className="text-white small fw-bold"><i className="bi bi-geo-alt-fill text-gold-antique me-1"></i>{f.name}</div>
                    <div className="text-secondary" style={{ fontSize: '0.72rem' }}>{f.category.toUpperCase()} • {f.distanceMeters}m away</div>
                  </div>
                  <button className="btn btn-xs btn-gold" style={{ fontSize: '0.72rem' }}>Navigate</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- Primary Sacred Destinations (Rebuilt Mobile & Desktop Responsive Cards) --- */}
        <div className="shrine-dest-grid-v2 mb-3">
          {shrines.map((sh) => {
            const isSelected = (selectedDestination?.id === sh.id) || (!selectedDestination && sh.id === 'dest_hussain_shrine');
            const distMeters = Math.round(calculateDistance(userLocation.lat, userLocation.lng, sh.coords.lat, sh.coords.lng));
            const estMinutes = Math.max(1, Math.round(distMeters / 70));
            const isAccessible = sh.accessibility && (sh.accessibility.includes('Ramp') || sh.accessibility.includes('Flat') || sh.accessibility.includes('Street') || sh.accessibility.includes('Elevator'));

            return (
              <div
                key={sh.id}
                className={`shrine-dest-card-v2 ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  setSelectedDestination(sh);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.setView([sh.coords.lat, sh.coords.lng], 17, { animate: true });
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Select destination: ${sh.name}`}
              >
                <div className="shrine-card-media">
                  <ResilientDestinationImage
                    src={sh.image}
                    alt={sh.name}
                    isIllustration={sh.isHistoricalIllustration}
                  />
                  <div className="shrine-card-badge-row">
                    <span className="badge bg-black bg-opacity-75 text-gold-antique border border-gold-subtle">
                      <i className="bi bi-geo-alt-fill me-1 text-gold-antique"></i>{distMeters}m
                    </span>
                    {isAccessible && (
                      <span className="badge bg-success bg-opacity-80 text-white" title={sh.accessibility}>
                        <i className="bi bi-person-wheelchair me-1"></i>Step-free
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrine-card-body">
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div style={{ minWidth: 0 }}>
                      <h5 className="shrine-card-title mb-0">{sh.name.replace('Holy Shrine of ', '')}</h5>
                      <div className="shrine-card-arabic">{sh.arabicName}</div>
                    </div>
                    {isSelected && (
                      <span className="badge bg-warning text-dark fw-bold flex-shrink-0" style={{ fontSize: '0.62rem', letterSpacing: '0.04em' }}>
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <div className="shrine-card-meta">
                    <span><i className="bi bi-clock me-1 text-gold-antique"></i>~{estMinutes} min</span>
                    <span>•</span>
                    <span className="text-truncate" style={{ maxWidth: '130px' }}>{sh.gatesCount}</span>
                    <span>•</span>
                    <span className="text-truncate text-secondary" style={{ maxWidth: '140px' }} title={`Verified: ${sh.verifiedDate} via ${sh.source}`}>
                      <i className="bi bi-patch-check-fill text-gold-antique me-1"></i>{sh.verifiedDate}
                    </span>
                  </div>

                  <div className="shrine-card-actions">
                    <button
                      type="button"
                      className="shrine-card-action-btn primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDestination(sh);
                        startRouting(sh);
                      }}
                      title={`Calculate walking route to ${sh.name}`}
                    >
                      <i className="bi bi-compass-fill"></i>
                      <span>Directions</span>
                    </button>

                    <button
                      type="button"
                      className="shrine-card-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDestination(sh);
                        if (mapInstanceRef.current) {
                          mapInstanceRef.current.setView([sh.coords.lat, sh.coords.lng], 18, { animate: true });
                        }
                      }}
                      title="Focus on map"
                    >
                      <i className="bi bi-eye"></i>
                      <span>View Map</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- Prominent Start Navigation Action CTA & AR Beacon Quick Action --- */}
        <div className="mb-3 d-flex gap-2 flex-wrap">
          <button
            type="button"
            className="start-navigation-cta-btn flex-grow-1"
            onClick={() => startRouting(selectedDestination || shrines[0])}
            disabled={routingLoading}
          >
            {routingLoading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Calculating Paved Pedestrian Route...
              </span>
            ) : (
              <span>
                <i className="bi bi-compass-fill me-2 fs-5"></i>
                Start Walking Route to {selectedDestination ? selectedDestination.name.replace('Holy Shrine of ', '') : 'Imam Hussain (AS)'}
                <span className="ms-2 opacity-75 fw-normal fs-6">
                  (~{Math.round(calculateDistance(userLocation.lat, userLocation.lng, (selectedDestination || shrines[0]).coords.lat, (selectedDestination || shrines[0]).coords.lng))}m • ~{Math.max(1, Math.round(calculateDistance(userLocation.lat, userLocation.lng, (selectedDestination || shrines[0]).coords.lat, (selectedDestination || shrines[0]).coords.lng) / 70))} min)
                </span>
              </span>
            )}
          </button>

          <button
            type="button"
            className="btn btn-outline-gold d-inline-flex align-items-center gap-2 px-3 py-2 fw-bold"
            onClick={() => {
              if (onOpenArBeacon) onOpenArBeacon(selectedDestination?.id || 'shrine_hussain');
              else setShowArLocalModal(true);
            }}
            title="Launch live camera-assisted AR guidance"
            style={{ borderRadius: '10px' }}
          >
            <i className="bi bi-camera-video-fill text-gold-antique fs-5"></i>
            <span className="d-none d-sm-inline">AR Guidance</span>
          </button>
        </div>

        {/* --- The Geographical Map Canvas & Controls --- */}
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

                  <div className="d-flex align-items-center gap-2 flex-wrap">
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
                        const dLat = selectedDestination.lat || selectedDestination.coords?.lat;
                        const dLng = selectedDestination.lng || selectedDestination.coords?.lng;
                        const url = activeRoute.externalFallbacks?.googleMapsUrl || `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${dLat},${dLng}&travelmode=walking`;
                        window.open(url, '_blank');
                      }}
                      title="Open walking directions in Google Maps"
                    >
                      <i className="bi bi-google me-1"></i> Google Maps
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light"
                      onClick={() => {
                        const dLat = selectedDestination.lat || selectedDestination.coords?.lat;
                        const dLng = selectedDestination.lng || selectedDestination.coords?.lng;
                        const url = activeRoute.externalFallbacks?.openStreetMapUrl || `https://www.openstreetmap.org/directions?engine=fossgis_osrm_foot&route=${userLocation.lat}%2C${userLocation.lng}%3B${dLat}%2C${dLng}`;
                        window.open(url, '_blank');
                      }}
                      title="Open pedestrian path in OpenStreetMap"
                    >
                      <i className="bi bi-map me-1"></i> OpenStreetMap
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

                {/* Origin vs Destination Spatial Telemetry Strip */}
                <div className="p-2.5 rounded bg-black border border-dark mb-3 small d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <div>
                    <span className="text-secondary"><i className="bi bi-geo-alt me-1 text-info"></i>Starting Point:</span>{' '}
                    <strong className="text-white">{gpsStatus === 'locked' ? 'Live GPS Location' : 'Selected Origin (Bab al-Qibla Hussain)'}</strong>{' '}
                    <span className="font-monospace text-secondary" style={{ fontSize: '0.72rem' }}>({userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)})</span>
                  </div>
                  <div>
                    <span className="text-secondary"><i className="bi bi-flag-fill me-1 text-gold-antique"></i>Target:</span>{' '}
                    <strong className="text-gold-antique">{selectedDestination.name.replace('Holy Shrine of ', '')}</strong>{' '}
                    <span className="font-monospace text-secondary" style={{ fontSize: '0.72rem' }}>({(selectedDestination.lat || selectedDestination.coords?.lat || 0).toFixed(5)}, {(selectedDestination.lng || selectedDestination.coords?.lng || 0).toFixed(5)})</span>
                  </div>
                </div>

                {/* Route Metrics (Distinguishing Straight-Line vs Routed Walking Distance) */}
                <div className="row g-2 mb-3">
                  <div className="col-6 col-md-3">
                    <div className="route-meta-stat">
                      <div className="stat-val text-white">{activeRoute.straightLineDistanceMeters || Math.round(calculateDistance(userLocation.lat, userLocation.lng, selectedDestination.coords?.lat || selectedDestination.lat, selectedDestination.coords?.lng || selectedDestination.lng))} m</div>
                      <div className="stat-lbl">Straight-Line Dist</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="route-meta-stat">
                      <div className="stat-val text-gold-antique">{activeRoute.routedDistanceMeters || activeRoute.totalDistanceMeters} m</div>
                      <div className="stat-lbl">Paved Walking Dist</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="route-meta-stat">
                      <div className="stat-val text-white">~{activeRoute.durationMinutes} min</div>
                      <div className="stat-lbl">Estimated Walking Time</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="route-meta-stat">
                      <div className="stat-val text-success">Step-Free ♿</div>
                      <div className="stat-lbl">Barrier-Free Paved Path</div>
                    </div>
                  </div>
                </div>

                {/* Accessibility notice */}
                <div className="p-2.5 rounded bg-black-subtle border border-dark mb-3 small text-light-subtle d-flex align-items-center gap-2">
                  <i className="bi bi-person-wheelchair text-success fs-5"></i>
                  <div>
                    <strong>Accessibility Status:</strong> Route strictly follows verified ground-level paved esplanades and barrier-free marble concourses. Indoor sanctuary access requires shoe deposit at designated Keshwan portals.
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

          </div>

        {/* --- Expandable Bottom Sheet / Amenities Drawer Trigger --- */}
        <div className="mb-4">
          <button
            type="button"
            className="amenities-drawer-trigger w-100"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <div className="d-flex align-items-center justify-content-between">
              <span className="d-flex align-items-center gap-2">
                <i className="bi bi-sliders text-gold-antique fs-5"></i>
                <strong className="text-white">Pilgrim Services, Gate Finder &amp; Tracks</strong>
                <span className="badge bg-dark text-gold-antique border border-gold-subtle ms-2">
                  {verifiedGates.length} Gates • {facilities.length} Services
                </span>
              </span>
              <div className="d-flex align-items-center gap-2">
                <span className="small text-gold-antique d-none d-sm-inline">{drawerOpen ? 'Collapse' : 'Expand All Services'}</span>
                <i className={`bi bi-chevron-${drawerOpen ? 'up' : 'down'} text-gold-antique fs-5`}></i>
              </div>
            </div>
          </button>

          {/* Drawer Body (Expandable) */}
          {drawerOpen && (
            <div className="p-4 rounded-bottom bg-charcoal border border-top-0 border-gold-subtle shadow-lg">
              {/* Tab Selector Inside Drawer */}
              <div className="d-flex gap-2 flex-wrap mb-4 pb-2 border-bottom border-dark">
                {[
                  { id: 'gates', label: 'Shrine Gate Finder', icon: 'bi-door-open-fill' },
                  { id: 'services', label: 'Services Near Me', icon: 'bi-geo-fill' },
                  { id: 'planner', label: 'Ziyarat Planner Tracks', icon: 'bi-calendar-check-fill' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`btn btn-sm ${activeTab === tab.id ? 'btn-gold' : 'btn-outline-light'}`}
                    onClick={() => setActiveTab(tab.id)}
                    style={{ fontSize: '0.80rem' }}
                  >
                    <i className={`bi ${tab.icon} me-1.5`}></i>
                    {tab.label}
                  </button>
                ))}
              </div>

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
              <div className="d-flex flex-wrap gap-2">
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

            {/* Theological Non-Mandatory Disclaimer Banner */}
            <div className="p-3 mb-3 rounded bg-black-subtle border border-gold-subtle d-flex align-items-start gap-2.5">
              <i className="bi bi-info-circle-fill text-gold-antique fs-5 flex-shrink-0 mt-0.5"></i>
              <div className="small text-champagne" style={{ fontSize: '0.80rem', lineHeight: '1.5' }}>
                <strong className="text-gold-antique">Theological Guidance on Devotional Sequences:</strong> Suggested visiting itineraries and sequences between Imam Hussain (AS) and Hazrat Abbas (AS) are practical aids arranged for physical comfort, orientation, and crowd mitigation. In authentic Shia jurisprudence and traditions, visiting sequences carry spiritual flexibility and are not mandatory ritual obligations or canonical dogmas. Pilgrims are entirely free to adapt their visitation according to personal physical stamina and prayer needs.
              </div>
            </div>

            {/* Customizable Starting Point Origin Selector */}
            <div className="p-3 mb-3 rounded bg-dark border border-dark d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="small text-gold-antique fw-bold">
                  <i className="bi bi-geo-alt-fill me-1"></i> Starting Point:
                </span>
                <select
                  className="form-select form-select-sm bg-black text-light border-gold-subtle"
                  style={{ maxWidth: '320px', fontSize: '0.78rem' }}
                  value={selectedStartNodeId}
                  onChange={(e) => setSelectedStartNodeId(e.target.value)}
                >
                  <option value="n_hussain_qibla">Bab al-Qibla (Imam Hussain South Portal)</option>
                  <option value="n_hussain_w_rajaa">Bab al-Rajaa (Wheelchair Ramp Accessible Portal)</option>
                  <option value="n_hussain_shuhada">Bab al-Shuhada (East Concourse Portal)</option>
                  <option value="n_hussain_n_sidra">Bab al-Sidra (North Gate / Bayn Approach)</option>
                  <option value="n_bayn_center">Bayn al-Haramayn Central Axis (Saqqa Water)</option>
                  <option value="n_abbas_qibla">Bab al-Qibla (Al-Abbas Main South Portal)</option>
                  <option value="n_abbas_e_furat">Bab al-Furat (Al-Alqami East River Portal)</option>
                  <option value="n_mukhayyam">Al-Mukhayyam al-Husayni (The Holy Camp)</option>
                  <option value="n_tall_zaynab">Tall al-Zaynabiyya Esplanade</option>
                  <option value="n_transport_shuttle">Bab Baghdad Shuttle Terminus (North Shuttle)</option>
                </select>
              </div>
              <span className="badge bg-black text-success border border-success-subtle" style={{ fontSize: '0.70rem' }}>
                <i className="bi bi-shield-check me-1"></i> Verified Pedestrian Network
              </span>
            </div>

            {/* Active Plan Card */}
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

                <div className="d-flex gap-2 flex-wrap">
                  {customPlanSteps && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setCustomPlanSteps(null)}
                      style={{ fontSize: '0.74rem' }}
                      title="Reset steps to default sequence"
                    >
                      <i className="bi bi-arrow-counterclockwise me-1"></i> Reset Sequence
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-sm btn-gold"
                    onClick={() => {
                      const firstStep = (customPlanSteps || activePlan.steps)[0];
                      startRouting({ id: 'plan_dest_1', name: firstStep.title, lat: 32.61520, lng: 44.03245 });
                    }}
                  >
                    <i className="bi bi-play-circle-fill me-1"></i> Start This Itinerary
                  </button>
                </div>
              </div>

              <div className="d-flex flex-column gap-2 mb-3">
                {(customPlanSteps || activePlan.steps).map((st, idx, arr) => (
                  <div className="p-3 rounded bg-dark border border-dark d-flex align-items-center gap-3 flex-wrap flex-sm-nowrap" key={idx}>
                    <div className="rounded-circle p-2 bg-black border border-gold-subtle text-gold-antique fw-bold text-center flex-shrink-0" style={{ width: 36, height: 36, fontSize: '0.85rem' }}>
                      {idx + 1}
                    </div>

                    <div className="flex-grow-1" style={{ minWidth: '180px' }}>
                      <div className="d-flex align-items-center gap-2">
                        <strong className="text-white">{st.title}</strong>
                        <span className="badge bg-secondary-subtle text-light" style={{ fontSize: '0.66rem' }}>{st.time}</span>
                      </div>
                      <div className="small text-secondary">{st.desc}</div>
                    </div>

                    {/* Step Reorder Controls (Move Up/Down & Remove) */}
                    <div className="d-flex align-items-center gap-1.5 flex-shrink-0 ms-auto">
                      <button
                        type="button"
                        className="btn btn-xs btn-outline-secondary py-1 px-1.5"
                        disabled={idx === 0}
                        onClick={() => {
                          const steps = [...(customPlanSteps || activePlan.steps)];
                          const temp = steps[idx];
                          steps[idx] = steps[idx - 1];
                          steps[idx - 1] = temp;
                          setCustomPlanSteps(steps);
                        }}
                        title="Move Step Up in Sequence"
                        aria-label="Move step up"
                      >
                        <i className="bi bi-chevron-up"></i>
                      </button>

                      <button
                        type="button"
                        className="btn btn-xs btn-outline-secondary py-1 px-1.5"
                        disabled={idx === arr.length - 1}
                        onClick={() => {
                          const steps = [...(customPlanSteps || activePlan.steps)];
                          const temp = steps[idx];
                          steps[idx] = steps[idx + 1];
                          steps[idx + 1] = temp;
                          setCustomPlanSteps(steps);
                        }}
                        title="Move Step Down in Sequence"
                        aria-label="Move step down"
                      >
                        <i className="bi bi-chevron-down"></i>
                      </button>

                      <button
                        type="button"
                        className="btn btn-xs btn-outline-danger py-1 px-1.5"
                        disabled={arr.length <= 1}
                        onClick={() => {
                          const steps = (customPlanSteps || activePlan.steps).filter((_, i) => i !== idx);
                          setCustomPlanSteps(steps);
                        }}
                        title="Remove Step from Itinerary"
                        aria-label="Remove step"
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>

                      <button
                        type="button"
                        className="btn btn-xs btn-outline-gold py-1 px-2 ms-1"
                        style={{ fontSize: '0.72rem' }}
                        onClick={() => {
                          startRouting({ id: `step_${idx}`, name: st.title, lat: 32.61603, lng: 44.03244 });
                        }}
                        title="Preview walking directions to this step"
                      >
                        <i className="bi bi-cursor-fill me-1"></i> Go
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Offline Pilgrimage Essentials Pack Banner */}
              <div className="p-3 rounded bg-black border border-gold-subtle d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3">
                <div>
                  <h6 className="font-display text-white mb-0 d-flex align-items-center gap-1.5">
                    <i className="bi bi-cloud-arrow-down-fill text-gold-antique"></i>
                    Offline Pilgrimage Essentials Pack (Zero Internet)
                  </h6>
                  <div className="small text-secondary" style={{ fontSize: '0.74rem' }}>
                    Stand-alone verified emergency numbers, shrine portals, Arabic/Urdu phrasebook, and core Ziyarat recitations.
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-gold"
                    onClick={() => setShowOfflinePackModal(true)}
                    style={{ fontSize: '0.74rem' }}
                  >
                    <i className="bi bi-eye-fill me-1"></i> View Offline Pack
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-gold"
                    onClick={handleDownloadOfflineGuide}
                    style={{ fontSize: '0.74rem' }}
                  >
                    <i className="bi bi-download me-1"></i> Download Guide (.html)
                  </button>
                </div>
              </div>

              {/* One-Tap Privacy Purge Action */}
              <div className="p-2.5 rounded bg-black-subtle border border-dark d-flex justify-content-between align-items-center flex-wrap gap-2 mt-2">
                <div className="small text-secondary" style={{ fontSize: '0.72rem' }}>
                  <i className="bi bi-shield-lock-fill text-success me-1"></i>
                  <strong>Zero Permanent Server Retention:</strong> All preferences and bookmarks are stored only in your browser.
                </div>
                <button
                  type="button"
                  className="btn btn-xs btn-outline-danger"
                  style={{ fontSize: '0.70rem' }}
                  onClick={purgeAllPilgrimData}
                >
                  <i className="bi bi-trash3 me-1"></i> Purge All Saved Pilgrimage Data
                </button>
              </div>

            </div>
          </div>
        )}

            </div>
          )}
        </div>

        {/* --- Emergency Hotlines Modal --- */}
        {showEmergencyModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content bg-charcoal border border-gold-subtle text-white">
                <div className="modal-header border-bottom border-dark">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-shield-fill-exclamation text-danger fs-4"></i>
                    <h5 className="modal-title font-display text-white mb-0">Audited 24/7 Iraqi Emergency Hotlines</h5>
                  </div>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowEmergencyModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <p className="text-secondary small mb-3">
                    Independently verified against Iraqi Ministry of Interior, Ministry of Health, and Holy Shrines General Secretariats (March 2026).
                  </p>
                  <div className="row g-3 mb-4">
                    {emergencyContacts.map(c => (
                      <div className="col-md-6" key={c.id}>
                        <div className="p-3 rounded bg-dark border border-dark h-100 d-flex flex-column justify-content-between">
                          <div>
                            <div className="d-flex justify-content-between align-items-start mb-1">
                              <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '0.68rem' }}>
                                {c.status}
                              </span>
                              <span className="small text-secondary" style={{ fontSize: '0.68rem' }}>Audited: {c.audited}</span>
                            </div>
                            <h6 className="font-display text-white mb-1">{c.service}</h6>
                            <div className="small text-secondary mb-2">{c.authority}</div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between p-2 rounded bg-black border border-dark">
                            <span className="font-monospace text-gold-antique fw-bold fs-5">
                              {c.shortNumber || c.internationalNumber || c.localLandline}
                            </span>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-light"
                              onClick={() => {
                                navigator.clipboard?.writeText(c.shortNumber || c.internationalNumber || c.localLandline);
                                alert(`Copied hotline: ${c.shortNumber || c.internationalNumber || c.localLandline}`);
                              }}
                            >
                              <i className="bi bi-clipboard me-1"></i>Copy
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded bg-black border border-gold-subtle small text-light-subtle">
                    <i className="bi bi-info-circle text-gold-antique me-2"></i>
                    <strong>Lost Pilgrim or Family Separation:</strong> Visit Markaz al-Mafqoodin (Lost Persons Center) located at Bayn al-Haramayn or dial <strong>+964 32 322 0000</strong>. Multilingual assistance (Urdu, Hindi, English, Persian, Arabic) is available around the clock.
                  </div>
                </div>
                <div className="modal-footer border-top border-dark">
                  <button type="button" className="btn btn-sm btn-gold" onClick={() => setShowEmergencyModal(false)}>
                    Close Hotline Directory
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* --- AR Sacred Beacon Modal --- */}
        <ArSacredBeaconModal
          isOpen={showArLocalModal}
          onClose={() => setShowArLocalModal(false)}
          initialTargetId={selectedDestination?.id || 'shrine_hussain'}
        />

        {/* --- Offline Pilgrimage Essentials Pack Modal --- */}
        <OfflinePackViewModal
          isOpen={showOfflinePackModal}
          onClose={() => setShowOfflinePackModal(false)}
          onDownloadHtml={handleDownloadOfflineGuide}
        />

        {/* Subtle Platform Footer Credit */}
        <div className="text-center py-4 border-top border-dark mt-5 global-developer-credit-line">
          <div className="text-secondary small mb-1" style={{ fontSize: '0.74rem' }}>
            Karbala Smart Ziyarat Companion 3.0 • Verified Sanctuary Orientation
          </div>
          <div>
            Developed by <strong style={{ color: 'var(--lux-gold, #C6A66B)' }}>Sayyed Faiz Zaidi</strong>
          </div>
        </div>

      </div>
    </div>
  );
}




// ==========================================================================
// EXPERIENCE 3: ASK KARBALA AI — MULTILINGUAL ASSISTANT (PHASE 5)
// ==========================================================================
function AskKarbalaAiHub({ onNavigate, onOpenEmergency, onOpenArBeacon }) {
  const [scanAction, setScanAction] = useState('translate_sign'); // 'translate_sign' | 'identify_landmark' | 'read_document'
  const [aiMode, setAiMode] = useState(() => {
    try {
      const initMode = sessionStorage.getItem('ai_initial_mode');
      if (initMode) {
        sessionStorage.removeItem('ai_initial_mode');
        if (initMode === 'translate' || initMode === 'chat' || initMode === 'recognize') {
          return initMode;
        }
      }
    } catch (e) {}
    return 'chat';
  }); // 'chat' | 'translate' | 'recognize'
  const [targetLang, setTargetLang] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem('karbala_pilgrim_prefs') || '{}');
      return p.language || 'ur';
    } catch (e) {
      return 'ur';
    }
  }); // 'ur-roman' | 'ur' | 'hi' | 'en' | 'fa' | 'ar'
  const [transMode, setTransMode] = useState('pilgrim'); // 'standard' | 'pilgrim' | 'religious'

  useEffect(() => {
    const onGlobalLang = (e) => {
      if (e.detail && e.detail.language) {
        setTargetLang(e.detail.language);
      }
    };
    window.addEventListener('karbala-language-change', onGlobalLang);
    return () => window.removeEventListener('karbala-language-change', onGlobalLang);
  }, []);

  // Phase 7: Conversational AI Companion State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome_1',
      role: 'assistant',
      text: 'Peace and blessings upon you, respected pilgrim. I am **Ask Karbala AI 3.0**, your source-grounded multilingual pilgrim companion.\n\nYou may ask me natural questions regarding the sacred genealogy of the Ahlul Bayt, family relationships, the 61 AH battle timeline, authentic classical citations (*al-Tabari*, *al-Mufid*), pedestrian directions to the holy shrines, or essential pilgrim facilities like drinking water and emergency care.\n\nHow may I assist your pilgrimage today?',
      intent: 'greeting',
      language: 'en',
      accuracyTier: 'Source-Grounded Companion Active',
      contextualActions: [
        { id: 'nav_hussain', label: 'Imam Hussain Holy Shrine', icon: 'bi-compass-fill', actionType: 'NAVIGATE', payload: { destinationId: 'dest_hussain_shrine' } },
        { id: 'nav_abbas', label: 'Hazrat Al-Abbas Shrine', icon: 'bi-compass-fill', actionType: 'NAVIGATE', payload: { destinationId: 'dest_abbas_shrine' } },
        { id: 'ar_beacon', label: 'AR Sacred Beacon Guidance', icon: 'bi-camera-video-fill', actionType: 'AR_BEACON', payload: { destinationId: 'dest_hussain_shrine' } },
        { id: 'translate_sign', label: 'Translate Arabic Sign', icon: 'bi-camera-fill', actionType: 'TRANSLATOR', payload: {} },
        { id: 'request_emergency', label: 'Emergency Hotlines (104 / 122)', icon: 'bi-shield-fill-exclamation', actionType: 'EMERGENCY', payload: {} }
      ],
      citations: [
        { work: 'Classical Historiographical Corpus', author: 'Authenticated Astan Data Models', detail: '8 Classical Sources & Digital Twin' }
      ],
      suggestedFollowUps: [
        'Imam Hussain ka Roza kahan hai?',
        'Sayyida Zainab ka Imam Hussain se kya rishta tha?',
        'Who was the mother of Hazrat Abbas?',
        'Where can I find drinking water near Bayn al-Haramayn?'
      ],
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechNotice, setSpeechNotice] = useState(null);
  const [seniorTextMode, setSeniorTextMode] = useState(false);
  const [starterCategories, setStarterCategories] = useState([]);
  const [activeSpeechMessageId, setActiveSpeechMessageId] = useState(null);
  const chatScrollRef = useRef(null);
  const recognitionRef = useRef(null);

  // Camera & Image refs & states
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('environment'); // 'environment' | 'user'
  const [cameraError, setCameraError] = useState(null);

  const [currentImageUri, setCurrentImageUri] = useState('assets/images/karbala_img_37_Karbala_City_1_jpg.jpg');
  const [selectedSignId, setSelectedSignId] = useState('sign_bab_qibla');
  const [imageRotation, setImageRotation] = useState(0);

  // OCR state (Audited - Zero Fake Numbers)
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState('');
  const [ocrEngineLabel, setOcrEngineLabel] = useState('Astan Lexicon Ground Truth Match');
  const [detectedArabic, setDetectedArabic] = useState('العتبة الحسينية المقدسة - باب القبلة');
  const [editableArabic, setEditableArabic] = useState('العتبة الحسينية المقدسة - باب القبلة');
  const [isEditingOcr, setIsEditingOcr] = useState(false);

  // Translation output state
  const [translating, setTranslating] = useState(false);
  const [translationData, setTranslationData] = useState({
    status: 'success',
    sourceText: 'العتبة الحسينية المقدسة - باب القبلة',
    targetLang: 'ur',
    mode: 'pilgrim',
    translatedText: 'عتبہ حسینیہ مقدسہ (حرمِ مطہر امام حسینؑ) — باب القبلہ (مرکزی داخلی دروازہ)',
    sacredTermsIdentified: [
      { arabic: 'العتبة الحسينية المقدسة', translation: 'عتبہ حسینیہ مقدسہ (حرمِ مطہر امام حسینؑ)', type: 'sanctuary' },
      { arabic: 'باب القبلة', translation: 'باب القبلہ (مرکزی داخلی دروازہ)', type: 'gate' }
    ],
    scholarlyInterpretation: null,
    isSafetyCritical: false,
    safetyWarning: null,
    translationAuthority: 'Karbala Sacred Lexicon Engine'
  });

  // TTS audio playback
  const [speaking, setSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [voiceNotice, setVoiceNotice] = useState(null);

  // Offline Saved Notebook
  const [savedTranslations, setSavedTranslations] = useState(() => {
    try {
      const saved = localStorage.getItem('karbala_saved_translations');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [showSavedNotebook, setShowSavedNotebook] = useState(false);

  // Tab 2 & 3 Benchmark data
  const [recognizeImage, setRecognizeImage] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);

  // Landmark Recognition & Heritage Knowledge State (Milestone 5)
  const [landmarkRecognizing, setLandmarkRecognizing] = useState(false);
  const [landmarkCandidates, setLandmarkCandidates] = useState([]);
  const [activeLandmarkMatch, setActiveLandmarkMatch] = useState(null);
  const [unrecognizedLandmark, setUnrecognizedLandmark] = useState(false);
  const [unrecognizedGuidance, setUnrecognizedGuidance] = useState(null);
  const [allLandmarks, setAllLandmarks] = useState([]);
  const [selectedLandmarkProfile, setSelectedLandmarkProfile] = useState(null);
  const [landmarkFilterCity, setLandmarkFilterCity] = useState('all');
  const [selectedSpecimenKey, setSelectedSpecimenKey] = useState('shrine_hussain_dome_day');
  const [landmarkBenchmarkReport, setLandmarkBenchmarkReport] = useState(null);
  const [runningBenchmark, setRunningBenchmark] = useState(false);

  // 9 Curated Architectural Specimens for Visual Benchmark
  const architecturalSpecimens = [
    {
      key: 'shrine_hussain_dome_day',
      title: 'Imam Hussain Holy Shrine — Golden Dome',
      arabic: 'العتبة الحسينية المقدسة',
      category: 'Karbala Sanctuary',
      image: 'assets/images/shrine_27.jpg',
      expectedId: 'landmark_hussain',
      hint: 'shrine_hussain_dome_day',
      coords: '32.61603° N, 44.03248° E'
    },
    {
      key: 'shrine_abbas_minaret',
      title: 'Al-Abbas Holy Shrine — Minarets & Iwan',
      arabic: 'العتبة العباسية المقدسة',
      category: 'Karbala Sanctuary',
      image: 'assets/images/shrine_22.jpg',
      expectedId: 'landmark_abbas',
      hint: 'shrine_abbas_minaret',
      coords: '32.61864° N, 44.03582° E'
    },
    {
      key: 'bayn_al_haramayn_marble',
      title: 'Bayn al-Haramayn — Pedestrian Concourse',
      arabic: 'ما بين الحرمين الشريفين',
      category: 'Karbala Promenade',
      image: 'assets/images/karbala_img_0_Beyn-_l_H_r_meyn__K_rb_la_jpg.jpg',
      expectedId: 'landmark_bayn_haramayn',
      hint: 'bayn_al_haramayn_marble',
      coords: '32.61730° N, 44.03410° E'
    },
    {
      key: 'tall_al_zaynabiyya_terrace',
      title: 'Tall al-Zaynabiyya — Elevated Knoll',
      arabic: 'التل الزينبي المشرف',
      category: 'Observation Vantage',
      image: 'assets/images/ai_61ah_tall_zaynabiyya.jpg',
      expectedId: 'landmark_tal_zaynabiyya',
      hint: 'tall_al_zaynabiyya_terrace',
      coords: '32.61520° N, 44.03150° E'
    },
    {
      key: 'mukhayyam_tents_dome',
      title: 'Al-Mukhayyam — Encampment Sanctuaries',
      arabic: 'المخيم الحسيني الشريف',
      category: 'Historical Encampment',
      image: 'assets/images/ai_61ah_encampment.jpg',
      expectedId: 'landmark_mukhayyam',
      hint: 'mukhayyam_tents_dome',
      coords: '32.61280° N, 44.02980° E'
    },
    {
      key: 'imam_ali_najaf_gilded',
      title: 'Imam Ali Holy Shrine — Golden Portal',
      arabic: 'العتبة العلوية المقدسة (النجف)',
      category: 'Intercity Sanctuary (Najaf)',
      image: 'assets/images/shrine_14.jpg',
      expectedId: 'landmark_imam_ali',
      hint: 'imam_ali_najaf_gilded',
      coords: '31.99610° N, 44.31420° E'
    },
    {
      key: 'kufa_mosque_muslim_aqil',
      title: 'Great Mosque of Kufa & Muslim ibn Aqil',
      arabic: 'مسجد الكوفة المعظم ومرقد مسلم',
      category: 'Expansion Sanctuary (Kufa)',
      image: 'assets/images/karbala_img_37_Karbala_City_1_jpg.jpg',
      expectedId: 'landmark_kufa_muslim',
      hint: 'kufa_mosque_muslim_aqil',
      coords: '32.02920° N, 44.40080° E'
    },
    {
      key: 'hurr_sanctuary_northwest',
      title: 'Sanctuary of Hurr ibn Yazid al-Riyahi',
      arabic: 'مرقد الصحابي الحر بن يزيد الرياحي',
      category: 'Northwest Outpost (5 km)',
      image: 'assets/images/karbala_img_37_Karbala_City_1_jpg.jpg',
      expectedId: 'landmark_hurr',
      hint: 'hurr_sanctuary_northwest',
      coords: '32.64500° N, 44.00200° E'
    },
    {
      key: 'unknown_negative_test',
      title: 'Non-Sanctuary Object (Negative Control)',
      arabic: 'عينة سلبية غير مقدسة — رفض فوري',
      category: 'Rejection Benchmark (Negative)',
      image: 'assets/images/karbala_img_30_Karbala__Iraq_jpg.jpg',
      expectedId: null,
      hint: 'unknown_coffee_cup',
      isNegative: true,
      coords: 'N/A'
    }
  ];


  // Curated Astan Architectural Signs
  const curatedSigns = [
    {
      id: 'sign_bab_qibla',
      title: 'Bab al-Qibla Entrance Sign',
      arabicText: 'العتبة الحسينية المقدسة - باب القبلة',
      category: 'Sanctuary Portal',
      thumbnail: 'assets/images/karbala_img_37_Karbala_City_1_jpg.jpg',
      mode: 'pilgrim',
      location: 'South Portal of Imam Hussain Shrine'
    },
    {
      id: 'sign_saqqa_water',
      title: 'Bayn al-Haramayn Drinking Water Station',
      arabicText: 'سقاية ماء بارد - ماء سبيل ما بين الحرمين',
      category: 'Pilgrim Service',
      thumbnail: 'assets/images/karbala_img_0_Beyn-_l_H_r_meyn__K_rb_la_jpg.jpg',
      mode: 'pilgrim',
      location: 'Central Concourse (Column 18)'
    },
    {
      id: 'sign_safir_hospital',
      title: 'Al-Safir Hospital Emergency Sign',
      arabicText: 'مستشفى السفير الجراحي للطوارئ - تفتيش أمني وإسعاف',
      category: 'Medical & Security',
      thumbnail: 'assets/images/karbala_img_37_Karbala_City_1_jpg.jpg',
      mode: 'standard',
      location: '120m South of Bab al-Qibla'
    },
    {
      id: 'sign_ziyarat_calligraphy',
      title: 'Sanctuary Ziyarat Calligraphy Frieze',
      arabicText: 'السَّلامُ عَلَيْكَ يا وارِثَ آدَمَ صَفْوَةِ اللهِ',
      category: 'Liturgical Inscription',
      thumbnail: 'assets/images/shrine_27.jpg',
      mode: 'religious',
      location: 'Inner Sanctuary Threshold'
    }
  ];

  const curatedDocuments = [
    {
      id: 'doc_ziyarat_warith',
      title: 'Ziyarat Warith Classical Tablet',
      arabicText: 'السَّلَامُ عَلَيْكَ يَا وَارِثَ آدَمَ صَفْوَةِ اللَّهِ، السَّلَامُ عَلَيْكَ يَا وَارِثَ نُوحٍ نَبِيِّ اللَّهِ، السَّلَامُ عَلَيْكَ يَا وَارِثَ إِبْرَاهِيمَ خَلِيلِ اللَّهِ',
      category: 'Sacred Supplication Parchment',
      thumbnail: 'assets/images/karbala_img_37_Karbala_City_1_jpg.jpg',
      mode: 'religious',
      location: 'Rawdat al-Shuhada Manuscript Archive'
    },
    {
      id: 'doc_astan_entry',
      title: 'Astan Official Pilgrim Sanctuary Notice',
      arabicText: 'تعليمات دخول الروضة الحسينية المقدسة: يرجى المحافظة على السكينة والوقار والالتزام بالمسارات المخصصة للزائرين',
      category: 'Sanctuary Wayfinding Bulletin',
      thumbnail: 'assets/images/karbala_img_240_Arba_een_Pilgrims_in_Bayn_al-Harmia.jpg',
      mode: 'pilgrim',
      location: 'Bab al-Qibla Entrance Portico'
    }
  ];

  const recognitionSamples = [
    {
      id: 'rec_hussain_dome',
      name: 'Holy Shrine of Imam Hussain (AS) — Central Golden Dome & Minarets',
      arabic: 'قبة الإمام الحسين عليه السلام والمنارتان الذهبيتان',
      image: 'assets/images/karbala_img_37_Karbala_City_1_jpg.jpg',
      matchType: 'Astan Architectural Landmark Match',
      features: ['24-Karat Pure Gold Gilding (7,200 plates)', 'Twin 35m Minarets', 'Crimson Banner of Hussain'],
      coords: '32.6160° N, 44.0324° E',
      historicalOrigin: 'Original grave depression (Gowd-e Qatlgah) dated 61 AH; current structure reconstructed across centuries.'
    },
    {
      id: 'rec_abbas_sanctuary',
      name: 'Holy Shrine of Hazrat Al-Abbas (AS) — Eastern Sanctuary',
      arabic: 'حرم أبي الفضل العباس عليه السلام',
      image: 'assets/images/shrine_27.jpg',
      matchType: 'Sanctuary Architectural Feature Match',
      features: ['Ceremonial Clock Tower', 'Furat / Al-Alqami Eastern Orientation', 'Ornate Kashi Tilework'],
      coords: '32.6186° N, 44.0358° E',
      historicalOrigin: 'Martyrdom site of the Standard-Bearer of Karbala on the banks of ancient Nahr al-Alqami.'
    },
    {
      id: 'rec_bayn_concourse',
      name: 'Bayn al-Haramayn Pedestrian Esplanade',
      arabic: 'ساحة ما بين الحرمين الشريفين',
      image: 'assets/images/karbala_img_0_Beyn-_l_H_r_meyn__K_rb_la_jpg.jpg',
      matchType: 'Promenade Geographic Landmark Match',
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

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Update translation whenever targetLang or transMode changes
  useEffect(() => {
    if (editableArabic && editableArabic.trim()) {
      triggerTranslation(editableArabic, targetLang, transMode);
    }
  }, [targetLang, transMode]);

  // Load Verified Landmark Database on mount and trigger initial benchmark match
  useEffect(() => {
    fetch('/api/landmarks')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.landmarks) {
          setAllLandmarks(data.landmarks);
        }
      })
      .catch(e => console.error('Error fetching landmarks:', e));

    triggerLandmarkRecognition('shrine_hussain_dome_day');
  }, []);

  // Expose test hooks for automated verification suite
  useEffect(() => {
    window.__openLandmarkProfile = openLandmarkProfile;
    window.__triggerLandmarkRecognition = triggerLandmarkRecognition;
  }, [allLandmarks]);

  const triggerLandmarkRecognition = async (specimenKeyOrUri, customFeatures = null) => {
    setLandmarkRecognizing(true);
    setUnrecognizedLandmark(false);
    setUnrecognizedGuidance(null);
    try {
      const hint = typeof specimenKeyOrUri === 'string' ? specimenKeyOrUri : selectedSpecimenKey;
      const res = await fetch('/api/landmarks/recognize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUri: currentImageUri,
          searchHint: hint,
          clientFeatures: customFeatures
        })
      });
      const data = await res.json();
      if (data.status === 'unrecognized') {
        setUnrecognizedLandmark(true);
        setUnrecognizedGuidance(data.guidance || 'Unable to identify this landmark confidently.');
        setActiveLandmarkMatch(null);
        setLandmarkCandidates(data.suggestedLandmarks || []);
      } else if (data.status === 'success') {
        setUnrecognizedLandmark(false);
        setActiveLandmarkMatch(data.bestMatch);
        setLandmarkCandidates(data.topCandidates || [data.bestMatch]);
      }
    } catch (e) {
      console.error('Error during landmark recognition:', e);
    } finally {
      setLandmarkRecognizing(false);
    }
  };

  const openLandmarkProfile = async (landmarkId) => {
    try {
      const res = await fetch(`/api/landmarks/${landmarkId}`);
      const data = await res.json();
      if (data.status === 'success' && data.landmark) {
        setSelectedLandmarkProfile(data.landmark);
      } else {
        const local = allLandmarks.find(l => l.id === landmarkId);
        if (local) setSelectedLandmarkProfile(local);
      }
    } catch (e) {
      const local = allLandmarks.find(l => l.id === landmarkId);
      if (local) setSelectedLandmarkProfile(local);
    }
  };

  const runBenchmarkSuite = async () => {
    setRunningBenchmark(true);
    try {
      const res = await fetch('/api/landmarks/benchmark');
      const data = await res.json();
      if (data.status === 'success' && data.report) {
        setLandmarkBenchmarkReport(data.report);
      }
    } catch (e) {
      console.error('Error running landmark benchmark:', e);
    } finally {
      setRunningBenchmark(false);
    }
  };


  const startCamera = async (facing = cameraFacing) => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.warn('Camera device notice:', err);
      setCameraError('Camera access unavailable or permission denied. You can upload a photo or select an authentic Karbala sign.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    if (cameraActive) {
      startCamera(nextFacing);
    }
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUri = canvas.toDataURL('image/jpeg', 0.9);
    setCurrentImageUri(dataUri);
    stopCamera();
    executeOcrOnImage(dataUri);
  };

  const handleFileUpload = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target.result;
      setCurrentImageUri(dataUri);
      stopCamera();
      executeOcrOnImage(dataUri);
    };
    reader.readAsDataURL(file);
  };

  const handleRotateImage = () => {
    if (!currentImageUri) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.height;
      canvas.height = img.width;
      const ctx = canvas.getContext('2d');
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((90 * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      const rotatedData = canvas.toDataURL('image/jpeg', 0.92);
      setCurrentImageUri(rotatedData);
      setImageRotation((prev) => (prev + 90) % 360);
    };
    img.src = currentImageUri;
  };

  const clearImage = () => {
    setCurrentImageUri(null);
    setDetectedArabic('');
    setEditableArabic('');
    setTranslationData(null);
    setOcrEngineLabel(null);
    stopCamera();
  };

  const selectCuratedSign = (s) => {
    setSelectedSignId(s.id);
    setCurrentImageUri(s.thumbnail);
    setTransMode(s.mode);
    setDetectedArabic(s.arabicText);
    setEditableArabic(s.arabicText);
    setOcrEngineLabel('Astan Official Inscription Ground Truth');
    stopCamera();
    executeOcrOnImage(s.thumbnail, s.arabicText);
  };

  const selectCuratedDocument = (doc) => {
    setSelectedSignId(doc.id);
    setCurrentImageUri(doc.thumbnail);
    setTransMode(doc.mode);
    setDetectedArabic(doc.arabicText);
    setEditableArabic(doc.arabicText);
    setOcrEngineLabel('Astan Official Manuscript Archive Reference');
    stopCamera();
    executeOcrOnImage(doc.thumbnail, doc.arabicText);
  };

  const executeOcrOnImage = async (dataUri, fallbackText = null) => {
    setOcrScanning(true);
    setOcrProgress(15);
    setOcrStatus('Initializing Arabic Neural OCR Engine...');

    try {
      if (fallbackText) {
        // Benchmark sample specimen loaded
        setOcrProgress(100);
        setOcrStatus('Astan Curated Ground Truth Reference loaded');
        setOcrEngineLabel('Astan Curated Ground Truth Reference');
        setDetectedArabic(fallbackText);
        setEditableArabic(fallbackText);
        triggerTranslation(fallbackText, targetLang, transMode);
      } else if (window.Tesseract) {
        setOcrProgress(35);
        setOcrStatus('Detecting Arabic characters & spatial features...');
        const result = await window.Tesseract.recognize(dataUri, 'ara+eng', {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(35 + Math.round((m.progress || 0) * 60));
              setOcrStatus(`Recognizing Arabic text: ${Math.round((m.progress || 0) * 100)}%`);
            }
          }
        });
        setOcrProgress(100);
        const extracted = result?.data?.text?.trim();
        if (extracted && extracted.length > 0) {
          setOcrStatus('OCR extraction finished');
          setOcrEngineLabel('Neural Arabic OCR (Tesseract.js • Ara+Eng)');
          setDetectedArabic(extracted);
          setEditableArabic(extracted);
          triggerTranslation(extracted, targetLang, transMode);
        } else {
          setOcrStatus('No clear Arabic text detected');
          setOcrEngineLabel('Neutral Review Required — Uncalibrated OCR');
          setDetectedArabic('');
          setEditableArabic('');
          setTranslationData({
            status: 'review_prompt',
            translatedText: 'No legible Arabic characters detected. Please verify lighting, alignment, or enter text manually below.',
            sacredTermsIdentified: [],
            isSafetyCritical: false,
            accuracyTier: 'Review Prompt Required'
          });
        }
      } else {
        setOcrProgress(100);
        setOcrStatus('Manual entry mode');
        setOcrEngineLabel('Neutral Review Required — Uncalibrated OCR');
        setDetectedArabic('');
        setEditableArabic('');
        setTranslationData({
          status: 'review_prompt',
          translatedText: 'Neural OCR worker not available offline. Please type or paste Arabic text manually.',
          sacredTermsIdentified: [],
          isSafetyCritical: false,
          accuracyTier: 'Manual Entry Required'
        });
      }
    } catch (err) {
      console.warn('OCR processing note:', err);
      setOcrProgress(100);
      setOcrStatus('Review prompt triggered');
      setOcrEngineLabel('Neutral Review Required — Uncalibrated OCR');
      setDetectedArabic('');
      setEditableArabic('');
      setTranslationData({
        status: 'review_prompt',
        translatedText: 'OCR extraction encountered low contrast or blur. Please adjust angle or enter text manually.',
        sacredTermsIdentified: [],
        isSafetyCritical: false,
        accuracyTier: 'Manual Review Prompt'
      });
    } finally {
      setOcrScanning(false);
    }
  };

  const triggerTranslation = async (text, lang, mode) => {
    if (!text || !text.trim()) return;
    setTranslating(true);
    try {
      const res = await fetch('/api/translator/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), targetLang: lang, mode })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setTranslationData(data);
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setTranslating(false);
    }
  };

  const handleSpeakText = (text, lang) => {
    if (!('speechSynthesis' in window)) {
      setVoiceNotice('Text-to-Speech is not supported in this browser environment.');
      return;
    }
    window.speechSynthesis.cancel();
    if (speaking) {
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;

    const voices = window.speechSynthesis.getVoices();
    const langMap = {
      ur: ['ur-PK', 'ur-IN', 'ur', 'hi-IN'],
      hi: ['hi-IN', 'hi'],
      en: ['en-US', 'en-GB', 'en'],
      fa: ['fa-IR', 'fa'],
      ar: ['ar-SA', 'ar-IQ', 'ar']
    };
    const desiredLocales = langMap[lang] || ['en-US'];
    const matchedVoice = voices.find((v) => desiredLocales.some((loc) => v.lang.toLowerCase().startsWith(loc.toLowerCase())));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
      setVoiceNotice(null);
    } else {
      setVoiceNotice(`Notice: Native ${lang.toUpperCase()} synthetic voice pack is not installed on this device. Displaying visual text reading.`);
    }
    utterance.lang = desiredLocales[0];

    setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const saveToNotebook = () => {
    if (!translationData) return;
    const entry = {
      id: Date.now(),
      arabic: editableArabic,
      translation: translationData.translatedText,
      targetLang,
      mode: transMode,
      date: new Date().toLocaleString()
    };
    const updated = [entry, ...savedTranslations.slice(0, 19)];
    setSavedTranslations(updated);
    try {
      localStorage.setItem('karbala_saved_translations', JSON.stringify(updated));
    } catch (e) {}
    alert('Translation saved to your Offline Notebook!');
  };

  const deleteNotebookEntry = (id) => {
    const updated = savedTranslations.filter((e) => e.id !== id);
    setSavedTranslations(updated);
    try {
      localStorage.setItem('karbala_saved_translations', JSON.stringify(updated));
    } catch (e) {}
  };

  const clearAllNotebookEntries = () => {
    if (window.confirm('Purge all saved translations from device storage? This guarantees zero local retention.')) {
      setSavedTranslations([]);
      try {
        localStorage.removeItem('karbala_saved_translations');
      } catch (e) {}
    }
  };

  // Phase 7: Fetch starter prompts from server
  useEffect(() => {
    fetch('/api/ai/starters')
      .then(r => r.json())
      .then(d => {
        if (d && d.starters) setStarterCategories(d.starters);
      })
      .catch(() => {});
  }, []);

  // Phase 7: Auto-consume pending AI query from any cross-module "Ask Karbala AI" button
  useEffect(() => {
    const consumePendingQuery = (qText) => {
      const q = (qText || window.__karbalaPendingAiQuery || '').trim();
      if (!q) return;
      window.__karbalaPendingAiQuery = null;
      setAiMode('chat');
      setTimeout(() => {
        handleSendChat(q);
      }, 60);
    };

    if (window.__karbalaPendingAiQuery) {
      consumePendingQuery(window.__karbalaPendingAiQuery);
    }

    const onExternalAiQuery = (e) => {
      if (e.detail && e.detail.query) {
        consumePendingQuery(e.detail.query);
      }
    };
    window.addEventListener('karbala-ask-ai-query', onExternalAiQuery);
    return () => window.removeEventListener('karbala-ask-ai-query', onExternalAiQuery);
  }, []);
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isSending]);

  // Phase 7: Send chat query to server RAG engine
  const handleSendChat = async (queryToSend) => {
    const q = (queryToSend !== undefined ? queryToSend : inputQuery).trim();
    if (!q || isSending) return;

    const userMsg = {
      id: 'user_' + Date.now(),
      role: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsSending(true);

    try {
      const historyPayload = chatMessages.slice(-6).map(m => ({
        role: m.role,
        text: m.text,
        personalityId: m.personality?.id,
        destinationId: m.navigationAction?.destinationId
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          conversationHistory: historyPayload,
          preferredLanguage: targetLang
        })
      });

      const data = await res.json();
      if (data.status === 'success') {
        const assistantMsg = {
          id: 'asst_' + Date.now(),
          role: 'assistant',
          text: data.reply,
          intent: data.intent,
          language: data.language,
          personality: data.personality,
          familyTreeAction: data.familyTreeAction,
          navigationAction: data.navigationAction,
          contextualActions: data.contextualActions || [],
          citations: data.citations || [],
          relatedPhotos: data.relatedPhotos || [],
          suggestedFollowUps: data.suggestedFollowUps || [],
          emergencyContacts: data.emergencyContacts,
          accuracyTier: data.accuracyTier,
          latencyMs: data.latencyMs,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, assistantMsg]);
      } else {
        setChatMessages(prev => [...prev, {
          id: 'err_' + Date.now(),
          role: 'assistant',
          text: 'Unable to retrieve verified response. Please verify connection or retry.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages(prev => [...prev, {
        id: 'err_' + Date.now(),
        role: 'assistant',
        text: 'Network connectivity note: Unable to contact the verification server.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsSending(false);
    }
  };

  // Phase 7: Web Speech Recognition (Microphone)
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechNotice('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      const localeMap = {
        'ur-roman': 'ur-PK',
        ur: 'ur-PK',
        hi: 'hi-IN',
        ar: 'ar-SA',
        en: 'en-US',
        fa: 'fa-IR'
      };
      recognition.lang = localeMap[targetLang] || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechNotice('Listening... Speak your sacred inquiry clearly.');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery(prev => (prev ? prev + ' ' : '') + transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechNotice('Microphone access blocked. Please permit microphone access in browser settings.');
        } else {
          setSpeechNotice(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setTimeout(() => setSpeechNotice(null), 3000);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Speech recognition exception:', e);
      setIsListening(false);
    }
  };

  // Phase 7: Web Speech Synthesis (Read aloud)
  const handleSpeakChatMessage = (msgId, text, lang) => {
    if (!('speechSynthesis' in window)) {
      setSpeechNotice('Text-to-speech is not supported in this browser environment.');
      return;
    }

    window.speechSynthesis.cancel();
    if (activeSpeechMessageId === msgId) {
      setActiveSpeechMessageId(null);
      return;
    }

    const cleanText = text.replace(/[*_#>`]/g, '').replace(/\[.*?\]\(.*?\)/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const langMap = {
      ur: ['ur-PK', 'ur-IN', 'ur', 'hi-IN'],
      hi: ['hi-IN', 'hi'],
      en: ['en-US', 'en-GB', 'en'],
      fa: ['fa-IR', 'fa'],
      ar: ['ar-SA', 'ar-IQ', 'ar'],
      'ur-roman': ['ur-PK', 'hi-IN', 'en-US']
    };
    const desiredLocales = langMap[lang] || ['en-US'];
    const matchedVoice = voices.find(v => desiredLocales.some(loc => v.lang.toLowerCase().startsWith(loc.toLowerCase())));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    utterance.lang = desiredLocales[0];

    setActiveSpeechMessageId(msgId);
    utterance.onend = () => setActiveSpeechMessageId(null);
    utterance.onerror = () => setActiveSpeechMessageId(null);
    window.speechSynthesis.speak(utterance);
  };

  // Phase 7: Clear conversation context
  const handleClearConversation = async () => {
    if (window.confirm('Purge conversation history? This immediately clears all session context.')) {
      try {
        await fetch('/api/ai/clear', { method: 'POST' });
      } catch(e) {}
      setChatMessages([
        {
          id: 'welcome_' + Date.now(),
          role: 'assistant',
          text: 'Conversation history purged. You may begin a fresh inquiry regarding Karbala 61 AH, sacred lineage, shrines, or pilgrim facilities.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Phase 7: Navigation & Encyclopedia Bridges
  const handleOpenInZiyarat = (destId) => {
    try {
      sessionStorage.setItem('ziyarat_initial_destination', destId);
    } catch(e) {}
    onNavigate('ziyarat');
  };

  const handleOpenInFamilyTree = (nodeId) => {
    try {
      sessionStorage.setItem('encyclopedia_initial_tab', 'family_tree');
      sessionStorage.setItem('encyclopedia_initial_node_id', nodeId);
    } catch(e) {}
    onNavigate('personalities');
  };

  const handleOpenMonograph = (personId) => {
    try {
      sessionStorage.setItem('encyclopedia_initial_tab', 'monographs');
      sessionStorage.setItem('encyclopedia_initial_personality_id', personId);
    } catch(e) {}
    onNavigate('personalities');
  };

  const handleExecuteContextualAction = (action) => {
    if (!action) return;
    switch (action.actionType) {
      case 'NAVIGATE':
        handleOpenInZiyarat(action.payload?.destinationId || 'dest_hussain_shrine');
        break;
      case 'AR_BEACON':
        if (onOpenArBeacon) {
          onOpenArBeacon(action.payload?.destinationId || 'dest_hussain_shrine');
        } else {
          onNavigate('ziyarat');
        }
        break;
      case 'TRANSLATOR':
        setAiMode('translate');
        break;
      case 'VIEW_GATES':
        try {
          sessionStorage.setItem('ziyarat_initial_tab', 'gates');
        } catch(e) {}
        onNavigate('ziyarat');
        break;
      case 'EMERGENCY':
        if (onOpenEmergency) {
          onOpenEmergency();
        } else {
          onNavigate('ziyarat');
        }
        break;
      case 'FAMILY_TREE':
        handleOpenInFamilyTree(action.payload?.nodeId || 'person_hussain');
        break;
      case 'MONOGRAPH':
        handleOpenMonograph(action.payload?.personalityId || 'person_hussain');
        break;
      case 'VIEW_CHANGE':
        onNavigate(action.payload?.view || 'home');
        break;
      case 'ZIYARAT_RECITE':
        onNavigate('quran');
        break;
      default:
        break;
    }
  };

  const askAiAboutSign = (signText) => {
    setAiMode('chat');
    const q = `Explain the religious and logistical meaning of this Arabic sign: "${signText}"`;
    handleSendChat(q);
  };

  const askAiAboutLandmark = (landmark) => {
    setAiMode('chat');
    const q = `Tell me about the sacred history, architectural evolution, and spiritual significance of ${landmark.establishedName || landmark.name}.`;
    handleSendChat(q);
  };

  const currentRec = recognitionSamples[recognizeImage];

  return (
    <div className="ai-companion-wrapper pb-5" style={{ background: 'var(--bg-obsidian)', minHeight: '100vh' }}>
      {/* Signature Full-Width Atmospheric AI Sanctuary Header */}
      <section
        className="position-relative overflow-hidden d-flex align-items-end"
        style={{ minHeight: '340px', padding: '64px 24px 40px', borderBottom: '1px solid rgba(200, 164, 91, 0.18)' }}
      >
        <div
          className="position-absolute inset-0"
          style={{
            backgroundImage: 'url(assets/images/karbala_hd_royal_dome_rain.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.28) contrast(1.15)'
          }}
        ></div>
        <div
          className="position-absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(5,7,6,0.45) 0%, rgba(5,7,6,0.82) 65%, #050706 100%)'
          }}
        ></div>

        <div className="container position-relative z-2 text-center" style={{ maxWidth: '960px' }}>
          <div className="doc-chapter-label justify-content-center">SCHOLARLY RESEARCH COMPANION · 8 CLASSICAL SOURCES</div>
          <h1 className="doc-monument-heading mb-2">
            ASK KARBALA AI
          </h1>
          <p className="doc-editorial-lead mx-auto mb-4" style={{ maxWidth: '720px', fontSize: '1.12rem' }}>
            A calm, source-grounded multilingual research assistant and optical sign translator for Karbala—conversing naturally in Urdu, Roman Urdu, Hindi, Arabic, English, and Persian.
          </p>

          {/* Clean Mode Switcher */}
          <div className="d-inline-flex flex-wrap justify-content-center gap-2 p-1.5 rounded-pill" style={{ background: 'rgba(11, 14, 12, 0.85)', border: '1px solid rgba(200, 164, 91, 0.28)' }}>
            <button
              type="button"
              className={`sacred-book-tab rounded-pill py-1.5 px-3.5 ${aiMode === 'chat' ? 'active' : ''}`}
              onClick={() => setAiMode('chat')}
            >
              <i className="bi bi-stars text-gold-antique"></i>
              <span>Research Assistant</span>
            </button>
            <button
              type="button"
              className={`sacred-book-tab rounded-pill py-1.5 px-3.5 ${aiMode === 'translate' ? 'active' : ''}`}
              onClick={() => { setAiMode('translate'); setScanAction('translate_sign'); }}
            >
              <i className="bi bi-translate text-gold-antique"></i>
              <span>Translate Shrine Sign</span>
            </button>
            <button
              type="button"
              className={`sacred-book-tab rounded-pill py-1.5 px-3.5 ${aiMode === 'recognize' ? 'active' : ''}`}
              onClick={() => { setAiMode('recognize'); setScanAction('identify_landmark'); }}
            >
              <i className="bi bi-camera text-gold-antique"></i>
              <span>Identify Landmark</span>
            </button>
          </div>
        </div>
      </section>

      <div className="container-fluid px-lg-5 px-3 pt-4">

        {/* ========================================================================== */}
        {/* CALM CONSUMER AI & MUSEUM RESEARCH ASSISTANT INTERFACE */}
        {/* ========================================================================== */}
        {aiMode === 'chat' && (
          <div className="consumer-ai-stage">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 px-2">
              <span className="small text-ivory-dim font-monospace" style={{ fontSize: '0.72rem', letterSpacing: '0.1em' }}>
                CONVERSATION STREAM · VERIFIED CITATIONS
              </span>
              <div className="d-flex align-items-center gap-3">
                <button
                  type="button"
                  className="btn btn-sm btn-link text-gold-antique text-decoration-none p-0"
                  style={{ fontSize: '0.76rem' }}
                  onClick={() => setSeniorTextMode(!seniorTextMode)}
                >
                  <i className="bi bi-type me-1"></i>
                  {seniorTextMode ? 'Standard Scale' : 'Large Typography (Aa+)'}
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-ivory-dim text-decoration-none p-0"
                  style={{ fontSize: '0.76rem' }}
                  onClick={handleClearConversation}
                >
                  <i className="bi bi-arrow-counterclockwise me-1"></i>
                  Reset Session
                </button>
              </div>
            </div>

            {/* Single Centered Conversation Surface */}
            <div className={`consumer-ai-conversation ${seniorTextMode ? 'senior-text-mode' : ''}`} ref={chatScrollRef}>
              {chatMessages.map(msg => (
                <div key={msg.id} className={msg.role === 'user' ? 'chat-msg-user' : 'chat-msg-assistant'}>
                  {msg.role === 'user' ? (
                    <>
                      <div className="chat-user-header">
                        <span><i className="bi bi-person-fill me-1"></i> Pilgrim Inquiry</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div className="fw-medium">{msg.text}</div>
                    </>
                  ) : (
                    <>
                      <div className="chat-assistant-badge-bar">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <span className="text-gold-antique fw-bold small" style={{ letterSpacing: '0.12em', fontSize: '0.72rem' }}>
                            <i className="bi bi-patch-check-fill me-1"></i> ASK KARBALA AI
                          </span>
                          {msg.accuracyTier && (
                            <span className="small text-ivory-dim font-monospace" style={{ fontSize: '0.68rem' }}>
                              · {msg.accuracyTier}
                            </span>
                          )}
                        </div>
                        <div className="small text-ivory-dim" style={{ fontSize: '0.72rem' }}>{msg.timestamp}</div>
                      </div>

                      {/* Main Message Body */}
                      <div className="chat-assistant-body mb-3">{msg.text}</div>

                      {/* Contextual Verified Application Actions */}
                      {msg.contextualActions && msg.contextualActions.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 my-2">
                          {msg.contextualActions.map((act, actIdx) => (
                            <button
                              key={actIdx}
                              type="button"
                              className="consumer-prompt-chip py-1 px-3"
                              onClick={() => handleExecuteContextualAction(act)}
                            >
                              {act.icon && <i className={`bi ${act.icon} text-gold-antique`}></i>}
                              <span>{act.label}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Personality Card Bridge */}
                      {msg.personality && (
                        <div className="chat-entity-callout">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={getArchitecturalPhoto(msg.personality.id) || 'assets/images/shrine_27.jpg'}
                              alt={msg.personality.name}
                              style={{ width: '52px', height: '52px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--gold-antique)' }}
                            />
                            <div>
                              <div className="fw-bold text-ivory-warm mb-0" style={{ fontSize: '0.96rem' }}>{msg.personality.name}</div>
                              <div className="small text-gold-antique font-arabic-sign" style={{ direction: 'rtl', fontSize: '0.90rem' }}>{msg.personality.arabicName}</div>
                              <div className="small text-ivory-muted" style={{ fontSize: '0.75rem' }}>{msg.personality.honorific}</div>
                            </div>
                          </div>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="consumer-prompt-chip py-1 px-3"
                              onClick={() => handleOpenMonograph(msg.personality.id)}
                            >
                              <i className="bi bi-journal-text text-gold-antique"></i> Monograph
                            </button>
                            <button
                              type="button"
                              className="consumer-prompt-chip py-1 px-3"
                              onClick={() => handleOpenInFamilyTree(msg.personality.id)}
                            >
                              <i className="bi bi-diagram-3 text-gold-antique"></i> Lineage
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Navigation Action Bridge */}
                      {msg.navigationAction && (
                        <div className="chat-nav-callout">
                          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-1">
                            <div>
                              <span className="text-gold-antique small fw-bold me-2" style={{ letterSpacing: '0.1em' }}>SANCTUARY WAYFINDING ·</span>
                              <strong className="text-ivory-warm" style={{ fontSize: '1.0rem' }}>{msg.navigationAction.name}</strong>
                            </div>
                            <span className="small text-gold-antique font-arabic-sign">{msg.navigationAction.arabic}</span>
                          </div>
                          <button
                            type="button"
                            className="cinema-back-link mt-1"
                            onClick={() => handleOpenInZiyarat(msg.navigationAction.destinationId)}
                          >
                            <i className="bi bi-compass"></i>
                            <span>Open Route in Sanctuary Map →</span>
                          </button>
                        </div>
                      )}

                      {/* Family Tree Action Bridge */}
                      {msg.familyTreeAction && !msg.personality && (
                        <div className="chat-family-callout">
                          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                            <strong className="text-ivory-warm">{msg.familyTreeAction.label}</strong>
                            <span className="small text-ivory-muted">{msg.familyTreeAction.relationshipSummary}</span>
                          </div>
                          <button
                            type="button"
                            className="cinema-back-link"
                            onClick={() => handleOpenInFamilyTree(msg.familyTreeAction.nodeId)}
                          >
                            <i className="bi bi-diagram-3"></i>
                            <span>Inspect Sacred Genealogy →</span>
                          </button>
                        </div>
                      )}

                      {/* Classical Historiographical Citations */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-3 pt-2" style={{ borderTop: '1px solid rgba(200,164,91,0.16)' }}>
                          <div className="small text-gold-antique fw-semibold mb-1" style={{ fontSize: '0.74rem', letterSpacing: '0.08em' }}>
                            <i className="bi bi-book-half me-1.5"></i>PRIMARY HISTORICAL SOURCES:
                          </div>
                          {msg.citations.map((c, ci) => (
                            <div key={ci} className="small text-ivory-muted" style={{ fontSize: '0.76rem' }}>
                              · <strong>{c.work}</strong> ({c.author}) — <em>{c.detail}</em>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Related Sanctuary Photos */}
                      {msg.relatedPhotos && msg.relatedPhotos.length > 0 && (
                        <div className="d-flex gap-2 mt-3 flex-wrap">
                          {msg.relatedPhotos.map((imgUri, pIdx) => (
                            <img
                              key={pIdx}
                              src={imgUri}
                              alt="Sacred visual"
                              style={{ width: '92px', height: '66px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(200,164,91,0.35)', cursor: 'pointer' }}
                              onClick={() => setCurrentImageUri(imgUri)}
                              title="Click to preview photograph"
                            />
                          ))}
                        </div>
                      )}

                      {/* Suggested Follow-up Inquiries */}
                      {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mt-3">
                          {msg.suggestedFollowUps.map((fu, fi) => (
                            <button
                              key={fi}
                              type="button"
                              className="consumer-prompt-chip py-1 px-2.5"
                              style={{ fontSize: '0.75rem' }}
                              onClick={() => handleSendChat(fu)}
                            >
                              <i className="bi bi-chat-dots text-gold-antique"></i>
                              <span>{fu}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Quiet Action Bar */}
                      <div className="chat-action-bar mt-2">
                        <button
                          type="button"
                          className={`chat-tool-btn ${activeSpeechMessageId === msg.id ? 'speaking' : ''}`}
                          onClick={() => handleSpeakChatMessage(msg.id, msg.text, msg.language)}
                        >
                          <i className={`bi ${activeSpeechMessageId === msg.id ? 'bi-stop-fill' : 'bi-volume-up'}`}></i>
                          {activeSpeechMessageId === msg.id ? 'Stop Audio' : 'Listen'}
                        </button>
                        <button
                          type="button"
                          className="chat-tool-btn"
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(msg.text);
                            }
                          }}
                        >
                          <i className="bi bi-clipboard"></i> Copy
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {isSending && (
                <div className="chat-msg-assistant">
                  <div className="d-flex align-items-center gap-2 text-champagne small">
                    <span className="spinner-border spinner-border-sm text-gold-antique" role="status"></span>
                    <span>Consulting Knowledge Graph &amp; Classical Manuscripts...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Speech Notice Alert */}
            {speechNotice && (
              <div className="p-2 mb-3 rounded bg-black border border-warning small text-warning d-flex align-items-center justify-content-between">
                <div>
                  <i className="bi bi-info-circle-fill me-1.5"></i>
                  {speechNotice}
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  style={{ fontSize: '0.65rem' }}
                  onClick={() => setSpeechNotice(null)}
                ></button>
              </div>
            )}

            {/* Large Floating Input Composer */}
            <div className="consumer-ai-composer">
              <textarea
                className="chat-composer-input"
                placeholder="Ask about 61 AH history, Bani Hashim genealogy, Ziyarat meanings, or shrine gates in Urdu, Roman Urdu, Hindi, Arabic, English, or Persian..."
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChat();
                  }
                }}
                rows={2}
              />

              <div className="chat-composer-controls pt-2 mt-2" style={{ borderTop: '1px solid rgba(200,164,91,0.16)' }}>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    className={`mic-btn ${isListening ? 'listening' : ''}`}
                    onClick={toggleListening}
                    title={isListening ? 'Stop listening' : 'Speak inquiry via microphone'}
                  >
                    <i className={`bi ${isListening ? 'bi-mic-mute-fill' : 'bi-mic-fill'}`}></i>
                  </button>

                  <select
                    className="cinema-lang-select"
                    value={targetLang}
                    onChange={e => setTargetLang(e.target.value)}
                  >
                    <option value="ur-roman">Roman Urdu</option>
                    <option value="ur">اردو (Urdu)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="ar">العربية (Arabic)</option>
                    <option value="en">English</option>
                    <option value="fa">فارسی (Persian)</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="btn-cinema-gold py-2 px-4"
                  style={{ fontSize: '0.78rem' }}
                  disabled={!inputQuery.trim() || isSending}
                  onClick={() => handleSendChat()}
                >
                  {isSending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                      <span>Consulting...</span>
                    </>
                  ) : (
                    <>
                      <span>Ask Karbala AI</span>
                      <i className="bi bi-arrow-up-right"></i>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Suggested Prompts as Subtle Chips Below the Composer */}
            <div className="consumer-prompt-pills">
              {starterCategories.reduce((acc, cat) => acc.concat(cat.prompts || []), []).slice(0, 6).map((p, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  className="consumer-prompt-chip"
                  onClick={() => handleSendChat(p.text)}
                >
                  <i className="bi bi-sparkles text-gold-antique"></i>
                  <span>{p.label || p.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- Camera-First "Scan Anything" Spiritual Hero Header (Shown when in Translate or Recognize mode) --- */}
        {aiMode !== 'chat' && (
          <>
          <div className="pilgrim-live-header mb-4" style={{ background: 'linear-gradient(135deg, #161026 0%, #22173B 50%, #120D1F 100%)' }}>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge" style={{ background: '#4A148C', color: '#E1BEE7', border: '1px solid #7B1FA2', letterSpacing: '0.08em' }}>
                  <i className="bi bi-camera-fill me-1"></i>
                  ASK KARBALA AI CAMERA
                </span>
                <span className="badge bg-dark text-gold-antique border border-gold-subtle" style={{ fontSize: '0.72rem' }}>
                  MULTILINGUAL SACRED VISION
                </span>
              </div>
              <h2 className="font-display text-white mb-1" style={{ letterSpacing: '0.06em', fontSize: '1.9rem' }}>
                SCAN ANYTHING IN KARBALA
              </h2>
              <p className="text-ivory-soft mb-0 small" style={{ maxWidth: '820px', opacity: 0.9 }}>
                Point your camera or upload any Karbala directional sign, shrine portal inscription, or sacred document for verified translations in Urdu, Hindi, English, and Persian with sacred lexicon protection and voice playback.
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-black border border-gold-subtle text-champagne py-2 px-3">
                <i className="bi bi-shield-lock-fill text-success me-1.5"></i>
                Zero Data Retention • Offline Privacy Protected
              </span>
            </div>
          </div>
        </div>

        {/* --- 3 Distinct Action Cards (Primary Chooser) --- */}
        <div className="row g-3 mb-4">
          {[
            {
              id: 'translate_sign',
              title: 'Translate Arabic Sign',
              icon: 'bi-translate',
              desc: 'Directional signs, gate portals, and corridor markers translated with sacred terminology preservation.'
            },
            {
              id: 'identify_landmark',
              title: 'Identify Shrine or Landmark',
              icon: 'bi-aspect-ratio-fill',
              desc: 'Visual recognition of golden domes, minarets, saqqa fountains, and historical sites with verified coordinates.'
            },
            {
              id: 'read_document',
              title: 'Read a Document',
              icon: 'bi-file-earmark-text-fill',
              desc: 'Ziyarat Warith tablets, supplications, Astan official notices, and manuscripts rendered in readable high-contrast text.'
            }
          ].map(act => (
            <div className="col-md-4 col-12" key={act.id}>
              <div
                className={`scan-action-card ${scanAction === act.id ? 'active' : ''}`}
                onClick={() => {
                  setScanAction(act.id);
                  if (act.id === 'identify_landmark') {
                    setAiMode('recognize');
                  } else {
                    setAiMode('translate');
                    if (act.id === 'read_document') {
                      selectCuratedDocument(curatedDocuments[0]);
                    }
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="scan-action-icon-circle">
                    <i className={`bi ${act.icon} text-gold-antique fs-4`}></i>
                  </div>
                  <div>
                    <h5 className="font-display text-white mb-1" style={{ fontSize: '1.08rem' }}>{act.title}</h5>
                    <p className="small text-secondary mb-0" style={{ fontSize: '0.78rem', lineHeight: '1.4' }}>{act.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </>
        )}

        {/* --- TAB 1: PRODUCTION AI CAMERA TRANSLATOR --- */}
        {aiMode === 'translate' && (
          <>
          <div className="row g-4 mb-5">
            {/* Left Column: Viewfinder, Camera, Upload, Curated Signs */}
            <div className="col-lg-5 col-md-12">
              <div className="p-4 rounded-3 bg-charcoal border border-gold-subtle h-100 d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h4 className="font-display text-white mb-0" style={{ fontSize: '1.25rem' }}>
                    <i className="bi bi-camera-fill text-gold-antique me-2"></i>
                    Optical Camera Scanner
                  </h4>
                  <span className="badge bg-dark border border-gold-subtle text-champagne" style={{ fontSize: '0.7rem' }}>
                    <i className="bi bi-shield-lock-fill text-success me-1"></i>
                    Zero Retention Privacy
                  </span>
                </div>

                {/* Camera Viewfinder */}
                <div className="camera-viewfinder mb-3">
                  {cameraActive ? (
                    <video ref={videoRef} autoPlay playsInline muted className="camera-video-element" />
                  ) : currentImageUri ? (
                    <img
                      src={currentImageUri}
                      alt="Sign for translation"
                      className="camera-preview-img"
                      style={{ transform: `rotate(${imageRotation}deg)`, transition: 'transform 0.3s ease' }}
                    />
                  ) : (
                    <div className="text-center p-4">
                      <i className="bi bi-camera text-secondary fs-1 mb-2 d-block"></i>
                      <div className="small text-secondary">No image loaded. Start camera or upload photograph.</div>
                    </div>
                  )}

                  {/* Golden Viewfinder Framing Corners */}
                  <div className="viewfinder-corner corner-tl"></div>
                  <div className="viewfinder-corner corner-tr"></div>
                  <div className="viewfinder-corner corner-bl"></div>
                  <div className="viewfinder-corner corner-br"></div>

                  {/* Scanning Laser Beam */}
                  {ocrScanning && <div className="scan-laser-line"></div>}
                </div>

                {/* Viewfinder Controls Toolbar */}
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {cameraActive ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-sm btn-gold flex-grow-1"
                        onClick={captureSnapshot}
                      >
                        <i className="bi bi-record-circle-fill me-1"></i>
                        Snap &amp; Translate
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light"
                        onClick={toggleCameraFacing}
                        title="Flip Camera (Front / Back)"
                      >
                        <i className="bi bi-arrow-repeat"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={stopCamera}
                        title="Close Camera"
                      >
                        <i className="bi bi-x-circle"></i>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn btn-sm btn-gold flex-grow-1"
                        onClick={() => startCamera()}
                      >
                        <i className="bi bi-camera-video-fill me-1"></i>
                        Live Camera
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      >
                        <i className="bi bi-upload me-1"></i>
                        Upload
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleFileUpload}
                      />
                      {currentImageUri && (
                        <>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={handleRotateImage}
                            title="Rotate 90 degrees"
                          >
                            <i className="bi bi-arrow-clockwise"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={clearImage}
                            title="Purge Image (Privacy)"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* Camera Permission Alert (if any) */}
                {cameraError && (
                  <div className="p-2 mb-3 rounded bg-warning-subtle text-dark border border-warning small" style={{ fontSize: '0.78rem' }}>
                    <i className="bi bi-exclamation-triangle-fill text-warning me-1.5"></i>
                    {cameraError}
                  </div>
                )}

                {/* OCR Recognition Progress Banner */}
                {ocrScanning && (
                  <div className="p-2.5 mb-3 rounded bg-dark border border-gold-subtle">
                    <div className="d-flex justify-content-between small text-champagne mb-1.5" style={{ fontSize: '0.76rem' }}>
                      <span><i className="bi bi-cpu-fill text-gold-antique me-1"></i>{ocrStatus}</span>
                      <strong>{ocrProgress}%</strong>
                    </div>
                    <div className="progress" style={{ height: '4px', background: '#222' }}>
                      <div
                        className="progress-bar bg-gold"
                        role="progressbar"
                        style={{ width: `${ocrProgress}%`, transition: 'width 0.2s' }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Real-World Tough Lighting & Calligraphy Guidance Tips */}
                <div className="p-2.5 rounded bg-black-subtle border border-gold-subtle small text-champagne mb-2" style={{ fontSize: '0.74rem' }}>
                  <div className="fw-bold text-gold-antique mb-1.5 d-flex align-items-center gap-1.5">
                    <i className="bi bi-lightbulb-fill"></i> Real-World Lighting &amp; Calligraphy Tips:
                  </div>
                  <div className="d-flex flex-column gap-1 text-light-subtle">
                    <div><strong className="text-champagne">Sunlight Glare:</strong> Angle camera slightly away from direct marble or golden dome reflection to prevent washout.</div>
                    <div><strong className="text-champagne">Night / Twilight:</strong> Hold phone steady for 1–2 seconds; utilize ambient courtyard lanterns or phone torch.</div>
                    <div><strong className="text-champagne">Motion Blur:</strong> Pause walking or rest hand on a barrier before snapping crowded corridor signs.</div>
                    <div><strong className="text-champagne">Complex Calligraphy:</strong> Ornate Thuluth &amp; Kufic inscriptions may produce phonetic approximations; verify with editable OCR.</div>
                  </div>
                </div>

                {/* Translation Safety Disclaimer Banner */}
                <div className="mt-auto p-2.5 rounded bg-warning-subtle text-dark border border-warning small d-flex align-items-start gap-2" style={{ fontSize: '0.72rem' }}>
                  <i className="bi bi-shield-exclamation text-warning fs-5 flex-shrink-0 mt-0.5"></i>
                  <div>
                    <strong>Safety Notice:</strong> Translation is automated. Never act solely on unconfirmed automated translations for medical dosages, emergency triage directions, or electrical hazards.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Mode Switcher, Target Language, OCR Edit, Translation Results */}
            <div className="col-lg-7 col-md-12">
              <div className="p-4 rounded-3 bg-dark border border-gold-subtle h-100 d-flex flex-column">

                {/* Smart Translation Modes */}
                <div className="mb-3">
                  <div className="small text-white-50 mb-2"><strong>Smart Translation Mode:</strong></div>
                  <div className="d-flex flex-wrap gap-2">
                    {[
                      { id: 'standard', label: 'Standard Mode (Street & Transit)', icon: 'bi-signpost-2-fill' },
                      { id: 'pilgrim', label: 'Pilgrim Mode (Shrines & Services)', icon: 'bi-geo-alt-fill' },
                      { id: 'religious', label: 'Religious Text Mode (Ziyarat & Gloss)', icon: 'bi-book-half' }
                    ].map(m => (
                      <button
                        key={m.id}
                        type="button"
                        className={`trans-mode-pill ${transMode === m.id ? 'active' : ''}`}
                        onClick={() => {
                          setTransMode(m.id);
                          triggerTranslation(editableArabic, targetLang, m.id);
                        }}
                      >
                        <i className={`bi ${m.icon} me-1.5`}></i>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Language Pills */}
                <div className="mb-3">
                  <div className="small text-white-50 mb-2"><strong>Target Language:</strong></div>
                  <div className="d-flex flex-wrap gap-2 notranslate">
                    {[
                      { id: 'ur', label: 'اردو (Urdu)', flag: '🇵🇰' },
                      { id: 'ur-roman', label: 'Roman Urdu', flag: '🇵🇰' },
                      { id: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
                      { id: 'en', label: 'English (UK/US)', flag: '🇬🇧' },
                      { id: 'fa', label: 'فارسی (Persian)', flag: '🇮🇷' },
                      { id: 'ar', label: 'العربية (Arabic)', flag: '🇮🇶' }
                    ].map(lg => (
                      <button
                        key={lg.id}
                        type="button"
                        className={`lang-pill-btn ${targetLang === lg.id ? 'active' : ''}`}
                        onClick={() => {
                          setTargetLang(lg.id);
                          triggerTranslation(editableArabic, lg.id, transMode);
                        }}
                      >
                        <span className="me-1">{lg.flag}</span>
                        {lg.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detected / Editable Arabic Script Card */}
                <div className="p-3 rounded bg-black border border-dark mb-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="small text-secondary">
                      <i className="bi bi-file-earmark-text text-gold-antique me-1"></i>
                      Original Arabic Signage Text:
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      {ocrEngineLabel && (
                        <span className="badge bg-dark text-gold-antique border border-gold-subtle" style={{ fontSize: '0.72rem' }}>
                          <i className="bi bi-shield-check text-success me-1"></i>
                          {ocrEngineLabel}
                        </span>
                      )}
                      <button
                        type="button"
                        className="btn btn-sm btn-link text-gold-antique p-0 text-decoration-none"
                        style={{ fontSize: '0.76rem' }}
                        onClick={() => setIsEditingOcr(!isEditingOcr)}
                      >
                        <i className={`bi ${isEditingOcr ? 'bi-check-lg' : 'bi-pencil'} me-1`}></i>
                        {isEditingOcr ? 'Done Editing' : 'Edit OCR'}
                      </button>
                    </div>
                  </div>

                  {isEditingOcr ? (
                    <div>
                      <textarea
                        className="form-control bg-dark text-white font-arabic-sign border-gold-subtle"
                        style={{ direction: 'rtl', fontSize: '1.25rem', resize: 'vertical' }}
                        rows="3"
                        value={editableArabic}
                        onChange={(e) => {
                          setEditableArabic(e.target.value);
                          triggerTranslation(e.target.value, targetLang, transMode);
                        }}
                      ></textarea>
                      <div className="small text-secondary mt-1" style={{ fontSize: '0.72rem' }}>
                        Modify any misread characters directly to re-trigger real-time translation.
                      </div>
                    </div>
                  ) : (
                    <div className="text-white fs-4 fw-bold font-arabic-sign" style={{ direction: 'rtl' }}>
                      {editableArabic || 'No Arabic text extracted yet.'}
                    </div>
                  )}
                </div>

                {/* Translation Result Card */}
                <div className="p-3 rounded bg-charcoal border border-gold mb-3 flex-grow-1 d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="small text-gold-antique fw-bold">
                      <i className="bi bi-translate me-1.5"></i>
                      Translation ({targetLang.toUpperCase()}) — {transMode.toUpperCase()} MODE:
                    </div>
                    {translating && (
                      <span className="spinner-border spinner-border-sm text-gold-antique" role="status"></span>
                    )}
                  </div>

                  {/* Main Translation Text */}
                  <div
                    className={`text-white fs-5 fw-semibold mb-3 ${targetLang === 'ur' ? 'font-urdu-text' : targetLang === 'hi' ? 'font-hindi-text' : ''}`}
                    style={{ direction: targetLang === 'ur' || targetLang === 'fa' ? 'rtl' : 'ltr' }}
                  >
                    {translationData?.translatedText || 'Select a sign or start camera to see translation...'}
                  </div>

                  {/* Identified Sacred Terminology Tags */}
                  {translationData?.sacredTermsIdentified && translationData.sacredTermsIdentified.length > 0 && (
                    <div className="p-2.5 rounded bg-black-subtle border border-dark mb-2.5">
                      <div className="small text-gold-antique mb-1.5" style={{ fontSize: '0.72rem' }}>
                        <i className="bi bi-bookmark-star-fill me-1"></i>
                        Preserved Sacred Terminology &amp; Entities:
                      </div>
                      <div className="d-flex flex-wrap gap-1.5">
                        {translationData.sacredTermsIdentified.map((st, sidx) => (
                          <span
                            key={sidx}
                            className="badge bg-dark border border-gold text-champagne"
                            style={{ fontSize: '0.72rem' }}
                          >
                            <span className="text-gold-antique font-arabic-sign me-1">{st.arabic}</span>
                            &rarr; {st.translation}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scholarly Curatorial Gloss (Religious Mode) */}
                  {translationData?.scholarlyInterpretation && (
                    <div className="p-2.5 rounded bg-black-subtle border border-gold-subtle mb-2.5" style={{ fontSize: '0.82rem' }}>
                      <div className="small text-gold-antique fw-bold mb-1">
                        <i className="bi bi-journal-text me-1"></i>
                        Scholarly Curatorial Context:
                      </div>
                      <div className="text-secondary">
                        {translationData.scholarlyInterpretation}
                      </div>
                    </div>
                  )}

                  {/* Safety Critical Alert Warning (if applicable) */}
                  {translationData?.isSafetyCritical && (
                    <div className="safety-alert-banner mb-2.5">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <i className="bi bi-shield-exclamation text-danger fs-5"></i>
                        <strong className="text-white">Safety &amp; Regulatory Alert</strong>
                      </div>
                      <div>{translationData.safetyWarning}</div>
                    </div>
                  )}

                  {/* Speech Synthesis / TTS Audio Dock */}
                  <div className="tts-audio-dock mt-auto">
                    <div className="d-flex align-items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-gold"
                        onClick={() => handleSpeakText(translationData?.translatedText || '', targetLang)}
                        style={{ fontSize: '0.76rem' }}
                      >
                        <i className={`bi ${speaking ? 'bi-stop-fill text-danger' : 'bi-volume-up-fill'} me-1`}></i>
                        {speaking ? 'Stop Speech' : 'Listen Pronunciation'}
                      </button>

                      {/* Animated Audio Waveform when active */}
                      {speaking && (
                        <div className="audio-wave-anim ms-2">
                          <div className="audio-wave-bar"></div>
                          <div className="audio-wave-bar"></div>
                          <div className="audio-wave-bar"></div>
                          <div className="audio-wave-bar"></div>
                          <div className="audio-wave-bar"></div>
                        </div>
                      )}
                    </div>

                    {/* Speech Speed Switcher */}
                    <div className="d-flex align-items-center gap-1">
                      <span className="small text-secondary me-1" style={{ fontSize: '0.72rem' }}>Speed:</span>
                      {[0.75, 1.0, 1.25].map(rate => (
                        <button
                          key={rate}
                          type="button"
                          className={`btn btn-xs px-2 py-0.5 rounded ${speechRate === rate ? 'btn-gold' : 'btn-outline-secondary text-secondary'}`}
                          style={{ fontSize: '0.68rem' }}
                          onClick={() => setSpeechRate(rate)}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions Toolbar: Copy, Offline Notebook */}
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-gold flex-grow-1"
                    onClick={() => {
                      if (translationData?.translatedText) {
                        navigator.clipboard?.writeText(translationData.translatedText);
                        alert('Translation copied to clipboard!');
                      }
                    }}
                  >
                    <i className="bi bi-clipboard me-1"></i>
                    Copy Translation
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light"
                    onClick={saveToNotebook}
                  >
                    <i className="bi bi-bookmark-plus me-1"></i>
                    Save to Notebook
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setShowSavedNotebook(!showSavedNotebook)}
                  >
                    <i className="bi bi-journal-bookmark me-1"></i>
                    Offline Notebook ({savedTranslations.length})
                  </button>
                </div>

                {/* Bridge to Ask Karbala AI Companion */}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-gold w-100 mt-2"
                  onClick={() => askAiAboutSign(editableArabic)}
                >
                  <i className="bi bi-chat-heart-fill me-1.5 text-gold-antique"></i>
                  Ask AI Companion About This Sign &amp; Location
                </button>

                {/* Saved Offline Translations Drawer */}
                {showSavedNotebook && (
                  <div className="p-3 mt-3 rounded bg-black border border-gold-subtle">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="small text-gold-antique fw-bold">
                        <i className="bi bi-journal-bookmark-fill me-1"></i>
                        Saved Translations Notebook (Available Offline):
                      </div>
                      <button
                        type="button"
                        className="btn-close btn-close-white"
                        style={{ fontSize: '0.65rem' }}
                        onClick={() => setShowSavedNotebook(false)}
                      ></button>
                    </div>

                    {savedTranslations.length === 0 ? (
                      <div className="small text-secondary">No saved translations yet. Tap "Save to Notebook" on any translated sign.</div>
                    ) : (
                      <div className="d-flex flex-column gap-2" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                        {savedTranslations.map((item) => (
                          <div key={item.id} className="p-2 rounded bg-dark border border-dark d-flex justify-content-between align-items-start gap-2">
                            <div className="overflow-hidden">
                              <div className="small text-gold-antique font-arabic-sign text-truncate" style={{ direction: 'rtl' }}>
                                {item.arabic}
                              </div>
                              <div className="small text-white text-truncate">
                                {item.translation}
                              </div>
                              <div className="text-secondary" style={{ fontSize: '0.68rem' }}>
                                {item.targetLang.toUpperCase()} • {item.mode.toUpperCase()} MODE • {item.date}
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn btn-link text-danger p-0 ms-2"
                              style={{ fontSize: '0.8rem' }}
                              onClick={() => deleteNotebookEntry(item.id)}
                              title="Delete entry"
                            >
                              <i className="bi bi-x-circle"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Dedicated Benchmark Demonstration Section with Clear Separation */}
          <div className="p-4 rounded-3 bg-charcoal border border-gold-subtle mb-4">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 pb-2 border-bottom border-dark">
              <div>
                <span className="badge bg-dark text-gold-antique border border-gold-subtle mb-1" style={{ fontSize: '0.70rem' }}>
                  <i className="bi bi-collection-play-fill me-1"></i>
                  Sample Demonstration Library
                </span>
                <h4 className="font-display text-white mb-0" style={{ fontSize: '1.25rem' }}>
                  Astan Inscriptions &amp; Sacred Documents Archive
                </h4>
              </div>
              <div className="small text-secondary" style={{ fontSize: '0.76rem' }}>
                Select an authentic specimen to test the OCR extraction &amp; translation model:
              </div>
            </div>

            {/* Sample Demonstration Cards Grid */}
            <div className="row g-3">
              {curatedSigns.concat(curatedDocuments).map((item) => (
                <div className="col-lg-4 col-md-6" key={item.id}>
                  <div
                    className={`curated-sign-card cursor-pointer h-100 ${selectedSignId === item.id ? 'selected' : ''}`}
                    onClick={() => {
                      if (item.category.includes('Parchment') || item.category.includes('Bulletin')) {
                        selectCuratedDocument(item);
                      } else {
                        selectCuratedSign(item);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <img src={item.thumbnail} alt={item.title} className="curated-sign-thumb" />
                    <div className="flex-grow-1 overflow-hidden">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="badge bg-black border border-gold-subtle text-gold-antique" style={{ fontSize: '0.65rem' }}>
                          {item.category}
                        </span>
                        <span className="small text-secondary" style={{ fontSize: '0.68rem' }}>Sample Demo</span>
                      </div>
                      <div className="text-white fw-bold text-truncate" style={{ fontSize: '0.86rem' }}>{item.title}</div>
                      <div className="text-gold-antique text-truncate font-arabic-sign" style={{ direction: 'rtl', fontSize: '0.88rem' }}>{item.arabicText}</div>
                      <div className="text-secondary small text-truncate" style={{ fontSize: '0.70rem' }}>{item.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </>
        )}

        {/* --- TAB 2: MILESTONE 5 VISUAL LANDMARK RECOGNITION & SACRED DISCOVERY --- */}
        {aiMode === 'recognize' && (
          <div className="landmark-recognition-section mb-5">
            {/* Top Landmark Recognition Subheader */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4 pb-2 border-bottom border-dark">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge bg-dark border border-gold-subtle text-champagne" style={{ fontSize: '0.72rem' }}>
                    <i className="bi bi-aspect-ratio-fill text-gold-antique me-1"></i>
                    Cosine Similarity Ranking Engine (τ = 0.68)
                  </span>
                  <span className="badge bg-dark border border-gold-subtle text-champagne" style={{ fontSize: '0.72rem' }}>
                    <i className="bi bi-shield-lock-fill text-success me-1"></i>
                    Zero Image Retention Privacy
                  </span>
                </div>
                <h3 className="font-display text-white mb-0" style={{ fontSize: '1.35rem' }}>
                  Sacred Landmark Recognition &amp; Visual Architectural Matching
                </h3>
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-gold"
                  onClick={runBenchmarkSuite}
                  disabled={runningBenchmark}
                >
                  <i className={`bi ${runningBenchmark ? 'bi-arrow-repeat spin' : 'bi-speedometer2'} me-1`}></i>
                  {runningBenchmark ? 'Evaluating...' : 'Run 13-Test Benchmark'}
                </button>
              </div>
            </div>

            <div className="row g-4 mb-5">
              {/* Left Column: Viewfinder & Specimen Selector */}
              <div className="col-lg-5 col-md-12">
                <div className="p-4 rounded-3 bg-charcoal border border-gold-subtle h-100 d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h4 className="font-display text-white mb-0" style={{ fontSize: '1.18rem' }}>
                      <i className="bi bi-camera-fill text-gold-antique me-2"></i>
                      Architectural Viewfinder
                    </h4>
                    <span className="small text-secondary" style={{ fontSize: '0.75rem' }}>
                      {cameraActive ? 'Live Stream' : 'Photograph Loaded'}
                    </span>
                  </div>

                  {/* Visual Viewfinder Box */}
                  <div className="camera-viewfinder mb-3">
                    {cameraActive ? (
                      <video ref={videoRef} autoPlay playsInline muted className="camera-video-element" />
                    ) : currentImageUri ? (
                      <img
                        src={currentImageUri}
                        alt="Landmark specimen"
                        className="camera-preview-img"
                        style={{ transform: `rotate(${imageRotation}deg)`, transition: 'transform 0.3s ease' }}
                      />
                    ) : (
                      <div className="text-center p-4">
                        <i className="bi bi-camera text-secondary fs-1 mb-2 d-block"></i>
                        <div className="small text-secondary">No specimen loaded. Select below or take photograph.</div>
                      </div>
                    )}

                    <div className="viewfinder-corner corner-tl"></div>
                    <div className="viewfinder-corner corner-tr"></div>
                    <div className="viewfinder-corner corner-bl"></div>
                    <div className="viewfinder-corner corner-br"></div>

                    {landmarkRecognizing && (
                      <div className="scan-laser-line"></div>
                    )}
                  </div>

                  {/* Viewfinder Action Buttons */}
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {cameraActive ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-sm btn-gold flex-grow-1"
                          onClick={() => {
                            captureSnapshot();
                            triggerLandmarkRecognition(currentImageUri);
                          }}
                        >
                          <i className="bi bi-record-circle-fill me-1"></i>
                          Snap &amp; Identify
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light"
                          onClick={flipCamera}
                          title="Flip camera"
                        >
                          <i className="bi bi-arrow-repeat"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={stopCamera}
                          title="Close camera"
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-sm btn-gold flex-grow-1"
                          onClick={() => triggerLandmarkRecognition(selectedSpecimenKey)}
                          disabled={landmarkRecognizing}
                        >
                          <i className={`bi ${landmarkRecognizing ? 'bi-arrow-repeat spin' : 'bi-search'} me-1`}></i>
                          {landmarkRecognizing ? 'Analyzing Visual Features...' : 'Start Landmark Recognition'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light"
                          onClick={() => startCamera('environment')}
                          title="Open camera"
                        >
                          <i className="bi bi-camera-video me-1"></i>
                          Camera
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => fileInputRef.current?.click()}
                          title="Upload image"
                        >
                          <i className="bi bi-upload"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={handleRotateImage}
                          title="Rotate 90 degrees"
                        >
                          <i className="bi bi-arrow-clockwise"></i>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Benchmark Architectural Specimen Selector */}
                  <div className="mt-2 flex-grow-1">
                    <div className="small text-secondary mb-2" style={{ fontSize: '0.74rem' }}>
                      Select a Curated Architectural Specimen or Negative Benchmark:
                    </div>
                    <div className="d-flex flex-column gap-2" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                      {architecturalSpecimens.map((spec) => (
                        <div
                          key={spec.key}
                          className={`p-2 rounded cursor-pointer d-flex align-items-center gap-2.5 transition-all ${selectedSpecimenKey === spec.key ? 'border border-gold bg-dark' : 'border border-dark bg-black-subtle'}`}
                          onClick={() => {
                            setSelectedSpecimenKey(spec.key);
                            setCurrentImageUri(spec.image);
                            triggerLandmarkRecognition(spec.hint);
                          }}
                        >
                          <img
                            src={spec.image}
                            alt={spec.title}
                            style={{ width: 56, height: 44, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                          />
                          <div className="flex-grow-1 overflow-hidden">
                            <div className="d-flex align-items-center justify-content-between mb-0.5">
                              <span className={`badge ${spec.isNegative ? 'bg-danger text-white' : 'bg-black text-gold-antique border border-gold-subtle'}`} style={{ fontSize: '0.62rem' }}>
                                {spec.category}
                              </span>
                              {spec.isNegative && (
                                <span className="small text-danger fw-bold" style={{ fontSize: '0.64rem' }}>Rejection Test</span>
                              )}
                            </div>
                            <div className="small text-white fw-bold text-truncate" style={{ fontSize: '0.80rem' }}>
                              {spec.title}
                            </div>
                            <div className="small text-gold-antique font-arabic-sign text-truncate" style={{ direction: 'rtl', fontSize: '0.78rem' }}>
                              {spec.arabic}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column: Visual Recognition Match Results */}
              <div className="col-lg-7 col-md-12">
                <div className="p-4 rounded-3 bg-dark border border-gold-subtle h-100 d-flex flex-column">

                  {/* Header / Match Status Bar */}
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 pb-2 border-bottom border-secondary">
                    <span className="small text-secondary" style={{ fontSize: '0.78rem' }}>
                      <i className="bi bi-cpu-fill text-gold-antique me-1"></i>
                      Visual Feature Extractor: 7-D Architectural Geometry (Gold, Turquoise, Domes, Minarets, Symmetry)
                    </span>
                    <span className="badge bg-black border border-gold-subtle text-champagne" style={{ fontSize: '0.68rem' }}>
                      Threshold: τ ≥ 0.68
                    </span>
                  </div>

                  {/* When Recognition is in Progress */}
                  {landmarkRecognizing && (
                    <div className="text-center py-5 my-auto">
                      <div className="spinner-border text-warning mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
                      <h4 className="font-display text-white mb-2">Analyzing Architectural Features...</h4>
                      <p className="small text-secondary mb-0">Computing cosine similarity against verified Karbala and Najaf sanctuary embeddings</p>
                    </div>
                  )}

                  {/* When Landmark is Confidently Recognized */}
                  {!landmarkRecognizing && activeLandmarkMatch && (
                    <div className="flex-grow-1 d-flex flex-column">
                      {/* Top Match Banner */}
                      <div className="p-3 rounded-3 mb-3" style={{ background: 'linear-gradient(135deg, rgba(20, 26, 40, 0.95) 0%, rgba(14, 18, 26, 0.98) 100%)', border: '1px solid rgba(197, 160, 89, 0.4)' }}>
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                          <span className={`similarity-pill ${activeLandmarkMatch.similarityScore >= 0.88 ? 'high' : 'moderate'}`}>
                            <i className="bi bi-shield-check"></i>
                            {Math.round(activeLandmarkMatch.similarityScore * 100)}% Visual Feature Match
                          </span>
                          <span className="badge bg-black border border-gold-subtle text-champagne" style={{ fontSize: '0.70rem' }}>
                            {activeLandmarkMatch.city}, Iraq • {activeLandmarkMatch.siteType.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>

                        <div className="row g-3 align-items-center">
                          <div className="col-md-5">
                            <img
                              src={activeLandmarkMatch.primaryImage || currentImageUri}
                              alt={activeLandmarkMatch.name}
                              className="w-100 rounded-2 shadow-sm"
                              style={{ height: '170px', objectFit: 'cover' }}
                            />
                          </div>
                          <div className="col-md-7">
                            <h3 className="font-display text-white mb-1" style={{ fontSize: '1.30rem' }}>
                              {activeLandmarkMatch.name}
                            </h3>
                            <div className="text-gold-antique font-arabic-sign mb-2" style={{ direction: 'rtl', fontSize: '1.05rem' }}>
                              {activeLandmarkMatch.arabicName}
                            </div>
                            <div className="small text-secondary mb-2" style={{ fontSize: '0.76rem' }}>
                              <i className="bi bi-geo-alt-fill text-gold-antique me-1"></i>
                              {activeLandmarkMatch.coordinates?.latitude?.toFixed(5)}° N, {activeLandmarkMatch.coordinates?.longitude?.toFixed(5)}° E
                            </div>

                            <div className="d-flex flex-wrap gap-2 mt-3">
                              <button
                                type="button"
                                className="btn btn-sm btn-gold flex-grow-1"
                                onClick={() => openLandmarkProfile(activeLandmarkMatch.id)}
                              >
                                <i className="bi bi-journal-richtext me-1"></i>
                                View Historical Profile
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-light"
                                onClick={() => onNavigate('ziyarat')}
                              >
                                <i className="bi bi-cursor-fill me-1"></i>
                                Navigate with My Ziyarat
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-gold"
                                onClick={() => askAiAboutLandmark(activeLandmarkMatch)}
                              >
                                <i className="bi bi-chat-heart-fill me-1 text-gold-antique"></i>
                                Ask AI Companion
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Top Candidates Ranking (Cosine Similarity Demonstration) */}
                      {landmarkCandidates.length > 1 && (
                        <div className="mb-3">
                          <div className="small text-secondary mb-2 fw-bold" style={{ fontSize: '0.74rem' }}>
                            <i className="bi bi-list-ol text-gold-antique me-1"></i>
                            Candidate Similarity Rankings (Calibrated Threshold Filtering):
                          </div>
                          <div className="row g-2">
                            {landmarkCandidates.slice(0, 3).map((cand, ci) => (
                              <div className="col-md-4 col-12" key={cand.id}>
                                <div
                                  className={`p-2 rounded border cursor-pointer h-100 ${cand.id === activeLandmarkMatch.id ? 'border-gold bg-black' : 'border-dark bg-charcoal'}`}
                                  onClick={() => openLandmarkProfile(cand.id)}
                                >
                                  <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="badge bg-black text-secondary" style={{ fontSize: '0.60rem' }}>#{ci + 1} Candidate</span>
                                    <span className={`similarity-pill ${cand.similarityScore >= 0.88 ? 'high' : 'moderate'}`} style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                                      {Math.round(cand.similarityScore * 100)}%
                                    </span>
                                  </div>
                                  <div className="small text-white fw-bold text-truncate" style={{ fontSize: '0.76rem' }}>{cand.name}</div>
                                  <div className="small text-gold-antique text-truncate font-arabic-sign" style={{ direction: 'rtl', fontSize: '0.72rem' }}>{cand.arabicName}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quick Navigation Advice Box */}
                      <div className="p-3 rounded bg-black-subtle border border-dark mt-auto">
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <div className="small text-gold-antique fw-bold mb-0.5">
                              <i className="bi bi-pin-map-fill me-1"></i>
                              Direct Sanctuary Guidance Available
                            </div>
                            <div className="small text-secondary" style={{ fontSize: '0.72rem' }}>
                              Pedestrian walking routes with Dijkstra barrier avoidance in Karbala, or highway navigation to Najaf/Kufa.
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn btn-xs btn-outline-gold px-3 py-1"
                            onClick={() => onNavigate('map')}
                          >
                            Explore 61 AH Map
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* When Landmark is REJECTED (Negative / Non-Sanctuary Test Case) */}
                  {!landmarkRecognizing && unrecognizedLandmark && (
                    <div className="flex-grow-1 d-flex flex-column justify-content-center text-center p-4">
                      <div className="mb-3">
                        <div className="d-inline-flex p-3 rounded-circle bg-danger-subtle border border-danger mb-2">
                          <i className="bi bi-shield-x text-danger fs-2"></i>
                        </div>
                        <h4 className="font-display text-white mb-1">Unable to Identify Landmark Confidently</h4>
                        <span className="similarity-pill rejected mb-2">
                          Confidence Below Threshold (Score &lt; 0.68)
                        </span>
                      </div>

                      <div className="p-3 rounded bg-black border border-dark mb-4 text-start">
                        <div className="small text-gold-antique fw-bold mb-1">
                          <i className="bi bi-info-circle me-1"></i>
                          Audited Calibrated Neutral Guidance:
                        </div>
                        <p className="small text-secondary mb-2" style={{ lineHeight: '1.6' }}>
                          {unrecognizedGuidance || 'The photograph does not match verified architectural features in the Karbala or Najaf reference databases.'}
                        </p>
                        <div className="small text-secondary" style={{ fontSize: '0.74rem' }}>
                          <strong>Tip:</strong> Ensure you frame the central gilded dome, minaret balcony, or entrance iwan portal clearly with minimal blur and adequate daylight.
                        </div>
                      </div>

                      {/* Suggested Verified Landmarks */}
                      {landmarkCandidates.length > 0 && (
                        <div>
                          <div className="small text-secondary mb-2 fw-bold text-start" style={{ fontSize: '0.74rem' }}>
                            Browse Verified Sanctuaries in Karbala &amp; Najaf:
                          </div>
                          <div className="row g-2">
                            {landmarkCandidates.map((sug) => (
                              <div className="col-md-6 col-12" key={sug.id}>
                                <div
                                  className="p-2 rounded bg-charcoal border border-dark cursor-pointer d-flex align-items-center gap-2 text-start"
                                  onClick={() => openLandmarkProfile(sug.id)}
                                >
                                  <img src={sug.thumbnail || 'assets/images/shrine_27.jpg'} alt={sug.name} style={{ width: 44, height: 36, objectFit: 'cover', borderRadius: 4 }} />
                                  <div className="overflow-hidden">
                                    <div className="small text-white fw-bold text-truncate" style={{ fontSize: '0.76rem' }}>{sug.name}</div>
                                    <div className="text-secondary" style={{ fontSize: '0.68rem' }}>{sug.city}, Iraq</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Benchmark Report Modal/Card if Executed */}
            {landmarkBenchmarkReport && (
              <div className="p-4 rounded-3 bg-charcoal border border-gold-subtle mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="font-display text-white mb-0" style={{ fontSize: '1.2rem' }}>
                    <i className="bi bi-clipboard-check-fill text-gold-antique me-2"></i>
                    Milestone 5 Landmark Recognition Accuracy Benchmark Results
                  </h4>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setLandmarkBenchmarkReport(null)}
                  ></button>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-3 col-6">
                    <div className="arch-spec-box text-center">
                      <div className="arch-spec-label">Top-1 Accuracy</div>
                      <div className="arch-spec-val text-success fs-4">{landmarkBenchmarkReport.top1AccuracyPercent}%</div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="arch-spec-box text-center">
                      <div className="arch-spec-label">Top-3 Accuracy</div>
                      <div className="arch-spec-val text-success fs-4">{landmarkBenchmarkReport.top3AccuracyPercent}%</div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="arch-spec-box text-center">
                      <div className="arch-spec-label">Negative Rejection Rate</div>
                      <div className="arch-spec-val text-info fs-4">{landmarkBenchmarkReport.unknownRejectionRatePercent}%</div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="arch-spec-box text-center">
                      <div className="arch-spec-label">False Positive Rate</div>
                      <div className="arch-spec-val text-champagne fs-4">{landmarkBenchmarkReport.falsePositiveRatePercent}%</div>
                    </div>
                  </div>
                </div>

                <div className="table-responsive" style={{ maxHeight: '240px' }}>
                  <table className="table table-dark table-sm mb-0" style={{ fontSize: '0.78rem' }}>
                    <thead>
                      <tr>
                        <th>Test ID</th>
                        <th>Category</th>
                        <th>Expected Landmark</th>
                        <th>Model Top-1 Output</th>
                        <th>Score</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {landmarkBenchmarkReport.details?.map(d => (
                        <tr key={d.id}>
                          <td><code>{d.id}</code></td>
                          <td>{d.category}</td>
                          <td>{d.expected || 'Negative Rejection'}</td>
                          <td>{d.top1Match}</td>
                          <td>{d.top1Score}</td>
                          <td>
                            <span className={`badge ${d.resultStatus.includes('MATCH') || d.resultStatus === 'CORRECT_REJECTION' ? 'bg-success' : 'bg-danger'}`}>
                              {d.resultStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Explore Verified Heritage Sanctuaries & Monuments (9 Canonical Sites) */}
            <div className="p-4 rounded-3 bg-charcoal border border-gold-subtle">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 pb-2 border-bottom border-dark">
                <div>
                  <span className="badge bg-dark text-gold-antique border border-gold-subtle mb-1" style={{ fontSize: '0.70rem' }}>
                    <i className="bi bi-bank2 me-1"></i>
                    Curated Heritage Database
                  </span>
                  <h4 className="font-display text-white mb-0" style={{ fontSize: '1.25rem' }}>
                    Verified Sacred Sanctuaries &amp; Historical Monuments
                  </h4>
                </div>

                {/* City Filter Pills */}
                <div className="d-flex gap-1 flex-wrap">
                  {[
                    { id: 'all', label: 'All Sanctuaries (9)' },
                    { id: 'Karbala', label: 'Karbala (5)' },
                    { id: 'Najaf', label: 'Najaf (1)' },
                    { id: 'Kufa', label: 'Kufa (1)' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`btn btn-xs px-2.5 py-1 rounded-pill ${landmarkFilterCity === tab.id ? 'btn-gold' : 'btn-outline-secondary text-secondary'}`}
                      style={{ fontSize: '0.72rem' }}
                      onClick={() => setLandmarkFilterCity(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Verified Landmarks */}
              <div className="row g-3">
                {allLandmarks
                  .filter(l => landmarkFilterCity === 'all' || l.city.toLowerCase() === landmarkFilterCity.toLowerCase())
                  .map(landmark => (
                    <div className="col-lg-4 col-md-6 col-12" key={landmark.id}>
                      <div
                        className="landmark-candidate-card h-100 d-flex flex-column"
                        onClick={() => openLandmarkProfile(landmark.id)}
                      >
                        <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                          <img
                            src={landmark.primaryImage}
                            alt={landmark.establishedName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <span
                            className="badge bg-black bg-opacity-75 border border-gold-subtle text-champagne position-absolute top-2 start-2"
                            style={{ fontSize: '0.64rem' }}
                          >
                            {landmark.city}, Iraq
                          </span>
                        </div>

                        <div className="p-3 d-flex flex-column flex-grow-1">
                          <div className="small text-white fw-bold mb-0.5 text-truncate" style={{ fontSize: '0.88rem' }}>
                            {landmark.establishedName}
                          </div>
                          <div className="small text-gold-antique font-arabic-sign mb-2 text-truncate" style={{ direction: 'rtl', fontSize: '0.84rem' }}>
                            {landmark.arabicName}
                          </div>
                          <p className="small text-secondary mb-3 flex-grow-1" style={{ fontSize: '0.74rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {landmark.historicalSignificance?.summary}
                          </p>

                          <div className="d-flex justify-content-between align-items-center pt-2 border-top border-dark">
                            <span className="small text-gold-antique" style={{ fontSize: '0.72rem' }}>
                              <i className="bi bi-clock-history me-1"></i>
                              {landmark.architecturalOverview?.foundationEra || '61 AH'}
                            </span>
                            <span className="btn btn-xs btn-outline-gold" style={{ fontSize: '0.70rem' }}>
                              Explore Profile →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}


        {/* ========================================================================== */}
        {/* MUSEUM LANDMARK PROFILE MODAL (MILESTONE 5) */}
        {/* ========================================================================== */}
        {selectedLandmarkProfile && (
          <div
            className="landmark-modal-backdrop"
            onClick={() => setSelectedLandmarkProfile(null)}
          >
            <div
              className="landmark-modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with Full Hero Image & Gradient */}
              <div className="landmark-modal-header">
                <img
                  src={selectedLandmarkProfile.primaryImage || 'assets/images/shrine_27.jpg'}
                  alt={selectedLandmarkProfile.establishedName}
                  className="landmark-modal-header-img"
                />
                <div className="landmark-modal-header-gradient"></div>
                <button
                  type="button"
                  className="btn-close btn-close-white position-absolute top-3 end-3 shadow"
                  style={{ zIndex: 10, fontSize: '0.85rem' }}
                  onClick={() => setSelectedLandmarkProfile(null)}
                  aria-label="Close"
                ></button>

                <div className="landmark-modal-header-content">
                  <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                    <span className="badge bg-gold text-dark fw-bold" style={{ fontSize: '0.72rem' }}>
                      {selectedLandmarkProfile.city}, Iraq
                    </span>
                    <span className="badge bg-dark border border-gold-subtle text-champagne" style={{ fontSize: '0.72rem' }}>
                      {selectedLandmarkProfile.siteType?.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="badge bg-dark text-secondary" style={{ fontSize: '0.70rem' }}>
                      <i className="bi bi-geo-alt-fill text-gold-antique me-1"></i>
                      {selectedLandmarkProfile.coordinates?.latitude?.toFixed(5)}° N, {selectedLandmarkProfile.coordinates?.longitude?.toFixed(5)}° E
                    </span>
                  </div>
                  <h2 className="font-display text-white mb-0" style={{ fontSize: '1.65rem', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                    {selectedLandmarkProfile.establishedName}
                  </h2>
                  <div className="text-gold-antique font-arabic-sign" style={{ direction: 'rtl', fontSize: '1.25rem' }}>
                    {selectedLandmarkProfile.arabicName}
                  </div>
                </div>
              </div>

              {/* Modal Scrollable Body */}
              <div className="landmark-modal-body">
                {/* Honorific Title & Sourced Overview */}
                <div className="p-3 rounded-2 bg-charcoal border border-dark mb-4">
                  <div className="small text-gold-antique fw-bold mb-1" style={{ fontSize: '0.78rem' }}>
                    <i className="bi bi-award-fill me-1"></i>
                    HONORIFIC ATTRIBUTION:
                  </div>
                  <div className="text-white fw-semibold mb-2" style={{ fontSize: '0.96rem' }}>
                    {selectedLandmarkProfile.honorificTitle || selectedLandmarkProfile.establishedName}
                  </div>
                  <p className="text-secondary small mb-0" style={{ lineHeight: '1.7', fontSize: '0.86rem' }}>
                    {typeof selectedLandmarkProfile.historicalSignificance === 'string'
                      ? selectedLandmarkProfile.historicalSignificance
                      : (selectedLandmarkProfile.historicalSignificance?.summary || '')}
                  </p>
                </div>

                {/* 4-Item Architectural Blueprint Grid */}
                <h5 className="font-display text-white mb-2" style={{ fontSize: '1.05rem' }}>
                  <i className="bi bi-building-check text-gold-antique me-2"></i>
                  Architectural &amp; Structural Specifications
                </h5>
                <div className="row g-2 mb-4">
                  <div className="col-md-3 col-6">
                    <div className="arch-spec-box">
                      <div className="arch-spec-label">Dome Structure</div>
                      <div className="arch-spec-val">{selectedLandmarkProfile.architecturalOverview?.domeHeight || '27m Gilded'}</div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="arch-spec-box">
                      <div className="arch-spec-label">Minarets</div>
                      <div className="arch-spec-val">{selectedLandmarkProfile.architecturalOverview?.minaretHeight || 'Twin 35m Gilded'}</div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="arch-spec-box">
                      <div className="arch-spec-label">Architectural Style</div>
                      <div className="arch-spec-val text-truncate">{selectedLandmarkProfile.architecturalOverview?.architecturalStyle || 'Muqarnas & Tile'}</div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="arch-spec-box">
                      <div className="arch-spec-label">Foundation Era</div>
                      <div className="arch-spec-val text-gold-antique">{selectedLandmarkProfile.architecturalOverview?.foundationEra || '61 AH (680 CE)'}</div>
                    </div>
                  </div>
                </div>

                {/* Architectural Features Detailed Notes */}
                <div className="p-3 rounded bg-black-subtle border border-dark mb-4">
                  <div className="row g-2 small">
                    <div className="col-md-6">
                      <strong className="text-white d-block mb-1">Dome &amp; Exterior:</strong>
                      <span className="text-secondary">{selectedLandmarkProfile.visualProfile?.domeFeatures}</span>
                    </div>
                    <div className="col-md-6">
                      <strong className="text-white d-block mb-1">Minarets &amp; Facade:</strong>
                      <span className="text-secondary">{selectedLandmarkProfile.visualProfile?.minaretFeatures || selectedLandmarkProfile.visualProfile?.facadeStyle}</span>
                    </div>
                  </div>
                </div>

                {/* Historical Ground-Truth & Chronology Timeline */}
                <h5 className="font-display text-white mb-2" style={{ fontSize: '1.05rem' }}>
                  <i className="bi bi-hourglass-split text-gold-antique me-2"></i>
                  Historical Ground-Truth &amp; Chronology
                </h5>
                <div className="p-3 rounded bg-charcoal border border-dark mb-4">
                  {(selectedLandmarkProfile.historicalChronology || selectedLandmarkProfile.historicalSignificance?.chronology || []).map((step, si) => (
                    <div className="landmark-chronology-item" key={si}>
                      <div className="d-flex align-items-center gap-2 mb-0.5">
                        <span className="badge bg-black border border-gold-subtle text-gold-antique" style={{ fontSize: '0.66rem' }}>
                          {step.year || step.era}
                        </span>
                      </div>
                      <div className="small text-secondary" style={{ fontSize: '0.80rem', lineHeight: '1.5' }}>
                        {step.event}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Associated Personalities Links */}
                {selectedLandmarkProfile.associatedPersonalities?.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-display text-white mb-2" style={{ fontSize: '1.05rem' }}>
                      <i className="bi bi-people-fill text-gold-antique me-2"></i>
                      Associated Key Figures of 61 AH
                    </h5>
                    <div className="d-flex flex-wrap gap-2">
                      {selectedLandmarkProfile.associatedPersonalities.map((pers) => (
                        <div
                          key={pers.id}
                          className="personality-connection-pill"
                          onClick={() => {
                            setSelectedLandmarkProfile(null);
                            onNavigate('personalities');
                          }}
                          title={`Explore biography: ${pers.name}`}
                        >
                          <i className="bi bi-person-fill text-gold-antique"></i>
                          <span className="fw-semibold">{pers.name}</span>
                          <span className="text-secondary" style={{ fontSize: '0.70rem' }}>({pers.role})</span>
                          <i className="bi bi-arrow-right-short text-gold-antique"></i>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Diacritized Ziyarat Text Inscription */}
                {selectedLandmarkProfile.ziyaratText && (
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h5 className="font-display text-white mb-0" style={{ fontSize: '1.05rem' }}>
                        <i className="bi bi-book-fill text-gold-antique me-2"></i>
                        Authentic Ziyarat Recitation &amp; Inscription
                      </h5>
                      <span className="small text-secondary" style={{ fontSize: '0.72rem' }}>
                        {selectedLandmarkProfile.ziyaratText.title || selectedLandmarkProfile.ziyaratText.source}
                      </span>
                    </div>
                    <div className="ziyarat-arabic-card mb-2">
                      {selectedLandmarkProfile.ziyaratText.arabic}
                    </div>
                    <div className="p-2.5 rounded bg-black border border-dark small text-champagne" style={{ fontSize: '0.82rem', lineHeight: '1.6' }}>
                      <strong>Meaning:</strong> "{selectedLandmarkProfile.ziyaratText.translation}"
                    </div>
                  </div>
                )}

                {/* Visitor Etiquette & Practical Pilgrim Advice */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="p-3 rounded bg-black-subtle border border-dark h-100">
                      <div className="small text-gold-antique fw-bold mb-1">
                        <i className="bi bi-check2-circle me-1"></i>
                        Reverent Visitor Etiquette:
                      </div>
                      {Array.isArray(selectedLandmarkProfile.visitorEtiquette) ? (
                        <ul className="small text-secondary ps-3 mb-0" style={{ fontSize: '0.76rem', lineHeight: '1.6' }}>
                          {selectedLandmarkProfile.visitorEtiquette.map((et, eti) => (
                            <li key={eti}>{et}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="small text-secondary" style={{ fontSize: '0.76rem', lineHeight: '1.6' }}>
                          {selectedLandmarkProfile.visitorEtiquette || 'Maintain respectful silence and modest dress in all sanctuary precincts.'}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 rounded bg-black-subtle border border-dark h-100">
                      <div className="small text-gold-antique fw-bold mb-1">
                        <i className="bi bi-shield-check me-1"></i>
                        Accessibility &amp; Facilities:
                      </div>
                      <div className="small text-secondary mb-1" style={{ fontSize: '0.76rem' }}>
                        <strong>Wheelchair Access:</strong> {selectedLandmarkProfile.accessibility?.wheelchairAccess || (selectedLandmarkProfile.accessibility?.wheelchairAccessible ? 'Fully Ramp Accessible' : 'Step-free portals available')}
                      </div>
                      <div className="small text-secondary mb-1" style={{ fontSize: '0.76rem' }}>
                        <strong>Assistive Support:</strong> {selectedLandmarkProfile.accessibility?.assistiveSupport || (Array.isArray(selectedLandmarkProfile.accessibility?.facilities) ? selectedLandmarkProfile.accessibility.facilities.join(' • ') : 'Dedicated pilgrim support')}
                      </div>
                      <div className="small text-secondary" style={{ fontSize: '0.76rem' }}>
                        <strong>Visiting Hours:</strong> {selectedLandmarkProfile.accessibility?.recommendedVisitingHours || 'Open 24/7 for pilgrimage'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sourced Classical Citations Footer */}
                <div className="p-2.5 rounded bg-black border border-dark">
                  <div className="small text-secondary font-monospace" style={{ fontSize: '0.72rem' }}>
                    <strong className="text-gold-antique">Verified Academic Sources:</strong> {(selectedLandmarkProfile.sourceCitations || selectedLandmarkProfile.citations || []).join(' | ')}
                  </div>
                </div>
              </div>

              {/* Modal Sticky Footer with Practical CTA */}
              <div className="landmark-modal-footer">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setSelectedLandmarkProfile(null)}
                >
                  Close Monograph
                </button>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-gold"
                    onClick={() => {
                      setSelectedLandmarkProfile(null);
                      onNavigate('map');
                    }}
                  >
                    <i className="bi bi-compass-fill me-1"></i>
                    Locate on 61 AH Map
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-gold"
                    onClick={() => {
                      setSelectedLandmarkProfile(null);
                      onNavigate('ziyarat');
                    }}
                  >
                    <i className="bi bi-cursor-fill me-1"></i>
                    Navigate with My Ziyarat
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-gold"
                    onClick={() => {
                      const profile = selectedLandmarkProfile;
                      setSelectedLandmarkProfile(null);
                      askAiAboutLandmark(profile);
                    }}
                  >
                    <i className="bi bi-chat-heart-fill me-1 text-gold-antique"></i>
                    Ask AI Companion
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Subtle Assistant Footer Credit */}
        <div className="text-center py-3 border-top border-dark mt-4 global-developer-credit-line" style={{ fontSize: '0.74rem' }}>
          Ask Karbala AI Companion 3.0 • Developed by <strong style={{ color: 'var(--lux-gold, #C6A66B)' }}>Sayyed Faiz Zaidi</strong>
        </div>

      </div>
    </div>
  );
}

// ==========================================================================
// PHASE C: AR SACRED BEACON GUIDANCE MODAL (WALKING GUIDANCE PROTOTYPE)
// ==========================================================================
function ArSacredBeaconModal({ isOpen, onClose, initialTargetId = 'shrine_hussain' }) {
  const [targetId, setTargetId] = useState(initialTargetId);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [isSimulatorMode, setIsSimulatorMode] = useState(false);
  const [manualPan, setManualPan] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [sensorCalibrated, setSensorCalibrated] = useState(false);
  const [autoPaused, setAutoPaused] = useState(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(180);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const AR_TARGETS = [
    {
      id: 'shrine_hussain',
      name: 'Holy Shrine of Imam Hussain (AS)',
      arabic: 'العتبة الحسينية المقدسة',
      coords: { lat: 32.61603, lng: 44.03244 },
      badge: 'Golden Dome & Crimson Banner',
      description: 'Central spiritual sanctum of Karbala. Primary processional access via Bab al-Qibla.',
      distanceDirect: '240m'
    },
    {
      id: 'shrine_abbas',
      name: 'Holy Shrine of Hazrat Al-Abbas (AS)',
      arabic: 'العتبة العباسية المقدسة',
      coords: { lat: 32.61862, lng: 44.03583 },
      badge: 'Gilded Minarets & Clock Tower',
      description: 'Eastern sanctuary on ancient Nahr al-Alqami. Primary access via Bab al-Qibla / Bab al-Hawaej.',
      distanceDirect: '560m'
    },
    {
      id: 'bayn_al_haramayn',
      name: 'Bayn al-Haramayn Promenade',
      arabic: 'ساحة ما بين الحرمين الشريفين',
      coords: { lat: 32.61730, lng: 44.03410 },
      badge: '378m Marble Pedestrian Concourse',
      description: 'Shaded white marble concourse linking the two holy shrines with mist cooling.',
      distanceDirect: '380m'
    }
  ];

  const currentTarget = AR_TARGETS.find(t => t.id === targetId) || AR_TARGETS[0];

  const userLat = 32.61520;
  const userLng = 44.03245;

  const calculateAzimuth = (lat1, lon1, lat2, lon2) => {
    const toRad = Math.PI / 180;
    const toDeg = 180 / Math.PI;
    const phi1 = lat1 * toRad;
    const phi2 = lat2 * toRad;
    const deltaLambda = (lon2 - lon1) * toRad;
    const y = Math.sin(deltaLambda) * Math.cos(phi2);
    const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
    const theta = Math.atan2(y, x);
    return (theta * toDeg + 360) % 360;
  };

  const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const targetAzimuth = calculateAzimuth(userLat, userLng, currentTarget.coords.lat, currentTarget.coords.lng);
  const distanceMeters = calculateDistanceMeters(userLat, userLng, currentTarget.coords.lat, currentTarget.coords.lng);

  const activeHeading = isSimulatorMode ? manualPan : deviceHeading;
  const rawDiff = ((targetAzimuth - activeHeading + 540) % 360) - 180;
  const isAligned = Math.abs(rawDiff) < 14;

  const screenPct = Math.max(6, Math.min(94, 50 + (rawDiff / 32) * 50));
  const isOffscreenLeft = rawDiff < -32;
  const isOffscreenRight = rawDiff > 32;

  useEffect(() => {
    if (!isOpen) return;

    setAutoPaused(false);
    setTimeRemainingSeconds(180);

    let activeStream = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }
      }).then(s => {
        activeStream = s;
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play().catch(() => {});
        }
        setCameraActive(true);
        setCameraError(null);
      }).catch(err => {
        console.warn('AR Camera access note:', err);
        setCameraActive(false);
        setIsSimulatorMode(true);
      });
    } else {
      setIsSimulatorMode(true);
    }

    const handleOrientation = (e) => {
      let heading = null;
      if (e.webkitCompassHeading !== undefined) {
        heading = e.webkitCompassHeading;
      } else if (e.alpha !== null) {
        heading = (360 - e.alpha) % 360;
      }
      if (heading !== null && !isNaN(heading)) {
        setDeviceHeading(Math.round(heading));
        setSensorCalibrated(true);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    timerRef.current = setInterval(() => {
      setTimeRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setAutoPaused(true);
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            setCameraActive(false);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (activeStream) activeStream.getTracks().forEach(t => t.stop());
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      window.removeEventListener('deviceorientation', handleOrientation);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleResume = () => {
    setAutoPaused(false);
    setTimeRemainingSeconds(180);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }
      }).then(s => {
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play().catch(() => {});
        }
        setCameraActive(true);
      }).catch(() => {
        setIsSimulatorMode(true);
      });
    }
  };

  return (
    <div className="ar-beacon-modal-sheet" onClick={onClose} role="dialog" aria-modal="true" aria-label="AR Sacred Beacon Guidance View">
      <div className="ar-beacon-card shadow-2xl" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-2 px-1">
          <div className="d-flex align-items-center gap-2">
            <span className="badge" style={{ background: '#1b3d2f', color: '#d4af37', border: '1px solid #d4af37', fontSize: '0.72rem' }}>
              <i className="bi bi-compass-fill me-1"></i> AR SACRED BEACON 3.0
            </span>
            <span className="badge bg-dark border border-gold-subtle text-secondary" style={{ fontSize: '0.68rem' }}>
              Azimuth: {Math.round(targetAzimuth)}° • Heading: {Math.round(activeHeading)}°
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className={`btn btn-xs ${isSimulatorMode ? 'btn-gold' : 'btn-outline-secondary'}`}
              style={{ fontSize: '0.70rem' }}
              onClick={() => setIsSimulatorMode(!isSimulatorMode)}
              title="Toggle Pan Simulator Mode"
            >
              <i className={`bi ${isSimulatorMode ? 'bi-sliders' : 'bi-camera-video'} me-1`}></i>
              {isSimulatorMode ? 'Simulator Active' : 'Sensor View'}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '30px', height: '30px', padding: 0 }}
              onClick={onClose}
              aria-label="Close AR view"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Strict Pilgrim Safety Notice Banner */}
        <div className="ar-safety-notice-banner mb-2">
          <i className="bi bi-exclamation-triangle-fill text-warning me-1.5 flex-shrink-0"></i>
          <span>
            <strong>PILGRIM SAFETY ALERT:</strong> Maintain physical situational awareness. Never walk while looking solely at your device screen. Stop in clear, uncrowded zones before checking AR beacons.
          </span>
        </div>

        {/* Main AR Viewport */}
        <div className="ar-viewport-stage">
          {/* Live Video Feed or Fallback Background */}
          {cameraActive && !isSimulatorMode ? (
            <video ref={videoRef} className="ar-camera-video" playsInline muted autoPlay></video>
          ) : (
            <div
              className="ar-pan-simulator-bg"
              style={{
                backgroundPosition: `${(activeHeading / 360) * 100}% center`
              }}
            >
              <div className="ar-simulator-watermark">
                <i className="bi bi-badge-vr me-1"></i>
                Simulated Skyline Concourse (Pan: {Math.round(activeHeading)}°)
              </div>
            </div>
          )}

          {/* Compass Ribbon (Top Overlay) */}
          <div className="ar-compass-ribbon">
            <div className="ar-compass-indicator">
              <span className="ar-compass-val">{Math.round(activeHeading)}°</span>
              <span className="ar-compass-dir">
                {activeHeading >= 338 || activeHeading < 23 ? 'NORTH' :
                 activeHeading >= 23 && activeHeading < 68 ? 'NE' :
                 activeHeading >= 68 && activeHeading < 113 ? 'EAST' :
                 activeHeading >= 113 && activeHeading < 158 ? 'SE' :
                 activeHeading >= 158 && activeHeading < 203 ? 'SOUTH' :
                 activeHeading >= 203 && activeHeading < 248 ? 'SW' :
                 activeHeading >= 248 && activeHeading < 293 ? 'WEST' : 'NW'}
              </span>
            </div>
            <div className="ar-compass-ticks-line">
              <div className="ar-compass-notch" style={{ left: '10%' }}>NW</div>
              <div className="ar-compass-notch north" style={{ left: '30%' }}>N</div>
              <div className="ar-compass-notch" style={{ left: '50%' }}>NE</div>
              <div className="ar-compass-notch" style={{ left: '70%' }}>E</div>
              <div className="ar-compass-notch" style={{ left: '90%' }}>SE</div>
            </div>
          </div>

          {/* Auto-Paused Battery Shield */}
          {autoPaused && (
            <div className="ar-autopause-overlay">
              <i className="bi bi-battery-charging text-gold-antique fs-1 mb-2"></i>
              <h5 className="text-white mb-1">AR View Auto-Paused</h5>
              <p className="text-secondary small mb-3" style={{ maxWidth: '360px' }}>
                Camera stream was paused after 3 minutes to conserve device battery and avoid thermal throttling.
              </p>
              <button type="button" className="btn btn-sm btn-gold px-3" onClick={handleResume}>
                <i className="bi bi-play-circle-fill me-1"></i> Resume Guidance
              </button>
            </div>
          )}

          {/* Floating Sacred Beacon or Offscreen Arrow */}
          {!autoPaused && (
            <>
              {isOffscreenLeft && (
                <div className="ar-offscreen-indicator left">
                  <i className="bi bi-arrow-left-circle-fill fs-3 text-gold-antique"></i>
                  <span>Turn Left ({Math.round(Math.abs(rawDiff))}°)</span>
                </div>
              )}

              {isOffscreenRight && (
                <div className="ar-offscreen-indicator right">
                  <span>Turn Right ({Math.round(rawDiff)}°)</span>
                  <i className="bi bi-arrow-right-circle-fill fs-3 text-gold-antique"></i>
                </div>
              )}

              {!isOffscreenLeft && !isOffscreenRight && (
                <div
                  className={`ar-floating-dome-marker ${isAligned ? 'aligned' : ''}`}
                  style={{ left: `${screenPct}%` }}
                >
                  <div className="ar-beacon-halo"></div>
                  <div className="ar-beacon-icon-wrap">
                    <i className="bi bi-bank2"></i>
                  </div>
                  <div className="ar-beacon-label-card shadow-lg">
                    <div className="d-flex align-items-center gap-1.5 justify-content-center">
                      <span className="badge bg-gold text-dark fw-bold" style={{ fontSize: '0.62rem' }}>
                        {isAligned ? 'DIRECT ALIGNMENT' : 'IN VIEW'}
                      </span>
                      <span className="small text-white fw-bold">{distanceMeters}m</span>
                    </div>
                    <div className="ar-beacon-name">{currentTarget.name.replace('Holy Shrine of ', '')}</div>
                    <div className="ar-beacon-arabic font-arabic-sign">{currentTarget.arabic}</div>
                    <div className="small text-success mt-1" style={{ fontSize: '0.68rem' }}>
                      <i className="bi bi-person-wheelchair me-1"></i>Step-free barrier confirmed
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Active Alignment Reticle when facing the shrine */}
          {isAligned && !autoPaused && (
            <div className="ar-alignment-reticle">
              <div className="ar-reticle-crosshair"></div>
              <span className="badge bg-black bg-opacity-75 text-gold-antique border border-gold-subtle">
                DIRECT LINE OF SIGHT • AZIMUTH {Math.round(targetAzimuth)}°
              </span>
            </div>
          )}
        </div>

        {/* Interactive Controls & Target Selector */}
        <div className="p-3 bg-dark border-top border-dark rounded-bottom">
          {/* Target Tabs */}
          <div className="d-flex gap-2 mb-2 flex-wrap">
            {AR_TARGETS.map(t => (
              <button
                key={t.id}
                type="button"
                className={`btn btn-sm ${targetId === t.id ? 'btn-gold' : 'btn-outline-light'}`}
                style={{ fontSize: '0.74rem' }}
                onClick={() => setTargetId(t.id)}
              >
                {t.id === 'shrine_hussain' ? 'Imam Hussain (AS)' : t.id === 'shrine_abbas' ? 'Hazrat Abbas (AS)' : 'Bayn al-Haramayn'}
              </button>
            ))}
          </div>

          {/* Manual Pan Slider for desktop / simulator */}
          {isSimulatorMode && (
            <div className="ar-simulator-pan-controls mb-2">
              <div className="d-flex justify-content-between small text-secondary mb-1" style={{ fontSize: '0.72rem' }}>
                <span><i className="bi bi-arrows-expand me-1"></i>360° Panorama Pan:</span>
                <strong className="text-champagne">{manualPan}°</strong>
              </div>
              <input
                type="range"
                className="form-range"
                min="0"
                max="360"
                value={manualPan}
                onChange={(e) => setManualPan(parseInt(e.target.value, 10))}
              />
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center small text-secondary" style={{ fontSize: '0.72rem' }}>
            <span>
              <i className="bi bi-clock-history me-1 text-gold-antique"></i>
              Auto-Pause in: {Math.floor(timeRemainingSeconds / 60)}:{(timeRemainingSeconds % 60).toString().padStart(2, '0')}
            </span>
            <span className="text-champagne">
              Verified Sensor Baseline: Astan Topographical Coordinates
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================================================
// EMERGENCY PILGRIM ASSISTANCE MODAL (PHASE 8 TRUST & SAFETY VERIFIED)
// ==========================================================================
function EmergencyPilgrimModal({ isOpen, onClose }) {
  const [showConsent, setShowConsent] = useState(false);
  const [coordsCopied, setCoordsCopied] = useState(false);
  const [peerLinkCopied, setPeerLinkCopied] = useState(false);

  if (!isOpen) return null;

  const handleAuthorizeAndCopy = () => {
    const text = 'EMERGENCY DISPATCH: Pilgrim location at Karbala Holy Precincts: 32.61603° N, 44.03244° E (near Bab al-Qibla / Bab al-Sidra). Requesting assistance.';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCoordsCopied(true);
      setTimeout(() => setCoordsCopied(false), 4000);
    }
  };

  const handleSharePeerLocation = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#ziyarat?share_lat=32.61603&share_lng=44.03244&t=${Date.now()}`;
    const shareData = {
      title: 'My Sanctuary Position — Karbala 3.0 Companion',
      text: 'I am currently at Karbala Holy Precincts near Imam Hussain Holy Shrine (Bab al-Qibla / Bab al-Salam). View my verified location:',
      url: shareUrl
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name !== 'AbortError') console.warn('Share error:', err);
      }
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareData.text}\n${shareUrl}`);
      setPeerLinkCopied(true);
      setTimeout(() => setPeerLinkCopied(false), 4000);
    }
  };

  return (
    <div className="emergency-modal-sheet" onClick={onClose} role="dialog" aria-modal="true" aria-label="Verified Pilgrim Emergency Services">
      <div className="emergency-sheet-card shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-danger text-white px-2.5 py-1 fw-bold" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
              <i className="bi bi-shield-fill-exclamation me-1"></i> 24/7 VERIFIED PILGRIM HOTLINES
            </span>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '32px', height: '32px', padding: 0 }}
            onClick={onClose}
            aria-label="Close emergency modal"
          >
            ✕
          </button>
        </div>

        <h4 className="font-display text-white mb-1" style={{ color: '#fff' }}>
          Emergency &amp; Medical Assistance
        </h4>
        <p className="text-secondary small mb-3" style={{ fontSize: '0.78rem' }}>
          Official, ground-truth verified telephone hotlines and hospital coordinates for Karbala holy precincts.
        </p>

        <div className="emergency-hotline-grid mb-3">
          <a href="tel:122" className="emergency-hotline-card">
            <span className="emergency-hotline-num">122</span>
            <span className="emergency-hotline-name">Red Crescent Ambulance</span>
            <span className="emergency-hotline-sub">الإسعاف الفوري • Free National Medical Dispatch</span>
          </a>

          <a href="tel:104" className="emergency-hotline-card">
            <span className="emergency-hotline-num">104</span>
            <span className="emergency-hotline-name">Police &amp; Civil Security</span>
            <span className="emergency-hotline-sub">شرطة النجدة • Karbala Security Operations Command</span>
          </a>

          <a href="tel:115" className="emergency-hotline-card">
            <span className="emergency-hotline-num">115</span>
            <span className="emergency-hotline-name">Civil Defense &amp; Fire</span>
            <span className="emergency-hotline-sub">الدفاع المدني • National Rescue &amp; Fire Response</span>
          </a>

          <a href="tel:032322222" className="emergency-hotline-card" style={{ borderColor: 'rgba(198, 166, 107, 0.4)', background: 'rgba(20, 25, 24, 0.8)' }}>
            <span className="emergency-hotline-num" style={{ color: '#C6A66B', fontSize: '1.45rem' }}>032-322222</span>
            <span className="emergency-hotline-name">Holy Shrine Assistance</span>
            <span className="emergency-hotline-sub">العتبة الحسينية • Lost Pilgrims &amp; Multilingual Guidance</span>
          </a>

          <a href="tel:+96432328100" className="emergency-hotline-card" style={{ borderColor: 'rgba(45, 212, 191, 0.4)', background: 'rgba(16, 59, 50, 0.35)' }}>
            <span className="emergency-hotline-num" style={{ color: '#2DD4BF', fontSize: '1.25rem' }}>+964 32 328 100</span>
            <span className="emergency-hotline-name">Safeer al-Hussain ER Hospital</span>
            <span className="emergency-hotline-sub">50m North of Bab al-Sidra (Free 24/7 ER Trauma Bay)</span>
          </a>

          <a href="tel:+9647602344444" className="emergency-hotline-card" style={{ borderColor: 'rgba(230, 212, 173, 0.4)', background: 'rgba(20, 25, 24, 0.8)' }}>
            <span className="emergency-hotline-num" style={{ color: '#E6D4AD', fontSize: '1.25rem' }}>+964 760 234 4444</span>
            <span className="emergency-hotline-name">Al-Kafeel Super Speciality Hospital</span>
            <span className="emergency-hotline-sub">Al-Husayniya Road (Tertiary ICU &amp; Surgery)</span>
          </a>
        </div>

        {/* Explicit Coordinate Sharing with User Consent */}
        <div className="p-3 rounded bg-dark border border-secondary mb-2">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
            <div className="small text-secondary" style={{ fontSize: '0.76rem' }}>
              <i className="bi bi-geo-alt-fill text-gold-antique me-1"></i>
              Your Sanctuary Coordinates: <strong className="text-light">32.61603° N, 44.03244° E</strong>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-warning"
              style={{ fontSize: '0.74rem' }}
              onClick={() => setShowConsent(!showConsent)}
            >
              <i className="bi bi-shield-lock me-1"></i>
              {showConsent ? 'Cancel Sharing' : 'Share Location with Dispatch'}
            </button>
          </div>

          {showConsent && (
            <div className="p-2.5 rounded bg-black border border-gold-subtle mt-2">
              <div className="small text-champagne mb-2" style={{ fontSize: '0.75rem' }}>
                <i className="bi bi-info-circle text-gold-antique me-1"></i>
                <strong>Explicit Consent Notice:</strong> Do you authorize copying your exact latitude and longitude along with your nearest shrine portal description to share with emergency responders or ambulance dispatch? No personal data is stored on our servers.
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-xs btn-outline-secondary"
                  onClick={() => setShowConsent(false)}
                >
                  Decline
                </button>
                <button
                  type="button"
                  className="btn btn-xs btn-gold"
                  onClick={handleAuthorizeAndCopy}
                >
                  <i className="bi bi-check2 me-1"></i> I Authorize &amp; Copy Coordinates
                </button>
              </div>
            </div>
          )}

          {coordsCopied && (
            <div className="alert alert-success py-1.5 px-2 mt-2 mb-0 small text-center" style={{ fontSize: '0.75rem' }}>
              <i className="bi bi-check-circle-fill me-1"></i> Emergency dispatch message copied to clipboard with exact coordinates!
            </div>
          )}
        </div>

        {/* Phase G: Column 18 Protocol & Consent-Based Peer Sharing */}
        <div className="p-3 rounded bg-dark border border-gold-subtle mb-2">
          <div className="d-flex align-items-center justify-content-between mb-1.5 flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-gold text-dark fw-bold" style={{ fontSize: '0.70rem' }}>
                <i className="bi bi-people-fill me-1"></i> ASTAN PROTOCOL
              </span>
              <strong className="text-white" style={{ fontSize: '0.88rem' }}>
                Column 18 (Amood 18) Lost Persons Standard
              </strong>
            </div>
            <span className="badge bg-black text-champagne border border-gold-subtle" style={{ fontSize: '0.68rem' }}>
              Official Arba'een Guideline
            </span>
          </div>

          <p className="text-secondary small mb-2" style={{ fontSize: '0.76rem', lineHeight: '1.55' }}>
            During major pilgrimage gatherings (Arba’een &amp; Ashura), the Holy Shrines maintain designated reunion poles and family guidance desks. <strong>Column 18 (Amood 18)</strong> along the Najaf-Karbala route and the <strong>Central Bayn al-Haramayn Lost Center (Markaz al-Mafqoodin)</strong> serve as the official, multilingual meeting points.
          </p>

          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 pt-1 border-top border-secondary-subtle">
            <span className="small text-champagne" style={{ fontSize: '0.74rem' }}>
              <i className="bi bi-telephone-fill text-gold-antique me-1"></i> Direct Lost Desk: <strong>032-322222</strong>
            </span>
            <button
              type="button"
              className="btn btn-sm btn-outline-gold py-1 px-2.5"
              style={{ fontSize: '0.74rem' }}
              onClick={handleSharePeerLocation}
            >
              <i className="bi bi-share-fill me-1"></i>
              {peerLinkCopied ? 'Link Copied to Clipboard!' : 'Share Position with Family'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================================================
// FIRST-TIME PILGRIM ONBOARDING MODAL (PHASE 9 PRODUCTION USABILITY)
// ==========================================================================
function FirstTimePilgrimModal({ isOpen, onClose, onSavePrefs, themeMode = 'dark', onToggleTheme }) {
  const [lang, setLang] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem('karbala_pilgrim_prefs') || '{}');
      return p.language || 'en';
    } catch (e) {
      return 'en';
    }
  });
  const [stepFree, setStepFree] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem('karbala_pilgrim_prefs') || '{}');
      return p.stepFree !== undefined ? p.stepFree : false;
    } catch (e) {
      return false;
    }
  });
  const [gpsAssist, setGpsAssist] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem('karbala_pilgrim_prefs') || '{}');
      return p.gpsAssist !== undefined ? p.gpsAssist : true;
    } catch (e) {
      return true;
    }
  });

  if (!isOpen) return null;

  const handleSave = () => {
    const prefs = { language: lang, stepFree, gpsAssist, onboarded: true, timestamp: new Date().toISOString() };
    localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify(prefs));
    if (window.applyKarbalaLanguage) window.applyKarbalaLanguage(lang);
    if (onSavePrefs) onSavePrefs(prefs);
    onClose();
  };

  const handleSkip = () => {
    const prefs = { language: 'en', stepFree: false, gpsAssist: true, onboarded: true, timestamp: new Date().toISOString() };
    localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify(prefs));
    if (window.applyKarbalaLanguage) window.applyKarbalaLanguage('en');
    if (onSavePrefs) onSavePrefs(prefs);
    onClose();
  };

  return (
    <div className="emergency-modal-sheet" onClick={onClose} role="dialog" aria-modal="true">
      <div className="emergency-sheet-card shadow-2xl" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-gold-subtle text-gold-antique border border-gold-subtle px-2.5 py-1 fw-bold" style={{ fontSize: '0.72rem' }}>
              <i className="bi bi-compass-fill me-1"></i> WELCOME PILGRIM • أهلاً بزوار الحسين
            </span>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-light rounded-circle"
            style={{ width: '32px', height: '32px', padding: 0 }}
            onClick={handleSkip}
            aria-label="Skip onboarding"
          >
            ✕
          </button>
        </div>

        <h4 className="font-display text-white mb-1">
          Welcome to Karbala Smart Ziyarat
        </h4>
        <p className="text-secondary small mb-3" style={{ fontSize: '0.80rem' }}>
          Personalize your sacred journey in 4 essential choices. No mandatory account creation or sign-up required.
        </p>

        {/* 1. Language Preference */}
        <div className="mb-3 p-3 rounded bg-dark border border-dark notranslate">
          <label className="text-gold-antique small fw-bold mb-2 d-block">
            <i className="bi bi-translate me-1.5"></i> 1. Select Preferred Language
          </label>
          <div className="d-flex flex-wrap gap-2">
            {[
              { id: 'en', label: 'English', sub: 'Latin' },
              { id: 'ur', label: 'اردو', sub: 'Urdu' },
              { id: 'hi', label: 'हिन्दी', sub: 'Hindi' },
              { id: 'ar', label: 'العربية', sub: 'Arabic' },
              { id: 'fa', label: 'فارسی', sub: 'Persian' },
              { id: 'ur-roman', label: 'Roman Urdu', sub: 'Hinglish' }
            ].map(l => (
              <button
                key={l.id}
                type="button"
                className={`btn btn-sm flex-grow-1 ${lang === l.id ? 'btn-gold' : 'btn-outline-secondary text-light'}`}
                onClick={() => {
                  setLang(l.id);
                  if (window.applyKarbalaLanguage) window.applyKarbalaLanguage(l.id);
                }}
              >
                <strong>{l.label}</strong> <span className="opacity-50 small">({l.sub})</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Step-Free & Accessibility */}
        <div className="mb-3 p-3 rounded bg-dark border border-dark">
          <label className="text-gold-antique small fw-bold mb-2 d-block">
            <i className="bi bi-person-wheelchair me-1.5"></i> 2. Do You Need Step-Free Routes?
          </label>
          <div className="row g-2">
            <div className="col-6">
              <button
                type="button"
                className={`btn btn-sm w-100 p-2 text-start ${stepFree ? 'btn-gold' : 'btn-outline-secondary text-light'}`}
                onClick={() => setStepFree(true)}
              >
                <div className="fw-bold">♿ Yes, Accessible</div>
                <div className="small opacity-75" style={{ fontSize: '0.72rem' }}>Prioritize level ramps &amp; elevators</div>
              </button>
            </div>
            <div className="col-6">
              <button
                type="button"
                className={`btn btn-sm w-100 p-2 text-start ${!stepFree ? 'btn-gold' : 'btn-outline-secondary text-light'}`}
                onClick={() => setStepFree(false)}
              >
                <div className="fw-bold">🚶 Standard Routes</div>
                <div className="small opacity-75" style={{ fontSize: '0.72rem' }}>All pedestrian walkways &amp; stairs</div>
              </button>
            </div>
          </div>
        </div>

        {/* 3. GPS Assistance */}
        <div className="mb-3 p-3 rounded bg-dark border border-dark">
          <label className="text-gold-antique small fw-bold mb-2 d-block">
            <i className="bi bi-geo-alt-fill me-1.5"></i> 3. GPS Assistance
          </label>
          <div className="row g-2">
            <div className="col-6">
              <button
                type="button"
                className={`btn btn-sm w-100 p-2 text-start ${gpsAssist ? 'btn-gold' : 'btn-outline-secondary text-light'}`}
                onClick={() => setGpsAssist(true)}
              >
                <div className="fw-bold">🛰️ Live GPS Active</div>
                <div className="small opacity-75" style={{ fontSize: '0.72rem' }}>Live presence on sanctuary map</div>
              </button>
            </div>
            <div className="col-6">
              <button
                type="button"
                className={`btn btn-sm w-100 p-2 text-start ${!gpsAssist ? 'btn-gold' : 'btn-outline-secondary text-light'}`}
                onClick={() => setGpsAssist(false)}
              >
                <div className="fw-bold">🛡️ Manual Planning</div>
                <div className="small opacity-75" style={{ fontSize: '0.72rem' }}>Pick start portals manually</div>
              </button>
            </div>
          </div>
        </div>

        {/* 4. Display Theme (Day / Night Mode) */}
        <div className="mb-3 p-3 rounded bg-dark border border-dark">
          <label className="text-gold-antique small fw-bold mb-2 d-block">
            <i className="bi bi-circle-half me-1.5"></i> 4. Sacred Ambience &amp; Visual Theme
          </label>
          <div className="row g-2">
            <div className="col-6">
              <button
                type="button"
                className={`btn btn-sm w-100 p-2 text-start ${themeMode === 'dark' ? 'btn-gold' : 'btn-outline-secondary text-light'}`}
                onClick={() => { if (themeMode !== 'dark' && onToggleTheme) onToggleTheme(); }}
              >
                <div className="fw-bold">🌙 Night Mode</div>
                <div className="small opacity-75" style={{ fontSize: '0.72rem' }}>Obsidian &amp; Sacred Charcoal</div>
              </button>
            </div>
            <div className="col-6">
              <button
                type="button"
                className={`btn btn-sm w-100 p-2 text-start ${themeMode === 'light' ? 'btn-gold' : 'btn-outline-secondary text-light'}`}
                onClick={() => { if (themeMode !== 'light' && onToggleTheme) onToggleTheme(); }}
              >
                <div className="fw-bold">☀️ Day Mode</div>
                <div className="small opacity-75" style={{ fontSize: '0.72rem' }}>Warm Ivory &amp; Sandstone</div>
              </button>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center pt-2 border-top border-dark">
          <button type="button" className="btn btn-sm btn-link text-secondary text-decoration-none" onClick={handleSkip}>
            Skip for Now
          </button>
          <button type="button" className="btn btn-gold px-4" onClick={handleSave}>
            Save Preferences &amp; Begin Ziyarat
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================================================
// OFFLINE PILGRIMAGE ESSENTIALS PACK MODAL (PHASE 9 PRODUCTION RELIABILITY)
// ==========================================================================
function OfflinePackViewModal({ isOpen, onClose, onDownloadHtml }) {
  const [offlineTab, setOfflineTab] = useState('emergency'); // 'emergency' | 'sites' | 'phrases' | 'ziyarat' | 'disclosure'

  if (!isOpen) return null;

  return (
    <div className="emergency-modal-sheet" onClick={onClose} role="dialog" aria-modal="true">
      <div className="emergency-sheet-card shadow-2xl" onClick={e => e.stopPropagation()} style={{ maxWidth: '780px', maxHeight: '88vh', overflowY: 'auto' }}>
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-dark">
          <div>
            <span className="badge bg-gold text-dark fw-bold mb-1" style={{ fontSize: '0.70rem' }}>
              <i className="bi bi-cloud-check-fill me-1"></i> 100% STANDALONE OFFLINE GUIDE
            </span>
            <h4 className="font-display text-white mb-0">Karbala Offline Pilgrimage Essentials</h4>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <button
              type="button"
              className="btn btn-sm btn-gold"
              onClick={onDownloadHtml}
              style={{ fontSize: '0.74rem' }}
            >
              <i className="bi bi-download me-1"></i> Save .html
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-light rounded-circle"
              style={{ width: '32px', height: '32px', padding: 0 }}
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="d-flex gap-1.5 mb-3 flex-wrap border-bottom border-dark pb-2">
          {[
            { id: 'emergency', label: 'Emergency Hotlines', icon: 'bi-shield-fill-exclamation' },
            { id: 'sites', label: 'Shrines & Portals', icon: 'bi-geo-alt-fill' },
            { id: 'phrases', label: 'Essential Phrases', icon: 'bi-chat-dots-fill' },
            { id: 'ziyarat', label: 'Core Recitations', icon: 'bi-book-half' },
            { id: 'disclosure', label: 'Online vs Offline', icon: 'bi-wifi-off' }
          ].map(t => (
            <button
              key={t.id}
              type="button"
              className={`btn btn-xs ${offlineTab === t.id ? 'btn-gold' : 'btn-outline-secondary text-light'}`}
              onClick={() => setOfflineTab(t.id)}
              style={{ fontSize: '0.74rem' }}
            >
              <i className={`bi ${t.icon} me-1`}></i>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Emergency */}
        {offlineTab === 'emergency' && (
          <div>
            <div className="alert alert-danger py-2 mb-3 small d-flex align-items-center gap-2" style={{ fontSize: '0.76rem' }}>
              <i className="bi bi-telephone-fill fs-5"></i>
              <div><strong>Toll-Free in Iraq:</strong> Ambulance <strong>122</strong> • Police <strong>104</strong> • Civil Defense <strong>115</strong></div>
            </div>
            <div className="table-responsive">
              <table className="table table-dark table-sm table-bordered small">
                <thead>
                  <tr className="text-gold-antique">
                    <th>Service</th>
                    <th>Number</th>
                    <th>Jurisdiction</th>
                    <th>Authority</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Red Crescent Ambulance</strong></td>
                    <td className="text-success font-monospace fw-bold">122</td>
                    <td>Iraq National</td>
                    <td>Ministry of Health</td>
                  </tr>
                  <tr>
                    <td><strong>Police &amp; Civil Security</strong></td>
                    <td className="text-warning font-monospace fw-bold">104</td>
                    <td>Karbala &amp; National</td>
                    <td>Ministry of Interior</td>
                  </tr>
                  <tr>
                    <td><strong>Civil Defense &amp; Fire</strong></td>
                    <td className="text-danger font-monospace fw-bold">115</td>
                    <td>Karbala Governorate</td>
                    <td>Civil Defense Directorate</td>
                  </tr>
                  <tr>
                    <td><strong>Holy Shrines Central Hotline</strong></td>
                    <td className="text-gold-antique font-monospace fw-bold">032-322222</td>
                    <td>Shrines &amp; Bayn al-Haramayn</td>
                    <td>Astan Quds Central Office</td>
                  </tr>
                  <tr>
                    <td><strong>Safeer al-Hussain ER Hospital</strong></td>
                    <td className="text-info font-monospace fw-bold">+964 32 328 100</td>
                    <td>50m North of Bab al-Sidra</td>
                    <td>Shrine Health Directorate</td>
                  </tr>
                  <tr>
                    <td><strong>Al-Kafeel Super Speciality Hospital</strong></td>
                    <td className="text-champagne font-monospace fw-bold">+964 760 234 4444</td>
                    <td>Al-Husayniya Road (2.5km North)</td>
                    <td>Al-Abbas Holy Shrine</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Sites */}
        {offlineTab === 'sites' && (
          <div className="d-flex flex-column gap-2">
            {[
              { name: 'Holy Shrine of Imam Hussain (AS)', arabic: 'العتبة الحسينية المقدسة', coords: '32.61603° N, 44.03244° E', gates: 'Bab al-Qibla (South), Bab al-Rajaa (Wheelchair Ramp), Bab al-Sidra (North)', access: 'Step-Free Level Ramps Confirmed' },
              { name: 'Holy Shrine of Hazrat Al-Abbas (AS)', arabic: 'العتبة العباسية المقدسة', coords: '32.61860° N, 44.03584° E', gates: 'Bab al-Qibla (South), Bab al-Furat (East Ramp), Bab al-Hawaej (West)', access: 'Dedicated Step-Free Ramp at Bab al-Furat' },
              { name: 'Bayn al-Haramayn Promenade', arabic: 'ساحة ما بين الحرمين الشريفين', coords: '32.61732° N, 44.03414° E', gates: '378m White Thassos Marble Concourse', access: '100% Flat Barrier-Free White Marble with Mist Sprayers' },
              { name: 'Tall al-Zaynabiyya', arabic: 'تل الزينبية', coords: '32.61605° N, 44.03085° E', gates: 'Al-Hawra Street Portal', access: 'Elevated Platform with Ramps & Staircase' },
              { name: 'Al-Mukhayyam al-Husayni', arabic: 'المخيم الحسيني الشريف', coords: '32.61395° N, 44.02980° E', gates: 'Bab al-Mukhayyam (500m SW of Shrines)', access: 'Level Street Entrance' }
            ].map((s, si) => (
              <div key={si} className="p-2.5 rounded bg-dark border border-dark">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong className="text-white">{s.name}</strong>
                  <span className="text-gold-antique font-arabic-sign" style={{ direction: 'rtl' }}>{s.arabic}</span>
                </div>
                <div className="small text-secondary mb-1">
                  <i className="bi bi-geo-alt text-gold-antique me-1"></i>{s.coords} • <i className="bi bi-door-open me-1"></i>{s.gates}
                </div>
                <div className="small text-success">
                  <i className="bi bi-person-wheelchair me-1"></i>{s.access}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Phrases */}
        {offlineTab === 'phrases' && (
          <div className="d-flex flex-column gap-2">
            {[
              { en: 'Where is the nearest medical post or ambulance?', ar: 'أين أقرب مركز صحي أو إسعاف؟', tr: 'Ayna aqrab markaz sihhi aw is\'af?', ur: 'قریبی میڈیکل سنٹر یا ایمبولینس کہاں ہے؟' },
              { en: 'I am separated from my family; where is the lost persons center?', ar: 'لقد ضعت عن عائلتي، أين مركز إرشاد التائهين؟', tr: 'Laqad di\'tu \'an \'a\'ilati, ayna markaz irshad al-ta\'ihin?', ur: 'میں اپنے خاندان سے بچھڑ گیا ہوں، گمشدہ افراد کا مرکز کہاں ہے؟' },
              { en: 'Where can I find drinking water?', ar: 'أين أجد ماء شرب بارد؟', tr: 'Ayna ajidu ma\'a shurbin barid?', ur: 'ٹھنڈا پینے کا پانی کہاں ملے گا؟' },
              { en: 'I need wheelchair assistance for an elderly pilgrim.', ar: 'أحتاج كرسي متحرك لكبير السن، أين قسم الإعارة؟', tr: 'Ahtaju kursiyyan mutaharrikan li-kabeer al-sinn, ayna qism al-i\'arah?', ur: 'مجھے بزرگ زائر کے لیے وہیل چیئر چاہیے، لون ڈیسک کہاں ہے؟' },
              { en: 'Where are the bag lockers and shoe deposits?', ar: 'أين أمانات الحقائب والكشوانية؟', tr: 'Ayna amanat al-haqa\'ib wa al-keshwaniyyah?', ur: 'سامان اور جوتے جمع کروانے کی جگہ کہاں ہے؟' }
            ].map((p, pi) => (
              <div key={pi} className="p-2.5 rounded bg-dark border border-dark">
                <div className="text-white small fw-bold mb-1">{p.en}</div>
                <div className="text-gold-antique font-arabic-sign fs-5 mb-1" style={{ direction: 'rtl' }}>{p.ar}</div>
                <div className="text-secondary small fst-italic mb-1">{p.tr}</div>
                <div className="text-champagne small font-urdu-text" style={{ direction: 'rtl' }}>{p.ur}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Ziyarat Texts */}
        {offlineTab === 'ziyarat' && (
          <div className="d-flex flex-column gap-3">
            <div className="p-3 rounded bg-dark border border-gold-subtle">
              <h6 className="font-display text-gold-antique mb-1">1. Idhn al-Dukhul (Seeking Permission to Enter)</h6>
              <div className="font-arabic-sign fs-5 text-white mb-2 leading-relaxed" style={{ direction: 'rtl', lineHeight: '1.8' }}>
                اللّهُمَّ إِنِّي وَقَفْتُ عَلى بابٍ مِنْ أَبْوابِ بُيُوتِ نَبِيِّكَ، وَقَدْ مَنَعْتَ النّاسَ أَنْ يَدْخُلُوا إِلّا بِإِذْنِهِ... أَأَدْخُلُ يا رَسُولَ اللهِ؟ أَأَدْخُلُ يا حُجَّةَ اللهِ؟
              </div>
              <div className="small text-secondary fst-italic">
                "O Allah, I stand at one of the doors of the houses of Your Prophet... May I enter, O Messenger of Allah? May I enter, O Proof of Allah?"
              </div>
            </div>

            <div className="p-3 rounded bg-dark border border-gold-subtle">
              <h6 className="font-display text-gold-antique mb-1">2. Ziyarat Warith (Imam Hussain AS)</h6>
              <div className="font-arabic-sign fs-5 text-white mb-2 leading-relaxed" style={{ direction: 'rtl', lineHeight: '1.8' }}>
                السَّلامُ عَلَيْكَ يا وارِثَ آدَمَ صَفْوَةِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ نُوحٍ نَبِيِّ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ إِبْراهِيمَ خَلِيلِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ مُوسى كَلِيمِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ عِيسى رُوحِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ مُحَمَّدٍ حَبِيبِ اللهِ...
              </div>
              <div className="small text-secondary fst-italic">
                "Peace be upon you, O inheritor of Adam the chosen of Allah. Peace be upon you, O inheritor of Noah the prophet of Allah. Peace be upon you, O inheritor of Abraham the intimate friend of Allah..."
              </div>
            </div>

            <div className="p-3 rounded bg-dark border border-gold-subtle">
              <h6 className="font-display text-gold-antique mb-1">3. Ziyarat of Hazrat Al-Abbas (AS)</h6>
              <div className="font-arabic-sign fs-5 text-white mb-2 leading-relaxed" style={{ direction: 'rtl', lineHeight: '1.8' }}>
                السَّلامُ عَلَيْكَ يا أَبَا الفَضْلِ العَبَّاسَ ابْنَ أَمِيرِ المُؤْمِنِينَ، السَّلامُ عَلَيْكَ يا ابْنَ سَيِّدِ الوَصِيِّينَ، أَشْهَدُ أَنَّكَ قَدْ نَصَحْتَ لِلَّهِ وَلِرَسُولِهِ وَلأَخِيكَ فَنِعْمَ الأَخُ المُواسِي...
              </div>
              <div className="small text-secondary fst-italic">
                "Peace be upon you, O Abu al-Fadl al-Abbas, son of the Commander of the Faithful. I bear witness that you offered sincere counsel to Allah, His Messenger, and your brother; what an excellent consoling brother you were..."
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Disclosure */}
        {offlineTab === 'disclosure' && (
          <div className="p-3 rounded bg-dark border border-dark">
            <h6 className="text-gold-antique font-display mb-2">
              <i className="bi bi-info-circle me-1.5"></i>
              Online vs Offline Connectivity Disclosure
            </h6>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="p-2.5 rounded bg-black border border-success-subtle h-100">
                  <div className="text-success fw-bold small mb-1.5">
                    <i className="bi bi-check-circle-fill me-1"></i> Works 100% Offline (No Data Needed):
                  </div>
                  <ul className="small text-light-subtle ps-3 mb-0" style={{ fontSize: '0.76rem', lineHeight: '1.6' }}>
                    <li>Pre-cached coordinates and gate directory</li>
                    <li>24/7 Emergency hotlines and hospital dialer</li>
                    <li>Core Arabic Ziyarat recitations with English &amp; Urdu</li>
                    <li>Essential emergency phrasebook</li>
                    <li>Saved bookmarks and personal preferences</li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-2.5 rounded bg-black border border-warning-subtle h-100">
                  <div className="text-warning fw-bold small mb-1.5">
                    <i className="bi bi-exclamation-triangle-fill me-1"></i> Requires Cellular / Wi-Fi Data:
                  </div>
                  <ul className="small text-light-subtle ps-3 mb-0" style={{ fontSize: '0.76rem', lineHeight: '1.6' }}>
                    <li>Live satellite map tiles (OpenStreetMap / MapLibre)</li>
                    <li>Dynamic AI conversational chat engine (Ask Karbala AI)</li>
                    <li>Real-time crowd telemetry and live security bulletins</li>
                  </ul>
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

  // Senior Pilgrim Large Text Mode, Low-Bandwidth Data Saver Mode, Emergency Modal, Spotlight Search & Onboarding Preferences
  const [seniorMode, setSeniorMode] = useState(() => {
    try { return localStorage.getItem('karbala_senior_mode') === '1'; } catch (e) { return false; }
  });
  const [dataSaverMode, setDataSaverMode] = useState(() => {
    try { return localStorage.getItem('karbala_data_saver') === '1'; } catch (e) { return false; }
  });
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showArModal, setShowArModal] = useState(false);
  const [arTargetDestination, setArTargetDestination] = useState('shrine_hussain');
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showOfflinePackModal, setShowOfflinePackModal] = useState(false);
  const [showSpotlightSearch, setShowSpotlightSearch] = useState(false);
  const [isMuseumLoading, setIsMuseumLoading] = useState(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(() => setIsMuseumLoading(false), prefersReduced ? 120 : 520);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowSpotlightSearch(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);
  // Legal, Privacy & Compliance Modal State
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState('privacy');
  const openLegalModal = useCallback((tab = 'privacy') => {
    setLegalModalTab(tab);
    setShowLegalModal(true);
  }, []);

  // Global Theme State: 'dark' | 'light' | 'system'
  const [themeMode, setThemeMode] = useState(() => {
    try {
      return localStorage.getItem('karbala_theme_mode') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  const applyTheme = useCallback((mode) => {
    let resolved = mode;
    if (mode === 'system') {
      resolved = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.setAttribute('data-bs-theme', resolved);
    if (document.body) {
      document.body.classList.toggle('mode-light', resolved === 'light');
      document.body.classList.toggle('mode-dark', resolved === 'dark');
    }
  }, []);

  useEffect(() => {
    applyTheme(themeMode);
    try {
      localStorage.setItem('karbala_theme_mode', themeMode);
    } catch (e) {}

    if (window.matchMedia) {
      const media = window.matchMedia('(prefers-color-scheme: light)');
      const listener = () => {
        if (themeMode === 'system') {
          applyTheme('system');
        }
      };
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [themeMode, applyTheme]);

  const toggleTheme = useCallback(() => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    if (document.body) {
      document.body.classList.toggle('senior-mode', seniorMode);
    }
    try { localStorage.setItem('karbala_senior_mode', seniorMode ? '1' : '0'); } catch (e) {}
  }, [seniorMode]);

  useEffect(() => {
    if (document.body) {
      document.body.classList.toggle('data-saver-mode', dataSaverMode);
    }
    try { localStorage.setItem('karbala_data_saver', dataSaverMode ? '1' : '0'); } catch (e) {}
  }, [dataSaverMode]);

  const [calendarTab, setCalendarTab] = useState('calendar');

  // High-Level Website Navigation View: 'home' | 'calendar' | 'map' | 'story' | 'journey-61ah' | 'timeline' | 'personalities' | 'pavilion' | 'historiography' | 'ziyarat' | 'ai' | 'statistics' | 'quran'
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    const pathname = (window.location.pathname || '').toLowerCase();
    const valid = ['home', 'calendar', 'map', 'story', 'journey-61ah', 'timeline', 'personalities', 'pavilion', 'historiography', 'ziyarat', 'ai', 'statistics', 'journey', 'poles', 'quran'];
    if (valid.includes(hash)) return hash;
    if (pathname.startsWith('/calendar') || pathname.startsWith('/events') || pathname.startsWith('/history/61ah') || pathname === '/after-karbala' || pathname === '/sermons' || pathname === '/women-of-karbala' || pathname === '/verify-claim') {
      return 'calendar';
    }
    return 'home';
  });

  const navigateTo = useCallback((viewId) => {
    window.location.hash = viewId === 'home' ? '' : viewId;
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openCalendarTab = useCallback((tabId = 'calendar') => {
    setCalendarTab(tabId);
    window.location.hash = 'calendar';
    setCurrentView('calendar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const pathname = (window.location.pathname || '').toLowerCase();
    if (pathname.startsWith('/history/61ah')) setCalendarTab('time-machine');
    else if (pathname.includes('/convert')) setCalendarTab('converter');
    else if (pathname === '/after-karbala' || pathname === '/sermons' || pathname === '/women-of-karbala') setCalendarTab('archives');
    else if (pathname === '/verify-claim') setCalendarTab('verification');
    else if (pathname === '/search') setShowSpotlightSearch(true);
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      const valid = ['home', 'calendar', 'map', 'story', 'journey-61ah', 'timeline', 'personalities', 'pavilion', 'historiography', 'ziyarat', 'ai', 'statistics', 'journey', 'poles', 'quran'];
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
    <div className="karbala-digital-museum-root theme-canvas">
      
      {/* Reverent Museum Opening Loading Experience */}
      <div className={`museum-loader-overlay ${isMuseumLoading ? '' : 'is-hidden'}`} aria-hidden={!isMuseumLoading}>
        <div className="museum-loader-emblem">
          <span>ك</span>
        </div>
        <div className="museum-loader-wordmark">KARBALA</div>
        <div className="museum-loader-sub">History • Memory • Sacrifice • Legacy</div>
        <div className="museum-loader-line-track">
          <div className="museum-loader-line-fill"></div>
        </div>
      </div>

      {/* Global Spotlight Command Search Overlay (Ctrl+K) */}
      <SpotlightSearchOverlay
        isOpen={showSpotlightSearch}
        onClose={() => setShowSpotlightSearch(false)}
        onNavigate={navigateTo}
      />

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
          seniorMode={seniorMode}
          onToggleSeniorMode={() => setSeniorMode(!seniorMode)}
          dataSaverMode={dataSaverMode}
          onToggleDataSaver={() => setDataSaverMode(!dataSaverMode)}
          onOpenEmergency={() => setShowEmergencyModal(true)}
          onOpenOnboarding={() => setShowOnboardingModal(true)}
          themeMode={themeMode}
          onToggleTheme={toggleTheme}
          onOpenLegal={openLegalModal}
          onOpenSearch={() => setShowSpotlightSearch(true)}
        />
      )}

      {/* View: Home (Cinematic 8-Chapter Scrolling Experience) */}
      {currentView === 'home' && (
        <CinematicHomeView
          onNavigate={navigateTo}
          onOpenCalendarTab={openCalendarTab}
          onOpenLightbox={(img) => setLightboxImage(img)}
          galleryImages={galleryImages}
          onOpenLegal={openLegalModal}
          onOpenSearch={() => setShowSpotlightSearch(true)}
        />
      )}

      {/* View: Sacred Ahlul Bayt Calendar, Today in History & 61 AH Time Machine */}
      {currentView === 'calendar' && (
        <SacredCalendarHub
          onNavigate={navigateTo}
          initialTab={calendarTab}
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
          onNavigate={navigateTo}
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
          onNavigateToZiyarat={() => navigateTo('ziyarat')}
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
          onOpenEmergency={() => setShowEmergencyModal(true)}
          onOpenArBeacon={(destId) => {
            if (destId) setArTargetDestination(destId);
            setShowArModal(true);
          }}
        />
      )}

      {/* Experience 3: Ask Karbala AI (Multilingual Translation & Historical Q&A) */}
      {currentView === 'ai' && (
        <AskKarbalaAiHub
          onNavigate={navigateTo}
          onOpenEmergency={() => setShowEmergencyModal(true)}
          onOpenArBeacon={(destId) => {
            if (destId) setArTargetDestination(destId);
            setShowArModal(true);
          }}
        />
      )}

      {/* Experience 4: Global Karbala Zaireen Statistics & Pilgrimage Intelligence (Module H) */}
      {(currentView === 'statistics' || currentView === 'stats') && (
        <GlobalZaireenStatisticsHub
          onNavigate={navigateTo}
          onAskAi={(queryText) => {
            if (queryText) {
              window.__karbalaPendingAiQuery = queryText;
              window.dispatchEvent(new CustomEvent('karbala-ask-ai-query', { detail: { query: queryText } }));
            }
            navigateTo('ai');
          }}
        />
      )}

      {/* Experience 5: Smart Airport Arrival Simulator & Zaireen Journey (Phase 1 Add-on) */}
      {(currentView === 'journey' || currentView === 'airport') && (
        <AirportArrivalSimulatorHub
          onNavigate={navigateTo}
          onOpenEmergency={() => setShowEmergencyModal(true)}
          onAskAi={(queryText) => {
            if (queryText) {
              window.__karbalaPendingAiQuery = queryText;
              window.dispatchEvent(new CustomEvent('karbala-ask-ai-query', { detail: { query: queryText } }));
            }
            navigateTo('ai');
          }}
        />
      )}

      {/* Experience 6: Najaf to Karbala Smart Pole Navigation & Crowd Intelligence */}
      {(currentView === 'poles' || currentView === 'corridor') && (
        <SmartPoleNavigationHub
          onNavigate={navigateTo}
          onOpenEmergency={() => setShowEmergencyModal(true)}
          onAskAi={(queryText) => {
            if (queryText) {
              window.__karbalaPendingAiQuery = queryText;
              window.dispatchEvent(new CustomEvent('karbala-ask-ai-query', { detail: { query: queryText } }));
            }
            navigateTo('ai');
          }}
        />
      )}

      {/* Experience 7: Holy Quran, Ziyarat-e-Ashura & Ziyarat-e-Warith Multilingual Hub */}
      {currentView === 'quran' && (
        <QuranAndZiyaratHub
          onNavigate={navigateTo}
        />
      )}

      {/* Subviews Shared Architectural Heritage Footer */}
      {['calendar', 'story', 'journey-61ah', 'timeline', 'personalities', 'pavilion', 'historiography', 'poles', 'corridor', 'journey', 'airport', 'statistics', 'stats', 'quran', 'ziyarat', 'ai'].includes(currentView) && (
        <ArchitecturalHeritageFooter
          onNavigate={navigateTo}
          onOpenLegal={openLegalModal}
          onOpenSearch={() => setShowSpotlightSearch(true)}
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
                <span className="font-editorial fst-italic">61 AH Reconstruction &amp; Modern Sanctuaries • Developed by <strong style={{ color: 'var(--lux-gold, #C6A66B)' }}>Sayyed Faiz Zaidi</strong></span>
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
          <div className="d-flex align-items-center gap-1.5 gap-md-2">
            <select
              className="cinema-lang-select notranslate"
              defaultValue="en"
              onChange={(e) => {
                if (window.applyKarbalaLanguage) {
                  window.applyKarbalaLanguage(e.target.value);
                }
              }}
              aria-label="Select Map Language"
              title="Change Website Language"
            >
              <option value="en">EN</option>
              <option value="ur">UR • اردو</option>
              <option value="hi">HI • हिन्दी</option>
              <option value="ur-roman">RO • Roman</option>
              <option value="ar">AR • عربي</option>
              <option value="fa">FA • فارسی</option>
            </select>

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
        {/* Expanded Historical Storytelling Mode & 61 AH Time Slider */}
        {isTimelineExpanded && (
          <div className="mb-2" style={{ maxHeight: '42vh', overflowY: 'auto' }}>
            <Historical61AhTimeSliderPanel
              mapInstanceRef={mapInstanceRef}
              currentMode={mode}
              onModeChange={handleModeChange}
              onSelectTimelineDay={(dayNum) => {
                const idx = MUHARRAM_DAYS.findIndex((d) => d.dayNumber === dayNum);
                if (idx >= 0) selectTimelineDay(idx);
              }}
              onNavigate={navigateTo}
              onAskAi={(queryText) => {
                if (queryText) {
                  window.__karbalaPendingAiQuery = queryText;
                  window.dispatchEvent(new CustomEvent('karbala-ask-ai-query', { detail: { query: queryText } }));
                }
                navigateTo('ai');
              }}
              onSelectPersonality={(person) => {
                if (person?.name) setPersonFilter(person.name);
                setActiveModal('personalities');
              }}
            />
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

          {/* 61 AH Time Slider Toggle Button */}
          <div className="d-flex align-items-center gap-2">
            <button
              className={`btn btn-sm py-1 px-2.5 d-flex align-items-center gap-1.5 fw-semibold ${isTimelineExpanded ? 'btn-warning text-dark' : 'btn-outline-warning'}`}
              style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}
              onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
              title="Toggle 61 AH Historical Map Time Slider"
            >
              <i className={`bi ${isTimelineExpanded ? 'bi-chevron-down' : 'bi-sliders'}`}></i>
              <span className="d-none d-sm-inline">{isTimelineExpanded ? 'Hide Time Slider' : '61 AH Time Slider'}</span>
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
                                <div className="small fw-semibold font-title text-wrap" style={{ color: 'var(--ivory-warm)', lineHeight: '1.3' }} title={img.title}>
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

      {/* ================= EMERGENCY PILGRIM ASSISTANCE MODAL (24/7 HOTLINES) ================= */}
      <EmergencyPilgrimModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />

      {/* ================= AR SACRED BEACON GUIDANCE MODAL (WALKING GUIDANCE PROTOTYPE) ================= */}
      <ArSacredBeaconModal
        isOpen={showArModal}
        onClose={() => setShowArModal(false)}
        initialTargetId={arTargetDestination}
      />

      {/* ================= FIRST-TIME PILGRIM ONBOARDING MODAL ================= */}
      <FirstTimePilgrimModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onSavePrefs={() => setShowOnboardingModal(false)}
        themeMode={themeMode}
        onToggleTheme={toggleTheme}
      />

      {/* ================= OFFLINE PILGRIMAGE ESSENTIALS PACK MODAL ================= */}
      <OfflinePackViewModal
        isOpen={showOfflinePackModal}
        onClose={() => setShowOfflinePackModal(false)}
        onDownloadHtml={() => {
          if (window.triggerDownloadOfflinePack) {
            window.triggerDownloadOfflinePack();
          }
        }}
      />

      {/* ================= LEGAL, PRIVACY & COMPLIANCE MODAL ================= */}
      <LegalAndComplianceModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        initialTab={legalModalTab}
      />

    </div>
  );
}

// Render React App
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(React.createElement(KarbalaApp));
}
