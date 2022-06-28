# h3-zod

[![npm (tag)](https://img.shields.io/npm/v/h3-zod?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/h3-zod) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/h3-zod?style=flat&colorA=000000&colorB=000000) ![NPM](https://img.shields.io/npm/l/h3-zod?style=flat&colorA=000000&colorB=000000)

Validate [h3](https://github.com/unjs/h3) requests using [zod](https://github.com/colinhacks/zod) schema's.

## Install

```bash
pnpm add h3-zod
```

## Usage

```ts
import { createServer } from 'http'
import { createApp } from 'h3'
import { useValidatedBody, useValidatedQuery, z } from 'h3-zod'

const app = createApp()

```

## License

MIT
