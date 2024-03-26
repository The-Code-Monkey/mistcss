import assert from 'node:assert'
import fs from 'node:fs'
import test from 'node:test'
import { Components, parseInput } from './parser.js'
import { render } from './renderer.js'

// CSS Fixtures
const mistCSS: string = fs.readFileSync('fixtures/css/Foo.mist.css', 'utf-8')
const mistTSX: string = fs.readFileSync('fixtures/css/Foo.mist.tsx', 'utf-8')

void test('render', () => {
  const name = 'Foo'
  const parsedInput: Components = parseInput(mistCSS)
  const actual = render(name, parsedInput, 'css')
  const expected: string = mistTSX
  if (process.env['UPDATE']) {
    console.log('Updating fixtures')
    fs.writeFileSync(`fixtures/css/${name}.mist.tsx`, render(name, parsedInput, 'css'))
  }
  assert.strictEqual(actual, expected)
})

// SCSS Fixtures
const mistSCSS: string = fs.readFileSync('fixtures/scss/Foo.mist.scss', 'utf-8')
const mistSCSSTSX: string = fs.readFileSync('fixtures/scss/Foo.mist.tsx', 'utf-8')

void test('render SCSS', () => {
  const name = 'Foo'
  const parsedInput: Components = parseInput(mistSCSS)
  const actual = render(name, parsedInput, 'scss')
  const expected: string = mistSCSSTSX
  if (process.env['UPDATE']) {
    console.log('Updating fixtures')
    fs.writeFileSync(`fixtures/scss/${name}.mist.tsx`, render(name, parsedInput, 'scss'))
  }
  assert.strictEqual(actual, expected)
})
