import { ReactNode } from "react";
import Section from "../sections/Section";

export const Article = (props: { children?: ReactNode, title: ReactNode, className?: string }) => {
  return <article className={`p-8 rounded-xl relative ${props.className}`}>
    <Section h={props.title}>
      {props.children}
    </Section>
  </article>
}

// TODO: make this a layout
export const ProjectEntry = (props: { children?: ReactNode, title: ReactNode, description: ReactNode, className?: string }) => {
  return <Article title={props.title} className={props.className}>
      <p className="indent-0">{props.description}</p>
      {props.children}
  </Article>
}

