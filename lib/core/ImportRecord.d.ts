import NormalizedPath from '../types/NormalizedPath';
export default class ImportRecord {
    rawImport: string;
    filePath: NormalizedPath;
    constructor(rawImport: string, resolvedFileName: string | undefined);
    get isExternal(): boolean;
}
