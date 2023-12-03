import NormalizedPath from '../types/NormalizedPath';
import { SourceFileProvider } from './SourceFileProvider';
export default class TypeScriptProgram implements SourceFileProvider {
    private compilerOptions;
    private compilerHost;
    private program;
    constructor(configFile: NormalizedPath);
    getSourceFiles(): string[];
    getImportsForFile(fileName: NormalizedPath): string[];
    resolveImportFromFile(containingFile: NormalizedPath, moduleName: string): string;
}
