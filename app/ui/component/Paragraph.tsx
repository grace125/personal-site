import { ReactNode } from "react";

export default function P(props: { children: ReactNode }) {
  return <p className="text-xl lg:text-lg leading-[1em]">{props.children}</p>
}