import type { CompatibilityEvent } from 'h3'
import { createError, getQuery, readBody } from 'h3'
import { z } from 'zod'

// copy of the private Zod utility type of ZodObject
type UnknownKeysParam = 'passthrough' | 'strict' | 'strip'

type Refined<T extends z.ZodType> = T extends z.ZodType<infer O>
  ? z.ZodEffects<T, O, O>
  : never

/**
 * @desc The type allowed on the top level of Middlewares and Endpoints
 * @param U — only "strip" is allowed for Middlewares due to intersection issue (Zod) #600
 * */
export type IOSchema<U extends UnknownKeysParam = any> =
  | z.ZodObject<any, U>
  | z.ZodUnion<[IOSchema<U>, ...IOSchema<U>[]]>
  | z.ZodIntersection<IOSchema<U>, IOSchema<U>>
  | z.ZodDiscriminatedUnion<string, z.Primitive, z.ZodObject<any, U>>
  | Refined<z.ZodObject<any, U>>

export function useValidatedQuery<T extends IOSchema>(
  event: CompatibilityEvent,
  schema: T,
) {
  const query = getQuery(event)
  const parsed = schema.safeParse(query)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: JSON.stringify({
        errors: parsed.error.errors,
      }),
    })
  }

  return parsed.data as z.infer<T>
}

export async function useValidatedBody<T extends IOSchema>(
  event: CompatibilityEvent,
  schema: T,
) {
  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: JSON.stringify({
        errors: parsed.error.errors,
      }),
    })
  }

  return parsed.data as z.infer<T>
}

export {
  z,
}
