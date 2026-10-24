/*
 * Mignuance 共通サイドバー（2026-10-25）
 * Mignuanceアプリの左メニュー（スマホは下タブ）と同じ見た目を、ほかのアプリにも入れる部品。
 * 使い方：
 *   <script src="https://honeymignon00-lab.github.io/staff/_common/mside.js"></script>
 *   MSide.mount({
 *     app: '観光プラン',                 // 左上に出すアプリ名
 *     items: [{ id:'plan', icon:'clock', label:'予定', short:'予定', badge:0 }, ...],
 *     links: [{ icon:'brand-notion', label:'Notionで開く', href:'https://...' }],  // 下に置く外部リンク（任意）
 *     active: 'plan',
 *     onSelect: function (id) { ... },   // 項目を押したとき
 *     theme: 'auto' | 'light',           // 中身が明るい色だけのアプリは 'light'
 *     homeTarget: '_top'                 // 「Mignuanceに戻る」の開き方
 *   });
 *   MSide.update({ items: [...], active: 'shop' });  // 件数や選択の切り替え
 * アイコン名は Tabler Icons（https://tabler.io/icons）。
 * ここを直すと、この部品を使っている全アプリの見た目が一度に変わる。
 */
(function () {
  if (window.MSide) return;
  var HOME = 'https://honeymignon00-lab.github.io/staff/mignuance/';
  var cfg = null, root = null;

  var CSS = [
    ':root{--ms-ground:#F3F4F8;--ms-surface:#FFFFFF;--ms-surface-2:#FAFBFD;--ms-ink:#14161F;--ms-muted:#5A6178;--ms-faint:#8A91A4;--ms-line:#E1E4EC;--ms-accent:#C97A20;--ms-accent-soft:#FBF1E2;--ms-alert:#D0353B;--ms-shadow:0 1px 2px rgba(20,22,31,.05),0 8px 24px -16px rgba(20,22,31,.25)}',
    '@media (prefers-color-scheme:dark){html:not(.ms-light){--ms-ground:#0F1118;--ms-surface:#181B24;--ms-surface-2:#1E212B;--ms-ink:#ECEEF4;--ms-muted:#99A1B3;--ms-faint:#6E7688;--ms-line:#272B36;--ms-accent:#E2A25C;--ms-accent-soft:#2A2119;--ms-alert:#FF5F66;--ms-shadow:0 1px 2px rgba(0,0,0,.4),0 8px 24px -16px rgba(0,0,0,.8)}}',
    '.ms-side{position:fixed;left:0;top:0;bottom:0;width:188px;z-index:60;box-sizing:border-box;padding:18px 10px;border-right:1px solid var(--ms-line);background:var(--ms-surface-2);display:flex;flex-direction:column;gap:2px;overflow-y:auto;font-family:"Zen Kaku Gothic New","Hiragino Kaku Gothic ProN",system-ui,sans-serif;-webkit-font-smoothing:antialiased}',
    '.ms-brand{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:10px;letter-spacing:.16em;color:var(--ms-faint);padding:0 10px 4px}',
    '.ms-app{font-size:14px;font-weight:700;color:var(--ms-ink);padding:0 10px 12px;line-height:1.35}',
    '.ms-nav{display:flex;align-items:center;gap:8px;width:100%;box-sizing:border-box;border:0;background:transparent;color:var(--ms-muted);font:500 13.5px/1.4 inherit;font-family:inherit;padding:7px 10px;border-radius:9px;text-align:left;cursor:pointer;text-decoration:none;white-space:nowrap;position:relative}',
    '.ms-nav:hover{background:var(--ms-surface);color:var(--ms-ink)}',
    '.ms-nav.on{background:var(--ms-surface);color:var(--ms-ink);box-shadow:var(--ms-shadow)}',
    '.ms-nav i.ti{font-size:18px;width:19px;flex:0 0 auto;text-align:center;color:var(--ms-faint)}',
    '.ms-nav.on i.ti{color:var(--ms-accent)}',
    '.ms-nav:hover i.ti{color:var(--ms-ink)}',
    '.ms-nav .ms-l{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}',
    '.ms-nav .ms-s{display:none}',
    '.ms-nav .ms-x{font-size:11px;color:var(--ms-faint)}',
    '.ms-b{min-width:20px;height:20px;padding:0 6px;box-sizing:border-box;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font:600 11px/1 "IBM Plex Mono",monospace;background:var(--ms-alert);color:#fff}',
    '.ms-home{border:1px solid var(--ms-line);background:var(--ms-surface);margin-bottom:6px}',
    '.ms-sep{height:1px;background:var(--ms-line);margin:8px 10px}',
    '.ms-sp{flex:1}',
    'html.ms-on body{padding-left:188px !important}',
    '@media (max-width:760px){',
    '  html.ms-on body{padding-left:0 !important;padding-bottom:calc(84px + env(safe-area-inset-bottom)) !important}',
    '  .ms-side{top:auto;right:0;bottom:0;width:auto;height:auto;flex-direction:row;gap:0;padding:8px 4px calc(10px + env(safe-area-inset-bottom));border-right:0;border-top:1px solid var(--ms-line);background:var(--ms-surface);box-shadow:0 -6px 18px -12px rgba(0,0,0,.3);overflow-x:auto;overflow-y:hidden;scrollbar-width:none}',
    '  .ms-side::-webkit-scrollbar{display:none}',
    '  .ms-brand,.ms-app,.ms-sp,.ms-link{display:none}',
    '  .ms-sep{width:1px;height:36px;margin:8px 2px 0;flex:0 0 auto}',
    '  .ms-nav{flex:1 0 auto;min-width:58px;width:auto;flex-direction:column;justify-content:center;gap:2px;padding:6px 8px;font-size:10.5px;text-align:center;border-radius:10px}',
    '  .ms-nav i.ti{font-size:23px;width:auto}',
    '  .ms-nav .ms-l{display:none}.ms-nav .ms-s{display:block;white-space:nowrap}',
    '  .ms-nav.on{box-shadow:none;background:var(--ms-accent-soft);color:var(--ms-accent)}',
    '  .ms-home{border:0;background:transparent;margin:0}',
    '  .ms-nav .ms-b{position:absolute;top:-2px;left:calc(50% + 4px);min-width:17px;height:17px;font-size:10px;padding:0 4px}',
    '}'
  ].join('\n');

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function addHead() {
    if (document.getElementById('ms-css')) return;
    var h = document.head || document.documentElement;
    if (!document.querySelector('link[href*="tabler-icons"]')) {
      var l = document.createElement('link'); l.rel = 'stylesheet';
      l.href = 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css';
      h.appendChild(l);
    }
    if (!document.querySelector('link[href*="Zen+Kaku+Gothic+New"]')) {
      var f = document.createElement('link'); f.rel = 'stylesheet';
      f.href = 'https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@500;700&family=IBM+Plex+Mono:wght@500;600&display=swap';
      h.appendChild(f);
    }
    var s = document.createElement('style'); s.id = 'ms-css'; s.textContent = CSS; h.appendChild(s);
  }

  function navHTML(it, on) {
    var b = it.badge ? '<span class="ms-b">' + esc(it.badge) + '</span>' : '';
    return '<button type="button" class="ms-nav' + (on ? ' on' : '') + '" data-ms="' + esc(it.id) + '"' + (it.title ? ' title="' + esc(it.title) + '"' : '') + '>'
      + '<i class="ti ti-' + esc(it.icon || 'point') + '"></i><span class="ms-l">' + esc(it.label) + '</span><span class="ms-s">' + esc(it.short || it.label) + '</span>' + b + '</button>';
  }

  function draw() {
    if (!root) return;
    var c = cfg, h = '';
    h += '<div class="ms-brand">MIGNUANCE CO.</div>';
    if (c.app) h += '<div class="ms-app">' + esc(c.app) + '</div>';
    if (c.home !== false) {
      h += '<a class="ms-nav ms-home" href="' + esc(c.homeUrl || HOME) + '" target="' + esc(c.homeTarget || '_top') + '" title="Mignuanceに戻る">'
        + '<i class="ti ti-arrow-back-up"></i><span class="ms-l">Mignuance</span><span class="ms-s">ホーム</span></a>';
      h += '<div class="ms-sep"></div>';
    }
    (c.items || []).forEach(function (it) { h += navHTML(it, it.id === c.active); });
    h += '<div class="ms-sp"></div>';
    (c.links || []).forEach(function (L) {
      h += '<a class="ms-nav ms-link" href="' + esc(L.href) + '" target="_blank" rel="noopener"><i class="ti ti-' + esc(L.icon || 'external-link') + '"></i><span class="ms-l">' + esc(L.label) + '</span><i class="ti ti-arrow-up-right ms-x"></i></a>';
    });
    root.innerHTML = h;
  }

  window.MSide = {
    mount: function (c) {
      cfg = c || {};
      addHead();
      if (cfg.theme === 'light') document.documentElement.classList.add('ms-light');
      document.documentElement.classList.add('ms-on');
      if (!root) {
        root = document.createElement('aside');
        root.className = 'ms-side';
        root.setAttribute('aria-label', 'メニュー');
        root.addEventListener('click', function (e) {
          var b = e.target.closest('button[data-ms]'); if (!b) return;
          var id = b.getAttribute('data-ms');
          cfg.active = id; draw();
          if (typeof cfg.onSelect === 'function') cfg.onSelect(id);
        });
        document.body.appendChild(root);
      }
      draw();
      return window.MSide;
    },
    update: function (c) {
      if (!cfg) return;
      Object.keys(c || {}).forEach(function (k) { cfg[k] = c[k]; });
      draw();
    },
    active: function () { return cfg && cfg.active; },
    /* 既存アプリのタブ・メニューのボタンをそのまま写す（2026-10-25）
       元のボタンは隠して残し、こちらで押されたら元のボタンを押す。元の数字（バッジ）や選択状態も自動で追いかける。
       MSide.mirror({ app:'採用管理', buttons:'.tabs .tab', watch:'.tabs', hide:'.tabs',
                      key:function(b){return b.dataset.tab}, icons:{list:'users'}, shorts:{list:'応募者'}, home:true }) */
    mirror: function (o) {
      var t = null, last = '';
      function keyOf(b, i) { return o.key ? String(o.key(b)) : (b.id || String(i)); }
      function read() {
        return [].slice.call(document.querySelectorAll(o.buttons)).map(function (b, i) {
          var k = keyOf(b, i);
          var bd = b.querySelector(o.badge || '.bdg,.badge,.cnt,.b');
          var bt = bd ? bd.textContent.trim() : '';
          var cut = b.querySelector('.bdg,.badge,.cnt,.b,.ms-none'), ct = cut ? cut.textContent.trim() : '';
          var lab = (o.labels && o.labels[k]) || b.textContent.replace(ct, '').replace(/\s+/g, ' ').trim();
          var ic = b.querySelector('i.ti'), m = ic && /ti-([\w-]+)/.exec(ic.className);
          return { id: k, label: lab, short: (o.shorts && o.shorts[k]) || lab, icon: (o.icons && o.icons[k]) || (m && m[1]) || 'point',
            badge: bt && bt !== '0' ? bt : 0, on: b.classList.contains(o.onClass || 'on') };
        });
      }
      function sync() {
        var it = read(), act = (it.filter(function (x) { return x.on; })[0] || {}).id;
        var sig = JSON.stringify(it) + act;
        if (sig === last) return; last = sig;
        if (!it.length) { if (root) root.style.display = 'none'; document.documentElement.classList.remove('ms-on'); return; }
        if (root) root.style.display = '';
        var c = { app: o.app, items: it, links: o.links || [], active: act, home: o.home, homeUrl: o.homeUrl, homeTarget: o.homeTarget, theme: o.theme,
          onSelect: function (id) {
            var bs = [].slice.call(document.querySelectorAll(o.buttons));
            for (var i = 0; i < bs.length; i++) if (keyOf(bs[i], i) === id) { bs[i].click(); break; }
            setTimeout(sync, 0);
          } };
        if (cfg) { document.documentElement.classList.add('ms-on'); window.MSide.update(c); } else window.MSide.mount(c);
      }
      addHead();
      if (o.hide) { var s = document.createElement('style'); s.textContent = o.hide + '{display:none !important}'; document.head.appendChild(s); }
      var w = document.querySelector(o.watch || 'body') || document.body;
      new MutationObserver(function () { clearTimeout(t); t = setTimeout(sync, 60); })
        .observe(w, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'], characterData: true });
      sync();
      return { sync: sync };
    }
  };
})();
