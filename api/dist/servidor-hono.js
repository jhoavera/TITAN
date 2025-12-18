#!/usr/bin/env bun
// @bun
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __moduleCache = /* @__PURE__ */ new WeakMap;
var __toCommonJS = (from) => {
  var entry = __moduleCache.get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function")
    __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    }));
  __moduleCache.set(from, entry);
  return entry;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// node:path
var exports_path = {};
__export(exports_path, {
  sep: () => sep,
  resolve: () => resolve,
  relative: () => relative,
  posix: () => posix,
  parse: () => parse,
  normalize: () => normalize,
  join: () => join,
  isAbsolute: () => isAbsolute,
  format: () => format,
  extname: () => extname,
  dirname: () => dirname,
  delimiter: () => delimiter,
  default: () => path_default,
  basename: () => basename,
  _makeLong: () => _makeLong
});
function assertPath(path) {
  if (typeof path !== "string")
    throw TypeError("Path must be a string. Received " + JSON.stringify(path));
}
function normalizeStringPosix(path, allowAboveRoot) {
  var res = "", lastSegmentLength = 0, lastSlash = -1, dots = 0, code;
  for (var i = 0;i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47)
      break;
    else
      code = 47;
    if (code === 47) {
      if (lastSlash === i - 1 || dots === 1)
        ;
      else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1)
                res = "", lastSegmentLength = 0;
              else
                res = res.slice(0, lastSlashIndex), lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
              lastSlash = i, dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = "", lastSegmentLength = 0, lastSlash = i, dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += "/..";
          else
            res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += "/" + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i, dots = 0;
    } else if (code === 46 && dots !== -1)
      ++dots;
    else
      dots = -1;
  }
  return res;
}
function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root, base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir)
    return base;
  if (dir === pathObject.root)
    return dir + base;
  return dir + sep + base;
}
function resolve() {
  var resolvedPath = "", resolvedAbsolute = false, cwd;
  for (var i = arguments.length - 1;i >= -1 && !resolvedAbsolute; i--) {
    var path;
    if (i >= 0)
      path = arguments[i];
    else {
      if (cwd === undefined)
        cwd = process.cwd();
      path = cwd;
    }
    if (assertPath(path), path.length === 0)
      continue;
    resolvedPath = path + "/" + resolvedPath, resolvedAbsolute = path.charCodeAt(0) === 47;
  }
  if (resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute), resolvedAbsolute)
    if (resolvedPath.length > 0)
      return "/" + resolvedPath;
    else
      return "/";
  else if (resolvedPath.length > 0)
    return resolvedPath;
  else
    return ".";
}
function normalize(path) {
  if (assertPath(path), path.length === 0)
    return ".";
  var isAbsolute = path.charCodeAt(0) === 47, trailingSeparator = path.charCodeAt(path.length - 1) === 47;
  if (path = normalizeStringPosix(path, !isAbsolute), path.length === 0 && !isAbsolute)
    path = ".";
  if (path.length > 0 && trailingSeparator)
    path += "/";
  if (isAbsolute)
    return "/" + path;
  return path;
}
function isAbsolute(path) {
  return assertPath(path), path.length > 0 && path.charCodeAt(0) === 47;
}
function join() {
  if (arguments.length === 0)
    return ".";
  var joined;
  for (var i = 0;i < arguments.length; ++i) {
    var arg = arguments[i];
    if (assertPath(arg), arg.length > 0)
      if (joined === undefined)
        joined = arg;
      else
        joined += "/" + arg;
  }
  if (joined === undefined)
    return ".";
  return normalize(joined);
}
function relative(from, to) {
  if (assertPath(from), assertPath(to), from === to)
    return "";
  if (from = resolve(from), to = resolve(to), from === to)
    return "";
  var fromStart = 1;
  for (;fromStart < from.length; ++fromStart)
    if (from.charCodeAt(fromStart) !== 47)
      break;
  var fromEnd = from.length, fromLen = fromEnd - fromStart, toStart = 1;
  for (;toStart < to.length; ++toStart)
    if (to.charCodeAt(toStart) !== 47)
      break;
  var toEnd = to.length, toLen = toEnd - toStart, length = fromLen < toLen ? fromLen : toLen, lastCommonSep = -1, i = 0;
  for (;i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === 47)
          return to.slice(toStart + i + 1);
        else if (i === 0)
          return to.slice(toStart + i);
      } else if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === 47)
          lastCommonSep = i;
        else if (i === 0)
          lastCommonSep = 0;
      }
      break;
    }
    var fromCode = from.charCodeAt(fromStart + i), toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode)
      break;
    else if (fromCode === 47)
      lastCommonSep = i;
  }
  var out = "";
  for (i = fromStart + lastCommonSep + 1;i <= fromEnd; ++i)
    if (i === fromEnd || from.charCodeAt(i) === 47)
      if (out.length === 0)
        out += "..";
      else
        out += "/..";
  if (out.length > 0)
    return out + to.slice(toStart + lastCommonSep);
  else {
    if (toStart += lastCommonSep, to.charCodeAt(toStart) === 47)
      ++toStart;
    return to.slice(toStart);
  }
}
function _makeLong(path) {
  return path;
}
function dirname(path) {
  if (assertPath(path), path.length === 0)
    return ".";
  var code = path.charCodeAt(0), hasRoot = code === 47, end = -1, matchedSlash = true;
  for (var i = path.length - 1;i >= 1; --i)
    if (code = path.charCodeAt(i), code === 47) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else
      matchedSlash = false;
  if (end === -1)
    return hasRoot ? "/" : ".";
  if (hasRoot && end === 1)
    return "//";
  return path.slice(0, end);
}
function basename(path, ext) {
  if (ext !== undefined && typeof ext !== "string")
    throw TypeError('"ext" argument must be a string');
  assertPath(path);
  var start = 0, end = -1, matchedSlash = true, i;
  if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
    if (ext.length === path.length && ext === path)
      return "";
    var extIdx = ext.length - 1, firstNonSlashEnd = -1;
    for (i = path.length - 1;i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1)
          matchedSlash = false, firstNonSlashEnd = i + 1;
        if (extIdx >= 0)
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1)
              end = i;
          } else
            extIdx = -1, end = firstNonSlashEnd;
      }
    }
    if (start === end)
      end = firstNonSlashEnd;
    else if (end === -1)
      end = path.length;
    return path.slice(start, end);
  } else {
    for (i = path.length - 1;i >= 0; --i)
      if (path.charCodeAt(i) === 47) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1)
        matchedSlash = false, end = i + 1;
    if (end === -1)
      return "";
    return path.slice(start, end);
  }
}
function extname(path) {
  assertPath(path);
  var startDot = -1, startPart = 0, end = -1, matchedSlash = true, preDotState = 0;
  for (var i = path.length - 1;i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1)
      matchedSlash = false, end = i + 1;
    if (code === 46) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1)
      preDotState = -1;
  }
  if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)
    return "";
  return path.slice(startDot, end);
}
function format(pathObject) {
  if (pathObject === null || typeof pathObject !== "object")
    throw TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
  return _format("/", pathObject);
}
function parse(path) {
  assertPath(path);
  var ret = { root: "", dir: "", base: "", ext: "", name: "" };
  if (path.length === 0)
    return ret;
  var code = path.charCodeAt(0), isAbsolute2 = code === 47, start;
  if (isAbsolute2)
    ret.root = "/", start = 1;
  else
    start = 0;
  var startDot = -1, startPart = 0, end = -1, matchedSlash = true, i = path.length - 1, preDotState = 0;
  for (;i >= start; --i) {
    if (code = path.charCodeAt(i), code === 47) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1)
      matchedSlash = false, end = i + 1;
    if (code === 46) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1)
      preDotState = -1;
  }
  if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1)
      if (startPart === 0 && isAbsolute2)
        ret.base = ret.name = path.slice(1, end);
      else
        ret.base = ret.name = path.slice(startPart, end);
  } else {
    if (startPart === 0 && isAbsolute2)
      ret.name = path.slice(1, startDot), ret.base = path.slice(1, end);
    else
      ret.name = path.slice(startPart, startDot), ret.base = path.slice(startPart, end);
    ret.ext = path.slice(startDot, end);
  }
  if (startPart > 0)
    ret.dir = path.slice(0, startPart - 1);
  else if (isAbsolute2)
    ret.dir = "/";
  return ret;
}
var sep = "/", delimiter = ":", posix, path_default;
var init_path = __esm(() => {
  posix = ((p) => (p.posix = p, p))({ resolve, normalize, isAbsolute, join, relative, _makeLong, dirname, basename, extname, format, parse, sep, delimiter, win32: null, posix: null });
  path_default = posix;
});

// src/nucleo/utilidades/validar-nombre-archivo.ts
function validarNombre(nombre) {
  const razones = [];
  if (!nombre || typeof nombre !== "string")
    razones.push("nombre-vacio-o-no-string");
  if (!reglasNombre.patronMinusculas.test(nombre))
    razones.push("contiene-mayusculas-o-caracteres-no-permitidos");
  if (nombre.includes(".")) {
    const tieneSufijoAceptado = reglasNombre.sufijosAceptados.some((s) => nombre.endsWith(s));
    if (!tieneSufijoAceptado)
      razones.push("sufijo-no-aceptado");
  }
  const valido = razones.length === 0;
  return { valido, razones };
}
function detectarInglesBasico(nombre) {
  const palabrasIngles = ["test", "spec", "draft", "proposal", "template", "owner"];
  const lower = nombre.toLowerCase();
  return palabrasIngles.some((p) => lower.includes(p));
}
var reglasNombre;
var init_validar_nombre_archivo = __esm(() => {
  reglasNombre = {
    patronMinusculas: /^[a-z0-9_\-\.]+$/,
    sufijosAceptados: [".md", ".ts", ".prueba.ts", ".spec.ts"]
  };
});

// src/nucleo/servicios/servicio-auditoria-prevalidacion.ts
var { default: fs3} = (() => ({}));
async function registrarEvento(e) {
  await fs3.promises.mkdir(path_default.dirname(AUDITORIA_FILE), { recursive: true });
  const evento = { timestamp: new Date().toISOString(), ...e };
  await fs3.promises.appendFile(AUDITORIA_FILE, JSON.stringify(evento) + `
`, "utf8");
  return evento;
}
var __dirname = "/home/jhoavera/Documentos/TITAN/api/src/nucleo/servicios", DEFAULT_AUDITORIA_FILE, AUDITORIA_FILE;
var init_servicio_auditoria_prevalidacion = __esm(() => {
  init_path();
  DEFAULT_AUDITORIA_FILE = path_default.resolve(__dirname, "../../../..", "documentacion-fuente-unica-verdad", "glosario-biblioteca", "auditoria-prevalidacion.log");
  AUDITORIA_FILE = process.env.TITAN_AUDIT_PREVALIDACION_PATH || DEFAULT_AUDITORIA_FILE;
});

// src/nucleo/servicios/servicio-validacion-creacion.ts
var exports_servicio_validacion_creacion = {};
__export(exports_servicio_validacion_creacion, {
  validarYRegistrarNombre: () => validarYRegistrarNombre,
  detectarIngles: () => detectarIngles,
  default: () => servicio_validacion_creacion_default
});
var { default: fs4} = (() => ({}));
async function validarYRegistrarNombre(nombre, tipo = "otro") {
  const resultado = validarNombre(nombre);
  const hayIngles = detectarInglesBasico(nombre);
  let propuesta = null;
  if (!resultado.valido || hayIngles) {
    const DOCS_ROOT = process.env.TITAN_DOCS_ROOT || path_default.resolve(__dirname, "../../../..");
    const propuestasDir = path_default.resolve(DOCS_ROOT, "documentacion-fuente-unica-verdad", "glosario-biblioteca", "propuestas");
    await fs4.promises.mkdir(propuestasDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const nombreArchivo = `${timestamp}-${tipo}-${nombre.replace(/[\\/]/g, "_")}.md`;
    const contenido = `---
origen: validador-nombres
tipo: ${tipo}
nombre-original: ${nombre}
valido: ${resultado.valido}
razones: ${JSON.stringify(resultado.razones)}
hayIngles: ${hayIngles}
---

Propuesta automática generada por el validador de nombres.`;
    const ruta = path_default.join(propuestasDir, nombreArchivo);
    await fs4.promises.writeFile(ruta, contenido, "utf8");
    propuesta = ruta;
    try {
      await registrarEvento({ nombre, tipo, valido: resultado.valido, hayIngles, propuesta: ruta });
    } catch (_e) {}
  } else {
    try {
      await registrarEvento({ nombre, tipo, valido: resultado.valido, hayIngles, propuesta: null });
    } catch (_e) {}
  }
  return { valido: resultado.valido, hayIngles, razones: resultado.razones, propuesta };
}
function detectarIngles(nombre) {
  return detectarInglesBasico(nombre);
}
var __dirname = "/home/jhoavera/Documentos/TITAN/api/src/nucleo/servicios", servicio_validacion_creacion_default;
var init_servicio_validacion_creacion = __esm(() => {
  init_validar_nombre_archivo();
  init_path();
  init_servicio_auditoria_prevalidacion();
  servicio_validacion_creacion_default = validarYRegistrarNombre;
});

// src/nucleo/hooks/validacion-precreacion.ts
var exports_validacion_precreacion = {};
__export(exports_validacion_precreacion, {
  validarPreCreacion: () => validarPreCreacion,
  default: () => validacion_precreacion_default
});
async function validarPreCreacion(nombre, tipo = "otro") {
  if (!nombre || typeof nombre !== "string")
    return { mensaje: "Nombre inválido" };
  try {
    const res = await validarYRegistrarNombre(nombre, tipo);
    return { propuestaCreada: res.propuesta ?? null, mensaje: res.mensaje ?? "validación realizada" };
  } catch (e) {
    return { mensaje: `error validando nombre: ${e?.message ?? String(e)}` };
  }
}
var validacion_precreacion_default;
var init_validacion_precreacion = __esm(() => {
  init_servicio_validacion_creacion();
  validacion_precreacion_default = { validarPreCreacion };
});

// node_modules/drizzle-orm/entity.cjs
var require_entity = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var entity_exports = {};
  __export2(entity_exports, {
    entityKind: () => entityKind,
    hasOwnEntityKind: () => hasOwnEntityKind,
    is: () => is
  });
  module.exports = __toCommonJS2(entity_exports);
  var entityKind = Symbol.for("drizzle:entityKind");
  var hasOwnEntityKind = Symbol.for("drizzle:hasOwnEntityKind");
  function is(value, type) {
    if (!value || typeof value !== "object") {
      return false;
    }
    if (value instanceof type) {
      return true;
    }
    if (!Object.prototype.hasOwnProperty.call(type, entityKind)) {
      throw new Error(`Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`);
    }
    let cls = value.constructor;
    if (cls) {
      while (cls) {
        if (entityKind in cls && cls[entityKind] === type[entityKind]) {
          return true;
        }
        cls = Object.getPrototypeOf(cls);
      }
    }
    return false;
  }
});

// node_modules/drizzle-orm/column.cjs
var require_column = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var column_exports = {};
  __export2(column_exports, {
    Column: () => Column
  });
  module.exports = __toCommonJS2(column_exports);
  var import_entity = require_entity();

  class Column {
    constructor(table, config) {
      this.table = table;
      this.config = config;
      this.name = config.name;
      this.notNull = config.notNull;
      this.default = config.default;
      this.defaultFn = config.defaultFn;
      this.onUpdateFn = config.onUpdateFn;
      this.hasDefault = config.hasDefault;
      this.primary = config.primaryKey;
      this.isUnique = config.isUnique;
      this.uniqueName = config.uniqueName;
      this.uniqueType = config.uniqueType;
      this.dataType = config.dataType;
      this.columnType = config.columnType;
      this.generated = config.generated;
      this.generatedIdentity = config.generatedIdentity;
    }
    static [import_entity.entityKind] = "Column";
    name;
    primary;
    notNull;
    default;
    defaultFn;
    onUpdateFn;
    hasDefault;
    isUnique;
    uniqueName;
    uniqueType;
    dataType;
    columnType;
    enumValues = undefined;
    generated = undefined;
    generatedIdentity = undefined;
    config;
    mapFromDriverValue(value) {
      return value;
    }
    mapToDriverValue(value) {
      return value;
    }
    shouldDisableInsert() {
      return this.config.generated !== undefined && this.config.generated.type !== "byDefault";
    }
  }
});

// node_modules/drizzle-orm/column-builder.cjs
var require_column_builder = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var column_builder_exports = {};
  __export2(column_builder_exports, {
    ColumnBuilder: () => ColumnBuilder
  });
  module.exports = __toCommonJS2(column_builder_exports);
  var import_entity = require_entity();

  class ColumnBuilder {
    static [import_entity.entityKind] = "ColumnBuilder";
    config;
    constructor(name, dataType, columnType) {
      this.config = {
        name,
        notNull: false,
        default: undefined,
        hasDefault: false,
        primaryKey: false,
        isUnique: false,
        uniqueName: undefined,
        uniqueType: undefined,
        dataType,
        columnType,
        generated: undefined
      };
    }
    $type() {
      return this;
    }
    notNull() {
      this.config.notNull = true;
      return this;
    }
    default(value) {
      this.config.default = value;
      this.config.hasDefault = true;
      return this;
    }
    $defaultFn(fn) {
      this.config.defaultFn = fn;
      this.config.hasDefault = true;
      return this;
    }
    $default = this.$defaultFn;
    $onUpdateFn(fn) {
      this.config.onUpdateFn = fn;
      this.config.hasDefault = true;
      return this;
    }
    $onUpdate = this.$onUpdateFn;
    primaryKey() {
      this.config.primaryKey = true;
      this.config.notNull = true;
      return this;
    }
  }
});

// node_modules/drizzle-orm/table.cjs
var require_table = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var table_exports = {};
  __export2(table_exports, {
    BaseName: () => BaseName,
    Columns: () => Columns,
    ExtraConfigBuilder: () => ExtraConfigBuilder,
    ExtraConfigColumns: () => ExtraConfigColumns,
    IsAlias: () => IsAlias,
    OriginalName: () => OriginalName,
    Schema: () => Schema,
    Table: () => Table,
    TableName: () => TableName,
    getTableName: () => getTableName,
    getTableUniqueName: () => getTableUniqueName,
    isTable: () => isTable
  });
  module.exports = __toCommonJS2(table_exports);
  var import_entity = require_entity();
  var TableName = Symbol.for("drizzle:Name");
  var Schema = Symbol.for("drizzle:Schema");
  var Columns = Symbol.for("drizzle:Columns");
  var ExtraConfigColumns = Symbol.for("drizzle:ExtraConfigColumns");
  var OriginalName = Symbol.for("drizzle:OriginalName");
  var BaseName = Symbol.for("drizzle:BaseName");
  var IsAlias = Symbol.for("drizzle:IsAlias");
  var ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
  var IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");

  class Table {
    static [import_entity.entityKind] = "Table";
    static Symbol = {
      Name: TableName,
      Schema,
      OriginalName,
      Columns,
      ExtraConfigColumns,
      BaseName,
      IsAlias,
      ExtraConfigBuilder
    };
    [TableName];
    [OriginalName];
    [Schema];
    [Columns];
    [ExtraConfigColumns];
    [BaseName];
    [IsAlias] = false;
    [ExtraConfigBuilder] = undefined;
    constructor(name, schema, baseName) {
      this[TableName] = this[OriginalName] = name;
      this[Schema] = schema;
      this[BaseName] = baseName;
    }
  }
  function isTable(table) {
    return typeof table === "object" && table !== null && IsDrizzleTable in table;
  }
  function getTableName(table) {
    return table[TableName];
  }
  function getTableUniqueName(table) {
    return `${table[Schema] ?? "public"}.${table[TableName]}`;
  }
});

// node_modules/drizzle-orm/pg-core/table.cjs
var require_table2 = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var table_exports = {};
  __export2(table_exports, {
    InlineForeignKeys: () => InlineForeignKeys,
    PgTable: () => PgTable,
    pgTable: () => pgTable,
    pgTableCreator: () => pgTableCreator,
    pgTableWithSchema: () => pgTableWithSchema
  });
  module.exports = __toCommonJS2(table_exports);
  var import_entity = require_entity();
  var import_table = require_table();
  var InlineForeignKeys = Symbol.for("drizzle:PgInlineForeignKeys");

  class PgTable extends import_table.Table {
    static [import_entity.entityKind] = "PgTable";
    static Symbol = Object.assign({}, import_table.Table.Symbol, {
      InlineForeignKeys
    });
    [InlineForeignKeys] = [];
    [import_table.Table.Symbol.ExtraConfigBuilder] = undefined;
  }
  function pgTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
    const rawTable = new PgTable(name, schema, baseName);
    const builtColumns = Object.fromEntries(Object.entries(columns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      const column = colBuilder.build(rawTable);
      rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
      return [name2, column];
    }));
    const builtColumnsForExtraConfig = Object.fromEntries(Object.entries(columns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      const column = colBuilder.buildExtraConfigColumn(rawTable);
      return [name2, column];
    }));
    const table = Object.assign(rawTable, builtColumns);
    table[import_table.Table.Symbol.Columns] = builtColumns;
    table[import_table.Table.Symbol.ExtraConfigColumns] = builtColumnsForExtraConfig;
    if (extraConfig) {
      table[PgTable.Symbol.ExtraConfigBuilder] = extraConfig;
    }
    return table;
  }
  var pgTable = (name, columns, extraConfig) => {
    return pgTableWithSchema(name, columns, extraConfig, undefined);
  };
  function pgTableCreator(customizeTableName) {
    return (name, columns, extraConfig) => {
      return pgTableWithSchema(customizeTableName(name), columns, extraConfig, undefined, name);
    };
  }
});

// node_modules/drizzle-orm/pg-core/foreign-keys.cjs
var require_foreign_keys = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var foreign_keys_exports = {};
  __export2(foreign_keys_exports, {
    ForeignKey: () => ForeignKey,
    ForeignKeyBuilder: () => ForeignKeyBuilder,
    foreignKey: () => foreignKey
  });
  module.exports = __toCommonJS2(foreign_keys_exports);
  var import_entity = require_entity();
  var import_table = require_table2();

  class ForeignKeyBuilder {
    static [import_entity.entityKind] = "PgForeignKeyBuilder";
    reference;
    _onUpdate = "no action";
    _onDelete = "no action";
    constructor(config, actions) {
      this.reference = () => {
        const { name, columns, foreignColumns } = config();
        return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
      };
      if (actions) {
        this._onUpdate = actions.onUpdate;
        this._onDelete = actions.onDelete;
      }
    }
    onUpdate(action) {
      this._onUpdate = action === undefined ? "no action" : action;
      return this;
    }
    onDelete(action) {
      this._onDelete = action === undefined ? "no action" : action;
      return this;
    }
    build(table) {
      return new ForeignKey(table, this);
    }
  }

  class ForeignKey {
    constructor(table, builder) {
      this.table = table;
      this.reference = builder.reference;
      this.onUpdate = builder._onUpdate;
      this.onDelete = builder._onDelete;
    }
    static [import_entity.entityKind] = "PgForeignKey";
    reference;
    onUpdate;
    onDelete;
    getName() {
      const { name, columns, foreignColumns } = this.reference();
      const columnNames = columns.map((column) => column.name);
      const foreignColumnNames = foreignColumns.map((column) => column.name);
      const chunks = [
        this.table[import_table.PgTable.Symbol.Name],
        ...columnNames,
        foreignColumns[0].table[import_table.PgTable.Symbol.Name],
        ...foreignColumnNames
      ];
      return name ?? `${chunks.join("_")}_fk`;
    }
  }
  function foreignKey(config) {
    function mappedConfig() {
      const { name, columns, foreignColumns } = config;
      return {
        name,
        columns,
        foreignColumns
      };
    }
    return new ForeignKeyBuilder(mappedConfig);
  }
});

// node_modules/drizzle-orm/tracing-utils.cjs
var require_tracing_utils = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var tracing_utils_exports = {};
  __export2(tracing_utils_exports, {
    iife: () => iife
  });
  module.exports = __toCommonJS2(tracing_utils_exports);
  function iife(fn, ...args) {
    return fn(...args);
  }
});

// node_modules/drizzle-orm/pg-core/unique-constraint.cjs
var require_unique_constraint = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var unique_constraint_exports = {};
  __export2(unique_constraint_exports, {
    UniqueConstraint: () => UniqueConstraint,
    UniqueConstraintBuilder: () => UniqueConstraintBuilder,
    UniqueOnConstraintBuilder: () => UniqueOnConstraintBuilder,
    unique: () => unique,
    uniqueKeyName: () => uniqueKeyName
  });
  module.exports = __toCommonJS2(unique_constraint_exports);
  var import_entity = require_entity();
  var import_table = require_table2();
  function unique(name) {
    return new UniqueOnConstraintBuilder(name);
  }
  function uniqueKeyName(table, columns) {
    return `${table[import_table.PgTable.Symbol.Name]}_${columns.join("_")}_unique`;
  }

  class UniqueConstraintBuilder {
    constructor(columns, name) {
      this.name = name;
      this.columns = columns;
    }
    static [import_entity.entityKind] = "PgUniqueConstraintBuilder";
    columns;
    nullsNotDistinctConfig = false;
    nullsNotDistinct() {
      this.nullsNotDistinctConfig = true;
      return this;
    }
    build(table) {
      return new UniqueConstraint(table, this.columns, this.nullsNotDistinctConfig, this.name);
    }
  }

  class UniqueOnConstraintBuilder {
    static [import_entity.entityKind] = "PgUniqueOnConstraintBuilder";
    name;
    constructor(name) {
      this.name = name;
    }
    on(...columns) {
      return new UniqueConstraintBuilder(columns, this.name);
    }
  }

  class UniqueConstraint {
    constructor(table, columns, nullsNotDistinct, name) {
      this.table = table;
      this.columns = columns;
      this.name = name ?? uniqueKeyName(this.table, this.columns.map((column) => column.name));
      this.nullsNotDistinct = nullsNotDistinct;
    }
    static [import_entity.entityKind] = "PgUniqueConstraint";
    columns;
    name;
    nullsNotDistinct = false;
    getName() {
      return this.name;
    }
  }
});

// node_modules/drizzle-orm/pg-core/utils/array.cjs
var require_array = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var array_exports = {};
  __export2(array_exports, {
    makePgArray: () => makePgArray,
    parsePgArray: () => parsePgArray,
    parsePgNestedArray: () => parsePgNestedArray
  });
  module.exports = __toCommonJS2(array_exports);
  function parsePgArrayValue(arrayString, startFrom, inQuotes) {
    for (let i = startFrom;i < arrayString.length; i++) {
      const char = arrayString[i];
      if (char === "\\") {
        i++;
        continue;
      }
      if (char === '"') {
        return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i + 1];
      }
      if (inQuotes) {
        continue;
      }
      if (char === "," || char === "}") {
        return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i];
      }
    }
    return [arrayString.slice(startFrom).replace(/\\/g, ""), arrayString.length];
  }
  function parsePgNestedArray(arrayString, startFrom = 0) {
    const result = [];
    let i = startFrom;
    let lastCharIsComma = false;
    while (i < arrayString.length) {
      const char = arrayString[i];
      if (char === ",") {
        if (lastCharIsComma || i === startFrom) {
          result.push("");
        }
        lastCharIsComma = true;
        i++;
        continue;
      }
      lastCharIsComma = false;
      if (char === "\\") {
        i += 2;
        continue;
      }
      if (char === '"') {
        const [value2, startFrom2] = parsePgArrayValue(arrayString, i + 1, true);
        result.push(value2);
        i = startFrom2;
        continue;
      }
      if (char === "}") {
        return [result, i + 1];
      }
      if (char === "{") {
        const [value2, startFrom2] = parsePgNestedArray(arrayString, i + 1);
        result.push(value2);
        i = startFrom2;
        continue;
      }
      const [value, newStartFrom] = parsePgArrayValue(arrayString, i, false);
      result.push(value);
      i = newStartFrom;
    }
    return [result, i];
  }
  function parsePgArray(arrayString) {
    const [result] = parsePgNestedArray(arrayString, 1);
    return result;
  }
  function makePgArray(array) {
    return `{${array.map((item) => {
      if (Array.isArray(item)) {
        return makePgArray(item);
      }
      if (typeof item === "string") {
        return `"${item.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}"`;
      }
      return `${item}`;
    }).join(",")}}`;
  }
});

// node_modules/drizzle-orm/pg-core/columns/common.cjs
var require_common = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var common_exports = {};
  __export2(common_exports, {
    ExtraConfigColumn: () => ExtraConfigColumn,
    IndexedColumn: () => IndexedColumn,
    PgArray: () => PgArray,
    PgArrayBuilder: () => PgArrayBuilder,
    PgColumn: () => PgColumn,
    PgColumnBuilder: () => PgColumnBuilder
  });
  module.exports = __toCommonJS2(common_exports);
  var import_column_builder = require_column_builder();
  var import_column = require_column();
  var import_entity = require_entity();
  var import_foreign_keys = require_foreign_keys();
  var import_tracing_utils = require_tracing_utils();
  var import_unique_constraint = require_unique_constraint();
  var import_array = require_array();

  class PgColumnBuilder extends import_column_builder.ColumnBuilder {
    foreignKeyConfigs = [];
    static [import_entity.entityKind] = "PgColumnBuilder";
    array(size) {
      return new PgArrayBuilder(this.config.name, this, size);
    }
    references(ref, actions = {}) {
      this.foreignKeyConfigs.push({ ref, actions });
      return this;
    }
    unique(name, config) {
      this.config.isUnique = true;
      this.config.uniqueName = name;
      this.config.uniqueType = config?.nulls;
      return this;
    }
    generatedAlwaysAs(as) {
      this.config.generated = {
        as,
        type: "always",
        mode: "stored"
      };
      return this;
    }
    buildForeignKeys(column, table) {
      return this.foreignKeyConfigs.map(({ ref, actions }) => {
        return (0, import_tracing_utils.iife)((ref2, actions2) => {
          const builder = new import_foreign_keys.ForeignKeyBuilder(() => {
            const foreignColumn = ref2();
            return { columns: [column], foreignColumns: [foreignColumn] };
          });
          if (actions2.onUpdate) {
            builder.onUpdate(actions2.onUpdate);
          }
          if (actions2.onDelete) {
            builder.onDelete(actions2.onDelete);
          }
          return builder.build(table);
        }, ref, actions);
      });
    }
    buildExtraConfigColumn(table) {
      return new ExtraConfigColumn(table, this.config);
    }
  }

  class PgColumn extends import_column.Column {
    constructor(table, config) {
      if (!config.uniqueName) {
        config.uniqueName = (0, import_unique_constraint.uniqueKeyName)(table, [config.name]);
      }
      super(table, config);
      this.table = table;
    }
    static [import_entity.entityKind] = "PgColumn";
  }

  class ExtraConfigColumn extends PgColumn {
    static [import_entity.entityKind] = "ExtraConfigColumn";
    getSQLType() {
      return this.getSQLType();
    }
    indexConfig = {
      order: this.config.order ?? "asc",
      nulls: this.config.nulls ?? "last",
      opClass: this.config.opClass
    };
    defaultConfig = {
      order: "asc",
      nulls: "last",
      opClass: undefined
    };
    asc() {
      this.indexConfig.order = "asc";
      return this;
    }
    desc() {
      this.indexConfig.order = "desc";
      return this;
    }
    nullsFirst() {
      this.indexConfig.nulls = "first";
      return this;
    }
    nullsLast() {
      this.indexConfig.nulls = "last";
      return this;
    }
    op(opClass) {
      this.indexConfig.opClass = opClass;
      return this;
    }
  }

  class IndexedColumn {
    static [import_entity.entityKind] = "IndexedColumn";
    constructor(name, type, indexConfig) {
      this.name = name;
      this.type = type;
      this.indexConfig = indexConfig;
    }
    name;
    type;
    indexConfig;
  }

  class PgArrayBuilder extends PgColumnBuilder {
    static [import_entity.entityKind] = "PgArrayBuilder";
    constructor(name, baseBuilder, size) {
      super(name, "array", "PgArray");
      this.config.baseBuilder = baseBuilder;
      this.config.size = size;
    }
    build(table) {
      const baseColumn = this.config.baseBuilder.build(table);
      return new PgArray(table, this.config, baseColumn);
    }
  }

  class PgArray extends PgColumn {
    constructor(table, config, baseColumn, range) {
      super(table, config);
      this.baseColumn = baseColumn;
      this.range = range;
      this.size = config.size;
    }
    size;
    static [import_entity.entityKind] = "PgArray";
    getSQLType() {
      return `${this.baseColumn.getSQLType()}[${typeof this.size === "number" ? this.size : ""}]`;
    }
    mapFromDriverValue(value) {
      if (typeof value === "string") {
        value = (0, import_array.parsePgArray)(value);
      }
      return value.map((v) => this.baseColumn.mapFromDriverValue(v));
    }
    mapToDriverValue(value, isNestedArray = false) {
      const a = value.map((v) => v === null ? null : (0, import_entity.is)(this.baseColumn, PgArray) ? this.baseColumn.mapToDriverValue(v, true) : this.baseColumn.mapToDriverValue(v));
      if (isNestedArray)
        return a;
      return (0, import_array.makePgArray)(a);
    }
  }
});

// node_modules/drizzle-orm/pg-core/columns/enum.cjs
var require_enum = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var enum_exports = {};
  __export2(enum_exports, {
    PgEnumColumn: () => PgEnumColumn,
    PgEnumColumnBuilder: () => PgEnumColumnBuilder,
    isPgEnum: () => isPgEnum,
    pgEnum: () => pgEnum,
    pgEnumWithSchema: () => pgEnumWithSchema
  });
  module.exports = __toCommonJS2(enum_exports);
  var import_entity = require_entity();
  var import_common = require_common();
  var isPgEnumSym = Symbol.for("drizzle:isPgEnum");
  function isPgEnum(obj) {
    return !!obj && typeof obj === "function" && isPgEnumSym in obj && obj[isPgEnumSym] === true;
  }

  class PgEnumColumnBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgEnumColumnBuilder";
    constructor(name, enumInstance) {
      super(name, "string", "PgEnumColumn");
      this.config.enum = enumInstance;
    }
    build(table) {
      return new PgEnumColumn(table, this.config);
    }
  }

  class PgEnumColumn extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgEnumColumn";
    enum = this.config.enum;
    enumValues = this.config.enum.enumValues;
    constructor(table, config) {
      super(table, config);
      this.enum = config.enum;
    }
    getSQLType() {
      return this.enum.enumName;
    }
  }
  function pgEnum(enumName, values) {
    return pgEnumWithSchema(enumName, values, undefined);
  }
  function pgEnumWithSchema(enumName, values, schema) {
    const enumInstance = Object.assign((name) => new PgEnumColumnBuilder(name, enumInstance), {
      enumName,
      enumValues: values,
      schema,
      [isPgEnumSym]: true
    });
    return enumInstance;
  }
});

// node_modules/drizzle-orm/subquery.cjs
var require_subquery = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var subquery_exports = {};
  __export2(subquery_exports, {
    Subquery: () => Subquery,
    WithSubquery: () => WithSubquery
  });
  module.exports = __toCommonJS2(subquery_exports);
  var import_entity = require_entity();

  class Subquery {
    static [import_entity.entityKind] = "Subquery";
    constructor(sql, selection, alias, isWith = false) {
      this._ = {
        brand: "Subquery",
        sql,
        selectedFields: selection,
        alias,
        isWith
      };
    }
  }

  class WithSubquery extends Subquery {
    static [import_entity.entityKind] = "WithSubquery";
  }
});

// node_modules/drizzle-orm/version.cjs
var require_version = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var version_exports = {};
  __export2(version_exports, {
    compatibilityVersion: () => compatibilityVersion,
    npmVersion: () => version
  });
  module.exports = __toCommonJS2(version_exports);
  var version = "0.32.0";
  var compatibilityVersion = 7;
});

// node_modules/drizzle-orm/tracing.cjs
var require_tracing = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var tracing_exports = {};
  __export2(tracing_exports, {
    tracer: () => tracer
  });
  module.exports = __toCommonJS2(tracing_exports);
  var import_tracing_utils = require_tracing_utils();
  var import_version = require_version();
  var otel;
  var rawTracer;
  var tracer = {
    startActiveSpan(name, fn) {
      if (!otel) {
        return fn();
      }
      if (!rawTracer) {
        rawTracer = otel.trace.getTracer("drizzle-orm", import_version.npmVersion);
      }
      return (0, import_tracing_utils.iife)((otel2, rawTracer2) => rawTracer2.startActiveSpan(name, (span) => {
        try {
          return fn(span);
        } catch (e) {
          span.setStatus({
            code: otel2.SpanStatusCode.ERROR,
            message: e instanceof Error ? e.message : "Unknown error"
          });
          throw e;
        } finally {
          span.end();
        }
      }), otel, rawTracer);
    }
  };
});

// node_modules/drizzle-orm/view-common.cjs
var require_view_common = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var view_common_exports = {};
  __export2(view_common_exports, {
    ViewBaseConfig: () => ViewBaseConfig
  });
  module.exports = __toCommonJS2(view_common_exports);
  var ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");
});

// node_modules/drizzle-orm/sql/sql.cjs
var require_sql = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name2 in all)
      __defProp2(target, name2, { get: all[name2], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var sql_exports = {};
  __export2(sql_exports, {
    FakePrimitiveParam: () => FakePrimitiveParam,
    Name: () => Name,
    Param: () => Param,
    Placeholder: () => Placeholder,
    SQL: () => SQL,
    StringChunk: () => StringChunk,
    View: () => View,
    fillPlaceholders: () => fillPlaceholders,
    isDriverValueEncoder: () => isDriverValueEncoder,
    isSQLWrapper: () => isSQLWrapper,
    name: () => name,
    noopDecoder: () => noopDecoder,
    noopEncoder: () => noopEncoder,
    noopMapper: () => noopMapper,
    param: () => param,
    placeholder: () => placeholder,
    sql: () => sql
  });
  module.exports = __toCommonJS2(sql_exports);
  var import_entity = require_entity();
  var import_enum = require_enum();
  var import_subquery = require_subquery();
  var import_tracing = require_tracing();
  var import_view_common = require_view_common();
  var import_column = require_column();
  var import_table = require_table();

  class FakePrimitiveParam {
    static [import_entity.entityKind] = "FakePrimitiveParam";
  }
  function isSQLWrapper(value) {
    return value !== null && value !== undefined && typeof value.getSQL === "function";
  }
  function mergeQueries(queries) {
    const result = { sql: "", params: [] };
    for (const query of queries) {
      result.sql += query.sql;
      result.params.push(...query.params);
      if (query.typings?.length) {
        if (!result.typings) {
          result.typings = [];
        }
        result.typings.push(...query.typings);
      }
    }
    return result;
  }

  class StringChunk {
    static [import_entity.entityKind] = "StringChunk";
    value;
    constructor(value) {
      this.value = Array.isArray(value) ? value : [value];
    }
    getSQL() {
      return new SQL([this]);
    }
  }

  class SQL {
    constructor(queryChunks) {
      this.queryChunks = queryChunks;
    }
    static [import_entity.entityKind] = "SQL";
    decoder = noopDecoder;
    shouldInlineParams = false;
    append(query) {
      this.queryChunks.push(...query.queryChunks);
      return this;
    }
    toQuery(config) {
      return import_tracing.tracer.startActiveSpan("drizzle.buildSQL", (span) => {
        const query = this.buildQueryFromSourceParams(this.queryChunks, config);
        span?.setAttributes({
          "drizzle.query.text": query.sql,
          "drizzle.query.params": JSON.stringify(query.params)
        });
        return query;
      });
    }
    buildQueryFromSourceParams(chunks, _config) {
      const config = Object.assign({}, _config, {
        inlineParams: _config.inlineParams || this.shouldInlineParams,
        paramStartIndex: _config.paramStartIndex || { value: 0 }
      });
      const {
        escapeName,
        escapeParam,
        prepareTyping,
        inlineParams,
        paramStartIndex
      } = config;
      return mergeQueries(chunks.map((chunk) => {
        if ((0, import_entity.is)(chunk, StringChunk)) {
          return { sql: chunk.value.join(""), params: [] };
        }
        if ((0, import_entity.is)(chunk, Name)) {
          return { sql: escapeName(chunk.value), params: [] };
        }
        if (chunk === undefined) {
          return { sql: "", params: [] };
        }
        if (Array.isArray(chunk)) {
          const result = [new StringChunk("(")];
          for (const [i, p] of chunk.entries()) {
            result.push(p);
            if (i < chunk.length - 1) {
              result.push(new StringChunk(", "));
            }
          }
          result.push(new StringChunk(")"));
          return this.buildQueryFromSourceParams(result, config);
        }
        if ((0, import_entity.is)(chunk, SQL)) {
          return this.buildQueryFromSourceParams(chunk.queryChunks, {
            ...config,
            inlineParams: inlineParams || chunk.shouldInlineParams
          });
        }
        if ((0, import_entity.is)(chunk, import_table.Table)) {
          const schemaName = chunk[import_table.Table.Symbol.Schema];
          const tableName = chunk[import_table.Table.Symbol.Name];
          return {
            sql: schemaName === undefined ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
            params: []
          };
        }
        if ((0, import_entity.is)(chunk, import_column.Column)) {
          if (_config.invokeSource === "indexes") {
            return { sql: escapeName(chunk.name), params: [] };
          }
          return { sql: escapeName(chunk.table[import_table.Table.Symbol.Name]) + "." + escapeName(chunk.name), params: [] };
        }
        if ((0, import_entity.is)(chunk, View)) {
          const schemaName = chunk[import_view_common.ViewBaseConfig].schema;
          const viewName = chunk[import_view_common.ViewBaseConfig].name;
          return {
            sql: schemaName === undefined ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
            params: []
          };
        }
        if ((0, import_entity.is)(chunk, Param)) {
          const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
          if ((0, import_entity.is)(mappedValue, SQL)) {
            return this.buildQueryFromSourceParams([mappedValue], config);
          }
          if (inlineParams) {
            return { sql: this.mapInlineParam(mappedValue, config), params: [] };
          }
          let typings;
          if (prepareTyping) {
            typings = [prepareTyping(chunk.encoder)];
          }
          return { sql: escapeParam(paramStartIndex.value++, mappedValue), params: [mappedValue], typings };
        }
        if ((0, import_entity.is)(chunk, Placeholder)) {
          return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
        }
        if ((0, import_entity.is)(chunk, SQL.Aliased) && chunk.fieldAlias !== undefined) {
          return { sql: escapeName(chunk.fieldAlias), params: [] };
        }
        if ((0, import_entity.is)(chunk, import_subquery.Subquery)) {
          if (chunk._.isWith) {
            return { sql: escapeName(chunk._.alias), params: [] };
          }
          return this.buildQueryFromSourceParams([
            new StringChunk("("),
            chunk._.sql,
            new StringChunk(") "),
            new Name(chunk._.alias)
          ], config);
        }
        if ((0, import_enum.isPgEnum)(chunk)) {
          if (chunk.schema) {
            return { sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName), params: [] };
          }
          return { sql: escapeName(chunk.enumName), params: [] };
        }
        if (isSQLWrapper(chunk)) {
          if (chunk.shouldOmitSQLParens?.()) {
            return this.buildQueryFromSourceParams([chunk.getSQL()], config);
          }
          return this.buildQueryFromSourceParams([
            new StringChunk("("),
            chunk.getSQL(),
            new StringChunk(")")
          ], config);
        }
        if (inlineParams) {
          return { sql: this.mapInlineParam(chunk, config), params: [] };
        }
        return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk] };
      }));
    }
    mapInlineParam(chunk, { escapeString }) {
      if (chunk === null) {
        return "null";
      }
      if (typeof chunk === "number" || typeof chunk === "boolean") {
        return chunk.toString();
      }
      if (typeof chunk === "string") {
        return escapeString(chunk);
      }
      if (typeof chunk === "object") {
        const mappedValueAsString = chunk.toString();
        if (mappedValueAsString === "[object Object]") {
          return escapeString(JSON.stringify(chunk));
        }
        return escapeString(mappedValueAsString);
      }
      throw new Error("Unexpected param value: " + chunk);
    }
    getSQL() {
      return this;
    }
    as(alias) {
      if (alias === undefined) {
        return this;
      }
      return new SQL.Aliased(this, alias);
    }
    mapWith(decoder) {
      this.decoder = typeof decoder === "function" ? { mapFromDriverValue: decoder } : decoder;
      return this;
    }
    inlineParams() {
      this.shouldInlineParams = true;
      return this;
    }
    if(condition) {
      return condition ? this : undefined;
    }
  }

  class Name {
    constructor(value) {
      this.value = value;
    }
    static [import_entity.entityKind] = "Name";
    brand;
    getSQL() {
      return new SQL([this]);
    }
  }
  function name(value) {
    return new Name(value);
  }
  function isDriverValueEncoder(value) {
    return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
  }
  var noopDecoder = {
    mapFromDriverValue: (value) => value
  };
  var noopEncoder = {
    mapToDriverValue: (value) => value
  };
  var noopMapper = {
    ...noopDecoder,
    ...noopEncoder
  };

  class Param {
    constructor(value, encoder = noopEncoder) {
      this.value = value;
      this.encoder = encoder;
    }
    static [import_entity.entityKind] = "Param";
    brand;
    getSQL() {
      return new SQL([this]);
    }
  }
  function param(value, encoder) {
    return new Param(value, encoder);
  }
  function sql(strings, ...params) {
    const queryChunks = [];
    if (params.length > 0 || strings.length > 0 && strings[0] !== "") {
      queryChunks.push(new StringChunk(strings[0]));
    }
    for (const [paramIndex, param2] of params.entries()) {
      queryChunks.push(param2, new StringChunk(strings[paramIndex + 1]));
    }
    return new SQL(queryChunks);
  }
  ((sql2) => {
    function empty() {
      return new SQL([]);
    }
    sql2.empty = empty;
    function fromList(list) {
      return new SQL(list);
    }
    sql2.fromList = fromList;
    function raw2(str) {
      return new SQL([new StringChunk(str)]);
    }
    sql2.raw = raw2;
    function join2(chunks, separator) {
      const result = [];
      for (const [i, chunk] of chunks.entries()) {
        if (i > 0 && separator !== undefined) {
          result.push(separator);
        }
        result.push(chunk);
      }
      return new SQL(result);
    }
    sql2.join = join2;
    function identifier(value) {
      return new Name(value);
    }
    sql2.identifier = identifier;
    function placeholder2(name2) {
      return new Placeholder(name2);
    }
    sql2.placeholder = placeholder2;
    function param2(value, encoder) {
      return new Param(value, encoder);
    }
    sql2.param = param2;
  })(sql || (sql = {}));
  ((SQL2) => {

    class Aliased {
      constructor(sql2, fieldAlias) {
        this.sql = sql2;
        this.fieldAlias = fieldAlias;
      }
      static [import_entity.entityKind] = "SQL.Aliased";
      isSelectionField = false;
      getSQL() {
        return this.sql;
      }
      clone() {
        return new Aliased(this.sql, this.fieldAlias);
      }
    }
    SQL2.Aliased = Aliased;
  })(SQL || (SQL = {}));

  class Placeholder {
    constructor(name2) {
      this.name = name2;
    }
    static [import_entity.entityKind] = "Placeholder";
    getSQL() {
      return new SQL([this]);
    }
  }
  function placeholder(name2) {
    return new Placeholder(name2);
  }
  function fillPlaceholders(params, values) {
    return params.map((p) => {
      if ((0, import_entity.is)(p, Placeholder)) {
        if (!(p.name in values)) {
          throw new Error(`No value for placeholder "${p.name}" was provided`);
        }
        return values[p.name];
      }
      return p;
    });
  }

  class View {
    static [import_entity.entityKind] = "View";
    [import_view_common.ViewBaseConfig];
    constructor({ name: name2, schema, selectedFields, query }) {
      this[import_view_common.ViewBaseConfig] = {
        name: name2,
        originalName: name2,
        schema,
        selectedFields,
        query,
        isExisting: !query,
        isAlias: false
      };
    }
    getSQL() {
      return new SQL([this]);
    }
  }
  import_column.Column.prototype.getSQL = function() {
    return new SQL([this]);
  };
  import_table.Table.prototype.getSQL = function() {
    return new SQL([this]);
  };
  import_subquery.Subquery.prototype.getSQL = function() {
    return new SQL([this]);
  };
});

// node_modules/drizzle-orm/alias.cjs
var require_alias = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var alias_exports = {};
  __export2(alias_exports, {
    ColumnAliasProxyHandler: () => ColumnAliasProxyHandler,
    RelationTableAliasProxyHandler: () => RelationTableAliasProxyHandler,
    TableAliasProxyHandler: () => TableAliasProxyHandler,
    aliasedRelation: () => aliasedRelation,
    aliasedTable: () => aliasedTable,
    aliasedTableColumn: () => aliasedTableColumn,
    mapColumnsInAliasedSQLToAlias: () => mapColumnsInAliasedSQLToAlias,
    mapColumnsInSQLToAlias: () => mapColumnsInSQLToAlias
  });
  module.exports = __toCommonJS2(alias_exports);
  var import_column = require_column();
  var import_entity = require_entity();
  var import_sql = require_sql();
  var import_table = require_table();
  var import_view_common = require_view_common();

  class ColumnAliasProxyHandler {
    constructor(table) {
      this.table = table;
    }
    static [import_entity.entityKind] = "ColumnAliasProxyHandler";
    get(columnObj, prop) {
      if (prop === "table") {
        return this.table;
      }
      return columnObj[prop];
    }
  }

  class TableAliasProxyHandler {
    constructor(alias, replaceOriginalName) {
      this.alias = alias;
      this.replaceOriginalName = replaceOriginalName;
    }
    static [import_entity.entityKind] = "TableAliasProxyHandler";
    get(target, prop) {
      if (prop === import_table.Table.Symbol.IsAlias) {
        return true;
      }
      if (prop === import_table.Table.Symbol.Name) {
        return this.alias;
      }
      if (this.replaceOriginalName && prop === import_table.Table.Symbol.OriginalName) {
        return this.alias;
      }
      if (prop === import_view_common.ViewBaseConfig) {
        return {
          ...target[import_view_common.ViewBaseConfig],
          name: this.alias,
          isAlias: true
        };
      }
      if (prop === import_table.Table.Symbol.Columns) {
        const columns = target[import_table.Table.Symbol.Columns];
        if (!columns) {
          return columns;
        }
        const proxiedColumns = {};
        Object.keys(columns).map((key) => {
          proxiedColumns[key] = new Proxy(columns[key], new ColumnAliasProxyHandler(new Proxy(target, this)));
        });
        return proxiedColumns;
      }
      const value = target[prop];
      if ((0, import_entity.is)(value, import_column.Column)) {
        return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(target, this)));
      }
      return value;
    }
  }

  class RelationTableAliasProxyHandler {
    constructor(alias) {
      this.alias = alias;
    }
    static [import_entity.entityKind] = "RelationTableAliasProxyHandler";
    get(target, prop) {
      if (prop === "sourceTable") {
        return aliasedTable(target.sourceTable, this.alias);
      }
      return target[prop];
    }
  }
  function aliasedTable(table, tableAlias) {
    return new Proxy(table, new TableAliasProxyHandler(tableAlias, false));
  }
  function aliasedRelation(relation, tableAlias) {
    return new Proxy(relation, new RelationTableAliasProxyHandler(tableAlias));
  }
  function aliasedTableColumn(column, tableAlias) {
    return new Proxy(column, new ColumnAliasProxyHandler(new Proxy(column.table, new TableAliasProxyHandler(tableAlias, false))));
  }
  function mapColumnsInAliasedSQLToAlias(query, alias) {
    return new import_sql.SQL.Aliased(mapColumnsInSQLToAlias(query.sql, alias), query.fieldAlias);
  }
  function mapColumnsInSQLToAlias(query, alias) {
    return import_sql.sql.join(query.queryChunks.map((c) => {
      if ((0, import_entity.is)(c, import_column.Column)) {
        return aliasedTableColumn(c, alias);
      }
      if ((0, import_entity.is)(c, import_sql.SQL)) {
        return mapColumnsInSQLToAlias(c, alias);
      }
      if ((0, import_entity.is)(c, import_sql.SQL.Aliased)) {
        return mapColumnsInAliasedSQLToAlias(c, alias);
      }
      return c;
    }));
  }
});

// node_modules/drizzle-orm/pg-core/alias.cjs
var require_alias2 = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var alias_exports = {};
  __export2(alias_exports, {
    alias: () => alias
  });
  module.exports = __toCommonJS2(alias_exports);
  var import_alias = require_alias();
  function alias(table, alias2) {
    return new Proxy(table, new import_alias.TableAliasProxyHandler(alias2, false));
  }
});

// node_modules/drizzle-orm/pg-core/checks.cjs
var require_checks = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var checks_exports = {};
  __export2(checks_exports, {
    Check: () => Check,
    CheckBuilder: () => CheckBuilder,
    check: () => check
  });
  module.exports = __toCommonJS2(checks_exports);
  var import_entity = require_entity();

  class CheckBuilder {
    constructor(name, value) {
      this.name = name;
      this.value = value;
    }
    static [import_entity.entityKind] = "PgCheckBuilder";
    brand;
    build(table) {
      return new Check(table, this);
    }
  }

  class Check {
    constructor(table, builder) {
      this.table = table;
      this.name = builder.name;
      this.value = builder.value;
    }
    static [import_entity.entityKind] = "PgCheck";
    name;
    value;
  }
  function check(name, value) {
    return new CheckBuilder(name, value);
  }
});

// node_modules/drizzle-orm/pg-core/columns/int.common.cjs
var require_int_common = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var int_common_exports = {};
  __export2(int_common_exports, {
    PgIntColumnBaseBuilder: () => PgIntColumnBaseBuilder
  });
  module.exports = __toCommonJS2(int_common_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgIntColumnBaseBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgIntColumnBaseBuilder";
    generatedAlwaysAsIdentity(sequence) {
      if (sequence) {
        const { name, ...options } = sequence;
        this.config.generatedIdentity = {
          type: "always",
          sequenceName: name,
          sequenceOptions: options
        };
      } else {
        this.config.generatedIdentity = {
          type: "always"
        };
      }
      this.config.hasDefault = true;
      this.config.notNull = true;
      return this;
    }
    generatedByDefaultAsIdentity(sequence) {
      if (sequence) {
        const { name, ...options } = sequence;
        this.config.generatedIdentity = {
          type: "byDefault",
          sequenceName: name,
          sequenceOptions: options
        };
      } else {
        this.config.generatedIdentity = {
          type: "byDefault"
        };
      }
      this.config.hasDefault = true;
      this.config.notNull = true;
      return this;
    }
  }
});

// node_modules/drizzle-orm/pg-core/columns/bigint.cjs
var require_bigint = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var bigint_exports = {};
  __export2(bigint_exports, {
    PgBigInt53: () => PgBigInt53,
    PgBigInt53Builder: () => PgBigInt53Builder,
    PgBigInt64: () => PgBigInt64,
    PgBigInt64Builder: () => PgBigInt64Builder,
    bigint: () => bigint
  });
  module.exports = __toCommonJS2(bigint_exports);
  var import_entity = require_entity();
  var import_common = require_common();
  var import_int_common = require_int_common();

  class PgBigInt53Builder extends import_int_common.PgIntColumnBaseBuilder {
    static [import_entity.entityKind] = "PgBigInt53Builder";
    constructor(name) {
      super(name, "number", "PgBigInt53");
    }
    build(table) {
      return new PgBigInt53(table, this.config);
    }
  }

  class PgBigInt53 extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgBigInt53";
    getSQLType() {
      return "bigint";
    }
    mapFromDriverValue(value) {
      if (typeof value === "number") {
        return value;
      }
      return Number(value);
    }
  }

  class PgBigInt64Builder extends import_int_common.PgIntColumnBaseBuilder {
    static [import_entity.entityKind] = "PgBigInt64Builder";
    constructor(name) {
      super(name, "bigint", "PgBigInt64");
    }
    build(table) {
      return new PgBigInt64(table, this.config);
    }
  }

  class PgBigInt64 extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgBigInt64";
    getSQLType() {
      return "bigint";
    }
    mapFromDriverValue(value) {
      return BigInt(value);
    }
  }
  function bigint(name, config) {
    if (config.mode === "number") {
      return new PgBigInt53Builder(name);
    }
    return new PgBigInt64Builder(name);
  }
});

// node_modules/drizzle-orm/pg-core/columns/bigserial.cjs
var require_bigserial = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var bigserial_exports = {};
  __export2(bigserial_exports, {
    PgBigSerial53: () => PgBigSerial53,
    PgBigSerial53Builder: () => PgBigSerial53Builder,
    PgBigSerial64: () => PgBigSerial64,
    PgBigSerial64Builder: () => PgBigSerial64Builder,
    bigserial: () => bigserial
  });
  module.exports = __toCommonJS2(bigserial_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgBigSerial53Builder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgBigSerial53Builder";
    constructor(name) {
      super(name, "number", "PgBigSerial53");
      this.config.hasDefault = true;
      this.config.notNull = true;
    }
    build(table) {
      return new PgBigSerial53(table, this.config);
    }
  }

  class PgBigSerial53 extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgBigSerial53";
    getSQLType() {
      return "bigserial";
    }
    mapFromDriverValue(value) {
      if (typeof value === "number") {
        return value;
      }
      return Number(value);
    }
  }

  class PgBigSerial64Builder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgBigSerial64Builder";
    constructor(name) {
      super(name, "bigint", "PgBigSerial64");
      this.config.hasDefault = true;
    }
    build(table) {
      return new PgBigSerial64(table, this.config);
    }
  }

  class PgBigSerial64 extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgBigSerial64";
    getSQLType() {
      return "bigserial";
    }
    mapFromDriverValue(value) {
      return BigInt(value);
    }
  }
  function bigserial(name, { mode }) {
    if (mode === "number") {
      return new PgBigSerial53Builder(name);
    }
    return new PgBigSerial64Builder(name);
  }
});

// node_modules/drizzle-orm/pg-core/columns/boolean.cjs
var require_boolean = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var boolean_exports = {};
  __export2(boolean_exports, {
    PgBoolean: () => PgBoolean,
    PgBooleanBuilder: () => PgBooleanBuilder,
    boolean: () => boolean
  });
  module.exports = __toCommonJS2(boolean_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgBooleanBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgBooleanBuilder";
    constructor(name) {
      super(name, "boolean", "PgBoolean");
    }
    build(table) {
      return new PgBoolean(table, this.config);
    }
  }

  class PgBoolean extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgBoolean";
    getSQLType() {
      return "boolean";
    }
  }
  function boolean(name) {
    return new PgBooleanBuilder(name);
  }
});

// node_modules/drizzle-orm/pg-core/columns/char.cjs
var require_char = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var char_exports = {};
  __export2(char_exports, {
    PgChar: () => PgChar,
    PgCharBuilder: () => PgCharBuilder,
    char: () => char
  });
  module.exports = __toCommonJS2(char_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgCharBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgCharBuilder";
    constructor(name, config) {
      super(name, "string", "PgChar");
      this.config.length = config.length;
      this.config.enumValues = config.enum;
    }
    build(table) {
      return new PgChar(table, this.config);
    }
  }

  class PgChar extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgChar";
    length = this.config.length;
    enumValues = this.config.enumValues;
    getSQLType() {
      return this.length === undefined ? `char` : `char(${this.length})`;
    }
  }
  function char(name, config = {}) {
    return new PgCharBuilder(name, config);
  }
});

// node_modules/drizzle-orm/pg-core/columns/cidr.cjs
var require_cidr = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var cidr_exports = {};
  __export2(cidr_exports, {
    PgCidr: () => PgCidr,
    PgCidrBuilder: () => PgCidrBuilder,
    cidr: () => cidr
  });
  module.exports = __toCommonJS2(cidr_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgCidrBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgCidrBuilder";
    constructor(name) {
      super(name, "string", "PgCidr");
    }
    build(table) {
      return new PgCidr(table, this.config);
    }
  }

  class PgCidr extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgCidr";
    getSQLType() {
      return "cidr";
    }
  }
  function cidr(name) {
    return new PgCidrBuilder(name);
  }
});

// node_modules/drizzle-orm/pg-core/columns/custom.cjs
var require_custom = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var custom_exports = {};
  __export2(custom_exports, {
    PgCustomColumn: () => PgCustomColumn,
    PgCustomColumnBuilder: () => PgCustomColumnBuilder,
    customType: () => customType
  });
  module.exports = __toCommonJS2(custom_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgCustomColumnBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgCustomColumnBuilder";
    constructor(name, fieldConfig, customTypeParams) {
      super(name, "custom", "PgCustomColumn");
      this.config.fieldConfig = fieldConfig;
      this.config.customTypeParams = customTypeParams;
    }
    build(table) {
      return new PgCustomColumn(table, this.config);
    }
  }

  class PgCustomColumn extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgCustomColumn";
    sqlName;
    mapTo;
    mapFrom;
    constructor(table, config) {
      super(table, config);
      this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
      this.mapTo = config.customTypeParams.toDriver;
      this.mapFrom = config.customTypeParams.fromDriver;
    }
    getSQLType() {
      return this.sqlName;
    }
    mapFromDriverValue(value) {
      return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
    }
    mapToDriverValue(value) {
      return typeof this.mapTo === "function" ? this.mapTo(value) : value;
    }
  }
  function customType(customTypeParams) {
    return (dbName, fieldConfig) => {
      return new PgCustomColumnBuilder(dbName, fieldConfig, customTypeParams);
    };
  }
});

// node_modules/drizzle-orm/pg-core/columns/date.common.cjs
var require_date_common = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var date_common_exports = {};
  __export2(date_common_exports, {
    PgDateColumnBaseBuilder: () => PgDateColumnBaseBuilder
  });
  module.exports = __toCommonJS2(date_common_exports);
  var import_entity = require_entity();
  var import_sql = require_sql();
  var import_common = require_common();

  class PgDateColumnBaseBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgDateColumnBaseBuilder";
    defaultNow() {
      return this.default(import_sql.sql`now()`);
    }
  }
});

// node_modules/drizzle-orm/pg-core/columns/date.cjs
var require_date = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var date_exports = {};
  __export2(date_exports, {
    PgDate: () => PgDate,
    PgDateBuilder: () => PgDateBuilder,
    PgDateString: () => PgDateString,
    PgDateStringBuilder: () => PgDateStringBuilder,
    date: () => date
  });
  module.exports = __toCommonJS2(date_exports);
  var import_entity = require_entity();
  var import_common = require_common();
  var import_date_common = require_date_common();

  class PgDateBuilder extends import_date_common.PgDateColumnBaseBuilder {
    static [import_entity.entityKind] = "PgDateBuilder";
    constructor(name) {
      super(name, "date", "PgDate");
    }
    build(table) {
      return new PgDate(table, this.config);
    }
  }

  class PgDate extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgDate";
    getSQLType() {
      return "date";
    }
    mapFromDriverValue(value) {
      return new Date(value);
    }
    mapToDriverValue(value) {
      return value.toISOString();
    }
  }

  class PgDateStringBuilder extends import_date_common.PgDateColumnBaseBuilder {
    static [import_entity.entityKind] = "PgDateStringBuilder";
    constructor(name) {
      super(name, "string", "PgDateString");
    }
    build(table) {
      return new PgDateString(table, this.config);
    }
  }

  class PgDateString extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgDateString";
    getSQLType() {
      return "date";
    }
  }
  function date(name, config) {
    if (config?.mode === "date") {
      return new PgDateBuilder(name);
    }
    return new PgDateStringBuilder(name);
  }
});

// node_modules/drizzle-orm/pg-core/columns/double-precision.cjs
var require_double_precision = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var double_precision_exports = {};
  __export2(double_precision_exports, {
    PgDoublePrecision: () => PgDoublePrecision,
    PgDoublePrecisionBuilder: () => PgDoublePrecisionBuilder,
    doublePrecision: () => doublePrecision
  });
  module.exports = __toCommonJS2(double_precision_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgDoublePrecisionBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgDoublePrecisionBuilder";
    constructor(name) {
      super(name, "number", "PgDoublePrecision");
    }
    build(table) {
      return new PgDoublePrecision(table, this.config);
    }
  }

  class PgDoublePrecision extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgDoublePrecision";
    getSQLType() {
      return "double precision";
    }
    mapFromDriverValue(value) {
      if (typeof value === "string") {
        return Number.parseFloat(value);
      }
      return value;
    }
  }
  function doublePrecision(name) {
    return new PgDoublePrecisionBuilder(name);
  }
});

// node_modules/drizzle-orm/pg-core/columns/inet.cjs
var require_inet = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var inet_exports = {};
  __export2(inet_exports, {
    PgInet: () => PgInet,
    PgInetBuilder: () => PgInetBuilder,
    inet: () => inet
  });
  module.exports = __toCommonJS2(inet_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgInetBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgInetBuilder";
    constructor(name) {
      super(name, "string", "PgInet");
    }
    build(table) {
      return new PgInet(table, this.config);
    }
  }

  class PgInet extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgInet";
    getSQLType() {
      return "inet";
    }
  }
  function inet(name) {
    return new PgInetBuilder(name);
  }
});

// node_modules/drizzle-orm/pg-core/columns/integer.cjs
var require_integer = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var integer_exports = {};
  __export2(integer_exports, {
    PgInteger: () => PgInteger,
    PgIntegerBuilder: () => PgIntegerBuilder,
    integer: () => integer
  });
  module.exports = __toCommonJS2(integer_exports);
  var import_entity = require_entity();
  var import_common = require_common();
  var import_int_common = require_int_common();

  class PgIntegerBuilder extends import_int_common.PgIntColumnBaseBuilder {
    static [import_entity.entityKind] = "PgIntegerBuilder";
    constructor(name) {
      super(name, "number", "PgInteger");
    }
    build(table) {
      return new PgInteger(table, this.config);
    }
  }

  class PgInteger extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgInteger";
    getSQLType() {
      return "integer";
    }
    mapFromDriverValue(value) {
      if (typeof value === "string") {
        return Number.parseInt(value);
      }
      return value;
    }
  }
  function integer(name) {
    return new PgIntegerBuilder(name);
  }
});

// node_modules/drizzle-orm/pg-core/columns/interval.cjs
var require_interval = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var interval_exports = {};
  __export2(interval_exports, {
    PgInterval: () => PgInterval,
    PgIntervalBuilder: () => PgIntervalBuilder,
    interval: () => interval
  });
  module.exports = __toCommonJS2(interval_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgIntervalBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgIntervalBuilder";
    constructor(name, intervalConfig) {
      super(name, "string", "PgInterval");
      this.config.intervalConfig = intervalConfig;
    }
    build(table) {
      return new PgInterval(table, this.config);
    }
  }

  class PgInterval extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgInterval";
    fields = this.config.intervalConfig.fields;
    precision = this.config.intervalConfig.precision;
    getSQLType() {
      const fields = this.fields ? ` ${this.fields}` : "";
      const precision = this.precision ? `(${this.precision})` : "";
      return `interval${fields}${precision}`;
    }
  }
  function interval(name, config = {}) {
    return new PgIntervalBuilder(name, config);
  }
});

// node_modules/drizzle-orm/pg-core/columns/json.cjs
var require_json = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var json_exports = {};
  __export2(json_exports, {
    PgJson: () => PgJson,
    PgJsonBuilder: () => PgJsonBuilder,
    json: () => json
  });
  module.exports = __toCommonJS2(json_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgJsonBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgJsonBuilder";
    constructor(name) {
      super(name, "json", "PgJson");
    }
    build(table) {
      return new PgJson(table, this.config);
    }
  }

  class PgJson extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgJson";
    constructor(table, config) {
      super(table, config);
    }
    getSQLType() {
      return "json";
    }
    mapToDriverValue(value) {
      return JSON.stringify(value);
    }
    mapFromDriverValue(value) {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return value;
    }
  }
  function json(name) {
    return new PgJsonBuilder(name);
  }
});

// node_modules/drizzle-orm/pg-core/columns/jsonb.cjs
var require_jsonb = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var jsonb_exports = {};
  __export2(jsonb_exports, {
    PgJsonb: () => PgJsonb,
    PgJsonbBuilder: () => PgJsonbBuilder,
    jsonb: () => jsonb
  });
  module.exports = __toCommonJS2(jsonb_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgJsonbBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgJsonbBuilder";
    constructor(name) {
      super(name, "json", "PgJsonb");
    }
    build(table) {
      return new PgJsonb(table, this.config);
    }
  }

  class PgJsonb extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgJsonb";
    constructor(table, config) {
      super(table, config);
    }
    getSQLType() {
      return "jsonb";
    }
    mapToDriverValue(value) {
      return JSON.stringify(value);
    }
    mapFromDriverValue(value) {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return value;
    }
  }
  function jsonb(name) {
    return new PgJsonbBuilder(name);
  }
});

// node_modules/drizzle-orm/pg-core/columns/line.cjs
var require_line = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var line_exports = {};
  __export2(line_exports, {
    PgLineABC: () => PgLineABC,
    PgLineABCBuilder: () => PgLineABCBuilder,
    PgLineBuilder: () => PgLineBuilder,
    PgLineTuple: () => PgLineTuple,
    line: () => line
  });
  module.exports = __toCommonJS2(line_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgLineBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgLineBuilder";
    constructor(name) {
      super(name, "array", "PgLine");
    }
    build(table) {
      return new PgLineTuple(table, this.config);
    }
  }

  class PgLineTuple extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgLine";
    getSQLType() {
      return "line";
    }
    mapFromDriverValue(value) {
      const [a, b, c] = value.slice(1, -1).split(",");
      return [Number.parseFloat(a), Number.parseFloat(b), Number.parseFloat(c)];
    }
    mapToDriverValue(value) {
      return `{${value[0]},${value[1]},${value[2]}}`;
    }
  }

  class PgLineABCBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgLineABCBuilder";
    constructor(name) {
      super(name, "json", "PgLineABC");
    }
    build(table) {
      return new PgLineABC(table, this.config);
    }
  }

  class PgLineABC extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgLineABC";
    getSQLType() {
      return "line";
    }
    mapFromDriverValue(value) {
      const [a, b, c] = value.slice(1, -1).split(",");
      return { a: Number.parseFloat(a), b: Number.parseFloat(b), c: Number.parseFloat(c) };
    }
    mapToDriverValue(value) {
      return `{${value.a},${value.b},${value.c}}`;
    }
  }
  function line(name, config) {
    if (!config?.mode || config.mode === "tuple") {
      return new PgLineBuilder(name);
    }
    return new PgLineABCBuilder(name);
  }
});

// node_modules/drizzle-orm/pg-core/columns/macaddr.cjs
var require_macaddr = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var macaddr_exports = {};
  __export2(macaddr_exports, {
    PgMacaddr: () => PgMacaddr,
    PgMacaddrBuilder: () => PgMacaddrBuilder,
    macaddr: () => macaddr
  });
  module.exports = __toCommonJS2(macaddr_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgMacaddrBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgMacaddrBuilder";
    constructor(name) {
      super(name, "string", "PgMacaddr");
    }
    build(table) {
      return new PgMacaddr(table, this.config);
    }
  }

  class PgMacaddr extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgMacaddr";
    getSQLType() {
      return "macaddr";
    }
  }
  function macaddr(name) {
    return new PgMacaddrBuilder(name);
  }
});

// node_modules/drizzle-orm/pg-core/columns/macaddr8.cjs
var require_macaddr8 = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var macaddr8_exports = {};
  __export2(macaddr8_exports, {
    PgMacaddr8: () => PgMacaddr8,
    PgMacaddr8Builder: () => PgMacaddr8Builder,
    macaddr8: () => macaddr8
  });
  module.exports = __toCommonJS2(macaddr8_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgMacaddr8Builder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgMacaddr8Builder";
    constructor(name) {
      super(name, "string", "PgMacaddr8");
    }
    build(table) {
      return new PgMacaddr8(table, this.config);
    }
  }

  class PgMacaddr8 extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgMacaddr8";
    getSQLType() {
      return "macaddr8";
    }
  }
  function macaddr8(name) {
    return new PgMacaddr8Builder(name);
  }
});

// node_modules/drizzle-orm/pg-core/columns/numeric.cjs
var require_numeric = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var numeric_exports = {};
  __export2(numeric_exports, {
    PgNumeric: () => PgNumeric,
    PgNumericBuilder: () => PgNumericBuilder,
    decimal: () => decimal,
    numeric: () => numeric
  });
  module.exports = __toCommonJS2(numeric_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgNumericBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgNumericBuilder";
    constructor(name, precision, scale) {
      super(name, "string", "PgNumeric");
      this.config.precision = precision;
      this.config.scale = scale;
    }
    build(table) {
      return new PgNumeric(table, this.config);
    }
  }

  class PgNumeric extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgNumeric";
    precision;
    scale;
    constructor(table, config) {
      super(table, config);
      this.precision = config.precision;
      this.scale = config.scale;
    }
    getSQLType() {
      if (this.precision !== undefined && this.scale !== undefined) {
        return `numeric(${this.precision}, ${this.scale})`;
      } else if (this.precision === undefined) {
        return "numeric";
      } else {
        return `numeric(${this.precision})`;
      }
    }
  }
  function numeric(name, config) {
    return new PgNumericBuilder(name, config?.precision, config?.scale);
  }
  var decimal = numeric;
});

// node_modules/drizzle-orm/pg-core/columns/point.cjs
var require_point = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var point_exports = {};
  __export2(point_exports, {
    PgPointObject: () => PgPointObject,
    PgPointObjectBuilder: () => PgPointObjectBuilder,
    PgPointTuple: () => PgPointTuple,
    PgPointTupleBuilder: () => PgPointTupleBuilder,
    point: () => point
  });
  module.exports = __toCommonJS2(point_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgPointTupleBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgPointTupleBuilder";
    constructor(name) {
      super(name, "array", "PgPointTuple");
    }
    build(table) {
      return new PgPointTuple(table, this.config);
    }
  }

  class PgPointTuple extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgPointTuple";
    getSQLType() {
      return "point";
    }
    mapFromDriverValue(value) {
      if (typeof value === "string") {
        const [x, y] = value.slice(1, -1).split(",");
        return [Number.parseFloat(x), Number.parseFloat(y)];
      }
      return [value.x, value.y];
    }
    mapToDriverValue(value) {
      return `(${value[0]},${value[1]})`;
    }
  }

  class PgPointObjectBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgPointObjectBuilder";
    constructor(name) {
      super(name, "json", "PgPointObject");
    }
    build(table) {
      return new PgPointObject(table, this.config);
    }
  }

  class PgPointObject extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgPointObject";
    getSQLType() {
      return "point";
    }
    mapFromDriverValue(value) {
      if (typeof value === "string") {
        const [x, y] = value.slice(1, -1).split(",");
        return { x: Number.parseFloat(x), y: Number.parseFloat(y) };
      }
      return value;
    }
    mapToDriverValue(value) {
      return `(${value.x},${value.y})`;
    }
  }
  function point(name, config) {
    if (!config?.mode || config.mode === "tuple") {
      return new PgPointTupleBuilder(name);
    }
    return new PgPointObjectBuilder(name);
  }
});

// node_modules/drizzle-orm/pg-core/columns/postgis_extension/utils.cjs
var require_utils = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var utils_exports = {};
  __export2(utils_exports, {
    parseEWKB: () => parseEWKB
  });
  module.exports = __toCommonJS2(utils_exports);
  function hexToBytes(hex) {
    const bytes = [];
    for (let c = 0;c < hex.length; c += 2) {
      bytes.push(Number.parseInt(hex.slice(c, c + 2), 16));
    }
    return new Uint8Array(bytes);
  }
  function bytesToFloat64(bytes, offset) {
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    for (let i = 0;i < 8; i++) {
      view.setUint8(i, bytes[offset + i]);
    }
    return view.getFloat64(0, true);
  }
  function parseEWKB(hex) {
    const bytes = hexToBytes(hex);
    let offset = 0;
    const byteOrder = bytes[offset];
    offset += 1;
    const view = new DataView(bytes.buffer);
    const geomType = view.getUint32(offset, byteOrder === 1);
    offset += 4;
    let _srid;
    if (geomType & 536870912) {
      _srid = view.getUint32(offset, byteOrder === 1);
      offset += 4;
    }
    if ((geomType & 65535) === 1) {
      const x = bytesToFloat64(bytes, offset);
      offset += 8;
      const y = bytesToFloat64(bytes, offset);
      offset += 8;
      return [x, y];
    }
    throw new Error("Unsupported geometry type");
  }
});

// node_modules/drizzle-orm/pg-core/columns/postgis_extension/geometry.cjs
var require_geometry = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var geometry_exports = {};
  __export2(geometry_exports, {
    PgGeometry: () => PgGeometry,
    PgGeometryBuilder: () => PgGeometryBuilder,
    PgGeometryObject: () => PgGeometryObject,
    PgGeometryObjectBuilder: () => PgGeometryObjectBuilder,
    geometry: () => geometry
  });
  module.exports = __toCommonJS2(geometry_exports);
  var import_entity = require_entity();
  var import_common = require_common();
  var import_utils = require_utils();

  class PgGeometryBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgGeometryBuilder";
    constructor(name) {
      super(name, "array", "PgGeometry");
    }
    build(table) {
      return new PgGeometry(table, this.config);
    }
  }

  class PgGeometry extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgGeometry";
    getSQLType() {
      return "geometry(point)";
    }
    mapFromDriverValue(value) {
      return (0, import_utils.parseEWKB)(value);
    }
    mapToDriverValue(value) {
      return `point(${value[0]} ${value[1]})`;
    }
  }

  class PgGeometryObjectBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgGeometryObjectBuilder";
    constructor(name) {
      super(name, "json", "PgGeometryObject");
    }
    build(table) {
      return new PgGeometryObject(table, this.config);
    }
  }

  class PgGeometryObject extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgGeometryObject";
    getSQLType() {
      return "geometry(point)";
    }
    mapFromDriverValue(value) {
      const parsed = (0, import_utils.parseEWKB)(value);
      return { x: parsed[0], y: parsed[1] };
    }
    mapToDriverValue(value) {
      return `point(${value.x} ${value.y})`;
    }
  }
  function geometry(name, config) {
    if (!config?.mode || config.mode === "tuple") {
      return new PgGeometryBuilder(name);
    }
    return new PgGeometryObjectBuilder(name);
  }
});

// node_modules/drizzle-orm/pg-core/columns/real.cjs
var require_real = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var real_exports = {};
  __export2(real_exports, {
    PgReal: () => PgReal,
    PgRealBuilder: () => PgRealBuilder,
    real: () => real
  });
  module.exports = __toCommonJS2(real_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgRealBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgRealBuilder";
    constructor(name, length) {
      super(name, "number", "PgReal");
      this.config.length = length;
    }
    build(table) {
      return new PgReal(table, this.config);
    }
  }

  class PgReal extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgReal";
    constructor(table, config) {
      super(table, config);
    }
    getSQLType() {
      return "real";
    }
    mapFromDriverValue = (value) => {
      if (typeof value === "string") {
        return Number.parseFloat(value);
      }
      return value;
    };
  }
  function real(name) {
    return new PgRealBuilder(name);
  }
});

// node_modules/drizzle-orm/pg-core/columns/serial.cjs
var require_serial = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var serial_exports = {};
  __export2(serial_exports, {
    PgSerial: () => PgSerial,
    PgSerialBuilder: () => PgSerialBuilder,
    serial: () => serial
  });
  module.exports = __toCommonJS2(serial_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgSerialBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgSerialBuilder";
    constructor(name) {
      super(name, "number", "PgSerial");
      this.config.hasDefault = true;
      this.config.notNull = true;
    }
    build(table) {
      return new PgSerial(table, this.config);
    }
  }

  class PgSerial extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgSerial";
    getSQLType() {
      return "serial";
    }
  }
  function serial(name) {
    return new PgSerialBuilder(name);
  }
});

// node_modules/drizzle-orm/pg-core/columns/smallint.cjs
var require_smallint = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var smallint_exports = {};
  __export2(smallint_exports, {
    PgSmallInt: () => PgSmallInt,
    PgSmallIntBuilder: () => PgSmallIntBuilder,
    smallint: () => smallint
  });
  module.exports = __toCommonJS2(smallint_exports);
  var import_entity = require_entity();
  var import_common = require_common();
  var import_int_common = require_int_common();

  class PgSmallIntBuilder extends import_int_common.PgIntColumnBaseBuilder {
    static [import_entity.entityKind] = "PgSmallIntBuilder";
    constructor(name) {
      super(name, "number", "PgSmallInt");
    }
    build(table) {
      return new PgSmallInt(table, this.config);
    }
  }

  class PgSmallInt extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgSmallInt";
    getSQLType() {
      return "smallint";
    }
    mapFromDriverValue = (value) => {
      if (typeof value === "string") {
        return Number(value);
      }
      return value;
    };
  }
  function smallint(name) {
    return new PgSmallIntBuilder(name);
  }
});

// node_modules/drizzle-orm/pg-core/columns/smallserial.cjs
var require_smallserial = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var smallserial_exports = {};
  __export2(smallserial_exports, {
    PgSmallSerial: () => PgSmallSerial,
    PgSmallSerialBuilder: () => PgSmallSerialBuilder,
    smallserial: () => smallserial
  });
  module.exports = __toCommonJS2(smallserial_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgSmallSerialBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgSmallSerialBuilder";
    constructor(name) {
      super(name, "number", "PgSmallSerial");
      this.config.hasDefault = true;
      this.config.notNull = true;
    }
    build(table) {
      return new PgSmallSerial(table, this.config);
    }
  }

  class PgSmallSerial extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgSmallSerial";
    getSQLType() {
      return "smallserial";
    }
  }
  function smallserial(name) {
    return new PgSmallSerialBuilder(name);
  }
});

// node_modules/drizzle-orm/pg-core/columns/text.cjs
var require_text = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var text_exports = {};
  __export2(text_exports, {
    PgText: () => PgText,
    PgTextBuilder: () => PgTextBuilder,
    text: () => text
  });
  module.exports = __toCommonJS2(text_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgTextBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgTextBuilder";
    constructor(name, config) {
      super(name, "string", "PgText");
      this.config.enumValues = config.enum;
    }
    build(table) {
      return new PgText(table, this.config);
    }
  }

  class PgText extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgText";
    enumValues = this.config.enumValues;
    getSQLType() {
      return "text";
    }
  }
  function text(name, config = {}) {
    return new PgTextBuilder(name, config);
  }
});

// node_modules/drizzle-orm/pg-core/columns/time.cjs
var require_time = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var time_exports = {};
  __export2(time_exports, {
    PgTime: () => PgTime,
    PgTimeBuilder: () => PgTimeBuilder,
    time: () => time
  });
  module.exports = __toCommonJS2(time_exports);
  var import_entity = require_entity();
  var import_common = require_common();
  var import_date_common = require_date_common();

  class PgTimeBuilder extends import_date_common.PgDateColumnBaseBuilder {
    constructor(name, withTimezone, precision) {
      super(name, "string", "PgTime");
      this.withTimezone = withTimezone;
      this.precision = precision;
      this.config.withTimezone = withTimezone;
      this.config.precision = precision;
    }
    static [import_entity.entityKind] = "PgTimeBuilder";
    build(table) {
      return new PgTime(table, this.config);
    }
  }

  class PgTime extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgTime";
    withTimezone;
    precision;
    constructor(table, config) {
      super(table, config);
      this.withTimezone = config.withTimezone;
      this.precision = config.precision;
    }
    getSQLType() {
      const precision = this.precision === undefined ? "" : `(${this.precision})`;
      return `time${precision}${this.withTimezone ? " with time zone" : ""}`;
    }
  }
  function time(name, config = {}) {
    return new PgTimeBuilder(name, config.withTimezone ?? false, config.precision);
  }
});

// node_modules/drizzle-orm/pg-core/columns/timestamp.cjs
var require_timestamp = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var timestamp_exports = {};
  __export2(timestamp_exports, {
    PgTimestamp: () => PgTimestamp,
    PgTimestampBuilder: () => PgTimestampBuilder,
    PgTimestampString: () => PgTimestampString,
    PgTimestampStringBuilder: () => PgTimestampStringBuilder,
    timestamp: () => timestamp
  });
  module.exports = __toCommonJS2(timestamp_exports);
  var import_entity = require_entity();
  var import_common = require_common();
  var import_date_common = require_date_common();

  class PgTimestampBuilder extends import_date_common.PgDateColumnBaseBuilder {
    static [import_entity.entityKind] = "PgTimestampBuilder";
    constructor(name, withTimezone, precision) {
      super(name, "date", "PgTimestamp");
      this.config.withTimezone = withTimezone;
      this.config.precision = precision;
    }
    build(table) {
      return new PgTimestamp(table, this.config);
    }
  }

  class PgTimestamp extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgTimestamp";
    withTimezone;
    precision;
    constructor(table, config) {
      super(table, config);
      this.withTimezone = config.withTimezone;
      this.precision = config.precision;
    }
    getSQLType() {
      const precision = this.precision === undefined ? "" : ` (${this.precision})`;
      return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
    }
    mapFromDriverValue = (value) => {
      return new Date(this.withTimezone ? value : value + "+0000");
    };
    mapToDriverValue = (value) => {
      return value.toISOString();
    };
  }

  class PgTimestampStringBuilder extends import_date_common.PgDateColumnBaseBuilder {
    static [import_entity.entityKind] = "PgTimestampStringBuilder";
    constructor(name, withTimezone, precision) {
      super(name, "string", "PgTimestampString");
      this.config.withTimezone = withTimezone;
      this.config.precision = precision;
    }
    build(table) {
      return new PgTimestampString(table, this.config);
    }
  }

  class PgTimestampString extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgTimestampString";
    withTimezone;
    precision;
    constructor(table, config) {
      super(table, config);
      this.withTimezone = config.withTimezone;
      this.precision = config.precision;
    }
    getSQLType() {
      const precision = this.precision === undefined ? "" : `(${this.precision})`;
      return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
    }
  }
  function timestamp(name, config = {}) {
    if (config.mode === "string") {
      return new PgTimestampStringBuilder(name, config.withTimezone ?? false, config.precision);
    }
    return new PgTimestampBuilder(name, config.withTimezone ?? false, config.precision);
  }
});

// node_modules/drizzle-orm/pg-core/columns/uuid.cjs
var require_uuid = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var uuid_exports = {};
  __export2(uuid_exports, {
    PgUUID: () => PgUUID,
    PgUUIDBuilder: () => PgUUIDBuilder,
    uuid: () => uuid
  });
  module.exports = __toCommonJS2(uuid_exports);
  var import_entity = require_entity();
  var import_sql = require_sql();
  var import_common = require_common();

  class PgUUIDBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgUUIDBuilder";
    constructor(name) {
      super(name, "string", "PgUUID");
    }
    defaultRandom() {
      return this.default(import_sql.sql`gen_random_uuid()`);
    }
    build(table) {
      return new PgUUID(table, this.config);
    }
  }

  class PgUUID extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgUUID";
    getSQLType() {
      return "uuid";
    }
  }
  function uuid(name) {
    return new PgUUIDBuilder(name);
  }
});

// node_modules/drizzle-orm/pg-core/columns/varchar.cjs
var require_varchar = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var varchar_exports = {};
  __export2(varchar_exports, {
    PgVarchar: () => PgVarchar,
    PgVarcharBuilder: () => PgVarcharBuilder,
    varchar: () => varchar
  });
  module.exports = __toCommonJS2(varchar_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgVarcharBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgVarcharBuilder";
    constructor(name, config) {
      super(name, "string", "PgVarchar");
      this.config.length = config.length;
      this.config.enumValues = config.enum;
    }
    build(table) {
      return new PgVarchar(table, this.config);
    }
  }

  class PgVarchar extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgVarchar";
    length = this.config.length;
    enumValues = this.config.enumValues;
    getSQLType() {
      return this.length === undefined ? `varchar` : `varchar(${this.length})`;
    }
  }
  function varchar(name, config = {}) {
    return new PgVarcharBuilder(name, config);
  }
});

// node_modules/drizzle-orm/pg-core/columns/vector_extension/bit.cjs
var require_bit = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var bit_exports = {};
  __export2(bit_exports, {
    PgBinaryVector: () => PgBinaryVector,
    PgBinaryVectorBuilder: () => PgBinaryVectorBuilder,
    bit: () => bit
  });
  module.exports = __toCommonJS2(bit_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgBinaryVectorBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgBinaryVectorBuilder";
    constructor(name, config) {
      super(name, "string", "PgBinaryVector");
      this.config.dimensions = config.dimensions;
    }
    build(table) {
      return new PgBinaryVector(table, this.config);
    }
  }

  class PgBinaryVector extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgBinaryVector";
    dimensions = this.config.dimensions;
    getSQLType() {
      return `bit(${this.dimensions})`;
    }
  }
  function bit(name, config) {
    return new PgBinaryVectorBuilder(name, config);
  }
});

// node_modules/drizzle-orm/pg-core/columns/vector_extension/halfvec.cjs
var require_halfvec = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var halfvec_exports = {};
  __export2(halfvec_exports, {
    PgHalfVector: () => PgHalfVector,
    PgHalfVectorBuilder: () => PgHalfVectorBuilder,
    halfvec: () => halfvec
  });
  module.exports = __toCommonJS2(halfvec_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgHalfVectorBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgHalfVectorBuilder";
    constructor(name, config) {
      super(name, "array", "PgHalfVector");
      this.config.dimensions = config.dimensions;
    }
    build(table) {
      return new PgHalfVector(table, this.config);
    }
  }

  class PgHalfVector extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgHalfVector";
    dimensions = this.config.dimensions;
    getSQLType() {
      return `halfvec(${this.dimensions})`;
    }
    mapToDriverValue(value) {
      return JSON.stringify(value);
    }
    mapFromDriverValue(value) {
      return value.slice(1, -1).split(",").map((v) => Number.parseFloat(v));
    }
  }
  function halfvec(name, config) {
    return new PgHalfVectorBuilder(name, config);
  }
});

// node_modules/drizzle-orm/pg-core/columns/vector_extension/sparsevec.cjs
var require_sparsevec = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var sparsevec_exports = {};
  __export2(sparsevec_exports, {
    PgSparseVector: () => PgSparseVector,
    PgSparseVectorBuilder: () => PgSparseVectorBuilder,
    sparsevec: () => sparsevec
  });
  module.exports = __toCommonJS2(sparsevec_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgSparseVectorBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgSparseVectorBuilder";
    constructor(name, config) {
      super(name, "string", "PgSparseVector");
      this.config.dimensions = config.dimensions;
    }
    build(table) {
      return new PgSparseVector(table, this.config);
    }
  }

  class PgSparseVector extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgSparseVector";
    dimensions = this.config.dimensions;
    getSQLType() {
      return `sparsevec(${this.dimensions})`;
    }
  }
  function sparsevec(name, config) {
    return new PgSparseVectorBuilder(name, config);
  }
});

// node_modules/drizzle-orm/pg-core/columns/vector_extension/vector.cjs
var require_vector = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var vector_exports = {};
  __export2(vector_exports, {
    PgVector: () => PgVector,
    PgVectorBuilder: () => PgVectorBuilder,
    vector: () => vector
  });
  module.exports = __toCommonJS2(vector_exports);
  var import_entity = require_entity();
  var import_common = require_common();

  class PgVectorBuilder extends import_common.PgColumnBuilder {
    static [import_entity.entityKind] = "PgVectorBuilder";
    constructor(name, config) {
      super(name, "array", "PgVector");
      this.config.dimensions = config.dimensions;
    }
    build(table) {
      return new PgVector(table, this.config);
    }
  }

  class PgVector extends import_common.PgColumn {
    static [import_entity.entityKind] = "PgVector";
    dimensions = this.config.dimensions;
    getSQLType() {
      return `vector(${this.dimensions})`;
    }
    mapToDriverValue(value) {
      return JSON.stringify(value);
    }
    mapFromDriverValue(value) {
      return value.slice(1, -1).split(",").map((v) => Number.parseFloat(v));
    }
  }
  function vector(name, config) {
    return new PgVectorBuilder(name, config);
  }
});

// node_modules/drizzle-orm/pg-core/columns/index.cjs
var require_columns = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var columns_exports = {};
  module.exports = __toCommonJS2(columns_exports);
  __reExport(columns_exports, require_bigint(), module.exports);
  __reExport(columns_exports, require_bigserial(), module.exports);
  __reExport(columns_exports, require_boolean(), module.exports);
  __reExport(columns_exports, require_char(), module.exports);
  __reExport(columns_exports, require_cidr(), module.exports);
  __reExport(columns_exports, require_common(), module.exports);
  __reExport(columns_exports, require_custom(), module.exports);
  __reExport(columns_exports, require_date(), module.exports);
  __reExport(columns_exports, require_double_precision(), module.exports);
  __reExport(columns_exports, require_enum(), module.exports);
  __reExport(columns_exports, require_inet(), module.exports);
  __reExport(columns_exports, require_integer(), module.exports);
  __reExport(columns_exports, require_interval(), module.exports);
  __reExport(columns_exports, require_json(), module.exports);
  __reExport(columns_exports, require_jsonb(), module.exports);
  __reExport(columns_exports, require_line(), module.exports);
  __reExport(columns_exports, require_macaddr(), module.exports);
  __reExport(columns_exports, require_macaddr8(), module.exports);
  __reExport(columns_exports, require_numeric(), module.exports);
  __reExport(columns_exports, require_point(), module.exports);
  __reExport(columns_exports, require_geometry(), module.exports);
  __reExport(columns_exports, require_real(), module.exports);
  __reExport(columns_exports, require_serial(), module.exports);
  __reExport(columns_exports, require_smallint(), module.exports);
  __reExport(columns_exports, require_smallserial(), module.exports);
  __reExport(columns_exports, require_text(), module.exports);
  __reExport(columns_exports, require_time(), module.exports);
  __reExport(columns_exports, require_timestamp(), module.exports);
  __reExport(columns_exports, require_uuid(), module.exports);
  __reExport(columns_exports, require_varchar(), module.exports);
  __reExport(columns_exports, require_bit(), module.exports);
  __reExport(columns_exports, require_halfvec(), module.exports);
  __reExport(columns_exports, require_sparsevec(), module.exports);
  __reExport(columns_exports, require_vector(), module.exports);
});

// node_modules/drizzle-orm/query-promise.cjs
var require_query_promise = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var query_promise_exports = {};
  __export2(query_promise_exports, {
    QueryPromise: () => QueryPromise
  });
  module.exports = __toCommonJS2(query_promise_exports);
  var import_entity = require_entity();

  class QueryPromise {
    static [import_entity.entityKind] = "QueryPromise";
    [Symbol.toStringTag] = "QueryPromise";
    catch(onRejected) {
      return this.then(undefined, onRejected);
    }
    finally(onFinally) {
      return this.then((value) => {
        onFinally?.();
        return value;
      }, (reason) => {
        onFinally?.();
        throw reason;
      });
    }
    then(onFulfilled, onRejected) {
      return this.execute().then(onFulfilled, onRejected);
    }
  }
});

// node_modules/drizzle-orm/utils.cjs
var require_utils2 = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var utils_exports = {};
  __export2(utils_exports, {
    applyMixins: () => applyMixins,
    getTableColumns: () => getTableColumns,
    getTableLikeName: () => getTableLikeName,
    haveSameKeys: () => haveSameKeys,
    mapResultRow: () => mapResultRow,
    mapUpdateSet: () => mapUpdateSet,
    orderSelectedFields: () => orderSelectedFields
  });
  module.exports = __toCommonJS2(utils_exports);
  var import_column = require_column();
  var import_entity = require_entity();
  var import_sql = require_sql();
  var import_subquery = require_subquery();
  var import_table = require_table();
  var import_view_common = require_view_common();
  function mapResultRow(columns, row, joinsNotNullableMap) {
    const nullifyMap = {};
    const result = columns.reduce((result2, { path, field }, columnIndex) => {
      let decoder;
      if ((0, import_entity.is)(field, import_column.Column)) {
        decoder = field;
      } else if ((0, import_entity.is)(field, import_sql.SQL)) {
        decoder = field.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      let node = result2;
      for (const [pathChunkIndex, pathChunk] of path.entries()) {
        if (pathChunkIndex < path.length - 1) {
          if (!(pathChunk in node)) {
            node[pathChunk] = {};
          }
          node = node[pathChunk];
        } else {
          const rawValue = row[columnIndex];
          const value = node[pathChunk] = rawValue === null ? null : decoder.mapFromDriverValue(rawValue);
          if (joinsNotNullableMap && (0, import_entity.is)(field, import_column.Column) && path.length === 2) {
            const objectName = path[0];
            if (!(objectName in nullifyMap)) {
              nullifyMap[objectName] = value === null ? (0, import_table.getTableName)(field.table) : false;
            } else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== (0, import_table.getTableName)(field.table)) {
              nullifyMap[objectName] = false;
            }
          }
        }
      }
      return result2;
    }, {});
    if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
      for (const [objectName, tableName] of Object.entries(nullifyMap)) {
        if (typeof tableName === "string" && !joinsNotNullableMap[tableName]) {
          result[objectName] = null;
        }
      }
    }
    return result;
  }
  function orderSelectedFields(fields, pathPrefix) {
    return Object.entries(fields).reduce((result, [name, field]) => {
      if (typeof name !== "string") {
        return result;
      }
      const newPath = pathPrefix ? [...pathPrefix, name] : [name];
      if ((0, import_entity.is)(field, import_column.Column) || (0, import_entity.is)(field, import_sql.SQL) || (0, import_entity.is)(field, import_sql.SQL.Aliased)) {
        result.push({ path: newPath, field });
      } else if ((0, import_entity.is)(field, import_table.Table)) {
        result.push(...orderSelectedFields(field[import_table.Table.Symbol.Columns], newPath));
      } else {
        result.push(...orderSelectedFields(field, newPath));
      }
      return result;
    }, []);
  }
  function haveSameKeys(left, right) {
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    if (leftKeys.length !== rightKeys.length) {
      return false;
    }
    for (const [index, key] of leftKeys.entries()) {
      if (key !== rightKeys[index]) {
        return false;
      }
    }
    return true;
  }
  function mapUpdateSet(table, values) {
    const entries = Object.entries(values).filter(([, value]) => value !== undefined).map(([key, value]) => {
      if ((0, import_entity.is)(value, import_sql.SQL)) {
        return [key, value];
      } else {
        return [key, new import_sql.Param(value, table[import_table.Table.Symbol.Columns][key])];
      }
    });
    if (entries.length === 0) {
      throw new Error("No values to set");
    }
    return Object.fromEntries(entries);
  }
  function applyMixins(baseClass, extendedClasses) {
    for (const extendedClass of extendedClasses) {
      for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
        if (name === "constructor")
          continue;
        Object.defineProperty(baseClass.prototype, name, Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || /* @__PURE__ */ Object.create(null));
      }
    }
  }
  function getTableColumns(table) {
    return table[import_table.Table.Symbol.Columns];
  }
  function getTableLikeName(table) {
    return (0, import_entity.is)(table, import_subquery.Subquery) ? table._.alias : (0, import_entity.is)(table, import_sql.View) ? table[import_view_common.ViewBaseConfig].name : (0, import_entity.is)(table, import_sql.SQL) ? undefined : table[import_table.Table.Symbol.IsAlias] ? table[import_table.Table.Symbol.Name] : table[import_table.Table.Symbol.BaseName];
  }
});

// node_modules/drizzle-orm/pg-core/query-builders/delete.cjs
var require_delete = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var delete_exports = {};
  __export2(delete_exports, {
    PgDeleteBase: () => PgDeleteBase
  });
  module.exports = __toCommonJS2(delete_exports);
  var import_entity = require_entity();
  var import_query_promise = require_query_promise();
  var import_table = require_table();
  var import_tracing = require_tracing();
  var import_utils = require_utils2();

  class PgDeleteBase extends import_query_promise.QueryPromise {
    constructor(table, session, dialect, withList) {
      super();
      this.session = session;
      this.dialect = dialect;
      this.config = { table, withList };
    }
    static [import_entity.entityKind] = "PgDelete";
    config;
    where(where) {
      this.config.where = where;
      return this;
    }
    returning(fields = this.config.table[import_table.Table.Symbol.Columns]) {
      this.config.returning = (0, import_utils.orderSelectedFields)(fields);
      return this;
    }
    getSQL() {
      return this.dialect.buildDeleteQuery(this.config);
    }
    toSQL() {
      const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
      return rest;
    }
    _prepare(name) {
      return import_tracing.tracer.startActiveSpan("drizzle.prepareQuery", () => {
        return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true);
      });
    }
    prepare(name) {
      return this._prepare(name);
    }
    execute = (placeholderValues) => {
      return import_tracing.tracer.startActiveSpan("drizzle.operation", () => {
        return this._prepare().execute(placeholderValues);
      });
    };
    $dynamic() {
      return this;
    }
  }
});

// node_modules/drizzle-orm/pg-core/query-builders/insert.cjs
var require_insert = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var insert_exports = {};
  __export2(insert_exports, {
    PgInsertBase: () => PgInsertBase,
    PgInsertBuilder: () => PgInsertBuilder
  });
  module.exports = __toCommonJS2(insert_exports);
  var import_entity = require_entity();
  var import_query_promise = require_query_promise();
  var import_sql = require_sql();
  var import_table = require_table();
  var import_tracing = require_tracing();
  var import_utils = require_utils2();

  class PgInsertBuilder {
    constructor(table, session, dialect, withList) {
      this.table = table;
      this.session = session;
      this.dialect = dialect;
      this.withList = withList;
    }
    static [import_entity.entityKind] = "PgInsertBuilder";
    values(values) {
      values = Array.isArray(values) ? values : [values];
      if (values.length === 0) {
        throw new Error("values() must be called with at least one value");
      }
      const mappedValues = values.map((entry) => {
        const result = {};
        const cols = this.table[import_table.Table.Symbol.Columns];
        for (const colKey of Object.keys(entry)) {
          const colValue = entry[colKey];
          result[colKey] = (0, import_entity.is)(colValue, import_sql.SQL) ? colValue : new import_sql.Param(colValue, cols[colKey]);
        }
        return result;
      });
      return new PgInsertBase(this.table, mappedValues, this.session, this.dialect, this.withList);
    }
  }

  class PgInsertBase extends import_query_promise.QueryPromise {
    constructor(table, values, session, dialect, withList) {
      super();
      this.session = session;
      this.dialect = dialect;
      this.config = { table, values, withList };
    }
    static [import_entity.entityKind] = "PgInsert";
    config;
    returning(fields = this.config.table[import_table.Table.Symbol.Columns]) {
      this.config.returning = (0, import_utils.orderSelectedFields)(fields);
      return this;
    }
    onConflictDoNothing(config = {}) {
      if (config.target === undefined) {
        this.config.onConflict = import_sql.sql`do nothing`;
      } else {
        let targetColumn = "";
        targetColumn = Array.isArray(config.target) ? config.target.map((it) => this.dialect.escapeName(it.name)).join(",") : this.dialect.escapeName(config.target.name);
        const whereSql = config.where ? import_sql.sql` where ${config.where}` : undefined;
        this.config.onConflict = import_sql.sql`(${import_sql.sql.raw(targetColumn)})${whereSql} do nothing`;
      }
      return this;
    }
    onConflictDoUpdate(config) {
      if (config.where && (config.targetWhere || config.setWhere)) {
        throw new Error('You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.');
      }
      const whereSql = config.where ? import_sql.sql` where ${config.where}` : undefined;
      const targetWhereSql = config.targetWhere ? import_sql.sql` where ${config.targetWhere}` : undefined;
      const setWhereSql = config.setWhere ? import_sql.sql` where ${config.setWhere}` : undefined;
      const setSql = this.dialect.buildUpdateSet(this.config.table, (0, import_utils.mapUpdateSet)(this.config.table, config.set));
      let targetColumn = "";
      targetColumn = Array.isArray(config.target) ? config.target.map((it) => this.dialect.escapeName(it.name)).join(",") : this.dialect.escapeName(config.target.name);
      this.config.onConflict = import_sql.sql`(${import_sql.sql.raw(targetColumn)})${targetWhereSql} do update set ${setSql}${whereSql}${setWhereSql}`;
      return this;
    }
    getSQL() {
      return this.dialect.buildInsertQuery(this.config);
    }
    toSQL() {
      const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
      return rest;
    }
    _prepare(name) {
      return import_tracing.tracer.startActiveSpan("drizzle.prepareQuery", () => {
        return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true);
      });
    }
    prepare(name) {
      return this._prepare(name);
    }
    execute = (placeholderValues) => {
      return import_tracing.tracer.startActiveSpan("drizzle.operation", () => {
        return this._prepare().execute(placeholderValues);
      });
    };
    $dynamic() {
      return this;
    }
  }
});

// node_modules/drizzle-orm/errors.cjs
var require_errors = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var errors_exports = {};
  __export2(errors_exports, {
    DrizzleError: () => DrizzleError,
    TransactionRollbackError: () => TransactionRollbackError
  });
  module.exports = __toCommonJS2(errors_exports);
  var import_entity = require_entity();

  class DrizzleError extends Error {
    static [import_entity.entityKind] = "DrizzleError";
    constructor({ message, cause }) {
      super(message);
      this.name = "DrizzleError";
      this.cause = cause;
    }
  }

  class TransactionRollbackError extends DrizzleError {
    static [import_entity.entityKind] = "TransactionRollbackError";
    constructor() {
      super({ message: "Rollback" });
    }
  }
});

// node_modules/drizzle-orm/pg-core/primary-keys.cjs
var require_primary_keys = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var primary_keys_exports = {};
  __export2(primary_keys_exports, {
    PrimaryKey: () => PrimaryKey,
    PrimaryKeyBuilder: () => PrimaryKeyBuilder,
    primaryKey: () => primaryKey
  });
  module.exports = __toCommonJS2(primary_keys_exports);
  var import_entity = require_entity();
  var import_table = require_table2();
  function primaryKey(...config) {
    if (config[0].columns) {
      return new PrimaryKeyBuilder(config[0].columns, config[0].name);
    }
    return new PrimaryKeyBuilder(config);
  }

  class PrimaryKeyBuilder {
    static [import_entity.entityKind] = "PgPrimaryKeyBuilder";
    columns;
    name;
    constructor(columns, name) {
      this.columns = columns;
      this.name = name;
    }
    build(table) {
      return new PrimaryKey(table, this.columns, this.name);
    }
  }

  class PrimaryKey {
    constructor(table, columns, name) {
      this.table = table;
      this.columns = columns;
      this.name = name;
    }
    static [import_entity.entityKind] = "PgPrimaryKey";
    columns;
    name;
    getName() {
      return this.name ?? `${this.table[import_table.PgTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
    }
  }
});

// node_modules/drizzle-orm/sql/expressions/conditions.cjs
var require_conditions = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var conditions_exports = {};
  __export2(conditions_exports, {
    and: () => and,
    arrayContained: () => arrayContained,
    arrayContains: () => arrayContains,
    arrayOverlaps: () => arrayOverlaps,
    between: () => between,
    bindIfParam: () => bindIfParam,
    eq: () => eq,
    exists: () => exists,
    gt: () => gt,
    gte: () => gte,
    ilike: () => ilike,
    inArray: () => inArray,
    isNotNull: () => isNotNull,
    isNull: () => isNull,
    like: () => like,
    lt: () => lt,
    lte: () => lte,
    ne: () => ne,
    not: () => not,
    notBetween: () => notBetween,
    notExists: () => notExists,
    notIlike: () => notIlike,
    notInArray: () => notInArray,
    notLike: () => notLike,
    or: () => or
  });
  module.exports = __toCommonJS2(conditions_exports);
  var import_column = require_column();
  var import_entity = require_entity();
  var import_table = require_table();
  var import_sql = require_sql();
  function bindIfParam(value, column) {
    if ((0, import_sql.isDriverValueEncoder)(column) && !(0, import_sql.isSQLWrapper)(value) && !(0, import_entity.is)(value, import_sql.Param) && !(0, import_entity.is)(value, import_sql.Placeholder) && !(0, import_entity.is)(value, import_column.Column) && !(0, import_entity.is)(value, import_table.Table) && !(0, import_entity.is)(value, import_sql.View)) {
      return new import_sql.Param(value, column);
    }
    return value;
  }
  var eq = (left, right) => {
    return import_sql.sql`${left} = ${bindIfParam(right, left)}`;
  };
  var ne = (left, right) => {
    return import_sql.sql`${left} <> ${bindIfParam(right, left)}`;
  };
  function and(...unfilteredConditions) {
    const conditions = unfilteredConditions.filter((c) => c !== undefined);
    if (conditions.length === 0) {
      return;
    }
    if (conditions.length === 1) {
      return new import_sql.SQL(conditions);
    }
    return new import_sql.SQL([
      new import_sql.StringChunk("("),
      import_sql.sql.join(conditions, new import_sql.StringChunk(" and ")),
      new import_sql.StringChunk(")")
    ]);
  }
  function or(...unfilteredConditions) {
    const conditions = unfilteredConditions.filter((c) => c !== undefined);
    if (conditions.length === 0) {
      return;
    }
    if (conditions.length === 1) {
      return new import_sql.SQL(conditions);
    }
    return new import_sql.SQL([
      new import_sql.StringChunk("("),
      import_sql.sql.join(conditions, new import_sql.StringChunk(" or ")),
      new import_sql.StringChunk(")")
    ]);
  }
  function not(condition) {
    return import_sql.sql`not ${condition}`;
  }
  var gt = (left, right) => {
    return import_sql.sql`${left} > ${bindIfParam(right, left)}`;
  };
  var gte = (left, right) => {
    return import_sql.sql`${left} >= ${bindIfParam(right, left)}`;
  };
  var lt = (left, right) => {
    return import_sql.sql`${left} < ${bindIfParam(right, left)}`;
  };
  var lte = (left, right) => {
    return import_sql.sql`${left} <= ${bindIfParam(right, left)}`;
  };
  function inArray(column, values) {
    if (Array.isArray(values)) {
      if (values.length === 0) {
        throw new Error("inArray requires at least one value");
      }
      return import_sql.sql`${column} in ${values.map((v) => bindIfParam(v, column))}`;
    }
    return import_sql.sql`${column} in ${bindIfParam(values, column)}`;
  }
  function notInArray(column, values) {
    if (Array.isArray(values)) {
      if (values.length === 0) {
        throw new Error("notInArray requires at least one value");
      }
      return import_sql.sql`${column} not in ${values.map((v) => bindIfParam(v, column))}`;
    }
    return import_sql.sql`${column} not in ${bindIfParam(values, column)}`;
  }
  function isNull(value) {
    return import_sql.sql`${value} is null`;
  }
  function isNotNull(value) {
    return import_sql.sql`${value} is not null`;
  }
  function exists(subquery) {
    return import_sql.sql`exists ${subquery}`;
  }
  function notExists(subquery) {
    return import_sql.sql`not exists ${subquery}`;
  }
  function between(column, min, max) {
    return import_sql.sql`${column} between ${bindIfParam(min, column)} and ${bindIfParam(max, column)}`;
  }
  function notBetween(column, min, max) {
    return import_sql.sql`${column} not between ${bindIfParam(min, column)} and ${bindIfParam(max, column)}`;
  }
  function like(column, value) {
    return import_sql.sql`${column} like ${value}`;
  }
  function notLike(column, value) {
    return import_sql.sql`${column} not like ${value}`;
  }
  function ilike(column, value) {
    return import_sql.sql`${column} ilike ${value}`;
  }
  function notIlike(column, value) {
    return import_sql.sql`${column} not ilike ${value}`;
  }
  function arrayContains(column, values) {
    if (Array.isArray(values)) {
      if (values.length === 0) {
        throw new Error("arrayContains requires at least one value");
      }
      const array = import_sql.sql`${bindIfParam(values, column)}`;
      return import_sql.sql`${column} @> ${array}`;
    }
    return import_sql.sql`${column} @> ${bindIfParam(values, column)}`;
  }
  function arrayContained(column, values) {
    if (Array.isArray(values)) {
      if (values.length === 0) {
        throw new Error("arrayContained requires at least one value");
      }
      const array = import_sql.sql`${bindIfParam(values, column)}`;
      return import_sql.sql`${column} <@ ${array}`;
    }
    return import_sql.sql`${column} <@ ${bindIfParam(values, column)}`;
  }
  function arrayOverlaps(column, values) {
    if (Array.isArray(values)) {
      if (values.length === 0) {
        throw new Error("arrayOverlaps requires at least one value");
      }
      const array = import_sql.sql`${bindIfParam(values, column)}`;
      return import_sql.sql`${column} && ${array}`;
    }
    return import_sql.sql`${column} && ${bindIfParam(values, column)}`;
  }
});

// node_modules/drizzle-orm/sql/expressions/select.cjs
var require_select = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc2) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var select_exports = {};
  __export2(select_exports, {
    asc: () => asc,
    desc: () => desc
  });
  module.exports = __toCommonJS2(select_exports);
  var import_sql = require_sql();
  function asc(column) {
    return import_sql.sql`${column} asc`;
  }
  function desc(column) {
    return import_sql.sql`${column} desc`;
  }
});

// node_modules/drizzle-orm/sql/expressions/index.cjs
var require_expressions = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var expressions_exports = {};
  module.exports = __toCommonJS2(expressions_exports);
  __reExport(expressions_exports, require_conditions(), module.exports);
  __reExport(expressions_exports, require_select(), module.exports);
});

// node_modules/drizzle-orm/relations.cjs
var require_relations = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc2) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var relations_exports = {};
  __export2(relations_exports, {
    Many: () => Many,
    One: () => One,
    Relation: () => Relation,
    Relations: () => Relations,
    createMany: () => createMany,
    createOne: () => createOne,
    createTableRelationsHelpers: () => createTableRelationsHelpers,
    extractTablesRelationalConfig: () => extractTablesRelationalConfig,
    getOperators: () => getOperators,
    getOrderByOperators: () => getOrderByOperators,
    mapRelationalRow: () => mapRelationalRow,
    normalizeRelation: () => normalizeRelation,
    relations: () => relations
  });
  module.exports = __toCommonJS2(relations_exports);
  var import_table = require_table();
  var import_column = require_column();
  var import_entity = require_entity();
  var import_primary_keys = require_primary_keys();
  var import_expressions = require_expressions();
  var import_sql = require_sql();

  class Relation {
    constructor(sourceTable, referencedTable, relationName) {
      this.sourceTable = sourceTable;
      this.referencedTable = referencedTable;
      this.relationName = relationName;
      this.referencedTableName = referencedTable[import_table.Table.Symbol.Name];
    }
    static [import_entity.entityKind] = "Relation";
    referencedTableName;
    fieldName;
  }

  class Relations {
    constructor(table, config) {
      this.table = table;
      this.config = config;
    }
    static [import_entity.entityKind] = "Relations";
  }

  class One extends Relation {
    constructor(sourceTable, referencedTable, config, isNullable) {
      super(sourceTable, referencedTable, config?.relationName);
      this.config = config;
      this.isNullable = isNullable;
    }
    static [import_entity.entityKind] = "One";
    withFieldName(fieldName) {
      const relation = new One(this.sourceTable, this.referencedTable, this.config, this.isNullable);
      relation.fieldName = fieldName;
      return relation;
    }
  }

  class Many extends Relation {
    constructor(sourceTable, referencedTable, config) {
      super(sourceTable, referencedTable, config?.relationName);
      this.config = config;
    }
    static [import_entity.entityKind] = "Many";
    withFieldName(fieldName) {
      const relation = new Many(this.sourceTable, this.referencedTable, this.config);
      relation.fieldName = fieldName;
      return relation;
    }
  }
  function getOperators() {
    return {
      and: import_expressions.and,
      between: import_expressions.between,
      eq: import_expressions.eq,
      exists: import_expressions.exists,
      gt: import_expressions.gt,
      gte: import_expressions.gte,
      ilike: import_expressions.ilike,
      inArray: import_expressions.inArray,
      isNull: import_expressions.isNull,
      isNotNull: import_expressions.isNotNull,
      like: import_expressions.like,
      lt: import_expressions.lt,
      lte: import_expressions.lte,
      ne: import_expressions.ne,
      not: import_expressions.not,
      notBetween: import_expressions.notBetween,
      notExists: import_expressions.notExists,
      notLike: import_expressions.notLike,
      notIlike: import_expressions.notIlike,
      notInArray: import_expressions.notInArray,
      or: import_expressions.or,
      sql: import_sql.sql
    };
  }
  function getOrderByOperators() {
    return {
      sql: import_sql.sql,
      asc: import_expressions.asc,
      desc: import_expressions.desc
    };
  }
  function extractTablesRelationalConfig(schema, configHelpers) {
    if (Object.keys(schema).length === 1 && "default" in schema && !(0, import_entity.is)(schema["default"], import_table.Table)) {
      schema = schema["default"];
    }
    const tableNamesMap = {};
    const relationsBuffer = {};
    const tablesConfig = {};
    for (const [key, value] of Object.entries(schema)) {
      if ((0, import_entity.is)(value, import_table.Table)) {
        const dbName = (0, import_table.getTableUniqueName)(value);
        const bufferedRelations = relationsBuffer[dbName];
        tableNamesMap[dbName] = key;
        tablesConfig[key] = {
          tsName: key,
          dbName: value[import_table.Table.Symbol.Name],
          schema: value[import_table.Table.Symbol.Schema],
          columns: value[import_table.Table.Symbol.Columns],
          relations: bufferedRelations?.relations ?? {},
          primaryKey: bufferedRelations?.primaryKey ?? []
        };
        for (const column of Object.values(value[import_table.Table.Symbol.Columns])) {
          if (column.primary) {
            tablesConfig[key].primaryKey.push(column);
          }
        }
        const extraConfig = value[import_table.Table.Symbol.ExtraConfigBuilder]?.(value[import_table.Table.Symbol.ExtraConfigColumns]);
        if (extraConfig) {
          for (const configEntry of Object.values(extraConfig)) {
            if ((0, import_entity.is)(configEntry, import_primary_keys.PrimaryKeyBuilder)) {
              tablesConfig[key].primaryKey.push(...configEntry.columns);
            }
          }
        }
      } else if ((0, import_entity.is)(value, Relations)) {
        const dbName = (0, import_table.getTableUniqueName)(value.table);
        const tableName = tableNamesMap[dbName];
        const relations2 = value.config(configHelpers(value.table));
        let primaryKey;
        for (const [relationName, relation] of Object.entries(relations2)) {
          if (tableName) {
            const tableConfig = tablesConfig[tableName];
            tableConfig.relations[relationName] = relation;
            if (primaryKey) {
              tableConfig.primaryKey.push(...primaryKey);
            }
          } else {
            if (!(dbName in relationsBuffer)) {
              relationsBuffer[dbName] = {
                relations: {},
                primaryKey
              };
            }
            relationsBuffer[dbName].relations[relationName] = relation;
          }
        }
      }
    }
    return { tables: tablesConfig, tableNamesMap };
  }
  function relations(table, relations2) {
    return new Relations(table, (helpers) => Object.fromEntries(Object.entries(relations2(helpers)).map(([key, value]) => [
      key,
      value.withFieldName(key)
    ])));
  }
  function createOne(sourceTable) {
    return function one(table, config) {
      return new One(sourceTable, table, config, config?.fields.reduce((res, f) => res && f.notNull, true) ?? false);
    };
  }
  function createMany(sourceTable) {
    return function many(referencedTable, config) {
      return new Many(sourceTable, referencedTable, config);
    };
  }
  function normalizeRelation(schema, tableNamesMap, relation) {
    if ((0, import_entity.is)(relation, One) && relation.config) {
      return {
        fields: relation.config.fields,
        references: relation.config.references
      };
    }
    const referencedTableTsName = tableNamesMap[(0, import_table.getTableUniqueName)(relation.referencedTable)];
    if (!referencedTableTsName) {
      throw new Error(`Table "${relation.referencedTable[import_table.Table.Symbol.Name]}" not found in schema`);
    }
    const referencedTableConfig = schema[referencedTableTsName];
    if (!referencedTableConfig) {
      throw new Error(`Table "${referencedTableTsName}" not found in schema`);
    }
    const sourceTable = relation.sourceTable;
    const sourceTableTsName = tableNamesMap[(0, import_table.getTableUniqueName)(sourceTable)];
    if (!sourceTableTsName) {
      throw new Error(`Table "${sourceTable[import_table.Table.Symbol.Name]}" not found in schema`);
    }
    const reverseRelations = [];
    for (const referencedTableRelation of Object.values(referencedTableConfig.relations)) {
      if (relation.relationName && relation !== referencedTableRelation && referencedTableRelation.relationName === relation.relationName || !relation.relationName && referencedTableRelation.referencedTable === relation.sourceTable) {
        reverseRelations.push(referencedTableRelation);
      }
    }
    if (reverseRelations.length > 1) {
      throw relation.relationName ? new Error(`There are multiple relations with name "${relation.relationName}" in table "${referencedTableTsName}"`) : new Error(`There are multiple relations between "${referencedTableTsName}" and "${relation.sourceTable[import_table.Table.Symbol.Name]}". Please specify relation name`);
    }
    if (reverseRelations[0] && (0, import_entity.is)(reverseRelations[0], One) && reverseRelations[0].config) {
      return {
        fields: reverseRelations[0].config.references,
        references: reverseRelations[0].config.fields
      };
    }
    throw new Error(`There is not enough information to infer relation "${sourceTableTsName}.${relation.fieldName}"`);
  }
  function createTableRelationsHelpers(sourceTable) {
    return {
      one: createOne(sourceTable),
      many: createMany(sourceTable)
    };
  }
  function mapRelationalRow(tablesConfig, tableConfig, row, buildQueryResultSelection, mapColumnValue = (value) => value) {
    const result = {};
    for (const [
      selectionItemIndex,
      selectionItem
    ] of buildQueryResultSelection.entries()) {
      if (selectionItem.isJson) {
        const relation = tableConfig.relations[selectionItem.tsKey];
        const rawSubRows = row[selectionItemIndex];
        const subRows = typeof rawSubRows === "string" ? JSON.parse(rawSubRows) : rawSubRows;
        result[selectionItem.tsKey] = (0, import_entity.is)(relation, One) ? subRows && mapRelationalRow(tablesConfig, tablesConfig[selectionItem.relationTableTsKey], subRows, selectionItem.selection, mapColumnValue) : subRows.map((subRow) => mapRelationalRow(tablesConfig, tablesConfig[selectionItem.relationTableTsKey], subRow, selectionItem.selection, mapColumnValue));
      } else {
        const value = mapColumnValue(row[selectionItemIndex]);
        const field = selectionItem.field;
        let decoder;
        if ((0, import_entity.is)(field, import_column.Column)) {
          decoder = field;
        } else if ((0, import_entity.is)(field, import_sql.SQL)) {
          decoder = field.decoder;
        } else {
          decoder = field.sql.decoder;
        }
        result[selectionItem.tsKey] = value === null ? null : decoder.mapFromDriverValue(value);
      }
    }
    return result;
  }
});

// node_modules/drizzle-orm/sql/functions/aggregate.cjs
var require_aggregate = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var aggregate_exports = {};
  __export2(aggregate_exports, {
    avg: () => avg,
    avgDistinct: () => avgDistinct,
    count: () => count,
    countDistinct: () => countDistinct,
    max: () => max,
    min: () => min,
    sum: () => sum,
    sumDistinct: () => sumDistinct
  });
  module.exports = __toCommonJS2(aggregate_exports);
  var import_column = require_column();
  var import_entity = require_entity();
  var import_sql = require_sql();
  function count(expression) {
    return import_sql.sql`count(${expression || import_sql.sql.raw("*")})`.mapWith(Number);
  }
  function countDistinct(expression) {
    return import_sql.sql`count(distinct ${expression})`.mapWith(Number);
  }
  function avg(expression) {
    return import_sql.sql`avg(${expression})`.mapWith(String);
  }
  function avgDistinct(expression) {
    return import_sql.sql`avg(distinct ${expression})`.mapWith(String);
  }
  function sum(expression) {
    return import_sql.sql`sum(${expression})`.mapWith(String);
  }
  function sumDistinct(expression) {
    return import_sql.sql`sum(distinct ${expression})`.mapWith(String);
  }
  function max(expression) {
    return import_sql.sql`max(${expression})`.mapWith((0, import_entity.is)(expression, import_column.Column) ? expression : String);
  }
  function min(expression) {
    return import_sql.sql`min(${expression})`.mapWith((0, import_entity.is)(expression, import_column.Column) ? expression : String);
  }
});

// node_modules/drizzle-orm/sql/functions/vector.cjs
var require_vector2 = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var vector_exports = {};
  __export2(vector_exports, {
    cosineDistance: () => cosineDistance,
    hammingDistance: () => hammingDistance,
    innerProduct: () => innerProduct,
    jaccardDistance: () => jaccardDistance,
    l1Distance: () => l1Distance,
    l2Distance: () => l2Distance
  });
  module.exports = __toCommonJS2(vector_exports);
  var import_sql = require_sql();
  function toSql(value) {
    return JSON.stringify(value);
  }
  function l2Distance(column, value) {
    if (Array.isArray(value)) {
      return import_sql.sql`${column} <-> ${toSql(value)}`;
    }
    return import_sql.sql`${column} <-> ${value}`;
  }
  function l1Distance(column, value) {
    if (Array.isArray(value)) {
      return import_sql.sql`${column} <+> ${toSql(value)}`;
    }
    return import_sql.sql`${column} <+> ${value}`;
  }
  function innerProduct(column, value) {
    if (Array.isArray(value)) {
      return import_sql.sql`${column} <#> ${toSql(value)}`;
    }
    return import_sql.sql`${column} <#> ${value}`;
  }
  function cosineDistance(column, value) {
    if (Array.isArray(value)) {
      return import_sql.sql`${column} <=> ${toSql(value)}`;
    }
    return import_sql.sql`${column} <=> ${value}`;
  }
  function hammingDistance(column, value) {
    if (Array.isArray(value)) {
      return import_sql.sql`${column} <~> ${toSql(value)}`;
    }
    return import_sql.sql`${column} <~> ${value}`;
  }
  function jaccardDistance(column, value) {
    if (Array.isArray(value)) {
      return import_sql.sql`${column} <%> ${toSql(value)}`;
    }
    return import_sql.sql`${column} <%> ${value}`;
  }
});

// node_modules/drizzle-orm/sql/functions/index.cjs
var require_functions = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var functions_exports = {};
  module.exports = __toCommonJS2(functions_exports);
  __reExport(functions_exports, require_aggregate(), module.exports);
  __reExport(functions_exports, require_vector2(), module.exports);
});

// node_modules/drizzle-orm/sql/index.cjs
var require_sql2 = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var sql_exports = {};
  module.exports = __toCommonJS2(sql_exports);
  __reExport(sql_exports, require_expressions(), module.exports);
  __reExport(sql_exports, require_functions(), module.exports);
  __reExport(sql_exports, require_sql(), module.exports);
});

// node_modules/drizzle-orm/pg-core/view-base.cjs
var require_view_base = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var view_base_exports = {};
  __export2(view_base_exports, {
    PgViewBase: () => PgViewBase
  });
  module.exports = __toCommonJS2(view_base_exports);
  var import_entity = require_entity();
  var import_sql = require_sql();

  class PgViewBase extends import_sql.View {
    static [import_entity.entityKind] = "PgViewBase";
  }
});

// node_modules/drizzle-orm/pg-core/dialect.cjs
var require_dialect = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var dialect_exports = {};
  __export2(dialect_exports, {
    PgDialect: () => PgDialect
  });
  module.exports = __toCommonJS2(dialect_exports);
  var import_alias = require_alias();
  var import_column = require_column();
  var import_entity = require_entity();
  var import_errors = require_errors();
  var import_columns = require_columns();
  var import_table = require_table2();
  var import_relations = require_relations();
  var import_sql = require_sql2();
  var import_sql2 = require_sql();
  var import_subquery = require_subquery();
  var import_table2 = require_table();
  var import_utils = require_utils2();
  var import_view_common = require_view_common();
  var import_view_base = require_view_base();

  class PgDialect {
    static [import_entity.entityKind] = "PgDialect";
    async migrate(migrations, session, config) {
      const migrationsTable = typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
      const migrationsSchema = typeof config === "string" ? "drizzle" : config.migrationsSchema ?? "drizzle";
      const migrationTableCreate = import_sql2.sql`
			CREATE TABLE IF NOT EXISTS ${import_sql2.sql.identifier(migrationsSchema)}.${import_sql2.sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at bigint
			)
		`;
      await session.execute(import_sql2.sql`CREATE SCHEMA IF NOT EXISTS ${import_sql2.sql.identifier(migrationsSchema)}`);
      await session.execute(migrationTableCreate);
      const dbMigrations = await session.all(import_sql2.sql`select id, hash, created_at from ${import_sql2.sql.identifier(migrationsSchema)}.${import_sql2.sql.identifier(migrationsTable)} order by created_at desc limit 1`);
      const lastDbMigration = dbMigrations[0];
      await session.transaction(async (tx) => {
        for await (const migration of migrations) {
          if (!lastDbMigration || Number(lastDbMigration.created_at) < migration.folderMillis) {
            for (const stmt of migration.sql) {
              await tx.execute(import_sql2.sql.raw(stmt));
            }
            await tx.execute(import_sql2.sql`insert into ${import_sql2.sql.identifier(migrationsSchema)}.${import_sql2.sql.identifier(migrationsTable)} ("hash", "created_at") values(${migration.hash}, ${migration.folderMillis})`);
          }
        }
      });
    }
    escapeName(name) {
      return `"${name}"`;
    }
    escapeParam(num) {
      return `$${num + 1}`;
    }
    escapeString(str) {
      return `'${str.replace(/'/g, "''")}'`;
    }
    buildWithCTE(queries) {
      if (!queries?.length)
        return;
      const withSqlChunks = [import_sql2.sql`with `];
      for (const [i, w] of queries.entries()) {
        withSqlChunks.push(import_sql2.sql`${import_sql2.sql.identifier(w._.alias)} as (${w._.sql})`);
        if (i < queries.length - 1) {
          withSqlChunks.push(import_sql2.sql`, `);
        }
      }
      withSqlChunks.push(import_sql2.sql` `);
      return import_sql2.sql.join(withSqlChunks);
    }
    buildDeleteQuery({ table, where, returning, withList }) {
      const withSql = this.buildWithCTE(withList);
      const returningSql = returning ? import_sql2.sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : undefined;
      const whereSql = where ? import_sql2.sql` where ${where}` : undefined;
      return import_sql2.sql`${withSql}delete from ${table}${whereSql}${returningSql}`;
    }
    buildUpdateSet(table, set) {
      const tableColumns = table[import_table2.Table.Symbol.Columns];
      const columnNames = Object.keys(tableColumns).filter((colName) => set[colName] !== undefined || tableColumns[colName]?.onUpdateFn !== undefined);
      const setSize = columnNames.length;
      return import_sql2.sql.join(columnNames.flatMap((colName, i) => {
        const col = tableColumns[colName];
        const value = set[colName] ?? import_sql2.sql.param(col.onUpdateFn(), col);
        const res = import_sql2.sql`${import_sql2.sql.identifier(col.name)} = ${value}`;
        if (i < setSize - 1) {
          return [res, import_sql2.sql.raw(", ")];
        }
        return [res];
      }));
    }
    buildUpdateQuery({ table, set, where, returning, withList }) {
      const withSql = this.buildWithCTE(withList);
      const setSql = this.buildUpdateSet(table, set);
      const returningSql = returning ? import_sql2.sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : undefined;
      const whereSql = where ? import_sql2.sql` where ${where}` : undefined;
      return import_sql2.sql`${withSql}update ${table} set ${setSql}${whereSql}${returningSql}`;
    }
    buildSelection(fields, { isSingleTable = false } = {}) {
      const columnsLen = fields.length;
      const chunks = fields.flatMap(({ field }, i) => {
        const chunk = [];
        if ((0, import_entity.is)(field, import_sql2.SQL.Aliased) && field.isSelectionField) {
          chunk.push(import_sql2.sql.identifier(field.fieldAlias));
        } else if ((0, import_entity.is)(field, import_sql2.SQL.Aliased) || (0, import_entity.is)(field, import_sql2.SQL)) {
          const query = (0, import_entity.is)(field, import_sql2.SQL.Aliased) ? field.sql : field;
          if (isSingleTable) {
            chunk.push(new import_sql2.SQL(query.queryChunks.map((c) => {
              if ((0, import_entity.is)(c, import_columns.PgColumn)) {
                return import_sql2.sql.identifier(c.name);
              }
              return c;
            })));
          } else {
            chunk.push(query);
          }
          if ((0, import_entity.is)(field, import_sql2.SQL.Aliased)) {
            chunk.push(import_sql2.sql` as ${import_sql2.sql.identifier(field.fieldAlias)}`);
          }
        } else if ((0, import_entity.is)(field, import_column.Column)) {
          if (isSingleTable) {
            chunk.push(import_sql2.sql.identifier(field.name));
          } else {
            chunk.push(field);
          }
        }
        if (i < columnsLen - 1) {
          chunk.push(import_sql2.sql`, `);
        }
        return chunk;
      });
      return import_sql2.sql.join(chunks);
    }
    buildSelectQuery({
      withList,
      fields,
      fieldsFlat,
      where,
      having,
      table,
      joins,
      orderBy,
      groupBy,
      limit,
      offset,
      lockingClause,
      distinct,
      setOperators
    }) {
      const fieldsList = fieldsFlat ?? (0, import_utils.orderSelectedFields)(fields);
      for (const f of fieldsList) {
        if ((0, import_entity.is)(f.field, import_column.Column) && (0, import_table2.getTableName)(f.field.table) !== ((0, import_entity.is)(table, import_subquery.Subquery) ? table._.alias : (0, import_entity.is)(table, import_view_base.PgViewBase) ? table[import_view_common.ViewBaseConfig].name : (0, import_entity.is)(table, import_sql2.SQL) ? undefined : (0, import_table2.getTableName)(table)) && !((table2) => joins?.some(({ alias }) => alias === (table2[import_table2.Table.Symbol.IsAlias] ? (0, import_table2.getTableName)(table2) : table2[import_table2.Table.Symbol.BaseName])))(f.field.table)) {
          const tableName = (0, import_table2.getTableName)(f.field.table);
          throw new Error(`Your "${f.path.join("->")}" field references a column "${tableName}"."${f.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`);
        }
      }
      const isSingleTable = !joins || joins.length === 0;
      const withSql = this.buildWithCTE(withList);
      let distinctSql;
      if (distinct) {
        distinctSql = distinct === true ? import_sql2.sql` distinct` : import_sql2.sql` distinct on (${import_sql2.sql.join(distinct.on, import_sql2.sql`, `)})`;
      }
      const selection = this.buildSelection(fieldsList, { isSingleTable });
      const tableSql = (() => {
        if ((0, import_entity.is)(table, import_table2.Table) && table[import_table2.Table.Symbol.OriginalName] !== table[import_table2.Table.Symbol.Name]) {
          let fullName = import_sql2.sql`${import_sql2.sql.identifier(table[import_table2.Table.Symbol.OriginalName])}`;
          if (table[import_table2.Table.Symbol.Schema]) {
            fullName = import_sql2.sql`${import_sql2.sql.identifier(table[import_table2.Table.Symbol.Schema])}.${fullName}`;
          }
          return import_sql2.sql`${fullName} ${import_sql2.sql.identifier(table[import_table2.Table.Symbol.Name])}`;
        }
        return table;
      })();
      const joinsArray = [];
      if (joins) {
        for (const [index, joinMeta] of joins.entries()) {
          if (index === 0) {
            joinsArray.push(import_sql2.sql` `);
          }
          const table2 = joinMeta.table;
          const lateralSql = joinMeta.lateral ? import_sql2.sql` lateral` : undefined;
          if ((0, import_entity.is)(table2, import_table.PgTable)) {
            const tableName = table2[import_table.PgTable.Symbol.Name];
            const tableSchema = table2[import_table.PgTable.Symbol.Schema];
            const origTableName = table2[import_table.PgTable.Symbol.OriginalName];
            const alias = tableName === origTableName ? undefined : joinMeta.alias;
            joinsArray.push(import_sql2.sql`${import_sql2.sql.raw(joinMeta.joinType)} join${lateralSql} ${tableSchema ? import_sql2.sql`${import_sql2.sql.identifier(tableSchema)}.` : undefined}${import_sql2.sql.identifier(origTableName)}${alias && import_sql2.sql` ${import_sql2.sql.identifier(alias)}`} on ${joinMeta.on}`);
          } else if ((0, import_entity.is)(table2, import_sql.View)) {
            const viewName = table2[import_view_common.ViewBaseConfig].name;
            const viewSchema = table2[import_view_common.ViewBaseConfig].schema;
            const origViewName = table2[import_view_common.ViewBaseConfig].originalName;
            const alias = viewName === origViewName ? undefined : joinMeta.alias;
            joinsArray.push(import_sql2.sql`${import_sql2.sql.raw(joinMeta.joinType)} join${lateralSql} ${viewSchema ? import_sql2.sql`${import_sql2.sql.identifier(viewSchema)}.` : undefined}${import_sql2.sql.identifier(origViewName)}${alias && import_sql2.sql` ${import_sql2.sql.identifier(alias)}`} on ${joinMeta.on}`);
          } else {
            joinsArray.push(import_sql2.sql`${import_sql2.sql.raw(joinMeta.joinType)} join${lateralSql} ${table2} on ${joinMeta.on}`);
          }
          if (index < joins.length - 1) {
            joinsArray.push(import_sql2.sql` `);
          }
        }
      }
      const joinsSql = import_sql2.sql.join(joinsArray);
      const whereSql = where ? import_sql2.sql` where ${where}` : undefined;
      const havingSql = having ? import_sql2.sql` having ${having}` : undefined;
      let orderBySql;
      if (orderBy && orderBy.length > 0) {
        orderBySql = import_sql2.sql` order by ${import_sql2.sql.join(orderBy, import_sql2.sql`, `)}`;
      }
      let groupBySql;
      if (groupBy && groupBy.length > 0) {
        groupBySql = import_sql2.sql` group by ${import_sql2.sql.join(groupBy, import_sql2.sql`, `)}`;
      }
      const limitSql = limit ? import_sql2.sql` limit ${limit}` : undefined;
      const offsetSql = offset ? import_sql2.sql` offset ${offset}` : undefined;
      const lockingClauseSql = import_sql2.sql.empty();
      if (lockingClause) {
        const clauseSql = import_sql2.sql` for ${import_sql2.sql.raw(lockingClause.strength)}`;
        if (lockingClause.config.of) {
          clauseSql.append(import_sql2.sql` of ${import_sql2.sql.join(Array.isArray(lockingClause.config.of) ? lockingClause.config.of : [lockingClause.config.of], import_sql2.sql`, `)}`);
        }
        if (lockingClause.config.noWait) {
          clauseSql.append(import_sql2.sql` no wait`);
        } else if (lockingClause.config.skipLocked) {
          clauseSql.append(import_sql2.sql` skip locked`);
        }
        lockingClauseSql.append(clauseSql);
      }
      const finalQuery = import_sql2.sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}${lockingClauseSql}`;
      if (setOperators.length > 0) {
        return this.buildSetOperations(finalQuery, setOperators);
      }
      return finalQuery;
    }
    buildSetOperations(leftSelect, setOperators) {
      const [setOperator, ...rest] = setOperators;
      if (!setOperator) {
        throw new Error("Cannot pass undefined values to any set operator");
      }
      if (rest.length === 0) {
        return this.buildSetOperationQuery({ leftSelect, setOperator });
      }
      return this.buildSetOperations(this.buildSetOperationQuery({ leftSelect, setOperator }), rest);
    }
    buildSetOperationQuery({
      leftSelect,
      setOperator: { type, isAll, rightSelect, limit, orderBy, offset }
    }) {
      const leftChunk = import_sql2.sql`(${leftSelect.getSQL()}) `;
      const rightChunk = import_sql2.sql`(${rightSelect.getSQL()})`;
      let orderBySql;
      if (orderBy && orderBy.length > 0) {
        const orderByValues = [];
        for (const singleOrderBy of orderBy) {
          if ((0, import_entity.is)(singleOrderBy, import_columns.PgColumn)) {
            orderByValues.push(import_sql2.sql.identifier(singleOrderBy.name));
          } else if ((0, import_entity.is)(singleOrderBy, import_sql2.SQL)) {
            for (let i = 0;i < singleOrderBy.queryChunks.length; i++) {
              const chunk = singleOrderBy.queryChunks[i];
              if ((0, import_entity.is)(chunk, import_columns.PgColumn)) {
                singleOrderBy.queryChunks[i] = import_sql2.sql.identifier(chunk.name);
              }
            }
            orderByValues.push(import_sql2.sql`${singleOrderBy}`);
          } else {
            orderByValues.push(import_sql2.sql`${singleOrderBy}`);
          }
        }
        orderBySql = import_sql2.sql` order by ${import_sql2.sql.join(orderByValues, import_sql2.sql`, `)} `;
      }
      const limitSql = limit ? import_sql2.sql` limit ${limit}` : undefined;
      const operatorChunk = import_sql2.sql.raw(`${type} ${isAll ? "all " : ""}`);
      const offsetSql = offset ? import_sql2.sql` offset ${offset}` : undefined;
      return import_sql2.sql`${leftChunk}${operatorChunk}${rightChunk}${orderBySql}${limitSql}${offsetSql}`;
    }
    buildInsertQuery({ table, values, onConflict, returning, withList }) {
      const valuesSqlList = [];
      const columns = table[import_table2.Table.Symbol.Columns];
      const colEntries = Object.entries(columns).filter(([_, col]) => !col.shouldDisableInsert());
      const insertOrder = colEntries.map(([, column]) => import_sql2.sql.identifier(column.name));
      for (const [valueIndex, value] of values.entries()) {
        const valueList = [];
        for (const [fieldName, col] of colEntries) {
          const colValue = value[fieldName];
          if (colValue === undefined || (0, import_entity.is)(colValue, import_sql2.Param) && colValue.value === undefined) {
            if (col.defaultFn !== undefined) {
              const defaultFnResult = col.defaultFn();
              const defaultValue = (0, import_entity.is)(defaultFnResult, import_sql2.SQL) ? defaultFnResult : import_sql2.sql.param(defaultFnResult, col);
              valueList.push(defaultValue);
            } else if (!col.default && col.onUpdateFn !== undefined) {
              const onUpdateFnResult = col.onUpdateFn();
              const newValue = (0, import_entity.is)(onUpdateFnResult, import_sql2.SQL) ? onUpdateFnResult : import_sql2.sql.param(onUpdateFnResult, col);
              valueList.push(newValue);
            } else {
              valueList.push(import_sql2.sql`default`);
            }
          } else {
            valueList.push(colValue);
          }
        }
        valuesSqlList.push(valueList);
        if (valueIndex < values.length - 1) {
          valuesSqlList.push(import_sql2.sql`, `);
        }
      }
      const withSql = this.buildWithCTE(withList);
      const valuesSql = import_sql2.sql.join(valuesSqlList);
      const returningSql = returning ? import_sql2.sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : undefined;
      const onConflictSql = onConflict ? import_sql2.sql` on conflict ${onConflict}` : undefined;
      return import_sql2.sql`${withSql}insert into ${table} ${insertOrder} values ${valuesSql}${onConflictSql}${returningSql}`;
    }
    buildRefreshMaterializedViewQuery({ view, concurrently, withNoData }) {
      const concurrentlySql = concurrently ? import_sql2.sql` concurrently` : undefined;
      const withNoDataSql = withNoData ? import_sql2.sql` with no data` : undefined;
      return import_sql2.sql`refresh materialized view${concurrentlySql} ${view}${withNoDataSql}`;
    }
    prepareTyping(encoder) {
      if ((0, import_entity.is)(encoder, import_columns.PgJsonb) || (0, import_entity.is)(encoder, import_columns.PgJson)) {
        return "json";
      } else if ((0, import_entity.is)(encoder, import_columns.PgNumeric)) {
        return "decimal";
      } else if ((0, import_entity.is)(encoder, import_columns.PgTime)) {
        return "time";
      } else if ((0, import_entity.is)(encoder, import_columns.PgTimestamp) || (0, import_entity.is)(encoder, import_columns.PgTimestampString)) {
        return "timestamp";
      } else if ((0, import_entity.is)(encoder, import_columns.PgDate) || (0, import_entity.is)(encoder, import_columns.PgDateString)) {
        return "date";
      } else if ((0, import_entity.is)(encoder, import_columns.PgUUID)) {
        return "uuid";
      } else {
        return "none";
      }
    }
    sqlToQuery(sql2, invokeSource) {
      return sql2.toQuery({
        escapeName: this.escapeName,
        escapeParam: this.escapeParam,
        escapeString: this.escapeString,
        prepareTyping: this.prepareTyping,
        invokeSource
      });
    }
    buildRelationalQueryWithoutPK({
      fullSchema,
      schema,
      tableNamesMap,
      table,
      tableConfig,
      queryConfig: config,
      tableAlias,
      nestedQueryRelation,
      joinOn
    }) {
      let selection = [];
      let limit, offset, orderBy = [], where;
      const joins = [];
      if (config === true) {
        const selectionEntries = Object.entries(tableConfig.columns);
        selection = selectionEntries.map(([key, value]) => ({
          dbKey: value.name,
          tsKey: key,
          field: (0, import_alias.aliasedTableColumn)(value, tableAlias),
          relationTableTsKey: undefined,
          isJson: false,
          selection: []
        }));
      } else {
        const aliasedColumns = Object.fromEntries(Object.entries(tableConfig.columns).map(([key, value]) => [key, (0, import_alias.aliasedTableColumn)(value, tableAlias)]));
        if (config.where) {
          const whereSql = typeof config.where === "function" ? config.where(aliasedColumns, (0, import_relations.getOperators)()) : config.where;
          where = whereSql && (0, import_alias.mapColumnsInSQLToAlias)(whereSql, tableAlias);
        }
        const fieldsSelection = [];
        let selectedColumns = [];
        if (config.columns) {
          let isIncludeMode = false;
          for (const [field, value] of Object.entries(config.columns)) {
            if (value === undefined) {
              continue;
            }
            if (field in tableConfig.columns) {
              if (!isIncludeMode && value === true) {
                isIncludeMode = true;
              }
              selectedColumns.push(field);
            }
          }
          if (selectedColumns.length > 0) {
            selectedColumns = isIncludeMode ? selectedColumns.filter((c) => config.columns?.[c] === true) : Object.keys(tableConfig.columns).filter((key) => !selectedColumns.includes(key));
          }
        } else {
          selectedColumns = Object.keys(tableConfig.columns);
        }
        for (const field of selectedColumns) {
          const column = tableConfig.columns[field];
          fieldsSelection.push({ tsKey: field, value: column });
        }
        let selectedRelations = [];
        if (config.with) {
          selectedRelations = Object.entries(config.with).filter((entry) => !!entry[1]).map(([tsKey, queryConfig]) => ({ tsKey, queryConfig, relation: tableConfig.relations[tsKey] }));
        }
        let extras;
        if (config.extras) {
          extras = typeof config.extras === "function" ? config.extras(aliasedColumns, { sql: import_sql2.sql }) : config.extras;
          for (const [tsKey, value] of Object.entries(extras)) {
            fieldsSelection.push({
              tsKey,
              value: (0, import_alias.mapColumnsInAliasedSQLToAlias)(value, tableAlias)
            });
          }
        }
        for (const { tsKey, value } of fieldsSelection) {
          selection.push({
            dbKey: (0, import_entity.is)(value, import_sql2.SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey].name,
            tsKey,
            field: (0, import_entity.is)(value, import_column.Column) ? (0, import_alias.aliasedTableColumn)(value, tableAlias) : value,
            relationTableTsKey: undefined,
            isJson: false,
            selection: []
          });
        }
        let orderByOrig = typeof config.orderBy === "function" ? config.orderBy(aliasedColumns, (0, import_relations.getOrderByOperators)()) : config.orderBy ?? [];
        if (!Array.isArray(orderByOrig)) {
          orderByOrig = [orderByOrig];
        }
        orderBy = orderByOrig.map((orderByValue) => {
          if ((0, import_entity.is)(orderByValue, import_column.Column)) {
            return (0, import_alias.aliasedTableColumn)(orderByValue, tableAlias);
          }
          return (0, import_alias.mapColumnsInSQLToAlias)(orderByValue, tableAlias);
        });
        limit = config.limit;
        offset = config.offset;
        for (const {
          tsKey: selectedRelationTsKey,
          queryConfig: selectedRelationConfigValue,
          relation
        } of selectedRelations) {
          const normalizedRelation = (0, import_relations.normalizeRelation)(schema, tableNamesMap, relation);
          const relationTableName = (0, import_table2.getTableUniqueName)(relation.referencedTable);
          const relationTableTsName = tableNamesMap[relationTableName];
          const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
          const joinOn2 = (0, import_sql.and)(...normalizedRelation.fields.map((field2, i) => (0, import_sql.eq)((0, import_alias.aliasedTableColumn)(normalizedRelation.references[i], relationTableAlias), (0, import_alias.aliasedTableColumn)(field2, tableAlias))));
          const builtRelation = this.buildRelationalQueryWithoutPK({
            fullSchema,
            schema,
            tableNamesMap,
            table: fullSchema[relationTableTsName],
            tableConfig: schema[relationTableTsName],
            queryConfig: (0, import_entity.is)(relation, import_relations.One) ? selectedRelationConfigValue === true ? { limit: 1 } : { ...selectedRelationConfigValue, limit: 1 } : selectedRelationConfigValue,
            tableAlias: relationTableAlias,
            joinOn: joinOn2,
            nestedQueryRelation: relation
          });
          const field = import_sql2.sql`${import_sql2.sql.identifier(relationTableAlias)}.${import_sql2.sql.identifier("data")}`.as(selectedRelationTsKey);
          joins.push({
            on: import_sql2.sql`true`,
            table: new import_subquery.Subquery(builtRelation.sql, {}, relationTableAlias),
            alias: relationTableAlias,
            joinType: "left",
            lateral: true
          });
          selection.push({
            dbKey: selectedRelationTsKey,
            tsKey: selectedRelationTsKey,
            field,
            relationTableTsKey: relationTableTsName,
            isJson: true,
            selection: builtRelation.selection
          });
        }
      }
      if (selection.length === 0) {
        throw new import_errors.DrizzleError({ message: `No fields selected for table "${tableConfig.tsName}" ("${tableAlias}")` });
      }
      let result;
      where = (0, import_sql.and)(joinOn, where);
      if (nestedQueryRelation) {
        let field = import_sql2.sql`json_build_array(${import_sql2.sql.join(selection.map(({ field: field2, tsKey, isJson }) => isJson ? import_sql2.sql`${import_sql2.sql.identifier(`${tableAlias}_${tsKey}`)}.${import_sql2.sql.identifier("data")}` : (0, import_entity.is)(field2, import_sql2.SQL.Aliased) ? field2.sql : field2), import_sql2.sql`, `)})`;
        if ((0, import_entity.is)(nestedQueryRelation, import_relations.Many)) {
          field = import_sql2.sql`coalesce(json_agg(${field}${orderBy.length > 0 ? import_sql2.sql` order by ${import_sql2.sql.join(orderBy, import_sql2.sql`, `)}` : undefined}), '[]'::json)`;
        }
        const nestedSelection = [{
          dbKey: "data",
          tsKey: "data",
          field: field.as("data"),
          isJson: true,
          relationTableTsKey: tableConfig.tsName,
          selection
        }];
        const needsSubquery = limit !== undefined || offset !== undefined || orderBy.length > 0;
        if (needsSubquery) {
          result = this.buildSelectQuery({
            table: (0, import_alias.aliasedTable)(table, tableAlias),
            fields: {},
            fieldsFlat: [{
              path: [],
              field: import_sql2.sql.raw("*")
            }],
            where,
            limit,
            offset,
            orderBy,
            setOperators: []
          });
          where = undefined;
          limit = undefined;
          offset = undefined;
          orderBy = [];
        } else {
          result = (0, import_alias.aliasedTable)(table, tableAlias);
        }
        result = this.buildSelectQuery({
          table: (0, import_entity.is)(result, import_table.PgTable) ? result : new import_subquery.Subquery(result, {}, tableAlias),
          fields: {},
          fieldsFlat: nestedSelection.map(({ field: field2 }) => ({
            path: [],
            field: (0, import_entity.is)(field2, import_column.Column) ? (0, import_alias.aliasedTableColumn)(field2, tableAlias) : field2
          })),
          joins,
          where,
          limit,
          offset,
          orderBy,
          setOperators: []
        });
      } else {
        result = this.buildSelectQuery({
          table: (0, import_alias.aliasedTable)(table, tableAlias),
          fields: {},
          fieldsFlat: selection.map(({ field }) => ({
            path: [],
            field: (0, import_entity.is)(field, import_column.Column) ? (0, import_alias.aliasedTableColumn)(field, tableAlias) : field
          })),
          joins,
          where,
          limit,
          offset,
          orderBy,
          setOperators: []
        });
      }
      return {
        tableTsKey: tableConfig.tsName,
        sql: result,
        selection
      };
    }
  }
});

// node_modules/drizzle-orm/selection-proxy.cjs
var require_selection_proxy = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var selection_proxy_exports = {};
  __export2(selection_proxy_exports, {
    SelectionProxyHandler: () => SelectionProxyHandler
  });
  module.exports = __toCommonJS2(selection_proxy_exports);
  var import_alias = require_alias();
  var import_column = require_column();
  var import_entity = require_entity();
  var import_sql = require_sql();
  var import_subquery = require_subquery();
  var import_view_common = require_view_common();

  class SelectionProxyHandler {
    static [import_entity.entityKind] = "SelectionProxyHandler";
    config;
    constructor(config) {
      this.config = { ...config };
    }
    get(subquery, prop) {
      if (prop === "_") {
        return {
          ...subquery["_"],
          selectedFields: new Proxy(subquery._.selectedFields, this)
        };
      }
      if (prop === import_view_common.ViewBaseConfig) {
        return {
          ...subquery[import_view_common.ViewBaseConfig],
          selectedFields: new Proxy(subquery[import_view_common.ViewBaseConfig].selectedFields, this)
        };
      }
      if (typeof prop === "symbol") {
        return subquery[prop];
      }
      const columns = (0, import_entity.is)(subquery, import_subquery.Subquery) ? subquery._.selectedFields : (0, import_entity.is)(subquery, import_sql.View) ? subquery[import_view_common.ViewBaseConfig].selectedFields : subquery;
      const value = columns[prop];
      if ((0, import_entity.is)(value, import_sql.SQL.Aliased)) {
        if (this.config.sqlAliasedBehavior === "sql" && !value.isSelectionField) {
          return value.sql;
        }
        const newValue = value.clone();
        newValue.isSelectionField = true;
        return newValue;
      }
      if ((0, import_entity.is)(value, import_sql.SQL)) {
        if (this.config.sqlBehavior === "sql") {
          return value;
        }
        throw new Error(`You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`);
      }
      if ((0, import_entity.is)(value, import_column.Column)) {
        if (this.config.alias) {
          return new Proxy(value, new import_alias.ColumnAliasProxyHandler(new Proxy(value.table, new import_alias.TableAliasProxyHandler(this.config.alias, this.config.replaceOriginalName ?? false))));
        }
        return value;
      }
      if (typeof value !== "object" || value === null) {
        return value;
      }
      return new Proxy(value, new SelectionProxyHandler(this.config));
    }
  }
});

// node_modules/drizzle-orm/query-builders/query-builder.cjs
var require_query_builder = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var query_builder_exports = {};
  __export2(query_builder_exports, {
    TypedQueryBuilder: () => TypedQueryBuilder
  });
  module.exports = __toCommonJS2(query_builder_exports);
  var import_entity = require_entity();

  class TypedQueryBuilder {
    static [import_entity.entityKind] = "TypedQueryBuilder";
    getSelectedFields() {
      return this._.selectedFields;
    }
  }
});

// node_modules/drizzle-orm/pg-core/query-builders/select.cjs
var require_select2 = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except2, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except2)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var select_exports = {};
  __export2(select_exports, {
    PgSelectBase: () => PgSelectBase,
    PgSelectBuilder: () => PgSelectBuilder,
    PgSelectQueryBuilderBase: () => PgSelectQueryBuilderBase,
    except: () => except,
    exceptAll: () => exceptAll,
    intersect: () => intersect,
    intersectAll: () => intersectAll,
    union: () => union,
    unionAll: () => unionAll
  });
  module.exports = __toCommonJS2(select_exports);
  var import_entity = require_entity();
  var import_view_base = require_view_base();
  var import_query_builder = require_query_builder();
  var import_query_promise = require_query_promise();
  var import_selection_proxy = require_selection_proxy();
  var import_sql = require_sql();
  var import_subquery = require_subquery();
  var import_table = require_table();
  var import_tracing = require_tracing();
  var import_utils = require_utils2();
  var import_utils2 = require_utils2();
  var import_view_common = require_view_common();

  class PgSelectBuilder {
    static [import_entity.entityKind] = "PgSelectBuilder";
    fields;
    session;
    dialect;
    withList = [];
    distinct;
    constructor(config) {
      this.fields = config.fields;
      this.session = config.session;
      this.dialect = config.dialect;
      if (config.withList) {
        this.withList = config.withList;
      }
      this.distinct = config.distinct;
    }
    from(source) {
      const isPartialSelect = !!this.fields;
      let fields;
      if (this.fields) {
        fields = this.fields;
      } else if ((0, import_entity.is)(source, import_subquery.Subquery)) {
        fields = Object.fromEntries(Object.keys(source._.selectedFields).map((key) => [key, source[key]]));
      } else if ((0, import_entity.is)(source, import_view_base.PgViewBase)) {
        fields = source[import_view_common.ViewBaseConfig].selectedFields;
      } else if ((0, import_entity.is)(source, import_sql.SQL)) {
        fields = {};
      } else {
        fields = (0, import_utils.getTableColumns)(source);
      }
      return new PgSelectBase({
        table: source,
        fields,
        isPartialSelect,
        session: this.session,
        dialect: this.dialect,
        withList: this.withList,
        distinct: this.distinct
      });
    }
  }

  class PgSelectQueryBuilderBase extends import_query_builder.TypedQueryBuilder {
    static [import_entity.entityKind] = "PgSelectQueryBuilder";
    _;
    config;
    joinsNotNullableMap;
    tableName;
    isPartialSelect;
    session;
    dialect;
    constructor({ table, fields, isPartialSelect, session, dialect, withList, distinct }) {
      super();
      this.config = {
        withList,
        table,
        fields: { ...fields },
        distinct,
        setOperators: []
      };
      this.isPartialSelect = isPartialSelect;
      this.session = session;
      this.dialect = dialect;
      this._ = {
        selectedFields: fields
      };
      this.tableName = (0, import_utils.getTableLikeName)(table);
      this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
    }
    createJoin(joinType) {
      return (table, on) => {
        const baseTableName = this.tableName;
        const tableName = (0, import_utils.getTableLikeName)(table);
        if (typeof tableName === "string" && this.config.joins?.some((join2) => join2.alias === tableName)) {
          throw new Error(`Alias "${tableName}" is already used in this query`);
        }
        if (!this.isPartialSelect) {
          if (Object.keys(this.joinsNotNullableMap).length === 1 && typeof baseTableName === "string") {
            this.config.fields = {
              [baseTableName]: this.config.fields
            };
          }
          if (typeof tableName === "string" && !(0, import_entity.is)(table, import_sql.SQL)) {
            const selection = (0, import_entity.is)(table, import_subquery.Subquery) ? table._.selectedFields : (0, import_entity.is)(table, import_sql.View) ? table[import_view_common.ViewBaseConfig].selectedFields : table[import_table.Table.Symbol.Columns];
            this.config.fields[tableName] = selection;
          }
        }
        if (typeof on === "function") {
          on = on(new Proxy(this.config.fields, new import_selection_proxy.SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })));
        }
        if (!this.config.joins) {
          this.config.joins = [];
        }
        this.config.joins.push({ on, table, joinType, alias: tableName });
        if (typeof tableName === "string") {
          switch (joinType) {
            case "left": {
              this.joinsNotNullableMap[tableName] = false;
              break;
            }
            case "right": {
              this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
              this.joinsNotNullableMap[tableName] = true;
              break;
            }
            case "inner": {
              this.joinsNotNullableMap[tableName] = true;
              break;
            }
            case "full": {
              this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
              this.joinsNotNullableMap[tableName] = false;
              break;
            }
          }
        }
        return this;
      };
    }
    leftJoin = this.createJoin("left");
    rightJoin = this.createJoin("right");
    innerJoin = this.createJoin("inner");
    fullJoin = this.createJoin("full");
    createSetOperator(type, isAll) {
      return (rightSelection) => {
        const rightSelect = typeof rightSelection === "function" ? rightSelection(getPgSetOperators()) : rightSelection;
        if (!(0, import_utils.haveSameKeys)(this.getSelectedFields(), rightSelect.getSelectedFields())) {
          throw new Error("Set operator error (union / intersect / except): selected fields are not the same or are in a different order");
        }
        this.config.setOperators.push({ type, isAll, rightSelect });
        return this;
      };
    }
    union = this.createSetOperator("union", false);
    unionAll = this.createSetOperator("union", true);
    intersect = this.createSetOperator("intersect", false);
    intersectAll = this.createSetOperator("intersect", true);
    except = this.createSetOperator("except", false);
    exceptAll = this.createSetOperator("except", true);
    addSetOperators(setOperators) {
      this.config.setOperators.push(...setOperators);
      return this;
    }
    where(where) {
      if (typeof where === "function") {
        where = where(new Proxy(this.config.fields, new import_selection_proxy.SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })));
      }
      this.config.where = where;
      return this;
    }
    having(having) {
      if (typeof having === "function") {
        having = having(new Proxy(this.config.fields, new import_selection_proxy.SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })));
      }
      this.config.having = having;
      return this;
    }
    groupBy(...columns) {
      if (typeof columns[0] === "function") {
        const groupBy = columns[0](new Proxy(this.config.fields, new import_selection_proxy.SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })));
        this.config.groupBy = Array.isArray(groupBy) ? groupBy : [groupBy];
      } else {
        this.config.groupBy = columns;
      }
      return this;
    }
    orderBy(...columns) {
      if (typeof columns[0] === "function") {
        const orderBy = columns[0](new Proxy(this.config.fields, new import_selection_proxy.SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })));
        const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
        if (this.config.setOperators.length > 0) {
          this.config.setOperators.at(-1).orderBy = orderByArray;
        } else {
          this.config.orderBy = orderByArray;
        }
      } else {
        const orderByArray = columns;
        if (this.config.setOperators.length > 0) {
          this.config.setOperators.at(-1).orderBy = orderByArray;
        } else {
          this.config.orderBy = orderByArray;
        }
      }
      return this;
    }
    limit(limit) {
      if (this.config.setOperators.length > 0) {
        this.config.setOperators.at(-1).limit = limit;
      } else {
        this.config.limit = limit;
      }
      return this;
    }
    offset(offset) {
      if (this.config.setOperators.length > 0) {
        this.config.setOperators.at(-1).offset = offset;
      } else {
        this.config.offset = offset;
      }
      return this;
    }
    for(strength, config = {}) {
      this.config.lockingClause = { strength, config };
      return this;
    }
    getSQL() {
      return this.dialect.buildSelectQuery(this.config);
    }
    toSQL() {
      const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
      return rest;
    }
    as(alias) {
      return new Proxy(new import_subquery.Subquery(this.getSQL(), this.config.fields, alias), new import_selection_proxy.SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" }));
    }
    getSelectedFields() {
      return new Proxy(this.config.fields, new import_selection_proxy.SelectionProxyHandler({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" }));
    }
    $dynamic() {
      return this;
    }
  }

  class PgSelectBase extends PgSelectQueryBuilderBase {
    static [import_entity.entityKind] = "PgSelect";
    _prepare(name) {
      const { session, config, dialect, joinsNotNullableMap } = this;
      if (!session) {
        throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
      }
      return import_tracing.tracer.startActiveSpan("drizzle.prepareQuery", () => {
        const fieldsList = (0, import_utils2.orderSelectedFields)(config.fields);
        const query = session.prepareQuery(dialect.sqlToQuery(this.getSQL()), fieldsList, name, true);
        query.joinsNotNullableMap = joinsNotNullableMap;
        return query;
      });
    }
    prepare(name) {
      return this._prepare(name);
    }
    execute = (placeholderValues) => {
      return import_tracing.tracer.startActiveSpan("drizzle.operation", () => {
        return this._prepare().execute(placeholderValues);
      });
    };
  }
  (0, import_utils.applyMixins)(PgSelectBase, [import_query_promise.QueryPromise]);
  function createSetOperator(type, isAll) {
    return (leftSelect, rightSelect, ...restSelects) => {
      const setOperators = [rightSelect, ...restSelects].map((select) => ({
        type,
        isAll,
        rightSelect: select
      }));
      for (const setOperator of setOperators) {
        if (!(0, import_utils.haveSameKeys)(leftSelect.getSelectedFields(), setOperator.rightSelect.getSelectedFields())) {
          throw new Error("Set operator error (union / intersect / except): selected fields are not the same or are in a different order");
        }
      }
      return leftSelect.addSetOperators(setOperators);
    };
  }
  var getPgSetOperators = () => ({
    union,
    unionAll,
    intersect,
    intersectAll,
    except,
    exceptAll
  });
  var union = createSetOperator("union", false);
  var unionAll = createSetOperator("union", true);
  var intersect = createSetOperator("intersect", false);
  var intersectAll = createSetOperator("intersect", true);
  var except = createSetOperator("except", false);
  var exceptAll = createSetOperator("except", true);
});

// node_modules/drizzle-orm/pg-core/query-builders/query-builder.cjs
var require_query_builder2 = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var query_builder_exports = {};
  __export2(query_builder_exports, {
    QueryBuilder: () => QueryBuilder
  });
  module.exports = __toCommonJS2(query_builder_exports);
  var import_entity = require_entity();
  var import_dialect = require_dialect();
  var import_selection_proxy = require_selection_proxy();
  var import_subquery = require_subquery();
  var import_select = require_select2();

  class QueryBuilder {
    static [import_entity.entityKind] = "PgQueryBuilder";
    dialect;
    $with(alias) {
      const queryBuilder = this;
      return {
        as(qb) {
          if (typeof qb === "function") {
            qb = qb(queryBuilder);
          }
          return new Proxy(new import_subquery.WithSubquery(qb.getSQL(), qb.getSelectedFields(), alias, true), new import_selection_proxy.SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" }));
        }
      };
    }
    with(...queries) {
      const self = this;
      function select(fields) {
        return new import_select.PgSelectBuilder({
          fields: fields ?? undefined,
          session: undefined,
          dialect: self.getDialect(),
          withList: queries
        });
      }
      function selectDistinct(fields) {
        return new import_select.PgSelectBuilder({
          fields: fields ?? undefined,
          session: undefined,
          dialect: self.getDialect(),
          distinct: true
        });
      }
      function selectDistinctOn(on, fields) {
        return new import_select.PgSelectBuilder({
          fields: fields ?? undefined,
          session: undefined,
          dialect: self.getDialect(),
          distinct: { on }
        });
      }
      return { select, selectDistinct, selectDistinctOn };
    }
    select(fields) {
      return new import_select.PgSelectBuilder({
        fields: fields ?? undefined,
        session: undefined,
        dialect: this.getDialect()
      });
    }
    selectDistinct(fields) {
      return new import_select.PgSelectBuilder({
        fields: fields ?? undefined,
        session: undefined,
        dialect: this.getDialect(),
        distinct: true
      });
    }
    selectDistinctOn(on, fields) {
      return new import_select.PgSelectBuilder({
        fields: fields ?? undefined,
        session: undefined,
        dialect: this.getDialect(),
        distinct: { on }
      });
    }
    getDialect() {
      if (!this.dialect) {
        this.dialect = new import_dialect.PgDialect;
      }
      return this.dialect;
    }
  }
});

// node_modules/drizzle-orm/pg-core/query-builders/refresh-materialized-view.cjs
var require_refresh_materialized_view = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var refresh_materialized_view_exports = {};
  __export2(refresh_materialized_view_exports, {
    PgRefreshMaterializedView: () => PgRefreshMaterializedView
  });
  module.exports = __toCommonJS2(refresh_materialized_view_exports);
  var import_entity = require_entity();
  var import_query_promise = require_query_promise();
  var import_tracing = require_tracing();

  class PgRefreshMaterializedView extends import_query_promise.QueryPromise {
    constructor(view, session, dialect) {
      super();
      this.session = session;
      this.dialect = dialect;
      this.config = { view };
    }
    static [import_entity.entityKind] = "PgRefreshMaterializedView";
    config;
    concurrently() {
      if (this.config.withNoData !== undefined) {
        throw new Error("Cannot use concurrently and withNoData together");
      }
      this.config.concurrently = true;
      return this;
    }
    withNoData() {
      if (this.config.concurrently !== undefined) {
        throw new Error("Cannot use concurrently and withNoData together");
      }
      this.config.withNoData = true;
      return this;
    }
    getSQL() {
      return this.dialect.buildRefreshMaterializedViewQuery(this.config);
    }
    toSQL() {
      const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
      return rest;
    }
    _prepare(name) {
      return import_tracing.tracer.startActiveSpan("drizzle.prepareQuery", () => {
        return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), undefined, name, true);
      });
    }
    prepare(name) {
      return this._prepare(name);
    }
    execute = (placeholderValues) => {
      return import_tracing.tracer.startActiveSpan("drizzle.operation", () => {
        return this._prepare().execute(placeholderValues);
      });
    };
  }
});

// node_modules/drizzle-orm/pg-core/query-builders/select.types.cjs
var require_select_types = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var select_types_exports = {};
  module.exports = __toCommonJS2(select_types_exports);
});

// node_modules/drizzle-orm/pg-core/query-builders/update.cjs
var require_update = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var update_exports = {};
  __export2(update_exports, {
    PgUpdateBase: () => PgUpdateBase,
    PgUpdateBuilder: () => PgUpdateBuilder
  });
  module.exports = __toCommonJS2(update_exports);
  var import_entity = require_entity();
  var import_query_promise = require_query_promise();
  var import_table = require_table();
  var import_utils = require_utils2();

  class PgUpdateBuilder {
    constructor(table, session, dialect, withList) {
      this.table = table;
      this.session = session;
      this.dialect = dialect;
      this.withList = withList;
    }
    static [import_entity.entityKind] = "PgUpdateBuilder";
    set(values) {
      return new PgUpdateBase(this.table, (0, import_utils.mapUpdateSet)(this.table, values), this.session, this.dialect, this.withList);
    }
  }

  class PgUpdateBase extends import_query_promise.QueryPromise {
    constructor(table, set, session, dialect, withList) {
      super();
      this.session = session;
      this.dialect = dialect;
      this.config = { set, table, withList };
    }
    static [import_entity.entityKind] = "PgUpdate";
    config;
    where(where) {
      this.config.where = where;
      return this;
    }
    returning(fields = this.config.table[import_table.Table.Symbol.Columns]) {
      this.config.returning = (0, import_utils.orderSelectedFields)(fields);
      return this;
    }
    getSQL() {
      return this.dialect.buildUpdateQuery(this.config);
    }
    toSQL() {
      const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
      return rest;
    }
    _prepare(name) {
      return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true);
    }
    prepare(name) {
      return this._prepare(name);
    }
    execute = (placeholderValues) => {
      return this._prepare().execute(placeholderValues);
    };
    $dynamic() {
      return this;
    }
  }
});

// node_modules/drizzle-orm/pg-core/query-builders/index.cjs
var require_query_builders = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var query_builders_exports = {};
  module.exports = __toCommonJS2(query_builders_exports);
  __reExport(query_builders_exports, require_delete(), module.exports);
  __reExport(query_builders_exports, require_insert(), module.exports);
  __reExport(query_builders_exports, require_query_builder2(), module.exports);
  __reExport(query_builders_exports, require_refresh_materialized_view(), module.exports);
  __reExport(query_builders_exports, require_select2(), module.exports);
  __reExport(query_builders_exports, require_select_types(), module.exports);
  __reExport(query_builders_exports, require_update(), module.exports);
});

// node_modules/drizzle-orm/pg-core/query-builders/query.cjs
var require_query = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var query_exports = {};
  __export2(query_exports, {
    PgRelationalQuery: () => PgRelationalQuery,
    RelationalQueryBuilder: () => RelationalQueryBuilder
  });
  module.exports = __toCommonJS2(query_exports);
  var import_entity = require_entity();
  var import_query_promise = require_query_promise();
  var import_relations = require_relations();
  var import_tracing = require_tracing();

  class RelationalQueryBuilder {
    constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session) {
      this.fullSchema = fullSchema;
      this.schema = schema;
      this.tableNamesMap = tableNamesMap;
      this.table = table;
      this.tableConfig = tableConfig;
      this.dialect = dialect;
      this.session = session;
    }
    static [import_entity.entityKind] = "PgRelationalQueryBuilder";
    findMany(config) {
      return new PgRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? config : {}, "many");
    }
    findFirst(config) {
      return new PgRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? { ...config, limit: 1 } : { limit: 1 }, "first");
    }
  }

  class PgRelationalQuery extends import_query_promise.QueryPromise {
    constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session, config, mode) {
      super();
      this.fullSchema = fullSchema;
      this.schema = schema;
      this.tableNamesMap = tableNamesMap;
      this.table = table;
      this.tableConfig = tableConfig;
      this.dialect = dialect;
      this.session = session;
      this.config = config;
      this.mode = mode;
    }
    static [import_entity.entityKind] = "PgRelationalQuery";
    _prepare(name) {
      return import_tracing.tracer.startActiveSpan("drizzle.prepareQuery", () => {
        const { query, builtQuery } = this._toSQL();
        return this.session.prepareQuery(builtQuery, undefined, name, true, (rawRows, mapColumnValue) => {
          const rows = rawRows.map((row) => (0, import_relations.mapRelationalRow)(this.schema, this.tableConfig, row, query.selection, mapColumnValue));
          if (this.mode === "first") {
            return rows[0];
          }
          return rows;
        });
      });
    }
    prepare(name) {
      return this._prepare(name);
    }
    _getQuery() {
      return this.dialect.buildRelationalQueryWithoutPK({
        fullSchema: this.fullSchema,
        schema: this.schema,
        tableNamesMap: this.tableNamesMap,
        table: this.table,
        tableConfig: this.tableConfig,
        queryConfig: this.config,
        tableAlias: this.tableConfig.tsName
      });
    }
    getSQL() {
      return this._getQuery().sql;
    }
    _toSQL() {
      const query = this._getQuery();
      const builtQuery = this.dialect.sqlToQuery(query.sql);
      return { query, builtQuery };
    }
    toSQL() {
      return this._toSQL().builtQuery;
    }
    execute() {
      return import_tracing.tracer.startActiveSpan("drizzle.operation", () => {
        return this._prepare().execute();
      });
    }
  }
});

// node_modules/drizzle-orm/pg-core/query-builders/raw.cjs
var require_raw = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var raw_exports = {};
  __export2(raw_exports, {
    PgRaw: () => PgRaw
  });
  module.exports = __toCommonJS2(raw_exports);
  var import_entity = require_entity();
  var import_query_promise = require_query_promise();

  class PgRaw extends import_query_promise.QueryPromise {
    constructor(execute, sql, query, mapBatchResult) {
      super();
      this.execute = execute;
      this.sql = sql;
      this.query = query;
      this.mapBatchResult = mapBatchResult;
    }
    static [import_entity.entityKind] = "PgRaw";
    getSQL() {
      return this.sql;
    }
    getQuery() {
      return this.query;
    }
    mapResult(result, isFromBatch) {
      return isFromBatch ? this.mapBatchResult(result) : result;
    }
    _prepare() {
      return this;
    }
    isResponseInArrayMode() {
      return false;
    }
  }
});

// node_modules/drizzle-orm/pg-core/db.cjs
var require_db = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var db_exports = {};
  __export2(db_exports, {
    PgDatabase: () => PgDatabase,
    withReplicas: () => withReplicas
  });
  module.exports = __toCommonJS2(db_exports);
  var import_entity = require_entity();
  var import_query_builders = require_query_builders();
  var import_selection_proxy = require_selection_proxy();
  var import_subquery = require_subquery();
  var import_query = require_query();
  var import_raw = require_raw();
  var import_refresh_materialized_view = require_refresh_materialized_view();

  class PgDatabase {
    constructor(dialect, session, schema) {
      this.dialect = dialect;
      this.session = session;
      this._ = schema ? {
        schema: schema.schema,
        fullSchema: schema.fullSchema,
        tableNamesMap: schema.tableNamesMap,
        session
      } : {
        schema: undefined,
        fullSchema: {},
        tableNamesMap: {},
        session
      };
      this.query = {};
      if (this._.schema) {
        for (const [tableName, columns] of Object.entries(this._.schema)) {
          this.query[tableName] = new import_query.RelationalQueryBuilder(schema.fullSchema, this._.schema, this._.tableNamesMap, schema.fullSchema[tableName], columns, dialect, session);
        }
      }
    }
    static [import_entity.entityKind] = "PgDatabase";
    query;
    $with(alias) {
      return {
        as(qb) {
          if (typeof qb === "function") {
            qb = qb(new import_query_builders.QueryBuilder);
          }
          return new Proxy(new import_subquery.WithSubquery(qb.getSQL(), qb.getSelectedFields(), alias, true), new import_selection_proxy.SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" }));
        }
      };
    }
    with(...queries) {
      const self = this;
      function select(fields) {
        return new import_query_builders.PgSelectBuilder({
          fields: fields ?? undefined,
          session: self.session,
          dialect: self.dialect,
          withList: queries
        });
      }
      function selectDistinct(fields) {
        return new import_query_builders.PgSelectBuilder({
          fields: fields ?? undefined,
          session: self.session,
          dialect: self.dialect,
          withList: queries,
          distinct: true
        });
      }
      function selectDistinctOn(on, fields) {
        return new import_query_builders.PgSelectBuilder({
          fields: fields ?? undefined,
          session: self.session,
          dialect: self.dialect,
          withList: queries,
          distinct: { on }
        });
      }
      function update(table) {
        return new import_query_builders.PgUpdateBuilder(table, self.session, self.dialect, queries);
      }
      function insert(table) {
        return new import_query_builders.PgInsertBuilder(table, self.session, self.dialect, queries);
      }
      function delete_(table) {
        return new import_query_builders.PgDeleteBase(table, self.session, self.dialect, queries);
      }
      return { select, selectDistinct, selectDistinctOn, update, insert, delete: delete_ };
    }
    select(fields) {
      return new import_query_builders.PgSelectBuilder({
        fields: fields ?? undefined,
        session: this.session,
        dialect: this.dialect
      });
    }
    selectDistinct(fields) {
      return new import_query_builders.PgSelectBuilder({
        fields: fields ?? undefined,
        session: this.session,
        dialect: this.dialect,
        distinct: true
      });
    }
    selectDistinctOn(on, fields) {
      return new import_query_builders.PgSelectBuilder({
        fields: fields ?? undefined,
        session: this.session,
        dialect: this.dialect,
        distinct: { on }
      });
    }
    update(table) {
      return new import_query_builders.PgUpdateBuilder(table, this.session, this.dialect);
    }
    insert(table) {
      return new import_query_builders.PgInsertBuilder(table, this.session, this.dialect);
    }
    delete(table) {
      return new import_query_builders.PgDeleteBase(table, this.session, this.dialect);
    }
    refreshMaterializedView(view) {
      return new import_refresh_materialized_view.PgRefreshMaterializedView(view, this.session, this.dialect);
    }
    execute(query) {
      const sql = query.getSQL();
      const builtQuery = this.dialect.sqlToQuery(sql);
      const prepared = this.session.prepareQuery(builtQuery, undefined, undefined, false);
      return new import_raw.PgRaw(() => prepared.execute(), sql, builtQuery, (result) => prepared.mapResult(result, true));
    }
    transaction(transaction, config) {
      return this.session.transaction(transaction, config);
    }
  }
  var withReplicas = (primary, replicas, getReplica = () => replicas[Math.floor(Math.random() * replicas.length)]) => {
    const select = (...args) => getReplica(replicas).select(...args);
    const selectDistinct = (...args) => getReplica(replicas).selectDistinct(...args);
    const selectDistinctOn = (...args) => getReplica(replicas).selectDistinctOn(...args);
    const $with = (...args) => getReplica(replicas).with(...args);
    const update = (...args) => primary.update(...args);
    const insert = (...args) => primary.insert(...args);
    const $delete = (...args) => primary.delete(...args);
    const execute = (...args) => primary.execute(...args);
    const transaction = (...args) => primary.transaction(...args);
    const refreshMaterializedView = (...args) => primary.refreshMaterializedView(...args);
    return {
      ...primary,
      update,
      insert,
      delete: $delete,
      execute,
      transaction,
      refreshMaterializedView,
      $primary: primary,
      select,
      selectDistinct,
      selectDistinctOn,
      with: $with,
      get query() {
        return getReplica(replicas).query;
      }
    };
  };
});

// node_modules/drizzle-orm/pg-core/indexes.cjs
var require_indexes = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var indexes_exports = {};
  __export2(indexes_exports, {
    Index: () => Index,
    IndexBuilder: () => IndexBuilder,
    IndexBuilderOn: () => IndexBuilderOn,
    index: () => index,
    uniqueIndex: () => uniqueIndex
  });
  module.exports = __toCommonJS2(indexes_exports);
  var import_sql = require_sql();
  var import_entity = require_entity();
  var import_columns = require_columns();

  class IndexBuilderOn {
    constructor(unique, name) {
      this.unique = unique;
      this.name = name;
    }
    static [import_entity.entityKind] = "PgIndexBuilderOn";
    on(...columns) {
      return new IndexBuilder(columns.map((it) => {
        if ((0, import_entity.is)(it, import_sql.SQL)) {
          return it;
        }
        it = it;
        const clonedIndexedColumn = new import_columns.IndexedColumn(it.name, it.columnType, it.indexConfig);
        it.indexConfig = JSON.parse(JSON.stringify(it.defaultConfig));
        return clonedIndexedColumn;
      }), this.unique, false, this.name);
    }
    onOnly(...columns) {
      return new IndexBuilder(columns.map((it) => {
        if ((0, import_entity.is)(it, import_sql.SQL)) {
          return it;
        }
        it = it;
        const clonedIndexedColumn = new import_columns.IndexedColumn(it.name, it.columnType, it.indexConfig);
        it.indexConfig = it.defaultConfig;
        return clonedIndexedColumn;
      }), this.unique, true, this.name);
    }
    using(method, ...columns) {
      return new IndexBuilder(columns.map((it) => {
        if ((0, import_entity.is)(it, import_sql.SQL)) {
          return it;
        }
        it = it;
        const clonedIndexedColumn = new import_columns.IndexedColumn(it.name, it.columnType, it.indexConfig);
        it.indexConfig = JSON.parse(JSON.stringify(it.defaultConfig));
        return clonedIndexedColumn;
      }), this.unique, true, this.name, method);
    }
  }

  class IndexBuilder {
    static [import_entity.entityKind] = "PgIndexBuilder";
    config;
    constructor(columns, unique, only, name, method = "btree") {
      this.config = {
        name,
        columns,
        unique,
        only,
        method
      };
    }
    concurrently() {
      this.config.concurrently = true;
      return this;
    }
    with(obj) {
      this.config.with = obj;
      return this;
    }
    where(condition) {
      this.config.where = condition;
      return this;
    }
    build(table) {
      return new Index(this.config, table);
    }
  }

  class Index {
    static [import_entity.entityKind] = "PgIndex";
    config;
    constructor(config, table) {
      this.config = { ...config, table };
    }
  }
  function index(name) {
    return new IndexBuilderOn(false, name);
  }
  function uniqueIndex(name) {
    return new IndexBuilderOn(true, name);
  }
});

// node_modules/drizzle-orm/pg-core/sequence.cjs
var require_sequence = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var sequence_exports = {};
  __export2(sequence_exports, {
    PgSequence: () => PgSequence,
    isPgSequence: () => isPgSequence,
    pgSequence: () => pgSequence,
    pgSequenceWithSchema: () => pgSequenceWithSchema
  });
  module.exports = __toCommonJS2(sequence_exports);
  var import_entity = require_entity();

  class PgSequence {
    constructor(seqName, seqOptions, schema) {
      this.seqName = seqName;
      this.seqOptions = seqOptions;
      this.schema = schema;
    }
    static [import_entity.entityKind] = "PgSequence";
  }
  function pgSequence(name, options) {
    return pgSequenceWithSchema(name, options, undefined);
  }
  function pgSequenceWithSchema(name, options, schema) {
    return new PgSequence(name, options, schema);
  }
  function isPgSequence(obj) {
    return (0, import_entity.is)(obj, PgSequence);
  }
});

// node_modules/drizzle-orm/pg-core/view-common.cjs
var require_view_common2 = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var view_common_exports = {};
  __export2(view_common_exports, {
    PgViewConfig: () => PgViewConfig
  });
  module.exports = __toCommonJS2(view_common_exports);
  var PgViewConfig = Symbol.for("drizzle:PgViewConfig");
});

// node_modules/drizzle-orm/pg-core/view.cjs
var require_view = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var view_exports = {};
  __export2(view_exports, {
    DefaultViewBuilderCore: () => DefaultViewBuilderCore,
    ManualMaterializedViewBuilder: () => ManualMaterializedViewBuilder,
    ManualViewBuilder: () => ManualViewBuilder,
    MaterializedViewBuilder: () => MaterializedViewBuilder,
    MaterializedViewBuilderCore: () => MaterializedViewBuilderCore,
    PgMaterializedView: () => PgMaterializedView,
    PgMaterializedViewConfig: () => PgMaterializedViewConfig,
    PgView: () => PgView,
    ViewBuilder: () => ViewBuilder,
    pgMaterializedView: () => pgMaterializedView,
    pgMaterializedViewWithSchema: () => pgMaterializedViewWithSchema,
    pgView: () => pgView,
    pgViewWithSchema: () => pgViewWithSchema
  });
  module.exports = __toCommonJS2(view_exports);
  var import_entity = require_entity();
  var import_selection_proxy = require_selection_proxy();
  var import_utils = require_utils2();
  var import_query_builder = require_query_builder2();
  var import_table = require_table2();
  var import_view_base = require_view_base();
  var import_view_common = require_view_common2();

  class DefaultViewBuilderCore {
    constructor(name, schema) {
      this.name = name;
      this.schema = schema;
    }
    static [import_entity.entityKind] = "PgDefaultViewBuilderCore";
    config = {};
    with(config) {
      this.config.with = config;
      return this;
    }
  }

  class ViewBuilder extends DefaultViewBuilderCore {
    static [import_entity.entityKind] = "PgViewBuilder";
    as(qb) {
      if (typeof qb === "function") {
        qb = qb(new import_query_builder.QueryBuilder);
      }
      const selectionProxy = new import_selection_proxy.SelectionProxyHandler({
        alias: this.name,
        sqlBehavior: "error",
        sqlAliasedBehavior: "alias",
        replaceOriginalName: true
      });
      const aliasedSelection = new Proxy(qb.getSelectedFields(), selectionProxy);
      return new Proxy(new PgView({
        pgConfig: this.config,
        config: {
          name: this.name,
          schema: this.schema,
          selectedFields: aliasedSelection,
          query: qb.getSQL().inlineParams()
        }
      }), selectionProxy);
    }
  }

  class ManualViewBuilder extends DefaultViewBuilderCore {
    static [import_entity.entityKind] = "PgManualViewBuilder";
    columns;
    constructor(name, columns, schema) {
      super(name, schema);
      this.columns = (0, import_utils.getTableColumns)((0, import_table.pgTable)(name, columns));
    }
    existing() {
      return new Proxy(new PgView({
        pgConfig: undefined,
        config: {
          name: this.name,
          schema: this.schema,
          selectedFields: this.columns,
          query: undefined
        }
      }), new import_selection_proxy.SelectionProxyHandler({
        alias: this.name,
        sqlBehavior: "error",
        sqlAliasedBehavior: "alias",
        replaceOriginalName: true
      }));
    }
    as(query) {
      return new Proxy(new PgView({
        pgConfig: this.config,
        config: {
          name: this.name,
          schema: this.schema,
          selectedFields: this.columns,
          query: query.inlineParams()
        }
      }), new import_selection_proxy.SelectionProxyHandler({
        alias: this.name,
        sqlBehavior: "error",
        sqlAliasedBehavior: "alias",
        replaceOriginalName: true
      }));
    }
  }

  class MaterializedViewBuilderCore {
    constructor(name, schema) {
      this.name = name;
      this.schema = schema;
    }
    static [import_entity.entityKind] = "PgMaterializedViewBuilderCore";
    config = {};
    using(using) {
      this.config.using = using;
      return this;
    }
    with(config) {
      this.config.with = config;
      return this;
    }
    tablespace(tablespace) {
      this.config.tablespace = tablespace;
      return this;
    }
    withNoData() {
      this.config.withNoData = true;
      return this;
    }
  }

  class MaterializedViewBuilder extends MaterializedViewBuilderCore {
    static [import_entity.entityKind] = "PgMaterializedViewBuilder";
    as(qb) {
      if (typeof qb === "function") {
        qb = qb(new import_query_builder.QueryBuilder);
      }
      const selectionProxy = new import_selection_proxy.SelectionProxyHandler({
        alias: this.name,
        sqlBehavior: "error",
        sqlAliasedBehavior: "alias",
        replaceOriginalName: true
      });
      const aliasedSelection = new Proxy(qb.getSelectedFields(), selectionProxy);
      return new Proxy(new PgMaterializedView({
        pgConfig: {
          with: this.config.with,
          using: this.config.using,
          tablespace: this.config.tablespace,
          withNoData: this.config.withNoData
        },
        config: {
          name: this.name,
          schema: this.schema,
          selectedFields: aliasedSelection,
          query: qb.getSQL().inlineParams()
        }
      }), selectionProxy);
    }
  }

  class ManualMaterializedViewBuilder extends MaterializedViewBuilderCore {
    static [import_entity.entityKind] = "PgManualMaterializedViewBuilder";
    columns;
    constructor(name, columns, schema) {
      super(name, schema);
      this.columns = (0, import_utils.getTableColumns)((0, import_table.pgTable)(name, columns));
    }
    existing() {
      return new Proxy(new PgMaterializedView({
        pgConfig: undefined,
        config: {
          name: this.name,
          schema: this.schema,
          selectedFields: this.columns,
          query: undefined
        }
      }), new import_selection_proxy.SelectionProxyHandler({
        alias: this.name,
        sqlBehavior: "error",
        sqlAliasedBehavior: "alias",
        replaceOriginalName: true
      }));
    }
    as(query) {
      return new Proxy(new PgMaterializedView({
        pgConfig: undefined,
        config: {
          name: this.name,
          schema: this.schema,
          selectedFields: this.columns,
          query: query.inlineParams()
        }
      }), new import_selection_proxy.SelectionProxyHandler({
        alias: this.name,
        sqlBehavior: "error",
        sqlAliasedBehavior: "alias",
        replaceOriginalName: true
      }));
    }
  }

  class PgView extends import_view_base.PgViewBase {
    static [import_entity.entityKind] = "PgView";
    [import_view_common.PgViewConfig];
    constructor({ pgConfig, config }) {
      super(config);
      if (pgConfig) {
        this[import_view_common.PgViewConfig] = {
          with: pgConfig.with
        };
      }
    }
  }
  var PgMaterializedViewConfig = Symbol.for("drizzle:PgMaterializedViewConfig");

  class PgMaterializedView extends import_view_base.PgViewBase {
    static [import_entity.entityKind] = "PgMaterializedView";
    [PgMaterializedViewConfig];
    constructor({ pgConfig, config }) {
      super(config);
      this[PgMaterializedViewConfig] = {
        with: pgConfig?.with,
        using: pgConfig?.using,
        tablespace: pgConfig?.tablespace,
        withNoData: pgConfig?.withNoData
      };
    }
  }
  function pgViewWithSchema(name, selection, schema) {
    if (selection) {
      return new ManualViewBuilder(name, selection, schema);
    }
    return new ViewBuilder(name, schema);
  }
  function pgMaterializedViewWithSchema(name, selection, schema) {
    if (selection) {
      return new ManualMaterializedViewBuilder(name, selection, schema);
    }
    return new MaterializedViewBuilder(name, schema);
  }
  function pgView(name, columns) {
    return pgViewWithSchema(name, columns, undefined);
  }
  function pgMaterializedView(name, columns) {
    return pgMaterializedViewWithSchema(name, columns, undefined);
  }
});

// node_modules/drizzle-orm/pg-core/schema.cjs
var require_schema = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var schema_exports = {};
  __export2(schema_exports, {
    PgSchema: () => PgSchema,
    isPgSchema: () => isPgSchema,
    pgSchema: () => pgSchema
  });
  module.exports = __toCommonJS2(schema_exports);
  var import_entity = require_entity();
  var import_sql = require_sql();
  var import_enum = require_enum();
  var import_sequence = require_sequence();
  var import_table = require_table2();
  var import_view = require_view();

  class PgSchema {
    constructor(schemaName) {
      this.schemaName = schemaName;
    }
    static [import_entity.entityKind] = "PgSchema";
    table = (name, columns, extraConfig) => {
      return (0, import_table.pgTableWithSchema)(name, columns, extraConfig, this.schemaName);
    };
    view = (name, columns) => {
      return (0, import_view.pgViewWithSchema)(name, columns, this.schemaName);
    };
    materializedView = (name, columns) => {
      return (0, import_view.pgMaterializedViewWithSchema)(name, columns, this.schemaName);
    };
    enum = (name, values) => {
      return (0, import_enum.pgEnumWithSchema)(name, values, this.schemaName);
    };
    sequence = (name, options) => {
      return (0, import_sequence.pgSequenceWithSchema)(name, options, this.schemaName);
    };
    getSQL() {
      return new import_sql.SQL([import_sql.sql.identifier(this.schemaName)]);
    }
    shouldOmitSQLParens() {
      return true;
    }
  }
  function isPgSchema(obj) {
    return (0, import_entity.is)(obj, PgSchema);
  }
  function pgSchema(name) {
    if (name === "public") {
      throw new Error(`You can't specify 'public' as schema name. Postgres is using public schema by default. If you want to use 'public' schema, just use pgTable() instead of creating a schema`);
    }
    return new PgSchema(name);
  }
});

// node_modules/drizzle-orm/pg-core/session.cjs
var require_session = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var session_exports = {};
  __export2(session_exports, {
    PgPreparedQuery: () => PgPreparedQuery,
    PgSession: () => PgSession,
    PgTransaction: () => PgTransaction
  });
  module.exports = __toCommonJS2(session_exports);
  var import_entity = require_entity();
  var import_errors = require_errors();
  var import_sql = require_sql2();
  var import_tracing = require_tracing();
  var import_db = require_db();

  class PgPreparedQuery {
    constructor(query) {
      this.query = query;
    }
    getQuery() {
      return this.query;
    }
    mapResult(response, _isFromBatch) {
      return response;
    }
    static [import_entity.entityKind] = "PgPreparedQuery";
    joinsNotNullableMap;
  }

  class PgSession {
    constructor(dialect) {
      this.dialect = dialect;
    }
    static [import_entity.entityKind] = "PgSession";
    execute(query) {
      return import_tracing.tracer.startActiveSpan("drizzle.operation", () => {
        const prepared = import_tracing.tracer.startActiveSpan("drizzle.prepareQuery", () => {
          return this.prepareQuery(this.dialect.sqlToQuery(query), undefined, undefined, false);
        });
        return prepared.execute();
      });
    }
    all(query) {
      return this.prepareQuery(this.dialect.sqlToQuery(query), undefined, undefined, false).all();
    }
  }

  class PgTransaction extends import_db.PgDatabase {
    constructor(dialect, session, schema, nestedIndex = 0) {
      super(dialect, session, schema);
      this.schema = schema;
      this.nestedIndex = nestedIndex;
    }
    static [import_entity.entityKind] = "PgTransaction";
    rollback() {
      throw new import_errors.TransactionRollbackError;
    }
    getTransactionConfigSQL(config) {
      const chunks = [];
      if (config.isolationLevel) {
        chunks.push(`isolation level ${config.isolationLevel}`);
      }
      if (config.accessMode) {
        chunks.push(config.accessMode);
      }
      if (typeof config.deferrable === "boolean") {
        chunks.push(config.deferrable ? "deferrable" : "not deferrable");
      }
      return import_sql.sql.raw(chunks.join(" "));
    }
    setTransaction(config) {
      return this.session.execute(import_sql.sql`set transaction ${this.getTransactionConfigSQL(config)}`);
    }
  }
});

// node_modules/drizzle-orm/pg-core/subquery.cjs
var require_subquery2 = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var subquery_exports = {};
  module.exports = __toCommonJS2(subquery_exports);
});

// node_modules/drizzle-orm/pg-core/utils.cjs
var require_utils3 = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var utils_exports = {};
  __export2(utils_exports, {
    getMaterializedViewConfig: () => getMaterializedViewConfig,
    getTableConfig: () => getTableConfig,
    getViewConfig: () => getViewConfig
  });
  module.exports = __toCommonJS2(utils_exports);
  var import_entity = require_entity();
  var import_table = require_table2();
  var import_table2 = require_table();
  var import_view_common = require_view_common();
  var import_checks = require_checks();
  var import_foreign_keys = require_foreign_keys();
  var import_indexes = require_indexes();
  var import_primary_keys = require_primary_keys();
  var import_unique_constraint = require_unique_constraint();
  var import_view_common2 = require_view_common2();
  var import_view = require_view();
  function getTableConfig(table) {
    const columns = Object.values(table[import_table2.Table.Symbol.Columns]);
    const indexes = [];
    const checks = [];
    const primaryKeys = [];
    const foreignKeys = Object.values(table[import_table.PgTable.Symbol.InlineForeignKeys]);
    const uniqueConstraints = [];
    const name = table[import_table2.Table.Symbol.Name];
    const schema = table[import_table2.Table.Symbol.Schema];
    const extraConfigBuilder = table[import_table.PgTable.Symbol.ExtraConfigBuilder];
    if (extraConfigBuilder !== undefined) {
      const extraConfig = extraConfigBuilder(table[import_table2.Table.Symbol.ExtraConfigColumns]);
      for (const builder of Object.values(extraConfig)) {
        if ((0, import_entity.is)(builder, import_indexes.IndexBuilder)) {
          indexes.push(builder.build(table));
        } else if ((0, import_entity.is)(builder, import_checks.CheckBuilder)) {
          checks.push(builder.build(table));
        } else if ((0, import_entity.is)(builder, import_unique_constraint.UniqueConstraintBuilder)) {
          uniqueConstraints.push(builder.build(table));
        } else if ((0, import_entity.is)(builder, import_primary_keys.PrimaryKeyBuilder)) {
          primaryKeys.push(builder.build(table));
        } else if ((0, import_entity.is)(builder, import_foreign_keys.ForeignKeyBuilder)) {
          foreignKeys.push(builder.build(table));
        }
      }
    }
    return {
      columns,
      indexes,
      foreignKeys,
      checks,
      primaryKeys,
      uniqueConstraints,
      name,
      schema
    };
  }
  function getViewConfig(view) {
    return {
      ...view[import_view_common.ViewBaseConfig],
      ...view[import_view_common2.PgViewConfig]
    };
  }
  function getMaterializedViewConfig(view) {
    return {
      ...view[import_view_common.ViewBaseConfig],
      ...view[import_view.PgMaterializedViewConfig]
    };
  }
});

// node_modules/drizzle-orm/pg-core/utils/index.cjs
var require_utils4 = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var utils_exports = {};
  module.exports = __toCommonJS2(utils_exports);
  __reExport(utils_exports, require_array(), module.exports);
});

// node_modules/drizzle-orm/pg-core/index.cjs
var require_pg_core = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
  var __toCommonJS2 = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var pg_core_exports = {};
  module.exports = __toCommonJS2(pg_core_exports);
  __reExport(pg_core_exports, require_alias2(), module.exports);
  __reExport(pg_core_exports, require_checks(), module.exports);
  __reExport(pg_core_exports, require_columns(), module.exports);
  __reExport(pg_core_exports, require_db(), module.exports);
  __reExport(pg_core_exports, require_dialect(), module.exports);
  __reExport(pg_core_exports, require_foreign_keys(), module.exports);
  __reExport(pg_core_exports, require_indexes(), module.exports);
  __reExport(pg_core_exports, require_primary_keys(), module.exports);
  __reExport(pg_core_exports, require_query_builders(), module.exports);
  __reExport(pg_core_exports, require_schema(), module.exports);
  __reExport(pg_core_exports, require_sequence(), module.exports);
  __reExport(pg_core_exports, require_session(), module.exports);
  __reExport(pg_core_exports, require_subquery2(), module.exports);
  __reExport(pg_core_exports, require_table2(), module.exports);
  __reExport(pg_core_exports, require_unique_constraint(), module.exports);
  __reExport(pg_core_exports, require_utils3(), module.exports);
  __reExport(pg_core_exports, require_utils4(), module.exports);
  __reExport(pg_core_exports, require_view_common2(), module.exports);
  __reExport(pg_core_exports, require_view(), module.exports);
});

// src/infraestructura/base-de-datos/esquemas/esquema-auditoria.ts
var pgTableImpl, uuidImpl, varcharImpl, jsonbImpl, timestampImpl, auditoria_cambios;
var init_esquema_auditoria = __esm(() => {
  try {
    const core = require_pg_core();
    pgTableImpl = core.pgTable;
    uuidImpl = core.uuid;
    varcharImpl = core.varchar;
    jsonbImpl = core.jsonb;
    timestampImpl = core.timestamp;
  } catch (_err) {
    pgTableImpl = null;
    uuidImpl = null;
    varcharImpl = null;
    jsonbImpl = null;
    timestampImpl = null;
  }
  auditoria_cambios = pgTableImpl ? pgTableImpl("auditoria_cambios", {
    id: uuidImpl("id").defaultRandom().primaryKey(),
    entidad: varcharImpl("entidad", { length: 100 }).notNull(),
    entidad_id: uuidImpl("entidad_id").notNull(),
    operacion: varcharImpl("operacion", { length: 20 }).notNull(),
    autor_id: uuidImpl("autor_id").notNull(),
    timestamp: timestampImpl("timestamp").defaultNow().notNull(),
    diff: jsonbImpl("diff"),
    git_ref: varcharImpl("git_ref", { length: 255 })
  }) : {};
});

// src/infraestructura/base-de-datos/utilidades/chequeo-auditoria.ts
var _cacheResultado = null, hayTriggersAuditoria = async (db) => {
  if (_cacheResultado !== null)
    return _cacheResultado;
  try {
    const sql = `
      SELECT
        (SELECT COUNT(*) FROM pg_proc WHERE proname = 'fn_registrar_auditoria') AS funciones,
        (SELECT COUNT(*) FROM pg_trigger WHERE tgname IN ('tg_auditar_glosario','tg_auditar_adrs')) AS triggers
    `;
    const res = await db.query?.(sql);
    if (!res) {
      const alt = await db.execute?.(sql);
      if (!alt)
        return _cacheResultado = false;
      const row2 = alt[0] ?? alt?.rows?.[0];
      _cacheResultado = Boolean(Number(row2?.funciones || row2?.funciones) + Number(row2?.triggers || row2?.triggers));
      return _cacheResultado;
    }
    const row = Array.isArray(res) ? res[0] : res.rows?.[0] ?? res[0];
    _cacheResultado = Boolean(Number(row.funciones ?? 0) + Number(row.triggers ?? 0));
    return _cacheResultado;
  } catch (_err) {
    _cacheResultado = false;
    return _cacheResultado;
  }
};

// src/infraestructura/base-de-datos/esquemas/esquema-glosario.ts
var exports_esquema_glosario = {};
__export(exports_esquema_glosario, {
  glosario_terminos: () => glosario_terminos,
  glosarioTabla: () => glosarioTabla
});
var pgTable, text, timestamp, placeholder = false, glosarioTabla, pgTableImpl2, uuidImpl2, varcharImpl2, textImpl, timestampImpl2, jsonbImpl2, integerImpl, indexImpl, glosario_terminos;
var init_esquema_glosario = __esm(() => {
  try {
    const drizzleCore = require_pg_core();
    pgTable = drizzleCore.pgTable;
    text = drizzleCore.text;
    timestamp = drizzleCore.timestamp;
  } catch (e) {
    placeholder = true;
    pgTable = (name, _def) => ({ __placeholder: true, __name: name });
    text = (_n) => ({ __placeholder: true, __name: _n });
    timestamp = (_n) => ({ __placeholder: true, __name: _n, defaultNow: () => ({}) });
  }
  glosarioTabla = pgTable("glosario", {
    id: text("id").primaryKey?.() ?? undefined,
    termino: text("termino").notNull?.() ?? undefined,
    definicion: text("definicion").notNull?.() ?? undefined,
    estado: text("estado").notNull?.() ?? undefined,
    autor: text("autor") ?? undefined,
    creado_en: timestamp("creado_en").defaultNow?.() ?? undefined
  });
  try {
    const core = require_pg_core();
    pgTableImpl2 = core.pgTable;
    uuidImpl2 = core.uuid;
    varcharImpl2 = core.varchar;
    textImpl = core.text;
    timestampImpl2 = core.timestamp;
    jsonbImpl2 = core.jsonb;
    integerImpl = core.integer;
    indexImpl = core.index;
  } catch (_err) {
    pgTableImpl2 = null;
  }
  glosario_terminos = pgTableImpl2 ? pgTableImpl2("glosario_terminos", {
    id: uuidImpl2("id").defaultRandom().primaryKey(),
    identificador_inquilino: uuidImpl2("identificador_inquilino").notNull(),
    termino: varcharImpl2("termino", { length: 120 }).notNull(),
    slug: varcharImpl2("slug", { length: 150 }).notNull(),
    definicion: textImpl("definicion").notNull(),
    categoria: varcharImpl2("categoria", { length: 50 }).notNull(),
    traduccion: varcharImpl2("traduccion", { length: 255 }),
    idioma_origen: varcharImpl2("idioma_origen", { length: 5 }).notNull().default("es"),
    estado: varcharImpl2("estado", { length: 20 }).notNull().default("PENDIENTE"),
    autor_id: uuidImpl2("autor_id").notNull(),
    fecha_creacion: timestampImpl2("fecha_creacion").defaultNow().notNull(),
    fecha_actualizacion: timestampImpl2("fecha_actualizacion").defaultNow().notNull(),
    metadatos: jsonbImpl2("metadatos").notNull().default("{}"),
    version: integerImpl("version").notNull().default(1),
    aprobado_por: uuidImpl2("aprobado_por"),
    comentario_revision: textImpl("comentario_revision")
  }, (tabla) => ({
    idx_inquilino_termino: indexImpl("idx_inquilino_termino").on(tabla.identificador_inquilino, tabla.termino)
  })) : {};
});

// src/infraestructura/repositorios/repositorio-glosario.ts
var exports_repositorio_glosario = {};
__export(exports_repositorio_glosario, {
  obtenerTerminoPorId: () => obtenerTerminoPorId,
  obtenerListaGlosario: () => obtenerListaGlosario,
  eliminarGlosario: () => eliminarGlosario,
  crearGlosario: () => crearGlosario,
  actualizarGlosario: () => actualizarGlosario
});
var crearGlosario = async (db, datos, identificadorInquilino, autorId) => {
  try {
    const mod = await import("../../../nucleo/servicios/servicio-validacion-creacion").catch(() => ({ validarYRegistrarNombre: async () => {} }));
    const { validarYRegistrarNombre: validarYRegistrarNombre2 } = mod;
    await validarYRegistrarNombre2(datos.slug ?? datos.termino);
  } catch (_err) {}
  const { glosario_terminos: glosario_terminos2 } = await Promise.resolve().then(() => (init_esquema_glosario(), exports_esquema_glosario));
  const resultado = await db.insert(glosario_terminos2).values({
    identificador_inquilino: identificadorInquilino,
    termino: datos.termino,
    slug: datos.slug ?? datos.termino.toLowerCase().replace(/\s+/g, "-"),
    definicion: datos.definicion,
    categoria: datos.categoria,
    traduccion: datos.traduccion ?? null,
    idioma_origen: datos.idioma_origen ?? "es",
    estado: "PENDIENTE",
    autor_id: autorId,
    metadatos: datos.metadatos ?? {}
  }).returning("*");
  try {
    const tieneTriggers = await hayTriggersAuditoria(db);
    if (!tieneTriggers) {
      await db.insert(auditoria_cambios).values({
        entidad: "glosario_terminos",
        entidad_id: resultado[0].id,
        operacion: "CREAR",
        autor_id: autorId,
        diff: { nueva: resultado[0] },
        git_ref: datos.git_ref ?? null
      }).execute?.();
    }
  } catch (_err) {}
  return resultado[0];
}, obtenerListaGlosario = async (db, filtros, identificadorInquilino) => {
  const { glosario_terminos: glosario_terminos2 } = await Promise.resolve().then(() => (init_esquema_glosario(), exports_esquema_glosario));
  const qb = db.select().from(glosario_terminos2).where({ identificador_inquilino: identificadorInquilino });
  if (filtros.estado)
    qb.where({ estado: filtros.estado });
  if (filtros.limit)
    qb.limit(filtros.limit);
  if (filtros.offset)
    qb.offset(filtros.offset);
  const rows = await qb.execute();
  return rows;
}, obtenerTerminoPorId = async (db, id, identificadorInquilino) => {
  const { glosario_terminos: glosario_terminos2 } = await Promise.resolve().then(() => (init_esquema_glosario(), exports_esquema_glosario));
  const row = await db.select().from(glosario_terminos2).where({ id, identificador_inquilino: identificadorInquilino }).limit(1).execute();
  return row[0] ?? null;
}, actualizarGlosario = async (db, id, cambios, identificadorInquilino) => {
  const { glosario_terminos: glosario_terminos2 } = await Promise.resolve().then(() => (init_esquema_glosario(), exports_esquema_glosario));
  const resultado = await db.update(glosario_terminos2).set({ ...cambios }).where({ id, identificador_inquilino: identificadorInquilino }).returning("*");
  try {
    const tieneTriggers = await hayTriggersAuditoria(db);
    if (!tieneTriggers) {
      await db.insert(auditoria_cambios).values({
        entidad: "glosario_terminos",
        entidad_id: resultado[0].id,
        operacion: "ACTUALIZAR",
        autor_id: cambios.autor_id ?? resultado[0].autor_id,
        diff: { despues: resultado[0] },
        git_ref: cambios.git_ref ?? null
      }).execute?.();
    }
  } catch (_err) {}
  return resultado[0];
}, eliminarGlosario = async (db, id, identificadorInquilino) => {
  const { glosario_terminos: glosario_terminos2 } = await Promise.resolve().then(() => (init_esquema_glosario(), exports_esquema_glosario));
  const resultado = await db.delete(glosario_terminos2).where({ id, identificador_inquilino: identificadorInquilino }).returning("id");
  try {
    const tieneTriggers = await hayTriggersAuditoria(db);
    if (!tieneTriggers) {
      await db.insert(auditoria_cambios).values({
        entidad: "glosario_terminos",
        entidad_id: resultado[0] ?? id,
        operacion: "ELIMINAR",
        autor_id: null,
        diff: null,
        git_ref: null
      }).execute?.();
    }
  } catch (_err) {}
  return resultado[0] ?? null;
};
var init_repositorio_glosario = __esm(() => {
  init_esquema_auditoria();
});

// src/infraestructura/base-de-datos/esquemas/esquema-adrs.ts
var exports_esquema_adrs = {};
__export(exports_esquema_adrs, {
  adrs: () => adrs
});
var pgTableImpl3, uuidImpl3, varcharImpl3, textImpl2, timestampImpl3, jsonbImpl3, integerImpl2, indexImpl2, adrs;
var init_esquema_adrs = __esm(() => {
  try {
    const core = require_pg_core();
    pgTableImpl3 = core.pgTable;
    uuidImpl3 = core.uuid;
    varcharImpl3 = core.varchar;
    textImpl2 = core.text;
    timestampImpl3 = core.timestamp;
    jsonbImpl3 = core.jsonb;
    integerImpl2 = core.integer;
    indexImpl2 = core.index;
  } catch (_err) {
    pgTableImpl3 = null;
  }
  adrs = pgTableImpl3 ? pgTableImpl3("adrs", {
    id: uuidImpl3("id").defaultRandom().primaryKey(),
    identificador_inquilino: uuidImpl3("identificador_inquilino").notNull(),
    numero: integerImpl2("numero").notNull(),
    slug: varcharImpl3("slug", { length: 200 }).notNull(),
    titulo: varcharImpl3("titulo", { length: 200 }).notNull(),
    estado: varcharImpl3("estado", { length: 20 }).notNull().default("BORRADOR"),
    autor_id: uuidImpl3("autor_id").notNull(),
    objetivo: textImpl2("objetivo").notNull(),
    decision: textImpl2("decision").notNull(),
    motivos: jsonbImpl3("motivos").notNull().default("[]"),
    alternativas: jsonbImpl3("alternativas").notNull().default("{}"),
    referencias: jsonbImpl3("referencias").notNull().default("[]"),
    fecha_creacion: timestampImpl3("fecha_creacion").defaultNow().notNull(),
    fecha_actualizacion: timestampImpl3("fecha_actualizacion").defaultNow().notNull(),
    fecha_aprobacion: timestampImpl3("fecha_aprobacion"),
    numero_version: integerImpl2("numero_version").notNull().default(1),
    notas_revision: textImpl2("notas_revision"),
    tags: jsonbImpl3("tags").notNull().default("[]"),
    archivo_markdown: textImpl2("archivo_markdown"),
    git_ref: varcharImpl3("git_ref", { length: 255 })
  }, (tabla) => ({
    idx_inquilino_numero: indexImpl2("idx_inquilino_numero").on(tabla.identificador_inquilino, tabla.numero)
  })) : {};
});

// src/infraestructura/repositorios/repositorio-adrs.ts
var exports_repositorio_adrs = {};
__export(exports_repositorio_adrs, {
  obtenerListaADRs: () => obtenerListaADRs,
  obtenerADRPorId: () => obtenerADRPorId,
  eliminarADR: () => eliminarADR,
  crearADR: () => crearADR,
  actualizarADR: () => actualizarADR
});
var crearADR = async (db, datos, identificadorInquilino, autorId) => {
  try {
    const { validarYRegistrarNombre: validarYRegistrarNombre2 } = await Promise.resolve().then(() => (init_servicio_validacion_creacion(), exports_servicio_validacion_creacion));
    await validarYRegistrarNombre2(datos.slug ?? (datos.archivo_markdown ?? "adr-" + (datos.numero ?? "0000")));
  } catch (_err) {}
  const { adrs: adrs2 } = await Promise.resolve().then(() => (init_esquema_adrs(), exports_esquema_adrs));
  const resultado = await db.insert(adrs2).values({
    identificador_inquilino: identificadorInquilino,
    numero: datos.numero,
    slug: datos.slug ?? (datos.numero ? String(datos.numero).padStart(4, "0") : "0000"),
    titulo: datos.titulo,
    estado: "BORRADOR",
    autor_id: autorId,
    objetivo: datos.objetivo,
    decision: datos.decision,
    motivos: datos.motivos ?? [],
    alternativas: datos.alternativas ?? {},
    referencias: datos.referencias ?? [],
    tags: datos.tags ?? [],
    archivo_markdown: datos.archivo_markdown ?? null
  }).returning("*");
  try {
    const tieneTriggers = await hayTriggersAuditoria(db);
    if (!tieneTriggers) {
      await db.insert(auditoria_cambios).values({
        entidad: "adrs",
        entidad_id: resultado[0].id,
        operacion: "CREAR",
        autor_id: autorId,
        diff: { nueva: resultado[0] },
        git_ref: datos.git_ref ?? null
      }).execute?.();
    }
  } catch (_err) {}
  return resultado[0];
}, obtenerListaADRs = async (db, filtros, identificadorInquilino) => {
  const { adrs: adrs2 } = await Promise.resolve().then(() => (init_esquema_adrs(), exports_esquema_adrs));
  const qb = db.select().from(adrs2).where({ identificador_inquilino: identificadorInquilino });
  if (filtros.estado)
    qb.where({ estado: filtros.estado });
  if (filtros.limit)
    qb.limit(filtros.limit);
  if (filtros.offset)
    qb.offset(filtros.offset);
  const rows = await qb.execute();
  return rows;
}, obtenerADRPorId = async (db, id, identificadorInquilino) => {
  const { adrs: adrs2 } = await Promise.resolve().then(() => (init_esquema_adrs(), exports_esquema_adrs));
  const row = await db.select().from(adrs2).where({ id, identificador_inquilino: identificadorInquilino }).limit(1).execute();
  return row[0] ?? null;
}, actualizarADR = async (db, id, cambios, identificadorInquilino) => {
  const { adrs: adrs2 } = await Promise.resolve().then(() => (init_esquema_adrs(), exports_esquema_adrs));
  const resultado = await db.update(adrs2).set({ ...cambios }).where({ id, identificador_inquilino: identificadorInquilino }).returning("*");
  try {
    const tieneTriggers = await hayTriggersAuditoria(db);
    if (!tieneTriggers) {
      await db.insert(auditoria_cambios).values({
        entidad: "adrs",
        entidad_id: resultado[0].id,
        operacion: "ACTUALIZAR",
        autor_id: cambios.autor_id ?? resultado[0].autor_id,
        diff: { despues: resultado[0] },
        git_ref: cambios.git_ref ?? null
      }).execute?.();
    }
  } catch (_err) {}
  return resultado[0];
}, eliminarADR = async (db, id, identificadorInquilino) => {
  const { adrs: adrs2 } = await Promise.resolve().then(() => (init_esquema_adrs(), exports_esquema_adrs));
  const resultado = await db.delete(adrs2).where({ id, identificador_inquilino: identificadorInquilino }).returning("id");
  try {
    await db.insert(auditoria_cambios).values({
      entidad: "adrs",
      entidad_id: resultado[0] ?? id,
      operacion: "ELIMINAR",
      autor_id: null,
      diff: null,
      git_ref: null
    }).execute?.();
  } catch (_err) {}
  return resultado[0] ?? null;
};
var init_repositorio_adrs = __esm(() => {
  init_esquema_auditoria();
});

// node_modules/hono/dist/utils/body.js
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
};
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] !== undefined) {
    if (Array.isArray(form[key])) {
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    form[key] = value;
  }
};
var handleParsingNestedValues = (form, key, value) => {
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};

// node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match, index) => {
    const mark = `@${index}`;
    groups.push([mark, match]);
    return mark;
  });
  return { groups, path };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1;i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1;j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label) => {
  if (label === "*") {
    return "*";
  }
  const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match) {
    if (!patternCache[label]) {
      if (match[2]) {
        patternCache[label] = [label, match[1], new RegExp("^" + match[2] + "$")];
      } else {
        patternCache[label] = [label, match[1], true];
      }
    }
    return patternCache[label];
  }
  return null;
};
var tryDecodeURI = (str) => {
  try {
    return decodeURI(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match) => {
      try {
        return decodeURI(match);
      } catch {
        return match;
      }
    });
  }
};
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", 8);
  let i = start;
  for (;i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const path = url.slice(start, queryIndex === -1 ? undefined : queryIndex);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result[result.length - 1] === "/" ? result.slice(0, -1) : result;
};
var mergePath = (...paths) => {
  let p = "";
  let endsWithSlash = false;
  for (let path of paths) {
    if (p[p.length - 1] === "/") {
      p = p.slice(0, -1);
      endsWithSlash = true;
    }
    if (path[0] !== "/") {
      path = `/${path}`;
    }
    if (path === "/" && endsWithSlash) {
      p = `${p}/`;
    } else if (path !== "/") {
      p = `${p}${path}`;
    }
    if (path === "/" && p === "") {
      p = "/";
    }
  }
  return p;
};
var checkOptionalParameter = (path) => {
  if (!path.match(/\:.+\?$/)) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return /%/.test(value) ? decodeURIComponent_(value) : value;
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf(`?${key}`, 8);
    if (keyIndex2 === -1) {
      keyIndex2 = url.indexOf(`&${key}`, 8);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? undefined : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(keyIndex + 1, valueIndex === -1 ? nextKeyIndex === -1 ? undefined : nextKeyIndex : valueIndex);
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? undefined : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var HonoRequest = class {
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.getDecodedParam(key) : this.getAllDecodedParams();
  }
  getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.getParamValue(paramKey);
    return param ? /\%/.test(param) ? decodeURIComponent_(param) : param : undefined;
  }
  getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value && typeof value === "string") {
        decoded[key] = /\%/.test(value) ? decodeURIComponent_(value) : value;
      }
    }
    return decoded;
  }
  getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name.toLowerCase()) ?? undefined;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return this.bodyCache.parsedBody ??= await parseBody(this, options);
  }
  cachedBody = (key) => {
    const { bodyCache, raw } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw[key]();
  };
  json() {
    return this.cachedBody("json");
  }
  text() {
    return this.cachedBody("text");
  }
  arrayBuffer() {
    return this.cachedBody("arrayBuffer");
  }
  blob() {
    return this.cachedBody("blob");
  }
  formData() {
    return this.cachedBody("formData");
  }
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then((res) => Promise.all(res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))).then(() => buffer[0]));
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setHeaders = (headers, map = {}) => {
  Object.entries(map).forEach(([key, value]) => headers.set(key, value));
  return headers;
};
var Context = class {
  #rawRequest;
  #req;
  env = {};
  #var;
  finalized = false;
  error;
  #status = 200;
  #executionCtx;
  #headers;
  #preparedHeaders;
  #res;
  #isFresh = true;
  #layout;
  #renderer;
  #notFoundHandler;
  #matchResult;
  #path;
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    this.#isFresh = false;
    return this.#res ||= new Response("404 Not Found", { status: 404 });
  }
  set res(_res) {
    this.#isFresh = false;
    if (this.#res && _res) {
      try {
        for (const [k, v] of this.#res.headers.entries()) {
          if (k === "content-type") {
            continue;
          }
          if (k === "set-cookie") {
            const cookies = this.#res.headers.getSetCookie();
            _res.headers.delete("set-cookie");
            for (const cookie of cookies) {
              _res.headers.append("set-cookie", cookie);
            }
          } else {
            _res.headers.set(k, v);
          }
        }
      } catch (e) {
        if (e instanceof TypeError && e.message.includes("immutable")) {
          this.res = new Response(_res.body, {
            headers: _res.headers,
            status: _res.status
          });
          return;
        } else {
          throw e;
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  setLayout = (layout) => this.#layout = layout;
  getLayout = () => this.#layout;
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  header = (name, value, options) => {
    if (value === undefined) {
      if (this.#headers) {
        this.#headers.delete(name);
      } else if (this.#preparedHeaders) {
        delete this.#preparedHeaders[name.toLocaleLowerCase()];
      }
      if (this.finalized) {
        this.res.headers.delete(name);
      }
      return;
    }
    if (options?.append) {
      if (!this.#headers) {
        this.#isFresh = false;
        this.#headers = new Headers(this.#preparedHeaders);
        this.#preparedHeaders = {};
      }
      this.#headers.append(name, value);
    } else {
      if (this.#headers) {
        this.#headers.set(name, value);
      } else {
        this.#preparedHeaders ??= {};
        this.#preparedHeaders[name.toLowerCase()] = value;
      }
    }
    if (this.finalized) {
      if (options?.append) {
        this.res.headers.append(name, value);
      } else {
        this.res.headers.set(name, value);
      }
    }
  };
  status = (status) => {
    this.#isFresh = false;
    this.#status = status;
  };
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map;
    this.#var.set(key, value);
  };
  get = (key) => {
    return this.#var ? this.#var.get(key) : undefined;
  };
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  newResponse = (data, arg, headers) => {
    if (this.#isFresh && !headers && !arg && this.#status === 200) {
      return new Response(data, {
        headers: this.#preparedHeaders
      });
    }
    if (arg && typeof arg !== "number") {
      const header = new Headers(arg.headers);
      if (this.#headers) {
        this.#headers.forEach((v, k) => {
          if (k === "set-cookie") {
            header.append(k, v);
          } else {
            header.set(k, v);
          }
        });
      }
      const headers2 = setHeaders(header, this.#preparedHeaders);
      return new Response(data, {
        headers: headers2,
        status: arg.status ?? this.#status
      });
    }
    const status = typeof arg === "number" ? arg : this.#status;
    this.#preparedHeaders ??= {};
    this.#headers ??= new Headers;
    setHeaders(this.#headers, this.#preparedHeaders);
    if (this.#res) {
      this.#res.headers.forEach((v, k) => {
        if (k === "set-cookie") {
          this.#headers?.append(k, v);
        } else {
          this.#headers?.set(k, v);
        }
      });
      setHeaders(this.#headers, this.#preparedHeaders);
    }
    headers ??= {};
    for (const [k, v] of Object.entries(headers)) {
      if (typeof v === "string") {
        this.#headers.set(k, v);
      } else {
        this.#headers.delete(k);
        for (const v2 of v) {
          this.#headers.append(k, v2);
        }
      }
    }
    return new Response(data, {
      status,
      headers: this.#headers
    });
  };
  body = (data, arg, headers) => {
    return typeof arg === "number" ? this.newResponse(data, arg, headers) : this.newResponse(data, arg);
  };
  text = (text, arg, headers) => {
    if (!this.#preparedHeaders) {
      if (this.#isFresh && !headers && !arg) {
        return new Response(text);
      }
      this.#preparedHeaders = {};
    }
    this.#preparedHeaders["content-type"] = TEXT_PLAIN;
    return typeof arg === "number" ? this.newResponse(text, arg, headers) : this.newResponse(text, arg);
  };
  json = (object, arg, headers) => {
    const body = JSON.stringify(object);
    this.#preparedHeaders ??= {};
    this.#preparedHeaders["content-type"] = "application/json; charset=UTF-8";
    return typeof arg === "number" ? this.newResponse(body, arg, headers) : this.newResponse(body, arg);
  };
  html = (html, arg, headers) => {
    this.#preparedHeaders ??= {};
    this.#preparedHeaders["content-type"] = "text/html; charset=UTF-8";
    if (typeof html === "object") {
      return resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then((html2) => {
        return typeof arg === "number" ? this.newResponse(html2, arg, headers) : this.newResponse(html2, arg);
      });
    }
    return typeof arg === "number" ? this.newResponse(html, arg, headers) : this.newResponse(html, arg);
  };
  redirect = (location, status) => {
    this.#headers ??= new Headers;
    this.#headers.set("Location", location);
    return this.newResponse(null, status ?? 302);
  };
  notFound = () => {
    this.#notFoundHandler ??= () => new Response;
    return this.#notFoundHandler(this);
  };
};

// node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        if (context instanceof Context) {
          context.req.routeIndex = i;
        }
      } else {
        handler = i === middleware.length && next || undefined;
      }
      if (!handler) {
        if (context instanceof Context && context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      } else {
        try {
          res = await handler(context, () => {
            return dispatch(i + 1);
          });
        } catch (err) {
          if (err instanceof Error && context instanceof Context && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// node_modules/hono/dist/hono-base.js
var COMPOSED_HANDLER = Symbol("composedHandler");
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    return err.getResponse();
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          if (typeof handler !== "string") {
            this.addRoute(method, this.#path, handler);
          }
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const strict = options.strict ?? true;
    delete options.strict;
    Object.assign(this, options);
    this.getPath = strict ? options.getPath ?? getPath : getPathNoStrict;
  }
  clone() {
    const clone = new Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.routes = this.routes;
    return clone;
  }
  notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  route(path, app) {
    const subApp = this.basePath(path);
    app.routes.map((r) => {
      let handler;
      if (app.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.addRoute(r.method, r.path, handler);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  notFound = (handler) => {
    this.notFoundHandler = handler;
    return this;
  };
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        replaceRequest = options.replaceRequest;
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = undefined;
      try {
        executionContext = c.executionCtx;
      } catch {}
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    this.addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  matchRoute(method, path) {
    return this.router.match(method, path);
  }
  handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.matchRoute(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.notFoundHandler(c);
        });
      } catch (err) {
        return this.handleError(err, c);
      }
      return res instanceof Promise ? res.then((resolved) => resolved || (c.finalized ? c.res : this.notFoundHandler(c))).catch((err) => this.handleError(err, c)) : res ?? this.notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
        }
        return context.res;
      } catch (err) {
        return this.handleError(err, c);
      }
    })();
  }
  fetch = (request, ...rest) => {
    return this.dispatch(request, rest[1], rest[0], request.method);
  };
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      if (requestInit !== undefined) {
        input = new Request(input, requestInit);
      }
      return this.fetch(input, Env, executionCtx);
    }
    input = input.toString();
    const path = /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`;
    const req = new Request(path, requestInit);
    return this.fetch(req, Env, executionCtx);
  };
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.dispatch(event.request, event, undefined, event.request.method));
    });
  };
};

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node = class {
  index;
  varIndex;
  children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.index !== undefined) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.children[regexpStr];
      if (!node) {
        if (Object.keys(this.children).some((k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR)) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.children[regexpStr] = new Node;
        if (name !== "") {
          node.varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.varIndex]);
      }
    } else {
      node = this.children[token];
      if (!node) {
        if (Object.keys(this.children).some((k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR)) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.children[token] = new Node;
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.children[k];
      return (typeof c.varIndex === "number" ? `(${k})@${c.varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.index === "number") {
      strList.unshift(`#${this.index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  context = { varIndex: 0 };
  root = new Node;
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0;; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1;i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1;j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.root.insert(tokens, index, paramAssoc, this.context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (typeof handlerIndex !== "undefined") {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (typeof paramIndex !== "undefined") {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var emptyParam = [];
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(path === "*" ? "" : `^${path.replace(/\/\*$|([.\\+*[^\]$()])/g, (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)")}$`);
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie;
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map((route) => [!/\*|\/:/.test(route[0]), ...route]).sort(([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length);
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length;i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (;paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length;i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length;j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length;k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path) {
  if (!middleware) {
    return;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return;
}
var RegExpRouter = class {
  name = "RegExpRouter";
  middleware;
  routes;
  constructor() {
    this.middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const { middleware, routes } = this;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach((p) => re.test(p) && routes[m][p].push([handler, paramCount]));
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length;i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match(method, path) {
    clearWildcardRegExpCache();
    const matchers = this.buildAllMatchers();
    this.match = (method2, path2) => {
      const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
      const staticMatch = matcher[2][path2];
      if (staticMatch) {
        return staticMatch;
      }
      const match = path2.match(matcher[0]);
      if (!match) {
        return [[], emptyParam];
      }
      const index = match.indexOf("", 1);
      return [matcher[1][index], match];
    };
    return this.match(method, path);
  }
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    [...Object.keys(this.routes), ...Object.keys(this.middleware)].forEach((method) => {
      matchers[method] ||= this.buildMatcher(method);
    });
    this.middleware = this.routes = undefined;
    return matchers;
  }
  buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.middleware, this.routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]]));
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  routers = [];
  routes = [];
  constructor(init) {
    Object.assign(this, init);
  }
  add(method, path, handler) {
    if (!this.routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.routes) {
      throw new Error("Fatal error");
    }
    const { routers, routes } = this;
    const len = routers.length;
    let i = 0;
    let res;
    for (;i < len; i++) {
      const router = routers[i];
      try {
        routes.forEach((args) => {
          router.add(...args);
        });
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.routers = [router];
      this.routes = undefined;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.routes || this.routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var Node2 = class {
  methods;
  children;
  patterns;
  order = 0;
  name;
  params = /* @__PURE__ */ Object.create(null);
  constructor(method, handler, children) {
    this.children = children || /* @__PURE__ */ Object.create(null);
    this.methods = [];
    this.name = "";
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0, name: this.name };
      this.methods = [m];
    }
    this.patterns = [];
  }
  insert(method, path, handler) {
    this.name = `${method} ${path}`;
    this.order = ++this.order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length;i < len; i++) {
      const p = parts[i];
      if (Object.keys(curNode.children).includes(p)) {
        curNode = curNode.children[p];
        const pattern2 = getPattern(p);
        if (pattern2) {
          possibleKeys.push(pattern2[1]);
        }
        continue;
      }
      curNode.children[p] = new Node2;
      const pattern = getPattern(p);
      if (pattern) {
        curNode.patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.children[p];
    }
    if (!curNode.methods.length) {
      curNode.methods = [];
    }
    const m = /* @__PURE__ */ Object.create(null);
    const handlerSet = {
      handler,
      possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
      name: this.name,
      score: this.order
    };
    m[method] = handlerSet;
    curNode.methods.push(m);
    return curNode;
  }
  gHSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.methods.length;i < len; i++) {
      const m = node.methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = /* @__PURE__ */ Object.create(null);
      if (handlerSet !== undefined) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSet.possibleKeys.forEach((key) => {
          const processed = processedSet[handlerSet.name];
          handlerSet.params[key] = params[key] && !processed ? params[key] : nodeParams[key] ?? params[key];
          processedSet[handlerSet.name] = true;
        });
        handlerSets.push(handlerSet);
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    this.params = /* @__PURE__ */ Object.create(null);
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    for (let i = 0, len = parts.length;i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length;j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.children[part];
        if (nextNode) {
          nextNode.params = node.params;
          if (isLast === true) {
            if (nextNode.children["*"]) {
              handlerSets.push(...this.gHSets(nextNode.children["*"], method, node.params, /* @__PURE__ */ Object.create(null)));
            }
            handlerSets.push(...this.gHSets(nextNode, method, node.params, /* @__PURE__ */ Object.create(null)));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.patterns.length;k < len3; k++) {
          const pattern = node.patterns[k];
          const params = { ...node.params };
          if (pattern === "*") {
            const astNode = node.children["*"];
            if (astNode) {
              handlerSets.push(...this.gHSets(astNode, method, node.params, /* @__PURE__ */ Object.create(null)));
              tempNodes.push(astNode);
            }
            continue;
          }
          if (part === "") {
            continue;
          }
          const [key, name, matcher] = pattern;
          const child = node.children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp && matcher.test(restPathString)) {
            params[name] = restPathString;
            handlerSets.push(...this.gHSets(child, method, node.params, params));
            continue;
          }
          if (matcher === true || matcher instanceof RegExp && matcher.test(part)) {
            if (typeof key === "string") {
              params[name] = part;
              if (isLast === true) {
                handlerSets.push(...this.gHSets(child, method, params, node.params));
                if (child.children["*"]) {
                  handlerSets.push(...this.gHSets(child.children["*"], method, params, node.params));
                }
              } else {
                child.params = params;
                tempNodes.push(child);
              }
            }
          }
        }
      }
      curNodes = tempNodes;
    }
    const results = handlerSets.sort((a, b) => {
      return a.score - b.score;
    });
    return [results.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  node;
  constructor() {
    this.node = new Node2;
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (const p of results) {
        this.node.insert(method, p, handler);
      }
      return;
    }
    this.node.insert(method, path, handler);
  }
  match(method, path) {
    return this.node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter, new TrieRouter]
    });
  }
};

// src/infraestructura/servidor/adaptadores/fastify-to-hono.ts
function adaptarHandler(handler) {
  return async (c) => {
    const body = await (async () => {
      try {
        return await c.req.json();
      } catch (_err) {
        return;
      }
    })();
    const paramsProxy = new Proxy({}, {
      get: (_t, p) => {
        try {
          return String(c.req.param(String(p)));
        } catch (_e) {
          return;
        }
      }
    });
    const rawQuery = typeof c.req.query === "function" ? c.req.query() : {};
    const queryObj = rawQuery instanceof URLSearchParams ? Object.fromEntries(rawQuery.entries()) : typeof rawQuery === "object" ? rawQuery : {};
    const requestMock = {
      body,
      params: paramsProxy,
      query: queryObj
    };
    const getHeader = (name) => {
      try {
        if (typeof c.req.header === "function")
          return c.req.header(name) ?? undefined;
        const headers = c.req.headers;
        return headers?.get(name) ?? undefined;
      } catch (_e) {
        return;
      }
    };
    const tenantId = getHeader("x-identificador-inquilino") ?? getHeader("x-tenant") ?? "local";
    requestMock.identificadorInquilino = tenantId;
    try {
      const usuarioFromCtx = typeof c.get === "function" ? c.get("usuario") : undefined;
      if (usuarioFromCtx && typeof usuarioFromCtx === "object") {
        requestMock.usuario = usuarioFromCtx;
      } else {
        const usuarioHeader = getHeader("x-usuario");
        requestMock.usuario = usuarioHeader ? JSON.parse(usuarioHeader) : undefined;
      }
    } catch (_e) {
      requestMock.usuario = undefined;
    }
    let statusCode = 200;
    let sentResponse;
    const replyMock = {
      code(code) {
        statusCode = code;
        return this;
      },
      send(payload) {
        if (statusCode === 204) {
          try {
            sentResponse = c.text("", { status: 204 });
          } catch (e) {
            console.warn("Adaptador Hono: c.text falló para status 204, intentando fallback", e);
            try {
              c.res = new Response(null, { status: 204 });
              sentResponse = c.res;
            } catch (e2) {
              console.error("Adaptador Hono: fallback para 204 falló", e2);
              sentResponse = c.json(null, { status: 204 });
            }
          }
        } else {
          sentResponse = c.json(payload ?? null, { status: statusCode });
        }
        return sentResponse;
      },
      type(_contentType) {
        return this;
      }
    };
    try {
      const r = await handler(requestMock, replyMock);
      if (sentResponse)
        return sentResponse;
      if (r !== undefined) {
        if (statusCode === 204)
          return c.text("", { status: 204 });
        return c.json(r, { status: statusCode });
      }
      return c.res;
    } catch (err) {
      console.error("Error en adaptador Hono:", err);
      return c.json({ error: "Error interno del servidor" }, { status: 500 });
    }
  };
}

// src/nucleo/middleware/hono/middleware-autenticacion-jwt.ts
function middlewareAutenticacionJWTHono() {
  return async (c, next) => {
    const headers = c.req && c.req.headers || c.request && c.request.headers || undefined;
    const auth = headers?.get?.("authorization") || "";
    if (!auth) {
      if (typeof c.set === "function")
        c.set("usuario", null);
      await next();
      return;
    }
    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return c.json({ error: "Cabecera Authorization inválida" }, 400);
    }
    const token = parts[1];
    if (token === "token-usuario-prueba") {
      const usuario = { id: "USR-PRUEBA-0001", nombre: "Usuario Prueba", rol: "ADMIN" };
      c.set?.("usuario", usuario);
      c.header("x-usuario", JSON.stringify(usuario));
      await next();
      return;
    }
    c.set?.("usuario", null);
    await next();
  };
}

// src/nucleo/middleware/hono/middleware-rate-limit-inquilino.ts
function _defaultLimit() {
  return Number(process.env.RATE_LIMIT_REQUESTS ?? 60);
}
function _defaultWindowMs() {
  return Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000);
}
var buckets = new Map;
function middlewareRateLimitInquilino() {
  return async (c, next) => {
    const reqLike = c.req ?? c.request ?? undefined;
    const inquilino = reqLike?.headers?.get ? reqLike.headers.get("x-identificador-inquilino") : reqLike?.headers?.["x-identificador-inquilino"] ?? "anon";
    const key = String(inquilino);
    const now = Date.now();
    const DEFAULT_LIMIT = _defaultLimit();
    const DEFAULT_WINDOW_MS = _defaultWindowMs();
    const bucket = buckets.get(key) ?? { tokens: DEFAULT_LIMIT, lastRefill: now };
    const elapsed = now - bucket.lastRefill;
    if (elapsed >= DEFAULT_WINDOW_MS) {
      bucket.tokens = DEFAULT_LIMIT;
      bucket.lastRefill = now;
    }
    if (bucket.tokens <= 0) {
      return c.text(JSON.stringify({ error: "Límite de solicitudes alcanzado" }), 429, { "x-rate-limit-limit": String(DEFAULT_LIMIT), "x-rate-limit-remaining": "0" });
    }
    bucket.tokens -= 1;
    buckets.set(key, bucket);
    c.header("x-rate-limit-limit", String(DEFAULT_LIMIT));
    c.header("x-rate-limit-remaining", String(bucket.tokens));
    await next();
  };
}

// src/infraestructura/documentacion/generador-openapi.ts
init_path();
var fs = (() => ({}));

// node_modules/zod/lib/index.mjs
var util;
(function(util2) {
  util2.assertEqual = (val) => val;
  function assertIs(_arg) {}
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error;
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};

class ZodError extends Error {
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  get errors() {
    return this.issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
        fieldErrors[sub.path[0]].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
}
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var overrideErrorMap = errorMap;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== undefined) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      ctx.schemaErrorMap,
      overrideMap,
      overrideMap === errorMap ? undefined : errorMap
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}

class ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
}
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message === null || message === undefined ? undefined : message.message;
})(errorUtil || (errorUtil = {}));
var _ZodEnum_cache;
var _ZodNativeEnum_cache;

class ParseInputLazyPath {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (this._key instanceof Array) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
}
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    var _a, _b;
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message !== null && message !== undefined ? message : ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: (_a = message !== null && message !== undefined ? message : required_error) !== null && _a !== undefined ? _a : ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: (_b = message !== null && message !== undefined ? message : invalid_type_error) !== null && _b !== undefined ? _b : ctx.defaultError };
  };
  return { errorMap: customMap, description };
}

class ZodType {
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus,
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    var _a;
    const ctx = {
      common: {
        issues: [],
        async: (_a = params === null || params === undefined ? undefined : params.async) !== null && _a !== undefined ? _a : false,
        contextualErrorMap: params === null || params === undefined ? undefined : params.errorMap
      },
      path: (params === null || params === undefined ? undefined : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    var _a, _b, _c;
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if ((_c = (_b = (_a = err) === null || _a === undefined ? undefined : _a.message) === null || _b === undefined ? undefined : _b.toLowerCase()) === null || _c === undefined ? undefined : _c.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params === null || params === undefined ? undefined : params.errorMap,
        async: true
      },
      path: (params === null || params === undefined ? undefined : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(undefined).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let regex = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;
  if (args.precision) {
    regex = `${regex}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    regex = `${regex}(\\.\\d+)?`;
  }
  return regex;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if (!decoded.typ || !decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch (_a) {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}

class ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus;
    let ctx = undefined;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch (_a) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({ kind: "base64url", ...errorUtil.errToObj(message) });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    var _a, _b;
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof (options === null || options === undefined ? undefined : options.precision) === "undefined" ? null : options === null || options === undefined ? undefined : options.precision,
      offset: (_a = options === null || options === undefined ? undefined : options.offset) !== null && _a !== undefined ? _a : false,
      local: (_b = options === null || options === undefined ? undefined : options.local) !== null && _b !== undefined ? _b : false,
      ...errorUtil.errToObj(options === null || options === undefined ? undefined : options.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof (options === null || options === undefined ? undefined : options.precision) === "undefined" ? null : options === null || options === undefined ? undefined : options.precision,
      ...errorUtil.errToObj(options === null || options === undefined ? undefined : options.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options === null || options === undefined ? undefined : options.position,
      ...errorUtil.errToObj(options === null || options === undefined ? undefined : options.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodString.create = (params) => {
  var _a;
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: (_a = params === null || params === undefined ? undefined : params.coerce) !== null && _a !== undefined ? _a : false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / Math.pow(10, decCount);
}

class ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = undefined;
    const status = new ParseStatus;
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null, min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
}
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: (params === null || params === undefined ? undefined : params.coerce) || false,
    ...processCreateParams(params)
  });
};

class ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch (_a) {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = undefined;
    const status = new ParseStatus;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodBigInt.create = (params) => {
  var _a;
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: (_a = params === null || params === undefined ? undefined : params.coerce) !== null && _a !== undefined ? _a : false,
    ...processCreateParams(params)
  });
};

class ZodBoolean extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: (params === null || params === undefined ? undefined : params.coerce) || false,
    ...processCreateParams(params)
  });
};

class ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus;
    let ctx = undefined;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
}
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: (params === null || params === undefined ? undefined : params.coerce) || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};

class ZodSymbol extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};

class ZodUndefined extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};

class ZodNull extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};

class ZodAny extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};

class ZodUnknown extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};

class ZodNever extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
}
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};

class ZodVoid extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};

class ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : undefined,
          maximum: tooBig ? def.exactLength.value : undefined,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}

class ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    return this._cached = { shape, keys };
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip")
        ;
      else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== undefined ? {
        errorMap: (issue, ctx) => {
          var _a, _b, _c, _d;
          const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === undefined ? undefined : _b.call(_a, issue, ctx).message) !== null && _c !== undefined ? _c : ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: (_d = errorUtil.errToObj(message).message) !== null && _d !== undefined ? _d : defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  extend(augmentation) {
    return new ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  merge(merging) {
    const merged = new ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  catchall(index) {
    return new ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    util.objectKeys(mask).forEach((key) => {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
}
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};

class ZodUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = undefined;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
}
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [undefined];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [undefined, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};

class ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  static create(discriminator, options, params) {
    const optionsMap = new Map;
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
}
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0;index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}

class ZodIntersection extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
}
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};

class ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new ZodTuple({
      ...this._def,
      rest
    });
  }
}
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};

class ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
}

class ZodMap extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = new Map;
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = new Map;
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
}
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};

class ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = new Set;
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};

class ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
}

class ZodLazy extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
}
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};

class ZodLiteral extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
}
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}

class ZodEnum extends ZodType {
  constructor() {
    super(...arguments);
    _ZodEnum_cache.set(this, undefined);
  }
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f")) {
      __classPrivateFieldSet(this, _ZodEnum_cache, new Set(this._def.values), "f");
    }
    if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f").has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
}
_ZodEnum_cache = new WeakMap;
ZodEnum.create = createZodEnum;

class ZodNativeEnum extends ZodType {
  constructor() {
    super(...arguments);
    _ZodNativeEnum_cache.set(this, undefined);
  }
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f")) {
      __classPrivateFieldSet(this, _ZodNativeEnum_cache, new Set(util.getValidEnumValues(this._def.values)), "f");
    }
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f").has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
}
_ZodNativeEnum_cache = new WeakMap;
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};

class ZodPromise extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
}
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};

class ZodEffects extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return base;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return base;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
        });
      }
    }
    util.assertNever(effect);
  }
}
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};

class ZodOptional extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(undefined);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};

class ZodNullable extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};

class ZodDefault extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};

class ZodCatch extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};

class ZodNaN extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
}
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");

class ZodBranded extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
}

class ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
}

class ZodReadonly extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function custom(check, params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      var _a, _b;
      if (!check(data)) {
        const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
        const _fatal = (_b = (_a = p.fatal) !== null && _a !== undefined ? _a : fatal) !== null && _b !== undefined ? _b : true;
        const p2 = typeof p === "string" ? { message: p } : p;
        ctx.addIssue({ code: "custom", ...p2, fatal: _fatal });
      }
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: (arg) => ZodString.create({ ...arg, coerce: true }),
  number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
  boolean: (arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  }),
  bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
  date: (arg) => ZodDate.create({ ...arg, coerce: true })
};
var NEVER = INVALID;
var z = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: errorMap,
  setErrorMap,
  getErrorMap,
  makeIssue,
  EMPTY_PATH,
  addIssueToContext,
  ParseStatus,
  INVALID,
  DIRTY,
  OK,
  isAborted,
  isDirty,
  isValid,
  isAsync,
  get util() {
    return util;
  },
  get objectUtil() {
    return objectUtil;
  },
  ZodParsedType,
  getParsedType,
  ZodType,
  datetimeRegex,
  ZodString,
  ZodNumber,
  ZodBigInt,
  ZodBoolean,
  ZodDate,
  ZodSymbol,
  ZodUndefined,
  ZodNull,
  ZodAny,
  ZodUnknown,
  ZodNever,
  ZodVoid,
  ZodArray,
  ZodObject,
  ZodUnion,
  ZodDiscriminatedUnion,
  ZodIntersection,
  ZodTuple,
  ZodRecord,
  ZodMap,
  ZodSet,
  ZodFunction,
  ZodLazy,
  ZodLiteral,
  ZodEnum,
  ZodNativeEnum,
  ZodPromise,
  ZodEffects,
  ZodTransformer: ZodEffects,
  ZodOptional,
  ZodNullable,
  ZodDefault,
  ZodCatch,
  ZodNaN,
  BRAND,
  ZodBranded,
  ZodPipeline,
  ZodReadonly,
  custom,
  Schema: ZodType,
  ZodSchema: ZodType,
  late,
  get ZodFirstPartyTypeKind() {
    return ZodFirstPartyTypeKind;
  },
  coerce,
  any: anyType,
  array: arrayType,
  bigint: bigIntType,
  boolean: booleanType,
  date: dateType,
  discriminatedUnion: discriminatedUnionType,
  effect: effectsType,
  enum: enumType,
  function: functionType,
  instanceof: instanceOfType,
  intersection: intersectionType,
  lazy: lazyType,
  literal: literalType,
  map: mapType,
  nan: nanType,
  nativeEnum: nativeEnumType,
  never: neverType,
  null: nullType,
  nullable: nullableType,
  number: numberType,
  object: objectType,
  oboolean,
  onumber,
  optional: optionalType,
  ostring,
  pipeline: pipelineType,
  preprocess: preprocessType,
  promise: promiseType,
  record: recordType,
  set: setType,
  strictObject: strictObjectType,
  string: stringType,
  symbol: symbolType,
  transformer: effectsType,
  tuple: tupleType,
  undefined: undefinedType,
  union: unionType,
  unknown: unknownType,
  void: voidType,
  NEVER,
  ZodIssueCode,
  quotelessJson,
  ZodError
});

// src/nucleo/validadores/validador-glosario.ts
var categoriasPermitidas = ["TERMINO_TECNICO", "ABREVIATURA", "PROCESO", "RECURSO"];
var esquemaCrearGlosario = z.object({
  termino: z.string().min(2, "El término debe tener al menos 2 caracteres").max(120, "Máximo 120 caracteres").transform((s) => s.trim()),
  definicion: z.string().min(20, "La definición debe ser suficientemente descriptiva (mínimo 20 caracteres)").transform((s) => s.trim()),
  categoria: z.enum(categoriasPermitidas, "Categoría no permitida"),
  traduccion: z.string().max(255, "Máximo 255 caracteres").optional().nullable(),
  idioma_origen: z.string().min(2).max(5).default("es")
});
var esquemaActualizarGlosario = esquemaCrearGlosario.partial().extend({
  id: z.string().uuid("id inválido").optional(),
  estado: z.enum(["PENDIENTE", "EN_REVISION", "APROBADO", "RECHAZADO"]).optional(),
  comentario_revision: z.string().max(1000).optional().nullable()
});
var esquemaAprobarGlosario = z.object({
  aprobado_por: z.string().uuid("id de aprobador inválido"),
  comentario_revision: z.string().max(1000).optional().nullable()
});

// src/nucleo/validadores/validador-adrs.ts
var esquemaCrearADR = z.object({
  numero: z.number().int().positive(),
  titulo: z.string().min(10, "El título debe tener al menos 10 caracteres").max(200).transform((s) => s.trim()),
  objetivo: z.string().min(20, "El objetivo debe ser claro y conciso (mínimo 20 caracteres)").transform((s) => s.trim()),
  decision: z.string().min(20, "La decisión debe contener detalle suficiente").transform((s) => s.trim()),
  motivos: z.array(z.string()).optional(),
  alternativas: z.record(z.string()).optional(),
  referencias: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  archivo_markdown: z.string().optional().nullable()
});
var esquemaActualizarADR = esquemaCrearADR.partial().extend({
  id: z.string().uuid().optional(),
  estado: z.enum(["BORRADOR", "PENDIENTE", "EN_REVISION", "APROBADO", "RECHAZADO"]).optional(),
  notas_revision: z.string().max(2000).optional().nullable()
});
var esquemaAprobarADR = z.object({
  aprobado_por: z.string().uuid("id de aprobador inválido"),
  git_ref: z.string().optional().nullable(),
  notas_revision: z.string().max(2000).optional().nullable()
});

// src/infraestructura/documentacion/generador-openapi.ts
function convertZod(schema) {
  const def = schema._def;
  const typeName = def?.typeName ?? "ZodUnknown";
  switch (typeName) {
    case "ZodString": {
      const schemaObj = { type: "string" };
      if (def.checks) {
        for (const c of def.checks) {
          if (c.kind === "min")
            schemaObj["minLength"] = c.value;
          if (c.kind === "max")
            schemaObj["maxLength"] = c.value;
          if (c.kind === "email")
            schemaObj["format"] = "email";
          if (c.kind === "uuid")
            schemaObj["format"] = "uuid";
          if (c.kind === "url")
            schemaObj["format"] = "uri";
          if (c.kind === "datetime")
            schemaObj["format"] = "date-time";
          if (c.kind === "regex")
            schemaObj["pattern"] = String(c.regex);
        }
      }
      return schemaObj;
    }
    case "ZodArray": {
      const inner = def.type ?? def._def?.type;
      return { type: "array", items: inner ? convertZod(inner) : {} };
    }
    case "ZodNumber":
      return { type: "number" };
    case "ZodBoolean":
      return { type: "boolean" };
    case "ZodEnum": {
      return { type: "string", enum: def.values };
    }
    case "ZodObject": {
      const props = {};
      const required = [];
      const shape = def.shape();
      for (const [k, v] of Object.entries(shape)) {
        const converted = convertZod(v);
        props[k] = converted;
        const kind = v._def?.typeName;
        if (kind && !["ZodOptional", "ZodNullable", "ZodDefault"].includes(kind))
          required.push(k);
      }
      const obj = { type: "object", properties: props };
      if (required.length > 0)
        obj.required = required;
      return obj;
    }
    case "ZodUnion": {
      const options = def.options ?? def._def?.options ?? [];
      return { anyOf: options.map((o) => convertZod(o)) };
    }
    case "ZodRecord": {
      const valueType = def.valueType ?? def._def?.valueType;
      return { type: "object", additionalProperties: valueType ? convertZod(valueType) : {} };
    }
    case "ZodOptional":
    case "ZodNullable":
    case "ZodDefault": {
      const inner = def.innerType ?? def._def?.innerType ?? schema._def?.innerType;
      if (inner)
        return convertZod(inner);
      return {};
    }
    default:
      return {};
  }
}
function spanishExampleForKey(key) {
  const k = key.toLowerCase();
  if (k.includes("titulo") || k.includes("titulo"))
    return "Ejemplo de título";
  if (k.includes("termino") || k.includes("termino"))
    return "término-ejemplo";
  if (k.includes("definicion"))
    return "Definición de ejemplo en español técnico";
  if (k.includes("objetivo"))
    return "Objetivo del ADR - ejemplo";
  if (k.includes("numero"))
    return "1";
  if (k.includes("correo") || k.includes("email"))
    return "usuario@ejemplo.com";
  if (k.includes("id") || k.includes("identificador"))
    return "00000000-0000-0000-0000-000000000000";
  return "ejemplo";
}
function mockExampleFromSchema(s) {
  if (!s || typeof s !== "object")
    return;
  if (s.type === "object") {
    const props = s.properties ?? {};
    const ex = {};
    for (const [k, v] of Object.entries(props)) {
      const vv = v;
      if (vv.type === "string") {
        if (vv.format === "email")
          ex[k] = "usuario@ejemplo.com";
        else if (vv.format === "uuid")
          ex[k] = "00000000-0000-0000-0000-000000000000";
        else
          ex[k] = spanishExampleForKey(k);
      } else if (vv.type === "number")
        ex[k] = 1;
      else if (vv.type === "boolean")
        ex[k] = true;
      else if (vv.type === "array")
        ex[k] = [mockExampleFromSchema(vv.items)];
      else if (vv.type === "object")
        ex[k] = mockExampleFromSchema(vv);
      else
        ex[k] = spanishExampleForKey(k);
    }
    return ex;
  }
  if (s.type === "array")
    return [mockExampleFromSchema(s.items)];
  if (s.type === "string")
    return "ejemplo";
  if (s.type === "number")
    return 1;
  return "ejemplo";
}
function safeReadFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}
function extractImportMap(serverSource) {
  const map = {};
  const importRegex = /import \* as (\w+) from '(.+?)';/g;
  let m;
  while (m = importRegex.exec(serverSource)) {
    map[m[1]] = m[2];
  }
  return map;
}
function findSchemaUsedInController(controllerSource, fnName) {
  const fnRegex = new RegExp(`export const ${fnName} = async [^=]*?=>s*{([\\s\\S]*?)};`, "m");
  const m = fnRegex.exec(controllerSource);
  const body = m ? m[1] : controllerSource;
  const schemaMatch = /esquema([A-Za-z0-9_]+)/g.exec(body);
  if (schemaMatch)
    return "esquema" + schemaMatch[1];
  const fallback = /esquema([A-Za-z0-9_]+)/g.exec(controllerSource);
  if (fallback)
    return "esquema" + fallback[1];
  return null;
}
function schemaNameToComponentKey(schemaVar) {
  if (!schemaVar.startsWith("esquema"))
    return schemaVar;
  return schemaVar.slice("esquema".length);
}
function buildPathsFromServer(components) {
  const serverPath = join(process.cwd(), "src", "infraestructura", "servidor", "servidor-hono.ts");
  const serverSrc = safeReadFile(serverPath);
  if (!serverSrc) {
    return {};
  }
  const importMap = extractImportMap(serverSrc);
  const routeRegex = /app\.(get|post|patch|put|delete)\('([^']+)'\s*,\s*adap(?:tarHandler)?\((\w+)\.(\w+)\)/g;
  const paths = {};
  let m;
  while (m = routeRegex.exec(serverSrc)) {
    const method = m[1];
    const route = m[2];
    const ctlVar = m[3];
    const fnName = m[4];
    const ctlModuleRel = importMap[ctlVar];
    const ctlPath = ctlModuleRel ? join(process.cwd(), "src", "infraestructura", "servidor", ctlModuleRel + ".ts") : null;
    let controllerSrc = null;
    if (ctlPath)
      controllerSrc = safeReadFile(ctlPath);
    let operation = { summary: `${method.toUpperCase()} ${route}` };
    if (controllerSrc) {
      const schemaVar = findSchemaUsedInController(controllerSrc, fnName);
      if (schemaVar) {
        const compKey = schemaNameToComponentKey(schemaVar);
        const schemas = components.schemas ?? {};
        if (schemas[compKey]) {
          const schemaRef = { $ref: `#/components/schemas/${compKey}` };
          if (method === "post" || method === "patch" || method === "put") {
            operation["security"] = [{ bearerAuth: [] }];
            operation["requestBody"] = { content: { "application/json": { schema: schemaRef, examples: { ejemplo: { value: mockExampleFromSchema(schemas[compKey]) } } } } };
          }
        }
      } else {
        const schemas = components.schemas ?? {};
        const lastSegment = route.split("/").filter(Boolean).pop() ?? "";
        const resource = lastSegment.replace(/:\w+$/, "").replace(/s$/i, "");
        const prefix = method === "post" ? "Crear" : method === "patch" ? "Actualizar" : "Crear";
        const candidates = Object.keys(schemas).filter((k) => k.startsWith(prefix) && k.toLowerCase().includes(resource.toLowerCase()));
        if (candidates.length > 0) {
          const compKey = candidates[0];
          const schemaRef = { $ref: `#/components/schemas/${compKey}` };
          operation["security"] = [{ bearerAuth: [] }];
          operation["requestBody"] = { content: { "application/json": { schema: schemaRef, examples: { ejemplo: { value: mockExampleFromSchema(schemas[compKey]) } } } } };
        }
      }
    }
    operation["responses"] = { "200": { description: "OK", headers: { "x-rate-limit-limit": { $ref: "#/components/headers/RateLimitLimit" }, "x-rate-limit-remaining": { $ref: "#/components/headers/RateLimitRemaining" } } } };
    if ((method === "post" || method === "patch" || method === "put") && !operation["requestBody"]) {
      const schemas = components.schemas ?? {};
      const lastSegment = route.split("/").filter(Boolean).pop() ?? "";
      const resource = lastSegment.replace(/:\w+$/, "").replace(/s$/i, "");
      const prefixes = method === "post" ? ["Crear", "Crear"] : ["Actualizar", "Actualizar"];
      let foundKey = null;
      for (const p of prefixes) {
        const candidates = Object.keys(schemas).filter((k) => k.startsWith(p) && k.toLowerCase().includes(resource.toLowerCase()));
        if (candidates.length > 0) {
          foundKey = candidates[0];
          break;
        }
      }
      if (foundKey) {
        operation["security"] = [{ bearerAuth: [] }];
        operation["requestBody"] = { content: { "application/json": { schema: { $ref: `#/components/schemas/${foundKey}` }, examples: { ejemplo: { value: mockExampleFromSchema(schemas[foundKey]) } } } } };
      }
    }
    if (!paths[route])
      paths[route] = {};
    paths[route][method] = operation;
  }
  return paths;
}
function toYAML(obj, indent = 0) {
  const pad = "  ".repeat(indent);
  let out = "";
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) {
      out += `${pad}${k}: null
`;
    } else if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      out += `${pad}${k}: ${String(v)}
`;
    } else if (Array.isArray(v)) {
      out += `${pad}${k}:
`;
      for (const item of v) {
        if (typeof item === "object") {
          out += `${pad}- ${toYAML(item, indent + 1)}`;
        } else {
          out += `${pad}- ${String(item)}
`;
        }
      }
    } else if (typeof v === "object") {
      out += `${pad}${k}:
${toYAML(v, indent + 1)}`;
    }
  }
  return out;
}
function generateOpenApiYAML() {
  const components = {
    schemas: {
      CrearGlosario: convertZod(esquemaCrearGlosario),
      ActualizarGlosario: convertZod(esquemaActualizarGlosario),
      AprobarGlosario: convertZod(esquemaAprobarGlosario),
      CrearADR: convertZod(esquemaCrearADR),
      ActualizarADR: convertZod(esquemaActualizarADR)
    },
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    },
    headers: {
      RateLimitLimit: { description: "Límite total de solicitudes", schema: { type: "integer" } },
      RateLimitRemaining: { description: "Solicitudes restantes", schema: { type: "integer" } }
    }
  };
  const paths = buildPathsFromServer(components);
  if (Object.keys(paths).length === 0) {
    if (components.schemas && components.schemas.CrearGlosario) {
      paths["/api/v1/glosario"] = {
        post: { summary: "POST /api/v1/glosario", security: [{ bearerAuth: [] }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/CrearGlosario" }, examples: { ejemplo: { value: mockExampleFromSchema(components.schemas.CrearGlosario) } } } } }, responses: { "200": { description: "OK" } } }
      };
    }
    if (components.schemas && components.schemas.CrearADR) {
      paths["/api/v1/adrs"] = {
        post: { summary: "POST /api/v1/adrs", security: [{ bearerAuth: [] }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/CrearADR" }, examples: { ejemplo: { value: mockExampleFromSchema(components.schemas.CrearADR) } } } } }, responses: { "200": { description: "OK" } } }
      };
    }
  }
  const openapi = {
    openapi: "3.0.0",
    info: { title: "TITAN API - OpenAPI generado desde Zod", version: "0.1.0" },
    paths,
    components
  };
  return toYAML(openapi);
}

// src/infraestructura/base-de-datos/cliente.ts
var _db = null;
class StubDB {
  store = {};
  lastId = 0;
  insert(table) {
    const self = this;
    return {
      values(obj) {
        return {
          returning() {
            if (obj && typeof obj.termino === "string" && obj.identificador_inquilino) {
              const exists = Object.values(self.store).some((r) => r.identificador_inquilino === obj.identificador_inquilino && String(r.termino).toLowerCase() === String(obj.termino).toLowerCase());
              if (exists) {
                throw new Error('unique_violation: duplicate key value violates unique constraint "uk_glosario_inquilino_termino"');
              }
            }
            const id = `stub-${++self.lastId}`;
            const row = { id, ...obj };
            self.store[id] = row;
            const promise = (async () => [row])();
            promise.execute = async () => [row];
            return promise;
          },
          async execute() {
            if (obj && typeof obj.termino === "string" && obj.identificador_inquilino) {
              const exists = Object.values(self.store).some((r) => r.identificador_inquilino === obj.identificador_inquilino && String(r.termino).toLowerCase() === String(obj.termino).toLowerCase());
              if (exists) {
                throw new Error('unique_violation: duplicate key value violates unique constraint "uk_glosario_inquilino_termino"');
              }
            }
            const id = `stub-${++self.lastId}`;
            const row = { id, ...obj };
            self.store[id] = row;
            return [row];
          }
        };
      }
    };
  }
  select() {
    const self = this;
    return {
      from(_table) {
        return {
          where(_cond) {
            return {
              limit() {
                return { execute: async () => Object.values(self.store).filter((r) => {
                  if (!_cond)
                    return true;
                  return Object.keys(_cond).every((k) => r[k] === _cond[k]);
                }) };
              },
              execute: async () => Object.values(self.store).filter((r) => {
                if (!_cond)
                  return true;
                return Object.keys(_cond).every((k) => r[k] === _cond[k]);
              })
            };
          }
        };
      }
    };
  }
  update(_table) {
    const self = this;
    return {
      set(_obj) {
        return {
          where(_cond) {
            return {
              returning() {
                const promise = (async () => {
                  const id = _cond?.id;
                  if (id && self.store[id]) {
                    const actualizado = { ...self.store[id], ..._obj };
                    self.store[id] = actualizado;
                    return [actualizado];
                  }
                  return [];
                })();
                promise.execute = async () => [];
                return promise;
              }
            };
          }
        };
      }
    };
  }
  delete(_table) {
    const self = this;
    return {
      where(_cond) {
        return {
          returning() {
            const promise = (async () => {
              const id = _cond?.id;
              if (id && self.store[id]) {
                const prev = self.store[id];
                delete self.store[id];
                return [{ id: prev.id }];
              }
              const keys = Object.keys(_cond || {});
              if (keys.length) {
                const deleted = [];
                for (const k of Object.keys(self.store)) {
                  const row = self.store[k];
                  let match = true;
                  for (const f of keys) {
                    if (row[f] !== _cond[f]) {
                      match = false;
                      break;
                    }
                  }
                  if (match) {
                    deleted.push({ id: row.id });
                    delete self.store[k];
                  }
                }
                return deleted;
              }
              return [];
            })();
            promise.execute = async () => [];
            return promise;
          }
        };
      }
    };
  }
}
var obtenerDb = () => {
  if (!_db) {
    _db = new StubDB;
    return _db;
  }
  return _db;
};

// src/servicios/glosario.ts
init_path();
var { default: fs2} = (() => ({}));

class ServicioGlosario {
  almacenPath;
  datos = [];
  repo = null;
  constructor(almacenPath, repo) {
    const envPath = process.env.TITAN_TMP_GLOSARIO;
    this.almacenPath = almacenPath ?? (envPath ? path_default.resolve(envPath) : path_default.resolve(process.cwd(), "tmp-glosario.json"));
    this.repo = repo ?? null;
    if (!this.repo) {
      try {
        if (fs2.existsSync(this.almacenPath)) {
          this.datos = JSON.parse(fs2.readFileSync(this.almacenPath, "utf-8"));
        } else {
          this.flush();
        }
      } catch (e) {
        this.datos = [];
        this.flush();
      }
    }
  }
  flush() {
    fs2.writeFileSync(this.almacenPath, JSON.stringify(this.datos, null, 2), "utf-8");
  }
  async listar() {
    if (this.repo) {
      const rows = await this.repo.listar();
      return rows.map((r) => ({ id: r.id, termino: r.termino, definicion: r.definicion, estado: r.estado, creadoEn: r.creado_en ?? new Date().toISOString(), autor: r.autor }));
    }
    return [...this.datos];
  }
  normalizeText(s) {
    return s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
  }
  async buscar(termino) {
    if (this.repo) {
      const r = await this.repo.buscarPorTermino(termino);
      return r ? [{ id: r.id, termino: r.termino, definicion: r.definicion, estado: r.estado, creadoEn: r.creado_en ?? new Date().toISOString(), autor: r.autor }] : [];
    }
    const q = this.normalizeText(termino);
    return this.datos.filter((t) => this.normalizeText(t.termino).includes(q) || this.normalizeText(t.definicion).includes(q));
  }
  async crear(entrada) {
    if (this.repo) {
      const r = await this.repo.crear({ termino: entrada.termino, definicion: entrada.definicion, autor: entrada.autor });
      return { id: r.id, termino: r.termino, definicion: r.definicion, estado: r.estado, creadoEn: r.creado_en ?? new Date().toISOString(), autor: r.autor };
    }
    const nuevo = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      termino: entrada.termino,
      definicion: entrada.definicion,
      autor: entrada.autor,
      estado: "pendiente",
      creadoEn: new Date().toISOString()
    };
    this.datos.push(nuevo);
    this.flush();
    return nuevo;
  }
  async actualizar(id, cambios) {
    if (this.repo) {
      const r = await this.repo.actualizar(id, cambios);
      if (!r)
        return null;
      return { id: r.id, termino: r.termino, definicion: r.definicion, estado: r.estado, creadoEn: r.creado_en ?? new Date().toISOString(), autor: r.autor };
    }
    const idx = this.datos.findIndex((d) => d.id === id);
    if (idx === -1)
      return null;
    const actualizado = { ...this.datos[idx], ...cambios };
    this.datos[idx] = actualizado;
    this.flush();
    return actualizado;
  }
  async eliminar(id) {
    if (this.repo) {
      return await this.repo.eliminar(id);
    }
    const orig = this.datos.length;
    this.datos = this.datos.filter((d) => d.id !== id);
    const cambiado = this.datos.length !== orig;
    if (cambiado)
      this.flush();
    return cambiado;
  }
}
var glosario_default = ServicioGlosario;

// src/infraestructura/servidor/controladores/glosario-controlador.ts
var crear = async (request, reply) => {
  let body;
  try {
    body = await esquemaCrearGlosario.parseAsync(request.body);
  } catch (err) {
    return reply.code(400).send({ error: "Datos inválidos", detalles: err.issues ?? err.message });
  }
  const { validarPreCreacion: validarPreCreacion2 } = await Promise.resolve().then(() => (init_validacion_precreacion(), exports_validacion_precreacion));
  const pre = await validarPreCreacion2(body.termino ?? "", "glosario");
  const identificadorInquilino = request.identificadorInquilino;
  const autorId = request.usuario?.id || "UNKNOWN";
  if (process.env.DATABASE_URL) {
    const db = obtenerDb();
    const repoModule = await Promise.resolve().then(() => (init_repositorio_glosario(), exports_repositorio_glosario));
    const creado2 = await repoModule.crearGlosario(db, body, identificadorInquilino, autorId);
    reply.code(201).send({ creado: creado2, preValidacion: pre });
    return;
  }
  const servicio = new glosario_default;
  const creado = await servicio.crear({ termino: body.termino, definicion: body.definicion, autor: autorId });
  reply.code(201).send({ creado, preValidacion: pre });
};
var listar = async (request, reply) => {
  const query = request.query ?? {};
  const identificadorInquilino = request.identificadorInquilino;
  if (process.env.DATABASE_URL) {
    const db = obtenerDb();
    const repoModule = await Promise.resolve().then(() => (init_repositorio_glosario(), exports_repositorio_glosario));
    const rows2 = await repoModule.obtenerListaGlosario(db, { query: query.q, estado: query.estado, limit: query.limit ? Number(query.limit) : undefined, offset: query.offset ? Number(query.offset) : undefined }, identificadorInquilino);
    reply.send(rows2);
    return;
  }
  const servicio = new glosario_default;
  const qParam = query.q ?? query.query;
  let rows = await servicio.listar();
  if (qParam) {
    const normalize2 = (s) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
    const q = normalize2(qParam);
    rows = rows.filter((t) => normalize2(t.termino).includes(q) || normalize2(t.definicion).includes(q));
  }
  if (query.estado) {
    const estado = String(query.estado).toLowerCase();
    rows = rows.filter((t) => String(t.estado ?? "").toLowerCase() === estado);
  }
  const limit = query.limit ? Number(query.limit) : undefined;
  const offset = query.offset ? Number(query.offset) : undefined;
  if (typeof offset === "number" && typeof limit === "number") {
    rows = rows.slice(offset, offset + limit);
  } else if (typeof limit === "number") {
    rows = rows.slice(0, limit);
  }
  reply.send(rows);
};
var obtenerPorId = async (request, reply) => {
  const id = (request.params ?? {})["id"];
  const identificadorInquilino = request.identificadorInquilino;
  if (process.env.DATABASE_URL) {
    const db = obtenerDb();
    const repoModule = await Promise.resolve().then(() => (init_repositorio_glosario(), exports_repositorio_glosario));
    const row = await repoModule.obtenerTerminoPorId(db, id, identificadorInquilino);
    if (!row)
      return reply.code(404).send({ error: "Término no encontrado" });
    reply.send(row);
    return;
  }
  const servicio = new glosario_default;
  const found = (await servicio.listar()).find((t) => t.id === id);
  if (!found)
    return reply.code(404).send({ error: "Término no encontrado" });
  reply.send(found);
};
var actualizar = async (request, reply) => {
  const id = (request.params ?? {})["id"];
  const body = await esquemaActualizarGlosario.parseAsync(request.body);
  const identificadorInquilino = request.identificadorInquilino;
  if (process.env.DATABASE_URL) {
    const db = obtenerDb();
    const repoModule = await Promise.resolve().then(() => (init_repositorio_glosario(), exports_repositorio_glosario));
    const actualizado2 = await repoModule.actualizarGlosario(db, id, body, identificadorInquilino);
    reply.send(actualizado2);
    return;
  }
  const servicio = new glosario_default;
  const actualizado = await servicio.actualizar(id, body);
  if (!actualizado)
    return reply.code(404).send({ error: "Término no encontrado" });
  reply.send(actualizado);
};
var eliminar = async (request, reply) => {
  const id = (request.params ?? {})["id"];
  const identificadorInquilino = request.identificadorInquilino;
  if (process.env.DATABASE_URL) {
    const db = obtenerDb();
    const repoModule = await Promise.resolve().then(() => (init_repositorio_glosario(), exports_repositorio_glosario));
    await repoModule.eliminarGlosario(db, id, identificadorInquilino);
    reply.code(204).send();
    return;
  }
  const servicio = new glosario_default;
  const ok = await servicio.eliminar(id);
  if (!ok)
    return reply.code(404).send({ error: "Término no encontrado" });
  reply.code(204).send();
};

// src/infraestructura/servidor/controladores/adrs-controlador.ts
var crear2 = async (request, reply) => {
  const body = await esquemaCrearADR.parseAsync(request.body);
  const { validarPreCreacion: validarPreCreacion2 } = await Promise.resolve().then(() => (init_validacion_precreacion(), exports_validacion_precreacion));
  const slug = body.slug ?? (body.archivo_markdown ?? "adr-" + (body.numero ?? "0000"));
  const pre = await validarPreCreacion2(slug, "adr");
  const identificadorInquilino = request.identificadorInquilino;
  const autorId = request.usuario?.id || "UNKNOWN";
  let db;
  try {
    db = obtenerDb();
  } catch (_err) {
    db = {};
  }
  const repoModule = await Promise.resolve().then(() => (init_repositorio_adrs(), exports_repositorio_adrs));
  const creado = await repoModule.crearADR(db, body, identificadorInquilino, autorId);
  reply.code(201).send({ creado, preValidacion: pre });
};
var listar2 = async (request, reply) => {
  const query = request.query ?? {};
  const identificadorInquilino = request.identificadorInquilino;
  let db;
  try {
    db = obtenerDb();
  } catch (_err) {
    db = {};
  }
  const repoModule = await Promise.resolve().then(() => (init_repositorio_adrs(), exports_repositorio_adrs));
  const rows = await repoModule.obtenerListaADRs(db, { estado: query.estado, limit: query.limit ? Number(query.limit) : undefined, offset: query.offset ? Number(query.offset) : undefined }, identificadorInquilino);
  reply.send(rows);
};
var obtenerPorId2 = async (request, reply) => {
  const id = (request.params ?? {})["id"];
  const identificadorInquilino = request.identificadorInquilino;
  let db;
  try {
    db = obtenerDb();
  } catch (_err) {
    db = {};
  }
  const repoModule = await Promise.resolve().then(() => (init_repositorio_adrs(), exports_repositorio_adrs));
  const row = await repoModule.obtenerADRPorId(db, id, identificadorInquilino);
  if (!row)
    return reply.code(404).send({ error: "ADR no encontrado" });
  reply.send(row);
};
var actualizar2 = async (request, reply) => {
  const id = (request.params ?? {})["id"];
  const body = await esquemaActualizarADR.parseAsync(request.body);
  const raw2 = request.body;
  const payload = { ...body, ...raw2?.git_ref ? { git_ref: raw2.git_ref } : {} };
  const identificadorInquilino = request.identificadorInquilino;
  let db;
  try {
    db = obtenerDb();
  } catch (_err) {
    db = {};
  }
  const repoModule = await Promise.resolve().then(() => (init_repositorio_adrs(), exports_repositorio_adrs));
  const actualizado = await repoModule.actualizarADR(db, id, payload, identificadorInquilino);
  reply.send(actualizado);
};
var eliminar2 = async (request, reply) => {
  const id = (request.params ?? {})["id"];
  const identificadorInquilino = request.identificadorInquilino;
  let db;
  try {
    db = obtenerDb();
  } catch (_err) {
    db = {};
  }
  const repoModule = await Promise.resolve().then(() => (init_repositorio_adrs(), exports_repositorio_adrs));
  await repoModule.eliminarADR(db, id, identificadorInquilino);
  reply.code(204).send();
};

// src/infraestructura/servidor/controladores/ops-controlador.ts
init_path();
var { default: fs5} = (() => ({}));

// src/nucleo/validadores/validador-ops.ts
var esquemaRenombrado = z.object({
  adrRuta: z.string().min(1),
  ops: z.array(z.object({ desde: z.string().min(1), hacia: z.string().min(1) })).min(1),
  raiz: z.string().optional(),
  mensaje: z.string().optional()
});

// src/infraestructura/servidor/controladores/ops-controlador.ts
var __dirname = "/home/jhoavera/Documentos/TITAN/api/src/infraestructura/servidor/controladores";
async function renombrarPorADR(req, reply) {
  try {
    await esquemaRenombrado.parseAsync(req.body ?? {});
  } catch (err) {
    reply.code(400).send({ error: "Parámetros inválidos", detalle: err?.errors ?? String(err) });
    return;
  }
  const body = req.body;
  const adrRuta = body.adrRuta;
  const ops = body.ops;
  try {
    const contenido = await fs5.promises.readFile(path_default.resolve(adrRuta), "utf8");
    if (!/estado:\s*aprobado/.test(contenido)) {
      reply.code(400).send({ error: "ADR no está en estado aprobado. No se aplicarán renombrados." });
      return;
    }
  } catch (e) {
    reply.code(400).send({ error: `No se puede leer ADR en ruta: ${adrRuta}` });
    return;
  }
  try {
    const raizOverride = body?.raiz;
    const allowOverride = process.env.TITAN_ALLOW_RENAME_ROOT_OVERRIDE === "1";
    const raiz = allowOverride && raizOverride ? raizOverride : process.cwd();
    const pathMod = (init_path(), __toCommonJS(exports_path));
    const svcPath = pathMod.resolve(__dirname, "../../../nucleo/servicios/servicio-automatizacion-renombrados.ts");
    const { ejecutarRenombrados } = await import(svcPath);
    try {
      const res = await ejecutarRenombrados(raiz, ops, { mensaje: body?.mensaje });
      reply.send({ ok: true, detalle: res });
    } catch (e) {
      console.error("ERROR ops-controlador ejecutarRenombrados:", e?.message ?? String(e), e?.stack);
      reply.code(500).send({ error: e?.message ?? String(e) });
    }
  } catch (e) {
    reply.code(500).send({ error: e?.message ?? String(e) });
  }
}

// src/infraestructura/servidor/controladores/auditoria-controlador.ts
var __dirname = "/home/jhoavera/Documentos/TITAN/api/src/infraestructura/servidor/controladores";
async function listarPreValidacion(req, reply) {
  const limit = Number((req.query ?? {})["limit"] ?? 100);
  const path = (init_path(), __toCommonJS(exports_path));
  const svcPath = path.resolve(__dirname, "../../../nucleo/servicios/servicio-auditoria-prevalidacion.ts");
  const svc = await import(svcPath);
  const eventos = await svc.leerEventos(limit);
  reply.send({ count: eventos.length, eventos });
}
async function metrics(req, reply) {
  const path = (init_path(), __toCommonJS(exports_path));
  const svcPath = path.resolve(__dirname, "../../../nucleo/servicios/servicio-auditoria-prevalidacion.ts");
  const svc = await import(svcPath);
  const txt = await svc.metricsText()();
  reply.type("text/plain").send(txt);
}

// src/infraestructura/servidor/servidor-hono.ts
var app = new Hono2;
app.use("*", middlewareAutenticacionJWTHono());
app.use("/api/*", middlewareRateLimitInquilino());
app.post("/api/v1/glosario", adaptarHandler(crear));
app.get("/api/v1/glosario", adaptarHandler(listar));
app.get("/api/v1/glosario/:id", adaptarHandler(obtenerPorId));
app.patch("/api/v1/glosario/:id", adaptarHandler(actualizar));
app.delete("/api/v1/glosario/:id", adaptarHandler(eliminar));
app.post("/api/v1/adrs", adaptarHandler(crear2));
app.get("/api/v1/adrs", adaptarHandler(listar2));
app.get("/api/v1/adrs/:id", adaptarHandler(obtenerPorId2));
app.patch("/api/v1/adrs/:id", adaptarHandler(actualizar2));
app.delete("/api/v1/adrs/:id", adaptarHandler(eliminar2));
app.post("/api/v1/ops/renombrar-por-adr", adaptarHandler(renombrarPorADR));
app.get("/api/v1/auditoria/prevalidacion", adaptarHandler(listarPreValidacion));
app.get("/metrics", adaptarHandler(metrics));
app.get("/.well-known/health", (c) => c.text("ok"));
app.get("/api/docs/openapi.yaml", async (c) => {
  const yaml = generateOpenApiYAML();
  return c.text(yaml, 200, { "content-type": "text/vnd.yaml" });
});
app.get("/api/docs", async (c) => {
  const redoc = `<!doctype html><html><head><meta charset="utf-8"><title>Docs</title></head><body><redoc spec-url='/api/docs/openapi.yaml'></redoc><script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script></body></html>`;
  return c.html(redoc);
});
var PORT = Number(process.env.PORT || 3000);
async function start() {
  console.log(`Iniciando servidor Hono en puerto ${PORT}`);
  process.env.PORT = String(PORT);
  await app.fire();
}
if (import.meta.main) {
  start().catch((err) => {
    console.error("Error iniciando servidor Hono:", err);
    process.exit(1);
  });
}
var servidor_hono_default = app;
export {
  servidor_hono_default as default
};
