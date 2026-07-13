(() => {
  const app = document.getElementById('location-app');
  if (!app || !window.YananData) return;

  const location = window.YananData.locations.find((item) => item.id === document.body.dataset.location);
  if (!location) {
    app.innerHTML = '<p class="page-not-found">未找到这个历史地点。</p>';
    return;
  }
  const icon = window.YananIcons;
  const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
  document.title = `${location.title}｜1945延安`;
  document.documentElement.style.setProperty('--accent', location.accent);
  document.documentElement.style.setProperty('--accent-soft', location.accentSoft);

  const portrait = (person, mode = 'card') => {
    if (!person.portrait) {
      return `<div class="portrait-fallback ${mode === 'detail' ? 'detail-fallback' : ''}" aria-hidden="true"><span>${esc(person.name.slice(0, 1))}</span><small>肖像待确认</small></div>`;
    }
    return `<img src="${esc(person.portrait)}" alt="${esc(person.name)}肖像" style="object-position:${esc(person.portraitPosition || 'center top')}" onerror="this.closest('.person-photo, .dialog-portrait').classList.add('has-image-error')">`;
  };

  const card = (person, index) => `
    <article class="person-card">
      <button class="person-open" type="button" data-person="${index}" aria-label="查看${esc(person.name)}的人物档案">
        <span class="person-photo">${portrait(person)}</span>
        <span class="person-copy"><strong>${esc(person.name)}</strong><small>${esc(person.role)}</small></span>
      </button>
      ${person.audio ? `<button class="person-audio" type="button" data-audio="${esc(person.audio)}" aria-pressed="false" aria-label="播放${esc(person.name)}${esc(person.audioKind)}" title="播放录音">${icon('volume-2')}<span class="visually-hidden">播放录音</span></button>` : ''}
    </article>`;

  const peopleCount = location.people.length;
  const videoMarkup = location.videoSrc
    ? `<video class="history-video" controls playsinline preload="metadata" poster="${esc(location.videoPoster || location.coverImage)}" aria-label="播放${esc(location.videoLabel || location.title)}"><source src="${esc(location.videoSrc)}" type="video/mp4">当前浏览器无法播放此视频。</video>`
    : `<div class="video-preview" role="img" aria-label="${esc(location.title)}相关影像预览位，当前无可播放视频"><img src="${esc(location.videoPoster || location.coverImage)}" alt="" onerror="this.classList.add('is-hidden')"><div class="video-overlay"><span class="video-status">${icon('play')}</span><p>影像预览位</p><small>待补入本地视频后自动启用</small></div><span class="video-time">00:00</span></div>`;

  app.innerHTML = `
    <section class="location-section cover-section" id="cover">
      <img class="cover-photo" src="${esc(location.coverImage)}" alt="" style="object-position:${esc(location.coverPosition || 'center')}" onerror="this.classList.add('is-hidden')">
      <nav class="top-nav" aria-label="页面导航">
        <a class="back-map" href="../../index.html" aria-label="返回历史地图">${icon('arrow-left')}<span>地图</span></a>
        <span class="place-number">地点 ${location.number}</span>
      </nav>
      <div class="cover-content">
        <p class="cover-kicker">${esc(location.venue)}</p>
        <h1 class="location-title">${esc(location.title)}</h1>
        <p class="location-theme">${esc(location.theme)}</p>
        <p class="location-date">${esc(location.date)} <i></i> ${esc(location.month)}</p>
      </div>
      <a class="next-section" href="#people"><span>进入人物志</span><b aria-hidden="true">↓</b></a>
      <span class="cover-credit">${esc(location.coverCredit)}</span>
    </section>

    <section class="location-section people-section people-count-${peopleCount}" id="people" aria-labelledby="people-heading">
      <div class="people-ornaments" aria-hidden="true"><span></span><span></span><span></span></div>
      <header class="section-header">
        <p>人物志 · 在场的人</p>
        <h2 id="people-heading">把目光交给<br>具体的人</h2>
        <small>点击相框进入完整档案</small>
      </header>
      <div class="people-grid">${location.people.map(card).join('')}</div>
    </section>

    <section class="location-section video-section" id="video" aria-labelledby="video-heading">
      <div class="video-wrap">
        <p class="section-label">历史影像预览</p>
        <h2 id="video-heading">${location.videoSrc ? '历史影像' : '等待影像入场'}</h2>
        ${videoMarkup}
        <p class="video-caption">${esc(location.videoCaption)}</p>
      </div>
    </section>
    <dialog class="person-dialog" id="person-dialog" aria-labelledby="dialog-name"><div class="dialog-scroll" id="dialog-content"></div></dialog>`;

  const dialog = document.getElementById('person-dialog');
  const dialogContent = document.getElementById('dialog-content');
  let activeAudio = null;
  let activeButton = null;

  const stopAudio = () => {
    if (activeAudio) { activeAudio.pause(); activeAudio.currentTime = 0; activeAudio = null; }
    if (activeButton) { activeButton.classList.remove('is-playing'); activeButton.setAttribute('aria-pressed', 'false'); activeButton = null; }
  };
  const toggleAudio = (button, source) => {
    if (!source) return;
    if (activeButton === button && activeAudio) {
      if (activeAudio.paused) {
        activeAudio.play().then(() => button.classList.add('is-playing')).catch(stopAudio);
      } else {
        activeAudio.pause();
        button.classList.remove('is-playing');
        button.setAttribute('aria-pressed', 'false');
      }
      return;
    }
    stopAudio();
    const audio = new Audio(source);
    activeAudio = audio;
    activeButton = button;
    audio.addEventListener('ended', stopAudio, { once: true });
    audio.addEventListener('error', stopAudio, { once: true });
    audio.play().then(() => { button.classList.add('is-playing'); button.setAttribute('aria-pressed', 'true'); }).catch(stopAudio);
  };
  const openPerson = (person) => {
    const audioControl = person.audio ? `<button class="detail-audio" type="button" data-audio="${esc(person.audio)}" aria-pressed="false">${icon('volume-2')}<span>播放${esc(person.audioKind)}</span></button>` : '';
    dialogContent.innerHTML = `
      <button class="dialog-close" type="button" aria-label="关闭人物档案">${icon('x')}</button>
      <section class="dialog-portrait">${portrait(person, 'detail')}<div class="dialog-title"><p>人物档案</p><h2 id="dialog-name">${esc(person.name)}</h2><span>${esc(person.years)}</span></div></section>
      <article class="dialog-body">
        <p class="dialog-role">${esc(person.role)}</p>
        <div class="dialog-bio"><p>${esc(person.eventSummary)}</p><p>${esc(person.significance)}</p></div>
        <section class="quote-box" aria-label="相关史料"><p>“${esc(person.quote)}”</p><small>${esc(person.source)}</small>${audioControl}</section>
        <p class="portrait-credit">肖像：${esc(person.portraitCredit)}</p>
      </article>`;
    dialog.showModal();
    dialog.querySelector('.dialog-close')?.focus();
  };

  app.addEventListener('click', (event) => {
    const audioButton = event.target.closest('[data-audio]');
    if (audioButton) { event.stopPropagation(); toggleAudio(audioButton, audioButton.dataset.audio); return; }
    if (event.target.closest('.dialog-close') || event.target === dialog) { stopAudio(); dialog.close(); return; }
    const cardButton = event.target.closest('.person-open');
    if (cardButton) openPerson(location.people[Number(cardButton.dataset.person)]);
  });
  dialog.addEventListener('cancel', () => stopAudio());
  dialog.addEventListener('close', stopAudio);
  window.addEventListener('pagehide', stopAudio);
})();
