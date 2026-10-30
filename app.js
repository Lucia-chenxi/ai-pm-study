(function () {
  "use strict";

  var COURSE = window.COURSE;

  /* ---------------- icons ---------------- */

  var ICON = {
    search:
      '<svg class="od-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.6 15.6 4.4 4.4" stroke-linecap="round"/></svg>',
    close:
      '<svg class="od-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18" stroke-linecap="round"/></svg>',
    arrow:
      '<svg class="od-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><path d="M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    ext:
      '<svg class="od-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true" focusable="false"><path d="M14 4h6v6" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 4 11 13" stroke-linecap="round"/><path d="M18 14v5.5H4.5V6H10" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    star:
      '<svg class="od-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true" focusable="false"><path d="m12 3.6 2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.8 1-5.85L3.5 9.75l5.9-.85z" stroke-linejoin="round"/></svg>'
  };

  var TYPE_META = {
    method: { label: "基础方法", en: "METHOD" },
    doc: { label: "当前文档", en: "DOCS" },
    article: { label: "文章与视频", en: "READ / WATCH" }
  };

  var TYPE_HINT = {
    doc: "你收藏的产品与工具文档。",
    article: "你想回看的文章、视频和案例。",
    method: "值得反复使用的方法与教材。"
  };

  var ROLE_LABEL = { primary: "主线", secondary: "补充", extra: "追加" };
  var ROLE_LONG = { primary: "主线资料", secondary: "补充资料", extra: "追加来源" };
  var ROLE_ORDER = { primary: 0, secondary: 1, extra: 2 };

  /* ---------------- small helpers ---------------- */

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function safeUrl(url) {
    try {
      var parsed = new URL(String(url || ""));
      return /^https?:$/.test(parsed.protocol) && !parsed.username && !parsed.password ? parsed.href : "#";
    } catch (e) { return "#"; }
  }

  function stageOf(n) {
    for (var i = 0; i < COURSE.stages.length; i++) {
      var s = COURSE.stages[i];
      if (n >= s.range[0] && n <= s.range[1]) return s;
    }
    return COURSE.stages[0];
  }

  function moduleOf(n) {
    return COURSE.modules.filter(function (m) { return m.n === n; })[0] || null;
  }

  function modulesOfStage(stage) {
    return COURSE.modules.filter(function (m) {
      return m.n >= stage.range[0] && m.n <= stage.range[1];
    });
  }

  function sourceType(s) {
    if (TYPE_META[s.typeKey]) return s.typeKey;
    var t = String(s.date_type || "");
    if (t.indexOf("持续更新官方文档") === 0 || t.indexOf("页面最后修改日期") === 0) return "doc";
    if (
      t.indexOf("页面发布日期") === 0 ||
      t.indexOf("官方资源页日期") === 0
    ) {
      return "article";
    }
    return "method";
  }

  function checkLabel(s) {
    var t = String(s.date_type || "");
    if (t.indexOf("未再次检查") !== -1) return "本轮未再次检查";
    if (s.verified_on) return "核验于 " + s.verified_on;
    return "本轮未核验";
  }

  function dateLabel(s) {
    var t = String(s.date_type || "");
    if (t.indexOf("最后修改") !== -1) return "更新时间";
    if (t.indexOf("页面发布日期") !== -1) return "发布时间";
    if (t.indexOf("官方资源页日期") !== -1) return "资源页日期";
    return "标注日期";
  }

  function dateGrid(s) {
    var unknown = !s.date;
    return (
      '<dl class="date-grid">' +
      '<div class="date-cell"><dt>' + dateLabel(s) + "</dt><dd" + (unknown ? ' class="is-unknown"' : "") + ">" +
      esc(s.date || "未确认") + "</dd></div>" +
      '<div class="date-cell"><dt>核验</dt><dd' + (s.verified_on ? "" : ' class="is-unknown"') + ">" +
      esc(checkLabel(s)) + "</dd></div>" +
      '<div class="date-cell is-wide"><dt>日期性质</dt><dd>' + esc(s.date_type) + "</dd></div>" +
      "</dl>"
    );
  }

  function moduleSources(m) {
    return getSources().filter(function (s) { return s.moduleN === m.n; })
      .map(function (s) { return { role: "extra", src: s }; });
  }

  function formatTime(iso) {
    var d = new Date(iso);
    if (!iso || isNaN(d.getTime())) return "时间未记录";
    var p = function (v) { return String(v).padStart(2, "0"); };
    return (
      d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) +
      " " + p(d.getHours()) + ":" + p(d.getMinutes())
    );
  }

  function announce(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function fromParam() {
    var from = new URLSearchParams(window.location.search).get("from");
    return from === "library" || from === "growth" ? from : "";
  }

  function moduleHref(n) {
    var from = fromParam();
    return "module.html?m=" + n + (from ? "&from=" + from : "");
  }

  function backInfo() {
    var from = fromParam();
    if (from === "library") return { href: "library.html", label: "返回资料书架" };
    if (from === "growth") return { href: "growth.html", label: "返回我的成长" };
    return { href: "index.html", label: "返回学习地图" };
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ---------------- storage ---------------- */

  var KEY_FAV = "aipm06.favorites";
  var KEY_NOTES = "aipm06.notes";
  var KEY_SOURCES = "aipm05.userSources";
  var KEY_TAGS = "aipm06.tags";
  var KEY_HIDDEN_TAGS = "aipm06.hiddenTags";
  var KEY_PENDING_DELETES = "aipm07.pendingDeletes";
  var KEY_PENDING_UPSERTS = "aipm07.pendingUpserts";
  var PUBLIC_REPO = "Lucia-chenxi/ai-pm-study";
  var publicSources = [];
  var mem = { favorites: null, notes: null, sources: null, tags: null, hiddenTags: null };
  var storageOK = (function () {
    try {
      var k = "__aipm_probe__";
      window.localStorage.setItem(k, "1");
      window.localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  })();

  function readFav() {
    if (mem.favorites) return mem.favorites;
    var list = [];
    if (storageOK) {
      try {
        var raw = window.localStorage.getItem(KEY_FAV);
        var parsed = raw ? JSON.parse(raw) : null;
        if (!raw) {
          var legacy = JSON.parse(window.localStorage.getItem("aipm05.favorites") || "[]");
          if (Array.isArray(legacy)) parsed = legacy.map(function (n) { return COURSE.oldToNew[n]; });
        }
        if (Array.isArray(parsed)) {
          list = parsed.filter(function (n) {
            return Number.isInteger(n) && n >= 1 && n <= COURSE.modules.length;
          });
        }
      } catch (e) {
        list = [];
      }
    }
    list = Array.from(new Set(list)).sort(function (a, b) { return a - b; });
    mem.favorites = list;
    return list;
  }

  function writeFav(list) {
    mem.favorites = list.slice();
    if (!storageOK) return false;
    try {
      window.localStorage.setItem(KEY_FAV, JSON.stringify(list));
      return true;
    } catch (e) {
      storageOK = false;
      return false;
    }
  }

  function readNotes() {
    if (mem.notes) return mem.notes;
    var out = {};
    if (storageOK) {
      try {
        var raw = window.localStorage.getItem(KEY_NOTES);
        var parsed = raw ? JSON.parse(raw) : null;
        if (!raw) {
          var legacyNotes = JSON.parse(window.localStorage.getItem("aipm05.notes") || "{}");
          if (legacyNotes && typeof legacyNotes === "object") {
            parsed = {};
            Object.keys(legacyNotes).forEach(function (key) {
              var newN = COURSE.oldToNew[Number(key)];
              var item = legacyNotes[key];
              if (!newN || !item || !item.text) return;
              var heading = "【" + COURSE.originalModuleTitles[Number(key) - 1] + "】\n";
              var previous = parsed[newN] ? parsed[newN].text + "\n\n" : "";
              parsed[newN] = { text: previous + heading + item.text, savedAt: item.savedAt || "" };
            });
          }
        }
        if (parsed && typeof parsed === "object") {
          Object.keys(parsed).forEach(function (key) {
            var item = parsed[key];
            if (item && typeof item.text === "string" && item.text.trim()) {
              out[key] = { text: item.text, savedAt: item.savedAt || "" };
            }
          });
        }
      } catch (e) {
        out = {};
      }
    }
    mem.notes = out;
    return out;
  }

  function writeNotes(notes) {
    mem.notes = notes;
    if (!storageOK) return false;
    try {
      window.localStorage.setItem(KEY_NOTES, JSON.stringify(notes));
      return true;
    } catch (e) {
      storageOK = false;
      return false;
    }
  }

  function readSources() {
    if (mem.sources) return mem.sources;
    var list = [];
    if (storageOK) {
      try {
        var parsed = JSON.parse(window.localStorage.getItem(KEY_SOURCES) || "[]");
        if (Array.isArray(parsed)) {
          list = parsed.filter(function (s) {
            return s && typeof s.id === "string" && typeof s.title === "string" &&
              TYPE_META[s.typeKey] && (s.kind === "file" || /^https?:\/\//i.test(String(s.url || "")));
          }).map(function (s) {
            if (s.schemaVersion !== 2) {
              var oldN = Number(s.moduleN) || 0;
              s.moduleN = COURSE.oldToNew[oldN] || 0;
              s.tags = oldN && COURSE.oldTagById[oldN] ? [COURSE.oldTagById[oldN]] : [];
              s.schemaVersion = 2;
            }
            if (!Array.isArray(s.tags)) s.tags = [];
            if (!s.kind) s.kind = "link";
            return s;
          });
        }
      } catch (e) { list = []; }
    }
    mem.sources = list;
    return list;
  }

  function writeSources(list) {
    mem.sources = list.slice();
    if (!storageOK) return false;
    try {
      window.localStorage.setItem(KEY_SOURCES, JSON.stringify(list));
      return true;
    } catch (e) {
      storageOK = false;
      return false;
    }
  }

  function readHiddenTags() {
    if (mem.hiddenTags) return mem.hiddenTags;
    var hidden = [];
    if (storageOK) {
      try { hidden = JSON.parse(window.localStorage.getItem(KEY_HIDDEN_TAGS) || "[]"); } catch (e) { hidden = []; }
    }
    mem.hiddenTags = Array.isArray(hidden) ? hidden : [];
    return mem.hiddenTags;
  }

  function writeHiddenTags(hidden) {
    mem.hiddenTags = hidden;
    if (storageOK) {
      try { window.localStorage.setItem(KEY_HIDDEN_TAGS, JSON.stringify(hidden)); }
      catch (e) { storageOK = false; }
    }
  }

  function readTags() {
    if (mem.tags) return mem.tags;
    var custom = [];
    if (storageOK) {
      try { custom = JSON.parse(window.localStorage.getItem(KEY_TAGS) || "[]"); } catch (e) { custom = []; }
    }
    if (!Array.isArray(custom)) custom = [];
    var publishedTags = publicSources.reduce(function (all, source) { return all.concat(source.tags || []); }, []);
    mem.tags = COURSE.tags.filter(function (tag) { return readHiddenTags().indexOf(tag) === -1; }).concat(custom, publishedTags).filter(function (tag, i, all) {
      return typeof tag === "string" && tag.trim() && all.findIndex(function (x) {
        return String(x).toLowerCase() === tag.toLowerCase();
      }) === i;
    });
    return mem.tags;
  }

  function addTag(tag) {
    var all = readTags();
    var found = all.filter(function (t) { return t.toLowerCase() === tag.toLowerCase(); })[0];
    if (found) return found;
    var builtIn = COURSE.tags.filter(function (t) { return t.toLowerCase() === tag.toLowerCase(); })[0];
    if (builtIn) {
      writeHiddenTags(readHiddenTags().filter(function (t) { return t !== builtIn; }));
      mem.tags = all.concat(builtIn);
      return builtIn;
    }
    var custom = all.filter(function (t) { return COURSE.tags.indexOf(t) === -1; }).concat(tag);
    mem.tags = all.concat(tag);
    if (storageOK) {
      try { window.localStorage.setItem(KEY_TAGS, JSON.stringify(custom)); }
      catch (e) { storageOK = false; }
    }
    return tag;
  }

  function removeTag(tag) {
    var remaining = readTags().filter(function (t) { return t !== tag; });
    if (COURSE.tags.indexOf(tag) !== -1) {
      writeHiddenTags(readHiddenTags().concat(tag));
    } else if (storageOK) {
      try { window.localStorage.setItem(KEY_TAGS, JSON.stringify(remaining.filter(function (t) { return COURSE.tags.indexOf(t) === -1; }))); }
      catch (e) { storageOK = false; }
    }
    mem.tags = remaining;
    writeSources(getSources().map(function (s) {
      return Object.assign({}, s, { tags: (s.tags || []).filter(function (t) { return t !== tag; }) });
    }));
  }

  function renameCustomTag(oldName, newName) {
    if (COURSE.tags.indexOf(oldName) !== -1) return;
    var custom = readTags().filter(function (t) { return COURSE.tags.indexOf(t) === -1; })
      .map(function (t) { return t === oldName ? newName : t; });
    mem.tags = readTags().map(function (t) { return t === oldName ? newName : t; });
    if (storageOK) {
      try { window.localStorage.setItem(KEY_TAGS, JSON.stringify(custom)); }
      catch (e) { storageOK = false; }
    }
    writeSources(getSources().map(function (s) {
      return Object.assign({}, s, {
        tags: (s.tags || []).map(function (tag) { return tag === oldName ? newName : tag; })
      });
    }));
  }

  function openFileDb() {
    return new Promise(function (resolve, reject) {
      if (!window.indexedDB) { reject(new Error("IndexedDB unavailable")); return; }
      var request = window.indexedDB.open("aipm06.files", 1);
      request.onupgradeneeded = function () { request.result.createObjectStore("files"); };
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error); };
    });
  }

  function fileRequest(method, id, value) {
    return openFileDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction("files", method === "get" ? "readonly" : "readwrite");
        var store = tx.objectStore("files");
        var request = method === "put" ? store.put(value, id) : method === "delete" ? store.delete(id) : store.get(id);
        var result;
        request.onsuccess = function () { result = request.result; };
        tx.oncomplete = function () { db.close(); resolve(result); };
        tx.onerror = function () { db.close(); reject(tx.error); };
      });
    });
  }

  var Store = {
    favorites: function () {
      return readFav().slice();
    },
    isFav: function (n) {
      return readFav().indexOf(n) !== -1;
    },
    toggleFav: function (n) {
      var list = readFav().slice();
      var i = list.indexOf(n);
      if (i === -1) list.push(n);
      else list.splice(i, 1);
      list.sort(function (a, b) { return a - b; });
      writeFav(list);
      return list.indexOf(n) !== -1;
    },
    removeFav: function (n) {
      writeFav(readFav().filter(function (x) { return x !== n; }));
    },
    notes: function () {
      return Object.assign({}, readNotes());
    },
    note: function (n) {
      var all = readNotes();
      return all[n] ? { text: all[n].text, savedAt: all[n].savedAt } : null;
    },
    saveNote: function (n, text) {
      var all = Object.assign({}, readNotes());
      all[n] = { text: text, savedAt: new Date().toISOString() };
      return writeNotes(all);
    },
    removeNote: function (n) {
      var all = Object.assign({}, readNotes());
      delete all[n];
      writeNotes(all);
    }
  };

  /* ---------------- personal sources ---------------- */

  function getSources() {
    var pending = [];
    try { pending = JSON.parse(window.localStorage.getItem(KEY_PENDING_DELETES) || "[]"); } catch (e) {}
    var waiting = pendingUpserts();
    var sources = readSources().map(function (local) {
      var remote = publicSources.filter(function (source) { return source.id === local.id || source.url === local.url; })[0];
      return remote && waiting.indexOf(local.id) === -1 ? Object.assign({}, remote, { note: local.note || "" }) : local;
    });
    publicSources.forEach(function (source) {
      if (!sources.some(function (local) { return local.id === source.id || local.url === source.url; })) sources.push(source);
    });
    return sources.filter(function (source) {
      return pending.indexOf(source.id) === -1;
    }).sort(function (a, b) {
      return String(b.addedAt || "").localeCompare(String(a.addedAt || ""));
    });
  }

  function githubIssueUrl(change) {
    var summary = change.action === "delete"
      ? "删除公开资料：" + (change.title || change.id)
      : "保存公开资料：" + change.item.title + "\n" + change.item.url + "\n标签：" + change.item.tags.join("、");
    var body = summary + "\n\n<!-- AIPM_SOURCE\n" + JSON.stringify(change) + "\nAIPM_SOURCE -->";
    return "https://github.com/" + PUBLIC_REPO + "/issues/new?title=" +
      encodeURIComponent("更新公开书架") + "&body=" + encodeURIComponent(body);
  }

  function pendingDeletes() {
    try { return JSON.parse(window.localStorage.getItem(KEY_PENDING_DELETES) || "[]"); }
    catch (e) { return []; }
  }

  function pendingUpserts() {
    try { return JSON.parse(window.localStorage.getItem(KEY_PENDING_UPSERTS) || "[]"); }
    catch (e) { return []; }
  }

  function setPendingUpsert(id, pending) {
    var list = pendingUpserts().filter(function (item) { return item !== id; });
    if (pending) list.push(id);
    window.localStorage.setItem(KEY_PENDING_UPSERTS, JSON.stringify(list));
  }

  function setPendingDelete(id, pending) {
    var list = pendingDeletes().filter(function (item) { return item !== id; });
    if (pending) list.push(id);
    window.localStorage.setItem(KEY_PENDING_DELETES, JSON.stringify(list));
  }

  /* ---------------- module dialog ---------------- */

  var dialogEl = null;
  var lastTrigger = null;
  var dlgState = { current: 0, tab: "content" };

  function tabButton(id, label, active) {
    return (
      '<button type="button" class="tab" role="tab" id="tab-' + id + '"' +
      ' aria-controls="panel-' + id + '" aria-selected="' + active + '"' +
      ' tabindex="' + (active ? "0" : "-1") + '" data-tab="' + id + '">' + label + "</button>"
    );
  }

  function favButtonHTML(n) {
    var on = Store.isFav(n);
    return (
      '<button type="button" class="fav-btn" id="dlg-fav" aria-pressed="' + on + '" data-fav="' + n + '">' +
      ICON.star + "<span>" + (on ? "已收藏" : "收藏模块") + "</span></button>"
    );
  }

  function sourceTitleHTML(s) {
    if (s.kind === "file") {
      return '<button type="button" class="source-file-link" data-open-file="' + esc(s.id) + '">' +
        esc(s.title) + ' <span aria-hidden="true">↓</span><span class="sr-only">（下载上传的文件）</span></button>';
    }
    return '<a href="' + esc(safeUrl(s.url)) + '" target="_blank" rel="noopener noreferrer">' +
      esc(s.title) + ICON.ext + '<span class="sr-only">（在新标签页打开原始页面）</span></a>';
  }

  function sourceTagsHTML(s) {
    return Array.isArray(s.tags) && s.tags.length
      ? '<div class="source-tags-on-card">' + s.tags.map(function (tag) { return '<span class="source-tag"># ' + esc(tag) + '</span>'; }).join("") + '</div>'
      : "";
  }

  function sourceRowHTML(s, role) {
    var typeKey = sourceType(s);
    return (
      '<article class="source-card">' +
      '<div class="source-top">' +
      '<span class="badge badge-' + typeKey + '">' + TYPE_META[typeKey].label + "</span>" +
      "</div>" +
      '<h3 class="source-title">' + sourceTitleHTML(s) + '</h3>' +
      (pendingUpserts().indexOf(s.id) !== -1 ? '<a class="use-chip" href="' + esc(githubIssueUrl({ action: "upsert", item: window.AIPMPublicData.cleanSource(s) })) + '">待发布 · 前往 GitHub 确认</a>' : '') +
      (s.note ? '<p class="source-scope">' + esc(s.note) + "</p>" : "") +
      sourceTagsHTML(s) +
      '<a class="source-edit-link" href="library.html?edit=' + encodeURIComponent(s.id) + '#add-source">编辑这条资料 →</a>' +
      "</article>"
    );
  }

  function dialogHTML(m) {
    var st = stageOf(m.n);
    var saved = Store.note(m.n);
    var noteText = saved ? saved.text : "";
    var sources = moduleSources(m);

    return (
      '<div class="dlg-shell">' +
      '<header class="dlg-head">' +
      '<div class="dlg-top">' +
      '<p class="dlg-kicker">模块 ' + pad2(m.n) + " · 阶段 " + pad2(st.n) + " " + esc(st.name) + "</p>" +
      '<button type="button" class="icon-btn" data-close aria-label="关闭模块详情">' + ICON.close + "</button>" +
      "</div>" +
      '<h2 class="dlg-title" id="dlg-title">' + esc(m.title) + "</h2>" +
      '<p class="dlg-question">' + esc(m.question) + "</p>" +
      '<div class="mp-topic-tags">' + m.tags.map(function (tag) { return '<span># ' + esc(tag) + '</span>'; }).join("") + '</div>' +
      '<div class="dlg-meta">' +
      '<span class="meta-pill">' + m.units.length + " 个学习单元</span>" +
      '<span class="meta-pill">' + sources.length + " 条资料</span>" +
      favButtonHTML(m.n) +
      "</div>" +
      "</header>" +
      '<div class="tabs" role="tablist" aria-label="模块详情分区">' +
      tabButton("content", "内容", true) +
      tabButton("sources", "资料", false) +
      tabButton("practice", "练习", false) +
      "</div>" +
      '<div class="dlg-body">' +
      '<p class="sr-only" role="status" aria-live="polite" id="dlg-status"></p>' +
      '<section id="panel-content" role="tabpanel" aria-labelledby="tab-content" tabindex="0">' +
      '<p class="panel-label">学习单元 · ' + m.units.length + "</p>" +
      '<ol class="unit-list">' +
      m.units.map(function (u, i) {
        return '<li><span class="unit-idx">' + pad2(i + 1) + "</span><span>" + esc(u) + "</span></li>";
      }).join("") +
      "</ol>" +
      '<div class="fact-grid">' +
      '<div class="fact"><h4>练习作品</h4><p>' + esc(m.artifact) + "</p></div>" +
      '<div class="fact"><h4>完成标准</h4><p>' + esc(m.completion) + "</p></div>" +
      '<div class="fact fact-wide"><h4>学习边界</h4><p>' + esc(m.limit) + "</p></div>" +
      "</div>" +
      '<p class="policy-note"><b>资料策略</b> · ' + esc(m.source_policy) + "</p>" +
      "</section>" +
      '<section id="panel-sources" role="tabpanel" aria-labelledby="tab-sources" tabindex="0" hidden>' +
      '<p class="panel-intro">把你找到的好资料收进这个模块，学习时随手回来翻。</p>' +
      '<div class="source-list">' +
      (sources.length ? sources.map(function (s) { return sourceRowHTML(s.src, s.role); }).join("") : '<p class="source-empty">这里还没有资料。第一条由你来放。</p>') +
      "</div>" +
      '<a class="btn btn-ghost source-add-link" href="library.html?module=' + m.n + '#add-source">+ 添加资料</a>' +
      "</section>" +
      '<section id="panel-practice" role="tabpanel" aria-labelledby="tab-practice" tabindex="0" hidden>' +
      '<p class="practice-q">用三分钟，向一位没做过产品的同事解释：<br><strong>' + esc(m.question) + "</strong></p>" +
      '<ol class="steps">' +
      '<li><span class="step-no">01</span><span><b>说清问题</b>：先用一句话说明这个模块要解决什么问题，不要用术语开场。</span></li>' +
      '<li><span class="step-no">02</span><span><b>举一个例子</b>：讲一个你真实见过的场景，说明没有这套方法时会怎样出错。</span></li>' +
      '<li><span class="step-no">03</span><span><b>交出边界</b>：说出你还不确定的地方，以及下一步要验证什么。</span></li>' +
      "</ol>" +
      '<div class="note-area">' +
      '<label class="field-label" for="note-input">我的三分钟讲解提纲</label>' +
      '<textarea id="note-input" maxlength="3000" placeholder="写要点就好，不必写成文章。讲不清的地方，往往就是下一步要读的地方。">' +
      esc(noteText) + "</textarea>" +
      "</div>" +
      '<div class="note-bar">' +
      '<span class="note-count" id="note-count">0 / 3000 字</span>' +
      '<button type="button" class="btn" id="save-note">保存到本机</button>' +
      '<span class="note-status" id="note-status" role="status" aria-live="polite"></span>' +
      "</div>" +
      '<p class="fineprint">这份笔记只保存在这台设备的浏览器里，不上传、不评分，也没有人点评。它不是作业，只是让“讲一遍”这一步真的发生。切换模块前请先点保存，未保存的草稿不会自动保留。</p>' +
      "</section>" +
      "</div>" +
      '<footer class="dlg-foot">' +
      '<button type="button" class="foot-btn" data-prev' + (m.n === 1 ? " disabled" : "") + ">← 上一模块</button>" +
      '<button type="button" class="foot-btn" data-close>关闭面板</button>' +
      '<button type="button" class="foot-btn" data-next' + (m.n === COURSE.modules.length ? " disabled" : "") + ">下一模块 →</button>" +
      "</footer>" +
      "</div>"
    );
  }

  function applyTab(name) {
    ["content", "sources", "practice"].forEach(function (key) {
      var btn = dialogEl.querySelector("#tab-" + key);
      var panel = dialogEl.querySelector("#panel-" + key);
      var active = key === name;
      if (btn) {
        btn.setAttribute("aria-selected", active ? "true" : "false");
        btn.tabIndex = active ? 0 : -1;
      }
      if (panel) panel.hidden = !active;
    });
  }

  function switchTab(name) {
    dlgState.tab = name;
    applyTab(name);
  }

  function updateNoteCount(len) {
    var el = document.getElementById("note-count");
    if (el) el.textContent = len + " / 3000 字";
  }

  function openModule(n, trigger, tab) {
    var m = moduleOf(n);
    if (!m || !dialogEl) return;
    dlgState.current = n;
    dlgState.tab = tab || "content";
    dialogEl.innerHTML = dialogHTML(m);
    var saved = Store.note(n);
    updateNoteCount(saved ? saved.text.length : 0);
    if (!dialogEl.open) {
      if (typeof dialogEl.showModal === "function") dialogEl.showModal();
      else dialogEl.setAttribute("open", "");
    }
    document.body.classList.add("is-locked");
    if (trigger) lastTrigger = trigger;
    applyTab(dlgState.tab);
    var active = dialogEl.querySelector('.tab[aria-selected="true"]');
    if (active) active.focus();
  }

  function closeModule() {
    if (!dialogEl) return;
    if (typeof dialogEl.close === "function" && dialogEl.open) {
      dialogEl.close();
    } else {
      dialogEl.removeAttribute("open");
      afterClose();
    }
  }

  function afterClose() {
    document.body.classList.remove("is-locked");
    var target =
      lastTrigger && document.contains(lastTrigger)
        ? lastTrigger
        : document.querySelector("[data-module], [data-open]");
    dialogEl.innerHTML = "";
    if (target && typeof target.focus === "function") target.focus();
  }

  function saveNoteInDialog() {
    var ta = document.getElementById("note-input");
    var status = document.getElementById("note-status");
    if (!ta || !status) return;
    var text = ta.value.trim();
    if (!text) {
      status.textContent = "先写一句也算开始，保存需要一点文字。";
      status.classList.add("is-warn");
      ta.focus();
      return;
    }
    var ok = Store.saveNote(dlgState.current, text);
    status.classList.remove("is-warn");
    status.textContent = ok
      ? "已保存到本机，刷新后仍在。"
      : "已保存在本次会话（浏览器未允许本地存储）。";
    announce("dlg-status", ok ? "讲解笔记已保存到本机" : "讲解笔记已保存在本次会话");
    if (document.body.dataset.page === "growth" && typeof window.__renderGrowth === "function") {
      window.__renderGrowth();
    }
  }

  function initDialog() {
    dialogEl = document.getElementById("module-dialog");
    if (!dialogEl) return;

    dialogEl.addEventListener("click", function (e) {
      if (e.target === dialogEl) {
        closeModule();
        return;
      }
      var tabBtn = e.target.closest("[data-tab]");
      if (tabBtn) {
        switchTab(tabBtn.dataset.tab);
        return;
      }
      if (e.target.closest("[data-close]")) {
        closeModule();
        return;
      }
      var fav = e.target.closest("#dlg-fav");
      if (fav) {
        var n = dlgState.current;
        var on = Store.toggleFav(n);
        fav.setAttribute("aria-pressed", on ? "true" : "false");
        var label = fav.querySelector("span");
        if (label) label.textContent = on ? "已收藏" : "收藏模块";
        announce("dlg-status", on ? "已收藏模块 " + pad2(n) : "已取消收藏模块 " + pad2(n));
        if (document.body.dataset.page === "growth" && typeof window.__renderGrowth === "function") {
          window.__renderGrowth();
        }
        return;
      }
      if (e.target.closest("#save-note")) {
        saveNoteInDialog();
        return;
      }
      var prev = e.target.closest("[data-prev]");
      if (prev) {
        openModule(dlgState.current - 1, null, dlgState.tab);
        return;
      }
      var next = e.target.closest("[data-next]");
      if (next) {
        openModule(dlgState.current + 1, null, dlgState.tab);
        return;
      }
    });

    dialogEl.addEventListener("input", function (e) {
      if (e.target && e.target.id === "note-input") {
        updateNoteCount(e.target.value.length);
        var status = document.getElementById("note-status");
        if (status) {
          status.textContent = "";
          status.classList.remove("is-warn");
        }
      }
    });

    dialogEl.addEventListener("keydown", function (e) {
      var tab = e.target.closest ? e.target.closest(".tab") : null;
      if (tab) {
        var tabs = Array.prototype.slice.call(dialogEl.querySelectorAll(".tab"));
        var i = tabs.indexOf(tab);
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          var dir = e.key === "ArrowRight" ? 1 : -1;
          var target = tabs[(i + dir + tabs.length) % tabs.length];
          target.focus();
          switchTab(target.dataset.tab);
          return;
        }
        if (e.key === "Home" || e.key === "End") {
          e.preventDefault();
          var edge = e.key === "Home" ? tabs[0] : tabs[tabs.length - 1];
          edge.focus();
          switchTab(edge.dataset.tab);
          return;
        }
      }
      if (e.target && e.target.id === "note-input" && (e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        saveNoteInDialog();
      }
    });

    dialogEl.addEventListener("close", afterClose);
  }

  /* ---------------- course map ---------------- */

  var mapState = { stage: "all", q: "" };

  function moduleCardHTML(m, reasons) {
    var st = stageOf(m.n);
    return (
      '<a class="module-card" href="' + moduleHref(m.n) + '" data-module="' + m.n + '">' +
      '<span class="card-top"><span class="card-no">No.' + pad2(m.n) + "</span>" +
      '<span class="card-stage">' + esc(st.name) + "</span></span>" +
      '<span class="card-title">' + esc(m.title) + "</span>" +
      '<span class="card-question">' + esc(m.question) + "</span>" +
      '<span class="card-tags">' + m.tags.map(function (tag) { return '<span># ' + esc(tag) + '</span>'; }).join("") + '</span>' +
      (reasons && reasons.length
        ? '<span class="card-match"><b>命中</b> ' +
          esc(reasons.slice(0, 2).map(function (r) {
            return r.length > 38 ? r.slice(0, 38) + "…" : r;
          }).join(" · ")) +
          "</span>"
        : "") +
      '<span class="card-foot"><span>' + m.units.length + " 个单元</span>" +
      '<span class="card-open">打开' + ICON.arrow + "</span></span>" +
      "</a>"
    );
  }

  function stageSectionHTML(stage) {
    var mods = modulesOfStage(stage);
    var units = mods.reduce(function (sum, m) { return sum + m.units.length; }, 0);
    return (
      '<section class="stage-section" aria-labelledby="stage-' + stage.n + '">' +
      '<div class="stage-head">' +
      '<p class="stage-no" aria-hidden="true">' + pad2(stage.n) + "</p>" +
      '<div class="stage-body">' +
      '<h2 id="stage-' + stage.n + '">' + esc(stage.name) +
      ' <span class="stage-en">' + esc(stage.en) + "</span></h2>" +
      '<p class="stage-blurb">' + esc(stage.blurb) + "</p>" +
      "</div>" +
      '<p class="stage-count"><span><strong>' + mods.length + "</strong> 个模块</span>" +
      "<span><strong>" + units + "</strong> 个单元</span></p>" +
      "</div>" +
      '<div class="module-grid">' + mods.map(function (m) { return moduleCardHTML(m); }).join("") + "</div>" +
      "</section>"
    );
  }

  function searchModules(query) {
    var needle = query.trim().toLowerCase();
    if (!needle) return [];
    var out = [];
    COURSE.modules.forEach(function (m) {
      var reasons = [];
      if (m.title.toLowerCase().indexOf(needle) !== -1) reasons.push("标题");
      if (m.question.toLowerCase().indexOf(needle) !== -1) reasons.push("核心问题");
      m.tags.forEach(function (tag) { if (tag.toLowerCase().indexOf(needle) !== -1) reasons.push("主题：" + tag); });
      m.units.forEach(function (u) {
        if (u.toLowerCase().indexOf(needle) !== -1) reasons.push("单元：" + u);
      });
      moduleSources(m).forEach(function (entry) {
        if (String(entry.src.title).toLowerCase().indexOf(needle) !== -1) {
          reasons.push("资料：" + entry.src.title);
        }
        if (String(entry.src.note || "").toLowerCase().indexOf(needle) !== -1) {
          reasons.push("备注：" + entry.src.note);
        }
      });
      if (String(m.artifact).toLowerCase().indexOf(needle) !== -1) reasons.push("练习作品");
      if (String(m.completion).toLowerCase().indexOf(needle) !== -1) reasons.push("完成标准");
      if (String(m.limit).toLowerCase().indexOf(needle) !== -1) reasons.push("学习边界");
      var st = stageOf(m.n);
      if (st.name.toLowerCase().indexOf(needle) !== -1) reasons.push("阶段：" + st.name);
      if (reasons.length) out.push({ m: m, reasons: reasons });
    });
    return out;
  }

  function renderMapBody() {
    var body = document.getElementById("map-body");
    if (!body) return;
    var q = mapState.q.trim();
    if (q) {
      var results = searchModules(q);
      var head =
        '<div class="result-bar">' +
        '<h2 class="result-title">搜索结果</h2>' +
        '<p class="result-count">' + results.length + " / " + COURSE.modules.length +
        " 个模块命中「" + esc(q) + "」 · 范围：全部 " + COURSE.modules.length + " 个模块</p>" +
        "</div>";
      if (!results.length) {
        body.innerHTML =
          head +
          '<div class="stage-section"><div class="empty-block">' +
          "<h3>没有匹配的模块</h3>" +
          "<p>「" + esc(q) + "」没有出现在模块、主题标签、单元或资料里。换一个更短的关键词试试，例如「评测」「访谈」「成本」。</p>" +
          '<button type="button" class="btn" data-clear-search>清空搜索</button>' +
          "</div></div>";
      } else {
        body.innerHTML =
          head +
          '<section class="stage-section" aria-label="搜索结果">' +
          '<div class="module-grid">' +
          results.map(function (r) { return moduleCardHTML(r.m, r.reasons); }).join("") +
          "</div></section>";
      }
      announce("map-status", results.length + " 个模块匹配搜索");
      return;
    }
    var stages = mapState.stage === "all"
      ? COURSE.stages
      : COURSE.stages.filter(function (s) { return s.n === mapState.stage; });
    body.innerHTML = stages.map(stageSectionHTML).join("");
    announce("map-status", "正在显示 " + (mapState.stage === "all" ? "全部六个阶段" : "阶段 " + pad2(mapState.stage)) + "，共 " + COURSE.modules.length + " 个模块");
  }

  function syncStageRail() {
    var rail = document.getElementById("stage-rail");
    if (!rail) return;
    Array.prototype.forEach.call(rail.querySelectorAll("[data-stage]"), function (btn) {
      var val = btn.dataset.stage;
      if (val === "all") {
        btn.setAttribute("aria-pressed", mapState.stage === "all" ? "true" : "false");
      } else {
        btn.setAttribute("aria-pressed", Number(val) === mapState.stage ? "true" : "false");
      }
    });
  }

  function initMap() {
    var input = document.getElementById("map-search");
    var clear = document.getElementById("map-clear");
    var rail = document.getElementById("stage-rail");
    var body = document.getElementById("map-body");
    if (!input || !rail || !body) return;

    input.addEventListener("input", function () {
      mapState.q = input.value;
      if (clear) clear.hidden = !input.value;
      renderMapBody();
    });

    if (clear) {
      clear.addEventListener("click", function () {
        mapState.q = "";
        input.value = "";
        clear.hidden = true;
        input.focus();
        renderMapBody();
      });
    }

    rail.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-stage]");
      if (!btn) return;
      mapState.stage = btn.dataset.stage === "all" ? "all" : Number(btn.dataset.stage);
      if (input.value) {
        mapState.q = "";
        input.value = "";
        if (clear) clear.hidden = true;
      }
      syncStageRail();
      renderMapBody();
    });

    body.addEventListener("click", async function (e) {
      var clearBtn = e.target.closest("[data-clear-search]");
      if (clearBtn) {
        mapState.q = "";
        input.value = "";
        if (clear) clear.hidden = true;
        input.focus();
        renderMapBody();
      }
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && input.value) {
        e.preventDefault();
        input.value = "";
        mapState.q = "";
        if (clear) clear.hidden = true;
        renderMapBody();
      }
    });

    syncStageRail();
    renderMapBody();

    var subnav = document.querySelector(".subnav");
    if (subnav) {
      subnav.addEventListener("click", function (e) {
        var link = e.target.closest("[data-jump-stage]");
        if (!link) return;
        e.preventDefault();
        var stage = Number(link.dataset.jumpStage);
        mapState.stage = "all";
        mapState.q = "";
        input.value = "";
        if (clear) clear.hidden = true;
        syncStageRail();
        renderMapBody();
        window.requestAnimationFrame(function () {
          scrollToId("stage-" + stage);
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, "", "#stage-" + stage);
          }
          updateSubnavSpy();
        });
      });
    }

    if (/^#stage-[1-6]$/.test(window.location.hash)) {
      var hashStage = window.location.hash.replace("#stage-", "");
      window.requestAnimationFrame(function () {
        scrollToId("stage-" + hashStage, true);
      });
    }
  }

  /* ---------------- library ---------------- */

  var libState = { q: "", type: "all" };

  function matchesSource(s, needle) {
    if (!needle) return true;
    var m = moduleOf(Number(s.moduleN));
    var hay = [s.title, s.url, s.fileName || "", s.note || "", m ? m.title : ""].concat(s.tags || []);
    return hay.join(" ").toLowerCase().indexOf(needle) !== -1;
  }

  function libraryCardHTML(s) {
    var m = moduleOf(Number(s.moduleN));
    return (
      '<article class="source-card">' +
      '<div class="source-top">' +
      '<span class="badge badge-' + s.typeKey + '">' + TYPE_META[s.typeKey].label + "</span>" +
      '<span class="source-check">收藏于 ' + esc(formatTime(s.addedAt)) + "</span>" +
      "</div>" +
      '<h3 class="source-title">' + sourceTitleHTML(s) + '</h3>' +
      (s.note ? '<p class="source-scope">' + esc(s.note) + "</p>" : "") +
      sourceTagsHTML(s) +
      (m ? '<a class="use-chip" href="module.html?m=' + m.n + '&from=library">模块 ' + pad2(m.n) + " · " + esc(m.title) + "</a>" : '<span class="source-unassigned">未关联模块</span>') +
      '<div class="source-actions"><button type="button" data-edit-source="' + esc(s.id) + '">编辑</button><button type="button" data-delete-source="' + esc(s.id) + '">删除</button></div>' +
      "</article>"
    );
  }

  function typeSectionHTML(type, items) {
    return (
      '<section class="type-section" aria-labelledby="type-' + type + '">' +
      '<div class="type-head">' +
      '<h2 id="type-' + type + '">' + TYPE_META[type].label +
      ' <span class="type-en">' + TYPE_META[type].en + "</span></h2>" +
      '<p class="type-hint">' + items.length + " 条 · " + TYPE_HINT[type] + "</p>" +
      "</div>" +
      '<div class="source-grid">' + items.map(libraryCardHTML).join("") + "</div>" +
      "</section>"
    );
  }

  function renderLibrary() {
    var body = document.getElementById("lib-body");
    var summary = document.getElementById("lib-summary");
    if (!body) return;
    var sync = document.getElementById("source-sync-status");
    if (sync) {
      sync.innerHTML = pendingDeletes().map(function (id) {
        var source = publicSources.filter(function (item) { return item.id === id; })[0];
        return ' 删除待确认：<a href="' + esc(githubIssueUrl({ action: "delete", id: id, title: source ? source.title : id })) + '">前往 GitHub 提交</a>';
      }).join(" ");
    }
    var all = getSources();
    var needle = libState.q.trim().toLowerCase();
    var searched = all.filter(function (s) { return matchesSource(s, needle); });
    var filtered = searched.filter(function (s) {
      return libState.type === "all" || s.typeKey === libState.type;
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-source-total]"), function (el) {
      el.textContent = String(all.length);
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-count]"), function (el) {
      el.textContent = String(all.filter(function (s) { return s.typeKey === el.dataset.count; }).length);
    });

    if (summary) {
      summary.textContent =
        "你的书架共 " + all.length + " 条资料 · 当前显示 " + filtered.length + " 条" +
        (libState.q.trim() ? " · 关键词「" + libState.q.trim() + "」" : "");
    }

    if (!filtered.length) {
      body.innerHTML =
        '<div class="stage-section"><div class="empty-block">' +
        (all.length ? "<h3>没有找到这条资料</h3><p>换个关键词，或看看其他类型。</p>" : "<h3>这本书架，从你的第一条资料开始</h3><p>看到值得留下的文章、视频或文档，就把链接放进来。这里不会自动塞入推荐清单。</p>") +
        (all.length ? '<button type="button" class="btn" data-reset-lib>重置筛选</button>' : '<a class="btn" href="#add-source">添加第一条资料</a>') +
        "</div></div>";
      announce("lib-status", all.length ? "没有匹配的资料" : "书架还没有资料");
      return;
    }

    var order = ["doc", "article", "method"];
    body.innerHTML = order
      .map(function (type) {
        var items = filtered.filter(function (s) { return s.typeKey === type; });
        if (!items.length) return "";
        if (libState.type !== "all" && libState.type !== type) return "";
        return typeSectionHTML(type, items);
      })
      .join("");
    announce("lib-status", "显示 " + filtered.length + " 条资料");
  }

  async function titleFromLink(url, signal) {
    var response = await fetch(url, { mode: "cors", credentials: "omit", signal: signal });
    if (!response.ok || !/html/i.test(response.headers.get("content-type") || "")) return "";
    var html = (await response.text()).slice(0, 300000);
    var doc = new DOMParser().parseFromString(html, "text/html");
    var meta = doc.querySelector('meta[property="og:title"], meta[name="twitter:title"]');
    return String((meta && meta.content) || doc.title || "").replace(/\s+/g, " ").trim().slice(0, 120);
  }

  async function titleFromFile(file) {
    var stem = file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
    if (/\.(md|txt)$/i.test(file.name)) {
      var text = await file.slice(0, 12000).text();
      var line = text.split(/\r?\n/).map(function (part) { return part.replace(/^#+\s*/, "").trim(); })
        .filter(function (part) { return part && part.length <= 120; })[0];
      if (line) return line;
    }
    if (/\.pdf$/i.test(file.name)) {
      var head = await file.slice(0, 300000).text();
      var match = head.match(/\/Title\s*\(([^()]{3,120})\)/);
      if (match) return match[1].trim();
    }
    return /^(download|document|file|untitled|未命名|文档|下载)$/i.test(stem) ? "" : stem.slice(0, 120);
  }

  function initLibrary() {
    var input = document.getElementById("lib-search");
    var clear = document.getElementById("lib-clear");
    var types = document.getElementById("lib-types");
    var body = document.getElementById("lib-body");
    if (!input || !types || !body) return;

    var form = document.getElementById("source-form");
    var title = document.getElementById("source-title");
    var titleWrap = document.getElementById("source-title-wrap");
    var titleStatus = document.getElementById("source-title-status");
    var rename = document.getElementById("source-rename");
    var url = document.getElementById("source-url");
    var urlWrap = document.getElementById("source-url-wrap");
    var file = document.getElementById("source-file");
    var fileWrap = document.getElementById("source-file-wrap");
    var type = document.getElementById("source-type");
    var module = document.getElementById("source-module");
    var note = document.getElementById("source-note");
    var save = document.getElementById("source-save");
    var cancel = document.getElementById("source-cancel");
    var formStatus = document.getElementById("source-form-status");
    var undo = document.getElementById("source-undo");
    var tagInput = document.getElementById("source-tag-input");
    var tagOptions = document.getElementById("source-tag-options");
    var tagSelected = document.getElementById("source-tag-selected");
    var tagList = document.getElementById("source-tag-list");
    var tagManagerForm = document.getElementById("tag-manager-form");
    var tagManagerInput = document.getElementById("tag-manager-input");
    var tagManagerStatus = document.getElementById("tag-manager-status");
    var tagManagerList = document.getElementById("tag-manager-list");
    var managerEditing = "";
    var kind = "link", editingId = "", editingSnapshot = "", detectedTitle = "", selectedTags = [], removed = null, removedFile = null;
    var identifySeq = 0, identifyTimer = null, identifyPromise = null;

    COURSE.modules.forEach(function (m) {
      var option = document.createElement("option");
      option.value = String(m.n);
      option.textContent = "模块 " + pad2(m.n) + " · " + m.title;
      module.appendChild(option);
    });

    function renderTags() {
      tagList.innerHTML = readTags().map(function (tag) { return '<option value="' + esc(tag) + '"></option>'; }).join("");
      tagOptions.innerHTML = readTags().map(function (tag) {
        return '<button type="button" data-tag-option="' + esc(tag) + '" aria-pressed="' + (selectedTags.indexOf(tag) !== -1) + '"># ' + esc(tag) + '</button>';
      }).join("");
      tagSelected.innerHTML = selectedTags.map(function (tag) {
        return '<span class="source-tag"># ' + esc(tag) + ' <button type="button" data-remove-tag="' + esc(tag) + '" aria-label="移除标签 ' + esc(tag) + '">×</button></span>';
      }).join("");
      renderTagManager();
    }

    function tagUseCount(tag) {
      return getSources().filter(function (s) { return (s.tags || []).indexOf(tag) !== -1; }).length;
    }

    function renderTagManager() {
      var tags = readTags();
      document.getElementById("tag-all-count").textContent = String(tags.length);
      tagManagerList.innerHTML = tags.map(function (tag) {
        var count = tagUseCount(tag);
        if (COURSE.tags.indexOf(tag) !== -1) {
          return '<div class="tag-manager-item tag-manager-topic">' +
            '<button type="button" class="tag-name" data-manager-use="' + esc(tag) + '" title="选用到当前资料"># ' + esc(tag) + '<small>' + count + '</small></button>' +
            '<button type="button" data-manager-delete="' + esc(tag) + '" aria-label="删除标签 ' + esc(tag) + '" title="删除标签">×</button></div>';
        }
        if (managerEditing === tag) {
          return '<div class="tag-manager-item"><div class="tag-manager-edit">' +
            '<input data-manager-edit-input="' + esc(tag) + '" aria-label="重命名标签 ' + esc(tag) + '" maxlength="24" value="' + esc(tag) + '">' +
            '<button type="button" data-manager-save="' + esc(tag) + '">保存</button>' +
            '<button type="button" data-manager-cancel>取消</button></div></div>';
        }
        return '<div class="tag-manager-item tag-manager-personal">' +
          '<button type="button" class="tag-name" data-manager-use="' + esc(tag) + '" title="选用到当前资料"># ' + esc(tag) + '<small>' + count + '</small></button>' +
          '<button type="button" data-manager-rename="' + esc(tag) + '" aria-label="改名标签 ' + esc(tag) + '">改名</button>' +
          '<button type="button" data-manager-delete="' + esc(tag) + '" aria-label="删除标签 ' + esc(tag) + '" title="删除标签">×</button></div>';
      }).join("");
    }

    function selectTag(raw) {
      var tag = raw.trim().replace(/^#\s*/, "").slice(0, 24);
      if (!tag || selectedTags.length >= 8) { formStatus.textContent = tag ? "每条资料最多选择 8 个标签。" : "先输入一个标签。"; return; }
      tag = addTag(tag);
      if (selectedTags.indexOf(tag) === -1) selectedTags.push(tag);
      tagInput.value = "";
      formStatus.textContent = "";
      renderTags();
    }

    function setKind(next) {
      kind = next;
      urlWrap.hidden = next !== "link";
      fileWrap.hidden = next !== "file";
      url.required = next === "link";
      file.required = next === "file" && !editingId;
      Array.prototype.forEach.call(form.querySelectorAll("[data-source-kind]"), function (b) {
        b.setAttribute("aria-pressed", b.dataset.sourceKind === next ? "true" : "false");
      });
    }

    function showTitle(value) {
      detectedTitle = value;
      titleWrap.hidden = true;
      title.required = false;
      titleStatus.textContent = "识别到标题：" + value;
      rename.hidden = false;
    }

    function askForTitle(message) {
      detectedTitle = "";
      titleWrap.hidden = false;
      title.required = true;
      titleStatus.textContent = message;
      rename.hidden = true;
    }

    async function identifyLink() {
      var raw = url.value.trim();
      var seq = ++identifySeq;
      var parsed;
      try { parsed = new URL(raw); } catch (e) { parsed = null; }
      if (!parsed || !/^https?:$/.test(parsed.protocol) || parsed.username || parsed.password) {
        titleStatus.textContent = "粘贴完整的 http(s) 链接后识别标题。";
        return;
      }
      titleStatus.textContent = "正在读取页面标题…";
      var controller = new AbortController();
      var timeout = setTimeout(function () { controller.abort(); }, 6000);
      var found = "";
      try { found = await titleFromLink(parsed.href, controller.signal); } catch (e) { found = ""; }
      clearTimeout(timeout);
      if (seq !== identifySeq || kind !== "link") return;
      if (found) showTitle(found);
      else askForTitle("这个网站未开放标题读取，请自己填一个标题。 ");
    }

    function formSnapshot() {
      return JSON.stringify({ kind: kind, url: url.value, type: type.value, module: module.value,
        title: titleWrap.hidden ? detectedTitle : title.value, note: note.value,
        tags: selectedTags, file: file.files.length ? file.files[0].name : "" });
    }

    function resetForm() {
      clearTimeout(identifyTimer);
      identifySeq++;
      form.reset();
      editingId = "";
      editingSnapshot = "";
      detectedTitle = "";
      selectedTags = [];
      titleWrap.hidden = true;
      title.required = false;
      titleStatus.textContent = "粘贴链接后会自动尝试识别标题。";
      rename.hidden = true;
      setKind("link");
      renderTags();
      save.textContent = "加入我的书架";
      cancel.hidden = true;
      document.getElementById("source-form-title").textContent = "收下一条好资料";
    }

    function beginEdit(s) {
      clearTimeout(identifyTimer);
      identifySeq++;
      editingId = s.id;
      file.value = "";
      setKind(s.kind || "link");
      url.value = s.url || "";
      type.value = s.typeKey;
      module.value = String(s.moduleN || 0);
      note.value = s.note || "";
      selectedTags = (s.tags || []).slice();
      renderTags();
      showTitle(s.title);
      if (s.kind === "file") titleStatus.textContent = "已上传：" + (s.fileName || s.title);
      save.textContent = "保存修改";
      cancel.hidden = false;
      document.getElementById("source-form-title").textContent = "修改这条资料";
      formStatus.textContent = "正在编辑「" + s.title + "」";
      editingSnapshot = formSnapshot();
      scrollToId("add-source");
    }

    form.addEventListener("click", function (e) {
      var toggle = e.target.closest("[data-source-kind]");
      if (toggle) {
        if (kind !== toggle.dataset.sourceKind) {
          setKind(toggle.dataset.sourceKind);
          detectedTitle = "";
          title.value = "";
          titleWrap.hidden = true;
          titleStatus.textContent = kind === "link" ? "粘贴链接后会自动尝试识别标题。" : "选择文件后会自动尝试识别标题。";
          rename.hidden = true;
        }
        return;
      }
      var option = e.target.closest("[data-tag-option]");
      if (option) { selectTag(option.dataset.tagOption); return; }
      var removeTag = e.target.closest("[data-remove-tag]");
      if (removeTag) {
        selectedTags = selectedTags.filter(function (tag) { return tag !== removeTag.dataset.removeTag; });
        renderTags();
      }
    });

    document.getElementById("source-tag-add").addEventListener("click", function () { selectTag(tagInput.value); });
    tagInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); selectTag(tagInput.value); }
    });
    tagManagerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var value = tagManagerInput.value.trim().replace(/^#\s*/, "");
      if (!value) { tagManagerStatus.textContent = "先给标签起个名字。"; tagManagerInput.focus(); return; }
      if (readTags().some(function (tag) { return tag.toLowerCase() === value.toLowerCase(); })) {
        tagManagerStatus.textContent = "这个标签已经有了，可以直接选用。";
        return;
      }
      addTag(value);
      tagManagerInput.value = "";
      tagManagerStatus.textContent = "标签已添加。";
      renderTags();
    });

    document.getElementById("tag-manager").addEventListener("click", function (e) {
      var use = e.target.closest("[data-manager-use]");
      if (use) {
        selectTag(use.dataset.managerUse);
        tagManagerStatus.textContent = "已选用到当前资料。";
        scrollToId("add-source");
        return;
      }
      var renameTag = e.target.closest("[data-manager-rename]");
      if (renameTag) {
        managerEditing = renameTag.dataset.managerRename;
        renderTagManager();
        tagManagerList.querySelector("[data-manager-edit-input]").focus();
        return;
      }
      if (e.target.closest("[data-manager-cancel]")) {
        managerEditing = "";
        renderTagManager();
        return;
      }
      var saveTag = e.target.closest("[data-manager-save]");
      if (saveTag) {
        var oldName = saveTag.dataset.managerSave;
        var newName = tagManagerList.querySelector("[data-manager-edit-input]").value.trim().replace(/^#\s*/, "");
        if (!newName) { tagManagerStatus.textContent = "标签名不能为空。"; return; }
        if (readTags().some(function (tag) { return tag !== oldName && tag.toLowerCase() === newName.toLowerCase(); }) ||
            COURSE.tags.some(function (tag) { return tag.toLowerCase() === newName.toLowerCase(); })) {
          tagManagerStatus.textContent = "已有同名标签，请换一个名字。";
          return;
        }
        renameCustomTag(oldName, newName);
        selectedTags = selectedTags.map(function (tag) { return tag === oldName ? newName : tag; });
        managerEditing = "";
        tagManagerStatus.textContent = "标签已改名，关联资料也已更新。";
        renderTags();
        renderLibrary();
        return;
      }
      var deleteTag = e.target.closest("[data-manager-delete]");
      if (deleteTag) {
        var name = deleteTag.dataset.managerDelete;
        var count = tagUseCount(name);
        var message = "确定删除标签“" + name + "”吗？" +
          (count ? "它已用于 " + count + " 条资料；删除后会从这些资料中移除标签，资料本身保留。" : "删除后可重新添加。");
        if (!window.confirm(message)) return;
        removeTag(name);
        selectedTags = selectedTags.filter(function (tag) { return tag !== name; });
        tagManagerStatus.textContent = "标签已删除。需要时可输入同名标签重新添加。";
        renderTags();
        renderLibrary();
      }
    });
    document.getElementById("tag-manager").addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.target.matches("[data-manager-edit-input]")) {
        e.preventDefault();
        tagManagerList.querySelector("[data-manager-save]").click();
      }
    });
    rename.addEventListener("click", function () {
      var value = detectedTitle;
      askForTitle("你可以修改识别到的标题。 ");
      title.value = value;
      title.focus();
    });
    url.addEventListener("input", function () {
      clearTimeout(identifyTimer);
      identifySeq++;
      detectedTitle = "";
      title.value = "";
      titleWrap.hidden = true;
      title.required = false;
      rename.hidden = true;
      titleStatus.textContent = "准备识别标题…";
      identifyTimer = setTimeout(function () { identifyPromise = identifyLink(); }, 500);
    });
    file.addEventListener("change", async function () {
      var picked = file.files[0];
      if (!picked) return;
      title.value = "";
      titleStatus.textContent = "正在识别文件标题…";
      try {
        var found = await titleFromFile(picked);
        if (found) showTitle(found);
        else askForTitle("文件里没有可识别的标题，请自己填写。 ");
      } catch (e) { askForTitle("文件标题读取失败，请自己填写。 "); }
    });

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      clearTimeout(identifyTimer);
      if (kind === "link" && titleWrap.hidden && !detectedTitle) {
        identifyPromise = identifyLink();
        await identifyPromise;
      }
      var cleanTitle = titleWrap.hidden ? detectedTitle : title.value.trim();
      if (!cleanTitle) { askForTitle("请给这条资料补一个标题。 "); title.focus(); return; }
      var parsed = null;
      if (kind === "link") {
        try { parsed = new URL(url.value.trim()); } catch (error) { parsed = null; }
        if (!parsed || !/^https?:$/.test(parsed.protocol) || parsed.username || parsed.password) {
          formStatus.textContent = "请填写完整的 http(s) 链接。";
          url.focus();
          return;
        }
      }
      var list = getSources();
      var old = list.filter(function (s) { return s.id === editingId; })[0];
      var picked = file.files[0];
      if (kind === "file" && !picked && !(old && old.kind === "file")) {
        formStatus.textContent = "请先选择文件。";
        file.focus();
        return;
      }
      if (picked && picked.size > 50 * 1024 * 1024) {
        formStatus.textContent = "文件超过 50 MB，请换一份较小的文件。";
        file.focus();
        return;
      }
      if (kind === "link" && list.some(function (s) { return s.kind !== "file" && s.url === parsed.href && s.id !== editingId; })) {
        formStatus.textContent = "这条链接已经在书架上了，可以直接编辑已有资料。";
        url.focus();
        return;
      }
      if (old && old.kind === "file" && (kind === "link" || picked)) {
        var replaceMessage = kind === "link"
          ? "保存为链接会删除原先上传的文件。确定替换吗？"
          : "新文件会覆盖原先上传的文件。确定替换吗？";
        if (!window.confirm(replaceMessage)) return;
      }
      var item = {
        id: old ? old.id : String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8),
        kind: kind,
        title: cleanTitle.slice(0, 120),
        url: kind === "link" ? parsed.href : "",
        fileName: kind === "file" ? (picked ? picked.name : old.fileName) : "",
        typeKey: type.value,
        moduleN: Number(module.value) || 0,
        tags: selectedTags.slice(),
        note: note.value.trim(),
        addedAt: old ? old.addedAt : new Date().toISOString(),
        schemaVersion: 2
      };
      if (kind === "file" && picked) {
        try { await fileRequest("put", item.id, { blob: picked, name: picked.name }); }
        catch (error) { formStatus.textContent = "文件保存失败，请检查浏览器存储空间。"; return; }
      }
      var next = [item].concat(readSources().filter(function (s) { return s.id !== item.id && s.url !== item.url; }));
      var saved = writeSources(next);
      if (!saved) { formStatus.textContent = "本机保存失败，请检查浏览器存储空间。"; return; }
      if (item.kind === "link") setPendingUpsert(item.id, true);
      if (old && old.kind === "file" && kind === "link") fileRequest("delete", old.id).catch(function () {});
      resetForm();
      formStatus.textContent = item.kind === "link" ? "已暂存，正在前往 GitHub 确认公开保存…" : "文件已保存在这台设备。";
      removed = null;
      removedFile = null;
      undo.innerHTML = "";
      renderLibrary();
      if (item.kind === "link") window.location.assign(githubIssueUrl({ action: "upsert", item: window.AIPMPublicData.cleanSource(item) }));
    });

    cancel.addEventListener("click", function () {
      if (editingId && formSnapshot() !== editingSnapshot && !window.confirm("这条资料有未保存的修改。确定放弃修改吗？")) return;
      resetForm();
      formStatus.textContent = "已取消编辑。";
    });

    undo.addEventListener("click", async function (e) {
      if (!e.target.closest("[data-undo-source]") || !removed) return;
      if (removedFile) {
        try { await fileRequest("put", removed.id, removedFile); }
        catch (error) { undo.textContent = "文件恢复失败，请检查浏览器存储空间。"; return; }
      }
      writeSources([removed].concat(readSources().filter(function (source) { return source.id !== removed.id; })));
      setPendingDelete(removed.id, false);
      setPendingUpsert(removed.id, false);
      removed = null;
      removedFile = null;
      undo.textContent = "已恢复。";
      renderLibrary();
      renderTagManager();
    });

    renderTags();
    var params = new URLSearchParams(window.location.search);
    var selectedModule = Number(params.get("module"));
    if (moduleOf(selectedModule)) module.value = String(selectedModule);
    var selectedEdit = getSources().filter(function (s) { return s.id === params.get("edit"); })[0];
    if (selectedEdit) beginEdit(selectedEdit);

    input.addEventListener("input", function () {
      libState.q = input.value;
      if (clear) clear.hidden = !input.value;
      renderLibrary();
    });

    if (clear) {
      clear.addEventListener("click", function () {
        libState.q = "";
        input.value = "";
        clear.hidden = true;
        input.focus();
        renderLibrary();
      });
    }

    types.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-type]");
      if (!btn) return;
      libState.type = btn.dataset.type;
      Array.prototype.forEach.call(types.querySelectorAll("[data-type]"), function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      renderLibrary();
    });

    body.addEventListener("click", async function (e) {
      var edit = e.target.closest("[data-edit-source]");
      if (edit) {
        var source = getSources().filter(function (s) { return s.id === edit.dataset.editSource; })[0];
        if (source) {
          if (editingId && formSnapshot() !== editingSnapshot && !window.confirm("这条资料有未保存的修改。确定切换到另一条资料吗？")) return;
          beginEdit(source);
        }
        return;
      }
      var del = e.target.closest("[data-delete-source]");
      if (del) {
        var list = getSources();
        var source = list.filter(function (s) { return s.id === del.dataset.deleteSource; })[0];
        if (!source || !window.confirm("确定删除资料“" + source.title + "”吗？删除后可在当前页面撤销。")) return;
        removed = source;
        removedFile = null;
        if (removed.kind === "file") {
          try {
            removedFile = await fileRequest("get", removed.id);
            await fileRequest("delete", removed.id);
          } catch (error) { formStatus.textContent = "本地文件删除失败，请重试。"; return; }
        }
        writeSources(readSources().filter(function (s) { return s.id !== removed.id; }));
        if (removed.kind === "link") setPendingDelete(removed.id, true);
        setPendingUpsert(removed.id, false);
        undo.innerHTML = '已删除「' + esc(removed.title) + '」。<button type="button" data-undo-source>撤销删除</button>';
        renderLibrary();
        renderTagManager();
        if (removed.kind === "link") window.location.assign(githubIssueUrl({ action: "delete", id: removed.id, title: removed.title }));
        return;
      }
      if (e.target.closest("[data-reset-lib]")) {
        libState.q = "";
        libState.type = "all";
        input.value = "";
        if (clear) clear.hidden = true;
        Array.prototype.forEach.call(types.querySelectorAll("[data-type]"), function (b) {
          b.setAttribute("aria-pressed", b.dataset.type === "all" ? "true" : "false");
        });
        renderLibrary();
        input.focus();
      }
    });

    renderLibrary();
    fetch("data/resources.json?t=" + Date.now(), { cache: "no-store" }).then(function (response) {
      if (!response.ok) throw new Error("public data unavailable");
      return response.json();
    }).then(function (sources) {
      publicSources = Array.isArray(sources) ? sources : [];
      pendingUpserts().forEach(function (id) {
        var local = readSources().filter(function (source) { return source.id === id; })[0];
        var remote = publicSources.filter(function (source) { return source.id === id; })[0];
        if (local && remote && JSON.stringify(window.AIPMPublicData.cleanSource(local)) === JSON.stringify(window.AIPMPublicData.cleanSource(remote))) {
          setPendingUpsert(id, false);
        }
      });
      var remaining = pendingDeletes().filter(function (id) {
        return publicSources.some(function (source) { return source.id === id; });
      });
      window.localStorage.setItem(KEY_PENDING_DELETES, JSON.stringify(remaining));
      mem.tags = null;
      renderTags();
      renderLibrary();
    }).catch(function () {
      var sync = document.getElementById("source-sync-status");
      if (sync) sync.textContent = "公开书架暂时无法读取，请稍后刷新。";
    });

    window.addEventListener("storage", function (e) {
      if (e.key === KEY_SOURCES) { mem.sources = null; renderLibrary(); renderTagManager(); }
      if (e.key === KEY_TAGS || e.key === KEY_HIDDEN_TAGS) { mem.tags = null; mem.hiddenTags = null; renderTags(); }
    });

    var subnav = document.querySelector(".subnav");
    if (subnav) {
      subnav.addEventListener("click", function (e) {
        var link = e.target.closest("[data-jump-type]");
        if (!link) return;
        e.preventDefault();
        var type = link.dataset.jumpType;
        libState.type = "all";
        Array.prototype.forEach.call(types.querySelectorAll("[data-type]"), function (b) {
          b.setAttribute("aria-pressed", b.dataset.type === "all" ? "true" : "false");
        });
        renderLibrary();
        window.requestAnimationFrame(function () {
          scrollToId("type-" + type);
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, "", "#type-" + type);
          }
          updateSubnavSpy();
        });
      });
    }
  }

  /* ---------------- growth ---------------- */

  function favRowHTML(m) {
    var st = stageOf(m.n);
    return (
      '<article class="fav-row">' +
      '<p class="fav-no">No.' + pad2(m.n) + "</p>" +
      "<div>" +
      '<h3 class="fav-title">' + esc(m.title) + "</h3>" +
      '<p class="fav-question">' + esc(m.question) + "</p>" +
      '<p class="fav-meta">阶段 ' + pad2(st.n) + " " + esc(st.name) + " · " + m.units.length + " 个单元</p>" +
      "</div>" +
      '<div class="fav-actions">' +
      '<a class="btn btn-ghost" href="module.html?m=' + m.n + '&from=growth">阅读模块</a>' +
      '<button type="button" class="btn btn-quiet" data-remove="' + m.n + '">移除收藏</button>' +
      "</div>" +
      "</article>"
    );
  }

  function noteCardHTML(n, note) {
    var m = moduleOf(n);
    if (!m) return "";
    return (
      '<article class="note-card">' +
      "<header>" +
      '<span class="note-mod">模块 ' + pad2(n) + "</span>" +
      "<h3>" + esc(m.title) + "</h3>" +
      "</header>" +
      '<p class="note-text">' + esc(note.text) + "</p>" +
      '<div class="note-meta">' +
      "<span>保存于 " + esc(formatTime(note.savedAt)) + "</span>" +
      '<div class="note-actions">' +
      '<a href="module.html?m=' + n + '&from=growth">打开模块</a>' +
      '<button type="button" data-del-note="' + n + '">删除笔记</button>' +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  function renderGrowth() {
    var favs = Store.favorites();
    var notes = Store.notes();
    var noteNums = Object.keys(notes)
      .map(Number)
      .filter(function (n) { return !!moduleOf(n); })
      .sort(function (a, b) { return a - b; });

    var statFav = document.getElementById("stat-fav");
    var statNote = document.getElementById("stat-note");
    if (statFav) statFav.textContent = String(favs.length);
    if (statNote) statNote.textContent = String(noteNums.length);

    var favList = document.getElementById("fav-list");
    var favEmpty = document.getElementById("fav-empty");
    var favLabel = document.getElementById("fav-count-label");
    if (favLabel) favLabel.textContent = favs.length + " 个模块";

    if (favList) {
      favList.innerHTML = favs
        .map(function (n) { return moduleOf(n); })
        .filter(Boolean)
        .map(favRowHTML)
        .join("");
      favList.hidden = favs.length === 0;
    }
    if (favEmpty) favEmpty.hidden = favs.length > 0;

    var noteList = document.getElementById("note-list");
    var noteEmpty = document.getElementById("note-empty");
    var noteLabel = document.getElementById("note-count-label");
    if (noteLabel) noteLabel.textContent = noteNums.length + " 条笔记";

    if (noteList) {
      noteList.innerHTML = noteNums
        .map(function (n) { return noteCardHTML(n, notes[String(n)]); })
        .join("");
      noteList.hidden = noteNums.length === 0;
    }
    if (noteEmpty) noteEmpty.hidden = noteNums.length > 0;

    var storage = document.getElementById("storage-status");
    if (storage) {
      storage.textContent = storageOK
        ? "收藏与笔记保存在这台设备的 localStorage 中，刷新或重开浏览器都还在；清除站点数据会一并删除。"
        : "当前环境不允许写入 localStorage，收藏与笔记只在本次会话内有效，关闭页面后会消失。";
    }
  }

  function initGrowth() {
    var main = document.getElementById("growth-main");
    renderGrowth();
    window.__renderGrowth = renderGrowth;

    if (!main) return;

    main.addEventListener("click", function (e) {
      var rm = e.target.closest("[data-remove]");
      if (rm) {
        var n = Number(rm.dataset.remove);
        Store.removeFav(n);
        renderGrowth();
        announce("growth-status", "已移除模块 " + pad2(n) + " 的收藏");
        var nextBtn = main.querySelector("#fav-list a");
        if (nextBtn) nextBtn.focus();
        else {
          var empty = document.getElementById("fav-empty");
          if (empty) {
            empty.tabIndex = -1;
            empty.focus();
          }
        }
        return;
      }
      var del = e.target.closest("[data-del-note]");
      if (del) {
        var noteNum = Number(del.dataset.delNote);
        var noteModule = moduleOf(noteNum);
        if (!window.confirm("确定删除《" + (noteModule ? noteModule.title : "模块 " + pad2(noteNum)) + "》的讲解笔记吗？删除后无法恢复。")) return;
        Store.removeNote(noteNum);
        renderGrowth();
        announce("growth-status", "已删除模块 " + pad2(noteNum) + " 的讲解笔记");
        var nextNote = main.querySelector("#note-list .note-actions a");
        if (nextNote) nextNote.focus();
        else {
          var emptyNote = document.getElementById("note-empty");
          if (emptyNote) {
            emptyNote.tabIndex = -1;
            emptyNote.focus();
          }
        }
        return;
      }
    });

  }

  /* ---------------- sticky section nav ---------------- */

  function scrollToId(id, instant) {
    var target = document.getElementById(id);
    if (!target) return;
    var behavior = instant || prefersReducedMotion() ? "auto" : "smooth";
    target.scrollIntoView({ behavior: behavior, block: "start" });
  }

  function measureBars() {
    var topbar = document.querySelector(".topbar");
    var subnav = document.querySelector(".subnav");
    var root = document.documentElement;
    if (topbar) root.style.setProperty("--topbar-h", topbar.offsetHeight + "px");
    if (subnav) root.style.setProperty("--subnav-h", subnav.offsetHeight + "px");
  }

  function updateSubnavSpy() {
    var subnav = document.querySelector(".subnav");
    if (!subnav) return;
    var links = Array.prototype.slice.call(subnav.querySelectorAll("[data-spy]"));
    if (!links.length) return;
    var topbar = document.querySelector(".topbar");
    var offset = (topbar ? topbar.offsetHeight : 0) + subnav.offsetHeight + 28;
    var current = null;
    var first = null;
    var last = null;
    links.forEach(function (link) {
      var target = document.getElementById(link.dataset.spy);
      if (!target) return;
      if (!first) first = link;
      last = link;
      if (target.getBoundingClientRect().top - offset <= 0) current = link;
    });
    if (!current && window.scrollY < 40) current = first;
    if (last && window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) current = last;
    links.forEach(function (link) {
      if (link === current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  function initSubnav() {
    measureBars();
    updateSubnavSpy();
    var subnav = document.querySelector(".subnav");
    if (!subnav || subnav.dataset.bound === "1") return;
    subnav.dataset.bound = "1";

    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        updateSubnavSpy();
        ticking = false;
      });
    }, { passive: true });

    window.addEventListener("resize", function () {
      measureBars();
      updateSubnavSpy();
    });
    window.addEventListener("hashchange", function () {
      updateSubnavSpy();
    });
    subnav.addEventListener("click", function (e) {
      var link = e.target.closest("[data-spy]");
      if (!link) return;
      if (link.dataset.jumpStage || link.dataset.jumpType) return;
      var target = document.getElementById(link.dataset.spy);
      if (!target) return;
      if (!/^#/.test(link.getAttribute("href") || "")) return;
      e.preventDefault();
      scrollToId(link.dataset.spy);
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", "#" + link.dataset.spy);
      }
      Array.prototype.forEach.call(subnav.querySelectorAll("[data-spy]"), function (l) {
        if (l === link) l.setAttribute("aria-current", "location");
        else l.removeAttribute("aria-current");
      });
    });
  }

  /* ---------------- module page ---------------- */

  var mpState = { n: 0 };

  function modulePageHTML(m) {
    var st = stageOf(m.n);
    var sources = moduleSources(m);
    var back = backInfo();
    var saved = Store.note(m.n);
    var noteText = saved ? saved.text : "";
    var favOn = Store.isFav(m.n);
    var prev = m.n > 1 ? moduleHref(m.n - 1) : "";
    var next = m.n < COURSE.modules.length ? moduleHref(m.n + 1) : "";

    var hero =
      '<div class="wrap mp-hero">' +
      '<p class="mp-kicker"><a href="index.html#stage-' + st.n + '">阶段 ' + pad2(st.n) + " · " + esc(st.name) +
      "</a><span class=\"mp-sep\">/</span><span>模块 " + pad2(m.n) + " / " + COURSE.modules.length + "</span></p>" +
      '<h1 class="mp-title">' + esc(m.title) + "</h1>" +
      '<p class="mp-question">' + esc(m.question) + "</p>" +
      '<div class="mp-topic-tags">' + m.tags.map(function (tag) { return '<span># ' + esc(tag) + '</span>'; }).join("") + '</div>' +
      '<div class="mp-meta">' +
      '<span class="meta-pill">' + m.units.length + " 个学习单元</span>" +
      '<span class="meta-pill">' + sources.length + " 条资料</span>" +
      '<span class="meta-pill">' + esc(st.en) + "</span>" +
      '<button type="button" class="fav-btn" id="mp-fav" aria-pressed="' + favOn + '">' +
      ICON.star + "<span>" + (favOn ? "已收藏" : "收藏模块") + "</span></button>" +
      '<a class="btn btn-ghost mp-back" href="' + back.href + '">← ' + back.label + "</a>" +
      "</div>" +
      "</div>";

    var nav =
      '<nav class="subnav" aria-label="模块分区">' +
      '<div class="wrap subnav-inner">' +
      '<p class="subnav-label">模块 ' + pad2(m.n) + "</p>" +
      '<div class="subnav-links">' +
      '<a class="subnav-link" href="#content" data-spy="content">内容</a>' +
      '<a class="subnav-link" href="#sources" data-spy="sources">资料<span class="subnav-count">' + sources.length + "</span></a>" +
      '<a class="subnav-link" href="#practice" data-spy="practice">练习</a>' +
      "</div>" +
      '<p class="subnav-note">' + esc(st.name) + "</p>" +
      (prev ? '<a class="subnav-jump" href="' + prev + '">← 上一模块</a>' : "") +
      (next ? '<a class="subnav-jump" href="' + next + '">下一模块 →</a>' : "") +
      "</div>" +
      "</nav>";

    var body =
      '<article class="mp-article">' +
      '<section class="mp-section" id="content" aria-labelledby="mp-content-heading">' +
      '<div class="mp-section-head">' +
      '<p class="mp-section-no" aria-hidden="true">01</p>' +
      '<h2 id="mp-content-heading">学习内容</h2>' +
      '<p class="mp-section-hint">' + m.units.length + " 个单元 · 练习作品 · 完成标准</p>" +
      "</div>" +
      '<ol class="unit-list">' +
      m.units.map(function (u, i) {
        return '<li><span class="unit-idx">' + pad2(i + 1) + "</span><span>" + esc(u) + "</span></li>";
      }).join("") +
      "</ol>" +
      '<div class="fact-grid">' +
      '<div class="fact"><h4>练习作品</h4><p>' + esc(m.artifact) + "</p></div>" +
      '<div class="fact"><h4>完成标准</h4><p>' + esc(m.completion) + "</p></div>" +
      '<div class="fact fact-wide"><h4>学习边界</h4><p>' + esc(m.limit) + "</p></div>" +
      "</div>" +
      '<p class="policy-note"><b>资料策略</b> · ' + esc(m.source_policy) + "</p>" +
      "</section>" +
      '<section class="mp-section" id="sources" aria-labelledby="mp-sources-heading">' +
      '<div class="mp-section-head">' +
      '<p class="mp-section-no" aria-hidden="true">02</p>' +
      '<h2 id="mp-sources-heading">资料</h2>' +
      '<p class="mp-section-hint">' + sources.length + " 条 · 由你自己收藏</p>" +
      "</div>" +
      '<p class="panel-intro">把你找到的好资料收进这个模块，学习时随手回来翻。</p>' +
      '<div class="source-list">' +
      (sources.length ? sources.map(function (s) { return sourceRowHTML(s.src, s.role); }).join("") : '<p class="source-empty">这里还没有资料。第一条由你来放。</p>') +
      "</div>" +
      '<a class="btn btn-ghost source-add-link" href="library.html?module=' + m.n + '#add-source">+ 添加资料</a>' +
      "</section>" +
      '<section class="mp-section" id="practice" aria-labelledby="mp-practice-heading">' +
      '<div class="mp-section-head">' +
      '<p class="mp-section-no" aria-hidden="true">03</p>' +
      '<h2 id="mp-practice-heading">练习</h2>' +
      '<p class="mp-section-hint">三分钟讲解 · 笔记只存本机</p>' +
      "</div>" +
      '<p class="practice-q">用三分钟，向一位没做过产品的同事解释：<br><strong>' + esc(m.question) + "</strong></p>" +
      '<ol class="steps">' +
      '<li><span class="step-no">01</span><span><b>说清问题</b>：先用一句话说明这个模块要解决什么问题，不要用术语开场。</span></li>' +
      '<li><span class="step-no">02</span><span><b>举一个例子</b>：讲一个你真实见过的场景，说明没有这套方法时会怎样出错。</span></li>' +
      '<li><span class="step-no">03</span><span><b>交出边界</b>：说出你还不确定的地方，以及下一步要验证什么。</span></li>' +
      "</ol>" +
      '<div class="note-area">' +
      '<label class="field-label" for="note-input">我的三分钟讲解提纲</label>' +
      '<textarea id="note-input" maxlength="3000" placeholder="写要点就好，不必写成文章。讲不清的地方，往往就是下一步要读的地方。">' +
      esc(noteText) + "</textarea>" +
      "</div>" +
      '<div class="note-bar">' +
      '<span class="note-count" id="note-count">0 / 3000 字</span>' +
      '<button type="button" class="btn" id="save-note">保存到本机</button>' +
      '<span class="note-status" id="note-status" role="status" aria-live="polite"></span>' +
      "</div>" +
      '<p class="fineprint">这份笔记只保存在这台设备的浏览器里，不上传、不评分，也没有人点评。它不是作业，只是让“讲一遍”这一步真的发生。</p>' +
      "</section>" +
      "</article>";

    var foot =
      '<div class="mp-foot">' +
      (prev
        ? '<a class="btn btn-ghost" href="' + prev + '">← 上一模块</a>'
        : '<span class="btn btn-ghost is-disabled" aria-disabled="true">← 上一模块</span>') +
      '<a class="btn btn-quiet" href="' + back.href + '">' + back.label + "</a>" +
      (next
        ? '<a class="btn btn-ghost" href="' + next + '">下一模块 →</a>'
        : '<span class="btn btn-ghost is-disabled" aria-disabled="true">下一模块 →</span>') +
      "</div>" +
      '<p class="mp-foot-meta">模块 ' + pad2(m.n) + " / " + COURSE.modules.length + " · 课程方案 v0.6 · " +
      esc(COURSE.checkedLabel) + "</p>";

    return { hero: hero, nav: nav, body: body, foot: foot };
  }

  function renderModulePage() {
    var heroEl = document.getElementById("module-hero");
    var navEl = document.getElementById("module-nav");
    var bodyEl = document.getElementById("module-body");
    var footEl = document.getElementById("module-foot");
    if (!heroEl || !navEl || !bodyEl || !footEl) return;

    var params = new URLSearchParams(window.location.search);
    var n = Number(params.get("m"));
    var m = moduleOf(n);

    if (!m) {
      document.title = "没有找到这个模块 · AI 产品经理学习手册";
      heroEl.innerHTML =
        '<div class="wrap mp-hero">' +
        '<p class="mp-kicker">Module not found</p>' +
        '<h1 class="mp-title">没有找到这个模块</h1>' +
        '<p class="mp-question">地址里的模块编号是「' + esc(params.get("m") || "空") +
        "」，本手册只有 01–20 共 " + COURSE.modules.length + " 个模块。</p>" +
        "</div>";
      navEl.innerHTML = "";
      footEl.innerHTML = "";
      bodyEl.innerHTML =
        '<div class="empty-block mp-empty">' +
        "<h3>换一个模块，或回到学习地图</h3>" +
        "<p>每个模块都有固定的编号；直接访问时请使用 module.html?m=1 到 module.html?m=" +
        COURSE.modules.length + " 之间的地址。</p>" +
        '<a class="btn" href="index.html">回到学习地图</a>' +
        "</div>";
      announce("module-status", "没有找到这个模块");
      return;
    }

    mpState.n = n;
    var parts = modulePageHTML(m);
    heroEl.innerHTML = parts.hero;
    navEl.innerHTML = parts.nav;
    bodyEl.innerHTML = parts.body;
    footEl.innerHTML = parts.foot;
    document.title = "模块 " + pad2(n) + " · " + m.title + " · AI 产品经理学习手册";
    var saved = Store.note(n);
    updateNoteCount(saved ? saved.text.length : 0);
    initSubnav();
    if (/^#(content|sources|practice)$/.test(window.location.hash)) {
      window.requestAnimationFrame(function () {
        scrollToId(window.location.hash.slice(1), true);
        updateSubnavSpy();
      });
    }
  }

  function saveNoteOnPage() {
    var ta = document.getElementById("note-input");
    var status = document.getElementById("note-status");
    if (!ta || !status || !mpState.n) return;
    var text = ta.value.trim();
    if (!text) {
      status.textContent = "先写一句也算开始，保存需要一点文字。";
      status.classList.add("is-warn");
      ta.focus();
      return;
    }
    var ok = Store.saveNote(mpState.n, text);
    status.classList.remove("is-warn");
    status.textContent = ok
      ? "已保存到本机，刷新后仍在。"
      : "已保存在本次会话（浏览器未允许本地存储）。";
    announce("module-status", ok ? "讲解笔记已保存到本机" : "讲解笔记已保存在本次会话");
  }

  function initModulePage() {
    var main = document.getElementById("module-main");
    if (!main) return;
    renderModulePage();
    if (!mpState.n) return;

    main.addEventListener("click", function (e) {
      var fav = e.target.closest("#mp-fav");
      if (fav) {
        var on = Store.toggleFav(mpState.n);
        fav.setAttribute("aria-pressed", on ? "true" : "false");
        var label = fav.querySelector("span");
        if (label) label.textContent = on ? "已收藏" : "收藏模块";
        announce("module-status", on ? "已收藏模块 " + pad2(mpState.n) : "已取消收藏模块 " + pad2(mpState.n));
        return;
      }
      if (e.target.closest("#save-note")) {
        saveNoteOnPage();
      }
    });

    main.addEventListener("input", function (e) {
      if (e.target && e.target.id === "note-input") {
        updateNoteCount(e.target.value.length);
        var status = document.getElementById("note-status");
        if (status) {
          status.textContent = "";
          status.classList.remove("is-warn");
        }
      }
    });

    main.addEventListener("keydown", function (e) {
      if (e.target && e.target.id === "note-input" && (e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        saveNoteOnPage();
      }
    });
  }

  /* ---------------- boot ---------------- */

  document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", async function (e) {
      var button = e.target.closest("[data-open-file]");
      if (!button) return;
      try {
        var stored = await fileRequest("get", button.dataset.openFile);
        if (!stored || !stored.blob) throw new Error("Missing file");
        var objectUrl = URL.createObjectURL(stored.blob);
        var link = document.createElement("a");
        link.href = objectUrl;
        link.download = stored.name || "资料";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(function () { URL.revokeObjectURL(objectUrl); }, 60000);
      } catch (error) {
        window.alert("这份本地文件无法打开，可能已被浏览器清理。请重新上传。 ");
      }
    });
    initDialog();
    var page = document.body.dataset.page;
    if (page === "map") initMap();
    if (page === "library") initLibrary();
    if (page === "growth") initGrowth();
    if (page === "module") initModulePage();
    initSubnav();

    var sources = getSources();
    Array.prototype.forEach.call(document.querySelectorAll("[data-source-total]"), function (el) {
      el.textContent = String(sources.length);
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-count]"), function (el) {
      el.textContent = String(sources.filter(function (s) { return s.typeKey === el.dataset.count; }).length);
    });
  });
})();


