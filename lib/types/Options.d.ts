import NormalizedPath from './NormalizedPath';
export default interface Options {
    project: NormalizedPath;
    rootDir: NormalizedPath[];
    ignoreExternalFences: boolean;
    partialCheckLimit: number;
    sinceGitHash?: string;
    looseRootFileDiscovery: boolean;
    maxConcurrentFenceJobs: number;
    progress: boolean;
    excludeFilesPattern?: string;
}
