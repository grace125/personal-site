import { ReactNode } from "react";

export default function P(props: { children: ReactNode }) {
  return <p className="text-2xl lg:text-xl leading-[1em]">{props.children}</p>
}