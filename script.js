// Conserva el control nativo y accesible del programa desplegable.
document.querySelectorAll('details').forEach(details => {
  const syncExpanded = () => details.querySelector('summary').setAttribute('aria-expanded', String(details.open));
  details.addEventListener('toggle', syncExpanded);
  syncExpanded();
});

// Suspend la texture lorsque la section quitte l'écran ou l'onglet est masqué.
const hero = document.querySelector('.product');
const pixels = [...hero.querySelectorAll('.pixel')];
let heroVisible = true;
function syncTexture() {
  const state = heroVisible && !document.hidden ? 'running' : 'paused';
  pixels.forEach(pixel => { pixel.style.animationPlayState = state; });
}
new IntersectionObserver(([entry]) => {
  heroVisible = entry.isIntersecting;
  syncTexture();
}).observe(hero);
document.addEventListener('visibilitychange', syncTexture);
