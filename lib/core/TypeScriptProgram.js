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
const ts = __importStar(require("typescript"));
const path = __importStar(require("path"));
// Helper class for interacting with TypeScript
class TypeScriptProgram {
    constructor(configFile) {
        // Parse the config file
        const config = readConfigFile(configFile);
        const projectPath = path.dirname(configFile);
        const parsedConfig = ts.parseJsonConfigFileContent(config, ts.sys, projectPath);
        this.compilerOptions = parsedConfig.options;
        // Create the program
        this.compilerHost = ts.createCompilerHost(this.compilerOptions);
        this.program = ts.createProgram(parsedConfig.fileNames, this.compilerOptions, this.compilerHost);
    }
    getSourceFiles() {
        // Filter out .d.ts files
        return this.program
            .getSourceFiles()
            .map(file => file.fileName)
            .filter(fileName => !fileName.endsWith('.d.ts'));
    }
    // Get all imports from a given file
    getImportsForFile(fileName) {
        let fileInfo = ts.preProcessFile(ts.sys.readFile(fileName), true, true);
        return fileInfo.importedFiles.map(importedFile => importedFile.fileName);
    }
    // Resolve an imported module
    resolveImportFromFile(containingFile, moduleName) {
        const resolvedFile = ts.resolveModuleName(moduleName, containingFile.replace(/\\/g, '/'), // TypeScript doesn't like backslashes here
        this.compilerOptions, this.compilerHost, null // TODO: provide a module resolution cache
        );
        return resolvedFile.resolvedModule && resolvedFile.resolvedModule.resolvedFileName;
    }
}
exports.default = TypeScriptProgram;
function readConfigFile(configFile) {
    const { config, error } = ts.readConfigFile(configFile, ts.sys.readFile);
    if (error) {
        throw new Error('Error reading project file: ' + error.messageText);
    }
    return config;
}
