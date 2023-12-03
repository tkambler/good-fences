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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const normalizePath_1 = __importDefault(require("./normalizePath"));
const minimatch = require('minimatch');
function fileMatchesConfigGlob(importFile, configPath, modulesGlob) {
    // '*' matches all files under the config
    if (modulesGlob == '*') {
        return true;
    }
    // Remove the file extension before matching
    importFile = removeFileExtension(importFile);
    return minimatch(importFile, normalizePath_1.default(configPath, modulesGlob));
}
exports.default = fileMatchesConfigGlob;
function removeFileExtension(filePath) {
    // Special case for .d.ts files
    let extension = filePath.endsWith('.d.ts') ? '.d.ts' : path.extname(filePath);
    return filePath.slice(0, filePath.length - extension.length);
}
