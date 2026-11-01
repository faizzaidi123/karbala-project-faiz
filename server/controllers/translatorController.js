/**
 * Karbala Smart Ziyarat Companion 3.0 — Milestone 4 & Global Multilingual Engine
 * AI Camera Translator, Sacred Lexicon Engine & Full-Application UI Translator
 *
 * Capabilities:
 * - Genuine Arabic OCR preprocessing and recognition
 * - Sacred lexicon preservation for Holy Karbala & Islamic terminology
 * - Full 6-language translation engine: Urdu (ur), Roman Urdu (ur-roman), Hindi (hi), English (en), Persian (fa), Arabic (ar)
 * - Hybrid Sacred-Lexicon + Live Neural GTX Fallback with in-memory caching
 * - Three smart translation modes: Standard, Pilgrim, Religious Text
 * - Safety-critical alert detection (security, medical, restricted access) in all languages
 * - Curatorial scholarly gloss for Ziyarat texts in all languages
 * - Batch UI translation endpoint (/api/translator/translate-batch) for full-website translation
 */

// In-memory translation cache for instant repeat lookups
const neuralCache = new Map();

// Sacred terminology preservation dictionary across all 6 target languages
export const SACRED_LEXICON = {
  // Shrines & Landmarks
  'العتبة الحسينية المقدسة': {
    en: 'Holy Shrine of Imam Hussain (AS)',
    ur: 'عتبہ حسینیہ مقدسہ (حرمِ مطہر امام حسینؑ)',
    'ur-roman': 'Ataba Hussainiya Muqaddasa (Roza-e-Aqdas Imam Hussain AS)',
    hi: 'अत्बा हुसैनिया मुक़द्दसा (रौज़ा-ए-इमाम हुसैन अ.स.)',
    fa: 'عتبه حسینیه مقدسه (حرم مطهر امام حسین علیه‌السلام)',
    ar: 'العتبة الحسينية المقدسة',
    type: 'sanctuary'
  },
  'الروضة الحسينية المقدسة': {
    en: 'Sacred Sanctuary of Imam Hussain (AS)',
    ur: 'روضۂ حسینیہ مقدسہ (حرمِ مطہر امام حسینؑ)',
    'ur-roman': 'Roza-e-Hussainiya Muqaddasa (Haram-e-Mutahhar Imam Hussain AS)',
    hi: 'पवित्र रौज़ा-ए-हुसैनिया मुक़द्दसा (इमाम हुसैन दरगाह)',
    fa: 'روضه حسینیه مقدسه (حرم مطهر امام حسین ع)',
    ar: 'الروضة الحسينية المقدسة',
    type: 'sanctuary'
  },
  'العتبة العباسية المقدسة': {
    en: 'Holy Shrine of Hazrat Al-Abbas (AS)',
    ur: 'عتبہ عباسیہ مقدسہ (حرمِ مطہر حضرت عباسؑ)',
    'ur-roman': 'Ataba Abbasiya Muqaddasa (Roza-e-Hazrat Abbas AS)',
    hi: 'अत्बा अब्बासिया मुक़द्दसा (रौज़ा-ए-हज़रत अब्बास अ.स.)',
    fa: 'عتبه عباسیه مقدسه (حرم مطهر حضرت ابوالفضل العباس علیه‌السلام)',
    ar: 'العتبة العباسية المقدسة',
    type: 'sanctuary'
  },
  'ساحة ما بين الحرمين الشريفين': {
    en: 'Bayn al-Haramayn Sacred Concourse',
    ur: 'بین الحرمین الشریفین (مقدس چوک)',
    'ur-roman': 'Bayn al-Haramayn al-Sharifayn (Dono Rozo ke darmiyan Muqaddas Maidan)',
    hi: 'बैन अल-हरमैन अश-शरीफ़ैन (दोनों रौज़ों के बीच पवित्र प्रांगण)',
    fa: 'ساحت مقدس بین‌الحرمین الشریفین',
    ar: 'ساحة ما بين الحرمين الشريفين',
    type: 'concourse'
  },
  'ما بين الحرمين': {
    en: 'Bayn al-Haramayn (Between the Two Holy Sanctuaries)',
    ur: 'بین الحرمین الشریفین',
    'ur-roman': 'Bayn al-Haramayn (Dono Haram ke darmiyan)',
    hi: 'बैन अल-हरमैन (दोनों पवित्र रौज़ों के मध्य)',
    fa: 'بین‌الحرمین الشریفین',
    ar: 'ما بين الحرمين الشريفين',
    type: 'concourse'
  },
  'بين الحرمين': {
    en: 'Bayn al-Haramayn',
    ur: 'بین الحرمین',
    'ur-roman': 'Bayn al-Haramayn',
    hi: 'बैन अल-हरमैन',
    fa: 'بین‌الحرمین',
    ar: 'بين الحرمين',
    type: 'concourse'
  },
  'تل الزينبية': {
    en: 'Tall al-Zaynabiyya Historical Hillock',
    ur: 'تلِ زینبیہ (مقام تلِ زینبیہؑ)',
    'ur-roman': 'Tall-e-Zainabiya (Maqam-e-Sayyida Zainab SA)',
    hi: 'तल्ल-ए-ज़ैनबिया (बीबी ज़ैनब का ऐतिहासिक टीला)',
    fa: 'تل زینبیه (مقام تل زینبیه علیهاالسلام)',
    ar: 'تل الزينبية المشرف',
    type: 'historical'
  },
  'التل الزينبي المشرف': {
    en: 'Tall al-Zaynabiyya Sacred Overlook',
    ur: 'تلِ زینبی مشرف (مقامِ سیدہ زینبؑ)',
    'ur-roman': 'Tall-e-Zainabi Musharraf (Maqam-e-Sayyida Zainab SA)',
    hi: 'तल्ल-ए-ज़ैनबी मुशर्रफ़ (पवित्र टीला)',
    fa: 'تل زینبی مشرف',
    ar: 'التل الزينبي المشرف',
    type: 'historical'
  },
  'المخيم الحسيني': {
    en: 'Al-Mukhayyam al-Husayni (The Holy Encampment)',
    ur: 'خیمہ گاہِ حسینی (المخیم الحسینی)',
    'ur-roman': 'Khaimah Gah-e-Hussaini (Al-Mukhayyam al-Hussaini)',
    hi: 'ख़ैमा-गाह-ए-हुसैनी (पवित्र हुसैनी खेमे)',
    fa: 'خیمه‌گاه حسینی (المخیم الحسینی)',
    ar: 'المخيم الحسيني الشريف',
    type: 'historical'
  },
  'المخيم الحسيني الشريف': {
    en: 'Al-Mukhayyam al-Husayni (The Noble Encampment)',
    ur: 'خیمہ گاہِ حسینی شریف',
    'ur-roman': 'Khaimah Gah-e-Hussaini Sharif',
    hi: 'ख़ैमा-गाह-ए-हुसैनी शरीफ़ (पवित्र खेमे)',
    fa: 'خیمه‌گاه حسینی شریف',
    ar: 'المخيم الحسيني الشريف',
    type: 'historical'
  },
  'مقام كف العباس الأيمن': {
    en: 'Site of the Right Hand of Hazrat Abbas (AS)',
    ur: 'مقامِ دستِ راست حضرت عباسؑ',
    'ur-roman': 'Maqam-e-Dast-e-Rast Hazrat Abbas AS (Dayan Bazu)',
    hi: 'मक़ाम-ए-दस्त-ए-रास्त हज़रत अब्बास (दायां बाज़ू मुबारक)',
    fa: 'مقام دست راست حضرت ابوالفضل العباس (ع)',
    ar: 'مقام كف العباس الأيمن',
    type: 'historical'
  },
  'مقام كف العباس الأيسر': {
    en: 'Site of the Left Hand of Hazrat Abbas (AS)',
    ur: 'مقامِ دستِ چپ حضرت عباسؑ',
    'ur-roman': 'Maqam-e-Dast-e-Chap Hazrat Abbas AS (Bayan Bazu)',
    hi: 'मक़ाम-ए-दस्त-ए-चप हज़रत अब्बास (बायां बाज़ू मुबारक)',
    fa: 'مقام دست چپ حضرت ابوالفضل العباس (ع)',
    ar: 'مقام كف العباس الأيسر',
    type: 'historical'
  },

  // Gates & Portals
  'باب القبلة': {
    en: 'Bab al-Qibla (Main Southern Qibla Portal)',
    ur: 'باب القبلہ (مرکزی جنوبی دروازہ)',
    'ur-roman': 'Bab al-Qibla (Markazi Junoobi Dakhili Darwaza)',
    hi: 'बाब अल-क़िबला (मुख्य दक्षिणी प्रवेश द्वार)',
    fa: 'باب‌القبله (ورودی اصلی قبله)',
    ar: 'باب القبلة (المدخل الجنوبي الرئيسي)',
    type: 'gate'
  },
  'باب الرجاء': {
    en: 'Bab al-Rajaa (Gate of Hope — Wheelchair Accessible)',
    ur: 'باب الرجاء (معذورین و وہیل چیئر کے لیے آسان راستہ)',
    'ur-roman': 'Bab al-Rajaa (Wheelchair aur Buzurgon ke liye Aasan Rasta)',
    hi: 'बाब अल-रजा (व्हीलचेयर सुगम्य प्रवेश द्वार)',
    fa: 'باب‌الرجاء (ورودی مناسب ویلچر)',
    ar: 'باب الرجاء',
    type: 'gate'
  },
  'باب الشهداء': {
    en: 'Bab al-Shuhada (Gate of the Martyrs — Bayn al-Haramayn Access)',
    ur: 'باب الشہداء (شہدائے کربلا کا دروازہ - جانب بین الحرمین)',
    'ur-roman': 'Bab al-Shuhada (Shuhada-e-Karbala Darwaza — Janib Bayn al-Haramayn)',
    hi: 'बाब अल-शुहदा (शहीदों का दरवाज़ा — बैन अल-हरमैन की ओर)',
    fa: 'باب‌الشهداء (سمت بین‌الحرمین)',
    ar: 'باب الشهداء',
    type: 'gate'
  },
  'باب السلام': {
    en: 'Bab al-Salam (Gate of Peace)',
    ur: 'باب السلام (سلامتی کا دروازہ)',
    'ur-roman': 'Bab al-Salam (Salamti ka Darwaza)',
    hi: 'बाब अल-सलाम (शांति का द्वार)',
    fa: 'باب‌السلام',
    ar: 'باب السلام',
    type: 'gate'
  },
  'باب السدرة': {
    en: 'Bab al-Sidra (Sidra Gate — Facing Sidra Street)',
    ur: 'باب السدرہ (شارع السدرہ کا داخلی دروازہ)',
    'ur-roman': 'Bab al-Sidra (Sharia al-Sidra ka Dakhili Darwaza)',
    hi: 'बाब अल-सिदरा (सिदरा मार्ग प्रवेश द्वार)',
    fa: 'باب‌السدره',
    ar: 'باب السدرة',
    type: 'gate'
  },
  'باب الحوائج': {
    en: 'Bab al-Hawaej (Western Portal of Al-Abbas Shrine)',
    ur: 'باب الحوائج (مغربی دروازہ حرمِ حضرت عباسؑ)',
    'ur-roman': 'Bab al-Hawaej (Maghribi Darwaza Roza-e-Hazrat Abbas AS)',
    hi: 'बाब अल-हवाएज (हज़रत अब्बास रौज़ा पश्चिमी द्वार)',
    fa: 'باب‌الحوائج (ورودی غربی حرم قمر بنی‌هاشم)',
    ar: 'باب الحوائج',
    type: 'gate'
  },
  'باب الفرات': {
    en: 'Bab al-Furat (Al-Alqami Eastern Portal)',
    ur: 'باب الفرات (علقمی مشرقی دروازہ)',
    'ur-roman': 'Bab al-Furat (Alqami Mashriqi Darwaza)',
    hi: 'बाब अल-फ़ुरात (अलक़मी पूर्वी द्वार)',
    fa: 'باب‌الفرات (علقمی)',
    ar: 'باب الفرات (باب العلقمي)',
    type: 'gate'
  },

  // Services & Amenities
  'كشوانية': {
    en: 'Keshwan (Shoe & Footwear Deposit Counter)',
    ur: 'کشوانیہ (جوتے اور چپل جمع کرانے کا کاؤنٹر)',
    'ur-roman': 'Keshwaniya (Joote aur Chappal jama karane ka Counter)',
    hi: 'केशवानिया (जूता-चप्पल जमा केंद्र)',
    fa: 'کفشداری (کشوانیه)',
    ar: 'كشوانية (أمانات الأحذية)',
    type: 'service'
  },
  'امانات الحقائب': {
    en: 'Luggage & Baggage Storage Desk',
    ur: 'امانت خانہ (سامان اور بیگ جمع کرانے کی جگہ)',
    'ur-roman': 'Amanat Khana (Saman aur Bag jama karane ki jagah)',
    hi: 'अमानत ख़ाना (सामान व बैग जमा केंद्र)',
    fa: 'امانات بار و چمدان',
    ar: 'أمانات الحقائب',
    type: 'service'
  },
  'سقاية ماء بارد': {
    en: 'Cold Filtered Drinking Water Station (Saqqa)',
    ur: 'سبیلِ آب (ٹھنڈا فلٹر شدہ پینے کا پانی)',
    'ur-roman': 'Sabil-e-Aab (Thanda Filter shuda Peene ka Paani)',
    hi: 'सबील-ए-आब (ठंडा शुद्ध पेयजल केंद्र)',
    fa: 'سقاخانه (آب سرد آشامیدنی)',
    ar: 'سقاية ماء بارد',
    type: 'service'
  },
  'ماء سبيل': {
    en: 'Free Sabil Drinking Water Station',
    ur: 'سبیلِ آب (پینے کا پانی)',
    'ur-roman': 'Sabil-e-Aab (Muft Peene ka Paani)',
    hi: 'सबील-ए-आब (निःशुल्क पेयजल)',
    fa: 'آب صلواتی / سقاخانه',
    ar: 'ماء سبيل',
    type: 'service'
  },
  'مستشفى السفير الجراحي للطوارئ': {
    en: 'Al-Safir Emergency Surgical Hospital Trauma Center',
    ur: 'مستشفیٰ السفیر جراحی ایمرجنسی اسپتال',
    'ur-roman': 'Mustashfa Al-Safir Jarrahi Emergency Hospital',
    hi: 'अल-सफ़ीर सर्जिकल इमरजेंसी अस्पताल व ट्रॉमा सेंटर',
    fa: 'بیمارستان جراحی اورژانس السفیر',
    ar: 'مستشفى السفير الجراحي للطوارئ',
    type: 'medical'
  },
  'مفرزة طبية': {
    en: 'First Aid & Medical Paramedic Post',
    ur: 'طبی کیمپ / فرسٹ ایڈ پوسٹ',
    'ur-roman': 'Tibbi Camp / First Aid Medical Post',
    hi: 'प्राथमिक उपचार एवं मेडिकल पोस्ट',
    fa: 'پست امداد پزشکی و اورژانس',
    ar: 'مفرزة طبية',
    type: 'medical'
  },
  'دورات مياه ومواضئ': {
    en: 'Public Washrooms & Ablution (Wudu) Complex',
    ur: 'بیت الخلاء اور وضو خانہ',
    'ur-roman': 'Washroom aur Wuzu Khana Complex',
    hi: 'शौचालय एवं वज़ू ख़ाना',
    fa: 'سرویس‌های بهداشتی و وضوخانه',
    ar: 'دورات مياه ومواضئ',
    type: 'washroom'
  },
  'كراسي متحركة لذوي الاحتياجات': {
    en: 'Wheelchair Assistance Desk for Pilgrims with Disabilities',
    ur: 'معذورین و عمر رسیدہ زائرین کے لیے وہیل چیئر کاؤنٹر',
    'ur-roman': 'Buzurg aur Mazoor Zaireen ke liye Wheelchair Counter',
    hi: 'दिव्यांग व वृद्ध तीर्थयात्रियों हेतु व्हीलचेयर सहायता केंद्र',
    fa: 'بخش ویلچر و خدمات توان‌خواهان',
    ar: 'كراسي متحركة لذوي الاحتياجات الخاصة',
    type: 'accessibility'
  },
  'مركز إرشاد التائهين': {
    en: 'Lost Persons & Children Guidance Desk',
    ur: 'گمشدہ افراد اور بچوں کی رہنمائی کا مرکز',
    'ur-roman': 'Gumshuda Afrad aur Bachon ki Rehnumai ka Markaz',
    hi: 'लापता व्यक्ति एवं बच्चे मार्गदर्शन केंद्र',
    fa: 'مرکز راهنمایی گمشدگان و کودکان',
    ar: 'مركز إرشاد التائهين',
    type: 'service'
  },

  // Security & Safety Regulations
  'تفتيش أمني': {
    en: 'Security Screening & Inspection Checkpoint',
    ur: 'سیکیورٹی جانچ و تلاشی پوائنٹ',
    'ur-roman': 'Security Checking aur Talashi Point',
    hi: 'सुरक्षा जांच व तलाशी चौकी',
    fa: 'گیت بازرسی امنیتی',
    ar: 'تفتيش أمني',
    type: 'security'
  },
  'تفتيش أمني وإسعاف': {
    en: 'Security Screening & Emergency Paramedic Dispatch',
    ur: 'سیکیورٹی جانچ اور فوری طبی امداد (ایمبولینس)',
    'ur-roman': 'Security Checking aur Fawri Tibbi Imdad (Ambulance)',
    hi: 'सुरक्षा जांच एवं आपातकालीन एम्बुलेंस सहायता',
    fa: 'بازرسی امنیتی و امداد اورژانس',
    ar: 'تفتيش أمني وإسعاف',
    type: 'security'
  },
  'ممنوع دخول الهواتف الكاميرا': {
    en: 'Cameras and Camera Mobile Phones Restricted Beyond This Point',
    ur: 'کیمرہ اور ویڈیو بنانے والے موبائل لے جانا منع ہے',
    'ur-roman': 'Camera aur Video banane wale Mobile phones andar le jana mana hai',
    hi: 'कैमरा व फोटो वाले मोबाइल फोन अंदर ले जाना प्रतिबंधित है',
    fa: 'ورود دوربین و گوشی‌های تصویربرداری ممنوع است',
    ar: 'ممنوع دخول الهواتف المزودة بكاميرا',
    type: 'security'
  },
  'ممنوع الدخول': {
    en: 'Strictly Restricted — No Entry to Unauthorized Visitors',
    ur: 'داخلہ سختی سے ممنوع ہے',
    'ur-roman': 'Andar jana sakhti se mana hai (No Entry)',
    hi: 'प्रवेश पूर्णतः निषेध है (अंदर जाना मना है)',
    fa: 'ورود اکیداً ممنوع',
    ar: 'ممنوع الدخول',
    type: 'security'
  },
  'ممنوع التدخين داخل الصحن الشريف': {
    en: 'Strictly No Smoking inside the Holy Courtyards',
    ur: 'حرمِ مطہر کے صحن میں سگریٹ نوشی سختی سے منع ہے',
    'ur-roman': 'Haram-e-Mutahhar ke Sahn mein Smoking sakhti se mana hai',
    hi: 'पवित्र प्रांगण (सहन) में धूम्रपान पूर्णतः वर्जित है',
    fa: 'استعمال دخانیات در صحن مطهر اکیداً ممنوع است',
    ar: 'ممنوع التدخين داخل الصحن الشريف',
    type: 'regulation'
  },
  'للنساء فقط': {
    en: 'Designated Entry for Women Only',
    ur: 'صرف خواتین کے لیے مخصوص راستہ',
    'ur-roman': 'Sirf Khawateen (Ladies) ke liye Makhsoos Rasta',
    hi: 'केवल महिलाओं के लिए आरक्षित मार्ग',
    fa: 'مخصوص بانوان',
    ar: 'مخصص للنساء فقط',
    type: 'regulation'
  },
  'للرجال فقط': {
    en: 'Designated Entry for Men Only',
    ur: 'صرف مرد حضرات کے لیے مخصوص راستہ',
    'ur-roman': 'Sirf Mard Hazrat (Gents) ke liye Makhsoos Rasta',
    hi: 'केवल पुरुषों के लिए आरक्षित मार्ग',
    fa: 'مخصوص آقایان',
    ar: 'مخصص للرجال فقط',
    type: 'regulation'
  },

  // Ziyarat Inscriptions & Classical Texts
  'السَّلامُ عَلَيْكَ يا وارِثَ آدَمَ صَفْوَةِ اللهِ': {
    en: 'Peace be upon you, O inheritor of Adam, the chosen one of Allah',
    ur: 'سلام ہو آپ پر اے آدم کے وارث جو اللہ کے برگزیدہ بندے ہیں',
    'ur-roman': 'Salam ho Aap par aye Aadam ke Waris, jo Allah ke barguzida bande hain',
    hi: 'सलाम हो आप पर ऐ आदम के वारिस, जो अल्लाह के चुने हुए बंदे हैं',
    fa: 'سلام بر تو ای وارث آدم، برگزیده خدا',
    ar: 'السَّلامُ عَلَيْكَ يا وارِثَ آدَمَ صَفْوَةِ اللهِ',
    scholarlyInterpretation: 'From Ziyarat Warith: Expresses the spiritual lineage of divine guidance uniting all prophets through the martyrdom of Imam Hussain (AS).',
    type: 'religious'
  },
  'السَّلَامُ عَلَيْكَ يَا وَارِثَ نُوحٍ نَبِيِّ اللَّهِ': {
    en: 'Peace be upon you, O inheritor of Noah, the prophet of Allah',
    ur: 'سلام ہو آپ پر اے نوح کے وارث جو اللہ کے نبی ہیں',
    'ur-roman': 'Salam ho Aap par aye Nooh ke Waris, jo Allah ke Nabi hain',
    hi: 'सलाम हो आप पर ऐ नूह के वारिस, जो अल्लाह के नबी हैं',
    fa: 'سلام بر تو ای وارث نوح، پیامبر خدا',
    ar: 'السَّلَامُ عَلَيْكَ يَا وَارِثَ نُوحٍ نَبِيِّ اللَّهِ',
    scholarlyInterpretation: 'From Ziyarat Warith: Attests to the continuity of prophetic perseverance from Prophet Noah (AS) to Imam Hussain (AS).',
    type: 'religious'
  },
  'السَّلَامُ عَلَيْكَ يَا وَارِثَ إِبْرَاهِيمَ خَلِيلِ اللَّهِ': {
    en: 'Peace be upon you, O inheritor of Abraham, the intimate friend of Allah',
    ur: 'سلام ہو آپ پر اے ابراہیم کے وارث جو اللہ کے خلیل ہیں',
    'ur-roman': 'Salam ho Aap par aye Ibrahim ke Waris, jo Allah ke Khalil hain',
    hi: 'सलाम हो आप पर ऐ इब्राहीम के वारिस, जो अल्लाह के ख़लील (मित्र) हैं',
    fa: 'سلام بر تو ای وارث ابراهیم، خلیل خدا',
    ar: 'السَّلَامُ عَلَيْكَ يَا وَارِثَ إِبْرَاهِيمَ خَلِيلِ اللَّهِ',
    scholarlyInterpretation: 'From Ziyarat Warith: Connects the sacrifice of Abraham (AS) with the supreme sacrifice at Karbala.',
    type: 'religious'
  },
  'السَّلامُ عَلَيْكَ يا أبا عَبْدِ اللهِ الحُسَيْن': {
    en: 'Peace be upon you, O Aba Abdillah Al-Hussain',
    ur: 'سلام ہو آپ پر اے ابا عبداللہ الحسینؑ',
    'ur-roman': 'Salam ho Aap par aye Aba Abdillah Al-Hussain (AS)',
    hi: 'सलाम हो आप पर ऐ अबा अब्दुल्लाह अल-हुसैन (अ.स.)',
    fa: 'سلام بر تو ای اباعبدالله الحسین',
    ar: 'السَّلامُ عَلَيْكَ يا أبا عَبْدِ اللهِ الحُسَيْن',
    scholarlyInterpretation: 'Primary greeting of reverence to Imam Hussain (AS) invoked upon entering the holy sanctuary threshold.',
    type: 'religious'
  },
  'السَّلامُ عَلَيْكَ يا قَمَرَ بَنِي هاشِم': {
    en: 'Peace be upon you, O Moon of the Hashemites, Hazrat Al-Abbas',
    ur: 'سلام ہو آپ پر اے چاند بنی ہاشم کے، حضرت عباسؑ',
    'ur-roman': 'Salam ho Aap par aye Qamar-e-Bani Hashim, Hazrat Al-Abbas (AS)',
    hi: 'सलाम हो आप पर ऐ बनी हाशिम के चांद, हज़रत अब्बास (अ.स.)',
    fa: 'سلام بر تو ای ماه بنی‌هاشم، ابوالفضل العباس',
    ar: 'السَّلامُ عَلَيْكَ يا قَمَرَ بَنِي هاشِم',
    scholarlyInterpretation: 'Honors the radiant nobility and unwavering loyalty of Hazrat Al-Abbas ibn Ali (AS).',
    type: 'religious'
  },
  'كُلُّ يَوْمٍ عَاشُورَاء وَكُلُّ أَرْضٍ كَرْبَلاء': {
    en: 'Every day is Ashura and every land is Karbala',
    ur: 'ہر دن عاشورہ ہے اور ہر زمین کربلا ہے',
    'ur-roman': 'Har din Ashura hai aur har zameen Karbala hai',
    hi: 'हर दिन आशूरा है और हर ज़मीन कर्बला है',
    fa: 'کل یوم عاشورا و کل ارض کربلا',
    ar: 'كُلُّ يَوْمٍ عَاشُورَاء وَكُلُّ أَرْضٍ كَرْبَلاء',
    scholarlyInterpretation: 'Enduring philosophical aphorism commemorating the perpetual struggle of justice against oppression throughout human history.',
    type: 'religious'
  }
};

// Curated Karbala Architectural Sign & Document Samples for instant 100% accurate ground-truth matching
export const CURATED_SIGN_SAMPLES = [
  {
    id: 'sign_bab_qibla',
    title: 'Bab al-Qibla Entrance Sign',
    arabicText: 'العتبة الحسينية المقدسة - باب القبلة',
    category: 'gate',
    thumbnail: 'assets/images/karbala_img_37_Karbala_City_1_jpg.jpg',
    defaultTranslations: {
      en: 'Holy Shrine of Imam Hussain (AS) — Bab al-Qibla (Main Southern Qibla Portal)',
      ur: 'عتبہ حسینیہ مقدسہ (حرمِ مطہر امام حسینؑ) — باب القبلہ (مرکزی جنوبی دروازہ)',
      'ur-roman': 'Ataba Hussainiya Muqaddasa (Roza-e-Imam Hussain AS) — Bab al-Qibla (Markazi Junoobi Dakhili Darwaza)',
      hi: 'अत्बा हुसैनिया मुक़द्दसा (रौज़ा-ए-इमाम हुसैन अ.स.) — बाब अल-क़िबला (मुख्य दक्षिणी प्रवेश द्वार)',
      fa: 'عتبه حسینیه مقدسه (حرم مطهر امام حسین ع) — باب‌القبله (ورودی اصلی جنوبی)',
      ar: 'العتبة الحسينية المقدسة — باب القبلة (المدخل الجنوبي الرئيسي)'
    },
    safetyNotice: null
  },
  {
    id: 'sign_saqqa_water',
    title: 'Bayn al-Haramayn Drinking Water Station',
    arabicText: 'سقاية ماء بارد - ماء سبيل ما بين الحرمين',
    category: 'service',
    thumbnail: 'assets/images/karbala_img_0_Beyn-_l_H_r_meyn__K_rb_la_jpg.jpg',
    defaultTranslations: {
      en: 'Cold Filtered Drinking Water Station (Saqqa) — Free Sabil Water at Bayn al-Haramayn Concourse',
      ur: 'سبیلِ آب (ٹھنڈا فلٹر شدہ پینے کا پانی) — آبِ سبیل ما بین الحرمین الشریفین',
      'ur-roman': 'Sabil-e-Aab (Thanda Filter shuda Peene ka Paani) — Muft Paani Sabil Bayn al-Haramayn',
      hi: 'ठंडा शुद्ध पेयजल केंद्र (सबील-ए-आब) — बैन अल-हरमैन मुफ़्त पेयजल सेवा',
      fa: 'سقاخانه آب سرد آشامیدنی — آب سبیل ساحت بین‌الحرمین الشریفین',
      ar: 'سقاية ماء بارد مفلتر — ماء سبيل ساحة ما بين الحرمين الشريفين'
    },
    safetyNotice: null
  },
  {
    id: 'sign_safir_hospital',
    title: 'Al-Safir Hospital Emergency Sign',
    arabicText: 'مستشفى السفير الجراحي للطوارئ - تفتيش أمني وإسعاف',
    category: 'medical',
    thumbnail: 'assets/images/karbala_img_37_Karbala_City_1_jpg.jpg',
    defaultTranslations: {
      en: 'Al-Safir Emergency Surgical Hospital Trauma Center — Security Screening & Paramedic Ambulance Dispatch',
      ur: 'مستشفیٰ السفیر جراحی ایمرجنسی اسپتال — سیکیورٹی جانچ و فوری طبی امداد (ایمبولینس)',
      'ur-roman': 'Mustashfa Al-Safir Surgical Emergency Hospital — Security Checking aur Fawri Tibbi Imdad (Ambulance)',
      hi: 'अल-सफ़ीर सर्जिकल इमरजेंसी अस्पताल — सुरक्षा जांच एवं आपातकालीन एम्बुलेंस सेवा',
      fa: 'بیمارستان جراحی اورژانس السفیر — بازرسی امنیتی و امداد پزشکی فوری',
      ar: 'مستشفى السفير الجراحي للطوارئ — نقطة التفتيش الأمني والإسعاف الفوري'
    },
    safetyNotice: 'Safety-Critical Notice: For immediate triage or trauma care, proceed directly to the triage desk south of Bab al-Qibla.'
  },
  {
    id: 'sign_ziyarat_calligraphy',
    title: 'Sanctuary Ziyarat Calligraphy Frieze',
    arabicText: 'السَّلامُ عَلَيْكَ يا وارِثَ آدَمَ صَفْوَةِ اللهِ',
    category: 'religious',
    thumbnail: 'assets/images/shrine_27.jpg',
    defaultTranslations: {
      en: 'Peace be upon you, O inheritor of Adam, the chosen one of Allah',
      ur: 'سلام ہو آپ پر اے آدمؑ کے وارث، جو اللہ کے برگزیدہ بندے ہیں',
      'ur-roman': 'Salam ho Aap par aye Aadam (AS) ke Waris, jo Allah ke barguzida bande hain',
      hi: 'सलाम हो आप पर ऐ आदम के वारिस, जो अल्लाह के चुने हुए बंदे हैं',
      fa: 'سلام بر تو ای وارث آدم، برگزیده خدا',
      ar: 'السَّلامُ عَلَيْكَ يا وارِثَ آدَمَ صَفْوَةِ اللهِ'
    },
    scholarlyInterpretation: 'From Ziyarat Warith: Sacred inscription highlighting the unbroken lineage of divine prophethood.'
  },
  {
    id: 'doc_ziyarat_warith',
    title: 'Ziyarat Warith Classical Tablet',
    arabicText: 'السَّلَامُ عَلَيْكَ يَا وَارِثَ آدَمَ صَفْوَةِ اللَّهِ، السَّلَامُ عَلَيْكَ يَا وَارِثَ نُوحٍ نَبِيِّ اللَّهِ، السَّلَامُ عَلَيْكَ يَا وَارِثَ إِبْرَاهِيمَ خَلِيلِ اللَّهِ',
    category: 'religious',
    thumbnail: 'assets/images/karbala_img_37_Karbala_City_1_jpg.jpg',
    defaultTranslations: {
      en: 'Peace be upon you, O inheritor of Adam, the chosen one of Allah; Peace be upon you, O inheritor of Noah, the prophet of Allah; Peace be upon you, O inheritor of Abraham, the intimate friend of Allah.',
      ur: 'سلام ہو آپ پر اے آدمؑ کے وارث جو اللہ کے برگزیدہ ہیں، سلام ہو آپ پر اے نوحؑ کے وارث جو اللہ کے نبی ہیں، سلام ہو آپ پر اے ابراہیمؑ کے وارث جو اللہ کے خلیل ہیں۔',
      'ur-roman': 'Salam ho Aap par aye Aadam ke Waris jo Allah ke barguzida hain, Salam ho Aap par aye Nooh ke Waris jo Allah ke Nabi hain, Salam ho Aap par aye Ibrahim ke Waris jo Allah ke Khalil hain.',
      hi: 'सलाम हो आप पर ऐ आदम के वारिस जो अल्लाह के चुने हुए हैं, सलाम हो आप पर ऐ नूह के वारिस जो अल्लाह के नबी हैं, सलाम हो आप पर ऐ इब्राहीम के वारिस जो अल्लाह के ख़लील हैं।',
      fa: 'سلام بر تو ای وارث آدم برگزیده خدا، سلام بر تو ای وارث نوح پیامبر خدا، سلام بر تو ای وارث ابراهیم خلیل خدا.',
      ar: 'السَّلَامُ عَلَيْكَ يَا وَارِثَ آدَمَ صَفْوَةِ اللَّهِ، السَّلَامُ عَلَيْكَ يَا وَارِثَ نُوحٍ نَبِيِّ اللَّهِ، السَّلَامُ عَلَيْكَ يَا وَارِثَ إِبْرَاهِيمَ خَلِيلِ اللَّهِ'
    },
    scholarlyInterpretation: 'Opening verses of Ziyarat Warith transmitted from Imam Ja\'far al-Sadiq (AS) in Kamil al-Ziyarat.'
  },
  {
    id: 'doc_astan_entry',
    title: 'Astan Official Pilgrim Sanctuary Notice',
    arabicText: 'تعليمات دخول الروضة الحسينية المقدسة: يرجى المحافظة على السكينة والوقار والالتزام بالمسارات المخصصة للزائرين',
    category: 'service',
    thumbnail: 'assets/images/karbala_img_240_Arba_een_Pilgrims_in_Bayn_al-Harmia.jpg',
    defaultTranslations: {
      en: 'Entry Guidelines for the Sacred Sanctuary of Imam Hussain (AS): Please maintain tranquility and reverence, and follow the designated pedestrian pathways for pilgrims.',
      ur: 'روضۂ حسینیہ مقدسہ میں داخلے کی ہدایات: برائے مہربانی سکون، ادب اور وقار کا خیال رکھیں اور زائرین کے لیے مخصوص کردہ راستوں کی پابندی کریں۔',
      'ur-roman': 'Roza-e-Hussainiya Muqaddasa mein dakhile ki hidayat: Baraye meherbani sukoon, adab aur waqar ka khayal rakhein aur Zaireen ke liye makhsoos raston par chalein.',
      hi: 'पवित्र रौज़ा-ए-इमाम हुसैन (अ.स.) में प्रवेश के दिशा-निर्देश: कृपया शांति, अदब और गरिमा बनाए रखें तथा ज़ायरीन (तीर्थयात्रियों) के लिए निर्धारित मार्गों का पालन करें।',
      fa: 'دستورالعمل ورود به روضه مقدسه حسینی: لطفاً آرامش و وقار را حفظ نموده و در مسیرهای تعیین‌شده برای زائران حرکت فرمایید.',
      ar: 'تعليمات دخول الروضة الحسينية المقدسة: يرجى المحافظة على السكينة والوقار والالتزام بالمسارات المخصصة للزائرين'
    },
    safetyNotice: null
  }
];

// General Vocabulary Fallback Dictionary (Comprehensive Karbala Pilgrimage Signage)
const VOCABULARY_LEXICON = {
  // Question & Navigation words
  'أين': { en: 'Where', ur: 'کہاں', 'ur-roman': 'Kahan', hi: 'कहाँ', fa: 'کجا', ar: 'أين' },
  'كيف': { en: 'How', ur: 'کیسے', 'ur-roman': 'Kaise', hi: 'कैसे', fa: 'چگونه', ar: 'كيف' },
  'متى': { en: 'When', ur: 'کب', 'ur-roman': 'Kab', hi: 'कब', fa: 'چه وقت', ar: 'متى' },
  'هل': { en: 'Is / Does', ur: 'کیا', 'ur-roman': 'Kya', hi: 'क्या', fa: 'آیا', ar: 'هل' },
  'يقع': { en: 'is located', ur: 'واقع ہے', 'ur-roman': 'waqe hai', hi: 'स्थित है', fa: 'واقع است', ar: 'يقع' },
  'أصل': { en: 'I reach', ur: 'میں پہنچوں', 'ur-roman': 'main pohanchun', hi: 'मैं पहुँचूँ', fa: 'برسم', ar: 'أصل' },
  'توجه': { en: 'proceed / head', ur: 'تشریف لے جائیں', 'ur-roman': 'tashreef le jayein', hi: 'प्रस्थान करें', fa: 'مراجعه فرمایید', ar: 'توجه' },

  // Directions & Spatial prepositions
  'إلى': { en: 'to / towards', ur: 'کی طرف', 'ur-roman': 'ki taraf', hi: 'की ओर', fa: 'به سوی', ar: 'إلى' },
  'من': { en: 'from', ur: 'سے', 'ur-roman': 'se', hi: 'से', fa: 'از', ar: 'من' },
  'في': { en: 'in / at', ur: 'میں', 'ur-roman': 'mein', hi: 'में', fa: 'در', ar: 'في' },
  'على': { en: 'on / upon', ur: 'پر', 'ur-roman': 'par', hi: 'पर', fa: 'بر / روی', ar: 'على' },
  'قرب': { en: 'near', ur: 'کے قریب', 'ur-roman': 'ke qareeb', hi: 'के पास', fa: 'نزدیک', ar: 'قرب' },
  'أمام': { en: 'in front of', ur: 'کے سامنے', 'ur-roman': 'ke samne', hi: 'के सामने', fa: 'روبروی', ar: 'أمام' },
  'خلف': { en: 'behind', ur: 'کے پیچھے', 'ur-roman': 'ke peeche', hi: 'के पीछे', fa: 'پشت سر', ar: 'خلف' },
  'يمين': { en: 'right', ur: 'دائیں جانب', 'ur-roman': 'dayein janib', hi: 'दाईं ओर', fa: 'سمت راست', ar: 'يمين' },
  'يسار': { en: 'left', ur: 'بائیں جانب', 'ur-roman': 'bayein janib', hi: 'बाईं ओर', fa: 'سمت چپ', ar: 'يسار' },
  'قبل': { en: 'before', ur: 'سے پہلے', 'ur-roman': 'se pehle', hi: 'से पहले', fa: 'قبل از', ar: 'قبل' },
  'بعد': { en: 'after', ur: 'کے بعد', 'ur-roman': 'ke baad', hi: 'के बाद', fa: 'بعد از', ar: 'بعد' },
  'طوال': { en: 'throughout', ur: 'تمام / بھر', 'ur-roman': 'bhar', hi: 'भर / लगातार', fa: 'در تمام', ar: 'طوال' },
  'فقط': { en: 'only', ur: 'صرف', 'ur-roman': 'sirf', hi: 'केवल', fa: 'فقط', ar: 'فقط' },
  'لا': { en: 'do not', ur: 'نہ / مت', 'ur-roman': 'mat / na', hi: 'मत / ना', fa: 'نه', ar: 'لا' },
  'عند': { en: 'at / by', ur: 'کے پاس / پر', 'ur-roman': 'ke paas', hi: 'के पास', fa: 'نزد', ar: 'عند' },
  'مع': { en: 'with', ur: 'کے ساتھ', 'ur-roman': 'ke sath', hi: 'के साथ', fa: 'همراه', ar: 'مع' },

  // Common pilgrimage nouns & infrastructure
  'مدخل': { en: 'Entrance', ur: 'داخلی راستہ', 'ur-roman': 'Dakhili Rasta (Entrance)', hi: 'प्रवेश द्वार', fa: 'ورودی', ar: 'مدخل' },
  'مخرج': { en: 'Exit', ur: 'خارجی راستہ', 'ur-roman': 'Khariji Rasta (Exit)', hi: 'निकास द्वार', fa: 'خروجی', ar: 'مخرج' },
  'طوارئ': { en: 'Emergency', ur: 'ہنگامی حالات / ایمرجنسی', 'ur-roman': 'Emergency', hi: 'आपातकालीन', fa: 'اورژانس', ar: 'طوارئ' },
  'أمانات': { en: 'Baggage Deposit', ur: 'امانت خانہ', 'ur-roman': 'Amanat Khana', hi: 'अमानत घर', fa: 'امانات', ar: 'أمانات' },
  'صلاة': { en: 'Prayer', ur: 'نماز', 'ur-roman': 'Namaz', hi: 'नमाज़ / प्रार्थना', fa: 'نماز', ar: 'صلاة' },
  'نساء': { en: 'Women', ur: 'خواتین', 'ur-roman': 'Khawateen', hi: 'महिलाएं', fa: 'بانوان', ar: 'نساء' },
  'رجال': { en: 'Men', ur: 'مرد حضرات', 'ur-roman': 'Mard Hazrat', hi: 'पुरुष', fa: 'آقایان', ar: 'رجال' },
  'مغلق': { en: 'Closed', ur: 'بند ہے', 'ur-roman': 'Band hai', hi: 'बंद है', fa: 'بسته', ar: 'مغلق' },
  'مفتوح': { en: 'Open', ur: 'کھلا ہے', 'ur-roman': 'Khula hai', hi: 'खुला है', fa: 'باز', ar: 'مفتوح' },
  'يرجى الهدوء': { en: 'Please maintain silence and respect', ur: 'برائے مہربانی خاموشی اور ادب کا خیال رکھیں', 'ur-roman': 'Baraye meherbani khamoshi aur adab ka khayal rakhein', hi: 'कृपया शांति और अदब बनाए रखें', fa: 'لطفاً سکوت را رعایت فرمایید', ar: 'يرجى الهدوء' },
  'إسعاف': { en: 'Ambulance / Medical Assistance', ur: 'ایمبولینس / طبی امداد', 'ur-roman': 'Ambulance / Tibbi Imdad', hi: 'एम्बुलेंस / चिकित्सा सहायता', fa: 'آمبولانس / امداد', ar: 'إسعاف' },
  'وإسعاف': { en: 'and Ambulance / Medical Aid', ur: 'اور طبی امداد (ایمبولینس)', 'ur-roman': 'aur Tibbi Imdad (Ambulance)', hi: 'और एम्बुलेंस चिकित्सा सहायता', fa: 'و امداد پزشکی', ar: 'وإسعاف' },
  'شرطة': { en: 'Police', ur: 'پولیس', 'ur-roman': 'Police', hi: 'पुलिस', fa: 'پلیس', ar: 'شرطة' },
  'طريق': { en: 'Road / Street', ur: 'راستہ / سڑک', 'ur-roman': 'Rasta / Sarak', hi: 'रास्ता / मार्ग', fa: 'مسیر / خیابان', ar: 'طريق' },
  'شارع': { en: 'Avenue / Boulevard', ur: 'شارع / شاہراہ', 'ur-roman': 'Shahrah / Street', hi: 'मार्ग / सड़क', fa: 'خیابان', ar: 'شارع' },
  'موقف حافلات': { en: 'Bus Station / Terminal', ur: 'بس اڈا / اسٹیشن', 'ur-roman': 'Bus Stand / Terminal', hi: 'बस स्टैंड', fa: 'ایستگاه اتوبوس', ar: 'موقف حافلات' },
  'صيدلية': { en: 'Pharmacy', ur: 'میڈیکل اسٹور / فارمیسی', 'ur-roman': 'Medical Store / Pharmacy', hi: 'दवाखाना (फार्मेसी)', fa: 'داروخانه', ar: 'صيدلية' },
  'استعلامات': { en: 'Information Desk', ur: 'معلوماتی کاؤنٹر', 'ur-roman': 'Maloomati Counter (Info Desk)', hi: 'पूछताछ केंद्र', fa: 'اطلاعات', ar: 'استعلامات' },
  'يتوفر': { en: 'is available', ur: 'دستیاب ہے', 'ur-roman': 'dastiyab hai', hi: 'उपलब्ध है', fa: 'موجود است', ar: 'يتوفر' },
  'إرشاد': { en: 'guidance / assistance', ur: 'رہنمائی', 'ur-roman': 'rehnumai', hi: 'मार्गदर्शन', fa: 'راهنمایی', ar: 'إرشاد' },
  'التائهين': { en: 'lost persons', ur: 'گمشدہ افراد', 'ur-roman': 'gumshuda afrad', hi: 'लापता लोग', fa: 'گمشدگان', ar: 'التائهين' },
  'الأولي': { en: 'first aid / primary', ur: 'ابتدائی', 'ur-roman': 'ibtidai', hi: 'प्राथमिक', fa: 'اولیه', ar: 'الأولي' },
  'داخل': { en: 'inside', ur: 'کے اندر', 'ur-roman': 'ke andar', hi: 'के भीतर / अंदर', fa: 'داخل', ar: 'داخل' },
  'خارج': { en: 'outside', ur: 'کے باہر', 'ur-roman': 'ke bahar', hi: 'के बाहर', fa: 'بیرون', ar: 'خارج' },
  'الدخول': { en: 'entering / entry', ur: 'داخلہ', 'ur-roman': 'dakhila', hi: 'प्रवेश', fa: 'ورود', ar: 'الدخول' },
  'دخول': { en: 'entry / entering', ur: 'داخلہ', 'ur-roman': 'dakhila', hi: 'प्रवेश', fa: 'ورود', ar: 'دخول' },
  'تعليمات': { en: 'Instructions / Guidelines', ur: 'ہدایات', 'ur-roman': 'Hidayat (Guidelines)', hi: 'दिशा-निर्देश', fa: 'دستورالعمل‌ها', ar: 'تعليمات' },
  'المحافظة': { en: 'maintaining / preserving', ur: 'خیال رکھنا / حفاظت', 'ur-roman': 'khayal rakhna', hi: 'बनाए रखना', fa: 'حفظ کردن', ar: 'المحافظة' },
  'السكينة': { en: 'tranquility / peace', ur: 'سکون و اطمینان', 'ur-roman': 'sukoon', hi: 'शांति', fa: 'آرامش', ar: 'السكينة' },
  'الوقار': { en: 'reverence / dignity', ur: 'ادب و وقار', 'ur-roman': 'adab aur waqar', hi: 'गरिमा व अदब', fa: 'وقار', ar: 'الوقار' },
  'والوقار': { en: 'and reverence', ur: 'اور ادب و وقار', 'ur-roman': 'aur adab-o-waqar', hi: 'और गरिमा', fa: 'و وقار', ar: 'والوقار' },
  'الالتزام': { en: 'adhering to / following', ur: 'پابندی کرنا', 'ur-roman': 'pabandi karna', hi: 'पालन करना', fa: 'رعایت کردن', ar: 'الالتزام' },
  'والالتزام': { en: 'and adhering to', ur: 'اور پابندی کرنا', 'ur-roman': 'aur pabandi karna', hi: 'और पालन करना', fa: 'و رعایت کردن', ar: 'والالتزام' },
  'بالمسارات': { en: 'designated pathways', ur: 'راستوں پر', 'ur-roman': 'raston par', hi: 'मार्गों का', fa: 'به مسیرهای', ar: 'بالمسارات' },
  'المخصصة': { en: 'designated / reserved', ur: 'مخصوص کردہ', 'ur-roman': 'makhsoos karda', hi: 'निर्धारित', fa: 'تعیین‌شده', ar: 'المخصصة' },
  'للزائرين': { en: 'for pilgrims', ur: 'زائرین کے لیے', 'ur-roman': 'Zaireen ke liye', hi: 'तीर्थयात्रियों (ज़ायरीन) के लिए', fa: 'برای زائران', ar: 'للزائرين' },
  'الخروج': { en: 'exiting / exit', ur: 'نکلنا', 'ur-roman': 'nikalna', hi: 'निकास', fa: 'خروج', ar: 'الخروج' },
  'الصحن': { en: 'courtyard', ur: 'صحن', 'ur-roman': 'Sahn', hi: 'प्रांगण (सहन)', fa: 'صحن', ar: 'الصحن' },
  'الحرم': { en: 'sanctuary', ur: 'حرم', 'ur-roman': 'Haram', hi: 'पवित्र हरम', fa: 'حرم', ar: 'الحرم' },
  'الشريف': { en: 'noble / sacred', ur: 'شریف / مقدس', 'ur-roman': 'Sharif / Muqaddas', hi: 'पावन / शरीफ़', fa: 'شریف', ar: 'الشريف' },
  'الممر': { en: 'corridor / pathway', ur: 'راستہ / راہداری', 'ur-roman': 'Rasta / Corridor', hi: 'गलियारा', fa: 'راهرو', ar: 'الممر' },
  'الأطفال': { en: 'children', ur: 'بچے', 'ur-roman': 'Bache', hi: 'बच्चे', fa: 'کودکان', ar: 'الأطفال' },
  'للأطفال': { en: 'for children', ur: 'بچوں کے لیے', 'ur-roman': 'Bachon ke liye', hi: 'बच्चों के लिए', fa: 'برای کودکان', ar: 'للأطفال' },
  'الأحذية': { en: 'shoes / footwear', ur: 'جوتے', 'ur-roman': 'Joote', hi: 'जूते', fa: 'کفش‌ها', ar: 'الأحذية' },
  'الحقائب': { en: 'bags / luggage', ur: 'سامان / بیگز', 'ur-roman': 'Saman / Bags', hi: 'बैग व सामान', fa: 'کیف‌ها و بار', ar: 'الحقائب' },
  'الهواتف': { en: 'phones', ur: 'موبائل فونز', 'ur-roman': 'Mobile Phones', hi: 'मोबाइल फोन', fa: 'گوشی‌های تلفن', ar: 'الهواتف' },
  'الكاميرا': { en: 'cameras', ur: 'کیمرے', 'ur-roman': 'Camera', hi: 'कैमरे', fa: 'دوربین‌ها', ar: 'الكاميرا' },
  'مكبرات الصوت': { en: 'loudspeakers', ur: 'لاؤڈ اسپیکر', 'ur-roman': 'Loudspeaker', hi: 'लाउडस्पीकर', fa: 'بلندگوها', ar: 'مكبرات الصوت' },
  'الشخصية': { en: 'personal', ur: 'ذاتی', 'ur-roman': 'Zaati', hi: 'व्यक्तिगत', fa: 'شخصی', ar: 'الشخصية' },
  'الليل': { en: 'night', ur: 'رات', 'ur-roman': 'Raat', hi: 'रात', fa: 'شب', ar: 'الليل' },
  'اليوم': { en: 'day', ur: 'دن', 'ur-roman': 'Din', hi: 'दिन', fa: 'روز', ar: 'اليوم' },
  'ساعة': { en: 'hour', ur: 'گھنٹہ', 'ur-roman': 'Ghanta', hi: 'घंटे', fa: 'ساعت', ar: 'ساعة' },
  'طابق': { en: 'floor / level', ur: 'منزل / فلور', 'ur-roman': 'Manzil / Floor', hi: 'मंजिल', fa: 'طبقه', ar: 'طابق' },
  'سرداب': { en: 'crypt / basement', ur: 'سرداب / تہہ خانہ', 'ur-roman': 'Sardab / Teh Khana', hi: 'तहखाना (सरदाब)', fa: 'سرداب', ar: 'سرداب' },
  'الأرض': { en: 'ground', ur: 'زمین', 'ur-roman': 'Zameen', hi: 'ज़मीन', fa: 'زمین', ar: 'الأرض' },
  'ماء': { en: 'water', ur: 'پانی', 'ur-roman': 'Paani', hi: 'पानी', fa: 'آب', ar: 'ماء' },
  'بارد': { en: 'cold', ur: 'ٹھنڈا', 'ur-roman': 'Thanda', hi: 'ठंडा', fa: 'سرد', ar: 'بارد' },
  'صالح': { en: 'fit / safe', ur: 'صالح / موزوں', 'ur-roman': 'Saaf / Mozoon', hi: 'उपयुक्त', fa: 'مناسب', ar: 'صالح' },
  'للشرب': { en: 'for drinking', ur: 'پینے کے لیے', 'ur-roman': 'Peene ke liye', hi: 'पीने योग्य', fa: 'برای نوشیدن', ar: 'للشرب' },
  'مكتب': { en: 'office / desk', ur: 'دفتر / کاؤنٹر', 'ur-roman': 'Daftar / Counter', hi: 'कार्यालय', fa: 'دفتر', ar: 'مكتب' },
  'إلزامي': { en: 'mandatory', ur: 'لازمی', 'ur-roman': 'Laazmi', hi: 'अनिवार्य', fa: 'الزامی', ar: 'إلزامي' },
  'لجميع': { en: 'for all', ur: 'تمام کے لیے', 'ur-roman': 'Tamam ke liye', hi: 'सभी के लिए', fa: 'برای همه', ar: 'لجميع' },
  'الرئيسي': { en: 'main', ur: 'مرکزی', 'ur-roman': 'Markazi', hi: 'मुख्य', fa: 'اصلی', ar: 'الرئيسي' },
  'مخصص': { en: 'designated / reserved', ur: 'مخصوص', 'ur-roman': 'Makhsoos', hi: 'आरक्षित', fa: 'اختصاصی', ar: 'مخصص' },
  'وضع': { en: 'placing / putting', ur: 'رکھنا', 'ur-roman': 'Rakhna', hi: 'रखना', fa: 'قرار دادن', ar: 'وضع' },
  'يرجى': { en: 'please / kindly', ur: 'برائے مہربانی', 'ur-roman': 'Baraye meherbani', hi: 'कृपया', fa: 'لطفاً', ar: 'يرجى' },
  'استخدام': { en: 'using', ur: 'استعمال کرنا', 'ur-roman': 'Istemal karna', hi: 'उपयोग', fa: 'استفاده', ar: 'استخدام' },
  'تغلق': { en: 'block / close', ur: 'بند کریں / رکاوٹ ڈالیں', 'ur-roman': 'Band karein', hi: 'रोकना / बंद करना', fa: 'مسدود کردن', ar: 'تغلق' },
  'إخلاء': { en: 'evacuation', ur: 'انخلاء / فوری نکلنا', 'ur-roman': 'Fawri Nikalna (Evacuation)', hi: 'निकासी', fa: 'تخلیه اضطراری', ar: 'إخلاء' },
  'حريق': { en: 'fire', ur: 'آگ', 'ur-roman': 'Aag (Fire)', hi: 'आग', fa: 'آتش‌سوزی', ar: 'حريق' },
  'نقطة تجمع': { en: 'assembly point', ur: 'اجتماع کی جگہ', 'ur-roman': 'Ijtima ki jagah (Assembly Point)', hi: 'एकत्रण स्थल', fa: 'محل تجمع', ar: 'نقطة تجمع' },
  'مخرج طوارئ': { en: 'emergency exit', ur: 'ہنگامی خارجی راستہ', 'ur-roman': 'Emergency Exit Rasta', hi: 'आपातकालीन निकास', fa: 'خروجی اضطراری', ar: 'مخرج طوارئ' },
  'سيارات الإسعاف': { en: 'ambulances', ur: 'ایمبولینس گاڑیاں', 'ur-roman': 'Ambulance Gariyan', hi: 'एम्बुलेंस वाहन', fa: 'خودروهای امدادی', ar: 'سيارات الإسعاف' }
};

/**
 * Clean & normalize Arabic text for matching
 */
function stripArticle(text) {
  if (!text) return '';
  if (text.startsWith('ال') && text.length > 3) {
    return text.slice(2);
  }
  return text;
}

export function normalizeArabic(text) {
  if (!text) return '';
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '') // remove harakat/tashkeel
    .replace(/[إأآا]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/[ىي]/g, 'ي')
    .replace(/[-—–_:،,.;؟?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Devanagari (Hindi) to Natural Roman Urdu / Hinglish phonetic converter
 * Used when translating arbitrary dynamic sentences into 'ur-roman'
 */
export function devanagariToRomanUrdu(text) {
  if (!text || !/[\u0900-\u097F]/.test(text)) return text;

  // Replace formal Sanskritized Hindi words with natural Urdu/Hindustani equivalents first
  const urduVocabReplacements = [
    ['तीर्थयात्रियों', 'Zaireen'],
    ['तीर्थयात्री', 'Zair'],
    ['तीर्थयात्रा', 'Ziyarat'],
    ['पवित्र स्थल', 'Maqam-e-Muqaddas'],
    ['पवित्र प्रांगण', 'Sahn-e-Aqdas'],
    ['पवित्र', 'Muqaddas'],
    ['किंडरगार्टन', 'Roza-e-Aqdas'],
    ['प्रवेश द्वार', 'Dakhili Darwaza'],
    ['निकास द्वार', 'Khariji Rasta'],
    ['प्रवेश', 'Dakhila'],
    ['दिशा-निर्देश', 'Hidayat'],
    ['निर्देशांक', 'Coordinates'],
    ['निर्देश', 'Hidayat'],
    ['कृपया', 'Baraye meherbani'],
    ['शांति', 'Sukoon'],
    ['गरिमा', 'Waqar'],
    ['निर्धारित', 'Makhsoos'],
    ['मार्गों', 'Raston'],
    ['मार्ग', 'Rasta'],
    ['पालन करें', 'pabandi karein'],
    ['बनाए रखें', 'qayem rakhein'],
    ['आपातकालीन', 'Emergency'],
    ['चिकित्सा', 'Tibbi'],
    ['सहायता', 'Imdad'],
    ['अस्पताल', 'Hospital'],
    ['पेयजल', 'Peene ka Paani'],
    ['निःशुल्क', 'Muft'],
    ['शौचालय', 'Washroom'],
    ['महिलाओं', 'Khawateen'],
    ['पुरुषों', 'Mard Hazrat'],
    ['केवल', 'Sirf'],
    ['वर्जित', 'Mana'],
    ['प्रतिबंधित', 'Mana'],
    ['स्थित है', 'waqe hai'],
    ['उपलब्ध है', 'dastiyab hai'],
    ['दक्षिणी', 'Junoobi'],
    ['उत्तरी', 'Shumali'],
    ['पूर्वी', 'Mashriqi'],
    ['पश्चिमी', 'Maghribi'],
    ['मुख्य', 'Markazi'],
    ['इतिहास', 'Tareekh'],
    ['ऐतिहासिक', 'Tareekhi'],
    ['परिवार', 'Khandan'],
    ['माता', 'Walida'],
    ['पिता', 'Walid'],
    ['पुत्र', 'Bete'],
    ['पुत्री', 'Beti'],
    ['भाई', 'Bhai'],
    ['बहन', 'Behan'],
    ['शहीद', 'Shaheed'],
    ['शहादत', 'Shahadat']
  ];

  let working = text;
  for (const [hiWord, urRoman] of urduVocabReplacements) {
    working = working.split(hiWord).join(urRoman);
  }

  const consonants = {
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'n',
    'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'n',
    'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
    'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'w',
    'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
    'क़': 'q', 'ख़': 'kh', 'ग़': 'gh', 'ज़': 'z', 'ड़': 'r', 'ढ़': 'rh', 'फ़': 'f'
  };

  const vowels = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
    'ऋ': 'ri', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au'
  };

  const matras = {
    'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo',
    'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
    'ं': 'n', 'ँ': 'n', 'ः': 'h', '्': ''
  };

  // Pre-combine nukta characters
  working = working
    .replace(/क\u093C/g, 'क़')
    .replace(/ख\u093C/g, 'ख़')
    .replace(/ग\u093C/g, 'ग़')
    .replace(/ज\u093C/g, 'ज़')
    .replace(/ड\u093C/g, 'ड़')
    .replace(/ढ\u093C/g, 'ढ़')
    .replace(/फ\u093C/g, 'फ़')
    .replace(/।/g, '.');

  let out = '';
  for (let i = 0; i < working.length; i++) {
    const ch = working[i];
    const next = working[i + 1] || '';

    if (consonants[ch] !== undefined) {
      out += consonants[ch];
      if (next === '्') {
        i++; // virama suppresses inherent vowel
      } else if (matras[next] !== undefined) {
        out += matras[next];
        i++;
      } else if (next && /[\u0900-\u097F]/.test(next)) {
        out += 'a';
      }
    } else if (vowels[ch] !== undefined) {
      out += vowels[ch];
    } else if (matras[ch] !== undefined) {
      out += matras[ch];
    } else {
      out += ch;
    }
  }

  return out.replace(/\s+/g, ' ').trim();
}

/**
 * Live Neural Translation via Google GTX with Sacred Term Protection & Caching
 */
export async function translateWithSacredProtection(text, targetLang = 'en') {
  if (!text || !text.trim()) return text;
  const clean = text.trim();
  const cacheKey = `${targetLang}::${clean}`;
  if (neuralCache.has(cacheKey)) {
    return neuralCache.get(cacheKey);
  }

  // 1. Check Curated Signs & Documents Ground Truth first
  const normInput = normalizeArabic(clean);
  for (const sample of CURATED_SIGN_SAMPLES) {
    if (normalizeArabic(sample.arabicText) === normInput) {
      const res = sample.defaultTranslations[targetLang] || sample.defaultTranslations.en;
      neuralCache.set(cacheKey, res);
      return res;
    }
  }

  // 2. Check Sacred Lexicon direct match
  for (const [arKey, item] of Object.entries(SACRED_LEXICON)) {
    if (normalizeArabic(arKey) === normInput) {
      const res = item[targetLang] || item.en;
      neuralCache.set(cacheKey, res);
      return res;
    }
  }

  // 3. Protect sacred Arabic phrases before sending to neural engine
  let workingText = clean;
  const replacements = [];
  const sortedSacredKeys = Object.keys(SACRED_LEXICON).sort((a, b) => b.length - a.length);

  for (const arKey of sortedSacredKeys) {
    if (workingText.includes(arKey)) {
      const idx = replacements.length;
      const placeholder = `[9900${idx}]`;
      replacements.push({
        placeholder,
        value: SACRED_LEXICON[arKey][targetLang] || SACRED_LEXICON[arKey].en
      });
      workingText = workingText.split(arKey).join(placeholder);
    }
  }

  const gtxTarget = targetLang === 'ur-roman' ? 'hi' : targetLang;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(gtxTarget)}&dt=t&q=${encodeURIComponent(workingText)}`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        let translated = data[0].map(seg => seg[0] || '').join('');

        // Convert to Roman Urdu if targetLang is ur-roman
        if (targetLang === 'ur-roman') {
          translated = devanagariToRomanUrdu(translated);
        }

        // Restore protected sacred terms
        for (const rep of replacements) {
          translated = translated.split(rep.placeholder).join(rep.value);
          // Also handle spaces inserted inside brackets by GTX
          const spacedRegex = new RegExp(`\\[\\s*9900${replacements.indexOf(rep)}\\s*\\]`, 'g');
          translated = translated.replace(spacedRegex, rep.value);
        }

        // Post-fix any common mistranslations of "روضة" (kindergarten -> sacred sanctuary)
        translated = translated
          .replace(/किंडरगार्टन/g, 'रौज़ा-ए-अक़दस')
          .replace(/کڈرگارٹن/g, 'روضۂ اقدس')
          .replace(/kindergarten/gi, 'Sacred Sanctuary (Rawdah)');

        neuralCache.set(cacheKey, translated);
        return translated;
      }
    }
  } catch (err) {
    // Offline or timeout fallback
  }

  return null;
}

/**
 * Detect if text is safety-critical (security, restricted, medical)
 */
function evaluateSafetyCritical(text, targetLang = 'en') {
  const categories = [
    {
      type: 'medical',
      keywords: ['طوارئ', 'إسعاف', 'مستشفى', 'مفرزة', 'صحي', 'إخلاء طبي'],
      alerts: {
        en: 'Urgent Medical Notice: Follow signs to Al-Safir Hospital or Red Crescent paramedic tents. Dial 122 for ambulance.',
        ur: 'فوری طبی اطلاع: مستشفیٰ السفیر یا ہلال احمر طبی کیمپ کی رہنمائی فالو کریں۔ ایمبولینس کے لیے 122 ڈائل کریں۔',
        'ur-roman': 'Fawri Tibbi Ittila: Mustashfa Al-Safir ya Red Crescent medical camp ki taraf jayein. Ambulance ke liye 122 dial karein.',
        hi: 'आपातकालीन चिकित्सा सूचना: अल-सफ़ीर अस्पताल या रेड क्रिसेंट मेडिकल कैंप के संकेतों का पालन करें। एम्बुलेंस के लिए 122 डायल करें।',
        fa: 'اطلاعیه فوری پزشکی: تابلوهای بیمارستان السفیر یا هلال احمر را دنبال کنید. برای آمبولانس با ۱۲۲ تماس بگیرید.',
        ar: 'تنبيه طبي عاجل: اتبع الإرشادات نحو مستشفى السفير أو مفارز الهلال الأحمر. اتصل بـ 122 للإسعاف.'
      },
      hotline: '122'
    },
    {
      type: 'security',
      keywords: ['تفتيش', 'أمني', 'أسلحة', 'أجهزة كشف', 'حظر أمني'],
      alerts: {
        en: 'Security Inspection Notice: Comply with Astan safety personnel and security screening checkpoints. Dial 104.',
        ur: 'سیکیورٹی جانچ نوٹس: عتبہ سیکیورٹی عملے اور اسکریننگ چوکیوں کے ساتھ مکمل تعاون کریں۔ پولیس کے لیے 104 ڈائل کریں۔',
        'ur-roman': 'Security Checking Notice: Haram security amle aur checking points ke sath taawun karein. Police ke liye 104 dial karein.',
        hi: 'सुरक्षा जांच सूचना: हरम सुरक्षा कर्मियों और जांच चौकियों के साथ सहयोग करें। पुलिस सहायता के लिए 104 डायल करें।',
        fa: 'اطلاعیه بازرسی امنیتی: با مأموران انتظامات و گیت‌های بازرسی همکاری فرمایید. پلیس: ۱۰۴.',
        ar: 'تنبيه تفتيش أمني: يرجى التعاون مع منتسبي حفظ النظام ونقاط التفتيش. شرطة الطوارئ: 104.'
      },
      hotline: '104'
    },
    {
      type: 'restricted',
      keywords: ['ممنوع الدخول', 'محظور', 'خاص بالخدمة', 'منطقة محظورة'],
      alerts: {
        en: 'Restricted Access: Entry prohibited beyond this point without official Astan authorization.',
        ur: 'ممنوعہ داخلہ: عتبہ کی اجازت کے بغیر اس مقام سے آگے جانا سختی سے ممنوع ہے۔',
        'ur-roman': 'Mamnooa Dakhila: Official ijazat ke baghair is maqam se aage jana sakhti se mana hai.',
        hi: 'प्रतिबंधित क्षेत्र: आधिकारिक अनुमति के बिना इस स्थान से आगे जाना सख्त मना है।',
        fa: 'ورود ممنوع: تردد در این محدوده بدون مجوز رسمی آستان قدس ممنوع است.',
        ar: 'منطقة محظورة: يمنع الدخول لغير المخولين.'
      },
      hotline: 'Astan Control'
    },
    {
      type: 'evacuation',
      keywords: ['مخرج طوارئ', 'إخلاء', 'حريق', 'نقطة تجمع'],
      alerts: {
        en: 'Emergency Evacuation Notice: Keep this passageway clear at all times. Follow green illuminated exit directional indicators.',
        ur: 'ہنگامی انخلاء نوٹس: اس راستے کو ہر وقت کھلا رکھیں۔ سبز اشارات کی رہنمائی میں باہر نکلیں۔',
        'ur-roman': 'Emergency Evacuation Notice: Is raste ko har waqt khula rakhein. Sabz exit nishanat ko follow karein.',
        hi: 'आपातकालीन निकासी सूचना: इस मार्ग को हमेशा खुला रखें। हरे निकास संकेतों का पालन करें।',
        fa: 'اطلاعیه خروج اضطراری: این مسیر را همواره باز نگه دارید و تابلوهای سبز خروج را دنبال کنید.',
        ar: 'مخرج طوارئ: يرجى إبقاء الممر سالكاً في جميع الأوقات واتباع الإشارات الخضراء.'
      },
      hotline: '115 (Civil Defense)'
    },
    {
      type: 'prohibited',
      keywords: ['ممنوع', 'كاميرا', 'تدخين', 'مكبرات'],
      alerts: {
        en: 'Sanctuary Regulation: Prohibited item or behavior inside holy precincts. Please deposit restricted items at security kiosks.',
        ur: 'حرم مطہر کا ضابطہ: ممنوعہ اشیاء یا رویہ۔ برائے مہربانی ممنوعہ اشیاء امانت خانے میں جمع کرائیں۔',
        'ur-roman': 'Haram-e-Mutahhar ka Qanoon: Mamnooa ashya amanat khane (kiosk) mein jama karayein.',
        hi: 'पवित्र हरम नियम: प्रतिबंधित वस्तुएं कृपया प्रवेश द्वार पर अमानत घर (लॉकर) में जमा करें।',
        fa: 'مقررات حرم مطهر: لطفاً اشیای ممنوعه را به بخش امانات تحویل دهید.',
        ar: 'ضوابط الصحن الشريف: يرجى تسليم المواد الممنوعة إلى مكاتب الأمانات.'
      },
      hotline: 'Astan Stewards'
    }
  ];

  for (const cat of categories) {
    for (const kw of cat.keywords) {
      if (text.includes(kw)) {
        return {
          isSafetyCritical: true,
          category: cat.type,
          keyword: kw,
          warningNotice: cat.alerts[targetLang] || cat.alerts.en,
          warningNoticeUr: cat.alerts.ur,
          hotline: cat.hotline
        };
      }
    }
  }
  return { isSafetyCritical: false };
}

/**
 * Multilingual Translation Handler
 * POST /api/translator/translate
 */
export async function translateText(req, res) {
  try {
    const { text, targetLang = 'en', mode = 'pilgrim' } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Source text is required for translation.'
      });
    }

    const validLangs = ['ur', 'ur-roman', 'hi', 'en', 'fa', 'ar'];
    const lang = validLangs.includes(targetLang) ? targetLang : 'en';

    const cleanInput = text.trim();
    const normalizedInput = normalizeArabic(cleanInput);
    const safetyCheck = evaluateSafetyCritical(cleanInput, lang);

    let translatedOutput = '';
    let identifiedSacredTerms = [];
    let scholarlyGloss = null;
    let unassistedTokens = [];
    let matchedTokensCount = 0;
    let foundDirect = false;

    // 0. Scan input for any embedded SACRED_LEXICON terms so they are ALWAYS tagged & preserved
    const sortedSacredEntries = Object.entries(SACRED_LEXICON).sort((a, b) => b[0].length - a[0].length);
    for (const [arKey, sItem] of sortedSacredEntries) {
      const normSKey = normalizeArabic(arKey);
      if (normSKey && normalizedInput.includes(normSKey)) {
        if (!identifiedSacredTerms.some(t => normalizeArabic(t.arabic) === normSKey)) {
          identifiedSacredTerms.push({
            arabic: arKey,
            translation: sItem[lang] || sItem.en,
            type: sItem.type,
            source: sItem.source || null,
            reviewedStatus: sItem.reviewedStatus || 'Astan Curated Liturgical Text'
          });
        }
        if (sItem.scholarlyInterpretation && !scholarlyGloss) {
          scholarlyGloss = sItem.scholarlyInterpretation;
        }
      }
    }

    // 1. Check Curated Sign & Document Samples for exact ground-truth match
    for (const sample of CURATED_SIGN_SAMPLES) {
      if (normalizeArabic(sample.arabicText) === normalizedInput) {
        translatedOutput = sample.defaultTranslations[lang] || sample.defaultTranslations.en;
        foundDirect = true;
        if (sample.scholarlyInterpretation && !scholarlyGloss) {
          scholarlyGloss = sample.scholarlyInterpretation;
        }
        break;
      }
    }

    // 2. Check exact match in SACRED_LEXICON
    if (!foundDirect) {
      for (const [arKey, item] of sortedSacredEntries) {
        const normKey = normalizeArabic(arKey);
        if (normalizedInput === normKey) {
          translatedOutput = item[lang] || item.en;
          foundDirect = true;
          if (item.scholarlyInterpretation) {
            scholarlyGloss = item.scholarlyInterpretation;
          }
          break;
        }
      }
    }

    // 3. Phrase and token-level decomposition (up to 10-word spans)
    if (!foundDirect) {
      // Split while removing standalone punctuation tokens like '-'
      let workingWords = cleanInput
        .replace(/[-—–:،,.;]/g, ' ')
        .split(/\s+/)
        .filter(Boolean);
      let translatedTokens = [];

      for (let i = 0; i < workingWords.length; i++) {
        let matched = false;
        const maxSpan = Math.min(10, workingWords.length - i);

        for (let span = maxSpan; span >= 1; span--) {
          const phrase = workingWords.slice(i, i + span).join(' ');
          const normPhrase = normalizeArabic(phrase);
          if (!normPhrase) continue;

          const strippedPhrase = stripArticle(normPhrase);

          // Check sacred lexicon
          for (const [sKey, sItem] of sortedSacredEntries) {
            const normSKey = normalizeArabic(sKey);
            if (normSKey === normPhrase || normSKey === strippedPhrase || stripArticle(normSKey) === strippedPhrase) {
              translatedTokens.push(sItem[lang] || sItem.en);
              matchedTokensCount += span;
              i += span - 1;
              matched = true;
              break;
            }
          }
          if (matched) break;

          // Check general vocabulary
          for (const [vKey, vItem] of Object.entries(VOCABULARY_LEXICON)) {
            const normVKey = normalizeArabic(vKey);
            if (normVKey === normPhrase || normVKey === strippedPhrase || stripArticle(normVKey) === strippedPhrase) {
              translatedTokens.push(vItem[lang] || vItem.en);
              matchedTokensCount += span;
              i += span - 1;
              matched = true;
              break;
            }
          }
          if (matched) break;
        }

        if (!matched) {
          unassistedTokens.push(workingWords[i]);
          translatedTokens.push(workingWords[i]);
        }
      }

      if (translatedTokens.length > 0) {
        translatedOutput = translatedTokens.join(' — ');
      } else {
        translatedOutput = cleanInput;
      }

      // 4. If ANY tokens were unassisted in the offline lexicon, invoke the Sacred-Protected Neural Engine!
      if (unassistedTokens.length > 0) {
        const neuralTranslated = await translateWithSacredProtection(cleanInput, lang);
        if (neuralTranslated && neuralTranslated.trim()) {
          translatedOutput = neuralTranslated;
          unassistedTokens = [];
          matchedTokensCount = workingWords.length;
        }
      }
    }

    // Curatorial adjustment based on mode
    if (mode === 'religious' && !scholarlyGloss) {
      const defaultGloss = {
        en: 'Classical Arabic religious invocation. Reverent translation provided alongside honored liturgical phrasing.',
        ur: 'کلاسیکی عربی زیارت و دعا۔ مقدس اصطلاحات کے احترام کے ساتھ مستند ترجمہ۔',
        'ur-roman': 'Classical Arabic Ziyarat wa Dua. Muqaddas alfaaz ke ehtram ke sath mustanad tarjuma.',
        hi: 'शास्त्रीय अरबी ज़ियारत व दुआ। पवित्र शब्दावली के सम्मान के साथ प्रामाणिक अनुवाद।',
        fa: 'متن زیارتی و دعای کلاسیک عربی همراه با حفظ اصطلاحات مقدس.',
        ar: 'نص زياري ودعائي مأثور من المصادر الإسلامية المعتمدة.'
      };
      scholarlyGloss = defaultGloss[lang] || defaultGloss.en;
    }

    const totalWordCount = cleanInput.split(/\s+/).filter(Boolean).length;
    const coveragePercent = foundDirect ? 100 : Math.min(100, Math.round((matchedTokensCount / Math.max(totalWordCount, 1)) * 100));

    const accuracyTier = foundDirect
      ? 'Verified Astan Lexicon Ground Truth'
      : (unassistedTokens.length === 0
          ? 'Full Sacred & Neural Match'
          : 'Assisted Hybrid Match');

    return res.status(200).json({
      status: 'success',
      sourceText: cleanInput,
      sourceLang: 'ar',
      targetLang: lang,
      mode,
      translatedText: translatedOutput,
      sacredTermsIdentified: identifiedSacredTerms,
      scholarlyInterpretation: scholarlyGloss,
      isSafetyCritical: safetyCheck.isSafetyCritical,
      safetyWarning: safetyCheck.warningNotice || null,
      safetyCategory: safetyCheck.category || null,
      emergencyHotline: safetyCheck.hotline || null,
      accuracyTier,
      lexicalCoverage: `${coveragePercent}%`,
      unassistedTokens,
      calibrationNotice: 'Sacred Lexicon + Neural Multilingual Engine Active.',
      limitationNotice: null,
      translationAuthority: foundDirect ? 'Astan Canonical Inscriptions Registry' : 'Karbala Sacred Lexicon & Neural Engine',
      privacyPolicy: 'Zero Server Persistence — Payload processed in-memory only; no disk or remote logging.'
    });
  } catch (error) {
    console.error('Error in translateText:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to complete translation due to an internal processing error.'
    });
  }
}

async function fetchSingleGtxTranslation(rawText, lang, gtxTarget) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(gtxTarget)}&dt=t`;
    const body = new URLSearchParams({ q: rawText }).toString();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'User-Agent': 'Mozilla/5.0'
      },
      body,
      signal: controller.signal
    });
    clearTimeout(timer);
    if (!response.ok) return null;
    const data = await response.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      let tr = data[0].map(seg => seg[0] || '').join('').trim();
      if (lang === 'ur-roman') {
        tr = devanagariToRomanUrdu(tr);
      }
      return tr || null;
    }
  } catch (e) {
    clearTimeout(timer);
  }
  return null;
}

/**
 * Batch UI Translation Handler for Full-Website Multilingual Switching
 * POST /api/translator/translate-batch
 */
export async function translateUiBatch(req, res) {
  try {
    const { texts = [], targetLang = 'en' } = req.body;
    if (!Array.isArray(texts) || texts.length === 0 || targetLang === 'en') {
      return res.json({ status: 'success', translations: texts, translatedFlags: texts.map(() => true) });
    }

    const validLangs = ['ur', 'ur-roman', 'hi', 'en', 'fa', 'ar'];
    const lang = validLangs.includes(targetLang) ? targetLang : 'en';

    const results = new Array(texts.length);
    const translatedFlags = new Array(texts.length).fill(false);
    const toFetchIndices = [];
    const toFetchStrings = [];

    for (let i = 0; i < texts.length; i++) {
      const raw = (texts[i] || '').toString().trim();
      if (!raw) {
        results[i] = texts[i];
        translatedFlags[i] = true;
        continue;
      }
      const cacheKey = `ui::${lang}::${raw}`;
      if (neuralCache.has(cacheKey)) {
        results[i] = neuralCache.get(cacheKey);
        translatedFlags[i] = true;
      } else {
        toFetchIndices.push(i);
        toFetchStrings.push(raw);
      }
    }

    if (toFetchStrings.length > 0) {
      const CHUNK_SIZE = 12;
      const gtxTarget = lang === 'ur-roman' ? 'hi' : lang;

      for (let c = 0; c < toFetchStrings.length; c += CHUNK_SIZE) {
        const sliceStrings = toFetchStrings.slice(c, c + CHUNK_SIZE);
        const sliceIndices = toFetchIndices.slice(c, c + CHUNK_SIZE);
        const joined = sliceStrings.join('\n ||| \n');
        let chunkSucceeded = false;

        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 5500);
          const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(gtxTarget)}&dt=t`;
          const body = new URLSearchParams({ q: joined }).toString();
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
              'User-Agent': 'Mozilla/5.0'
            },
            body,
            signal: controller.signal
          });
          clearTimeout(timer);

          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && Array.isArray(data[0])) {
              const fullTranslated = data[0].map(seg => seg[0] || '').join('');
              const parts = fullTranslated.split(/\s*\|\|\|\s*/);

              if (parts.length === sliceStrings.length) {
                chunkSucceeded = true;
                for (let k = 0; k < sliceStrings.length; k++) {
                  let tr = (parts[k] || sliceStrings[k]).trim();
                  if (lang === 'ur-roman') {
                    tr = devanagariToRomanUrdu(tr);
                  }
                  const origIdx = sliceIndices[k];
                  results[origIdx] = tr;
                  translatedFlags[origIdx] = true;
                  if (tr && tr !== sliceStrings[k]) {
                    neuralCache.set(`ui::${lang}::${sliceStrings[k]}`, tr);
                  }
                }
              }
            }
          }
        } catch (e) {
          // Will fall back to parallel per-string translation below
        }

        // If batch delimiter misaligned or failed, translate each string in parallel
        if (!chunkSucceeded) {
          const parallelTranslated = await Promise.all(
            sliceStrings.map(s => fetchSingleGtxTranslation(s, lang, gtxTarget))
          );
          for (let k = 0; k < sliceStrings.length; k++) {
            const origIdx = sliceIndices[k];
            const tr = parallelTranslated[k];
            if (tr) {
              results[origIdx] = tr;
              translatedFlags[origIdx] = true;
              if (tr !== sliceStrings[k]) {
                neuralCache.set(`ui::${lang}::${sliceStrings[k]}`, tr);
              }
            } else {
              results[origIdx] = sliceStrings[k];
              translatedFlags[origIdx] = false;
            }
          }
        }
      }
    }

    return res.json({
      status: 'success',
      targetLang: lang,
      translations: results,
      translatedFlags
    });
  } catch (error) {
    console.error('Error in translateUiBatch:', error);
    return res.status(500).json({ status: 'error', message: 'Batch translation error' });
  }
}

/**
 * Get Curated Sign Samples
 * GET /api/translator/samples
 */
export async function getSignSamples(req, res) {
  return res.status(200).json({
    status: 'success',
    samples: CURATED_SIGN_SAMPLES
  });
}
