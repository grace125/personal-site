import Link from "next/link";
import { ReactNode } from "react";




export default function A(props: { children: ReactNode, href: string, rel?: boolean }) {
  const color = props.rel 
    ? "text-hyperlink hover:text-hyperlink-hover" 
    : "text-hyperlink hover:text-hyperlink-hover visited:text-hyperlink-visited"
  return <Link target="_blank" rel="noopener noreferrer" className={`underline ${color}`} href={props.href}>{props.children}</Link>
}