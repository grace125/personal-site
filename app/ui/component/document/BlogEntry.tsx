import { ReactNode } from "react";

export default function BlogEntry(props: { children: ReactNode, author: string, date: Date, title: ReactNode }) {
  return <article className={`max-w-[60ch] w-auto relative mx-auto my-0 space-y-4 max-h-full overflow-y-visible`}>
    <h1 className="text-6xl leading-[0.9em]">{props.title}</h1>
    {props.children}
  </article>
}