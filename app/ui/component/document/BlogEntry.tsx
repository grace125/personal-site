import { ReactNode } from "react";
import Section from "../sections/Section";

// TODO: make this a layout
export default function BlogEntry(props: { children: ReactNode, author: string, date: Date, title: ReactNode }) {
  return <article className={`max-w-[60ch] w-auto relative mx-auto my-0 max-h-full overflow-y-visible`}>
    <Section h={props.title}>
      {props.children}
    </Section>
  </article>
}