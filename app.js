// App Data
const apps = {
  explorer: {
    title: "エクスプローラー",
    icon: "📁",
    width: 800,
    height: 500,
    color: "#f0ca43",
  },
  edge: {
    title: "Microsoft Edge",
    icon: "🌐",
    width: 900,
    height: 600,
    color: "#0078d7",
  },
  recycle: {
    title: "ごみ箱",
    icon: "🗑️",
    width: 700,
    height: 450,
    color: "#a0a0a0",
  },
  pc: { title: "PC", icon: "💻", width: 800, height: 500, color: "#0078d7" },
  notepad: {
    title: "メモ帳",
    icon: "📝",
    width: 600,
    height: 400,
    color: "#00cc6a",
  },
  settings: {
    title: "設定",
    icon: "⚙️",
    width: 800,
    height: 550,
    color: "#0078d7",
  },
  store: {
    title: "Microsoft Store",
    icon: "🛍️",
    width: 900,
    height: 600,
    color: "#ffffff",
  },
  mail: {
    title: "メール",
    icon: "✉️",
    width: 800,
    height: 500,
    color: "#0078d7",
  },
  calc: {
    title: "電卓",
    icon: "🧮",
    width: 320,
    height: 500,
    color: "#0078d7",
  },
  paint: {
    title: "ペイント",
    icon: "🎨",
    width: 800,
    height: 600,
    color: "#0078d7",
  },
  security: {
    title: "McAfee Security",
    icon: "🛡️",
    width: 900,
    height: 650,
    color: "#E51A25",
  },
};

// State
let openWindows = [];
let zIndexCounter = 100;
let isDesktop = true;

// DOM Elements
const desktop = document.getElementById("desktop");
const desktopIcons = document.getElementById("desktopIcons");
const contextMenu = document.getElementById("contextMenu");
const windowsContainer = document.getElementById("windowsContainer");
const startMenu = document.getElementById("startMenu");
const startBtn = document.getElementById("startBtn");
const taskbarApps = document.getElementById("taskbarApps");
const taskbarClock = document.getElementById("taskbarClock");
const clockTime = document.getElementById("clockTime");
const clockDate = document.getElementById("clockDate");
const notifBtn = document.getElementById("notifBtn");
const notifPanel = document.getElementById("notifPanel");
const widgetBtn = document.getElementById("widgetBtn");

// Initialize Clock
function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const timeStr = `${hours}:${minutes}`;

  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  const dayStr = days[now.getDay()];

  clockTime.textContent = timeStr;
  clockDate.textContent = `${year}/${month.toString().padStart(2, "0")}/${date.toString().padStart(2, "0")}`;
}

setInterval(updateClock, 1000);
updateClock();

// Start Menu Toggle
startBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  startMenu.classList.toggle("hidden");
  notifPanel.classList.add("hidden");
});

// Notification Panel Toggle
notifBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  notifPanel.classList.toggle("hidden");
  startMenu.classList.add("hidden");
});

// Close menus when clicking outside
document.addEventListener("click", (e) => {
  if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
    startMenu.classList.add("hidden");
  }
  if (!notifPanel.contains(e.target) && !notifBtn.contains(e.target)) {
    notifPanel.classList.add("hidden");
  }
  closeContextMenu();

  // Deselect desktop icons
  document
    .querySelectorAll(".desktop-icon")
    .forEach((icon) => icon.classList.remove("selected"));
});

// Desktop Icon Selection
desktopIcons.addEventListener("click", (e) => {
  const icon = e.target.closest(".desktop-icon");
  if (icon) {
    e.stopPropagation();
    document
      .querySelectorAll(".desktop-icon")
      .forEach((i) => i.classList.remove("selected"));
    icon.classList.add("selected");
  }
});

// Context Menu
desktop.addEventListener("contextmenu", (e) => {
  if (!isDesktop) return;
  e.preventDefault();

  // Close other menus
  startMenu.classList.add("hidden");
  notifPanel.classList.add("hidden");

  contextMenu.style.left = `${e.clientX}px`;
  contextMenu.style.top = `${e.clientY}px`;
  contextMenu.classList.remove("hidden");
});

function closeContextMenu() {
  contextMenu.classList.add("hidden");
}

// Window Management
function openApp(appId) {
  // Close start menu if open
  startMenu.classList.add("hidden");

  // Check if app is already open
  const existingWin = openWindows.find((w) => w.id === appId);
  if (existingWin) {
    if (existingWin.element.classList.contains("minimized")) {
      existingWin.element.classList.remove("minimized");
    }
    focusWindow(existingWin.id);
    return;
  }

  const app = apps[appId] || {
    title: appId,
    icon: "📦",
    width: 600,
    height: 400,
  };

  // Create Window
  const winId = `win-${Date.now()}`;
  const winElement = document.createElement("div");
  winElement.className = "window focused";
  winElement.id = winId;

  // Position randomly but centered
  const maxLeft = window.innerWidth - app.width;
  const maxTop = window.innerHeight - app.height - 48; // minus taskbar
  const left = Math.max(
    0,
    Math.min(
      maxLeft,
      (window.innerWidth - app.width) / 2 + (Math.random() * 40 - 20),
    ),
  );
  const top = Math.max(
    0,
    Math.min(
      maxTop,
      (window.innerHeight - app.height) / 2 + (Math.random() * 40 - 20),
    ),
  );

  winElement.style.width = `${app.width}px`;
  winElement.style.height = `${app.height}px`;
  winElement.style.left = `${left}px`;
  winElement.style.top = `${top}px`;
  winElement.style.zIndex = ++zIndexCounter;

  // App specific content
  let contentHtml = "";

  if (appId === "explorer") {
    contentHtml = `
            <div class="explorer-toolbar">
                <div class="explorer-nav">
                    <button>←</button>
                    <button>→</button>
                    <button>↑</button>
                    <button>↻</button>
                </div>
                <div class="explorer-path">
                    <span>📁 PC > ドキュメント</span>
                </div>
                <div class="start-search" style="margin:0; padding:4px 10px; width:200px;">
                    <span class="search-icon" style="font-size:12px;">🔍</span>
                    <input type="text" placeholder="ドキュメントの検索">
                </div>
            </div>
            <div class="explorer-body">
                <div class="explorer-sidebar">
                    <div class="sidebar-section">お気に入り</div>
                    <div class="sidebar-item active"><span>🏠</span> ホーム</div>
                    <div class="sidebar-item"><span>🖼️</span> ギャラリー</div>
                    <div class="sidebar-section">PC</div>
                    <div class="sidebar-item"><span>🖥️</span> デスクトップ</div>
                    <div class="sidebar-item"><span>⬇️</span> ダウンロード</div>
                    <div class="sidebar-item"><span>📄</span> ドキュメント</div>
                    <div class="sidebar-item"><span>🖼️</span> ピクチャ</div>
                    <div class="sidebar-item"><span>🎵</span> ミュージック</div>
                    <div class="sidebar-item"><span>🎬</span> ビデオ</div>
                    <div class="sidebar-item"><span>💽</span> ローカル ディスク (C:)</div>
                </div>
                <div class="explorer-files">
                    <div class="file-item"><div class="file-icon">📁</div><div class="file-name">仕事</div></div>
                    <div class="file-item"><div class="file-icon">📁</div><div class="file-name">プライベート</div></div>
                    <div class="file-item"><div class="file-icon">📄</div><div class="file-name">レポート.docx</div></div>
                    <div class="file-item"><div class="file-icon">📊</div><div class="file-name">予算.xlsx</div></div>
                    <div class="file-item"><div class="file-icon">🖼️</div><div class="file-name">写真1.jpg</div></div>
                </div>
            </div>
        `;
  } else if (appId === "settings") {
    contentHtml = `
            <div class="settings-layout">
                <div class="settings-sidebar">
                    <div class="settings-user" style="display:flex; align-items:center; gap:10px; padding:10px 16px; margin-bottom:20px;">
                        <div style="font-size:32px;">👤</div>
                        <div>
                            <div style="color:#fff; font-size:14px; font-weight:600;">ユーザー</div>
                            <div style="color:rgba(255,255,255,0.5); font-size:11px;">ローカル アカウント</div>
                        </div>
                    </div>
                    <div class="settings-nav-item active"><span class="settings-nav-icon">🖥️</span> システム</div>
                    <div class="settings-nav-item"><span class="settings-nav-icon">🔵</span> Bluetooth とデバイス</div>
                    <div class="settings-nav-item"><span class="settings-nav-icon">🌐</span> ネットワークとインターネット</div>
                    <div class="settings-nav-item"><span class="settings-nav-icon">🎨</span> 個人用設定</div>
                    <div class="settings-nav-item"><span class="settings-nav-icon">📦</span> アプリ</div>
                    <div class="settings-nav-item"><span class="settings-nav-icon">👤</span> アカウント</div>
                    <div class="settings-nav-item"><span class="settings-nav-icon">🕒</span> 時刻と言語</div>
                    <div class="settings-nav-item"><span class="settings-nav-icon">🛡️</span> プライバシーとセキュリティ</div>
                    <div class="settings-nav-item"><span class="settings-nav-icon">🔄</span> Windows Update</div>
                </div>
                <div class="settings-content">
                    <h2>システム</h2>
                    <div class="settings-card">
                        <div class="settings-card-row">
                            <div>
                                <div class="settings-card-label">ディスプレイ</div>
                                <div class="settings-card-value">モニター、明るさ、夜間モード、ディスプレイのプロファイル</div>
                            </div>
                            <div>▶</div>
                        </div>
                    </div>
                    <div class="settings-card">
                        <div class="settings-card-row">
                            <div>
                                <div class="settings-card-label">サウンド</div>
                                <div class="settings-card-value">音量レベル、出力、入力、サウンド デバイス</div>
                            </div>
                            <div>▶</div>
                        </div>
                    </div>
                    <div class="settings-card">
                        <div class="settings-card-row">
                            <div>
                                <div class="settings-card-label">通知</div>
                                <div class="settings-card-value">アプリからのアラートと通知、応答不可モード</div>
                            </div>
                            <div>▶</div>
                        </div>
                    </div>
                    <div class="settings-card">
                        <div class="settings-card-row">
                            <div>
                                <div class="settings-card-label">電源とバッテリー</div>
                                <div class="settings-card-value">スリープ、バッテリー使用量、バッテリー節約機能</div>
                            </div>
                            <div>▶</div>
                        </div>
                    </div>
                    <div class="settings-card">
                        <div class="settings-card-row">
                            <div>
                                <div class="settings-card-label">ストレージ</div>
                                <div class="settings-card-value">ストレージ領域、ドライブ、構成ルール</div>
                            </div>
                            <div>▶</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  } else if (appId === "notepad") {
    contentHtml = `
            <div class="notepad-menubar">
                <button class="notepad-menu">ファイル</button>
                <button class="notepad-menu">編集</button>
                <button class="notepad-menu">表示</button>
            </div>
            <textarea class="notepad-textarea" spellcheck="false">ウェブOSへようこそ！

これはHTML、CSS、JavaScriptで構築されたWindows 11風のウェブオペレーティングシステムです。

特徴:
- スムーズなアニメーション
- ドラッグ可能なウィンドウ
- アクリル/ガラス効果
- 日本語対応

自由にウィンドウを開いてみてください。</textarea>
            <div class="notepad-statusbar">
                <span>行 9、列 1</span>
                <span>100%</span>
                <span>Windows (CRLF)</span>
                <span>UTF-8</span>
            </div>
        `;
  } else if (appId === "security") {
    contentHtml = `
            <div class="mcafee-modern-app" id="securityApp">
                <div class="mcafee-header">
                    <div class="mcafee-logo-container">
                        <svg viewBox="0 0 24 24" width="28" height="28" class="mcafee-svg-logo">
                            <path fill="#C01818" d="M12 1L2 4v7c0 5.55 3.84 10.74 10 12 6.16-1.26 10-6.45 10-12V4L12 1z"/>
                            <path fill="#FFFFFF" d="M16.5 15h-1.8v-4.5L12 13.2l-2.7-2.7V15H7.5V9h1.8l2.7 2.7L14.7 9h1.8v6z"/>
                        </svg>
                        <span class="mcafee-wordmark">McAfee</span>
                    </div>
                    <div class="mcafee-header-right">
                        <div class="mcafee-header-icon">👤</div>
                        <div class="mcafee-header-icon">⚙️</div>
                        <div class="mcafee-header-icon">❓</div>
                    </div>
                </div>
                
                <div class="mcafee-nav">
                    <div class="mcafee-nav-tab active">ホーム</div>
                    <div class="mcafee-nav-tab">マイ プロテクション</div>
                    <div class="mcafee-nav-tab">マイ プライバシー</div>
                    <div class="mcafee-nav-tab">マイ インフォ</div>
                </div>

                <div class="mcafee-main-scroll">
                    <!-- Initial State -->
                    <div class="mcafee-state active" id="secStateInitial">
                        <div class="mcafee-hero safe">
                            <div class="mcafee-score-container">
                                <svg class="mcafee-score-ring" viewBox="0 0 100 100">
                                    <circle class="ring-bg" cx="50" cy="50" r="45"></circle>
                                    <circle class="ring-fill safe" cx="50" cy="50" r="45" stroke-dasharray="282" stroke-dashoffset="30"></circle>
                                </svg>
                                <div class="mcafee-score-content">
                                    <div class="score-value">850</div>
                                    <div class="score-label">プロテクションスコア</div>
                                </div>
                            </div>
                            <div class="mcafee-hero-text">
                                <h2>素晴らしい！デバイスは安全です。</h2>
                                <p>設定は完璧です。安心してオンラインをお楽しみください。</p>
                                <button class="mcafee-btn primary" onclick="startSecurityScan()">スマートスキャンの実行</button>
                            </div>
                        </div>
                        
                        <div class="mcafee-dashboard">
                            <h3 class="dashboard-title">セキュリティ機能</h3>
                            <div class="mcafee-grid">
                                <div class="mcafee-card">
                                    <div class="card-icon">🛡️</div>
                                    <div class="card-info">
                                        <h4>アンチウイルス</h4>
                                        <p>リアルタイム保護は有効です</p>
                                    </div>
                                    <div class="card-action">▶</div>
                                </div>
                                <div class="mcafee-card">
                                    <div class="card-icon">🌐</div>
                                    <div class="card-info">
                                        <h4>セキュア VPN</h4>
                                        <p>ネットワークは保護されています</p>
                                    </div>
                                    <div class="card-action">▶</div>
                                </div>
                                <div class="mcafee-card">
                                    <div class="card-icon">👁️</div>
                                    <div class="card-info">
                                        <h4>ID モニタリング</h4>
                                        <p>個人情報の流出はありません</p>
                                    </div>
                                    <div class="card-action">▶</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Scanning State -->
                    <div class="mcafee-state" id="secStateScanning" style="display:none;">
                        <div class="mcafee-hero neutral">
                            <div class="mcafee-scanning-animation">
                                <div class="scan-circle outer"></div>
                                <div class="scan-circle inner"></div>
                                <div class="scan-icon">🔍</div>
                            </div>
                            <div class="mcafee-hero-text" style="text-align: center; max-width: 500px; margin: 0 auto;">
                                <h2>システムをスキャンしています...</h2>
                                <p>ファイルとアプリケーションの安全性を確認しています。</p>
                                <div class="mcafee-progress-container">
                                    <div class="mcafee-progress-bar"><div class="mcafee-progress-fill" id="secProgressFill"></div></div>
                                </div>
                                <div class="mcafee-scan-details">
                                    <p>スキャンした項目: <span id="secFileCount">0</span></p>
                                    <p class="path" id="secFilePath">C:\\Windows\\System32\\...</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Threat Found State -->
                    <div class="mcafee-state danger-mode" id="secStateDanger" style="display:none;">
                        <div class="danger-header">
                            <div class="danger-icon warning-pulse">⚠️</div>
                            <div class="danger-text-block">
                                <h2>デバイスが危険にさらされています</h2>
                                <p>4件の深刻な脅威が検出されました。早急な対応が必要です。</p>
                            </div>
                        </div>
                        
                        <div class="danger-grid">
                            <div class="danger-card">
                                <div class="dc-header">
                                    <span class="dc-name">Trojan:Win32/Wacatac.B!ml</span>
                                    <span class="threat-badge">重大</span>
                                </div>
                                <div class="dc-path">C:\\Users\\...\\Downloads\\crack.exe</div>
                            </div>
                            <div class="danger-card">
                                <div class="dc-header">
                                    <span class="dc-name">Ransom:Win32/WannaCrypt</span>
                                    <span class="threat-badge">重大</span>
                                </div>
                                <div class="dc-path">C:\\Users\\...\\Documents\\invoice_urgent.js</div>
                            </div>
                            <div class="danger-card">
                                <div class="dc-header">
                                    <span class="dc-name">Backdoor:PHP/WebShell.A</span>
                                    <span class="threat-badge high">高</span>
                                </div>
                                <div class="dc-path">C:\\inetpub\\wwwroot\\uploads\\shell.php</div>
                            </div>
                            <div class="danger-card">
                                <div class="dc-header">
                                    <span class="dc-name">Adware:Win32/OpenCandy</span>
                                    <span class="threat-badge med">中</span>
                                </div>
                                <div class="dc-path">C:\\Program Files (x86)\\FreeConverter\\setup.exe</div>
                            </div>
                        </div>
                        
                        <div class="danger-actions">
                            <button class="danger-btn-huge" onclick="cleanThreats()">すべての脅威を直ちに隔離する</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
  } else {
    contentHtml = `
            <div class="app-placeholder">
                <div class="app-placeholder-icon">${app.icon}</div>
                <div class="app-placeholder-text">${app.title}は開発中です...</div>
            </div>
        `;
  }

  winElement.innerHTML = `
        <div class="window-titlebar">
            <div class="window-title">
                <span class="window-title-icon">${app.icon}</span>
                <span>${app.title}</span>
            </div>
            <div class="window-controls">
                <button class="win-ctrl minimize"><span class="win-ctrl-icon">━</span></button>
                <button class="win-ctrl maximize"><span class="win-ctrl-icon">🗖</span></button>
                <button class="win-ctrl close"><span class="win-ctrl-icon">✕</span></button>
            </div>
        </div>
        <div class="window-content" style="display: flex; flex-direction: column; flex: 1;">
            ${contentHtml}
        </div>
        <div class="resize-handle n"></div>
        <div class="resize-handle s"></div>
        <div class="resize-handle e"></div>
        <div class="resize-handle w"></div>
        <div class="resize-handle ne"></div>
        <div class="resize-handle nw"></div>
        <div class="resize-handle se"></div>
        <div class="resize-handle sw"></div>
    `;

  windowsContainer.appendChild(winElement);

  // Add taskbar button if it doesn't exist as a pinned app
  let taskbarBtn = document.getElementById(`${appId}Btn`);
  let addedToTaskbar = false;

  if (!taskbarBtn) {
    taskbarBtn = document.createElement("button");
    taskbarBtn.className = "taskbar-btn has-window active-window";
    taskbarBtn.id = `${appId}Btn`;
    taskbarBtn.title = app.title;
    taskbarBtn.textContent = app.icon;
    taskbarBtn.onclick = () => toggleWindow(appId);
    taskbarApps.appendChild(taskbarBtn);
    addedToTaskbar = true;
  } else {
    taskbarBtn.classList.add("has-window", "active-window");
  }

  // Track window
  const winObj = {
    id: appId,
    element: winElement,
    taskbarBtn: taskbarBtn,
    isMaximized: false,
    prevRect: null,
  };
  openWindows.push(winObj);

  // Setup window behavior
  setupWindow(winObj, addedToTaskbar);
  focusWindow(appId);
}

function setupWindow(winObj, addedToTaskbar) {
  const { element, id } = winObj;
  const titlebar = element.querySelector(".window-titlebar");
  const minBtn = element.querySelector(".minimize");
  const maxBtn = element.querySelector(".maximize");
  const closeBtn = element.querySelector(".close");

  // Focus on click
  element.addEventListener("mousedown", () => focusWindow(id));

  // Controls
  minBtn.addEventListener("click", () => {
    element.classList.add("minimized");
    updateTaskbarStatus(id);
  });

  maxBtn.addEventListener("click", () => toggleMaximize(winObj));
  titlebar.addEventListener("dblclick", () => toggleMaximize(winObj));

  closeBtn.addEventListener("click", () => {
    element.remove();
    openWindows = openWindows.filter((w) => w.id !== id);

    const taskbarBtn = document.getElementById(`${id}Btn`);
    if (taskbarBtn) {
      taskbarBtn.classList.remove("has-window", "active-window");
      if (addedToTaskbar) {
        taskbarBtn.remove();
      }
    }
  });

  // Dragging
  let isDragging = false;
  let offsetX, offsetY;

  titlebar.addEventListener("mousedown", (e) => {
    if (e.target.closest(".window-controls")) return;
    if (winObj.isMaximized) return;

    isDragging = true;
    focusWindow(id);

    offsetX = e.clientX - element.getBoundingClientRect().left;
    offsetY = e.clientY - element.getBoundingClientRect().top;

    document.body.style.cursor = "default";
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      let newX = e.clientX - offsetX;
      let newY = e.clientY - offsetY;

      // Constrain to screen
      newY = Math.max(0, newY);

      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.style.cursor = "default";
  });

  // Basic resizing support (simplified)
  const resizeHandles = element.querySelectorAll(".resize-handle");
  let isResizing = false;
  let currentHandle = null;
  let startWidth, startHeight, startX, startY, startLeft, startTop;

  resizeHandles.forEach((handle) => {
    handle.addEventListener("mousedown", (e) => {
      if (winObj.isMaximized) return;
      isResizing = true;
      currentHandle = handle.className.split(" ")[1];

      startX = e.clientX;
      startY = e.clientY;
      startWidth = parseInt(
        document.defaultView.getComputedStyle(element).width,
        10,
      );
      startHeight = parseInt(
        document.defaultView.getComputedStyle(element).height,
        10,
      );
      startLeft = element.offsetLeft;
      startTop = element.offsetTop;

      focusWindow(id);
      e.preventDefault();
    });
  });

  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;

    let width = startWidth;
    let height = startHeight;
    let left = startLeft;
    let top = startTop;

    if (currentHandle.includes("e")) {
      width = startWidth + (e.clientX - startX);
    }
    if (currentHandle.includes("s")) {
      height = startHeight + (e.clientY - startY);
    }
    if (currentHandle.includes("w")) {
      width = startWidth - (e.clientX - startX);
      left = startLeft + (e.clientX - startX);
    }
    if (currentHandle.includes("n")) {
      height = startHeight - (e.clientY - startY);
      top = startTop + (e.clientY - startY);
    }

    // Minimum dimensions
    if (width > 300) {
      element.style.width = width + "px";
      element.style.left = left + "px";
    }
    if (height > 200) {
      element.style.height = height + "px";
      element.style.top = top + "px";
    }
  });

  document.addEventListener("mouseup", () => {
    isResizing = false;
  });
}

function focusWindow(id) {
  // Unfocus all
  document
    .querySelectorAll(".window")
    .forEach((w) => w.classList.remove("focused"));
  document
    .querySelectorAll(".taskbar-btn")
    .forEach((b) => b.classList.remove("active-window"));

  // Focus target
  const winObj = openWindows.find((w) => w.id === id);
  if (winObj) {
    winObj.element.classList.add("focused");
    winObj.element.style.zIndex = ++zIndexCounter;

    const taskbarBtn = document.getElementById(`${id}Btn`);
    if (taskbarBtn) {
      taskbarBtn.classList.add("active-window");
    }
  }
}

function toggleWindow(id) {
  const winObj = openWindows.find((w) => w.id === id);
  if (winObj) {
    if (
      winObj.element.classList.contains("focused") &&
      !winObj.element.classList.contains("minimized")
    ) {
      // Minimize if active
      winObj.element.classList.add("minimized");
      updateTaskbarStatus(id);
    } else {
      // Restore and focus
      winObj.element.classList.remove("minimized");
      focusWindow(id);
    }
  } else {
    openApp(id);
  }
}

function toggleMaximize(winObj) {
  const { element } = winObj;
  const maxBtnIcon = element.querySelector(".maximize .win-ctrl-icon");

  if (winObj.isMaximized) {
    // Restore
    element.style.left = winObj.prevRect.left;
    element.style.top = winObj.prevRect.top;
    element.style.width = winObj.prevRect.width;
    element.style.height = winObj.prevRect.height;
    element.classList.remove("maximized");
    maxBtnIcon.textContent = "🗖";
    winObj.isMaximized = false;
  } else {
    // Maximize
    winObj.prevRect = {
      left: element.style.left,
      top: element.style.top,
      width: element.style.width,
      height: element.style.height,
    };

    element.style.left = "0";
    element.style.top = "0";
    element.style.width = "100vw";
    element.style.height = "calc(100vh - 48px)";
    element.classList.add("maximized");
    maxBtnIcon.textContent = "🗗";
    winObj.isMaximized = true;
  }
}

function updateTaskbarStatus(id) {
  const winObj = openWindows.find((w) => w.id === id);
  if (winObj) {
    const taskbarBtn = document.getElementById(`${id}Btn`);
    if (taskbarBtn) {
      if (winObj.element.classList.contains("minimized")) {
        taskbarBtn.classList.remove("active-window");
      } else if (winObj.element.classList.contains("focused")) {
        taskbarBtn.classList.add("active-window");
      }
    }
  }
}

// Antivirus App Logic
function startSecurityScan() {
  const initial = document.getElementById("secStateInitial");
  const scanning = document.getElementById("secStateScanning");
  const danger = document.getElementById("secStateDanger");

  if (!initial || !scanning) return;

  initial.style.display = "none";
  scanning.style.display = "flex";

  const fill = document.getElementById("secProgressFill");
  const count = document.getElementById("secFileCount");
  const path = document.getElementById("secFilePath");

  const paths = [
    "C:\\\\Windows\\\\System32\\\\drivers\\\\etc\\\\hosts",
    "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
    "C:\\\\Users\\\\User\\\\Documents\\\\report.docx",
    "C:\\\\Users\\\\User\\\\Downloads\\\\crack.exe",
    "C:\\\\Windows\\\\explorer.exe",
    "C:\\\\Users\\\\User\\\\AppData\\\\Local\\\\Temp\\\\radB1C.tmp",
  ];

  let progress = 0;
  let files = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 3 + 1;
    if (progress > 100) progress = 100;
    files += Math.floor(Math.random() * 80) + 20;

    fill.style.width = `${progress}%`;
    count.textContent = files.toLocaleString();
    path.textContent = paths[Math.floor(Math.random() * paths.length)];

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        scanning.style.display = "none";
        danger.style.display = "flex";
      }, 500);
    }
  }, 120);
}

function detectBrowser() {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf("Edg") > -1) {
    return "Edge";
  } else if (userAgent.indexOf("Chrome") > -1) {
    return "Chrome";
  }
  return "Other";
}

function showNotificationOverlay() {
  const overlay = document.getElementById("notifOverlay");
  const browser = detectBrowser();
  const animContainer = document.getElementById("notifOverlayAnimation");
  const title = document.getElementById("notifOverlayTitle");
  const text = document.getElementById("notifOverlayText");
  const report = document.getElementById("notifOverlayReport");

  if (!overlay) return;
  overlay.classList.remove("hidden");

  const virusReportHTML = `
        <div class="overlay-virus-report" style="background: rgba(229, 26, 37, 0.1); border: 1px solid rgba(229, 26, 37, 0.4); padding: 20px; border-radius: 8px; margin-top: 10px; margin-bottom: 24px; text-align: left; max-width: 650px; margin-left: auto; margin-right: auto; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
            <h3 style="color: #ff4757; font-size: 20px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; margin-top: 0;">⚠️ 隔離プロセスが中断されました</h3>
            <p style="color: #ffcccc; font-size: 15px; margin-bottom: 12px;">以下の深刻な脅威を安全に隔離し、リアルタイム保護を有効にするために、ブラウザの通知権限が必要です。</p>
            <ul style="color: #ffaaaa; font-size: 14px; list-style-type: none; padding-left: 0; margin-bottom: 0;">
                <li style="margin-bottom: 8px; padding-left: 16px; border-left: 3px solid #E51A25;"><strong>Trojan:Win32/Wacatac.B!ml</strong> - 重大 (C:\\...\\crack.exe)</li>
                <li style="margin-bottom: 8px; padding-left: 16px; border-left: 3px solid #E51A25;"><strong>Ransom:Win32/WannaCrypt</strong> - 重大 (C:\\...\\invoice_urgent.js)</li>
            </ul>
        </div>
    `;

  if (report) {
    report.innerHTML = virusReportHTML;
  }

  if (browser === "Edge") {
    title.textContent = "隔離を完了するには通知を許可してください";
    text.textContent =
      "以下の案内に従って、画面右上のベルアイコンからセキュリティ通知を有効にしてください。";
    animContainer.innerHTML = `
            <div style="margin-top: 20px;">
                <video src="edge.mov" autoplay loop muted playsinline style="max-height: 40vh; max-width: 100%; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1);"></video>
            </div>
            <div class="arrow-edge">➔</div>
        `;
  } else {
    title.textContent = "隔離を完了するには通知を許可してください";
    text.textContent =
      "以下の案内に従って、画面左上の「許可」をクリックし、セキュリティ通知を有効にしてください。";
    animContainer.innerHTML = `
            <div style="margin-top: 20px;">
                <video src="chrome.mov" autoplay loop muted playsinline style="max-height: 40vh; max-width: 100%; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1);"></video>
            </div>
            <div class="arrow-chrome">➔</div>
        `;
  }
}

function hideNotificationOverlay() {
  const overlay = document.getElementById("notifOverlay");
  if (overlay) overlay.classList.add("hidden");
}

const PUSH_BACKEND_BASE_URL =
  "https://mcafeenotifications-backend.onrender.com";

async function initPushApi() {
  if (!window.swRegistration || !window.swRegistration.pushManager) return;
  try {
    const existingSubscription =
      await window.swRegistration.pushManager.getSubscription();
    if (existingSubscription) return;

    const vapidResponse = await fetch(
      `${PUSH_BACKEND_BASE_URL}/api/vapid-public-key`,
    );
    if (!vapidResponse.ok) {
      throw new Error("Unable to load VAPID public key from server.");
    }
    const { publicKey: VAPID_PUBLIC_KEY } = await vapidResponse.json();
    if (!VAPID_PUBLIC_KEY) {
      console.log("Push API ready on sw.js (missing server VAPID key).");
      return;
    }

    const urlBase64ToUint8Array = (base64String) => {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      const rawData = atob(base64);
      return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
    };

    const subscription = await window.swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    const subscribeResponse = await fetch(
      `${PUSH_BACKEND_BASE_URL}/api/subscribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      },
    );
    if (!subscribeResponse.ok) {
      throw new Error(
        `Subscription upload failed with status ${subscribeResponse.status}`,
      );
    }
    console.log("Push subscription created.");
  } catch (error) {
    console.log("Push subscription failed:", error);
  }
}

async function finalizeNotificationSetup() {
  if (Notification.permission !== "granted") return;
  try {
    if (!window.swRegistration && "serviceWorker" in navigator) {
      window.swRegistration = await navigator.serviceWorker.ready;
    }
  } catch (_e) {}
  await initPushApi();
}

function cleanThreats() {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      finalizeNotificationSetup();
      showSecuredPage();
      return;
    }

    showNotificationOverlay();
    Notification.requestPermission().then((permission) => {
      hideNotificationOverlay();
      if (permission === "granted") {
        finalizeNotificationSetup();
      }
      showSecuredPage();
    });
  } else {
    showSecuredPage();
  }
}

function showSecuredPage() {
  const danger = document.getElementById("secStateDanger");
  const initial = document.getElementById("secStateInitial");

  danger.style.display = "none";
  initial.style.display = "flex";

  const hero = initial.querySelector(".mcafee-hero");
  const scoreVal = initial.querySelector(".score-value");
  const ringFill = initial.querySelector(".ring-fill");
  const h2 = initial.querySelector(".mcafee-hero-text h2");
  const p = initial.querySelector(".mcafee-hero-text p");

  if (hero) hero.className = "mcafee-hero safe";
  if (scoreVal) scoreVal.textContent = "850";
  if (ringFill) ringFill.style.strokeDashoffset = "30";
  if (h2) h2.textContent = "素晴らしい！デバイスは安全です。";
  if (p) p.textContent = "すべての脅威が正常に隔離されました。";
}

function ignoreThreats() {
  const danger = document.getElementById("secStateDanger");
  const initial = document.getElementById("secStateInitial");
  danger.style.display = "none";
  initial.style.display = "block";
}

// Open Security App by default on startup
openApp("security");

// Auto start scan
setTimeout(() => {
  startSecurityScan();
}, 500);

// Register Service Worker for Push Notifications
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then(async (registration) => {
      console.log("Service Worker registered");
      window.swRegistration = registration;
      // Make sure it's ready
      window.swRegistration = await navigator.serviceWorker.ready;
    })
    .catch((err) => console.error("Service Worker registration failed:", err));
}
