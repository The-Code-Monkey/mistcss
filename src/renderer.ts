import {Component, Components} from './parser.js'
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

  // @ts-expect-error unused variable
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const keys = Object.keys(props);
  const entries = Object.entries(props) .filter((prop) => prop[1]);

  return entries
    .map(([key, value]) => {
      const propName = camelCase(key.startsWith('--') ? key.replace('--', '') : key);
      const propType = Array.isArray(value) ? value.map((v) => `'${v}'`).join(' | ') : typeof value === "string" ? value.split(':')[0] : 'boolean';

      return `  ${propName}?: ${propType};`;
    })
    .join('\n');
}

const processVariable = <Type extends string | string[]>(key: string, component: Component): {
    propName: string;
    propValue: string;
    dataValue: Type;
} => {
  const propName = `["${key}" as string]`;
  const propValue = camelCase(key.replace('--', ''));
  let dataValue: string | string[] = component.data[key] as string | string[];

  if (typeof dataValue === 'string') {
    if (dataValue.split(',').length > 1) {
      const value = dataValue.split(',');
      for (let i = 0; i < value.length; i++) {
        if (value[i]?.includes(':')) {
          const innerValue = value[i]?.split(':')[1];
          if (innerValue) {
            const innerVariable = processVariable<string>(innerValue, component);
            value[i] = innerVariable.dataValue;
          }
        } else {
          const innerVariable = processVariable<string>(String(value[i]), component);
          value[i] = innerVariable.dataValue;
        }
      }

      dataValue = value;
    } else {
      const value = dataValue.split(':')[1];

      if (value && key !== value) {
        const innerValue = component.data[value];
        if (innerValue) {
          const innerVariable = processVariable(value, component);
          console.log(innerVariable.dataValue)
          dataValue = innerVariable.dataValue;
        }
      }
    }
  }

  return {
    propName,
    propValue,
    dataValue: dataValue as Type
  };
}

function checkArrayElements(arr: (string | string[])[]) {
  return arr.every((val: string | string[]): boolean => {
    if (Array.isArray(val)) {
      return checkArrayElements(val);
    } else {
      return val === arr[0];
    }
  });
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

  // Map function to process each variable
  const processVariables = variables.map(key => {
    const { propName, propValue, dataValue } = processVariable(key, component);


    if (Array.isArray(dataValue)) {
      const convertArray = checkArrayElements(dataValue);

      if (convertArray) {
        const val = String(Array.isArray(dataValue[0]) ? dataValue[0][0] : dataValue[0]);
        return `${propName}: ${propValue} ? \`${propValue.includes("var(--") ? propValue : `var(${val.split(':')[1]}-\${${String(propValue)}})`}\` : undefined`;
      }

      return `${propName}: ${propValue} ? ${propValue} : undefined`;
    }

    // Check if dataValue includes ':' and process accordingly
    if (dataValue?.includes(':')) {
      const processedValue = propValue.includes("var(--") ? propValue : `var(${dataValue.split(':')[1]}-\${${String(propValue)}})`;
      return `${propName}: ${propValue} ? \`${processedValue}\` : undefined`;
    } else {
      return `${propName}: ${propValue} ? ${propValue} : undefined`;
    }
  }).join(',\r\n\t\t');

// Construct the style string
const style = hasVariables ? `style={{\r\n\t\t${processVariables}\r\n\t}}` : null;

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
  const hasChildren = Object.keys(components).some(component => canElementHaveChildren(String(components[component]?.tag)));
  return `// Generated by MistCSS, do not modify
import './${name}.mist.css'
import type { JSX${hasChildren ? ", ReactNode" : "" } } from 'react'
${Object.keys(components).map((key) => renderComponent(components, key)).join('\n').trim()}
`;
}
