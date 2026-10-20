(() => {
  const tools = document.querySelector('.page-tools');
  if (!tools) return;

  const updateVisibility = () => {
    tools.hidden = window.scrollY > 1;
  };

  updateVisibility();
  window.addEventListener('scroll', updateVisibility, {passive: true});
  window.addEventListener('pageshow', updateVisibility);
})();
