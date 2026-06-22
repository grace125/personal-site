import { ReactNode } from "react";

export default function P(props: { children: ReactNode, noindent?: boolean, hang?: boolean }) {
  const indent = props.noindent ?? false ? "" : 
    props.hang ?? false ? 
      "indent-[-4ch] pl-[4ch]" : 
      "indent-[4ch]"
      ;
  return <p className={`text-xl leading-[1.4em] text-contrast-3 mt-4 ${indent}`}>{props.children}</p>
}