import { ReactNode } from "react";

export default function BlogEntry(props: { children: ReactNode }) {
  return <article className={`p-x-[3rem] p-y-[1.5rem] max-w-160 w-auto relative mx-auto my-0 space-y-4`}>{props.children}</article>
}