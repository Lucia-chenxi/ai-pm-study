const assert = require("node:assert/strict");
const data = require("./public-data.js");

const source = { id: "1", kind: "link", title: "测试", url: "https://example.com/a", tags: ["RAG"], note: "私人笔记", fileName: "secret.pdf" };
const cleaned = data.cleanSource(source);
assert.equal(cleaned.url, "https://example.com/a");
assert.equal("note" in cleaned, false);
assert.equal("fileName" in cleaned, false);
assert.equal(data.cleanSource({ kind: "file", title: "文件", url: "https://example.com" }), null);
assert.equal(data.merge([source], [source]).length, 1);
