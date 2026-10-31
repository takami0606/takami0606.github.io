// ==UserScript==
// @name         X 読みやすくする
// @namespace    local.x.reader
// @version      0.4
// @description  表示を圧縮し、画像・引用・カード・操作欄を折り畳む
// @match        https://x.com/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  // ── 設定 ──
  const WIDTH = 1400;       // 中央カラムの最大幅
  const LEFT_WIDTH = 68;    // 左メニューの幅
  const RIGHT_WIDTH = 350;  // 右の欄の幅
  const TEXT_SIZE = 13;     // 投稿本文の文字サイズ

  // 初期状態：左は表示、右は折り畳み
  document.body.classList.remove('xr-left-closed');
  document.body.classList.add('xr-right-closed');

  const style = document.createElement('style');
  style.textContent = `
    body {
      --xr-left-width: ${LEFT_WIDTH}px;
      --xr-right-width: ${RIGHT_WIDTH}px;
    }

    body.xr-left-closed {
      --xr-left-width: 0px;
    }

    body.xr-right-closed {
      --xr-right-width: 0px;
    }

    .xr-layout-root,
    .xr-layout-ancestor {
      width: 100% !important;
      max-width: none !important;
      min-width: 0 !important;
      margin-inline: 0 !important;
      box-sizing: border-box !important;
    }

    .xr-layout-root {
      display: flex !important;
      justify-content: flex-start !important;
      align-items: stretch !important;
    }

    /* 左メニュー */
    body.xr-left-closed header[role="banner"] {
      display: none !important;
    }

    body:not(.xr-left-closed) header[role="banner"] {
      display: block !important;
      position: fixed !important;
      inset: 0 auto 0 0 !important;
      width: var(--xr-left-width) !important;
      min-width: 0 !important;
      max-width: none !important;
      height: 100dvh !important;
      margin: 0 !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      box-sizing: border-box !important;
      z-index: 20;
    }

    header[role="banner"] > div,
    header[role="banner"] > div > div {
      position: static !important;
      width: 100% !important;
      min-width: 0 !important;
      max-width: none !important;
      margin-inline: 0 !important;
      transform: none !important;
      box-sizing: border-box !important;
    }

    header[role="banner"] nav a span,
    header[role="banner"] nav [role="button"] span,
    header[role="banner"]
    [data-testid="SideNav_NewTweet_Button"] span {
      display: none !important;
    }

    header[role="banner"] nav {
      width: 100% !important;
      align-items: center !important;
    }

    header[role="banner"] nav > a,
    header[role="banner"] nav > [role="button"] {
      width: 52px !important;
      min-width: 0 !important;
      margin-inline: auto !important;
      padding-inline: 0 !important;
      align-items: center !important;
    }

    header[role="banner"] nav > a > div,
    header[role="banner"] nav > [role="button"] > div {
      padding: 12px !important;
      justify-content: center !important;
    }

    header[role="banner"]
    [data-testid="SideNav_NewTweet_Button"] {
      position: relative !important;
      width: 48px !important;
      min-width: 48px !important;
      height: 48px !important;
      padding: 0 !important;
      margin-inline: auto !important;
      border-radius: 50% !important;
    }

    header[role="banner"]
    [data-testid="SideNav_NewTweet_Button"] svg {
      display: block !important;
      width: 24px !important;
      height: 24px !important;
    }

    /* 幅の広い画面で投稿アイコンがない場合の代替 */
    header[role="banner"]
    [data-testid="SideNav_NewTweet_Button"]:not(:has(svg))::after {
      content: "＋";
      font-size: 28px;
      color: inherit;
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      pointer-events: none;
    }

    header[role="banner"]
    [data-testid="SideNav_AccountSwitcher_Button"] {
      width: 52px !important;
      min-width: 0 !important;
      padding: 6px !important;
      margin-inline: auto !important;
      justify-content: center !important;
    }

    header[role="banner"]
    [data-testid="SideNav_AccountSwitcher_Button"] > div {
      flex: none !important;
    }

    header[role="banner"]
    [data-testid="SideNav_AccountSwitcher_Button"]
    > div:not(:first-child) {
      display: none !important;
    }

    /* 中央の投稿領域 */
    body main[role="main"] {
      position: relative !important;
      width: calc(
        100% - var(--xr-left-width) - var(--xr-right-width)
      ) !important;
      min-width: 0 !important;
      max-width: none !important;
      margin-left: var(--xr-left-width) !important;
      margin-right: var(--xr-right-width) !important;
      flex: none !important;
      align-items: stretch !important;
      box-sizing: border-box !important;
    }

    body main[role="main"] > div {
      width: 100% !important;
      max-width: ${WIDTH}px !important;
      min-width: 0 !important;
      margin-left: 0 !important;
      margin-right: auto !important;
      box-sizing: border-box !important;
    }

    body main[role="main"] [data-testid="primaryColumn"] {
      width: 100% !important;
      max-width: none !important;
      min-width: 0 !important;
      margin-inline: 0 !important;
      flex: 1 1 0% !important;
      box-sizing: border-box !important;
    }

    body main[role="main"] .xr-width {
      width: 100% !important;
      max-width: none !important;
      min-width: 0 !important;
      margin-inline: 0 !important;
      box-sizing: border-box !important;
      align-self: stretch !important;
    }

    /* 右の欄 */
    body.xr-right-closed [data-testid="sidebarColumn"] {
      display: none !important;
    }

    body:not(.xr-right-closed) [data-testid="sidebarColumn"] {
      display: block !important;
      position: fixed !important;
      inset: 0 0 0 auto !important;
      width: var(--xr-right-width) !important;
      min-width: 0 !important;
      max-width: none !important;
      height: 100dvh !important;
      margin: 0 !important;
      padding: 0 12px !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      box-sizing: border-box !important;
      z-index: 20;
    }

    [data-testid="sidebarColumn"] > div,
    [data-testid="sidebarColumn"] > div > div {
      position: static !important;
      width: 100% !important;
      min-width: 0 !important;
      max-width: none !important;
      transform: none !important;
      box-sizing: border-box !important;
    }

    /* 文字サイズと投稿間隔 */
    article[data-testid="tweet"] [data-testid="tweetText"],
    article[data-testid="tweet"] [data-testid="tweetText"] * {
      font-size: ${TEXT_SIZE}px !important;
      line-height: 1.45 !important;
    }

    article[data-testid="tweet"] [data-testid="User-Name"],
    article[data-testid="tweet"] [data-testid="User-Name"] * {
      font-size: 12px !important;
    }

    article.xr-post {
      height: auto !important;
      min-height: 0 !important;
      max-height: none !important;
      padding-bottom: 8px !important;
      box-sizing: border-box !important;
    }

    .xr-hidden,
    .xr-recommendation-hidden {
      display: none !important;
    }

    /* 画像・カード・引用の開閉リンク */
    .xr-inline-links {
      display: inline !important;
      white-space: normal !important;
    }

    .xr-button {
      font: inherit;
      cursor: pointer;
    }

    article[data-testid="tweet"] .xr-fold-button {
      display: inline !important;
      width: auto !important;
      min-width: 0 !important;
      margin: 0 0 0 0.6em !important;
      padding: 0 !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      color: #1d9bf0 !important;
      font-size: ${TEXT_SIZE}px !important;
      line-height: 1.45 !important;
      vertical-align: baseline !important;
      cursor: pointer !important;
    }

    .xr-fold-button:hover {
      text-decoration: underline !important;
    }

    .xr-fold-button:focus-visible {
      outline: 2px solid #1d9bf0 !important;
      outline-offset: 2px !important;
    }

    /* 一覧で、未クリックの投稿だけ操作欄を隠す */
    article[data-testid="tweet"].xr-actions-collapsed
    [role="group"] {
      display: none !important;
    }

    /* 左右の開閉ボタン */
    #xr-controls {
      position: fixed;
      right: 16px;
      bottom: 16px;
      display: flex;
      gap: 8px;
      z-index: 9999;
    }

    #xr-controls button {
      padding: 5px 10px;
      border: 1px solid #8888;
      border-radius: 16px;
      background: #15202b;
      color: white;
      font-size: 11px;
    }
  `;
  document.head.append(style);

  function makeButton(text, className = '') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `xr-button ${className}`;
    button.textContent = text;
    button.setAttribute('aria-expanded', 'false');
    return button;
  }

  // ── 左右の欄の開閉 ──
  const controls = document.createElement('div');
  controls.id = 'xr-controls';

  for (const [label, className] of [
    ['左の欄', 'xr-left-closed'],
    ['右の欄', 'xr-right-closed']
  ]) {
    const button = makeButton('');

    function refresh() {
      const closed = document.body.classList.contains(className);
      button.textContent = `${label}を${closed ? '開く' : '畳む'}`;
      button.setAttribute('aria-expanded', String(!closed));
    }

    button.onclick = () => {
      document.body.classList.toggle(className);
      refresh();
    };

    refresh();
    controls.append(button);
  }

  document.body.append(controls);

  // ── レイアウトの幅制限を解除 ──
  function fixLayoutRoot() {
    const main = document.querySelector('main[role="main"]');
    const header = document.querySelector('header[role="banner"]');
    if (!main || !header) return;

    let root = main.parentElement;

    while (root && !root.contains(header)) {
      root = root.parentElement;
    }

    if (!root || root === document.body ||
        root === document.documentElement) return;

    root.classList.add('xr-layout-root');

    let parent = root.parentElement;
    while (parent && parent !== document.body &&
           parent !== document.documentElement) {
      parent.classList.add('xr-layout-ancestor');
      parent = parent.parentElement;
    }
  }

  function widen(article) {
    const column = article.closest(
      '[data-testid="primaryColumn"]'
    );
    if (!column) return;

    let element = article;
    while (element && element !== column) {
      element.classList.add('xr-width');
      element = element.parentElement;
    }
  }

  // ── 画像・引用・カードの折り畳み ──
  const preparedFrames = new WeakSet();

  function ownText(article) {
    return [...article.querySelectorAll(
      '[data-testid="tweetText"]'
    )].find(el =>
      el.closest('article') === article &&
      !el.closest('[data-xr-fold]') &&
      !el.closest('[data-testid="quoteTweet"]') &&
      !el.closest('[role="link"][tabindex="0"]')
    );
  }

  function fold(frame, label, article) {
    if (preparedFrames.has(frame)) return;
    if (frame.closest('[data-xr-fold]')) return;

    preparedFrames.add(frame);
    frame.dataset.xrFold = 'closed';
    frame.classList.add('xr-hidden');

    const button = makeButton(
      `${label}を開く`,
      'xr-fold-button'
    );

    const text = ownText(article);

    if (text) {
      let links = text.querySelector('.xr-inline-links');

      if (!links) {
        links = document.createElement('span');
        links.className = 'xr-inline-links';
        text.append(links);
      }

      links.append(button);
    } else {
      frame.before(button);
    }

    button.onclick = event => {
      event.preventDefault();
      event.stopPropagation();

      const hidden = frame.classList.toggle('xr-hidden');
      frame.dataset.xrFold = hidden ? 'closed' : 'open';
      button.textContent =
        `${label}を${hidden ? '開く' : '畳む'}`;
      button.setAttribute('aria-expanded', String(!hidden));
    };
  }

  function mediaFrame(media, article) {
    let frame = media;

    while (frame.parentElement &&
           frame.parentElement !== article) {
      const parent = frame.parentElement;

      if (parent.querySelector(
        '[data-testid="tweetText"], [role="group"], article,' +
        '[data-testid^="UserAvatar"], .xr-button'
      )) break;

      if (parent.textContent.trim()) break;
      if (parent.hasAttribute('data-xr-fold')) break;

      frame = parent;
    }

    return frame;
  }

  // ── 操作欄：クリックした投稿だけ表示 ──
const openedActionRows = new WeakSet();

function isPostDetail() {
  return /\/status\/\d+/.test(location.pathname);
}

// 古いhover指定より優先して、閉じた状態を維持する
const actionStyle = document.createElement('style');
actionStyle.textContent = `
  body main article[data-testid="tweet"].xr-actions-collapsed
  [role="group"] {
    display: none !important;
  }
`;
document.head.append(actionStyle);

function syncActionRows() {
  const detail = isPostDetail();

  document.querySelectorAll(
    'article[data-testid="tweet"]'
  ).forEach(article => {
    const shouldHide =
      !detail && !openedActionRows.has(article);

    // 必要なときだけ変更する
    if (
      article.classList.contains('xr-actions-collapsed')
      !== shouldHide
    ) {
      article.classList.toggle(
        'xr-actions-collapsed',
        shouldHide
      );
    }
  });
}

document.addEventListener('click', event => {
  if (isPostDetail()) return;
  if (event.button !== 0) return;
  if (event.ctrlKey || event.metaKey ||
      event.shiftKey || event.altKey) return;

  const target = event.target instanceof Element
    ? event.target
    : event.target?.parentElement;

  const article = target?.closest(
    'article[data-testid="tweet"]'
  );
  if (!article) return;

  // リンクや各種ボタンは本来の動作を優先
  if (target.closest(
    'a, button, input, textarea, select,' +
    '[role="button"], [role="link"],' +
    '[contenteditable="true"], [role="group"]'
  )) return;

  if (window.getSelection()?.toString()) return;

  // 1回目：個別表示への移動を止め、操作欄だけ開く
  if (!openedActionRows.has(article)) {
    event.preventDefault();
    event.stopImmediatePropagation();

    openedActionRows.add(article);
    syncActionRows();
  }

  // 2回目：何も止めず、X本来の個別表示へ進む
}, true);

// Xが投稿のclassを書き換えた場合も状態を復元
let actionSyncQueued = false;

new MutationObserver(records => {
  const articleChanged = records.some(record =>
    record.target instanceof Element &&
    record.target.matches('article[data-testid="tweet"]')
  );

  if (!articleChanged || actionSyncQueued) return;

  actionSyncQueued = true;
  requestAnimationFrame(() => {
    actionSyncQueued = false;
    syncActionRows();
  });
}).observe(document.body, {
  attributes: true,
  attributeFilter: ['class'],
  subtree: true
});

  // ── おすすめユーザーを非表示 ──
  function hideRecommendations() {
    // 再利用された行に、以前の非表示状態を残さない
    document.querySelectorAll(
      '.xr-recommendation-hidden'
    ).forEach(el => {
      el.classList.remove('xr-recommendation-hidden');
    });

    document.querySelectorAll(
      'main [role="heading"], main h2, main h3'
    ).forEach(heading => {
      if (!/^(おすすめユーザー|Who to follow)$/i.test(
        heading.textContent.trim()
      )) return;

      const cell = heading.closest(
        '[data-testid="cellInnerDiv"]'
      );

      if (!cell || cell.querySelector(
        'article[data-testid="tweet"]'
      )) return;

      cell.classList.add('xr-recommendation-hidden');

      let next = cell.nextElementSibling;

      while (next) {
        if (next.querySelector(
          'article[data-testid="tweet"]'
        )) break;

        const isUser =
          next.matches('[data-testid="UserCell"]') ||
          next.querySelector('[data-testid="UserCell"]');

        const isMore = /^(さらに表示|Show more)$/i.test(
          next.textContent.trim()
        );

        if (!isUser && !isMore) break;

        next.classList.add('xr-recommendation-hidden');
        next = next.nextElementSibling;

        if (isMore) break;
      }
    });
  }

  // ── 画面更新への追従 ──
  let previousPath = '';
  let followingPending = false;
  let scheduled = false;

  function update() {
    scheduled = false;

    fixLayoutRoot();
    syncActionRows();
    hideRecommendations();

    if (previousPath !== location.pathname) {
      previousPath = location.pathname;
      followingPending = previousPath === '/home';
    }

    if (followingPending) {
      const following = [
        ...document.querySelectorAll('[role="tab"]')
      ].find(tab =>
        /^(フォロー中|Following)$/i.test(
          tab.textContent.trim()
        )
      );

      if (following) {
        followingPending = false;

        if (following.getAttribute('aria-selected') !== 'true') {
          following.click();
        }
      }
    }

    document.querySelectorAll(
      'article[data-testid="tweet"]'
    ).forEach(article => {
      article.classList.add('xr-post');
      widen(article);

      // 引用投稿を先に折り畳む
      article.querySelectorAll(
        '[data-testid="quoteTweet"], [role="link"][tabindex="0"]'
      ).forEach(candidate => {
        const isQuote =
          candidate.matches('[data-testid="quoteTweet"]') ||
          Boolean(candidate.querySelector(
            '[data-testid^="UserAvatar"],' +
            '[data-testid="User-Name"]'
          ));

        if (!isQuote) return;
        if (candidate.querySelector('[role="group"]')) return;
        if (candidate.closest('article') !== article) return;

        fold(candidate, '引用投稿', article);
      });

      // リンクカード
      article.querySelectorAll(
        '[data-testid="card.wrapper"]'
      ).forEach(card => {
        fold(card, 'リンクカード', article);
      });

      // 画像・動画
      article.querySelectorAll(
        '[data-testid="tweetPhoto"], [data-testid="videoPlayer"]'
      ).forEach(media => {
        if (media.closest('[data-xr-fold]')) return;

        fold(
          mediaFrame(media, article),
          '画像・動画',
          article
        );
      });
    });
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  }

  new MutationObserver(schedule).observe(document.body, {
    childList: true,
    subtree: true
  });

  window.addEventListener('popstate', schedule);
  update();
})();

