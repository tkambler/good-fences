export declare class Nominal<T extends string> {
    private nominalType;
}
declare type NormalizedPath = string & Nominal<'Path'>;
export default NormalizedPath;
