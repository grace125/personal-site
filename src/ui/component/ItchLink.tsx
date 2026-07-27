import { ReactNode } from "react";

export default function ItchLink(props: { children?: ReactNode, id: string }) {
  return <iframe src={`https://itch.io/embed/${props.id}`} width="100%" height="167" className="my-6 border-2 bg-white border-dashed rounded-md"/>
}