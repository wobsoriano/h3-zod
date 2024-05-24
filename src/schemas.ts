// Original code by https://github.com/rileytomasek/zodix/blob/master/src/schemas.ts
import { z } from 'zod'

/**
 * Zod schema to parse strings that are booleans.
 * Use to parse <input type="hidden" value="true" /> values.
 * @example
 * ```ts
 * boolAsString.parse('true') -> true
 * ```
 */
export const boolAsString = z
  .string()
  .regex(/^(true|false)$/, 'Must be a boolean string ("true" or "false")')
  .transform(value => value === 'true')

/**
 * Zod schema to parse checkbox formdata.
 * Use to parse <input type="checkbox" /> values.
 * @example
 * ```ts
 * checkboxAsString.parse('on') -> true
 * checkboxAsString.parse(undefined) -> false
 * ```
 */
export const checkboxAsString = z
  .literal('on')
  .optional()
  .transform(value => value === 'on')

/**
 * Zod schema to parse strings that are integers.
 * Use to parse  <input type="number" /> values.
 * @example
 * ```ts
 * intAsString.parse('3') -> 3
 * ```
 */
export const intAsString = z
  .string()
  .regex(/^-?\d+$/, 'Must be an integer string')
  .transform(val => Number.parseInt(val, 10))

/**
 * Zod schema to parse strings that are numbers.
 * Use to parse <input type="number" step="0.1" /> values.
 * @example
 * ```ts
 * numAsString.parse('3.14') -> 3.14
 * ```
 */
export const numAsString = z
  .string()
  .regex(/^-?(?:\d+(?:\.\d+)?|\.\d+)$/, 'Must be a number string')
  .transform(Number)
