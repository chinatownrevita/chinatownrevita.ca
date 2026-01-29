async function loadManifest(){
  const res = await fetch("./manifest.json", { cache: "no-store" });
  if(!res.ok) throw new Error("manifest.json not found");
  return await res.json();
}

function startRotator(container, sources, intervalMs = 4200){
  if(!sources || sources.length === 0) return;

  // Use a single <img> and swap src. This avoids blanks and handles missing files gracefully.
  const img = document.createElement("img");
  img.alt = "";
  img.loading = "lazy";
  container.appendChild(img);

  let idx = 0;

  function showNext(){
    if(!sources.length) return;
    img.classList.remove("active");

    // Try next source; if it fails, skip forward automatically.
    const src = sources[idx % sources.length];
    idx = (idx + 1) % sources.length;

    img.onerror = () => {
      // skip missing/bad files immediately
      showNext();
    };

    img.onload = () => {
      // small delay so transitions feel smooth
      requestAnimationFrame(() => img.classList.add("active"));
    };

    img.src = src;
  }

  showNext();
  window.setInterval(showNext, intervalMs);
}

(async function init(){
  let manifest;
  try{
    manifest = await loadManifest();
  }catch(e){
    console.error(e);
    const warn = document.createElement("div");
    warn.style.cssText =
      "position:fixed;bottom:10px;left:10px;right:10px;background:#111;color:#fff;padding:10px;border:1px solid rgba(255,255,255,.2);border-radius:12px;z-index:9999;font-family:system-ui;font-size:14px";
    warn.textContent =
      "Could not load manifest.json. Run a local server (python -m http.server 8000) and open http://localhost:8000";
    document.body.appendChild(warn);
    return;
  }

  // HERO
  const heroSlides = document.getElementById("heroSlides");
  if(heroSlides){
    startRotator(heroSlides, manifest.hero || [], 5200);
  }

  // PROJECT slideshows (independent by default; each gets its own timer)
  document.querySelectorAll(".slideshow").forEach(el => {
    const key = el.dataset.project;
    const sources = (manifest.projects && manifest.projects[key]) ? manifest.projects[key] : [];
    startRotator(el, sources, 4200);
    initCTADVideo();
  });
})();
function initCTADVideo(){
  const video = document.getElementById("ctadVideo");
  const muteBtn = document.getElementById("ctadMuteBtn");
  const fsBtn = document.getElementById("ctadFsBtn");

  if(!video || !muteBtn || !fsBtn){
    console.warn("CTAD video elements not found. Check IDs in index.html.");
    return;
  }

  // Try autoplay politely (some browsers block until user gesture)
  video.play().catch(() => { /* ok */ });

  const syncMuteLabel = () => {
    muteBtn.textContent = video.muted ? "Unmute" : "Mute";
    muteBtn.setAttribute("aria-label", video.muted ? "Unmute video" : "Mute video");
  };
  syncMuteLabel();

  muteBtn.addEventListener("click", () => {
    video.muted = !video.muted;

    // iOS sometimes needs volume explicitly set after unmuting
    if(!video.muted) video.volume = 1;

    video.play().catch(() => { /* ok */ });
    syncMuteLabel();
  });

  fsBtn.addEventListener("click", async () => {
    try{
      // Standard Fullscreen API (desktop + many mobile browsers)
      if(video.requestFullscreen){
        await video.requestFullscreen();
        return;
      }

      // iOS Safari fallback: enable native controls and ask video to fullscreen
      // Note: this only works on iPhone/iPad Safari and must be triggered by user gesture (this click is ok)
      if(video.webkitEnterFullscreen){
        video.controls = true;       // iOS often requires controls for fullscreen
        video.muted = video.muted;   // no-op; keeps state
        video.play().catch(() => {});
        video.webkitEnterFullscreen();
        return;
      }

      console.warn("Fullscreen not supported in this browser.");
    }catch(e){
      console.warn("Fullscreen failed:", e);
    }
  });
}
window.addEventListener("DOMContentLoaded", () => {
  // your existing slideshow init can stay as-is
  initCTADVideo();
});

}
