# h3-zod

[![npm (tag)](https://img.shields.io/npm/v/h3-zod?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/h3-zod) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/h3-zod?style=flat&colorA=000000&colorB=000000) ![NPM](https://img.shields.io/npm/l/h3-zod?style=flat&colorA=000000&colorB=000000)

Validate [h3](https://github.com/unjs/h3) and Nuxt 3 requests using [zod](https://github.com/colinhacks/zod) schema's.

## Install

```bash
npm install h3-zod
```

## Usage

```ts
import {
  eventHandler,
  useValidatedBody,
  useValidatedQuery,
  withValidatedApiRoute,
  z
} from 'h3-zod'

const app = createApp()

app.use('/', eventHandler(async (event) => {
  // Validate body
  const body = await useValidatedBody(event, z.object({
    optional: z.string().optional(),
    required: z.boolean()
  }))

  // Validate query
  const query = useValidatedQuery(event, z.object({
    required: z.string()
  }))
}))

// Validate query/body
app.use('/api/login', withValidatedApiRoute(
  eventHandler(async (event) => {
    const {
      body: { email, password },
      query: { redirect }
    } = event.context.parsedData

    const user = await authenticateUser(email, password)

    if (redirect) {
      sendRedirect(event, redirect, 302)
      return
    }

    return { user }
  }),
  {
    body: z.object({
      email: z.email(),
      password: z.string(),
    }),
    query: z.object({
      redirect: z.string().optional(),
    }),
  },
))
```

with Nuxt

```ts
// ~/server/api/todo.post.ts
import { useValidatedBody, z } from 'h3-zod'

export default defineEventHandler(async (event) => {
  const body = await useValidatedBody(event, z.object({
    optional: z.string().optional(),
    required: z.boolean()
  }))
})
```

## Related

- [h3-typebox](https://github.com/kevinmarrec/h3-typebox)

## License

MIT
