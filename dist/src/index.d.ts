/// <reference types="express" />
interface LoggerMethod {
    (msg: string, details?: any): void;
}
export declare const logger: {
    error: LoggerMethod;
    warn: LoggerMethod;
    info: LoggerMethod;
    http: LoggerMethod;
    verbose: LoggerMethod;
    debug: LoggerMethod;
    silly: LoggerMethod;
};
export declare const winstonExpress: import("express").Handler;
export {};
