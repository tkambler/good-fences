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
const getConfigsForFile_1 = __importDefault(require("../utils/getConfigsForFile"));
const fileMatchesConfigGlob_1 = __importDefault(require("../utils/fileMatchesConfigGlob"));
const fileHasNecessaryTag_1 = __importDefault(require("../utils/fileHasNecessaryTag"));
const result_1 = require("../core/result");
function validateExportRules(sourceFile, importRecord) {
    // Validate against each config that applies to the imported file
    let configsForImport = getConfigsForFile_1.default(importRecord.filePath);
    configsForImport.forEach(config => validateConfig(config, sourceFile, importRecord));
}
exports.default = validateExportRules;
function validateConfig(config, sourceFile, importRecord) {
    // If the source file is under the config (i.e. the source and import files share the
    // config) then we don't apply the export rules
    if (!path.relative(config.path, sourceFile).startsWith('..')) {
        return;
    }
    // If the config doesn't specify exports then everything is considered public
    if (!config.exports) {
        return;
    }
    // See if the config has an export rule that matches
    if (hasMatchingExport(config, sourceFile, importRecord.filePath)) {
        return;
    }
    // If we made it here, the import is invalid
    result_1.reportViolation('Module is not exported', sourceFile, importRecord, config);
}
function hasMatchingExport(config, sourceFile, importFile) {
    let isExported = false;
    for (const exportRule of config.exports) {
        if (fileMatchesConfigGlob_1.default(importFile, config.path, exportRule.modules) &&
            fileHasNecessaryTag_1.default(sourceFile, exportRule.accessibleTo)) {
            isExported = true;
        }
    }
    return isExported;
}
