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
  });
})();
