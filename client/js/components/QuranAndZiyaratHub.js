const { useState, useEffect, useRef, useMemo } = window.React;

// ============================================================================
// SACRED RECITATION SANCTUARY: HOLY QURAN, ZIYARAT-E-ASHURA & ZIYARAT-E-WARITH
// Complete Multilingual Reader (Urdu, Hindi, Roman Urdu, English, Persian, Arabic)
// ============================================================================

const LANGUAGE_OPTIONS = [
  { id: 'ur', label: 'اردو (Urdu)', flag: '🇵🇰', dir: 'rtl', fontClass: 'font-urdu-text' },
  { id: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳', dir: 'ltr', fontClass: 'font-hindi-text' },
  { id: 'ur-roman', label: 'Roman Urdu (Hinglish)', flag: '🇵🇰', dir: 'ltr', fontClass: '' },
  { id: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr', fontClass: '' },
  { id: 'fa', label: 'فارسی (Persian)', flag: '🇮🇷', dir: 'rtl', fontClass: 'font-urdu-text' },
  { id: 'ar', label: 'العربية (Arabic Only)', flag: '🇮🇶', dir: 'rtl', fontClass: 'font-arabic-sign' }
];

// ============================================================================
// 1. ZIYARAT-E-ASHURA (COMPLETE AUTHENTIC TEXT - 10 VERSES + 100x TASBIH)
// ============================================================================
const ZIYARAT_ASHURA_VERSES = [
  {
    id: 1,
    sectionTitle: 'Opening Salutation to Aba Abdillah al-Hussain (AS)',
    arabic: 'السَّلَامُ عَلَيْكَ يَا أَبَا عَبْدِ اللَّهِ، السَّلَامُ عَلَيْكَ يَا ابْنَ رَسُولِ اللَّهِ، السَّلَامُ عَلَيْكَ يَا خِيَرَةَ اللَّهِ وَابْنَ خِيَرَتِهِ، السَّلَامُ عَلَيْكَ يَا ابْنَ أَمِيرِ الْمُؤْمِنِينَ وَابْنَ سَيِّدِ الْوَصِيِّينَ.',
    transliteration: 'As-salamu alayka ya Aba Abdillah, as-salamu alayka yabna Rasulillah, as-salamu alayka ya Khiyaratallah wabna Khiyaratih, as-salamu alayka yabna Amiril Mu’mineen wabna Sayyidil Wasiyyeen.',
    hiPronunciation: 'अस्सलामु अलैका या अबा अब्दिल्लाह, अस्सलामु अलैका यब्न रसूलिल्लाह, अस्सलामु अलैका या ख़ियरतल्लाह वब्न ख़ियरतिह, अस्सलामु अलैका यब्न अमीरिल मोमिनीन वब्न सय्यिदिल वसिय्यीन।',
    translations: {
      ur: 'سلام ہو آپ پر اے ابا عبداللہؑ! سلام ہو آپ پر اے رسولِ خدا ﷺ کے فرزند! سلام ہو آپ پر اے اللہ کے برگزیدہ اور اس کے برگزیدہ کے فرزند! سلام ہو آپ پر اے امیر المؤمنینؑ اور سید الوصیین کے فرزند!',
      hi: 'सलाम हो आप पर ऐ अबा अब्दिल्लाह! सलाम हो आप पर ऐ अल्लाह के रसूल (स.अ.) के सुपुत्र! सलाम हो आप पर ऐ अल्लाह के चुने हुए और उसके चुने हुए के सुपुत्र! सलाम हो आप पर ऐ अमीरुल मोमिनीन (अली अ.स.) और वसीयों के सरदार के सुपुत्र!',
      'ur-roman': 'Salam ho Aap par aye Aba Abdillah! Salam ho Aap par aye Rasool-e-Khuda (SAW) ke farzand! Salam ho Aap par aye Allah ke barguzida aur uske barguzida ke farzand! Salam ho Aap par aye Ameer-ul-Momineen (AS) aur Sayyid-ul-Wasiyyeen ke farzand!',
      en: 'Peace be upon you, O Aba Abdillah! Peace be upon you, O son of the Messenger of Allah! Peace be upon you, O chosen one of Allah and son of His chosen one! Peace be upon you, O son of the Commander of the Faithful and son of the Chief of the Successors!',
      fa: 'سلام بر تو ای اباعبدالله! سلام بر تو ای فرزند رسول خدا! سلام بر تو ای برگزیده خدا و فرزند برگزیده او! سلام بر تو ای فرزند امیرالمؤمنین و فرزند سرور جانشینان!'
    }
  },
  {
    id: 2,
    sectionTitle: 'Salutation to the Son of Sayyida Fatima al-Zahra (SA)',
    arabic: 'السَّلَامُ عَلَيْكَ يَا ابْنَ فَاطِمَةَ سَيِّدَةِ نِسَاءِ الْعَالَمِينَ، السَّلَامُ عَلَيْكَ يَا ثَارَ اللَّهِ وَابْنَ ثَارِهِ وَالْوِتْرَ الْمَوْتُورَ، السَّلَامُ عَلَيْكَ وَعَلَى الْأَرْوَاحِ الَّتِي حَلَّتْ بِفِنَائِكَ، عَلَيْكُمْ مِنِّي جَمِيعًا سَلَامُ اللَّهِ أَبَدًا مَا بَقِيتُ وَبَقِيَ اللَّيْلُ وَالنَّهَارُ.',
    transliteration: 'As-salamu alayka yabna Fatimata Sayyidati Nisa’il Aalameen, as-salamu alayka ya Tharallah wabna Tharihi wal-witral mawtoor, as-salamu alayka wa alal arwahil-lati hallat bi-fina’ika, alaykum minni jami’an salamullahi abadan ma baqeetu wa baqiyal-laylu wan-nahar.',
    hiPronunciation: 'अस्सलामु अलैका यब्न फ़ातिमता सय्यिदति निसाइल आलमीन, अस्सलामु अलैका या सारल्लाह वब्न सारिही वल-वित्रल मौजूर, अस्सलामु अलैका व अलल अरवाहिल्लती हल्लत बि-फ़िनाइका, अलैकुम मिन्नी जमीअन सलामुल्लाहि अबदन मा बक़ीतु व बक़ियल-लैलु वन-नहार।',
    translations: {
      ur: 'سلام ہو آپ پر اے فاطمہ زہراؑ کے فرزند جو تمام جہانوں کی عورتوں کی سردار ہیں! سلام ہو آپ پر اے ثار اللہ (جس کے خون کا بدلہ خود اللہ لے گا) اور اس کے فرزند! سلام ہو آپ پر اور ان پاکیزہ روحوں پر جو آپ کے آستانے پر اترِیں۔ آپ سب پر میری طرف سے ہمیشہ اللہ کا سلام ہو جب تک میں زندہ ہوں اور جب تک رات اور دن باقی ہیں۔',
      hi: 'सलाम हो आप पर ऐ फ़ातिमा ज़हरा (स.अ.) के सुपुत्र जो सारे संसार की महिलाओं की सरदार हैं! सलाम हो आप पर ऐ अल्लाह के लहू के वारिस! सलाम हो आप पर और उन पवित्र रूहों पर जो आपके आंगन में शहीद हुईं। आप सभी पर मेरी ओर से सदैव अल्लाह का सलाम हो जब तक मैं जीवित हूँ और जब तक रात और दिन बाकी हैं।',
      'ur-roman': 'Salam ho Aap par aye Fatima Zahra (SA) ke farzand jo tamam jahanon ki aurton ki Sardar hain! Salam ho Aap par aye Tharallah! Salam ho Aap par aur un pakeeza roohon par jo Aap ke aastane par utrein. Aap sab par meri taraf se hamesha Allah ka salam ho jab tak main zinda hoon aur jab tak raat aur din baqi hain.',
      en: 'Peace be upon you, O son of Fatima, the Mistress of the Women of the Worlds! Peace be upon you, O blood-vengeance of Allah, son of His blood-vengeance, and the solitary wronged one! Peace be upon you and upon the souls that gathered in your courtyard. Upon you all from me be the peace of Allah forever, so long as I live and so long as night and day endure.',
      fa: 'سلام بر تو ای فرزند فاطمه سرور زنان جهانیان! سلام بر تو ای خون خدا و فرزند خون خدا! سلام بر تو و بر ارواح پاکی که در آستان تو فرود آمدند؛ از جانب من بر همگی شما سلام خدا باد تا زمانی که زنده‌ام و تا شب و روز برقرار است.'
    }
  },
  {
    id: 3,
    sectionTitle: 'Lamentation of the Heavens & People of Islam',
    arabic: 'يَا أَبَا عَبْدِ اللَّهِ لَقَدْ عَظُمَتِ الرَّزِيَّةُ وَجَلَّتْ وَعَظُمَتِ الْمُصِيبَةُ بِكَ عَلَيْنَا وَعَلَى جَمِيعِ أَهْلِ الْإِسْلَامِ، وَجَلَّتْ وَعَظُمَتْ مُصِيبَتُكَ فِي السَّمَاوَاتِ عَلَى جَمِيعِ أَهْلِ السَّمَاوَاتِ.',
    transliteration: 'Ya Aba Abdillah, laqad azumatir-raziyyatu wa jallat wa azumatil-museebatu bika alayna wa ala jami’i ahlil-Islam, wa jallat wa azumat museebatuka fis-samawati ala jami’i ahlis-samawat.',
    hiPronunciation: 'या अबा अब्दिल्लाह! लक़द अज़ुमतिर-रज़िय्यतु व जल्लत व अज़ुमतिल-मुसीबतु बिका अलैना व अला जमीइ अहलिल-इस्लाम, व जल्लत व अज़ुमत मुसीबतुका फ़िस-समावाति अला जमीइ अहलिस-समावात।',
    translations: {
      ur: 'اے ابا عبداللہؑ! بے شک آپ کا غم بہت عظیم ہے، اور آپ کی مصیبت ہم پر اور تمام اہلِ اسلام پر نہایت بھاری اور عظیم ہے، اور آسمانوں میں بھی تمام اہلِ آسمان (فرشتوں) پر آپ کی مصیبت بے حد عظیم اور گراں ہے۔',
      hi: 'ऐ अबा अब्दिल्लाह! निश्चय ही आपका दुःख अत्यंत महान है, और आपकी मुसीबत हम पर और समस्त अहल-ए-इस्लाम पर बहुत भारी है, तथा आसमानों में भी समस्त आसमान वालों (फ़रिश्तों) पर आपकी मुसीबत अत्यंत महान और असहनीय है।',
      'ur-roman': 'Aye Aba Abdillah! Beshak Aap ka gham bohot azeem hai, aur Aap ki museebat hum par aur tamam Ahl-e-Islam par nihayat bhari aur azeem hai, aur aasmanon mein bhi tamam Ahl-e-Aasman (farishton) par Aap ki museebat be-had azeem hai.',
      en: 'O Aba Abdillah! Truly the tragedy is immense, and your calamity is great and unbearable upon us and upon all the people of Islam; and truly your calamity in the heavens is immense upon all the inhabitants of the heavens.',
      fa: 'ای اباعبدالله! براستی که عزای تو بزرگ و مصیبت تو بر ما و بر جمیع اهل اسلام بسیار عظیم و ناگوار گشت، و در آسمان‌ها نیز بر تمامی اهل آسمان گران و بزرگ شد.'
    }
  },
  {
    id: 4,
    sectionTitle: 'Disassociation from Oppression (Tabarra)',
    arabic: 'فَلَعَنَ اللَّهُ أُمَّةً أَسَّسَتْ أَسَاسَ الظُّلْمِ وَالْجَوْرِ عَلَيْكُمْ أَهْلَ الْبَيْتِ، وَلَعَنَ اللَّهُ أُمَّةً دَفَعَتْكُمْ عَنْ مَقَامِكُمْ وَأَزَالَتْكُمْ عَنْ مَرَاتِبِكُمُ الَّتِي رَتَّبَكُمُ اللَّهُ فِيهَا، وَلَعَنَ اللَّهُ أُمَّةً قَتَلَتْكُمْ وَلَعَنَ اللَّهُ الْمُمَهِّدِينَ لَهُمْ بِالتَّمْكِينِ مِنْ قِتَالِكُمْ، بَرِئْتُ إِلَى اللَّهِ وَإِلَيْكُمْ مِنْهُمْ وَمِنْ أَشْيَاعِهِمْ وَأَتْبَاعِهِمْ وَأَوْلِيَائِهِمْ.',
    transliteration: 'Fa-la’anallahu ummatan assasat asasad-dhulmi wal-jawri alaykum Ahlal-Bayt, wa la’anallahu ummatan dafa’atkum an maqamikum wa azalatkum an maratibikumul-lati rattabakumullahu feeha, wa la’anallahu ummatan qatalatkum... bari’tu ilallahi wa ilaykum minhum.',
    hiPronunciation: 'फ़-लअनल्लाहु उम्मतन अस्ससत असासज़-ज़ुल्मि वल-जौरि अलैकुम अहलल-बैत, व लअनल्लाहु उम्मतन दफ़अतकुम अन मक़ामिकुम... बरीअतु इलल्लाहि व इलैकुम मिन्हुम।',
    translations: {
      ur: 'پس اللہ کی لعنت ہو اس گروہ پر جس نے آپ اہلِ بیتؑ پر ظلم و ستم کی بنیاد رکھی، اور اللہ کی لعنت ہو اس گروہ پر جس نے آپ کو آپ کے مقامِ الٰہی سے ہٹایا، اور اللہ کی لعنت ہو اس گروہ پر جس نے آپ کو شہید کیا اور ان لوگوں پر جنہوں نے آپ سے جنگ کے اسباب فراہم کیے۔ میں اللہ اور آپ کی بارگاہ میں ان ظالموں اور ان کے پیروکاروں سے بیزاری کا اعلان کرتا ہوں۔',
      hi: 'अतः अल्लाह की लानत हो उस गिरोह पर जिसने आप अहलुल बैत (अ.स.) पर ज़ुल्म और अन्याय की नींव रखी, और जिन्होंने आपको आपके दिव्य स्थान से हटाया, और जिन्होंने आपको शहीद किया। मैं अल्लाह और आपकी बारगाह में उन ज़ालिमों और उनके अनुयायियों से पूर्ण विमुखता (बेज़ारी) की घोषणा करता हूँ।',
      'ur-roman': 'Pas Allah ki laanat ho us giroh par jisne Aap Ahlul Bayt (AS) par zulm-o-sitam ki buniyad rakhi, aur Allah ki laanat ho un par jinhone Aap ko Aap ke maqam se hataya aur Aap ko shaheed kiya. Main Allah aur Aap ki bargah mein un zalimon se bezari ka elaan karta hoon.',
      en: 'So may Allah curse a nation that laid the foundation of oppression and tyranny against you, O Ahlul Bayt; and may Allah curse a nation that pushed you away from your station and removed you from the ranks wherein Allah had placed you; and may Allah curse the nation that slew you. I disassociate myself toward Allah and toward you from them, their partisans, and their followers.',
      fa: 'پس لعنت خدا بر امتی که اساس ظلم و ستم را بر شما اهل‌بیت بنا نهادند، و لعنت خدا بر گروهی که شما را از مقام الهی‌تان دور ساختند و شما را به شهادت رساندند. من به سوی خدا و به سوی شما از آنان و پیروانشان بیزاری می‌جویم.'
    }
  },
  {
    id: 5,
    sectionTitle: 'Covenant of Allegiance & Peace (Tawalla)',
    arabic: 'يَا أَبَا عَبْدِ اللَّهِ إِنِّي سِلْمٌ لِمَنْ سَالَمَكُمْ وَحَرْبٌ لِمَنْ حَارَبَكُمْ إِلَى يَوْمِ الْقِيَامَةِ، وَأَسْأَلُ اللَّهَ الَّذِي أَكْرَمَنِي بِمَعْرِفَتِكُمْ وَمَعْرِفَةِ أَوْلِيَائِكُمْ وَرَزَقَنِي الْبَرَاءَةَ مِنْ أَعْدَائِكُمْ أَنْ يَجْعَلَنِي مَعَكُمْ فِي الدُّنْيَا وَالْآخِرَةِ، وَأَنْ يُثَبِّتَ لِي عِنْدَكُمْ قَدَمَ صِدْقٍ فِي الدُّنْيَا وَالْآخِرَةِ.',
    transliteration: 'Ya Aba Abdillah, inni silmun liman salamakum wa harbun liman harabakum ila yawmil-qiyamah... wa as’alullahal-ladhi akramani bi-ma’rifatikum an yaj’alani ma’akum fid-dunya wal-akhirah, wa an yuthabbita li indakum qadama sidqin fid-dunya wal-akhirah.',
    hiPronunciation: 'या अबा अब्दिल्लाह! इन्नी सिल्मुन लिमन सालमकुम व हरबुन लिमन हारबकुम इला यौमिल-क़ियामह... व असअलुल्लाحل-लज़ी अकरमनी बि-मअरिफ़तिकुम अन यजअलनी मअकुम फ़िद-दुन्या वल-आख़िरह।',
    translations: {
      ur: 'اے ابا عبداللہؑ! میں قیامت تک ان لوگوں کے ساتھ صلح و محبت میں ہوں جو آپ سے صلح رکھتے ہیں اور ان سے برسرِ پیکار ہوں جو آپ سے جنگ رکھتے ہیں۔ اور میں اس خدا سے سوال کرتا ہوں جس نے مجھے آپ کی اور آپ کے دوستوں کی معرفت سے سرفراز فرمایا کہ وہ مجھے دنیا اور آخرت میں آپ کے ساتھ قرار دے اور میرے قدموں کو صداقت پر مضبوط رکھے۔',
      hi: 'ऐ अबा अब्दिल्लाह! मैं क़यामत के दिन तक उन लोगों के साथ शांति व प्रेम में हूँ जो आपसे शांति रखते हैं, और उन लोगों के विरुद्ध हूँ जो आपसे शत्रुता रखते हैं। और मैं अल्लाह से प्रार्थना करता हूँ जिसने मुझे आपकी पहचान (मअरिफ़त) से सम्मानित किया कि वह मुझे दुनिया और आख़िरत में आपके साथ रखे।',
      'ur-roman': 'Aye Aba Abdillah! Main Qayamat tak un logon ke sath sulah mein hoon jo Aap se sulah rakhte hain aur unke khilaf hoon jo Aap se jang rakhte hain. Aur main Allah se dua karta hoon jisne mujhe Aap ki marifat ata ki ke woh mujhe dunya aur aakhirat mein Aap ke sath rakhe.',
      en: 'O Aba Abdillah! Truly I am at peace with whoever is at peace with you, and at war with whoever is at war with you until the Day of Resurrection. And I ask Allah, Who honored me with knowing you and knowing your friends, to place me with you in this world and the Hereafter, and to make firm for me a truthful footing with you in this world and the Hereafter.',
      fa: 'ای اباعبدالله! من تا روز قیامت در صلحم با هر که با شما در صلح است و در نبردم با هر که با شما در جنگ است، و از خدایی که مرا به معرفت شما گرامی داشت می‌خواهم که مرا در دنیا و آخرت با شما قرار دهد.'
    }
  },
  {
    id: 6,
    sectionTitle: 'The 100x Renunciation of Tyranny (Use Counter Below)',
    isHundredLaan: true,
    arabic: 'اللَّهُمَّ الْعَنْ أَوَّلَ ظَالِمٍ ظَلَمَ حَقَّ مُحَمَّدٍ وَآلِ مُحَمَّدٍ وَآخِرَ تَابِعٍ لَهُ عَلَى ذَلِكَ، اللَّهُمَّ الْعَنِ الْعِصَابَةَ الَّتِي جَاهَدَتِ الْحُسَيْنَ وَشَايَعَتْ وَبَايَعَتْ وَتَابَعَتْ عَلَى قَتْلِهِ، اللَّهُمَّ الْعَنْهُمْ جَمِيعًا.',
    transliteration: 'Allahummal-’an awwala dhalimin dhalama haqqa Muhammadin wa Aali Muhammad, wa akhira tabi’in lahu ala dhalik. Allahummal-’anil-isabatal-lati jahadatil-Hussayn wa shaya’at wa baya’at wa taba’at ala qatlih, Allahummal-’anhum jami’a.',
    hiPronunciation: 'अल्लाहुम्मल-अन अव्वल ज़ालिमिन ज़लमा हक़्क़ा मुहम्मदिन व आलि मुहम्मद, व आख़िर ताबिइन लहू अला ज़ालिक। अल्लाहुम्मल-अनिल-इसाबतल-लती जाहदतिल-हुसैन व शायअत व बायअत व ताबअत अला क़त्लिह, अल्लाहुम्मल-अनहुम जमीआ।',
    translations: {
      ur: '(100 مرتبہ پڑھیں): اے اللہ! لعنت فرما اس پہلے ظالم پر جس نے محمد و آلِ محمد (ﷺ) کے حق پر ظلم کیا اور اس کے آخری پیروکار پر۔ اے اللہ! لعنت فرما اس لشکر پر جس نے حسینؑ کے خلاف جنگ کی اور ان کے قتل پر متفق ہوا۔ اے اللہ! ان سب پر لعنت فرما۔',
      hi: '(100 बार पढ़ें): ऐ अल्लाह! उस पहले ज़ालिम पर लानत भेज जिसने मुहम्मद और आल-ए-मुहम्मद के हक़ पर ज़ुल्म किया और उसके अंतिम अनुयायी पर। ऐ अल्लाह! उस गिरोह पर लानत भेज जिसने इमाम हुसैन (अ.स.) से युद्ध किया और उनके क़त्ल में साथ दिया। ऐ अल्लाह! उन सभी पर लानत भेज।',
      'ur-roman': '(100 Martaba Parhein): Aye Allah! Laanat farma us pehle zalim par jisne Muhammad wa Aal-e-Muhammad (SAW) ke haq par zulm kiya aur uske aakhri pairukar par. Aye Allah! Laanat farma us lashkar par jisne Imam Hussain (AS) se jang ki aur unke qatl par muttafiq hua. Aye Allah! Un sab par laanat farma.',
      en: '(Recite 100 times): O Allah, curse the first tyrant who unjustly usurped the right of Muhammad and the Family of Muhammad, and the last one who followed him in that. O Allah, curse the gang that waged war against al-Hussain and accompanied, pledged allegiance, and followed in slaying him. O Allah, curse them all.',
      fa: '(۱۰۰ مرتبه): خدایا لعنت کن نخستین ستمگری را که به حق محمد و آل محمد ستم روا داشت و آخرین کسی که در این راه از او پیروی کرد. خدایا لعنت کن گروهی را که با حسین (ع) پیکار کردند و بر قتل او هم‌پیمان شدند؛ خدایا همگی آنان را لعنت کن.'
    }
  },
  {
    id: 7,
    sectionTitle: 'The 100x Salutation upon Hussain & Karbala Martyrs (Use Counter Below)',
    isHundredSalam: true,
    arabic: 'السَّلَامُ عَلَيْكَ يَا أَبَا عَبْدِ اللَّهِ وَعَلَى الْأَرْوَاحِ الَّتِي حَلَّتْ بِفِنَائِكَ، عَلَيْكَ مِنِّي سَلَامُ اللَّهِ أَبَدًا مَا بَقِيتُ وَبَقِيَ اللَّيْلُ وَالنَّهَارُ، وَلَا جَعَلَهُ اللَّهُ آخِرَ الْعَهْدِ مِنِّي لِزِيَارَتِكُمْ. السَّلَامُ عَلَى الْحُسَيْنِ، وَعَلَى عَلِيِّ بْنِ الْحُسَيْنِ، وَعَلَى أَوْلَادِ الْحُسَيْنِ، وَعَلَى أَصْحَابِ الْحُسَيْنِ.',
    transliteration: 'As-salamu alayka ya Aba Abdillah wa alal-arwahil-lati hallat bi-fina’ika, alayka minni salamullahi abadan ma baqeetu wa baqiyal-laylu wan-nahar, wa la ja’alahullahu akhiral-ahdi minni li-ziyaratikum. As-salamu alal-Hussayn, wa ala Aliyyibnil-Hussayn, wa ala Awladil-Hussayn, wa ala As-habil-Hussayn.',
    hiPronunciation: 'अस्सलामु अलैका या अबा अब्दिल्लाह व अलल-अरवाहिल्लती हल्लत बि-फ़िनाइका, अलैका मिन्नी सलामुल्लाहि अबदन मा बक़ीतु व बक़ियल-लैलु वन-नहार, व ला जअलहुल्लाहु आख़िरल-अहदि मिन्नी लि-ज़ियारतिकुम। अस्सलामु अलल-हुसैन, व अला अलिय्यिब्निल-हुसैन, व अला औलादिल-हुसैन, व अला असहाबिल-हुसैन।',
    translations: {
      ur: '(100 مرتبہ پڑھیں): سلام ہو آپ پر اے ابا عبداللہؑ اور ان روحوں پر جو آپ کے روضے پر نازل ہوئیں۔ آپ پر میری طرف سے ہمیشہ اللہ کا سلام ہو جب تک میں زندہ ہوں اور رات دن باقی ہیں، اور اللہ اسے آپ کی زیارت کا میرا آخری موقع قرار نہ دے۔ سلام ہو حسینؑ پر، اور علی ابن الحسینؑ پر، اور اولادِ حسینؑ پر، اور اصحابِ حسینؑ پر۔',
      hi: '(100 बार पढ़ें): सलाम हो आप पर ऐ अबा अब्दिल्लाह और उन पवित्र रूहों पर जो आपके आंगन में उतरीं। आप पर मेरी ओर से सदैव अल्लाह का सलाम हो जब तक मैं जीवित हूँ और रात-दिन बाकी हैं, और अल्लाह इसे आपकी ज़ियारत का मेरा अंतिम अवसर न बनाए। सलाम हो हुसैन पर, और अली इब्नुल हुसैन पर, और औलाद-ए-हुसैन पर, और असहाब-ए-हुसैन पर।',
      'ur-roman': '(100 Martaba Parhein): Salam ho Aap par aye Aba Abdillah aur un roohon par jo Aap ke roze par nazil huein. Aap par meri taraf se hamesha Allah ka salam ho jab tak main zinda hoon aur raat-din baqi hain, aur Allah ise Aap ki Ziyarat ka mera aakhri mauqa qarar na de. Salam ho Hussain par, aur Ali ibnil Hussain par, aur Awlad-e-Hussain par, aur Ashab-e-Hussain par.',
      en: '(Recite 100 times): Peace be upon you, O Aba Abdillah, and upon the souls that gathered in your courtyard. Upon you from me be the peace of Allah forever, so long as I live and so long as night and day endure; and may Allah not make this my last pledge of visiting you. Peace be upon al-Hussain, and upon Ali ibn al-Hussain, and upon the children of al-Hussain, and upon the companions of al-Hussain.',
      fa: '(۱۰۰ مرتبه): سلام بر تو ای اباعبدالله و بر ارواحی که در آستان تو فرود آمدند؛ از جانب من بر تو سلام خدا باد همیشه تا زنده‌ام و تا شب و روز باقی است، و خداوند این زیارت را آخرین عهد من از زیارت شما قرار ندهد. سلام بر حسین، و بر علی بن الحسین، و بر فرزندان حسین، و بر یاران حسین.'
    }
  },
  {
    id: 8,
    sectionTitle: 'Final Prostration (Sajdah) Supplication of Ziyarat-e-Ashura',
    arabic: 'اللَّهُمَّ لَكَ الْحَمْدُ حَمْدَ الشَّاكِرِينَ لَكَ عَلَى مُصَابِهِمْ، الْحَمْدُ لِلَّهِ عَلَى عَظِيمِ رَزِيَّتِي، اللَّهُمَّ ارْزُقْنِي شَفَاعَةَ الْحُسَيْنِ يَوْمَ الْوُرُودِ، وَثَبِّتْ لِي قَدَمَ صِدْقٍ عِنْدَكَ مَعَ الْحُسَيْنِ وَأَصْحَابِ الْحُسَيْنِ الَّذِينَ بَذَلُوا مُهَجَهُمْ دُونَ الْحُسَيْنِ عَلَيْهِ السَّلَامُ.',
    transliteration: 'Allahumma lakal-hamdu hamdash-shakireena laka ala musabihim, al-hamdu lillahi ala adhimi raziyyati. Allahummar-zuqni shafa’atal-Hussayni yawmal-wurood, wa thabbit li qadama sidqin indaka ma’al-Hussayn wa as-habil-Hussaynil-ladhina badhalu muhajahum dunal-Hussayni alayhis-salam.',
    hiPronunciation: 'अल्लाहुम्मा लकल-हम्दु हम्दश-शाकिरीना लका अला मुसाबिहिम, अल-हम्दु लिल्लाहि अला अज़ीमि रज़िय्यती। अल्लाहुम्मर-ज़ुक़्नी शफ़ाअतल-हुसैनि यौमल-वुरूद, व सब्बित ली क़दमा सिद्क़िन इन्दका मअल-हुसैन व असहाबिल-हुसैनिल-लज़ीना बज़लू मुहजहुम दूनल-हुसैनि अलैहिस-सलाम।',
    translations: {
      ur: '(سجدے میں پڑھیں): اے اللہ! تیرے ہی لیے حمد ہے شکر گزاروں کی سی حمد ان کی مصیبت پر۔ تمام تعریفیں اللہ کے لیے ہیں میرے اس عظیم غم پر۔ اے اللہ! مجھے قیامت کے دن امام حسینؑ کی شفاعت نصیب فرما، اور میرے قدموں کو اپنی بارگاہ میں امام حسینؑ اور ان کے ان باوفا اصحاب کے ساتھ سچائی پر ثابت رکھ جنہوں نے امام حسین علیہ السلام پر اپنی جانیں قربان کر دیں۔',
      hi: '(सजदे में पढ़ें): ऐ अल्लाह! तेरे ही लिए प्रशंसा है शुक्र करने वालों की तरह उनकी मुसीबत पर। ऐ अल्लाह! मुझे क़यामत के दिन इमाम हुसैन (अ.स.) की शफ़ाअत (सिफ़ारिश) नसीब फ़रमा, और मेरे क़दमों को अपनी बारगाह में इमाम हुसैन और उनके उन वफ़ादार साथियों के साथ सच्चाई पर स्थिर रख जिन्होंने इमाम हुसैन (अ.स.) की रक्षा में अपने प्राण न्योछावर कर दिए।',
      'ur-roman': '(Sajde mein parhein): Aye Allah! Tere hi liye hamd hai shukr-guzaron ki si hamd unki museebat par. Aye Allah! Mujhe Qayamat ke din Imam Hussain (AS) ki shafa’at naseeb farma, aur mere qadmon ko Apni bargah mein Imam Hussain (AS) aur unke un bawafa Ashab ke sath sachai par sabit rakh jinhone Imam Hussain (AS) par apni jaanein qurban kar dein.',
      en: '(In Prostration / Sajdah): O Allah, to You belongs the praise—the praise of those who thank You in their afflictions. Praise be to Allah for my immense grief. O Allah, grant me the intercession of al-Hussain on the Day of Arrival, and make firm for me a truthful footing with You alongside al-Hussain and the companions of al-Hussain, who sacrificed their lifeblood in defense of al-Hussain (peace be upon him).',
      fa: '(در سجده): خدایا تو را سپاس، سپاس شکرگزاران بر مصیبت ایشان؛ حمد خدای را بر شدت اندوه من. خدایا در روز ورود به قیامت شفاعت حسین (ع) را نصیبم فرما و قدم صدق مرا نزد خودت با حسین و یاران حسین که جان‌های خویش را در راه حسین (ع) فدا کردند ثابت بدار.'
    }
  }
];

// ============================================================================
// 2. ZIYARAT-E-WARITH (COMPLETE AUTHENTIC TEXT - 8 VERSES)
// ============================================================================
const ZIYARAT_WARITH_VERSES = [
  {
    id: 1,
    sectionTitle: 'Prophetic Inheritance: Adam, Noah, Abraham, Moses, Jesus & Muhammad (SAW)',
    arabic: 'السَّلَامُ عَلَيْكَ يَا وَارِثَ آدَمَ صَفْوَةِ اللَّهِ، السَّلَامُ عَلَيْكَ يَا وَارِثَ نُوحٍ نَبِيِّ اللَّهِ، السَّلَامُ عَلَيْكَ يَا وَارِثَ إِبْرَاهِيمَ خَلِيلِ اللَّهِ، السَّلَامُ عَلَيْكَ يَا وَارِثَ مُوسَى كَلِيمِ اللَّهِ، السَّلَامُ عَلَيْكَ يَا وَارِثَ عِيسَى رُوحِ اللَّهِ، السَّلَامُ عَلَيْكَ يَا وَارِثَ مُحَمَّدٍ حَبِيبِ اللَّهِ.',
    transliteration: 'As-salamu alayka ya Waritha Adama Safwatillah, as-salamu alayka ya Waritha Nuhin Nabiyyillah, as-salamu alayka ya Waritha Ibrahima Khalilillah, as-salamu alayka ya Waritha Musa Kalimillah, as-salamu alayka ya Waritha Isa Ruhillah, as-salamu alayka ya Waritha Muhammadin Habibillah.',
    hiPronunciation: 'अस्सलामु अलैका या वारिसा आदम सफ़्वतिल्लाह, अस्सलामु अलैका या वारिसा नूहिन नबिय्यिल्लाह, अस्सलामु अलैका या वारिसा इब्राहीमा ख़लीलिल्लाह, अस्सलामु अलैका या वारिसा मूसा कलीमिल्लाह, अस्सलामु अलैका या वारिसा ईसा रूहिल्लाह, अस्सलामु अलैका या वारिसा मुहम्मदिन हबीबिल्लाह।',
    translations: {
      ur: 'سلام ہو آپ پر اے اللہ کے برگزیدہ آدمؑ کے وارث! سلام ہو آپ پر اے اللہ کے نبی نوحؑ کے وارث! سلام ہو آپ پر اے اللہ کے خلیل ابراہیمؑ کے وارث! سلام ہو آپ پر اے اللہ کے کلیم موسیٰؑ کے وارث! سلام ہو آپ پر اے اللہ کی روح عیسیٰؑ کے وارث! سلام ہو آپ پر اے اللہ کے حبیب محمد مصطفیٰ ﷺ کے وارث!',
      hi: 'सलाम हो आप पर ऐ अल्लाह के चुने हुए आदम (अ.स.) के वारिस! सलाम हो आप पर ऐ अल्लाह के नबी नूह (अ.स.) के वारिस! सलाम हो आप पर ऐ अल्लाह के मित्र इब्राहीम (अ.स.) के वारिस! सलाम हो आप पर ऐ अल्लाह से कलाम करने वाले मूसा (अ.स.) के वारिस! सलाम हो आप पर ऐ अल्लाह की रूह ईसा (अ.स.) के वारिस! सलाम हो आप पर ऐ अल्लाह के प्यारे हबीब मुहम्मद (स.अ.) के वारिस!',
      'ur-roman': 'Salam ho Aap par aye Allah ke barguzida Aadam (AS) ke Waris! Salam ho Aap par aye Allah ke Nabi Nooh (AS) ke Waris! Salam ho Aap par aye Allah ke Khalil Ibrahim (AS) ke Waris! Salam ho Aap par aye Allah ke Kaleem Musa (AS) ke Waris! Salam ho Aap par aye Allah ki Rooh Isa (AS) ke Waris! Salam ho Aap par aye Allah ke Habeeb Muhammad Mustafa (SAW) ke Waris!',
      en: 'Peace be upon you, O inheritor of Adam, the chosen one of Allah! Peace be upon you, O inheritor of Noah, the prophet of Allah! Peace be upon you, O inheritor of Abraham, the intimate friend of Allah! Peace be upon you, O inheritor of Moses, who conversed with Allah! Peace be upon you, O inheritor of Jesus, the spirit of Allah! Peace be upon you, O inheritor of Muhammad, the beloved of Allah!',
      fa: 'سلام بر تو ای وارث آدم برگزیده خدا! سلام بر تو ای وارث نوح پیامبر خدا! سلام بر تو ای وارث ابراهیم خلیل خدا! سلام بر تو ای وارث موسی کلیم خدا! سلام بر تو ای وارث عیسی روح خدا! سلام بر تو ای وارث محمد حبیب خدا!'
    }
  },
  {
    id: 2,
    sectionTitle: 'Lineage of Ali al-Murtada, Fatima al-Zahra & Khadija al-Kubra',
    arabic: 'السَّلَامُ عَلَيْكَ يَا وَارِثَ أَمِيرِ الْمُؤْمِنِينَ وَلِيِّ اللَّهِ، السَّلَامُ عَلَيْكَ يَا ابْنَ مُحَمَّدٍ الْمُصْطَفَى، السَّلَامُ عَلَيْكَ يَا ابْنَ عَلِيٍّ الْمُرْتَضَى، السَّلَامُ عَلَيْكَ يَا ابْنَ فَاطِمَةَ الزَّهْرَاءِ، السَّلَامُ عَلَيْكَ يَا ابْنَ خَدِيجَةَ الْكُبْرَى، السَّلَامُ عَلَيْكَ يَا ثَارَ اللَّهِ وَابْنَ ثَارِهِ وَالْوِتْرَ الْمَوْتُورَ.',
    transliteration: 'As-salamu alayka ya Waritha Amiril-Mu’mineena Waliyyillah, as-salamu alayka yabna Muhammadinil-Mustafa, as-salamu alayka yabna Aliyyinil-Murtada, as-salamu alayka yabna Fatimataz-Zahra, as-salamu alayka yabna Khadijatal-Kubra, as-salamu alayka ya Tharallah wabna Tharihi wal-witral-mawtoor.',
    hiPronunciation: 'अस्सलामु अलैका या वारिसा अमीरिल-मोमिनीना वलिय्यिल्लाह, अस्सलामु अलैका यब्न मुहम्मदिनिल-मुस्तफ़ा, अस्सलामु अलैका यब्न अलिय्यिनिल-मुर्तज़ा, अस्सलामु अलैका यब्न फ़ातिमतज़-ज़हरा, अस्सलामु अलैका यब्न ख़दीजतल-कुबरा, अस्सलामु अलैका या सारल्लाह वब्न सारिही वल-वित्रल-मौतूर।',
    translations: {
      ur: 'سلام ہو آپ پر اے اللہ کے ولی امیر المؤمنین علیؑ کے وارث! سلام ہو آپ پر اے محمد مصطفیٰ ﷺ کے فرزند! سلام ہو آپ پر اے علی مرتضیٰؑ کے فرزند! سلام ہو آپ پر اے فاطمہ زہراؑ کے فرزند! سلام ہو آپ پر اے خدیجۃ الکبریٰؑ کے فرزند! سلام ہو آپ پر اے ثار اللہ اور اس کے فرزند!',
      hi: 'सलाम हो आप पर ऐ अमीरुल मोमिनीन अली (अ.स.) के वारिस! सलाम हो आप पर ऐ मुहम्मद मुस्तफ़ा के सुपुत्र! सलाम हो आप पर ऐ अली मुर्तज़ा के सुपुत्र! सलाम हो आप पर ऐ फ़ातिमा ज़हरा के सुपुत्र! सलाम हो आप पर ऐ ख़दीजतुल कुबरा के सुपुत्र!',
      'ur-roman': 'Salam ho Aap par aye Ameer-ul-Momineen Ali (AS) ke Waris! Salam ho Aap par aye Muhammad Mustafa (SAW) ke farzand! Salam ho Aap par aye Ali Murtaza (AS) ke farzand! Salam ho Aap par aye Fatima Zahra (SA) ke farzand! Salam ho Aap par aye Khadijat-ul-Kubra (SA) ke farzand!',
      en: 'Peace be upon you, O inheritor of the Commander of the Faithful, the vicegerent of Allah! Peace be upon you, O son of Muhammad the Chosen! Peace be upon you, O son of Ali the Pleasing! Peace be upon you, O son of Fatima the Radiant! Peace be upon you, O son of Khadija the Great! Peace be upon you, O blood-vengeance of Allah and son of His blood-vengeance!',
      fa: 'سلام بر تو ای وارث امیرالمؤمنین ولی خدا! سلام بر تو ای فرزند محمد مصطفی! سلام بر تو ای فرزند علی مرتضی! سلام بر تو ای فرزند فاطمه زهرا! سلام بر تو ای فرزند خدیجه کبری!'
    }
  },
  {
    id: 3,
    sectionTitle: 'Testimony of Prayer, Zakat, Reform & Sacred Striving',
    arabic: 'أَشْهَدُ أَنَّكَ قَدْ أَقَمْتَ الصَّلَاةَ، وَآتَيْتَ الزَّكَاةَ، وَأَمَرْتَ بِالْمَعْرُوفِ، وَنَهَيْتَ عَنِ الْمُنْكَرِ، وَأَطَعْتَ اللَّهَ وَرَسُولَهُ حَتَّى أَتَاكَ الْيَقِينُ. فَلَعَنَ اللَّهُ أُمَّةً قَتَلَتْكَ، وَلَعَنَ اللَّهُ أُمَّةً ظَلَمَتْكَ، وَلَعَنَ اللَّهُ أُمَّةً سَمِعَتْ بِذَلِكَ فَرَضِيَتْ بِهِ.',
    transliteration: 'Ash-hadu annaka qad aqamtas-salata wa ataytaz-zakata wa amarta bil-ma’rufi wa nahayta anil-munkari wa ata’tallaha wa rasulahu hatta atakal-yaqeen. Fa-la’anallahu ummatan qatalatka, wa la’anallahu ummatan dhalamatk, wa la’anallahu ummatan sami’at bi-dhalika fa-radiyat bih.',
    hiPronunciation: 'अश-हदु अन्नका क़द अक़म्तस-सलाता व आतैतज़-ज़काता व अमर्ता बिल-मअरूफ़ि व नहैता अनिल-मुन्करि व अतअतल्लाहा व रसूलहू हत्ता अताकल-यक़ीन। फ़-लअनल्लाहु उम्मतन क़तलत्क, व लअनल्लाहु उम्मतन ज़लमत्क, व लअनल्लाहु उम्मतन समिअत बि-ज़ालिका फ़-रज़ियत बिह।',
    translations: {
      ur: 'میں گواہی دیتا ہوں کہ بے شک آپ نے نماز قائم کی، اور زکوٰۃ ادا کی، اور نیکی کا حکم دیا، اور برائی سے روکا، اور اللہ اور اس کے رسول ﷺ کی اطاعت کی یہاں تک کہ آپ درجۂ شہادت پر فائز ہوئے۔ پس اللہ کی لعنت ہو اس گروہ پر جس نے آپ کو قتل کیا، اور اس گروہ پر جس نے آپ پر ظلم کیا، اور اس گروہ پر جس نے یہ واقعہ سنا اور اس پر راضی ہوا۔',
      hi: 'मैं गवाही देता हूँ कि निश्चय ही आपने नमाज़ क़ायम की, और ज़कात अदा की, और भलाई का आदेश दिया, और बुराई से रोका, तथा अंतिम सांस (शहादत) तक अल्लाह और उसके रसूल की आज्ञा का पालन किया। अतः अल्लाह की लानत हो उस गिरोह पर जिसने आपको शहीद किया, और जिसने आप पर ज़ुल्म किया, और जिसने यह सुनकर इस पर प्रसन्नता जताई।',
      'ur-roman': 'Main gawahi deta hoon ke beshak Aap ne Namaz qayem ki, aur Zakat ada ki, aur neki ka hukm diya, aur burai se roka, aur shahadat tak Allah aur Uske Rasool (SAW) ki ita’at ki. Pas Allah ki laanat ho un par jinhone Aap ko shaheed kiya aur Aap par zulm kiya.',
      en: 'I bear witness that you established the prayer, gave the charity (zakat), enjoined the good, forbade the evil, and obeyed Allah and His Messenger until certainty (martyrdom) came to you. So may Allah curse the nation that killed you, may Allah curse the nation that wronged you, and may Allah curse the nation that heard of this and was pleased with it.',
      fa: 'گواهی می‌دهم که تو نماز را برپا داشتی و زکات را ادا نمودی و امر به معروف و نهی از منکر کردی و خدا و رسولش را تا لحظه شهادت اطاعت نمودی. پس لعنت خدا بر امتی که تو را کشتند و به تو ستم کردند و به این ظلم راضی شدند.'
    }
  },
  {
    id: 4,
    sectionTitle: 'Pledge of Pure Devotion at the Sacred Threshold',
    arabic: 'يَا مَوْلَايَ يَا أَبَا عَبْدِ اللَّهِ، أَشْهَدُ أَنَّكَ كُنْتَ نُورًا فِي الْأَصْلَابِ الشَّامِخَةِ وَالْأَرْحَامِ الْمُطَهَّرَةِ، لَمْ تُنَجِّسْكَ الْجَاهِلِيَّةُ بِأَنْجَاسِهَا، وَلَمْ تُلْبِسْكَ مِنْ مُدْلَهِمَّاتِ ثِيَابِهَا، وَأَشْهَدُ أَنَّكَ مِنْ دَعَائِمِ الدِّينِ وَأَرْكَانِ الْمُؤْمِنِينَ، وَأَشْهَدُ أَنَّكَ الْإِمَامُ الْبَرُّ التَّقِيُّ الرَّضِيُّ الزَّكِيُّ الْهَادِي الْمَهْدِيُّ.',
    transliteration: 'Ya Mawlaya ya Aba Abdillah, ash-hadu annaka kunta nuran fil-aslabish-shamikhati wal-arhamil-mutahharah, lam tunajjiskal-jahiliyyatu bi-anjasiha... wa ash-hadu annaka min da’a’imid-deen wa arkanil-mu’mineen, wa ash-hadu annakal-Imamul-barrut-taqiyyur-radiyyuz-zakiyyul-hadil-mahdiyy.',
    hiPronunciation: 'या मौलाया या अबा अब्दिल्लाह! अश-हदु अन्नका कुन्ता नूरन फ़िल-अस्लाबिश-शामिख़ति वल-अरहामिल-मुतह्हरह, लम तुनज्जिसकल-जाहिलिय्यतु बि-अंजासिहा... व अश-हदु अन्नकल-इमामुल-बर्रुत-तक़िय्युर-रज़िय्युज़-ज़किय्युल-हादिल-महदी।',
    translations: {
      ur: 'اے میرے مولا اے ابا عبداللہؑ! میں گواہی دیتا ہوں کہ آپ بلند مرتبہ صلبوں اور پاکیزہ رحموں میں ایک الٰہی نور تھے، جاہلیت اپنی نجاستوں سے آپ کو آلودہ نہ کر سکی۔ اور میں گواہی دیتا ہوں کہ آپ دین کے ستون اور مومنین کے سہارے ہیں، اور آپ نیکوکار، پرہیزگار، پسندیدہ، پاکیزہ اور ہدایت دینے والے امام ہیں۔',
      hi: 'ऐ मेरे मौला ऐ अबा अब्दिल्लाह! मैं गवाही देता हूँ कि आप उच्च वंशों और पवित्र गर्भों में एक दिव्य नूर (प्रकाश) थे; अज्ञानता (जाहिलियत) की कोई अशुद्धता आपको छू भी न सकी। और मैं गवाही देता हूँ कि आप धर्म के स्तंभ और मोमिनों के आधार हैं, तथा आप अत्यंत पवित्र, परहेज़गार और मार्गदर्शन करने वाले इमाम हैं।',
      'ur-roman': 'Aye mere Mawla aye Aba Abdillah! Main gawahi deta hoon ke Aap buland martaba sulbon aur pakeeza rehmon mein ek Ilahi Noor the, jahiliyat apni najasaton se Aap ko aalooda na kar saki. Aur main gawahi deta hoon ke Aap Deen ke sutoon aur Momineen ke sahare hain, aur Aap parhezgar, pakeeza aur hidayat dene wale Imam hain.',
      en: 'O my Master, O Aba Abdillah! I bear witness that you were a Divine Light in the lofty loins and purified wombs; pagan ignorance never defiled you with its impurities nor clothed you in its garments of gloom. And I bear witness that you are among the pillars of religion and the supports of the believers, and that you are the righteous, pious, well-pleased, pure, guiding, and rightly-guided Imam.',
      fa: 'ای مولای من ای اباعبدالله! گواهی می‌دهم که تو نوری در صلب‌های شامخ و رحم‌های مطهر بودی که جاهلیت هرگز تو را به ناپاکی‌های خود نیالود؛ و گواهی می‌دهم که تو از ستون‌های دین و پناه مؤمنان و امام نیکوکار و پرهیزگار و هدایت‌گر هستی.'
    }
  },
  {
    id: 5,
    sectionTitle: 'Salutation to Ali ibn al-Hussain (Ali al-Akbar AS) & the Martyrs of Karbala',
    arabic: 'السَّلَامُ عَلَيْكَ يَا عَلِيَّ بْنَ الْحُسَيْنِ، السَّلَامُ عَلَيْكُمْ يَا شُهَدَاءَ اللَّهِ فِي أَرْضِهِ، بِأَبِي أَنْتُمْ وَأُمِّي، طِبْتُمْ وَطَابَتِ الْأَرْضُ الَّتِي فِيهَا دُفِنْتُمْ، وَفُزْتُمْ فَوْزًا عَظِيمًا، فَيَا لَيْتَنِي كُنْتُ مَعَكُمْ فَأَفُوزَ مَعَكُمْ.',
    transliteration: 'As-salamu alayka ya Aliyya bnal-Hussayn, as-salamu alaykum ya Shuhada’allahi fi ardih, bi-abi antum wa ummi, tibtum wa tabatil-ardul-lati feeha dufintum, wa fuztum fawzan adhima, fa-ya laytani kuntu ma’akum fa-afuza ma’akum.',
    hiPronunciation: 'अस्सलामु अलैका या अलिय्य ब्नल-हुसैन, अस्सलामु अलैकुम या शुहदाअल्लाहि फ़ी अर्ज़िह, बि-अबी अन्तुम व उम्मी, तिब्तुम व ताबतिल-अर्ज़ुल-लती फ़ीहा दुफ़िन्तुम, व फ़ुज़्तुम फ़ौज़न अज़ीमा, फ़-या लैतनी कुन्तु मअकुम फ़-अफ़ूज़ा मअकुम।',
    translations: {
      ur: 'سلام ہو آپ پر اے علی ابن الحسین (علی اکبرؑ)! سلام ہو آپ سب پر اے اللہ کی زمین میں اس کے شہیدو! میرے ماں باپ آپ پر قربان ہوں، آپ پاکیزہ تھے اور وہ زمین بھی پاکیزہ ہو گئی جس میں آپ دفن ہوئے، اور آپ نے عظیم کامیابی حاصل کی۔ اے کاش! میں بھی آپ کے ساتھ ہوتا تو آپ کے ہمراہ عظیم کامیابی پاتا۔',
      hi: 'सलाम हो आप पर ऐ अली इब्नुल हुसैन (अली अकबर अ.स.)! सलाम हो आप सभी पर ऐ अल्लाह के शहीदों! मेरे माता-पिता आप पर क़ुर्बान हों; आप पवित्र हैं और वह धरती भी पवित्र हो गई जिसमें आप दफ़न हुए, और आपने महान सफलता प्राप्त की। ऐ काश! मैं भी आपके साथ होता तो आपके साथ महान सफलता पाता।',
      'ur-roman': 'Salam ho Aap par aye Ali ibnil Hussain (Ali Akbar AS)! Salam ho Aap sab par aye Shuhada-e-Karbala! Mere maa-baap Aap par qurban hon, Aap pakeeza the aur woh zameen bhi pakeeza ho gayi jisme Aap dafn hue, aur Aap ne azeem kamyabi hasil ki. Aye kaash! Main bhi Aap ke sath hota to Aap ke sath kamyab hota.',
      en: 'Peace be upon you, O Ali ibn al-Hussain! Peace be upon you all, O Martyrs of Allah upon His earth! May my father and mother be sacrificed for you; pure are you, and pure is the earth wherein you were buried, and you attained a supreme triumph! Would that I had been with you so that I might have triumphed alongside you!',
      fa: 'سلام بر تو ای علی بن الحسین (علی اکبر ع)! سلام بر شما ای شهیدان خدا! پدر و مادرم فدای شما؛ پاک بودید و پاک شد زمینی که در آن آرمیدید و به رستگاری عظیمی دست یافتید؛ ای کاش من نیز با شما بودم و رستگار می‌شدم.'
    }
  },
  {
    id: 6,
    sectionTitle: 'Salutation to Abu al-Fadl al-Abbas ibn Amir al-Mu’mineen (AS)',
    arabic: 'السَّلَامُ عَلَيْكَ يَا أَبَا الْفَضْلِ الْعَبَّاسَ ابْنَ أَمِيرِ الْمُؤْمِنِينَ، السَّلَامُ عَلَيْكَ يَا ابْنَ سَيِّدِ الْوَصِيِّينَ، أَشْهَدُ أَنَّكَ قَدْ نَصَحْتَ لِلَّهِ وَلِرَسُولِهِ وَلِأَخِيكَ، فَنِعْمَ الْأَخُ الْمُوَاسِي لِأَخِيهِ، لَعَنَ اللَّهُ أُمَّةً قَتَلَتْكَ وَلَعَنَ اللَّهُ أُمَّةً ظَلَمَتْكَ وَاسْتَحَلَّتْ مِنْكَ الْمَحَارِمَ.',
    transliteration: 'As-salamu alayka ya Abal-Fadlil-Abbas ibna Amiril-Mu’mineen, as-salamu alayka yabna Sayyidil-Wasiyyeen, ash-hadu annaka qad nasahta lillahi wa li-rasulihi wa li-akhika, fa-ni’mal-akhul-muwasi li-akhih.',
    hiPronunciation: 'अस्सलामु अलैका या अबल-फ़ज़्लिल-अब्बास इब्न अमीरिल-मोमिनीन, अस्सलामु अलैका यब्न सय्यिदिल-वसिय्यीन, अश-हदु अन्नका क़द नसह्ता लिल्लाहि व लि-रसूलिही व लि-अख़ीका, फ़-निअमल-अख़ुल-मुवासी लि-अख़ीह।',
    translations: {
      ur: 'سلام ہو آپ پر اے ابوالفضل العباسؑ فرزندِ امیر المؤمنینؑ! سلام ہو آپ پر اے سید الوصیین کے فرزند! میں گواہی دیتا ہوں کہ آپ نے اللہ، اس کے رسول ﷺ اور اپنے بھائی (حسینؑ) کے ساتھ کامل وفاداری اور خیرخواہی نبھائی۔ پس آپ اپنے بھائی کے کس قدر بہترین اور غمخوار بھائی تھے!',
      hi: 'सलाम हो आप पर ऐ अबुल फ़ज़्ल अल-अब्बास (अ.स.), अमीरुल मोमिनीन के सुपुत्र! मैं गवाही देता हूँ कि आपने अल्लाह, उसके रसूल और अपने भाई (इमाम हुसैन अ.स.) के प्रति पूर्ण निष्ठा और वफ़ादारी निभाई। आप अपने भाई के कितने उत्तम और हमदर्द भाई थे!',
      'ur-roman': 'Salam ho Aap par aye Abul Fazl Al-Abbas (AS) farzand-e-Ameer-ul-Momineen (AS)! Main gawahi deta hoon ke Aap ne Allah, Uske Rasool (SAW) aur apne Bhai (Imam Hussain AS) ke sath kamil wafadari nibhayi. Pas Aap apne bhai ke kis qadar behtareen aur ghamkhwar bhai the!',
      en: 'Peace be upon you, O Abu al-Fadl al-Abbas, son of the Commander of the Faithful! Peace be upon you, O son of the Chief of Successors! I bear witness that you remained utterly loyal and faithful to Allah, His Messenger, and your brother; what an excellent, self-sacrificing brother you were to your brother!',
      fa: 'سلام بر تو ای ابوالفضل العباس فرزند امیرالمؤمنین! گواهی می‌دهم که برای خدا و رسولش و برادرت خیرخواهی و وفاداری را به کمال رساندی؛ پس چه نیکو برادر فداکاری برای برادرت بودی!'
    }
  }
];

// ============================================================================
// 3. HOLY QURAN FEATURED SURAHS (100% OFFLINE + LIVE 114 SURAHS BROWSER)
// ============================================================================
const FEATURED_SURAHS = {
  1: {
    number: 1,
    nameAr: 'سورة الفاتحة',
    nameEn: 'Surah Al-Fatiha (The Opening)',
    revelationType: 'Meccan • 7 Ayahs',
    karbalaContext: 'Recited at the beginning of every Ziyarat prayer and offered as Hadiya (spiritual gift) to the souls of Imam Hussain (AS) and the Martyrs of Karbala.',
    ayahs: [
      {
        num: 1,
        ar: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        tr: 'Bismillahir-Rahmanir-Raheem',
        hiPron: 'बिस्मिल्लाहिर-रहमानिर-रहीम',
        ur: 'شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔',
        hi: 'अल्लाह के नाम से आरंभ, जो अत्यंत कृपालु और दयावान है।',
        'ur-roman': 'Shuru Allah ke naam se jo bada Meherban nihayat Reham wala hai.',
        en: 'In the Name of Allah, the Most Compassionate, the Most Merciful.',
        fa: 'به نام خداوند بخشنده مهربان.'
      },
      {
        num: 2,
        ar: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        tr: 'Al-hamdu lillahi Rabbil-Aalameen',
        hiPron: 'अल-हम्दु लिल्लाहि रब्बिल-आलमीन',
        ur: 'سب تعریفیں اللہ ہی کے لیے ہیں جو تمام جہانوں کا پالنے والا ہے۔',
        hi: 'सारी प्रशंसा अल्लाह ही के लिए है जो समस्त लोकों का पालनहार है।',
        'ur-roman': 'Sab tareefein Allah hi ke liye hain jo tamam jahanon ka Paalne wala hai.',
        en: 'All praise belongs to Allah, Lord of all the worlds.',
        fa: 'ستایش مخصوص خداوندی است که پروردگار جهانیان است.'
      },
      {
        num: 3,
        ar: 'الرَّحْمَٰنِ الرَّحِيمِ',
        tr: 'Ar-Rahmanir-Raheem',
        hiPron: 'अर-रहमानिर-रहीम',
        ur: 'بڑا مہربان نہایت رحم فرمانے والا۔',
        hi: 'अत्यंत कृपालु, परम दयावान।',
        'ur-roman': 'Bada Meherban, nihayat Reham farmane wala.',
        en: 'The Most Compassionate, the Most Merciful.',
        fa: 'بخشنده و مهربان.'
      },
      {
        num: 4,
        ar: 'مَالِكِ يَوْمِ الدِّينِ',
        tr: 'Maliki Yawmid-Deen',
        hiPron: 'मालिकि यौमिद-दीन',
        ur: 'روزِ جزا (قیامت کے دن) کا مالک ہے۔',
        hi: 'प्रतिफल (क़यामत) के दिन का स्वामी है।',
        'ur-roman': 'Roz-e-Jaza (Qayamat ke din) ka Malik hai.',
        en: 'Master of the Day of Judgment.',
        fa: 'مالک روز جزا.'
      },
      {
        num: 5,
        ar: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        tr: 'Iyyaka na’budu wa iyyaka nasta’een',
        hiPron: 'इय्याका नअबुदु व इय्याका नस्तईन',
        ur: 'ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں۔',
        hi: 'हम तेरी ही इबादत (उपासना) करते हैं और तुझ ही से सहायता मांगते हैं।',
        'ur-roman': 'Hum Teri hi ibadat karte hain aur Tujh hi se madad mangte hain.',
        en: 'You alone we worship, and You alone we ask for help.',
        fa: 'تنها تو را می‌پرستیم و تنها از تو یاری می‌جوییم.'
      },
      {
        num: 6,
        ar: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        tr: 'Ihdinas-Siratal-Mustaqeem',
        hiPron: 'इहदिनस-सिरातल-मुस्तक़ीम',
        ur: 'ہمیں سیدھے راستے کی ہدایت عطا فرما۔',
        hi: 'हमें सीधे मार्ग पर चला (मार्गदर्शन दे)।',
        'ur-roman': 'Humein seedhe raste ki hidayat ata farma.',
        en: 'Guide us upon the Straight Path.',
        fa: 'ما را به راه راست هدایت فرما.'
      },
      {
        num: 7,
        ar: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        tr: 'Siratal-ladhina an’amta alayhim ghayril-maghdubi alayhim wa lad-dalleen',
        hiPron: 'सिरातल-लज़ीना अनअम्ता अलैहिम ग़ैरिल-मग़ज़ूबि अलैहिम व लज़्-ज़ाल्लीन',
        ur: 'ان لوگوں کا راستہ جن پر تو نے انعام فرمایا، نہ کہ ان کا جن پر غضب ہوا اور نہ گمراہوں کا۔',
        hi: 'उन लोगों का मार्ग जिन पर तूने कृपा की, न कि उनका जिन पर क्रोध हुआ और न भटके हुओं का।',
        'ur-roman': 'Un logon ka rasta jin par Tu ne inaam farmaya, na ke unka jin par ghazab hua aur na gumrahon ka.',
        en: 'The path of those upon whom You have bestowed favor, not of those who have evoked anger, nor of those who are astray.',
        fa: 'راه کسانی که آنان را مشمول نعمت خود ساختی، نه کسانی که بر آنان غضب کرده‌ای و نه گمراهان.'
      }
    ]
  },
  89: {
    number: 89,
    nameAr: 'سورة الفجر (آيات الحسين ؑ)',
    nameEn: 'Surah Al-Fajr (Surah of Imam Hussain AS)',
    revelationType: 'Meccan • Closing Verses (27–30) & Opening',
    karbalaContext: 'Imam Ja’far al-Sadiq (AS) stated: "Recite Surah Al-Fajr in your obligatory and supererogatory prayers, for it is the Surah of Imam Hussain (AS); whoever recites it will be with him in his rank in Paradise."',
    ayahs: [
      {
        num: 1,
        ar: 'وَالْفَجْرِ ۝ وَلَيَالٍ عَشْرٍ ۝ وَالشَّفْعِ وَالْوَتْرِ ۝ وَاللَّيْلِ إِذَا يَسْرِ',
        tr: 'Wal-Fajr. Wa layalin ashr. Wash-shaf’i wal-watr. Wal-layli idha yasr.',
        hiPron: 'वल-फ़ज्र। व लयालिन अश्र। वश-शफ़इ वल-वत्र। वल-लैलि इज़ा यस्र।',
        ur: 'قسم ہے فجر کی، اور دس (مبارک) راتوں کی، اور جفت اور طاق کی، اور رات کی جب وہ رخصت ہونے لگے۔',
        hi: 'शपथ है प्रभात (फ़ज्र) की, और दस पवित्र रातों की, और सम तथा विषम की, और रात की जब वह चलने लगे।',
        'ur-roman': 'Qasam hai Fajr ki, aur das (mubarak) raaton ki, aur juft aur taaq ki, aur raat ki jab woh rukhsat hone lage.',
        en: 'By the dawn, and by the ten sacred nights, and by the even and the odd, and by the night when it passes!',
        fa: 'سوگند به سپیده‌دم، و به شب‌های ده‌گانه، و به زوج و فرد، و به شب هنگامی که درگذرد.'
      },
      {
        num: 27,
        ar: 'يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ',
        tr: 'Ya ayyatuhan-nafsul-mutma’innah',
        hiPron: 'या अय्यतुहन-नफ़्सुल-मुत्मइन्नह',
        ur: 'اے نفسِ مطمئنہ (اطمینان پانے والی پاکیزہ روح — امام حسینؑ)!',
        hi: 'ऐ संतुष्ट और शांत आत्मा (नफ़्स-ए-मुत्मइन्ना — इमाम हुसैन अ.स.)!',
        'ur-roman': 'Aye Nafs-e-Mutma’innah (Itminan paane wali Pakeeza Rooh — Imam Hussain AS)!',
        en: 'O tranquil, reassured soul (Imam Hussain AS)!',
        fa: 'ای روح آرام‌یافته و مطمئن (امام حسین علیه‌السلام)!'
      },
      {
        num: 28,
        ar: 'ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً',
        tr: 'Irji’i ila Rabbiki radiyatan mardiyyah',
        hiPron: 'इरजिई इला रब्बिकि राज़ियतन मर्ज़िय्यह',
        ur: 'اپنے پروردگار کی طرف لوٹ چل اس حال میں کہ تو اس سے راضی ہے اور وہ تجھ سے راضی ہے۔',
        hi: 'अपने रब की ओर लौट चल इस अवस्था में कि तू उससे प्रसन्न है और वह तुझसे प्रसन्न है।',
        'ur-roman': 'Apne Parwardigar ki taraf laut chal is haal mein ke tu Us se raazi hai aur Woh tujh se raazi hai.',
        en: 'Return to your Lord, well-pleased and pleasing to Him!',
        fa: 'به سوی پروردگارت بازگرد در حالی که هم تو از او خشنودی و هم او از تو خشنود است.'
      },
      {
        num: 29,
        ar: 'فَادْخُلِي فِي عِبَادِي ۝ وَادْخُلِي جَنَّتِي',
        tr: 'Fadkhuli fi ibadi. Wadkhuli Jannati.',
        hiPron: 'फ़द्ख़ुली फ़ी इबादी। वद्ख़ुली जन्नती।',
        ur: 'پس میرے خاص بندوں میں شامل ہو جا، اور میری جنت میں داخل ہو جا۔',
        hi: 'अतः मेरे ख़ास बन्दों में शामिल हो जा, और मेरी जन्नत में प्रवेश कर जा।',
        'ur-roman': 'Pas Mere khaas bandon mein shamil ho ja, aur Meri Jannat mein dakhil ho ja.',
        en: 'So enter among My chosen servants, and enter My Paradise!',
        fa: 'پس در سلک بندگان خاص من درآی، و در بهشت من داخل شو.'
      }
    ]
  },
  97: {
    number: 97,
    nameAr: 'سورة القدر',
    nameEn: 'Surah Al-Qadr (The Night of Decree)',
    revelationType: 'Meccan • 5 Ayahs',
    karbalaContext: 'Recommended in Kamil al-Ziyarat to be recited 7 times beside the sacred tomb (Zarih) of Imam Hussain (AS) and during the 2-Rak’at Ziyarat prayer.',
    ayahs: [
      {
        num: 1,
        ar: 'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ',
        tr: 'Inna anzalnahu fi Laylatil-Qadr',
        hiPron: 'इन्ना अंज़ल्नाहु फ़ी लैलतिल-क़द्र',
        ur: 'بے شک ہم نے اس (قرآن) کو شبِ قدر میں نازل فرمایا۔',
        hi: 'निश्चय ही हमने इसे (क़ुरआन को) शब-ए-क़द्र में अवतरित किया है।',
        'ur-roman': 'Beshak Hum ne is (Quran) ko Shab-e-Qadr mein nazil farmaya.',
        en: 'Indeed, We sent it down during the Night of Decree (Laylat al-Qadr).',
        fa: 'ما آن (قرآن) را در شب قدر نازل کردیم.'
      },
      {
        num: 2,
        ar: 'وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ',
        tr: 'Wa ma adraka ma Laylatul-Qadr',
        hiPron: 'व मा अद्राका मा लैलतुल-क़द्र',
        ur: 'اور آپ کو کیا معلوم کہ شبِ قدر کیا ہے؟',
        hi: 'और आपको क्या मालूम कि शब-ए-क़द्र क्या है?',
        'ur-roman': 'Aur aap ko kya maloom ke Shab-e-Qadr kya hai?',
        en: 'And what can make you know what the Night of Decree is?',
        fa: 'و تو چه می‌دانی شب قدر چیست؟'
      },
      {
        num: 3,
        ar: 'لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ',
        tr: 'Laylatul-Qadri khayrun min alfi shahr',
        hiPron: 'लैलतुल-क़द्रि ख़ैरुन मिन अल्फ़ि शहर',
        ur: 'شبِ قدر ہزار مہینوں سے بہتر ہے۔',
        hi: 'शब-ए-क़द्र हज़ार महीनों से उत्तम है।',
        'ur-roman': 'Shab-e-Qadr hazaar mahinon se behtar hai.',
        en: 'The Night of Decree is better than a thousand months.',
        fa: 'شب قدر بهتر از هزار ماه است.'
      },
      {
        num: 4,
        ar: 'تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ',
        tr: 'Tanazzalul-mala’ikatu war-ruhu feeha bi-idhni Rabbihim min kulli amr',
        hiPron: 'तनज़्ज़लुल-मलाइकतु वर-रूहु फ़ीहा बि-इज़्नि रब्बिहिम मिन कुल्लि अम्र',
        ur: 'اس رات فرشتے اور روح القدس اپنے رب کے اذن سے ہر امر لے کر اترتے ہیں۔',
        hi: 'उस रात फ़रिश्ते और रूह (जिब्रील) अपने रब की आज्ञा से हर आदेश लेकर उतरते हैं।',
        'ur-roman': 'Us raat farishte aur Rooh-ul-Quds apne Rab ke hukm se har amr le kar utarte hain.',
        en: 'The angels and the Spirit descend therein by permission of their Lord for every affair.',
        fa: 'فرشتگان و روح در آن شب به اذن پروردگارشان برای هر امری نازل می‌شوند.'
      },
      {
        num: 5,
        ar: 'سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ',
        tr: 'Salamun hiya hatta matla’il-fajr',
        hiPron: 'सलामुन हिया हत्ता मत्लइल-फ़ज्र',
        ur: 'وہ رات طلوعِ فجر تک سراسر سلامتی ہی سلامتی ہے۔',
        hi: 'वह रात भोर (फ़ज्र) के उदय होने तक पूर्ण शांति और सलामती है।',
        'ur-roman': 'Woh raat tuloo-e-Fajr tak sarasar salamti hi salamti hai.',
        en: 'Peace it is until the emergence of dawn.',
        fa: 'آن شب تا طلوع فجر سراسر سلام و رحمت است.'
      }
    ]
  },
  112: {
    number: 112,
    nameAr: 'سورة الإخلاص',
    nameEn: 'Surah Al-Ikhlas (Sincerity / Monotheism)',
    revelationType: 'Meccan • 4 Ayahs',
    karbalaContext: 'Recited in every Ziyarat prayer at the shrines of Imam Hussain (AS) and Hazrat Abbas (AS).',
    ayahs: [
      {
        num: 1,
        ar: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        tr: 'Qul Huwallahu Ahad',
        hiPron: 'क़ुल हुवल्लाहु अहद',
        ur: 'کہہ دیجیے کہ وہ اللہ ایک ہے۔',
        hi: 'कह दीजिए कि वह अल्लाह एक (अद्वितीय) है।',
        'ur-roman': 'Keh dijiye ke Woh Allah Ek hai.',
        en: 'Say: He is Allah, the One and Only.',
        fa: 'بگو: اوست خدای یکتا.'
      },
      {
        num: 2,
        ar: 'اللَّهُ الصَّمَدُ',
        tr: 'Allahus-Samad',
        hiPron: 'अल्लाहुस-समद',
        ur: 'اللہ بے نیاز ہے (سب اس کے محتاج ہیں)۔',
        hi: 'अल्लाह बे-नियाज़ (आत्मनिर्भर) है, सब उसके मोहताज हैं।',
        'ur-roman': 'Allah Be-Niyaz hai (sab Uske mohtaj hain).',
        en: 'Allah, the Eternal Refuge, Self-Sufficient.',
        fa: 'خداوند بی‌نیاز است.'
      },
      {
        num: 3,
        ar: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        tr: 'Lam yalid wa lam yulad',
        hiPron: 'लम यलिद व लम यूलद',
        ur: 'نہ اس کی کوئی اولاد ہے اور نہ وہ کسی سے پیدا ہوا۔',
        hi: 'न उसकी कोई संतान है और न वह किसी से जन्मा है।',
        'ur-roman': 'Na Uski koi aulad hai aur na Woh kisi se paida hua.',
        en: 'He neither begets nor is born.',
        fa: 'نه زاده است و نه زاده شده است.'
      },
      {
        num: 4,
        ar: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        tr: 'Wa lam yakun lahu kufuwan ahad',
        hiPron: 'व लम यकुन लहू कुफ़ुवन अहद',
        ur: 'اور کوئی بھی اس کا ہمسر نہیں ہے۔',
        hi: 'और कोई भी उसके समतुल्य (बराबर) नहीं है।',
        'ur-roman': 'Aur koi bhi Uska hamsar (barabar) nahi hai.',
        en: 'Nor is there to Him any equivalent.',
        fa: 'و هیچ کس همتای او نیست.'
      }
    ]
  },
  36: {
    number: 36,
    nameAr: 'سورة يس (قلب القرآن)',
    nameEn: 'Surah Yaseen (Heart of the Quran — Opening Passage)',
    revelationType: 'Meccan • Opening Verses (1–12)',
    karbalaContext: 'Recited on Thursday nights (Shab-e-Jumu’ah) in Bayn al-Haramayn and inside the courtyard of Imam Hussain (AS). Select from the 114 Surah picker to load all 83 verses.',
    ayahs: [
      {
        num: 1,
        ar: 'يس ۝ وَالْقُرْآنِ الْحَكِيمِ',
        tr: 'Ya-Seen. Wal-Qur’anil-Hakeem.',
        hiPron: 'या-सीन। वल-क़ुरआनिल-हकीम।',
        ur: 'یٰسٓ! قسم ہے قرآنِ حکیم کی۔',
        hi: 'या-सीन! शपथ है ज्ञानमय क़ुरआन की।',
        'ur-roman': 'Ya-Seen! Qasam hai Quran-e-Hakeem ki.',
        en: 'Ya-Seen. By the wise Quran.',
        fa: 'یس؛ سوگند به قرآن حکیم.'
      },
      {
        num: 3,
        ar: 'إِنَّكَ لَمِنَ الْمُرْسَلِينَ ۝ عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ',
        tr: 'Innaka laminal-mursaleen. Ala Siratin Mustaqeem.',
        hiPron: 'इन्नका लमिनल-मुर्सलीन। अला सिरातिन मुस्तक़ीम।',
        ur: 'بے شک آپ رسولوں میں سے ہیں، سیدھے راستے پر قائم ہیں۔',
        hi: 'निश्चय ही आप रसूलों (पैग़म्बरों) में से हैं, सीधे मार्ग पर प्रतिष्ठित हैं।',
        'ur-roman': 'Beshak Aap Rasoolon mein se hain, seedhe raste par qayem hain.',
        en: 'Indeed you, O Muhammad, are from among the messengers, on a straight path.',
        fa: 'قطعاً تو از فرستادگان الهی هستی، بر راهی راست.'
      },
      {
        num: 5,
        ar: 'تَنزِيلَ الْعَزِيزِ الرَّحِيمِ',
        tr: 'Tanzeelal-Azeezir-Raheem',
        hiPron: 'तंज़ीलल-अज़ीज़िर-रहीम',
        ur: 'یہ غالب اور نہایت مہربان ذات کا نازل کردہ ہے۔',
        hi: 'यह सर्वशक्तिमान और अत्यंत दयालु रब द्वारा अवतरित है।',
        'ur-roman': 'Yeh Ghalib aur nihayat Meherban Zaat ka nazil karda hai.',
        en: 'A revelation of the Exalted in Might, the Merciful.',
        fa: 'نازل‌شده از جانب خداوند عزیز و رحیم است.'
      },
      {
        num: 12,
        ar: 'إِنَّا نَحْنُ نُحْيِي الْمَوْتَىٰ وَنَكْتُبُ مَا قَدَّمُوا وَآثَارَهُمْ ۚ وَكُلَّ شَيْءٍ أَحْصَيْنَاهُ فِي إِمَامٍ مُّبِينٍ',
        tr: 'Inna Nahnu nuhyil-mawta wa naktubu ma qaddamu wa atharahum, wa kulla shay’in ahsaynahu fi Imamin Mubeen.',
        hiPron: 'इन्ना नह्नु नुह्यिल-मौता व नक्तुबु मा क़द्दमू व आसारहुम, व कुल्ला शैइन अह्सैनाहु फ़ी इमामिन मुबीन।',
        ur: 'بے شک ہم ہی مردوں کو زندہ کرتے ہیں اور جو کچھ انہوں نے آگے بھیجا اور ان کے نقوشِ قدم کو لکھتے ہیں، اور ہم نے ہر چیز کو امامِ مبین میں شمار کر رکھا ہے۔',
        hi: 'निश्चय ही हम मृतकों को जीवित करते हैं और जो कर्म उन्होंने आगे भेजे और उनके पदचिह्नों को लिखते हैं, तथा हमने हर चीज़ को स्पष्ट इमाम (इमाम-ए-मुबीन) में सहेज रखा है।',
        'ur-roman': 'Beshak Hum hi murdon ko zinda karte hain aur unke aamal aur aasar likhte hain, aur Hum ne har cheez ko Imam-e-Mubeen mein mehfooz kar rakha hai.',
        en: 'Indeed, it is We who bring the dead to life and record what they have put forth and their footprints; and all things We have enumerated in a clear Register (Imam Mubeen).',
        fa: 'ما خود مردگان را زنده می‌کنیم و آنچه از پیش فرستاده‌اند و آثارشان را می‌نویسیم، و هر چیزی را در امام مبین برشمرده‌ایم.'
      }
    ]
  },
  108: {
    number: 108,
    nameAr: 'سورة الكوثر',
    nameEn: 'Surah Al-Kawthar (Abundance)',
    revelationType: 'Meccan • 3 Ayahs',
    karbalaContext: 'Revealed regarding Sayyida Fatima al-Zahra (SA) and the blessed progeny of Imam Hussain (AS).',
    ayahs: [
      {
        num: 1,
        ar: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
        tr: 'Inna a’taynkal-Kawthar',
        hiPron: 'इन्ना अअतैनाकल-कौसर',
        ur: 'بے شک ہم نے آپ کو کوثر (کثیر خیر و فاطمہ زہراؑ کی نسل) عطا فرمائی۔',
        hi: 'निश्चय ही हमने आपको कौसर (असीम भलाई एवं पवित्र वंश) प्रदान किया।',
        'ur-roman': 'Beshak Hum ne Aap ko Kawthar (Kaseer Khair aur Aal-e-Fatima) ata farmayi.',
        en: 'Indeed, We have granted you Al-Kawthar (Abundant Good).',
        fa: 'ما به تو کوثر (خیر کثیر) عطا کردیم.'
      },
      {
        num: 2,
        ar: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
        tr: 'Fa-salli li-Rabbika wanhar',
        hiPron: 'फ़-सल्लि लि-रब्बिका वन्हर',
        ur: 'پس اپنے رب کے لیے نماز پڑھیں اور قربانی دیں۔',
        hi: 'अतः अपने रब के लिए नमाज़ पढ़ें और क़ुर्बानी दें।',
        'ur-roman': 'Pas apne Rab ke liye namaz parhein aur qurbani dein.',
        en: 'So pray to your Lord and sacrifice.',
        fa: 'پس برای پروردگارت نماز گزار و قربانی کن.'
      },
      {
        num: 3,
        ar: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
        tr: 'Inna shani’aka huwal-abtar',
        hiPron: 'इन्ना शानिअका हुवल-अबतर',
        ur: 'بے شک آپ کا دشمن ہی بے نام و نشان (مقطوع النسل) ہے۔',
        hi: 'निश्चय ही आपका शत्रु ही निर्वंश (नामोनिशान रहित) है।',
        'ur-roman': 'Beshak Aap ka dushman hi be-naam-o-nishan (abtar) hai.',
        en: 'Indeed, your enemy is the one cut off from posterity.',
        fa: 'بی‌گمان دشمن تو خود بریده‌نسل و بی‌نام‌ونشان است.'
      }
    ]
  }
};

export function QuranAndZiyaratHub({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('ashura'); // 'ashura' | 'warith' | 'quran'
  const [selectedLang, setSelectedLang] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem('karbala_pilgrim_prefs') || '{}');
      return p.language || 'ur';
    } catch (e) {
      return 'ur';
    }
  });
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [fontScale, setFontScale] = useState(1.1); // 0.9 | 1.1 | 1.3 | 1.5
  const [readingMode, setReadingMode] = useState(false);
  const [readerSettingsOpen, setReaderSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Tasbih 100x Counters for Ziyarat-e-Ashura
  const [laanCount, setLaanCount] = useState(0);
  const [salamCount, setSalamCount] = useState(0);

  // Quran Surah Browser State (All 114 Surahs)
  const [allSurahsList, setAllSurahsList] = useState([]);
  const [selectedSurahNum, setSelectedSurahNum] = useState(1);
  const [liveSurahData, setLiveSurahData] = useState(null);
  const [loadingSurah, setLoadingSurah] = useState(false);

  // Audio & TTS Playback State
  const [speakingVerseId, setSpeakingVerseId] = useState(null);
  const audioRef = useRef(null);
  const [playingQuranAudioId, setPlayingQuranAudioId] = useState(null);

  // Sync with global navbar language changes
  useEffect(() => {
    const handleGlobalLang = (e) => {
      if (e.detail && e.detail.language) {
        setSelectedLang(e.detail.language);
      }
    };
    window.addEventListener('karbala-language-change', handleGlobalLang);
    return () => window.removeEventListener('karbala-language-change', handleGlobalLang);
  }, []);

  // Load 114 Surahs index from AlQuran Cloud API
  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(r => r.json())
      .then(d => {
        if (d && Array.isArray(d.data)) {
          setAllSurahsList(d.data);
        }
      })
      .catch(() => {});
  }, []);

  // Load any Surah from the 114 Surahs when selectedSurahNum or selectedLang changes
  useEffect(() => {
    if (activeTab !== 'quran') return;

    // If it's one of our offline pre-bundled featured Surahs and user hasn't requested full 83-ayah Yaseen, show instant offline data first
    if (FEATURED_SURAHS[selectedSurahNum] && selectedSurahNum !== 36) {
      setLiveSurahData(FEATURED_SURAHS[selectedSurahNum]);
      return;
    }

    let cancelled = false;
    async function loadFullSurah() {
      setLoadingSurah(true);
      try {
        const editionMap = {
          ur: 'ur.jalandhry',
          hi: 'hi.hindi',
          en: 'en.sahih',
          fa: 'fa.makarem',
          'ur-roman': 'en.sahih',
          ar: 'quran-uthmani'
        };
        const transEdition = editionMap[selectedLang] || 'en.sahih';
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${selectedSurahNum}/editions/quran-uthmani,en.transliteration,${transEdition}`);
        const json = await res.json();
        if (!cancelled && json && Array.isArray(json.data) && json.data.length >= 2) {
          const arEd = json.data[0];
          const trEd = json.data[1];
          const langEd = json.data[2] || json.data[1];

          let ayahs = arEd.ayahs.map((a, idx) => ({
            num: a.numberInSurah,
            globalAyahNum: a.number,
            ar: a.text,
            tr: trEd.ayahs[idx]?.text || '',
            hiPron: '',
            [selectedLang]: langEd.ayahs[idx]?.text || '',
            en: langEd.ayahs[idx]?.text || ''
          }));

          // If user chose Roman Urdu, convert via our backend batch translator for the first 30 ayahs
          if (selectedLang === 'ur-roman') {
            try {
              const enTexts = ayahs.slice(0, 30).map(x => x.en);
              const bRes = await fetch('/api/translator/translate-batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texts: enTexts, targetLang: 'ur-roman' })
              }).then(r => r.json());
              if (bRes && Array.isArray(bRes.translations)) {
                for (let k = 0; k < bRes.translations.length; k++) {
                  ayahs[k]['ur-roman'] = bRes.translations[k];
                }
              }
            } catch (e) {}
          }

          setLiveSurahData({
            number: arEd.number,
            nameAr: arEd.name,
            nameEn: `${arEd.englishName} (${arEd.englishNameTranslation})`,
            revelationType: `${arEd.revelationType} • ${arEd.numberOfAyahs} Ayahs`,
            karbalaContext: FEATURED_SURAHS[selectedSurahNum]?.karbalaContext || 'Complete Surah from the Holy Quran with verse-by-verse Arabic recitation and multilingual translation.',
            ayahs
          });
        } else if (!cancelled && FEATURED_SURAHS[selectedSurahNum]) {
          setLiveSurahData(FEATURED_SURAHS[selectedSurahNum]);
        }
      } catch (e) {
        if (!cancelled && FEATURED_SURAHS[selectedSurahNum]) {
          setLiveSurahData(FEATURED_SURAHS[selectedSurahNum]);
        }
      } finally {
        if (!cancelled) setLoadingSurah(false);
      }
    }

    loadFullSurah();
    return () => { cancelled = true; };
  }, [activeTab, selectedSurahNum, selectedLang]);

  const handleSpeakText = (id, text, langCode) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (speakingVerseId === id) {
      setSpeakingVerseId(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const localeMap = {
      ar: ['ar-SA', 'ar-IQ', 'ar'],
      ur: ['ur-PK', 'ur-IN', 'ur', 'hi-IN'],
      hi: ['hi-IN', 'hi'],
      'ur-roman': ['hi-IN', 'ur-PK', 'en-IN'],
      en: ['en-US', 'en-GB', 'en'],
      fa: ['fa-IR', 'fa']
    };
    const targets = localeMap[langCode] || ['en-US'];
    const matched = voices.find(v => targets.some(t => v.lang.toLowerCase().startsWith(t.toLowerCase())));
    if (matched) utterance.voice = matched;
    utterance.lang = targets[0];
    utterance.rate = 0.92;
    setSpeakingVerseId(id);
    utterance.onend = () => setSpeakingVerseId(null);
    utterance.onerror = () => setSpeakingVerseId(null);
    window.speechSynthesis.speak(utterance);
  };

  const playQuranAyahAudio = (ayahObj, surahNum) => {
    const key = `${surahNum}:${ayahObj.num}`;
    if (playingQuranAudioId === key && audioRef.current) {
      audioRef.current.pause();
      setPlayingQuranAudioId(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    // Use EveryAyah / Alafasy verse audio stream or fallback to Arabic Web Speech
    const pad3 = (n) => String(n).padStart(3, '0');
    const url = `https://everyayah.com/data/Alafasy_128kbps/${pad3(surahNum)}${pad3(ayahObj.num)}.mp3`;
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingQuranAudioId(key);
    audio.onended = () => setPlayingQuranAudioId(null);
    audio.onerror = () => {
      setPlayingQuranAudioId(null);
      handleSpeakText(key, ayahObj.ar, 'ar');
    };
    audio.play().catch(() => {
      setPlayingQuranAudioId(null);
      handleSpeakText(key, ayahObj.ar, 'ar');
    });
  };

  const currentLangMeta = LANGUAGE_OPTIONS.find(l => l.id === selectedLang) || LANGUAGE_OPTIONS[0];

  const renderZiyaratCards = (versesList, prefix) => {
    const filtered = versesList.filter(v => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        v.sectionTitle.toLowerCase().includes(q) ||
        v.arabic.includes(q) ||
        v.transliteration.toLowerCase().includes(q) ||
        (v.translations[selectedLang] || '').toLowerCase().includes(q) ||
        (v.translations.en || '').toLowerCase().includes(q)
      );
    });

    return (
      <div className="sacred-verse-stream">
        {filtered.map((verse) => {
          const translatedText = verse.translations[selectedLang] || verse.translations.en;
          const speakArId = `${prefix}_ar_${verse.id}`;
          const speakTrId = `${prefix}_tr_${verse.id}`;

          return (
            <article
              key={verse.id}
              className="sacred-verse-passage notranslate"
            >
              {/* Subtle Open Passage Header & Quiet Audio Controls */}
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <div className="d-flex align-items-center gap-3">
                  <span
                    className="font-display text-gold-antique"
                    style={{ fontSize: '0.74rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}
                  >
                    PASSAGE 0{verse.id}
                  </span>
                  <span style={{ width: '18px', height: '1px', background: 'rgba(200, 164, 91, 0.35)' }}></span>
                  <h5 className="font-editorial fst-italic text-ivory-warm mb-0" style={{ fontSize: 'clamp(1.05rem, 2vw, 1.28rem)' }}>
                    {verse.sectionTitle}
                  </h5>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 py-1 ${speakingVerseId === speakArId ? 'btn-danger' : 'btn-link text-gold-antique text-decoration-none'}`}
                    onClick={() => handleSpeakText(speakArId, verse.arabic, 'ar')}
                    style={{ fontSize: '0.76rem', border: speakingVerseId === speakArId ? 'none' : '1px solid rgba(200, 164, 91, 0.25)' }}
                  >
                    <i className={`bi ${speakingVerseId === speakArId ? 'bi-stop-fill' : 'bi-volume-up'} me-1.5`}></i>
                    {speakingVerseId === speakArId ? 'Stop Recitation' : 'Recite Arabic'}
                  </button>
                  {selectedLang !== 'ar' && (
                    <button
                      type="button"
                      className={`btn btn-sm rounded-pill px-3 py-1 ${speakingVerseId === speakTrId ? 'btn-danger' : 'btn-link text-ivory-muted text-decoration-none'}`}
                      onClick={() => handleSpeakText(speakTrId, translatedText, selectedLang)}
                      style={{ fontSize: '0.76rem', border: speakingVerseId === speakTrId ? 'none' : '1px solid rgba(238, 231, 215, 0.14)' }}
                    >
                      <i className={`bi ${speakingVerseId === speakTrId ? 'bi-stop-fill' : 'bi-play-circle'} me-1.5`}></i>
                      {speakingVerseId === speakTrId ? 'Stop' : `Listen (${selectedLang.toUpperCase()})`}
                    </button>
                  )}
                </div>
              </div>

              {/* Dominant Vocalized Arabic Calligraphy (Open Surface — No Heavy Box) */}
              <div
                className="sacred-arabic-calligraphy"
                style={{
                  fontSize: `clamp(1.5rem, 4.5vw, ${fontScale * 1.75}rem)`
                }}
              >
                {verse.arabic}
              </div>

              {/* Quiet Transliteration Line (Optional via Reader Settings) */}
              {showTransliteration && (
                <div
                  className="mb-3"
                  style={{
                    fontSize: `${fontScale * 0.92}rem`,
                    color: 'rgba(224, 189, 114, 0.78)',
                    fontStyle: 'italic',
                    lineHeight: '1.75'
                  }}
                >
                  {verse.transliteration}
                  {(selectedLang === 'hi' || selectedLang === 'ur-roman') && verse.hiPronunciation && (
                    <div className="small mt-1" style={{ color: 'rgba(238, 231, 215, 0.65)', fontStyle: 'normal' }}>
                      {verse.hiPronunciation}
                    </div>
                  )}
                </div>
              )}

              {/* Open Editorial Translation Prose */}
              {selectedLang !== 'ar' && (
                <div
                  className={`sacred-translation-prose ${currentLangMeta.fontClass}`}
                  style={{
                    direction: currentLangMeta.dir,
                    textAlign: currentLangMeta.dir === 'rtl' ? 'right' : 'left',
                    fontSize: `${fontScale * 1.08}rem`
                  }}
                >
                  {translatedText}
                </div>
              )}

              {/* Interactive 100x Tasbih Counter for Ziyarat-e-Ashura La'an & Salam */}
              {verse.isHundredLaan && (
                <div className="mt-4 pt-3 d-flex align-items-center justify-content-between flex-wrap gap-3" style={{ borderTop: '1px dashed rgba(200,164,91,0.28)' }}>
                  <div>
                    <span className="text-gold-antique fw-semibold d-block" style={{ fontSize: '0.84rem', letterSpacing: '0.06em' }}>
                      <i className="bi bi-stars me-1.5"></i>100× La’an Devotional Counter
                    </span>
                    <span className="small text-ivory-muted">Tap as you recite the passage above</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="font-display text-gold-antique fs-4 px-3">
                      {laanCount} <small className="text-ivory-dim fs-6">/ 100</small>
                    </span>
                    <button
                      type="button"
                      className="btn-cinema-gold py-1.5 px-3"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => setLaanCount(c => Math.min(100, c + 1))}
                    >
                      +1 Recite
                    </button>
                    <button
                      type="button"
                      className="btn-cinema-glass py-1.5 px-2.5"
                      style={{ fontSize: '0.74rem' }}
                      onClick={() => setLaanCount(c => Math.min(100, c + 10))}
                    >
                      +10
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-ivory-dim text-decoration-none"
                      onClick={() => setLaanCount(0)}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}

              {verse.isHundredSalam && (
                <div className="mt-4 pt-3 d-flex align-items-center justify-content-between flex-wrap gap-3" style={{ borderTop: '1px dashed rgba(200,164,91,0.28)' }}>
                  <div>
                    <span className="text-gold-antique fw-semibold d-block" style={{ fontSize: '0.84rem', letterSpacing: '0.06em' }}>
                      <i className="bi bi-check2-circle me-1.5"></i>100× Salam Devotional Counter
                    </span>
                    <span className="small text-ivory-muted">Tap as you recite the Salam passage above</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="font-display text-gold-antique fs-4 px-3">
                      {salamCount} <small className="text-ivory-dim fs-6">/ 100</small>
                    </span>
                    <button
                      type="button"
                      className="btn-cinema-gold py-1.5 px-3"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => setSalamCount(c => Math.min(100, c + 1))}
                    >
                      +1 Salam
                    </button>
                    <button
                      type="button"
                      className="btn-cinema-glass py-1.5 px-2.5"
                      style={{ fontSize: '0.74rem' }}
                      onClick={() => setSalamCount(c => Math.min(100, c + 10))}
                    >
                      +10
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-ivory-dim text-decoration-none"
                      onClick={() => setSalamCount(0)}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    );
  };

  const activeSurah = liveSurahData || FEATURED_SURAHS[selectedSurahNum] || FEATURED_SURAHS[1];

  return (
    <div className="quran-ziyarat-sanctuary pb-5 notranslate" style={{ minHeight: '100vh', background: 'var(--bg-obsidian, #050706)' }}>

      {/* Signature Full-Width Sacred Sanctuary Visual Opening (Hidden in Focus Mode) */}
      {!readingMode && (
        <section
          className="position-relative overflow-hidden d-flex align-items-end"
          style={{ minHeight: '380px', padding: '72px 24px 48px', borderBottom: '1px solid rgba(200, 164, 91, 0.18)' }}
        >
          <div
            className="position-absolute inset-0"
            style={{
              backgroundImage: 'url(assets/images/karbala_hd_sacred_zarih_interior.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.32) contrast(1.15)'
            }}
          ></div>
          <div
            className="position-absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(5,7,6,0.5) 0%, rgba(5,7,6,0.75) 60%, #050706 100%)'
            }}
          ></div>

          <div className="container position-relative z-2" style={{ maxWidth: '1080px' }}>
            <div className="doc-chapter-label">SACRED LITURGICAL SANCTUARY · MULTILINGUAL READER</div>
            <h1 className="doc-monument-heading mb-2">
              THE SACRED READER
            </h1>
            <div className="font-arabic text-gold-antique fs-3 mb-2" dir="rtl">
              القرآن الكريم وزيارة عاشوراء وزيارة وارث
            </div>
            <p className="doc-editorial-lead mb-0" style={{ maxWidth: '720px', fontSize: '1.12rem' }}>
              A quiet, contemplative sanctuary for the Holy Quran (all 114 Surahs), Ziyarat-e-Ashura, and Ziyarat-e-Warith with vocalized calligraphy, synchronized recitation, and translations across six languages.
            </p>
          </div>
        </section>
      )}

      <div className={`container pt-4 ${readingMode ? 'ziyarat-reading-mode-active' : ''}`} style={{ maxWidth: readingMode ? '880px' : '1120px', transition: 'max-width 0.35s ease' }}>

        {/* Minimal Sticky Reader Toolbar: 3 Book Tabs + 1 Language Select + 1 Search + 1 Reader Settings Popover */}
        <div className="sacred-reader-toolbar">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            {/* Sacred Text Switcher */}
            <div className="d-flex align-items-center gap-1 overflow-x-auto">
              {[
                { id: 'ashura', icon: 'bi-journal-richtext', label: 'Ziyarat-e-Ashura', sub: 'زيارة عاشوراء' },
                { id: 'warith', icon: 'bi-compass', label: 'Ziyarat-e-Warith', sub: 'زيارة وارث' },
                { id: 'quran', icon: 'bi-book-half', label: 'The Holy Quran', sub: '١١٤ سورة' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  className={`sacred-book-tab ${activeTab === t.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  <i className={`bi ${t.icon}`}></i>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Unified Right Controls: 1 Language Selector + Search + 1 Reader Settings Button */}
            <div className="d-flex align-items-center gap-2 flex-wrap position-relative">
              {/* Single Language Selector */}
              <select
                className="cinema-lang-select"
                value={selectedLang}
                onChange={e => setSelectedLang(e.target.value)}
                aria-label="Select Translation Language"
              >
                {LANGUAGE_OPTIONS.map(lg => (
                  <option key={lg.id} value={lg.id}>
                    {lg.flag} {lg.label}
                  </option>
                ))}
              </select>

              {/* Compact Search Input */}
              <div className="position-relative" style={{ width: '175px' }}>
                <i className="bi bi-search position-absolute top-50 translate-middle-y ms-2.5 text-ivory-dim" style={{ fontSize: '0.74rem' }}></i>
                <input
                  type="text"
                  className="form-control form-control-sm bg-transparent text-light ps-4 rounded-pill"
                  placeholder="Filter passage..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ fontSize: '0.76rem', border: '1px solid rgba(238, 231, 215, 0.14)' }}
                />
              </div>

              {/* Single "Reader Settings" Button & Popover */}
              <div className="position-relative">
                <button
                  type="button"
                  className={`cinema-lang-select d-inline-flex align-items-center gap-2 ${readerSettingsOpen ? 'border-warning text-gold-antique' : ''}`}
                  onClick={() => setReaderSettingsOpen(!readerSettingsOpen)}
                >
                  <i className="bi bi-sliders text-gold-antique"></i>
                  <span>Reader Settings</span>
                </button>

                {readerSettingsOpen && (
                  <div className="reader-settings-popover">
                    <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                      <span className="font-display text-gold-antique small fw-bold" style={{ letterSpacing: '0.1em' }}>
                        READER SETTINGS
                      </span>
                      <button
                        type="button"
                        className="btn-close btn-close-white"
                        style={{ fontSize: '0.65rem' }}
                        onClick={() => setReaderSettingsOpen(false)}
                      ></button>
                    </div>

                    {/* Font Size Scale */}
                    <div className="mb-3">
                      <div className="small text-ivory-muted mb-1.5">Typography Scale ({Math.round((fontScale / 1.1) * 100)}%)</div>
                      <div className="d-flex align-items-center justify-content-between gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light flex-grow-1"
                          onClick={() => setFontScale(s => Math.max(0.85, +(s - 0.15).toFixed(2)))}
                        >
                          A− Smaller
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setFontScale(1.1)}
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light flex-grow-1"
                          onClick={() => setFontScale(s => Math.min(1.75, +(s + 0.15).toFixed(2)))}
                        >
                          A+ Larger
                        </button>
                      </div>
                    </div>

                    {/* Pronunciation / Transliteration Toggle */}
                    <div className="d-flex justify-content-between align-items-center mb-2.5">
                      <span className="small text-ivory-warm">Transliteration Guide</span>
                      <button
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 ${showTransliteration ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'}`}
                        style={{ fontSize: '0.72rem' }}
                        onClick={() => setShowTransliteration(!showTransliteration)}
                      >
                        {showTransliteration ? 'Shown' : 'Hidden'}
                      </button>
                    </div>

                    {/* Focus Reading Mode Toggle */}
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="small text-ivory-warm">Distraction-Free Focus</span>
                      <button
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 ${readingMode ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'}`}
                        style={{ fontSize: '0.72rem' }}
                        onClick={() => setReadingMode(!readingMode)}
                      >
                        {readingMode ? 'Active' : 'Off'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* TAB 1: ZIYARAT-E-ASHURA */}
        {/* ==================================================================== */}
        {activeTab === 'ashura' && (
          <div>
            <div className="text-center mb-5 pb-4" style={{ borderBottom: '1px solid rgba(200, 164, 91, 0.22)' }}>
              <div className="doc-chapter-label justify-content-center">HADITH QUDSI · MISBAH AL-MUTAHAJJID</div>
              <h2 className="font-arabic text-gold-antique mb-2" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>
                زيارة عاشوراء المأثورة
              </h2>
              <p className="text-ivory-muted small mx-auto mb-3" style={{ maxWidth: '680px' }}>
                Authenticated via Imam Muhammad al-Baqir (AS) &amp; Imam Ja’far al-Sadiq (AS) in Shaykh al-Tusi’s <em>Misbah al-Mutahajjid</em>.
              </p>
              <div className="d-inline-flex gap-4 small text-gold-antique font-monospace">
                <span>100× La’an: <strong>{laanCount}/100</strong></span>
                <span>•</span>
                <span>100× Salam: <strong>{salamCount}/100</strong></span>
              </div>
            </div>

            {renderZiyaratCards(ZIYARAT_ASHURA_VERSES, 'ashura')}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: ZIYARAT-E-WARITH */}
        {/* ==================================================================== */}
        {activeTab === 'warith' && (
          <div>
            <div className="text-center mb-5 pb-4" style={{ borderBottom: '1px solid rgba(200, 164, 91, 0.22)' }}>
              <div className="doc-chapter-label justify-content-center">KAMIL AL-ZIYARAT · MAFATIH AL-JINAN</div>
              <h2 className="font-arabic text-gold-antique mb-2" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>
                زيارة وارث وزيارة أبي الفضل العباس
              </h2>
              <p className="text-ivory-muted small mx-auto mb-0" style={{ maxWidth: '680px' }}>
                Transmitted from Imam Ja’far al-Sadiq (AS), tracing the prophetic inheritance of Adam, Noah, Abraham, Moses, Jesus, and Muhammad (SAW) in the stand of Imam Hussain (AS).
              </p>
            </div>

            {renderZiyaratCards(ZIYARAT_WARITH_VERSES, 'warith')}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: THE HOLY QURAN (FEATURED KARBALA SURAHS + ALL 114 SURAHS) */}
        {/* ==================================================================== */}
        {activeTab === 'quran' && (
          <div>
            {/* Clean Open Surah Selection Bar */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 pb-4 mb-5" style={{ borderBottom: '1px solid rgba(200, 164, 91, 0.22)' }}>
              <div className="d-flex flex-wrap align-items-center gap-2">
                <span className="small text-gold-antique text-uppercase fw-semibold me-1" style={{ fontSize: '0.72rem', letterSpacing: '0.12em' }}>
                  Featured Surahs:
                </span>
                {[
                  { num: 1, title: 'Al-Fatiha' },
                  { num: 89, title: 'Al-Fajr (Imam Hussain)' },
                  { num: 97, title: 'Al-Qadr' },
                  { num: 36, title: 'Surah Yaseen' },
                  { num: 108, title: 'Al-Kawthar' },
                  { num: 112, title: 'Al-Ikhlas' }
                ].map(s => (
                  <button
                    key={s.num}
                    type="button"
                    className={`consumer-prompt-chip py-1 px-3 ${selectedSurahNum === s.num ? 'border-warning text-gold-antique' : ''}`}
                    style={{ fontSize: '0.76rem' }}
                    onClick={() => setSelectedSurahNum(s.num)}
                  >
                    {s.title}
                  </button>
                ))}
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="small text-ivory-muted" style={{ fontSize: '0.76rem' }}>All 114 Surahs:</span>
                <select
                  className="cinema-lang-select"
                  value={selectedSurahNum}
                  onChange={e => setSelectedSurahNum(Number(e.target.value))}
                >
                  {allSurahsList.length > 0 ? (
                    allSurahsList.map(s => (
                      <option key={s.number} value={s.number}>
                        {s.number}. {s.englishName} ({s.name}) — {s.numberOfAyahs} Ayahs
                      </option>
                    ))
                  ) : (
                    Object.values(FEATURED_SURAHS).map(s => (
                      <option key={s.number} value={s.number}>
                        {s.number}. {s.nameEn} ({s.nameAr})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Active Surah Open Editorial Header */}
            <div className="text-center mb-5">
              <div className="doc-chapter-label justify-content-center">{activeSurah.revelationType}</div>
              <h2 className="font-arabic text-gold-antique mb-2" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
                {activeSurah.nameAr}
              </h2>
              <h3 className="font-display text-ivory-warm mb-2" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.65rem)' }}>
                {activeSurah.nameEn}
              </h3>
              {activeSurah.karbalaContext && (
                <p className="text-ivory-muted small mx-auto mb-0" style={{ maxWidth: '720px', lineHeight: 1.7 }}>
                  {activeSurah.karbalaContext}
                </p>
              )}
            </div>

            {loadingSurah ? (
              <div className="text-center py-5">
                <div className="spinner-border text-gold-antique mb-2" role="status"></div>
                <div className="text-champagne small">Loading Surah verses &amp; {currentLangMeta.label} translation...</div>
              </div>
            ) : (
              <div className="sacred-verse-stream">
                {(activeSurah.ayahs || []).map((ayah) => {
                  const ayahTranslation =
                    ayah[selectedLang] ||
                    (FEATURED_SURAHS[selectedSurahNum]?.ayahs?.find(x => x.num === ayah.num)?.[selectedLang]) ||
                    ayah.en ||
                    '';
                  const audioKey = `${activeSurah.number}:${ayah.num}`;
                  const ttsKey = `q_tts_${activeSurah.number}_${ayah.num}`;

                  return (
                    <article
                      key={ayah.num}
                      className="sacred-verse-passage"
                    >
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                        <span className="font-display text-gold-antique" style={{ fontSize: '0.75rem', letterSpacing: '0.18em' }}>
                          AYAH {ayah.num}
                        </span>

                        <div className="d-flex gap-2 flex-wrap">
                          <button
                            type="button"
                            className={`btn btn-sm rounded-pill px-3 py-1 ${playingQuranAudioId === audioKey ? 'btn-danger' : 'btn-link text-gold-antique text-decoration-none'}`}
                            onClick={() => playQuranAyahAudio(ayah, activeSurah.number)}
                            style={{ fontSize: '0.75rem', border: playingQuranAudioId === audioKey ? 'none' : '1px solid rgba(200, 164, 91, 0.25)' }}
                          >
                            <i className={`bi ${playingQuranAudioId === audioKey ? 'bi-stop-fill' : 'bi-volume-up'} me-1.5`}></i>
                            {playingQuranAudioId === audioKey ? 'Stop Tilawat' : 'Recite (Alafasy)'}
                          </button>

                          {selectedLang !== 'ar' && ayahTranslation && (
                            <button
                              type="button"
                              className={`btn btn-sm rounded-pill px-3 py-1 ${speakingVerseId === ttsKey ? 'btn-danger' : 'btn-link text-ivory-muted text-decoration-none'}`}
                              onClick={() => handleSpeakText(ttsKey, ayahTranslation, selectedLang)}
                              style={{ fontSize: '0.75rem', border: speakingVerseId === ttsKey ? 'none' : '1px solid rgba(238, 231, 215, 0.14)' }}
                            >
                              <i className={`bi ${speakingVerseId === ttsKey ? 'bi-stop-fill' : 'bi-play-circle'} me-1.5`}></i>
                              Listen Translation
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Dominant Open Arabic Ayah */}
                      <div
                        className="sacred-arabic-calligraphy"
                        style={{
                          fontSize: `clamp(1.55rem, 4.6vw, ${fontScale * 1.8}rem)`
                        }}
                      >
                        {ayah.ar} <span className="text-gold-antique ms-1">﴿{ayah.num}﴾</span>
                      </div>

                      {/* Optional Transliteration */}
                      {showTransliteration && (ayah.tr || ayah.hiPron) && (
                        <div
                          className="mb-3"
                          style={{
                            fontSize: `${fontScale * 0.9}rem`,
                            color: 'rgba(224, 189, 114, 0.78)',
                            fontStyle: 'italic'
                          }}
                        >
                          {ayah.tr}
                          {(selectedLang === 'hi' || selectedLang === 'ur-roman') && ayah.hiPron && (
                            <div className="small mt-1" style={{ color: 'rgba(238, 231, 215, 0.65)', fontStyle: 'normal' }}>
                              {ayah.hiPron}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Open Editorial Translation */}
                      {selectedLang !== 'ar' && ayahTranslation && (
                        <div
                          className={`sacred-translation-prose ${currentLangMeta.fontClass}`}
                          style={{
                            direction: currentLangMeta.dir,
                            textAlign: currentLangMeta.dir === 'rtl' ? 'right' : 'left',
                            fontSize: `${fontScale * 1.08}rem`
                          }}
                        >
                          {ayahTranslation}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
