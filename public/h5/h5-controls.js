(() => {
  const controls = document.querySelector("#touchControls");
  const buttons = [...document.querySelectorAll(".touch-key[data-code]")];
  const activePointers = new Map();
  const modalIds = ["startScreen", "messageScreen", "cardDrawScreen", "shopScreen", "assetPreviewScreen"];

  function emit(code, type) {
    const keyByCode = { ArrowLeft: "ArrowLeft", ArrowRight: "ArrowRight", ArrowDown: "ArrowDown", KeyF: "f", Space: " " };
    window.dispatchEvent(new KeyboardEvent(type, { code, key: keyByCode[code] || code, bubbles: true, cancelable: true }));
  }

  function release(pointerId) {
    const active = activePointers.get(pointerId);
    if (!active) return;
    emit(active.code, "keyup");
    active.button.classList.remove("pressed");
    activePointers.delete(pointerId);
  }

  function releaseAll() {
    [...activePointers.keys()].forEach(release);
  }

  buttons.forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      const code = button.dataset.code;
      if (!code || activePointers.has(event.pointerId)) return;
      button.setPointerCapture?.(event.pointerId);
      activePointers.set(event.pointerId, { code, button });
      button.classList.add("pressed");
      emit(code, "keydown");
    });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((type) => {
      button.addEventListener(type, (event) => release(event.pointerId));
    });
    button.addEventListener("contextmenu", (event) => event.preventDefault());
  });

  function syncControls() {
    const modalOpen = modalIds.some((id) => !document.querySelector(`#${id}`)?.classList.contains("hidden"));
    controls?.classList.toggle("is-hidden", modalOpen);
    if (modalOpen) releaseAll();
  }

  modalIds.forEach((id) => {
    const node = document.querySelector(`#${id}`);
    if (node) new MutationObserver(syncControls).observe(node, { attributes: true, attributeFilter: ["class"] });
  });

  const fullscreenButton = document.querySelector("#mobileFullscreenButton");
  fullscreenButton?.addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) {
        await document.querySelector(".h5-app")?.requestFullscreen?.();
        await screen.orientation?.lock?.("landscape");
      } else {
        await document.exitFullscreen?.();
      }
    } catch (_) {}
  });
  document.addEventListener("fullscreenchange", () => {
    if (fullscreenButton) fullscreenButton.textContent = document.fullscreenElement ? "退出" : "横屏";
  });
  document.addEventListener("visibilitychange", releaseAll);
  window.addEventListener("blur", releaseAll);
  window.addEventListener("pagehide", releaseAll);
  syncControls();
})();
