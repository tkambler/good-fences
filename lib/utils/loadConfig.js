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
exports.normalizeExportRules = exports.loadConfigFromString = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const strip_json_comments_1 = __importDefault(require("strip-json-comments"));
const normalizePath_1 = __importDefault(require("./normalizePath"));
const validateRawConfig_1 = __importDefault(require("../validation/validateRawConfig"));
function loadConfigFromString(configPath, fileContent) {
    // Strip BOM if needed
    if (fileContent.charCodeAt(0) === 0xfeff) {
        fileContent = fileContent.slice(1);
    }
    fileContent = strip_json_comments_1.default(fileContent);
    // Load the raw config
    let rawConfig = JSON.parse(fileContent);
    // Validate it
    if (validateRawConfig_1.default(rawConfig, configPath)) {
        // Normalize it
        return {
            path: configPath,
            tags: rawConfig.tags,
            exports: normalizeExportRules(rawConfig.exports),
            dependencies: normalizeDependencyRules(rawConfig.dependencies),
            imports: rawConfig.imports,
        };
    }
    return null;
}
exports.loadConfigFromString = loadConfigFromString;
function loadConfig(file, configSet) {
    // Load the raw config
    const configPath = normalizePath_1.default(path.dirname(file));
    // Validate and normalize it
    const config = loadConfigFromString(configPath, fs.readFileSync(file, 'utf-8'));
    if (config) {
        // Add it to the config set
        configSet[config.path] = config;
    }
}
exports.default = loadConfig;
function normalizeDependencyRules(rules) {
    if (!rules) {
        return null;
    }
    return rules.map(dependency => {
        // Upgrade simple strings to DependencyRule structs
        if (typeof dependency == 'string') {
            return {
                dependency,
                accessibleTo: null,
            };
        }
        else {
            return dependency;
        }
    });
}
function normalizeExportRules(rules) {
    if (!rules) {
        return null;
    }
    return rules.map(exportRule => {
        // Upgrade simple strings to ExportRule structs
        if (typeof exportRule == 'string') {
            return {
                modules: exportRule,
                accessibleTo: null,
            };
        }
        else {
            return exportRule;
        }
    });
}
exports.normalizeExportRules = normalizeExportRules;
