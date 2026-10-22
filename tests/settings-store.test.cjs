const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

const source = ts.transpileModule(fs.readFileSync("lib/store.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText;

function loadStore({ stored, failure, supabase = false, nativeContext = false } = {}) {
  const writes = [];
  const read = async () => {
    if (failure) throw failure;
    return stored;
  };
  const context = {
    exports: {},
    process: { cwd: () => "/test", env: nativeContext ? {} : { NETLIFY_BLOBS_CONTEXT: "test" } },
    console: { error() {} },
    ...(nativeContext ? { Netlify: { env: { get: () => "test" } } } : {}),
    require(name) {
      if (name === "@netlify/blobs") return { getStore: () => ({ get: read, setJSON: async (...args) => writes.push(args) }) };
      if (name === "./supabase") return {
        hasSupabaseConfig: () => supabase,
        getSupabase: () => ({ from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { data: stored }, error: failure }) }) }) }) }),
      };
      return require(name);
    },
  };
  vm.runInNewContext(source, context);
  return { ...context.exports, writes };
}

test("les paramètres valides restent identiques pour chaque stockage", async () => {
  for (const supabase of [false, true]) {
    const store = loadStore({ supabase, stored: { telephone: "0123456789", iban: "TEST", fraisDossier: 25 } });
    const settings = await store.getSettings();
    assert.equal(settings.telephone, "0123456789");
    assert.equal(settings.iban, "TEST");
    assert.equal(settings.fraisDossier, 25);
  }
});

test("des champs invalides ne font pas planter le rendu", async () => {
  const store = loadStore({ stored: { telephone: null, whatsapp: 42, montantMin: null, paymentDisplay: "invalid", iban: "TEST" } });
  const settings = await store.getSettings();
  assert.equal(settings.telephone, store.DEFAULT_SETTINGS.telephone);
  assert.equal(settings.whatsapp, store.DEFAULT_SETTINGS.whatsapp);
  assert.equal(settings.montantMin, store.DEFAULT_SETTINGS.montantMin);
  assert.equal(settings.paymentDisplay, "bank");
  assert.equal(settings.iban, "TEST");
});

test("une panne ne bloque pas le rendu public et interdit toute écriture", async () => {
  for (const supabase of [false, true]) {
    const store = loadStore({ supabase, failure: new Error("Storage offline") });
    assert.equal((await store.getPublicSettings()).societe, store.DEFAULT_SETTINGS.societe);
    await assert.rejects(store.getSettings(), /Storage offline/);
    await assert.rejects(store.saveSettings({ societe: "Modified" }), /Storage offline/);
    assert.equal(store.writes.length, 0);
  }
});

test("le contexte Netlify.env sélectionne Blobs et conserve les paramètres", async () => {
  const store = loadStore({ nativeContext: true, stored: { iban: "EXISTING" } });
  assert.equal((await store.getSettings()).iban, "EXISTING");
  await store.saveSettings({ telephone: "0123456789" });
  assert.equal(store.writes.length, 1);
  assert.equal(store.writes[0][1].iban, "EXISTING");
});
