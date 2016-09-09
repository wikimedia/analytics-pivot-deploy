export interface VerboseRequesterParameters<T> {
    requester: Requester.PlywoodRequester<T>;
    printLine?: (line: string) => void;
    preQuery?: (query: any) => void;
    onSuccess?: (data: any, time: number, query: any) => void;
    onError?: (error: Error, time: number, query: any) => void;
}
export declare function verboseRequesterFactory<T>(parameters: VerboseRequesterParameters<T>): Requester.PlywoodRequester<any>;
