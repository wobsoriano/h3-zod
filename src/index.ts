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

interface SchemaError {
  body: z.ZodIssue[] | null
  query: z.ZodIssue[] | null
}

export function defineEventHandlerWithSchema<
  TBody extends IOSchema,
  TQuery extends IOSchema,
>({
  handler,
  schema,
  errorHandler,
}: {
  handler: EventHandler
  schema: RequestSchemas<TBody, TQuery>
  errorHandler?: (error: SchemaError, event: H3Event) => void
}) {
  return eventHandler(async (event) => {
    const error: SchemaError = {
      body: null,
      query: null,
    }

    const parsedData: {
      body: z.infer<TBody> | null
      query: z.infer<TQuery> | null
    } = {
      body: null,
      query: null,
    }

    if (schema.query) {
      const query = getQuery(event)
      const parsed = schema.query.safeParse(query)

      if (!parsed.success)
        error.query = parsed.error.errors
      else
        parsedData.query = parsed.data as z.infer<TQuery>
    }

    if (schema.body && isMethod(event, 'POST')) {
      const body = await readBody(event)
      const parsed = schema.body.safeParse(body)

      if (!parsed.success)
        error.body = parsed.error.errors
      else
        parsedData.body = parsed.data as z.infer<TBody>
    }

    if (error.body || error.query) {
      if (errorHandler) {
        errorHandler(error, event)
        return
      }

      throw createError({
        statusCode: 400,
        statusMessage: JSON.stringify({
          error,
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
