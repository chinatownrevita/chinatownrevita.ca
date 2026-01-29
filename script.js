async function loadManifest(){
  const res = await fetch("./manifest.json", { cache: "no-store" });
  if(!res.ok) throw new Error("manifest.json not found");
  return await res.json();
}

function startRotator(container, sources, intervalMs = 4200){
  if(!sources || sources.length === 0) return;

  const img = document.createElement("img");
  img.alt = "";
  img.loading = "lazy";
  container.appendChild(img);

  let idx = 0;

  function showNext(){
    if(!sources.length) return;
    img.classList.remove("active");

    const src = sources[idx % sources.length];
    idx = (idx + 1) % sources.length;

    img.onerror = () => showNext();
    img.onload = () => requestAnimationFrame(() => img.classList.add("active"));
    img.src = src;
  }

  showNext();
  window.setInterval(showNext, intervalMs);
}

function initCTADVideo(){
  const video = document.getElementById("ctadVideo");
  const wrap  = document.querySelector(".video-wrap");
  const muteBtn = document.getElementById("ctadMuteBtn");
  const fsBtn   = document.getElementById("ctadFsBtn");

  if(!video || !wrap || !muteBtn || !fsBtn){
    console.warn("CTAD video elements not found. Check IDs in index.html.");
    return;
  }

  // Attempt autoplay (will be muted so usually allowed)
  video.play().catch(() => { /* ok */ });

  const syncMuteLabel = () => {
    muteBtn.textContent = video.muted ? "Unmute" : "Mute";
    muteBtn.setAttribute("aria-label", video.muted ? "Unmute video" : "Mute video");
  };
  syncMuteLabel();

  muteBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    if(!video.muted) video.volume = 1;
    video.play().catch(() => { /* ok */ });
    syncMuteLabel();
  });

  fsBtn.addEventListener("click", async () => {
    try{
      // Prefer fullscreen on the wrapper (more reliable for layout)
      if(wrap.requestFullscreen){
        await wrap.requestFullscreen();
        return;
      }
      // iOS Safari fallback: fullscreen the video
      if(video.webkitEnterFullscreen){
        // iOS often behaves better if controls are enabled for fullscreen
        video.controls = true;
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

window.addEventListener("DOMContentLoaded", async () => {
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

  // PROJECT slideshows
  document.querySelectorAll(".slideshow").forEach(el => {
    const key = el.dataset.project;
    const sources = (manifest.projects && manifest.projects[key]) ? manifest.projects[key] : [];
    startRotator(el, sources, 4200);
  });

  // CTAD video buttons
  initCTADVideo();
});
