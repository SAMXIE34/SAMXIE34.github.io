(() => {
  const previews = [...document.querySelectorAll(".research-preview")];
  const toggle = document.querySelector(".previews-toggle");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const visible = new Set();
  let paused = motion.matches;
  function sync() {
    toggle.textContent = paused ? "Play previews" : "Pause previews";
    toggle.setAttribute("aria-label", toggle.textContent);
    previews.forEach((video) => {
      if (
        paused ||
        !visible.has(video) ||
        document.hidden
      ) {
        video.pause();
      } else {
        if (!video.getAttribute("src")) video.src = video.dataset.src;
        video.play().catch(() => {});
      }
    });
  }
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        sync();
      },
      { threshold: 0.2 },
    );
    previews.forEach((video) => observer.observe(video));
    toggle.hidden = false;
    toggle.addEventListener("click", () => {
      paused = !paused;
      sync();
    });
    motion.addEventListener("change", () => {
      paused = motion.matches;
      sync();
    });
    document.addEventListener("visibilitychange", sync);
    sync();
  }
})();
