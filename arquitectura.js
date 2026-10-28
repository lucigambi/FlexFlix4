// Acordeón animado: conserva <details> como alternativa nativa sin JavaScript.
(() => {
  const stack = document.querySelector('.architecture-stack');
  if (!stack) return;
  const layers = [...stack.querySelectorAll('.architecture-layer')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Map();
  // Los elementos que salen de la tarjeta viven fuera del panel animado:
  // así el recorte del acordeón no corta ni la tipografía ni la imagen.
  layers.forEach(layer => {
    const shell = document.createElement('div');
    shell.className = 'architecture-layer-shell';
    shell.style.setProperty('--layer', layer.style.getPropertyValue('--layer'));
    layer.before(shell);
    shell.append(layer);
    const popouts = document.createElement('div');
    popouts.className = 'architecture-popouts';
    popouts.setAttribute('aria-hidden', 'true');
    popouts.innerHTML = '<div class="architecture-popouts-clip"><div class="architecture-popouts-layout"><span class="architecture-pop-number"></span><span class="architecture-pop-name"></span><figure class="architecture-pop-image"><img src="assets/img/architecture-robot.png" alt="" width="512" height="512"><figcaption></figcaption></figure></div></div>';
    popouts.querySelector('.architecture-pop-number').textContent = layer.dataset.layerNumber;
    popouts.querySelector('.architecture-pop-name').textContent = layer.dataset.layerName;
    popouts.querySelector('figcaption').textContent = layer.dataset.layerName;
    shell.append(popouts);
  });

  function setExpanded(layer, expanded) {
    const summary = layer.querySelector('summary');
    const body = layer.querySelector('.architecture-layer-body');
    const from = layer.getBoundingClientRect().height;
    const previous = animations.get(layer);
    if (previous) { previous.onfinish = null; previous.cancel(); }
    layer.style.height = '';
    if (expanded) layer.open = true;
    layer.classList.toggle('is-expanded', expanded);
    layer.parentElement.classList.toggle('is-expanded', expanded);
    summary.setAttribute('aria-expanded', String(expanded));
    body.inert = !expanded;
    const border = parseFloat(getComputedStyle(layer).borderTopWidth) + parseFloat(getComputedStyle(layer).borderBottomWidth);
    const to = summary.getBoundingClientRect().height + (expanded ? body.getBoundingClientRect().height : 0) + border;
    const finish = () => {
      layer.open = expanded;
      layer.style.height = '';
      layer.style.overflow = '';
      animations.delete(layer);
    };
    // Como en la referencia, el despliegue principal sigue animado aunque
    // reducir movimiento desactive los pulsos y las entradas decorativas.
    layer.style.overflow = 'hidden';
    const animation = layer.animate([{height: `${from}px`}, {height: `${to}px`}], {
      duration: 500, easing: 'cubic-bezier(.22,.85,.2,1)'
    });
    animations.set(layer, animation);
    animation.onfinish = finish;
  }

  layers.forEach(layer => {
    const summary = layer.querySelector('summary');
    layer.querySelector('.architecture-layer-body').inert = !layer.open;
    summary.addEventListener('click', event => {
      event.preventDefault();
      const expanded = !layer.classList.contains('is-expanded');
      layers.forEach(other => {
        if (other !== layer && other.classList.contains('is-expanded')) setExpanded(other, false);
      });
      setExpanded(layer, expanded);
    });
  });

  if ('IntersectionObserver' in window && !reduced.matches) {
    stack.classList.add('architecture-enter');
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        stack.classList.add('is-visible');
        observer.disconnect();
      }
    }, {threshold: .08});
    observer.observe(stack);
  }
})();
