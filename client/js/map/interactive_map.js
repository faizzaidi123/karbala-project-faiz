/**
 * Karbala Digital Twin — Master Cartographic Engine
 * World-Class Museum-Grade Dual-Epoch Geographic Canvas
 * Present-Day Sanctuaries & 61 AH Historical Reconstruction
 *
 * Implements:
 * - High-Precision Canvas 2D + Procedural Micro-Topography
 * - Cinematic Dual-Epoch Time-Travel Camera Transition with Chronological Watermark
 * - Kinetic Camera System with Velocity Tracking, Inertia, and Damped Glide
 * - Physical Terrain Shading & Directional Sunlight (10 Muharram Dawn Angle)
 * - Multi-Layered Meandering Nahr al-Alqami with Fluid Vectors & Specular Glints
 * - Botanical Palm Groves (Nakhl al-Taff) with Shadow Deposition & Canopy Layers
 * - Encampment of Imam Hussain (Khaymagah) with Crescent Defensive Trench & Embers
 * - Classical Historiographical Uncertainty Plaques & Fluvial Migration Labels
 * - Archival Brass Survey Pins with Illuminated Arabic Calligraphy & Target Beacons
 * - Antique Brass Compass Rose & Dynamic Zoom-Calibrated Scale Bar
 */

export class KarbalaMap {
  constructor(canvasContainer, options = {}) {
    this.container = canvasContainer;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'w-full h-full block cursor-grab active:cursor-grabbing select-none';
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '2';
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    // Dual-Epoch Mode: 'present' | 'historical_61ah'
    this.mode = 'present';
    this.thenNowMode = false;
    this.splitPosition = 50;

    // Viewport camera state (normalized space: 0 to 100)
    this.viewport = {
      centerX: 50,
      centerY: 50,
      zoom: 1.25,
      minZoom: 0.7,
      maxZoom: 3.5
    };

    // Camera Physics & Kinetic Momentum
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.92;
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.lastDragTime = 0;
    this.isDecelerating = false;

    // Time-Travel Transition State
    this.isTransitioning = false;
    this.transitionProgress = 1.0;
    this.transitionDuration = 900;
    this.transitionStartTime = 0;
    this.transitionFromMode = 'present';
    this.transitionToMode = 'present';

    // Animation & Fluid Dynamics
    this.animationFrame = null;
    this.pulsePhase = 0;
    this.waterPhase = 0;
    this.sandDriftPhase = 0;

    // Datasets
    this.locationsPresent = [];
    this.locationsHistorical = [];
    this.selectedLocation = null;
    this.highlightedLocation = null;
    this.hoveredLocation = null;
    this.searchQuery = '';
    this.categoryFilter = 'all';

    // Feature 5: 61 AH Historical Time Slider State
    this.historicalSliderStage = null;
    this.progressiveRoutePoints = [];
    this.fullRoutePoints = [];
    this.showFullHistoricalRoute = false;
    this.showHistoricalSourceLayer = false;

    // Touch gesture tracking
    this.lastTouchDist = 0;

    // Reduced motion preference
    this.prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Callbacks
    this.onLocationSelect = options.onLocationSelect || (() => {});
    this.onViewHistorical = options.onViewHistorical || (() => {});

    this.initEventListeners();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.startRenderLoop();
  }

  /* ---------------- DATA & LIFECYCLE ---------------- */
  setData(presentLocations, historicalLocations) {
    this.locationsPresent = presentLocations || [];
    this.locationsHistorical = historicalLocations || [];
    this.requestRender();
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for optimal 60 FPS
    this.canvas.width = Math.round(rect.width * dpr);
    this.canvas.height = Math.round(rect.height * dpr);
    this.width = rect.width;
    this.height = rect.height;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.requestRender();
  }

  /* ---------------- DUAL-EPOCH MODE TRANSITIONS ---------------- */
  setMode(newMode) {
    const targetMode = newMode === '61ah' ? 'historical_61ah' : newMode;
    if (this.mode === targetMode && !this.isTransitioning) return;

    this.transitionFromMode = this.mode;
    this.transitionToMode = targetMode;
    this.mode = targetMode;

    if (this.prefersReducedMotion) {
      this.isTransitioning = false;
      this.transitionProgress = 1.0;
      this.requestRender();
      return;
    }

    this.isTransitioning = true;
    this.transitionStartTime = performance.now();
    this.transitionProgress = 0;
  }

  toggleThenNowLens(enable) {
    this.thenNowMode = enable !== undefined ? enable : !this.thenNowMode;
    this.requestRender();
  }

  setSplitPosition(percent) {
    this.splitPosition = Math.max(5, Math.min(95, percent));
    this.requestRender();
  }

  /* ---------------- FEATURE 5: 61 AH HISTORICAL MAP TIME SLIDER ---------------- */
  setHistoricalTimelineStage(stageObj, progressivePoints = [], fullPoints = [], showFullRoute = false, showSourceLayer = false) {
    this.historicalSliderStage = stageObj || null;
    this.progressiveRoutePoints = Array.isArray(progressivePoints) ? progressivePoints : [];
    this.fullRoutePoints = Array.isArray(fullPoints) ? fullPoints : [];
    this.showFullHistoricalRoute = Boolean(showFullRoute);
    this.showHistoricalSourceLayer = Boolean(showSourceLayer);

    if (stageObj && stageObj.camera) {
      this.panTo(stageObj.camera.centerX || 45, stageObj.camera.centerY || 55, stageObj.camera.zoom || 1.35, 550);
    } else {
      this.requestRender();
    }
  }

  /* ---------------- ADVANCED CAMERA SYSTEM & INERTIA ---------------- */
  zoomIn() {
    this.panTo(this.viewport.centerX, this.viewport.centerY, Math.min(this.viewport.maxZoom, this.viewport.zoom * 1.3), 350);
  }

  zoomOut() {
    this.panTo(this.viewport.centerX, this.viewport.centerY, Math.max(this.viewport.minZoom, this.viewport.zoom / 1.3), 350);
  }

  resetView() {
    this.panTo(50, 50, 1.0, 600);
  }

  setZoom(zoomVal) {
    this.viewport.zoom = Math.max(this.viewport.minZoom, Math.min(this.viewport.maxZoom, zoomVal));
    this.requestRender();
  }

  panTo(normX, normY, targetZoom = null, duration = 600) {
    if (this.prefersReducedMotion || duration === 0) {
      this.viewport.centerX = Math.max(10, Math.min(90, normX));
      this.viewport.centerY = Math.max(10, Math.min(90, normY));
      if (targetZoom !== null) this.viewport.zoom = targetZoom;
      this.velocity = { x: 0, y: 0 };
      this.requestRender();
      return;
    }

    const startX = this.viewport.centerX;
    const startY = this.viewport.centerY;
    const startZ = this.viewport.zoom;
    const endZ = targetZoom !== null ? targetZoom : this.viewport.zoom;
    const startTime = performance.now();

    const animatePan = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Quintic ease out for silky cinematic camera glide
      const ease = 1 - Math.pow(1 - t, 4);

      this.viewport.centerX = startX + (normX - startX) * ease;
      this.viewport.centerY = startY + (normY - startY) * ease;
      this.viewport.zoom = startZ + (endZ - startZ) * ease;

      // Clamp
      this.viewport.centerX = Math.max(10, Math.min(90, this.viewport.centerX));
      this.viewport.centerY = Math.max(10, Math.min(90, this.viewport.centerY));

      this.requestRender();
      if (t < 1) {
        requestAnimationFrame(animatePan);
      } else {
        this.velocity = { x: 0, y: 0 };
      }
    };
    requestAnimationFrame(animatePan);
  }

  highlightLocation(locId) {
    let loc = this.locationsPresent.find(l => l.id === locId);
    if (!loc) {
      loc = this.locationsHistorical.find(l => l.id === locId);
    }
    this.highlightedLocation = loc;
    if (loc && loc.coords) {
      this.panTo(loc.coords.x, loc.coords.y, Math.max(1.45, this.viewport.zoom), 550);
    }
    this.requestRender();
  }

  clearHighlight() {
    this.highlightedLocation = null;
    this.requestRender();
  }

  /* ---------------- CURATORIAL GUIDED JOURNEY ---------------- */
  startGuidedJourney(onStepCallback = null) {
    this.stopGuidedJourney();
    this.isTourActive = true;
    this.tourStepIndex = 0;
    this.onTourStep = onStepCallback;

    const tourWaypoints = [
      { id: 'shrine_hussain', x: 44.5, y: 55.5, zoom: 1.65, title: 'Holy Sanctuary of Imam Hussain (AS)', period: 'Grave of the Martyrdom & Central Sanctuary', dur: 4500 },
      { id: 'bayn_al_haramayn', x: 51.0, y: 47.0, zoom: 1.75, title: 'Bayn al-Haramayn Ceremonial Esplanade', period: '378m Marble Esplanade between the Sanctuaries', dur: 4000 },
      { id: 'shrine_abbas', x: 57.5, y: 38.5, zoom: 1.65, title: 'Holy Sanctuary of Al-Abbas (AS)', period: 'Babu\'l Hawaij & the Alqami Oasis Approach', dur: 4500 },
      { id: 'tall_zaynabiyya', x: 40.5, y: 57.0, zoom: 1.70, title: 'Tall al-Zaynabiyya (Zaynab Hillock)', period: 'Elevated Knoll overlooking the Battlefield', dur: 4200 },
      { id: 'al_mukhayam', x: 33.0, y: 68.0, zoom: 1.65, title: 'Al-Mukhayam al-Husayni (The Encampment)', period: 'Historical Camp of the Holy Household & Trenches', dur: 4500 },
      { id: 'nahr_alqami', x: 72.0, y: 30.0, zoom: 1.45, title: 'Nahr al-Alqami (Ancient Euphrates Canal)', period: 'Historic Palm Groves & Epistemic Fluvial Course', dur: 4200 },
      { id: 'overview', x: 50.0, y: 50.0, zoom: 1.05, title: 'Karbala Basin Complete Overview', period: 'Dual-Epoch Sanctuary & Battlefield Geography', dur: 3800 }
    ];

    const runStep = () => {
      if (!this.isTourActive) return;
      const wp = tourWaypoints[this.tourStepIndex];
      this.highlightLocation(wp.id);
      this.panTo(wp.x, wp.y, wp.zoom, 1400);

      if (this.onTourStep) {
        this.onTourStep({
          index: this.tourStepIndex,
          total: tourWaypoints.length,
          ...wp
        });
      }

      this.tourTimer = setTimeout(() => {
        if (!this.isTourActive) return;
        this.tourStepIndex = (this.tourStepIndex + 1) % tourWaypoints.length;
        runStep();
      }, wp.dur);
    };

    runStep();
  }

  stopGuidedJourney() {
    this.isTourActive = false;
    if (this.tourTimer) {
      clearTimeout(this.tourTimer);
      this.tourTimer = null;
    }
    if (this.onTourStep) {
      this.onTourStep(null);
    }
  }

  /* ---------------- COORDINATE SYSTEM TRANSFORMATIONS ---------------- */
  normToScreen(normX, normY) {
    const scale = Math.min(this.width, this.height) * this.viewport.zoom;
    const screenCenterX = this.width / 2;
    const screenCenterY = this.height / 2;

    const x = screenCenterX + (normX - this.viewport.centerX) * (scale / 100);
    const y = screenCenterY + (normY - this.viewport.centerY) * (scale / 100);
    return { x, y };
  }

  screenToNorm(screenX, screenY) {
    const scale = Math.min(this.width, this.height) * this.viewport.zoom;
    const screenCenterX = this.width / 2;
    const screenCenterY = this.height / 2;

    const normX = this.viewport.centerX + (screenX - screenCenterX) / (scale / 100);
    const normY = this.viewport.centerY + (screenY - screenCenterY) / (scale / 100);
    return { x: normX, y: normY };
  }

  /* ---------------- EVENT HANDLING & TACTILE PHYSICS ---------------- */
  initEventListeners() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.isDecelerating = false;
      this.dragStart = { x: e.clientX, y: e.clientY };
      this.lastDragTime = performance.now();
      this.velocity = { x: 0, y: 0 };
    });

    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (this.isDragging) {
        const now = performance.now();
        const dt = Math.max(1, now - this.lastDragTime);
        const dx = e.clientX - this.dragStart.x;
        const dy = e.clientY - this.dragStart.y;

        this.velocity = {
          x: (dx / dt) * 16,
          y: (dy / dt) * 16
        };

        this.dragStart = { x: e.clientX, y: e.clientY };
        this.lastDragTime = now;

        const scale = Math.min(this.width, this.height) * this.viewport.zoom;
        this.viewport.centerX -= (dx / scale) * 100;
        this.viewport.centerY -= (dy / scale) * 100;

        this.viewport.centerX = Math.max(10, Math.min(90, this.viewport.centerX));
        this.viewport.centerY = Math.max(10, Math.min(90, this.viewport.centerY));
        this.requestRender();
      } else {
        this.checkHover(mouseX, mouseY);
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        // Check if velocity merits kinetic inertia coasting
        if (Math.hypot(this.velocity.x, this.velocity.y) > 1.5) {
          this.isDecelerating = true;
        }
      }
    });

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      this.checkClick(mouseX, mouseY);
    });

    // Natural logarithmic wheel zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
      this.setZoom(this.viewport.zoom * zoomFactor);
    }, { passive: false });

    // Touch gesture navigation (Mobile / Tablet)
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.isDecelerating = false;
        this.dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        this.lastDragTime = performance.now();
        this.velocity = { x: 0, y: 0 };
      } else if (e.touches.length === 2) {
        this.isDragging = false;
        this.lastTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && this.isDragging) {
        const now = performance.now();
        const dt = Math.max(1, now - this.lastDragTime);
        const dx = e.touches[0].clientX - this.dragStart.x;
        const dy = e.touches[0].clientY - this.dragStart.y;

        this.velocity = {
          x: (dx / dt) * 16,
          y: (dy / dt) * 16
        };

        this.dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        this.lastDragTime = now;

        const scale = Math.min(this.width, this.height) * this.viewport.zoom;
        this.viewport.centerX -= (dx / scale) * 100;
        this.viewport.centerY -= (dy / scale) * 100;

        this.viewport.centerX = Math.max(10, Math.min(90, this.viewport.centerX));
        this.viewport.centerY = Math.max(10, Math.min(90, this.viewport.centerY));
        this.requestRender();
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (this.lastTouchDist > 0) {
          const factor = dist / this.lastTouchDist;
          this.setZoom(this.viewport.zoom * factor);
        }
        this.lastTouchDist = dist;
      }
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        if (this.isDragging && Math.hypot(this.velocity.x, this.velocity.y) > 1.5) {
          this.isDecelerating = true;
        }
        this.isDragging = false;
        this.lastTouchDist = 0;
      }
    });
  }

  checkHover(mouseX, mouseY) {
    const locations = this.mode === 'present' ? this.locationsPresent : this.locationsHistorical;
    let found = null;

    for (let loc of locations) {
      if (!loc.coords) continue;
      const pos = this.normToScreen(loc.coords.x, loc.coords.y);
      const hitRadius = 26;
      const dist = Math.hypot(mouseX - pos.x, mouseY - pos.y);
      if (dist <= hitRadius) {
        found = loc;
        break;
      }
    }

    if (this.hoveredLocation !== found) {
      this.hoveredLocation = found;
      this.canvas.style.cursor = found ? 'pointer' : (this.isDragging ? 'grabbing' : 'grab');
      this.requestRender();
    }
  }

  checkClick(mouseX, mouseY) {
    const locations = this.mode === 'present' ? this.locationsPresent : this.locationsHistorical;
    for (let loc of locations) {
      if (!loc.coords) continue;
      const pos = this.normToScreen(loc.coords.x, loc.coords.y);
      const hitRadius = 28;
      const dist = Math.hypot(mouseX - pos.x, mouseY - pos.y);
      if (dist <= hitRadius) {
        this.selectedLocation = loc;
        this.onLocationSelect(loc);
        this.panTo(loc.coords.x, loc.coords.y, Math.max(1.45, this.viewport.zoom), 500);
        this.requestRender();
        return;
      }
    }
  }

  /* ---------------- ANIMATION & 60 FPS RENDER LOOP ---------------- */
  startRenderLoop() {
    const render = (time) => {
      // Periodic phase ticks
      this.pulsePhase = (this.pulsePhase + 0.038) % (Math.PI * 2);
      this.waterPhase = (this.waterPhase + 0.025) % (Math.PI * 2);
      this.sandDriftPhase = (this.sandDriftPhase + 0.015) % (Math.PI * 2);

      // Kinetic Camera Inertia Damping
      if (this.isDecelerating && !this.isDragging) {
        const scale = Math.min(this.width, this.height) * this.viewport.zoom;
        this.viewport.centerX -= (this.velocity.x / scale) * 100;
        this.viewport.centerY -= (this.velocity.y / scale) * 100;

        this.viewport.centerX = Math.max(10, Math.min(90, this.viewport.centerX));
        this.viewport.centerY = Math.max(10, Math.min(90, this.viewport.centerY));

        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;

        if (Math.hypot(this.velocity.x, this.velocity.y) < 0.08) {
          this.isDecelerating = false;
          this.velocity = { x: 0, y: 0 };
        }
      }

      // Time-Travel Transition Interpolation
      if (this.isTransitioning) {
        const elapsed = time - this.transitionStartTime;
        this.transitionProgress = Math.min(1.0, elapsed / this.transitionDuration);
        if (this.transitionProgress >= 1.0) {
          this.isTransitioning = false;
        }
      }

      this.draw();
      this.animationFrame = requestAnimationFrame(render);
    };
    this.animationFrame = requestAnimationFrame(render);
  }

  requestRender() {
    // Render continuous in requestAnimationFrame
  }

  /* ---------------- MASTER DRAW DISPATCHER ---------------- */
  draw() {
    if (!this.ctx || !this.width || !this.height) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    if (this.thenNowMode) {
      this.drawSplitLensMode(ctx);
    } else if (this.isTransitioning) {
      this.drawTimeTravelTransition(ctx);
    } else {
      if (this.mode === 'present') {
        this.drawPresentDayMap(ctx);
        this.drawLocations(ctx, this.locationsPresent, true);
      } else {
        this.drawHistoricalMap(ctx);
        this.drawLocations(ctx, this.locationsHistorical, false);
      }
    }

    // Target beacon pulse on highlighted site
    if (this.highlightedLocation && this.highlightedLocation.coords) {
      this.drawTargetPulse(ctx, this.highlightedLocation.coords);
    }

    // Archival Brass Instruments (Compass Rose & Dynamic Scale Bar)
    this.drawCompassRose(ctx);
    this.drawScaleBar(ctx);
  }

  /* ---------------- SIGNATURE TIME-TRAVEL TRANSITION RENDERING ---------------- */
  drawTimeTravelTransition(ctx) {
    const t = this.transitionProgress;
    // Cubic ease-in-out
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const fromIsPresent = this.transitionFromMode === 'present';
    const presentAlpha = fromIsPresent ? 1 - ease : ease;
    const historicalAlpha = fromIsPresent ? ease : 1 - ease;

    // 1. Draw Under-Layer (Historical)
    ctx.save();
    ctx.globalAlpha = historicalAlpha;
    this.drawHistoricalMap(ctx);
    this.drawLocations(ctx, this.locationsHistorical, false);
    ctx.restore();

    // 2. Draw Over-Layer (Present Day)
    ctx.save();
    ctx.globalAlpha = presentAlpha;
    this.drawPresentDayMap(ctx);
    this.drawLocations(ctx, this.locationsPresent, true);
    ctx.restore();

    // 3. Atmospheric Chronological Mist & Golden Haze
    const hazeOpacity = Math.sin(t * Math.PI) * 0.45;
    if (hazeOpacity > 0.01) {
      ctx.save();
      const hazeGrad = ctx.createRadialGradient(
        this.width / 2, this.height / 2, 50,
        this.width / 2, this.height / 2, Math.max(this.width, this.height) * 0.7
      );
      hazeGrad.addColorStop(0, `rgba(198, 166, 107, ${hazeOpacity * 0.6})`);
      hazeGrad.addColorStop(0.5, `rgba(16, 59, 50, ${hazeOpacity * 0.3})`);
      hazeGrad.addColorStop(1, `rgba(8, 11, 11, ${hazeOpacity * 0.9})`);
      ctx.fillStyle = hazeGrad;
      ctx.fillRect(0, 0, this.width, this.height);

      // Temporal Chronometer Typography Banner
      const eraLabel = fromIsPresent ? '1446 AH ➔ 61 AH' : '61 AH ➔ PRESENT DAY';
      const subtitle = fromIsPresent ? '1,385 YEARS CHRONOLOGICAL TRANSIT • AL-TAFF DESERT RECONSTRUCTION' : 'TRANSIT TO MODERN SANCTUARIES & CEREMONIAL ESPLANADE';

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Year badge
      ctx.font = '700 22px Cinzel, serif';
      ctx.fillStyle = `rgba(245, 240, 230, ${Math.min(1, hazeOpacity * 2.2)})`;
      ctx.letterSpacing = '0.12em';
      ctx.fillText(eraLabel, this.width / 2, this.height / 2 - 16);

      // Monograph subtitle
      ctx.font = '500 11px Outfit, sans-serif';
      ctx.fillStyle = `rgba(198, 166, 107, ${Math.min(1, hazeOpacity * 2.5)})`;
      ctx.letterSpacing = '0.08em';
      ctx.fillText(subtitle, this.width / 2, this.height / 2 + 14);

      ctx.restore();
    }
  }

  /* ---------------- THEN ↔ NOW SPLIT LENS RENDERING ---------------- */
  drawSplitLensMode(ctx) {
    const splitX = (this.splitPosition / 100) * this.width;

    // 1. Draw Present Day on Left
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, splitX, this.height);
    ctx.clip();
    this.drawPresentDayMap(ctx);
    this.drawLocations(ctx, this.locationsPresent, true);
    ctx.restore();

    // 2. Draw 61 AH on Right
    ctx.save();
    ctx.beginPath();
    ctx.rect(splitX, 0, this.width - splitX, this.height);
    ctx.clip();
    this.drawHistoricalMap(ctx);
    this.drawLocations(ctx, this.locationsHistorical, false);
    ctx.restore();

    // 3. Draw Split Line Divider
    this.drawSplitDivider(ctx, splitX);
  }

  /* =========================================================================
     PRESENT-DAY KARBALA MAP: ARCHITECTURAL FOOTPRINTS & URBAN TOPOGRAPHY
     ========================================================================= */
  drawPresentDayMap(ctx) {
    // 1. Basalt Deep Obsidian Ground Surface with ambient radial light
    const bgGrad = ctx.createRadialGradient(
      this.width / 2, this.height / 2, 80,
      this.width / 2, this.height / 2, Math.max(this.width, this.height) * 0.95
    );
    bgGrad.addColorStop(0, '#151c1b');
    bgGrad.addColorStop(0.5, '#0e1313');
    bgGrad.addColorStop(1, '#070a0a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Authentic Street Network of Modern Karbala
    this.drawModernUrbanGrid(ctx);

    // 3. Ceremonial Marble Esplanade (Bayn al-Haramayn)
    this.drawBainAlHaramayn(ctx);

    // 4. Holy Shrine of Imam Hussain (Courtyard, Portals, Golden Dome, Minarets)
    this.drawHolyShrineHussain(ctx);

    // 5. Holy Shrine of Al-Abbas (Courtyard, Portals, Dome, Minarets)
    this.drawHolyShrineAbbas(ctx);

    // 6. Al-Mukhayam Complex & Elevated Tall al-Zaynabiyya
    this.drawPresentDaySanctuaries(ctx);
  }

  drawModernUrbanGrid(ctx) {
    const scale = Math.min(this.width, this.height) * this.viewport.zoom;
    ctx.save();
    ctx.strokeStyle = 'rgba(198, 166, 107, 0.12)';
    ctx.lineWidth = 1;

    const center = this.normToScreen(50, 50);

    // Concentric Ring Roadways (Shari' Bab Baghdad, Shari' al-Qibla, Shari' al-Jumhuriyya)
    const ring1 = scale * 0.42;
    const ring2 = scale * 0.72;
    const ring3 = scale * 1.05;

    ctx.beginPath();
    ctx.arc(center.x, center.y, ring1, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center.x, center.y, ring2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(198, 166, 107, 0.07)';
    ctx.beginPath();
    ctx.arc(center.x, center.y, ring3, 0, Math.PI * 2);
    ctx.stroke();

    // Radial Avenues connecting the Old City Portals
    const radialAngles = [15, 60, 105, 150, 195, 240, 285, 330];
    ctx.strokeStyle = 'rgba(198, 166, 107, 0.1)';
    radialAngles.forEach(deg => {
      const rad = (deg * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(center.x + Math.cos(rad) * ring1 * 0.9, center.y + Math.sin(rad) * ring1 * 0.9);
      ctx.lineTo(center.x + Math.cos(rad) * ring3, center.y + Math.sin(rad) * ring3);
      ctx.stroke();
    });

    ctx.restore();
  }

  drawBainAlHaramayn(ctx) {
    const p1 = this.normToScreen(44.5, 55.5); // Hussain Shrine eastern portal
    const p2 = this.normToScreen(57.5, 38.5); // Abbas Shrine western portal

    ctx.save();
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const angle = Math.atan2(dy, dx);
    const halfWidth = 34 * this.viewport.zoom;

    const perpX = Math.cos(angle + Math.PI / 2) * halfWidth;
    const perpY = Math.sin(angle + Math.PI / 2) * halfWidth;

    // Paved Greek Thassos White Marble Esplanade
    ctx.beginPath();
    ctx.moveTo(p1.x - perpX, p1.y - perpY);
    ctx.lineTo(p2.x - perpX, p2.y - perpY);
    ctx.lineTo(p2.x + perpX, p2.y + perpY);
    ctx.lineTo(p1.x + perpX, p1.y + perpY);
    ctx.closePath();

    const marbleGrad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
    marbleGrad.addColorStop(0, 'rgba(245, 240, 230, 0.16)');
    marbleGrad.addColorStop(0.5, 'rgba(255, 250, 240, 0.26)');
    marbleGrad.addColorStop(1, 'rgba(245, 240, 230, 0.16)');
    ctx.fillStyle = marbleGrad;
    ctx.fill();

    // Delicate Antique Gold Perimeter Curbing
    ctx.strokeStyle = 'rgba(198, 166, 107, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Symmetrical Rows of Illuminated Modern Date Palms along Bayn al-Haramayn
    const numPalms = 8;
    for (let i = 1; i < numPalms; i++) {
      const frac = i / numPalms;
      const cx = p1.x + dx * frac;
      const cy = p1.y + dy * frac;

      const leftPalmX = cx - perpX * 0.72;
      const leftPalmY = cy - perpY * 0.72;
      const rightPalmX = cx + perpX * 0.72;
      const rightPalmY = cy + perpY * 0.72;

      // Left palm tree
      ctx.fillStyle = '#103B32';
      ctx.beginPath();
      ctx.arc(leftPalmX, leftPalmY, 4.5 * this.viewport.zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(198, 166, 107, 0.4)';
      ctx.stroke();

      // Right palm tree
      ctx.beginPath();
      ctx.arc(rightPalmX, rightPalmY, 4.5 * this.viewport.zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Calligraphic Esplanade Titling
    if (this.viewport.zoom > 0.85) {
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      ctx.save();
      ctx.translate(midX, midY);
      ctx.rotate(angle);

      ctx.fillStyle = 'rgba(230, 212, 173, 0.9)';
      ctx.font = '600 10.5px Cinzel, serif';
      ctx.letterSpacing = '0.08em';
      ctx.textAlign = 'center';
      ctx.fillText('BAYN AL-HARAMAYN (378m)', 0, -5);

      ctx.fillStyle = 'rgba(198, 166, 107, 0.75)';
      ctx.font = '10px Amiri, serif';
      ctx.fillText('ما بين الحرمين الشريفين', 0, 9);

      ctx.restore();
    }

    ctx.restore();
  }

  drawHolyShrineHussain(ctx) {
    const pos = this.normToScreen(44.5, 55.5);
    const size = 58 * this.viewport.zoom;

    ctx.save();

    // 1. Nocturnal Golden Light Aura (Radiance of the Holy Dome)
    const auraRad = (85 + Math.sin(this.pulsePhase) * 12) * this.viewport.zoom;
    const auraGrad = ctx.createRadialGradient(pos.x, pos.y, 6, pos.x, pos.y, auraRad);
    auraGrad.addColorStop(0, 'rgba(230, 212, 173, 0.42)');
    auraGrad.addColorStop(0.35, 'rgba(198, 166, 107, 0.22)');
    auraGrad.addColorStop(1, 'rgba(198, 166, 107, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, auraRad, 0, Math.PI * 2);
    ctx.fill();

    // 2. Grand Outer Sahn & Riwaq Footprint
    ctx.fillStyle = '#141918';
    ctx.strokeStyle = '#C6A66B';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(pos.x - size, pos.y - size * 0.9, size * 2, size * 1.8, 6);
    ctx.fill();
    ctx.stroke();

    // Inner Courtyard Basin
    ctx.fillStyle = 'rgba(16, 59, 50, 0.35)';
    ctx.strokeStyle = 'rgba(198, 166, 107, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size * 0.52, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 3. Central Golden Dome (Qubbah)
    const domeGrad = ctx.createRadialGradient(pos.x - 3, pos.y - 3, 2, pos.x, pos.y, 17 * this.viewport.zoom);
    domeGrad.addColorStop(0, '#FFF2D6');
    domeGrad.addColorStop(0.45, '#C6A66B');
    domeGrad.addColorStop(1, '#8A6A32');
    ctx.fillStyle = domeGrad;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 17 * this.viewport.zoom, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#5E4319';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Dome Crest Crescent (Hilal)
    ctx.fillStyle = '#FFF2D6';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 2.5 * this.viewport.zoom, 0, Math.PI * 2);
    ctx.fill();

    // 4. Two Grand Golden Minarets
    const minOffset = 25 * this.viewport.zoom;
    [-1, 1].forEach(side => {
      const mx = pos.x + side * minOffset;
      const my = pos.y - 14 * this.viewport.zoom;

      ctx.fillStyle = '#C6A66B';
      ctx.beginPath();
      ctx.arc(mx, my, 4.5 * this.viewport.zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFF2D6';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // 5. Bab al-Qibla Grand Portal (South)
    ctx.fillStyle = 'rgba(16, 59, 50, 0.9)';
    ctx.strokeStyle = '#C6A66B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(pos.x - 8 * this.viewport.zoom, pos.y + size * 0.9 - 4, 16 * this.viewport.zoom, 5, 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  drawHolyShrineAbbas(ctx) {
    const pos = this.normToScreen(57.5, 38.5);
    const size = 52 * this.viewport.zoom;

    ctx.save();

    // 1. Sapphire & Golden Radiance Aura
    const auraRad = (78 + Math.cos(this.pulsePhase) * 10) * this.viewport.zoom;
    const auraGrad = ctx.createRadialGradient(pos.x, pos.y, 6, pos.x, pos.y, auraRad);
    auraGrad.addColorStop(0, 'rgba(230, 212, 173, 0.38)');
    auraGrad.addColorStop(0.4, 'rgba(16, 59, 50, 0.25)');
    auraGrad.addColorStop(1, 'rgba(16, 59, 50, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, auraRad, 0, Math.PI * 2);
    ctx.fill();

    // 2. Outer Sahn & Riwaq
    ctx.fillStyle = '#141918';
    ctx.strokeStyle = '#C6A66B';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(pos.x - size, pos.y - size * 0.85, size * 2, size * 1.7, 6);
    ctx.fill();
    ctx.stroke();

    // Courtyard Area
    ctx.fillStyle = 'rgba(16, 59, 50, 0.25)';
    ctx.strokeStyle = 'rgba(198, 166, 107, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size * 0.48, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 3. Central Golden Dome of Al-Abbas (AS)
    const domeGrad = ctx.createRadialGradient(pos.x - 3, pos.y - 3, 2, pos.x, pos.y, 16 * this.viewport.zoom);
    domeGrad.addColorStop(0, '#FFF2D6');
    domeGrad.addColorStop(0.45, '#C6A66B');
    domeGrad.addColorStop(1, '#8A6A32');
    ctx.fillStyle = domeGrad;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 16 * this.viewport.zoom, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#5E4319';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Minarets
    const minOffset = 22 * this.viewport.zoom;
    [-1, 1].forEach(side => {
      const mx = pos.x + side * minOffset;
      const my = pos.y - 12 * this.viewport.zoom;

      ctx.fillStyle = '#C6A66B';
      ctx.beginPath();
      ctx.arc(mx, my, 4 * this.viewport.zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFF2D6';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    ctx.restore();
  }

  drawPresentDaySanctuaries(ctx) {
    const zoom = this.viewport.zoom;

    // Al-Mukhayam al-Husayni (Modern Tents Sanctuary)
    const muk = this.normToScreen(33.0, 68.0);
    ctx.save();
    ctx.fillStyle = '#141918';
    ctx.strokeStyle = '#103B32';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(muk.x - 18 * zoom, muk.y - 18 * zoom, 36 * zoom, 36 * zoom, 4);
    ctx.fill();
    ctx.stroke();

    // Decorative inner tent motif
    ctx.strokeStyle = 'rgba(198, 166, 107, 0.5)';
    ctx.beginPath();
    ctx.moveTo(muk.x - 10 * zoom, muk.y + 10 * zoom);
    ctx.lineTo(muk.x, muk.y - 10 * zoom);
    ctx.lineTo(muk.x + 10 * zoom, muk.y + 10 * zoom);
    ctx.stroke();
    ctx.restore();

    // Tall al-Zaynabiyya (Sanctuary Hillock)
    const tall = this.normToScreen(41.0, 53.0);
    ctx.save();
    ctx.fillStyle = 'rgba(198, 166, 107, 0.2)';
    ctx.strokeStyle = '#C6A66B';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(tall.x, tall.y, 13 * zoom, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  /* =========================================================================
     HISTORICAL KARBALA (61 AH): NATURAL TOPOGRAPHY, FLUVIAL CHANNELS & OASES
     ========================================================================= */
  drawHistoricalMap(ctx) {
    // 1. Weathered Vellum & Desert Sand Topographical Ground Surface
    const bgGrad = ctx.createRadialGradient(
      this.width / 2, this.height / 2, 60,
      this.width / 2, this.height / 2, Math.max(this.width, this.height) * 0.95
    );
    bgGrad.addColorStop(0, '#1c1611');
    bgGrad.addColorStop(0.55, '#130f0c');
    bgGrad.addColorStop(1, '#090706');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Micro-Topographical Dunes, Escarpments & Contours
    this.drawHistoricalTopography(ctx);

    // 3. Meandering Nahr al-Alqami with Wet Banks & Reeds
    this.drawHistoricalAlqamiRiver(ctx);

    // 4. Botanical Date Palm Groves (Nakhl al-Taff) with Layered Canopies
    this.drawHistoricalPalmGroves(ctx);

    // 5. Encampment of Imam Hussain (Khaymagah) & Crescent Fire Trench
    this.drawHistoricalEncampment(ctx);

    // 6. Umayyad Cavalry Command & Encirclement Lines
    this.drawHistoricalUmayyadArmy(ctx);

    // 7. Ma'rakah al-Taff (Central Engagement Zone)
    this.drawHistoricalBattlefield(ctx);

    // 8. Feature 5: Progressive 61 AH Caravan & Chronological Stage Route
    this.drawProgressiveCaravanRoute(ctx);
  }

  drawProgressiveCaravanRoute(ctx) {
    const ptsToDraw = this.showFullHistoricalRoute ? this.fullRoutePoints : this.progressiveRoutePoints;
    if (!ptsToDraw || ptsToDraw.length === 0) return;

    ctx.save();

    // If user enabled "Show Full Route", draw future route faintly first
    if (this.showFullHistoricalRoute && this.fullRoutePoints.length > 1) {
      ctx.beginPath();
      this.fullRoutePoints.forEach((pt, idx) => {
        const s = this.normToScreen(pt.x, pt.y);
        if (idx === 0) ctx.moveTo(s.x, s.y);
        else ctx.lineTo(s.x, s.y);
      });
      ctx.strokeStyle = 'rgba(198, 166, 107, 0.25)';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2 * this.viewport.zoom;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Progressive route traveled up to the selected 61 AH Time Slider stage
    if (this.progressiveRoutePoints.length > 1) {
      ctx.beginPath();
      this.progressiveRoutePoints.forEach((pt, idx) => {
        const s = this.normToScreen(pt.x, pt.y);
        if (idx === 0) ctx.moveTo(s.x, s.y);
        else ctx.lineTo(s.x, s.y);
      });
      ctx.strokeStyle = '#DFC08A';
      ctx.lineWidth = 3 * this.viewport.zoom;
      ctx.shadowColor = 'rgba(223, 192, 138, 0.65)';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Waypoint nodes along the progressive route
    this.progressiveRoutePoints.forEach((pt, idx) => {
      const s = this.normToScreen(pt.x, pt.y);
      const isCurrentStage = idx === this.progressiveRoutePoints.length - 1;

      ctx.beginPath();
      ctx.arc(s.x, s.y, (isCurrentStage ? 7 : 4) * this.viewport.zoom, 0, Math.PI * 2);
      ctx.fillStyle = isCurrentStage ? '#E53E3E' : '#C6A66B';
      ctx.fill();
      ctx.strokeStyle = '#FFF2D6';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (isCurrentStage && pt.label) {
        ctx.font = '600 11px Outfit, sans-serif';
        ctx.fillStyle = '#FFF2D6';
        ctx.textAlign = 'center';
        ctx.fillText(pt.label, s.x, s.y - 12 * this.viewport.zoom);
      }
    });

    // Source & Uncertainty Overlay Plaque when enabled
    if (this.historicalSliderStage && this.showHistoricalSourceLayer) {
      const st = this.historicalSliderStage;
      const focusPt = st.routePoint ? this.normToScreen(st.routePoint.x, st.routePoint.y) : { x: this.width / 2, y: this.height / 2 };
      ctx.fillStyle = 'rgba(10, 13, 16, 0.88)';
      ctx.strokeStyle = 'rgba(198, 166, 107, 0.65)';
      ctx.lineWidth = 1;
      const boxW = 270;
      const boxH = 54;
      const bx = Math.min(this.width - boxW - 12, Math.max(12, focusPt.x - boxW / 2));
      const by = Math.min(this.height - boxH - 12, Math.max(12, focusPt.y + 16));
      ctx.beginPath();
      ctx.roundRect(bx, by, boxW, boxH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.font = '700 10px Cinzel, serif';
      ctx.fillStyle = '#DFC08A';
      ctx.fillText(`GEOGRAPHY: ${st.geographyConfidence.replace(/_/g, ' ')}`, bx + 10, by + 18);
      ctx.font = '400 10px Outfit, sans-serif';
      ctx.fillStyle = '#E2E8F0';
      const srcLine = (st.primarySources && st.primarySources[0]) ? st.primarySources[0].slice(0, 42) : 'Tarikh al-Tabari / Kitab al-Irshad';
      ctx.fillText(`Source: ${srcLine}`, bx + 10, by + 36);
    }

    ctx.restore();
  }

  drawHistoricalTopography(ctx) {
    ctx.save();
    const scale = Math.min(this.width, this.height) * this.viewport.zoom;
    const center = this.normToScreen(48, 52);

    // 1. Alluvial Terrace Escarpment - Natural Topographical Contours
    ctx.strokeStyle = 'rgba(198, 166, 107, 0.14)';
    ctx.lineWidth = 1;
    for (let r = 0.28; r <= 1.45; r += 0.22) {
      ctx.beginPath();
      ctx.ellipse(center.x, center.y, scale * r * 1.3, scale * r * 0.82, Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 2. Natural Desert Dunes (Organic B-splines with Sunlit Crests & Soft Windward Shadows)
    const duneChains = [
      [{ x: 12, y: 15 }, { x: 28, y: 28 }, { x: 44, y: 35 }],
      [{ x: 16, y: 40 }, { x: 32, y: 48 }, { x: 46, y: 58 }],
      [{ x: 10, y: 62 }, { x: 26, y: 72 }, { x: 42, y: 84 }],
      [{ x: 14, y: 82 }, { x: 30, y: 88 }, { x: 48, y: 92 }],
      [{ x: 48, y: 14 }, { x: 62, y: 20 }, { x: 78, y: 26 }]
    ];

    duneChains.forEach(chain => {
      const p0 = this.normToScreen(chain[0].x, chain[0].y);
      const p1 = this.normToScreen(chain[1].x, chain[1].y);
      const p2 = this.normToScreen(chain[2].x, chain[2].y);

      // Dune shadow trough (leeward side)
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y + 4);
      ctx.quadraticCurveTo(p1.x, p1.y + 7, p2.x, p2.y + 4);
      ctx.strokeStyle = 'rgba(15, 12, 9, 0.45)';
      ctx.lineWidth = 4 * this.viewport.zoom;
      ctx.stroke();

      // Dune crest highlight (sunward crest)
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.quadraticCurveTo(p1.x, p1.y + 2, p2.x, p2.y);
      ctx.strokeStyle = 'rgba(230, 212, 173, 0.22)';
      ctx.lineWidth = 1.4 * this.viewport.zoom;
      ctx.stroke();
    });

    // 3. Ancient Kufa-Karbala Desert Caravan Route
    const routeCoords = [
      { x: 50, y: 98 }, { x: 46, y: 84 }, { x: 42, y: 70 },
      { x: 44, y: 56 }, { x: 50, y: 44 }, { x: 58, y: 32 }
    ];
    ctx.beginPath();
    const rStart = this.normToScreen(routeCoords[0].x, routeCoords[0].y);
    ctx.moveTo(rStart.x, rStart.y);
    for (let i = 1; i < routeCoords.length; i++) {
      const rp = this.normToScreen(routeCoords[i].x, routeCoords[i].y);
      ctx.lineTo(rp.x, rp.y);
    }
    ctx.strokeStyle = 'rgba(198, 166, 107, 0.18)';
    ctx.lineWidth = 1.2 * this.viewport.zoom;
    ctx.setLineDash([5 * this.viewport.zoom, 7 * this.viewport.zoom]);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Subtle Historical Cartographic Compass Rose Grid
    ctx.strokeStyle = 'rgba(198, 166, 107, 0.04)';
    ctx.lineWidth = 1;
    for (let deg = 0; deg < 360; deg += 30) {
      const rad = (deg * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(center.x + Math.cos(rad) * scale * 1.5, center.y + Math.sin(rad) * scale * 1.5);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawHistoricalAlqamiRiver(ctx) {
    ctx.save();
    const zoom = this.viewport.zoom;

    // Organic Serpentine Waypoints of Nahr al-Alqami
    const riverWaypoints = [
      { x: 80, y: -2 },
      { x: 77, y: 10 },
      { x: 74, y: 20 },
      { x: 70, y: 30 },
      { x: 67, y: 42 },
      { x: 65, y: 52 },
      { x: 66, y: 64 },
      { x: 70, y: 76 },
      { x: 74, y: 88 },
      { x: 78, y: 102 }
    ];

    // Compute smooth Catmull-Rom or Cardinal Spline curve points
    const screenPts = riverWaypoints.map(pt => this.normToScreen(pt.x, pt.y));

    const drawSpline = (pts) => {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = i > 0 ? pts[i - 1] : pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = i !== pts.length - 2 ? pts[i + 2] : p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
      }
    };

    // 1. Natural Moist Riverbed Alluvial Silt Shore (Earth & Clay)
    drawSpline(screenPts);
    ctx.strokeStyle = '#382D21'; // Muted dark alluvial clay
    ctx.lineWidth = 34 * zoom;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // 2. Mudflat Edge & Reed Zone (Qasab)
    drawSpline(screenPts);
    ctx.strokeStyle = '#27382B'; // Organic marsh sedge & dark reed beds
    ctx.lineWidth = 24 * zoom;
    ctx.stroke();

    // 3. Deep River Water Channel (Muted Historic River Slate - NO NEON BLUE)
    drawSpline(screenPts);
    ctx.strokeStyle = '#182C2C'; // Deep natural water channel
    ctx.lineWidth = 15 * zoom;
    ctx.stroke();

    // 4. Muted Jade-Slate Flowing Surface
    drawSpline(screenPts);
    ctx.strokeStyle = '#223F3C'; // Authentic desert canal jade slate
    ctx.lineWidth = 9 * zoom;
    ctx.stroke();

    // 5. Subtle Organic Water Vector Currents (Gentle, Slow, Non-Glitzy)
    ctx.save();
    drawSpline(screenPts);
    ctx.strokeStyle = 'rgba(195, 220, 210, 0.16)';
    ctx.lineWidth = 1.8 * zoom;
    ctx.setLineDash([14 * zoom, 22 * zoom]);
    ctx.lineDashOffset = -this.waterPhase * 8;
    ctx.stroke();
    ctx.restore();

    // 6. Water Blockade Location Marker (7 Muharram - Muted Brass Marker)
    const blockadePos = this.normToScreen(70, 30);
    ctx.fillStyle = '#8A4B38';
    ctx.strokeStyle = '#E6D4AD';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(blockadePos.x, blockadePos.y, 6.5 * zoom, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 7. Epistemic River Waterway Label
    if (zoom > 0.85) {
      const lbl = this.normToScreen(74, 33);
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(230, 212, 173, 0.85)';
      ctx.font = '500 11px Outfit, sans-serif';
      ctx.fillText('Nahr al-Alqami (Euphrates Branch)', lbl.x + 8, lbl.y - 2);

      ctx.fillStyle = 'rgba(198, 166, 107, 0.7)';
      ctx.font = '9.5px Amiri, serif';
      ctx.fillText('نهر العلقمي (مجرى تاريخي تقريبي)', lbl.x + 8, lbl.y + 11);
    }

    ctx.restore();
  }

  drawHistoricalPalmGroves(ctx) {
    ctx.save();
    const zoom = this.viewport.zoom;

    // Oasis palm positions along the fertile alluvial riverbank
    const palmCoordinates = [
      { x: 65, y: 15 }, { x: 68, y: 22 }, { x: 72, y: 24 },
      { x: 63, y: 32 }, { x: 66, y: 37 }, { x: 60, y: 44 },
      { x: 57, y: 41 }, { x: 59, y: 53 }, { x: 62, y: 64 },
      { x: 65, y: 74 }, { x: 70, y: 84 }
    ];

    palmCoordinates.forEach((pc, idx) => {
      const p = this.normToScreen(pc.x, pc.y);
      const palmRadius = (8 + (idx % 3) * 2.5) * zoom;

      // Southward ground cast shadow
      ctx.fillStyle = 'rgba(70, 45, 20, 0.28)';
      ctx.beginPath();
      ctx.ellipse(p.x + 3 * zoom, p.y + 5 * zoom, palmRadius * 0.9, palmRadius * 0.45, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Fibrous Palm Trunk
      ctx.fillStyle = '#5C2C16';
      ctx.fillRect(p.x - 1.2 * zoom, p.y, 2.4 * zoom, 7 * zoom);

      // Deep Oasis Emerald Foliage Crown
      ctx.fillStyle = 'rgba(16, 59, 50, 0.92)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, palmRadius, 0, Math.PI * 2);
      ctx.fill();

      // Individual Radiating Palm Fronds (Botanical palm leaf rays)
      ctx.strokeStyle = 'rgba(45, 138, 86, 0.85)';
      ctx.lineWidth = 1.2;
      for (let f = 0; f < 8; f++) {
        const ang = (f * Math.PI) / 4 + (idx * 0.2);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + Math.cos(ang) * (palmRadius + 3 * zoom), p.y + Math.sin(ang) * (palmRadius + 3 * zoom));
        ctx.stroke();
      }
    });

    ctx.restore();
  }

  drawHistoricalEncampment(ctx) {
    const pos = this.normToScreen(33.0, 68.0);
    const zoom = this.viewport.zoom;

    ctx.save();

    // 1. Crescent Defensive Trench (al-Khandaq) behind tents
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 38 * zoom, Math.PI * 0.45, Math.PI * 1.55);
    ctx.strokeStyle = '#6B4019'; // Deep excavated ditch
    ctx.lineWidth = 7 * zoom;
    ctx.stroke();

    // Protective Embers & Smoldering Fire (Ashura dawn defense)
    const firePulse = Math.sin(this.pulsePhase * 2) * 0.2;
    ctx.strokeStyle = `rgba(186, 85, 54, ${0.75 + firePulse})`;
    ctx.lineWidth = 3 * zoom;
    ctx.stroke();

    // 2. Authentic Horseshoe Formation of Traditional Bedouin Tents
    const tents = [
      { dx: 0, dy: 0, isMain: true, title: 'Imam Hussain Pavilion' },
      { dx: -12, dy: -9, isMain: false, title: 'Banu Hashim Women & Children' },
      { dx: 14, dy: -7, isMain: false, title: 'Al-Abbas & Youth Tent' },
      { dx: -8, dy: 11, isMain: false, title: 'Companions West' },
      { dx: 9, dy: 11, isMain: false, title: 'Companions East' }
    ];

    tents.forEach(t => {
      const tx = pos.x + t.dx * zoom;
      const ty = pos.y + t.dy * zoom;
      const tsize = (t.isMain ? 13 : 8.5) * zoom;

      // Triangular tent silhouette
      ctx.beginPath();
      ctx.moveTo(tx, ty - tsize);
      ctx.lineTo(tx - tsize * 0.9, ty + tsize * 0.7);
      ctx.lineTo(tx + tsize * 0.9, ty + tsize * 0.7);
      ctx.closePath();

      if (t.isMain) {
        ctx.fillStyle = '#103B32'; // Sacred Emerald canopy of Imam Hussain
        ctx.strokeStyle = '#C6A66B';
        ctx.lineWidth = 1.5;
      } else {
        ctx.fillStyle = '#C2A374'; // Weathered goat-hair canvas
        ctx.strokeStyle = '#5E3E1A';
        ctx.lineWidth = 1;
      }
      ctx.fill();
      ctx.stroke();

      // Green Banner of Truth (Rayat al-Haqq) on Main Tent
      if (t.isMain) {
        ctx.strokeStyle = '#C6A66B';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(tx, ty - tsize);
        ctx.lineTo(tx, ty - tsize - 8 * zoom);
        ctx.stroke();

        ctx.fillStyle = '#103B32';
        ctx.beginPath();
        ctx.moveTo(tx, ty - tsize - 8 * zoom);
        ctx.lineTo(tx + 6 * zoom, ty - tsize - 5 * zoom);
        ctx.lineTo(tx, ty - tsize - 2 * zoom);
        ctx.fill();
      }
    });

    // Curatorial Titling
    if (zoom > 0.85) {
      ctx.fillStyle = '#141918';
      ctx.font = '600 11px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.fillText('Encampment of Imam Hussain (Khaymagah)', pos.x, pos.y + 44 * zoom);

      ctx.fillStyle = '#3E2A14';
      ctx.font = '10.5px Amiri, serif';
      ctx.fillText('مخيم سيد الشهداء عليه السلام وخندق الدفاع', pos.x, pos.y + 57 * zoom);
    }

    ctx.restore();
  }

  drawHistoricalUmayyadArmy(ctx) {
    const pos = this.normToScreen(58.0, 66.0);
    const zoom = this.viewport.zoom;

    ctx.save();
    // Umayyad Command Pavilion (Umar ibn Sa'ad HQ)
    ctx.fillStyle = 'rgba(138, 75, 56, 0.88)';
    ctx.strokeStyle = '#2B1410';
    ctx.lineWidth = 1.4;

    ctx.beginPath();
    ctx.roundRect(pos.x - 14 * zoom, pos.y - 12 * zoom, 28 * zoom, 24 * zoom, 3);
    ctx.fill();
    ctx.stroke();

    // Cavalry squads in formation
    const squadPoints = [
      { dx: -26, dy: -14 }, { dx: -36, dy: 6 }, { dx: -16, dy: 22 },
      { dx: 22, dy: -10 }, { dx: 16, dy: 16 }
    ];

    ctx.fillStyle = '#8A4B38';
    squadPoints.forEach(sp => {
      const sx = pos.x + sp.dx * zoom;
      const sy = pos.y + sp.dy * zoom;
      ctx.beginPath();
      ctx.arc(sx, sy, 3.5 * zoom, 0, Math.PI * 2);
      ctx.fill();
    });

    if (zoom > 0.85) {
      ctx.fillStyle = '#381610';
      ctx.font = '600 10.5px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Umayyad Cavalry Command (Ibn Sa’ad)', pos.x, pos.y + 26 * zoom);

      ctx.fillStyle = '#5A2A20';
      ctx.font = '10px sans-serif';
      ctx.fillText('معسكر جيش الكوفة (عمر بن سعد)', pos.x, pos.y + 39 * zoom);
    }

    ctx.restore();
  }

  drawHistoricalBattlefield(ctx) {
    const pos = this.normToScreen(50.0, 49.0);
    const zoom = this.viewport.zoom;

    ctx.save();
    // Subtle cross-swords zone of engagement
    ctx.strokeStyle = 'rgba(138, 75, 56, 0.28)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y, 48 * zoom, 32 * zoom, -Math.PI / 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    if (zoom > 0.95) {
      ctx.fillStyle = 'rgba(92, 45, 28, 0.85)';
      ctx.font = 'italic 600 11px Cormorant Garamond, serif';
      ctx.textAlign = 'center';
      ctx.fillText('Ma’rakah al-Taff (Battlefield Arena)', pos.x, pos.y);
    }

    ctx.restore();
  }

  /* =========================================================================
     ARCHIVAL SURVEY MARKERS & TWO-PASS COLLISION-FREE CARTOGRAPHIC PLAQUES
     ========================================================================= */
  drawLocations(ctx, locations, isPresentMode) {
    if (!locations || locations.length === 0) return;

    // Filter by search query and category
    const filtered = locations.filter(loc => {
      if (this.categoryFilter !== 'all' && loc.category !== this.categoryFilter) {
        return false;
      }
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchName = loc.name && loc.name.toLowerCase().includes(q);
        const matchArabic = loc.arabicName && loc.arabicName.includes(q);
        if (!matchName && !matchArabic) return false;
      }
      return true;
    });

    const zoom = this.viewport.zoom;

    // Anchor identification
    const isAnchor = (id) => {
      const anchorIds = [
        'shrine_hussain', 'shrine_abbas', 'bain_al_haramayn', 'mukhayam_present', 'al_mukhayam',
        'hist_camp_hussain', 'hist_maqtal_hussain', 'hist_martyrdom_abbas', 'nahr_alqami'
      ];
      return anchorIds.includes(id);
    };

    const isSecondary = (id) => {
      const secIds = [
        'tall_zaynabiyya', 'hist_tall_zaynabiyya', 'hist_battle_arena', 'hist_umayyad_camp'
      ];
      return secIds.includes(id);
    };

    // PASS 1: Render All Survey Marker Brass Pins
    filtered.forEach(loc => {
      if (!loc.coords) return;
      const pos = this.normToScreen(loc.coords.x, loc.coords.y);
      const isSelected = this.selectedLocation && this.selectedLocation.id === loc.id;
      const isHovered = this.hoveredLocation && this.hoveredLocation.id === loc.id;
      const isTarget = this.highlightedLocation && this.highlightedLocation.id === loc.id;

      this.drawPinGlyph(ctx, pos, loc, isSelected, isHovered, isTarget, isPresentMode);
    });

    // PASS 2: Collision-Free Archival Label Placement
    const placedBoxes = [];

    // Prioritize pins: Active/Hovered first, then Anchors, then Secondary, then others
    const sortedForLabels = [...filtered].sort((a, b) => {
      const aActive = (this.selectedLocation && this.selectedLocation.id === a.id) ||
                      (this.hoveredLocation && this.hoveredLocation.id === a.id) ||
                      (this.highlightedLocation && this.highlightedLocation.id === a.id);
      const bActive = (this.selectedLocation && this.selectedLocation.id === b.id) ||
                      (this.hoveredLocation && this.hoveredLocation.id === b.id) ||
                      (this.highlightedLocation && this.highlightedLocation.id === b.id);
      if (aActive !== bActive) return aActive ? -1 : 1;
      const aAnchor = isAnchor(a.id);
      const bAnchor = isAnchor(b.id);
      if (aAnchor !== bAnchor) return aAnchor ? -1 : 1;
      const aSec = isSecondary(a.id);
      const bSec = isSecondary(b.id);
      if (aSec !== bSec) return aSec ? -1 : 1;
      return 0;
    });

    sortedForLabels.forEach(loc => {
      if (!loc.coords) return;
      const pos = this.normToScreen(loc.coords.x, loc.coords.y);
      const isSelected = this.selectedLocation && this.selectedLocation.id === loc.id;
      const isHovered = this.hoveredLocation && this.hoveredLocation.id === loc.id;
      const isTarget = this.highlightedLocation && this.highlightedLocation.id === loc.id;
      const isActive = isSelected || isHovered || isTarget;

      // Adaptive visibility filter by zoom level to prevent cluttered screens
      if (!isActive) {
        if (!isAnchor(loc.id)) {
          if (isSecondary(loc.id) && zoom < 1.35) return;
          if (!isSecondary(loc.id) && zoom < 2.05) return;
        }
      }

      const baseRadius = (isActive ? 15 : 12) * Math.min(1.25, Math.max(0.85, zoom));
      const text = loc.name;
      ctx.font = '500 10.5px Outfit, sans-serif';
      const textWidth = ctx.measureText(text).width;
      const boxW = textWidth + 18;
      const boxH = 20;

      // Candidate Positions: 1. Bottom, 2. Top, 3. Right, 4. Left
      const candidates = [
        { x: pos.x - boxW / 2, y: pos.y + baseRadius + 6, w: boxW, h: boxH, pos: 'bottom' },
        { x: pos.x - boxW / 2, y: pos.y - baseRadius - 6 - boxH, w: boxW, h: boxH, pos: 'top' },
        { x: pos.x + baseRadius + 8, y: pos.y - boxH / 2, w: boxW, h: boxH, pos: 'right' },
        { x: pos.x - baseRadius - 8 - boxW, y: pos.y - boxH / 2, w: boxW, h: boxH, pos: 'left' }
      ];

      let chosenBox = null;
      for (const cand of candidates) {
        let collides = false;
        // Check collision against placed boxes with 3px padding
        for (const pb of placedBoxes) {
          if (!(cand.x + cand.w + 3 < pb.x ||
                cand.x > pb.x + pb.w + 3 ||
                cand.y + cand.h + 3 < pb.y ||
                cand.y > pb.y + pb.h + 3)) {
            collides = true;
            break;
          }
        }
        if (!collides) {
          chosenBox = cand;
          break;
        }
      }

      // If active (selected/hovered), force candidate 0 even if crowded, elevated on top
      if (!chosenBox && isActive) {
        chosenBox = candidates[0];
      }

      if (chosenBox) {
        placedBoxes.push(chosenBox);
        this.drawLabelPlaque(ctx, chosenBox, text, isSelected, isHovered, isActive);
      }
    });

    // PASS 3: Elevated Curatorial Hover Card (Interactive Tooltip)
    if (this.hoveredLocation && this.hoveredLocation.coords) {
      const hPos = this.normToScreen(this.hoveredLocation.coords.x, this.hoveredLocation.coords.y);
      this.drawHoverCard(ctx, hPos, this.hoveredLocation);
    }
  }

  drawPinGlyph(ctx, pos, loc, isSelected, isHovered, isTarget, isPresentMode) {
    const zoom = this.viewport.zoom;
    const baseRadius = (isSelected || isTarget ? 15 : 12) * Math.min(1.25, Math.max(0.85, zoom));

    ctx.save();

    // 1. Concentric Pulse for Selected / Target Pin
    if (isSelected || isTarget) {
      const pulseExpand = Math.sin(this.pulsePhase) * 6;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, baseRadius + 10 + pulseExpand, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(198, 166, 107, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 2. Brass Outer Bezel Ring (Antique Gold Survey Marker)
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, baseRadius + 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#080B0B';
    ctx.fill();
    ctx.strokeStyle = isSelected ? '#E6D4AD' : (isHovered ? '#C6A66B' : 'rgba(198, 166, 107, 0.6)');
    ctx.lineWidth = isSelected ? 2 : 1.4;
    ctx.stroke();

    // Radial tick marks on brass bezel
    const numTicks = 8;
    for (let t = 0; t < numTicks; t++) {
      const ang = (t * Math.PI * 2) / numTicks;
      ctx.beginPath();
      ctx.moveTo(pos.x + Math.cos(ang) * (baseRadius + 1.5), pos.y + Math.sin(ang) * (baseRadius + 1.5));
      ctx.lineTo(pos.x + Math.cos(ang) * (baseRadius + 3.5), pos.y + Math.sin(ang) * (baseRadius + 3.5));
      ctx.strokeStyle = 'rgba(198, 166, 107, 0.75)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 3. Inner Core Surface
    let coreFill = '#141918';
    if (loc.category === 'shrine' || loc.id.includes('shrine')) {
      coreFill = '#103B32'; // Deep Sacred Emerald
    } else if (loc.category === 'camp' || loc.id.includes('camp') || loc.id.includes('mukhayam')) {
      coreFill = '#2A2016'; // Desert Encampment
    } else if (loc.category === 'waterway' || loc.id.includes('alqami')) {
      coreFill = '#0C2636'; // Deep Euphrates Sapphire
    } else if (loc.category === 'maqtal' || loc.id.includes('qatlgah') || loc.id.includes('battle')) {
      coreFill = '#331B16'; // Muted Terracotta
    } else {
      coreFill = '#18201E'; // Obsidian
    }

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, baseRadius, 0, Math.PI * 2);
    ctx.fillStyle = coreFill;
    ctx.fill();
    ctx.strokeStyle = 'rgba(198, 166, 107, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 4. Center Calligraphic Glyph
    ctx.fillStyle = isSelected ? '#F5F0E6' : '#E6D4AD';
    ctx.font = `600 ${Math.round(11 * Math.min(1.2, zoom))}px 'Amiri', 'Cinzel', serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let emblem = '✦';
    if (loc.id === 'shrine_hussain' || loc.id === 'hist_camp_hussain' || loc.id === 'hist_maqtal_hussain') {
      emblem = 'ح';
    } else if (loc.id === 'shrine_abbas' || loc.id === 'hist_martyrdom_abbas') {
      emblem = 'ع';
    } else if (loc.category === 'camp' || loc.id.includes('camp')) {
      emblem = 'خ';
    } else if (loc.id === 'tall_zaynabiyya' || loc.id === 'hist_tall_zaynabiyya') {
      emblem = 'ط';
    } else if (loc.category === 'waterway') {
      emblem = 'ن';
    } else if (loc.category === 'maqam') {
      emblem = 'م';
    }

    ctx.fillText(emblem, pos.x, pos.y + 0.5);
    ctx.restore();
  }

  drawLabelPlaque(ctx, box, text, isSelected, isHovered, isActive) {
    ctx.save();
    ctx.fillStyle = isActive ? 'rgba(14, 18, 18, 0.96)' : 'rgba(8, 11, 11, 0.90)';
    ctx.beginPath();
    ctx.roundRect(box.x, box.y, box.w, box.h, 4);
    ctx.fill();

    ctx.strokeStyle = isSelected ? '#E6D4AD' : (isHovered ? '#C6A66B' : 'rgba(198, 166, 107, 0.35)');
    ctx.lineWidth = isSelected || isHovered ? 1.4 : 0.8;
    ctx.stroke();

    // Corner accent ticks
    ctx.fillStyle = isSelected ? '#E6D4AD' : '#C6A66B';
    ctx.fillRect(box.x + 2, box.y + 2, 2, 2);
    ctx.fillRect(box.x + box.w - 4, box.y + 2, 2, 2);

    ctx.font = '500 10px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isSelected ? '#FFF2D6' : (isHovered ? '#E6D4AD' : '#F5F0E6');
    ctx.fillText(text, box.x + box.w / 2, box.y + box.h / 2 + 0.5);
    ctx.restore();
  }

  drawHoverCard(ctx, pos, loc) {
    ctx.save();
    const cardW = 210;
    const cardH = 64;
    let cardX = pos.x - cardW / 2;
    let cardY = pos.y - cardH - 20;
    if (cardY < 60) cardY = pos.y + 24;
    if (cardX < 15) cardX = 15;
    if (cardX + cardW > this.width - 15) cardX = this.width - cardW - 15;

    // Card background
    ctx.fillStyle = 'rgba(8, 11, 11, 0.96)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 5);
    ctx.fill();
    ctx.strokeStyle = '#C6A66B';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Category badge
    ctx.fillStyle = '#103B32';
    ctx.beginPath();
    ctx.roundRect(cardX + 10, cardY + 8, 70, 13, 3);
    ctx.fill();
    ctx.fillStyle = '#E6D4AD';
    ctx.font = '700 8px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText((loc.category || 'LANDMARK').toUpperCase(), cardX + 45, cardY + 17.5);

    // English title
    ctx.textAlign = 'left';
    ctx.fillStyle = '#F5F0E6';
    ctx.font = '600 11px Cinzel, serif';
    const title = loc.name.length > 25 ? loc.name.substring(0, 23) + '...' : loc.name;
    ctx.fillText(title, cardX + 10, cardY + 34);

    // Arabic title
    if (loc.arabicName) {
      ctx.fillStyle = '#C6A66B';
      ctx.font = '10px Amiri, serif';
      ctx.fillText(loc.arabicName, cardX + 10, cardY + 49);
    }

    ctx.restore();
  }

  drawTargetPulse(ctx, coords) {
    const pos = this.normToScreen(coords.x, coords.y);
    const pulseRad = 22 + Math.sin(this.pulsePhase) * 10;
    const opacity = 0.65 - Math.sin(this.pulsePhase) * 0.35;

    ctx.save();
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, pulseRad, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(198, 166, 107, ${opacity})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, pulseRad + 8, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(198, 166, 107, ${opacity * 0.45})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  drawSplitDivider(ctx, splitX) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(splitX, 0);
    ctx.lineTo(splitX, this.height);
    ctx.strokeStyle = '#C6A66B';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    const handleY = this.height / 2;
    ctx.beginPath();
    ctx.arc(splitX, handleY, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#141918';
    ctx.fill();
    ctx.strokeStyle = '#C6A66B';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#E6D4AD';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('◀ ▶', splitX, handleY);

    // Left badge: PRESENT DAY
    ctx.fillStyle = 'rgba(8, 11, 11, 0.94)';
    ctx.fillRect(splitX - 110, 20, 100, 26);
    ctx.strokeStyle = '#103B32';
    ctx.strokeRect(splitX - 110, 20, 100, 26);
    ctx.fillStyle = '#E6D4AD';
    ctx.font = '600 10px Cinzel, serif';
    ctx.fillText('PRESENT DAY', splitX - 60, 34);

    // Right badge: 61 AH
    ctx.fillStyle = 'rgba(8, 11, 11, 0.94)';
    ctx.fillRect(splitX + 10, 20, 100, 26);
    ctx.strokeStyle = '#C6A66B';
    ctx.strokeRect(splitX + 10, 20, 100, 26);
    ctx.fillStyle = '#C6A66B';
    ctx.font = '600 10px Cinzel, serif';
    ctx.fillText('61 AH VIEW', splitX + 60, 34);

    ctx.restore();
  }

  /* =========================================================================
     STAGE F: LUXURY CARTOGRAPHIC ACCENTS (COMPASS ROSE & DYNAMIC SCALE BAR)
     ========================================================================= */
  drawCompassRose(ctx) {
    const x = this.width - 55;
    const y = this.height - 110;
    const r = 26;

    ctx.save();
    // Dark disc backing
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(8, 11, 11, 0.88)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(198, 166, 107, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Cardinal Points
    const points = [
      { label: 'N', sub: 'ش', dx: 0, dy: -r + 6 },
      { label: 'S', sub: 'ج', dx: 0, dy: r - 6 },
      { label: 'E', sub: 'ق', dx: r - 6, dy: 0 },
      { label: 'W', sub: 'غ', dx: -r + 6, dy: 0 }
    ];

    // North Needle (Antique Gold)
    ctx.beginPath();
    ctx.moveTo(x, y - r + 7);
    ctx.lineTo(x + 4, y);
    ctx.lineTo(x - 4, y);
    ctx.closePath();
    ctx.fillStyle = '#C6A66B';
    ctx.fill();

    // South Needle (Charcoal Slate)
    ctx.beginPath();
    ctx.moveTo(x, y + r - 7);
    ctx.lineTo(x + 4, y);
    ctx.lineTo(x - 4, y);
    ctx.closePath();
    ctx.fillStyle = '#334155';
    ctx.fill();

    // Center pivot
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#F5F0E6';
    ctx.fill();

    ctx.fillStyle = '#E6D4AD';
    ctx.font = 'bold 8px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', x, y - r + 13);

    ctx.restore();
  }

  drawScaleBar(ctx) {
    const x = this.width - 200;
    const y = this.height - 98;
    const barWidth = 100;

    // Scale calculation: at zoom 1.0, 100px represents approximately 250 meters
    const meters = Math.round(250 / this.viewport.zoom);
    const dhira = Math.round(meters * 2); // 1 Meter ≈ 2 Classical Arab Dhira' (cubits)

    ctx.save();
    // Background plaque
    ctx.fillStyle = 'rgba(8, 11, 11, 0.88)';
    ctx.beginPath();
    ctx.roundRect(x - 12, y - 18, barWidth + 24, 30, 4);
    ctx.fill();
    ctx.strokeStyle = 'rgba(198, 166, 107, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Scale Line with end ticks
    ctx.beginPath();
    ctx.moveTo(x, y + 4);
    ctx.lineTo(x + barWidth, y + 4);
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 8);
    ctx.moveTo(x + barWidth / 2, y + 2);
    ctx.lineTo(x + barWidth / 2, y + 6);
    ctx.moveTo(x + barWidth, y);
    ctx.lineTo(x + barWidth, y + 8);
    ctx.strokeStyle = '#C6A66B';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Scale labels
    ctx.fillStyle = '#E6D4AD';
    ctx.font = '500 8.5px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${meters} Meters  •  ${dhira} Dhira'`, x + barWidth / 2, y - 6);

    ctx.restore();
  }
}
