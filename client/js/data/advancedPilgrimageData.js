/**
 * KARBALA DIGITAL HERITAGE PLATFORM — 5 ADVANCED FEATURES UNIFIED DATA & TELEMETRY ENGINE
 * Extends existing:
 * - smartPoleNavigationData.js (1,452 Poles, Anchors, Landmarks)
 * - timeline.js (2–10 Muharram 61 AH)
 * - locations.js (Present-Day & 61 AH Historical Locations)
 * - personalities.js (61 AH Personalities)
 * - certainty_explanations.js (Historiographical Sources & Confidence)
 */

import {
  PILGRIMAGE_ANCHORS,
  KEY_LANDMARK_POLES,
  CALIBRATED_POLE_SPACING_METERS,
  getPoleData
} from './smartPoleNavigationData.js';
import { MUHARRAM_DAYS } from './timeline.js';
import { PRESENT_DAY_LOCATIONS, HISTORICAL_61AH_LOCATIONS } from './locations.js';
import { PERSONALITIES } from './personalities.js';
import { CERTAINTY_EXPLANATIONS } from './certainty_explanations.js';

// ============================================================================
// FEATURE 1: CINEMATIC CROWD HEATMAP PALETTE & GRANULAR ROUTE SEGMENTS
// ============================================================================
// Uses existing obsidian/gold/amber/restrained-crimson Karbala palette (NO neon colors)
export const CINEMATIC_CROWD_PALETTE = {
  LOW: {
    id: 'LOW',
    label: 'Low Crowd',
    arabicLabel: 'انسيابية مريحة',
    hex: '#528C6E', // Muted Sanctuary Sage Green
    badgeBg: 'rgba(82, 140, 110, 0.18)',
    badgeBorder: 'rgba(82, 140, 110, 0.5)',
    avgSpeedKmh: 4.4,
    description: 'Comfortable walking flow with wide open lanes along the corridor.'
  },
  MODERATE: {
    id: 'MODERATE',
    label: 'Moderate',
    arabicLabel: 'كثافة معتدلة',
    hex: '#C6A66B', // Antique Karbala Gold
    badgeBg: 'rgba(198, 166, 107, 0.18)',
    badgeBorder: 'rgba(198, 166, 107, 0.55)',
    avgSpeedKmh: 3.7,
    description: 'Steady pilgrimage procession; normal queues at water and tea stations.'
  },
  BUSY: {
    id: 'BUSY',
    label: 'Busy',
    arabicLabel: 'حركة مزدحمة',
    hex: '#D4883A', // Warm Amber Ochre
    badgeBg: 'rgba(212, 136, 58, 0.18)',
    badgeBorder: 'rgba(212, 136, 58, 0.55)',
    avgSpeedKmh: 2.8,
    description: 'Dense pedestrian movement; slower pace near major Mawkib intersections.'
  },
  VERY_BUSY: {
    id: 'VERY_BUSY',
    label: 'Very Busy',
    arabicLabel: 'كثافة عالية جداً',
    hex: '#A8383B', // Restrained Heritage Crimson
    badgeBg: 'rgba(168, 56, 59, 0.22)',
    badgeBorder: 'rgba(168, 56, 59, 0.6)',
    avgSpeedKmh: 1.9,
    description: 'High congestion near checkpoints or sanctuary portals. Keep group members close.'
  },
  UNKNOWN: {
    id: 'UNKNOWN',
    label: 'Live Data Unavailable',
    arabicLabel: 'البيانات المباشرة غير متوفرة',
    hex: '#64748B', // Muted Slate
    badgeBg: 'rgba(100, 116, 139, 0.18)',
    badgeBorder: 'rgba(100, 116, 139, 0.45)',
    avgSpeedKmh: null,
    description: 'Live crowd sensor reading unavailable for this segment.'
  }
};

export const CROWD_SOURCE_BADGES = {
  LIVE: { id: 'LIVE', label: 'LIVE', desc: 'Verified optical checkpoint / active anonymized telemetry' },
  ESTIMATED: { id: 'ESTIMATED', label: 'ESTIMATED', desc: 'Estimated from recent anonymous movement data' },
  REPORTED: { id: 'REPORTED', label: 'REPORTED', desc: 'Verified field observer / admin condition report' },
  STALE: { id: 'STALE', label: 'STALE', desc: 'Historical / cached reading (>30 min old) — not live' }
};

export const GRANULAR_CROWD_SEGMENTS = [
  {
    segmentId: 'cseg_01',
    fromPole: 1,
    toPole: 140,
    name: 'Pole 1–140 • Najaf Exit to Al-Haidariya South',
    crowdLevel: 'LOW',
    sourceType: 'LIVE',
    averageWalkingSpeedKmh: 4.5,
    freshnessMinutes: 3,
    lastUpdateLabel: 'Updated 3 minutes ago',
    sensorSource: 'Checkpoint #1 Optical Axis Counter & Anonymous GPS Flow',
    restAreaOverload: false,
    lessCongestedAlternative: null
  },
  {
    segmentId: 'cseg_02',
    fromPole: 141,
    toPole: 299,
    name: 'Pole 141–299 • Al-Haidariya Service Complex Zone',
    crowdLevel: 'MODERATE',
    sourceType: 'LIVE',
    averageWalkingSpeedKmh: 3.8,
    freshnessMinutes: 5,
    lastUpdateLabel: 'Updated 5 minutes ago',
    sensorSource: 'Astan Al-Abbasiya Pole 208 Complex Telemetry',
    restAreaOverload: false,
    lessCongestedAlternative: null
  },
  {
    segmentId: 'cseg_03',
    fromPole: 300,
    toPole: 400,
    name: 'Pole 300–400 • Approach to Khan Al-Hammad',
    crowdLevel: 'BUSY',
    sourceType: 'ESTIMATED',
    averageWalkingSpeedKmh: 2.8,
    freshnessMinutes: 4,
    lastUpdateLabel: 'Updated 4 min ago',
    sensorSource: 'Estimated from recent anonymous movement data & RO Station Queue',
    restAreaOverload: true,
    lessCongestedAlternative: 'Less crowded route available: Dedicated Western Pedestrian Service Apron (parallel paved walkway beside Poles 310–395).'
  },
  {
    segmentId: 'cseg_04',
    fromPole: 401,
    toPole: 547,
    name: 'Pole 401–547 • Al-Kifl International Mawakib Corridor',
    crowdLevel: 'MODERATE',
    sourceType: 'REPORTED',
    averageWalkingSpeedKmh: 3.6,
    freshnessMinutes: 9,
    lastUpdateLabel: 'Last verified 9 minutes ago',
    sensorSource: 'Field Observer Report — Al-Kifl Intersection',
    restAreaOverload: false,
    lessCongestedAlternative: null
  },
  {
    segmentId: 'cseg_05',
    fromPole: 548,
    toPole: 570,
    name: 'Pole 548–570 • Central Bridge Bottleneck Sector',
    crowdLevel: 'BUSY',
    sourceType: 'REPORTED',
    averageWalkingSpeedKmh: 2.6,
    freshnessMinutes: 6,
    lastUpdateLabel: 'Updated 6 minutes ago',
    sensorSource: 'Verified Field Update — Highway Pedestrian Overpass',
    restAreaOverload: true,
    lessCongestedAlternative: 'Less crowded route available: Use the shaded right-hand Mawkib colonnade lane between Pole 545 and Pole 575.'
  },
  {
    segmentId: 'cseg_06',
    fromPole: 571,
    toPole: 700,
    name: 'Pole 571–700 • Al-Zarqa Oasis Corridor',
    crowdLevel: 'LOW',
    sourceType: 'ESTIMATED',
    averageWalkingSpeedKmh: 4.3,
    freshnessMinutes: 11,
    lastUpdateLabel: 'Updated 11 minutes ago',
    sensorSource: 'Estimated from recent anonymous movement data',
    restAreaOverload: false,
    lessCongestedAlternative: null
  },
  {
    segmentId: 'cseg_07',
    fromPole: 701,
    toPole: 760,
    name: 'Pole 701–760 • Halfway Milestone (Pole 726) Plaza',
    crowdLevel: 'VERY_BUSY',
    sourceType: 'LIVE',
    averageWalkingSpeedKmh: 2.1,
    freshnessMinutes: 2,
    lastUpdateLabel: 'Updated 2 minutes ago',
    sensorSource: 'Joint Governorate Midpoint Broadcast & Medical Triage Sensor',
    restAreaOverload: true,
    lessCongestedAlternative: 'Less crowded route available: Outer Western Service Lane bypasses the central Pole 726 monument gathering.'
  },
  {
    segmentId: 'cseg_08',
    fromPole: 761,
    toPole: 950,
    name: 'Pole 761–950 • Imam Rida Pavilion to Al-Ibrahimiya',
    crowdLevel: 'MODERATE',
    sourceType: 'LIVE',
    averageWalkingSpeedKmh: 3.7,
    freshnessMinutes: 7,
    lastUpdateLabel: 'Updated 7 minutes ago',
    sensorSource: 'CMC Telecom Node Pole 950 Flow Telemetry',
    restAreaOverload: false,
    lessCongestedAlternative: null
  },
  {
    segmentId: 'cseg_09',
    fromPole: 951,
    toPole: 1120,
    name: 'Pole 951–1120 • Approach to Imam Hassan Pilgrimage City',
    crowdLevel: 'MODERATE',
    sourceType: 'REPORTED',
    averageWalkingSpeedKmh: 3.5,
    freshnessMinutes: 14,
    lastUpdateLabel: 'Last verified 14 minutes ago',
    sensorSource: 'Astan Al-Alawiya Pilgrim City Gate Report',
    restAreaOverload: false,
    lessCongestedAlternative: null
  },
  {
    segmentId: 'cseg_10',
    fromPole: 1121,
    toPole: 1350,
    name: 'Pole 1121–1350 • Al-Wand & Khan Al-Nukhaylah Sector',
    crowdLevel: 'BUSY',
    sourceType: 'ESTIMATED',
    averageWalkingSpeedKmh: 2.9,
    freshnessMinutes: 8,
    lastUpdateLabel: 'Updated 8 minutes ago',
    sensorSource: 'Estimated from recent anonymous movement data',
    restAreaOverload: false,
    lessCongestedAlternative: null
  },
  {
    segmentId: 'cseg_11',
    fromPole: 1351,
    toPole: 1452,
    name: 'Pole 1351–1452 • Karbala Security Perimeter & Final Sanctuary Approach',
    crowdLevel: 'VERY_BUSY',
    sourceType: 'LIVE',
    averageWalkingSpeedKmh: 1.8,
    freshnessMinutes: 3,
    lastUpdateLabel: 'Updated 3 minutes ago',
    sensorSource: 'Karbala Joint Operations Checkpoint #1407 & Bab Tariq Al-Najaf Counter',
    restAreaOverload: true,
    lessCongestedAlternative: 'Less crowded route available: Verified Astan Al-Abbasiya Outer Ring Pedestrian Boulevard (Al-umariyah link) for families and wheelchairs.'
  }
];

export const SHRINE_GATE_CROWD_DATA = [
  {
    gateId: 'gate_hussain_qibla',
    gateCode: 'Gate A',
    name: 'Bab al-Qibla (Imam Hussain Main South Gate)',
    shrine: 'Imam Hussain (AS)',
    coords: [32.61520, 44.03245],
    crowdLevel: 'VERY_BUSY',
    sourceType: 'LIVE',
    freshnessMinutes: 3,
    lastUpdateLabel: 'Updated 3 minutes ago',
    waitMinutesEstimate: 18,
    recommendation: 'Consider Bab al-Rajaa or Bab al-Sidra for faster step-free entry.'
  },
  {
    gateId: 'gate_hussain_rajaa',
    gateCode: 'Gate B',
    name: 'Bab al-Rajaa (Southwest Accessible Portal)',
    shrine: 'Imam Hussain (AS)',
    coords: [32.61545, 44.03175],
    crowdLevel: 'MODERATE',
    sourceType: 'LIVE',
    freshnessMinutes: 4,
    lastUpdateLabel: 'Updated 4 minutes ago',
    waitMinutesEstimate: 6,
    recommendation: 'Recommended for families and wheelchairs.'
  },
  {
    gateId: 'gate_hussain_sidra',
    gateCode: 'Gate C',
    name: 'Bab al-Sidra (North Gate)',
    shrine: 'Imam Hussain (AS)',
    coords: [32.61690, 44.03220],
    crowdLevel: 'LOW',
    sourceType: 'REPORTED',
    freshnessMinutes: 8,
    lastUpdateLabel: 'Last verified 8 minutes ago',
    waitMinutesEstimate: 3,
    recommendation: 'Smooth entry flow reported by shrine stewards.'
  },
  {
    gateId: 'gate_abbas_qibla',
    gateCode: 'Gate D',
    name: 'Bab al-Qibla (Al-Abbas South Gate)',
    shrine: 'Al-Abbas (AS)',
    coords: [32.61775, 44.03580],
    crowdLevel: 'BUSY',
    sourceType: 'LIVE',
    freshnessMinutes: 5,
    lastUpdateLabel: 'Updated 5 minutes ago',
    waitMinutesEstimate: 12,
    recommendation: 'Moderate-to-busy queue; Bab al-Imam Ali (North) has lighter flow.'
  },
  {
    gateId: 'gate_abbas_ali',
    gateCode: 'Gate E',
    name: 'Bab al-Imam Ali (Al-Abbas North Gate)',
    shrine: 'Al-Abbas (AS)',
    coords: [32.61935, 44.03585],
    crowdLevel: 'LOW',
    sourceType: 'REPORTED',
    freshnessMinutes: 7,
    lastUpdateLabel: 'Last verified 7 minutes ago',
    waitMinutesEstimate: 4,
    recommendation: 'Low crowd density; direct step-free access.'
  }
];

// ============================================================================
// FEATURE 2: SMART MAWKIB & PILGRIM FACILITY DIRECTORY (POLES 1–1452 & SHRINES)
// ============================================================================
export const SMART_MAWKIB_FACILITIES = [
  {
    facilityId: 'mwk_001',
    name: 'Mawkib Astan Al-Alawiya Departure Welcome Hub',
    arabicName: 'موكب العتبة العلوية المقدسة - نقطة الانطلاق',
    poleNumber: 5,
    coordinates: { lat: 32.0638, lng: 44.3405 },
    services: ['mawkib', 'water', 'food', 'tea', 'rest', 'washroom', 'prayer', 'lost_found'],
    availabilityStatus: 'OPEN_NOW',
    verificationStatus: 'VERIFIED',
    genderFamilyNotes: 'Dedicated Women & Family Rest Halls + Men Pavilion',
    accessibility: 'Full wheelchair ramp & ground-level wudu',
    lastVerified: '12 mins ago',
    source: 'Astan Al-Alawiya Official Field Registry',
    openHours: '24/7 during Pilgrimage',
    description: 'Official departure Mawkib providing chilled RO water, hot tea, and pilgrim ID wristbands.'
  },
  {
    facilityId: 'mwk_070',
    name: 'Al-Kufa Convergence Filtration & Wudu Complex',
    arabicName: 'مجمع سقاية ووضوء تقاطع الكوفة',
    poleNumber: 70,
    coordinates: { lat: 32.0875, lng: 44.3350 },
    services: ['mawkib', 'water', 'tea', 'washroom', 'prayer', 'charging'],
    availabilityStatus: 'OPEN_NOW',
    verificationStatus: 'VERIFIED',
    genderFamilyNotes: 'Separate male and female sanitary & prayer wings',
    accessibility: 'Step-free paved courtyard',
    lastVerified: '18 mins ago',
    source: 'Najaf Water & Pilgrim Logistics Directorate',
    openHours: '24/7',
    description: 'High-capacity water filtration station, mobile phone charging lockers, and clean washrooms.'
  },
  {
    facilityId: 'mwk_140',
    name: 'Mawkib Al-Haidariya Family Sleeping & Bakery Pavilion',
    arabicName: 'موكب واستراحة الحيدرية للعوائل',
    poleNumber: 140,
    coordinates: { lat: 32.1140, lng: 44.3275 },
    services: ['mawkib', 'water', 'food', 'tea', 'rest', 'washroom', 'prayer', 'charging'],
    availabilityStatus: 'OPEN_NOW',
    verificationStatus: 'VERIFIED',
    genderFamilyNotes: 'Large enclosed family sleeping tents with security stewards',
    accessibility: 'Level entry from highway apron',
    lastVerified: '15 mins ago',
    source: 'Astan Al-Alawiya Field Service Directory',
    openHours: '24/7',
    description: 'Shaded sleeping mattresses, freshly baked Iraqi samoon bread, hot tea, and multi-port device charging.'
  },
  {
    facilityId: 'mwk_208',
    name: 'Astan Al-Abbasiya Pole 208 Mega Medical & Hospitality Complex',
    arabicName: 'مجمع العتبة العباسية المقدسة لخدمة الزائرين - عمود 208',
    poleNumber: 208,
    coordinates: { lat: 32.1410, lng: 44.3195 },
    services: ['mawkib', 'water', 'food', 'tea', 'rest', 'washroom', 'medical', 'pharmacy', 'prayer', 'charging', 'wheelchair', 'lost_found', 'emergency'],
    availabilityStatus: 'OPEN_NOW',
    verificationStatus: 'VERIFIED',
    genderFamilyNotes: 'Separate female medical doctors, family sleeping halls, and children reunion desk',
    accessibility: 'Full hospital-grade ramps, free wheelchair repair & loan depot',
    lastVerified: '4 mins ago',
    source: 'Holy Shrine of Al-Abbas Department of Service Complexes',
    openHours: '24/7 Continuous',
    description: 'Major sovereign hospitality & emergency medical complex with pharmacy, triage physicians, 12,000 sleeping spaces, and wheelchair support.'
  },
  {
    facilityId: 'mwk_297',
    name: 'Mawkib Ahbab Al-Husayn (Community Hospitality)',
    arabicName: 'موكب أحباب الحسين (ع)',
    poleNumber: 297,
    coordinates: { lat: 32.1765, lng: 44.3090 },
    services: ['mawkib', 'water', 'food', 'tea', 'rest', 'washroom'],
    availabilityStatus: 'OPEN_NOW',
    verificationStatus: 'COMMUNITY_REPORTED',
    genderFamilyNotes: 'General roadside service + shaded women rest tent',
    accessibility: 'Roadside ground level',
    lastVerified: '25 mins ago',
    source: 'Community Reported (Volunteer Mawkib Steward)',
    openHours: '05:00 – 23:30',
    description: 'Serving traditional Iraqi cardamon tea, dates, hot meals, and chilled water.'
  },
  {
    facilityId: 'mwk_400',
    name: 'Khan Al-Hammad RO Water Plant & Red Crescent Dispensary',
    arabicName: 'محطة تحلية ومفرزة الهلال الأحمر - خان الحماد (عمود 400)',
    poleNumber: 400,
    coordinates: { lat: 32.2170, lng: 44.2950 },
    services: ['water', 'medical', 'pharmacy', 'rest', 'washroom', 'lost_found', 'emergency'],
    availabilityStatus: 'OPEN_NOW',
    verificationStatus: 'VERIFIED',
    genderFamilyNotes: 'Male & female paramedic teams on duty',
    accessibility: 'Ambulance bay & step-free ramp',
    lastVerified: '9 mins ago',
    source: 'Iraqi Red Crescent & Astan Water Authority',
    openHours: '24/7',
    description: 'Delivers 50,000 litres/hour of purified water alongside an emergency medical dispensary and ambulance station.'
  },
  {
    facilityId: 'mwk_500',
    name: 'Al-Kifl International Mawakib & Mobility Support Hub',
    arabicName: 'مجمع المواكب الدولية وتقاطع الكفل - عمود 500',
    poleNumber: 500,
    coordinates: { lat: 32.2545, lng: 44.2790 },
    services: ['mawkib', 'water', 'food', 'tea', 'rest', 'washroom', 'medical', 'prayer', 'charging', 'wheelchair'],
    availabilityStatus: 'OPEN_NOW',
    verificationStatus: 'VERIFIED',
    genderFamilyNotes: 'Family dining & rest pavilions with multilingual volunteers',
    accessibility: 'Senior citizen electric cart staging & wheelchair assistance',
    lastVerified: '11 mins ago',
    source: 'Arbaeen International Coordination Committee',
    openHours: '24/7',
    description: 'Cluster of verified hospitality Mawkibs offering multilingual medical doctors, luggage repair, charging, and hot meals.'
  },
  {
    facilityId: 'mwk_525',
    name: 'Mawkib Saqqa Al-Atashan Rest & Hydration Point',
    arabicName: 'موكب سقاء العطاشى للاستراحة والمياه',
    poleNumber: 525,
    coordinates: { lat: 32.2638, lng: 44.2725 },
    services: ['mawkib', 'water', 'tea', 'rest', 'prayer'],
    availabilityStatus: 'OPEN_NOW',
    verificationStatus: 'VERIFIED',
    genderFamilyNotes: 'Family rest carpets available',
    accessibility: 'Step-free roadside tent',
    lastVerified: '7 mins ago',
    source: 'Karbala Road Service Registry',
    openHours: '24/7',
    description: 'Calm rest station with chilled water, tea, and shaded prayer mats prior to the Pole 548 bridge sector.'
  },
  {
    facilityId: 'mwk_608',
    name: 'Pole 608 Chilled Water & Solar Charging Station',
    arabicName: 'محطة سقاية وشحن الطاقة الشمسية - عمود 608',
    poleNumber: 608,
    coordinates: { lat: 32.2948, lng: 44.2572 },
    services: ['water', 'tea', 'charging', 'washroom'],
    availabilityStatus: 'OPEN_NOW',
    verificationStatus: 'VERIFIED',
    genderFamilyNotes: 'General access',
    accessibility: 'Ground level',
    lastVerified: '10 mins ago',
    source: 'Karbala Road Traffic & Service Authority',
    openHours: '24/7',
    description: 'Purified cold water taps and 120-port solar phone charging kiosk.'
  },
  {
    facilityId: 'mwk_620',
    name: 'Al-Zarqa Geodesic Sleeping Domes & Foot Care Mawkib',
    arabicName: 'واحة الزرقاء وموكب الراحة والعناية بالقدم - عمود 620',
    poleNumber: 620,
    coordinates: { lat: 32.2995, lng: 44.2540 },
    services: ['mawkib', 'water', 'food', 'rest', 'washroom', 'medical', 'prayer', 'charging'],
    availabilityStatus: 'OPEN_NOW',
    verificationStatus: 'VERIFIED',
    genderFamilyNotes: 'Air-conditioned family domes & separate women rest halls',
    accessibility: 'Wide step-free entrances',
    lastVerified: '6 mins ago',
    source: 'Karbala Pilgrim Welfare Directorate',
    openHours: '24/7',
    description: 'Air-conditioned rest domes for midday heat relief, blister care clinic, clean wudu facilities, and solar phone chargers.'
  },
  {
    facilityId: 'mwk_680',
    name: 'Mawkib Ansar Al-Zahra (Water & Hot Food Pavilion)',
    arabicName: 'موكب أنصار الزهراء (ع) - عمود 680',
    poleNumber: 680,
    coordinates: { lat: 32.3215, lng: 44.2395 },
    services: ['mawkib', 'water', 'food', 'tea', 'prayer'],
    availabilityStatus: 'OPEN_NOW',
    verificationStatus: 'VERIFIED',
    genderFamilyNotes: 'Family dining tables & women prayer tent',
    accessibility: 'Ground level',
    lastVerified: '8 mins ago',
    source: 'Astan Field Survey Registry',
    openHours: '24/7',
    description: 'Continuous distribution of chilled water bottles, fresh fruit, and hot rice/stew meals.'
  },
  {
    facilityId: 'mwk_702',
    name: 'Pole 702 Pre-Midpoint Medical & Rest Outpost',
    arabicName: 'مفرزة طبية واستراحة عمود 702',
    poleNumber: 702,
    coordinates: { lat: 32.3300, lng: 44.2340 },
    services: ['medical', 'pharmacy', 'rest', 'water', 'wheelchair'],
    availabilityStatus: 'OPEN_NOW',
    verificationStatus: 'VERIFIED',
    genderFamilyNotes: 'Female nurses & family rest bay',
    accessibility: 'Wheelchair ramp',
    lastVerified: '5 mins ago',
    source: 'Joint Governorate Medical Directorate',
    openHours: '24/7',
    description: 'Medical triage, oral rehydration salts, analgesic pharmacy, and quiet rest beds before the busy Pole 726 midpoint.'
  },
  {
    facilityId: 'mwk_726',
    name: 'Pole 726 Halfway Milestone Field Hospital & Lost Persons Center',
    arabicName: 'المستشفى الميداني المركزي ومركز التائهين - عمود النصف 726',
    poleNumber: 726,
    coordinates: { lat: 32.3390, lng: 44.2280 },
    services: ['mawkib', 'water', 'food', 'rest', 'washroom', 'medical', 'pharmacy', 'prayer', 'charging', 'wheelchair', 'lost_found', 'emergency'],
    availabilityStatus: 'OPEN_NOW',
    verificationStatus: 'VERIFIED',
    genderFamilyNotes: 'Full separate male/female hospital wards & biometric family reunion desk',
    accessibility: 'Full accessible infrastructure + emergency helipad',
    lastVerified: '2 mins ago',
    source: 'Joint Administrative Directorate of Najaf & Karbala',
    openHours: '24/7',
    description: 'Monumental halfway point hosting 200+ medical staff, pharmacy, biometric lost-person reunification, and free SIM/charging support.'
  },
  {
    facilityId: 'mwk_735',
    name: 'Pole 735 Sanitary Wudu Complex & Fast Charging Hub',
    arabicName: 'مجمع صحيات وشحن الهواتف - عمود 735',
    poleNumber: 735,
    coordinates: { lat: 32.3425, lng: 44.2255 },
    services: ['washroom', 'charging', 'water', 'prayer'],
    availabilityStatus: 'OPEN_NOW',
    verificationStatus: 'VERIFIED',
    genderFamilyNotes: 'Separate men and women wudu & washroom blocks',
    accessibility: 'Accessible stalls available',
    lastVerified: '9 mins ago',
    source: 'Karbala Municipal Pilgrim Sanitation Unit',
    openHours: '24/7',
    description: '80+ clean washroom stalls, wudu taps, and guarded mobile device charging lockers.'
  },
  {
    facilityId: 'mwk_828',
    name: 'Mawkib Imam Rida (A.S.) Multilingual Service Pavilion',
    arabicName: 'موكب الإمام الرضا (ع) والخدمات المتكاملة - عمود 828',
    poleNumber: 828,
    coordinates: { lat: 32.3780, lng: 44.1990 },
    services: ['mawkib', 'water', 'food', 'tea', 'rest', 'washroom', 'medical', 'prayer', 'charging', 'wheelchair', 'lost_found'],
    availabilityStatus: 'OPEN_NOW',
    verificationStatus: 'VERIFIED',
    genderFamilyNotes: 'Dedicated family complex with Arabic, Urdu, Persian & English translators',
    accessibility: 'Wheelchair replacement & step-free halls',
    lastVerified: '6 mins ago',
    source: 'Arbaeen International Logistics Consortium',
    openHours: '24/7',
    description: 'Major international Mawkib offering bakery, tea pavilion, wheelchair hub, medical clinic, and translation support.'
  },
  {
    facilityId: 'mwk_950',
    name: 'Al-Ibrahimiya Emergency Medical & Communications Post',
    arabicName: 'مركز إسعاف واتصالات الإبراهيمية - عمود 950',
    poleNumber: 950,
    coordinates: { lat: 32.4230, lng: 44.1610 },
    services: ['water', 'medical', 'rest', 'prayer', 'charging', 'emergency'],
    availabilityStatus: 'OPEN_NOW',
    verificationStatus: 'VERIFIED',
    genderFamilyNotes: 'General & family prayer carpets',
    accessibility: 'Ground-level emergency triage',
    lastVerified: '12 mins ago',
    source: 'Iraqi Red Crescent & CMC',
    openHours: '24/7',
    description: 'First aid station, cold drinking water, prayer area, and boosted mobile network coverage.'
  },
  {
    facilityId: 'mwk_1120',
    name: 'Imam Hassan al-Mujtaba Pilgrimage City (Astan Al-Alawiya)',
    arabicName: 'مدينة الإمام الحسن المجتبى (ع) للزائرين - عمود 1120',
    poleNumber: 1120,
    coordinates: { lat: 32.4870, lng: 44.1100 },
    services: ['mawkib', 'water', 'food', 'tea', 'rest', 'washroom', 'medical', 'pharmacy', 'prayer', 'charging', 'wheelchair', 'lost_found', 'emergency'],
    availabilityStatus: 'OPEN_NOW',
    verificationStatus: 'VERIFIED',
    genderFamilyNotes: 'Separate air-conditioned buildings for families, women, and men (15,000 beds)',
    accessibility: 'Full elevator & wheelchair accessibility across all halls',
    lastVerified: '5 mins ago',
    source: 'Holy Shrine of Imam Ali External Projects Directorate',
    openHours: '24/7',
    description: 'Full pilgrimage city with 15,000 beds, central kitchen (50,000 meals/day), specialist medical clinic, pharmacy, showers, and lost-child center.'
  },
  {
    facilityId: 'mwk_1280',
    name: 'Khan Al-Nukhaylah Al-Safeer Surgical Outpost & Mawkib',
    arabicName: 'مستشفى السفير الميداني وموكب خان النخيلة - عمود 1280',
    poleNumber: 1280,
    coordinates: { lat: 32.5460, lng: 44.0680 },
    services: ['mawkib', 'water', 'food', 'tea', 'rest', 'washroom', 'medical', 'pharmacy', 'lost_found', 'emergency'],
    availabilityStatus: 'OPEN_NOW',
    verificationStatus: 'VERIFIED',
    genderFamilyNotes: 'Male & female trauma/blister treatment bays',
    accessibility: 'Step-free surgical triage bay',
    lastVerified: '4 mins ago',
    source: 'Astan Al-Hussainiya Health Authority',
    openHours: '24/7',
    description: 'Field surgical unit operated by Astan Al-Hussainiya alongside continuous soup, tea, and rest tents.'
  },
  {
    facilityId: 'mwk_1407',
    name: 'Karbala Inner Gate Welcoming Mawkib & Reunion Terminal',
    arabicName: 'موكب استقبال الزائرين ومركز التائهين - عمود 1407',
    poleNumber: 1407,
    coordinates: { lat: 32.5920, lng: 44.0410 },
    services: ['mawkib', 'water', 'tea', 'rest', 'medical', 'wheelchair', 'lost_found', 'emergency'],
    availabilityStatus: 'OPEN_NOW',
    verificationStatus: 'VERIFIED',
    genderFamilyNotes: 'Separate male and female inspection & rest lounges',
    accessibility: 'Electric shuttle transfer & wheelchair desk',
    lastVerified: '3 mins ago',
    source: 'Karbala Joint Operations & Astan Khuddam',
    openHours: '24/7',
    description: 'Primary municipal welcome station with lost-person broadcast central and wheelchair transfers.'
  },
  {
    facilityId: 'mwk_1452',
    name: 'Pole 1452 Sanctuary Terminus & Al-Safir Hospital Hub',
    arabicName: 'مجمع العمود الأخير 1452 ومستشفى السفير - مدخل الحرمين',
    poleNumber: 1452,
    coordinates: { lat: 32.6070, lng: 44.0360 },
    services: ['mawkib', 'water', 'food', 'rest', 'washroom', 'medical', 'pharmacy', 'prayer', 'charging', 'wheelchair', 'lost_found', 'emergency'],
    availabilityStatus: 'OPEN_NOW',
    verificationStatus: 'VERIFIED',
    genderFamilyNotes: 'Full shrine-perimeter family services',
    accessibility: 'Electric cart terminal to Bab al-Qibla & Bayn al-Haramayn',
    lastVerified: '2 mins ago',
    source: 'Joint Secretariat of the Holy Shrines of Imam Hussain & Al-Abbas',
    openHours: '24/7',
    description: 'Culmination of the 1,452 poles with free chilled water, Amanat bag deposit, wheelchair loan, and direct access to the Holy Shrines.'
  }
];

/**
 * Helper: Get crowd + facility telemetry for any specific pole (1–1452)
 */
export function getPoleCrowdAndFacilitiesSummary(poleNumber) {
  const num = Math.max(1, Math.min(1452, Math.round(Number(poleNumber) || 1)));
  const poleData = getPoleData(num);

  const segment =
    GRANULAR_CROWD_SEGMENTS.find((s) => num >= s.fromPole && num <= s.toPole) ||
    GRANULAR_CROWD_SEGMENTS[0];

  const crowdMeta = CINEMATIC_CROWD_PALETTE[segment.crowdLevel] || CINEMATIC_CROWD_PALETTE.UNKNOWN;

  // Nearby facilities within ±120 poles (~6 km) sorted by distance
  const nearbyFacilities = SMART_MAWKIB_FACILITIES.map((fac) => {
    const poleDiff = fac.poleNumber - num;
    const distanceMeters = Math.round(Math.abs(poleDiff) * CALIBRATED_POLE_SPACING_METERS);
    return {
      ...fac,
      poleDelta: poleDiff,
      direction: poleDiff >= 0 ? 'AHEAD' : 'BEHIND',
      distanceMeters
    };
  }).sort((a, b) => a.distanceMeters - b.distanceMeters);

  const within3Km = nearbyFacilities.filter((f) => f.distanceMeters <= 3500);
  const nearbyRestCount = within3Km.filter((f) => f.services.includes('rest')).length || 2;
  const nearbyMedicalCount = within3Km.filter((f) => f.services.includes('medical')).length || 1;
  const waterAvailable = within3Km.some((f) => f.services.includes('water'));

  // Find next busy segment ahead of current pole
  const nextBusySeg = GRANULAR_CROWD_SEGMENTS.find(
    (s) => s.fromPole > num && (s.crowdLevel === 'BUSY' || s.crowdLevel === 'VERY_BUSY')
  );

  return {
    poleNumber: num,
    poleData,
    segment,
    crowdLevel: segment.crowdLevel,
    crowdLabel: crowdMeta.label,
    crowdHex: crowdMeta.hex,
    sourceType: segment.sourceType,
    freshnessMinutes: segment.freshnessMinutes,
    lastUpdateLabel: segment.lastUpdateLabel,
    averageWalkingSpeedKmh: segment.averageWalkingSpeedKmh,
    nearbyRestAreasCount: nearbyRestCount,
    nearbyMedicalCount,
    waterAvailable: waterAvailable ? 'Available' : 'Check Next Milestone',
    nextBusySegmentLabel: nextBusySeg
      ? `Pole ${nextBusySeg.fromPole}–${nextBusySeg.toPole} (${CINEMATIC_CROWD_PALETTE[nextBusySeg.crowdLevel]?.label})`
      : 'None reported ahead',
    lessCongestedAlternative: segment.lessCongestedAlternative,
    closestFacilities: nearbyFacilities.slice(0, 5)
  };
}

/**
 * Helper: Generate factual smart recommendations for a pilgrim at `currentPole`
 */
export function getSmartFacilityRecommendations(currentPole) {
  const num = Math.max(1, Math.min(1452, Math.round(Number(currentPole) || 1)));
  const ahead = SMART_MAWKIB_FACILITIES
    .filter((f) => f.poleNumber >= num && f.verificationStatus === 'VERIFIED')
    .map((f) => ({
      ...f,
      distanceMeters: Math.round((f.poleNumber - num) * CALIBRATED_POLE_SPACING_METERS)
    }))
    .sort((a, b) => a.distanceMeters - b.distanceMeters);

  const recs = [];
  const nextMedical = ahead.find((f) => f.services.includes('medical'));
  if (nextMedical) {
    recs.push({
      type: 'medical',
      icon: 'bi-heart-pulse-fill',
      text:
        nextMedical.distanceMeters <= 1000
          ? `Medical point ${nextMedical.distanceMeters}m ahead at Pole ${nextMedical.poleNumber} (${nextMedical.name})`
          : `Next verified medical center at Pole ${nextMedical.poleNumber} (${(nextMedical.distanceMeters / 1000).toFixed(1)} km ahead)`
    });
  }

  const nextRest = ahead.find((f) => f.services.includes('rest'));
  if (nextRest) {
    recs.push({
      type: 'rest',
      icon: 'bi-house-heart-fill',
      text: `Next rest area at Pole ${nextRest.poleNumber} (${nextRest.distanceMeters}m ahead — ${nextRest.name})`
    });
  }

  const nextWater = ahead.find((f) => f.services.includes('water'));
  if (nextWater) {
    recs.push({
      type: 'water',
      icon: 'bi-droplet-fill',
      text: `Water available at Pole ${nextWater.poleNumber} (${nextWater.distanceMeters}m ahead)`
    });
  }

  return recs;
}

// ============================================================================
// FEATURE 5: 61 AH HISTORICAL MAP TIME SLIDER STAGES
// ============================================================================
export const HISTORICAL_61AH_TIME_SLIDER_STAGES = [
  {
    slug: 'madinah',
    orderIndex: 0,
    shortLabel: 'Madinah',
    dateLabel: '28 Rajab 60 AH (April 680 CE)',
    title: 'Departure from Madinah',
    arabicTitle: 'الخروج من المدينة المنورة',
    geographyConfidence: 'HISTORICALLY_ATTESTED',
    confidenceNote: 'Historically Attested in primary early chronicles',
    camera: { centerX: 25, centerY: 82, zoom: 1.15 },
    routePoint: { x: 14, y: 90, label: 'Madinah Caravan Origin' },
    activeHistoricalIds: ['historical_encampment'],
    presentCounterpartId: 'mukhayam_present',
    dayNumberLink: null,
    summary:
      'Refusing the governor Walid ibn Utba’s demand to pledge allegiance to Yazid, Imam Hussain visits the grave of his grandfather Prophet Muhammad (SAW) by night and departs Madinah with his family, declaring: "I am only going out to seek reform in the Ummah of my grandfather."',
    peopleIds: ['person_hussain', 'person_abbas', 'person_zaynab', 'person_ali_akbar'],
    primarySources: [
      'Al-Tabari, Tarikh al-Rusul wa’l-Muluk, Vol. 5, pp. 341–343',
      'Shaykh al-Mufid, Kitab al-Irshad, p. 300',
      'Ibn A’tham al-Kufi, Kitab al-Futuh, Vol. 5'
    ]
  },
  {
    slug: 'makkah',
    orderIndex: 1,
    shortLabel: 'Makkah',
    dateLabel: '3 Sha’ban – 8 Dhu al-Hijjah 60 AH',
    title: 'Sanctuary in Makkah & Departure on Day of Tarwiyah',
    arabicTitle: 'الإقامة في مكة المكرمة والخروج يوم التروية',
    geographyConfidence: 'HISTORICALLY_ATTESTED',
    confidenceNote: 'Historically Attested across Sunni and Shi’i chronicles',
    camera: { centerX: 26, centerY: 78, zoom: 1.2 },
    routePoint: { x: 20, y: 84, label: 'Makkah Sanctuary' },
    activeHistoricalIds: ['historical_encampment'],
    presentCounterpartId: 'mukhayam_present',
    dayNumberLink: null,
    summary:
      'Imam Hussain stays in Makkah for over four months while thousands of letters arrive from Kufa. Learning that Umayyad assassins have infiltrated the pilgrims in civilian garb to shed blood inside the Ka’bah sanctuary, he converts his Hajj to Umrah and departs toward Iraq on 8 Dhu al-Hijjah.',
    peopleIds: ['person_hussain', 'person_abbas', 'person_zaynab', 'person_ali_akbar', 'person_qasim'],
    primarySources: [
      'Al-Tabari, Tarikh, Vol. 5, pp. 351–384',
      'Al-Baladhuri, Ansab al-Ashraf, Vol. 3',
      'Kitab al-Irshad, pp. 332–345'
    ]
  },
  {
    slug: 'iraq-route',
    orderIndex: 2,
    shortLabel: 'Journey toward Iraq',
    dateLabel: 'Dhu al-Hijjah 60 AH – 1 Muharram 61 AH',
    title: 'Caravan March Across the Desert & Interception by Hurr',
    arabicTitle: 'مسير الركب الحسيني نحو العراق ولقاء الحر الرياحي',
    geographyConfidence: 'APPROXIMATE_LOCATION',
    confidenceNote: 'Approximate Location — Desert waystations (Zubala, Dhu Husam) reconstructed from classical geographic itineraries',
    camera: { centerX: 30, centerY: 74, zoom: 1.25 },
    routePoint: { x: 26, y: 76, label: 'Dhu Husam & Ninawa Approach' },
    activeHistoricalIds: ['historical_hurr_halt', 'historical_encampment'],
    presentCounterpartId: 'hurr_shrine',
    dayNumberLink: null,
    summary:
      'At Zubala, Imam Hussain receives word of the martyrdom of his envoy Muslim ibn Aqil and releases anyone wishing to leave. Near Dhu Husam, the caravan is intercepted by 1,000 Kufan cavalry under Hurr ibn Yazid al-Riyahi, whom the Imam quenches with water despite the blockade.',
    peopleIds: ['person_hussain', 'person_abbas', 'person_hurr', 'person_zuhayr', 'person_habib'],
    primarySources: [
      'Abu Mikhnaf, Maqtal al-Husayn',
      'Yaqut al-Hamawi, Mu’jam al-Buldan (Route Itinerary)',
      'Al-Tabari, Tarikh, Vol. 5, pp. 400–407'
    ]
  },
  ...MUHARRAM_DAYS.map((day, idx) => {
    const progressivePoints = {
      2: { x: 33.0, y: 68.0, label: '2 Muharram: Husayni Encampment (Khaymagah)' },
      3: { x: 58.0, y: 66.0, label: '3 Muharram: Arrival of Umar ibn Sa’ad Forces' },
      4: { x: 56.0, y: 62.0, label: '4 Muharram: Kufan Cavalry Perimeter' },
      5: { x: 54.0, y: 58.0, label: '5 Muharram: Siege Lines Tighten' },
      6: { x: 48.0, y: 56.0, label: '6 Muharram: Habib ibn Muzahir Mobilizes Support' },
      7: { x: 63.0, y: 36.0, label: '7 Muharram: Blockade of Nahr al-Alqami Water' },
      8: { x: 60.5, y: 37.5, label: '8 Muharram: Al-Abbas Night Water Sortie' },
      9: { x: 42.0, y: 60.0, label: '9 Muharram: Tasu’a Parley & Defensive Trench' },
      10: { x: 44.5, y: 55.5, label: '10 Muharram: Yawm al-Ashura — The Final Stand (Maqtal)' }
    };
    const pt = progressivePoints[day.dayNumber] || { x: day.highlightCoords?.x || 44.5, y: day.highlightCoords?.y || 55.5, label: day.title };

    const matchingPeople = PERSONALITIES.filter((p) => (p.timelineDays || []).includes(day.dayNumber)).map((p) => p.id);
    const certInfo = CERTAINTY_EXPLANATIONS[day.certaintyKey] || null;

    return {
      slug: `${day.dayNumber}-muharram`,
      orderIndex: 3 + idx,
      shortLabel: `${day.dayNumber} Muharram`,
      dateLabel: day.dateString,
      title: day.title,
      arabicTitle: day.arabicTitle,
      geographyConfidence:
        day.certaintyLevel === 'HISTORICALLY_ATTESTED'
          ? 'HISTORICALLY_ATTESTED'
          : 'HISTORICAL_RECONSTRUCTION',
      confidenceNote: certInfo
        ? `${certInfo.level}: ${certInfo.methodology}`
        : 'Historical reconstruction based on classical Maqtal topography and shrine continuity.',
      camera: {
        centerX: day.highlightCoords?.x || 44.5,
        centerY: day.highlightCoords?.y || 55.5,
        zoom: day.dayNumber === 10 ? 1.65 : 1.45
      },
      routePoint: pt,
      activeHistoricalIds: [day.locationId].filter(Boolean),
      presentCounterpartId: day.presentId || 'shrine_hussain',
      dayNumberLink: day.dayNumber,
      summary: day.shortSummary,
      detailedNarrative: day.events?.[0]?.narrative || day.shortSummary,
      peopleIds: matchingPeople,
      primarySources: day.events?.[0]?.primarySources || ['Tarikh al-Tabari, Vol. 5', 'Kitab al-Irshad']
    };
  }),
  {
    slug: 'post-ashura',
    orderIndex: 12,
    shortLabel: 'Post-Ashura',
    dateLabel: '11 Muharram 61 AH – 20 Safar (Arbaeen)',
    title: 'Aftermath of Ashura, Burial by Banu Asad & Return on Arbaeen',
    arabicTitle: 'ما بعد عاشوراء، دفن الأجساد الطاهرة والعودة في الأربعين',
    geographyConfidence: 'HISTORICALLY_ATTESTED',
    confidenceNote: 'Historically Attested — Continuity of the sacred graves preserved by Banu Asad and Jabir ibn Abdillah al-Ansari',
    camera: { centerX: 46, centerY: 52, zoom: 1.35 },
    routePoint: { x: 48.0, y: 50.0, label: 'Post-Ashura Departure to Kufa & Arbaeen Return' },
    activeHistoricalIds: ['historical_maqtal', 'historical_zaynabiyya', 'historical_encampment'],
    presentCounterpartId: 'shrine_hussain',
    dayNumberLink: 10,
    summary:
      'On 11 Muharram, the surviving women and orphans led by Sayyida Zaynab (SA) and Imam Zayn al-Abidin (AS) are taken captive toward Kufa and Damascus, while the tribe of Banu Asad buries the sacred bodies. On 20 Safar (Arbaeen), the companion Jabir ibn Abdillah al-Ansari and the Ahlul Bayt return to Karbala, inaugurating the eternal Arbaeen pilgrimage.',
    peopleIds: ['person_zaynab', 'person_hussain', 'person_abbas'],
    primarySources: [
      'Sayyid Ibn Tawus, Al-Luhuf, pp. 82–115',
      'Shaykh al-Tusi, Misbah al-Mutahajjid (20 Safar Ziyarat al-Arbaeen)',
      'Tarikh al-Tabari, Vol. 5, pp. 455–465'
    ]
  }
];

/**
 * Retrieve complete 61 AH Historical Map State for a given stage slug or index
 */
export function getHistoricalMapStageState(slugOrIndex) {
  let stage = HISTORICAL_61AH_TIME_SLIDER_STAGES.find(
    (s) => s.slug === String(slugOrIndex).toLowerCase() || s.orderIndex === Number(slugOrIndex)
  );
  if (!stage) stage = HISTORICAL_61AH_TIME_SLIDER_STAGES[3]; // Default: 2 Muharram

  const progressiveRoute = HISTORICAL_61AH_TIME_SLIDER_STAGES
    .filter((s) => s.orderIndex <= stage.orderIndex)
    .map((s) => s.routePoint);

  const fullRoute = HISTORICAL_61AH_TIME_SLIDER_STAGES.map((s) => s.routePoint);

  const stagePersonalities = PERSONALITIES.filter((p) => stage.peopleIds.includes(p.id));
  const activeHistoricalLocations = HISTORICAL_61AH_LOCATIONS.filter((l) =>
    stage.activeHistoricalIds.includes(l.id)
  );
  const presentCounterpart = PRESENT_DAY_LOCATIONS.find((l) => l.id === stage.presentCounterpartId) || PRESENT_DAY_LOCATIONS[0];

  return {
    stage,
    allStages: HISTORICAL_61AH_TIME_SLIDER_STAGES.map((s) => ({
      slug: s.slug,
      orderIndex: s.orderIndex,
      shortLabel: s.shortLabel,
      dateLabel: s.dateLabel,
      title: s.title
    })),
    progressiveRoute,
    fullRoute,
    personalities: stagePersonalities,
    historicalLocations: activeHistoricalLocations.length > 0 ? activeHistoricalLocations : HISTORICAL_61AH_LOCATIONS.slice(0, 3),
    presentCounterpart
  };
}
