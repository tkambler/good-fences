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
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportWarning = exports.reportConfigError = exports.reportViolation = exports.getResult = exports.resetResult = void 0;
const path = __importStar(require("path"));
let result = {
    errors: [],
    warnings: [],
};
function resetResult() {
    result = {
        errors: [],
        warnings: [],
    };
}
exports.resetResult = resetResult;
function getResult() {
    return result;
}
exports.getResult = getResult;
function reportViolation(message, sourceFile, importRecord, config) {
    let fencePath = config.path + path.sep + 'fence.json';
    let detailedMessage = `Good-fences violation in ${sourceFile}:\n` +
        `    ${message}: ${importRecord.rawImport}\n` +
        `    Fence: ${fencePath}`;
    const error = {
        message,
        sourceFile,
        rawImport: importRecord.rawImport,
        fencePath,
        detailedMessage,
    };
    result.errors.push(error);
}
exports.reportViolation = reportViolation;
function reportConfigError(message, configPath) {
    let fencePath = configPath + path.sep + 'fence.json';
    let detailedMessage = `Good-fences configuration error: ${message}\n` + `    Fence: ${fencePath}`;
    const error = {
        message,
        fencePath,
        detailedMessage,
    };
    result.errors.push(error);
}
exports.reportConfigError = reportConfigError;
function reportWarning(message, configPath) {
    let fencePath = configPath + path.sep + 'fence.json';
    let detailedMessage = `Good-fences warning: ${message}`;
    if (configPath) {
        detailedMessage += `\n    Fence: ${fencePath}`;
    }
    const warning = {
        message,
        fencePath,
        detailedMessage,
    };
    result.warnings.push(warning);
}
exports.reportWarning = reportWarning;
