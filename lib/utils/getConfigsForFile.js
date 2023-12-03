"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getConfigManager_1 = __importDefault(require("./getConfigManager"));
// Returns an array of all the configs that apply to a given file
function getConfigsForFile(filePath) {
    const partialFenceSet = getConfigManager_1.default().getPartialConfigSetForPath(filePath);
    return Object.entries(partialFenceSet).map(([_configPath, config]) => config);
}
exports.default = getConfigsForFile;
