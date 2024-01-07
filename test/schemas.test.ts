import { describe, expect, it } from 'vitest'
import { zh } from '../src'

describe('boolAsString', () => {
  it('parses true as string', () => {
    expect(zh.boolAsString.parse('true')).toBe(true)
  })
  it('parses false as string', () => {
    expect(zh.boolAsString.parse('false')).toBe(false)
  })
  it('throws on non-boolean string', () => {
    expect(() => zh.boolAsString.parse('hello')).toThrowError()
  })
})

describe('checkboxAsString', () => {
  it('parses "on" as boolean', () => {
    expect(zh.checkboxAsString.parse('on')).toBe(true)
  })
  it('parses undefined as boolean', () => {
    expect(zh.checkboxAsString.parse(undefined)).toBe(false)
  })
  it('throws on non-"on" string', () => {
    expect(() => zh.checkboxAsString.parse('hello')).toThrowError()
  })
})

describe('intAsString', () => {
  it('parses int as string', () => {
    expect(zh.intAsString.parse('3')).toBe(3)
  })
  it('parses int as string with leading 0', () => {
    expect(zh.intAsString.parse('03')).toBe(3)
  })
  it('parses negative int as string', () => {
    expect(zh.intAsString.parse('-3')).toBe(-3)
  })
  it('throws on int as number', () => {
    expect(() => zh.intAsString.parse(3)).toThrowError()
  })
  it('throws on float', () => {
    expect(() => zh.intAsString.parse(3.14)).toThrowError()
  })
  it('throws on string float', () => {
    expect(() => zh.intAsString.parse('3.14')).toThrowError()
  })
  it('throws on non-int string', () => {
    expect(() => zh.intAsString.parse('a3')).toThrowError()
  })
})

describe('numAsString', () => {
  it('parses number with decimal as string', () => {
    expect(zh.numAsString.parse('3.14')).toBe(3.14)
  })
  it('parses number with decimal as string with leading 0', () => {
    expect(zh.numAsString.parse('03.14')).toBe(3.14)
  })
  it('parses negative number with decimal as string', () => {
    expect(zh.numAsString.parse('-3.14')).toBe(-3.14)
  })
  it('parses int as string', () => {
    expect(zh.numAsString.parse('3')).toBe(3)
  })
  it('parses int as string with leading 0', () => {
    expect(zh.numAsString.parse('03')).toBe(3)
  })
  it('parses negative int as string', () => {
    expect(zh.numAsString.parse('-3')).toBe(-3)
  })
  it('throws on non-number string', () => {
    expect(() => zh.numAsString.parse('a3')).toThrowError()
  })
})
