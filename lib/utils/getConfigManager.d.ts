import ConfigSet from '../types/ConfigSet';
import NormalizedPath from '../types/NormalizedPath';
declare class ConfigManager {
    private fullConfigSet;
    private partialDiscoveredConfigs;
    private discoveredPaths;
    getAllConfigs(): ConfigSet;
    getPartialConfigSetForPath(configSourcePath: NormalizedPath): ConfigSet;
    private _getAllConfigs;
}
export default function getConfigManager(): ConfigManager;
export {};
