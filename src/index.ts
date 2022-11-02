import type { EventHandler, H3Event } from 'h3'
import { createError, eventHandler, getQuery, isMethod, readBody } from 'h3'
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
  event: H3Event,
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
  event: H3Event,
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

interface RequestSchemas<
  TBody extends IOSchema,
  TQuery extends IOSchema,
> {
  body?: TBody
  query?: TQuery
}

export function withValidatedApiRoute<
  TBody extends IOSchema,
  TQuery extends IOSchema,
>(
  handler: EventHandler,
  schemas: RequestSchemas<TBody, TQuery>,
) {
  return eventHandler(async (event) => {
    const errors: Record<string, z.ZodIssue[] | null> = {
      body: null,
      query: null,
    }

    const parsedData = {
      body: null as z.infer<TBody> | null,
      query: null as z.infer<TQuery> | null,
    }

    if (schemas.query) {
      const query = getQuery(event)
      const parsed = schemas.query.safeParse(query)

      if (!parsed.success)
        errors.query = parsed.error.errors
      else
        parsedData.query = parsed.data as z.infer<TQuery>
    }

    if (schemas.body && isMethod(event, 'POST')) {
      const body = await readBody(event)
      const parsed = schemas.body.safeParse(body)

      if (!parsed.success)
        errors.body = parsed.error.errors
      else
        parsedData.body = parsed.data as z.infer<TBody>
    }

    if (errors.body || errors.query) {
      throw createError({
        statusCode: 400,
        statusMessage: JSON.stringify({
          errors,
        }),
      })
    }

    event.context.parsedData = parsedData

    return handler(event)
  })
}

export {
  z,
}
