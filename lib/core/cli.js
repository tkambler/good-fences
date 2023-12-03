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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander = __importStar(require("commander"));
const runner_1 = require("./runner");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Read the package version from package.json
        const packageVersion = require('../../package.json').version;
        // Parse command line options
        const program = commander.program
            .version(packageVersion)
            .option('-p, --project <string> ', 'tsconfig.json file')
            .option('-r, --rootDir <string...>', 'root directories of the project')
            .option('-g, --sinceGitHash <string>', 'Infer files and fences to check based on changes since the specified git hash')
            .option('-l, --partialCheckLimit <number>', 'Maximum files to check during a partial check run. If more files than this limit are changed, the partial check will be aborted and good-fences will exit with code 0.')
            .option('-x, --looseRootFileDiscovery', '(UNSTABLE) Check source files under rootDirs instead of instantiating a full typescript program.')
            .option('-i, --ignoreExternalFences', 'Whether to ignore external fences (e.g. those from node_modules)')
            .option('-j, --maxConcurrentFenceJobs', 'Maximum number of concurrent fence jobs to run. Default 6000')
            .option('-p, --excludeFilesPattern <string>', 'Exclude files matching the pattern from validation')
            .option('-b, --progressBar', 'Show a progress bar while evaluating fences');
        program.parse(process.argv);
        const options = program.opts();
        // Run good-fences
        const result = yield runner_1.run(options);
        // Write results to the console
        for (const error of result.errors) {
            console.error(error.detailedMessage);
        }
        for (const warning of result.warnings) {
            console.error(warning.detailedMessage);
        }
        // Indicate success or failure via the exit code
        process.exitCode = result.errors.length > 0 ? 1 : 0;
    });
}
main().catch(e => {
    console.error('Error while running fences:', e.stack);
    process.exit(1);
});
