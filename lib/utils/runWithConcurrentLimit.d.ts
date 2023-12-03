export declare function runWithConcurrentLimit<I>(maxBatchSize: number, inputs: I[], cb: (input: I) => Promise<void>, progress: boolean): Promise<void>;
