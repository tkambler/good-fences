"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTsImportSetFromSourceString = void 0;
const typescript_1 = require("typescript");
function getTsImportSetFromSourceString(tsSource) {
    let fileInfo = typescript_1.preProcessFile(tsSource, true, true);
    return new Set(fileInfo.importedFiles.map(importedFile => importedFile.fileName));
}
exports.getTsImportSetFromSourceString = getTsImportSetFromSourceString;
