document.querySelectorAll("[data-range-map]").forEach((map) => {
  const show = (region) => {
    map.querySelectorAll("[data-region]").forEach((element) => {
      element.classList.toggle("is-active", element.dataset.region === region);
    });
    map.querySelectorAll("[data-region-text]").forEach((text) => {
      text.hidden = text.dataset.regionText !== region;
    });
  };

  map.querySelectorAll("[data-region]").forEach((element) => {
    const region = element.dataset.region;
    element.addEventListener("pointerenter", () => show(region));
    element.addEventListener("focus", () => show(region));
    element.addEventListener("click", () => show(region));
  });
});
