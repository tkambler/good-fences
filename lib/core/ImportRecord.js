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
const normalizePath_1 = __importDefault(require("../utils/normalizePath"));
const path = __importStar(require("path"));
const getOptions_1 = __importDefault(require("../utils/getOptions"));
class ImportRecord {
    constructor(rawImport, resolvedFileName) {
        this.rawImport = rawImport;
        if (resolvedFileName) {
            this.filePath = normalizePath_1.default(resolvedFileName);
        }
    }
    // Is this import an external dependency (i.e. is it under node_modules or outside the rootDir)?
    get isExternal() {
        let isInNodeModules = this.filePath.split(path.sep).indexOf('node_modules') != -1;
        let isUnderRootFolder = getOptions_1.default().rootDir.some(rootDir => this.filePath.startsWith(rootDir));
        let isLocalRelativePath = this.filePath.startsWith('./');
        let isExternalPath = !isUnderRootFolder && !isLocalRelativePath;
        return isInNodeModules || isExternalPath;
    }
}
exports.default = ImportRecord;
