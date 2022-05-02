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

```javascript
import { logger } from "@webdevadammalej/express-logger";

logger.info("It is simple info log");
logger.error("It is simple error log");
logger.warn("It is simple warn log");
```

## Description

This logger add to each request requestId (if not already exists), thanks to this, we are able to analyze each request and step by step find potential problem.
