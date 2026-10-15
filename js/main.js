/* ============================================
   HANIWELLNESS — Coming Soon / Maintenance Shield
   ============================================ */
const MAINTENANCE_CONFIG = {
  // Set to false to immediately take the website live
  active: true,
  // URL query parameter for developer/client preview: ?preview=hani
  previewParam: 'preview',
  // Secret value to unlock preview mode
  previewSecret: 'hani',
  // Local storage key for persistent session
  storageKey: 'hw_preview_access'
};

(function initMaintenanceShield() {
  if (!MAINTENANCE_CONFIG.active) return;

  // 1. Process URL query parameters
  try {
    const params = new URLSearchParams(window.location.search);
    const queryVal = params.get(MAINTENANCE_CONFIG.previewParam);
    if (queryVal && queryVal.toLowerCase() === MAINTENANCE_CONFIG.previewSecret.toLowerCase()) {
      localStorage.setItem(MAINTENANCE_CONFIG.storageKey, 'granted');
    } else if (queryVal === 'reset' || queryVal === 'exit') {
      localStorage.removeItem(MAINTENANCE_CONFIG.storageKey);
    }
  } catch (err) {
    // Graceful fallback if storage or search params are restricted
  }

  // 2. Check preview access status
  let hasPreviewAccess = false;
  try {
    hasPreviewAccess = localStorage.getItem(MAINTENANCE_CONFIG.storageKey) === 'granted' ||
                       sessionStorage.getItem('hw_preview') === '1';
    if (hasPreviewAccess) {
      localStorage.setItem(MAINTENANCE_CONFIG.storageKey, 'granted');
      sessionStorage.setItem('hw_preview', '1');
    }
  } catch (err) {}

  // 3. If preview mode is granted, render floating preview badge and unblock site
  if (hasPreviewAccess) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mountPreviewBadge);
    } else {
      mountPreviewBadge();
    }
    return;
  }

  // 4. Otherwise, mount the Coming Soon luxury shield
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountShield);
  } else {
    mountShield();
  }

  function mountPreviewBadge() {
    if (document.getElementById('hw-preview-badge')) return;

    const badge = document.createElement('div');
    badge.id = 'hw-preview-badge';
    badge.innerHTML = `
      <span class="hw-preview-status">
        <span class="hw-status-dot"></span>
        Preview Mode
      </span>
      <button type="button" id="hw-exit-preview" title="Exit Preview Mode and return to Coming Soon">Exit Preview</button>
    `;
    document.body.appendChild(badge);

    const exitBtn = badge.querySelector('#hw-exit-preview');
    if (exitBtn) {
      exitBtn.addEventListener('click', function () {
        try {
          localStorage.removeItem(MAINTENANCE_CONFIG.storageKey);
          sessionStorage.removeItem('hw_preview');
        } catch (e) {}
        const isZh = window.location.pathname.includes('/zh/');
        window.location.href = isZh ? '../index.html' : 'index.html';
      });
    }
  }

  function mountShield() {
    if (document.getElementById('hw-maintenance-shield')) return;

    document.body.classList.add('hw-shield-active');

    const isChinesePage = window.location.pathname.includes('/zh/');
    let currentLang = isChinesePage ? 'zh' : 'en';

    const basePath = isChinesePage ? '../' : '';
    const qrSrc = basePath + 'images/line-qr-code-haniwellness.png';

    const content = {
      en: {
        pill: 'EST. TAIPEI · COMING SOON',
        title: 'Something Transformative<br><em>is Coming Soon</em>',
        desc: 'We are curating an elevated sanctuary dedicated to private personal training, aerial yoga, and professional color styling by Tsao Hani in Taipei.',
        cardTitle: 'Private Consultations &amp; Bookings Open',
        cardSubtitle: 'Xinyi Studio · Private Gym Sessions',
        qrAlt: 'LINE QR code to connect with Haniwellness',
        lineDesc: 'Scan or connect with Tsao Hani directly on LINE for bookings and consultations:',
        btnLine: 'Open LINE App',
        igBtn: 'Instagram (@hani_c1)',
        fbBtn: 'Facebook',
        services: 'Personal Training · Aerial Yoga · Color Analysis · Venue Rental',
        switchBtn: '切換至中文',
        secretHint: '(Click logo 3x for preview prompt)',
        footer: '&copy; ' + new Date().getFullYear() + ' Haniwellness &middot; Tsao Hani. All rights reserved.'
      },
      zh: {
        pill: '台北 · 全新蛻變 敬請期待',
        title: '身心靈的優雅昇華<br><em>即將盛大呈獻</em>',
        desc: '我們正在悉心籌備由 Tsao Hani 主理的頂級私人健身、空中瑜珈與個人色彩穿搭顧問體驗，帶給您由內而外的專屬自信。',
        cardTitle: '私人課程與色彩諮詢 正常預約中',
        cardSubtitle: '信義旗艦教室 · 內湖專業教室 · 到府尊爵私教',
        qrAlt: '加入 Haniwellness 官方 LINE 預約',
        lineDesc: '歡迎掃描下方 QR Code 或透過社群直接與 Hani 聯繫預約：',
        btnLine: '開啟 LINE',
        igBtn: 'Instagram (@hani_c1)',
        fbBtn: 'Facebook 專頁',
        services: '私人教練 · 空中瑜珈 · 孕婦體適能 · 個人色彩分析 · 私人場地租借',
        switchBtn: 'English',
        secretHint: '(點擊標誌 3 次開啟預覽通行碼)',
        footer: '&copy; ' + new Date().getFullYear() + ' Haniwellness &middot; 曹哈妮 Tsao Hani. 版權所有'
      }
    };

    const shield = document.createElement('div');
    shield.id = 'hw-maintenance-shield';
    shield.setAttribute('role', 'dialog');
    shield.setAttribute('aria-modal', 'true');
    shield.setAttribute('aria-label', 'Haniwellness Coming Soon');

    function render(lang) {
      const c = content[lang];
      shield.innerHTML = `
        <div class="hw-shield-container">
          <div class="hw-shield-topbar">
            <button type="button" class="hw-lang-toggle" id="hw-lang-btn" aria-label="Toggle language">${c.switchBtn}</button>
          </div>

          <div class="hw-shield-brand" id="hw-brand-logo" role="button" tabindex="0" title="${c.secretHint}">
            Hani<em>wellness</em>
          </div>

          <div class="hw-shield-tag">${c.pill}</div>

          <h1 class="hw-shield-title">${c.title}</h1>
          <p class="hw-shield-desc">${c.desc}</p>

          <div class="hw-shield-card">
            <h2 class="hw-card-title">${c.cardTitle}</h2>
            <p class="hw-card-subtitle">${c.cardSubtitle}</p>

            <div class="hw-qr-wrap">
              <img src="${qrSrc}" alt="${c.qrAlt}" width="130" height="130" class="hw-qr-img" />
            </div>

            <p class="hw-line-note">${c.lineDesc}</p>
          </div>

          <div class="hw-shield-footer">${c.footer}</div>
        </div>
      `;

      // Language switcher click handler
      const langBtn = shield.querySelector('#hw-lang-btn');
      if (langBtn) {
        langBtn.addEventListener('click', function () {
          currentLang = currentLang === 'en' ? 'zh' : 'en';
          render(currentLang);
        });
      }

      // Triple-click on brand logo for secret unlock
      const brandLogo = shield.querySelector('#hw-brand-logo');
      if (brandLogo) {
        let clicks = 0;
        let timer = null;
        brandLogo.addEventListener('click', function () {
          clicks++;
          clearTimeout(timer);
          timer = setTimeout(function () { clicks = 0; }, 600);
          if (clicks >= 3) {
            clicks = 0;
            const entered = prompt('Enter preview passphrase:');
            if (entered && entered.trim().toLowerCase() === MAINTENANCE_CONFIG.previewSecret.toLowerCase()) {
              try {
                localStorage.setItem(MAINTENANCE_CONFIG.storageKey, 'granted');
              } catch (e) {}
              window.location.reload();
            } else if (entered !== null) {
              alert('Incorrect passphrase');
            }
          }
        });
      }
    }

    render(currentLang);
    document.body.appendChild(shield);
  }
})();

/* ============================================
   HANIWELLNESS — Site Navigation & Interactions
   ============================================ */
(function () {
  'use strict';

  // ── Nav scroll behaviour ──────────────────
  const siteNav = document.querySelector('.site-nav');
  if (siteNav) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        siteNav.classList.add('scrolled');
      } else {
        siteNav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile hamburger ──────────────────────
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Active nav link ───────────────────────
  const currentPath = window.location.pathname.replace(/\/$/, '');
  document.querySelectorAll('.nav-links a, .nav-mobile-menu a').forEach(function (link) {
    const linkPath = link.getAttribute('href').replace(/\/$/, '');
    if (linkPath === currentPath || (currentPath === '' && linkPath === '/index.html')) {
      link.classList.add('active');
    }
  });

  // ── Intersection Observer — reveal ────────
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealElements.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Fallback: show all immediately
    revealElements.forEach(function (el) { el.classList.add('visible'); });
  }
})();
