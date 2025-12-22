const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");

const transpileAndEval = (source, filename) => {
  const output = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;

  const sandbox = {
    module: { exports: {} },
    exports: {},
    console,
    require,
  };
  vm.runInNewContext(output, sandbox, { filename });
  return sandbox.module.exports;
};

const stripAssetImports = (src) =>
  src.replace(/^\s*import[\s\S]*?from\s+["']@\/lib\/assets["'];\s*$/gm, "");

const stripAllImports = (src) =>
  src.replace(/^\s*import[\s\S]*?;\s*$/gm, "");

const writeJson = (relativePath, data) => {
  const outPath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log("wrote", relativePath);
};

const extractSingleFile = ({ input, stubs, exports, output }) => {
  const abs = path.join(root, input);
  const source = fs.readFileSync(abs, "utf8");
  const combined = `${stubs}\n${stripAssetImports(source)}\nmodule.exports = { ${exports.join(
    ", "
  )} };`;
  const mod = transpileAndEval(combined, abs);
  writeJson(output, mod);
};

const buildKArrayContent = () => {
  const dataDir = path.join(root, "src/app/products/k-array/data");
  const typesFile = "types.ts";
  const dataFiles = [
    { file: "speakers.ts", exportName: "speakersProducts" },
    { file: "subwoofers.ts", exportName: "subwoofersProducts" },
    { file: "monitors.ts", exportName: "monitorsProducts" },
    { file: "systems.ts", exportName: "systemsProducts" },
    { file: "audio_light.ts", exportName: "audioLightProducts" },
    { file: "light.ts", exportName: "lightProducts" },
  ];

  const stubs = `
const buildKArraySpeakerUrl = (file) => file;
const buildKArraySubwooferUrl = (file) => file;
const buildKArrayMonitorUrl = (file) => file;
const buildKArraySystemUrl = (file) => file;
const buildKArrayUrl = (path) => path;
`;

  const typesSource = stripAllImports(
    fs.readFileSync(path.join(dataDir, typesFile), "utf8")
  );

  const parts = [
    typesSource,
    ...dataFiles.map(({ file, exportName }) => {
      const abs = path.join(dataDir, file);
      const source = stripAllImports(fs.readFileSync(abs, "utf8"));
      const local = source.replace(
        new RegExp(`export\\s+const\\s+${exportName}`),
        `const ${exportName}`
      );
      return `(() => {\n${local}\nexports.${exportName} = ${exportName};\n})();`;
    }),
  ];

  const combined = `${stubs}\n${parts.join("\n")}\nconst {
    speakersProducts,
    subwoofersProducts,
    monitorsProducts,
    systemsProducts,
    audioLightProducts,
    lightProducts,
  } = exports;
  module.exports = {
    speakersProducts,
    subwoofersProducts,
    monitorsProducts,
    systemsProducts,
    audioLightProducts,
    lightProducts,
  };`;

  const mod = transpileAndEval(combined, path.join(dataDir, "index.ts"));

  const outDir = path.join(root, "src/app/products/k-array/content");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "speakers.json"),
    JSON.stringify(mod.speakersProducts ?? [], null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "subwoofers.json"),
    JSON.stringify(mod.subwoofersProducts ?? [], null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "monitors.json"),
    JSON.stringify(mod.monitorsProducts ?? [], null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "systems.json"),
    JSON.stringify(mod.systemsProducts ?? [], null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "audio_light.json"),
    JSON.stringify(mod.audioLightProducts ?? [], null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "light.json"),
    JSON.stringify(mod.lightProducts ?? [], null, 2)
  );
  console.log("wrote src/app/products/k-array/content/*.json");
};

const buildAminaContent = () => {
  const input = path.join(root, "src/app/products/amina/data.ts");
  const source = fs.readFileSync(input, "utf8");
  const stubs = "const buildAminaUrl = (file) => file;";
  const combined = `${stubs}\n${stripAssetImports(source)}\nmodule.exports = { aminaProducts };`;
  const mod = transpileAndEval(combined, input);
  const items = Array.isArray(mod.aminaProducts) ? mod.aminaProducts : [];

  const outDir = path.join(root, "src/app/products/amina/content");
  fs.mkdirSync(outDir, { recursive: true });

  const buckets = {
    Edge: [],
    Mobius: [],
    Sapphire: [],
    ALF: [],
  };

  for (const item of items) {
    if (!item || typeof item != "object") continue;
    const series = item.series;
    if (series && buckets[series]) {
      buckets[series].push(item);
    }
  }

  fs.writeFileSync(
    path.join(outDir, "edge.json"),
    JSON.stringify(buckets.Edge, null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "mobius.json"),
    JSON.stringify(buckets.Mobius, null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "sapphire.json"),
    JSON.stringify(buckets.Sapphire, null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "alf.json"),
    JSON.stringify(buckets.ALF, null, 2)
  );
  console.log("wrote src/app/products/amina/content/*.json");
};

const buildKGearContent = () => {
  const input = path.join(root, "src/app/products/k-gear/data.ts");
  const source = fs.readFileSync(input, "utf8");
  const stubs = "const buildKGearUrl = (file) => file;";
  const combined = `${stubs}\n${stripAssetImports(source)}\nmodule.exports = { kgearProducts };`;
  const mod = transpileAndEval(combined, input);
  const items = Array.isArray(mod.kgearProducts) ? mod.kgearProducts : [];

  const outDir = path.join(root, "src/app/products/k-gear/content");
  fs.mkdirSync(outDir, { recursive: true });

  const buckets = {
    Systems: [],
    Speakers: [],
    Subwoofers: [],
  };

  for (const item of items) {
    if (!item || typeof item != "object") continue;
    const category = item.category;
    if (category && buckets[category]) {
      buckets[category].push(item);
    }
  }

  fs.writeFileSync(
    path.join(outDir, "systems.json"),
    JSON.stringify(buckets.Systems, null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "speakers.json"),
    JSON.stringify(buckets.Speakers, null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, "subwoofers.json"),
    JSON.stringify(buckets.Subwoofers, null, 2)
  );
  console.log("wrote src/app/products/k-gear/content/*.json");
};

const buildFrogisContent = () => {
  const dataDir = path.join(root, "src/app/products/frogis/data");
  const files = [
    { file: "point_source.ts", exportName: "pointSourceSpeakersProducts", out: "point_source.json" },
    { file: "ceiling_speakers.ts", exportName: "ceilingSpeakersProducts", out: "ceiling_speakers.json" },
    { file: "subwoofers.ts", exportName: "subwoofersProducts", out: "subwoofers.json" },
    { file: "microphones_headphones.ts", exportName: "microphonesHeadphonesProducts", out: "microphones_headphones.json" },
    { file: "slimline_arrays.ts", exportName: "slimlineArraysProducts", out: "slimline_arrays.json" },
    { file: "high_performance_arrays.ts", exportName: "highPerformanceArraysProducts", out: "high_performance_arrays.json" },
  ];

  const stubs = `
const buildFrogisUrl = (file) => file;
`;

  const typesSource = stripAllImports(
    fs.readFileSync(path.join(dataDir, "types.ts"), "utf8")
  );

  const parts = [
    typesSource,
    ...files.map(({ file, exportName }) => {
      const abs = path.join(dataDir, file);
      const source = stripAllImports(fs.readFileSync(abs, "utf8"));
      const local = source.replace(
        new RegExp(`export\\s+const\\s+${exportName}`),
        `const ${exportName}`
      );
      return `(() => {\n${local}\nexports.${exportName} = ${exportName};\n})();`;
    }),
  ];

  const combined = `${stubs}\n${parts.join("\n")}\nmodule.exports = exports;`;
  const mod = transpileAndEval(combined, path.join(dataDir, "index.ts"));

  const outDir = path.join(root, "src/app/products/frogis/content");
  fs.mkdirSync(outDir, { recursive: true });
  for (const entry of files) {
    const data = mod[entry.exportName] ?? [];
    fs.writeFileSync(
      path.join(outDir, entry.out),
      JSON.stringify(data, null, 2)
    );
  }
  console.log("wrote src/app/products/frogis/content/*.json");
};

const run = () => {
  extractSingleFile({
    input: "src/app/products/bearbricks/data.ts",
    stubs: `
const buildBearbricksLifestyleUrl = (file) => file;
const buildBearbricksProductUrl = (file) => file;
`,
    exports: ["bearbrickProducts"],
    output: "src/app/products/bearbricks/content.json",
  });

  extractSingleFile({
    input: "src/app/products/brionvega/data.ts",
    stubs: "const buildBrionvegaUrl = (file) => file;",
    exports: ["brionvegaProducts"],
    output: "src/app/products/brionvega/content.json",
  });

  extractSingleFile({
    input: "src/app/products/trinnov/data.ts",
    stubs: "const buildTrinnovUrl = (file) => file;",
    exports: ["trinnovProducts"],
    output: "src/app/products/trinnov/content.json",
  });

  buildKArrayContent();
  buildFrogisContent();
  buildAminaContent();
  buildKGearContent();
};

run();
