import type { H3Event } from 'h3'
import { createError, getQuery, readBody } from 'h3'
import { z } from 'zod'

type UnknownKeysParam = 'passthrough' | 'strict' | 'strip'

type Refined<T extends z.ZodType> = T extends z.ZodType<infer O>
  ? z.ZodEffects<T, O, O>
  : never

type Schema<U extends UnknownKeysParam = any> =
  | z.ZodObject<any, U>
  | z.ZodUnion<[Schema<U>, ...Schema<U>[]]>
  | z.ZodIntersection<Schema<U>, Schema<U>>
  | z.ZodDiscriminatedUnion<string, z.Primitive, z.ZodObject<any, U>>
  | Refined<z.ZodObject<any, U>>

type ParsedData<T extends Schema | z.ZodRawShape> = T extends Schema
  ? z.output<T>
  : T extends z.ZodRawShape
    ? z.output<z.ZodObject<T>>
    : never

const DEFAULT_ERROR_MESSAGE = 'Bad Request'
const DEFAULT_ERROR_STATUS = 400

/**
 * Parse and validate request query from event handler. Throws an error if validation fails.
 * @param event - A H3 event object.
 * @param schema - A Zod object shape or object schema to validate.
 */
export function useValidatedQuery<T extends Schema | z.ZodRawShape>(
  event: H3Event,
  schema: T,
): ParsedData<T> {
  try {
    const query = getQuery(event)
    const finalSchema = schema instanceof z.ZodType ? schema : z.object(schema)
    return finalSchema.parse(query)
  }
  catch (error) {
    throw createError({
      statusCode: DEFAULT_ERROR_STATUS,
      statusText: DEFAULT_ERROR_MESSAGE,
      data: JSON.stringify({
        errors: error as any,
      }),
    })
  }
}

type SafeParsedData<T extends Schema | z.ZodRawShape> = T extends Schema
  ? z.SafeParseReturnType<T, ParsedData<T>>
  : T extends z.ZodRawShape
    ? z.SafeParseReturnType<z.ZodObject<T>, ParsedData<T>>
    : never

/**
 * Parse and validate query from event handler. Doesn't throw if validation fails.
 * @param event - A H3 event object.
 * @param schema - A Zod object shape or object schema to validate.
 */
export function useSafeValidatedQuery<T extends Schema | z.ZodRawShape>(
  event: H3Event,
  schema: T,
): SafeParsedData<T> {
  const query = getQuery(event)
  const finalSchema = schema instanceof z.ZodType ? schema : z.object(schema)
  return finalSchema.safeParse(query) as SafeParsedData<T>
}

/**
 * Parse and validate request body from event handler. Throws an error if validation fails.
 * @param event - A H3 event object.
 * @param schema - A Zod object shape or object schema to validate.
 */
export async function useValidatedBody<T extends Schema | z.ZodRawShape>(
  event: H3Event,
  schema: T,
): Promise<ParsedData<T>> {
  try {
    const body = await readBody(event)
    const finalSchema = schema instanceof z.ZodType ? schema : z.object(schema)
    return finalSchema.parse(body)
  }
  catch (error) {
    throw createError({
      statusCode: DEFAULT_ERROR_STATUS,
      statusText: DEFAULT_ERROR_MESSAGE,
      data: JSON.stringify({
        errors: error as any,
      }),
    })
  }
}

/**
 * Parse and validate request body from event handler. Doesn't throw if validation fails.
 * @param event - A H3 event object.
 * @param schema - A Zod object shape or object schema to validate.
 */
export async function useSafeValidatedBody<T extends Schema | z.ZodRawShape>(
  event: H3Event,
  schema: T,
): Promise<SafeParsedData<T>> {
  const body = await readBody(event)
  const finalSchema = schema instanceof z.ZodType ? schema : z.object(schema)
  return finalSchema.safeParse(body) as SafeParsedData<T>
}

export {
  z,
}
