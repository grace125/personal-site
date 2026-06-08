import Link from "next/link";
import { ReactNode } from "react";

export default function A(props: { children: ReactNode, href: string }) {
  return <Link target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href={props.href}>{props.children}</Link>
}