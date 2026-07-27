import { ReactNode } from "react";

export default function P(props: { children: ReactNode, noindent?: boolean, hang?: boolean, className?: string }) {
  const indent = props.noindent ?? false ? "" : 
    props.hang ?? false ? 
      "indent-[-4ch] pl-[4ch]" : 
      "indent-[4ch]";
  return <p className={`${indent}`}>{props.children}</p>
}