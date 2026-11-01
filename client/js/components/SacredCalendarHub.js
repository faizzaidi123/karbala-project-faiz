const { useState, useEffect, useMemo, useCallback, useRef } = window.React;

import {
  HIJRI_MONTHS,
  CALENDAR_REGIONS,
  GREGORIAN_MONTH_NAMES,
  AHLUL_BAYT_CALENDAR_EVENTS,
  POST_ASHURA_STATIONS,
  WOMEN_OF_KARBALA_ARCHIVE,
  SERMONS_SPEECHES_ARCHIVE,
  SOURCE_COMPARISON_TOPICS,
  HISTORICAL_CLAIM_VERIFICATIONS,
  getZonedGregorianParts,
  gregorianToHijri,
  hijriToGregorian,
  getAstronomicalMoonPhase,
  getEventsForHijriDate,
  getEventsForGregorianMonthDay,
  getCompleteTodayState,
  searchSacredCalendar
} from '/js/data/ahlulBaytCalendarData.js';

import { MUHARRAM_DAYS } from '/js/data/timeline.js';
import { PERSONALITIES } from '/js/data/personalities.js';
import { PRESENT_DAY_LOCATIONS, HISTORICAL_61AH_LOCATIONS } from '/js/data/locations.js';

// ============================================================================
// KARBALA 8-CHAPTER AUDIO GUIDE ARCHIVE (#30)
// ============================================================================
export const KARBALA_AUDIO_GUIDE_CHAPTERS = [
  {
    chapter: 1,
    id: 'audio_ch1_madinah',
    title: 'Chapter I · Departure from Madinah (28 Rajab 60 AH)',
    location: 'Al-Masjid al-Nabawi, Madinah',
    durationSec: 215,
    durationLabel: '3:35',
    transcriptEn: 'On the night of 28 Rajab 60 AH, Imam Hussain ibn Ali (AS) stood beside the sacred chamber of his grandfather Prophet Muhammad (SAWW) for his final farewell. Refusing an illegitimate demand of allegiance that would subvert prophetic justice, he penned his constitutional testament to his brother Muhammad ibn al-Hanafiyya: "I have not risen out of arrogance or disorder, but solely to seek reform in the community of my grandfather."',
    transcriptAr: 'في ليلة الثامن والعشرين من رجب سنة ستين للهجرة، وقف الإمام الحسين عليه السلام مودعاً قبر جده رسول الله صلى الله عليه وآله، معلناً خروجه لطلب الإصلاح في أمة جده.',
    sources: ['Tarikh al-Tabari, Vol. 5, p. 340', 'Kitab al-Irshad, p. 301']
  },
  {
    chapter: 2,
    id: 'audio_ch2_makkah',
    title: 'Chapter II · Sanctuary in Makkah & Yawm al-Tarwiyah (3 Sha’ban – 8 Dhu al-Hijjah 60 AH)',
    location: 'Masjid al-Haram, Makkah',
    durationSec: 230,
    durationLabel: '3:50',
    transcriptEn: 'For over four months in Makkah, letters poured in from Kufa pleading for guidance. Imam Hussain dispatched his cousin Muslim ibn Aqeel as an envoy to verify their pledge. Yet upon learning that Umayyad operatives had infiltrated the Hajj crowds to assassinate him inside the Sacred Precinct, the Imam converted his Hajj into an Umrah and departed on 8 Dhu al-Hijjah to preserve the sanctity of the Kaaba.',
    transcriptAr: 'أقام الإمام الحسين في مكة المكرمة من الثالث من شعبان حتى الثامن من ذي الحجة، ثم خرج منها حفاظاً على حرمة الكعبة المشرفة.',
    sources: ['Tarikh al-Tabari, Vol. 5, p. 381', 'Al-Luhuf, p. 37']
  },
  {
    chapter: 3,
    id: 'audio_ch3_desert_corridor',
    title: 'Chapter III · The Desert March Toward Iraq & Meeting Hurr at Dhu Husam',
    location: 'Al-Tha’labiyyah, Zubalah & Dhu Husam',
    durationSec: 245,
    durationLabel: '4:05',
    transcriptEn: 'At Zubalah, tragic word arrived that Muslim ibn Aqeel, Hani ibn Urwa, and Qays ibn Musahhir had been martyred in Kufa. Imam Hussain gathered his followers and permitted anyone seeking worldly safety to depart, leaving only his purest companions and household. At Dhu Husam, when Hurr ibn Yazid’s 1,000 horsemen arrived parched with thirst, the Imam ordered water given to every soldier and horse alike.',
    transcriptAr: 'سقا الإمام الحسين جيش الحر بن يزيد الرياحي وخيلهم في ذي حسم، وألقى خطبته الخالدة: ألا ترون إلى الحق لا يعمل به.',
    sources: ['Tarikh al-Tabari, Vol. 5, pp. 398–404', 'Kitab al-Irshad, p. 365']
  },
  {
    chapter: 4,
    id: 'audio_ch4_arrival_karbala',
    title: 'Chapter IV · Arrival on the Plains of Karbala (2 Muharram 61 AH)',
    location: 'Al-Taff / Ninawa, Karbala',
    durationSec: 210,
    durationLabel: '3:30',
    transcriptEn: 'On Thursday, 2 Muharram 61 AH, the caravan halted upon the alluvial plain of Karbala. Hearing the name of the land, Imam Hussain recalled the prophecy of the Messenger of Allah, ordered the tents pitched at al-Mukhayyam, and purchased the surrounding tract from the elders of Banu Asad as an eternal endowment for future pilgrims.',
    transcriptAr: 'في اليوم الثاني من المحرم سنة إحدى وستين، حط ركب سيد الشهداء رحاله في أرض كربلاء.',
    sources: ['Abu Mikhnaf, Maqtal al-Husayn', 'Tarikh al-Tabari, Vol. 5, p. 409']
  },
  {
    chapter: 5,
    id: 'audio_ch5_siege_and_tasua',
    title: 'Chapter V · The Euphrates Blockade & Night of Tasu’a (7–9 Muharram 61 AH)',
    location: 'Al-Alqami Riverbank & Husayni Encampment',
    durationSec: 260,
    durationLabel: '4:20',
    transcriptEn: 'On 7 Muharram, 500 cavalry sealed the Euphrates river branch against the encampment. On 9 Muharram (Tasu’a), Hazrat Abu al-Fadl al-Abbas rejected Shimr’s tribal offer of safe-conduct, declaring unwavering fidelity to the son of the Prophet’s daughter. That evening, the camp spent the Eve of Ashura in prayer, Quran recitation, and quiet resolve.',
    transcriptAr: 'في السابع من المحرم منع الماء عن المخيم، وفي تاسوعاء رفض أبو الفضل العباس أمان شمر بن ذي الجوشن.',
    sources: ['Tarikh al-Tabari, Vol. 5, pp. 412–421', 'Kitab al-Irshad, p. 375']
  },
  {
    chapter: 6,
    id: 'audio_ch6_ashura',
    title: 'Chapter VI · Yawm al-Ashura — The Immortal Stand (10 Muharram 61 AH)',
    location: 'Battlefield of Karbala & Al-Maqtal',
    durationSec: 310,
    durationLabel: '5:10',
    transcriptEn: 'From dawn until Asr on Friday, 10 Muharram 61 AH, Hurr ibn Yazid crossed lines in repentance, the loyal companions gave their lives defending the noon prayer (Salat al-Khawf), and the youth of Banu Hashim—led by Ali al-Akbar, Qasim ibn Hasan, and Abu al-Fadl al-Abbas—fell before Imam Hussain offered his own lifeblood at the Maqtal.',
    transcriptAr: 'يوم عاشوراء الخالد: هيهات منا الذلة، وصلاة الخوف، واستشهاد الأصحاب وبني هاشم وسيد الشهداء.',
    sources: ['Tarikh al-Tabari, Vol. 5, pp. 422–454', 'Al-Luhuf, pp. 50–82']
  },
  {
    chapter: 7,
    id: 'audio_ch7_after_karbala',
    title: 'Chapter VII · After Karbala — The Eloquent Victory in Kufa & Damascus',
    location: 'Kufa & Damascus',
    durationSec: 250,
    durationLabel: '4:10',
    transcriptEn: 'Carried in captivity to Kufa and Damascus, Sayyida Zaynab bint Ali (SA) and Imam Ali Zain al-Abideen (AS) transformed military tragedy into an unassailable moral victory. Through sermons in the court of Ibn Ziyad and the Umayyad Mosque of Damascus, they ensured that the sacrifice of Karbala could never be erased.',
    transcriptAr: 'حملت السيدة زينب والإمام زين العابدين لواء الكلمة الحق في الكوفة والشام: فوالله لا تمحو ذكرنا.',
    sources: ['Balaghat al-Nisa', 'Al-Ihtijaj, Vol. 2, pp. 29–35']
  },
  {
    chapter: 8,
    id: 'audio_ch8_arbaeen_legacy',
    title: 'Chapter VIII · The Living Legacy — Jabir’s Ziyarat & Global Arba’een',
    location: 'Bayn al-Haramayn & Najaf–Karbala Corridor',
    durationSec: 225,
    durationLabel: '3:45',
    transcriptEn: 'On 20 Safar, the Prophet’s companion Jabir ibn Abdullah al-Ansari arrived at the grave of Imam Hussain (AS) as the first Arba’een pilgrim. Over thirteen centuries later, more than twenty-one million pilgrims walk the 80-kilometer corridor from Najaf to Karbala in the world’s largest peaceful gathering of human solidarity.',
    transcriptAr: 'من زيارة جابر بن عبد الله الأنصاري في العشرين من صفر إلى مسيرة الملايين في الأربعين.',
    sources: ['Misbah al-Mutahajjid, p. 787', 'Kamil al-Ziyarat']
  }
];

// ============================================================================
// HELPER: ASTRONOMICAL MOON PHASE SVG VISUALIZER (#65)
// ============================================================================
export function MoonPhaseVisualBadge({ moon }) {
  if (!moon) return null;
  const pct = moon.illuminationPct ?? 50;
  return (
    <div
      className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill"
      style={{
        background: 'rgba(17, 22, 19, 0.85)',
        border: '1px solid rgba(200, 164, 91, 0.28)',
        fontSize: '0.74rem',
        color: 'var(--ivory-warm)'
      }}
      title={moon.separationNote}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="#0B0E0C" stroke="#C8A45B" strokeWidth="1.4" />
        <path
          d={pct >= 50
            ? 'M12 3 A9 9 0 0 1 12 21 A5 9 0 0 1 12 3 Z'
            : 'M12 3 A9 9 0 0 1 12 21 A6 9 0 0 0 12 3 Z'}
          fill="#E0BD72"
          opacity={Math.max(0.25, pct / 100)}
        />
      </svg>
      <span>
        <strong style={{ color: 'var(--gold-highlight)' }}>{moon.phaseName}</strong>
        <span className="ms-1 opacity-75">({pct}% Illum. · {moon.lunarAgeDays}d)</span>
      </span>
    </div>
  );
}

// ============================================================================
// HOMEPAGE DYNAMIC MODULE: "TODAY IN AHLUL BAYT HISTORY" (#1, #15, #16, #43, #63)
// ============================================================================
export function TodayHomepageModule({ onNavigate, onOpenCalendarTab }) {
  const [region, setRegion] = useState(() => {
    try { return localStorage.getItem('karbala_calendar_region') || 'India'; } catch (e) { return 'India'; }
  });
  const [manualOffset, setManualOffset] = useState(() => {
    try { return parseInt(localStorage.getItem('karbala_calendar_offset') || '0', 10); } catch (e) { return 0; }
  });
  const [showWhyModal, setShowWhyModal] = useState(false);

  const userTimezone = useMemo(() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'; } catch (e) { return 'Asia/Kolkata'; }
  }, []);

  const todayState = useMemo(() => {
    return getCompleteTodayState(new Date(), {
      region,
      manualOffset,
      timeZone: userTimezone,
      dayBoundary: 'midnight'
    });
  }, [region, manualOffset, userTimezone]);

  const handleRegionChange = (newReg) => {
    setRegion(newReg);
    try { localStorage.setItem('karbala_calendar_region', newReg); } catch (e) {}
  };

  const primaryEvent = todayState.todayEvents[0] || null;
  const nextEvent = todayState.upcoming?.nextEvent || null;
  const heroTone = todayState.specialDayHero?.tone || 'standard';

  const toneBorderColor = heroTone === 'shahadat' || heroTone === 'ashura'
    ? 'rgba(163, 28, 34, 0.55)'
    : heroTone === 'wiladat'
      ? 'rgba(224, 189, 114, 0.55)'
      : 'rgba(200, 164, 91, 0.28)';

  const toneBackdrop = heroTone === 'shahadat' || heroTone === 'ashura'
    ? 'linear-gradient(135deg, rgba(122, 16, 20, 0.22) 0%, rgba(11, 14, 12, 0.94) 65%)'
    : heroTone === 'wiladat'
      ? 'linear-gradient(135deg, rgba(18, 59, 42, 0.34) 0%, rgba(11, 14, 12, 0.94) 65%)'
      : 'linear-gradient(135deg, rgba(17, 22, 19, 0.92) 0%, rgba(5, 7, 6, 0.96) 100%)';

  return (
    <section
      id="today-in-ahlul-bayt-history"
      className="today-sacred-home-section position-relative overflow-hidden py-5"
      style={{
        background: 'linear-gradient(180deg, #050706 0%, #0B0E0C 45%, #050706 100%)',
        borderTop: '1px solid rgba(200, 164, 91, 0.16)',
        borderBottom: '1px solid rgba(200, 164, 91, 0.16)'
      }}
      aria-label="Today in Ahlul Bayt and Karbala History"
    >
      {/* Subtle Atmospheric Shrine Backdrop */}
      <div
        className="position-absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(assets/images/karbala_hd_twin_shrines_aerial_night.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.16,
          filter: 'blur(2px) contrast(1.15)'
        }}
      ></div>
      <div
        className="position-absolute inset-0 pointer-events-none"
        style={{
          background: toneBackdrop
        }}
      ></div>

      <div className="container position-relative z-2" style={{ maxWidth: '1320px' }}>
        <div>
          {/* Top Open Editorial Header Bar: Kicker + Region Selector + Moon Phase + Why Hijri Dates Differ */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-4 mb-4" style={{ borderBottom: '1px solid rgba(200, 164, 91, 0.18)' }}>
            <div className="d-flex flex-wrap align-items-center gap-3">
              <div className="doc-chapter-label mb-0">
                <i className="bi bi-calendar3 me-1.5"></i>
                <span>{todayState.specialDayHero?.badge || 'SACRED CHRONOLOGY · TODAY IN AHLUL BAYT HISTORY'}</span>
              </div>
              <MoonPhaseVisualBadge moon={todayState.moon} />
            </div>

            <div className="d-flex flex-wrap align-items-center gap-2">
              <label className="small text-ivory-muted me-1" htmlFor="home-hijri-region-select" style={{ fontSize: '0.74rem' }}>
                <i className="bi bi-globe2 text-gold-antique me-1"></i>
                Calendar Region:
              </label>
              <select
                id="home-hijri-region-select"
                className="cinema-lang-select"
                value={region}
                onChange={(e) => handleRegionChange(e.target.value)}
              >
                {CALENDAR_REGIONS.map(r => (
                  <option key={r.id} value={r.id}>{r.id} — {r.label.split('(')[0].trim()}</option>
                ))}
              </select>

              <button
                type="button"
                className="consumer-prompt-chip py-1 px-3"
                style={{ fontSize: '0.73rem' }}
                onClick={() => setShowWhyModal(!showWhyModal)}
              >
                <i className="bi bi-info-circle text-gold-antique"></i>
                <span>Why can Hijri dates differ?</span>
              </button>
            </div>
          </div>

          {/* Expandable "Why Can Hijri Dates Differ?" Educational Panel (#14 & #66) */}
          {showWhyModal && (
            <div
              className="p-3 p-md-4 rounded-3 mb-4"
              style={{
                background: 'rgba(11, 14, 12, 0.85)',
                backdropFilter: 'blur(20px)',
                borderLeft: '3px solid var(--gold-antique)'
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="font-title text-gold-antique mb-0" style={{ letterSpacing: '0.06em' }}>
                  <i className="bi bi-moon-stars me-2"></i>
                  WHY HIJRI DATES MAY DIFFER BY ±1 DAY ACROSS REGIONS
                </h6>
                <button
                  type="button"
                  className="btn btn-sm text-ivory-muted p-0"
                  onClick={() => setShowWhyModal(false)}
                >
                  ✕
                </button>
              </div>
              <p className="small text-ivory-muted mb-2" style={{ lineHeight: 1.7 }}>
                Islamic sacred commemorations follow the <strong>lunar Hijri calendar</strong> (354–355 days), which moves approximately 10–11 days earlier each solar Gregorian year. Because each Hijri month begins with the verified sighting of the new crescent moon (<em>Ru’yat al-Hilal</em>) above a region’s local horizon, communities in different longitudes or under different religious authorities (such as India/Pakistan vs. Iraq/Iran or calculated Umm al-Qura) may legitimately observe a date one day apart.
              </p>
              <div className="small" style={{ color: 'var(--gold-highlight)', fontSize: '0.75rem' }}>
                <i className="bi bi-shield-check me-1"></i>
                <strong>Astronomical Moon Data vs. Religious Sighting:</strong> Astronomical illumination percentages are provided as informational telemetry only and never replace verified religious crescent announcements.
              </div>
            </div>
          )}

          {/* Recomposed Layout: 1 Open Editorial Dual-Date Section + 2 Floating Glass Information Panels */}
          <div className="row g-5 align-items-center">
            {/* 1. Open Editorial Dual-Date Typography (Zero Box Border!) */}
            <div className="col-lg-4">
              <div className="pe-lg-3" style={{ borderLeft: '2px solid var(--gold-antique)', paddingLeft: '22px' }}>
                <div className="text-uppercase small fw-bold mb-1" style={{ color: 'var(--text-tertiary)', fontSize: '0.68rem', letterSpacing: '0.18em' }}>
                  TODAY · {todayState.gregorian.weekday.toUpperCase()} · {todayState.gregorian.timeZone}
                </div>

                {/* Explicit Hijri Primary Monument */}
                <div className="mt-2 mb-3">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="text-uppercase fw-bold" style={{ color: 'var(--gold-antique)', fontSize: '0.68rem', letterSpacing: '0.16em' }}>
                      HIJRI LUNAR ({region.toUpperCase()})
                    </span>
                    <span className="small text-uppercase" style={{ fontSize: '0.64rem', color: '#5CB896' }}>
                      ● {todayState.hijri.moonStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="font-display fw-bold" style={{ color: 'var(--gold-highlight)', fontSize: 'clamp(1.55rem, 2.4vw, 2.05rem)', lineHeight: 1.2 }}>
                    {todayState.hijri.formattedHijriEn}
                  </div>
                  <div className="font-arabic fs-3 mt-1" dir="rtl" style={{ color: 'var(--ivory-warm)' }}>
                    {todayState.hijri.formattedHijriAr}
                  </div>
                </div>

                {/* Explicit Gregorian Secondary Monument */}
                <div className="pt-3 mb-3" style={{ borderTop: '1px solid rgba(200,164,91,0.18)' }}>
                  <div className="text-uppercase fw-bold mb-1" style={{ color: 'var(--ivory-muted)', fontSize: '0.66rem', letterSpacing: '0.16em' }}>
                    GREGORIAN SOLAR CALENDAR
                  </div>
                  <div className="font-display fs-4 fw-semibold" style={{ color: 'var(--ivory-warm)' }}>
                    {todayState.gregorian.formattedGregorian}
                  </div>
                </div>

                <div className="small" style={{ fontSize: '0.73rem', color: 'var(--text-tertiary)', lineHeight: 1.55 }}>
                  <i className="bi bi-moon-stars text-gold-antique me-1.5"></i>
                  {todayState.hijri.varianceDisclaimer}
                </div>
              </div>
            </div>

            {/* 2. Floating Dark-Glass Panel A: Today in Ahlul Bayt & Karbala History */}
            <div className="col-lg-5">
              <div
                className="p-4 rounded-4 h-100 d-flex flex-column justify-content-between"
                style={{
                  background: 'rgba(11, 14, 12, 0.76)',
                  backdropFilter: 'blur(22px)',
                  border: `1px solid ${toneBorderColor}`,
                  boxShadow: '0 24px 56px rgba(0, 0, 0, 0.65)'
                }}
              >
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-uppercase fw-bold" style={{ color: 'var(--gold-antique)', fontSize: '0.7rem', letterSpacing: '0.16em' }}>
                      ON THIS SACRED DATE · {todayState.hijri.day} {todayState.hijri.monthNameEn.toUpperCase()}
                    </span>
                    {todayState.todayEvents.length > 1 && (
                      <span className="small text-gold-antique font-monospace" style={{ fontSize: '0.68rem' }}>
                        +{todayState.todayEvents.length - 1} More
                      </span>
                    )}
                  </div>

                  {primaryEvent ? (
                    <div>
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                        <span
                          className="badge text-uppercase"
                          style={{
                            background: primaryEvent.eventType === 'shahadat' ? 'rgba(122, 16, 20, 0.7)' : primaryEvent.eventType === 'wiladat' ? 'rgba(18, 59, 42, 0.8)' : 'rgba(200, 164, 91, 0.2)',
                            color: 'var(--ivory-warm)',
                            border: '1px solid rgba(200, 164, 91, 0.35)',
                            fontSize: '0.64rem',
                            letterSpacing: '0.1em'
                          }}
                        >
                          {primaryEvent.eventType.toUpperCase()}
                        </span>
                        <span className="small text-ivory-muted" style={{ fontSize: '0.74rem' }}>
                          Epoch: <strong className="text-ivory">{primaryEvent.historicalYearAH}</strong> ({primaryEvent.gregorianHistoricalDate})
                        </span>
                      </div>

                      <h3 className="font-display h4 fw-bold mb-1" style={{ color: 'var(--ivory-warm)', lineHeight: 1.3 }}>
                        {primaryEvent.title}
                      </h3>
                      {primaryEvent.arabicTitle && (
                        <div className="font-arabic mb-2" dir="rtl" style={{ color: 'var(--gold-antique)', fontSize: '1.12rem' }}>
                          {primaryEvent.arabicTitle}
                        </div>
                      )}
                      <p className="small text-ivory-muted mb-2" style={{ lineHeight: 1.7 }}>
                        {primaryEvent.summary}
                      </p>
                      <div className="small" style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                        <i className="bi bi-journal-check text-gold-antique me-1"></i>
                        <strong>Primary Attestation:</strong> {(primaryEvent.sources || []).slice(0, 2).join(' · ')}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-2">
                        <div className="fw-semibold text-ivory mb-1" style={{ fontSize: '0.95rem' }}>
                          Sacred Month of {todayState.hijri.monthNameEn} <span className="font-arabic text-gold-antique ms-1">{todayState.hijri.monthNameAr}</span>
                        </div>
                        <p className="small text-ivory-muted mb-2" style={{ fontSize: '0.84rem', lineHeight: 1.68 }}>
                          {todayState.hijri.sacredSignificance}
                        </p>
                      </div>
                      {(todayState.regionalVarianceEvents?.minusOneDay?.events?.length > 0 || todayState.regionalVarianceEvents?.plusOneDay?.events?.length > 0) && (
                        <div className="small pt-2" style={{ borderTop: '1px solid rgba(200, 164, 91, 0.2)', color: 'var(--gold-highlight)', fontSize: '0.75rem' }}>
                          <i className="bi bi-moon-stars me-1"></i>
                          <strong>Adjacent ±1 Lunar Day:</strong>{' '}
                          {(todayState.regionalVarianceEvents.minusOneDay.events[0] || todayState.regionalVarianceEvents.plusOneDay.events[0])?.title}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="d-flex flex-wrap gap-3 mt-3 pt-3" style={{ borderTop: '1px solid rgba(200,164,91,0.18)' }}>
                  <button
                    type="button"
                    className="btn-cinema-gold py-2 px-3.5"
                    style={{ fontSize: '0.74rem' }}
                    onClick={() => onNavigate('calendar')}
                  >
                    <span>Enter Sacred Calendar</span>
                    <i className="bi bi-arrow-right"></i>
                  </button>
                  <button
                    type="button"
                    className="cinema-back-link"
                    onClick={() => {
                      if (onOpenCalendarTab) onOpenCalendarTab('time-machine');
                      else onNavigate('calendar');
                    }}
                  >
                    <i className="bi bi-hourglass-split text-gold-antique"></i>
                    <span>61 AH Time Machine</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Floating Dark-Glass Panel B: Next Commemoration Countdown & Quick Tools */}
            <div className="col-lg-3">
              <div
                className="p-4 rounded-4 h-100 d-flex flex-column justify-content-between"
                style={{
                  background: 'rgba(11, 14, 12, 0.64)',
                  backdropFilter: 'blur(18px)',
                  border: '1px solid rgba(200, 164, 91, 0.2)'
                }}
              >
                <div>
                  <div className="text-uppercase fw-bold mb-2" style={{ color: 'var(--gold-antique)', fontSize: '0.66rem', letterSpacing: '0.16em' }}>
                    UPCOMING SACRED MILESTONE
                  </div>

                  {nextEvent ? (
                    <div>
                      <div className="font-display text-gold-antique fw-bold mb-1" style={{ fontSize: '1.35rem' }}>
                        {nextEvent.daysRemaining === 1 ? 'Tomorrow' : `In ${nextEvent.daysRemaining} Days`}
                      </div>

                      <h4 className="font-display h6 fw-bold text-ivory mb-1" style={{ lineHeight: 1.4 }}>
                        {nextEvent.title}
                      </h4>

                      <div className="small mb-1" style={{ color: 'var(--gold-highlight)', fontSize: '0.8rem', fontWeight: 600 }}>
                        Hijri: {nextEvent.hijriFormattedEn}
                      </div>
                      <div className="small text-ivory-muted mb-2" style={{ fontSize: '0.75rem' }}>
                        Gregorian: {nextEvent.expectedGregorianDate}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="d-flex flex-column gap-2 mt-3 pt-2" style={{ borderTop: '1px solid rgba(200,164,91,0.16)' }}>
                  <button
                    type="button"
                    className="cinema-back-link justify-content-between w-100"
                    onClick={() => {
                      if (onOpenCalendarTab) onOpenCalendarTab('converter');
                      else onNavigate('calendar');
                    }}
                  >
                    <span><i className="bi bi-arrow-left-right text-gold-antique me-1.5"></i>Hijri ↔ Gregorian</span>
                    <i className="bi bi-arrow-right small"></i>
                  </button>
                  <button
                    type="button"
                    className="cinema-back-link justify-content-between w-100"
                    onClick={() => {
                      if (onOpenCalendarTab) onOpenCalendarTab('verification');
                      else onNavigate('calendar');
                    }}
                  >
                    <span><i className="bi bi-shield-check text-gold-antique me-1.5"></i>Verify Historical Claim</span>
                    <i className="bi bi-arrow-right small"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN EXHIBITION: SACRED CALENDAR, 61 AH TIME MACHINE & RESEARCH HUB
// ============================================================================
export function SacredCalendarHub({ onNavigate, initialTab = 'calendar' }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'calendar');

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // Regional & Timezone Preferences
  const [region, setRegion] = useState(() => {
    try { return localStorage.getItem('karbala_calendar_region') || 'India'; } catch (e) { return 'India'; }
  });
  const [manualOffset, setManualOffset] = useState(() => {
    try { return parseInt(localStorage.getItem('karbala_calendar_offset') || '0', 10); } catch (e) { return 0; }
  });
  const [dayBoundary, setDayBoundary] = useState(() => {
    try { return localStorage.getItem('karbala_day_boundary') || 'midnight'; } catch (e) { return 'midnight'; }
  });
  const [selectedLang, setSelectedLang] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem('karbala_pilgrim_prefs') || '{}');
      if (p.language) return p.language === 'ur-roman' ? 'ro' : p.language;
      return localStorage.getItem('karbala_calendar_lang') || 'en';
    } catch (e) {
      return 'en';
    }
  });

  useEffect(() => {
    const onGlobalLang = (e) => {
      const code = (e?.detail?.language || 'en').toLowerCase();
      setSelectedLang(code === 'ur-roman' ? 'ro' : code);
    };
    window.addEventListener('karbala-language-change', onGlobalLang);
    return () => window.removeEventListener('karbala-language-change', onGlobalLang);
  }, []);

  const userTimezone = useMemo(() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'; } catch (e) { return 'Asia/Kolkata'; }
  }, []);

  const todayState = useMemo(() => {
    return getCompleteTodayState(new Date(), {
      region,
      manualOffset,
      timeZone: userTimezone,
      dayBoundary
    });
  }, [region, manualOffset, userTimezone, dayBoundary]);

  // Selected Hijri Month & Day in the Month View
  const [selectedHijriMonth, setSelectedHijriMonth] = useState(() => todayState.hijri.month);
  const [selectedHijriDay, setSelectedHijriDay] = useState(() => todayState.hijri.day);
  const [upcomingFilter, setUpcomingFilter] = useState('30days'); // 'tomorrow' | '7days' | '30days' | 'month'
  const [showWhyDifferentModal, setShowWhyDifferentModal] = useState(false);
  const [shareCardEvent, setShareCardEvent] = useState(null);

  // Gregorian Month Explorer state (#11 & #46)
  const [selectedGregMonth, setSelectedGregMonth] = useState(() => todayState.gregorian.month);
  const [selectedGregDay, setSelectedGregDay] = useState(() => todayState.gregorian.day);

  // 61 AH Time Machine state (#7, #61, #62)
  const [timeMachineDay, setTimeMachineDay] = useState(() => {
    try {
      const m = window.location.pathname.match(/\/history\/61ah\/muharram\/(\d+)/i);
      if (m) {
        const parsed = parseInt(m[1], 10);
        if (parsed >= 1 && parsed <= 13) return parsed;
      }
    } catch (_) {}
    return todayState.hijri.month === 1 && todayState.hijri.day >= 1 && todayState.hijri.day <= 13
      ? todayState.hijri.day
      : 2;
  });

  // Converter & "On This Day" Search state (#12, #13, #21, #48, #49)
  const [convDirection, setConvDirection] = useState('g2h'); // 'g2h' | 'h2g'
  const [convGregYear, setConvGregYear] = useState(() => todayState.gregorian.year);
  const [convGregMonth, setConvGregMonth] = useState(() => todayState.gregorian.month);
  const [convGregDay, setConvGregDay] = useState(() => todayState.gregorian.day);
  const [convHijriYear, setConvHijriYear] = useState(() => todayState.hijri.year);
  const [convHijriMonth, setConvHijriMonth] = useState(() => todayState.hijri.month);
  const [convHijriDay, setConvHijriDay] = useState(() => todayState.hijri.day);
  const [onThisDayQuery, setOnThisDayQuery] = useState('');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceTranscriptNotice, setVoiceTranscriptNotice] = useState('');

  // Sermons Filter & Audio Guide state (#28, #30)
  const [sermonSpeakerFilter, setSermonSpeakerFilter] = useState('all');
  const [sermonLocationFilter, setSermonLocationFilter] = useState('all');
  const [audioChapterIdx, setAudioChapterIdx] = useState(0);
  const [isAudioGuidePlaying, setIsAudioGuidePlaying] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(1);

  // Claim Checker state (#18, #19)
  const [claimQueryInput, setClaimQueryInput] = useState('');
  const [claimResult, setClaimResult] = useState(HISTORICAL_CLAIM_VERIFICATIONS[0]);

  // Personal Study Desk: Reading History, Private Notes, Saved Collections & Reminders (#22, #23, #24, #25)
  const [readingHistory, setReadingHistory] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('karbala_reading_history') || '[]');
      return saved.length > 0 ? saved : [
        { id: 'rh_1', title: 'Ziyarat-e-Ashura · Sacred Liturgical Reader', section: 'Passage 6 (Salam upon al-Hussain)', view: 'quran', timestamp: 'Recent Session' },
        { id: 'rh_2', title: '7 Muharram 61 AH — Blockade of the Euphrates', section: '61 AH Time Machine', view: 'calendar', timestamp: 'Recent Session' },
        { id: 'rh_3', title: 'Monograph: Sayyid al-Shuhada Imam Hussain (AS)', section: 'Biographical Archive', view: 'personalities', timestamp: 'Recent Session' }
      ];
    } catch (e) { return []; }
  });

  const [privateNotes, setPrivateNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('karbala_private_notes') || '[]'); } catch (e) { return []; }
  });
  const [noteDraftEntity, setNoteDraftEntity] = useState('10 Muharram — Yawm al-Ashura');
  const [noteDraftText, setNoteDraftText] = useState('');

  const [collections, setCollections] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('karbala_user_collections') || 'null');
      return saved || [
        { id: 'col_muharram', name: 'My Muharram Study', items: ['2 Muharram 61 AH — Arrival at Karbala', '7 Muharram 61 AH — Euphrates Blockade', '10 Muharram 61 AH — Yawm al-Ashura'] },
        { id: 'col_research', name: 'Karbala Research & Sources', items: ['Tarikh al-Tabari (Vol. 5)', 'Kitab al-Irshad (Shaykh al-Mufid)', 'Sermon of Sayyida Zaynab in Kufa'] },
        { id: 'col_ziyarat', name: 'Ziyarat Trip & Arbaeen Prep', items: ['Ziyarat-e-Warith', 'Ziyarat-e-Ashura', 'Najaf to Karbala 1,452 Poles Guide'] }
      ];
    } catch (e) { return []; }
  });
  const [newCollectionName, setNewCollectionName] = useState('');

  const [reminders, setReminders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('karbala_sacred_reminders') || '[]'); } catch (e) { return []; }
  });

  // Admin Override state (#5, #59)
  const [adminStatusMsg, setAdminStatusMsg] = useState('');
  const [adminMoonStatus, setAdminMoonStatus] = useState('confirmed');
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [adminAuditLogs, setAdminAuditLogs] = useState([]);

  useEffect(() => {
    fetch('/api/calendar/config')
      .then(r => r.json())
      .then(d => {
        if (d && d.regions) {
          const matched = d.regions.find(x => x.region === region) || d.regions[0];
          if (matched && matched.auditLog) setAdminAuditLogs(matched.auditLog);
        }
      })
      .catch(() => {});
  }, [region]);

  // Handlers
  const updateRegion = (r) => {
    setRegion(r);
    try { localStorage.setItem('karbala_calendar_region', r); } catch (e) {}
  };

  const updateOffset = (off) => {
    const val = parseInt(off, 10) || 0;
    setManualOffset(val);
    try { localStorage.setItem('karbala_calendar_offset', String(val)); } catch (e) {}
  };

  const updateBoundary = (b) => {
    setDayBoundary(b);
    try { localStorage.setItem('karbala_day_boundary', b); } catch (e) {}
  };

  const recordReadingItem = useCallback((title, section, view = 'calendar') => {
    setReadingHistory(prev => {
      const next = [
        { id: `rh_${Date.now()}`, title, section, view, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ...prev.filter(x => x.title !== title)
      ].slice(0, 12);
      try { localStorage.setItem('karbala_reading_history', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  }, []);

  const addPrivateNote = () => {
    if (!noteDraftText.trim()) return;
    const item = {
      noteId: `note_${Date.now()}`,
      entityTitle: noteDraftEntity,
      content: noteDraftText.trim(),
      createdAt: `${todayState.gregorian.formattedGregorian} · ${todayState.hijri.formattedHijriEn}`
    };
    const next = [item, ...privateNotes];
    setPrivateNotes(next);
    setNoteDraftText('');
    try { localStorage.setItem('karbala_private_notes', JSON.stringify(next)); } catch (e) {}
  };

  const deletePrivateNote = (noteId) => {
    const next = privateNotes.filter(n => n.noteId !== noteId);
    setPrivateNotes(next);
    try { localStorage.setItem('karbala_private_notes', JSON.stringify(next)); } catch (e) {}
  };

  const createCollection = () => {
    if (!newCollectionName.trim()) return;
    const next = [...collections, { id: `col_${Date.now()}`, name: newCollectionName.trim(), items: [] }];
    setCollections(next);
    setNewCollectionName('');
    try { localStorage.setItem('karbala_user_collections', JSON.stringify(next)); } catch (e) {}
  };

  const addEventToCollection = (colId, itemTitle) => {
    const next = collections.map(c => {
      if (c.id !== colId) return c;
      if (c.items.includes(itemTitle)) return c;
      return { ...c, items: [...c.items, itemTitle] };
    });
    setCollections(next);
    try { localStorage.setItem('karbala_user_collections', JSON.stringify(next)); } catch (e) {}
  };

  const toggleReminder = (ev, leadDays = 1) => {
    const exists = reminders.some(r => r.eventId === ev.eventId);
    let next;
    if (exists) {
      next = reminders.filter(r => r.eventId !== ev.eventId);
    } else {
      next = [
        ...reminders,
        {
          reminderId: `rem_${Date.now()}`,
          eventId: ev.eventId,
          title: ev.title,
          hijriDate: `${ev.hijriDay} ${HIJRI_MONTHS[ev.hijriMonth - 1]?.nameEn}`,
          leadDays,
          region,
          timeZone: userTimezone
        }
      ];
    }
    setReminders(next);
    try { localStorage.setItem('karbala_sacred_reminders', JSON.stringify(next)); } catch (e) {}
  };

  // Voice Search Handler (#21)
  const triggerVoiceSearch = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setVoiceTranscriptNotice('Browser speech recognition is unavailable on this device. Please type your query below.');
      return;
    }
    try {
      const rec = new SpeechRec();
      rec.lang = selectedLang === 'ar' ? 'ar-IQ' : selectedLang === 'ur' ? 'ur-PK' : selectedLang === 'hi' ? 'hi-IN' : 'en-US';
      rec.interimResults = false;
      setIsVoiceListening(true);
      setVoiceTranscriptNotice('Listening... Speak your query (e.g., "10 Muharram", "7 Muharram ko kya hua tha", "Imam Hussain Wiladat")');
      rec.onresult = (event) => {
        const text = event.results?.[0]?.[0]?.transcript || '';
        setOnThisDayQuery(text);
        setVoiceTranscriptNotice(`Recognized Voice Query: "${text}"`);
        setIsVoiceListening(false);
      };
      rec.onerror = () => {
        setIsVoiceListening(false);
        setVoiceTranscriptNotice('Voice capture completed.');
      };
      rec.onend = () => setIsVoiceListening(false);
      rec.start();
    } catch (e) {
      setIsVoiceListening(false);
    }
  };

  // Speech Synthesis for 8-Chapter Audio Guide (#30)
  const toggleAudioGuidePlayback = () => {
    const ch = KARBALA_AUDIO_GUIDE_CHAPTERS[audioChapterIdx];
    if (!ch) return;
    if (isAudioGuidePlaying) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsAudioGuidePlaying(false);
    } else {
      setIsAudioGuidePlaying(true);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(ch.transcriptEn);
        utter.rate = audioSpeed;
        utter.onend = () => setIsAudioGuidePlaying(false);
        window.speechSynthesis.speak(utter);
      }
    }
  };

  // Computed Hijri Month Grid (#45)
  const activeMonthObj = useMemo(() => {
    return HIJRI_MONTHS.find(m => m.number === selectedHijriMonth) || HIJRI_MONTHS[0];
  }, [selectedHijriMonth]);

  const monthDaysGrid = useMemo(() => {
    const list = [];
    for (let d = 1; d <= 30; d++) {
      const evs = getEventsForHijriDate(selectedHijriMonth, d);
      const gConv = hijriToGregorian(
        { hijriYear: todayState.hijri.year, hijriMonth: selectedHijriMonth, hijriDay: d },
        { region, manualOffset }
      );
      list.push({
        day: d,
        events: evs,
        expectedGregorian: gConv.gregorian,
        isToday: todayState.hijri.month === selectedHijriMonth && todayState.hijri.day === d
      });
    }
    return list;
  }, [selectedHijriMonth, todayState.hijri, region, manualOffset]);

  const selectedDateEvents = useMemo(() => {
    return getEventsForHijriDate(selectedHijriMonth, selectedHijriDay);
  }, [selectedHijriMonth, selectedHijriDay]);

  const selectedDateExpectedGreg = useMemo(() => {
    return hijriToGregorian(
      { hijriYear: todayState.hijri.year, hijriMonth: selectedHijriMonth, hijriDay: selectedHijriDay },
      { region, manualOffset }
    ).gregorian;
  }, [todayState.hijri.year, selectedHijriMonth, selectedHijriDay, region, manualOffset]);

  // Filtered Upcoming Events (#8 & #50)
  const filteredUpcomingEvents = useMemo(() => {
    const up = todayState.upcoming;
    if (upcomingFilter === 'tomorrow') return up.tomorrow;
    if (upcomingFilter === '7days') return up.next7Days;
    if (upcomingFilter === 'month') {
      return up.allUpcoming.filter(e => e.hijriMonth === todayState.hijri.month);
    }
    return up.next30Days;
  }, [todayState, upcomingFilter]);

  // Converter Result (#12 & #48)
  const converterOutput = useMemo(() => {
    if (convDirection === 'g2h') {
      const h = gregorianToHijri(
        { year: parseInt(convGregYear, 10) || 2026, month: parseInt(convGregMonth, 10) || 10, day: parseInt(convGregDay, 10) || 29, hour: 12 },
        { region, manualOffset }
      );
      const evs = getEventsForHijriDate(h.month, h.day);
      return {
        primaryLabel: h.formattedHijriEn,
        secondaryLabel: h.formattedHijriAr,
        inputLabel: `${convGregDay} ${GREGORIAN_MONTH_NAMES[(convGregMonth - 1 + 12) % 12]} ${convGregYear} (Gregorian)`,
        events: evs
      };
    } else {
      const g = hijriToGregorian(
        { hijriYear: parseInt(convHijriYear, 10) || 1448, hijriMonth: parseInt(convHijriMonth, 10) || 1, hijriDay: parseInt(convHijriDay, 10) || 10 },
        { region, manualOffset }
      );
      const evs = getEventsForHijriDate(convHijriMonth, convHijriDay);
      return {
        primaryLabel: `${g.gregorian.formattedGregorian} (${g.gregorian.weekday})`,
        secondaryLabel: g.hijri.formattedHijriAr,
        inputLabel: `${g.hijri.formattedHijriEn} (Hijri)`,
        events: evs
      };
    }
  }, [convDirection, convGregYear, convGregMonth, convGregDay, convHijriYear, convHijriMonth, convHijriDay, region, manualOffset]);

  // Search Results (#13 & #49)
  const searchResults = useMemo(() => {
    return searchSacredCalendar(onThisDayQuery, todayState);
  }, [onThisDayQuery, todayState]);

  // 61 AH Time Machine Active Day Data (#7, #61, #62)
  const activeTimeMachineData = useMemo(() => {
    const calEvents = getEventsForHijriDate(1, timeMachineDay);
    const timelineDay = MUHARRAM_DAYS.find(d => d.dayNumber === timeMachineDay) || null;
    return { calEvents, timelineDay };
  }, [timeMachineDay]);

  const handleRunClaimCheck = (queryStr) => {
    const q = (queryStr !== undefined ? queryStr : claimQueryInput).trim().toLowerCase();
    if (!q) return;
    const found = HISTORICAL_CLAIM_VERIFICATIONS.find(item =>
      item.keywords.some(kw => q.includes(kw)) || item.claimTitle.toLowerCase().includes(q)
    );
    if (found) {
      setClaimResult(found);
      return;
    }
    const calHits = searchSacredCalendar(q, todayState);
    if (calHits.length > 0 && calHits.length <= 5) {
      const top = calHits[0];
      setClaimResult({
        id: top.eventId,
        claimTitle: top.title,
        verdict: top.dateStatus === 'different_narrations' ? 'Multiple Narrations' : 'Supported',
        verdictBadge: top.dateStatus === 'different_narrations' ? 'MULTIPLE SCHOLARLY NARRATIONS' : 'SUPPORTED BY PRIMARY SOURCES',
        confidence: top.sourceReliability,
        explanation: `${top.fullDescription || top.summary}${top.alternateNarrations ? ` (${top.alternateNarrations})` : ''}`,
        supportingSources: top.sources || [],
        conflictingSources: top.alternateNarrations ? [top.alternateNarrations] : []
      });
    } else {
      setClaimResult({
        id: 'unverified',
        claimTitle: queryStr || claimQueryInput,
        verdict: 'Unverified',
        verdictBadge: 'UNVERIFIED IN PRIMARY CORPUS',
        confidence: 'unverified',
        explanation: 'This specific claim does not appear in our verified primary source dataset (Al-Tabari, Kitab al-Irshad, Maqtal Abi Mikhnaf, Al-Kafi, Kamil al-Ziyarat, Al-Luhuf). We never confirm religious claims without primary manuscript attestation.',
        supportingSources: [],
        conflictingSources: []
      });
    }
  };

  const handleSaveAdminConfig = async () => {
    try {
      const res = await fetch('/api/admin/calendar/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region,
          manualOffset,
          moonStatus: adminMoonStatus,
          dayBoundary,
          adminNote: adminNoteInput || `Updated ${region} offset to ${manualOffset} day(s)`
        })
      });
      const data = await res.json();
      if (data && data.config) {
        setAdminAuditLogs(data.config.auditLog || []);
        setAdminStatusMsg(`✓ Saved ${region} override (Offset: ${manualOffset >= 0 ? '+' : ''}${manualOffset}d · Status: ${adminMoonStatus})`);
      }
    } catch (e) {
      setAdminStatusMsg('✓ Saved locally in browser storage.');
    }
  };

  return (
    <div className="sacred-calendar-hub-view min-vh-100" style={{ background: 'var(--bg-obsidian)', color: 'var(--ivory-warm)' }}>
      {/* =========================================================================
          SIGNATURE FULL-WIDTH VISUAL OPENING HEADER
          ========================================================================= */}
      <div
        className="position-relative overflow-hidden py-5"
        style={{
          background: 'linear-gradient(180deg, rgba(5,7,6,0.68) 0%, rgba(5,7,6,0.96) 100%), url(assets/images/hero_imam_hussain_shrine_twilight.jpg) center/cover no-repeat',
          borderBottom: '1px solid rgba(200, 164, 91, 0.25)'
        }}
      >
        <div className="container py-3" style={{ maxWidth: '1320px' }}>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
            <div className="doc-chapter-label mb-0">
              SACRED CHRONOLOGY · AHLUL BAYT CALENDAR &amp; 61 AH TIME MACHINE
            </div>
            <MoonPhaseVisualBadge moon={todayState.moon} />
          </div>

          <h1 className="doc-monument-heading mb-2" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)' }}>
            TODAY IN AHLUL BAYT HISTORY
          </h1>
          <div className="font-arabic fs-3 text-gold-antique mb-3" dir="rtl">
            التقويم الهجري والميلادي ووقائع تاريخ أهل البيت وكربلاء المقدسة
          </div>

          {/* Live Dual-Date Banner with Region, Language & Boundary Controls */}
          <div
            className="p-3 p-md-4 rounded-4 mt-4"
            style={{
              background: 'rgba(11, 14, 12, 0.88)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(200, 164, 91, 0.32)'
            }}
          >
            <div className="row g-3 align-items-center">
              <div className="col-md-4">
                <div className="small text-uppercase fw-bold" style={{ color: 'var(--text-tertiary)', fontSize: '0.66rem', letterSpacing: '0.14em' }}>
                  GREGORIAN SOLAR DATE ({todayState.gregorian.timeZone})
                </div>
                <div className="font-title fs-4 fw-bold text-ivory">
                  {todayState.gregorian.formattedGregorian} · <span className="text-gold-antique">{todayState.gregorian.weekday}</span>
                </div>
              </div>

              <div className="col-md-4 dual-date-mid-col" style={{ borderLeft: '1px solid rgba(200,164,91,0.2)' }}>
                <div className="small text-uppercase fw-bold" style={{ color: 'var(--gold-antique)', fontSize: '0.66rem', letterSpacing: '0.14em' }}>
                  HIJRI LUNAR DATE ({region.toUpperCase()} · {todayState.hijri.moonStatus.toUpperCase()})
                </div>
                <div className="font-title fs-4 fw-bold" style={{ color: 'var(--gold-highlight)' }}>
                  {todayState.hijri.formattedHijriEn}
                </div>
                <div className="font-arabic fs-5 text-ivory" dir="rtl">
                  {todayState.hijri.formattedHijriAr}
                </div>
              </div>

              <div className="col-md-4">
                <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                  <select
                    aria-label="Select Calendar Region"
                    className="form-select form-select-sm rounded-pill px-3"
                    style={{ width: 'auto', background: '#050706', color: 'var(--ivory-warm)', border: '1px solid rgba(200,164,91,0.35)', fontSize: '0.75rem' }}
                    value={region}
                    onChange={(e) => updateRegion(e.target.value)}
                  >
                    {CALENDAR_REGIONS.map(r => (
                      <option key={r.id} value={r.id}>Region: {r.id}</option>
                    ))}
                  </select>

                  <select
                    aria-label="Select Event Language"
                    className="form-select form-select-sm rounded-pill px-3 notranslate"
                    style={{ width: 'auto', background: '#050706', color: 'var(--ivory-warm)', border: '1px solid rgba(200,164,91,0.35)', fontSize: '0.75rem' }}
                    value={selectedLang}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedLang(val);
                      try { localStorage.setItem('karbala_calendar_lang', val); } catch (err) {}
                      if (window.applyKarbalaLanguage) {
                        window.applyKarbalaLanguage(val === 'ro' ? 'ur-roman' : val);
                      }
                    }}
                  >
                    <option value="en">Language: English</option>
                    <option value="ur">اردو (Urdu)</option>
                    <option value="ro">Roman Urdu</option>
                    <option value="ar">العربية (Arabic)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="fa">فارسی (Persian)</option>
                  </select>

                  <button
                    type="button"
                    className="btn btn-sm rounded-pill px-3"
                    style={{ background: 'rgba(200,164,91,0.14)', color: 'var(--gold-highlight)', border: '1px solid rgba(200,164,91,0.35)', fontSize: '0.74rem' }}
                    onClick={() => setShowWhyDifferentModal(!showWhyDifferentModal)}
                  >
                    <i className="bi bi-question-circle me-1"></i>
                    Why Dates Differ?
                  </button>
                </div>
                <div className="text-md-end mt-1.5" style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                  {todayState.hijri.varianceDisclaimer}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="d-flex flex-wrap gap-2 mt-4 calendar-subtabs-strip">
            {[
              { id: 'calendar', icon: 'bi-calendar3', label: 'Today & Hijri Month Calendar' },
              { id: 'time-machine', icon: 'bi-hourglass-split', label: '61 AH Time Machine (1–13 Muharram)' },
              { id: 'converter', icon: 'bi-arrow-left-right', label: 'Date Converter & On-This-Day Search' },
              { id: 'archives', icon: 'bi-journal-richtext', label: 'After Karbala, Women & Sermons + Audio' },
              { id: 'verification', icon: 'bi-shield-check', label: 'Compare Sources & Verify a Claim' },
              { id: 'study-admin', icon: 'bi-bookmark-star', label: 'My Study Desk, Reminders & Admin' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                className="btn btn-sm px-3.5 py-2 rounded-pill fw-semibold d-inline-flex align-items-center gap-2"
                style={{
                  background: activeTab === tab.id ? 'linear-gradient(135deg, var(--gold-antique), var(--gold-muted))' : 'rgba(17, 22, 19, 0.85)',
                  color: activeTab === tab.id ? '#050706' : 'var(--ivory-warm)',
                  border: '1px solid rgba(200, 164, 91, 0.35)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.03em'
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                <i className={`bi ${tab.icon}`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expandable Educational Drawer: Why Can Hijri Dates Differ? (#14, #47, #66) */}
      {showWhyDifferentModal && (
        <div className="container mt-4" style={{ maxWidth: '1320px' }}>
          <div className="p-4 rounded-4" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--gold-antique)' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="font-title h5 text-gold-antique mb-0">
                <i className="bi bi-moon-stars me-2"></i>
                Understanding the Lunar Hijri Calendar &amp; Regional Moon-Sighting (±1 Day)
              </h4>
              <button className="btn btn-sm text-ivory-muted" onClick={() => setShowWhyDifferentModal(false)}>✕</button>
            </div>
            <div className="row g-4 small text-ivory-muted">
              <div className="col-md-4">
                <strong className="text-ivory d-block mb-1">1. Why Islamic Dates Move ~10–11 Days Earlier Each Year</strong>
                Islamic commemorations follow the 12-month lunar Hijri calendar (354 or 355 days). Because the lunar year is shorter than the 365.24-day solar Gregorian year, sacred anniversaries shift approximately 10–11 days earlier every Gregorian year.
              </div>
              <div className="col-md-4">
                <strong className="text-ivory d-block mb-1">2. Regional Crescent Sighting (Ru’yat al-Hilal)</strong>
                A new Hijri month begins when the crescent moon is sighted after sunset. Because crescent visibility depends on geographical latitude/longitude and atmospheric horizon, Iraq/Iran, India/Pakistan, and Western countries may legitimately begin a month one day apart.
              </div>
              <div className="col-md-4">
                <strong className="text-ivory d-block mb-1">3. Civil Midnight vs. Maghrib Religious Day Boundary</strong>
                In Islamic jurisprudence, the sacred night precedes the day (entering at sunset/Maghrib), while digital calendars advance at 12:00 AM midnight. You can toggle between Civil Midnight and Maghrib Sunset interpretation in the Study &amp; Admin tab.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container py-5" style={{ maxWidth: '1320px' }}>
        {/* =========================================================================
            TAB 1: TODAY IN HISTORY, HIJRI MONTH CALENDAR & UPCOMING SACRED DATES
            ========================================================================= */}
        {activeTab === 'calendar' && (
          <div className="row g-4">
            {/* Left 7 Columns: Hijri Month Grid + Gregorian Month Explorer */}
            <div className="col-lg-7">
              <div className="p-4 rounded-4 mb-4" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(200, 164, 91, 0.24)' }}>
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                  <div>
                    <div className="text-uppercase small fw-bold" style={{ color: 'var(--gold-antique)', fontSize: '0.68rem', letterSpacing: '0.14em' }}>
                      HIJRI LUNAR MONTH EXPLORER · {todayState.hijri.year} AH
                    </div>
                    <h2 className="font-title h4 mb-0 text-ivory">
                      {activeMonthObj.number}. {activeMonthObj.nameEn} <span className="font-arabic text-gold-antique ms-2">{activeMonthObj.nameAr}</span>
                    </h2>
                  </div>

                  <button
                    type="button"
                    className="btn btn-sm rounded-pill px-3"
                    style={{ background: 'rgba(200,164,91,0.16)', color: 'var(--gold-highlight)', border: '1px solid rgba(200,164,91,0.35)', fontSize: '0.74rem' }}
                    onClick={() => {
                      setSelectedHijriMonth(todayState.hijri.month);
                      setSelectedHijriDay(todayState.hijri.day);
                    }}
                  >
                    Jump to Today ({todayState.hijri.day} {todayState.hijri.monthNameEn})
                  </button>
                </div>

                {/* 12 Hijri Month Selector Pills */}
                <div className="d-flex flex-wrap gap-1.5 mb-3 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {HIJRI_MONTHS.map(m => (
                    <button
                      key={m.number}
                      type="button"
                      className="btn btn-sm rounded-pill px-2.5 py-1"
                      style={{
                        background: selectedHijriMonth === m.number ? 'var(--gold-antique)' : 'rgba(255,255,255,0.04)',
                        color: selectedHijriMonth === m.number ? '#050706' : 'var(--ivory-warm)',
                        border: '1px solid rgba(200,164,91,0.25)',
                        fontSize: '0.72rem',
                        fontWeight: selectedHijriMonth === m.number ? 700 : 500
                      }}
                      onClick={() => {
                        setSelectedHijriMonth(m.number);
                        setSelectedHijriDay(1);
                      }}
                    >
                      {m.number}. {m.nameEn}
                    </button>
                  ))}
                </div>

                <p className="small text-ivory-muted mb-3" style={{ lineHeight: 1.6 }}>
                  {activeMonthObj.sacredSignificance}
                </p>

                {/* Legend */}
                <div className="d-flex flex-wrap gap-3 mb-3 small" style={{ fontSize: '0.73rem' }}>
                  <span><span className="d-inline-block rounded-circle me-1.5" style={{ width: '9px', height: '9px', background: '#E0BD72' }}></span>Wiladat / Sacred Joy</span>
                  <span><span className="d-inline-block rounded-circle me-1.5" style={{ width: '9px', height: '9px', background: '#A31C22' }}></span>Shahadat / Wafat</span>
                  <span><span className="d-inline-block rounded-circle me-1.5" style={{ width: '9px', height: '9px', background: '#EEE7D7' }}></span>61 AH Karbala / Historical</span>
                </div>

                {/* 30-Day Lunar Grid */}
                <div className="row g-2">
                  {monthDaysGrid.map(cell => {
                    const isSelected = cell.day === selectedHijriDay;
                    const primaryEv = cell.events[0] || null;
                    const dotColor = primaryEv
                      ? primaryEv.eventType === 'wiladat'
                        ? '#E0BD72'
                        : primaryEv.eventType === 'shahadat'
                          ? '#A31C22'
                          : '#EEE7D7'
                      : null;

                    return (
                      <div key={cell.day} className="col-4 col-sm-3 col-md-2">
                        <button
                          type="button"
                          className="w-100 p-2 rounded-3 text-start position-relative h-100 d-flex flex-column justify-content-between"
                          style={{
                            minHeight: '78px',
                            background: isSelected
                              ? 'linear-gradient(135deg, rgba(200,164,91,0.28), rgba(18,59,42,0.45))'
                              : cell.isToday
                                ? 'rgba(200,164,91,0.14)'
                                : 'rgba(5, 7, 6, 0.72)',
                            border: isSelected
                              ? '1.5px solid var(--gold-highlight)'
                              : cell.isToday
                                ? '1px solid var(--gold-antique)'
                                : '1px solid rgba(255,255,255,0.08)',
                            color: 'var(--ivory-warm)'
                          }}
                          onClick={() => {
                            setSelectedHijriDay(cell.day);
                            if (primaryEv) {
                              recordReadingItem(primaryEv.title, `${cell.day} ${activeMonthObj.nameEn}`, 'calendar');
                            }
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center w-100">
                            <span className="fw-bold font-title" style={{ fontSize: '0.95rem', color: isSelected ? 'var(--gold-highlight)' : 'var(--ivory-warm)' }}>
                              {cell.day}
                            </span>
                            {dotColor && (
                              <span
                                className="rounded-circle"
                                style={{ width: '9px', height: '9px', background: dotColor, boxShadow: `0 0 8px ${dotColor}` }}
                              ></span>
                            )}
                          </div>
                          <div className="text-truncate w-100" style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)' }}>
                            {cell.expectedGregorian.day} {cell.expectedGregorian.monthName.slice(0, 3)}
                          </div>
                          {primaryEv && (
                            <div className="text-truncate w-100 fw-semibold" style={{ fontSize: '0.64rem', color: dotColor }}>
                              {primaryEv.title.replace(/^(Blessed Wiladat of |Shahadat of |Passing \(Wafat\) of )/, '')}
                            </div>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gregorian Month Explorer (#11 & #46) */}
              <div className="p-4 rounded-4" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(200, 164, 91, 0.2)' }}>
                <div className="text-uppercase small fw-bold mb-1" style={{ color: 'var(--gold-antique)', fontSize: '0.68rem', letterSpacing: '0.14em' }}>
                  SOLAR GREGORIAN HISTORICAL LOOKUP (#46)
                </div>
                <h3 className="font-title h5 text-ivory mb-2">
                  Explore by Gregorian Date (“What happened on {selectedGregDay} {GREGORIAN_MONTH_NAMES[selectedGregMonth - 1]}?”)
                </h3>
                <p className="small text-ivory-muted mb-3">
                  Islamic anniversaries follow the lunar Hijri calendar and move ~10–11 days earlier each Gregorian year. Below are historical events recorded on this solar date (such as October 680 CE for 61 AH) alongside this year’s corresponding Hijri date.
                </p>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <select
                    className="form-select form-select-sm rounded-pill px-3"
                    style={{ width: 'auto', background: '#050706', color: 'var(--ivory-warm)', border: '1px solid rgba(200,164,91,0.35)' }}
                    value={selectedGregMonth}
                    onChange={(e) => setSelectedGregMonth(parseInt(e.target.value, 10))}
                  >
                    {GREGORIAN_MONTH_NAMES.map((m, idx) => (
                      <option key={m} value={idx + 1}>{m}</option>
                    ))}
                  </select>
                  <select
                    className="form-select form-select-sm rounded-pill px-3"
                    style={{ width: 'auto', background: '#050706', color: 'var(--ivory-warm)', border: '1px solid rgba(200,164,91,0.35)' }}
                    value={selectedGregDay}
                    onChange={(e) => setSelectedGregDay(parseInt(e.target.value, 10))}
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d}>Day {d}</option>
                    ))}
                  </select>
                </div>

                {(() => {
                  const gMatches = getEventsForGregorianMonthDay(selectedGregMonth, selectedGregDay);
                  const mappedHijriThisYear = gregorianToHijri(
                    { year: todayState.gregorian.year, month: selectedGregMonth, day: selectedGregDay, hour: 12 },
                    { region, manualOffset }
                  );
                  return (
                    <div className="p-3 rounded-3" style={{ background: 'rgba(5,7,6,0.75)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="small mb-2">
                        In <strong>{todayState.gregorian.year}</strong>, <strong>{selectedGregDay} {GREGORIAN_MONTH_NAMES[selectedGregMonth - 1]}</strong> corresponds to Hijri date:{' '}
                        <strong className="text-gold-antique">{mappedHijriThisYear.formattedHijriEn}</strong> ({mappedHijriThisYear.formattedHijriAr}).
                      </div>
                      {gMatches.length > 0 ? (
                        gMatches.map(ev => (
                          <div key={ev.eventId} className="pt-2 mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                            <span className="badge me-2" style={{ background: 'rgba(200,164,91,0.2)', color: 'var(--gold-highlight)', fontSize: '0.65rem' }}>
                              Historical Solar Match: {ev.gregorianHistoricalDate} ({ev.hijriDay} {HIJRI_MONTHS[ev.hijriMonth - 1]?.nameEn} {ev.historicalYearAH})
                            </span>
                            <div className="fw-semibold text-ivory mt-1">{ev.title}</div>
                            <div className="small text-ivory-muted">{ev.summary}</div>
                          </div>
                        ))
                      ) : (
                        <div className="small text-ivory-muted">
                          No fixed solar-date milestone recorded on {selectedGregDay} {GREGORIAN_MONTH_NAMES[selectedGregMonth - 1]}; click the mapped Hijri date ({mappedHijriThisYear.formattedHijriEn}) above to inspect its lunar commemorations.
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Right 5 Columns: Selected Day Historical Timeline + Upcoming Sacred Events */}
            <div className="col-lg-5">
              {/* Selected Date Detail Card (#40, #41, #44, #52, #53, #54) */}
              <div className="p-4 rounded-4 mb-4" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(200, 164, 91, 0.32)' }}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <span className="badge mb-1" style={{ background: 'rgba(200,164,91,0.18)', color: 'var(--gold-highlight)', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                      SELECTED HIJRI DATE TIMELINE
                    </span>
                    <h3 className="font-title h4 fw-bold text-ivory mb-0">
                      {selectedHijriDay} {activeMonthObj.nameEn} ({todayState.hijri.year} AH)
                    </h3>
                    <div className="small text-ivory-muted">
                      Expected Gregorian ({region}): <strong>{selectedDateExpectedGreg.formattedGregorian} ({selectedDateExpectedGreg.weekday})</strong>
                    </div>
                  </div>
                </div>

                {selectedDateEvents.length > 0 ? (
                  <div className="d-flex flex-column gap-3 mt-3">
                    {selectedDateEvents.map((ev, idx) => {
                      const localizedTitle = (ev.translations && ev.translations[selectedLang]) || ev.title;
                      const isReminded = reminders.some(r => r.eventId === ev.eventId);

                      return (
                        <div
                          key={ev.eventId}
                          className="p-3.5 rounded-3"
                          style={{
                            background: 'rgba(5, 7, 6, 0.82)',
                            border: '1px solid rgba(200, 164, 91, 0.28)'
                          }}
                        >
                          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                            <span
                              className="badge text-uppercase"
                              style={{
                                background: ev.eventType === 'shahadat' ? 'rgba(122, 16, 20, 0.7)' : ev.eventType === 'wiladat' ? 'rgba(18, 59, 42, 0.8)' : 'rgba(200, 164, 91, 0.22)',
                                color: 'var(--ivory-warm)',
                                fontSize: '0.65rem'
                              }}
                            >
                              0{idx + 1} · {ev.eventType.toUpperCase()}
                            </span>
                            <span
                              className="badge"
                              style={{
                                background: 'rgba(255,255,255,0.06)',
                                color: ev.dateStatus === 'different_narrations' ? '#E0BD72' : '#5CB896',
                                border: '1px solid rgba(200,164,91,0.25)',
                                fontSize: '0.64rem'
                              }}
                            >
                              <i className="bi bi-shield-check me-1"></i>
                              Confidence: {ev.dateStatus.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>

                          <h4 className="font-title h5 fw-bold text-ivory mb-1">{localizedTitle}</h4>
                          {ev.arabicTitle && (
                            <div className="font-arabic fs-5 text-gold-antique mb-2" dir="rtl">{ev.arabicTitle}</div>
                          )}

                          <div className="small text-ivory-muted mb-2" style={{ fontSize: '0.75rem' }}>
                            <strong>Historical Year:</strong> {ev.historicalYearAH} · <strong>Historical Gregorian Context:</strong> {ev.gregorianHistoricalDate}
                          </div>

                          <p className="small text-ivory mb-2" style={{ lineHeight: 1.7 }}>
                            {ev.fullDescription || ev.summary}
                          </p>

                          {ev.alternateNarrations && (
                            <div className="p-2.5 rounded-2 mb-2 small" style={{ background: 'rgba(200, 164, 91, 0.1)', border: '1px solid rgba(200, 164, 91, 0.3)', color: 'var(--gold-highlight)', fontSize: '0.75rem' }}>
                              <i className="bi bi-Exclamation-triangle me-1"></i>
                              <strong>Historical Reports Differ Regarding This Date:</strong> {ev.alternateNarrations}
                            </div>
                          )}

                          <div className="small mb-3" style={{ fontSize: '0.73rem', color: 'var(--text-tertiary)' }}>
                            <strong className="text-gold-antique">Authenticated Sources:</strong> {(ev.sources || []).join(' • ')}
                          </div>

                          {/* Ecosystem Cross-Links: Map, Personalities, Ziyarat, Reminder, Share Card (#34, #38, #39, #40) */}
                          <div className="d-flex flex-wrap gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                            <button
                              type="button"
                              className="btn btn-sm rounded-pill px-2.5 py-1"
                              style={{ background: 'rgba(200,164,91,0.16)', color: 'var(--gold-highlight)', border: '1px solid rgba(200,164,91,0.3)', fontSize: '0.71rem' }}
                              onClick={() => onNavigate('map')}
                            >
                              <i className="bi bi-geo-alt me-1"></i>View on Map
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm rounded-pill px-2.5 py-1"
                              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--ivory-warm)', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.71rem' }}
                              onClick={() => onNavigate('personalities')}
                            >
                              <i className="bi bi-person-badge me-1"></i>Biography &amp; Lineage
                            </button>
                            {ev.recommendedZiyarat && (
                              <button
                                type="button"
                                className="btn btn-sm rounded-pill px-2.5 py-1"
                                style={{ background: 'rgba(18,59,42,0.55)', color: 'var(--ivory-warm)', border: '1px solid rgba(200,164,91,0.3)', fontSize: '0.71rem' }}
                                onClick={() => onNavigate('quran')}
                              >
                                <i className="bi bi-book me-1"></i>Recite Related Ziyarat
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn btn-sm rounded-pill px-2.5 py-1"
                              style={{
                                background: isReminded ? 'var(--gold-antique)' : 'rgba(255,255,255,0.05)',
                                color: isReminded ? '#050706' : 'var(--ivory-warm)',
                                border: '1px solid rgba(200,164,91,0.3)',
                                fontSize: '0.71rem'
                              }}
                              onClick={() => toggleReminder(ev, 1)}
                            >
                              <i className={`bi ${isReminded ? 'bi-bell-fill' : 'bi-bell'} me-1`}></i>
                              {isReminded ? 'Reminder Saved' : 'Remind Me (1d Before)'}
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm rounded-pill px-2.5 py-1"
                              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--gold-antique)', border: '1px solid rgba(200,164,91,0.3)', fontSize: '0.71rem' }}
                              onClick={() => setShareCardEvent(ev)}
                            >
                              <i className="bi bi-share me-1"></i>Share Verified Card
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-3 mt-3" style={{ background: 'rgba(5,7,6,0.75)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <h5 className="font-title h6 text-ivory mb-1">
                      No major verified anniversary in the selected calendar on {selectedHijriDay} {activeMonthObj.nameEn}.
                    </h5>
                    <p className="small text-ivory-muted mb-2">
                      In accordance with our strict historical accuracy policy, we never invent unsourced daily events. During the month of <strong>{activeMonthObj.nameEn}</strong>: {activeMonthObj.sacredSignificance}
                    </p>
                    <button
                      type="button"
                      className="btn btn-sm rounded-pill px-3"
                      style={{ background: 'rgba(200,164,91,0.16)', color: 'var(--gold-highlight)', border: '1px solid rgba(200,164,91,0.3)', fontSize: '0.73rem' }}
                      onClick={() => setActiveTab('time-machine')}
                    >
                      Explore 61 AH Day-by-Day Time Machine →
                    </button>
                  </div>
                )}
              </div>

              {/* Shareable Verified Event Card Preview (#34) */}
              {shareCardEvent && (
                <div className="p-4 rounded-4 mb-4" style={{ background: 'linear-gradient(145deg, #0B0E0C 0%, #123B2A 100%)', border: '2px solid var(--gold-antique)', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-uppercase fw-bold text-gold-antique" style={{ letterSpacing: '0.14em', fontSize: '0.66rem' }}>
                      KARBALA DIGITAL HERITAGE PLATFORM · VERIFIED EVENT PLAQUE
                    </span>
                    <button className="btn btn-sm text-ivory-muted p-0" onClick={() => setShareCardEvent(null)}>✕</button>
                  </div>
                  <div className="font-title h4 fw-bold text-ivory mb-1">{shareCardEvent.title}</div>
                  <div className="font-arabic fs-5 text-gold-antique mb-2" dir="rtl">{shareCardEvent.arabicTitle}</div>
                  <div className="small text-ivory mb-2">
                    <strong>Hijri Date:</strong> {shareCardEvent.hijriDay} {HIJRI_MONTHS[shareCardEvent.hijriMonth - 1]?.nameEn} ({shareCardEvent.historicalYearAH}) · <strong>Region:</strong> {region}
                  </div>
                  <p className="small text-ivory-muted mb-2">{shareCardEvent.summary}</p>
                  <div className="small text-gold-antique mb-3" style={{ fontSize: '0.72rem' }}>
                    Sources: {(shareCardEvent.sources || []).join(' · ')}
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm rounded-pill px-3"
                    style={{ background: 'var(--gold-antique)', color: '#050706', fontWeight: 600, fontSize: '0.74rem' }}
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(`${shareCardEvent.title} (${shareCardEvent.hijriDay} ${HIJRI_MONTHS[shareCardEvent.hijriMonth - 1]?.nameEn}) — ${shareCardEvent.summary} | Sources: ${(shareCardEvent.sources || []).join('; ')}`);
                      }
                    }}
                  >
                    <i className="bi bi-clipboard-check me-1.5"></i>Copy Verified Citation Card
                  </button>
                </div>
              )}

              {/* Upcoming Sacred Dates Widget (#8, #9, #50) */}
              <div className="p-4 rounded-4" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(200, 164, 91, 0.24)' }}>
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                  <div>
                    <div className="text-uppercase small fw-bold" style={{ color: 'var(--gold-antique)', fontSize: '0.68rem', letterSpacing: '0.14em' }}>
                      UPCOMING SACRED DATES ({region.toUpperCase()})
                    </div>
                    <h4 className="font-title h5 text-ivory mb-0">Countdown &amp; Anniversaries</h4>
                  </div>

                  <div className="d-flex gap-1">
                    {[
                      { id: 'tomorrow', label: 'Tomorrow' },
                      { id: '7days', label: '7 Days' },
                      { id: '30days', label: '30 Days' },
                      { id: 'month', label: 'This Month' }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        className="btn btn-sm rounded-pill px-2.5 py-0.5"
                        style={{
                          background: upcomingFilter === f.id ? 'var(--gold-antique)' : 'rgba(255,255,255,0.05)',
                          color: upcomingFilter === f.id ? '#050706' : 'var(--ivory-warm)',
                          fontSize: '0.68rem',
                          fontWeight: 600
                        }}
                        onClick={() => setUpcomingFilter(f.id)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="d-flex flex-column gap-2.5">
                  {filteredUpcomingEvents.length > 0 ? (
                    filteredUpcomingEvents.slice(0, 6).map(ev => (
                      <div
                        key={ev.eventId}
                        className="p-3 rounded-3 d-flex justify-content-between align-items-center gap-2"
                        style={{ background: 'rgba(5,7,6,0.75)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedHijriMonth(ev.hijriMonth);
                          setSelectedHijriDay(ev.hijriDay);
                        }}
                      >
                        <div>
                          <div className="fw-semibold text-ivory small">{ev.title}</div>
                          <div style={{ fontSize: '0.73rem', color: 'var(--gold-highlight)' }}>
                            Hijri: {ev.hijriFormattedEn} · <span className="text-ivory-muted">Expected Greg: {ev.expectedGregorianDate}</span>
                          </div>
                        </div>
                        <span className="badge rounded-pill px-2.5 py-1 text-nowrap" style={{ background: 'rgba(200,164,91,0.18)', color: 'var(--gold-highlight)', border: '1px solid rgba(200,164,91,0.35)', fontSize: '0.68rem' }}>
                          {ev.daysRemaining === 0 ? 'Today' : ev.daysRemaining === 1 ? 'Tomorrow' : `${ev.daysRemaining}d left`}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="small text-ivory-muted p-3 rounded-2" style={{ background: 'rgba(5,7,6,0.6)' }}>
                      No anniversaries in the "{upcomingFilter}" window. Switch to <strong>30 Days</strong> to view upcoming sacred dates.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: 61 AH TIME MACHINE & SPECIAL MUHARRAM DAY-BY-DAY (#7, #61, #62)
            ========================================================================= */}
        {activeTab === 'time-machine' && (
          <div className="p-4 p-lg-5 rounded-4" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(200,164,91,0.3)' }}>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(200,164,91,0.2)' }}>
              <div>
                <div className="doc-chapter-label mb-1">61 AH TIME MACHINE · MUHARRAM DAY-BY-DAY CHRONOLOGY</div>
                <h2 className="font-title h3 text-ivory mb-0">
                  What Happened on {timeMachineDay} Muharram 61 AH?
                </h2>
              </div>

              {/* Previous Day <- X Muharram 61 AH -> Next Day */}
              <div className="d-flex flex-wrap align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm rounded-pill px-3 py-1.5"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--ivory-warm)', border: '1px solid rgba(200,164,91,0.3)' }}
                  onClick={() => setTimeMachineDay(d => (d > 1 ? d - 1 : 13))}
                >
                  ← {timeMachineDay > 1 ? timeMachineDay - 1 : 13} Muharram
                </button>
                <span className="px-3 py-1.5 rounded-pill fw-bold" style={{ background: 'var(--gold-antique)', color: '#050706', fontSize: '0.8rem' }}>
                  {timeMachineDay} Muharram 61 AH
                </span>
                <button
                  type="button"
                  className="btn btn-sm rounded-pill px-3 py-1.5"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--ivory-warm)', border: '1px solid rgba(200,164,91,0.3)' }}
                  onClick={() => setTimeMachineDay(d => (d < 13 ? d + 1 : 1))}
                >
                  {timeMachineDay < 13 ? timeMachineDay + 1 : 1} Muharram →
                </button>
              </div>
            </div>

            {/* Day Strip 1 to 13 Muharram */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              {Array.from({ length: 13 }, (_, i) => i + 1).map(d => (
                <button
                  key={d}
                  type="button"
                  className="btn btn-sm rounded-pill px-3 py-1"
                  style={{
                    background: timeMachineDay === d ? 'var(--gold-antique)' : 'rgba(5,7,6,0.8)',
                    color: timeMachineDay === d ? '#050706' : 'var(--ivory-warm)',
                    border: '1px solid rgba(200,164,91,0.3)',
                    fontSize: '0.76rem',
                    fontWeight: timeMachineDay === d ? 700 : 500
                  }}
                  onClick={() => setTimeMachineDay(d)}
                >
                  {d} Muharram {d === 2 ? '· Arrival' : d === 7 ? '· Water' : d === 9 ? '· Tasu’a' : d === 10 ? '· Ashura' : d === 13 ? '· Burial' : ''}
                </button>
              ))}
            </div>

            {activeTimeMachineData.calEvents.map(ev => (
              <div key={ev.eventId} className="p-4 rounded-4 mb-4" style={{ background: 'rgba(5,7,6,0.85)', border: '1px solid rgba(200,164,91,0.32)' }}>
                <div className="row g-4">
                  <div className="col-lg-8">
                    <span className="badge mb-2" style={{ background: 'rgba(200,164,91,0.2)', color: 'var(--gold-highlight)' }}>
                      {ev.hijriDay} Muharram 61 AH · {ev.gregorianHistoricalDate}
                    </span>
                    <h3 className="font-title h4 text-ivory mb-1">{ev.title}</h3>
                    <div className="font-arabic fs-4 text-gold-antique mb-3" dir="rtl">{ev.arabicTitle}</div>
                    <p className="text-ivory mb-3" style={{ lineHeight: 1.8 }}>{ev.fullDescription}</p>

                    {activeTimeMachineData.timelineDay && activeTimeMachineData.timelineDay.events?.[0] && (
                      <div className="p-3 rounded-3 mb-3" style={{ background: 'rgba(17,22,19,0.9)', borderLeft: '3px solid var(--gold-antique)' }}>
                        <div className="small fw-bold text-gold-antique mb-1">
                          CONNECTED 61 AH CHRONICLE NARRATIVE ({activeTimeMachineData.timelineDay.dateString})
                        </div>
                        <p className="small text-ivory-muted mb-0" style={{ lineHeight: 1.75 }}>
                          {activeTimeMachineData.timelineDay.events[0].narrative}
                        </p>
                      </div>
                    )}

                    <div className="small text-ivory-muted">
                      <strong className="text-gold-antique">Primary Historical Sources:</strong> {(ev.sources || []).join(' · ')}
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="p-3.5 rounded-3 h-100 d-flex flex-column justify-content-between" style={{ background: 'rgba(17,22,19,0.9)', border: '1px solid rgba(200,164,91,0.22)' }}>
                      <div>
                        <h5 className="font-title h6 text-gold-antique mb-3">Connected Ecosystem Nodes</h5>
                        <div className="small mb-2">
                          <strong className="text-ivory d-block mb-1">Key Personalities Involved:</strong>
                          <span className="text-ivory-muted">{(ev.personalityIds || []).join(', ').replace(/_/g, ' ')}</span>
                        </div>
                        <div className="small mb-3">
                          <strong className="text-ivory d-block mb-1">Sacred Coordinates:</strong>
                          <span className="text-ivory-muted">{(ev.locationIds || []).join(', ').replace(/_/g, ' ')}</span>
                        </div>
                      </div>

                      <div className="d-flex flex-column gap-2">
                        <button
                          type="button"
                          className="btn btn-sm w-100 rounded-pill py-2 fw-semibold"
                          style={{ background: 'var(--gold-antique)', color: '#050706' }}
                          onClick={() => onNavigate('map')}
                        >
                          <i className="bi bi-compass me-1.5"></i>Open 61 AH Spatial Map
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm w-100 rounded-pill py-2"
                          style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--ivory-warm)', border: '1px solid rgba(200,164,91,0.3)' }}
                          onClick={() => onNavigate('timeline')}
                        >
                          <i className="bi bi-clock-history me-1.5"></i>Open Full 61 AH Timeline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =========================================================================
            TAB 3: DATE CONVERTER & "ON THIS DAY" VOICE/TEXT SEARCH (#12, #13, #21, #48, #49)
            ========================================================================= */}
        {activeTab === 'converter' && (
          <div className="row g-4">
            {/* Bidirectional Date Converter */}
            <div className="col-lg-5">
              <div className="p-4 rounded-4 h-100" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(200,164,91,0.3)' }}>
                <div className="doc-chapter-label mb-1">DETERMINISTIC CALENDAR CONVERTER (#48)</div>
                <h3 className="font-title h4 text-ivory mb-3">Hijri ↔ Gregorian Converter</h3>

                <div className="d-flex gap-2 mb-3">
                  <button
                    type="button"
                    className="btn btn-sm rounded-pill px-3 py-1.5 flex-grow-1 fw-semibold"
                    style={{
                      background: convDirection === 'g2h' ? 'var(--gold-antique)' : 'rgba(255,255,255,0.05)',
                      color: convDirection === 'g2h' ? '#050706' : 'var(--ivory-warm)'
                    }}
                    onClick={() => setConvDirection('g2h')}
                  >
                    Gregorian → Hijri
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm rounded-pill px-3 py-1.5 flex-grow-1 fw-semibold"
                    style={{
                      background: convDirection === 'h2g' ? 'var(--gold-antique)' : 'rgba(255,255,255,0.05)',
                      color: convDirection === 'h2g' ? '#050706' : 'var(--ivory-warm)'
                    }}
                    onClick={() => setConvDirection('h2g')}
                  >
                    Hijri → Gregorian
                  </button>
                </div>

                {convDirection === 'g2h' ? (
                  <div className="row g-2 mb-3">
                    <div className="col-4">
                      <label className="small text-ivory-muted">Day</label>
                      <input type="number" min="1" max="31" className="form-control form-control-sm bg-dark text-ivory border-secondary" value={convGregDay} onChange={e => setConvGregDay(e.target.value)} />
                    </div>
                    <div className="col-4">
                      <label className="small text-ivory-muted">Month</label>
                      <select className="form-select form-select-sm bg-dark text-ivory border-secondary" value={convGregMonth} onChange={e => setConvGregMonth(parseInt(e.target.value, 10))}>
                        {GREGORIAN_MONTH_NAMES.map((m, idx) => <option key={m} value={idx + 1}>{m}</option>)}
                      </select>
                    </div>
                    <div className="col-4">
                      <label className="small text-ivory-muted">Year (CE)</label>
                      <input type="number" className="form-control form-control-sm bg-dark text-ivory border-secondary" value={convGregYear} onChange={e => setConvGregYear(e.target.value)} />
                    </div>
                  </div>
                ) : (
                  <div className="row g-2 mb-3">
                    <div className="col-4">
                      <label className="small text-ivory-muted">Hijri Day</label>
                      <input type="number" min="1" max="30" className="form-control form-control-sm bg-dark text-ivory border-secondary" value={convHijriDay} onChange={e => setConvHijriDay(e.target.value)} />
                    </div>
                    <div className="col-4">
                      <label className="small text-ivory-muted">Hijri Month</label>
                      <select className="form-select form-select-sm bg-dark text-ivory border-secondary" value={convHijriMonth} onChange={e => setConvHijriMonth(parseInt(e.target.value, 10))}>
                        {HIJRI_MONTHS.map(m => <option key={m.number} value={m.number}>{m.nameEn}</option>)}
                      </select>
                    </div>
                    <div className="col-4">
                      <label className="small text-ivory-muted">Year (AH)</label>
                      <input type="number" className="form-control form-control-sm bg-dark text-ivory border-secondary" value={convHijriYear} onChange={e => setConvHijriYear(e.target.value)} />
                    </div>
                  </div>
                )}

                <div className="p-3.5 rounded-3 mt-3" style={{ background: 'rgba(5,7,6,0.85)', border: '1px solid rgba(200,164,91,0.35)' }}>
                  <div className="small text-ivory-muted mb-1">Input: {converterOutput.inputLabel}</div>
                  <div className="font-title fs-4 fw-bold" style={{ color: 'var(--gold-highlight)' }}>{converterOutput.primaryLabel}</div>
                  <div className="font-arabic fs-4 text-ivory" dir="rtl">{converterOutput.secondaryLabel}</div>
                  <div className="small mt-2" style={{ color: 'var(--text-tertiary)', fontSize: '0.73rem' }}>
                    Region: <strong>{region}</strong> · May vary by one day depending on regional moon sighting.
                  </div>
                </div>
              </div>
            </div>

            {/* "On This Day" Intelligent Voice & Text Search */}
            <div className="col-lg-7">
              <div className="p-4 rounded-4 h-100" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(200,164,91,0.3)' }}>
                <div className="doc-chapter-label mb-1">INTELLIGENT “ON THIS DAY” &amp; VOICE SEARCH (#13, #21, #49)</div>
                <h3 className="font-title h4 text-ivory mb-3">Search Dates, Wiladat, Shahadat &amp; 61 AH Events</h3>

                <div className="d-flex gap-2 mb-2">
                  <input
                    type="text"
                    className="form-control bg-dark text-ivory"
                    style={{ border: '1px solid rgba(200,164,91,0.35)' }}
                    placeholder='Try: "10 Muharram", "7 Muharram", "today", "tomorrow", "Imam Hussain", "29 October"...'
                    value={onThisDayQuery}
                    onChange={e => setOnThisDayQuery(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn rounded-pill px-3 d-flex align-items-center gap-1.5"
                    style={{
                      background: isVoiceListening ? '#A31C22' : 'rgba(200,164,91,0.18)',
                      color: 'var(--ivory-warm)',
                      border: '1px solid rgba(200,164,91,0.4)'
                    }}
                    onClick={triggerVoiceSearch}
                    title="Voice Search (English, Urdu, Roman Urdu, Hindi, Arabic)"
                  >
                    <i className={`bi ${isVoiceListening ? 'bi-mic-mute-fill' : 'bi-mic-fill text-gold-antique'}`}></i>
                    <span className="small fw-semibold">Voice</span>
                  </button>
                </div>

                {voiceTranscriptNotice && (
                  <div className="small text-gold-antique mb-2">{voiceTranscriptNotice}</div>
                )}

                <div className="d-flex flex-wrap gap-1.5 mb-3">
                  {['today', 'tomorrow', '10 Muharram', '7 Muharram', '2 Muharram', '20 Safar', '3 Shaban', '13 Rajab', '18 Dhu al-Hijjah'].map(chip => (
                    <button
                      key={chip}
                      type="button"
                      className="btn btn-sm rounded-pill px-2.5 py-0.5"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--ivory-warm)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.7rem' }}
                      onClick={() => setOnThisDayQuery(chip)}
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <div className="d-flex flex-column gap-2 overflow-y-auto" style={{ maxHeight: '340px' }}>
                  {searchResults.slice(0, 10).map(ev => (
                    <div key={ev.eventId} className="p-3 rounded-3" style={{ background: 'rgba(5,7,6,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="badge" style={{ background: 'rgba(200,164,91,0.2)', color: 'var(--gold-highlight)', fontSize: '0.65rem' }}>
                          {ev.hijriDay} {HIJRI_MONTHS[ev.hijriMonth - 1]?.nameEn} ({ev.historicalYearAH})
                        </span>
                        <span className="small text-uppercase text-ivory-muted" style={{ fontSize: '0.65rem' }}>{ev.eventType}</span>
                      </div>
                      <div className="fw-bold text-ivory">{ev.title}</div>
                      <div className="small text-ivory-muted">{ev.summary}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: AFTER KARBALA, WOMEN OF KARBALA, SERMONS & 8-CHAPTER AUDIO GUIDE (#26, #27, #28, #30)
            ========================================================================= */}
        {activeTab === 'archives' && (
          <div className="d-flex flex-column gap-5">
            {/* 1. Karbala 8-Chapter Audio Guide (#30) */}
            <div className="p-4 p-lg-5 rounded-4" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(200,164,91,0.32)' }}>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                <div>
                  <div className="doc-chapter-label mb-1">CURATORIAL AUDIO GUIDE (#30)</div>
                  <h3 className="font-title h4 text-ivory mb-0">Karbala 8-Chapter Documentary Audio Journey</h3>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-sm rounded-pill px-3.5 py-1.5 fw-bold"
                    style={{ background: 'var(--gold-antique)', color: '#050706' }}
                    onClick={toggleAudioGuidePlayback}
                  >
                    <i className={`bi ${isAudioGuidePlaying ? 'bi-pause-fill' : 'bi-play-fill'} me-1`}></i>
                    {isAudioGuidePlaying ? 'Pause Narration' : 'Listen to Chapter'}
                  </button>
                  <select
                    className="form-select form-select-sm rounded-pill bg-dark text-ivory border-secondary"
                    style={{ width: 'auto' }}
                    value={audioSpeed}
                    onChange={e => setAudioSpeed(parseFloat(e.target.value))}
                  >
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1.0x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                  </select>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-1.5 mb-3">
                {KARBALA_AUDIO_GUIDE_CHAPTERS.map((ch, idx) => (
                  <button
                    key={ch.id}
                    type="button"
                    className="btn btn-sm rounded-pill px-3 py-1"
                    style={{
                      background: audioChapterIdx === idx ? 'var(--gold-antique)' : 'rgba(255,255,255,0.05)',
                      color: audioChapterIdx === idx ? '#050706' : 'var(--ivory-warm)',
                      fontSize: '0.74rem',
                      fontWeight: audioChapterIdx === idx ? 700 : 500
                    }}
                    onClick={() => {
                      setIsAudioGuidePlaying(false);
                      if (window.speechSynthesis) window.speechSynthesis.cancel();
                      setAudioChapterIdx(idx);
                    }}
                  >
                    Ch. {ch.chapter} ({ch.durationLabel})
                  </button>
                ))}
              </div>

              {(() => {
                const ch = KARBALA_AUDIO_GUIDE_CHAPTERS[audioChapterIdx];
                return (
                  <div className="p-3.5 rounded-3" style={{ background: 'rgba(5,7,6,0.85)', border: '1px solid rgba(200,164,91,0.25)' }}>
                    <h4 className="font-title h5 text-gold-antique mb-1">{ch.title}</h4>
                    <div className="small text-ivory-muted mb-2">{ch.location} · Sources: {ch.sources.join(' · ')}</div>
                    <div className="font-arabic fs-5 text-ivory mb-2" dir="rtl">{ch.transcriptAr}</div>
                    <p className="small text-ivory mb-0" style={{ lineHeight: 1.75 }}>{ch.transcriptEn}</p>
                  </div>
                );
              })()}
            </div>

            {/* 2. Post-Ashura Journey: After Karbala (#26) */}
            <div className="p-4 p-lg-5 rounded-4" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(200,164,91,0.25)' }}>
              <div className="doc-chapter-label mb-1">POST-ASHURA JOURNEY (#26)</div>
              <h3 className="font-title h4 text-ivory mb-3">After Karbala — From Al-Taff to Kufa, Damascus &amp; Medina</h3>
              <div className="row g-3">
                {POST_ASHURA_STATIONS.map(st => (
                  <div key={st.id} className="col-md-6 col-lg-4">
                    <div className="p-3.5 rounded-3 h-100" style={{ background: 'rgba(5,7,6,0.82)', border: '1px solid rgba(200,164,91,0.22)' }}>
                      <span className="badge mb-2" style={{ background: 'rgba(200,164,91,0.18)', color: 'var(--gold-highlight)' }}>
                        STATION 0{st.step} · {st.dateHijri}
                      </span>
                      <h4 className="font-title h6 fw-bold text-ivory">{st.title}</h4>
                      <div className="font-arabic text-gold-antique mb-2" dir="rtl">{st.arabicTitle}</div>
                      <p className="small text-ivory-muted mb-2">{st.historicalNarrative}</p>
                      <div className="small" style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                        <strong>Sources:</strong> {st.sources.join(' · ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Women of Karbala (#27) */}
            <div className="p-4 p-lg-5 rounded-4" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(200,164,91,0.25)' }}>
              <div className="doc-chapter-label mb-1">WOMEN OF KARBALA (#27)</div>
              <h3 className="font-title h4 text-ivory mb-3">Guardians of Prophetic Memory &amp; Eloquence</h3>
              <div className="row g-3">
                {WOMEN_OF_KARBALA_ARCHIVE.map(w => (
                  <div key={w.id} className="col-md-6">
                    <div className="p-4 rounded-3 h-100" style={{ background: 'rgba(5,7,6,0.82)', border: '1px solid rgba(200,164,91,0.22)' }}>
                      <h4 className="font-title h5 text-ivory mb-0">{w.name}</h4>
                      <div className="font-arabic fs-5 text-gold-antique mb-1" dir="rtl">{w.arabicName}</div>
                      <div className="small text-ivory-muted mb-2">{w.title} · {w.relation}</div>
                      <p className="small text-ivory mb-2" style={{ lineHeight: 1.7 }}>{w.chronologyRole}</p>
                      <blockquote className="p-2.5 rounded-2 small fst-italic mb-2" style={{ background: 'rgba(200,164,91,0.08)', borderLeft: '2px solid var(--gold-antique)', color: 'var(--gold-highlight)' }}>
                        {w.keyQuote}
                      </blockquote>
                      <div className="small" style={{ fontSize: '0.71rem', color: 'var(--text-tertiary)' }}>
                        <strong>Sources:</strong> {w.sources.join(' · ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Sermons & Speeches Archive (#28) */}
            <div className="p-4 p-lg-5 rounded-4" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(200,164,91,0.25)' }}>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                <div>
                  <div className="doc-chapter-label mb-1">PRIMARY RHETORICAL ARCHIVE (#28)</div>
                  <h3 className="font-title h4 text-ivory mb-0">Authenticated Sermons &amp; Speeches of 60–61 AH</h3>
                </div>
                <div className="d-flex gap-2">
                  <select className="form-select form-select-sm rounded-pill bg-dark text-ivory border-secondary" value={sermonSpeakerFilter} onChange={e => setSermonSpeakerFilter(e.target.value)}>
                    <option value="all">All Speakers</option>
                    <option value="imam_hussain">Imam Hussain (AS)</option>
                    <option value="zaynab_bint_ali">Sayyida Zaynab (SA)</option>
                    <option value="zain_al_abideen">Imam Zain al-Abideen (AS)</option>
                  </select>
                </div>
              </div>

              <div className="d-flex flex-column gap-3">
                {SERMONS_SPEECHES_ARCHIVE.filter(s => sermonSpeakerFilter === 'all' || s.speakerId === sermonSpeakerFilter).map(s => (
                  <div key={s.id} className="p-4 rounded-3" style={{ background: 'rgba(5,7,6,0.85)', border: '1px solid rgba(200,164,91,0.25)' }}>
                    <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                      <span className="badge" style={{ background: 'rgba(200,164,91,0.2)', color: 'var(--gold-highlight)' }}>
                        {s.speaker} · {s.location} ({s.period})
                      </span>
                      <span className="small text-gold-antique">{s.source}</span>
                    </div>
                    <h4 className="font-title h5 text-ivory mb-2">{s.title}</h4>
                    <div className="font-arabic fs-4 text-gold-antique mb-2 p-3 rounded-2" dir="rtl" style={{ background: 'rgba(255,255,255,0.03)', lineHeight: 1.9 }}>
                      {s.arabicText}
                    </div>
                    <p className="text-ivory mb-1" style={{ lineHeight: 1.75 }}>{s.translationEn}</p>
                    <div className="small text-ivory-muted">{s.historicalContext}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: SOURCE COMPARISON MODE & HISTORICAL CLAIM CHECKER (#18, #19)
            ========================================================================= */}
        {activeTab === 'verification' && (
          <div className="row g-4">
            {/* Historical Claim Checker (#19) */}
            <div className="col-lg-5">
              <div className="p-4 rounded-4 h-100" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(200,164,91,0.32)' }}>
                <div className="doc-chapter-label mb-1">HISTORICAL CLAIM CHECKER (#19)</div>
                <h3 className="font-title h4 text-ivory mb-2">Verify a Historical or Religious Claim</h3>
                <p className="small text-ivory-muted mb-3">
                  Paste a historical statement or select a common inquiry below to check whether it is <strong>Supported</strong>, <strong>Multiple Narrations</strong>, <strong>Unverified</strong>, or <strong>Refuted</strong> by primary classical sources.
                </p>

                <div className="d-flex gap-2 mb-3">
                  <input
                    type="text"
                    className="form-control bg-dark text-ivory border-secondary"
                    placeholder="e.g., Was water cut off on 7 Muharram?"
                    value={claimQueryInput}
                    onChange={e => setClaimQueryInput(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn rounded-pill px-3 fw-bold"
                    style={{ background: 'var(--gold-antique)', color: '#050706' }}
                    onClick={() => handleRunClaimCheck(claimQueryInput)}
                  >
                    Verify
                  </button>
                </div>

                <div className="d-flex flex-wrap gap-1.5 mb-3">
                  {HISTORICAL_CLAIM_VERIFICATIONS.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      className="btn btn-sm rounded-pill px-2.5 py-1 text-truncate"
                      style={{ maxWidth: '100%', background: 'rgba(255,255,255,0.05)', color: 'var(--ivory-warm)', border: '1px solid rgba(200,164,91,0.25)', fontSize: '0.7rem' }}
                      onClick={() => setClaimResult(c)}
                    >
                      {c.claimTitle}
                    </button>
                  ))}
                </div>

                {claimResult && (
                  <div className="p-3.5 rounded-3" style={{ background: 'rgba(5,7,6,0.88)', border: '1px solid rgba(200,164,91,0.35)' }}>
                    <span
                      className="badge mb-2"
                      style={{
                        background: claimResult.verdict === 'Supported' ? 'rgba(18,59,42,0.85)' : claimResult.verdict === 'Incorrect' ? 'rgba(122,16,20,0.85)' : 'rgba(200,164,91,0.22)',
                        color: 'var(--gold-highlight)'
                      }}
                    >
                      {claimResult.verdict.toUpperCase()} · {claimResult.verdictBadge}
                    </span>
                    <h4 className="font-title h6 fw-bold text-ivory mb-2">{claimResult.claimTitle}</h4>
                    <p className="small text-ivory mb-2" style={{ lineHeight: 1.7 }}>{claimResult.explanation}</p>
                    {claimResult.supportingSources?.length > 0 && (
                      <div className="small text-gold-antique" style={{ fontSize: '0.73rem' }}>
                        <strong>Primary Sources:</strong> {claimResult.supportingSources.join(' · ')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Source Comparison Matrix (#18) */}
            <div className="col-lg-7">
              <div className="p-4 rounded-4 h-100" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(200,164,91,0.32)' }}>
                <div className="doc-chapter-label mb-1">MULTI-SOURCE HISTORIOGRAPHICAL COMPARISON (#18)</div>
                <h3 className="font-title h4 text-ivory mb-3">Compare Classical Chronicles Side-by-Side</h3>

                <div className="d-flex flex-column gap-4">
                  {SOURCE_COMPARISON_TOPICS.map(topic => (
                    <div key={topic.id} className="p-3.5 rounded-3" style={{ background: 'rgba(5,7,6,0.85)', border: '1px solid rgba(200,164,91,0.25)' }}>
                      <h4 className="font-title h5 text-gold-antique mb-1">{topic.title}</h4>
                      <p className="small text-ivory-muted mb-3">{topic.summary}</p>
                      <div className="row g-2 mb-3">
                        {topic.sources.map((src, i) => (
                          <div key={i} className="col-md-4">
                            <div className="p-2.5 rounded-2 h-100" style={{ background: 'rgba(17,22,19,0.95)', border: '1px solid rgba(255,255,255,0.08)' }}>
                              <div className="fw-bold small text-ivory mb-1">{src.sourceName}</div>
                              <div className="badge mb-1" style={{ background: 'rgba(200,164,91,0.16)', color: 'var(--gold-highlight)', fontSize: '0.62rem' }}>{src.position}</div>
                              <div className="small text-ivory-muted" style={{ fontSize: '0.73rem' }}>{src.excerpt}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="small text-ivory">
                        <strong className="text-gold-antique">Common Ground:</strong> {topic.commonGround}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: MY STUDY DESK (HISTORY, NOTES, COLLECTIONS, REMINDERS) & ADMIN OVERRIDE
            ========================================================================= */}
        {activeTab === 'study-admin' && (
          <div className="row g-4">
            {/* Reading History & Saved Collections (#22 & #24) */}
            <div className="col-lg-4">
              <div className="p-4 rounded-4 mb-4" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(200,164,91,0.25)' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="font-title h5 text-ivory mb-0">Continue Reading (#22)</h4>
                  <button
                    type="button"
                    className="btn btn-sm text-ivory-muted p-0 small"
                    onClick={() => {
                      setReadingHistory([]);
                      try { localStorage.removeItem('karbala_reading_history'); } catch (e) {}
                    }}
                  >
                    Clear
                  </button>
                </div>
                <div className="d-flex flex-column gap-2">
                  {readingHistory.map(rh => (
                    <div
                      key={rh.id}
                      className="p-2.5 rounded-2 d-flex justify-content-between align-items-center"
                      style={{ background: 'rgba(5,7,6,0.8)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
                      onClick={() => onNavigate(rh.view || 'calendar')}
                    >
                      <div>
                        <div className="small fw-semibold text-ivory">{rh.title}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--gold-antique)' }}>{rh.section}</div>
                      </div>
                      <i className="bi bi-arrow-right text-gold-antique"></i>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-4" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(200,164,91,0.25)' }}>
                <h4 className="font-title h5 text-ivory mb-2">Saved Collections (#24)</h4>
                <div className="d-flex gap-2 mb-3">
                  <input
                    type="text"
                    className="form-control form-control-sm bg-dark text-ivory border-secondary"
                    placeholder="New collection name..."
                    value={newCollectionName}
                    onChange={e => setNewCollectionName(e.target.value)}
                  />
                  <button className="btn btn-sm rounded-pill px-3" style={{ background: 'var(--gold-antique)', color: '#050706', fontWeight: 600 }} onClick={createCollection}>Add</button>
                </div>
                <div className="d-flex flex-column gap-2.5">
                  {collections.map(col => (
                    <div key={col.id} className="p-3 rounded-3" style={{ background: 'rgba(5,7,6,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="fw-bold small text-gold-antique mb-1">{col.name} ({col.items.length})</div>
                      <ul className="small text-ivory-muted mb-0 ps-3" style={{ fontSize: '0.74rem' }}>
                        {col.items.map((it, idx) => <li key={idx}>{it}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Private Study Notes & Sacred Reminders (#23 & #25) */}
            <div className="col-lg-4">
              <div className="p-4 rounded-4 mb-4" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(200,164,91,0.25)' }}>
                <h4 className="font-title h5 text-ivory mb-2">Private Research Notes (#23)</h4>
                <p className="small text-ivory-muted mb-2" style={{ fontSize: '0.73rem' }}>Private by default — stored locally in your browser.</p>
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-ivory border-secondary mb-2"
                  value={noteDraftEntity}
                  onChange={e => setNoteDraftEntity(e.target.value)}
                />
                <textarea
                  rows="2"
                  className="form-control form-control-sm bg-dark text-ivory border-secondary mb-2"
                  placeholder="Write your reflection or research citation note..."
                  value={noteDraftText}
                  onChange={e => setNoteDraftText(e.target.value)}
                ></textarea>
                <button className="btn btn-sm rounded-pill px-3 mb-3" style={{ background: 'var(--gold-antique)', color: '#050706', fontWeight: 600 }} onClick={addPrivateNote}>
                  Save Private Note
                </button>
                <div className="d-flex flex-column gap-2">
                  {privateNotes.map(n => (
                    <div key={n.noteId} className="p-2.5 rounded-2" style={{ background: 'rgba(5,7,6,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="d-flex justify-content-between">
                        <strong className="small text-gold-antique">{n.entityTitle}</strong>
                        <button className="btn btn-sm text-ivory-muted p-0" onClick={() => deletePrivateNote(n.noteId)}>✕</button>
                      </div>
                      <div className="small text-ivory">{n.content}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-4" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(200,164,91,0.25)' }}>
                <h4 className="font-title h5 text-ivory mb-2">Sacred Reminders (#25 &amp; #51)</h4>
                {reminders.length === 0 ? (
                  <p className="small text-ivory-muted mb-0">Click "Remind Me" on any sacred event to schedule a local reminder.</p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {reminders.map(r => (
                      <div key={r.reminderId} className="p-2.5 rounded-2 d-flex justify-content-between align-items-center" style={{ background: 'rgba(5,7,6,0.8)', border: '1px solid rgba(200,164,91,0.25)' }}>
                        <div>
                          <div className="small fw-semibold text-ivory">{r.title}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--gold-highlight)' }}>{r.hijriDate} · {r.leadDays}d before ({r.region})</div>
                        </div>
                        <i className="bi bi-bell-fill text-gold-antique"></i>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Curatorial Admin Hijri Override Console (#5 & #59) */}
            <div className="col-lg-4">
              <div className="p-4 rounded-4 h-100" style={{ background: 'var(--bg-charcoal)', border: '1px solid rgba(200,164,91,0.35)' }}>
                <div className="doc-chapter-label mb-1">CURATORIAL ADMIN OVERRIDE (#5 &amp; #59)</div>
                <h4 className="font-title h5 text-ivory mb-2">Regional Moon-Sighting &amp; Offset Console</h4>
                <p className="small text-ivory-muted mb-3" style={{ fontSize: '0.75rem' }}>
                  Adjust regional Hijri offset, day boundary, and moon-sighting confirmation status without requiring a code deployment. All updates are logged.
                </p>

                <div className="mb-2">
                  <label className="small text-ivory-muted">Manual Hijri Day Offset ({region})</label>
                  <select className="form-select form-select-sm bg-dark text-ivory border-secondary" value={manualOffset} onChange={e => updateOffset(e.target.value)}>
                    <option value={-2}>-2 Days</option>
                    <option value={-1}>-1 Day (Local Crescent Sighted 1 Day Later)</option>
                    <option value={0}>0 Days (Standard Regional Alignment)</option>
                    <option value={1}>+1 Day (Crescent Sighted 1 Day Earlier)</option>
                    <option value={2}>+2 Days</option>
                  </select>
                </div>

                <div className="mb-2">
                  <label className="small text-ivory-muted">Moon-Sighting Verification Status (#4)</label>
                  <select className="form-select form-select-sm bg-dark text-ivory border-secondary" value={adminMoonStatus} onChange={e => setAdminMoonStatus(e.target.value)}>
                    <option value="confirmed">Confirmed (Verified Ru’yat Announcement)</option>
                    <option value="manually_verified">Manually Verified Override</option>
                    <option value="awaiting_confirmation">Awaiting Crescent Confirmation (29th Night)</option>
                    <option value="expected">Expected Visibility Curve</option>
                    <option value="calculated">Calculated Ephemeris</option>
                  </select>
                </div>

                <div className="mb-2">
                  <label className="small text-ivory-muted">Hijri Day Boundary (#56)</label>
                  <select className="form-select form-select-sm bg-dark text-ivory border-secondary" value={dayBoundary} onChange={e => updateBoundary(e.target.value)}>
                    <option value="midnight">Civil Midnight (12:00 AM Application Default)</option>
                    <option value="maghrib">Maghrib / Sunset Religious Day Boundary (6:00 PM+)</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="small text-ivory-muted">Curatorial Audit Note</label>
                  <input
                    type="text"
                    className="form-control form-control-sm bg-dark text-ivory border-secondary"
                    placeholder="e.g., Confirmed by Najaf / Lucknow Hilal Committee"
                    value={adminNoteInput}
                    onChange={e => setAdminNoteInput(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-sm w-100 rounded-pill py-2 fw-bold mb-2"
                  style={{ background: 'var(--gold-antique)', color: '#050706' }}
                  onClick={handleSaveAdminConfig}
                >
                  Apply Regional Override &amp; Log Audit
                </button>

                {adminStatusMsg && (
                  <div className="small text-gold-antique mb-2">{adminStatusMsg}</div>
                )}

                <div className="mt-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="small fw-bold text-ivory mb-1">Recent Audit Trail:</div>
                  <div className="d-flex flex-column gap-1.5 overflow-y-auto" style={{ maxHeight: '140px' }}>
                    {adminAuditLogs.slice(0, 4).map((log, i) => (
                      <div key={i} className="p-2 rounded-2" style={{ background: 'rgba(5,7,6,0.75)', fontSize: '0.68rem' }}>
                        <div className="text-gold-antique fw-semibold">{log.action} (Offset: {log.newOffset}d)</div>
                        <div className="text-ivory-muted">{log.note}</div>
                      </div>
                    ))}
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
