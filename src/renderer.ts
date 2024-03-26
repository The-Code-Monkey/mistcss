import {Components, Component, CssType} from './parser.js'

function renderProps(component: Component): string {
  return Object.entries({
    children: 'React.ReactNode',
    ...component.data,
  })
    .map(([key, value]) => {
      if (key === 'children') {
        return `${key}?: ${value}`
      }

      if (Array.isArray(value)) {
        return `${key}?: ${value.map((v) => `'${v}'`).join(' | ')}`
      }

      return `${key}?: boolean`
    })
    .map((line) => `  ${line}`)
    .join('\n')
}

function renderComponent(components: Components, name: string): string {
  const component = components[name]
  if (component === undefined) {
    return ''
  }
  return `type ${name}Props = {
${renderProps(component)}
} & JSX.IntrinsicElements['${component.tag}']

export function ${name}({ ${[
    'children',
    ...Object.keys(component.data),
    '...props',
  ].join(', ')} }: ${name}Props) {
  return (
    <${[
      component.tag,
      '{...props}',
      `className="${name}"`,
      ...Object.keys(component.data).map((key) => `data-${key}={${key}}`),
    ].join(' ')}>
      {children}
    </${component.tag}>
  )
}
`
}

export function render(name: string, components: Components, cssType: CssType): string {
  return `// Generated by MistCSS, do not modify
import './${name}.mist.${cssType}'

${Object.keys(components)
  .map((key) => renderComponent(components, key))
  .join('\n')
  .trim()}
`
}
