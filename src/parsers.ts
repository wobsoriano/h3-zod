import type { H3Event } from 'h3'
import { createError, getQuery, getRouterParams, readBody } from 'h3'
import { z } from 'zod'

type UnknownKeysParam = 'passthrough' | 'strict' | 'strip'

type Schema<U extends UnknownKeysParam = any> =
  | z.ZodObject<any, U>
  | z.ZodUnion<[Schema<U>, ...Schema<U>[]]>
  | z.ZodIntersection<Schema<U>, Schema<U>>
  | z.ZodDiscriminatedUnion<string, z.Primitive, z.ZodObject<any, U>>
  | z.ZodEffects<z.ZodTypeAny>

type ParsedData<T extends Schema | z.ZodRawShape> = T extends Schema
  ? z.output<T>
  : T extends z.ZodRawShape
    ? z.output<z.ZodObject<T>>
    : never

const DEFAULT_ERROR_MESSAGE = 'Bad Request'
const DEFAULT_ERROR_STATUS = 400

function createBadRequest(error: any) {
  return createError({
    statusCode: DEFAULT_ERROR_STATUS,
    statusText: DEFAULT_ERROR_MESSAGE,
    data: JSON.stringify(error),
  })
}

/**
 * Parse and validate request query from event handler. Throws an error if validation fails.
 * @param event - A H3 event object.
 * @param schema - A Zod object shape or object schema to validate.
 */
export function useValidatedQuery<T extends Schema | z.ZodRawShape>(
  event: H3Event,
  schema: T,
): Promise<ParsedData<T>> {
  try {
    const query = getQuery(event)
    const finalSchema = schema instanceof z.ZodType ? schema : z.object(schema)
    return finalSchema.parseAsync(query)
  }
  catch (error) {
    throw createBadRequest(error)
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
): Promise<SafeParsedData<T>> {
  const query = getQuery(event)
  const finalSchema = schema instanceof z.ZodType ? schema : z.object(schema)
  return finalSchema.safeParseAsync(query) as Promise<SafeParsedData<T>>
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
    return finalSchema.parseAsync(body)
  }
  catch (error) {
    throw createBadRequest(error)
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
  return finalSchema.safeParseAsync(body) as Promise<SafeParsedData<T>>
}

/**
 * Parse and validate params from event handler. Throws an error if validation fails.
 * @param event - A H3 event object.
 * @param schema - A Zod object shape or object schema to validate.
 */
export function useValidatedParams<T extends Schema | z.ZodRawShape>(
  event: H3Event,
  schema: T,
): Promise<ParsedData<T>> {
  try {
    const params = getRouterParams(event)
    const finalSchema = schema instanceof z.ZodType ? schema : z.object(schema)
    return finalSchema.parseAsync(params)
  }
  catch (error) {
    throw createBadRequest(error)
  }
}

/**
 * Parse and validate params from event handler. Doesn't throw if validation fails.
 * @param event - A H3 event object.
 * @param schema - A Zod object shape or object schema to validate.
 */
export function useSafeValidatedParams<T extends Schema | z.ZodRawShape>(
  event: H3Event,
  schema: T,
): Promise<SafeParsedData<T>> {
  const params = getRouterParams(event)
  const finalSchema = schema instanceof z.ZodType ? schema : z.object(schema)
  return finalSchema.safeParseAsync(params) as Promise<SafeParsedData<T>>
}

export {
  z,
}
