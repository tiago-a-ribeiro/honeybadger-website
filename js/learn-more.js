document.querySelectorAll("[data-dialog-open]").forEach((button) => {
  const dialog = document.getElementById(button.dataset.dialogOpen);

  button.addEventListener("click", () => dialog.showModal());

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.querySelector("[data-dialog-close]").addEventListener("click", () => dialog.close());
});
