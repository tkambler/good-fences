"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FDirSourceFileProvider = void 0;
const fdir_1 = require("fdir");
const util_1 = require("util");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const readFile = util_1.promisify(fs.readFile);
const stat = util_1.promisify(fs.stat);
const tsconfig_paths_1 = require("tsconfig-paths");
const getScriptFileExtensions_1 = require("../utils/getScriptFileExtensions");
const typescript_1 = require("typescript");
const picomatch_1 = __importDefault(require("picomatch"));
class FDirSourceFileProvider {
    constructor(configFileName, rootDirs) {
        var _a, _b, _c, _d;
        this.rootDirs = rootDirs;
        // Load the full config file, relying on typescript to recursively walk the "extends" fields,
        // while stubbing readDirectory calls to stop the full file walk of the include() patterns.
        //
        // We do this because we need to access the parsed compilerOptions, but do not care about
        // the full file list.
        this.parsedCommandLine = typescript_1.getParsedCommandLineOfConfigFile(configFileName, {}, // optionsToExtend
        {
            getCurrentDirectory: process.cwd,
            fileExists: fs.existsSync,
            useCaseSensitiveFileNames: true,
            readFile: path => fs.readFileSync(path, 'utf-8'),
            readDirectory: () => {
                // this is supposed to be the recursive file walk.
                // since we don't care about _actually_ discovering files,
                // only about parsing the config's compilerOptions
                // (and tracking the "extends": fields across multiple files)
                // we short circuit this.
                return [];
            },
            onUnRecoverableConfigFileDiagnostic: diagnostic => {
                console.error(diagnostic);
                process.exit(1);
            },
        });
        const baseUrl = (_a = this.parsedCommandLine.options.baseUrl) !== null && _a !== void 0 ? _a : path.dirname(configFileName);
        this.excludePatternsPicoMatchers = ((_c = (_b = this.parsedCommandLine.raw) === null || _b === void 0 ? void 0 : _b.exclude) !== null && _c !== void 0 ? _c : []).map((excludePattern) => {
            const matcher = picomatch_1.default(excludePattern);
            return (pathToCheck) => {
                return matcher(path.relative(baseUrl, pathToCheck));
            };
        });
        this.sourceFileGlob = `**/*@(${getScriptFileExtensions_1.getScriptFileExtensions({
            // Derive these settings from the typescript project itself
            allowJs: this.parsedCommandLine.options.allowJs || false,
            jsx: this.parsedCommandLine.options.jsx !== typescript_1.JsxEmit.None,
            // Since we're trying to find script files that can have imports,
            // we explicitly exclude json modules
            includeJson: false,
            // since definition files are '.d.ts', the extra
            // definition extensions here are covered by the glob '*.ts' from
            // the above settings.
            //
            // Here as an optimization we avoid adding these definition files while
            // globbing
            includeDefinitions: false,
        }).join('|')})`;
        // Script extensions to check when looking for imports.
        this.extensionsToCheckDuringImportResolution = getScriptFileExtensions_1.getScriptFileExtensions({
            // Derive these settings from the typescript project itself
            allowJs: this.parsedCommandLine.options.allowJs || false,
            jsx: this.parsedCommandLine.options.jsx !== typescript_1.JsxEmit.None,
            includeJson: this.parsedCommandLine.options.resolveJsonModule,
            // When scanning for imports, we always consider importing
            // definition files.
            includeDefinitions: true,
        });
        this.matchPath = tsconfig_paths_1.createMatchPathAsync(baseUrl, (_d = this.parsedCommandLine.options.paths) !== null && _d !== void 0 ? _d : {});
    }
    getSourceFiles(searchRoots) {
        return __awaiter(this, void 0, void 0, function* () {
            const allRootsDiscoveredFiles = yield Promise.all((searchRoots || this.rootDirs).map((rootDir) => new fdir_1.fdir()
                .glob(this.sourceFileGlob)
                .withFullPaths()
                .crawl(rootDir)
                .withPromise()));
            return [
                ...new Set(allRootsDiscoveredFiles.reduce((a, b) => a.concat(b), [])),
            ].filter((p) => !this.isPathExcluded(p));
        });
    }
    isPathExcluded(path) {
        return this.excludePatternsPicoMatchers.some(isMatch => isMatch(path));
    }
    getImportsForFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileInfo = typescript_1.preProcessFile(yield readFile(filePath, 'utf-8'), true, true);
            return fileInfo.importedFiles.map(importedFile => importedFile.fileName);
        });
    }
    resolveImportFromFile(importer, importSpecifier) {
        return __awaiter(this, void 0, void 0, function* () {
            if (importSpecifier.startsWith('.')) {
                // resolve relative and check extensions
                const directImportResult = yield checkExtensions(path.join(path.dirname(importer), importSpecifier), [
                    ...this.extensionsToCheckDuringImportResolution,
                    // Also check for no-exension to permit import specifiers that
                    // already have an extension (e.g. require('foo.js'))
                    '',
                    // also check for directory index imports
                    ...this.extensionsToCheckDuringImportResolution.map(x => '/index' + x),
                ]);
                if (directImportResult &&
                    this.extensionsToCheckDuringImportResolution.some(extension => directImportResult.endsWith(extension))) {
                    // this is an allowed script file
                    return directImportResult;
                }
                else {
                    // this is an asset file
                    return undefined;
                }
            }
            else {
                // resolve with tsconfig-paths (use the paths map, then fall back to node-modules)
                return yield new Promise((resolve, reject) => this.matchPath(importSpecifier, undefined, // readJson
                undefined, // fileExists
                [...this.extensionsToCheckDuringImportResolution, ''], (err, result) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        reject(err);
                    }
                    else if (!result) {
                        resolve(undefined);
                    }
                    else {
                        if (isFile(result) &&
                            this.extensionsToCheckDuringImportResolution.some(extension => result.endsWith(extension))) {
                            // this is an exact require of a known script extension, resolve
                            // it up front
                            resolve(result);
                        }
                        else {
                            // tsconfig-paths returns a path without an extension.
                            // if it resolved to an index file, it returns the path to
                            // the directory of the index file.
                            if (yield isDirectory(result)) {
                                resolve(checkExtensions(path.join(result, 'index'), this.extensionsToCheckDuringImportResolution));
                            }
                            else {
                                resolve(checkExtensions(result, this.extensionsToCheckDuringImportResolution));
                            }
                        }
                    }
                })));
            }
        });
    }
}
exports.FDirSourceFileProvider = FDirSourceFileProvider;
function isFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // stat will throw if the file does not exist
            const statRes = yield stat(filePath);
            if (statRes.isFile()) {
                return true;
            }
        }
        catch (_a) {
            // file does not exist
            return false;
        }
    });
}
function isDirectory(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // stat will throw if the file does not exist
            const statRes = yield stat(filePath);
            if (statRes.isDirectory()) {
                return true;
            }
        }
        catch (_a) {
            // file does not exist
            return false;
        }
    });
}
function checkExtensions(filePathNoExt, extensions) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let ext of extensions) {
            const joinedPath = filePathNoExt + ext;
            if (yield isFile(joinedPath)) {
                return joinedPath;
            }
        }
        return undefined;
    });
}
