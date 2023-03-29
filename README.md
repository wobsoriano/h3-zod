# h3-zod

[![npm (tag)](https://img.shields.io/npm/v/h3-zod?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/h3-zod) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/h3-zod?style=flat&colorA=000000&colorB=000000) ![NPM](https://img.shields.io/npm/l/h3-zod?style=flat&colorA=000000&colorB=000000)

Validate [h3](https://github.com/unjs/h3) and Nuxt requests with [zod](https://github.com/colinhacks/zod).

## Install

```bash
npm install zod h3-zod
```

## Usage

Import it like:

```ts
import { zh } from 'h3-zod';

// Or

import { useSafeValidatedQuery, useSafeValidatedBody } from 'h3-zod';
```

Helpers that don't throw when parsing fails:

```ts
export default defineEventHandler(async (event) => {
  const query = zh.useSafeValidatedQuery(event, z.object({
    required: z.string()
  }))

  const body = await zh.useSafeValidatedBody(event, z.object({
    optional: z.string().optional(),
    required: z.boolean()
  }))

  const params = zh.useSafeValidatedParams(event, {
    id: z.number()
  })

  if (!params.success) {
    // params.error
  }
})
```

Helpers that throw error 400 when parsing fails:

```ts
export default defineEventHandler(async (event) => {
  const query = zh.useValidatedQuery(event, z.object({
    required: z.string()
  }))

  const body = await zh.useValidatedBody(event, z.object({
    optional: z.string().optional(),
    required: z.boolean()
  }))

  const params = await zh.useValidatedParams(event, {
    id: z.number()
  })
})
```

You can also pass an object schema:

```ts
export default defineEventHandler(async (event) => {
  const body = await zh.useValidatedBody(event, {
    optional: z.string().optional(),
    required: z.boolean()
  })
})
```

## Helper Zod Schemas

#### zh.boolAsString
- `"true"` → `true`
- `"false"` → `false`
- `"notboolean"` → throws `ZodError`

#### zh.checkboxAsString
- `"on"` → `true`
- `undefined` → `false`
- `"anythingbuton"` → throws `ZodError`

#### zh.intAsString
- `"3"` → `3`
- `"3.14"` → throws `ZodError`
- `"notanumber"` → throws `ZodError`

#### zh.numAsString
- `"3"` → `3`
- `"3.14"` → `3.14`
- `"notanumber"` → throws `ZodError`

### Usage

```ts
const Schema = z.object({
  isAdmin: zh.boolAsString,
  agreedToTerms: zh.checkboxAsString,
  age: zh.intAsString,
  cost: zh.numAsString,
});

const parsed = Schema.parse({
  isAdmin: 'true',
  agreedToTerms: 'on',
  age: '38',
  cost: '10.99'
});

console.log(parsed)
// {
//   isAdmin: true,
//   agreedToTerms: true,
//   age: 38,
//   cost: 10.99
// }
```

## Related

- [h3-typebox](https://github.com/kevinmarrec/h3-typebox)

## License

MIT
