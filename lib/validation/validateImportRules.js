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
const result_1 = require("../core/result");
const getTagsForFile_1 = __importDefault(require("../utils/getTagsForFile"));
function validateImportRules(sourceFile, importRecord) {
    // Validate against each config that applies to the imported file
    let configsForSource = getConfigsForFile_1.default(sourceFile);
    for (let config of configsForSource) {
        validateConfig(config, sourceFile, importRecord);
    }
}
exports.default = validateImportRules;
function validateConfig(config, sourceFile, importRecord) {
    // If the config doesn't specify imports then all imports are allowed
    if (!config.imports) {
        return;
    }
    // If the source file is under the config (i.e. the source and import files share the
    // config) then we don't apply the import rules
    if (!path.relative(config.path, importRecord.filePath).startsWith('..')) {
        return;
    }
    // For the the import to be valid, one of its tags needs to match one of the allowed tags
    let importTags = getTagsForFile_1.default(importRecord.filePath);
    for (let tag of config.imports) {
        if (importTags.indexOf(tag) != -1) {
            // A tag matched, so the import is valid
            return;
        }
    }
    // If we made it here, the import is invalid
    result_1.reportViolation('Import not allowed', sourceFile, importRecord, config);
}
