import type { CompatibilityEvent } from 'h3'
import { createError, useBody, useQuery } from 'h3'
import { z } from 'zod'

// copy of the private Zod utility type of ZodObject
type UnknownKeysParam = 'passthrough' | 'strict' | 'strip'

type TQuery<U extends UnknownKeysParam = any> =
  | z.ZodObject<any, U>
  | z.ZodUnion<[TQuery<U>, ...TQuery<U>[]]>
  | z.ZodIntersection<TQuery<U>, TQuery<U>>
  | z.ZodDiscriminatedUnion<string, z.Primitive, z.ZodObject<any, U>>

export function useValidatedQuery<T extends TQuery>(
  event: CompatibilityEvent,
  schema: T,
) {
  const query = useQuery(event)
  const parsed = schema.safeParse(query)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: JSON.stringify(parsed.error.errors),
    })
  }

  return parsed.data as z.infer<T>
}

export async function useValidatedBody<T extends TQuery>(
  event: CompatibilityEvent,
  schema: T,
) {
  const body = await useBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: JSON.stringify(parsed.error.errors),
    })
  }

  return parsed.data as z.infer<T>
}

export {
  z,
}
