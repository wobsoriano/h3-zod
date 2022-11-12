# h3-zod

[![npm (tag)](https://img.shields.io/npm/v/h3-zod?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/h3-zod) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/h3-zod?style=flat&colorA=000000&colorB=000000) ![NPM](https://img.shields.io/npm/l/h3-zod?style=flat&colorA=000000&colorB=000000)

Validate [h3](https://github.com/unjs/h3) and Nuxt 3 requests using [zod](https://github.com/colinhacks/zod) schema's.

## Install

```bash
npm install h3-zod
```

## Usage

```ts
import { useSafeValidatedBody, useSafeValidatedQuery, useValidatedBody, useValidatedQuery, z } from 'h3-zod'

export default defineEventHandler(async (event) => {
  // Validate query. Throws 400 error.
  const query = useValidatedQuery(event, z.object({
    required: z.string()
  }))

  // Validate query. Doesn't throw.
  const query = useSafeValidatedQuery(event, z.object({
    required: z.string()
  }))

  // Validate body. Throws 400 error.
  const body = await useValidatedBody(event, z.object({
    optional: z.string().optional(),
    required: z.boolean()
  }))

  // Validate body. Doesn't throw.
  const body = await useSafeValidatedBody(event, z.object({
    optional: z.string().optional(),
    required: z.boolean()
  }))
})
```

## Related

- [h3-typebox](https://github.com/kevinmarrec/h3-typebox)

## License

MIT
