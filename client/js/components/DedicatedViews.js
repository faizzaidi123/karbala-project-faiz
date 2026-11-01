const { useState, useMemo } = window.React;

import { MUHARRAM_DAYS } from '/js/data/timeline.js';
import { PERSONALITIES } from '/js/data/personalities.js';
import { CERTAINTY_EXPLANATIONS, CERTAINTY_LEVELS } from '/js/data/certainty_explanations.js';
import { PRESENT_DAY_LOCATIONS, HISTORICAL_61AH_LOCATIONS } from '/js/data/locations.js';

// Subview Header Component
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
export function DedicatedStoryView({ onBack, onNavigateToMap }) {
  const storyChapters = [
    {
      num: '01',
      title: 'The Journey from Medina to Mecca',
      arabic: 'الخروج من المدينة إلى مكة المكرمة',
      period: 'Rajab 60 AH – Dhu al-Hijjah 60 AH',
      body: 'Refusing allegiance to Yazid ibn Muawiya, Imam Hussain departed his grandfather\'s city of Medina under the cover of night, reciting the Qur\'anic verse of Moses fleeing Egypt: "So he escaped from there, fearful and watchful..." In Mecca, letters of invitation from the notables of Kufa arrived by the thousands, imploring the Imam to lead them toward righteousness and social justice.',
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
      body: 'Hurr’s cavalry received military orders to force the Imam into an open, desolate plain without fortresses or immediate water access. When the mount of Imam Hussain halted, he enquired of the land\'s ancient name. The locals responded: "al-Taff... al-Aqr... Karbala." Hearing this, the Imam wept and proclaimed: "O Allah, I seek refuge in You from Karb (grief) and Bala (tribulation). This is the anchorage of our mounts, the shedding of our blood, and the place of our graves."',
      citation: 'Al-Bidayah wa al-Nihayah (Ibn Kathir), Vol. 8, p. 175.'
    },
    {
      num: '04',
      title: 'The Encirclement & The Water Siege',
      arabic: 'حصار الماء في كربلاء',
      period: '7 Muharram 61 AH',
      body: 'Umar ibn Sa\'d, having assumed supreme command with a force exceeding 20,000 fighters, was commanded by Ubaydullah ibn Ziyad: "Prevent Hussain and his companions from obtaining a single drop of water, just as Uthman ibn Affan was besieged." Amr ibn al-Hajjaj was deployed with 500 horsemen along Nahr al-Alqami, cutting off the lifeline to the camp.',
      citation: 'Kitab al-Irshad, p. 226; Tarikh al-Tabari, Vol. 5, p. 412.'
    },
    {
      num: '05',
      title: 'The Night of Ashura (Tasu\'a)',
      arabic: 'ليلة العاشر من المحرم',
      period: '9 Muharram 61 AH',
      body: 'On the eve of the tenth, Imam Hussain gathered his family and companions in the central pavilion. He extinguished the lamp so none would feel ashamed, granting them leave to depart into the night. One by one, from Muslim ibn Awsaja to Zuhayr ibn al-Qayn and Abu al-Fadl al-Abbas, the companions rose and declared: "By Allah, we shall never desert you! If we were killed, then revived, then burnt and scattered in the wind seventy times, we would never separate from you."',
      citation: 'Rawdat al-Wa\'izin (al-Fattal al-Naysaburi), p. 183.'
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
export function Dedicated61AhView({ onBack, onNavigateToMap, onOpenLightbox }) {
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
      desc: 'A natural subterranean depression where the ground sloped downward toward the ancient flood basin. Here Imam Hussain made his final solitary stand. The modern Ha\'ir al-Husayni was constructed directly encasing this depression.',
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
export function DedicatedTimelineView({ onBack, onNavigateToMap }) {
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
export function DedicatedPersonalitiesView({ onBack, onNavigateToMap }) {
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
export function DedicatedPavilionView({ onBack, onOpenLightbox, galleryImages = [] }) {
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
export function DedicatedHistoriographyView({ onBack, onNavigateToMap }) {
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
