import { describe, expect, test } from 'vitest'
import { zh } from '../src'

describe('boolAsString', () => {
  test('parses true as string', () => {
    expect(zh.boolAsString.parse('true')).toBe(true)
  })
  test('parses false as string', () => {
    expect(zh.boolAsString.parse('false')).toBe(false)
  })
  test('throws on non-boolean string', () => {
    expect(() => zh.boolAsString.parse('hello')).toThrowError()
  })
})

describe('checkboxAsString', () => {
  test('parses "on" as boolean', () => {
    expect(zh.checkboxAsString.parse('on')).toBe(true)
  })
  test('parses undefined as boolean', () => {
    expect(zh.checkboxAsString.parse(undefined)).toBe(false)
  })
  test('throws on non-"on" string', () => {
    expect(() => zh.checkboxAsString.parse('hello')).toThrowError()
  })
})

describe('intAsString', () => {
  test('parses int as string', () => {
    expect(zh.intAsString.parse('3')).toBe(3)
  })
  test('parses int as string with leading 0', () => {
    expect(zh.intAsString.parse('03')).toBe(3)
  })
  test('parses negative int as string', () => {
    expect(zh.intAsString.parse('-3')).toBe(-3)
  })
  test('throws on int as number', () => {
    expect(() => zh.intAsString.parse(3)).toThrowError()
  })
  test('throws on float', () => {
    expect(() => zh.intAsString.parse(3.14)).toThrowError()
  })
  test('throws on string float', () => {
    expect(() => zh.intAsString.parse('3.14')).toThrowError()
  })
  test('throws on non-int string', () => {
    expect(() => zh.intAsString.parse('a3')).toThrowError()
  })
})

describe('numAsString', () => {
  test('parses number with decimal as string', () => {
    expect(zh.numAsString.parse('3.14')).toBe(3.14)
  })
  test('parses number with decimal as string with leading 0', () => {
    expect(zh.numAsString.parse('03.14')).toBe(3.14)
  })
  test('parses negative number with decimal as string', () => {
    expect(zh.numAsString.parse('-3.14')).toBe(-3.14)
  })
  test('parses int as string', () => {
    expect(zh.numAsString.parse('3')).toBe(3)
  })
  test('parses int as string with leading 0', () => {
    expect(zh.numAsString.parse('03')).toBe(3)
  })
  test('parses negative int as string', () => {
    expect(zh.numAsString.parse('-3')).toBe(-3)
  })
  test('throws on non-number string', () => {
    expect(() => zh.numAsString.parse('a3')).toThrowError()
  })
})
