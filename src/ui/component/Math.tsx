'use client';
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css';
// import MacroExpander from 'katex/src/MacroExpander.js';
import { DetailedHTMLProps, HTMLAttributes, ReactNode, RefObject, useEffect, useRef } from 'react';

// See https://katex.org/docs/options and https://katex.org/docs/supported.html
const macros = {
  "\\R": "\\mathbb{R}",
  "\\N": "\\mathbb{N}",
  "\\Z": "\\mathbb{Z}",
  "\\typecolor": "#1", //"\\textcolor{red}{#1}",
  "\\termcolor": "#1", //"\\textcolor{blue}{#1}",
  "\\type": "\\typecolor{\\text{#1}}",
  "\\term": "\\termcolor{\\text{#1}}",
  "\\is": "\\negmedspace:\\medspace",
  "\\func": "{#1} \\mathrel{\\Rarr} {#2}",
  "\\ftype": "{#1} \\mathrel{\\rarr} {#2}",
  "\\ifthenelse": "\\mathrel{\\operatorname{if}} {#1} \\mathrel{\\operatorname{then}} {#2} \\mathrel{\\operatorname{else}} {#3}",
  "\\true": "\\text{true}",
  "\\false": "\\text{false}",
  "\\str": "\\text{``#1''}",

  "\\Nat": "\\type{Nat}",
  "\\Str": "\\type{Str}",
  "\\Bool": "\\type{Bool}",
  "\\Type": "\\type{Type}"
  
  // "\\testFuncMacro": (m: MacroExpander) => "\\R",
}

export default function Math(props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  const katexTextRef: RefObject<HTMLDivElement | null> = useRef(null);
  useEffect(() => {
    if (katexTextRef.current) {
      renderMathInElement(katexTextRef.current, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
        ],
        macros,  
        throwOnError: false
      });
    }
  }, [props.children]);

  return (
    <div className='math-block text-contrast-3' ref={katexTextRef} {...props}>
      {props.children}
    </div>
  );
}