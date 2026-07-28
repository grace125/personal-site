import NextLink from "next/link";
import { ReactNode } from "react";
import { z, Z } from "@/lib/Z"

const urlSchema = z.url()

// TODO: make sure Next.js Link is never used

export default function Link(props: { children: ReactNode, href: string }) {
  const isExternalUrl = Z.parse(urlSchema, props.href).isOk()
  const target = isExternalUrl ? "_blank" : undefined
  const color = isExternalUrl
    ? "text-hyperlink hover:text-hyperlink-hover visited:text-hyperlink-visited"
    : "text-hyperlink hover:text-hyperlink-hover" 
  return <NextLink target={target} rel="noopener noreferrer" className={`underline ${color}`} href={props.href}>{props.children}</NextLink>
}