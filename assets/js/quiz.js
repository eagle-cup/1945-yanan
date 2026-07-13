(() => {
  const app = document.getElementById('quiz-app');
  const questions = window.YananQuestionBank || [];
  const locations = window.YananData?.locations || [];
  if (!app || !questions.length) return;

  const KEY = 'yanan1945.quiz.v1';
  const VERSION = 1;
  const icon = window.YananIcons;
  let timer = null;
  let session = null;
  let currentResult = null;

  const blankState = () => ({ version: VERSION, attempts: [], wrongQuestions: {}, masteredQuestions: {}, bestScore: 0, active: null, practiceProgress: {} });
  const load = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) || 'null');
      return parsed?.version === VERSION ? { ...blankState(), ...parsed } : blankState();
    } catch (_) { return blankState(); }
  };
  let state = load();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { /* The quiz can run without storage. */ } };
  const escape = (value = '') => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
  const answerLetter = (index) => String.fromCharCode(65 + index);
  const byId = (id) => questions.find((question) => question.id === id);
  const location = (id) => locations.find((item) => item.id === id);
  const activeWrongs = () => Object.values(state.wrongQuestions).filter((item) => !item.mastered);
  const clearTimer = () => { if (timer) { window.clearInterval(timer); timer = null; } };
  const header = (eyebrow, title, right = '') => `
    <header class="quiz-header"><a class="quiz-icon" href="../index.html" aria-label="返回历史地图" title="返回地图">${icon('map')}</a><div><p>${eyebrow}</p><h1>${title}</h1></div>${right}</header>`;

  function recordWrong(question, selectedIndex) {
    const existing = state.wrongQuestions[question.id];
    state.wrongQuestions[question.id] = {
      questionId: question.id,
      selectedIndex,
      incorrectCount: (existing?.incorrectCount || 0) + 1,
      reviewCount: existing?.reviewCount || 0,
      lastAnsweredAt: new Date().toISOString(),
      mastered: false
    };
  }

  function home() {
    clearTimer();
    session = null;
    currentResult = null;
    const wrongCount = activeWrongs().length;
    const active = state.active && state.active.deadline > Date.now();
    app.innerHTML = `
      <section class="quiz-shell">
        ${header('1945 · 延安', '知识挑战', `<button class="quiz-icon" type="button" data-action="open-notebook" aria-label="打开错题本" title="错题本">${icon('book-open')}</button>`)}
        <p class="quiz-lead">用一场短测验，检验你已经抵达的历史现场。</p>
        <div class="quiz-stat-row"><span>35道史料题</span><i></i><span>20分钟模拟</span><i></i><span>单选题</span></div>
        <section class="quiz-primary-card">
          <div><p>模拟考试</p><h2>20题 · 100分</h2><small>随机抽题；考试中不显示对错</small></div>
          <button class="round-command" type="button" data-action="${active ? 'resume-exam' : 'start-exam'}" aria-label="${active ? '继续模拟考试' : '开始模拟考试'}">${active ? icon('clock') : icon('play')}</button>
        </section>
        <div class="quiz-section-title"><h2>地点题库</h2><span>每处5题</span></div>
        <div class="topic-grid">${locations.map((item) => `<button type="button" class="topic-card" data-action="start-topic" data-location="${item.id}" style="--topic:${item.accent}"><span>${item.number}</span><strong>${escape(item.shortTitle)}</strong><small>${state.practiceProgress[item.id] ? `已练 ${state.practiceProgress[item.id]}/5` : '开始练习'}</small></button>`).join('')}</div>
        <section class="notebook-teaser"><div><p>错题复习</p><strong>${wrongCount} <small>题待回看</small></strong></div><button type="button" data-action="open-notebook">进入</button></section>
      </section>`;
  }

  function startExam() {
    clearTimer();
    const randomized = [...questions].sort(() => Math.random() - .5).slice(0, 20).map((item) => item.id);
    state.active = { ids: randomized, answers: {}, index: 0, startedAt: Date.now(), deadline: Date.now() + 20 * 60 * 1000 };
    save();
    renderExam();
  }
  function resumeExam() {
    if (!state.active) return startExam();
    if (state.active.deadline <= Date.now()) return finishExam(true);
    renderExam();
  }
  function renderExam() {
    clearTimer();
    const active = state.active;
    if (!active) return home();
    const examQuestions = active.ids.map(byId).filter(Boolean);
    const index = Math.min(active.index, examQuestions.length - 1);
    const question = examQuestions[index];
    const selected = active.answers[question.id];
    const answerCount = Object.keys(active.answers).length;
    const renderClock = () => {
      const target = app.querySelector('[data-clock]');
      const remaining = Math.max(0, active.deadline - Date.now());
      const minutes = String(Math.floor(remaining / 60000)).padStart(2, '0');
      const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');
      if (target) target.textContent = `${minutes}:${seconds}`;
      if (remaining <= 0) finishExam(true);
    };
    app.innerHTML = `
      <section class="quiz-shell exam-shell">
        ${header('模拟考试', `第 ${index + 1} 题`, `<span class="quiz-clock" data-clock>${'20:00'}</span>`)}
        <div class="exam-progress"><span style="width:${(answerCount / examQuestions.length) * 100}%"></span></div>
        <p class="exam-meta">已作答 ${answerCount} / ${examQuestions.length} <span>${location(question.locationId)?.shortTitle || ''}</span></p>
        ${questionView(question, selected, 'exam')}
        <div class="exam-controls"><button type="button" class="quiet-button" data-action="exam-prev" ${index === 0 ? 'disabled' : ''}>上一题</button><span>${index + 1} / ${examQuestions.length}</span><button type="button" class="quiet-button" data-action="exam-next" ${index === examQuestions.length - 1 ? 'disabled' : ''}>下一题</button></div>
        <button class="submit-exam" type="button" data-action="submit-exam">交卷 <small>剩余 ${examQuestions.length - answerCount} 题未答</small></button>
      </section>`;
    renderClock();
    timer = window.setInterval(renderClock, 500);
  }

  function questionView(question, selected, mode, feedback = null) {
    return `<article class="question-card ${feedback ? `is-${feedback.correct ? 'correct' : 'wrong'}` : ''}">
      <p class="question-location">${escape(location(question.locationId)?.title || '')}</p>
      <h2>${escape(question.stem)}</h2>
      <div class="answers">${question.options.map((option, index) => {
        const isSelected = selected === index;
        const isCorrect = feedback && index === question.answerIndex;
        const isWrong = feedback && isSelected && index !== question.answerIndex;
        return `<button type="button" class="answer-option ${isSelected ? 'is-selected' : ''} ${isCorrect ? 'is-correct' : ''} ${isWrong ? 'is-wrong' : ''}" data-action="choose-answer" data-index="${index}" ${feedback ? 'disabled' : ''}><b>${answerLetter(index)}</b><span>${escape(option)}</span></button>`;
      }).join('')}</div>
      ${feedback ? `<div class="answer-feedback"><strong>${feedback.correct ? '回答正确' : '这一题先记下'}</strong><p>${escape(question.explanation)}</p><small>依据：${escape(question.source)}</small></div>` : ''}
    </article>`;
  }

  function chooseExamAnswer(index) {
    const active = state.active;
    const question = byId(active.ids[active.index]);
    active.answers[question.id] = index;
    save();
    renderExam();
  }
  function finishExam(isTimeout = false) {
    clearTimer();
    const active = state.active;
    if (!active) return home();
    const examQuestions = active.ids.map(byId).filter(Boolean);
    const answers = active.answers;
    let correct = 0;
    examQuestions.forEach((question) => {
      const selected = answers[question.id];
      if (selected === question.answerIndex) correct += 1;
      else recordWrong(question, selected);
    });
    const score = correct * 5;
    const attempt = { completedAt: new Date().toISOString(), score, correct, total: examQuestions.length, ids: active.ids, answers, timeout: isTimeout };
    state.attempts.unshift(attempt);
    state.attempts = state.attempts.slice(0, 12);
    state.bestScore = Math.max(state.bestScore || 0, score);
    state.active = null;
    save();
    currentResult = { ...attempt, questions: examQuestions };
    renderResult();
  }
  function renderResult() {
    if (!currentResult) return home();
    const result = currentResult;
    const grade = result.score >= 90 ? '优秀' : result.score >= 70 ? '良好' : result.score >= 60 ? '通过' : '建议复习';
    const breakdown = locations.map((item) => {
      const list = result.questions.filter((question) => question.locationId === item.id);
      const hits = list.filter((question) => result.answers[question.id] === question.answerIndex).length;
      return { item, hits, total: list.length };
    }).filter((item) => item.total).sort((a, b) => (a.hits / a.total) - (b.hits / b.total));
    app.innerHTML = `
      <section class="quiz-shell result-shell">
        ${header(result.timeout ? '时间到，已自动交卷' : '本次模拟结果', '答卷报告', `<a class="quiz-icon" href="../index.html" aria-label="返回历史地图">${icon('map')}</a>`)}
        <div class="score-panel"><div class="score-ring"><strong>${result.score}</strong><span>/ 100</span></div><div><p>${grade}</p><h2>${result.correct} / ${result.total} 题正确</h2><small>最高分 ${state.bestScore} 分</small></div></div>
        <section class="weak-panel"><h2>地点掌握度</h2>${breakdown.map(({ item, hits, total }) => `<div><span>${escape(item.shortTitle)}</span><b>${hits}/${total}</b><i><em style="width:${(hits / total) * 100}%"></em></i></div>`).join('')}</section>
        <section class="result-actions"><button type="button" data-action="start-exam">再测一次</button><button type="button" class="quiet-button" data-action="open-notebook">查看错题</button></section>
        <section class="analysis-list"><h2>逐题解析</h2>${result.questions.map((question, index) => { const selected = result.answers[question.id]; const correct = selected === question.answerIndex; return `<details ${correct ? '' : 'open'}><summary><b class="${correct ? 'right' : 'wrong'}">${correct ? '对' : '错'}</b><span>${index + 1}. ${escape(question.stem)}</span></summary><p>你的答案：${selected === undefined ? '未作答' : `${answerLetter(selected)}. ${escape(question.options[selected])}`}</p><p>正确答案：${answerLetter(question.answerIndex)}. ${escape(question.options[question.answerIndex])}</p><p>${escape(question.explanation)}</p><small>依据：${escape(question.source)}</small></details>`; }).join('')}</section>
      </section>`;
  }

  function startTopic(locationId, mode = 'topic') {
    clearTimer();
    const ids = mode === 'wrong' ? activeWrongs().map((item) => item.questionId) : questions.filter((question) => question.locationId === locationId).map((question) => question.id);
    if (!ids.length) return renderNotebook();
    session = { mode, locationId, ids, index: 0, answered: {} };
    renderPractice();
  }
  function renderPractice() {
    const question = byId(session.ids[session.index]);
    if (!question) return home();
    const selected = session.answered[question.id];
    const feedback = selected === undefined ? null : { correct: selected === question.answerIndex };
    const title = session.mode === 'wrong' ? '错题重做' : location(session.locationId).title;
    app.innerHTML = `
      <section class="quiz-shell practice-shell">
        ${header(session.mode === 'wrong' ? '错题复习' : '地点题库', title, `<button class="quiz-icon" type="button" data-action="go-home" aria-label="返回知识挑战首页" title="返回首页">${icon('x')}</button>`)}
        <div class="practice-progress"><span>第 ${session.index + 1} 题 / ${session.ids.length}</span><i><b style="width:${(session.index / session.ids.length) * 100}%"></b></i></div>
        ${questionView(question, selected, 'practice', feedback)}
        ${feedback ? `<div class="practice-next"><button type="button" data-action="practice-next">${session.index === session.ids.length - 1 ? '完成练习' : '下一题'}</button></div>` : ''}
      </section>`;
  }
  function choosePracticeAnswer(index) {
    const question = byId(session.ids[session.index]);
    if (session.answered[question.id] !== undefined) return;
    session.answered[question.id] = index;
    const correct = index === question.answerIndex;
    if (!correct) recordWrong(question, index);
    else if (session.mode === 'wrong' && state.wrongQuestions[question.id]) state.wrongQuestions[question.id].reviewCount += 1;
    if (session.mode === 'topic') state.practiceProgress[question.locationId] = Math.max(state.practiceProgress[question.locationId] || 0, session.index + 1);
    save();
    renderPractice();
  }
  function advancePractice() {
    if (session.index >= session.ids.length - 1) return session.mode === 'wrong' ? renderNotebook() : home();
    session.index += 1;
    renderPractice();
  }
  function renderNotebook() {
    clearTimer();
    session = null;
    const entries = activeWrongs().map((entry) => ({ entry, question: byId(entry.questionId) })).filter((item) => item.question);
    const mastered = Object.values(state.wrongQuestions).filter((item) => item.mastered).length;
    app.innerHTML = `
      <section class="quiz-shell notebook-shell">
        ${header('错题复习', '回看与掌握', `<button class="quiz-icon" type="button" data-action="go-home" aria-label="返回知识挑战首页" title="返回首页">${icon('x')}</button>`)}
        <p class="notebook-summary">${entries.length ? `有 ${entries.length} 道题值得再看一遍。` : '暂时没有待复习题，继续探索吧。'}</p>
        ${entries.length ? `<div class="notebook-actions"><button type="button" data-action="redo-wrong">重做全部</button><button type="button" class="quiet-button" data-action="clear-wrong">清空记录</button></div><div class="wrong-list">${entries.map(({ entry, question }) => `<article><p>${escape(location(question.locationId)?.shortTitle || '')}</p><h2>${escape(question.stem)}</h2><small>上次选择 ${entry.selectedIndex === undefined ? '未作答' : answerLetter(entry.selectedIndex)} · 已错 ${entry.incorrectCount} 次${entry.reviewCount ? ` · 已复习 ${entry.reviewCount} 次` : ''}</small><div><button type="button" data-action="redo-one" data-id="${question.id}">重做</button><button type="button" class="quiet-button" data-action="master" data-id="${question.id}">${icon('check')}标记掌握</button></div></article>`).join('')}</div>` : `<div class="empty-notebook">${icon('check')}<p>没有待复习的错题</p></div>`}
        ${mastered ? `<p class="mastered-count">已标记掌握 ${mastered} 题</p>` : ''}
      </section>`;
  }

  app.addEventListener('click', (event) => {
    const control = event.target.closest('[data-action]');
    if (!control || control.disabled) return;
    const action = control.dataset.action;
    if (action === 'go-home') return home();
    if (action === 'start-exam') return startExam();
    if (action === 'resume-exam') return resumeExam();
    if (action === 'exam-prev') { state.active.index -= 1; save(); return renderExam(); }
    if (action === 'exam-next') { state.active.index += 1; save(); return renderExam(); }
    if (action === 'choose-answer') return session ? choosePracticeAnswer(Number(control.dataset.index)) : chooseExamAnswer(Number(control.dataset.index));
    if (action === 'submit-exam') { if (window.confirm('现在交卷吗？未作答题将按错误计入错题本。')) finishExam(); return; }
    if (action === 'start-topic') return startTopic(control.dataset.location);
    if (action === 'practice-next') return advancePractice();
    if (action === 'open-notebook') return renderNotebook();
    if (action === 'redo-wrong') return startTopic(null, 'wrong');
    if (action === 'redo-one') { session = { mode: 'wrong', locationId: null, ids: [control.dataset.id], index: 0, answered: {} }; return renderPractice(); }
    if (action === 'master') { const entry = state.wrongQuestions[control.dataset.id]; if (entry) { entry.mastered = true; state.masteredQuestions[control.dataset.id] = new Date().toISOString(); save(); } return renderNotebook(); }
    if (action === 'clear-wrong') { if (window.confirm('确定清空全部错题记录吗？此操作不可撤销。')) { state.wrongQuestions = {}; state.masteredQuestions = {}; save(); } return renderNotebook(); }
  });

  if (state.active && state.active.deadline <= Date.now()) finishExam(true);
  else home();
})();
