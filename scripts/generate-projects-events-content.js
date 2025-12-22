const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");

const transpileAndEval = (source, filename, sandboxExtras = {}) => {
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
    ...sandboxExtras,
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

const extractEvents = () => {
  const input = path.join(root, "src/app/events/data.ts");
  const source = fs.readFileSync(input, "utf8");
  const stubs = "const buildEventsUrl = (file) => file;";
  const combined = `${stubs}\n${stripAssetImports(source)}\nmodule.exports = { EVENT_SUMMARIES, EVENT_DETAILS };`;
  const mod = transpileAndEval(combined, input);
  writeJson("src/app/events/content.json", {
    summaries: mod.EVENT_SUMMARIES ?? [],
    details: mod.EVENT_DETAILS ?? {},
  });
};

const extractProjects = () => {
  const input = path.join(root, "src/app/projects/project-data.ts");
  const source = fs.readFileSync(input, "utf8");
  const stubs = `
const buildGeneralImageUrl = (file) => file;
const buildProjectSiteUrl = (file) => file;
`;
  const combined = `${stubs}\n${stripAssetImports(source)}\nmodule.exports = {
    PROJECT_SECTIONS,
    PROJECT_EXPERIENCE,
    PROJECT_DETAIL_DEFAULT_ROLE,
    PROJECT_DETAIL_DEFAULT_KEY_PRODUCTS,
    PROJECT_DETAIL_OVERRIDES,
    PROJECT_LIST,
  };`;
  const mod = transpileAndEval(combined, input);

  const heroInput = path.join(root, "src/app/projects/project-hero-images.ts");
  const heroSource = fs.readFileSync(heroInput, "utf8");
  const heroStubs = `
const buildProjectSiteUrl = (file) => file;
const PROJECT_LIST = ${JSON.stringify(mod.PROJECT_LIST ?? [])};
`;
  const heroCombined = `${heroStubs}\n${stripAllImports(heroSource)}\nmodule.exports = { TITLE_TO_SITE_IMAGE };`;
  const heroMod = transpileAndEval(heroCombined, heroInput);

  writeJson("src/app/projects/content.json", {
    sections: mod.PROJECT_SECTIONS ?? {},
    experience: mod.PROJECT_EXPERIENCE ?? "10+ years",
    detailDefaults: {
      role: mod.PROJECT_DETAIL_DEFAULT_ROLE ?? "",
      keyProducts: mod.PROJECT_DETAIL_DEFAULT_KEY_PRODUCTS ?? [],
    },
    detailOverrides: mod.PROJECT_DETAIL_OVERRIDES ?? {},
    titleToSiteImage: heroMod.TITLE_TO_SITE_IMAGE ?? {},
  });
};

extractEvents();
extractProjects();
