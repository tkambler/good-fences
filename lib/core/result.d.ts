import Config from '../types/config/Config';
import GoodFencesResult from '../types/GoodFencesResult';
import ImportRecord from './ImportRecord';
export declare function resetResult(): void;
export declare function getResult(): GoodFencesResult;
export declare function reportViolation(message: string, sourceFile: string, importRecord: ImportRecord, config: Config): void;
export declare function reportConfigError(message: string, configPath: string): void;
export declare function reportWarning(message: string, configPath?: string): void;
