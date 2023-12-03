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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const getOptions_1 = __importDefault(require("./getOptions"));
const loadConfig_1 = __importDefault(require("./loadConfig"));
const getConfigPathCandidatesForFile_1 = require("./getConfigPathCandidatesForFile");
class ConfigManager {
    constructor() {
        this.fullConfigSet = null;
        // The subset of configs that has been loaded
        this.partialDiscoveredConfigs = {};
        // The set of paths we have checked for configs in the filesystem
        this.discoveredPaths = new Set();
    }
    getAllConfigs() {
        if (this.fullConfigSet === null) {
            this._getAllConfigs();
        }
        return this.fullConfigSet;
    }
    getPartialConfigSetForPath(configSourcePath) {
        const partialSet = {};
        const configCandidatesForFile = getConfigPathCandidatesForFile_1.getConfigPathCandidatesForFile(configSourcePath);
        if (this.fullConfigSet) {
            // If the full config set has been initialized (e.g. by calling cfgManager.getAllConfigs)
            // then instead of doing redundant fs access, construct the result from the full config
            // set
            for (let configPathCandidate of configCandidatesForFile) {
                if (this.fullConfigSet[configPathCandidate]) {
                    partialSet[configPathCandidate] = this.fullConfigSet[configPathCandidate];
                }
            }
        }
        else {
            // If the full config set has not been initialized, go to disk to find configs in the
            // candidate set.
            //
            // As we scan paths, we add them to our partial configs and our set of checked paths
            // so we can avoid redudnant fs access for this same fence and path in the future.
            for (let configPathCandidate of configCandidatesForFile) {
                const configPathCandidateFull = path.join(configPathCandidate, 'fence.json');
                if (this.discoveredPaths.has(configPathCandidateFull)) {
                    const discoveredConfig = this.partialDiscoveredConfigs[configPathCandidate];
                    if (discoveredConfig) {
                        partialSet[configPathCandidateFull] = discoveredConfig;
                    }
                }
                else {
                    try {
                        const stat = fs.statSync(configPathCandidateFull);
                        if (stat === null || stat === void 0 ? void 0 : stat.isFile()) {
                            loadConfig_1.default(configPathCandidateFull, partialSet);
                        }
                    }
                    catch (_a) {
                        // pass e.g. for ENOENT
                    }
                    this.discoveredPaths.add(configPathCandidateFull);
                }
            }
            Object.assign(this.partialDiscoveredConfigs, partialSet);
        }
        return partialSet;
    }
    _getAllConfigs() {
        this.fullConfigSet = {};
        let files = [];
        for (let rootDir of getOptions_1.default().rootDir) {
            accumulateFences(rootDir, files, getOptions_1.default().ignoreExternalFences);
        }
        files.forEach(file => {
            loadConfig_1.default(file, this.fullConfigSet);
        });
    }
}
let configManager = null;
function getConfigManager() {
    if (!configManager) {
        configManager = new ConfigManager();
    }
    return configManager;
}
exports.default = getConfigManager;
function accumulateFences(dir, files, ignoreExternalFences) {
    const directoryEntries = fs.readdirSync(dir, { withFileTypes: true });
    for (const directoryEntry of directoryEntries) {
        const fullPath = path.join(dir, directoryEntry.name);
        if (directoryEntry.name == 'fence.json') {
            files.push(fullPath);
        }
        else if (directoryEntry.isDirectory() &&
            !(ignoreExternalFences && directoryEntry.name == 'node_modules')) {
            accumulateFences(fullPath, files, ignoreExternalFences);
        }
    }
}
