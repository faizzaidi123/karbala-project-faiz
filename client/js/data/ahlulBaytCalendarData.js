/**
 * Karbala Digital Heritage Platform — Verified Ahlul Bayt Calendar,
 * Deterministic Hijri Date Engine, 61 AH Time Machine & Historical Archives
 */

export const HIJRI_MONTHS = [
  {
    number: 1,
    slug: 'muharram',
    nameEn: 'Muharram',
    nameAr: 'محرم الحرام',
    nameUr: 'محرم الحرام',
    nameHi: 'मुहर्रम अल-हराम',
    nameFa: 'محرم الحرام',
    sacredSignificance: 'The opening month of the Islamic lunar year and the sacred month of mourning for the stand and sacrifice of Imam Hussain (AS), his household, and his companions at Karbala in 61 AH.',
    daysTypical: 30
  },
  {
    number: 2,
    slug: 'safar',
    nameEn: 'Safar',
    nameAr: 'صفر المظفر',
    nameUr: 'صفر المظفر',
    nameHi: 'सफ़र अल-मुज़फ़्फ़र',
    nameFa: 'صفر المظفر',
    sacredSignificance: 'Commemorates the captivity journey to Damascus, the global Arbaeen pilgrimage (20 Safar), and the martyrdom/passing of Prophet Muhammad (SAWW), Imam Hasan (AS), and Imam Ali al-Rida (AS).',
    daysTypical: 29
  },
  {
    number: 3,
    slug: 'rabi-al-awwal',
    nameEn: 'Rabi al-Awwal',
    nameAr: 'ربيع الأول',
    nameUr: 'ربیع الاول',
    nameHi: 'रबी अल-अव्वल',
    nameFa: 'ربیع‌الاول',
    sacredSignificance: 'Marks the Hijrah of the Prophet, the martyrdom of Imam Hasan al-Askari (AS), the commencement of the Imamate of Imam al-Mahdi (AJ), and the blessed Wiladat of Prophet Muhammad (SAWW) and Imam Jafar al-Sadiq (AS).',
    daysTypical: 30
  },
  {
    number: 4,
    slug: 'rabi-al-thani',
    nameEn: 'Rabi al-Thani',
    nameAr: 'ربيع الثاني',
    nameUr: 'ربیع الثانی',
    nameHi: 'रबी अल-सानी',
    nameFa: 'ربیع‌الثانی',
    sacredSignificance: 'Commemorates the blessed Wiladat of Imam Hasan al-Askari (AS) on 8 Rabi al-Thani and the passing of Sayyida Fatima al-Masuma (SA) in Qom on 10 Rabi al-Thani.',
    daysTypical: 29
  },
  {
    number: 5,
    slug: 'jumada-al-awwal',
    nameAr: 'جمادى الأولى',
    nameEn: 'Jumada al-Awwal',
    nameUr: 'جمادی الاول',
    nameHi: 'जुमादा अल-अव्वल',
    nameFa: 'جمادی‌الاول',
    sacredSignificance: 'Honors the blessed Wiladat of Sayyida Zaynab bint Ali (SA) on 5 Jumada al-Awwal and the first scholarly narration (75 days) of the martyrdom of Sayyida Fatima al-Zahra (SA) on 13 Jumada al-Awwal.',
    daysTypical: 30
  },
  {
    number: 6,
    slug: 'jumada-al-thani',
    nameEn: 'Jumada al-Thani',
    nameAr: 'جمادى الآخرة',
    nameUr: 'جمادی الثانی',
    nameHi: 'जुमादा अल-सानी',
    nameFa: 'جمادی‌الثانی',
    sacredSignificance: 'Marks the widely observed narration (95 days) of the martyrdom of Sayyida Fatima al-Zahra (SA) on 3 Jumada al-Thani, the passing of Hazrat Umm al-Banin (SA) on 13 Jumada al-Thani, and the blessed Wiladat of Sayyida Fatima al-Zahra (SA) on 20 Jumada al-Thani.',
    daysTypical: 29
  },
  {
    number: 7,
    slug: 'rajab',
    nameEn: 'Rajab',
    nameAr: 'رجب المرجب',
    nameUr: 'رجب المرجب',
    nameHi: 'रजब अल-मुरज्जब',
    nameFa: 'رجب المرجب',
    sacredSignificance: 'A sacred month witnessing the Wiladat of Imam Muhammad al-Baqir (AS), Imam Ali al-Hadi (AS), Imam Muhammad al-Jawad (AS), and Imam Ali ibn Abi Talib (AS) inside the Kaaba (13 Rajab), the martyrdom of Imam Musa al-Kazim (AS) (25 Rajab), Mab’ath (27 Rajab), and Imam Hussain’s departure from Madinah in 60 AH (28 Rajab).',
    daysTypical: 30
  },
  {
    number: 8,
    slug: 'shaban',
    nameEn: "Sha'ban",
    nameAr: 'شعبان المعظم',
    nameUr: 'شعبان المعظم',
    nameHi: 'शाबान अल-मुअज़्ज़म',
    nameFa: 'شعبان المعظم',
    sacredSignificance: 'The month of the Prophet and the Lights of Karbala: Wiladat of Imam Hussain (AS) (3 Sha’ban), Hazrat Abbas (AS) (4 Sha’ban), Imam Zain al-Abideen (AS) (5 Sha’ban), Hazrat Ali Akbar (AS) (11 Sha’ban), and Imam al-Mahdi (AJ) (15 Sha’ban).',
    daysTypical: 29
  },
  {
    number: 9,
    slug: 'ramadan',
    nameEn: 'Ramadan',
    nameAr: 'شهر رمضان المبارك',
    nameUr: 'رمضان المبارک',
    nameHi: 'रमज़ान अल-मुबारक',
    nameFa: 'رمضان المبارک',
    sacredSignificance: 'The month of revelation, the passing of Sayyida Khadija al-Kubra (SA) (10 Ramadan), the blessed Wiladat of Imam Hasan al-Mujtaba (AS) (15 Ramadan), the strike and martyrdom of Imam Ali ibn Abi Talib (AS) (19–21 Ramadan), and Laylat al-Qadr.',
    daysTypical: 30
  },
  {
    number: 10,
    slug: 'shawwal',
    nameEn: 'Shawwal',
    nameAr: 'شوال المكرم',
    nameUr: 'شوال المکرم',
    nameHi: 'शव्वाल अल-मुकर्रम',
    nameFa: 'شوال المکرم',
    sacredSignificance: 'Opens with Eid al-Fitr (1 Shawwal), commemorates the demolition of Jannat al-Baqi shrines (8 Shawwal), the passing of Hazrat Abu Talib (AS), and the martyrdom of Imam Jafar al-Sadiq (AS) (25 Shawwal).',
    daysTypical: 29
  },
  {
    number: 11,
    slug: 'dhu-al-qadah',
    nameEn: 'Dhu al-Qadah',
    nameAr: 'ذو القعدة الحرام',
    nameUr: 'ذوالقعدہ الحرام',
    nameHi: 'ज़ु अल-क़ादा',
    nameFa: 'ذی‌القعده',
    sacredSignificance: 'One of the four sacred truce months; marks the Wiladat of Sayyida Fatima al-Masuma (SA) (1 Dhu al-Qadah), the Wiladat of Imam Ali al-Rida (AS) (11 Dhu al-Qadah), and the martyrdom of Imam Muhammad al-Jawad (AS) (29/30 Dhu al-Qadah).',
    daysTypical: 30
  },
  {
    number: 12,
    slug: 'dhu-al-hijjah',
    nameEn: 'Dhu al-Hijjah',
    nameAr: 'ذو الحجة الحرام',
    nameUr: 'ذوالحجہ الحرام',
    nameHi: 'ज़ु अल-हिज्जा',
    nameFa: 'ذی‌الحجه',
    sacredSignificance: 'Culminates the lunar year with the sacred marriage of Imam Ali and Sayyida Fatima (1 Dhu al-Hijjah), martyrdom of Imam Muhammad al-Baqir (AS) (7 Dhu al-Hijjah), Imam Hussain’s departure from Makkah toward Iraq (8 Dhu al-Hijjah 60 AH), martyrdom of Muslim ibn Aqeel (9 Dhu al-Hijjah), Eid al-Adha (10), Eid al-Ghadir (18), and Eid al-Mubahala (24).',
    daysTypical: 29
  }
];

export const CALENDAR_REGIONS = [
  {
    id: 'India',
    label: 'India (Subcontinent Ru’yat-e-Hilal)',
    defaultTimezone: 'Asia/Kolkata',
    hijriMethod: 'Subcontinent Local Crescent Sighting (Ru’yat-e-Hilal)',
    moonSightingSource: 'All India Shia Personal Law Board / Imamia Calendar Committees (Lucknow, Mumbai, Hyderabad)',
    defaultOffset: 0,
    moonStatus: 'confirmed',
    note: 'Subcontinent lunar months follow verified naked-eye/optical crescent sighting on the Indian horizon, which frequently falls 1 day after Middle Eastern tabular calendars.'
  },
  {
    id: 'Iraq',
    label: 'Iraq (Najaf al-Ashraf / Karbala)',
    defaultTimezone: 'Asia/Baghdad',
    hijriMethod: 'Najaf al-Ashraf Religious Authority Crescent Sighting',
    moonSightingSource: 'Office of Grand Ayatollah Sayyid Ali al-Husayni al-Sistani (Najaf al-Ashraf)',
    defaultOffset: 0,
    moonStatus: 'confirmed',
    note: 'Follows verified crescent sighting on the Mesopotamian horizon announced in Najaf al-Ashraf and observed at the Holy Shrines of Karbala.'
  },
  {
    id: 'Iran',
    label: 'Iran (Qom & Tehran Horizon)',
    defaultTimezone: 'Asia/Tehran',
    hijriMethod: 'Iranian National & Seminary Crescent Observation',
    moonSightingSource: 'Estehlal Headquarters & Qom Seminary Observatory',
    defaultOffset: 0,
    moonStatus: 'confirmed',
    note: 'Follows official crescent sighting across the Iranian plateau.'
  },
  {
    id: 'Pakistan',
    label: 'Pakistan (Subcontinent Ru’yat-e-Hilal)',
    defaultTimezone: 'Asia/Karachi',
    hijriMethod: 'Pakistan Ru’yat-e-Hilal Crescent Observation',
    moonSightingSource: 'Central & Jafaria Ru’yat-e-Hilal Committees (Karachi, Lahore, Islamabad)',
    defaultOffset: 0,
    moonStatus: 'confirmed',
    note: 'Follows Subcontinent crescent visibility criteria.'
  },
  {
    id: 'Saudi Arabia',
    label: 'Saudi Arabia / Gulf (Umm al-Qura)',
    defaultTimezone: 'Asia/Riyadh',
    hijriMethod: 'Umm al-Qura / Arabian Peninsula Horizon',
    moonSightingSource: 'Umm al-Qura Ephemeris & Eastern Province Crescent Committees',
    defaultOffset: 1,
    moonStatus: 'calculated',
    note: 'Umm al-Qura calculated calendar often precedes ocular crescent sighting in South Asia by 1 day.'
  },
  {
    id: 'United Kingdom',
    label: 'United Kingdom & Europe',
    defaultTimezone: 'Europe/London',
    hijriMethod: 'European Crescent Observation / Najaf Liaison',
    moonSightingSource: 'Najaf Liaison Office London / Majlis Ulama-e-Shia Europe',
    defaultOffset: 0,
    moonStatus: 'confirmed',
    note: 'Follows European & shared horizon crescent visibility criteria.'
  },
  {
    id: 'United States',
    label: 'United States & Canada',
    defaultTimezone: 'America/New_York',
    hijriMethod: 'North American Crescent Sighting',
    moonSightingSource: 'IMAM-US (Imam Mahdi Association of Marjaeya) / North American Crescent Committee',
    defaultOffset: 0,
    moonStatus: 'confirmed',
    note: 'North American western longitudes sometimes sight the new crescent one evening earlier than eastern hemispheres.'
  },
  {
    id: 'Custom',
    label: 'Custom / Scholarly Manual Offset',
    defaultTimezone: 'UTC',
    hijriMethod: 'User / Curator Configured Manual Offset',
    moonSightingSource: 'Custom Local Marja’ / Community Verification',
    defaultOffset: 0,
    moonStatus: 'manually_verified',
    note: 'Allows explicit ±2 day manual offset adjustment to match any local community announcement.'
  }
];

export const GREGORIAN_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const WEEKDAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

/**
 * Extracts year, month (1-12), day (1-31), weekday, and hour in a target timezone safely
 */
export function getZonedGregorianParts(dateInput = new Date(), timeZone) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const safeDate = isNaN(d.getTime()) ? new Date() : d;
  const resolvedTz = timeZone || (typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC') || 'UTC';

  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: resolvedTz,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }).formatToParts(safeDate);

    const map = {};
    parts.forEach(p => { map[p.type] = p.value; });
    const year = parseInt(map.year, 10);
    const month = parseInt(map.month, 10);
    const day = parseInt(map.day, 10);
    const hour = parseInt(map.hour || '12', 10);
    const weekday = map.weekday || WEEKDAY_NAMES[safeDate.getDay()];
    return {
      year,
      month,
      day,
      hour,
      weekday,
      monthName: GREGORIAN_MONTH_NAMES[month - 1] || 'October',
      timeZone: resolvedTz,
      formattedGregorian: `${day} ${GREGORIAN_MONTH_NAMES[month - 1]} ${year}`
    };
  } catch (e) {
    const year = safeDate.getFullYear();
    const month = safeDate.getMonth() + 1;
    const day = safeDate.getDate();
    const hour = safeDate.getHours();
    const weekday = WEEKDAY_NAMES[safeDate.getDay()];
    return {
      year,
      month,
      day,
      hour,
      weekday,
      monthName: GREGORIAN_MONTH_NAMES[month - 1],
      timeZone: 'UTC',
      formattedGregorian: `${day} ${GREGORIAN_MONTH_NAMES[month - 1]} ${year}`
    };
  }
}

/**
 * Deterministic Julian Day Number from Gregorian Year, Month (1-12), Day (1-31)
 */
export function gregorianToJulianDay(year, month, day) {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;
}

/**
 * Deterministic Gregorian Year, Month, Day from Julian Day Number
 */
export function julianDayToGregorian(jd) {
  const z = Math.floor(jd);
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);
  const day = b - d - Math.floor(30.6001 * e);
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;
  const dt = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const weekday = WEEKDAY_NAMES[dt.getUTCDay()];
  return {
    year,
    month,
    day,
    weekday,
    monthName: GREGORIAN_MONTH_NAMES[month - 1],
    formattedGregorian: `${day} ${GREGORIAN_MONTH_NAMES[month - 1]} ${year}`
  };
}

/**
 * Converts eastern Arabic numerals for Arabic Hijri display
 */
export function toArabicNumerals(num) {
  const map = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/[0-9]/g, d => map[parseInt(d, 10)]);
}

/**
 * Deterministic Gregorian -> Hijri conversion with regional offset & sunset boundary support.
 * Anchored to the standard Islamic Civil / Tabular lunar cycle (so 29 October 2026 = 17 Jumada al-Awwal 1448 AH at offset 0).
 */
export function gregorianToHijri(
  { year, month, day, hour = 12 },
  { region = 'India', manualOffset = 0, dayBoundary = 'midnight' } = {}
) {
  const regionMeta = CALENDAR_REGIONS.find(r => r.id === region) || CALENDAR_REGIONS[0];
  const sunsetShift = (dayBoundary === 'maghrib' && hour >= 18) ? 1 : 0;
  const totalOffset = (regionMeta.defaultOffset || 0) + (parseInt(manualOffset, 10) || 0) + sunsetShift;

  const baseJd = gregorianToJulianDay(year, month, day) + totalOffset;
  const shiftedGreg = julianDayToGregorian(baseJd);

  let hDay = 1;
  let hMonth = 1;
  let hYear = 1448;
  let calculationMethod = 'deterministic_islamic_civil';

  try {
    const utcNoon = new Date(Date.UTC(shiftedGreg.year, shiftedGreg.month - 1, shiftedGreg.day, 12, 0, 0));
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-civil', {
      timeZone: 'UTC',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }).formatToParts(utcNoon);
    const pMap = {};
    parts.forEach(p => { pMap[p.type] = p.value; });
    hDay = parseInt(pMap.day, 10);
    hMonth = parseInt(pMap.month, 10);
    hYear = parseInt((pMap.year || '1448').replace(/[^0-9]/g, ''), 10);
  } catch (err) {
    // Pure mathematical Kuwaiti/Tabular fallback if Intl islamic-civil is unavailable
    calculationMethod = 'tabular_algorithmic_fallback';
    const l = baseJd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j = (Math.floor((10985 - l2) / 5316)) * (Math.floor((50 * l2) / 17719)) + (Math.floor(l2 / 5670)) * (Math.floor((43 * l2) / 15238));
    const l3 = l2 - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
    hMonth = Math.floor((24 * l3) / 709);
    hDay = l3 - Math.floor((709 * hMonth) / 24);
    hYear = 30 * n + j - 30;
  }

  const monthObj = HIJRI_MONTHS[(hMonth - 1 + 12) % 12] || HIJRI_MONTHS[0];

  // Also compute ±1 day adjacent possibilities for regional moon-sighting transparency
  const prevJd = baseJd - 1;
  const nextJd = baseJd + 1;
  const getSimpleHijri = (jdVal) => {
    const g = julianDayToGregorian(jdVal);
    try {
      const dt = new Date(Date.UTC(g.year, g.month - 1, g.day, 12, 0, 0));
      const pts = new Intl.DateTimeFormat('en-u-ca-islamic-civil', { timeZone: 'UTC', day: 'numeric', month: 'numeric', year: 'numeric' }).formatToParts(dt);
      const pm = {};
      pts.forEach(p => { pm[p.type] = p.value; });
      const d = parseInt(pm.day, 10);
      const m = parseInt(pm.month, 10);
      const y = parseInt((pm.year || '1448').replace(/[^0-9]/g, ''), 10);
      const mObj = HIJRI_MONTHS[(m - 1 + 12) % 12] || HIJRI_MONTHS[0];
      return { day: d, month: m, year: y, monthName: mObj.nameEn, formatted: `${d} ${mObj.nameEn} ${y} AH` };
    } catch (e) {
      return { day: hDay, month: hMonth, year: hYear, monthName: monthObj.nameEn, formatted: `${hDay} ${monthObj.nameEn} ${hYear} AH` };
    }
  };

  return {
    day: hDay,
    month: hMonth,
    year: hYear,
    monthSlug: monthObj.slug,
    monthNameEn: monthObj.nameEn,
    monthNameAr: monthObj.nameAr,
    monthNameUr: monthObj.nameUr,
    monthNameHi: monthObj.nameHi,
    monthNameFa: monthObj.nameFa,
    sacredSignificance: monthObj.sacredSignificance,
    formattedHijriEn: `${hDay} ${monthObj.nameEn} ${hYear} AH`,
    formattedHijriAr: `${toArabicNumerals(hDay)} ${monthObj.nameAr} ${toArabicNumerals(hYear)} هـ`,
    region: regionMeta.id,
    regionLabel: regionMeta.label,
    hijriMethod: regionMeta.hijriMethod,
    moonSightingSource: regionMeta.moonSightingSource,
    moonStatus: manualOffset !== 0 ? 'manually_verified' : regionMeta.moonStatus,
    appliedOffsetDays: totalOffset,
    dayBoundary,
    calculationMethod,
    varianceDisclaimer: 'Hijri dates may vary by one day depending on regional moon sighting.',
    adjacentPossibilities: {
      minusOneDay: getSimpleHijri(prevJd),
      plusOneDay: getSimpleHijri(nextJd)
    }
  };
}

/**
 * Deterministic Hijri -> Gregorian conversion
 */
export function hijriToGregorian(
  { hijriYear = 1448, hijriMonth = 1, hijriDay = 10 },
  { region = 'India', manualOffset = 0 } = {}
) {
  const regionMeta = CALENDAR_REGIONS.find(r => r.id === region) || CALENDAR_REGIONS[0];
  const totalOffset = (regionMeta.defaultOffset || 0) + (parseInt(manualOffset, 10) || 0);

  // Estimate Julian Day using tabular formula, then refine via exact gregorianToHijri search within ±4 days
  const estJd = Math.floor((11 * hijriYear + 3) / 30) + 354 * hijriYear + 30 * hijriMonth - Math.floor((hijriMonth - 1) / 2) + hijriDay + 1948440 - 385 - totalOffset;

  let bestJd = estJd;
  for (let delta = -5; delta <= 5; delta++) {
    const candidateGreg = julianDayToGregorian(estJd + delta);
    const checkHijri = gregorianToHijri(candidateGreg, { region, manualOffset, dayBoundary: 'midnight' });
    if (checkHijri.year === parseInt(hijriYear, 10) && checkHijri.month === parseInt(hijriMonth, 10) && checkHijri.day === parseInt(hijriDay, 10)) {
      bestJd = estJd + delta;
      break;
    }
  }

  const matchedGreg = julianDayToGregorian(bestJd);
  const monthObj = HIJRI_MONTHS[(hijriMonth - 1 + 12) % 12] || HIJRI_MONTHS[0];

  return {
    gregorian: matchedGreg,
    hijri: {
      day: parseInt(hijriDay, 10),
      month: parseInt(hijriMonth, 10),
      year: parseInt(hijriYear, 10),
      monthNameEn: monthObj.nameEn,
      formattedHijriEn: `${hijriDay} ${monthObj.nameEn} ${hijriYear} AH`,
      formattedHijriAr: `${toArabicNumerals(hijriDay)} ${monthObj.nameAr} ${toArabicNumerals(hijriYear)} هـ`
    },
    region: regionMeta.id,
    hijriMethod: regionMeta.hijriMethod,
    varianceDisclaimer: 'May vary by one day depending on regional moon sighting.'
  };
}

/**
 * Astronomical Lunar Phase & Illumination Calculator (Strictly Informational — Separated from Religious Ru'yat)
 */
export function getAstronomicalMoonPhase(dateInput = new Date()) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const synodicMonth = 29.530588853;
  // Known New Moon reference: 2000-01-06 18:14 UTC
  const refNewMoonMs = Date.UTC(2000, 0, 6, 18, 14, 0);
  const diffDays = (d.getTime() - refNewMoonMs) / (1000 * 60 * 60 * 24);
  const cycleProgress = ((diffDays % synodicMonth) + synodicMonth) % synodicMonth;
  const normalizedPhase = cycleProgress / synodicMonth; // 0 to 1
  const illuminationPct = Math.round(((1 - Math.cos(normalizedPhase * 2 * Math.PI)) / 2) * 100);

  let phaseName = 'Waxing Crescent';
  if (normalizedPhase < 0.03 || normalizedPhase > 0.97) phaseName = 'New Moon (Conjunction)';
  else if (normalizedPhase < 0.22) phaseName = 'Waxing Crescent (Hilal)';
  else if (normalizedPhase < 0.28) phaseName = 'First Quarter';
  else if (normalizedPhase < 0.47) phaseName = 'Waxing Gibbous';
  else if (normalizedPhase < 0.53) phaseName = 'Full Moon (Badr)';
  else if (normalizedPhase < 0.72) phaseName = 'Waning Gibbous';
  else if (normalizedPhase < 0.78) phaseName = 'Last Quarter';
  else phaseName = 'Waning Crescent';

  return {
    lunarAgeDays: Number(cycleProgress.toFixed(1)),
    illuminationPct,
    normalizedPhase: Number(normalizedPhase.toFixed(3)),
    phaseName,
    separationNote: 'Astronomical moon phase and illumination are informational telemetry only and do not replace religious crescent sighting (Ru’yat al-Hilal).'
  };
}

/**
 * Verified Ahlul Bayt & Karbala Calendar Event Dataset
 * Every entry includes classical sources, confidence status, alternate narrations, and multilingual translations.
 */
export const AHLUL_BAYT_CALENDAR_EVENTS = [
  // ======================== 1. MUHARRAM (1–25) ========================
  {
    eventId: 'ev_muh_01',
    slug: '1-muharram-opening-of-sacred-mourning',
    title: 'Opening of the Sacred Month of Muharram & Approach to Karbala (61 AH)',
    arabicTitle: 'غرة محرم الحرام — مسير ركب الحسين نحو كربلاء',
    eventType: 'karbala',
    hijriDay: 1,
    hijriMonth: 1,
    historicalYearAH: '61 AH',
    gregorianHistoricalDate: '1 October 680 CE',
    gregorianMonthDay: { month: 10, day: 1 },
    personalityIds: ['imam_hussain', 'abbas_ibn_ali', 'zaynab_bint_ali', 'hurr_ibn_yazid'],
    locationIds: ['historical_encampment'],
    summary: 'The caravan of Imam Hussain (AS), shadowed by the Kufan vanguard of Hurr ibn Yazid al-Riyahi from Qasr Bani Muqatil, advances toward Ninawa and the plains of Karbala.',
    fullDescription: 'On 1 Muharram 61 AH, following the confrontation at Dhu Husam and the night departure from Qasr Bani Muqatil, Imam Hussain (AS) and his household traveled northward along the western edge of the Euphrates alluvial plain under the watchful escort of Hurr ibn Yazid’s 1,000 horsemen.',
    sources: ['Tarikh al-Tabari, Vol. 5, pp. 406–408', 'Kitab al-Irshad by Shaykh al-Mufid, pp. 368–370', 'Maqtal Abi Mikhnaf'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Commencement of the 10-day Ashura mourning period across all Shia communities.',
    recommendedZiyarat: 'ziyarat_ashura',
    importance: 'high',
    translations: {
      en: 'Opening of Muharram & Caravan Approach to Karbala (61 AH)',
      ar: 'غرة محرم الحرام — مسير ركب الإمام الحسين نحو كربلاء',
      ur: 'یکم محرم الحرام — قافلۂ حسینی کا کربلا کی جانب سفر',
      ro: '1 Muharram — Qafila-e-Hussaini ka Karbala ki janib safar',
      hi: '१ मुहर्रम — इमाम हुसैन के काफ़िले का कर्बला की ओर प्रस्थान',
      fa: 'اول محرم الحرام — حرکت کاروان حسینی به سوی کربلا'
    }
  },
  {
    eventId: 'ev_muh_02',
    slug: '2-muharram-arrival-at-karbala',
    title: 'Arrival of Imam Hussain (AS) at the Plains of Karbala (Inzal al-Rihal)',
    arabicTitle: 'ورود ركب الإمام الحسين عليه السلام أرض كربلاء (٢ محرم ٦١ هـ)',
    eventType: 'karbala',
    hijriDay: 2,
    hijriMonth: 1,
    historicalYearAH: '61 AH',
    gregorianHistoricalDate: '2 October 680 CE',
    gregorianMonthDay: { month: 10, day: 2 },
    personalityIds: ['imam_hussain', 'abbas_ibn_ali', 'zaynab_bint_ali', 'hurr_ibn_yazid'],
    locationIds: ['historical_encampment', 'mukhayam_present'],
    summary: 'On Thursday, 2 Muharram 61 AH, the caravan of Imam Hussain (AS) halts on the plain of Karbala (Al-Taff / Ninawa) and establishes the sacred encampment.',
    fullDescription: 'Imam Hussain (AS) inquired of the local inhabitants regarding the name of the land. Upon hearing "Karbala", he wept, recalled the prophecy of Prophet Muhammad (SAWW), ordered the tents to be pitched, and purchased the surrounding tract from the elders of Banu Asad.',
    sources: ['Abu Mikhnaf, Maqtal al-Husayn', 'Tarikh al-Tabari, Vol. 5, pp. 408–410', 'Kitab al-Irshad, p. 370', 'Al-Luhuf by Sayyid Ibn Tawus'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Unanimously attested by early Kufan and Baghdadi historiographers.',
    recommendedZiyarat: 'ziyarat_warith',
    importance: 'critical',
    translations: {
      en: 'Arrival of Imam Hussain (AS) at Karbala (2 Muharram 61 AH)',
      ar: 'نزول الإمام الحسين عليه السلام في أرض كربلاء',
      ur: 'ورودِ قافلۂ امام حسینؑ بہ سرزمینِ کربلا (۲ محرم ۶۱ھ)',
      ro: 'Imam Hussain (AS) ki sarzameen-e-Karbala par aamad (2 Muharram 61 AH)',
      hi: 'इमाम हुसैन (अ.स.) का कर्बला की भूमि पर आगमन (२ मुहर्रम ६१ हिजरी)',
      fa: 'ورود کاروان امام حسین علیه‌السلام به سرزمین کربلا'
    }
  },
  {
    eventId: 'ev_muh_03',
    slug: '3-muharram-arrival-of-umar-ibn-saad',
    title: 'Arrival of Umar ibn Sa’ad with 4,000 Kufan Cavalry at Karbala',
    arabicTitle: 'ورود عمر بن سعد بجيش الكوفة إلى كربلاء (٣ محرم ٦١ هـ)',
    eventType: 'karbala',
    hijriDay: 3,
    hijriMonth: 1,
    historicalYearAH: '61 AH',
    gregorianHistoricalDate: '3 October 680 CE',
    gregorianMonthDay: { month: 10, day: 3 },
    personalityIds: ['imam_hussain'],
    locationIds: ['historical_umayyad_hq'],
    summary: 'Umar ibn Sa’ad arrives at Ninawa with 4,000 troops dispatched by Ubaydullah ibn Ziyad, initiating military encirclement.',
    fullDescription: 'Having accepted Ubaydullah ibn Ziyad’s ultimatum in exchange for the governorship of Rayy, Umar ibn Sa’ad marched into Karbala on 3 Muharram 61 AH and established the Umayyad command post north-east of the Husayni camp.',
    sources: ['Tarikh al-Tabari, Vol. 5, pp. 410–412', 'Ansab al-Ashraf by Al-Baladhuri, Vol. 3'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Verified in early Kufan military chronicles.',
    recommendedZiyarat: 'ziyarat_ashura',
    importance: 'high',
    translations: {
      en: 'Arrival of Umar ibn Sa’ad’s Army at Karbala (3 Muharram 61 AH)',
      ar: 'ورود جيش عمر بن سعد إلى أرض كربلاء',
      ur: 'عمر بن سعد کے لشکر کا کربلا میں داخلہ (۳ محرم ۶۱ھ)',
      ro: 'Umar ibn Saad ke lashkar ka Karbala mein dakhila',
      hi: 'उमर इब्न साद की सेना का कर्बला में प्रवेश',
      fa: 'ورود سپاه عمر بن سعد به کربلا'
    }
  },
  {
    eventId: 'ev_muh_04',
    slug: '4-muharram-kufa-mobilization',
    title: 'Kufa Grand Mosque Conscription & Sealing of Iraqi Frontiers',
    arabicTitle: 'خطبة ابن زياد وإغلاق الطرق نحو كربلاء (٤ محرم ٦١ هـ)',
    eventType: 'karbala',
    hijriDay: 4,
    hijriMonth: 1,
    historicalYearAH: '61 AH',
    gregorianHistoricalDate: '4 October 680 CE',
    gregorianMonthDay: { month: 10, day: 4 },
    personalityIds: ['imam_hussain'],
    locationIds: ['historical_umayyad_hq'],
    summary: 'Ubaydullah ibn Ziyad enforces martial law in Kufa, marshaling regiments at Nukhayla to reinforce Umar ibn Sa’ad.',
    fullDescription: 'On 4 Muharram 61 AH, Ibn Ziyad ordered Husayn ibn Numayr to seal all roads between Kufa and Karbala at Al-Qadisiyyah while dispatching continuous cavalry reinforcements from the Nukhayla garrison.',
    sources: ['Tarikh al-Tabari, Vol. 5, p. 412', 'Al-Kamil fi al-Tarikh by Ibn al-Athir, Vol. 4'],
    sourceReliability: 'widely_reported',
    dateStatus: 'widely_reported',
    calendarNotes: 'Part of the 3–6 Muharram troop buildup.',
    recommendedZiyarat: 'ziyarat_ashura',
    importance: 'medium',
    translations: {
      en: 'Conscription of Kufan Regiments & Frontier Blockade (4 Muharram 61 AH)',
      ar: 'تعبئة معسكر النخيلة وإغلاق الطرق نحو كربلاء',
      ur: 'کوفہ میں جبری فوجی بھرتی اور راستوں کی ناکہ بندی (۴ محرم ۶۱ھ)',
      ro: 'Kufa mein fauji bharti aur raaston ki nakabandi',
      hi: 'कूफ़ा में सैन्य लामबंदी और मार्गों की नाकाबंदी',
      fa: 'بسیج لشکریان در نخيله و بستن راه‌های کربلا'
    }
  },
  {
    eventId: 'ev_muh_05',
    slug: '5-muharram-shabath-cavalry-dispatch',
    title: 'Deployment of Shabath ibn Rib’i & Siege Tightening around Al-Taff',
    arabicTitle: 'إرسال شبث بن ربعي وتشديد الحصار في الطف (٥ محرم ٦١ هـ)',
    eventType: 'karbala',
    hijriDay: 5,
    hijriMonth: 1,
    historicalYearAH: '61 AH',
    gregorianHistoricalDate: '5 October 680 CE',
    gregorianMonthDay: { month: 10, day: 5 },
    personalityIds: ['imam_hussain', 'habib_ibn_muzahir'],
    locationIds: ['historical_encampment'],
    summary: 'Additional Kufan cavalry divisions arrive at Karbala; patrol cordons prevent tribesmen from joining Imam Hussain’s camp.',
    fullDescription: 'By 5 Muharram 61 AH, Ibn Ziyad forced reluctant Kufan tribal nobles including Shabath ibn Rib’i to march to Karbala, cutting off Banu Asad villages from the Husayni encampment.',
    sources: ['Tarikh al-Tabari, Vol. 5, pp. 412–414', 'Maqtal Abi Mikhnaf'],
    sourceReliability: 'widely_reported',
    dateStatus: 'widely_reported',
    calendarNotes: 'Documented in Abu Mikhnaf’s transmission of the Kufan muster rolls.',
    recommendedZiyarat: 'ziyarat_ashura',
    importance: 'medium',
    translations: {
      en: 'Siege Cordons Tightened at Karbala (5 Muharram 61 AH)',
      ar: 'تشديد الحصار العسكري حول مخيم الإمام الحسين',
      ur: 'خیامِ حسینی کے گرد محاصرہ سخت ہونا (۵ محرم ۶۱ھ)',
      ro: 'Khayyam-e-Hussaini ke gird muhasira sakht hona',
      hi: 'हुसैनी खेमों के चारों ओर घेराबंदी सख्त होना',
      fa: 'تشدید محاصره خیمه‌گاه حسینی در کربلا'
    }
  },
  {
    eventId: 'ev_muh_06',
    slug: '6-muharram-completion-of-army-muster',
    title: 'Completion of Umayyad Army Muster & Habib ibn Muzahir’s Tribal Appeal',
    arabicTitle: 'تكامل جيوش عمر بن سعد ومحاولة حبيب بن مظاهر نصرة الحسين (٦ محرم ٦١ هـ)',
    eventType: 'karbala',
    hijriDay: 6,
    hijriMonth: 1,
    historicalYearAH: '61 AH',
    gregorianHistoricalDate: '6 October 680 CE',
    gregorianMonthDay: { month: 10, day: 6 },
    personalityIds: ['imam_hussain', 'habib_ibn_muzahir'],
    locationIds: ['historical_encampment'],
    summary: 'Habib ibn Muzahir al-Asadi seeks permission from Imam Hussain (AS) to rally the nearby Banu Asad clans, who are intercepted by 400 Umayyad horsemen.',
    fullDescription: 'On 6 Muharram 61 AH, as Umar ibn Sa’ad’s forces swelled to between 20,000 and 30,000 troops, Habib ibn Muzahir rode out to his kinsmen of Banu Asad. Ninety men set out to join Imam Hussain, but Azraq ibn al-Harith intercepted them along the Euphrates bank.',
    sources: ['Tarikh al-Tabari, Vol. 5, pp. 414–415', 'Kitab al-Irshad, p. 372', 'Ansab al-Ashraf, Vol. 3'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Demonstrates how military blockades prevented late tribal reinforcements.',
    recommendedZiyarat: 'ziyarat_ashura',
    importance: 'high',
    translations: {
      en: 'Habib ibn Muzahir’s Appeal to Banu Asad & Siege Completion (6 Muharram 61 AH)',
      ar: 'نداء حبيب بن مظاهر لبني أسد واكتمال الحشود العسكرية',
      ur: 'حبیب بن مظاہرؑ کا قبیلہ بنی اسد کو پیغام اور فوجی محاصرہ (۶ محرم ۶۱ھ)',
      ro: 'Habib ibn Muzahir ka Bani Asad ko paigham (6 Muharram 61 AH)',
      hi: 'हबीब इब्न मुज़ाहिर का बनी असद को संदेश (६ मुहर्रम ६१ हिजरी)',
      fa: 'استمداد حبیب بن مظاهر از قبیله بنی‌اسد'
    }
  },
  {
    eventId: 'ev_muh_07',
    slug: '7-muharram-water-blockade-at-euphrates',
    title: 'Blockade of the Euphrates Watercourse (Al-Alqami) against the Household',
    arabicTitle: 'منع الماء عن مخيم الإمام الحسين وإحكام الحصار على نهر العلقمي (٧ محرم ٦١ هـ)',
    eventType: 'karbala',
    hijriDay: 7,
    hijriMonth: 1,
    historicalYearAH: '61 AH',
    gregorianHistoricalDate: '7 October 680 CE',
    gregorianMonthDay: { month: 10, day: 7 },
    personalityIds: ['imam_hussain', 'abbas_ibn_ali', 'ali_akbar'],
    locationIds: ['historical_alqami', 'abbas_shrine_present'],
    summary: 'Umar ibn Sa’ad stations 500 cavalry under Amr ibn al-Hajjaj al-Zubaydi along the Euphrates bank to cut off all water access to Imam Hussain’s camp.',
    fullDescription: 'On 7 Muharram 61 AH, acting on an explicit written order from Ubaydullah ibn Ziyad ("Intervene between Hussain and the water so that they do not taste a single drop"), Umar ibn Sa’ad deployed 500 horsemen to seal the Al-Alqami branch. That night, Imam Hussain dispatched Hazrat Abbas (AS) with 20 horsemen and 20 water-bearers who broke through the cordon to bring emergency water to the children, earning Abbas the title al-Saqqa (The Water-Bearer).',
    sources: ['Tarikh al-Tabari, Vol. 5, pp. 412–416', 'Kitab al-Irshad by Shaykh al-Mufid, pp. 371–373', 'Maqtal Abi Mikhnaf'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Traditionally commemorated across the Islamic world in memory of Hazrat Abbas ibn Ali (AS) and the thirst of the children of Karbala.',
    recommendedZiyarat: 'ziyarat_abbas',
    importance: 'critical',
    translations: {
      en: 'Blockade of the Euphrates Water & Night Sortie of Hazrat Abbas (7 Muharram 61 AH)',
      ar: 'منع الماء عن مخيم الحسين وبطولة أبي الفضل العباس السقاء',
      ur: '۷ محرم ۶۱ھ — نہرِ فرات پر پہرہ اور حضرت عباس علمدارؑ کی سقائی',
      ro: '7 Muharram 61 AH — Nahar-e-Furat par pahra aur Hazrat Abbas (AS) ki saqqai',
      hi: '७ मुहर्रम ६१ हिजरी — फ़ुरात नदी पर पाबंदी और हज़रत अब्बास की जाँबाज़ी',
      fa: 'هفتم محرم — بستن آب فرات بر خیمه‌گاه و سقایی حضرت عباس علیه‌السلام'
    }
  },
  {
    eventId: 'ev_muh_08',
    slug: '8-muharram-exhaustion-of-water-and-parley',
    title: 'Exhaustion of Water Reserves in the Tents & Night Parley Between the Camps',
    arabicTitle: 'نفاد الماء في الخيام ولقاء الليل بين المعسكرين (٨ محرم ٦١ هـ)',
    eventType: 'karbala',
    hijriDay: 8,
    hijriMonth: 1,
    historicalYearAH: '61 AH',
    gregorianHistoricalDate: '8 October 680 CE',
    gregorianMonthDay: { month: 10, day: 8 },
    personalityIds: ['imam_hussain', 'abbas_ibn_ali', 'ali_akbar'],
    locationIds: ['historical_encampment', 'historical_alqami'],
    summary: 'Water stores in the Husayni encampment are depleted; Imam Hussain (AS) meets Umar ibn Sa’ad between the two lines in a final effort to avert bloodshed.',
    fullDescription: 'On 8 Muharram 61 AH, thirst intensified across the encampment. Imam Hussain (AS) instructed Hazrat Abbas (AS) to dig a trench-well near the camp, which yielded only brackish moisture. That evening, accompanied by Abbas and Ali Akbar, the Imam met Umar ibn Sa’ad between the two armies, warning him of divine accountability.',
    sources: ['Tarikh al-Tabari, Vol. 5, pp. 413–416', 'Kitab al-Irshad, p. 373', 'Al-Luhuf'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Documented by Uqba ibn Sim’an, the attendant of Lady Rabab who witnessed the parley.',
    recommendedZiyarat: 'ziyarat_abbas',
    importance: 'high',
    translations: {
      en: 'Exhaustion of Water Reserves & Final Parley (8 Muharram 61 AH)',
      ar: 'اشتداد العطش في المخيم الحسيني ولقاء الليل',
      ur: '۸ محرم ۶۱ھ — خیام میں پانی کا خاتمہ اور شبانہ گفتگو',
      ro: '8 Muharram 61 AH — Khayyam mein paani ka khatima',
      hi: '८ मुहर्रम ६१ हिजरी — खेमों में पानी की समाप्ति और अंतिम संवाद',
      fa: 'هشتم محرم — پایان ذخایر آب خیمه‌ها و گفت‌وگوی شبانه'
    }
  },
  {
    eventId: 'ev_muh_09',
    slug: '9-muharram-tasua-siege-and-night-of-prayer',
    title: 'Day of Tasu’a — Shimr’s Safe-Conduct Refused by Hazrat Abbas & Eve of Ashura',
    arabicTitle: 'يوم تاسوعاء — رفض العباس لأمان شمر وليلة العبادة والوفاء (٩ محرم ٦١ هـ)',
    eventType: 'karbala',
    hijriDay: 9,
    hijriMonth: 1,
    historicalYearAH: '61 AH',
    gregorianHistoricalDate: '9 October 680 CE',
    gregorianMonthDay: { month: 10, day: 9 },
    personalityIds: ['imam_hussain', 'abbas_ibn_ali', 'zaynab_bint_ali', 'habib_ibn_muzahir'],
    locationIds: ['historical_encampment', 'abbas_shrine_present'],
    summary: 'Shimr ibn Dhi’l-Jawshan arrives with Ibn Ziyad’s order for immediate attack; Hazrat Abbas rejects Shimr’s tribal safe-conduct; Imam Hussain secures a one-night respite for prayer.',
    fullDescription: 'On Thursday, 9 Muharram 61 AH (Tasu’a), Shimr arrived bearing Ibn Ziyad’s ultimatum. When Shimr offered a letter of safe-conduct (Aman-nama) to Hazrat Abbas and his brothers, Abbas replied: "May Allah curse you and your safe-conduct! Do you offer us safety while the son of the daughter of the Messenger of Allah has none?" At Asr, when the army advanced, Imam Hussain sent Abbas to request one final night for prayer, Quran recitation, and supplication. That night, the Imam released his companions from their oath of allegiance, yet every companion vowed unwavering loyalty.',
    sources: ['Tarikh al-Tabari, Vol. 5, pp. 416–422', 'Kitab al-Irshad by Shaykh al-Mufid, pp. 374–377', 'Maqtal Abi Mikhnaf'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Tasu’a (9 Muharram) is universally revered as the day dedicated to the loyalty of Hazrat Abu al-Fadl al-Abbas (AS) and the Night of Devotion.',
    recommendedZiyarat: 'ziyarat_abbas',
    importance: 'critical',
    translations: {
      en: 'Tasu’a — Loyalty of Hazrat Abbas (AS) & Eve of Ashura (9 Muharram 61 AH)',
      ar: 'تاسوعاء الحسين — وفاء أبي الفضل العباس وليلة عاشوراء',
      ur: 'تاسوعائے حسینی — حضرت عباسؑ کا امان نامہ ٹھکرانا اور شبِ عاشور (۹ محرم ۶۱ھ)',
      ro: '9 Muharram Tasua — Hazrat Abbas (AS) ki wafa aur Shab-e-Ashur',
      hi: '९ मुहर्रम तासूआ — हज़रत अब्बास की वफ़ादारी और शब-ए-आशूरा',
      fa: 'تاسوعای حسینی — رد امان‌نامه توسط حضرت عباس و شب عاشورا'
    }
  },
  {
    eventId: 'ev_muh_10_ashura',
    slug: '10-muharram-yawm-al-ashura',
    title: 'Yawm al-Ashura — The Immortal Stand & Shahadat of Imam Hussain (AS) and His Companions',
    arabicTitle: 'يوم عاشوراء — استشهاد الإمام الحسين عليه السلام وأهل بيته وأصحابه (١٠ محرم ٦١ هـ)',
    eventType: 'shahadat',
    hijriDay: 10,
    hijriMonth: 1,
    historicalYearAH: '61 AH',
    gregorianHistoricalDate: '10 October 680 CE',
    gregorianMonthDay: { month: 10, day: 10 },
    personalityIds: ['imam_hussain', 'abbas_ibn_ali', 'ali_akbar', 'qasim_ibn_hasan', 'ali_asghar', 'hurr_ibn_yazid', 'habib_ibn_muzahir', 'zaynab_bint_ali'],
    locationIds: ['maqtal_present', 'hussain_shrine_present', 'abbas_shrine_present', 'historical_maqtal'],
    summary: 'On Friday, 10 Muharram 61 AH, Imam Hussain ibn Ali (AS), seventeen youths of Bani Hashim, and his loyal companions attain martyrdom at Karbala defending truth, human dignity, and prophetic justice.',
    fullDescription: 'From dawn prayer to the afternoon of Friday, 10 Muharram 61 AH (10 October 680 CE), the plain of Karbala witnessed the repentance of Hurr ibn Yazid al-Riyahi, the heroic sacrifices of the companions led by Habib ibn Muzahir, Zuhayr ibn al-Qayn, Muslim ibn Awsaja, and Burayr ibn Khudayr, the Salat al-Khawf at noon, the martyrdom of Hazrat Ali Akbar, Hazrat Qasim ibn Hasan, Hazrat Abu al-Fadl al-Abbas by the Euphrates, the infant Abdullah (Ali Asghar), and finally the supreme sacrifice of Imam Hussain (AS) at the Maqtal before the evening of Sham-e-Ghariban.',
    sources: [
      'Abu Mikhnaf, Maqtal al-Husayn',
      'Tarikh al-Tabari, Vol. 5, pp. 422–455',
      'Kitab al-Irshad by Shaykh al-Mufid, pp. 377–387',
      'Al-Luhuf by Sayyid Ibn Tawus, pp. 50–82',
      'Kamil al-Ziyarat by Ibn Qulawayh'
    ],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'The central historical axis of Karbala and Ahlul Bayt remembrance.',
    recommendedZiyarat: 'ziyarat_ashura',
    importance: 'critical',
    translations: {
      en: 'Ashura — Shahadat of Imam Hussain (AS), Bani Hashim & Companions (10 Muharram 61 AH)',
      ar: 'يوم عاشوراء — شهادة الإمام الحسين وأهل بيته وأصحابه في كربلاء',
      ur: 'یومِ عاشورہ — شہادتِ امام حسینؑ، بنی ہاشم اور اصحابِ باوفا (۱۰ محرم ۶۱ھ)',
      ro: 'Yaum-e-Ashura — Shahadat-e-Imam Hussain (AS) wa Ashab-e-Karbala (10 Muharram 61 AH)',
      hi: 'यौम-ए-आशूरा — इमाम हुसैन (अ.स.) और कर्बला के शहीदों की शहादत (१० मुहर्रम ६१ हिजरी)',
      fa: 'روز عاشورا — شهادت امام حسین علیه‌السلام، بنی‌هاشم و یاران باوفا'
    }
  },
  {
    eventId: 'ev_muh_11',
    slug: '11-muharram-departure-of-captives-to-kufa',
    title: 'Departure of the Captive Household of the Prophet from Karbala toward Kufa',
    arabicTitle: 'مسير سبايا أهل البيت عليهم السلام من كربلاء إلى الكوفة (١١ محرم ٦١ هـ)',
    eventType: 'karbala',
    hijriDay: 11,
    hijriMonth: 1,
    historicalYearAH: '61 AH',
    gregorianHistoricalDate: '11 October 680 CE',
    gregorianMonthDay: { month: 10, day: 11 },
    personalityIds: ['zaynab_bint_ali', 'zain_al_abideen'],
    locationIds: ['historical_maqtal', 'mukhayam_present'],
    summary: 'After the night of Sham-e-Ghariban, Sayyida Zaynab (SA), Imam Zain al-Abideen (AS), and the surviving women and children are marched from the battlefield toward Kufa.',
    fullDescription: 'Around midday on 11 Muharram 61 AH, Umar ibn Sa’ad buried his own dead and ordered the surviving women and children of the Prophet’s family, led by Sayyida Zaynab bint Ali (SA) and the ailing Imam Ali ibn al-Hussain Zain al-Abideen (AS), to be taken past the unburied bodies of the martyrs on their forced march to Kufa.',
    sources: ['Tarikh al-Tabari, Vol. 5, pp. 455–456', 'Al-Luhuf by Sayyid Ibn Tawus, pp. 83–86', 'Kitab al-Irshad, p. 388'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Marks the beginning of the Post-Ashura Captivity Journey.',
    recommendedZiyarat: 'ziyarat_ashura',
    importance: 'high',
    translations: {
      en: 'Departure of the Captive Household from Karbala to Kufa (11 Muharram 61 AH)',
      ar: 'رحيل ركب السبايا بقيادة السيدة زينب والإمام السجاد نحو الكوفة',
      ur: '۱۱ محرم ۶۱ھ — اسیرانِ اہلِ بیتؑ کی کربلا سے کوفہ روانگی',
      ro: '11 Muharram 61 AH — Aseeran-e-Ahlul Bayt ki Karbala se Kufa rawangi',
      hi: '११ मुहर्रम ६१ हिजरी — अहलुल बैत के क़ैदियों का कर्बला से कूफ़ा प्रस्थान',
      fa: 'یازدهم محرم — حرکت کاروان اسرای اهل‌بیت از کربلا به سوی کوفه'
    }
  },
  {
    eventId: 'ev_muh_12',
    slug: '12-muharram-entry-into-kufa-and-burial- preparations',
    title: 'Entry of the Household into Kufa & Sermons of Sayyida Zaynab (SA) and Imam Sajjad (AS)',
    arabicTitle: 'دخول السبايا إلى الكوفة وخطبة السيدة زينب والإمام السجاد (١٢ محرم ٦١ هـ)',
    eventType: 'karbala',
    hijriDay: 12,
    hijriMonth: 1,
    historicalYearAH: '61 AH',
    gregorianHistoricalDate: '12 October 680 CE',
    gregorianMonthDay: { month: 10, day: 12 },
    personalityIds: ['zaynab_bint_ali', 'zain_al_abideen'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Sayyida Zaynab (SA), Umm Kulthum, Fatima bint al-Hussain, and Imam Zain al-Abideen (AS) deliver historic sermons in the streets and palace of Kufa, shattering Umayyad propaganda.',
    fullDescription: 'On 12 Muharram 61 AH, as the captives entered Kufa, Sayyida Zaynab bint Ali (SA) delivered her thunderous sermon invoking the eloquence of her father Imam Ali (AS), leaving the Kufan populace weeping in remorse and confronting Ubaydullah ibn Ziyad in his court ("I saw nothing but beauty — Ma ra’aytu illa jamila").',
    sources: ['Balaghat al-Nisa by Ibn Abi Tahir Tayfur', 'Al-Luhuf by Sayyid Ibn Tawus, pp. 86–93', 'Al-Ihtijaj by Shaykh al-Tabarsi, Vol. 2'],
    sourceReliability: 'confirmed',
    dateStatus: 'different_narrations',
    alternateNarrations: 'Historical chronicles place the burial of the martyrs of Karbala by Banu Asad and Imam Zain al-Abideen (AS) on either 12 Muharram or 13 Muharram 61 AH.',
    calendarNotes: 'Both 12 and 13 Muharram are commemorated as Yawm al-Dafn (Day of Burial) across Iraq and Iran.',
    recommendedZiyarat: 'ziyarat_warith',
    importance: 'high',
    translations: {
      en: 'Sermons of Sayyida Zaynab (SA) in Kufa & Burial Traditions (12 Muharram 61 AH)',
      ar: 'خطبة السيدة زينب الكبرى في الكوفة وذكرى دفن الأجساد الطاهرة',
      ur: '۱۲ محرم ۶۱ھ — بازارِ کوفہ میں خطبۂ سیدہ زینبؑ اور روایتِ دفنِ شہداء',
      ro: '12 Muharram 61 AH — Kufa mein Khutba-e-Sayyida Zaynab (SA)',
      hi: '१२ मुहर्रम ६१ हिजरी — कूफ़ा में सैय्यदा ज़ैनब (स.अ.) का ख़ुत्बा',
      fa: 'دوازدهم محرم — خطبه حضرت زینب در کوفه و روایت دفن شهدا'
    }
  },
  {
    eventId: 'ev_muh_13',
    slug: '13-muharram-burial-of-martyrs-by-banu-asad',
    title: 'Sacred Burial of the Martyrs of Karbala (Yawm al-Dafn) with Banu Asad',
    arabicTitle: 'دفن الأجساد الطاهرة لشهداء كربلاء على يد الإمام السجاد وبني أسد (١٣ محرم ٦١ هـ)',
    eventType: 'karbala',
    hijriDay: 13,
    hijriMonth: 1,
    historicalYearAH: '61 AH',
    gregorianHistoricalDate: '13 October 680 CE',
    gregorianMonthDay: { month: 10, day: 13 },
    personalityIds: ['zain_al_abideen', 'imam_hussain', 'abbas_ibn_ali', 'ali_akbar'],
    locationIds: ['hussain_shrine_present', 'abbas_shrine_present', 'habib_shrine_present'],
    summary: 'Three days after Ashura, the sacred bodies of Imam Hussain (AS), Hazrat Abbas (AS), and the martyrs are laid to rest at their exact places of martyrdom, establishing the shrines of Karbala.',
    fullDescription: 'On 13 Muharram 61 AH, the men and women of the Banu Asad tribe, guided by Imam Ali ibn al-Hussain Zain al-Abideen (AS), interred Imam Hussain (AS) at the Maqtal, Ali Akbar at his feet, the companions in the collective grave (Ganj-e-Shuhada), Habib ibn Muzahir near the threshold, and Hazrat Abu al-Fadl al-Abbas (AS) along the Al-Alqami road.',
    sources: ['Tarikh al-Tabari, Vol. 5, p. 455', 'Kitab al-Irshad, p. 388', 'Mafatih al-Jinan / Muntaha al-Amal by Shaykh Abbas Qummi'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Observed annually in Karbala with the massive Banu Asad tribal procession on 13 Muharram.',
    recommendedZiyarat: 'ziyarat_warith',
    importance: 'high',
    translations: {
      en: 'Burial of the Martyrs of Karbala by Imam Sajjad & Banu Asad (13 Muharram 61 AH)',
      ar: 'يوم دفن الأجساد الطاهرة لشهداء الطف مع قبيلة بني أسد',
      ur: '۱۳ محرم ۶۱ھ — یومِ دفنِ شہدائے کربلا بہ دستِ امام سجادؑ و قبیلہ بنی اسد',
      ro: '13 Muharram 61 AH — Tadfeen-e-Shuhada-e-Karbala',
      hi: '१३ मुहर्रम ६१ हिजरी — कर्बला के शहीदों का दफ़न (बनी असद)',
      fa: 'سیزدهم محرم — روز دفن پیکرهای مطهر شهدای کربلا توسط امام سجاد و بنی‌اسد'
    }
  },
  {
    eventId: 'ev_muh_25',
    slug: '25-muharram-shahadat-imam-zain-al-abideen',
    title: 'Shahadat of Imam Ali ibn al-Hussain Zain al-Abideen (AS)',
    arabicTitle: 'شهادة الإمام علي بن الحسين زين العابدين السجاد عليه السلام (٢٥ محرم ٩٥ هـ)',
    eventType: 'shahadat',
    hijriDay: 25,
    hijriMonth: 1,
    historicalYearAH: '95 AH',
    gregorianHistoricalDate: '20 October 713 CE',
    gregorianMonthDay: { month: 10, day: 20 },
    personalityIds: ['zain_al_abideen'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Martyrdom of the Fourth Imam, Ali ibn al-Hussain al-Sajjad (AS), survivor and chronicler of Karbala and author of Al-Sahifa al-Sajjadiyya.',
    fullDescription: 'Imam Ali ibn al-Hussain Zain al-Abideen (AS), who preserved the message of Ashura through thirty-four years of tears, supplication (Al-Sahifa al-Sajjadiyya), and the Treatise on Rights (Risalat al-Huquq), was martyred by poison in Medina on 25 Muharram 95 AH and buried in Jannat al-Baqi.',
    sources: ['Kitab al-Irshad by Shaykh al-Mufid, Vol. 2, p. 137', 'Misbah al-Mutahajjid by Shaykh al-Tusi', 'I’lam al-Wara by Shaykh al-Tabarsi'],
    sourceReliability: 'confirmed',
    dateStatus: 'different_narrations',
    alternateNarrations: '25 Muharram 95 AH is the primary narration; a secondary narration records 12 Muharram 95 AH.',
    calendarNotes: 'Commemorated globally as the martyrdom anniversary of the Fourth Imam.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'high',
    translations: {
      en: 'Shahadat of Imam Zain al-Abideen al-Sajjad (AS) (25 Muharram 95 AH)',
      ar: 'شهادة الإمام علي بن الحسين زين العابدين عليه السلام',
      ur: 'شہادتِ امام علی زین العابدین سید الساجدینؑ (۲۵ محرم ۹۵ھ)',
      ro: 'Shahadat-e-Imam Zain al-Abideen (AS) (25 Muharram)',
      hi: 'इमाम ज़ैनुल आबिदीन (अ.स.) की शहादत (२५ मुहर्रम)',
      fa: 'شهادت امام زین‌العابدین سیدالساجدین علیه‌السلام (۲۵ محرم)'
    }
  },

  // ======================== 2. SAFAR ========================
  {
    eventId: 'ev_saf_01',
    slug: '1-safar-entry-of-captives-into-damascus',
    title: 'Entry of the Captive Household of Karbala into Damascus & Court of Yazid',
    arabicTitle: 'دخول سبايا أهل البيت عليهم السلام إلى الشام وخطبة السيدة زينب والإمام السجاد (١ صفر ٦١ هـ)',
    eventType: 'karbala',
    hijriDay: 1,
    hijriMonth: 2,
    historicalYearAH: '61 AH',
    gregorianHistoricalDate: '1 November 680 CE',
    gregorianMonthDay: { month: 11, day: 1 },
    personalityIds: ['zaynab_bint_ali', 'zain_al_abideen'],
    locationIds: ['hussain_shrine_present'],
    summary: 'The captive household of Prophet Muhammad (SAWW) is brought into Damascus; Sayyida Zaynab (SA) and Imam Zain al-Abideen (AS) deliver their immortal sermons in the Umayyad court and Grand Mosque.',
    fullDescription: 'On 1 Safar 61 AH, the caravan of captives reached Damascus through Bab al-Sa’at. In the court of Yazid ibn Mu’awiya and from the pulpit of the Umayyad Mosque, Sayyida Zaynab (SA) ("Scheme your schemes and strive your utmost, yet by Allah you shall never erase our mention") and Imam Zain al-Abideen (AS) awakened the Syrian public to the truth of Karbala.',
    sources: ['Balaghat al-Nisa', 'Tarikh al-Tabari, Vol. 5, pp. 460–465', 'Al-Luhuf by Sayyid Ibn Tawus, pp. 96–108'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Pivotal turning point of the Post-Ashura journey.',
    recommendedZiyarat: 'ziyarat_ashura',
    importance: 'high',
    translations: {
      en: 'Entry of Captives into Damascus & Sermons in Yazid’s Court (1 Safar 61 AH)',
      ar: 'دخول سبايا آل الرسول إلى دمشق وخطبة السيدة زينب والإمام السجاد',
      ur: 'یکم صفر ۶۱ھ — دربارِ شام میں اسیرانِ کربلا کا داخلہ اور تاریخی خطبات',
      ro: '1 Safar 61 AH — Darbar-e-Sham mein Khutba-e-Sayyida Zaynab wa Imam Sajjad',
      hi: '१ सफ़र ६१ हिजरी — दमिश्क के दरबार में अहलुल बैत का प्रवेश और ख़ुत्बे',
      fa: 'اول صفر — ورود کاروان اسرا به شام و خطبه‌های حضرت زینب و امام سجاد'
    }
  },
  {
    eventId: 'ev_saf_05',
    slug: '5-safar-shahadat-sayyida-ruqayyah-sakina',
    title: 'Shahadat of Sayyida Ruqayyah / Sakina bint al-Hussain (SA) in Damascus',
    arabicTitle: 'شهادة السيدة رقية بنت الإمام الحسين عليهما السلام في خرابة الشام (٥ صفر ٦١ هـ)',
    eventType: 'shahadat',
    hijriDay: 5,
    hijriMonth: 2,
    historicalYearAH: '61 AH',
    gregorianHistoricalDate: '5 November 680 CE',
    gregorianMonthDay: { month: 11, day: 5 },
    personalityIds: ['imam_hussain', 'zaynab_bint_ali'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Martyrdom of the young daughter of Imam Hussain (AS), Sayyida Ruqayyah (SA), from grief and exhaustion in the ruined prison (Kharaba) of Damascus.',
    fullDescription: 'On 5 Safar 61 AH, the young daughter of Imam Hussain (AS) passed away in grief in Damascus while weeping for her martyred father. Her shrine in Damascus remains a revered sanctuary of visitation.',
    sources: ['Kamil al-Bahai by Imad al-Din al-Tabari (7th Century AH)', 'Nafs al-Mahmum by Shaykh Abbas Qummi'],
    sourceReliability: 'widely_reported',
    dateStatus: 'widely_reported',
    calendarNotes: 'Widely commemorated across Iraq, Iran, Syria, and South Asia on 5 Safar.',
    recommendedZiyarat: 'ziyarat_warith',
    importance: 'high',
    translations: {
      en: 'Shahadat of Sayyida Ruqayyah / Sakina bint al-Hussain (SA) (5 Safar 61 AH)',
      ar: 'شهادة السيدة رقية بنت الإمام الحسين عليهما السلام في دمشق',
      ur: 'شہادتِ شہزادی رقیہ / سکینہ بنت الحسینؑ بمقامِ زندانِ شام (۵ صفر ۶۱ھ)',
      ro: 'Shahadat-e-Shahzadi Sakina / Ruqayyah bint al-Hussain (5 Safar)',
      hi: 'शहज़ादी रुक़य्या / सकीना बिन्तुल हुसैन की शहादत (५ सफ़र)',
      fa: 'شهادت حضرت رقیه بنت الحسین علیهماالسلام در خرابه شام (۵ صفر)'
    }
  },
  {
    eventId: 'ev_saf_07',
    slug: '7-safar-shahadat-imam-hasan-or-wiladat-imam-kazim',
    title: 'Commemoration of Imam Hasan al-Mujtaba (AS) & Narration of Wiladat of Imam Musa al-Kazim (AS)',
    arabicTitle: 'ذكرى شهادة الإمام الحسن المجتبى (رواية) وولادة الإمام موسى الكاظم عليهما السلام (٧ صفر)',
    eventType: 'shahadat',
    hijriDay: 7,
    hijriMonth: 2,
    historicalYearAH: '50 AH / 128 AH',
    gregorianHistoricalDate: '5 March 670 CE / 8 November 745 CE',
    gregorianMonthDay: { month: 11, day: 8 },
    personalityIds: ['imam_hasan'],
    locationIds: ['hussain_shrine_present'],
    summary: '7 Safar holds two major historical narrations in Imami sources: a widely observed narration for the martyrdom of Imam Hasan (AS) and the recorded birth date of Imam Musa al-Kazim (AS) at al-Abwa (128 AH).',
    fullDescription: 'Classical sources including Al-Kafi and Kitab al-Irshad record 7 Safar 128 AH as the birth of the Seventh Imam, Musa ibn Ja’far al-Kazim (AS), at al-Abwa between Mecca and Medina, while many scholars in Iran and Iraq also observe 7 Safar alongside 28 Safar for the martyrdom of Imam Hasan al-Mujtaba (AS).',
    sources: ['Kitab al-Irshad by Shaykh al-Mufid, Vol. 2, p. 215', 'Al-Kafi by Shaykh al-Kulayni, Vol. 1', 'Misbah al-Mutahajjid'],
    sourceReliability: 'different_narrations',
    dateStatus: 'different_narrations',
    alternateNarrations: 'Imam Hasan (AS) Shahadat is primarily observed on 28 Safar 50 AH (and by another narration on 7 Safar). Imam Musa al-Kazim (AS) Wiladat is recorded on 7 Safar 128 AH.',
    calendarNotes: 'Historical reports differ regarding whether 7 Safar or 28 Safar is the primary date of Imam Hasan’s martyrdom.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'high',
    translations: {
      en: '7 Safar — Narration of Shahadat of Imam Hasan (AS) & Wiladat of Imam Musa al-Kazim (AS)',
      ar: 'ذكرى شهادة الإمام الحسن المجتبى (رواية) وولادة الإمام موسى الكاظم عليهما السلام',
      ur: '۷ صفر — روایتِ شہادت امام حسن مجتبیٰؑ و ولادت امام موسیٰ کاظمؑ',
      ro: '7 Safar — Riwayat-e-Shahadat Imam Hasan (AS) wa Wiladat Imam Musa Kazim (AS)',
      hi: '७ सफ़र — इमाम हसन (अ.स.) की शहादत (रिवायत) व इमाम मूसा काज़िम की विलादत',
      fa: 'هفتم صفر — روایت شهادت امام حسن مجتبی و ولادت امام موسی کاظم علیهماالسلام'
    }
  },
  {
    eventId: 'ev_saf_20_arbaeen',
    slug: '20-safar-arbaeen-of-imam-hussain',
    title: 'Yawm al-Arba’een — 40th Day Commemoration of the Martyrdom of Imam Hussain (AS)',
    arabicTitle: 'أربعينية الإمام الحسين عليه السلام — زيارة جابر بن عبد الله الأنصاري ورجوع الركب (٢٠ صفر)',
    eventType: 'karbala',
    hijriDay: 20,
    hijriMonth: 2,
    historicalYearAH: '61 AH',
    gregorianHistoricalDate: '20 November 680 CE',
    gregorianMonthDay: { month: 11, day: 20 },
    personalityIds: ['imam_hussain', 'abbas_ibn_ali', 'zaynab_bint_ali', 'zain_al_abideen'],
    locationIds: ['hussain_shrine_present', 'abbas_shrine_present', 'bayn_al_haramayn_present'],
    summary: 'The 40th day after Ashura: Jabir ibn Abdullah al-Ansari and Atiyyah al-Awfi perform the first Ziyarat of Imam Hussain’s grave at Karbala, inaugurating the world’s largest annual peaceful pilgrimage.',
    fullDescription: 'On 20 Safar, the companion of the Prophet, Jabir ibn Abdullah al-Ansari, accompanied by the scholar Atiyyah al-Awfi, arrived at Karbala, bathed in the Euphrates, and recited the inaugural Ziyarat at the grave of Imam Hussain (AS). Sayyid Ibn Tawus in Al-Luhuf also records the tradition of the returning caravan of the Ahlul Bayt meeting Jabir at Karbala on their way from Damascus to Medina.',
    sources: [
      'Misbah al-Mutahajjid by Shaykh al-Tusi, p. 787',
      'Al-Luhuf by Sayyid Ibn Tawus, p. 111',
      'Bisharat al-Mustafa by Imad al-Din al-Tabari',
      'Tahdhib al-Ahkam, Vol. 6, p. 52 (Hadith of Imam Hasan al-Askari on the 5 signs of a believer)'
    ],
    sourceReliability: 'confirmed',
    dateStatus: 'different_narrations',
    alternateNarrations: 'Jabir ibn Abdullah’s arrival on 20 Safar is universally agreed upon. Classical historians (such as Sayyid Ibn Tawus vs. Shaykh al-Mufid and Shaykh al-Murtaza) discuss whether the Ahlul Bayt caravan reached Karbala on the very first 20 Safar 61 AH or during the subsequent year’s return.',
    calendarNotes: 'Today draws over 21 million pilgrims walking along the 1,452 poles from Najaf to Karbala.',
    recommendedZiyarat: 'ziyarat_warith',
    importance: 'critical',
    translations: {
      en: 'Arba’een — 40th Day Commemoration of Imam Hussain (AS) (20 Safar)',
      ar: 'يوم الأربعين — ذكرى أربعينية الإمام الحسين عليه السلام وزيارة الملايين',
      ur: 'چہلم سید الشہداء امام حسینؑ (اربعینِ حسینی — ۲۰ صفر المظفر)',
      ro: 'Chehlum / Arbaeen-e-Imam Hussain (AS) (20 Safar)',
      hi: 'चेहलुम / अरबाइन-ए-इमाम हुसैन (अ.स.) (२० सफ़र)',
      fa: 'اربعین حسینی — چهلمین روز شهادت سیدالشهدا امام حسین علیه‌السلام'
    }
  },
  {
    eventId: 'ev_saf_28',
    slug: '28-safar-wafat-prophet-muhammad-and-shahadat-imam-hasan',
    title: 'Passing of Prophet Muhammad (SAWW) & Shahadat of Imam Hasan al-Mujtaba (AS)',
    arabicTitle: 'رحيل النبي الأعظم محمد (ص) وشهادة الإمام الحسن المجتبى عليه السلام (٢٨ صفر)',
    eventType: 'shahadat',
    hijriDay: 28,
    hijriMonth: 2,
    historicalYearAH: '11 AH & 50 AH',
    gregorianHistoricalDate: '25 May 632 CE / 30 March 670 CE',
    gregorianMonthDay: { month: 5, day: 25 },
    personalityIds: ['prophet_muhammad', 'imam_hasan'],
    locationIds: ['hussain_shrine_present'],
    summary: 'A solemn double anniversary commemorating the departure of the Seal of the Prophets, Muhammad al-Mustafa (SAWW) in 11 AH, and the martyrdom of his grandson Imam Hasan ibn Ali al-Mujtaba (AS) in 50 AH.',
    fullDescription: 'On 28 Safar 11 AH, Prophet Muhammad (SAWW) departed this world in Medina, washed and shrouded by Imam Ali ibn Abi Talib (AS). Thirty-nine years later, on 28 Safar 50 AH, his eldest grandson Imam Hasan al-Mujtaba (AS) was martyred by poison in Medina and buried in Jannat al-Baqi beside his grandmother Fatima bint Asad.',
    sources: ['Kitab al-Irshad by Shaykh al-Mufid, Vol. 1 & Vol. 2', 'Al-Kafi by Shaykh al-Kulayni, Vol. 1, p. 439', 'Misbah al-Mutahajjid'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Universally observed across the Islamic world with major pilgrimages in Najaf, Medina, and Mashhad.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'critical',
    translations: {
      en: 'Passing of Prophet Muhammad (SAWW) & Shahadat of Imam Hasan (AS) (28 Safar)',
      ar: 'ذكرى رحيل الرسول الأعظم محمد (ص) وشهادة الإمام الحسن المجتبى (ع)',
      ur: 'رحلتِ خاتم النبیین حضرت محمد مصطفیٰﷺ اور شہادتِ امام حسن مجتبیٰؑ (۲۸ صفر)',
      ro: 'Wafat-e-Rasool-e-Khuda (SAWW) wa Shahadat-e-Imam Hasan (AS) (28 Safar)',
      hi: 'पैग़म्बर मुहम्मद (स.अ.व.) की वफ़ात और इमाम हसन (अ.स.) की शहादत (२८ सफ़र)',
      fa: 'رحلت پیامبر اکرم (ص) و شهادت امام حسن مجتبی علیه‌السلام (۲۸ صفر)'
    }
  },
  {
    eventId: 'ev_saf_29',
    slug: '29-safar-shahadat-imam-ali-al-rida',
    title: 'Shahadat of Imam Ali ibn Musa al-Rida (AS) in Tus (Mashhad)',
    arabicTitle: 'شهادة الإمام علي بن موسى الرضا عليه السلام في طوس (نهاية صفر ٢٠٣ هـ)',
    eventType: 'shahadat',
    hijriDay: 29,
    hijriMonth: 2,
    historicalYearAH: '203 AH',
    gregorianHistoricalDate: '5 September 818 CE',
    gregorianMonthDay: { month: 9, day: 5 },
    personalityIds: ['zain_al_abideen'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Martyrdom of the Eighth Imam, Ali ibn Musa al-Rida (AS), in Tus (modern Mashhad, Khorasan) on the final day of Safar 203 AH.',
    fullDescription: 'Summoned from Medina to Marv by the Abbasid caliph al-Ma’mun, Imam Ali al-Rida (AS) engaged scholars of all faiths in celebrated theological dialogues before being martyred by poison at Sanabad in Tus at the end of Safar 203 AH.',
    sources: ['Uyun Akhbar al-Rida by Shaykh al-Saduq', 'Kitab al-Irshad by Shaykh al-Mufid, Vol. 2, p. 270', 'Al-Kafi, Vol. 1'],
    sourceReliability: 'confirmed',
    dateStatus: 'different_narrations',
    alternateNarrations: 'Observed on the last day of Safar (29 or 30 Safar depending on the lunar month length); another narration records 17 Safar.',
    calendarNotes: 'Observed on the final day of Safar.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'critical',
    translations: {
      en: 'Shahadat of Imam Ali ibn Musa al-Rida (AS) (End of Safar 203 AH)',
      ar: 'شهادة الإمام علي بن موسى الرضا ضامن الجنة عليه السلام',
      ur: 'شہادتِ امام علی بن موسیٰ الرضاؑ (آخرِ ماہِ صفر ۲۰۳ھ)',
      ro: 'Shahadat-e-Imam Ali al-Rida (AS) (29/30 Safar)',
      hi: 'इमाम अली अल-रज़ा (अ.स.) की शहादत (सफ़र का अंतिम दिन)',
      fa: 'شهادت حضرت امام علی بن موسی الرضا علیه‌السلام (آخر صفر ۲۰۳ هـ)'
    }
  },

  // ======================== 3. RABI AL-AWWAL ========================
  {
    eventId: 'ev_rab1_01',
    slug: '1-rabi-al-awwal-hijrah-and-laylat-al-mabit',
    title: 'Laylat al-Mabit — Imam Ali (AS) Sleeps in the Prophet’s Bed & Hijrah Commences',
    arabicTitle: 'ليلة المبيت وهجرة النبي الأعظم محمد صلى الله عليه وآله (١ ربيع الأول ١ هـ)',
    eventType: 'historical',
    hijriDay: 1,
    hijriMonth: 3,
    historicalYearAH: '1 AH',
    gregorianHistoricalDate: '13 September 622 CE',
    gregorianMonthDay: { month: 9, day: 13 },
    personalityIds: ['prophet_muhammad', 'imam_ali'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Imam Ali ibn Abi Talib (AS) risks his life sleeping on the bed of Prophet Muhammad (SAWW) in Mecca so the Prophet can safely migrate to Medina, occasioning the revelation of Quran 2:207.',
    fullDescription: 'On the night of 1 Rabi al-Awwal, as Quraysh assassins surrounded the house of the Prophet, young Ali ibn Abi Talib (AS) lay wrapped in the Prophet’s green Hadrami cloak while the Messenger of Allah departed toward the Cave of Thawr and Medina.',
    sources: ['Tarikh al-Tabari, Vol. 2, p. 373', 'Al-Amali by Shaykh al-Tusi', 'Tafsir al-Mizan on Surah al-Baqarah 2:207'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Foundational milestone of the Islamic Hijri calendar.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'high',
    translations: {
      en: 'Laylat al-Mabit & Hijrah of Prophet Muhammad (SAWW) (1 Rabi al-Awwal)',
      ar: 'ليلة المبيت المباركة وهجرة الرسول الأعظم (ص)',
      ur: 'لیلۃ المبیت اور ہجرتِ نبویﷺ (یکم ربیع الاول)',
      ro: 'Laylat al-Mabit aur Hijrat-e-Nabawi (1 Rabi al-Awwal)',
      hi: 'लैलतुल मबीत और पैग़म्बर की हिजरत (१ रबी अल-अव्वल)',
      fa: 'لیلةالمبیت و آغاز هجرت پیامبر اکرم (ص) (اول ربیع‌الاول)'
    }
  },
  {
    eventId: 'ev_rab1_08',
    slug: '8-rabi-al-awwal-shahadat-imam-hasan-al-askari',
    title: 'Shahadat of Imam Hasan al-Askari (AS) in Samarra',
    arabicTitle: 'شهادة الإمام الحسن بن علي العسكري عليه السلام في سامراء (٨ ربيع الأول ٢٦٠ هـ)',
    eventType: 'shahadat',
    hijriDay: 8,
    hijriMonth: 3,
    historicalYearAH: '260 AH',
    gregorianHistoricalDate: '1 January 874 CE',
    gregorianMonthDay: { month: 1, day: 1 },
    personalityIds: ['zain_al_abideen'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Martyrdom of the Eleventh Imam, Hasan ibn Ali al-Askari (AS), at age 28 in Samarra, Iraq.',
    fullDescription: 'On Friday, 8 Rabi al-Awwal 260 AH, Imam Hasan al-Askari (AS) attained martyrdom in Samarra after years of surveillance under the Abbasid caliphate, and his five-year-old son Imam Muhammad al-Mahdi (AJ) led his funeral prayer.',
    sources: ['Kitab al-Irshad by Shaykh al-Mufid, Vol. 2, p. 335', 'Kamal al-Din by Shaykh al-Saduq', 'Al-Kafi, Vol. 1, p. 503'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Marks the culmination of the two-month mourning season (Ayyam al-Aza) that began on 1 Muharram.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'critical',
    translations: {
      en: 'Shahadat of Imam Hasan al-Askari (AS) in Samarra (8 Rabi al-Awwal 260 AH)',
      ar: 'شهادة الإمام الحسن العسكري عليه السلام في سامراء',
      ur: 'شہادتِ امام حسن عسکریؑ بمقامِ سامراء (۸ ربیع الاول ۲۶۰ھ)',
      ro: 'Shahadat-e-Imam Hasan al-Askari (AS) (8 Rabi al-Awwal)',
      hi: 'इमाम हसन अल-अस्करी (अ.स.) की शहादत (८ रबी अल-अव्वल)',
      fa: 'شهادت امام حسن عسکری علیه‌السلام در سامرا (۸ ربیع‌الاول ۲۶۰ هـ)'
    }
  },
  {
    eventId: 'ev_rab1_09',
    slug: '9-rabi-al-awwal-commencement-of-imamate-of-imam-mahdi',
    title: 'Commencement of the Imamate of Imam Muhammad al-Mahdi (AJ)',
    arabicTitle: 'عيد تتويج وبدء إمامة بقية الله الإمام المهدي المنتظر عجل الله فرجه (٩ ربيع الأول ٢٦٠ هـ)',
    eventType: 'wiladat',
    hijriDay: 9,
    hijriMonth: 3,
    historicalYearAH: '260 AH',
    gregorianHistoricalDate: '2 January 874 CE',
    gregorianMonthDay: { month: 1, day: 2 },
    personalityIds: ['zain_al_abideen'],
    locationIds: ['hussain_shrine_present'],
    summary: 'First day of the sacred Imamate of the Twelfth Imam, Hujjat ibn al-Hasan al-Mahdi (AJ), following the martyrdom of his father Imam Hasan al-Askari (AS).',
    fullDescription: 'On 9 Rabi al-Awwal 260 AH, the spiritual leadership (Imamate) passed to the Twelfth Imam, Muhammad ibn al-Hasan al-Mahdi (AJ), opening the era of the Minor Occultation (Ghaybah al-Sughra) mediated by his four appointed deputies.',
    sources: ['Kamal al-Din wa Tamam al-Ni’mah by Shaykh al-Saduq', 'Kitab al-Ghaybah by Shaykh al-Tusi'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Celebrated as Eid al-Imamah / Tajposhi of Imam al-Zaman (AJ).',
    recommendedZiyarat: 'ziyarat_warith',
    importance: 'high',
    translations: {
      en: 'Commencement of the Imamate of Imam al-Mahdi (AJ) (9 Rabi al-Awwal)',
      ar: 'بدء إمامة صاحب العصر والزمان الإمام المهدي المنتظر (عج)',
      ur: 'آغازِ امامتِ حضرت امام مہدی صاحب الزمانؑ (۹ ربیع الاول)',
      ro: 'Aghaz-e-Imamat Hazrat Imam Mahdi (AJ) (9 Rabi al-Awwal)',
      hi: 'इमाम अल-महदी (अ.ज.) की इमामत का आरंभ (९ रबी अल-अव्वल)',
      fa: 'آغاز امامت حضرت صاحب‌الزمان امام مهدی (عج) (۹ ربیع‌الاول)'
    }
  },
  {
    eventId: 'ev_rab1_17',
    slug: '17-rabi-al-awwal-wiladat-prophet-muhammad-and-imam-jafar-al-sadiq',
    title: 'Blessed Wiladat of Prophet Muhammad (SAWW) & Wiladat of Imam Ja’far al-Sadiq (AS)',
    arabicTitle: 'المولد النبوي الشريف وولادة الإمام جعفر بن محمد الصادق عليهما السلام (١٧ ربيع الأول)',
    eventType: 'wiladat',
    hijriDay: 17,
    hijriMonth: 3,
    historicalYearAH: 'Year of the Elephant (53 BH) & 83 AH',
    gregorianHistoricalDate: '570 CE & 20 April 702 CE',
    gregorianMonthDay: { month: 4, day: 20 },
    personalityIds: ['prophet_muhammad'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Blessed birth anniversary of the Messenger of Allah, Muhammad al-Mustafa (SAWW) in Mecca, and the birth anniversary of his sixth successor, Imam Ja’far ibn Muhammad al-Sadiq (AS) in Medina (83 AH).',
    fullDescription: 'At dawn on Friday, 17 Rabi al-Awwal in the Year of the Elephant, Prophet Muhammad ibn Abdullah (SAWW) was born in Mecca. On the exact same lunar date in 83 AH, the Sixth Imam and founder of the Ja’fari jurisprudential and scientific school, Imam Ja’far al-Sadiq (AS), was born in Medina.',
    sources: ['Al-Kafi by Shaykh al-Kulayni, Vol. 1, p. 439 & p. 472', 'Kitab al-Irshad by Shaykh al-Mufid', 'I’lam al-Wara by Shaykh al-Tabarsi'],
    sourceReliability: 'confirmed',
    dateStatus: 'different_narrations',
    alternateNarrations: 'Imami authorities unanimously record 17 Rabi al-Awwal for the Prophet’s birth, while Sunni chronicles widely observe 12 Rabi al-Awwal; the week between 12 and 17 Rabi al-Awwal is celebrated as Islamic Unity Week.',
    calendarNotes: 'Special Ziyarat of Imam Hussain (AS) is recommended in Mafatih al-Jinan on the day of the Prophet’s birth.',
    recommendedZiyarat: 'ziyarat_warith',
    importance: 'critical',
    translations: {
      en: 'Wiladat of Prophet Muhammad (SAWW) & Imam Ja’far al-Sadiq (AS) (17 Rabi al-Awwal)',
      ar: 'ولادة النبي الأعظم محمد (ص) والإمام جعفر الصادق عليه السلام (١٧ ربيع الأول)',
      ur: 'ولادتِ باسعادت حضرت محمد مصطفیٰﷺ اور امام جعفر صادقؑ (۱۷ ربیع الاول)',
      ro: 'Wiladat-e-Payambar-e-Akram (SAWW) wa Imam Jafar al-Sadiq (AS) (17 Rabi al-Awwal)',
      hi: 'पैग़म्बर मुहम्मद (स.अ.व.) और इमाम जाफ़र सादिक़ (अ.स.) की विलादत (१७ रबी अल-अव्वल)',
      fa: 'ولادت باسعادت پیامبر اکرم (ص) و امام جعفر صادق علیه‌السلام (۱۷ ربیع‌الاول)'
    }
  },

  // ======================== 4. RABI AL-THANI ========================
  {
    eventId: 'ev_rab2_08',
    slug: '8-rabi-al-thani-wiladat-imam-hasan-al-askari',
    title: 'Blessed Wiladat of Imam Hasan al-Askari (AS)',
    arabicTitle: 'ولادة الإمام الحسن بن علي العسكري عليه السلام (٨ ربيع الثاني ٢٣٢ هـ)',
    eventType: 'wiladat',
    hijriDay: 8,
    hijriMonth: 4,
    historicalYearAH: '232 AH',
    gregorianHistoricalDate: '3 December 846 CE',
    gregorianMonthDay: { month: 12, day: 3 },
    personalityIds: ['zain_al_abideen'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Birth anniversary of the Eleventh Imam, Abu Muhammad Hasan ibn Ali al-Askari (AS), born in Medina in 232 AH.',
    fullDescription: 'Imam Hasan al-Askari (AS), son of Imam Ali al-Hadi (AS) and Lady Hudayth (Susan), was born in Medina on 8 Rabi al-Thani 232 AH before being relocated with his father to Samarra.',
    sources: ['Kitab al-Irshad by Shaykh al-Mufid, Vol. 2, p. 313', 'Misbah al-Mutahajjid by Shaykh al-Tusi'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Observed across all Imami centers on 8 Rabi al-Thani (with a secondary narration of 10 Rabi al-Thani).',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'high',
    translations: {
      en: 'Wiladat of Imam Hasan al-Askari (AS) (8 Rabi al-Thani 232 AH)',
      ar: 'ولادة الإمام الحسن العسكري عليه السلام (٨ ربيع الثاني)',
      ur: 'ولادتِ باسعادت امام حسن عسکریؑ (۸ ربیع الثانی ۲۳۲ھ)',
      ro: 'Wiladat-e-Imam Hasan al-Askari (AS) (8 Rabi al-Thani)',
      hi: 'इमाम हसन अल-अस्करी (अ.स.) की विलादत (८ रबी अल-सानी)',
      fa: 'ولادت باسعادت امام حسن عسکری علیه‌السلام (۸ ربیع‌الثانی)'
    }
  },
  {
    eventId: 'ev_rab2_10',
    slug: '10-rabi-al-thani-wafat-sayyida-fatima-masuma',
    title: 'Passing (Wafat) of Sayyida Fatima al-Ma’suma bint Musa al-Kazim (SA) in Qom',
    arabicTitle: 'وفاة السيدة فاطمة المعصومة بنت الإمام موسى الكاظم عليهما السلام في قم (١٠ ربيع الثاني ٢٠١ هـ)',
    eventType: 'shahadat',
    hijriDay: 10,
    hijriMonth: 4,
    historicalYearAH: '201 AH',
    gregorianHistoricalDate: '8 November 816 CE',
    gregorianMonthDay: { month: 11, day: 8 },
    personalityIds: ['zain_al_abideen'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Passing of Sayyida Fatima al-Ma’suma (SA), daughter of Imam Musa al-Kazim (AS) and sister of Imam Ali al-Rida (AS), during her journey to Khorasan.',
    fullDescription: 'While traveling from Medina to join her brother Imam Ali al-Rida (AS) in Marv, Sayyida Fatima al-Ma’suma (SA) fell ill in Saveh and was welcomed into Qom by the Ash’ari family, passing away after seventeen days of devotion on 10 Rabi al-Thani 201 AH.',
    sources: ['Tarikh-i Qom by Hasan ibn Muhammad al-Qummi (378 AH)', 'Bihar al-Anwar, Vol. 48, p. 290'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Her sanctuary in Qom became one of the foremost centers of Ahlul Bayt scholarship.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'high',
    translations: {
      en: 'Passing of Sayyida Fatima al-Ma’suma (SA) in Qom (10 Rabi al-Thani 201 AH)',
      ar: 'وفاة السيدة فاطمة المعصومة عليها السلام في قم المقدسة',
      ur: 'وفاتِ حضرت فاطمہ معصومۂ قمؑ (۱۰ ربیع الثانی ۲۰۱ھ)',
      ro: 'Wafat-e-Sayyida Fatima Masooma-e-Qom (SA) (10 Rabi al-Thani)',
      hi: 'सैय्यदा फ़ातिमा मासूमा-ए-क़ुम (स.अ.) की वफ़ात (१० रबी अल-सानी)',
      fa: 'وفات حضرت فاطمه معصومه سلام‌الله‌علیها در قم (۱۰ ربیع‌الثانی ۲۰۱ هـ)'
    }
  },

  // ======================== 5. JUMADA AL-AWWAL ========================
  {
    eventId: 'ev_jum1_05',
    slug: '5-jumada-al-awwal-wiladat-sayyida-zaynab',
    title: 'Blessed Wiladat of Sayyida Zaynab bint Ali al-Kubra (SA) — Heroine of Karbala',
    arabicTitle: 'ولادة عقيلة بني هاشم السيدة زينب الكبرى بنت أمير المؤمنين عليهما السلام (٥ جمادى الأولى ٥ هـ)',
    eventType: 'wiladat',
    hijriDay: 5,
    hijriMonth: 5,
    historicalYearAH: '5 AH',
    gregorianHistoricalDate: '2 October 626 CE',
    gregorianMonthDay: { month: 10, day: 2 },
    personalityIds: ['zaynab_bint_ali', 'imam_ali', 'fatima_al_zahra', 'imam_hussain'],
    locationIds: ['zaynabiyya_hill_present', 'hussain_shrine_present'],
    summary: 'Blessed birth anniversary of Aqilat Bani Hashim, Sayyida Zaynab bint Ali (SA), granddaughter of the Prophet and the eloquent guardian of the message of Karbala.',
    fullDescription: 'Born in Medina on 5 Jumada al-Awwal 5 AH to Imam Ali ibn Abi Talib (AS) and Sayyida Fatima al-Zahra (SA), her name "Zaynab" (Adornment of Her Father) was revealed by Angel Jibra’il to Prophet Muhammad (SAWW). At Karbala, Kufa, and Damascus in 61 AH, her courage protected Imam Zain al-Abideen (AS) and immortalized the sacrifice of Ashura.',
    sources: ['Khasais al-Zaynabiyya by Sayyid Nur al-Din al-Jaza’iri', 'A’yan al-Shi’a by Sayyid Muhsin al-Amin', 'Balaghat al-Nisa'],
    sourceReliability: 'widely_reported',
    dateStatus: 'confirmed',
    calendarNotes: 'Celebrated across the Islamic world as the Day of Sayyida Zaynab (SA) and Day of Compassionate Care / Nursing.',
    recommendedZiyarat: 'ziyarat_warith',
    importance: 'critical',
    translations: {
      en: 'Wiladat of Sayyida Zaynab bint Ali (SA) — Heroine of Karbala (5 Jumada al-Awwal 5 AH)',
      ar: 'ولادة عقيلة بني هاشم السيدة زينب الكبرى عليها السلام (٥ جمادى الأولى)',
      ur: 'ولادتِ باسعادت ثانیِ زہرا سیدہ زینب الکبریٰؑ (۵ جمادی الاول ۵ھ)',
      ro: 'Wiladat-e-Sayyida Zaynab bint Ali (SA) (5 Jumada al-Awwal)',
      hi: 'सैय्यदा ज़ैनब बिन्त अली (स.अ.) की विलादत (५ जुमादा अल-अव्वल)',
      fa: 'ولادت باسعادت عقیله بنی‌هاشم حضرت زینب کبری سلام‌الله‌علیها (۵ جمادی‌الاول)'
    }
  },
  {
    eventId: 'ev_jum1_13',
    slug: '13-jumada-al-awwal-shahadat-fatima-zahra-first-narration',
    title: 'Shahadat of Sayyida Fatima al-Zahra (SA) — First Historical Narration (75 Days)',
    arabicTitle: 'شهادة الصديقة الكبرى السيدة فاطمة الزهراء عليها السلام — الرواية الأولى (١٣ جمادى الأولى ١١ هـ)',
    eventType: 'shahadat',
    hijriDay: 13,
    hijriMonth: 5,
    historicalYearAH: '11 AH',
    gregorianHistoricalDate: '7 August 632 CE',
    gregorianMonthDay: { month: 8, day: 7 },
    personalityIds: ['fatima_al_zahra', 'imam_ali'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Martyrdom of Sayyida Fatima al-Zahra (SA), beloved daughter of Prophet Muhammad (SAWW), according to the classical narration of 75 days after the Prophet’s passing.',
    fullDescription: 'Classical Imami historians preserve two authoritative narrations regarding how long Sayyida Fatima al-Zahra (SA) lived after her father’s passing on 28 Safar 11 AH: 75 days (placing her martyrdom on 13 Jumada al-Awwal 11 AH) and 95 days (placing her martyrdom on 3 Jumada al-Thani 11 AH). The twenty days between both dates are observed globally as Ayyam al-Fatimiyyah.',
    sources: ['Al-Kafi by Shaykh al-Kulayni, Vol. 1, p. 458', 'Dala’il al-Imamah by Muhammad ibn Jarir al-Tabari al-Imami', 'Misbah al-Mutahajjid'],
    sourceReliability: 'confirmed',
    dateStatus: 'different_narrations',
    alternateNarrations: 'Historical reports differ between 75 days after 28 Safar (13 Jumada al-Awwal) and 95 days after 28 Safar (3 Jumada al-Thani). Both dates are respectfully observed across the Hawza of Najaf and Qom.',
    calendarNotes: 'First Fatimiyyah mourning period (13–15 Jumada al-Awwal).',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'critical',
    translations: {
      en: 'Shahadat of Sayyida Fatima al-Zahra (SA) — 75-Day Narration (13 Jumada al-Awwal 11 AH)',
      ar: 'شهادة السيدة فاطمة الزهراء عليها السلام (رواية ٧٥ يوماً — ١٣ جمادى الأولى)',
      ur: 'شہادتِ سیدہ فاطمۃ الزہراؑ — روایتِ اول (۱۳ جمادی الاول ۱۱ھ)',
      ro: 'Shahadat-e-Sayyida Fatima al-Zahra (SA) — Riwayat-e-Awwal (13 Jumada al-Awwal)',
      hi: 'सैय्यदा फ़ातिमा ज़हरा (स.अ.) की शहादत — पहली रिवायत (१३ जुमादा अल-अव्वल)',
      fa: 'شهادت حضرت فاطمه زهرا سلام‌الله‌علیها — روایت اول (۱۳ جمادی‌الاول ۱۱ هـ)'
    }
  },
  {
    eventId: 'ev_jum1_17',
    slug: '17-jumada-al-awwal-ayyam-fatimiyyah-and-mutah-chronicle',
    title: 'Ayyam al-Fatimiyyah Remembrance & Historical Chronicle of Mid-Jumada al-Awwal',
    arabicTitle: 'أيام العزاء الفاطمي وذكرى سرية مؤتة واستشهاد جعفر بن أبي طالب الطيار (جمادى الأولى ٨ هـ)',
    eventType: 'historical',
    hijriDay: 17,
    hijriMonth: 5,
    historicalYearAH: '8 AH / 11 AH',
    gregorianHistoricalDate: 'September 629 CE / August 632 CE',
    gregorianMonthDay: { month: 10, day: 29 },
    personalityIds: ['fatima_al_zahra', 'imam_ali'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Mid-Jumada al-Awwal falls within the sacred twenty-day Ayyam al-Fatimiyyah period between the two narrations of Sayyida Fatima al-Zahra’s martyrdom, and marks the historic month of the martyrdom of Ja’far ibn Abi Talib al-Tayyar (AS) at Mu’tah (8 AH).',
    fullDescription: 'During mid-Jumada al-Awwal (between 13 Jumada al-Awwal and 3 Jumada al-Thani), the shrines of Karbala and Najaf observe Ayyam al-Fatimiyyah, reflecting on the Sermon of Fadak (Khutbah al-Fadakiyyah) delivered by Sayyida Fatima al-Zahra (SA) in Medina. Jumada al-Awwal 8 AH also witnessed the Expedition of Mu’tah in which Imam Ali’s brother, Ja’far ibn Abi Talib al-Tayyar (Dhu al-Janahayn), held the banner of Islam as both his arms were severed—a direct precursor to the sacrifice of his nephew Hazrat Abu al-Fadl al-Abbas (AS) at Karbala.',
    sources: ['Tarikh al-Tabari, Vol. 3, pp. 36–42 (Expedition of Mu’tah, Jumada al-Awwal 8 AH)', 'Balaghat al-Nisa (Khutbah al-Fadakiyyah)', 'Misbah al-Mutahajjid'],
    sourceReliability: 'confirmed',
    dateStatus: 'widely_reported',
    calendarNotes: 'Part of the Ayyam al-Fatimiyyah historical commemoration window (13 Jumada I – 3 Jumada II).',
    recommendedZiyarat: 'ziyarat_warith',
    importance: 'high',
    translations: {
      en: 'Ayyam al-Fatimiyyah & Remembrance of Ja’far al-Tayyar in Jumada al-Awwal',
      ar: 'الأيام الفاطمية وذكرى شهادة جعفر الطيار في جمادى الأولى',
      ur: 'ایامِ فاطمیہ اور یادِ شہادت حضرت جعفر طیارؑ (جمادی الاول)',
      ro: 'Ayyam-e-Fatimiyyah aur Yaad-e-Hazrat Jafar Tayyar (17 Jumada al-Awwal)',
      hi: 'अय्याम-ए-फ़ातिमिया और हज़रत जाफ़र तय्यार का स्मरण (१७ जुमादा अल-अव्वल)',
      fa: 'ایام فاطمیه و بزرگداشت شهادت حضرت جعفر طیار در جمادی‌الاول'
    }
  },
  {
    eventId: 'ev_jum1_18',
    slug: '18-jumada-al-awwal-fatimiyyah-archive-and-companions',
    title: 'Ayyam al-Fatimiyyah Scholarly Commemoration & Legacy of Khutbah al-Fadakiyyah',
    arabicTitle: 'مجالس الأيام الفاطمية وتراث الخطبة الفدكية للزهراء عليها السلام (١٨ جمادى الأولى)',
    eventType: 'historical',
    hijriDay: 18,
    hijriMonth: 5,
    historicalYearAH: '11 AH',
    gregorianHistoricalDate: 'August 632 CE',
    gregorianMonthDay: { month: 10, day: 30 },
    personalityIds: ['fatima_al_zahra', 'imam_ali', 'zaynab_bint_ali'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Commemoration within the twenty-day Ayyam al-Fatimiyyah window preserving the theological and moral legacy of Sayyida Fatima al-Zahra (SA) transmitted to her daughter Sayyida Zaynab (SA).',
    fullDescription: 'Recorded through the direct chain of transmission from Sayyida Zaynab bint Ali (SA) and Abdullah ibn Abbas in Balaghat al-Nisa (3rd Century AH), the discourses of Sayyida Fatima al-Zahra (SA) during Jumada al-Awwal 11 AH established the prophetic foundation that Imam Hussain (AS) and Sayyida Zaynab (SA) invoked fifty years later at Karbala and Kufa.',
    sources: ['Balaghat al-Nisa by Ahmad ibn Abi Tahir Tayfur', 'Al-Ihtijaj by Shaykh al-Tabarsi, Vol. 1', 'Bihar al-Anwar, Vol. 29'],
    sourceReliability: 'confirmed',
    dateStatus: 'widely_reported',
    calendarNotes: 'Observed across the Ayyam al-Fatimiyyah period between 13 Jumada al-Awwal and 3 Jumada al-Thani.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'high',
    translations: {
      en: 'Ayyam al-Fatimiyyah & Transmission of Khutbah al-Fadakiyyah (18 Jumada al-Awwal)',
      ar: 'إحياء الأيام الفاطمية وتراث خطبة الصديقة الزهراء عليها السلام',
      ur: 'ایامِ فاطمیہ اور میراثِ خطبۂ فدکیہ سیدہ فاطمۃ الزہراؑ (۱۸ جمادی الاول)',
      ro: 'Ayyam-e-Fatimiyyah wa Miras-e-Khutba-e-Fadakiyyah (18 Jumada al-Awwal)',
      hi: 'अय्याम-ए-फ़ातिमिया और ख़ुत्बा-ए-फ़दकिया की विरासत (१८ जुमादा अल-अव्वल)',
      fa: 'ایام فاطمیه و میراث خطبه فدکیه حضرت زهرا سلام‌الله‌علیها (۱۸ جمادی‌الاول)'
    }
  },

  // ======================== 6. JUMADA AL-THANI ========================
  {
    eventId: 'ev_jum2_03',
    slug: '3-jumada-al-thani-shahadat-sayyida-fatima-al-zahra',
    title: 'Shahadat of Sayyida Fatima al-Zahra (SA) — Primary Narration (95 Days)',
    arabicTitle: 'شهادة سيدة نساء العالمين فاطمة الزهراء عليها السلام — الرواية المشهورة (٣ جمادى الآخرة ١١ هـ)',
    eventType: 'shahadat',
    hijriDay: 3,
    hijriMonth: 6,
    historicalYearAH: '11 AH',
    gregorianHistoricalDate: '26 August 632 CE',
    gregorianMonthDay: { month: 8, day: 26 },
    personalityIds: ['fatima_al_zahra', 'imam_ali', 'imam_hasan', 'imam_hussain', 'zaynab_bint_ali'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Martyrdom of Sayyida Fatima al-Zahra (SA), leader of the women of the worlds, daughter of Prophet Muhammad (SAWW), spouse of Imam Ali (AS), and mother of Imam Hasan, Imam Hussain, and Sayyida Zaynab.',
    fullDescription: 'According to the primary narration of 95 days after the Prophet’s passing, Sayyida Fatima al-Zahra (SA) attained martyrdom on 3 Jumada al-Thani 11 AH at age eighteen and was buried by Imam Ali (AS) in the stillness of the night in Medina.',
    sources: ['Dala’il al-Imamah by al-Tabari al-Imami, p. 134', 'Misbah al-Mutahajjid by Shaykh al-Tusi', 'Al-Kafi, Vol. 1, p. 458', 'Mafatih al-Jinan'],
    sourceReliability: 'confirmed',
    dateStatus: 'different_narrations',
    alternateNarrations: '95 days (3 Jumada al-Thani) and 75 days (13 Jumada al-Awwal) are the two authoritative Imami narrations.',
    calendarNotes: 'Culmination of Ayyam al-Fatimiyyah worldwide.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'critical',
    translations: {
      en: 'Shahadat of Sayyida Fatima al-Zahra (SA) (3 Jumada al-Thani 11 AH)',
      ar: 'شهادة الصديقة الكبرى فاطمة الزهراء عليها السلام (٣ جمادى الآخرة)',
      ur: 'شہادتِ سیدۃ النساء العالمین حضرت فاطمۃ الزہراؑ (۳ جمادی الثانی ۱۱ھ)',
      ro: 'Shahadat-e-Sayyida Fatima al-Zahra (SA) (3 Jumada al-Thani)',
      hi: 'सैय्यदा फ़ातिमा ज़हरा (स.अ.) की शहादत (३ जुमादा अल-सानी)',
      fa: 'شهادت حضرت صدیقه طاهره فاطمه زهرا سلام‌الله‌علیها (۳ جمادی‌الثانی)'
    }
  },
  {
    eventId: 'ev_jum2_13',
    slug: '13-jumada-al-thani-wafat-hazrat-umm-al-banin',
    title: 'Passing (Wafat) of Hazrat Umm al-Banin Fatima bint Hizam al-Kilabiyya (SA)',
    arabicTitle: 'وفاة السيدة أم البنين فاطمة بنت حزام الكلابية والدة أبي الفضل العباس (١٣ جمادى الآخرة ٦٤ هـ)',
    eventType: 'shahadat',
    hijriDay: 13,
    hijriMonth: 6,
    historicalYearAH: '64 AH',
    gregorianHistoricalDate: '6 February 684 CE',
    gregorianMonthDay: { month: 2, day: 6 },
    personalityIds: ['umm_al_banin', 'abbas_ibn_ali', 'imam_ali'],
    locationIds: ['abbas_shrine_present'],
    summary: 'Passing of Hazrat Umm al-Banin (SA), devoted wife of Imam Ali (AS) and mother of Hazrat Abu al-Fadl al-Abbas (AS) and his three brothers who were all martyred defending Imam Hussain (AS) at Karbala.',
    fullDescription: 'When Bashir ibn al-Jadhlam announced the news of Karbala in Medina, Umm al-Banin asked first and only about the safety of Imam Hussain (AS), declaring that her four sons (Abbas, Abdullah, Ja’far, and Uthman) and all under the heavens were a ransom for Abu Abdullah. She passed away on 13 Jumada al-Thani 64 AH and was buried in Jannat al-Baqi.',
    sources: ['Maqatil al-Talibiyyin by Abu al-Faraj al-Isfahani', 'A’yan al-Shi’a by Sayyid Muhsin al-Amin', 'Muntaha al-Amal'],
    sourceReliability: 'widely_reported',
    dateStatus: 'confirmed',
    calendarNotes: 'Honored across the Islamic world as the Day of Mothers of Martyrs.',
    recommendedZiyarat: 'ziyarat_abbas',
    importance: 'high',
    translations: {
      en: 'Passing of Hazrat Umm al-Banin (SA), Mother of Hazrat Abbas (13 Jumada al-Thani 64 AH)',
      ar: 'وفاة السيدة الجليلة أم البنين والدة قمر بني هاشم (١٣ جمادى الآخرة)',
      ur: 'وفاتِ حضرت ام البنینؑ مادرِ حضرت عباس علمدارؑ (۱۳ جمادی الثانی ۶۴ھ)',
      ro: 'Wafat-e-Hazrat Umm al-Banin (SA) (13 Jumada al-Thani)',
      hi: 'हज़रत उम्मुल बनीन (स.अ.) की वफ़ात (१३ जुमादा अल-सानी)',
      fa: 'وفات حضرت ام‌البنین سلام‌الله‌علیها مادر حضرت عباس (۱۳ جمادی‌الثانی)'
    }
  },
  {
    eventId: 'ev_jum2_20',
    slug: '20-jumada-al-thani-wiladat-sayyida-fatima-al-zahra',
    title: 'Blessed Wiladat of Sayyida Fatima al-Zahra (SA) — Leader of the Women of the Worlds',
    arabicTitle: 'ولادة الصديقة الكبرى السيدة فاطمة الزهراء عليها السلام (٢٠ جمادى الآخرة ٥ ق.هـ)',
    eventType: 'wiladat',
    hijriDay: 20,
    hijriMonth: 6,
    historicalYearAH: '5th Year after Bi’thah (8 BH)',
    gregorianHistoricalDate: '615 CE',
    gregorianMonthDay: { month: 3, day: 20 },
    personalityIds: ['fatima_al_zahra', 'prophet_muhammad', 'imam_ali'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Blessed birth anniversary of Sayyida Fatima al-Zahra (SA), daughter of Prophet Muhammad (SAWW) and Sayyida Khadija al-Kubra (SA), the fountainhead of Kauthar and the Imamate.',
    fullDescription: 'Born in Mecca on Friday, 20 Jumada al-Thani in the fifth year after the prophetic mission, Sayyida Fatima al-Zahra (SA) is honored in the Quran (Surah al-Kauthar, Surah al-Insan, and the Verse of Purification 33:33) as the luminous root of the Twelve Imams.',
    sources: ['Al-Kafi by Shaykh al-Kulayni, Vol. 1, p. 458', 'Misbah al-Mutahajjid by Shaykh al-Tusi', 'Kitab al-Irshad'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Celebrated as Mother’s Day and Women’s Honour Day across Ahlul Bayt communities.',
    recommendedZiyarat: 'ziyarat_warith',
    importance: 'critical',
    translations: {
      en: 'Wiladat of Sayyida Fatima al-Zahra (SA) (20 Jumada al-Thani)',
      ar: 'ولادة سيدة نساء العالمين فاطمة الزهراء عليها السلام (٢٠ جمادى الآخرة)',
      ur: 'ولادتِ باسعادت سیدہ فاطمۃ الزہراؑ (۲۰ جمادی الثانی)',
      ro: 'Wiladat-e-Sayyida Fatima al-Zahra (SA) (20 Jumada al-Thani)',
      hi: 'सैय्यदा फ़ातिमा ज़हरा (स.अ.) की विलादत (२० जुमादा अल-सानी)',
      fa: 'ولادت باسعادت حضرت فاطمه زهرا سلام‌الله‌علیها (۲۰ جمادی‌الثانی)'
    }
  },

  // ======================== 7. RAJAB ========================
  {
    eventId: 'ev_raj_01',
    slug: '1-rajab-wiladat-imam-muhammad-al-baqir',
    title: 'Blessed Wiladat of Imam Muhammad ibn Ali al-Baqir (AS)',
    arabicTitle: 'ولادة الإمام محمد بن علي الباقر باقر علوم الأولين والآخرين عليه السلام (١ رجب ٥٧ هـ)',
    eventType: 'wiladat',
    hijriDay: 1,
    hijriMonth: 7,
    historicalYearAH: '57 AH',
    gregorianHistoricalDate: '12 May 677 CE',
    gregorianMonthDay: { month: 5, day: 12 },
    personalityIds: ['zain_al_abideen', 'imam_hussain'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Blessed birth anniversary of the Fifth Imam, Muhammad ibn Ali al-Baqir (AS), who was present as a four-year-old child with his grandfather Imam Hussain (AS) at Karbala in 61 AH.',
    fullDescription: 'Born in Medina on 1 Rajab 57 AH to Imam Zain al-Abideen (AS) and Fatima bint al-Hasan (Umm Abdullah), uniting the Hasanid and Husaynid lineages, Imam al-Baqir (AS) witnessed the tragedy of Karbala and later established the great seminary of Medina.',
    sources: ['Al-Kafi by Shaykh al-Kulayni, Vol. 1, p. 469', 'Misbah al-Mutahajjid by Shaykh al-Tusi', 'Kitab al-Irshad, Vol. 2, p. 157'],
    sourceReliability: 'confirmed',
    dateStatus: 'different_narrations',
    alternateNarrations: '1 Rajab 57 AH is recorded in Al-Kafi and Misbah al-Mutahajjid; another narration mentions 3 Safar 57 AH.',
    calendarNotes: 'Special Ziyarat of Imam Hussain (AS) is prescribed on 1 Rajab.',
    recommendedZiyarat: 'ziyarat_warith',
    importance: 'high',
    translations: {
      en: 'Wiladat of Imam Muhammad al-Baqir (AS) (1 Rajab 57 AH)',
      ar: 'ولادة الإمام محمد الباقر عليه السلام وزيارة أول رجب (١ رجب)',
      ur: 'ولادتِ باسعادت امام محمد باقرؑ اور زیارتِ یکم رجب (۱ رجب ۵۷ھ)',
      ro: 'Wiladat-e-Imam Muhammad al-Baqir (AS) (1 Rajab)',
      hi: 'इमाम मुहम्मद अल-बाक़िर (अ.स.) की विलादत (१ रजब)',
      fa: 'ولادت باسعادت امام محمد باقر علیه‌السلام (اول رجب ۵۷ هـ)'
    }
  },
  {
    eventId: 'ev_raj_03',
    slug: '3-rajab-shahadat-imam-ali-al-hadi',
    title: 'Shahadat of Imam Ali ibn Muhammad al-Hadi al-Naqi (AS) in Samarra',
    arabicTitle: 'شهادة الإمام علي بن محمد الهادي النقي عليه السلام في سامراء (٣ رجب ٢٥٤ هـ)',
    eventType: 'shahadat',
    hijriDay: 3,
    hijriMonth: 7,
    historicalYearAH: '254 AH',
    gregorianHistoricalDate: '28 June 868 CE',
    gregorianMonthDay: { month: 6, day: 28 },
    personalityIds: ['zain_al_abideen'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Martyrdom of the Tenth Imam, Ali ibn Muhammad al-Hadi (AS), author of the monumental Ziyarat al-Jami’ah al-Kabirah, in Samarra.',
    fullDescription: 'On 3 Rajab 254 AH, Imam Ali al-Hadi (AS) was martyred by poison in Samarra at age forty-one after twenty years under Abbasid house arrest, leaving behind timeless theological treatises and the Ziyarat al-Jami’ah al-Kabirah.',
    sources: ['Kitab al-Irshad by Shaykh al-Mufid, Vol. 2, p. 297', 'Al-Kafi, Vol. 1, p. 497'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Observed on 3 Rajab across Iraq, Iran, and South Asia.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'high',
    translations: {
      en: 'Shahadat of Imam Ali al-Hadi al-Naqi (AS) (3 Rajab 254 AH)',
      ar: 'شهادة الإمام علي بن محمد الهادي عليه السلام (٣ رجب)',
      ur: 'شہادتِ امام علی نقی الہادیؑ بمقامِ سامراء (۳ رجب ۲۵۴ھ)',
      ro: 'Shahadat-e-Imam Ali al-Naqi al-Hadi (AS) (3 Rajab)',
      hi: 'इमाम अली अल-हादी (अ.स.) की शहादत (३ रजब)',
      fa: 'شهادت امام علی النقی الهادی علیه‌السلام در سامرا (۳ رجب)'
    }
  },
  {
    eventId: 'ev_raj_10',
    slug: '10-rajab-wiladat-imam-muhammad-al-jawad',
    title: 'Blessed Wiladat of Imam Muhammad ibn Ali al-Jawad al-Taqi (AS)',
    arabicTitle: 'ولادة الإمام محمد بن علي الجواد التقي عليه السلام (١٠ رجب ١٩٥ هـ)',
    eventType: 'wiladat',
    hijriDay: 10,
    hijriMonth: 7,
    historicalYearAH: '195 AH',
    gregorianHistoricalDate: '8 April 811 CE',
    gregorianMonthDay: { month: 4, day: 8 },
    personalityIds: ['zain_al_abideen'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Blessed birth anniversary of the Ninth Imam, Muhammad ibn Ali al-Jawad (AS), born in Medina on 10 Rajab 195 AH.',
    fullDescription: 'Son of Imam Ali al-Rida (AS), Imam Muhammad al-Jawad (AS) assumed the Imamate at age eight, demonstrating divine knowledge before the jurists of Baghdad.',
    sources: ['Misbah al-Mutahajjid by Shaykh al-Tusi', 'Kitab al-Irshad, Vol. 2, p. 273', 'Al-Kafi, Vol. 1, p. 492'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Celebrated in Kadhimiya and across the Islamic world.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'high',
    translations: {
      en: 'Wiladat of Imam Muhammad al-Jawad al-Taqi (AS) (10 Rajab 195 AH)',
      ar: 'ولادة الإمام محمد بن علي الجواد عليه السلام (١٠ رجب)',
      ur: 'ولادتِ باسعادت امام محمد تقی الجوادؑ (۱۰ رجب ۱۹۵ھ)',
      ro: 'Wiladat-e-Imam Muhammad Taqi al-Jawad (AS) (10 Rajab)',
      hi: 'इमाम मुहम्मद अल-जवाद (अ.स.) की विलादत (१० रजब)',
      fa: 'ولادت باسعادت امام محمد تقی جوادالائمه علیه‌السلام (۱۰ رجب)'
    }
  },
  {
    eventId: 'ev_raj_13',
    slug: '13-rajab-wiladat-imam-ali-ibn-abi-talib',
    title: 'Blessed Wiladat of Amir al-Mu’minin Imam Ali ibn Abi Talib (AS) Inside the Sacred Kaaba',
    arabicTitle: 'ولادة أمير المؤمنين الإمام علي بن أبي طالب عليه السلام في جوف الكعبة المشرفة (١٣ رجب ٣٠ عام الفيل)',
    eventType: 'wiladat',
    hijriDay: 13,
    hijriMonth: 7,
    historicalYearAH: '30th Year of the Elephant (23 BH)',
    gregorianHistoricalDate: '599 CE',
    gregorianMonthDay: { month: 3, day: 17 },
    personalityIds: ['imam_ali', 'prophet_muhammad', 'fatima_al_zahra'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Blessed birth of Imam Ali ibn Abi Talib (AS) to Fatima bint Asad inside the Sacred Kaaba in Mecca—an honor granted to no human being before or after him.',
    fullDescription: 'On Friday, 13 Rajab in the 30th Year of the Elephant, the wall of the Sacred Kaaba at al-Mustajar parted for Fatima bint Asad, and Amir al-Mu’minin Ali ibn Abi Talib (AS) was born within the House of God, opening his eyes upon the face of Prophet Muhammad (SAWW).',
    sources: [
      'Kitab al-Irshad by Shaykh al-Mufid, Vol. 1, p. 5',
      'Al-Mustadrak ala al-Sahihayn by al-Hakim al-Naysaburi, Vol. 3, p. 483 ("Mutawatir narrations that Fatima bint Asad gave birth to Ali inside the Kaaba")',
      'Muruj al-Dhahab by al-Mas’udi'
    ],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Opens the three white days of Rajab (Ayyam al-Bid: 13, 14, 15 Rajab).',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'critical',
    translations: {
      en: 'Wiladat of Amir al-Mu’minin Imam Ali ibn Abi Talib (AS) in the Kaaba (13 Rajab)',
      ar: 'ولادة أمير المؤمنين الإمام علي بن أبي طالب عليه السلام في الكعبة المشرفة (١٣ رجب)',
      ur: 'ولادتِ باسعادت امیرالمومنین امام علی ابن ابی طالبؑ در خانۂ کعبہ (۱۳ رجب المرجب)',
      ro: 'Wiladat-e-Amir al-Muminin Imam Ali (AS) (13 Rajab)',
      hi: 'अमीरुल मोमिनीन इमाम अली (अ.स.) की काबा में विलादत (१३ रजब)',
      fa: 'ولادت باسعادت امیرالمؤمنین امام علی علیه‌السلام در کعبه (۱۳ رجب)'
    }
  },
  {
    eventId: 'ev_raj_15',
    slug: '15-rajab-wafat-sayyida-zaynab-bint-ali',
    title: 'Passing (Wafat) of Sayyida Zaynab bint Ali al-Kubra (SA) & Mid-Rajab Ziyarat of Imam Hussain',
    arabicTitle: 'وفاة عقيلة بني هاشم السيدة زينب الكبرى عليها السلام وزيارة النصف من رجب (١٥ رجب ٦٢ هـ)',
    eventType: 'shahadat',
    hijriDay: 15,
    hijriMonth: 7,
    historicalYearAH: '62 AH',
    gregorianHistoricalDate: '27 March 682 CE',
    gregorianMonthDay: { month: 3, day: 27 },
    personalityIds: ['zaynab_bint_ali', 'imam_hussain'],
    locationIds: ['zaynabiyya_hill_present', 'hussain_shrine_present'],
    summary: 'Commemoration of the passing of Sayyida Zaynab bint Ali (SA), guardian of the message of Karbala, a little over one year after Ashura, and the special Mid-Rajab Ziyarat of Imam Hussain (AS).',
    fullDescription: 'On 15 Rajab 62 AH, after tirelessly proclaiming the truth of Karbala following the return from captivity, Aqilat Bani Hashim Sayyida Zaynab bint Ali (SA) departed this world. 15 Rajab is also one of the major annual seasons of Ziyarat at the Holy Shrine of Imam Hussain (AS) in Karbala.',
    sources: ['A’yan al-Shi’a by Sayyid Muhsin al-Amin', 'Misbah al-Mutahajjid (Ziyarat of 15 Rajab)', 'Khasais al-Zaynabiyya'],
    sourceReliability: 'widely_reported',
    dateStatus: 'confirmed',
    calendarNotes: 'Observed globally on 15 Rajab with mourning gatherings for Sayyida Zaynab (SA).',
    recommendedZiyarat: 'ziyarat_warith',
    importance: 'critical',
    translations: {
      en: 'Passing of Sayyida Zaynab bint Ali (SA) & Mid-Rajab Ziyarat (15 Rajab 62 AH)',
      ar: 'وفاة السيدة زينب الكبرى عليها السلام وزيارة الإمام الحسين في النصف من رجب',
      ur: 'وفاتِ ثانیِ زہرا سیدہ زینب الکبریٰؑ اور زیارتِ نیمۂ رجب (۱۵ رجب ۶۲ھ)',
      ro: 'Wafat-e-Sayyida Zaynab bint Ali (SA) (15 Rajab)',
      hi: 'सैय्यदा ज़ैनब बिन्त अली (स.अ.) की वफ़ात (१५ रजब)',
      fa: 'وفات حضرت زینب کبری سلام‌الله‌علیها و زیارت نیمه رجب (۱۵ رجب ۶۲ هـ)'
    }
  },
  {
    eventId: 'ev_raj_25',
    slug: '25-rajab-shahadat-imam-musa-al-kazim',
    title: 'Shahadat of Imam Musa ibn Ja’far al-Kazim (AS) in Baghdad (Kadhimiya)',
    arabicTitle: 'شهادة الإمام موسى بن جعفر الكاظم باب الحوائج عليه السلام في بغداد (٢٥ رجب ١٨٣ هـ)',
    eventType: 'shahadat',
    hijriDay: 25,
    hijriMonth: 7,
    historicalYearAH: '183 AH',
    gregorianHistoricalDate: '1 September 799 CE',
    gregorianMonthDay: { month: 9, day: 1 },
    personalityIds: ['zain_al_abideen'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Martyrdom of the Seventh Imam, Musa ibn Ja’far al-Kazim (AS) — Bab al-Hawa’ij — in the prison of al-Sindi ibn Shahak in Baghdad under Harun al-Rashid.',
    fullDescription: 'After enduring years of imprisonment in Basra and Baghdad with extraordinary patience and worship, Imam Musa al-Kazim (AS) was martyred by poison on 25 Rajab 183 AH and buried in the Quraysh cemetery in Kadhimiya.',
    sources: ['Kitab al-Irshad by Shaykh al-Mufid, Vol. 2, pp. 236–244', 'Al-Kafi, Vol. 1, p. 476', 'Uyun Akhbar al-Rida'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Millions of pilgrims walk to Kadhimiya in Baghdad on 25 Rajab.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'critical',
    translations: {
      en: 'Shahadat of Imam Musa al-Kazim (AS) in Baghdad (25 Rajab 183 AH)',
      ar: 'شهادة الإمام موسى بن جعفر الكاظم عليه السلام في الكاظمية (٢٥ رجب)',
      ur: 'شہادتِ باب الحوائج امام موسیٰ کاظمؑ بمقامِ بغداد (۲۵ رجب ۱۸۳ھ)',
      ro: 'Shahadat-e-Imam Musa al-Kazim (AS) (25 Rajab)',
      hi: 'इमाम मूसा अल-काज़िम (अ.स.) की शहादत (२५ रजब)',
      fa: 'شهادت امام موسی کاظم علیه‌السلام در کاظمین (۲۵ رجب ۱۸۳ هـ)'
    }
  },
  {
    eventId: 'ev_raj_27',
    slug: '27-rajab-eid-al-mabath',
    title: 'Eid al-Mab’ath — Commencement of the Prophetic Mission of Muhammad (SAWW)',
    arabicTitle: 'عيد المبعث النبوي الشريف — بعثة النبي الأكرم محمد صلى الله عليه وآله (٢٧ رجب ١٣ ق.هـ)',
    eventType: 'wiladat',
    hijriDay: 27,
    hijriMonth: 7,
    historicalYearAH: '13 BH (40th Year of the Elephant)',
    gregorianHistoricalDate: '610 CE',
    gregorianMonthDay: { month: 8, day: 10 },
    personalityIds: ['prophet_muhammad', 'imam_ali'],
    locationIds: ['hussain_shrine_present'],
    summary: 'The sacred day on which Angel Jibra’il descended with the opening verses of Surah al-Alaq ("Iqra") to Prophet Muhammad (SAWW) at Cave Hira.',
    fullDescription: 'On 27 Rajab, forty years after the Year of the Elephant, the formal prophetic mission (Bi’thah) of Prophet Muhammad (SAWW) was proclaimed, with Imam Ali ibn Abi Talib (AS) and Sayyida Khadija al-Kubra (SA) standing beside him as the first believers.',
    sources: ['Al-Kafi by Shaykh al-Kulayni, Vol. 4, p. 149', 'Misbah al-Mutahajjid by Shaykh al-Tusi', 'Iqbal al-A’mal by Sayyid Ibn Tawus'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'One of the four greatest sacred days of the Islamic year in Imami tradition.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'critical',
    translations: {
      en: 'Eid al-Mab’ath — Prophetic Mission of Muhammad (SAWW) (27 Rajab)',
      ar: 'عيد المبعث النبوي الشريف (٢٧ رجب الأصب)',
      ur: 'عیدِ مبعث — یومِ بعثتِ حضرت محمد مصطفیٰﷺ (۲۷ رجب المرجب)',
      ro: 'Eid-e-Mabath — Yaum-e-Bi’that-e-Rasool-e-Khuda (27 Rajab)',
      hi: 'ईद-ए-मबअस — पैग़म्बर मुहम्मद (स.अ.व.) की बिअसत (२७ रजब)',
      fa: 'عید سعید مبعث حضرت رسول اکرم صلی‌الله‌علیه‌وآله (۲۷ رجب)'
    }
  },
  {
    eventId: 'ev_raj_28',
    slug: '28-rajab-departure-of-imam-hussain-from-madinah',
    title: 'Departure of Imam Hussain (AS) and His Household from Madinah toward Makkah (60 AH)',
    arabicTitle: 'خروج الإمام الحسين عليه السلام وأهل بيته من المدينة المنورة نحو مكة المكرمة (٢٨ رجب ٦٠ هـ)',
    eventType: 'karbala',
    hijriDay: 28,
    hijriMonth: 7,
    historicalYearAH: '60 AH',
    gregorianHistoricalDate: '4 May 680 CE',
    gregorianMonthDay: { month: 5, day: 4 },
    personalityIds: ['imam_hussain', 'abbas_ibn_ali', 'zaynab_bint_ali', 'ali_akbar'],
    locationIds: ['historical_encampment'],
    summary: 'Refusing to pledge allegiance to Yazid ibn Mu’awiya ("A man like me never pledges allegiance to a man like him"), Imam Hussain (AS) bids farewell to the Prophet’s grave and departs Madinah on 28 Rajab 60 AH.',
    fullDescription: 'After Walid ibn Utba and Marwan ibn al-Hakam demanded allegiance to Yazid in Madinah, Imam Hussain (AS) wrote his historic testament to his brother Muhammad ibn al-Hanafiyya ("I rose only to seek reform in the community of my grandfather") and departed Madinah on the night of Sunday, 28 Rajab 60 AH, reciting the verse of Prophet Musa (Quran 28:21).',
    sources: ['Tarikh al-Tabari, Vol. 5, pp. 340–342', 'Kitab al-Irshad by Shaykh al-Mufid, pp. 301–304', 'Maqtal al-Khwarizmi, Vol. 1, p. 188'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'The opening station of the 60–61 AH Karbala Journey.',
    recommendedZiyarat: 'ziyarat_warith',
    importance: 'critical',
    translations: {
      en: 'Departure of Imam Hussain (AS) from Madinah toward Makkah (28 Rajab 60 AH)',
      ar: 'خروج الإمام الحسين عليه السلام من مدينة جده نحو مكة (٢٨ رجب ٦٠ هـ)',
      ur: '۲۸ رجب ۶۰ھ — امام حسینؑ اور قافلۂ اہلِ بیتؑ کا مدینہ منورہ سے مکہ کی جانب سفر',
      ro: '28 Rajab 60 AH — Imam Hussain (AS) ki Madinah se Makkah rawangi',
      hi: '२८ रजब ६० हिजरी — इमाम हुसैन (अ.स.) का मदीना से मक्का प्रस्थान',
      fa: '۲۸ رجب ۶۰ هـ — حرکت کاروان امام حسین علیه‌السلام از مدینه به سوی مکه'
    }
  },

  // ======================== 8. SHA'BAN (THE LIGHTS OF KARBALA) ========================
  {
    eventId: 'ev_sha_03',
    slug: '3-shaban-wiladat-imam-hussain',
    title: 'Blessed Wiladat of Sayyid al-Shuhada Imam Hussain ibn Ali (AS)',
    arabicTitle: 'ولادة سيد الشهداء أبي عبد الله الحسين بن علي عليهما السلام (٣ شعبان ٤ هـ)',
    eventType: 'wiladat',
    hijriDay: 3,
    hijriMonth: 8,
    historicalYearAH: '4 AH',
    gregorianHistoricalDate: '8 January 626 CE',
    gregorianMonthDay: { month: 1, day: 8 },
    personalityIds: ['imam_hussain', 'prophet_muhammad', 'imam_ali', 'fatima_al_zahra'],
    locationIds: ['hussain_shrine_present', 'maqtal_present'],
    summary: 'Blessed birth anniversary of theThird Imam and Master of the Martyrs, Abu Abdullah al-Hussain ibn Ali (AS), born in Medina on 3 Sha’ban 4 AH; also the day Imam Hussain’s caravan entered Makkah in 60 AH.',
    fullDescription: 'Born on 3 Sha’ban 4 AH in Medina, Prophet Muhammad (SAWW) recited the Adhan in his ear, named him al-Hussain by divine command, and declared: "Hussain is from me and I am from Hussain." Remarkably, on the very same date of 3 Sha’ban 60 AH, Imam Hussain’s caravan arrived in Makkah after departing Madinah.',
    sources: ['Misbah al-Mutahajjid by Shaykh al-Tusi', 'Kitab al-Irshad by Shaykh al-Mufid, Vol. 2, p. 27', 'Kamil al-Ziyarat by Ibn Qulawayh'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: '3 Sha’ban is both the Wiladat of Imam Hussain (AS) (4 AH) and his arrival in Makkah (60 AH).',
    recommendedZiyarat: 'ziyarat_warith',
    importance: 'critical',
    translations: {
      en: 'Wiladat of Sayyid al-Shuhada Imam Hussain ibn Ali (AS) (3 Sha’ban 4 AH)',
      ar: 'ولادة سيد الشهداء الإمام أبي عبد الله الحسين عليه السلام (٣ شعبان)',
      ur: 'ولادتِ باسعادت سید الشہداء امام حسین ابن علیؑ (۳ شعبان المعظم ۴ھ)',
      ro: 'Wiladat-e-Imam Hussain ibn Ali (AS) (3 Shaban)',
      hi: 'सैय्यद-उश-शुहदा इमाम हुसैन (अ.स.) की विलादत (३ शाबान)',
      fa: 'ولادت باسعادت سیدالشهدا امام حسین علیه‌السلام (۳ شعبان ۴ هـ)'
    }
  },
  {
    eventId: 'ev_sha_04',
    slug: '4-shaban-wiladat-hazrat-abbas-ibn-ali',
    title: 'Blessed Wiladat of Hazrat Abu al-Fadl al-Abbas ibn Ali (AS) — Qamar Bani Hashim',
    arabicTitle: 'ولادة قمر بني هاشم وحامل اللواء أبي الفضل العباس بن أمير المؤمنين عليهما السلام (٤ شعبان ٢٦ هـ)',
    eventType: 'wiladat',
    hijriDay: 4,
    hijriMonth: 8,
    historicalYearAH: '26 AH',
    gregorianHistoricalDate: '15 May 647 CE',
    gregorianMonthDay: { month: 5, day: 15 },
    personalityIds: ['abbas_ibn_ali', 'imam_ali', 'umm_al_banin', 'imam_hussain'],
    locationIds: ['abbas_shrine_present', 'historical_alqami'],
    summary: 'Blessed birth anniversary of Qamar Bani Hashim, Hazrat Abu al-Fadl al-Abbas ibn Ali (AS), Standard-Bearer of Imam Hussain (AS) at Karbala.',
    fullDescription: 'Born in Medina on 4 Sha’ban 26 AH to Imam Ali ibn Abi Talib (AS) and Hazrat Fatima bint Hizam (Umm al-Banin), Imam Ali kissed his infant hands and wept, foreseeing that those hands would be severed beside the Euphrates in defense of Imam Hussain (AS) and replaced by two wings in Paradise.',
    sources: ['Maqatil al-Talibiyyin by Abu al-Faraj al-Isfahani', 'Khasais al-Abbasiyya', 'Muntaha al-Amal by Shaykh Abbas Qummi'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Celebrated across Karbala at Bayn al-Haramayn immediately following 3 Sha’ban.',
    recommendedZiyarat: 'ziyarat_abbas',
    importance: 'critical',
    translations: {
      en: 'Wiladat of Hazrat Abu al-Fadl al-Abbas ibn Ali (AS) (4 Sha’ban 26 AH)',
      ar: 'ولادة قمر بني هاشم أبي الفضل العباس بن علي عليهما السلام (٤ شعبان)',
      ur: 'ولادتِ باسعادت قمرِ بنی ہاشم حضرت ابوالفضل العباس علمدارؑ (۴ شعبان المعظم ۲۶ھ)',
      ro: 'Wiladat-e-Hazrat Abbas Alamdar (AS) (4 Shaban)',
      hi: 'क़मर-ए-बनी हाशिम हज़रत अब्बास अलमदार (अ.स.) की विलादत (४ शाबान)',
      fa: 'ولادت باسعادت قمر بنی‌هاشم حضرت ابوالفضل العباس علیه‌السلام (۴ شعبان)'
    }
  },
  {
    eventId: 'ev_sha_05',
    slug: '5-shaban-wiladat-imam-zain-al-abideen',
    title: 'Blessed Wiladat of Imam Ali ibn al-Hussain Zain al-Abideen al-Sajjad (AS)',
    arabicTitle: 'ولادة الإمام علي بن الحسين زين العابدين وسيد الساجدين عليه السلام (٥ شعبان ٣٨ هـ)',
    eventType: 'wiladat',
    hijriDay: 5,
    hijriMonth: 8,
    historicalYearAH: '38 AH',
    gregorianHistoricalDate: '6 January 659 CE',
    gregorianMonthDay: { month: 1, day: 6 },
    personalityIds: ['zain_al_abideen', 'imam_hussain'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Blessed birth anniversary of the Fourth Imam, Ali ibn al-Hussain Zain al-Abideen (AS), born in Medina on 5 Sha’ban 38 AH.',
    fullDescription: 'Son of Imam Hussain (AS) and Lady Shahrbanu, Imam Zain al-Abideen (AS) was born on 5 Sha’ban 38 AH, completing the three consecutive days of the Lights of Karbala (3, 4, and 5 Sha’ban).',
    sources: ['Misbah al-Mutahajjid by Shaykh al-Tusi', 'Kitab al-Irshad, Vol. 2, p. 137', 'Al-Kafi, Vol. 1, p. 466'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Completes the triad of 3, 4, and 5 Sha’ban celebrations in Karbala.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'critical',
    translations: {
      en: 'Wiladat of Imam Ali ibn al-Hussain Zain al-Abideen (AS) (5 Sha’ban 38 AH)',
      ar: 'ولادة الإمام علي بن الحسين زين العابدين عليه السلام (٥ شعبان)',
      ur: 'ولادتِ باسعادت امام علی زین العابدین سید الساجدینؑ (۵ شعبان المعظم ۳۸ھ)',
      ro: 'Wiladat-e-Imam Zain al-Abideen (AS) (5 Shaban)',
      hi: 'इमाम ज़ैनुल आबिदीन (अ.स.) की विलादत (५ शाबान)',
      fa: 'ولادت باسعادت امام زین‌العابدین علیه‌السلام (۵ شعبان ۳۸ هـ)'
    }
  },
  {
    eventId: 'ev_sha_11',
    slug: '11-shaban-wiladat-hazrat-ali-al-akbar',
    title: 'Blessed Wiladat of Hazrat Ali al-Akbar ibn al-Hussain (AS) — Ashbah al-Nas bi-Rasulillah',
    arabicTitle: 'ولادة شبيه المصطفى علي الأكبر بن الإمام الحسين عليهما السلام (١١ شعبان ٣٣ هـ)',
    eventType: 'wiladat',
    hijriDay: 11,
    hijriMonth: 8,
    historicalYearAH: '33 AH',
    gregorianHistoricalDate: '6 March 654 CE',
    gregorianMonthDay: { month: 3, day: 6 },
    personalityIds: ['ali_akbar', 'imam_hussain'],
    locationIds: ['hussain_shrine_present', 'ali_akbar_present'],
    summary: 'Blessed birth anniversary of Hazrat Ali al-Akbar ibn al-Hussain (AS), who resembled Prophet Muhammad (SAWW) most in form, character, and speech, and was the first of Bani Hashim martyred on Ashura.',
    fullDescription: 'Born on 11 Sha’ban to Imam Hussain (AS) and Layla bint Abi Murrah al-Thaqafiyya, Ali al-Akbar asked his father on the march to Karbala: "Are we not upon the truth?" When the Imam replied "Indeed, by Him to Whom all servants return!", Ali al-Akbar declared: "Then we care not whether we fall upon death or death falls upon us!"',
    sources: ['Kitab al-Irshad by Shaykh al-Mufid', 'Tarikh al-Tabari, Vol. 5, p. 407 & p. 446', 'Maqatil al-Talibiyyin'],
    sourceReliability: 'widely_reported',
    dateStatus: 'confirmed',
    calendarNotes: 'Celebrated as Youth Day in honor of Hazrat Ali al-Akbar (AS).',
    recommendedZiyarat: 'ziyarat_warith',
    importance: 'high',
    translations: {
      en: 'Wiladat of Hazrat Ali al-Akbar ibn al-Hussain (AS) (11 Sha’ban)',
      ar: 'ولادة شبيه الرسول علي الأكبر بن الإمام الحسين عليهما السلام (١١ شعبان)',
      ur: 'ولادتِ باسعادت شبیہِ پیغمبر حضرت علی اکبر ابن الحسینؑ (۱۱ شعبان المعظم)',
      ro: 'Wiladat-e-Hazrat Ali Akbar (AS) (11 Shaban)',
      hi: 'हज़रत अली अकबर इब्नुल हुसैन (अ.स.) की विलादत (११ शाबान)',
      fa: 'ولادت باسعادت حضرت علی‌اکبر علیه‌السلام و روز جوان (۱۱ شعبان)'
    }
  },
  {
    eventId: 'ev_sha_15',
    slug: '15-shaban-wiladat-imam-al-mahdi-and-ziyarat-hussain',
    title: 'Blessed Wiladat of Imam Muhammad al-Mahdi (AJ) & Mid-Sha’ban Ziyarat at Karbala',
    arabicTitle: 'ولادة منقذ البشرية الإمام الحجة بن الحسن المهدي المنتظر (عج) وزيارة النصف من شعبان (١٥ شعبان ٢٥٥ هـ)',
    eventType: 'wiladat',
    hijriDay: 15,
    hijriMonth: 8,
    historicalYearAH: '255 AH',
    gregorianHistoricalDate: '29 July 869 CE',
    gregorianMonthDay: { month: 7, day: 29 },
    personalityIds: ['zain_al_abideen', 'imam_hussain'],
    locationIds: ['hussain_shrine_present', 'bayn_al_haramayn_present'],
    summary: 'Blessed birth anniversary of the Twelfth Imam and Awaited Savior, Hujjat ibn al-Hasan al-Mahdi (AJ), born at dawn in Samarra on 15 Sha’ban 255 AH, and one of the greatest annual Ziyarat gatherings in Karbala.',
    fullDescription: 'At dawn on Friday, 15 Sha’ban 255 AH, Imam Muhammad ibn al-Hasan al-Mahdi (AJ) was born in Samarra to Imam Hasan al-Askari (AS) and Lady Narjis. Authenticated narrations in Kamil al-Ziyarat and Misbah al-Mutahajjid state that visiting Imam Hussain (AS) at Karbala on the Night and Day of 15 Sha’ban carries the blessing of visiting him alongside 124,000 prophets.',
    sources: ['Kamal al-Din by Shaykh al-Saduq', 'Kitab al-Irshad by Shaykh al-Mufid, Vol. 2, p. 339', 'Kamil al-Ziyarat by Ibn Qulawayh (Ziyarat of 15 Sha’ban)'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Second largest annual pilgrimage gathering in Karbala after Arba’een.',
    recommendedZiyarat: 'ziyarat_warith',
    importance: 'critical',
    translations: {
      en: 'Wiladat of Imam Muhammad al-Mahdi (AJ) & Mid-Sha’ban Ziyarat (15 Sha’ban 255 AH)',
      ar: 'ولادة الإمام المهدي المنتظر (عج) وزيارة الإمام الحسين في النصف من شعبان',
      ur: 'ولادتِ باسعادت حضرت امام مہدی صاحب الزمانؑ اور زیارتِ نیمۂ شعبان (۱۵ شعبان ۲۵۵ھ)',
      ro: 'Wiladat-e-Imam-e-Zaman Hazrat Mahdi (AJ) (15 Shaban)',
      hi: 'इमाम मुहम्मद अल-महदी (अ.ज.) की विलादत और १५ शाबान की ज़ियारत',
      fa: 'ولادت باسعادت حضرت ولی‌عصر امام زمان (عج) و زیارت نیمه شعبان (۱۵ شعبان ۲۵۵ هـ)'
    }
  },

  // ======================== 9. RAMADAN ========================
  {
    eventId: 'ev_ram_10',
    slug: '10-ramadan-wafat-sayyida-khadija-al-kubra',
    title: 'Passing (Wafat) of Umm al-Mu’minin Sayyida Khadija al-Kubra (SA)',
    arabicTitle: 'وفاة أم المؤمنين السيدة خديجة الكبرى عليها السلام في عام الحزن (١٠ شهر رمضان ١٠ بعثة)',
    eventType: 'shahadat',
    hijriDay: 10,
    hijriMonth: 9,
    historicalYearAH: '10th Year after Bi’thah (3 BH)',
    gregorianHistoricalDate: '619 CE',
    gregorianMonthDay: { month: 4, day: 19 },
    personalityIds: ['prophet_muhammad', 'fatima_al_zahra'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Passing of Sayyida Khadija bint Khuwaylid (SA), the first believer in Islam, devoted spouse of Prophet Muhammad (SAWW), and grandmother of Imam Hasan and Imam Hussain (AS).',
    fullDescription: 'On 10 Ramadan in the Year of Sorrow (Am al-Huzn), shortly after the lifting of the three-year siege in Shi’b Abi Talib, Sayyida Khadija al-Kubra (SA) passed away in Mecca and was buried at Jannat al-Mu’alla.',
    sources: ['Al-Kafi by Shaykh al-Kulayni, Vol. 1, p. 439', 'Misbah al-Mutahajjid by Shaykh al-Tusi', 'Tarikh al-Ya’qubi'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Observed across the Islamic world on 10 Ramadan.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'high',
    translations: {
      en: 'Passing of Umm al-Mu’minin Sayyida Khadija al-Kubra (SA) (10 Ramadan)',
      ar: 'وفاة أم المؤمنين السيدة خديجة الكبرى عليها السلام (١٠ شهر رمضان)',
      ur: 'وفاتِ ام المومنین سیدہ خدیجۃ الکبریٰؑ (۱۰ رمضان المبارک)',
      ro: 'Wafat-e-Ummul Muminin Sayyida Khadija al-Kubra (SA) (10 Ramadan)',
      hi: 'उम्मुल मोमिनीन सैय्यदा ख़दीजा अल-कुबरा (स.अ.) की वफ़ात (१० रमज़ान)',
      fa: 'وفات ام‌المؤمنین حضرت خدیجه کبری سلام‌الله‌علیها (۱۰ رمضان)'
    }
  },
  {
    eventId: 'ev_ram_15',
    slug: '15-ramadan-wiladat-imam-hasan-al-mujtaba',
    title: 'Blessed Wiladat of Imam Hasan ibn Ali al-Mujtaba (AS) — Sibt al-Akbar',
    arabicTitle: 'ولادة كريم أهل البيت الإمام الحسن بن علي المجتبى عليهما السلام (١٥ شهر رمضان ٣ هـ)',
    eventType: 'wiladat',
    hijriDay: 15,
    hijriMonth: 9,
    historicalYearAH: '3 AH',
    gregorianHistoricalDate: '1 March 625 CE',
    gregorianMonthDay: { month: 3, day: 1 },
    personalityIds: ['imam_hasan', 'prophet_muhammad', 'imam_ali', 'fatima_al_zahra'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Blessed birth anniversary of the Second Imam and eldest grandson of Prophet Muhammad (SAWW), Imam Hasan ibn Ali al-Mujtaba (AS), born in Medina on the night of 15 Ramadan 3 AH.',
    fullDescription: 'Born on the full-moon night of 15 Ramadan 3 AH to Imam Ali (AS) and Sayyida Fatima al-Zahra (SA), Prophet Muhammad (SAWW) named him al-Hasan and declared: "Hasan and Hussain are the two masters of the youth of Paradise." His son Hazrat Qasim ibn Hasan (AS) later attained martyrdom alongside Imam Hussain (AS) at Karbala.',
    sources: ['Al-Kafi by Shaykh al-Kulayni, Vol. 1, p. 461', 'Kitab al-Irshad by Shaykh al-Mufid, Vol. 2, p. 3', 'Misbah al-Mutahajjid'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Celebrated globally at the midpoint of the blessed month of Ramadan.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'critical',
    translations: {
      en: 'Wiladat of Imam Hasan ibn Ali al-Mujtaba (AS) (15 Ramadan 3 AH)',
      ar: 'ولادة كريم أهل البيت الإمام الحسن المجتبى عليه السلام (١٥ شهر رمضان)',
      ur: 'ولادتِ باسعادت کریمِ اہلِ بیت امام حسن مجتبیٰؑ (۱۵ رمضان المبارک ۳ھ)',
      ro: 'Wiladat-e-Imam Hasan al-Mujtaba (AS) (15 Ramadan)',
      hi: 'इमाम हसन अल-मुजतबा (अ.स.) की विलादत (१५ रमज़ान)',
      fa: 'ولادت باسعادت کریم اهل‌بیت امام حسن مجتبی علیه‌السلام (۱۵ رمضان ۳ هـ)'
    }
  },
  {
    eventId: 'ev_ram_19',
    slug: '19-ramadan-strike-against-imam-ali-in-kufa-mosque',
    title: 'Strike Against Amir al-Mu’minin Imam Ali (AS) in the Mihrab of Kufa & First Night of Qadr',
    arabicTitle: 'جرح أمير المؤمنين الإمام علي عليه السلام في محراب مسجد الكوفة وليلة القدر الأولى (١٩ شهر رمضان ٤٠ هـ)',
    eventType: 'shahadat',
    hijriDay: 19,
    hijriMonth: 9,
    historicalYearAH: '40 AH',
    gregorianHistoricalDate: '26 January 661 CE',
    gregorianMonthDay: { month: 1, day: 26 },
    personalityIds: ['imam_ali', 'imam_hasan', 'imam_hussain', 'abbas_ibn_ali'],
    locationIds: ['hussain_shrine_present'],
    summary: 'At dawn on 19 Ramadan 40 AH, while prostrating in the Fajr prayer in the Great Mosque of Kufa, Amir al-Mu’minin Imam Ali (AS) is struck with a poisoned sword, proclaiming: "Fuztu wa Rabbil-Ka’bah!" (By the Lord of the Kaaba, I have succeeded!).',
    fullDescription: 'During the dawn prayer of 19 Ramadan 40 AH, Abd al-Rahman ibn Muljam struck Imam Ali ibn Abi Talib (AS) in the Mihrab of Kufa. The Imam immediately instructed his sons Hasan and Hussain to treat the prisoner with justice and feed him from the same milk brought to the Imam.',
    sources: ['Kitab al-Irshad by Shaykh al-Mufid, Vol. 1, pp. 14–22', 'Tarikh al-Tabari, Vol. 4, pp. 111–115', 'Nahj al-Balaghah (Letter 47)'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'First of the three Laylat al-Qadr nights (19, 21, 23 Ramadan).',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'critical',
    translations: {
      en: 'Strike Against Imam Ali (AS) in Kufa Mihrab & Laylat al-Qadr (19 Ramadan 40 AH)',
      ar: 'ضربة أمير المؤمنين الإمام علي عليه السلام في محراب الكوفة (١٩ شهر رمضان)',
      ur: 'ضربتِ امیرالمومنین امام علی ابن ابی طالبؑ در محرابِ مسجدِ کوفہ (۱۹ رمضان ۴۰ھ)',
      ro: 'Zarbat-e-Amir al-Muminin Imam Ali (AS) (19 Ramadan)',
      hi: 'मसजिद-ए-कूफ़ा में इमाम अली (अ.स.) पर प्रहार (१९ रमज़ान)',
      fa: 'ضربت خوردن امیرالمؤمنین امام علی علیه‌السلام در محراب کوفه (۱۹ رمضان ۴۰ هـ)'
    }
  },
  {
    eventId: 'ev_ram_21',
    slug: '21-ramadan-shahadat-imam-ali-ibn-abi-talib',
    title: 'Shahadat of Amir al-Mu’minin Imam Ali ibn Abi Talib (AS) in Kufa / Najaf al-Ashraf',
    arabicTitle: 'شهادة أمير المؤمنين وإمام المتقين علي بن أبي طالب عليه السلام (٢١ شهر رمضان ٤٠ هـ)',
    eventType: 'shahadat',
    hijriDay: 21,
    hijriMonth: 9,
    historicalYearAH: '40 AH',
    gregorianHistoricalDate: '28 January 661 CE',
    gregorianMonthDay: { month: 1, day: 28 },
    personalityIds: ['imam_ali', 'imam_hasan', 'imam_hussain', 'abbas_ibn_ali', 'zaynab_bint_ali'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Martyrdom of the First Imam, Commander of the Faithful Ali ibn Abi Talib (AS), on the night of 21 Ramadan 40 AH, and his burial by Imam Hasan, Imam Hussain, and Hazrat Abbas at Najaf al-Ashraf.',
    fullDescription: 'Two days after being struck in the Mihrab of Kufa, after delivering his immortal ethical testament to Imam Hasan, Imam Hussain, and all his children (Nahj al-Balaghah, Letter 47), Imam Ali (AS) attained martyrdom on the night of 21 Ramadan 40 AH and was buried secretly at al-Ghariyy (Najaf al-Ashraf).',
    sources: ['Kitab al-Irshad by Shaykh al-Mufid, Vol. 1, p. 9', 'Al-Kafi by Shaykh al-Kulayni, Vol. 1, p. 452', 'Nahj al-Balaghah'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Observed globally on 21 Ramadan alongside the second Night of Qadr.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'critical',
    translations: {
      en: 'Shahadat of Amir al-Mu’minin Imam Ali ibn Abi Talib (AS) (21 Ramadan 40 AH)',
      ar: 'شهادة أمير المؤمنين الإمام علي بن أبي طالب عليه السلام (٢١ شهر رمضان)',
      ur: 'شہادتِ امیرالمومنین امام علی ابن ابی طالبؑ (۲۱ رمضان المبارک ۴۰ھ)',
      ro: 'Shahadat-e-Amir al-Muminin Imam Ali (AS) (21 Ramadan)',
      hi: 'अमीरुल मोमिनीन इमाम अली (अ.स.) की शहादत (२१ रमज़ान)',
      fa: 'شهادت امیرالمؤمنین امام علی علیه‌السلام (۲۱ رمضان ۴۰ هـ)'
    }
  },
  {
    eventId: 'ev_ram_23',
    slug: '23-ramadan-laylat-al-qadr-and-ziyarat-hussain',
    title: 'Laylat al-Qadr (23rd Night of Ramadan) & Sacred Ziyarat of Imam Hussain (AS)',
    arabicTitle: 'ليلة القدر الكبرى وزيارة الإمام الحسين عليه السلام (٢٣ شهر رمضان المبارك)',
    eventType: 'historical',
    hijriDay: 23,
    hijriMonth: 9,
    historicalYearAH: 'Annual Sacred Observance',
    gregorianHistoricalDate: 'Annual Lunar Night',
    gregorianMonthDay: { month: 3, day: 12 },
    personalityIds: ['imam_hussain', 'zain_al_abideen'],
    locationIds: ['hussain_shrine_present', 'bayn_al_haramayn_present'],
    summary: 'The supreme Night of Decree (Laylat al-Qadr) in Imami tradition, on which reciting the Ziyarat of Imam Hussain (AS) at Karbala or from afar is emphasized in primary Hadith collections.',
    fullDescription: 'Authenticated narrations in Kamil al-Ziyarat (Chapters 72–73) from Imam Muhammad al-Baqir and Imam Ja’far al-Sadiq (AS) emphasize that on Laylat al-Qadr, a caller from the seventh heaven proclaims forgiveness for every pilgrim who visits the grave of Imam Hussain (AS).',
    sources: ['Kamil al-Ziyarat by Ibn Qulawayh, Ch. 72', 'Iqbal al-A’mal by Sayyid Ibn Tawus', 'Misbah al-Mutahajjid'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Culmination of the three nights of Laylat al-Qadr.',
    recommendedZiyarat: 'ziyarat_warith',
    importance: 'high',
    translations: {
      en: 'Laylat al-Qadr & Sacred Ziyarat of Imam Hussain (AS) (23 Ramadan)',
      ar: 'ليلة القدر الكبرى وزيارة أبي عبد الله الحسين عليه السلام (٢٣ رمضان)',
      ur: 'شبِ قدر اور زیارتِ سید الشہداء امام حسینؑ (۲۳ رمضان المبارک)',
      ro: 'Shab-e-Qadr aur Ziyarat-e-Imam Hussain (AS) (23 Ramadan)',
      hi: 'शब-ए-क़द्र और इमाम हुसैन (अ.स.) की ज़ियारत (२३ रमज़ान)',
      fa: 'شب قدر و زیارت مخصوصه امام حسین علیه‌السلام (۲۳ رمضان)'
    }
  },

  // ======================== 10. SHAWWAL ========================
  {
    eventId: 'ev_shaw_01',
    slug: '1-shawwal-eid-al-fitr-and-ziyarat-hussain',
    title: 'Eid al-Fitr & Prescribed Eid Ziyarat of Imam Hussain (AS)',
    arabicTitle: 'عيد الفطر المبارك وزيارة الإمام الحسين عليه السلام يوم العيد (١ شوال)',
    eventType: 'wiladat',
    hijriDay: 1,
    hijriMonth: 10,
    historicalYearAH: '2 AH – Present',
    gregorianHistoricalDate: 'Annual Lunar Festival',
    gregorianMonthDay: { month: 3, day: 20 },
    personalityIds: ['imam_hussain'],
    locationIds: ['hussain_shrine_present', 'bayn_al_haramayn_present'],
    summary: 'Festival of the breaking of the fast, accompanied in Ahlul Bayt liturgy by Du’a al-Nudbah and the special Eid Ziyarat of Imam Hussain (AS).',
    fullDescription: 'On 1 Shawwal, Imam Ja’far al-Sadiq (AS) taught that the joy of Eid al-Fitr is renewed with the remembrance of the rights of Muhammad and his Household and the recitation of the Eid Ziyarat of Imam Hussain (AS).',
    sources: ['Kamil al-Ziyarat by Ibn Qulawayh', 'Misbah al-Mutahajjid by Shaykh al-Tusi', 'Mafatih al-Jinan'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Subject to regional crescent sighting of Shawwal.',
    recommendedZiyarat: 'ziyarat_warith',
    importance: 'high',
    translations: {
      en: 'Eid al-Fitr & Prescribed Ziyarat of Imam Hussain (AS) (1 Shawwal)',
      ar: 'عيد الفطر المبارك وزيارة الإمام الحسين عليه السلام (١ شوال)',
      ur: 'عید الفطر اور زیارتِ مخصوصہ امام حسینؑ (یکم شوال المکرم)',
      ro: 'Eid-ul-Fitr aur Ziyarat-e-Imam Hussain (AS) (1 Shawwal)',
      hi: 'ईद-उल-फ़ित्र और इमाम हुसैन (अ.स.) की ज़ियारत (१ शव्वाल)',
      fa: 'عید سعید فطر و زیارت مخصوصه امام حسین علیه‌السلام (اول شوال)'
    }
  },
  {
    eventId: 'ev_shaw_08',
    slug: '8-shawwal-demolition-of-jannat-al-baqi-shrines',
    title: 'Yawm al-Hadm — Demolition of the Sacred Mausoleums of Jannat al-Baqi in Medina (1344 AH)',
    arabicTitle: 'يوم الهدم الفجيع — ذكرى هدم قبور أئمة البقيع عليهم السلام في المدينة المنورة (٨ شوال ١٣٤٤ هـ)',
    eventType: 'historical',
    hijriDay: 8,
    hijriMonth: 10,
    historicalYearAH: '1344 AH',
    gregorianHistoricalDate: '21 April 1926 CE',
    gregorianMonthDay: { month: 4, day: 21 },
    personalityIds: ['imam_hasan', 'zain_al_abideen', 'fatima_al_zahra', 'umm_al_banin'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Commemoration of 8 Shawwal 1344 AH (21 April 1926 CE), when the historic domed mausoleums over the graves of Imam Hasan (AS), Imam Zain al-Abideen (AS), Imam Muhammad al-Baqir (AS), Imam Ja’far al-Sadiq (AS), and Hazrat Umm al-Banin (SA) in Jannat al-Baqi were demolished.',
    fullDescription: 'For centuries, a grand white-domed sanctuary stood in Jannat al-Baqi housing the graves of four Imams of the Ahlul Bayt alongside Abbas ibn Abd al-Muttalib and Fatima bint Asad. Its razing on 8 Shawwal 1344 AH is remembered annually as Yawm al-Huzn (Day of Grief for Baqi).',
    sources: ['Tarikh al-Haramayn al-Sharifayn', 'A’yan al-Shi’a by Sayyid Muhsin al-Amin'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Observed globally on 8 Shawwal.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'high',
    translations: {
      en: 'Demolition of the Sacred Shrines of Jannat al-Baqi (8 Shawwal 1344 AH)',
      ar: 'ذكرى فاجعة هدم قبور أئمة البقيع الغرقد (٨ شوال ١٣٤٤ هـ)',
      ur: 'یومِ انہدامِ جنت البقیع (۸ شوال المکرم ۱۳۴۴ھ)',
      ro: 'Yaum-e-Inhidam-e-Jannat-ul-Baqi (8 Shawwal)',
      hi: 'यौम-ए-इनहिदाम जन्नत-उल-बक़ी (८ शव्वाल)',
      fa: 'سالروز تخریب بارگاه ائمه بقیع علیهم‌السلام (۸ شوال ۱۳۴۴ هـ)'
    }
  },
  {
    eventId: 'ev_shaw_25',
    slug: '25-shawwal-shahadat-imam-jafar-al-sadiq',
    title: 'Shahadat of Imam Ja’far ibn Muhammad al-Sadiq (AS) in Medina',
    arabicTitle: 'شهادة رئيس المذهب الإمام جعفر بن محمد الصادق عليه السلام (٢٥ شوال ١٤٨ هـ)',
    eventType: 'shahadat',
    hijriDay: 25,
    hijriMonth: 10,
    historicalYearAH: '148 AH',
    gregorianHistoricalDate: '14 December 765 CE',
    gregorianMonthDay: { month: 12, day: 14 },
    personalityIds: ['zain_al_abideen', 'imam_hussain'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Martyrdom of the Sixth Imam, Ja’far ibn Muhammad al-Sadiq (AS), teacher of over 4,000 scholars and primary narrator of the virtues of Karbala Ziyarat, martyred in Medina in 148 AH.',
    fullDescription: 'On 25 Shawwal 148 AH, Imam Ja’far al-Sadiq (AS) was martyred by poison on the orders of the Abbasid caliph al-Mansur and buried in Jannat al-Baqi beside his father Imam al-Baqir, grandfather Imam Zain al-Abideen, and great-uncle Imam Hasan (AS).',
    sources: ['Kitab al-Irshad by Shaykh al-Mufid, Vol. 2, p. 180', 'Al-Kafi by Shaykh al-Kulayni, Vol. 1, p. 472', 'Misbah al-Mutahajjid'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Major annual commemoration across all seminaries and sanctuaries.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'critical',
    translations: {
      en: 'Shahadat of Imam Ja’far ibn Muhammad al-Sadiq (AS) (25 Shawwal 148 AH)',
      ar: 'شهادة الإمام جعفر بن محمد الصادق عليه السلام (٢٥ شوال ١٤٨ هـ)',
      ur: 'شہادتِ رئیس المذہب امام جعفر صادقؑ (۲۵ شوال المکرم ۱۴۸ھ)',
      ro: 'Shahadat-e-Imam Jafar al-Sadiq (AS) (25 Shawwal)',
      hi: 'इमाम जाफ़र अल-सादिक़ (अ.स.) की शहादत (२५ शव्वाल)',
      fa: 'شهادت رئیس مذهب جعفری امام جعفر صادق علیه‌السلام (۲۵ شوال ۱۴۸ هـ)'
    }
  },

  // ======================== 11. DHU AL-QADAH ========================
  {
    eventId: 'ev_dhuq_01',
    slug: '1-dhu-al-qadah-wiladat-sayyida-fatima-masuma',
    title: 'Blessed Wiladat of Sayyida Fatima al-Ma’suma bint Musa al-Kazim (SA)',
    arabicTitle: 'ولادة كريمة أهل البيت السيدة فاطمة المعصومة عليها السلام (١ ذو القعدة ١٧٣ هـ)',
    eventType: 'wiladat',
    hijriDay: 1,
    hijriMonth: 11,
    historicalYearAH: '173 AH',
    gregorianHistoricalDate: '22 March 790 CE',
    gregorianMonthDay: { month: 3, day: 22 },
    personalityIds: ['zain_al_abideen'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Blessed birth anniversary of Sayyida Fatima al-Ma’suma (SA), daughter of Imam Musa al-Kazim (AS) and full sister of Imam Ali al-Rida (AS), opening the Ten Days of Dignity (Dah-e-Karamat).',
    fullDescription: 'Born in Medina on 1 Dhu al-Qadah 173 AH, Sayyida Fatima al-Ma’suma (SA) was praised by Imam Ja’far al-Sadiq, Imam Musa al-Kazim, Imam Ali al-Rida, and Imam Muhammad al-Jawad (AS) for her scholarship, purity, and intercession.',
    sources: ['Bihar al-Anwar by Allamah al-Majlisi, Vol. 48, p. 290', 'Mustadrak al-Wasa’il'],
    sourceReliability: 'widely_reported',
    dateStatus: 'confirmed',
    calendarNotes: 'Opens the 10-day celebration culminating on 11 Dhu al-Qadah (Wiladat of Imam Ali al-Rida AS).',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'high',
    translations: {
      en: 'Wiladat of Sayyida Fatima al-Ma’suma (SA) (1 Dhu al-Qadah 173 AH)',
      ar: 'ولادة كريمة أهل البيت السيدة فاطمة المعصومة عليها السلام (١ ذو القعدة)',
      ur: 'ولادتِ باسعادت حضرت فاطمہ معصومۂ قمؑ (یکم ذوالقعدہ ۱۷۳ھ)',
      ro: 'Wiladat-e-Sayyida Fatima Masooma (SA) (1 Dhu al-Qadah)',
      hi: 'सैय्यदा फ़ातिमा मासूमा (स.अ.) की विलादत (१ ज़ु अल-क़ादा)',
      fa: 'ولادت باسعادت حضرت فاطمه معصومه سلام‌الله‌علیها و آغاز دهه کرامت (اول ذی‌القعده)'
    }
  },
  {
    eventId: 'ev_dhuq_11',
    slug: '11-dhu-al-qadah-wiladat-imam-ali-al-rida',
    title: 'Blessed Wiladat of Imam Ali ibn Musa al-Rida (AS)',
    arabicTitle: 'ولادة ثامن الحجج الإمام علي بن موسى الرضا عليه السلام (١١ ذو القعدة ١٤٨ هـ)',
    eventType: 'wiladat',
    hijriDay: 11,
    hijriMonth: 11,
    historicalYearAH: '148 AH',
    gregorianHistoricalDate: '29 December 765 CE',
    gregorianMonthDay: { month: 12, day: 29 },
    personalityIds: ['zain_al_abideen'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Blessed birth anniversary of the Eighth Imam, Ali ibn Musa al-Rida (AS), born in Medina on 11 Dhu al-Qadah 148 AH.',
    fullDescription: 'Born in Medina to Imam Musa al-Kazim (AS) and Lady Najmah (Tuktam), Imam Ali al-Rida (AS) is revered as al-imam al-Rida (The One Pleasing to God and Creation) and Author of the Golden Chain Hadith (Hadith Silsilat al-Dhahab).',
    sources: ['Uyun Akhbar al-Rida by Shaykh al-Saduq, Vol. 1, p. 18', 'Kitab al-Irshad, Vol. 2, p. 247', 'Al-Kafi, Vol. 1, p. 486'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Celebrated across Mashhad, Karbala, and the global Ahlul Bayt community.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'critical',
    translations: {
      en: 'Wiladat of Imam Ali ibn Musa al-Rida (AS) (11 Dhu al-Qadah 148 AH)',
      ar: 'ولادة الإمام علي بن موسى الرضا عليه السلام (١١ ذو القعدة ١٤٨ هـ)',
      ur: 'ولادتِ باسعادت ثامن الحجج امام علی بن موسیٰ الرضاؑ (۱۱ ذوالقعدہ ۱۴۸ھ)',
      ro: 'Wiladat-e-Imam Ali ibn Musa al-Rida (AS) (11 Dhu al-Qadah)',
      hi: 'इमाम अली इब्न मूसा अल-रज़ा (अ.स.) की विलादत (११ ज़ु अल-क़ादा)',
      fa: 'ولادت باسعادت حضرت ثامن‌الحجج امام علی بن موسی الرضا علیه‌السلام (۱۱ ذی‌القعده)'
    }
  },
  {
    eventId: 'ev_dhuq_29',
    slug: '29-dhu-al-qadah-shahadat-imam-muhammad-al-jawad',
    title: 'Shahadat of Imam Muhammad ibn Ali al-Jawad al-Taqi (AS) in Baghdad (Kadhimiya)',
    arabicTitle: 'شهادة الإمام محمد بن علي الجواد باب المراد عليه السلام في بغداد (آخر ذي القعدة ٢٢٠ هـ)',
    eventType: 'shahadat',
    hijriDay: 29,
    hijriMonth: 11,
    historicalYearAH: '220 AH',
    gregorianHistoricalDate: '25 November 835 CE',
    gregorianMonthDay: { month: 11, day: 25 },
    personalityIds: ['zain_al_abideen'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Martyrdom of the Ninth Imam, Muhammad ibn Ali al-Jawad (AS), at age twenty-five in Baghdad on the final day of Dhu al-Qadah 220 AH.',
    fullDescription: 'Summoned from Medina to Baghdad by the Abbasid caliph al-Mu’tasim, Imam Muhammad al-Jawad (AS) was martyred by poison at the end of Dhu al-Qadah 220 AH—the youngest of the Twelve Imams at martyrdom—and buried beside his grandfather Imam Musa al-Kazim (AS) in Kadhimiya.',
    sources: ['Kitab al-Irshad by Shaykh al-Mufid, Vol. 2, p. 295', 'Al-Kafi, Vol. 1, p. 492', 'Misbah al-Mutahajjid'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Observed on the last day of Dhu al-Qadah (29 or 30 Dhu al-Qadah).',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'critical',
    translations: {
      en: 'Shahadat of Imam Muhammad al-Jawad al-Taqi (AS) (End of Dhu al-Qadah 220 AH)',
      ar: 'شهادة الإمام محمد بن علي الجواد عليه السلام في الكاظمية (نهاية ذي القعدة)',
      ur: 'شہادتِ باب المراد امام محمد تقی الجوادؑ (آخرِ ماہِ ذوالقعدہ ۲۲۰ھ)',
      ro: 'Shahadat-e-Imam Muhammad Taqi al-Jawad (AS) (29/30 Dhu al-Qadah)',
      hi: 'इमाम मुहम्मद अल-जवाद (अ.स.) की शहादत (ज़ु अल-क़ादा का अंतिम दिन)',
      fa: 'شهادت حضرت جوادالائمه امام محمد تقی علیه‌السلام (آخر ذی‌القعده ۲۲۰ هـ)'
    }
  },

  // ======================== 12. DHU AL-HIJJAH ========================
  {
    eventId: 'ev_dhuh_01',
    slug: '1-dhu-al-hijjah-sacred-marriage-imam-ali-and-sayyida-fatima',
    title: 'Sacred Celestial Marriage of Imam Ali ibn Abi Talib (AS) and Sayyida Fatima al-Zahra (SA)',
    arabicTitle: 'زواج النورين أمير المؤمنين الإمام علي والسيدة فاطمة الزهراء عليهما السلام (١ ذو الحجة ٢ هـ)',
    eventType: 'wiladat',
    hijriDay: 1,
    hijriMonth: 12,
    historicalYearAH: '2 AH',
    gregorianHistoricalDate: '624 CE',
    gregorianMonthDay: { month: 5, day: 25 },
    personalityIds: ['imam_ali', 'fatima_al_zahra', 'prophet_muhammad'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Anniversary of the blessed union of Imam Ali (AS) and Sayyida Fatima al-Zahra (SA) in Medina, from which the lineage of Imam Hasan, Imam Hussain, and Sayyida Zaynab blossomed.',
    fullDescription: 'On 1 Dhu al-Hijjah 2 AH, Prophet Muhammad (SAWW) solemnized the marriage of Imam Ali ibn Abi Talib (AS) and Sayyida Fatima al-Zahra (SA) by divine command ("Had Allah not created Ali, there would have been no equal for Fatima on the face of the earth").',
    sources: ['Misbah al-Mutahajjid by Shaykh al-Tusi', 'Amali al-Tusi', 'Bihar al-Anwar, Vol. 43'],
    sourceReliability: 'confirmed',
    dateStatus: 'different_narrations',
    alternateNarrations: '1 Dhu al-Hijjah is the primary date recorded by Shaykh al-Tusi; another narration mentions 6 Dhu al-Hijjah.',
    calendarNotes: 'Celebrated as Islamic Family & Sacred Union Day.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'high',
    translations: {
      en: 'Sacred Marriage of Imam Ali (AS) & Sayyida Fatima al-Zahra (SA) (1 Dhu al-Hijjah 2 AH)',
      ar: 'ذكرى زواج النورين الإمام علي والسيدة فاطمة الزهراء عليهما السلام (١ ذو الحجة)',
      ur: 'یومِ عقدِ نورین امیرالمومنین علیؑ و سیدہ فاطمۃ الزہراؑ (یکم ذوالحجہ ۲ھ)',
      ro: 'Aqd-e-Imam Ali (AS) wa Sayyida Fatima al-Zahra (SA) (1 Dhu al-Hijjah)',
      hi: 'इमाम अली (अ.स.) और सैय्यदा फ़ातिमा ज़हरा (स.अ.) का शुभ विवाह (१ ज़ु अल-हिज्जा)',
      fa: 'سالروز ازدواج آسمانی امیرالمؤمنین علی و حضرت فاطمه زهرا علیهماالسلام (اول ذی‌الحجه)'
    }
  },
  {
    eventId: 'ev_dhuh_07',
    slug: '7-dhu-al-hijjah-shahadat-imam-muhammad-al-baqir',
    title: 'Shahadat of Imam Muhammad ibn Ali al-Baqir (AS) in Medina',
    arabicTitle: 'شهادة الإمام محمد بن علي الباقر عليه السلام في المدينة المنورة (٧ ذو الحجة ١١٤ هـ)',
    eventType: 'shahadat',
    hijriDay: 7,
    hijriMonth: 12,
    historicalYearAH: '114 AH',
    gregorianHistoricalDate: '28 January 733 CE',
    gregorianMonthDay: { month: 1, day: 28 },
    personalityIds: ['zain_al_abideen', 'imam_hussain'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Martyrdom of the Fifth Imam, Muhammad ibn Ali al-Baqir (AS) — Splitter of Knowledge — in Medina on 7 Dhu al-Hijjah 114 AH.',
    fullDescription: 'On 7 Dhu al-Hijjah 114 AH, Imam Muhammad al-Baqir (AS) was martyred by poison during the reign of Hisham ibn Abd al-Malik and buried in Jannat al-Baqi after instructing his son Imam Ja’far al-Sadiq (AS) to establish ten years of mourning ceremonies for him at Mina.',
    sources: ['Kitab al-Irshad by Shaykh al-Mufid, Vol. 2, p. 176', 'Misbah al-Mutahajjid by Shaykh al-Tusi', 'Al-Kafi, Vol. 1, p. 469'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Observed globally on 7 Dhu al-Hijjah.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'critical',
    translations: {
      en: 'Shahadat of Imam Muhammad ibn Ali al-Baqir (AS) (7 Dhu al-Hijjah 114 AH)',
      ar: 'شهادة الإمام محمد بن علي الباقر عليه السلام (٧ ذو الحجة ١١٤ هـ)',
      ur: 'شہادتِ باقر العلوم امام محمد باقرؑ (۷ ذوالحجہ ۱۱۴ھ)',
      ro: 'Shahadat-e-Imam Muhammad al-Baqir (AS) (7 Dhu al-Hijjah)',
      hi: 'इमाम मुहम्मद अल-बाक़िर (अ.स.) की शहादत (७ ज़ु अल-हिज्जा)',
      fa: 'شهادت امام محمد باقر علیه‌السلام (۷ ذی‌الحجه ۱۱۴ هـ)'
    }
  },
  {
    eventId: 'ev_dhuh_08',
    slug: '8-dhu-al-hijjah-yawm-al-tarwiyah-imam-hussain-departs-makkah',
    title: 'Yawm al-Tarwiyah — Imam Hussain (AS) Departs Makkah Toward Iraq (60 AH)',
    arabicTitle: 'يوم التروية — خروج الإمام الحسين عليه السلام من مكة المكرمة نحو العراق (٨ ذو الحجة ٦٠ هـ)',
    eventType: 'karbala',
    hijriDay: 8,
    hijriMonth: 12,
    historicalYearAH: '60 AH',
    gregorianHistoricalDate: '10 September 680 CE',
    gregorianMonthDay: { month: 9, day: 10 },
    personalityIds: ['imam_hussain', 'abbas_ibn_ali', 'zaynab_bint_ali', 'ali_akbar'],
    locationIds: ['historical_encampment'],
    summary: 'To preserve the sanctity of the Sacred Kaaba from Umayyad assassins disguised as pilgrims, Imam Hussain (AS) converts his Hajj into an Umrah and departs Makkah toward Iraq on 8 Dhu al-Hijjah 60 AH.',
    fullDescription: 'After learning that Yazid had dispatched Amr ibn Sa’id al-Ashdaq with armed men to assassinate him even if he were clinging to the curtains of the Kaaba, Imam Hussain (AS) delivered his famous sermon in Mecca ("Death is inscribed upon the children of Adam like a necklace upon the neck of a maiden") and departed toward Iraq on Tuesday, 8 Dhu al-Hijjah 60 AH.',
    sources: ['Tarikh al-Tabari, Vol. 5, pp. 381–385', 'Kitab al-Irshad by Shaykh al-Mufid, pp. 339–343', 'Al-Luhuf by Sayyid Ibn Tawus, p. 37'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Major milestone of the 60–61 AH Karbala Journey.',
    recommendedZiyarat: 'ziyarat_warith',
    importance: 'critical',
    translations: {
      en: 'Imam Hussain (AS) Departs Makkah Toward Karbala (8 Dhu al-Hijjah 60 AH)',
      ar: 'يوم التروية — خروج الإمام الحسين عليه السلام من مكة نحو العراق (٨ ذو الحجة ٦٠ هـ)',
      ur: 'یومِ ترویہ — امام حسینؑ کا حج کو عمرہ میں بدل کر مکہ سے عراق روانہ ہونا (۸ ذوالحجہ ۶۰ھ)',
      ro: '8 Dhu al-Hijjah 60 AH — Imam Hussain (AS) ki Makkah se Iraq rawangi',
      hi: '८ ज़ु अल-हिज्जा ६० हिजरी — इमाम हुसैन (अ.स.) का मक्का से इराक़ प्रस्थान',
      fa: 'روز ترویه — حرکت امام حسین علیه‌السلام از مکه به سوی عراق (۸ ذی‌الحجه ۶۰ هـ)'
    }
  },
  {
    eventId: 'ev_dhuh_09',
    slug: '9-dhu-al-hijjah-day-of-arafah-and-shahadat-muslim-ibn-aqeel',
    title: 'Day of Arafah & Shahadat of Hazrat Muslim ibn Aqeel (AS) and Hani ibn Urwa in Kufa (60 AH)',
    arabicTitle: 'يوم عرفة وشهادة سفير الحسين مسلم بن عقيل وهاني بن عروة في الكوفة (٩ ذو الحجة ٦٠ هـ)',
    eventType: 'shahadat',
    hijriDay: 9,
    hijriMonth: 12,
    historicalYearAH: '60 AH',
    gregorianHistoricalDate: '11 September 680 CE',
    gregorianMonthDay: { month: 9, day: 11 },
    personalityIds: ['muslim_ibn_aqeel', 'imam_hussain'],
    locationIds: ['hussain_shrine_present', 'bayn_al_haramayn_present'],
    summary: 'On the sacred Day of Arafah (9 Dhu al-Hijjah 60 AH), Imam Hussain’s cousin and envoy Hazrat Muslim ibn Aqeel (AS) and his host Hani ibn Urwa al-Muradi are martyred in Kufa on the orders of Ubaydullah ibn Ziyad.',
    fullDescription: 'One day after Imam Hussain departed Mecca, his loyal envoy Muslim ibn Aqeel (AS)—after fighting bravely alone in the alleys of Kufa when intimidation dispersed his followers—was martyred atop the palace of Kufa alongside the noble elder Hani ibn Urwa on 9 Dhu al-Hijjah 60 AH. 9 Dhu al-Hijjah is also the Day of Arafah, when millions gather in Karbala to recite Imam Hussain’s Du’a Arafah and Ziyarat.',
    sources: ['Tarikh al-Tabari, Vol. 5, pp. 362–380', 'Kitab al-Irshad by Shaykh al-Mufid, pp. 319–338', 'Iqbal al-A’mal (Du’a Arafah & Ziyarat of 9 Dhu al-Hijjah)'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Combines the solemn martyrdom of Muslim ibn Aqeel (60 AH) with the spiritual grandeur of the Day of Arafah Ziyarat at Karbala.',
    recommendedZiyarat: 'ziyarat_warith',
    importance: 'critical',
    translations: {
      en: 'Day of Arafah & Shahadat of Hazrat Muslim ibn Aqeel (AS) in Kufa (9 Dhu al-Hijjah 60 AH)',
      ar: 'يوم عرفة وشهادة سفير الحسين مسلم بن عقيل وهاني بن عروة في الكوفة (٩ ذو الحجة)',
      ur: 'یومِ عرفہ اور سفیرِ حسینی حضرت مسلم بن عقیلؑ و ہانی بن عروہ کی شہادت (۹ ذوالحجہ ۶۰ھ)',
      ro: 'Yaum-e-Arafah wa Shahadat-e-Hazrat Muslim ibn Aqeel (AS) (9 Dhu al-Hijjah)',
      hi: 'यौम-ए-अरफ़ा और हज़रत मुस्लिम इब्न अक़ील (अ.स.) की शहादत (९ ज़ु अल-हिज्जा)',
      fa: 'روز عرفه و شهادت حضرت مسلم بن عقیل و هانی بن عروه در کوفه (۹ ذی‌الحجه ۶۰ هـ)'
    }
  },
  {
    eventId: 'ev_dhuh_15',
    slug: '15-dhu-al-hijjah-wiladat-imam-ali-al-hadi',
    title: 'Blessed Wiladat of Imam Ali ibn Muhammad al-Hadi al-Naqi (AS)',
    arabicTitle: 'ولادة الإمام علي بن محمد الهادي النقي عليه السلام (١٥ ذو الحجة ٢١٢ هـ)',
    eventType: 'wiladat',
    hijriDay: 15,
    hijriMonth: 12,
    historicalYearAH: '212 AH',
    gregorianHistoricalDate: '8 March 828 CE',
    gregorianMonthDay: { month: 3, day: 8 },
    personalityIds: ['zain_al_abideen'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Blessed birth anniversary of the Tenth Imam, Ali ibn Muhammad al-Hadi (AS), born at Surayya near Medina in 212 AH.',
    fullDescription: 'Imam Ali al-Hadi (AS), son of Imam Muhammad al-Jawad (AS) and Lady Samana al-Maghribiyya, was born near Medina in Dhu al-Hijjah 212 AH.',
    sources: ['Al-Kafi by Shaykh al-Kulayni, Vol. 1, p. 497', 'Kitab al-Irshad, Vol. 2, p. 297', 'I’lam al-Wara'],
    sourceReliability: 'confirmed',
    dateStatus: 'different_narrations',
    alternateNarrations: '15 Dhu al-Hijjah is widely observed; 2 Rajab and 5 Rajab are also recorded in classical manuscripts.',
    calendarNotes: 'Celebrated in the days leading up to Eid al-Ghadir.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'high',
    translations: {
      en: 'Wiladat of Imam Ali al-Hadi al-Naqi (AS) (15 Dhu al-Hijjah 212 AH)',
      ar: 'ولادة الإمام علي بن محمد الهادي النقي عليه السلام (١٥ ذو الحجة)',
      ur: 'ولادتِ باسعادت امام علی نقی الہادیؑ (۱۵ ذوالحجہ ۲۱۲ھ)',
      ro: 'Wiladat-e-Imam Ali al-Naqi al-Hadi (AS) (15 Dhu al-Hijjah)',
      hi: 'इमाम अली अल-हादी (अ.स.) की विलादत (१५ ज़ु अल-हिज्जा)',
      fa: 'ولادت باسعادت امام علی النقی الهادی علیه‌السلام (۱۵ ذی‌الحجه ۲۱۲ هـ)'
    }
  },
  {
    eventId: 'ev_dhuh_18_ghadir',
    slug: '18-dhu-al-hijjah-eid-al-ghadir',
    title: 'Eid Allah al-Akbar — Eid al-Ghadir (Investiture of Imam Ali AS at Ghadir Khumm)',
    arabicTitle: 'عيد الله الأكبر عيد الغدير الأغر — تنصيب أمير المؤمنين الإمام علي بن أبي طالب عليه السلام (١٨ ذو الحجة ١٠ هـ)',
    eventType: 'wiladat',
    hijriDay: 18,
    hijriMonth: 12,
    historicalYearAH: '10 AH',
    gregorianHistoricalDate: '16 March 632 CE',
    gregorianMonthDay: { month: 3, day: 16 },
    personalityIds: ['prophet_muhammad', 'imam_ali', 'fatima_al_zahra', 'imam_hasan', 'imam_hussain'],
    locationIds: ['hussain_shrine_present', 'bayn_al_haramayn_present'],
    summary: 'Returning from the Farewell Pilgrimage (Hajjat al-Wada) on 18 Dhu al-Hijjah 10 AH, Prophet Muhammad (SAWW) gathers over 100,000 pilgrims at Ghadir Khumm and raises the hand of Imam Ali (AS), proclaiming: "For whomever I am his Mawla (master), this Ali is his Mawla!"',
    fullDescription: 'Following the revelation of Quran 5:67 ("O Messenger, proclaim that which has been revealed to you from your Lord"), Prophet Muhammad (SAWW) delivered the Sermon of Ghadir, paired the Quran and the Ahlul Bayt (Hadith al-Thaqalayn), and raised Imam Ali ibn Abi Talib (AS), whereupon Quran 5:3 ("Today I have perfected your religion for you") was revealed.',
    sources: [
      'Al-Ghadir by Allamah Abd al-Husayn al-Amini (11 vols., documenting 110 companions & 360 scholars)',
      'Kitab al-Irshad by Shaykh al-Mufid, Vol. 1',
      'Musnad Ahmad ibn Hanbal, Vol. 4, p. 281',
      'Tarikh al-Ya’qubi, Vol. 2, p. 112'
    ],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Honored as Eid Allah al-Akbar (The Greatest Festival of God).',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'critical',
    translations: {
      en: 'Eid al-Ghadir — Investiture of Amir al-Mu’minin Imam Ali (AS) (18 Dhu al-Hijjah 10 AH)',
      ar: 'عيد الله الأكبر عيد الغدير الأغر — ولاية أمير المؤمنين علي عليه السلام (١٨ ذو الحجة)',
      ur: 'عید اللہ الاکبر عیدِ غدیر — اعلانِ ولایتِ امیرالمومنین امام علیؑ (۱۸ ذوالحجہ ۱۰ھ)',
      ro: 'Eid-e-Ghadir — Ilan-e-Wilayat-e-Amir al-Muminin Imam Ali (AS) (18 Dhu al-Hijjah)',
      hi: 'ईद-ए-ग़दीर — अमीरुल मोमिनीन इमाम अली (अ.स.) की विलायत का ऐलान (१८ ज़ु अल-हिज्जा)',
      fa: 'عید سعید غدیر خم — عید الله الاکبر (۱۸ ذی‌الحجه ۱۰ هـ)'
    }
  },
  {
    eventId: 'ev_dhuh_24_mubahala',
    slug: '24-dhu-al-hijjah-eid-al-mubahala-and-khatam-charity',
    title: 'Yawm al-Mubahala & Revelation of Verse of Wilayah (Giving of the Ring by Imam Ali AS)',
    arabicTitle: 'يوم المباهلة المجيد وتصدق أمير المؤمنين بالخاتم في الركوع ونزول آية التطهير (٢٤ ذو الحجة ٩ هـ)',
    eventType: 'wiladat',
    hijriDay: 24,
    hijriMonth: 12,
    historicalYearAH: '9 AH / 10 AH',
    gregorianHistoricalDate: '23 March 631 CE',
    gregorianMonthDay: { month: 3, day: 23 },
    personalityIds: ['prophet_muhammad', 'imam_ali', 'fatima_al_zahra', 'imam_hasan', 'imam_hussain'],
    locationIds: ['hussain_shrine_present'],
    summary: 'Prophet Muhammad (SAWW) brings only Imam Hasan, Imam Hussain ("our sons"), Sayyida Fatima ("our women"), and Imam Ali ("ourselves") to the field of Mubahala with the delegation of Najran (Quran 3:61); also marks Imam Ali gifting his ring in Ruku (Quran 5:55).',
    fullDescription: 'On 24 Dhu al-Hijjah, the Five People of the Cloak (Ahl al-Kisa: Muhammad, Ali, Fatima, Hasan, and Hussain) stepped forth together under the prophetic mantle, compelling the Christian bishop of Najran to declare: "I see faces that, were they to ask God to uproot a mountain from its place, He would uproot it."',
    sources: ['Sahih Muslim, Kitab Fada’il al-Sahaba (Hadith 2404)', 'Tafsir al-Kashshaf by al-Zamakhshari on Quran 3:61', 'Misbah al-Mutahajjid by Shaykh al-Tusi'],
    sourceReliability: 'confirmed',
    dateStatus: 'confirmed',
    calendarNotes: 'Celebrated across the Islamic world as the Day of the Ahl al-Kisa.',
    recommendedZiyarat: 'ziyarat_aminullah',
    importance: 'critical',
    translations: {
      en: 'Eid al-Mubahala & Verse of Wilayah (24 Dhu al-Hijjah)',
      ar: 'عيد المباهلة المجيد وتصدق أمير المؤمنين بالخاتم (٢٤ ذو الحجة)',
      ur: 'یومِ مباہلہ اور نزولِ آیتِ ولایت و تطہیر (۲۴ ذوالحجہ)',
      ro: 'Yaum-e-Mubahala wa Ayat-e-Wilayat (24 Dhu al-Hijjah)',
      hi: 'यौम-ए-मुबाहिला और आयत-ए-विलायत (२४ ज़ु अल-हिज्जा)',
      fa: 'روز مباهله و تصدق انگشتری توسط امیرالمؤمنین علی علیه‌السلام (۲۴ ذی‌الحجه)'
    }
  }
];


/**
 * Retrieve all verified events for a specific Hijri month (1-12) and day (1-30)
 */
export function getEventsForHijriDate(hijriMonth, hijriDay) {
  const m = parseInt(hijriMonth, 10);
  const d = parseInt(hijriDay, 10);
  return AHLUL_BAYT_CALENDAR_EVENTS.filter(ev => ev.hijriMonth === m && ev.hijriDay === d);
}

/**
 * Retrieve historical events matching a Gregorian month (1-12) and day (1-31)
 */
export function getEventsForGregorianMonthDay(gregMonth, gregDay) {
  const m = parseInt(gregMonth, 10);
  const d = parseInt(gregDay, 10);
  return AHLUL_BAYT_CALENDAR_EVENTS.filter(
    ev => ev.gregorianMonthDay && ev.gregorianMonthDay.month === m && ev.gregorianMonthDay.day === d
  );
}

/**
 * Compute upcoming sacred events from a reference date in the user's configured regional Hijri calendar
 */
export function getUpcomingSacredEvents(
  dateInput = new Date(),
  { region = 'India', manualOffset = 0, timeZone, dayBoundary = 'midnight', limit = 16 } = {}
) {
  const gregToday = getZonedGregorianParts(dateInput, timeZone);
  const todayJd = gregorianToJulianDay(gregToday.year, gregToday.month, gregToday.day);

  const upcomingMap = new Map();

  for (let delta = 0; delta <= 360; delta++) {
    const targetGreg = julianDayToGregorian(todayJd + delta);
    const targetHijri = gregorianToHijri(
      { ...targetGreg, hour: 12 },
      { region, manualOffset, dayBoundary: 'midnight' }
    );
    const matches = getEventsForHijriDate(targetHijri.month, targetHijri.day);
    matches.forEach(ev => {
      if (!upcomingMap.has(ev.eventId)) {
        upcomingMap.set(ev.eventId, {
          ...ev,
          daysRemaining: delta,
          expectedGregorianDate: targetGreg.formattedGregorian,
          expectedWeekday: targetGreg.weekday,
          hijriFormattedEn: `${ev.hijriDay} ${targetHijri.monthNameEn} ${targetHijri.year} AH`,
          hijriFormattedAr: targetHijri.formattedHijriAr,
          hijriYear: targetHijri.year,
          region
        });
      }
    });
    if (upcomingMap.size >= limit && delta > 35) break;
  }

  return Array.from(upcomingMap.values()).sort((a, b) => a.daysRemaining - b.daysRemaining);
}

/**
 * Complete dynamic "Today in Ahlul Bayt History" state resolver
 */
export function getCompleteTodayState(
  dateInput = new Date(),
  { region = 'India', manualOffset = 0, timeZone, dayBoundary = 'midnight' } = {}
) {
  const gregorian = getZonedGregorianParts(dateInput, timeZone);
  const hijri = gregorianToHijri(gregorian, { region, manualOffset, dayBoundary });
  const moon = getAstronomicalMoonPhase(dateInput);

  const todayEvents = getEventsForHijriDate(hijri.month, hijri.day);
  const minusOneEvents = getEventsForHijriDate(
    hijri.adjacentPossibilities.minusOneDay.month,
    hijri.adjacentPossibilities.minusOneDay.day
  );
  const plusOneEvents = getEventsForHijriDate(
    hijri.adjacentPossibilities.plusOneDay.month,
    hijri.adjacentPossibilities.plusOneDay.day
  );

  const upcomingAll = getUpcomingSacredEvents(dateInput, { region, manualOffset, timeZone, dayBoundary, limit: 18 });
  const futureOnly = upcomingAll.filter(e => e.daysRemaining > 0);
  const tomorrowEvents = futureOnly.filter(e => e.daysRemaining === 1);
  const next7DaysEvents = futureOnly.filter(e => e.daysRemaining <= 7);
  const next30DaysEvents = futureOnly.filter(e => e.daysRemaining <= 30);
  const nextImportantEvent = futureOnly[0] || upcomingAll[0] || null;

  // Determine Special-Day Homepage Treatment (#42 / #16)
  let specialDayHero = {
    active: false,
    tone: 'standard',
    badge: 'TODAY IN SACRED HISTORY',
    headline: null,
    subline: null
  };

  if (todayEvents.length > 0) {
    const primary = todayEvents[0];
    if (primary.hijriMonth === 1 && primary.hijriDay === 10) {
      specialDayHero = {
        active: true,
        tone: 'ashura',
        badge: '10 MUHARRAM · YAWM AL-ASHURA',
        headline: `Today Commemorates Yawm al-Ashura — ${primary.title}`,
        subline: primary.summary
      };
    } else if (primary.eventType === 'wiladat') {
      specialDayHero = {
        active: true,
        tone: 'wiladat',
        badge: `${hijri.formattedHijriEn} · BLESSED WILADAT`,
        headline: `Today Marks the ${primary.title}`,
        subline: primary.summary
      };
    } else if (primary.eventType === 'shahadat') {
      specialDayHero = {
        active: true,
        tone: 'shahadat',
        badge: `${hijri.formattedHijriEn} · SOLEMN SHAHADAT COMMEMORATION`,
        headline: `Today Commemorates the ${primary.title}`,
        subline: primary.summary
      };
    } else {
      specialDayHero = {
        active: true,
        tone: 'historical',
        badge: `${hijri.formattedHijriEn} · SACRED CHRONICLE`,
        headline: primary.title,
        subline: primary.summary
      };
    }
  }

  return {
    timestampUtc: new Date().toISOString(),
    gregorian,
    hijri,
    moon,
    todayEvents,
    regionalVarianceEvents: {
      minusOneDay: {
        hijri: hijri.adjacentPossibilities.minusOneDay,
        events: minusOneEvents
      },
      plusOneDay: {
        hijri: hijri.adjacentPossibilities.plusOneDay,
        events: plusOneEvents
      }
    },
    upcoming: {
      nextEvent: nextImportantEvent,
      tomorrow: tomorrowEvents,
      next7Days: next7DaysEvents,
      next30Days: next30DaysEvents,
      allUpcoming: futureOnly
    },
    specialDayHero
  };
}

/**
 * Intelligent "On This Day" & Natural Query Search across verified calendar records
 */
export function searchSacredCalendar(rawQuery = '', todayState = null) {
  const q = (rawQuery || '').trim().toLowerCase();
  if (!q) return AHLUL_BAYT_CALENDAR_EVENTS;

  if ((q === 'today' || q.includes('aaj') || q.includes('today')) && todayState) {
    if (q.includes('wiladat')) return todayState.todayEvents.filter(e => e.eventType === 'wiladat');
    if (q.includes('shahadat')) return todayState.todayEvents.filter(e => e.eventType === 'shahadat');
    return todayState.todayEvents.length > 0 ? todayState.todayEvents : todayState.upcoming.next7Days;
  }

  if ((q === 'tomorrow' || q.includes('kal') || q.includes('tomorrow')) && todayState) {
    return todayState.upcoming.tomorrow.length > 0 ? todayState.upcoming.tomorrow : todayState.upcoming.next7Days.slice(0, 3);
  }

  // Check for "X Muharram" or "X Safar" pattern
  for (const m of HIJRI_MONTHS) {
    const mName = m.nameEn.toLowerCase();
    const mSlug = m.slug.replace(/-/g, ' ');
    if (q.includes(mName) || q.includes(mSlug) || (m.number === 8 && q.includes('shaban'))) {
      const dayMatch = q.match(/\b([1-9]|[12][0-9]|30)\b/);
      if (dayMatch) {
        const dNum = parseInt(dayMatch[1], 10);
        const exact = getEventsForHijriDate(m.number, dNum);
        if (exact.length > 0) return exact;
      }
      return AHLUL_BAYT_CALENDAR_EVENTS.filter(ev => ev.hijriMonth === m.number);
    }
  }

  // Check for Gregorian Month + Day ("29 October", "10 October", etc.)
  for (let i = 0; i < GREGORIAN_MONTH_NAMES.length; i++) {
    const gName = GREGORIAN_MONTH_NAMES[i].toLowerCase();
    if (q.includes(gName)) {
      const dayMatch = q.match(/\b([1-9]|[12][0-9]|3[01])\b/);
      if (dayMatch) {
        const dNum = parseInt(dayMatch[1], 10);
        const gMatches = getEventsForGregorianMonthDay(i + 1, dNum);
        if (gMatches.length > 0) return gMatches;
      }
    }
  }

  return AHLUL_BAYT_CALENDAR_EVENTS.filter(ev => {
    const haystack = [
      ev.title,
      ev.arabicTitle,
      ev.summary,
      ev.fullDescription,
      ev.eventType,
      ev.historicalYearAH,
      ev.gregorianHistoricalDate,
      ...(ev.sources || []),
      ...Object.values(ev.translations || {})
    ].join(' ').toLowerCase();
    return haystack.includes(q);
  });
}

// ============================================================================
// PHASE 9A: POST-ASHURA CAPTIVITY & MORAL VICTORY JOURNEY (#26)
// ============================================================================
export const POST_ASHURA_STATIONS = [
  {
    id: 'station_karbala_departure',
    step: 1,
    title: 'Karbala Battlefield to Kufa Frontier',
    arabicTitle: 'الرحيل من أرض كربلاء بعد شام الغريبان',
    dateHijri: '11 Muharram 61 AH',
    dateGregorian: '11 October 680 CE',
    coordinates: '32.6160° N, 44.0324° E → Kufa Road',
    keyPersonalities: ['Sayyida Zaynab bint Ali (SA)', 'Imam Ali Zain al-Abideen (AS)', 'Umm Kulthum bint Ali (SA)', 'Fatima bint al-Hussain (SA)', 'Sayyida Ruqayyah / Sakina (SA)'],
    summary: 'At midday on 11 Muharram, the surviving women and children of the Prophet’s household are led past the unburied martyrs at Al-Taff toward Kufa.',
    historicalNarrative: 'Sayyida Zaynab bint Ali (SA) paused beside the body of her brother Imam Hussain (AS) and raised her hands toward the heavens, uttering the immortal liturgical prayer recorded by Ibn Tawus and al-Tabari: "Allahumma taqabbal minna hadha al-qurban" (O Allah, accept from us this sacrifice!).',
    sources: ['Tarikh al-Tabari, Vol. 5, p. 455', 'Al-Luhuf by Sayyid Ibn Tawus, p. 84', 'Kitab al-Irshad, p. 388'],
    narrationNotes: 'All primary chronicles agree on the departure on 11 Muharram after midday.'
  },
  {
    id: 'station_kufa_bazaar_and_court',
    step: 2,
    title: 'Kufa Grand Bazaar, Mosque & Palace of Ibn Ziyad',
    arabicTitle: 'دخول الكوفة وخطب السيدة زينب والإمام السجاد في قصر الإمارة',
    dateHijri: '12–15 Muharram 61 AH',
    dateGregorian: '12–15 October 680 CE',
    coordinates: '32.0289° N, 44.4009° E (Kufa)',
    keyPersonalities: ['Sayyida Zaynab bint Ali (SA)', 'Imam Ali Zain al-Abideen (AS)', 'Umm Kulthum bint Ali (SA)', 'Abdullah ibn Afif al-Azdi'],
    summary: 'The eloquent sermons of Sayyida Zaynab (SA), Umm Kulthum (SA), Fatima bint al-Hussain (SA), and Imam Sajjad (AS) transform Kufa from an Umayyad military stronghold into a city of weeping and uprising.',
    historicalNarrative: 'When Ubaydullah ibn Ziyad mocked the tragedy in Dar al-Imarah asking "How did you see what God did to your brother?", Sayyida Zaynab (SA) replied with the sentence that defined Islamic spirituality: "Ma ra’aytu illa jamila — I saw nothing but beauty! These were souls upon whom God decreed martyrdom, and they went forth to their resting places." When the blind Kufan companion Abdullah ibn Afif al-Azdi protested against Ibn Ziyad in the mosque, he was martyred for defending the Ahlul Bayt.',
    sources: ['Balaghat al-Nisa by Ibn Abi Tahir Tayfur', 'Kitab al-Irshad by Shaykh al-Mufid, pp. 388–390', 'Al-Luhuf, pp. 86–94'],
    narrationNotes: 'Authenticated across 3rd–5th century AH rhetorical and historical compendiums.'
  },
  {
    id: 'station_levant_corridor',
    step: 3,
    title: 'The Euphrates & Northern Levant Route (Tikrit, Mosul, Aleppo, Hama, Homs, Baalbek)',
    arabicTitle: 'طريق السبايا عبر الفرات وحلب وحماة وحمص وبعلبك إلى الشام',
    dateHijri: 'Mid-Muharram to End of Muharram 61 AH',
    dateGregorian: 'Late October 680 CE',
    coordinates: 'Euphrates & Syrian Caravan Corridor (1,150 km)',
    keyPersonalities: ['Imam Ali Zain al-Abideen (AS)', 'Sayyida Zaynab bint Ali (SA)', 'Shimr ibn Dhi’l-Jawshan (Escort Commander)'],
    summary: 'Escorted along the northern trade road to avoid tribal rescues, every town along the route witnesses the Quranic recitation of the sacred heads and the dignity of the Household.',
    historicalNarrative: 'Rather than taking the direct desert track, the Umayyad escort led by Shimr and Mahfuz ibn Alqama marched along the populated Euphrates-Aleppo-Homs corridor to display military triumph—yet in every station from Mosul (Masjid al-Nuqtah) and Aleppo (Mashhad al-Husayn) to Baalbek, public sympathy turned toward the Household of the Prophet.',
    sources: ['Bughyat al-Talab fi Tarikh Halab by Ibn al-Adim', 'Al-Kamil fi al-Tarikh by Ibn al-Athir, Vol. 4', 'Nafs al-Mahmum'],
    narrationNotes: 'Exact town stops along the Syrian route include both consensus stations (Aleppo, Homs, Damascus) and local shrine traditions.'
  },
  {
    id: 'station_damascus_court_and_mosque',
    step: 4,
    title: 'Damascus — Bab al-Sa’at, Court of Yazid & Pulpit of the Umayyad Mosque',
    arabicTitle: 'دمشق الشام — باب الساعات ومجلس يزيد ومنبر الجامع الأموي',
    dateHijri: '1 Safar – Mid-Safar 61 AH',
    dateGregorian: 'November 680 CE',
    coordinates: '33.5116° N, 36.3065° E (Damascus)',
    keyPersonalities: ['Sayyida Zaynab bint Ali (SA)', 'Imam Ali Zain al-Abideen (AS)', 'Sayyida Ruqayyah / Sakina (SA)'],
    summary: 'In the capital of the Umayyad empire, Sayyida Zaynab (SA) and Imam Zain al-Abideen (AS) expose Yazid’s tyranny before foreign ambassadors and Syrian elders, forcing Yazid to disavow Ibn Ziyad’s actions.',
    historicalNarrative: 'In the Umayyad Mosque of Damascus, when a court preacher praised Mu’awiya and Yazid, Imam Zain al-Abideen (AS) ascended the wooden pulpit despite his fever and chains, introducing himself: "Whoever knows me, knows me; and whoever does not know me, I am the son of Mecca and Mina, I am the son of Zamzam and al-Safa... I am the son of him who was slaughtered at Karbala!" The entire congregation wept so loudly that the call to prayer was interrupted.',
    sources: ['Tarikh al-Tabari, Vol. 5, pp. 460–465', 'Balaghat al-Nisa', 'Al-Ihtijaj by Shaykh al-Tabarsi, Vol. 2, pp. 30–35', 'Al-Luhuf, pp. 96–108'],
    narrationNotes: 'Consensus across Sunni and Shia historiography that Yazid was politically compelled to release the Household with honor.'
  },
  {
    id: 'station_return_karbala_and_medina',
    step: 5,
    title: 'Return via Karbala (Arba’een Tradition) & Arrival in Medina al-Munawwara',
    arabicTitle: 'العودة إلى كربلاء في الأربعين والوصول إلى المدينة المنورة ونعي بشير بن حذلم',
    dateHijri: '20 Safar – Rabi al-Awwal 61 AH',
    dateGregorian: 'November – December 680 CE',
    coordinates: 'Karbala (32.6160° N, 44.0324° E) → Medina (24.4672° N, 39.6111° E)',
    keyPersonalities: ['Imam Ali Zain al-Abideen (AS)', 'Sayyida Zaynab bint Ali (SA)', 'Jabir ibn Abdullah al-Ansari', 'Bashir ibn al-Jadhlam', 'Hazrat Umm al-Banin (SA)'],
    summary: 'Guided by Nu’man ibn Bashir, the Household asks to pass by Karbala where Jabir ibn Abdullah al-Ansari visits the graves on 20 Safar, before returning to Medina where Bashir ibn al-Jadhlam announces the elegy of Imam Hussain (AS).',
    historicalNarrative: 'At the outskirts of Medina, Imam Zain al-Abideen (AS) pitched tents and asked the poet Bashir ibn al-Jadhlam to enter the city of the Prophet and announce: "O people of Yathrib, there is no staying for you here! Hussain has been slain, so my tears pour forth; his body lies stained in blood at Karbala while his sacred head was carried upon a spear."',
    sources: ['Al-Luhuf by Sayyid Ibn Tawus, pp. 111–114', 'Misbah al-Mutahajjid by Shaykh al-Tusi', 'Kitab al-Irshad, p. 390'],
    narrationNotes: 'Historical reports differ on whether the Household reached Karbala on the very first 20 Safar 61 AH (as recorded in Al-Luhuf) or proceeded directly to Medina while Jabir ibn Abdullah visited on 20 Safar 61 AH (as discussed by Shaykh al-Mufid and Allamah al-Majlisi).'
  }
];

// ============================================================================
// PHASE 9B: WOMEN OF KARBALA HISTORICAL ARCHIVE (#27)
// ============================================================================
export const WOMEN_OF_KARBALA_ARCHIVE = [
  {
    id: 'woman_zaynab',
    name: 'Sayyida Zaynab bint Ali al-Kubra (SA)',
    arabicName: 'السيدة زينب الكبرى بنت أمير المؤمنين عليهما السلام',
    title: 'Aqilat Bani Hashim (The Wise Noblewoman of Banu Hashim) · Guardian of the Message of Karbala',
    relation: 'Daughter of Imam Ali (AS) & Sayyida Fatima al-Zahra (SA); Sister of Imam Hasan & Imam Hussain (AS)',
    chronologyRole: 'Accompanied Imam Hussain from Madinah to Karbala; protected the women and children on Sham-e-Ghariban; saved the life of Imam Zain al-Abideen (AS) twice (at the tent on Ashura and in Kufa’s palace); delivered the historic sermons in Kufa and Damascus.',
    keyQuote: '“By Allah, I saw nothing but beauty (Ma ra’aytu illa jamila). Scheme your schemes and strive your utmost, yet by Allah you shall never erase our mention nor extinguish our revelation.”',
    sources: ['Balaghat al-Nisa by Ibn Abi Tahir Tayfur', 'Tarikh al-Tabari, Vol. 5, pp. 453–462', 'Al-Luhuf by Sayyid Ibn Tawus'],
    personalityId: 'zaynab_bint_ali',
    locationId: 'zaynabiyya_hill_present'
  },
  {
    id: 'woman_umm_kulthum',
    name: 'Sayyida Umm Kulthum bint Ali (SA)',
    arabicName: 'السيدة أم كلثوم بنت أمير المؤمنين عليهما السلام',
    title: 'Orator of Kufa · Daughter of Imam Ali (AS) & Sayyida Fatima al-Zahra (SA)',
    relation: 'Younger sister of Imam Hasan, Imam Hussain, and Sayyida Zaynab (SA)',
    chronologyRole: 'Present throughout the siege of Karbala and the captivity march; delivered a searing address to the people of Kufa condemning their betrayal of her brother Imam Hussain (AS) and demanded that the town guards of Damascus keep onlookers away from the Prophet’s family.',
    keyQuote: '“O people of Kufa! Woe unto you! Why did you betray Hussain and leave him to be slain, and now you weep?”',
    sources: ['Al-Luhuf by Sayyid Ibn Tawus, pp. 89–91', 'Balaghat al-Nisa', 'Maqtal al-Khwarizmi'],
    personalityId: 'zaynab_bint_ali',
    locationId: 'mukhayam_present'
  },
  {
    id: 'woman_rabab',
    name: 'Lady al-Rabab bint Imra’ al-Qays (SA)',
    arabicName: 'السيدة الرباب بنت امرئ القيس الكلبية عليها السلام',
    title: 'Devoted Spouse of Imam Hussain (AS) · Mother of Sayyida Sakina & Infant Abdullah (Ali Asghar)',
    relation: 'Wife of Imam Hussain (AS); Daughter of the Christian-turned-Muslim noble poet Imra’ al-Qays ibn Adi al-Kalbi',
    chronologyRole: 'Witnessed the martyrdom of her infant son Abdullah (Ali Asghar) in the arms of Imam Hussain (AS) on Ashura; accompanied the captives to Kufa and Damascus; upon returning to Medina, refused to sit under any shade for a full year out of mourning for Imam Hussain (AS) until her passing in 62 AH.',
    keyQuote: '“Behold him who was a shining beam of light by whom guidance was sought—now lying at Karbala, slain and unburied.” (Elegy of Lady Rabab recorded in Al-Kamil)',
    sources: ['Al-Kamil fi al-Tarikh by Ibn al-Athir, Vol. 4, p. 88', 'Kitab al-Aghani by Abu al-Faraj al-Isfahani', 'Tarikh al-Tabari, Vol. 5'],
    personalityId: 'ali_asghar',
    locationId: 'mukhayam_present'
  },
  {
    id: 'woman_umm_al_banin',
    name: 'Hazrat Umm al-Banin Fatima bint Hizam (SA)',
    arabicName: 'السيدة أم البنين فاطمة بنت حزام الكلابية عليها السلام',
    title: 'Mother of the Four Moons of Karbala · Exemplar of Selfless Devotion to the Imamate',
    relation: 'Spouse of Imam Ali ibn Abi Talib (AS); Mother of Hazrat Abu al-Fadl al-Abbas, Abdullah, Ja’far, and Uthman',
    chronologyRole: 'Raised her four sons in Medina to place the children of Fatima al-Zahra (SA) above their own lives. When Bashir ibn al-Jadhlam brought news of Ashura to Medina, she interrupted the news of her four martyred sons saying: "Tell me first of Abu Abdullah al-Hussain!" and established the first public mourning gatherings in Jannat al-Baqi.',
    keyQuote: '“Call me no longer Umm al-Banin (Mother of the Sons), for it reminds me of my lions; my sons and all beneath the azure sky are a ransom for Abu Abdullah al-Hussain.”',
    sources: ['Maqatil al-Talibiyyin by Abu al-Faraj al-Isfahani', 'A’yan al-Shi’a by Sayyid Muhsin al-Amin'],
    personalityId: 'umm_al_banin',
    locationId: 'abbas_shrine_present'
  },
  {
    id: 'woman_fatima_bint_hussain',
    name: 'Sayyida Fatima al-Kubra bint al-Hussain (SA)',
    arabicName: 'السيدة فاطمة بنت الإمام الحسين عليهما السلام',
    title: 'Transmitter of the Karbala Chronicle & Orator of Kufa',
    relation: 'Daughter of Imam Hussain (AS) and Umm Ishaq bint Talha; Wife of Hasan al-Muthanna ibn al-Hasan',
    chronologyRole: 'Present at Karbala where her husband Hasan al-Muthanna fought heroically and was rescued critically wounded; delivered an acclaimed sermon at the gates of Kufa and became one of the primary eyewitness transmitters of the events of Ashura in early Hadith collections.',
    keyQuote: '“Praise be to Allah to the number of grains of sand and pebbles... You have incurred wrath from Allah that shall never be lifted.”',
    sources: ['Al-Luhuf by Sayyid Ibn Tawus, pp. 90–92', 'Kitab al-Irshad by Shaykh al-Mufid', 'Ansab al-Ashraf'],
    personalityId: 'imam_hussain',
    locationId: 'mukhayam_present'
  },
  {
    id: 'woman_wahb_mother_and_wife',
    name: 'Umm Wahb & the Bride of Wahb ibn Abdullah al-Kalbi',
    arabicName: 'أم وهب وزوجة الشهيد وهب بن عبد الله الكلبي (أول شهيدة في كربلاء)',
    title: 'Companions of Loyalty · First Female Martyr on the Plain of Karbala',
    relation: 'Mother and newlywed spouse of the companion Wahb ibn Abdullah al-Kalbi',
    chronologyRole: 'Encouraged Wahb to defend the grandson of the Prophet on the Day of Ashura. When Wahb fell in battle, his wife walked onto the battlefield to wipe the blood from his face, where Shimr’s retainer Rustam struck her with a tent pole—making her the first woman martyred on the battlefield of Karbala.',
    keyQuote: '“Do not leave me behind, for I see no life worthy of living after the household of the Messenger of Allah.”',
    sources: ['Tarikh al-Tabari, Vol. 5, p. 429', 'Al-Luhuf by Sayyid Ibn Tawus, p. 62', 'Maqtal al-Khwarizmi'],
    personalityId: 'habib_ibn_muzahir',
    locationId: 'historical_maqtal'
  }
];

// ============================================================================
// PHASE 9C: VERIFIED SERMONS & SPEECHES ARCHIVE (#28)
// ============================================================================
export const SERMONS_SPEECHES_ARCHIVE = [
  {
    id: 'sermon_testament_madinah',
    title: 'Testament of Reform (Wasiyyat al-Islah) to Muhammad ibn al-Hanafiyya',
    speaker: 'Imam Hussain ibn Ali (AS)',
    speakerId: 'imam_hussain',
    location: 'Madinah al-Munawwara',
    period: 'Pre-Departure · 28 Rajab 60 AH',
    arabicText: 'إِنِّي لَمْ أَخْرُجْ أَشِرًا وَلَا بَطِرًا وَلَا مُفْسِدًا وَلَا ظَالِمًا، وَإِنَّمَا خَرَجْتُ لِطَلَبِ الْإِصْلَاحِ فِي أُمَّةِ جَدِّي، أُرِيدُ أَنْ آمُرَ بِالْمَعْرُوفِ وَأَنْهَى عَنِ الْمُنْكَرِ وَأَسِيرَ بِسِيرَةِ جَدِّي وَأَبِي عَلِيِّ بْنِ أَبِي طَالِبٍ.',
    translationEn: '“Indeed, I have not risen out of insolence, arrogance, corruption, or oppression. Rather, I have risen solely to seek reform in the community of my grandfather (Prophet Muhammad SAWW). I desire to enjoin what is right and forbid what is wrong, and to walk in the way of my grandfather and my father Ali ibn Abi Talib.”',
    historicalContext: 'Written by Imam Hussain (AS) as his constitutional charter before departing Madinah on 28 Rajab 60 AH.',
    source: 'Maqtal al-Khwarizmi, Vol. 1, p. 188; Bihar al-Anwar, Vol. 44, p. 329',
    sourceStatus: 'confirmed'
  },
  {
    id: 'sermon_makkah_departure',
    title: 'Sermon of Departure from Makkah (Khutbat al-Mawt Qiladah)',
    speaker: 'Imam Hussain ibn Ali (AS)',
    speakerId: 'imam_hussain',
    location: 'Masjid al-Haram, Makkah',
    period: '8 Dhu al-Hijjah 60 AH (Yawm al-Tarwiyah)',
    arabicText: 'خُطَّ الْمَوْتُ عَلَى وُلْدِ آدَمَ مَخَطَّ الْقِلَادَةِ عَلَى جِيدِ الْفَتَاةِ، وَمَا أَوْلَهَنِي إِلَى أَسْلَافِي اشْتِيَاقَ يَعْقُوبَ إِلَى يُوسُفَ... أَلَا وَمَنْ كَانَ بَاذِلًا فِينَا مُهْجَتَهُ وَمُوَطِّنًا عَلَى لِقَاءِ اللَّهِ نَفْسَهُ فَلْيَرْحَلْ مَعَنَا.',
    translationEn: '“Death is inscribed upon the children of Adam just as a necklace is traced upon the neck of a young maiden. How deeply I yearn to meet my ancestors, as Ya’qub yearned for Yusuf... Whoever is prepared to offer his lifeblood for our sake and has readied his soul to meet Allah, let him depart with us, for I am departing tomorrow morning, God willing.”',
    historicalContext: 'Delivered in Mecca on the eve of 8 Dhu al-Hijjah 60 AH as Imam Hussain converted his Hajj into an Umrah to protect the Kaaba’s sanctity.',
    source: 'Al-Luhuf by Sayyid Ibn Tawus, p. 37; Kashf al-Ghummah by al-Irbili, Vol. 2, p. 29',
    sourceStatus: 'confirmed'
  },
  {
    id: 'sermon_dhu_husam',
    title: 'Sermon at Dhu Husam Before Hurr’s Cavalry (“Do You Not See That Truth Is Not Acted Upon?”)',
    speaker: 'Imam Hussain ibn Ali (AS)',
    speakerId: 'imam_hussain',
    location: 'Dhu Husam (En Route to Karbala)',
    period: 'Late Dhu al-Hijjah 60 AH',
    arabicText: 'أَلَا تَرَوْنَ إِلَى الْحَقِّ لَا يُعْمَلُ بِهِ، وَإِلَى الْبَاطِلِ لَا يُتَنَاهَى عَنْهُ؟ لِيَرْغَبِ الْمُؤْمِنُ فِي لِقَاءِ رَبِّهِ مُحِقًّا، فَإِنِّي لَا أَرَى الْمَوْتَ إِلَّا سَعَادَةً، وَلَا الْحَيَاةَ مَعَ الظَّالِمِينَ إِلَّا بَرَمًا.',
    translationEn: '“Do you not see that truth is no longer acted upon, and falsehood is no longer abstained from? In such a state, let the believer yearn to meet his Lord while upholding the truth! Indeed, I see death (in the way of truth) as nothing but felicity, and living alongside oppressors as nothing but disgrace.”',
    historicalContext: 'Addressed to both his companions and the 1,000 Kufan horsemen of Hurr ibn Yazid al-Riyahi after giving water to Hurr’s thirsty troops and horses.',
    source: 'Tarikh al-Tabari, Vol. 5, p. 403; Tuhaf al-Uqul by Ibn Shu’bah al-Harrani, p. 245',
    sourceStatus: 'confirmed'
  },
  {
    id: 'sermon_ashura_morning',
    title: 'Declaration of Dignity on the Day of Ashura (“Hayhat Minna al-Dhillah”)',
    speaker: 'Imam Hussain ibn Ali (AS)',
    speakerId: 'imam_hussain',
    location: 'Battlefield of Karbala (Al-Taff)',
    period: '10 Muharram 61 AH (Yawm al-Ashura)',
    arabicText: 'أَلَا وَإِنَّ الدَّعِيَّ ابْنَ الدَّعِيِّ قَدْ رَكَّزَ بَيْنَ اثْنَتَيْنِ: بَيْنَ السِّلَّةِ وَالذِّلَّةِ، وَهَيْهَاتَ مِنَّا الذِّلَّةُ! يَأْبَى اللَّهُ لَنَا ذَلِكَ وَرَسُولُهُ وَالْمُؤْمِنُونَ، وَحُجُورٌ طَابَتْ وَطَهُرَتْ، وَأُنُوفٌ حَمِيَّةٌ، وَنُفُوسٌ أَبِيَّةٌ مِنْ أَنْ تُؤْثِرَ طَاعَةَ اللِّئَامِ عَلَى مَصَارِعِ الْكِرَامِ.',
    translationEn: '“Behold! The ignoble son of the ignoble has forced us to choose between two things: between the unsheathed sword and humiliation—and far, far away is humiliation from us (Hayhat minna al-dhillah)! Allah refuses that for us, as do His Messenger, the believers, pure and chaste laps that nurtured us, proud spirits, and noble souls that refuse to prefer obedience to the vile over the death of the honorable!”',
    historicalContext: 'Proclaimed on the morning of 10 Muharram 61 AH facing the 30,000-strong army of Umar ibn Sa’ad.',
    source: 'Al-Luhuf by Sayyid Ibn Tawus, p. 54; Maqtal al-Khwarizmi, Vol. 2, p. 7; Tuhaf al-Uqul, p. 241',
    sourceStatus: 'confirmed'
  },
  {
    id: 'sermon_zaynab_kufa',
    title: 'Sermon of Sayyida Zaynab bint Ali (SA) at the Gates of Kufa',
    speaker: 'Sayyida Zaynab bint Ali (SA)',
    speakerId: 'zaynab_bint_ali',
    location: 'Kufa Grand Bazaar & Mosque Entrance',
    period: '12 Muharram 61 AH (Post-Ashura)',
    arabicText: 'أَتَبْكُونَ؟ فَلَا رَقَأَتِ الدَّمْعَةُ، وَلَا هَدَأَتِ الرَّنَّةُ! إِنَّمَا مَثَلُكُمْ كَمَثَلِ الَّتِي نَقَضَتْ غَزْلَهَا مِنْ بَعْدِ قُوَّةٍ أَنْكَاثًا... أَتَبْكُونَ وَتَنْتَحِبُونَ؟ إِي وَاللَّهِ فَابْكُوا كَثِيرًا وَاضْحَكُوا قَلِيلًا، فَلَقَدْ ذَهَبْتُمْ بِعَارِهَا وَشَنَارِهَا.',
    translationEn: '“Do you weep? May your tears never dry, and may your groans never subside! Your likeness is only that of a woman who unravels her spun thread after it was strong... Do you weep and wail over my brother? Yes, by Allah, weep much and laugh little, for you have earned its eternal shame and dishonor, which you shall never wash away with any water!”',
    historicalContext: 'Delivered on 12 Muharram 61 AH as the Kufan crowds wept upon seeing the captives of the Prophet’s household; narrators recorded that the people heard the very voice and cadence of Imam Ali ibn Abi Talib (AS).',
    source: 'Balaghat al-Nisa by Ibn Abi Tahir Tayfur; Al-Ihtijaj by Shaykh al-Tabarsi, Vol. 2, p. 29; Al-Luhuf, p. 87',
    sourceStatus: 'confirmed'
  },
  {
    id: 'sermon_zaynab_damascus',
    title: 'Sermon of Sayyida Zaynab bint Ali (SA) in the Court of Yazid in Damascus',
    speaker: 'Sayyida Zaynab bint Ali (SA)',
    speakerId: 'zaynab_bint_ali',
    location: 'Umayyad Palace (Al-Khadra), Damascus',
    period: '1 Safar 61 AH (Post-Ashura)',
    arabicText: 'فَكِدْ كَيْدَكَ، وَاسْعَ سَعْيَكَ، وَنَاصِبْ جَهْدَكَ، فَوَاللَّهِ لَا تَمْحُو ذِكْرَنَا، وَلَا تُمِيتُ وَحْيَنَا، وَلَا تُدْرِكُ أَمَدَنَا، وَلَا تَرْحَضُ عَنْكَ عَارَهَا، وَهَلْ رَأْيُكَ إِلَّا فَنَدٌ، وَأَيَّامُكَ إِلَّا عَدَدٌ، وَجَمْعُكَ إِلَّا بَدَدٌ؟',
    translationEn: '“So plot your plots, strive your utmost, and exhaust your efforts! For by Allah, you shall never erase our mention, nor extinguish our revelation, nor reach our station, nor wash away from yourself the shame of this crime! Is your judgment anything but delusion, your days anything but numbered, and your gathering anything but destined to scatter?”',
    historicalContext: 'Delivered in the throne hall of Damascus when Yazid recited verses of Ibn al-Ziba’ra gloating over the martyrs of Banu Hashim.',
    source: 'Balaghat al-Nisa by Ibn Abi Tahir Tayfur; Tarikh al-Tabari, Vol. 5, p. 462; Al-Luhuf, p. 103',
    sourceStatus: 'confirmed'
  },
  {
    id: 'sermon_sajjad_damascus_mosque',
    title: 'Sermon of Imam Ali Zain al-Abideen (AS) from the Pulpit of the Umayyad Mosque',
    speaker: 'Imam Ali Zain al-Abideen (AS)',
    speakerId: 'zain_al_abideen',
    location: 'Grand Umayyad Mosque, Damascus',
    period: 'Safar 61 AH (Post-Ashura)',
    arabicText: 'أَيُّهَا النَّاسُ، أُعْطِينَا سِتًّا وَفُضِّلْنَا بِسَبْعٍ: أُعْطِينَا الْعِلْمَ وَالْحِلْمَ وَالسَّمَاحَةَ وَالْفَصَاحَةَ وَالشَّجَاعَةَ وَالْمَحَبَّةَ فِي قُلُوبِ الْمُؤْمِنِينَ... مَنْ عَرَفَنِي فَقَدْ عَرَفَنِي، وَمَنْ لَمْ يَعْرِفْنِي أَنْبَأْتُهُ بِحَسَبِي وَنَسَبِي: أَنَا ابْنُ مَكَّةَ وَمِنًى، أَنَا ابْنُ زَمْزَمَ وَالصَّفَا... أَنَا ابْنُ مَنْ قُتِلَ صَبْرًا وَكَفَى بِذَلِكَ فَخْرًا!',
    translationEn: '“O people! We were granted six things and favored with seven: we were given knowledge, forbearance, generosity, eloquence, courage, and love in the hearts of the believers... Whoever knows me, knows me; and whoever does not know me, I shall inform him of my lineage: I am the son of Mecca and Mina! I am the son of Zamzam and al-Safa! I am the son of Muhammad al-Mustafa! I am the son of Ali al-Murtada! I am the son of Fatima al-Zahra! I am the son of him who was slain unjustly at Karbala—and that suffices as an honor!”',
    historicalContext: 'Delivered before the assembly of Syrian notables in the Umayyad Mosque of Damascus, turning the capital against Yazid and securing the release of the Household.',
    source: 'Al-Ihtijaj by Shaykh al-Tabarsi, Vol. 2, pp. 32–35; Maqtal al-Khwarizmi, Vol. 2, p. 69; Bihar al-Anwar, Vol. 45, p. 136',
    sourceStatus: 'confirmed'
  }
];

// ============================================================================
// PHASE 8: SOURCE COMPARISON MATRIX & HISTORICAL CLAIM CHECKER (#18 & #19)
// ============================================================================
export const SOURCE_COMPARISON_TOPICS = [
  {
    id: 'comp_return_arbaeen',
    title: 'Did the Captive Household Return via Karbala on the First Arba’een (20 Safar 61 AH)?',
    category: 'Post-Ashura Chronology',
    confidence: 'different_narrations',
    summary: 'Classical Imami scholars preserve two distinct historiographical positions regarding whether the returning caravan from Damascus reached Karbala on the very first 20 Safar 61 AH or in the following year, while unanimously agreeing that Jabir ibn Abdullah al-Ansari visited on 20 Safar.',
    sources: [
      {
        sourceName: 'Al-Luhuf ala Qatla al-Tufuf — Sayyid Ibn Tawus (d. 664 AH)',
        position: 'Affirmative on First-Year Return (20 Safar 61 AH)',
        excerpt: 'States that when the Ahlul Bayt departed Damascus toward Medina, they asked their guide to take them by the road of Karbala, where they found Jabir ibn Abdullah al-Ansari and comrades of Banu Hashim visiting the grave of al-Hussain (AS) on 20 Safar.',
        chronologyNote: 'Supports simultaneous meeting of Jabir and the Ahlul Bayt caravan at Karbala on 20 Safar.'
      },
      {
        sourceName: 'Kitab al-Irshad & Masar al-Shi’a — Shaykh al-Mufid (d. 413 AH)',
        position: 'Jabir’s Visitation on 20 Safar; Direct Return to Medina Examined',
        excerpt: 'Records 20 Safar as the anniversary of the return/visitation and the arrival of Jabir ibn Abdullah al-Ansari, while early chronological reconstructions note the tight 40-day travel window between Karbala, Kufa, Damascus, and back.',
        chronologyNote: 'Emphasizes Jabir ibn Abdullah al-Ansari as the first pilgrim on 20 Safar.'
      },
      {
        sourceName: 'Tarikh al-Tabari (via Abu Mikhnaf, d. 157 AH)',
        position: 'Focuses on Damascus Release & Arrival in Medina',
        excerpt: 'Details Nu’man ibn Bashir’s honorable escort of the family from Damascus to Medina without specifying the exact day of intermediate stops.',
        chronologyNote: 'Provides the baseline political chronology of the Damascus court.'
      }
    ],
    commonGround: 'All sources unanimously attest that Jabir ibn Abdullah al-Ansari and Atiyyah al-Awfi visited Karbala on 20 Safar, and that Ziyarat al-Arba’een is one of the five defining signs of a believer (Hadith of Imam Hasan al-Askari AS).',
    keyDifference: 'Whether the meeting between Jabir and Imam Zain al-Abideen (AS) at Karbala occurred on 20 Safar 61 AH or 20 Safar 62 AH.'
  },
  {
    id: 'comp_martyrs_count',
    title: 'Exact Number of Martyrs Alongside Imam Hussain (AS) on the Day of Ashura',
    category: '61 AH Battlefield Historiography',
    confidence: 'widely_reported',
    summary: 'While "72 Martyrs" is the most famous canonical count, classical primary sources list between 72 and over 110 named martyrs depending on whether retainers (mawali), late Kufan defectors, and those martyred in Kufa (like Muslim ibn Aqeel) are included.',
    sources: [
      {
        sourceName: 'Kitab al-Irshad — Shaykh al-Mufid (d. 413 AH) & Tarikh al-Tabari',
        position: '72 Martyrs (17 Banu Hashim + ~55 Companions) as the Core Battlefield Count',
        excerpt: 'Records that seventy-two heads were carried from Karbala to Kufa distributed among the Kufan tribes (Kinda, Hawazin, Tamim, Asad, Madhhij, and Thaqif).',
        chronologyNote: 'Represents the number of severed heads registered by the Umayyad army.'
      },
      {
        sourceName: 'Ziyarat al-Nahiyah al-Muqaddasah & Iqbal al-A’mal — Sayyid Ibn Tawus',
        position: 'Over 80 Named Martyrs Saluted Individually by Name and Lineage',
        excerpt: 'Salutes each companion and Hashimite martyr individually, including retainers (mawali) of Imam Ali and Imam Hussain whose heads were not taken by the tribes.',
        chronologyNote: 'Includes martyrs whose bodies remained on the field without tribal head-counts.'
      },
      {
        sourceName: 'Al-Fada’il by Ibn Shadhan & Ansab al-Ashraf by al-Baladhuri',
        position: 'Between 82 and 100+ Total Martyrs Including Cavalry & Retainers',
        excerpt: 'Notes 32 horsemen and 40 foot-soldiers at the start of battle, plus retainers and those who defected from Umar ibn Sa’ad’s camp on Ashura morning.',
        chronologyNote: 'Distinguishes between initial camp roster and Ashura morning joiners.'
      }
    ],
    commonGround: 'Complete consensus on the core leadership of Banu Hashim (Imam Hussain, Abbas, Ali Akbar, Qasim, Abdullah/Ali Asghar, and the sons of Ali, Hasan, Ja’far, and Aqeel) and the chief companions (Habib, Zuhayr, Hurr, Muslim ibn Awsaja, Burayr, John, Wahb).',
    keyDifference: 'Whether the count of 72 refers strictly to the severed heads registered in Kufa or the total number of individuals martyred across the campaign.'
  },
  {
    id: 'comp_fatima_shahadat_dates',
    title: 'Why Are Both 13 Jumada al-Awwal and 3 Jumada al-Thani Observed for the Shahadat of Sayyida Fatima al-Zahra (SA)?',
    category: 'Sacred Calendar Historiography',
    confidence: 'different_narrations',
    summary: 'Classical Imami Hadith collections preserve two authenticated narrations from the Imams regarding the duration Sayyida Fatima al-Zahra (SA) lived after the passing of Prophet Muhammad (SAWW) on 28 Safar 11 AH: 75 days and 95 days.',
    sources: [
      {
        sourceName: 'Al-Kafi — Shaykh al-Kulayni (d. 329 AH), Vol. 1, p. 458',
        position: '75 Days Narration → 13 Jumada al-Awwal 11 AH',
        excerpt: 'Narrates from Imam Ja’far al-Sadiq (AS) that Sayyida Fatima (SA) lived seventy-five days after the Messenger of Allah (SAWW).',
        chronologyNote: 'Counting 75 days from 28 Safar (with 29-day lunar months) yields 13–15 Jumada al-Awwal.'
      },
      {
        sourceName: 'Dala’il al-Imamah (al-Tabari al-Imami) & Misbah al-Mutahajjid (Shaykh al-Tusi)',
        position: '95 Days Narration → 3 Jumada al-Thani 11 AH',
        excerpt: 'Narrates from Imam Ja’far al-Sadiq (AS) that she departed on Tuesday, 3 Jumada al-Akhir in the year 11 AH, ninety-five days after the Prophet.',
        chronologyNote: 'Observed as the culminating day of Ayyam al-Fatimiyyah.'
      },
      {
        sourceName: 'Contemporary Marja’iyyah Consensus (Najaf & Qom)',
        position: 'Observance of Both Dates as Ayyam al-Fatimiyyah',
        excerpt: 'Honors the 20-day span from 13 Jumada al-Awwal to 3 Jumada al-Thani as the Fatimiyyah mourning season without discarding either classical chain.',
        chronologyNote: 'Exemplifies scholarly transparency when classical manuscripts preserve two valid chains.'
      }
    ],
    commonGround: 'Unanimous consensus on the year (11 AH), her age (18 years), her night burial by Imam Ali (AS), and the content of her Sermon of Fadak.',
    keyDifference: 'Manuscript orthography in early Arabic scripts where "sab’in" (70) and "tis’in" (90) look nearly identical without diacritical dots.'
  }
];

export const HISTORICAL_CLAIM_VERIFICATIONS = [
  {
    id: 'claim_water_7_muharram',
    keywords: ['7 muharram', 'water', 'furat', 'euphrates', 'blockade', 'paani', 'thirst'],
    claimTitle: 'Was water officially cut off from Imam Hussain’s camp on 7 Muharram 61 AH?',
    verdict: 'Supported',
    verdictBadge: 'SUPPORTED BY PRIMARY SOURCES',
    confidence: 'confirmed',
    explanation: 'Yes. Primary early chronicles unanimously record that on 7 Muharram 61 AH, Ubaydullah ibn Ziyad sent a written order to Umar ibn Sa’ad commanding him to intervene between Imam Hussain (AS) and the water of the Euphrates, and 500 horsemen under Amr ibn al-Hajjaj were stationed along the riverbank.',
    supportingSources: [
      'Tarikh al-Tabari (via Abu Mikhnaf), Vol. 5, p. 412',
      'Kitab al-Irshad by Shaykh al-Mufid, p. 371',
      'Ansab al-Ashraf by al-Baladhuri, Vol. 3, p. 180'
    ],
    conflictingSources: []
  },
  {
    id: 'claim_kaaba_birth_ali',
    keywords: ['kaaba', '13 rajab', 'imam ali born', 'fatima bint asad', 'born inside kaaba'],
    claimTitle: 'Was Imam Ali ibn Abi Talib (AS) born inside the Sacred Kaaba on 13 Rajab?',
    verdict: 'Supported',
    verdictBadge: 'MUTAWATIR (WIDELY ATTESTED)',
    explanation: 'Yes. Both Shia and Sunni classical hadith and historical authorities attest that Fatima bint Asad gave birth to Ali ibn Abi Talib (AS) inside the Sacred Kaaba. Al-Hakim al-Naysaburi explicitly states in Al-Mustadrak ala al-Sahihayn that the narrations of Ali’s birth inside the Kaaba are Mutawatir (transmitted by so many chains that fabrication is impossible).',
    confidence: 'confirmed',
    supportingSources: [
      'Al-Mustadrak ala al-Sahihayn by al-Hakim al-Naysaburi, Vol. 3, p. 483',
      'Kitab al-Irshad by Shaykh al-Mufid, Vol. 1, p. 5',
      'Muruj al-Dhahab by al-Mas’udi, Vol. 2, p. 349'
    ],
    conflictingSources: []
  },
  {
    id: 'claim_yazid_allegiance_offer',
    keywords: ['three options', 'put my hand in yazid', 'surrender to yazid', 'offer allegiance'],
    claimTitle: 'Did Imam Hussain (AS) ever offer to go to Damascus and place his hand in Yazid’s hand?',
    verdict: 'Incorrect',
    verdictBadge: 'REFUTED BY EYEWITNESS TRANSMITTERS',
    confidence: 'confirmed',
    explanation: 'No. While a single report attributed to al-Husayn ibn Abd al-Rahman claimed Imam Hussain offered three options including going to Yazid, the direct eyewitness Uqba ibn Sim’an (attendant of Lady Rabab who accompanied Imam Hussain from Madinah to Karbala and heard every word he spoke) explicitly refuted this in Tarikh al-Tabari, testifying: "I accompanied Hussain from Madinah to Mecca and from Mecca to Iraq, and I did not leave him until he was martyred; by Allah, he never offered to place his hand in Yazid’s hand!"',
    supportingSources: [
      'Eyewitness testimony of Uqba ibn Sim’an in Tarikh al-Tabari, Vol. 5, p. 414',
      'Kitab al-Irshad by Shaykh al-Mufid, p. 372 ("Hayhat minna al-dhillah")'
    ],
    conflictingSources: [
      'Secondary non-eyewitness report of al-Husayn ibn Abd al-Rahman (explicitly corrected by al-Tabari using Uqba ibn Sim’an’s testimony)'
    ]
  },
  {
    id: 'claim_arbaeen_return_date',
    keywords: ['arbaeen', '20 safar', 'return to karbala', 'jabir', 'first arbaeen'],
    claimTitle: 'Did Jabir ibn Abdullah al-Ansari and the Ahlul Bayt meet at Karbala on 20 Safar 61 AH?',
    verdict: 'Multiple Narrations',
    verdictBadge: 'MULTIPLE SCHOLARLY NARRATIONS',
    confidence: 'different_narrations',
    explanation: 'All classical sources agree that Jabir ibn Abdullah al-Ansari and Atiyyah al-Awfi visited the grave of Imam Hussain (AS) on 20 Safar. Regarding whether the captive family reached Karbala on the very first 20 Safar 61 AH, Sayyid Ibn Tawus in Al-Luhuf affirms the meeting on 20 Safar 61 AH, whereas scholars such as Shaykh al-Mufid and Allamah al-Majlisi note the geographical distance between Damascus and Karbala and discuss whether the family’s Karbala stop occurred during the return or in the following year.',
    supportingSources: [
      'Al-Luhuf by Sayyid Ibn Tawus, p. 111 (Affirms meeting on 20 Safar)',
      'Misbah al-Mutahajjid by Shaykh al-Tusi, p. 787'
    ],
    conflictingSources: [
      'Chronological analysis in Bihar al-Anwar (Vol. 45) & Shaykh al-Mufid’s Masar al-Shi’a'
    ]
  },
  {
    id: 'claim_hijri_gregorian_same',
    keywords: ['october 10 every year', 'gregorian date', 'why dates move', '10-11 days', 'different date in india and iraq'],
    claimTitle: 'Why do Islamic anniversaries shift across Gregorian dates and sometimes differ by 1 day between countries?',
    verdict: 'Supported',
    verdictBadge: 'ASTRONOMICAL & JURISPRUDENTIAL FACT',
    confidence: 'confirmed',
    explanation: 'Islamic historical anniversaries follow the 12-month lunar Hijri calendar (354 or 355 days), which is approximately 10 to 11 days shorter than the 365.24-day solar Gregorian year. Furthermore, because each Hijri month begins with the verified sighting of the new crescent moon (Ru’yat al-Hilal) above a region’s horizon, regions in different longitudes or following different sighting criteria (e.g., India/Pakistan vs. Iraq/Saudi Arabia) may legitimately differ by ±1 day.',
    supportingSources: [
      'Quran 2:189 ("They ask you about the new moons; say: They are measurements of time for mankind and for pilgrimage")',
      'Minhaj al-Salihin (Book of Fasting & Crescent Sighting Criteria)'
    ],
    conflictingSources: []
  }
];
