import Link from "next/link";
import { ReactNode } from "react";
import { z, Z } from "@/app/lib/Z"

const urlSchema = z.url()

export default function A(props: { children: ReactNode, href: string }) {
  const isExternalUrl = Z.parse(urlSchema, props.href).isOk()
  const target = isExternalUrl ? "_blank" : undefined
  const color = isExternalUrl
    ? "text-hyperlink hover:text-hyperlink-hover visited:text-hyperlink-visited"
    : "text-hyperlink hover:text-hyperlink-hover" 
  return <Link target={target} rel="noopener noreferrer" className={`underline ${color}`} href={props.href}>{props.children}</Link>
}