"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonExpress = exports.logger = void 0;
const winston = __importStar(require("winston"));
const express_winston_1 = __importDefault(require("express-winston"));
const express_http_context_1 = __importDefault(require("express-http-context"));
const loggerConfig = {
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.label({ label: 'client-app' }), winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }), winston.format.json(), winston.format.errors({ stack: true }), winston.format.colorize(), winston.format.simple()),
        }),
    ],
    exitOnError: false,
};
const winstonLogger = winston.createLogger(Object.assign(Object.assign({}, loggerConfig), { level: process.env.LOG_LEVEL || 'silly', silent: !process.env.LOG_LEVEL && process.env.NODE_ENV === 'test' }));
const formatMessage = (message) => {
    const requestId = express_http_context_1.default.get('request-id');
    if (typeof message === 'object') {
        return Object.assign(Object.assign({}, message), { requestId });
    }
    if (message) {
        message += requestId ? ` - requestId: ${requestId}` : '';
        return message;
    }
    return { requestId };
};
exports.logger = {
    error: ((msg, details) => winstonLogger.error(msg, formatMessage(details))),
    warn: ((msg, details) => winstonLogger.warn(msg, formatMessage(details))),
    info: ((msg, details) => winstonLogger.info(msg, formatMessage(details))),
    http: ((msg, details) => winstonLogger.http(msg, formatMessage(details))),
    verbose: ((msg, details) => winstonLogger.verbose(msg, formatMessage(details))),
    debug: ((msg, details) => winstonLogger.debug(msg, formatMessage(details))),
    silly: ((msg, details) => winstonLogger.silly(msg, formatMessage(details))),
};
const filter = (req, propName) => {
    if (propName === 'headers') {
        const res = __rest(req[propName], []);
        return res;
    }
    return req.headers;
};
exports.winstonExpress = express_winston_1.default.logger(Object.assign(Object.assign({}, loggerConfig), { requestFilter: filter }));
