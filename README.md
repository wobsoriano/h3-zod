# h3-zod

[![npm (tag)](https://img.shields.io/npm/v/h3-zod?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/h3-zod) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/h3-zod?style=flat&colorA=000000&colorB=000000) ![NPM](https://img.shields.io/npm/l/h3-zod?style=flat&colorA=000000&colorB=000000)

Validate [h3](https://github.com/unjs/h3) and Nuxt 3 requests using [zod](https://github.com/colinhacks/zod) schema's.

## Install

```bash
npm install h3-zod
```

## Usage

```ts
import { useValidatedBody, useValidatedQuery, z } from 'h3-zod'

export default defineEventHandler(async (event) => {
  // Validate body
  const body = await useValidatedBody(event, z.object({
    optional: z.string().optional(),
    required: z.boolean()
  }))

  // Validate query
  const query = useValidatedQuery(event, z.object({
    required: z.string()
  }))
})
```

with event handler wrapper (fastify like routes)

```ts
import { defineEventHandlerWithSchema, z } from 'h3-zod'

export default defineEventHandlerWithSchema({
  async handler(event) {
    // event.context.parsedData contains the parsed data from schema
    return { parsed: event.context.parsedData }
  },
  schema: {
    body: z.object({
      optional: z.string().optional(),
      required: z.boolean()
    }),
    query: z.object({
      required: z.string()
    })
  },
})
```

All of these functions throw an H3Error instance when parsing fails. You can use the optional `errorHandler` argument to override the error messages.

## Related

- [h3-typebox](https://github.com/kevinmarrec/h3-typebox)

## License

MIT
