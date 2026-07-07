import { ReactNode } from "react";
import Section from "../sections/Section";

export const Article = (props: { children?: ReactNode, title: ReactNode }) => {
  return <article className={`max-w-[60ch] w-auto relative mx-auto my-0 max-h-full`}>
    <Section h={props.title}>
      {props.children}
    </Section>
  </article>
}

// TODO: make this a layout
export const ProjectEntry = (props: { children?: ReactNode, title: ReactNode, description: ReactNode }) => {
  return <Article title={props.title}>
      <p className="indent-0">{props.description}</p>
      {props.children}
  </Article>
}

