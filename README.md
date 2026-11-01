# Karbala Digital Twin — 61 AH & Present Day

An immersive, interactive digital twin and educational museum connecting Present-Day Karbala with historical Karbala in 61 AH.

---

## 📁 Project Architecture

```
karbala-digital-twin/
├── client/                     # Frontend Application
│   ├── assets/                 # Static media repository
│   │   ├── images/             # 361 Full HD images (Shrines, Muharram, Azadari, AI scenes)
│   │   └── images_catalog.json # Metadata catalog (resolutions, categories, sources)
│   ├── css/
│   │   └── styles.css          # Bespoke theme, animations, dark mode, gallery cards
│   ├── js/
│   │   ├── react-app.js        # React 18 SPA root component & state orchestrator
│   │   ├── app.js              # Vanilla orchestrator
│   │   ├── data/               # Curated historical datasets
│   │   │   ├── locations.js    # Present-day & 61 AH geographical points of interest
│   │   │   ├── timeline.js     # Muharram 2–10 dates & Ashura 6-phase accounts
│   │   │   ├── personalities.js# 12 historical figures & biographies
│   │   │   └── certainty_explanations.js # Historiographical source documentation
│   │   ├── map/
│   │   │   └── interactive_map.js # Dual-layer HTML5 Canvas 2D engine with split lens
│   │   └── audio/
│   │       └── soundscapes.js  # Web Audio API ambient desert wind & Ziyarat player
│   ├── vendor/                 # Local vendor libraries
│   │   ├── bootstrap.min.css
│   │   ├── bootstrap.bundle.min.js
│   │   ├── bootstrap-icons.min.css
│   │   ├── react.production.min.js
│   │   ├── react-dom.production.min.js
│   │   └── babel.min.js
│   └── index.html              # Frontend entry point
│
├── server/                     # Backend MVC Architecture
│   ├── config/
│   │   └── db.js               # MongoDB connection with in-memory fallback
│   ├── models/                 # Mongoose Data Models
│   │   ├── Bookmark.js         # Saved locations schema
│   │   ├── Reflection.js       # Visitor reflections schema
│   │   ├── PilgrimageStatistics.js           # Module H: Annual attendance schema
│   │   ├── CountryPilgrimStatistics.js       # Module H: Country demographics schema
│   │   ├── PilgrimageEvents.js               # Module H: Pilgrimage event definitions
│   │   ├── StatisticalSources.js             # Module H: Sovereign source registry
│   │   ├── AttendanceMethodologies.js        # Module H: Camera sensors & methodologies
│   │   └── StatisticsVerificationHistory.js  # Module H: Editorial audit trail
│   ├── controllers/            # Request handlers
│   │   ├── pilgrimageStatsController.js      # Module H: Statistical intelligence APIs
│   │   ├── aiAssistantController.js          # Ask Karbala AI 3.0 (with stats integration)
│   │   ├── pilgrimServicesController.js
│   │   ├── landmarkController.js
│   │   ├── encyclopediaController.js
│   │   └── ...
│   └── routes/
│       └── apiRoutes.js        # REST API endpoints (/api/*)
│
├── client/
│   └── js/components/
│       └── GlobalZaireenStatisticsHub.js     # Module H: Interactive Analytics & Map Dashboard
│
├── server.js                   # Node.js Express server entry point
├── package.json                # Project dependencies & scripts
└── README.md                   # Documentation
```

---

## 📊 Module H — Global Karbala Zaireen Statistics & Pilgrimage Intelligence

An empirical, historically accurate, data-driven pilgrimage intelligence platform integrating:
- **Historical Attendance Database**: Documented records from 2003 through 2026 with Hijri dates, domestic/international splits, and strict separation between single-event Arbaeen metrics and cumulative annual totals.
- **Country-Wise Zaireen Statistics**: Verified arrivals across 16+ sovereign nations (Iraq, Iran, Pakistan, India, Afghanistan, Azerbaijan, Bahrain, Saudi Arabia, Kuwait, Lebanon, Turkey, UAE, UK, US, Canada, Bangladesh) with measurement types and source citations.
- **Interactive Global Pilgrimage Map**: Leaflet-powered dark luxury map with trajectory flow arcs toward Karbala.
- **Arbaeen Intelligence**: Technical documentation of the Al-Abbas Holy Shrine 5-axis automated optical camera counting array and border crossing passport tallies.
- **Ask Karbala AI 3.0 Integration**: Answering natural-language inquiries with certified citations and zero data fabrication.
- **Research Export Center**: UTF-8 CSV exports and printable statistical briefs.

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start the server
node server.js
```

Open `http://localhost:3000` in your web browser.

---

## 🛠️ Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5, React 18, HTML5 Canvas 2D, Web Audio API
- **Backend**: Node.js, Express.js (MVC)
- **Database**: MongoDB (Mongoose) with automatic in-memory fallback cache
