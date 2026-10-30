(function (root) {
  "use strict";

  function cleanSource(source) {
    if (!source || source.kind === "file") return null;
    var url;
    try { url = new URL(source.url); } catch (e) { return null; }
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    var title = String(source.title || "").trim();
    if (!title) return null;
    return {
      id: String(source.id || url.href),
      kind: "link",
      title: title.slice(0, 120),
      url: url.href,
      typeKey: String(source.typeKey || "article"),
      moduleN: Number(source.moduleN) || 0,
      tags: Array.isArray(source.tags) ? source.tags.filter(function (tag) { return typeof tag === "string"; }).slice(0, 12) : [],
      addedAt: String(source.addedAt || new Date().toISOString()),
      schemaVersion: 2
    };
  }

  function merge(remote, local) {
    var seen = Object.create(null);
    return [].concat(remote || [], local || []).map(cleanSource).filter(function (source) {
      if (!source || seen[source.url]) return false;
      seen[source.url] = true;
      return true;
    });
  }

  var api = { cleanSource: cleanSource, merge: merge };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.AIPMPublicData = api;
})(typeof window !== "undefined" ? window : globalThis);
