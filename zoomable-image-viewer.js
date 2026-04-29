(() => {
  const instances = new WeakMap();
  const VIEWER_SELECTOR = ".photo-lightbox-media, .sheet-image-frame, .poem-note-media";
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const getLanguage = () => (window.MAPLE_BRIDGE_I18N?.isEnglish?.() ? "en" : "zh");
  const viewerText = {
    zoomIn: { zh: "放大图片", en: "Zoom in image" },
    zoomOut: { zh: "缩小图片", en: "Zoom out image" },
    reset: { zh: "重置缩放", en: "Reset zoom" },
  };
  const localize = (value) => (getLanguage() === "en" ? value.en : value.zh);

  class ZoomableImageViewer {
    constructor(root, options = {}) {
      this.root = root;
      this.options = {
        minScale: 1,
        maxScale: 4,
        step: 0.22,
        ...options,
      };
      this.scale = 1;
      this.translateX = 0;
      this.translateY = 0;
      this.pointerState = new Map();
      this.dragState = null;
      this.pinchState = null;
      this.handleImageLoad = this.handleImageLoad.bind(this);
      this.handleWheel = this.handleWheel.bind(this);
      this.handlePointerDown = this.handlePointerDown.bind(this);
      this.handlePointerMove = this.handlePointerMove.bind(this);
      this.handlePointerUp = this.handlePointerUp.bind(this);
      this.handleZoomIn = () => this.zoomBy(this.options.step);
      this.handleZoomOut = () => this.zoomBy(-this.options.step);
      this.handleReset = () => this.reset();
      this.setup();
      this.bindEvents();
      this.refresh();
    }

    setup() {
      this.root.classList.add("zoomable-viewer");
      this.image = this.root.querySelector("img");

      if (!(this.image instanceof HTMLImageElement)) {
        return;
      }

      const existingViewport = this.root.querySelector("[data-zoomable-viewport]");
      const existingStage = this.root.querySelector("[data-zoomable-stage]");
      const existingControls = this.root.querySelector("[data-zoomable-controls]");

      if (existingViewport instanceof HTMLElement && existingStage instanceof HTMLElement && existingControls instanceof HTMLElement) {
        this.viewport = existingViewport;
        this.stage = existingStage;
        this.controls = existingControls;
      } else {
        this.viewport = document.createElement("div");
        this.viewport.className = "zoomable-viewport";
        this.viewport.dataset.zoomableViewport = "true";

        this.stage = document.createElement("div");
        this.stage.className = "zoomable-stage";
        this.stage.dataset.zoomableStage = "true";

        this.controls = document.createElement("div");
        this.controls.className = "zoomable-controls";
        this.controls.dataset.zoomableControls = "true";
        this.controls.innerHTML = `
          <button class="zoomable-control" type="button" data-zoom-action="out">
            <span aria-hidden="true">−</span>
          </button>
          <button class="zoomable-control zoomable-control-scale" type="button" data-zoom-action="reset">
            <span class="zoomable-scale" data-zoom-scale>1.0x</span>
          </button>
          <button class="zoomable-control" type="button" data-zoom-action="in">
            <span aria-hidden="true">+</span>
          </button>
        `;

        this.image.parentNode?.insertBefore(this.viewport, this.image);
        this.stage.appendChild(this.image);
        this.viewport.appendChild(this.stage);
        this.root.appendChild(this.controls);
      }

      this.zoomInButton = this.controls.querySelector('[data-zoom-action="in"]');
      this.zoomOutButton = this.controls.querySelector('[data-zoom-action="out"]');
      this.resetButton = this.controls.querySelector('[data-zoom-action="reset"]');
      this.scaleLabel = this.controls.querySelector("[data-zoom-scale]");
      this.updateControlText();
    }

    bindEvents() {
      if (!(this.image instanceof HTMLImageElement) || !(this.viewport instanceof HTMLElement) || !(this.stage instanceof HTMLElement)) {
        return;
      }

      this.image.addEventListener("load", this.handleImageLoad);
      this.viewport.addEventListener("wheel", this.handleWheel, { passive: false });
      this.viewport.addEventListener("pointerdown", this.handlePointerDown);
      this.viewport.addEventListener("pointermove", this.handlePointerMove);
      this.viewport.addEventListener("pointerup", this.handlePointerUp);
      this.viewport.addEventListener("pointercancel", this.handlePointerUp);
      this.viewport.addEventListener("pointerleave", this.handlePointerUp);
      this.zoomInButton?.addEventListener("click", this.handleZoomIn);
      this.zoomOutButton?.addEventListener("click", this.handleZoomOut);
      this.resetButton?.addEventListener("click", this.handleReset);
    }

    updateControlText() {
      if (this.scaleLabel) {
        this.scaleLabel.textContent = `${this.scale.toFixed(this.scale === 1 ? 1 : 2)}x`;
      }

      if (this.zoomInButton instanceof HTMLElement) {
        const label = localize(viewerText.zoomIn);
        this.zoomInButton.setAttribute("aria-label", label);
        this.zoomInButton.title = label;
      }

      if (this.zoomOutButton instanceof HTMLElement) {
        const label = localize(viewerText.zoomOut);
        this.zoomOutButton.setAttribute("aria-label", label);
        this.zoomOutButton.title = label;
      }

      if (this.resetButton instanceof HTMLElement) {
        const label = localize(viewerText.reset);
        this.resetButton.setAttribute("aria-label", label);
        this.resetButton.title = label;
      }
    }

    handleImageLoad() {
      this.reset();
    }

    handleWheel(event) {
      event.preventDefault();
      const delta = event.deltaY < 0 ? this.options.step : -this.options.step;
      const rect = this.viewport.getBoundingClientRect();
      const focalX = event.clientX - rect.left - rect.width / 2;
      const focalY = event.clientY - rect.top - rect.height / 2;
      this.zoomTo(this.scale + delta, focalX, focalY);
    }

    handlePointerDown(event) {
      if (!this.viewport) {
        return;
      }

      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      this.viewport.setPointerCapture?.(event.pointerId);
      this.pointerState.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (this.pointerState.size === 2) {
        this.pinchState = this.createPinchState();
        this.dragState = null;
        return;
      }

      if (this.pointerState.size === 1 && this.scale > 1) {
        this.dragState = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          originX: this.translateX,
          originY: this.translateY,
        };
        this.root.classList.add("is-dragging");
      }
    }

    handlePointerMove(event) {
      if (!this.pointerState.has(event.pointerId)) {
        return;
      }

      this.pointerState.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (this.pointerState.size === 2 && this.pinchState) {
        event.preventDefault();
        const nextPinch = this.createPinchSnapshot();
        const nextScale = this.pinchState.startScale * (nextPinch.distance / this.pinchState.startDistance);
        this.scale = clamp(nextScale, this.options.minScale, this.options.maxScale);
        this.translateX = this.pinchState.startTranslateX + (nextPinch.center.x - this.pinchState.startCenter.x);
        this.translateY = this.pinchState.startTranslateY + (nextPinch.center.y - this.pinchState.startCenter.y);
        this.applyTransform();
        return;
      }

      if (this.dragState && this.dragState.pointerId === event.pointerId && this.scale > 1) {
        event.preventDefault();
        this.translateX = this.dragState.originX + (event.clientX - this.dragState.startX);
        this.translateY = this.dragState.originY + (event.clientY - this.dragState.startY);
        this.applyTransform();
      }
    }

    handlePointerUp(event) {
      if (this.pointerState.has(event.pointerId)) {
        this.pointerState.delete(event.pointerId);
      }

      this.viewport?.releasePointerCapture?.(event.pointerId);

      if (this.pointerState.size < 2) {
        this.pinchState = null;
      }

      if (!this.pointerState.size || (this.dragState && this.dragState.pointerId === event.pointerId)) {
        this.dragState = null;
        this.root.classList.remove("is-dragging");
      }

      if (this.pointerState.size === 1 && this.scale > 1) {
        const [pointerId, point] = this.pointerState.entries().next().value;
        this.dragState = {
          pointerId,
          startX: point.x,
          startY: point.y,
          originX: this.translateX,
          originY: this.translateY,
        };
      }
    }

    createPinchSnapshot() {
      const points = [...this.pointerState.values()];
      const [first, second] = points;
      const deltaX = second.x - first.x;
      const deltaY = second.y - first.y;

      return {
        distance: Math.hypot(deltaX, deltaY) || 1,
        center: {
          x: (first.x + second.x) / 2,
          y: (first.y + second.y) / 2,
        },
      };
    }

    createPinchState() {
      const snapshot = this.createPinchSnapshot();
      return {
        startDistance: snapshot.distance,
        startCenter: snapshot.center,
        startScale: this.scale,
        startTranslateX: this.translateX,
        startTranslateY: this.translateY,
      };
    }

    zoomBy(delta) {
      this.zoomTo(this.scale + delta);
    }

    zoomTo(nextScale, focalX = 0, focalY = 0) {
      const clampedScale = clamp(nextScale, this.options.minScale, this.options.maxScale);

      if (clampedScale === this.scale) {
        return;
      }

      const ratio = clampedScale / this.scale;
      this.translateX = focalX - (focalX - this.translateX) * ratio;
      this.translateY = focalY - (focalY - this.translateY) * ratio;
      this.scale = clampedScale;
      this.applyTransform();
    }

    getBounds() {
      if (!(this.viewport instanceof HTMLElement) || !(this.stage instanceof HTMLElement)) {
        return { maxX: 0, maxY: 0 };
      }

      const baseWidth = this.stage.offsetWidth;
      const baseHeight = this.stage.offsetHeight;
      const viewportWidth = this.viewport.clientWidth;
      const viewportHeight = this.viewport.clientHeight;
      const maxX = Math.max(0, (baseWidth * this.scale - viewportWidth) / 2);
      const maxY = Math.max(0, (baseHeight * this.scale - viewportHeight) / 2);
      return { maxX, maxY };
    }

    applyTransform() {
      if (!(this.stage instanceof HTMLElement)) {
        return;
      }

      const { maxX, maxY } = this.getBounds();

      if (this.scale <= 1) {
        this.translateX = 0;
        this.translateY = 0;
      } else {
        this.translateX = clamp(this.translateX, -maxX, maxX);
        this.translateY = clamp(this.translateY, -maxY, maxY);
      }

      this.stage.style.transform = `translate3d(${this.translateX}px, ${this.translateY}px, 0) scale(${this.scale})`;
      this.root.classList.toggle("is-zoomed", this.scale > 1.001);
      this.updateControlText();
    }

    reset() {
      this.scale = 1;
      this.translateX = 0;
      this.translateY = 0;
      this.applyTransform();
    }

    refresh() {
      if (!(this.image instanceof HTMLImageElement)) {
        return;
      }

      this.updateControlText();

      if (this.image.complete) {
        this.reset();
      }
    }
  }

  const mount = (root, options) => {
    if (!(root instanceof HTMLElement)) {
      return null;
    }

    if (instances.has(root)) {
      const existing = instances.get(root);
      existing?.refresh?.();
      return existing;
    }

    const viewer = new ZoomableImageViewer(root, options);
    instances.set(root, viewer);
    return viewer;
  };

  const mountAll = (scope = document, options = {}) => {
    if (!(scope instanceof Element || scope instanceof Document)) {
      return [];
    }

    const roots = [];
    if (scope instanceof Element && scope.matches(VIEWER_SELECTOR)) {
      roots.push(scope);
    }
    roots.push(...scope.querySelectorAll(VIEWER_SELECTOR));
    return roots.map((root) => mount(root, options)).filter(Boolean);
  };

  const reset = (root) => {
    const viewer = instances.get(root);
    viewer?.reset?.();
  };

  window.MAPLE_BRIDGE_IMAGE_ZOOM = {
    mount,
    mountAll,
    reset,
  };
})();
