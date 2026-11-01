/**
 * Karbala Smart Ziyarat Companion 2.0 — Phase 6
 * The Living Heritage Encyclopedia: World-Class Ahlul Bayt Knowledge,
 * Interactive Genealogy & Cinematic History Controller
 */

// ============================================================================
// 1. CANONICAL HISTORICAL SOURCES DATABASE
// ============================================================================
export const HISTORICAL_SOURCES = [
  {
    id: 'source_tabari',
    title: 'Tarikh al-Rusul wa al-Muluk (History of Prophets and Kings)',
    author: 'Abu Ja’far Muhammad ibn Jarir al-Tabari (224–310 AH / 839–923 CE)',
    century: '4th Century AH',
    category: 'Universal Chronicle',
    language: 'Classical Arabic',
    volumesReferenced: 'Vol. 5, pp. 341–458 (Events of 60–61 AH)',
    reliabilityNotes: 'Consensus primary historical chronicle citing early transmitters, notably Abu Mikhnaf Lut ibn Yahya. Essential for chronology, correspondence, and troop numbers.',
    scholarlyConsensus: 'High scholarly consensus across both Sunni and Shia historiography regarding the overarching sequence of political events.'
  },
  {
    id: 'source_irshad',
    title: 'Kitab al-Irshad fi Ma’rifat Hujaj Allah ala al-Ibad',
    author: 'Shaykh al-Mufid Muhammad ibn Muhammad ibn al-Nu’man (336–413 AH / 948–1022 CE)',
    century: '5th Century AH',
    category: 'Theological & Biographical Authority',
    language: 'Classical Arabic',
    volumesReferenced: 'pp. 296–390 (The Life and Martyrdom of Imam al-Husayn)',
    reliabilityNotes: 'The seminal Shia biographical compendium detailing the Twelve Imams. Emphasizes theological significance, ethical motivation, and authenticated sermons.',
    scholarlyConsensus: 'Authoritative theological and historical benchmark for the Ahlul Bayt lineage and speeches at Karbala.'
  },
  {
    id: 'source_maqtal_abu_mikhnaf',
    title: 'Maqtal al-Husayn (The Martyrdom of al-Husayn)',
    author: 'Abu Mikhnaf Lut ibn Yahya al-Azdi (d. 157 AH / 774 CE)',
    century: '2nd Century AH',
    category: 'Monographic Eyewitness Transmission',
    language: 'Classical Arabic',
    volumesReferenced: 'Preserved via al-Tabari, al-Baladhuri, and independent recensions',
    reliabilityNotes: 'The earliest systematic monograph on Karbala, compiled from survivors, Kufan witnesses, and soldiers present on the battlefield.',
    scholarlyConsensus: 'Foundational source for military movements, companion dialogues, and tactical topography.'
  },
  {
    id: 'source_ansab',
    title: 'Ansab al-Ashraf (Genealogies of the Nobles)',
    author: 'Ahmad ibn Yahya al-Baladhuri (d. 279 AH / 892 CE)',
    century: '3rd Century AH',
    category: 'Genealogical & Historical Compendium',
    language: 'Classical Arabic',
    volumesReferenced: 'Vol. 3 (Banu Hashim and the Husayni Uprising)',
    reliabilityNotes: 'Critical for genealogical lineages, tribal compositions, letters between Kufa, Medina, and Damascus, and political context.',
    scholarlyConsensus: 'Rigorous early analytical historiography with detailed attention to familial branches.'
  },
  {
    id: 'source_luhuf',
    title: 'Al-Luhuf ala Qatla al-Tufuf (The Sighs of the Sorrowful)',
    author: 'Sayyid Radhi al-Din Ali ibn Tawus (589–664 AH / 1193–1266 CE)',
    century: '7th Century AH',
    category: 'Devotional Historiography',
    language: 'Classical Arabic',
    volumesReferenced: 'Complete text, pp. 24–112',
    reliabilityNotes: 'Widely recited devotional narrative structured into three chapters: Pre-Karbala events, the Day of Ashura, and the aftermath of captivity.',
    scholarlyConsensus: 'Universally embraced in Ziyarat literature and lamentation gatherings; emphasizes spiritual catharsis.'
  },
  {
    id: 'source_kamil',
    title: 'Al-Kamil fi al-Tarikh (The Complete History)',
    author: 'Ali ibn Muhammad ibn al-Athir (555–630 AH / 1160–1233 CE)',
    century: '7th Century AH',
    category: 'Critical Synthesis',
    language: 'Classical Arabic',
    volumesReferenced: 'Vol. 4, pp. 12–98',
    reliabilityNotes: 'Synthesizes al-Tabari with corroborating Mediterranean and Persian manuscripts, providing nuanced geopolitical context on the Umayyad succession.',
    scholarlyConsensus: 'Exemplary classical analytical historiography with balanced historiographical tone.'
  },
  {
    id: 'source_kamil_ziyarat',
    title: 'Kamil al-Ziyarat (The Perfection of Pilgrimages)',
    author: 'Abu al-Qasim Ja’far ibn Muhammad ibn Qulawayh al-Qummi (d. 367 AH / 978 CE)',
    century: '4th Century AH',
    category: 'Liturgical & Hadith Compendium',
    language: 'Classical Arabic',
    volumesReferenced: 'Chapters 65–88 (Virtues and Texts of Karbala Pilgrimage)',
    reliabilityNotes: 'The oldest surviving systematic collection of pilgrimage texts and narrations from the Imams regarding visiting Karbala and Najaf.',
    scholarlyConsensus: 'Indispensable primary liturgical authority for authenticated Ziyarat recitations.'
  },
  {
    id: 'source_balaghat',
    title: 'Balaghat al-Nisa (The Eloquence of Women)',
    author: 'Ahmad ibn Abi Tahir Tayfur (204–280 AH / 819–893 CE)',
    century: '3rd Century AH',
    category: 'Rhetorical & Literary Preservation',
    language: 'Classical Arabic',
    volumesReferenced: 'Sermons of Sayyida Fatima al-Zahra and Sayyida Zaynab bint Ali',
    reliabilityNotes: 'Earliest surviving documentation of the historic speeches delivered by Holy House women in Kufa, Medina, and Damascus.',
    scholarlyConsensus: 'High literary and historical reliability for the rhetorical confrontations with the Umayyad courts.'
  }
];

// ============================================================================
// 2. COMPREHENSIVE PERSONALITY ENCYCLOPEDIA (SOURCE-BACKED)
// ============================================================================
export const ENCYCLOPEDIA_PERSONALITIES = [
  {
    id: 'person_prophet',
    name: 'Prophet Muhammad (SAW)',
    arabicName: 'النبي محمد بن عبد الله صلى الله عليه وآله',
    honorific: 'Khatam al-Anbiya (Seal of the Prophets), Habib Allah (Beloved of God)',
    category: 'The Holy Prophet',
    era: '53 BH – 11 AH (570 – 632 CE)',
    birthplace: 'Mecca al-Mukarrama',
    restingPlace: 'Al-Masjid al-Nabawi, Medina al-Munawwara',
    shrineId: null,
    genealogy: {
      generation: 0,
      father: 'Abdullah ibn Abd al-Muttalib',
      mother: 'Amina bint Wahb',
      spouse: 'Khadija bint Khuwaylid (Mother of the Believers)',
      children: ['Fatima al-Zahra (SA)', 'al-Qasim', 'Abdullah', 'Ibrahim'],
      siblings: []
    },
    biographySummary: 'The final Messenger of Allah and moral beacon of humanity. He nurtured the young Hasan and Hussain upon his lap, famously proclaiming: "Hussain is from me and I am from Hussain; Allah loves whoever loves Hussain." His prophetic teachings established the spiritual and ethical foundation of justice against oppression that his grandson defended at Karbala.',
    keyEvents: [
      { year: '13 BH (610 CE)', title: 'The First Revelation (Bi’tha)', place: 'Cave of Hira, Mecca' },
      { year: '1 AH (622 CE)', title: 'The Great Migration (Hijra)', place: 'Mecca to Medina' },
      { year: '10 AH (632 CE)', title: 'Declaration of Ghadir Khumm', place: 'Ghadir Khumm' },
      { year: '11 AH (632 CE)', title: 'Departure to the Divine Realm', place: 'Medina' }
    ],
    associatedPlaces: ['Al-Masjid al-Haram, Mecca', 'Al-Masjid al-Nabawi, Medina', 'Ghadir Khumm'],
    primarySources: ['source_tabari', 'source_irshad', 'source_ansab'],
    ziyaratText: {
      title: 'Ziyarat al-Nabi al-Akram (SAW)',
      arabic: 'السَّلامُ عَلَيْكَ يا رَسُولَ اللهِ، السَّلامُ عَلَيْكَ يا حَبِيبَ اللهِ، السَّلامُ عَلَيْكَ يا خِيرَةَ اللهِ...',
      transliteration: 'Assalamu alayka ya Rasul Allah, assalamu alayka ya Habib Allah...',
      english: 'Peace be upon you, O Messenger of Allah; Peace be upon you, O Beloved of Allah; Peace be upon you, O Chosen One of Allah...',
      urdu: 'سلام ہو آپ پر اے اللہ کے رسول، سلام ہو آپ پر اے اللہ کے حبیب، سلام ہو آپ پر اے اللہ کی برگزیدہ ترین ہستی...',
      hindi: 'सलाम हो आप पर ऐ अल्लाह के रसूल, सलाम हो आप पर ऐ अल्लाह के महबूब...',
      persian: 'سلام بر تو ای رسول خدا، سلام بر تو ای حبیب خدا، سلام بر تو ای برگزیده خدا...'
    },
    relatedPersonalities: ['person_ali', 'person_fatima', 'person_hasan', 'person_hussain']
  },
  {
    id: 'person_ali',
    name: 'Imam Ali ibn Abi Talib (AS)',
    arabicName: 'أمير المؤمنين علي بن أبي طالب عليه السلام',
    honorific: 'Amir al-Mu’minin (Commander of the Faithful), Asadullah al-Ghalib (Victorious Lion of God)',
    category: 'The Holy Imams',
    era: '23 BH – 40 AH (600 – 661 CE)',
    birthplace: 'Inside the Sacred Ka’aba, Mecca',
    restingPlace: 'Holy Shrine of Imam Ali, Najaf al-Ashraf',
    shrineId: 'landmark_imam_ali',
    genealogy: {
      generation: 1,
      father: 'Abu Talib ibn Abd al-Muttalib',
      mother: 'Fatima bint Asad',
      spouse: 'Fatima al-Zahra (SA), Umm al-Banin (Fatima bint Hizam)',
      children: ['Hasan (AS)', 'Hussain (AS)', 'Zaynab (SA)', 'Umm Kulthum (SA)', 'Al-Abbas (AS)', 'Muhammad ibn al-Hanafiyya'],
      siblings: ['Talib', 'Aqil', 'Ja’far al-Tayyar', 'Umm Hani']
    },
    biographySummary: 'The first male to accept Islam, cousin, brother, and designated successor of Prophet Muhammad at Ghadir Khumm. Renowned for transcendent justice, encyclopedic wisdom, and unequaled chivalry in defense of the faith. His teachings in Nahj al-Balagha and his martyrdom at the Kufa mosque set the sublime standard of principled governance that inspired Imam Hussain at Karbala.',
    keyEvents: [
      { year: '23 BH (600 CE)', title: 'Birth inside the Holy Ka’aba', place: 'Mecca' },
      { year: '10 AH (632 CE)', title: 'Designation at Ghadir Khumm', place: 'Ghadir Khumm' },
      { year: '35 AH (656 CE)', title: 'Popular Acclamation as Caliph', place: 'Medina' },
      { year: '40 AH (661 CE)', title: 'Martyrdom in Mihrab of Kufa Mosque', place: 'Great Mosque of Kufa' }
    ],
    associatedPlaces: ['Holy Shrine of Imam Ali (Najaf)', 'Great Mosque of Kufa', 'Ghadir Khumm', 'Medina'],
    primarySources: ['source_tabari', 'source_irshad', 'source_ansab', 'source_kamil'],
    ziyaratText: {
      title: 'Ziyarat Amin Allah',
      arabic: 'السَّلامُ عَلَيْكَ يا أَمِينَ اللهِ فِي أَرْضِهِ، وَحُجَّتَهُ عَلى عِبادِهِ...',
      transliteration: 'Assalamu alayka ya Ameen Allah fi ardihi, wa hujjatahu ala ibadih...',
      english: 'Peace be upon you, O Trustee of Allah upon His earth, and His authority over His servants...',
      urdu: 'سلام ہو آپ پر اے اللہ کی زمین میں اس کے امین، اور اس کے بندوں پر اس کی حجت...',
      hindi: 'सलाम हो आप पर ऐ अल्लाह की ज़मीन में उसके अमीन, और उसके बंदों पर उसकी हुज्जत...',
      persian: 'سلام بر تو ای امین خدا در زمینش، و حجتش بر بندگانش...'
    },
    relatedPersonalities: ['person_prophet', 'person_fatima', 'person_hasan', 'person_hussain', 'person_abbas', 'person_zaynab']
  },
  {
    id: 'person_fatima',
    name: 'Sayyida Fatima al-Zahra (SA)',
    arabicName: 'سيدة نساء العالمين فاطمة الزهراء عليها السلام',
    honorific: 'Sayyidat Nisa al-Alamin (Mistress of the Women of the Worlds), Umm Abiha (Mother of Her Father)',
    category: 'The Holy House',
    era: '8 BH – 11 AH (615 – 632 CE)',
    birthplace: 'Mecca al-Mukarrama',
    restingPlace: 'Hidden resting place in Jannat al-Baqi / Rawdat al-Nabi, Medina',
    shrineId: null,
    genealogy: {
      generation: 1,
      father: 'Prophet Muhammad (SAW)',
      mother: 'Khadija bint Khuwaylid',
      spouse: 'Imam Ali ibn Abi Talib (AS)',
      children: ['Hasan (AS)', 'Hussain (AS)', 'Zaynab (SA)', 'Umm Kulthum (SA)', 'Muhsin'],
      siblings: ['Qasim', 'Abdullah', 'Zaynab (bint Muhammad)', 'Ruqayya', 'Umm Kulthum']
    },
    biographySummary: 'The only surviving child of Prophet Muhammad through whom the prophetic lineage continued. Celebrated for sublime piety, ascetic nobility, and intellectual eloquence demonstrated in the Sermon of Fadak. Her spiritual legacy permeated every facet of Karbala, where her name was invoked as the ultimate symbol of purity and divine favor.',
    keyEvents: [
      { year: '8 BH (615 CE)', title: 'Birth in Mecca', place: 'Mecca' },
      { year: '2 AH (624 CE)', title: 'Blessed Marriage with Ali ibn Abi Talib', place: 'Medina' },
      { year: '11 AH (632 CE)', title: 'The Sermon of Fadak and Passing', place: 'Medina' }
    ],
    associatedPlaces: ['Al-Masjid al-Nabawi, Medina', 'Jannat al-Baqi, Medina', 'Bayt al-Ahzan'],
    primarySources: ['source_balaghat', 'source_irshad', 'source_ansab'],
    ziyaratText: {
      title: 'Ziyarat Sayyidat Nisa al-Alamin',
      arabic: 'السَّلامُ عَلَيْكِ يا بِنْتَ رَسُولِ اللهِ، السَّلامُ عَلَيْكِ يا زَوْجَةَ وَلِيِّ اللهِ...',
      transliteration: 'Assalamu alayki ya binta Rasul Allah, assalamu alayki ya zawjata Wali Allah...',
      english: 'Peace be upon you, O daughter of the Messenger of Allah; Peace be upon you, O spouse of the Guardian of Allah...',
      urdu: 'سلام ہو آپ پر اے اللہ کے رسول کی دخترِ گرامی، سلام ہو آپ پر اے ولیِ خدا کی شریکِ حیات...',
      hindi: 'सलाम हो आप पर ऐ रसूलुल्लाह की बेटी, सलाम हो आप पर ऐ वलीउल्लाह की ज़ौजा...',
      persian: 'سلام بر تو ای دختر رسول خدا، سلام بر تو ای همسر ولی خدا...'
    },
    relatedPersonalities: ['person_prophet', 'person_ali', 'person_hasan', 'person_hussain', 'person_zaynab']
  },
  {
    id: 'person_hasan',
    name: 'Imam Hasan al-Mujtaba (AS)',
    arabicName: 'الإمام الحسن بن علي المجتبى عليه السلام',
    honorific: 'Al-Mujtaba (The Chosen One), Karim Ahl al-Bayt (The Generous of the Prophet’s Household)',
    category: 'The Holy Imams',
    era: '3 – 50 AH (624 – 670 CE)',
    birthplace: 'Medina al-Munawwara',
    restingPlace: 'Jannat al-Baqi, Medina al-Munawwara',
    shrineId: null,
    genealogy: {
      generation: 2,
      father: 'Imam Ali ibn Abi Talib (AS)',
      mother: 'Sayyida Fatima al-Zahra (SA)',
      spouse: 'Umm Ishaq, Khawla, Ja’da bint al-Ash’ath',
      children: ['Al-Qasim (AS)', 'Abdullah', 'Hasan al-Muthanna', 'Zayd'],
      siblings: ['Hussain (AS)', 'Zaynab (SA)', 'Umm Kulthum (SA)', 'Abbas (AS)']
    },
    biographySummary: 'Second Shia Imam and elder grandson of Prophet Muhammad. Known for immense generosity, patience, and statesmanlike vision. Faced with widespread treachery and division in 41 AH, he concluded a tactical peace treaty with Mu’awiya to preserve the survival of the believers and lay bare the Umayyad deviation. Poisoned in Medina in 50 AH, his sons Qasim and Abdullah accompanied Hussain to Karbala.',
    keyEvents: [
      { year: '3 AH (624 CE)', title: 'Birth on 15 Ramadan in Medina', place: 'Medina' },
      { year: '40 AH (661 CE)', title: 'Assumption of Caliphate following Imam Ali’s Martyrdom', place: 'Kufa' },
      { year: '41 AH (661 CE)', title: 'Treaty of Sulh al-Hasan with Mu’awiya', place: 'Maskin / Kufa' },
      { year: '50 AH (670 CE)', title: 'Martyrdom by Poison and Burial at Baqi', place: 'Medina' }
    ],
    associatedPlaces: ['Jannat al-Baqi, Medina', 'Great Mosque of Kufa'],
    primarySources: ['source_tabari', 'source_irshad', 'source_ansab', 'source_kamil'],
    ziyaratText: {
      title: 'Ziyarat Imam Hasan al-Mujtaba',
      arabic: 'السَّلامُ عَلَيْكَ يَا ابْنَ رَسُولِ اللهِ، السَّلامُ عَلَيْكَ يَا ابْنَ أَمِيرِ المُؤْمِنِينَ...',
      transliteration: 'Assalamu alayka yabna Rasul Allah, assalamu alayka yabna Ameer al-Mu’mineen...',
      english: 'Peace be upon you, O son of the Messenger of Allah; Peace be upon you, O son of the Commander of the Faithful...',
      urdu: 'سلام ہو آپ پر اے اللہ کے رسول کے فرزند، سلام ہو آپ پر اے امیر المومنین کے لال...',
      hindi: 'सलाम हो आप पर ऐ रसूलुल्लाह के बेटे, सलाम हो आप पर ऐ अमीरुल मोमिनीन के सुपुत्र...',
      persian: 'سلام بر تو ای فرزند رسول خدا، سلام بر تو ای فرزند امیر مؤمنان...'
    },
    relatedPersonalities: ['person_prophet', 'person_ali', 'person_fatima', 'person_hussain', 'person_qasim']
  },
  {
    id: 'person_hussain',
    name: 'Imam Hussain ibn Ali (AS)',
    arabicName: 'الإمام الحسين بن علي سيد الشهداء عليه السلام',
    honorific: 'Sayyid al-Shuhada (Master of Martyrs), Aba Abdillah, Thar Allah (The Sanctified Blood of God)',
    category: 'The Holy Imams',
    era: '4 – 61 AH (626 – 680 CE)',
    birthplace: 'Medina al-Munawwara',
    restingPlace: 'Holy Shrine of Imam Hussain, Karbala',
    shrineId: 'landmark_hussain',
    genealogy: {
      generation: 2,
      father: 'Imam Ali ibn Abi Talib (AS)',
      mother: 'Sayyida Fatima al-Zahra (SA)',
      spouse: 'Shahrbanu, Rubab bint Imri’ al-Qays, Umm Layla',
      children: ['Ali al-Akbar (AS)', 'Ali Zayn al-Abidin (AS)', 'Ali al-Asghar (AS)', 'Sukayna', 'Fatima al-Sughra'],
      siblings: ['Hasan (AS)', 'Zaynab (SA)', 'Umm Kulthum (SA)', 'Abbas (AS)']
    },
    biographySummary: 'The third Shia Imam and supreme protagonist of the Karbala epic. When Yazid ibn Mu’awiya demanded unconditional submission, Hussain refused: "A person like me cannot pledge allegiance to someone like him." Leading a small caravan of family and 72 devoted companions, he stood for spiritual integrity, social justice, and divine truth on the scorched plain of al-Taff on 10 Muharram 61 AH.',
    keyEvents: [
      { year: '4 AH (626 CE)', title: 'Birth on 3 Sha’ban in Medina', place: 'Medina' },
      { year: '60 AH (680 CE)', title: 'Refusal of Bay’ah and Departure from Medina to Mecca', place: 'Medina to Mecca' },
      { year: '60 AH (680 CE)', title: 'Departure from Mecca toward Kufa (8 Dhu al-Hijjah)', place: 'Mecca' },
      { year: '61 AH (680 CE)', title: 'Arrival at the Plain of Karbala (2 Muharram)', place: 'Karbala' },
      { year: '61 AH (680 CE)', title: 'Supreme Martyrdom on the Day of Ashura', place: 'Karbala (Gowd-e Qatlgah)' }
    ],
    associatedPlaces: ['Holy Shrine of Imam Hussain', 'Al-Mukhayyam', 'Tall al-Zaynabiyya', 'Bayn al-Haramayn', 'Mecca', 'Medina'],
    primarySources: ['source_tabari', 'source_irshad', 'source_maqtal_abu_mikhnaf', 'source_luhuf', 'source_kamil_ziyarat'],
    ziyaratText: {
      title: 'Ziyarat Warith',
      arabic: 'السَّلامُ عَلَيْكَ يا وارِثَ آدَمَ صَفْوَةِ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ نُوحٍ نَبِيِّ اللهِ، السَّلامُ عَلَيْكَ يا وارِثَ إِبْراهِيمَ خَلِيلِ اللهِ...',
      transliteration: 'Assalamu alayka ya waritha Adama safwat Allah, assalamu alayka ya waritha Nuhin Nabiyy Allah...',
      english: 'Peace be upon you, O inheritor of Adam, the chosen one of Allah; Peace be upon you, O inheritor of Noah, the Prophet of Allah; Peace be upon you, O inheritor of Abraham, the friend of Allah...',
      urdu: 'سلام ہو آپ پر اے اللہ کے برگزیدہ آدمؑ کے وارث، سلام ہو آپ پر اے اللہ کے نبی نوحؑ کے وارث، سلام ہو آپ پر اے اللہ کے خلیل ابراہیمؑ کے وارث...',
      hindi: 'सलाम हो आप पर ऐ आदम के वारिस, सलाम हो आप पर ऐ नूह के वारिस, सलाम हो आप पर ऐ इब्राहीम के वारिस...',
      persian: 'سلام بر تو ای وارث آدم برگزیده خدا، سلام بر تو ای وارث نوح پیامبر خدا، سلام بر تو ای وارث ابراهیم خلیل خدا...'
    },
    relatedPersonalities: ['person_prophet', 'person_ali', 'person_fatima', 'person_hasan', 'person_abbas', 'person_zaynab', 'person_ali_akbar', 'person_ali_asghar', 'person_zayn_al_abidin']
  },
  {
    id: 'person_zaynab',
    name: 'Sayyida Zaynab bint Ali (SA)',
    arabicName: 'السيدة زينب الكبرى بنت علي عليهما السلام',
    honorific: 'Aqilat Bani Hashim (The Wise Lady of Banu Hashim), Sharikat al-Hussain (Partner of Hussain)',
    category: 'The Holy House',
    era: '5 – 62 AH (626 – 682 CE)',
    birthplace: 'Medina al-Munawwara',
    restingPlace: 'Primary burial shrine in Damascus, Syria; traditional observation Maqam in Karbala',
    shrineId: 'landmark_tal_zaynabiyya',
    genealogy: {
      generation: 2,
      father: 'Imam Ali ibn Abi Talib (AS)',
      mother: 'Sayyida Fatima al-Zahra (SA)',
      spouse: 'Abdullah ibn Ja’far al-Tayyar',
      children: ['Awn (Martyr of Karbala)', 'Muhammad (Martyr of Karbala)', 'Ali', 'Umm Kulthum'],
      siblings: ['Hasan (AS)', 'Hussain (AS)', 'Umm Kulthum (SA)', 'Abbas (AS)']
    },
    biographySummary: 'The grand daughter of the Prophet and sister of Imam Hussain. Celebrated for intellectual eloquence and courage. At Karbala, she watched the battle unfold from the ridge of Tall al-Zaynabiyya, safeguarded the surviving women and children during Sham-e Ghariban, and delivered devastating rhetorical speeches in the courts of Ibn Ziyad in Kufa and Yazid in Damascus.',
    keyEvents: [
      { year: '5 AH (626 CE)', title: 'Birth in Medina', place: 'Medina' },
      { year: '61 AH (680 CE)', title: 'Vantage and Witness at Tall al-Zaynabiyya', place: 'Karbala' },
      { year: '61 AH (680 CE)', title: 'Protector of the Camp during Sham-e Ghariban', place: 'Karbala' },
      { year: '61 AH (680 CE)', title: 'Historic Sermon in Court of Yazid', place: 'Damascus' },
      { year: '62 AH (682 CE)', title: 'Passing into the Divine Mercy', place: 'Damascus / Medina' }
    ],
    associatedPlaces: ['Tall al-Zaynabiyya (Karbala)', 'Shrine of Sayyida Zaynab (Damascus)', 'Medina'],
    primarySources: ['source_balaghat', 'source_luhuf', 'source_tabari', 'source_irshad'],
    ziyaratText: {
      title: 'Ziyarat Sayyida Zaynab al-Kubra',
      arabic: 'السَّلامُ عَلَيْكِ يا بِنْتَ سُلْطانِ الأَنْبِياءِ، السَّلامُ عَلَيْكِ يا بِنْتَ سَيِّدِ الأَوْصِياءِ...',
      transliteration: 'Assalamu alayki ya binta Sultani al-Anbiya, assalamu alayki ya binta Sayyidi al-Awsiya...',
      english: 'Peace be upon you, O daughter of the Sovereign of Prophets; Peace be upon you, O daughter of the Master of Successors...',
      urdu: 'سلام ہو آپ پر اے انبیاء کے سردار کی دختر، سلام ہو آپ پر اے اوصیاء کے پیشوا کی صاحبزادی...',
      hindi: 'सलाम हो आप पर ऐ नबियों के सरदार की बेटी, सलाम हो आप पर ऐ औलिया के पेशवा की बेटी...',
      persian: 'سلام بر تو ای دختر سلطان پیامبران، سلام بر تو ای دختر سرور اوصیاء...'
    },
    relatedPersonalities: ['person_ali', 'person_fatima', 'person_hussain', 'person_abbas', 'person_zayn_al_abidin']
  },
  {
    id: 'person_abbas',
    name: 'Hazrat Abu al-Fadl al-Abbas (AS)',
    arabicName: 'أبو الفضل العباس بن علي عليهما السلام',
    honorific: 'Qamar Bani Hashim (Moon of the Hashemites), Saqqa al-Atasha (Water-Bearer of the Thirsty), Bab al-Hawaej',
    category: 'Heroes of Karbala',
    era: '26 – 61 AH (647 – 680 CE)',
    birthplace: 'Medina al-Munawwara',
    restingPlace: 'Holy Shrine of Al-Abbas, Karbala',
    shrineId: 'landmark_abbas',
    genealogy: {
      generation: 2,
      father: 'Imam Ali ibn Abi Talib (AS)',
      mother: 'Fatima bint Hizam (Umm al-Banin)',
      spouse: 'Lubaba bint Ubaydullah ibn al-Abbas',
      children: ['Ubaydullah', 'al-Fadl'],
      siblings: ['Abdullah ibn Ali', 'Ja’far ibn Ali', 'Uthman ibn Ali', 'Hasan (AS)', 'Hussain (AS)']
    },
    biographySummary: 'The iconic standard-bearer (Alamdar) of Imam Hussain’s camp, son of Imam Ali and Umm al-Banin. Celebrated for towering physical presence, chivalry, and devotion. Assigned to guard the women and water perimeter, he repeatedly charged the Umayyad guard along Nahr al-Alqami to retrieve drinking water for the parched infants, falling on the banks with both hands severed.',
    keyEvents: [
      { year: '26 AH (647 CE)', title: 'Birth on 4 Sha’ban in Medina', place: 'Medina' },
      { year: '61 AH (680 CE)', title: 'Appointed Commander & Standard-Bearer', place: 'Karbala' },
      { year: '61 AH (680 CE)', title: 'Rejection of Shimr’s Offer of Safe Conduct', place: 'Karbala' },
      { year: '61 AH (680 CE)', title: 'The Charge to Euphrates & Supreme Martyrdom', place: 'Karbala (Nahr al-Alqami)' }
    ],
    associatedPlaces: ['Holy Shrine of Al-Abbas', 'Nahr al-Alqami', 'Bayn al-Haramayn', 'Maqam Kaff al-Abbas'],
    primarySources: ['source_irshad', 'source_maqtal_abu_mikhnaf', 'source_tabari', 'source_luhuf'],
    ziyaratText: {
      title: 'Ziyarat Abi al-Fadl al-Abbas',
      arabic: 'سَلامُ اللهِ وَسَلامُ مَلائِكَتِهِ المُقَرَّبِينَ... عَلَيْكَ يا أبا الفَضْلِ العَبّاسَ ابْنَ أَمِيرِ المُؤْمِنِينَ...',
      transliteration: 'Salamu Allahi wa salamu mala’ikatihi al-muqarrabeen... alayka ya Aba al-Fadl al-Abbas ibn Ameer al-Mu’mineen...',
      english: 'The peace of Allah and the peace of His archangels... be upon you, O Abu al-Fadl al-Abbas, son of the Commander of the Faithful...',
      urdu: 'اللہ کا سلام اور اس کے مقرب فرشتوں کا سلام... آپ پر ہو اے ابو الفضل العباسؑ، امیر المومنینؑ کے فرزند...',
      hindi: 'अल्लाह का सलाम और उसके मुक़र्रब फ़रिश्तों का सलाम... आप पर हो ऐ अबुल फज़्ल अल-अब्बास...',
      persian: 'سلام خدا و سلام فرشتگان مقرّبش... بر تو ای ابوالفضل العباس فرزند امیر مؤمنان...'
    },
    relatedPersonalities: ['person_ali', 'person_hussain', 'person_zaynab', 'person_umm_al_banin']
  },
  {
    id: 'person_zayn_al_abidin',
    name: 'Imam Ali ibn al-Hussain (Zayn al-Abidin) (AS)',
    arabicName: 'الإمام علي بن الحسين زين العابدين عليه السلام',
    honorific: 'Al-Sajjad (The Prostrating One), Zayn al-Abidin (Ornament of the Worshippers)',
    category: 'The Holy Imams',
    era: '38 – 95 AH (659 – 713 CE)',
    birthplace: 'Medina al-Munawwara',
    restingPlace: 'Jannat al-Baqi, Medina al-Munawwara',
    shrineId: null,
    genealogy: {
      generation: 3,
      father: 'Imam Hussain ibn Ali (AS)',
      mother: 'Shahrbanu (or Umm Walad)',
      spouse: 'Fatima bint al-Hasan (Umm Abdullah)',
      children: ['Imam Muhammad al-Baqir (AS)', 'Zayd ibn Ali', 'Abdullah', 'al-Husayn'],
      siblings: ['Ali al-Akbar (AS)', 'Ali al-Asghar (AS)', 'Sukayna', 'Fatima']
    },
    biographySummary: 'The fourth Shia Imam and the surviving adult son of Imam Hussain. Incapacitated by severe fever during the battle of Ashura, his survival preserved the line of Divine leadership. Accompanied the captives to Kufa and Damascus, delivering historic speeches that exposed the regime. Authored Al-Sahifah al-Sajjadiyyah, the masterpiece of Islamic supplication.',
    keyEvents: [
      { year: '38 AH (659 CE)', title: 'Birth on 5 Sha’ban in Medina', place: 'Medina' },
      { year: '61 AH (680 CE)', title: 'Witness of Ashura from Sickbed', place: 'Karbala' },
      { year: '61 AH (680 CE)', title: 'Burial of the Martyrs with Banu Asad', place: 'Karbala' },
      { year: '61 AH (680 CE)', title: 'Rhetorical Sermon in Damascus Mosque', place: 'Damascus' },
      { year: '95 AH (713 CE)', title: 'Martyrdom by Poison in Medina', place: 'Medina' }
    ],
    associatedPlaces: ['Jannat al-Baqi (Medina)', 'Holy Shrine of Imam Hussain', 'Al-Mukhayyam'],
    primarySources: ['source_irshad', 'source_tabari', 'source_kamil'],
    ziyaratText: {
      title: 'Ziyarat Imam Zayn al-Abidin',
      arabic: 'السَّلامُ عَلَيْكَ يا زَيْنَ العابِدِينَ، السَّلامُ عَلَيْكَ يا سَيِّدَ السَّاجِدِينَ...',
      transliteration: 'Assalamu alayka ya Zayna al-Abideen, assalamu alayka ya Sayyida al-Sajideen...',
      english: 'Peace be upon you, O Ornament of the Worshippers; Peace be upon you, O Master of the Prostrating Ones...',
      urdu: 'سلام ہو آپ پر اے عبادت گزاروں کی زینت، سلام ہو آپ پر اے سجدہ کرنے والوں کے سردار...',
      hindi: 'सलाम हो आप पर ऐ इबादत करने वालों की ज़ीनत, सलाम हो आप पर ऐ साजिदों के सरदार...',
      persian: 'سلام بر تو ای زینت عبادت‌کنندگان، سلام بر تو ای سرور سجده‌کنندگان...'
    },
    relatedPersonalities: ['person_hussain', 'person_zaynab', 'person_ali_akbar']
  },
  {
    id: 'person_ali_akbar',
    name: 'Hazrat Ali al-Akbar ibn al-Hussain (AS)',
    arabicName: 'علي الأكبر بن الحسين عليهما السلام',
    honorific: 'Shabih al-Rasool (The Mirror of the Prophet)',
    category: 'Heroes of Karbala',
    era: '33 – 61 AH (654 – 680 CE)',
    birthplace: 'Medina al-Munawwara',
    restingPlace: 'At the feet of Imam Hussain, Holy Shrine of Imam Hussain, Karbala',
    shrineId: 'landmark_hussain',
    genealogy: {
      generation: 3,
      father: 'Imam Hussain ibn Ali (AS)',
      mother: 'Umm Layla bint Abi Murrah ibn Urwah al-Thaqafi',
      spouse: null,
      children: [],
      siblings: ['Ali Zayn al-Abidin (AS)', 'Ali al-Asghar (AS)', 'Sukayna', 'Fatima']
    },
    biographySummary: 'Eldest son of Imam Hussain, renowned across the Hijaz for exceptional piety and physical, moral, and vocal resemblance to his great-grandfather, Prophet Muhammad. When the caravan approached Karbala and the Imam foresaw martyrdom, Ali al-Akbar declared: "O father, if we are upon the truth, then we care not whether death falls upon us or we fall upon death!" He was the first of the Hashimite youth to charge into battle on Ashura.',
    keyEvents: [
      { year: '33 AH (654 CE)', title: 'Birth on 11 Sha’ban in Medina', place: 'Medina' },
      { year: '61 AH (680 CE)', title: 'Dialogue of Sublime Resolve at Station of Udhayb', place: 'En route to Karbala' },
      { year: '61 AH (680 CE)', title: 'First of Banu Hashim to Charge on Ashura', place: 'Karbala' }
    ],
    associatedPlaces: ['Holy Shrine of Imam Hussain', 'Maqam Ali al-Akbar'],
    primarySources: ['source_tabari', 'source_irshad', 'source_ansab', 'source_luhuf'],
    ziyaratText: {
      title: 'Ziyarat Ali al-Akbar',
      arabic: 'السَّلامُ عَلَيْكَ يا ابْنَ رَسُولِ اللهِ، السَّلامُ عَلَيْكَ يا شَبِيهَ رَسُولِ اللهِ...',
      transliteration: 'Assalamu alayka yabna Rasul Allah, assalamu alayka ya shabeeha Rasul Allah...',
      english: 'Peace be upon you, O son of the Messenger of Allah; Peace be upon you, O mirror of the Messenger of Allah...',
      urdu: 'سلام ہو آپ پر اے رسول اللہ کے فرزند، سلام ہو آپ پر اے شبیہِ پیغمبرِ اکرمؐ...',
      hindi: 'सलाम हो आप पर ऐ रसूलुल्लाह के बेटे, सलाम हो आप पर ऐ शबीह-ए-पैगंबर...',
      persian: 'سلام بر تو ای فرزند رسول خدا، سلام بر تو ای شبیه‌ترین به رسول خدا...'
    },
    relatedPersonalities: ['person_hussain', 'person_zayn_al_abidin', 'person_ali_asghar']
  },
  {
    id: 'person_ali_asghar',
    name: 'Hazrat Ali al-Asghar (Abdullah) (AS)',
    arabicName: 'عبد الله بن الحسين (علي الأصغر) عليهما السلام',
    honorific: 'Bab al-Hawaej al-Saghir (The Small Gateway of Needs), Al-Tifl al-Radee (The Nursing Infant)',
    category: 'Heroes of Karbala',
    era: '60 – 61 AH (680 – 680 CE, Age: 6 months)',
    birthplace: 'Medina al-Munawwara',
    restingPlace: 'Interred upon the chest of Imam Hussain, Holy Shrine of Imam Hussain, Karbala',
    shrineId: 'landmark_hussain',
    genealogy: {
      generation: 3,
      father: 'Imam Hussain ibn Ali (AS)',
      mother: 'Rubab bint Imri’ al-Qays',
      spouse: null,
      children: [],
      siblings: ['Ali al-Akbar (AS)', 'Ali Zayn al-Abidin (AS)', 'Sukayna']
    },
    biographySummary: 'The six-month-old infant son of Imam Hussain and Lady Rubab. Weakened by severe dehydration under the three-day water embargo, Imam Hussain brought him before the enemy ranks pleading for a drink of water for the blameless child. Umar ibn Sa’d ordered archer Harmalah ibn Kahil to shoot, piercing the infant’s throat with a three-pronged arrow. He stands as the universal symbol of innocent suffering.',
    keyEvents: [
      { year: '60 AH (680 CE)', title: 'Birth on 10 Rajab in Medina', place: 'Medina' },
      { year: '61 AH (680 CE)', title: 'Suffering during the Water Blockade', place: 'Karbala' },
      { year: '61 AH (680 CE)', title: 'Martyrdom in the Arms of His Father', place: 'Karbala' }
    ],
    associatedPlaces: ['Holy Shrine of Imam Hussain', 'Maqam Ali al-Asghar'],
    primarySources: ['source_tabari', 'source_luhuf', 'source_irshad'],
    ziyaratText: {
      title: 'Ziyarat al-Tifl al-Radee',
      arabic: 'السَّلامُ عَلَى عَبْدِ اللهِ الرَّضِيعِ، المَرْمِيِّ بِسَهْمٍ مَسْمُومٍ فِي كَرْبَلاءَ...',
      transliteration: 'Assalamu ala Abdillahi al-radee, al-marmiyyi bi-sahmin masmoomin fi Karbala...',
      english: 'Peace be upon Abdullah the nursing infant, struck by the poisoned arrow in Karbala...',
      urdu: 'سلام ہو عبداللہ بن حسینؑ شیر خوار پر، جنہیں کربلا میں زہر بجھے تیر کا نشانہ بنایا گیا...',
      hindi: 'सलाम हो अब्दुल्लाह अली असग़र शीर-ख़्वार पर, जिन्हें कर्बला में ज़हरीले तीर का निशाना बनाया गया...',
      persian: 'سلام بر عبدالله شیرخوار، که در کربلا با تیر زهرآگین هدف قرار گرفت...'
    },
    relatedPersonalities: ['person_hussain', 'person_ali_akbar']
  },
  {
    id: 'person_qasim',
    name: 'Hazrat al-Qasim ibn al-Hasan (AS)',
    arabicName: 'القاسم بن الحسن بن علي عليهما السلام',
    honorific: 'Ghusn al-Hasan (Branch of Hasan), Ahla min al-Asal (Sweeter than Honey)',
    category: 'Heroes of Karbala',
    era: '47 – 61 AH (667 – 680 CE, Age: 14)',
    birthplace: 'Medina al-Munawwara',
    restingPlace: 'Collective Tomb of Martyrs, Holy Shrine of Imam Hussain, Karbala',
    shrineId: 'landmark_hussain',
    genealogy: {
      generation: 3,
      father: 'Imam Hasan al-Mujtaba (AS)',
      mother: 'Umm Walad (Ramlah)',
      spouse: null,
      children: [],
      siblings: ['Abdullah ibn al-Hasan', 'Hasan al-Muthanna', 'Zayd']
    },
    biographySummary: 'Fourteen-year-old orphaned son of Imam Hasan al-Mujtaba, raised lovingly by uncle Hussain. On the eve of Ashura, when Hussain asked him how he perceived death in this sacred cause, Qasim famously proclaimed: "O uncle, sweeter than honey!" Despite wearing loose sandals and oversized armor, he fought with immense courage until encircled and martyred.',
    keyEvents: [
      { year: '47 AH (667 CE)', title: 'Birth in Medina', place: 'Medina' },
      { year: '61 AH (680 CE)', title: 'The Sweeter than Honey Declaration', place: 'Karbala' },
      { year: '61 AH (680 CE)', title: 'Martyrdom on the Afternoon of Ashura', place: 'Karbala' }
    ],
    associatedPlaces: ['Holy Shrine of Imam Hussain', 'Battlefield Arena'],
    primarySources: ['source_tabari', 'source_irshad', 'source_luhuf'],
    ziyaratText: {
      title: 'Ziyarat al-Qasim ibn al-Hasan',
      arabic: 'السَّلامُ عَلَى القاسِمِ ابْنِ الحَسَنِ بْنِ عَلِيٍّ، المَضْرُوبِ هَامَتُهُ، المَسْلُوبِ لاَمَتُهُ...',
      transliteration: 'Assalamu ala al-Qasim ibni al-Hasan ibn Ali, al-madroobi hamatuhu...',
      english: 'Peace be upon al-Qasim, son of al-Hasan ibn Ali, whose head was struck and armor stripped...',
      urdu: 'سلام ہو قاسم بن حسن بن علیؑ پر، جن کا سر مبارک ضرب خوردہ ہوا اور زرہ چھین لی گئی...',
      hindi: 'सलाम हो क़ासिम इब्नुल हसन पर, जिनका सिर ज़ख़्मी हुआ और ज़िरह छीन ली गई...',
      persian: 'سلام بر قاسم فرزند حسن بن علی، که فرق مبارکش شکافته شد...'
    },
    relatedPersonalities: ['person_hasan', 'person_hussain']
  },
  {
    id: 'person_muslim',
    name: 'Hazrat Muslim ibn Aqil (AS)',
    arabicName: 'مسلم بن عقيل بن أبي طالب عليه السلام',
    honorific: 'Safir al-Hussain (Emissary of Hussain), Shahid al-Kufa (The First Martyr of Kufa)',
    category: 'Heroes of Karbala',
    era: 'c. 28 – 60 AH (d. 9 Dhu al-Hijjah 60 AH / 680 CE)',
    birthplace: 'Medina al-Munawwara',
    restingPlace: 'Shrine of Muslim ibn Aqil, Great Mosque of Kufa, Iraq',
    shrineId: 'landmark_kufa_muslim',
    genealogy: {
      generation: 2,
      father: 'Aqil ibn Abi Talib',
      mother: 'Ulayya',
      spouse: 'Ruqayya bint Ali (daughter of Imam Ali)',
      children: ['Muhammad (Tiflan-e Muslim)', 'Ibrahim (Tiflan-e Muslim)', 'Abdullah'],
      siblings: ['Ja’far ibn Aqil', 'Abd al-Rahman ibn Aqil']
    },
    biographySummary: 'Cousin of Imam Hussain dispatched as his ambassador to Kufa in Dhu al-Qi’dah 60 AH following thousands of written letters pledging allegiance. After initial jubilation, new governor Ubaydullah ibn Ziyad used terror, bribes, and threats to disperse the population. Abandoned in the streets, Muslim fought an entire detachment from the roof of Taw’a’s house before being captured and thrown from the palace roof on 9 Dhu al-Hijjah 60 AH.',
    keyEvents: [
      { year: '60 AH (680 CE)', title: 'Dispatched by Imam Hussain as Ambassador to Kufa', place: 'Medina to Kufa' },
      { year: '60 AH (680 CE)', title: '18,000 Kufans Pledge Allegiance at House of Mukhtar', place: 'Kufa' },
      { year: '60 AH (680 CE)', title: 'Heroic Stand at Taw’a’s House and Martyrdom (9 Dhu al-Hijjah)', place: 'Kufa Palace Roof' }
    ],
    associatedPlaces: ['Shrine of Muslim ibn Aqil (Kufa Mosque)', 'Dar al-Imara (Kufa)', 'House of Taw’a'],
    primarySources: ['source_tabari', 'source_irshad', 'source_ansab'],
    ziyaratText: {
      title: 'Ziyarat Muslim ibn Aqil',
      arabic: 'السَّلامُ عَلَيْكَ يا مُسْلِمَ بْنَ عَقِيلٍ، السَّلامُ عَلَيْكَ يا سَفِيرَ الحُسَيْنِ، أَشْهَدُ أَنَّكَ قَدْ أَقَمْتَ الصَّلاةَ...',
      transliteration: 'Assalamu alayka ya Muslima bna Aqeel, assalamu alayka ya Safeer al-Husayn...',
      english: 'Peace be upon you, O Muslim son of Aqil; Peace be upon you, O Emissary of al-Husayn; I bear witness that you established prayer...',
      urdu: 'سلام ہو آپ پر اے مسلم بن عقیل، سلام ہو آپ پر اے حسینؑ کے سفیر، میں گواہی دیتا ہوں کہ آپ نے نماز قائم کی...',
      hindi: 'सलाम हो आप पर ऐ मुस्लिम इब्ने अक़ील, सलाम हो आप पर ऐ हुसैन के सफ़ीर...',
      persian: 'سلام بر تو ای مسلم بن عقیل، سلام بر تو ای سفیر حسین...'
    },
    relatedPersonalities: ['person_ali', 'person_hussain']
  },
  {
    id: 'person_hurr',
    name: 'Hazrat Hurr ibn Yazid al-Riyahi (RA)',
    arabicName: 'الحر بن يزيد اليربوعي الرياحي رضوان الله عليه',
    honorific: 'Al-Hurr (The Emancipated / The Free One), Sayyid al-Tawwabeen',
    category: 'Companions of Karbala',
    era: 'd. 10 Muharram 61 AH (10 October 680 CE)',
    birthplace: 'Kufa, Iraq',
    restingPlace: 'Dedicated Sanctuary of Hurr, 5 km northwest of Karbala',
    shrineId: 'landmark_hurr',
    genealogy: {
      generation: 2,
      father: 'Yazid ibn Najiyyah al-Riyahi',
      mother: 'Noble Lady of Banu Tamim',
      spouse: 'Lady of Banu Tamim',
      children: ['Ali ibn al-Hurr (Martyr of Karbala)'],
      siblings: ['Mus’ab ibn Yazid']
    },
    biographySummary: 'A respected nobleman and commander of Banu Tamim. Originally led the 1,000-man vanguard sent by Ibn Ziyad to impede Imam Hussain’s progress. Throughout the journey, he treated the Imam with courteous respect, praying behind him. On Ashura dawn, realizing the army intended total annihilation, he crossed the lines in tears: "O son of the Prophet, I am the one who detained you... is there repentance for me?" Accepted with open arms, he fought valiantly and became one of the foremost martyrs.',
    keyEvents: [
      { year: '61 AH (680 CE)', title: 'Intercepts Imam Hussain at Dhu Husam', place: 'Dhu Husam' },
      { year: '61 AH (680 CE)', title: 'Monologue of Conscience and Crossing the Lines', place: 'Karbala' },
      { year: '61 AH (680 CE)', title: 'First Champion to Fall in Defense of the Imam', place: 'Karbala' }
    ],
    associatedPlaces: ['Dedicated Sanctuary of Hurr (5 km NW Karbala)', 'Battlefield Arena'],
    primarySources: ['source_tabari', 'source_irshad', 'source_maqtal_abu_mikhnaf'],
    ziyaratText: {
      title: 'Ziyarat al-Hurr al-Riyahi',
      arabic: 'السَّلامُ عَلَيْكَ يا حُرُّ بْنَ يَزِيدَ الرِّياحِيَّ، طِبْتَ وَطابَتِ الأَرْضُ الَّتِي فِيها دُفِنْتَ...',
      transliteration: 'Assalamu alayka ya Hurru bna Yazeed al-Riyahi, tibta wa tabat al-ardu allatee feeha dufinta...',
      english: 'Peace be upon you, O Hurr son of Yazid al-Riyahi; Blessed are you and blessed is the earth in which you are interred...',
      urdu: 'سلام ہو آپ پر اے حر بن یزید ریاحی، پاکیزہ ہیں آپ اور پاکیزہ ہے وہ خاک جس میں آپ مدفون ہوئے...',
      hindi: 'सलाम हो आप पर ऐ हुर्र इब्ने यज़ीद रियाही, पाकीज़ा हैं आप और पाकीज़ा है वो ज़मीन जिसमें आप दफ़्न हैं...',
      persian: 'سلام بر تو ای حرّ بن یزید ریاحی، پاکیزه شدی و پاکیزه شد زمینی که در آن دفن شدی...'
    },
    relatedPersonalities: ['person_hussain']
  },
  {
    id: 'person_habib',
    name: 'Habib ibn Madhahir al-Asadi (RA)',
    arabicName: 'حبيب بن مظاهر الأسدي رضوان الله عليه',
    honorific: 'Shaykh al-Fuqaha (Elder of the Jurists), Commander of the Left Flank',
    category: 'Companions of Karbala',
    era: 'c. 10 BH – 61 AH (Age: ~75 years)',
    birthplace: 'Kufa / Yemen',
    restingPlace: 'Porch Shrine of Habib inside the Holy Shrine of Imam Hussain, Karbala',
    shrineId: 'landmark_hussain',
    genealogy: {
      generation: 1,
      father: 'Madhahir ibn Ri’ab al-Asadi',
      mother: 'Lady of Banu Asad',
      spouse: 'Noble Lady of Banu Asad',
      children: ['al-Qasim ibn Habib'],
      siblings: ['Ali ibn Madhahir']
    },
    biographySummary: 'Elderly companion of Prophet Muhammad and veteran commander under Imam Ali at Jamal, Siffin, and Nahrawan. Renowned Quranic memorizer and legal scholar in Kufa. Evaded military blockades to reach Karbala on 6 Muharram. Imam Hussain appointed him commander of the left flank. He rallied the companions tirelessly and fell in the morning combat of Ashura.',
    keyEvents: [
      { year: '37 AH (657 CE)', title: 'Veteran Commander at Battle of Siffin with Imam Ali', place: 'Siffin' },
      { year: '61 AH (680 CE)', title: 'Receives Imam Hussain’s Letter and Evades Kufa Blockade', place: 'Kufa to Karbala' },
      { year: '61 AH (680 CE)', title: 'Commands the Left Wing on Ashura Morning', place: 'Karbala' }
    ],
    associatedPlaces: ['Porch Shrine of Habib (Imam Hussain Sanctuary)', 'Nahr al-Alqami'],
    primarySources: ['source_tabari', 'source_ansab', 'source_irshad'],
    ziyaratText: {
      title: 'Ziyarat Habib ibn Madhahir',
      arabic: 'السَّلامُ عَلَيْكَ يا حَبِيبَ بْنَ مُظاهِرٍ الأَسَدِيَّ، وَرَحْمَةُ اللهِ وَبَرَكاتُهُ...',
      transliteration: 'Assalamu alayka ya Habeeba bna Madhahirin al-Asadiyy...',
      english: 'Peace be upon you, O Habib son of Madhahir al-Asadi, and the mercy of Allah and His blessings...',
      urdu: 'سلام ہو آپ پر اے حبیب بن مظاہر اسدی، اور اللہ کی رحمت اور اس کی برکتیں...',
      hindi: 'सलाम हो आप पर ऐ हबीब इब्ने मज़ाहिर असदी...',
      persian: 'سلام بر تو ای حبیب بن مظاهر اسدی، و رحمت و برکات خدا بر تو باد...'
    },
    relatedPersonalities: ['person_ali', 'person_hussain']
  },
  {
    id: 'person_zuhayr',
    name: 'Zuhayr ibn al-Qayn al-Bijilli (RA)',
    arabicName: 'زهير بن القين البجلي رضوان الله عليه',
    honorific: 'Commander of the Right Flank, Shield of the Midday Prayer',
    category: 'Companions of Karbala',
    era: 'd. 10 Muharram 61 AH (680 CE)',
    birthplace: 'Kufa, Iraq',
    restingPlace: 'Collective Tomb of Martyrs, Holy Shrine of Imam Hussain, Karbala',
    shrineId: 'landmark_hussain',
    genealogy: {
      generation: 2,
      father: 'Al-Qayn al-Bijilli',
      mother: 'Lady of Bajila',
      spouse: 'Dalham bint Amr',
      children: [],
      siblings: []
    },
    biographySummary: 'A prominent and wealthy Kufan chieftain who initially avoided contact with the caravan while returning from Mecca. At the station of Zarud, he answered a direct invitation to the Imam’s tent, experiencing a profound awakening of conscience. Commanded the right flank on Ashura, and at noon shielded Imam Hussain during Salat al-Khawf, taking scores of enemy arrows upon his chest.',
    keyEvents: [
      { year: '61 AH (680 CE)', title: 'Meeting of Conscience with Imam Hussain at Zarud', place: 'Zarud Station' },
      { year: '61 AH (680 CE)', title: 'Appointed Commander of the Right Flank', place: 'Karbala' },
      { year: '61 AH (680 CE)', title: 'Shielding the Midday Prayer (Salat al-Khawf) with His Body', place: 'Karbala' }
    ],
    associatedPlaces: ['Salat al-Khawf Memorial Site', 'Holy Shrine of Imam Hussain'],
    primarySources: ['source_tabari', 'source_irshad', 'source_luhuf'],
    ziyaratText: {
      title: 'Ziyarat Zuhayr ibn al-Qayn',
      arabic: 'السَّلامُ عَلَى زُهَيْرِ بْنِ القَيْنِ الَّذِي وَقى الحُسَيْنَ بِنَفْسِهِ...',
      transliteration: 'Assalamu ala Zuhayri bni al-Qayn allathee waqa al-Husayna bi-nafsihi...',
      english: 'Peace be upon Zuhayr son of al-Qayn, who shielded al-Husayn with his own soul...',
      urdu: 'سلام ہو زہیر بن قین پر جنہوں نے اپنی جان سے امام حسینؑ کا دفاع کیا...',
      hindi: 'सलाम हो ज़ुहैर इब्नुल क़ैन पर जिन्होंने अपनी जान से इमाम हुसैन की हिफ़ाज़त की...',
      persian: 'سلام بر زهیر بن قین که با جان خود از حسین محافظت کرد...'
    },
    relatedPersonalities: ['person_hussain']
  },
  {
    id: 'person_umm_al_banin',
    name: 'Fatima bint Hizam (Umm al-Banin) (SA)',
    arabicName: 'فاطمة بنت حزام الكلابية (أم البنين) عليها السلام',
    honorific: 'Umm al-Banin (Mother of the Sons), Bab al-Hawaej',
    category: 'The Holy House',
    era: 'd. 64 AH (684 CE)',
    birthplace: 'Hejaz / Banu Kilab',
    restingPlace: 'Jannat al-Baqi, Medina al-Munawwara',
    shrineId: null,
    genealogy: {
      generation: 1,
      father: 'Hizam ibn Khalid ibn Rabi’ah',
      mother: 'Thumamah bint Suhayl',
      spouse: 'Imam Ali ibn Abi Talib (AS)',
      children: ['Al-Abbas (AS)', 'Abdullah', 'Ja’far', 'Uthman (All four martyred at Karbala)'],
      siblings: []
    },
    biographySummary: 'Revered spouse of Imam Ali married after the passing of Lady Fatima al-Zahra. She bore four valiant sons—Abbas, Abdullah, Ja’far, and Uthman—all of whom fell protecting Imam Hussain at Karbala. Renowned for insisting on being called Umm al-Banin so as not to grieve Hasan and Hussain with their mother’s name. When news of Karbala arrived in Medina, her first question was not about her own four sons, but: "Is my Hussain safe?"',
    keyEvents: [
      { year: 'c. 24 AH (645 CE)', title: 'Marriage to Imam Ali ibn Abi Talib', place: 'Medina' },
      { year: '61 AH (680 CE)', title: 'Sacrifice of Four Sons at Karbala', place: 'Medina / Karbala' },
      { year: '64 AH (684 CE)', title: 'Passing into Divine Mercy at Medina', place: 'Medina' }
    ],
    associatedPlaces: ['Jannat al-Baqi, Medina'],
    primarySources: ['source_ansab', 'source_irshad', 'source_tabari'],
    ziyaratText: {
      title: 'Ziyarat Umm al-Banin',
      arabic: 'السَّلامُ عَلَيْكِ يا أُمَّ البَنِينَ، السَّلامُ عَلَيْكِ يا زَوْجَةَ أَمِيرِ المُؤْمِنِينَ...',
      transliteration: 'Assalamu alayki ya Umm al-Baneen, assalamu alayki ya zawjata Ameer al-Mu’mineen...',
      english: 'Peace be upon you, O Mother of the Sons; Peace be upon you, O spouse of the Commander of the Faithful...',
      urdu: 'سلام ہو آپ پر اے ام البنینؑ، سلام ہو آپ پر اے امیر المومنینؑ کی شریکِ حیات...',
      hindi: 'सलाम हो आप पर ऐ उम्मुल बनीन...',
      persian: 'سلام بر تو ای امّ‌البنین، سلام بر تو ای همسر امیر مؤمنان...'
    },
    relatedPersonalities: ['person_ali', 'person_abbas', 'person_hussain']
  }
];

// ============================================================================
// 3. INTERACTIVE GENEALOGY & FAMILY TREE GRAPH
// ============================================================================
export const FAMILY_TREE_NODES = [
  // Generation 0: The Prophet & Khadija
  { id: 'person_prophet', name: 'Prophet Muhammad (SAW)', arabic: 'النبي محمد (ص)', gen: 0, branch: 'central', gender: 'male', born: '570 CE', death: '632 CE', resting: 'Medina', parentIds: [], spouseIds: ['node_khadija'], childrenIds: ['person_fatima'], presence: 'pre_karbala', disputed: false },
  { id: 'node_khadija', name: 'Sayyida Khadija (SA)', arabic: 'خديجة بنت خويلد (ع)', gen: 0, branch: 'central', gender: 'female', born: '555 CE', death: '619 CE', resting: 'Mecca', parentIds: [], spouseIds: ['person_prophet'], childrenIds: ['person_fatima'], presence: 'pre_karbala', disputed: false },
  { id: 'node_abu_talib', name: 'Abu Talib ibn Abd al-Muttalib', arabic: 'أبو طالب بن عبد المطلب', gen: 0, branch: 'hashim', gender: 'male', born: '535 CE', death: '619 CE', resting: 'Mecca', parentIds: [], spouseIds: ['node_fatima_asad'], childrenIds: ['person_ali', 'node_aqil', 'node_jafar_tayyar'], presence: 'pre_karbala', disputed: false },
  { id: 'node_fatima_asad', name: 'Fatima bint Asad', arabic: 'فاطمة بنت أسد (ع)', gen: 0, branch: 'hashim', gender: 'female', born: '540 CE', death: '626 CE', resting: 'Medina', parentIds: [], spouseIds: ['node_abu_talib'], childrenIds: ['person_ali', 'node_aqil', 'node_jafar_tayyar'], presence: 'pre_karbala', disputed: false },

  // Generation 1: Imam Ali, Fatima, Umm al-Banin, Aqil
  { id: 'person_ali', name: 'Imam Ali ibn Abi Talib (AS)', arabic: 'الإمام علي (ع)', gen: 1, branch: 'central', gender: 'male', born: '600 CE', death: '661 CE', resting: 'Najaf', shrineId: 'landmark_imam_ali', parentIds: ['node_abu_talib', 'node_fatima_asad'], spouseIds: ['person_fatima', 'person_umm_al_banin'], childrenIds: ['person_hasan', 'person_hussain', 'person_zaynab', 'person_abbas'], presence: 'pre_karbala', disputed: false },
  { id: 'person_fatima', name: 'Sayyida Fatima al-Zahra (SA)', arabic: 'فاطمة الزهراء (ع)', gen: 1, branch: 'central', gender: 'female', born: '615 CE', death: '632 CE', resting: 'Medina', parentIds: ['person_prophet', 'node_khadija'], spouseIds: ['person_ali'], childrenIds: ['person_hasan', 'person_hussain', 'person_zaynab'], presence: 'pre_karbala', disputed: false },
  { id: 'person_umm_al_banin', name: 'Umm al-Banin (Fatima bint Hizam)', arabic: 'أم البنين (ع)', gen: 1, branch: 'kilab', gender: 'female', born: 'c. 620 CE', death: '684 CE', resting: 'Medina', parentIds: [], spouseIds: ['person_ali'], childrenIds: ['person_abbas'], presence: 'medina_grief', disputed: false },
  { id: 'node_aqil', name: 'Aqil ibn Abi Talib', arabic: 'عقيل بن أبي طالب', gen: 1, branch: 'aqil', gender: 'male', born: '590 CE', death: '670 CE', resting: 'Medina', parentIds: ['node_abu_talib', 'node_fatima_asad'], spouseIds: [], childrenIds: ['person_muslim'], presence: 'pre_karbala', disputed: false },

  // Generation 2: Hasan, Hussain, Zaynab, Abbas, Muslim
  { id: 'person_hasan', name: 'Imam Hasan al-Mujtaba (AS)', arabic: 'الإمام الحسن (ع)', gen: 2, branch: 'hasani', gender: 'male', born: '624 CE', death: '670 CE', resting: 'Medina', parentIds: ['person_ali', 'person_fatima'], spouseIds: [], childrenIds: ['person_qasim'], presence: 'pre_karbala', disputed: false },
  { id: 'person_hussain', name: 'Imam Hussain Sayyid al-Shuhada (AS)', arabic: 'الإمام الحسين (ع)', gen: 2, branch: 'husayni', gender: 'male', born: '626 CE', death: '680 CE', resting: 'Karbala', shrineId: 'landmark_hussain', parentIds: ['person_ali', 'person_fatima'], spouseIds: ['node_rubab', 'node_layla', 'node_shahrbanu'], childrenIds: ['person_ali_akbar', 'person_ali_asghar', 'person_zayn_al_abidin'], presence: 'karbala_martyr', disputed: false },
  { id: 'person_zaynab', name: 'Sayyida Zaynab al-Kubra (SA)', arabic: 'السيدة زينب (ع)', gen: 2, branch: 'central', gender: 'female', born: '626 CE', death: '682 CE', resting: 'Damascus / Karbala Maqam', shrineId: 'landmark_tal_zaynabiyya', parentIds: ['person_ali', 'person_fatima'], spouseIds: [], childrenIds: ['node_awn', 'node_muhammad_zaynab'], presence: 'karbala_witness', disputed: false },
  { id: 'person_abbas', name: 'Hazrat Abu al-Fadl al-Abbas (AS)', arabic: 'أبو الفضل العباس (ع)', gen: 2, branch: 'abbasi', gender: 'male', born: '647 CE', death: '680 CE', resting: 'Karbala', shrineId: 'landmark_abbas', parentIds: ['person_ali', 'person_umm_al_banin'], spouseIds: [], childrenIds: [], presence: 'karbala_martyr', disputed: false },
  { id: 'person_muslim', name: 'Hazrat Muslim ibn Aqil (AS)', arabic: 'مسلم بن عقيل (ع)', gen: 2, branch: 'aqil', gender: 'male', born: '640 CE', death: '680 CE', resting: 'Kufa Mosque', shrineId: 'landmark_kufa_muslim', parentIds: ['node_aqil'], spouseIds: [], childrenIds: ['node_tiflan_muslim'], presence: 'kufa_ambassador', disputed: false },

  // Generation 3: Ali Akbar, Ali Asghar, Qasim, Zayn al-Abidin
  { id: 'person_ali_akbar', name: 'Hazrat Ali al-Akbar (AS)', arabic: 'علي الأكبر (ع)', gen: 3, branch: 'husayni', gender: 'male', born: '654 CE', death: '680 CE', resting: 'Karbala', parentIds: ['person_hussain'], spouseIds: [], childrenIds: [], presence: 'karbala_martyr', disputed: false },
  { id: 'person_ali_asghar', name: 'Hazrat Ali al-Asghar (Abdullah) (AS)', arabic: 'علي الأصغر (ع)', gen: 3, branch: 'husayni', gender: 'male', born: '680 CE', death: '680 CE', resting: 'Karbala', parentIds: ['person_hussain'], spouseIds: [], childrenIds: [], presence: 'karbala_martyr', disputed: false },
  { id: 'person_qasim', name: 'Hazrat al-Qasim ibn al-Hasan (AS)', arabic: 'القاسم بن الحسن (ع)', gen: 3, branch: 'hasani', gender: 'male', born: '667 CE', death: '680 CE', resting: 'Karbala', parentIds: ['person_hasan'], spouseIds: [], childrenIds: [], presence: 'karbala_martyr', disputed: false },
  { id: 'person_zayn_al_abidin', name: 'Imam Ali Zayn al-Abidin (AS)', arabic: 'الإمام زين العابدين (ع)', gen: 3, branch: 'husayni', gender: 'male', born: '659 CE', death: '713 CE', resting: 'Medina', parentIds: ['person_hussain'], spouseIds: [], childrenIds: ['person_baqir'], presence: 'karbala_survivor', disputed: false },

  // Generation 4: Imam Muhammad al-Baqir
  { id: 'person_baqir', name: 'Imam Muhammad al-Baqir (AS)', arabic: 'الإمام محمد الباقر (ع)', gen: 4, branch: 'husayni', gender: 'male', born: '677 CE', death: '733 CE', resting: 'Medina', parentIds: ['person_zayn_al_abidin'], spouseIds: [], childrenIds: [], presence: 'child_witness', disputed: false }
];

// Documented Relationships Edges (Type: parent_child | marriage | sibling)
export const FAMILY_TREE_EDGES = [
  // Parent -> Child
  { from: 'person_prophet', to: 'person_fatima', type: 'parent_child' },
  { from: 'node_khadija', to: 'person_fatima', type: 'parent_child' },
  { from: 'node_abu_talib', to: 'person_ali', type: 'parent_child' },
  { from: 'node_fatima_asad', to: 'person_ali', type: 'parent_child' },
  { from: 'node_abu_talib', to: 'node_aqil', type: 'parent_child' },
  { from: 'node_aqil', to: 'person_muslim', type: 'parent_child' },

  { from: 'person_ali', to: 'person_hasan', type: 'parent_child' },
  { from: 'person_fatima', to: 'person_hasan', type: 'parent_child' },
  { from: 'person_ali', to: 'person_hussain', type: 'parent_child' },
  { from: 'person_fatima', to: 'person_hussain', type: 'parent_child' },
  { from: 'person_ali', to: 'person_zaynab', type: 'parent_child' },
  { from: 'person_fatima', to: 'person_zaynab', type: 'parent_child' },

  { from: 'person_ali', to: 'person_abbas', type: 'parent_child' },
  { from: 'person_umm_al_banin', to: 'person_abbas', type: 'parent_child' },

  { from: 'person_hasan', to: 'person_qasim', type: 'parent_child' },

  { from: 'person_hussain', to: 'person_ali_akbar', type: 'parent_child' },
  { from: 'person_hussain', to: 'person_ali_asghar', type: 'parent_child' },
  { from: 'person_hussain', to: 'person_zayn_al_abidin', type: 'parent_child' },

  { from: 'person_zayn_al_abidin', to: 'person_baqir', type: 'parent_child' },

  // Marriages
  { from: 'person_prophet', to: 'node_khadija', type: 'marriage' },
  { from: 'node_abu_talib', to: 'node_fatima_asad', type: 'marriage' },
  { from: 'person_ali', to: 'person_fatima', type: 'marriage' },
  { from: 'person_ali', to: 'person_umm_al_banin', type: 'marriage' }
];

// ============================================================================
// 4. CHRONOLOGICAL HISTORICAL TIMELINE DATABASE (SOURCE-BACKED)
// ============================================================================
export const ENCYCLOPEDIA_TIMELINE = [
  {
    epoch: 'pre_karbala',
    date: '18 Dhu al-Hijjah 10 AH (632 CE)',
    title: 'The Declaration of Ghadir Khumm',
    location: 'Ghadir Khumm (between Mecca and Medina)',
    summary: 'Prophet Muhammad stops the vast assembly of pilgrims returning from the Farewell Pilgrimage, taking Ali ibn Abi Talib by the hand and proclaiming: "Of whomsoever I am Mawla (Master/Guardian), Ali is his Mawla."',
    sourceCitation: 'Al-Tabari, Tarikh, Vol. 3; Al-Mufid, Kitab al-Irshad, p. 94.',
    consensusStatus: 'Consensus event recorded in dozens of canonical Sunni and Shia Hadith works.',
    significance: 'Established the theological and moral foundation of Ahlul Bayt leadership.'
  },
  {
    epoch: 'pre_karbala',
    date: '41 AH (661 CE)',
    title: 'Sulh al-Hasan (Peace Treaty of Imam Hasan)',
    location: 'Kufa / Maskin, Iraq',
    summary: 'Imam Hasan al-Mujtaba concludes a tactical peace treaty with Mu’awiya to prevent the total annihilation of the faithful, stipulating that Mu’awiya must rule by Quran and Sunnah, cease persecutions, and under no circumstances appoint a successor.',
    sourceCitation: 'Al-Baladhuri, Ansab al-Ashraf; Ibn al-Athir, Al-Kamil, Vol. 3.',
    consensusStatus: 'Historical consensus on treaty terms and subsequent Umayyad breach.',
    significance: 'Preserved the survival of the believers and legally invalidated hereditary dynastic rule.'
  },
  {
    epoch: 'leading_to_karbala',
    date: 'Mid-Rajab 60 AH (April 680 CE)',
    title: 'Death of Mu’awiya & Refusal of Allegiance',
    location: 'Medina al-Munawwara',
    summary: 'Mu’awiya dies in Damascus. In direct breach of the treaty, his son Yazid claims the caliphate and commands the governor of Medina to extract forced oaths from Imam Hussain. Hussain refuses: "We are the family of prophecy... Yazid is a corrupt tyrant who slays innocent souls. A person like me cannot swear allegiance to someone like him."',
    sourceCitation: 'Al-Tabari, Vol. 5, pp. 338–341; Kitab al-Irshad, pp. 296–298.',
    consensusStatus: 'Consensus across all classical chronicles.',
    significance: 'The moral catalyst that initiated the uprising of Imam Hussain.'
  },
  {
    epoch: 'leading_to_karbala',
    date: '28 Rajab – 3 Sha’ban 60 AH',
    title: 'Departure from Medina to Mecca',
    location: 'Medina to Mecca al-Mukarrama',
    summary: 'Imam Hussain departs Medina by night with his household and companions, reciting the verse of Moses: "So he fled from it, fearing, vigilant..." (Quran 28:21). Arrives in Mecca on 3 Sha’ban and resides there for four months.',
    sourceCitation: 'Ibn Tawus, Al-Luhuf, p. 19; Al-Tabari, Vol. 5, p. 343.',
    consensusStatus: 'Unanimous classical documentation.',
    significance: 'Mecca served as a global gathering ground where Hussain disseminated his moral message.'
  },
  {
    epoch: 'leading_to_karbala',
    date: 'Ramadan – Dhu al-Hijjah 60 AH',
    title: 'Kufan Letters & Mission of Muslim ibn Aqil',
    location: 'Kufa, Iraq',
    summary: 'Over 12,000 letters arrive from Kufan elders pleading for Imam Hussain to lead them. Hussain dispatches his cousin Muslim ibn Aqil. Over 18,000 Kufans pledge allegiance. However, Yazid installs the brutal Ubaydullah ibn Ziyad, who institutes martial terror, scattering the supporters.',
    sourceCitation: 'Al-Tabari, Vol. 5, pp. 347–380; Kitab al-Irshad, pp. 302–325.',
    consensusStatus: 'Documented in detail by Abu Mikhnaf.',
    significance: 'Established the legal and democratic mandate that justified the Imam’s journey.'
  },
  {
    epoch: 'leading_to_karbala',
    date: '8–9 Dhu al-Hijjah 60 AH (September 680 CE)',
    title: 'Departure from Mecca & Martyrdom of Muslim',
    location: 'Mecca & Kufa',
    summary: 'Learning of an Umayyad plot to assassinate him in the sanctuary of the Ka’aba during Hajj, Imam Hussain alters his pilgrimage to Umrah and sets out for Iraq. On 9 Dhu al-Hijjah (Day of Arafah), Muslim ibn Aqil is captured in Kufa and executed from the palace roof.',
    sourceCitation: 'Al-Tabari, Vol. 5, pp. 381–392; Al-Luhuf, p. 28.',
    consensusStatus: 'Consensus on date (Day of Tarwiyah / Arafah).',
    significance: 'Hussain refused to allow blood to be spilled within the Sacred Precincts of Mecca.'
  },
  {
    epoch: 'journey',
    date: '9–28 Dhu al-Hijjah 60 AH',
    title: 'The Desert Journey & Meeting with Hurr',
    location: 'Desert Stations: Sifah, Hajir, Zarud, Thalabiyya, Dhu Husam',
    summary: 'Imam Hussain traverses the northern Arabian desert. At Zarud, Zuhayr ibn al-Qayn joins the camp. At Dhu Husam, Hurr’s 1,000-man cavalry arrives parched with thirst; Hussain orders his men to water the enemy soldiers and their horses.',
    sourceCitation: 'Al-Tabari, Vol. 5, pp. 396–410; Kitab al-Irshad, pp. 326–345.',
    consensusStatus: 'High consensus; classical dialogue preserved verbatim.',
    significance: 'Demonstrated prophetic compassion by watering the very soldiers sent to arrest him.'
  },
  {
    epoch: 'muharram_siege',
    date: '2 Muharram 61 AH (2 October 680 CE)',
    title: 'Arrival at the Plain of Karbala',
    location: 'Karbala (Plain of al-Taff), Iraq',
    summary: 'Hurr’s forces block the caravan from advancing. The Imam’s horse halts. Hussain inquires about the name of the land. When informed it is "Karbala", he weeps: "O Allah, I seek refuge in You from Karb (grief) and Bala (calamity). Here is the resting place of our camels, here our blood shall be spilled."',
    sourceCitation: 'Al-Tabari, Vol. 5, pp. 409–410; Al-Luhuf, p. 35.',
    consensusStatus: 'Unanimous date and narrative in Islamic historiography.',
    significance: 'The final destination where the encampment was pitched.'
  },
  {
    epoch: 'muharram_siege',
    date: '3–6 Muharram 61 AH',
    title: 'Umar ibn Sa’d Arrives & Encampment Fortified',
    location: 'Karbala',
    summary: 'Umar ibn Sa’d arrives with 4,000 troops, followed by successive Umayyad reinforcements numbering upwards of 20,000–30,000. On 6 Muharram, Habib ibn Madhahir attempts to rally Banu Asad reinforcements but is intercepted.',
    sourceCitation: 'Kitab al-Irshad, pp. 347–352; Al-Tabari, Vol. 5, pp. 411–415.',
    consensusStatus: 'Troop estimates range between 20,000 and 30,000 in classical sources.',
    significance: 'The numerical asymmetry of 72 companions against thousands was sealed.'
  },
  {
    epoch: 'muharram_siege',
    date: '7 Muharram 61 AH',
    title: 'The Water Embargo on the Husayni Camp',
    location: 'Nahr al-Alqami / Euphrates',
    summary: 'Ibn Ziyad issues strict orders to seal all access to the river: "Prevent Hussain and his companions from tasting a single drop of water." 500 cavalry under Amr ibn al-Hajjaj guard the banks. The camp suffers acute thirst under the desert heat.',
    sourceCitation: 'Al-Tabari, Vol. 5, p. 412; Al-Kamil, Vol. 4, p. 25.',
    consensusStatus: 'Unanimous historical consensus.',
    significance: 'Transformed the conflict into an ordeal of thirst, affecting infants and women.'
  },
  {
    epoch: 'muharram_siege',
    date: '9 Muharram 61 AH (Tasu’a)',
    title: 'The Eve of Ashura & Night of Devotion',
    location: 'Al-Mukhayyam, Karbala',
    summary: 'Shimr arrives with orders to attack immediately. Hussain asks for a night’s respite: "Allow us tonight to pray to our Lord, for Allah knows how much I love prayer, reciting His Book, and seeking His forgiveness." Hussain releases his companions from their oath: "You are free to leave in the cover of darkness." All refuse unanimously.',
    sourceCitation: 'Al-Tabari, Vol. 5, pp. 416–421; Kitab al-Irshad, pp. 354–358.',
    consensusStatus: 'Famous speech of the Eve of Ashura preserved in all sources.',
    significance: 'Proved the absolute, uncoerced devotion of the 72 companions.'
  },
  {
    epoch: 'ashura',
    date: '10 Muharram 61 AH (Dawn – Midday)',
    title: 'Dawn of Ashura, Hurr’s Repentance & General Assault',
    location: 'Karbala Battlefield',
    summary: 'Hussain leads the dawn prayer and addresses the enemy with words of guidance. Hurr crosses the lines in tears and is accepted. Umar ibn Sa’d shoots the first arrow. A fierce shower of arrows kills over thirty companions in the initial clash.',
    sourceCitation: 'Al-Tabari, Vol. 5, pp. 421–435; Kitab al-Irshad, pp. 360–375.',
    consensusStatus: 'Consensus on order of combat and Hurr’s martyrdom.',
    significance: 'Highlighted the moral gulf between conscience and tyranny.'
  },
  {
    epoch: 'ashura',
    date: '10 Muharram 61 AH (Midday – Asr)',
    title: 'Salat al-Khawf & Banu Hashim Martyrdoms',
    location: 'Karbala Battlefield',
    summary: 'At noon, Hussain leads the prayer of peril (Salat al-Khawf) while Zuhayr and Sa’id shield him with their bodies. The youth of Banu Hashim step forward: Ali al-Akbar, Qasim, the brothers of Abbas, and finally Abbas at the Euphrates.',
    sourceCitation: 'Al-Tabari, Vol. 5, pp. 436–448; Al-Luhuf, pp. 58–66.',
    consensusStatus: 'Universal sequence of sacrifices.',
    significance: 'The ultimate sacrifice of the Prophet’s closest descendants.'
  },
  {
    epoch: 'ashura',
    date: '10 Muharram 61 AH (Late Afternoon)',
    title: 'The Final Stand & Martyrdom of Imam Hussain',
    location: 'Gowd-e Qatlgah, Karbala',
    summary: 'Alone, carrying the martyred infant Ali al-Asghar, Hussain addresses the army one last time: "Is there any helper to aid us?" Surrounded, fighting courageously despite severe blood loss, he falls at Gowd-e Qatlgah. Shimr and Sinan commit the final atrocity.',
    sourceCitation: 'Al-Tabari, Vol. 5, pp. 450–453; Kitab al-Irshad, pp. 382–385.',
    consensusStatus: 'Consensus on timing (late afternoon / Asr).',
    significance: 'The defining catastrophe that awakened the conscience of the Islamic world.'
  },
  {
    epoch: 'aftermath',
    date: '10–12 Muharram 61 AH',
    title: 'Sham-e Ghariban & Banu Asad Burials',
    location: 'Karbala to Kufa',
    summary: 'The tents are plundered and torched. Sayyida Zaynab gathers the surviving children under the starry sky of Sham-e Ghariban. On 12 Muharram, the local Banu Asad tribe, guided by Imam Zayn al-Abidin, lovingly bury the sacred bodies of the martyrs where they fell.',
    sourceCitation: 'Al-Tabari, Vol. 5, pp. 454–456; Kitab al-Irshad, p. 388.',
    consensusStatus: 'Consensus on Banu Asad burial traditions.',
    significance: 'Established the geographical coordinates of the shrines revered today.'
  },
  {
    epoch: 'aftermath',
    date: 'Muharram – Safar 61 AH',
    title: 'The Captivity & Sermons in Kufa and Damascus',
    location: 'Kufa to Damascus',
    summary: 'The Holy family is paraded in chains across Iraq and Syria. In the court of Ibn Ziyad in Kufa and Yazid in Damascus, Lady Zaynab and Imam Zayn al-Abidin deliver searing sermons that turn public grief against the Umayyad dynasty.',
    sourceCitation: 'Balaghat al-Nisa; Al-Tabari, Vol. 5, pp. 456–465.',
    consensusStatus: 'Consensus on the texts of the sermons in Damascus.',
    significance: 'Transformed military defeat into permanent moral and historical victory.'
  },
  {
    epoch: 'legacy',
    date: '65–67 AH and Beyond',
    title: 'Tawwabun, Mukhtar & Perpetual Remembrance',
    location: 'Kufa, Karbala & Global',
    summary: 'Remorse leads to the Tawwabun (Penitents) uprising in 65 AH and Mukhtar al-Thaqafi’s revolution in 66 AH, bringing the perpetrators of Karbala to justice. Arba’een pilgrimages are instituted, leading to the global memorial of over twenty million visitors annually.',
    sourceCitation: 'Al-Tabari, Vol. 5–6; Ibn Kathir, Al-Bidayah wa al-Nihayah, Vol. 8.',
    consensusStatus: 'Documented historical rebellions that dismantled the Sufyanid branch.',
    significance: 'Immortalized Karbala as the eternal beacon of freedom and human dignity.'
  }
];

// ============================================================================
// 5. REST API HANDLERS
// ============================================================================

export async function getEncyclopediaPersonalities(req, res) {
  try {
    const { id, category, generation } = req.query;
    let list = [...ENCYCLOPEDIA_PERSONALITIES];

    if (id) {
      const person = list.find(p => p.id === id);
      if (!person) return res.status(404).json({ status: 'error', message: `Personality '${id}' not found.` });
      return res.status(200).json({ status: 'success', personality: person });
    }
    if (category) {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (generation !== undefined) {
      list = list.filter(p => p.genealogy.generation === parseInt(generation, 10));
    }

    return res.status(200).json({
      status: 'success',
      total: list.length,
      personalities: list
    });
  } catch (error) {
    console.error('Error in getEncyclopediaPersonalities:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to retrieve encyclopedia personalities.' });
  }
}

export async function getEncyclopediaFamilyTree(req, res) {
  try {
    return res.status(200).json({
      status: 'success',
      metadata: {
        title: 'Documented Genealogy of the Holy House (Ahlul Bayt)',
        totalNodes: FAMILY_TREE_NODES.length,
        totalEdges: FAMILY_TREE_EDGES.length,
        generations: [0, 1, 2, 3, 4],
        reliabilityNotes: 'Represents only authenticated genealogical relationships documented in Ansab al-Ashraf and Kitab al-Irshad. Uncertain or disputed secondary branches are labeled accordingly.'
      },
      nodes: FAMILY_TREE_NODES,
      edges: FAMILY_TREE_EDGES
    });
  } catch (error) {
    console.error('Error in getEncyclopediaFamilyTree:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to retrieve family tree data.' });
  }
}

export async function getEncyclopediaSources(req, res) {
  try {
    const { id } = req.query;
    if (id) {
      const src = HISTORICAL_SOURCES.find(s => s.id === id);
      if (!src) return res.status(404).json({ status: 'error', message: `Source '${id}' not found.` });
      return res.status(200).json({ status: 'success', source: src });
    }
    return res.status(200).json({
      status: 'success',
      total: HISTORICAL_SOURCES.length,
      sources: HISTORICAL_SOURCES
    });
  } catch (error) {
    console.error('Error in getEncyclopediaSources:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to retrieve historical sources.' });
  }
}

export async function getEncyclopediaTimeline(req, res) {
  try {
    const { epoch } = req.query;
    let list = [...ENCYCLOPEDIA_TIMELINE];
    if (epoch) {
      list = list.filter(e => e.epoch.toLowerCase() === epoch.toLowerCase());
    }
    return res.status(200).json({
      status: 'success',
      total: list.length,
      timeline: list
    });
  } catch (error) {
    console.error('Error in getEncyclopediaTimeline:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to retrieve encyclopedia timeline.' });
  }
}

import { AHLUL_BAYT_CALENDAR_EVENTS } from '../../client/js/data/ahlulBaytCalendarData.js';

export async function getKnowledgeGraph(req, res) {
  try {
    const calendarGraphEdges = [];
    AHLUL_BAYT_CALENDAR_EVENTS.forEach(ev => {
      (ev.personalityIds || []).forEach(pId => {
        calendarGraphEdges.push({ source: ev.eventId, target: pId, relation: 'commemorates_personality' });
      });
      (ev.locationIds || []).forEach(lId => {
        calendarGraphEdges.push({ source: ev.eventId, target: lId, relation: 'occurred_at_or_visited_at' });
      });
      if (ev.recommendedZiyarat) {
        calendarGraphEdges.push({ source: ev.eventId, target: ev.recommendedZiyarat, relation: 'prescribed_ziyarat' });
      }
    });

    return res.status(200).json({
      status: 'success',
      knowledgeGraph: {
        personalitiesCount: ENCYCLOPEDIA_PERSONALITIES.length,
        sourcesCount: HISTORICAL_SOURCES.length,
        timelineEventsCount: ENCYCLOPEDIA_TIMELINE.length,
        calendarEventsCount: AHLUL_BAYT_CALENDAR_EVENTS.length,
        familyNodesCount: FAMILY_TREE_NODES.length,
        familyEdgesCount: FAMILY_TREE_EDGES.length,
        calendarGraphEdgesCount: calendarGraphEdges.length,
        calendarEvents: AHLUL_BAYT_CALENDAR_EVENTS.map(e => ({
          eventId: e.eventId,
          slug: e.slug,
          title: e.title,
          eventType: e.eventType,
          hijriDay: e.hijriDay,
          hijriMonth: e.hijriMonth,
          personalityIds: e.personalityIds,
          locationIds: e.locationIds,
          recommendedZiyarat: e.recommendedZiyarat,
          sources: e.sources
        })),
        calendarGraphEdges,
        graphOntology: {
          nodes: ['Personality', 'HistoricalEvent', 'CalendarEvent', 'SacredLocation', 'HistoricalSource', 'ZiyaratText'],
          relationships: ['participated_in', 'interred_at', 'kin_of', 'cited_in', 'authored_by', 'commemorated_by', 'commemorates_personality', 'prescribed_ziyarat']
        }
      }
    });
  } catch (error) {
    console.error('Error in getKnowledgeGraph:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to retrieve knowledge graph.' });
  }
}
