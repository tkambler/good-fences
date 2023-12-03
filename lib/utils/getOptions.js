"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setOptions = void 0;
const normalizePath_1 = __importDefault(require("./normalizePath"));
let options;
function getOptions() {
    return options;
}
exports.default = getOptions;
function setOptions(rawOptions) {
    // Normalize and apply defaults
    const nonNormalizedRoots = Array.isArray(rawOptions.rootDir)
        ? rawOptions.rootDir
        : [rawOptions.rootDir || process.cwd()];
    const rootDir = nonNormalizedRoots.map((individualRootDirPath) => normalizePath_1.default(individualRootDirPath));
    const project = rawOptions.project
        ? normalizePath_1.default(rawOptions.project)
        : normalizePath_1.default(rootDir[0], 'tsconfig.json');
    if (typeof rawOptions.partialCheckLimit === 'number' && !rawOptions.sinceGitHash) {
        throw new Error('Cannot specify --partialCheckLimit without --sinceGitHash');
    }
    options = {
        project,
        rootDir,
        ignoreExternalFences: rawOptions.ignoreExternalFences,
        partialCheckLimit: rawOptions === null || rawOptions === void 0 ? void 0 : rawOptions.partialCheckLimit,
        sinceGitHash: rawOptions.sinceGitHash,
        looseRootFileDiscovery: rawOptions.looseRootFileDiscovery || false,
        maxConcurrentFenceJobs: rawOptions.maxConcurrentJobs || 6000,
        progress: rawOptions.progressBar || false,
        excludeFilesPattern: rawOptions.excludeFilesPattern,
    };
}
exports.setOptions = setOptions;
