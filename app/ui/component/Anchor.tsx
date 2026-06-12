import Link from "next/link";
import { ReactNode } from "react";

export default function A(props: { children: ReactNode, href: string }) {
  return <Link target="_blank" rel="noopener noreferrer" className="underline text-hyperlink hover:text-hyperlink-hover visited:text-hyperlink-visited" href={props.href}>{props.children}</Link>
}