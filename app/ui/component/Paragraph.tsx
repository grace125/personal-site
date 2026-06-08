import { ReactNode } from "react";



export default function P(props: { children: ReactNode }) {
  return <p className="text-lg">{props.children}</p>
}