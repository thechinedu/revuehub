const extensionLanguageMap = {
  c: "c",
  cgi: "perl",
  cl: "lisp",
  clj: "clojure",
  coffee: "coffeescript",
  cpp: "cpp",
  cr: "crystal",
  cs: "csharp",
  cshtml: "cshtml",
  css: "css",
  csv: "csv",
  dart: "dart",
  dockerfile: "docker",
  dockerignore: "ignore",
  editorconfig: "editorconfig",
  ejs: "ejs",
  ex: "elixir",
  exs: "elixir",
  flow: "flow",
  gitignore: "ignore",
  go: "go",
  h: "clike",
  haml: "haml",
  hbs: "handlebars",
  hs: "haskell",
  jar: "java",
  java: "java",
  javadoc: "javadoc",
  js: "javascript",
  jsdoc: "jsdoc",
  json: "json",
  json5: "json5",
  jsonp: "jsonp",
  jsx: "jsx",
  jl: "julia",
  kt: "kotlin",
  ktm: "kotlin",
  kts: "kotlin",
  less: "less",
  lhs: "haskell",
  lisp: "lisp",
  ll: "llvm",
  ls: "livescript",
  lsp: "lisp",
  lua: "lua",
  m: "objectivec",
  mm: "objectivec",
  makefile: "makefile",
  mak: "makefile",
  md: "markdown",
  mix: "matlab",
  mk: "makefile",
  ml: "ocaml",
  mli: "ocaml",
  mongo: "mongodb",
  npmignore: "ignore",
  pb: "protobuf",
  php: "php",
  pl: "perl",
  plx: "perl",
  pm: "perl",
  pod: "perl",
  proto: "protobuf",
  pug: "pug",
  py: "python",
  rb: "ruby",
  rlib: "rust",
  rs: "rust",
  sass: "sass",
  sc: "scala",
  scala: "scala",
  scm: "scheme",
  scss: "sass",
  sh: "bash",
  sol: "solidity",
  sql: "sql",
  ss: "scheme",
  st: "smalltalk",
  swift: "swift",
  t: "perl",
  tex: "latex",
  ts: "typescript",
  tsx: "tsx",
  wasm: "wasm",
  wast: "wasm",
  wat: "wasm",
  xs: "perl",
  yaml: "yaml",
  yml: "yaml",
};

const getExtension = (path: string) => {
  const segments = path.split(".");

  return segments[segments.length - 1].toLowerCase();
};

export const getLanguageForExtension = (path: string): string => {
  const fileExtension = getExtension(path);
  const language =
    extensionLanguageMap[fileExtension as keyof typeof extensionLanguageMap];

  if (!language) return "text";

  return language;
};