import Config from '../types/config/Config';
import RawExportRule from '../types/rawConfig/RawExportRule';
import ConfigSet from '../types/ConfigSet';
import ExportRule from '../types/config/ExportRule';
import NormalizedPath from '../types/NormalizedPath';
export declare function loadConfigFromString(configPath: NormalizedPath, fileContent: string): Config | null;
export default function loadConfig(file: string, configSet: ConfigSet): void;
export declare function normalizeExportRules(rules: RawExportRule[]): ExportRule[] | null;
