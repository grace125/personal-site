import { ReactNode } from "react";

export default function P(props: { children: ReactNode }) {
  return <p className="text-xl leading-[1em]">{props.children}</p>
}