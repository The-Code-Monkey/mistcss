import assert from 'node:assert'
import fs from 'node:fs'
import test from 'node:test'

import {camelCase, type Components, parseInput, pascalCase} from './parser.js'

// CSS Fixtures
const mistCSS: string = fs.readFileSync('fixtures/css/Foo.mist.css', 'utf-8')

// SCSS Fixtures
const mistSCSS: string = fs.readFileSync('fixtures/scss/Foo.mist.scss', 'utf-8')

// CSS
test('toCamelCase', () => {
  const arr = ['foo', 'foo-bar', 'f', 'f-b']
  const actual = arr.map(camelCase)
  const expected = ['foo', 'fooBar', 'f', 'fB']
  assert.deepStrictEqual(actual, expected)
})

test('toPascalCase', () => {
  const arr = ['foo', 'foo-bar', 'f', 'f-b']
  const actual = arr.map(pascalCase)
  const expected = ['Foo', 'FooBar', 'F', 'FB']
  assert.deepStrictEqual(actual, expected)
})

void test('parseInput', () => {
  const actual: Components = parseInput(mistCSS)
  const expected: Components = {
    Foo: {
      tag: 'div',
      data: {
        fooSize: ['lg', 'sm'],
        x: true,
      },
    },
    Bar: {
      tag: 'span',
      data: {
        barSize: ['lg'],
        x: true,
      },
    },
    Baz: {
      tag: 'p',
      data: {},
    },
  }
  assert.deepStrictEqual(actual, expected)
})

// SCSS
void test('parseInput SCSS', () => {
  const actual: Components = parseInput(mistSCSS)
  const expected: Components = {
    Foo: {
      tag: 'div',
      data: {
        fooSize: ['lg', 'sm'],
        x: true,
      },
    },
    Bar: {
      tag: 'span',
      data: {
        barSize: ['lg'],
        x: true,
      },
    },
    Baz: {
      tag: 'p',
      data: {},
    },
  }
  assert.deepStrictEqual(actual, expected)
})
