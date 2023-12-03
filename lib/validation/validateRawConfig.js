"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const result_1 = require("../core/result");
// Returns true if the config validates successfully
function validateRawConfig(rawConfig, configPath) {
    let hasError = false;
    if (rawConfig.export && !rawConfig.exports) {
        result_1.reportWarning("Config defines an 'export' property.  Did you mean 'exports'?", configPath);
    }
    if (rawConfig.import && !rawConfig.imports) {
        result_1.reportWarning("Config defines an 'import' property.  Did you mean 'imports'?", configPath);
    }
    if (rawConfig.tags && !Array.isArray(rawConfig.tags)) {
        result_1.reportConfigError("The 'tags' property should be an array of tag strings.", configPath);
        hasError = true;
    }
    if (rawConfig.exports && !Array.isArray(rawConfig.exports)) {
        result_1.reportConfigError("The 'exports' property should be an array of export rules.", configPath);
        hasError = true;
    }
    if (rawConfig.dependencies && !Array.isArray(rawConfig.dependencies)) {
        result_1.reportConfigError("The 'dependencies' property should be an array of dependency rules.", configPath);
        hasError = true;
    }
    if (rawConfig.imports && !Array.isArray(rawConfig.imports)) {
        result_1.reportConfigError("The 'imports' property should be an array of import rules.", configPath);
        hasError = true;
    }
    return !hasError;
}
exports.default = validateRawConfig;
