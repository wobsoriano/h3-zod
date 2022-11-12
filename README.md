# h3-zod

[![npm (tag)](https://img.shields.io/npm/v/h3-zod?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/h3-zod) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/h3-zod?style=flat&colorA=000000&colorB=000000) ![NPM](https://img.shields.io/npm/l/h3-zod?style=flat&colorA=000000&colorB=000000)

Validate [h3](https://github.com/unjs/h3) and Nuxt 3 requests with [zod](https://github.com/colinhacks/zod).

## Install

```bash
npm install h3-zod
```

## Usage

Helpers that don't throw when parsing fails:

```ts
import { useSafeValidatedBody, useSafeValidatedQuery, z } from 'h3-zod'

export default defineEventHandler(async (event) => {
  const query = useSafeValidatedQuery(event, z.object({
    required: z.string()
  }))

  const body = await useSafeValidatedBody(event, z.object({
    optional: z.string().optional(),
    required: z.boolean()
  }))
})
```

Helpers that throw 400 error when parsing fails:

```ts
import { useValidatedBody, useValidatedQuery, z } from 'h3-zod'

export default defineEventHandler(async (event) => {
  const query = useValidatedQuery(event, z.object({
    required: z.string()
  }))

  const body = await useValidatedBody(event, z.object({
    optional: z.string().optional(),
    required: z.boolean()
  }))
})
```

You can also pass an object schema:

```ts
export default defineEventHandler(async (event) => {
  const body = await useValidatedBody(event, {
    optional: z.string().optional(),
    required: z.boolean()
  })
})
```

## Related

- [h3-typebox](https://github.com/kevinmarrec/h3-typebox)

## License

MIT
