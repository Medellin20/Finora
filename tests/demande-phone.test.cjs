const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

const source = ts.transpileModule(
  fs.readFileSync("app/api/demandes/route.ts", "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }
).outputText;

function loadRoute() {
  let savedDemande;
  const context = {
    exports: {},
    console,
    require(name) {
      if (name === "next/server") {
        return { NextResponse: { json: (body, init) => ({ body, init }) } };
      }
      if (name === "next/headers") return { cookies: () => ({ get: () => null }) };
      if (name === "@/lib/store") {
        return {
          createDemande: async (demande) => {
            savedDemande = demande;
            return { ...demande, id: "DEM-TEST" };
          },
          listDemandes: async () => [],
        };
      }
      if (name === "@/lib/auth") {
        return {
          SESSION_COOKIE: "session",
          verifySessionToken: async () => false,
        };
      }
      return require(name);
    },
  };
  vm.runInNewContext(source, context);
  return {
    POST: context.exports.POST,
    get savedDemande() {
      return savedDemande;
    },
  };
}

function request(telephone) {
  return {
    json: async () => ({
      nom: "Dupont",
      email: "test@example.com",
      telephone,
      montant: 1000,
    }),
  };
}

test("l'inscription accepte et conserve des numéros de différents formats", async () => {
  for (const telephone of ["+33 6 12 34 56 78", "0044 (0)20-1234-5678", "06.12.34.56.78"]) {
    const route = loadRoute();
    const response = await route.POST(request(telephone));

    assert.equal(response.init.status, 201);
    assert.equal(route.savedDemande.telephone, telephone);
  }
});

test("l'inscription refuse seulement un numéro vide", async () => {
  const route = loadRoute();
  const response = await route.POST(request("   "));

  assert.equal(response.init.status, 400);
  assert.equal(response.body.error, "Un numéro de téléphone est requis.");
});
