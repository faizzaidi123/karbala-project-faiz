/**
 * Historical Certainty & Historiography Knowledge Base
 * Based on classical primary sources (Abu Mikhnaf, Al-Tabari, Al-Baladhuri, Shaykh al-Mufid, Sayyid Ibn Tawus)
 * and modern topographical/archaeological research on the Karbala basin.
 */

export const CERTAINTY_LEVELS = {
  HISTORICALLY_ATTESTED: {
    key: 'HISTORICALLY_ATTESTED',
    label: 'Historically Attested',
    color: '#10b981', // Emerald
    bgColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10b981',
    description: 'Documented across multiple early independent classical sources with strong geographical consensus.'
  },
  TRADITIONALLY_ASSOCIATED: {
    key: 'TRADITIONALLY_ASSOCIATED',
    label: 'Traditionally Associated',
    color: '#3b82f6', // Sapphire
    bgColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: '#3b82f6',
    description: 'Continuous religious and memorial tradition spanning centuries, supported by early ziyarat manuals, though topographical landscape has evolved.'
  },
  APPROXIMATE_LOCATION: {
    key: 'APPROXIMATE_LOCATION',
    label: 'Approximate Location',
    color: '#f59e0b', // Amber
    bgColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: '#f59e0b',
    description: 'The general vicinity is established by historical accounts, but exact 7th-century boundary cannot be pinpointed due to centuries of alluvial sedimentation and urban development.'
  },
  INTERPRETIVE_RECONSTRUCTION: {
    key: 'INTERPRETIVE_RECONSTRUCTION',
    label: 'Interpretive Reconstruction',
    color: '#8b5cf6', // Amethyst
    bgColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: '#8b5cf6',
    description: 'A conceptual model reconstructed from historical narratives describing relative distances, topography, and battle movements.'
  },
  SOURCES_DIFFER: {
    key: 'SOURCES_DIFFER',
    label: 'Sources Differ',
    color: '#ef4444', // Ruby
    bgColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#ef4444',
    description: 'Classical historians provide divergent accounts regarding dates, troop numbers, sequences of events, or specific locations.'
  },
  LOCATION_UNCERTAIN: {
    key: 'LOCATION_UNCERTAIN',
    label: 'Location Uncertain',
    color: '#94a3b8', // Slate
    bgColor: 'rgba(148, 163, 184, 0.15)',
    borderColor: '#94a3b8',
    description: 'Historical records mention the event or site, but geographical markers are insufficient to establish precise modern coordinates.'
  }
};

export const CERTAINTY_EXPLANATIONS = {
  'maqtal_hussain': {
    title: 'The Site of Martyrdom (Gowd-e Qatlgah / Rawdah Husayniyyah)',
    level: 'HISTORICALLY_ATTESTED',
    whyApproximate: false,
    explanation: `The burial site and immediate location of the martyrdom of Imam Hussain (AS) is among the most historically attested sacred sites in Islamic historiography.

Following the battle of 10 Muharram 61 AH, members of the local Banu Asad tribe, guided by Imam Ali ibn al-Hussain (Zayn al-Abidin AS), buried the martyrs where they fell. The core tomb chamber (Al-Ha'ir al-Husayni) has maintained continuous commemorative pilgrimage since Safar 61 AH, documented by early visits of Jabir ibn Abdillah al-Ansari and Atiyya al-Awfi.

While the physical structure evolved through reconstruction cycles (notably under the Buyids, Safavids, and modern expansions), the central location over the grave pit (Gowd-e Qatlgah) remains geographically rooted with extraordinary scholarly and archaelogical continuity.`,
    sources: [
      { author: 'Abu Mikhnaf (d. 157 AH)', work: 'Maqtal al-Husayn', citation: 'Transmission via Tabari, Vol. 5, pp. 455-460' },
      { author: 'Muhammad ibn Jarir al-Tabari (d. 310 AH)', work: "Tarikh al-Rusul wa'l-Muluk", citation: 'Series I, Vol. 5' },
      { author: 'Shaykh al-Mufid (d. 413 AH)', work: 'Kitab al-Irshad', citation: 'Section on the Martyrdom of al-Husayn, pp. 370-385' },
      { author: 'Sayyid Ibn Tawus (d. 664 AH)', work: "Al-Luhuf 'ala Qatla al-Tufuf", citation: 'Burial of the Martyrs, pp. 85-92' }
    ]
  },
  'mukhayam_camp': {
    title: "Encampment of Imam Hussain (Khaymagah / Al-Mukhayam)",
    level: 'APPROXIMATE_LOCATION',
    whyApproximate: true,
    explanation: `The present-day sanctuary of Al-Mukhayam al-Husayni stands approximately 500 meters southwest of the Holy Shrine. 

Classical accounts describe Imam Hussain pitching his tents on slightly elevated, sheltered ground near a natural hillock or ridge, with a defensive canal or depression dug behind the encampment to prevent cavalry flank attacks.

Why is this marked Approximate?
1. Euphrates Riverbed Migration: Hydrological studies of the Mesopotamian flood basin demonstrate that the Al-Alqami canal and nearby seasonal watercourses shifted over fourteen centuries of silting and irrigation canal realignments.
2. Tent Encampment Footprint: An encampment housing approximately 72 fighting men along with women, children, mounts, and baggage would span hundreds of square meters rather than a single fixed geometric point.
3. Commemorative Enclosure: The current domed memorial preserves the traditional perimeter established in early centuries, but represents the approximate core rather than an exact architectural boundary from 61 AH.`,
    sources: [
      { author: 'Ahmad ibn Yahya al-Baladhuri (d. 279 AH)', work: 'Ansab al-Ashraf', citation: 'Account of the Camping at al-Taff, Vol. 3' },
      { author: 'Abu Mikhnaf (d. 157 AH)', work: 'Maqtal al-Husayn', citation: 'Description of the Camp and the Trench' },
      { author: 'Dr. Jawad al-Shabibi', work: 'Karbala in History and Geography', citation: 'Topographical Analysis of al-Taff basin, 1988' }
    ]
  },
  'alqami_river': {
    title: 'Al-Alqami Stream / Branch of the Euphrates (Nahr al-Alqami)',
    level: 'INTERPRETIVE_RECONSTRUCTION',
    whyApproximate: true,
    explanation: `Historical texts describe Nahr al-Alqami as a tributary diverted from the main Euphrates river (Al-Furat) flowing north to east of Karbala, surrounded by dense date palm orchards (Nakhl). 

It was along this watercourse that Amr ibn al-Hajjaj al-Zubaydi stationed 500 Umayyad horsemen on 7 Muharram to enforce the water embargo, and where Al-Abbas ibn Ali made his heroic final ride to secure water with the waterskin (Mashk).

Why is this marked Interpretive Reconstruction?
Over the course of the Abbasid, Ilkhanid, and Ottoman eras, natural floods, sediment accumulation, and changing irrigation works caused the original Al-Alqami channel to silt up and eventually dry out. Modern Karbala is fed by modern canals (such as the Hussayniyya canal commissioned in the Ottoman period by Sultan Suleiman). The 61 AH course shown here is an educational topographical reconstruction based on geomorphological data of ancient paleochannels.`,
    sources: [
      { author: 'Al-Dinawari (d. 282 AH)', work: 'Al-Akhbar al-Tiwal', citation: 'Account of the Water Blockade' },
      { author: 'Yaqut al-Hamawi (d. 626 AH)', work: "Mu'jam al-Buldan", citation: 'Entry on Al-Taff and Nahr al-Alqami' },
      { author: 'Directorate of Antiquities, Iraq', work: 'Archaeological Survey of the Middle Euphrates', citation: 'Paleo-irrigation channels of Karbala, 1974' }
    ]
  },
  'tall_zaynabiyya': {
    title: "Tall al-Zaynabiyya (Lady Zaynab's Hillock)",
    level: 'TRADITIONALLY_ASSOCIATED',
    whyApproximate: true,
    explanation: `Tall al-Zaynabiyya marks the elevated sandy knoll from which Sayyida Zaynab bint Ali (SA) witnessed the tragic events of Ashura afternoon as the battle converged near the depression of the battlefield.

Historical records affirm that the battlefield featured natural undulating topography—sand dunes, ridges, and low-lying swales. As urban development expanded around the shrine over the past five centuries, the surrounding terrain was leveled, preserving this particular hillock as an elevated memorial.

The current elevated structure (recently reconstructed with grand stone arches) stands roughly 35 meters west of the shrine courtyard, reflecting the continuous oral and commemorative tradition of the holy household's witnesses.`,
    sources: [
      { author: 'Sayyid Ibn Tawus (d. 664 AH)', work: 'Al-Luhuf', citation: 'The Witness of Lady Zaynab on the Hillock' },
      { author: 'Muhammad Baqir al-Majlisi', work: 'Bihar al-Anwar', citation: 'Vol. 45, Narratives of Ashura afternoon' }
    ]
  },
  'kaff_abbas_right_left': {
    title: 'Maqam Kaff al-Abbas (Right and Left Hand Memorials)',
    level: 'TRADITIONALLY_ASSOCIATED',
    whyApproximate: true,
    explanation: `The two modest shrines located in the old alleys northeast and southeast of the Al-Abbas Holy Shrine commemorate the amputation of Abu al-Fadl al-Abbas's right and left hands during his return from the Euphrates riverbank with the waterskin.

Why is this marked Traditionally Associated / Approximate?
1. Primary texts (Abu Mikhnaf, Al-Mufid) confirm that Al-Abbas had his right hand struck by Zayd ibn Warqa al-Hanafi and Hakim ibn Tufayl al-Sinbisi, and his left hand amputated shortly after before being fatally wounded.
2. The specific street markers were preserved through centuries of neighborhood memory in the Bab Baghdad and Bab al-Khan quarters. 
3. While the exact meters where the strikes occurred cannot be proven with GPS-grade archaeological certainty, the shrines mark the general historical corridor through the date groves between the Alqami bank and the holy camp.`,
    sources: [
      { author: 'Shaykh al-Mufid (d. 413 AH)', work: 'Kitab al-Irshad', citation: 'pp. 381-383' },
      { author: 'Al-Khwarizmi (d. 568 AH)', work: 'Maqtal al-Husayn', citation: 'Vol. 2, pp. 30-33' }
    ]
  },
  'troop_numbers': {
    title: 'Size of Umar ibn Sa’ad’s Army',
    level: 'SOURCES_DIFFER',
    whyApproximate: true,
    explanation: `Classical primary sources present varying numbers regarding the total size of the Kufan army dispatched by Ubaydullah ibn Ziyad:

1. Abu Mikhnaf & Al-Baladhuri: Report that Umar ibn Sa'ad initially marched with 4,000 troops, followed by successive reinforcements under Shimr (4,000), Husayn ibn Numayr (4,000), Shabath ibn Rib'i (1,000), and others, totaling between 20,000 to 22,000 men.
2. Shaykh al-Saduq (d. 381 AH) & Ibn Tawus: Cite traditions reaching up to 30,000 armed combatants surrounding the camp on 9-10 Muharram.
3. Ibn Shahr Ashub (d. 588 AH): Mentions accounts reaching up to 35,000.

The historical educational reconstruction notes this range (4,000 vanguard growing to 20,000–30,000 full mobilization) rather than asserting one figure as uncontested fact.`,
    sources: [
      { author: 'Abu Mikhnaf / Tabari', work: 'Tarikh al-Tabari', citation: 'Vol. 5, pp. 409-415' },
      { author: 'Shaykh al-Saduq', work: 'Al-Amali', citation: 'Majlis 30' },
      { author: 'Ibn Shahr Ashub', work: "Manaqib Al Abi Talib", citation: 'Vol. 4, p. 98' }
    ]
  }
};
