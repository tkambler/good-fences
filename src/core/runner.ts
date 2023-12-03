import RawOptions from '../types/RawOptions';
import getOptions, { setOptions } from '../utils/getOptions';
import validateFile from '../validation/validateFile';
import TypeScriptProgram from './TypeScriptProgram';
import normalizePath from '../utils/normalizePath';
import { getResult, resetResult } from './result';
import { SourceFileProvider } from './SourceFileProvider';
import { FDirSourceFileProvider } from './FdirSourceFileProvider';
import NormalizedPath from '../types/NormalizedPath';
import { runWithConcurrentLimit } from '../utils/runWithConcurrentLimit';

async function getSourceFilesNormalized(
    sourceFileProvider: SourceFileProvider,
    rootDirs?: string[]
): Promise<NormalizedPath[]> {
    let files = await sourceFileProvider.getSourceFiles(rootDirs);
    const normalizedFiles = files.map(file => normalizePath(file));
    return normalizedFiles;
}

export async function run(rawOptions: RawOptions) {
    // Store options so they can be globally available
    setOptions(rawOptions);
    let options = getOptions();

    let sourceFileProvider: SourceFileProvider = options.looseRootFileDiscovery
        ? new FDirSourceFileProvider(options.project, options.rootDir)
        : new TypeScriptProgram(options.project);

    let normalizedFiles = await getSourceFilesNormalized(sourceFileProvider);

    if (options.excludeFilesPattern !== undefined) {
        // A naive string replace to convert the glob pattern to a regex pattern
        let regexString = options.excludeFilesPattern
            .replace('\\', '\\\\.')
            .replace('.', '\\.')
            .replace('*', '.*?');
        normalizedFiles = normalizedFiles.filter(
            fileName => !fileName.match(new RegExp(regexString, 'i'))
        );
    }

    await runWithConcurrentLimit(
        // we have to limit the concurrent executed promises because
        // otherwise we will open all the files at the same time and
        // hit the MFILE error (when we hit rlimit)
        options.maxConcurrentFenceJobs,
        normalizedFiles,
        (normalizedFile: NormalizedPath) => validateFile(normalizedFile, sourceFileProvider),
        options.progress
    );

    const result = getResult();
    // Reset the global results object so so that future runs
    // do not have the results from this run.
    resetResult();
    return result;
}
