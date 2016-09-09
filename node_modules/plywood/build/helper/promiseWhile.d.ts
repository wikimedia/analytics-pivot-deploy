/// <reference types="q" />
import * as Q from 'q';
export declare function promiseWhile(condition: () => boolean, action: () => Q.Promise<any>): Q.Promise<any>;
