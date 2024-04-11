const pascalCaseRegex = /(?:^|-)([a-z])/g

export function pascalCase(str: string): string {
    return str.replace(pascalCaseRegex, (_, g: string) => g.toUpperCase())
}

const camelCaseRegex = /-([a-z])/g

export function camelCase(str: string): string {
    return str.replace(camelCaseRegex, (g) => g[1]?.toUpperCase() ?? '')
}
