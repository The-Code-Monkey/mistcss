import assert from 'node:assert'
import fs from 'node:fs'
import test from 'node:test'

import { type Components, parseInput} from './parser.js'
import {camelCase, pascalCase} from "./utils.js";

// Fixtures
const mistCSS: string = fs.readFileSync('fixtures/Foo.mist.css', 'utf-8')

void test('toCamelCase', () => {
  const arr = ['foo', 'foo-bar', 'f', 'f-b']
  const actual = arr.map(camelCase)
  const expected = ['foo', 'fooBar', 'f', 'fB']
  assert.deepStrictEqual(actual, expected)
})

void test('toPascalCase', () => {
  const arr = ['foo', 'foo-bar', 'f', 'f-b']
  const actual = arr.map(pascalCase)
  const expected = ['Foo', 'FooBar', 'F', 'FB']
  assert.deepStrictEqual(actual, expected)
})

void test('parseInput', () => {
  const actual: Components = parseInput(mistCSS)
  const expected: Components = {
    Foo: {
      className: 'foo',
      tag: 'div',
      data: {
        '--background': 'string:--color',
        '--border': 'string',
        '--padding': 'string:--spacing',
        '--test': 'string',
        fooSize: ['lg', 'sm'],
        x: true,
      },
    },
    Bar: {
      className: 'bar',
      tag: 'span',
      data: {
        barSize: ['lg'],
        x: true,
      },
    },
    Baz: {
      className: 'baz',
      tag: 'p',
      data: {},
    },
  }
  assert.deepStrictEqual(actual, expected)
})
