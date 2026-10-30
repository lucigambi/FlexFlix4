// Los iconos se animan mientras sus tarjetas estan visibles.
document.querySelectorAll('.learning-pillars').forEach((cards) => {
  let visible = true;
  const syncIcons = () => cards.style.setProperty('--icon-play-state', visible && !document.hidden ? 'running' : 'paused');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncIcons();
    }).observe(cards);
  }
  document.addEventListener('visibilitychange', syncIcons);
  syncIcons();
});

// Textura de San Juan adaptada a la paleta del arbol.
function PixelTexture(container, count = 26) {
  if (!container) return;

  const sizes = [6, 8, 12, 16, 24];
  const accentColors = ['#ff792b', '#e9a273', '#65c9f4', '#ae91df'];
  const baseColors = ['#397cce', '#6965b8'];

  const squares = Array.from({ length: count }, () => {
    const isAccent = Math.random() < 0.22;
    const onLeft = Math.random() < 0.5;
    return {
      size: sizes[Math.floor(Math.random() * sizes.length)],
      color: isAccent
        ? accentColors[Math.floor(Math.random() * accentColors.length)]
        : baseColors[Math.floor(Math.random() * baseColors.length)],
      side: onLeft ? 'left' : 'right',
      offset: (Math.random() * 16).toFixed(1) + '%',
      top: (Math.random() * 96).toFixed(1) + '%',
      opacityBase: isAccent ? 0.03 + Math.random() * 0.05 : 0.02 + Math.random() * 0.05,
      opacityMax: isAccent ? 0.65 + Math.random() * 0.3 : 0.5 + Math.random() * 0.25,
      duration: 1.4 + Math.random() * 2.2,
      delay: Math.random() * 4,
      blur: Math.random() < 0.35 ? (Math.random() < 0.5 ? 2 : 4) : 0
    };
  });

  const frag = document.createDocumentFragment();
  squares.forEach((sq) => {
    const el = document.createElement('span');
    el.className = 'learning-pixel';
    // Tamano responsive: escala con el ancho de pantalla (referencia 1920px)
    // en vez de quedar fijo en px, para que no se vean gigantes/grotescos en
    // notebook o tablet. La densidad (cantidad visible) se ajusta aparte via CSS.
    const responsiveSize = `clamp(3px, ${(sq.size / 19.2).toFixed(2)}vw, ${sq.size}px)`;
    el.style.width = responsiveSize;
    el.style.height = responsiveSize;
    el.style.top = sq.top;
    el.style[sq.side] = sq.offset;
    el.style.background = sq.color;
    if (sq.blur) el.style.filter = `blur(${sq.blur}px)`;
    el.style.setProperty('--op-a', sq.opacityBase.toFixed(2));
    el.style.setProperty('--op-b', sq.opacityMax.toFixed(2));
    el.style.setProperty('--dur', sq.duration.toFixed(1) + 's');
    el.style.setProperty('--delay', '-' + sq.delay.toFixed(1) + 's');
    frag.appendChild(el);
  });
  container.appendChild(frag);
}

document.querySelectorAll('.learning-pixels').forEach((texture) => {
  PixelTexture(texture, 68);
  let visible = true;
  const sync = () => texture.style.setProperty('--texture-play', visible && !document.hidden ? 'running' : 'paused');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(texture);
  }
  document.addEventListener('visibilitychange', sync);
  sync();
});

// Ajuste final para ventanas especialmente bajas, sin cortar tarjetas ni boton.
(() => {
  const hero = document.querySelector('.chapter-learning .learning');
  const copy = hero?.querySelector('.learning-copy');
  if (!copy) return;
  const desktop = matchMedia('(min-width:800px)');
  const fitHero = () => {
    if (!desktop.matches) {
      copy.style.removeProperty('--hero-fit');
      hero.style.removeProperty('--hero-header-height');
      return;
    }
    hero.style.setProperty('--hero-header-height', `${desktop.matches ? 0 : document.querySelector('.brand').offsetHeight}px`);
    const style = getComputedStyle(hero);
    const available = hero.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    copy.style.setProperty('--hero-fit', Math.min(1, available / copy.offsetHeight));
  };
  const observer = new ResizeObserver(fitHero);
  observer.observe(hero);
  observer.observe(copy);
  observer.observe(document.querySelector('.brand'));
  desktop.addEventListener('change', fitHero);
  document.fonts.ready.then(fitHero);
  fitHero();
})();
