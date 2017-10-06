import getTagsForFile from './getTagsForFile';

// Determines whether a given file matches any of the given tags
export default function matchTagsToFile(tags: string | string[], filePath: string) {
    // '*' matches all files
    if (tags == '*') {
        return true;
    }

    // Normalize the tags to an array
    if (!Array.isArray(tags)) {
        tags = [tags];
    }

    // See if any of the file's tags are in the tags list
    let fileTags = getTagsForFile(filePath);
    for (let i = 0; i < fileTags.length; i++) {
        if (tags.indexOf(fileTags[i]) != -1) {
            return true;
        }
    }

    return false;
}
