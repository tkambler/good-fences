import NormalizedPath from '../types/NormalizedPath';
import ImportRecord from '../core/ImportRecord';
import { SourceFileProvider } from '../core/SourceFileProvider';
export default function getImportsFromFile(sourceFilePath: NormalizedPath, sourceFileProvider: SourceFileProvider): Promise<ImportRecord[]>;
