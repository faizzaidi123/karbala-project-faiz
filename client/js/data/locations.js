/**
 * Karbala Locations Database: Present-Day & 61 AH Historical
 * Normalized coordinate space: [x, y] in percentage of map grid (0-100)
 * Allows accurate comparative alignment between present shrines and 61 AH topography.
 */

export const PRESENT_DAY_LOCATIONS = [
  {
    id: 'shrine_hussain',
    historicalId: 'historical_maqtal',
    name: 'Holy Shrine of Imam Hussain (AS)',
    arabicName: 'العتبة الحسينية المقدسة',
    title: 'Sanctuary of the Master of Martyrs',
    category: 'shrine',
    coords: { x: 44.5, y: 55.5 }, // Central coordinate
    image: 'assets/images/shrine_27.jpg',
    thumbnail: 'assets/images/shrine_27.jpg',
    imageAttribution: 'Imam Hussain Holy Shrine Media Office (imamhussain.gov.iq)',
    intro: 'The sacred burial sanctuary of Imam Hussain ibn Ali (AS), the grandson of Prophet Muhammad (SAW), his sons Ali al-Akbar and Ali al-Asghar, and the faithful companions who attained martyrdom on Ashura in 61 AH.',
    historicalCorrespondence: 'Direct historical continuity: The grave chamber (Al-Ha’ir al-Husayni) rests directly over the lower depression (Gowd-e Qatlgah) where the final stand took place.',
    certaintyLevel: 'HISTORICALLY_ATTESTED',
    certaintyKey: 'maqtal_hussain',
    audioTrack: {
      title: 'Ziyarat Warith (Recitation)',
      artist: 'Aba Thar al-Halwaji',
      duration: '4:32',
      type: 'ziyarat'
    },
    ziyarat: {
      title: 'Ziyarat Warith',
      arabicTitle: 'زيارة وارث',
      excerptArabic: 'السَّلامُ عَلَيْكَ يا وارِثَ آدَمَ صَفْوَةِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ نُوحٍ نَبِيِّ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ إِبْراهِيمَ خَلِيلِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ مُوسى كَلِيمِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ عِيسى رُوحِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ مُحَمَّدٍ حَبِيبِ اللهِ...',
      transliteration: 'Assalamu alayka ya waritha Adama safwatillah, assalamu alayka ya waritha Nuhin nabiyyillah, assalamu alayka ya waritha Ibrahima khalilillah...',
      translation: 'Peace be upon you, O inheritor of Adam, the chosen of Allah. Peace be upon you, O inheritor of Noah, the Prophet of Allah. Peace be upon you, O inheritor of Abraham, the friend of Allah. Peace be upon you, O inheritor of Moses, the one addressed by Allah. Peace be upon you, O inheritor of Jesus, the Spirit of Allah. Peace be upon you, O inheritor of Muhammad, the beloved of Allah...',
      etiquette: 'It is recommended to perform Ghusl (ritual ablution), wear pure garments, approach Bab al-Qibla with serenity, recite the Takbir seven times, and proceed with humility toward the holy Zarih.'
    },
    accessibility: {
      wheelchairAccess: 'Full universal step-free access via Bab al-Qibla, Bab al-Rasool, and Bab al-Karama with automated gentle ramps.',
      golfCartShuttle: 'Complimentary electric golf carts operate continuously around the external perimeter linking to Bab Baghdad.',
      elevators: 'Internal hydraulic lifts installed for basement pilgrimage halls (Al-Hujjah, Bab al-Rasool subterranean levels).',
      medicalCenter: 'Safir al-Hussain Emergency Medical Complex located adjacent to Bab al-Qibla (24/7 staff).',
      sensoryTactile: 'Braille directional signage at main portals and tactile directional paving along primary pathways.'
    },
    navigation: {
      gates: ['Bab al-Qibla (South)', 'Bab al-Rasool (South-West)', 'Bab al-Sidra (North-West)', 'Bab al-Salama (North)', 'Bab al-Shuhada (East)'],
      distanceFromBain: '0 m (Western terminus of Bain al-Haramayn)',
      walkingTime: 'Immediate',
      shuttleAvailable: true
    }
  },
  {
    id: 'shrine_abbas',
    historicalId: 'historical_abbas_fall',
    name: 'Holy Shrine of Al-Abbas (AS)',
    arabicName: 'العتبة العباسية المقدسة',
    title: 'Sanctuary of Abu al-Fadl al-Abbas (Qamar Bani Hashim)',
    category: 'shrine',
    coords: { x: 57.5, y: 38.5 },
    image: 'assets/images/shrine_38.jpg',
    thumbnail: 'assets/images/shrine_38.jpg',
    imageAttribution: 'Al-Abbas Holy Shrine / AlKafeel Network (alkafeel.net)',
    intro: 'The magnificent holy sanctuary of Al-Abbas ibn Ali ibn Abi Talib (AS), the standard-bearer (Alamdar) of Imam Hussain on Ashura, renowned for unyielding loyalty, chivalry, and sacrifice at the banks of the Euphrates.',
    historicalCorrespondence: 'Direct historical continuity: Al-Abbas fell near the banks of the Al-Alqami canal while attempting to bring water for the thirsty children. His shrine marks his burial location separated from the main martyrs’ tomb.',
    certaintyLevel: 'HISTORICALLY_ATTESTED',
    certaintyKey: 'maqtal_hussain',
    audioTrack: {
      title: 'Ziyarat of Abu al-Fadl al-Abbas (AS)',
      artist: 'Sheikh Maitham al-Tammar',
      duration: '3:50',
      type: 'ziyarat'
    },
    ziyarat: {
      title: 'Ziyarat of Al-Abbas (AS)',
      arabicTitle: 'زيارة أبي الفضل العباس عليه السلام',
      excerptArabic: 'سَلامُ اللهِ وَسَلامُ مَلائِكَتِهِ الْمُقَرَّبِينَ، وَأَنْبِيائِهِ الْمُرْسَلِينَ، وَعِبادِهِ الصّالِحِينَ، وَجَمِيعِ الشُّهَداءِ وَالصِّدِّيقِينَ، الزّاكِياتُ الطَّيِّباتُ فِيما تَغْتَدِي وَتَرُوحُ، عَلَيْكَ يا ابْنَ أَمِيرِ الْمُؤْمِنِينَ، أَشْهَدُ لَكَ بِالتَّسْلِيمِ وَالتَّصْدِيقِ وَالْوَفاءِ وَالنَّصِيحَةِ...',
      transliteration: 'Salamullahi wa salamu mala’ikatihil muqarrabin, wa anbiya’ihil mursalin, wa ibadihis salihin... alayka yabna Amir al-Mu’minin...',
      translation: 'The peace of Allah, the peace of His archangels, His commissioned prophets, His righteous servants, and all the martyrs and truthful ones be upon you, O son of the Commander of the Faithful. I bear witness that you submitted, believed, fulfilled your pledge, and gave sincere counsel...',
      etiquette: 'Approach with profound reverence, recognizing his station as Bab al-Hawā’ij (the Gateway of Needs). Enter through Bab al-Qibla facing the golden iwan.'
    },
    accessibility: {
      wheelchairAccess: 'Universal level entrances at Bab al-Qibla, Bab al-Furat (Al-Alqami Gate), and Bab al-Hawaij with motorized chair lending desk.',
      golfCartShuttle: 'Electric cart routes connecting Bab al-Furat with parking hubs on the outer ring road.',
      elevators: 'High-capacity glass elevators serving the subterranean prayer courtyards.',
      medicalCenter: 'Alkafeel Specialized Clinic stationed beside Bab al-Hawaij.',
      sensoryTactile: 'Auditory assist loop in the central prayer chambers and tactile floor guides.'
    },
    navigation: {
      gates: ['Bab al-Qibla (South)', 'Bab al-Furat / Al-Alqami (East)', 'Bab al-Hawaij (North-West)', 'Bab Baghdad (North)'],
      distanceFromBain: '0 m (Eastern terminus of Bain al-Haramayn)',
      walkingTime: 'Immediate',
      shuttleAvailable: true
    }
  },
  {
    id: 'bain_al_haramayn',
    historicalId: 'historical_marakah',
    name: 'Bain al-Haramayn',
    arabicName: 'ما بين الحرمين الشريفين',
    title: 'The Sacred Esplanade Between the Two Holy Shrines',
    category: 'esplanade',
    coords: { x: 51.0, y: 47.0 },
    image: 'assets/images/shrine_14.jpg',
    thumbnail: 'assets/images/shrine_14.jpg',
    imageAttribution: 'Holy Shrines of Karbala Documentation Center',
    intro: 'The 378-meter paved ceremonial plaza framed by date palm colonnades that connects the Holy Shrine of Imam Hussain with the Holy Shrine of Al-Abbas. Thousands of pilgrims walk this corridor day and night in perpetual remembrance.',
    historicalCorrespondence: 'The geographical corridor between the two shrines corresponds roughly to the space between the forward resistance line and the path to the Al-Alqami stream.',
    certaintyLevel: 'TRADITIONALLY_ASSOCIATED',
    certaintyKey: 'maqtal_hussain',
    audioTrack: {
      title: 'Spiritual Atmosphere of Bain al-Haramayn',
      artist: 'Karbala Soundscape Archive',
      duration: '5:10',
      type: 'ambiance'
    },
    ziyarat: {
      title: 'Supplication upon Walking Between the Shrines',
      arabicTitle: 'دعاء السعي بين الحرمين',
      excerptArabic: 'اللّهُمَّ إِلَيْكَ تَوَجَّهْتُ، وَبِكَ اعْتَصَمْتُ، وَعَلَيْكَ تَوَكَّلْتُ، اللّهُمَّ اجْعَلْنِي مِنْ أَوْجَهِ مَنْ تَوَجَّهَ إِلَيْكَ، وَأَقْرَبِ مَنْ تَقَرَّبَ إِلَيْكَ...',
      transliteration: 'Allahumma ilayka tawajjahtu, wa bika-tasamtu, wa alayka tawakkaltu...',
      translation: 'O Allah, unto You I have turned my face, to You I have held fast, and in You I have placed my trust. O Allah, make me among those most distinguished in turning toward You...',
      etiquette: 'Walk at a deliberate pace, keeping sight of both golden domes. Pilgrims traditionally lower their gaze and recite salawat along this path.'
    },
    accessibility: {
      wheelchairAccess: '100% flat marble flooring across the full 378-meter span with zero step impediments.',
      golfCartShuttle: 'Dedicated middle lane reserved exclusively for mobility-impaired visitors and electric wheelchairs.',
      elevators: 'Underground passage elevators located at mid-span.',
      medicalCenter: 'Red Crescent First Aid Stations situated at mid-plaza on both sides.',
      sensoryTactile: 'Misting fan cooling towers and tactile warning pavers along perimeter edges.'
    },
    navigation: {
      gates: ['Western entry: Bab al-Shuhada of Imam Hussain Shrine', 'Eastern entry: Bab al-Qibla of Al-Abbas Shrine'],
      distanceFromBain: 'Direct corridor (378 m length)',
      walkingTime: '4 - 6 minutes',
      shuttleAvailable: true
    }
  },
  {
    id: 'tall_zaynabiyya_present',
    historicalId: 'historical_tall_zaynabiyya',
    name: 'Tall al-Zaynabiyya',
    arabicName: 'المقام التل الزينبي الشريف',
    title: 'Sanctuary of Lady Zaynab’s Hillock',
    category: 'maqam',
    coords: { x: 41.0, y: 53.0 },
    image: 'assets/images/shrine_22.jpg',
    thumbnail: 'assets/images/shrine_22.jpg',
    imageAttribution: 'Imam Hussain Holy Shrine Media Office',
    intro: 'An elevated sanctuary building marking the sandy knoll where Lady Zaynab bint Ali (SA) stood to observe the battlefield and call out toward her brother Imam Hussain during the climactic moments of Ashura.',
    historicalCorrespondence: 'The current elevated shrine retains the location of the natural ridge that overlooked the lower depression where Imam Hussain fought.',
    certaintyLevel: 'TRADITIONALLY_ASSOCIATED',
    certaintyKey: 'tall_zaynabiyya',
    audioTrack: {
      title: 'The Lamentation of Sayyida Zaynab',
      artist: 'Spiritual Recitation',
      duration: '4:15',
      type: 'ziyarat'
    },
    ziyarat: {
      title: 'Ziyarat of Sayyida Zaynab (SA)',
      arabicTitle: 'زيارة عقيلة بني هاشم زينب الكبرى',
      excerptArabic: 'السَّلامُ عَلَيْكِ يا بِنْتَ سَيِّدِ الأَنْبِياءِ، السَّلامُ عَلَيْكِ يا بِنْتَ صاحِبِ الحَوْضِ وَاللِّواءِ، السَّلامُ عَلَيْكِ يا مَنْ شاطَرَتِ الحُسَيْنَ فِي مَصائِبِهِ...',
      transliteration: 'Assalamu alayki ya binta sayyidil anbiya’, assalamu alayki ya man shataratil Husayna fi masa’ibih...',
      translation: 'Peace be upon you, O daughter of the Master of Prophets. Peace be upon you, O daughter of the Bearer of the Pool and the Banner. Peace be upon you, O you who shared in all the tribulations of Hussain...',
      etiquette: 'Reflect upon the courage, eloquence, and steadfast faith of the Heroine of Karbala. Read with quiet dignity.'
    },
    accessibility: {
      wheelchairAccess: 'Newly modernized entrance with ramp and wide automatic glass doors.',
      golfCartShuttle: 'Accessible directly from the western courtyard of the Imam Hussain shrine.',
      elevators: 'Elevators connect the upper observation hall with lower prayer spaces.',
      medicalCenter: 'First Aid tent directly opposite the southern arcade.',
      sensoryTactile: 'Tactile floor paths leading from the shrine perimeter.'
    },
    navigation: {
      gates: ['Main Portal facing Bab al-Sidra of Imam Hussain Shrine'],
      distanceFromBain: '65 meters west of Imam Hussain courtyard',
      walkingTime: '1 minute',
      shuttleAvailable: true
    }
  },
  {
    id: 'mukhayam_present',
    historicalId: 'historical_encampment',
    name: 'Al-Mukhayam al-Husayni',
    arabicName: 'المخيم الحسيني الشريف',
    title: 'Sanctuary of the Encampment of Imam Hussain',
    category: 'maqam',
    coords: { x: 33.0, y: 68.0 },
    image: 'assets/images/shrine_25.jpg',
    thumbnail: 'assets/images/shrine_25.jpg',
    imageAttribution: 'Department of Religious Sites, Karbala',
    intro: 'A revered domed sanctuary complex approximately 500 meters southwest of the Holy Shrine of Imam Hussain, marking the traditional grounds where the tents of the Prophet’s family and companions were pitched.',
    historicalCorrespondence: 'Approximate historical association: While early sources confirm the camp stood on higher ground southwest of the battlefield, centuries of river shifting and urbanization mean the present sanctuary represents an approximate commemorative site.',
    certaintyLevel: 'APPROXIMATE_LOCATION',
    certaintyKey: 'mukhayam_camp',
    audioTrack: {
      title: 'Remembrance of the Tents of Karbala',
      artist: 'Spiritual Monologue',
      duration: '3:40',
      type: 'ambiance'
    },
    ziyarat: {
      title: 'Supplication at Al-Mukhayam',
      arabicTitle: 'دعاء زيارة المخيم الشريف',
      excerptArabic: 'السَّلامُ عَلى خِيامِ أَهْلِ بَيْتِ الرَّسُولِ، السَّلامُ عَلى الأَطْفالِ العِطاشِ، السَّلامُ عَلى النِّسْوَةِ الصّابِراتِ، السَّلامُ عَلى زَيْنِ العابِدِينَ فِي شِدَّةِ سَقَمِهِ...',
      transliteration: 'Assalamu ala khiyami ahli baytir rasul, assalamu alal atfalil itash...',
      translation: 'Peace be upon the tents of the Household of the Messenger. Peace be upon the thirsty children. Peace be upon the steadfast women. Peace be upon Zayn al-Abidin in the severity of his illness...',
      etiquette: 'Recite prayers for the oppressed, contemplate the thirst endured by the children, and maintain hushed veneration.'
    },
    accessibility: {
      wheelchairAccess: 'Gradual ramp entrance at the main southern portal with wide courtyard corridors.',
      golfCartShuttle: 'Electric cart service operates regularly between the Imam Hussain shrine perimeter and Al-Mukhayam gate.',
      elevators: 'Ground-level sanctuary layout with minimal stairs.',
      medicalCenter: 'Local healthcare dispensary situated adjacent to the square.',
      sensoryTactile: 'Clear visual wayfinding signs and Braille boards.'
    },
    navigation: {
      gates: ['Bab al-Mukhayam (East entrance onto Al-Mukhayam Street)'],
      distanceFromBain: '520 meters southwest of Imam Hussain Shrine',
      walkingTime: '7 minutes',
      shuttleAvailable: true
    }
  },
  {
    id: 'kaff_right_present',
    historicalId: 'historical_kaff_right',
    name: 'Maqam Kaff al-Abbas (Right Hand)',
    arabicName: 'مقام كف العباس الأيمن',
    title: 'Memorial of the Amputation of the Right Hand',
    category: 'maqam',
    coords: { x: 64.0, y: 34.0 },
    image: 'assets/images/shrine_10.jpg',
    thumbnail: 'assets/images/shrine_10.jpg',
    imageAttribution: 'AlKafeel Cultural Heritage Archive (alkafeel.net)',
    intro: 'A modest octagonal domed kiosk located in the narrow alleys of the Bab Baghdad quarter, northeast of the Al-Abbas shrine, commemorating the spot where Al-Abbas’s right hand was severed while protecting the waterskin.',
    historicalCorrespondence: 'Traditional neighborhood association: Commemorates the path Al-Abbas took through date orchards retreating from the Alqami canal.',
    certaintyLevel: 'TRADITIONALLY_ASSOCIATED',
    certaintyKey: 'kaff_abbas_right_left',
    audioTrack: {
      title: 'Eulogy for the Loyal Standard Bearer',
      artist: 'Marthiya Archive',
      duration: '3:15',
      type: 'ziyarat'
    },
    ziyarat: {
      title: 'Salam upon the Amputated Hands',
      arabicTitle: 'سلام على الكفين الطاهرين',
      excerptArabic: 'السَّلامُ عَلى الكَفِّ القَطِيعِ، السَّلامُ عَلى الساقِي العَطْشانِ، فَلَنِعْمَ الصّابِرُ المُجاهِدُ المُحامِي النّاصِرُ وَالأَخُ الدّافِعُ عَنْ أَخِيهِ...',
      transliteration: 'Assalamu alal kaffil qati’, assalamu alas saqil atshan...',
      translation: 'Peace be upon the severed hand, peace be upon the thirsty water-bearer! What an excellent enduring warrior, protector, helper, and brother defending his brother...',
      etiquette: 'Short visit while passing; pilgrims recite Surah al-Fatiha and offer salawat.'
    },
    accessibility: {
      wheelchairAccess: 'Street-level access from Bab Baghdad market street with paved stones; narrow alleyway during peak crowds.',
      golfCartShuttle: 'Shuttle drops off at the main ring street (70m away).',
      elevators: 'Single-level shrine.',
      medicalCenter: 'Shared clinic with Al-Abbas Holy Shrine network.',
      sensoryTactile: 'Clear exterior bronze grille.'
    },
    navigation: {
      gates: ['Direct street entrance from Zuqaq al-Kaff'],
      distanceFromBain: '110 meters northeast of Al-Abbas Shrine',
      walkingTime: '2 minutes',
      shuttleAvailable: false
    }
  },
  {
    id: 'kaff_left_present',
    historicalId: 'historical_kaff_left',
    name: 'Maqam Kaff al-Abbas (Left Hand)',
    arabicName: 'مقام كف العباس الأيسر',
    title: 'Memorial of the Amputation of the Left Hand',
    category: 'maqam',
    coords: { x: 62.5, y: 44.5 },
    image: 'assets/images/shrine_12.jpg',
    thumbnail: 'assets/images/shrine_12.jpg',
    imageAttribution: 'AlKafeel Cultural Heritage Archive (alkafeel.net)',
    intro: 'A commemorative domed shrine situated in the Bab al-Khan district southeast of the Al-Abbas shrine, marking the traditional location where Al-Abbas had his left hand struck while clutching the waterskin to his chest.',
    historicalCorrespondence: 'Traditional neighborhood association: Represents the ongoing struggle of Al-Abbas as he made his final heroic stand.',
    certaintyLevel: 'TRADITIONALLY_ASSOCIATED',
    certaintyKey: 'kaff_abbas_right_left',
    audioTrack: {
      title: 'Ziyarat of the Selfless Brother',
      artist: 'Spiritual Recitation',
      duration: '3:20',
      type: 'ziyarat'
    },
    ziyarat: {
      title: 'Tribute to Abu al-Fadl',
      arabicTitle: 'زيارة الوفاء والإيثار',
      excerptArabic: 'أَشْهَدُ أَنَّكَ قَدْ بالَغْتَ فِي النَّصِيحَةِ، وَأَعْطَيْتَ غايَةَ المَجْهُودِ، فَبَعَثَكَ اللهُ فِي الشُّهَداءِ، وَجَعَلَ رُوحَكَ مَعَ أَرْواحِ السُّعَداءِ...',
      transliteration: 'Ashhadu annaka qad balaghta fin nasiha, wa a’tayta ghayatal majhud...',
      translation: 'I bear witness that you exerted the utmost sincere counsel and gave the maximum of your effort, so Allah raised you among the martyrs and placed your soul with the souls of the blissful...',
      etiquette: 'Pilgrims pay respect and contemplate the pinnacle of loyalty (ithar).'
    },
    accessibility: {
      wheelchairAccess: 'Level access directly from the pedestrian street; door threshold ramp installed.',
      golfCartShuttle: 'Nearest golf cart terminal is at Bab al-Qibla of Al-Abbas shrine.',
      elevators: 'Single level structure.',
      medicalCenter: 'First Aid station located at Bab al-Khan square.',
      sensoryTactile: 'Illuminated brass marker plaque.'
    },
    navigation: {
      gates: ['Corner portal at Bab al-Khan street'],
      distanceFromBain: '90 meters southeast of Al-Abbas Shrine',
      walkingTime: '2 minutes',
      shuttleAvailable: false
    }
  },
  {
    id: 'maqam_ali_akbar_present',
    historicalId: 'historical_ali_akbar',
    name: 'Maqam Ali al-Akbar (AS)',
    arabicName: 'مقام علي الأكبر عليه السلام',
    title: 'Memorial of the Martyrdom of Ali al-Akbar',
    category: 'maqam',
    coords: { x: 42.0, y: 60.5 },
    image: 'assets/images/shrine_19.jpg',
    thumbnail: 'assets/images/shrine_19.jpg',
    imageAttribution: 'Karbala Directorate of Heritage & Endowments',
    intro: 'A commemorative niche and shrine in the alleys north of the Imam Hussain shrine marking where Ali al-Akbar, the 18-year-old eldest son of Imam Hussain who bore extraordinary physical and moral resemblance to the Prophet, fell in battle.',
    historicalCorrespondence: 'Traditional neighborhood association: His actual sacred body rests buried at the feet of Imam Hussain inside the main Zarih room.',
    certaintyLevel: 'TRADITIONALLY_ASSOCIATED',
    certaintyKey: 'maqtal_hussain',
    audioTrack: {
      title: 'Lamentation for Ali al-Akbar',
      artist: 'Traditional Maqtal Recitation',
      duration: '4:02',
      type: 'ziyarat'
    },
    ziyarat: {
      title: 'Salam on Ali al-Akbar',
      arabicTitle: 'السَّلامُ عَلى عَلِيٍّ الكَبِيرِ',
      excerptArabic: 'السَّلامُ عَلَيْكَ يا ابْنَ رَسُولِ اللهِ، السَّلامُ عَلَيْكَ يا ابْنَ نَبِيِّ اللهِ، السَّلامُ عَلَيْكَ يا ابْنَ أَمِيرِ المُؤْمِنِينَ، السَّلامُ عَلَيْكَ يا ابْنَ الحُسَيْنِ الشَّهِيدِ...',
      transliteration: 'Assalamu alayka yabna Rasulillah, assalamu alayka yabna Nabiyyillah, assalamu alayka yabna Amir al-Mu’minin...',
      translation: 'Peace be upon you, O son of the Messenger of Allah. Peace be upon you, O son of the Prophet of Allah. Peace be upon you, O son of the Commander of the Faithful. Peace be upon you, O son of Hussain the Martyr...',
      etiquette: 'Reflect upon the Prophet’s likeness and the heartbreaking parting words of Imam Hussain: "Ala al-dunya ba’daka al-ifa" (After you, may dust be upon this worldly life).'
    },
    accessibility: {
      wheelchairAccess: 'Paved street level; assistance may be required during busy pilgrimage hours.',
      golfCartShuttle: 'Street perimeter access only.',
      elevators: 'Ground structure.',
      medicalCenter: 'Mobile paramedics stationed nearby.',
      sensoryTactile: 'Decorative tile signage in Arabic, Persian, Urdu, and English.'
    },
    navigation: {
      gates: ['Zuqaq Ali al-Akbar entryway'],
      distanceFromBain: '150 meters northwest of Imam Hussain courtyard',
      walkingTime: '2.5 minutes',
      shuttleAvailable: false
    }
  },
  {
    id: 'maqam_ali_asghar_present',
    historicalId: 'historical_ali_asghar',
    name: 'Maqam Ali al-Asghar (AS)',
    arabicName: 'مقام عبد الله الرضيع (علي الأصغر)',
    title: 'Memorial of the Martyrdom of the Infant Abdullah',
    category: 'maqam',
    coords: { x: 47.0, y: 62.0 },
    image: 'assets/images/shrine_20.jpg',
    thumbnail: 'assets/images/shrine_20.jpg',
    imageAttribution: 'Karbala Directorate of Heritage & Endowments',
    intro: 'A reverently visited commemorative shrine featuring a symbolic cradle, marking the tragedy of the 6-month-old infant son of Imam Hussain, struck by a three-pronged arrow on his father’s chest after being held aloft to request water.',
    historicalCorrespondence: 'Traditional neighborhood association: His actual resting place is interred on the chest of his holy father Imam Hussain inside the main Zarih.',
    certaintyLevel: 'TRADITIONALLY_ASSOCIATED',
    certaintyKey: 'maqtal_hussain',
    audioTrack: {
      title: 'Elegy for the Innocent Infant',
      artist: 'Spiritual Lamentation',
      duration: '3:30',
      type: 'ziyarat'
    },
    ziyarat: {
      title: 'Salam on Abdullah the Infant',
      arabicTitle: 'السَّلامُ عَلى عَبْدِ اللهِ الرَّضِيعِ',
      excerptArabic: 'السَّلامُ عَلى عَبْدِ اللهِ بْنِ الحُسَيْنِ الطِّفْلِ الرَّضِيعِ، المَرْمِيِّ الصَّرِيعِ، المُتَشَحِّطِ دَماً، المُصَعَّدِ دَمُهُ فِي السَّماءِ، المَذْبُوحِ بِالسَّهْمِ فِي حِجْرِ أَبِيهِ...',
      transliteration: 'Assalamu ala Abdillahibnil Husaynit tiflir radi’, al-marmiyyis sari’...',
      translation: 'Peace be upon Abdullah, the son of Hussain, the infant child, struck down and slain, drenched in his pure blood, whose blood was cast upward toward the sky, slaughtered by an arrow while in the lap of his father...',
      etiquette: 'Recite Salawat, make prayers for oppressed children worldwide, and contemplate the depth of sacrifice.'
    },
    accessibility: {
      wheelchairAccess: 'Ground level access from the street; ramp at entrance door.',
      golfCartShuttle: 'Connects at Bab al-Sidra perimeter.',
      elevators: 'Single level.',
      medicalCenter: 'Imam Hussain Holy Shrine medical center within 180 meters.',
      sensoryTactile: 'Subtle green illumination and tactile bronze latticework.'
    },
    navigation: {
      gates: ['Zuqaq Bab al-Salamah intersection'],
      distanceFromBain: '120 meters north of Imam Hussain courtyard',
      walkingTime: '2 minutes',
      shuttleAvailable: false
    }
  },
  {
    id: 'maqam_imam_sadiq_present',
    historicalId: 'historical_alqami_groves',
    name: 'Maqam Imam Ja’far al-Sadiq (AS)',
    arabicName: 'مقام الإمام جعفر الصادق عليه السلام',
    title: 'Historic Station on the Banks of the Alqami',
    category: 'maqam',
    coords: { x: 67.0, y: 22.0 },
    image: 'assets/images/shrine_4.jpg',
    thumbnail: 'assets/images/shrine_4.jpg',
    imageAttribution: 'Department of Holy Sites, Karbala',
    intro: 'A historic sanctuary north of the shrines on the traditional path of the Alqami canal, commemorating where Imam Ja’far al-Sadiq (the 6th Shia Imam) performed ritual Ghusl and prayed before proceeding barefoot for the Ziyarat of his grandfather.',
    historicalCorrespondence: 'Commemorates an 8th-century (early Abbasid) visit where Imam al-Sadiq taught the authentic Ziyarat texts and designated the sacred boundaries.',
    certaintyLevel: 'TRADITIONALLY_ASSOCIATED',
    certaintyKey: 'alqami_river',
    audioTrack: {
      title: 'Supplication taught by Imam al-Sadiq (AS)',
      artist: 'Supplication Archive',
      duration: '4:45',
      type: 'ziyarat'
    },
    ziyarat: {
      title: 'Supplication of Preparation for Ziyarat',
      arabicTitle: 'دعاء الاستعداد للزيارة',
      excerptArabic: 'اللّهُمَّ اجْعَلْهُ لِي نُوراً وَطَهُوراً وَحِرْزاً وَأَمَناً مِنْ كُلِّ خَوْفٍ، وَشِفاءً مِنْ كُلِّ داءٍ وَسَقَمٍ...',
      transliteration: 'Allahummaj’alhu li nuran wa tahuran wa hirzan...',
      translation: 'O Allah, make it for me a light, a purification, a protection and security against all fear, and a cure for every disease and ailment...',
      etiquette: 'Traditionally, pilgrims recite this preparation prayer before entering the inner sanctum of the holy shrines.'
    },
    accessibility: {
      wheelchairAccess: 'Spacious perimeter courtyard with gentle ramp into the main prayer room.',
      golfCartShuttle: 'Electric cart terminal located directly in front of the gardens.',
      elevators: 'Single level garden pavilion.',
      medicalCenter: 'First Aid kiosk stationed beside the palm park.',
      sensoryTactile: 'Surrounded by tranquil date palm trees and flowing water channels.'
    },
    navigation: {
      gates: ['Shari’ al-Sadra north approach'],
      distanceFromBain: '850 meters northeast of Al-Abbas Shrine',
      walkingTime: '12 minutes',
      shuttleAvailable: true
    }
  }
];

export const HISTORICAL_61AH_LOCATIONS = [
  {
    id: 'historical_encampment',
    presentId: 'mukhayam_present',
    name: 'Encampment of Imam Hussain (Khaymagah / Fustat)',
    arabicName: 'مخيم الإمام الحسين وأنصاره (الفسطاط)',
    title: 'The Tents of the Holy Household and Companions',
    category: 'camp',
    coords: { x: 33.0, y: 68.0 },
    image: 'assets/images/shrine_25.jpg',
    period: '61 AH (October 680 CE)',
    certaintyLevel: 'APPROXIMATE_LOCATION',
    certaintyKey: 'mukhayam_camp',
    noticeText: 'Approximate historical association: Located on higher ground southwest of the battlefield depression.',
    summary: 'The defensive campsite of Imam Hussain, his family members (women, children, the ailing Imam Zayn al-Abidin), and approximately 72 loyal companions.',
    detailedAccount: `Upon their arrival on 2 Muharram 61 AH, Imam Hussain pitched his tents on slightly elevated desert ground to protect against sudden flash flooding and cavalry rushes. 

On the eve of Ashura (9 Muharram), the Imam ordered his companions to dig a deep trench (khandaq) behind the tents in a crescent shape, filling it with firewood, reeds, and dry brush. When the battle commenced on the morning of 10 Muharram, this trench was set ablaze, successfully preventing Umar ibn Sa’ad's cavalry from surrounding the camp from the rear and forcing the Umayyad forces to attack exclusively from the front.

The camp contained distinct pavilions: the central tent of Imam Hussain, the tent of the women and children under the supervision of Lady Zaynab and Lady Rubab, the pavilion of Al-Abbas and the sons of Umm al-Banin, and the outer perimeter tents of the companions.`,
    peopleConnected: ['Imam Hussain (AS)', 'Al-Abbas ibn Ali', 'Lady Zaynab bint Ali', 'Imam Zayn al-Abidin', 'Lady Rubab', 'Habib ibn Madhahir'],
    sources: [
      { author: 'Abu Mikhnaf (d. 157 AH)', work: 'Maqtal al-Husayn', citation: 'Description of the Camp and Trench' },
      { author: 'Al-Tabari', work: 'Tarikh', citation: 'Vol. 5, pp. 421-423' },
      { author: 'Shaykh al-Mufid', work: 'Kitab al-Irshad', citation: 'p. 372' }
    ]
  },
  {
    id: 'historical_khandaq',
    presentId: null,
    name: 'Defensive Trench and Fire Barrier (Al-Khandaq)',
    arabicName: 'خندق الدفاع وساتر النار خلف الخيام',
    title: 'Crescent Defensive Barrier Protecting the Camp',
    category: 'defense',
    coords: { x: 30.0, y: 72.0 },
    image: 'assets/images/shrine_14.jpg',
    period: '61 AH (Night of 9-10 Muharram)',
    certaintyLevel: 'INTERPRETIVE_RECONSTRUCTION',
    certaintyKey: 'mukhayam_camp',
    noticeText: 'Interpretive Reconstruction: Engineered tactical barrier described in primary military accounts.',
    summary: 'A semicircular ditch excavated behind the tents by the companions and set alight with brushwood at dawn on Ashura.',
    detailedAccount: `Historians recount that on the night of Ashura, Imam Hussain inspected the topography surrounding the tents and instructed his companions to dig a curving trench behind the camp. 

When Shimr ibn Dhil-Jawshan rode forward early on Ashura morning attempting to strike the camp from behind, he was blocked by the roaring trench fire. Classical narratives record that Shimr shouted insults across the flames, to which Muslim ibn Awsaja sought permission to loose an arrow at him, but Imam Hussain restrained him, stating: "I do not wish to be the one who initiates the fighting."`,
    peopleConnected: ['Imam Hussain (AS)', 'Muslim ibn Awsaja', 'Shimr ibn Dhil-Jawshan'],
    sources: [
      { author: 'Al-Tabari', work: 'Tarikh al-Tabari', citation: 'Vol. 5, p. 423' },
      { author: 'Al-Baladhuri', work: 'Ansab al-Ashraf', citation: 'Vol. 3' }
    ]
  },
  {
    id: 'historical_tall_zaynabiyya',
    presentId: 'tall_zaynabiyya_present',
    name: 'Tall al-Zaynabiyya (Natural Hillock)',
    arabicName: 'التل الزينبي (المرتفع الرملي)',
    title: 'The Sandy Elevation Overlooking the Taff Depression',
    category: 'topography',
    coords: { x: 41.0, y: 53.0 },
    image: 'assets/images/shrine_22.jpg',
    period: '61 AH',
    certaintyLevel: 'TRADITIONALLY_ASSOCIATED',
    certaintyKey: 'tall_zaynabiyya',
    noticeText: 'Traditionally Associated: Elevated vantage point referenced in classical Ashura eyewitness accounts.',
    summary: 'The natural sand ridge from which Lady Zaynab bint Ali observed the developments of the battle when combat drew close to the tents.',
    detailedAccount: `The plain of Karbala (historically known as Al-Taff, meaning the edge or margin near the marshlands) possessed uneven desert contours, featuring several knolls and sand ridges. 

This specific ridge stood strategically between the encampment and the lower battle swale. During the afternoon of Ashura, after all the companions and Hashimite youths had fallen, Lady Zaynab stepped out from the camp and mounted this elevation to watch her brother’s solitary defense, calling out toward the Kufan army: "Woe to you! Is Abu Abdillah to be slain while you look on?"`,
    peopleConnected: ['Lady Zaynab bint Ali', 'Imam Hussain (AS)', 'Umar ibn Sa’ad'],
    sources: [
      { author: 'Sayyid Ibn Tawus', work: 'Al-Luhuf', citation: 'pp. 76-78' },
      { author: 'Muhammad Baqir al-Majlisi', work: 'Bihar al-Anwar', citation: 'Vol. 45' }
    ]
  },
  {
    id: 'historical_marakah',
    presentId: 'bain_al_haramayn',
    name: 'The Battle Arena (Ma’rakah al-Taff)',
    arabicName: 'ساحة المعركة الميدانية (أرض الطف)',
    title: 'Central Combat Field of Ashura',
    category: 'battleground',
    coords: { x: 50.0, y: 49.0 },
    image: 'assets/images/shrine_14.jpg',
    period: '61 AH (10 Muharram)',
    certaintyLevel: 'APPROXIMATE_LOCATION',
    certaintyKey: 'maqtal_hussain',
    noticeText: 'Approximate Location: The central arena spanning the ground between the camp and the Umayyad battle line.',
    summary: 'The arena where individual duels (Baraz) and mass cavalry engagements took place throughout the morning and early afternoon.',
    detailedAccount: `The battlefield arena occupied the open desert plain directly in front of the Husayni camp. Following the symbolic first arrow loosed by Umar ibn Sa’ad after sunrise ("Bear witness to the governor that I was the first to shoot!"), the combat began with general arrow volleys followed by individual chivalric combats.

Companions like Habib ibn Madhahir, Zuhayr ibn al-Qayn, and Burayr ibn Khudayr rode out one by one into this arena, challenging the Kufan commanders and delivering impassioned sermons calling the people of Kufa to repent for breaking their written oaths.`,
    peopleConnected: ['Habib ibn Madhahir', 'Zuhayr ibn al-Qayn', 'Burayr ibn Khudayr', 'Hurr ibn Yazid', 'Umar ibn Sa’ad'],
    sources: [
      { author: 'Abu Mikhnaf', work: 'Maqtal al-Husayn', citation: 'Duels of the Morning of Ashura' },
      { author: 'Al-Tabari', work: 'Tarikh', citation: 'Vol. 5, pp. 429-438' }
    ]
  },
  {
    id: 'historical_salat_khawf',
    presentId: null,
    name: 'Site of Salat al-Khawf (Midday Prayer Under Fire)',
    arabicName: 'موقع صلاة الخوف والظهر في المعركة',
    title: 'Dhuhr Prayer Held Amidst Arrow Showers',
    category: 'event_site',
    coords: { x: 46.5, y: 51.5 },
    image: 'assets/images/shrine_27.jpg',
    period: '61 AH (10 Muharram • Midday)',
    certaintyLevel: 'HISTORICALLY_ATTESTED',
    certaintyKey: 'maqtal_hussain',
    noticeText: 'Historically Attested: Documented across early sources as the supreme act of worship during active warfare.',
    summary: 'The ground where Imam Hussain and surviving companions stood together to pray Salat al-Khawf as noon arrived on Ashura.',
    detailedAccount: `As the sun reached its zenith on 10 Muharram, Abu Thumama al-Sa’idi looked toward the sky and said to Imam Hussain: "O Abu Abdillah, my soul be your ransom! I see these enemy forces drawing near, and by Allah, you shall not be killed until I am killed before you. Yet I wish to meet my Lord having prayed this prayer whose time has come." 

Imam Hussain looked up, smiled, and prayed: "You have remembered prayer—may Allah make you among those who remember Him and establish prayer! Yes, this is its first time. Ask them to pause so we may pray."

When the Umayyads refused a ceasefire, Imam Hussain led the shortened prayer of fear (Salat al-Khawf). Zuhayr ibn al-Qayn and Sa’id ibn Abdillah al-Hanafi stood directly in front of the Imam, acting as living human shields and catching incoming arrows on their chests, faces, and hands until the prayer was completed.`,
    peopleConnected: ['Imam Hussain (AS)', 'Sa’id ibn Abdillah al-Hanafi', 'Zuhayr ibn al-Qayn', 'Abu Thumama al-Sa’idi'],
    sources: [
      { author: 'Al-Tabari', work: 'Tarikh', citation: 'Vol. 5, p. 439' },
      { author: 'Shaykh al-Mufid', work: 'Al-Irshad', citation: 'pp. 378-379' }
    ]
  },
  {
    id: 'historical_maqtal',
    presentId: 'shrine_hussain',
    name: 'Gowd-e Qatlgah (The Depression of Martyrdom)',
    arabicName: 'المقتل الشريف (جود القتلگاه)',
    title: 'The Low Basin of the Final Stand and Martyrdom',
    category: 'maqtal',
    coords: { x: 44.5, y: 55.5 },
    image: 'assets/images/shrine_27.jpg',
    period: '61 AH (10 Muharram • Asr)',
    certaintyLevel: 'HISTORICALLY_ATTESTED',
    certaintyKey: 'maqtal_hussain',
    noticeText: 'Historically Attested: Continuous unbroken archaeological and religious continuity directly beneath the present Holy Dome.',
    summary: 'The low depression where Imam Hussain made his final solitary stand after the martyrdom of all his companions and kin.',
    detailedAccount: `By late afternoon (Asr) of 10 Muharram, Imam Hussain stood alone after all his companions, brothers, and sons had attained martyrdom. Despite extreme thirst, dozens of arrow wounds, and spear strikes, early narrators record that he fought with incomparable valor, driving back cavalry attacks whenever they encroached upon the tents.

Eventually weakened by blood loss and a stone struck to his forehead followed by a three-pronged arrow, the Imam descended from his steed (Dhu al-Jannah) into this low basin. It was here that the final tragic strike occurred.

Following the departure of the Umayyad army on 11-12 Muharram, the holy body was buried precisely in this ground by the tribe of Banu Asad and Imam Ali Zayn al-Abidin, forming the direct historical origin of the present-day Rawdah Husayniyyah.`,
    peopleConnected: ['Imam Hussain (AS)', 'Shimr ibn Dhil-Jawshan', 'Sinan ibn Anas', 'Banu Asad'],
    sources: [
      { author: 'Abu Mikhnaf', work: 'Maqtal al-Husayn', citation: 'The Final Combat and Martyrdom' },
      { author: 'Al-Tabari', work: 'Tarikh al-Rusul', citation: 'Vol. 5, pp. 448-453' },
      { author: 'Shaykh al-Mufid', work: 'Al-Irshad', citation: 'pp. 382-385' }
    ]
  },
  {
    id: 'historical_alqami_river',
    presentId: 'bain_al_haramayn',
    name: 'Nahr al-Alqami (Branch of the Euphrates)',
    arabicName: 'نهر العلقمي (فرع من نهر الفرات)',
    title: 'The Watercourse That Was Blockaded on 7 Muharram',
    category: 'waterway',
    coords: { x: 68.0, y: 28.0 },
    image: 'assets/images/shrine_38.jpg',
    period: '61 AH',
    certaintyLevel: 'INTERPRETIVE_RECONSTRUCTION',
    certaintyKey: 'alqami_river',
    noticeText: 'Interpretive Reconstruction: Ancient paleochannel reconstructed based on topographical and geomorphological surveys.',
    summary: 'The flowing stream diverted from the Euphrates river, shaded by date palms, which served as the regional water source.',
    detailedAccount: `Nahr al-Alqami flowed north-east of the Karbala plain. On 7 Muharram, Umar ibn Sa’ad received an express dispatch from Ubaydullah ibn Ziyad: "Cut off al-Husayn and his followers from water; let them not taste a drop of it, just as Uthman ibn Affan was treated." 

Umar ibn Sa’ad immediately dispatched Amr ibn al-Hajjaj al-Zubaydi with 500 cavalry to establish a tight cordon along the banks of the Alqami, turning water deprivation into a primary weapon against the holy camp over the three grueling days that followed.`,
    peopleConnected: ['Amr ibn al-Hajjaj', 'Al-Abbas ibn Ali', 'Umar ibn Sa’ad'],
    sources: [
      { author: 'Al-Tabari', work: 'Tarikh', citation: 'Vol. 5, p. 412' },
      { author: 'Al-Dinawari', work: 'Al-Akhbar al-Tiwal', citation: 'p. 255' }
    ]
  },
  {
    id: 'historical_abbas_fall',
    presentId: 'shrine_abbas',
    name: 'Martyrdom Site of Al-Abbas ibn Ali (AS)',
    arabicName: 'مصرع أبي الفضل العباس عليه السلام',
    title: 'The Outpost Near the Palm Groves of Alqami',
    category: 'maqtal',
    coords: { x: 57.5, y: 38.5 },
    image: 'assets/images/shrine_38.jpg',
    period: '61 AH (10 Muharram • Afternoon)',
    certaintyLevel: 'HISTORICALLY_ATTESTED',
    certaintyKey: 'maqtal_hussain',
    noticeText: 'Historically Attested: Burial place preserved through continuous tradition since 61 AH, separated from the main martyrs’ grave.',
    summary: 'The site where Al-Abbas fell while riding back toward the camp with the filled waterskin for the thirsty children.',
    detailedAccount: `Moved by the cries of "Al-Atash! Al-Atash!" (Thirst! Thirst!) echoing from the children’s tents, Al-Abbas received permission from Imam Hussain to make a desperate attempt to bring water. 

Riding through the Umayyad blockade, Abbas reached the Alqami canal, filled his waterskin (qirbah), and—despite his own severe thirst—refused to drink a drop while his brother and the children remained parched. As he galloped back toward the camp, Umayyad archers and soldiers concealed in the dense palm orchards ambushed him from both flanks. His right and left hands were amputated, an arrow pierced the waterskin spilling the precious water, and he was struck with an iron mace.

Imam Hussain arrived at his side in tears, lamenting: "Al-ana inkasara zahri, wa qallat hilati" (Now is my back broken, and my resourceful support severed).`,
    peopleConnected: ['Al-Abbas ibn Ali', 'Imam Hussain (AS)', 'Hakim ibn Tufayl', 'Zayd ibn Warqa'],
    sources: [
      { author: 'Shaykh al-Mufid', work: 'Kitab al-Irshad', citation: 'pp. 381-383' },
      { author: 'Al-Khwarizmi', work: 'Maqtal al-Husayn', citation: 'Vol. 2, pp. 30-33' }
    ]
  },
  {
    id: 'historical_hurr_turn',
    presentId: null,
    name: 'Hurr ibn Yazid al-Riyahi’s Repentance Point',
    arabicName: 'موقع توبة الحر بن يزيد الرياحي وانضمامه',
    title: 'The Watershed Turning Point of Conscience',
    category: 'event_site',
    coords: { x: 52.0, y: 62.0 },
    image: 'assets/images/shrine_16.jpg',
    period: '61 AH (10 Muharram • Early Morning)',
    certaintyLevel: 'HISTORICALLY_ATTESTED',
    certaintyKey: 'maqtal_hussain',
    noticeText: 'Historically Attested: Landmark event in Islamic ethics documented in all classical texts.',
    summary: 'The location where the Umayyad vanguard commander broke away from Umar ibn Sa’ad’s lines and rode toward Imam Hussain in repentance.',
    detailedAccount: `Hurr ibn Yazid al-Riyahi had originally intercepted Imam Hussain’s caravan at Dhu Husam days earlier with 1,000 horsemen. 

On Ashura morning, witnessing Umar ibn Sa’ad arrange his army for immediate slaughter, Hurr asked Umar: "Will you truly fight this man?" Umar replied: "Yes, by Allah, a battle in which heads shall fly and hands shall be severed." 

Trembling with spiritual conviction, Hurr said to his companion: "By Allah, I see myself choosing between Paradise and the Fire, and by Allah, I shall not choose anything above Paradise even if I am cut to pieces and burned!" He spurred his horse across the no-man’s land, hung his shield upside-down in submission, lowered his head, and approached Imam Hussain, weeping: "O son of the Messenger of Allah, I am your companion who held you back... Is there any repentance for me?" Imam Hussain embraced him: "Yes, Allah forgives you. You are free (Hurr), just as your mother named you!"`,
    peopleConnected: ['Hurr ibn Yazid al-Riyahi', 'Imam Hussain (AS)', 'Umar ibn Sa’ad'],
    sources: [
      { author: 'Abu Mikhnaf', work: 'Maqtal al-Husayn', citation: 'Account of Hurr’s Choice' },
      { author: 'Al-Tabari', work: 'Tarikh', citation: 'Vol. 5, pp. 427-429' }
    ]
  },
  {
    id: 'historical_umayyad_hq',
    presentId: null,
    name: 'Umar ibn Sa’ad’s Command Post (Umayyad Headquarters)',
    arabicName: 'معسكر ومقر قيادة عمر بن سعد وجيش الكوفة',
    title: 'Forward Military Command of the Kufan Forces',
    category: 'military_camp',
    coords: { x: 58.0, y: 66.0 },
    image: 'assets/images/shrine_21.jpg',
    period: '61 AH (3–10 Muharram)',
    certaintyLevel: 'APPROXIMATE_LOCATION',
    certaintyKey: 'troop_numbers',
    noticeText: 'Approximate Location: Camp positioned southeast of the Husayni camp controlling the main Kufa supply route.',
    summary: 'The main military command encampment where Umar ibn Sa’ad, Shimr ibn Dhil-Jawshan, and subsequent reinforcements were headquartered.',
    detailedAccount: `Umar ibn Sa’ad arrived at Karbala on 3 Muharram with an initial vanguard of 4,000 soldiers. Over the next six days, Ubaydullah ibn Ziyad sent continuous reinforcements from Kufa (including horsemen under Shimr ibn Dhil-Jawshan, Shabath ibn Rib’i, and Husayn ibn Numayr), swelling the Kufan army to between 20,000 and 30,000 men.

This command post controlled the communication lines back to Kufa via Ayn al-Tamr and Al-Qadisiyyah. It was from here that the final order of attack was launched on Ashura morning.`,
    peopleConnected: ['Umar ibn Sa’ad', 'Shimr ibn Dhil-Jawshan', 'Shabath ibn Rib’i', 'Ubaydullah ibn Ziyad (by proxy)'],
    sources: [
      { author: 'Al-Baladhuri', work: 'Ansab al-Ashraf', citation: 'Mobilization of Kufa' },
      { author: 'Al-Tabari', work: 'Tarikh', citation: 'Vol. 5, pp. 408-418' }
    ]
  }
];
