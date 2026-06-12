import { ReactNode } from "react";

export default function P(props: { children: ReactNode, noindent?: boolean, hangindent?: boolean }) {
  const indent = props.noindent ?? false ? "" : 
    props.hangindent ?? false ? 
      "indent-[-4ch] pl-[4ch]" : 
      "indent-[4ch]"
      ;
  return <p className={`text-xl leading-[1.4em] text-black/70 mt-4 ${indent}`}>{props.children}</p>
}