"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getTagsForFile_1 = __importDefault(require("./getTagsForFile"));
// Returns true if the given file matches has any of the given tags
function fileHasNecessaryTag(filePath, tags) {
    // If no tags are provided, default to true
    if (tags == null) {
        return true;
    }
    // Normalize the tags to an array
    if (!Array.isArray(tags)) {
        tags = [tags];
    }
    // See if any of the file's tags are in the tags list
    let fileTags = getTagsForFile_1.default(filePath);
    for (let i = 0; i < fileTags.length; i++) {
        if (tags.indexOf(fileTags[i]) != -1) {
            return true;
        }
    }
    return false;
}
exports.default = fileHasNecessaryTag;
