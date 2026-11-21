(() => {
  const image = document.querySelector('img[src="/assets/uploads/2026/04/gemini_generated_image_f6n0tpf6n0tpf6n02.jpg"]');
  const figure = image?.closest('figure');
  if (!figure) return;
  figure.classList.add('publication-art');
  const extension = document.createElement('img');
  extension.src = '/assets/uploads/2026/04/publications-extension.png';
  extension.alt = '';
  extension.className = 'publication-art-extension';
  figure.append(extension);
  requestAnimationFrame(() => requestAnimationFrame(() => extension.classList.add('is-faded')));
  figure.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') extension.classList.add('is-visible');
  });
  figure.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') extension.classList.remove('is-visible');
  });
  let timer;
  let touchTap = false;
  figure.addEventListener('click', event => {
    if (touchTap) { event.preventDefault(); touchTap = false; }
  });
  figure.addEventListener('pointerup', event => {
    if (event.pointerType !== 'touch') return;
    touchTap = true;
    clearTimeout(timer);
    extension.classList.add('is-visible');
    timer = setTimeout(() => extension.classList.remove('is-visible'), 1000);
  });
})();
