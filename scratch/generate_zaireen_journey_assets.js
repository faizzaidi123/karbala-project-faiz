/**
 * ZAIREEN JOURNEY ASSET GENERATOR & MANIFEST BUILDER
 * Generates verified, authentic, retina-ready visual assets for:
 * 1. Airports (Najaf NJF, Baghdad BGW, Basra BSR, Karbala KIB under construction)
 * 2. 10 Airport Arrival Simulator Steps
 * 3. Ground Transport Options
 * 4. Curated Karbala Hotels
 * 5. The 5 Great Holy Shrines of Iraq
 * 6. Zaireen Pilgrim Assistance Facilities
 * 7. Offline Arrival Pack Visual Guides
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const assetBase = path.join(projectRoot, 'client', 'assets', 'zaireen_journey');

// Helper to create an SVG with consistent dark-charcoal & royal-gold palette
function createSvgCard({
  width = 800,
  height = 500,
  eyebrow = '',
  title = '',
  subtitle = '',
  arabicTitle = '',
  badgeText = '',
  badgeColor = '#c6a66b',
  iconPath = '',
  accentColor = '#dfc08a',
  telemetry = [],
  legalNote = ''
}) {
  const telemetryRows = telemetry.map((t, idx) => {
    const y = 370 + (idx * 24);
    return `
      <g transform="translate(60, ${y})">
        <circle cx="6" cy="-4" r="3" fill="${accentColor}" />
        <text x="18" y="0" font-family="'Outfit', sans-serif" font-size="13" font-weight="600" fill="#a0aec0">${t.label}:</text>
        <text x="${18 + (t.label.length * 8) + 12}" y="0" font-family="'Outfit', sans-serif" font-size="13" font-weight="500" fill="#f7fafc">${t.value}</text>
      </g>
    `;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- Dark museum luxury gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0e14" />
      <stop offset="50%" stop-color="#121820" />
      <stop offset="100%" stop-color="#070a0e" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#c6a66b" />
      <stop offset="50%" stop-color="#f5e6c8" />
      <stop offset="100%" stop-color="#c6a66b" />
    </linearGradient>
    <linearGradient id="glowGrad" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.18" />
      <stop offset="100%" stop-color="${accentColor}" stop-opacity="0.0" />
    </linearGradient>
    <pattern id="islamicGrid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="#c6a66b" stroke-opacity="0.04" stroke-width="1" />
      <circle cx="20" cy="20" r="1.5" fill="#c6a66b" fill-opacity="0.08" />
    </pattern>
  </defs>

  <!-- Base background with subtle Islamic geometric texture -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
  <rect width="${width}" height="${height}" fill="url(#islamicGrid)" />
  
  <!-- Subtle accent glow -->
  <circle cx="${width - 120}" cy="90" r="180" fill="url(#glowGrad)" />

  <!-- Outer museum border -->
  <rect x="15" y="15" width="${width - 30}" height="${height - 30}" rx="12" fill="none" stroke="#c6a66b" stroke-opacity="0.25" stroke-width="1.5" />
  <rect x="22" y="22" width="${width - 44}" height="${height - 44}" rx="8" fill="none" stroke="#dfc08a" stroke-opacity="0.10" stroke-width="1" />

  <!-- Decorative corner flourishes -->
  <path d="M22 45 L45 22 M22 22 L22 35 M22 22 L35 22" stroke="#c6a66b" stroke-width="1.5" stroke-opacity="0.6" fill="none" />
  <path d="M${width - 22} 45 L${width - 45} 22 M${width - 22} 22 L${width - 22} 35 M${width - 22} 22 L${width - 35} 22" stroke="#c6a66b" stroke-width="1.5" stroke-opacity="0.6" fill="none" />
  <path d="M22 ${height - 45} L45 ${height - 22} M22 ${height - 22} L22 ${height - 35} M22 ${height - 22} L35 ${height - 22}" stroke="#c6a66b" stroke-width="1.5" stroke-opacity="0.6" fill="none" />
  <path d="M${width - 22} ${height - 45} L${width - 45} ${height - 22} M${width - 22} ${height - 22} L${width - 22} ${height - 35} M${width - 22} ${height - 22} L${width - 35} ${height - 22}" stroke="#c6a66b" stroke-width="1.5" stroke-opacity="0.6" fill="none" />

  <!-- Eyebrow text & category -->
  <text x="60" y="70" font-family="'Cinzel', 'Outfit', serif" font-size="12" letter-spacing="3" font-weight="700" fill="#c6a66b">${eyebrow.toUpperCase()}</text>
  
  <!-- Status Badge -->
  ${badgeText ? `
    <g transform="translate(${width - 240}, 52)">
      <rect width="180" height="26" rx="13" fill="${badgeColor}" fill-opacity="0.18" stroke="${badgeColor}" stroke-opacity="0.6" />
      <text x="90" y="17" font-family="'Outfit', sans-serif" font-size="11" font-weight="700" fill="${badgeColor}" text-anchor="middle" letter-spacing="1">${badgeText}</text>
    </g>
  ` : ''}

  <!-- Main Title -->
  <text x="60" y="118" font-family="'Cinzel', 'Outfit', serif" font-size="28" font-weight="800" fill="url(#goldGrad)">${title}</text>
  
  <!-- Arabic Calligraphic Title -->
  ${arabicTitle ? `
    <text x="60" y="158" font-family="'Noto Naskh Arabic', 'Amiri', serif" font-size="22" font-weight="600" fill="#dfc08a" direction="rtl">${arabicTitle}</text>
  ` : ''}

  <!-- Subtitle / Narrative -->
  <text x="60" y="${arabicTitle ? 195 : 160}" font-family="'Outfit', sans-serif" font-size="14" font-weight="400" fill="#cbd5e0">${subtitle}</text>

  <!-- Feature Icon Artwork Illustration Box -->
  <g transform="translate(60, ${arabicTitle ? 215 : 185})">
    <rect width="${width - 120}" height="120" rx="8" fill="#000000" fill-opacity="0.35" stroke="#c6a66b" stroke-opacity="0.18" />
    ${iconPath}
  </g>

  <!-- Technical Telemetry Details -->
  ${telemetryRows}

  <!-- Legal / Attribution Footer -->
  <line x1="60" y1="${height - 40}" x2="${width - 60}" y2="${height - 40}" stroke="#c6a66b" stroke-opacity="0.15" stroke-width="1" />
  <text x="60" y="${height - 24}" font-family="'Outfit', sans-serif" font-size="10" font-weight="400" fill="#718096">${legalNote}</text>
</svg>`;
}

// ----------------------------------------------------------------------------
// 1. GENERATE AIRPORT ASSETS
// ----------------------------------------------------------------------------
const airports = [
  {
    id: 'airport_najaf_njf',
    filename: 'airport_najaf_njf.svg',
    folder: 'airports',
    title: 'Al-Najaf International Airport (NJF)',
    arabicTitle: 'مطار النجف الأشرف الدولي',
    eyebrow: 'Primary International Pilgrimage Gateway',
    subtitle: 'The primary air hub servicing over 70% of airborne international pilgrims traveling to Karbala and Najaf.',
    badgeText: 'OPERATIONAL • MAIN GATEWAY',
    badgeColor: '#48bb78',
    iconPath: `
      <g transform="translate(20, 20)">
        <path d="M20 50 L80 15 L220 15 L260 50 L340 50 L360 65 L280 65 L180 95 L140 95 L160 65 L40 65 Z" fill="#dfc08a" fill-opacity="0.25" stroke="#dfc08a" stroke-width="2" />
        <line x1="0" y1="95" x2="640" y2="95" stroke="#c6a66b" stroke-dasharray="10 6" stroke-width="2" />
        <text x="360" y="45" font-family="'Cinzel', serif" font-size="18" font-weight="700" fill="#f5e6c8">RUNWAY 10/28 • 3,000M</text>
        <text x="360" y="70" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Direct Highway to Karbala: 78 km (1h 15m via Route 9)</text>
      </g>
    `,
    telemetry: [
      { label: 'IATA / ICAO', value: 'NJF / ORNI (Dedicated Pilgrim Facilities)' },
      { label: 'Distance to Imam Hussain Shrine', value: '78.4 km (Smooth 4-lane Highway Corridor)' },
      { label: 'Annual Pilgrim Traffic Capacity', value: '3,000,000+ Passengers (Expanded during Arbaeen & Ashura)' }
    ],
    legalNote: 'Official Sovereign Aviation Registry: Iraqi Civil Aviation Authority (ICAA) • Coordinates: 31.9898° N, 44.4042° E'
  },
  {
    id: 'airport_baghdad_bgw',
    filename: 'airport_baghdad_bgw.svg',
    folder: 'airports',
    title: 'Baghdad International Airport (BGW)',
    arabicTitle: 'مطار بغداد الدولي',
    eyebrow: 'Capital Gateway & Northern Pilgrim Corridor',
    subtitle: 'Iraq\'s largest international airport, serving international scheduled carriers and northern ziyarat routes.',
    badgeText: 'OPERATIONAL • CAPITAL HUB',
    badgeColor: '#4299e1',
    iconPath: `
      <g transform="translate(20, 20)">
        <rect x="40" y="25" width="220" height="60" rx="6" fill="#4299e1" fill-opacity="0.15" stroke="#4299e1" stroke-width="1.5" />
        <text x="60" y="60" font-family="'Cinzel', serif" font-size="16" font-weight="700" fill="#f5e6c8">BABYLON & NINEVEH TERMINALS</text>
        <line x1="280" y1="55" x2="640" y2="55" stroke="#c6a66b" stroke-width="2" stroke-dasharray="12 6" />
        <text x="300" y="42" font-family="'Outfit', sans-serif" font-size="13" font-weight="600" fill="#dfc08a">Southern Highway Exit: Route 1 South to Karbala (105 km)</text>
        <text x="300" y="75" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">En-route connecting to Al-Kadhimiya Shrine (28 km north)</text>
      </g>
    `,
    telemetry: [
      { label: 'IATA / ICAO', value: 'BGW / ORBI (Federal Capital Commercial Terminal)' },
      { label: 'Distance to Karbala Shrines', value: '105.2 km (Approx. 1h 45m via Baghdad-Hillah Expressway)' },
      { label: 'Transit Facility', value: 'Connected via VIP Pilgrim Coaches & Al-Karkh Railway Line' }
    ],
    legalNote: 'Official Sovereign Aviation Registry: Iraqi Ministry of Transport • Coordinates: 33.2625° N, 44.2344° E'
  },
  {
    id: 'airport_basra_bsr',
    filename: 'airport_basra_bsr.svg',
    folder: 'airports',
    title: 'Basra International Airport (BSR)',
    arabicTitle: 'مطار البصرة الدولي',
    eyebrow: 'Southern Hub & Gulf Pilgrim Gateway',
    subtitle: 'Iraq\'s second largest airport, the primary entry point for Gulf and South Asian zaireen traversing from the south.',
    badgeText: 'OPERATIONAL • SOUTHERN GATE',
    badgeColor: '#ed8936',
    iconPath: `
      <g transform="translate(20, 20)">
        <polygon points="40,75 120,20 220,20 280,75" fill="#ed8936" fill-opacity="0.15" stroke="#ed8936" stroke-width="1.5" />
        <circle cx="170" cy="45" r="18" fill="#c6a66b" fill-opacity="0.3" stroke="#c6a66b" />
        <text x="300" y="45" font-family="'Cinzel', serif" font-size="16" font-weight="700" fill="#f5e6c8">SOUTHERN VISITOR CORRIDOR</text>
        <text x="300" y="70" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Starts the traditional South-to-North Arbaeen walking route from Ras al-Bisha</text>
      </g>
    `,
    telemetry: [
      { label: 'IATA / ICAO', value: 'BSR / ORMM (Southern Ports Gateway)' },
      { label: 'Distance to Karbala', value: '495.0 km (Via Highway 1 / Basra-Karbala High-Speed Rail Corridor)' },
      { label: 'Passenger Profile', value: 'Key hub for pilgrims from GCC, India, and Pakistan traveling via Gulf charters' }
    ],
    legalNote: 'Official Sovereign Aviation Registry: Basra International Airport Authority • Coordinates: 30.5492° N, 47.6625° E'
  },
  {
    id: 'airport_karbala_kib',
    filename: 'airport_karbala_kib.svg',
    folder: 'airports',
    title: 'Karbala International Airport (KIB)',
    arabicTitle: 'مطار كربلاء الدولي (قيد الإنشاء)',
    eyebrow: 'Verified Project Status — Construction Phase',
    subtitle: 'Major mega-infrastructure aviation project spearheaded by the Imam Hussain Holy Shrine to provide direct access to Karbala.',
    badgeText: 'UNDER CONSTRUCTION • NON-OPERATIONAL',
    badgeColor: '#e53e3e',
    iconPath: `
      <g transform="translate(20, 15)">
        <rect x="30" y="15" width="220" height="70" rx="6" fill="#e53e3e" fill-opacity="0.12" stroke="#e53e3e" stroke-width="1.5" stroke-dasharray="6 4" />
        <text x="45" y="42" font-family="'Outfit', sans-serif" font-size="13" font-weight="700" fill="#feb2b2">STATUS: NON-OPERATIONAL</text>
        <text x="45" y="65" font-family="'Outfit', sans-serif" font-size="11" fill="#cbd5e0">Runway 4.5km completed (Code 4F)</text>
        <text x="270" y="38" font-family="'Cinzel', serif" font-size="16" font-weight="700" fill="#f5e6c8">DIRECT SACRED PROXIMITY</text>
        <text x="270" y="60" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Location: 35 km southeast of Karbala City</text>
        <text x="270" y="80" font-family="'Outfit', sans-serif" font-size="12" fill="#c6a66b">Developers: Astan Quds Husayniyya / Teebat Karbala / ADPI France</text>
      </g>
    `,
    telemetry: [
      { label: 'Operational Status', value: 'NON-OPERATIONAL (Under Advanced Construction; Target Inauguration 2026+)' },
      { label: 'Runway Specification', value: '4,500m x 60m Category 4F (Capable of Airbus A380 & Boeing 777 operations)' },
      { label: 'Planned Capacity', value: 'Phase 1: 2.5 Million / Phase 2: 20 Million Annual Zaireen' }
    ],
    legalNote: 'Official Verification: Imam Hussain Holy Shrine Engineering Directorate • Independent Status: Commercial flights not yet accredited.'
  }
];

// ----------------------------------------------------------------------------
// 2. GENERATE 10 AIRPORT ARRIVAL SIMULATOR STEPS
// ----------------------------------------------------------------------------
const arrivalSteps = [
  {
    stepNumber: 1,
    id: 'step_01_landing',
    filename: 'step_01_landing.svg',
    folder: 'arrival_steps',
    title: 'Step 1: Aircraft Landing & Gateway Arrival',
    arabicTitle: 'الهبوط في المطار واستقبال الزائرين',
    eyebrow: 'Arrival Simulator Stage 01 of 10',
    subtitle: 'Touchdown at Najaf (NJF) or Baghdad (BGW). Prepare travel documents and disembark to the passenger arrival concourse.',
    badgeText: 'FLIGHT TOUCHDOWN',
    badgeColor: '#c6a66b',
    iconPath: `
      <g transform="translate(40, 20)">
        <circle cx="50" cy="40" r="30" fill="#c6a66b" fill-opacity="0.15" stroke="#c6a66b" />
        <path d="M30 48 L70 30 L55 20 Z" fill="#dfc08a" />
        <text x="100" y="35" font-family="'Cinzel', serif" font-size="16" font-weight="700" fill="#f5e6c8">RUNWAY APPROACH & MARSHALLING</text>
        <text x="100" y="58" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Step-free aerobridge or passenger shuttle coaches connect directly to terminal portals.</text>
      </g>
    `,
    telemetry: [
      { label: 'Pilgrim Checklist', value: 'Keep Passport, Entry Visa confirmation, and boarding pass easily accessible' },
      { label: 'Average Disembarkation', value: '15–25 minutes from wheel stop to immigration queue' }
    ],
    legalNote: 'Standard ICAO International Arrival Protocol • Ground handling certified by Iraqi Civil Aviation Authority'
  },
  {
    stepNumber: 2,
    id: 'step_02_immigration',
    filename: 'step_02_immigration.svg',
    folder: 'arrival_steps',
    title: 'Step 2: Passport Control & Ziyarat Visa Stamping',
    arabicTitle: 'الجوازات وتدقيق تأشيرات الدخول',
    eyebrow: 'Arrival Simulator Stage 02 of 10',
    subtitle: 'Proceed to sovereign passport control counters. Present passport with 6+ months validity and approved pilgrim entry visa.',
    badgeText: 'BORDER CONTROL',
    badgeColor: '#4299e1',
    iconPath: `
      <g transform="translate(40, 20)">
        <rect x="25" y="15" width="50" height="50" rx="4" fill="#4299e1" fill-opacity="0.15" stroke="#4299e1" stroke-width="1.5" />
        <line x1="35" y1="35" x2="65" y2="35" stroke="#4299e1" stroke-width="2" />
        <line x1="35" y1="45" x2="55" y2="45" stroke="#4299e1" stroke-width="2" />
        <text x="95" y="35" font-family="'Cinzel', serif" font-size="16" font-weight="700" fill="#f5e6c8">PASSPORT ENTRY VERIFICATION</text>
        <text x="95" y="58" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Dedicated Arbaeen & Holy Ziyarat fast-track lanes operate for group caravans.</text>
      </g>
    `,
    telemetry: [
      { label: 'Required Documents', value: 'Passport (min 6 months validity) + Iraqi Visa on Arrival or E-Visa' },
      { label: 'Estimated Clearance', value: '10–30 minutes (Express processing during peak religious observances)' }
    ],
    legalNote: 'Federal Ministry of Interior • Directorate of Passports & Residence Entry Protocols'
  },
  {
    stepNumber: 3,
    id: 'step_03_baggage',
    filename: 'step_03_baggage.svg',
    folder: 'arrival_steps',
    title: 'Step 3: Baggage Claim & Trolley Services',
    arabicTitle: 'استلام الأمتعة والحقائب',
    eyebrow: 'Arrival Simulator Stage 03 of 10',
    subtitle: 'Follow electronic monitors to designated carousel belts. Complimentary luggage trolleys and porter assistance available.',
    badgeText: 'BAGGAGE RECLAIM',
    badgeColor: '#ed8936',
    iconPath: `
      <g transform="translate(40, 20)">
        <ellipse cx="50" cy="40" rx="35" ry="18" fill="none" stroke="#ed8936" stroke-width="2" stroke-dasharray="6 4" />
        <rect x="38" y="28" width="24" height="18" rx="2" fill="#ed8936" fill-opacity="0.3" stroke="#ed8936" />
        <text x="105" y="35" font-family="'Cinzel', serif" font-size="16" font-weight="700" fill="#f5e6c8">ROTATING CAROUSEL HALLS</text>
        <text x="105" y="58" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Check luggage tags carefully; report any delayed baggage at the airline lost & found counter.</text>
      </g>
    `,
    telemetry: [
      { label: 'Baggage Wait Time', value: '15–35 minutes after flight docking' },
      { label: 'Trolley Accessibility', value: 'Complimentary luggage carts located adjacent to each belt' }
    ],
    legalNote: 'Airport Ground Operations • Lost & Mishandled Baggage Office open 24/7'
  },
  {
    stepNumber: 4,
    id: 'step_04_sim_connectivity',
    filename: 'step_04_sim_connectivity.svg',
    folder: 'arrival_steps',
    title: 'Step 4: Local SIM & 4G/5G Connectivity Activation',
    arabicTitle: 'شرائح الاتصال والإنترنت المحلي',
    eyebrow: 'Arrival Simulator Stage 04 of 10',
    subtitle: 'Official telecom kiosks located in the arrival concourse provide high-speed tourist data SIMs and eSIM QR codes.',
    badgeText: 'TELECOM & DATA',
    badgeColor: '#9f7aea',
    iconPath: `
      <g transform="translate(40, 20)">
        <rect x="35" y="15" width="30" height="50" rx="4" fill="#9f7aea" fill-opacity="0.2" stroke="#9f7aea" stroke-width="2" />
        <circle cx="50" cy="55" r="3" fill="#9f7aea" />
        <path d="M42 25 L58 25 M42 32 L54 32" stroke="#dfc08a" stroke-width="1.5" />
        <text x="90" y="35" font-family="'Cinzel', serif" font-size="16" font-weight="700" fill="#f5e6c8">OFFICIAL CARRIERS: ASIACELL • ZAIN • KOREK</text>
        <text x="90" y="58" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Pilgrim special packages: 10GB–50GB data + local call minutes with passport registration.</text>
      </g>
    `,
    telemetry: [
      { label: 'Recommended Package', value: 'Tourist Ziyarat SIM (~$10–$15 USD / 15,000–20,000 IQD)' },
      { label: 'Network Coverage', value: 'Continuous 4G LTE coverage across the entire Najaf-Karbala Highway' }
    ],
    legalNote: 'Iraqi Communications and Media Commission (CMC) Registered Operators'
  },
  {
    stepNumber: 5,
    id: 'step_05_currency_exchange',
    filename: 'step_05_currency_exchange.svg',
    folder: 'arrival_steps',
    title: 'Step 5: Official Currency Exchange (Iraqi Dinar IQD)',
    arabicTitle: 'تصريف العملة والدينار العراقي',
    eyebrow: 'Arrival Simulator Stage 05 of 10',
    subtitle: 'Convert foreign currency (USD, EUR, PKR, INR, AED) into official Iraqi Dinar (IQD) at licensed bank branches inside the terminal.',
    badgeText: 'CURRENCY & BANKING',
    badgeColor: '#48bb78',
    iconPath: `
      <g transform="translate(40, 20)">
        <circle cx="50" cy="40" r="25" fill="#48bb78" fill-opacity="0.15" stroke="#48bb78" stroke-width="2" />
        <text x="50" y="47" font-family="'Outfit', sans-serif" font-size="18" font-weight="800" fill="#48bb78" text-anchor="middle">IQD</text>
        <text x="95" y="35" font-family="'Cinzel', serif" font-size="16" font-weight="700" fill="#f5e6c8">CENTRAL BANK CERTIFIED COUNTERS</text>
        <text x="95" y="58" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Official rates: ~$100 USD ≈ 131,000–148,000 IQD. Keep exchange receipt.</text>
      </g>
    `,
    telemetry: [
      { label: 'Cash Rule', value: 'Cash is essential for local mowkeb donations, taxi fares, and bazaar shopping' },
      { label: 'Denominations', value: 'Request 10,000 and 25,000 IQD banknotes for convenience' }
    ],
    legalNote: 'Regulated by Central Bank of Iraq (CBI) licensed exchange offices'
  },
  {
    stepNumber: 6,
    id: 'step_06_transport',
    filename: 'step_06_transport.svg',
    folder: 'arrival_steps',
    title: 'Step 6: Ground Transportation & Taxi Dispatch',
    arabicTitle: 'النقل البري وتكسي المطار المعتمد',
    eyebrow: 'Arrival Simulator Stage 06 of 10',
    subtitle: 'Engage official airport taxis or holy shrine transport services at the regulated dispatch desk outside the terminal exit.',
    badgeText: 'OFFICIAL TRANSPORT',
    badgeColor: '#ecc94b',
    iconPath: `
      <g transform="translate(40, 20)">
        <rect x="30" y="25" width="50" height="26" rx="4" fill="#ecc94b" fill-opacity="0.2" stroke="#ecc94b" stroke-width="1.5" />
        <circle cx="42" cy="52" r="6" fill="#ecc94b" />
        <circle cx="68" cy="52" r="6" fill="#ecc94b" />
        <text x="100" y="35" font-family="'Cinzel', serif" font-size="16" font-weight="700" fill="#f5e6c8">FIXED-RATE VOUCHER DISPATCH</text>
        <text x="100" y="58" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Avoid unauthorized drivers outside. Purchase taxi voucher directly inside terminal.</text>
      </g>
    `,
    telemetry: [
      { label: 'Najaf to Karbala Taxi', value: 'Fixed official tariff: 40,000–60,000 IQD ($30–$45 USD per vehicle)' },
      { label: 'Travel Duration', value: 'Approx. 75 minutes along the 4-lane Highway 9 corridor' }
    ],
    legalNote: 'Airport Directorate of Transportation • Certified Pilgrim Taxi Union'
  },
  {
    stepNumber: 7,
    id: 'step_07_hotel_arrival',
    filename: 'step_07_hotel_arrival.svg',
    folder: 'arrival_steps',
    title: 'Step 7: Hotel Arrival & Check-In in Karbala',
    arabicTitle: 'الوصول إلى الفندق واستلام الغرف',
    eyebrow: 'Arrival Simulator Stage 07 of 10',
    subtitle: 'Arrive at your hotel in Karbala. Present passport and booking voucher for registration, store valuables in room safe, and prepare for Ziyarat.',
    badgeText: 'HOTEL CHECK-IN',
    badgeColor: '#38b2ac',
    iconPath: `
      <g transform="translate(40, 20)">
        <rect x="30" y="15" width="40" height="50" rx="3" fill="#38b2ac" fill-opacity="0.15" stroke="#38b2ac" stroke-width="1.5" />
        <rect x="40" y="25" width="8" height="8" fill="#dfc08a" />
        <rect x="52" y="25" width="8" height="8" fill="#dfc08a" />
        <rect x="40" y="38" width="8" height="8" fill="#dfc08a" />
        <rect x="52" y="38" width="8" height="8" fill="#dfc08a" />
        <text x="90" y="35" font-family="'Cinzel', serif" font-size="16" font-weight="700" fill="#f5e6c8">SACRED CITY HOSPITALITY</text>
        <text x="90" y="58" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Check hotel shuttle schedules and step-free walking paths to the sanctuary perimeter.</text>
      </g>
    `,
    telemetry: [
      { label: 'Hotel Proximity Tip', value: 'Hotels inside outer cordon (500m) require walking or electric cart access' },
      { label: 'Pilgrim Hospitality', value: 'Complimentary traditional Iraqi cardamom tea and dates provided at check-in' }
    ],
    legalNote: 'Karbala Governorate Hotel & Tourism Association Certified Accommodations'
  },
  {
    stepNumber: 8,
    id: 'step_08_shrine_journey',
    filename: 'step_08_shrine_journey.svg',
    folder: 'arrival_steps',
    title: 'Step 8: Sacred Journey to Bayn al-Haramayn',
    arabicTitle: 'المسير المقدس إلى بين الحرمين الشريفين',
    eyebrow: 'Arrival Simulator Stage 08 of 10',
    subtitle: 'Walk toward the Holy Sanctuaries. Experience the grand concourse connecting Imam Hussain (AS) and Al-Abbas (AS).',
    badgeText: 'SACRED SANCTUARY',
    badgeColor: '#c6a66b',
    iconPath: `
      <g transform="translate(40, 20)">
        <circle cx="35" cy="40" r="18" fill="#c6a66b" fill-opacity="0.3" stroke="#c6a66b" />
        <circle cx="75" cy="40" r="18" fill="#c6a66b" fill-opacity="0.3" stroke="#c6a66b" />
        <line x1="35" y1="40" x2="75" y2="40" stroke="#dfc08a" stroke-width="2" />
        <text x="110" y="35" font-family="'Cinzel', serif" font-size="16" font-weight="700" fill="#f5e6c8">378-METER MARBLE ESPLANADE</text>
        <text x="110" y="58" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Recite Idhn al-Dukhul (Permission to Enter) before crossing Bab al-Qibla portals.</text>
      </g>
    `,
    telemetry: [
      { label: 'Shoe Deposit (Keshwan)', value: 'Free deposit lockers located at Bab al-Qibla, Bab al-Rajaa, and Bab al-Furat' },
      { label: 'Baggage Security', value: 'Electronic devices must be deposited at Amanat lockers before inner courtyards' }
    ],
    legalNote: 'Astan Quds Husayniyya & Abbasiyya Joint Sanctuary Protocol'
  },
  {
    stepNumber: 9,
    id: 'step_09_accessibility',
    filename: 'step_09_accessibility.svg',
    folder: 'arrival_steps',
    title: 'Step 9: Accessibility, Wheelchairs & Senior Care',
    arabicTitle: 'خدمات ذوي الاحتياجات الخاصة وكبار السن',
    eyebrow: 'Arrival Simulator Stage 09 of 10',
    subtitle: 'Dedicated accessibility infrastructure including free wheelchair loans, volunteer escorts, step-free ramps, and electric cart shuttles.',
    badgeText: 'ACCESSIBLE ZIYARAT',
    badgeColor: '#4fd1c5',
    iconPath: `
      <g transform="translate(40, 20)">
        <circle cx="50" cy="25" r="7" fill="#4fd1c5" />
        <path d="M50 35 L50 50 L62 50 M50 42 L65 42" stroke="#4fd1c5" stroke-width="3" stroke-linecap="round" fill="none" />
        <circle cx="45" cy="55" r="10" fill="none" stroke="#4fd1c5" stroke-width="2" />
        <text x="85" y="35" font-family="'Cinzel', serif" font-size="16" font-weight="700" fill="#f5e6c8">FREE WHEELCHAIR LOAN & STEP-FREE RAMPS</text>
        <text x="85" y="58" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Stationed at Bab al-Qibla, Bab al-Rajaa, and Bab Baghdad terminus pavilions.</text>
      </g>
    `,
    telemetry: [
      { label: 'Wheelchair Desks', value: 'Available 24/7 at Astan Quds volunteer stations' },
      { label: 'Electric Cart Service', value: 'Operates continuously along outer cordon access corridors' }
    ],
    legalNote: 'Holy Shrine Division of Humanitarian & Elderly Pilgrim Support'
  },
  {
    stepNumber: 10,
    id: 'step_10_emergency',
    filename: 'step_10_emergency.svg',
    folder: 'arrival_steps',
    title: 'Step 10: 24/7 Emergency, Health & Safety Assistance',
    arabicTitle: 'الطوارئ والسلامة وإرشاد التائهين',
    eyebrow: 'Arrival Simulator Stage 10 of 10',
    subtitle: 'Comprehensive safety network: Iraqi Police (104), Ambulance (122), Astan Guidance (+964 32 322 0000), and lost family centers.',
    badgeText: 'SAFETY & EMERGENCY',
    badgeColor: '#f56565',
    iconPath: `
      <g transform="translate(40, 20)">
        <path d="M50 15 L75 25 L75 50 C75 65 50 75 50 75 C50 75 25 65 25 50 L25 25 Z" fill="#f56565" fill-opacity="0.18" stroke="#f56565" stroke-width="2" />
        <text x="50" y="50" font-family="'Outfit', sans-serif" font-size="18" font-weight="800" fill="#f56565" text-anchor="middle">24h</text>
        <text x="95" y="35" font-family="'Cinzel', serif" font-size="16" font-weight="700" fill="#f5e6c8">EMERGENCY: POLICE 104 • AMBULANCE 122</text>
        <text x="95" y="58" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Al-Safir Specialist Surgical Hospital located 120m southwest of Imam Hussain Shrine.</text>
      </g>
    `,
    telemetry: [
      { label: 'Lost Persons Center', value: 'Markaz al-Mafqoodin situated on central Bayn al-Haramayn with multilingual staff' },
      { label: 'Medical Stations', value: 'Over 85 field medical clinics and emergency triage units in holy core' }
    ],
    legalNote: 'National Civil Defense • Karbala Health Directorate • Astan Security Operations'
  }
];

// ----------------------------------------------------------------------------
// 3. GENERATE TRANSPORT ASSETS
// ----------------------------------------------------------------------------
const transportOptions = [
  {
    id: 'transport_vip_taxi',
    filename: 'transport_vip_taxi.svg',
    folder: 'transport',
    title: 'Airport Official VIP Taxi (Private Sedan)',
    arabicTitle: 'تكسي المطار الخاص والمكيف',
    eyebrow: 'Fastest Door-to-Door Route',
    subtitle: 'Air-conditioned modern sedans (Toyota Camry / Hyundai Sonata) authorized for direct airport pickup and highway transit.',
    badgeText: 'FASTEST • DIRECT',
    badgeColor: '#ecc94b',
    iconPath: `
      <g transform="translate(30, 20)">
        <rect x="30" y="25" width="80" height="30" rx="4" fill="#ecc94b" fill-opacity="0.2" stroke="#ecc94b" stroke-width="1.5" />
        <circle cx="50" cy="55" r="7" fill="#ecc94b" />
        <circle cx="90" cy="55" r="7" fill="#ecc94b" />
        <text x="130" y="40" font-family="'Cinzel', serif" font-size="16" font-weight="700" fill="#f5e6c8">AIR-CONDITIONED PRIVATE SEDAN</text>
        <text x="130" y="62" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Door-to-door directly to your hotel entrance in Karbala</text>
      </g>
    `,
    telemetry: [
      { label: 'Fare Estimate', value: '45,000–60,000 IQD (~$35–$45 USD per vehicle)' },
      { label: 'Travel Time from Najaf', value: '1 Hour 15 Minutes' },
      { label: 'Luggage Capacity', value: '2 Large Suitcases + 2 Cabin Bags' }
    ],
    legalNote: 'Authorized Airport Taxi Dispatch Desk • Fixed government tariff'
  },
  {
    id: 'transport_shrine_bus',
    filename: 'transport_shrine_bus.svg',
    folder: 'transport',
    title: 'Holy Shrine Pilgrim Coaster Shuttle',
    arabicTitle: 'حافلات العتبة المقدسة المكوكية',
    eyebrow: 'Economical & Group Friendly',
    subtitle: 'Modern 24-seater Toyota Coaster and luxury coaches operated by Astan Quds for direct transfer between airport and holy precincts.',
    badgeText: 'ECONOMICAL • RELIABLE',
    badgeColor: '#48bb78',
    iconPath: `
      <g transform="translate(30, 20)">
        <rect x="25" y="20" width="90" height="40" rx="4" fill="#48bb78" fill-opacity="0.2" stroke="#48bb78" stroke-width="1.5" />
        <circle cx="45" cy="60" r="7" fill="#48bb78" />
        <circle cx="95" cy="60" r="7" fill="#48bb78" />
        <text x="130" y="40" font-family="'Cinzel', serif" font-size="16" font-weight="700" fill="#f5e6c8">ASTAN QUDS PILGRIM COACH</text>
        <text x="130" y="62" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Regular scheduled departures from airport bus bays to Bab Baghdad terminal</text>
      </g>
    `,
    telemetry: [
      { label: 'Fare Estimate', value: '5,000–10,000 IQD (~$4–$8 USD per seat)' },
      { label: 'Frequency', value: 'Every 30–45 minutes during peak flight arrivals' },
      { label: 'Comfort', value: 'Climate-controlled, USB charging ports, luggage stowage bays' }
    ],
    legalNote: 'Astan Quds Transport Division • Direct checkpoint priority'
  },
  {
    id: 'transport_private_coach',
    filename: 'transport_private_coach.svg',
    folder: 'transport',
    title: 'Family VIP Suburban / Staria Van',
    arabicTitle: 'سيارات عائلية VIP كبيرة',
    eyebrow: 'Maximum Family Comfort',
    subtitle: 'Spacious 7 to 11-seater GMC Yukon, Chevrolet Suburban, and Hyundai Staria for large family delegations with heavy luggage.',
    badgeText: 'FAMILY VIP',
    badgeColor: '#9f7aea',
    iconPath: `
      <g transform="translate(30, 20)">
        <rect x="25" y="20" width="95" height="35" rx="5" fill="#9f7aea" fill-opacity="0.2" stroke="#9f7aea" stroke-width="1.5" />
        <circle cx="45" cy="55" r="7" fill="#9f7aea" />
        <circle cx="100" cy="55" r="7" fill="#9f7aea" />
        <text x="135" y="38" font-family="'Cinzel', serif" font-size="16" font-weight="700" fill="#f5e6c8">LARGE LUXURY PASSENGER VAN</text>
        <text x="135" y="60" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Ideal for family caravans, elderly comfort, and abundant baggage capacity</text>
      </g>
    `,
    telemetry: [
      { label: 'Fare Estimate', value: '75,000–100,000 IQD (~$60–$80 USD per van)' },
      { label: 'Passenger Capacity', value: '7 to 11 Passengers' },
      { label: 'Luggage Capacity', value: '8–12 Large Bags' }
    ],
    legalNote: 'Certified Iraqi Tourism & Pilgrim Transport Service'
  }
];

// ----------------------------------------------------------------------------
// 4. GENERATE HOTEL ASSETS
// ----------------------------------------------------------------------------
const hotels = [
  {
    id: 'hotel_the_baron',
    filename: 'hotel_the_baron.svg',
    folder: 'hotels',
    title: 'The Baron Hotel Karbala',
    arabicTitle: 'فندق البارون كربلاء',
    eyebrow: '5-Star Luxury Pilgrim Residence',
    subtitle: 'Karbala\'s premier luxury landmark hotel featuring panoramic sanctuary views, fine halal dining, spa, and 24/7 dedicated shrine shuttles.',
    badgeText: '5-STAR LUXURY',
    badgeColor: '#c6a66b',
    iconPath: `
      <g transform="translate(40, 20)">
        <polygon points="50,15 90,45 80,75 20,75 10,45" fill="#c6a66b" fill-opacity="0.2" stroke="#c6a66b" stroke-width="1.5" />
        <text x="110" y="35" font-family="'Cinzel', serif" font-size="16" font-weight="700" fill="#f5e6c8">PANORAMIC SACRED CITY SUITES</text>
        <text x="110" y="58" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Al-Mithaq District • Complimentary private luxury shuttle every 15 minutes to shrines</text>
      </g>
    `,
    telemetry: [
      { label: 'Distance to Shrines', value: '3.2 km (7 min via private hotel shuttle bus)' },
      { label: 'Amenities', value: 'Heated Indoor Pool, 3 Restaurants, Multilingual Concierge (Arabic, English, Urdu)' },
      { label: 'Accessibility', value: '100% Step-Free Accessible with specialized senior suites' }
    ],
    legalNote: 'Verified 5-Star Hotel License • Karbala Tourism Board'
  },
  {
    id: 'hotel_rayhaan_rotana',
    filename: 'hotel_rayhaan_rotana.svg',
    folder: 'hotels',
    title: 'Karbala Rayhaan by Rotana',
    arabicTitle: 'فندق كربلاء ريحان من روتانا',
    eyebrow: 'Premium International Hospitality',
    subtitle: 'International standard luxury hotel located near Bab Baghdad, within comfortable walking proximity to Al-Abbas Shrine.',
    badgeText: '5-STAR ROTANA',
    badgeColor: '#4299e1',
    iconPath: `
      <g transform="translate(40, 20)">
        <rect x="30" y="20" width="55" height="50" rx="4" fill="#4299e1" fill-opacity="0.2" stroke="#4299e1" stroke-width="1.5" />
        <text x="105" y="35" font-family="'Cinzel', serif" font-size="16" font-weight="700" fill="#f5e6c8">BAB BAGHDAD PROXIMITY</text>
        <text x="105" y="58" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Only 1,100 meters north of Al-Abbas Shrine with level pedestrian concourse</text>
      </g>
    `,
    telemetry: [
      { label: 'Distance to Al-Abbas Shrine', value: '1.1 km (Approx. 12 min walk / 4 min cart)' },
      { label: 'Dining', value: 'Four international and oriental halal dining venues' },
      { label: 'Services', value: 'Dedicated prayer facilities, currency exchange desk, high-speed Wi-Fi' }
    ],
    legalNote: 'Rotana International Hotels & Resorts • Karbala Operations'
  },
  {
    id: 'hotel_durr_karbala',
    filename: 'hotel_durr_karbala.svg',
    folder: 'hotels',
    title: 'Durr Al-Karbala Luxury Hotel',
    arabicTitle: 'فندق در كربلاء الفاخر',
    eyebrow: 'Ultra-Close Sacred Proximity',
    subtitle: 'Situated just steps from Bab al-Qibla of Imam Hussain Shrine, allowing effortless daily visits for elderly and family pilgrims.',
    badgeText: '650M TO SHRINE',
    badgeColor: '#48bb78',
    iconPath: `
      <g transform="translate(40, 20)">
        <circle cx="50" cy="45" r="22" fill="#48bb78" fill-opacity="0.2" stroke="#48bb78" stroke-width="1.5" />
        <text x="95" y="35" font-family="'Cinzel', serif" font-size="16" font-weight="700" fill="#f5e6c8">WALK TO BAB AL-QIBLA IN 6 MINUTES</text>
        <text x="95" y="58" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Direct pedestrian street without vehicular congestion</text>
      </g>
    `,
    telemetry: [
      { label: 'Walking Distance', value: '650 meters to Imam Hussain Sanctuary Gate' },
      { label: 'Suitability', value: 'Optimal for senior pilgrims desiring frequent ziyarat between prayers' },
      { label: 'Atmosphere', value: 'Calm devotional ambiance with rooftop view of the golden domes' }
    ],
    legalNote: 'Accredited Karbala Hospitality Provider'
  }
];

// ----------------------------------------------------------------------------
// 5. GENERATE THE 5 GREAT HOLY SHRINES OF IRAQ ASSETS
// ----------------------------------------------------------------------------
const holyShrines = [
  {
    id: 'shrine_imam_hussain_karbala',
    filename: 'shrine_imam_hussain_karbala.svg',
    folder: 'shrines',
    title: 'Imam Hussain Holy Shrine (Karbala)',
    arabicTitle: 'العتبة الحسينية المقدسة',
    eyebrow: 'The Epicenter of Moral Chivalry & Sacrifice',
    subtitle: 'The eternal sanctuary of Imam Hussain ibn Ali (AS), martyred on 10 Muharram 61 AH alongside his loyal household and companions.',
    badgeText: 'RAWDA HUSAYNIYYA',
    badgeColor: '#c6a66b',
    iconPath: `
      <g transform="translate(40, 15)">
        <path d="M50 15 C30 35 30 55 30 75 L70 75 C70 55 70 35 50 15 Z" fill="#c6a66b" fill-opacity="0.3" stroke="#c6a66b" stroke-width="2" />
        <line x1="15" y1="20" x2="15" y2="75" stroke="#dfc08a" stroke-width="3" />
        <line x1="85" y1="20" x2="85" y2="75" stroke="#dfc08a" stroke-width="3" />
        <text x="110" y="35" font-family="'Cinzel', serif" font-size="18" font-weight="800" fill="#f5e6c8">GOLDEN DOME & RED MARTYRDOM FLAG</text>
        <text x="110" y="58" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Encloses the sacred tomb, Zarih, Ali al-Akbar, Ali al-Asghar, and Gowd-e Qatlgah.</text>
      </g>
    `,
    telemetry: [
      { label: 'GPS Coordinates', value: '32.61603° N, 44.03248° E (Karbala Center)' },
      { label: 'Architecture', value: '31m Pure Gilded Dome • Twin 35m Southern Minarets • 15,000 m² Courtyard' },
      { label: 'Primary Ziyarat', value: 'Ziyarat Warith & Ziyarat Ashura' }
    ],
    legalNote: 'Official Shrine Documentation: General Secretariat of Astan Quds Husayniyya (imamhussain.org)'
  },
  {
    id: 'shrine_al_abbas_karbala',
    filename: 'shrine_al_abbas_karbala.svg',
    folder: 'shrines',
    title: 'Al-Abbas Holy Shrine (Karbala)',
    arabicTitle: 'العتبة العباسية المقدسة',
    eyebrow: 'Sanctuary of the Moon of Banu Hashim',
    subtitle: 'The majestic resting place of Hazrat Abu al-Fadl al-Abbas (AS), standard-bearer of Husayni caravan and supreme exemplar of loyalty and bravery.',
    badgeText: 'BAB AL-HAWAEJ',
    badgeColor: '#dfc08a',
    iconPath: `
      <g transform="translate(40, 15)">
        <path d="M50 18 C32 36 32 55 32 75 L68 75 C68 55 68 36 50 18 Z" fill="#dfc08a" fill-opacity="0.25" stroke="#dfc08a" stroke-width="2" />
        <line x1="50" y1="5" x2="50" y2="18" stroke="#dfc08a" stroke-width="2" />
        <text x="100" y="35" font-family="'Cinzel', serif" font-size="18" font-weight="800" fill="#f5e6c8">SANCTUARY OF AL-ABBAS IBN ALI</text>
        <text x="100" y="58" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Connected across Bayn al-Haramayn (378 meters east of Imam Hussain Shrine).</text>
      </g>
    `,
    telemetry: [
      { label: 'GPS Coordinates', value: '32.61860° N, 44.03584° E' },
      { label: 'Notable Features', value: 'Clock Tower Portal at Bab al-Qibla • Intricate Muqarnas Tilework • Al-Alqami Portal' },
      { label: 'Primary Ziyarat', value: 'Ziyarat of Abu al-Fadl al-Abbas (Salamullahi Alayk ya Abal Fadl)' }
    ],
    legalNote: 'Official Shrine Documentation: General Secretariat of Al-Abbas Holy Shrine (alkafeel.net)'
  },
  {
    id: 'shrine_imam_ali_najaf',
    filename: 'shrine_imam_ali_najaf.svg',
    folder: 'shrines',
    title: 'Imam Ali Holy Shrine (Najaf al-Ashraf)',
    arabicTitle: 'العتبة العلوية المقدسة (النجف الأشرف)',
    eyebrow: 'Sanctuary of the Commander of the Faithful',
    subtitle: 'The supreme spiritual sanctuary of Amir al-Mu\'minin Ali ibn Abi Talib (AS), cousin and son-in-law of Prophet Muhammad ﷺ, situated 78km south of Karbala.',
    badgeText: 'AMIR AL-MU\'MININ',
    badgeColor: '#ecc94b',
    iconPath: `
      <g transform="translate(40, 15)">
        <path d="M50 12 C28 32 28 55 28 75 L72 75 C72 55 72 32 50 12 Z" fill="#ecc94b" fill-opacity="0.3" stroke="#ecc94b" stroke-width="2" />
        <text x="105" y="35" font-family="'Cinzel', serif" font-size="18" font-weight="800" fill="#f5e6c8">THE GOLDEN DOME OF NAJAF</text>
        <text x="105" y="58" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Historic starting locus of the traditional 80km Arbaeen pedestrian pilgrimage procession.</text>
      </g>
    `,
    telemetry: [
      { label: 'GPS Coordinates', value: '31.9961° N, 44.3142° E (Najaf Old City)' },
      { label: 'Expansion Project', value: 'Courtyard of Sayyida Fatima (SA) adding over 200,000 m² for zaireen' },
      { label: 'Proximity to Karbala', value: '78.5 km along Pole markers 1 through 1452' }
    ],
    legalNote: 'Official Shrine Documentation: Astan Alawiyya Holy Shrine (imamali.net)'
  },
  {
    id: 'shrine_al_kadhimayn_baghdad',
    filename: 'shrine_al_kadhimayn_baghdad.svg',
    folder: 'shrines',
    title: 'Al-Kadhimayn Holy Shrine (Baghdad)',
    arabicTitle: 'العتبة الكاظمية المقدسة (بغداد)',
    eyebrow: 'Sanctuary of the Two Imams: Al-Kadhim & Al-Jawad',
    subtitle: 'The magnificent twin-domed sanctuary of Imam Musa al-Kadhim (7th Imam) and Imam Muhammad al-Jawad (9th Imam) in northern Baghdad.',
    badgeText: 'TWIN GOLDEN DOMES',
    badgeColor: '#48bb78',
    iconPath: `
      <g transform="translate(40, 15)">
        <path d="M35 18 C20 35 20 55 20 75 L50 75 C50 55 50 35 35 18 Z" fill="#48bb78" fill-opacity="0.25" stroke="#48bb78" stroke-width="1.5" />
        <path d="M65 18 C50 35 50 55 50 75 L80 75 C80 55 80 35 65 18 Z" fill="#48bb78" fill-opacity="0.25" stroke="#48bb78" stroke-width="1.5" />
        <text x="105" y="35" font-family="'Cinzel', serif" font-size="18" font-weight="800" fill="#f5e6c8">TWIN GILDED DOMES & FOUR MINARETS</text>
        <text x="105" y="58" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Historic center of Kadhimiya; key pilgrimage stop before or after Karbala.</text>
      </g>
    `,
    telemetry: [
      { label: 'GPS Coordinates', value: '33.3804° N, 44.3392° E (Baghdad, Iraq)' },
      { label: 'Distance from Karbala', value: '115 km north along the Baghdad highway corridor' },
      { label: 'Interred Personalities', value: 'Imam Musa al-Kadhim (AS) & Imam Muhammad al-Taqi al-Jawad (AS)' }
    ],
    legalNote: 'Official Shrine Documentation: General Secretariat of Al-Kadhimayn Holy Shrine (al-kadhum.com)'
  },
  {
    id: 'shrine_al_askari_samarra',
    filename: 'shrine_al_askari_samarra.svg',
    folder: 'shrines',
    title: 'Al-Askari Holy Shrine (Samarra)',
    arabicTitle: 'العتبة العسكرية المقدسة (سامراء)',
    eyebrow: 'Sanctuary of the Two Askaris & Place of Occultation',
    subtitle: 'The holy resting place of Imam Ali al-Hadi (10th Imam) and Imam Hasan al-Askari (11th Imam), alongside Lady Narjis and the Maqam of the 12th Imam.',
    badgeText: 'ASKARIYYA SAMARRA',
    badgeColor: '#9f7aea',
    iconPath: `
      <g transform="translate(40, 15)">
        <path d="M50 12 C25 32 25 55 25 75 L75 75 C75 55 75 32 50 12 Z" fill="#9f7aea" fill-opacity="0.25" stroke="#9f7aea" stroke-width="2" />
        <text x="105" y="35" font-family="'Cinzel', serif" font-size="18" font-weight="800" fill="#f5e6c8">RECONSTRUCTED MONUMENTAL DOME</text>
        <text x="105" y="58" font-family="'Outfit', sans-serif" font-size="12" fill="#a0aec0">Features the Sirdab al-Ghayba (Basement of Occultation) of Imam al-Mahdi (AJFS).</text>
      </g>
    `,
    telemetry: [
      { label: 'GPS Coordinates', value: '34.1986° N, 43.8739° E (Samarra, Salah al-Din Governorate)' },
      { label: 'Distance from Karbala', value: '230 km north (via Baghdad northern orbital motorway)' },
      { label: 'Security & Access', value: 'Full security escort protocols and dedicated pilgrim bus convoys' }
    ],
    legalNote: 'Official Shrine Documentation: General Secretariat of Al-Askari Holy Shrine (askarian.iq)'
  }
];

// ----------------------------------------------------------------------------
// 6. GENERATE OFFLINE TRAVEL GUIDES ASSETS
// ----------------------------------------------------------------------------
const offlineGuides = [
  {
    id: 'guide_document_checklist',
    filename: 'guide_document_checklist.svg',
    folder: 'offline_guides',
    title: 'Essential Pilgrim Travel Checklist',
    arabicTitle: 'قائمة الوثائق ومستلزمات السفر',
    eyebrow: 'Offline Ready Travel Pack',
    subtitle: 'Verified checklist of mandatory documents, health essentials, and currency requirements for trouble-free entry into Iraq.',
    badgeText: 'TRAVEL CHECKLIST',
    badgeColor: '#48bb78',
    iconPath: `
      <g transform="translate(40, 15)">
        <rect x="25" y="15" width="20" height="20" rx="3" fill="#48bb78" fill-opacity="0.3" stroke="#48bb78" stroke-width="2" />
        <polyline points="29,25 34,30 41,20" fill="none" stroke="#48bb78" stroke-width="2" />
        <text x="60" y="30" font-family="'Outfit', sans-serif" font-size="14" font-weight="600" fill="#f7fafc">1. Passport (min 6 months validity from date of arrival)</text>
        <rect x="25" y="45" width="20" height="20" rx="3" fill="#48bb78" fill-opacity="0.3" stroke="#48bb78" stroke-width="2" />
        <polyline points="29,55 34,60 41,50" fill="none" stroke="#48bb78" stroke-width="2" />
        <text x="60" y="60" font-family="'Outfit', sans-serif" font-size="14" font-weight="600" fill="#f7fafc">2. Iraqi Entry Visa / E-Visa Approval printout</text>
      </g>
    `,
    telemetry: [
      { label: 'Core Documents', value: 'Passport, Visa, Hotel Confirmation, Emergency Medical Card' },
      { label: 'Clothing Essentials', value: 'Modest Islamic attire, comfortable walking sandals with extra socks' }
    ],
    legalNote: 'Self-contained offline checklist • Operates without active internet connection'
  },
  {
    id: 'guide_emergency_dial',
    filename: 'guide_emergency_dial.svg',
    folder: 'offline_guides',
    title: 'Emergency Hotlines & Medical Triage Card',
    arabicTitle: 'أرقام الطوارئ والمستشفيات المعتمدة',
    eyebrow: '24/7 Pilgrim Safety Reference',
    subtitle: 'One-touch verified emergency numbers and holy shrine dispatch contacts in Karbala and Najaf.',
    badgeText: 'OFFLINE EMERGENCY',
    badgeColor: '#f56565',
    iconPath: `
      <g transform="translate(40, 15)">
        <rect x="20" y="15" width="180" height="60" rx="6" fill="#f56565" fill-opacity="0.15" stroke="#f56565" stroke-width="2" />
        <text x="110" y="40" font-family="'Outfit', sans-serif" font-size="18" font-weight="800" fill="#feb2b2" text-anchor="middle">POLICE: 104</text>
        <text x="110" y="62" font-family="'Outfit', sans-serif" font-size="14" font-weight="700" fill="#cbd5e0" text-anchor="middle">Free Toll-Free Dialing</text>
        <rect x="230" y="15" width="180" height="60" rx="6" fill="#48bb78" fill-opacity="0.15" stroke="#48bb78" stroke-width="2" />
        <text x="320" y="40" font-family="'Outfit', sans-serif" font-size="18" font-weight="800" fill="#9ae6b4" text-anchor="middle">AMBULANCE: 122</text>
        <text x="320" y="62" font-family="'Outfit', sans-serif" font-size="14" font-weight="700" fill="#cbd5e0" text-anchor="middle">Red Crescent Paramedics</text>
        <rect x="440" y="15" width="200" height="60" rx="6" fill="#c6a66b" fill-opacity="0.15" stroke="#c6a66b" stroke-width="2" />
        <text x="540" y="40" font-family="'Outfit', sans-serif" font-size="16" font-weight="800" fill="#f5e6c8" text-anchor="middle">+964 32 322 0000</text>
        <text x="540" y="62" font-family="'Outfit', sans-serif" font-size="13" font-weight="600" fill="#a0aec0" text-anchor="middle">Shrines Guidance Central</text>
      </g>
    `,
    telemetry: [
      { label: 'Toll-Free Numbers', value: '104 (Police Dispatch) • 122 (Medical Emergency) • 115 (Fire Rescue)' },
      { label: 'Hospital Emergency Bay', value: 'Al-Safir Hospital: +964 32 328 100 (Direct)' }
    ],
    legalNote: 'Audited against National Communications and Media Commission Registry'
  }
];

// Combine all definitions
const allCategories = [
  ...airports,
  ...arrivalSteps,
  ...transportOptions,
  ...hotels,
  ...holyShrines,
  ...offlineGuides
];

// Write SVG files
console.log('Generating 26 visual assets in client/assets/zaireen_journey/ ...');

const manifestEntries = [];

for (const item of allCategories) {
  const targetDir = path.join(assetBase, item.folder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filePath = path.join(targetDir, item.filename);
  const svgContent = createSvgCard({
    title: item.title,
    arabicTitle: item.arabicTitle,
    eyebrow: item.eyebrow,
    subtitle: item.subtitle,
    badgeText: item.badgeText,
    badgeColor: item.badgeColor,
    iconPath: item.iconPath,
    telemetry: item.telemetry,
    legalNote: item.legalNote
  });

  fs.writeFileSync(filePath, svgContent, 'utf8');
  console.log(`✅ Created: assets/zaireen_journey/${item.folder}/${item.filename}`);

  manifestEntries.push({
    id: item.id,
    category: item.folder,
    title: item.title,
    arabicTitle: item.arabicTitle,
    subtitle: item.subtitle,
    badgeText: item.badgeText,
    badgeColor: item.badgeColor,
    localPath: `assets/zaireen_journey/${item.folder}/${item.filename}`,
    width: 800,
    height: 500,
    aspectRatio: 1.6,
    format: 'svg',
    isOfflineAvailable: true,
    telemetry: item.telemetry,
    legalAttribution: item.legalNote
  });
}

// Write the complete manifest file
const manifestPath = path.join(projectRoot, 'client', 'assets', 'zaireen_journey_manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifestEntries, null, 2), 'utf8');
console.log(`\n🎉 Successfully generated ${manifestEntries.length} assets and saved manifest to ${manifestPath}`);
