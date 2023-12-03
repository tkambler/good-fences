"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getConfigsForFile_1 = __importDefault(require("../utils/getConfigsForFile"));
const result_1 = require("../core/result");
const fileHasNecessaryTag_1 = __importDefault(require("../utils/fileHasNecessaryTag"));
const minimatch = require('minimatch');
function validateDependencyRules(sourceFile, importRecord) {
    // Validate against each config that applies to the imported file
    let configsForSource = getConfigsForFile_1.default(sourceFile);
    for (let config of configsForSource) {
        validateConfig(config, sourceFile, importRecord);
    }
}
exports.default = validateDependencyRules;
function validateConfig(config, sourceFile, importRecord) {
    // If the config doesn't specify dependencies then all dependencies are allowed
    if (!config.dependencies) {
        return;
    }
    // In order for the the dependency to be valid, there needs to be some rule that allows it
    for (let dependencyRule of config.dependencies) {
        // Check whether:
        //   1) The import matches the rule
        //   2) If necessary, the source file has a relevant tag
        if (minimatch(importRecord.rawImport, dependencyRule.dependency) &&
            fileHasNecessaryTag_1.default(sourceFile, dependencyRule.accessibleTo)) {
            // A rule matched, so the dependency is valid
            return;
        }
    }
    // If we made it here, we didn't find a rule that allows the dependency
    result_1.reportViolation('Dependency is not allowed', sourceFile, importRecord, config);
}
