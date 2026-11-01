/**
 * Karbala Digital Heritage Museum — Global Full-Website Multilingual Engine (i18nEngine.js v5)
 * Supports: English (en), Urdu (ur), Hindi (hi), Arabic (ar), Persian (fa), Roman Urdu (ur-roman)
 *
 * React-18 Safe Architecture:
 * - Modifies TextNode.nodeValue in-place (never injects wrapper tags that break React Virtual DOM)
 * - Detects when React updates a TextNode in-place (__karbalaAppliedText check) so dynamic state changes always translate
 * - Drains MutationObserver queue (observer.takeRecords()) after DOM writes to prevent infinite re-entrancy loops
 * - Never caches untranslated fallback strings into localStorage
 * - Translates input placeholders as well as visible text nodes
 * - Combines an expanded 0ms Curated UI Dictionary with batched POST Neural Translation (/api/translator/translate-batch)
 */

(function () {
  const CACHE_STORAGE_KEY = 'karbala_ui_i18n_cache_v4';
  try {
    localStorage.removeItem('karbala_ui_i18n_cache_v2');
    localStorage.removeItem('karbala_ui_i18n_cache_v3');
  } catch (e) {}

  let memoryCache = {
    ur: {},
    hi: {},
    ar: {},
    fa: {},
    'ur-roman': {}
  };

  try {
    const saved = localStorage.getItem(CACHE_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      for (const lang of ['ur', 'hi', 'ar', 'fa', 'ur-roman']) {
        if (parsed[lang] && typeof parsed[lang] === 'object') {
          // Purge any accidentally cached identical English strings
          const cleanMap = {};
          for (const [k, v] of Object.entries(parsed[lang])) {
            if (v && v !== k) cleanMap[k] = v;
          }
          memoryCache[lang] = cleanMap;
        }
      }
    }
  } catch (e) {}

  function persistCache() {
    try {
      localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(memoryCache));
    } catch (e) {}
  }

  // Instant 0ms Dictionary for Primary Navigation, Hero, Chapters, Footer, Poles & New Pilgrimage Features
  const CORE_UI_DICTIONARY = {
    ur: {
      'Explore': 'دریافت کریں',
      '61 AH': '61 ہجری',
      'People': 'شخصیات',
      'Ziyarat': 'زیارات',
      'Pilgrimage': 'سفرِ زیارت',
      'Research': 'تحقیق و تاریخ',
      'Sanctuary Map': 'حرم کا نقشہ',
      'KARBALA': 'کربلا المعلّیٰ',
      'Digital Heritage & Sanctuary': 'ڈیجیٹل ورثہ اور مقدس حرم',
      'RETURN TO KARBALA OPENING': 'کربلا کے مرکزی صفحے پر واپس جائیں',
      'Return to Karbala Opening': 'کربلا کے مرکزی صفحے پر واپس جائیں',
      'Return to Museum Story': 'میوزیم کی داستان پر واپس جائیں',
      'CURATORIAL ARCHIVE': 'تاریخی دستاویزی آرکائیو',
      'THE ILLUMINATED CHRONOLOGY OF MUHARRAM': 'محرم الحرام 61 ہجری کی روشن تاریخ',
      'THE CHRONICLE': 'تاریخی واقعات',
      'THE SANCTUARY': 'مقدس حرم و زیارات',
      'Chronicle of 61 AH': 'داستانِ کربلا (61 ہجری)',
      '61 AH Timeline': 'ٹائم لائن (1 تا 10 محرم)',
      'Voices of 61 AH': 'شہداء اور شخصیاتِ کربلا',
      '61 AH Topography': '61 ہجری کا جغرافیائی نقشہ',
      'Primary Sources': 'مستند تاریخی مآخذ',
      'Visual Pavilion': 'تصویری گیلری (Full HD)',
      'Sacred Quran & Ziyarat Reader': 'قرآنِ کریم اور زیارات ریڈر',
      'Sanctuary Map & Gates': 'حرم کا نقشہ اور دروازے',
      'Full-Screen Digital Twin': 'مکمل اسکرین ڈیجیٹل نقشہ',
      'Ask Karbala AI & Translator': 'کربلا اے آئی اور مترجم',
      'Najaf–Karbala 1,452 Poles': 'نجف تا کربلا 1,452 ستون (اربعین)',
      'Pilgrim Safar Simulator': 'زائرین سفر اور ایئرپورٹ گائیڈ',
      'ARCHIVAL PROVENANCE': 'تاریخی و تحقیقی مستندیت',
      'DESIGNED & ENGINEERED BY': 'ڈیزائن اور انجینئرنگ:',
      'Privacy Policy': 'رازداری کی پالیسی',
      'Terms & Sources': 'شرائط اور تاریخی مآخذ',
      'SEARCH COMPLETE ARCHIVE (⌘K)': 'مکمل آرکائیو میں تلاش کریں (⌘K)',
      'Zaireen Walk Tracker': 'زائرین واک ٹریکر (قدم شمار)',
      'Live Crowd Map': 'لائیو ہجوم کا نقشہ',
      'Smart Mawkib Finder': 'اسمارٹ موکب اور سہولیات تلاش کریں',
      'Group Journey Mode': 'گروپ اور فیملی سفر موڈ',
      'Journey Journal & Recap': 'سفر کی ڈائری اور خلاصہ',
      'Route & 1,452 Poles Map': 'نجف تا کربلا 1452 ستونوں کا نقشہ',
      'Pole Calculator': 'ستون اور فاصلہ کیلکولیٹر',
      'Safety & Offline Pack': 'حفاظت اور آف لائن پیک',
      'Start Walking': 'پیدل سفر شروع کریں',
      'Pause Walk': 'سفر موقوف کریں',
      'Resume Walk': 'سفر دوبارہ شروع کریں',
      'Finish & Save Walk': 'سفر مکمل اور محفوظ کریں',
      '61 AH Time Slider': '61 ہجری ٹائم سلائیڈر',
      'PRESENT DAY': 'موجودہ دور',
      '61 AH HISTORICAL VIEW': '61 ہجری کا تاریخی منظر'
    },
    hi: {
      'Explore': 'अन्वेषण करें',
      '61 AH': '61 हिजरी',
      'People': 'व्यक्तित्व',
      'Ziyarat': 'ज़ियारत',
      'Pilgrimage': 'तीर्थयात्रा',
      'Research': 'शोध व इतिहास',
      'Sanctuary Map': 'पवित्र नक्शा',
      'KARBALA': 'कर्बला मुअल्ला',
      'Digital Heritage & Sanctuary': 'डिजिटल विरासत एवं पवित्र दरगाह',
      'RETURN TO KARBALA OPENING': 'कर्बला मुख्य पृष्ठ पर लौटें',
      'Return to Karbala Opening': 'कर्बला मुख्य पृष्ठ पर लौटें',
      'Return to Museum Story': 'मुख्य गाथा पर लौटें',
      'CURATORIAL ARCHIVE': 'ऐतिहासिक अभिलेखागार',
      'THE ILLUMINATED CHRONOLOGY OF MUHARRAM': 'मुहर्रम 61 हिजरी का संपूर्ण कालक्रम',
      'THE CHRONICLE': 'ऐतिहासिक गाथा',
      'THE SANCTUARY': 'पवित्र दरगाह व ज़ियारत',
      'Chronicle of 61 AH': '61 हिजरी की ऐतिहासिक गाथा',
      '61 AH Timeline': '61 हिजरी समयरेखा (2–10 मुहर्रम)',
      'Voices of 61 AH': '61 हिजरी के महान व्यक्तित्व',
      '61 AH Topography': '61 हिजरी भौगोलिक मानचित्र',
      'Primary Sources': 'प्रामाणिक ऐतिहासिक स्रोत',
      'Visual Pavilion': 'फोटोग्राफिक पवेलियन (Full HD)',
      'Sacred Quran & Ziyarat Reader': 'पवित्र क़ुरआन एवं ज़ियारत पाठक',
      'Sanctuary Map & Gates': 'दरगाह का नक्शा व प्रवेश द्वार',
      'Full-Screen Digital Twin': 'पूर्ण-स्क्रीन डिजिटल नक्शा',
      'Ask Karbala AI & Translator': 'कर्बला एआई (AI) एवं अनुवादक',
      'Najaf–Karbala 1,452 Poles': 'नजफ़–कर्बला 1,452 पोल मार्ग',
      'Pilgrim Safar Simulator': 'ज़ायरीन यात्रा एवं एयरपोर्ट गाइड',
      'ARCHIVAL PROVENANCE': 'अभिलेखीय प्रामाणिकता',
      'DESIGNED & ENGINEERED BY': 'डिज़ाइन एवं इंजीनियरिंग:',
      'Privacy Policy': 'गोपनीयता नीति',
      'Terms & Sources': 'शर्तें एवं ऐतिहासिक स्रोत',
      'SEARCH COMPLETE ARCHIVE (⌘K)': 'संपूर्ण संग्रह में खोजें (⌘K)',
      'Zaireen Walk Tracker': 'ज़ायरीन वॉक ट्रैकर (कदम और दूरी)',
      'Live Crowd Map': 'लाइव भीड़ मानचित्र',
      'Smart Mawkib Finder': 'स्मार्ट मौकिब एवं सुविधा खोजक',
      'Group Journey Mode': 'समूह एवं परिवार यात्रा मोड',
      'Journey Journal & Recap': 'यात्रा डायरी एवं सारांश',
      'Route & 1,452 Poles Map': 'नजफ़–कर्बला 1,452 पोल नक्शा',
      'Pole Calculator': 'पोल एवं दूरी कैलकुलेटर',
      'Safety & Offline Pack': 'सुरक्षा एवं ऑफ़लाइन पैक',
      'Start Walking': 'पैदल यात्रा शुरू करें',
      'Pause Walk': 'यात्रा रोकें (विश्राम)',
      'Resume Walk': 'यात्रा फिर शुरू करें',
      'Finish & Save Walk': 'यात्रा समाप्त व सहेजें',
      '61 AH Time Slider': '61 हिजरी टाइम स्लाइडर',
      'PRESENT DAY': 'वर्तमान युग',
      '61 AH HISTORICAL VIEW': '61 हिजरी ऐतिहासिक दृश्य'
    },
    'ur-roman': {
      'Explore': 'Explore Karein',
      '61 AH': '61 Hijri',
      'People': 'Shakhsiyat',
      'Ziyarat': 'Ziyarat',
      'Pilgrimage': 'Safar-e-Ziyarat',
      'Research': 'Tehqeeq & Tareekh',
      'Sanctuary Map': 'Haram Naqsha',
      'KARBALA': 'KARBALA MUALLA',
      'Digital Heritage & Sanctuary': 'Digital Virasat aur Muqaddas Haram',
      'RETURN TO KARBALA OPENING': 'WAPAS HOME PAGE PAR JAYEIN',
      'Return to Karbala Opening': 'Wapas Home Page par jayein',
      'Return to Museum Story': 'Wapas Home Page par jayein',
      'CURATORIAL ARCHIVE': 'TAREEKHI ARCHIVE',
      'THE ILLUMINATED CHRONOLOGY OF MUHARRAM': 'MUHARRAM 61 HIJRI KI MUKAMMAL TAREEKH',
      'THE CHRONICLE': 'TAREEKH-E-KARBALA',
      'THE SANCTUARY': 'HARAM AUR ZIYARAT',
      'Chronicle of 61 AH': '61 Hijri ki Dastan',
      '61 AH Timeline': '1 ta 10 Muharram Timeline',
      'Voices of 61 AH': 'Shuhada aur Shakhsiyat-e-Karbala',
      '61 AH Topography': '61 Hijri ka Jughrafiyai Naqsha',
      'Primary Sources': 'Mustanad Tareekhi Kitabein',
      'Visual Pavilion': 'Tasweeri Gallery (Full HD)',
      'Sacred Quran & Ziyarat Reader': 'Quran-e-Kareem aur Ziyarat Reader',
      'Sanctuary Map & Gates': 'Roza Naqsha aur Darwaze',
      'Full-Screen Digital Twin': 'Full-Screen Digital Naqsha',
      'Ask Karbala AI & Translator': 'Ask Karbala AI aur Translator',
      'Najaf–Karbala 1,452 Poles': 'Najaf ta Karbala 1,452 Poles',
      'Pilgrim Safar Simulator': 'Zaireen Safar aur Airport Guide',
      'Zaireen Walk Tracker': 'Zaireen Walk Tracker (Qadam Shumar)',
      'Live Crowd Map': 'Live Rush / Crowd Naqsha',
      'Smart Mawkib Finder': 'Smart Mawkib aur Sahuliyat Finder',
      'Group Journey Mode': 'Group aur Family Safar Mode',
      'Journey Journal & Recap': 'Safar ki Diary aur Recap',
      'Route & 1,452 Poles Map': '1,452 Poles ka Naqsha',
      'Pole Calculator': 'Pole aur Fasla Calculator',
      'Safety & Offline Pack': 'Hifazat aur Offline Pack',
      'Start Walking': 'Paidal Safar Shuru Karein',
      'Pause Walk': 'Safar Pause Karein',
      'Resume Walk': 'Safar Resume Karein',
      'Finish & Save Walk': 'Safar Mukammal aur Save Karein'
    },
    ar: {
      'Explore': 'استكشف',
      '61 AH': '61 هـ',
      'People': 'الشخصيات',
      'Ziyarat': 'الزيارات',
      'Pilgrimage': 'الحج والزيارة',
      'Research': 'البحث والتاريخ',
      'Sanctuary Map': 'خريطة الحرمين',
      'KARBALA': 'كربلاء المقدسة',
      'Digital Heritage & Sanctuary': 'التراث الرقمي والرحاب المقدسة',
      'RETURN TO KARBALA OPENING': 'العودة إلى الصفحة الرئيسية',
      'Return to Karbala Opening': 'العودة إلى الصفحة الرئيسية',
      'THE ILLUMINATED CHRONOLOGY OF MUHARRAM': 'التسلسل الزمني المضيء لوقائع محرم 61 هـ',
      'Zaireen Walk Tracker': 'متتبع مشي الزائرين والخطوات',
      'Live Crowd Map': 'خريطة الازدحام المباشرة',
      'Smart Mawkib Finder': 'باحث المواكب والخدمات الذكي',
      'Group Journey Mode': 'وضع رحلة المجموعة والعائلة',
      'Journey Journal & Recap': 'مذكرات الرحلة والملخص',
      'Start Walking': 'ابدأ المشي الآن'
    },
    fa: {
      'Explore': 'کاوش',
      '61 AH': '۶۱ هجری',
      'People': 'شخصیت‌ها',
      'Ziyarat': 'زیارات',
      'Pilgrimage': 'سفر زیارتی',
      'Research': 'پژوهش و تاریخ',
      'Sanctuary Map': 'نقشه حرمین',
      'KARBALA': 'کربلای معلی',
      'Digital Heritage & Sanctuary': 'میراث دیجیتال و حریم قدسی',
      'RETURN TO KARBALA OPENING': 'بازگشت به صفحه اصلی کربلا',
      'Return to Karbala Opening': 'بازگشت به صفحه اصلی کربلا',
      'THE ILLUMINATED CHRONOLOGY OF MUHARRAM': 'گاهشمار منور وقایع محرم ۶۱ هجری',
      'Zaireen Walk Tracker': 'ردیاب پیاده‌روی و گام‌شمار زائران',
      'Live Crowd Map': 'نقشه زنده تراکم جمعیت',
      'Smart Mawkib Finder': 'مسیریاب هوشمند موکب‌ها و خدمات',
      'Group Journey Mode': 'حالت سفر گروهی و خانوادگی',
      'Journey Journal & Recap': 'خاطرات و خلاصه سفر اربعین',
      'Start Walking': 'شروع پیاده‌روی'
    }
  };

  const LANG_LABELS = {
    en: 'English',
    ur: 'اردو (Urdu)',
    hi: 'हिन्दी (Hindi)',
    'ur-roman': 'Roman Urdu',
    ar: 'العربية (Arabic)',
    fa: 'فارسی (Persian)'
  };

  let activeLanguage = 'en';
  let currentRunId = 0;
  let domObserver = null;
  let observerTimer = null;

  function showLanguageStatusToast(message, isDone = false) {
    let toast = document.getElementById('karbala-lang-status-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'karbala-lang-status-toast';
      toast.className = 'notranslate';
      toast.style.cssText = [
        'position:fixed',
        'bottom:78px',
        'right:16px',
        'z-index:99999',
        'background:rgba(10,14,18,0.95)',
        'color:#EEE7D7',
        'border:1px solid #C6A66B',
        'border-radius:999px',
        'padding:6px 14px',
        'font-size:0.76rem',
        'font-weight:600',
        'box-shadow:0 8px 24px rgba(0,0,0,0.75)',
        'transition:opacity 0.25s ease',
        'pointer-events:none'
      ].join(';');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    if (toast.__hideTimer) clearTimeout(toast.__hideTimer);
    if (isDone) {
      toast.__hideTimer = setTimeout(() => {
        toast.style.opacity = '0';
      }, 2200);
    }
  }

  function drainObserverRecords() {
    if (domObserver) {
      try {
        domObserver.takeRecords();
      } catch (e) {}
    }
  }

  function shouldSkipElement(el) {
    if (!el || el.nodeType !== 1) return true;
    const tag = el.tagName;
    if (
      tag === 'SCRIPT' ||
      tag === 'STYLE' ||
      tag === 'NOSCRIPT' ||
      tag === 'TEXTAREA' ||
      tag === 'INPUT' ||
      tag === 'CODE' ||
      tag === 'PRE' ||
      tag === 'SVG'
    ) {
      return true;
    }
    if (el.closest && el.closest('.notranslate, .font-arabic, .font-arabic-sign')) {
      return true;
    }
    return false;
  }

  function shouldTranslateString(str) {
    if (!str || str.length < 2) return false;
    // Skip pure numbers, coordinates, timestamps, or symbols
    if (/^[\d\s.,:%°•+\-—–/()[\]#@!*&|?<>~`'"]+$/.test(str)) return false;
    // Skip strings that are purely Arabic script already
    if (/^[\u0600-\u06FF\s.,:؛؟!()\-—0-9]+$/.test(str)) return false;
    // Skip strings that are purely Devanagari already (unless translating to non-Hindi)
    if (activeLanguage === 'hi' && /^[\u0900-\u097F\s.,:?!()\-—0-9]+$/.test(str)) return false;
    return /[A-Za-z]/.test(str);
  }

  function collectTranslatableTextNodes(rootEl) {
    const nodes = [];
    if (!rootEl) return nodes;

    const walker = document.createTreeWalker(
      rootEl,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent || shouldSkipElement(parent)) {
            return NodeFilter.FILTER_REJECT;
          }
          const raw = node.nodeValue || '';
          if (!raw.trim()) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      },
      false
    );

    let current;
    while ((current = walker.nextNode())) {
      // Detect if React updated this TextNode in-place since our last translation
      if (current.__karbalaOrigText === undefined) {
        current.__karbalaOrigText = current.nodeValue;
      } else if (
        current.__karbalaAppliedText !== undefined &&
        current.nodeValue !== current.__karbalaAppliedText &&
        current.nodeValue !== current.__karbalaOrigText
      ) {
        // React wrote new English content into this existing TextNode
        current.__karbalaOrigText = current.nodeValue;
        current.__karbalaAppliedText = undefined;
      }
      nodes.push(current);
    }
    return nodes;
  }

  function applyTranslationToNode(node, translatedTrimmed) {
    const orig = node.__karbalaOrigText || node.nodeValue || '';
    const leadingMatch = orig.match(/^\s*/);
    const trailingMatch = orig.match(/\s*$/);
    const leading = leadingMatch ? leadingMatch[0] : '';
    const trailing = trailingMatch ? trailingMatch[0] : '';
    const nextVal = leading + translatedTrimmed + trailing;
    if (node.nodeValue !== nextVal) {
      node.nodeValue = nextVal;
    }
    node.__karbalaAppliedText = nextVal;
    node.__karbalaLastLang = activeLanguage;
  }

  function translateInputPlaceholders(rootEl, lang, dict, langCache, pendingAttrMap) {
    if (!rootEl) return;
    const inputs = rootEl.querySelectorAll('input[placeholder], textarea[placeholder]');
    inputs.forEach((el) => {
      if (el.closest && el.closest('.notranslate')) return;
      if (el.__karbalaOrigPlaceholder === undefined) {
        el.__karbalaOrigPlaceholder = el.getAttribute('placeholder') || '';
      }
      const orig = (el.__karbalaOrigPlaceholder || '').trim();
      if (!orig) return;
      if (lang === 'en') {
        if (el.getAttribute('placeholder') !== el.__karbalaOrigPlaceholder) {
          el.setAttribute('placeholder', el.__karbalaOrigPlaceholder);
        }
        return;
      }
      if (!shouldTranslateString(orig)) return;
      if (dict[orig]) {
        el.setAttribute('placeholder', dict[orig]);
      } else if (langCache[orig]) {
        el.setAttribute('placeholder', langCache[orig]);
      } else if (pendingAttrMap) {
        if (!pendingAttrMap.has(orig)) pendingAttrMap.set(orig, []);
        pendingAttrMap.get(orig).push(el);
      }
    });
  }

  async function translatePageDom(lang, showToast = false) {
    const rootEl = document.getElementById('root');
    if (!rootEl) return;

    const runId = ++currentRunId;
    const textNodes = collectTranslatableTextNodes(rootEl);

    // 1. If English, restore all original English text nodes immediately (0ms)
    if (lang === 'en') {
      for (const node of textNodes) {
        if (node.__karbalaOrigText !== undefined && node.nodeValue !== node.__karbalaOrigText) {
          node.nodeValue = node.__karbalaOrigText;
        }
        node.__karbalaAppliedText = node.__karbalaOrigText;
        node.__karbalaLastLang = 'en';
      }
      translateInputPlaceholders(rootEl, 'en', {}, {}, null);
      drainObserverRecords();
      if (showToast) showLanguageStatusToast('✓ Language: English', true);
      return;
    }

    const dict = CORE_UI_DICTIONARY[lang] || {};
    const langCache = memoryCache[lang] || (memoryCache[lang] = {});

    const pendingNodesByText = new Map();
    const pendingPlaceholderElsByText = new Map();

    for (const node of textNodes) {
      const origTrimmed = (node.__karbalaOrigText || '').trim();
      if (!shouldTranslateString(origTrimmed)) continue;

      if (dict[origTrimmed]) {
        applyTranslationToNode(node, dict[origTrimmed]);
      } else if (langCache[origTrimmed] && langCache[origTrimmed] !== origTrimmed) {
        applyTranslationToNode(node, langCache[origTrimmed]);
      } else {
        if (!pendingNodesByText.has(origTrimmed)) {
          pendingNodesByText.set(origTrimmed, []);
        }
        pendingNodesByText.get(origTrimmed).push(node);
      }
    }

    translateInputPlaceholders(rootEl, lang, dict, langCache, pendingPlaceholderElsByText);
    for (const [origStr] of pendingPlaceholderElsByText.entries()) {
      if (!pendingNodesByText.has(origStr)) {
        pendingNodesByText.set(origStr, []);
      }
    }

    drainObserverRecords();

    const uniquePendingStrings = Array.from(pendingNodesByText.keys());
    if (uniquePendingStrings.length === 0) {
      if (showToast) showLanguageStatusToast(`✓ ${LANG_LABELS[lang] || lang.toUpperCase()}`, true);
      return;
    }

    if (showToast) {
      showLanguageStatusToast(`Translating to ${LANG_LABELS[lang] || lang.toUpperCase()}...`, false);
    }

    // Batch translate in chunks of 24 strings
    const BATCH_SIZE = 24;
    for (let i = 0; i < uniquePendingStrings.length; i += BATCH_SIZE) {
      if (activeLanguage !== lang || currentRunId !== runId) return;
      const batch = uniquePendingStrings.slice(i, i + BATCH_SIZE);
      try {
        const res = await fetch('/api/translator/translate-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texts: batch, targetLang: lang })
        });
        if (!res.ok) continue;
        const data = await res.json();
        if (activeLanguage !== lang || currentRunId !== runId) return;

        if (data.status === 'success' && Array.isArray(data.translations)) {
          for (let j = 0; j < batch.length; j++) {
            const srcStr = batch[j];
            const trStr = (data.translations[j] || '').trim();
            const wasTranslated = data.translatedFlags ? data.translatedFlags[j] : Boolean(trStr && trStr !== srcStr);

            if (trStr && (wasTranslated || trStr !== srcStr)) {
              if (trStr !== srcStr) {
                langCache[srcStr] = trStr;
              }
              const targetNodes = pendingNodesByText.get(srcStr) || [];
              for (const n of targetNodes) {
                applyTranslationToNode(n, trStr);
              }
              const targetInputs = pendingPlaceholderElsByText.get(srcStr) || [];
              for (const inp of targetInputs) {
                inp.setAttribute('placeholder', trStr);
              }
            }
          }
          drainObserverRecords();
          persistCache();
        }
      } catch (err) {
        drainObserverRecords();
      }
    }

    if (activeLanguage === lang && currentRunId === runId) {
      showLanguageStatusToast(`✓ ${LANG_LABELS[lang] || lang.toUpperCase()}`, true);
    }
  }

  window.applyKarbalaLanguage = function (langCode) {
    const valid = ['en', 'ur', 'hi', 'ar', 'fa', 'ur-roman'];
    const normalized = valid.includes((langCode || '').toLowerCase()) ? langCode.toLowerCase() : 'en';
    activeLanguage = normalized;

    // 1. Update localStorage preferences
    try {
      const prefs = JSON.parse(localStorage.getItem('karbala_pilgrim_prefs') || '{}');
      prefs.language = normalized;
      localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify(prefs));
    } catch (e) {}

    // 2. Update document lang attribute
    document.documentElement.setAttribute('lang', normalized === 'ur-roman' ? 'ur' : normalized);
    document.documentElement.setAttribute('data-karbala-lang', normalized);

    // 3. Dispatch global event so React components sync state
    window.dispatchEvent(new CustomEvent('karbala-language-change', { detail: { language: normalized } }));

    // 4. Translate DOM with visual toast feedback
    translatePageDom(normalized, true);
  };

  // Observe DOM changes (when user switches tabs/modals in React) and translate new nodes if activeLanguage !== 'en'
  function initDomObserver() {
    const rootEl = document.getElementById('root');
    if (!rootEl) {
      setTimeout(initDomObserver, 200);
      return;
    }

    // Load saved language on startup & re-run once React finishes mounting
    try {
      const prefs = JSON.parse(localStorage.getItem('karbala_pilgrim_prefs') || '{}');
      if (prefs.language && prefs.language !== 'en') {
        activeLanguage = prefs.language.toLowerCase();
        document.documentElement.setAttribute('lang', activeLanguage === 'ur-roman' ? 'ur' : activeLanguage);
        document.documentElement.setAttribute('data-karbala-lang', activeLanguage);
        setTimeout(() => translatePageDom(activeLanguage, false), 600);
        setTimeout(() => translatePageDom(activeLanguage, false), 1800);
      }
    } catch (e) {}

    domObserver = new MutationObserver((mutations) => {
      if (activeLanguage === 'en') return;
      // Only trigger if elements or text nodes were added/changed outside our own writes
      let hasRelevantChange = false;
      for (const m of mutations) {
        if (m.type === 'childList' && (m.addedNodes.length > 0)) {
          hasRelevantChange = true;
          break;
        }
        if (m.type === 'characterData') {
          const tNode = m.target;
          if (tNode && tNode.nodeValue !== tNode.__karbalaAppliedText) {
            hasRelevantChange = true;
            break;
          }
        }
      }
      if (!hasRelevantChange) return;

      if (observerTimer) clearTimeout(observerTimer);
      observerTimer = setTimeout(() => {
        translatePageDom(activeLanguage, false);
      }, 240);
    });

    domObserver.observe(rootEl, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDomObserver);
  } else {
    initDomObserver();
  }
})();
