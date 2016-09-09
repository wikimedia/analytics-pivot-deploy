export interface RetryRequesterParameters<T> {
    requester: Requester.PlywoodRequester<T>;
    delay?: number;
    retry?: int;
    retryOnTimeout?: boolean;
}
export declare function retryRequesterFactory<T>(parameters: RetryRequesterParameters<T>): Requester.PlywoodRequester<T>;
