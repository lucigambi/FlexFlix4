(() => {
  const container = document.getElementById('brand-logo');
  if (!container || !window.lottie || !window.flexflixLogoData) return;

  const animation = window.lottie.loadAnimation({
    container,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: window.flexflixLogoData,
    assetsPath: 'assets/img/lottie/images/',
    rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
  });

  function syncPlayback() {
    if (document.hidden) animation.pause();
    else animation.play();
  }
  animation.addEventListener('DOMLoaded', syncPlayback);
  document.addEventListener('visibilitychange', syncPlayback);
})();
