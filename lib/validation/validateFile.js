"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validateExportRules_1 = __importDefault(require("./validateExportRules"));
const getImportsFromFile_1 = __importDefault(require("../utils/getImportsFromFile"));
const validateDependencyRules_1 = __importDefault(require("./validateDependencyRules"));
const validateImportRules_1 = __importDefault(require("./validateImportRules"));
function validateFile(filePath, fileProvider) {
    return __awaiter(this, void 0, void 0, function* () {
        const imports = yield getImportsFromFile_1.default(filePath, fileProvider);
        for (let importRecord of imports) {
            validateExportRules_1.default(filePath, importRecord);
            if (importRecord.isExternal) {
                // External dependency, so apply dependency rules
                validateDependencyRules_1.default(filePath, importRecord);
            }
            else {
                // Internal dependency, so apply import rules
                validateImportRules_1.default(filePath, importRecord);
            }
        }
    });
}
exports.default = validateFile;
