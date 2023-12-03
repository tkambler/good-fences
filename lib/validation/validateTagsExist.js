"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTagsExist = void 0;
const getConfigManager_1 = __importDefault(require("../utils/getConfigManager"));
const result_1 = require("../core/result");
function validateTagsExist() {
    const allConfigs = getConfigManager_1.default().getAllConfigs();
    const allTags = new Set();
    // Accumulate all tags that are defined
    for (const key of Object.keys(allConfigs)) {
        const config = allConfigs[key];
        if (config.tags) {
            for (const tag of config.tags) {
                allTags.add(tag);
            }
        }
    }
    // Warn for tags that are referenced but not actually defined
    for (const key of Object.keys(allConfigs)) {
        const config = allConfigs[key];
        forEachTagReferencedInConfig(config, tag => {
            if (!allTags.has(tag)) {
                result_1.reportWarning(`Tag '${tag}' is referred to but is not defined in any fence.`, config.path);
            }
        });
    }
}
exports.validateTagsExist = validateTagsExist;
function forEachTagReferencedInConfig(config, callback) {
    if (config.exports) {
        for (const exportRule of config.exports) {
            forEachTag(exportRule.accessibleTo, callback);
        }
    }
    if (config.dependencies) {
        for (const dependencyRule of config.dependencies) {
            forEachTag(dependencyRule.accessibleTo, callback);
        }
    }
    if (config.imports) {
        for (const importTag of config.imports) {
            callback(importTag);
        }
    }
}
function forEachTag(tags, callback) {
    if (!tags) {
        return;
    }
    if (!Array.isArray(tags)) {
        tags = [tags];
    }
    for (const tag of tags) {
        callback(tag);
    }
}
