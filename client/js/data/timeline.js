/**
 * Interactive Muharram 61 AH Timeline (2 -> 10 Muharram)
 * Detailed breakdown including Ashura intraday chronological phases.
 */

export const MUHARRAM_DAYS = [
  {
    dayNumber: 2,
    dateString: '2 Muharram 61 AH (Thursday, 2 October 680 CE)',
    title: 'Arrival at Karbala (Inzal al-Rihal)',
    arabicTitle: 'نزول الركاب في كربلاء',
    shortSummary: 'The caravan of Imam Hussain arrives on the plains of Karbala and is forced by Hurr ibn Yazid to pitch tents away from water.',
    highlightCoords: { x: 33.0, y: 68.0 },
    locationId: 'historical_encampment',
    presentId: 'mukhayam_present',
    certaintyLevel: 'HISTORICALLY_ATTESTED',
    certaintyKey: 'maqtal_hussain',
    events: [
      {
        id: 'ev_muh_2_arrival',
        title: 'Halting the Mounts at Karbala',
        time: 'Late Morning',
        summary: 'Imam Hussain asks the name of the land and purchases the territory of Karbala.',
        narrative: `When the caravan reached this desert plain, Imam Hussain’s horse abruptly halted and refused to advance. The Imam asked his companions: "What is the name of this land?" They replied: "Al-Ghadiriyya." He asked: "Does it have another name?" They said: "Ninawa." He asked: "Does it have another name?" They replied: "Al-Taff." He asked: "Does it have any other name?" They said: "It is called Karbala."

Upon hearing the name, the Imam wept and said: "Allahumma inni a'udhu bika min al-Karbi wa'l-Bala" (O Allah, I seek refuge in You from grief and tribulation!). He declared: "This is the spot of our tribulation, here shall our blood be shed, and here shall our graves be dug. This is what my grandfather the Messenger of Allah (SAW) foretold to me."

He ordered the tents to be unloaded. He then summoned the local landowners from Banu Asad and purchased the sixty-thousand-square-cubit tract around the campsite from them for sixty thousand dirhams, immediately gifting the land back to them with the condition that they host future pilgrims and direct them to the graves.`,
        people: ['Imam Hussain (AS)', 'Al-Abbas ibn Ali', 'Lady Zaynab bint Ali', 'Hurr ibn Yazid al-Riyahi', 'Banu Asad Elders'],
        places: ['Encampment of Imam Hussain (Khaymagah)', 'Ninawa Plains'],
        primarySources: [
          'Abu Mikhnaf, Maqtal al-Husayn',
          'Tarikh al-Tabari, Vol. 5, pp. 408-410',
          'Kitab al-Irshad by Shaykh al-Mufid, p. 370'
        ],
        scholarlyNotes: 'The purchase of the land of Karbala is corroborated in early legal and hagiographical texts to establish legal ownership and voluntary pilgrimage rights.'
      }
    ]
  },
  {
    dayNumber: 3,
    dateString: '3 Muharram 61 AH (Friday, 3 October 680 CE)',
    title: 'Arrival of Umar ibn Sa’ad with 4,000 Troops',
    arabicTitle: 'ورود عمر بن سعد بجيش الكوفة',
    shortSummary: 'Umar ibn Sa’ad enters Karbala with a vanguard of 4,000 Kufan horsemen; initial diplomatic parleys commence.',
    highlightCoords: { x: 58.0, y: 66.0 },
    locationId: 'historical_umayyad_hq',
    presentId: null,
    certaintyLevel: 'HISTORICALLY_ATTESTED',
    certaintyKey: 'troop_numbers',
    events: [
      {
        id: 'ev_muh_3_ibn_saad',
        title: 'Initial Negotiations and Ibn Sa’ad’s Ambition',
        time: 'Afternoon',
        summary: 'Umar ibn Sa’ad seeks to avoid fighting Hussain to retain governorship of Rayy.',
        narrative: `Ubaydullah ibn Ziyad had appointed Umar ibn Sa’ad governor of Rayy (a lucrative province near modern Tehran) and promised him 4,000 cavalry to pacify Dastaba. However, when news arrived that Imam Hussain had entered Iraq, Ibn Ziyad conditioned the governorship upon leading the campaign against Hussain.

Ibn Sa’ad hesitated, asking for a night to deliberate, but ultimately chose worldly status over eternal salvation. Arriving at Karbala, he dispatched Qurra ibn Qays al-Hanzali to ask Imam Hussain why he had come. The Imam responded: "The people of this city wrote to me stating they had no guide, pleading with me to come. If they have now changed their minds and detest my arrival, I shall depart." When Ibn Sa’ad wrote this to Ibn Ziyad, the governor refused any peaceful departure, demanding unconditional allegiance to Yazid.`,
        people: ['Umar ibn Sa’ad', 'Imam Hussain (AS)', 'Ubaydullah ibn Ziyad (via letter)', 'Qurra ibn Qays'],
        places: ['Umayyad Command Post', 'Husayni Encampment'],
        primarySources: [
          'Tarikh al-Tabari, Vol. 5, pp. 410-412',
          'Ansab al-Ashraf by Al-Baladhuri, Vol. 3'
        ],
        scholarlyNotes: 'Sources differ on whether Imam Hussain offered three proposals (returning to Medina, going to the frontiers, or traveling to Damascus), with early historians like Uqba ibn Sim’an (the Imam’s companion who survived) refuting that Hussain ever offered to submit to Yazid.'
      }
    ]
  },
  {
    dayNumber: 4,
    dateString: '4 Muharram 61 AH (Saturday, 4 October 680 CE)',
    title: 'Mobilization of Kufa Garrison',
    arabicTitle: 'استنفار أهل الكوفة وإغلاق الطرق',
    shortSummary: 'Ibn Ziyad addresses the grand mosque in Kufa, distributing bribes and threatening death for any man who avoids the Karbala draft.',
    highlightCoords: { x: 58.0, y: 66.0 },
    locationId: 'historical_umayyad_hq',
    presentId: null,
    certaintyLevel: 'HISTORICALLY_ATTESTED',
    certaintyKey: 'troop_numbers',
    events: [
      {
        id: 'ev_muh_4_conscription',
        title: 'Total Military Conscription in Kufa',
        time: 'Midday',
        summary: 'Martial law declared in Kufa; roads leading to Mecca and Medina sealed by Umayyad cavalry.',
        narrative: `In Kufa, Ibn Ziyad mounted the minbar of the Grand Mosque, brandishing bags of gold dinars alongside executioners’ swords. He announced an increase in state stipends (Ataa) by 100 dirhams for every warrior marching to Karbala, while ordering Husayn ibn Numayr al-Tamimi to station border garrisons at Al-Qadisiyyah, seal all mountain passes, and execute anyone leaving the province.

Tens of thousands of reluctant Kufan citizens were marshaled at the military staging camp of Nukhayla before being deployed toward Karbala.`,
        people: ['Ubaydullah ibn Ziyad', 'Husayn ibn Numayr'],
        places: ['Kufa Military Camp', 'Perimeter of Karbala'],
        primarySources: [
          'Al-Akhbar al-Tiwal by Al-Dinawari, pp. 253-254',
          'Tarikh al-Tabari, Vol. 5, p. 411'
        ],
        scholarlyNotes: 'Demonstrates the coercive political apparatus employed to compel the Kufan populace into waging war against the Prophet’s grandson.'
      }
    ]
  },
  {
    dayNumber: 5,
    dateString: '5 Muharram 61 AH (Sunday, 5 October 680 CE)',
    title: 'Reinforcements Swell Umayyad Lines',
    arabicTitle: 'تتابع الجيوش وتضييق الحصار',
    shortSummary: 'Shabath ibn Rib’i arrives with 1,000 horsemen, followed by successive cavalry divisions; the siege tightens.',
    highlightCoords: { x: 58.0, y: 66.0 },
    locationId: 'historical_umayyad_hq',
    presentId: null,
    certaintyLevel: 'HISTORICALLY_ATTESTED',
    certaintyKey: 'troop_numbers',
    events: [
      {
        id: 'ev_muh_5_reinforcements',
        title: 'Arrival of Shabath and Siege Tightening',
        time: 'Afternoon',
        summary: 'Former Kufan tribal notables who wrote letters of invitation arrive at the head of the besieging army.',
        narrative: `Shabath ibn Rib’i—one of the tribal chieftains who had personally sent letters begging Imam Hussain to come to Kufa—feigned illness to avoid marching. However, terrified of Ibn Ziyad’s retribution, he assembled 1,000 cavalry and joined Umar ibn Sa’ad at Karbala.

Additional contingents arrived daily under Hajjar ibn Abjar and Urwa ibn Qays, effectively establishing an iron ring around the plain of al-Taff.`,
        people: ['Shabath ibn Rib’i', 'Umar ibn Sa’ad', 'Hajjar ibn Abjar'],
        places: ['Umayyad Frontline', 'Battle Perimeter'],
        primarySources: [
          'Ansab al-Ashraf by Al-Baladhuri, Vol. 3, p. 178',
          'Tarikh al-Tabari, Vol. 5, p. 415'
        ],
        scholarlyNotes: 'Highlights the profound moral contradiction of Kufan leaders who invited the Imam and subsequently led armies against him.'
      }
    ]
  },
  {
    dayNumber: 6,
    dateString: '6 Muharram 61 AH (Monday, 6 October 680 CE)',
    title: 'Habib ibn Madhahir’s Mission to Banu Asad',
    arabicTitle: 'مهمة حبيب بن مظاهر إلى بني أسد',
    shortSummary: 'Habib crosses the Euphrates at night to recruit aid from his kinsmen of Banu Asad; Umayyad cavalry intercepts them.',
    highlightCoords: { x: 68.0, y: 28.0 },
    locationId: 'historical_alqami_river',
    presentId: 'maqam_imam_sadiq_present',
    certaintyLevel: 'HISTORICALLY_ATTESTED',
    certaintyKey: 'alqami_river',
    events: [
      {
        id: 'ev_muh_6_banu_asad',
        title: 'Night Ambush on the Volunteers of Banu Asad',
        time: 'Nightfall',
        summary: 'Habib secures 90 volunteers, but an ambush by 400 Umayyad horsemen prevents them from reaching the camp.',
        narrative: `Seeing the massive influx of Umayyad troops, the elderly companion Habib ibn Madhahir requested permission from Imam Hussain to slip across the Euphrates to a nearby encampment of his tribe, Banu Asad. 

Habib addressed his kinsmen with passionate eloquence: "I have brought you the greatest honor! The grandson of your Prophet is besieged near you with only a handful of family and companions. Come to his aid!" Approximately 90 warriors armed themselves and set out under cover of night.

However, a traitor informed Umar ibn Sa’ad, who dispatched Al-Azraq with 400 cavalry. A skirmish ensued along the riverbank in the dark; outnumbered, the Banu Asad volunteers were forced to disperse, and Habib returned alone to inform Imam Hussain. The Imam remarked: "La hawla wa la quwwata illa billahil aliyyil adhim" (There is no power nor strength except through Allah, the Most High, the Supreme).`,
        people: ['Habib ibn Madhahir', 'Imam Hussain (AS)', 'Al-Azraq', 'Banu Asad Volunteers'],
        places: ['Nahr al-Alqami Banks', 'Banu Asad Settlements'],
        primarySources: [
          'Kitab al-Irshad by Shaykh al-Mufid, pp. 371-372',
          'Maqtal al-Husayn by Al-Khwarizmi, Vol. 1, p. 243'
        ],
        scholarlyNotes: 'Demonstrates that local indigenous tribes recognized the righteousness of the cause but were brutally suppressed by the imperial machinery.'
      }
    ]
  },
  {
    dayNumber: 7,
    dateString: '7 Muharram 61 AH (Tuesday, 7 October 680 CE)',
    title: 'The Water Cutoff (Man’ al-Ma’)',
    arabicTitle: 'منع الماء عن خيام الإمام الحسين',
    shortSummary: 'Ubaydullah ibn Ziyad’s strict order to cut off water arrives; Amr ibn al-Hajjaj stations 500 horsemen on the Alqami.',
    highlightCoords: { x: 68.0, y: 28.0 },
    locationId: 'historical_alqami_river',
    presentId: 'bain_al_haramayn',
    certaintyLevel: 'HISTORICALLY_ATTESTED',
    certaintyKey: 'alqami_river',
    events: [
      {
        id: 'ev_muh_7_water_cutoff',
        title: 'The River Bank Blockade',
        time: 'Morning',
        summary: '500 horsemen cordon off the Euphrates tributary, beginning severe thirst in the camp.',
        narrative: `A courier brought a peremptory dispatch from Ibn Ziyad to Umar ibn Sa’ad: "Block al-Husayn and his followers from water! Let them not drink a single drop, just as Uthman ibn Affan was besieged."

Umar ibn Sa’ad immediately posted Amr ibn al-Hajjaj al-Zubaydi with 500 horsemen directly along the shores of Nahr al-Alqami. From this moment onward, all access to the river was denied. The scorching desert heat of the Mesopotamian plains rapidly depleted the camp’s remaining water-skins, and the cries of "Al-Atash!" (Thirst!) began to rise from the tents of the infants and women.`,
        people: ['Amr ibn al-Hajjaj', 'Umar ibn Sa’ad', 'Ubaydullah ibn Ziyad'],
        places: ['Nahr al-Alqami', 'Date Palm Orchards'],
        primarySources: [
          'Tarikh al-Tabari, Vol. 5, p. 412',
          'Al-Kamil fi al-Tarikh by Ibn al-Athir, Vol. 4, p. 53'
        ],
        scholarlyNotes: 'The deliberate starvation and dehydration of non-combatants, infants, and women violated classical Arab customs of warfare and international chivalric norms.'
      }
    ]
  },
  {
    dayNumber: 8,
    dateString: '8 Muharram 61 AH (Wednesday, 8 October 680 CE)',
    title: 'Thirst Intensifies & Midnight Parley',
    arabicTitle: 'اشتداد العطش وحفر الآبار واللقاء الليلي',
    shortSummary: 'Companions dig shallow wells finding only brackish water; Imam Hussain meets Umar ibn Sa’ad in the dead of night between the camps.',
    highlightCoords: { x: 50.0, y: 49.0 },
    locationId: 'historical_marakah',
    presentId: 'bain_al_haramayn',
    certaintyLevel: 'HISTORICALLY_ATTESTED',
    certaintyKey: 'maqtal_hussain',
    events: [
      {
        id: 'ev_muh_8_well_digging',
        title: 'Digging of the Dry Wells & Midnight Conference',
        time: 'Night',
        summary: 'Desperate attempts to tap groundwater fail; the Imam holds a private conference with Ibn Sa’ad.',
        narrative: `With water exhausted, Imam Hussain and his companions attempted to dig shallow wells behind the tents. After arduous digging through stony desert clay, bitter brackish water surfaced and quickly dried up. 

At midnight, Imam Hussain sent a messenger requesting a private meeting with Umar ibn Sa’ad between the two camps. Each arrived accompanied by twenty horsemen; the Imam instructed all but his brother Al-Abbas and his son Ali al-Akbar to step aside, and Ibn Sa’ad did the same with his son Hafs and a retainer. 

Imam Hussain urged him: "Woe to you, O Ibn Sa’ad! Do you not fear Allah to whom you shall return, while you fight me when you know whose son I am? Leave these tyrants and join me, for that is closer to Allah!" Ibn Sa’ad replied: "I fear my house in Kufa will be demolished." The Imam said: "I will rebuild it for you." Ibn Sa’ad said: "My estates will be confiscated." The Imam said: "I will compensate you with better estates from my property in the Hijaz." Ibn Sa’ad fell silent and muttered: "I fear for my family in Kufa." Realizing his worldly obsession, the Imam arose and declared: "May Allah slaughter you in your bed, and may you never taste of the wheat of Rayy except very little!"`,
        people: ['Imam Hussain (AS)', 'Al-Abbas ibn Ali', 'Ali al-Akbar', 'Umar ibn Sa’ad'],
        places: ['Neutral Zone Between Camps (Bain al-Mu’askarayn)'],
        primarySources: [
          'Tarikh al-Tabari, Vol. 5, pp. 413-414',
          'Kitab al-Irshad by Shaykh al-Mufid, pp. 373-374'
        ],
        scholarlyNotes: 'The prophecy of Imam Hussain came to pass exactly six years later when Mukhtar al-Thaqafi executed Umar ibn Sa’ad in his bed in Kufa.'
      }
    ]
  },
  {
    dayNumber: 9,
    dateString: '9 Muharram 61 AH (Thursday, 9 October 680 CE) — Tasu’a',
    title: 'Tasu’a: The Ultimatum & The Night of Vigil',
    arabicTitle: 'تاسوعاء: وصول الشمر والإنذار وليلة العبادة',
    shortSummary: 'Shimr arrives with Ibn Ziyad’s ultimatum; attack deferred by one night for worship; the companions affirm their eternal loyalty.',
    highlightCoords: { x: 33.0, y: 68.0 },
    locationId: 'historical_encampment',
    presentId: 'mukhayam_present',
    certaintyLevel: 'HISTORICALLY_ATTESTED',
    certaintyKey: 'maqtal_hussain',
    events: [
      {
        id: 'ev_muh_9_shimr_ultimatum',
        title: 'Shimr’s Arrival and the Safe-Conduct Offer',
        time: 'Late Afternoon',
        summary: 'Shimr brings orders to fight immediately or be replaced; offers safe conduct (Aman) to Abbas and his brothers.',
        narrative: `Shimr ibn Dhil-Jawshan arrived at Karbala carrying a scathing letter from Ibn Ziyad to Ibn Sa’ad: "I did not send you to al-Husayn to hold back from him, nor to offer him peace... If he submits, send him to me; if he refuses, attack them, mutilate their corpses, and trample al-Husayn’s chest with horses!"

Shimr approached the Husayni camp and called out for his cousins—the sons of Umm al-Banin (Al-Abbas, Ja’far, Abdullah, and Uthman)—offering them safe-conduct (Aman). Al-Abbas and his brothers stepped forward and rebuked him with fierce indignation: "May Allah curse you and curse your safe-conduct! Do you offer us safety while the grandson of the Messenger of Allah is given no safety?"`,
        people: ['Shimr ibn Dhil-Jawshan', 'Al-Abbas ibn Ali', 'Umar ibn Sa’ad'],
        places: ['Husayni Camp Perimeter'],
        primarySources: ['Tarikh al-Tabari, Vol. 5, p. 416', 'Al-Irshad, p. 374']
      },
      {
        id: 'ev_muh_9_delay_request',
        title: 'A Night Granted for Prayer and Quran',
        time: 'Sunset',
        summary: 'Imam Hussain asks for a single night’s reprieve to spend in prayer, recitation of the Quran, and supplication.',
        narrative: `As the Umayyad cavalry advanced toward the tents on Thursday evening, Imam Hussain asked Al-Abbas to ride out and ask why they were mobilizing. Ibn Sa’ad replied: "Either submit to the governor’s decree, or we attack now."

Imam Hussain told Abbas: "Return to them, and if you are able, persuade them to delay us until tomorrow morning. Perhaps we may spend this night in prayer to our Lord, supplicating Him and seeking His forgiveness. For He knows how much I love prayer, the recitation of His Book, abundant supplication, and seeking His forgiveness." Umar ibn Sa’ad reluctantly granted the truce until sunrise.`,
        people: ['Imam Hussain (AS)', 'Al-Abbas ibn Ali', 'Umar ibn Sa’ad'],
        places: ['Forward Perimeter of Camp'],
        primarySources: ['Tarikh al-Tabari, Vol. 5, p. 417', 'Al-Luhuf, p. 53']
      },
      {
        id: 'ev_muh_9_companions_loyalty',
        title: 'The Address of Ashura Eve: Extinguishing the Lantern',
        time: 'Night',
        summary: 'The Imam releases his companions from their pledge; every single companion declares eternal devotion.',
        narrative: `Gathering his family and companions inside the large central pavilion, Imam Hussain praised Allah and delivered his historic address: 

"I know of no companions more loyal or virtuous than my companions, nor any family more dutiful and affectionate than my family. May Allah reward you all with the finest reward on my behalf. Behold! Tomorrow I believe will be our final day against these enemies. I have given you permission to leave—you are free from your allegiance to me! The darkness of night has enveloped you; take it as a camel and depart, each of you taking a man from my household with you. They seek only me; once they have me, they will pursue no one else!"

Al-Abbas was the first to speak: "Why should we do that? To live after you? May Allah never let us see that day!" Then Muslim ibn Awsaja arose: "Shall we abandon you when we have not fulfilled our duty to Allah regarding you? By Allah, I shall not leave you until I break my spear in their chests and strike them with my sword as long as its hilt remains in my hand!" Zuhayr ibn al-Qayn declared: "By Allah, I wish I could be killed, then resurrected, then killed again a thousand times, if only that would ward off death from you and these youths of your household!" All companions spoke with identical resolve, choosing martyrdom alongside the Imam.`,
        people: ['Imam Hussain (AS)', 'Al-Abbas ibn Ali', 'Muslim ibn Awsaja', 'Zuhayr ibn al-Qayn', 'Habib ibn Madhahir'],
        places: ['Central Pavilion of Imam Hussain'],
        primarySources: [
          'Tarikh al-Tabari, Vol. 5, pp. 418-420',
          'Kitab al-Irshad by Shaykh al-Mufid, pp. 375-377'
        ],
        scholarlyNotes: 'Regarded in world literature as one of the ultimate historical manifestations of voluntary sacrifice and ethical loyalty.'
      }
    ]
  },
  {
    dayNumber: 10,
    dateString: '10 Muharram 61 AH (Friday, 10 October 680 CE) — Ashura',
    title: 'The Day of Ashura: The Climax of Sacrifice',
    arabicTitle: 'يوم عاشوراء: ملحمة الشهادة الكبرى',
    shortSummary: 'The fateful day: dawn prayers, Hurr’s repentance, duels of the companions, prayer under arrows, martyrdom of Banu Hashim, Abbas at the river, and the final solitary stand.',
    highlightCoords: { x: 44.5, y: 55.5 },
    locationId: 'historical_maqtal',
    presentId: 'shrine_hussain',
    certaintyLevel: 'HISTORICALLY_ATTESTED',
    certaintyKey: 'maqtal_hussain',
    isAshuraDetailed: true,
    ashuraPhases: [
      {
        phaseId: 'ashura_dawn',
        phaseName: 'Dawn & Morning Mobilization',
        timeWindow: 'Fajr to 8:00 AM',
        title: 'Fajr Prayer and the Imam’s Sermon',
        coords: { x: 44.5, y: 53.0 },
        summary: 'Imam Hussain leads Fajr prayer; Ali al-Akbar recites the Adhan; the Imam rides forward unarmed to admonish the Kufans.',
        detailedText: `At first light, Ali al-Akbar called the Adhan. Imam Hussain led the thirty-two horsemen and forty foot-soldiers in Fajr prayer. He assigned Zuhayr ibn al-Qayn to command the right wing, Habib ibn Madhahir to command the left wing, and entrusted the sacred battle banner (Al-Liwa) to his brother Al-Abbas. 

The Imam mounted his camel and rode to within earshot of the Kufan army, carrying the Holy Quran upon his head. He delivered a historic sermon: "Trace my lineage and consider who I am! Am I not the son of your Prophet’s daughter, and the son of his cousin and the first to believe? Is not Hamza, Master of Martyrs, my father’s uncle? Is not Ja’far the Flyer my uncle? Did not the Messenger of Allah say of me and my brother: 'These two are the masters of the youth of Paradise'? If you believe me, it is the truth; if you doubt, ask the surviving companions among you—ask Jabir ibn Abdillah, ask Abu Sa'id al-Khudri, ask Sahl ibn Sa'd! What blood have I spilled, what property have I ruined, that you demand retribution?"

The Kufans remained mute with downcast gazes, unable to refute a single word.`,
        people: ['Imam Hussain (AS)', 'Ali al-Akbar', 'Al-Abbas ibn Ali', 'Zuhayr ibn al-Qayn', 'Habib ibn Madhahir']
      },
      {
        phaseId: 'ashura_repentance',
        phaseName: 'Hurr’s Repentance',
        timeWindow: '8:00 AM to 9:00 AM',
        title: 'Hurr Breaks the Ranks of Tyranny',
        coords: { x: 52.0, y: 62.0 },
        summary: 'Umar ibn Sa’ad fires the first arrow; Hurr ibn Yazid rides across the battlefield to seek forgiveness from the Imam.',
        detailedText: `Seeing the Kufan commanders unmoved, Umar ibn Sa’ad stepped forward, notched an arrow, and loosed it toward the Husayni camp, shouting: "Bear witness to the governor that I was the first to shoot!" A dense hail of arrows followed.

Witnessing this, Hurr ibn Yazid al-Riyahi rode to Umar ibn Sa’ad and demanded: "Are you truly going to fight this man?" Umar answered: "Yes, by Allah!" Trembling between terror of divine judgment and worldly shame, Hurr galloped across the sands, inverted his shield, placed his hands upon his head, and surrendered himself to Imam Hussain. The Imam welcomed him with boundless grace, and Hurr became the first major champion to fight and fall for the holy cause.`,
        people: ['Hurr ibn Yazid al-Riyahi', 'Imam Hussain (AS)', 'Umar ibn Sa’ad']
      },
      {
        phaseId: 'ashura_companions',
        phaseName: 'The Companion Duels',
        timeWindow: '9:00 AM to 12:00 PM',
        title: 'Martyrdom of the Faithful Companions',
        coords: { x: 50.0, y: 49.0 },
        summary: 'Burayr, Muslim ibn Awsaja, Habib ibn Madhahir, and the loyal companions defend the camp in heroic single combats.',
        detailedText: `Throughout the morning, companions fought individually and in pairs to prevent the encirclement of the tents. Muslim ibn Awsaja fought fiercely until mortally wounded; as he lay dying, Habib ibn Madhahir knelt beside him, saying: "Were it not that I am following you in a short hour, I would ask you to state your final will." Muslim pointed with his trembling hand toward Imam Hussain and whispered: "I entrust you with this master; fight and die for him!" 

Shortly after, Habib ibn Madhahir himself rode out, striking down dozens of combatants before being felled. Imam Hussain came to his body, weeping: "Inda Allah ahtasibu nafsi wa humata ashabi" (Unto Allah I reckon myself and the protectors of my companions).`,
        people: ['Muslim ibn Awsaja', 'Habib ibn Madhahir', 'Burayr ibn Khudayr', 'Imam Hussain (AS)']
      },
      {
        phaseId: 'ashura_midday',
        phaseName: 'Midday Prayer Under Fire',
        timeWindow: '12:00 PM to 1:00 PM',
        title: 'Salat al-Khawf: Worship Amidst Arrows',
        coords: { x: 46.5, y: 51.5 },
        summary: 'Imam Hussain leads Dhuhr prayer; Sa’id ibn Abdillah and Zuhayr act as human shields against flying arrows.',
        detailedText: `As the midday sun peaked, Abu Thumama reminded the Imam of prayer time. Despite the fierce onslaught, the Imam initiated Salat al-Khawf. Sa’id ibn Abdillah al-Hanafi stood resolutely before the Imam, catching incoming arrows on his chest, throat, and face without flinching so the Imam could complete his prostrations. When the prayer ended, Sa’id collapsed, covered in thirteen arrows, asking: "O son of the Messenger of Allah, have I fulfilled my pledge?" The Imam replied: "Yes, you are in Paradise before me!"`,
        people: ['Imam Hussain (AS)', 'Sa’id ibn Abdillah al-Hanafi', 'Zuhayr ibn al-Qayn', 'Abu Thumama']
      },
      {
        phaseId: 'ashura_banu_hashim',
        phaseName: 'Martyrdom of Banu Hashim',
        timeWindow: '1:00 PM to 3:00 PM',
        title: 'The Sacrifices of the Holy Family',
        coords: { x: 44.0, y: 56.0 },
        summary: 'Ali al-Akbar, Qasim ibn Hasan, and the brothers of Abbas step onto the battlefield.',
        detailedText: `With all companions martyred, the youths of Banu Hashim stepped forward. Ali al-Akbar was the first Hashimite to seek permission; as he rode out, Imam Hussain raised his hands to heaven in tears: "O Allah, be a witness over them! There has gone forth against them a youth who resembles Your Messenger the most in physical form, speech, and noble character." Ali al-Akbar fought with breathtaking skill until struck down by Murra ibn Munqidh. 

Next rode the young orphan of Imam Hasan, Al-Qasim, carrying an uncle’s sword too long for his small frame, fighting until martyred. The three brothers of Al-Abbas—Abdullah, Ja’far, and Uthman—were also slain defending the perimeter.`,
        people: ['Ali al-Akbar', 'Al-Qasim ibn Hasan', 'Imam Hussain (AS)', 'Brothers of Abbas']
      },
      {
        phaseId: 'ashura_abbas',
        phaseName: 'Al-Abbas at the Euphrates',
        timeWindow: '3:00 PM to 3:45 PM',
        title: 'The Ride for Water and the Severed Hands',
        coords: { x: 57.5, y: 38.5 },
        summary: 'Al-Abbas breaks through to the Alqami canal; fills the waterskin; falls near the date groves under ambush.',
        detailedText: `Hearing the cries of "Al-Atash!" from the thirsty children, Al-Abbas rode alone toward the Euphrates. Scattering the 500 guards, he reached the water. Though dying of thirst, he scooped water into his palms, remembered the parched lips of Hussain, and cast the water back into the stream: "O soul, after Hussain you must not live!" 

He filled his waterskin and spurred his horse back toward the camp. Ambushed from behind date palms, his right hand was severed, then his left. Clenching the waterskin with his teeth, an arrow punctured the leather bag, spilling the water. An iron mace struck his head, and he fell from his saddle, calling: "Ya Akha, adrik Akhaak!" (O brother, reach your brother!). Imam Hussain arrived at his side in uncontrollable grief, crying: "Now is my back broken, and my resource severed!"`,
        people: ['Al-Abbas ibn Ali', 'Imam Hussain (AS)', 'Amr ibn al-Hajjaj', 'Hakim ibn Tufayl']
      },
      {
        phaseId: 'ashura_asghar',
        phaseName: 'The Infant Ali al-Asghar',
        timeWindow: '3:45 PM to 4:15 PM',
        title: 'The Arrow of Harmalah and the Infant Martyr',
        coords: { x: 47.0, y: 62.0 },
        summary: 'The 6-month-old infant Abdullah is brought out for a drop of water and struck by a three-pronged arrow.',
        detailedText: `Returning to the desolate camp, Imam Hussain bade farewell to the weeping women and took his six-month-old baby, Abdullah (Ali al-Asghar), who was dying of thirst. The Imam brought him before the enemy ranks, lifting him high: "O people! If you have no mercy upon me, have mercy upon this infant who has committed no crime!" 

As murmurs of dissent arose among the Kufan soldiers, Umar ibn Sa’ad ordered Harmalah ibn Kahil al-Asadi: "Cut off the dispute!" Harmalah fitted a deadly three-pronged venomous arrow and loosed it, piercing the infant’s slender neck from ear to ear while on his father’s chest. The Imam scooped the child’s warm blood in his palms and flung it toward the heavens, saying: "What eases my sorrow is that all of this is in the full sight of Allah!"`,
        people: ['Ali al-Asghar (Abdullah)', 'Imam Hussain (AS)', 'Harmalah ibn Kahil']
      },
      {
        phaseId: 'ashura_solitary_stand',
        phaseName: 'The Solitary Stand (Al-Waqfa al-Akhira)',
        timeWindow: '4:15 PM to 5:00 PM (Asr)',
        title: 'The Final Stand at Gowd-e Qatlgah',
        coords: { x: 44.5, y: 55.5 },
        summary: 'Alone against thousands, Imam Hussain defends the camp until his martyrdom in the depression of the battlefield.',
        detailedText: `All alone, wounded by dozens of arrows, spears, and sword strikes, Imam Hussain strapped on his armor for the final stand. Whenever the Kufan cavalry attempted to charge the tents of the women, he drove them back like scattered sheep, calling out: "Woe to you, O followers of the House of Abu Sufyan! If you have no religion and fear not the Day of Resurrection, at least be free and honorable in your worldly conduct!" 

Fatally wounded by an arrow to his heart, he descended into the low swale (Gowd-e Qatlgah). There, Shimr ibn Dhil-Jawshan and Sinan ibn Anas committed the ultimate crime. The heavens darkened, and dust storms swept across the plain of Karbala.`,
        people: ['Imam Hussain (AS)', 'Shimr ibn Dhil-Jawshan', 'Sinan ibn Anas', 'Lady Zaynab bint Ali']
      },
      {
        phaseId: 'ashura_sham_ghariban',
        phaseName: 'Sham-e Ghariban (Night of the Strangers)',
        timeWindow: 'Sunset to Nightfall',
        title: 'The Burning of the Tents and Lady Zaynab’s Protection',
        coords: { x: 33.0, y: 68.0 },
        summary: 'The Umayyad army loots and torches the encampment; Lady Zaynab gathers the surviving orphans and guards Imam Zayn al-Abidin.',
        detailedText: `As the sun set on Ashura, the Umayyad soldiers surged into the encampment, looting the belongings and setting the tents ablaze with firebrands. Women and frightened children fled out into the darkening desert. 

Lady Zaynab bint Ali gathered the weeping orphans around the smoldering ashes of a single tent, shielding her bedridden nephew, the 4th Imam, Ali ibn al-Hussain (Zayn al-Abidin), from execution by Shimr. She stayed awake throughout the bitter night, offering her midnight prayers (Salat al-Layl) seated from exhaustion, embodying steadfast faith that tyrannical empires could never extinguish.`,
        people: ['Lady Zaynab bint Ali', 'Imam Zayn al-Abidin', 'Lady Rubab', 'Shimr ibn Dhil-Jawshan']
      }
    ]
  }
];
