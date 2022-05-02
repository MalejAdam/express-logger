# Express Logger

## Installation

npm

```bash
npm install @webdevadammalej/express-logger
```

yarn

```bash
yarn add @webdevadammalej/express-logger
```

## Usage

```typescript
import { logger } from "@webdevadammalej/express-logger";

logger.info("It is simple info log");
logger.error("It is simple error log");
logger.warn("It is simple warn log");
```

## Description

This logger add to each request requestId (if not already exists), thanks to this, we are able to analyze each request and step by step find potential problem. To see the request id in logs you should install [express-http-context](https://www.npmjs.com/package/express-http-context), [uuid](https://www.npmjs.com/package/uuid) and create middleware like below:

```typescript
import express, { NextFunction, Request, Response } from "express";
import httpContext from "express-http-context";
import { v4 } from "uuid";

const router = express.Router();

export const requestId = router.use(
  (req: Request, res: Response, next: NextFunction) => {
    httpContext.set("request-id", v4());
    next();
  }
);
```

This middleware add to each log request-id parameter and print something like this

```bash
error: It is simple error log {"label":"client-app","requestId":"8cdb8011-571a-4b6d-91be-4c54cc57637a","timestamp":"2022-05-02 17:34:56"}
```
