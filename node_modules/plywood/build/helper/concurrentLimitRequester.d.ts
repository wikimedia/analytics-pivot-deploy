export interface ConcurrentLimitRequesterParameters<T> {
    requester: Requester.PlywoodRequester<T>;
    concurrentLimit: int;
}
export declare function concurrentLimitRequesterFactory<T>(parameters: ConcurrentLimitRequesterParameters<T>): Requester.PlywoodRequester<T>;
