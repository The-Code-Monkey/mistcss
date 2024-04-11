// Generated by MistCSS, do not modify
import './Foo.mist.css'
import type { JSX, ReactNode from 'react'
type FooProps = {
  children?: ReactNode;
  background?: string;
  padding?: string;
  bgColor?: string;
  border?: string;
  testTest?: string;
  fooSize?: 'lg' | 'sm';
  x?: boolean;
} & JSX.IntrinsicElements['div']

export function Foo({ children, background, padding, bgColor, border, testTest, fooSize, x, ...props }: FooProps) {
  return (
    <div
	  {...props}
	  className="foo"
	  data-fooSize={fooSize}
	  data-x={x}
	  style={{
		["--background" as string]: background ? `var(--color-${background})` : undefined,
		["--padding" as string]: padding ? `var(--spacing-${padding})` : undefined,
		["--bg-color" as string]: bgColor ? `var(--radius-${bgColor})` : undefined,
		["--border" as string]: border ? border : undefined,
		["--test-test" as string]: testTest ? testTest : undefined
	}}
    >
      {children}
    </div>
  )
}

type BarProps = {
  children?: ReactNode;
  barSize?: 'lg';
  x?: boolean;
} & JSX.IntrinsicElements['span']

export function Bar({ children, barSize, x, ...props }: BarProps) {
  return (
    <span
	  {...props}
	  className="bar"
	  data-barSize={barSize}
	  data-x={x}
    >
      {children}
    </span>
  )
}

type BazProps = {
  children?: ReactNode;
} & JSX.IntrinsicElements['p']

export function Baz({ children, ...props }: BazProps) {
  return (
    <p
	  {...props}
	  className="baz"
    >
      {children}
    </p>
  )
}
