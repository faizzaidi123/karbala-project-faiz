/**
 * KARBALA DIGITAL TWIN 4.0 — SMART AIRPORT ARRIVAL & ZAIREEN JOURNEY DATA
 * Verified sovereign intelligence, geographic telemetry, and offline travel resources.
 */

export const AIRPORTS_DATA = [
  {
    id: 'njf',
    code: 'NJF',
    icao: 'ORNI',
    name: 'Al-Najaf International Airport',
    arabicName: 'مطار النجف الأشرف الدولي',
    status: 'OPERATIONAL',
    statusBadge: 'Primary Ziyarat Gateway • Fully Operational',
    statusClass: 'badge-success',
    city: 'Al-Najaf Al-Ashraf',
    province: 'Najaf Governorate, Republic of Iraq',
    coordinates: { lat: 31.9898, lng: 44.4042 },
    distanceToKarbalaKm: 78.4,
    estimatedDriveMin: 75,
    heroImage: 'assets/airports/najaf/najaf_terminal_exterior.jpg',
    thumbnail: 'assets/airports/najaf/najaf_terminal_exterior.jpg',
    gallery: [
      { url: 'assets/airports/najaf/najaf_terminal_exterior.jpg', caption: 'Main Terminal Passenger Exterior & Palm Boulevard', attribution: 'Wikimedia Commons / Panoramio', license: 'CC BY-SA 3.0' },
      { url: 'assets/airports/najaf/najaf_airport_gate.jpg', caption: 'Official Gateway & Entrance Portal', attribution: 'Wikimedia Commons', license: 'Public Domain / CC BY-SA' },
      { url: 'assets/airports/najaf/najaf_airport_apron.jpg', caption: 'Commercial Apron & Pilgrim Aircraft Boarding', attribution: 'Wikimedia Commons', license: 'CC BY-SA 3.0' }
    ],
    trafficSharePct: '72% of Airborne International Zaireen',
    runwaySpecs: '3,000m × 45m Asphalt (Code 4D) with Cat I ILS',
    description: 'The primary aerial gateway for international Shia pilgrims entering Iraq. Located just 10 km east of the Holy Shrine of Imam Ali in Najaf and 78 km south of Karbala, NJF operates 24/7 dedicated Arbaeen and Ashura seasonal arrival corridors.',
    facilities: [
      'Dedicated 32-counter Arbaeen seasonal immigration terminal',
      'Asiacell, Zain Iraq, and Korek official SIM activation booths',
      'Central Bank of Iraq licensed currency exchange kiosks (USD/EUR/PKR/INR to IQD)',
      'Astan Al-Hussainiya and Al-Alawiya Pilgrim Reception & Guidance Desks',
      'Regulated Airport Taxi Dispatch Counter with sovereign fixed fares',
      'Step-free accessible boarding bridges and specialized wheelchair passenger lifts',
      'Free high-capacity Astan transit shuttles connecting to Najaf Grand Bus Terminal'
    ],
    transportOptions: [
      { mode: 'Official Airport Regulated Taxi (Sedan 4 Pax)', fareIQD: '50,000 – 75,000 IQD', fareUSD: '~$38 – $55 USD', duration: '1h 15m' },
      { mode: 'VIP Pilgrim GMC / Suburban (6–8 Pax)', fareIQD: '100,000 – 130,000 IQD', fareUSD: '~$75 – $100 USD', duration: '1h 10m' },
      { mode: 'Astan Pilgrim Coaster / Bus', fareIQD: '5,000 – 10,000 IQD / Free seasonal', fareUSD: '~$4 – $7 USD', duration: '1h 45m' }
    ],
    tips: 'Exchange at least $50 into Iraqi Dinar before exiting the arrivals hall to pay for highway tolls and taxi fare. Airport taxis operate on fixed official vouchers available at the indoor kiosk.',
    legalAttribution: 'Iraqi Civil Aviation Authority (ICAA) / Najaf International Airport Authority'
  },
  {
    id: 'bgw',
    code: 'BGW',
    icao: 'ORBI',
    name: 'Baghdad International Airport',
    arabicName: 'مطار بغداد الدولي',
    status: 'OPERATIONAL',
    statusBadge: 'Federal Capital Hub • Fully Operational',
    statusClass: 'badge-info',
    city: 'Baghdad',
    province: 'Baghdad Governorate, Republic of Iraq',
    coordinates: { lat: 33.2625, lng: 44.2344 },
    distanceToKarbalaKm: 105.2,
    estimatedDriveMin: 105,
    heroImage: 'assets/airports/baghdad/baghdad_terminal_exterior.jpg',
    thumbnail: 'assets/airports/baghdad/baghdad_terminal_exterior.jpg',
    gallery: [
      { url: 'assets/airports/baghdad/baghdad_terminal_exterior.jpg', caption: 'Babylon Passenger Terminal Concourse', attribution: 'Iraqi Civil Aviation / Wikimedia Commons', license: 'Public Domain' },
      { url: 'assets/airports/baghdad/baghdad_airport_aerial.jpg', caption: 'Aerial View of Dual Category III Runways', attribution: 'US DoD / Wikimedia Commons', license: 'Public Domain' },
      { url: 'assets/airports/baghdad/baghdad_airport_tower.jpg', caption: 'Air Traffic Control Tower & Radar Installation', attribution: 'Wikimedia Commons', license: 'Public Domain' }
    ],
    trafficSharePct: '22% of Airborne International Zaireen',
    runwaySpecs: 'Two runways: 4,000m & 3,300m Concrete (Code 4E/4F Category III)',
    description: 'The federal capital’s flagship aviation hub. BGW features extensive international airline connections from Europe, Middle East, and Asia. Frequently selected by pilgrims visiting the Holy Shrines of Al-Kadhimayn in Baghdad and Al-Askari in Samarra before proceeding to Karbala.',
    facilities: [
      'Terminals Babylon, Nineveh, and Samarra with dual biometric border control',
      'Commercial banking branches (Rafidain, Trade Bank of Iraq, Ashur Bank)',
      'Telecom operators with 5G tourist eSIM and physical nano-SIM distribution',
      'VIP protocol lounges and government-regulated Baghdad Airport Taxi dispatch',
      'Inter-terminal electric shuttle and luggage wrapping stations',
      'Direct highway corridor connection to Baghdad-Hillah-Karbala Expressway',
      'Specialized medical clinic and 24/7 Red Crescent triage room'
    ],
    transportOptions: [
      { mode: 'Official Baghdad Airport Taxi (Private Sedan)', fareIQD: '90,000 – 125,000 IQD', fareUSD: '~$70 – $95 USD', duration: '1h 45m' },
      { mode: 'Al-Karkh Coach / Suburban Group Van', fareIQD: '150,000 – 200,000 IQD', fareUSD: '~$115 – $150 USD', duration: '1h 50m' },
      { mode: 'Iraqi Republic Railways (Baghdad Central to Karbala)', fareIQD: '10,000 – 15,000 IQD (Seasonal)', fareUSD: '~$8 – $12 USD', duration: '2h 15m' }
    ],
    tips: 'Ensure your taxi has security clearance authorization to pass the Abbas Bin Firnas checkpoint square without luggage transfer.',
    legalAttribution: 'Iraqi Ministry of Transport / Iraqi Civil Aviation Authority (ICAA)'
  },
  {
    id: 'bsr',
    code: 'BSR',
    icao: 'ORMM',
    name: 'Basra International Airport',
    arabicName: 'مطار البصرة الدولي',
    status: 'OPERATIONAL',
    statusBadge: 'Southern Gateway • Fully Operational',
    statusClass: 'badge-primary',
    city: 'Basra',
    province: 'Basra Governorate, Republic of Iraq',
    coordinates: { lat: 30.5492, lng: 47.6622 },
    distanceToKarbalaKm: 502.0,
    estimatedDriveMin: 330,
    heroImage: 'assets/airports/basra/basra_terminal_exterior.jpg',
    thumbnail: 'assets/airports/basra/basra_terminal_exterior.jpg',
    gallery: [
      { url: 'assets/airports/basra/basra_terminal_exterior.jpg', caption: 'Southern Iraq Commercial Concourse', attribution: 'Basra Governorate / Wikimedia Commons', license: 'CC BY-SA 3.0' },
      { url: 'assets/airports/basra/basra_terminal_apron.jpg', caption: 'Apron and Runway 4,000m Capacity', attribution: 'Wikimedia Commons', license: 'Public Domain' }
    ],
    trafficSharePct: '6% of Airborne International Zaireen',
    runwaySpecs: '4,000m × 45m Concrete Runway (Code 4E)',
    description: 'The southern commercial gateway of Iraq, serving pilgrims from the GCC states (Kuwait, Saudi Arabia, Bahrain, UAE, Oman) and international transits. Often used as the starting point for the legendary 500-kilometer southern Arbaeen walking journey from Ras Al-Beesh (Faw) to Karbala.',
    facilities: [
      'Modern international arrivals concourse with 16 e-Gate ready lanes',
      'Southern Border Passports Directorate desk with visa-on-arrival facilitation',
      'Full telecom kiosks (Zain, Asiacell) and sovereign currency kiosks',
      'Connection to Basra Grand Central Railway Station for express trains to Karbala',
      'Extensive luggage handling facilities and air-conditioned waiting halls'
    ],
    transportOptions: [
      { mode: 'Iraqi Republic Railways Overnight Sleeper Train to Karbala', fareIQD: '15,000 – 25,000 IQD', fareUSD: '~$12 – $20 USD', duration: '7h 00m' },
      { mode: 'Domestic Connecting Flight (Basra to Najaf/Baghdad)', fareIQD: '85,000 – 120,000 IQD', fareUSD: '~$65 – $90 USD', duration: '45m flight' },
      { mode: 'Private VIP Suburban / Highway Coach (Expressway 1)', fareIQD: '200,000 – 300,000 IQD', fareUSD: '~$150 – $230 USD', duration: '5h 30m' }
    ],
    tips: 'The night train from Basra to Karbala is one of the most culturally scenic pilgrimage experiences. Pre-book sleeper berths during peak Arbaeen weeks.',
    legalAttribution: 'Basra Governorate Aviation Directorate / ICAA'
  },
  {
    id: 'kib',
    code: 'KIB',
    icao: 'UNASSIGNED',
    name: 'Karbala International Airport (Under Construction)',
    arabicName: 'مطار كربلاء الدولي (قيد الإنشاء والتجهيز)',
    status: 'NON_OPERATIONAL',
    statusBadge: 'UNDER CONSTRUCTION • NON-OPERATIONAL (TARGET 2026+)',
    statusClass: 'badge-danger',
    city: 'Karbala',
    province: 'Karbala Governorate, Republic of Iraq',
    coordinates: { lat: 32.4800, lng: 44.0200 },
    distanceToKarbalaKm: 32.0,
    estimatedDriveMin: 30,
    heroImage: 'assets/airports/karbala/karbala_airport_emblem.jpg',
    thumbnail: 'assets/airports/karbala/karbala_airport_emblem.jpg',
    gallery: [
      { url: 'assets/airports/karbala/karbala_airport_emblem.jpg', caption: 'Official Sovereign Emblem & Construction Blueprint', attribution: 'Holy Shrine of Imam Hussain / Teebat Karbala Co.', license: 'Official Sovereign Registry' }
    ],
    trafficSharePct: '0% (Non-Operational / Project Phase)',
    runwaySpecs: '4,500m × 60m Code 4F Runway (Built to accommodate Airbus A380 & Boeing 777)',
    description: 'A sovereign mega-infrastructure initiative spearheaded by the Holy Shrine of Imam Hussain (Astan Al-Hussainiya) and Teebat Karbala Co. Designed by ADPI (Aéroports de Paris Ingénierie) to handle up to 20 million pilgrims annually upon full multi-phase completion. The main 4.5km runway, air traffic control tower, and service corridors are structurally completed, but commercial passenger flights are NOT yet operational.',
    facilities: [
      'STRUCTURAL PHASE: 4,500m Code 4F ultra-heavy runway structurally complete',
      'AIR TRAFFIC CONTROL: 64-meter ATC Tower topped out with radar mast installation underway',
      'PASSENGER TERMINAL: Phase 1 terminal building (3 million passenger initial capacity) in finishing stage',
      'SECURITY & CERTIFICATION: Awaiting final ICAO safety audit and sovereign civil aviation flight permits',
      'NO COMMERCIAL FLIGHTS: All active flight booking claims to KIB are unauthorized scams'
    ],
    transportOptions: [
      { mode: 'Commercial Flights', fareIQD: 'N/A (Not Operating)', fareUSD: 'DO NOT BOOK', duration: 'Under Construction' },
      { mode: 'Official Advice', fareIQD: 'Use Najaf (NJF) or Baghdad (BGW)', fareUSD: 'Verified Alternative Gateways', duration: 'Active Gateways' }
    ],
    tips: 'CRITICAL PILGRIM ADVISORY: Do not attempt to book flights landing at Karbala Airport for 2024-2026 pilgrimages. Always book your flights to Al-Najaf International Airport (NJF) or Baghdad International Airport (BGW).',
    legalAttribution: 'Holy Shrine of Imam Hussain (Astan) / Ministry of Transport / Teebat Karbala Co.'
  }
];

export const ARRIVAL_STEPS = [
  {
    stepNumber: 1,
    id: 'landing',
    title: 'Aircraft Landing & Runway Approach',
    arabicTitle: 'الهبوط والوصول إلى مدرج المطار',
    badge: 'STAGE 1 / 10',
    estTime: '15 – 20 min',
    icon: 'bi-airplane-engines',
    image: 'assets/zaireen_journey/arrival_steps/step_01_landing.svg',
    summary: 'Touchdown on sovereign Iraqi soil. Transition from aerial transit to the sanctuary atmosphere.',
    checklist: [
      'Remain seated with seatbelts fastened until captain turns off sign and aircraft docks',
      'Retrieve passport, vaccination booklet, and printed Iraqi eVisa confirmation from personal pouch',
      'Prepare respectful modest attire (Abaya / Chador for women, conservative long trousers for men)',
      'Confirm all carry-on electronics and medications are accounted for before disembarking'
    ],
    expertAdvice: 'Recite Salawat upon touchdown. In Najaf, you will see the golden beacon of Imam Ali from the port windows during standard northern approach.',
    telemetry: { speed: 'Taxiing 15-25 knots', gateType: 'Aerobridge / Passenger Ramp', climateControl: '24°C Terminal' }
  },
  {
    stepNumber: 2,
    id: 'immigration',
    title: 'Sovereign Border & Passport Control',
    arabicTitle: 'إجراءات الجوازات والتأشيرة والإقامة',
    badge: 'STAGE 2 / 10',
    estTime: '25 – 45 min',
    icon: 'bi-pass-fill',
    image: 'assets/zaireen_journey/arrival_steps/step_02_immigration.svg',
    summary: 'Verification of international passports, biometric check, and official sovereign entry stamp.',
    checklist: [
      'Join designated lane: Diplomatic, Iraqi Nationals, GCC Citizens, or International Pilgrims (Zaireen)',
      'Hand over passport (valid for at least 6 months) open to photo page with visa document inside',
      'Look into the biometric webcam for facial identification and place index fingers on optical scanner',
      'Verify that the entry stamp is clearly affixed and dates are legible before stepping away from desk'
    ],
    expertAdvice: 'Keep your visa slip safely folded inside your passport until your return departure flight, as airport departure customs will request to verify the original entry documentation.',
    telemetry: { avgQueue: '15-30 min', biometrics: 'Optical 10-finger / Facial Capture', securityLevel: 'ICAA Standard Tier 1' }
  },
  {
    stepNumber: 3,
    id: 'baggage',
    title: 'Baggage Carousel Retrieval & Customs',
    arabicTitle: 'استلام الأمتعة والتفتيش الجمركي',
    badge: 'STAGE 3 / 10',
    estTime: '20 – 35 min',
    icon: 'bi-luggage-fill',
    image: 'assets/zaireen_journey/arrival_steps/step_03_baggage.svg',
    summary: 'Retrieving checked luggage from designated carousels and completing sovereign customs inspection.',
    checklist: [
      'Locate your flight number on the high-definition LED flight carousel monitors',
      'Verify the printed baggage tag barcode matches your airline check-in boarding receipt stub',
      'Report any damaged, torn, or missing baggage to the airline ground handling service desk',
      'Proceed through Customs Inspection (Green Channel for nothing to declare, Red for declared goods)'
    ],
    expertAdvice: 'Civilian camera drones, walkie-talkie transceivers exceeding 0.5W, and satellite phones (Thuraya/Iridium) are strictly prohibited by Iraqi sovereign law without defense ministry permit.',
    telemetry: { carouselSpeed: '0.4 m/s', inspection: 'Dual-Energy X-Ray Scanning', porterFee: '5,000 IQD standard (~$3.80)' }
  },
  {
    stepNumber: 4,
    id: 'sim_connectivity',
    title: 'Local Telecommunications & 4G/5G SIM Setup',
    arabicTitle: 'شراء شرائح الاتصال العراقية والإنترنت',
    badge: 'STAGE 4 / 10',
    estTime: '10 – 15 min',
    icon: 'bi-sim-fill',
    image: 'assets/zaireen_journey/arrival_steps/step_04_sim_connectivity.svg',
    summary: 'Instant connectivity with Iraqi sovereign telecom providers for navigation, family calls, and digital twin access.',
    checklist: [
      'Visit official carrier kiosks in arrivals: Asiacell (Orange), Zain Iraq (Green), or Korek (Blue)',
      'Select a Pilgrim/Visitor Data Package (Recommended: 10GB to 30GB with 100 local voice minutes)',
      'Provide passport for mandatory regulatory identity registration (law takes ~3 minutes)',
      'Confirm data activation and test WhatsApp / digital twin connection before exiting kiosk area'
    ],
    expertAdvice: 'Asiacell has historically maintained the densest mobile cell tower arrays along the 80km Najaf-to-Karbala pilgrimage corridor (Tareeq Ya Hussain), providing continuous signal even during 20+ million Arbaeen crowds.',
    telemetry: { carriers: 'Asiacell / Zain / Korek', packageCost: '10,000 – 20,000 IQD ($8–$15)', speed: 'LTE / 5G High Speed' }
  },
  {
    stepNumber: 5,
    id: 'currency_exchange',
    title: 'Official Sovereign Currency Exchange',
    arabicTitle: 'تصريف العملات والدينار العراقي المعتمد',
    badge: 'STAGE 5 / 10',
    estTime: '10 – 15 min',
    icon: 'bi-cash-coin',
    image: 'assets/zaireen_journey/arrival_steps/step_05_currency_exchange.svg',
    summary: 'Exchanging foreign currency into Iraqi Dinar (IQD) at central bank authorized exchange counters.',
    checklist: [
      'Locate official licensed exchange desks inside the terminal (Bank of Baghdad, Ashur, or CBI desks)',
      'Check official published daily exchange rates displayed on the electronic LED ticker board',
      'Exchange $100 – $200 USD equivalent into mixed denominations: 25k, 10k, 5k, and 1k Dinar notes',
      'Count all bank notes carefully and retain official stamped exchange receipt for your records'
    ],
    expertAdvice: 'Almost all local taxis, fruit stalls, mawakeb services, and souvenir shops in Karbala accept cash Dinar only. Credit cards (Visa/Mastercard) are accepted at major 5-star hotels (The Baron, Rotana) but rarely in the old city bazaars.',
    telemetry: { officialRate: '~1,310–1,320 IQD/USD', benchmarkPack: '150,000 IQD ($115)', atmAvailability: 'Mastercard/Visa ATMs inside terminal' }
  },
  {
    stepNumber: 6,
    id: 'transport',
    title: 'Regulated Ground Transportation Dispatch',
    arabicTitle: 'حجز سيارات الأجرة المرخصة ووسائل النقل',
    badge: 'STAGE 6 / 10',
    estTime: '15 – 20 min',
    icon: 'bi-taxi-front-fill',
    image: 'assets/zaireen_journey/arrival_steps/step_06_transport.svg',
    summary: 'Boarding verified, security-screened airport taxis or shrine pilgrim shuttle coaches to Karbala.',
    checklist: [
      'Book transportation exclusively through the official indoor airport taxi dispatch voucher desk',
      'Decline unofficial street touts outside the baggage exit who do not hold an official dispatch badge',
      'Present your destination hotel name and city address in both English and Arabic to the driver',
      'Keep your luggage receipt stubs and confirm your luggage is secured in the trunk before boarding'
    ],
    expertAdvice: 'The official fixed fare from Najaf Airport to Karbala inner perimeter is 50,000 to 75,000 IQD. If traveling with elderly family or extensive luggage, book a VIP Suburban/GMC for superior comfort over the 78 km highway.',
    telemetry: { distance: '78.4 km (Najaf) / 105 km (Baghdad)', highway: '4-lane divided asphalt corridor', securityCheckpoints: '2 sovereign checkpoints' }
  },
  {
    stepNumber: 7,
    id: 'hotel_arrival',
    title: 'Karbala Sanctuary Hotel Check-In',
    arabicTitle: 'الوصول إلى الفندق في كربلاء وإتمام الإقامة',
    badge: 'STAGE 7 / 10',
    estTime: '20 – 30 min',
    icon: 'bi-building-check',
    image: 'assets/zaireen_journey/arrival_steps/step_07_hotel_arrival.svg',
    summary: 'Arrival at your pre-booked accommodation, municipal registry, luggage unpack, and sanctification.',
    checklist: [
      'Present hotel booking confirmation voucher and passports of all room occupants to reception',
      'Obtain room keycard, Wi-Fi login credentials, and the hotel’s printed bilingual business card',
      'Inquire about the hotel’s complimentary shrine shuttle schedule (e.g., The Baron’s 15-min shuttle)',
      'Store high-value items, passports, and excess cash in the electronic in-room safe box'
    ],
    expertAdvice: 'Always keep the hotel’s Arabic business card in your wallet and take a photo on your smartphone. If you lose your orientation around the massive shrine courtyards, any local shopkeeper or police officer can instantly direct you.',
    telemetry: { checkInHours: '14:00 standard (flexible during Arbaeen)', proximity: '0.3 km to 2.5 km from Haram', shuttleFrequency: 'Every 15 min' }
  },
  {
    stepNumber: 8,
    id: 'shrine_journey',
    title: 'Sacred Haramayn Pedestrian Approach',
    arabicTitle: 'المسير نحو الحرمين الشريفين وما بين الحرمين',
    badge: 'STAGE 8 / 10',
    estTime: '15 – 45 min',
    icon: 'bi-moon-stars-fill',
    image: 'assets/zaireen_journey/arrival_steps/step_08_shrine_journey.svg',
    summary: 'Passing security checkpoints and entering the spiritual center of Karbala: Bayn al-Haramayn.',
    checklist: [
      'Pass security checkpoint (Tafteesh): respectful bodily pat-down inspection (separate men and women gates)',
      'Deposit backpacks, travel bags, and unauthorized cameras at official Amanat (cloakroom counters)',
      'Remove footwear at official Keshwan shoe deposit counters and keep the numbered brass token securely',
      'Step with right foot onto the sacred white Italian Thassos marble courtyard reciting Idhn al-Dukhul'
    ],
    expertAdvice: 'During hot weather, the white Thassos marble in Bayn al-Haramayn remains naturally cool under direct sun due to high thermal reflectance. Walk barefoot with reverence.',
    telemetry: { distanceBetweenDomes: '378 meters (Bayn al-Haramayn)', securityBays: 'Dedicated male/female inspection corridors', marbleType: 'Thassos Heat-Reflective White' }
  },
  {
    stepNumber: 9,
    id: 'accessibility',
    title: 'Accessibility, Wheelchairs & Electric Carts',
    arabicTitle: 'خدمات ذوي الاحتياجات الخاصة والعربات الكهربائية',
    badge: 'STAGE 9 / 10',
    estTime: 'Instant / Continuous',
    icon: 'bi-heart-pulse-fill',
    image: 'assets/zaireen_journey/arrival_steps/step_09_accessibility.svg',
    summary: 'Dedicated accessibility infrastructure operated by the holy shrines for elderly and disabled pilgrims.',
    checklist: [
      'Free electric cart transit (Sayarat al-Shahen) operates continuously along the outer shrine perimeters',
      'Borrow free manual wheelchairs from the Astan Al-Hussainiya Bab al-Qibla accessibility desk',
      'Utilize step-free marble ramps located at all major historic gates for smooth wheelchair roll-in',
      'Locate dedicated senior pilgrim prayer enclosures equipped with cushioned seating and Quran stands'
    ],
    expertAdvice: 'Astan volunteers (Khuddam) wear green or gold sashes and assist elderly pilgrims in performing Tawaf around the Zarih at designated calm hours (typically 01:00 to 04:00 AM).',
    telemetry: { cartFleet: '250+ Electric Carts', wheelchairInventory: '3,000+ Astan Loan Units', rampGrad: '< 1:12 ADA / Universal Compliance' }
  },
  {
    stepNumber: 10,
    id: 'emergency',
    title: '24/7 Astan Guidance & Emergency Hotlines',
    arabicTitle: 'مركز إرشاد التائهين والطوارئ الطبية 24/7',
    badge: 'STAGE 10 / 10',
    estTime: 'Immediate 24/7',
    icon: 'bi-shield-fill-check',
    image: 'assets/zaireen_journey/arrival_steps/step_10_emergency.svg',
    summary: 'Round-the-clock medical triage, sovereign emergency response, and lost person reunion centers.',
    checklist: [
      'Save Iraqi National Emergency Hotlines into your phone: 122 (Ambulance), 104 (Police), 115 (Civil Defense)',
      'Note the Holy Shrine Lost Persons Hotline: +964 32 322 0000 / Astan Guidance System',
      'Locate the nearest Astan Medical Dispensary inside the holy courtyards for free medical treatment',
      'Ensure young children wear wristbands with their name, guardian phone number, and hotel name'
    ],
    expertAdvice: 'The Holy Shrine operates 18 Lost Person & Child Guidance Stations (Marakiz Irshad al-Ta\'iheen) linked via real-time biometric database across Karbala and Najaf to rapidly reunite separated families.',
    telemetry: { emergencyDial: '122 (EMS) / 104 (Police)', astanMedical: 'Al-Safeer Surgical Hospital & Field Clinics', responseTime: '< 3 minutes inside courtyard' }
  }
];

export const TRANSPORT_MODES = [
  {
    id: 'vip_taxi',
    name: 'Regulated Airport Private Sedan (Yellow/White)',
    arabicName: 'سيارة أجرة المطار المعتمدة',
    image: 'assets/zaireen_journey/transport/transport_vip_taxi.svg',
    capacity: '1 – 4 Passengers',
    luggage: '3 Standard Suitcases',
    fareRangeIQD: '50,000 – 75,000 IQD',
    fareUSD: '~$38 – $55 USD',
    highwayDuration: '1h 15m from Najaf (NJF) • 1h 45m from Baghdad (BGW)',
    airConditioned: true,
    securityClearance: 'Verified Sovereign Airport Pass',
    highlights: ['Door-to-door hotel delivery', 'Fixed voucher pricing at indoor kiosk', 'No haggling or surge pricing', 'Immediate departure']
  },
  {
    id: 'private_coach',
    name: 'VIP GMC Suburban / Toyota HiAce Van',
    arabicName: 'سوبربان VIP ومركبات عائلية سريعة',
    image: 'assets/zaireen_journey/transport/transport_private_coach.svg',
    capacity: '6 – 10 Passengers',
    luggage: '8 – 12 Large Bags',
    fareRangeIQD: '100,000 – 140,000 IQD',
    fareUSD: '~$75 – $105 USD',
    highwayDuration: '1h 10m from Najaf (NJF) • 1h 40m from Baghdad (BGW)',
    airConditioned: true,
    securityClearance: 'Full Interstate Pilgrimage Permit',
    highlights: ['Ideal for extended families and ziyarat caravans', 'Reclining leather seating & USB charging ports', 'Direct highway toll fast-track', 'Spacious cargo capacity']
  },
  {
    id: 'shrine_bus',
    name: 'Astan Sacred Pilgrim Shuttle Coach (Free / Nominal)',
    arabicName: 'حافلات العتبة المقدسة لنقل الزائرين',
    image: 'assets/zaireen_journey/transport/transport_shrine_bus.svg',
    capacity: '45 – 55 Passengers',
    luggage: 'Underfloor Luggage Compartment',
    fareRangeIQD: 'Free during Arbaeen / 5,000 IQD normal',
    fareUSD: 'Free – $3.80 USD',
    highwayDuration: '1h 45m from Najaf Terminal',
    airConditioned: true,
    securityClearance: 'Astan Al-Hussainiya Sovereign Fleet',
    highlights: ['Free water and dates on board', 'Direct route to Astan Karbala outer bus staging bays', 'Safe group transit with spiritual community', 'Specialized wheelchair hydraulic lifts']
  }
];

export const HOTELS_DATA = [
  {
    id: 'the_baron',
    name: 'The Baron Hotel Karbala',
    arabicName: 'فندق البارون كربلاء',
    stars: 5,
    distanceToHaram: '2.5 km (Bab Baghdad corridor)',
    image: 'assets/zaireen_journey/hotels/hotel_the_baron.svg',
    shuttle: 'Complimentary private Mercedes luxury shuttle every 15 minutes 24/7',
    rating: 4.8,
    features: ['Tallest hotel tower in Karbala with direct panoramic view of both holy domes', '273 sound-insulated luxury guest rooms & family suites', 'International fine dining restaurants (Al-Baron, Sky Lounge)', 'Full business center, prayer halls, and high-speed Wi-Fi', 'Complimentary luggage concierge and airport transfer coordination'],
    address: 'Bab Baghdad Street, Karbala, Iraq',
    phone: '+964 782 400 0000'
  },
  {
    id: 'rayhaan_rotana',
    name: 'Karbala Rayhaan by Rotana',
    arabicName: 'فندق كربلاء ريحان من روتانا',
    stars: 5,
    distanceToHaram: '1.2 km (Al-Baladiyya district)',
    image: 'assets/zaireen_journey/hotels/hotel_rayhaan_rotana.svg',
    shuttle: 'Regular scheduled shuttle service to Bab al-Qibla',
    rating: 4.7,
    features: ['Renowned 5-star hospitality brand managed by Rotana Hotel Management', '185 rooms and suites designed with contemporary Islamic aesthetic', 'Alcohol-free family-friendly luxury ambiance with 3 dining venues', 'Wellness club, steam rooms, and rejuvenating spa treatments', 'Direct pedestrian walkway connecting to northern shrine entrance'],
    address: 'Al-Baladiyya Square, Karbala, Iraq',
    phone: '+964 771 500 0000'
  },
  {
    id: 'durr_karbala',
    name: 'Durr Al-Karbala Hotel',
    arabicName: 'فندق در كربلاء',
    stars: 4,
    distanceToHaram: '450 meters (Walking distance)',
    image: 'assets/zaireen_journey/hotels/hotel_durr_karbala.svg',
    shuttle: 'Direct walking distance (5-7 minutes stroll through historic street)',
    rating: 4.5,
    features: ['Prime location within immediate walking radius of Bayn al-Haramayn', 'Traditional Iraqi and Persian culinary buffets tailored for zaireen', 'Elevator access and luggage cart assistance directly to rooms', 'Affordable luxury for extended pilgrimage stays and senior travelers', 'Close proximity to exchange bureaus, local bakeries, and markets'],
    address: 'Meesam Al-Tammar Street, Karbala, Iraq',
    phone: '+964 780 123 4567'
  }
];

export const HOLY_SHRINES_DATA = [
  {
    id: 'imam_hussain',
    title: 'Holy Shrine of Imam Hussain (A.S.)',
    arabicTitle: 'العتبة الحسينية المقدسة',
    city: 'Karbala, Iraq',
    epoch: 'Origin 61 AH / Modern Expansion 1445 AH',
    image: 'assets/images/hero_imam_hussain_shrine_twilight.jpg',
    domeHeight: '33 meters (Gilded with 7,200 pure gold bricks)',
    minarets: 'Two 42-meter minarets covered with pure gold leaf and lapis lazuli',
    keyGates: [
      { name: 'Bab al-Qibla (باب القبلة)', role: 'Primary ceremonial southern grand entrance facing Mecca' },
      { name: 'Bab al-Raja (باب الرجاء)', role: 'Direct route towards the sacred Zarih chamber' },
      { name: 'Bab al-Shahadah (باب الشهداء)', role: 'Eastern entrance facing Bayn al-Haramayn' },
      { name: 'Bab al-Karama (باب الكرامة)', role: 'North-eastern corridor with step-free wheelchair access' }
    ],
    ziyaratTitle: 'Ziyarat Warith & Ziyarat Ashura',
    ziyaratExcerpt: 'السَّلامُ عَلَيْكَ يا وارِثَ آدَمَ صَفْوَةِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ نُوحٍ نَبِيِّ اللهِ...',
    ziyaratTranslation: 'Peace be upon you, O inheritor of Adam the chosen of Allah! Peace be upon you, O inheritor of Noah the prophet of Allah!',
    significance: 'The sanctuary enclosing the sacred resting place of Imam Hussain ibn Ali (A.S.), grandson of Prophet Muhammad (S.A.W.), martyred on 10 Muharram 61 AH. The epicentre of global Arbaeen pilgrimage drawing over 21 million pilgrims annually.',
    attribution: 'Verified Sacred Digital Twin Cartography / Astan Al-Hussainiya Official Archives'
  },
  {
    id: 'al_abbas',
    title: 'Holy Shrine of Al-Abbas ibn Ali (A.S.)',
    arabicTitle: 'العتبة العباسية المقدسة',
    city: 'Karbala, Iraq',
    epoch: 'Origin 61 AH / Modern Golden Iwan 1445 AH',
    image: 'assets/pole_navigation/imam_hussain_shrine_karbala_night.jpg',
    domeHeight: '39 meters (Exquisite gold dome restored with monumental calligraphy)',
    minarets: 'Two twin gilded minarets adorned with Quranic Surah Al-Fath inscriptions',
    keyGates: [
      { name: 'Bab al-Qibla (باب قبلة العباس)', role: 'Monumental southern gate facing towards the Hussaini sanctuary' },
      { name: 'Bab al-Furat / Alqami (باب الفرات)', role: 'Eastern gate commemorating the sacred Euphrates water quest' },
      { name: 'Bab al-Imam al-Hadi (باب الإمام الهادي)', role: 'Northern marble gate leading to external pilgrim plaza' },
      { name: 'Bab al-Hawaij (باب الحوائج)', role: 'Renowned gate of supplications and miraculous relief' }
    ],
    ziyaratTitle: 'Ziyarat of Abu Al-Fadl Al-Abbas',
    ziyaratExcerpt: 'سَلامُ اللهِ وَسَلامُ مَلائِكَتِهِ الْمُقَرَّبينَ وَأَنْبِيائِهِ الْمُرْسَلينَ... عَلَيْكَ يا أَبَا الْفَضْلِ الْعَبَّاسَ...',
    ziyaratTranslation: 'The peace of Allah, and the peace of His near angels, His sent prophets... be upon you, O Abu al-Fadl al-Abbas!',
    significance: 'The sacred shrine of Al-Abbas ibn Ali, the loyal standard-bearer (Kafil al-Zaynab) and protector of the camp at Karbala. Renowned throughout world history for supreme valour, sacrifice, and loyalty.',
    attribution: 'Astan Al-Abbasiya Engineering & Cultural Department'
  },
  {
    id: 'imam_ali',
    title: 'Holy Shrine of Imam Ali (A.S.)',
    arabicTitle: 'العتبة العلوية المقدسة',
    city: 'Al-Najaf Al-Ashraf, Iraq',
    epoch: 'Established 170 AH by Harun al-Rashid / Safavid & Modern Golden Courtyard',
    image: 'assets/pole_navigation/imam_ali_shrine_najaf_evening.jpg',
    domeHeight: '42 meters (Golden Dome with sunburst rays & iconic golden crown)',
    minarets: 'Two majestic minarets framing the Golden Iwan (Al-Iwan Al-Dhahabi)',
    keyGates: [
      { name: 'Bab al-Faraj (باب الفرج)', role: 'Western gateway connecting to the historic old city market' },
      { name: 'Bab al-Sa’ah (باب الساعة)', role: 'Clock Tower gate on the eastern courtyard perimeter' },
      { name: 'Bab al-Qibla (باب القبلة)', role: 'Direct southern sanctuary axis with soaring muqarnas vaulting' }
    ],
    ziyaratTitle: 'Ziyarat Ameenullah (زيارة أمين الله)',
    ziyaratExcerpt: 'السَّلامُ عَلَيْكَ يا أَمينَ اللهِ في أَرْضِهِ، وَحُجَّتَهُ عَلى عِبادِهِ...',
    ziyaratTranslation: 'Peace be upon you, O trustee of Allah on His earth, and His proof over His servants, Commander of the Faithful!',
    significance: 'The resting place of Ali ibn Abi Talib (A.S.), cousin and son-in-law of Prophet Muhammad (S.A.W.), fourth Caliph and first Shia Imam. The spiritual commencement point of the Arbaeen walking pilgrimage.',
    attribution: 'Astan Al-Alawiya Holy Archives, Najaf'
  },
  {
    id: 'al_kadhimayn',
    title: 'Holy Shrine of Al-Kadhimayn (A.S.)',
    arabicTitle: 'العتبة الكاظمية المقدسة',
    city: 'Baghdad (Kadhimiya), Iraq',
    epoch: 'Twin Golden Domes dating from 183 AH & 220 AH / Restored 1445 AH',
    image: 'assets/zaireen_journey/shrines/shrine_al_kadhimayn_baghdad.svg',
    domeHeight: 'Dual identical 29m domes tiled in pure burnished gold',
    minarets: 'Four towering golden minarets flanking the twin dome sanctuary',
    keyGates: [
      { name: 'Bab al-Murad (باب المراد)', role: 'Famous "Gate of Wishes" welcoming millions of suppliants' },
      { name: 'Bab al-Qibla (باب القبلة)', role: 'Grand southern ceremonial portal' },
      { name: 'Bab al-Sahib (باب صاحب الزمان)', role: 'Western gate connecting to historic Kadhimiya souks' }
    ],
    ziyaratTitle: 'Ziyarat of the Two Kazim Imams (Musa al-Kadhim & Muhammad al-Jawad)',
    ziyaratExcerpt: 'السَّلامُ عَلَيْكُما يا وَلِيَّيِ اللهِ، السَّلامُ عَلَيْكُما يا حُجَّتَيِ اللهِ...',
    ziyaratTranslation: 'Peace be upon you both, O two intimate friends of Allah! Peace be upon you both, O two authoritative proofs of Allah!',
    significance: 'Houses the sacred tombs of Imam Musa al-Kadhim (7th Imam) and his grandson Imam Muhammad al-Jawad (9th Imam). Located on the western bank of the Tigris River in northern Baghdad.',
    attribution: 'Astan Al-Kadhimiya Holy Shrine Administration'
  },
  {
    id: 'al_askari',
    title: 'Holy Shrine of Al-Askari (A.S.)',
    arabicTitle: 'العتبة العسكرية المقدسة',
    city: 'Samarra, Salah al-Din Governorate, Iraq',
    epoch: '254 AH & 260 AH / Monumental Reconstruction 2008–2024 CE',
    image: 'assets/zaireen_journey/shrines/shrine_al_askari_samarra.svg',
    domeHeight: '68 meters (One of the largest golden domes in the Islamic world, 72,000 gold tiles)',
    minarets: 'Two 36-meter reconstructed golden minarets rebuilt with seismic resilience',
    keyGates: [
      { name: 'Bab al-Qibla (باب القبلة)', role: 'Direct south approach leading to the four holy resting places' },
      { name: 'Bab al-Ghaybah (باب الغيبة)', role: 'Entrance leading to the sacred subterranean Crypt (Sardab al-Ghaybah)' }
    ],
    ziyaratTitle: 'Ziyarat of the Two Askari Imams & Sardab',
    ziyaratExcerpt: 'السَّلامُ عَلَيْكُما يا نُورَيِ اللهِ في ظُلُماتِ الأَرْضِ...',
    ziyaratTranslation: 'Peace be upon you both, O two lights of Allah amidst the darkness of the earth!',
    significance: 'Encloses the holy tombs of Imam Ali al-Hadi (10th Imam), Imam Hasan al-Askari (11th Imam), Lady Narjis Khatoon, and Lady Hakimah. Contains the Sardab (crypt) associated with the 12th Imam, Al-Mahdi (A.J.).',
    attribution: 'Astan Al-Askariya Shrine Restoration Committee'
  }
];

export const OFFLINE_PACK_DATA = {
  checklists: [
    { id: 'c1', label: 'Original Passport (valid for at least 6 months from entry)', category: 'documents', required: true },
    { id: 'c2', label: 'Printed Iraqi Visa Approval / eVisa Certificate (2 physical copies)', category: 'documents', required: true },
    { id: 'c3', label: 'Return Flight Ticket & Airline PNR Confirmation (paper printout)', category: 'documents', required: true },
    { id: 'c4', label: 'Confirmed Hotel Booking Voucher with Arabic Address', category: 'documents', required: true },
    { id: 'c5', label: 'Cash in USD / EUR ($200–$500 in clean, uncreased bills for exchange)', category: 'finance', required: true },
    { id: 'c6', label: 'Local SIM Ready Unlocked Smartphone & Universal Power Adapter (Type C/D/G 220V)', category: 'electronics', required: true },
    { id: 'c7', label: 'Certified Cabin Power Bank (under 20,000 mAh / 74Wh with legible label)', category: 'electronics', required: true },
    { id: 'c8', label: 'Prescription Medications with Doctor’s Note & Multilingual Translation', category: 'health', required: true },
    { id: 'c9', label: 'Comfortable Seamless Walking Shoes / Sandals & Thick Cotton Socks', category: 'gear', required: true },
    { id: 'c10', label: 'Compact Neck Pouch for Passport, Phone & Cash under clothing', category: 'gear', required: true }
  ],
  phrases: [
    { ar: 'السلام عليكم ورحمة الله', en: 'Peace be upon you and God’s mercy', tr: 'As-salāmu ʿalaykum wa-raḥmatullāh', context: 'Universal Islamic greeting upon meeting anyone' },
    { ar: 'إلى الحرمين الشريفين، من فضلك', en: 'To the Two Holy Shrines, please', tr: 'Ilā al-ḥaramayn ash-sharīfayn, min faḍlik', context: 'Essential for taxi drivers in Karbala and Najaf' },
    { ar: 'كم الأجرة إلى كربلاء؟', en: 'How much is the fare to Karbala?', tr: 'Kam al-ujrah ilā Karbalāʾ?', context: 'Inquiring taxi / shuttle price prior to boarding' },
    { ar: 'أين باب القبلة؟', en: 'Where is the Qibla Gate?', tr: 'Ayna bāb al-qiblah?', context: 'Finding the primary southern shrine gate' },
    { ar: 'أريد تصريف الدولار إلى الدينار', en: 'I want to exchange USD to Iraqi Dinar', tr: 'Urīdu taṣrīf ad-dūlār ilā ad-dīnār', context: 'At bank or licensed currency exchange desks' },
    { ar: 'أين مركز إرشاد التائهين؟', en: 'Where is the Lost Persons Guidance Center?', tr: 'Ayna markaz irshād at-tā’ihīn?', context: 'If a companion, elderly relative, or child is separated' },
    { ar: 'شكراً جزيلاً، جزاكم الله خيراً', en: 'Thank you very much, may Allah reward you', tr: 'Shukran jazīlan, jazākumullāhu khayran', context: 'Expressing gratitude to Astan Khuddam or Mawkib hosts' },
    { ar: 'أنا مريض، أحتاج إلى طبيب أو إسعاف', en: 'I am unwell, I need a doctor or ambulance', tr: 'Anā marīḍ, aḥtāju ilā ṭabīb aw isʿāf', context: 'Medical emergency inside or outside the courtyards' }
  ],
  emergencyContacts: [
    { title: 'Iraqi National Ambulance (Paramedics)', number: '122', type: 'toll_free', desc: 'Direct 24/7 medical dispatch throughout all Iraqi governorates' },
    { title: 'Iraqi National Police Emergency', number: '104', type: 'toll_free', desc: 'Sovereign police dispatch for security, incidents, and accidents' },
    { title: 'Iraqi Civil Defense & Fire Rescue', number: '115', type: 'toll_free', desc: 'Emergency rescue, building safety, and fire department' },
    { title: 'Holy Shrine of Imam Hussain Central Helpdesk', number: '+964 32 322 0000', type: 'landline', desc: 'Direct multilingual pilgrim support and lost person registry' },
    { title: 'Holy Shrine of Al-Abbas Guidance Desk', number: '+964 32 322 0001', type: 'landline', desc: 'Pilgrim guidance, accessibility carts, and lost property dispatch' },
    { title: 'Al-Safeer Emergency Surgical Hospital Karbala', number: '+964 32 323 1111', type: 'hospital', desc: 'Adjacent to Imam Hussain Shrine with 24/7 free acute care for pilgrims' }
  ],
  currencyRates: {
    baseRateIQDPerUSD: 1315,
    currencies: [
      { code: 'USD', name: 'US Dollar', symbol: '$', rateToIQD: 1315 },
      { code: 'EUR', name: 'Euro', symbol: '€', rateToIQD: 1420 },
      { code: 'GBP', name: 'British Pound', symbol: '£', rateToIQD: 1680 },
      { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', rateToIQD: 4.73 },
      { code: 'INR', name: 'Indian Rupee', symbol: '₹', rateToIQD: 15.75 },
      { code: 'IRR', name: 'Iranian Toman (10k IRR)', symbol: 'Toman', rateToIQD: 22.0 }
    ]
  }
};
