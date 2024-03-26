import fs from 'node:fs'
import path from 'node:path'
import {CssType, parseInput} from './parser.js'
import { render } from './renderer.js'

function getStyleFileExtention(filename: string) {
  return filename.split('.').pop() as CssType
}

export function genToMistFilename(genFilename: string) {
  return genFilename.replace(/\.tsx$/, '.css')
}

export function mistToGenFilename(mistFilename: string) {
  const cssType = getStyleFileExtention(mistFilename);
  return mistFilename.replace(new RegExp(`.${cssType}$`), '.tsx')
}

function createFile(filename: string) {
  const cssType = getStyleFileExtention(filename);
  let data = fs.readFileSync(filename, 'utf8')
  const parsedInput = parseInput(data)

  const name = path.basename(filename, `.mist.${cssType}`)
  data = render(name, parsedInput, cssType)

  fs.writeFileSync(filename.replace(`.${cssType}`, '.tsx'), data)
}

export function safeCreateFile(mistFilename: string) {
  try {
    createFile(mistFilename)
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Error ${mistFilename}: ${e.message}`)
    } else {
      console.error(`Error ${mistFilename}`)
      console.error(e)
    }
  }
}
