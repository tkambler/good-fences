import { SourceFileProvider } from './SourceFileProvider';
import NormalizedPath from '../types/NormalizedPath';
import { MatchPathAsync } from 'tsconfig-paths';
import { ParsedCommandLine } from 'typescript';
import picomatch from 'picomatch';
export declare class FDirSourceFileProvider implements SourceFileProvider {
    private rootDirs;
    parsedCommandLine: ParsedCommandLine;
    excludePatternsPicoMatchers: picomatch.Matcher[];
    matchPath: MatchPathAsync;
    private sourceFileGlob;
    private extensionsToCheckDuringImportResolution;
    constructor(configFileName: NormalizedPath, rootDirs: string[]);
    getSourceFiles(searchRoots?: string[]): Promise<string[]>;
    private isPathExcluded;
    getImportsForFile(filePath: string): Promise<string[]>;
    resolveImportFromFile(importer: string, importSpecifier: string): Promise<string | undefined>;
}
