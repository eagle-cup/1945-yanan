(() => {
  const drawer = document.getElementById('history-map');
  const map = document.getElementById('map-board');
  const markerHost = document.getElementById('map-markers');
  const openMap = document.getElementById('open-map');
  const closeMap = document.getElementById('close-map');
  const resetMap = document.getElementById('map-reset');
  const quizCount = document.getElementById('quiz-count');
  if (!drawer || !map || !markerHost || !window.YananData) return;

  const icon = window.YananIcons;
  drawer.inert = true;
  openMap?.addEventListener('click', () => {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    drawer.inert = false;
    document.body.classList.add('has-drawer');
    window.setTimeout(() => markerHost.querySelector('button')?.focus(), 260);
  });
  const dismiss = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.inert = true;
    document.body.classList.remove('has-drawer');
    openMap?.focus();
  };
  closeMap?.addEventListener('click', dismiss);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && drawer.classList.contains('is-open')) dismiss(); });
  closeMap.innerHTML = icon('arrow-left');
  drawer.querySelector('a.icon-control').innerHTML = icon('book-open');

  const path = document.getElementById('map-route-path');
  const locations = [...window.YananData.locations].sort((a, b) => Number(a.number) - Number(b.number));
  locations.forEach((location) => {
    const marker = document.createElement('button');
    marker.className = 'map-marker';
    marker.type = 'button';
    marker.style.setProperty('--x', location.map.x);
    marker.style.setProperty('--y', location.map.y);
    marker.style.setProperty('--marker', location.accent);
    marker.setAttribute('aria-label', `进入${location.title}：${location.venue}`);
    marker.innerHTML = `<span class="marker-number">${location.number}</span><span class="marker-label">${location.shortTitle}</span>`;
    marker.addEventListener('click', () => {
      map.querySelectorAll('.map-marker').forEach((item) => item.classList.remove('is-active'));
      marker.classList.add('is-active');
      map.classList.add('is-routing');
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.setTimeout(() => { window.location.href = `locations/${location.page || `${location.number}-${location.id}`}/`; }, reduced ? 0 : 520);
    });
    markerHost.append(marker);
  });
  const pointString = locations.map((location) => `${location.map.x},${location.map.y}`).join(' L ');
  path?.setAttribute('d', `M ${pointString}`);
  resetMap?.addEventListener('click', () => {
    map.classList.remove('is-routing');
    map.querySelectorAll('.map-marker').forEach((item) => item.classList.remove('is-active'));
    window.setTimeout(() => map.classList.add('is-routing'), 80);
  });
  try {
    const state = JSON.parse(localStorage.getItem('yanan1945.quiz.v1') || '{}');
    const count = Object.values(state.wrongQuestions || {}).filter((item) => !item.mastered).length;
    if (count) quizCount.textContent = `· ${count}题待复习`;
  } catch (_) { /* Local storage is optional for the map view. */ }
})();
