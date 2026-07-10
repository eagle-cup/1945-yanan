/* ============================================
   1945延安 · 子网页公共JS
   共享功能：人物详情弹窗、音频播放、页面滚动等
   ============================================ */

/**
 * 人物详情弹窗管理器
 */
class CharacterModal {
  constructor() {
    this.overlay = document.getElementById('character-overlay');
    this.content = document.getElementById('character-detail');
    this.closeBtn = document.getElementById('overlay-close-btn');
    this._bindEvents();
  }

  _bindEvents() {
    this.closeBtn?.addEventListener('click', () => this.close());
    this.overlay?.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    // ESC 关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay?.classList.contains('active')) {
        this.close();
      }
    });
  }

  open(characterData) {
    if (!this.overlay || !this.content) return;
    this.content.innerHTML = this._renderDetail(characterData);
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    // 绑定详情页内的音频按钮
    setTimeout(() => this._bindAudioInModal(), 100);
  }

  close() {
    if (!this.overlay) return;
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
    // 停止所有音频
    AudioPlayer.stopAll();
  }

  _renderDetail(c) {
    return `
      <div class="char-detail">
        <img src="${c.avatar || '../assets/images/characters/placeholder.png'}"
             alt="${c.name}" class="char-detail-avatar"
             onerror="this.style.display='none'">
        <h2 class="char-detail-name">${c.name}</h2>
        <p class="char-detail-years">${c.years || ''}</p>
        <p class="char-detail-role">${c.role || ''}</p>

        <div class="divider-gold"></div>

        <div class="char-detail-bio">
          ${(c.bio || '').split('\n').filter(Boolean).map(p => `<p>${p}</p>`).join('')}
        </div>

        ${c.quote ? `
        <div class="char-quote-block">
          <p class="char-quote-text">"${c.quote}"</p>
          ${c.audio ? `
          <button class="audio-btn char-quote-audio" data-audio="${c.audio}" title="点击播放原声">
            🔊
          </button>` : ''}
        </div>` : ''}
      </div>
    `;
  }

  _bindAudioInModal() {
    document.querySelectorAll('.char-quote-audio').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', () => {
        const audioUrl = btn.dataset.audio;
        AudioPlayer.toggle(btn, audioUrl);
      });
    });
  }
}

/**
 * 音频播放器（单例，全局只允许一个在播放）
 */
const AudioPlayer = {
  currentAudio: null,
  currentBtn: null,

  toggle(btn, url) {
    if (this.currentBtn === btn) {
      // 点击同一个按钮 = 暂停/继续
      if (this.currentAudio && !this.currentAudio.paused) {
        this.currentAudio.pause();
        btn.classList.remove('playing');
        btn.textContent = '🔊';
      } else if (this.currentAudio) {
        this.currentAudio.play();
        btn.classList.add('playing');
        btn.textContent = '⏸';
      }
      return;
    }
    // 停止之前的
    this.stopAll();
    // 播放新的
    this.currentAudio = new Audio(url);
    this.currentBtn = btn;
    btn.classList.add('playing');
    btn.textContent = '⏸';
    this.currentAudio.play();
    this.currentAudio.addEventListener('ended', () => this.stopAll());
    this.currentAudio.addEventListener('error', () => {
      btn.classList.remove('playing');
      btn.textContent = '⚠️';
      setTimeout(() => { btn.textContent = '🔊'; }, 2000);
    });
  },

  stopAll() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (this.currentBtn) {
      this.currentBtn.classList.remove('playing');
      this.currentBtn.textContent = '🔊';
      this.currentBtn = null;
    }
  }
};

/**
 * 平滑滚动到下一个全屏页
 */
function scrollToNext() {
  const pages = document.querySelectorAll('.fullscreen-page');
  const currentScroll = window.scrollY;
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].offsetTop > currentScroll + 10) {
      pages[i].scrollIntoView({ behavior: 'smooth' });
      return;
    }
  }
}

/**
 * 页面初始化
 */
document.addEventListener('DOMContentLoaded', () => {
  // 初始化人物弹窗
  window.charModal = new CharacterModal();

  // 人物卡片点击事件（委托）
  document.querySelectorAll('.character-card').forEach(card => {
    card.addEventListener('click', function() {
      const name = this.dataset.name;
      const years = this.dataset.years;
      const role = this.dataset.role;
      const bio = this.dataset.bio;
      const quote = this.dataset.quote;
      const audio = this.dataset.audio;
      const avatar = this.dataset.avatar;

      window.charModal.open({ name, years, role, bio, quote, audio, avatar });
    });
  });

  // 独立音频按钮
  document.querySelectorAll('.audio-btn[data-audio]').forEach(btn => {
    if (btn.closest('#character-detail')) return; // 弹窗内的由弹窗管理
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      AudioPlayer.toggle(this, this.dataset.audio);
    });
  });

  // 点击滚动提示 → 滚动到下一页
  document.querySelectorAll('.scroll-hint').forEach(hint => {
    hint.addEventListener('click', scrollToNext);
  });
});
