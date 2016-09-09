/// <reference types="q" />
import * as Q from 'q';
import { Expression } from "../expressions/baseExpression";
import { PlywoodValue, Datum } from "../datatypes/index";
import { Environment } from "../actions/baseAction";
export interface Executor {
    (ex: Expression, env?: Environment): Q.Promise<PlywoodValue>;
}
export interface BasicExecutorParameters {
    datasets: Datum;
}
export declare function basicExecutorFactory(parameters: BasicExecutorParameters): Executor;
