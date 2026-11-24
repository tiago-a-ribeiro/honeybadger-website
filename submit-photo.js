document.querySelectorAll("[data-submit-photo]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.hidden = true;
    form.parentElement.querySelector("[data-thanks]").hidden = false;
  });
});
