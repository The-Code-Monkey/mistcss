import { Component, Components } from './parser.js'
import {camelCase} from "./utils.js";

const htmlElementCannotHaveChildren = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

const canElementHaveChildren = (tag: string): boolean => !htmlElementCannotHaveChildren.has(tag);

function renderProps(component: Component, hasChildren: boolean): string {
  const props = {
    children: hasChildren ? 'ReactNode' : null,
    ...component.data,
  };

  return Object.entries(props)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => value)
    .map(([key, value]) => {
      const propName = camelCase(key.startsWith('--') ? key.replace('--', '') : key);
      const propType = Array.isArray(value) ? value.map((v) => `'${v}'`).join(' | ') : typeof value === "string" ? value.split(':')[0] : 'boolean';
      return `  ${propName}?: ${propType};`;
    })
    .join('\n');
}

function renderComponent(components: Components, name: string): string {
  const component = components[name];
  if (!component) return '';

  const variables = Object.keys(component.data).filter(key => key.startsWith('--'));
    const hasVariables = variables.length > 0;
  const hasChildren = canElementHaveChildren(component.tag);

  const props = [
    hasChildren ? 'children' : null,
    ...Object.keys(component.data).map(key => camelCase(key.startsWith('--') ? key.replace('--', '') : key)),
    '...props',
  ].filter(prop => prop !== null).join(', ');

  const style = hasVariables ? `style={{
        ${variables.map(key => (component.data[key] as string)?.includes(':') ?
      `["${key}" as string]: \`\${${camelCase(key.replace('--', ''))}?.includes("var(--") ? \`\${${camelCase(key.replace('--', ''))}}\` : \`${(component.data[key] as string).split(':')[1]}-\${String(${camelCase(key.replace('--', ''))})}\`}\``
      : `["${key}" as string]: \`\${${camelCase(key.replace('--', ''))}}\``).join(',\r\n\t\t')}
      }}` : null;

  const tagProps = [
    component.tag,
    '{...props}',
    `className="${component.className}"`,
    ...Object.keys(component.data).filter(key => !key.startsWith('--')).map((key) => `data-${key}={${key}}`),
    style,
  ].filter(item => item !== null).join("\r\n\t  ");

  const children = hasChildren ? `>
      {children}
    </${component.tag}>` : '/>';

  return `type ${name}Props = {
${renderProps(component, hasChildren)}
} & JSX.IntrinsicElements['${component.tag}']

export function ${name}({ ${props} }: ${name}Props) {
  return (
    <${tagProps}
    ${children}
  )
}
`;
}

export function render(name: string, components: Components): string {
  return `// Generated by MistCSS, do not modify
import './${name}.mist.css'
import type { JSX, ReactNode } from 'react'
${Object.keys(components).map((key) => renderComponent(components, key)).join('\n').trim()}
`;
}
