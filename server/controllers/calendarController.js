import CalendarEvent from '../models/CalendarEvent.js';
import CalendarConfiguration from '../models/CalendarConfiguration.js';
import { getMongoStatus } from '../config/db.js';

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
  getUpcomingSacredEvents,
  getCompleteTodayState,
  searchSacredCalendar
} from '../../client/js/data/ahlulBaytCalendarData.js';

import { MUHARRAM_DAYS } from '../../client/js/data/timeline.js';
import { PERSONALITIES } from '../../client/js/data/personalities.js';
import { PRESENT_DAY_LOCATIONS, HISTORICAL_61AH_LOCATIONS } from '../../client/js/data/locations.js';
import { HISTORICAL_SOURCES, ENCYCLOPEDIA_PERSONALITIES } from './encyclopediaController.js';

// ============================================================================
// IN-MEMORY CONFIGURATION, AUDIT LOG & RESULT CACHE (#43 & #60)
// ============================================================================
const inMemoryConfigs = new Map();
CALENDAR_REGIONS.forEach(reg => {
  inMemoryConfigs.set(reg.id, {
    region: reg.id,
    label: reg.label,
    timezone: reg.defaultTimezone,
    hijriMethod: reg.hijriMethod,
    moonSightingSource: reg.moonSightingSource,
    moonStatus: reg.moonStatus || 'confirmed',
    manualOffset: 0,
    dayBoundary: 'midnight',
    featuredEventSlug: '',
    adminNote: reg.note,
    lastVerified: new Date().toISOString(),
    auditLog: [
      {
        action: 'Initial Regional Authority Configuration Seeded',
        administrator: 'Karbala Heritage System',
        previousOffset: 0,
        newOffset: 0,
        moonStatus: reg.moonStatus || 'confirmed',
        note: reg.note,
        timestamp: new Date().toISOString()
      }
    ]
  });
});

let inMemoryEventOverrides = new Map(); // eventId -> override fields
const calendarResultCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function invalidateCalendarCache() {
  calendarResultCache.clear();
}

export function getEffectiveEvents() {
  return AHLUL_BAYT_CALENDAR_EVENTS.map(ev => {
    const ov = inMemoryEventOverrides.get(ev.eventId);
    return ov ? { ...ev, ...ov } : ev;
  }).filter(ev => ev.visible !== false);
}

export function getRegionConfigSync(region = 'India') {
  return inMemoryConfigs.get(region) || inMemoryConfigs.get('India') || {
    region: 'India',
    label: 'India (Subcontinent Ru’yat-e-Hilal)',
    timezone: 'Asia/Kolkata',
    hijriMethod: 'Subcontinent Local Crescent Sighting (Ru’yat-e-Hilal)',
    moonSightingSource: 'Local Ru’yat-e-Hilal Committee',
    moonStatus: 'confirmed',
    manualOffset: 0,
    dayBoundary: 'midnight'
  };
}

/**
 * GET /api/calendar/today
 */
export const getCalendarToday = async (req, res) => {
  try {
    const region = req.query.region || 'India';
    const regCfg = getRegionConfigSync(region);
    const timeZone = req.query.tz || req.query.timezone || regCfg.timezone || 'Asia/Kolkata';
    const manualOffset = req.query.offset !== undefined
      ? parseInt(req.query.offset, 10)
      : (regCfg.manualOffset || 0);
    const dayBoundary = req.query.dayBoundary || regCfg.dayBoundary || 'midnight';
    const dateParam = req.query.date ? new Date(req.query.date) : new Date();

    const gregCheck = getZonedGregorianParts(dateParam, timeZone);
    const cacheKey = `today:${region}:${timeZone}:${manualOffset}:${dayBoundary}:${gregCheck.formattedGregorian}`;
    const cached = calendarResultCache.get(cacheKey);
    if (cached && (Date.now() - cached.createdAt < CACHE_TTL_MS)) {
      return res.json({ ...cached.payload, cacheStatus: 'hit' });
    }

    const state = getCompleteTodayState(dateParam, {
      region,
      manualOffset,
      timeZone,
      dayBoundary
    });

    // Connect 61 AH Timeline if in Muharram (1–10)
    let todayIn61Ah = null;
    if (state.hijri.month === 1) {
      todayIn61Ah = MUHARRAM_DAYS.find(d => d.dayNumber === state.hijri.day) || null;
    }

    const payload = {
      status: 'success',
      cacheStatus: 'fresh',
      fallbackSafetyLevel: 'verified_deterministic',
      regionConfig: regCfg,
      ...state,
      todayIn61Ah
    };

    calendarResultCache.set(cacheKey, { createdAt: Date.now(), payload });
    return res.json(payload);
  } catch (err) {
    // Fallback safety (#44 & #60): never return broken date information
    const fallbackState = getCompleteTodayState(new Date(), { region: 'India', manualOffset: 0, timeZone: 'Asia/Kolkata' });
    return res.json({
      status: 'success',
      fallbackSafetyLevel: 'deterministic_fallback',
      fallbackNote: 'Using deterministic local calculation fallback.',
      ...fallbackState
    });
  }
};

/**
 * GET /api/calendar/upcoming
 */
export const getCalendarUpcoming = async (req, res) => {
  try {
    const region = req.query.region || 'India';
    const regCfg = getRegionConfigSync(region);
    const timeZone = req.query.tz || regCfg.timezone || 'Asia/Kolkata';
    const manualOffset = req.query.offset !== undefined ? parseInt(req.query.offset, 10) : (regCfg.manualOffset || 0);
    const filter = req.query.filter || 'all'; // 'tomorrow' | '7days' | '30days' | 'month' | 'all'

    const state = getCompleteTodayState(new Date(), { region, manualOffset, timeZone });
    let events = state.upcoming.allUpcoming;
    if (filter === 'tomorrow') events = state.upcoming.tomorrow;
    else if (filter === '7days') events = state.upcoming.next7Days;
    else if (filter === '30days') events = state.upcoming.next30Days;
    else if (filter === 'month') {
      events = AHLUL_BAYT_CALENDAR_EVENTS.filter(e => e.hijriMonth === state.hijri.month);
    }

    return res.json({
      status: 'success',
      region,
      currentHijri: state.hijri,
      currentGregorian: state.gregorian,
      filter,
      total: events.length,
      events
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * GET /api/calendar/month/:month
 * Supports Hijri month number (1–12) or slug ('muharram', 'safar', etc.)
 */
export const getCalendarMonth = async (req, res) => {
  try {
    const rawMonth = (req.params.month || '1').toString().toLowerCase();
    const region = req.query.region || 'India';
    const regCfg = getRegionConfigSync(region);
    const manualOffset = req.query.offset !== undefined ? parseInt(req.query.offset, 10) : (regCfg.manualOffset || 0);

    let monthObj = HIJRI_MONTHS.find(
      m => m.number === parseInt(rawMonth, 10) || m.slug === rawMonth || m.nameEn.toLowerCase() === rawMonth
    ) || HIJRI_MONTHS[0];

    const todayState = getCompleteTodayState(new Date(), { region, manualOffset, timeZone: regCfg.timezone });
    const targetHijriYear = parseInt(req.query.year, 10) || todayState.hijri.year;

    const daysGrid = [];
    for (let d = 1; d <= 30; d++) {
      const conv = hijriToGregorian({ hijriYear: targetHijriYear, hijriMonth: monthObj.number, hijriDay: d }, { region, manualOffset });
      const dayEvents = getEventsForHijriDate(monthObj.number, d);
      const muharram61Ah = monthObj.number === 1 ? (MUHARRAM_DAYS.find(x => x.dayNumber === d) || null) : null;
      daysGrid.push({
        hijriDay: d,
        hijriMonth: monthObj.number,
        hijriMonthName: monthObj.nameEn,
        hijriYear: targetHijriYear,
        expectedGregorian: conv.gregorian,
        isToday: todayState.hijri.month === monthObj.number && todayState.hijri.day === d && todayState.hijri.year === targetHijriYear,
        events: dayEvents,
        muharram61Ah
      });
    }

    return res.json({
      status: 'success',
      month: monthObj,
      hijriYear: targetHijriYear,
      region,
      varianceDisclaimer: 'Hijri dates may vary by one day depending on regional moon sighting.',
      days: daysGrid
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * GET /api/calendar/date/:month/:day
 */
export const getCalendarDateDetail = async (req, res) => {
  try {
    const rawMonth = (req.params.month || '1').toString().toLowerCase();
    const day = parseInt(req.params.day || '10', 10);
    const region = req.query.region || 'India';
    const regCfg = getRegionConfigSync(region);

    const monthObj = HIJRI_MONTHS.find(
      m => m.number === parseInt(rawMonth, 10) || m.slug === rawMonth || m.nameEn.toLowerCase() === rawMonth
    ) || HIJRI_MONTHS[0];

    const events = getEventsForHijriDate(monthObj.number, day);
    const muharram61Ah = monthObj.number === 1 ? (MUHARRAM_DAYS.find(x => x.dayNumber === day) || null) : null;
    const todayState = getCompleteTodayState(new Date(), { region, manualOffset: regCfg.manualOffset || 0 });
    const expectedGregorian = hijriToGregorian(
      { hijriYear: todayState.hijri.year, hijriMonth: monthObj.number, hijriDay: day },
      { region, manualOffset: regCfg.manualOffset || 0 }
    );

    return res.json({
      status: 'success',
      hijriDate: {
        day,
        month: monthObj.number,
        monthNameEn: monthObj.nameEn,
        monthNameAr: monthObj.nameAr,
        formattedEn: `${day} ${monthObj.nameEn}`,
        sacredSignificance: monthObj.sacredSignificance
      },
      expectedGregorianInCurrentYear: expectedGregorian.gregorian,
      events,
      muharram61Ah,
      navigation: {
        previousDay: day > 1 ? { month: monthObj.slug, day: day - 1 } : { month: HIJRI_MONTHS[(monthObj.number + 10) % 12].slug, day: 30 },
        nextDay: day < 30 ? { month: monthObj.slug, day: day + 1 } : { month: HIJRI_MONTHS[monthObj.number % 12].slug, day: 1 }
      }
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * POST /api/calendar/convert & GET /api/calendar/convert
 */
export const convertCalendarDate = async (req, res) => {
  try {
    const params = { ...req.query, ...req.body };
    const direction = (params.direction || 'g2h').toLowerCase(); // 'g2h' or 'h2g'
    const region = params.region || 'India';
    const regCfg = getRegionConfigSync(region);
    const manualOffset = params.offset !== undefined ? parseInt(params.offset, 10) : (regCfg.manualOffset || 0);

    if (direction === 'h2g' || direction === 'hijri-to-gregorian') {
      const hijriYear = parseInt(params.hijriYear || params.year || 1448, 10);
      const hijriMonth = parseInt(params.hijriMonth || params.month || 1, 10);
      const hijriDay = parseInt(params.hijriDay || params.day || 10, 10);
      const result = hijriToGregorian({ hijriYear, hijriMonth, hijriDay }, { region, manualOffset });
      const matchingEvents = getEventsForHijriDate(hijriMonth, hijriDay);
      return res.json({
        status: 'success',
        direction: 'hijri_to_gregorian',
        ...result,
        events: matchingEvents
      });
    } else {
      let year = parseInt(params.year || 2026, 10);
      let month = parseInt(params.month || 10, 10);
      let day = parseInt(params.day || 29, 10);
      if (params.date && typeof params.date === 'string' && params.date.includes('-')) {
        const parts = params.date.split('-').map(p => parseInt(p, 10));
        if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
          year = parts[0];
          month = parts[1];
          day = parts[2];
        }
      }
      const hijriResult = gregorianToHijri({ year, month, day, hour: 12 }, { region, manualOffset });
      const matchingEvents = getEventsForHijriDate(hijriResult.month, hijriResult.day);
      const gregHistoricalMatches = getEventsForGregorianMonthDay(month, day);
      return res.json({
        status: 'success',
        direction: 'gregorian_to_hijri',
        gregorian: {
          year,
          month,
          day,
          monthName: GREGORIAN_MONTH_NAMES[month - 1],
          formattedGregorian: `${day} ${GREGORIAN_MONTH_NAMES[month - 1]} ${year}`
        },
        hijri: hijriResult,
        events: matchingEvents,
        gregorianHistoricalMatches: gregHistoricalMatches
      });
    }
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * GET /api/events/:slug
 */
export const getEventBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const norm = (slug || '').toLowerCase();
    const allEvents = getEffectiveEvents();
    const ev = allEvents.find(e =>
      (e.slug && e.slug.toLowerCase() === norm) ||
      (e.eventId && e.eventId.toLowerCase() === norm) ||
      (e.slug && e.slug.toLowerCase().includes(norm)) ||
      (norm.includes('ashura') && e.hijriMonth === 1 && e.hijriDay === 10)
    );
    if (!ev) {
      return res.status(404).json({ status: 'error', message: `Event '${slug}' not found in verified dataset.` });
    }

    const relatedPersonalities = PERSONALITIES.filter(p => (ev.personalityIds || []).includes(p.id));
    const relatedLocations = [
      ...PRESENT_DAY_LOCATIONS.filter(l => (ev.locationIds || []).includes(l.id)),
      ...HISTORICAL_61AH_LOCATIONS.filter(l => (ev.locationIds || []).includes(l.id))
    ];
    const relatedSameMonth = allEvents.filter(e => e.hijriMonth === ev.hijriMonth && e.eventId !== ev.eventId);

    return res.json({
      status: 'success',
      event: ev,
      relatedPersonalities,
      relatedLocations,
      relatedEvents: relatedSameMonth,
      seoMetadata: {
        title: `${ev.title} (${ev.hijriDay} ${HIJRI_MONTHS[ev.hijriMonth - 1]?.nameEn}) — Karbala Heritage Archive`,
        description: ev.summary,
        canonicalPath: `/events/${ev.slug}`
      }
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * GET /api/calendar/config & PUT/POST /api/admin/calendar/config
 */
export const getCalendarConfigurations = async (req, res) => {
  try {
    return res.json({
      status: 'success',
      regions: Array.from(inMemoryConfigs.values()),
      hijriMonths: HIJRI_MONTHS,
      totalVerifiedEvents: getEffectiveEvents().length
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

export const updateAdminCalendarConfig = async (req, res) => {
  try {
    const {
      region = 'India',
      manualOffset,
      moonStatus,
      moonSightingSource,
      dayBoundary,
      featuredEventSlug,
      adminNote,
      administrator = 'Curatorial Calendar Administrator'
    } = req.body;

    const existing = getRegionConfigSync(region);
    const prevOffset = existing.manualOffset || 0;
    const nextOffset = manualOffset !== undefined ? Math.max(-3, Math.min(3, parseInt(manualOffset, 10) || 0)) : prevOffset;

    const logEntry = {
      action: `Updated ${region} Calendar Configuration`,
      administrator,
      previousOffset: prevOffset,
      newOffset: nextOffset,
      moonStatus: moonStatus || existing.moonStatus,
      note: adminNote || 'Manual regional moon-sighting / offset update',
      timestamp: new Date().toISOString()
    };

    const updated = {
      ...existing,
      manualOffset: nextOffset,
      moonStatus: moonStatus || existing.moonStatus,
      moonSightingSource: moonSightingSource || existing.moonSightingSource,
      dayBoundary: dayBoundary || existing.dayBoundary,
      featuredEventSlug: featuredEventSlug !== undefined ? featuredEventSlug : existing.featuredEventSlug,
      adminNote: adminNote !== undefined ? adminNote : existing.adminNote,
      lastVerified: new Date().toISOString(),
      auditLog: [logEntry, ...(existing.auditLog || [])].slice(0, 50)
    };

    inMemoryConfigs.set(region, updated);
    invalidateCalendarCache();

    if (getMongoStatus()) {
      try {
        await CalendarConfiguration.findOneAndUpdate(
          { region },
          { $set: updated },
          { upsert: true, new: true }
        );
      } catch (e) {}
    }

    return res.json({
      status: 'success',
      message: `Calendar configuration for ${region} updated and cache invalidated.`,
      config: updated
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * POST /api/claim-check — Historical Claim Checker & Source Comparison (#18 & #19)
 */
export const verifyHistoricalClaim = async (req, res) => {
  try {
    const rawClaim = (req.body.claim || req.query.claim || '').toString().trim();
    if (!rawClaim) {
      return res.json({
        status: 'success',
        featuredClaims: HISTORICAL_CLAIM_VERIFICATIONS,
        comparisonTopics: SOURCE_COMPARISON_TOPICS
      });
    }

    const lower = rawClaim.toLowerCase();

    // 1. Check direct curated claim verification database
    const directMatch = HISTORICAL_CLAIM_VERIFICATIONS.find(item =>
      item.keywords.some(kw => lower.includes(kw)) || item.claimTitle.toLowerCase().includes(lower)
    );

    if (directMatch) {
      return res.json({
        status: 'success',
        query: rawClaim,
        result: directMatch,
        comparisonTopics: SOURCE_COMPARISON_TOPICS
      });
    }

    // 2. Check verified calendar & timeline database
    const calendarMatches = searchSacredCalendar(rawClaim);
    if (calendarMatches.length > 0 && calendarMatches.length <= 6) {
      const top = calendarMatches[0];
      return res.json({
        status: 'success',
        query: rawClaim,
        result: {
          id: `verified_${top.eventId}`,
          claimTitle: top.title,
          verdict: top.dateStatus === 'different_narrations' ? 'Multiple Narrations' : 'Supported',
          verdictBadge: top.dateStatus === 'different_narrations' ? 'MULTIPLE SCHOLARLY NARRATIONS' : 'SUPPORTED BY PRIMARY SOURCES',
          confidence: top.sourceReliability,
          explanation: `${top.fullDescription || top.summary}${top.alternateNarrations ? ` Note on narrations: ${top.alternateNarrations}` : ''}`,
          supportingSources: top.sources || [],
          conflictingSources: top.alternateNarrations ? [top.alternateNarrations] : []
        },
        relatedEvents: calendarMatches.slice(0, 4)
      });
    }

    // 3. Honest unverified response — never fabricate religious claims
    return res.json({
      status: 'success',
      query: rawClaim,
      result: {
        id: 'unverified_query',
        claimTitle: rawClaim,
        verdict: 'Unverified',
        verdictBadge: 'REQUIRES PRIMARY MANUSCRIPT CITATION',
        confidence: 'unverified',
        explanation: 'This specific claim does not match an explicitly verified entry in our primary source database (Al-Tabari, Kitab al-Irshad, Maqtal Abi Mikhnaf, Al-Kafi, Kamil al-Ziyarat, Al-Luhuf). In accordance with our historiographical integrity rules, the platform never invents or confirms religious claims without authenticated textual citations.',
        supportingSources: [],
        conflictingSources: []
      },
      suggestedClaims: HISTORICAL_CLAIM_VERIFICATIONS
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * GET /api/search — Universal Spotlight Search across ALL modules (#20)
 */
export const universalSearch = async (req, res) => {
  try {
    const q = (req.query.q || '').toString().trim().toLowerCase();
    const todayState = getCompleteTodayState(new Date(), { region: req.query.region || 'India' });

    const matchedCalendar = searchSacredCalendar(q, todayState).slice(0, 8).map(e => ({
      id: e.eventId,
      category: 'CALENDAR EVENT',
      title: e.title,
      subtitle: `${e.hijriDay} ${HIJRI_MONTHS[e.hijriMonth - 1]?.nameEn} • ${e.historicalYearAH}`,
      view: 'calendar',
      slug: e.slug
    }));

    const matchedPersonalities = PERSONALITIES.filter(p =>
      !q || [p.name, p.arabicName, p.title, p.summary].join(' ').toLowerCase().includes(q)
    ).slice(0, 6).map(p => ({
      id: p.id,
      category: 'PERSONALITY',
      title: p.name,
      subtitle: `${p.title} • ${p.arabicName || ''}`,
      view: 'personalities'
    }));

    const matchedTimeline = MUHARRAM_DAYS.filter(d =>
      !q || [d.title, d.dateString, d.shortSummary].join(' ').toLowerCase().includes(q)
    ).slice(0, 5).map(d => ({
      id: `muh_${d.dayNumber}`,
      category: '61 AH EVENT',
      title: `${d.dateString}: ${d.title}`,
      subtitle: d.shortSummary,
      view: 'timeline',
      dayNumber: d.dayNumber
    }));

    const matchedLocations = [...PRESENT_DAY_LOCATIONS, ...HISTORICAL_61AH_LOCATIONS].filter(l =>
      !q || [l.name, l.arabicName, l.title, l.summary].join(' ').toLowerCase().includes(q)
    ).slice(0, 6).map(l => ({
      id: l.id,
      category: 'LOCATION',
      title: l.name,
      subtitle: `${l.arabicName || ''} • ${l.category || 'Sacred Site'}`,
      view: 'ziyarat'
    }));

    const matchedSermons = SERMONS_SPEECHES_ARCHIVE.filter(s =>
      !q || [s.title, s.speaker, s.location, s.translationEn].join(' ').toLowerCase().includes(q)
    ).slice(0, 4).map(s => ({
      id: s.id,
      category: 'SERMON & SPEECH',
      title: s.title,
      subtitle: `${s.speaker} • ${s.location} (${s.period})`,
      view: 'calendar'
    }));

    const matchedSources = HISTORICAL_SOURCES.filter(s =>
      !q || [s.title, s.author, s.category].join(' ').toLowerCase().includes(q)
    ).slice(0, 4).map(s => ({
      id: s.id,
      category: 'PRIMARY SOURCE',
      title: s.title,
      subtitle: `${s.author} (${s.century})`,
      view: 'historiography'
    }));

    return res.json({
      status: 'success',
      query: q,
      groups: {
        calendarEvents: matchedCalendar,
        personalities: matchedPersonalities,
        timeline61Ah: matchedTimeline,
        locations: matchedLocations,
        sermons: matchedSermons,
        sources: matchedSources
      }
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
