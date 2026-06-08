import { ReactNode } from "react";

// TODO: scale contents of iframe: https://stackoverflow.com/questions/166160/how-can-i-scale-the-content-of-an-iframe/2224816#2224816

export default function ItchEmbed(props: { children?: ReactNode, src: string, allowFullScreen: boolean, width?: string, height?: string }) {
  return <iframe src={props.src} allowFullScreen={props.allowFullScreen} width={props.width ?? "1280" } height={props.height ?? "740"} >{props.children}</iframe>
}